# Homepage Vision Update — Design Document

**Date**: 2026-02-19
**Approach**: Surgical copy & section rewrite (Approach A)
**GitHub Repo**: https://github.com/webmaxlabs/nist-cyber-defense-matrix-app

## Vision

DefenseMatrix is an open-source cybersecurity posture assessment platform. The homepage should reflect that this is a community-driven, anti-buzzword tool built for security teams — not a SaaS product trying to convert leads.

**Target audience**: Security teams, researchers, analysts, and C-level stakeholders.

**Core message**: Security is confusing because of vendor noise. This tool makes it simple using a proven framework. It's open source. Deploy it yourself. Own your data.

**Tone**: Direct, honest, plain-spoken. No marketing lingo.

---

## Section-by-Section Design

### 1. Hero Section (`hero-section.tsx`)

**Badge**: `Open Source` (GitHub icon, links to repo)

**Headline**: "See what your security program actually covers."

**Subheadline**: "DefenseMatrix maps your tools and capabilities across the Cyber Defense Matrix — a proven 5x5 framework that cuts through vendor noise and shows you where you're strong, where you're exposed, and what to do about it."

**Primary CTA**: "Try the Live Demo" → `/signup`
**Secondary CTA**: "View on GitHub" → repo URL (GitHub icon)

**Trust indicators**: Keep (5x5 Defense Matrix, 25 Security Cells, 5 Maturity Levels) — factual, not marketing.

**Visual**: Animated matrix visualization stays as-is.

---

### 2. Feature Cards (`feature-cards.tsx`)

**Label**: `WHAT IT DOES`
**Heading**: "No buzzwords. Just clarity."
**Description**: "Built on Sounil Yu's Cyber Defense Matrix — a framework that maps what you have against what you need. No marketing jargon, no vendor spin."

**Cards** (same icons/colors, new copy):

1. **"Map Your Coverage"** (Grid3X3, cyan)
   - "Plot your security tools and capabilities across 5 asset classes and 5 NIST functions. See at a glance what's covered and what isn't."

2. **"Measure What Matters"** (TrendingUp, indigo)
   - "Rate each cell from 1 to 5 based on real capability — not vendor promises. Track progress as your program matures."

3. **"Find the Gaps"** (Search, amber)
   - "Stop guessing where you're exposed. The matrix reveals blind spots that slide decks and sales pitches won't show you."

4. **"Built for Teams"** (Users, emerald)
   - "Security isn't a solo effort. Invite your team, share assessments, and get everyone — technical or not — on the same page."

---

### 3. New "Why This Exists" Section (inline in `page.tsx`)

Placed after Feature Cards, before Tool Showcase.

**Label**: `THE PROBLEM`
**Heading**: "Security shouldn't require a translator."

**Body**:

> "Marketing lingo, made-up terminology, and endless vendor consolidation have made it nearly impossible to understand what a security tool actually does for your program. Brands merge, products rebrand, and capabilities get buried under layers of buzzwords."
>
> "Sounil Yu created the Cyber Defense Matrix as a way to cut through the noise — a simple 5x5 grid that maps security functions against asset classes. It started as a framework in a book. DefenseMatrix turns that framework into a tool any security team can deploy."
>
> "This is open source software, built for security teams to run in-house, so you control the sensitive data it collects. Free to use, free to improve, built in the open."

**Three value cards**:
- **Open Source** — "Deploy it yourself. Own your data. No vendor lock-in."
- **Framework-Driven** — "Built on the Cyber Defense Matrix, not marketing whitepapers."
- **Community-Built** — "Free for every security team. Contribute on GitHub."

---

### 4. Tool Showcase Slider (`tool-showcase-slider.tsx`)

**Label**: `ECOSYSTEM` (unchanged)
**Heading**: "How real tools map to the matrix"
**Description**: "Every security tool covers different cells. See where the overlap is and where the gaps are — no vendor pitch required."

Carousel and coverage matrices stay as-is.

---

### 5. How It Works (inline in `page.tsx`)

**Label**: `PROCESS` (unchanged)
**Heading**: "Three steps. That's it."

1. **"Define Your Scope"** — "Set up a project for your organization and define what you're assessing."
2. **"Assess Honestly"** — "Walk through all 25 cells. Rate your actual maturity — not where you wish you were. Map the tools you have."
3. **"See the Truth"** — "Review your coverage gaps, export reports, and prioritize what to fix based on real data."

---

### 6. CTA Section (inline in `page.tsx`)

**Heading**: "Your security posture shouldn't be a mystery."
**Subtext**: "Deploy DefenseMatrix for your team or try the live demo. Open source, self-hosted, no strings attached."
**Primary CTA**: "Try the Live Demo" → `/signup`
**Secondary CTA**: "Get the Source Code" → GitHub repo (GitHub icon)

---

### 7. Top Nav (`top-nav.tsx`)

Add GitHub icon link next to theme toggle, linking to repo. Always visible.

---

### 8. Expanded Footer (inline in `page.tsx`)

**Column 1 — Project**:
- GitHub Repository (external)
- Documentation → `/learn`
- License

**Column 2 — Community**:
- Contributing (GitHub contributing guide)
- Report Issues (GitHub issues)
- Discussions (GitHub discussions)

**Column 3 — Framework**:
- About the Cyber Defense Matrix
- Sounil Yu attribution/link

**Bottom bar**: Logo + "Open source cybersecurity assessment. Built on Sounil Yu's Cyber Defense Matrix." + copyright

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/landing/hero-section.tsx` | Rewrite copy, add open source badge, GitHub link, change CTAs |
| `src/components/landing/feature-cards.tsx` | Rewrite heading, description, all 4 card titles + descriptions |
| `src/components/landing/tool-showcase-slider.tsx` | Tweak heading + description copy |
| `src/app/page.tsx` | Add "Why This Exists" section, rewrite How It Works, CTA, expand Footer |
| `src/components/layout/top-nav.tsx` | Add GitHub icon link in nav |

No new component files. "Why This Exists" lives inline in `page.tsx`.

---

## What Stays the Same

- All animations (Framer Motion particles, matrix visualization, 3D carousel)
- Visual design system (glassmorphism, cyan accents, dark theme)
- Component structure and layout
- Light/dark mode support
- Tool showcase slider mechanics
