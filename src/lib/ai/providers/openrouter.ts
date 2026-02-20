import type { LLMProvider, AgentEvent, AgentStreamParams, ToolDefinition } from './types'

function toOpenAITools(tools: ToolDefinition[]) {
  return tools.map((t) => ({
    type: 'function' as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.input_schema,
    },
  }))
}

function toOpenAIMessages(systemPrompt: string, messages: AgentStreamParams['messages']) {
  const result: Array<Record<string, unknown>> = [
    { role: 'system', content: systemPrompt },
  ]

  for (const m of messages) {
    if (m.role === 'system') continue

    if (m.tool_results) {
      for (const tr of m.tool_results) {
        result.push({
          role: 'tool',
          tool_call_id: tr.tool_use_id,
          content: tr.content,
        })
      }
      continue
    }

    const msg: Record<string, unknown> = { role: m.role, content: m.content }

    if (m.tool_calls) {
      msg.tool_calls = m.tool_calls.map((tc) => ({
        id: tc.id,
        type: 'function',
        function: { name: tc.name, arguments: JSON.stringify(tc.input) },
      }))
    }

    result.push(msg)
  }

  return result
}

export class OpenRouterProvider implements LLMProvider {
  async *createAgentStream(params: AgentStreamParams): AsyncGenerator<AgentEvent> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Cyber Defense Matrix AI',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4',
        messages: toOpenAIMessages(params.systemPrompt, params.messages),
        tools: toOpenAITools(params.tools),
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('OpenRouter API error:', response.status, errorBody)
      yield { type: 'error', message: 'AI service is temporarily unavailable. Please try again.' }
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      yield { type: 'error', message: 'No response body' }
      return
    }

    const decoder = new TextDecoder()
    let buffer = ''
    const toolCalls: Map<number, { id: string; name: string; arguments: string }> = new Map()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta

            if (delta?.content) {
              yield { type: 'text', content: delta.content }
            }

            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                const idx = tc.index ?? 0
                if (!toolCalls.has(idx)) {
                  toolCalls.set(idx, { id: tc.id || '', name: tc.function?.name || '', arguments: '' })
                }
                const existing = toolCalls.get(idx)!
                if (tc.id) existing.id = tc.id
                if (tc.function?.name) existing.name = tc.function.name
                if (tc.function?.arguments) existing.arguments += tc.function.arguments
              }
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    // Emit accumulated tool calls
    for (const [, tc] of toolCalls) {
      let input: Record<string, unknown> = {}
      try {
        input = JSON.parse(tc.arguments)
      } catch {
        // Malformed tool arguments
      }
      yield { type: 'tool_use', id: tc.id, name: tc.name, input }
    }

    yield { type: 'done', usage: { input_tokens: 0, output_tokens: 0 } }
  }
}
