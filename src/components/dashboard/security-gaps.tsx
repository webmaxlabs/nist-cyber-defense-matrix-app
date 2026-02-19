import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ASSET_LABELS, NIST_LABELS, MATURITY_COLORS } from '@/lib/constants/matrix'
import { getCriticalGaps, getUnassessedCells } from '@/lib/utils/scores'
import type { CellAssessment } from '@/lib/supabase/types'

interface SecurityGapsProps {
  assessments: CellAssessment[]
}

const gapBorderColors: Record<number, string> = {
  1: 'border-red-500/20',
  2: 'border-orange-500/20',
}

const gapTextColors: Record<number, string> = {
  1: 'text-red-400 bg-red-500/10 border-red-500/20',
  2: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
}

export function SecurityGaps({ assessments }: SecurityGapsProps) {
  const gaps = getCriticalGaps(assessments, 2)
  const unassessed = getUnassessedCells(assessments)

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-amber-400" />
        <h3 className="font-display text-base font-semibold text-foreground">Security Gaps</h3>
      </div>
      {gaps.length === 0 && unassessed.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">No critical gaps identified</p>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {gaps.map((gap) => (
            <div key={gap.id} className={`flex items-center justify-between rounded-lg border ${gapBorderColors[gap.maturity_level] || 'border-white/5'} bg-white/[0.02] p-3`}>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {ASSET_LABELS[gap.cell_row]} / {NIST_LABELS[gap.cell_column]}
                </p>
                <p className="text-xs text-muted-foreground">Needs improvement</p>
              </div>
              <Badge className={`${gapTextColors[gap.maturity_level] || 'text-slate-400 bg-white/5 border-white/10'} border text-xs`}>
                Level {gap.maturity_level}
              </Badge>
            </div>
          ))}

          {unassessed.slice(0, 5).map((cell) => (
            <div key={`${cell.row}-${cell.column}`} className="flex items-center justify-between rounded-lg border border-dashed border-white/8 bg-white/[0.01] p-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {ASSET_LABELS[cell.row]} / {NIST_LABELS[cell.column]}
                </p>
                <p className="text-xs text-muted-foreground">Not yet assessed</p>
              </div>
              <Badge variant="outline" className="text-slate-500 border-white/10 text-xs">Pending</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
