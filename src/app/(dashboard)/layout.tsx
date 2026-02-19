import { TopNav } from '@/components/layout/top-nav'
import { ChatWidget } from '@/components/chat/chat-widget'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main className="min-h-[calc(100vh-4rem)] relative">
        <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
        <div className="relative">
          {children}
        </div>
      </main>
      <ChatWidget />
    </>
  )
}
