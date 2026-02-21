import { createClient } from '@/lib/supabase/client'
import type { CreateProjectInput, UpdateProjectInput } from '@/lib/validators/project'

export async function createProject(input: CreateProjectInput) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: input.name,
      description: input.description || null,
      industry: input.industry || null,
      company_size: input.company_size || null,
      owner_id: session.user.id,
    })
    .select()
    .single()

  if (error) throw error

  // Add owner as member
  await supabase.from('project_members').insert({
    project_id: data.id,
    user_id: session.user.id,
    role: 'owner',
  })

  // Log activity
  await supabase.from('activity_log').insert({
    project_id: data.id,
    user_id: session.user.id,
    action_type: 'created',
    entity_type: 'project',
    entity_id: data.id,
    description: `Created project "${data.name}"`,
  })

  return data
}

export async function updateProject(projectId: string, input: UpdateProjectInput) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function archiveProject(projectId: string) {
  return updateProject(projectId, { archived: true })
}

export async function deleteProject(projectId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) throw error
}
