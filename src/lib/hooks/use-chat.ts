'use client'

import { useState, useCallback, useRef } from 'react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface UseChatOptions {
  projectContext?: Record<string, unknown> | null
}

export function useChat({ projectContext }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
    }

    setMessages((prev) => [...prev, assistantMessage])

    try {
      abortRef.current = new AbortController()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          projectContext,
        }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) throw new Error('Chat request failed')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: m.content + parsed.content }
                      : m
                  )
                )
              }
            } catch {
              // Skip malformed
            }
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: 'Sorry, I encountered an error. Please try again.' }
              : m
          )
        )
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [messages, projectContext])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    stopGeneration,
  }
}
