# remotion-composer — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Last updated: 2026-04-22 (hook pattern + musique Option B + SonjataShortFull reference impl)

---

## Reusable component patterns per project family

### Shorts (1080x1920, 30fps)
- Structure : 1 composition principale + 1 sub-component per scene narrative
- Audio : `<Audio src={staticFile('audio/{project}/narration.mp3')} volume={1.0} />` + musique -18dB en fond
- Typographie : sans-serif pour hook, serif (Cormorant Garamond) pour corps narratif
- Safe margins : top 120px (notch), bottom 200px (UI), left/right 60px

### Long-form vertical (1080x1920, 30fps)
- Structure : 1 composition principale + 1 file par Acte + 1 sub-component per sub-scene
- Audio : narration complete + musique contextuelle par acte
- Typographie : Cormorant Garamond calligraphique (valide Soundjata Acte VI)

### Long-form horizontal (1920x1080, 30fps)
- Structure : similaire vertical mais layouts differents
- Subtitle zone : Y >= 850 reservee

---

## Spring configs validated

```typescript
// Smooth ease-in/out — entrees elegantes
spring({ frame, fps, config: { damping: 200 } })

// Snappy entry — pop-in controle
spring({ frame, fps, config: { damping: 20, stiffness: 200 } })

// Bouncy impact — stamps, impacts emotifs
spring({ frame, fps, config: { damping: 8 } })

// Smooth scale sur une duree longue (intros)
spring({ frame: frame, fps, config: { damping: 100, mass: 1.5 } })
```

---

## Remotion API gotchas per version

### @remotion/transitions
- `TransitionSeries.Sequence durationInFrames` = duree de la scene AVANT transition
- Les transitions OVERLAP sur les scenes adjacentes — calcul : `totalComp = sum(durations) - sum(transitions)`
- `linearTiming({ durationInFrames: N })` = timing simple
- Presentations : `fade()`, `slide()`, `wipe()`, `flip()`, `clockWipe()`

### @remotion/paths & @remotion/shapes
- `evolvePath` pour dessiner progressivement un SVG path
- `makeCircle`, `makeTriangle`, etc. pour formes procedurales

### Vercel Sandbox render (limite)
- URL : `VERCEL_RENDER_URL` dans .env (`https://remotion-renderer-khaki.vercel.app`)
- Script helper : `scripts/render-on-vercel.py`
- **Limitation decouverte 2026-04-22** : `public/audio/` est dans `.gitignore`, donc les fichiers audio du projet ne sont PAS accessibles au renderer Vercel. Solution : render local puis upload MP4 compresse via `scripts/tools/upload-to-blob.py`.
- Compositions disponibles : a verifier selon `src/Root.tsx` (ne pas se fier a une liste statique)

### Render local + upload Vercel (workflow valide 2026-04-22)
```bash
# 1. Render local
npx remotion render <CompId> /tmp/<name>.mp4 --codec=h264 --crf=23

# 2. Compress for Vercel (H264 CRF 28, ~40% reduction)
ffmpeg -y -i /tmp/<name>.mp4 -c:v libx264 -preset fast -crf 28 \
  -c:a aac -b:a 128k -movflags +faststart /tmp/<name>-compressed.mp4

# 3. Upload
python3 scripts/tools/upload-to-blob.py /tmp/<name>-compressed.mp4 \
  --folder <project>/renders
```

**Quota Vercel Blob Hobby = 1GB**. Si "Storage quota exceeded" : `scripts/tools/cleanup-blob.py <prefix>` pour supprimer anciens renders/galleries avant de retenter.

---

## Safe zones actually needed per platform

Voir RULES-ACTIVE.md §Safe Zones.

---

## Audio-derived timing patterns validated

```typescript
// Good pattern — always import from timing.ts
import { SCENES, FPS } from './timing';
const introFadeEnd = SCENES.intro.end;
const heroEntryFrame = SCENES.hero_appears.start;

// Good pattern — spring at scene local frame
const OceanScene: React.FC = () => {
  const frame = useCurrentFrame();  // local to Sequence
  const opacity = spring({ frame, fps: 30, config: { damping: 200 } });
  // ...
};
```

---

## HOOK PATTERN (valide 2026-04-22 sur Sonjata)

### Structure Sequence avec hook + scenes decalees

```typescript
const HOOK_DURATION_S = 5;
const HOOK_FRAMES = HOOK_DURATION_S * FPS;

// cumulative commence a HOOK_FRAMES, pas 0
let cumulative = HOOK_FRAMES;
for (const f of sceneFrames) {
  startFrames.push(cumulative);
  cumulative += f;
}
const TOTAL_FRAMES = cumulative;
const SCENES_START_FRAME = HOOK_FRAMES;
const SCENES_DURATION = TOTAL_FRAMES - HOOK_FRAMES;
```

### Hook Sequence (silence musique)
```tsx
<Sequence from={0} durationInFrames={HOOK_FRAMES} premountFor={FPS}>
  <OffthreadVideo
    src={staticFile("assets/<project>/hook/hook-xxx-5s.mp4")}
    muted  // IMPORTANT : couper audio du clip source
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
  <Audio src={staticFile("audio/<project>/hook-narration.mp3")} />
</Sequence>
```

### Musique background — Option B (silence pendant hook)
```tsx
<Sequence from={SCENES_START_FRAME} durationInFrames={SCENES_DURATION}>
  <Audio
    src={staticFile("audio/<project>/music.mp3")}
    volume={musicVolume}
  />
</Sequence>

// musicVolume utilise relativeFrame (0-based dans la Sequence)
const musicVolume = (frame: number) => {
  const fadeIn = interpolate(frame, [0, FADE_IN_FRAMES], [0, MUSIC_VOLUME],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame,
    [SCENES_DURATION - FADE_OUT_FRAMES, SCENES_DURATION], [MUSIC_VOLUME, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.min(fadeIn, fadeOut);
};
```

**Constantes reference** :
- `MUSIC_VOLUME = 0.15` (~-16.5dB)
- `FADE_IN_FRAMES = 2 * FPS`
- `FADE_OUT_FRAMES = 2 * FPS`

### Reference implementation complete
`src/projects/geoafrique-shorts/SonjataShortFull.tsx` (Sonjata Short 151s valide 2026-04-22)

Template : `memory/templates/hook-short.md`

---

## New gotchas discovered

### GOTCHA 2026-04-22 — `public/audio/` gitignored = bloque render Vercel
Le dossier `public/audio/` est dans `.gitignore`. Consequence : le renderer Vercel Sandbox ne recoit pas les fichiers audio. Render local obligatoire pour tout projet avec narration/musique. Upload MP4 compresse post-render via `upload-to-blob.py`.

### GOTCHA 2026-04-22 — OffthreadVideo `muted` pour clip source avec audio
Si on reutilise un segment video d'un render precedent (qui contient deja narration + musique), passer `muted` sur `<OffthreadVideo>` sinon l'audio du clip se mixe avec la narration hook. Pattern : clip visuel muet + `<Audio>` hook narration superposee.

---

## Identite GeoAfrique Shorts

- Format : 9:16 (1080x1920)
- FPS : 30
- Pipeline video : Seedance/Kling clips + Ken Burns Remotion pour transitions
- Audio : kora Minimax (musique) + ElevenLabs Narratrice GeoAfrique v2 (narration)
- Style visuel : paper-craft sepia (depuis Sonjata/Thiaroye)
- Audio volume musique valide : 0.07

---

## CHANGELOG

- 2026-04-13 : initial setup, 8 regles non-negociables
- 2026-04-22 : Sonjata session 8, pattern Hook + Option B musique valide (reference : `SonjataShortFull.tsx`)
- 2026-04-24 : refactor memoire (creation RULES-ACTIVE.md + CHECKLIST-PRE-COMPOSE.md, split Geo vers `memory/tools/remotion-geo.md`)
- 2026-04-25 : safe zones table -> pointeur RULES-ACTIVE.md ; section Identite GeoAfrique Shorts ajoutee
