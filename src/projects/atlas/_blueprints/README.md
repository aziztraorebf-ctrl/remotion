# Atlas Blueprints Library

> Patterns de mise en scène validés et réutilisables pour les épisodes Atlas.
> Session R&D 2026-05-14 : 8 blueprints fondamentaux. Session 2026-05-17 : +5 blueprints avancés extraits des épisodes de production validés (Ghana + Peste 1347).
> Chaque blueprint = composant starter + documentation d'usage. Les blueprints avancés (*) ont preview à générer via Remotion Studio.

## Règles d'usage

1. **Copier, jamais modifier** : importer le composant dans ton épisode, ne pas modifier le blueprint original
2. **Props requises** : chaque blueprint expose des props pour l'adapter à ton épisode (coordonnées SVG, sprites, durée)
3. **Enregistrement Root.tsx** : chaque blueprint a une composition `Atlas-BP-*` dans le Folder `atlas-blueprints`
4. **Coordonnées SVG** : espace 720×1280 — calibrer selon le projet via les données JSON de l'épisode
5. **Audio** : les durées sont paramétrables via `durationFrames` — adapter à ton timing.ts

---

## Catalogue — 13 blueprints validés

### Blueprints fondamentaux (R&D 2026-05-14)

| # | Blueprint | Statut | Acteurs | Notes clés |
|---|-----------|--------|---------|------------|
| 1 | [walk-to-destination](./walk-to-destination/) | ✅ VALIDÉ | Chameau Ghana (walk-sheet) | Walk cycle 4f + zoom spring + label à l'arrivée |
| 2 | [confrontation](./confrontation/) | ✅ VALIDÉ | Shaka + Zulu Warrior | Deux persos depuis bords opposés, face-à-face |
| 3 | [orbital-city](./orbital-city/) | ✅ VALIDÉ | — | Rotation + drift caméra autour du POI |
| 4 | [zoom-revelation](./zoom-revelation/) | ✅ VALIDÉ | — | Pull-back 4x→1x + label qui disparaît |
| 5 | [shake-impact](./shake-impact/) | ✅ VALIDÉ | — | Sin multifréquence + flash orange + decay quadratique |
| 6 | [alliance](./alliance/) | ✅ VALIDÉ | Chameau + Shaka | Convergence diagonale + cercle doré accord |
| 7 | [empire-expansion](./empire-expansion/) | ✅ VALIDÉ | — | strokeDashoffset path empire + fill fade |
| 8 | [flashback](./flashback/) | ✅ VALIDÉ | — | Filtre sepia CSS + skew distorsion + vignette |

### Blueprints avancés — extraits des épisodes de production (2026-05-17)

> Source : Empire Ghana Beat3Barter (2 persos, échange sel/or) + Beat4Consequence (armée Mande).
> Ces patterns ont été **validés en production** avant d'être extraits ici.
> Props minimalistes — adapter spawnSvgX/Y, destSvgX/Y, spriteDir, durationFrames à l'épisode.

| # | Blueprint | Source validée | Cas d'usage | Pattern clé |
|---|-----------|----------------|-------------|-------------|
| 9  | [camera-track-entity](./camera-track-entity/) | Ghana Beat3Barter (berbere) | 1 perso marche A→B, caméra suit | `computeCameraState()` + `svgToCompWithCam()` |
| 10 | [dual-entity-sequential](./dual-entity-sequential/) | Ghana Beat3Barter (berbere + sahelien) | 2 persos séquentiels, échange, dolly-out | Focus caméra change d'entité active automatiquement |
| 11 | [formation-march](./formation-march/) | Ghana Beat4Consequence (Sundiata + 3 guerriers) | Armée, cortège, caravane | `memberPosition(frameOffset)` — retards individuels |
| 12 | [waypoint-march](./waypoint-march/) | Ghana Beat4Consequence (guerrier almoravide) | Voyage multi-villes, conquête par étapes | Segments linéaires if/else par waypoint |
| 13 | [dutch-tilt-collapse](./dutch-tilt-collapse/) | Ghana Beat4Consequence (Phase D Effondrement) | Chute d'empire, défaite, catastrophe | `rotate(dutchAngle)` sur wrapper + shake sin() + switch couleur |

#### Règle d'utilisation des blueprints avancés

```
1. Identifier le pattern dans le tableau ci-dessus
2. Copier le composant dans src/projects/<episode>/scenes/
3. Remplacer spawnSvgX/Y, destSvgX/Y par les coords du fichier geo de l'épisode
4. Remplacer spriteDir par le path PixelLab de l'épisode
5. Adapter walkStart/walkEnd aux frames du timing.ts de l'épisode
6. NE PAS modifier la logique computeCameraState/svgToCompWithCam — elle est validée
```

---

## Gotchas à connaître

### Coordonnées SVG par défaut
Toutes les coordonnées sont définies par rapport au viewBox `720×1280` d'`AtlasMercator`.
- `ATLAS_CX = 360`, `ATLAS_CY = 640` = centre de la carte
- Les coordonnées de démo (Sahara, Mali, Afrique de l'Ouest) sont des exemples — calibrer selon l'épisode
- Utiliser `atlas-v2-data.json` `.mercWide.cities` pour les coordonnées exactes des villes

### Structure atlas-v2-data.json
```
{
  mercWide: {
    countries: [{iso, d}],  // ← pour AtlasMercator
    maliEmpire1300: {...},   // ← path empire Mali (vérifier structure exacte)
    cities: [{name, x, y}]  // ← coordonnées villes
  }
}
```

### EmpireExpansion — path empire
Le `maliEmpire1300` dans `mercWide` a peut-être une structure différente de `{d: string}`.
Si fallback cercle générique → inspecter la structure réelle et brancher le bon chemin.

### AtlasMercator — API correcte
```tsx
<AtlasMercator
  countries={countries}      // pas "data" — c'est "countries"
  scale={camZoom}
  driftX={0}
  driftY={0}
  centerOffsetX={poiSvgX - 360}  // déplace le focus caméra
  centerOffsetY={poiSvgY - 640}
/>
```

### svgToComp — signature correcte
```tsx
import { svgToComp } from "../../_shared/atlas-components";
import type { AtlasCameraState } from "../../_shared/atlas-components";

const cam: AtlasCameraState = {
  focusX: 360,  // ATLAS_CX par défaut
  focusY: 640,  // ATLAS_CY par défaut
  camZoom: 2.8,
  driftX: 0,
  driftY: 0,
};
const pos = svgToComp(svgX, svgY, cam);
```

### Walk cycle sprites
- Chameau Ghana : `public/empire-ghana/assets/pixellab/chameau-walk-sheet.png` — 256×64 (4 frames × 64px)
- Shaka statique : `public/atlas-shaka-zulu/assets/shaka-static.png` — 128×128 (1 frame)
- Zulu Warrior : `public/atlas-shaka-zulu/assets/zulu-warrior-static.png` — 128×128 (1 frame)
- Pour sprites statiques : utiliser hopping `Math.abs(Math.sin(frame * 0.3)) * 4`

---

## Composants partagés utilisés
- `AtlasMercator` — carte plate Afrique (coordonnées SVG 720×1280)
- `AtlasCaravane` — sprite qui suit un path Bezier (voir ATLAS-COMPOSANTS.md)
- `svgToComp(x, y, cam)` — coordonnées SVG → pixels CSS composition
- `getSpriteAnimFrame(frame, start, hold, total)` + `getSpriteClipPath(animFrame, total)` — walk cycle
- `AtlasLabel` — label pill avec spring fade-in (props: `coord`, `appearAt`, `text`)
- `AtlasPulseMarker` — cercle pulsant sur POI (props: `coord`, `beatStart`, `color`)
- `FocusBubble` — zoom dramatique avec blur background (voir ATLAS-COMPOSANTS.md)

---

## Patterns techniques cross-blueprints

### Zoom caméra vers un POI
```tsx
const cameraZoom = spring({ frame, fps, from: 1.0, to: 2.8, durationInFrames: 60,
  config: { damping: 80, stiffness: 40, mass: 1 } });
const centerOffsetX = poiSvgX - 360;
const centerOffsetY = poiSvgY - 640;
<AtlasMercator ... scale={cameraZoom} centerOffsetX={centerOffsetX} centerOffsetY={centerOffsetY} />
```

### Walk cycle sin() pour sprites statiques
```tsx
const hopY = Math.abs(Math.sin(frame * 0.3)) * 4; // hopping naturel 4px
```

### Conversion SVG → CSS (sans svgToComp)
```tsx
const ATLAS_CSS_SCALE = 1.5;
const toCSSX = (svgX: number) => ((svgX - poiSvgX) * cameraZoom + 360) * ATLAS_CSS_SCALE;
const toCSSY = (svgY: number) => ((svgY - poiSvgY) * cameraZoom + 640) * ATLAS_CSS_SCALE;
```

### Shake d'impact
```tsx
// Sin multifréquence = chaos déterministe (reproductible frame-par-frame)
const shakeX = amplitude * (Math.sin(frame * 7.3) * 0.6 + Math.sin(frame * 13.1) * 0.4);
const shakeY = amplitude * (Math.sin(frame * 9.7) * 0.5 + Math.sin(frame * 5.3) * 0.5);
// Decay quadratique : amplitude * (1 - t) * (1 - t)
```

### Filtre flashback
```tsx
const filterCSS = `sepia(${intensity}) brightness(${1 - intensity * 0.1}) contrast(${1 + intensity * 0.15})`;
<AbsoluteFill style={{ filter: filterCSS }}>...</AbsoluteFill>
```
