import { ASSET_LABELS, NIST_LABELS } from '@/lib/constants/matrix'
import { getCriticalGaps, getUnassessedCells } from '@/lib/utils/scores'
import type { CellAssessment } from '@/lib/supabase/types'

interface GapAnalysisTableProps {
  assessments: CellAssessment[]
}

export function GapAnalysisTable({ assessments }: GapAnalysisTableProps) {
  const gaps = getCriticalGaps(assessments, 2)
  const unassessed = getUnassessedCells(assessments)

  return (
    <section className="mb-8">
      <h2 className="text-xl font-display font-bold text-foreground mb-4 print:text-black">Gap Analysis</h2>

      {gaps.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-red-400 mb-2 print:text-red-700">Critical Gaps (Level 1-2)</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-red-500/5 print:bg-red-50">
                <th className="border border-white/10 p-2 text-left text-slate-300 print:border-gray-300 print:text-black">Asset Class</th>
                <th className="border border-white/10 p-2 text-left text-slate-300 print:border-gray-300 print:text-black">NIST Function</th>
                <th className="border border-white/10 p-2 text-center text-slate-300 print:border-gray-300 print:text-black">Level</th>
                <th className="border border-white/10 p-2 text-left text-slate-300 print:border-gray-300 print:text-black">Justification</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((gap) => (
                <tr key={gap.id}>
                  <td className="border border-white/10 p-2 text-slate-300 print:border-gray-300 print:text-black">{ASSET_LABELS[gap.cell_row]}</td>
                  <td className="border border-white/10 p-2 text-slate-300 print:border-gray-300 print:text-black">{NIST_LABELS[gap.cell_column]}</td>
                  <td className="border border-white/10 p-2 text-center font-mono font-semibold text-red-400 print:border-gray-300 print:text-red-600">{gap.maturity_level}</td>
                  <td className="border border-white/10 p-2 text-slate-300 print:border-gray-300 print:text-gray-600">{gap.justification || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {unassessed.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-slate-300 mb-2 print:text-gray-700">
            Unassessed Cells ({unassessed.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {unassessed.map((cell) => (
              <span key={`${cell.row}-${cell.column}`} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-300 print:bg-gray-100 print:border-gray-300 print:text-gray-600">
                {ASSET_LABELS[cell.row]} / {NIST_LABELS[cell.column]}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
