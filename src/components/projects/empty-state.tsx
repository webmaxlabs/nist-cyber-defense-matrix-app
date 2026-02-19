'use client'

import Link from 'next/link'
import { Shield, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.01] px-6 py-16">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
        <Shield className="h-7 w-7 text-cyan-400" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">No projects yet</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">
        Create your first security assessment project to start mapping your cybersecurity posture.
      </p>
      <Link href="/projects/new">
        <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </Link>
    </div>
  )
}
