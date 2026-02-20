'use client'

import { useState, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { ChatProposal } from '@/lib/supabase/types'

export interface ChatMessageWithProposals {
  id: string
  role: 'user' | 'assistant'
  content: string
  proposals: ChatProposal[]
  db_message_id?: string
}

interface UseChatOptions {
  conversationId: string | null
  projectIds: string[]
  onConversationCreated?: (id: string) => void
}

export function useChat({ conversationId, projectIds, onConversationCreated }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessageWithProposals[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const queryClient = useQueryClient()

  const loadMessages = useCallback((
    dbMessages: Array<{ id: string; role: string; content: string; proposals: ChatProposal[] | null }>
  ) => {
    setMessages(
      dbMessages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          proposals: m.proposals || [],
          db_message_id: m.id,
        }))
    )
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessageWithProposals = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      proposals: [],
    }

    const assistantMessage: ChatMessageWithProposals = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      proposals: [],
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setIsLoading(true)

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
          conversationId,
          projectIds,
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
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          try {
            const parsed = JSON.parse(data)

            if (parsed.type === 'text' && parsed.content) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: m.content + parsed.content }
                    : m
                )
              )
            } else if (parsed.type === 'proposal' && parsed.proposal) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, proposals: [...m.proposals, parsed.proposal] }
                    : m
                )
              )
            } else if (parsed.type === 'error') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, content: m.content + `\n\n*Error: ${parsed.message}*` }
                    : m
                )
              )
            } else if (parsed.type === 'done' && parsed.conversationId) {
              if (onConversationCreated) {
                onConversationCreated(parsed.conversationId)
              }
              queryClient.invalidateQueries({ queryKey: ['conversations'] })
            }
          } catch {
            // Skip malformed
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
  }, [messages, conversationId, projectIds, onConversationCreated, queryClient])

  const updateProposalLocally = useCallback((messageId: string, proposalId: string, status: ChatProposal['status']) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId || m.db_message_id === messageId
          ? {
              ...m,
              proposals: m.proposals.map((p) =>
                p.id === proposalId
                  ? { ...p, status, applied_at: status === 'applied' ? new Date().toISOString() : p.applied_at }
                  : p
              ),
            }
          : m
      )
    )
  }, [])

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
    loadMessages,
    clearMessages,
    stopGeneration,
    updateProposalLocally,
  }
}
