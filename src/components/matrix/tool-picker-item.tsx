import { Badge } from '@/components/ui/badge'
import type { Tool } from '@/lib/supabase/types'

interface ToolPickerItemProps {
  tool: Tool
  onSelect: (tool: Tool) => void
}

export function ToolPickerItem({ tool, onSelect }: ToolPickerItemProps) {
  return (
    <button
      onClick={() => onSelect(tool)}
      className="w-full flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-left hover:bg-white/5 hover:border-cyan-500/20 transition-all"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono font-bold text-indigo-400 shrink-0">
        {tool.vendor_name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{tool.vendor_name}</p>
        {tool.category && (
          <Badge variant="secondary" className="text-[10px] mt-0.5 bg-white/5 text-slate-400 border border-white/10">
            {tool.category}
          </Badge>
        )}
      </div>
    </button>
  )
}
