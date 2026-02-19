import { ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const resources = [
  {
    title: 'Cyber Defense Matrix Website',
    description: 'Official website by Sounil Yu with the original framework documentation.',
    url: 'https://cyberdefensematrix.com',
  },
  {
    title: 'NIST Cybersecurity Framework',
    description: 'The foundational framework that defines Identify, Protect, Detect, Respond, Recover.',
    url: 'https://www.nist.gov/cyberframework',
  },
  {
    title: 'Understanding the Cyber Defense Matrix (Book)',
    description: 'Comprehensive guide to using the CDM for security program management.',
    url: 'https://cyberdefensematrix.com',
  },
]

export function ResourcesSection() {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-display font-bold text-foreground mb-6">Additional Resources</h2>
      <div className="space-y-3">
        {resources.map((resource) => (
          <Card key={resource.title} className="glass border-2 border-white/10 hover:border-cyan-500/20 transition-colors">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{resource.title}</h3>
                <p className="text-xs text-muted-foreground">{resource.description}</p>
              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 ml-4 text-cyan-400 hover:text-cyan-300"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
