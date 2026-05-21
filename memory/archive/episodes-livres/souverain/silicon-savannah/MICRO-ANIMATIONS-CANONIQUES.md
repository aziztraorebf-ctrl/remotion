# Micro-Animations Canoniques — Silicon Savannah
> Validé sur Beat 2 — 2026-05-14
> Appliquer SANS appel Gemini. Source de vérité pour tous les beats.
> Objectif : chaque segment doit avoir au moins 1 animation "vivante" en plus de l'entrée spring.

---

## RÈGLE D'USAGE

Pour chaque segment d'un beat, identifier son **type visuel** dans la liste ci-dessous,
puis appliquer les animations correspondantes directement dans le code.
Pas de call Gemini pour choisir des animations — c'est une décision de motion design, pas de fidélité.

---

## CATALOGUE PAR TYPE DE SEGMENT

### TYPE A — Texte seul centré (chiffre, année, stat géante)
*Exemples : "2007", "9/10", "$8B"*

```tsx
// Pop-in dynamique avec léger overshoot
const popIn = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });

// Slow zoom continu sur toute la durée
const slowZoom = interpolate(frame, [startFrame, endFrame], [1.0, 1.05], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp"
});

// Application
style={{ transform: `scale(${slowZoom * popIn})` }}
```

---

### TYPE B — Logo / Marque centrale (M-PESA, nom entreprise, pays)
*Exemples : "M-PESA", "KENYA", "SAFARICOM"*

```tsx
// Glow pulsant — drop-shadow oscillant
const glowIntensity = interpolate(
  Math.sin((frame - startFrame) / 8), [-1, 1], [6, 18]
);
style={{ filter: `drop-shadow(0 0 ${glowIntensity}px rgba(255,184,0,0.55))` }}

// Entrée : spring standard
const opacity = spring({ frame: frame - startFrame, fps, config: { damping: 80, stiffness: 60 } });
```

---

### TYPE C — Icônes flottantes (SMS, pièces, symboles)
*Exemples : enveloppe SMS, €/$, flèches*

```tsx
// Flottaison sinus asynchrone — offset différent par icône
const floatY = Math.sin((frame - startFrame) / 12 + iconIndex * 1.5) * 6;
style={{ transform: `translateY(${floatY}px)` }}

// Pop-in séquentiel par icône
opacity: interpolate(frame, [startFrame + 10 + i * 8, startFrame + 22 + i * 8], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp"
})
```

---

### TYPE D — Texte négatif / barré (interdiction, opposition)
*Exemples : "PAS DE SMARTPHONE", "NON", texte effacé*

```tsx
// Entrée avec scale-back (légère réduction depuis 1.08 → 1.0)
const lineSpring = spring({ frame: frame - startFrame, fps, config: { damping: 80, stiffness: 60 } });
transform: `translateY(${interpolate(lineSpring, [0, 1], [40, 0])}px) scale(${interpolate(lineSpring, [0, 1], [1.08, 1])})`

// Rature qui se dessine de gauche à droite
const ratureWidth = interpolate(frame, [startFrame + 20, startFrame + 45], [0, 100], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp"
});
// Ligne absolue : width: `${ratureWidth}%`, height: 5, backgroundColor: "#FFB800"
```

---

### TYPE E — Split screen 50/50 (deux assets côte à côte)
*Exemples : antenne / Nokia, carte / stat, avant / après*

```tsx
// Entrée glissée depuis les bords — gauche de -60px, droite de +60px
const leftSpring = spring({ frame: frame - startFrame, fps, config: { damping: 80, stiffness: 55 } });
const rightSpring = spring({ frame: frame - startFrame - 10, fps, config: { damping: 80, stiffness: 55 } });

transform: `translateX(${interpolate(leftSpring, [0, 1], [-60, 0])}px)`  // gauche
transform: `translateX(${interpolate(rightSpring, [0, 1], [60, 0])}px)`  // droite

// Fond split : couleurs légèrement différentes
// Gauche : backgroundColor: "#0A1016"
// Droite : backgroundColor: "#161D26"
```

**Pour l'asset de gauche :** pulse lumineux pulsant (radial-gradient animé) par-dessus l'image :
```tsx
background: `radial-gradient(ellipse 55% 35% at 30% 42%,
  rgba(255,184,0,${interpolate(Math.sin((frame - startFrame) / 8), [-1, 1], [0.0, 0.14])}) 0%,
  transparent 70%)`
```

**Pour l'asset de droite :** vibration douce au milieu du segment :
```tsx
const vibrateZone = interpolate(frame, [startFrame + 55, startFrame + 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const vibrateOut = interpolate(frame, [startFrame + 75, startFrame + 85], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const vibrationAngle = Math.sin((frame - startFrame - 55) * 2.5) * 2.5 * vibrateZone * vibrateOut;
transform: `... rotate(${vibrationAngle}deg)`
```

---

### TYPE F — Carte / Graphique / Radar
*Exemples : carte géo, barre chart, radar ping*

```tsx
// Draw progressif via strokeDasharray / strokeDashoffset
const drawProgress = interpolate(frame, [startFrame, startFrame + 45], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp"
});
strokeDasharray={totalLength}
strokeDashoffset={totalLength * (1 - drawProgress)}

// Pulse radial sur le point focal (ping)
const pingScale = interpolate((frame - startFrame) % 30, [0, 15, 29], [0.8, 1.3, 0.8]);
const pingOpacity = interpolate((frame - startFrame) % 30, [0, 10, 29], [0.4, 1, 0.4]);
```

---

### TYPE G — Stat avec chiffre animé (count-up)
*Exemples : "47 millions", "95%", croissance*

```tsx
// Count-up sur la durée du segment
const countProgress = interpolate(frame, [startFrame, startFrame + 60], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp"
});
const displayValue = Math.round(targetValue * countProgress);

// Léger bounce à la fin du count
const bounceScale = spring({ frame: frame - (startFrame + 60), fps, config: { damping: 6, stiffness: 200 } });
// Appliquer bounceScale sur le chiffre final seulement
```

---

## RÈGLE ASSETS SVG COMPLEXES

Si le storyboard demande une **icône reconnaissable** (téléphone, voiture, bâtiment, logo, animal) :
→ **NE PAS coder en SVG** — générer via `gemini-3.1-flash-image-preview` dès la Phase 2, intégrer comme `<Img>`
→ Les animations React s'appliquent par-dessus via un `<div>` wrapper avec `transform`/`filter`

Si le storyboard demande une **forme géométrique simple** (rectangle, cercle, ligne, flèche) :
→ Coder en SVG directement

Seuil de décision : si le SVG nécessite >15 éléments pour être reconnaissable → image Gemini.

---

## BUDGET APPELS GEMINI PAR BEAT

| Phase | Appels max | Modèle |
|-------|-----------|--------|
| Phase 1 — storyboard images | 1 (batch 4 segments) | gemini-3.1-flash-image-preview |
| Phase 1 — JSON structuré | 1 | gemini-3.1-pro-preview |
| Phase 2 — background | 1 | gemini-3.1-flash-image-preview |
| Phase 2 — assets icônes complexes | 1 (batch si possible) | gemini-3.1-flash-image-preview |
| Phase 4 — review finale | 1 (après auto-validation) | gemini-3.1-pro-preview |
| Phase 4 — 2e review si NEEDS_WORK | 1 max | gemini-3.1-pro-preview |
| **TOTAL MAX** | **6** | |

**Ce qu'on supprime vs Beat 2 :**
- Reviews itératives sur SVG mal codé → résolu par règle "image si >15 éléments"
- Appel Gemini pour choisir les micro-animations → résolu par ce catalogue
- Reviews sur frames mal choisies (opacity ~0) → résolu par règle "frames à moments stabilisés"
