import { createClient } from '@/lib/supabase/client'
import type { ToolMappingInput } from '@/lib/validators/assessment'
import { logActivity } from './activity'

export async function addToolMapping(input: ToolMappingInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('tool_mappings')
    .insert({
      ...input,
      added_by: user?.id,
    })
    .select('*, tool:tools(*)')
    .single()

  if (error) throw error

  await logActivity({
    projectId: input.project_id,
    actionType: 'mapped_tool',
    entityType: 'tool_mapping',
    entityId: data.id,
    description: `Mapped tool to ${input.cell_row} / ${input.cell_column}`,
  })

  return data
}

export async function removeToolMapping(mappingId: string, projectId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('tool_mappings')
    .delete()
    .eq('id', mappingId)

  if (error) throw error

  await logActivity({
    projectId,
    actionType: 'unmapped_tool',
    entityType: 'tool_mapping',
    entityId: mappingId,
    description: 'Removed tool mapping',
  })
}
