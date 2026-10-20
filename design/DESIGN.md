# Daybloom — Design System

> A daily planner, workout tracker and food diary that feels like a sticker-covered
> bullet journal: warm paper, bold ink, three bright section colors, and small
> moments of play. Structure is calm and predictable; personality lives on the surface.

## 1. Concept

- **"Sticker journal."** Cream "paper" background, deep-ink text, cards that look like
  stickers placed on a page: rounded corners, a crisp 2px ink outline on primary
  surfaces, and a hard offset shadow on buttons that "presses in" on click.
- **One color per section.** Planner = violet, Workouts = tangerine, Food = leaf green.
  The color follows the user (nav highlight, page header blob, pills, charts) so they
  always know where they are without reading.
- **One bold move per screen.** Each page header gets an oversized display title plus a
  soft blob in the section color. Everything below stays quiet.
- **Delight in small doses.** Checkbox pop, button press, idea-card shuffle flip,
  progress bars that fill with a springy ease. All disabled under reduced motion.

Name: keep **Daybloom** (warm, optimistic, implies daily growth). Alternates considered:
"Sunrep", "Plotbloom". Daybloom is the strongest; no change recommended.

## 2. Palette (tokens in `src/styles/theme.css`)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#FFF8F0` cream paper | `#14111F` night ink | page background |
| `--surface` | `#FFFFFF` | `#1E1A2E` | cards |
| `--surface-2` | `#FFF0E3` | `#2A2540` | inputs, hovered rows |
| `--ink` / `--text` | `#1E1B2E` | `#F6F1FF` | text, outlines |
| `--muted` | `#5B5770` | `#B7B0CC` | secondary text (AA on bg) |
| `--brand` | `#D6336C` bloom pink | `#FF8FB1` | primary actions, logo |
| `--c-planner` | `#6741D9` violet | `#B197FC` | planner section |
| `--c-workout` | `#D9480F` tangerine | `#FF9A62` | workout section |
| `--c-food` | `#1F7A3A` leaf | `#69DB7C` | food section |
| `--danger` | `#C92A2A` | `#FF8787` | destructive |

Each accent has `-soft` (tinted background) and `--on-*` (text on solid accent):
white in light mode, deep ink in dark mode. All solid accents pass 4.5:1 with their
`--on-*` color; `--muted` passes 4.5:1 on `--bg` and `--surface` in both themes.

Charts: `--chart-1` planner violet, `--chart-2` workout tangerine, `--chart-3` food
green, `--chart-4` sunny gold; `--chart-grid`, `--chart-text` for axes.

## 3. Type (Google Fonts)

- **Display: Bricolage Grotesque** (700/800) — quirky, characterful headlines and big numbers.
- **Body/UI: Figtree** (400/500/600/700) — friendly, very legible at small sizes.
- Numbers use `font-variant-numeric: tabular-nums` in stats, timers and tables.

Scale (`--fs-*`): xs 0.75rem · sm 0.875 · base 1 · md 1.125 · lg 1.375 · xl 1.75 ·
2xl 2.25 · 3xl clamp(2.5rem, 6vw, 4.5rem) (landing/page hero only).
Line height 1.55 body, 1.1 display. Letter-spacing -0.02em on display.

## 4. Spacing, radius, shadow, motion

- **Spacing** 4px base: `--sp-1` 4 · `--sp-2` 8 · `--sp-3` 12 · `--sp-4` 16 · `--sp-5` 24 ·
  `--sp-6` 32 · `--sp-7` 48 · `--sp-8` 64.
- **Radius** `--r-sm` 10 · `--r-md` 16 · `--r-lg` 24 · `--r-xl` 32 · `--r-pill` 999.
  Inputs and buttons use `--r-md`/pill; cards `--r-lg`; modals `--r-xl`.
- **Shadow** `--shadow-sm` soft lift; `--shadow-md` card hover; `--shadow-pop` hard offset
  `4px 4px 0 var(--ink)` for primary buttons, idea card, sticker accents.
- **Motion** `--dur-fast` 120ms · `--dur` 220ms · `--dur-slow` 420ms;
  `--ease-out` cubic-bezier(.2,.8,.2,1); `--ease-spring` cubic-bezier(.34,1.56,.64,1).
  `prefers-reduced-motion: reduce` removes transforms and animations globally.

## 5. Navigation model

- **Desktop (>= 760px):** `.app-shell` is a two-column grid. Left `.sidebar` (248px,
  sticky) holds the brand, primary nav (Today, Planner, Workouts, Food, Friends) and
  Profile/Settings + theme toggle at the bottom.
- **Mobile (< 760px):** sidebar hides; a fixed `.tabbar` with 5 icon+label tabs sits at
  the bottom (64px + safe-area). Pages get bottom padding so nothing hides behind it.
- Two levels max: section → view. Views inside a section use `.tabs` (segmented control:
  Day / Week / Month / Year). Never nest tabs.
- Active nav link: filled pill in the section accent (set `data-section="planner|workout|food"`
  on the NavLink, or default brand pink), plus `aria-current` from NavLink.

## 6. Components (classes in theme.css)

- **Layout:** `.page` (max 1120px, padded), `.page-header` (title + actions; add
  `accent-planner|workout|food` to the page for the colored blob), `.stack`, `.row`,
  `.grid-2`, `.grid-3` (collapse to 1 column on mobile), `.spacer` (flex grow).
- **Cards:** `.card` white sticker with 2px outline in light/soft border in dark.
  `.card-title` small caps-ish label + optional icon. `.card.interactive` lifts on hover.
- **Buttons:** `.btn` base (44px min). `.btn-primary` brand pink with hard shadow press,
  `.btn-ghost` transparent, `.btn-danger`, `.btn-sm` (36px visual, still 44px hit via
  padding on touch), `.icon-btn` 44px round. Section variants: `.btn-planner|workout|food`.
- **Forms:** `.field` > `.label` + `.input|.select|.textarea` + `.hint`/`.error-text`.
  Focus = 3px ring in `--focus`. Errors use red border + icon + text (never color alone).
- **Feedback:** `.badge`, `.chip`(+`.active`), `.pill-planner|workout|food`, `.progress`
  > `.progress-bar`, `.ring` (SVG with `.ring-track`, `.ring-fill`, `.ring-label`),
  `.stat` > `.stat-value` + `.stat-label`, `.toast` (+`.toast-success|error`).
- **Lists:** `.list` > `.list-item` (44px+ rows), `.checkbox` (custom pop check),
  `.list-item.done` strikes through text.
- **Social:** `.avatar` (initials in a colored circle; `.avatar-lg`), `.feed-item`
  (avatar, body, meta, reactions).
- **Empty states:** `.empty` with `.empty-art` (CSS blob flower) + one friendly line +
  one action. Copy tone: "Nothing planned yet. A blank page is a good page."
- **Idea generator:** `.idea-card` — sunny gradient sticker with confetti dots; toggle
  `.shuffle` for 600ms to play the flip; `.idea-card-label`, `.idea-text`, `.idea-actions`.
- **Overlays:** `.modal-backdrop` > `.modal` (bottom sheet on mobile, centered dialog on
  desktop). Trap focus and close on Escape in JS.
- **Auth:** `.auth-page` (blob background) > `.auth-card`.

## 7. Voice

Short, warm, a little cheeky. Verbs first. Celebrate streaks, never shame misses
("Rest days count too."). Numbers are big, labels are small.

## 8. Accessibility checklist

AA contrast in both themes · visible `:focus-visible` ring everywhere · targets >= 44px ·
color plus icon/text for status · `prefers-reduced-motion` honored · semantic headings
(one `h1` per page) · charts get a text summary or table fallback.

## 9. Credits

Fonts: Bricolage Grotesque and Figtree via Google Fonts (SIL Open Font License).
Illustrations are CSS/inline SVG shapes made for Daybloom.
