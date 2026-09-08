// MOTEUR: SVG pur -- QUOI/COMMENT: demo 4 s candidature Upwork "Earth to Suzy".
// Tampon avion (impact sec) -> trajectoire pointillee progressive -> tampon
// ballon de foot avec seconde impression decalee plus pale (le tampon a
// rebondi) + micro-eclaboussures d'encre. Texture d'encre tamponnee 100 % SVG
// (feTurbulence + feDisplacementMap + knockouts d'alpha), papier blanc casse
// froid. Muet. Reference matiere : out/_r-and-d/upwork-earthtosuzy/planche-gpt.png
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const ETS_DEMO_FRAMES = 120;
export const ETS_DEMO_FPS = 30;

// Palette : papier blanc casse FROID (pas beige), encre noire dense.
const PAPER = "#F2F3F1";
const INK = "#101010";

// Timeline (30 fps)
const PLANE_IMPACT = 8;
const DASH_START = 20;
const DASH_STEP = 3;
const N_DASH = 13;
const TOUCH_LIGHT = 58; // seconde impression (contact leger, avant le pose ferme)
const BALL_IMPACT = 63;

// Geometrie de scene : baseline invisible commune ~y=635
const PLANE_CX = 350;
const PLANE_CY = 555;
const BALL_CX = 960;
const BALL_CY = 540;
const BALL_R = 95;

type Pt = { x: number; y: number };

const quadBezier = (p0: Pt, p1: Pt, p2: Pt, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
};

const quadTangentDeg = (p0: Pt, p1: Pt, p2: Pt, t: number): number => {
  const u = 1 - t;
  const dx = 2 * u * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * u * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};

const TRAJ_P0: Pt = { x: 455, y: 655 };
const TRAJ_P1: Pt = { x: 690, y: 745 };
const TRAJ_P2: Pt = { x: 852, y: 602 };

// Echantillonnage en longueur d'arc (t uniforme tasse les derniers pointilles)
const buildDashSlots = (n: number): Array<{ p: Pt; ang: number }> => {
  const steps = 240;
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i += 1) {
    pts.push(quadBezier(TRAJ_P0, TRAJ_P1, TRAJ_P2, i / steps));
  }
  const cum: number[] = [0];
  for (let i = 1; i <= steps; i += 1) {
    const a = pts[i - 1];
    const b = pts[i];
    cum.push(cum[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
  }
  const total = cum[steps];
  const first = 10;
  const last = total - 34;
  const slots: Array<{ p: Pt; ang: number }> = [];
  for (let k = 0; k < n; k += 1) {
    const target = first + (k * (last - first)) / (n - 1);
    let idx = 0;
    while (idx < steps && cum[idx + 1] < target) {
      idx += 1;
    }
    const t = idx / steps;
    slots.push({
      p: quadBezier(TRAJ_P0, TRAJ_P1, TRAJ_P2, t),
      ang: quadTangentDeg(TRAJ_P0, TRAJ_P1, TRAJ_P2, t),
    });
  }
  return slots;
};

const DASH_SLOTS = buildDashSlots(N_DASH);

const polar = (r: number, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
};

// Eclaboussures d'encre autour du ballon (positions fixes, deterministes)
const SPLATTER: ReadonlyArray<{ x: number; y: number; r: number; o: number }> = [
  { x: 1082, y: 618, r: 5.5, o: 0.85 },
  { x: 1108, y: 578, r: 3.2, o: 0.7 },
  { x: 1069, y: 662, r: 2.6, o: 0.6 },
  { x: 1122, y: 636, r: 2.0, o: 0.5 },
  { x: 852, y: 452, r: 4.2, o: 0.55 },
  { x: 826, y: 486, r: 2.4, o: 0.45 },
  { x: 878, y: 424, r: 2.0, o: 0.4 },
  { x: 1044, y: 434, r: 3.0, o: 0.6 },
  { x: 1070, y: 468, r: 2.2, o: 0.45 },
  { x: 934, y: 668, r: 2.8, o: 0.65 },
];

// Tremblement du papier a l'impact : oscillation amortie, deterministe.
const shakeAt = (frame: number, start: number, amp: number): number => {
  const t = frame - start;
  if (t < 0 || t > 12) {
    return 0;
  }
  return amp * Math.exp(-t * 0.45) * Math.sin(t * 2.3);
};

const SoccerBall: React.FC = () => {
  const spokes: React.ReactNode[] = [];
  const rimEdges: React.ReactNode[] = [];
  const pentagonPts: string[] = [];
  for (let i = 0; i < 5; i += 1) {
    const ang = -90 + i * 72;
    const inner = polar(34, ang);
    const tip = polar(64, ang);
    pentagonPts.push(`${inner.x.toFixed(1)},${inner.y.toFixed(1)}`);
    spokes.push(
      <line
        key={`s${i}`}
        x1={inner.x}
        y1={inner.y}
        x2={tip.x}
        y2={tip.y}
        stroke={INK}
        strokeWidth={7}
        strokeLinecap="round"
      />,
    );
    const rimA = polar(95, ang - 26);
    const rimB = polar(95, ang + 26);
    rimEdges.push(
      <line
        key={`ra${i}`}
        x1={tip.x}
        y1={tip.y}
        x2={rimA.x}
        y2={rimA.y}
        stroke={INK}
        strokeWidth={7}
        strokeLinecap="round"
      />,
      <line
        key={`rb${i}`}
        x1={tip.x}
        y1={tip.y}
        x2={rimB.x}
        y2={rimB.y}
        stroke={INK}
        strokeWidth={7}
        strokeLinecap="round"
      />,
    );
  }
  return (
    <g>
      <circle cx={0} cy={0} r={BALL_R} fill="none" stroke={INK} strokeWidth={8} />
      <polygon points={pentagonPts.join(" ")} fill={INK} />
      {spokes}
      {rimEdges}
    </g>
  );
};

// Avion line-art, vu de profil, nez vers la droite. Centre local (0,0).
const Airplane: React.FC = () => {
  return (
    <g fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M -138 -4 Q -120 -22 -82 -26 L 72 -26 Q 112 -22 138 -4 Q 112 16 72 20 L -82 20 Q -120 16 -138 -4 Z" />
      <path d="M -100 -24 L -130 -76 L -94 -70 L -64 -26" />
      <path d="M -10 18 L -52 64 L -12 60 L 30 20" />
      <path d="M -102 12 L -126 40 L -94 36 L -74 16" />
      <path d="M 98 -16 Q 114 -12 124 -4" strokeWidth={7} />
      <circle cx={-50} cy={-7} r={5.5} strokeWidth={6} />
      <circle cx={-24} cy={-7} r={5.5} strokeWidth={6} />
      <circle cx={2} cy={-7} r={5.5} strokeWidth={6} />
      <circle cx={28} cy={-7} r={5.5} strokeWidth={6} />
    </g>
  );
};

export const IntroPreuveDePassage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Impact avion : SEC (spring raide, pose et s'arrete net)
  const planeVisible = frame >= PLANE_IMPACT;
  const planeSpring = spring({
    frame: frame - PLANE_IMPACT,
    fps,
    config: { damping: 18, stiffness: 420, mass: 0.5 },
  });
  const planeScale = planeVisible
    ? interpolate(planeSpring, [0, 1], [1.14, 1], { extrapolateRight: "clamp" })
    : 1;

  // Impact ballon : REBONDIT (spring plus souple, leger overshoot)
  const ballVisible = frame >= BALL_IMPACT;
  const ballSpring = spring({
    frame: frame - BALL_IMPACT,
    fps,
    config: { damping: 10, stiffness: 260, mass: 0.7 },
  });
  const ballScale = ballVisible
    ? interpolate(ballSpring, [0, 1], [1.2, 1], { extrapolateRight: "clamp" })
    : 1;

  // Seconde impression (contact leger juste avant) : apparait telle quelle
  const secondImpressionVisible = frame >= TOUCH_LIGHT;

  // Tremblement du papier : sec pour l'avion, double pour le ballon
  const shakeY =
    shakeAt(frame, PLANE_IMPACT, 5) +
    shakeAt(frame, TOUCH_LIGHT, 1.8) +
    shakeAt(frame, BALL_IMPACT, 4.5);
  const shakeRot = shakeY * 0.045;

  // Pointilles : apparition discrete, dash par dash (rien ne se dessine)
  const dashes: React.ReactNode[] = [];
  for (let i = 0; i < N_DASH; i += 1) {
    const born = DASH_START + i * DASH_STEP;
    if (frame < born) {
      continue;
    }
    const slot = DASH_SLOTS[i];
    const p = slot.p;
    const ang = slot.ang;
    const pop = spring({
      frame: frame - born,
      fps,
      config: { damping: 16, stiffness: 400, mass: 0.4 },
    });
    const s = interpolate(pop, [0, 1], [1.3, 1], { extrapolateRight: "clamp" });
    dashes.push(
      <g key={`d${i}`} transform={`translate(${p.x} ${p.y}) rotate(${ang}) scale(${s})`}>
        <line x1={-10} y1={0} x2={10} y2={0} stroke={INK} strokeWidth={10} strokeLinecap="round" />
      </g>,
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <AbsoluteFill
        style={{
          transform: `translateY(${shakeY}px) rotate(${shakeRot}deg) scale(1.015)`,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1920 1080">
          <defs>
            {/* Grain du papier (froid, tres subtil) */}
            <filter id="fPaper" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="2" result="n" />
              <feColorMatrix
                in="n"
                type="matrix"
                values="0 0 0 0 0.35  0 0 0 0 0.36  0 0 0 0 0.37  1.4 1.4 1.4 0 -2.15"
              />
            </filter>
            {/* Encre tamponnee : bords irreguliers + trous fins + zones seches */}
            <filter id="fInk" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="2" seed="4" result="warp" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="warp"
                scale="7"
                xChannelSelector="R"
                yChannelSelector="G"
                result="rough"
              />
              <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="9" result="fine" />
              <feColorMatrix
                in="fine"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  4 4 4 0 -7"
                result="fineA"
              />
              <feComposite in="rough" in2="fineA" operator="out" result="cut1" />
              <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="17" result="coarse" />
              <feColorMatrix
                in="coarse"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.4 1.4 1.4 0 -2.1"
                result="coarseA"
              />
              <feComposite in="cut1" in2="coarseA" operator="out" />
            </filter>
            {/* Variante plus seche pour la seconde impression du ballon */}
            <filter id="fInkDry" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="2" seed="23" result="warp" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="warp"
                scale="6"
                xChannelSelector="R"
                yChannelSelector="G"
                result="rough"
              />
              <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="31" result="fine" />
              <feColorMatrix
                in="fine"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  4 4 4 0 -6.2"
                result="fineA"
              />
              <feComposite in="rough" in2="fineA" operator="out" result="cut1" />
              <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="37" result="coarse" />
              <feColorMatrix
                in="coarse"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.4 1.4 1.4 0 -1.8"
                result="coarseA"
              />
              <feComposite in="cut1" in2="coarseA" operator="out" />
            </filter>
            {/* Encre pour petits elements (pointilles, eclaboussures) */}
            <filter id="fInkSmall" x="-40%" y="-40%" width="180%" height="180%">
              <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="2" seed="6" result="warp" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="warp"
                scale="5"
                xChannelSelector="R"
                yChannelSelector="G"
                result="rough"
              />
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="13" result="fine" />
              <feColorMatrix
                in="fine"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 3 3 0 -5.6"
                result="fineA"
              />
              <feComposite in="rough" in2="fineA" operator="out" />
            </filter>
          </defs>

          {/* Grain papier */}
          <rect x={0} y={0} width={1920} height={1080} filter="url(#fPaper)" opacity={0.35} />

          {/* Tampon avion */}
          {planeVisible ? (
            <g
              transform={`translate(${PLANE_CX} ${PLANE_CY}) rotate(-10) scale(${planeScale})`}
              filter="url(#fInk)"
              opacity={0.97}
            >
              <Airplane />
            </g>
          ) : null}

          {/* Trajectoire pointillee */}
          <g filter="url(#fInkSmall)" opacity={0.9}>
            {dashes}
          </g>

          {/* Seconde impression du ballon : decalee, plus pale, plus seche */}
          {secondImpressionVisible ? (
            <g
              transform={`translate(${BALL_CX - 86} ${BALL_CY - 116}) rotate(-9) scale(0.97)`}
              filter="url(#fInkDry)"
              opacity={0.26}
            >
              <SoccerBall />
            </g>
          ) : null}

          {/* Tampon ballon : pose ferme */}
          {ballVisible ? (
            <g
              transform={`translate(${BALL_CX} ${BALL_CY}) scale(${ballScale})`}
              filter="url(#fInk)"
              opacity={0.97}
            >
              <SoccerBall />
            </g>
          ) : null}

          {/* Micro-eclaboussures a l'impact ferme */}
          {frame >= BALL_IMPACT + 1 ? (
            <g filter="url(#fInkSmall)">
              {SPLATTER.map((s, i) => (
                <circle key={`sp${i}`} cx={s.x} cy={s.y} r={s.r} fill={INK} opacity={s.o} />
              ))}
            </g>
          ) : null}
        </svg>
      </AbsoluteFill>

      {/* Cartouche discret */}
      <div
        style={{
          position: "absolute",
          right: 46,
          bottom: 34,
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
          fontSize: 22,
          letterSpacing: 1.2,
          color: INK,
          opacity: 0.32,
        }}
      >
        Concept study — Aziz Traore
      </div>
    </AbsoluteFill>
  );
};
