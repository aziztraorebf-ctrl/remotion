// Sonjata Papercraft — Full Short (10 scenes assembled)
// Total: ~146s (scenes 1-10 back-to-back)
// Each scene has its own narration slice from sonjata-short-v2.mp3
// NO additional narration layer here — each scene handles its own audio

import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";

const FPS = 30;

// -- Scene durations (from assembled clips) --
const SCENES = [
  { name: "scene1", file: "assets/sonjata-papercraft/clips/scene1-assembled.mp4", durationS: 12 },
  { name: "scene2", file: "assets/sonjata-papercraft/clips/scene2-assembled.mp4", durationS: 13 },
  { name: "scene3", file: "assets/sonjata-papercraft/clips/scene3-6panels-with-narration-v2.mp4", durationS: 13 },
  { name: "scene4", file: "assets/sonjata-papercraft/clips/scene4-final-keepandduck.mp4", durationS: 12 },
  { name: "scene5", file: "assets/sonjata-papercraft/clips/scene5-assembled.mp4", durationS: 13 },
  { name: "scene6", file: "assets/sonjata-papercraft/clips/scene6-assembled.mp4", durationS: 17 },
  { name: "scene7", file: "assets/sonjata-papercraft/clips/scene7-assembled.mp4", durationS: 24 },
  { name: "scene8", file: "assets/sonjata-papercraft/clips/scene8-assembled.mp4", durationS: 18 },
  { name: "scene9", file: "assets/sonjata-papercraft/clips/scene9-assembled.mp4", durationS: 8 },
  { name: "scene10", file: "assets/sonjata-papercraft/clips/scene10-assembled.mp4", durationS: 16 },
];

// Calculate start frames and total
const sceneFrames = SCENES.map((s) => s.durationS * FPS);
const startFrames: number[] = [];
let cumulative = 0;
for (const f of sceneFrames) {
  startFrames.push(cumulative);
  cumulative += f;
}
const TOTAL_FRAMES = cumulative;

export const SONJATA_SHORT_FULL_FRAMES = TOTAL_FRAMES;

export const SonjataShortFull: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SCENES.map((scene, i) => (
        <Sequence
          key={scene.name}
          from={startFrames[i]}
          durationInFrames={sceneFrames[i]}
          premountFor={FPS}
        >
          <OffthreadVideo
            src={staticFile(scene.file)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
