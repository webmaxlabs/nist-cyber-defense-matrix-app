'use client'

import { Shield } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  description: string
  children: ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md glass border-slate-200 dark:border-white/5 glow-cyan-sm">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 glow-cyan-sm">
          <Shield className="h-7 w-7 text-cyan-400" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
