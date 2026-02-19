'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAssessments } from '@/lib/queries/assessments'
import { upsertAssessment } from '@/lib/actions/assessments'
import type { CellAssessmentInput } from '@/lib/validators/assessment'
import type { CellAssessment } from '@/lib/supabase/types'

export function useAssessments(projectId: string) {
  return useQuery({
    queryKey: ['assessments', projectId],
    queryFn: () => getAssessments(projectId),
    enabled: !!projectId,
  })
}

export function useUpsertAssessment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CellAssessmentInput) => upsertAssessment(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['assessments', input.project_id] })
      const previous = queryClient.getQueryData<CellAssessment[]>(['assessments', input.project_id])

      queryClient.setQueryData<CellAssessment[]>(['assessments', input.project_id], (old) => {
        if (!old) return []
        const existing = old.findIndex(
          (a) => a.cell_row === input.cell_row && a.cell_column === input.cell_column
        )
        const optimistic: CellAssessment = {
          id: existing >= 0 ? old[existing].id : 'temp',
          project_id: input.project_id,
          cell_row: input.cell_row,
          cell_column: input.cell_column,
          maturity_level: input.maturity_level,
          justification: input.justification || null,
          assessed_by: null,
          last_assessment_date: new Date().toISOString(),
          created_at: existing >= 0 ? old[existing].created_at : new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        if (existing >= 0) {
          const updated = [...old]
          updated[existing] = optimistic
          return updated
        }
        return [...old, optimistic]
      })

      return { previous }
    },
    onError: (_err, input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['assessments', input.project_id], context.previous)
      }
    },
    onSettled: (_data, _err, input) => {
      queryClient.invalidateQueries({ queryKey: ['assessments', input.project_id] })
      queryClient.invalidateQueries({ queryKey: ['project', input.project_id] })
    },
  })
}
