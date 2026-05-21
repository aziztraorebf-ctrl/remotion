# Souverain Design System

> Design system for the Souverain video channel — African geography & history documentary shorts (9:16 vertical, 1080x1920px).

## Brand Identity

- **Channel**: Souverain
- **Style**: Premium documentary — dark, authoritative, cinematic
- **Audience**: French-speaking African diaspora
- **Format**: Short-form vertical video (TikTok / Instagram / YouTube Shorts)

---

## Color Palette

| Token       | Hex       | Usage                                    |
|-------------|-----------|------------------------------------------|
| `gold`      | `#c8a951` | Primary accent — titles, dividers, highlights |
| `gold-light`| `#f0e8d8` | Ivory backgrounds, soft text             |
| `gold-dark` | `#9a7830` | Muted gold, secondary accents            |
| `navy`      | `#141c2e` | Primary background (default)             |
| `navy-deep` | `#080d14` | Darkest background, overlays             |
| `navy-light`| `#1e2d4a` | Secondary panels, cards                  |
| `ivory`     | `#f0e8d8` | Primary text on dark backgrounds         |
| `slate`     | `#9a8a6a` | Secondary text, metadata, captions       |
| `slate-light`| `#c8c0a8`| Tertiary text, subtle labels             |
| `kraft`     | `#c4a882` | Kraft paper variant — warm, historical   |

### Background Modes

- **Dark (default)**: `navy` `#141c2e` background — documentary, dramatic
- **Kraft (historical)**: `#d4c29d` background — archival, past tense
- **Black (climax)**: `#000000` background — maximum impact moments

---

## Typography

### Fonts

| Font        | Role                    | Style               |
|-------------|-------------------------|---------------------|
| **Cinzel**  | Titles, labels, headers | Serif, UPPERCASE    |
| **Nunito Sans** | Body, stats, values | Sans-serif, clean   |

### Size Scale (1080x1920 base)

| Token       | Size   | Weight | Usage                    |
|-------------|--------|--------|--------------------------|
| `stat-2xl`  | 200px  | 700    | Hero numbers, key stats  |
| `stat-xl`   | 180px  | 700    | Large featured numbers   |
| `stat-lg`   | 120px  | 700    | Section stats            |
| `stat-md`   | 80px   | 700    | Supporting numbers       |
| `entity`    | 110px  | 700    | Country/entity names     |
| `label`     | 38px   | 400    | Category labels, captions|
| `mono-sm`   | 28px   | 400    | Sources, metadata        |

**Minimum text size**: 32px — never below this for readability.

---

## Layout & Spacing

### Canvas

- **Primary format**: 9:16 vertical — 1080 × 1920px
- **Secondary format**: 16:9 horizontal — 1920 × 1080px

### Safe Zones (9:16)

| Token         | Value | Purpose                          |
|---------------|-------|----------------------------------|
| `safe-top`    | 288px | Top margin — avoid TikTok UI     |
| `safe-bottom` | 192px | Bottom margin — avoid home bar   |
| `col-pad`     | 54px  | Column horizontal padding        |
| `side-pad`    | 30px  | Tight side padding               |

### Safe Zones (16:9)

| Token            | Value | Purpose           |
|------------------|-------|-------------------|
| `safe-top-169`   | 108px | Top margin        |
| `safe-bottom-169`| 108px | Bottom margin     |
| `col-pad-169`    | 96px  | Column padding    |
| `side-pad-169`   | 96px  | Side padding      |

---

## Components

### Dividers

- **Gold horizontal line**: `1-2px solid #c8a951` — separates sections
- **Gold short rule**: `60-80px wide, 2px, centered` — under titles
- **Full-width separator**: under stat rows

### Stat Row

Label (Cinzel, 38px, gold uppercase) + Value (Nunito Sans bold, 80-120px, ivory)
Separated by thin gold divider lines.

### Title Block

```
[CATEGORY LABEL — Cinzel, small, gold, uppercase, letter-spacing wide]
[MAIN TITLE — Cinzel, large, ivory, uppercase]
[thin gold rule — 80px centered]
[subtitle — Nunito Sans, label size, slate-light]
```

### Progress Bar

- Position: very bottom of frame (y = 1880px, height = 8px)
- Color: gold `#c8a951`
- Animates 0% → 100% over clip duration

---

## Backgrounds

Three valid background types — no others:

1. **Navy dots (CSS)**: `navy` base + subtle dot pattern overlay — default documentary look
2. **Kraft paper (PNG)**: warm `#d4c29d` with paper texture — historical/archival scenes
3. **Geometric SVG**: navy base + abstract angular shapes in navy-light — modern informational

**FORBIDDEN backgrounds**: smoke, clouds, organic photographic textures, gradients.

---

## Template Catalog

| Template          | Format | Background | Primary Use                    |
|-------------------|--------|------------|--------------------------------|
| `GlobeReveal`     | 9:16   | Navy       | Geographic location reveal     |
| `DataCard`        | 9:16   | Navy/Black | Key statistics                 |
| `SplitScreen`     | 9:16   | Navy       | Two entities comparison        |
| `BrutalHeadline`  | 9:16   | Black      | Shocking fact / climax         |
| `KraftCard`       | 9:16   | Kraft      | Historical event / archive     |
| `BigStat`         | 9:16   | Navy/Black | Single dominant number         |
| `NewsClipping`    | 9:16   | Kraft/Cream| Newspaper-style reveal         |
| `ComparisonTable` | 9:16   | Navy       | Multi-row data comparison      |
| `DateBar`         | 9:16   | Navy       | Timeline / date reveal         |
| `DocClassifie`    | 9:16   | Kraft      | Classified document aesthetic  |

---

## Animation Rules

- **Spring motion**: `damping 80-100, stiffness 50-70` — organic, not bouncy
- **Max hold**: 4-5 seconds per beat before next motion
- **Permanent motion**: always at least one element moving (no fully static frames)
- **Forbidden**: CSS `transition:`, `@keyframes`, `setTimeout`, `requestAnimationFrame`
- **Required**: Remotion `spring()` and `interpolate()` with `extrapolateRight: 'clamp'`

---

## Code Conventions (Remotion / React)

```typescript
// Colors
const GOLD = "#c8a951";
const NAVY = "#141c2e";
const IVORY = "#f0e8d8";

// Timing always audio-derived — NEVER hardcoded frames
const startFrame = AUDIO_SEGMENTS.intro.startFrame;

// Springs for movement
const progress = spring({ fps, frame, config: { damping: 90, stiffness: 60 } });

// Safe zones
const SAFE_TOP = 288;    // px, 9:16
const SAFE_BOTTOM = 192; // px, 9:16
```

**No emojis in code files** (`.ts`, `.tsx`, `.js`, `.json`).
**Lucide React** for icons — `import { Icon } from "lucide-react"`.
**Tailwind 3.4** for layout — all tokens above are in `tailwind.config.ts`.
