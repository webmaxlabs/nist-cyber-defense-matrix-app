'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToolPickerDialog } from './tool-picker-dialog'
import { useAddToolMapping, useRemoveToolMapping } from '@/lib/hooks/use-tool-mappings'
import type { ToolMapping, Tool, AssetClass, NistFunction } from '@/lib/supabase/types'

interface ToolsTabProps {
  projectId: string
  row: AssetClass
  column: NistFunction
  toolMappings: ToolMapping[]
}

export function ToolsTab({ projectId, row, column, toolMappings }: ToolsTabProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const addMutation = useAddToolMapping()
  const removeMutation = useRemoveToolMapping()

  const handleAddTool = (tool: Tool) => {
    addMutation.mutate({
      project_id: projectId,
      tool_id: tool.id,
      cell_row: row,
      cell_column: column,
    })
  }

  const handleRemoveTool = (mappingId: string) => {
    removeMutation.mutate({ mappingId, projectId })
  }

  const existingToolIds = toolMappings.map((tm) => tm.tool_id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {toolMappings.length} tool{toolMappings.length !== 1 ? 's' : ''} mapped
        </p>
        <Button size="sm" variant="outline" onClick={() => setPickerOpen(true)} className="gap-1.5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:border-cyan-500/20 hover:text-cyan-400">
          <Plus className="h-3.5 w-3.5" />
          Add Tool
        </Button>
      </div>

      {toolMappings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 dark:border-white/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">No tools mapped to this cell yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {toolMappings.map((mapping) => (
            <div
              key={mapping.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono font-bold text-indigo-400">
                  {(mapping.tool?.vendor_name || '??').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {mapping.tool?.vendor_name || 'Unknown Tool'}
                  </p>
                  <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                    {mapping.implementation_status}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 dark:text-slate-500 hover:text-red-400 hover:bg-red-500/5"
                onClick={() => handleRemoveTool(mapping.id)}
                disabled={removeMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <ToolPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleAddTool}
        existingToolIds={existingToolIds}
      />
    </div>
  )
}
