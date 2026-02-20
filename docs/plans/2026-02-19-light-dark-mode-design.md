# Light/Dark Mode Toggle — Design

## Overview
Add a light/dark mode selector to DefenseMatrix. The light theme uses a muted light approach: light slate/gray backgrounds with the same cyan/indigo accents, frosted white glass cards, and soft colored shadows replacing neon glows.

## Theme: Muted Light
- **Backgrounds**: Light slate/gray (`slate-50` to `slate-100`) instead of deep navy
- **Cards**: Frosted white glass (`white/70` with blur) instead of dark glass
- **Accents**: Same cyan/indigo palette — keeps tactical identity
- **Glows**: Soft colored shadows (`shadow-cyan-200/30`) instead of neon box-shadows
- **Text**: Dark slate (`slate-900`/`slate-700`) instead of white/slate-300
- **Matrix cells & maturity colors**: Same hues, adjusted saturation for light backgrounds

## Implementation Stack
- **`next-themes`**: Handles class toggling, localStorage persistence, SSR flash prevention
- **CSS variables**: Light palette in `:root`, dark palette in `.dark` block
- **Custom utilities**: Add `.dark` scoping to `glass`, `glow-cyan`, etc.
- **Toggle UI**: Sun/Moon icon button in top nav

## What Stays the Same
- Font choices (Exo 2, DM Sans, JetBrains Mono)
- Layout structure, spacing, grid
- Cyan/indigo accent palette
- Animation effects (gradient borders, scan lines)
- Component structure

## What Changes
1. `globals.css` — Split `:root` (light) and `.dark` (dark) variable blocks; scope custom utilities
2. `layout.tsx` — Remove hardcoded `dark` class, wrap with `next-themes` ThemeProvider
3. `top-nav.tsx` — Add theme toggle button (Sun/Moon icons)
4. New `src/providers/theme-provider.tsx` — Thin wrapper around `next-themes`
5. Component touch-ups — Any hardcoded dark-only classes that need light variants

## Storage
- localStorage only via `next-themes` (no DB storage needed)
- System preference detection supported out of the box
