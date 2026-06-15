/**
 * ArteryDrain — HOOK "l'hemorragie" : un pays s'allume, puis des faisceaux jaillissent de lui
 * vers les bords de l'ecran (la richesse qui FUIT : ressources exportees, capitaux drainees),
 * couronnes par un compteur geant.
 *
 * Idee : DA-brief 3 modeles (Gemini), session bibliotheque de hooks 2026-06-15.
 * Pilier : SOUVERAIN ECO (fuite des ressources — uranium Niger, or, petrole). Reutilisable War-Map.
 *
 * Mecanique (@30fps, par defaut) :
 *   0-1s   : le pays focus s'allume en or (via HookMapBackground.litFrom)
 *   1-2s   : N faisceaux laser fins jaillissent du CENTRE GEO du pays vers les bords, en cascade
 *            (stroke-dasharray qui se trace) — chacun finit par une fleche/pointe vers l'exterieur
 *   2-3s   : un compteur geant (countup) slamme au centre-haut avec rebond (spring impact)
 *   fin    : respiration (freeze) + fade out
 *
 * AGNOSTIQUE AU FOND : recoit le fond via le composant HookMapBackground (injecte par defaut).
 * Les faisceaux s'ancrent sur la projection ecran reelle du pays (callback onMapReady).
 *
 * Usage :
 *   <ArteryDrain center={[8.08,17.6]} baseZoom={4.8} focusIso="NER"
 *     bigText="68t" subText="D'URANIUM PAR AN" rays={8} />
 *
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

export interface ArteryDrainProps {
  center: [number, number];
  baseZoom?: number;
  /** Pays source de l'hemorragie (ISO alpha-3). */
  focusIso: string;
  /** Chiffre choc affiche au climax (ex "68t", "12 Md$"). */
  bigText: string;
  /** Sous-texte (ex "D'URANIUM PAR AN"). */
  subText?: string;
  /** Nombre de faisceaux qui jaillissent. */
  rays?: number;
  accentColor?: string;
  /** Couleur des faisceaux de fuite (defaut = accent). Rouge pour une fuite "subie". */
  rayColor?: string;
  litAt?: number;
  raysAt?: number;
  countAt?: number;
  durationFrames?: number;
}

export const ArteryDrain: React.FC<ArteryDrainProps> = ({
  center,
  baseZoom = 4.8,
  focusIso,
  bigText,
  subText,
  rays = 8,
  accentColor = HOOK_COLORS.gold,
  rayColor,
  litAt = 6,
  raysAt = 30,
  countAt = 64,
  durationFrames = 110,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;
  const beamColor = rayColor ?? accentColor;

  // Origine des faisceaux = projection ecran du centre du pays (remontee par le fond).
  // Defaut : centre de l'ecran tant que la carte n'a pas projete.
  const originRef = useRef<{ x: number; y: number }>({ x: width / 2, y: height / 2 });
  const [, force] = useState(0);

  const handleMapReady = useCallback(
    (ctx: { project: (c: [number, number]) => { x: number; y: number }; ready: boolean }) => {
      if (!ctx.ready) return;
      const p = ctx.project(center);
      if (Math.abs(p.x - originRef.current.x) > 0.5 || Math.abs(p.y - originRef.current.y) > 0.5) {
        originRef.current = p;
        force((n) => n + 1); // re-render overlay avec la nouvelle origine
      }
    },
    [center]
  );

  // ── Faisceaux : EVENTAIL ORIENTE vers le haut/nord-est (le "monde" qui draine) ──
  // Pas un rayonnement symetrique (lirait "soleil") : un faisceau de fuite DIRECTIONNEL,
  // ouvert vers le haut de l'ecran (l'exterieur, l'export), pour dire "ca PART d'ici".
  const origin = originRef.current;
  const diag = Math.hypot(width, height);
  const FAN_CENTER = -Math.PI / 2 + 0.35; // vers le haut, legerement nord-est
  const FAN_SPREAD = Math.PI * 0.92; // ouverture de l'eventail (~165°)
  const beams = Array.from({ length: rays }, (_, i) => {
    const t = rays === 1 ? 0.5 : i / (rays - 1); // 0..1 sur l'eventail
    const ang = FAN_CENTER + (t - 0.5) * FAN_SPREAD;
    const len = diag * (0.58 + 0.1 * Math.abs(t - 0.5)); // bords un peu plus longs
    return {
      ang,
      x2: origin.x + Math.cos(ang) * len,
      y2: origin.y + Math.sin(ang) * len,
      len,
      // cascade : chaque faisceau demarre 2 frames apres le precedent
      startAt: raysAt + i * 2,
    };
  });

  // compteur (countup) — parse le nombre dans bigText, garde le suffixe (t, Md$, %)
  const numMatch = bigText.match(/[\d.,]+/);
  const targetNum = numMatch ? parseFloat(numMatch[0].replace(/\s/g, "").replace(",", ".")) : 0;
  const suffix = numMatch ? bigText.replace(numMatch[0], "").trim() : bigText;
  const countProg = interpolate(frame - countAt, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shownNum = targetNum * countProg;
  const numStr =
    targetNum >= 100 || Number.isInteger(targetNum)
      ? Math.round(shownNum).toString()
      : shownNum.toFixed(1);

  const countSlam = spring({
    frame: frame - countAt,
    fps,
    config: SPRING.impact,
    durationInFrames: 20,
  });
  const countScale = 0.6 + countSlam * 0.4;

  const subOpacity = interpolate(frame - (countAt + 16), [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const globalOpacity = interpolate(frame, [durationFrames - 10, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bigFontSize = isVertical ? width * 0.3 : height * 0.34;

  return (
    <AbsoluteFill style={{ opacity: globalOpacity }}>
      {/* FOND injecte (agnostique) — drift + allumage pays + projection */}
      <HookMapBackground
        center={center}
        baseZoom={baseZoom}
        focusIsos={[focusIso]}
        accentColor={accentColor}
        litFrom={litAt}
        durationFrames={durationFrames}
        onMapReady={handleMapReady}
      />

      {/* Faisceaux de fuite (stroke-dasharray qui se trace du pays vers les bords) */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <radialGradient id="ad-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={beamColor} stopOpacity={0.9} />
            <stop offset="100%" stopColor={beamColor} stopOpacity={0} />
          </radialGradient>
        </defs>

        {beams.map((b, i) => {
          const total = b.len;
          const draw = interpolate(frame - b.startAt, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (draw <= 0) return null;
          const fade = interpolate(frame - b.startAt, [0, 10, 40], [0, 1, 0.5], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          // point courant du trace (tete de la ligne qui se dessine)
          const headT = draw;
          const headX = origin.x + Math.cos(b.ang) * total * headT;
          const headY = origin.y + Math.sin(b.ang) * total * headT;
          // pointe directionnelle (petit chevron oriente vers l'exterieur) une fois trace
          const arr = isVertical ? 13 : 11;
          const ax = b.x2, ay = b.y2;
          const left = b.ang + 2.6, right = b.ang - 2.6;
          const arrowOp = interpolate(frame - b.startAt, [12, 18], [0, fade], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          // paquet lumineux qui VOYAGE du pays vers le bord (le flux qui part), en boucle
          const travel = ((frame - b.startAt) % 36) / 36;
          const tx = origin.x + Math.cos(b.ang) * total * travel;
          const ty = origin.y + Math.sin(b.ang) * total * travel;
          const travelOn = frame - b.startAt > 14 && travel < draw;
          return (
            <g key={i}>
              <line
                x1={origin.x}
                y1={origin.y}
                x2={headX}
                y2={headY}
                stroke={beamColor}
                strokeWidth={isVertical ? 3 : 2.4}
                strokeLinecap="round"
                opacity={fade}
              />
              {/* pointe = chevron sortant */}
              {arrowOp > 0.01 && (
                <path
                  d={`M ${ax + Math.cos(left) * arr} ${ay + Math.sin(left) * arr} L ${ax} ${ay} L ${ax + Math.cos(right) * arr} ${ay + Math.sin(right) * arr}`}
                  stroke={beamColor}
                  strokeWidth={isVertical ? 3 : 2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={arrowOp}
                />
              )}
              {/* paquet lumineux qui file vers l'exterieur */}
              {travelOn && (
                <circle cx={tx} cy={ty} r={isVertical ? 5 : 4} fill={HOOK_COLORS.ivory} opacity={fade * 0.9} />
              )}
            </g>
          );
        })}

        {/* coeur lumineux pulsant sur le pays (origine de l'hemorragie) */}
        {frame >= litAt && (
          <circle
            cx={origin.x}
            cy={origin.y}
            r={interpolate(frame - litAt, [0, 20], [0, isVertical ? 70 : 56], { extrapolateRight: "clamp" })}
            fill="url(#ad-core)"
            opacity={0.6 + 0.25 * Math.sin(frame / 6)}
          />
        )}
      </svg>

      {/* Compteur geant au climax */}
      {frame >= countAt - 4 && (
        <div
          style={{
            position: "absolute",
            top: isVertical ? height * 0.1 : height * 0.08,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <div
            style={{
              transform: `scale(${countScale})`,
              color: accentColor,
              fontSize: bigFontSize,
              fontWeight: 900,
              lineHeight: 1,
              fontFamily: HOOK_FONTS.display,
              textShadow: "0 6px 40px rgba(0,0,0,0.85)",
              letterSpacing: "0.02em",
            }}
          >
            {numStr}
            <span style={{ fontSize: "0.5em", marginLeft: "0.08em" }}>{suffix}</span>
          </div>
          {subText && (
            <div style={{ marginTop: isVertical ? 18 : 12, opacity: subOpacity }}>
              <span
                style={{
                  color: HOOK_COLORS.ivory,
                  fontSize: isVertical ? 40 : 34,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontFamily: HOOK_FONTS.display,
                  textShadow: "0 4px 24px rgba(0,0,0,0.8)",
                }}
              >
                {subText}
              </span>
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

export default ArteryDrain;
