# Homepage Vision Update — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the homepage from SaaS marketing tone to an honest, open-source, community-driven voice that reflects DefenseMatrix's mission.

**Architecture:** Surgical copy rewrite across 5 existing files. One new inline section ("Why This Exists") added to page.tsx. No new component files. All animations and visual design preserved.

**Tech Stack:** Next.js, React, Framer Motion (existing), Lucide icons (add Github icon), Tailwind v4

**GitHub Repo:** `https://github.com/webmaxlabs/nist-cyber-defense-matrix-app`

---

### Task 1: Update Top Nav — Add GitHub Link

**Files:**
- Modify: `src/components/layout/top-nav.tsx`

**Step 1: Add GitHub icon import**

In `top-nav.tsx`, add `Github` to the lucide-react import:

```tsx
import { Github, Moon, Shield, Sun } from 'lucide-react'
```

**Step 2: Add GitHub link button next to theme toggle**

Inside the `<div className="flex items-center gap-3">`, immediately before the theme toggle button, add:

```tsx
<a
  href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app"
  target="_blank"
  rel="noopener noreferrer"
  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
  title="View on GitHub"
>
  <Github className="h-4 w-4 text-slate-500 dark:text-slate-400" />
</a>
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Clean build, no errors.

**Step 4: Commit**

```bash
git add src/components/layout/top-nav.tsx
git commit -m "feat: add GitHub repo link to top navigation"
```

---

### Task 2: Rewrite Hero Section

**Files:**
- Modify: `src/components/landing/hero-section.tsx`

**Step 1: Update imports**

Replace the icon imports line:
```tsx
// Old:
import { Shield, ArrowRight, Zap } from 'lucide-react'
// New:
import { Shield, ArrowRight, Github } from 'lucide-react'
```

**Step 2: Replace the badge (pill)**

Replace the entire `<motion.div>` badge block (lines ~88-98) — swap Zap icon and "Powered by" text:

```tsx
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
```

**Step 3: Replace the headline**

Replace the entire `<h1>` block:

```tsx
<h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
  <span className="text-foreground">See what your</span>
  <br />
  <span className="text-foreground">security program</span>
  <br />
  <span className="text-gradient-cyan">actually covers.</span>
</h1>
```

**Step 4: Replace the subheadline**

Replace the `<p>` paragraph:

```tsx
<p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
  DefenseMatrix maps your tools and capabilities across the Cyber Defense
  Matrix &mdash; a proven 5&times;5 framework that cuts through vendor noise and
  shows you where you&apos;re strong, where you&apos;re exposed, and what to do about it.
</p>
```

**Step 5: Replace the CTA buttons**

Replace the entire flex div containing both buttons:

```tsx
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
</div>
```

**Step 6: Verify build**

Run: `npm run build`
Expected: Clean build, no errors.

**Step 7: Commit**

```bash
git add src/components/landing/hero-section.tsx
git commit -m "feat: rewrite hero section with open-source messaging and GitHub CTA"
```

---

### Task 3: Rewrite Feature Cards

**Files:**
- Modify: `src/components/landing/feature-cards.tsx`

**Step 1: Update the features array**

Replace the entire `features` array:

```tsx
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
]
```

**Step 2: Update section header copy**

Replace the label, heading, and description inside the `motion.div`:

```tsx
<p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-3">What It Does</p>
<h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
  No buzzwords. Just clarity.
</h2>
<p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
  Built on Sounil Yu&apos;s Cyber Defense Matrix &mdash; a framework that maps what you have
  against what you need. No marketing jargon, no vendor spin.
</p>
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Clean build, no errors.

**Step 4: Commit**

```bash
git add src/components/landing/feature-cards.tsx
git commit -m "feat: rewrite feature cards with direct, anti-buzzword copy"
```

---

### Task 4: Update Tool Showcase Slider Copy

**Files:**
- Modify: `src/components/landing/tool-showcase-slider.tsx`

**Step 1: Update section heading and description**

Replace the heading and description in the section heading div (lines ~236-242):

```tsx
<h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
  How real tools map to the matrix
</h2>
<p className="text-muted-foreground max-w-2xl mx-auto">
  Every security tool covers different cells. See where the overlap is and where
  the gaps are &mdash; no vendor pitch required.
</p>
```

The label ("Ecosystem") stays unchanged.

**Step 2: Verify build**

Run: `npm run build`
Expected: Clean build, no errors.

**Step 3: Commit**

```bash
git add src/components/landing/tool-showcase-slider.tsx
git commit -m "feat: update tool showcase copy to match honest tone"
```

---

### Task 5: Add "Why This Exists" Section + Rewrite How It Works + CTA + Footer in page.tsx

This is the largest task — it modifies the main page layout.

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Add imports**

Add `Github`, `BookOpen`, `Globe`, `Code2` to the lucide imports, plus `Link` from next:

```tsx
import { Shield, Github, BookOpen, Globe, Code2 } from 'lucide-react'
import Link from 'next/link'
```

Note: `Link` may not currently be imported in page.tsx. Add if missing.

**Step 2: Add "Why This Exists" section after ToolShowcaseSlider**

Insert this block immediately after `<ToolShowcaseSlider />`:

```tsx
{/* Why This Exists */}
<section className="py-24 relative border-t border-slate-200 dark:border-white/5">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-3">The Problem</p>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
        Security shouldn&apos;t require a translator.
      </h2>
      <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
        <p>
          Marketing lingo, made-up terminology, and endless vendor consolidation have made it
          nearly impossible to understand what a security tool actually does for your program.
          Brands merge, products rebrand, and capabilities get buried under layers of buzzwords.
        </p>
        <p>
          Sounil Yu created the Cyber Defense Matrix as a way to cut through the noise &mdash; a
          simple 5&times;5 grid that maps security functions against asset classes. It started as a
          framework in a book. DefenseMatrix turns that framework into a tool any security team
          can deploy.
        </p>
        <p>
          This is open source software, built for security teams to run in-house, so you control
          the sensitive data it collects. Free to use, free to improve, built in the open.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
      {[
        {
          icon: Code2,
          title: 'Open Source',
          description: 'Deploy it yourself. Own your data. No vendor lock-in.',
        },
        {
          icon: BookOpen,
          title: 'Framework-Driven',
          description: 'Built on the Cyber Defense Matrix, not marketing whitepapers.',
        },
        {
          icon: Globe,
          title: 'Community-Built',
          description: 'Free for every security team. Contribute on GitHub.',
        },
      ].map((item) => (
        <div key={item.title} className="glass rounded-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/5 border border-cyan-500/15 mb-4">
            <item.icon className="h-5 w-5 text-cyan-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Step 3: Rewrite How It Works section**

Replace the existing "How It Works" section heading and steps:

```tsx
{/* How It Works */}
<section className="py-24 relative border-t border-slate-200 dark:border-white/5">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <p className="text-xs font-mono text-indigo-400 tracking-widest uppercase mb-3">Process</p>
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
        Three steps. That&apos;s it.
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      {[
        { step: '01', title: 'Define Your Scope', description: 'Set up a project for your organization and define what you\u2019re assessing.' },
        { step: '02', title: 'Assess Honestly', description: 'Walk through all 25 cells. Rate your actual maturity \u2014 not where you wish you were. Map the tools you have.' },
        { step: '03', title: 'See the Truth', description: 'Review your coverage gaps, export reports, and prioritize what to fix based on real data.' },
      ].map((item) => (
        <div key={item.step} className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-5">
            <span className="font-mono text-lg font-bold text-cyan-400">{item.step}</span>
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Step 4: Rewrite CTA section**

Replace the entire CTA section:

```tsx
{/* CTA Section */}
<section className="py-24 relative">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,_rgba(34,211,238,0.06),_transparent_60%)]" />
  <div className="container mx-auto px-4 relative">
    <div className="glass rounded-2xl p-12 sm:p-16 text-center max-w-3xl mx-auto gradient-border-animated">
      <div className="relative">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6">
          <Shield className="h-8 w-8 text-cyan-400" />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Your security posture shouldn&apos;t be a mystery.
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Deploy DefenseMatrix for your team or try the live demo. Open source,
          self-hosted, no strings attached.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/signup" className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-8 py-3 rounded-lg transition-all glow-cyan-sm hover:glow-cyan">
            Try the Live Demo
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a
            href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-cyan-500/30 hover:text-cyan-300 font-semibold px-8 py-3 rounded-lg transition-all"
          >
            <Github className="h-4 w-4" />
            Get the Source Code
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Step 5: Replace the footer with expanded 3-column version**

Replace the entire footer section:

```tsx
{/* Footer */}
<footer className="border-t border-slate-200 dark:border-white/5 py-12">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
      {/* Brand column */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-500/10 border border-cyan-500/15">
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <span className="font-display text-sm font-semibold text-foreground">DefenseMatrix</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Open source cybersecurity assessment. Built on Sounil Yu&apos;s Cyber Defense Matrix.
        </p>
      </div>

      {/* Project column */}
      <div>
        <h4 className="font-display text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Project</h4>
        <ul className="space-y-2">
          <li>
            <a href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
              GitHub Repository
            </a>
          </li>
          <li>
            <Link href="/learn" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
              Documentation
            </Link>
          </li>
          <li>
            <a href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
              License
            </a>
          </li>
        </ul>
      </div>

      {/* Community column */}
      <div>
        <h4 className="font-display text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Community</h4>
        <ul className="space-y-2">
          <li>
            <a href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
              Contributing
            </a>
          </li>
          <li>
            <a href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app/issues" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
              Report Issues
            </a>
          </li>
          <li>
            <a href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app/discussions" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
              Discussions
            </a>
          </li>
        </ul>
      </div>

      {/* Framework column */}
      <div>
        <h4 className="font-display text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Framework</h4>
        <ul className="space-y-2">
          <li>
            <Link href="/learn" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
              About the Cyber Defense Matrix
            </Link>
          </li>
          <li>
            <a href="https://cyberdefensematrix.com" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
              Sounil Yu&apos;s Original Work
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-slate-200 dark:border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} DefenseMatrix. Open source under MIT License.
      </p>
      <a
        href="https://github.com/webmaxlabs/nist-cyber-defense-matrix-app"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan-400 transition-colors"
      >
        <Github className="h-3.5 w-3.5" />
        Star on GitHub
      </a>
    </div>
  </div>
</footer>
```

**Step 6: Verify build**

Run: `npm run build`
Expected: Clean build, no errors.

**Step 7: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add mission section, rewrite how-it-works/CTA/footer for open-source vision"
```

---

### Task 6: Final Verification

**Step 1: Full production build**

Run: `npm run build`
Expected: Clean build, zero errors.

**Step 2: Visual spot-check dev server**

Run: `npm run dev`
Manually verify:
- Nav shows GitHub icon
- Hero has "Open Source" badge, new headline, "Try the Live Demo" + "View on GitHub" CTAs
- Feature cards show new titles and copy
- Tool showcase has updated heading
- "Why This Exists" mission section appears between tools and how-it-works
- How It Works shows new step titles
- CTA has dual buttons (demo + source code)
- Footer is expanded 4-column layout
- All sections work in both light and dark mode

**Step 3: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: polish homepage vision update"
```
