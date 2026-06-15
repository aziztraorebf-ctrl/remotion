/**
 * MaskReveal — HOOK d'ouverture "chiffre/mot-masque" (la famille consolidee).
 *
 * Un chiffre ou mot geant slamme, la carte n'est visible que DANS les lettres (masque SVG), puis
 * zoom-reveal -> carte pleine + pays s'allume + question (boucle ouverte). C'est LE hook chiffre-choc.
 *
 * Remplace + fusionne : KineticMaskSlam, EchoPulse, ChromaticSplitMask (qui n'etaient que des
 * variantes de DECORATION du meme squelette masque-texte+zoom-reveal). Ici c'est UN hook, un prop `effect` :
 *   - "plain"     : slam net (ex-KineticMaskSlam)
 *   - "echo"      : ondes concentriques entre slam et reveal (ex-EchoPulse) — registre eco/croissance
 *   - "chromatic" : aberration RGB qui converge au slam (ex-ChromaticSplitMask) — registre "signal/urgence"
 *
 * AGNOSTIQUE : prop `theme` (dark/parchment) + raccord carte `countriesGeoJson` + zoom punch au reveal.
 * Issu du DA-brief 3 modeles + consolidation Aziz 2026-06-15 ("c'est le meme hook qui se repete").
 * Render via scripts/render-mapbox.sh (WebGL headless).
 */

import React, { useCallback } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HookMapBackground } from "./HookMapBackground";
import { HOOK_COLORS, HOOK_FONTS, SPRING } from "./theme";

const RED = "#B14B3C";

export interface MaskRevealProps {
  center: [number, number];
  baseZoom?: number;
  theme?: "dark" | "parchment";
  focusIso: string | string[];
  bigText: string;
  subText?: string;
  question?: string;
  /** Decoration du slam : net / ondes / aberration chromatique. */
  effect?: "plain" | "echo" | "chromatic";
  countriesGeoJson?: string;
  accentColor?: string;
  slamAt?: number;
  revealAt?: number;
  revealZoom?: number;
  durationFrames?: number;
}

export const MaskReveal: React.FC<MaskRevealProps> = ({
  center,
  baseZoom = 3.6,
  theme = "parchment",
  focusIso,
  bigText,
  subText,
  question,
  effect = "plain",
  countriesGeoJson,
  accentColor = HOOK_COLORS.gold,
  slamAt = 6,
  revealAt = 96,
  revealZoom = 1.0,
  durationFrames = 300,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;
  const focusIsos = Array.isArray(focusIso) ? focusIso : [focusIso];
  const veilColor = theme === "parchment" ? "#F5EFD6" : HOOK_COLORS.navy;
  const inkLayer = theme === "parchment" ? "#3A2A18" : HOOK_COLORS.navy;

  const ecx = width / 2;
  const ecy = isVertical ? height * 0.42 : height * 0.44;
  const bigFontSize = isVertical ? width * 0.42 : height * 0.5;

  // slam + (chromatic : convergence des 3 couches)
  const slam = spring({ frame: frame - slamAt, fps, config: SPRING.impact, durationInFrames: effect === "chromatic" ? 26 : 20 });
  const revealProg = interpolate(frame - revealAt, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textScale = slam * (1 + revealProg * revealProg * 30);
  const maskActive = frame < revealAt + 30;
  const veilOpacity = interpolate(frame - revealAt, [18, 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const litAt = revealAt + 22;

  // chromatic : decalage des couches -> 0
  const split = effect === "chromatic" ? (1 - slam) * (isVertical ? 34 : 28) : 0;
  const jitter = effect === "chromatic" ? (1 - slam) * 6 * Math.sin(frame * 2.4) : 0;

  // echo : ondes concentriques
  const echoFrom = slamAt + 16;
  const maxR = Math.hypot(width, height) * 0.55;
  const waves = [0, 14, 28, 42].map((d) => {
    const t = interpolate(frame - (echoFrom + d), [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { t, on: t > 0 && t < 1 };
  });

  const chromaOn = frame >= slamAt && frame < revealAt + 4;
  const questionAt = litAt + 54;
  const questionOp = interpolate(frame - questionAt, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const questionScale = spring({ frame: frame - questionAt, fps, config: SPRING.lourd, durationInFrames: 22 });
  const subOpacity = interpolate(
    frame - (revealAt + 24),
    [0, 14, questionAt - revealAt - 30, questionAt - revealAt - 18],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const globalOpacity = interpolate(frame, [durationFrames - 12, durationFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const maskId = "mr-textmask";
  const textProps = {
    x: ecx, y: ecy, textAnchor: "middle" as const, dominantBaseline: "central" as const,
    fontFamily: HOOK_FONTS.display, fontWeight: 900, fontSize: bigFontSize,
  };

  return (
    <AbsoluteFill style={{ background: veilColor, opacity: globalOpacity }}>
      <HookMapBackground
        center={center}
        baseZoom={baseZoom}
        theme={theme}
        focusIsos={focusIsos}
        accentColor={accentColor}
        litFrom={litAt}
        durationFrames={durationFrames}
        driftAmount={0.6}
        punchZoom={{ at: revealAt, delta: revealZoom, dur: 26 }}
        countriesGeoJson={countriesGeoJson}
        onMapReady={useCallback(() => {}, [])}
      />

      {/* effect=echo : ondes concentriques */}
      {effect === "echo" && frame > echoFrom && frame < revealAt && (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {waves.map((w, i) => (w.on ? (
            <circle key={i} cx={ecx} cy={ecy} r={w.t * maxR} fill="none" stroke={accentColor} strokeWidth={isVertical ? 4 : 3} opacity={(1 - w.t) * 0.6} />
          ) : null))}
        </svg>
      )}

      {/* texte chromatique (3 couches qui convergent) OU contour simple */}
      {chromaOn && (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <g transform={`translate(${ecx} ${ecy}) scale(${textScale}) translate(${-ecx} ${-ecy})`}>
            {effect === "chromatic" && (
              <>
                <text {...textProps} fill={RED} opacity={0.55 * (1 - slam)} transform={`translate(${-split + jitter} 0)`}>{bigText}</text>
                <text {...textProps} fill={inkLayer} opacity={0.55 * (1 - slam)} transform={`translate(${split - jitter} 0)`}>{bigText}</text>
              </>
            )}
            <text {...textProps} fill="none" stroke={accentColor} strokeWidth={Math.max(1, 6 / Math.max(1, textScale))} opacity={0.9}>{bigText}</text>
          </g>
        </svg>
      )}

      {/* voile troue par le texte : carte visible DANS les lettres */}
      {maskActive && veilOpacity > 0.01 && (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <defs>
            <mask id={maskId}>
              <rect x="0" y="0" width={width} height={height} fill="white" />
              <g transform={`translate(${ecx} ${ecy}) scale(${textScale}) translate(${-ecx} ${-ecy})`}>
                <text {...textProps} fill="black">{bigText}</text>
              </g>
            </mask>
          </defs>
          <rect x="0" y="0" width={width} height={height} fill={veilColor} opacity={veilOpacity} mask={`url(#${maskId})`} />
        </svg>
      )}

      {subText && subOpacity > 0.01 && (
        <div style={{ position: "absolute", bottom: isVertical ? height * 0.16 : height * 0.12, left: 0, right: 0, textAlign: "center", opacity: subOpacity }}>
          <span style={{ color: theme === "parchment" ? "#2E1F0A" : HOOK_COLORS.ivory, fontSize: isVertical ? 46 : 40, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: HOOK_FONTS.display, textShadow: theme === "parchment" ? "none" : "0 4px 24px rgba(0,0,0,0.8)" }}>
            {subText}
          </span>
        </div>
      )}

      {question && questionOp > 0.01 && (
        <div style={{ position: "absolute", top: "50%", left: "6%", right: "6%", transform: `translateY(-50%) scale(${0.9 + questionScale * 0.1})`, textAlign: "center", opacity: questionOp }}>
          <div style={{ display: "inline-block", padding: isVertical ? "26px 30px" : "22px 34px", background: theme === "parchment" ? "rgba(245,239,214,0.82)" : "rgba(22,33,58,0.78)", borderTop: `3px solid ${accentColor}`, borderBottom: `3px solid ${accentColor}` }}>
            <div style={{ color: theme === "parchment" ? "#2E1F0A" : HOOK_COLORS.ivory, fontSize: isVertical ? 72 : 62, fontWeight: 700, lineHeight: 1.12, fontFamily: HOOK_FONTS.display, letterSpacing: "0.02em" }}>
              {question}
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default MaskReveal;
