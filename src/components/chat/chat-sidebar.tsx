'use client'

import { useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { PanelRightClose, Plus, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatContext } from '@/providers/chat-provider'
import { useChat } from '@/lib/hooks/use-chat'
import { useConversationMessages } from '@/lib/hooks/use-conversations'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { ChatTypingIndicator } from './chat-typing-indicator'
import { ProjectSelector } from './project-selector'
import { ConversationList } from './conversation-list'
import type { ChatProposal } from '@/lib/supabase/types'

export function ChatSidebar() {
  const {
    activeConversationId,
    selectedProjectIds,
    setActiveConversation,
    toggleMode,
    newConversation,
  } = useChatContext()

  const bottomRef = useRef<HTMLDivElement>(null)

  const handleConversationCreated = useCallback((id: string) => {
    setActiveConversation(id)
  }, [setActiveConversation])

  const {
    messages,
    isLoading,
    sendMessage,
    loadMessages,
    clearMessages,
    stopGeneration,
    updateProposalLocally,
  } = useChat({
    conversationId: activeConversationId,
    projectIds: selectedProjectIds,
    onConversationCreated: handleConversationCreated,
  })

  // Load messages when switching conversations
  const { data: dbMessages } = useConversationMessages(activeConversationId)
  useEffect(() => {
    if (dbMessages && dbMessages.length > 0) {
      loadMessages(dbMessages)
    }
  }, [dbMessages, loadMessages])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleNewConversation() {
    newConversation()
    clearMessages()
  }

  function handleProposalStatusChange(messageId: string, proposalId: string, status: ChatProposal['status']) {
    updateProposalLocally(messageId, proposalId, status)
  }

  return (
    <motion.div
      initial={{ x: 420 }}
      animate={{ x: 0 }}
      exit={{ x: 420 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed top-0 right-0 h-screen w-[420px] z-40 flex flex-col glass border-l border-slate-200 dark:border-white/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200 dark:border-white/5 bg-cyan-500/5">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-200 hover:bg-white/5"
            onClick={toggleMode}
            title="Collapse to widget"
          >
            <PanelRightClose className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-cyan-500/15 border border-cyan-500/20">
              <Shield className="h-3 w-3 text-cyan-400" />
            </div>
            <span className="text-sm font-display font-semibold text-foreground">
              AI Advisor
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-400 hover:text-slate-200 hover:bg-white/5"
          onClick={handleNewConversation}
          title="New conversation"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Project Selector */}
      <ProjectSelector />

      {/* Conversation List */}
      <div className="border-b border-slate-200 dark:border-white/5 max-h-48 overflow-hidden">
        <ConversationList />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/15 mb-3">
              <Shield className="h-6 w-6 text-cyan-400/50" />
            </div>
            <p className="text-sm font-display font-medium text-foreground">How can I help?</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
              Select projects above for context, then ask about assessments, gaps, tool recommendations, or request changes to the matrix.
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
                onProposalStatusChange={(proposalId, status) =>
                  handleProposalStatusChange(message.db_message_id || message.id, proposalId, status)
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
    </motion.div>
  )
}
