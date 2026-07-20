/**
 * SceneDetteV3 — "le piege de la dette" (terrain 2), Senegal Petrole & Gaz V3-REFONTE, scene 4.
 *
 * Ecrite DEPUIS LA VOIX (forced-align V3, segment 243.26s -> 288.7s, ~45.4s).
 * Coupe a 288.7s : fin NETTE sur "...ne protege plus rien" (mot a 288.34s + 0.36s de souffle). La phrase
 * "Reste le dernier terrain... loin de Dakar" (289.58s+) est l'AMORCE de la scene 5, PAS la fin de la 4
 * (sinon l'audio coupait en plein milieu de cette phrase a 291.2s — raccord casse, retour Aziz 2026-06-25).
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
// La rupture (wallBreak + fondu fissures) se termine a F_VIDER+60 = 1342. Le mot "rien" finit a frame 1352.
const F_FIN       = 1342; // debut du fade de sortie (apres la fin de l'effondrement, avant la coupe audio)
const END         = 1363; // 288.7s : coupe nette apres le verdict (~45.4s). La suite = amorce scene 5.

export const SceneDetteV3: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")}
        startFrom={Math.round(AUDIO_START * fps)}
        endAt={Math.round(288.7 * fps)}
      />
      {/* Musique de fond — REDEMARREE au DEBUT de la piste (startFrom=0) a l'entree de la scene 4 :
          la portion 243s+ de music-A s'emballe et concurrence la voix (retour Aziz) -> on reprend la
          partie calme du debut. fade-IN 1.5s (raccord doux depuis la scene 3) + fade-OUT 3s a la fin. */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        startFrom={0}
        volume={(f) => {
          const fadeIn = interpolate(f, [0, 45], [0, 1], clamp);
          const fadeStart = END - 90;
          const fadeOut = f >= fadeStart ? Math.max(0, 1 - (f - fadeStart) / 90) : 1;
          return 0.055 * fadeIn * fadeOut;
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

      </g>

      {/* ── filet tricolore qui s'ecoule par la BRECHE vers BUDGET (HORS clip bassin = ecoulement continu) ── */}
      {breachOpen > 0.05 && senLevelFrac > 0.02 && (
        <DrainStream wallCx={wallCx} wallBotW={wallBotW} floorY={floorY} open={breachOpen} frame={frame} budgetY={floorY + 96} />
      )}

      {/* ── MUR-BARRAGE — a la rupture, la MOITIE GAUCHE (cote Senegal) DISPARAIT (plus rien ne protege,
            idee Aziz), pendant que la moitie droite (cote dette) reste. PAS de 2 moities qui s'ecartent. ── */}
      <g transform={`translate(${wallShake}, 0)`}>
        {/* moitie gauche (cote Senegal) : s'effondre/disparait a F_VIDER (fade + leger affaissement) */}
        <g transform={`translate(0, ${wallBreak * 30})`} opacity={1 - wallBreak}>
          <path d={wallPath(0)} fill="url(#wallV)" clipPath="url(#leftHalf)" stroke={GOLD_HI} strokeWidth={1.5} />
        </g>
        {/* moitie droite (cote dette) : RESTE en place */}
        <g>
          <path d={wallPath(0)} fill="url(#wallV)" clipPath="url(#rightHalf)" stroke={GOLD_HI} strokeWidth={1.5} />
        </g>
        {/* fissures sur le mur (se tracent a F_ETOUFFE) — DISPARAISSENT avec la moitie gauche du mur (retour Aziz).
            Le fondu suit wallBreak avec un leger retard pour laisser voir la cassure NETTE avant l'effacement. */}
        <g opacity={1 - interpolate(frame, [F_VIDER + 20, F_VIDER + 60], [0, 1], clamp)}>
          <WallCracks wallCx={wallCx} crestY={crestY} floorY={floorY} frame={frame} />
        </g>
        {/* label FONSIS grave sur le mur */}
        <FonsisLabel wallCx={wallCx} y={(crestY + floorY) / 2} frame={frame} breakOp={1 - wallBreak} />
        {/* CADENAS or : se pose a F_VERROU ("verrouille"), SAUTE a F_PIOCHER (on perce le fonds) */}
        <FonsisLock wallCx={wallCx} y={crestY + 64} frame={frame} />
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

      {/* ── alerte FMI : STATIQUE au-dessus du mur FONSIS (il surveille le fonds — idee Aziz) ── */}
      <FmiAlert x={wallCx} y={crestY - 78} frame={frame} />
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
// CADENAS or sur le mur : se pose (spring overshoot + halo) a F_VERROU, SAUTE/s'ejecte a F_PIOCHER.
const FonsisLock: React.FC<{ wallCx: number; y: number; frame: number }> = ({ wallCx, y, frame }) => {
  if (frame < F_VERROU - 10) return null;
  // pose : tombe d'en haut avec rebond
  const drop = spring({ frame: frame - F_VERROU, fps: 30, config: { damping: 10, stiffness: 200 }, durationInFrames: 26 });
  const dropY = interpolate(drop, [0, 1], [-70, 0], clamp);
  const appear = interpolate(frame, [F_VERROU - 10, F_VERROU + 6], [0, 1], clamp);
  // saut a F_PIOCHER : s'ejecte vers le haut-droite + rotation + fade
  const jump = interpolate(frame, [F_PIOCHER, F_PIOCHER + 28], [0, 1], clamp);
  const jumpY = -90 * jump, jumpX = 50 * jump, rot = 120 * jump, op = (1 - jump) * appear;
  // halo respirant tant que verrouille
  const halo = frame < F_PIOCHER ? 0.3 + 0.15 * Math.sin(frame / 14) : 0;
  return (
    <g transform={`translate(${wallCx + jumpX}, ${y + dropY + jumpY}) rotate(${rot})`} opacity={op}>
      <circle r={26} fill={GOLD} opacity={halo} />
      {/* anse */}
      <path d="M -11 -4 L -11 -16 A 11 11 0 0 1 11 -16 L 11 -4" fill="none" stroke={GOLD_HI} strokeWidth={4} />
      {/* corps */}
      <rect x={-15} y={-4} width={30} height={26} rx={5} fill={GOLD} stroke={GOLD_HI} strokeWidth={1.5} />
      <circle cx={0} cy={7} r={3.5} fill={STEEL_LO} />
      <rect x={-1.6} y={7} width={3.2} height={9} rx={1.5} fill={STEEL_LO} />
    </g>
  );
};

// fissure SPECTACULAIRE (technique pièce d'or 2-faces, ProtoEffect_Fracture) : zigzag avec jitter
// perpendiculaire seedé + branches. Trait NOIR épais qui GROSSIT à mesure que la dette pousse.
function jaggedCrack(x0: number, y0: number, x1: number, y1: number, segs: number, amp: number, seed: number): string {
  let d = `M ${x0} ${y0}`;
  const dx = x1 - x0, dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len, py = dx / len; // perpendiculaire
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const bx = x0 + dx * t, by = y0 + dy * t;
    // jitter pseudo-aleatoire deterministe (pas de Math.random — interdit Remotion)
    const j = (Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453 % 1) * amp - amp / 2;
    const taper = i === segs ? 0 : 1; // converge au bout
    d += ` L ${bx + px * j * taper} ${by + py * j * taper}`;
  }
  return d;
}
const WallCracks: React.FC<{ wallCx: number; crestY: number; floorY: number; frame: number }> = ({ wallCx, crestY, floorY, frame }) => {
  // trace progressif F_ETOUFFE->F_PIOCHER (fines lezardes qui anticipent), PUIS a la rupture (F_VIDER) la
  // FISSURE CENTRALE devient NETTE et marquee : le mur se SEPARE EN DEUX AU MILIEU (retour Aziz, regression v2->v3).
  const traceP = interpolate(frame, [F_ETOUFFE, F_PIOCHER], [0, 1], clamp);
  // pic d'eclatement cale PILE sur la rupture (comme en v2) : la faille s'ouvre franchement au moment ou le mur cede.
  const burst = interpolate(frame, [F_VIDER - 18, F_VIDER + 18], [0, 1], clamp);
  const midY = (crestY + floorY) / 2;
  // fissure maitresse verticale + 2 branches obliques (technique fracturePath)
  const cracks = [
    { d: jaggedCrack(wallCx + 2, crestY + 30, wallCx - 6, floorY - 20, 11, 26, 3.1), w: 3.2 },
    { d: jaggedCrack(wallCx + 2, midY - 40, wallCx + 34, midY + 60, 7, 18, 7.7), w: 2.2 },
    { d: jaggedCrack(wallCx - 2, midY + 30, wallCx - 30, floorY - 50, 7, 18, 5.3), w: 2.2 },
  ];
  const LEN = 420;
  // FISSURE CENTRALE DE SEPARATION : une faille verticale nette plein centre (crete -> sol), qui s'OUVRE
  // (largeur) a la rupture pour donner la lecture "le mur se fend en deux au milieu". Distincte des lezardes.
  const splitCrack = jaggedCrack(wallCx, crestY + 6, wallCx, floorY - 6, 14, 16, 9.4);
  const splitWidth = 4 + burst * 16; // de fine a tres marquee a la rupture
  const splitOp = interpolate(frame, [F_VIDER - 24, F_VIDER - 4], [0, 1], clamp); // apparait JUSTE avant la separation
  return (
    <g>
      {cracks.map((c, i) => {
        const p = Math.max(0, Math.min(1, traceP * 1.25 - i * 0.18));
        const width = (c.w + burst * 9) ; // le trait GROSSIT au climax (le mur s'ouvre)
        return (
          <g key={i}>
            {/* lueur sombre derriere (profondeur de la faille) */}
            <path d={c.d} fill="none" stroke="#0a0f1d" strokeWidth={width + 4} strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={LEN} strokeDashoffset={LEN * (1 - p)} opacity={0.6 * p} />
            <path d={c.d} fill="none" stroke="#2a1808" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={LEN} strokeDashoffset={LEN * (1 - p)} opacity={0.92 * p} />
            {/* liseré rouge dette qui suinte dans la faille au climax */}
            {burst > 0.1 && (
              <path d={c.d} fill="none" stroke="#9a3528" strokeWidth={Math.max(1, width - 4)} strokeLinecap="round"
                strokeDasharray={LEN} strokeDashoffset={LEN * (1 - p)} opacity={0.5 * burst} />
            )}
          </g>
        );
      })}
      {/* ── la cassure centrale NETTE (separation en deux au milieu) ── */}
      {splitOp > 0.01 && (
        <g opacity={splitOp}>
          {/* gouffre sombre (profondeur de la coupure) */}
          <path d={splitCrack} fill="none" stroke="#06090f" strokeWidth={splitWidth + 6} strokeLinecap="round" strokeLinejoin="round" />
          <path d={splitCrack} fill="none" stroke="#1a1208" strokeWidth={splitWidth} strokeLinecap="round" strokeLinejoin="round" />
          {/* liseré rouge dette qui jaillit de la cassure au moment ou ca cede */}
          {burst > 0.15 && (
            <path d={splitCrack} fill="none" stroke="#b04030" strokeWidth={Math.max(1.5, splitWidth - 7)} strokeLinecap="round" strokeLinejoin="round" opacity={0.7 * burst} />
          )}
        </g>
      )}
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
// filet de vidange CONTINU et EPAIS (ruban tricolore ininterrompu de la breche jusqu'au bac BUDGET).
// PAS clippe par le bassin (sort du clip pour un ecoulement continu — fix Aziz/Gemini).
const DrainStream: React.FC<{ wallCx: number; wallBotW: number; floorY: number; open: number; frame: number; budgetY: number }> = ({ wallCx, wallBotW, floorY, open, frame, budgetY }) => {
  const x = wallCx - wallBotW / 2 + 2;
  const startY = floorY - 64;
  const endY = budgetY; // jusqu'au bord du bac BUDGET (continu, pas coupe au sol)
  const h = (endY - startY) * open;
  // ruban epais a 3 bandes (vrai tricolore qui coule) — IMMOBILE une fois etabli (retour Aziz : le filet
  // ne doit plus bouger apres son apparition). Micro-ondulation seulement pendant l'amorcage (~1s), puis FIGE a 0.
  const settle = interpolate(frame, [F_PIOCHER + 12, F_PIOCHER + 42], [1, 0], clamp); // 1 a l'ouverture -> 0 (fige)
  const sway = Math.sin(frame / 16) * 1.2 * settle;
  const bandW = 7;
  return (
    <g>
      {/* ruban tricolore epais (3 bandes cote a cote) */}
      <rect x={x - bandW * 1.5} y={startY} width={bandW} height={h} fill={SEN.a} opacity={0.92 * open} rx={3} transform={`skewX(${sway * 0.3})`} />
      <rect x={x - bandW * 0.5} y={startY} width={bandW} height={h} fill={SEN.b} opacity={0.95 * open} rx={3} transform={`skewX(${sway * 0.3})`} />
      <rect x={x + bandW * 0.5} y={startY} width={bandW} height={h} fill={SEN.c} opacity={0.92 * open} rx={3} transform={`skewX(${sway * 0.3})`} />
    </g>
  );
};

// bassin BUDGET sous le mur (recoit le filet, se remplit un peu)
const BudgetBasin: React.FC<{ wallCx: number; floorY: number; frame: number; drainP: number }> = ({ wallCx, floorY, frame, drainP }) => {
  const appear = interpolate(frame, [F_PIOCHER - 10, F_PIOCHER + 20], [0, 1], clamp);
  const bx = wallCx - 150, by = floorY + 22, bw = 160, bh = 56;
  // le bac se REMPLIT progressivement (niveau qui MONTE calmement, statique — pas de jet qui fretille)
  const fillH = bh * Math.min(1, drainP * 0.95);
  const fy = by + bh - fillH;
  const fId = `budgetFill-${wallCx}`;
  return (
    <g opacity={appear}>
      {/* le liquide recu = TRICOLORE Senegal (l'argent du fonds qui part dans le budget) */}
      <defs>
        <linearGradient id={fId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={SEN.a} /><stop offset="33%" stopColor={SEN.a} />
          <stop offset="33.01%" stopColor={SEN.b} /><stop offset="66%" stopColor={SEN.b} />
          <stop offset="66.01%" stopColor={SEN.c} /><stop offset="100%" stopColor={SEN.c} />
        </linearGradient>
      </defs>
      {fillH > 1 && <rect x={bx + 12} y={fy} width={bw - 24} height={fillH} fill={`url(#${fId})`} opacity={0.92} />}
      {/* bac (par-dessus le liquide) */}
      <path d={`M ${bx} ${by} L ${bx + 14} ${by + bh} L ${bx + bw - 14} ${by + bh} L ${bx + bw} ${by} `}
        fill="none" stroke={IVORY} strokeWidth={2.5} opacity={0.6} />
      <text x={bx + bw / 2} y={by + bh + 30} textAnchor="middle" fill="rgba(242,239,230,0.7)" fontFamily={BEBAS} fontSize={26} letterSpacing="2">BUDGET</text>
    </g>
  );
};

// cloche / alerte FMI (forme SVG maison, halo rouge pulse)
// FMI : se pose STATIQUE au-dessus du mur FONSIS (il surveille le fonds). Pas de pulse/mouvement
// gauche-droite (retour Aziz : distrayant). Seul un halo d'alerte tres doux respire, l'icone reste fixe.
const FmiAlert: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => {
  const enter = spring({ frame: frame - F_FMI, fps: 30, config: { damping: 13, stiffness: 150 }, durationInFrames: 22 });
  const op = interpolate(frame, [F_FMI, F_FMI + 20, F_VIDER + 40, END], [0, 1, 1, 0], clamp);
  if (frame < F_FMI - 5) return null;
  const scale = interpolate(enter, [0, 1], [0, 1], clamp); // pose, PAS de pulse permanent
  const haloOp = 0.16 + 0.08 * Math.sin((frame - F_FMI) / 9); // seul le halo respire (alerte), l'icone est fixe
  return (
    <g opacity={op} transform={`translate(${x}, ${y}) scale(${scale})`} style={{ transformOrigin: "center" }}>
      <circle cx={0} cy={0} r={46} fill="#9a3528" opacity={haloOp} />
      <path d="M 0 -28 C 16 -28 24 -15 24 2 L 30 13 L -30 13 L -24 2 C -24 -15 -16 -28 0 -28 Z"
        fill="none" stroke="#d4604f" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M -6 13 a 6 6 0 0 0 12 0" fill="none" stroke="#d4604f" strokeWidth={3.5} />
      <text x={0} y={44} textAnchor="middle" fill="#e08a7c" fontFamily={BEBAS} fontSize={28} letterSpacing="3">FMI</text>
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
    {/* SFX liquide (SFX.fill) RETIRE ici (chantier 7 passe finition 2026-07-04, retour Aziz : SFX
        distrayant ~4min15/3 mecanismes). Le mur/reserve se met en place SANS son de remplissage. */}
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
