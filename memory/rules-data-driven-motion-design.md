# Data-Driven Motion Design — Techniques Souverain

> Fiche de référence. Consulter AVANT de coder toute scène de comparaison chiffrée.
> Validé sur : Beat4Prix (Silicon Savannah — M-PESA frais, 26s, 2026-05-15)

---

## Qu'est-ce que le Data-Driven Motion Design ?

C'est une discipline où le mouvement **sert la compréhension du chiffre**, pas la décoration.
Chaque animation a une raison narrative : elle aide l'œil à mesurer, comparer, ressentir l'inégalité.

Ce n'est PAS :
- Des particules qui bougent parce que c'est beau
- Des transitions pour remplir le temps mort
- Du graphisme qui existe indépendamment de la narration

C'est :
- Le chiffre qui monte **pendant que la voix le dit**
- La barre qui s'arrête **au moment exact où l'inégalité est nommée**
- Le fond qui change de couleur **quand le verdict tombe**

---

## Les 8 techniques — catalogue de référence

### T1 — Narration-Synced Reveal (obligatoire)

**Principe :** chaque élément visuel apparaît au frame exact où la voix le nomme.

**Pourquoi ça marche :** le cerveau traite audio + visuel simultanément. Quand les deux se rejoignent au même instant, la compréhension est immédiate et la rétention maximale.

**Implémentation :**
```ts
// Dans le manifest — frames calés sur alignment Whisper
export const SEG = {
  sh200: 97,   // mot "200" dans la narration
  sh50k: 279,  // mot "50 000"
  meme:  476,  // mot "Même service"
};

// Dans le composant
<BarCol appearFrame={M.SEG.sh200} ... />
```

**Règle :** ne jamais hardcoder une frame sans la relier à un mot dans l'alignment. Utiliser Whisper word-level si possible.

---

### T2 — Asymmetric Bar Comparison (structure)

**Principe :** deux barres sur un axe commun, proportionnelles aux vrais chiffres, pas décoratives.

**Pourquoi ça marche :** le cerveau compare les longueurs avant même de lire les chiffres. L'inégalité est *visible* avant d'être *lue*.

**Implémentation :**
```ts
// barRatio = ratio réel entre les deux valeurs
// barre rouge (5%) : barRatio=1.0 → occupe 100% de sa zone
// barre verte (0.22%) : barRatio=0.05 → occupe 5% de sa zone (0.22/5 ≈ 0.044)
<BarCol barRatio={1.0} color={RED} ... />   // pauvre — plein
<BarCol barRatio={0.05} color={GREEN} ... /> // riche — minuscule
```

**Règle :** les ratios doivent être mathématiquement corrects. Jamais estimer visuellement.

---

### T3 — Counter Animation (montée du chiffre)

**Principe :** le chiffre affiché monte de 0 à la valeur finale pendant que la barre se remplit.

**Pourquoi ça marche :** la montée progressive crée une anticipation. Le spectateur "ressent" arriver à 5%. Un chiffre statique qui apparaît n'a pas cet effet.

**Implémentation :**
```ts
function useCounter(frame: number, appearFrame: number, target: number, decimals: number) {
  const progress = interpolate(frame, [appearFrame, appearFrame + BAR_DURATION + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (progress * target).toFixed(decimals);
}
```

**Variante :** pour les valeurs < 1 (ex: 0,22%), utiliser `pctDecimals=2` pour garder la précision visible pendant la montée.

---

### T4 — Easing Convexe sur les barres

**Principe :** la barre démarre vite et ralentit à l'arrivée (`Math.pow(progress, 0.7)`).

**Pourquoi ça marche :** l'easing convexe (vs linéaire) donne l'impression que la barre "s'installe" plutôt que de s'arrêter brutalement. C'est plus naturel et plus premium.

**Implémentation :**
```ts
const rawProg = interpolate(frame, [appearFrame, appearFrame + BAR_DURATION], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
});
const barWidth = Math.pow(rawProg, 0.7) * 100; // convexe : démarre vite, ralentit
```

**Ne pas utiliser :** `Math.pow(p, 2)` (concave — trop lent au départ, trop abrupt à l'arrivée).

---

### T5 — Permanent Motion Anchor (pivot central)

**Principe :** un élément central ne s'arrête jamais de bouger — ici la pièce qui flotte + ping ring.

**Pourquoi ça marche :** sur une scène de 26s avec des moments de silence visuel (entre les apparitions de barres), l'œil doit avoir quelque chose à regarder. L'ancre évite l'impression de "frame figée".

**Implémentation :**
```ts
// Float sinusoïdal
const coinFloat = Math.sin((frame / 110) * Math.PI * 2) * 6; // ±6px, cycle ~3.7s

// Ping ring expansif
const pingCycle = frame % 50;
const pingRingScale   = interpolate(pingCycle, [0, 49], [0.9, 2.4]);
const pingRingOpacity = interpolate(pingCycle, [0, 20, 49], [0.5, 0.25, 0]);

// Glow oscillant
const coinGlowRadius = interpolate(Math.sin(frame / 9), [-1, 1], [20, 80]);
```

**Règle :** le permanent motion doit être subtil (amplitude ≤ 10px, pas de rotation). Il accompagne, il ne distrait pas.

---

### T6 — Progressive Background State Change (ambiance = sens)

**Principe :** le fond change subtilement de couleur au moment où le sens de la scène bascule.

**Pourquoi ça marche :** le spectateur ressent le changement d'atmosphère avant de le lire. La couleur porte le message émotionnel avant le texte.

**Implémentation :**
```ts
// Fond rougit légèrement au verdict (opacity 0→0.08 en 30f)
const bgRedOpacity = interpolate(frame, [M.SEG.meme, M.SEG.meme + 30], [0, 0.08], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
});

// Superposé comme AbsoluteFill avec pointerEvents:none
<AbsoluteFill style={{ background: RED, opacity: bgRedOpacity, pointerEvents: "none" }} />
```

**Valeurs testées :** opacity max 0.08-0.12 pour rester subtil. Au-delà = trop lourd.

---

### T7 — Verdict Impact (conclusion physique)

**Principe :** le verdict n'arrive pas — il s'impose. Spring depuis le bas + vibration initiale + glow pulsant.

**Pourquoi ça marche :** la conclusion doit avoir un poids physique. Le spectateur doit sentir que quelque chose vient de tomber, pas simplement apparaître.

**Implémentation :**
```ts
// Entry spring
const verdictSpring = spring({ frame: frame - M.SEG.meme, fps,
  config: { damping: 12, stiffness: 100 }, durationInFrames: 35 });
const verdictSlide = interpolate(verdictSpring, [0, 1], [80, 0]);

// Vibration initiale (20f)
const verdictVibrate = (frame >= M.SEG.meme && frame < M.SEG.meme + 20)
  ? Math.sin((frame - M.SEG.meme) * 2.5) * 1.5 : 0;

// Glow pulsant après stabilisation
const verdictGlow = frame >= M.SEG.meme + 20
  ? interpolate(Math.sin((frame - M.SEG.meme - 20) / 18), [-1, 1], [10, 40]) : 10;

// Strobe 3f avant verdict
const strobeOpacity = (frame >= M.SEG.meme - 3 && frame < M.SEG.meme) ? 0.20 : 0;
```

**Règle :** glow via `textShadow`, PAS `filter:drop-shadow` (incompatible Remotion render GPU).

---

### T8 — Separator Lines (structuration visuelle dynamique)

**Principe :** des lignes fines gold apparaissent depuis le pivot central et s'étirent vers le haut/bas pour délimiter les zones quand les données arrivent.

**Pourquoi ça marche :** elles signalent que "quelque chose commence" de chaque côté. Elles donnent de la structure sans ajouter de bruit.

**Implémentation :**
```ts
const lineGrow = interpolate(
  spring({ frame: frame - M.SEG.sh200, fps, config: { damping: 60, stiffness: 45 }, durationInFrames: 40 }),
  [0, 1], [0, 1]
);

// Lignes gauche et droite du pivot
<div style={{
  position: "absolute", left: 0, top: "50%",
  width: 2, height: `${lineGrow * 320}px`,
  transform: "translateY(-50%)",
  background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)`,
  opacity: lineOpacity,
}} />
```

**Note :** le gradient `transparent → GOLD → transparent` évite les bords durs. Donne un effet lumineux.

---

## Structure canonique — "3 colonnes comparaison"

```
[COL GAUCHE 35%]  [PIVOT CENTRAL 30%]  [COL DROITE 35%]
  barre + chiffre    image flottante     barre + chiffre
  (valeur haute)     + ping ring         (valeur basse)
  (couleur alarme)   + glow oscillant    (couleur neutre)

[VERDICT PLEIN ÉCRAN — bas]
```

**Quand utiliser :** toute comparaison avec 2 valeurs sur la même métrique (frais, taux, prix, accès).

**Quand NE PAS utiliser :** 3 valeurs ou plus, ou quand les deux valeurs sont du même ordre de grandeur (l'asymétrie doit être visible).

---

## Ordre de construction (non-négociable)

1. **Manifest d'abord** — tous les SEG calés sur Whisper avant d'écrire une ligne de code
2. **Structure 3 colonnes** — layout Tailwind, pas de positionnement absolu pour le layout principal
3. **Pivot animé** — float + ping + glow (testable seul)
4. **Barres + counters** — une colonne à la fois, valider le timing vs narration
5. **Verdict** — spring + vibration + glow
6. **Polish cumulatif** — fond qui rougit, separator lines, strobe (JAMAIS avant que la structure de base soit validée)

---

## Anti-patterns à éviter

| Tentant | Pourquoi c'est faux |
|---------|---------------------|
| Faire apparaître les deux barres en même temps | L'inégalité doit être révélée progressivement — le spectateur compare, pas lit |
| Mettre un titre animé au centre | Vole l'attention du pivot. Le titre = discret, en haut, opacity 0.75 |
| barRatio estimé visuellement | Invalide la lecture. Toujours calculer le vrai ratio |
| `filter:drop-shadow` sur un `<Img>` | Cassé en render GPU Remotion. Utiliser une `<div>` derrière avec `boxShadow` |
| Glow trop fort dès l'apparition | Commence subtil, pulse après stabilisation |
| Permanent motion trop rapide | Float cycle < 2s = irritant. 3-4s = naturel |

---

## Réutilisabilité — cas d'usage similaires

Ce pattern s'applique directement à :
- Frais bancaires (virement Western Union vs virement local)
- Taux d'intérêt (prêt pauvre vs prêt riche)
- Prix des ressources (ex: pétrole — prix extraction vs prix consommateur)
- Accès à un service (% population couverte — zone urbaine vs rurale)
- Comparaison salaires (même poste, pays différents)

Pour chaque cas : changer `label`, `sublabel`, `pctFinal`, `barRatio`, `color` de la barre secondaire, et le texte du `verdict`.

---

---

## Template réutilisable — `DataRevealSouverain`

Composant : `src/projects/_shared/components/layouts/DataRevealSouverain.tsx`

### Usage minimal (exemple Beat4Prix)

```tsx
import { DataRevealSouverain } from "../../_shared/components/layouts/DataRevealSouverain";

export const Beat4Prix: React.FC = () => (
  <DataRevealSouverain
    pivotAsset="souverain/silicon-savannah/assets/shilling-hero.png"
    leftBar={{
      label: "ENVOIE 200 KES",
      sublabel: "≈ 1,5€",
      value: 5,
      valueDecimals: 0,
      valueSuffix: "%",
      barFillRatio: 1.0,
      color: "#cc2200",
      appearFrame: 97,
    }}
    rightBar={{
      label: "ENVOIE 50 000 KES",
      sublabel: "≈ 380€",
      value: 0.22,
      valueDecimals: 2,
      valueSuffix: "%",
      barFillRatio: 0.05,
      color: "#4caf7d",
      appearFrame: 279,
    }}
    verdictText={"PLUS TU ES PAUVRE,\nPLUS TU PAIES."}
    verdictFrame={476}
    title="FRAIS M-PESA — BARÈME OFFICIEL"
    backgroundAsset="souverain/silicon-savannah/beat4/bg.png"
    narrationAsset="souverain/silicon-savannah/beat4/narration.mp3"
    musicAsset="souverain/silicon-savannah/audio/music/music-A.mp3"
    musicStartFrom={1369}
    subtitles={SUBTITLES}
    sourceText="Safaricom · CBK 2024"
    sourceFrame={668}
  />
);
```

### Props obligatoires

| Prop | Type | Description |
|------|------|-------------|
| `pivotAsset` | `string` | Chemin staticFile de l'image centrale |
| `leftBar` | `DataBar` | Barre gauche (valeur haute / alarme) |
| `rightBar` | `DataBar` | Barre droite (valeur basse / neutre) |
| `verdictText` | `string` | Texte conclusion — `\n` pour retour ligne |
| `verdictFrame` | `number` | Frame d'apparition du verdict |

### Props DataBar

| Prop | Requis | Description |
|------|--------|-------------|
| `label` | oui | Titre de la barre (Bebas Neue, ivory) |
| `value` | oui | Valeur finale affichée par le counter |
| `barFillRatio` | oui | Ratio réel 0→1 (mathématiquement correct) |
| `color` | oui | Couleur barre + chiffre |
| `appearFrame` | oui | Frame d'apparition calée sur narration |
| `sublabel` | non | Sous-titre monospace gold (ex: "≈ 1,5€") |
| `valueDecimals` | non | Décimales counter (défaut 0) |
| `valueSuffix` | non | Suffixe (défaut "%") |

### Calcul de barFillRatio

```
leftBar.barFillRatio  = 1.0         (la valeur de référence — toujours 1.0)
rightBar.barFillRatio = 0.22 / 5    = 0.044  (valeur droite / valeur gauche)
```

Si les deux valeurs sont proches, mettre la plus haute à 1.0 et calculer le ratio de l'autre.

---

*Fiche créée : 2026-05-15 — basée sur Beat4Prix Silicon Savannah*
*Template encodé : `DataRevealSouverain.tsx` — v1.0*
*Prochain raffinement après 2ème utilisation du pattern.*
