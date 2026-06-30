/**
 * PROTO 16:9 — transposition HORIZONTALE de B5 "l'arbre aux 4 ombres".
 * BUT : MESURER l'effort de passage 9:16 -> 16:9 sur un beat connu (donnee reelle, pas supposition).
 *
 * Grammaire horizontale (doctrine SVG-MIDFORM-FORMAT) : l'oeil voyage GAUCHE->DROITE sans bouger le cadre.
 *   -> arbre DECALE a gauche (pas centre : l'horizontal aime l'asymetrie), 4 ombres qui RAYONNENT vers la
 *      DROITE (au lieu de descendre), labels qui s'etalent lateralement. Karaoke en bas, large.
 *
 * CE QUI CHANGE vs B5 vertical (le coeur de la mesure) :
 *   - viewBox 1920x1080 (au lieu de 1080x1920). Composition 1920x1080.
 *   - TREE_X/Y + TREE_S re-cales (arbre a gauche, plus petit en hauteur dispo).
 *   - angles des ombres : eventail VERS LA DROITE (-35..35 deg) au lieu de vers le bas (55..125).
 *   - zone sure labels : x max ~1820, y max ~ (au-dessus karaoke bas).
 *   - karaoke : bandeau bas large, soleil en haut-gauche.
 * CE QUI NE CHANGE PAS (l'acquis reutilise tel quel) :
 *   - CacaoTree (composant), la logique d'ombres (ombrePath ondule, drift, gouttes), le karaoke word-level
 *     (buildDisplayWords + WHISPER_WORDS), la cabosse spring, les phases 5A/5B/5C, l'audio.
 */
import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { CacaoTree } from "../components/VergerCacao";

export const B5_PONT_H_FPS = 30;
export const B5_PONT_H_FRAMES = 820;

const PARCH = "#e8dcc0";
const INK = "#2b2117";
const COCOA = "#6b4423";
const SERIF = "Georgia, 'Times New Roman', serif";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

const F_5B_START = 360;
const F_5C_START = 530;

// HORIZONTAL (V2, sans sous-titres) : arbre PLUS GRAND, sur la ligne de force gauche (regle des tiers).
// Sans karaoke, le bas est libre -> l'arbre descend plus bas et grandit, l'espace droit = respiration.
const TREE_X = 540;
const TREE_Y = 940; // pied plus bas (zone karaoke liberee)
const TREE_S = 1.05; // arbre DOMINANT (16:9 = ecran/TV, on peut se permettre du grand)
const ORIGIN_X = TREE_X;
const ORIGIN_Y = TREE_Y;

// 4 ombres qui s'etalent VERS LA DROITE (eventail horizontal). 0 deg = droite pur ; negatif = haut, positif = bas.
type Ombre = { label: string; angleDeg: number; length: number; appearF: number; drift: number; phase: number };
const OMBRES: Ombre[] = [
  { label: "CACAO", angleDeg: 4, length: 980, appearF: 40, drift: 1.15, phase: 0 },   // quasi-horizontal (1er)
  { label: "CAFÉ", angleDeg: -22, length: 900, appearF: 130, drift: 1.20, phase: 0.8 }, // monte un peu
  { label: "OR", angleDeg: 22, length: 920, appearF: 175, drift: 1.12, phase: 1.6 },   // descend un peu
  { label: "COBALT", angleDeg: -40, length: 780, appearF: 220, drift: 1.22, phase: 2.4 }, // monte plus
];
const GHOST = { angleDeg: 40, length: 760 }; // 5e ombre fantome : descend a droite

const SAFE_X_MAX = 1850;
const SAFE_Y_MIN = 120;
const SAFE_Y_MAX = 1010; // plus de karaoke -> on peut descendre les labels presque jusqu'au bord bas

// ombrePath ondule (identique a B5 vertical — REUTILISE)
const ombrePath = (angleDeg: number, length: number, baseHalfW: number, tipHalfW: number, wf: number, phase: number): string => {
  const a = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(a), dy = Math.sin(a);
  const px = -dy, py = dx;
  const P = (t: number, w: number) => ({ x: dx * t * length + px * w, y: dy * t * length + py * w });
  const wob = (t: number, k: number) => Math.sin(wf * 0.04 + phase + k) * (9 - 7 * t);
  const bR = P(0, baseHalfW), bL = P(0, -baseHalfW), tR = P(1, tipHalfW), tL = P(1, -tipHalfW);
  const cR1 = P(0.34, baseHalfW * 0.78 + wob(0.34, 0)), cR2 = P(0.7, tipHalfW * 1.6 + wob(0.7, 1.2));
  const cL2 = P(0.7, -(tipHalfW * 1.6) + wob(0.7, 2.1)), cL1 = P(0.34, -(baseHalfW * 0.78) + wob(0.34, 3.0));
  const f = (n: number) => n.toFixed(1);
  return [`M ${f(bR.x)} ${f(bR.y)}`, `C ${f(cR1.x)} ${f(cR1.y)} ${f(cR2.x)} ${f(cR2.y)} ${f(tR.x)} ${f(tR.y)}`,
    `L ${f(tL.x)} ${f(tL.y)}`, `C ${f(cL2.x)} ${f(cL2.y)} ${f(cL1.x)} ${f(cL1.y)} ${f(bL.x)} ${f(bL.y)}`, "Z"].join(" ");
};
const labelPos = (angleDeg: number, length: number) => {
  const a = (angleDeg * Math.PI) / 180;
  let lx = ORIGIN_X + Math.cos(a) * (length + 36);
  let ly = ORIGIN_Y + Math.sin(a) * (length + 36);
  lx = Math.min(SAFE_X_MAX, lx);
  ly = Math.max(SAFE_Y_MIN, Math.min(SAFE_Y_MAX, ly));
  return { x: lx, y: ly };
};

export const B5PontH: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wf = frame;

  const treeGrow = interpolate(frame, [10, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const treeAlive = interpolate(frame, [40, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sway = Math.sin(wf / 26) * 1.5 * (0.7 + 0.3 * Math.sin(wf / 40));
  const sunPulse = 0.85 + 0.15 * Math.sin(wf / 22);
  const sunGlowR = 180 + 22 * Math.sin(wf / 22);
  const ghostDraw = interpolate(frame, [F_5B_START, F_5B_START + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const ghostPulse = 0.4 + 0.25 * Math.sin(wf / 16);
  const podSpring = spring({ frame: frame - F_5C_START, fps, config: { damping: 9, stiffness: 120 }, durationInFrames: 50 });
  const podScale = frame >= F_5C_START ? podSpring : 0;
  const podPulse = 1 + 0.05 * Math.sin(wf / 14);
  const ghostLabelDraw = interpolate(frame, [F_5C_START + 30, F_5C_START + 90], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  // PROTO V2 : SANS karaoke (16:9 = ecran, son active). On garde seulement la signature.
  const sigOp = interpolate(frame, [F_5C_START + 40, F_5C_START + 90], [0, 0.78], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // CAMERA LENTE + PARALLAXE : zoom-OUT + derive. Le mouvement est applique a 2 INTENSITES selon la profondeur.
  const camScale = interpolate(frame, [0, 820], [1.06, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const camX = interpolate(frame, [0, 820], [40, -30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const camY = 20 + 8 * Math.sin(wf / 90);
  // helper : transform camera a un facteur de parallaxe p (1 = plein 1er plan, ~0.35 = fond qui bouge peu).
  const camAt = (p: number) => {
    const sc = 1 + (camScale - 1) * p;
    const tx = camX * p;
    const ty = camY * p;
    return `translate(${tx} ${ty}) translate(${TREE_X} ${TREE_Y}) scale(${sc}) translate(${-TREE_X} ${-TREE_Y})`;
  };
  const camFront = camAt(1.0);   // 1er plan (arbre + ombres)
  const camMid = camAt(0.6);     // verger lointain
  const camBack = camAt(0.28);   // ciel (nuages/oiseaux/soleil) bouge le moins

  // LUMIERE DU SOIR : sur la duree, le parchemin + le soleil glissent vers l'ambre/dore (heure doree).
  const dusk = interpolate(frame, [120, 760], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // fond parchemin -> parchemin chaud ; soleil jaune -> ambre. (mix simple par interpolation de canaux.)
  const lerpHex = (a: string, b: string, t: number) => {
    const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
    const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
    const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
    return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  };
  const bgDusk = lerpHex(PARCH, "#e7cfa3", dusk);   // parchemin -> parchemin ambre chaud
  const sunDusk = lerpHex("#f2c14e", "#e8923a", dusk); // jaune -> ambre orange (soleil couchant)

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <Audio src={staticFile("souverain/cacao-chocolat-short/audio/cacao-beat5-FINAL.mp3")} />
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {/* fond HORS camera (couvre tout l'ecran). LUMIERE DU SOIR : parchemin -> ambre chaud. */}
        <rect x={-200} y={-200} width={2320} height={1480} fill={bgDusk} />

        {/* ===== COUCHE FOND (ciel) — PARALLAXE faible (bouge le moins) ===== */}
        <g transform={camBack}>
          {/* soleil haut-gauche (vire a l'ambre au couchant) */}
          <defs>
            <radialGradient id="b5hSun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={sunDusk} stopOpacity={0.5} /><stop offset="55%" stopColor={sunDusk} stopOpacity={0.16} /><stop offset="100%" stopColor={sunDusk} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={220} cy={200} r={sunGlowR} fill="url(#b5hSun)" opacity={sunPulse} />
          <circle cx={220} cy={200} r={84} fill={sunDusk} opacity={0.95} />
          <circle cx={220} cy={200} r={84} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />
          <g stroke={sunDusk} strokeWidth={4} opacity={0.6} strokeLinecap="round">
            {Array.from({ length: 8 }, (_, k) => { const ba = (k / 8) * Math.PI * 2 + wf / 120; const len = 34 + 16 * Math.sin(wf / 18 + k); const r0 = 96, r1 = 96 + len; return <line key={k} x1={220 + Math.cos(ba) * r0} y1={200 + Math.sin(ba) * r0} x2={220 + Math.cos(ba) * r1} y2={200 + Math.sin(ba) * r1} />; })}
          </g>
          {/* NUAGES (boucle, fade aux bords) */}
          {[
            { baseX: 900, y: 230, w: 1.3, speed: 0.16, phase: 0 },
            { baseX: 1300, y: 170, w: 1.0, speed: 0.12, phase: 2 },
            { baseX: 1620, y: 300, w: 0.9, speed: 0.2, phase: 4 },
            { baseX: 560, y: 150, w: 1.1, speed: 0.14, phase: 5 },
          ].map((c, k) => {
            const range = 1600;
            const x = 160 + (((c.baseX - 160 - wf * c.speed) % range) + range) % range;
            const bob = Math.sin(wf / 30 + c.phase) * 6;
            const edgeFade = Math.min(1, Math.min(x - 160, 1760 - x) / 160);
            const op = 0.5 * Math.max(0, edgeFade);
            return (
              <g key={k} transform={`translate(${x} ${c.y + bob}) scale(${c.w})`} opacity={op}>
                <path d="M0 0 Q30 -22 62 0 T128 -6" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
                <path d="M18 14 Q52 -2 92 10" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" opacity={0.7} />
              </g>
            );
          })}
          {/* OISEAUX (droite -> gauche, boucle, fade aux bords) */}
          {[
            { y0: 380, speed: 0.55, phase: 0, flap: 0 },
            { y0: 330, speed: 0.48, phase: 1.6, flap: 2 },
            { y0: 430, speed: 0.6, phase: 3.0, flap: 1 },
          ].map((b, k) => {
            const range = 1700;
            const x = 200 + (((1700 - wf * b.speed + b.phase * 60) % range) + range) % range;
            const yDrift = b.y0 + Math.sin(wf / 40 + b.phase) * 18;
            const edgeFade = Math.min(1, Math.min(x - 200, 1900 - x) / 150);
            const op = 0.7 * Math.max(0, edgeFade);
            const flap = Math.sin(wf / 4 + b.flap) * 8;
            const wingY = -Math.abs(Math.sin(wf / 4 + b.flap)) * 6;
            if (op <= 0.01) return null;
            return (<g key={k} transform={`translate(${x} ${yDrift})`} opacity={op}><path d={`M-22 ${wingY} Q-8 ${-6 - flap} 0 0 Q8 ${-6 - flap} 22 ${wingY}`} fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" /></g>);
          })}
        </g>

        {/* ===== COUCHE MEDIANE (verger lointain + horizon) — PARALLAXE moyenne ===== */}
        <g transform={camMid}>
          {/* brume d'horizon (separe les plans) */}
          <rect x={-200} y={690} width={2320} height={90} fill="#efe6cf" opacity={0.55} />
          {/* arbres lointains COLORES, etages 2 distances */}
          {[
            { x: 1010, y: 724, s: 0.32, ph: 4.1, tone: 1, op: 0.7 },
            { x: 1660, y: 726, s: 0.34, ph: 2.9, tone: 2, op: 0.72 },
            { x: 1230, y: 752, s: 0.46, ph: 0.5, tone: 1, op: 0.92 },
            { x: 1470, y: 758, s: 0.42, ph: 1.7, tone: 2, op: 0.9 },
          ].map((b, k) => {
            const ap = interpolate(frame, [20 + k * 12, 90 + k * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
            if (ap <= 0.001) return null;
            const bSway = Math.sin(wf / 30 + b.ph) * 1.1;
            return (
              <g key={k} transform={`translate(${b.x} ${b.y}) scale(${b.s})`} opacity={ap * b.op}>
                <g transform={`rotate(${bSway} 0 0)`}><CacaoTree alive={1} grow={1} tone={b.tone} /></g>
              </g>
            );
          })}
          {/* horizon */}
          <path d="M0 765 C400 752 800 778 1100 772 C1500 766 1750 754 1920 768" fill="none" stroke={INK} strokeWidth={2.4} opacity={0.5} />
        </g>

        {/* ===== COUCHE 1er PLAN (arbre heros + ombres) — PARALLAXE pleine ===== */}
        <g transform={camFront}>
        <ellipse cx={TREE_X} cy={TREE_Y + 8} rx={120} ry={18} fill={INK} opacity={0.08} />
        {/* OMBRES (origine = pied arbre, rayonnent a droite) */}
        <g transform={`translate(${ORIGIN_X} ${ORIGIN_Y})`}>
          {OMBRES.map((o, i) => {
            const grow = interpolate(frame, [o.appearF, o.appearF + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
            if (grow <= 0.001) return null;
            const drift = interpolate(frame, [F_5B_START, 820], [1, o.drift], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const len = o.length * grow * drift;
            const d = ombrePath(o.angleDeg, len, 30, 6, wf, o.phase);
            const lp = labelPos(o.angleDeg, len);
            const labelOp = interpolate(grow, [0.6, 1], [0, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const a = (o.angleDeg * Math.PI) / 180;
            const dropletStart = F_5B_START + i * 15;
            const drops = frame >= dropletStart ? [0, 45].map((off, di) => { const tt = (((frame - dropletStart + off) % 90) / 90); const dxp = Math.cos(a) * tt * len; const dyp = Math.sin(a) * tt * len; const op = interpolate(tt, [0, 0.2, 0.8, 1], [0, 0.55, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); const rr = interpolate(tt, [0, 1], [5, 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return { key: di, x: dxp, y: dyp, op, rr }; }) : [];
            return (
              <g key={i}>
                <path d={d} fill={INK} opacity={0.32} />
                {drops.map((dr) => <ellipse key={dr.key} cx={dr.x} cy={dr.y} rx={dr.rr} ry={dr.rr * 0.62} transform={`rotate(${o.angleDeg} ${dr.x} ${dr.y})`} fill={INK} opacity={dr.op} />)}
                <text x={lp.x - ORIGIN_X} y={lp.y - ORIGIN_Y} fontFamily={SERIF} fontSize={40} fontWeight={700} fill={INK} opacity={labelOp} textAnchor="start" dominantBaseline="middle">{o.label}</text>
              </g>
            );
          })}
          {/* 5e ombre fantome */}
          {ghostDraw > 0.001 && (() => {
            const len = GHOST.length * ghostDraw; const a = (GHOST.angleDeg * Math.PI) / 180; const ex = Math.cos(a) * len, ey = Math.sin(a) * len;
            return (
              <g opacity={ghostPulse}>
                <line x1={0} y1={0} x2={ex} y2={ey} stroke={INK} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 16" opacity={0.55} />
                {ghostLabelDraw > 0.001 && <text x={Math.cos(a) * (len + 32)} y={Math.sin(a) * (len + 32)} fontFamily={SERIF} fontSize={48} fontWeight={700} fill={INK} opacity={0.4 + ghostLabelDraw} textAnchor="middle" dominantBaseline="middle">?</text>}
              </g>
            );
          })()}
        </g>

        {/* ARBRE (gauche, en couleur) */}
        {treeGrow > 0.001 && (
          <g transform={`translate(${TREE_X} ${TREE_Y}) scale(${TREE_S})`}>
            <g transform={`rotate(${sway} 0 0)`}>
              <CacaoTree alive={treeAlive} grow={treeGrow} tone={0} />
              {podScale > 0.001 && (
                <g transform={`translate(8 -120) scale(${podScale * podPulse})`} style={{ transformOrigin: "0px 0px" }}>
                  <ellipse cx={0} cy={0} rx={26} ry={46} fill="#a26432" stroke={INK} strokeWidth={3.4} />
                  <path d="M0 -42 L0 40 M-14 -34 C-6 -16 -6 14 -14 30 M14 -34 C6 -16 6 14 14 30" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
                  <circle cx={0} cy={0} r={56} fill="#f2c14e" opacity={0.12 + 0.06 * Math.sin(wf / 14)} />
                </g>
              )}
            </g>
          </g>
        )}

        </g>{/* === fin COUCHE 1er PLAN === */}
      </svg>

      {/* SANS SOUS-TITRES (16:9 = ecran/TV, son active). Seule la signature reste, discrete en bas-droite. */}
      <div style={{ position: "absolute", bottom: 36, right: 60, opacity: sigOp, color: INK, fontFamily: SERIF, fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>GéoAfrique</div>
    </AbsoluteFill>
  );
};
