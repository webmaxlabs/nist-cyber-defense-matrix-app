import { Monitor, AppWindow, Network, Database, Users } from 'lucide-react'
import { ASSET_LABELS, type AssetClass } from '@/lib/constants/matrix'

const iconMap = {
  devices: Monitor,
  applications: AppWindow,
  networks: Network,
  data: Database,
  users: Users,
}

interface MatrixRowHeaderProps {
  row: AssetClass
}

export function MatrixRowHeader({ row }: MatrixRowHeaderProps) {
  const Icon = iconMap[row]

  return (
    <div className="flex items-center gap-2 rounded-lg bg-indigo-500/8 border border-indigo-500/15 px-4 py-3">
      <Icon className="h-4 w-4 text-indigo-400 shrink-0" />
      <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider">
        {ASSET_LABELS[row]}
      </span>
    </div>
  )
}
