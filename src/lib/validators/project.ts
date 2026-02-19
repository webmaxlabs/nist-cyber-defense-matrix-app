import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  industry: z.string().optional(),
  company_size: z.string().optional(),
})

export const updateProjectSchema = createProjectSchema.partial().extend({
  archived: z.boolean().optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
