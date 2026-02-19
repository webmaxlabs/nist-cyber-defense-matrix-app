interface CoverageBadgeProps {
  percentage: number
  size?: 'sm' | 'md'
}

export function CoverageBadge({ percentage, size = 'md' }: CoverageBadgeProps) {
  const radius = size === 'sm' ? 16 : 22
  const strokeWidth = size === 'sm' ? 3 : 4
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  const svgSize = (radius + strokeWidth) * 2

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke="rgba(100, 140, 200, 0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          fill="none"
          stroke={percentage > 0 ? '#22d3ee' : 'rgba(100, 140, 200, 0.08)'}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono font-bold ${size === 'sm' ? 'text-xs' : 'text-sm'} text-foreground`}>
          {Math.round(percentage)}%
        </span>
        <span className={`${size === 'sm' ? 'text-[8px]' : 'text-[10px]'} text-muted-foreground`}>Coverage</span>
      </div>
    </div>
  )
}
