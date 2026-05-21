---
name: État Shaka Zulu — session 2026-05-02
description: Ce qui a été construit, ce qui reste, décision pivot fork Mansa Moussa
type: project
---

# Atlas Shaka Zulu — État fin session 2026-05-02

## Décision pivot (ACTÉE)

**Approche abandonnée** : construire de nouveaux composants carte from scratch (MapShakaZulu.tsx)
**Approche adoptée** : forker `AtlasMansaMoussaV2Final.tsx` + adapter palette/projection/données

Raison : la carte Mansa Moussa (terracotta/indigo/or, d3-geo, SVG natif) EST le standard visuel de la chaîne. On ne repart pas de zéro, on adapte.

## Assets produits cette session — GARDER

| Fichier | Utilité | Statut |
|---------|---------|--------|
| `src/projects/shaka-zulu/shaka-zulu-data.json` | Paths SVG 3 projections KwaZulu | GARDER — c'est le cœur |
| `src/projects/shaka-zulu/components/MourningWarp.tsx` | Cercles concentriques deuil S4 | GARDER — composant unique |
| `src/projects/shaka-zulu/components/AtlasShakaPalette.tsx` | Palette bordeaux/parchemin/or | GARDER |
| `scripts-atlas/precompute-shaka-zulu-data.mjs` | Script precompute SVG paths | GARDER |
| `src/projects/shaka-zulu/components/MapShakaZulu.tsx` | Doublon partiel AtlasMercator | REMPLACER par wrapper |

## Ce que MourningWarp fait (unique à Shaka)

- Filtre feTurbulence animé via spring Remotion (baseFrequency 0.008→0.028)
- feDisplacementMap scale 0→18px
- Cercles concentriques bordeaux depuis uMgungundlovu (coords lues depuis shaka-zulu-data.json)
- Anneaux secondaires or à radius*0.88
- Halo central pulsant
- S'intègre par-dessus la carte comme `<g>` SVG

## Plan fork prochaine session

**Fichier source** : `quebec-jacques-poc/src/AtlasMansaMoussaV2Final.tsx`
**Fichier cible** : `src/projects/shaka-zulu/AtlasShakaZuluFull.tsx`

Changements par scène :
- Données : `atlas-v2-data.json` → `shaka-zulu-data.json` (déjà prêt)
- Pays focus : Mali tricolore → ZAF/KwaZulu crème `#F5EBD8`
- Labels : Tombouctou/La Mecque → uMgungundlovu/GqokliHill/Durban
- Sprites : caravane hadj → impi expansion KwaZulu
- Scène unique : S4 deuil + MourningWarp (pas d'équivalent Mansa Moussa)

## Brief complet prochaine session

`memory/NEXT-SESSION-BRIEF-COMPLET.md` — contient tout : nettoyage workspace, système documentation, fork scène par scène.
