'use client'

import { BarChart3, CheckCircle2, AlertTriangle, Wrench } from 'lucide-react'
import { KPICard } from './kpi-card'
import type { CellAssessment, ToolMapping } from '@/lib/supabase/types'
import { calculateOverallScore, getMatureCells, getCriticalGaps } from '@/lib/utils/scores'

interface KPICardsProps {
  assessments: CellAssessment[]
  toolMappings: ToolMapping[]
}

export function KPICards({ assessments, toolMappings }: KPICardsProps) {
  const score = calculateOverallScore(assessments)
  const mature = getMatureCells(assessments, 4)
  const gaps = getCriticalGaps(assessments, 2)
  const totalTools = new Set(toolMappings.map((tm) => tm.tool_id)).size

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Overall Score"
        value={`${(score / 5 * 100).toFixed(0)}%`}
        icon={BarChart3}
        color="#22d3ee"
        glowColor="rgba(34, 211, 238, 0.06)"
      />
      <KPICard
        title="Mature Cells (4+)"
        value={mature}
        icon={CheckCircle2}
        color="#34d399"
        glowColor="rgba(52, 211, 153, 0.06)"
      />
      <KPICard
        title="Critical Gaps"
        value={gaps.length}
        icon={AlertTriangle}
        color="#f87171"
        glowColor="rgba(248, 113, 113, 0.06)"
      />
      <KPICard
        title="Total Tools"
        value={totalTools}
        icon={Wrench}
        color="#818cf8"
        glowColor="rgba(129, 140, 248, 0.06)"
      />
    </div>
  )
}
