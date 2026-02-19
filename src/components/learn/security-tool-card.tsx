'use client'

import type { SecurityToolData } from '@/lib/data/security-tools'

interface SecurityToolCardProps {
  tool: SecurityToolData
  onClick: () => void
}

export function SecurityToolCard({ tool, onClick }: SecurityToolCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center rounded-xl border-2 border-white/10 glass p-3 hover:border-cyan-500/30 hover:shadow-md hover:shadow-cyan-500/5 transition-all aspect-square"
      title={tool.vendorName}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-sm font-bold font-mono text-slate-300 mb-1.5">
        {tool.vendorName.slice(0, 2).toUpperCase()}
      </div>
      <span className="text-[10px] text-muted-foreground text-center leading-tight line-clamp-2">
        {tool.vendorName}
      </span>
    </button>
  )
}
