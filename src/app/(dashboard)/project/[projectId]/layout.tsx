'use client'

import { useParams } from 'next/navigation'
import { ProjectSubNav } from '@/components/layout/project-sub-nav'
import { useProject } from '@/lib/hooks/use-project'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const projectId = params.projectId as string
  const { data: project, isLoading } = useProject(projectId)

  if (isLoading) {
    return <LoadingSpinner className="py-20" size="lg" />
  }

  return (
    <div>
      <div className="border-b border-white/5 px-4 py-4">
        <div className="container mx-auto">
          <h1 className="font-display text-lg font-bold text-foreground">{project?.name || 'Project'}</h1>
          {project?.description && (
            <p className="text-sm text-muted-foreground mt-0.5">{project.description}</p>
          )}
        </div>
      </div>
      <ProjectSubNav projectId={projectId} />
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  )
}
