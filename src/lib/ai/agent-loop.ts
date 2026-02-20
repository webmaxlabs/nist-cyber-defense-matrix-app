import { getProvider } from './providers'
import type { ConversationMessage, ToolCall } from './providers/types'
import { ALL_TOOLS, WRITE_TOOL_NAMES } from './tools/definitions'
import { executeReadTool } from './tools/read-tools'
import { buildWriteProposal } from './tools/write-tools'
import { buildSystemPrompt } from './context-builder'
import type { ChatProposal } from '@/lib/supabase/types'

const MAX_TOOL_ROUNDS = 10

export type StreamEvent =
  | { type: 'text'; content: string }
  | { type: 'proposal'; proposal: ChatProposal }
  | { type: 'done' }
  | { type: 'error'; message: string }

export async function* runAgentLoop(params: {
  messages: ConversationMessage[]
  projectIds: string[]
}): AsyncGenerator<StreamEvent> {
  const provider = getProvider()
  const systemPrompt = await buildSystemPrompt(params.projectIds)

  let messages = [...params.messages]
  let rounds = 0

  while (rounds < MAX_TOOL_ROUNDS) {
    rounds++

    const pendingToolCalls: ToolCall[] = []

    for await (const event of provider.createAgentStream({
      systemPrompt,
      messages,
      tools: ALL_TOOLS,
    })) {
      if (event.type === 'text') {
        yield { type: 'text', content: event.content }
      } else if (event.type === 'tool_use') {
        pendingToolCalls.push({
          id: event.id,
          name: event.name,
          input: event.input,
        })
      } else if (event.type === 'error') {
        yield { type: 'error', message: event.message }
        return
      }
    }

    // No tool calls — model is done
    if (pendingToolCalls.length === 0) {
      break
    }

    // Process tool calls
    const toolResults: Array<{ tool_use_id: string; content: string; is_error?: boolean }> = []

    for (const tc of pendingToolCalls) {
      if (WRITE_TOOL_NAMES.has(tc.name)) {
        // Write tool — emit proposal, don't execute
        try {
          const proposal = await buildWriteProposal(tc.name, tc.input)
          yield { type: 'proposal', proposal }
          toolResults.push({
            tool_use_id: tc.id,
            content: `Confirmation tile shown to user for: ${proposal.display.title} — ${proposal.display.cell_label}. Awaiting user approval. Do not re-propose the same change.`,
          })
        } catch (err) {
          toolResults.push({
            tool_use_id: tc.id,
            content: `Error building proposal: ${(err as Error).message}`,
            is_error: true,
          })
        }
      } else {
        // Read tool — execute server-side
        try {
          const result = await executeReadTool(tc.name, tc.input)
          toolResults.push({
            tool_use_id: tc.id,
            content: result,
          })
        } catch (err) {
          toolResults.push({
            tool_use_id: tc.id,
            content: `Error: ${(err as Error).message}`,
            is_error: true,
          })
        }
      }
    }

    // Add assistant message with tool calls + tool results to conversation
    messages = [
      ...messages,
      {
        role: 'assistant' as const,
        content: '',
        tool_calls: pendingToolCalls,
      },
      {
        role: 'user' as const,
        content: '',
        tool_results: toolResults,
      },
    ]
  }

  if (rounds >= MAX_TOOL_ROUNDS) {
    yield { type: 'text', content: '\n\n*Note: This analysis reached the maximum number of tool calls. Results may be incomplete.*' }
  }

  yield { type: 'done' }
}
