import { ChatProvider } from '@/providers/chat-provider'
import { DashboardContent } from '@/components/layout/dashboard-content'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <DashboardContent>{children}</DashboardContent>
    </ChatProvider>
  )
}
