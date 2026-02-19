import { createClient } from '@/lib/supabase/client'
import type { ToolMapping } from '@/lib/supabase/types'

export async function getToolMappings(projectId: string): Promise<ToolMapping[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tool_mappings')
    .select('*, tool:tools(*)')
    .eq('project_id', projectId)

  if (error) throw error
  return data || []
}
