// MapProofOfConcept — Hannibal Traversée des Alpes
// Proof-of-concept carte : vue context (Méditerranée large)
// Valide la palette + lisibilité + POI + route avant production
// Format 1080x1920 @30fps — 10s statiques + 10s route animée

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { HANNIBAL_PALETTE, HANNIBAL_FONTS, HANNIBAL_TYPO, HANNIBAL_LETTERSPACING } from "../components/HannibalPalette";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const hannibalData = require("../../../../../data/geo/hannibal-data.json");

export const MAP_POC_FRAMES = 600; // 20s @30fps

const W = 1080;
const H = 1920;

const view = hannibalData.views.context;
const poi = view.poi;
const routePath = view.route as string;
const rhonePath = view.rhone as string;
const countries = view.countries as { iso: string; d: string }[];

// Longueur approx du path route pour strokeDashoffset
const ROUTE_LENGTH = 1400;
const RHONE_LENGTH = 400;

const POI_LABELS: Record<string, { label: string; color: string; dx?: number; dy?: number }> = {
  CARTHAGO_NOVA:    { label: "Carthagène",       color: HANNIBAL_PALETTE.CARTHAGE_VIF, dy: -14 },
  PYRENEES:         { label: "Pyrénées",         color: HANNIBAL_PALETTE.ALPES_ROCHE,  dy: -14 },
  RHONE_CROSSING:   { label: "Rhône",            color: HANNIBAL_PALETTE.MER_VIF,      dx: 12 },
  COL_MONT_GENEVRE: { label: "Col alpin",        color: HANNIBAL_PALETTE.ALPES_NEIGE,  dy: -14 },
  PLAINE_PO:        { label: "Plaine du Pô",     color: HANNIBAL_PALETTE.IVOIRE,       dy: -14 },
  ROME:             { label: "ROME",             color: HANNIBAL_PALETTE.ROME_VIF,     dy: -14 },
  CARTHAGE:         { label: "Carthage",         color: HANNIBAL_PALETTE.CARTHAGE,     dy: -14 },
};

export const HannibalMapPOC: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1 (0-300f) : carte statique, tout visible
  // Phase 2 (300-600f) : route se trace progressivement (strokeDashoffset)
  const routeReveal = interpolate(frame, [300, 580], [ROUTE_LENGTH, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rhoneOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const poiOpacity   = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: "clamp" });
  const routeOpacity = interpolate(frame, [300, 330], [0, 1], { extrapolateRight: "clamp" });

  // Léger ken-burns : zoom 1.0 → 1.04 sur toute la durée
  const mapScale = interpolate(frame, [0, 600], [1.0, 1.04], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: HANNIBAL_PALETTE.NOIR_GUERRE }}>

      {/* CARTE SVG */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0, transformOrigin: "center center", transform: `scale(${mapScale})` }}
      >
        {/* Fond = MER bleue acier */}
        <rect x={0} y={0} width={W} height={H} fill={HANNIBAL_PALETTE.MER} />

        {/* Pays — palette militaire méditerranéenne, beige pierre sur mer bleue */}
        {countries.map((c: { iso: string; d: string }) => {
          const zoneNarrative = ["ESP", "FRA", "ITA", "CHE"].includes(c.iso);
          const afriqueNord   = ["MAR", "DZA", "TUN", "LBY"].includes(c.iso);
          const fill = zoneNarrative ? "#D4C8B0"
                     : afriqueNord   ? "#C0AE88"
                     : "#B8A882";
          return (
            <path
              key={c.iso}
              d={c.d}
              fill={fill}
              stroke="#6A5E4A"
              strokeWidth={0.7}
              strokeOpacity={0.9}
            />
          );
        })}

        {/* Rhône — fleuve bleu animé */}
        <path
          d={rhonePath}
          fill="none"
          stroke={HANNIBAL_PALETTE.MER_VIF}
          strokeWidth={3}
          strokeOpacity={rhoneOpacity * 0.85}
          strokeLinecap="round"
        />

        {/* Route d'Hannibal — trait ambre qui se trace */}
        <path
          d={routePath}
          fill="none"
          stroke={HANNIBAL_PALETTE.ROUTE_GLOW}
          strokeWidth={5}
          strokeOpacity={routeOpacity * 0.3}
          strokeLinecap="round"
        />
        <path
          d={routePath}
          fill="none"
          stroke={HANNIBAL_PALETTE.ROUTE}
          strokeWidth={3.5}
          strokeOpacity={routeOpacity}
          strokeLinecap="round"
          strokeDasharray={ROUTE_LENGTH}
          strokeDashoffset={routeReveal}
        />

        {/* POI — marqueurs + labels */}
        {Object.entries(POI_LABELS).map(([key, cfg]) => {
          const p = poi[key];
          if (!p) return null;
          const isRome = key === "ROME";
          const isCarth = key === "CARTHAGE" || key === "CARTHAGO_NOVA";
          return (
            <g key={key} opacity={poiOpacity}>
              {/* Glow derrière le point */}
              <circle cx={p.x} cy={p.y} r={isRome ? 10 : 7} fill={cfg.color} opacity={0.2} />
              {/* Point principal */}
              <circle cx={p.x} cy={p.y} r={isRome ? 5 : 3.5} fill={cfg.color} />
              {/* Label */}
              <text
                x={p.x + (cfg.dx ?? 0)}
                y={p.y + (cfg.dy ?? 0)}
                textAnchor="middle"
                fontSize={isRome ? 18 : 14}
                fontFamily={HANNIBAL_FONTS.SERIF}
                fill={cfg.color}
                fontWeight={isRome ? 700 : 400}
                letterSpacing="0.08em"
              >
                {cfg.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* TITRE ÉPISODE — haut de frame */}
      <div style={{
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: interpolate(frame, [0, 45], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontFamily: HANNIBAL_FONTS.TITRE,
          fontSize: 38,
          color: HANNIBAL_PALETTE.IVOIRE,
          letterSpacing: HANNIBAL_LETTERSPACING.TITRE,
        }}>
          HANNIBAL BARCA
        </div>
        <div style={{
          fontFamily: HANNIBAL_FONTS.SERIF,
          fontSize: 22,
          color: HANNIBAL_PALETTE.ROUTE,
          letterSpacing: HANNIBAL_LETTERSPACING.CARTOUCHE,
          marginTop: 6,
        }}>
          Traversée des Alpes · 218 av. J.-C.
        </div>
      </div>

      {/* CARTOUCHE INFO — tiers supérieur, bas du bloc titre */}
      <div style={{
        position: "absolute",
        top: 240,
        left: 60,
        right: 60,
        opacity: interpolate(frame, [60, 120], [0, 1], { extrapolateRight: "clamp" }),
        backgroundColor: HANNIBAL_PALETTE.CARTOUCHE_FOND,
        border: `1px solid ${HANNIBAL_PALETTE.CARTOUCHE_BORD}`,
        borderRadius: 4,
        padding: "18px 24px",
      }}>
        <div style={{
          fontFamily: HANNIBAL_FONTS.MONO,
          fontSize: 13,
          color: HANNIBAL_PALETTE.ROUTE,
          letterSpacing: HANNIBAL_LETTERSPACING.LABEL,
          marginBottom: 8,
        }}>
          CONTEXTE · VUE MÉDITERRANÉE
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: HANNIBAL_FONTS.SERIF,
          fontSize: 20,
          color: HANNIBAL_PALETTE.PARCHEMIN,
        }}>
          <span style={{ color: HANNIBAL_PALETTE.CARTHAGE_VIF }}>Carthagène →</span>
          <span>Alpes</span>
          <span style={{ color: HANNIBAL_PALETTE.ROME_VIF }}>→ Rome</span>
        </div>
      </div>

      {/* LABEL PHASE — indique ce qui se passe (debug visuel) */}
      <div style={{
        position: "absolute",
        bottom: 120,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: HANNIBAL_FONTS.MONO,
        fontSize: 14,
        color: HANNIBAL_PALETTE.METAL_FROID,
        opacity: 0.6,
      }}>
        {frame < 300 ? "Phase 1 — carte + POI" : "Phase 2 — route animée (strokeDashoffset)"}
      </div>

    </AbsoluteFill>
  );
};
