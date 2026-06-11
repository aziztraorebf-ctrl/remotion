/**
 * GeoConvergenceOverlay — overlay PREMIUM "rayon d'action → convergence" (war-map, D-8 + D-9).
 *
 * Issu du DA-BRIEF-GATE (Gemini "GeoConvergence" + Kimi "Collapsing Range" convergents, 2026-06-10).
 * Raconte "présence pré-positionnée → réaction instantanée", PAS juste "il y avait des forces".
 *
 * Séquence (frame-driven) :
 *   1. PHASE PRÉSENCE  : 3 forces ancrées dans leur DIRECTION GÉO réelle, chacune avec un RAYON D'ACTION
 *      (InfluenceZone : cercle pointillé bleu-FR qui pulse lentement = "elles étaient déjà là").
 *   2. PHASE DÉCLENCHEUR ("le jour même") : les rayons se CONTRACTENT, des courbes Bézier dorées se
 *      tracent des forces vers Bamako, des particules déphasées convergent SIMULTANÉMENT.
 *   3. PHASE IMPACT : Mali (ping radar) fait un heroBouncePop + flash bref ; total "~1650" s'installe.
 *
 * Améliorations DA appliquées : ancrage directionnel géo (anti-symétrie), Mali = ping (pas gros cercle),
 * Bézier + particules déphasées, stagger narratif, grain + drop-shadow léger, total arrondi 1650,
 * voile à masque radial (carte respire vers les bords).
 *
 * Conçu pour render ISOLÉ d'abord (GeoConvergenceDemo) puis intégration sur carte.
 */
import React from "react";
import {
  AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Easing, random, staticFile,
} from "remotion";
import type { LucideIcon } from "lucide-react";

const C = {
  veil:    "#F4ECD8",
  ink:     "#1E2A22",
  inkSoft: "#4A5648",
  gold:    "#C9A227",
  goldDeep:"#A8852F",
  fr:      "#2E3A59",
  frSoft:  "#43507A",
  node:    "#FBF6E9",
} as const;

const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
const hexA = (a: number) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0").toUpperCase();

export type GeoForce = {
  op: string;
  country: string;
  effectif: number;        // hommes (CountUp). 0 + effectifText pour "forces spéciales"
  effectifText?: string;
  // INCARNATION : jeton-acteur (notre grammaire D-6) — sprite dans le disque. Prioritaire sur Icon.
  token?: string;          // chemin staticFile (ex: "_shared/sprites/warmap/fighter-france.png")
  Icon?: LucideIcon;       // fallback pictogramme Lucide si pas de token
  // ancrage DIRECTIONNEL : angle (deg, 0=est, sens horaire) + rayon depuis le centre (px).
  angleDeg: number;
  radius: number;
  reach: number;           // rayon d'action initial (px) — "rayon d'action déjà présent"
  appearAt: number;        // frame d'apparition (stagger narratif)
};

type Props = {
  startFrame: number;
  holdFrames: number;
  surtitle: string;
  forces: GeoForce[];
  center: { x: number; y: number };
  total: number;
  footer: string;
  trigger: number;         // frame relative où "le jour même" déclenche la convergence
  veilAlpha?: number;
  scale?: number;
};

const NODE_R = 58;
const W = 1280, H = 720;

export const GeoConvergenceOverlay: React.FC<Props> = ({
  startFrame, holdFrames, surtitle, forces, center, total, footer, trigger,
  veilAlpha = 0.70, scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  if (local < 0 || local > holdFrames) return null;

  const veilOp = Math.min(
    interpolate(local, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(local, [holdFrames - 18, holdFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  if (veilOp <= 0) return null;

  const titleOp = interpolate(local, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(local, [6, 22], [0, 110], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EXPO });

  // position d'un nœud depuis angle+radius (ancrage directionnel géo)
  const nodePos = (f: GeoForce) => {
    const a = (f.angleDeg * Math.PI) / 180;
    return { x: center.x + Math.cos(a) * f.radius, y: center.y + Math.sin(a) * f.radius };
  };

  // flash bref au déclenchement
  const flashOp = interpolate(local, [trigger, trigger + 3, trigger + 10], [0, 0.22, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Mali ping radar : intensité monte à l'arrivée des flux
  const arriveFrame = trigger + 30;
  const maliPop = spring({ frame: local - arriveFrame, fps, config: { damping: 12, stiffness: 90, mass: 1 } });

  return (
    <AbsoluteFill style={{ opacity: veilOp, fontFamily: "Georgia, 'Cormorant Garamond', serif" }}>
      {/* voile à MASQUE RADIAL : opaque au centre (lisibilité), s'estompe vers les bords (carte respire) */}
      <AbsoluteFill style={{
        background: `radial-gradient(72% 66% at 50% 50%, ${C.veil}${hexA(veilAlpha)} 38%, ${C.veil}${hexA(veilAlpha * 0.45)} 100%)`,
      }} />
      {/* halo doré doux */}
      <AbsoluteFill style={{ background: "radial-gradient(55% 50% at 50% 48%, rgba(201,162,39,0.10), transparent 70%)" }} />
      {/* flash bref au déclenchement */}
      <AbsoluteFill style={{ background: "#FBF6E9", opacity: flashOp }} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", width: W, height: H, transform: `scale(${scale})` }}>

          {/* sur-titre */}
          <div style={{ position: "absolute", top: 6, width: "100%", textAlign: "center", opacity: titleOp }}>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 8, color: C.ink, textTransform: "uppercase" }}>{surtitle}</div>
            <div style={{ margin: "12px auto 0", height: 3, width: lineW, borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
          </div>

          <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {/* RAYONS D'ACTION (InfluenceZone) — présence dormante, se contractent au trigger */}
            {forces.map((f, i) => {
              const p = nodePos(f);
              const appear = interpolate(local, [f.appearAt, f.appearAt + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EXPO });
              // contraction au trigger : reach -> NODE_R
              const contract = interpolate(local, [trigger, trigger + 22], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EXPO });
              const r = NODE_R + (f.reach - NODE_R) * contract;
              const pulse = 1 + 0.04 * Math.sin((local - f.appearAt) * 0.05 + i);
              const op = appear * (0.10 + 0.10 * contract);
              return (
                <circle key={`reach-${i}`} cx={p.x} cy={p.y} r={r * pulse} fill={C.fr} fillOpacity={op * 0.5}
                  stroke={C.fr} strokeWidth={1.5} strokeDasharray="4 6" strokeOpacity={op * 2.4} />
              );
            })}

            {/* FLUX Bézier force -> Bamako (se tracent au trigger) + particules déphasées */}
            {forces.map((f, i) => {
              const p = nodePos(f);
              const dx = center.x - p.x, dy = center.y - p.y;
              const len0 = Math.hypot(dx, dy);
              const ux = dx / len0, uy = dy / len0;
              const ax = p.x + ux * NODE_R, ay = p.y + uy * NODE_R;
              const bx = center.x - ux * 30, by = center.y - uy * 30;
              // contrôle Bézier décalé perpendiculairement (courbe balistique)
              const perp = i % 2 === 0 ? 1 : -1;
              const ctlx = (ax + bx) / 2 + (-uy) * 60 * perp;
              const ctly = (ay + by) / 2 + (ux) * 60 * perp;
              const d = `M ${ax} ${ay} Q ${ctlx} ${ctly} ${bx} ${by}`;
              const draw = interpolate(local, [trigger + 2, trigger + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EXPO });
              // bezier point at t
              const bez = (t: number) => ({
                x: (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * ctlx + t * t * bx,
                y: (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * ctly + t * t * by,
              });
              const headAng = (() => { const e = bez(0.999), s = bez(0.95); return (Math.atan2(e.y - s.y, e.x - s.x) * 180) / Math.PI; })();
              const headOp = interpolate(draw, [0.85, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const headP = bez(1);
              // particules déphasées (random offset par flux)
              const phase0 = random(`prepo-${i}`) * 0.6;
              const parts = [0, 0.4, 0.8].map((ph, j) => {
                const speed = 0.016 + random(`sp-${i}-${j}`) * 0.006;
                const t = ((local - trigger) * speed + ph + phase0) % 1;
                const pt = bez(t);
                return { ...pt, op: draw >= 0.9 ? Math.sin(t * Math.PI) * 0.8 : 0 };
              });
              return (
                <g key={`flux-${i}`}>
                  <path d={d} fill="none" stroke={C.gold} strokeWidth={4} strokeLinecap="round"
                    strokeDasharray={len0 * 1.3} strokeDashoffset={len0 * 1.3 * (1 - draw)} opacity={0.5} />
                  {parts.map((pp, j) => (
                    <circle key={j} cx={pp.x} cy={pp.y} r={6} fill={C.goldDeep} opacity={pp.op} />
                  ))}
                  <g transform={`translate(${headP.x} ${headP.y}) rotate(${headAng})`} opacity={headOp * 0.9}>
                    <path d="M 0 0 L -16 -7 L -10 0 L -16 7 Z" fill={C.goldDeep} />
                  </g>
                </g>
              );
            })}

            {/* MALI — ping radar (pas gros cercle). Ondes concentriques + point. */}
            {[0, 1, 2].map((k) => {
              const t0 = arriveFrame + k * 8;
              const pr = interpolate(local, [t0, t0 + 40], [0, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EXPO });
              const po = interpolate(local, [t0, t0 + 40], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <circle key={`ping-${k}`} cx={center.x} cy={center.y} r={pr} fill="none" stroke={C.fr} strokeWidth={2} opacity={po} />;
            })}
            <circle cx={center.x} cy={center.y} r={7 + 2 * Math.max(0, maliPop)} fill={C.fr} opacity={interpolate(local, [6, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
          </svg>

          {/* label Mali (discret) */}
          <div style={{ position: "absolute", left: center.x, top: center.y + 16, transform: "translateX(-50%)",
            fontSize: 22, fontWeight: 700, color: C.ink, opacity: interpolate(local, [10, 22], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>Mali</div>

          {/* NŒUDS FORCES — fond navy semi-transp, icône gold (inversé, DA), drop-shadow doré léger */}
          {forces.map((f, i) => {
            const p = nodePos(f);
            const s = spring({ frame: local - f.appearAt, fps, config: { damping: 15, stiffness: 120, mass: 0.7 } });
            const pop = Math.max(0, s);
            const float = 3 * Math.sin((local - f.appearAt) * 0.05 + i);
            // dim quand le total apparaît (focus centre, DA)
            const dim = interpolate(local, [trigger + 44, trigger + 60], [1, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const labOp = interpolate(local, [f.appearAt + 6, f.appearAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const cval = Math.round(interpolate(local, [f.appearAt + 10, f.appearAt + 40], [0, f.effectif], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) }));
            // côté label
            const right = p.x >= center.x;
            return (
              <div key={`node-${i}`} style={{
                position: "absolute", left: p.x, top: p.y + float,
                transform: `translate(-50%,-50%) scale(${pop})`, opacity: dim,
                display: "flex", flexDirection: "column", alignItems: "center",
              }}>
                <div style={{
                  width: NODE_R * 2, height: NODE_R * 2, borderRadius: "50%",
                  background: f.token ? C.node : `${C.fr}E0`,
                  border: `3px solid ${C.gold}`,
                  filter: "drop-shadow(0 2px 6px rgba(46,58,89,0.30))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                }}>
                  {f.token ? (
                    <img src={staticFile(f.token)} alt={f.op}
                      style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "center 22%",
                        transform: "translateY(4%)" }} />
                  ) : f.Icon ? (
                    <f.Icon size={46} color={C.gold} strokeWidth={1.7} absoluteStrokeWidth />
                  ) : null}
                </div>
                <div style={{ marginTop: 10, textAlign: "center", opacity: labOp }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, lineHeight: 1.05 }}>{f.op}</div>
                  <div style={{ fontSize: 14, color: C.goldDeep, opacity: 0.85 }}>{f.country}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.goldDeep, marginTop: 2,
                    textShadow: "0 0 14px rgba(201,162,39,0.45)" }}>
                    {f.effectifText ? f.effectifText : `${cval} soldats`}
                  </div>
                </div>
              </div>
            );
          })}

          {/* TOTAL — s'installe après l'impact (latence DA), claque */}
          {(() => {
            const t0 = trigger + 48;
            const cp = interpolate(local, [t0, t0 + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) });
            const over = spring({ frame: local - (t0 + 30), fps, config: { damping: 9, stiffness: 130 } });
            const sc = 1 + 0.07 * Math.max(0, over) * Math.exp(-(local - (t0 + 30)) / 14);
            const op = interpolate(local, [t0, t0 + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const val = Math.round(cp * total).toLocaleString("fr-FR");
            // total placé HAUT-CENTRE (sous le titre, zone dégagée — DA : au-dessus du foyer)
            return (
              <div style={{ position: "absolute", top: 78, width: "100%", textAlign: "center", opacity: op }}>
                <span style={{ fontSize: 50, fontWeight: 800, color: C.goldDeep, display: "inline-block",
                  transform: `scale(${sc})`, textShadow: "0 0 22px rgba(201,162,39,0.5)" }}>~{val}</span>
                <span style={{ fontSize: 26, color: C.ink, marginLeft: 12 }}>{footer}</span>
              </div>
            );
          })()}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
