# PixelLab Expert - Persistent Memory

> Projet actif : **Peste 1347** — Style SVG Enluminure/Gravure pur (pivot 2026-02-21)
> **IMPORTANT : PixelLab n'est plus utilisé en production pour ce projet.**
> Pipeline PixelLab/Godot archivé : voir `archive/pixellab-godot-assets.md`
> Assets générés toujours sur disque : `public/assets/peste-pixel/pixellab/`

---

## Statut Pipeline PixelLab (Peste 1347)

**ABANDONNÉ** — Raison : pivot SVG enluminure/gravure (2026-02-21)
- 8 characters générés (4 top-down + 4 side-view) — sur disque, non utilisés en production
- Tilesets cobblestone + buildings — sur disque, non utilisés
- Map objects (barrel, cart, etc.) — auto-delete 8h, probablement disparus

**Si PixelLab redevient nécessaire** (nouveau projet, ou retour pixel art) :
- Consulter `archive/pixellab-godot-assets.md` pour tous les paramètres API
- Consulter `memory/pixellab-api-v2.md` pour les endpoints v2

---

## Recurring Errors API PixelLab (valables si retour PixelLab)
| Error | Count | Resolution |
|-------|-------|------------|
| base64 prefix causing 422 | 2 | Raw base64 only, no data:image prefix |
| Low coherence at default guidance | 1 | image_guidance_scale=8.0 not 1.4 |
| Silent generation failure map-objects | 3 | /v2/map-objects stays "pending". Use create-image-pixflux (synchrone) |
| map-objects API permanently pending | 3 | Confirmed: use /v2/create-image-pixflux with no_background=true |

## Quality Notes (PixelLab — si retour)
- MCP characters are non-deterministic: never regenerate a working asset
- Concept art pipeline (Gemini -> PixelLab) produces better results for complex designs
- Map objects auto-delete in 8 hours: download immediately after generation

## Capabilities NOT Available in PixelLab (verified 2026-02-17)
- "Scenes & Environments" : NOT in MCP, NOT in API v2. Web UI only.
- Max image size via API: 400x400 (pixflux), 256x256 (generate-image-v2). NO 1920x1080.
- No panoramic background endpoint exists.
