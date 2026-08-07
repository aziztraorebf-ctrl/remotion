// NorthShieldDirectionB — composition complete, 6 panneaux, System/Conceptual ("le seuil qui
// respire"). Timings caves aux secondes exactes du STORYBOARD-DIRECTION-B.md (extraits de
// l'alignment audio reel, pas estimes) : P1 0-10.9s / P2 10.9-15.2s / P3 15.2-28.7s /
// P4 28.7-40.9s / P5 40.9-56.5s / P6 56.5-63.34s. 30fps -> 1900 frames total.
//
// HORS SCOPE cette session (decision Aziz) : souris virtuelle/SFX complets — prototype
// VirtualCursor/CursorTestComp existant mais PAS integre ici, cf PROTOTYPE-SOURIS-VIRTUELLE.md.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { P1FluxBlocage } from "./P1FluxBlocage";
import { P2SeuilNait } from "./P2SeuilNait";
import { P3QuatreSignaux } from "./P3QuatreSignaux";
import { P4DashboardReveal } from "./P4DashboardReveal";
import { P5DashboardMorphBosse } from "./P5DashboardMorphBosse";
import { P6Signature } from "./P6Signature";

export const NS_DIRECTION_B_FPS = 30;
export const NS_DIRECTION_B_FRAMES = 1900; // 63.34s a 30fps

const PANELS = [
  { Comp: P1FluxBlocage, from: 0, durationInFrames: 327 },
  { Comp: P2SeuilNait, from: 327, durationInFrames: 129 },
  { Comp: P3QuatreSignaux, from: 456, durationInFrames: 405 },
  { Comp: P4DashboardReveal, from: 861, durationInFrames: 366 },
  { Comp: P5DashboardMorphBosse, from: 1227, durationInFrames: 468 },
  { Comp: P6Signature, from: 1695, durationInFrames: 205 },
];

export const NorthShieldDirectionB: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0A1628" }}>
      <Audio src={staticFile("_client-sim/noteshield/audio/narration-full.mp3")} />
      {PANELS.map(({ Comp, from, durationInFrames }, i) => (
        <Sequence key={i} from={from} durationInFrames={durationInFrames} premountFor={30}>
          <Comp />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
