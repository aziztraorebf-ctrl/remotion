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

      {/* "70" : HYBRIDE — v7 : remonter (top 16%) + h 56% pour dominer comme la cible, w 40% */}
      <div
        className="absolute left-[26%] top-[16%] w-[40%] h-[56%]"
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

      {/* Picto Terre — v7 : agrandi (oeil Aziz prime sur mesure GPT biaisee par bandeau). w-16% centre y=44% */}
      <Img
        src={staticFile("_rnd/cobaye-teal/terre-phosphate.png")}
        className="absolute left-[6%] top-[33%] w-[16%] h-[22%]"
        style={{ opacity: terreOp, transform: `scale(${terreScale})`, transformOrigin: "center", objectFit: "contain" }}
      />
      {/* label RESERVES MONDIALES — v8 : regrossi au niveau cible. text-[52px] w-[18%] */}
      <div
        className="absolute left-[3.5%] top-[59%] w-[18%] text-center font-black uppercase leading-[0.88]"
        style={{ fontSize: 52, color: "#FFD16A", fontFamily: "Bebas Neue, Impact, sans-serif", letterSpacing: "-0.02em", textShadow: "0 3px 2px rgba(0,0,0,0.75)", opacity: terreOp }}
      >
        Réserves<br />Mondiales
      </div>

      {/* Barre + segment + fleches + cartouche + traits : REMOTION (SVG, coords = diff GPT en px 1920x1080) */}
      <svg viewBox="0 0 1920 1080" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="phos" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f7cf75" /><stop offset="50%" stopColor="#efb84e" /><stop offset="100%" stopColor="#dc9632" /></linearGradient>
          <linearGradient id="seg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c66b32" /><stop offset="100%" stopColor="#8e3f20" /></linearGradient>
        </defs>

        {/* trait de liaison picto->70 — diff v6 GPT : left-[21.5%] top-[49.7%] w-[11%] */}
        <rect x={1920 * 0.215} y={1080 * 0.497} width={1920 * 0.11} height={4} fill="#d3c58a" opacity={terreOp} />

        {(() => {
          // diff v6 GPT : positions absolues remesurees (plus de DX offset).
          // BARRE container — left-[73.6%] top-[24%] w-[10.3%] h-[51.5%], jaune h-71% / segment h-29% COLLES (gap-0)
          const barX = 1920 * 0.736;
          const barW = 1920 * 0.103;
          const contTop = 1080 * 0.24;
          const contH = 1080 * 0.515;
          const phosH = contH * 0.71;        // partie jaune (haut)
          const phosTop = contTop;
          const segFullH = contH * 0.29;      // segment 30% (bas), colle a la jaune
          const segFullTop = contTop + phosH; // = 60.5% du cadre
          // ecrasement : le segment se comprime legerement vers le bas (ancrage haut conserve la jonction)
          const segH = segFullH * interpolate(crushP, [0, 1], [1.0, 0.88]);
          const cartX = 1920 * 0.694;
          return (
            <g opacity={barOp}>
              {/* cartouche PHOSPHATE — left-[69.4%] top-[12.8%] w-[18.8%] h-[8.7%] */}
              <rect x={cartX} y={1080 * 0.128} width={1920 * 0.188} height={1080 * 0.087} rx={2} fill="#143D43" fillOpacity={0.7} stroke="#e7b762" strokeWidth={3} />
              <text x={cartX + 1920 * 0.094} y={1080 * 0.128 + 1080 * 0.058} fill="#f4c66e" fontFamily="Bebas Neue, Impact, sans-serif" fontSize={43} fontWeight={900} textAnchor="middle" letterSpacing={1}>PHOSPHATE</text>

              {/* zone 70% phosphate (jaune) */}
              <rect x={barX} y={phosTop} width={barW} height={phosH} fill="url(#phos)" />
              {/* segment 30% (brun) colle, qui s'ecrase legerement */}
              <rect x={barX} y={segFullTop} width={barW} height={segH} fill="url(#seg)" />
              {/* texte 30% — diff v6 : text-[62px], centre x=78% y=68% */}
              <text x={1920 * 0.788} y={1080 * 0.68 + 22} fill="#fff1d2" fontFamily="Bebas Neue, Impact, sans-serif" fontSize={62} fontWeight={900} textAnchor="middle" style={{ filter: "drop-shadow(0 3px 2px rgba(0,0,0,0.65))" }}>30%</text>

              {/* fleches d'ecrasement — diff v6 : h-[34%] (y 29.3%->63.3%), gauche x=71.7% droite x=85.8% */}
              {[1920 * 0.717, 1920 * 0.858].map((ax, i) => (
                <g key={i} opacity={crushP} transform={`translate(${ax} ${1080 * 0.293 + arrowShift})`}>
                  <line x1={0} y1={0} x2={0} y2={1080 * 0.34} stroke="#dda64e" strokeWidth={5} />
                  <path d={`M -11 ${1080 * 0.34 - 14} L 0 ${1080 * 0.34 + 4} L 11 ${1080 * 0.34 - 14}`} fill="none" stroke="#dda64e" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              ))}

              {/* ligne base — sous la barre */}
              <rect x={1920 * 0.7185} y={1080 * 0.771} width={1920 * 0.177} height={4} fill="#d6c990" opacity={0.85} />
              {/* RESTE DU MONDE — diff v6 : w-[13%] text-[36px], centre sous la barre */}
              <text x={1920 * 0.788} y={1080 * 0.84} fill="#f2c66c" fontFamily="Bebas Neue, Impact, sans-serif" fontSize={36} fontWeight={900} textAnchor="middle" letterSpacing={-0.5} style={{ filter: "drop-shadow(3px 4px 0 rgba(0,0,0,0.55))" }}>
                <tspan x={1920 * 0.788} dy={0}>RESTE</tspan><tspan x={1920 * 0.788} dy={36}>DU MONDE</tspan>
              </text>
            </g>
          );
        })()}
      </svg>

      {/* source — diff v6 GPT : top-[89.8%] text-[40px] */}
      <div
        className="absolute left-[38%] top-[90.5%] w-[24%] text-center whitespace-nowrap"
        style={{ fontSize: 36, fontFamily: "'IBM Plex Mono', monospace", color: "#f0eee4", opacity: srcOp * 0.92, letterSpacing: "-0.02em" }}
      >
        Source : USGS 2024
      </div>
    </AbsoluteFill>
  );
};

export const TEAL_ASSEMBLY_FRAMES = 165;
