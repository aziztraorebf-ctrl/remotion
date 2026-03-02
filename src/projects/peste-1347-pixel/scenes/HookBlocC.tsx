import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ============================================================
// HOOK BLOC C v11 — Beat visuel muet (6s, 180f @30fps)
// SANS voix-off — luth uniquement
//
// Phase 1 (0-80f)   : Galere arrive en mer, s'approche du quai (vitesse constante)
// Phase 2 (80-115f) : Galere freine et s'immobilise (spring fort, visible)
// Phase 3 (115-180f): Marins morts visibles (5 corps), gravure complete, fondu
//
// Effets :
//   S5 : torche + vignette nocturne — MODERE (scene lisible)
//   S6 : feColorMatrix UNIQUEMENT sur background (corps conservent vermillon)
//   S2 : grain overlay
// ============================================================

const TOTAL_FRAMES = 180;
const ARRIVE_START = 0;
const ARRIVE_END = 80;    // galere en mouvement lineaire
const STOP_FRAME = 115;   // galere immobilisee (spring plus long = freinage visible)
const BODIES_START = 118; // marins apparaissent juste apres arret
const FADE_START = 158;

const C = {
  parchment: "#F5E6C8",
  ink: "#1A1008",
  inkLight: "#3D2810",
  gold: "#C9A227",
  vermillon: "#C1392B",
  vermillonDark: "#8B1A10",
  skyNight: "#0D1535",
  skyDeep: "#080F22",
  seaNight: "#0C1A3A",
  hullDark: "#4A2008",
  sailWorn: "#C8B080",
  torchOrange: "#E8720C",
  torchYellow: "#F5C842",
  quayStone: "#8A7A60",
  quayShadow: "#4A3A28",
};

function lerpHex(a: string, b: string, t: number): string {
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

// ============================================================
// TORCHE
// ============================================================
function TorchFlame({ x, y, frame, phase = 0 }: { x: number; y: number; frame: number; phase?: number }) {
  const flicker = Math.sin(frame * 0.37 + phase) * 0.14 + Math.sin(frame * 0.71 + phase * 2) * 0.09;
  const fs = 1 + flicker;
  const fo = 0.9 + flicker * 0.1;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-4" y="0" width="8" height="28" rx="2" fill="#5C3A1A" />
      <ellipse cx="0" cy="-18" rx={15 * fs} ry={24 * fs} fill={C.torchOrange} opacity={fo * 0.85} />
      <ellipse cx="0" cy="-23" rx={7 * fs} ry={15 * fs} fill={C.torchYellow} opacity={fo} />
      {[0, 1, 2, 3].map((i) => {
        const t2 = ((frame * 1.2 + i * 22 + phase * 8) % 40) / 40;
        return (
          <circle key={i} cx={Math.sin(i * 2.1 + phase) * 11 * t2} cy={-36 - t2 * 30} r={1.8} fill={C.torchYellow} opacity={(1 - t2) * 0.8} />
        );
      })}
    </g>
  );
}

// ============================================================
// FUMEE GALERE
// ============================================================
function SmokePuff({ frame, phase, cx, cy }: { frame: number; phase: number; cx: number; cy: number }) {
  const t = (frame * 0.5 + phase * 40) % 90;
  const rise = -t * 0.85;
  const drift = Math.sin((frame + phase * 30) * 0.05) * 14;
  const fade = interpolate(t, [0, 12, 90], [0, 0.45, 0]);
  const r = interpolate(t, [0, 90], [5, 22]);
  return <ellipse cx={cx + drift} cy={cy + rise} rx={r * 1.3} ry={r} fill="#A08060" opacity={fade} />;
}

// ============================================================
// GALERE
// ============================================================
function Galere({ x, y, scale = 1, frame }: { x: number; y: number; scale?: number; frame: number }) {
  // Houle diminue quand la galere s'arrete
  const houleAmp = interpolate(frame, [ARRIVE_END, STOP_FRAME], [10, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const houle = Math.sin(frame * 0.07) * houleAmp;
  const sailTilt = Math.sin(frame * 0.04) * 2;

  return (
    <g transform={`translate(${x}, ${y + houle}) scale(${scale})`}>
      <path d="M -210 0 Q -240 58 -195 76 L 195 76 Q 240 58 210 0 Z" fill={C.hullDark} stroke="#2A0E02" strokeWidth={2.5 / scale} />
      <rect x="-198" y="-12" width="396" height="15" fill={C.hullDark} stroke="#2A0E02" strokeWidth={2 / scale} />
      {/* Planches */}
      {[10, 30, 52, 68].map((dy, i) => (
        <line key={i} x1="-194" y1={dy} x2="194" y2={dy} stroke="#2A0E02" strokeWidth={1} opacity={0.35} />
      ))}
      <line x1="0" y1="-12" x2="0" y2="-290" stroke="#2A0E02" strokeWidth={5 / scale} />
      <g transform={`rotate(${sailTilt}, 0, -168)`}>
        <path d="M 0 -270 Q 85 -196 70 -84 L -70 -84 Q -85 -196 0 -270 Z" fill={C.sailWorn} stroke="#4A2A08" strokeWidth={2 / scale} />
        <path d="M 30 -225 L 50 -196 L 28 -176" fill="none" stroke="#2A0E02" strokeWidth={2.5 / scale} strokeLinecap="round" />
        <line x1="0" y1="-260" x2="0" y2="-95" stroke="#4A2A08" strokeWidth={2 / scale} />
        <line x1="-58" y1="-200" x2="58" y2="-200" stroke="#4A2A08" strokeWidth={2 / scale} />
        <line x1="-62" y1="-145" x2="62" y2="-145" stroke="#4A2A08" strokeWidth={1.5 / scale} />
      </g>
      <line x1="0" y1="-252" x2="-152" y2="-152" stroke="#4A2A08" strokeWidth={3.5 / scale} />
      <path d="M -152 -152 Q -108 -172 0 -252 Q -48 -152 -126 -122 Z" fill={C.sailWorn} stroke="#4A2A08" strokeWidth={1.5 / scale} opacity={0.85} />
      {([-128, -44, 44, 128] as number[]).map((rx, i) => (
        <g key={i}>
          <line x1={rx} y1="56" x2={rx - 24} y2="112" stroke="#6B4B2A" strokeWidth={4 / scale} />
          <line x1={rx} y1="56" x2={rx + 24} y2="112" stroke="#6B4B2A" strokeWidth={4 / scale} />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <SmokePuff key={i} frame={frame} phase={i * 1.4} cx={0} cy={-284} />
      ))}
    </g>
  );
}

// ============================================================
// QUAI
// ============================================================
function Quai() {
  return (
    <g>
      <path d="M 0 790 Q 480 772 960 780 Q 1440 772 1920 790 L 1920 1080 L 0 1080 Z" fill={C.quayStone} />
      {[160, 320, 480, 640, 800, 960, 1120, 1280, 1440, 1600, 1760].map((x, i) => (
        <line key={i} x1={x} y1="780" x2={x} y2="1080" stroke={C.quayShadow} strokeWidth={2} opacity={0.4} />
      ))}
      {[812, 842, 874, 906].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="1920" y2={y} stroke={C.quayShadow} strokeWidth={1.5} opacity={0.28} />
      ))}
      <path d="M 0 790 Q 480 772 960 780 Q 1440 772 1920 790" fill="none" stroke={C.quayShadow} strokeWidth={4} opacity={0.7} />
      {[200, 620, 960, 1300, 1720].map((x, i) => (
        <g key={i}>
          <rect x={x - 9} y="752" width="18" height="46" rx="3" fill="#5A4A30" stroke={C.quayShadow} strokeWidth={1.5} />
          <ellipse cx={x} cy="750" rx="11" ry="7" fill="#6A5A40" stroke={C.quayShadow} strokeWidth={1} />
        </g>
      ))}
    </g>
  );
}

// ============================================================
// MARIN MOURANT — corps allonge, silhouette lisible
// Accents vermillon pour visibilite (tunica, blessure)
// ============================================================
function MarinMourant({ x, y = 787, flip = false, frame, delay = 0 }: {
  x: number; y?: number; flip?: boolean; frame: number; delay?: number;
}) {
  const localFrame = frame - delay;
  if (localFrame < 0) return null;

  const sc = spring({ frame: localFrame, fps: 30, config: { damping: 18, stiffness: 80 } });
  const opacity = interpolate(localFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sx = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${sx * sc}, ${sc})`} opacity={opacity}>
      {/* Corps horizontal */}
      <rect x="-42" y="-13" width="86" height="22" rx="11" fill={C.ink} opacity={0.9} />
      {/* Tunica — accent vermillon plein (visible hors gravure) */}
      <rect x="-30" y="-11" width="52" height="18" rx="7" fill={C.vermillon} opacity={0.88} />
      {/* Tete */}
      <circle cx="-56" cy="-5" r="17" fill={C.ink} opacity={0.9} />
      {/* Bras tombe */}
      <path d="M -18 9 Q -13 30 -9 46" fill="none" stroke={C.ink} strokeWidth={12} strokeLinecap="round" opacity={0.88} />
      {/* Jambes */}
      <path d="M 44 -5 Q 74 -2 102 1" fill="none" stroke={C.ink} strokeWidth={13} strokeLinecap="round" opacity={0.9} />
      <path d="M 44 8 Q 74 11 104 15" fill="none" stroke={C.ink} strokeWidth={12} strokeLinecap="round" opacity={0.85} />
      <ellipse cx="105" cy="1" rx="12" ry="7" fill={C.ink} opacity={0.82} />
      <ellipse cx="107" cy="15" rx="11" ry="6" fill={C.ink} opacity={0.82} />
    </g>
  );
}

// ============================================================
// ETOILES
// ============================================================
function Stars({ frame }: { frame: number }) {
  const stars = [
    { x: 95, y: 60, r: 1.5 }, { x: 255, y: 38, r: 1 }, { x: 415, y: 78, r: 1.5 },
    { x: 575, y: 28, r: 1 }, { x: 735, y: 58, r: 2 }, { x: 895, y: 35, r: 1 },
    { x: 1055, y: 72, r: 1.5 }, { x: 1175, y: 32, r: 1 }, { x: 1355, y: 62, r: 1.5 },
    { x: 1495, y: 42, r: 1 }, { x: 1655, y: 75, r: 2 }, { x: 1795, y: 28, r: 1 },
    { x: 175, y: 130, r: 1 }, { x: 535, y: 145, r: 1.5 }, { x: 855, y: 125, r: 1 },
    { x: 1085, y: 152, r: 1 }, { x: 1425, y: 128, r: 1.5 }, { x: 1735, y: 140, r: 1 },
  ];
  return (
    <g>
      {stars.map((s, i) => {
        const twinkle = Math.abs(Math.sin(frame * 0.05 + i * 0.8)) * 0.38 + 0.62;
        return <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#D8D0B8" opacity={twinkle} />;
      })}
    </g>
  );
}

// ============================================================
// GRAIN S2
// ============================================================
function GrainOverlay({ frame }: { frame: number }) {
  const seed = frame % 8;
  return (
    <svg width="1920" height="1080" style={{ position: "absolute", top: 0, left: 0, mixBlendMode: "overlay", opacity: 0.09, pointerEvents: "none" }}>
      <defs>
        <filter id={`gC_${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="3" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="1920" height="1080" filter={`url(#gC_${seed})`} />
    </svg>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export const HookBlocC: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  void fps;

  // feColorMatrix : 0.5 (BlocB end) -> 0.0 (gravure complete)
  const saturation = interpolate(frame, [0, STOP_FRAME], [0.5, 0.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Galere X : vitesse constante (0->ARRIVE_END) puis spring freinage (ARRIVE_END->STOP_FRAME)
  // Phase 1 : interpolate lineaire = navigation normale en mer
  // Depart -50 = entre depuis hors-cadre gauche, arrive a 640
  const galereXLinear = interpolate(frame, [0, ARRIVE_END], [-50, 640], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Phase 2 : spring freinage depuis 640 vers 780 (amortissement visible, masse lourde)
  // damping:14 stiffness:35 = galere lourde qui amortit lentement, visible a l'oeil
  const brakingSpring = spring({ frame: Math.max(0, frame - ARRIVE_END), fps: 30, config: { damping: 14, stiffness: 35 } });
  const galereXBraking = interpolate(brakingSpring, [0, 1], [640, 780], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Combine : lineaire jusqu'a ARRIVE_END, puis spring apres
  const galereX = frame < ARRIVE_END ? galereXLinear : galereXBraking;

  // Scale galere : grandit en approchant (0.6 -> 0.88)
  const galereScale = interpolate(frame, [ARRIVE_START, STOP_FRAME], [0.60, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ciel s'assombrit doucement
  const progress = interpolate(frame, [0, TOTAL_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const skyColor = lerpHex(C.skyNight, C.skyDeep, progress * 0.5);

  // Bordure : or -> encre
  const borderColor = lerpHex(C.gold, C.inkLight, progress * 0.8);

  // Vignette : MODEREE (max 0.72 pour garder lisibilite)
  const vignetteOpacity = interpolate(frame, [0, FADE_START], [0.45, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fondu sortant vers BlocD
  const fadeOut = interpolate(frame, [FADE_START, TOTAL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const torchPositions = [200, 620, 960, 1300, 1720];

  return (
    <AbsoluteFill style={{ backgroundColor: skyColor, overflow: "hidden" }}>
      <Audio src={staticFile("audio/peste-pixel/hookbloca-luth.mp3")} startFrom={0} loop volume={0.05} />

      {/* Filtre feColorMatrix */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="gravureCv9" x="0%" y="0%" width="100%" height="100%">
            <feColorMatrix type="saturate" values={String(saturation)} />
          </filter>
        </defs>
      </svg>

      {/* BACKGROUND avec feColorMatrix (enluminure -> gravure) */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", filter: "url(#gravureCv9)" }}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ display: "block", position: "absolute", top: 0, left: 0 }}>
          <defs>
            {/* Vignette moderee */}
            <radialGradient id="vigC9" cx="50%" cy="52%" r="65%">
              <stop offset="0%" stopColor="#000000" stopOpacity={0} />
              <stop offset="48%" stopColor="#000000" stopOpacity={0.04} />
              <stop offset="100%" stopColor="#000000" stopOpacity={0.88} />
            </radialGradient>
            {/* Halos torches */}
            {torchPositions.map((tx) => {
              const pulse = Math.sin(frame * 0.31 + tx * 0.01) * 0.1 + 1;
              return (
                <radialGradient key={tx} id={`hC9_${tx}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={C.torchYellow} stopOpacity={0.35 * pulse} />
                  <stop offset="40%" stopColor={C.torchOrange} stopOpacity={0.18 * pulse} />
                  <stop offset="100%" stopColor={C.torchOrange} stopOpacity={0} />
                </radialGradient>
              );
            })}
          </defs>

          {/* Ciel */}
          <rect width="1920" height="1080" fill={skyColor} />
          <Stars frame={frame} />

          {/* Lune */}
          <g transform="translate(1700, 110)">
            <circle cx="0" cy="0" r="44" fill="#D4C848" opacity={0.9} />
            <circle cx="18" cy="-8" r="38" fill={skyColor} />
          </g>

          {/* Mer */}
          <rect x="0" y="575" width="1920" height="220" fill={C.seaNight} />
          <line x1="0" y1="575" x2="1920" y2="575" stroke="#1E3060" strokeWidth={2.5} opacity={0.8} />
          {/* Reflet lune */}
          <path d="M 1615 575 Q 1688 665 1648 790" fill="none" stroke="#C8C030" strokeWidth={4} opacity={0.16} />

          {/* Galere — entre et s'arrete (y=545 = repose sur la mer y=575 avec coque de ~70px) */}
          <Galere x={galereX} y={545} scale={galereScale} frame={frame} />

          {/* Halos torches */}
          {torchPositions.map((tx) => (
            <rect key={tx} x={tx - 200} y={660} width="400" height="320" fill={`url(#hC9_${tx})`} />
          ))}

          {/* Quai */}
          <Quai />

          {/* Torches */}
          {torchPositions.map((tx) => (
            <TorchFlame key={tx} x={tx} y={755} frame={frame} phase={tx * 0.01} />
          ))}

          {/* Vignette moderee */}
          <rect width="1920" height="1080" fill="url(#vigC9)" opacity={vignetteOpacity} />

          {/* Bordure */}
          <rect x="0" y="0" width="1920" height="1080" fill="none" stroke={borderColor} strokeWidth={8} opacity={0.8} />
        </svg>
      </div>

      {/* CORPS — HORS feColorMatrix : gardent le vermillon meme en gravure */}
      {/* Marins morts deposes sur le quai (positions fixes) */}
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
        <MarinMourant x={460}  y={789} frame={frame} delay={BODIES_START} />
        <MarinMourant x={620}  y={784} flip frame={frame} delay={BODIES_START + 7} />
        <MarinMourant x={780}  y={791} frame={frame} delay={BODIES_START + 14} />
        <MarinMourant x={940}  y={786} flip frame={frame} delay={BODIES_START + 21} />
        <MarinMourant x={1100} y={789} frame={frame} delay={BODIES_START + 28} />
      </svg>

      <GrainOverlay frame={frame} />

      {/* Fondu noir -> BlocD */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#000000", opacity: fadeOut, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
