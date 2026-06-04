# DÉCODAGE TECHNIQUE — Empire du Ghana (Atlas, 105s vertical 1080×1920)

> Décodé 2026-06-03 (agent général-purpose, lecture code intégral + 21 frames render final).
> Source du playbook Atlas avec [[DECODE-mansa-moussa]]. Voir [[feedback_atlas-retour-aux-sources-ghana-mansa]].

Fichiers source : `src/_archive/episodes-livres/atlas/empire-ghana/`. Données géo précomputées d3-geo : `data/geo/empire-ghana-data.json` (projection `geoMercator().center([-3,18]).scale(1400).translate([360,640])`, viewBox SVG `720×1280`). Composants partagés : `src/projects/atlas/_shared/atlas-components.tsx` (`ATLAS_COLORS`, `AtlasGlobe`, `AtlasGlobeHook`, `AtlasSubtleStars`).

## A. OVERLAYS & ENCADRÉS — la signature Ghana

Trois familles d'overlays, toutes en **parchemin (`PARCHEMIN #E8DCC0`) + double cadre (or extérieur 3-4px + bordeaux intérieur 1-1.5px, `rx` arrondi)**. Grammaire unifiante de tout l'épisode.

**1. Cartouche-bandeau "TOUJOURS EN HAUT"** (`Beat1Setup.tsx:547-608`)
- Règle absolue : `y=170` (titre) / `y=320` (sous-titre) — bas de l'écran réservé aux sous-titres karaoké, jamais un overlay.
- Entrée : `spring({damping:14, stiffness:200})` → `scale 0.7→1` (ou `0.85→1`) + **wobble permanent** `rotate(Math.sin(localFrame*0.08)*0.4°)` (vie "papier").
- Sortie : fadeOut sur 12-15 dernières frames ; opacité = `Math.min(springIn, fadeOut)`.
- Contenu : titre Cinzel 42-46px bordeaux + sous-titre italique Cormorant or-terni.
- Variante timeline (`GhanaCartoucheTimeline:575`) : tiret = ligne pointillée qui se trace + losange à l'arrivée + 2e siècle pop (spring +31f).

**2. SPOTLIGHT INSERT — l'encadré sel/or (LE pattern central)** (`Beat1Setup.tsx:409-528`, dupliqué `Beat2Density.tsx:654-710`)
3e mode entre overlay et plein écran : centré, assombrit la carte sans la masquer.
- **Apparition** : `rect` plein écran `NOIR_PROFOND` `dimOpacity 0→0.55` + boîte parchemin centrée `translate(360 640)` pop `scale(0.85 + 0.15*spring)` (`damping:16, stiffness:100`).
- **Glow** : `<circle r=280 fill="url(#spotlightGlow)"` radialGradient or `OR_VIF→transparent` derrière la boîte.
- **Contenu sel/or** : sac-sel PixelLab gauche + `SEL`, symbole `⇌` (U+21CC) or 56px centre, sac-or droite + `OR`, sous-titre italique. Boîte `520×300`.
- **Contenu chiffre-choc** : sprite PixelLab haut, **chiffre Cinzel 64-80px bordeaux** (`20 000`, `90 KG`), label or espacé, source italique. Boîte `520×330`.
- **Timing** : double trapèze opacité `[in, in+8, out-12, out]→[0,1,1,0]` (≈85f présence), sync mot exact.

**3. Freeze-frame plein écran "1076"** (`Beat4Consequence.tsx:948-1038`) : DOM, dim `0.85` + date **280px weight 900 or-vif**, textShadow rouge+or, surtitre `ALMORAVIDES`, scale spring overshoot (`damping:12`).

## B. MOUVEMENTS CAMÉRA / CARTE

Tout frame-driven, un seul `<g transform>` SVG. Pattern universel (pivot sur point focal) :
```
translate(360+drift, 640+drift) scale(zoom, zoom*scaleY) skewX(skew) translate(-camFocusX, -camFocusY)
```
- **Drift Ken Burns permanent** : `driftX=sin(f*0.014)*10`, `driftY=cos(f*0.011)*7`. Parallaxe fg `*1.3` sur sprites/empire.
- **Tilt axonométrique** : `skewX = tiltDeg*0.15` + `scaleY = 1 - tiltDeg*0.008`, tiltDeg≈18° respire (`+sin(f*0.04)*2`). **Annulé en gros plan** (`camZoom>1.9 → tilt 4-6°`).
- **Globe→carte seamless** (`Beat1Setup.tsx:126-154`) : globe ortho zoome `1.96→11` pivotant autour de Koumbi Saleh + crossfade globe/plate sur 10f à `ZOOM_END=60`. "Le globe DEVIENT la carte".
- **Camera-track sprite** (`computeCameraState`) : `camFocusX/Y` suit le perso ; zoom dynamique par phase.
- **Whip-zoom antithèse** (`Beat5CTA.tsx:82-132`) : zoom-out `0.32` pour englober Wagadou + Florence/Venise (coords d3-geo hors canvas), retour `p²` vers `1.40`.
- **Camera shake** (`Beat4:266`) : `(random-0.5)*12*decay` sur impact, 12f. **Dutch tilt** `rotate 0→6→0` sur "Effondrement".

## C. SPRITES PIXELLAB (Ghana riche en sprites)

**Mécanisme 1 — Spritesheet clipPath** (objets/villes) : 1 PNG `448×112` (4 frames×112), 1 frame via clipPath+offset `x=-animFrame*SIZE`, cadence `Math.floor((f-start)/5)%4` (~6fps), `pixelated`. Ex : `koumbi-saleh-sheet.png`, `chameau-walk-sheet.png` (file indienne, délai 50f).

**Mécanisme 2 — Frames PNG individuelles DOM** (personnages, le + sophistiqué) : `getSpriteFramePath(frame, {basePath, direction, totalFrames, framesPerSpriteFrame})` → `<basePath>/<direction>/frame_000.png`. 4 directions. Sprites = `<Img>` DOM absolus, `svgToCompWithCam()` reprojette SVG→compo (`*CSS_SCALE=1.5`) avec la caméra → colle à la carte. `bobbing=sin(f*0.5)*3`, `drop-shadow`, taille `*camZoom`.
- **Beat3 silent barter** : berbère (walk→crouch→walk, drop sac au crouch), sahélien symétrique, balance PixelLab s'équilibre.
- **Beat4 invasion** : almoravide descend (camera-track) ; formation Mande (Sundiata leader doré zIndex10 + lancier/épéiste en V, retards 10/22f) monte du sud.

## D. STRUCTURE & RYTHME (7 segments, forced-alignment loss 0.094)

| Beat | Frames | Durée | Rôle |
|---|---|---|---|
| Hook globe | 0–211 | ~7s | "sel contre or au gramme près" |
| 1 Setup | 211–676 | ~15.5s | Wagadou (globe→carte) |
| 2 Density | 676–1462 | ~26s | 3 POI + 2 spotlights chiffres + caravane |
| 3 Barter | 1462–2152 | ~23s | silent barter (climax émotionnel) |
| 4 Consequence | 2152–2788 | ~21s | Almoravides + effondrement + Mali |
| 5 CTA | 2788–3145 | ~12s | antithèse Florence/Venise |
| 6 CTA newsletter | 3175–3595 | 14s | plein écran |

Transitions : **pas de coupe franche** — `globalFadeIn [0,15]` / `globalFadeOut [T-12,T]`, caméra N+1 reprend valeur fin N. Audio narration unique découpé `startFrom/trimAfter`, musique 0.07 continue. Freeze 30f (`CTA_HOLD_FRAMES`) respiration. **7 SFX en `<Sequence from=…>` jamais `frame===X`**.

## E. PALETTE & TYPO

Carte (ATLAS_COLORS) : océan `#3A5A7E`, terre `#C97D5A`, empire cream `#F5EBD8`, outline noir `#1A1A1A`.
Narratif (GHANA_PALETTE) : fond `#1A0D0D`+`#2D1810`. Or `#D4A574`/`#E8B878`. Bordeaux `#4A0E0E→#A33232`. Parchemin `#E8DCC0`.
Typo : titres/chiffres **Cinzel**, narration **Cormorant Garamond** italique, dates mono.
Carte vivante : empire = fill PARCHEMIN 0.18 + `pattern wagadouHatch` (hachures or+bordeaux 45°) + outline pointillé `"10 5"`. Mali = hachure inversée -45° or/vert. Routes = bezier pointillé qui s'illuminent.
Atmosphère : `AtlasSubtleStars 0.4` + vignette respirante (`0.65+0.15*sin(f*0.025)`).

## TOP 5 PATTERNS GHANA À FORMALISER

1. **Spotlight Insert parchemin** (sel/or & chiffre-choc) — dim carte 0→0.55 + boîte double-cadre or/bordeaux + glow radial + chiffre Cinzel géant ou sprites `⇌`, double-trapèze opacité callé au mot. `Beat1Setup.tsx:409-528`.
2. **Caméra unique frame-driven + reprojection sprites** : `computeCameraState(frame)` + `svgToCompWithCam()` colle les `<Img>` PixelLab DOM sur carte SVG mouvante. `Beat3/Beat4`.
3. **Empire "carte vivante" hachuré** : fill + pattern hachures + outline pointillé, états (glow vivant / gris effondrement / inversion -45° Mali). Jamais polygone plat.
4. **Layout "cartouches en haut (y≤320), bas = sous-titres"** + cartouche double-cadre spring-pop + wobble papier + fadeOut.
5. **Continuité d'état inter-beats + globe→carte seamless** : aucun cut dur, zoom/focus N+1 reprend fin N, globe-ortho→carte-plate par pivot-scale sur POI commun.

Note : **tout calé sur forced-alignment** (`timing.ts` + `findWord()`). Aucun timing visuel hardcodé indépendamment de la voix.
