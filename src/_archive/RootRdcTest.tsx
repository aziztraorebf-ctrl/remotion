import React from "react";
import { Composition } from "remotion";
import {
  RdcStyleTest10s,
  RDC_STYLE_TEST_10S_FRAMES,
  RDC_STYLE_TEST_10S_ID,
} from "./projects/geoafrique-shorts/rdc-no-sense/RdcStyleTest10s";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id={RDC_STYLE_TEST_10S_ID}
      component={RdcStyleTest10s}
      durationInFrames={RDC_STYLE_TEST_10S_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
