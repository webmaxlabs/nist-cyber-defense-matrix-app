import { Shield } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import type { Project } from '@/lib/supabase/types'

interface ReportHeaderProps {
  project: Project
}

export function ReportHeader({ project }: ReportHeaderProps) {
  return (
    <div className="text-center border-b border-slate-200 dark:border-white/10 pb-8 mb-8 print:border-gray-300">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Shield className="h-8 w-8 text-cyan-400 print:text-blue-600" />
        <span className="text-2xl font-display font-bold text-foreground print:text-black">DefenseMatrix</span>
      </div>
      <h1 className="text-3xl font-display font-bold text-foreground mb-2 print:text-black">{project.name}</h1>
      <p className="text-muted-foreground print:text-gray-500">Security Assessment Report</p>
      <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 print:text-gray-400">Generated on {formatDate(new Date().toISOString())}</p>
      {project.industry && <p className="text-sm text-slate-400 dark:text-slate-500 print:text-gray-400">Industry: {project.industry}</p>}
    </div>
  )
}
