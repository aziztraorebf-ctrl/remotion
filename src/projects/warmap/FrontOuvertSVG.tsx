/**
 * FrontOuvertSVG — VARIANTE B du moteur d'affrontement 2 factions (warmapChoc). Contrairement a la
 * variante Khartoum (cibles-batiments), ici le sujet EST la ligne de front : deux territoires qui
 * se touchent, une ligne qui ondule, tient, puis cede par un point de rupture.
 *
 * Destination : Acte 2 du mid-form Soudan (impasse militaire, "les lignes bougent peu" puis une
 * percee). C'est la vraie "carte de guerre lignes qui bougent" — pas un test jetable.
 *
 * Sequence :
 *  1. ETABLISSEMENT — 2 zones teintees (RSF ouest, SAF est) + ligne de front sinueuse au milieu
 *  2. PRESSION      — la RSF masse des formations contre le front, qui frémit sans ceder (impasse)
 *  3. PERCEE        — un point de rupture cede : le front se deforme, une pointe RSF s'enfonce
 *  4. EXPLOITATION  — la zone RSF grignote la zone SAF autour de la breche (sweep), la SAF recule
 *  5. STABILISATION — le front se re-fige plus a l'est, nouvelle ligne (l'impasse se deplace)
 *
 * Doctrine : WARMAP-INSERT-SVG-ETATMAJOR.md + DECISION-jetons-vs-vehicules.md (front + zones).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  EM,
  RSF,
  SAF,
  clampI,
  jag01,
  EmDefs,
  EmFrame,
  EmSubtitle,
  FactionLegend,
  HoldingFormation,
  AdvancingFormation,
  ClashSparks,
  Impact,
  SmokeColumn,
  Sonar,
  type Vec,
} from "./_shared/warmapChoc";

export const FRONT_OUVERT_FPS = 30;
export const FRONT_OUVERT_FRAMES = 720; // 24s @ 30fps

// axe X de la ligne de front (le front court verticalement, milieu de l'ecran)
const FRONT_X = 960;
const BREACH_Y = 560; // ordonnee du point de rupture

// Timeline
const T_ESTAB = 60;
const T_PRESSURE = T_ESTAB;
const T_BREACH = 300; // le front cede
const T_EXPLOIT = T_BREACH + 40;
const EXPLOIT_LEN = 150;
const T_STABILISE = T_EXPLOIT + EXPLOIT_LEN;

// ── Ligne de front parametrique : une sinusoide verticale, qui se DEFORME au point de rupture
// apres T_BREACH (une pointe s'enfonce vers l'est). Renvoie le path SVG. ──
const frontPath = (frame: number): string => {
  const breach = frame >= T_BREACH ? clampI(frame, T_BREACH, T_STABILISE) : 0;
  const pts: string[] = [];
  for (let y = 60; y <= 1020; y += 20) {
    // ondulation de base (front sinueux, vivant)
    let x = FRONT_X + Math.sin(y * 0.012 + 1.3) * 26 + Math.sin(frame * 0.03 + y * 0.02) * 6;
    // deformation de percee : cloche gaussienne centree sur BREACH_Y, pousse vers l'est
    const d = y - BREACH_Y;
    const bulge = Math.exp(-(d * d) / (2 * 130 * 130)) * breach * 240;
    x += bulge;
    pts.push(`${x.toFixed(1)} ${y}`);
  }
  return "M " + pts.join(" L ");
};

// position sur le front a une ordonnee donnee (pour poser formations/etincelles au bon endroit)
const frontXat = (y: number, frame: number): number => {
  const breach = frame >= T_BREACH ? clampI(frame, T_BREACH, T_STABILISE) : 0;
  let x = FRONT_X + Math.sin(y * 0.012 + 1.3) * 26 + Math.sin(frame * 0.03 + y * 0.02) * 6;
  const d = y - BREACH_Y;
  x += Math.exp(-(d * d) / (2 * 130 * 130)) * breach * 240;
  return x;
};

const subtitleFor = (f: number): string => {
  if (f < T_ESTAB) return "A l'ouest, la RSF. A l'est, l'armee. Entre les deux, une ligne de front.";
  if (f < T_BREACH) return "Depuis des mois, la ligne ne bouge presque plus. L'impasse.";
  if (f < T_EXPLOIT) return "Puis un point cede.";
  if (f < T_STABILISE) return "La RSF s'engouffre dans la breche et pousse l'armee vers l'est.";
  return "Le front se re-fige, plus loin. L'impasse s'est seulement deplacee.";
};

export const FrontOuvertSVG: React.FC = () => {
  const frame = useCurrentFrame();

  const pFond = clampI(frame, 0, 25);
  const cartouche = clampI(frame, 0, 16);
  const legendOp = clampI(frame, 10, 30);

  // zones teintees : RSF a gauche du front, SAF a droite. La zone RSF grignote a l'exploitation.
  const grab = frame >= T_EXPLOIT ? clampI(frame, T_EXPLOIT, T_STABILISE) : 0;

  // clip anime : la zone RSF s'etend vers l'est autour de la breche
  const rsfClipW = FRONT_X + 40 + grab * 240;

  // camera shake : leger pendant la pression (impasse tendue), fort a la percee
  let shakeX = 0;
  let shakeY = 0;
  if (frame >= T_PRESSURE && frame < T_BREACH) {
    shakeX = Math.sin(frame * 4.0) * 0.8;
  }
  const bLocal = frame - T_BREACH;
  if (bLocal >= 0 && bLocal < 10) {
    shakeX += Math.sin(bLocal * 7) * 4.5;
    shakeY += Math.cos(bLocal * 9) * 3;
  }

  const breachPoint: Vec = { x: frontXat(BREACH_Y, frame), y: BREACH_Y };

  // 3 secteurs de pression RSF le long du front (formations qui tiennent contre la ligne)
  const pressureYs = [340, 560, 780];

  return (
    <AbsoluteFill style={{ background: "#0b1526", transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <EmDefs />
        <defs>
          <clipPath id="rsfZoneClip">
            <rect x={0} y={0} width={rsfClipW} height={1080} />
          </clipPath>
          <clipPath id="safZoneClip">
            <rect x={rsfClipW} y={0} width={1920 - rsfClipW} height={1080} />
          </clipPath>
          <pattern id="hatchRsf" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill={RSF.zone} opacity={0.1} />
            <line x1="0" y1="0" x2="0" y2="16" stroke={RSF.zone} strokeWidth="2.6" opacity={0.34} />
          </pattern>
          <pattern id="hatchSaf" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
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

          {/* Zones teintees, clippees de part et d'autre du front mouvant */}
          <g clipPath="url(#rsfZoneClip)">
            <rect width={1920} height={1080} fill="url(#hatchRsf)" />
          </g>
          <g clipPath="url(#safZoneClip)">
            <rect width={1920} height={1080} fill="url(#hatchSaf)" />
          </g>

          {/* etiquettes de zone */}
          <text x={330} y={540} textAnchor="middle" fill={RSF.zone} fontFamily="Georgia, serif" fontSize={40} fontWeight={700} opacity={0.32} letterSpacing={6}>RSF</text>
          <text x={1590} y={540} textAnchor="middle" fill={SAF.zone} fontFamily="Georgia, serif" fontSize={40} fontWeight={700} opacity={0.32} letterSpacing={6}>SAF</text>
        </g>

        {/* ============ LIGNE DE FRONT ============ */}
        {/* ligne epaisse (le front lui-meme) */}
        <path d={frontPath(frame)} fill="none" stroke={EM.ink} strokeWidth={4} opacity={pFond * 0.9} />
        <path d={frontPath(frame)} fill="none" stroke={EM.gold} strokeWidth={1.6} strokeDasharray="10 8" opacity={pFond * 0.8} />

        {/* Sonar de tension au point de rupture pendant l'impasse (le point chaud avant la percee) */}
        {frame > T_ESTAB && frame < T_BREACH && (
          <Sonar cx={FRONT_X} cy={BREACH_Y} frame={frame} period={54} rMax={70} color={RSF.front} />
        )}

        {/* Formations RSF de pression le long du front (cote ouest, tiennent contre la ligne) */}
        {pressureYs.map((y, i) => {
          if (frame < T_PRESSURE - 10) return null;
          const fx = frontXat(y, frame);
          // le secteur central (breach) pousse a l'est apres la percee ; les autres tiennent
          const isBreach = y === BREACH_Y;
          const push = isBreach && frame >= T_BREACH ? clampI(frame, T_BREACH, T_STABILISE) * 200 : 0;
          return (
            <HoldingFormation
              key={`rsf-${i}`}
              center={{ x: fx - 70 + push, y }}
              faction={RSF}
              frame={frame + i * 7}
              count={3}
              spread={52}
              size={1.6}
            />
          );
        })}

        {/* Formations SAF qui defendent le front (cote est) — le secteur breach recule */}
        {pressureYs.map((y, i) => {
          if (frame < T_PRESSURE - 10) return null;
          const fx = frontXat(y, frame);
          const isBreach = y === BREACH_Y;
          const retreat = isBreach && frame >= T_EXPLOIT ? clampI(frame, T_EXPLOIT, T_STABILISE) * 160 : 0;
          return (
            <HoldingFormation
              key={`saf-${i}`}
              center={{ x: fx + 70 + retreat, y }}
              faction={SAF}
              frame={frame + i * 5 + 3}
              count={3}
              spread={52}
              size={1.6}
            />
          );
        })}

        {/* Pointe d'exploitation RSF : une colonne s'enfonce dans la breche vers l'est */}
        {frame >= T_BREACH && (
          <AdvancingFormation
            origin={{ x: FRONT_X - 120, y: BREACH_Y }}
            front={{ x: FRONT_X + 220, y: BREACH_Y - 10 }}
            faction={RSF}
            frame={frame}
            startFrame={T_BREACH}
            travelFrames={EXPLOIT_LEN}
            bow={0.05}
            size={1.9}
          />
        )}

        {/* etincelles de contact : sur les 3 secteurs pendant la pression, concentrees au breach */}
        {pressureYs.map((y, i) => (
          <ClashSparks
            key={`spark-${i}`}
            x={frontXat(y, frame)}
            y={y}
            frame={frame}
            from={T_PRESSURE + i * 8}
            to={y === BREACH_Y ? T_STABILISE : T_BREACH}
            intensity={y === BREACH_Y ? 1.3 : 0.7}
          />
        ))}

        {/* Impact + fumee au point de rupture */}
        <Impact x={breachPoint.x} y={breachPoint.y} frame={frame} startFrame={T_BREACH} />
        <SmokeColumn x={breachPoint.x} y={breachPoint.y - 4} frame={frame} startFrame={T_BREACH + 12} />

        {/* ============ CADRE / CARTOUCHE / LEGENDE / SOUS-TITRE ============ */}
        <EmFrame title="SOUDAN — LIGNE DE FRONT" date="IMPASSE MILITAIRE" opacity={pFond} cartoucheOp={cartouche} />
        <FactionLegend
          x={90}
          y={150}
          opacity={legendOp}
          factions={[
            { faction: RSF, label: "RSF — paramilitaires" },
            { faction: SAF, label: "SAF — armee reguliere" },
          ]}
        />
        <EmSubtitle text={subtitleFor(frame)} opacity={pFond} />
      </svg>
    </AbsoluteFill>
  );
};

export default FrontOuvertSVG;
