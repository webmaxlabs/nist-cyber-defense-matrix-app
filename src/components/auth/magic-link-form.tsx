'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function MagicLinkForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center space-y-2 py-4">
        <p className="text-sm font-medium text-emerald-400">Magic link sent!</p>
        <p className="text-sm text-muted-foreground">Check your email for a sign-in link.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="magic-email" className="text-slate-300">Email</Label>
        <Input
          id="magic-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/5 border-white/10 text-foreground placeholder:text-slate-500 focus:border-cyan-500/40 focus:ring-cyan-500/20"
          required
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold" disabled={loading}>
        {loading ? 'Sending...' : 'Send Magic Link'}
      </Button>
    </form>
  )
}
