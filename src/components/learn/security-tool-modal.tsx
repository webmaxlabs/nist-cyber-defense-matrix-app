'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ToolMatrixCoverage } from './tool-matrix-coverage'
import type { SecurityToolData } from '@/lib/data/security-tools'
import { Info, Package } from 'lucide-react'

interface SecurityToolModalProps {
  tool: SecurityToolData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SecurityToolModal({ tool, open, onOpenChange }: SecurityToolModalProps) {
  if (!tool) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto glass border border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-lg font-bold font-mono text-slate-300">
              {tool.vendorName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <DialogTitle className="text-lg text-foreground">{tool.vendorName}</DialogTitle>
              <Badge variant="secondary" className="mt-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">{tool.category}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
              <Info className="h-4 w-4 text-muted-foreground" />
              About
            </div>
            <p className="text-sm text-slate-300">{tool.description}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              Key Products & Solutions
            </div>
            <div className="flex flex-wrap gap-2">
              {tool.keyProducts.map((product) => (
                <Badge key={product} variant="outline" className="text-xs border-white/10 text-slate-300">
                  {product}
                </Badge>
              ))}
            </div>
          </div>

          <ToolMatrixCoverage tool={tool} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
