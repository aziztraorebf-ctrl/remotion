# Buvard circulaire (révélation de couleur par cercle croissant)

**Contexte** : faire "s'étaler" une couleur depuis un point central, comme de l'encre sur du buvard. Utilisé pour coloriser le feuillage d'un arbre qui "prend vie", ou tout changement de couleur organique.
**Coût visuel** : léger
**Compatibilité** : SVG inline dans Remotion (AbsoluteFill), PAS dans les CSS transitions

## Pattern de base

```tsx
// buvard-circulaire.tsx
// Extrait de : B7MosaiqueFinal.tsx (GGW, 2026-06-25)
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

function clampI(f: number, i: [number, number], o: [number, number]) {
  return interpolate(f, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export const BuvardExample: React.FC = () => {
  const frame = useCurrentFrame();

  // Paramètres du buvard — À EXTRAIRE du SVG source, jamais à estimer
  const CANOPY_CX = 150;  // centre x du houppier (coordonnées viewBox)
  const CANOPY_CY = 725;  // centre y du houppier
  const CANOPY_MAX_R = 110; // rayon max pour couvrir TOUT le houppier (mesurer le path)

  // Timing : démarre à COLOR_DELAY, atteint le max en 45 frames (~1.5s à 30fps)
  const COLOR_DELAY = 170; // frame de déclenchement (ex : au mot "mosaïque" dans le script)
  const buvardR = clampI(frame, [COLOR_DELAY, COLOR_DELAY + 45], [0, CANOPY_MAX_R]);

  // Path du houppier (identique à celui utilisé pour le fill couleur ET pour le clipPath de révélation)
  const CANOPY_PATH = "M 70 740 C 70 670, 110 630, 150 630 C 190 630, 230 670, 230 740 C 230 800, 190 820, 150 820 C 110 820, 70 800, 70 740 Z";

  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <defs>
        {/* Le clipPath buvard : un cercle qui grandit depuis le centre du houppier */}
        <clipPath id="clip-buvard-a1">
          <circle cx={CANOPY_CX} cy={CANOPY_CY} r={buvardR} />
        </clipPath>
      </defs>

      {/* Houppier en couleur, clipé par le cercle croissant.
          Le clipPath de révélation haut-bas (reveal-clippath-bottom-up) ENVELOPPE ce groupe. */}
      <g clipPath="url(#clip-buvard-a1)">
        <path d={CANOPY_PATH} fill="#4a7c59" />
      </g>

      {/* Le dessin en encre du houppier s'affiche PAR-DESSUS (pas de clipPath sur lui) */}
      <path d={CANOPY_PATH} fill="none" stroke="#2b2117" strokeWidth={3} />
    </svg>
  );
};
```

## Paramètres clés

| Paramètre | Valeur GGW | Effet si augmenté | Effet si diminué |
|-----------|------------|-------------------|------------------|
| `CANOPY_MAX_R` | 60 à 175 (selon arbre) | Couvre plus de surface | Ne couvre pas tout le houppier (bord encre visible) |
| Durée (`COLOR_DELAY + 45`) | 45 frames = 1.5s | Étalement plus lent | Étalement plus sec/rapide |
| `COLOR_DELAY` | 170-215f (décalé par arbre) | Démarrage plus tardif | Tous les arbres se colorent en même temps |

## Variantes & extensions

- **Buvard avec plusieurs centres** : utiliser un `<mask>` avec plusieurs `<circle>` pour simuler plusieurs points d'infiltration simultanés (ex : maladie qui se propage).
- **Buvard ovale** : remplacer `<circle r={r}>` par `<ellipse rx={r} ry={r * 0.7}>` pour une forme plus naturelle (infiltration dans le sens du grain du bois).
- **Buvard en deux couches** : superposer un buvard couleur-1 (clair) suivi d'un buvard couleur-2 (profond) décalé de 20-30f — effet de profondeur progressive du verdissement.
- **Désaturation inverse** : partir d'une couleur vive (`r=maxR`) et réduire `r` vers 0 pour faire "disparaître" la couleur (oxydation, dessèchement).

## Pièges connus

- **Estimer cx/cy au lieu d'extraire les vrais** : si le centre du buvard ne correspond pas au centre visuel du houppier, la couleur commence à se répandre depuis un coin — résultat bizarre. Toujours mesurer `cx/cy` dans le SVG source ou calculer depuis le bounding box du path.
- **`CANOPY_MAX_R` trop petit** : si le rayon max ne couvre pas le path entier, des zones restent en encre même quand `buvardR = CANOPY_MAX_R`. Ajouter 10-15% de marge.
- **Ordre des couches** : le groupe avec le clipPath buvard doit être SOUS le dessin en encre (contour), sinon la couleur recouvre le trait d'encre.
- **Deux clipPaths imbriqués** : dans GGW, le buvard est imbriqué DANS le clipPath de révélation bas-vers-haut. L'ordre est : `<g clipPath="reveal"><g clipPath="buvard"><path fill="vert"/></g></g>`. Ne pas inverser l'ordre.
- **Id unique obligatoire** : avec plusieurs arbres en boucle, utiliser `clip-buvard-${id}` — sinon tous les cercles partagent le même rayon.

## Liens

- Voir aussi : `../techniques/reveal-clippath-bottom-up.md` (le clipPath de révélation qui enveloppe le buvard)
- Éléments qui l'utilisent : B7MosaiqueFinal.tsx (composant `Tree`, propriété `canopyCx/canopyCy/canopyMaxR`)
