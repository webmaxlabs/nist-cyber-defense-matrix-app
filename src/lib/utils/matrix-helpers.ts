import type { CellAssessment, ToolMapping } from '@/lib/supabase/types'
import type { AssetClass, NistFunction } from '@/lib/constants/matrix'

export function getCellAssessment(
  assessments: CellAssessment[],
  row: AssetClass,
  column: NistFunction
): CellAssessment | undefined {
  return assessments.find(a => a.cell_row === row && a.cell_column === column)
}

export function getCellToolMappings(
  toolMappings: ToolMapping[],
  row: AssetClass,
  column: NistFunction
): ToolMapping[] {
  return toolMappings.filter(tm => tm.cell_row === row && tm.cell_column === column)
}

export function getCellKey(row: AssetClass, column: NistFunction): string {
  return `${row}:${column}`
}

export function parseCellKey(key: string): { row: AssetClass; column: NistFunction } {
  const [row, column] = key.split(':')
  return { row: row as AssetClass, column: column as NistFunction }
}

export function getMaturityColor(level: number): string {
  switch (level) {
    case 1: return '#ef4444'
    case 2: return '#f97316'
    case 3: return '#eab308'
    case 4: return '#3b82f6'
    case 5: return '#22c55e'
    default: return '#e5e7eb'
  }
}

export function getMaturityBgClass(level: number): string {
  switch (level) {
    case 1: return 'bg-red-50 border-red-200'
    case 2: return 'bg-orange-50 border-orange-200'
    case 3: return 'bg-yellow-50 border-yellow-200'
    case 4: return 'bg-blue-50 border-blue-200'
    case 5: return 'bg-green-50 border-green-200'
    default: return 'bg-gray-50 border-gray-200'
  }
}
