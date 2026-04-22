import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { FPS, SCENES, SOUNDJATA_TOTAL_FRAMES } from "./timing-soundjata";
import { SoundjataActeV } from "./SoundjataActeV";
import { SoundjataCharte } from "./SoundjataCharte";
import { SoundjataActeVII } from "./SoundjataActeVII";
import { SoundjataClose, SOUNDJATA_CLOSE_FRAMES } from "./SoundjataClose";

// ============================================================
// Soundjata Keita - Full Short Assembly (8 Actes)
// Total: 129.12s (3874 frames @ 30fps)
// Format: 1080x1920 (vertical YouTube Short)
//
// MANIFEST: soundjata-manifest.json (source of truth)
// TIMING: timing-soundjata.ts (Whisper-derived scene boundaries)
//
// Audio strategy per Acte:
//   I   : pre-mixed keep-and-duck (narration + Seedance in file)
//   II  : narration-full.mp3 + Seedance ducked 30% (3 clips: crawl + prelude + insulte)
//   III : narration-full.mp3 segments
//   IV  : narration-full.mp3 + Seedance ducked 30%
//   V   : self-contained (SoundjataActeV has own audio)
//   VI  : self-contained (SoundjataCharte has own audio)
//   VII : self-contained (SoundjataActeVII has own audio)
//   VIII: self-contained (SoundjataClose has own audio)
// ============================================================

// ─── ASSET PATHS ───
const BASE = "assets/library/geoafrique/heros-oublies/soundjata";
const NARRATION_FULL = `${BASE}/audio/narration-full.mp3`;

// Clips
const ACTE1_CLIP = `${BASE}/clips-validated/acte1-v2-mixed.mp4`;
const ACTE2_CRAWL = `${BASE}/clips-validated/acte2-crawl-v2.mp4`;
const ACTE2_PRELUDE = `${BASE}/clips-validated/acte2-prelude-aziz.mp4`;
const ACTE2_INSULTE = `${BASE}/clips-validated/acte2-insulte-aziz-flipped.mp4`;
const TROU_B_IMAGE = `${BASE}/refs/acte2/trou-b-v2.png`;
const ACTE3_IRONBAR = `${BASE}/clips-validated/acte3-iron-bar-v1.mp4`;
const TROU_C_IMAGE = `${BASE}/refs/acte2/trou-c-v1.png`;
const ACTE4_CLIP1 = `${BASE}/clips-validated/acte4-clip1-exil-mema-messagers-v3-final.mp4`;
const ACTE4_CLIP2 = `${BASE}/clips-validated/acte4-clip2-lion-revient-v1.mp4`;

// ─── FRAME CALCULATIONS ───
// All frame positions are ABSOLUTE (relative to composition start = frame 0)

// Acte I: 0.00s - 12.12s
const ACTE1_START = 0;
const ACTE1_CLIP_DURATION_S = 12.05;
const ACTE1_FRAMES = Math.round(ACTE1_CLIP_DURATION_S * FPS); // 362

// Acte II: 12.64s - 28.78s (3 clips: crawl + prelude + insulte)
// Clips play back-to-back right after Acte I ends
const ACTE2_START = ACTE1_FRAMES; // frame 362 (12.05s)

// Clip 1: Soundjata crawls (5.06s) - covers soundjataRampe (12.64s-15.68s)
const ACTE2_CRAWL_DURATION_S = 5.06;
const ACTE2_CRAWL_FRAMES = Math.round(ACTE2_CRAWL_DURATION_S * FPS); // 152

// Clip 2: Matrone prelude (6.04s) - covers epouseRidiculise + humiliationMere (15.76s-20.82s)
const ACTE2_PRELUDE_START = ACTE2_START + ACTE2_CRAWL_FRAMES;
const ACTE2_PRELUDE_DURATION_S = 6.04;
const ACTE2_PRELUDE_FRAMES = Math.round(ACTE2_PRELUDE_DURATION_S * FPS); // 181

// Clip 3: Insulte flipped (5.06s) - covers insulte (21.22s-28.78s)
const ACTE2_INSULTE_START = ACTE2_PRELUDE_START + ACTE2_PRELUDE_FRAMES;
const ACTE2_INSULTE_DURATION_S = 5.06;
const ACTE2_INSULTE_FRAMES = Math.round(ACTE2_INSULTE_DURATION_S * FPS); // 152

// Total Acte II visual duration
const ACTE2_TOTAL_FRAMES = ACTE2_CRAWL_FRAMES + ACTE2_PRELUDE_FRAMES + ACTE2_INSULTE_FRAMES;

// Trou B (reaction): 28.78s - 31.64s (2.86s)
const TROU_B_START = ACTE2_INSULTE_START + ACTE2_INSULTE_FRAMES;
const TROU_B_DURATION_S = 31.64 - 28.78;
const TROU_B_FRAMES = Math.round(TROU_B_DURATION_S * FPS); // 86

// Acte III: 31.64s - 47.72s
// iron-bar clip (15.07s) covers most of it
const ACTE3_START = TROU_B_START + TROU_B_FRAMES;
const ACTE3_IRONBAR_DURATION_S = 15.07;
const ACTE3_IRONBAR_FRAMES = Math.round(ACTE3_IRONBAR_DURATION_S * FPS); // 452

// Trou C (neRamperaPlus): 46.42s - 47.72s (1.30s)
const TROU_C_START = ACTE3_START + ACTE3_IRONBAR_FRAMES;
const TROU_C_DURATION_S = 47.72 - 46.42;
const TROU_C_FRAMES = Math.round(TROU_C_DURATION_S * FPS); // 39

// Acte IV: 48.44s - 64.88s
const ACTE4_START = TROU_C_START + TROU_C_FRAMES;
const ACTE4_CLIP1_DURATION_S = 15.32;
const ACTE4_CLIP1_FRAMES = Math.round(ACTE4_CLIP1_DURATION_S * FPS); // 460
const ACTE4_CLIP2_START = ACTE4_START + ACTE4_CLIP1_FRAMES;
const ACTE4_CLIP2_DURATION_S = 5.06;
const ACTE4_CLIP2_FRAMES = Math.round(ACTE4_CLIP2_DURATION_S * FPS); // 152

// Acte V: uses pre-rendered composition (self-contained audio)
const ACTE5_START = ACTE4_CLIP2_START + ACTE4_CLIP2_FRAMES;
const ACTE5_FRAMES = 724; // SOUNDJATA_ACTE_V_FRAMES = 362 + 362

// Acte VI: uses Remotion composition (self-contained audio)
const ACTE6_START = ACTE5_START + ACTE5_FRAMES;
const ACTE6_FRAMES = Math.round(20.56 * FPS); // 617

// Acte VII: uses pre-rendered composition (self-contained audio)
const ACTE7_START = ACTE6_START + ACTE6_FRAMES;
const ACTE7_FRAMES = Math.round(13.22 * FPS); // 397

// Acte VIII: uses Remotion composition (self-contained audio)
const ACTE8_START = ACTE7_START + ACTE7_FRAMES;
const ACTE8_FRAMES = SOUNDJATA_CLOSE_FRAMES; // 192

// Total frames calculated
const TOTAL_FRAMES = ACTE8_START + ACTE8_FRAMES;
export const SOUNDJATA_SHORT_FRAMES = TOTAL_FRAMES;


// ─── COMPONENT: Ken Burns zoom ───
const KenBurnsZoom: React.FC<{
  imageSrc: string;
  totalFrames: number;
  startScale: number;
  endScale: number;
  originX: string;
  originY: string;
}> = ({ imageSrc, totalFrames, startScale, endScale, originX, originY }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const scale = interpolate(frame, [0, totalFrames], [startScale, endScale], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        transformOrigin: `${originX} ${originY}`,
      }}
    >
      <Img
        src={staticFile(imageSrc)}
        style={{ width, height, objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};

export const SoundjataShort: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>

      {/* =================== ACTE I — Setup (pre-mixed keep-and-duck) =================== */}
      <Sequence
        from={ACTE1_START}
        durationInFrames={ACTE1_FRAMES}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(ACTE1_CLIP)}
            style={{ width, height, objectFit: "cover" }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* =================== ACTE II — Humiliation (3 clips) =================== */}

      {/* Clip 1: Soundjata crawls (5.06s) — Seedance audio ducked to 15% (calm scene) */}
      <Sequence
        from={ACTE2_START}
        durationInFrames={ACTE2_CRAWL_FRAMES}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(ACTE2_CRAWL)}
            muted
            style={{ width, height, objectFit: "cover" }}
          />
          <Audio src={staticFile(ACTE2_CRAWL)} volume={0.15} />
        </AbsoluteFill>
      </Sequence>

      {/* Clip 2: Matrone prelude (6.04s) */}
      <Sequence
        from={ACTE2_PRELUDE_START}
        durationInFrames={ACTE2_PRELUDE_FRAMES}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(ACTE2_PRELUDE)}
            muted
            style={{ width, height, objectFit: "cover" }}
          />
          <Audio src={staticFile(ACTE2_PRELUDE)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* Clip 3: Insulte flipped (5.06s) */}
      <Sequence
        from={ACTE2_INSULTE_START}
        durationInFrames={ACTE2_INSULTE_FRAMES}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(ACTE2_INSULTE)}
            muted
            style={{ width, height, objectFit: "cover" }}
          />
          <Audio src={staticFile(ACTE2_INSULTE)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* Acte II narration: 12.64s - 28.78s (full narration over all 3 clips) */}
      <Sequence
        from={ACTE2_START}
        durationInFrames={ACTE2_TOTAL_FRAMES}
        premountFor={1 * FPS}
      >
        <Audio
          src={staticFile(NARRATION_FULL)}
          startFrom={Math.round(12.64 * FPS)}
          endAt={Math.round(28.78 * FPS)}
          volume={1.0}
        />
      </Sequence>

      {/* =================== TROU B — Reaction (Ken Burns zoom-in) =================== */}
      <Sequence
        from={TROU_B_START}
        durationInFrames={TROU_B_FRAMES}
        premountFor={1 * FPS}
      >
        <KenBurnsZoom
          imageSrc={TROU_B_IMAGE}
          totalFrames={TROU_B_FRAMES}
          startScale={1.0}
          endScale={1.3}
          originX="50%"
          originY="30%"
        />
        <Audio
          src={staticFile(NARRATION_FULL)}
          startFrom={Math.round(28.78 * FPS)}
          endAt={Math.round(31.64 * FPS)}
          volume={1.0}
        />
      </Sequence>

      {/* =================== ACTE III — Transformation (iron bar + Trou C) =================== */}
      <Sequence
        from={ACTE3_START}
        durationInFrames={ACTE3_IRONBAR_FRAMES}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(ACTE3_IRONBAR)}
            muted
            style={{ width, height, objectFit: "cover" }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Acte III narration: 31.64s - 46.42s */}
      <Sequence
        from={ACTE3_START}
        durationInFrames={ACTE3_IRONBAR_FRAMES}
        premountFor={1 * FPS}
      >
        <Audio
          src={staticFile(NARRATION_FULL)}
          startFrom={Math.round(31.64 * FPS)}
          endAt={Math.round(46.42 * FPS)}
          volume={1.0}
        />
      </Sequence>

      {/* Trou C — neRamperaPlus (Ken Burns zoom-out) */}
      <Sequence
        from={TROU_C_START}
        durationInFrames={TROU_C_FRAMES}
        premountFor={1 * FPS}
      >
        <KenBurnsZoom
          imageSrc={TROU_C_IMAGE}
          totalFrames={TROU_C_FRAMES}
          startScale={1.2}
          endScale={1.0}
          originX="50%"
          originY="70%"
        />
        <Audio
          src={staticFile(NARRATION_FULL)}
          startFrom={Math.round(46.42 * FPS)}
          endAt={Math.round(47.72 * FPS)}
          volume={1.0}
        />
      </Sequence>

      {/* =================== ACTE IV — Exil et Retour =================== */}

      {/* Clip 1: exil + Mema + messagers (15.32s) */}
      <Sequence
        from={ACTE4_START}
        durationInFrames={ACTE4_CLIP1_FRAMES}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(ACTE4_CLIP1)}
            muted
            style={{ width, height, objectFit: "cover" }}
          />
          {/* Seedance audio ducked to 30% */}
          <Audio src={staticFile(ACTE4_CLIP1)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* Clip 2: lion revient (5.06s) */}
      <Sequence
        from={ACTE4_CLIP2_START}
        durationInFrames={ACTE4_CLIP2_FRAMES}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(ACTE4_CLIP2)}
            muted
            style={{ width, height, objectFit: "cover" }}
          />
          <Audio src={staticFile(ACTE4_CLIP2)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* Acte IV narration: 48.44s - 64.88s */}
      <Sequence
        from={ACTE4_START}
        durationInFrames={ACTE4_CLIP1_FRAMES + ACTE4_CLIP2_FRAMES}
        premountFor={1 * FPS}
      >
        <Audio
          src={staticFile(NARRATION_FULL)}
          startFrom={Math.round(48.44 * FPS)}
          endAt={Math.round(64.88 * FPS)}
          volume={1.0}
        />
      </Sequence>

      {/* =================== ACTE V — Kirina (self-contained composition) =================== */}
      <Sequence
        from={ACTE5_START}
        durationInFrames={ACTE5_FRAMES}
        premountFor={1 * FPS}
      >
        <SoundjataActeV />
      </Sequence>

      {/* =================== ACTE VI — Empire + Charte (self-contained composition) =================== */}
      <Sequence
        from={ACTE6_START}
        durationInFrames={ACTE6_FRAMES}
        premountFor={1 * FPS}
      >
        <SoundjataCharte />
      </Sequence>

      {/* =================== ACTE VII — Legende vivante (self-contained composition) =================== */}
      <Sequence
        from={ACTE7_START}
        durationInFrames={ACTE7_FRAMES}
        premountFor={1 * FPS}
      >
        <SoundjataActeVII />
      </Sequence>

      {/* =================== ACTE VIII — Close (self-contained composition) =================== */}
      <Sequence
        from={ACTE8_START}
        durationInFrames={ACTE8_FRAMES}
        premountFor={1 * FPS}
      >
        <SoundjataClose />
      </Sequence>

    </AbsoluteFill>
  );
};
