export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  tool_calls?: ToolCall[]
  tool_results?: ToolResult[]
}

export interface ToolDefinition {
  name: string
  description: string
  input_schema: Record<string, unknown>  // JSON Schema
}

export interface ToolCall {
  id: string
  name: string
  input: Record<string, unknown>
}

export interface ToolResult {
  tool_use_id: string
  content: string
  is_error?: boolean
}

export type AgentEvent =
  | { type: 'text'; content: string }
  | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }
  | { type: 'done'; usage: { input_tokens: number; output_tokens: number } }
  | { type: 'error'; message: string }

export interface LLMProvider {
  createAgentStream(params: AgentStreamParams): AsyncGenerator<AgentEvent>
}

export interface AgentStreamParams {
  systemPrompt: string
  messages: ConversationMessage[]
  tools: ToolDefinition[]
}
