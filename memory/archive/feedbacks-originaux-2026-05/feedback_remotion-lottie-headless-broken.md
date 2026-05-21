---
name: "@remotion/lottie — règles canoniques génération JSON par Claude"
description: "@remotion/lottie fonctionne en headless avec require() + format JSON canonique strict. Claude peut générer des icônes géométriques simples (validé Wiggle skill 2026-05-03)."
type: feedback
---

**@remotion/lottie fonctionne** en headless render à condition de respecter DEUX règles strictes.

## Règle 1 : Pattern require() obligatoire

```tsx
// eslint-disable-next-line @typescript-eslint/no-var-requires
const animationData = require("./mon-animation.json");

<Lottie animationData={animationData} loop style={{ width: 300, height: 300 }} />
```

**INTERDIT** : `fetch + delayRender` externe. Le composant `<Lottie>` a son propre `delayRender` interne — un double crée un conflit, timeout 28s.

## Règle 2 : Format JSON canonique strict (sinon crash silencieux dans lottie-web)

Validé via skill Wiggle (talknerdytome-labs/wiggle-claude-skill) le 2026-05-03.

**Structure shape layer (ty: 4) qui marche :**

```json
{
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 120,
  "h": 120,
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "MyShape",
      "sr": 1,
      "ks": {
        "p": {"a": 0, "k": [60, 60, 0]},
        "a": {"a": 0, "k": [0, 0, 0]},
        "s": {
          "a": 1,
          "k": [
            {"t": 0, "s": [85, 85, 100], "e": [100, 100, 100],
             "i": {"x": [0.42, 0.42, 0.42], "y": [1, 1, 1]},
             "o": {"x": [0.58, 0.58, 0.58], "y": [0, 0, 0]}},
            {"t": 60, "s": [85, 85, 100]}
          ]
        },
        "r": {"a": 0, "k": 0},
        "o": {"a": 0, "k": 100}
      },
      "ao": 0,
      "shapes": [...],
      "ip": 0, "op": 60, "st": 0, "bm": 0
    }
  ]
}
```

## Règles critiques de format (les 4 erreurs qui crashent lottie-web)

1. **Keyframes : format inline avec `s` ET `e` explicites** — chaque keyframe a sa valeur de départ ET de fin :
   ```json
   {"t": 0, "s": [85, 85], "e": [100, 100], "i": {...}, "o": {...}}
   ```
   PAS le format séquentiel `[{t:0,s:[85,85]}, {t:20,s:[100,100]}]` sans `e`.

2. **Bezier handles : arrays par dimension** — pour scale 3D `[x,y,z]`, donner 3 valeurs :
   ```json
   "i": {"x": [0.42, 0.42, 0.42], "y": [1, 1, 1]}
   ```
   Pour 2D : `[0.42, 0.42]` / `[1, 1]`. Une seule valeur `[0.42]` peut casser.

3. **Cohérence dimensionnelle** : si position est 3D `[60, 60, 0]`, alors scale aussi `[100, 100, 100]`. Mélanger 2D/3D crash.

4. **Shapes flat plutôt que groupes incomplets** : un `gr` (groupe) DOIT contenir un `"ty": "tr"` final (transform du groupe). Si tu oublies, lottie-web crash. Plus simple : ne pas utiliser `gr`, mettre fill directement après chaque shape :
   ```json
   "shapes": [
     {"ty": "el", "p": {...}, "s": {...}},
     {"ty": "fl", "c": {"a": 0, "k": [r,g,b,a]}, "o": {"a": 0, "k": 100}}
   ]
   ```

## Capacités Claude pour générer Lottie à la main

**Peut faire** :
- Primitives : rectangles, ellipses, étoiles/polygones (`ty: "sr"`), paths bezier <10 vertices
- Couleurs : plein, gradient linéaire/radial
- Strokes : largeur, dash, line cap/join
- Modifiers : trim path (draw-on), rounded corners, offset path
- Animations propriété : position, scale, rotation, opacité, couleur
- Easing avancé : bezier curves custom

**Ne peut pas (raisonnablement)** :
- Path bezier complexe >10 vertices (calcul tangentes I/O ingérable manuellement)
- Reproduction de logo réaliste sans outil SVG→Lottie
- Path morphing (vertices doivent matcher exactement)
- Systèmes de particules
- Effets visuels lourds (glow, distorsion) — renderer-dependent, souvent ignoré en headless

**Pour quoi utiliser** :
- Icônes géométriques simples (couronne, épée stylisée, flèche, bouclier, croissant)
- Animations de pulse, rotate, fade, slide, breathe
- Pulses d'écho (cercles concentriques)

**Pour quoi NE PAS utiliser** :
- Silhouettes de personnage → utiliser PixelLab ou Gemini
- Cartes géographiques → utiliser d3-geo
- Reproduction d'artwork existant → utiliser Lottie Creator (web GUI) ou télécharger LottieFiles

## Référence

Skill Wiggle (Claude Code skill pour générer Lottie) :
- `references/lottie_spec.md` : structure complète
- `references/detailed_examples.md` : recettes pulse, fade, draw-on
- `references/anti_patterns.md` : erreurs à éviter
- Cloné dans `/tmp/wiggle-claude-skill/` pour référence locale

## Why

Lottie est un format JSON très précis. lottie-web (le runtime) lance des exceptions synchrones non-typées quand le format est invalide, ce qui crash React au moment du `useState()` interne du composant. Le message d'erreur ne pointe jamais vers le vrai problème (le JSON malformé), seulement vers le hook React qui plante.

## How to apply

1. Toujours `require()` pour charger le JSON Lottie
2. Toujours valider le format en suivant les recettes Wiggle (skill cloné)
3. Pour icônes simples Atlas : générer à la main en suivant le canon
4. Pour animations complexes : télécharger LottieFiles ou Lottie Creator
