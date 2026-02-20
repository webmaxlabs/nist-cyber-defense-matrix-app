# Light/Dark Mode Toggle — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a muted light / dark mode toggle to DefenseMatrix with system preference detection and localStorage persistence.

**Architecture:** Use `next-themes` for class-based theme switching (adds/removes `dark` on `<html>`). Light palette lives in `:root`, dark palette in `.dark`. Custom tactical utilities (`glass`, `glow-cyan`, `nav-glass`, etc.) are scoped with `.dark` and get light-mode equivalents. Toggle button (Sun/Moon) in the top nav.

**Tech Stack:** next-themes, Tailwind v4 `dark:` variant, CSS custom properties (OKLCH)

---

### Task 1: Install next-themes and create ThemeProvider

**Files:**
- Create: `src/providers/theme-provider.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Install next-themes**

Run: `npm install next-themes`

**Step 2: Create ThemeProvider wrapper**

Create `src/providers/theme-provider.tsx`:

```tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  )
}
```

**Step 3: Update layout.tsx**

- Remove hardcoded `className="dark"` from `<html>` — add `suppressHydrationWarning` instead (required by next-themes)
- Wrap children with `<ThemeProvider>`

```tsx
import { ThemeProvider } from "@/providers/theme-provider";

// In RootLayout:
<html lang="en" suppressHydrationWarning>
  <body className={`${exo2.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased noise`}>
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  </body>
</html>
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Clean build, app defaults to dark theme (no visual change yet)

**Step 5: Commit**

```
feat: add next-themes provider for light/dark mode switching
```

---

### Task 2: Create light palette in globals.css

**Files:**
- Modify: `src/app/globals.css:51-118`

**Step 1: Replace `:root` with light palette, keep `.dark` as-is**

The current `:root` and `.dark` blocks are identical (both dark). Replace `:root` with a muted light palette:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(0.97 0.005 265);
  --foreground: oklch(0.15 0.02 260);
  --card: oklch(0.98 0.003 260);
  --card-foreground: oklch(0.15 0.02 260);
  --popover: oklch(0.99 0.002 260);
  --popover-foreground: oklch(0.15 0.02 260);
  --primary: oklch(0.65 0.18 195);
  --primary-foreground: oklch(0.98 0.005 265);
  --secondary: oklch(0.93 0.01 260);
  --secondary-foreground: oklch(0.25 0.02 260);
  --muted: oklch(0.94 0.008 260);
  --muted-foreground: oklch(0.45 0.02 250);
  --accent: oklch(0.93 0.01 260);
  --accent-foreground: oklch(0.25 0.02 260);
  --destructive: oklch(0.55 0.22 25);
  --border: oklch(0.88 0.01 260);
  --input: oklch(0.88 0.01 260);
  --ring: oklch(0.65 0.18 195 / 50%);
  --chart-1: oklch(0.65 0.18 195);
  --chart-2: oklch(0.55 0.20 280);
  --chart-3: oklch(0.60 0.18 160);
  --chart-4: oklch(0.70 0.18 85);
  --chart-5: oklch(0.55 0.22 25);
  --sidebar: oklch(0.96 0.005 262);
  --sidebar-foreground: oklch(0.25 0.02 260);
  --sidebar-primary: oklch(0.65 0.18 195);
  --sidebar-primary-foreground: oklch(0.98 0.005 265);
  --sidebar-accent: oklch(0.93 0.01 260);
  --sidebar-accent-foreground: oklch(0.25 0.02 260);
  --sidebar-border: oklch(0.88 0.01 260);
  --sidebar-ring: oklch(0.65 0.18 195 / 50%);
}
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```
feat: add muted light color palette to CSS variables
```

---

### Task 3: Scope custom utility classes for light/dark

**Files:**
- Modify: `src/app/globals.css:129-351`

**Step 1: Add light-mode variants for tactical utilities**

Each custom utility gets a light-mode version. The `.dark` scoped versions preserve current behavior.

Key utilities to scope:

**Glass:**
```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 40, 0.08);
}
.dark .glass {
  background: rgba(14, 20, 37, 0.5);
  border-color: rgba(100, 140, 200, 0.10);
}
```

**Nav glass:**
```css
.nav-glass {
  background: rgba(255, 255, 255, 0.80);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 40, 0.06);
}
.dark .nav-glass {
  background: rgba(8, 11, 22, 0.75);
  border-bottom-color: rgba(100, 140, 200, 0.08);
}
```

**Glow utilities (become subtle shadows in light):**
```css
.glow-cyan-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 0 8px rgba(34, 211, 238, 0.06);
}
.dark .glow-cyan-sm {
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.12), 0 0 30px rgba(34, 211, 238, 0.04);
}
/* Same pattern for glow-cyan, glow-cyan-strong, glow-indigo */
```

**Cyber grid background:**
```css
.cyber-grid-bg {
  background-image: radial-gradient(circle at 1px 1px, rgba(34, 211, 238, 0.04) 1px, transparent 0);
  background-size: 40px 40px;
}
.dark .cyber-grid-bg {
  background-image: radial-gradient(circle at 1px 1px, rgba(34, 211, 238, 0.06) 1px, transparent 0);
}
```

**Noise texture:**
```css
.noise::before { opacity: 0.012; }
.dark .noise::before { opacity: 0.018; }
```

**Card hover lift:**
```css
.card-hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08), 0 0 20px rgba(34, 211, 238, 0.03);
}
.dark .card-hover-lift:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 211, 238, 0.05);
}
```

**Scrollbar:**
```css
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 40, 0.12);
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 40, 0.25);
}
.dark ::-webkit-scrollbar-thumb {
  background: rgba(100, 140, 200, 0.18);
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 140, 200, 0.35);
}
```

**Maturity colors** — keep the same (they work on both backgrounds since they use transparent RGBA).

**Glass-hover, gradient borders, scan-line, shimmer, pulse-glow, text-gradient-cyan** — keep as-is (they use cyan/indigo which work on both themes).

**Chart overrides:**
```css
.recharts-cartesian-grid-horizontal line,
.recharts-cartesian-grid-vertical line {
  stroke: rgba(0, 0, 40, 0.06) !important;
}
.dark .recharts-cartesian-grid-horizontal line,
.dark .recharts-cartesian-grid-vertical line {
  stroke: rgba(100, 140, 200, 0.06) !important;
}
```

**Step 2: Verify build**

Run: `npm run build`

**Step 3: Commit**

```
feat: scope tactical CSS utilities for light/dark mode
```

---

### Task 4: Add theme toggle button to top nav

**Files:**
- Modify: `src/components/layout/top-nav.tsx`

**Step 1: Add theme toggle**

Import `useTheme` from `next-themes` and `Sun`/`Moon` from lucide-react. Add a toggle button in the nav's right-side flex container, before the sign-in/user-menu buttons:

```tsx
import { useTheme } from 'next-themes'
import { Shield, Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

// Inside TopNav:
const { theme, setTheme } = useTheme()
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])

// In the flex items-center gap-3 div, before the auth buttons:
{mounted && (
  <button
    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 dark:border-white/10 border-slate-200 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-slate-100 transition-colors"
    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {theme === 'dark' ? (
      <Sun className="h-4 w-4 text-slate-400" />
    ) : (
      <Moon className="h-4 w-4 text-slate-500" />
    )}
  </button>
)}
```

**Step 2: Verify build and toggle works**

Run: `npm run build`
Manual test: Click toggle, verify `<html>` class switches between `dark` and no class.

**Step 3: Commit**

```
feat: add sun/moon theme toggle to top nav
```

---

### Task 5: Update hardcoded dark-only classes across components

**Files to modify:** ~20 files with hardcoded `border-white/10`, `text-slate-300`, `bg-white/[0.0x]`, `bg-[rgba(14,20,37,...)]` patterns.

This is the largest task. The approach: add `dark:` prefixed versions alongside light-mode defaults for each hardcoded pattern.

**Common patterns to replace:**

| Dark-only pattern | Replacement |
|---|---|
| `border-white/10` | `border-slate-200 dark:border-white/10` |
| `bg-white/[0.02]` or `bg-white/[0.03]` | `bg-slate-50 dark:bg-white/[0.03]` |
| `bg-white/[0.06]` | `bg-slate-100 dark:bg-white/[0.06]` |
| `bg-white/5` | `bg-slate-100 dark:bg-white/5` |
| `text-slate-300` | `text-slate-600 dark:text-slate-300` |
| `text-slate-400` | `text-slate-500 dark:text-slate-400` |
| `text-slate-500` (as muted) | `text-slate-400 dark:text-slate-500` |
| `bg-[rgba(14,20,37,0.8)]` | `bg-slate-50/90 dark:bg-[rgba(14,20,37,0.8)]` |
| `bg-cyan-500/10` | keep (works on both) |
| `text-cyan-400` | keep (works on both) |
| `hover:bg-white/5` | `hover:bg-slate-100 dark:hover:bg-white/5` |
| `border-dashed border-white/10` | `border-dashed border-slate-200 dark:border-white/10` |

**Group 1 — Layout components:**
- `src/components/layout/top-nav.tsx` (update toggle button classes)
- `src/components/layout/mobile-nav.tsx`
- `src/components/layout/user-menu.tsx`
- `src/components/layout/nav-links.tsx`
- `src/components/layout/project-sub-nav.tsx`

**Group 2 — Learn page components:**
- `src/components/learn/security-tool-card.tsx`
- `src/components/learn/security-tool-modal.tsx`
- `src/components/learn/faq-item.tsx`
- `src/components/learn/resources-section.tsx`
- `src/components/learn/tool-matrix-coverage.tsx`
- `src/components/learn/framework-overview.tsx`
- `src/components/learn/tool-logo.tsx`

**Group 3 — Matrix components:**
- `src/components/matrix/tools-tab.tsx`
- `src/components/matrix/tool-picker-item.tsx`
- `src/components/matrix/tool-picker-dialog.tsx`
- `src/components/matrix/maturity-selector.tsx`
- `src/components/matrix/learn-tab.tsx`
- `src/components/matrix/assessment-tab.tsx`

**Group 4 — Dashboard, Projects, Landing:**
- `src/components/dashboard/security-gaps.tsx`
- `src/components/dashboard/coverage-bar-chart.tsx`
- `src/components/projects/view-toggle.tsx`
- `src/components/projects/new-project-form.tsx`
- `src/components/projects/empty-state.tsx`
- `src/components/landing/hero-section.tsx`

**Group 5 — Auth and Report (report has print styles, keep those):**
- `src/components/auth/signup-form.tsx`
- `src/components/auth/login-form.tsx`
- `src/components/auth/magic-link-form.tsx`
- `src/components/report/*.tsx` (has `print:` classes — keep those, add dark: where needed)
- `src/components/chat/*.tsx`

**Step: Commit after each group**

```
feat: update layout components for light/dark mode
feat: update learn page components for light/dark mode
feat: update matrix components for light/dark mode
feat: update dashboard/projects/landing for light/dark mode
feat: update auth/report/chat for light/dark mode
```

---

### Task 6: Final verification and polish

**Step 1: Full build check**

Run: `npm run build`
Expected: Zero errors

**Step 2: Visual QA**

Manual test in browser:
- Toggle between light/dark
- Check every page: landing, login, signup, projects, matrix, report, learn
- Verify localStorage persistence (refresh should keep mode)
- Verify system preference detection (remove localStorage, check OS preference)
- Check print styles still work on report page

**Step 3: Final commit**

```
feat: complete light/dark mode toggle implementation
```
