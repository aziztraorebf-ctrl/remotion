import React, { useCallback } from "react";
import { Audio, Sequence, staticFile, interpolate } from "remotion";
import { ALL_TRACKS, AudioTrack } from "./audioConfig";

const TrackAudio: React.FC<{ track: AudioTrack }> = ({ track }) => {
  const hasFade = track.fadeInFrames || track.fadeOutFrames;

  const volumeCallback = useCallback(
    (frame: number) => {
      let vol = track.volume;

      if (track.fadeInFrames && frame < track.fadeInFrames) {
        vol *= interpolate(frame, [0, track.fadeInFrames], [0, 1]);
      }

      if (track.fadeOutFrames) {
        const fadeStart = track.durationInFrames - track.fadeOutFrames;
        if (frame > fadeStart) {
          vol *= interpolate(
            frame,
            [fadeStart, track.durationInFrames],
            [1, 0]
          );
        }
      }

      return vol;
    },
    [track.volume, track.fadeInFrames, track.fadeOutFrames, track.durationInFrames]
  );

  return (
    <Audio
      src={staticFile(track.src)}
      volume={hasFade ? volumeCallback : track.volume}
      loop={track.loop}
      loopVolumeCurveBehavior={track.loop ? "repeat" : undefined}
    />
  );
};

export const AudioLayer: React.FC = () => {
  return (
    <>
      {ALL_TRACKS.map((track) => (
        <Sequence
          key={track.name}
          from={track.startFrame}
          durationInFrames={track.durationInFrames}
          layout="none"
          name={track.name}
        >
          <TrackAudio track={track} />
        </Sequence>
      ))}
    </>
  );
};
