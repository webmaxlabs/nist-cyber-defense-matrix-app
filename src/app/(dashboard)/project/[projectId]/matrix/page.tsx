'use client'

import { useParams } from 'next/navigation'
import { MatrixGrid } from '@/components/matrix/matrix-grid'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAssessments } from '@/lib/hooks/use-assessments'
import { useToolMappings } from '@/lib/hooks/use-tool-mappings'
import { useRealtimeAssessments, useRealtimeToolMappings } from '@/lib/hooks/use-realtime'

export default function MatrixPage() {
  const params = useParams()
  const projectId = params.projectId as string

  const { data: assessments, isLoading: loadingAssessments } = useAssessments(projectId)
  const { data: toolMappings, isLoading: loadingMappings } = useToolMappings(projectId)

  useRealtimeAssessments(projectId)
  useRealtimeToolMappings(projectId)

  if (loadingAssessments || loadingMappings) {
    return <LoadingSpinner className="py-20" size="lg" />
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">Cyber Defense Matrix</h2>
      <MatrixGrid
        projectId={projectId}
        assessments={assessments || []}
        toolMappings={toolMappings || []}
      />
    </div>
  )
}
