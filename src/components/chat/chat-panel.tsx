'use client'

import { useRef, useEffect } from 'react'
import { X, Trash2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { ChatTypingIndicator } from './chat-typing-indicator'
import { useChat } from '@/lib/hooks/use-chat'

interface ChatPanelProps {
  onClose: () => void
  projectContext?: Record<string, unknown> | null
}

export function ChatPanel({ onClose, projectContext }: ChatPanelProps) {
  const { messages, isLoading, sendMessage, clearMessages, stopGeneration } = useChat({ projectContext })
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
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
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
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
              />
            ))}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <ChatTypingIndicator />
            )}
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
