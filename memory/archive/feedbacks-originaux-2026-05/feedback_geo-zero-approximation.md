---
name: Géographie zéro approximation — règle non-négociable Atlas
description: Toute coordonnée géographique (POI, frontière, territoire) doit venir d'une source vérifiée projetée via d3-geo. Jamais de coordonnées dessinées à la main, jamais "ça devrait être là".
type: feedback
---

## Règle absolue

Sur les vidéos Atlas, **JAMAIS** d'approximation de coordonnées géographiques sans source vérifiée. Toute position de POI, ville, frontière ou territoire doit :

1. Provenir d'une source factuelle (OpenHistoricalMap, Natural Earth, Wikipedia coords, dataset académique)
2. Être projetée via d3-geo avec la projection canonique du projet (ex: `geoMercator().center([-3,18]).scale(1400).translate([360,640])` pour Empire Ghana)
3. Être commentée dans le code avec la source utilisée

**Why** : Aziz a confronté plusieurs fois des positions absurdes (Florence en Tunisie, Mali = blob inventé). Le format Atlas se vend sur la rigueur cartographique. Une coordonnée inventée détruit la crédibilité de tout l'épisode.

## Anti-patterns interdits

❌ "Approximation Mercator" comme commentaire dans le code (j'ai fait l'erreur 3x cette session)
❌ Dessiner un polygone à la main pour "représenter un territoire" (MALI_PATH initial)
❌ Décaler une vraie coord pour "visibilité narrative" (Sijilmassa y=350 au lieu de 273)
❌ Mettre des coordonnées dans le code sans documenter la source

## Pattern correct

```typescript
// ✅ BON : Florence + Venise — VRAIES coordonnées via projection mercSahel (d3-geo)
// geoMercator().center([-3, 18]).scale(1400).translate([360, 640])
// Florence (11.255°E, 43.770°N) → (708, -105)
// Venise   (12.336°E, 45.438°N) → (735, -162)
const SVG_FLORENCE_X = 708;
const SVG_FLORENCE_Y = -105;
```

```typescript
// ❌ INTERDIT
// Florence + Venise — repositionnés pour rester visibles
// On les place sur Méditerranée nord, dans le cadre visible avec zoom 0.55
const SVG_FLORENCE_X = 620;  // INVENTÉ
const SVG_FLORENCE_Y = 220;  // INVENTÉ
```

## Workflow obligatoire

Avant de hardcoder une coordonnée :
1. Trouver la source (Wikipedia "City — Coordinates", OpenHistoricalMap relation, dataset)
2. Calculer via Node : `node -e "const {geoMercator}=require('d3-geo'); const proj=geoMercator().center([X,Y]).scale(S).translate([W,H]); console.log(proj([lon, lat]));"`
3. Insérer la valeur exacte avec commentaire source

Si la coord vraie est hors-cadre : changer la projection (zoom out, recentrer), pas inventer une fausse position. Le mouvement caméra peut s'adapter aux vraies coords.

## Cas d'origine

Empire Ghana session 2026-05-04. Aziz a dû corriger 3x :
1. Florence/Venise placés en Tunisie (approximation)
2. Sijilmassa y=350 au lieu de 273 (décalage manuel pour visibilité)
3. MALI_PATH = blob inventé puis amélioré avec coordonnées de Claude (pas de source OHM)

Cas 1 et 2 corrigés. Cas 3 reste à finaliser via OpenHistoricalMap dans la prochaine session.

## Validation Aziz

> "Si tel est le cas, il faut utiliser les vraies données ou les données les plus justes possibles. Ne pas se fier seulement à soi-même ou à toi-même, parce que c'est une erreur, selon moi, qui est très grave en ce moment."

— Aziz 2026-05-04
