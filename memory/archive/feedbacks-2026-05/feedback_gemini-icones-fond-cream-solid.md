---
name: Gemini icônes — forcer fond crème solide pour éliminer damier transparent
description: Les icônes Gemini avec "transparent background" produisent un damier visible dans Remotion. Solution : prompt explicite avec fond crème solide imposé.
type: feedback
---

# Icônes Gemini avec fond solide imposé

**Validé** : Niger Uranium Beat 3 v4, 2026-05-10.

## Problème

Quand on demande à Gemini une icône "transparent background", le modèle produit parfois :
- Une silhouette avec des trous transparents (les colonnes d'un capitole, les marches d'un escalier)
- Un damier de transparence apparent dans l'image (artefact de génération)
- Un PNG techniquement RGB sans alpha mais avec un fond gris #cecece au lieu de transparent

Conséquence : dans Remotion, l'icône affiche un damier visible quand placée sur un cercle de fond. Disgracieux.

## Solutions essayées qui ne marchent pas

❌ **CSS mask-image** : Remotion ne traite pas correctement les `staticFile()` URLs comme masks
❌ **PIL alpha_composite** post-traitement : si l'image source n'a pas vraiment d'alpha, rien à composer
❌ **drop-shadow filter** : ne remplit pas les trous

## Solution qui marche

**Forcer le fond crème solide directement dans le prompt Gemini :**

```
Single editorial pictogram on a UNIFORM solid CREAM #d4c29d color background filling the ENTIRE square frame edge to edge. The cream background must be flat solid #d4c29d color WITHOUT any transparency, WITHOUT any checkered pattern, WITHOUT any gradients, WITHOUT any texture.

In the center, render a [SUBJECT] as a flat editorial silhouette pictogram in solid color [COLOR_HEX].

CRITICAL RULES:
- The background must be ENTIRELY solid cream #d4c29d, no white edges, no transparency, no gray, no checkered pattern.
- The pictogram is a flat 2D vector-style icon, no 3D, no shadows, no gradients.
- Square 1024x1024 image.
- No text, no letters, no labels.
- Newspaper editorial illustration style.
```

**Vérification** : `Image.open(path).getpixel((0,0))` doit retourner `(216, 193, 149)` ou proche (= #d4c29d). Si pixel (0,0) = (206, 206, 206) → c'est un damier gris, échec.

**Why:** Plusieurs heures perdues sur Niger Uranium à essayer mask CSS, alpha composite PIL, drop-shadow. Aucune ne marche. Régénérer avec prompt explicite = solution propre en 1 essai.

**How to apply:** Tout PNG icon Gemini destiné à être placé sur un cercle de fond coloré → forcer le fond solide dès la génération, ne pas tenter de réparer en post-traitement.
