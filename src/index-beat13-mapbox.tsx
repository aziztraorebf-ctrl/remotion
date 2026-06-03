import { registerRoot } from "remotion";
import React from "react";
import { Composition } from "remotion";
import { Beat13 } from "./projects/souverain/senegal-petrole-gaz/beats/Beat13";

const Root = () => (
  <>
    <Composition
      id="Senegal-Beat13"
      component={Beat13}
      durationInFrames={1470}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);

registerRoot(Root);
