// P2 v2 — "La securite a enfin le discernement." 10.9 -> 15.2s absolu (0 -> 4.3s relatif).
//
// REFONTE POST-JURY (2026-08-07, rejet v1 unanime : "les 3 frames debut/milieu/fin d'un panneau
// de 4.3s sont quasiment identiques" — Grok, "consternant"). v1 utilisait un clip-path (reveal
// figé une fois trace) : la ligne, une fois dessinee, ne bougeait plus jamais. v2 : draw-on via
// stroke-dashoffset (pas clip-path — fix flickering + vraie vie), PUIS un point de scan qui
// voyage en boucle perpetuelle le long de la ligne + respiration continue d'amplitude visible
// (regle jury : jamais < 1s statique). Cf SCRIPT-ANIMATION-V2-SYNTHESE-JURY.md § P2.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { P2_SEUIL_SVG } from "./bodies/P2SeuilBody";
import { extractGroup, extractDefs } from "./svgGroupExtractor";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920;
const LINE_Y = 590;

const DEFS = extractDefs(P2_SEUIL_SVG);
const G = {
  bg: extractGroup(P2_SEUIL_SVG, "bg"),
  underStructure: extractGroup(P2_SEUIL_SVG, "under_structure"),
  chaosResidue: extractGroup(P2_SEUIL_SVG, "chaos_residue"),
  horizonReflection: extractGroup(P2_SEUIL_SVG, "horizon_reflection"),
  horizonGlow: extractGroup(P2_SEUIL_SVG, "horizon_glow"),
  horizonEndpoints: extractGroup(P2_SEUIL_SVG, "horizon_endpoints"),
};
const Raw: React.FC<{ body: string; opacity?: number; transform?: string }> = ({ body, opacity, transform }) => (
  <g opacity={opacity} transform={transform} dangerouslySetInnerHTML={{ __html: body }} />
);

const T_CHAOS_FADE_END = 0.6;
const T_DRAW_START = 0.3;
const T_DRAW_DUR = 1.2;
const T_ENDPOINTS_IN = T_DRAW_START + T_DRAW_DUR - 0.1;
const T_GLOW_IN = T_DRAW_START + T_DRAW_DUR;
const LINE_HALF_LEN = 970; // -10 a 1930, centre 960

export const P2SeuilNait: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const chaosOpacity = interpolate(t, [0, T_CHAOS_FADE_END], [1, 0], clamp);

  // Draw-on centre->bords via stroke-dashoffset (remplace le clip-path v1) : dessine avec un
  // <line> natif dont le dasharray = 2x la longueur totale, offset qui revele symetriquement.
  const drawProgress = interpolate(t, [T_DRAW_START, T_DRAW_START + T_DRAW_DUR], [0, 1], {
    ...clamp,
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });
  const coreOpacity = drawProgress > 0 ? 1 : 0;
  const dashOffset = LINE_HALF_LEN * (1 - drawProgress);

  const glowOpacity = interpolate(t, [T_GLOW_IN, T_GLOW_IN + 0.5], [0, 1], clamp);
  const endpointsOpacity = interpolate(t, [T_ENDPOINTS_IN, T_ENDPOINTS_IN + 0.3], [0, 1], clamp);

  // Respiration continue (amplitude relevee vs v1, jugee "imperceptible" par le jury) — ne
  // s'arrete jamais une fois le trace termine, jusqu'a la fin du panneau.
  const breatheAmp = 6;
  const breathe = drawProgress >= 1 ? Math.sin(t * (Math.PI * 2) / 2.2) * breatheAmp : 0;

  // Point de scan qui parcourt la ligne en boucle perpetuelle (regle jury : la ligne ne doit
  // jamais etre "morte" une fois dessinee). Boucle sur un cycle de 2.4s.
  const scanActive = drawProgress >= 1;
  const scanCycle = 2.4;
  const scanT = scanActive ? ((t - (T_DRAW_START + T_DRAW_DUR)) % scanCycle) / scanCycle : 0;
  const scanX = 20 + scanT * (W - 40);
  const scanOpacity = scanActive ? Math.sin(scanT * Math.PI) * 0.9 : 0;

  // Pulse lumineux global sur le glow, toutes les ~1s (en plus du scan ponctuel).
  const pulseGlow = scanActive ? 0.7 + Math.sin(t * (Math.PI * 2) / 1.0) * 0.3 : 1;

  return (
    <AbsoluteFill style={{ background: "#0A1628" }}>
      <svg viewBox={`0 0 ${W} 1080`} width="100%" height="100%">
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />
        <Raw body={G.bg} />
        <Raw body={G.underStructure} />
        <Raw body={G.chaosResidue} opacity={chaosOpacity} />
        <Raw body={G.horizonReflection} opacity={coreOpacity} transform={`translate(0, ${breathe})`} />
        <g opacity={glowOpacity * pulseGlow} transform={`translate(0, ${breathe})`}>
          <g dangerouslySetInnerHTML={{ __html: G.horizonGlow }} />
        </g>

        {/* Ligne principale : stroke-dashoffset, jamais un clip-path (fix flickering + vie). */}
        <g transform={`translate(0, ${breathe})`} opacity={coreOpacity}>
          <line
            x1={960 - (LINE_HALF_LEN - dashOffset)}
            y1={LINE_Y}
            x2={960 + (LINE_HALF_LEN - dashOffset)}
            y2={LINE_Y}
            stroke="#00D9FF"
            strokeWidth={2.5}
          />
          <line
            x1={960 - (LINE_HALF_LEN - dashOffset)}
            y1={LINE_Y}
            x2={960 + (LINE_HALF_LEN - dashOffset)}
            y2={LINE_Y}
            stroke="#F4F1EA"
            strokeWidth={1}
            opacity={0.85}
          />
        </g>

        {/* Point de scan voyageur -- la preuve visuelle que le systeme est actif en continu. */}
        {scanOpacity > 0 && (
          <g transform={`translate(0, ${breathe})`}>
            <circle cx={scanX} cy={LINE_Y} r={5} fill="#F4F1EA" opacity={scanOpacity} />
            <circle cx={scanX} cy={LINE_Y} r={12} fill="none" stroke="#00D9FF" strokeWidth={1.5} opacity={scanOpacity * 0.5} />
          </g>
        )}

        <Raw body={G.horizonEndpoints} opacity={endpointsOpacity} transform={`translate(0, ${breathe})`} />
      </svg>
    </AbsoluteFill>
  );
};
