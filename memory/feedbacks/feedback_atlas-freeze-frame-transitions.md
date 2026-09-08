---
name: Freeze-frame respiration narrative avant CTA Atlas
description: Pattern "hold 30 frames" entre fin de narration et CTA newsletter pour eviter coupure brutale
type: feedback
originSessionId: 3182e5cc-d426-4f42-9bfa-808a7ec1ebdf
---
**Regle** : entre la fin de la narration principale (climax/punchline final) et le debut du CTA, ajouter un freeze-frame d'environ 1 seconde (30 frames @30fps).

**Why** : sans cette respiration, le passage punchline → CTA newsletter cree un effet whiplash. La derniere frame de narration porte une charge emotionnelle qui doit "respirer" avant que le ton change vers la conversion. Cas Empire Ghana 2026-05-04 : "Jamais Wagadou." → CTA direct = trop brutal selon Aziz.

**How to apply** :

Dans EmpireGhanaFull.tsx (et tout assemblage Atlas final) :

```ts
// timing.ts
export const CTA_HOLD_FRAMES = 30;
export const CTA_START_FRAME = SEGMENTS.SX_CTA_NARRATION.endFrame + CTA_HOLD_FRAMES;

// EmpireGhanaFull.tsx — etendre la Sequence du dernier beat narratif
<Sequence
  from={SEGMENTS.SX_CTA_NARRATION.startFrame}
  durationInFrames={SEGMENTS.SX_CTA_NARRATION.durationFrames + CTA_HOLD_FRAMES}
>
  <BeatXClimax />
</Sequence>

<Sequence from={CTA_START_FRAME} durationInFrames={CTA_FRAMES}>
  <BeatYCTA />
</Sequence>
```

**Conditions techniques** :
1. Toutes les `interpolate` du dernier beat doivent avoir `extrapolateRight: "clamp"` (sinon glitch hors range pendant le hold).
2. Le CTA component ne doit PAS avoir de fade-in noir initial (`bgOpacity = 1` direct, pas `interpolate(frame, [0,12], [0,1])`) sinon flash noir a la transition. Si fade-in voulu, partir de 0.5 et acceler sur 6 frames max.
3. Aligner `CTA_START_FRAME` sur `endFrame` du beat (pas `AUDIO_DURATION_FRAMES` qui peut avoir des arrondis decalant de 1-3 frames).

**Erreur evitee** :
- AUDIO_DURATION_FRAMES = round(durée_audio_s * fps) peut etre superieur a SEGMENTS.SX.endFrame de 1-3 frames. Aligner sur le SEGMENTS evite des trous noirs entre Sequences.
