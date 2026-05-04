# ATLAS-COMPOSANTS — Catalogue composants réutilisables

> Source de vérité : ce fichier.
> Mis à jour : 2026-05-02
> Règle : AVANT d'écrire un composant carte Atlas, vérifier ici. Si équivalent existe → adapter. Sinon → construire et documenter ici.

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

### AtlasCaravane
- **Usage** : sprite PNG qui suit un path Bezier avec hopping vertical
- **Props clés** : `spriteSrc`, `path` (SVG path string), `durationFrames`, `startFrame`, `hopAmplitude`
- **RÈGLE** : walk cycle multi-frames = bug bbox → garder UN frame unique + `Math.abs(Math.sin(frame * speed)) * amplitude`
- **Épisodes** : S3 Mansa Moussa (caravane Mali→La Mecque) · S3 Shaka Zulu (impi expansion)

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

## Règle d'import pour Shaka Zulu

```tsx
// Composants partagés Atlas
import { AtlasMercator, AtlasLabel, AtlasPulseMarker, AtlasCaravane, AtlasCartouche } from "../../_shared/atlas-components";
// Données
import shakaData from "../../_shared/shaka-zulu-data.json";
// Palette Shaka
import { SHAKA_PALETTE } from "../components/AtlasShakaPalette";
```
