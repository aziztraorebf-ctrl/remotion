// ════════════════════════════════════════════════════════════════════════════
// SahelHookActe1 — NOUVEAU HOOK (0-30s) refondu (Aziz 2026-06-15)
// ════════════════════════════════════════════════════════════════════════════
// Remplace le hook "dashboard mou" (carte beige + légende + timeline + gros blocs
// de couleur) par un "mini-TikTok visuel" — gabarit A "carte qui se transforme".
// Grammaire = celle validée en P3/P4 : contours nationaux qui se tracent/flashent
// (PAS de gros sahel-fill), carte opaque, zéro légende, zéro timeline.
//
// DA-brief 3 voix (Gemini+Kimi+DeepSeek) : memory/episodes/warmap-sahel/da-briefs/.
// Audio CONSERVÉ (v5 expressive). Triggers calés sur narration-v5-alignment.json :
//   "changé" f79 · "chassent" f144 · "rompent" f217 · "quittent" f286 ·
//   "bâtissent" f408 · "comment" f523 · "pourquoi" f603 · "avant" f783.
//
// Pattern <PartieX> : composant PUR, reçoit ctx (project/frame/width/height) + map.
// Dessine SA couche SVG/DOM par-dessus la carte. Ne possède pas la map.
// ════════════════════════════════════════════════════════════════════════════
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig, Easing, staticFile } from "remotion";
import { Flag, Coins, Atom, Droplet, Skull, AlertTriangle } from "lucide-react";
import type { SahelRenderContext } from "../engine/SahelContext";
import { MALI_RING, NIGER_RING, BURKINA_RING } from "./sahelCountries";

// Palette (charte War-Map)
const C_MALI = "#D98A3D";     // ocre
const C_BURKINA = "#C0553C";  // brique
const C_NIGER = "#4E8C7D";    // sarcelle
const OR_AES = "#C9A24B";
const INK = "#2a2118";
const PARCH = "#E8DCC8";

// Coordonnées
const BAMAKO: [number, number] = [-8.00, 12.65];
const OUAGA: [number, number] = [-1.52, 12.37];
const NIAMEY: [number, number] = [2.12, 13.51];
const AES_CENTER: [number, number] = [-1.0, 14.5];

// ── Triggers v5 (frames absolues) ──
const F_COLD = 0;          // cold-open (tremblement+flash+boom)
const F_CHANGE = 79;       // "changé" — 3 contours tracés
const F_CHASSENT = 144;    // "chassent" — expulsion militaires
const F_ROMPENT = 217;     // "rompent" — liens qui claquent
const F_QUITTENT = 286;    // "quittent" — sortie CEDEAO
const F_BATISSENT = 408;   // "bâtissent" — transformation + sceau AES
const F_COMMENT = 523;     // "comment" — question 1
const F_POURQUOI = 603;    // "pourquoi" — question 2
const F_AVANT = 783;       // "avant" — transition + paradoxe
const F_HOOK_END = 870;    // fin du hook (~29s), raccord vers le corps Acte 1

type Ring = [number, number][];

// Construit un path SVG fermé depuis un ring projeté, + longueur approx (pour stroke-dashoffset)
function ringPath(ring: Ring, P: (lon: number, lat: number) => { x: number; y: number }) {
  let d = "";
  let len = 0;
  let prev: { x: number; y: number } | null = null;
  for (let i = 0; i < ring.length; i++) {
    const p = P(ring[i][0], ring[i][1]);
    d += `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    if (prev) len += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
  }
  return { d: d + "Z", len };
}

export const SahelHookActe1: React.FC<{ ctx: SahelRenderContext | null }> = ({ ctx }) => {
  const { fps } = useVideoConfig();
  if (!ctx) return null;
  const { frame, width, height, project } = ctx;
  if (frame > F_HOOK_END + 20) return null; // le hook ne dessine que sur 0-30s
  const P = (c: [number, number]) => project(c[0], c[1]);
  const vmin = Math.min(width, height) / 100;

  // ════════════════ 0. COLD-OPEN (0-3s) : tremblement + grain + flash + (boom via SFX moteur) ════════════════
  const shakeT = interpolate(frame, [0, 18, 30], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shakeX = Math.sin(frame * 2.3) * 7 * shakeT;
  const shakeY = Math.cos(frame * 3.1) * 5 * shakeT;
  const flash = interpolate(frame, [0, 4, 12], [0.85, 0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ════════════════ Les 3 contours nationaux (tracé séquentiel + pulse) ════════════════
  const countries: { ring: Ring; color: string; at: number }[] = [
    { ring: MALI_RING, color: C_MALI, at: F_CHANGE - 2 },
    { ring: BURKINA_RING, color: C_BURKINA, at: F_CHANGE + 22 },
    { ring: NIGER_RING, color: C_NIGER, at: F_CHANGE + 46 },
  ];

  // ════════════════ Assombrissement global (WarMapDimmedOverlay-like) qui guide le regard ════════════════
  // Forte au début (focus contours), s'allège à la transformation.
  const dim = interpolate(frame,
    [F_CHANGE - 10, F_CHANGE + 10, F_BATISSENT, F_BATISSENT + 40, F_AVANT - 10, F_AVANT + 20],
    [0.78, 0.55, 0.55, 0.30, 0.30, 0.62],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ════════════════ 2. CHASSENT (4.6-7.1s) : drapeaux militaires éjectés ════════════════
  const expelT = (delay: number) => {
    const sp = spring({ frame: frame - (F_CHASSENT + delay), fps, config: { damping: 14, stiffness: 90, mass: 0.6 } });
    return sp; // 0→1
  };
  const expelOp = interpolate(frame, [F_CHASSENT - 14, F_CHASSENT - 2, F_CHASSENT + 4, F_CHASSENT + 60],
    [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ════════════════ 3. ROMPENT (7.2-9.3s) : liens dorés qui claquent ════════════════
  const linkDraw = interpolate(frame, [F_ROMPENT - 18, F_ROMPENT - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const linkSnap = interpolate(frame, [F_ROMPENT, F_ROMPENT + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const linkOp = interpolate(frame, [F_ROMPENT - 18, F_ROMPENT - 6, F_ROMPENT + 20, F_ROMPENT + 40],
    [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ════════════════ 4. QUITTENT (9.4-12.6s) : cercle CEDEAO + sortie ════════════════
  const cedeaoOp = interpolate(frame, [F_QUITTENT - 20, F_QUITTENT - 4, F_QUITTENT + 50, F_QUITTENT + 70],
    [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cedeaoBreak = interpolate(frame, [F_QUITTENT, F_QUITTENT + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // ════════════════ 5. BÂTISSENT (13.5-16.2s) : sceau AES tamponné ════════════════
  const sceauSpring = spring({ frame: frame - F_BATISSENT, fps, config: { damping: 8, stiffness: 100, mass: 0.9 } });
  const sceauOp = interpolate(frame, [F_BATISSENT, F_BATISSENT + 12, F_COMMENT - 20, F_COMMENT],
    [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // teinte de guerre (la carte géo devient carte de guerre) : montée d'un voile rouge sourd diffus
  const warTint = interpolate(frame, [F_BATISSENT - 6, F_BATISSENT + 30, F_COMMENT - 10],
    [0, 0.5, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ════════════════ 6. QUESTIONS (17.4-21s) : typo massive plein écran ════════════════
  const q1 = frame >= F_COMMENT && frame < F_AVANT;
  const q1Op = interpolate(frame, [F_COMMENT, F_COMMENT + 10, F_AVANT - 14, F_AVANT - 4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const q2Op = interpolate(frame, [F_POURQUOI, F_POURQUOI + 10, F_AVANT - 14, F_AVANT - 4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const qPulse = 1 + 0.03 * Math.sin((frame - F_COMMENT) * 0.18);
  const qDim = interpolate(frame, [F_COMMENT - 6, F_COMMENT + 8, F_AVANT - 10, F_AVANT], [0, 0.82, 0.82, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ════════════════ 7. AVANT (22.7-28.5s) : transition temporelle + PARADOXE (Aziz : à 22s) ════════════════
  const paradoxOp = interpolate(frame, [F_AVANT, F_AVANT + 14, F_HOOK_END - 20, F_HOOK_END],
    [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const greyVeil = interpolate(frame, [F_AVANT, F_AVANT + 24], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cap = { ml: P(BAMAKO), bf: P(OUAGA), ne: P(NIAMEY) };
  const center = P(AES_CENTER);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", transform: `translate(${shakeX}px,${shakeY}px)` }}>

      {/* ════ ASSOMBRISSEMENT (guide le regard, grammaire P4) ════ */}
      {dim > 0.01 && <AbsoluteFill style={{ background: `rgba(10,8,5,${dim})` }} />}

      {/* ════ TEINTE DE GUERRE (carte géo → carte de guerre) ════ */}
      {warTint > 0.01 && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, rgba(120,30,30,${warTint * 0.5}) 0%, transparent 70%)`, mixBlendMode: "multiply" }} />}

      {/* ════ CONTOURS NATIONAUX (tracé séquentiel + pulse + flash) — grammaire P4 ════ */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {countries.map((c, i) => {
          const { d, len } = ringPath(c.ring, project);
          const lc = frame - c.at;
          if (lc < -2) return null;
          const draw = interpolate(lc, [0, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          const flashC = interpolate(lc, [24, 32, 46], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // pulse récurrent léger (vie)
          const pulse = 0.7 + 0.3 * Math.sin(lc * 0.06);
          const fillOp = interpolate(lc, [26, 50], [0, 0.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <g key={i}>
              {/* léger fill national (PAS un gros bloc — juste une teinte qui respire) */}
              <path d={d} fill={c.color} fillOpacity={fillOp * pulse} />
              {/* contour qui se trace */}
              <path d={d} fill="none" stroke={c.color} strokeWidth={vmin * (0.34 + flashC * 0.4)}
                strokeOpacity={0.95} strokeLinejoin="round"
                strokeDasharray={len} strokeDashoffset={len * (1 - draw)}
                style={{ filter: flashC > 0.05 ? `drop-shadow(0 0 ${flashC * 10}px ${c.color})` : undefined }} />
            </g>
          );
        })}

        {/* ════ 3. ROMPENT : liens dorés capitales→extérieur qui claquent ════ */}
        {linkOp > 0.01 && (() => {
          // 3 liens partant des capitales vers le haut (extérieur = alliances rompues)
          const ext: { from: { x: number; y: number }; to: { x: number; y: number } }[] = [
            { from: cap.ml, to: { x: cap.ml.x - width * 0.18, y: -height * 0.05 } },
            { from: cap.bf, to: { x: cap.bf.x, y: -height * 0.05 } },
            { from: cap.ne, to: { x: cap.ne.x + width * 0.18, y: -height * 0.05 } },
          ];
          return ext.map((l, i) => {
            const mx = (l.from.x + l.to.x) / 2, my = (l.from.y + l.to.y) / 2;
            const fullLen = Math.hypot(l.to.x - l.from.x, l.to.y - l.from.y);
            // avant snap : trait doré entier (drawn). après snap : la moitié se rétracte
            const half = linkSnap;
            const color = linkSnap > 0.05 ? "#9a3b2c" : OR_AES;
            return (
              <g key={`lk-${i}`} opacity={linkOp}>
                {/* segment from→milieu (reste) */}
                <line x1={l.from.x} y1={l.from.y}
                  x2={l.from.x + (mx - l.from.x) * (1 - half * 0.15)} y2={l.from.y + (my - l.from.y) * (1 - half * 0.15)}
                  stroke={color} strokeWidth={vmin * 0.18}
                  strokeDasharray={fullLen} strokeDashoffset={fullLen * (1 - linkDraw)} strokeLinecap="round" />
                {/* segment milieu→to (se rétracte vers le haut au snap) */}
                <line x1={l.to.x - (l.to.x - mx) * (1 - half)} y1={l.to.y - (l.to.y - my) * (1 - half)}
                  x2={l.to.x} y2={l.to.y}
                  stroke={color} strokeWidth={vmin * 0.18} opacity={1 - half}
                  strokeDasharray={fullLen} strokeDashoffset={fullLen * (1 - linkDraw)} strokeLinecap="round" />
                {/* éclat au point de rupture */}
                {linkSnap > 0.05 && linkSnap < 0.7 && (
                  <circle cx={mx} cy={my} r={vmin * (0.3 + linkSnap * 1.2)} fill="none" stroke="#c94" strokeWidth={vmin * 0.08} opacity={(1 - linkSnap) * 0.8} />
                )}
              </g>
            );
          });
        })()}

        {/* ════ 4. QUITTENT : cercle CEDEAO qui se brise ════ */}
        {cedeaoOp > 0.01 && (() => {
          const r = vmin * 30 * (1 + cedeaoBreak * 0.06);
          const dash = 2 * Math.PI * r;
          return (
            <circle cx={center.x} cy={center.y} r={r} fill="none"
              stroke={cedeaoBreak > 0.1 ? "#7a7268" : OR_AES}
              strokeWidth={vmin * (0.22 - cedeaoBreak * 0.1)}
              strokeOpacity={cedeaoOp * (1 - cedeaoBreak * 0.5)}
              strokeDasharray={cedeaoBreak > 0.1 ? `${vmin * 1.2} ${vmin * 1.5}` : `${dash}`}
              strokeDashoffset={0} />
          );
        })()}
      </svg>

      {/* ════ 2. CHASSENT : drapeaux militaires éjectés (DOM, géo-ancrés) ════ */}
      {expelOp > 0.01 && (["ml", "bf", "ne"] as const).map((k, i) => {
        const c = cap[k];
        const sp = expelT(i * 5);
        const ty = -sp * height * 0.65;       // monte et sort par le haut
        const rot = sp * 60 * (i % 2 === 0 ? 1 : -1);
        return (
          <div key={`ex-${k}`} style={{ position: "absolute", left: c.x, top: c.y,
            transform: `translate(-50%,-50%) translateY(${ty}px) rotate(${rot}deg)`, opacity: expelOp * (1 - sp * 0.7) }}>
            <div style={{ width: vmin * 4.2, height: vmin * 4.2, borderRadius: "50%", background: "#1f3a5f",
              display: "flex", alignItems: "center", justifyContent: "center", border: `${vmin * 0.25}px solid #cdd6e0`, boxShadow: "0 3px 8px rgba(0,0,0,0.5)" }}>
              <Flag size={vmin * 2.4} color="#dde6f0" strokeWidth={2.4} />
            </div>
          </div>
        );
      })}

      {/* ════ 5. BÂTISSENT : sceau AES tamponné au centre ════ */}
      {sceauOp > 0.01 && (
        <div style={{ position: "absolute", left: center.x, top: center.y,
          transform: `translate(-50%,-50%) scale(${Math.min(1.05, sceauSpring)})`, opacity: sceauOp }}>
          <svg width={vmin * 22} height={vmin * 22} viewBox="-110 -110 220 220" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))" }}>
            <circle r={104} fill="#16130c" opacity={0.92} />
            <circle r={96} fill="none" stroke={OR_AES} strokeWidth={5} />
            <circle r={80} fill="none" stroke="#F4ECD8" strokeWidth={2.5} opacity={0.7} />
            <text y={-8} textAnchor="middle" fontSize={34} fontWeight={800} fill={OR_AES} fontFamily="Georgia, serif" letterSpacing={3}>AES</text>
            <text y={30} textAnchor="middle" fontSize={15} fill="#E6D9B8" fontFamily="Georgia, serif" letterSpacing={2}>2024</text>
          </svg>
        </div>
      )}

      {/* ════ 6. QUESTIONS : typo massive plein écran (boucle ouverte) ════ */}
      {qDim > 0.01 && <AbsoluteFill style={{ background: `rgba(8,6,4,${qDim})` }} />}
      {(q1 || q2Op > 0.01) && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: vmin * 2 }}>
          <div style={{ opacity: q1Op, transform: `scale(${qPulse})`,
            fontFamily: "Georgia, serif", fontWeight: 800, fontSize: vmin * 6.2, color: "#F2ECDC",
            letterSpacing: 2, textShadow: "0 3px 18px rgba(0,0,0,0.9)", textAlign: "center" }}>
            Comment est-ce possible ?
          </div>
          <div style={{ opacity: q2Op, transform: `scale(${qPulse})`,
            fontFamily: "Georgia, serif", fontWeight: 800, fontSize: vmin * 7.4, color: OR_AES,
            letterSpacing: 2, textShadow: "0 3px 18px rgba(0,0,0,0.95)", textAlign: "center" }}>
            Pourquoi maintenant ?
          </div>
        </AbsoluteFill>
      )}

      {/* ════ 7. AVANT : voile gris + PARADOXE (richesses ↔ drame) ════ */}
      {greyVeil > 0.01 && <AbsoluteFill style={{ background: `rgba(70,68,64,${greyVeil})`, mixBlendMode: "multiply" }} />}
      {paradoxOp > 0.01 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: paradoxOp }}>
          <div style={{ display: "flex", alignItems: "center", gap: vmin * 3 }}>
            {/* richesses */}
            <div style={{ display: "flex", gap: vmin * 1.2 }}>
              {[Coins, Atom, Droplet].map((Ic, i) => (
                <div key={i} style={{ width: vmin * 6, height: vmin * 6, borderRadius: "50%", background: "#F2EACF",
                  border: `${vmin * 0.3}px solid ${OR_AES}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(0,0,0,0.4)" }}>
                  <Ic size={vmin * 3.2} color={OR_AES} strokeWidth={2} />
                </div>
              ))}
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: vmin * 6, color: "#F2ECDC", fontWeight: 800 }}>≠</div>
            {/* drame */}
            <div style={{ display: "flex", gap: vmin * 1.2 }}>
              {[Skull, AlertTriangle].map((Ic, i) => (
                <div key={i} style={{ width: vmin * 6, height: vmin * 6, borderRadius: "50%", background: "#2a1818",
                  border: `${vmin * 0.3}px solid #8B2020`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 8px rgba(0,0,0,0.4)" }}>
                  <Ic size={vmin * 3.2} color="#d98a8a" strokeWidth={2} />
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ════ COLD-OPEN flash (par-dessus tout, début) ════ */}
      {flash > 0.01 && <AbsoluteFill style={{ background: "#fff", opacity: flash }} />}
    </AbsoluteFill>
  );
};
