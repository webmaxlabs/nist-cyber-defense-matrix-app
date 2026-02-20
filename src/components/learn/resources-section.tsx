import { ExternalLink, Globe, ShieldCheck, BookOpen } from 'lucide-react'

const resources = [
  {
    title: 'Cyber Defense Matrix Website',
    description: 'Official website by Sounil Yu with the original framework documentation.',
    url: 'https://cyberdefensematrix.com',
    icon: Globe,
    accent: 'cyan',
  },
  {
    title: 'NIST Cybersecurity Framework',
    description: 'The foundational framework that defines Identify, Protect, Detect, Respond, Recover.',
    url: 'https://www.nist.gov/cyberframework',
    icon: ShieldCheck,
    accent: 'indigo',
  },
  {
    title: 'Understanding the Cyber Defense Matrix',
    description: 'Comprehensive guide to using the CDM for security program management by Sounil Yu.',
    url: 'https://cyberdefensematrix.com',
    icon: BookOpen,
    accent: 'violet',
  },
]

const accentStyles = {
  cyan: {
    iconBg: 'bg-cyan-500/10',
    iconText: 'text-cyan-400',
    hoverBorder: 'hover:border-cyan-500/30',
    hoverShadow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]',
    tag: 'bg-cyan-500/10 text-cyan-400',
  },
  indigo: {
    iconBg: 'bg-indigo-500/10',
    iconText: 'text-indigo-400',
    hoverBorder: 'hover:border-indigo-500/30',
    hoverShadow: 'hover:shadow-[0_0_20px_rgba(129,140,248,0.08)]',
    tag: 'bg-indigo-500/10 text-indigo-400',
  },
  violet: {
    iconBg: 'bg-violet-500/10',
    iconText: 'text-violet-400',
    hoverBorder: 'hover:border-violet-500/30',
    hoverShadow: 'hover:shadow-[0_0_20px_rgba(167,139,250,0.08)]',
    tag: 'bg-violet-500/10 text-violet-400',
  },
} as const

export function ResourcesSection() {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-display font-bold text-foreground mb-6">Additional Resources</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {resources.map((resource) => {
          const style = accentStyles[resource.accent]
          const Icon = resource.icon
          return (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all ${style.hoverBorder} ${style.hoverShadow} hover:bg-white/[0.06]`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${style.iconBg}`}>
                  <Icon className={`h-5 w-5 ${style.iconText}`} />
                </div>
                <ExternalLink className="h-4 w-4 text-slate-600 transition-all group-hover:text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1.5">{resource.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed flex-1">{resource.description}</p>
              <div className={`mt-3 self-start rounded-full px-2.5 py-0.5 text-[10px] font-mono font-medium ${style.tag}`}>
                {new URL(resource.url).hostname.replace('www.', '')}
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
