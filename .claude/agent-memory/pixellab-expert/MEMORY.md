# PixelLab Expert - Persistent Memory

## Generation Log
| Date | Asset Type | Description | ID | Status | Quality |
|------|-----------|-------------|-----|--------|---------|
| 2026-02-16 | character | Peasant Man 64x64 4-dir | db8dce29 | OK | 8/10 |
| 2026-02-16 | character | Peasant Woman 64x64 4-dir | 99eb124f | PARTIAL | No walk anims |
| 2026-02-16 | character | Merchant 64x64 4-dir | 190effe1 | OK | 7/10 |
| 2026-02-16 | character | Monk 64x64 4-dir | c2923dcd | PARTIAL | No west walk |
| 2026-02-16 | character | Child 48x48 4-dir | da1c3676 | OK | Folder="walk" not "walking" |
| 2026-02-16 | character | Noble v2 64x64 4-dir | 5e466104 | PARTIAL | South walk only |
| 2026-02-16 | character | Blacksmith v2 64x64 4-dir | d5fa97e8 | OK | 8/10 |
| 2026-02-16 | character | Plague Doctor 64x64 8-dir | local | OK | Concept art pipeline, 4 frames |
| 2026-02-16 | tileset | Cobblestone topdown | - | OK | Downloaded to tilesets/ |
| 2026-02-16 | map-object | Barrel | - | OK | Downloaded |
| 2026-02-16 | map-object | Cart | - | OK | Downloaded |
| 2026-02-16 | map-object | Fountain | - | OK | Downloaded |
| 2026-02-16 | map-object | Market Stall | - | OK | Downloaded |
| 2026-02-16 | map-object | Well | - | OK | Downloaded |

## Recurring Errors
| Error | Count | Last Seen | Resolution |
|-------|-------|-----------|------------|
| Characters floating in sky (painted bg) | 10+ | 2026-02-17 | STOP using painted bg. Use tileset grid. |
| Characters walking through walls | 5+ | 2026-02-17 | Grid cells define walkable, not pixel estimation |
| base64 prefix causing 422 | 2 | 2026-02-16 | Raw base64 only, no data:image prefix |
| Low coherence at default guidance | 1 | 2026-02-16 | image_guidance_scale=8.0 not 1.4 |

## Pipeline Decisions
| Decision | Date | Rationale |
|----------|------|-----------|
| Tileset-based ground (not painted bg) | 2026-02-17 | 10+ failed iterations with painted bg compositing |
| 64x64 character size (not 96) | 2026-02-16 | Better proportions for medieval style |
| Concept art pipeline for complex chars | 2026-02-16 | Text-only gives fantasy results for Plague Doctor |
| image_guidance_scale=8.0 standard | 2026-02-16 | 90%+ coherence vs 60% at default |

## Style Parameters (Peste 1347 Standard)
- Character size: 64x64 (child: 48x48)
- View: low top-down
- Outline: single color black outline
- Shading: basic shading
- Detail: medium detail
- Proportions: default preset
- Tileset tile_size: 32x32 (matches character scale)

## Quality Notes
- MCP characters are non-deterministic: never regenerate a working asset
- Concept art pipeline (Gemini -> PixelLab) produces better results for specific/complex designs
- Map objects auto-delete in 8 hours: download immediately after generation
- Animation gotchas must be checked per-character (no uniform naming, no uniform frame count)
