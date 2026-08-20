// MOTEUR: capture-UI (shotcraft) — plaque reelle dans le laptop + camera/curseur solidaires
/**
 * NorthShieldCursorFlyover — TEST v2 du pipeline video-shotcraft.
 *
 * Recette : camera/cursor-flyover (shotcraft), appliquee a NOTRE LaptopMockup (chassis SVG
 * genere par Fable 5) avec la capture Puppeteer reelle de la page NorthShield dans l'ecran.
 *
 * ⭐ Le principe central de la fiche : "la camera et le curseur sont UN SEUL SYSTEME".
 * Les 5 canaux tx/ty/s/cx/cy vivent dans la MEME table CAM et passent par le MEME
 * accumulateur `acc` — ils arrivent donc toujours ensemble. Le curseur porte scale(1/s)
 * pour garder sa taille apparente : sans ca il devient enorme en gros plan et on perd
 * l'illusion qu'il appartient a la couche UI.
 *
 * Difference avec la fiche : elle fait 4 coins d'un tour de fonctionnalites. Ici le trajet
 * est NARRATIF (vue d'ensemble -> ligne normale -> ligne signalee -> score 82), parce que
 * le sujet n'est pas "voici 4 features" mais "voici comment une anomalie se detecte".
 *
 * Duree : 210f @30fps = 7s.
 */
import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, Easing, Img } from "remotion";
import { LaptopMockup } from "../ui/LaptopMockup";
import layout from "./live-layout.json";

export const NS_FLYOVER_FPS = 30;
export const NS_FLYOVER_FRAMES = 210;

const PAGE_W = 1920;
const PAGE_H = 1080;
const ROWS = layout.dashboard.boxes.rows;
const FLAGGED = ROWS[ROWS.length - 1];

const NAVY_DEEP = "#0A1628";
const ACCENT_RED = "#FF4D5E";

// Conversion coords page -> pourcentage monde (la camera raisonne en %).
const pctX = (px: number) => (px / PAGE_W) * 100;
const pctY = (px: number) => (px / PAGE_H) * 100;

// Table camera : 5 canaux, comme la fiche. tx/ty = point vise, s = zoom, cx/cy = curseur.
// Etape 0 = vue d'ensemble ; 1 = une ligne normale (Sarah 09:14, autorisee) ;
// 2 = la ligne signalee ; 3 = le score 82 en gros plan.
const rowMidY = (i: number) => pctY(ROWS[i].y + ROWS[i].h / 2);
const CAM = [
  { tx: 50, ty: 50, s: 1.0, cx: 50, cy: 58 },
  { tx: 46, ty: rowMidY(3), s: 1.5, cx: 30, cy: rowMidY(3) },
  { tx: 46, ty: pctY(FLAGGED.y + FLAGGED.h / 2), s: 1.5, cx: 34, cy: pctY(FLAGGED.y + FLAGGED.h / 2) },
  { tx: 71, ty: pctY(FLAGGED.y + FLAGGED.h / 2), s: 2.1, cx: 71.5, cy: pctY(FLAGGED.y + FLAGGED.h / 2) },
];
// Fenetres [transition, arret] — la fiche impose des segments de meme longueur (pas de "parcours").
const WIN: [number, number][] = [
  [0.18, 0.34],
  [0.44, 0.60],
  [0.68, 0.84],
];
const KEYS = ["tx", "ty", "s", "cx", "cy"] as const;
type Chan = (typeof KEYS)[number];

function seg(t: number, a: number, b: number, ease: (x: number) => number): number {
  const raw = interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return ease(raw);
}

// Accumulateur de la fiche : chaque segment pousse vers son keyframe, les segments s'additionnent.
function acc(t: number): Record<Chan, number> {
  const out = { ...CAM[0] } as Record<Chan, number>;
  let prev = CAM[0] as Record<Chan, number>;
  WIN.forEach((w, i) => {
    const u = seg(t, w[0], w[1], Easing.inOut(Easing.cubic));
    const to = CAM[i + 1] as Record<Chan, number>;
    KEYS.forEach((k) => {
      out[k] += u * (to[k] - prev[k]);
    });
    prev = to;
  });
  return out;
}

const CursorArrow: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 24 34" style={{ display: "block" }}>
    <path
      d="M3 2 L3 26 L9.5 20.5 L13.5 30 L17.5 28 L13.5 19 L21 18.5 Z"
      fill="#FFFFFF"
      stroke="#0A1628"
      strokeWidth={1.6}
      strokeLinejoin="round"
      style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,.55))" }}
    />
  </svg>
);

/** Le contenu d'ecran : la capture reelle + la camera + le curseur, tout dans le repere page. */
const ScreenWorld: React.FC<{ t: number }> = ({ t }) => {
  const v = acc(t);
  const fade = seg(t, 0, 0.12, Easing.out(Easing.cubic));
  const blur = interpolate(fade, [0, 1], [5, 0]);

  // Onde de clic a chaque arrivee (fiche : 0.055 de duree, scale 0.3 -> 1.9).
  let click = 0;
  WIN.forEach((w) => {
    const c = seg(t, w[1], w[1] + 0.055, Easing.out(Easing.cubic));
    if (c > 0) click = c < 1 ? c : 1;
  });
  const rippleScale = interpolate(click, [0, 1], [0.3, 1.9]);
  const rippleOpacity = click > 0 && click < 1 ? interpolate(click, [0, 1], [0.9, 0]) : 0;

  // Le risque se declare quand la camera arrive sur la ligne signalee.
  const riskGlow = seg(t, WIN[1][1], WIN[1][1] + 0.08, Easing.out(Easing.cubic));

  // Respiration sub-pixel pendant les arrets (fiche : les temps morts se lisent comme un gel).
  const breathe = Math.sin(t * Math.PI * 6) * 0.4;

  return (
    <div style={{ position: "absolute", inset: 0, background: NAVY_DEEP, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "0 0",
          transform: `translate(${50 - v.tx * v.s}%, ${50 - v.ty * v.s + breathe * 0.05}%) scale(${v.s})`,
          opacity: fade,
          filter: `blur(${blur}px)`,
        }}
      >
        <Img
          src={staticFile("_client-sim/noteshield/live/dashboard-full.png")}
          style={{ width: PAGE_W, height: PAGE_H, display: "block" }}
        />

        {/* Halo de risque sur la ligne signalee, dans le repere de la page. */}
        <div
          style={{
            position: "absolute",
            left: FLAGGED.x,
            top: FLAGGED.y,
            width: FLAGGED.w,
            height: FLAGGED.h,
            borderRadius: 16,
            border: `2px solid ${ACCENT_RED}`,
            boxShadow: `0 0 ${44 * riskGlow}px ${ACCENT_RED}`,
            opacity: riskGlow,
          }}
        />

        {/* Curseur : meme table que la camera, taille compensee par 1/s. */}
        <div
          style={{
            position: "absolute",
            left: `${v.cx}%`,
            top: `${v.cy}%`,
            transform: `scale(${1 / v.s})`,
            transformOrigin: "0 0",
          }}
        >
          <CursorArrow size={34} />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 26,
              height: 26,
              marginLeft: -13,
              marginTop: -13,
              borderRadius: 999,
              border: `2px solid #FFFFFF`,
              transform: `scale(${rippleScale})`,
              opacity: rippleOpacity,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const NorthShieldCursorFlyover: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / (NS_FLYOVER_FRAMES - 1);

  // Le laptop lui-meme respire tres legerement (jamais fige, jamais bavard).
  const tilt = Math.sin(t * Math.PI * 2) * 0.6;
  const rise = interpolate(t, [0, 0.12], [26, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NAVY_DEEP, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `perspective(2200px) rotateY(${tilt}deg) translateY(${rise}px)`,
          transformOrigin: "center center",
        }}
      >
        <LaptopMockup width={1720} screenContent={<ScreenWorld t={t} />} />
      </div>
    </AbsoluteFill>
  );
};
