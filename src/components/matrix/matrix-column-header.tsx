import { NIST_LABELS, NIST_COLORS, type NistFunction } from '@/lib/constants/matrix'

interface MatrixColumnHeaderProps {
  column: NistFunction
}

export function MatrixColumnHeader({ column }: MatrixColumnHeaderProps) {
  const color = NIST_COLORS[column]

  return (
    <div
      className="flex items-center justify-center rounded-lg px-3 py-3 text-center border"
      style={{
        background: `${color}10`,
        borderColor: `${color}20`,
      }}
    >
      <span
        className="text-xs font-mono font-bold uppercase tracking-wider"
        style={{ color }}
      >
        {NIST_LABELS[column]}
      </span>
    </div>
  )
}
