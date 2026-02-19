'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjects } from '@/lib/queries/projects'
import { createProject, archiveProject, deleteProject } from '@/lib/actions/projects'
import type { CreateProjectInput } from '@/lib/validators/project'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useArchiveProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: string) => archiveProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
