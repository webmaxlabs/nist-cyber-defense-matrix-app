'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { SecurityToolCard } from './security-tool-card'
import { SecurityToolModal } from './security-tool-modal'
import { SECURITY_TOOLS, type SecurityToolData } from '@/lib/data/security-tools'
import { cn } from '@/lib/utils'

type SortMode = 'popularity' | 'az'

export function SecurityToolsSection() {
  const [sort, setSort] = useState<SortMode>('popularity')
  const [selectedTool, setSelectedTool] = useState<SecurityToolData | null>(null)

  const sortedTools = useMemo(() => {
    const tools = [...SECURITY_TOOLS]
    if (sort === 'az') {
      tools.sort((a, b) => a.vendorName.localeCompare(b.vendorName))
    } else {
      tools.sort((a, b) => a.popularityRank - b.popularityRank)
    }
    return tools
  }, [sort])

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Security Tools</h2>
        <div className="flex items-center rounded-lg border border-white/10 bg-transparent p-0.5">
          <Button
            variant="ghost"
            size="sm"
            className={cn('text-xs rounded-md', sort === 'popularity' && 'bg-cyan-500/10 text-cyan-400')}
            onClick={() => setSort('popularity')}
          >
            Popularity
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn('text-xs rounded-md', sort === 'az' && 'bg-cyan-500/10 text-cyan-400')}
            onClick={() => setSort('az')}
          >
            A-Z
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {sortedTools.map((tool) => (
          <SecurityToolCard
            key={tool.id}
            tool={tool}
            onClick={() => setSelectedTool(tool)}
          />
        ))}
      </div>

      <SecurityToolModal
        tool={selectedTool}
        open={!!selectedTool}
        onOpenChange={(open) => !open && setSelectedTool(null)}
      />
    </section>
  )
}
