/**
 * SceneContratV3 — "le contrat" (terrain 1), Senegal Petrole & Gaz V3-REFONTE, scene 3.
 *
 * Ecrite DEPUIS LA VOIX (forced-align V3, segment 188.66s -> 241.3s, ~52.6s).
 * Plan + synthese jury (Gemini+Kimi+DeepSeek) : V3-REFONTE/PLAN-SCENE-3-CONTRAT.md.
 *
 * INTENTION (1 verbe) : RONGER. Le "60%" que l'Etat ANNONCE est rogne par les regles du contrat :
 * Woodside recupere ses milliards d'infrastructures (cost recovery) AVANT de partager -> le 60% devient
 * incertain ("??%"). Bras de fer Etat vs compagnie.
 *
 * METAPHORE (validee Aziz 2026-06-24) : le BARIL reste baril (continuite max avec le pivot 60% de la scene
 * gisements, PAS de morph abstrait). Une LAME sombre "COST RECOVERY" descend depuis le haut dans la zone
 * drapeau et la COMPRIME -> le niveau Senegal baisse, le 60% -> "??%". Bras de fer = le niveau OSCILLE.
 *
 * Registre : navy #16213a + grille or (= fond du pivot baril). Remotion pur + SVG. PAS de Mapbox.
 * Continuite : reprend BarilJaugeIcon (geometrie) + fond grille du PivotRevenu.
 */
import React from "react";
import {
  AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring,
} from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";

const { fontFamily: BEBAS } = loadBebas();

const AUDIO_START = 188.66; // la scene contrat commence a 188.66s ("Et au Senegal")
const NAVY = "#16213a", GOLD = "#c8a951", GOLD_HI = "#e8c472", IVORY = "#f2efe6";
const STEEL = "#3a4150", STEEL_LO = "#1a1f28";
const RED_COST = "#7a2a22"; // cost recovery (sombre, sourd, non criard)
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920, H = 1080;
// drapeau Senegal
const SEN = { a: "#00853F", b: "#FDEF42", c: "#E31B23" };

// ── frames (= (t_abs - 188.66) * 30) ─────────────────────────────────────────
const F_TERRAINS  = 142;  // "sur trois terrains"
const F_CONTRAT   = 226;  // "le contrat lui-meme"
const F_60        = 286;  // "soixante pour cent"
const F_ESTIM     = 349;  // "mais c'est une estimation"
const F_ECRITE    = 487;  // "ecrite dans des contrats" (clauses se tracent)
const F_PUBLICS   = 730;  // "pas tous publics" (caviardage)
const F_SONKO     = 961;  // "Sonko, interet national" (force Etat pousse)
const F_WOODSIDE  = 1120; // "Woodside negocient" (lame commence)
const F_MILLIARDS = 1315; // "recuperer ses milliards d'abord" (LAME monte fort, 60->??)
const F_BRASDEFER = 1492; // "bras de fer" (oscillation)
const F_FIN       = 1580; // "si les regles tiennent... ou pas" (fige + fade)
const END         = 1640;

export const SceneContratV3: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={Math.round(AUDIO_START * fps)} endAt={Math.round(241.5 * fps)} />
      {/* Musique de fond — continuite (meme piste que gisements/comparaison), 5.5%, fade-out 3s */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        startFrom={Math.round(AUDIO_START * fps)}
        volume={(f) => {
          const fadeStart = END - 90;
          if (f >= fadeStart) return 0.055 * Math.max(0, 1 - (f - fadeStart) / 90);
          return 0.055;
        }}
      />
      <SceneSFX />
      <GridBackground />
      <Title />
      <ContratViz />
    </AbsoluteFill>
  );
};

// ── Fond navy + grille or qui respire (repris du PivotRevenu) ────────────────
const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  // respiration lente de l'opacite + micro-translation (vie permanente, anti-statique)
  const breath = 0.08 + 0.03 * Math.sin(frame / 60);
  const shiftY = (frame * 0.12) % 60;
  return (
    <AbsoluteFill style={{
      backgroundColor: NAVY,
      backgroundImage:
        `linear-gradient(rgba(200,169,81,${breath}) 1px, transparent 1px),` +
        `linear-gradient(90deg, rgba(200,169,81,${breath}) 1px, transparent 1px)`,
      backgroundSize: "60px 60px, 60px 60px",
      backgroundPosition: `0px ${shiftY}px, 0px 0px`,
    }} />
  );
};

// ── Titre + indicateur "1/3 terrains" (discret, haut) ────────────────────────
const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [F_CONTRAT - 20, F_CONTRAT + 20, F_FIN, END], [0, 1, 1, 0], clamp);
  // 3 terrains : 1 actif (or), 2 fantomes
  const terrainsOp = interpolate(frame, [F_TERRAINS, F_TERRAINS + 30], [0, 1], clamp);
  return (
    <>
      {/* "TERRAIN 1 / 3 — LE CONTRAT" */}
      <div style={{
        position: "absolute", top: 60, width: "100%", textAlign: "center",
        opacity: op, color: IVORY, fontFamily: BEBAS, fontSize: 40, letterSpacing: "0.14em",
      }}>
        LE CONTRAT
      </div>
      {/* 3 tirets : terrain 1 plein or, 2-3 fantomes */}
      <div style={{
        position: "absolute", top: 124, width: "100%", display: "flex",
        justifyContent: "center", gap: 12, opacity: terrainsOp,
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: i === 0 ? 56 : 30, height: 4, borderRadius: 2,
            background: i === 0 ? GOLD : "rgba(242,239,230,0.22)",
          }} />
        ))}
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  ContratViz — le baril 60% + lame cost recovery qui monte + 60%->??% + bras de fer.
//  viewBox 1920x1080. Baril central-gauche, chiffre a droite (comme le pivot precedent).
// ════════════════════════════════════════════════════════════════════════════
const ContratViz: React.FC = () => {
  const frame = useCurrentFrame();

  // ── geometrie baril (reprise BarilJaugeIcon, agrandie/centree) ──
  const cx = 720, cy = 560, w = 420, h = 560;
  const left = cx - w / 2, right = cx + w / 2, top = cy - h / 2, bottom = cy + h / 2;
  const ellipseRy = w * 0.10;

  // ── ratios animes ──
  // niveau Senegal de depart = 60%. La lame cost recovery descend du HAUT de la zone drapeau,
  // comprimant le drapeau : le niveau "haut du drapeau" descend de 60% vers ~28%.
  const senTop = 60;   // sommet du drapeau (en % depuis le bas) au depart
  // la lame monte/descend : avant F_WOODSIDE le drapeau occupe 0->60%. Cost recovery ronge a partir de F_MILLIARDS.
  const fillProg = interpolate(frame, [0, 70], [0, 1], clamp); // remplissage initial du baril a 60%
  const senLevelBase = senTop * fillProg;

  // cost recovery : la lame descend dans la zone drapeau a partir de F_WOODSIDE, fort a F_MILLIARDS
  const costProg = interpolate(frame, [F_WOODSIDE, F_MILLIARDS, F_MILLIARDS + 90], [0, 0.55, 1], clamp);
  const costEat = costProg * 32; // ronge jusqu'a 32 points (60 -> 28)

  // bras de fer : oscillation du niveau apres F_BRASDEFER
  const osc = frame >= F_BRASDEFER && frame < F_FIN
    ? 2.6 * Math.sin((frame - F_BRASDEFER) / 4) * interpolate(frame, [F_FIN - 40, F_FIN], [1, 0], clamp)
    : 0;
  // force Etat (Sonko) : petit rebond vers le haut a F_SONKO (l'Etat pousse)
  const etatPush = interpolate(frame, [F_SONKO, F_SONKO + 30, F_WOODSIDE], [0, 3, 0], clamp);

  const senLevel = Math.max(6, senLevelBase - costEat + osc + etatPush); // % final du drapeau Senegal
  const senCutY = bottom - (h * senLevel) / 100;       // sommet du drapeau
  const costCutY = bottom - (h * (senLevel + costEat * (costEat > 0.5 ? 1 : 0))) / 100; // bas de la lame = sommet drapeau ; lame au-dessus

  // chiffre : "60%" fixe tant que pas ronge, puis "??%" quand la lame mord (apres F_MILLIARDS)
  const showUncertain = frame >= F_MILLIARDS + 40;

  const clipId = "baril-contrat-body";

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="senFlagV" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={SEN.a} /><stop offset="33%" stopColor={SEN.a} />
          <stop offset="33.01%" stopColor={SEN.b} /><stop offset="66%" stopColor={SEN.b} />
          <stop offset="66.01%" stopColor={SEN.c} /><stop offset="100%" stopColor={SEN.c} />
        </linearGradient>
        <linearGradient id="steelV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a5266" /><stop offset="50%" stopColor={STEEL} /><stop offset="100%" stopColor={STEEL_LO} />
        </linearGradient>
        <linearGradient id="costV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9a3528" /><stop offset="100%" stopColor={RED_COST} />
        </linearGradient>
        <clipPath id={clipId}>
          <path d={`
            M ${left} ${top + ellipseRy}
            Q ${left} ${top - ellipseRy} ${cx} ${top - ellipseRy}
            Q ${right} ${top - ellipseRy} ${right} ${top + ellipseRy}
            L ${right} ${bottom - ellipseRy}
            Q ${right} ${bottom + ellipseRy} ${cx} ${bottom + ellipseRy}
            Q ${left} ${bottom + ellipseRy} ${left} ${bottom - ellipseRy} Z`} />
        </clipPath>
      </defs>

      {/* document-contrat (bloc net a gauche) + caviardage + cadenas = "pas public" sans texte */}
      <ContractDoc frame={frame} />

      {/* ombre portee */}
      <ellipse cx={cx} cy={bottom + 34} rx={w * 0.55} ry={20} fill="rgba(0,0,0,0.45)" />

      {/* CORPS BARIL */}
      <g clipPath={`url(#${clipId})`}>
        {/* zone vide haute = metal */}
        <rect x={left - 10} y={top - 30} width={w + 20} height={costCutY - top + 30} fill="url(#steelV)" />
        {/* LAME cost recovery (rouge sombre) entre costCutY et senCutY */}
        {costEat > 0.5 && (
          <rect x={left - 10} y={costCutY} width={w + 20} height={Math.max(0, senCutY - costCutY)} fill="url(#costV)" />
        )}
        {/* drapeau Senegal (la part reelle restante) du senCutY au bas */}
        <rect x={left - 10} y={senCutY} width={w + 20} height={bottom - senCutY + 30} fill="url(#senFlagV)" />
        {/* etoile sur le drapeau */}
        {senLevel >= 14 && <Star cx={cx} cy={(senCutY + bottom) / 2} r={Math.min(w * 0.07, (bottom - senCutY) * 0.32)} color={SEN.a} />}
        {/* cerclages metal */}
        {[0.18, 0.5, 0.82].map((p, i) => (
          <line key={i} x1={left} x2={right} y1={top + h * p} y2={top + h * p} stroke="rgba(0,0,0,0.4)" strokeWidth={3} />
        ))}
      </g>

      {/* dessus du baril */}
      <ellipse cx={cx} cy={top} rx={w / 2} ry={ellipseRy} fill={STEEL_LO} stroke={GOLD} strokeWidth={2} opacity={0.95} />
      <ellipse cx={cx} cy={top} rx={w / 2 - 8} ry={ellipseRy - 4} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
      {/* contours lateraux */}
      <line x1={left} x2={left} y1={top} y2={bottom} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
      <line x1={right} x2={right} y1={top} y2={bottom} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />

      {/* ligne de niveau Senegal (or) — vibre pendant le bras de fer */}
      <line x1={left - 14} x2={right + 14} y1={senCutY} y2={senCutY} stroke={GOLD} strokeWidth={13} strokeOpacity={0.4} strokeLinecap="round" />
      <line x1={left - 14} x2={right + 14} y1={senCutY} y2={senCutY} stroke={GOLD_HI} strokeWidth={5} strokeLinecap="round" />

      {/* (le libelle COST RECOVERY a ete retire : le marqueur WOODSIDE pointe deja la lame rouge,
          eviter la surcharge de texte — decision Aziz) */}

      {/* CHIFFRE a droite : "60% ANNONCÉ" FIXE (l'annonce ne bouge pas, c'est un chiffre fige)
          -> bascule a "??% PART RÉELLE ?" quand la lame mord (la realite devient incertaine). */}
      <PctReadout x={1340} y={cy} uncertain={showUncertain} frame={frame} />

      {/* marqueurs acteurs RATTACHES au baril : Woodside designe la LAME (ce qu'il prend),
          L'ÉTAT designe le DRAPEAU (ce qui reste). Role mecanique clair (decision Aziz). */}
      <ActorMarkers cx={cx} left={left} right={right} senCutY={senCutY} costCutY={costCutY}
        bottom={bottom} costEat={costEat} frame={frame} />
    </svg>
  );
};

// etoile drapeau
const Star: React.FC<{ cx: number; cy: number; r: number; color: string }> = ({ cx, cy, r, color }) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.4;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    pts.push(`${cx + Math.cos(a) * radius},${cy + Math.sin(a) * radius}`);
  }
  return <polygon points={pts.join(" ")} fill={color} opacity={0.92} />;
};

// DOCUMENT-CONTRAT (un seul bloc net, a gauche) : lignes alignees comme un vrai contrat,
// dont une PARTIE se NOIRCIT franchement + CADENAS = "pas public" SANS un mot ecrit (decision Aziz).
const ContractDoc: React.FC<{ frame: number }> = ({ frame }) => {
  const DX = 200, DY = 340, DW = 300, DH = 400; // position/taille du document (a gauche du baril)
  const appear = interpolate(frame, [F_ECRITE, F_ECRITE + 30], [0, 1], clamp);
  const groupOp = interpolate(frame, [F_ECRITE, F_ECRITE + 30, F_FIN, END], [0, 1, 1, 0], clamp);
  const scaleIn = interpolate(spring({ frame: frame - F_ECRITE, fps: 30, config: { damping: 18, stiffness: 120 }, durationInFrames: 26 }), [0, 1], [0.9, 1], clamp);
  // les lignes du contrat se tracent (stroke-dashoffset simule par largeur croissante)
  const lineRows = [0, 1, 2, 3, 4, 5, 6, 7]; // 8 lignes
  const traceP = interpolate(frame, [F_ECRITE, F_ECRITE + 50], [0, 1], clamp);
  // caviardage : a F_PUBLICS, la moitie basse du doc se noircit franchement + cadenas apparait
  const redactP = interpolate(spring({ frame: frame - F_PUBLICS, fps: 30, config: { damping: 16, stiffness: 200 }, durationInFrames: 18 }), [0, 1], [0, 1], clamp);
  const lockP = interpolate(spring({ frame: frame - (F_PUBLICS + 6), fps: 30, config: { damping: 11, stiffness: 240 }, durationInFrames: 22 }), [0, 1], [0, 1], clamp);

  return (
    <g opacity={groupOp} transform={`translate(${DX}, ${DY}) scale(${scaleIn})`} style={{ transformOrigin: `${DX + DW / 2}px ${DY + DH / 2}px` }}>
      {/* papier du document (navy clair, liseré or) */}
      <rect x={0} y={0} width={DW} height={DH} rx={6} fill="#1e2c47" stroke={GOLD} strokeWidth={1.5} opacity={0.9 * appear} />
      {/* en-tete (bandeau or) */}
      <rect x={0} y={0} width={DW} height={36} rx={6} fill={GOLD} opacity={0.22 * appear} />
      <rect x={18} y={15} width={120} height={6} rx={3} fill={GOLD} opacity={0.8 * appear} />
      {/* lignes de clauses (se tracent) */}
      {lineRows.map((i) => {
        const y = 70 + i * 38;
        const full = i % 3 === 0 ? DW - 80 : DW - 40;
        return <rect key={i} x={20} y={y} width={full * traceP} height={5} rx={2.5}
          fill="rgba(242,239,230,0.55)" />;
      })}
      {/* CAVIARDAGE : la moitie basse se noircit (les clauses "pas publiques") */}
      <rect x={8} y={70 + 4 * 38 - 8} width={(DW - 16) * redactP} height={DH - (70 + 4 * 38 - 8) - 14}
        rx={4} fill="#0a0f1d" opacity={0.95} />
      {/* CADENAS au centre du caviardage (un seul symbole, "pas public" sans texte) */}
      {redactP > 0.3 && (
        <g transform={`translate(${DW / 2}, ${70 + 6 * 38}) scale(${lockP})`} opacity={lockP}>
          <rect x={-22} y={-6} width={44} height={36} rx={6} fill="none" stroke={GOLD} strokeWidth={3.5} />
          <path d={`M -13 -6 L -13 -20 A 13 13 0 0 1 13 -20 L 13 -6`} fill="none" stroke={GOLD} strokeWidth={3.5} />
          <circle cx={0} cy={10} r={4.5} fill={GOLD} />
        </g>
      )}
    </g>
  );
};

// chiffre : "60% ANNONCÉ" FIXE -> "??% PART RÉELLE ?" quand la lame mord
const PctReadout: React.FC<{ x: number; y: number; uncertain: boolean; frame: number }> = ({ x, y, uncertain, frame }) => {
  const appear = interpolate(frame, [F_60, F_60 + 20], [0, 1], clamp);
  // tremble quand "estimation" (F_ESTIM) et pendant le bras de fer
  const tremble = (frame >= F_ESTIM && frame < F_ECRITE) || (frame >= F_BRASDEFER && frame < F_FIN)
    ? Math.sin(frame / 2.2) * 2.5 : 0;
  return (
    <g opacity={appear} transform={`translate(${x + tremble}, ${y})`}>
      <text x={0} y={0} textAnchor="middle" fill={GOLD} fontFamily={BEBAS} fontSize={150}
        opacity={uncertain ? 0.6 : 1}>
        {uncertain ? "??%" : "60%"}
      </text>
      {/* sous-libelle : "annoncé" (fixe) puis "réel ?" (la realite devient incertaine) */}
      <text x={0} y={56} textAnchor="middle" fill="rgba(242,239,230,0.6)" fontFamily={BEBAS} fontSize={30} letterSpacing="3">
        {uncertain ? "PART RÉELLE ?" : "ANNONCÉ"}
      </text>
    </g>
  );
};

// marqueurs acteurs RATTACHES au baril : une accolade/trait relie le NOM a SA zone du baril.
// Woodside -> la LAME rouge (ce qu'il prend en premier) · L'ÉTAT -> le DRAPEAU (ce qui reste).
const ActorMarkers: React.FC<{ cx: number; left: number; right: number; senCutY: number; costCutY: number; bottom: number; costEat: number; frame: number }> = ({ cx, left, right, senCutY, costCutY, bottom, costEat, frame }) => {
  const senOp = interpolate(frame, [F_SONKO, F_SONKO + 25], [0, 1], clamp);
  const wsOp = interpolate(frame, [F_WOODSIDE, F_WOODSIDE + 25], [0, 1], clamp);
  const senMidY = (senCutY + bottom) / 2; // centre de la part Senegal (drapeau)
  const costMidY = (costCutY + senCutY) / 2; // centre de la lame cost recovery
  const lx = left - 40;  // accolade gauche pour l'Etat
  const rx = right + 40; // accolade droite pour Woodside
  return (
    <>
      {/* L'ÉTAT -> drapeau (gauche, or) */}
      <g opacity={senOp}>
        <line x1={left} y1={senMidY} x2={lx} y2={senMidY} stroke={GOLD} strokeWidth={2} opacity={0.7} />
        <circle cx={lx} cy={senMidY} r={6} fill={GOLD} />
        <text x={lx - 14} y={senMidY + 7} textAnchor="end" fill={IVORY} fontFamily={BEBAS} fontSize={26} letterSpacing="2">L'ÉTAT</text>
      </g>
      {/* WOODSIDE -> lame rouge (droite, acier) — apparait avec la lame */}
      {costEat > 1 && (
        <g opacity={wsOp}>
          <line x1={right} y1={costMidY} x2={rx} y2={costMidY} stroke="#c97a6a" strokeWidth={2} opacity={0.7} />
          <circle cx={rx} cy={costMidY} r={6} fill="#c97a6a" />
          <text x={rx + 14} y={costMidY + 7} textAnchor="start" fill="rgba(242,239,230,0.85)" fontFamily={BEBAS} fontSize={26} letterSpacing="2">WOODSIDE</text>
        </g>
      )}
    </>
  );
};

// ── SFX cales millimetre (Sequence). PAS de son de camera/zoom map (hors-sujet, scene Remotion). ──
const SFX = {
  fill: "_shared/sfx/ui/sfx-baril-fill.mp3",            // baril qui se remplit (debut)
  tick: "_shared/sfx/data/stat-tick.mp3",               // chiffre 60% s'inscrit
  lock: "_shared/sfx/ui/stamp-dossier.mp3",             // cadenas / caviardage "pas public"
  drain: "_shared/sfx/sfx-cost-recovery-drain.mp3",     // LAME cost recovery descend (genere)
  tension: "_shared/sfx/sfx-tension-tug.mp3",           // bras de fer (genere, remplace le swoosh map)
};
const Sfx: React.FC<{ at: number; src: string; volume?: number; dur?: number }> = ({ at, src, volume = 0.5, dur = 30 }) => (
  <Sequence from={at} durationInFrames={dur} layout="none"><Audio src={staticFile(src)} volume={volume} /></Sequence>
);
const SceneSFX: React.FC = () => (
  <>
    {/* le baril se REMPLIT a 60% au debut (moment sonore avant manque) */}
    <Sfx at={2} src={SFX.fill} volume={0.4} dur={70} />
    {/* le 60% s'inscrit */}
    <Sfx at={F_60} src={SFX.tick} volume={0.45} />
    {/* cadenas : le contrat se ferme (pas public) */}
    <Sfx at={F_PUBLICS} src={SFX.lock} volume={0.42} dur={36} />
    {/* LA LAME cost recovery descend et siphonne (le moment fort) */}
    <Sfx at={F_MILLIARDS} src={SFX.drain} volume={0.5} dur={66} />
    {/* bras de fer : tension sourde (PAS le swoosh map) */}
    <Sfx at={F_BRASDEFER} src={SFX.tension} volume={0.4} dur={54} />
  </>
);

export const SCENE_CONTRAT_V3_FRAMES = END;
export default SceneContratV3;
