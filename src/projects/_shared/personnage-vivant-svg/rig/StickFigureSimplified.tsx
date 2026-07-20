/**
 * StickFigureSimplified — version "LOD lointain" pour dos/face à PETITE ÉCHELLE (règle pro 2026-07-02,
 * confirmée par revue croisée Gemini 3.1 Pro + GPT-5.5, méthode "Scale & Bob" des studios explainer).
 *
 * CONSTAT (empirique + confirmé par les 2 modèles) : en vue dos/face, le pas se lit sur l'axe Y écran
 * (quelques pixels de foreshortening) — à petite échelle (perso lointain dans le cadre), ce mouvement
 * devient QUASI ILLISIBLE (mangé par l'épaisseur du trait), contrairement au PROFIL où le pas se lit sur
 * l'axe X (large, lisible à toute échelle). Ce n'est pas un bug du rig — c'est une contrainte géométrique
 * de la projection 2D, documentée dans PERSONNAGE-VIVANT-INDEX.md § 8 DIRECTIONS.
 *
 * RÈGLE PRO adoptée (au lieu de forcer StickRigMultiDir à toute échelle) :
 *  - Profil / 3/4 : gardent le cycle de jambes complet, à TOUTE échelle (lisible nativement).
 *  - Dos / face LOINTAIN (perso petit dans le cadre) : jambes NON articulées (juste 2 segments fixes
 *    légèrement écartés), le mouvement est porté par BOB (rebond vertical du corps entier, sinusoïdal,
 *    simule le transfert de poids) + SWING des bras + SCALE (grossit/rétrécit selon l'approche/éloignement).
 *    "C'est le cerveau du spectateur qui fait le reste du travail" (Gemini 3.1 Pro).
 *  - Dos / face PROCHE (gros plan) : peut repasser sur StickRigMultiDir (jambes lisibles à cette taille).
 *
 * Décision de mise en scène (pas de seuil automatique dans le rig) : c'est la SCÈNE qui choisit
 * StickFigureSimplified vs StickRigMultiDir selon son cadrage — le rig ne devine pas l'intention du plan.
 */
import React from "react";
import { computePose, RIG } from "./poses";
import { torsoQuad } from "./multiDirection";

const DEFAULT_INK = "#2b2117";
const DEFAULT_TUNIC = "#e8dcc0";
const STRAW = "#d1b46b", STRAW_D = "#c39a4f";
const CAP = "#5e7245", CAP_D = "#4a5c37";
const DEFAULT_NECKWEAR = "#8a3a2e";

export type StickFigureSimplifiedProps = {
  view: "back" | "face";
  walkPhase?: number;
  facing?: 1 | -1;
  ink?: string;
  tunicColor?: string;
  tunicPattern?: "none" | "stripes" | "collar";
  neckwear?: "none" | "tie" | "scarf-knot";
  neckwearColor?: string;
  hat?: "straw" | "cap" | "none";
  scale?: number;
};

export const StickFigureSimplified: React.FC<StickFigureSimplifiedProps> = ({
  view, walkPhase = 0, facing = 1,
  ink = DEFAULT_INK, tunicColor = DEFAULT_TUNIC, tunicPattern = "none",
  neckwear = "none", neckwearColor = DEFAULT_NECKWEAR, hat = "straw", scale = 1,
}) => {
  const { LEG, HEAD_R } = RIG;
  // bob : rebond vertical sinusoidal (transfert de poids), MEME cadence que la marche reelle (walkPhase/6)
  const phase = walkPhase / 6;
  const bob = Math.abs(Math.sin(phase)) * 6; // amplitude legere, corps entier
  const armSwing = Math.sin(phase) * 8;

  const pose = computePose({ walkPhase, moveAmt: 0, bend: 0 }); // moveAmt=0 : pas de swing de jambe (LOD)
  const hipY = pose.hipY - bob, shY = pose.shY - bob;

  const torso = torsoQuad(0, 0, 22, 0, 0, shY, hipY);
  const shXL = torso.shBackX, shXR = torso.shFrontX;
  const hipXL = -13, hipXR = 13;
  const neckX = 0, neckY = shY;
  const headX = 0, headY = neckY - (HEAD_R + 14);

  const S = { stroke: ink, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const legLen = LEG * 0.5;

  return (
    <g transform={`scale(${facing * scale} ${scale})`} opacity={0.92}>
      {/* jambes FIXES (legerement ecartees, pas de cycle articule — le mouvement est porte par le bob) */}
      <path d={`M ${hipXL} ${hipY} L ${hipXL - 6} ${hipY + legLen}`} {...S} strokeWidth={9} opacity={0.85} />
      <path d={`M ${hipXR} ${hipY} L ${hipXR + 6} ${hipY + legLen}`} {...S} strokeWidth={10} />

      {/* bras : SWING visible (porte une bonne partie de la lecture "il marche") */}
      <path d={`M ${shXL} ${shY} L ${shXL - armSwing} ${shY + 90}`} {...S} strokeWidth={8.5} opacity={0.85} />
      <path d={`M ${shXR} ${shY} L ${shXR + armSwing} ${shY + 90}`} {...S} strokeWidth={9} />

      {/* torse */}
      <path
        d={`M ${hipXL} ${hipY} L ${shXL} ${shY} L ${shXR} ${shY} L ${hipXR} ${hipY} Z`}
        fill={tunicColor} fillOpacity={0.96} stroke={ink} strokeWidth={4} strokeLinejoin="round"
      />
      {tunicPattern === "stripes" && [0.3, 0.5, 0.7].map((t, i) => (
        <line key={i} x1={shXL + (shXR - shXL) * t} y1={shY} x2={hipXL + (hipXR - hipXL) * t} y2={hipY} stroke={ink} strokeWidth={2} opacity={0.4} />
      ))}
      {neckwear === "tie" && (
        <path d={`M -4 ${neckY + 4} L 4 ${neckY + 4} L 0 ${neckY + 30} Z`} fill={neckwearColor} stroke={ink} strokeWidth={2.5} strokeLinejoin="round" />
      )}
      {neckwear === "scarf-knot" && (
        <circle cx={0} cy={neckY + 8} r={8} fill={neckwearColor} stroke={ink} strokeWidth={2.5} />
      )}

      {/* nuque + tete */}
      <line x1={neckX} y1={neckY} x2={headX} y2={headY} {...S} strokeWidth={11} />
      <circle cx={headX} cy={headY} r={HEAD_R} fill={view === "back" ? ink : "#e8dcc0"} opacity={view === "back" ? 0.9 : 1} stroke={ink} strokeWidth={6} />
      {view === "face" && (
        <>
          <circle cx={headX - 8} cy={headY - 2} r={2.4} fill={ink} />
          <circle cx={headX + 8} cy={headY - 2} r={2.4} fill={ink} />
        </>
      )}
      {hat === "straw" && (
        <g transform={`translate(${headX} ${headY})`}>
          <ellipse cx={0} cy={-20} rx={48} ry={view === "back" ? 16 : 13} fill={STRAW} stroke={ink} strokeWidth={4} />
        </g>
      )}
      {hat === "cap" && (
        <g transform={`translate(${headX} ${headY})`}>
          <path d="M -26 -16 A 26 26 0 0 1 26 -16 Z" fill={CAP} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
};
