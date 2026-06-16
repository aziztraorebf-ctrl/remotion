/**
 * CrosshairLock — HOOK d'ouverture LONG (~7s). VRAI hook : cree une TENSION non resolue.
 *
 * Structure (validee Aziz 2026-06-15) :
 *   PHASE 1 — RECHERCHE (0-2.5s) : un viseur cherche, hesite, micro-corrige sur une grille de
 *     coordonnees. Lent, attire le regard. Tension "quoi ? ou va-t-il se fixer ?".
 *   PHASE 2 — LOCK + SWITCH ZOOM (2.5-3.2s) : verrouillage sec -> punch zoom RAPIDE vers la zone
 *     (la grille s'efface, on "plonge" dans le terrain). Installe l'action.
 *   PHASE 3 — TENSION (3.2-5.5s) : les pays focus s'allument + une amorce de tension monte
 *     (pulsation rouge sur la zone = quelque chose ne va pas).
 *   PHASE 4 — BOUCLE OUVERTE (5.5-7s) : une question apparait (ce que la video repond) = fait RESTER.
 *
 * AGNOSTIQUE AU FOND : prop `theme` ("dark" Souverain | "parchment" War-Map) via HookMapBackground.
 * RACCORD CARTE : prop `countriesGeoJson` -> charge la vraie couche pays du projet (raccord exact P4).
 *
 * Issu du DA-brief 3 modeles (CONVERGENCE 3/3), session bibliotheque hooks 2026-06-15.
 * Render via scripts/render-mapbox.sh (WebGL headless).
 */

import React, { useCallback, useRef, useState } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HookMapBackground } from "./HookMapBackground";
import { HOOK_COLORS, HOOK_FONTS, SPRING } from "./theme";

export interface CrosshairLockProps {
  center: [number, number];
  baseZoom?: number;
  theme?: "dark" | "parchment";
  /** Pays/zone a verrouiller (ISO alpha-3). 1 pays OU plusieurs (alliance AES). */
  focusIso: string | string[];
  label: string;
  subLabel?: string;
  /** Question de boucle ouverte (phase 4). Ce que la video promet de repondre. */
  question?: string;
  /** GeoJSON pays custom pour raccord exact (ex sahel-countries). Propriete `country`. */
  countriesGeoJson?: string;
  /** Trajectoire camera serree + pan (grammaire War-Map). Remplace le punch zoom si fourni. */
  camKeys?: { f: number; lon: number; lat: number; zoom: number }[];
  accentColor?: string;
  /** Frame du verrouillage. Recherche = 0..lockAt. */
  lockAt?: number;
  /** Delai (frames) entre l'allumage de chaque pays focus apres le lock = cascade (ex: 3 verbes). */
  litStagger?: number;
  /** Punch zoom apres lock (+delta). Ignore si camKeys fourni. */
  zoomPunch?: number;
  durationFrames?: number;
}

export const CrosshairLock: React.FC<CrosshairLockProps> = ({
  center,
  baseZoom = 4.2,
  theme = "dark",
  focusIso,
  label,
  subLabel,
  question,
  countriesGeoJson,
  camKeys,
  accentColor = HOOK_COLORS.gold,
  lockAt = 75,
  litStagger = 0,
  zoomPunch = 1.1,
  durationFrames = 210,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;
  const focusIsos = Array.isArray(focusIso) ? focusIso : [focusIso];
  const ink = theme === "parchment" ? "#3A2A18" : HOOK_COLORS.ivory;
  const lockColor = theme === "parchment" ? "#B14B3C" : accentColor;
  const redTension = "#B14B3C";

  // cible = projection ecran du centre du pays (remontee par le fond, suit le punch zoom)
  const targetRef = useRef<{ x: number; y: number }>({ x: width / 2, y: height / 2 });
  const [, force] = useState(0);
  const handleMapReady = useCallback(
    (ctx: { project: (c: [number, number]) => { x: number; y: number }; ready: boolean }) => {
      if (!ctx.ready) return;
      const p = ctx.project(center);
      if (Math.abs(p.x - targetRef.current.x) > 0.5 || Math.abs(p.y - targetRef.current.y) > 0.5) {
        targetRef.current = p;
        force((n) => n + 1);
      }
    },
    [center]
  );
  const target = targetRef.current;

  // ── PHASE 1 : RECHERCHE (lente) ──────────────────────────────────────────────
  const start = { x: width * 0.2, y: height * 0.24 };
  const approach = interpolate(frame, [10, lockAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ease = approach * approach * (3 - 2 * approach);
  const jitterAmp = (1 - approach) * (isVertical ? 28 : 22);
  const jitterX = Math.sin(frame * 1.5) * jitterAmp;
  const jitterY = Math.cos(frame * 2.1) * jitterAmp;

  // ── PHASE 2 : LOCK + punch zoom ──────────────────────────────────────────────
  const lock = spring({ frame: frame - lockAt, fps, config: SPRING.sec, durationInFrames: 16 });
  const cx = start.x + (target.x - start.x) * ease + jitterX * (1 - lock);
  const cy = start.y + (target.y - start.y) * ease + jitterY * (1 - lock);

  const R = isVertical ? 150 : 138;
  const ringR = R * (1 - 0.28 * lock);
  const bracket = lock;
  const bx = ringR * 1.5;

  const gridOpacity = interpolate(frame, [6, 18, lockAt + 8, lockAt + 22], [0, 0.85, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gridStep = isVertical ? 90 : 120;

  // viseur s'efface apres le punch zoom (on est "dans" le terrain)
  const reticleOp = interpolate(frame - lockAt, [0, 18, 34], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── PHASE 3 : TENSION (pulsation rouge sur la zone apres le zoom) ─────────────
  const tensionAt = lockAt + 24;
  const tensionOn = frame >= tensionAt;
  const tensionPulse = tensionOn ? 0.2 + 0.16 * Math.abs(Math.sin((frame - tensionAt) / 9)) : 0;

  // ── PHASE 4 : BOUCLE OUVERTE (question) — domine la 2e moitie du hook ─────────
  const questionAt = lockAt + 56;
  const questionOp = interpolate(frame - questionAt, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const questionScale = spring({ frame: frame - questionAt, fps, config: SPRING.lourd, durationInFrames: 22 });

  // label (nom) apparait au lock, puis laisse place a la question
  const labelOp = interpolate(
    frame - (lockAt + 6),
    [0, 12, questionAt - lockAt - 10, questionAt - lockAt + 4],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const globalOpacity = interpolate(frame, [durationFrames - 12, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: globalOpacity }}>
      <HookMapBackground
        center={center}
        baseZoom={baseZoom}
        theme={theme}
        focusIsos={focusIsos}
        accentColor={accentColor}
        litFrom={lockAt}
        litStagger={litStagger}
        durationFrames={durationFrames}
        driftAmount={0.5}
        punchZoom={camKeys ? undefined : { at: lockAt, delta: zoomPunch, dur: 11 }}
        camKeys={camKeys}
        countriesGeoJson={countriesGeoJson}
        onMapReady={handleMapReady}
      />

      {/* pulsation rouge de tension sur la zone (phase 3) */}
      {tensionOn && (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <radialGradient id="cl-tension" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={redTension} stopOpacity={tensionPulse} />
            <stop offset="70%" stopColor={redTension} stopOpacity={tensionPulse * 0.4} />
            <stop offset="100%" stopColor={redTension} stopOpacity={0} />
          </radialGradient>
          <circle cx={target.x} cy={target.y} r={isVertical ? 360 : 300} fill="url(#cl-tension)" />
        </svg>
      )}

      <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: reticleOp }}>
        {/* grille de coordonnees */}
        {gridOpacity > 0.01 && (
          <g opacity={gridOpacity} stroke={ink} strokeWidth={1.4}>
            {Array.from({ length: Math.ceil(width / gridStep) + 1 }, (_, i) => (
              <line key={`v${i}`} x1={i * gridStep} y1={0} x2={i * gridStep} y2={height} opacity={0.5} />
            ))}
            {Array.from({ length: Math.ceil(height / gridStep) + 1 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i * gridStep} x2={width} y2={i * gridStep} opacity={0.5} />
            ))}
          </g>
        )}

        {/* lignes guides HUD */}
        {frame >= 10 && (
          <g stroke={lock > 0.5 ? lockColor : ink} strokeWidth={1.5} opacity={lock > 0.5 ? 0.5 : 0.35}>
            <line x1={0} y1={cy} x2={width} y2={cy} />
            <line x1={cx} y1={0} x2={cx} y2={height} />
          </g>
        )}

        {/* viseur */}
        {frame >= 10 && (
          <g stroke={lock > 0.5 ? lockColor : ink} strokeWidth={isVertical ? 4 : 3} fill="none">
            <circle cx={cx} cy={cy} r={ringR} opacity={0.9} />
            <circle cx={cx} cy={cy} r={ringR * 0.62} opacity={0.4} />
            <line x1={cx - 16} y1={cy} x2={cx + 16} y2={cy} />
            <line x1={cx} y1={cy - 16} x2={cx} y2={cy + 16} />
          </g>
        )}

        {/* crochets de coin qui claquent au lock */}
        {bracket > 0.01 && (
          <g stroke={lockColor} strokeWidth={isVertical ? 5 : 4} fill="none" opacity={bracket}>
            {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => {
              const k = 28;
              const px = cx + sx * bx, py = cy + sy * bx;
              return (
                <path key={i} d={`M ${px - sx * k} ${py} L ${px} ${py} L ${px} ${py - sy * k}`} strokeLinecap="round" />
              );
            })}
          </g>
        )}
      </svg>

      {/* label (nom) — phase lock */}
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
            <span style={{ color: lockColor, fontSize: isVertical ? 30 : 26, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: HOOK_FONTS.mono }}>
              {subLabel}
            </span>
          </div>
        )}
      </div>

      {/* question — boucle ouverte (phase 4) : DOMINE l'ecran, c'est elle qui fait RESTER */}
      {question && questionOp > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "6%",
            right: "6%",
            transform: `translateY(-50%) scale(${0.9 + questionScale * 0.1})`,
            textAlign: "center",
            opacity: questionOp,
          }}
        >
          {/* bandeau lisibilite (renforce le contraste sur la carte) */}
          <div
            style={{
              display: "inline-block",
              padding: isVertical ? "26px 30px" : "22px 34px",
              background:
                theme === "parchment" ? "rgba(245,239,214,0.82)" : "rgba(22,33,58,0.78)",
              borderTop: `3px solid ${lockColor}`,
              borderBottom: `3px solid ${lockColor}`,
            }}
          >
            <div
              style={{
                color: theme === "parchment" ? "#2E1F0A" : HOOK_COLORS.ivory,
                fontSize: isVertical ? 72 : 62,
                fontWeight: 700,
                lineHeight: 1.12,
                fontFamily: HOOK_FONTS.display,
                letterSpacing: "0.02em",
              }}
            >
              {question}
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default CrosshairLock;
