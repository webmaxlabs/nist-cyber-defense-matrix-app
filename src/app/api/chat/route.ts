import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runAgentLoop } from '@/lib/ai/agent-loop'
import type { ConversationMessage } from '@/lib/ai/providers/types'
import type { ChatProposal } from '@/lib/supabase/types'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/utils/rate-limiter'
import { logSecurityEvent } from '@/lib/utils/security-logger'

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean) as string[]

function isOriginAllowed(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  // Allow same-origin requests (no Origin header) and allowed origins
  if (!origin) return true
  return ALLOWED_ORIGINS.some((allowed) => origin === allowed)
}

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(50000),
  })).min(1).max(200),
  conversationId: z.string().uuid().nullable().optional().default(null),
  projectIds: z.array(z.string().uuid()).max(10).optional().default([]),
})

export async function POST(request: NextRequest) {
  // CORS origin validation
  if (!isOriginAllowed(request)) {
    logSecurityEvent({
      type: 'cors_violation',
      message: 'Rejected request from disallowed origin',
      ip: request.headers.get('x-forwarded-for') || undefined,
      path: '/api/chat',
      metadata: { origin: request.headers.get('origin') },
    })
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Rate limit: 20 requests per minute per user
  const rateLimit = checkRateLimit(`chat:${user.id}`)
  if (!rateLimit.allowed) {
    logSecurityEvent({
      type: 'rate_limit_exceeded',
      message: 'Chat rate limit exceeded',
      userId: user.id,
      path: '/api/chat',
    })
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(rateLimit.retryAfter),
      },
    })
  }

  const body = await request.json()
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { messages, conversationId, projectIds } = parsed.data

  // Verify user has access to requested projects
  let validatedProjectIds = projectIds
  if (projectIds.length > 0) {
    const { data: accessibleProjects } = await supabase
      .from('projects')
      .select('id')
      .in('id', projectIds)
    const accessibleIds = new Set((accessibleProjects || []).map((p) => p.id))
    validatedProjectIds = projectIds.filter((id) => accessibleIds.has(id))
  }

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
          projectIds: validatedProjectIds,
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
                projectIds: validatedProjectIds,
                userMessage: [...messages].reverse().find((m) => m.role === 'user')?.content || '',
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
        console.error('Chat stream error:', err)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'An unexpected error occurred. Please try again.' })}\n\n`)
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
