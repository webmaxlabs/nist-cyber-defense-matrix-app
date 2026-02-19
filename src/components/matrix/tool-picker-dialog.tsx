'use client'

import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ToolPickerItem } from './tool-picker-item'
import { useTools } from '@/lib/hooks/use-tools'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import type { Tool } from '@/lib/supabase/types'
import { Search } from 'lucide-react'

interface ToolPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (tool: Tool) => void
  existingToolIds: string[]
}

export function ToolPickerDialog({ open, onOpenChange, onSelect, existingToolIds }: ToolPickerDialogProps) {
  const [search, setSearch] = useState('')
  const { data: tools, isLoading } = useTools()

  const filteredTools = useMemo(() => {
    if (!tools) return []
    return tools
      .filter((t) => !existingToolIds.includes(t.id))
      .filter((t) =>
        t.vendor_name.toLowerCase().includes(search.toLowerCase()) ||
        (t.category || '').toLowerCase().includes(search.toLowerCase())
      )
  }, [tools, search, existingToolIds])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md glass border-white/10">
        <DialogHeader>
          <DialogTitle className="font-display">Add Tool</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-foreground placeholder:text-slate-500 focus:border-cyan-500/40"
          />
        </div>

        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <LoadingSpinner className="py-8" />
          ) : filteredTools.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No tools found</p>
          ) : (
            <div className="space-y-2 pr-3">
              {filteredTools.map((tool) => (
                <ToolPickerItem
                  key={tool.id}
                  tool={tool}
                  onSelect={(t) => {
                    onSelect(t)
                    onOpenChange(false)
                    setSearch('')
                  }}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
