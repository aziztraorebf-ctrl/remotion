# Protos D3.js en 16:9 — R&D

> Chantier ouvert 2026-07-18 (branche `feat/d3-16x9-protos`). Objectif : elargir notre moteur D3.js
> (jusque-la utilise seulement en 9:16 sur le Short AES, cf `src/projects/warmap/shorts/aes-short-90s/`)
> au format HORIZONTAL, et prouver des formes D3 qu'on n'avait jamais faites.
>
> **Pourquoi D3 et pas Mapbox** : D3 = SVG pur, 100% deterministe, rendu image-par-image par notre code
> (aucune couche WebGL/serveur non maitrisee). Sur un globe ou une carte stylisee (contours/drapeaux/encre),
> on controle TOUT au pixel — la ou Mapbox impose WebGL headless (incompatible Remotion sans contorsions,
> cf `render-mapbox.sh`). Contrepartie : D3 ne fait pas relief satellite / labels auto comme Mapbox.

## Protos

| Compo (Root.tsx id) | Fichier | Ce que ca prouve | Statut |
|---|---|---|---|
| `D3-A1-GlobeSahel16x9` | `GlobeSahel16x9.tsx` | **Globe orthographique** `geoOrthographic` rotation frame-driven Atlantique->Sahel + clip natif hemisphere cache + graticule + halo atmospherique + illumination trio facon AES. | ✅ Valide Aziz (proto 1 "excellent", rotation fluide, controle > Mapbox). 9s. |
| `D3-A1K1-GlobeToParchemin16x9` | `GlobeToParchemin16x9.tsx` | **Raccord globe -> carte PARCHEMIN AES** : le globe bleu se "deplie" en carte plate style video LONGUE AES (fond parchemin, trio vide en creme, contours colores par pays, drapeaux plantes). Methode = 1 seule projection ortho dont on augmente le scale (zoom-in) jusqu'a courbure imperceptible + lerp palette bleu->parchemin. 13s. | 🧪 En test |

## Socle partage

- `globeGeo.ts` — decode le monde Natural Earth 110m (`public/_rnd/vox-repro/countries-110m.json`, TopoJSON,
  objects countries+land) via `topojson-client`, expose : features monde, graticule, `orthoAt(lambda,phi)`
  (projection ortho pour une rotation donnee), helper `isVisible` (face visible d'un point pour labels).
  Cible Sahel = centroide moyen Mali+Niger+Burkina.

## Palette AES longue (reference, extraite du code `warmap/parties/`)

- Terre parchemin clair (trio vide) : `#F5EFD6` · Ocean : `#C8D9E0` · Encre contours : `#3A2A18`
- Contours colores par pays (video longue) : Mali orange, Burkina rouge, Niger vert/turquoise.

## A venir (decides, pas encore codes)

- **A5** — carte a gauche + panneau data anime a droite (disposition 16:9 signature, impossible en 9:16).
- **A2** — reseau de force `d3-force` (⚠️ PAS installe, ni d3-shape ; plan = pre-calculer positions).

> Idees completes (A1-A7 sur 3 axes) + decisions : `memory/NEXT-ACTION.md` § R&D D3 en 16:9.
