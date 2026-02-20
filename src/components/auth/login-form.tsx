'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthCard } from './auth-card'
import { OAuthButtons } from './oauth-buttons'
import { MagicLinkForm } from './magic-link-form'
import { Separator } from '@/components/ui/separator'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/projects')
      router.refresh()
    }
  }

  return (
    <AuthCard title="Welcome back" description="Sign in to your DefenseMatrix account">
      <div className="space-y-4">
        <OAuthButtons />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="bg-slate-200 dark:bg-white/5" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {mode === 'password' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-600 dark:text-slate-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-500/40 focus:ring-cyan-500/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-600 dark:text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-foreground focus:border-cyan-500/40 focus:ring-cyan-500/20"
                required
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        ) : (
          <MagicLinkForm />
        )}

        <div className="flex flex-col gap-2 text-center text-sm">
          <button
            type="button"
            onClick={() => setMode(mode === 'password' ? 'magic' : 'password')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {mode === 'password' ? 'Sign in with Magic Link instead' : 'Sign in with password instead'}
          </button>
          <p className="text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthCard>
  )
}
