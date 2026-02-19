import { createClient } from '@/lib/supabase/client'
import type { ActivityLogEntry } from '@/lib/supabase/types'

export async function getActivityLog(projectId: string, limit = 20): Promise<ActivityLogEntry[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activity_log')
    .select('*, profile:profiles(*)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}
