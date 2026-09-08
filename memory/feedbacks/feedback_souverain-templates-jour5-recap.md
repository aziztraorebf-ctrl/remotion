---
name: Souverain Templates Library Jour 5 — récap composants livrés
description: 4 composants livrés Jour 5 (SplitScreen V2, EntityDiagram V2, ComparisonTable V2, GlobeLocationReveal V4 Mapbox). Backlog reduit.
type: project
originSessionId: 63ac0803-3b65-449b-940b-dbe06b197a74
---
# Souverain Templates Library — Récap Jour 5 (2026-05-09)

## Composants livrés (validés Aziz)

| Composant | Fichier | Démo Catbox | Notes |
|-----------|---------|-------------|-------|
| SplitScreen V2 | `src/projects/_shared/components/inserts/SplitScreen.tsx` | (validé Jour 4) | 3 layouts stacked/split/reveal, générique |
| NewsClippingV2 (extracted) | `src/projects/_shared/components/inserts/NewsClippingV2.tsx` | — | Standalone avec props complètes |
| EntityDiagram V2 (dossier OSINT) | `src/projects/_shared/components/inserts/EntityDiagram.tsx` | https://files.catbox.moe/s6ptze.mp4 | Tampon DOSSIER, edges typés, annotations OSINT, 4 backgrounds |
| ComparisonTable V2 (générique) | `src/projects/_shared/components/inserts/ComparisonTable.tsx` | https://files.catbox.moe/vzpjpu.mp4 | 4 backgrounds + 5 kinds (country/company/era/actor/custom) + verdict + source |
| GlobeLocationReveal V4 Mapbox | `src/projects/_shared/components/inserts/GlobeLocationReveal.tsx` | Niger https://files.catbox.moe/6rbo22.mp4 / MTL https://files.catbox.moe/ie5ivy.mp4 / E2E https://files.catbox.moe/agm5tc.mp4 | Globe Mapbox + reticule + panel, supporte transition globe→Mercator |

## Why : décisions clés Jour 5

- **Globe : pivot vers Mapbox au lieu de SVG custom** — V1/V2/V3 SVG-based abandonnés. Mapbox `projection: 'globe'` donne nativement sphère, atmosphère, étoiles, texture continents. Coordonnées via MCP Mapbox = zéro approximation. Composant final = simple, ~200 lignes.
- **EntityDiagram : direction "dossier d'enquête Souverain"** — différenciation maximale vs NYT VI. Tampon DOSSIER N°XXX, fond bleu nuit avec grain papier, edges typés (direct/suspecté/déclaré), annotations OSINT mono.
- **ComparisonTable : générique multi-cas** — n'est plus juste "country vs country". Accepte company/era/actor/custom avec 4 backgrounds (accent/kraft/dossier/noir) + verdict optionnel + source line.

## How to apply : usage en production Niger uranium

- **Hook (10s)** : `<GlobeLocationReveal countryIso="NER" style="souverain" panelMode="country">` 
- **Beat dossier complot uranium** : `<EntityDiagram>` Orano/SOMAIR/État Niger (déjà la démo)
- **Beat comparaison ères** : `<ComparisonTable>` 1970-1999 vs 2000-2024 (déjà la démo)
- **Beat témoin/citation** : `<KraftCardDocClassifie>` (validé Jour 4)
- **Beat split visuel** : `<SplitScreen>` terrain + portrait

## Backlog Jour 6+

- BrutalHeadline (direction B alternative)
- DataCard (chiffre central énorme)
- BigStat (Vox)
- DateBar pleine largeur
- OsintSplitScreen (différencier de SplitScreen générique)
- Templates E (Le Monde Cartographique) / F (Carnet Reporter Johnny Harris) — POC requis
- Style Caspian assombri (Niger uranium prod) — voir feedback dédié

## Production prochaine session

Niger uranium = Hook + 4 beats + CTA, ~80s. Lib templates suffisante pour démarrer. Style Caspian à finaliser avant lock production.
