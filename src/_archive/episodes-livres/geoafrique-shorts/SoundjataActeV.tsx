import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
// ============================================================
// Soundjata - Acte V : Bataille de Kirina
// Duree totale : 22s (Segment A 12s + Segment B trimmed 10s)
//
// Structure:
//   Segment A v2  (12s, Seedance 9:16) - invulnerability + griot revelation
//   Segment B     (10s, Seedance trimmed) - POV shot + arrow impact + terror
//
// Audio strategy: keep-and-duck
//   Layer 1: Seedance audio @ 30% (ambient music + SFX)
//   Layer 2: ElevenLabs narration @ 100% (GeoAfrique narrator voice)
//
// Narration window relative to full soundjata narration-full.mp3:
//   kirinaDate        78.00s - 80.22s
//   flecheAtteint     80.58s - 83.86s
//   tyranFuite        83.86s - 87.28s
//   (total 9.28s, Segment A covers 65.52s - 77.54s prior)
// ============================================================

const FPS = 30;

// Segment A : 12.05s of Seedance video (original, no trim)
const SEGMENT_A_DURATION = Math.round(12.05 * FPS); // 362 frames

// Segment B : 12.05s of Seedance video (original, no trim - keeps zoom terror final shot)
const SEGMENT_B_DURATION = Math.round(12.05 * FPS); // 362 frames

// Total
export const SOUNDJATA_ACTE_V_FRAMES =
  SEGMENT_A_DURATION + SEGMENT_B_DURATION;

// Sequence starts
const SEGMENT_A_START = 0;
const SEGMENT_B_START = SEGMENT_A_START + SEGMENT_A_DURATION;

// Asset paths (staticFile resolves from public/). Normalized 2026-04-13.
const SEG_A_VIDEO = "assets/library/geoafrique/heros-oublies/soundjata/clips-validated/acte5-segment-a-v2.mp4";
const SEG_B_VIDEO = "assets/library/geoafrique/heros-oublies/soundjata/clips-validated/acte5-segment-b-v3.mp4";
const NARRATION_FULL = "assets/library/geoafrique/heros-oublies/soundjata/audio/narration-full.mp3";

// Narration offsets relative to Acte V start
// Segment A narration: master 65.52s - 77.57s (full flecheCoq ending "a sa pointe")
// Segment B narration: master 77.54s - 87.28s (starts on "Bataille", ends on "ne revient jamais")
// The 2.3s tail of Segment B has NO narration (silence over zoom terror on Soumaoro)
// so it does NOT bleed into empireFonde ("Soundjata fonde l'Empire..." at 87.70s is Acte VI)
const NARRATION_OFFSET_A_S = 65.52;
const NARRATION_A_END_S = 77.57;
const NARRATION_OFFSET_B_S = 77.54;
const NARRATION_B_END_S = 87.28;

export const SoundjataActeV: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* =================== SEGMENT A =================== */}
      <Sequence
        from={SEGMENT_A_START}
        durationInFrames={SEGMENT_A_DURATION}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          {/* Video layer */}
          <OffthreadVideo
            src={staticFile(SEG_A_VIDEO)}
            muted
            style={{
              width,
              height,
              objectFit: "cover",
            }}
          />
          {/* Seedance audio ducked to 30% */}
          <Audio src={staticFile(SEG_A_VIDEO)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* Narration portion for Segment A - covers master 65.52s to 77.57s */}
      <Sequence
        from={SEGMENT_A_START}
        durationInFrames={Math.round((NARRATION_A_END_S - NARRATION_OFFSET_A_S) * FPS)}
        premountFor={1 * FPS}
      >
        <Audio
          src={staticFile(NARRATION_FULL)}
          startFrom={Math.round(NARRATION_OFFSET_A_S * FPS)}
          endAt={Math.round(NARRATION_A_END_S * FPS)}
          volume={1.0}
        />
      </Sequence>

      {/* =================== SEGMENT B =================== */}
      <Sequence
        from={SEGMENT_B_START}
        durationInFrames={SEGMENT_B_DURATION}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(SEG_B_VIDEO)}
            muted
            style={{
              width,
              height,
              objectFit: "cover",
            }}
          />
          <Audio src={staticFile(SEG_B_VIDEO)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* Narration portion for Segment B - covers master 77.54s to 87.28s (9.74s)
           The final 2.3s of Segment B video has NO narration - silence over zoom terror
           This prevents empireFonde (87.70s, Acte VI) from bleeding into Acte V */}
      <Sequence
        from={SEGMENT_B_START}
        durationInFrames={Math.round((NARRATION_B_END_S - NARRATION_OFFSET_B_S) * FPS)}
        premountFor={1 * FPS}
      >
        <Audio
          src={staticFile(NARRATION_FULL)}
          startFrom={Math.round(NARRATION_OFFSET_B_S * FPS)}
          endAt={Math.round(NARRATION_B_END_S * FPS)}
          volume={1.0}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
