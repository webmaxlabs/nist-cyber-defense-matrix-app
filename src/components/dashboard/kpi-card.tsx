import type { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  glowColor: string
}

export function KPICard({ title, value, icon: Icon, color, glowColor }: KPICardProps) {
  return (
    <div className="glass rounded-xl p-5 card-hover-lift group">
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl border"
          style={{
            background: `${color}10`,
            borderColor: `${color}25`,
          }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-display text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `0 0 30px ${glowColor}` }}
      />
    </div>
  )
}
