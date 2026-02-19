import { ASSET_CLASSES, NIST_FUNCTIONS, ASSET_LABELS, NIST_LABELS } from '@/lib/constants/matrix'
import type { SecurityToolData } from '@/lib/data/security-tools'

interface ToolMatrixCoverageProps {
  tool: SecurityToolData
}

export function ToolMatrixCoverage({ tool }: ToolMatrixCoverageProps) {
  const coveredSet = new Set(tool.coverageCells.map((c) => `${c.row}:${c.column}`))

  const coveredAssets = [...new Set(tool.coverageCells.map((c) => ASSET_LABELS[c.row]))]
  const coveredFunctions = [...new Set(tool.coverageCells.map((c) => NIST_LABELS[c.column]))]

  return (
    <div>
      <h4 className="text-sm font-display font-semibold text-foreground mb-3">Cyber Defense Matrix Coverage</h4>

      <div className="overflow-x-auto">
        <div className="min-w-[400px]">
          <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-1">
            <div />
            {NIST_FUNCTIONS.map((fn) => (
              <div key={fn} className="text-[10px] font-bold font-mono text-muted-foreground text-center uppercase py-1">
                {NIST_LABELS[fn]}
              </div>
            ))}

            {ASSET_CLASSES.map((asset) => (
              <>
                <div key={`label-${asset}`} className="text-xs font-medium text-slate-300 flex items-center">
                  {ASSET_LABELS[asset]}
                </div>
                {NIST_FUNCTIONS.map((fn) => {
                  const covered = coveredSet.has(`${asset}:${fn}`)
                  return (
                    <div
                      key={`${asset}-${fn}`}
                      className={`rounded h-8 flex items-center justify-center ${
                        covered ? 'bg-green-400' : 'bg-white/5'
                      }`}
                    >
                      {covered && <span className="text-white text-xs font-bold">O</span>}
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-green-400" />
          <span>Covered by {tool.vendorName}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-white/5" />
          <span>Not covered</span>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-3">
        <p className="text-xs text-slate-300">
          <strong>Coverage Summary:</strong> {tool.vendorName} provides coverage across{' '}
          <strong>{tool.coverageCells.length} cells</strong> of the Cyber Defense Matrix, primarily
          focusing on <strong>{coveredAssets.join(', ')}</strong> asset classes and{' '}
          <strong>{coveredFunctions.join(', ')}</strong> security functions.
        </p>
      </div>
    </div>
  )
}
