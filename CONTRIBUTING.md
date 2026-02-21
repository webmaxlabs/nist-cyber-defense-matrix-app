# Contributing to Cyber Defense Matrix AI

Thanks for considering a contribution. This is an open-source cybersecurity posture assessment tool built on Sounil Yu's Cyber Defense Matrix framework. Contributions of all kinds are welcome.

## Development Setup

```bash
# Clone and install
git clone https://github.com/webmaxlabs/nist-cyber-defense-matrix-app.git
cd nist-cyber-defense-matrix-app
npm install

# Configure environment
cp .env.example .env.local
# Add your Supabase project URL and keys:
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
#   SUPABASE_SECRET_KEY
# Optional — enables AI advisor:
#   ANTHROPIC_API_KEY

# Run
npm run dev
```

The app runs at `http://localhost:3000`. You'll need a [Supabase](https://supabase.com) project for auth and database functionality.

## What We're Looking For

- **Bug fixes** — found something broken? Fix it and send a PR.
- **Security tools catalog** — the app includes a catalog of 100 security tools mapped to the matrix. Know a tool that's missing or miscategorized? Add it in `src/lib/data/security-tools.ts`.
- **UI improvements** — better interactions, accessibility fixes, responsive layout issues.
- **Documentation** — clearer explanations, better examples, typo fixes.
- **Framework accuracy** — corrections to how NIST CSF functions or asset classes are represented.

If you're unsure whether something fits, open an issue first.

## Pull Request Workflow

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `npm run build` and `npm run lint` — both must pass
4. Commit using the `type: description` format:
   - `feat: add network scanning tool to catalog`
   - `fix: correct maturity color for level 3`
   - `docs: update setup instructions`
5. Open a PR against `main` with a clear description of what changed and why

Keep PRs focused. One concern per PR.

## Code Conventions

**Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion.

A few things to know:

- **Tailwind v4** uses `@theme inline` in `globals.css` instead of `tailwind.config.ts`. Color variables are defined there in OKLCH.
- **Light/dark mode** is supported via `next-themes`. Every component needs both modes. Use the `dark:` prefix pattern:
  ```
  border-slate-200 dark:border-white/10
  bg-slate-50 dark:bg-white/[0.03]
  text-slate-600 dark:text-slate-300
  ```
- **shadcn/ui** components live in `src/components/ui/` — don't modify these directly. Wrap or extend them in your own components.
- **Glass cards** use the `glass` CSS class (defined in `globals.css`), not the default shadcn Card styling.
- **Route groups**: `(auth)`, `(dashboard)`, `(public)` separate layout concerns.
- **Server actions** go in `src/lib/actions/`, hooks in `src/lib/hooks/`, types in `src/lib/supabase/types.ts`.

## Project Structure

```
src/
├── app/           # Routes and layouts
├── components/    # UI components by domain
├── lib/           # Business logic, hooks, actions, constants
└── providers/     # React context providers
```

See `CLAUDE.md` in the repo root for the full structure and design system reference.

## Getting Help

- **Issues**: https://github.com/webmaxlabs/nist-cyber-defense-matrix-app/issues
- **Discussions**: https://github.com/webmaxlabs/nist-cyber-defense-matrix-app/discussions
