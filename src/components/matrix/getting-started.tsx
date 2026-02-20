'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import type { CellAssessment, ToolMapping } from '@/lib/supabase/types'

interface GettingStartedProps {
  assessments: CellAssessment[]
  toolMappings: ToolMapping[]
}

export function GettingStarted({ assessments, toolMappings }: GettingStartedProps) {
  const steps = [
    {
      label: 'Click any cell',
      description: 'Open a cell to start your assessment',
      done: assessments.length > 0,
    },
    {
      label: 'Rate maturity',
      description: 'Assess maturity level from 1-5',
      done: assessments.length > 0,
    },
    {
      label: 'Add justification',
      description: 'Explain your maturity rating',
      done: assessments.some((a) => a.justification),
    },
    {
      label: 'Map tools',
      description: 'Add security tools to cells',
      done: toolMappings.length > 0,
    },
    {
      label: 'Complete assessment',
      description: 'Assess all 25 cells',
      done: assessments.length >= 25,
    },
  ]

  const allDone = steps.every((s) => s.done)
  if (allDone) return null

  return (
    <div className="mt-8 rounded-xl glass border border-cyan-500/10 p-5">
      <h3 className="text-sm font-display font-semibold text-foreground mb-3">Getting Started</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {steps.map((step) => (
          <div key={step.label} className="flex items-start gap-2">
            {step.done ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-slate-400 dark:text-slate-600 mt-0.5 shrink-0" />
            )}
            <div>
              <p className="text-xs font-medium text-foreground">{step.label}</p>
              <p className="text-[10px] text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
