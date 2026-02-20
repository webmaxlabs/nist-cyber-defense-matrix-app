'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Bot,
  Search,
  PenTool,
  ShieldCheck,
  GitCompare,
  Server,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROVIDERS = [
  {
    name: 'OpenRouter',
    badge: 'Default',
    badgeColor: 'cyan' as const,
    icon: Sparkles,
    pros: [
      'Access 100+ models (Claude, GPT-4, Llama, Mixtral)',
      'Single API key for all providers',
      'Pay-per-token, no contracts',
    ],
    env: `OPENROUTER_API_KEY=sk-or-...\nOPENROUTER_MODEL=anthropic/claude-sonnet-4  # optional`,
  },
  {
    name: 'Anthropic SDK',
    badge: 'Direct',
    badgeColor: 'indigo' as const,
    icon: Bot,
    pros: [
      'Native tool_use streaming — lowest latency',
      'Direct Anthropic API — no middleman',
      'Best for production deployments',
    ],
    env: `ANTHROPIC_API_KEY=sk-ant-...`,
  },
] as const

const CAPABILITIES = [
  { icon: Search, label: 'Reads your assessments, tools, and gaps' },
  { icon: PenTool, label: 'Proposes maturity updates & tool mappings' },
  { icon: ShieldCheck, label: 'Every change requires your approval' },
  { icon: GitCompare, label: 'Compare across multiple projects' },
  { icon: Server, label: 'All data stays in your Supabase instance' },
] as const

const CHAT_SCRIPT = [
  { role: 'user' as const, text: 'What are my biggest security gaps?' },
  {
    role: 'assistant' as const,
    text: 'Based on your project, I found 3 critical gaps: Devices/Recover has no coverage, Networks/Detect is at maturity level 1, and Data/Respond has no tools mapped.',
  },
  { role: 'proposal' as const, text: 'Update Networks/Detect → Maturity 3' },
]

// ---------------------------------------------------------------------------
// ProviderCard
// ---------------------------------------------------------------------------

function ProviderCard({
  provider,
}: {
  provider: (typeof PROVIDERS)[number]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const Icon = provider.icon

  const badgeClasses =
    provider.badgeColor === 'cyan'
      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'

  const iconBgClasses =
    provider.badgeColor === 'cyan'
      ? 'bg-cyan-500/10 border-cyan-500/20'
      : 'bg-indigo-500/10 border-indigo-500/20'

  const iconColorClass =
    provider.badgeColor === 'cyan' ? 'text-cyan-400' : 'text-indigo-400'

  return (
    <div className="glass rounded-xl p-5 border border-slate-200 dark:border-white/10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg border ${iconBgClasses}`}
        >
          <Icon className={`h-4 w-4 ${iconColorClass}`} />
        </div>
        <span className="font-display text-lg font-semibold text-foreground">
          {provider.name}
        </span>
        <span
          className={`ml-auto text-[10px] rounded-full px-2.5 py-0.5 ${badgeClasses}`}
        >
          {provider.badge}
        </span>
      </div>

      {/* Pros */}
      <ul className="space-y-2 mt-4">
        {provider.pros.map((pro) => (
          <li key={pro} className="flex items-start gap-2">
            <Check className="h-3.5 w-3.5 text-cyan-400 mt-0.5 shrink-0" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {pro}
            </span>
          </li>
        ))}
      </ul>

      {/* Expandable env setup */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex items-center gap-1 mt-4 text-xs text-slate-400 dark:text-slate-500 hover:text-cyan-400 transition-colors"
      >
        <span>View Setup</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <pre className="mt-3 rounded-lg bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-3 text-xs font-mono text-slate-600 dark:text-slate-400 overflow-x-auto">
              {provider.env}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ChatMockup
// ---------------------------------------------------------------------------

function ChatMockup() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.3 })
  const [step, setStep] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  // Refs for cleanup
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([])
  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMounted = useRef(true)

  // Helper: schedule a timeout and track it for cleanup
  const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      if (isMounted.current) fn()
    }, ms)
    timeoutIds.current.push(id)
    return id
  }, [])

  // Clear all scheduled timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout)
    timeoutIds.current = []
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current)
      typewriterRef.current = null
    }
  }, [])

  // Typewriter effect
  const startTypewriter = useCallback(
    (text: string, onComplete: () => void) => {
      let i = 0
      setDisplayText('')

      const tick = () => {
        if (!isMounted.current) return
        if (i < text.length) {
          i++
          setDisplayText(text.slice(0, i))
          typewriterRef.current = setTimeout(tick, 40)
        } else {
          onComplete()
        }
      }
      tick()
    },
    []
  )

  // Ref to hold runSequence for self-referencing without stale closures
  const runSequenceRef = useRef<(() => void) | null>(null)

  // Run the animation sequence
  const runSequence = useCallback(() => {
    if (!isMounted.current) return

    clearAllTimeouts()
    setStep(0)
    setDisplayText('')
    setIsTyping(false)
    setIsFadingOut(false)

    // Step 1: user types message
    scheduleTimeout(() => {
      setStep(1)
      startTypewriter(CHAT_SCRIPT[0].text, () => {
        // After typewriter completes, show typing indicator
        scheduleTimeout(() => {
          setIsTyping(true)

          // Step 2: AI response appears
          scheduleTimeout(() => {
            setIsTyping(false)
            setStep(2)

            // Step 3: proposal slides in
            scheduleTimeout(() => {
              setStep(3)

              // Fade out and reset loop
              scheduleTimeout(() => {
                setIsFadingOut(true)

                scheduleTimeout(() => {
                  runSequenceRef.current?.()
                }, 600)
              }, 4000)
            }, 2000)
          }, 1200)
        }, 500)
      })
    }, 400)
  }, [clearAllTimeouts, scheduleTimeout, startTypewriter])

  // Keep ref in sync
  runSequenceRef.current = runSequence

  // Start/stop animation based on viewport visibility
  useEffect(() => {
    if (isInView) {
      runSequence()
    } else {
      clearAllTimeouts()
      setStep(0)
      setDisplayText('')
      setIsTyping(false)
      setIsFadingOut(false)
    }
  }, [isInView, runSequence, clearAllTimeouts])

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      clearAllTimeouts()
    }
  }, [clearAllTimeouts])

  return (
    <div
      ref={ref}
      className="glass rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10"
    >
      {/* Title bar */}
      <div className="border-b border-slate-200 dark:border-white/10 px-4 py-3 flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full bg-emerald-400"
          style={{ boxShadow: '0 0 8px rgba(52,211,153,0.4)' }}
        />
        <span className="text-sm font-display font-semibold text-foreground">
          AI Security Advisor
        </span>
      </div>

      {/* Chat body */}
      <div className="p-4 space-y-3 min-h-[280px]">
        <AnimatePresence mode="wait">
          {!isFadingOut ? (
            <motion.div
              key="chat-content"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              {/* User message */}
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-end"
                >
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl rounded-br-md px-4 py-2.5 ml-auto max-w-[85%]">
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {displayText}
                      {step === 1 && !isTyping && displayText.length < CHAT_SCRIPT[0].text.length && (
                        <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5 animate-pulse align-text-bottom" />
                      )}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex gap-1 px-4 py-3 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl rounded-bl-md w-fit">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* AI response */}
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl rounded-bl-md px-4 py-2.5 mr-auto max-w-[85%]">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {CHAT_SCRIPT[1].text}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Proposal tile */}
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-400/60 mb-1">
                      Proposed Change
                    </p>
                    <p className="text-sm font-semibold text-emerald-400">
                      {CHAT_SCRIPT[2].text}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] bg-emerald-500/20 text-emerald-400 rounded-md px-3 py-1 cursor-default">
                        Apply
                      </span>
                      <span className="text-[11px] bg-slate-100 dark:bg-white/5 text-slate-400 rounded-md px-3 py-1 border border-slate-200 dark:border-white/10 cursor-default">
                        Dismiss
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// AIAdvisorSection (main export)
// ---------------------------------------------------------------------------

export function AIAdvisorSection() {
  return (
    <section className="py-24 relative overflow-hidden border-t border-slate-200 dark:border-white/5">
      {/* Indigo radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,_rgba(129,140,248,0.06),_transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-3">
            AI-Powered
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Your AI Security Advisor
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            An agentic assistant that reads your projects, finds gaps, and
            proposes changes &mdash; you stay in control.
          </p>
        </motion.div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ChatMockup />
          </motion.div>

          <div className="space-y-4">
            {PROVIDERS.map((provider, index) => (
              <motion.div
                key={provider.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <ProviderCard provider={provider} />
              </motion.div>
            ))}
            <p className="text-xs text-muted-foreground text-center mt-4">
              Provider auto-detected at startup. Set one key and go.
            </p>
          </div>
        </div>

        {/* Capability strip */}
        <div className="flex flex-wrap justify-center gap-3 mt-16">
          {CAPABILITIES.map((cap, index) => (
            <motion.div
              key={cap.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-center gap-2 glass rounded-full px-4 py-2 text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10"
            >
              <cap.icon className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>{cap.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
