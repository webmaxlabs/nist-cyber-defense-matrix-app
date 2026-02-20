import { z } from 'zod'
import { ASSET_CLASSES, NIST_FUNCTIONS } from '@/lib/constants/matrix'
import { sanitizeText } from '@/lib/utils/sanitize'

export const cellAssessmentSchema = z.object({
  project_id: z.string().uuid(),
  cell_row: z.enum(ASSET_CLASSES),
  cell_column: z.enum(NIST_FUNCTIONS),
  maturity_level: z.number().int().min(1).max(5),
  justification: z.string().max(2000).transform(sanitizeText).optional(),
})

export const toolMappingSchema = z.object({
  project_id: z.string().uuid(),
  tool_id: z.string().uuid(),
  cell_row: z.enum(ASSET_CLASSES),
  cell_column: z.enum(NIST_FUNCTIONS),
  implementation_status: z.enum(['planned', 'in_progress', 'implemented', 'optimized']).optional(),
  notes: z.string().max(1000).transform(sanitizeText).optional(),
})

export type CellAssessmentInput = z.infer<typeof cellAssessmentSchema>
export type ToolMappingInput = z.infer<typeof toolMappingSchema>
