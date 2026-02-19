'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useUser } from '@/lib/hooks/use-user'
import { useAuth } from '@/providers/auth-provider'

export function UserMenu() {
  const { displayName, avatarUrl, email } = useUser()
  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 border border-white/10">
          <AvatarImage src={avatarUrl || undefined} alt={displayName} />
          <AvatarFallback className="bg-cyan-500/10 text-cyan-400 text-xs font-mono">{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden lg:block text-right">
          <p className="text-sm font-medium text-foreground leading-none">{displayName}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="gap-1.5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5 hover:border-white/15"
      >
        <LogOut className="h-3.5 w-3.5" />
        Logout
      </Button>
    </div>
  )
}
