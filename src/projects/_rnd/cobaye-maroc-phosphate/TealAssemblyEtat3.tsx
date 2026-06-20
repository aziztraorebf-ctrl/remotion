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
import { loadFont } from "@remotion/google-fonts/BebasNeue";

// Charger Bebas Neue (sinon fallback Impact silencieux = faux rendu — gate dataviz-selfreview E3)
const { fontFamily: BEBAS } = loadFont();

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
          style={{ fontSize: "46vh", fontFamily: BEBAS, color: GOLD, letterSpacing: "-0.02em", opacity: 1 - crossfade }}
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
      {/* label RESERVES MONDIALES — v9 diff matiere : creme-or desature #FFE3A6 (etait jaune sature), ombre brune douce */}
      <div
        className="absolute left-[3.5%] top-[59%] w-[18%] text-center font-bold uppercase leading-[0.88]"
        style={{ fontSize: 52, color: "#FFE3A6", fontFamily: BEBAS, letterSpacing: "-0.02em", textShadow: "2px 3px 3px rgba(58,36,22,0.55)", opacity: terreOp }}
      >
        Réserves<br />Mondiales
      </div>

      {/* Barre + segment + fleches + cartouche + traits : REMOTION (SVG, coords = diff GPT en px 1920x1080) */}
      <svg viewBox="0 0 1920 1080" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          {/* v9 diff matiere : barre desaturee #F0C66B->#D9A145, segment #C86A2D->#95411D (etaient trop jaune vif) */}
          <linearGradient id="phos" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f0c66b" /><stop offset="100%" stopColor="#d9a145" /></linearGradient>
          <linearGradient id="seg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c86a2d" /><stop offset="100%" stopColor="#95411d" /></linearGradient>
        </defs>

        {/* trait de liaison picto->70 — v9 diff matiere : #CFC58E (beige desature), 3px, opacite 0.90 */}
        <rect x={1920 * 0.215} y={1080 * 0.497} width={1920 * 0.11} height={3} fill="#cfc58e" opacity={terreOp * 0.9} />

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
              {/* cartouche PHOSPHATE — v9 diff matiere : bordure beige-or pale #D9C58D 4px, fond #0B3F48 a0.38 */}
              <rect x={cartX} y={1080 * 0.128} width={1920 * 0.188} height={1080 * 0.087} rx={2} fill="#0B3F48" fillOpacity={0.38} stroke="#d9c58d" strokeWidth={4} />
              {/* texte PHOSPHATE — v9 : #F6CF86 (etait #f4c66e), ombre brune douce */}
              <text x={cartX + 1920 * 0.094} y={1080 * 0.128 + 1080 * 0.058} fill="#f6cf86" fontFamily={BEBAS} fontSize={43} fontWeight={700} textAnchor="middle" letterSpacing={1} style={{ filter: "drop-shadow(2px 3px 3px rgba(74,43,24,0.55))" }}>PHOSPHATE</text>

              {/* zone 70% phosphate (jaune) */}
              <rect x={barX} y={phosTop} width={barW} height={phosH} fill="url(#phos)" />
              {/* segment 30% (brun) colle, qui s'ecrase legerement */}
              <rect x={barX} y={segFullTop} width={barW} height={segH} fill="url(#seg)" />
              {/* texte 30% — v9 diff matiere : creme #F8E9D0 (etait blanc pur), ombre brun #5A2A17 */}
              <text x={1920 * 0.788} y={1080 * 0.68 + 22} fill="#f8e9d0" fontFamily={BEBAS} fontSize={62} fontWeight={700} textAnchor="middle" style={{ filter: "drop-shadow(2px 3px 2px rgba(90,42,23,0.70))" }}>30%</text>

              {/* fleches d'ecrasement — v9 diff matiere : #C9823E orange-cuivre (etait #dda64e jaune), 6px, opacite 0.88, ombre brune */}
              {[1920 * 0.717, 1920 * 0.858].map((ax, i) => (
                <g key={i} opacity={crushP * 0.88} transform={`translate(${ax} ${1080 * 0.293 + arrowShift})`} style={{ filter: "drop-shadow(0 2px 3px rgba(58,28,18,0.35))" }}>
                  <line x1={0} y1={0} x2={0} y2={1080 * 0.34} stroke="#c9823e" strokeWidth={6} />
                  <path d={`M -12 ${1080 * 0.34 - 16} L 0 ${1080 * 0.34 + 5} L 12 ${1080 * 0.34 - 16} Z`} fill="#c9823e" stroke="none" />
                </g>
              ))}

              {/* ligne base — v9 : beige desature #CFC58E */}
              <rect x={1920 * 0.7185} y={1080 * 0.771} width={1920 * 0.177} height={3} fill="#cfc58e" opacity={0.85} />
              {/* RESTE DU MONDE — v9 diff matiere : creme-or #FFE0A0 (etait jaune), ombre brune douce */}
              <text x={1920 * 0.788} y={1080 * 0.84} fill="#ffe0a0" fontFamily={BEBAS} fontSize={36} fontWeight={700} textAnchor="middle" letterSpacing={-0.5} style={{ filter: "drop-shadow(2px 3px 3px rgba(58,36,22,0.55))" }}>
                <tspan x={1920 * 0.788} dy={0}>RESTE</tspan><tspan x={1920 * 0.788} dy={36}>DU MONDE</tspan>
              </text>
            </g>
          );
        })()}
      </svg>

      {/* source — v9 diff matiere : Arial regular #E8E7DD (etait monospace blanc), ombre noire douce */}
      <div
        className="absolute left-[38%] top-[90.5%] w-[24%] text-center whitespace-nowrap"
        style={{ fontSize: 36, fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 400, color: "#e8e7dd", opacity: srcOp * 0.92, letterSpacing: "-0.01em", textShadow: "1px 2px 3px rgba(0,0,0,0.45)" }}
      >
        Source : USGS 2024
      </div>
    </AbsoluteFill>
  );
};

export const TEAL_ASSEMBLY_FRAMES = 165;
