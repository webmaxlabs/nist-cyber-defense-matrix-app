'use client'

import { cn } from '@/lib/utils'
import { MATURITY_LEVELS } from '@/lib/constants/maturity-levels'

interface MaturitySelectorProps {
  value: number | null
  onChange: (level: number) => void
}

export function MaturitySelector({ value, onChange }: MaturitySelectorProps) {
  return (
    <div className="space-y-2">
      {MATURITY_LEVELS.map((level) => (
        <button
          key={level.level}
          onClick={() => onChange(level.level)}
          className={cn(
            'w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all',
            value === level.level
              ? `${level.bgColor} border-current text-white`
              : 'border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]'
          )}
        >
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-mono font-bold shrink-0',
              value === level.level
                ? 'bg-white/20 text-white'
                : `text-white ${level.bgColor}`
            )}
          >
            {level.level}
          </span>
          <div>
            <p className={cn('text-sm font-semibold', value !== level.level && 'text-foreground')}>
              {level.name}
            </p>
            <p className={cn('text-xs', value === level.level ? 'text-white/80' : 'text-muted-foreground')}>
              {level.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
