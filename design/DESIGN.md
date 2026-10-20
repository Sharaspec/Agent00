# Daybloom — Design System

> A daily planner, workout tracker and food diary that feels calm and considered:
> cool paper, navy ink, one blue accent and hairline lines. Structure is predictable;
> character comes from typography and restraint, not decoration.

## 1. Concept

- **Quiet paper.** White and cool off-white surfaces, near-black navy text, 1px hairline
  borders instead of outlines, barely-there shadows, generous whitespace. No dot grids,
  blobs, stickers, tilts or offset shadows.
- **One accent, three quiet section tones.** Navy is the brand (primary buttons); the
  sections are told apart by blue (Planner), slate-steel (Workouts) and muted sage (Food).
  Section color appears in small doses: nav icon, pills, rings, chart bars.
- **One bold move per screen.** On the landing page it is the serif headline; in the app
  it is the navy idea card. Everything else stays low-energy.
- **Motion is short and linear-ish.** 120–320ms ease-out fades and colour changes; no
  springs, wobbles or rotations. All disabled under `prefers-reduced-motion`.
- **Icons** are inline 24px stroke SVGs from `src/components/Icon.tsx` (1.75 stroke).
  No emoji or pictographic Unicode glyphs anywhere.

## 2. Palette (tokens in `src/styles/theme.css`)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F5F7FA` | `#0D1420` | page background |
| `--surface` | `#FFFFFF` | `#141D2B` | cards, sidebar |
| `--surface-2` | `#EEF2F6` | `#1C2738` | hovers, tracks, segmented control |
| `--border` | `#D9E0E8` | `#263244` | hairlines |
| `--text` / `--ink` | `#142033` / `#0F1B2D` | `#E6ECF3` / `#070B12` | text |
| `--muted` | `#566377` | `#9AA8BA` | secondary text (AA on bg/surfaces) |
| `--brand` | `#1F3A64` navy | `#8DB0E6` | primary actions, logo |
| `--c-planner` | `#2E5AA7` blue | `#7FA6E8` | planner |
| `--c-workout` | `#3C5A73` slate-steel | `#8FB0C8` | workouts |
| `--c-food` | `#4D7A62` sage | `#8FBFA3` | food |
| `--sun` | `#E8DFCF` warm sand | `#D9C9A8` | tiny warm accents (streak, idea dot) |
| `--danger` | `#B4363A` | `#F08A8A` | destructive |

Each accent has `-soft` (tint) and `--on-*` (text on solid: white in light, `#0D1420` in
dark); pills use `--c-*-text` for AA on the tint. Charts: `--chart-1` blue, `--chart-2`
steel `#5B7D99`, `--chart-3` sage, `--chart-4` sand `#B08D57`.

## 3. Type (Google Fonts)

- **Inter** (400–700) for body and UI.
- **Inter Tight** (500–700) for headings, numbers and card titles, weight 600.
- **Newsreader** (400) serif for a few editorial moments only: the landing headlines and
  the idea-card text.

## 4. Spacing, radius, shadow

- Spacing 4px base (`--sp-1`…`--sp-8`: 4, 8, 12, 16, 24, 32, 48, 72).
- Radius `--r-sm` 6 · `--r-md` 8 (buttons, inputs) · `--r-lg` 12 (cards) · `--r-xl` 16 (modals, landing panels).
- `--line` is 1px. `--shadow-sm` is a 1px lift; `--shadow-pop` is a soft panel shadow, used rarely.

## 5. Navigation

Desktop: 240px sidebar, active link = soft section tint + coloured icon. Mobile (<760px):
fixed bottom tab bar with icon + label; active tab gets the section colour and a 2px top
indicator. Views inside a section use the `.tabs` segmented control.

## 6. Accessibility

AA contrast in both themes, 2px focus ring offset from the surface, 44px touch targets
(checkbox hit area expanded), colour never the only signal, icon-only buttons keep
`aria-label`, reduced motion honoured.

## 7. Credits

Inter, Inter Tight and Newsreader via Google Fonts (SIL Open Font License). Icons and the
bloom mark are hand-drawn inline SVGs made for Daybloom.
