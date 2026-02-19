'use client'

import { ActivityFeedItem } from './activity-feed-item'
import { useActivityLog } from '@/lib/hooks/use-activity-log'
import { useRealtimeActivity } from '@/lib/hooks/use-realtime'
import { Activity } from 'lucide-react'

interface ActivityFeedProps {
  projectId: string
}

export function ActivityFeed({ projectId }: ActivityFeedProps) {
  const { data: entries } = useActivityLog(projectId)
  useRealtimeActivity(projectId)

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-cyan-400" />
        <h3 className="font-display text-base font-semibold text-foreground">Recent Activity</h3>
      </div>
      {!entries || entries.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">No activity yet</p>
      ) : (
        <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto">
          {entries.map((entry) => (
            <ActivityFeedItem key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
