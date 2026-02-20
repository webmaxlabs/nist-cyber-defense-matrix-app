'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AssessmentTab } from './assessment-tab'
import { ToolsTab } from './tools-tab'
import { LearnTab } from './learn-tab'
import { ASSET_LABELS, NIST_LABELS, type AssetClass, type NistFunction } from '@/lib/constants/matrix'
import type { CellAssessment, ToolMapping } from '@/lib/supabase/types'

interface CellDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  row: AssetClass
  column: NistFunction
  assessment: CellAssessment | undefined
  toolMappings: ToolMapping[]
}

export function CellDetailModal({
  open,
  onOpenChange,
  projectId,
  row,
  column,
  assessment,
  toolMappings,
}: CellDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto glass border-slate-200 dark:border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <span className="text-indigo-400">{ASSET_LABELS[row]}</span>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-cyan-400">{NIST_LABELS[column]}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="assessment" className="mt-2">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-white/5">
            <TabsTrigger value="assessment" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">Assessment</TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">
              Tools ({toolMappings.length})
            </TabsTrigger>
            <TabsTrigger value="learn" className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400">Learn</TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="mt-4">
            <AssessmentTab
              projectId={projectId}
              row={row}
              column={column}
              assessment={assessment}
            />
          </TabsContent>

          <TabsContent value="tools" className="mt-4">
            <ToolsTab
              projectId={projectId}
              row={row}
              column={column}
              toolMappings={toolMappings}
            />
          </TabsContent>

          <TabsContent value="learn" className="mt-4">
            <LearnTab row={row} column={column} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
