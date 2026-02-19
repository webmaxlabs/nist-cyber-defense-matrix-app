import { createClient } from '@/lib/supabase/client'
import type { Tool } from '@/lib/supabase/types'

export async function getTools(): Promise<Tool[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('popularity_rank', { ascending: true })

  if (error) throw error
  return data || []
}

export async function searchTools(query: string): Promise<Tool[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .ilike('vendor_name', `%${query}%`)
    .order('popularity_rank', { ascending: true })
    .limit(20)

  if (error) throw error
  return data || []
}
