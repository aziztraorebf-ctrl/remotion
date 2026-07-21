/**
 * VoxReproMaster — prompt 5-6 de la reference : "combine all three scenes into a master
 * timeline, so the cuts are seamless" — 3 <Sequence> consecutives, chacune demarre exactement
 * ou la precedente finit (meme regle que toute la doctrine warmap "1 seule Map continue",
 * appliquee ici a des Sequences d3-geo au lieu de jumpTo Mapbox).
 *
 * Pas de film grain overlay dans cette v1 (teste separement si le proto de base convainc).
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene1Rise, SCENE1_FRAMES } from "./Scene1Rise";
import { Scene2JetsStrike, SCENE2_FRAMES } from "./Scene2JetsStrike";
import { Scene3Blockade, SCENE3_FRAMES } from "./Scene3Blockade";

export const VOX_REPRO_FPS = 30;
export const VOX_REPRO_FRAMES = SCENE1_FRAMES + SCENE2_FRAMES + SCENE3_FRAMES;

export const VoxReproMaster: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={SCENE1_FRAMES}>
        <Scene1Rise />
      </Sequence>
      <Sequence from={SCENE1_FRAMES} durationInFrames={SCENE2_FRAMES}>
        <Scene2JetsStrike />
      </Sequence>
      <Sequence from={SCENE1_FRAMES + SCENE2_FRAMES} durationInFrames={SCENE3_FRAMES}>
        <Scene3Blockade />
      </Sequence>
    </AbsoluteFill>
  );
};

export default VoxReproMaster;
