# DefenseMatrix - Claude Code Project Guide

## Project Overview
Cybersecurity posture assessment platform based on Sounil Yu's **Cyber Defense Matrix** — a 5x5 grid mapping 5 NIST CSF functions (Identify, Protect, Detect, Respond, Recover) against 5 asset classes (Devices, Applications, Networks, Data, Users). Users create projects, assess maturity levels (1-5) per cell, map security tools, and generate reports.

## Tech Stack
- **Framework**: Next.js 16.1.6 (App Router) + React 19 + TypeScript
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS v4 (OKLCH colors, `@theme inline` directive) + shadcn/ui (New York style)
- **Animation**: Framer Motion 12
- **Charts**: Recharts 3
- **State**: TanStack React Query v5
- **Validation**: Zod v4
- **Icons**: Lucide React

## Commands
```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run lint    # ESLint
```

## Project Structure
```
src/
├── app/
│   ├── (auth)/          # Login, signup, auth callbacks
│   ├── (dashboard)/     # Authenticated pages (projects, matrix, report)
│   ├── (public)/        # Public pages (learn)
│   ├── api/chat/        # AI chat route handler
│   ├── layout.tsx        # Root layout (fonts, providers)
│   ├── page.tsx          # Landing page
│   └── globals.css       # Theme foundation (all CSS variables + utilities)
├── components/
│   ├── auth/            # Auth forms (login, signup, magic-link, oauth)
│   ├── chat/            # AI chat widget and panel
│   ├── dashboard/       # KPI cards, charts, activity feed
│   ├── landing/         # Hero, feature cards
│   ├── layout/          # Top nav, mobile nav, user menu
│   ├── learn/           # Educational content components
│   ├── matrix/          # Core matrix grid, cell details, assessment, tools
│   ├── projects/        # Project list, cards, forms
│   ├── report/          # Report generation components
│   ├── shared/          # Reusable (page-header, confirm-dialog, etc.)
│   └── ui/              # shadcn/ui primitives
├── lib/
│   ├── actions/         # Server actions (Supabase mutations)
│   ├── constants/       # Matrix enums, industries, company sizes, maturity levels
│   ├── data/            # Static data (security tools catalog)
│   ├── hooks/           # React Query hooks (use-projects, use-assessments, etc.)
│   ├── queries/         # Supabase query functions
│   ├── supabase/        # Supabase client/server/admin/middleware/types
│   ├── utils/           # Helpers (format, matrix-helpers, scores)
│   └── validators/      # Zod schemas
├── providers/           # AuthProvider, QueryProvider
middleware.ts            # Supabase session refresh
supabase/migrations/     # 6 SQL migration files
```

## Design System: "Tactical Cyber Operations Center"

### Theme Philosophy
Dark-mode-first, glassmorphism, neon glow effects. Feels like a professional cyber operations dashboard — tactical, sharp, purposeful.

### Fonts (Google Fonts, loaded in layout.tsx)
- **Display/Headings**: Exo 2 (`font-display`)
- **Body**: DM Sans (`font-sans`)
- **Monospace/Data**: JetBrains Mono (`font-mono`)

### Color Palette
- **Backgrounds**: Deep navy `oklch(0.09 0.01 260)` → `oklch(0.13 0.02 260)`
- **Primary accent**: Electric cyan `#22d3ee` (cyan-400)
- **Secondary accent**: Indigo `#818cf8` (indigo-400)
- **NIST column colors**: Cyan → Sky → Indigo → Violet → Purple gradient
- **Maturity levels**: Red(1) → Orange(2) → Yellow(3) → Green(4) → Emerald(5)
- **Text**: White/slate-300 for body, slate-500 for muted

### CSS Utility Classes (defined in globals.css)
| Class | Purpose |
|-------|---------|
| `glass` | Glassmorphism card (white/5 bg, blur, white/10 border) |
| `nav-glass` | Navigation glassmorphism |
| `cyber-grid-bg` | Dot grid background pattern |
| `glow-cyan` / `glow-cyan-sm` | Cyan box-shadow glow |
| `gradient-border-animated` | Animated cyan-to-purple border |
| `scan-line-overlay` | Subtle horizontal scan lines |
| `pulse-glow` | Breathing glow animation |
| `shimmer` | Loading shimmer effect |
| `noise` | Subtle noise texture overlay |
| `text-gradient-cyan` | Cyan-to-indigo text gradient |
| `card-hover-lift` | Hover lift + glow effect |
| `maturity-0` through `maturity-5` | Cell glow colors by maturity level |
| `matrix-cell-styled` | Base matrix cell hover styling |

### Component Patterns
- Cards use `glass border-white/10` (not shadcn Card defaults)
- Buttons: Primary = `bg-cyan-500 hover:bg-cyan-400 text-slate-950`
- Outline buttons: `border-white/10 text-slate-300 hover:bg-white/5`
- Form inputs: `bg-white/5 border-white/10 focus:border-cyan-500/40`
- Badges: `bg-white/5 text-slate-400 border border-white/10`
- Select dropdowns: `glass border-white/10` on content

### Report Components
- Report components include `print:bg-white print:text-black` fallbacks for printing
- Use `@media print` aware styling

## Database Schema (Supabase)
Key tables: `profiles`, `projects`, `project_members`, `cell_assessments`, `tools`, `tool_mappings`, `comments`, `activity_log`, `educational_content`, `chat_conversations`, `chat_messages`

Key enums: `asset_class` (5 values), `nist_function` (5 values), `maturity_level` (1-5), `implementation_status` (planned/in_progress/implemented/optimized)

## Conventions
- All components are `'use client'` unless they are pure server components
- Hooks in `src/lib/hooks/` wrap TanStack Query with Supabase queries
- Server actions in `src/lib/actions/` for mutations
- Route groups: `(auth)`, `(dashboard)`, `(public)` for layout separation
- Matrix cell references use `cell_row` (AssetClass) + `cell_column` (NistFunction)
- shadcn/ui components live in `src/components/ui/` — do not modify these directly
- Tailwind v4 uses `@theme inline` in globals.css instead of tailwind.config.ts
