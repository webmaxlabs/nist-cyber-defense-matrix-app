'use client'

import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
import { CoverageBadge } from '@/components/shared/coverage-badge'
import { ProjectDropdown } from './project-dropdown'
import { timeAgo } from '@/lib/utils/format'
import type { Project } from '@/lib/supabase/types'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/project/${project.id}`}>
      <div className="glass rounded-xl p-5 card-hover-lift group h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <Shield className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            <CoverageBadge percentage={project.coverage_percentage} size="sm" />
            <div onClick={(e) => e.stopPropagation()}>
              <ProjectDropdown projectId={project.id} projectName={project.name} />
            </div>
          </div>
        </div>

        <h3 className="font-display font-semibold text-foreground mb-1 line-clamp-1">{project.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{project.description || 'No description'}</p>

        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span className="font-mono">Updated {timeAgo(project.updated_at)}</span>
          <ArrowRight className="h-4 w-4 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  )
}
