---
name: "Atlas — règle absolue : tous overlays textuels en TOP HALF (y < 640)"
description: "Bottom écran réservé aux sous-titres karaoke TikTok. Cartouches, labels, encadrés textuels TOUJOURS dans le top half. Validé Empire Ghana Beat 1 (2026-05-03)."
type: feedback
---

# Cartouches en haut UNIQUEMENT — règle absolue Atlas

> Validé Empire Ghana Beat 1 v4 (2026-05-03). Aziz : "Quand nous allons mettre les sous-titres style TikTok ils vont être en bas de l'écran. Donc si les cartouches apparaissent là ça ne marche plus."
>
> **Règle non-négociable** ajoutée aux 13 règles Atlas.

## La règle

Sur viewBox 720×1280 (vertical Short) :

- **Top half (y = 0 à y = 640)** = zone overlays textuels (cartouches, labels, encadrés, dates, statistiques)
- **Bottom half (y = 640 à y = 1280)** = zone réservée aux sous-titres karaoke TikTok

**Aucune exception**. Même si les sous-titres ne sont pas encore implémentés sur la scène, on code en respectant la règle pour éviter de devoir tout déplacer plus tard.

## Pourquoi

- Sous-titres karaoke TikTok = format viral standard, position bas écran, taille 38-48px
- Cartouches qui apparaissent au même endroit = collision visuelle = illisible
- Une fois tournée habitude/règle → tous les épisodes Atlas auront cohérence cross-vidéos

## Positions canoniques (viewBox 720×1280)

| Élément | Position Y | Notes |
|---------|------------|-------|
| Cartouche principal scène (titre type "WAGADOU") | y = 170 | Position haute, visible des le debut |
| Cartouche secondaire (timeline, dates, sous-info) | y = 320 | Sous le cartouche principal |
| Cartouche tertiaire (chiffre choc, stat) | y = 470 | Limite basse acceptable, attention zone tilt |
| Spotlight insert centré | y = 640 (centre) | Cas spécial : centre écran avec dim background |
| Sous-titres karaoke TikTok | y = 1130-1180 | Bas écran, 100-150px du bas |
| Légende source/référence | y = 1080 | Au-dessus karaoke, fade-in/out par phrase |

## Pattern d'enchaînement

Si plusieurs cartouches doivent coexister verticalement :
- Cartouche 1 : y = 170, hauteur 110px → bord bas y = 225
- Cartouche 2 : y = 320, hauteur 100px → bord bas y = 370
- Espace minimum 50px entre les cartouches

Si conflit horizontal (plusieurs cartouches en simultanné) :
- Réduire largeur (max 440px chacun, centrés)
- OU les enchaîner temporellement (cartouche 1 fade out avant que cartouche 2 fade in)

## Anti-patterns observés

### Beat 1 Empire Ghana v3 (CORRIGÉ en v4)
```tsx
// ❌ Timeline VIIIᵉ→XIIIᵉ siècle placée en bas
<g transform="translate(360 1050)">  // y=1050 = future zone subtitle !
  ...
</g>

// ✅ V4 : déplacé en haut
<g transform="translate(360 320)">  // y=320 = top half
  ...
</g>
```

### Erreur classique Mansa Moussa (corrigée en V2)
Mansa Moussa V1 avait des cartouches qui chevauchaient les subs. V2 a tout déplacé en haut. Empire Ghana applique la leçon dès le départ.

## Comment vérifier

Avant chaque mini-render d'une scène Atlas :
1. Lister tous les composants overlay HTML/SVG (cartouches, labels, encadrés)
2. Vérifier que toutes les positions Y sont **< 640**
3. Sauf cas spécial spotlight insert centré (y=640 OK)
4. Si un overlay a y > 640 = bug, déplacer immédiatement

## Exception : spotlight insert centré

Le pattern Spotlight Insert (voir `feedback_atlas-spotlight-insert-pattern.md`) place son cartouche à y = 640 (centre). C'est acceptable car :
- C'est temporaire (~3s max)
- Il prend tout l'écran avec un dim background
- Les sous-titres karaoke peuvent être désactivés pendant cette période si nécessaire

## How to apply

À chaque nouvelle scène Atlas, ajouter cette ligne en commentaire en tête du fichier :

```tsx
// Règle Atlas : tous cartouches en y < 640 (bottom = sous-titres karaoke)
```

Et avant render, scanner le fichier pour vérifier qu'aucun `translate(... <number-greater-than-640>)` n'apparaît dans les overlays textuels.
