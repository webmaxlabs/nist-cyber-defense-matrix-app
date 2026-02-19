'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getToolMappings } from '@/lib/queries/tool-mappings'
import { addToolMapping, removeToolMapping } from '@/lib/actions/tool-mappings'
import type { ToolMappingInput } from '@/lib/validators/assessment'

export function useToolMappings(projectId: string) {
  return useQuery({
    queryKey: ['tool-mappings', projectId],
    queryFn: () => getToolMappings(projectId),
    enabled: !!projectId,
  })
}

export function useAddToolMapping() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ToolMappingInput) => addToolMapping(input),
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({ queryKey: ['tool-mappings', input.project_id] })
    },
  })
}

export function useRemoveToolMapping() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ mappingId, projectId }: { mappingId: string; projectId: string }) =>
      removeToolMapping(mappingId, projectId),
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['tool-mappings', projectId] })
    },
  })
}
