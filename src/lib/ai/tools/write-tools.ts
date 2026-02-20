import { createClient } from '@/lib/supabase/server'
import { ASSET_LABELS, NIST_LABELS, MATURITY_COLORS } from '@/lib/constants/matrix'
import type { AssetClass, NistFunction } from '@/lib/constants/matrix'
import type { ChatProposal, ChatProposalDisplay } from '@/lib/supabase/types'

export async function buildWriteProposal(
  name: string,
  input: Record<string, unknown>
): Promise<ChatProposal> {
  const id = `prop_${crypto.randomUUID().slice(0, 12)}`

  switch (name) {
    case 'update_assessment':
      return buildAssessmentProposal(id, input)
    case 'add_tool_mapping':
      return buildToolMappingProposal(id, input)
    case 'remove_tool_mapping':
      return buildRemoveToolMappingProposal(id, input)
    default:
      throw new Error(`Unknown write tool: ${name}`)
  }
}

async function buildAssessmentProposal(
  id: string,
  input: Record<string, unknown>
): Promise<ChatProposal> {
  const row = input.cell_row as AssetClass
  const col = input.cell_column as NistFunction
  const newLevel = input.maturity_level as number
  const justification = input.justification as string

  // Look up current value
  const supabase = await createClient()
  const { data: current } = await supabase
    .from('cell_assessments')
    .select('maturity_level')
    .eq('project_id', input.project_id as string)
    .eq('cell_row', row)
    .eq('cell_column', col)
    .single()

  const currentLevel = current?.maturity_level ?? 0
  const currentLabel = MATURITY_COLORS[currentLevel]?.label || 'Not Assessed'
  const newLabel = MATURITY_COLORS[newLevel]?.label || 'Unknown'

  const display: ChatProposalDisplay = {
    title: 'Update Assessment',
    cell_label: `${ASSET_LABELS[row]} / ${NIST_LABELS[col]}`,
    current_value: `Level ${currentLevel} (${currentLabel})`,
    proposed_value: `Level ${newLevel} (${newLabel})`,
    tool_name: null,
    detail: justification,
  }

  return {
    id,
    action: 'update_assessment',
    params: {
      project_id: input.project_id,
      cell_row: row,
      cell_column: col,
      maturity_level: newLevel,
      justification,
    },
    display,
    status: 'pending',
    applied_at: null,
    error_message: null,
  }
}

async function buildToolMappingProposal(
  id: string,
  input: Record<string, unknown>
): Promise<ChatProposal> {
  const row = input.cell_row as AssetClass
  const col = input.cell_column as NistFunction

  // Look up tool name
  const supabase = await createClient()
  const { data: tool } = await supabase
    .from('tools')
    .select('vendor_name')
    .eq('id', input.tool_id as string)
    .single()

  const display: ChatProposalDisplay = {
    title: 'Add Tool Mapping',
    cell_label: `${ASSET_LABELS[row]} / ${NIST_LABELS[col]}`,
    current_value: null,
    proposed_value: (input.implementation_status as string) || 'planned',
    tool_name: tool?.vendor_name || 'Unknown Tool',
    detail: (input.notes as string) || null,
  }

  return {
    id,
    action: 'add_tool_mapping',
    params: {
      project_id: input.project_id,
      tool_id: input.tool_id,
      cell_row: row,
      cell_column: col,
      implementation_status: input.implementation_status || 'planned',
      notes: input.notes || null,
    },
    display,
    status: 'pending',
    applied_at: null,
    error_message: null,
  }
}

async function buildRemoveToolMappingProposal(
  id: string,
  input: Record<string, unknown>
): Promise<ChatProposal> {
  const supabase = await createClient()
  const { data: mapping } = await supabase
    .from('tool_mappings')
    .select('cell_row, cell_column, tool:tools(vendor_name)')
    .eq('id', input.mapping_id as string)
    .single()

  const toolJoin = mapping?.tool as { vendor_name?: string } | null
  const toolName = toolJoin?.vendor_name || 'Unknown Tool'

  const display: ChatProposalDisplay = {
    title: 'Remove Tool Mapping',
    cell_label: mapping
      ? `${ASSET_LABELS[mapping.cell_row as AssetClass]} / ${NIST_LABELS[mapping.cell_column as NistFunction]}`
      : null,
    current_value: toolName,
    proposed_value: 'Remove',
    tool_name: toolName,
    detail: null,
  }

  return {
    id,
    action: 'remove_tool_mapping',
    params: {
      mapping_id: input.mapping_id,
      project_id: input.project_id,
    },
    display,
    status: 'pending',
    applied_at: null,
    error_message: null,
  }
}
