'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthCard } from './auth-card'
import { OAuthButtons } from './oauth-buttons'
import { Separator } from '@/components/ui/separator'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthCard title="Check your email" description="We've sent you a confirmation link">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in your email to confirm your account and get started.
          </p>
          <Link href="/login" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Back to Sign In
          </Link>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Create an account" description="Get started with DefenseMatrix">
      <div className="space-y-4">
        <OAuthButtons />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="bg-white/5" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Full Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-white/5 border-white/10 text-foreground placeholder:text-slate-500 focus:border-cyan-500/40 focus:ring-cyan-500/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-foreground placeholder:text-slate-500 focus:border-cyan-500/40 focus:ring-cyan-500/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-foreground placeholder:text-slate-500 focus:border-cyan-500/40 focus:ring-cyan-500/20"
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}
