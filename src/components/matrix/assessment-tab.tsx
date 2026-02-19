'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MaturitySelector } from './maturity-selector'
import { useUpsertAssessment } from '@/lib/hooks/use-assessments'
import type { CellAssessment, AssetClass, NistFunction } from '@/lib/supabase/types'

interface AssessmentTabProps {
  projectId: string
  row: AssetClass
  column: NistFunction
  assessment: CellAssessment | undefined
}

export function AssessmentTab({ projectId, row, column, assessment }: AssessmentTabProps) {
  const [maturityLevel, setMaturityLevel] = useState<number | null>(assessment?.maturity_level ?? null)
  const [justification, setJustification] = useState(assessment?.justification || '')
  const upsertMutation = useUpsertAssessment()

  useEffect(() => {
    setMaturityLevel(assessment?.maturity_level ?? null)
    setJustification(assessment?.justification || '')
  }, [assessment])

  const handleSave = () => {
    if (!maturityLevel) return
    upsertMutation.mutate({
      project_id: projectId,
      cell_row: row,
      cell_column: column,
      maturity_level: maturityLevel,
      justification: justification || undefined,
    })
  }

  const hasChanges = maturityLevel !== (assessment?.maturity_level ?? null) ||
    justification !== (assessment?.justification || '')

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-slate-300 mb-2 block">Maturity Level</Label>
        <MaturitySelector value={maturityLevel} onChange={setMaturityLevel} />
      </div>

      <div>
        <Label htmlFor="justification" className="text-sm font-medium text-slate-300 mb-2 block">
          Justification
        </Label>
        <Textarea
          id="justification"
          placeholder="Explain why you chose this maturity level..."
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          rows={3}
          className="bg-white/5 border-white/10 text-foreground placeholder:text-slate-500 focus:border-cyan-500/40"
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={!maturityLevel || !hasChanges || upsertMutation.isPending}
        className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold"
      >
        {upsertMutation.isPending ? 'Saving...' : 'Save Assessment'}
      </Button>
    </div>
  )
}
