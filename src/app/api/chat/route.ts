import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runAgentLoop } from '@/lib/ai/agent-loop'
import type { ConversationMessage } from '@/lib/ai/providers/types'
import type { ChatProposal } from '@/lib/supabase/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await request.json()
  const {
    messages,
    conversationId,
    projectIds = [],
  }: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
    conversationId: string | null
    projectIds: string[]
  } = body

  // Convert to ConversationMessage format
  const agentMessages: ConversationMessage[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  const encoder = new TextEncoder()
  const proposals: ChatProposal[] = []
  let fullText = ''

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of runAgentLoop({
          messages: agentMessages,
          projectIds,
        })) {
          if (event.type === 'text') {
            fullText += event.content
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'text', content: event.content })}\n\n`)
            )
          } else if (event.type === 'proposal') {
            proposals.push(event.proposal)
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'proposal', proposal: event.proposal })}\n\n`)
            )
          } else if (event.type === 'error') {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'error', message: event.message })}\n\n`)
            )
          } else if (event.type === 'done') {
            // Save messages to database
            let savedConvId = conversationId
            try {
              savedConvId = await saveMessages(supabase, {
                conversationId,
                userId: user.id,
                projectIds,
                userMessage: messages[messages.length - 1]?.content || '',
                assistantMessage: fullText,
                proposals: proposals.length > 0 ? proposals : null,
              })
            } catch (err) {
              console.error('Failed to save messages:', err)
            }

            // Send done event with conversation ID
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'done', conversationId: savedConvId })}\n\n`)
            )
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', message: (err as Error).message })}\n\n`)
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

async function saveMessages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  params: {
    conversationId: string | null
    userId: string
    projectIds: string[]
    userMessage: string
    assistantMessage: string
    proposals: ChatProposal[] | null
  }
): Promise<string> {
  let convId: string = params.conversationId ?? ''

  // Create conversation if needed
  if (!convId) {
    const { data: conv, error } = await supabase
      .from('chat_conversations')
      .insert({ user_id: params.userId })
      .select()
      .single()

    if (error) throw error
    convId = conv.id

    // Link projects
    if (params.projectIds.length > 0) {
      await supabase.from('chat_conversation_projects').insert(
        params.projectIds.map((pid) => ({
          conversation_id: convId,
          project_id: pid,
        }))
      )
    }
  }

  // Save user message
  await supabase.from('chat_messages').insert({
    conversation_id: convId,
    role: 'user',
    content: params.userMessage,
  })

  // Save assistant message with proposals
  await supabase.from('chat_messages').insert({
    conversation_id: convId,
    role: 'assistant',
    content: params.assistantMessage,
    proposals: params.proposals,
  })

  return convId
}
