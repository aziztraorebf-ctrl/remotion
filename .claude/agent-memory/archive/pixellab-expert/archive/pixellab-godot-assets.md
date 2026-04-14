# PixelLab Expert — Archive Assets & Pipeline Godot (2026-02-16 à 2026-02-21)

> ARCHIVÉ 2026-02-22. Pipeline PixelLab/Godot abandonné (pivot SVG enluminure).
> Ces assets EXISTENT encore sur disque mais NE SONT PLUS utilisés en production.
> Conserver pour référence si retour éventuel au pixel art.

---

## Generation Log
| Date | Asset Type | Description | ID | Status | Quality |
|------|-----------|-------------|-----|--------|---------|
| 2026-02-16 | character | Peasant Man 64x64 4-dir top-down | db8dce29 | OK | 8/10 |
| 2026-02-16 | character | Peasant Woman 64x64 4-dir top-down | 99eb124f | PARTIAL | No walk anims |
| 2026-02-16 | character | Merchant 64x64 4-dir top-down | 190effe1 | OK | 7/10 |
| 2026-02-16 | character | Monk 64x64 4-dir top-down | c2923dcd | PARTIAL | No west walk |
| 2026-02-16 | character | Child 48x48 4-dir top-down | da1c3676 | OK | Folder="walk" not "walking" |
| 2026-02-16 | character | Noble v2 64x64 4-dir top-down | 5e466104 | PARTIAL | South walk only |
| 2026-02-16 | character | Blacksmith v2 64x64 4-dir top-down | d5fa97e8 | OK | 8/10 |
| 2026-02-16 | character | Plague Doctor 64x64 8-dir top-down | local | OK | Concept art pipeline, 4 frames |
| 2026-02-16 | tileset | Cobblestone topdown | - | OK | Downloaded to tilesets/ |
| 2026-02-16 | map-object | Barrel | - | OK | Downloaded |
| 2026-02-16 | map-object | Cart | - | OK | Downloaded |
| 2026-02-16 | map-object | Fountain | - | OK | Downloaded |
| 2026-02-16 | map-object | Market Stall | - | OK | Downloaded |
| 2026-02-16 | map-object | Well | - | OK | Downloaded |
| 2026-02-18 | character | peasant-man-side 64x64 4-dir side | c328bd8c-8943-4ab6-bdec-5a15540b18bf | OK | Rotations only, no anim yet |
| 2026-02-18 | character | peasant-woman-side 64x64 4-dir side | 35eaaa94-a184-4177-bb90-11dea9accbfb | OK | Rotations only, no anim yet |
| 2026-02-18 | character | monk-side 64x64 4-dir side | f37dc8e9-ef0f-473b-a50f-587a3c80d3da | OK | Rotations only, no anim yet |
| 2026-02-18 | character | merchant-side 64x64 4-dir side | 8fbe44da-b55a-4dc4-8c4a-a18d0f3f59f5 | OK | Rotations only, no anim yet |

## Style Parameters PixelLab (ARCHIVÉ)
- Character size: 64x64 (child: size=64, CSS scale=0.75 in Remotion)
- View TOP-DOWN: "low top-down"
- View SIDE-VIEW: "side"
- Outline: single color black outline
- Shading: basic shading
- Detail: medium detail
- Tileset tile_size: 16x16 native x4

## Godot 4 Integration Notes (ARCHIVÉ 2026-02-18)
- sidescroller tileset = spritesheet grille de tiles, PAS une image 1920px. Répéter via TileMapLayer ou Sprite2D repeat=Enabled.
- Texture filter OBLIGATOIRE: ProjectSettings > Rendering > Textures > Default Texture Filter = Nearest
- create_sidescroller_tileset : PAS de auto-delete 8h (contrairement à create_map_object)
- Ordre de génération : 1 variation à la fois, vérifier, valider

## Godot Binary — Problème macOS (ARCHIVÉ 2026-02-19)
- Le dossier Downloads/Godot.app/Contents/MacOS/ se VIDE entre sessions macOS
- TOUJOURS vérifier avant render : `ls "/Users/clawdbot/Downloads/Godot.app/Contents/MacOS/"`
- Restauration rapide depuis ZIP : Godot_v4.6.1-stable_macos.universal.zip (154 MB)

## Import Textures Godot (ARCHIVÉ 2026-02-19)
- Tout nouveau PNG DOIT avoir un fichier `.import` sidecar AVANT le render
- Sans `.import` = NPC invisibles en headless, aucun message d'erreur (piège silencieux)

## Pipeline B — Godot Visual Feedback (ARCHIVÉ 2026-02-18)
- Commande type : `Godot --write-movie /output/dir/frame.png --fixed-fps 30 --quit-after N scenes/ma_scene.tscn`
- Output : frame00000000.png (zero-padded 8 chiffres)
- FFmpeg convert : `ffmpeg -framerate 30 -i "output/dir/frame%08d.png" -c:v libx264 out.mp4`

## Aseprite Pipeline (ARCHIVÉ 2026-02-19)
- CLI FONCTIONNE : "/Volumes/Aseprite-v1.3.16.1 Installer/Aseprite.app/Contents/MacOS/aseprite"
- /Applications/Aseprite.app est la version Steam = pas de CLI
- Chemin CLI PERMANENT : /Applications/Aseprite-DMG.app/Contents/MacOS/aseprite

## Ancrage Bâtiments Godot (ARCHIVÉ 2026-02-18)
- Formule : position.y = GROUND_Y - lowest_opaque_pixel * scale
  - house-timbered : 943 - 121*4 = 459
  - church : 943 - 119*4 = 467
  - inn : 943 - 105*4 = 523

## Tileset Sidescroller — Paramètres API (ARCHIVÉ 2026-02-21)
- tile_strength max API = 2.0 (PAS 8-10 comme dans les tutoriels UI web)
- tileset_adherence_freedom = 200 (pas ai_border_freedom)
- outline = "single color outline" (pas "single_color")
- shading = "medium shading" (pas "medium")
- tile_size = {"width": 32, "height": 32} (objet JSON, pas entier)

## Bâtiments Side-View — create-image-pixflux (ARCHIVÉ 2026-02-21)
- Endpoint FONCTIONNEL : POST /v2/create-image-pixflux (SYNCHRONE, ~20s)
- Endpoint DÉFAILLANT : POST /v2/map-objects (async, reste "pending" 15+ min)
- detail: "highly detailed" (PAS "high detail" — 422 sinon)
- no_background: true + background_removal_task: "remove_complex_background"
- Assets sauvegardés : public/assets/peste-pixel/pixellab/buildings-test/
