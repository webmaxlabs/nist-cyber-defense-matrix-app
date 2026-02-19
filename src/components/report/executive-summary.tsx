import type { CellAssessment, ToolMapping } from '@/lib/supabase/types'
import { calculateOverallScore, calculateCoverage, getMatureCells, getCriticalGaps } from '@/lib/utils/scores'

interface ExecutiveSummaryProps {
  assessments: CellAssessment[]
  toolMappings: ToolMapping[]
}

export function ExecutiveSummary({ assessments, toolMappings }: ExecutiveSummaryProps) {
  const score = calculateOverallScore(assessments)
  const coverage = calculateCoverage(assessments)
  const mature = getMatureCells(assessments, 4)
  const gaps = getCriticalGaps(assessments, 2)
  const tools = new Set(toolMappings.map((tm) => tm.tool_id)).size

  return (
    <section className="mb-8">
      <h2 className="text-xl font-display font-bold text-foreground mb-4 print:text-black">Executive Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-4 text-center print:bg-blue-50 print:border-blue-200">
          <p className="text-2xl font-mono font-bold text-cyan-400 print:text-blue-700">{(score / 5 * 100).toFixed(0)}%</p>
          <p className="text-xs text-cyan-400/70 print:text-blue-600">Overall Score</p>
        </div>
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4 text-center print:bg-green-50 print:border-green-200">
          <p className="text-2xl font-mono font-bold text-emerald-400 print:text-green-700">{coverage}%</p>
          <p className="text-xs text-emerald-400/70 print:text-green-600">Coverage</p>
        </div>
        <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-4 text-center print:bg-red-50 print:border-red-200">
          <p className="text-2xl font-mono font-bold text-red-400 print:text-red-700">{gaps.length}</p>
          <p className="text-xs text-red-400/70 print:text-red-600">Critical Gaps</p>
        </div>
        <div className="rounded-lg bg-purple-500/5 border border-purple-500/20 p-4 text-center print:bg-purple-50 print:border-purple-200">
          <p className="text-2xl font-mono font-bold text-purple-400 print:text-purple-700">{tools}</p>
          <p className="text-xs text-purple-400/70 print:text-purple-600">Tools Mapped</p>
        </div>
      </div>
      <p className="text-sm text-slate-300 print:text-gray-600">
        This assessment covers {assessments.length} of 25 cells in the Cyber Defense Matrix,
        with {mature} cells achieving mature status (Level 4+) and {gaps.length} cells
        identified as critical gaps requiring immediate attention.
      </p>
    </section>
  )
}
