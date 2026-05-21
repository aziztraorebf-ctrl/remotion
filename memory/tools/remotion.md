# Remotion — Animation & Timing
> Regles Remotion, spring/interpolate, OffthreadVideo, SVG, audio, geo effects.
> Mise a jour : 2026-04-02

---

## spring() vs interpolate()

- `spring()` = physique (rebond, inertie). Pour entrees, impacts, apparitions.
- `interpolate()` = lineaire/courbe. Pour progressions continues (opacite, position).
- Spring s'applique a l'animation interne, jamais au startFrame cale sur audio.

### Mouvement masse lourde
1. `interpolate` lineaire de f0 a ARRIVE_END (vitesse constante)
2. `spring({ damping: 14, stiffness: 35 })` decale de ARRIVE_END (freinage visible)
3. Combiner : `x = frame < ARRIVE_END ? linear : braking`

---

## Audio sequentiel

- `<Audio delay={n}>` N'EXISTE PAS. Pattern correct : `<Sequence from={n}><Audio startFrom={0} /></Sequence>`
- Chaque piste audio sequentielle dans son propre `<Sequence>`

### Audio volume partiel
```tsx
<Audio src={...} volume={(f) => interpolate(f, [MUTE_START, MUTE_END], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})} />
```

### Musique de fond — valeur par defaut

**0.07** est le volume de depart pour toute musique de fond Souverain/Atlas. Ajuster en hausse ou en baisse selon ressenti, mais toujours commencer a 0.07. Validé Niger Uranium 2026-05-12.
- Trop discret : monter par paliers de 0.03 (0.10, 0.13...)
- Trop present : descendre par paliers de 0.02 (0.05, 0.03...)
- Narration : toujours volume={1.0}, jamais toucher

---

## OffthreadVideo + clips Kling/Seedance

3 regles NON-NEGOTIABLES :
1. `<Video>` INTERDIT en headless render -> frames noires. Toujours `<OffthreadVideo>`.
2. `<OffthreadVideo>` DOIT etre dans `<Sequence from={BEATS.xxx.start}>` — sans Sequence = freeze.
3. Toujours `muted` — Kling/Seedance generent toujours une piste audio parasite.

### beatFade + OffthreadVideo
- `beatFade` (opacity 0->1) + `OffthreadVideo` sur fond noir = double assombrissement = ecran noir ~20 frames
- Fix : retirer opacity de l'AbsoluteFill. Le clip demarre deja sur fond noir.

### Split screen
- `clipPath: inset()` ne fonctionne pas avec `OffthreadVideo`. Solution : `div overflow:hidden` + offset negatif.

---

## SVG inline JSX (Recraft)

- `<Img src="fichier.svg">` = statique. `<use href>` = CORS-bloque en headless.
- Solution : script Node.js pour convertir SVG en JSX inline. Extraire groupes, animer avec spring/sin.
- `backgroundColor` OBLIGATOIRE sur `AbsoluteFill` (fond blanc en headless Puppeteer sinon)
- `preserveAspectRatio="xMidYMid meet"` (jamais `none`)

### SVG viewBox 9:16
- Asset 16:9 dans canvas 9:16 perd ~80% du contenu. Generer les assets NATIVEMENT en 9:16.
- Texte overlay : SVG separe avec `viewBox="0 0 1080 1920"`, jamais dans le meme SVG que le backdrop.

### Pipeline SVG anime -> Remotion
- Toute animation DOIT etre pilotee par `useCurrentFrame()`. CSS/SMIL ne s'executent pas en headless.
- < 10 elements : strip CSS + spring/interpolate (30-60 min)
- >= 10 elements : Anime.js hook (paused + seek)
- Lottie : `@remotion/lottie` UNIQUEMENT (pas `lottie-react`)

---

## Geo Visual Effects

Effets geo (hachures SVG, vignette, draw-on, pulse rings, etc.) documentes dans fichier dedie :
-> **`memory/tools/remotion-geo.md`**

---

## Hooks animation (src/hooks/animation/index.ts)

| Hook | Usage | Signature |
|------|-------|-----------|
| `useOceanSwell(i, frame)` | Houle individuelle par element | -> `ty: number` |
| `useSpringEntrance(i, frame, fps, delay?)` | Apparition decalee spring | -> `opacity: number` 0->1 |
| `useDrift(i, frame, directionPx, totalFrames?, offset?)` | Deplacement progressif clamp | -> `tx: number` |

**Regle** : Un hook valide par Aziz = il entre dans `index.ts`. Jamais re-coder dans les composants.

---

## Entry point & composition registration

**Entry point** : `src/index.ts` (PAS `src/Root.tsx`)
- `registerRoot()` est dans `src/index.ts`
- `Root.tsx` ne contient QUE la liste des compositions — pas de `registerRoot`
- Tailwind CSS import : dans `src/index.ts` (ex: `import "./styles/global.css"`)

**Render d'une composition par nom** :
```bash
npx remotion render src/index.ts Layout-<NomComposition>
# Exemples validés :
npx remotion render src/index.ts Layout-RadarScan
npx remotion render src/index.ts Layout-SplitFlap
```

**Templates connus dans Root.tsx (ajoutés session 2026-05-14) :**
RadarScan, RadarPing, PulseNumber, SplitFlap, TimelineFracture, WordExplode, BarRace, StackedBars, TypeReveal, TypeWriter — tous enregistrés sous `Layout-<Nom>`.

---

## Pipeline & Workflow

### Overlay texte
- Texte overlay justifie seulement si l'image est ambigue sans lui
- Dates et identifications = necessaires. Si le visuel raconte deja l'histoire = pas de texte.

### Transitions entre scenes
- Par defaut : coupes franches. Transitions stylisees uniquement apres validation explicite d'Aziz.

### Etalonnage couleur narratif
- Palette chaude (navy + or + etoiles) = humanite, spiritualite
- Palette froide (gris-bleu + blanc terne) = froideur, mecanique
- C'est une decision narrative, pas esthetique.

<!-- Section "Kimi review" supprimee 2026-04-24 : appartient a quality-reviewer, pas a remotion composition. Voir .claude/agents/quality-reviewer.md -->

