# remotion-composer — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Last updated: 2026-04-13 (initial)

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

### Vercel Sandbox render
- URL : `VERCEL_RENDER_URL` dans .env (`https://remotion-renderer-khaki.vercel.app`)
- Script helper : `scripts/render-on-vercel.py`
- Compositions disponibles : `MyComp`, `GeoTest` (a jour du 2026-04-12)
- Dependencies limitees : pas tous les packages NPM disponibles

---

## Safe zones actually needed per platform

| Platform | Ratio | Top reserved | Bottom reserved | Side reserved |
|----------|-------|--------------|-----------------|---------------|
| YouTube Shorts | 9:16 | 100px (title) | 250px (channel + description) | 60px |
| TikTok | 9:16 | 150px (UI top) | 300px (UI bottom + description) | 80px |
| Instagram Reels | 9:16 | 100px | 250px | 60px |
| YouTube long-form horizontal | 16:9 | 60px | 100px (subtitles) | 100px |

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

## New gotchas discovered

_Liste vide au demarrage. Ajouter ici les decouvertes specifiques Remotion._

---

## Session log

### 2026-04-13 (initial)
Agent cree. Patterns herites du projet existant (Soundjata Acte VI, Historical Map, Abou Bakari Short) documentes ici.
