# Pixel Art Director - Agent Memory

## Composition Decisions

### 2026-02-17 - Initial Analysis
- **Problem**: 10+ failed renders of sprites on painted perspective background (top-down)
- **Root cause**: Painted backgrounds have NO machine-readable ground plane
- **Solution identified**: Side-view cinematic parallax for character scenes, top-down for maps

### Perspective Assignments (Peste 1347)
| Scene Type | Perspective | Status |
|-----------|-------------|--------|
| Scenes 1-5 (plague map) | Top-down | Working (already implemented) |
| Scene 6 (town square, NPCs) | TBD (side-view recommended) | Not yet implemented |
| Scene 7 (reflection) | TBD (side-view recommended) | Not yet implemented |

## Style Parameters (Peste 1347 Standard)

### Current Assets (Low Top-Down)
- Character size: 64x64 canvas, low top-down view
- Shading: basic shading
- Outline: single color black outline
- Detail: medium detail
- 8 characters generated, 4-8 directions each

### Recommended for Side-View Migration
- Character: `view="side"`, size=64, n_directions=4
- Tileset: `create_sidescroller_tileset`, tile_size 32x32
- Objects: `view="side"`, proportional to character size
- Need: parallax background layers (5-6 minimum)

## Aziz Visual Preferences (from production history)

### Approved
- 64px PixelLab characters (concept art pipeline)
- Hook scenes 1-5 (CRT overlay, data visualization)
- Lane-based NPC movement (controlled, not chaotic)

### Rejected
- Sprites on black background (too stark)
- Floating characters (poor compositing)
- Scatter/flee behavior in Scene 7 (script says reflection, not panic)
- Frozen tableau (Kimi suggestion - too static)
- Incremental patches on failed approaches

## Palette Reference

### Medieval Plague Tones (recommended)
- Dominant: browns (#8B7355, #6B5B3A), grays (#808080, #5C5C5C)
- Secondary: olive greens (#6B8E23), dark wood (#4A3728)
- Accents: desaturated red (#8B0000), mustard (#B8860B), dark purple (#4B0082)
- Shadows: shift toward purple/blue
- Highlights: shift toward warm yellow
- Shadow overlay: #322125 @ 60% opacity

## Recurring Issues Tracker

| Issue | Count | Status |
|-------|-------|--------|
| Sprites on painted background | 10+ | SOLVED (pipeline rule: tileset/parallax only) |
| Perspective inconsistency | 2 | Watch for (top-down objects in side-view scenes) |
| Resolution mismatch | 0 | Not yet encountered |

## Research Sources (Key References)
- SLYNYRD Pixelblog (22 articles referenced) - gold standard for pixel art rules
- Derek Yu - common mistakes guide
- Liberated Pixel Cup - open standard for proportions
- Saint11 - consistency rules
- Lospec - palette database + tutorials
