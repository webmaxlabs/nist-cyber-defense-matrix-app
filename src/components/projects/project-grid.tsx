import { ProjectCard } from './project-card'
import type { Project } from '@/lib/supabase/types'

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
