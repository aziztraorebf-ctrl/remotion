# Creative Director - Persistent Memory

## Aziz's Visual Preferences (learned from rejections)
| What he rejected | Why | Lesson |
|-----------------|-----|--------|
| Sprites on black backgrounds | "Low effort", slideshow feel | Rich scene compositions required |
| Characters floating in sky | Incorrect Y positioning | Must validate ground plane before placement |
| Scene 7 scatter/flee | NOT in script, confabulated | Always verify against scenes.json verbatim |
| Kimi's "frozen tableau" direction | Too flat for pixel art | Aziz wants MOVEMENT, not static compositions |
| Incremental patches on same failure | Gets worse, not better | Rebuild from zero after 2 failed attempts |

## Aziz's Visual Preferences (learned from approvals)
| What he approved | Context | Lesson |
|-----------------|---------|--------|
| PixelLab character style (64px) | Better than 96px for medieval | Keep 64px standard |
| Concept art pipeline for Plague Doctor | Much better than text-only | Use Gemini concept art for complex characters |
| Hook scenes 1-5 | Working composition | Reference these for what WORKS |
| Lane-based movement concept | Hybrid direction (not frozen, not scatter) | Characters should MOVE slowly, not flee |

## Direction Briefs History
(Briefs will be logged here as they're produced)

## Preflight Reports History
(Reports will be logged here as they're produced)

## Error Pattern Tracker
| Pattern | Count | Last Seen | Status |
|---------|-------|-----------|--------|
| Sprites on painted bg | 10+ | 2026-02-17 | BLOCKED by pixellab-expert |
| Confabulated scene content | 3 | 2026-02-17 | Caught - always check scenes.json |
| Missing character animations | 5+ | 2026-02-17 | Preflight catches this |
| Incremental patch spiral | 3+ | 2026-02-17 | Circuit breaker rule active |

## Recurring Questions Aziz Should Answer
(Questions that come up repeatedly and should be pre-answered)
- Where should text appear on screen? (size, position, animation)
- How many characters on screen for crowd scenes?
- Reference images for visual style targets?
