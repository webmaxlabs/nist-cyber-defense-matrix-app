import { createClient } from '@/lib/supabase/server'
import { ASSET_CLASSES, NIST_FUNCTIONS, ASSET_LABELS, NIST_LABELS, MATURITY_COLORS } from '@/lib/constants/matrix'
import { SECURITY_TOOLS } from '@/lib/data/security-tools'
import type { AssetClass, NistFunction } from '@/lib/supabase/types'

export async function executeReadTool(
  name: string,
  input: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case 'get_project_summary':
      return getProjectSummary(input.project_id as string)
    case 'get_assessments':
      return getAssessments(
        input.project_id as string,
        input.cell_row as AssetClass | undefined,
        input.cell_column as NistFunction | undefined
      )
    case 'get_tool_mappings':
      return getToolMappings(
        input.project_id as string,
        input.cell_row as AssetClass | undefined,
        input.cell_column as NistFunction | undefined
      )
    case 'get_gap_analysis':
      return getGapAnalysis(input.project_id as string)
    case 'compare_projects':
      return compareProjects(input.project_ids as string[])
    case 'search_tools':
      return searchToolsCatalog(input)
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` })
  }
}

async function getProjectSummary(projectId: string): Promise<string> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) return JSON.stringify({ error: error.message })

  return JSON.stringify({
    name: data.name,
    description: data.description,
    industry: data.industry,
    company_size: data.company_size,
    overall_score: data.overall_score,
    coverage_percentage: data.coverage_percentage,
    is_template: data.is_template,
    created_at: data.created_at,
    updated_at: data.updated_at,
  })
}

async function getAssessments(
  projectId: string,
  cellRow?: AssetClass,
  cellColumn?: NistFunction
): Promise<string> {
  const supabase = await createClient()
  let query = supabase
    .from('cell_assessments')
    .select('*')
    .eq('project_id', projectId)

  if (cellRow) query = query.eq('cell_row', cellRow)
  if (cellColumn) query = query.eq('cell_column', cellColumn)

  const { data, error } = await query
  if (error) return JSON.stringify({ error: error.message })

  const formatted = (data || []).map((a) => ({
    cell: `${ASSET_LABELS[a.cell_row as AssetClass]} / ${NIST_LABELS[a.cell_column as NistFunction]}`,
    cell_row: a.cell_row,
    cell_column: a.cell_column,
    maturity_level: a.maturity_level,
    maturity_label: MATURITY_COLORS[a.maturity_level]?.label || 'Unknown',
    justification: a.justification,
    last_assessment_date: a.last_assessment_date,
  }))

  return JSON.stringify({ assessments: formatted, count: formatted.length })
}

async function getToolMappings(
  projectId: string,
  cellRow?: AssetClass,
  cellColumn?: NistFunction
): Promise<string> {
  const supabase = await createClient()
  let query = supabase
    .from('tool_mappings')
    .select('*, tool:tools(*)')
    .eq('project_id', projectId)

  if (cellRow) query = query.eq('cell_row', cellRow)
  if (cellColumn) query = query.eq('cell_column', cellColumn)

  const { data, error } = await query
  if (error) return JSON.stringify({ error: error.message })

  const formatted = (data || []).map((m) => ({
    mapping_id: m.id,
    cell: `${ASSET_LABELS[m.cell_row as AssetClass]} / ${NIST_LABELS[m.cell_column as NistFunction]}`,
    cell_row: m.cell_row,
    cell_column: m.cell_column,
    tool_name: (m.tool as unknown as { vendor_name?: string })?.vendor_name || 'Unknown',
    tool_id: m.tool_id,
    tool_category: (m.tool as unknown as { category?: string })?.category,
    implementation_status: m.implementation_status,
    effectiveness_rating: m.effectiveness_rating,
    is_primary: m.is_primary,
    notes: m.notes,
  }))

  return JSON.stringify({ tool_mappings: formatted, count: formatted.length })
}

async function getGapAnalysis(projectId: string): Promise<string> {
  const supabase = await createClient()

  const { data: assessments } = await supabase
    .from('cell_assessments')
    .select('cell_row, cell_column, maturity_level')
    .eq('project_id', projectId)

  const { data: mappings } = await supabase
    .from('tool_mappings')
    .select('cell_row, cell_column')
    .eq('project_id', projectId)

  const assessedCells = new Set(
    (assessments || []).map((a) => `${a.cell_row}:${a.cell_column}`)
  )
  const mappedCells = new Set(
    (mappings || []).map((m) => `${m.cell_row}:${m.cell_column}`)
  )

  const unassessed: string[] = []
  const lowMaturity: Array<{ cell: string; level: number; label: string }> = []
  const noTools: string[] = []

  for (const row of ASSET_CLASSES) {
    for (const col of NIST_FUNCTIONS) {
      const key = `${row}:${col}`
      const label = `${ASSET_LABELS[row]} / ${NIST_LABELS[col]}`

      if (!assessedCells.has(key)) {
        unassessed.push(label)
      } else {
        const assessment = (assessments || []).find(
          (a) => a.cell_row === row && a.cell_column === col
        )
        if (assessment && assessment.maturity_level <= 2) {
          lowMaturity.push({
            cell: label,
            level: assessment.maturity_level,
            label: MATURITY_COLORS[assessment.maturity_level]?.label || 'Unknown',
          })
        }
      }

      if (!mappedCells.has(key)) {
        noTools.push(label)
      }
    }
  }

  return JSON.stringify({
    total_cells: 25,
    assessed_cells: assessedCells.size,
    unassessed_cells: unassessed,
    low_maturity_cells: lowMaturity,
    cells_without_tools: noTools,
  })
}

async function compareProjects(projectIds: string[]): Promise<string> {
  const supabase = await createClient()

  // Batch queries instead of N+1
  const [{ data: projects }, { data: allAssessments }] = await Promise.all([
    supabase.from('projects').select('id, name, overall_score, coverage_percentage').in('id', projectIds),
    supabase.from('cell_assessments').select('project_id, cell_row, cell_column, maturity_level').in('project_id', projectIds),
  ])

  const projectMap = new Map((projects || []).map((p) => [p.id, p]))
  const assessmentsByProject = new Map<string, typeof allAssessments>()
  for (const a of allAssessments || []) {
    const list = assessmentsByProject.get(a.project_id) || []
    list.push(a)
    assessmentsByProject.set(a.project_id, list)
  }

  const results = projectIds.map((id) => {
    const project = projectMap.get(id)
    const assessments = assessmentsByProject.get(id) || []

    const cells: Record<string, number> = {}
    for (const a of assessments) {
      cells[`${ASSET_LABELS[a.cell_row as AssetClass]} / ${NIST_LABELS[a.cell_column as NistFunction]}`] = a.maturity_level
    }

    return {
      project_id: id,
      project_name: project?.name || 'Unknown',
      overall_score: project?.overall_score || 0,
      coverage_percentage: project?.coverage_percentage || 0,
      cells,
    }
  })

  return JSON.stringify({ comparison: results })
}

function searchToolsCatalog(input: Record<string, unknown>): string {
  let results = [...SECURITY_TOOLS]

  const query = (input.query as string || '').toLowerCase()
  if (query) {
    results = results.filter(
      (t) =>
        t.vendorName.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.keyProducts.some((p) => p.toLowerCase().includes(query))
    )
  }

  if (input.category) {
    const cat = (input.category as string).toLowerCase()
    results = results.filter((t) => t.category.toLowerCase().includes(cat))
  }

  if (input.cost_range) {
    results = results.filter((t) => t.costRange === input.cost_range)
  }

  if (input.cell_row || input.cell_column) {
    results = results.filter((t) =>
      t.coverageCells.some(
        (c) =>
          (!input.cell_row || c.row === input.cell_row) &&
          (!input.cell_column || c.column === input.cell_column)
      )
    )
  }

  const formatted = results.slice(0, 15).map((t) => ({
    id: t.id,
    name: t.vendorName,
    category: t.category,
    description: t.description,
    key_products: t.keyProducts,
    coverage_cells: t.coverageCells.map(
      (c) => `${ASSET_LABELS[c.row]} / ${NIST_LABELS[c.column]}`
    ),
    cost_range: t.costRange,
    popularity_rank: t.popularityRank,
  }))

  return JSON.stringify({ tools: formatted, total_matches: results.length })
}
