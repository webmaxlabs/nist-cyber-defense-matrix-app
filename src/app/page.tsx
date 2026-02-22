import type { Metadata } from 'next'
import { HeroSection } from '@/components/landing/hero-section'
import { FeatureCards } from '@/components/landing/feature-cards'
import { ToolShowcaseSlider } from '@/components/landing/tool-showcase-slider'
import { AIAdvisorSection } from '@/components/landing/ai-advisor-section'
import { EndorsementsSlider } from '@/components/landing/endorsements-slider'
import { TopNav } from '@/components/layout/top-nav'
import { Shield, ShieldCheck, Github, BookOpen, Globe, Code2 } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Cyber Defense Matrix AI — Open Source Security Posture Assessment",
  description:
    "Map your cybersecurity posture with the Cyber Defense Matrix. Open source NIST CSF assessment tool with maturity scoring, tool mapping across 25 cells, and AI-powered security analysis. Free to deploy.",
  alternates: {
    canonical: "https://cyberdefensematrix.ai",
  },
}

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Cyber Defense Matrix AI",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Cyber Defense Matrix AI",
      url: "https://cyberdefensematrix.ai",
    },
    description:
      "Open source cybersecurity posture assessment platform built on Sounil Yu's Cyber Defense Matrix framework. NIST CSF maturity scoring, tool mapping, and AI-powered analysis.",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopNav />
      <HeroSection />
      <FeatureCards />
      <ToolShowcaseSlider />
      <AIAdvisorSection />
      <EndorsementsSlider />

      {/* Why This Exists */}
      <section className="py-24 relative border-t border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-3">The Problem</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Security shouldn&apos;t require a translator.
            </h2>
            <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Marketing lingo, made-up terminology, and endless vendor consolidation have made it
                nearly impossible to understand what a security tool actually does for your program.
                Brands merge, products rebrand, and capabilities get buried under layers of buzzwords.
              </p>
              <p>
                Sounil Yu created the Cyber Defense Matrix as a way to cut through the noise &mdash; a
                simple 5&times;5 grid that maps security functions against asset classes. It started as a
                framework in a book. Cyber Defense Matrix AI turns that framework into a tool any security team
                can deploy.
              </p>
              <p>
                This is open source software, built for security teams to run in-house, so you control
                the sensitive data it collects. Free to use, free to improve, built in the open.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12">
            {[
              {
                icon: Code2,
                title: 'Open Source',
                description: 'Self-host on your own infrastructure. Full control over your data, your deployment, and your roadmap. No vendor lock-in, ever.',
              },
              {
                icon: BookOpen,
                title: 'Framework-Driven',
                description: 'Built on Sounil Yu\u2019s Cyber Defense Matrix \u2014 a proven model used across the industry. No marketing whitepapers, just structure.',
              },
              {
                icon: Globe,
                title: 'Community-Built',
                description: 'Free for every security team, from startups to enterprises. Contribute on GitHub and help shape what comes next.',
              },
              {
                icon: ShieldCheck,
                title: 'AI-Safe by Design',
                description: 'Share your security posture with AI systems without exposing operational details. Structured visibility that\u2019s safe to analyze externally.',
              },
            ].map((item) => (
              <div key={item.title} className="glass rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/5 border border-cyan-500/15 mb-4">
                  <item.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative border-t border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-indigo-400 tracking-widest uppercase mb-3">Process</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Three steps. That&apos;s it.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Define Your Scope', description: 'Set up a project for your organization and define what you\u2019re assessing.' },
              { step: '02', title: 'Assess Honestly', description: 'Walk through all 25 cells. Rate your actual maturity \u2014 not where you wish you were. Map the tools you have.' },
              { step: '03', title: 'See the Truth', description: 'Review your coverage gaps, export reports, and prioritize what to fix based on real data.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-5">
                  <span className="font-mono text-lg font-bold text-cyan-400">{item.step}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,_rgba(34,211,238,0.06),_transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="glass rounded-2xl p-12 sm:p-16 text-center max-w-3xl mx-auto gradient-border-animated">
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6">
                <Shield className="h-8 w-8 text-cyan-400" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Your security posture shouldn&apos;t be a mystery.
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Deploy Cyber Defense Matrix AI for your team or try the live demo. Open source,
                self-hosted, no strings attached.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/signup" className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-8 py-3 rounded-lg transition-all glow-cyan-sm hover:glow-cyan">
                  Try the Live Demo
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a
                  href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-cyan-500/30 hover:text-cyan-300 font-semibold px-8 py-3 rounded-lg transition-all"
                >
                  <Github className="h-4 w-4" />
                  Get the Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/5 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-500/10 border border-cyan-500/15">
                  <Shield className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <span className="font-display text-sm font-semibold text-foreground">Cyber Defense Matrix AI</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Open source cybersecurity assessment. Built on Sounil Yu&apos;s Cyber Defense Matrix.
              </p>
            </div>

            {/* Project column */}
            <div>
              <h3 className="font-display text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Project</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <Link href="/learn" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <a href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
                    License
                  </a>
                </li>
              </ul>
            </div>

            {/* Community column */}
            <div>
              <h3 className="font-display text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Community</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
                    Contributing
                  </a>
                </li>
                <li>
                  <a href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app/issues" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
                    Report Issues
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/jake-ely/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Framework column */}
            <div>
              <h3 className="font-display text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Framework</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/learn" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
                    About the Cyber Defense Matrix
                  </Link>
                </li>
                <li>
                  <a href="https://cyberdefensematrix.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
                    Sounil Yu&apos;s Original Work
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-200 dark:border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Cyber Defense Matrix AI. Open source under MIT License.
            </p>
            <a
              href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan-400 transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              Star on GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
