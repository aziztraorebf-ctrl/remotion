---
name: premium-visual-guidelines
description: Guidelines visuelles style Polymatters/Vox/Johnny Harris — ce qui rend une vidéo premium vs amateur
metadata:
  type: feedback
---

# Guidelines Visuelles Premium — Style Polymatters / Vox / Johnny Harris

**Why:** Session 2026-05-20 — on a tourné en rond faute de références claires. Ces guidelines évitent de reconstruire à chaque session.

**How to apply:** Avant de coder un nouveau beat/template, vérifier les 5 règles ci-dessous.

## Ce qui fait la différence (observations directes)

### 1. Le fond texturé EST le premium
- Un fond uni sans texture = écran de chargement
- Polymatters : fond rouge brique avec grain papier subtil
- Vox : fond sombre avec micro-texture, jamais noir pur
- Notre implémentation validée : **TextureB (grain SVG feTurbulence)** sur navy `#0b1f35`
- Alternative : **Paper kraft PNG** (screen blend, opacity 0.18) pour tons chauds

### 2. Simplicité graphique + richesse du fond
- Les graphiques eux-mêmes sont SIMPLES : une barre, un chiffre, une ligne
- C'est le fond + la typographie qui portent l'émotion
- Erreur à éviter : vouloir des graphiques complexes avec un fond plat

### 3. CountUp > chiffre statique
- Tout grand chiffre doit être animé : $0 → $8,000,000
- Easing exponentiel (Easing.out(Easing.exp)) pour effet "révélation"
- Glow gold (`drop-shadow(0 0 40px #d4a93c99)`) pendant l'animation, réduit à l'arrêt

### 4. Ligne de séparation animée avant le chiffre
- Fine ligne dorée qui s'étire horizontalement (scaleX 0→1) avant l'apparition du chiffre
- Donne un rythme, prépare l'oeil
- Code : `GoldLine` dans TestWaveReveal.tsx — réutilisable partout

### 5. Baseline journalistique en bas
- PAYS · ANNÉE · Source : Entité — toujours présent
- Crédibilise immédiatement, style "reportage"
- Fade in tardif (après que le chiffre soit stable)

### 6. Cohérence du système > nouveauté par scène
- Polymatters/Vox utilisent 5-6 templates fixes réutilisés à l'infini
- Le viewer ne s'en rend pas compte, mais ça crée une identité
- Notre règle : même fond texturé pour TOUT l'épisode Sénégal

## Références chaînes

| Chaîne | Style signature | Pattern clé |
|--------|----------------|-------------|
| Polymatters | Fond coloré uni + grain papier + illus custom | Simplicité + identité forte |
| Vox | Dark + rouge/blanc + barre horizontale animée | Journalisme visuel, autorité |
| Johnny Harris | Mapbox + texte over vidéo + transitions cutaway | Géographie narrative |
| Kurzgesagt | Fond sombre + personnages plats + motion ciblé | Motion au service du concept |

## Composants Remotion validés pour ce style

Tous dans `src/projects/souverain/senegal-petrole-gaz/` :
- `GoldLine` — ligne dorée animée (extrait de TestWaveReveal.tsx)
- `CountUp` — countUp expo + glow (extrait de TestWaveReveal.tsx)
- `Badge` — badge spring pop (extrait de TestWaveReveal.tsx)
- `Baseline` — baseline journalistique (extrait de TestWaveReveal.tsx)
- `SVGGrain` — fond grain feTurbulence (extrait de TestTextureB.tsx)

**À extraire en shared components lors de la prochaine session.**
