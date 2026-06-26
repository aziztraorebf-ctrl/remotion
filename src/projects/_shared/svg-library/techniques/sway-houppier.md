# Balancement de feuillage (sway sinusoïdal)

**Contexte** : faire osciller le feuillage d'un arbre comme sous l'effet du vent, de façon indépendante pour chaque arbre. La rotation s'applique UNIQUEMENT au groupe houppier (pas au tronc), avec un `transform-origin` au pied du houppier (jonction tronc/houppier).
**Coût visuel** : léger
**Compatibilité** : SVG transform + Remotion frame-driven

## Pattern de base

```tsx
// sway-houppier.tsx
// Extrait de : B7MosaiqueFinal.tsx (GGW, 2026-06-25)
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

function clampI(f: number, i: [number, number], o: [number, number]) {
  return interpolate(f, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

export const SwayExample: React.FC = () => {
  const frame = useCurrentFrame();

  // --- Configuration de chaque arbre ---
  // Amplitude max (degrés) : variation subtile entre arbres
  const swayAmps = [1.3, 1.7, 0.9, 1.4, 1.1];
  // Phase individuelle : décale le départ du sinus pour désynchroniser les arbres
  const swayPhases = [0, 14, 8, 22, 37];
  // Frame de démarrage du tronc (le sway démarre ~40f après l'apparition)
  const treeDelays = [120, 240, 90, 198, 158];

  // Calculer l'angle de sway pour l'arbre i
  const getSwayAngle = (i: number): number => {
    const swayStart = treeDelays[i] + 40; // démarre 40f après le pop
    // Fade-in progressif de l'amplitude (0 → 1 en 25 frames)
    const swayInt = clampI(frame, [swayStart, swayStart + 25], [0, 1]);
    // Sinus sur une période ~2.8s (28 frames = période courte, vent vif)
    return swayInt * swayAmps[i] * Math.sin((frame + swayPhases[i]) / 28);
  };

  // Exemple pour l'arbre 0 (gauche), centre houppier à (150, 725)
  const swayAngle = getSwayAngle(0);
  const CANOPY_CX = 150; // centre du houppier = pivot de rotation
  const CANOPY_CY = 725;

  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      {/* Tronc : PAS de rotation (ancré au sol, fixe) */}
      <path
        d="M 145 800 L 140 855 C 150 860, 160 860, 170 855 L 155 800"
        fill="#7a4a2a"
        stroke="#2b2117"
        strokeWidth={2.5}
      />

      {/* Houppier : rotation autour du centre du houppier.
          SVG transform rotate(angle, cx, cy) est le pivot de rotation.
          Le point (cx, cy) doit être la JONCTION tronc/houppier, pas le centre visuel. */}
      <g transform={`rotate(${swayAngle}, ${CANOPY_CX}, ${CANOPY_CY})`}>
        {/* Contenu du houppier (forme + détails) */}
        <path
          d="M 70 740 C 70 670, 110 630, 150 630 C 190 630, 230 670, 230 740 C 230 800, 190 820, 150 820 C 110 820, 70 800, 70 740 Z"
          fill="none"
          stroke="#2b2117"
          strokeWidth={3}
        />
      </g>
    </svg>
  );
};
```

## Paramètres clés

| Paramètre | Valeur GGW | Effet si augmenté | Effet si diminué |
|-----------|------------|-------------------|------------------|
| `swayAmps` | 0.9 à 1.7° | Balancement plus ample (vent fort) | Balancement très subtil |
| Période (`/ 28`) | 28 frames = 0.93s | Balancement plus lent | Balancement plus rapide (frénétique) |
| `swayPhases` | 0, 14, 8, 22, 37 | Désynchronisation plus marquée | Tous les arbres en phase (mécanique) |
| `swayInt` durée | 25 frames | Fade-in plus long | Sway qui démarre brusquement |
| Décalage après pop | +40 frames | Sway démarre après que l'arbre soit bien établi | Sway démarre dès le pop |

## Variantes & extensions

- **Sway sur une tige de plante** : même pattern, mais avec `transform-origin` à la base de la tige `(x_base, y_base)` et amplitude plus grande (3-6°).
- **Sway asynchrone avec drift** : `Math.sin(frame / 28 + phase) + 0.3 * Math.sin(frame / 17 + phase * 1.4)` — superposition de deux fréquences pour un mouvement moins régulier.
- **Sway activé/désactivé** : multiplier `swayAngle` par `clampI(frame, [windStart, windStart+30], [0, 1])` pour déclencher le vent à un moment précis du script.
- **Sway tronc + houppier couplés** : pour un balancement de l'arbre entier (ex : tempête), utiliser une rotation plus ample sur l'ensemble, avec un pivot au pied du tronc. À réserver aux effets dramatiques — en GGW le tronc reste toujours fixe.

## Pièges connus

- **Rotation sur le mauvais groupe** : si le `<g transform="rotate(...)">` enveloppe le tronc ET le houppier, l'arbre entier tourne autour du pivot — résultat : l'arbre "glisse" hors de sa base, laissant un "trou" dans la composition. Toujours séparer le groupe tronc (fixe) du groupe houppier (rotatif).

- **Pivot `(cx, cy)` mal placé** : `rotate(angle, cx, cy)` en SVG fait pivoter autour du point `(cx, cy)`. Si `cy` correspond au centre visuel du houppier plutôt qu'à sa base (jonction avec le tronc), le houppier pivote autour de son propre centre au lieu de se balancer comme une branche. Dans GGW, `canopyCx/canopyCy` sont les coordonnées du centre du houppier — à vérifier visuellement pour chaque arbre.

- **Désynchronisation insuffisante** : sans `swayPhases` distincts, tous les arbres bougent en même temps — effet de "windshield wiper" mécanique. Les phases `[0, 14, 8, 22, 37]` (différences d'au moins 6 frames entre arbres proches) donnent un résultat naturel.

- **Amplitude trop grande** : au-delà de ~3-4°, le balancement d'un arbre SVG encre devient clairement irréel (les arbres ne penchent pas autant). GGW reste entre 0.9° et 1.7°.

- **`transform-origin` CSS vs SVG** : le `style={{ transformOrigin: "cx cy" }}` CSS et le `rotate(angle, cx, cy)` SVG ne se comportent pas de la même façon en rendu headless. Utiliser **exclusivement** le `rotate(angle, cx, cy)` dans l'attribut `transform` SVG pour garantir la cohérence.

## Liens

- Voir aussi : `../techniques/spring-elastique-overshoot.md` (pour l'apparition initiale du houppier)
- Voir aussi : `../techniques/glow-pulse-sinusoidal.md` (autre usage de `Math.sin` continu)
- Éléments qui l'utilisent : B7MosaiqueFinal.tsx (composant `Tree`, `swayAngle` + `swayAmps` + `swayPhases`), B4Demilune.tsx (`SproutLeaves` sway), B5LaPreuve.tsx (`leafSway * t.sway`)
