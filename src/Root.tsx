import { Composition } from "remotion";
import { BlankComposition } from "./BlankComposition";
import { CharacterTest } from "./projects/hello-world/scenes/CharacterTest";
import { HelloWorld } from "./projects/hello-world/scenes/HelloWorld";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BlankComposition"
        component={BlankComposition}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CharacterTest"
        component={CharacterTest}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
