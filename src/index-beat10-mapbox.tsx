import { registerRoot } from "remotion";
import React from "react";
import { Composition } from "remotion";
import { Beat10 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat10";

const Root = () => (
  <>
    <Composition id="Senegal-Beat10" component={Beat10}
      durationInFrames={1703} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
