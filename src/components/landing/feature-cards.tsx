'use client'

import { motion } from 'framer-motion'
import { FeatureCard } from './feature-card'
import { Grid3X3, TrendingUp, Search, Users } from 'lucide-react'

const features = [
  {
    icon: Grid3X3,
    title: 'Interactive Matrix',
    description: 'Visualize your security posture across 5 asset classes and 5 NIST functions in an interactive 5x5 grid.',
    accentColor: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.04)',
  },
  {
    icon: TrendingUp,
    title: 'Maturity Tracking',
    description: 'Assess and track maturity levels from 1 (Initial) to 5 (Optimized) with detailed criteria and justifications.',
    accentColor: '#818cf8',
    glowColor: 'rgba(129, 140, 248, 0.04)',
  },
  {
    icon: Search,
    title: 'Gap Analysis',
    description: 'Automatically identify critical security gaps and get prioritized recommendations for improvement.',
    accentColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.04)',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite team members, share assessments, and work together to strengthen your security program.',
    accentColor: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.04)',
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
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-3">Capabilities</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need to assess your security
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Built on Sounil Yu&apos;s Cyber Defense Matrix, DefenseMatrix gives you the tools to understand,
            measure, and improve your cybersecurity posture.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
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
      </div>
    </section>
  )
}
