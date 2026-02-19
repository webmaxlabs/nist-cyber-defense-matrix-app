export const ASSET_CLASSES = ['devices', 'applications', 'networks', 'data', 'users'] as const
export type AssetClass = typeof ASSET_CLASSES[number]

export const NIST_FUNCTIONS = ['identify', 'protect', 'detect', 'respond', 'recover'] as const
export type NistFunction = typeof NIST_FUNCTIONS[number]

export const ASSET_LABELS: Record<AssetClass, string> = {
  devices: 'Devices',
  applications: 'Applications',
  networks: 'Networks',
  data: 'Data',
  users: 'Users',
}

export const NIST_LABELS: Record<NistFunction, string> = {
  identify: 'Identify',
  protect: 'Protect',
  detect: 'Detect',
  respond: 'Respond',
  recover: 'Recover',
}

export const ASSET_ICONS: Record<AssetClass, string> = {
  devices: 'Monitor',
  applications: 'AppWindow',
  networks: 'Network',
  data: 'Database',
  users: 'Users',
}

export const NIST_COLORS: Record<NistFunction, string> = {
  identify: '#22d3ee',
  protect: '#38bdf8',
  detect: '#818cf8',
  respond: '#a78bfa',
  recover: '#c084fc',
}

export const MATURITY_COLORS: Record<number, { bg: string; text: string; label: string; color: string }> = {
  0: { bg: 'bg-slate-500/5', text: 'text-slate-500', label: 'Not Assessed', color: '#64748b' },
  1: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Initial', color: '#f87171' },
  2: { bg: 'bg-orange-500/10', text: 'text-orange-400', label: 'Developing', color: '#fb923c' },
  3: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Defined', color: '#facc15' },
  4: { bg: 'bg-sky-500/10', text: 'text-sky-400', label: 'Managed', color: '#38bdf8' },
  5: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Optimized', color: '#34d399' },
}

export const CONTINUUM_SECTIONS = [
  { label: 'Technology', color: '#22d3ee', description: 'Degree of Dependency on Technology' },
  { label: 'People', color: '#34d399', description: 'Degree of Dependency on People' },
  { label: 'Process', color: '#818cf8', description: 'Degree of Dependency on Process' },
] as const
