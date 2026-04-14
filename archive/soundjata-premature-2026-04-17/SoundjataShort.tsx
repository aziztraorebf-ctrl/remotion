import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile} from 'remotion';

// ─────────────────────────────────────────────────────────────────────────────
// Soundjata Keita — Heros Oublies #3
// Structure : Narratrice A -> Clip insulte + dialogue Matrone -> Narratrice B
// ─────────────────────────────────────────────────────────────────────────────

const FPS = 30;

// Audio durations measured via ffprobe
const PART_A_DURATION_S = 22.72;
const CLIP_DURATION_S = 5.06;
const DIALOGUE_DURATION_S = 6.32;
const PART_B_DURATION_S = 103.36;

// Small breathing room between segments so the narratrice doesn't cut abruptly
const BREATH_BEFORE_CLIP_S = 0.3;  // Partie A ends, small beat before clip starts
const DIALOGUE_TAIL_S = DIALOGUE_DURATION_S - CLIP_DURATION_S;  // 1.26s of dialogue after clip ends
const BREATH_AFTER_DIALOGUE_S = 0.3;  // punch silence after dialogue before narratrice reprises

// Frame calculations
const partAStart = 0;
const partAFrames = Math.round(PART_A_DURATION_S * FPS);
const breathBefore = Math.round(BREATH_BEFORE_CLIP_S * FPS);

const clipStart = partAStart + partAFrames + breathBefore;
const clipFrames = Math.round(CLIP_DURATION_S * FPS);

const dialogueStart = clipStart;  // dialogue starts at same time as clip (best lip-sync)
const dialogueFrames = Math.round(DIALOGUE_DURATION_S * FPS);

const breathAfter = Math.round(BREATH_AFTER_DIALOGUE_S * FPS);
const partBStart = dialogueStart + dialogueFrames + breathAfter;
const partBFrames = Math.round(PART_B_DURATION_S * FPS);

export const SOUNDJATA_TOTAL_FRAMES = partBStart + partBFrames;

export const SoundjataShort: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Narratrice — Partie A */}
      <Sequence from={partAStart} durationInFrames={partAFrames}>
        <Audio src={staticFile('assets/library/geoafrique/heros-oublies/soundjata/narration-part-a.mp3')} />
      </Sequence>

      {/* Clip insulte — video muted, dialogue Matrone overlaid */}
      <Sequence from={clipStart} durationInFrames={clipFrames}>
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile('assets/library/geoafrique/heros-oublies/soundjata/insult-clip-v1.mp4')}
            muted
          />
        </AbsoluteFill>
      </Sequence>

      {/* Dialogue Matrone — overflows clip by ~1.3s, displayed over last frame of clip */}
      <Sequence from={dialogueStart} durationInFrames={dialogueFrames}>
        <Audio src={staticFile('assets/library/geoafrique/heros-oublies/soundjata/insult-dialogue.mp3')} />
      </Sequence>

      {/* Freeze frame during dialogue tail (clip ends but dialogue continues) */}
      <Sequence from={clipStart + clipFrames} durationInFrames={Math.round(DIALOGUE_TAIL_S * FPS)}>
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile('assets/library/geoafrique/heros-oublies/soundjata/insult-clip-v1.mp4')}
            muted
            startFrom={Math.round((CLIP_DURATION_S - 0.1) * FPS)}  // last tenth of clip (freeze effect)
            endAt={Math.round(CLIP_DURATION_S * FPS)}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Narratrice — Partie B */}
      <Sequence from={partBStart} durationInFrames={partBFrames}>
        <Audio src={staticFile('assets/library/geoafrique/heros-oublies/soundjata/narration-part-b.mp3')} />
      </Sequence>
    </AbsoluteFill>
  );
};
