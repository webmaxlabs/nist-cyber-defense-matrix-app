import type { CellAssessment } from '@/lib/supabase/types'
import { ASSET_CLASSES, NIST_FUNCTIONS, type AssetClass, type NistFunction } from '@/lib/constants/matrix'

export function calculateOverallScore(assessments: CellAssessment[]): number {
  if (assessments.length === 0) return 0
  const sum = assessments.reduce((acc, a) => acc + a.maturity_level, 0)
  return Math.round((sum / assessments.length) * 100) / 100
}

export function calculateCoverage(assessments: CellAssessment[]): number {
  return Math.round((assessments.length / 25) * 100)
}

export function getMatureCells(assessments: CellAssessment[], threshold = 4): number {
  return assessments.filter(a => a.maturity_level >= threshold).length
}

export function getCriticalGaps(assessments: CellAssessment[], threshold = 2): CellAssessment[] {
  return assessments.filter(a => a.maturity_level <= threshold)
}

export function getUnassessedCells(assessments: CellAssessment[]): Array<{ row: AssetClass; column: NistFunction }> {
  const assessed = new Set(assessments.map(a => `${a.cell_row}:${a.cell_column}`))
  const unassessed: Array<{ row: AssetClass; column: NistFunction }> = []

  for (const row of ASSET_CLASSES) {
    for (const col of NIST_FUNCTIONS) {
      if (!assessed.has(`${row}:${col}`)) {
        unassessed.push({ row, column: col })
      }
    }
  }

  return unassessed
}

export function getNistFunctionMaturity(assessments: CellAssessment[]): Record<NistFunction, number> {
  const result = {} as Record<NistFunction, number>
  for (const func of NIST_FUNCTIONS) {
    const funcAssessments = assessments.filter(a => a.cell_column === func)
    result[func] = funcAssessments.length > 0
      ? Math.round((funcAssessments.reduce((sum, a) => sum + a.maturity_level, 0) / funcAssessments.length) * 100) / 100
      : 0
  }
  return result
}

export function getAssetClassMaturity(assessments: CellAssessment[]): Record<AssetClass, number> {
  const result = {} as Record<AssetClass, number>
  for (const asset of ASSET_CLASSES) {
    const assetAssessments = assessments.filter(a => a.cell_row === asset)
    result[asset] = assetAssessments.length > 0
      ? Math.round((assetAssessments.reduce((sum, a) => sum + a.maturity_level, 0) / assetAssessments.length) * 100) / 100
      : 0
  }
  return result
}
