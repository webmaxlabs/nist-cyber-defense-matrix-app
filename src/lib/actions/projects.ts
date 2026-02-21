'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { CreateProjectInput, UpdateProjectInput } from '@/lib/validators/project'

type ActionResult<T> = { data: T; error: null } | { data: null; error: string }

export async function createProject(input: CreateProjectInput): Promise<ActionResult<{ id: string; name: string }>> {
  try {
    // Verify auth server-side with the user's JWT
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    // Use admin client for writes — auth verified above, admin bypasses RLS
    const admin = createAdminClient()

    const { data, error } = await admin
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
    const { error: memberError } = await admin.from('project_members').insert({
      project_id: data.id,
      user_id: user.id,
      role: 'owner',
    })
    if (memberError) console.error('Failed to add owner as member:', memberError.message)

    // Log activity
    await admin.from('activity_log').insert({
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'Not authenticated' }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('projects')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .eq('owner_id', user.id)
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const admin = createAdminClient()
    const { error } = await admin
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('owner_id', user.id)

    if (error) return { error: error.message }
    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error deleting project' }
  }
}
