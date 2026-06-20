// TealAssemblyEtat3.tsx — PREUVE FINALE v2 de la methode generation->Remotion.
// Reproduit le panneau "etat 3" du storyboard teal en ASSEMBLANT des assets GENERES (background,
// "70" or relief SUBTIL v3, picto Terre+phosphate) + elements REMOTION (count-up, barre, fleches).
// PLACEMENT = classes Tailwind EXACTES du breakdown GPT-5.5 v2 (left-[48%], w-[42%]...), AUCUNE
// improvisation de pixels. PAS de "%" geant (le breakdown a confirme son absence dans cette case).
// Doctrine : STORYBOARD-DATAVIZ.md. Lecon : [[feedback_juger-asset-cote-a-cote-storyboard]].

import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const GOLD = "#e7b35c";
const IVORY = "#f4f1ea";

const ease = (p: number) =>
  interpolate(p, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Timeline (frame 0 = debut)
const F_COUNT_S = 6;
const F_COUNT_E = 46;
const F_CROSS = 46;
const F_TERRE = 58;
const F_BAR = 80;
const F_SRC = 104;

export const TealAssemblyEtat3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // HYBRIDE 70 : count-up Remotion -> crossfade vers asset genere
  const count = Math.round(interpolate(frame, [F_COUNT_S, F_COUNT_E], [0, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const crossfade = ease(interpolate(frame, [F_CROSS, F_CROSS + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const numBounce = spring({ frame: frame - F_COUNT_E, fps, config: { damping: 9, stiffness: 200 }, durationInFrames: 18 });
  const numScale = 1 + interpolate(numBounce, [0, 0.5, 1], [0, 0.04, 0], { extrapolateRight: "clamp" });
  const numEntry = ease(interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // picto Terre + label (spring sobre, breakdown : stiffness 120 damping 18)
  const terreP = spring({ frame: frame - F_TERRE, fps, config: { damping: 18, stiffness: 120 }, durationInFrames: 16 });
  const terreOp = ease(terreP);
  const terreScale = interpolate(terreP, [0, 1], [0.96, 1]);

  // barre + ecrasement
  const barP = spring({ frame: frame - F_BAR, fps, config: { damping: 18, stiffness: 140 }, durationInFrames: 26 });
  const barOp = ease(barP);
  const crushP = ease(interpolate(frame, [F_BAR + 10, F_BAR + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const arrowShift = interpolate(crushP, [0, 1], [-14, 10]);

  const srcOp = ease(interpolate(frame, [F_SRC, F_SRC + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill>
      {/* BACKGROUND genere (plein cadre) */}
      <Img src={staticFile("_rnd/cobaye-teal/bg-teal.png")} className="absolute inset-0 w-full h-full" />

      {/* === TOUTES LES TAILLES/POSITIONS = diff GPT-5.5 (mesurees sur la cible), PAS devinees === */}

      {/* "70" : HYBRIDE — diff v4 : remonter un peu + agrandir (etait trop bas/petit). top 28%, w 44% */}
      <div
        className="absolute left-[27%] top-[28%] w-[44%] h-[58%]"
        style={{ transform: `scale(${numScale})`, transformOrigin: "center", opacity: numEntry }}
      >
        {/* count-up temporaire (s'efface au crossfade) */}
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-black whitespace-nowrap"
          style={{ fontSize: "46vh", fontFamily: "Bebas Neue, Impact, sans-serif", color: GOLD, letterSpacing: "-0.02em", opacity: 1 - crossfade }}
        >
          {count}
        </span>
        {/* asset genere "70" (relief subtil v3) */}
        <Img src={staticFile("_rnd/cobaye-teal/num70.png")} className="block w-full h-full" style={{ objectFit: "contain", opacity: crossfade }} />
      </div>

      {/* Picto Terre — diff v4 : un peu plus grand + descendre (etait trop haut/petit). w 15%, top 47% */}
      <Img
        src={staticFile("_rnd/cobaye-teal/terre-phosphate.png")}
        className="absolute left-[11%] top-[47%] -translate-y-1/2 w-[15%] h-auto"
        style={{ opacity: terreOp, transform: `translateY(-50%) scale(${terreScale})`, transformOrigin: "center" }}
      />
      {/* label RESERVES MONDIALES — diff GPT : left-[9.3%] top-[62.5%] w-[15.5%] text-[47px] leading-[0.86] */}
      <div
        className="absolute left-[9.3%] top-[62.5%] w-[15.5%] text-center font-black uppercase leading-[0.86]"
        style={{ fontSize: 47, color: "#f2c66c", fontFamily: "Bebas Neue, Impact, sans-serif", letterSpacing: "-0.02em", textShadow: "3px 4px 0 rgba(0,0,0,0.55)", opacity: terreOp }}
      >
        Réserves<br />Mondiales
      </div>

      {/* Barre + segment + fleches + cartouche + traits : REMOTION (SVG, coords = diff GPT en px 1920x1080) */}
      <svg viewBox="0 0 1920 1080" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="phos" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f7cf75" /><stop offset="50%" stopColor="#efb84e" /><stop offset="100%" stopColor="#dc9632" /></linearGradient>
          <linearGradient id="seg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c66b32" /><stop offset="100%" stopColor="#8e3f20" /></linearGradient>
        </defs>

        {/* trait de liaison picto->70 — diff GPT : left-[21%] top-[50.2%] w-[11%] (etait ABSENT) */}
        <rect x={1920 * 0.21} y={1080 * 0.502} width={1920 * 0.11} height={4} fill="#d6c990" opacity={terreOp} />

        {(() => {
          // diff v4 : tout le groupe phosphate est ~3% trop a DROITE -> offset -3% (= -57.6px).
          const DX = -1920 * 0.03;
          // BARRE — partie jaune left-[75.55%] top-[23.5%] w-[10.3%] h-[38.5%]
          const barX = 1920 * 0.7555 + DX;
          const barW = 1920 * 0.103;
          const phosTop = 1080 * 0.235;
          const phosH = 1080 * 0.385;
          // segment 30% — top-[61.9%] h-[15.2%]
          const segTop0 = 1080 * 0.619;
          const segMaxH = 1080 * 0.152;
          const segH = segMaxH * interpolate(crushP, [0, 1], [1.0, 0.85]);
          const segTop = segTop0 + (segMaxH - segH);
          const cartX = 1920 * 0.706 + DX;
          return (
            <g opacity={barOp}>
              {/* cartouche PHOSPHATE — left-[70.6%] top-[12.1%] w-[18.8%] h-[8.8%] */}
              <rect x={cartX} y={1080 * 0.121} width={1920 * 0.188} height={1080 * 0.088} rx={4} fill="#12313a" fillOpacity={0.45} stroke="#d5aa5d" strokeWidth={4} />
              <text x={cartX + 1920 * 0.094} y={1080 * 0.121 + 1080 * 0.058} fill="#eec36c" fontFamily="Bebas Neue, Impact, sans-serif" fontSize={43} fontWeight={900} textAnchor="middle" letterSpacing={1}>PHOSPHATE</text>

              {/* zone 70% phosphate (jaune) */}
              <rect x={barX} y={phosTop} width={barW} height={phosH} fill="url(#phos)" rx={3} />
              {/* segment 30% (brun) qui s'ecrase */}
              <rect x={barX} y={segTop} width={barW} height={segH} fill="url(#seg)" rx={3} />
              {/* texte 30% */}
              <text x={barX + barW / 2} y={segTop0 + segMaxH / 2 + 22} fill="#ffe9d5" fontFamily="Bebas Neue, Impact, sans-serif" fontSize={62} fontWeight={900} textAnchor="middle" style={{ filter: "drop-shadow(2px 3px 0 rgba(0,0,0,0.35))" }}>30%</text>

              {/* fleches d'ecrasement — x=71.8% et 87.4% (+ offset), top-[31%] h-[34%] */}
              {[1920 * 0.718 + DX, 1920 * 0.874 + DX].map((ax, i) => (
                <g key={i} opacity={crushP} transform={`translate(${ax} ${1080 * 0.31 + arrowShift})`}>
                  <line x1={0} y1={0} x2={0} y2={1080 * 0.30} stroke="#d0a85b" strokeWidth={5} />
                  <path d={`M -11 ${1080 * 0.30 - 14} L 0 ${1080 * 0.30 + 4} L 11 ${1080 * 0.30 - 14}`} fill="none" stroke="#d0a85b" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              ))}

              {/* ligne base — left-[71.85%] top-[77.1%] w-[17.7%] */}
              <rect x={1920 * 0.7185 + DX} y={1080 * 0.771} width={1920 * 0.177} height={4} fill="#d6c990" opacity={0.85} />
              {/* RESTE DU MONDE — left centre 80.7% (+ offset) top-[79.8%] text-[42px] */}
              <text x={1920 * 0.807 + DX} y={1080 * 0.84} fill="#f2c66c" fontFamily="Bebas Neue, Impact, sans-serif" fontSize={42} fontWeight={900} textAnchor="middle" letterSpacing={-0.5} style={{ filter: "drop-shadow(3px 4px 0 rgba(0,0,0,0.55))" }}>
                <tspan x={1920 * 0.807 + DX} dy={0}>RESTE</tspan><tspan x={1920 * 0.807 + DX} dy={40}>DU MONDE</tspan>
              </text>
            </g>
          );
        })()}
      </svg>

      {/* source — diff GPT : left-[43.2%] top-[91.6%] w-[18.6%] text-[33px], casse 'Source : USGS 2024' */}
      <div
        className="absolute left-[43.2%] top-[91.6%] w-[18.6%] text-center"
        style={{ fontSize: 33, fontFamily: "'IBM Plex Mono', monospace", color: "#f0eee4", opacity: srcOp * 0.92, letterSpacing: "-0.02em" }}
      >
        Source : USGS 2024
      </div>
    </AbsoluteFill>
  );
};

export const TEAL_ASSEMBLY_FRAMES = 165;
