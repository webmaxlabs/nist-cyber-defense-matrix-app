import Anthropic from '@anthropic-ai/sdk'
import type {
  Tool,
  ContentBlockParam,
  ToolUseBlockParam,
  ToolResultBlockParam,
  MessageParam,
} from '@anthropic-ai/sdk/resources/messages'
import type { LLMProvider, AgentEvent, AgentStreamParams, ToolDefinition } from './types'

function toAnthropicTools(tools: ToolDefinition[]): Tool[] {
  return tools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.input_schema as Tool.InputSchema,
  }))
}

function toAnthropicMessages(messages: AgentStreamParams['messages']): MessageParam[] {
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => {
      const content: ContentBlockParam[] = []

      if (m.content) {
        content.push({ type: 'text' as const, text: m.content })
      }

      if (m.tool_calls) {
        for (const tc of m.tool_calls) {
          content.push({
            type: 'tool_use',
            id: tc.id,
            name: tc.name,
            input: tc.input,
          } satisfies ToolUseBlockParam)
        }
      }

      if (m.tool_results) {
        for (const tr of m.tool_results) {
          content.push({
            type: 'tool_result',
            tool_use_id: tr.tool_use_id,
            content: tr.content,
            is_error: tr.is_error,
          } satisfies ToolResultBlockParam)
        }
      }

      return {
        role: m.role as 'user' | 'assistant',
        content,
      }
    })
}

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  }

  async *createAgentStream(params: AgentStreamParams): AsyncGenerator<AgentEvent> {
    const stream = this.client.messages.stream({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: params.systemPrompt,
      messages: toAnthropicMessages(params.messages),
      tools: toAnthropicTools(params.tools),
    })

    let inputTokens = 0
    let outputTokens = 0

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          yield { type: 'text', content: event.delta.text }
        }
      } else if (event.type === 'message_delta') {
        outputTokens = event.usage.output_tokens
      } else if (event.type === 'message_start') {
        inputTokens = event.message.usage.input_tokens
      }
    }

    // After stream ends, get the final message for any tool_use blocks
    try {
      const finalMessage = await stream.finalMessage()
      for (const block of finalMessage.content) {
        if (block.type === 'tool_use') {
          yield {
            type: 'tool_use',
            id: block.id,
            name: block.name,
            input: block.input as Record<string, unknown>,
          }
        }
      }
    } catch (err) {
      yield { type: 'error', message: `Failed to retrieve tool calls: ${(err as Error).message}` }
      return
    }

    yield {
      type: 'done',
      usage: { input_tokens: inputTokens, output_tokens: outputTokens },
    }
  }
}
