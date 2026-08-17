# Tracé progressif par strokeDashoffset

**Contexte** : dessiner progressivement un trait SVG comme si une main le traçait en temps réel. Signature visuelle centrale du registre "encre narrative" GGW — utilisé sur les lignes d'horizon, les hachures de champs, les craquelures de sol, les racines.
**Coût visuel** : nul (attributs SVG purs)
**Compatibilité** : SVG inline dans Remotion (AbsoluteFill), PAS dans les CSS transitions

## Pattern de base

```tsx
// strokeDashoffset-drawing.tsx
// Extrait de : B7MosaiqueFinal.tsx et B3Malentendu.tsx (GGW, 2026-06-25)
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

function clampI(f: number, i: [number, number], o: [number, number]) {
  return interpolate(f, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// Valeur DASH sur-dimensionnée : couvre toute longueur de path possible sans mesure préalable.
// Le clamp empêche de dépasser 0.
const DASH = 4200;

export const DrawingExample: React.FC = () => {
  const frame = useCurrentFrame();

  // Timing : le tracé va de f226 à f290 (64 frames = ~2.1s)
  const START_FRAME = 226;
  const END_FRAME = 290;

  // hachuresProgress : 0 → 1 pendant l'animation
  const hachuresProgress = clampI(frame, [START_FRAME, END_FRAME], [0, 1]);

  // L'offset diminue de DASH → 0 : le trait se révèle de gauche à droite
  const hachOffset = (1 - hachuresProgress) * DASH;

  // Pour l'horizon (B3) : le tracé part de DASH et descend vers 0 en une seule étape
  const HORIZ_LEN = 1200; // longueur CONNUE du path (alternative à DASH)
  const horizonProgress = clampI(frame, [0, 45], [0, 1]);
  const horizonOffset = (1 - horizonProgress) * HORIZ_LEN;

  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      {/* Hachures de champs — DASH sur-dimensionné (longueur inconnue) */}
      <path
        d="M 100 970 L 350 1010 M 80 985 L 360 1030 M 60 1000 L 370 1050"
        fill="none"
        stroke="#c8dfc0"
        strokeWidth={5}
        strokeOpacity={hachuresProgress} // fade-in synchrone avec le tracé
        strokeDasharray={`${DASH}`}
        strokeDashoffset={hachOffset}
      />

      {/* Trait d'encre par-dessus (légèrement décalé pour suggérer la profondeur) */}
      <path
        d="M 100 970 L 350 1010 M 80 985 L 360 1030 M 60 1000 L 370 1050"
        fill="none"
        stroke="#2b2117"
        strokeWidth={1}
        strokeDasharray="5 5"
        strokeDashoffset={hachOffset * 0.9} // léger décalage : la couleur précède l'encre
      />

      {/* Ligne d'horizon — longueur connue (plus précis) */}
      <path
        d="M 0 830 Q 150 810 350 835 T 750 820 T 1080 835"
        fill="none"
        stroke="#2b2117"
        strokeWidth={1.5}
        strokeDasharray={`${HORIZ_LEN}`}
        strokeDashoffset={horizonOffset}
      />
    </svg>
  );
};
```

## Paramètres clés

| Paramètre | Valeur GGW | Effet si augmenté | Effet si diminué |
|-----------|------------|-------------------|------------------|
| `DASH` | 4200 | Pas d'effet (toujours ≥ longueur réelle) | Trait partiellement invisible même à 0% |
| Durée (`END - START`) | 45-90 frames | Tracé plus lent | Tracé plus sec/rapide |
| `strokeOpacity` synchrone | `hachuresProgress` | Combiné fade+tracé | Uniquement le tracé (pas de fade-in) |
| Décalage couleur/encre | `* 0.9` | Couleur en avance sur l'encre | Encre et couleur simultanées |

## Variantes & extensions

- **DASH fixe si longueur connue** : mesurer la longueur réelle avec `getTotalLength()` en développement, puis coder la valeur en dur. Plus précis que DASH=4200 mais nécessite une mesure.
- **Multi-traits à offsets décalés** : plusieurs paths avec `strokeDashoffset={hachOffset * 1.1}`, `* 0.9`, `* 1.3` pour un tracé en vague (les segments ne commencent pas exactement en même temps).
- **Tracé de droite à gauche** : inverser `strokeDashoffset` de 0 → DASH (mais le résultat visuel dépend du sens du path — tester).
- **Tracé en tirets** : combiner `strokeDasharray="12 8"` (tirets permanents) avec `strokeDashoffset` animé — les tirets apparaissent progressivement.
- **Racines** : B3Malentendu.tsx utilise `DASH=4200` sur des paths complexes (racines organiques) avec succès — la valeur sur-dimensionnée fonctionne même pour les paths courbes.

## Pièges connus

### ⛔⛔ Le dash pose sur le `<g>` PARENT n'atteint PAS les `<path>` enfants (2 occurrences)

`strokeDasharray` / `strokeDashoffset` poses sur un groupe **ne sont pas herites** par les enfants qui
portent deja leurs propres attributs de trait. Symptome : le trace apparait **complet des la 1re frame**,
aucune propagation — et le code a l'air juste.
**Mesure de diagnostic** : `pixels dont |delta| > 6` entre 2 frames rapprochees → **0** = rien ne bouge.
**Fix** : injecter les attributs **sur CHAQUE path**.
Vecu 2× : fissures de l'Acte 4C, puis flux de l'Acte 5 (Gazoduc, 2026-08-16/17).

### ⭐ Propagation en 2 VAGUES = ce qui fait lire "ca se propage" plutot que "ca se dessine"

Un reseau de fissures tracé d'un bloc se lit comme un dessin. Le decalage fait la propagation :
failles **maitresses** d'abord (traits epais), **ramifications** ensuite, avec chevauchement.
Ex. prouve (`GazoducActe5Faille.tsx`) : `crackMain` f26→96, `crackBranch` f46→110, 36 traces animes.
⚠️ Le **glow** doit etre un path DUPLIQUE portant le MEME dash — sinon la lueur precede la fissure.


- **`strokeDasharray` doit être une string** : `strokeDasharray={DASH}` (number) peut fonctionner selon le navigateur/moteur, mais `strokeDasharray={\`${DASH}\`}` (string) est la forme correcte et garantie en SVG.
- **`strokeDasharray` et `strokeDashoffset` sur un même élément** : les deux attributs sont nécessaires. `strokeDashoffset` seul sans `strokeDasharray` n'a aucun effet.
- **La valeur 0 de `strokeDashoffset` ne garantit pas l'affichage complet si DASH < longueur du path** : si le path mesure 5000px et que DASH=4200, une portion restera invisible. Toujours sur-dimensionner DASH.
- **Multiple paths dans un seul `<path d="...M...M...">` (compound path)** : `strokeDasharray` s'applique sur la longueur totale du path composite. Les tirets et l'offset se répartissent sur tous les sous-paths. Tester visuellement.
- **Ne jamais utiliser `CSS transition: stroke-dashoffset`** : interdit dans Remotion (headless render). Toujours passer par `interpolate()` frame-driven.

## Liens

- Voir aussi : `../techniques/spring-elastique-overshoot.md` (pour animer la révélation avec un rebond)
- Voir aussi : `../techniques/glow-pulse-sinusoidal.md` (autre technique d'animation continue)
- Éléments qui l'utilisent : B7MosaiqueFinal.tsx (hachures champs, horizon), B3Malentendu.tsx (dunes, ombre-muraille, craquelures), B4Demilune.tsx (cernes, racines, sol), GgwHookEncreVivant.tsx (fissures)
