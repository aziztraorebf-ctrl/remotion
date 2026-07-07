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
  ManeuverArrow,
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

// ── POCHE SAF encerclee : une garnison SAF isolee, exposee a l'est de la breche (dans son propre
// territoire), que la tenaille RSF va ENVELOPPER. C'est ce qui donne du SENS a la tenaille : on
// encercle l'ADVERSAIRE, pas du vide (bug corrige : "le RSF s'attaquait lui-meme").
const POCKET: Vec = { x: FRONT_X + 95, y: BREACH_Y };

// ── TENAILLE : les 2 arcs d'encerclement partent de l'ouest (RSF), franchissent la breche et
// CONTOURNENT la poche SAF par le nord et le sud pour se rejoindre DERRIERE elle (a l'est) = la
// poche est encerclee. Arcs et jetons partagent la meme courbe (fleche annonce -> jetons executent).
// Les targets sont AU-DELA de la poche (a l'est) ; le `bow` prononce fait passer l'arc autour d'elle.
const PINCER_TOP = { origin: { x: FRONT_X - 300, y: BREACH_Y - 210 }, target: { x: POCKET.x + 70, y: POCKET.y - 8 }, bow: 0.34 };
const PINCER_BOT = { origin: { x: FRONT_X - 300, y: BREACH_Y + 210 }, target: { x: POCKET.x + 70, y: POCKET.y + 8 }, bow: -0.34 };
const PINCER_DRAW = 45; // duree du trace de la fleche
const T_PINCER_ARROW = T_BREACH - 70; // les fleches se tracent avant la percee
const T_PINCER_MOVE = T_BREACH - 20; // les jetons s'ebranlent APRES que la fleche a commence a se tracer
const PINCER_TRAVEL = 95; // duree du deplacement des jetons le long de l'arc

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
  if (f < T_EXPLOIT) return "Puis un point cede. Une garnison se retrouve exposee.";
  if (f < T_STABILISE) return "La RSF referme la tenaille et encercle la position isolee.";
  return "La poche est prise. Ailleurs, le front tient toujours. L'impasse se deplace.";
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

        {/* Formations RSF de pression le long du front (cote ouest). Le secteur CENTRAL (breach)
            s'efface a la percee : ce sont les 2 PINCES qui prennent le relais (pas un doublon de
            jetons au centre). Les secteurs haut/bas tiennent = l'impasse continue ailleurs. */}
        {pressureYs.map((y, i) => {
          if (frame < T_PRESSURE - 10) return null;
          const isBreach = y === BREACH_Y;
          // secteur central : disparait quand les pinces s'ebranlent (evite l'amas au centre)
          if (isBreach && frame >= T_PINCER_MOVE - 20) return null;
          const fx = frontXat(y, frame);
          return (
            <HoldingFormation
              key={`rsf-${i}`}
              center={{ x: fx - 70, y }}
              faction={RSF}
              frame={frame + i * 7}
              count={3}
              spread={52}
              size={1.6}
            />
          );
        })}

        {/* POCHE SAF encerclee : au secteur central, la garnison SAF ne recule pas — elle est PIEGEE
            a POCKET et se fait envelopper par la tenaille. Les secteurs haut/bas tiennent leur ligne. */}
        {frame >= T_BREACH - 20 && (
          <HoldingFormation
            center={POCKET}
            faction={SAF}
            frame={frame}
            count={4}
            spread={30}
            size={1.5}
          />
        )}

        {/* Formations SAF qui defendent le front (cote est) — secteurs HAUT/BAS seulement (le central
            est devenu la poche encerclee ci-dessus). */}
        {pressureYs.filter((y) => y !== BREACH_Y).map((y, i) => {
          if (frame < T_PRESSURE - 10) return null;
          const fx = frontXat(y, frame);
          return (
            <HoldingFormation
              key={`saf-${i}`}
              center={{ x: fx + 70, y }}
              faction={SAF}
              frame={frame + i * 5 + 3}
              count={3}
              spread={52}
              size={1.6}
            />
          );
        })}

        {/* TENAILLE — FLECHES (intention) : les 2 axes d'encerclement se tracent avant la percee.
            Elles s'effacent une fois que les jetons les ont parcourus (l'intention est consommee par
            le mouvement). Regle : la fleche annonce, elle ne decore pas. */}
        {(() => {
          const arrowsOp = clampI(frame, T_PINCER_ARROW, T_PINCER_ARROW + 30) * clampI(frame, T_PINCER_MOVE + PINCER_TRAVEL - 10, T_PINCER_MOVE + PINCER_TRAVEL + 25, 1, 0);
          if (arrowsOp <= 0) return null;
          return (
            <g>
              <ManeuverArrow origin={PINCER_TOP.origin} target={PINCER_TOP.target} faction={RSF} frame={frame} startFrame={T_PINCER_ARROW} drawFrames={PINCER_DRAW} bow={PINCER_TOP.bow} width={9} opacity={arrowsOp} />
              <ManeuverArrow origin={PINCER_BOT.origin} target={PINCER_BOT.target} faction={RSF} frame={frame} startFrame={T_PINCER_ARROW} drawFrames={PINCER_DRAW} bow={PINCER_BOT.bow} width={9} opacity={arrowsOp} />
            </g>
          );
        })()}

        {/* TENAILLE — JETONS (execution) : 2 formations RSF partent des extremites et SUIVENT
            exactement les 2 arcs traces (memes origin/target/bow) pour converger sur la breche. */}
        {frame >= T_PINCER_MOVE && (
          <>
            <AdvancingFormation
              origin={PINCER_TOP.origin}
              front={PINCER_TOP.target}
              faction={RSF}
              frame={frame}
              startFrame={T_PINCER_MOVE}
              travelFrames={PINCER_TRAVEL}
              bow={PINCER_TOP.bow}
              size={1.7}
            />
            <AdvancingFormation
              origin={PINCER_BOT.origin}
              front={PINCER_BOT.target}
              faction={RSF}
              frame={frame}
              startFrame={T_PINCER_MOVE}
              travelFrames={PINCER_TRAVEL}
              bow={PINCER_BOT.bow}
              size={1.7}
            />
          </>
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
