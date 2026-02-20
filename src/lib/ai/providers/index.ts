import type { LLMProvider } from './types'
import { AnthropicProvider } from './anthropic'
import { OpenRouterProvider } from './openrouter'

export function getProvider(): LLMProvider {
  if (process.env.ANTHROPIC_API_KEY) {
    return new AnthropicProvider()
  }
  if (process.env.OPENROUTER_API_KEY) {
    return new OpenRouterProvider()
  }
  throw new Error(
    'No LLM provider configured. Set ANTHROPIC_API_KEY or OPENROUTER_API_KEY.'
  )
}

export type {
  LLMProvider,
  AgentEvent,
  AgentStreamParams,
  ToolDefinition,
  ConversationMessage,
  ToolCall,
  ToolResult,
} from './types'
