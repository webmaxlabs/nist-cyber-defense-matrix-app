'use client'

import { MessageSquare, Trash2 } from 'lucide-react'
import { formatDistanceToNow, isToday, isYesterday, subDays, isAfter } from 'date-fns'
import { useConversations, useDeleteConversation } from '@/lib/hooks/use-conversations'
import { useChatContext } from '@/providers/chat-provider'
import type { ConversationWithProjects } from '@/lib/queries/conversations'

interface GroupedConversations {
  label: string
  conversations: ConversationWithProjects[]
}

function groupByDate(conversations: ConversationWithProjects[]): GroupedConversations[] {
  const groups: GroupedConversations[] = []
  const today: ConversationWithProjects[] = []
  const yesterday: ConversationWithProjects[] = []
  const lastWeek: ConversationWithProjects[] = []
  const older: ConversationWithProjects[] = []
  const sevenDaysAgo = subDays(new Date(), 7)

  for (const conv of conversations) {
    const date = new Date(conv.updated_at)
    if (isToday(date)) {
      today.push(conv)
    } else if (isYesterday(date)) {
      yesterday.push(conv)
    } else if (isAfter(date, sevenDaysAgo)) {
      lastWeek.push(conv)
    } else {
      older.push(conv)
    }
  }

  if (today.length > 0) groups.push({ label: 'Today', conversations: today })
  if (yesterday.length > 0) groups.push({ label: 'Yesterday', conversations: yesterday })
  if (lastWeek.length > 0) groups.push({ label: 'Previous 7 Days', conversations: lastWeek })
  if (older.length > 0) groups.push({ label: 'Older', conversations: older })

  return groups
}

export function ConversationList() {
  const { data: conversations, isLoading } = useConversations()
  const { activeConversationId, setActiveConversation } = useChatContext()
  const deleteConversation = useDeleteConversation()

  if (isLoading) {
    return (
      <div className="px-3 py-4">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded bg-slate-100 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="px-3 py-6 text-center">
        <MessageSquare className="h-5 w-5 text-slate-400 mx-auto mb-2" />
        <p className="text-xs text-slate-500">No conversations yet</p>
      </div>
    )
  }

  const groups = groupByDate(conversations)

  return (
    <div className="flex-1 overflow-y-auto px-2 py-2">
      {groups.map((group) => (
        <div key={group.label} className="mb-3">
          <p className="text-[10px] font-display font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`group w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  activeConversationId === conv.id
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <MessageSquare className="h-3 w-3 shrink-0 opacity-50" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate">
                    {conv.title || 'New conversation'}
                  </p>
                  <div className="flex items-center gap-1">
                    {conv.projects?.length > 0 && (
                      <div className="flex items-center gap-0.5">
                        {conv.projects.slice(0, 3).map((p) => (
                          <span
                            key={p.project_id}
                            className="h-1.5 w-1.5 rounded-full bg-cyan-400/60"
                            title={p.project_name}
                          />
                        ))}
                        {conv.projects.length > 3 && (
                          <span className="text-[9px] text-slate-400">+{conv.projects.length - 3}</span>
                        )}
                      </div>
                    )}
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteConversation.mutate(conv.id)
                    if (activeConversationId === conv.id) {
                      setActiveConversation(null)
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition-all"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
