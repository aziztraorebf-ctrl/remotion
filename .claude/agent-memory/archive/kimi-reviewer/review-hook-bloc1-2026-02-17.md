# Review: hook-bloc1-sideview.mp4
**Date**: 2026-02-17
**Projet**: Peste 1347 - Hook Scenes 6-7 (side-view cinematic parallax)
**Duration**: 10 seconds
**API**: Moonshot (kimi-k2.5)
**Tokens**: 42,061 in + 1,215 out = $0.0289

---

## Context
- Background CSS: dégradé ciel + silhouettes bâtiments + pavé gris
- 6 NPCs pixel art 64x64 upscalés 3x sur 3 lanes (Y=780/810/840)
- Scene 6 (0-4s): personnages marchent avec stamp "HUMAINS"
- Scene 7 (4-10s): même rue, ralentissement progressif, typewriter "LES MEMES REFLEXES", darkening overlay

---

## Kimi Assessment

### COMPOSITING (7/10)
- Z-index/Layering: ✅ Correct (NPCs selon lane Y)
- Upscale 3x: ⚠️ Acceptable, artefacts pixellisation visibles
- Intégration CSS: ✅ Bonne

### LISIBILITÉ (5/10) - CRITICAL ISSUE
- **Contraste NPCs/Background**: ⚠️ MAJEUR - Tons marrons/beiges se confondent avec bâtiments ocre-jaune
- Silhouettes: ✅ Lisibles grâce contour sombre
- Taille relative: ✅ 192px = 18% hauteur

**Problem**: Personnage vert lisible, autres (beige/marron) s'effacent dans le plaid bâtiments

### COHÉSION VISUELLE (6/10)
- Palette: ⚠️ Partielle (NPCs = terre réaliste, background = stylisé violet/noir)
- Style unifié: ⚠️ Déconnexion (bâtiments plaid graphiques vs sprites réalistes)
- Ambiance: ✅ Violet crépusculaire fonctionne

### EFFETS Scene 7 (6/10)
- Ralentissement progressif: ✅ Efficace
- Darkening overlay: ⚠️ Trop uniforme, manque direction
- Typewriter: ✅ Bon timing

### TEXTE (8/10)
- "HUMAINS" stamp: ✅ Position basse centrale, jaune-or lisible
- "LES MEMES REFLEXES": ✅ Typo monospace, position haute, curseur effect
- Timing: ✅ Arrivée après ralentissement = bon dramatique

### ANIMATION (7/10)
- Walk cycle: ✅ Smooth 60fps
- Z-order par lane: ✅ Correct (840 > 810 > 780)
- Parallaxe: ❌ Absente, manque profondeur

---

## VERDICT: 6.5/10

| Critère | Note |
|---------|------|
| Technique Remotion | 7/10 |
| Direction artistique | 6/10 |
| Lisibilité | 5/10 |
| Impact narratif | 7/10 |

---

## TOP 3 PROBLÈMES

1. **Contraste insuffisant** - NPCs beiges sur background ocre = perte lisibilité
2. **Déconnexion style** - Sprites réalistes vs background abstrait "plaid"
3. **Manque de profondeur** - Pas de parallaxe, overlay darkening trop plat

---

## TOP 3 FORCES

1. **Timing narratif** - Ralentissement + typewriter orchestrés parfaitement
2. **Z-index correct** - Gestion layers par lane impeccable
3. **Ambiance générale** - Crépuscule violet + silhouettes = immersive

---

## RECOMMANDATIONS PRIORISÉES

| Priorité | Action | Impact |
|----------|--------|--------|
| **P1** | Outline noir 2-3px NPCs OU brighten sprites (beige → jaune clair) | Lisibilité +++ |
| **P2** | Vignette radiale centrée sur texte (vs overlay noir uniforme) | Dramatique ++ |
| **P3** | Parallaxe légère bâtiments (0.3x) OU grain/film overlay | Cohésion + |

---

## Suggestion Post-Processing
Ajouter: vignette, grain, color grading pour unifier sprites + background abstraits

---

## Next Action
Transmit to creative-director (Stage 9) pour MINOR FIXES vs RE-EVALUATE decision.
