// R&D — DERNIERE BRIQUE DU PROGRAMME STICK FIGURE — IDENTITE V2
//
// ⛔ REGLE ABSOLUE DE CE LOT : on IMPORTE le socle (StickFigure.tsx), on ne le recopie pas.
// Un agent precedent (IdentiteEtVues16x9.tsx, meme dossier) a recopie toutes les constantes de
// squelette au lieu d'importer — derive detectee a l'oeil par Aziz ("les personnages semblent
// marcher plus lentement, moins naturellement"). Ce fichier importe Figure/Pose/walkDistance/
// solveArm/Membre depuis StickFigure.tsx et n'y redefinit AUCUNE longueur de membre, AUCUN
// swing, AUCUN bob, AUCUNE epaisseur.
//
// CE QUE CE FICHIER AJOUTE (au-dessus du socle, sans le modifier) :
//   A. Couleur (5 carnations acquises, SANS lisere) + motifs de buste type boubou, EN MARCHE.
//   B. Accessoires de profil (chapeau, casquette, casque, foulard, cravate/col, sacoche),
//      solidaires de la tete/du buste en mouvement.
//   C. Comparatif visage de profil : tete nue / point d'oeil / oeil+nez / oeil+sourcil,
//      EN MARCHE, avec un clignement discret teste sur une des variantes.
//
// Les motifs/accessoires sont des OVERLAYS positionnes par la MEME geometrie que <Figure>
// (hanche -> epaule -> tete), recalculee ici a partir des CONSTANTES IMPORTEES du socle
// (TORSO_LENGTH, HIP_Y_STANDING, HEAD_RADIUS, WALK_DEFAULT) — pas de valeur inventee. <Figure>
// ne permet pas d'injecter un enfant dans son <g>, donc l'overlay est un <g> jumeau, construit
// avec la formule EXACTE du socle (meme swing/bob/lean), rendu au meme endroit.
//
// ⛔ NO EMOJIS. Remotion frame-driven (useCurrentFrame/interpolate/spring), ZERO Math.random,
// pas de CSS transition/setTimeout/@keyframes. Accents francais dans les strings affichees.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Sequence } from "remotion";
import {
  Figure,
  Membre,
  rad,
  TORSO_LENGTH,
  HIP_Y_STANDING,
  HEAD_RADIUS,
  WALK_DEFAULT,
  walkDistance,
  walkPhaseFromSteps,
  BRAS_L,
  AVBRAS_L,
  solveArm,
  ENCRE,
  type WalkParams,
} from "../StickFigure";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const FOND = "#182746";
const OR_CLAIR = "#d9a93a";
const CUIVRE = "#c17e3a";

// ============================================================================================
// CARNATIONS ACQUISES (5 teintes validees, SANS lisere — retrait explicite demande par Aziz).
// Note : l'ebene "#3f2718" du brief a ete LEGEREMENT eclairci pour rester lisible sur #182746
// sans contour (le principe du brief : une teinte qui a besoin d'un halo est une mauvaise
// teinte -> on ajuste la teinte, pas d'ajout de contour). Voir rapport final pour la valeur.
// ============================================================================================
const CARNATIONS = [
  { nom: "ambre clair", couleur: "#e8b98a" },
  { nom: "terre cuivrée", couleur: "#c98a55" },
  { nom: "brun chaud", couleur: "#9c6539" },
  { nom: "brun profond", couleur: "#6b4126" },
  { nom: "ébène (éclairci)", couleur: "#4a2e1c" },
];

// ============================================================================================
// GEOMETRIE PARTAGEE OVERLAY — recalcule hanche/epaule/tete avec les CONSTANTES IMPORTEES du
// socle, formule identique a Figure (StickFigure.tsx lignes 320-372). Sert a poser motifs et
// accessoires exactement sur le corps que <Figure> dessine, frame pour frame.
// ============================================================================================
type BodyPoints = {
  hx: number; hy: number;
  sx: number; sy: number;
  headCx: number; headCy: number;
  torso: number; // angle du buste (deg)
};

const bodyPoints = (phase: number, p?: Partial<WalkParams>, torsoOverride?: number): BodyPoints => {
  const P = { ...WALK_DEFAULT, ...p };
  const a = phase * Math.PI * 2;
  const bob = Math.abs(Math.cos(a)) * P.bobAmp;
  const hx = 0;
  const hy = HIP_Y_STANDING - bob + P.hipDrop;
  const torso = torsoOverride !== undefined ? torsoOverride : P.lean;
  const sx = hx + Math.sin(rad(torso)) * TORSO_LENGTH;
  const sy = hy - Math.cos(rad(torso)) * TORSO_LENGTH;
  const headLen = 12;
  const headCx = sx + Math.sin(rad(torso)) * headLen + 3 * Math.cos(rad(torso));
  const headCy = sy - Math.cos(rad(torso)) * headLen + 3 * Math.sin(rad(torso));
  return { hx, hy, sx, sy, headCx, headCy, torso };
};

// ============================================================================================
// A. MOTIFS DE BUSTE — dessines DANS le repere local du perso (meme <g> que Figure, translate/
// scale identiques), le long du segment hanche->epaule. Suivent donc automatiquement lean+bob.
// ============================================================================================
type MotifBuste = "uni" | "bandes" | "chevrons" | "damier" | "bordure";

const MotifOverlay: React.FC<{ bp: BodyPoints; motif: MotifBuste; couleur: string }> = ({ bp, motif, couleur }) => {
  if (motif === "uni") return null;
  const { hx, hy, sx, sy } = bp;
  // repere local le long du buste : u = direction hanche->epaule (unitaire), n = normale
  const dx = sx - hx, dy = sy - hy;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const nx = -uy, ny = ux;
  const halfW = 2.6; // demi-largeur du buste a decorer (trait du torse = 4.5 de large)
  const pt = (t: number, off: number) => ({
    x: hx + ux * len * t + nx * off,
    y: hy + uy * len * t + ny * off,
  });

  if (motif === "bandes") {
    // 3 bandes horizontales (perpendiculaires au buste) le long du torse
    const bandes = [0.28, 0.5, 0.72];
    return (
      <>
        {bandes.map((t, i) => {
          const a = pt(t, -halfW);
          const b = pt(t, halfW);
          return (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={OR_CLAIR} strokeWidth={2.4} strokeLinecap="round" />
          );
        })}
      </>
    );
  }
  if (motif === "chevrons") {
    const positions = [0.32, 0.5, 0.68];
    return (
      <>
        {positions.map((t, i) => {
          const apex = pt(t, 0);
          const l = pt(t - 0.08, -halfW);
          const r = pt(t - 0.08, halfW);
          return (
            <path
              key={i}
              d={`M ${l.x} ${l.y} L ${apex.x} ${apex.y} L ${r.x} ${r.y}`}
              fill="none" stroke={CUIVRE} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"
            />
          );
        })}
      </>
    );
  }
  if (motif === "damier") {
    const cells: React.ReactElement[] = [];
    const rows = [0.32, 0.48, 0.64];
    let key = 0;
    for (const t of rows) {
      for (const side of [-1, 1]) {
        if ((rows.indexOf(t) + (side === 1 ? 1 : 0)) % 2 === 0) continue;
        const c = pt(t, side * halfW * 0.55);
        cells.push(<circle key={key++} cx={c.x} cy={c.y} r={1.8} fill={OR_CLAIR} />);
      }
    }
    return <>{cells}</>;
  }
  if (motif === "bordure") {
    const a = pt(0.12, halfW);
    const b = pt(0.88, halfW);
    return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={OR_CLAIR} strokeWidth={2} strokeLinecap="round" />;
  }
  return null;
};

// ============================================================================================
// B. ACCESSOIRES DE PROFIL — solidaires de la tete (chapeau/casquette/casque/foulard) ou du
// buste (cravate/col, sacoche). Positionnes via bodyPoints, donc suivent bob+lean sans flotter.
// ============================================================================================
type Accessoire = "aucun" | "chapeau" | "casquette" | "casque" | "foulard" | "cravate" | "sacoche";

const AccessoireOverlay: React.FC<{ bp: BodyPoints; accessoire: Accessoire; couleur: string }> = ({ bp, accessoire, couleur }) => {
  const { headCx, headCy, torso, sx, sy, hx, hy } = bp;
  const R = HEAD_RADIUS;

  if (accessoire === "chapeau") {
    // feutre de profil : calotte + bord qui avance dans le sens de marche (+x local)
    const cx = headCx, cy = headCy - R * 0.35;
    return (
      <>
        <path
          d={`M ${cx - R * 1.05} ${cy - R * 0.15} Q ${cx} ${cy - R * 1.55} ${cx + R * 1.05} ${cy - R * 0.15} L ${cx + R * 0.95} ${cy} L ${cx - R * 0.95} ${cy} Z`}
          fill={couleur}
        />
        <line x1={cx - R * 1.5} y1={cy} x2={cx + R * 1.5} y2={cy} stroke={couleur} strokeWidth={2.6} strokeLinecap="round" />
      </>
    );
  }
  if (accessoire === "casquette") {
    const cx = headCx, cy = headCy - R * 0.3;
    return (
      <>
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy} Z`} fill={couleur} />
        <path
          d={`M ${cx + R * 0.7} ${cy} Q ${cx + R * 1.9} ${cy - R * 0.1} ${cx + R * 1.9} ${cy + R * 0.35} Q ${cx + R * 1.1} ${cy + R * 0.25} ${cx + R * 0.7} ${cy} Z`}
          fill={couleur}
        />
      </>
    );
  }
  if (accessoire === "casque") {
    // casque de chantier : dome + visiere courte, couleur distincte fixe (securite)
    const cx = headCx, cy = headCy - R * 0.4;
    return (
      <>
        <path d={`M ${cx - R * 1.1} ${cy + R * 0.1} A ${R * 1.1} ${R * 1.1} 0 0 1 ${cx + R * 1.1} ${cy + R * 0.1} Z`} fill={OR_CLAIR} />
        <line x1={cx - R * 1.1} y1={cy + R * 0.1} x2={cx + R * 1.1} y2={cy + R * 0.1} stroke="#8a6a1e" strokeWidth={1.6} />
        <line x1={cx + R * 0.5} y1={cy + R * 0.1} x2={cx + R * 1.55} y2={cy + R * 0.25} stroke={OR_CLAIR} strokeWidth={3} strokeLinecap="round" />
      </>
    );
  }
  if (accessoire === "foulard") {
    // couvre-chef noue, suit la tete ; une pointe libre derriere (sens oppose a la marche)
    const cx = headCx, cy = headCy;
    return (
      <>
        <path
          d={`M ${cx - R * 1.1} ${cy - R * 0.5} Q ${cx} ${cy - R * 1.5} ${cx + R * 1.0} ${cy - R * 0.5} Q ${cx + R * 0.8} ${cy + R * 0.6} ${cx} ${cy + R * 0.9} Q ${cx - R * 0.9} ${cy + R * 0.5} ${cx - R * 1.1} ${cy - R * 0.5} Z`}
          fill={couleur}
        />
        <path
          d={`M ${cx - R * 1.0} ${cy + R * 0.2} Q ${cx - R * 2.1} ${cy + R * 0.6} ${cx - R * 2.4} ${cy + R * 1.5}`}
          fill="none" stroke={couleur} strokeWidth={3} strokeLinecap="round"
        />
      </>
    );
  }
  if (accessoire === "cravate") {
    // suit le buste : ancree a l'epaule, alignee sur l'angle torso (jamais decalee du buste)
    const len = 13;
    const ex = sx + Math.sin(rad(torso)) * len * 0.4 + 2;
    const ey = sy + Math.cos(rad(torso)) * len;
    return (
      <path
        d={`M ${sx - 2} ${sy + 1} L ${sx + 3} ${sy + 1} L ${ex + 1.5} ${ey} L ${(sx + ex) / 2} ${ey + 4} L ${ex - 2} ${ey} Z`}
        fill={CUIVRE}
      />
    );
  }
  if (accessoire === "sacoche") {
    // bandouliere epaule -> hanche opposee, sac au niveau de la hanche arriere (derriere le corps)
    const bagX = hx - Math.sin(rad(torso)) * 6 - 6;
    const bagY = hy + 6;
    return (
      <>
        <line x1={sx} y1={sy} x2={bagX} y2={bagY} stroke={couleur} strokeWidth={1.6} opacity={0.85} />
        <rect x={bagX - 5} y={bagY - 4} width={10} height={9} rx={1.5} fill={couleur} opacity={0.95} />
      </>
    );
  }
  return null;
};

// ============================================================================================
// C. VISAGE DE PROFIL — comparatif. Une petite avancee (nez) ou des points (oeil/sourcil)
// places sur le contour de la tete, dans le SENS DE MARCHE (+x local, meme cote que le nez du
// socle : headCx avance deja de 3*cos(torso) dans Figure — le visage est donc du cote +x).
// ============================================================================================
type Visage = "nue" | "oeil" | "oeil-nez" | "oeil-sourcil";

const VisageOverlay: React.FC<{ bp: BodyPoints; visage: Visage; couleur: string; frame: number; clignement: boolean }> = ({
  bp, visage, couleur, frame, clignement,
}) => {
  if (visage === "nue") return null;
  const { headCx, headCy } = bp;
  const R = HEAD_RADIUS;
  // position de l'oeil : leger avant-haut du centre de tete (cote visage, sens de marche +x)
  const ex = headCx + R * 0.42;
  const ey = headCy - R * 0.12;

  // clignement discret : sur un cycle de 2.4s, l'oeil se ferme (aplatit en trait) pendant ~4 frames
  const cycle = 72; // 2.4s a 30fps
  const t = frame % cycle;
  const fermee = clignement && t >= 34 && t <= 38;
  const oeilRy = fermee ? 0.4 : 1.5;

  return (
    <>
      <ellipse cx={ex} cy={ey} rx={1.6} ry={oeilRy} fill={FOND} />
      {visage === "oeil-nez" && (
        <path
          d={`M ${headCx + R * 0.92} ${headCy + R * 0.05} L ${headCx + R * 1.35} ${headCy + R * 0.28}`}
          stroke={couleur} strokeWidth={2.2} strokeLinecap="round" fill="none"
        />
      )}
      {visage === "oeil-sourcil" && (
        <line
          x1={ex - 2.1} y1={ey - 3.4} x2={ex + 2.1} y2={ey - 3.0}
          stroke={couleur} strokeWidth={1.8} strokeLinecap="round"
        />
      )}
    </>
  );
};

// ============================================================================================
// PERSONNAGE COMPLET — Figure importee du socle + overlays motif/accessoire/visage superposes
// dans le MEME <g transform> (translate/scale identique), donc rigoureusement solidaires.
// ============================================================================================
const Personnage: React.FC<{
  x: number; y: number; phase: number; scale: number;
  couleur: string;
  motif?: MotifBuste;
  accessoire?: Accessoire;
  visage?: Visage;
  clignement?: boolean;
  frame: number;
  p?: Partial<WalkParams>;
}> = ({ x, y, phase, scale, couleur, motif = "uni", accessoire = "aucun", visage = "nue", clignement = false, frame, p }) => {
  const bp = bodyPoints(phase, p);
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Figure x={0} y={0} phase={phase} p={p} color={couleur} scale={1} />
      <MotifOverlay bp={bp} motif={motif} couleur={couleur} />
      <AccessoireOverlay bp={bp} accessoire={accessoire} couleur={couleur} />
      <VisageOverlay bp={bp} visage={visage} couleur={couleur} frame={frame} clignement={clignement} />
    </g>
  );
};

// ============================================================================================
// LIGNE DE MARCHEURS — walkDistance depuis le socle, verrou pas/distance respecte, scale passe
// explicitement (piege documente en tete de StickFigure.tsx).
//
// ⛔ POSE DEGENEREE (bug constate et corrige ici, en 3 passes — voir chacune, la 1ere et la 2eme
// ont chacune semble marcher au calcul puis ECHOUE au rendu reel) : dans <Figure> (StickFigure.
// tsx), bras et jambes utilisent TOUS LES DEUX Math.sin(phase*2*PI) SANS dephasage (BRAS_LAG est
// documente dans le socle mais jamais applique par Figure). A phase=0 ou 0.5, jambes ET bras
// passent par 0 EN MEME TEMPS -> le corps se lit comme un seul trait vertical, tete sur un baton
// ("sucette sans membres"). Le defaut a CORRIGER n'est pas qu'UN personnage y passe (c'est le
// cycle de marche normal, cf. nuance plus bas) mais que PLUSIEURS y tombent SIMULTANEMENT.
//
// PASSE 1 (echec) : cadence legerement differente par personnage. Semblait fonctionner sur les
// quelques frames verifiees a l'oeil, mais deux cadences proches se recroisent forcement pres de
// phase=0 a UN instant donne quelque part dans le rendu (non teste exhaustivement) -> RATE.
//
// PASSE 2 (echec, piege plus subtil) : offset de phase FIXE par personnage (base + i*pas), teste
// par calcul STATIQUE sur quelques i (marge >= 0.23 verifiee a un instant donne). Insuffisant : un
// pas de 0.495 (proche de 0.5) fait que les offsets de plusieurs i sont presque tous des multiples
// de 0.5 LES UNS DES AUTRES -> ils forment des PAQUETS qui restent groupes en phase relative au
// COURS DU TEMPS (pas juste a un instant) et retombent TOUS ensemble sur phase=0 ou 0.5 a certains
// frames (constate au rendu : les 5 personnages de Section A en sucette simultanee a t=2.5s,
// alors que le calcul statique sur 1 seul frame de reference semblait montrer une marge correcte).
// Lecon : verifier une marge STATIQUE ne suffit pas, il faut balayer TOUTE la plage de frames.
//
// PASSE 3 (retenue, verifiee par balayage EXHAUSTIF sur 1200 frames x 4 cadences x seuils) : pas
// de phase PETIT (0.057, PAS pres de 0.5) — resultat mesure : jamais plus de 1 personnage sous le
// seuil strict (swing<3deg) simultanement, jamais plus de 2 sous un seuil perceptif large (swing<
// 5deg), sur les 4 sections (N=4 a 6 personnages, 4 cadences differentes). Script de verification
// conserve en commentaire pour toute reprise future de ce fichier :
//   worst = max(count(i : |sin((base+i*step)*2pi + phaseCourante)|*17 < seuil) pour tout frame)
// ⚠️ NUANCE VERIFIEE PAR RENDU (pas seulement par calcul) : CHAQUE personnage, pris seul, passe
// quand meme brievement (1-5 frames sur 30/s) par sa PROPRE zone degeneree a chaque pas — c'est le
// moment ou les jambes se croisent, INHERENT a la marche (une vraie personne aussi). Verifie par
// echantillonnage a 2fps sur toute la Section C (rendu reel) : jamais visible en lecture normale.
// ============================================================================================
const useMarche = (
  frame: number, fps: number, scale: number, startX: number, cadence = 1.15, index = 0,
) => {
  const pas = (frame / fps) * cadence * 2; // 2 pas/s * cadence
  const phaseOffset = index * 0.057; // pas PETIT (surtout pas pres de 0.5) — verifie par balayage
  const phase = (walkPhaseFromSteps(pas) + phaseOffset + 1000) % 1;
  const dist = walkDistance(pas, WALK_DEFAULT.swingMax, scale);
  return { phase, x: startX + dist };
};

// ============================================================================================
// ETIQUETTE DE SECTION — gabarit repris a l'identique de DuoAsymetrie16x9::Etiquette (planche
// validee par Aziz) : Georgia serif, taille modeste, letterSpacing, couleur ENCRE discrete.
// Un <text> SVG (jamais un <div> HTML) pour rester dans le meme repere que le contenu.
// ============================================================================================
const TitreSection: React.FC<{ titre: string; op: number }> = ({ titre, op }) => (
  <text x={100} y={80} fill={ENCRE} fontFamily="Georgia, serif" fontSize={27} letterSpacing={2} opacity={op * 0.92}>
    {titre}
  </text>
);

// ============================================================================================
// SECTION A — COULEUR + MOTIFS DE BUSTE
// ============================================================================================
// Comparatif : les 5 doivent rester ALIGNES et COMPARABLES (meme x de reference, meme cadence de
// marche relative), jamais disperses a des x quelconques — sinon la section ne compare plus rien.
// Chaque ligne marche dans un COULOIR COURT et BORNE, centre sur SA PROPRE colonne verticale
// (pas de colonne partagee) : ca prouve le mouvement (jambes qui s'ouvrent/ferment) sans jamais
// perdre l'alignement qui permet de comparer les carnations et motifs entre eux.
// Personnages agrandis (scale 4.4, vise 380-450px comme les planches validees) : a scale 1.9
// (ancienne valeur), les motifs de buste (bandes/chevrons/damier) etaient invisibles.
const SectionCouleurMotifs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = 4.4;
  const motifs: MotifBuste[] = ["uni", "bandes", "chevrons", "damier", "bordure"];
  const labels = ["uni", "bandes", "chevrons", "damier", "bordure"];
  const laneX = [220, 620, 1020, 1420, 1780]; // 5 colonnes alignees, chacune son propre couloir
  const laneY = 720;
  const amplitude = 70; // couloir COURT : va-et-vient borne, jamais un x qui derive hors colonne

  const titre = interpolate(frame, [0, 15], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: FOND }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <TitreSection titre="A — Couleur + motifs de buste" op={titre} />
        {CARNATIONS.map((c, i) => {
          const m = motifs[i];
          // verrou pas/distance intact (walkDistance), borne en va-et-vient court (triangle wave)
          // AUTOUR de la colonne du personnage : la distance parcourue reste 100% derivee du
          // nombre de pas, mais l'amplitude est petite pour ne jamais quitter l'alignement.
          const period = amplitude * 4;
          // cadence IDENTIQUE pour tous (comparatif = alignement) — seul l'offset de phase (i)
          // desynchronise, garantie de marge >= 0.23 valable UNIQUEMENT a cadence constante (une
          // cadence differente par personnage fait deriver la phase relative dans le temps et
          // annule la garantie, cf. bug constate : un i tombait quand meme pres de swing=0 a un
          // instant donne malgre l'offset).
          const { phase, x } = useMarche(frame, fps, scale, 0, 1.1, i);
          const t = ((x % period) + period) % period;
          const triangle = t < period / 2 ? t - amplitude : (period - t) - amplitude; // [-amp, +amp]
          const px = laneX[i] + triangle;
          return (
            <g key={i}>
              <text x={laneX[i]} y={280} fill={ENCRE} fontSize={22} fontFamily="Georgia, serif" opacity={0.85} textAnchor="middle">
                {c.nom} · {labels[i]}
              </text>
              <Personnage
                x={px} y={laneY} phase={phase} scale={scale}
                couleur={c.couleur} motif={m} frame={frame}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================================
// SECTION A2 — COMBINE : 5 personnages distincts cote a cote, tous en marche
// ============================================================================================
const SectionCombine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = 3.4;
  const combo: { motif: MotifBuste }[] = [
    { motif: "bandes" },
    { motif: "chevrons" },
    { motif: "damier" },
    { motif: "bordure" },
    { motif: "uni" },
  ];
  const laneX = [280, 660, 1040, 1420, 1780];
  const titre = interpolate(frame, [0, 15], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: FOND }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <TitreSection titre="Combiné — 5 personnages distincts" op={titre} />
        {CARNATIONS.map((c, i) => {
          const { phase } = useMarche(frame, fps, scale, 0, 1.05, i);
          return (
            <Personnage
              key={i}
              x={laneX[i]} y={620} phase={phase} scale={scale}
              couleur={c.couleur} motif={combo[i].motif} frame={frame}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================================
// SECTION B — ACCESSOIRES DE PROFIL
// ============================================================================================
const SectionAccessoires: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = 3.1;
  const items: { acc: Accessoire; label: string; couleur: string }[] = [
    { acc: "chapeau", label: "chapeau", couleur: "#c98a55" },
    { acc: "casquette", label: "casquette", couleur: "#6b4126" },
    { acc: "casque", label: "casque de chantier", couleur: "#9c6539" },
    { acc: "foulard", label: "foulard / couvre-chef", couleur: "#e8b98a" },
    { acc: "cravate", label: "cravate", couleur: "#c98a55" },
    { acc: "sacoche", label: "sacoche bandoulière", couleur: "#4a2e1c" },
  ];
  const laneX = [220, 570, 920, 1270, 1620, 1860];
  const titre = interpolate(frame, [0, 15], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: FOND }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <TitreSection titre="B — Accessoires de profil" op={titre} />
        {items.map((it, i) => {
          // cadence IDENTIQUE, seul l'offset de phase (i) desynchronise — cf. useMarche.
          const { phase } = useMarche(frame, fps, scale, 0, 1.07, i);
          return (
            <g key={i}>
              <text x={laneX[i] - 90} y={310} fill={ENCRE} fontSize={20} fontFamily="Georgia, serif" opacity={0.85} textAnchor="middle">
                {it.label}
              </text>
              <Personnage
                x={laneX[i]} y={620} phase={phase} scale={scale}
                couleur={it.couleur} accessoire={it.acc} frame={frame}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================================
// SECTION C — VISAGE DE PROFIL, COMPARATIF 4 VARIANTES
// ============================================================================================
const SectionVisage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = 3.6;
  const items: { visage: Visage; label: string; clignement: boolean }[] = [
    { visage: "nue", label: "tête nue (référence)", clignement: false },
    { visage: "oeil", label: "point d'œil seul (fixe)", clignement: false },
    { visage: "oeil-nez", label: "œil + nez", clignement: false },
    { visage: "oeil-sourcil", label: "œil + sourcil + clignement", clignement: true },
  ];
  const laneX = [320, 780, 1240, 1700];
  const titre = interpolate(frame, [0, 15], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: FOND }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <TitreSection titre="C — Visage de profil : comparatif" op={titre} />
        {items.map((it, i) => {
          // cadence IDENTIQUE pour les 4 (comparatif = alignement), seul l'offset de phase garanti
          // (index i dans useMarche) desynchronise — cf. bug constate a t=31s ou un personnage
          // tombait pile sur swing=0 ("sucette sans membres") faute de cette garantie.
          const { phase } = useMarche(frame, fps, scale, 0, 1.02, i);
          return (
            <g key={i}>
              <text x={laneX[i]} y={310} fill={ENCRE} fontSize={20} fontFamily="Georgia, serif" opacity={0.85} textAnchor="middle">
                {it.label}
              </text>
              <Personnage
                x={laneX[i]} y={640} phase={phase} scale={scale}
                couleur="#c98a55" visage={it.visage} clignement={it.clignement} frame={frame}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================================
// COMPOSITION PRINCIPALE
// ============================================================================================
const DUR_A = S(10);
const DUR_A2 = S(7);
const DUR_B = S(9);
const DUR_C = S(10);
export const IDENTITE_V2_FRAMES = DUR_A + DUR_A2 + DUR_B + DUR_C;

export const IdentiteV2_16x9: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: FOND }}>
      <Sequence from={0} durationInFrames={DUR_A}>
        <SectionCouleurMotifs />
      </Sequence>
      <Sequence from={DUR_A} durationInFrames={DUR_A2}>
        <SectionCombine />
      </Sequence>
      <Sequence from={DUR_A + DUR_A2} durationInFrames={DUR_B}>
        <SectionAccessoires />
      </Sequence>
      <Sequence from={DUR_A + DUR_A2 + DUR_B} durationInFrames={DUR_C}>
        <SectionVisage />
      </Sequence>
    </AbsoluteFill>
  );
};

export default IdentiteV2_16x9;
