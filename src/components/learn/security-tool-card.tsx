'use client'

import { ToolLogo } from './tool-logo'
import { cn } from '@/lib/utils'
import type { SecurityToolData } from '@/lib/data/security-tools'

interface SecurityToolCardProps {
  tool: SecurityToolData
  isSelected?: boolean
  onClick: () => void
}

export function SecurityToolCard({ tool, isSelected, onClick }: SecurityToolCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-xl p-3 transition-all aspect-square',
        'bg-[rgba(14,20,37,0.8)] backdrop-blur-xl',
        isSelected
          ? 'gradient-border-animated border-0'
          : 'border-2 border-white/10 hover:border-cyan-500/30 hover:shadow-md hover:shadow-cyan-500/5'
      )}
      title={tool.vendorName}
    >
      <div className="mb-1.5">
        <ToolLogo vendorName={tool.vendorName} websiteUrl={tool.websiteUrl} size="sm" />
      </div>
      <span className="text-xs text-muted-foreground text-center leading-tight line-clamp-2">
        {tool.vendorName}
      </span>
    </button>
  )
}
