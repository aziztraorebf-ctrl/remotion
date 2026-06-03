---
name: next-session-senegal-beat1
description: Brief prochaine session — Sénégal Pétrole & Gaz Beat 1, audit templates + construction Acte 1
metadata:
  type: project
---

# Prochaine Session — Sénégal Beat 1 (Acte 1 — L'Anomalie)

**Durée :** 0→43.3s | 0→f1299
**Audio :** `public/souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3`
**Timing :** `src/projects/souverain/senegal-petrole-gaz/timing.ts` (recalibré 2026-05-20, fiable)

## Storyboard validé (5 panels)

Image : https://files.catbox.moe/17jwte.jpg

| Panel | Timing | Contenu | Template candidat |
|-------|--------|---------|-------------------|
| 1 | 0-6s | Intro carte Atlantique, Sénégal pas encore zoomé | Mapbox (zoom out) |
| 2 | 6-18s | Zoom Sénégal + dots Sangomar/GTA en mer | Mapbox + SVG overlay |
| 3 | 18-24s | BigStat $8M/jour reveal | **TestTextureB + CountUp** (validé) |
| 4 | 24-33s | Carte + badge "L'ÉTAT N'EST PAS CERTAIN" | Mapbox + Badge overlay |
| 5 | 33-43s | Thesis "UNE MÉCANIQUE À TESTER" | TextOnly dark |

## Ordre de travail OBLIGATOIRE (leçon session précédente)

1. **Audit templates existants** — ouvrir dashboard + ASSETS-INDEX, lister ce qui couvre déjà les 5 panels
2. **Mapper templates → panels** — utiliser l'existant AVANT de coder
3. **Identifier les manques** — coder seulement ce qui est absent
4. **Extraire shared components** depuis TestWaveReveal.tsx et TestTextureB.tsx

## Composants prêts à extraire (TestWaveReveal.tsx)

Extraire vers `src/projects/_shared/components/` :
- `GoldLine` → `ui/GoldLine.tsx`
- `CountUp` → `ui/CountUp.tsx`
- `Badge` → `ui/Badge.tsx`
- `Baseline` → `ui/Baseline.tsx`
- `SVGGrain` (TestTextureB.tsx) → `ui/SVGGrain.tsx`

## Composants communauté à tester (remocn)

Pas encore intégrés — tester avant d'utiliser en production :
- `MatrixDecode` : idéal pour révéler $8M depuis du bruit (alternatif au CountUp)
- `ShimmerSweep` : reflet sur titre. Tester pour Panel 5 "UNE MÉCANIQUE À TESTER"

## Fond standard épisode Sénégal

**TextureB** (grain SVG feTurbulence) sur navy `#0b1f35` + radial gradient.
Réutiliser pour TOUS les beats de cet épisode = identité visuelle cohérente.
Code dans `TestTextureB.tsx` → à extraire en composant partagé.

## Mapbox — Pattern camera pour panels 1, 2, 4

Utiliser le pattern Storytelling JSON adapté Remotion :
```tsx
// Chapitre = plage de frames, jumpTo() à chaque frame
map.jumpTo({ center: [lng, lat], zoom, pitch, bearing });
```
Refs documentées : `memory/tools/mapbox-mcp.md`
Script render : `./scripts/render-mapbox.sh SPG-Beat1 out/.../beat1.mp4`

## Ne pas oublier

- `premountFor={fps}` sur toutes les Sequence
- Audio `startFrom={0}` (beat standalone, pas d'offset)
- R1 : max 8s sans changement visible — Panel 1 et 2 doivent avoir du mouvement caméra
