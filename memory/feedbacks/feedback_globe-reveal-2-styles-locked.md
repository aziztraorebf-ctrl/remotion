# Globe Reveal — 2 styles canoniques (Jour 5, 2026-05-09)

> Migré depuis auto-memory 2026-08-31. Composant `GlobeLocationReveal` toujours présent dans le repo
> (`src/projects/_shared/components/inserts/GlobeLocationReveal.tsx`).

## Règle

Toutes les révélations sur globe Souverain utilisent `GlobeLocationReveal` avec UN des 2 styles canoniques. Le composant gère tout, seule la prop `style` change.

## Style 1 — Souverain (défaut révélations dramatiques)

- Background : `#020714` + étoiles
- Atmosphère Mapbox : bleu nuit (`color: #0a1834`, `space-color: #020714`, `star-intensity: 0.6`)
- Style Mapbox : `dark-v11`
- Highlight pays : jaune `#f5d547`
- Panel : bleu nuit `#1a2548` + bordure jaune
- Texte panel : blanc + accent jaune
- **Usage** : enquêtes, conflits, révélations dramatiques (Niger uranium, Sahel, etc.)

## Style 2 — Caspian (révélations apaisées éditoriales)

- Background : dégradé `linear-gradient(180deg, #a8c5d8 0%, #6e8aa3 60%, #4a627a 100%)`
- Atmosphère Mapbox : blanche lumineuse (`color: #ffffff`, `high-color: #d8e4ee`, `horizon-blend: 0.12`, `space-color: #7a92a8`)
- Style Mapbox : `light-v11` + `applyCartoCaspian`
- Highlight pays/ville : terracotta `#a05a3a` (default)
- Panel : papier crème `#ede5d3` + bordure grise
- Texte panel : noir `#2a1f12` + accent gris muet
- **Usage** : sujets éducatifs, géographiques, cartes éditoriales calmes (Montréal, sujets non conflictuels)

## Conventions cadrage Souverain (lockées Jour 5)

1. **Marges latérales 11%** : `PANEL_X = 120`, `PANEL_W = 840` sur largeur 1080. Respire des bords, ne mord pas dans la safe zone latérale.
2. **Sous-titres dynamiques en HAUT pendant scènes globe** — pas en bas. Le panel utilise la moitié inférieure de l'écran. Convention de positionnement subtitles spécifique aux scènes globe.
3. **`subInfo` > `secondaryLabel`** : préférer une donnée éditoriale courte (`"SAHEL · 26.2M HAB."`, `"13°N · 2°E"`, `"PAYS ENCLAVÉ"`) plutôt qu'un nom de capitale redondant. Si la capitale est marquée sur la silhouette, ne pas la répéter en label.
4. **Capitale marquée sur silhouette** : passer `capitalSvgCoord` + `capitalLabel`. Coords calculées via même projection d3-geo orthographic que `countryPath`. Si tu génères le path via `rotate([-lon,-lat,0]).scale(500).translate([270,160])`, calcule la position capitale avec la même projection.
5. **Marges sup/inf** : globe occupe le tiers supérieur (centre vertical ~y=750), panel le tiers inférieur (top y=1280 ou 1380), zone milieu (y=900-1280) pour réticule + ligne connectrice.

## Pattern color script DANS une révélation

Le pattern color script (cf `memory/projects/CASPIAN-PALETTES-NIGER-URANIUM.md`) s'applique aussi aux globes :
- OK de commencer une vidéo en `style="souverain"` (hook dramatique) puis passer à `style="caspian"` plus tard pour un beat éducatif calme. Même grammaire visuelle (étoiles/atmosphère/réticule/panel) → pas de rupture.
- Quand on change de map (Caspian Sepia, Atlas3D Mercator) on change la **projection** mais le **chrome** (étoiles, atmosphère, panel, réticule) reste cohérent.

## Props GlobeLocationReveal V5 (référence rapide — vérifier signature actuelle dans le composant avant usage)

```ts
<GlobeLocationReveal
  countryIso="NER"                    // ou omit pour mode city
  targetCoord={[8.082, 17.608]}       // via MCP Mapbox geocoding
  primaryLabel="NIGER"
  subInfo="SAHEL · 26.2M HAB."        // remplace secondaryLabel si fourni
  countryPath={NIGER_PATH}            // projection d3-geo orthographic
  countryBBox={NIGER_BBOX}
  capitalSvgCoord={[220, 190]}        // coords SVG units (même projection)
  capitalLabel="NIAMEY"
  style="souverain"                   // ou "caspian" / "noir"
  panelMode="country"                 // ou "city" / "none"
  durationFrames={150}
  cameraKeyframes={...}               // optionnel pour transitions globe→Mercator
  panelHideStart={170}                // pour fade panel avant zoom
  reticleHideStart={170}              // pour fade reticule avant zoom
/>
```

## Anti-patterns

- **NE PAS** créer un 3e style canonique sans validation Aziz — la lib doit rester limitée
- **NE PAS** placer les sous-titres dynamiques en bas pendant une scène globe — convention "en haut"
- **NE PAS** doubler nom capitale en label si dot visible sur silhouette — utiliser `subInfo` à la place
- **NE PAS** réduire les marges en-dessous de 11% (paroi droite/gauche du panel doit respirer)
