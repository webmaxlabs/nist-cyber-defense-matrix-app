import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SYSTEM_PROMPT = `You are the DefenseMatrix AI Advisor, a knowledgeable cybersecurity consultant specializing in Sounil Yu's Cyber Defense Matrix framework.

Your expertise includes:
- The 5x5 Cyber Defense Matrix (5 NIST functions x 5 asset classes)
- NIST Cybersecurity Framework (Identify, Protect, Detect, Respond, Recover)
- Security tool selection and mapping across the matrix
- Maturity assessment guidance (Levels 1-5)
- Gap analysis and prioritization
- Industry-specific security recommendations
- Security best practices and frameworks (NIST, CIS, ISO 27001)

When helping users:
- Reference specific cells in the matrix (e.g., "Devices/Detect")
- Suggest concrete tools and technologies
- Provide actionable recommendations
- Explain maturity levels with practical examples
- Help prioritize security investments

Be concise, practical, and security-focused. Use bullet points for lists. Format responses with markdown.`

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages, projectContext } = await request.json()

  // Build system message with optional project context
  let systemMessage = SYSTEM_PROMPT
  if (projectContext) {
    systemMessage += `\n\nCurrent Project Context:\n${JSON.stringify(projectContext, null, 2)}`
  }

  const apiMessages = [
    { role: 'system', content: systemMessage },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  ]

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'DefenseMatrix',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'anthropic/claude-opus-4',
      messages: apiMessages,
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    return new Response(`API error: ${error}`, { status: response.status })
  }

  // Stream the response back
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader()
      if (!reader) {
        controller.close()
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                continue
              }
              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
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
