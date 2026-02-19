import { createClient } from '@/lib/supabase/client'
import type { CellAssessment } from '@/lib/supabase/types'

export async function getAssessments(projectId: string): Promise<CellAssessment[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('cell_assessments')
    .select('*')
    .eq('project_id', projectId)

  if (error) throw error
  return data || []
}
