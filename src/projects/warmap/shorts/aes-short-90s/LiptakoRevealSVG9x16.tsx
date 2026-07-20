// LiptakoRevealSVG9x16 — adaptation portrait (1080x1920) de LiptakoRevealSVG (16:9, warmap/parties/).
// Meme choregraphie temporelle (spring/draw/timings identiques), layout spatial RECOMPOSE en triangle
// VERTICAL (Mali haut-gauche / Niger haut-droite / Burkina milieu-bas) au lieu du triangle horizontal
// large d'origine (Mali/Niger a gauche-droite du sceau, Burkina en bas) — necessaire car le viewBox
// 1920x1080 d'origine, letterboxe en 9:16, laisserait de grandes bandes vides. Sceau recentre plus bas
// dans le cadre pour laisser la place aux 3 emblemes au-dessus.
// Prototype Short "L'AES en 90 secondes" — memory/episodes/warmap-sahel/SCRIPT-SHORT-90S-V1.txt.
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, Audio, Sequence } from "remotion";

const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const draw = (f: number, start: number, dur: number, dash = 700): React.CSSProperties => ({
  strokeDasharray: dash,
  strokeDashoffset: dash * clampI(f, start, start + dur, 1, 0),
});

type Props = { frame: number; inAt: number; outAt: number; width: number; height: number; fps: number };

// Cadre interne fixe 1080x1920 (portrait) — le composant scale nativement via viewBox, `width`/`height`
// props restent pour la signature commune avec la version 16:9 mais ne pilotent QUE le <AbsoluteFill>.
const VB_W = 1080;
const VB_H = 1920;
// Sceau dessine a SEAL_DRAW_Y (rayon externe ~240) — garder un ecart net avec le label Burkina au-dessus
// (le label deborde a labelY_local=160+36=196 * scale 0.85 = ~167px sous le centre de l'embleme).
const SEAL_X = 540;
const SEAL_Y = 1300;
const SEAL_DRAW_Y = SEAL_Y - 220; // = 1080
// Emblemes : triangle vertical (Mali haut-gauche, Niger haut-droite, Burkina milieu-bas resserre).
// Chaque embleme scale 0.85 -> rayon visuel ~136px, label deborde jusqu'a ~+167px sous son centre.
// Mali/Niger (y=340, bas~476) / Burkina (y=610, bas label~777) / sceau (haut~840).
const MALI = { x: 260, y: 340 };
const NIGER = { x: 820, y: 340 };
const BURKINA = { x: 540, y: 610 };

export const LiptakoRevealSVG9x16: React.FC<Props> = ({ frame, inAt, outAt, fps }) => {
  const f = frame - inAt;
  if (frame < inAt - 2 || frame > outAt + 2) return null;

  // --- Bloc A : la clause orale se prononce (L0-276) ---
  const ornOp = clampI(f, 0, 14);
  const sealFadeOp = clampI(f, 0, 14);
  const sealTerne = clampI(f, 0, 14, 0.35, 0.55);

  const maliPop = spring({ frame: f - 2, fps, config: { damping: 11, stiffness: 140 }, durationInFrames: 12 });
  const nigerPop = spring({ frame: f - 20, fps, config: { damping: 11, stiffness: 140 }, durationInFrames: 12 });
  const burkinaPop = spring({ frame: f - 42, fps, config: { damping: 11, stiffness: 140 }, durationInFrames: 12 });
  const maliOp = f >= 2 ? maliPop : 0;
  const nigerOp = f >= 20 ? nigerPop : 0;
  const burkinaOp = f >= 42 ? burkinaPop : 0;

  const bondDraw = draw(f, 58, 20, 620);
  const bondsOp = clampI(f, 56, 66);

  const warFlashOp = interpolate(f, [217, 224, 231], [0, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const flagWaveAmp = 5;
  const flagWave = (i: number, phase: number) => Math.sin(f * 0.07 + i * 1.4 + phase) * flagWaveAmp;
  const maliFlagOp = spring({ frame: f - 90, fps, config: { damping: 13, stiffness: 90 }, durationInFrames: 20 });
  const nigerFlagOp = spring({ frame: f - 150, fps, config: { damping: 13, stiffness: 90 }, durationInFrames: 20 });
  const burkinaFlagOp = spring({ frame: f - 210, fps, config: { damping: 13, stiffness: 90 }, durationInFrames: 20 });
  const flagOps = [f >= 90 ? maliFlagOp : 0, f >= 150 ? nigerFlagOp : 0, f >= 210 ? burkinaFlagOp : 0];

  // --- Bloc B : la ratification formelle (L319-562) ---
  const sealVivid = clampI(f, 399, 437);
  const sealOpacityFinal = interpolate(f, [0, 14, 399, 437], [0, sealTerne, sealTerne, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const symbolDraw = draw(f, 423, 24, 300);
  const symbolOp = clampI(f, 421, 431);

  const impactSpring = spring({ frame: f - 462, fps, config: { damping: 10, stiffness: 160 }, durationInFrames: 14 });
  const impactY = f >= 462 ? (1 - impactSpring) * -10 : 0;

  const rimDraw = draw(f, 477, 16, 1400);
  const rimOp = clampI(f, 475, 485);

  // --- Bloc C : le nom naît (L563-682) ---
  const titleOp = clampI(f, 563, 580);
  const titleTextOp = clampI(f, 582, 619);
  const dateOp = clampI(f, 619, 637);

  const breathe = f >= 637 ? 1 + 0.012 * Math.sin((f - 637) / (2 * fps) * Math.PI * 2) : 1;
  const haloGlow = f >= 637 ? 0.15 + 0.08 * Math.sin((f - 637) / (2.4 * fps) * Math.PI * 2) : 0;

  void sealVivid;

  return (
    <AbsoluteFill>
      <Sequence from={inAt + 90} durationInFrames={20}>
        <Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.32} />
      </Sequence>
      <Sequence from={inAt + 150} durationInFrames={20}>
        <Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.32} />
      </Sequence>
      <Sequence from={inAt + 210} durationInFrames={20}>
        <Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.32} />
      </Sequence>
      <Sequence from={inAt + 462} durationInFrames={40}>
        <Audio src={staticFile("_shared/sfx/impact/impact.mp3")}
          volume={(fr) => clampI(fr, 0, 6, 0, 0.4) * clampI(fr, 20, 40, 1, 0)} />
      </Sequence>

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="lip9-seal-wax-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C82A1D" />
            <stop offset="70%" stopColor="#8A170E" />
            <stop offset="100%" stopColor="#4A0A05" />
          </radialGradient>
          <linearGradient id="lip9-gold-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8F6D35" />
            <stop offset="30%" stopColor="#CBA358" />
            <stop offset="70%" stopColor="#F1D58A" />
            <stop offset="100%" stopColor="#A37C3A" />
          </linearGradient>
          <linearGradient id="lip9-ribbon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F4EBD5" />
            <stop offset="50%" stopColor="#E3D0A8" />
            <stop offset="100%" stopColor="#C5AD7C" />
          </linearGradient>
          <pattern id="lip9-hatch-dense" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#2C1E16" strokeWidth="0.8" opacity="0.4" />
          </pattern>
          <pattern id="lip9-wax-hatch" width="6" height="6" patternTransform="rotate(30 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#310502" strokeWidth="1.5" opacity="0.5" />
          </pattern>
          <path id="lip9-shield-path" d="M -110 -130 L 110 -130 L 110 30 C 110 140, 0 190, 0 190 C 0 190, -110 140, -110 30 Z" />
          <path id="lip9-seal-text-path" d={`M ${SEAL_X - 170} ${SEAL_DRAW_Y} A 170 170 0 1 1 ${SEAL_X + 170} ${SEAL_DRAW_Y} A 170 170 0 1 1 ${SEAL_X - 170} ${SEAL_DRAW_Y}`} />
          {["mali", "niger", "burkina"].map((name, i) => {
            const pts = [
              [-80 + flagWave(i, 0), -100 + flagWave(i, 0.3) * 0.5],
              [80 + flagWave(i, 1), -100 + flagWave(i, 1.3) * 0.5],
              [80 + flagWave(i, 2), 18 + flagWave(i, 2.3) * 0.5],
              [0 + flagWave(i, 3), 140 + flagWave(i, 3.3) * 0.5],
              [-80 + flagWave(i, 4), 18 + flagWave(i, 4.3) * 0.5],
            ];
            const d = pts.map((p, j) => `${j === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z";
            return <clipPath key={name} id={`lip9-flag-clip-${name}`}><path d={d} /></clipPath>;
          })}
        </defs>

        <rect width={VB_W} height={VB_H} fill="#EBE0C8" />

        <g opacity={ornOp}>
          <g stroke="#A38D64" strokeWidth={1.5} opacity={0.4}>
            <line x1={VB_W / 2} y1={SEAL_Y} x2="60" y2="200" />
            <line x1={VB_W / 2} y1={SEAL_Y} x2={VB_W - 60} y2="200" />
            <line x1={VB_W / 2} y1={SEAL_Y} x2="60" y2={VB_H - 100} />
            <line x1={VB_W / 2} y1={SEAL_Y} x2={VB_W - 60} y2={VB_H - 100} />
            <line x1={VB_W / 2} y1={SEAL_Y} x2={VB_W / 2} y2="0" />
            <line x1={VB_W / 2} y1={SEAL_Y} x2={VB_W / 2} y2={VB_H} />
            <line x1={VB_W / 2} y1={SEAL_Y} x2="0" y2={SEAL_Y} />
            <line x1={VB_W / 2} y1={SEAL_Y} x2={VB_W} y2={SEAL_Y} />
          </g>
          <circle cx={VB_W / 2} cy={SEAL_Y} r="420" fill="none" stroke="#A38D64" strokeWidth={2} strokeDasharray="10 10" opacity={0.3} />
          <rect x="30" y="30" width={VB_W - 60} height={VB_H - 60} fill="none" stroke="#2C1E16" strokeWidth={6} />
          <rect x="40" y="40" width={VB_W - 80} height={VB_H - 80} fill="none" stroke="#2C1E16" strokeWidth={2} />
        </g>

        {/* 3 cordages Mali/Niger/Burkina -> sceau (recompose : les 3 convergent depuis le triangle vertical) */}
        <g opacity={bondsOp}>
          <g style={bondDraw}>
            <line x1={MALI.x} y1={MALI.y} x2={SEAL_X} y2={SEAL_DRAW_Y} stroke="#1A1008" strokeWidth={26} opacity={0.5} />
            <line x1={MALI.x} y1={MALI.y} x2={SEAL_X} y2={SEAL_DRAW_Y} stroke="url(#lip9-gold-grad)" strokeWidth={20} />
            <line x1={MALI.x} y1={MALI.y} x2={SEAL_X} y2={SEAL_DRAW_Y} stroke="url(#lip9-hatch-dense)" strokeWidth={20} />
          </g>
          <g style={bondDraw}>
            <line x1={NIGER.x} y1={NIGER.y} x2={SEAL_X} y2={SEAL_DRAW_Y} stroke="#1A1008" strokeWidth={26} opacity={0.5} />
            <line x1={NIGER.x} y1={NIGER.y} x2={SEAL_X} y2={SEAL_DRAW_Y} stroke="url(#lip9-gold-grad)" strokeWidth={20} />
            <line x1={NIGER.x} y1={NIGER.y} x2={SEAL_X} y2={SEAL_DRAW_Y} stroke="url(#lip9-hatch-dense)" strokeWidth={20} />
          </g>
          <g style={draw(f, 58, 20, 400)}>
            <line x1={BURKINA.x} y1={BURKINA.y} x2={SEAL_X} y2={SEAL_DRAW_Y} stroke="#1A1008" strokeWidth={26} opacity={0.5} />
            <line x1={BURKINA.x} y1={BURKINA.y} x2={SEAL_X} y2={SEAL_DRAW_Y} stroke="url(#lip9-gold-grad)" strokeWidth={20} />
            <line x1={BURKINA.x} y1={BURKINA.y} x2={SEAL_X} y2={SEAL_DRAW_Y} stroke="url(#lip9-hatch-dense)" strokeWidth={20} />
          </g>
        </g>

        {/* Emblèmes (points d'ancrage + drapeau réel ondulant) — triangle vertical */}
        {[
          { ...MALI, op: maliOp, label: "MALI", labelW: 140, flagCode: "ml", flagName: "mali", flagOp: flagOps[0] },
          { ...NIGER, op: nigerOp, label: "NIGER", labelW: 140, flagCode: "ne", flagName: "niger", flagOp: flagOps[1] },
          { ...BURKINA, op: burkinaOp, label: "BURKINA FASO", labelW: 220, flagCode: "bf", flagName: "burkina", flagOp: flagOps[2] },
        ].map((e, i) => (
          <g key={i} transform={`translate(${e.x}, ${e.y}) scale(0.85)`} opacity={e.op}>
            <circle cx="0" cy="0" r="160" fill="none" stroke="#A37C3A" strokeWidth={1} strokeDasharray="4 4" />
            <circle cx="0" cy="0" r="150" fill="none" stroke="#A37C3A" strokeWidth={4} strokeDasharray="1 12" />
            <use href="#lip9-shield-path" fill="url(#lip9-gold-grad)" stroke="#2C1E16" strokeWidth={12} strokeLinejoin="round" />
            <use href="#lip9-shield-path" fill="url(#lip9-hatch-dense)" />
            <use href="#lip9-shield-path" fill="none" stroke="#F1D58A" strokeWidth={4} />
            <path d="M -90 -110 L 90 -110 L 90 20 C 90 110, 0 160, 0 160 C 0 160, -90 110, -90 20 Z" fill="none" stroke="#2C1E16" strokeWidth={2} />
            <path d="M -80 -100 L 80 -100 L 80 18 C 80 95, 0 140, 0 140 C 0 140, -80 95, -80 18 Z" fill="#DCD6CC" stroke="#1A1008" strokeWidth={3} opacity={1 - e.flagOp} />
            <g opacity={e.flagOp} clipPath={`url(#lip9-flag-clip-${e.flagName})`}>
              <image href={staticFile(`_shared/flags/${e.flagCode}.png`)} x={-90} y={-110} width={180} height={260} preserveAspectRatio="xMidYMid slice" />
            </g>
            <path d="M -80 -100 L 80 -100 L 80 18 C 80 95, 0 140, 0 140 C 0 140, -80 95, -80 18 Z" fill="none" stroke="#1A1008" strokeWidth={3} opacity={e.flagOp} />
            <rect x={-e.labelW / 2} y="160" width={e.labelW} height="36" fill="#F4EBD5" stroke="#2C1E16" strokeWidth={2} rx={4} />
            <text x="0" y="184" fontFamily="Georgia, serif" fontSize={20} fontWeight="bold" fill="#2C1E16" textAnchor="middle" letterSpacing={6}>{e.label}</text>
          </g>
        ))}

        {/* Sceau central du pacte */}
        <g opacity={sealFadeOp} transform={`translate(${SEAL_X} ${SEAL_DRAW_Y}) scale(${breathe}) translate(${-SEAL_X} ${-(SEAL_DRAW_Y)})`}>
          <g opacity={sealOpacityFinal}>
            <circle cx={SEAL_X} cy={SEAL_DRAW_Y} r="185" fill="url(#lip9-seal-wax-grad)" stroke="#310502" strokeWidth={4} transform={`translate(0 ${impactY})`} />
          </g>

          <g opacity={rimOp} style={rimDraw}>
            <circle cx={SEAL_X} cy={SEAL_DRAW_Y} r="220" fill="none" stroke="#59110A" strokeWidth={16} />
            <circle cx={SEAL_X} cy={SEAL_DRAW_Y} r="208" fill="none" stroke="#8A170E" strokeWidth={8} />
          </g>
          <circle cx={SEAL_X} cy={SEAL_DRAW_Y} r="190" fill="none" stroke="#310502" strokeWidth={3} strokeDasharray="8 6" opacity={rimOp} />

          <g opacity={sealOpacityFinal}>
            <circle cx={SEAL_X} cy={SEAL_DRAW_Y} r="180" fill="#A22517" />
            <circle cx={SEAL_X} cy={SEAL_DRAW_Y} r="180" fill="url(#lip9-wax-hatch)" opacity={0.6} />
            <circle cx={SEAL_X} cy={SEAL_DRAW_Y} r="180" fill="none" stroke="#310502" strokeWidth={4} />
          </g>

          <g opacity={symbolOp} style={symbolDraw} transform={`translate(${SEAL_X}, ${SEAL_DRAW_Y})`} stroke="#310502" strokeWidth={6} fill="#6A140B">
            <path d="M 0 -120 L 20 -40 L 100 -30 L 30 10 L 60 90 L 0 40 L -60 90 L -30 10 L -100 -30 L -20 -40 Z" fill="#8A170E" stroke="#310502" strokeWidth={3} strokeLinejoin="round" />
            <circle cx="0" cy="-35" r="45" fill="none" stroke="#F1D58A" strokeWidth={12} />
            <circle cx="30" cy="20" r="45" fill="none" stroke="#F1D58A" strokeWidth={12} />
            <circle cx="-30" cy="20" r="45" fill="none" stroke="#F1D58A" strokeWidth={12} />
            <circle cx="0" cy="0" r="15" fill="#310502" />
          </g>

          <circle cx={SEAL_X} cy={SEAL_DRAW_Y} r="230" fill="none" stroke="#D4A352" strokeWidth={4} opacity={haloGlow} />

          <g opacity={warFlashOp}>
            <circle cx={SEAL_X} cy={SEAL_DRAW_Y} r="240" fill="#8B1C1C" opacity={0.25} />
          </g>

          <text opacity={symbolOp} fontFamily="Georgia, serif" fontSize={22} fontWeight="bold" fill="#4A0A05" letterSpacing={6}>
            <textPath href="#lip9-seal-text-path" startOffset="50%" textAnchor="middle">
              + CHARTE DU LIPTAKO-GOURMA + UNION SAHÉLIENNE +
            </textPath>
          </text>
        </g>

        {/* Cartouche titre */}
        <g opacity={titleOp}>
          <path d={`M ${VB_W * 0.12} 120 Q ${VB_W / 2} 60 ${VB_W * 0.88} 120 L ${VB_W * 0.86} 170 Q ${VB_W / 2} 110 ${VB_W * 0.14} 170 Z`} fill="url(#lip9-ribbon-grad)" stroke="#2C1E16" strokeWidth={4} strokeLinejoin="round" />
        </g>
        <text x={VB_W / 2} y="148" opacity={titleTextOp} fontFamily="Georgia, serif" fontSize={34} fontWeight="bold" fill="#1A1008" textAnchor="middle" letterSpacing={4}>
          L'ALLIANCE DES ÉTATS DU SAHEL
        </text>

        {/* Cartouche date */}
        <g opacity={dateOp} transform={`translate(${VB_W / 2}, ${SEAL_Y + 260})`}>
          <path d="M -250 -30 Q 0 -50 250 -30 L 230 30 Q 0 10 -250 30 Z" fill="url(#lip9-ribbon-grad)" stroke="#2C1E16" strokeWidth={4} />
          <text x="0" y="8" fontFamily="Georgia, serif" fontSize={26} fontWeight="bold" fill="#1A1008" textAnchor="middle" letterSpacing={8}>
            16 SEPTEMBRE 2023
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default LiptakoRevealSVG9x16;
