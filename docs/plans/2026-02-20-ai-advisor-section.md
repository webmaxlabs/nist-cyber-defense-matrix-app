# AI Advisor Homepage Section — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a two-column homepage section showcasing the AI Security Advisor — animated chat mockup (left) + provider deployment comparison with expandable code blocks (right) + capability strip below.

**Architecture:** Single `'use client'` component (`AIAdvisorSection`) with three sub-components: `ChatMockup` (animated conversation), `ProviderCard` (glass card with expandable `.env` block), and a capability badge strip. Uses Framer Motion `whileInView` for scroll-triggered animations matching existing `feature-cards.tsx` patterns.

**Tech Stack:** React 19, Framer Motion 12 (`motion`, `AnimatePresence`, `whileInView`), Tailwind v4, Lucide icons.

---

## Task 1: Create the AIAdvisorSection component with static layout

**Files:**
- Create: `src/components/landing/ai-advisor-section.tsx`

**Step 1: Create the component file with section shell + heading**

Create `src/components/landing/ai-advisor-section.tsx` with:

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Search,
  PenTool,
  ShieldCheck,
  GitCompare,
  Server,
  ChevronDown,
  Sparkles,
  User,
} from 'lucide-react'
```

Constants for the provider data:

```tsx
const PROVIDERS = [
  {
    name: 'OpenRouter',
    badge: 'Default',
    badgeColor: 'cyan',
    icon: Sparkles,
    pros: [
      'Access 100+ models (Claude, GPT-4, Llama, Mixtral)',
      'Single API key for all providers',
      'Pay-per-token, no contracts',
    ],
    env: `OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=anthropic/claude-sonnet-4  # optional`,
  },
  {
    name: 'Anthropic SDK',
    badge: 'Direct',
    badgeColor: 'indigo',
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
```

Chat mockup script:

```tsx
const CHAT_SCRIPT = [
  {
    role: 'user' as const,
    text: 'What are my biggest security gaps?',
  },
  {
    role: 'assistant' as const,
    text: 'Based on your project, I found 3 critical gaps: Devices/Recover has no coverage, Networks/Detect is at maturity level 1, and Data/Respond has no tools mapped.',
  },
  {
    role: 'proposal' as const,
    text: 'Update Networks/Detect → Maturity 3',
  },
]
```

### Sub-component: `ProviderCard`

A glass card with expandable `.env` code block. Takes a provider object.

Layout:
- Header row: `icon` (in a styled container) + `name` (font-display bold) + badge pill (right-aligned)
- Bullet list: 3 pros with `text-sm text-slate-600 dark:text-slate-400`
- Expandable trigger: button with "View Setup" text + rotating ChevronDown icon
- Expandable content: `<pre>` code block with `.env` contents, animated height with `AnimatePresence`

Expand state: `const [isOpen, setIsOpen] = useState(false)` per card.

Card frame: `glass rounded-xl p-5 border border-slate-200 dark:border-white/10`

Badge styling by color:
- cyan: `bg-cyan-500/10 text-cyan-400 border-cyan-500/20`
- indigo: `bg-indigo-500/10 text-indigo-400 border-indigo-500/20`

Expandable animation:
```tsx
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
```

Chevron rotation: `className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}`

### Sub-component: `ChatMockup`

A glass-framed panel simulating the chat widget with animated conversation.

**Frame**: `glass rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10`

**Title bar**: A top bar with:
- Green status dot: `h-2 w-2 rounded-full bg-emerald-400` with `pulse-glow` animation (use inline `--pulse-color: rgba(52, 211, 153, 0.4)`)
- Title: `"AI Security Advisor"` in `text-sm font-display font-semibold`
- Styled: `border-b border-slate-200 dark:border-white/10 px-4 py-3 flex items-center gap-2`

**Chat body**: `p-4 space-y-3 min-h-[280px]` container

**Animation sequence** — driven by a state machine:
- `const [step, setStep] = useState(0)` — which message is visible (0 = none, 1 = user msg, 2 = AI msg, 3 = proposal tile)
- `const [displayText, setDisplayText] = useState('')` — for typewriter on user message
- `const [isTyping, setIsTyping] = useState(false)` — for AI typing indicator

Use `useInView` from Framer Motion to detect when the component scrolls into view:
```tsx
import { useInView } from 'framer-motion'
const ref = useRef(null)
const isInView = useInView(ref, { once: true, amount: 0.3 })
```

When `isInView` becomes true, trigger the sequence via `useEffect`:

1. **t=0**: Set `step=1`, start typewriter effect on user message
   - Typewriter: `useEffect` that iterates `CHAT_SCRIPT[0].text` char by char with 40ms intervals via `setTimeout`
2. **t=1800ms** (after typing finishes): Set `isTyping=true` (show bouncing dots)
3. **t=3000ms**: Set `isTyping=false`, `step=2` (show AI response with fade-in)
4. **t=5000ms**: Set `step=3` (show proposal tile with slide-up)
5. **t=9000ms**: Reset all state to 0, loop

**User message bubble**: Right-aligned, `bg-cyan-500/10 border border-cyan-500/20 rounded-2xl rounded-br-md px-4 py-2 ml-auto max-w-[85%]`

**AI message bubble**: Left-aligned, `bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-2xl rounded-bl-md px-4 py-2 mr-auto max-w-[85%]`

**Typing indicator**: Three bouncing dots (reuse pattern from `chat-typing-indicator.tsx`):
```tsx
<div className="flex gap-1 px-4 py-2">
  {[0, 1, 2].map(i => (
    <motion.div
      key={i}
      className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
    />
  ))}
</div>
```

**Proposal tile**: `bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3`
- Title: `text-sm font-semibold text-emerald-400`
- Two mock buttons: `[Apply]` (bg-emerald-500/20 text-emerald-400) and `[Dismiss]` (bg-white/5 text-slate-400)
- Animate in with: `initial={{ opacity: 0, y: 10 }}` → `animate={{ opacity: 1, y: 0 }}`

### Main `AIAdvisorSection` component

```tsx
export function AIAdvisorSection() {
  return (
    <section className="py-24 relative overflow-hidden border-t border-slate-200 dark:border-white/5">
      {/* Indigo radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,_rgba(129,140,248,0.06),_transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading — scroll animated */}
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
          {/* Left: Chat Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ChatMockup />
          </motion.div>

          {/* Right: Provider Cards */}
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
```

**Step 2: Verify build compiles**

Run: `npm run build`
Expected: Build succeeds with zero errors

**Step 3: Commit**

```bash
git add src/components/landing/ai-advisor-section.tsx
git commit -m "feat: add AI advisor homepage section with chat mockup and provider comparison"
```

---

## Task 2: Add the section to the homepage

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Import and place the component**

In `src/app/page.tsx`:
- Add import: `import { AIAdvisorSection } from '@/components/landing/ai-advisor-section'`
- Place `<AIAdvisorSection />` between `<ToolShowcaseSlider />` and the `{/* Why This Exists */}` section

Page order becomes:
1. `<TopNav />`
2. `<HeroSection />`
3. `<FeatureCards />`
4. `<ToolShowcaseSlider />`
5. **`<AIAdvisorSection />`** ← NEW
6. Why This Exists section
7. How It Works section
8. CTA section
9. Footer

**Step 2: Verify build compiles**

Run: `npm run build`
Expected: Build succeeds with zero errors

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add AI advisor section to homepage after tool showcase"
```

---

## Task 3: Visual polish and verification

**Step 1: Production build**

Run: `npm run build`
Expected: Build succeeds with zero errors, no TypeScript warnings

**Step 2: Visual QA checklist**

Run: `npm run dev`, navigate to `http://localhost:3000`

- [ ] Section appears between tool showcase and why-this-exists
- [ ] Section heading fades in on scroll
- [ ] Chat mockup: typewriter effect types user message character by character
- [ ] Chat mockup: typing indicator (bouncing dots) appears after user message
- [ ] Chat mockup: AI response fades in after typing indicator
- [ ] Chat mockup: proposal tile slides up after AI response
- [ ] Chat mockup: sequence loops after completion
- [ ] Provider cards: both cards fade in with stagger
- [ ] Provider cards: "View Setup" expands/collapses smoothly
- [ ] Provider cards: `.env` code block renders correctly
- [ ] Capability strip: badges fade in left-to-right with stagger
- [ ] Dark mode: glass effects, borders, text colors all correct
- [ ] Light mode: backgrounds, borders, text all readable
- [ ] Mobile (< 768px): stacks to single column, no overflow
- [ ] No hydration warnings in console
- [ ] No layout shift when animations trigger

**Step 3: Fix any issues found, commit**

```bash
git add src/components/landing/ai-advisor-section.tsx
git commit -m "polish: refine AI advisor section styling and animations"
```
