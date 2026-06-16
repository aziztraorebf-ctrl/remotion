# ATLAS-COMPOSANTS — Catalogue composants réutilisables

> **RÈGLE NON-NÉGOCIABLE** : Lire ce fichier AVANT d'écrire la première ligne de code de toute scène Atlas. Si un composant ou helper proche existe → adapter. Jamais reconstruire. Si rien n'existe → construire ET documenter ici avant de passer à la suite.
>
> Source de vérité : ce fichier.
> Mis à jour : 2026-05-17 (+5 blueprints avancés sprites/caméra)

---

## BLUEPRINTS AVANCÉS — Sprites + Caméra (LIRE EN PREMIER pour toute scène avec personnages)

> Extraits des épisodes de production validés (Ghana Beat3Barter + Beat4Consequence).
> Ces composants remplacent tout code camera-track/walk écrit from scratch.
> Dossier : `src/projects/atlas/_blueprints/`

| Situation | Blueprint à utiliser | Fichier |
|-----------|---------------------|---------|
| 1 perso marche de A→B, caméra suit | `CameraTrackEntity` | `_blueprints/camera-track-entity/` |
| 2 persos agissent séquentiellement (échange, rencontre) | `DualEntitySequential` | `_blueprints/dual-entity-sequential/` |
| Armée / cortège / caravane (N persos en formation) | `FormationMarch` | `_blueprints/formation-march/` |
| Voyage multi-villes (A→B→C→D) | `WaypointMarch` | `_blueprints/waypoint-march/` |
| Effondrement / chute d'empire (dutch tilt + shake) | `DutchTiltCollapse` | `_blueprints/dutch-tilt-collapse/` |
| 2 persos convergent simultanément vers un point | `Alliance` | `_blueprints/alliance/` |
| 2 persos s'affrontent bord-à-bord | `Confrontation` | `_blueprints/confrontation/` |

**Helpers centraux extraits des blueprints avancés (copier dans le beat si besoin de personnalisation) :**

```typescript
// svgToCompWithCam — convertit coordonnées SVG (720×1280) → CSS composition (1080×1920)
// Synchronise PARFAITEMENT la carte SVG et les sprites CSS.
// Source : Beat3Barter (validé Ghana). Utiliser telle quelle, ne pas réinventer.
function svgToCompWithCam(svgX, svgY, cam) {
  const screenSvgX = (svgX - cam.camFocusX) * cam.camZoom + 360 + cam.driftX;
  const screenSvgY = (svgY - cam.camFocusY) * cam.camZoom * cam.scaleY + 640 + cam.driftY;
  return { x: screenSvgX * 1.5, y: screenSvgY * 1.5 };
}

// memberPosition — position d'un membre de formation avec retard temporel + offset spatial
// Source : Beat4Consequence.mandePosition() (validé Ghana)
function memberPosition(frame, spawnX, spawnY, destX, destY, walkStart, walkEnd, spawnDX, spawnDY, arriveDX, arriveDY, frameOffset) {
  const ef = frame - frameOffset;
  const p = Math.max(0, Math.min(1, (ef - walkStart) / (walkEnd - walkStart)));
  return {
    x: (spawnX + spawnDX) + ((destX + arriveDX) - (spawnX + spawnDX)) * p,
    y: (spawnY + spawnDY) + ((destY + arriveDY) - (spawnY + spawnDY)) * p,
  };
}
```

**Règle absolue sprites** : `Math.max(0, localFrame - walkStart)` AVANT tout calcul frameIdx — sinon index négatif = frame_-1.png = icône grise silencieuse.

---

## Mapbox (nouveau — 2026-05-06)

> Composants Mapbox dans `src/projects/_shared/mapbox/` — lire `MAPBOX-COMPOSANTS.md` avant toute composition avec carte interactive.
> Utilitaires : `MapboxBase.tsx` (styles, lerpCam, removeLabels, addCountryHighlight, ISO codes, COUNTRY_CENTERS).
> **Rappel** : Mapbox = WebGL uniquement, pas de render headless CLI.

---

## Fichiers sources

| Fichier | Contenu | Usage |
|---------|---------|-------|
| `atlas-components.tsx` | Tous les composants visuels partagés + palette ATLAS_COLORS + NATIONAL_COLORS | Import principal pour tout épisode Atlas |
| `atlas-shared-defs.tsx` | SVG `<defs>` centralisés (gradients, filtres, patterns) | Inclure une fois par composition |
| `atlas-flags.tsx` | 18 drapeaux africains (SVG patterns + mini-flags) | Épisodes avec focus pays modernes |
| `atlas-v2-data.json` | Paths SVG precompilés Mansa Moussa (Afrique de l'Ouest + empire 1300) | Mansa Moussa |
| `shaka-zulu-data.json` | Paths SVG precompilés Shaka Zulu (3 projections KwaZulu-Natal) | Shaka Zulu |
| `atlas-globe-data.json` | Paths SVG globe orthographique (Afrique centré) | Hook épisodes Atlas |
| `ChapterNumber.tsx` | Numéro de chapitre animé (fade + slide) | Transitions entre segments |

---

## Composants dans atlas-components.tsx

### AtlasMercator
- **Usage** : carte plate principale — Afrique + projection Mercator
- **Props clés** : `data` (paths JSON), `countryColors` (Record<iso, color>), `scale`, `driftX`, `driftY`, `tilt` (deg), `oceanColor`, `landColor`
- **Camera moves** : passer `scale`/`driftX`/`driftY` via `interpolate()` continu — jamais par blocs
- **Épisodes** : S1/S3/S4 Mansa Moussa · S1/S3/S4 Shaka Zulu
- **Données** : `atlas-v2-data.json` (Mansa Moussa) · `shaka-zulu-data.json` (Shaka Zulu)

### AtlasGlobe
- **Usage** : globe orthographique bas niveau (SVG `<g>`) — à intégrer dans un SVG parent
- **Props clés** : `countries`, `highlightFills`, `rotation`, `scale`, `centerX`, `centerY`, `showHalo`, `haloRadius`
- **Données** : `atlas-v2-data.json` (ortho) ou tout JSON avec `{ iso, d }[]`

### AtlasGlobeHook ← NOUVEAU (2026-05-03)
- **Usage** : composant clé en main pour hooks épisodiques — globe espace + étoiles + texte cascade 3 lignes
- **Props clés** : `globeCountries`, `globeRadius`, `highlightFills`, `rotateStart/End`, `svgScale`, `globeOffsetY`, `line1/2/3Text`, `line1/2/3In`, `line1/2/3Color`, `fontSize`, `durationFrames`
- **Épisodes** : Hook Empire Ghana v8 (validé Aziz 2026-05-03)
- **Pour réutiliser** : passer les props dans `Beat0Hook.tsx` de l'épisode, ne pas modifier ce composant
- **Étoiles** : 160 points, LCG déterministe seed=42, scintillement sin(), fond #242B52
- **Audio** : géré dans le composant scène (Beat0Hook), pas dans AtlasGlobeHook

### AtlasLabel
- **Usage** : label pill Cormorant Garamond avec fade-in spring
- **Props clés** : `text`, `x`, `y`, `delay` (frames), `color`
- **Style** : fond semi-transparent, coin arrondi, max 20 caractères
- **Épisodes** : tous (villes, lieux-clés)

### AtlasCartouche
- **Usage** : chiffre choc avec wobble — insert impact
- **Props clés** : `value` (string), `label`, `source`, `triggerFrame`, `durationFrames`
- **Animation** : scale spring bounce + wobble rotatif
- **Épisodes** : tous les inserts chiffres

### AtlasPulseMarker
- **Usage** : cercle pulsant sur un lieu clé de la carte
- **Props clés** : `x`, `y`, `color`, `size`, `startFrame`
- **Épisodes** : tous (capitales, lieux narratifs)

### AtlasCaravane — CHIBI sur path (vue large)
- **Usage** : petit sprite chibi qui suit un path Bezier avec hopping vertical. Pour vue LARGE (perso petit, on voit le trajet). PAS pour gros plan acteur (→ AtlasPixelChar).
- **Props clés** : `chibiSrc`, `pathD`, `waypoints`, `startFrame`/`endFrame`, `hopAmplitude`, `walkFrames` (optionnel), `tOffset` (retard pour cortège)
- **RÈGLE (locale au chibi)** : pour un chibi animé en walk multi-frames, attention au bbox → soit `walkFrames` maîtrisé, soit 1 frame + `Math.abs(Math.sin(frame*speed))*amplitude` (hop). CETTE RÈGLE NE S'APPLIQUE PAS à `AtlasPixelChar` (voir ci-dessous).
- **Épisodes** : S3 Mansa Moussa (caravane Mali→La Mecque) · S3 Shaka Zulu (impi expansion)

### AtlasPixelChar — SPRITE-ACTEUR plein cadre (gros plan) ⭐
- **Code** : `src/projects/atlas/_reference/mansa-moussa-v2/scenes/AtlasPixelChar.tsx`. Doctrine complète : `memory/doctrines/ATLAS-PIXELLAB-PLAYBOOK.md`.
- **Usage** : l'ACTEUR du récit incarné sur la carte (Mansa marche, l'armée avance). Walk cycle multi-frames qui MARCHE en production (≠ la règle bbox du chibi ci-dessus, qui ne le concerne pas).
- **Mécaniques** : cadence 8fps DÉCOUPLÉE du 30fps vidéo (`Math.floor((frame-appearAt)/fps*8)%frameCount`), ancrage-PIED (`y-size`), entrée fade spring, `imageRendering:pixelated`, flip-ouest `scale(-1,1)`.
- **Convention dossier** : `public/<episode>/characters/<perso>/animations/<anim>/<dir>/frame_NNN.png`.
- **Recettes** : cortège (offset de path), switch anim contextuel (walk→pose), caméra qui track. Voir ATLAS-PIXELLAB-PLAYBOOK §3.
- **Sprites restaurés** : `public/atlas-mansa-moussa/characters/` (mansa-moussa, porteur, soldat, chameau). Autres épisodes : Ghana (6), Hannibal (4), Shaka (3), Peste (6) — voir audit `memory/atlas-decode/audit/`.

### AtlasEmpire
- **Usage** : overlay territoire empire avec hachures ou fill semi-transparent
- **Props clés** : `paths` (SVG paths empire), `fillColor`, `strokeColor`, `opacity`, `animateIn` (bool)
- **Épisodes** : S1 Mansa Moussa (empire 1300) · S1 Shaka Zulu (territoire Zulu 1816-1828)

### AtlasDefs
- **Usage** : `<defs>` SVG inline (gradients utilisés dans les scènes)
- **Toujours inclure** en premier dans le SVG de chaque scène

### useSpringCamera
- **Usage** : hook React — camera pan/zoom spring sur plusieurs waypoints
- **Props** : `waypoints[]`, `fps`, `frame`, `config` (spring)
- **Retour** : `{ scale, driftX, driftY, tilt }`
- **Épisodes** : S3 Mansa Moussa (pan Mali→Mecque) · S3 Shaka Zulu (expansion nord)

### ATLAS_COLORS
- **Palette base tous épisodes** :
  - `ocean` : `#3A5A7E`
  - `land` : `#C97D5A` (terracotta)
  - `empireGold` : `#D4A574`
  - `cream` : `#F5EBD8` (pays focus)
  - `textGold` : `#E8C97D`

---

## Inserts réutilisables (src/projects/atlas/mansa-moussa/ → adapter pour chaque épisode)

| Composant | Usage | Données à adapter |
|-----------|-------|-------------------|
| `AtlasInsertPieChart` | Camembert proportions | labels + values |
| `AtlasInsertBarChart` | Barres comparatives (ex: 1500 → 50 000 guerriers) | data array |
| `AtlasInsertLineChart` | Courbe temporelle | points [{year, value}] |

---

## Composants Shaka Zulu uniquement (src/projects/atlas/shaka-zulu/components/)

| Composant | Usage | Statut |
|-----------|-------|--------|
| `MourningWarp.tsx` | Cercles concentriques deuil — S4 Nandi | VERROUILLÉ |
| `AtlasShakaPalette.tsx` | Palette bordeaux/parchemin/or Shaka | VERROUILLÉ |
| `CornesFrame.tsx` | Formation cornes de buffle — S2 A3 | Actif |
| `PaperGrain.tsx` | Texture grain parchemin overlay | Actif |
| `SourceCartouche.tsx` | Citation source historique | Actif |

---

## Composants RPG/HUD (cross-épisodes — validés Lab Hannibal Phase 1.5, 2026-05-04)

| Composant | Usage | Statut |
|-----------|-------|--------|
| `FocusBubble.tsx` | Zoom + blur sur background, foreground (sprite) reste net. Moments dramatiques | Actif |
| `StatGauge.tsx` | HUD jauge (icône + label + valeur animée + delta). Prop `hideRanges` pour disparaître pendant focus | Actif |

### Usage `FocusBubble`

```tsx
import { FocusBubble } from "../../_shared/FocusBubble";

<FocusBubble
  active={frame >= 150 && frame < 210}
  startFrame={150}
  endFrame={210}
  zoomTarget={1.45}            // 1.4-1.5 dramatique. 1.15-1.25 subtil
  blurMax={3.5}                // Garder ~3.5px (validé Aziz Phase 1.5)
  origin={{ x: 540, y: 800 }}  // Centre du zoom (suit le sprite)
  background={<MapBackground />}
>
  <SpriteLayer />              {/* Reste NET pendant le zoom */}
</FocusBubble>
```

**Règle Atlas** : à utiliser uniquement pour moments dramatiques (action clé, climax, révélation perso). Pas systématique.

### Usage `StatGauge`

```tsx
import { StatGauge } from "../../_shared/StatGauge";

<StatGauge
  label="Armée"
  icon="⚔"
  fromValue={50000}
  toValue={26000}
  startFrame={20}
  durationFrames={180}
  position={{ top: 100, right: 50 }}
  color="#E6C76E"
  hideRanges={[[148, 215]]}    // Masque pendant le focus dramatique
/>
```

**Règle Atlas** : jauges permanentes dans la vidéo MAIS disparaissent (`hideRanges`) pendant moments dramatiques pour épurer l'écran. SFX d'apparition uniquement, pas continus (validé Aziz).

---

## Utilitaires Caméra 2 couches (validés Beat1 Hannibal + Beat3 Ghana, 2026-05-05)

> Architecture standard Atlas pour zoom POI > 1.5x sans sortie de cadre.
> Règle : TOUJOURS utiliser cette architecture dès que camZoom > 1.5x.

### `svgToComp(svgX, svgY, cam)` — OBLIGATOIRE pour assets CSS sur carte zoomée

Convertit coordonnées espace SVG (720×1280) → pixels CSS composition (1080×1920) en tenant compte du zoom caméra.

```tsx
import { svgToComp } from "../../_shared/atlas-components";

const pos = svgToComp(POI_SVG_X, POI_SVG_Y, cam);
<div style={{ position: "absolute", left: pos.x - 48*cam.camZoom, top: pos.y - 96*cam.camZoom }}>
  <Img width={96*cam.camZoom} style={{ imageRendering: "pixelated" }} />
</div>
```

**Zoom standards validés** :
- `1.0` = vue large narrative
- `2.8` = zoom standard POI (ville, personnage en marche) — référence `s3-caravane-4chars-v2.mp4`
- `3.2` = insert détail (gros plan objet, crouch sprite)
- Au-delà de `1.5x` avec architecture 1 couche → sortie de cadre garantie

### `focusOffsetForPOI(poiSvgX, camZoom, screenMargin?)` — POI proche du bord

Quand un POI est proche du bord du canvas (ex: Rome x=517 sur 720px), centrer exactement dessus à 2.8x le fait sortir du cadre. Ce helper calcule le décalage automatiquement.

```tsx
import { focusOffsetForPOI } from "../../_shared/atlas-components";

// Rome est à x=517 (bord droit). Sans offset : 1199px CSS → hors cadre.
const ROME_FOCUS_X = focusOffsetForPOI(ROME_SVG_X, 2.8); // → 417
// (517-417)*2.8 + 360 = 640 SVG = 960 CSS → Rome visible tiers droit ✓
```

**Règle** : les assets CSS (sprite, label) restent ancrés sur la vraie coordonnée SVG via `svgToComp()` — seul le focus caméra est décalé.

### Constantes exportées

```tsx
import { ATLAS_SVG_W, ATLAS_SVG_H, ATLAS_CSS_SCALE, ATLAS_CX, ATLAS_CY } from "../../_shared/atlas-components";
// SVG_W=720, SVG_H=1280, CSS_SCALE=1.5, CX=360, CY=640
```

---

## Utilitaires Animation Sprite (validés Beat3 Ghana, 2026-05-05)

### `getSpriteAnimFrame(frame, startFrame, frameHoldDur, totalFrames)`

Calcule le frame courant d'un walk cycle en spritesheet horizontale.

```tsx
import { getSpriteAnimFrame } from "../../_shared/atlas-components";

const animFrame = getSpriteAnimFrame(frame, spriteStartAt, 5, 4); // 4 frames, 6fps
```

### `getSpriteClipPath(animFrame, totalFrames)`

Génère le `clipPath` CSS pour afficher un frame de spritesheet.

```tsx
import { getSpriteClipPath } from "../../_shared/atlas-components";

<Img
  src={staticFile("characters/walk-sheet.png")}
  style={{
    width: 96 * totalFrames,  // largeur totale spritesheet
    clipPath: getSpriteClipPath(animFrame, totalFrames),
  }}
/>
```

**Règle** : pour sprites STATIQUES sans spritesheet → utiliser hopping sin() (déjà dans AtlasCaravane) :
```tsx
y += Math.abs(Math.sin(frame * 0.3)) * 4
```

---

## Pipeline PixelLab — Capacités MCP complètes (validé 2026-05-16)

> Source de vérité complète : `memory/tools/PIXELLAB-MASTER-INDEX.md`

### States — capacité clé ⭐

`create_character_state` / `create_object_state` — partir d'un asset canonique et dériver des variantes sans régénérer. Cohérence visuelle garantie, zéro drift de style.

```
# Personnage debout → state assis, blessé, vêtements différents, tenant objet
create_character_state(character_id="<ID>", edit_description="sitting on throne, regal pose")

# Objet intact → state endommagé, de nuit, version alternative
create_object_state(object_id="<ID>", edit_description="ship with sails torn, storm damaged")
```

**Règle** : toujours vérifier si un state suffit AVANT de créer un nouvel asset from scratch.

### Animations objets — `animate_object`

Pour map objects (bateaux, bâtiments, objets), animation libre par description :
```
animate_object(object_id="<ID>", animation_description="rocking on waves, moving left", frame_count=8)
```

### Référence image — style matching

`create_map_object` avec `background_image` → nouvel objet qui adopte le style visuel d'une image existante. Parfait pour créer des assets cohérents avec une carte déjà générée.

---

## Règle d'import pour Shaka Zulu

```tsx
// Composants partagés Atlas
import { AtlasMercator, AtlasLabel, AtlasPulseMarker, AtlasCaravane, AtlasCartouche } from "../../_shared/atlas-components";
// Données
import shakaData from "../../_shared/shaka-zulu-data.json";
// Palette Shaka
import { SHAKA_PALETTE } from "../components/AtlasShakaPalette";
```
