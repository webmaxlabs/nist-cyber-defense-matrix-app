import { TopNav } from '@/components/layout/top-nav'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      {children}
    </>
  )
}
