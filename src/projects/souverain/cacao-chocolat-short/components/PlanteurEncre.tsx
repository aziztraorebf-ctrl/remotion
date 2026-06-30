/**
 * PlanteurEncre — PROTO personnage d'encre (format long, R&D 2026-06-29).
 * ⛔ Garde-fou doctrine : SVG = abstrait/symbolique, PAS organique humain realiste.
 *   -> SILHOUETTE stylisee facon pictogramme GGW (traits epais, digne), pas un humain detaille.
 *
 * Pilote par props (zero logique frame ici) :
 *   walk  : 0..1 phase de marche (anime jambes/bras en balancier via sin du parent)
 *   bend  : 0..1 le planteur se PENCHE (0 = debout, 1 = penche vers la cabosse au sol)
 *   facing: 1 (droite) / -1 (gauche)
 *   armReach: 0..1 le bras s'etend vers la cabosse (recolte)
 * Registre : trait encre #2b2117, chapeau paille (rappel du chapeau VergerCacao).
 */
import React from "react";

const INK = "#2b2117";
const STRAW = "#d1b46b";
const STRAW_D = "#c39a4f";

type Props = {
  walkPhase?: number; // phase continue (frame) pour le balancier
  bend?: number; // 0 debout, 1 penche
  facing?: 1 | -1;
  armReach?: number; // 0..1 extension du bras avant
};

export const PlanteurEncre: React.FC<Props> = ({ walkPhase = 0, bend = 0, facing = 1, armReach = 0 }) => {
  // balancier de marche (jambes + bras opposes), amorti quand on se penche (bend -> immobile)
  const swing = Math.sin(walkPhase / 6) * (1 - bend) * 18; // degres
  const legA = swing;
  const legB = -swing;
  const armBack = -swing * 0.7;
  // le buste se plie vers l'avant quand bend monte (flexion mesuree, pas un basculement)
  const torsoBend = bend * 28; // degres
  // bras avant : balancier en marche, PUIS s'etend vers le sol-avant en recolte (armReach)
  const armFront = (1 - bend) * swing * 0.7 + armReach * 78;

  return (
    <g transform={`scale(${facing} 1)`}>
      {/* jambes (depuis la hanche y=-150) */}
      <g stroke={INK} strokeWidth={11} strokeLinecap="round" fill="none">
        <path d={`M 0 -150 ${legLine(legA)}`} />
        <path d={`M 0 -150 ${legLine(legB)}`} />
      </g>
      {/* buste (se plie) — pivot a la hanche */}
      <g transform={`rotate(${torsoBend} 0 -150)`}>
        {/* torse */}
        <path d="M 0 -150 L 0 -300" stroke={INK} strokeWidth={14} strokeLinecap="round" fill="none" />
        {/* bras arriere */}
        <path d={`M 0 -278 ${armLine(armBack)}`} stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none" />
        {/* bras avant (recolte) */}
        <path d={`M 0 -278 ${armLine(armFront)}`} stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none" />
        {/* tete */}
        <circle cx={0} cy={-330} r={26} fill="none" stroke={INK} strokeWidth={6} />
        {/* chapeau de paille (rappel VergerCacao) */}
        <g transform="translate(0 -352)">
          <ellipse cx={0} cy={2} rx={52} ry={14} fill={STRAW} stroke={INK} strokeWidth={4} />
          <path d="M -30 0 C -22 -26 22 -26 30 0 Z" fill={STRAW_D} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        </g>
      </g>
    </g>
  );
};

// jambe : de la hanche, balancier d'angle a, longueur ~150 jusqu'au sol
function legLine(a: number): string {
  const rad = (a * Math.PI) / 180;
  const x = Math.sin(rad) * 150;
  const y = Math.cos(rad) * 150;
  return `l ${x.toFixed(1)} ${y.toFixed(1)}`;
}
// bras : de l'epaule, angle a (0=le long du corps, +=vers l'avant/bas), longueur ~120
function armLine(a: number): string {
  const rad = (a * Math.PI) / 180;
  const x = Math.sin(rad) * 120;
  const y = Math.cos(rad) * 120;
  return `l ${x.toFixed(1)} ${y.toFixed(1)}`;
}
