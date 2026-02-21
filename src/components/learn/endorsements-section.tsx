'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { ENDORSEMENT_QUOTES } from '@/lib/data/endorsement-quotes'

export function EndorsementsSection() {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-display font-bold text-foreground mb-6">
        What Experts Are Saying
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ENDORSEMENT_QUOTES.map((quote, i) => (
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className="flex flex-col h-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-5 border-l-2 border-l-cyan-500/40">
              {/* Decorative quote mark */}
              <Quote className="h-5 w-5 text-cyan-500/20 mb-3 shrink-0" />

              {/* Quote text */}
              <blockquote className="text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed flex-1 mb-4">
                &ldquo;{quote.text}&rdquo;
              </blockquote>

              {/* Author */}
              <div>
                <p className="text-sm font-semibold text-foreground">{quote.author}</p>
                <p className="text-xs text-muted-foreground">{quote.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
