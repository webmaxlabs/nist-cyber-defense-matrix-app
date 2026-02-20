'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BarChart3, Grid3X3, FileText } from 'lucide-react'

interface ProjectSubNavProps {
  projectId: string
}

export function ProjectSubNav({ projectId }: ProjectSubNavProps) {
  const pathname = usePathname()

  const links = [
    { href: `/project/${projectId}`, label: 'Dashboard', icon: BarChart3, exact: true },
    { href: `/project/${projectId}/matrix`, label: 'Matrix', icon: Grid3X3 },
    { href: `/project/${projectId}/report`, label: 'Report', icon: FileText },
  ]

  return (
    <nav className="border-b border-slate-200 dark:border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 -mb-px">
          {links.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-white/10'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
