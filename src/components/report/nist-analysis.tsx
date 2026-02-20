import { NIST_FUNCTIONS, NIST_LABELS, ASSET_CLASSES, ASSET_LABELS } from '@/lib/constants/matrix'
import { MATURITY_LEVELS } from '@/lib/constants/maturity-levels'
import { getCellAssessment } from '@/lib/utils/matrix-helpers'
import type { CellAssessment } from '@/lib/supabase/types'

interface NistAnalysisProps {
  assessments: CellAssessment[]
}

export function NistAnalysis({ assessments }: NistAnalysisProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-display font-bold text-foreground mb-4 print:text-black">NIST Function Analysis</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border border-slate-200 dark:border-white/10 p-2 bg-slate-50 dark:bg-white/[0.02] text-left text-slate-600 dark:text-slate-300 print:bg-gray-50 print:border-gray-300 print:text-black">Asset / Function</th>
              {NIST_FUNCTIONS.map((fn) => (
                <th key={fn} className="border border-slate-200 dark:border-white/10 p-2 bg-cyan-500/15 text-cyan-400 text-center print:bg-blue-600 print:text-white print:border-gray-300">
                  {NIST_LABELS[fn]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ASSET_CLASSES.map((asset) => (
              <tr key={asset}>
                <td className="border border-slate-200 dark:border-white/10 p-2 font-medium bg-slate-50 dark:bg-white/[0.02] text-slate-600 dark:text-slate-300 print:bg-gray-50 print:border-gray-300 print:text-black">{ASSET_LABELS[asset]}</td>
                {NIST_FUNCTIONS.map((fn) => {
                  const assessment = getCellAssessment(assessments, asset, fn)
                  const level = assessment?.maturity_level ?? 0
                  const maturity = level > 0 ? MATURITY_LEVELS[level - 1] : null
                  return (
                    <td key={fn} className="border border-slate-200 dark:border-white/10 p-2 text-center print:border-gray-300">
                      {maturity ? (
                        <span style={{ color: maturity.color }} className="font-mono font-semibold">
                          L{level} - {maturity.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
