// ResourcesRevealSVG9x16 — adaptation portrait (1080x1920) de ResourcesRevealSVG (16:9, warmap/parties/).
// Meme choregraphie temporelle (draw/opacites/timings identiques), layout spatial RECOMPOSE : le
// bouclier (objet-heros) reste centre en haut, les 3 veines (or/uranium/petrole) rayonnent maintenant
// VERS LE BAS en eventail resserre plutot qu'en large eventail horizontal (original s'etalait sur toute
// la largeur 1920px, incompatible avec un cadre etroit 1080px).
// Prototype Short "L'AES en 90 secondes" — memory/episodes/warmap-sahel/SCRIPT-SHORT-90S-V1.txt.
import React from "react";
import { AbsoluteFill, interpolate, staticFile, Audio, Sequence } from "remotion";

const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const draw = (f: number, start: number, dur: number, dash = 900): React.CSSProperties => ({
  strokeDasharray: dash,
  strokeDashoffset: dash * clampI(f, start, start + dur, 1, 0),
});

const FlowDots: React.FC<{ d: string; color: string; t: number; totalLen: number; count?: number }> = ({
  d, color, t, totalLen, count = 3,
}) => {
  const dotLen = totalLen * 0.06;
  const gap = totalLen / count;
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={5}
      strokeLinecap="round"
      opacity={0.75}
      style={{ strokeDasharray: `${dotLen} ${gap - dotLen}`, strokeDashoffset: -t * gap }}
    />
  );
};

type Props = { frame: number; inAt: number; outAt: number; width: number; height: number; fps: number };

const VB_W = 1080;
const VB_H = 1920;
const SHIELD_CX = 540;
const SHIELD_CY = 560;

export const ResourcesRevealSVG9x16: React.FC<Props> = ({ frame, inAt, outAt, fps }) => {
  const f = frame - inAt;
  if (frame < inAt - 2 || frame > outAt + 2) return null;

  const fulcrumOp = clampI(f, 0, 14);
  const shieldRimDraw = draw(f, 0, 30, 1400);
  const shieldRimOp = clampI(f, 0, 8);
  const shieldBodyDraw = draw(f, 14, 26, 1200);
  const shieldBodyOp = clampI(f, 12, 20);

  const orDraw = draw(f, 20, 20, 500);
  const orOp = clampI(f, 18, 28);
  const orCartoucheOp = clampI(f, 40, 55);
  const paysMaliBurkinaOp = clampI(f, 62, 82);

  const uraniumDraw = draw(f, 157, 14, 500);
  const uraniumOp = clampI(f, 155, 163);
  const petroleDraw = draw(f, 188, 14, 550);
  const petroleOp = clampI(f, 186, 194);
  const uraniumCartoucheOp = clampI(f, 200, 212);
  const petroleCartoucheOp = clampI(f, 204, 216);
  const paysNigerOp = clampI(f, 204, 216);

  const haloRampOp = clampI(f, 247, 305, 0, 0.22);
  const haloPicOp = clampI(f, 333, 363, 0, 0.48);
  const blazonGlow = clampI(f, 333, 363, 0, 0.35);

  const haloBreathe = f >= 363 ? 0.30 + 0.14 * Math.sin((f - 363) / (2.2 * fps) * Math.PI * 2) : 0;
  const haloOp = f < 247 ? 0 : f < 333 ? haloRampOp : f < 363 ? haloPicOp : haloBreathe;

  const beatOr = interpolate(f, [392, 400, 408], [1, 1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const beatUranium = interpolate(f, [400, 408, 416], [1, 1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const beatPetrole = interpolate(f, [408, 416, 424], [1, 1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const orFlowT = f >= 40 ? (f - 40) / 55 : 0;
  const orFlowOp = clampI(f, 40, 55);
  const uraniumFlowT = f >= 177 ? (f - 177) / 55 : 0;
  const uraniumFlowOp = clampI(f, 177, 192);
  const petroleFlowT = f >= 208 ? (f - 208) / 55 : 0;
  const petroleFlowOp = clampI(f, 208, 223);

  const localOut = outAt - inAt;
  const exitOp = clampI(f, localOut - 20, localOut, 1, 0.85);

  return (
    <AbsoluteFill style={{ opacity: exitOp }}>
      <Sequence from={inAt + 20} durationInFrames={45}>
        <Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={inAt + 157} durationInFrames={35}>
        <Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={inAt + 188} durationInFrames={40}>
        <Audio src={staticFile("_shared/sfx/impact/tension-pulse.mp3")} volume={0.5} />
      </Sequence>

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="res9-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eadbba" />
            <stop offset="100%" stopColor="#d2be97" />
          </linearGradient>
          <linearGradient id="res9-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9de79" />
            <stop offset="100%" stopColor="#c99f2e" />
          </linearGradient>
          <linearGradient id="res9-v1-gold-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A67C00" />
            <stop offset="50%" stopColor="#FFDF73" />
            <stop offset="100%" stopColor="#8B6914" />
          </linearGradient>
          <linearGradient id="res9-v1-uranium-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#2B4C33" />
            <stop offset="50%" stopColor="#87C177" />
            <stop offset="100%" stopColor="#D1FFB8" />
          </linearGradient>
          <linearGradient id="res9-v1-petrole-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#111111" />
            <stop offset="50%" stopColor="#3A2F25" />
            <stop offset="100%" stopColor="#080808" />
          </linearGradient>
          <linearGradient id="res9-shield-rim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dcb970" />
            <stop offset="50%" stopColor="#a28145" />
            <stop offset="100%" stopColor="#634a21" />
          </linearGradient>
          <linearGradient id="res9-shield-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4e463c" />
            <stop offset="100%" stopColor="#1f1a16" />
          </linearGradient>
          <pattern id="res9-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#110e0c" strokeWidth={1.5} opacity={0.4} />
          </pattern>
        </defs>

        <rect width={VB_W} height={VB_H} fill="url(#res9-bg-grad)" />
        <g opacity={0.6}>
          <circle cx={SHIELD_CX} cy={SHIELD_CY} r="350" fill="none" stroke="#c2ac83" strokeWidth={1} />
          <circle cx={SHIELD_CX} cy={SHIELD_CY} r="600" fill="none" stroke="#c2ac83" strokeWidth={1} />
          <line x1={SHIELD_CX} y1="0" x2={SHIELD_CX} y2={VB_H} stroke="#c2ac83" strokeWidth={1} opacity={0.83} />
          <line x1="0" y1={SHIELD_CY} x2={VB_W} y2={SHIELD_CY} stroke="#c2ac83" strokeWidth={1} opacity={0.83} />
        </g>
        <rect x="30" y="30" width={VB_W - 60} height={VB_H - 60} fill="none" stroke="#695941" strokeWidth={3} />
        <rect x="40" y="40" width={VB_W - 80} height={VB_H - 80} fill="none" stroke="#695941" strokeWidth={1} />

        {/* Veine OR (Mali+Burkina) — rayonne vers le bas-gauche */}
        <g opacity={orOp} style={{ ...orDraw, transform: `scale(${beatOr})`, transformOrigin: "300px 1400px" }}>
          <path d="M 160 1620 Q 230 1350, 380 1200 T 540 950 L 590 950 Q 420 1250, 240 1620 Z" fill="url(#res9-v1-gold-grad)" stroke="#4A3515" strokeWidth={3} />
          <path d="M 300 1620 Q 340 1380, 420 1250 T 570 950 L 610 950 Q 500 1300, 380 1620 Z" fill="url(#res9-v1-gold-grad)" stroke="#4A3515" strokeWidth={3} />
        </g>
        {orFlowOp > 0.01 && (
          <g opacity={orFlowOp}>
            <FlowDots d="M 200 1600 Q 260 1350, 400 1200 T 560 955" color="#FFF4C2" t={orFlowT} totalLen={520} />
          </g>
        )}

        {/* Veine URANIUM (Niger) — rayonne vers le bas-centre */}
        <g opacity={uraniumOp} style={{ ...uraniumDraw, transform: `scale(${beatUranium})`, transformOrigin: "540px 1450px" }}>
          <path d="M 620 1650 L 590 1480 L 540 1350 L 560 1180 L 520 1000 L 500 950 L 470 950 L 500 1050 L 480 1220 L 510 1380 L 470 1500 L 500 1650 Z" fill="url(#res9-v1-uranium-grad)" stroke="#1C2E1D" strokeWidth={3} />
        </g>
        {uraniumFlowOp > 0.01 && (
          <g opacity={uraniumFlowOp}>
            <FlowDots d="M 600 1600 L 555 1420 L 535 1250 L 510 1050 L 495 960" color="#E8FFDA" t={uraniumFlowT} totalLen={520} />
          </g>
        )}

        {/* Veine PETROLE (Niger) — rayonne vers le bas-droite */}
        <g opacity={petroleOp} style={{ ...petroleDraw, transform: `scale(${beatPetrole})`, transformOrigin: "780px 1400px" }}>
          <path d="M 900 1640 C 970 1480, 1020 1330, 850 1220 C 730 1150, 630 1150, 580 1000 L 570 950 C 700 1050, 800 1100, 880 1180 C 1000 1260, 940 1450, 900 1640 Z" fill="url(#res9-v1-petrole-grad)" stroke="#000000" strokeWidth={3} />
        </g>
        {petroleFlowOp > 0.01 && (
          <g opacity={petroleFlowOp}>
            <FlowDots d="M 880 1600 C 940 1470, 970 1350, 850 1230 C 750 1160, 660 1140, 585 1000" color="#8A7A6C" t={petroleFlowT} totalLen={560} />
          </g>
        )}

        {/* Fulcrum (lever/socle), recentre sous le bouclier */}
        <g opacity={fulcrumOp}>
          <path d={`M ${SHIELD_CX - 220} ${SHIELD_CY + 320} A 320 320 0 0 0 ${SHIELD_CX - 80} ${SHIELD_CY + 580}`} fill="none" stroke="#3b3227" strokeWidth={3} />
          <path d={`M ${SHIELD_CX + 220} ${SHIELD_CY + 320} A 320 320 0 0 1 ${SHIELD_CX + 80} ${SHIELD_CY + 580}`} fill="none" stroke="#3b3227" strokeWidth={3} />
          <path d={`M ${SHIELD_CX - 340} ${SHIELD_CY + 610} L ${SHIELD_CX + 340} ${SHIELD_CY + 610} L ${SHIELD_CX + 370} ${SHIELD_CY + 635} L ${SHIELD_CX + 340} ${SHIELD_CY + 660} L ${SHIELD_CX - 340} ${SHIELD_CY + 660} L ${SHIELD_CX - 370} ${SHIELD_CY + 635} Z`} fill="url(#res9-shield-rim)" stroke="#25211d" strokeWidth={4} />
        </g>

        {/* Bouclier — SE DESSINE au contour, recentre en haut du cadre */}
        <g opacity={shieldRimOp} style={shieldRimDraw}>
          <path d={`M ${SHIELD_CX} ${SHIELD_CY - 400} C ${SHIELD_CX + 90} ${SHIELD_CY - 400}, ${SHIELD_CX + 180} ${SHIELD_CY - 380}, ${SHIELD_CX + 220} ${SHIELD_CY - 330} C ${SHIELD_CX + 220} ${SHIELD_CY - 130}, ${SHIELD_CX + 120} ${SHIELD_CY - 40}, ${SHIELD_CX} ${SHIELD_CY} C ${SHIELD_CX - 120} ${SHIELD_CY - 40}, ${SHIELD_CX - 220} ${SHIELD_CY - 130}, ${SHIELD_CX - 220} ${SHIELD_CY - 330} C ${SHIELD_CX - 180} ${SHIELD_CY - 380}, ${SHIELD_CX - 90} ${SHIELD_CY - 400}, ${SHIELD_CX} ${SHIELD_CY - 400} Z`} fill="none" stroke="#dcb970" strokeWidth={5} />
        </g>
        <g opacity={shieldRimOp}>
          <path d={`M ${SHIELD_CX} ${SHIELD_CY - 400} C ${SHIELD_CX + 90} ${SHIELD_CY - 400}, ${SHIELD_CX + 180} ${SHIELD_CY - 380}, ${SHIELD_CX + 220} ${SHIELD_CY - 330} C ${SHIELD_CX + 220} ${SHIELD_CY - 130}, ${SHIELD_CX + 120} ${SHIELD_CY - 40}, ${SHIELD_CX} ${SHIELD_CY} C ${SHIELD_CX - 120} ${SHIELD_CY - 40}, ${SHIELD_CX - 220} ${SHIELD_CY - 130}, ${SHIELD_CX - 220} ${SHIELD_CY - 330} C ${SHIELD_CX - 180} ${SHIELD_CY - 380}, ${SHIELD_CX - 90} ${SHIELD_CY - 400}, ${SHIELD_CX} ${SHIELD_CY - 400} Z`} fill="url(#res9-shield-rim)" stroke="#25211d" strokeWidth={5} opacity={shieldBodyOp > 0.3 ? 1 : 0} />
        </g>
        <g opacity={shieldBodyOp} style={shieldBodyDraw}>
          <path d={`M ${SHIELD_CX} ${SHIELD_CY - 375} C ${SHIELD_CX + 75} ${SHIELD_CY - 375}, ${SHIELD_CX + 150} ${SHIELD_CY - 360}, ${SHIELD_CX + 190} ${SHIELD_CY - 315} C ${SHIELD_CX + 190} ${SHIELD_CY - 145}, ${SHIELD_CX + 100} ${SHIELD_CY - 65}, ${SHIELD_CX} ${SHIELD_CY - 30} C ${SHIELD_CX - 100} ${SHIELD_CY - 65}, ${SHIELD_CX - 190} ${SHIELD_CY - 145}, ${SHIELD_CX - 190} ${SHIELD_CY - 315} C ${SHIELD_CX - 150} ${SHIELD_CY - 360}, ${SHIELD_CX - 75} ${SHIELD_CY - 375}, ${SHIELD_CX} ${SHIELD_CY - 375} Z`} fill="none" stroke="#15120e" strokeWidth={3} />
        </g>
        <g opacity={shieldBodyOp}>
          <path d={`M ${SHIELD_CX} ${SHIELD_CY - 375} C ${SHIELD_CX + 75} ${SHIELD_CY - 375}, ${SHIELD_CX + 150} ${SHIELD_CY - 360}, ${SHIELD_CX + 190} ${SHIELD_CY - 315} C ${SHIELD_CX + 190} ${SHIELD_CY - 145}, ${SHIELD_CX + 100} ${SHIELD_CY - 65}, ${SHIELD_CX} ${SHIELD_CY - 30} C ${SHIELD_CX - 100} ${SHIELD_CY - 65}, ${SHIELD_CX - 190} ${SHIELD_CY - 145}, ${SHIELD_CX - 190} ${SHIELD_CY - 315} C ${SHIELD_CX - 150} ${SHIELD_CY - 360}, ${SHIELD_CX - 75} ${SHIELD_CY - 375}, ${SHIELD_CX} ${SHIELD_CY - 375} Z`} fill="url(#res9-shield-metal)" />
          <path d={`M ${SHIELD_CX} ${SHIELD_CY - 375} C ${SHIELD_CX + 75} ${SHIELD_CY - 375}, ${SHIELD_CX + 150} ${SHIELD_CY - 360}, ${SHIELD_CX + 190} ${SHIELD_CY - 315} C ${SHIELD_CX + 190} ${SHIELD_CY - 145}, ${SHIELD_CX + 100} ${SHIELD_CY - 65}, ${SHIELD_CX} ${SHIELD_CY - 30} C ${SHIELD_CX - 100} ${SHIELD_CY - 65}, ${SHIELD_CX - 190} ${SHIELD_CY - 145}, ${SHIELD_CX - 190} ${SHIELD_CY - 315} C ${SHIELD_CX - 150} ${SHIELD_CY - 360}, ${SHIELD_CX - 75} ${SHIELD_CY - 375}, ${SHIELD_CX} ${SHIELD_CY - 375} Z`} fill="url(#res9-hatch)" />
          <line x1={SHIELD_CX} y1={SHIELD_CY - 375} x2={SHIELD_CX} y2={SHIELD_CY - 30} stroke="#15120e" strokeWidth={4} />
        </g>

        <g opacity={shieldBodyOp}>
          <circle cx={SHIELD_CX} cy={SHIELD_CY - 210} r="250" fill="#E3B864" opacity={haloOp} />
          <g opacity={1 + blazonGlow * 0.15}>
            <circle cx={SHIELD_CX} cy={SHIELD_CY - 210} r="95" fill="#16130c" opacity={0.5} />
            <circle cx={SHIELD_CX} cy={SHIELD_CY - 210} r="88" fill="url(#res9-gold-grad)" stroke="#3A2A12" strokeWidth={4} />
            <circle cx={SHIELD_CX} cy={SHIELD_CY - 210} r="74" fill="none" stroke="#F4ECD8" strokeWidth={2.5} strokeDasharray="6 5" opacity={0.85} />
            <polygon points={`${SHIELD_CX},${SHIELD_CY - 260} ${SHIELD_CX + 10},${SHIELD_CY - 228} ${SHIELD_CX + 44},${SHIELD_CY - 228} ${SHIELD_CX + 17},${SHIELD_CY - 208} ${SHIELD_CX + 27},${SHIELD_CY - 176} ${SHIELD_CX},${SHIELD_CY - 196} ${SHIELD_CX - 27},${SHIELD_CY - 176} ${SHIELD_CX - 17},${SHIELD_CY - 208} ${SHIELD_CX - 44},${SHIELD_CY - 228} ${SHIELD_CX - 10},${SHIELD_CY - 228}`} fill="#F4ECD8" stroke="#F4ECD8" strokeWidth={1} />
            <text x={SHIELD_CX} y={SHIELD_CY - 150} textAnchor="middle" fontSize={18} fontWeight="800" fill="#3A2A12" fontFamily="Georgia, serif" letterSpacing={2}>A · E · S</text>
          </g>
        </g>

        {/* Cartouches ressources */}
        <g opacity={orCartoucheOp}>
          <rect x={SHIELD_CX - 340} y="1330" width="130" height="45" rx={5} fill="#ebd69f" stroke="#25211d" strokeWidth={3} />
          <text x={SHIELD_CX - 275} y="1359" fontFamily="serif" fontWeight="bold" fontSize={20} fill="#25211d" textAnchor="middle" letterSpacing={3}>OR</text>
        </g>
        <g opacity={uraniumCartoucheOp}>
          <rect x={SHIELD_CX - 85} y="1420" width="170" height="45" rx={5} fill="#aedda4" stroke="#25211d" strokeWidth={3} />
          <text x={SHIELD_CX} y="1449" fontFamily="serif" fontWeight="bold" fontSize={20} fill="#25211d" textAnchor="middle" letterSpacing={3}>URANIUM</text>
        </g>
        <g opacity={petroleCartoucheOp}>
          <rect x={SHIELD_CX + 210} y="1330" width="160" height="45" rx={5} fill="#322c26" stroke="#dcb970" strokeWidth={3} />
          <text x={SHIELD_CX + 290} y="1359" fontFamily="serif" fontWeight="bold" fontSize={20} fill="#fdfaf3" textAnchor="middle" letterSpacing={3}>PETROLE</text>
        </g>

        {/* Noms des pays */}
        <g>
          <text x={SHIELD_CX - 340} y="1730" opacity={paysMaliBurkinaOp} fontFamily="Georgia, serif" fontSize={19} fill="#5C4A36" fontWeight="bold" letterSpacing={3}>MALI</text>
          <text x={SHIELD_CX - 80} y="1780" opacity={paysMaliBurkinaOp} fontFamily="Georgia, serif" fontSize={19} fill="#5C4A36" fontWeight="bold" letterSpacing={3} textAnchor="middle">BURKINA FASO</text>
          <text x={SHIELD_CX + 340} y="1730" opacity={paysNigerOp} fontFamily="Georgia, serif" fontSize={19} fill="#5C4A36" fontWeight="bold" letterSpacing={3} textAnchor="end">NIGER</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default ResourcesRevealSVG9x16;
