'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { ChatPanel } from './chat-panel'
import { useAuth } from '@/providers/auth-provider'
import { useChatContext } from '@/providers/chat-provider'

export function ChatWidget() {
  const { user } = useAuth()
  const {
    isOpen,
    mode,
    activeConversationId,
    selectedProjectIds,
    openWidget,
    openSidebar,
    close,
    setActiveConversation,
  } = useChatContext()

  if (!user) return null

  const showPanel = isOpen && mode === 'widget'
  const showFab = !isOpen || mode === 'sidebar'

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-[380px] h-[500px]"
          >
            <ChatPanel
              onClose={close}
              conversationId={activeConversationId}
              projectIds={selectedProjectIds}
              onConversationCreated={setActiveConversation}
              onExpandToSidebar={openSidebar}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showFab && (
        <button
          onClick={openWidget}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg glow-cyan transition-all hover:glow-cyan-strong"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
