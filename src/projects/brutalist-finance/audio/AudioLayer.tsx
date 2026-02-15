import React from "react";
import { Audio, Sequence, staticFile, interpolate } from "remotion";
import { AudioTrack, ALL_TRACKS } from "./audioConfig";

const renderTrack = (track: AudioTrack) => {
  return (
    <Sequence
      key={track.name}
      from={track.startFrame}
      durationInFrames={track.durationInFrames}
      name={`audio-${track.name}`}
    >
      <Audio
        src={staticFile(track.src)}
        volume={(f) => {
          let vol = track.volume;

          // Fade in
          if (track.fadeInFrames && f < track.fadeInFrames) {
            vol *= interpolate(f, [0, track.fadeInFrames], [0, 1]);
          }

          // Fade out
          if (track.fadeOutFrames) {
            const fadeStart = track.durationInFrames - track.fadeOutFrames;
            if (f > fadeStart) {
              vol *= interpolate(
                f,
                [fadeStart, track.durationInFrames],
                [1, 0]
              );
            }
          }

          return vol;
        }}
        loop={track.loop}
      />
    </Sequence>
  );
};

export const AudioLayer: React.FC = () => {
  return <>{ALL_TRACKS.map(renderTrack)}</>;
};
