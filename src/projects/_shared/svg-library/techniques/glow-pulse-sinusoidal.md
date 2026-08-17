# Pulsation sinusoïdale (glow / respiration)

**Contexte** : faire "respirer" un élément graphique en continu — soleil, halo, bouton actif, signal lumineux. L'élément oscille doucement entre deux états sans jamais s'arrêter, créant une sensation de vie permanente.
**Coût visuel** : léger à moyen selon le `filter: blur` associé
**Compatibilité** : Remotion frame-driven pur — compatible headless render

## Pattern de base

```tsx
// glow-pulse-sinusoidal.tsx
// Extrait de : B7MosaiqueFinal.tsx (GGW, 2026-06-25)
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

const FPS = 30;

export const GlowPulseExample: React.FC = () => {
  const frame = useCurrentFrame();

  // Cycle de 2.2 secondes = 66 frames à 30fps
  // Résultat : valeur oscillant entre 0 et 1
  const PERIOD = 2.2; // secondes
  const sunPulse = 0.5 + 0.5 * Math.sin((frame / FPS) * (2 * Math.PI / PERIOD));
  // sunPulse : 0.0 → 1.0 → 0.0 → ... (sinusoïde centrée en 0.5)

  // Rayon du halo : oscille entre 72 et 86px
  const glowR = 72 + sunPulse * 14;
  // Opacité du halo : oscille entre 0.18 et 0.32
  const glowOpacity = 0.18 + sunPulse * 0.14;

  // Rayons oscillants — déphasés par rayon pour un effet moins mécanique
  const PERIOD_RAYS = 1.8; // secondes
  const rayOscil = Math.sin((frame / FPS) * (2 * Math.PI / PERIOD_RAYS));
  // rayExtra : -6 → +6

  return (
    <svg viewBox="0 0 1080 1920" width="100%" height="100%">
      <g transform="translate(540,200)">
        {/* Halo externe qui respire */}
        <circle
          cx={0}
          cy={0}
          r={glowR}
          fill="#f5c842"
          fillOpacity={glowOpacity}
        />
        {/* Halo intermédiaire (cycle légèrement décalé via le * 0.6) */}
        <circle
          cx={0}
          cy={0}
          r={64 + sunPulse * 6}
          fill="#f5c842"
          fillOpacity={glowOpacity * 0.6}
        />
        {/* Corps du soleil — stable, ne pulse pas */}
        <circle
          cx={0}
          cy={0}
          r={60}
          fill="#f5c842"
          fillOpacity={0.88}
          stroke="#2b2117"
          strokeWidth={2}
        />
        {/* Rayons oscillants : longueur variable + déphasage par rayon */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const r1 = 68;
          // Rayons alternés longs/courts + oscillation déphasée par index
          const baseLen = i % 2 === 0 ? 22 : 12;
          const phase = Math.sin(((frame / FPS) * (2 * Math.PI / PERIOD_RAYS)) + i * 0.5);
          const r2 = r1 + baseLen + phase * 5;
          const w = i % 2 === 0 ? 2 : 1.5;
          return (
            <line
              key={i}
              x1={r1 * Math.cos(a)} y1={r1 * Math.sin(a)}
              x2={r2 * Math.cos(a)} y2={r2 * Math.sin(a)}
              stroke="#2b2117"
              strokeWidth={w}
              strokeLinecap="round"
            />
          );
        })}
      </g>
    </svg>
  );
};
```

## Paramètres clés

| Paramètre | Valeur GGW | Effet si augmenté | Effet si diminué |
|-----------|------------|-------------------|------------------|
| `PERIOD` | 2.2s (halo) | Respiration plus lente | Respiration plus rapide (peut devenir stroboscopique) |
| `PERIOD_RAYS` | 1.8s (rayons) | Vibration plus lente | Vibration plus rapide |
| Amplitude rayon `* 14` | 14px | Variation de rayon plus grande | Variation plus subtile |
| Amplitude opacité `* 0.14` | 0.14 | Halo plus flashant | Halo plus stable |
| Déphasage par rayon `i * 0.5` | 0.5 | Rayons plus désynchronisés | Rayons presque synchrones (mécanique) |

## Variantes & extensions

- **Pulsation sur un `radialGradient`** : animer le `r` du gradient via `sunPulse` plutôt que directement le rayon du cercle — effet de chaleur irradiante plus profond.
- **Pulsation combinée à `filter: blur`** : dans GgwHookEncreVivant.tsx, le glow est rendu avec `style={{ filter: "blur(46px)" }}` pour un halo doux. Attention : `filter` alourdit le render headless.
- **Double période** : combiner deux `Math.sin` à des périodes différentes (ex : 2.2s et 3.7s) pour un battement irrégulier, plus organique.
- **Pulsation d'opacité simple** : pour un élément qui "clignote" discrètement, utiliser uniquement `opacity={0.6 + 0.4 * sunPulse}` sans modifier les dimensions.
- **Respiration synchronisée à l'audio** : si la narration a un rythme régulier, aligner `PERIOD` sur ce rythme (ex : phrase de 3s → `PERIOD = 3`).

## Pièges connus

- **`Math.sin()` retourne des valeurs entre -1 et 1** : la formule `0.5 + 0.5 * Math.sin(...)` normalise vers [0, 1]. Sans le `0.5 + 0.5 *`, le rayon ou l'opacité peuvent devenir négatifs.
- **Stroboscope** : une période trop courte (< 0.5s) crée un effet de scintillement désagréable. Maintenir `PERIOD >= 1.5s` pour les éléments d'interface.
- **`filter: blur` + render headless** : le blur SVG est rendu correctement mais peut ralentir le render Remotion. Tester la frame rate avant de multiplier les glows floutés.
- **Ne pas mélanger `filter: blur` SVG et `style={{ filter: "blur()" }}`** : les deux fonctionnent mais les comportements peuvent différer entre navigateur et rendu headless Remotion. Choisir l'un ou l'autre et tester.
- **Ne pas utiliser `@keyframes` ou `animation` CSS** : interdit dans Remotion. Toujours `frame / FPS` dans le `Math.sin`.

## Liens

- Voir aussi : `../techniques/sway-houppier.md` (autre usage de `Math.sin` pour un mouvement)
- Voir aussi : `../techniques/strokeDashoffset-drawing.md` (autre technique d'animation continue)
- Éléments qui l'utilisent : B7MosaiqueFinal.tsx (soleil `sunPulse`, `glowR`, `glowOpacity`), B4Demilune.tsx (`sunHaloR`, `rayPulse`), B5LaPreuve.tsx (`haloR`, `rayLen`), GgwHookEncreVivant.tsx (glow ardent avec `filter: blur`)

---

## ⛔ PIEGE MESURE — une opacite qui oscille AUTOUR de 1 est VISUELLEMENT MORTE (2026-08-17)

L'opacite SVG est **plafonnee a 1**. Une pulsation ecrite `1 + sin(...) * 0.16` passe donc la moitie du
temps au-dessus du plafond et le reste imperceptiblement sous : **mesure = 0 pixel change entre 2 frames.**
✅ **Osciller SOUS 1** : `0.74 + sin(f*0.09)*0.20 + sin(f*0.043+1.9)*0.06` → **79 717 pixels** changent.
⭐ Deux sinusoides a periodes **non harmoniques** (0.09/0.043) donnent un battement irregulier, vivant —
une seule sinusoide fait "clignotant". Cas prouve : lueur de braises dans les fissures,
`GazoducActe5Faille.tsx` (Gazoduc Acte 5, monte dans le FINAL).
