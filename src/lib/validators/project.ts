import { z } from 'zod'
import { INDUSTRIES } from '@/lib/constants/industries'
import { COMPANY_SIZES } from '@/lib/constants/company-sizes'
import { sanitizeText } from '@/lib/utils/sanitize'

const industryValues = INDUSTRIES.map((i) => i.value) as [string, ...string[]]
const companySizeValues = COMPANY_SIZES.map((s) => s.value) as [string, ...string[]]

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long').transform(sanitizeText),
  description: z.string().max(500, 'Description too long').transform(sanitizeText).optional(),
  industry: z.enum(industryValues).optional(),
  company_size: z.enum(companySizeValues).optional(),
})

export const updateProjectSchema = createProjectSchema.partial().extend({
  archived: z.boolean().optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
