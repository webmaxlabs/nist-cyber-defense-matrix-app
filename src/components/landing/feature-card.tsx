'use client'

import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  accentColor: string
  glowColor: string
}

export function FeatureCard({ icon: Icon, title, description, accentColor, glowColor }: FeatureCardProps) {
  return (
    <div className="group relative glass rounded-xl p-6 card-hover-lift h-full">
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 40px ${glowColor}, 0 0 30px ${glowColor}` }}
      />
      <div className="relative">
        <div
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border mb-5"
          style={{
            background: `${accentColor}10`,
            borderColor: `${accentColor}25`,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: accentColor }} />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
