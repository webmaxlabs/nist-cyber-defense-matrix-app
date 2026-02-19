'use client'

import { Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MATURITY_COLORS, type AssetClass, type NistFunction } from '@/lib/constants/matrix'
import type { CellAssessment } from '@/lib/supabase/types'

interface MatrixCellProps {
  row: AssetClass
  column: NistFunction
  assessment: CellAssessment | undefined
  toolCount: number
  onClick: () => void
}

export function MatrixCell({ assessment, toolCount, onClick }: MatrixCellProps) {
  const level = assessment?.maturity_level ?? 0
  const maturity = MATURITY_COLORS[level]

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg p-3 cursor-pointer min-h-[80px] transition-all duration-300',
        `maturity-${level} matrix-cell-styled`,
        level === 0 && 'border-dashed'
      )}
    >
      <span className={cn('font-mono text-lg font-bold', maturity.text)}>
        {level > 0 ? `L${level}` : '\u2014'}
      </span>
      <span className={cn('text-[10px] mt-0.5 font-medium', level > 0 ? maturity.text : 'text-slate-600')}>
        {maturity.label}
      </span>

      {toolCount > 0 && (
        <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 px-1.5 py-0.5">
          <Wrench className="h-2.5 w-2.5 text-indigo-400" />
          <span className="text-[9px] font-mono font-bold text-indigo-400">{toolCount}</span>
        </div>
      )}
    </button>
  )
}
