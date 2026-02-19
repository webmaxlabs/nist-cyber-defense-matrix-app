'use client'

import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
import { CoverageBadge } from '@/components/shared/coverage-badge'
import { ProjectDropdown } from './project-dropdown'
import { timeAgo } from '@/lib/utils/format'
import type { Project } from '@/lib/supabase/types'

interface ProjectListItemProps {
  project: Project
}

export function ProjectListItem({ project }: ProjectListItemProps) {
  return (
    <Link href={`/project/${project.id}`}>
      <div className="flex items-center gap-4 rounded-lg glass p-4 transition-all card-hover-lift group">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 shrink-0">
          <Shield className="h-5 w-5 text-cyan-400" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground truncate">{project.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{project.description || 'No description'}</p>
        </div>

        <div className="hidden sm:block">
          <CoverageBadge percentage={project.coverage_percentage} size="sm" />
        </div>

        <span className="hidden md:block text-xs text-slate-500 font-mono whitespace-nowrap">
          Updated {timeAgo(project.updated_at)}
        </span>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <ProjectDropdown projectId={project.id} projectName={project.name} />
        </div>

        <ArrowRight className="h-4 w-4 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    </Link>
  )
}
