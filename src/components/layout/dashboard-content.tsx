'use client'

import { AnimatePresence } from 'framer-motion'
import { TopNav } from '@/components/layout/top-nav'
import { ChatWidget } from '@/components/chat/chat-widget'
import { ChatSidebar } from '@/components/chat/chat-sidebar'
import { useChatContext } from '@/providers/chat-provider'
import { cn } from '@/lib/utils'

export function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen, mode } = useChatContext()
  const sidebarOpen = isOpen && mode === 'sidebar'

  return (
    <>
      <TopNav />
      <main
        className={cn(
          'min-h-[calc(100vh-4rem)] relative transition-all duration-300',
          sidebarOpen && 'mr-[420px]'
        )}
      >
        <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
        <div className="relative">{children}</div>
      </main>
      <ChatWidget />
      <AnimatePresence>
        {sidebarOpen && <ChatSidebar />}
      </AnimatePresence>
    </>
  )
}
