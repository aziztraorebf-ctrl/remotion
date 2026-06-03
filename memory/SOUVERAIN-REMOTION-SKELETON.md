# SOUVERAIN REMOTION SKELETON — Squelette d'assemblage canonique (beats data-viz)

> **Validé 2026-06-02** — extrait de `SiliconSavannahFull.tsx` (vidéo PRET-PUBLICATION).
> Miroir Remotion du [[SOUVERAIN-SHORT-SKELETON]] (qui couvre le Mapbox).
> À LIRE avant d'assembler une vidéo Souverain **Remotion/data-viz** multi-beats.
> Doctrine visuelle des beats : [[SOUVERAIN-REMOTION-PLAYBOOK]]. Briques : section HERO DATA de `COMPOSANTS-INDEX.md`.

---

## Principe : 1 narration globale + offsets audio-dérivés

Le composant d'assemblage (`<Episode>Full.tsx`) orchestre tous les beats. Règles non-négociables :

1. **UNE seule narration** + **UNE seule musique** au niveau parent. Jamais dupliquées dans les beats.
   Les beats reçoivent des flags `globalAudio`/`globalMusic` pour ne PAS rejouer l'audio.
2. **Tous les offsets dérivés du `manifest.ts`** (`SEG.xxx.start`) — JAMAIS de frame hardcodée.
3. **Durées = distance jusqu'au prochain beat** (`B3_START - B2_START + 1`) — calcul automatique, pas de trou.
4. **`CutFade`** (navy `#0d1420`, jamais `#000000`) sur 2 frames à chaque coupure — marque les actes.
5. **`premountFor={fps}`** sur chaque `<Sequence>` — 1s de buffer pré-render (anti-flash).
6. **Fade-out musique** sur les ~75 dernières frames.

---

## Squelette de référence

```tsx
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Beat1Hook } from "./Beat1Hook";
import { Beat2Carte, BEAT2_DURATION } from "./Beat2Carte";
// ... autres beats
import { SEG } from "./manifest";

const MUSIC_PATH     = "souverain/<episode>/audio/music/music-A.mp3";
const NARRATION_PATH = "souverain/<episode>/audio/narration-v3.mp3";
const FPS = 30;

// Durée totale = durée exacte de la narration (pas de silence final)
const NARRATION_FRAMES = 3662; // = durée_audio_s * fps

// Offsets audio-dérivés depuis manifest global (source de vérité)
const B1_START = 0;
const B2_START = SEG.situer_debut.start;
const B3_START = SEG.miracle.start;
// ...

// Durées = distance jusqu'au prochain beat (+1 pour éviter trou de 1f)
const BEAT1_DUR = B2_START - B1_START + 1;
const BEAT2_DUR = B3_START - B2_START + 1;
// ...
const BEATN_DUR = NARRATION_FRAMES - BN_START; // dernier beat jusqu'à la fin exacte

const MUSIC_FADE_START = NARRATION_FRAMES - 75;
const FADE_FRAMES = 2;

// CutFade navy (PAS #000000 — règle No-Black)
function CutFade({ cutAt }: { cutAt: number }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame, [cutAt - FADE_FRAMES, cutAt, cutAt + FADE_FRAMES], [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (opacity <= 0.01) return null;
  return <AbsoluteFill style={{ background: "#0d1420", opacity, pointerEvents: "none" }} />;
}

export const SILICON_SAVANNAH_FULL_DURATION = NARRATION_FRAMES;

export const EpisodeFull: React.FC = () => {
  const frame = useCurrentFrame();
  const musicVolume = interpolate(
    frame, [0, MUSIC_FADE_START, NARRATION_FRAMES], [0.07, 0.07, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      {/* Audio global — une seule instance couvre tout l'épisode */}
      <Audio src={staticFile(NARRATION_PATH)} />
      <Audio src={staticFile(MUSIC_PATH)} volume={musicVolume} />

      <Sequence from={B1_START} durationInFrames={BEAT1_DUR} premountFor={FPS}>
        <Beat1Hook globalMusic globalAudio />
      </Sequence>
      <Sequence from={B2_START} durationInFrames={BEAT2_DUR} premountFor={FPS}>
        <Beat2Carte globalAudio />
      </Sequence>
      {/* ... autres beats ... */}

      {/* Fondus navy à chaque coupure */}
      <CutFade cutAt={B2_START} />
      <CutFade cutAt={B3_START} />
      {/* ... */}
    </AbsoluteFill>
  );
};
```

---

## Squelette d'un BEAT individuel (data-viz)

```tsx
export const BeatN: React.FC<{ globalMusic?: boolean; globalAudio?: boolean }> = ({
  globalMusic = false, globalAudio = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill className="bg-navy overflow-hidden">
      {/* Audio LOCAL uniquement si pas en mode global (pour preview du beat seul) */}
      {!globalAudio && <Audio src={staticFile(M.AUDIO)} />}
      {!globalMusic && <Audio src={staticFile(MUSIC_PATH)} startFrom={MUSIC_START} volume={0.07} />}

      {/* Dégradé radial central (profondeur, P2/P5 du playbook) */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 45%, #1e2d4a 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Contenu : briques HERO DATA (CountUp bounce, FloatingHeroObject, HeroMirrorBars...) */}

      <SubtitleBarSouverain lines={SUBTITLES} />
    </AbsoluteFill>
  );
};
```

---

## Briques HERO DATA disponibles (catalogue)

| Brique | Import | Pattern playbook |
|---|---|---|
| `CountUp` (preset `bounce` + `decimals`) | ui | P1 Chiffre-événement |
| `HeroMirrorBars` | layouts | P7 Métaphore physique (barres miroir horizontales) |
| `HeroVerticalBars` | layouts | P7 Métaphore physique (barres verticales — déséquilibre de hauteur, anti-vide) |
| `FloatingHeroObject` (`clipCircle`, `spin`) | layouts | P5 Secondary motion (objet flottant + halo + ping-ring + rotation) |
| `Badge` (mode `satellite`) | ui | P5 Badges satellites |
| `CountdownReveal` (prop `pingNode`) | layouts | Cadran arc + ping-node |
| `TextChoc` | layouts | P6 Reveal typo mot-par-mot + underline |
| `SubtitleBarSouverain` | ui | P3 Sous-titre persistant |

Helpers (`_shared/animations.ts`) : `heroBouncePop`, `appearOrganic`, `floatSin`, `glowOscillate`, `pingRing`.

---

## Checklist assemblage (avant render final)

- [ ] 1 seule `<Audio>` narration + 1 seule musique au niveau parent
- [ ] Tous les `B*_START` dérivés de `SEG.*.start` (zéro frame hardcodée)
- [ ] `durationInFrames` total = `NARRATION_FRAMES` (pas de silence final)
- [ ] `premountFor={fps}` sur chaque Sequence
- [ ] `CutFade` navy `#0d1420` (jamais `#000000`)
- [ ] Fade-out musique sur les dernières ~75f
- [ ] Chaque beat respecte R1 (max 8s sans événement visuel)
