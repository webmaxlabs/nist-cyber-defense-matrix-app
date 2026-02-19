import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/lib/supabase/types'

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('archived', false)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getProject(projectId: string): Promise<Project | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) throw error
  return data
}

export async function getArchivedProjects(): Promise<Project[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('archived', true)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data || []
}
