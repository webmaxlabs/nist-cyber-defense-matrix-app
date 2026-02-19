'use client'

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { NavLinks } from './nav-links'
import { UserMenu } from './user-menu'
import { MobileNav } from './mobile-nav'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'

export function TopNav() {
  const { user, loading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full nav-glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={user ? '/projects' : '/'} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/15 group-hover:border-cyan-500/30 transition-all group-hover:glow-cyan-sm">
              <Shield className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg font-bold text-foreground tracking-tight">DefenseMatrix</span>
              <span className="block text-[10px] text-muted-foreground leading-none -mt-0.5 tracking-wider uppercase">Cyber Defense Assessment</span>
            </div>
          </Link>

          {user && (
            <div className="hidden md:block">
              <NavLinks />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!loading && !user && (
            <Link href="/login">
              <Button size="sm" className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/30 font-medium">
                Sign In
              </Button>
            </Link>
          )}

          {user && (
            <>
              <div className="hidden md:block">
                <UserMenu />
              </div>
              <div className="md:hidden">
                <MobileNav />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
