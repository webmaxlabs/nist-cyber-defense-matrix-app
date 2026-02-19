'use client'

import { useQuery } from '@tanstack/react-query'
import { getActivityLog } from '@/lib/queries/activity'

export function useActivityLog(projectId: string) {
  return useQuery({
    queryKey: ['activity', projectId],
    queryFn: () => getActivityLog(projectId),
    enabled: !!projectId,
  })
}
