// P6 v2 — "NorthShield. La securite se manifeste quand il le faut — et s'efface le reste du
// temps." 56.5 -> 63.34s absolu (0 -> 6.8s relatif).
//
// REFONTE POST-JURY (2026-08-07, rejet v1 unanime : "pathetique" (Grok), "zero vie" ; frame
// milieu/fin quasi identiques). v1 : le groupe entier d'echos decroissait en opacite globale (un
// seul <g> avec 4 echos deja dessines par Fable, jamais anime individuellement) + une ligne qui
// s'attenuait UNE FOIS puis restait figee + wordmark fade-in isole. v2 : echos qui se propagent
// avec des ondes qui voyagent le long de la ligne (pas juste une opacite qui baisse sur place),
// ligne qui respire en continu apres attenuation (jamais un plat mort), wordmark revele par une
// impulsion qui parcourt la ligne (lien visuel ligne<->logo, pas 2 elements juxtaposes).
// Cf SCRIPT-ANIMATION-V2-SYNTHESE-JURY.md § P6.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { P6_SIGNATURE_SVG } from "./bodies/P6SignatureBody";
import { extractGroup, extractDefs } from "./svgGroupExtractor";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920;
const LINE_Y = 520; // mesure dans le SVG source (vigilance_line/anomaly_settling a y=520)

const DEFS = extractDefs(P6_SIGNATURE_SVG);
const G = {
  bgBase: extractGroup(P6_SIGNATURE_SVG, "bg_base"),
  bgTexture: extractGroup(P6_SIGNATURE_SVG, "bg_texture"),
  anomalySettling: extractGroup(P6_SIGNATURE_SVG, "anomaly_settling"),
  vigilanceLine: extractGroup(P6_SIGNATURE_SVG, "vigilance_line"),
  fluxConnexions: extractGroup(P6_SIGNATURE_SVG, "flux_connexions"),
  sentinelPoint: extractGroup(P6_SIGNATURE_SVG, "sentinel_point"),
};
const Raw: React.FC<{ body: string; opacity?: number; transform?: string }> = ({ body, opacity, transform }) => (
  <g opacity={opacity} transform={transform} dangerouslySetInnerHTML={{ __html: body }} />
);

const T_ECHOES_START = 0.0;
const T_ECHOES_END = 2.2;
const T_LINE_ATTENUATE_START = 1.8;
const T_LINE_ATTENUATE_END = 4.5;
const LINE_MIN_OPACITY = 0.4;
const T_WORDMARK_SWEEP_START = 4.6;
const T_WORDMARK_SWEEP_DUR = 1.3;
const WORDMARK = "NorthShield";

export const P6Signature: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Echos decroissants qui SE PROPAGENT (3 ondes concentriques qui s'attenuent en s'eloignant du
  // pic, au lieu d'une simple opacite globale qui baisse sur place).
  const echoesBaseOpacity = interpolate(t, [T_ECHOES_START, T_ECHOES_END], [1, 0], clamp);
  const echoWaves = [0, 0.4, 0.8].map((delay) => {
    const localT = Math.max(0, t - delay);
    const progress = interpolate(localT, [0, 1.6], [0, 1], clamp);
    return { scale: 1 + progress * 0.6, opacity: (1 - progress) * echoesBaseOpacity };
  });

  const lineOpacity = interpolate(
    t,
    [0, T_LINE_ATTENUATE_START, T_LINE_ATTENUATE_END],
    [1, 1, LINE_MIN_OPACITY],
    clamp,
  );

  // Respiration continue de la ligne, ne s'arrete JAMAIS (regle jury : la ligne = personnage,
  // ne meurt pas visuellement meme au repos).
  const breathe = Math.sin(t * (Math.PI * 2) / 2.6) * 3;
  const glowPulse = 0.6 + Math.sin(t * (Math.PI * 2) / 1.1) * 0.4;

  // Wordmark : une impulsion cyan parcourt la ligne puis le mot apparait dans son sillage —
  // lien visuel direct entre la ligne et le logo (pas un fade-in independant juxtapose).
  const sweepProgress = interpolate(t, [T_WORDMARK_SWEEP_START, T_WORDMARK_SWEEP_START + T_WORDMARK_SWEEP_DUR], [0, 1], clamp);
  const sweepX = interpolate(sweepProgress, [0, 1], [660, 1260]);
  const wordmarkOpacity = interpolate(sweepProgress, [0.3, 1], [0, 1], clamp);
  const iIndex = WORDMARK.indexOf("i");

  return (
    <AbsoluteFill style={{ background: "#0A1628" }}>
      <svg viewBox={`0 0 ${W} 1080`} width="100%" height="100%">
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />
        <Raw body={G.bgBase} />
        <Raw body={G.bgTexture} />
        <Raw body={G.fluxConnexions} />

        {echoWaves.map((w, i) => (
          <g key={i} opacity={w.opacity} transform={`translate(450, ${LINE_Y}) scale(${w.scale}) translate(-450, ${-LINE_Y})`}>
            <g dangerouslySetInnerHTML={{ __html: G.anomalySettling }} />
          </g>
        ))}

        <g transform={`translate(0, ${breathe})`}>
          <g opacity={lineOpacity * glowPulse}>
            <Raw body={G.vigilanceLine} />
          </g>
        </g>
        <Raw body={G.sentinelPoint} />

        {/* Impulsion voyageuse qui revele le wordmark a son passage. */}
        {sweepProgress > 0 && sweepProgress < 1 && (
          <circle cx={sweepX} cy={668} r={14} fill="#00D9FF" opacity={0.5} />
        )}
        <text
          x={960}
          y={668}
          textAnchor="middle"
          fontFamily="Avenir Next, Futura, Helvetica Neue, Arial, sans-serif"
          fontWeight={500}
          fontSize={64}
          letterSpacing={4}
          fill="#F4F1EA"
          opacity={wordmarkOpacity}
        >
          {WORDMARK.split("").map((ch, i) => (
            <tspan key={i} fill={i === iIndex ? "#00D9FF" : "#F4F1EA"}>
              {ch}
            </tspan>
          ))}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
