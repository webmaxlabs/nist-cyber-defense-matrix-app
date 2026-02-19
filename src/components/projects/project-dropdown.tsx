'use client'

import { useState } from 'react'
import { MoreVertical, Archive, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { useArchiveProject, useDeleteProject } from '@/lib/hooks/use-projects'

interface ProjectDropdownProps {
  projectId: string
  projectName: string
}

export function ProjectDropdown({ projectId, projectName }: ProjectDropdownProps) {
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const archiveMutation = useArchiveProject()
  const deleteMutation = useDeleteProject()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-300 hover:bg-white/5" onClick={(e) => e.preventDefault()}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass border-white/10">
          <DropdownMenuItem onClick={(e) => { e.preventDefault(); setArchiveDialogOpen(true) }}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => { e.preventDefault(); setDeleteDialogOpen(true) }}
            className="text-red-400 focus:text-red-400"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        title="Archive project"
        description={`Are you sure you want to archive "${projectName}"?`}
        confirmLabel="Archive"
        onConfirm={() => {
          archiveMutation.mutate(projectId)
          setArchiveDialogOpen(false)
        }}
        loading={archiveMutation.isPending}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete project"
        description={`Are you sure you want to permanently delete "${projectName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          deleteMutation.mutate(projectId)
          setDeleteDialogOpen(false)
        }}
        destructive
        loading={deleteMutation.isPending}
      />
    </>
  )
}
