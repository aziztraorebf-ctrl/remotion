// Beat 0 — Hook Empire du Ghana
// Utilise AtlasGlobeHook (_shared) — configurer ici, ne pas toucher le composant generique

import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { AtlasGlobeHook, ATLAS_COLORS } from "../../_shared/atlas-components";
import { GHANA_PALETTE } from "../components/GhanaPalette";
import { SEGMENTS } from "../timing";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const atlasData = require("../../_shared/atlas-v2-data.json");

// Pays highlights : territoire historique Wagadou (Mali + Mauritanie + voisins)
const WAGADOU_HIGHLIGHTS: Record<string, string> = {
  MLI: ATLAS_COLORS.empireFillCream,
  MRT: ATLAS_COLORS.empireFillCream,
  SEN: "#E8D8B8",
  GIN: "#E8D8B8",
  GNB: "#E8D8B8",
  GHA: "#E8D8B8",
  BFA: "#E8D8B8",
};

export const Beat0Hook: React.FC = () => (
  <AbsoluteFill>
    {/* Narration coupée à frame 153 (fin segment Hook) pour éviter overlap avec Beat 1 audio */}
    <Audio src={staticFile("audio/atlas-empire-ghana/narration-v1.mp3")} trimBefore={5} trimAfter={153} />
    <Audio src={staticFile("audio/atlas-empire-ghana/music/v1-B-marche-or.mp3")} volume={0.07} />
    <AtlasGlobeHook
      globeCountries={atlasData.ortho.countries}
      globeRadius={atlasData.ortho.radius}
      highlightFills={WAGADOU_HIGHLIGHTS}
      rotateStart={-30}
      rotateEnd={-15}
      svgScale={1.85}
      globeOffsetY={-80}
      line1Text="Au cœur du Sahara,"
      line2Text={"on troquait du sel\ncontre de l’or."}
      line3Text="Au gramme près."
      line1In={15}
      line2In={45}
      line3In={100}
      durationFrames={SEGMENTS.S1_SETUP.startFrame}
      line1Color={GHANA_PALETTE.BLANC_OS}
      line2Color={GHANA_PALETTE.OR}
      line3Color={GHANA_PALETTE.OR}
      fontSize={70}
    />
  </AbsoluteFill>
);

export const BEAT0_HOOK_FRAMES = SEGMENTS.HOOK.durationFrames; // 148
