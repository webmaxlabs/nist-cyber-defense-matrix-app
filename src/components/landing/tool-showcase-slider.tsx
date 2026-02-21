'use client'

import { Fragment, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react'
import { ASSET_CLASSES, NIST_FUNCTIONS } from '@/lib/constants/matrix'
import { SECURITY_TOOLS, type SecurityToolData } from '@/lib/data/security-tools'
import { ToolLogo } from '@/components/learn/tool-logo'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SHOWCASE_TOOLS = SECURITY_TOOLS
  .filter(t => t.popularityRank <= 8)
  .sort((a, b) => a.popularityRank - b.popularityRank)

const NIST_ABBREV: Record<string, string> = {
  identify: 'ID',
  protect: 'PR',
  detect: 'DT',
  respond: 'RS',
  recover: 'RC',
}

const ASSET_ABBREV: Record<string, string> = {
  devices: 'DEV',
  applications: 'APP',
  networks: 'NET',
  data: 'DAT',
  users: 'USR',
}

const COST_LABELS: Record<string, string> = {
  free: 'Free',
  low: '$',
  medium: '$$',
  high: '$$$',
  enterprise: 'Enterprise',
}

// ---------------------------------------------------------------------------
// MiniDefenseMatrix
// ---------------------------------------------------------------------------

function MiniDefenseMatrix({
  coverageCells,
}: {
  coverageCells: SecurityToolData['coverageCells']
}) {
  const isCovered = (row: string, col: string) =>
    coverageCells.some(c => c.row === row && c.column === col)

  return (
    <div className="grid grid-cols-6 gap-1">
      {/* Top-left empty corner */}
      <div />

      {/* Column headers */}
      {NIST_FUNCTIONS.map(fn => (
        <div
          key={fn}
          className="flex items-center justify-center rounded bg-cyan-500/10 border border-cyan-500/15 py-1"
        >
          <span className="text-[8px] font-mono font-bold text-cyan-400">
            {NIST_ABBREV[fn]}
          </span>
        </div>
      ))}

      {/* Rows */}
      {ASSET_CLASSES.map(asset => (
        <Fragment key={asset}>
          {/* Row label */}
          <div
            className="flex items-center justify-center rounded bg-indigo-500/10 border border-indigo-500/15 py-1 px-0.5"
          >
            <span className="text-[8px] font-mono font-bold text-indigo-400">
              {ASSET_ABBREV[asset]}
            </span>
          </div>

          {/* Data cells */}
          {NIST_FUNCTIONS.map(fn => {
            const covered = isCovered(asset, fn)
            return (
              <div
                key={`${asset}-${fn}`}
                className={`flex items-center justify-center rounded py-1 ${
                  covered
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                    : 'border bg-slate-50 border-slate-200 dark:bg-white/[0.02] dark:border-white/5'
                }`}
              >
                {covered ? (
                  <ShieldCheck className="h-2.5 w-2.5 text-emerald-400" />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-white/10" />
                )}
              </div>
            )
          })}
        </Fragment>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ToolCard
// ---------------------------------------------------------------------------

function ToolCard({ tool }: { tool: SecurityToolData }) {
  return (
    <div className="glass rounded-2xl p-6 sm:p-8 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <ToolLogo vendorName={tool.vendorName} websiteUrl={tool.websiteUrl} size="md" />
          <h3 className="font-display text-xl font-bold text-foreground min-w-0 truncate">
            {tool.vendorName}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full px-2.5 py-0.5">
            {tool.category}
          </span>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full px-2.5 py-0.5">
            {COST_LABELS[tool.costRange] || tool.costRange}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-5">
        {tool.description}
      </p>

      {/* Mini Defense Matrix */}
      <MiniDefenseMatrix coverageCells={tool.coverageCells} />

      {/* Coverage counter */}
      <p className="font-mono text-sm mt-4">
        <span className="text-slate-500 dark:text-slate-400">Covers </span>
        <span className="text-emerald-400 font-bold">{tool.coverageCells.length}</span>
        <span className="text-slate-500 dark:text-slate-400"> of 25 cells</span>
      </p>

      {/* Key products */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {tool.keyProducts.slice(0, 4).map(product => (
          <span
            key={product}
            className="text-[10px] bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-full px-2 py-0.5"
          >
            {product}
          </span>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const cardVariants = {
  enter: {
    x: 300,
    rotateY: -30,
    scale: 0.9,
    opacity: 0,
  },
  center: {
    x: 0,
    rotateY: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    x: -300,
    rotateY: 30,
    scale: 0.9,
    opacity: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

// ---------------------------------------------------------------------------
// ToolShowcaseSlider
// ---------------------------------------------------------------------------

export function ToolShowcaseSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [tick, setTick] = useState(0)

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % SHOWCASE_TOOLS.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isPaused, tick])

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + SHOWCASE_TOOLS.length) % SHOWCASE_TOOLS.length)
    setTick(t => t + 1)
  }, [])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % SHOWCASE_TOOLS.length)
    setTick(t => t + 1)
  }, [])

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index)
    setTick(t => t + 1)
  }, [])

  const arrowClasses =
    'p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors bg-white/80 dark:bg-white/5'

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,_rgba(52,211,153,0.06),_transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-3">
            Ecosystem
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            How real tools map to the matrix
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every security tool covers different cells. See where the overlap is and where
            the gaps are &mdash; no vendor pitch required.
          </p>
        </div>

        {/* 3D Stage */}
        <div
          className="relative max-w-md mx-auto"
          style={{ perspective: '1200px' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <ToolCard tool={SHOWCASE_TOOLS[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation: prev/next arrows + dot indicators */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={goToPrev} className={arrowClasses} aria-label="Previous tool">
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {SHOWCASE_TOOLS.map((_, i) => (
              <button
                key={i}
                onClick={() => goToIndex(i)}
                aria-label={`Go to tool ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-6 bg-cyan-400'
                    : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button onClick={goToNext} className={arrowClasses} aria-label="Next tool">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-400 transition-colors"
          >
            Explore all 100+ security tools
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
