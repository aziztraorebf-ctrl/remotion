import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { GridBackground } from "../../_shared/components/GridBackground";
import { InkDonutChart } from "../../_shared/components/InkDonutChart";
import { PoissonEncre } from "../../_shared/svg-library/elements/peche/PoissonEncre";
import { ChalutierGemini } from "../../_shared/svg-library/elements/peche/ChalutierGemini";
import { PirogueGPT } from "../../_shared/svg-library/elements/peche/PirogueGPT";
import { PanierOsierEncre } from "../../_shared/svg-library/elements/peche/PanierOsierEncre";
import { SoleilHaloRadial } from "../../_shared/svg-library/elements/ciel/SoleilHaloRadial";
import { OceanProfondeurVagues } from "../../_shared/svg-library/elements/ocean/OceanProfondeurVagues";
import { CloudQwenGravure } from "../svg-scenes/CloudQwenGravure";
import { lerpHex, objectVisualBottom } from "../../_shared/svg-library/motion";
import { DATAVIZ_BG, PARCH, PARCH_DIM } from "../../_shared/svg-library/palette";
import {
  Figure,
  Membre,
  solveArm,
  rad,
  TORSO_LENGTH,
  HIP_Y_STANDING,
  BRAS_L,
  AVBRAS_L,
} from "../../_shared/stick-figure-svg/StickFigure";

/**
 * "LE PECHEUR ET LA SURPECHE" — VERSION STICK FIGURE (2026-07-27)
 *
 * POURQUOI CETTE VERSION : le proto `_rnd/svg-scenes/PecheurSurpeche16x9.tsx` (2026-07-04) raconte
 * deja cette scene, mais avec le GeminiRig (personnage riche articule) — un registre ECARTE en
 * production ("pantin bien anime, pas maitrise", cf. NEXT-ACTION § doctrine recentree). Le registre
 * stick figure vient d'etre valide par Aziz en scene reelle (PecheurDuree16x9, 2026-07-27 : "pas de
 * probleme avec le personnage qui ne touche pas au sol, les bras bougent parfaitement, pas de
 * tremblote, le corps qui se penche en arriere comme on tirait vraiment sur une corde").
 * -> On rejoue la MEME scene avec le personnage qui marche.
 *
 * ⛔ TOUT LE DECOR EST REUTILISE TEL QUEL (aucune brique redessinee) : PirogueGPT, ChalutierGemini,
 * PanierOsierEncre, PoissonEncre, SoleilHaloRadial, OceanProfondeurVagues, CloudQwenGravure,
 * InkDonutChart + la donnee sourcee ODI. Seul le PERSONNAGE change, et le GESTE qu'il fait.
 * (FiletGemini est ecarte ici : sa geometrie est figee en pleine ouverture, concue pour un filet
 * DEJA lance et pose sur l'eau — le cycle lancer->halage a besoin d'un filet dont la forme suit la
 * corde, donc il est trace par le code. Voir NetShape plus bas.)
 *
 * LE CYCLE (choix d'Aziz) : LANCER -> attente -> HALAGE -> constat. C'est au RETOUR qu'on voit le
 * declin : 3 poissons au 1er lancer, 1 au 2e, 0 au 3e — pendant que le chalutier grossit a l'horizon.
 *
 * DONNEE FACTUELLE (inchangee, deja sourcee dans le proto d'origine) : repartition VALEUR des
 * captures Senegal 2021 — artisanal 61% / autres flottes 39%. Source : ODI, "Estimating the impact
 * of irregular and unsustainable fishing of distant-water fishing fleets in Senegal" (2024).
 *
 * ⛔ Registre stick figure : profil uniquement, aucun visage, socle IMPORTE (jamais recopie),
 * frame-driven pur.
 */

const INK = "#2b2117";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);
const smooth = (t: number) => t * t * (3 - 2 * t);

export const PECHEUR_STICK_FRAMES = 2040; // 68s @ 30fps — meme duree que le proto d'origine

// ---- palette temporelle (reprise du proto) ----
const SKY_DAWN = "#e8c9a0";
const SKY_DAY = "#e8dcc0";
const SKY_DUSK = "#c98a5a";
const SEA_DAWN = "#7a8a9a";
const SEA_DAY = "#8a9aa5";
const SEA_DUSK = "#5f6a7a";

// ===========================================================================
// LES 3 CYCLES DE PECHE — chacun : LANCER -> attente -> HALAGE -> constat
// ===========================================================================
// Le declin est NARRATIF, pas aleatoire : 3 poissons, puis 1, puis 0.
const CYCLES = [
  { t0: 40,   cast: 40,  soak: 190, haul: 330, done: 520,  fish: 3, label: "Premier lancer" },
  { t0: 620,  cast: 620, soak: 770, haul: 910, done: 1090, fish: 1, label: "Deuxieme lancer — le chalutier approche" },
  { t0: 1200, cast: 1200, soak: 1340, haul: 1470, done: 1400 + 240, fish: 0, label: "Troisieme lancer — le filet revient vide" },
];

const T = {
  duskStart: 1150,
  duskEnd: 1400,
  dataStart: 1700,
  dataFade: 1740,
};

type PecheurState = {
  // phase du geste
  gripX: number; gripY: number;   // la main tient la corde du filet (repere local)
  torsoDeg: number;
  hipY: number;
  legFront: number; legBack: number;
  kneeFront: number; kneeBack: number;
  // le filet
  netX: number; netY: number;     // position du filet EN MONDE (px scene)
  netSpread: number;              // 0 = referme dans la main, 1 = grand ouvert sur l'eau
  netVisible: boolean;
  netInWater: boolean;
  ropeVisible: boolean;
};

// ---------------------------------------------------------------------------
// LE GESTE — decide L'OBJET d'abord (ou est le filet), les mains suivent.
// C'est la regle du registre (INDEX § MANIPULER UN OBJET) : animer les bras en
// esperant que l'objet suive fait lacher l'outil. Prouve sur PecheurDuree16x9.
// ---------------------------------------------------------------------------
const REACH_MAX = (BRAS_L + AVBRAS_L) * 0.80; // marge anti-butee IK (cf. PecheurDuree16x9)

// ⛔ RACCORD ENTRE PHASES — mesure avant rendu : les 4 phases sont des mecaniques
// independantes (angles de bras vs IK de traction vs pose de constat), donc leurs
// mains ne tombent PAS au meme endroit a la frontiere. Mesure : 41px d'ecart a
// l'ecran sur attente->halage, 47px sur halage->constat = un teleportement visible.
// C'est le meme probleme que la brique 4 du socle (POSES-CLES > springs accumules) :
// on ne "regle" pas les phases pour qu'elles coincident, on FOND entre elles sur
// quelques frames — a tout instant on est sur le segment entre 2 poses valides.
const BLEND = 12; // frames de fondu

const mixState = (a: PecheurState, b: PecheurState, t: number): PecheurState => {
  const m = (x: number, y: number) => x + (y - x) * t;
  return {
    gripX: m(a.gripX, b.gripX),
    gripY: m(a.gripY, b.gripY),
    torsoDeg: m(a.torsoDeg, b.torsoDeg),
    hipY: m(a.hipY, b.hipY),
    legFront: m(a.legFront, b.legFront),
    legBack: m(a.legBack, b.legBack),
    kneeFront: m(a.kneeFront, b.kneeFront),
    kneeBack: m(a.kneeBack, b.kneeBack),
    netX: m(a.netX, b.netX),
    netY: m(a.netY, b.netY),
    netSpread: m(a.netSpread, b.netSpread),
    netVisible: a.netVisible || b.netVisible,
    netInWater: t < 0.5 ? a.netInWater : b.netInWater,
    ropeVisible: a.ropeVisible || b.ropeVisible,
  };
};

const pecheurRaw = (frame: number, c: (typeof CYCLES)[number], fatigue: number): PecheurState => {
  // Reperes locaux du personnage. x local positif = vers l'AVANT (la mer, a droite).
  const restTorso = 3 + 7 * fatigue;   // il n'est jamais parfaitement droit, et se voute avec le temps
  const restHip = HIP_Y_STANDING + 3 * fatigue;

  const base = {
    torsoDeg: restTorso,
    hipY: restHip,
    legFront: 15,
    legBack: -18,
    kneeFront: 4,
    kneeBack: 0,
    netSpread: 0,
    netVisible: false,
    netInWater: false,
    ropeVisible: false,
    netX: 0,
    netY: 0,
  };

  const shoulder = (torsoDeg: number, hipY: number) => ({
    x: Math.sin(rad(torsoDeg)) * TORSO_LENGTH,
    y: hipY - Math.cos(rad(torsoDeg)) * TORSO_LENGTH,
  });

  // main a un angle/portee donnes depuis l'epaule (convention socle : 0 = pend, 90 = avant)
  const handAt = (torsoDeg: number, hipY: number, angleDeg: number, reach: number) => {
    const s = shoulder(torsoDeg, hipY);
    return {
      x: s.x + Math.sin(rad(angleDeg)) * reach,
      y: s.y + Math.cos(rad(angleDeg)) * reach,
    };
  };

  // ======================= 1) LE LANCER =======================
  if (frame < c.soak) {
    const t = interpolate(frame, [c.cast, c.soak], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    // 3 temps : ARMER (0->0.42) — il ramene le filet en arriere, buste qui pivote en arriere
    //           FOUETTER (0.42->0.58) — le geste rapide, le filet part
    //           SUIVRE (0.58->1) — le filet vole et s'ouvre, lui reste tendu vers l'avant
    let torsoDeg: number, handAngle: number, handReach: number;
    let netVisible = true, netInWater = false, netSpread = 0, ropeVisible = true;
    let netWorld = { x: 0, y: 0 };

    if (t < 0.42) {
      const u = smooth(t / 0.42);
      // il arme : le buste recule (negatif = vers l'arriere), la main part haut-arriere
      torsoDeg = restTorso - 16 * u;
      handAngle = 20 - 105 * u;          // 20deg (devant, bas) -> -85deg (arriere, haut)
      handReach = REACH_MAX * (0.55 + 0.35 * u);
      netSpread = 0.12 * u;
    } else if (t < 0.58) {
      const u = smooth((t - 0.42) / 0.16);
      // il fouette : le buste bascule vers l'avant, la main passe devant, le filet part
      torsoDeg = restTorso - 16 + 30 * u;
      handAngle = -85 + 175 * u;         // -85deg -> +90deg (l'horizontale avant)
      handReach = REACH_MAX * (0.90 - 0.05 * u);
      netSpread = 0.12 + 0.5 * u;
    } else {
      const u = smooth((t - 0.58) / 0.42);
      // il suit : il se redresse, le filet vole vers la mer et s'ouvre
      torsoDeg = restTorso + 14 - 14 * u;
      handAngle = 90 - 55 * u;
      handReach = REACH_MAX * (0.85 - 0.25 * u);
      netSpread = 0.62 + 0.38 * u;
      netInWater = u > 0.72;
    }

    const hipY = restHip + 2 * Math.sin(Math.PI * t);
    const h = handAt(torsoDeg, hipY, handAngle, handReach);

    // Le FILET : tant qu'il est en main il colle a la main ; des le fouette il part en cloche
    // vers la mer. La trajectoire est decidee ICI (l'objet d'abord), la main ne la subit pas.
    if (t < 0.5) {
      netWorld = { x: h.x, y: h.y };
    } else {
      const fly = smooth(interpolate(t, [0.5, 1], [0, 1], { extrapolateRight: "clamp" }));
      // cloche : il monte puis retombe sur l'eau, loin devant
      netWorld = {
        x: h.x + fly * 165,
        y: h.y + fly * 46 - Math.sin(Math.PI * fly) * 40,
      };
    }

    return {
      ...base,
      torsoDeg,
      hipY,
      legFront: 15 + 10 * Math.sin(Math.PI * t),
      legBack: -18 - 12 * Math.sin(Math.PI * t),
      kneeFront: 4 + 6 * Math.sin(Math.PI * t),
      kneeBack: 4 * Math.sin(Math.PI * t),
      gripX: h.x,
      gripY: h.y,
      netX: netWorld.x,
      netY: netWorld.y,
      netSpread,
      netVisible,
      netInWater,
      ropeVisible,
    };
  }

  // ======================= 2) L'ATTENTE =======================
  // Le filet est sur l'eau, il tient la corde et attend. C'est un temps MORT VOULU : sans lui,
  // le halage n'a pas de sens (on ne remonte pas un filet qu'on vient de lancer).
  if (frame < c.haul) {
    const t = interpolate(frame, [c.soak, c.haul], [0, 1], { extrapolateRight: "clamp" });
    const breathe = Math.sin(frame / 26) * 1.2;
    const torsoDeg = restTorso + breathe * 0.4;
    const hipY = restHip + breathe * 0.5;
    const h = handAt(torsoDeg, hipY, 34, REACH_MAX * 0.62);
    return {
      ...base,
      torsoDeg,
      hipY,
      gripX: h.x,
      gripY: h.y,
      netX: h.x + 175,
      netY: h.y + 62,
      netSpread: 1,
      netVisible: true,
      netInWater: true,
      ropeVisible: true,
      // il se cale doucement, prepare la traction
      legFront: 15 + 3 * t,
      legBack: -18 - 3 * t,
      kneeFront: 4,
      kneeBack: 0,
    };
  }

  // ======================= 3) LE HALAGE =======================
  // ⭐ GESTE DEJA VALIDE PAR AZIZ sur PecheurDuree16x9 — memes amplitudes (course d'epaule ~65px,
  // recul de buste 26deg, transfert de poids sur la jambe arriere). On ne le re-invente pas.
  if (frame < c.done) {
    const t = interpolate(frame, [c.haul, c.done], [0, 1], { extrapolateRight: "clamp" });
    // 4 tractions successives, de plus en plus lentes (il ramene par a-coups, comme une vraie corde)
    const pulls = 4;
    const u = (t * pulls) % 1;
    const PULL_END = 0.52;
    let phase: number, effort: number;
    if (u < PULL_END) {
      const k = u / PULL_END;
      phase = Math.pow(k, 0.68);
      effort = Math.sin(Math.PI * Math.min(1, k * 1.12));
    } else {
      const k = (u - PULL_END) / (1 - PULL_END);
      phase = 1 - smooth(k);
      effort = 0;
    }

    const voute = restTorso + 6 * fatigue;
    const marge = Math.max(0, 26 - voute);
    const torsoDeg = voute - marge * effort * (1 - 0.25 * fatigue);
    const hipY = restHip + 9 * effort;

    const s = shoulder(torsoDeg, hipY);
    const farA = rad(74), nearA = rad(28);
    const fR = REACH_MAX * (1 - 0.2 * fatigue), nR = REACH_MAX * 0.42;
    const gxF = s.x + Math.sin(farA) * fR, gyF = s.y + Math.cos(farA) * fR;
    const gxN = s.x + Math.sin(nearA) * nR, gyN = s.y + Math.cos(nearA) * nR;
    const gripX = gxF + (gxN - gxF) * phase;
    const gripY = gyF + (gyN - gyF) * phase;

    // le filet REVIENT vers lui a mesure des tractions (t global, pas le cycle de traction)
    const back = smooth(t);
    return {
      ...base,
      torsoDeg,
      hipY,
      gripX,
      gripY,
      legFront: 15 + 14 * effort,
      legBack: -18 - 16 * effort,
      kneeFront: 4 + 8 * effort,
      kneeBack: 14 * effort,
      netX: gripX + (175 - 150 * back),
      netY: gripY + (62 - 40 * back),
      netSpread: 1 - 0.55 * back,
      netVisible: true,
      netInWater: back < 0.82,
      ropeVisible: true,
    };
  }

  // ======================= 4) LE CONSTAT =======================
  // Le filet est remonte. Il le regarde. C'est ICI que le declin se lit (0, 1 ou 3 poissons).
  // Un temps d'immobilite habitee : le corps encaisse ce qu'il voit.
  const t = interpolate(frame, [c.done, c.done + 120], [0, 1], { extrapolateRight: "clamp" });
  // quand il n'y a rien, les epaules tombent (marqueur franc, pas une degradation continue)
  const decu = c.fish === 0 ? smooth(t) : c.fish === 1 ? smooth(t) * 0.45 : 0;
  const torsoDeg = restTorso + 12 * decu;
  const hipY = restHip + 3 * decu;
  const h = handAt(torsoDeg, hipY, 26 - 10 * decu, REACH_MAX * 0.5);
  return {
    ...base,
    torsoDeg,
    hipY,
    gripX: h.x,
    gripY: h.y,
    netX: h.x + 22,
    netY: h.y + 30,
    netSpread: 0.42,
    netVisible: true,
    netInWater: false,
    ropeVisible: true,
    legFront: 14,
    legBack: -16,
    kneeFront: 4,
    kneeBack: 0,
  };
};

// Etat final : fondu court a chaque frontiere de phase (les frontieres sont les
// seuls points ou 2 mecaniques differentes se rencontrent).
const pecheurAt = (frame: number, c: (typeof CYCLES)[number], fatigue: number): PecheurState => {
  const st = pecheurRaw(frame, c, fatigue);
  for (const edge of [c.soak, c.haul, c.done]) {
    if (frame >= edge && frame < edge + BLEND) {
      // on melange la pose que la phase PRECEDENTE aurait tenue (figee a sa derniere
      // frame) avec la nouvelle, sur BLEND frames.
      const prev = pecheurRaw(edge - 1, c, fatigue);
      const t = smooth((frame - edge) / BLEND);
      return mixState(prev, st, t);
    }
  }
  return st;
};

// ===========================================================================
// LE FILET — trace par le code (pas FiletGemini, dont la geometrie est figee en
// pleine ouverture : ici la forme doit SUIVRE l'etat du geste, de la boule dans
// la main jusqu'a la nappe etalee sur l'eau).
// ===========================================================================
const NetShape: React.FC<{ spread: number; inWater: boolean; ink: string; fish: number }> = ({
  spread, inWater, ink, fish,
}) => {
  const w = 26 + spread * 104;   // demi-largeur
  const h = 16 + spread * 40;    // profondeur de la poche
  const brins = 7;
  return (
    <g>
      {/* la poche du filet : une nappe qui pend */}
      <path
        d={`M ${-w} 0 Q 0 ${h * 1.5} ${w} 0`}
        fill={inWater ? "none" : ink}
        fillOpacity={0.06}
        stroke={ink}
        strokeWidth={2}
        opacity={0.85}
      />
      {/* le maillage : des brins qui suivent la poche */}
      {Array.from({ length: brins }).map((_, i) => {
        const k = (i / (brins - 1)) * 2 - 1;      // -1..1
        const x = k * w;
        const yb = h * 1.5 * (1 - k * k);          // la parabole de la poche
        return <line key={i} x1={x * 0.3} y1={0} x2={x} y2={yb} stroke={ink} strokeWidth={1.1} opacity={0.5} />;
      })}
      {/* lignes horizontales du maillage */}
      {[0.4, 0.72].map((r, i) => (
        <path
          key={i}
          d={`M ${-w * r} ${h * 1.5 * (1 - r * r) * 0.55} Q 0 ${h * 1.5 * r + 6} ${w * r} ${h * 1.5 * (1 - r * r) * 0.55}`}
          fill="none" stroke={ink} strokeWidth={1} opacity={0.42}
        />
      ))}
      {/* les plombs sur le rebord */}
      {Array.from({ length: 5 }).map((_, i) => {
        const k = (i / 4) * 2 - 1;
        return <circle key={i} cx={k * w * 0.94} cy={Math.abs(k) < 0.99 ? h * 0.28 : 2} r={2.6} fill={ink} opacity={0.75} />;
      })}
      {/* LE POISSON PRIS DANS LE FILET — c'est lui qui porte le declin, pas un chiffre */}
      {!inWater &&
        Array.from({ length: fish }).map((_, i) => (
          <g key={i} transform={`translate(${-18 + i * 20} ${h * 0.85 + (i % 2) * 8}) scale(0.34) rotate(${-14 + i * 15})`}>
            <PoissonEncre />
          </g>
        ))}
    </g>
  );
};

// ===========================================================================
// LE PECHEUR — socle importe + bras en IK vers la corde (memes briques que
// PecheurDuree16x9, valide par Aziz).
// ===========================================================================
// ⛔ 7e PIEGE — VU AU RENDU v1 : le pecheur MARCHAIT SUR L'EAU, pirogue vide 253px
// plus bas. Cause : j'ai pose le perso a y=742 et la pirogue a y=742+292 en croyant
// les superposer — je les ai EMPILES. Mesure du fix : PirogueGPT a scale 1.35 fait
// 78px de haut, son bord superieur est a -39px de son origine, le fond interieur a
// -14px. Pour que les pieds soient DANS la coque, il faut pieds = origine_pirogue - 14.
// Regle : quand deux briques doivent se toucher, MESURER la geometrie de la brique
// (ses bornes reelles), jamais estimer un offset a l'oeil.
// ⛔ 8e PIEGE — LA GEOMETRIE DU DECOR EST CABLEE EN DUR, on ne la deplace pas
// librement. Vu au rendu v2 : un bloc rectangulaire gris coupait le bas-gauche de
// l'ecran et le chalutier voguait DANS LE CIEL. Cause : `OceanProfondeurVagues`
// dessine son rect de mer a partir de **y=720 en dur** (et ses vagues entre 750 et
// 1040), l'horizon du proto d'origine est a **y=620**. En descendant la pirogue a
// 858 j'ai casse ce contrat : la coque passait sous la nappe de vagues et le bord
// du rect devenait visible. Le chalutier, lui, est cale sur l'horizon (470+) et
// n'avait plus d'eau sous lui.
// -> La pirogue doit flotter DANS la bande de mer (720-1080), assez bas pour que les
//    vagues de 1er plan passent devant sa coque, mais au-dessus des vagues les plus
//    proches. y=800 place la ligne de flottaison entre les vagues 780 et 830.
const PECHEUR_X = 760;
const PIROGUE_Y = 800;                    // origine de la coque, DANS la bande de mer
const PECHEUR_GROUND = PIROGUE_Y - 14;    // ses pieds reposent sur le fond interieur
const PERSO_SCALE = 2.6;

const PecheurStick: React.FC<{ st: PecheurState; tangage: number; ink: string; fish: number }> = ({
  st, tangage, ink, fish,
}) => {
  const sx = Math.sin(rad(st.torsoDeg)) * TORSO_LENGTH;
  const sy = st.hipY - Math.cos(rad(st.torsoDeg)) * TORSO_LENGTH;

  const h1: [number, number] = [st.gripX + 5, st.gripY - 1];
  const h2: [number, number] = [st.gripX - 6, st.gripY + 2];
  const armFront = solveArm(sx, sy, h1[0], h1[1], 1);
  const armBack = solveArm(sx, sy, h2[0], h2[1], 1);

  return (
    // ⭐ IL TANGUE AVEC LA PIROGUE. Le pivot du tangage est le CENTRE DE LA COQUE
    // (PECHEUR_X, PIROGUE_Y), pas ses pieds : c'est la barque qui roule, et lui est
    // embarque dessus. On pivote donc autour du meme point que la pirogue, puis on
    // redescend a la hauteur de ses pieds. Ancrage garanti par construction — c'est
    // ce qu'Aziz a valide sur la scene precedente ("ses pieds sont parfaitement
    // ancres dans le sol du decor"), transpose a un sol qui bouge.
    <g transform={`translate(${PECHEUR_X} ${PIROGUE_Y}) rotate(${tangage}) translate(0 ${PECHEUR_GROUND - PIROGUE_Y})`}>
      <g transform={`scale(${PERSO_SCALE})`}>
        <Figure
          x={0}
          y={0}
          phase={0}
          hideArm1
          color={ink}
          pose={{
            hipY: st.hipY,
            torsoDeg: st.torsoDeg,
            leg1Deg: st.legFront,
            leg2Deg: st.legBack,
            leg1Knee: st.kneeFront,
            leg2Knee: st.kneeBack,
            arm2Deg: 0,
            arm2Len: 0.001,
          }}
        />

        {/* LA CORDE : de ses mains jusqu'a l'attache du filet. Elle se tend quand il
            tire (peu de mou), elle pend quand le filet est pose sur l'eau. */}
        {st.ropeVisible && (
          <path
            d={`M ${h2[0]} ${h2[1]} Q ${(h2[0] + st.netX) / 2} ${(h2[1] + st.netY) / 2 + (st.netInWater ? 16 : 5)} ${st.netX} ${st.netY}`}
            fill="none" stroke={ink} strokeWidth={1.8} strokeLinecap="round" opacity={0.8}
          />
        )}

        {/* LE FILET — dans le repere du perso (il le tient, puis il vole, puis il flotte) */}
        {st.netVisible && (
          <g transform={`translate(${st.netX} ${st.netY}) scale(${0.42 + st.netSpread * 0.16})`}>
            <NetShape spread={st.netSpread} inWater={st.netInWater} ink={ink} fish={fish} />
          </g>
        )}

        <Membre ax={sx} ay={sy} bx={armBack.ex} by={armBack.ey} cx={armBack.hx} cy={armBack.hy} w={4} color={ink} opacity={0.75} />
        <Membre ax={sx} ay={sy} bx={armFront.ex} by={armFront.ey} cx={armFront.hx} cy={armFront.hy} w={4} color={ink} />
      </g>
    </g>
  );
};

// ===========================================================================
// LA SCENE
// ===========================================================================
export const PecheurSurpecheStick16x9: React.FC = () => {
  const frame = useCurrentFrame();

  // cycle courant
  const idx = frame < CYCLES[1].t0 ? 0 : frame < CYCLES[2].t0 ? 1 : 2;
  const cycle = CYCLES[idx];
  // la fatigue monte sur la journee (comme PecheurDuree16x9 — le corps dit la duree)
  const fatigue = interpolate(frame, [0, T.dataStart], [0, 1], { extrapolateRight: "clamp" });
  const st = pecheurAt(frame, cycle, fatigue);

  // ---- palette jour -> soir (reprise du proto) ----
  const duskProgress = interpolate(frame, [T.duskStart, T.duskEnd], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });
  const dawnToDay = interpolate(frame, [0, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const skyColor = lerpHex(lerpHex(SKY_DAWN, SKY_DAY, dawnToDay), SKY_DUSK, duskProgress);
  const seaColor = lerpHex(lerpHex(SEA_DAWN, SEA_DAY, dawnToDay), SEA_DUSK, duskProgress);
  const seaColorDeep = lerpHex(seaColor, INK, 0.35);

  // ---- le chalutier grossit : horizon vide -> horizon envahi ----
  const trawlerAppear = interpolate(frame, [CYCLES[0].done, CYCLES[1].cast], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });
  const trawlerGrow = interpolate(frame, [CYCLES[1].cast, T.dataStart], [0.3, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE,
  });
  const trawlerScale = 0.35 + trawlerGrow * 0.8;

  // ---- soleil ----
  const sunX = interpolate(frame, [0, T.dataStart], [280, 1600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sunArc = Math.sin(interpolate(frame, [0, T.dataStart], [0, Math.PI], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const sunY = 260 - sunArc * 90;

  // ---- TANGAGE : une seule houle pilote la pirogue ET le pecheur (ancrage garanti) ----
  const tangage = Math.sin(frame / 44) * 1.5 + Math.sin(frame / 27 + 1.1) * 0.6;
  const houleY = Math.sin(frame / 44 + 0.4) * 5;

  // ⛔ 9e PIEGE — LE BORD DE LA MER QUI ENTRE DANS LE CADRE (vu au rendu v3 : un bloc
  // rectangulaire net coupe l'ecran vers x=1450 en fin de scene).
  // Diagnostic (pas une supposition) : `camAt(frame, 1, 1.3)` translate de -1.3px PAR
  // FRAME, sans jamais boucler. A la frame 1350 la mer est decalee de -1755px ; or son
  // rect fait 4000px depuis x=-800, donc son bord droit (x=3200) arrive a 3200-1755 =
  // 1445 a l'ecran. C'est exactement le bord vu. Le proto d'origine a le meme defaut
  // latent, invisible chez lui parce qu'il basculait en data-viz plus tot (frame 1400).
  // -> La derive doit etre CYCLIQUE : le motif de vagues se repete tous les 200px
  //    (cf. `offset % 200` dans OceanProfondeurVagues), donc un modulo 200 donne
  //    exactement le meme rendu sans jamais sortir le bord du rect du cadre.
  const camSeaOffset = `translate(${-((frame * 1.3) % 200)} 0)`;
  // le bas visuel de la coque (la ou la mer de 1er plan doit passer devant) : origine
  // de la pirogue + sa demi-hauteur reelle (29 unites x scale 1.35 = 39px)
  const hullBottom = objectVisualBottom(PIROGUE_Y + 39, 0);

  // ---- crossfade vers la data-viz ----
  const sceneOpacity = frame < T.dataStart ? 1 : interpolate(frame, [T.dataStart, T.dataFade], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dataOpacity = frame < T.dataStart ? 0 : interpolate(frame, [T.dataStart, T.dataFade], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dataLocalFrame = Math.max(0, frame - (T.dataStart - 20));
  const sceneLabelOpacity = interpolate(frame, [T.dataStart - 60, T.dataStart - 20], [0.75, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dataTitleOpacity = interpolate(frame, [T.dataStart, T.dataStart + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const PECHE_SEGMENTS = [
    { label: "Peche artisanale", value: 0.61, color: "#5e7245" },
    { label: "Flottes semi-industr. + etrangeres", value: 0.39, color: "#8a2b2b" },
  ];

  return (
    <AbsoluteFill style={{ background: DATAVIZ_BG }}>
      <Sequence from={0} durationInFrames={PECHEUR_STICK_FRAMES}>
        <Audio src={staticFile("_shared/audio/sahel-warmap/music/music-C-cordes-minimales.mp3")} volume={0.42} loop />
      </Sequence>
      <Sequence from={0} durationInFrames={T.dataFade}>
        <Audio src={staticFile("_shared/sfx/ambiance/ocean-cargo-ambient.mp3")} volume={0.5} loop />
      </Sequence>

      {frame < T.dataFade && (
        <AbsoluteFill style={{ opacity: sceneOpacity }}>
          <svg viewBox="0 0 1920 1080" width="100%" height="100%">
            <rect x={0} y={0} width={1920} height={1080} fill={skyColor} />

            <SoleilHaloRadial
              cx={sunX} cy={sunY}
              color={lerpHex("#f2c14e", "#e8894a", duskProgress)}
              opacity={1 - duskProgress * 0.15}
              idPrefix="stickSun" ink={INK}
            />

            {[
              { baseX: 500, y: 160, w: 1.0, speed: 0.09, phase: 1 },
              { baseX: 1350, y: 130, w: 0.85, speed: 0.11, phase: 4 },
            ].map((c, k) => {
              const range = 1700;
              const x = 100 + ((((c.baseX - 100 - frame * c.speed) % range) + range) % range);
              const bob2 = Math.sin(frame / 34 + c.phase) * 5;
              const edgeFade = Math.min(1, Math.min(x - 100, 1820 - x) / 150);
              return (
                <g key={k} transform={`translate(${x} ${c.y + bob2}) scale(${c.w * 0.5})`} opacity={0.65 * Math.max(0, edgeFade)}>
                  <CloudQwenGravure ink={INK} />
                </g>
              );
            })}

            <line x1={0} y1={620} x2={1920} y2={620} stroke={INK} strokeWidth={2} opacity={0.35} />

            {/* mer (fond) */}
            <g transform={camSeaOffset}>
              <OceanProfondeurVagues
                frame={frame} part="fond" splitY={hullBottom}
                seaColor={seaColor} seaColorDeep={seaColorDeep} idPrefix="stickOcean"
              />
            </g>

            {/* LE CHALUTIER — POSE SUR L'EAU, donc monte APRES le fond de mer (en v2 il
                etait avant, donc au-dessus de la ligne d'eau = il voguait dans le ciel).
                Il grossit sur un point fixe et descend legerement en grossissant (plus il
                est gros, plus il est proche de nous). Reste DERRIERE la pirogue. */}
            <g
              transform={`translate(1500 ${716 - 26 * (1 - trawlerScale)}) scale(${trawlerScale})`}
              opacity={trawlerAppear}
            >
              <ChalutierGemini idPrefix="stickTrawler" />
            </g>

            {/* ⭐ LA PIROGUE + LE PECHEUR — MEME tangage, MEME houle : c'est ce qui garantit
                que ses pieds ne decollent jamais du fond de la barque (ancrage par construction,
                pas par reglage a l'oeil). */}
            <g transform={`translate(0 ${houleY})`}>
              <g transform={`translate(${PECHEUR_X} ${PIROGUE_Y}) rotate(${tangage}) scale(1.35)`}>
                <PirogueGPT idPrefix="stickPirogue" />
              </g>
              {/* le panier est POSE AU FOND de la pirogue, derriere lui (cote poupe) */}
              <g transform={`translate(${PECHEUR_X - 185} ${PIROGUE_Y - 12}) rotate(${tangage}) scale(0.8)`}>
                <PanierOsierEncre />
              </g>
              <PecheurStick st={st} tangage={tangage} ink={INK} fish={cycle.fish} />
            </g>

            {/* mer (premier plan) — passe devant le bas de la coque */}
            <g transform={camSeaOffset}>
              <OceanProfondeurVagues
                frame={frame} part="premier-plan" splitY={hullBottom}
                seaColor={seaColor} seaColorDeep={seaColorDeep} idPrefix="stickOcean"
              />
            </g>

            <text x={960} y={70} textAnchor="middle" fill={INK} fontFamily="Georgia, serif" fontSize={28} opacity={sceneLabelOpacity}>
              {cycle.label}
            </text>
          </svg>
        </AbsoluteFill>
      )}

      {frame >= T.dataStart - 20 && (
        <AbsoluteFill style={{ opacity: dataOpacity }}>
          <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
            <GridBackground />
            <text x={960} y={90} textAnchor="middle" fill={PARCH} fontSize={36} fontFamily="Georgia, serif" fontWeight="bold" letterSpacing={2} opacity={dataTitleOpacity}>
              QUI CAPTE LA VALEUR DE LA PECHE ?
            </text>
            <line x1={620} y1={108} x2={1300} y2={108} stroke={PARCH_DIM} strokeWidth={1} opacity={0.5 * dataTitleOpacity} />
            <InkDonutChart
              cx={960} cy={520} r={260}
              segments={PECHE_SEGMENTS}
              labelStyle="leader"
              backgroundColor={DATAVIZ_BG}
              backgroundInset={3}
              innerRatio={0.52}
              segmentOpacity={0.82}
              segmentStrokeWidth={2.5}
              startFrame={5}
              springDamping={20}
              frame={dataLocalFrame} fps={30}
              centerText={{ line1: "61%", line2: "valeur pour la peche artisanale" }}
            />
            <text x={960} y={1040} textAnchor="middle" fill={PARCH_DIM} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic">
              Source : ODI, "Distant-water fishing fleets in Senegal" (2024), donnees 2021
            </text>
          </svg>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default PecheurSurpecheStick16x9;
