'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { ENDORSEMENT_QUOTES } from '@/lib/data/endorsement-quotes'

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------

const quoteVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
}

// ---------------------------------------------------------------------------
// EndorsementsSlider
// ---------------------------------------------------------------------------

export function EndorsementsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [tick, setTick] = useState(0)

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex(prev => (prev + 1) % ENDORSEMENT_QUOTES.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [isPaused, tick])

  const goToPrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex(prev => (prev - 1 + ENDORSEMENT_QUOTES.length) % ENDORSEMENT_QUOTES.length)
    setTick(t => t + 1)
  }, [])

  const goToNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex(prev => (prev + 1) % ENDORSEMENT_QUOTES.length)
    setTick(t => t + 1)
  }, [])

  const goToIndex = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
    setTick(t => t + 1)
  }, [currentIndex])

  const quote = ENDORSEMENT_QUOTES[currentIndex]

  const arrowClasses =
    'p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors bg-white/80 dark:bg-white/5'

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,_rgba(129,140,248,0.05),_transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-indigo-400 tracking-widest uppercase mb-3">
            Endorsements
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            What experts are saying
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Industry leaders on the Cyber Defense Matrix framework.
          </p>
        </div>

        {/* Quote Stage */}
        <div
          className="relative max-w-2xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={quoteVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="glass rounded-2xl p-8 sm:p-10 border-l-2 border-l-cyan-500/40">
                {/* Decorative quote mark */}
                <Quote className="h-8 w-8 text-cyan-500/20 mb-4" />

                {/* Quote text */}
                <blockquote className="text-base sm:text-lg italic text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  &ldquo;{quote.text}&rdquo;
                </blockquote>

                {/* Author */}
                <div>
                  <p className="font-semibold text-foreground">{quote.author}</p>
                  <p className="text-sm text-muted-foreground">{quote.title}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation: prev/next arrows + dot indicators */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={goToPrev} className={arrowClasses} aria-label="Previous quote">
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {ENDORSEMENT_QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToIndex(i)}
                aria-label={`Go to quote ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-6 bg-cyan-400'
                    : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button onClick={goToNext} className={arrowClasses} aria-label="Next quote">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
