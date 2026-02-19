'use client'

import { useParams } from 'next/navigation'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { NistRadarChart } from '@/components/dashboard/radar-chart'
import { CoverageBarChart } from '@/components/dashboard/coverage-bar-chart'
import { SecurityGaps } from '@/components/dashboard/security-gaps'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAssessments } from '@/lib/hooks/use-assessments'
import { useToolMappings } from '@/lib/hooks/use-tool-mappings'

export default function ProjectDashboardPage() {
  const params = useParams()
  const projectId = params.projectId as string

  const { data: assessments, isLoading: loadingAssessments } = useAssessments(projectId)
  const { data: toolMappings, isLoading: loadingMappings } = useToolMappings(projectId)

  if (loadingAssessments || loadingMappings) {
    return <LoadingSpinner className="py-20" size="lg" />
  }

  return (
    <div className="space-y-6">
      <KPICards assessments={assessments || []} toolMappings={toolMappings || []} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NistRadarChart assessments={assessments || []} />
        <CoverageBarChart assessments={assessments || []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityGaps assessments={assessments || []} />
        <ActivityFeed projectId={projectId} />
      </div>
    </div>
  )
}
