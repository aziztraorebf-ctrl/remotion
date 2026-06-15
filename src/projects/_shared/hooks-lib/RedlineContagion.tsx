/**
 * RedlineContagion — HOOK d'ouverture (registre CONFLIT). VRAI hook : installe une menace qui s'etend.
 *
 * Une ligne rouge se dessine violemment sur la zone, puis la couleur de menace "bave" de pays en
 * pays (contagion sequentielle), et des icones de menace tombent sur les zones touchees. Tension :
 * "ca s'etend — jusqu'ou ?". Registre guerre/insecurite (complementaire de CrosshairLock).
 *
 * Issu du DA-brief 3 modeles (Gemini RedlineContagion + Kimi LaserGridIntrusion), session 2026-06-15.
 * AGNOSTIQUE AU FOND : prop `theme` ("dark" | "parchment") + raccord carte via `countriesGeoJson`.
 * Reutilise la cascade d'allumage de HookMapBackground (litStagger) = contagion, pas une compo Mapbox a part.
 *
 * Mecanique (@30fps) :
 *   0-1s     : la carte, une frontiere rouge se TRACE sur le 1er pays (stroke-dasharray)
 *   1-2.5s   : la menace rouge BAVE de pays en pays (litStagger = cascade d'allumage rouge)
 *   2.5-4s   : icones de menace (Lucide AlertTriangle) TOMBENT sur les zones (spring) + label
 *   4s+      : pulsation rouge maintenue (la menace reste) + question optionnelle
 *
 * Render via scripts/render-mapbox.sh (WebGL headless).
 */

import React, { useCallback, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HookMapBackground } from "./HookMapBackground";
import { HOOK_COLORS, HOOK_FONTS, SPRING } from "./theme";

const RED = "#B14B3C"; // rouge brique (menace, coherent palette parchemin/dark)

export interface RedlineContagionProps {
  center: [number, number];
  baseZoom?: number;
  theme?: "dark" | "parchment";
  /** Pays touches dans l'ORDRE de contagion (1er = epicentre). */
  focusIso: string[];
  /** Point [lon,lat] de l'epicentre : un IMPACT rouge y claque au depart (le punch). */
  epicenter?: [number, number];
  /** Points [lon,lat] ou des icones de menace tombent (capitales assiegees, foyers). */
  threats?: [number, number][];
  label: string;
  subLabel?: string;
  question?: string;
  countriesGeoJson?: string;
  contagionAt?: number;
  contagionGap?: number;
  durationFrames?: number;
}

export const RedlineContagion: React.FC<RedlineContagionProps> = ({
  center,
  baseZoom = 4.0,
  theme = "parchment",
  focusIso,
  epicenter,
  threats = [],
  label,
  subLabel,
  question,
  countriesGeoJson,
  contagionAt = 14,
  contagionGap = 16,
  durationFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;

  // projection des points de menace (remontee par le fond)
  const projRef = useRef<((c: [number, number]) => { x: number; y: number }) | null>(null);
  const [, force] = useState(0);
  const handleMapReady = useCallback(
    (ctx: { project: (c: [number, number]) => { x: number; y: number }; ready: boolean }) => {
      if (!ctx.ready) return;
      projRef.current = ctx.project;
      force((n) => (n + 1) % 1000);
    },
    []
  );
  const project = projRef.current;

  // dernier pays touche par la contagion
  const lastLit = contagionAt + (focusIso.length - 1) * contagionGap;

  // icones de menace : tombent apres que la contagion les atteigne (espacees = un beat chacune)
  const threatStep = 14;
  const threatsStart = lastLit + 24;
  const lastThreat = threatsStart + Math.max(0, threats.length - 1) * threatStep;

  const labelOp = interpolate(frame - (lastLit + 6), [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const questionAt = lastThreat + 26;
  const questionOp = interpolate(frame - questionAt, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const questionScale = spring({ frame: frame - questionAt, fps, config: SPRING.lourd, durationInFrames: 22 });
  const globalOpacity = interpolate(frame, [durationFrames - 12, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // pulsation rouge globale (la menace "respire") une fois la contagion lancee
  const pulse = frame > contagionAt ? 0.5 + 0.5 * Math.abs(Math.sin(frame / 11)) : 0;

  return (
    <AbsoluteFill style={{ opacity: globalOpacity }}>
      {/* FOND : contagion = allumage ROUGE en cascade (litStagger) */}
      <HookMapBackground
        center={center}
        baseZoom={baseZoom}
        theme={theme}
        focusIsos={focusIso}
        accentColor={RED}
        litFrom={contagionAt}
        litStagger={contagionGap}
        litFillOpacity={0.5}
        durationFrames={durationFrames}
        driftAmount={0.4}
        countriesGeoJson={countriesGeoJson}
        countryBorderColor={theme === "parchment" ? "#3A2A18" : HOOK_COLORS.ivory}
        onMapReady={handleMapReady}
      />

      {/* IMPACT initial : un point rouge claque sur l'epicentre + ondes de choc (le punch) */}
      {project && epicenter && frame >= contagionAt - 4 && (() => {
        const p = project(epicenter);
        const hit = spring({ frame: frame - contagionAt, fps, config: SPRING.impact, durationInFrames: 14 });
        return (
          <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {/* ondes de choc concentriques qui partent de l'epicentre */}
            {[0, 8, 16].map((d, k) => {
              const t = interpolate(frame - (contagionAt + d), [0, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (t <= 0 || t >= 1) return null;
              return (
                <circle key={k} cx={p.x} cy={p.y} r={t * (isVertical ? 220 : 180)} fill="none" stroke={RED} strokeWidth={3} opacity={(1 - t) * 0.7} />
              );
            })}
            {/* point d'impact */}
            <circle cx={p.x} cy={p.y} r={(isVertical ? 16 : 13) * hit} fill={RED} opacity={0.9} />
          </svg>
        );
      })()}

      {/* icones de menace qui tombent sur les foyers */}
      {project && threats.map((pt, i) => {
        const at = threatsStart + i * threatStep;
        const drop = spring({ frame: frame - at, fps, config: SPRING.impact, durationInFrames: 18 });
        if (drop <= 0.001) return null;
        const p = project(pt);
        const size = (isVertical ? 80 : 66) * drop;
        const fall = (1 - drop) * -50; // tombe du dessus
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y + fall,
              transform: "translate(-50%, -50%)",
              opacity: drop,
              filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.45))",
            }}
          >
            <AlertTriangle size={size} color={RED} strokeWidth={2.4} fill={`${RED}33`} />
          </div>
        );
      })}

      {/* label */}
      <div style={{ position: "absolute", bottom: isVertical ? height * 0.16 : height * 0.1, left: 0, right: 0, textAlign: "center", opacity: labelOp }}>
        <div
          style={{
            color: theme === "parchment" ? "#2E1F0A" : HOOK_COLORS.ivory,
            fontSize: isVertical ? 80 : 64,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily: HOOK_FONTS.display,
            textShadow: theme === "parchment" ? "none" : "0 4px 24px rgba(0,0,0,0.7)",
          }}
        >
          {label}
        </div>
        {subLabel && (
          <div style={{ marginTop: 8 }}>
            <span style={{ color: RED, fontSize: isVertical ? 30 : 26, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: HOOK_FONTS.mono, opacity: 0.7 + 0.3 * pulse }}>
              {subLabel}
            </span>
          </div>
        )}
      </div>

      {/* question — boucle ouverte */}
      {question && questionOp > 0.01 && (
        <div style={{ position: "absolute", top: "50%", left: "6%", right: "6%", transform: `translateY(-50%) scale(${0.9 + questionScale * 0.1})`, textAlign: "center", opacity: questionOp }}>
          <div style={{ display: "inline-block", padding: isVertical ? "26px 30px" : "22px 34px", background: theme === "parchment" ? "rgba(245,239,214,0.82)" : "rgba(22,33,58,0.78)", borderTop: `3px solid ${RED}`, borderBottom: `3px solid ${RED}` }}>
            <div style={{ color: theme === "parchment" ? "#2E1F0A" : HOOK_COLORS.ivory, fontSize: isVertical ? 72 : 62, fontWeight: 700, lineHeight: 1.12, fontFamily: HOOK_FONTS.display, letterSpacing: "0.02em" }}>
              {question}
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default RedlineContagion;
