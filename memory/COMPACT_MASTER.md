# COMPACT_MASTER — Remotion Project
> Mise a jour : 2026-03-31 | Stable — modifier uniquement si decision d'architecture majeure

---

## Stack Technique

- **Runtime** : Node.js v24.6.0, npm 11.5.1 (PAS bun)
- **Rendu** : Remotion — `npx remotion render` — headless Puppeteer
- **Animations** : `spring()` + `interpolate()` UNIQUEMENT (jamais CSS transitions, @keyframes, Framer Motion, requestAnimationFrame)
- **Audio sequentiel** : `<Sequence from={n}><Audio startFrom={0} /></Sequence>` — jamais `delay` prop
- **OffthreadVideo (Kling/Seedance clips) — 3 regles NON-NEGOTIABLES :**
  1. `<Video>` INTERDIT en headless — frames noires. Toujours `<OffthreadVideo>`.
  2. `<OffthreadVideo>` DOIT etre dans `<Sequence from={BEATS.xxx.start}>` — sans Sequence = freeze.
  3. Toujours `muted` sur `<OffthreadVideo>` — audio = piste separee ElevenLabs.
- **Lottie** : `@remotion/lottie` (PAS `lottie-react`)
- **Geographie** : d3-geo + TopoJSON — zoom via CSS transform (jamais re-projection D3 par frame)
- **Format Short** : 1080x1920 (vertical 9:16) — template : `src/templates/VerticalTemplate.tsx`
- **Format Long** : 1920x1080 (16:9)

### Safe Zones Short (TikTok / YouTube Shorts / Reels)
```
Top    : 120px  (barre profil, live indicator)
Bottom : 340px  (nav, caption, boutons CTA)
Left   :  80px  (marge)
Right  : 140px  (like / comment / share / follow)
```
Constants exportees : `SAFE_ZONES`, `CONTENT_ZONE` depuis `VerticalTemplate.tsx`

### Asset 16:9 dans cadre 9:16
- Utiliser `viewBox` crop (ex: `"0 150 2048 900"`) + `preserveAspectRatio="xMidYMid slice"`
- NE PAS utiliser CSS `scale` ou `transform` sur le SVG entier — degrade la qualite

---

## Regles d'or Remotion (NON-NEGOTIABLE)

1. **Audio-derived timing** : `const x = TIMING.beat01.start` — jamais hardcoder les frames
2. **startFrame audio = INTOUCHABLE** : spring/grain/lottie ne modifient jamais les frames cales sur audio
3. **Clamp obligatoire** : `extrapolateRight: 'clamp', extrapolateLeft: 'clamp'` sur tout interpolate
4. **premountFor** : `<Sequence premountFor={1 * fps}>` sur toutes les sequences
5. **CSS animations** : null dans headless render. Tout doit passer par `useCurrentFrame()`.
6. **Rabbit hole** : max 3 iterations sur un parametre visuel. Fixer et passer a autre chose.
7. **Sandbox first** : toute nouvelle technique dans `EffectsLab.tsx` avant production

---

## Palettes de Reference

### Palette Peste 1347 (enluminure + gravure)
```
PARCHMENT   = "#F5E6C8"   PARCHMENT_D = "#E8D4A8"
INK         = "#1A1008"   INK_LIGHT   = "#6B5030"
GOLD        = "#C9A227"   GOLD_DARK   = "#8B6914"
SKY_BLUE    = "#2D3A8C"   VERMILLON   = "#C1392B"
SEA_BLUE    = "#1B4F8C"
```

### Palette GeoAfrique (flat design premium)
```
FOND        = "#050208"   (noir pur absolu)
FOND_HZ     = "#080d1a"   (horizon indigo, background gradient)
OR          = "#D4AF37"   (or historique)
TERRACOTTA  = "#A52A2A"   (Afrique, elements cles)
OCRE        = "#C8820A"   (elements secondaires)
CREME       = "#F5E6C8"   (texte, details)
```

### Palette Silhouette Nocturne (veilleur-ombre)
```
BG_TOP  = "#050208"   BG_HORIZ = "#080d1a"   SIL_COL = "#0c1018"
GROUND  = "#060810"   BRUME    = "#10182e"   WARM_EYE = "#ff9933"
```

---

## Projets Actifs

### Peste 1347 (principal)
- Style : SVG dual-style enluminure (couleur) + gravure (monochrome)
- Composants actifs : `src/projects/peste-1347-pixel/scenes/`
- Hook : TERMINE (HookMaster v2, ~80.9s, score Kimi 9/10)
- Restant : S1 Flagellants -> S6 Miroir (~8m30s)

### GeoAfrique — Abou Bakari II (satellite)
- Style : **Flat design 2D — Seedance 2.0 (principal) + Kling (4K/API backup) + Remotion overlays**
- Pipeline principal : Seedance 2.0 via Dreamina web -> ffmpeg strip audio -> Remotion OffthreadVideo + Audio ElevenLabs
- Pipeline legacy : Gemini -> Kling V3/O3 (garde pour 4K et quand API Seedance indisponible)
- Etat : **BEATS 01-09 TOUS COMPLETES** — reste musique Suno + render final

### Seedance 2.0 / Dreamina (resume)
- **Force** : coherence parfaite (0 morphing/9 tests), multi-ref, POV->3e personne, foule 30+, lip sync, duel combat
- **Faiblesse** : max 15s, 720p gratuit, pas d'API, audio re-synthetise
- **Workflow** : Seedance -> ffmpeg strip audio -> Remotion OffthreadVideo + ElevenLabs
- **Format recommande** : SECONDS X TO Y + COLOR GRADE (personnages), narratif court (paysages)
- **Reference complete** : `memory/seedance-reference.md`

---

## Methodes Kling (valides 2026-03-16)

| Methode | Endpoint | Quand |
|---------|----------|-------|
| V3 Pro | `v3/pro/image-to-video` | Portrait cinematique, 5-10s |
| V3 Standard | `v3/standard/image-to-video` | Scene symbolique/locked, economique |
| O3 Standard | `o3/standard/image-to-video` | Scene epique, start+end frame |

### 5 regles essentielles Kling
1. **cfg_scale 0.3** = plus stable (moins de morphing). C'est l'adherence au prompt, PAS l'intensite mouvement
2. **Plan moyen (sujet 50-55% cadre) OBLIGATOIRE** pour tout mouvement camera
3. **Morphing O3 sur flat 2D** : degrade apres ~6-8s — couper avec durationInFrames
4. **Duree = duree beat audio** : `duration: "5"` ou `"10"`. Clip 10s pour beat 12s = playbackRate 0.83x (naturel)
5. **Mouvement = prompt engineering** : verbes d'action "PRESSES", "MARCH", "RUSHES". JAMAIS "atmospheric movement only"

---

## Pipeline Hybride Recraft + Remotion (VALIDE 2026-03-09)

**Workflow** : Recraft V4 Vector genere SVG -> extraire paths -> animer en spring()/interpolate() Remotion.

- Style reference via `POST /styles`, assets individuels -> SVG natif
- Caveat : nommage paths non semantique (`path1`, `path2`)
- `recraftv4_vector` : MEILLEUR SVG. `recraftv4_pro_vector` : SVG premium 4MP
- MCP : recraftv3/v2 uniquement — V4 = API directe. Parametre `controls` = API directe uniquement
- Pricing : ~$0.08/image

---

## Regles Generales NON-NEGOTIABLES

- **NO TEXT dans frames source** : ZERO texte/chiffre/date/label dans toute image envoyee a Kling ou Seedance. Texte = artefacts animes garantis. Texte appartient a Remotion post-production.
- **NO EMOJIS** dans `.ts/.tsx/.js/.json/.yaml/.env` (autorise dans `.md`)
- **Audio-first** : generer audio -> mesurer ffprobe -> coder
- **Mini-render apres chaque beat** : `npx remotion render --frames=START-END`
- **Contrat Visuel AVANT code** (toute scene >10s) : tableau frames/visuel/ce-qui-change
- **Zoom geo = CSS transform** : JAMAIS D3 re-projection par frame
- **Storyboard first** : avant tout projet visuel geo/carte

---

## Bibliotheque d'Animation (src/hooks/animation/index.ts)

| Hook | Usage | Signature |
|------|-------|-----------|
| `useOceanSwell(i, frame)` | Houle individuelle par element | -> `ty: number` |
| `useSpringEntrance(i, frame, fps, delay?)` | Apparition decalee spring | -> `opacity: number` 0->1 |
| `useDrift(i, frame, directionPx, totalFrames?, offset?)` | Deplacement progressif clamp | -> `tx: number` |

**Regle** : Un hook valide par Aziz = il entre dans `index.ts`. Jamais re-coder dans les composants.

---

## Regle : Images de Reference Personnages (NON-NEGOTIABLE)

- Dossier canonical : `public/assets/geoafrique/characters/`
- Nommage : `[personnage]-[description]-REF.png`
- Jamais supprimer — "seed" Gemini. Pour toute scene : passer le REF comme `Part.from_bytes()`

---

## Regle : Respecter l'Asset Recraft (NON-NEGOTIABLE)

- **NE PAS** reordonner calques SVG, changer `preserveAspectRatio`, ou forcer la geometrie
- **ANIMER UNIQUEMENT** : opacity, translate, rotate, scale — PAS la structure
- Si l'image ne convient pas : **changer le prompt Recraft**, pas tordre le SVG

---

## Effets SVG Valides (EffectsLab.tsx)

| Seg | Effet | Usage narratif |
|-----|-------|----------------|
| S2 | Grain + Fumee SVG | Toute scene vivante |
| S3 | spring() entrees | Apparition personnages |
| S4 | Stroke-dasharray | Intro de scene, cartes, titres |
| S5 | Vignette + torche | Scenes nocturnes, tension |
| S6 | Split-screen (max 1x/video) | Comparaison avant/apres |
| S8 | Marche Math.sin() | Personnages en deplacement |
| S9 | Carte propagation | Visualisation historique geo |
| S10 | Micro-expressions | Choc, peur, contamination |

**Regle** : 1 effet dominant par scene. Jamais superposer 3+ effets.

---

## APIs Actives (cles dans .env)

- `ELEVENLABS_API_KEY` : voix-off (Chris fr)
- `PIXELLAB_API_KEY` : sprites pixel art (archive)
- `FAL_KEY` : fal.ai (flux/dev, ESRGAN)
- `OPENAI_API_KEY` : GPT-4o
- `GEMINI_API_KEY` : Gemini Deep Research + generation SVG + storyboards
- `XAI_API_KEY` : Grok + web_search + x_search
- `AUPHONIC_API_KEY` : polissage audio

---

## Agents Specialises (DECLENCHEMENT OBLIGATOIRE)

| Agent | Quand |
|-------|-------|
| `creative-director` | AVANT de coder une scene + AVANT render >30 frames |
| `pixel-art-director` | APRES Direction Brief, AVANT assets |
| `kimi-reviewer` | APRES chaque render reussi (hook auto) |
| `pixellab-expert` | AVANT toute generation PixelLab |

- Memoire : `.claude/agent-memory/*/MEMORY.md`
- Hook gate : `storyboard-gate.sh` bloque edit de scene si SCENE_TIMING absent

---

## Methodes de Controle — Tableau de Bord

| Situation | Methode | Quand NE PAS |
|-----------|---------|--------------|
| Modifier 1 detail asset existant | **Nano Banana** : gemini-flash extract -> modifier -> gemini-pro regen | Assets from scratch |
| Nouveau personnage coherence faciale | **Gemini multimodal REF** : `Part.from_bytes()` + prompt | Pas de REF existant |
| Clip Kling transition controlee | **O3 Start+End Frame** : cfg_scale 0.4 | Pas de transition narrative |
| Clip Kling personnage plat | **V3 standard** : cfg_scale 0.35 | Cartes geo |
| Clip Kling carte geo | **V2.1 standard** : cfg_scale 0.6 | Personnages |
| Animer SVG Recraft | **Hooks bibliotheque** : useOceanSwell, useSpringEntrance, useDrift | Animations non couvertes |
| Ecrire prompt Kling | **Gemini Kling Director** : brief FR -> 3 variantes optimisees | Relances mineures |

### Regles de selection automatique
- **Carte geo** -> V2.1. **Personnage barbe/details** -> Gemini REF obligatoire. **Asset a modifier** -> Nano Banana d'abord
- **Transition cinematique** -> O3 start+end. **Prompts Kling** -> Gemini Kling Director d'abord

---

## Techniques Geo Validees (GeoAdvancedV2.tsx)

1. **Hachures SVG** : `<pattern>` + `patternTransform rotate(frame * 0.3)`
2. **Vignette** : `radialGradient` opacity interpolee
3. **Zoom CSS fluide** : `translate(target) scale(zoom) translate(-target)` + `Easing.inOut(cubic)`
4. **Draw-on** : `strokeDashoffset` + `interpolate()`
5. **Pulse rings** : modulo `% PERIOD` pour boucle infinie
6. **Zoom-blur transition** : outScale 1->1.12 + blur 0->8px | 18 frames optimal

---

## Gotchas ElevenLabs TTS (Chris fr)

- Participes passes en "e" : drop systematique -> constructions sans accent final
- "ont + voyelle" -> liaison bizarre -> passe simple
- Noms de villes "s" final -> liaison bizarre -> sans "s" phonetique

---

## Pipeline Shorts GeoAfrique — Ordre INVIOLABLE (NON-NEGOTIABLE)

```
1. Script definitif valide par Aziz
2. Generation audio ElevenLabs V3
3. Whisper -> mesure timings reels par segment
4. timing.ts stable et valide
5. Generation clips Kling/Seedance (duree = timing reel du beat)
6. Integration Remotion + mini-render
```
JAMAIS dans un autre ordre. ZERO clip avant timing.ts stable.
Si le script change apres l'etape 1 -> recommencer depuis l'etape 2.

**Skill complet** : `.claude/skills/batch-short-production/` (details, 9 phases, scripts)
