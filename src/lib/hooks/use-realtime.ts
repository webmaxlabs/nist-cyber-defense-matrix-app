'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeAssessments(projectId: string) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`assessments:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cell_assessments',
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['assessments', projectId] })
          queryClient.invalidateQueries({ queryKey: ['project', projectId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, queryClient, supabase])
}

export function useRealtimeToolMappings(projectId: string) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`tool-mappings:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tool_mappings',
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tool-mappings', projectId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, queryClient, supabase])
}

export function useRealtimeActivity(projectId: string) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`activity:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_log',
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['activity', projectId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, queryClient, supabase])
}
