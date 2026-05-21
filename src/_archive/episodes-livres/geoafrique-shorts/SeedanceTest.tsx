import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  useVideoConfig,
} from "remotion";
import { staticFile } from "remotion";

const VIDEO_SRC = staticFile(
  "assets/library/geoafrique/test seedance 2.0/abou bakari/abou-bakari-trone-seedance-v2-silent.mp4"
);
const AUDIO_SRC = staticFile(
  "assets/library/geoafrique/audio/abou-bakari-narration-test-v2.mp3"
);

export const SeedanceTest: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={VIDEO_SRC}
        style={{
          width,
          height,
          objectFit: "cover",
        }}
      />
      <Sequence from={9}>
        <Audio src={AUDIO_SRC} />
      </Sequence>
    </AbsoluteFill>
  );
};
