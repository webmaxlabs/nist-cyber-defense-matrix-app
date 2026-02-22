'use client'

import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, Github, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

function FloatingParticle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)`,
      }}
      animate={{
        y: [0, -30, -15, -45, 0],
        x: [0, 10, -8, 12, 0],
        opacity: [0.2, 0.5, 0.3, 0.6, 0.2],
        scale: [1, 1.2, 0.9, 1.1, 1],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}

const particles = [
  { delay: 0, x: 10, y: 20, size: 4 },
  { delay: 1.5, x: 85, y: 15, size: 3 },
  { delay: 0.8, x: 25, y: 70, size: 5 },
  { delay: 2.2, x: 70, y: 60, size: 3 },
  { delay: 3, x: 50, y: 30, size: 4 },
  { delay: 1, x: 90, y: 75, size: 3 },
  { delay: 2.8, x: 15, y: 50, size: 4 },
  { delay: 0.5, x: 60, y: 85, size: 3 },
]

const matrixData = [
  [3, 4, 2, 5, 3],
  [4, 2, 3, 4, 5],
  [2, 5, 4, 3, 2],
  [5, 3, 5, 2, 4],
  [3, 4, 3, 4, 5],
]

export function HeroSection() {
  const [activeCell, setActiveCell] = useState({ r: 0, c: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCell({
        r: Math.floor(Math.random() * 5),
        c: Math.floor(Math.random() * 5),
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden scan-line-overlay">
      {/* Backgrounds */}
      <div className="absolute inset-0 cyber-grid-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_rgba(34,211,238,0.08),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,_rgba(129,140,248,0.05),_transparent_50%)]" />

      {/* Floating Particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-8"
            >
              <Github className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-300 tracking-wide uppercase">
                Open Source
              </span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="text-foreground">See what your</span>
              <br />
              <span className="text-foreground">security program</span>
              <br />
              <span className="text-gradient-cyan">actually covers.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
              Cyber Defense Matrix AI maps your tools and capabilities across the Cyber Defense
              Matrix &mdash; a proven 5&times;5 framework that cuts through vendor noise and
              shows you where you&apos;re strong, where you&apos;re exposed, and what to do about it.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold gap-2 h-12 px-8 glow-cyan-sm transition-all hover:glow-cyan">
                  Try the Live Demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:border-cyan-500/30 hover:text-cyan-300 h-12 px-8 transition-all gap-2">
                  <Github className="h-4 w-4" />
                  View on GitHub
                </Button>
              </a>
              <Link href="/learn">
                <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:border-cyan-500/30 hover:text-cyan-300 h-12 px-8 transition-all gap-2">
                  <BookOpen className="h-4 w-4" />
                  Learn the Framework
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-slate-200 dark:border-white/5">
              {[
                { value: '5x5', label: 'Defense Matrix' },
                { value: '25', label: 'Security Cells' },
                { value: '5', label: 'Maturity Levels' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-bold text-cyan-400">{stat.value}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Interactive Matrix Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Glow backdrop */}
              <div className="absolute -inset-8 bg-gradient-to-br from-cyan-500/8 via-transparent to-indigo-500/5 rounded-3xl blur-xl" />

              <div className="relative glass rounded-2xl p-6 gradient-border-animated">
                {/* Matrix header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200 dark:border-white/5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <Shield className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-display font-semibold text-foreground">Defense Matrix</p>
                    <p className="text-[10px] text-muted-foreground">Real-time Security Assessment</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-glow" style={{ '--pulse-color': 'rgba(52, 211, 153, 0.4)' } as React.CSSProperties} />
                    <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
                  </div>
                </div>

                {/* Matrix Grid */}
                <div className="grid grid-cols-6 gap-1.5">
                  <div className="col-span-1" />
                  {['Identify', 'Protect', 'Detect', 'Respond', 'Recover'].map((fn) => (
                    <div key={fn} className="flex items-center justify-center rounded-md bg-cyan-500/10 border border-cyan-500/15 py-1.5">
                      <span className="text-[8px] font-mono font-bold text-cyan-400 tracking-wide">{fn}</span>
                    </div>
                  ))}
                  {['Devices', 'Apps', 'Networks', 'Data', 'Users'].map((asset, ri) => (
                    <Fragment key={asset}>
                      <div className="flex items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/15 py-1.5 px-1">
                        <span className="text-[8px] font-mono font-bold text-indigo-400 tracking-wide">{asset}</span>
                      </div>
                      {[0, 1, 2, 3, 4].map((ci) => {
                        const level = matrixData[ri][ci]
                        const isActive = activeCell.r === ri && activeCell.c === ci
                        const glowColors: Record<number, string> = {
                          1: 'border-red-400/30 bg-red-400/5 text-red-400',
                          2: 'border-orange-400/30 bg-orange-400/5 text-orange-400',
                          3: 'border-yellow-400/30 bg-yellow-400/5 text-yellow-400',
                          4: 'border-sky-400/30 bg-sky-400/5 text-sky-400',
                          5: 'border-emerald-400/30 bg-emerald-400/5 text-emerald-400',
                        }
                        const activeGlow: Record<number, string> = {
                          1: '0 0 15px rgba(248,113,113,0.3)',
                          2: '0 0 15px rgba(251,146,60,0.3)',
                          3: '0 0 15px rgba(250,204,21,0.3)',
                          4: '0 0 15px rgba(56,189,248,0.3)',
                          5: '0 0 15px rgba(52,211,153,0.3)',
                        }
                        return (
                          <motion.div
                            key={`${ri}-${ci}`}
                            className={`flex items-center justify-center rounded-md border py-2 transition-all duration-500 ${glowColors[level]}`}
                            animate={isActive ? {
                              boxShadow: [activeGlow[level], '0 0 0px transparent', activeGlow[level]],
                            } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <span className="text-[10px] font-mono font-bold">L{level}</span>
                          </motion.div>
                        )
                      })}
                    </Fragment>
                  ))}
                </div>

                {/* Bottom stats */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    {[
                      { label: 'Score', value: '78%', color: 'text-cyan-400' },
                      { label: 'Gaps', value: '3', color: 'text-amber-400' },
                      { label: 'Tools', value: '12', color: 'text-indigo-400' },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <p className={`text-sm font-mono font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-600 font-mono">v2.0</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
