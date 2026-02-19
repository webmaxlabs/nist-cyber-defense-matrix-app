'use client'

import { useQuery } from '@tanstack/react-query'
import { getTools } from '@/lib/queries/tools'

export function useTools() {
  return useQuery({
    queryKey: ['tools'],
    queryFn: getTools,
    staleTime: 5 * 60 * 1000,
  })
}
