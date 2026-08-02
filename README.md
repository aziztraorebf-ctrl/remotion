# Remotion — GeoAfrique Video Production

Pipeline de production de videos courtes historiques africaines (YouTube Shorts 9:16) combinant **Remotion** (React video framework) et des outils IA de generation video (Seedance 2.0, Gemini, ElevenLabs, Minimax Music).

Le projet heberge egalement des prototypes de videos educatives longues format.

---

## Projets actifs

| Short | Sujet | Statut |
|-------|-------|--------|
| **Sonjata Papercraft** | Epopee de Soundjata Keita (empire Mali, XIIIe s.) | 10/10 scenes assemblees, render 146s complet. Finitions : musique, normalisation audio, CTA |
| **Abou Bakari II** | Voyage transatlantique du mansa (XIVe s.) | Beats 01-09 animes. Reste musique + render final |
| **Thiaroye 1944** | Massacre des tirailleurs senegalais | Pivot paper-craft palette froide. Manifest JSON en place |
| **Chaine News geopolitique** | Format news quotidien | Systeme valide, execution post-3 Shorts |

Tous les Shorts utilisent le style **paper-craft sepia** (decors decoupes papier, personnages dot-eyes, palette chaude). Regles documentees dans memory/style-papercraft-sepia.md.

---

## Pipeline de production

```
0. Script locked (Aziz)
   |
   v
1. audio-director       -> Narration ElevenLabs + musique Minimax + mix mesure
   |
   v
2. storyboarder         -> timing.ts frame-precis (derive ffprobe/Whisper)
   |
   v
3. visual-producer      -> Visual Plan scene-by-scene -> Aziz approuve
   |
   v
4. visual-producer      -> Assets generes (Seedance / Gemini / Kling / Recraft)
   |                      preview-before-pay sur chaque appel
   v
5. remotion-composer    -> Composition + mini-render 3-4s bloquant
   |
   v
6. quality-reviewer     -> Self-review + Kimi (scope technique) + verdict
   |
   v
7. Aziz                 -> Validation oreille + oeil + jugement creatif
   |
   v
8. Render final + publish
```

Regles du pipeline, non-negociables :
- Zero clip video avant que `timing.ts` soit stable
- **Duree clip Seedance >= duree narration** (arrondir a la seconde superieure)
- Preview-before-pay sur chaque appel API couteux
- Mini-render validation AVANT de coder d'autres scenes
- Scan TTS francais obligatoire avant ElevenLabs (participes "e/ee", liaisons "ont + voyelle", chiffres en lettres)

Details complets : `memory/tools/pipeline.md` et `.claude/agent-memory/shared/PIPELINE.md`.

---

## Stack technique

### Framework
- **Remotion** 4.0.415 — composition video React/TypeScript
- **TypeScript** strict mode, zero `any`
- **Node.js** 24.x, npm (pas de bun)

### Generation IA video/image
- **Seedance 2.0** (bytedance via fal.ai) — image-to-video, reference-to-video, storyboard-to-video
- **Kling** (fal.ai) — plans 4K, start/end frame
- **Gemini** 3 Pro / Imagen 4.0 — images, editions chirurgicales, character sheets
- **Recraft V4** — style ID vivid shapes (thumbnails, branding)
- **PixelLab** — sprites pixel art (archive, plus utilise en prod)

### Audio
- **ElevenLabs V2 multilingual** — narration francaise (voix Chris)
- **ElevenLabs Sound Generation** — SFX (feu, tambours, plumes, etc.)
- **Minimax Music 2.6** (via fal.ai) — musiques de fond
- **Forced alignment ElevenLabs** — timestamps mot-a-mot pour sync visuelle
- **ffmpeg** — normalisation loudnorm, mix, strip audio

### Rendu
- Local : `npx remotion render`
- Cloud : `scripts/tools/render-on-vercel.py` — POC ABANDONNÉ (2026-03-27), pointe vers un repo séparé jamais synchronisé. NE PAS UTILISER. Pour D3/SVG pur : `npx remotion render` local. Pour Mapbox/WebGL : `scripts/render-mapbox.sh` (obligatoire).
- Upload : Vercel Blob pour review mobile-friendly

---

## Structure du projet

```
src/
  projects/
    geoafrique-shorts/        Shorts actifs (Sonjata, Soundjata, etc.)
      manifests/              Manifests JSON par scene (timing, couleurs, textes)
    [autres projets]
  characters/                 Stick figures SVG (projets anciens)
  components/                 Decors partages

scripts/
  generate-audio.ts           Pipeline ElevenLabs
  polish-audio.ts             Pipeline Auphonic (normalisation)
  render-on-vercel.py         POC ABANDONNE (2026-03-27) - NE PAS UTILISER, voir section Rendu
  pipeline_gates.py           13 gates pre-API bloquants
  batch_runner.py             Batch de generations Seedance
  tools/                      Scripts one-shot par scene (generate-sceneX, seedance-acteY, etc.)

memory/                       Memoire projet (regles, briefs, learnings)
  pipeline.md                 Ordre de production inviolable
  rules-seedance.md           Regles prompts Seedance
  rules-gemini.md             Regles edition chirurgicale
  rules-pipeline.md           Alignment, manifest, budget
  rules-production.md         TTS, workflow, collaboration
  tools/                      Docs par outil (seedance, gemini, kling, elevenlabs, recraft)
  templates/                  Templates de prompts (combat, narratif, montage)

.claude/
  agents/                     5 agents de production (voir ci-dessous)
  agent-memory/               Memoire par agent + PIPELINE.md partage
  skills/                     (batch-short-production/video-production/youtube-scriptwriting
                                supprimes 2026-08-01, morts depuis mars, remplaces par
                                memory/doctrines/RECHERCHE-PRESCRIPT-UNIFIEE.md + DOCTRINE-SCRIPT-UNIFIEE.md)

public/
  assets/library/             Assets REF canoniques par projet/personnage
```

---

## Agents de production (5)

Specialises par **role de production**, pas par outil (les outils evoluent vite, les roles sont intemporels).

| Agent | Role | Stage |
|-------|------|-------|
| `audio-director` | Narration TTS + musique + mix. Scan TTS francais obligatoire | 1 |
| `storyboarder` | Script + audio mesure -> `timing.ts` frame-precis | 2 |
| `visual-producer` | Assets multi-outils (Seedance/Gemini/Kling/Recraft/PixelLab) | 3-4 |
| `remotion-composer` | Composition Remotion + mini-render validation bloquant | 5 |
| `quality-reviewer` | Self-review + Kimi scope technique + verdict | 6 |

Les agents ecrivent tour-a-tour dans `.claude/agent-memory/shared/PIPELINE.md` pour que le suivant ait le contexte complet. Agents archives (creative-director, pixel-art-director, pixellab-expert, kimi-reviewer, visual-qa) dans `.claude/agents/archive/`.

---

## Demarrage rapide

```bash
# Installer les dependances
npm install
pip install -r requirements.txt    # si fichier present

# Lancer le Studio Remotion (preview)
npm run dev                        # http://localhost:3000

# Generer un audio ElevenLabs
npx tsx scripts/generate-audio.ts

# Render local
npx remotion render SonjataPapercraft out/sonjata.mp4

# Render cloud (Vercel) -- POC ABANDONNE, NE PAS UTILISER (voir section Rendu ci-dessus)
```

---

## Configuration

Creer un fichier `.env` a la racine (JAMAIS commit) :

```
# Audio
ELEVENLABS_API_KEY=sk_...
AUPHONIC_API_KEY=...

# LLMs
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIza...
XAI_API_KEY=xai-...
MOONSHOT_API_KEY=sk-...          # Kimi K2.5 review

# Generation image/video
FAL_KEY=...                      # Seedance, Kling, Minimax Music, fal.ai
RECRAFT_API_KEY=...
PIXELLAB_API_KEY=...

# Rendering
VERCEL_RENDER_URL=https://remotion-renderer-khaki.vercel.app
```

---

## Conventions

### Code
- **Pas d'emojis** dans `.ts`/`.tsx`/`.js`/`.json`/`.yaml`/`.env` (autorises dans `.md`/`.txt`)
- **Types stricts** : pas de `any`, pas de `as unknown`
- **Timing audio-derive** : toute animation synchronisee avec la narration doit deriver ses frames de la timeline audio (variable), pas de hardcode `const arrowStart = 30;`
- **`spring()` > `interpolate()`** pour mouvements naturels
- **`premountFor`** sur chaque `Sequence` pour precharger
- **Clamp** toutes les interpolations : `extrapolateRight: 'clamp', extrapolateLeft: 'clamp'`

### Anti-patterns Remotion INTERDITS
- `CSS transition:` -> utiliser `useCurrentFrame()` + `interpolate()`
- `setTimeout`/`setInterval` -> utiliser frames Remotion
- `@keyframes` -> utiliser `spring()` ou `interpolate()`

### Safe zones video (9:16, 1080x1920)
- Marges laterales minimum : 100px
- Marges haut/bas minimum : 60px
- Zone sous-titres : Y >= 1700 reservee
- Texte minimum : 32px (titres : 48px+)

---

## Budget & cout

Sonjata Papercraft (cumule sur 10 scenes) : ~$52.50
- Gemini images : ~$3
- Seedance clips (V1 Pro + V2) : ~$40
- ElevenLabs (narration + SFX) : inclus plan
- Render cloud : negligeable

Regles budget dans memory/rules-pipeline.md.

---

## Licence

Projet personnel, non-public. Voir Aziz pour usage.
