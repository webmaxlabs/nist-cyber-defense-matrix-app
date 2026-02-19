'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/shared/page-header'
import { ViewToggle } from '@/components/projects/view-toggle'
import { ProjectGrid } from '@/components/projects/project-grid'
import { ProjectList } from '@/components/projects/project-list'
import { EmptyState } from '@/components/projects/empty-state'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useProjects } from '@/lib/hooks/use-projects'
import { useUser } from '@/lib/hooks/use-user'

export default function ProjectsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const { data: projects, isLoading } = useProjects()
  const { displayName } = useUser()

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={`Welcome back, ${displayName}`}
        description="Manage your security assessment projects"
      >
        <ViewToggle view={view} onViewChange={setView} />
        <Link href="/projects/new">
          <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </PageHeader>

      <div className="mt-8">
        {isLoading ? (
          <LoadingSpinner className="py-20" size="lg" />
        ) : !projects || projects.length === 0 ? (
          <EmptyState />
        ) : view === 'grid' ? (
          <ProjectGrid projects={projects} />
        ) : (
          <ProjectList projects={projects} />
        )}
      </div>
    </div>
  )
}
