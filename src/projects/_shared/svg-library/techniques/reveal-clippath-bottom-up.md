# Révélation bas-vers-haut par clipPath

**Contexte** : faire "pousser" un élément SVG (arbre, bâtiment, trait) depuis le bas vers le haut, comme s'il sortait du sol.
**Coût visuel** : léger
**Compatibilité** : SVG inline dans Remotion (AbsoluteFill), PAS dans les CSS transitions

## Pattern de base

```tsx
// reveal-clippath-bottom-up.tsx
// Extrait de : B7MosaiqueFinal.tsx (GGW, 2026-06-25)
import { useCurrentFrame, spring, useVideoConfig } from "remotion";

const FPS = 30;

// Spring élastique : overshoot léger (damping bas) donne un effet "vivant"
function sprElastic(frame: number, delay: number) {
  return spring({
    frame: frame - delay,
    fps: FPS,
    config: { damping: 9, stiffness: 140, mass: 0.8 },
  });
}

export const RevealExample: React.FC = () => {
  const frame = useCurrentFrame();

  // Paramètres de l'élément à révéler
  const CLIP_TOP = 630;    // y du bord supérieur de l'élément (px, coordonnées viewBox)
  const CLIP_BOTTOM = 860; // y de la base de l'élément (ligne de sol)
  const TREE_DELAY = 90;   // frame de démarrage de la révélation

  // La révélation : le y du clipPath descend de CLIP_BOTTOM vers CLIP_TOP
  // spring() = 0 au départ, 1 à l'arrivée
  const revealProgress = sprElastic(frame, TREE_DELAY);
  const clipY = CLIP_BOTTOM - revealProgress * (CLIP_BOTTOM - CLIP_TOP);
  // clipY part de CLIP_BOTTOM (masque tout) et descend vers CLIP_TOP (révèle tout)

  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <defs>
        <clipPath id="clip-element">
          {/* Le rect masque tout ce qui est AU-DESSUS de clipY.
              x=-200 et width large pour ne jamais clipper horizontalement. */}
          <rect x={-200} y={clipY} width={1480} height={1920} />
        </clipPath>
      </defs>

      {/* L'élément est révélé progressivement de bas en haut */}
      <g clipPath="url(#clip-element)">
        {/* Ici : tronc, bâtiment, ou tout autre élément SVG vertical */}
        <path
          d="M 145 800 L 140 855 C 150 860, 160 860, 170 855 L 155 800"
          fill="#7a4a2a"
          stroke="#2b2117"
          strokeWidth={2.5}
        />
      </g>
    </svg>
  );
};
```

## Paramètres clés

| Paramètre | Valeur GGW | Effet si augmenté | Effet si diminué |
|-----------|------------|-------------------|------------------|
| `damping` | 9 | Moins de rebond, plus fluide | Plus de rebond/overshoot |
| `stiffness` | 140 | Révélation plus rapide | Révélation plus lente |
| `mass` | 0.8 | Plus lent, plus lourd | Plus rapide, plus léger |
| `TREE_DELAY` | 90 (frames) | Démarrage plus tardif | Démarrage plus tôt |
| `canopyExtraDelay` | +15 à +20f | Houppier décalé plus longtemps | Tronc et houppier presque simultanés |

## Variantes & extensions

- **Révélation du houppier séparée** : utiliser un deuxième clipPath avec `treeDelay + canopyExtraDelay` pour que le tronc apparaisse avant le feuillage (pattern exact GGW).
- **Révélation mi-hauteur (tronc seul)** : remplacer `CLIP_TOP` par `clipTop + (clipBottom - clipTop) * 0.5` pour que la révélation du tronc s'arrête à mi-hauteur de l'élément (le houppier est géré séparément).
- **Révélation lineaire (sans spring)** : utiliser `clampI(frame, [start, end], [CLIP_BOTTOM, CLIP_TOP])` pour une progression strictement linéaire, sans rebond.
- **Révélation droite-vers-gauche** : même logique avec un `<rect>` dont on anime la largeur (`width` de 0 → max) plutôt que le `y`.

## Pièges connus

- **Ne pas utiliser `scale()` pour révéler** : un `scaleY` sur l'élément entier fait "glisser" l'élément sur la scène et déforme les proportions. Le clipPath, lui, masque sans déformer. (Piège rencontré en GGW lors des premiers essais d'arbres.)
- **L'id du clipPath doit être unique** : dans une boucle sur plusieurs arbres, utiliser `clip-trunk-${id}` sinon tous les éléments partagent le même clip et se comportent de manière identique.
- **x={-200} et width={1480}** : le rect du clipPath doit déborder horizontalement pour ne jamais clipper les éléments larges (branches, feuillages). Ne pas mettre `x={0}`.
- **Coordonnées absolues** : `CLIP_TOP` et `CLIP_BOTTOM` sont des coordonnées dans le viewBox (pas en %). Extraire les vraies valeurs du SVG source — ne pas estimer.

## Liens

- Voir aussi : `../techniques/spring-elastique-overshoot.md` (la courbe spring qui pilote la révélation)
- Voir aussi : `../techniques/buvard-circulaire.md` (le clipPath circulaire, souvent combiné avec celui-ci)
- Éléments qui l'utilisent : B7MosaiqueFinal.tsx (composant `Tree`, clipPath tronc + houppier), B3Malentendu.tsx (`wallSweepClip` pour la muraille)
