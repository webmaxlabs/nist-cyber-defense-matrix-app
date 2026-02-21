'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ToolMappingInput } from '@/lib/validators/assessment'
import { logActivity } from './activity'

export async function addToolMapping(input: ToolMappingInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('tool_mappings')
    .insert({
      ...input,
      added_by: user.id,
    })
    .select('*, tool:tools(*)')
    .single()

  if (error) throw new Error(error.message)

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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const admin = createAdminClient()
  const { error } = await admin
    .from('tool_mappings')
    .delete()
    .eq('id', mappingId)

  if (error) throw new Error(error.message)

  await logActivity({
    projectId,
    actionType: 'unmapped_tool',
    entityType: 'tool_mapping',
    entityId: mappingId,
    description: 'Removed tool mapping',
  })
}
