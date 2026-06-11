/**
 * SahelPrepositionnementOverlay — overlay PREMIUM "pré-positionnement" (war-map, 3e registre D-8 + D-9).
 *
 * Répond à "pourquoi la France intervient le jour même ?" en montrant ce que la voix NE dit PAS :
 * la France DÉJÀ en opération tout AUTOUR du Mali → les forces CONVERGENT le jour même.
 *
 * ⛔ D-9 (Aziz 2026-06-09) : NIVEAU PREMIUM SOUVERAIN, jamais "encre austère". Langage FlowBrick :
 * - nœuds circulaires (disque clair, bord couleur, ombre douce, icône Lucide line-art)
 * - flux dorés avec PARTICULES qui circulent en continu (anti-temps-mort)
 * - CountUp glow sur les effectifs + total qui claque (métaphore : la masse se rassemble)
 * - secondary motion (float, pulse), transitions seamless, stagger
 * Adapté contexte CARTE : voile parchemin pour lisibilité, mais éléments au niveau premium.
 *
 * Conçu pour render ISOLÉ d'abord (SahelPrepositionnementDemo) puis intégration sur carte.
 */
import React from "react";
import {
  AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Easing,
} from "remotion";
import { Crosshair } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const C = {
  veil:    "#F4ECD8",   // voile parchemin clair (lisibilité sur carte)
  ink:     "#1E2A22",   // encre sombre (texte)
  inkSoft: "#4A5648",
  gold:    "#C9A227",
  goldDeep:"#A8852F",
  fr:      "#2E3A59",   // bleu-France (forces FR)
  frSoft:  "#43507A",
  node:    "#FBF6E9",   // disque clair des nœuds
} as const;

const EXPO = Easing.bezier(0.16, 1, 0.3, 1);

export type Force = {
  op: string;          // "Épervier"
  country: string;     // "Tchad"
  count: number;       // 950
  countSuffix?: string;// "" ; si forces spéciales -> countSuffix only
  countText?: string;  // override texte (ex: "Forces spéciales") si pas de chiffre
  Icon: LucideIcon;
  x: number;           // position du nœud (repère W×H)
  y: number;
};

type Props = {
  startFrame: number;
  holdFrames: number;
  surtitle: string;
  forces: Force[];
  center: { x: number; y: number };   // Mali (nœud-cible)
  total: number;                       // 1650
  footer: string;                      // "hommes déjà en opération"
  veilAlpha?: number;                  // opacité du voile sur la carte (0..1). Défaut 0.55 (carte visible).
  scale?: number;                      // agrandissement global de l'overlay (1 = base). Défaut 1.
};

// hex alpha (0..1) -> 2 hexdigits
const hexA = (a: number) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0").toUpperCase();

const NODE_R = 66;       // rayon nœud-opération
const CENTER_R = 92;     // rayon nœud-Mali central

export const SahelPrepositionnementOverlay: React.FC<Props> = ({
  startFrame, holdFrames, surtitle, forces, center, total, footer, veilAlpha = 0.55, scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  if (local < 0 || local > holdFrames) return null;

  const veilOp = Math.min(
    interpolate(local, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(local, [holdFrames - 16, holdFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  if (veilOp <= 0) return null;

  const titleOp = interpolate(local, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(local, [6, 22], [0, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EXPO });

  // centre (Mali) apparaît en premier
  const centerIn = spring({ frame: local - 6, fps, config: { damping: 18, stiffness: 110, mass: 0.8 } });
  const centerPop = Math.max(0, centerIn);
  // pulse continu du centre (cible vivante)
  const centerPulse = 1 + 0.03 * Math.sin(local * 0.10);

  const W = 1280, H = 720;

  return (
    <AbsoluteFill style={{ opacity: veilOp, fontFamily: "Georgia, 'Cormorant Garamond', serif" }}>
      {/* voile parchemin + halo doux (lisibilité premium sur la carte, opacité réglable) */}
      <AbsoluteFill style={{ background: `${C.veil}${hexA(veilAlpha)}` }} />
      <AbsoluteFill style={{
        background: "radial-gradient(60% 55% at 50% 46%, rgba(201,162,39,0.10), transparent 70%)",
      }} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", width: W, height: H, transform: `scale(${scale})` }}>

          {/* sur-titre + filet or */}
          <div style={{
            position: "absolute", top: 8, width: "100%", textAlign: "center", opacity: titleOp,
          }}>
            <div style={{
              fontSize: 26, fontWeight: 700, letterSpacing: 8, color: C.ink,
              textTransform: "uppercase",
            }}>{surtitle}</div>
            <div style={{
              margin: "12px auto 0", height: 3, width: lineW, borderRadius: 2,
              background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
            }} />
          </div>

          {/* SVG flux : forces -> Mali, avec particules continues */}
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {forces.map((f, i) => {
              const t0 = 26 + i * 10;
              // géométrie nœud->centre (rognée aux rayons)
              const dx = center.x - f.x, dy = center.y - f.y;
              const len0 = Math.hypot(dx, dy);
              const ux = dx / len0, uy = dy / len0;
              const ax = f.x + ux * NODE_R, ay = f.y + uy * NODE_R;
              const bx = center.x - ux * CENTER_R, by = center.y - uy * CENTER_R;
              const drawn = interpolate(local, [t0, t0 + 24], [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EXPO });
              const cx = ax + (bx - ax) * drawn, cy = ay + (by - ay) * drawn;
              // particules dorées continues, sens FORCE -> MALI (convergence = l'intention)
              const parts = [0, 0.33, 0.66].map((ph) => {
                const t = ((local - t0) / 60 + ph) % 1; // 0=force, 1=Mali
                return { px: ax + (bx - ax) * t, py: ay + (by - ay) * t,
                  op: drawn >= 0.98 && t >= 0 ? Math.sin(Math.max(0, t) * Math.PI) * 0.85 : 0 };
              });
              const headAng = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
              const headOp = interpolate(drawn, [0.85, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <g key={`flux-${i}`}>
                  <line x1={ax} y1={ay} x2={cx} y2={cy} stroke={C.gold} strokeWidth={5}
                    strokeLinecap="round" opacity={0.4} />
                  {parts.map((p, j) => (
                    <circle key={j} cx={p.px} cy={p.py} r={8} fill={C.goldDeep} opacity={p.op} />
                  ))}
                  {/* tête de flèche côté Mali = convergence */}
                  <g transform={`translate(${bx} ${by}) rotate(${headAng})`} opacity={headOp * 0.9}>
                    <path d="M 0 0 L -18 -8 L -12 0 L -18 8 Z" fill={C.goldDeep} />
                  </g>
                </g>
              );
            })}
          </svg>

          {/* NŒUD CENTRAL — Mali (cible) */}
          <div style={{
            position: "absolute", left: center.x, top: center.y,
            transform: `translate(-50%,-50%) scale(${centerPop * centerPulse})`,
          }}>
            <div style={{
              width: CENTER_R * 2, height: CENTER_R * 2, borderRadius: "50%",
              background: C.node, border: `4px solid ${C.fr}`,
              boxShadow: `0 6px 26px rgba(46,58,89,0.22)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Crosshair size={86} color={C.fr} strokeWidth={1.5} absoluteStrokeWidth />
            </div>
            <div style={{
              position: "absolute", top: CENTER_R * 2 + 6, width: "100%", textAlign: "center",
              fontSize: 26, fontWeight: 700, color: C.ink,
            }}>Mali</div>
          </div>

          {/* NŒUDS FORCES — opérations FR autour (pop spring + float + CountUp glow) */}
          {forces.map((f, i) => {
            const t0 = 14 + i * 10;
            const s = spring({ frame: local - t0, fps, config: { damping: 16, stiffness: 120, mass: 0.7 } });
            const pop = Math.max(0, s);
            const float = 4 * Math.sin((local - t0) * 0.06 + i);
            const Icon = f.Icon;
            const labOp = interpolate(local, [t0 + 8, t0 + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            // count-up effectif
            const cStart = t0 + 14, cEnd = t0 + 44;
            const cp = interpolate(local, [cStart, cEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) });
            const cval = Math.round(cp * f.count);
            return (
              <div key={`node-${i}`} style={{
                position: "absolute", left: f.x, top: f.y + float,
                transform: `translate(-50%,-50%) scale(${pop})`,
                display: "flex", flexDirection: "column", alignItems: "center",
              }}>
                <div style={{
                  width: NODE_R * 2, height: NODE_R * 2, borderRadius: "50%",
                  background: C.node, border: `3.5px solid ${C.frSoft}`,
                  boxShadow: `0 4px 18px rgba(46,58,89,0.16)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={56} color={C.fr} strokeWidth={1.6} absoluteStrokeWidth />
                </div>
                <div style={{ marginTop: 12, textAlign: "center", opacity: labOp }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.fr, lineHeight: 1.1 }}>{f.op}</div>
                  <div style={{ fontSize: 15, color: C.inkSoft, marginTop: 1 }}>{f.country}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: C.goldDeep, marginTop: 3,
                    textShadow: `0 0 16px rgba(201,162,39,0.45)` }}>
                    {f.countText ? f.countText : `${cval}${f.countSuffix ?? ""}`}
                  </div>
                </div>
              </div>
            );
          })}

          {/* FOOTER — total qui claque (CountUp glow), bas centre */}
          {(() => {
            const t0 = 70;
            const cp = interpolate(local, [t0, t0 + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) });
            const over = spring({ frame: local - (t0 + 34), fps, config: { damping: 9, stiffness: 130 } });
            const scale = 1 + 0.06 * Math.max(0, over) * Math.exp(-(local - (t0 + 34)) / 14);
            const op = interpolate(local, [t0, t0 + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const val = Math.round(cp * total).toLocaleString("fr-FR");
            return (
              <div style={{
                position: "absolute", bottom: 6, width: "100%", textAlign: "center", opacity: op,
              }}>
                <span style={{
                  fontSize: 44, fontWeight: 800, color: C.goldDeep, display: "inline-block",
                  transform: `scale(${scale})`, textShadow: `0 0 22px rgba(201,162,39,0.5)`,
                }}>~{val}</span>
                <span style={{ fontSize: 26, color: C.ink, marginLeft: 12 }}>{footer}</span>
              </div>
            );
          })()}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
