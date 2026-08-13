// PLANCHE DE DEMONSTRATION — LA BRIQUE IDENTITE, LE VRAI TEST
//
// Les 4 roles (mineur/commercante/fonctionnaire/agriculteur) EN MARCHE, habilles, chacun sur une
// carnation differente. SANS objet en main (simplification demandee par Aziz, passe finale
// vetements-exacts-Fable : "inutile d'avoir les objets en main [...] juste les vetements exacts
// et le personnage qui marche suffira pour valider que tout est conforme") — on isole les
// vetements pour les juger seuls. Les composants d'objets (ObjetPioche, ObjetPanier, etc.) et
// ROLE_MAIN_REPOS restent dans Roles.tsx, valides et disponibles pour la production ; simplement
// non montes ici. Critere n°1 (STICK-FIGURE-INDEX.md) : on juge le MOUVEMENT, jamais le dessin
// fige — un vetement peut etre beau a l'arret et se detacher en marche, c'est ce que cette
// planche verifie.
//
// Gabarit repris de interactions/DuoAsymetrie16x9.tsx (Etiquette Georgia serif sobre, fond nuit,
// etoiles bruit deterministe). Verrou pas/distance : walkDistance() du socle, scale EXPLICITE
// (piege documente en tete de StickFigure.tsx).
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Sequence } from "remotion";
import {
  WALK_DEFAULT,
  walkDistance,
  walkPhaseFromSteps,
  ENCRE,
} from "../StickFigure";
import { PersonnageRole, CARNATIONS, ROLE_LABEL, type RoleId } from "./Roles";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const FOND = "#182746";
const NUIT = "#22345c";
const OR_CLAIR = "#d9a93a";
const SOL_Y = 760;

// ============================================================================================
// LES 4 ROLES, chacun une carnation DIFFERENTE (montre que la tenue contraste sur plusieurs
// peaux). Ordre choisi pour eviter les pieges documentes par Fable : le chapeau paille + le
// panier ne vont PAS sur l'ambre clair -> agriculteur/commercante evitent cette carnation.
// ============================================================================================
const ELENCO: { role: RoleId; carnationIdx: number; laneX: number }[] = [
  { role: "mineur", carnationIdx: 3, laneX: 300 },        // brun profond
  { role: "commercante", carnationIdx: 1, laneX: 720 },   // terre cuivree
  { role: "fonctionnaire", carnationIdx: 0, laneX: 1200 },// ambre clair (costume, pas de coiffe -> pas de conflit)
  { role: "agriculteur", carnationIdx: 4, laneX: 1620 },  // ebene eclairci
];

const SCALE = 4.6; // vise 380-450px de haut (personnage source ~83-90px -> x4.6 ~ 400px)
const AMPLITUDE = 60; // couloir court en va-et-vient, jamais hors colonne (comparatif = alignement)
const CADENCE = 1.1;

// ============================================================================================
// UN PERSONNAGE, MARCHANT DANS UN COULOIR COURT — meme motif que IdentiteV2_16x9::useMarche,
// mais borne en triangle-wave pour rester dans sa colonne (visible plein cadre, comparable).
// ============================================================================================
const useMarcheCouloir = (frame: number, fps: number, scale: number, index: number) => {
  const pas = (frame / fps) * CADENCE * 2;
  const phaseOffset = index * 0.057; // pas petit, jamais pres de 0.5 (desync verifiee ailleurs)
  const phase = (walkPhaseFromSteps(pas) + phaseOffset + 1000) % 1;
  const distTotal = walkDistance(pas, WALK_DEFAULT.swingMax, scale);
  // triangle wave bornee sur AMPLITUDE : va-et-vient autour de la colonne
  const period = AMPLITUDE * 4;
  const t = ((distTotal % period) + period) % period;
  const offset = t < period / 2 ? t - AMPLITUDE : (period - t) - AMPLITUDE;
  return { phase, offset };
};

const Etiquette: React.FC<{ x: number; label: string; nom: string; op: number }> = ({ x, label, nom, op }) => (
  <g opacity={op}>
    <text x={x} y={SOL_Y - 470} textAnchor="middle" fontFamily="Georgia, serif" fontSize={22} fill={ENCRE}
      letterSpacing={2} opacity={0.92}>{label}</text>
    <text x={x} y={SOL_Y - 442} textAnchor="middle" fontFamily="Georgia, serif" fontSize={14} fill={OR_CLAIR}
      letterSpacing={1} opacity={0.62} fontStyle="italic">{nom}</text>
  </g>
);

const TitrePlanche: React.FC<{ op: number }> = ({ op }) => (
  <g opacity={op}>
    <text x={W / 2} y={92} textAnchor="middle" fontFamily="Georgia, serif" fontSize={15} fill={OR_CLAIR}
      letterSpacing={6} opacity={0.7}>IDENTITÉ</text>
    <text x={W / 2} y={130} textAnchor="middle" fontFamily="Georgia, serif" fontSize={27} fill={ENCRE}
      letterSpacing={3} opacity={0.92}>LES 4 RÔLES — TENUE EXACTE, EN MARCHE</text>
    <text x={W / 2} y={160} textAnchor="middle" fontFamily="Georgia, serif" fontSize={17} fill={ENCRE}
      letterSpacing={1} opacity={0.42} fontStyle="italic">formes recopiees fidelement de Fable 5</text>
  </g>
);

const Sol: React.FC<{ x1: number; x2: number }> = ({ x1, x2 }) => (
  <line x1={x1} y1={SOL_Y} x2={x2} y2={SOL_Y} stroke={ENCRE} strokeWidth={2} opacity={0.28} strokeLinecap="round" />
);

const ROLE_DEMO_FRAMES = S(26);

export const RolesDemo16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opGlobal = interpolate(frame, [0, 14, ROLE_DEMO_FRAMES - 16, ROLE_DEMO_FRAMES], [0, 1, 1, 0], clamp);
  const opTitre = interpolate(frame, [0, 18], [0, 1], clamp);
  const opEtiq = interpolate(frame, [10, 28], [0, 1], clamp);

  const stars = React.useMemo(() => {
    const a: { x: number; y: number; r: number; o: number }[] = [];
    let s = 17;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 40; i++) {
      a.push({ x: rnd() * W, y: rnd() * H * 0.6, r: rnd() * 1.3 + 0.4, o: rnd() * 0.28 + 0.1 });
    }
    return a;
  }, []);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, ${NUIT} 0%, ${FOND} 100%)`, opacity: opGlobal }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {stars.map((st, i) => <circle key={i} cx={st.x} cy={st.y} r={st.r} fill={ENCRE} opacity={st.o} />)}

        <TitrePlanche op={opTitre} />
        <Sol x1={140} x2={1780} />

        {ELENCO.map((e, i) => {
          const { phase, offset } = useMarcheCouloir(frame, fps, SCALE, i);
          const carn = CARNATIONS[e.carnationIdx];
          return (
            <React.Fragment key={e.role}>
              <Etiquette x={e.laneX} label={ROLE_LABEL[e.role]} nom={carn.nom} op={opEtiq} />
              <PersonnageRole
                x={e.laneX + offset}
                y={SOL_Y}
                phase={phase}
                scale={SCALE}
                role={e.role}
                couleur={carn.couleur}
                frame={frame}
                avecObjet={false}
              />
            </React.Fragment>
          );
        })}

        <text x={W / 2} y={1032} textAnchor="middle" fontFamily="Georgia, serif" fontSize={15} fill={ENCRE}
          letterSpacing={6} opacity={0.24}>MINEUR · COMMERÇANTE · FONCTIONNAIRE · AGRICULTEUR</text>
      </svg>
    </AbsoluteFill>
  );
};

export const ROLES_DEMO_FRAMES = ROLE_DEMO_FRAMES;

export default RolesDemo16x9;
