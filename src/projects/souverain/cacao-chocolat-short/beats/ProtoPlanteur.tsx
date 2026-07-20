/**
 * PROTO format LONG — un PERSONNAGE D'ENCRE dans le verger (16:9). R&D 2026-06-29.
 * Teste la brique "identification" que le long debloque : un planteur (silhouette d'encre) entre,
 * marche, se penche, RECOLTE une cabosse. Decor sobre (verger + sol + soleil) pour juger le PERSONNAGE.
 * Choregraphie (8s @30 = 240f) :
 *   f0-90   : entre par la gauche en marchant jusqu'au cacaoyer
 *   f90-130 : s'arrete, se penche
 *   f130-180: tend le bras, recolte la cabosse (elle "monte" dans sa main)
 *   f180-240: se releve, cabosse en main
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { CacaoTree } from "../components/VergerCacao";
import { PlanteurEncre } from "../components/PlanteurEncre";

export const PROTO_PLANTEUR_FRAMES = 240;
const PARCH = "#e8dcc0";
const INK = "#2b2117";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

const TREE_X = 1280;
const GROUND_Y = 900;
const STOP_X = 900; // ou le planteur s'arrete (a gauche de l'arbre, a distance)
const MAN_S = 0.52; // echelle du planteur : ~1/3 de l'arbre (un homme vs un cacaoyer de 5m)

export const ProtoPlanteur: React.FC = () => {
  const frame = useCurrentFrame();
  const wf = frame;

  // deplacement gauche -> position d'arret
  const x = interpolate(frame, [0, 90], [-150, STOP_X], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const walking = frame < 92 ? frame : 0; // phase de marche (fige a l'arret)
  const bend = interpolate(frame, [92, 130, 180, 230], [0, 1, 1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const armReach = interpolate(frame, [128, 168], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  // la cabosse au sol -> "recoltee" : remonte avec la main entre f150 et f200 (echelle du planteur)
  const podLift = interpolate(frame, [150, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const podX = STOP_X + 40 * MAN_S * 2;
  const podY = GROUND_Y - podLift * 130 * MAN_S * 2;
  const sunPulse = 0.85 + 0.15 * Math.sin(wf / 22);

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <rect width={1920} height={1080} fill={PARCH} />
        {/* soleil */}
        <circle cx={260} cy={210} r={86} fill="#f2c14e" opacity={0.95} />
        <circle cx={260} cy={210} r={86} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />
        <g stroke="#f2c14e" strokeWidth={4} opacity={0.55 * sunPulse} strokeLinecap="round">
          {Array.from({ length: 8 }, (_, k) => { const ba = (k / 8) * Math.PI * 2 + wf / 120; const r0 = 98, r1 = 140; return <line key={k} x1={260 + Math.cos(ba) * r0} y1={210 + Math.sin(ba) * r0} x2={260 + Math.cos(ba) * r1} y2={210 + Math.sin(ba) * r1} />; })}
        </g>
        {/* horizon + sol */}
        <path d="M0 905 C500 894 1000 916 1920 906" fill="none" stroke={INK} strokeWidth={2.4} opacity={0.5} />

        {/* cacaoyer (a droite, le planteur va vers lui) */}
        <g transform={`translate(${TREE_X} ${GROUND_Y}) scale(1.0)`}>
          <g transform={`rotate(${Math.sin(wf / 26) * 1.2} 0 0)`}>
            <CacaoTree alive={1} grow={1} tone={0} />
          </g>
        </g>

        {/* CABOSSE recoltee (au sol -> dans la main) */}
        <g transform={`translate(${podX} ${podY})`} opacity={podLift > 0.02 || frame < 150 ? 1 : 1}>
          <ellipse cx={0} cy={0} rx={20} ry={34} fill="#a26432" stroke={INK} strokeWidth={3} />
          <path d="M0 -30 L0 28 M-11 -24 C-5 -10 -5 12 -11 22 M11 -24 C5 -10 5 12 11 22" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        </g>

        {/* LE PLANTEUR (silhouette d'encre, echelle ~1/3 de l'arbre) */}
        <g transform={`translate(${x} ${GROUND_Y}) scale(${MAN_S})`}>
          <PlanteurEncre walkPhase={walking} bend={bend} facing={1} armReach={armReach} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
