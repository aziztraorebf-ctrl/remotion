// ProtoVide — PROTO DA (jetable) : concept "LE VIDE LAISSE".
//
// Idee forte (DA divergence) : on ne montre PAS d'abord les 3 pays qui s'allument.
// On montre d'abord tout ce qui les ENTOURAIT (presence militaire occidentale +
// alliances + organisation regionale CEDEAO), PUIS tout ca S'EFFACE/IMPLOSE sur
// les verbes de la narration. La sideration vient de ce qui DISPARAIT : il ne
// reste que les 3 pays dans un grand VIDE (espace negatif enorme).
// Ref : transitions "collapse" Polymatter, espace negatif.
//
// Couche PURE dessinee par-dessus la carte du moteur (contours nationaux colores
// allumes par le moteur). Recoit SahelRenderContext (frame, project lon/lat->px).
//
// Triggers narration V5 (frames @30fps, ce proto rend f0-550) :
//   f0-145  : la carte FOISONNE de presence "ancien ordre" (bases + alliances + CEDEAO)
//   f145    : "chassent leurs partenaires militaires" -> les marqueurs MILITAIRES IMPLOSENT
//   f217    : "Rompent leurs alliances" -> les LIGNES d'alliance se ROMPENT net (coupure)
//   f286-361: "quittent la principale organisation regionale" -> le cercle CEDEAO se FISSURE
//   f361-477: SILENCE VISUEL -> il ne reste QUE les 3 pays dans un grand VIDE
//   f477+   : "batissent quelque chose de nouveau" -> cristallisation discrete AES (amorce)
//
// REGLE : SVG geo-ancre via ctx.project. Frame-driven (interpolate + Easing).
// PAS de CSS transition/setTimeout/@keyframes. Palette parchemin/Sahel, pas de criard.

import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import type { SahelRenderContext } from "../engine/SahelContext";

// ============================================================
// TRIGGERS (frames @30fps, timeline du proto f0-550)
// ============================================================
const F_FOISON = 0;     // foisonnement initial (in 0-30)
const F_MILITAIRE = 145; // "chassent partenaires militaires" -> implosion bases
const F_ALLIANCE = 217;  // "Rompent alliances" -> rupture des lignes
const F_CEDEAO = 286;    // "quittent organisation regionale" -> fissure cercle CEDEAO
const F_CEDEAO_END = 361; // fin de l'effacement CEDEAO -> debut du vide
const F_NOUVEAU = 477;   // "batissent quelque chose de nouveau" -> cristallisation AES

// -------- Palette (parchemin / Sahel) --------
const INK = "#3A2A18";          // encre
const INK_DEEP = "#2A1C0E";     // encre profonde
const KAKI = "#6E6A3A";         // kaki militaire (bases occidentales)
const KAKI_DEEP = "#4F4B26";
const ALLIANCE_BLUE = "#5B7A99"; // bleu pale (liens d'alliance vers l'Europe)
const AES_GOLD = "#C99A3A";      // or AES (cristallisation finale)
const SAHEL_LAND = "#F5EFD6";    // parchemin clair (halo de reserve labels)

// -------- Coordonnees geo (lon, lat) --------
const BAMAKO: [number, number] = [-7.99, 12.65];
const OUAGA: [number, number] = [-1.52, 12.37];
const NIAMEY: [number, number] = [2.12, 13.51];
const GAO: [number, number] = [-0.04, 16.27];
const LIPTAKO: [number, number] = [-0.5, 14.5]; // centre AES

// Bases / presence militaire occidentale (positions plausibles, ancrees via project).
// Chaque base envoie un "fil" d'alliance vers le HAUT de l'ecran (Europe hors-champ).
const BASES: { coord: [number, number]; delay: number }[] = [
  { coord: NIAMEY, delay: 0 },   // Niamey (base drone)
  { coord: GAO, delay: 8 },      // Gao (Barkhane)
  { coord: OUAGA, delay: 16 },   // Ouagadougou
];

// Cercle / liseré "organisation regionale" (CEDEAO) englobant la zone des 3 pays.
// Polygone geo grossier (lon,lat) entourant Mali+Burkina+Niger.
const CEDEAO_RING: [number, number][] = [
  [-11.5, 9.0], [-9.0, 16.5], [-3.5, 18.5], [2.5, 16.5], [4.5, 12.5],
  [2.0, 9.5], [-3.0, 8.5], [-8.0, 7.5],
];

// -------- Helpers --------
// Path SVG ferme depuis une liste de points ecran.
function closedPath(pts: { x: number; y: number }[]): string {
  if (!pts.length) return "";
  return "M" + pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("L") + "Z";
}

// Path SVG lisse (courbes quadratiques via midpoints) + longueur approx.
function smoothClosedPath(pts: { x: number; y: number }[]): { d: string; len: number } {
  if (pts.length < 3) return { d: closedPath(pts), len: 0 };
  const n = pts.length;
  let d = "";
  let len = 0;
  for (let i = 0; i < n; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    const mx = (cur.x + next.x) / 2;
    const my = (cur.y + next.y) / 2;
    if (i === 0) {
      const prev = pts[n - 1];
      d = `M${((prev.x + cur.x) / 2).toFixed(1)},${((prev.y + cur.y) / 2).toFixed(1)}`;
    }
    d += ` Q${cur.x.toFixed(1)},${cur.y.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
    len += Math.hypot(next.x - cur.x, next.y - cur.y);
  }
  d += " Z";
  return { d, len };
}

type Props = {
  ctx: SahelRenderContext | null;
};

export const ProtoVide: React.FC<Props> = ({ ctx }) => {
  if (!ctx) return null;
  const { frame, width, height, project } = ctx;

  const cx = width / 2;

  // ============================================================
  // BEAT 0 — FOISONNEMENT (f0-145) : la carte est prise dans la toile.
  // Tout apparait progressivement de f0 a ~f60 (densite "ancien ordre").
  // ============================================================
  const foisonOp = interpolate(frame, [F_FOISON, F_FOISON + 40], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });

  // ============================================================
  // BEAT 1 — IMPLOSION MILITAIRE (f145) : les bases sont ASPIREES.
  // scale -> 0 + opacite -> 0, accel vers le point (Easing.in), ~12f. Pas un fondu mou.
  // ============================================================
  const F_IMPLODE_DUR = 12;

  // ============================================================
  // BEAT 2 — RUPTURE DES ALLIANCES (f217) : les fils se SECTIONNENT.
  // Le trait se coupe : les segments se retractent hors ecran (vers le haut).
  // ============================================================
  const F_RUPT_DUR = 16;
  const ruptT = interpolate(frame, [F_ALLIANCE, F_ALLIANCE + F_RUPT_DUR], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic),
  });

  // ============================================================
  // BEAT 3 — FISSURE CEDEAO (f286-361) : le cercle regional se FISSURE / s'efface.
  // Le liseré se "casse" (strokeDashoffset qui s'envole) puis disparait.
  // ============================================================
  const cedeaoPx = CEDEAO_RING.map(([lon, lat]) => project(lon, lat));
  const { d: cedeaoD, len: cedeaoLen } = smoothClosedPath(cedeaoPx);
  // Le liseré est plein f0-286, puis se desintegre f286-361 (dash qui s'agrandit + fade).
  const cedeaoBreak = interpolate(frame, [F_CEDEAO, F_CEDEAO_END], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const cedeaoOp = interpolate(frame, [F_CEDEAO, F_CEDEAO_END - 10], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // dash : segments qui s'ecartent (gap grandit) = fissuration
  const cedeaoGap = cedeaoBreak * 40;
  const cedeaoDashSeg = Math.max(2, 24 * (1 - cedeaoBreak));

  // ============================================================
  // BEAT 5 — CRISTALLISATION AES (f477+) : fines lignes qui emergent entre les 3 pays.
  // Juste AMORCER. Triangle Bamako-Ouaga-Niamey + lueur centre Liptako.
  // ============================================================
  const aesT = interpolate(frame, [F_NOUVEAU, F_NOUVEAU + 50], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const pBamako = project(BAMAKO[0], BAMAKO[1]);
  const pOuaga = project(OUAGA[0], OUAGA[1]);
  const pNiamey = project(NIAMEY[0], NIAMEY[1]);
  const pLiptako = project(LIPTAKO[0], LIPTAKO[1]);
  const aesTriD = `M${pBamako.x.toFixed(1)},${pBamako.y.toFixed(1)} L${pOuaga.x.toFixed(1)},${pOuaga.y.toFixed(1)} L${pNiamey.x.toFixed(1)},${pNiamey.y.toFixed(1)} Z`;
  const aesPerim =
    Math.hypot(pOuaga.x - pBamako.x, pOuaga.y - pBamako.y) +
    Math.hypot(pNiamey.x - pOuaga.x, pNiamey.y - pOuaga.y) +
    Math.hypot(pBamako.x - pNiamey.x, pBamako.y - pNiamey.y);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {/* ====================================================
            BEAT 3 — CERCLE CEDEAO (organisation regionale englobante).
            Present des le foisonnement (f0), se fissure f286-361.
            Dessine SOUS le reste (cadre du "vieil ordre").
            ==================================================== */}
        {cedeaoD && cedeaoOp > 0 && (
          <g style={{ mixBlendMode: "multiply" }} opacity={foisonOp * cedeaoOp}>
            {/* halo diffus du liseré (epaisseur douce) */}
            <path
              d={cedeaoD}
              fill="none"
              stroke={INK}
              strokeWidth={6}
              strokeOpacity={0.10}
              style={{ filter: "blur(3px)" }}
            />
            {/* liseré pointillé qui se fissure (gap grandit avec cedeaoBreak) */}
            <path
              d={cedeaoD}
              fill="none"
              stroke={INK_DEEP}
              strokeWidth={2.4}
              strokeOpacity={0.7}
              strokeLinecap="round"
              strokeDasharray={`${cedeaoDashSeg.toFixed(1)} ${cedeaoGap.toFixed(1)}`}
            />
          </g>
        )}
        {/* label CEDEAO (ancre en haut du cercle), disparait avec le cercle */}
        {cedeaoOp > 0 && cedeaoPx.length > 0 && (
          <text
            x={cedeaoPx[2].x}
            y={cedeaoPx[2].y - 14}
            textAnchor="middle"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontSize={22}
            fontWeight={700}
            letterSpacing={4}
            fill={INK_DEEP}
            fillOpacity={foisonOp * cedeaoOp * 0.75}
            style={{ mixBlendMode: "multiply" }}
          >
            CEDEAO
          </text>
        )}

        {/* ====================================================
            BEAT 2 — FILS D'ALLIANCE (bases -> Europe hors-champ, vers le haut).
            Pointillés bleu pale. Se SECTIONNENT f217 : le segment se retracte
            vers le haut (la partie basse glisse hors ecran), pas un fondu.
            ==================================================== */}
        {BASES.map((base, i) => {
          const p = project(base.coord[0], base.coord[1]);
          // cible hors-champ en haut (Europe). Legere divergence horizontale par base.
          const topX = cx + (p.x - cx) * 0.4 + (i - 1) * 90;
          const topY = -60;
          const fullLen = Math.hypot(topX - p.x, topY - p.y);
          // foisonnement : le fil se trace de la base vers le haut (f0-60, decale)
          const drawT = interpolate(
            frame,
            [F_FOISON + base.delay, F_FOISON + base.delay + 45],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
          );
          if (drawT <= 0) return null;
          // RUPTURE f217 : le point bas (cote base) remonte -> le trait se detache et glisse.
          // ruptT 0->1 : le bas du fil monte vers topY (le lien se rompt et part).
          const baseEndX = p.x + (topX - p.x) * ruptT;
          const baseEndY = p.y + (topY - p.y) * ruptT;
          const lineOp = (1 - ruptT) * 0.85;
          if (lineOp <= 0) return null;
          return (
            <g key={`fil-${i}`} opacity={foisonOp} style={{ mixBlendMode: "multiply" }}>
              <line
                x1={baseEndX}
                y1={baseEndY}
                x2={topX}
                y2={topY}
                stroke={ALLIANCE_BLUE}
                strokeWidth={1.8}
                strokeOpacity={lineOp}
                strokeDasharray="6 5"
                strokeDashoffset={fullLen * (1 - drawT)}
              />
            </g>
          );
        })}

        {/* ====================================================
            BEAT 1 — MARQUEURS MILITAIRES (bases occidentales) sur Niamey/Gao/Ouaga.
            Losanges kaki. IMPLOSENT f145 : scale->0 + opacite->0 (aspiration, Easing.in).
            ==================================================== */}
        {BASES.map((base, i) => {
          const p = project(base.coord[0], base.coord[1]);
          // apparition au foisonnement (pop decale)
          const appear = interpolate(
            frame,
            [F_FOISON + base.delay, F_FOISON + base.delay + 18],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) }
          );
          // IMPLOSION f145 : scale 1 -> 0, opacite 1 -> 0 (aspiration vers le point)
          const implode = interpolate(
            frame,
            [F_MILITAIRE + i * 3, F_MILITAIRE + i * 3 + F_IMPLODE_DUR],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }
          );
          const scale = Math.max(0, Math.min(appear, 1)) * implode;
          if (scale <= 0.001) return null;
          const s = 13 * scale;
          // losange (rotation 45deg via points)
          const diamond = `${p.x},${p.y - s} ${p.x + s},${p.y} ${p.x},${p.y + s} ${p.x - s},${p.y}`;
          return (
            <g key={`base-${i}`} opacity={foisonOp} style={{ mixBlendMode: "multiply" }}>
              {/* halo kaki diffus */}
              <circle cx={p.x} cy={p.y} r={s * 1.7} fill={KAKI} fillOpacity={0.18 * implode}
                style={{ filter: "blur(4px)" }} />
              {/* losange plein */}
              <polygon points={diamond} fill={KAKI} fillOpacity={0.85 * implode}
                stroke={KAKI_DEEP} strokeWidth={1.4} strokeOpacity={0.9 * implode} />
              {/* croix centrale (signe militaire) */}
              <line x1={p.x - s * 0.45} y1={p.y} x2={p.x + s * 0.45} y2={p.y}
                stroke={SAHEL_LAND} strokeWidth={1.6} strokeOpacity={0.9 * implode} />
              <line x1={p.x} y1={p.y - s * 0.45} x2={p.x} y2={p.y + s * 0.45}
                stroke={SAHEL_LAND} strokeWidth={1.6} strokeOpacity={0.9 * implode} />
            </g>
          );
        })}

        {/* ====================================================
            BEAT 5 — CRISTALLISATION AES (f477+) : amorce discrete.
            Triangle fin Bamako-Ouaga-Niamey (or) + lueur centre Liptako.
            ==================================================== */}
        {aesT > 0 && (
          <g style={{ mixBlendMode: "normal" }}>
            {/* lueur centre AES (Liptako) */}
            <circle cx={pLiptako.x} cy={pLiptako.y} r={34 * aesT} fill={AES_GOLD}
              fillOpacity={0.10 * aesT} style={{ filter: "blur(10px)" }} />
            {/* triangle qui se trace (fines lignes or qui emergent) */}
            <path
              d={aesTriD}
              fill="none"
              stroke={AES_GOLD}
              strokeWidth={1.6}
              strokeOpacity={0.65 * aesT}
              strokeLinejoin="round"
              strokeDasharray={aesPerim}
              strokeDashoffset={aesPerim * (1 - aesT)}
            />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

export default ProtoVide;
