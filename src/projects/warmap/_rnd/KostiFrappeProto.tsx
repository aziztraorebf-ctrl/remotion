/**
 * KostiFrappeProto — PROTO MÉCANIQUE (jetable, _rnd) pour le beat 5 Acte 4 Soudan.
 *
 * Objectif : valider LE GESTE avant tout fignolage, pas l'esthétique finale.
 *   (a) drone RSF (sprite PNG top-down) qui suit une trajectoire + traînée = frappe lisible ?
 *   (b) jetons civils neutres qui s'ÉTEIGNENT un à un = le bon geste émotionnel (retenue clinique) ?
 *   (c) fond Kosti redessiné (Nil Blanc + station-service) qui tient dans le registre état-major ?
 *
 * Réutilise la GRAMMAIRE de KhartoumEtatMajorSVG (cadre/cartouche/grille + Impact + SmokeColumn +
 * mécanisme d'extinction buildingOpacityFor) SANS aucun signe militaire (pas de jeton "R", pas de
 * sceau de capture, pas de colonne/ligne de front) — le CONTRASTE avec Khartoum EST le sens :
 * "même type de frappe, mais aucune cible militaire, que des civils".
 *
 * Registre voulu (script v5) : "le fait est grave, PAS un spectacle" — montrer la CONSÉQUENCE
 * (jetons éteints + fumée) plutôt que l'explosion. Choc léger, jamais de camera shake violent.
 *
 * ⚠️ PROTO : pas de narration, timing arbitraire (~11s) juste pour juger le geste. Le calage audio
 * réel (forced alignment sur acte4-voisins-aspires-p4) viendra au beat final, pas ici.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, staticFile } from "remotion";

export const KOSTI_PROTO_FPS = 30;
export const KOSTI_PROTO_FRAMES = 330; // 11s @ 30fps

const RED = "#8a2a20";
const IVORY = "#f2ebd9";
const NILE = "#5b7a93"; // Nil Blanc, bleu-gris désaturé (registre parchemin, pas bleu vif)

const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ── Phases (frames) — timing proto arbitraire, ~11s ──
const ESTABLISH_END = 40; // cadre + terrain posés
const STATION_PULSE = 30; // la station pulse (≈ "À Kosti")
const CIVILS_APPEAR = 70; // les jetons civils entrent en file (≈ "des civils attendaient")
const DRONE_START = 150; // le drone entre par un bord (≈ "frappent avec un drone")
const IMPACT_AT = 210; // contact
const SMOKE_AT = IMPACT_AT + 12;
const EXTINCT_START = IMPACT_AT + 6; // les jetons s'éteignent un à un

// ── Position station-service (centre bas, sur la rive ouest du Nil) ──
const STATION = { x: 900, y: 620 };

// file de civils devant la station (rive ouest, alignés) — positions figées à la main
const CIVILS = [
  { x: markX(0), y: 600 },
  { x: markX(1), y: 632 },
  { x: markX(2), y: 606 },
  { x: markX(3), y: 640 },
  { x: markX(4), y: 616 },
];
function markX(i: number): number {
  return 720 + i * 46;
}

// drone : entre par le coin haut-droit, file vers la station (aile delta top-down, large sprite)
const DRONE_ORIGIN = { x: 1740, y: 180 };

// ── Sonar : anneau qui grandit et s'efface en boucle (repris grammaire Khartoum) ──
const Sonar: React.FC<{ cx: number; cy: number; frame: number; period: number; rMax: number }> = ({
  cx, cy, frame, period, rMax,
}) => {
  const t = ((frame % period) + period) % period / period;
  const r = 8 + t * rMax;
  const op = (1 - t) * 0.5;
  return <circle cx={cx} cy={cy} r={r} fill="none" stroke={RED} strokeWidth={2} opacity={op} />;
};

// ── Jeton CIVIL neutre : rond ivoire, portrait civil au centre (échelle humaine sans réalisme
// gore). S'éteint (opacité + désaturation) quand frappé. AUCUN signe de faction. ──
const CivilToken: React.FC<{ x: number; y: number; appearAt: number; extinctAt: number | null; frame: number; idx: number }> =
  ({ x, y, appearAt, extinctAt, frame, idx }) => {
    const appear = clampI(frame, appearAt, appearAt + 14);
    // légère respiration d'attente (ils patientent) — vie de fond avant la frappe
    const idle = Math.sin((frame + idx * 11) * 0.06) * 1.6;
    // extinction : opacité 1 -> 0.12 sur ~26f, décalée par jeton (un à un)
    const alive = extinctAt === null || frame < extinctAt
      ? 1
      : interpolate(frame, [extinctAt, extinctAt + 26], [1, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const clipId = `civilClip-${idx}`;
    return (
      <g transform={`translate(${x} ${y + idle})`} opacity={appear * alive}>
        <defs>
          <clipPath id={clipId}><circle cx={0} cy={0} r={17} /></clipPath>
        </defs>
        <circle cx={0} cy={0} r={17} fill={IVORY} stroke="#5c4d38" strokeWidth={2.4} filter="url(#kShadow)" />
        <g clipPath={`url(#${clipId})`}>
          <image href={staticFile("_shared/sprites/warmap/portrait-civil.png")}
            x={-20} y={-19} width={40} height={40} preserveAspectRatio="xMidYMid slice"
            style={{ filter: extinctAt !== null && frame >= extinctAt ? "grayscale(1)" : "none" }} />
        </g>
      </g>
    );
  };

// ── Drone RSF : sprite top-down qui suit une trajectoire Bézier + traînée fine derrière. ──
const quadPoint = (o: { x: number; y: number }, m: { x: number; y: number }, t2: { x: number; y: number }, t: number) => {
  const mt = 1 - t;
  return { x: mt * mt * o.x + 2 * mt * t * m.x + t * t * t2.x, y: mt * mt * o.y + 2 * mt * t * m.y + t * t * t2.y };
};

const DroneStrike: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - DRONE_START;
  if (local < 0) return null;
  const dur = IMPACT_AT - DRONE_START;
  const t = interpolate(local, [0, dur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad),
  });
  // Bézier légèrement bombée vers l'intérieur
  const mid = { x: (DRONE_ORIGIN.x + STATION.x) / 2 - 60, y: (DRONE_ORIGIN.y + STATION.y) / 2 };
  const pos = quadPoint(DRONE_ORIGIN, mid, STATION, t);
  const behind = quadPoint(DRONE_ORIGIN, mid, STATION, Math.max(0, t - 0.02));
  const heading = (Math.atan2(pos.y - behind.y, pos.x - behind.x) * 180) / Math.PI;
  // le drone disparaît à l'impact
  const droneOp = interpolate(local, [0, 8, dur - 4, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // traînée : path parcouru en dash
  const path = `M${DRONE_ORIGIN.x} ${DRONE_ORIGIN.y} Q ${mid.x} ${mid.y} ${STATION.x} ${STATION.y}`;
  const DASH = 2200;
  const off = (1 - t) * DASH;
  const DRONE_W = 88; // largeur écran du sprite (1408x768 -> ratio ~1.83)
  const DRONE_H = DRONE_W * (768 / 1408);
  return (
    <g>
      <path d={path} fill="none" stroke={RED} strokeWidth={2} strokeDasharray={`${DASH}`} strokeDashoffset={off}
        opacity={0.5} strokeLinecap="round" />
      <g transform={`translate(${pos.x} ${pos.y}) rotate(${heading})`} opacity={droneOp}>
        <image href={staticFile("_shared/sprites/warmap/drone-rsf-td.png")}
          x={-DRONE_W / 2} y={-DRONE_H / 2} width={DRONE_W} height={DRONE_H}
          preserveAspectRatio="xMidYMid meet" style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.5))" }} />
      </g>
    </g>
  );
};

// ── Impact : flash + 2 anneaux (ripple) — repris Khartoum, mais SANS camera shake violent. ──
const Impact: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - IMPACT_AT;
  if (t < 0) return null;
  const flashOp = interpolate(t, [0, 4, 20], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const r1 = interpolate(t, [0, 55], [10, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op1 = interpolate(t, [0, 10, 55], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const r2 = interpolate(t, [12, 70], [10, 145], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op2 = interpolate(t, [12, 24, 70], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g transform={`translate(${STATION.x} ${STATION.y})`}>
      <circle r={r1} fill="none" stroke={RED} strokeWidth={3.5} opacity={op1} />
      <circle r={r2} fill="none" stroke="#bf9442" strokeWidth={2} opacity={op2} />
      <circle r={20} fill={IVORY} opacity={flashOp} />
    </g>
  );
};

// ── Fumée : colonne de volutes + turbulence, monte après impact (repris Khartoum SmokeColumn). ──
const SmokeColumn: React.FC<{ frame: number }> = ({ frame }) => {
  const rel = frame - SMOKE_AT;
  if (rel < 0) return null;
  const appear = interpolate(rel, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seed = Math.floor(frame / 4) % 20;
  const puffs = [0, 22, 44].map((offset, i) => {
    const tt = (((rel + offset) % 66) + 66) % 66 / 66;
    const py = -tt * 62;
    const sc = 0.5 + tt * 1.05;
    const op = interpolate(tt, [0, 0.15, 0.75, 1], [0, 0.5, 0.32, 0], { extrapolateRight: "clamp" }) * appear;
    return { py, sc, op, i };
  });
  return (
    <g transform={`translate(${STATION.x} ${STATION.y - 6})`}>
      <defs>
        <filter id="kSmoke">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="10" />
        </filter>
      </defs>
      <g filter="url(#kSmoke)">
        {puffs.map((p) => (
          <g key={p.i} transform={`translate(0 ${p.py}) scale(${p.sc})`} opacity={p.op}>
            <ellipse cx={0} cy={0} rx={16} ry={18} fill="#6b5c42" />
            <ellipse cx={-6} cy={-5} rx={11} ry={13} fill="#5c4d38" />
            <ellipse cx={6} cy={-2} rx={9} ry={11} fill="#4a3f2e" />
          </g>
        ))}
      </g>
    </g>
  );
};

// ── Pictogramme station-service (auvent + 2 pompes) — simple, SVG, pas un bâtiment militaire ──
const StationPicto: React.FC<{ opacity: number }> = ({ opacity }) => (
  <g transform={`translate(${STATION.x} ${STATION.y})`} opacity={opacity} filter="url(#kShadow)">
    {/* dalle */}
    <rect x={-46} y={14} width={92} height={8} fill="#8a7c5e" stroke="#2b2117" strokeWidth={1} />
    {/* auvent */}
    <rect x={-40} y={-34} width={80} height={12} rx={2} fill="#9a8d73" stroke="#2b2117" strokeWidth={1.2} />
    {/* piliers */}
    <rect x={-36} y={-22} width={5} height={36} fill="#7a6d53" stroke="#2b2117" strokeWidth={0.8} />
    <rect x={31} y={-22} width={5} height={36} fill="#7a6d53" stroke="#2b2117" strokeWidth={0.8} />
    {/* 2 pompes */}
    <rect x={-14} y={-6} width={9} height={20} fill="#b8341f" stroke="#2b2117" strokeWidth={0.8} />
    <rect x={5} y={-6} width={9} height={20} fill="#b8341f" stroke="#2b2117" strokeWidth={0.8} />
  </g>
);

export const KostiFrappeProto: React.FC = () => {
  const frame = useCurrentFrame();
  const pFond = clampI(frame, 0, 25);
  const cartouche = clampI(frame, 0, 16);
  const stationOp = clampI(frame, ESTABLISH_END - 10, ESTABLISH_END + 8);

  // extinction décalée : chaque civil s'éteint ~7f après le précédent, à partir de EXTINCT_START
  const extinctFor = (i: number): number | null => {
    const start = EXTINCT_START + i * 7;
    return frame >= start ? start : null;
  };

  return (
    <AbsoluteFill style={{ background: "#0b1526" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="kGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#c7a977" strokeWidth={1} strokeDasharray="2 4" opacity={0.6} />
          </pattern>
          <filter id="kShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx={0} dy={5} stdDeviation={5} floodColor="#1a0b08" floodOpacity={0.5} />
          </filter>
        </defs>

        {/* ============ FOND KOSTI (redessiné — terrain + Nil Blanc) ============ */}
        <g opacity={pFond}>
          <rect width={1920} height={1080} fill="#d9c092" />
          <rect width={1920} height={1080} fill="url(#kGrid)" />

          {/* Nil Blanc : coule du sud (bas) vers le nord (haut), passe à l'est de la station.
              Kosti est sur la rive OUEST (station à gauche du fleuve). */}
          <g id="nile">
            <path d="M 1040 -20 C 1010 200, 1080 380, 1000 560 C 940 720, 1010 900, 980 1100 L 1080 1100 C 1110 900, 1040 720, 1100 560 C 1180 380, 1110 200, 1140 -20 Z"
              fill={NILE} stroke="#3f5668" strokeWidth={2} opacity={0.85} />
            <path d="M 1090 -20 C 1060 200, 1130 380, 1050 560 C 990 720, 1060 900, 1030 1100"
              fill="none" stroke="#c7a977" strokeWidth={1.5} strokeDasharray="12 12" opacity={0.5} />
          </g>
        </g>

        {/* station qui pulse (sonar) puis pictogramme */}
        {frame >= STATION_PULSE && frame < CIVILS_APPEAR + 40 && (
          <Sonar cx={STATION.x} cy={STATION.y} frame={frame} period={44} rMax={54} />
        )}
        <StationPicto opacity={stationOp} />

        {/* file de civils */}
        {CIVILS.map((c, i) => (
          <CivilToken key={i} x={c.x} y={c.y} appearAt={CIVILS_APPEAR + i * 8}
            extinctAt={extinctFor(i)} frame={frame} idx={i} />
        ))}

        {/* frappe */}
        <DroneStrike frame={frame} />
        <Impact frame={frame} />
        <SmokeColumn frame={frame} />

        {/* ============ CADRE + CARTOUCHE (grammaire état-major) ============ */}
        <g opacity={pFond}>
          <rect x={30} y={30} width={1860} height={1020} fill="none" stroke="#4a1f18" strokeWidth={6} />
          <rect x={42} y={42} width={1836} height={996} fill="none" stroke="#4a1f18" strokeWidth={1.5} />
          <path d="M 30 60 L 60 60 L 60 30" fill="none" stroke="#d9c092" strokeWidth={6} />
          <path d="M 1890 60 L 1860 60 L 1860 30" fill="none" stroke="#d9c092" strokeWidth={6} />
          <path d="M 30 1020 L 60 1020 L 60 1050" fill="none" stroke="#d9c092" strokeWidth={6} />
          <path d="M 1890 1020 L 1860 1020 L 1860 1050" fill="none" stroke="#d9c092" strokeWidth={6} />
        </g>
        <g opacity={cartouche}>
          <rect x={42} y={42} width={1836} height={56} fill="#4a1f18" opacity={0.08} />
          <line x1={42} y1={98} x2={1878} y2={98} stroke="#4a1f18" strokeWidth={1.5} opacity={0.5} />
          <text x={70} y={78} fill="#4a1f18" fontFamily="system-ui, -apple-system, sans-serif" fontSize={22} fontWeight={800} letterSpacing={4}>KOSTI — FRAPPE SUR UNE STATION-SERVICE</text>
          <text x={1850} y={78} textAnchor="end" fill="#4a1f18" fontFamily="Georgia, serif" fontSize={20} fontStyle="italic" letterSpacing={1.5}>21 JUIN 2026</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default KostiFrappeProto;
