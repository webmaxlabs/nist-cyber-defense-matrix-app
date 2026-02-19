'use client'

import { useParams } from 'next/navigation'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReportHeader } from '@/components/report/report-header'
import { ExecutiveSummary } from '@/components/report/executive-summary'
import { NistAnalysis } from '@/components/report/nist-analysis'
import { GapAnalysisTable } from '@/components/report/gap-analysis-table'
import { ToolInventory } from '@/components/report/tool-inventory'
import { Recommendations } from '@/components/report/recommendations'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useProject } from '@/lib/hooks/use-project'
import { useAssessments } from '@/lib/hooks/use-assessments'
import { useToolMappings } from '@/lib/hooks/use-tool-mappings'

export default function ReportPage() {
  const params = useParams()
  const projectId = params.projectId as string

  const { data: project, isLoading: loadingProject } = useProject(projectId)
  const { data: assessments, isLoading: loadingAssessments } = useAssessments(projectId)
  const { data: toolMappings, isLoading: loadingMappings } = useToolMappings(projectId)

  if (loadingProject || loadingAssessments || loadingMappings) {
    return <LoadingSpinner className="py-20" size="lg" />
  }

  if (!project) return null

  return (
    <div>
      <div className="mb-6 flex justify-end print:hidden">
        <Button onClick={() => window.print()} className="gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold">
          <Printer className="h-4 w-4" />
          Print Report
        </Button>
      </div>

      <div className="max-w-4xl mx-auto glass rounded-xl border border-white/5 p-8 print:border-0 print:shadow-none print:p-0 print:bg-white">
        <ReportHeader project={project} />
        <ExecutiveSummary assessments={assessments || []} toolMappings={toolMappings || []} />
        <NistAnalysis assessments={assessments || []} />
        <GapAnalysisTable assessments={assessments || []} />
        <ToolInventory toolMappings={toolMappings || []} />
        <Recommendations assessments={assessments || []} />
      </div>

      <style jsx global>{`
        @media print {
          header, nav, .print\\:hidden { display: none !important; }
          body { background: white !important; color: black !important; }
          main { padding: 0; }
          .glass { background: white !important; backdrop-filter: none !important; border: none !important; }
        }
      `}</style>
    </div>
  )
}
