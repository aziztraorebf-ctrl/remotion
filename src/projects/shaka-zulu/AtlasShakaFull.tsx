// Atlas Shaka Zulu — composition principale
// Assemble les 6 segments avec audio narration sync
// Duree totale : 4509 frames (150.32s @ 30fps)

import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import {
  FPS,
  AUDIO_DURATION_FRAMES,
  SEGMENTS,
  S2_ACTS,
  INSERTS,
  NARRATIVE_BEATS,
} from "./timing";
import { AtlasShakaHook } from "./scenes/AtlasShakaHook";
import { AtlasShakaS1Geo } from "./scenes/AtlasShakaS1Geo";
import { AtlasShakaS2A1Iklwa } from "./scenes/AtlasShakaS2A1Iklwa";
import { AtlasShakaS2A2Bouclier } from "./scenes/AtlasShakaS2A2Bouclier";
import { AtlasShakaS2A3Cornes } from "./scenes/AtlasShakaS2A3Cornes";
import { AtlasShakaS2A4Synthese } from "./scenes/AtlasShakaS2A4Synthese";
import { AtlasShakaS3Expansion } from "./scenes/AtlasShakaS3Expansion";
import { AtlasShakaS4Nandi } from "./scenes/AtlasShakaS4Nandi";
import { AtlasShakaS5CTA } from "./scenes/AtlasShakaS5CTA";

export interface AtlasShakaFullProps {
  imageVariant?: "gemini-parchemin" | "gemini-pixellab" | "pixellab-mcp";
  musicVariant?: "isicathamiya" | "ingoma" | "none";
  musicVolume?: number;
}

export const AtlasShakaFull: React.FC<AtlasShakaFullProps> = ({
  imageVariant = "gemini-parchemin",
  musicVariant = "ingoma",
  musicVolume = 0.07,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#0D0D0D" }}>
      {/* Audio narration (master) */}
      <Audio src={staticFile("atlas-shaka-zulu/audio/narration-v5.mp3")} />

      {/* Musique de fond optionnelle */}
      {musicVariant !== "none" && (
        <Audio
          src={staticFile(`atlas-shaka-zulu/audio/music-${musicVariant}.mp3`)}
          volume={musicVolume}
          loop
        />
      )}

      {/* HOOK */}
      <Sequence from={SEGMENTS.HOOK.startFrame} durationInFrames={SEGMENTS.HOOK.durationFrames}>
        <AtlasShakaHook />
      </Sequence>

      {/* S1 Geo */}
      <Sequence from={SEGMENTS.S1_GEO.startFrame} durationInFrames={SEGMENTS.S1_GEO.durationFrames}>
        <AtlasShakaS1Geo
          durationFrames={SEGMENTS.S1_GEO.durationFrames}
          insertNombre1500={{
            triggerFrameLocal: INSERTS.S1_NOMBRE_1500.triggerFrame - SEGMENTS.S1_GEO.startFrame,
            durationFrames: INSERTS.S1_NOMBRE_1500.durationFrames,
          }}
        />
      </Sequence>

      {/* S2 A1 Iklwa */}
      <Sequence from={S2_ACTS.A1_IKLWA.startFrame} durationInFrames={S2_ACTS.A1_IKLWA.durationFrames}>
        <AtlasShakaS2A1Iklwa
          imageVariant={imageVariant}
          durationFrames={S2_ACTS.A1_IKLWA.durationFrames}
        />
      </Sequence>

      {/* S2 A2 Bouclier */}
      <Sequence from={S2_ACTS.A2_BOUCLIER.startFrame} durationInFrames={S2_ACTS.A2_BOUCLIER.durationFrames}>
        <AtlasShakaS2A2Bouclier
          imageVariant={imageVariant}
          durationFrames={S2_ACTS.A2_BOUCLIER.durationFrames}
        />
      </Sequence>

      {/* S2 A3 Cornes */}
      <Sequence from={S2_ACTS.A3_CORNES.startFrame} durationInFrames={S2_ACTS.A3_CORNES.durationFrames}>
        <AtlasShakaS2A3Cornes durationFrames={S2_ACTS.A3_CORNES.durationFrames} />
      </Sequence>

      {/* S2 A4 Gqokli + Triple-screen synthese */}
      <Sequence from={S2_ACTS.A4_GQOKLI_SYNTHESE.startFrame} durationInFrames={S2_ACTS.A4_GQOKLI_SYNTHESE.durationFrames}>
        <AtlasShakaS2A4Synthese
          durationFrames={S2_ACTS.A4_GQOKLI_SYNTHESE.durationFrames}
          imageVariant={imageVariant}
        />
      </Sequence>

      {/* S3 Expansion */}
      <Sequence from={SEGMENTS.S3_EXPANSION.startFrame} durationInFrames={SEGMENTS.S3_EXPANSION.durationFrames}>
        <AtlasShakaS3Expansion durationFrames={SEGMENTS.S3_EXPANSION.durationFrames} />
      </Sequence>

      {/* S4 Nandi */}
      <Sequence from={SEGMENTS.S4_NANDI.startFrame} durationInFrames={SEGMENTS.S4_NANDI.durationFrames}>
        <AtlasShakaS4Nandi
          durationFrames={SEGMENTS.S4_NANDI.durationFrames}
          nandiMeurtFrameLocal={NARRATIVE_BEATS.NANDI_MEURT.startFrame - SEGMENTS.S4_NANDI.startFrame}
          insertNombre4000FrameLocal={INSERTS.S4_NOMBRE_4000.triggerFrame - SEGMENTS.S4_NANDI.startFrame}
          insertNombre4000Duration={INSERTS.S4_NOMBRE_4000.durationFrames}
        />
      </Sequence>

      {/* S5 CTA */}
      <Sequence from={SEGMENTS.S5_CTA.startFrame} durationInFrames={SEGMENTS.S5_CTA.durationFrames}>
        <AtlasShakaS5CTA
          durationFrames={SEGMENTS.S5_CTA.durationFrames}
          napoleonFrame={INSERTS.S5_CASCADE_NAPOLEON.triggerFrame - SEGMENTS.S5_CTA.startFrame}
          alexandreFrame={INSERTS.S5_CASCADE_ALEXANDRE.triggerFrame - SEGMENTS.S5_CTA.startFrame}
          shakaFrame={INSERTS.S5_CASCADE_SHAKA.triggerFrame - SEGMENTS.S5_CTA.startFrame}
          abonneToiFrame={Math.round((148.100 - 140.489) * FPS)}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SHAKA_TOTAL_FRAMES = AUDIO_DURATION_FRAMES;
export const SHAKA_FPS = FPS;
