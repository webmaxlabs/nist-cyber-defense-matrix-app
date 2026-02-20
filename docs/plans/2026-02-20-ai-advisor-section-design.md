# AI Advisor Homepage Section — Design Doc

## Overview

Add a new homepage section showcasing the AI Security Advisor feature. Two-column layout: animated chat mockup demonstrating the UX flow (left) + provider deployment comparison with expandable code blocks (right). Capability strip below. Targets developers evaluating deployment options.

## Placement

After `<ToolShowcaseSlider />`, before "Why This Exists" section in `src/app/page.tsx`.

## Section Heading

Centered above the two-column grid:

- Mono badge: `"AI-Powered"` (cyan, uppercase, tracking-widest)
- H2: `"Your AI Security Advisor"`
- Subtext: `"An agentic assistant that reads your projects, finds gaps, and proposes changes — you stay in control."`

## Left Column: Animated Chat Mockup

A glass-framed panel styled to look like the chat widget, containing a pre-scripted conversation that auto-plays on scroll-into-view.

### Conversation Script

1. **User message** (types character by character, ~1.5s): `"What are my biggest security gaps?"`
2. **AI response** (typing indicator then fade-in, ~2s): `"Based on your project, I found 3 critical gaps: Devices/Recover has no coverage, Networks/Detect is at maturity level 1, and Data/Respond has no tools mapped..."`
3. **Confirmation tile** (slides up, ~0.5s): Styled tile showing `"Update Networks/Detect → Maturity 3"` with [Apply] and [Dismiss] buttons (visual only, non-functional)

### Animation

- Triggered by `useInView` (Framer Motion) — plays when section scrolls into viewport
- Staggered `motion.div` delays for each message
- Mock title bar: "AI Security Advisor" + green status dot
- Message bubbles match actual chat styling (user = right-aligned cyan tint, AI = left-aligned)
- Sequence holds 3s after completion, then loops with fade reset
- Mobile: full width, reduced padding

## Right Column: Provider Comparison

Two stacked glass cards, one per deployment option.

### OpenRouter Card (Top)

- Badge: `"Default"` in cyan
- Bullets:
  - Access 100+ models (Claude, GPT-4, Llama, Mixtral)
  - Single API key for all providers
  - Pay-per-token, no contracts
- Expandable `.env` block:
  ```
  OPENROUTER_API_KEY=sk-or-...
  OPENROUTER_MODEL=anthropic/claude-sonnet-4  # optional
  ```

### Anthropic SDK Card (Bottom)

- Badge: `"Direct"` in indigo
- Bullets:
  - Native tool_use streaming — lowest latency
  - Direct Anthropic API — no middleman
  - Best for production deployments
- Expandable `.env` block:
  ```
  ANTHROPIC_API_KEY=sk-ant-...
  ```

### Card Animation

- Fade in + upward translate, 200ms stagger between cards
- Expandable section: Framer Motion `AnimatePresence` for smooth height transition
- Below cards: muted note — `"Provider auto-detected at startup. Set one key and go."`

## Capability Strip

Horizontal row of 5 compact glass badges spanning full width below the two columns:

| Icon | Label |
|------|-------|
| Search | Reads your assessments, tools, and gaps |
| PenTool | Proposes maturity updates & tool mappings |
| ShieldCheck | Every change requires your approval |
| GitCompare | Compare across multiple projects |
| Server | All data stays in your Supabase instance |

- Animation: fade in left-to-right, 100ms stagger on scroll
- Mobile: wraps to 2-3 per row

## Background

Subtle radial gradient glow with indigo tint (differentiates from emerald glow on tool showcase above).

## Component Architecture

- **Create**: `src/components/landing/ai-advisor-section.tsx` — single `'use client'` component
- **Modify**: `src/app/page.tsx` — add `<AIAdvisorSection />` after `<ToolShowcaseSlider />`

## Light/Dark Mode

Follows established patterns:
- `border-slate-200 dark:border-white/10`
- `bg-white dark:bg-transparent` on cards
- `text-slate-600 dark:text-slate-300` for body text
- Code blocks: `bg-slate-100 dark:bg-white/[0.03]`

## Data Source

All content is static/hardcoded — no runtime data fetching. The chat mockup is a scripted animation, not connected to the actual AI system.
