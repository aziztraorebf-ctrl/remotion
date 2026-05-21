---
name: "Atlas — Pattern Spotlight Insert (3e mode entre overlay et fullscreen)"
description: "Pattern visuel signature inventé sur Empire Ghana Beat 1 v4. Background dim sur la carte + cartouche centré ornementé avec asset PixelLab + texte court. Préserve continuité narrative carte + focus visuel sur l'objet narratif."
type: feedback
---

# Pattern Spotlight Insert — Atlas

> Inventé et validé sur Empire Ghana Beat 1 v4 (2026-05-03). Mode visuel entre l'overlay simple (Shaka Zulu) et l'insert plein écran (Mansa Moussa V2).
>
> **Reusable cross-épisodes Atlas.** Recommandé chaque fois qu'on doit montrer un objet/concept symbolique sans interrompre la scène carte.

## Concept

Au lieu de :
- **Overlay simple** : élément flotte par-dessus la carte (Shaka Zulu) → peu d'impact visuel
- **Insert plein écran** : bascule complète vers nouvelle scène (Mansa Moussa) → coupe la continuité

Le **spotlight insert** combine les deux :
- La carte reste visible mais s'assombrit (dim 0.55)
- Un cartouche stylisé centré apparaît avec asset PixelLab + texte court
- Le spectateur voit toujours **où** on parle (la carte) tout en focalisant sur **quoi** (l'objet narratif)

## Pourquoi c'est mieux

- **Continuité narrative préservée** : pas de cut, l'œil sait où on est
- **Focus visuel fort** : le dim background isole le cartouche
- **Plus rapide à produire** que insert plein écran (réutilise la scène carte sous-jacente)
- **Plus signature/cinématographique** que les deux modes existants
- **Asset PixelLab haute qualité** intégré naturellement (vs Lottie limité)

## Pattern technique (référence Beat 1 v4)

```tsx
{localFrame >= TRIGGER_FRAME && opacity > 0.01 && (
  <>
    {/* Background dim */}
    <rect
      x="0" y="0" width="720" height="1280"
      fill={GHANA_PALETTE.NOIR_PROFOND}
      opacity={dimOpacity}  // 0.55 plateau
      pointerEvents="none"
    />

    {/* Cartouche stylisé centré */}
    <g
      transform={`translate(360 640) scale(${0.85 + 0.15 * springT})`}
      opacity={fadeOpacity}
    >
      {/* Halo doré radial derrière */}
      <circle cx="0" cy="0" r="280" fill="url(#spotlightGlow)" />

      {/* Boîte parchemin double bordure */}
      <rect x="-260" y="-150" width="520" height="300"
        fill={PARCHEMIN} stroke={OR} strokeWidth="4" rx="10" />
      <rect x="-250" y="-140" width="500" height="280"
        fill="none" stroke={BORDEAUX_PROFOND} strokeWidth="1.5" rx="6" opacity="0.75" />

      {/* Asset PixelLab gauche + texte */}
      <image href={staticFile("...sac-sel.png")} x="-200" y="-100" width="140" height="140"
        style={{ imageRendering: "pixelated" }} />
      <text x="-130" y="62" textAnchor="middle"
        fontFamily={CINZEL} fontSize="32" fontWeight="700"
        fill={BORDEAUX_PROFOND} letterSpacing="3">SEL</text>

      {/* Symbole central (équivalence/relation) */}
      <text x="0" y="0" textAnchor="middle" fontSize="56" fill={OR_VIF}>⇌</text>

      {/* Asset PixelLab droite + texte */}
      <image href={staticFile("...sac-or.png")} x="60" y="-100" width="140" height="140" />
      <text x="130" y="62" textAnchor="middle"
        fontFamily={CINZEL} fontSize="32" fontWeight="700"
        fill={BORDEAUX_PROFOND} letterSpacing="3">OR</text>

      {/* Sous-titre italique */}
      <text x="0" y="115" textAnchor="middle"
        fontFamily={SERIF} fontSize="20" fontStyle="italic"
        fill={OR_TERNI}>la richesse du Sahara</text>
    </g>
  </>
)}
```

## Définitions clés

```tsx
// Spring entrance
const springT = spring({
  frame: localFrame - TRIGGER_FRAME, fps,
  config: { damping: 16, stiffness: 100 }
});

// Opacity in/out
const opacity = interpolate(localFrame,
  [TRIGGER, TRIGGER + 8, OUT - 12, OUT],
  [0, 1, 1, 0],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);

// Dim background plateau
const dimOpacity = interpolate(localFrame,
  [TRIGGER, TRIGGER + 12, OUT - 12, OUT],
  [0, 0.55, 0.55, 0],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);

// Defs SVG nécessaire
<radialGradient id="spotlightGlow" cx="50%" cy="50%" r="50%">
  <stop offset="0%" stopColor={OR_VIF} stopOpacity="0.5" />
  <stop offset="70%" stopColor={OR} stopOpacity="0.15" />
  <stop offset="100%" stopColor="transparent" />
</radialGradient>
```

## Quand utiliser

**OUI spotlight insert** :
- Symbolisation d'un échange (sel ⇌ or, paix ⇌ guerre)
- Présentation d'un objet symbolique (couronne, sceau, lingot)
- Mise en avant d'une comparaison visuelle simple (2 éléments côte à côte)
- Moment narratif clé qui demande un focus mais pas une coupure complète
- Toute donnée visuelle qui mérite d'être **vue clairement** sans perdre le contexte cartographique

**NON spotlight insert** (préférer fullscreen) :
- Data viz complexe (PieChart, BarChart, LineChart) → fullscreen Mansa Moussa
- Citation longue ou texte dense
- Bascule narrative majeure (changement d'acte, retournement)
- Quand on veut effacer complètement la carte pour une emphase totale

**NON spotlight insert** (préférer overlay simple) :
- Petit pulse sur un POI (utiliser AtlasPulseMarker)
- Apparition de label ville (utiliser AtlasLabel)
- Cartouche texte simple sans asset (utiliser AtlasCartouche standard)

## Combinaisons possibles

- **2 assets côte à côte avec symbole central** (validé Beat 1 : sel ⇌ or)
- **1 asset central avec halo** (objet sacré : sceau, couronne)
- **3 assets en triangle** (trois éléments d'une triade narrative)
- **1 asset + chiffre choc** (asset gauche, "90 kg" droite)

## Durée recommandée

- Entrance : 8 frames
- Plateau : 60-80 frames (~2-2.7s)
- Exit : 12 frames
- **Total : ~80-100 frames** (~2.7-3.3s)

Plus court = lecture trop rapide. Plus long = devient un insert et perd l'avantage continuité.

## Why ça marche

L'œil humain a deux niveaux de focus :
1. **Carte de fond** (peripheral attention) → contexte spatial
2. **Cartouche centré + asset PixelLab** (foveal attention) → narratif principal

Le dim 0.55 force le contraste sans cacher la carte. Le halo radial doré attire le regard. Les assets PixelLab détaillés (pas géométriques) donnent une qualité premium impossible avec Lottie/SVG simple.

## How to apply

À la prochaine scène Atlas (n'importe quel épisode) :
1. Identifier le moment narratif qui mérite spotlight (richesse, victoire, mort, échange)
2. Décider 1-3 assets PixelLab nécessaires (générer si pas en bibliothèque)
3. Copier le pattern technique ci-dessus
4. Adapter palette (couleurs cartouche/halo) à l'identité visuelle de l'épisode
5. Trigger à un mot-pivot précis du script (utiliser `findWord()` du timing)
