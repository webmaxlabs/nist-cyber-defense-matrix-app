'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

type ChatMode = 'widget' | 'sidebar'

interface ChatContextType {
  isOpen: boolean
  mode: ChatMode
  activeConversationId: string | null
  selectedProjectIds: string[]
  openWidget: () => void
  openSidebar: () => void
  close: () => void
  toggleMode: () => void
  setActiveConversation: (id: string | null) => void
  setSelectedProjects: (ids: string[]) => void
  newConversation: () => void
}

const ChatContext = createContext<ChatContextType>({
  isOpen: false,
  mode: 'widget',
  activeConversationId: null,
  selectedProjectIds: [],
  openWidget: () => {},
  openSidebar: () => {},
  close: () => {},
  toggleMode: () => {},
  setActiveConversation: () => {},
  setSelectedProjects: () => {},
  newConversation: () => {},
})

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<ChatMode>('widget')
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([])

  // Restore mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dm-chat-mode')
    if (saved === 'widget' || saved === 'sidebar') {
      setMode(saved)
    }
  }, [])

  const openWidget = useCallback(() => {
    setIsOpen(true)
    setMode('widget')
    localStorage.setItem('dm-chat-mode', 'widget')
  }, [])

  const openSidebar = useCallback(() => {
    setIsOpen(true)
    setMode('sidebar')
    localStorage.setItem('dm-chat-mode', 'sidebar')
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleMode = useCallback(() => {
    const next = mode === 'widget' ? 'sidebar' : 'widget'
    setMode(next)
    localStorage.setItem('dm-chat-mode', next)
  }, [mode])

  const newConversation = useCallback(() => {
    setActiveConversationId(null)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        mode,
        activeConversationId,
        selectedProjectIds,
        openWidget,
        openSidebar,
        close,
        toggleMode,
        setActiveConversation: setActiveConversationId,
        setSelectedProjects: setSelectedProjectIds,
        newConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => useContext(ChatContext)
