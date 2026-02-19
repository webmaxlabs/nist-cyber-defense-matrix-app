'use client'

import { useQuery } from '@tanstack/react-query'
import { getProject } from '@/lib/queries/projects'

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId),
    enabled: !!projectId,
  })
}
