import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Beat1Hook } from "./Beat1Hook";
import { Beat2 as Beat2Carte } from "./beat2/Beat2";
import { Beat3Miracle, BEAT3_DURATION } from "./Beat3Miracle";
import { Beat4Prix, BEAT4_DURATION } from "./Beat4Prix";
import { Beat5Monopole, BEAT5_DURATION } from "./Beat5Monopole";
import { Beat6Question, BEAT6_DURATION } from "./Beat6Question";
import { Beat7Cta, BEAT7_DURATION } from "./Beat7Cta";
import { SEG } from "./manifest";

const MUSIC_PATH     = "souverain/silicon-savannah/audio/music/music-A.mp3";
const NARRATION_PATH = "souverain/silicon-savannah/audio/narration-v3.mp3";
const FPS = 30;

// Durée totale = durée exacte de la narration (122.08s * 30 = 3662f)
// Les beats sont séquencés sur les vrais timestamps audio — pas de silence final
const NARRATION_FRAMES = 3662;

// Offsets audio-dérivés depuis manifest global (source de vérité)
const B1_START = 0;
const B2_START = SEG.situer_debut.start;     // f314
const B3_START = SEG.miracle_18ans.start;    // f724
const B4_START = SEG.prix_intro.start;       // f1429
const B5_START = SEG.monopole_debut.start;   // f2126
const B6_START = SEG.question_sorti.start;   // f2826
const B7_START = SEG.cta_pays.start;         // f3489

// Durées = distance jusqu'au prochain beat (chevauchement minimal 1f pour éviter trou)
const BEAT1_DUR = B2_START - B1_START + 1;   // 315f
const BEAT2_DUR = B3_START - B2_START + 1;   // 411f
const BEAT3_DUR = B4_START - B3_START + 1;   // 706f
const BEAT4_DUR = B5_START - B4_START + 1;   // 698f
const BEAT5_DUR = B6_START - B5_START + 1;   // 701f
const BEAT6_DUR = B7_START - B6_START + 1;   // 664f
const BEAT7_DUR = NARRATION_FRAMES - B7_START; // 173f — jusqu'à la fin exacte

export const SILICON_SAVANNAH_FULL_DURATION = NARRATION_FRAMES;

// Fade-out musique sur les dernières 75f
const MUSIC_FADE_START = NARRATION_FRAMES - 75;
const MUSIC_FADE_END   = NARRATION_FRAMES;

const FADE_FRAMES = 2;

function CutFade({ cutAt }: { cutAt: number }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [cutAt - FADE_FRAMES, cutAt, cutAt + FADE_FRAMES],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (opacity <= 0.01) return null;
  return (
    <AbsoluteFill
      style={{ background: "#000000", opacity, pointerEvents: "none" }}
    />
  );
}

export const SiliconSavannahFull: React.FC = () => {
  const frame = useCurrentFrame();

  const musicVolume = interpolate(
    frame,
    [0, MUSIC_FADE_START, MUSIC_FADE_END],
    [0.07, 0.07, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      {/* Narration globale — une seule instance couvre tout l'épisode */}
      <Audio src={staticFile(NARRATION_PATH)} />

      {/* Musique — fade-out sur les dernières 75f */}
      <Audio src={staticFile(MUSIC_PATH)} volume={musicVolume} />

      {/* Beat 1 — Hook Kenya */}
      <Sequence from={B1_START} durationInFrames={BEAT1_DUR} premountFor={FPS}>
        <Beat1Hook globalMusic globalAudio />
      </Sequence>

      {/* Beat 2 — Situer 2007 (globalAudio — narration déjà jouée par le parent) */}
      <Sequence from={B2_START} durationInFrames={BEAT2_DUR} premountFor={FPS}>
        <Beat2Carte globalAudio />
      </Sequence>

      {/* Beat 3 — Le miracle 91% */}
      <Sequence from={B3_START} durationInFrames={BEAT3_DUR} premountFor={FPS}>
        <Beat3Miracle globalMusic globalAudio />
      </Sequence>

      {/* Beat 4 — Le prix des frais */}
      <Sequence from={B4_START} durationInFrames={BEAT4_DUR} premountFor={FPS}>
        <Beat4Prix globalMusic globalAudio />
      </Sequence>

      {/* Beat 5 — Le monopole */}
      <Sequence from={B5_START} durationInFrames={BEAT5_DUR} premountFor={FPS}>
        <Beat5Monopole globalMusic globalAudio />
      </Sequence>

      {/* Beat 6 — La question */}
      <Sequence from={B6_START} durationInFrames={BEAT6_DUR} premountFor={FPS}>
        <Beat6Question />
      </Sequence>

      {/* Beat 7 — CTA */}
      <Sequence from={B7_START} durationInFrames={BEAT7_DUR} premountFor={FPS}>
        <Beat7Cta globalMusic globalAudio />
      </Sequence>

      {/* Fondus noirs 4f à chaque coupure */}
      <CutFade cutAt={B2_START} />
      <CutFade cutAt={B3_START} />
      <CutFade cutAt={B4_START} />
      <CutFade cutAt={B5_START} />
      <CutFade cutAt={B6_START} />
      <CutFade cutAt={B7_START} />
    </AbsoluteFill>
  );
};
