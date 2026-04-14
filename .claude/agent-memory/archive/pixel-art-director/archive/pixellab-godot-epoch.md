# Pixel Art Director — Archive Epoch PixelLab/Godot (2026-02-17 à 2026-02-20)

> ARCHIVÉ 2026-02-22. Style PixelLab abandonné. Conservé pour référence historique uniquement.
> Le projet Peste 1347 utilise désormais SVG enluminure/gravure pur.

---

## Constantes Godot (ARCHIVÉ)
- **GROUND_Y** = 943px (87.3% de 1080 — validé Godot, Phaser, Remotion)
- **Resolution** = 480x270 native x4 = 1920x1080
- **NPC scale standard** = x4.5 (64px canvas → 288px affichés = 40% bâtiment)
- **Ratio NPC/bâtiment valide** = 35-50% de la hauteur visible

## Perspective Assignments — Epoch PixelLab (Peste 1347)
| Scene | Perspective | Status |
|-------|-------------|--------|
| Scenes 1-5 (plague map) | Top-down | Working |
| Scene 6 (hook_06_reveal) | Side-view, camera statique | VALIDÉ Kimi 8.0/10 |
| Scene 7 (hook_07_reflexes) | Side-view, camera statique | VALIDÉ Kimi 8.0/10 |
| Scene ouverture village | Side-view, pan lent 0.9px/fr | COMPOSITION SOUND 2026-02-21 |

## Style Parameters PixelLab (Peste 1347 Standard — TOUS les assets side-view)
- Character: view="side", size=64, n_directions=4
- Outline: "single color black outline"
- Shading: "basic shading" (JAMAIS "medium shading" pour NPCs — crée écart visuel)
- Detail: "high detail" pour map objects affichés >300px large
- Tileset: create_sidescroller_tileset, tile_size 16x16
- Child: générer size=64 canvas, CSS scale=0.75 en Remotion (NE PAS demander size=48)
- Walk cycle: 6 frames @ 12 FPS (on twos), offsets [0,1,3,5,2,4] (jamais synchroniser)

## Palette Reference — Medieval Plague Tones PixelLab (Scenes 6-7 validées)
| Ramp | Hex |
|------|-----|
| Stone/gray | #2C2C2C, #4A4A4A, #6E6E6E, #9A9A9A |
| Brown/wood | #2A1A0E, #4A3728, #6B5B3A, #8B7355 |
| Warm sky | #1A0F0A, #3D2015, #6B3520 |
| Mustard/torch | #6B4A00, #B8860B, #D4A017 |
| Vegetation sick | #2A3010, #4B5A1C, #6B8E23 |
| Skin tones | #5C3A1E, #8B6040, #C4956A |
| Shadow (shared) | #1A0F14, #322125 |

## Règles d'Ancrage Godot (ARCHIVÉ)
### Phaser
- setOrigin(0.5, 1.0) + sprite.y = laneY → pieds sur laneY (pattern natif)
### Remotion
- computeAnchoredTop = laneY - displaySize * footAnchorY (formule CSS top positioning)
### blendMode SCREEN sur silhouettes sombres
- Silhouettes noires + SCREEN → disparaissent. Solution : setCrop ou PIL pour nettoyer l'alpha.

## Anti-Collision NPC Rules Godot (ARCHIVÉ)
1. 3 lanes à Y=780/810/840 (30px apart) — ou GROUND_Y±30/0/+30
2. Minimum 180px entre personnages dans même lane
3. Vitesses : lente=0.28, moyenne=0.38, rapide=0.52 px/frame natif
4. Walk cycles jamais synchronisés : offsets [0,1,3,5,2,4]
5. Croisement même lane : Z-order eastward walker on top

## Calcul Sol (fond Gemini/Imagen — ARCHIVÉ)
1. scale = viewport_width / image_width
2. rendered_h = image_h * scale
3. Y_sol_viewport = viewport_h - rendered_h * (1 - sol_pct)
4. Y_pieds_NPCs = Y_sol_viewport
5. ColorRect masque : Y = Y_sol_viewport - 34px

## Aziz Preferences — Epoch PixelLab
### Approuvé
- 64px PixelLab characters (concept art pipeline)
- Hook scenes 1-5 (CRT overlay, data visualization)
- Lane-based NPC movement (contrôlé, pas chaotique)
- Kimi score 8.0/10 = référence de qualité minimale

### Rejeté
- Sprites sur fond peint — 10+ échecs
- GothicVania dans ce projet (décision 2026-02-18 permanente)
- fond Gemini/GPT-Image-1 (digital painting) + sprites PixelLab = style clash
