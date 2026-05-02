// AtlasV2CtaChaine — CTA abonnement chaine + newsletter
// Fond : vraie carte mercator Atlas (Mali or + empire + drift Ken Burns)
// Superposition : vignette sombre + 3 lignes CTA cascadees synced Whisper
// Audio : atlas-cta-narration-v1.mp3 (9.75s = 293 frames)
// Beats Whisper : ligne1=0s(f0), ligne2=4.02s(f121), ligne3=8.78s(f263)
import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasEmpire,
  AtlasSubtleStars,
  atlasV2Data as data,
} from "../atlas-v2-components";
import { getFlagFill } from "../atlas-v2-flags";
import { AtlasSharedDefs } from "../atlas-v2-shared-defs";
import { AtlasFlagDefs } from "../atlas-v2-flags";

const FPS = 30;
export const ATLAS_CTA_CHAINE_FRAMES = Math.round(9.75 * FPS); // 293

// --- Icones SVG inline ---

const GlobeIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" stroke={ATLAS_COLORS.empireGold} strokeWidth="2.5"
      fill={ATLAS_COLORS.empireGold} fillOpacity="0.18" />
    <ellipse cx="24" cy="24" rx="9" ry="18" stroke={ATLAS_COLORS.empireGold}
      strokeWidth="1.8" fill="none" />
    <line x1="6" y1="24" x2="42" y2="24" stroke={ATLAS_COLORS.empireGold} strokeWidth="1.5" />
    <line x1="8" y1="16" x2="40" y2="16" stroke={ATLAS_COLORS.empireGold} strokeWidth="1" opacity="0.55" />
    <line x1="8" y1="32" x2="40" y2="32" stroke={ATLAS_COLORS.empireGold} strokeWidth="1" opacity="0.55" />
  </svg>
);

const BellIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
    <path d="M24 6C24 6 15 6 15 17V28L11 32V34H37V32L33 28V17C33 6 24 6 24 6Z"
      stroke={ATLAS_COLORS.empireGold} strokeWidth="2.5" strokeLinejoin="round"
      fill={ATLAS_COLORS.empireGold} fillOpacity="0.18" />
    <path d="M20 34C20 36.2 21.8 38 24 38C26.2 38 28 36.2 28 34"
      stroke={ATLAS_COLORS.empireGold} strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const LinkIcon: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
    <rect x="8" y="12" width="32" height="22" rx="4"
      stroke={ATLAS_COLORS.empireGold} strokeWidth="2.5"
      fill={ATLAS_COLORS.empireGold} fillOpacity="0.18" />
    <path d="M8 19L24 28L40 19" stroke={ATLAS_COLORS.empireGold}
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// --- Ligne CTA individuelle ---

const CTALine: React.FC<{
  icon: React.ReactNode;
  mainText: string;
  subText: string;
  appearFrame: number;
  yPos: number;
}> = ({ icon, mainText, subText, appearFrame, yPos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - appearFrame;
  if (local < 0) return null;

  const t = spring({ frame: local, fps, config: { damping: 22, stiffness: 120 } });
  const translateY = interpolate(t, [0, 1], [24, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: yPos,
        left: 50,
        right: 50,
        opacity: t,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      {icon}
      <p
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: 38,
          fontWeight: 700,
          fontStyle: "italic",
          color: ATLAS_COLORS.empireGold,
          margin: 0,
          textAlign: "center",
          lineHeight: 1.25,
          letterSpacing: "0.04em",
          textShadow: [
            "0 0 20px rgba(0,0,0,0.95)",
            "2px 2px 0 rgba(0,0,0,0.9)",
            "-2px -2px 0 rgba(0,0,0,0.9)",
            "0 4px 16px rgba(0,0,0,0.85)",
          ].join(", "),
        }}
      >
        {mainText}
      </p>
      <p
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontSize: 23,
          fontWeight: 500,
          color: ATLAS_COLORS.cream,
          margin: 0,
          textAlign: "center",
          letterSpacing: "0.05em",
          opacity: 0.9,
          textShadow: "0 2px 12px rgba(0,0,0,0.95), 1px 1px 0 rgba(0,0,0,0.9)",
        }}
      >
        {subText}
      </p>
    </div>
  );
};

// --- Composition principale ---

export const AtlasV2CtaChaine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = ATLAS_CTA_CHAINE_FRAMES;

  // Fade in / fade out globaux
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [duration - 18, duration], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const globalOpacity = fadeIn * fadeOut;

  // Drift Ken Burns lent (carte "respire")
  const driftX = Math.sin(frame * 0.014) * 10;
  const driftY = Math.cos(frame * 0.011) * 7;

  // Halo Mali pulsant
  const haloOpacity = 0.18 + 0.10 * Math.sin(frame * 0.07);

  // Données carte
  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");

  return (
    <AbsoluteFill>
      {/* --- COUCHE SVG : carte mercator en fond --- */}
      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", width: "100%", height: "100%", display: "block", opacity: globalOpacity }}
      >
        <AtlasSharedDefs />
        <AtlasFlagDefs mode="official" bandWidth={14} />

        {/* Fond dégradé carte */}
        <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
        <AtlasSubtleStars opacity={0.5} />

        {/* Carte mercator avec drift Ken Burns */}
        <g transform={`translate(${360 + driftX} ${640 + driftY}) scale(1.25) translate(-360 -640)`}>
          {/* Ocean */}
          <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.ocean} />

          {/* Autres pays */}
          {otherCountries.map((c) => (
            <path
              key={c.iso}
              d={c.d}
              fill={ATLAS_COLORS.land}
              stroke={ATLAS_COLORS.landStroke}
              strokeWidth="0.8"
              strokeOpacity="0.8"
            />
          ))}

          {/* Mali — or dominant, signature de toute la vidéo */}
          {mali && (
            <g>
              <path
                d={mali.d}
                fill={ATLAS_COLORS.maliFill}
                stroke={ATLAS_COLORS.empireOutlineDark}
                strokeWidth="2.5"
              />
              <path
                d={mali.d}
                fill={getFlagFill("MLI", ATLAS_COLORS.maliFill)}
                opacity={0.5}
                stroke="none"
              />
              {/* Halo doré pulsant */}
              <path d={mali.d} fill="none"
                stroke={ATLAS_COLORS.haloGold} strokeWidth="18" opacity={haloOpacity} />
              <path d={mali.d} fill="none"
                stroke={ATLAS_COLORS.haloGold} strokeWidth="8" opacity={haloOpacity * 1.4} />
            </g>
          )}

          {/* Empire Mali 1300 — rappel de toute la narration */}
          {data.mercWide.maliEmpire1300 && (
            <AtlasEmpire
              pathD={data.mercWide.maliEmpire1300}
              outlineDark={true}
              hatchOpacity={0.4}
            />
          )}
        </g>

        {/* Vignette sombre forte pour lisibilité du texte CTA */}
        <rect x="0" y="0" width="720" height="1280"
          fill="rgba(0,0,0,0.62)" />

        {/* Ligne séparatrice haute */}
        <line x1="100" y1="310" x2="620" y2="310"
          stroke={ATLAS_COLORS.empireGold} strokeWidth="1.2" opacity="0.5" />

        {/* Ligne séparatrice basse */}
        <line x1="100" y1="1020" x2="620" y2="1020"
          stroke={ATLAS_COLORS.empireGold} strokeWidth="1.2" opacity="0.5" />
      </svg>

      {/* --- COUCHE HTML : 3 lignes CTA --- */}
      <div style={{ position: "absolute", inset: 0, opacity: globalOpacity }}>
        {/* Ligne 1 : "Tu savais ?" — 0.0s -> frame 0 */}
        <CTALine
          icon={<GlobeIcon />}
          mainText="Tu savais ?"
          subText="l'Afrique regorge de figures comme lui"
          appearFrame={0}
          yPos={330}
        />

        {/* Ligne 2 : "Chaque semaine" — 4.02s -> frame 121 */}
        <CTALine
          icon={<BellIcon />}
          mainText="Newsletter hebdomadaire"
          subText="ce qu'on ne t'a pas appris à l'école"
          appearFrame={121}
          yPos={610}
        />

        {/* Ligne 3 : "Lien en bio" — 8.78s -> frame 263 */}
        <CTALine
          icon={<LinkIcon />}
          mainText="Lien en bio"
          subText="un regard différent sur l'histoire africaine"
          appearFrame={263}
          yPos={880}
        />
      </div>

      {/* Narration */}
      <Audio src={staticFile("atlas-mansa-moussa/atlas-cta-narration-v1.mp3")} volume={1.0} />
    </AbsoluteFill>
  );
};
