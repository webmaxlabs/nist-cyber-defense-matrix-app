import { ProjectListItem } from './project-list-item'
import type { Project } from '@/lib/supabase/types'

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="flex flex-col gap-3">
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </div>
  )
}
