'use client'

import { useState } from 'react'
import { Pencil, X, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useProjects } from '@/lib/hooks/use-projects'
import { useChatContext } from '@/providers/chat-provider'

export function ProjectSelector() {
  const [open, setOpen] = useState(false)
  const { data: projects } = useProjects()
  const { selectedProjectIds, setSelectedProjects } = useChatContext()

  function toggleProject(id: string) {
    if (selectedProjectIds.includes(id)) {
      setSelectedProjects(selectedProjectIds.filter((pid) => pid !== id))
    } else {
      setSelectedProjects([...selectedProjectIds, id])
    }
  }

  function removeProject(id: string) {
    setSelectedProjects(selectedProjectIds.filter((pid) => pid !== id))
  }

  const selectedProjects = (projects || []).filter((p) => selectedProjectIds.includes(p.id))

  return (
    <div className="px-3 py-2 border-b border-slate-200 dark:border-white/5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-display font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Project Context
        </span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-64 p-2 glass border-slate-200 dark:border-white/10"
            side="bottom"
            align="end"
          >
            <p className="text-xs font-display font-semibold text-foreground mb-2 px-1">
              Select Projects
            </p>
            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {(projects || []).map((project) => (
                <button
                  key={project.id}
                  onClick={() => toggleProject(project.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                    selectedProjectIds.includes(project.id)
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div
                    className={`h-3 w-3 rounded border flex items-center justify-center flex-shrink-0 ${
                      selectedProjectIds.includes(project.id)
                        ? 'border-cyan-500 bg-cyan-500'
                        : 'border-slate-300 dark:border-white/20'
                    }`}
                  >
                    {selectedProjectIds.includes(project.id) && (
                      <svg className="h-2 w-2 text-white" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="truncate">{project.name}</span>
                </button>
              ))}
              {(!projects || projects.length === 0) && (
                <p className="text-xs text-slate-400 dark:text-slate-500 px-2 py-2">
                  No projects found
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected project badges */}
      {selectedProjects.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {selectedProjects.map((project) => (
            <span
              key={project.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
            >
              {project.name}
              <button
                onClick={() => removeProject(project.id)}
                className="hover:text-cyan-800 dark:hover:text-cyan-300 transition-colors"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <FolderOpen className="h-3 w-3" />
          <span>No projects selected</span>
        </div>
      )}
    </div>
  )
}
