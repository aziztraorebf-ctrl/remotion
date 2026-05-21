// Comparaison directe : icones faites main (gauche) vs Iconify (droite)
// Sur fond mercator pour contexte realiste
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { ATLAS_COLORS, atlasV2Data as data } from "./atlas-v2-components";
import { AtlasFlagDefs, getFlagFill } from "./atlas-v2-flags";
import { AtlasSharedDefs } from "./atlas-v2-shared-defs";
import { IconMosqueIconify, IconBookIconify, IconDiamondIconify } from "./atlas-iconify-icons";

const FPS = 30;
export const ATLAS_ICONIFY_COMPARE_DURATION = 5 * FPS;

// === Icones faites main (copies depuis RhythmTiltDemo) ===
const IconLivreHandmade: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * t})`} opacity={Math.min(1, t * 2)}>
    <rect x="-32" y="-40" width="64" height="50" rx="6" fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2" />
    <rect x="-20" y="-34" width="40" height="28" rx="3" fill="#8B5A2B" stroke="#3A2A18" strokeWidth="1.5" />
    <rect x="-20" y="-34" width="6" height="28" rx="2" fill="#6B4020" />
    <rect x="-13" y="-32" width="28" height="24" rx="1" fill="#F5EBD8" />
    <line x1="-9" y1="-26" x2="11" y2="-26" stroke="#8B5A2B" strokeWidth="1.5" />
    <line x1="-9" y1="-21" x2="11" y2="-21" stroke="#8B5A2B" strokeWidth="1.5" />
    <line x1="-9" y1="-16" x2="7" y2="-16" stroke="#8B5A2B" strokeWidth="1.5" />
    <text x="0" y="18" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fontWeight="700" fill={ATLAS_COLORS.textInk}>BIBL.</text>
  </g>
);

const IconMosqueeHandmade: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * t})`} opacity={Math.min(1, t * 2)}>
    <rect x="-32" y="-50" width="64" height="60" rx="6" fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2" />
    <rect x="-22" y="-18" width="44" height="22" rx="3" fill="#C97D5A" stroke="#3A2A18" strokeWidth="1.5" />
    <ellipse cx="0" cy="-18" rx="13" ry="10" fill="#D4A574" stroke="#3A2A18" strokeWidth="1.5" />
    <rect x="-22" y="-36" width="8" height="18" rx="2" fill="#C97D5A" stroke="#3A2A18" strokeWidth="1" />
    <polygon points="-22,-36 -14,-36 -18,-46" fill={ATLAS_COLORS.empireGold} stroke="#3A2A18" strokeWidth="1" />
    <rect x="14" y="-36" width="8" height="18" rx="2" fill="#C97D5A" stroke="#3A2A18" strokeWidth="1" />
    <polygon points="14,-36 22,-36 18,-46" fill={ATLAS_COLORS.empireGold} stroke="#3A2A18" strokeWidth="1" />
    <text x="0" y="18" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fontWeight="700" fill={ATLAS_COLORS.textInk}>SANKORE</text>
  </g>
);

// === Wrapper Iconify avec cartouche cream + label (mêmes specs visuelles) ===
const IconLivreIconify: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * t})`} opacity={Math.min(1, t * 2)}>
    <rect x="-32" y="-40" width="64" height="50" rx="6" fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2" />
    <IconBookIconify x={0} y={-20} size={36} fill="#8B5A2B" />
    <text x="0" y="18" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fontWeight="700" fill={ATLAS_COLORS.textInk}>BIBL.</text>
  </g>
);

const IconMosqueeIconify: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * t})`} opacity={Math.min(1, t * 2)}>
    <rect x="-32" y="-50" width="64" height="60" rx="6" fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2" />
    <IconMosqueIconify x={0} y={-22} size={44} fill="#3A2A18" />
    <text x="0" y="18" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="11" fontWeight="700" fill={ATLAS_COLORS.textInk}>SANKORE</text>
  </g>
);

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 300 } });

  // Pieces d'or qui tombent (Iconify diamond)
  const orPositions = Array.from({ length: 6 }, (_, i) => ({
    x: 540 + (i % 3) * 30 - 30,
    y: 800 + Math.floor(i / 3) * 30,
    delay: i * 3,
  }));

  return (
    <>
      <rect x="0" y="0" width="720" height="1280" fill={ATLAS_COLORS.bgTop} />
      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" opacity="0.5" />

      {/* Carte Afrique simplifiée pour contexte */}
      <g transform="translate(360 640) scale(1.4) translate(-360 -640)">
        <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.ocean} />
        {data.mercWide.countries.slice(0, 60).map((c) => (
          <path key={c.iso} d={c.d} fill={ATLAS_COLORS.land} stroke={ATLAS_COLORS.landStroke} strokeWidth="0.8" strokeOpacity="0.8" />
        ))}
      </g>

      {/* Titre haut */}
      <text x="180" y="80" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="22" fontWeight="700" fill={ATLAS_COLORS.empireGold} letterSpacing="2">FAITES MAIN</text>
      <text x="540" y="80" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="22" fontWeight="700" fill={ATLAS_COLORS.empireGold} letterSpacing="2">ICONIFY</text>
      <line x1="360" y1="0" x2="360" y2="1280" stroke={ATLAS_COLORS.empireGold} strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />

      {/* Rangee 1 : Livres */}
      <text x="180" y="160" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="14" fill={ATLAS_COLORS.textInk}>Livre / Bibliotheque</text>
      <IconLivreHandmade x={180} y={250} t={t} />
      <IconLivreIconify x={540} y={250} t={t} />

      {/* Rangee 2 : Mosquees */}
      <text x="180" y="380" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="14" fill={ATLAS_COLORS.textInk}>Mosquee / Sankore</text>
      <IconMosqueeHandmade x={180} y={490} t={t} />
      <IconMosqueeIconify x={540} y={490} t={t} />

      {/* Rangee 3 : Pieces d'or - bonus Iconify */}
      <text x="360" y="650" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="14" fill={ATLAS_COLORS.textInk}>Pieces d'or (Iconify only)</text>
      {orPositions.map((p, i) => {
        const tCoin = spring({ frame: frame - 10 - p.delay, fps, config: { damping: 8, stiffness: 250 } });
        return (
          <g key={i} opacity={tCoin}>
            <IconDiamondIconify x={p.x - 180} y={p.y} size={28} fill={ATLAS_COLORS.empireGold} />
          </g>
        );
      })}

      {/* Rangee 4 : Notes */}
      <text x="360" y="1100" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="16" fontWeight="700" fill={ATLAS_COLORS.empireGold}>OBSERVATIONS</text>
      <text x="360" y="1130" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="13" fill={ATLAS_COLORS.cream}>- Iconify : zero dependance reseau (paths inline)</text>
      <text x="360" y="1155" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="13" fill={ATLAS_COLORS.cream}>- Style plus epure et lisible</text>
      <text x="360" y="1180" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="13" fill={ATLAS_COLORS.cream}>- Couleurs/scale 100% controlables</text>

      <rect x="0" y="0" width="720" height="1280" fill="url(#vignette)" pointerEvents="none" />
    </>
  );
};

export const AtlasIconifyCompareDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgTop }}>
    <svg viewBox="0 0 720 1280" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <AtlasSharedDefs />
      <AtlasFlagDefs mode="official" bandWidth={14} />
      <Scene />
    </svg>
  </AbsoluteFill>
);
