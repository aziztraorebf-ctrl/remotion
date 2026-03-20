# PROTOCOLE_REMOTION — "Un Pixel d'Histoire"
> Version 1.0 — distillé de 3+ mois de production validée
> Audience : LLM assistant qui génère du code Remotion pour ce projet

---

## 1. Rôle de Remotion dans notre stack

Remotion est un **assembleur**, pas un moteur d'animation narrative.

Ce qu'il fait :
- Synchroniser des clips vidéo (Kling) avec une voix-off (ElevenLabs)
- Afficher du texte et des overlays SVG frame-précis par-dessus les clips
- Exporter un MP4 final avec toutes les couches assemblées

Ce qu'il ne fait PAS :
- Générer le mouvement de caméra (c'est Kling)
- Générer les images sources (c'est Gemini ou Recraft)
- Générer la voix-off (c'est ElevenLabs)

**Règle fondamentale** : Kling pour les mouvements de caméra et scènes vivantes,
Remotion pour le texte, les overlays et les éléments de data viz.

---

## 2. Architecture des compositions

### Pattern validé : AbsoluteFill par beat

```tsx
// Chaque beat = composant indépendant avec sa propre opacité
function Beat01Ocean() {
  const frame = useCurrentFrame();
  const op = beatOpacity(frame, BEATS.ocean);
  return (
    <AbsoluteFill style={{ backgroundColor: "#050208", opacity: op }}>
      <Video muted src={staticFile("assets/clip.mp4")} startFrom={0}
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <svg style={{ position: "absolute", top: 0, left: 0 }}>
        {/* overlays texte uniquement */}
      </svg>
    </AbsoluteFill>
  );
}

// Composition principale : tous les beats superposés
export const VideoShort: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#050208" }}>
    <Sequence from={0} premountFor={30}>
      <Audio src={staticFile("audio/voix.mp3")} />
    </Sequence>
    <Beat01Ocean />
    <Beat02Empire />
  </AbsoluteFill>
);
```

**Pourquoi pas Series ?** Series crée des coupures franches. Le pattern AbsoluteFill avec
opacité permet des fondus entre beats sans décaler le timing audio.

**backgroundColor OBLIGATOIRE** sur AbsoluteFill — sinon fond blanc en rendu headless Puppeteer.

---

## 3. Règles d'animation

### spring() vs interpolate()

| Cas d'usage | Outil |
|-------------|-------|
| Entrée d'un élément (pop, rebond, apparition) | `spring()` |
| Progression continue (opacité, position, compteur) | `interpolate()` |
| Objet lourd qui arrive et s'arrête | `interpolate()` linéaire + `spring()` freinage |

```tsx
// spring() — entrée naturelle
const scale = spring({ frame, fps: FPS, config: { damping: 200 } });

// interpolate() — toujours clamper
const opacity = interpolate(frame, [0, 20], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

### Anti-patterns interdits

| Interdit | Raison | Alternative |
|----------|--------|-------------|
| `CSS transition:` | Non-déterministe, preview != MP4 | `interpolate()` |
| `@keyframes` CSS | Non-déterministe en headless Puppeteer | `spring()` / `interpolate()` |
| `Framer Motion` | `requestAnimationFrame` browser, pas Remotion | `spring()` natif |
| `setTimeout/setInterval` | Ne s'exécute pas en rendu headless | frames Remotion |
| `requestAnimationFrame` | Idem | `useCurrentFrame()` |
| `<Audio delay={n}>` | Prop invalide, audio joue depuis f=0 | `<Sequence from={n}><Audio /></Sequence>` |

---

## 4. Texte et typographie

### SVG natif obligatoire

```tsx
// CORRECT
<svg width={W} height={H} style={{ position: "absolute", top: 0, left: 0 }}>
  <text x={W/2} y={500} textAnchor="middle" fill="#d4af37" fontSize={220}
    fontFamily="'Playfair Display', Georgia, serif" fontWeight="bold">
    1311
  </text>
</svg>

// INTERDIT — bug en rendu headless
<foreignObject>
  <div style={{ fontFamily: "..." }}>1311</div>
</foreignObject>
```

### Safe zones 1080x1920 (format portrait)

- Marge gauche/droite minimum : 100px
- Marge haut/bas minimum : 80px
- Zone sous-titres : Y >= 1700 réservée
- Taille minimum texte : 40px (titres : 60px+)
- Zone de focus mobile (thumb zone) : centre vertical 700-1400px

---

## 5. Intégration assets externes

### Clips Kling

```tsx
// TOUJOURS OffthreadVideo (pas Video) + muted
// <Video> fonctionne uniquement en preview navigateur. En headless render = frames statiques/noires.
// <OffthreadVideo> décode frame par frame — obligatoire pour npx remotion render.
// muted = OBLIGATOIRE — Kling génère toujours une piste audio même "sans audio"
<OffthreadVideo
  muted
  src={staticFile("assets/geoafrique/beat01-o3-pan-B-14s.mp4")}
  startFrom={0}
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>
```

**Règle Sequence OBLIGATOIRE :**
```tsx
// CORRECT — frame local commence à 0, clip joué depuis le début
<Sequence from={BEATS.empire.start}>
  <Beat02Empire />
</Sequence>

// INTERDIT — Beat02 commence à frame 473, currentTime = 473/30 = 15.7s > durée clip = FREEZE
<Beat02Empire />
```
Tout composant contenant un `<OffthreadVideo>` DOIT être dans `<Sequence from={beatStart}>`.

### SVG Recraft inline

- `<Img src="fichier.svg">` = statique, aucune animation possible
- `<use href="...#id">` = bloqué en rendu headless (CORS/CSP Puppeteer)
- **Solution valide** : script Node.js pour convertir SVG -> JSX inline automatiquement
- `preserveAspectRatio="xMidYMid meet"` (jamais `none` avec paths diagonaux)
- Extraire les paths avec `matchAll(/<path[^>]*><\/path>/g)` (Recraft génère `<path></path>`, pas `<path />`)

### Ordre de rendu SVG

- Z-order = ordre DOM dans le SVG
- Élément toujours visible (titre, côte) -> rendre en dernier
- Rim light -> toujours avant le corps solide

---

## 6. Audio et timing

### Règle absolue : timing.ts est intouchable

```ts
// timing.ts — dérivé de Whisper/ffprobe, JAMAIS modifier manuellement
export const BEATS = {
  ocean:     { start: 0,   end: 197  },
  empire:    { start: 197, end: 287  },
};
```

Le timing est la source de vérité absolue. Si un clip Kling ne rentre pas dans sa
fenêtre de frames, c'est le clip qu'on change, jamais le timing.

### Premount obligatoire

```tsx
<Sequence from={beatStart} premountFor={1 * fps}>
  <BeatComponent />
</Sequence>
```

### Audio séquentiel

```tsx
// CORRECT
<Sequence from={startFrame}><Audio src={...} startFrom={0} /></Sequence>

// INTERDIT — prop delay invalide dans Remotion
<Audio delay={startFrame} src={...} />
```

---

## 7. SVG animé — décision rapide

| Nb éléments | Méthode | Temps |
|-------------|---------|-------|
| < 10 | Approche directe : strip CSS + spring/interpolate | 30-60 min |
| >= 10 timeline complexe | Anime.js hook (paused + seek) | 1h setup |
| Origine After Effects | Lottie JSON via `@remotion/lottie` | Nécessite AE |

**Lottie** : `@remotion/lottie` uniquement (pas `lottie-react`).
Pour les effets organiques diffus (fumée, flammes, pluie). Jamais pour personnages principaux.

---

## 8. Effets SVG validés en production

Référence sandbox : `src/projects/style-tests/EffectsLab.tsx` (10 segments)

| Effet | Technique | Usage narratif |
|-------|-----------|----------------|
| Grain texture | `feTurbulence` opacity 0.03-0.10 | Toute scène, intensité = tension |
| Fumée | Cercles SVG + Math.sin | Cheminées, galères, bûchers |
| Draw-on bordure | `strokeDashoffset` | Cartes, révélation de frontières |
| Zoom CSS | `transform scale()` sur groupe SVG | Zoom géo fluide (GPU-native) |
| Pulse rings | `% PERIOD` modulo loop | Épicentre, alerte, expansion |
| Vignette | `radialGradient` animé | Tension, nuit, focalisation |
| Transition zoom-blur | Scale + blur interpolate | Saut temporel, cut dramatique |

**Règle : 1 effet dominant par scène.** Jamais superposer grain fort + torche + split-screen.

### feTurbulence — valeurs de référence

```
Parchemin normal  : baseFrequency="0.65" opacity 0.03
Tension narrative : baseFrequency="0.65" opacity 0.06
Choc / mort       : baseFrequency="0.65" opacity 0.10
Maximum absolu    : opacity 0.12 (au-delà = distraction)
Animation grain   : seed={useCurrentFrame() % 60} -> crépitement pellicule
```

---

## 9. Workflow de validation (non-négociable)

```
1. Générer le clip Kling
2. ffmpeg -i clip.mp4 -vf "fps=1" frame-%02d.png
3. Valider frame 1 ET frame 5 visuellement AVANT d'intégrer
4. Intégrer dans Remotion
5. npx remotion still --frame=0 <- vérifier rendu headless
6. Mini-render npx remotion render --frames=START-END <- BLOQUANT avant beat suivant
7. Valider -> passer au beat suivant
```

Le preview Remotion Studio peut mentir sur la synchronisation audio et le rendu headless.
Un mini-render réel est obligatoire avant de valider un beat.

---

## 10. Anti-patterns documentés (erreurs réelles en production)

| Anti-pattern | Symptôme | Fix |
|--------------|----------|-----|
| `<Video>` pour clip Kling | Frames statiques/noires en render headless | `<OffthreadVideo>` obligatoire |
| `<OffthreadVideo>` sans `<Sequence from={beatStart}>` | Beat freeze immédiatement (frame absolu > durée clip) | Envelopper dans `<Sequence from={BEATS.xxx.start}>` |
| `<OffthreadVideo>` sans `muted` | Audio Kling parasite sur la voix-off | Toujours `muted` |
| `beatFade` opacity sur AbsoluteFill + OffthreadVideo | Ecran noir ~20 frames au début | Retirer opacity du AbsoluteFill, le clip démarre déjà sur fond noir |
| `backgroundColor` absent | Fond blanc dans le MP4 exporté | Toujours sur AbsoluteFill |
| `foreignObject` pour texte | Rendu vide en headless | SVG `<text>` natif |
| CSS `transition:` | Preview OK, MP4 figé | `interpolate()` Remotion |
| `<Audio delay={n}>` | Voix doublées ou déphasées | `<Sequence from={n}><Audio /></Sequence>` |
| Framer Motion | Preview animé, MP4 statique | `spring()` natif Remotion |
| `<Img src=".svg">` pour animation | SVG statique, zero animation | JSX inline via script Node.js |
| `preserveAspectRatio="none"` | Formes de fond ne couvrent pas le canvas | `"xMidYMid meet"` |
| Modifier timing.ts manuellement | Désynchronisation voix/visuel | Le timing est dérivé de Whisper, ne pas toucher |
| Itérer > 3 fois sur un paramètre visuel | Rabbit hole sans fin | Fixer une valeur "bonne par défaut" et passer à la suite |
