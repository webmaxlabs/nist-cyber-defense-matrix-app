import { createClient } from '@/lib/supabase/client'
import type { CellAssessmentInput } from '@/lib/validators/assessment'
import { logActivity } from './activity'
import { ASSET_LABELS, NIST_LABELS } from '@/lib/constants/matrix'

export async function upsertAssessment(input: CellAssessmentInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('cell_assessments')
    .upsert(
      {
        project_id: input.project_id,
        cell_row: input.cell_row,
        cell_column: input.cell_column,
        maturity_level: input.maturity_level,
        justification: input.justification || null,
        assessed_by: user?.id,
        last_assessment_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'project_id,cell_row,cell_column' }
    )
    .select()
    .single()

  if (error) throw error

  await logActivity({
    projectId: input.project_id,
    actionType: 'assessed',
    entityType: 'assessment',
    entityId: data.id,
    description: `Assessed ${ASSET_LABELS[input.cell_row]} / ${NIST_LABELS[input.cell_column]} as Level ${input.maturity_level}`,
  })

  return data
}
