import { ASSET_LABELS, NIST_LABELS } from '@/lib/constants/matrix'
import { getCriticalGaps, getUnassessedCells } from '@/lib/utils/scores'
import type { CellAssessment } from '@/lib/supabase/types'

interface RecommendationsProps {
  assessments: CellAssessment[]
}

export function Recommendations({ assessments }: RecommendationsProps) {
  const gaps = getCriticalGaps(assessments, 2)
  const unassessed = getUnassessedCells(assessments)

  const recommendations: string[] = []

  if (unassessed.length > 0) {
    recommendations.push(
      `Complete the remaining ${unassessed.length} cell assessments to achieve full coverage of the Cyber Defense Matrix.`
    )
  }

  gaps.forEach((gap) => {
    recommendations.push(
      `Prioritize improving ${ASSET_LABELS[gap.cell_row]} / ${NIST_LABELS[gap.cell_column]} (currently Level ${gap.maturity_level}). Consider investing in additional tooling and process improvements.`
    )
  })

  if (recommendations.length === 0) {
    recommendations.push(
      'Continue monitoring and maintaining current maturity levels.',
      'Schedule quarterly reassessments to track progress.',
      'Consider expanding tool coverage to strengthen weaker areas.'
    )
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-display font-bold text-foreground mb-4 print:text-black">Recommendations</h2>
      <ol className="space-y-3">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-mono font-bold text-cyan-400 shrink-0 print:bg-blue-100 print:text-blue-700">
              {index + 1}
            </span>
            <p className="text-sm text-slate-300 print:text-gray-700">{rec}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
