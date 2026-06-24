/**
 * SceneDetteV3 — "le piege de la dette" (terrain 2), Senegal Petrole & Gaz V3-REFONTE, scene 4.
 *
 * Ecrite DEPUIS LA VOIX (forced-align V3, segment 243.26s -> ~291.0s, ~47.7s).
 * Plan + jury (Gemini+Kimi+DeepSeek) + storyboard valide Aziz : V3-REFONTE/PLAN-SCENE-4-DETTE.md.
 *
 * INTENTION (1 verbe) : SIPHONNER. Le Senegal a un fonds protege (le FONSIS) ou va l'argent du petrole,
 * verrouille. MAIS la dette publique (132% du PIB) pousse a PERCER ce fonds et le VIDER pour payer les
 * factures. Le FMI alerte. "Un fonds qu'on peut vider ne protege plus rien."
 *
 * CONCEPT (tranche Aziz 2026-06-24, baril REFUSE car redondant) : LE BARRAGE / LA DIGUE.
 * Vue en COUPE PLATE 16:9 HORIZONTALE. Un mur-barrage or "FONSIS" au CENTRE separe deux liquides :
 *   - GAUCHE : la reserve tricolore Senegal (le fonds protege) = le drapeau-liquide.
 *   - DROITE : l'eau rouge sombre de la dette, qui MONTE et deborde la crete (cote 132%).
 * 4 temps : (1) protege [mur intact, reserve pleine, dette basse] -> (2) la dette monte/deborde, 132% s'inscrit
 *   -> (3) breche dans le mur, le tricolore s'ecoule vers un bassin BUDGET, cloche FMI -> (4) reserve a sec, mur casse, rouge submerge.
 *
 * Registre : navy #16213a + grille or (= fond des scenes 1b/3). Remotion pur + SVG, 100% code (0 asset).
 * Reutilise la grammaire de SceneContratV3 : GridBackground, gradients drapeau/cost, clipPath niveau, fissures
 * stroke-dashoffset, count-up, marqueurs, SFX Sequence, musique.
 */
import React from "react";
import {
  AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring,
} from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";

const { fontFamily: BEBAS } = loadBebas();

const AUDIO_START = 243.26; // la scene dette commence a 243.26s ("Mais le terrain le plus piegeux")
const NAVY = "#16213a", GOLD = "#c8a951", GOLD_HI = "#e8c472", IVORY = "#f2efe6";
const STEEL_LO = "#1a1f28";
const RED_DEBT = "#7a2a22"; // dette (sombre, sourd, non criard)
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920, H = 1080;
// drapeau Senegal (la reserve protegee = le fonds)
const SEN = { a: "#00853F", b: "#FDEF42", c: "#E31B23" };

// ── frames (= (t_abs - 243.26) * 30) ─────────────────────────────────────────
const F_FONSIS    = 57;   // "le FONSIS" (le mur/label apparait)
const F_VERROU    = 175;  // "verrouillee avant meme le premier baril" (mur scelle, contour or solide)
const F_PAPIER    = 399;  // "Sur le papier, bonne nouvelle" (RESPIRATION : stable, halo pulse)
const F_PIEGE     = 480;  // "Mais voila le piege" (la dette rouge commence a monter fort)
const F_132       = 527;  // "cent trente-deux pour cent" (132% s'inscrit, la dette deborde la crete) MOMENT FORT
const F_ETOUFFE   = 697;  // "etouffe deja le budget" (le mur vibre, fissures, niveau reserve baisse un peu)
const F_PIOCHER   = 783;  // "piocher dans l'argent du petrole" (BRECHE : le tricolore s'ecoule vers BUDGET)
const F_FMI       = 983;  // "Le FMI tire la sonnette d'alarme" (cloche FMI)
const F_NORVEGE   = 1128; // "plus souples que la Norvege" (ligne pointillee SEUIL NORVEGE, niveau deja en-dessous)
const F_VIDER     = 1282; // "Un fonds qu'on peut vider... ne protege plus rien" (reserve a sec, mur casse, rouge submerge)
const F_FIN       = 1389; // "Reste le dernier terrain... loin de Dakar" (teaser, fade)
const END         = 1440;

export const SceneDetteV3: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")}
        startFrom={Math.round(AUDIO_START * fps)}
        endAt={Math.round(291.2 * fps)}
      />
      {/* Musique de fond — continuite (meme piste que gisements/comparaison/contrat), 5.5%, fade-out 3s */}
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
      <BarrageViz />
    </AbsoluteFill>
  );
};

// ── Fond navy + grille or qui respire (repris VERBATIM du PivotRevenu/SceneContratV3) ─────────
// s'AFFOLE au climax du siphon (translation + opacite accelerees) — idee jury retenue.
const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const panic = interpolate(frame, [F_PIOCHER, F_VIDER], [0, 1], clamp); // 0->1 pendant la vidange
  const breath = 0.08 + 0.03 * Math.sin(frame / 60) + 0.04 * panic * Math.abs(Math.sin(frame / 8));
  const shiftY = (frame * (0.12 + panic * 0.5)) % 60;
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

// ── Titre discret (haut), indicateur "2/3 terrains" (continuite avec sc.3 qui avait 1/3) ─────
const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [F_FONSIS - 20, F_FONSIS + 20, F_FIN, END], [0, 1, 1, 0], clamp);
  const terrainsOp = interpolate(frame, [F_FONSIS, F_FONSIS + 30], [0, 1], clamp);
  return (
    <>
      <div style={{
        position: "absolute", top: 60, width: "100%", textAlign: "center",
        opacity: op, color: IVORY, fontFamily: BEBAS, fontSize: 40, letterSpacing: "0.14em",
      }}>
        LA DETTE
      </div>
      {/* 3 tirets : terrains 1-2 pleins or, 3 fantome */}
      <div style={{
        position: "absolute", top: 124, width: "100%", display: "flex",
        justifyContent: "center", gap: 12, opacity: terrainsOp,
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: i === 1 ? 56 : 30, height: 4, borderRadius: 2,
            background: i <= 1 ? GOLD : "rgba(242,239,230,0.22)",
          }} />
        ))}
      </div>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  BarrageViz — coupe plate 16:9. Reserve tricolore (gauche) | mur FONSIS (centre) | dette rouge (droite).
//  La dette monte et deborde (132%), le mur se fissure, une breche vide la reserve vers BUDGET.
// ════════════════════════════════════════════════════════════════════════════
const BarrageViz: React.FC = () => {
  const frame = useCurrentFrame();

  // ── geometrie du bassin (coupe horizontale large) ──
  const floorY = 880;          // fond du bassin (sol commun)
  const ceilY = 300;           // haut utile (la crete du mur est ici)
  const basinH = floorY - ceilY; // hauteur utile pour les niveaux (580px)
  const wallCx = 960;          // mur au CENTRE
  const wallTopW = 46, wallBotW = 92; // mur en trapeze (plus large en bas = barrage)
  const leftEdge = 150, rightEdge = 1770; // bords gauche/droite du bassin

  // ── niveaux (en fraction de basinH depuis le sol) ──
  // RESERVE tricolore (gauche) : pleine au depart (~0.92), reste stable, baisse un peu a "etouffe",
  // puis CHUTE par la breche a partir de F_PIOCHER, a sec a F_VIDER.
  const senFull = 0.92;
  const senAfterEtouffe = interpolate(frame, [F_ETOUFFE, F_PIOCHER], [senFull, senFull - 0.06], clamp);
  const senDrain = interpolate(frame, [F_PIOCHER, F_VIDER], [1, 0], clamp); // 1->0 multiplicateur
  const senLevelFrac = Math.max(0, senAfterEtouffe * (frame < F_PIOCHER ? 1 : senDrain));
  // ondulation de surface (vie permanente)
  const senWave = senLevelFrac > 0.02 ? 5 + 2 * Math.sin(frame / 18) : 0;
  const senSurfaceY = floorY - basinH * senLevelFrac - senWave * 0;

  // DETTE rouge (droite) : basse au depart (~0.32), MONTE fort a F_PIEGE, deborde la crete a F_132,
  // puis reste haute. Apres F_VIDER, elle "submerge" (passe par-dessus le mur vers la gauche).
  const debtBase = 0.30;
  const debtRise = interpolate(frame, [F_PIEGE, F_132], [debtBase, 1.02], clamp); // deborde la crete (>1)
  const debtLevelFrac = Math.min(1.08, debtRise);
  const debtSurfaceY = floorY - basinH * debtLevelFrac;

  // crete du mur (cote 132%) : Y de reference = sommet du mur
  const crestY = ceilY;

  // ── mur : pression (vibration) quand la dette pousse, fissures qui se tracent ──
  const wallShake = frame >= F_132 && frame < F_VIDER
    ? 2.2 * Math.sin(frame / 3) * interpolate(frame, [F_PIEGE, F_132, F_VIDER], [0, 1, 0.4], clamp)
    : 0;
  // rupture du mur : a F_VIDER le mur se fend (les 2 moities s'ecartent legerement + opacite breche)
  const wallBreak = interpolate(frame, [F_VIDER, F_VIDER + 60], [0, 1], clamp);

  // breche au pied du mur (cote gauche) : s'ouvre a F_PIOCHER
  const breachOpen = interpolate(spring({ frame: frame - F_PIOCHER, fps: 30, config: { damping: 14, stiffness: 120 }, durationInFrames: 20 }), [0, 1], [0, 1], clamp);

  // clip de la zone bassin (pour que les liquides ne debordent pas du cadre)
  const basinClip = "barrage-basin";
  // chemins du mur (trapeze)
  const wallPath = (dx: number) =>
    `M ${wallCx - wallTopW / 2 + dx} ${crestY} L ${wallCx + wallTopW / 2 + dx} ${crestY}` +
    ` L ${wallCx + wallBotW / 2 + dx} ${floorY} L ${wallCx - wallBotW / 2 + dx} ${floorY} Z`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        {/* drapeau Senegal horizontal (3 bandes verticales) pour la reserve gauche */}
        <linearGradient id="senFlagH" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={SEN.a} /><stop offset="33%" stopColor={SEN.a} />
          <stop offset="33.01%" stopColor={SEN.b} /><stop offset="66%" stopColor={SEN.b} />
          <stop offset="66.01%" stopColor={SEN.c} /><stop offset="100%" stopColor={SEN.c} />
        </linearGradient>
        <linearGradient id="debtV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9a3528" /><stop offset="100%" stopColor={RED_DEBT} />
        </linearGradient>
        <linearGradient id="wallV" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8a6d2c" /><stop offset="45%" stopColor={GOLD} />
          <stop offset="55%" stopColor={GOLD_HI} /><stop offset="100%" stopColor="#8a6d2c" />
        </linearGradient>
        <clipPath id={basinClip}>
          <rect x={leftEdge} y={ceilY - 120} width={rightEdge - leftEdge} height={floorY - (ceilY - 120)} />
        </clipPath>
        {/* clip moitie gauche (reserve) et moitie droite (dette), separes par le mur */}
        <clipPath id="leftHalf"><rect x={leftEdge} y={0} width={wallCx - leftEdge} height={H} /></clipPath>
        <clipPath id="rightHalf"><rect x={wallCx} y={0} width={rightEdge - wallCx} height={H} /></clipPath>
      </defs>

      {/* ombre/sol du bassin */}
      <rect x={leftEdge} y={floorY} width={rightEdge - leftEdge} height={6} fill={GOLD} opacity={0.5} />

      <g clipPath={`url(#${basinClip})`}>
        {/* fantome gris de la reserve videe (ce qu'il y avait) — apparait quand le niveau chute */}
        {frame >= F_PIOCHER && senLevelFrac < 0.85 && (
          <rect x={leftEdge} y={floorY - basinH * senFull} width={wallCx - leftEdge}
            height={basinH * senFull} fill="rgba(150,150,160,0.10)" />
        )}
        {/* ── RESERVE tricolore (gauche) ── */}
        <g clipPath="url(#leftHalf)">
          <LiquidBody
            surfaceY={senSurfaceY} floorY={floorY} x0={leftEdge} x1={wallCx + 4}
            fill="url(#senFlagH)" wave={senWave} frame={frame} phase={0}
          />
          {/* etoile verte flottant sur la reserve (tant qu'il y a du liquide) */}
          {senLevelFrac > 0.12 && (
            <Star cx={leftEdge + (wallCx - leftEdge) * 0.42} cy={senSurfaceY + 46} r={26} color={SEN.a} />
          )}
        </g>

        {/* ── DETTE rouge (droite) ── */}
        <g clipPath="url(#rightHalf)">
          <LiquidBody
            surfaceY={debtSurfaceY} floorY={floorY} x0={wallCx - 4} x1={rightEdge}
            fill="url(#debtV)" wave={6} frame={frame} phase={1.7}
          />
        </g>

        {/* ── DEBORDEMENT : quand le mur cede (apres F_VIDER), le rouge passe a gauche par-dessus la crete ── */}
        {wallBreak > 0.02 && (
          <LiquidBody
            surfaceY={crestY + 4} floorY={crestY + 24 + 40 * wallBreak}
            x0={leftEdge} x1={leftEdge + (wallCx - leftEdge) * wallBreak}
            fill="url(#debtV)" wave={6} frame={frame} phase={0.9}
          />
        )}

        {/* ── filet tricolore qui s'ecoule par la BRECHE vers le bassin BUDGET ── */}
        {breachOpen > 0.05 && senLevelFrac > 0.02 && (
          <DrainStream wallCx={wallCx} wallBotW={wallBotW} floorY={floorY} open={breachOpen} frame={frame} />
        )}
      </g>

      {/* ── MUR-BARRAGE (2 moities qui s'ecartent a la rupture) ── */}
      <g transform={`translate(${wallShake}, 0)`}>
        {/* moitie gauche du mur */}
        <g transform={`translate(${-wallBreak * 14}, ${wallBreak * 6}) rotate(${-wallBreak * 3} ${wallCx} ${floorY})`}>
          <path d={wallPath(0)} fill="url(#wallV)" clipPath="url(#leftHalf)" stroke={GOLD_HI} strokeWidth={1.5} />
        </g>
        {/* moitie droite du mur */}
        <g transform={`translate(${wallBreak * 14}, ${wallBreak * 6}) rotate(${wallBreak * 3} ${wallCx} ${floorY})`}>
          <path d={wallPath(0)} fill="url(#wallV)" clipPath="url(#rightHalf)" stroke={GOLD_HI} strokeWidth={1.5} />
        </g>
        {/* fissures sur le mur (se tracent a partir de F_ETOUFFE) */}
        <WallCracks wallCx={wallCx} crestY={crestY} floorY={floorY} frame={frame} />
        {/* label FONSIS grave sur le mur */}
        <FonsisLabel wallCx={wallCx} y={(crestY + floorY) / 2} frame={frame} breakOp={1 - wallBreak} />
        {/* breche (trou) au pied du mur cote gauche */}
        {breachOpen > 0.05 && (
          <ellipse cx={wallCx - wallBotW / 2 + 6} cy={floorY - 70} rx={10 * breachOpen} ry={18 * breachOpen}
            fill={STEEL_LO} stroke={RED_DEBT} strokeWidth={2} />
        )}
      </g>

      {/* ── LIGNE DE CRETE + cote "132%" (la dette deborde) ── */}
      <CrestReadout crestY={crestY} leftEdge={leftEdge} rightEdge={rightEdge} frame={frame} />

      {/* ── SEUIL NORVEGE : ligne pointillee legere, HAUT, le niveau reserve est deja en-dessous ── */}
      <NorvegeSeuil leftEdge={leftEdge} wallCx={wallCx} y={ceilY + 120} frame={frame} />

      {/* ── bassin BUDGET (recoit le filet) ── */}
      <BudgetBasin wallCx={wallCx} floorY={floorY} frame={frame} drainP={1 - senDrain} />

      {/* ── cloche / alerte FMI (zone libre : haut-centre, AU-DESSUS de la dette, loin du readout 132%) ── */}
      <FmiAlert x={1180} y={210} frame={frame} />
    </svg>
  );
};

// ── corps de liquide : rect plein + bord haut ondule (Math.sin) ──────────────
const LiquidBody: React.FC<{ surfaceY: number; floorY: number; x0: number; x1: number; fill: string; wave: number; frame: number; phase: number }> =
({ surfaceY, floorY, x0, x1, fill, wave, frame, phase }) => {
  if (floorY - surfaceY <= 1) return null;
  // bord haut ondule : echantillonner une sinusoide
  const steps = 24;
  let d = `M ${x0} ${floorY} L ${x0} ${surfaceY}`;
  for (let i = 0; i <= steps; i++) {
    const x = x0 + (x1 - x0) * (i / steps);
    const y = surfaceY + Math.sin(frame / 16 + phase + i * 0.5) * wave;
    d += ` L ${x} ${y}`;
  }
  d += ` L ${x1} ${floorY} Z`;
  return <path d={d} fill={fill} />;
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

// label FONSIS grave sur le mur (plaque or)
const FonsisLabel: React.FC<{ wallCx: number; y: number; frame: number; breakOp: number }> = ({ wallCx, y, frame, breakOp }) => {
  const appear = interpolate(frame, [F_FONSIS, F_FONSIS + 25], [0, 1], clamp);
  return (
    <g opacity={appear * breakOp} transform={`translate(${wallCx}, ${y})`}>
      <rect x={-58} y={-18} width={116} height={34} rx={4} fill={STEEL_LO} stroke={GOLD} strokeWidth={1.5} />
      <text x={0} y={8} textAnchor="middle" fill={GOLD_HI} fontFamily={BEBAS} fontSize={26} letterSpacing="3">FONSIS</text>
    </g>
  );
};

// fissures sur le mur (stroke-dashoffset) — anticipent la rupture
const WallCracks: React.FC<{ wallCx: number; crestY: number; floorY: number; frame: number }> = ({ wallCx, crestY, floorY, frame }) => {
  const traceP = interpolate(frame, [F_ETOUFFE, F_PIOCHER], [0, 1], clamp);
  const cracks = [
    `M ${wallCx + 4} ${crestY + 80} l -14 60 l 10 50 l -8 70`,
    `M ${wallCx - 8} ${crestY + 200} l 16 50 l -10 60`,
    `M ${wallCx + 10} ${floorY - 180} l -12 60 l 8 50`,
  ];
  const LEN = 260;
  return (
    <g>
      {cracks.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#3a2410" strokeWidth={2.4} strokeLinecap="round"
          strokeDasharray={LEN} strokeDashoffset={LEN * (1 - Math.max(0, Math.min(1, traceP * 1.2 - i * 0.15)))} opacity={0.8} />
      ))}
    </g>
  );
};

// ligne de crete + cote "132%" (count-up). La dette deborde cette ligne.
const CrestReadout: React.FC<{ crestY: number; leftEdge: number; rightEdge: number; frame: number }> = ({ crestY, rightEdge, frame }) => {
  const appear = interpolate(frame, [F_132 - 10, F_132 + 20], [0, 1], clamp);
  // count-up 0 -> 132 sur ~50f, overshoot leger
  const raw = interpolate(frame, [F_132, F_132 + 50], [0, 132], clamp);
  const over = spring({ frame: frame - F_132, fps: 30, config: { damping: 9, stiffness: 180 }, durationInFrames: 30 });
  const val = Math.round(raw);
  // overshoot leger, BORNE pour ne pas pousser le texte hors cadre (scale max ~1.05)
  const scale = interpolate(over, [0, 1], [0.78, 1], clamp);
  // tremble pendant le bras de pression
  const tremble = frame >= F_132 && frame < F_VIDER ? Math.sin(frame / 2.4) * 2 : 0;
  // ancre du readout : x fixe a droite (anchor end), le scale se fait depuis ce coin (pas de debordement)
  const anchorX = rightEdge - 30;
  return (
    <g opacity={appear}>
      {/* ligne pointillee de crete sur toute la largeur droite */}
      <line x1={300} x2={rightEdge + 20} y1={crestY} y2={crestY}
        stroke={RED_DEBT} strokeWidth={3} strokeDasharray="14 10" opacity={0.85} />
      {/* cote 132% a droite, au niveau de la crete (ancre coin droit, scale depuis ce coin) */}
      <g transform={`translate(${anchorX + tremble}, ${crestY})`}>
        <text x={0} y={-14} textAnchor="end" fill={GOLD_HI} fontFamily={BEBAS}
          fontSize={120 * scale}>{val}%</text>
        <text x={0} y={26} textAnchor="end" fill="rgba(242,239,230,0.7)" fontFamily={BEBAS}
          fontSize={28} letterSpacing="3">DETTE / PIB</text>
      </g>
    </g>
  );
};

// SEUIL NORVEGE : ligne pointillee legere (touche, pas une saynete)
const NorvegeSeuil: React.FC<{ leftEdge: number; wallCx: number; y: number; frame: number }> = ({ leftEdge, wallCx, y, frame }) => {
  const op = interpolate(frame, [F_NORVEGE, F_NORVEGE + 30, F_VIDER, F_VIDER + 40], [0, 0.7, 0.7, 0], clamp);
  return (
    <g opacity={op}>
      <line x1={leftEdge} x2={wallCx - 30} y1={y} y2={y} stroke={GOLD_HI} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.85} />
      <text x={leftEdge + 8} y={y - 14} fill={GOLD_HI} fontFamily={BEBAS} fontSize={30} letterSpacing="2.5">SEUIL NORVÈGE</text>
    </g>
  );
};

// filet tricolore qui s'ecoule par la breche vers le bassin BUDGET (sous le mur, cote gauche)
const DrainStream: React.FC<{ wallCx: number; wallBotW: number; floorY: number; open: number; frame: number }> = ({ wallCx, wallBotW, floorY, open, frame }) => {
  const x = wallCx - wallBotW / 2 + 4;
  const startY = floorY - 70;
  const endY = floorY + 60; // descend sous le sol vers le bassin (remonte avec le bassin)
  // petites gouttes tricolores qui descendent
  const drops = [0, 1, 2, 3].map((i) => {
    const t = ((frame - F_PIOCHER + i * 14) % 56) / 56;
    return { y: startY + (endY - startY) * t, c: [SEN.a, SEN.b, SEN.c, SEN.a][i], op: open * (1 - Math.abs(t - 0.5)) };
  });
  return (
    <g>
      {/* jet continu */}
      <rect x={x - 4} y={startY} width={8} height={(endY - startY) * open} fill={SEN.b} opacity={0.55 * open} rx={4} />
      {drops.map((d, i) => (
        <circle key={i} cx={x + Math.sin(frame / 8 + i) * 3} cy={d.y} r={5} fill={d.c} opacity={d.op} />
      ))}
    </g>
  );
};

// bassin BUDGET sous le mur (recoit le filet, se remplit un peu)
const BudgetBasin: React.FC<{ wallCx: number; floorY: number; frame: number; drainP: number }> = ({ wallCx, floorY, frame, drainP }) => {
  const appear = interpolate(frame, [F_PIOCHER - 10, F_PIOCHER + 20], [0, 1], clamp);
  // bassin remonte dans la safe zone (label final <= ~975, bord 100px respecte) — fix review Gemini
  const bx = wallCx - 150, by = floorY + 22, bw = 160, bh = 56;
  const fillH = bh * Math.min(1, drainP * 0.9);
  return (
    <g opacity={appear}>
      {/* bac */}
      <path d={`M ${bx} ${by} L ${bx + 14} ${by + bh} L ${bx + bw - 14} ${by + bh} L ${bx + bw} ${by} `}
        fill="none" stroke={IVORY} strokeWidth={2.5} opacity={0.55} />
      {/* niveau recu */}
      <rect x={bx + 12} y={by + bh - fillH} width={bw - 24} height={fillH} fill={SEN.b} opacity={0.5} />
      <text x={bx + bw / 2} y={by + bh + 30} textAnchor="middle" fill="rgba(242,239,230,0.7)" fontFamily={BEBAS} fontSize={26} letterSpacing="2">BUDGET</text>
    </g>
  );
};

// cloche / alerte FMI (forme SVG maison, halo rouge pulse)
const FmiAlert: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => {
  const enter = spring({ frame: frame - F_FMI, fps: 30, config: { damping: 11, stiffness: 160 }, durationInFrames: 24 });
  const op = interpolate(frame, [F_FMI, F_FMI + 20, F_VIDER + 40, END], [0, 1, 1, 0], clamp);
  if (frame < F_FMI - 5) return null;
  const pulse = 1 + 0.12 * Math.max(0, Math.sin((frame - F_FMI) / 5));
  const scale = interpolate(enter, [0, 1], [0, 1], clamp) * pulse;
  return (
    <g opacity={op} transform={`translate(${x}, ${y}) scale(${scale})`} style={{ transformOrigin: "center" }}>
      {/* halo */}
      <circle cx={0} cy={0} r={52} fill={RED_DEBT} opacity={0.18 + 0.1 * Math.sin((frame - F_FMI) / 5)} />
      {/* cloche (path maison) */}
      <path d="M 0 -30 C 18 -30 26 -16 26 2 L 32 14 L -32 14 L -26 2 C -26 -16 -18 -30 0 -30 Z"
        fill="none" stroke="#d4604f" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M -7 14 a 7 7 0 0 0 14 0" fill="none" stroke="#d4604f" strokeWidth={3.5} />
      <text x={0} y={48} textAnchor="middle" fill="#e08a7c" fontFamily={BEBAS} fontSize={30} letterSpacing="3">FMI</text>
    </g>
  );
};

// ── SFX cales millimetre (Sequence). Scene Remotion : pas de son camera/map. ──
const SFX = {
  fill: "_shared/sfx/ui/sfx-baril-fill.mp3",        // la reserve se pose / remplissage
  lock: "_shared/sfx/ui/stamp-dossier.mp3",          // verrouillage du mur (FONSIS scelle)
  tick: "_shared/sfx/data/stat-tick.mp3",            // 132% s'inscrit
  impact: "_shared/sfx/impact/impact.mp3",           // la dette deborde (BOOM)
  tension: "_shared/sfx/impact/tension-pulse.mp3",   // pression de la dette qui monte
  drain: "_shared/sfx/sfx-cost-recovery-drain.mp3",  // la breche / vidange
};
const Sfx: React.FC<{ at: number; src: string; volume?: number; dur?: number }> = ({ at, src, volume = 0.5, dur = 30 }) => (
  <Sequence from={at} durationInFrames={dur} layout="none"><Audio src={staticFile(src)} volume={volume} /></Sequence>
);
const SceneSFX: React.FC = () => (
  <>
    {/* le mur/reserve se met en place */}
    <Sfx at={F_FONSIS} src={SFX.fill} volume={0.38} dur={90} />
    {/* verrouillage (mur scelle) */}
    <Sfx at={F_VERROU} src={SFX.lock} volume={0.4} dur={36} />
    {/* la dette monte : pression sourde */}
    <Sfx at={F_PIEGE} src={SFX.tension} volume={0.42} dur={90} />
    {/* 132% : tick + impact de debordement */}
    <Sfx at={F_132} src={SFX.tick} volume={0.45} />
    <Sfx at={F_132 + 6} src={SFX.impact} volume={0.5} dur={40} />
    {/* breche / vidange */}
    <Sfx at={F_PIOCHER} src={SFX.drain} volume={0.4} dur={120} />
  </>
);

export const SCENE_DETTE_V3_FRAMES = END;
export default SceneDetteV3;
