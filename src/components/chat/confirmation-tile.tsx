'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Zap, Wrench, Trash2, Loader2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { upsertAssessment } from '@/lib/actions/assessments'
import { addToolMapping, removeToolMapping } from '@/lib/actions/tool-mappings'
import { updateProposalStatus } from '@/lib/actions/conversations'
import type { ChatProposal } from '@/lib/supabase/types'
import type { CellAssessmentInput, ToolMappingInput } from '@/lib/validators/assessment'

interface ConfirmationTileProps {
  proposal: ChatProposal
  messageId: string
  onStatusChange: (proposalId: string, status: ChatProposal['status']) => void
}

const ACTION_ICONS = {
  update_assessment: Zap,
  add_tool_mapping: Wrench,
  remove_tool_mapping: Trash2,
}

const STATUS_STYLES = {
  pending: 'border-cyan-500/30 bg-cyan-500/5',
  applied: 'border-emerald-500/30 bg-emerald-500/5',
  dismissed: 'border-slate-500/20 bg-slate-500/5 opacity-60',
  error: 'border-red-500/30 bg-red-500/5',
}

export function ConfirmationTile({ proposal, messageId, onStatusChange }: ConfirmationTileProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const Icon = ACTION_ICONS[proposal.action] || Zap
  const { display } = proposal

  async function handleApply() {
    setLoading(true)
    setError(null)

    try {
      if (proposal.action === 'update_assessment') {
        await upsertAssessment(proposal.params as unknown as CellAssessmentInput)
      } else if (proposal.action === 'add_tool_mapping') {
        await addToolMapping(proposal.params as unknown as ToolMappingInput)
      } else if (proposal.action === 'remove_tool_mapping') {
        await removeToolMapping(
          proposal.params.mapping_id as string,
          proposal.params.project_id as string
        )
      }

      if (messageId) {
        await updateProposalStatus(messageId, proposal.id, 'applied').catch(() => {})
      }

      queryClient.invalidateQueries({ queryKey: ['assessments'] })
      queryClient.invalidateQueries({ queryKey: ['tool-mappings'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })

      onStatusChange(proposal.id, 'applied')
    } catch (err) {
      const msg = (err as Error).message || 'Failed to apply change'
      setError(msg)
      onStatusChange(proposal.id, 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleDismiss() {
    if (messageId) {
      await updateProposalStatus(messageId, proposal.id, 'dismissed').catch(() => {})
    }
    onStatusChange(proposal.id, 'dismissed')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-3 my-2 transition-colors ${STATUS_STYLES[proposal.status]}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-200 dark:bg-white/10">
          {proposal.status === 'applied' ? (
            <Check className="h-3 w-3 text-emerald-400" />
          ) : (
            <Icon className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
          )}
        </div>
        <span className="text-xs font-display font-semibold text-foreground">
          {display.title}
        </span>
        {proposal.status === 'applied' && (
          <span className="text-xs text-emerald-400 ml-auto">Applied</span>
        )}
        {proposal.status === 'dismissed' && (
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">Dismissed</span>
        )}
      </div>

      {/* Cell label */}
      {display.cell_label && (
        <p className="text-sm font-medium text-foreground mb-1">{display.cell_label}</p>
      )}

      {/* Diff: current -> proposed (assessment) */}
      {display.current_value && display.proposed_value && proposal.action === 'update_assessment' && (
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="text-slate-500 dark:text-slate-400">{display.current_value}</span>
          <span className="text-slate-400 dark:text-slate-500">&rarr;</span>
          <span className="text-cyan-600 dark:text-cyan-400 font-medium">{display.proposed_value}</span>
        </div>
      )}

      {/* Tool mapping info */}
      {display.tool_name && proposal.action !== 'update_assessment' && (
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="font-medium text-foreground">{display.tool_name}</span>
          {display.proposed_value && proposal.action === 'add_tool_mapping' && (
            <>
              <span className="text-slate-400 dark:text-slate-500">&rarr;</span>
              <span className="text-slate-600 dark:text-slate-400">Status: {display.proposed_value}</span>
            </>
          )}
          {proposal.action === 'remove_tool_mapping' && (
            <span className="text-red-400">&rarr; Remove</span>
          )}
        </div>
      )}

      {/* Justification / detail */}
      {display.detail && (
        <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1">
          &ldquo;{display.detail}&rdquo;
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}

      {/* Actions - pending */}
      {proposal.status === 'pending' && (
        <div className="flex items-center gap-2 mt-3">
          <Button
            size="sm"
            className="h-7 text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950"
            onClick={handleApply}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <Check className="h-3 w-3 mr-1" />
            )}
            Apply
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            onClick={handleDismiss}
            disabled={loading}
          >
            <X className="h-3 w-3 mr-1" />
            Dismiss
          </Button>
        </div>
      )}

      {/* Retry on error */}
      {proposal.status === 'error' && (
        <div className="flex items-center gap-2 mt-3">
          <Button
            size="sm"
            className="h-7 text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950"
            onClick={handleApply}
            disabled={loading}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </div>
      )}
    </motion.div>
  )
}
