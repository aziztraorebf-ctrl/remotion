# Remotion — Geo Visual Effects

> Effets visuels pour cartes geo animees (d3-geo + Remotion).
> Extrait de `remotion.md` le 2026-04-24 (split thematique).
> Implementes dans `GeoAdvancedV2.tsx`.

---

## Techniques disponibles

| Technique | Usage | Code cle |
|-----------|-------|----------|
| Hachures SVG (`<pattern>`) | Zone de menace, territoire | `patternTransform={rotate(45 + frame*0.3)}` |
| Vignette (radialGradient) | Focalisation, tension, nuit | `vigOpacity = interpolate(frame, [50,150], [0, 0.75])` |
| Zoom CSS fluide | Changement region geo | `translate(target) scale(zoom) translate(-target)` + Easing.inOut |
| Draw-on bordure | Revelation frontiere, routes | `strokeDasharray={PATH_LEN} strokeDashoffset={PATH_LEN*(1-progress)}` |
| Pulse rings cascade | Epicentre, alerte, expansion | `(local - 160) % PERIOD` pour boucle infinie |
| Transition zoom-blur | Saut temporel, cut dramatique | 18 frames optimal, outScale 1->1.12 |

---

## Regles d'integration

- 1 effet dominant par scene max + eventuellement 1 effet subtil de texture
- Zoom max sur image raster = 2x (au-dela = pixelisation visible)
- Anti-pattern : D3 re-projection par frame = 8-15ms JS bloquant -> saccades
- Toujours utiliser `interpolate()` continu sur toute la plage frames (jamais segmenter en blocs CSS)

---

## Historique

- 2026-04-24 : extrait de `memory/tools/remotion.md` (split thematique)
- Source originale : implementation `GeoAdvancedV2.tsx`
