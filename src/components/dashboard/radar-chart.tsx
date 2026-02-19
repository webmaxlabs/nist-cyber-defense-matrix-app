'use client'

import { ResponsiveContainer, RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { getNistFunctionMaturity } from '@/lib/utils/scores'
import { NIST_LABELS } from '@/lib/constants/matrix'
import type { CellAssessment } from '@/lib/supabase/types'

interface RadarChartProps {
  assessments: CellAssessment[]
}

export function NistRadarChart({ assessments }: RadarChartProps) {
  const maturity = getNistFunctionMaturity(assessments)

  const data = Object.entries(maturity).map(([key, value]) => ({
    function: NIST_LABELS[key as keyof typeof NIST_LABELS],
    maturity: value,
    fullMark: 5,
  }))

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-display text-base font-semibold text-foreground mb-1">NIST Function Maturity</h3>
      <p className="text-xs text-muted-foreground mb-4">Average maturity per NIST function</p>
      <ResponsiveContainer width="100%" height={280}>
        <ReRadarChart data={data}>
          <PolarGrid stroke="rgba(100, 140, 200, 0.10)" />
          <PolarAngleAxis dataKey="function" tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'var(--font-dm-sans)' }} />
          <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10, fill: '#64748b' }} />
          <Radar
            name="Maturity"
            dataKey="maturity"
            stroke="#22d3ee"
            fill="#22d3ee"
            fillOpacity={0.12}
            strokeWidth={2}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
