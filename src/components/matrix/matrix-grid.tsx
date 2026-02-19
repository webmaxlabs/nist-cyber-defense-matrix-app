'use client'

import { Fragment, useState } from 'react'
import { ASSET_CLASSES, NIST_FUNCTIONS, type AssetClass, type NistFunction } from '@/lib/constants/matrix'
import { MatrixColumnHeader } from './matrix-column-header'
import { MatrixRowHeader } from './matrix-row-header'
import { MatrixCell } from './matrix-cell'
import { CellDetailModal } from './cell-detail-modal'
import { ContinuumBar } from './continuum-bar'
import { GettingStarted } from './getting-started'
import { getCellAssessment, getCellToolMappings } from '@/lib/utils/matrix-helpers'
import type { CellAssessment, ToolMapping } from '@/lib/supabase/types'

interface MatrixGridProps {
  projectId: string
  assessments: CellAssessment[]
  toolMappings: ToolMapping[]
}

export function MatrixGrid({ projectId, assessments, toolMappings }: MatrixGridProps) {
  const [selectedCell, setSelectedCell] = useState<{ row: AssetClass; column: NistFunction } | null>(null)

  const selectedAssessment = selectedCell
    ? getCellAssessment(assessments, selectedCell.row, selectedCell.column)
    : undefined

  const selectedToolMappings = selectedCell
    ? getCellToolMappings(toolMappings, selectedCell.row, selectedCell.column)
    : []

  return (
    <div>
      {/* Matrix Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[140px_repeat(5,1fr)] gap-2">
            {/* Empty top-left corner */}
            <div />

            {/* Column headers */}
            {NIST_FUNCTIONS.map((col) => (
              <MatrixColumnHeader key={col} column={col} />
            ))}

            {/* Rows */}
            {ASSET_CLASSES.map((row) => (
              <Fragment key={row}>
                <MatrixRowHeader row={row} />
                {NIST_FUNCTIONS.map((col) => {
                  const assessment = getCellAssessment(assessments, row, col)
                  const cellToolMappings = getCellToolMappings(toolMappings, row, col)
                  return (
                    <MatrixCell
                      key={`${row}-${col}`}
                      row={row}
                      column={col}
                      assessment={assessment}
                      toolCount={cellToolMappings.length}
                      onClick={() => setSelectedCell({ row, column: col })}
                    />
                  )
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <ContinuumBar />
      <GettingStarted assessments={assessments} toolMappings={toolMappings} />

      {/* Cell Detail Modal */}
      {selectedCell && (
        <CellDetailModal
          open={!!selectedCell}
          onOpenChange={(open) => !open && setSelectedCell(null)}
          projectId={projectId}
          row={selectedCell.row}
          column={selectedCell.column}
          assessment={selectedAssessment}
          toolMappings={selectedToolMappings}
        />
      )}
    </div>
  )
}
