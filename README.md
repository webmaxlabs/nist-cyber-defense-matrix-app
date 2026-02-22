# Cyber Defense Matrix AI

Open source cybersecurity posture assessment platform built on [Sounil Yu's Cyber Defense Matrix](https://cyberdefensematrix.com) — a 5x5 grid mapping NIST CSF functions (Identify, Protect, Detect, Respond, Recover) against asset classes (Devices, Applications, Networks, Data, Users).

**Live demo:** [cyberdefensematrix.ai](https://cyberdefensematrix.ai)

## What It Does

- **Assess maturity** across all 25 cells of the Cyber Defense Matrix (levels 1-5)
- **Map security tools** to specific cells to see what's covered and what's not
- **Identify gaps** — unassessed cells, low maturity areas, cells with no tools
- **Generate reports** with exportable data for stakeholders
- **AI Security Advisor** — chat with an AI agent that can read your matrix, analyze gaps, compare projects, and propose changes (with confirmation before any writes)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion 12 |
| Charts | Recharts 3 |
| State | TanStack React Query v5 |
| AI | Anthropic SDK / OpenRouter (configurable) |
| Validation | Zod v4 |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- (Optional) An [Anthropic](https://console.anthropic.com) or [OpenRouter](https://openrouter.ai) API key for the AI advisor

### 1. Clone and install

```bash
git clone https://github.com/webmaxlabs/nist-cyber-defense-matrix-app.git
cd nist-cyber-defense-matrix-app
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SECRET_KEY=your-supabase-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For the AI advisor (optional):

```env
# Option A: OpenRouter (default, supports multiple models)
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=anthropic/claude-sonnet-4

# Option B: Anthropic direct
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 3. Set up the database

Run the SQL migrations in order against your Supabase project. You can do this through the Supabase Dashboard SQL Editor or using the Supabase CLI:

```bash
supabase db push
```

The migrations create all tables, RLS policies, and helper functions.

### 4. Configure Supabase Auth

In your Supabase Dashboard under **Authentication > URL Configuration**:

- **Site URL**: `http://localhost:3000` (or your production domain)
- **Redirect URLs**: `http://localhost:3000/auth/callback`

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # ESLint
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, signup, auth callbacks
│   ├── (dashboard)/     # Authenticated pages (projects, matrix, report)
│   ├── (public)/        # Public pages (learn)
│   ├── api/chat/        # AI chat streaming endpoint
│   └── page.tsx         # Landing page
├── components/
│   ├── chat/            # AI advisor widget and sidebar
│   ├── landing/         # Homepage sections
│   ├── matrix/          # Core 5x5 grid, cell details, assessments
│   ├── projects/        # Project CRUD
│   └── report/          # Report generation
├── lib/
│   ├── actions/         # Server actions (mutations)
│   ├── ai/              # AI agent: providers, tools, agent loop
│   ├── constants/       # Matrix enums, labels, colors
│   ├── data/            # 100+ security tools catalog
│   ├── hooks/           # TanStack Query hooks
│   └── supabase/        # Client, server, admin, types
└── providers/           # Auth, Query, Theme, Chat providers
```

## The Cyber Defense Matrix

The framework maps five NIST Cybersecurity Framework functions against five asset classes:

|  | Identify | Protect | Detect | Respond | Recover |
|--|----------|---------|--------|---------|---------|
| **Devices** | | | | | |
| **Applications** | | | | | |
| **Networks** | | | | | |
| **Data** | | | | | |
| **Users** | | | | | |

Each cell gets a maturity rating (1-5) and can have security tools mapped to it. This gives you a clear picture of where your security program is strong and where the gaps are.

Learn more at [cyberdefensematrix.ai/learn](https://cyberdefensematrix.ai/learn) or read [Sounil Yu's original work](https://cyberdefensematrix.com).

## AI Security Advisor

The built-in AI agent can:

- Read your project data, assessments, and tool mappings
- Analyze coverage gaps and recommend priorities
- Compare maturity across multiple projects
- Search a catalog of 100+ security tools
- Propose assessment updates and tool mappings (with user confirmation before any changes)

The agent uses a hybrid architecture: read operations execute server-side for real data access, while write operations are emitted as confirmation tiles that require user approval.

Configure with either Anthropic (direct) or OpenRouter (multi-model) — see environment setup above.

## Security Hardening

This project has been audited against the [OWASP Top 10](https://owasp.org/www-project-top-ten/) and implements defense-in-depth across multiple layers:

### HTTP Security Headers

All responses include hardened headers via `next.config.ts`:

- **Content-Security-Policy** — restricts script, style, image, connect, and font sources
- **Strict-Transport-Security** — HSTS with 2-year max-age, includeSubDomains, preload
- **X-Frame-Options: DENY** — prevents clickjacking
- **X-Content-Type-Options: nosniff** — prevents MIME sniffing
- **Referrer-Policy: strict-origin-when-cross-origin**
- **Permissions-Policy** — disables camera, microphone, geolocation

### Authentication & Authorization

- **Row-Level Security (RLS)** on all Supabase tables — users can only access their own data
- **SECURITY DEFINER helper functions** break RLS circular dependencies between `projects` and `project_members`
- **Server-side auth verification** — all mutations verify the user via `getUser()` before executing
- **Admin client pattern** — write operations use a service-role client after auth verification, with app-level ownership checks (`.eq('owner_id', user.id)`)
- **Open redirect prevention** — auth callback validates redirect paths, blocks `//`, `:\`, and encoded slashes
- **Password policy** — minimum 8 characters, requires uppercase, lowercase, and number

### API Defenses

- **Rate limiting** — token bucket (20 requests/minute per user) on the chat API
- **CORS origin validation** — chat API verifies request origin against allowed domains
- **Zod schema validation** — all API inputs validated; error details never leaked to client
- **Input sanitization** — HTML tags and control characters stripped from all user-provided text
- **Prompt injection prevention** — project data sanitized before interpolation into AI system prompts

### Security Logging

- **Structured JSON logging** for security events (rate limit hits, CORS violations, auth failures, invalid redirects)
- **Auth callback error logging** — OAuth code exchange failures logged with error details for debugging

## Deployment

Deploy to any platform that supports Next.js. The live demo runs on [Vercel](https://vercel.com).

Make sure to set all environment variables in your hosting platform and update the Supabase Auth URL configuration to match your production domain.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
