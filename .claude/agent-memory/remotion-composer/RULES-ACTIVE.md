# RULES-ACTIVE — remotion-composer

> Source de verite unique pour les regles Remotion composition. Remplace la dispersion entre SYSTEM_PROMPT, MEMORY.md, memory/tools/remotion.md.
> Derniere mise a jour : 2026-04-24 (refactor memoire — 16 regles consolidees)

---

## Regles critiques (VIVANTE CRITIQUE) — violation = render casse

| # | Regle | Pattern CORRECT | Pattern INTERDIT |
|---|-------|-----------------|------------------|
| R1 | **Audio-derived timing** | `const arrowStart = SCENES.forces.start;` | `const arrowStart = 30;` (hardcode) |
| R4 | **Clamp interpolations** | `interpolate(f, [0,30], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'})` | `interpolate(f, [0,30], [0,1])` (extrapolation artefact) |
| R6 | **Zero browser animation APIs** | `useCurrentFrame()` + `spring()` / `interpolate()` | `setTimeout`, `@keyframes`, `CSS transition`, `requestAnimationFrame` |
| R9 | **OffthreadVideo en headless** | `<OffthreadVideo src=... muted />` dans `<Sequence>` | `<Video>` direct = frames noires en render Lambda/Vercel |
| R10 | **OffthreadVideo muted obligatoire** | `<OffthreadVideo muted />` + `<Audio>` separe | Clip source audio non coupe -> double mix narration |
| R11 | **public/audio gitignored** | Render local + upload MP4 compresse | Render Vercel Sandbox avec narration -> audio manquant |

---

## Regles standards (VIVANTE) — qualite de composition

| # | Regle | Usage | Exemple |
|---|-------|-------|---------|
| R2 | **spring vs interpolate** | spring pour ENTREES d'elements (entree, scale, impact) ; interpolate pour MOUVEMENTS CONTINUS (camera pan/dolly, defilement, opacite lente) | `spring({frame,fps,config:{damping:200}})` entree vs `interpolate(f, [0,100,200,300], [1,1.5,1.5,2.8])` camera |
| R3 | **premountFor sur Sequence** | Toujours `premountFor={1 * fps}` pour precharger (evite pop-in) | `<Sequence from={...} durationInFrames={...} premountFor={FPS}>` |
| R5 | **Camera continue jamais segmentee** | Un seul `interpolate()` sur toute la plage frames, pas de if/else par segment | `interpolate(f, [0,100,200,300], [1,1.5,1.5,2.8], {extrapolateRight:'clamp'})` |
| R12 | **Pattern Hook 5s + Option B musique** | Hook Sequence from=0 + scenes decalees de HOOK_FRAMES + musique from=SCENES_START_FRAME (silence pendant hook) | Voir `MEMORY.md` section HOOK PATTERN + `src/projects/geoafrique-shorts/SonjataShortFull.tsx` |
| R13 | **Spring configs standards** | `damping:200` smooth / `damping:20, stiffness:200` snappy / `damping:8` bouncy / `damping:100, mass:1.5` intros longues | Voir MEMORY.md section Spring configs |
| R14 | **TransitionSeries duree math** | `totalComp = sum(durations) - sum(transitions)` (transitions overlap scenes adjacentes) | Import : `@remotion/transitions` |
| R15 | **Audio sequentiel** | `<Audio delay>` N'EXISTE PAS. Pattern : `<Sequence from={n}><Audio startFrom={0} /></Sequence>` | Chaque piste dans sa propre Sequence |
| R16 | **SVG inline en headless** | `<use href>` CORS-bloque, `<Img src="svg">` statique. Convertir SVG -> JSX inline, animer via useCurrentFrame | `backgroundColor` obligatoire sur AbsoluteFill (fond blanc sinon) |

---

## Regles zombies (tranchees 2026-04-24)

### R7 — TransitionSeries par defaut
**Verdict** : ZOMBIE -> recadree. Par defaut = coupes franches. TransitionSeries uniquement avec validation explicite Aziz (documentaire YouTube = pas de transitions lourdes).
Aligne avec rule "Signalement proactif" de CLAUDE.md.

### R8 — Mini-render bloquant
**Verdict** : ZOMBIE -> clarifie via strategie Option A/B ci-dessous.

---

## Mini-render strategie (Action 3 — noir sur blanc)

**Option B — Shorts <90s (ex: Thiaroye V5 101s)** :
- Agent remotion-composer : composition + dev server scrubbing manuel (localhost:3000)
- Claude principal : render final via `scripts/render-on-vercel.py` ou render local + upload blob
- Pas de mini-render bloquant 3-4s
- Justification : cycle dev server scrubbing est suffisant pour Shorts courts ; render final = decision consciente orchestrateur

**Option A — Long-form >3min, multi-scenes complexes** :
- Agent remotion-composer : mini-render local 3-4s (`npx remotion render <Comp> /tmp/mini.mp4 --frames=100-200`) AVANT de coder d'autres scenes
- Justification : pour long-form, accumulation de bugs sur 10+ scenes = cher a debugger retro

**Thiaroye V5 = Option B.** Par defaut tous les Shorts (Sonjata, Abou Bakari, Thiaroye) = Option B.

---

## Safe zones 9:16 (1080x1920) — valeur OFFICIELLE projet (Action 4)

| Zone | YouTube Shorts (defaut Thiaroye V5) | TikTok | Instagram Reels |
|------|-------------------------------------|--------|-----------------|
| Top (notch / title) | **120px** | 150px | 100px |
| Bottom (UI + username + description) | **250px** | 300px | 250px |
| Sides | **60px** | 80px | 60px |
| Zone sous-titres reservee | **Y >= 1670** | Y >= 1620 | Y >= 1670 |

**Par defaut Thiaroye V5 et tous Shorts sans cible specifique : YouTube Shorts (120 top / 250 bottom / 60 sides / Y>=1670).**

**Texte min** : titres 72px+, corps 40px+.

---

## Safe zones 16:9 (1920x1080)

- Gauche/droite : min 100px
- Haut/bas : min 60px
- Zone sous-titres : Y >= 850 reservee
- Texte min : titres 48px+, corps 32px+

---

## Regles supplementaires (VIVANTE)

| # | Regle | Pattern CORRECT | Pattern INTERDIT |
|---|-------|-----------------|------------------|
| R17 | **fps via useVideoConfig()** | `const { fps } = useVideoConfig();` | `const fps = 30;` (hardcode) |
| R18 | **staticFile() obligatoire** | `src={staticFile("audio/file.mp3")}` | `src="/audio/file.mp3"` (chemin direct) |

---

## Anti-patterns bloquants (recap rapide)

1. Frames hardcodees au lieu de SCENES.x.start
2. interpolate sans clamp
3. setTimeout / @keyframes / CSS transition
4. Video au lieu de OffthreadVideo en headless
5. OffthreadVideo sans muted sur clip avec audio natif
6. Render Vercel avec narration (public/audio gitignored)
7. Sequence sans premountFor
8. Camera segmentee par if/else
9. Transitions sans validation Aziz (documentaire = coupes)
10. SVG avec use href ou CSS animation en headless

---

## Version / CHANGELOG

- 2026-04-24 v1 : 16 regles consolidees, safe zones tranchees, mini-render Option A/B, R7/R8 zombies corrigees
- 2026-04-25 v2 : R17 (fps via useVideoConfig) + R18 (staticFile obligatoire) ajoutees
