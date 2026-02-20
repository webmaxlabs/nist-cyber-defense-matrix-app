'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Shield, Grid3X3, Target } from 'lucide-react'

export function FrameworkOverview() {
  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-3">
          Understanding the Cyber Defense Matrix
        </h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Master the framework that helps security teams classify, organize, and advance their
          cybersecurity capabilities.
        </p>
      </div>

      <Card className="glass border-2 border-cyan-500/20">
        <CardContent className="p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-3">What is the Cyber Defense Matrix?</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Created by Sounil Yu, the Cyber Defense Matrix maps 5 operational functions from the
            NIST Cybersecurity Framework (Identify, Protect, Detect, Respond, Recover) against 5
            asset classes (Devices, Applications, Networks, Data, Users) to create a comprehensive
            25-cell grid that captures the entire landscape of cybersecurity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15 shrink-0">
                <Grid3X3 className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">5x5 Grid Structure</h3>
                <p className="text-xs text-muted-foreground">25 cells covering all security domains</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/15 shrink-0">
                <Shield className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">NIST CSF Aligned</h3>
                <p className="text-xs text-muted-foreground">Built on the NIST Cybersecurity Framework</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/15 shrink-0">
                <Target className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Vendor Neutral</h3>
                <p className="text-xs text-muted-foreground">Map any tool to the framework</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
