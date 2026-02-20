'use client'

import { motion } from 'framer-motion'
import { FeatureCard } from './feature-card'
import { Grid3X3, TrendingUp, Search, Users, BrainCircuit } from 'lucide-react'

const features = [
  {
    icon: Grid3X3,
    title: 'Map Your Coverage',
    description: 'Plot your security tools and capabilities across 5 asset classes and 5 NIST functions. See at a glance what\u2019s covered and what isn\u2019t.',
    accentColor: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.04)',
  },
  {
    icon: TrendingUp,
    title: 'Measure What Matters',
    description: 'Rate each cell from 1 to 5 based on real capability \u2014 not vendor promises. Track progress as your program matures.',
    accentColor: '#818cf8',
    glowColor: 'rgba(129, 140, 248, 0.04)',
  },
  {
    icon: Search,
    title: 'Find the Gaps',
    description: 'Stop guessing where you\u2019re exposed. The matrix reveals blind spots that slide decks and sales pitches won\u2019t show you.',
    accentColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.04)',
  },
  {
    icon: Users,
    title: 'Built for Teams',
    description: 'Security isn\u2019t a solo effort. Invite your team, share assessments, and get everyone \u2014 technical or not \u2014 on the same page.',
    accentColor: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.04)',
  },
  {
    icon: BrainCircuit,
    title: 'AI-Ready Data',
    description: 'Export structured assessment data that\u2019s safe to share with AI tools. No credentials, no architecture details \u2014 just the signal an LLM needs to help you prioritize.',
    accentColor: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.04)',
  },
]

export function FeatureCards() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 cyber-grid-bg opacity-40" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-3">What It Does</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            No buzzwords. Just clarity.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Built on Sounil Yu&apos;s Cyber Defense Matrix &mdash; a framework that maps what you have
            against what you need. Open source, license-free, and free for anyone to use, test, and
            deploy in their own environment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.slice(0, 3).map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto mt-5">
          {features.slice(3).map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index + 3) * 0.1, duration: 0.5 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
