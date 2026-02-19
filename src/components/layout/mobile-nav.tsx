'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, LogOut } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/hooks/use-user'
import { useAuth } from '@/providers/auth-provider'
import { cn } from '@/lib/utils'

const links = [
  { href: '/projects', label: 'Projects' },
  { href: '/learn', label: 'Learn' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { displayName } = useUser()
  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
    router.push('/')
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-slate-400 hover:text-slate-200 hover:bg-white/5">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 glass border-l border-white/5">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex flex-col gap-4 pt-8">
          <p className="px-2 text-sm font-medium text-muted-foreground">Hi, {displayName}</p>
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-white/5 pt-4">
            <Button variant="ghost" className="w-full justify-start gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/5" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
