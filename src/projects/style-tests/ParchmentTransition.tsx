import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from "remotion";

// Palette gravure
const PARCHMENT = "#f0e6c8";
const PARCHMENT_DARK = "#d4c4a0";
const INK = "#1a1008";
const INK_MID = "#3a2510";
const INK_LIGHT = "#7a5c38";
const SHADOW = "rgba(26,16,8,0.18)";

// ── Composant : trait qui se dessine progressivement ──────────────────────
// progress 0 = invisible, 1 = completement trace
interface DrawablePathProps {
  d: string;
  totalLength: number; // longueur approximative du path SVG
  progress: number;    // 0 -> 1
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

const DrawablePath: React.FC<DrawablePathProps> = ({
  d, totalLength, progress, stroke = INK, strokeWidth = 2, fill = "none",
}) => {
  const dashOffset = totalLength * (1 - progress);
  return (
    <path
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={totalLength}
      strokeDashoffset={dashOffset}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
};

// ── Defs partagees ──────────────────────────────────────────────────────────
const Defs: React.FC = () => (
  <defs>
    {/* Texture parchemin */}
    <filter id="pt-parchment-age">
      <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" seed="8" result="noise" />
      <feColorMatrix type="matrix"
        values="0 0 0 0 0.85  0 0 0 0 0.74  0 0 0 0 0.52  0 0 0 0.14 0"
        result="tint" />
      <feComposite in="tint" in2="SourceGraphic" operator="over" />
    </filter>
    {/* Ombre douce bord parchemin */}
    <filter id="pt-scroll-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="8" dy="10" stdDeviation="12" floodColor={INK} floodOpacity="0.35" />
    </filter>
    {/* Vignette bord */}
    <radialGradient id="pt-vignette" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stopColor="transparent" />
      <stop offset="100%" stopColor={INK} stopOpacity="0.08" />
    </radialGradient>
    {/* Hachures */}
    <pattern id="pt-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="6" stroke={INK} strokeWidth="0.7" opacity="0.35" />
    </pattern>
    {/* Clip parchemin */}
    <clipPath id="pt-scroll-clip">
      <rect id="pt-scroll-rect" x={0} y={0} width="1920" height="1080" />
    </clipPath>
  </defs>
);

// ── Scene : personnage esquisse progressivement ─────────────────────────────
// progress 0 = rien, 1 = complet
const SketchCharacter: React.FC<{ cx: number; cy: number; progress: number }> = ({
  cx, cy, progress,
}) => {
  // On decoupe en segments : corps, tete, bras G, bras D, jambe G, jambe D
  const seg = (min: number, max: number) =>
    interpolate(progress, [min, max], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const groundY = cy;
  const feetY = groundY;
  const legH = 90;
  const torsoH = 95;
  const headR = 42;

  const hipY = feetY - legH;
  const torsoTopY = hipY - torsoH;
  const neckY = torsoTopY - headR * 0.08;
  const headCY = neckY - headR * 0.5;
  const shoulderY = torsoTopY + 20;

  // Torse
  const torsoProgress = seg(0, 0.25);
  const torsoOff = torsoH * (1 - torsoProgress);

  // Tete
  const headProgress = seg(0.15, 0.4);
  const headR2 = headR * headProgress;

  // Bras
  const armL = seg(0.3, 0.55);
  const armR = seg(0.38, 0.6);

  // Jambes
  const legL = seg(0.5, 0.75);
  const legR = seg(0.58, 0.8);

  // Details visage
  const faceProgress = seg(0.65, 1.0);
  const noseProgress = seg(0.72, 1.0);
  const hairProgress = seg(0.8, 1.0);

  // Stroke width avec legere imprecision
  const jitter = (v: number) => v + (Math.random() * 0.4 - 0.2);

  return (
    <g>
      {/* Torse */}
      <rect
        x={cx - 35}
        y={torsoTopY + torsoOff}
        width={70}
        height={torsoH * torsoProgress}
        rx={12}
        fill="none"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Ceinture */}
      {torsoProgress > 0.8 && (
        <rect
          x={cx - 35}
          y={hipY - 12}
          width={70 * (torsoProgress - 0.8) / 0.2}
          height={12}
          rx={4}
          fill={INK}
          opacity={0.6}
        />
      )}

      {/* Tete */}
      <ellipse
        cx={cx}
        cy={headCY}
        rx={headR2}
        ry={headR2 * 1.1}
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Nez (profil) */}
      {noseProgress > 0 && (
        <path
          d={`M ${cx + headR * 0.1},${headCY - 2} Q ${cx + headR * 0.65 * noseProgress},${headCY + 10} ${cx + headR * 0.45 * noseProgress},${headCY + 22}`}
          fill="none"
          stroke={INK}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity={noseProgress}
        />
      )}

      {/* Oeil */}
      {faceProgress > 0.1 && (
        <ellipse
          cx={cx + headR * 0.28}
          cy={headCY + 2}
          rx={7 * faceProgress}
          ry={5 * faceProgress}
          fill="none"
          stroke={INK}
          strokeWidth="1.5"
        />
      )}
      {faceProgress > 0.5 && (
        <circle cx={cx + headR * 0.32} cy={headCY + 3} r={3 * faceProgress} fill={INK} />
      )}

      {/* Bouche */}
      {faceProgress > 0.3 && (
        <path
          d={`M ${cx + headR * 0.08},${headCY + 22} Q ${cx + headR * 0.3},${headCY + 30 * faceProgress} ${cx + headR * 0.52 * faceProgress},${headCY + 22}`}
          fill="none"
          stroke={INK}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={faceProgress}
        />
      )}

      {/* Cheveux */}
      {hairProgress > 0 && (
        <ellipse
          cx={cx}
          cy={headCY - headR * 0.5}
          rx={(headR + 4) * hairProgress}
          ry={headR * 0.65 * hairProgress}
          fill={INK}
          opacity={0.75 * hairProgress}
        />
      )}

      {/* Bras gauche */}
      <line
        x1={cx - 35}
        y1={shoulderY}
        x2={cx - 35 - 60 * armL}
        y2={shoulderY + 75 * armL}
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={armL}
      />

      {/* Bras droit */}
      <line
        x1={cx + 35}
        y1={shoulderY}
        x2={cx + 35 + 30 * armR}
        y2={shoulderY + 80 * armR}
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={armR}
      />

      {/* Jambe gauche */}
      <line
        x1={cx - 14}
        y1={hipY}
        x2={cx - 22}
        y2={hipY + legH * legL}
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity={legL}
      />
      {legL > 0.8 && (
        <line
          x1={cx - 22}
          y1={feetY}
          x2={cx - 44}
          y2={feetY}
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}

      {/* Jambe droite */}
      <line
        x1={cx + 14}
        y1={hipY}
        x2={cx + 22}
        y2={hipY + legH * legR}
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity={legR}
      />
      {legR > 0.8 && (
        <line
          x1={cx + 22}
          y1={feetY}
          x2={cx + 48}
          y2={feetY}
          stroke={INK}
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

// ── Scene principale ─────────────────────────────────────────────────────────
// Timeline (360 frames = 12s a 30fps) :
//   0-60   : fond noir, parchemin qui tombe/se deplie du haut
//  60-150  : parchemin ouvert, lignes de texte qui apparaissent
// 150-280  : le dessin de la scene s'esquisse progressivement
// 280-360  : scene complete, legere oscillation

export const ParchmentTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── Phase 1 : Parchemin qui se deplie ──
  // Le parchemin part du centre et s'etend vers haut et bas
  const scrollSpring = spring({ frame, fps, config: { damping: 18, stiffness: 80 }, durationInFrames: 55 });
  const scrollH = interpolate(scrollSpring, [0, 1], [0, height]);
  const scrollY = (height - scrollH) / 2;

  // Enroulement haut/bas (le parchemin "s'ouvre" comme un scroll)
  const curlProgress = interpolate(frame, [0, 50], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const curlH = interpolate(curlProgress, [0, 1], [60, 4]);

  // ── Phase 2 : Texte qui apparait ligne par ligne ──
  const textLines = [
    { text: "Anno Domini MCCCXLVII...", startFrame: 65, endFrame: 100 },
    { text: "In the village of Saint Pierre,", startFrame: 85, endFrame: 120 },
    { text: "before the plague reached the valley...", startFrame: 105, endFrame: 145 },
  ];

  // ── Phase 3 : Scene qui s'esquisse ──
  const sketchStart = 150;
  const sketchEnd = 290;
  const sketchProgress = interpolate(frame, [sketchStart, sketchEnd], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Sol qui apparait (ligne horizontale)
  const groundProgress = interpolate(frame, [150, 195], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const groundY = 780;

  // Batiment esquisse (DrawablePath pour les murs)
  const buildProgress = interpolate(frame, [190, 260], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Texte "Anno Domini" qui apparait lettre par lettre dans le haut
  const titleProgress = interpolate(frame, [280, 340], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const cx = width / 2;
  const cy = height / 2;

  return (
    <AbsoluteFill style={{ background: "#0a0804" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg">
        <Defs />

        {/* ── Fond noir permanent ── */}
        <rect width={width} height={height} fill="#0a0804" />

        {/* ── Parchemin qui se deplie ── */}
        <g filter="url(#pt-scroll-shadow)">
          {/* Corps du parchemin */}
          <rect
            x={60}
            y={scrollY}
            width={width - 120}
            height={scrollH}
            rx={6}
            fill={PARCHMENT}
          />
          {/* Texture age */}
          <rect
            x={60}
            y={scrollY}
            width={width - 120}
            height={scrollH}
            rx={6}
            fill={PARCHMENT}
            filter="url(#pt-parchment-age)"
          />

          {/* Bord superieur enroule */}
          {curlH > 0 && scrollH > 10 && (
            <ellipse
              cx={cx}
              cy={scrollY}
              rx={(width - 120) / 2}
              ry={curlH}
              fill={PARCHMENT_DARK}
              stroke={INK_LIGHT}
              strokeWidth="1.5"
            />
          )}
          {/* Bord inferieur enroule */}
          {curlH > 0 && scrollH > 10 && (
            <ellipse
              cx={cx}
              cy={scrollY + scrollH}
              rx={(width - 120) / 2}
              ry={curlH}
              fill={PARCHMENT_DARK}
              stroke={INK_LIGHT}
              strokeWidth="1.5"
            />
          )}

          {/* Lignes horizontales parchemin (comme une page reglees) */}
          {Array.from({ length: 20 }, (_, i) => {
            const lineY = scrollY + 80 + i * 48;
            if (lineY > scrollY + scrollH - 40) return null;
            return (
              <line key={i}
                x1={100} y1={lineY} x2={width - 100} y2={lineY}
                stroke={INK_LIGHT} strokeWidth="0.7" opacity="0.2"
              />
            );
          })}

          {/* Bords lateraux du parchemin (veinage) */}
          <rect
            x={60} y={scrollY} width={width - 120} height={scrollH}
            rx={6} fill="none" stroke={INK_LIGHT} strokeWidth="2"
          />
        </g>

        {/* ── Phase 2 : Texte qui s'ecrit ── */}
        {frame >= 60 && scrollH > 200 && textLines.map((line, i) => {
          const lineProgress = interpolate(frame, [line.startFrame, line.endFrame], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const visibleChars = Math.floor(lineProgress * line.text.length);
          const displayText = line.text.slice(0, visibleChars);
          return (
            <text
              key={i}
              x={cx}
              y={cy - 60 + i * 52}
              textAnchor="middle"
              fontSize={i === 0 ? 28 : 22}
              fontFamily="serif"
              fill={INK_MID}
              fontStyle={i === 0 ? "normal" : "italic"}
              opacity={lineProgress}
              letterSpacing={i === 0 ? "2" : "0"}
            >
              {displayText}
              {lineProgress < 1 && lineProgress > 0 && (
                <tspan fontSize="18" opacity="0.4">|</tspan>
              )}
            </text>
          );
        })}

        {/* ── Phase 3 : Esquisse de la scene ── */}
        {frame >= sketchStart && scrollH > 400 && (
          <>
            {/* Sol : ligne qui s'etire de gauche a droite */}
            <DrawablePath
              d={`M 80,${groundY} L ${width - 80},${groundY}`}
              totalLength={width - 160}
              progress={groundProgress}
              stroke={INK}
              strokeWidth="2.5"
            />

            {/* Herbe esquissee sous le sol */}
            {groundProgress > 0.4 && Array.from({ length: 28 }, (_, i) => {
              const gx = 100 + i * 65;
              const gProg = interpolate(groundProgress, [0.4 + i * 0.015, 0.4 + i * 0.015 + 0.12], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              });
              return (
                <g key={i}>
                  <line x1={gx} y1={groundY} x2={gx - 4} y2={groundY + 12 * gProg}
                    stroke={INK} strokeWidth="1.2" strokeLinecap="round" opacity={gProg * 0.6} />
                  <line x1={gx + 4} y1={groundY} x2={gx + 8} y2={groundY + 9 * gProg}
                    stroke={INK} strokeWidth="1.2" strokeLinecap="round" opacity={gProg * 0.5} />
                </g>
              );
            })}

            {/* Batiment gauche esquisse */}
            <DrawablePath
              d={`M 200,${groundY} L 200,${groundY - 220} L 350,${groundY - 220} L 350,${groundY}`}
              totalLength={880}
              progress={buildProgress}
              strokeWidth={2.2}
            />
            {/* Toit batiment gauche */}
            <DrawablePath
              d={`M 195,${groundY - 218} L 275,${groundY - 320} L 356,${groundY - 218}`}
              totalLength={360}
              progress={interpolate(buildProgress, [0.3, 1], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })}
              strokeWidth={2.2}
            />
            {/* Fenetre batiment gauche */}
            <DrawablePath
              d={`M 234,${groundY - 170} L 234,${groundY - 110} L 274,${groundY - 110} L 274,${groundY - 170} L 234,${groundY - 170}`}
              totalLength={240}
              progress={interpolate(buildProgress, [0.55, 1], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })}
              strokeWidth={1.6}
            />

            {/* Batiment central (eglise esquissee) */}
            <DrawablePath
              d={`M 760,${groundY} L 760,${groundY - 280} L 1000,${groundY - 280} L 1000,${groundY}`}
              totalLength={1040}
              progress={interpolate(buildProgress, [0.15, 0.85], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })}
              strokeWidth={2.5}
            />
            {/* Clocher */}
            <DrawablePath
              d={`M 840,${groundY - 278} L 840,${groundY - 400} L 920,${groundY - 400} L 920,${groundY - 278}`}
              totalLength={560}
              progress={interpolate(buildProgress, [0.45, 1], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })}
              strokeWidth={2}
            />
            {/* Fleche clocher */}
            <DrawablePath
              d={`M 880,${groundY - 450} L 840,${groundY - 400} M 880,${groundY - 450} L 920,${groundY - 400}`}
              totalLength={160}
              progress={interpolate(buildProgress, [0.7, 1], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })}
              strokeWidth={2}
            />

            {/* Batiment droite esquisse */}
            <DrawablePath
              d={`M 1350,${groundY} L 1350,${groundY - 200} L 1550,${groundY - 200} L 1550,${groundY}`}
              totalLength={800}
              progress={interpolate(buildProgress, [0.25, 0.9], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })}
              strokeWidth={2}
            />
            {/* Toit droite */}
            <DrawablePath
              d={`M 1345,${groundY - 198} L 1450,${groundY - 290} L 1556,${groundY - 198}`}
              totalLength={330}
              progress={interpolate(buildProgress, [0.5, 1], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })}
              strokeWidth={2}
            />

            {/* Arbre esquisse */}
            <DrawablePath
              d={`M 620,${groundY} L 620,${groundY - 180}`}
              totalLength={180}
              progress={interpolate(sketchProgress, [0.55, 0.75], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })}
              strokeWidth={2.5}
            />
            <DrawablePath
              d={`M 620,${groundY - 180} Q 560,${groundY - 260} 580,${groundY - 330} Q 620,${groundY - 390} 660,${groundY - 330} Q 680,${groundY - 260} 620,${groundY - 180}`}
              totalLength={480}
              progress={interpolate(sketchProgress, [0.68, 0.92], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })}
              strokeWidth={2}
            />

            {/* Personnage esquisse */}
            {sketchProgress > 0.4 && (
              <SketchCharacter
                cx={1180}
                cy={groundY}
                progress={interpolate(sketchProgress, [0.4, 1], [0, 1], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp",
                })}
              />
            )}

            {/* Soleil esquisse */}
            {sketchProgress > 0.75 && (
              <>
                <DrawablePath
                  d={`M 1700,160 m -38,0 a 38,38 0 1,0 76,0 a 38,38 0 1,0 -76,0`}
                  totalLength={240}
                  progress={interpolate(sketchProgress, [0.75, 0.95], [0, 1], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp",
                  })}
                  strokeWidth={2}
                />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                  const rad = (deg * Math.PI) / 180;
                  const rayProg = interpolate(sketchProgress, [0.82 + i * 0.015, 0.98], [0, 1], {
                    extrapolateLeft: "clamp", extrapolateRight: "clamp",
                  });
                  return (
                    <DrawablePath
                      key={deg}
                      d={`M ${1700 + Math.cos(rad) * 48},${160 + Math.sin(rad) * 48} L ${1700 + Math.cos(rad) * 70},${160 + Math.sin(rad) * 70}`}
                      totalLength={22}
                      progress={rayProg}
                      strokeWidth={1.8}
                    />
                  );
                })}
              </>
            )}

            {/* Titre final */}
            {titleProgress > 0 && (
              <text
                x={cx}
                y={100}
                textAnchor="middle"
                fontSize="32"
                fontFamily="serif"
                fill={INK}
                opacity={titleProgress}
                letterSpacing="5"
              >
                CIVITAS MEDIEVALIS · ANNO DOMINI MCCCXLVII
              </text>
            )}
          </>
        )}

        {/* Vignette bords */}
        <rect width={width} height={height} fill="url(#pt-vignette)" />
      </svg>
    </AbsoluteFill>
  );
};
