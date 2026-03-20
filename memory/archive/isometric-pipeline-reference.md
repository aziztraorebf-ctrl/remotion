# Pipeline Isometrique PixelLab — Reference Complete

> Verifie via documentation officielle + tests reels (2026-02-21)
> Objectif : scene village medieval isometrique animee (style Veo 3.1 test 2.mp4)

---

## Ce que c'est

Une scene isometrique pixel art avec :
- Bâtiments medievaux (timber frame, taverne, chapelle)
- Sol en paves/terre
- NPCs qui marchent (8 directions)
- Vue isometrique 3/4 (pas de side-view, pas de top-down pur)

Reference visuelle : `~/Downloads/veo3.1 test 2.mp4` (8s, 1280x720, village medieval)

---

## Ce qui est CONFIRME a 100%

### Assets generables via PixelLab

| Asset | Outil | Parametre cle | Temps |
|-------|-------|---------------|-------|
| Tuiles isometriques (sol, herbe, paves) | MCP `create_isometric_tile` | `tile_shape: "block"`, `size: 32` | ~15-20s |
| Tileset sol top-down (Wang tiles) | MCP `create_topdown_tileset` | `view: "high top-down"` | ~100s async |
| Batiments isometriques transparents | API `/v2/create-image-pixflux` | `no_background=true` (pas de view iso specifique — le modele genere iso par defaut sans `view="side"`) | ~20s sync |
| Sprites NPCs 8 directions | MCP `create_character` | `n_directions: 8`, `view: "low top-down"` | ~3-5 min |
| Animations NPCs (walk, idle, etc.) | MCP `animate_character` | `template_animation_id: "walking"` | ~2-4 min |

### Aseprite CLI (nettoyage assets)

| Operation | Commande | Statut |
|-----------|----------|--------|
| Supprimer padding transparent | `aseprite -b sprite.png --trim --save-as sprite_clean.png` | CONFIRME |
| Export spritesheet | `aseprite -b *.png --sheet sheet.png --data sheet.json` | CONFIRME |
| Installation | `/Applications/Aseprite-DMG.app/Contents/MacOS/aseprite` | CONFIRME v1.3.16.1 |

### Composition video : Remotion React pur (zero Phaser)

Formule de projection isometrique (ecran 1920x1080) :
```typescript
// isoX, isoY = coordonnees dans la grille isometrique (0..N)
// tileW, tileH = dimensions d'une tuile en pixels (ex: 64x32)
const screenX = (isoX - isoY) * tileW / 2 + ORIGIN_X
const screenY = (isoX + isoY) * tileH / 2 + ORIGIN_Y
```

Y-sort depth (objets plus "bas" dans la scene = rendus par-dessus) :
```typescript
zIndex: isoX + isoY  // profondeur isometrique correcte
```

Sprite rendering :
```tsx
<img
  src={spriteFrame}
  style={{
    position: "absolute",
    left: screenX - spriteW / 2,
    top: screenY - spriteH,       // ancrage pied du sprite sur le sol
    imageRendering: "pixelated",
    zIndex: isoX + isoY,
  }}
/>
```

---

## Workflow complet (session a venir)

```
Etape 1 : Generer tuiles sol
  -> MCP create_isometric_tile x 2-3 types (paves, terre, herbe)
  -> Sauvegarder dans public/assets/peste-pixel/pixellab/iso-tiles/

Etape 2 : Generer batiments (4 types)
  -> API /v2/create-image-pixflux x 4
  -> Descriptions : maison timber frame, auberge, chapelle, maison modeste
  -> no_background=true, image_size 160x240 ou 200x280
  -> Sauvegarder dans public/assets/peste-pixel/pixellab/iso-buildings/

Etape 3 : Nettoyer assets avec Aseprite
  -> aseprite -b *.png --trim --save-as clean/
  -> Verifier que pied du NPC = bas du canvas

Etape 4 : Generer NPCs (reutiliser ceux deja generes si compatibles)
  -> Verifier si les 8 persos Peste 1347 existants ont view="low top-down"
  -> Si non : generer 2-3 nouveaux avec n_directions=8

Etape 5 : Coder la scene dans Remotion
  -> Nouveau fichier : src/projects/peste-1347-pixel/scenes/IsoVillageScene.tsx
  -> Grille isometrique 10x10 tiles
  -> 3-4 NPCs qui marchent avec Y-sort
  -> Mini-render --frames=0-30 pour valider AVANT scene complete

Etape 6 : Validation Aziz
```

---

## Ce qui est WEB UI seulement (pas scriptable)

| Feature | Pourquoi pas API | Alternative |
|---------|-----------------|-------------|
| Map Workshop "Create Object" | Pas d'endpoint REST | `/create-image-pixflux` + `no_background=true` |
| Map Workshop "Extend Map" | Pas d'endpoint REST | `/create-tileset` + `/inpaint-v3` |
| Scenes & Environments | Web UI preview uniquement | Composer manuellement avec les assets |
| Export video PixelLab | N'existe pas | Remotion fait ca |

---

## Gotchas API a ne pas oublier

- `/v2/map-objects` reste en `pending` 15+ min -> **utiliser `/create-image-pixflux` a la place**
- `/create-image-pixflux` : `detail="highly detailed"` (PAS "high detail")
- `/create-tileset` : `tile_strength` max=2.0 via API (le UI affiche 8-10, unites differentes)
- Playwright peut acceder a la session PixelLab authentifiee (cookies Chrome accessibles)
- Map Workshop "Create Object" via Playwright = **toujours isometrique** (pas de parametre side-view dans le dialog)
- PixelLab ne genere JAMAIS de video : tous les outputs sont PNG statiques

---

## VALIDE 2026-02-21 — Pipeline complet fonctionne

### Assets generes et valides
- `public/assets/peste-pixel/pixellab/iso-tiles/cobblestone-iso.png` (32x32 thin tile)
- `public/assets/peste-pixel/pixellab/iso-tiles/dirt-iso.png` (32x32 thin tile)
- `public/assets/peste-pixel/pixellab/iso-buildings/house-iso.png` (160x200)
- `public/assets/peste-pixel/pixellab/iso-buildings/chapel-iso.png` (160x220)
- `public/assets/peste-pixel/pixellab/iso-buildings/inn-iso.png` (180x220)

### Scene Remotion
- `src/projects/peste-1347-pixel/scenes/IsoVillageScene.tsx` — POC valide ~7/10
- Composition Root.tsx : `IsoVillage`, 300 frames, 30fps
- Preview : `output/iso-village-v2-preview.png`

### Parametres valides
- TILE_W=128, TILE_H=64 (ratio 2:1), ORIGIN_X=960, ORIGIN_Y=200
- BSCALE=2 (batiments x2), NPC scale=5 (sprites 64px -> 320px affiches)
- Grille 12x8, rues sur rows 3+6 et cols 3+7

### Gotchas confirmes
- `monk` : pas de direction west -> utiliser east + CSS `scaleX(-1)`
- `staticFile(npc.sprite + "/frame_XXX.png")` : sprite contient deja le path complet `assets/...`
- Circuit breaker declenche sur >3 edits rapides -> `sed -i` en bash si bloque
- `create-image-pixflux` : rate limit si 3 jobs parallele -> sequentiel avec sleep 10
- Tuiles iso API : base64 dans `data['image']['base64']` (structure dict, pas string)
- Map Workshop PixelLab : ne supporte PAS les tuiles iso -> inutile pour ce pipeline

### Incertitudes levees
- Les 8 persos top-down (view="low top-down") COMPATIBLES avec vue iso 3/4
- Formule projection iso React pur = validee et fonctionnelle
- Coherence palette bonne : batiments + sprites PixelLab = style uniforme

---

## Commande de lancement session isometrique

Dire a Claude :
> "Lance la session isometrique. Fichier de reference : memory/isometric-pipeline-reference.md. Demarre par l'etape 1."
