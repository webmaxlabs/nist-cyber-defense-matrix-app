'use server'

import { createClient } from '@/lib/supabase/server'
import type { CreateProjectInput, UpdateProjectInput } from '@/lib/validators/project'

type ActionResult<T> = { data: T; error: null } | { data: null; error: string }

export async function createProject(input: CreateProjectInput): Promise<ActionResult<{ id: string; name: string }>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: input.name,
        description: input.description || null,
        industry: input.industry || null,
        company_size: input.company_size || null,
        owner_id: user.id,
      })
      .select()
      .single()

    if (error) return { data: null, error: error.message }

    // Add owner as member
    const { error: memberError } = await supabase.from('project_members').insert({
      project_id: data.id,
      user_id: user.id,
      role: 'owner',
    })
    if (memberError) console.error('Failed to add owner as member:', memberError.message)

    // Log activity
    await supabase.from('activity_log').insert({
      project_id: data.id,
      user_id: user.id,
      action_type: 'created',
      entity_type: 'project',
      entity_id: data.id,
      description: `Created project "${data.name}"`,
    })

    return { data, error: null }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Unknown error creating project' }
  }
}

export async function updateProject(projectId: string, input: UpdateProjectInput): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('projects')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data, error: null }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Unknown error updating project' }
  }
}

export async function archiveProject(projectId: string) {
  return updateProject(projectId, { archived: true })
}

export async function deleteProject(projectId: string): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error deleting project' }
  }
}
