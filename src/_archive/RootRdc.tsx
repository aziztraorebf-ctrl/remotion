/**
 * RootRdc — mini Root pour le projet RDC No Sense uniquement.
 * Permet un render rapide sans bundler les 200+ compositions de Root.tsx complet.
 *
 * Usage :
 *   npx remotion render RdcNoSenseFull out.mp4 --entry-point=src/RootRdc.tsx
 */

import React from "react";
import { Composition } from "remotion";
import {
  RdcNoSenseFull,
  RDC_NO_SENSE_FRAMES,
  RDC_NO_SENSE_ID,
} from "./projects/geoafrique-shorts/rdc-no-sense/RdcNoSenseFull";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id={RDC_NO_SENSE_ID}
      component={RdcNoSenseFull}
      durationInFrames={RDC_NO_SENSE_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
