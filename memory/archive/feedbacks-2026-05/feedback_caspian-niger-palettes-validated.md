---
name: Caspian palettes Niger uranium — Sepia validé Aziz
description: CASPIAN_SEPIA = palette par défaut Niger uranium. CASPIAN_NOIR = variante climax Beat 6. Validé screenshot Aziz 2026-05-09.
type: feedback
---

# Caspian palettes Niger uranium

**Validé** : 2026-05-09 — screenshot Aziz (Niger highlight or sur fond Sepia).

## Palette par défaut : CASPIAN_SEPIA

```ts
export const CASPIAN_SEPIA = {
  water:        "#a8c2d4",
  land:         "#d8c9a8",
  landAlt:      "#e3d6b8",
  border:       "#3a2f20",
  borderOpacity: 0.85,
  borderWidth:  0.7,
  highlightOr:        "#c08820",
  highlightTerracotta: "#8b4a2c",
  highlightIndigo:    "#2a3552",
}
```

Utiliser `CASPIAN_SEPIA` pour : Beat 4 (bras de fer juridique), Beat 5 (asymétrie).

## Variante climax : CASPIAN_NOIR

Utiliser pour Beat 6 (climax — switch color script dramatique).

## Principe

Un même episode peut avoir N variantes partageant grammaire + typo + highlights — seule la palette change.
Permet color script narratif sans rupture stylistique.

**Why:** Screenshot Aziz confirme que Sepia donne le caractère documentaire voulu sans être trop sombre.
**How to apply:** Importer `CASPIAN_SEPIA` au lieu de `CASPIAN_PALETTE` dans tout beat CartoCaspian Niger uranium sauf le Beat 6 (Noir).
