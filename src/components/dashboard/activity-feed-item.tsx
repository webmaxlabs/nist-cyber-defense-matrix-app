import { timeAgo } from '@/lib/utils/format'
import type { ActivityLogEntry } from '@/lib/supabase/types'

interface ActivityFeedItemProps {
  entry: ActivityLogEntry
}

const actionColors: Record<string, string> = {
  created: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  updated: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  deleted: 'bg-red-500/15 text-red-400 border-red-500/20',
  assessed: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  mapped_tool: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  unmapped_tool: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  invited: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  commented: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
}

export function ActivityFeedItem({ entry }: ActivityFeedItemProps) {
  const colorClass = actionColors[entry.action_type] || 'bg-white/5 text-slate-400 border-white/10'

  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-mono font-bold shrink-0 border ${colorClass}`}>
        {entry.action_type.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300 line-clamp-2">{entry.description || `${entry.action_type} ${entry.entity_type}`}</p>
        <p className="text-xs text-slate-600 mt-0.5 font-mono">{timeAgo(entry.created_at)}</p>
      </div>
    </div>
  )
}
