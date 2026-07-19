# remotion-composer — Agent Memory

> Persistent memory across sessions. Updated after every invocation.
> Last updated: 2026-05-13 (Agent Teams activés, règle STOP si asset manquant, budget API)

---

## NOUVEAUTES SESSION 2026-05-13

### Agent Teams activés (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1)
- Feature activée dans `~/.claude/settings.json`
- Le remotion-composer peut recevoir des assets directement de visual-producer via le système d'agent teams, sans passer par Claude principal
- /goal et /bg disponibles en session interactive — permettent de boucler autonomement

### Règles budget API — source de vérité : `.claude/agents/API-BUDGET-RULES.md`
| Situation | Règle |
|-----------|-------|
| Remotion render | $0 — jamais de raison de restreindre |
| Asset manquant au moment d'assembler | STOP immédiat — lister ce qui manque — signaler à Aziz — ne JAMAIS appeler visual-producer autonomement |
| Mini-render Vercel (remote) | 1 seul appel — vérifier résultat avant full render |
| SFX ElevenLabs découvert manquant | STOP — signaler — ne pas générer autonomement |

**Règle absolue** : le remotion-composer est un agent de code pur ($0). Tout appel API payant depuis cet agent = FAUTE DE PROCESSUS. Remonter à Claude principal.

### Checkpoint post-mini-render (ajout 2026-05-13)
Après chaque mini-render : analyser les frames extraites soi-même → former verdict → présenter à Aziz. Ne pas enchaîner vers le full render sans validation.

---

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

---

## SESSION 2026-06-28 — Cacao Short VERSION B (B1HookVB + B2SourceVB)

### Livrable
- B1HookVB.tsx (365f) + B2SourceVB.tsx (286f), 1080x1920, tsc propre.
- Renders full HD : B1 https://files.catbox.moe/kxx95a.mp4 · B2 https://files.catbox.moe/cdapaf.mp4

### Pattern reutilisable : TRANSFUSION cross-composition (continuite visuelle entre 2 beats separes)
- 2 compositions Remotion = 2 timelines independantes -> PAS de camera/pan continu possible.
- Astuce : faire correspondre EXACTEMENT un element (couleur + position Y) entre fin-beat-N et debut-beat-N+1.
  Ici : flaque brune a Y=1720 a la fin de B1 (poolFill clampe a 1) reprise a Y=1720 (FLOW_POOL_Y_START) au debut de B2.
  Constantes partagees a la main (pas d'import cross-fichier) : FLOW_POOL_Y / FLOW_BASE_Y identiques dans les 2 fichiers.
- Resultat : "illusion de continuite" convaincante. Risque connu : l'amorce du beat 2 (~0.8s) peut paraitre vide si seul l'element repris est present -> demarrer le trace du contenu suivant tot.

### Pattern : remplissage qui se VIDE (drain) dans une silhouette clippee
- fillLevel = max(0, fillUp - drain). fillUp monte (colorisation), drain descend (vidage).
- IMPORTANT : faire finir fillUp AVANT le debut du drain, sinon la silhouette n'est jamais "pleine" et le
  geste luxe-parfait-puis-vidage ne se lit pas (bug rencontre : F_BAR_COLOR_END=88 vs F_DRAIN=90 -> tablette
  jamais pleine ; corrige a F_BAR_COLOR_END=84).
- Remplissage = <rect> clippe par <clipPath> sur le path de la silhouette ; le niveau = y du rect.

### Pattern : compromis couleur (brun PUIS drapeau)
- Dans FlagCountry : (1) rect brun clippe monte du bas, (2) bandes drapeau clippees par-dessus, (3) contour encre trace au-dessus.
- Ordre de rendu = ordre semantique : matiere brute -> identite nationale -> trait.

### Gotcha lisibilite : 2 elements verticaux au meme X se telescopent
- Germination avortee (encre) + colonne de flux brun etaient toutes deux au centre (barCx) -> illisibles.
- Fix : decaler la germination (baseX = centre - 175) ET retrecir la colonne de flux. Un seul element brun vertical au centre.

### Whisper word-level
- `whisper <mp3> --model tiny --language French --word_timestamps True --output_format json` (model small TIMEOUT 2min, tiny OK ~90s en bg).

---

## SESSION 2026-07-17 — Kosti Acte 4 : intégration station+drone K3 (feat/kosti-refonte-k3)

### Livrable
- `src/projects/warmap/soudan-acte4/KostiInsertSVG.tsx` : décor statique K3 + drone SVG K3 remplacent l'ancien décor Img + sprite drone-rsf-td.png. Calage voix F4 INCHANGÉ.
- Frames de contrôle (scratchpad session) : avant-drone global 2678, drone-vol 2733, flash 2773, après 2868 (via compo `SoudanActe4`, 1920x1080, 30fps).

### Patterns/décisions réutilisables
- **Extraits K3 JSON déjà quasi-JSX** : camelCase présent, seule conversion = apostrophes attributs `'` → `"`. Nettoyage décor statique = retirer `opacity={...(f-N)/...}` (apparitions) + surcouches destruction `#4a1f18 opacity={...(f>150)...}`.
- **SVG dessiné dans SON viewBox → recaler via `<g transform="translate(DX DY)">`** : station K3 centrée ~(1010,500), cible STATION_CENTER {744,526} → DX=-266, DY=+26. Validé visuellement (auvent sous la file de civils, impact au pied des pompes).
- **Corps SVG animé dans un conteneur `<div>` positionné** : un `<div>` ne peut PAS contenir du SVG brut → wrapper `<svg viewBox="-46 -46 92 92">` centré origine, `<g transform="scale(1.6)">` pour lisibilité (corps K3 ±21 → ±34, tient). Le `rotate(155)` design K3 se compose avec le `rotate(heading)` externe du div (trajectoire). Rotors animés via `f` = useCurrentFrame global — OK.
- **GOTCHA timing "creux à l'impact"** : à `frame === impactAt`, le drone `droneOp=0` (disparu) ET le flash `flashOp=0` (t=0). Pour tester l'impact, rendre local ~impactAt+20 (flash+fumée actifs), pas impactAt pile.
- **Décor SVG "sol" chargé de contenu périmé** : `public/_rnd/kosti-sol-decor-noriver.svg` contenait ancienne station Sol + route + labels + cartouche "CARTE DE SITUATION" (interdit). NON réutilisé → fond ivoire+grille+cadre redessiné INLINE (`MapBackdrop`), sans cartouche. Leçon : vérifier le CONTENU réel d'un asset "fond" avant de le réutiliser comme simple backdrop.

### Point mineur non corrigé (hors périmètre)
- Label "CUVE" masqué par le 1er portrait civil tant qu'il est vivant (on voit "VE"). Réapparaît après extinction. Non bloquant, pas touché (risque calage).
