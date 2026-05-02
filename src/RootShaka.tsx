// Entry point dedié Atlas Shaka Zulu — render sans passer par Root.tsx cassé
import React from "react";
import { Composition, registerRoot } from "remotion";
import {
  AtlasShakaFull,
  SHAKA_TOTAL_FRAMES,
  SHAKA_FPS,
} from "./projects/atlas/shaka-zulu/AtlasShakaFull";

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AtlasShakaFull"
        component={AtlasShakaFull}
        durationInFrames={SHAKA_TOTAL_FRAMES}
        fps={SHAKA_FPS}
        width={720}
        height={1280}
        defaultProps={{
          imageVariant: "gemini-parchemin",
          musicVariant: "ingoma",
          musicVolume: 0.07,
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
