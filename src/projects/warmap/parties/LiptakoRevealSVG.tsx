// LiptakoRevealSVG — remplace l'encadré WarMapOverlayDynamic jugé "peu convaincant" en début de P3
// (retour Aziz 2026-07-01 pt.10, décision Session A 2026-07-04). Cible SVG générée via Gemini 3.1 Pro
// (out/_r-and-d/warmap-svg-inserts/liptako-gemini.svg, brief exigence+liberté sans image de référence —
// évite le mimétisme de composition, cf memory/doctrines/PRODUCTION-AGENTIQUE-SVG.md §GUIDER SANS BRIDER).
// Concept : miroir narratif du CFA (CfaRevealSVG = chaîne qui SE ROMPT / dépendance) — ici un PACTE qui
// SE SCELLE : 3 cordages (Mali/Niger/Burkina Faso) convergent vers un sceau de cire qui se frappe et
// s'intensifie en écarlate au moment où l'union est nommée ("scellent leur union").
import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, Audio, Sequence } from "remotion";

const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const draw = (f: number, start: number, dur: number, dash = 700): React.CSSProperties => ({
  strokeDasharray: dash,
  strokeDashoffset: dash * clampI(f, start, start + dur, 1, 0),
});

type Props = { frame: number; inAt: number; outAt: number; width: number; height: number; fps: number };

// LiptakoRevealSVG — pilotée par frame ABSOLU du moteur. `inAt` = frame du mot "Bamako" (F_BAMAKO),
// la chorégraphie interne reprend les offsets LOCAUX (L0=inAt), calés sur l'audio réel du segment.
export const LiptakoRevealSVG: React.FC<Props> = ({ frame, inAt, outAt, width, height, fps }) => {
  const f = frame - inAt;
  if (frame < inAt - 2 || frame > outAt + 2) return null;

  // --- Bloc A : la clause orale se prononce (L0-276) ---
  const ornOp = clampI(f, 0, 14);
  const sealFadeOp = clampI(f, 0, 14);
  const sealTerne = clampI(f, 0, 14, 0.35, 0.55); // cire terne avant d'être scellée

  const maliPop = spring({ frame: f - 2, fps, config: { damping: 11, stiffness: 140 }, durationInFrames: 12 });
  const nigerPop = spring({ frame: f - 20, fps, config: { damping: 11, stiffness: 140 }, durationInFrames: 12 });
  const burkinaPop = spring({ frame: f - 42, fps, config: { damping: 11, stiffness: 140 }, durationInFrames: 12 });
  const maliOp = f >= 2 ? maliPop : 0;
  const nigerOp = f >= 20 ? nigerPop : 0;
  const burkinaOp = f >= 42 ? burkinaPop : 0;

  // 3 cordages : tracé simultané ("une seule voix"), L58-78
  const bondDraw = draw(f, 58, 20, 620);
  const bondsOp = clampI(f, 56, 66);

  // sursaut rouge sang bref sur "guerre" (L217-231), diagnostic sémantique
  const warFlashOp = interpolate(f, [217, 224, 231], [0, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Drapeaux réels qui apparaissent en séquence (L90-260) : comble le creux entre le tracé des cordages
  // (fini ~L78) et le vibrato/flash "guerre" (L191+) — retour Aziz "long temps sans animation après 5s".
  // Ondulation continue (clip-path sinusoïdal déphasé, même technique que le drapeau touareg Ph5 de P3Rupture).
  const flagWaveAmp = 5;
  const flagWave = (i: number, phase: number) => Math.sin(f * 0.07 + i * 1.4 + phase) * flagWaveAmp;
  const maliFlagOp = spring({ frame: f - 90, fps, config: { damping: 13, stiffness: 90 }, durationInFrames: 20 });
  const nigerFlagOp = spring({ frame: f - 150, fps, config: { damping: 13, stiffness: 90 }, durationInFrames: 20 });
  const burkinaFlagOp = spring({ frame: f - 210, fps, config: { damping: 13, stiffness: 90 }, durationInFrames: 20 });
  const flagOps = [f >= 90 ? maliFlagOp : 0, f >= 150 ? nigerFlagOp : 0, f >= 210 ? burkinaFlagOp : 0];

  // --- Bloc B : la ratification formelle (L319-562) ---
  // colorisation payoff : la cire passe de terne à écarlate vif sur "scellent leur union" (L423-437)
  const sealVivid = clampI(f, 399, 437);
  const sealOpacityFinal = interpolate(f, [0, 14, 399, 437], [0, sealTerne, sealTerne, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // anneaux + étoile internes se tracent
  const symbolDraw = draw(f, 423, 24, 300);
  const symbolOp = clampI(f, 421, 431);

  // impact tomber-sec sur "en" (L462)
  const impactSpring = spring({ frame: f - 462, fps, config: { damping: 10, stiffness: 160 }, durationInFrames: 14 });
  const impactY = f >= 462 ? (1 - impactSpring) * -10 : 0;

  // rebord du sceau qui finit de se graver sur "Charte" (L477)
  const rimDraw = draw(f, 477, 16, 1400);
  const rimOp = clampI(f, 475, 485);

  // --- Bloc C : le nom naît (L563-682) ---
  const titleOp = clampI(f, 563, 580);
  const titleTextOp = clampI(f, 582, 619);
  const dateOp = clampI(f, 619, 637);

  // plateau final qui respire
  const breathe = f >= 637 ? 1 + 0.012 * Math.sin((f - 637) / (2 * fps) * Math.PI * 2) : 1;
  const haloGlow = f >= 637 ? 0.15 + 0.08 * Math.sin((f - 637) / (2.4 * fps) * Math.PI * 2) : 0;

  return (
    <AbsoluteFill>
      {/* SFX ding par drapeau — cause du bug 2026-07-04 identifiée : `startFrom` sur <Audio> trim le
          FICHIER SOURCE (equiv. trimBefore), il ne positionne PAS dans la timeline (c'est `from` sur
          <Sequence> ou <Audio> qui fait ça) — d'où "inaudible" (le ping de 300ms était quasi entièrement
          trimmé). Fix (2026-07-04, retour Aziz : remettre les SFX, scène importante) : <Sequence from=...>
          autour de chaque <Audio>, un ping par drapeau (L90/150/210) + impact sceau existant. */}
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

      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="lip-seal-wax-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C82A1D" />
            <stop offset="70%" stopColor="#8A170E" />
            <stop offset="100%" stopColor="#4A0A05" />
          </radialGradient>
          <linearGradient id="lip-gold-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8F6D35" />
            <stop offset="30%" stopColor="#CBA358" />
            <stop offset="70%" stopColor="#F1D58A" />
            <stop offset="100%" stopColor="#A37C3A" />
          </linearGradient>
          <linearGradient id="lip-ribbon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F4EBD5" />
            <stop offset="50%" stopColor="#E3D0A8" />
            <stop offset="100%" stopColor="#C5AD7C" />
          </linearGradient>
          <pattern id="lip-hatch-dense" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#2C1E16" strokeWidth="0.8" opacity="0.4" />
          </pattern>
          <pattern id="lip-wax-hatch" width="6" height="6" patternTransform="rotate(30 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#310502" strokeWidth="1.5" opacity="0.5" />
          </pattern>
          <path id="lip-shield-path" d="M -110 -130 L 110 -130 L 110 30 C 110 140, 0 190, 0 190 C 0 190, -110 140, -110 30 Z" />
          <path id="lip-seal-text-path" d="M 790 480 A 170 170 0 1 1 1130 480 A 170 170 0 1 1 790 480" />
          {/* clip-path drapeau ondulant : sommets déphasés (même technique que le drapeau touareg P3Rupture) */}
          {["mali", "niger", "burkina"].map((name, i) => {
            const pts = [
              [-80 + flagWave(i, 0), -100 + flagWave(i, 0.3) * 0.5],
              [80 + flagWave(i, 1), -100 + flagWave(i, 1.3) * 0.5],
              [80 + flagWave(i, 2), 18 + flagWave(i, 2.3) * 0.5],
              [0 + flagWave(i, 3), 140 + flagWave(i, 3.3) * 0.5],
              [-80 + flagWave(i, 4), 18 + flagWave(i, 4.3) * 0.5],
            ];
            const d = pts.map((p, j) => `${j === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z";
            return <clipPath key={name} id={`lip-flag-clip-${name}`}><path d={d} /></clipPath>;
          })}
        </defs>

        {/* Fond parchemin (repris du groupe "colors" de la cible SVG source) */}
        <rect width="1920" height="1080" fill="#EBE0C8" />

        {/* Ornements de cadre (lignes de rhumb + cadre gravé, discrets — sans les flourishes de coin) */}
        <g opacity={ornOp}>
          <g stroke="#A38D64" strokeWidth={1.5} opacity={0.4}>
            <line x1="960" y1="480" x2="100" y2="100" />
            <line x1="960" y1="480" x2="1820" y2="100" />
            <line x1="960" y1="480" x2="100" y2="1000" />
            <line x1="960" y1="480" x2="1820" y2="1000" />
            <line x1="960" y1="480" x2="960" y2="0" />
            <line x1="960" y1="480" x2="960" y2="1080" />
            <line x1="960" y1="480" x2="0" y2="480" />
            <line x1="960" y1="480" x2="1920" y2="480" />
          </g>
          <circle cx="960" cy="480" r="600" fill="none" stroke="#A38D64" strokeWidth={2} strokeDasharray="10 10" opacity={0.3} />
          <rect x="40" y="40" width="1840" height="1000" fill="none" stroke="#2C1E16" strokeWidth={6} />
          <rect x="50" y="50" width="1820" height="980" fill="none" stroke="#2C1E16" strokeWidth={2} />
        </g>

        {/* 3 cordages Mali/Niger/Burkina -> sceau */}
        <g opacity={bondsOp}>
          <g style={bondDraw}>
            <line x1="420" y1="480" x2="960" y2="480" stroke="#1A1008" strokeWidth={30} opacity={0.5} />
            <line x1="420" y1="480" x2="960" y2="480" stroke="url(#lip-gold-grad)" strokeWidth={24} />
            <line x1="420" y1="480" x2="960" y2="480" stroke="url(#lip-hatch-dense)" strokeWidth={24} />
            <line x1="420" y1="468" x2="960" y2="468" stroke="#2C1E16" strokeWidth={2} />
            <line x1="420" y1="492" x2="960" y2="492" stroke="#2C1E16" strokeWidth={2} />
          </g>
          <g style={bondDraw}>
            <line x1="1500" y1="480" x2="960" y2="480" stroke="#1A1008" strokeWidth={30} opacity={0.5} />
            <line x1="1500" y1="480" x2="960" y2="480" stroke="url(#lip-gold-grad)" strokeWidth={24} />
            <line x1="1500" y1="480" x2="960" y2="480" stroke="url(#lip-hatch-dense)" strokeWidth={24} />
            <line x1="1500" y1="468" x2="960" y2="468" stroke="#2C1E16" strokeWidth={2} />
            <line x1="1500" y1="492" x2="960" y2="492" stroke="#2C1E16" strokeWidth={2} />
          </g>
          <g style={draw(f, 58, 20, 400)}>
            <line x1="960" y1="850" x2="960" y2="480" stroke="#1A1008" strokeWidth={30} opacity={0.5} />
            <line x1="960" y1="850" x2="960" y2="480" stroke="url(#lip-gold-grad)" strokeWidth={24} />
            <line x1="960" y1="850" x2="960" y2="480" stroke="url(#lip-hatch-dense)" strokeWidth={24} />
            <line x1="948" y1="850" x2="948" y2="480" stroke="#2C1E16" strokeWidth={2} />
            <line x1="972" y1="850" x2="972" y2="480" stroke="#2C1E16" strokeWidth={2} />
          </g>
        </g>

        {/* Emblèmes (points d'ancrage + drapeau réel ondulant, apparition étalée L90-230) */}
        {[
          { tx: 420, ty: 480, op: maliOp, label: "MALI", labelW: 140, flagCode: "ml", flagName: "mali", flagOp: flagOps[0] },
          { tx: 1500, ty: 480, op: nigerOp, label: "NIGER", labelW: 140, flagCode: "ne", flagName: "niger", flagOp: flagOps[1] },
          { tx: 960, ty: 850, op: burkinaOp, label: "BURKINA FASO", labelW: 240, flagCode: "bf", flagName: "burkina", flagOp: flagOps[2] },
        ].map((e, i) => (
          <g key={i} transform={`translate(${e.tx}, ${e.ty})`} opacity={e.op}>
            <circle cx="0" cy="0" r="160" fill="none" stroke="#A37C3A" strokeWidth={1} strokeDasharray="4 4" />
            <circle cx="0" cy="0" r="150" fill="none" stroke="#A37C3A" strokeWidth={4} strokeDasharray="1 12" />
            <use href="#lip-shield-path" fill="url(#lip-gold-grad)" stroke="#2C1E16" strokeWidth={12} strokeLinejoin="round" />
            <use href="#lip-shield-path" fill="url(#lip-hatch-dense)" />
            <use href="#lip-shield-path" fill="none" stroke="#F1D58A" strokeWidth={4} />
            <path d="M -90 -110 L 90 -110 L 90 20 C 90 110, 0 160, 0 160 C 0 160, -90 110, -90 20 Z" fill="none" stroke="#2C1E16" strokeWidth={2} />
            {/* espace neutre visible avant l'arrivée du drapeau */}
            <path d="M -80 -100 L 80 -100 L 80 18 C 80 95, 0 140, 0 140 C 0 140, -80 95, -80 18 Z" fill="#DCD6CC" stroke="#1A1008" strokeWidth={3} opacity={1 - e.flagOp} />
            {/* drapeau réel, clippé, ondulant en continu */}
            <g opacity={e.flagOp} clipPath={`url(#lip-flag-clip-${e.flagName})`}>
              <image href={staticFile(`_shared/flags/${e.flagCode}.png`)} x={-90} y={-110} width={180} height={260} preserveAspectRatio="xMidYMid slice" />
            </g>
            <path d="M -80 -100 L 80 -100 L 80 18 C 80 95, 0 140, 0 140 C 0 140, -80 95, -80 18 Z" fill="none" stroke="#1A1008" strokeWidth={3} opacity={e.flagOp} />
            <rect x={-e.labelW / 2} y="160" width={e.labelW} height="36" fill="#F4EBD5" stroke="#2C1E16" strokeWidth={2} rx={4} />
            <text x="0" y="184" fontFamily="Georgia, serif" fontSize={20} fontWeight="bold" fill="#2C1E16" textAnchor="middle" letterSpacing={6}>{e.label}</text>
          </g>
        ))}

        {/* Sceau central du pacte */}
        <g opacity={sealFadeOp} transform={`translate(960 480) scale(${breathe}) translate(-960 -480)`}>
          <g opacity={sealOpacityFinal}>
            <path d="M 960 210 C 1040 190, 1120 230, 1160 280 C 1220 340, 1240 430, 1210 500 C 1250 550, 1210 650, 1150 680 C 1080 730, 1020 750, 960 740 C 880 750, 800 720, 750 660 C 680 610, 680 540, 710 480 C 670 410, 720 310, 780 270 C 840 220, 900 230, 960 210 Z"
              fill="url(#lip-seal-wax-grad)" stroke="#310502" strokeWidth={4} transform={`translate(0 ${impactY})`} />
            <circle cx="1230" cy="350" r="12" fill="url(#lip-seal-wax-grad)" stroke="#310502" strokeWidth={2} />
            <circle cx="710" cy="650" r="18" fill="url(#lip-seal-wax-grad)" stroke="#310502" strokeWidth={2} />
            <circle cx="850" cy="220" r="15" fill="url(#lip-seal-wax-grad)" stroke="#310502" strokeWidth={2} />
          </g>

          <g opacity={rimOp} style={rimDraw}>
            <circle cx="960" cy="480" r="220" fill="none" stroke="#59110A" strokeWidth={16} />
            <circle cx="960" cy="480" r="208" fill="none" stroke="#8A170E" strokeWidth={8} />
          </g>
          <circle cx="960" cy="480" r="190" fill="none" stroke="#310502" strokeWidth={3} strokeDasharray="8 6" opacity={rimOp} />

          <g opacity={sealOpacityFinal}>
            <circle cx="960" cy="480" r="180" fill="#A22517" />
            <circle cx="960" cy="480" r="180" fill="url(#lip-wax-hatch)" opacity={0.6} />
            <circle cx="960" cy="480" r="180" fill="none" stroke="#310502" strokeWidth={4} />
          </g>

          <g opacity={symbolOp} style={symbolDraw} transform="translate(960, 480)" stroke="#310502" strokeWidth={6} fill="#6A140B">
            <path d="M 0 -120 L 20 -40 L 100 -30 L 30 10 L 60 90 L 0 40 L -60 90 L -30 10 L -100 -30 L -20 -40 Z" fill="#8A170E" stroke="#310502" strokeWidth={3} strokeLinejoin="round" />
            <circle cx="0" cy="-35" r="45" fill="none" stroke="#F1D58A" strokeWidth={12} />
            <circle cx="30" cy="20" r="45" fill="none" stroke="#F1D58A" strokeWidth={12} />
            <circle cx="-30" cy="20" r="45" fill="none" stroke="#F1D58A" strokeWidth={12} />
            <circle cx="0" cy="0" r="15" fill="#310502" />
          </g>

          <circle cx="960" cy="480" r="230" fill="none" stroke="#D4A352" strokeWidth={4} opacity={haloGlow} />

          <g opacity={warFlashOp}>
            <circle cx="960" cy="480" r="240" fill="#8B1C1C" opacity={0.25} />
          </g>

          <text opacity={symbolOp} fontFamily="Georgia, serif" fontSize={22} fontWeight="bold" fill="#4A0A05" letterSpacing={6}>
            <textPath href="#lip-seal-text-path" startOffset="50%" textAnchor="middle">
              + CHARTE DU LIPTAKO-GOURMA + UNION SAHÉLIENNE +
            </textPath>
          </text>
        </g>

        {/* Cartouche titre */}
        <g opacity={titleOp}>
          <path d="M 350 120 Q 960 50 1570 120 L 1530 180 Q 960 110 390 180 Z" fill="url(#lip-ribbon-grad)" stroke="#2C1E16" strokeWidth={4} strokeLinejoin="round" />
          <path d="M 350 120 L 300 160 L 390 180 Z" fill="#A37C3A" stroke="#2C1E16" strokeWidth={3} strokeLinejoin="round" />
          <path d="M 1570 120 L 1620 160 L 1530 180 Z" fill="#A37C3A" stroke="#2C1E16" strokeWidth={3} strokeLinejoin="round" />
        </g>
        <text x="960" y="150" opacity={titleTextOp} fontFamily="Georgia, serif" fontSize={42} fontWeight="bold" fill="#1A1008" textAnchor="middle" letterSpacing={14}>
          L'ALLIANCE DES ÉTATS DU SAHEL
        </text>

        {/* Cartouche date */}
        <g opacity={dateOp} transform="translate(960, 750)">
          <path d="M -250 -30 Q 0 -50 250 -30 L 230 30 Q 0 10 -250 30 Z" fill="url(#lip-ribbon-grad)" stroke="#2C1E16" strokeWidth={4} />
          <path d="M -250 -30 L -300 -10 L -270 0 L -300 10 L -250 30 Z" fill="#A37C3A" stroke="#2C1E16" strokeWidth={3} strokeLinejoin="round" />
          <path d="M 250 -30 L 300 -10 L 270 0 L 300 10 L 250 30 Z" fill="#A37C3A" stroke="#2C1E16" strokeWidth={3} strokeLinejoin="round" />
          <text x="0" y="8" fontFamily="Georgia, serif" fontSize={26} fontWeight="bold" fill="#1A1008" textAnchor="middle" letterSpacing={8}>
            16 SEPTEMBRE 2023
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default LiptakoRevealSVG;
