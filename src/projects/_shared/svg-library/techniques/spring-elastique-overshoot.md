# Spring élastique avec overshoot

**Contexte** : animer l'apparition ou la croissance d'un élément avec un rebond naturel (dépassement puis stabilisation). Donne un caractère "vivant/organique" par opposition à une courbe linéaire ou un simple ease-out.
**Coût visuel** : nul (calcul pur, pas de filtre)
**Compatibilité** : Remotion `spring()` — frame-driven, compatible headless render

## Pattern de base

```tsx
// spring-elastique-overshoot.tsx
// Extrait de : B7MosaiqueFinal.tsx (GGW, 2026-06-25)
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const FPS = 30;

// Spring élastique : overshoot (dépassement) puis stabilisation
// config GGW validée pour les arbres et éléments organiques
function sprElastic(frame: number, delay: number) {
  return spring({
    frame: frame - delay,
    fps: FPS,
    config: {
      damping: 9,    // bas = beaucoup de rebond
      stiffness: 140, // élevé = ressort rigide, départ rapide
      mass: 0.8,     // léger = réponse rapide
    },
  });
}

// Spring doux : pas de rebond, pour la couleur ou l'opacité
function sprSmooth(frame: number, delay: number) {
  return spring({
    frame: frame - delay,
    fps: FPS,
    config: {
      damping: 20,   // élevé = amorti, pas de rebond
      stiffness: 80, // modéré = départ moins agressif
    },
  });
}

export const SpringExample: React.FC = () => {
  const frame = useCurrentFrame();

  // Arbre qui pousse avec overshoot élastique
  const TREE_DELAY = 90;
  const treeScale = sprElastic(frame, TREE_DELAY);
  // treeScale : 0 → ~1.08 (dépasse) → 1.0 (stabilise)

  // Couleur/opacité qui apparaît doucement (sans rebond)
  const COLOR_DELAY = 170;
  const colorOpacity = sprSmooth(frame, COLOR_DELAY);
  // colorOpacity : 0 → 1 (sans dépassement)

  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      {/* L'élément scale autour de son point de base (translate → scale → contenu) */}
      <g transform={`translate(540 1300) scale(${treeScale})`}>
        <circle cx={0} cy={-200} r={80} fill="#4a7c59" opacity={colorOpacity} />
        <rect x={-15} y={-100} width={30} height={100} fill="#7a4a2a" />
      </g>
    </svg>
  );
};
```

## Paramètres clés

| Paramètre | Valeur GGW élastique | Valeur GGW doux | Effet si augmenté | Effet si diminué |
|-----------|---------------------|-----------------|-------------------|------------------|
| `damping` | 9 | 20 | Moins de rebond | Plus de rebond |
| `stiffness` | 140 | 80 | Départ plus rapide, pic plus tôt | Départ plus lent |
| `mass` | 0.8 | (non spécifié = 1) | Plus lourd, plus lent | Plus léger, plus rapide |
| `delay` | 90-240f (par arbre) | 170-255f | Apparition plus tardive | Apparition plus tôt |

## Variantes & extensions

- **Spring pop pour UI** : `{ damping: 12, stiffness: 200, mass: 0.5 }` — apparition très rapide avec micro-rebond (boutons, labels, icônes).
- **Spring lourd pour objets inertes** : `{ damping: 14, stiffness: 80, mass: 1.2 }` — plus de latence, rebond modéré (coffres, lingots — mais attention : un objet inerte NE GLISSE PAS, seulement scale/fade).
- **Cascade d'arbres** : stocker les delays dans un tableau `treeDelays = [120, 240, 90, 198, 158]` et appeler `sprElastic(frame, treeDelays[i])` — chaque arbre pop indépendamment.
- **Spring sur une valeur quelconque** : multiplier le résultat du spring par n'importe quelle valeur finale. Ex : `const trunkRevealY = clipBottom - sprElastic(frame, delay) * (clipBottom - clipTop)`.

## Pièges connus

- **Double destructuration sur un seul `const`** : ce pattern TypeScript est invalide :
  ```tsx
  // INVALIDE — erreur TypeScript
  const { value, velocity } = spring({ frame, fps, config });
  ```
  `spring()` retourne un `number`, pas un objet. On appelle simplement `const val = spring(...)`.

- **`frame - delay` négatif** : quand `frame < delay`, `spring()` reçoit un frame négatif et retourne 0 — c'est le comportement voulu. Pas besoin de guard `if (frame < delay) return null`.

- **Ne pas utiliser `spring()` pour la couleur** : `sprSmooth` (damping élevé) convient pour l'opacité. Pour les transitions de couleur, préférer `clampI(frame, [start, end], [0, 1])` puis interpolation RGB manuelle.

- **`durationInFrames` dans spring** : ce paramètre optionnel coupe la simulation spring après N frames. Utile pour garantir que le spring est terminé avant un certain timing. GGW ne l'utilise pas sur les arbres (le spring se stabilise naturellement en ~30-40f).

## Liens

- Voir aussi : `../techniques/reveal-clippath-bottom-up.md` (le spring pilote la valeur `y` du clipPath)
- Voir aussi : `../techniques/sway-houppier.md` (le sway utilise `Math.sin`, pas spring)
- Éléments qui l'utilisent : B7MosaiqueFinal.tsx (`sprElastic`, `sprSmooth`), B3Malentendu.tsx (`treePop`), B4Demilune.tsx (`openStumpPop`, `shootGrow`), B5LaPreuve.tsx (`treePop`)
