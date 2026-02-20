import { HeroSection } from '@/components/landing/hero-section'
import { FeatureCards } from '@/components/landing/feature-cards'
import { ToolShowcaseSlider } from '@/components/landing/tool-showcase-slider'
import { TopNav } from '@/components/layout/top-nav'
import { Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <TopNav />
      <HeroSection />
      <FeatureCards />
      <ToolShowcaseSlider />

      {/* How It Works */}
      <section className="py-24 relative border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-indigo-400 tracking-widest uppercase mb-3">Process</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Three steps to cyber clarity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Create a Project', description: 'Set up your organization profile and define the scope of your security assessment.' },
              { step: '02', title: 'Assess the Matrix', description: 'Rate maturity levels across all 25 cells of the Cyber Defense Matrix and map your tools.' },
              { step: '03', title: 'Act on Insights', description: 'Review gap analysis, export reports, and prioritize improvements with AI-powered recommendations.' },
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
                Ready to strengthen your defenses?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Start mapping your cybersecurity posture today. Free to use, no credit card required.
              </p>
              <a href="/signup" className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-8 py-3 rounded-lg transition-all glow-cyan-sm hover:glow-cyan">
                Start Your Assessment
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-500/10 border border-cyan-500/15">
                <Shield className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <span className="font-display text-sm font-semibold text-foreground">DefenseMatrix</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Built on Sounil Yu&apos;s Cyber Defense Matrix framework
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
