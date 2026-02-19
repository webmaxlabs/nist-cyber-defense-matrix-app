import { CONTINUUM_SECTIONS } from '@/lib/constants/matrix'

export function ContinuumBar() {
  return (
    <div className="mt-8">
      <h3 className="text-xs font-mono font-semibold text-muted-foreground mb-3 text-center uppercase tracking-wider">
        Technology-People-Process Continuum
      </h3>
      <div className="flex rounded-lg overflow-hidden h-8">
        {CONTINUUM_SECTIONS.map((section) => (
          <div
            key={section.label}
            className="flex-1 flex items-center justify-center text-xs font-mono font-bold"
            style={{
              backgroundColor: `${section.color}15`,
              color: section.color,
              borderRight: section.label !== 'Process' ? '1px solid rgba(100, 140, 200, 0.08)' : 'none',
            }}
          >
            {section.label}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-slate-600 px-1 font-mono">
        <span>Degree of Dependency on Technology</span>
        <span>Degree of Dependency on Process</span>
      </div>
    </div>
  )
}
