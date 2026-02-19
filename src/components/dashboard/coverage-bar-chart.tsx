'use client'

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { getAssetClassMaturity } from '@/lib/utils/scores'
import { ASSET_LABELS } from '@/lib/constants/matrix'
import type { CellAssessment } from '@/lib/supabase/types'

interface CoverageBarChartProps {
  assessments: CellAssessment[]
}

export function CoverageBarChart({ assessments }: CoverageBarChartProps) {
  const maturity = getAssetClassMaturity(assessments)

  const data = Object.entries(maturity).map(([key, value]) => ({
    asset: ASSET_LABELS[key as keyof typeof ASSET_LABELS],
    maturity: value,
  }))

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-display text-base font-semibold text-foreground mb-1">Asset Class Coverage</h3>
      <p className="text-xs text-muted-foreground mb-4">Average maturity by asset class</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 140, 200, 0.06)" />
          <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis dataKey="asset" type="category" tick={{ fontSize: 12, fill: '#94a3b8' }} width={90} />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(1)}`, 'Avg Maturity']}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid rgba(100, 140, 200, 0.12)',
              background: 'rgba(14, 20, 37, 0.95)',
              color: '#e8edf5',
              backdropFilter: 'blur(12px)',
            }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Bar dataKey="maturity" fill="#22d3ee" radius={[0, 4, 4, 0]} barSize={24} fillOpacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
