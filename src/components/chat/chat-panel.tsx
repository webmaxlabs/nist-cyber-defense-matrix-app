'use client'

import { useRef, useEffect } from 'react'
import { X, Trash2, Shield, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { ChatTypingIndicator } from './chat-typing-indicator'
import { useChat } from '@/lib/hooks/use-chat'
import { useConversationMessages } from '@/lib/hooks/use-conversations'
import type { ChatProposal } from '@/lib/supabase/types'

interface ChatPanelProps {
  onClose: () => void
  conversationId?: string | null
  projectIds?: string[]
  onConversationCreated?: (id: string) => void
  onExpandToSidebar?: () => void
}

export function ChatPanel({ onClose, conversationId = null, projectIds = [], onConversationCreated, onExpandToSidebar }: ChatPanelProps) {
  const { messages, isLoading, sendMessage, loadMessages, clearMessages, stopGeneration, updateProposalLocally } = useChat({ conversationId, projectIds, onConversationCreated })
  const { data: dbMessages } = useConversationMessages(conversationId)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load existing messages from DB when conversation data arrives
  useEffect(() => {
    if (dbMessages && dbMessages.length > 0) {
      loadMessages(dbMessages as Array<{ id: string; role: string; content: string; proposals: ChatProposal[] | null }>)
    }
  }, [dbMessages, loadMessages])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full glass rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden glow-cyan-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/5 bg-cyan-500/5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/15 border border-cyan-500/20">
            <Shield className="h-3 w-3 text-cyan-400" />
          </div>
          <span className="text-sm font-display font-semibold text-foreground">AI Security Advisor</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
            onClick={clearMessages}
            title="Clear messages"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          {onExpandToSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
              onClick={onExpandToSidebar}
              title="Expand to sidebar"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
            onClick={onClose}
            title="Close"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/15 mb-3">
              <Shield className="h-6 w-6 text-cyan-400/50" />
            </div>
            <p className="text-sm font-display font-medium text-foreground">How can I help?</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
              Ask me about security assessments, tool recommendations, or the Cyber Defense Matrix.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                proposals={message.proposals}
                messageId={message.db_message_id || message.id}
                onProposalStatusChange={(proposalId: string, status: ChatProposal['status']) =>
                  updateProposalLocally(message.db_message_id || message.id, proposalId, status)
                }
              />
            ))}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <ChatTypingIndicator />
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        onStop={stopGeneration}
        isLoading={isLoading}
      />
    </div>
  )
}
