# COMPACT_MASTER — Remotion Project
> Mise a jour : 2026-03-29 | Stable — modifier uniquement si decision d'architecture majeure

---

## Stack Technique

- **Runtime** : Node.js v24.6.0, npm 11.5.1 (PAS bun)
- **Rendu** : Remotion — `npx remotion render` — headless Puppeteer
- **Animations** : `spring()` + `interpolate()` UNIQUEMENT (jamais CSS transitions, @keyframes, Framer Motion, requestAnimationFrame)
- **Audio sequentiel** : `<Sequence from={n}><Audio startFrom={0} /></Sequence>` — jamais `delay` prop
- **OffthreadVideo (Kling clips) — 3 regles NON-NEGOTIABLES (2026-03-13) :**
  1. `<Video>` INTERDIT en headless — frames noires/statiques. Toujours `<OffthreadVideo>`.
  2. `<OffthreadVideo>` DOIT etre dans `<Sequence from={BEATS.xxx.start}>` — sans Sequence, frame absolu depasse duree clip = freeze sur derniere frame.
  3. Toujours `muted` sur `<OffthreadVideo>` Kling — Kling genere toujours une piste audio (respirations, ambiance) meme sans le demander.
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
- Crop recommande : identifier la zone active de l'asset, cadrer dessus via viewBox

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
- Style guide : `memory/svg-enluminure-style-guide.md` + `memory/visual-manifesto.md`
- Hook : TERMINE (HookMaster v2, ~80.9s, score Kimi 9/10)
- Restant : S1 Flagellants → S6 Miroir (~8m30s)

### GeoAfrique — Abou Bakari II (satellite)
- Style : **Flat design 2D — Seedance 2.0 (principal) + Kling (4K/API backup) + Remotion overlays**
- **Pipeline principal (2026-03-31)** : Seedance 2.0 via Dreamina web → ffmpeg strip audio → Remotion OffthreadVideo + Audio ElevenLabs. Format : SECONDS X TO Y + COLOR GRADE.
- Pipeline legacy : Gemini source → retouche chirurgicale → Kling V3/O3 → integration Remotion (garde pour 4K et quand API Seedance indisponible)
- Etat : **BEATS 01-09 TOUS COMPLETES** — reste musique Suno + render final
- Details etat : `memory/COMPACT_CURRENT.md`

### Seedance 2.0 / Dreamina — OUTIL PRINCIPAL (valide 2026-03-31, 7 tests)
- **Acces** : Dreamina web uniquement (API suspendue overseas). Credits achetables + gratuits journaliers.
- **Force** : coherence personnage parfaite (0 morphing/7 tests), multi-ref (2 personnages distincts valide), format SECONDS X TO Y = controle de realisateur, POV→3e personne, foule 30+ elements, SFX/musique generes
- **Faiblesse** : audio uploade re-synthetise (mots deformes), max 15s, 720p en gratuit, pas d'API
- **Reference complete** : `memory/seedance-reference.md` — tous les tests, regles, lecons, comparaisons Kling
- **Workflow** : Seedance video → `ffmpeg -an -c:v copy` → Remotion `<OffthreadVideo>` + `<Audio>` ElevenLabs (offset ~9 frames)
- **Formats prompt** (du simple au precis) : narratif lineaire (~40 mots) | "Shot 1/2/3" (~75 mots) | "SECONDS X TO Y" (~200 mots, timecodes seconde par seconde)
- **COLOR GRADE** : section en fin de prompt pour ancrer la palette sans ref image (80 credits text-to-video vs 120 avec refs)
- **POV → 3e personne** : transition de perspective dans un meme clip, sans coupure (valide par createur tiers)
- **Video-to-video** : uploader video existante + demander ajouts (non teste par nous)
- **Refs** : plan-sequence = 1 ref max, zero ref decor. Multi-shot = 1-3 refs perso + 1-2 refs decor.
- **POV → 3e personne VALIDE (2026-03-30)** : transition de perspective dans un seul clip continu. Camera "decolle" du personnage sans cut. Kling incapable — Seedance unique en son genre.
- **Flotte/foule massive** : Seedance genere 30+ elements coherents en style flat 2D (memes proportions, meme palette). Kling drift apres 3-4 elements. Pour scenes avec multiples navires/soldats/foules → Seedance.
- **"gradually" = mot-cle anti-artefact** : evite l'apparition soudaine d'elements reveles par la camera. Toujours utiliser dans les segments reveal.
- **Orbite 180 VALIDEE (2026-03-31)** : "Camera begins a slow orbit clockwise around" avec reperes par segment (face → profil → 3/4 dos → dos). Coherence personnage parfaite sous tous les angles. Ideal pour intro palais, reveal decor. Score 9.5/10.
- **Audio SFX/musique utilisable** : garder les SFX et musique generes par Seedance + overlay voix ElevenLabs = gain d'une etape production. Ne remplacer que la narration.
- **Multi-personnage VALIDE (2026-03-31)** : 2 refs, 2 identites, zero fusion pendant 10s. Scenes dialogue/confrontation possibles.
- **Seedance = ultra-litteral** : "uphill" = pente 45deg, "forward" = horizontale. Specifier chaque axe/direction explicitement.
- **1 ref max si personnages similaires** : 2 refs trop proches = fusion. Decrire soldats par texte ("silhouettes WITHOUT cape").
- **Format 9:16 DISPONIBLE** dans Dreamina (confirme Aziz, non encore teste).
- **Details complets** : `memory/seedance-reference.md` + `research/seedance-examples/REFERENCE.md`

### Methodes Kling (valides 2026-03-16)
| Methode | Endpoint | Quand |
|---------|----------|-------|
| V3 Pro | `v3/pro/image-to-video` | Portrait cinématique, 5-10s |
| V3 Standard | `v3/standard/image-to-video` | Scene symbolique/locked, economique |
| O3 Standard | `o3/standard/image-to-video` | Scene epique, start+end frame |
- cfg_scale 0.3 = plus stable (moins de morphing), 0.4 = plus creatif. cfg_scale = adherence au prompt, PAS intensite mouvement.
- Plan moyen (sujet 50-55% cadre) OBLIGATOIRE pour tout mouvement camera
- Morphing O3 sur flat 2D : degrade apres ~6-8s — couper avec durationInFrames
- **Duree clips = duree beats audio (2026-03-29)** : Kling supporte `duration: "5"` et `duration: "10"`. Toujours generer un clip dont la duree approche la duree du beat narratif. Clip 10s pour beat 12s = playbackRate 0.83x (naturel). Clip 5s pour beat 12s = playbackRate 0.42x (slow-mo artificiel, statique).
- **Mouvement dynamique = prompt engineering (2026-03-29)** : Kling n'a PAS de parametre "motion intensity". Le mouvement se controle UNIQUEMENT par le vocabulaire du prompt. Verbes d'action : "PRESSES", "MARCH", "RUSHES", "STRIKES". Camera : "tracking shot", "whip-pan", "dynamic". JAMAIS "atmospheric movement only" / "subtle" / "gentle" sauf intention explicite de calme. "atmospheric movement only" = quasi-immobilite garantie.

### Regles Pipeline Vivid Flat 2D + Kling (2026-03-17, VALIDEES)
- **NO TEXT dans les frames source (NON-NEGOTIABLE, 2026-03-29)** : ZERO texte, chiffre, date, label, tampon, titre visible dans toute image envoyee a Kling ou Seedance. Kling anime le texte et produit des artefacts garantis (lettres qui morphent, dates qui scintillent, ecritures qui se tordent). Correction : regenerer la frame source avec `negative_prompt: "text, writing, letters, numbers, dates, subtitles, captions, watermark"` + prompt explicite "completely blank paper / no text anywhere". Les elements textuels (dates, labels, timelines) appartiennent a Remotion en post-production, jamais dans les frames Kling/Seedance.
- **Ecart start→end MINIMAL** : meme angle, meme distance camera, UN seul element change. Ecart trop grand = Kling improvise.
- **Soldats de dos = marche naturelle. Soldats de profil = glissement lateral artificiel.** Toujours orienter les personnages secondaires de face ou de dos.
- **Frame chaining** : extraire derniere frame du clip valide via ffmpeg → Gemini edit → start frame clip suivant. Continuite parfaite sans regeneration.
- **Gemini 3.1 Flash Image = correcteur chirurgical** entre Recraft et Kling. Partir toujours de la frame existante, jamais generer from scratch pour un end frame.
- **Analyse critique 5 points obligatoire** sur chaque clip : (1) style personnages secondaires, (2) orientation corps, (3) elements inventes, (4) mouvements anormaux, (5) coherence palette debut→fin.
- **Caméra qui avance vers des dos = dérive semi-réaliste** : Kling invente les détails non visibles (nuques, vêtements). Correction : cfg_scale 0.45 ou end frame plus schématique.
- **Style ID Recraft = verrouille le style graphique, PAS l'identité du personnage.** Portrait REF separé obligatoire pour coherence inter-clips.
- Clip masterpiece reference : `tmp/brainstorm/references/hannibal-army-appear-MASTERPIECE.mp4`
- Details complets : `memory/video-generation-pipeline.md` + `memory/key-learnings.md`

### Pipeline Batch Short YouTube — Ordre Optimal (2026-03-30, v2 apres tests Kimi + Gemini)
```
1. Script (Cesar formula / youtube-scriptwriting skill)
2. Kimi K2.5 script review (~$0.005, iterer jusqu'a satisfaction)
3. Audio ElevenLabs (voix V3, speed 0.88 pour documentaire)
4. ffprobe → timestamps exacts par beat narratif
5. Kimi K2.5 storyboard direction (script time-code → multi-shots avec secondes)
   + Pass 3 simplification (max 3 persos, 1 focal, zero texte/gore)
6. Storyboard Gemini INDIVIDUEL (1 appel par beat, PAS de grille 3x3)
7. Kling clips I2V (duration = duree du beat, prompts dynamiques)
8. Assemblage Remotion (OffthreadVideo, playbackRate ~0.8-1.0)
```
**Skill complet** : `.claude/skills/batch-short-production/` (9 phases, 6 scripts, Kimi 3 passes)
**Erreurs a ne pas repeter** :
- Generer clips AVANT audio → durees non calees
- Grille 3x3 Gemini → crops foireux, images trop petites, layouts imprevisibles
- Brief Kimi non simplifie → Gemini surcharge (foules, gore, texte, subdivisions)
- Kimi APRES audio → si le script change, on refait tout

---

## Pipeline Hybride Recraft + Remotion (VALIDE 2026-03-09)

**Principe** : Recraft V4 Vector genere les assets SVG, Remotion anime.

**Workflow valide** :
1. Upload storyboard panel comme style reference via `POST /styles`
2. Generer assets individuels (pirogue, silhouette Afrique, etc.) → SVG natif
3. Extraire paths du SVG, ignorer les `<style>` et `<animate>` CSS
4. Re-implementer chaque animation en `spring()` / `interpolate()` Remotion

**Caveat non-resolu** : nommage semantique des paths dans le SVG Recraft non confirme (les `id` des elements peuvent etre `path1`, `path2` — pas de labels narratifs). A valider sur premier asset.

**Pricing** : ~$0.08/image via API Recraft (acceptable)

**MCP officiel** : `github.com/recraft-ai/mcp-recraft-server` (disponible)

**Modeles Recraft (VERIFIE FINAL 2026-03-10)** :
- `recraftv4_vector` : MEILLEUR SVG — utiliser pour GeoAfrique via API directe
- `recraftv4_pro_vector` : SVG premium 4MP — si qualite maximale requise
- `recraftv3` / `recraftv3_vector` : styles/substyles disponibles, via MCP ou API directe
- MCP installe : supporte recraftv3/v2 uniquement — V4 = API directe obligatoire
- Parametre `controls` (fond noir, palette) : API directe uniquement
- Details complets : `memory/recraft-pipeline.md`

---

## Bibliotheque d'Animation (src/hooks/animation/index.ts)

> Hooks asset-agnostiques valides en production. Toujours importer depuis ce fichier plutot que re-coder.

| Hook | Usage | Signature |
|------|-------|-----------|
| `useOceanSwell(i, frame)` | Houle individuelle par element | → `ty: number` (translateY) |
| `useSpringEntrance(i, frame, fps, delay?)` | Apparition decalee spring | → `opacity: number` 0→1 |
| `useDrift(i, frame, directionPx, totalFrames?, offset?)` | Deplacement progressif clamp | → `tx: number` (translateX) |

**Regle bibliotheque** : Un hook valide par Aziz = il entre dans `index.ts`. Jamais re-coder dans les composants.

---

## Regle : Images de Reference Personnages (NON-NEGOTIABLE)

- Dossier canonical : `public/assets/geoafrique/characters/`
- Nommage : `[personnage]-[description]-REF.png`
- Jamais supprimer ces fichiers — ils sont le "seed" Gemini
- Pour toute nouvelle scene avec un personnage existant : passer le REF comme `Part.from_bytes()` dans Gemini
- Gemini sans image de reference = derive garantie du visage (barbe, proportions, kufi)

---

## Regle : Respecter l'Asset Recraft (NON-NEGOTIABLE)

> Validee session 2026-03-09 apres 4 iterations perdues.

- Un asset Recraft a une harmonie mathematique interne (positions, calques, proportions)
- **NE PAS** reordonner les calques SVG, changer le `preserveAspectRatio`, ou forcer la geometrie
- **ANIMER UNIQUEMENT** : opacity, translate, rotate, scale — PAS la structure
- Si l'image ne convient pas : **changer le prompt Recraft**, pas tordre le SVG
- `preserveAspectRatio="xMidYMid meet"` + `backgroundColor` sur AbsoluteFill = regle technique obligatoire

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
- `PIXELLAB_API_KEY` : sprites pixel art (archive — pipeline abandonne Peste)
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

## Methodes de Controle — Tableau de Bord (LIRE AVANT de choisir une approche)

> Pour chaque situation, Claude doit choisir la bonne methode PROACTIVEMENT — sans qu'Aziz le demande.

| Situation | Methode | Quand NE PAS l'utiliser |
|-----------|---------|------------------------|
| Modifier 1 detail d'un asset existant (couleur, lumiere, objet) | **Nano Banana** : gemini-2.0-flash (extraction JSON) → modifier 1 champ → gemini-3-pro-image-preview (regeneration) | Assets a creer from scratch — Nano Banana = chirurgical, pas generatif |
| Nouveau personnage avec coherence faciale sur plusieurs scenes | **Gemini multimodal REF** : passer l'image REF comme `Part.from_bytes()` + prompt texte. Stocker le resultat dans `characters/` | Personnage completement nouveau sans REF existant — generer d'abord une REF de base |
| Clip Kling avec transition controlee entre deux compositions | **O3 Start+End Frame** : `fal-ai/kling-video/o3/standard/image-to-video` avec `start_image_url` + `end_image_url`, cfg_scale 0.4 | Scenes sans transition narrative claire (O3 = dolly in/out, pivot, zoom) |
| Clip Kling sur personnage plat (animation d'une image unique) | **V3 standard** : `fal-ai/kling-video/v3/standard/image-to-video`, cfg_scale 0.35 | Cartes geographiques (V3 invente la geographie hors-champ) |
| Clip Kling sur carte geo / flat design geographique | **V2.1 standard** : `fal-ai/kling-video/v2.1/standard/image-to-video`, cfg_scale 0.6 | Personnages (V2.1 glisse — l'image avance, pas le personnage) |
| Duree clip Kling a choisir | **V3/O3 : 3→15s par pas de 1** (ex: "13", "14", "15" valides). Toujours utiliser la duree exacte du beat Whisper. | V2.1 : seulement "5" ou "10" — pas d'autres valeurs |
| Parametres scene Remotion modifiables sans toucher le composant | **TypeScript Manifest** : fichier `manifests/beatXX-manifest.ts` + composant qui lit le manifest. Tout hardcode interdit dans le composant. | Scenes trop simples (< 3 parametres a varier) |
| Animer flotte/decor SVG Recraft dans Remotion | **Hooks bibliotheque** : `useOceanSwell`, `useSpringEntrance`, `useDrift` depuis `src/hooks/animation/index.ts` | Animations complexes non couvertes — creer un nouveau hook dans index.ts |
| Clip Kling avec mouvement organique (eau, foule, vent) | **V3 cfg 0.4 sur asset Recraft** : preserve le style vectoriel flat sans le deformer. `multi_prompt` disponible pour sequences. | Cartes geo (drift catastrophique) |
| Ecrire un prompt Kling | **Gemini Kling Director** : brief narratif FR → Gemini → 3 variantes optimisees (angles camera, cfg, timing). Claude ne redige jamais les prompts Kling directement. | Relances mineures sur un prompt deja valide |

### Regles de selection automatique
- **Carte geo** → V2.1 par defaut. V3 testable uniquement si V2.1 insuffisant + cfg 0.3-0.4 max.
- **Personnage avec barbe/details** → Gemini multimodal REF obligatoire avant tout end frame.
- **Asset existant a modifier** → Nano Banana d'abord. Jamais regenerer from scratch si l'asset existe.
- **Beat avec transition cinematique** → O3 start+end. V3 pour animation interne.
- **Parametres qui changent entre versions** → manifest. Sinon → hardcoder est acceptable.
- **Prompts Kling (TOUS les projets)** → Gemini Kling Director d'abord. Claude ne redige jamais les prompts Kling directement. Workflow : brief narratif FR → Gemini → 3 variantes optimisees → Claude lance le meilleur. Valide 2026-03-18 sur Amanirenas Beat01.

### Regles assets Kling (validees 2026-03-18)
- **Sol/terrain** : zero bandes horizontales blanches dans startframe ET endframe — Kling interprete comme riviere → morphing garanti. Utiliser Gemini Nano Banana pour corriger avant tout lancement.
- **Oeil ferme / cicatrice** : si le shape anatomique de l'oeil est present (courbe de paupiere), Kling l'animera. Solution : surface plate (zero courbe) + marque graphique uniquement.
- **Guerriers en flanking** : ne jamais demander "arrive des deux cotes" sans "never crossing the center" — collision garantie au milieu du 9:16.
- **cfg_scale Dolly-In O3** : 0.35 recommande (0.45 = style drift en fin de clip sur flat design).

### Scripts de reference
| Methode | Script | Output |
|---------|--------|--------|
| Nano Banana | `scripts/test-nano-banana-method.py` | `tmp/nano-banana-test/` |
| Gemini multimodal REF | `scripts/generate-beat02-v2.py` (pattern) | `characters/` |
| O3 start+end | `scripts/test-kling-o3-beat01-v2.py` (pattern) | `public/assets/geoafrique/` |
| V3 personnage | `scripts/generate-beat02-o3.py` (pattern) | `public/assets/geoafrique/` |

---

## Techniques Geo Validees (GeoAdvancedV2.tsx — reference)

1. **Hachures SVG** : `<pattern>` + `patternTransform rotate(frame * 0.3)`
2. **Vignette** : `radialGradient` opacity interpolee
3. **Zoom CSS fluide** : `translate(target) scale(zoom) translate(-target)` + `Easing.inOut(cubic)`
4. **Draw-on** : `strokeDashoffset` + `interpolate()`
5. **Pulse rings** : modulo `% PERIOD` pour boucle infinie
6. **Zoom-blur transition** : outScale 1→1.12 + blur 0→8px | 18 frames optimal

---

## Gotchas ElevenLabs TTS (Chris fr)

- Participes passes en "e" : drop systématique → remplacer par constructions sans accent final
- "ont + voyelle" → liaison bizarre → remplacer par passe simple
- Noms de villes "s" final → liaison bizarre → ecrire sans "s" phonetique

---

## Regles Absolues Process

- **NO EMOJIS** dans `.ts/.tsx/.js/.json/.yaml/.env` (autorise dans `.md`)
- **Audio-first** : generer audio → mesurer ffprobe → coder
- **Mini-render apres chaque beat** : `npx remotion render --frames=START-END`
- **Contrat Visuel AVANT code** (toute scene >10s) : tableau frames/visuel/ce-qui-change
- **Zoom geo = CSS transform** : JAMAIS D3 re-projection par frame
- **Storyboard first** : avant tout projet visuel geo/carte (coupe 2-3 cycles iteration)

### Pipeline Shorts GeoAfrique — Ordre INVIOLABLE (NON-NEGOTIABLE)

Appris a la dure : clips Kling generes avant audio final = tout a refaire quand le script change.

```
1. Script definitif valide par Aziz (mot pour mot, aucune modification apres)
2. Generation audio ElevenLabs V3
3. Whisper → mesure timings reels par segment
4. timing.ts stable et valide
5. Generation clips Kling (duree = timing reel du beat)
6. Integration Remotion + mini-render
```

JAMAIS dans un autre ordre. ZERO clip Kling avant timing.ts stable.
Si le script change apres l'etape 1 → recommencer depuis l'etape 2, pas patcher.
