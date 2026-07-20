/**
 * BlocImpasseB6 — BEAT 6 de l'Acte 2 Soudan, registre "etat-major" ILLUSTRATIF (adapte de
 * FrontOuvertSVG, qui reste intouche). Coherence visuelle 100% illustrative : AUCUN losange abstrait
 * (FactionToken), AUCUN sous-titre interne. On raconte avec du MATERIEL REEL (sprites top-down).
 *
 * Narration off (voix, NON affichee) :
 *  « L'armee, elle, a les avions et les chars lourds. Sur le papier, elle devrait gagner.
 *    Dans les faits, elle n'y arrive pas. »
 *
 * Concept (decisions realisateur) :
 *  - RSF (ouest/gauche) = TECHNICALS (pick-ups armes, `tech-td-red.png`) : 3 secteurs le long du
 *    front, cote ouest. Ils TIENNENT (spring d'apparition puis FIGES, ne bougent jamais).
 *  - SAF (est/droite) = PUISSANCE DE FEU. AVIONS (silhouettes) STATIQUES tout du long (un avion
 *    pose ne glisse pas — ils illustrent "l'armee a l'aviation", presence, pas mouvement). CHARS
 *    (`tank-td-blue.png`) : quelques-uns AU REPOS (la masse) + une COLONNE MOBILE qui execute la
 *    poussee — plusieurs chars avancent ENSEMBLE vers l'ouest le long de l'axe ManeuverArrow,
 *    atteignent le front, PUIS refluent (reviennent a leur position). 1 seule unite mobile = lisible.
 *  - PERCEE QUI ECHOUE : le front s'enfonce vers l'ouest (cloche gaussienne en -x) sous la poussee
 *    des chars PUIS revient exactement a sa position initiale. Aucun territoire pris = "elle n'y
 *    arrive pas".
 *
 * Contraintes : frame-driven pur. NO scale oscillant sur sprites raster (spring puis FIGE). Les
 * AVIONS ne bougent JAMAIS. NO EMOJIS. Types stricts. Pilotable par parent via localFrame.
 * Doctrine : WARMAP-INSERT-SVG-ETATMAJOR.md.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, staticFile } from "remotion";
import {
  EM,
  RSF,
  SAF,
  clampI,
  EmDefs,
  EmFrame,
  ManeuverArrow,
  ClashSparks,
  Impact,
  Sonar,
  type Faction,
} from "../_shared/warmapChoc";

export const BLOC_B6_FPS = 30;
export const BLOC_B6_FRAMES = 282; // 9.4s @ 30fps

// axe X de la ligne de front (le front court verticalement, milieu de l'ecran)
const FRONT_X = 960;
const BREACH_Y = 540; // ordonnee du point d'effort principal (centre vertical)

// ── Timeline (frames relatives @30) ──
const T_ESTAB = 25; // fond/cadre/zones/legende en place
const T_TECH = 18; // les technicals RSF apparaissent
const T_FIRE = 40; // la puissance de feu SAF (chars au repos + avions) apparait
const T_ARROW = 90; // l'axe ManeuverArrow SAF se trace (annonce la poussee des chars)
const ARROW_DRAW = 36;
// enveloppe de poussee (percee -> reflux) : 0 -> max -> 0. Pilote A LA FOIS la deformation du front
// ET l'avance de la colonne de chars (mouvement et effet synchronises).
const T_PUSH_START = 96;
const T_PUSH_PEAK = 178;
const T_REFLUX = 208; // le reflux commence (chars refluent vers l'est)
const T_PUSH_BACK = 282; // front revenu a sa position initiale, chars revenus au repos

// 3 secteurs le long du front (technicals RSF cote ouest)
const SECTOR_YS = [300, 540, 780];

// ── Enveloppe de poussee du front : monte (percee) puis redescend a 0 (reflux). Valeur 0..1. ──
const pushEnv = (frame: number): number =>
  interpolate(
    frame,
    [T_PUSH_START, T_PUSH_PEAK, T_REFLUX, T_PUSH_BACK],
    [0, 1, 0.75, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

// ── Ligne de front parametrique : sinusoide verticale (front vivant) qui se DEFORME vers l'OUEST
// (-x) au point d'effort sous la poussee des chars SAF, PUIS revient. Renvoie le path SVG. ──
const frontPath = (frame: number): string => {
  const push = pushEnv(frame);
  const pts: string[] = [];
  for (let y = 60; y <= 1020; y += 20) {
    let x = FRONT_X + Math.sin(y * 0.012 + 1.3) * 26 + Math.sin(frame * 0.03 + y * 0.02) * 6;
    const d = y - BREACH_Y;
    const bulge = Math.exp(-(d * d) / (2 * 150 * 150)) * push * 210;
    x -= bulge;
    pts.push(`${x.toFixed(1)} ${y}`);
  }
  return "M " + pts.join(" L ");
};

// position sur le front a une ordonnee donnee (pour poser etincelles/impacts au bon endroit)
const frontXat = (y: number, frame: number): number => {
  const push = pushEnv(frame);
  let x = FRONT_X + Math.sin(y * 0.012 + 1.3) * 26 + Math.sin(frame * 0.03 + y * 0.02) * 6;
  const d = y - BREACH_Y;
  x -= Math.exp(-(d * d) / (2 * 150 * 150)) * push * 210;
  return x;
};

// ── Picto AVION (silhouette delta, encre etat-major) — STATIQUE. Nez vers l'OUEST (vers le front).
// Vectoriel (pas de sprite raster top-down d'avion disponible) mais illustratif, jamais un losange. ──
const PlaneIcon: React.FC<{ x: number; y: number; faction: Faction; scale?: number }> = ({
  x,
  y,
  faction,
  scale = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} filter="url(#emShadow)">
    <path d="M -24 0 L 12 -5 L 24 -4 L 16 0 L 24 4 L 12 5 Z" fill={faction.bodyDark} stroke={EM.stroke} strokeWidth={1.2} />
    <path d="M 0 0 L 14 -17 L 20 -16 L 8 0 L 20 16 L 14 17 Z" fill={faction.body} stroke={faction.bezel} strokeWidth={0.8} />
  </g>
);

// spring d'apparition (overshoot puis FIGE) — retourne l'echelle. Pas d'oscillation continue.
const popScale = (frame: number, startFrame: number): number => {
  const t = frame - startFrame;
  if (t < 0) return 0;
  return interpolate(t, [0, 10, 16], [0, 1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

// ── Sprite raster (technical / char) : <img> plein ecran, taille FIXE, spring puis FIGE, ombre au
// sol. Pose comme SoloBig/FirepowerSprite dans SoudanActe2 (position absolue en px viewBox = px
// ecran a scale 1). `rotate` oriente le materiel (sprites top-down : avant vers le HAUT par defaut). ──
const RasterUnit: React.FC<{
  x: number;
  y: number;
  sprite: string;
  size: number;
  rotate: number;
  scale: number; // echelle d'apparition (spring)
  opacity?: number;
}> = ({ x, y, sprite, size, rotate, scale, opacity = 1 }) => {
  if (scale <= 0 || opacity <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        pointerEvents: "none",
      }}
    >
      {/* ombre portee douce au sol */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "60%",
          width: size * 0.6,
          height: size * 0.2,
          transform: "translate(-50%,-50%)",
          background: "rgba(20,12,4,0.42)",
          borderRadius: "50%",
          filter: "blur(6px)",
        }}
      />
      <img
        src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
        style={{
          width: size,
          height: size,
          display: "block",
          objectFit: "contain",
          transform: `rotate(${rotate}deg)`,
          filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.4))",
        }}
      />
    </div>
  );
};

// ── Technicals RSF (ouest) : 3 secteurs, 2-3 pick-ups par secteur, cote ouest du front, FIXES.
// Sprites top-down (avant vers le haut) tournes de +90deg -> avant/mitrailleuse pointe vers l'EST
// (vers le front SAF). Positions figees (le front est a ~960 ; on reste a l'ouest ~150-260px avant). ──
const TECHNICALS: { x: number; y: number }[] = [
  // secteur haut
  { x: FRONT_X - 210, y: 270 },
  { x: FRONT_X - 130, y: 320 },
  // secteur central
  { x: FRONT_X - 230, y: 500 },
  { x: FRONT_X - 150, y: 555 },
  { x: FRONT_X - 210, y: 620 },
  // secteur bas
  { x: FRONT_X - 210, y: 760 },
  { x: FRONT_X - 130, y: 810 },
];
const TECH_SIZE = 100;
// sprite top-down : cabine/capot vers le HAUT, benne + mitrailleuse vers le BAS. Rotation -90 ->
// la mitrailleuse montee pointe vers l'EST (le front SAF) = le pick-up fait FACE a l'ennemi.
const TECH_ROT = -90;

// ── Chars SAF AU REPOS (est) : la masse de puissance de feu, FIXES. Tournes -90deg -> canon a l'ouest. ──
const TANKS_REST: { x: number; y: number }[] = [
  { x: FRONT_X + 480, y: 300 },
  { x: FRONT_X + 560, y: 780 },
  { x: FRONT_X + 620, y: 540 },
];
const TANK_SIZE = 108;
const TANK_ROT = -90; // canon vers l'ouest

// ── Chars SAF MOBILES (la colonne d'assaut) : partent de l'est, avancent ENSEMBLE vers l'ouest le
// long de l'axe central (piloté par pushEnv), atteignent le front, PUIS refluent. Positions AU REPOS
// (est) ; l'avance = -pushEnv * ADVANCE. Y en echelon serre = une colonne lisible. ──
const TANK_COL_REST_X = FRONT_X + 300; // position de depart/repos (est)
const TANK_COL: { restX: number; y: number }[] = [
  { restX: TANK_COL_REST_X + 40, y: BREACH_Y - 70 },
  { restX: TANK_COL_REST_X + 40, y: BREACH_Y + 70 },
  { restX: TANK_COL_REST_X + 130, y: BREACH_Y },
];
const TANK_COL_ADVANCE = 300; // px parcourus vers l'ouest au pic (le char de tete atteint ~ le front)

export const BlocImpasseB6: React.FC<{ localFrame?: number }> = ({ localFrame }) => {
  const cf = useCurrentFrame();
  const frame = localFrame ?? cf;

  const pFond = clampI(frame, 0, 25);
  const cartouche = clampI(frame, 0, 16);
  const legendOp = clampI(frame, 10, 30);

  // zones teintees STATIQUES : front fixe au milieu (aucun territoire pris).
  const zoneSplit = FRONT_X + 20;

  // camera shake : leger pendant la poussee, un peu plus fort au contact (pic de percee).
  let shakeX = 0;
  let shakeY = 0;
  const contactFrame = T_PUSH_PEAK - 20; // les chars butent sur le front un peu avant le pic
  const tc = frame - contactFrame;
  if (tc >= 0 && tc < 14) {
    shakeX += Math.sin(tc * 6) * 3.0;
    shakeY += Math.cos(tc * 8) * 1.8;
  }
  if (frame >= T_PUSH_START && frame < T_REFLUX) {
    shakeX += Math.sin(frame * 3.5) * 0.7;
  }

  const push = pushEnv(frame);
  const tankAdvance = push * TANK_COL_ADVANCE; // avance de la colonne (px vers l'ouest)

  return (
    <AbsoluteFill style={{ background: "#0b1526", transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      {/* ============ COUCHE SVG : cadre, zones, front, axes, chocs, avions ============ */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <EmDefs />
        <defs>
          <clipPath id="b6RsfZoneClip">
            <rect x={0} y={0} width={zoneSplit} height={1080} />
          </clipPath>
          <clipPath id="b6SafZoneClip">
            <rect x={zoneSplit} y={0} width={1920 - zoneSplit} height={1080} />
          </clipPath>
          <pattern id="b6HatchRsf" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill={RSF.zone} opacity={0.1} />
            <line x1="0" y1="0" x2="0" y2="16" stroke={RSF.zone} strokeWidth="2.6" opacity={0.34} />
          </pattern>
          <pattern id="b6HatchSaf" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <rect width="16" height="16" fill={SAF.zone} opacity={0.1} />
            <line x1="0" y1="0" x2="0" y2="16" stroke={SAF.zone} strokeWidth="2.6" opacity={0.32} />
          </pattern>
        </defs>

        {/* ============ FOND : terrain neutre ============ */}
        <g opacity={pFond}>
          <rect width={1920} height={1080} fill={EM.sand} />
          <rect width={1920} height={1080} fill="url(#emGrid)" />
          <g id="terrain" opacity={0.5}>
            <path d="M 200 300 C 340 200, 540 260, 620 360 C 700 460, 520 520, 380 470 C 250 430, 120 400, 200 300 Z" fill="#ceb280" stroke="#8a3324" strokeWidth={1.2} strokeDasharray="6 6" opacity={0.5} />
            <path d="M 1320 680 C 1460 580, 1660 640, 1740 740 C 1800 820, 1620 880, 1480 830 C 1360 790, 1240 760, 1320 680 Z" fill="#ceb280" stroke="#8a3324" strokeWidth={1.2} strokeDasharray="6 6" opacity={0.5} />
            <path d="M 120 160 Q 400 90 760 200 T 1300 130 T 1820 300" fill="none" stroke="#c7a977" strokeWidth={2} opacity={0.6} />
            <path d="M 80 920 Q 400 1000 720 900 T 1820 940" fill="none" stroke="#c7a977" strokeWidth={2} opacity={0.6} />
          </g>

          {/* Zones teintees STATIQUES de part et d'autre du front (le split ne bouge pas) */}
          <g clipPath="url(#b6RsfZoneClip)">
            <rect width={1920} height={1080} fill="url(#b6HatchRsf)" />
          </g>
          <g clipPath="url(#b6SafZoneClip)">
            <rect width={1920} height={1080} fill="url(#b6HatchSaf)" />
          </g>

          {/* etiquettes de zone (filigrane) */}
          <text x={330} y={540} textAnchor="middle" fill={RSF.zone} fontFamily="Georgia, serif" fontSize={40} fontWeight={700} opacity={0.32} letterSpacing={6}>RSF</text>
          <text x={1590} y={540} textAnchor="middle" fill={SAF.zone} fontFamily="Georgia, serif" fontSize={40} fontWeight={700} opacity={0.32} letterSpacing={6}>SAF</text>
        </g>

        {/* ============ LIGNE DE FRONT ============ */}
        <path d={frontPath(frame)} fill="none" stroke={EM.ink} strokeWidth={4} opacity={pFond * 0.9} />
        <path d={frontPath(frame)} fill="none" stroke={EM.gold} strokeWidth={1.6} strokeDasharray="10 8" opacity={pFond * 0.8} />

        {/* Sonar de tension au point d'effort pendant la montee (le point chaud) */}
        {frame > T_FIRE && frame < T_PUSH_PEAK && (
          <Sonar cx={frontXat(BREACH_Y, frame)} cy={BREACH_Y} frame={frame} period={54} rMax={70} color={SAF.front} />
        )}

        {/* AVIONS SAF (est) — STATIQUES : presence de puissance aerienne, ne bougent JAMAIS. */}
        {[
          { x: FRONT_X + 730, y: 320 },
          { x: FRONT_X + 800, y: 560 },
          { x: FRONT_X + 720, y: 800 },
        ].map((p, i) => {
          const sc = popScale(frame, T_FIRE + 20 + i * 8);
          if (sc <= 0) return null;
          return (
            <g key={`plane-${i}`} transform={`scale(${sc})`} style={{ transformOrigin: `${p.x}px ${p.y}px` }}>
              <PlaneIcon x={p.x} y={p.y} faction={SAF} scale={1.5} />
            </g>
          );
        })}

        {/* ============ POUSSEE — AXE DE MANOEUVRE SAF (annonce) : l'axe central que suivent les chars,
            se trace avant la poussee, s'efface au reflux. ============ */}
        {(() => {
          const arrowOp =
            clampI(frame, T_ARROW, T_ARROW + 24) * clampI(frame, T_REFLUX, T_REFLUX + 30, 1, 0);
          if (arrowOp <= 0) return null;
          return (
            <ManeuverArrow
              origin={{ x: TANK_COL_REST_X + 120, y: BREACH_Y }}
              target={{ x: FRONT_X - 30, y: BREACH_Y }}
              faction={SAF}
              frame={frame}
              startFrame={T_ARROW}
              drawFrames={ARROW_DRAW}
              bow={0}
              width={10}
              opacity={arrowOp}
            />
          );
        })()}

        {/* etincelles de contact : au point d'effort, quand la colonne de chars bute sur le front */}
        <ClashSparks
          x={frontXat(BREACH_Y, frame)}
          y={BREACH_Y}
          frame={frame}
          from={T_PUSH_START + 20}
          to={T_REFLUX + 10}
          intensity={1.3}
        />
        <ClashSparks
          x={frontXat(BREACH_Y - 70, frame)}
          y={BREACH_Y - 70}
          frame={frame}
          from={T_PUSH_START + 30}
          to={T_REFLUX}
          intensity={0.7}
        />
        <ClashSparks
          x={frontXat(BREACH_Y + 70, frame)}
          y={BREACH_Y + 70}
          frame={frame}
          from={T_PUSH_START + 30}
          to={T_REFLUX}
          intensity={0.7}
        />

        {/* Impact au contact (la poussee bute sur le front) */}
        <Impact x={frontXat(BREACH_Y, frame)} y={BREACH_Y} frame={frame} startFrame={contactFrame} />

        {/* ============ CADRE / CARTOUCHE ============ */}
        <EmFrame title="SOUDAN — RAPPORT DE FORCE" date="IMPASSE MILITAIRE" opacity={pFond} cartoucheOp={cartouche} />

        {/* Legende illustrative (materiel, pas losanges) : pastilles couleur faction + libelle */}
        <g opacity={legendOp} transform="translate(90 150)">
          <rect x={-14} y={-26} width={340} height={94} fill="#2a120e" opacity={0.82} rx={4} />
          <g transform="translate(16 6)">
            <rect x={-8} y={-11} width={22} height={22} rx={3} fill={SAF.body} stroke={SAF.bezel} strokeWidth={1.4} />
            <text x={30} y={5} fill="#f5e6ce" fontFamily="system-ui, sans-serif" fontSize={17} fontWeight={700} letterSpacing={1}>SAF — chars et aviation</text>
          </g>
          <g transform="translate(16 40)">
            <rect x={-8} y={-11} width={22} height={22} rx={3} fill={RSF.body} stroke={RSF.bezel} strokeWidth={1.4} />
            <text x={30} y={5} fill="#f5e6ce" fontFamily="system-ui, sans-serif" fontSize={17} fontWeight={700} letterSpacing={1}>RSF — colonnes mobiles</text>
          </g>
        </g>
      </svg>

      {/* ============ COUCHE RASTER (au-dessus du SVG) : technicals RSF + chars SAF ============ */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {/* Technicals RSF (ouest) — FIXES, tiennent la ligne (avant vers l'est) */}
        {TECHNICALS.map((t, i) => {
          const sc = popScale(frame, T_TECH + i * 4);
          if (sc <= 0) return null;
          return (
            <RasterUnit
              key={`tech-${i}`}
              x={t.x}
              y={t.y}
              sprite="tech-td-red"
              size={TECH_SIZE}
              rotate={TECH_ROT}
              scale={sc}
            />
          );
        })}

        {/* Chars SAF AU REPOS (est) — la masse de puissance de feu, FIXES (canon vers l'ouest) */}
        {TANKS_REST.map((t, i) => {
          const sc = popScale(frame, T_FIRE + i * 8);
          if (sc <= 0) return null;
          return (
            <RasterUnit
              key={`tank-rest-${i}`}
              x={t.x}
              y={t.y}
              sprite="tank-td-blue"
              size={TANK_SIZE}
              rotate={TANK_ROT}
              scale={sc}
            />
          );
        })}

        {/* Chars SAF MOBILES (la colonne d'assaut) — avancent ENSEMBLE vers l'ouest (pushEnv) puis
            refluent. 1 seule unite mobile a l'ecran = mouvement lisible. Canon vers l'ouest. */}
        {TANK_COL.map((t, i) => {
          const sc = popScale(frame, T_FIRE + 4 + i * 6);
          if (sc <= 0) return null;
          const x = t.restX - tankAdvance;
          return (
            <RasterUnit
              key={`tank-col-${i}`}
              x={x}
              y={t.y}
              sprite="tank-td-blue"
              size={TANK_SIZE}
              rotate={TANK_ROT}
              scale={sc}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default BlocImpasseB6;
