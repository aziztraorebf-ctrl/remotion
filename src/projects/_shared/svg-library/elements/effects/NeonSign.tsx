// NeonSign — briques "tube neon" en SVG pur : glow multi-couches, tracé a pointe lumineuse, allumage
// avec grésillement, reflet au sol.
//
// POURQUOI (origine) : demo Opus 5 "launch ad neon" (post @stevibe, 2026-07-24) annoncee comme "pure HTML
// canvas". Verification frame par frame (2026-07-25) : le trace montre une POINTE LUMINEUSE qui court au
// bout du trait = signature strokeDashoffset, donc SVG, pas canvas. Conclusion : le substrat etait deja le
// notre — ce qui manquait tenait a 3 FINITIONS, codees ici :
//   1. GlowStroke      — 3 traits superposes (diffusion large sombre / corps colore / coeur blanc)
//   2. DrawnPath       — trace strokeDashoffset + point vif a la pointe (le "stylo" qui ecrit)
//   3. GroundReflection — copie miroir floutee, masquee par un degrade qui s'eteint vers le bas
// + `flicker()` : grésillement deterministe d'allumage (le neon qui accroche avant de tenir).
//
// Tout est frame-driven et deterministe (aucun Math.random au render, aucune CSS transition/@keyframes).

import React from "react";

// ————————————————————————————————————————————————————————————————————————
// 1. GLOW MULTI-COUCHES
// ————————————————————————————————————————————————————————————————————————
// Un neon credible n'est PAS un trait colore : c'est un tube. Trois passes superposees, de la plus large
// et diffuse a la plus fine et chaude. C'est l'empilement qui cree la sensation de lumiere physique.

export type GlowStrokeProps = {
  d: string;
  color: string;
  /** epaisseur du coeur du tube. Les couches externes en derivent. */
  width?: number;
  /** 0-1, intensite globale (pilote l'allumage/grésillement). */
  on?: number;
  strokeLinecap?: "round" | "butt" | "square";
  strokeDasharray?: string;
  strokeDashoffset?: number;
  fill?: string;
};

/** Tube neon : diffusion large + corps colore + coeur blanc. A utiliser partout ou "ca doit briller". */
export const GlowStroke: React.FC<GlowStrokeProps> = ({
  d, color, width = 6, on = 1, strokeLinecap = "round", strokeDasharray, strokeDashoffset, fill = "none",
}) => {
  if (on <= 0.01) return null;
  const common = { d, fill, strokeLinecap, strokeDasharray, strokeDashoffset, strokeLinejoin: "round" as const };
  return (
    <g>
      {/* couche 1 — diffusion large : c'est elle qui "salit" l'air autour du tube */}
      <path {...common} stroke={color} strokeWidth={width * 3.4} opacity={0.10 * on}
        style={{ filter: `blur(${width * 1.7}px)` }} />
      {/* couche 2 — halo proche */}
      <path {...common} stroke={color} strokeWidth={width * 1.9} opacity={0.34 * on}
        style={{ filter: `blur(${width * 0.6}px)` }} />
      {/* couche 3 — corps du tube, couleur franche */}
      <path {...common} stroke={color} strokeWidth={width} opacity={0.95 * on} />
      {/* couche 4 — coeur : quasi blanc, plus fin. Le detail qui fait "tube allume" et pas "trait peint". */}
      <path {...common} stroke="#fff" strokeWidth={width * 0.34} opacity={0.85 * on} />
    </g>
  );
};

// ————————————————————————————————————————————————————————————————————————
// 2. TRACÉ AVEC POINTE LUMINEUSE
// ————————————————————————————————————————————————————————————————————————
// Notre strokeDashoffset existant revele un trait. Ce qui manquait : la petite lumiere qui COURT au bout,
// et qui fait lire "quelque chose est en train de s'ecrire" au lieu de "un trait apparait".
// La pointe est positionnee via getPointAtLength sur un path de mesure (ref DOM), avec repli sans pointe
// si la mesure n'est pas disponible — le trace reste correct dans tous les cas.

export type DrawnPathProps = {
  d: string;
  color: string;
  /** 0 = rien, 1 = trait complet */
  progress: number;
  width?: number;
  /** taille du point lumineux a la pointe. 0 = pas de pointe. */
  tipSize?: number;
  on?: number;
};

export const DrawnPath: React.FC<DrawnPathProps> = ({ d, color, progress, width = 6, tipSize = 7, on = 1 }) => {
  const ref = React.useRef<SVGPathElement | null>(null);
  const [len, setLen] = React.useState(0);
  React.useEffect(() => {
    if (ref.current) {
      try { setLen(ref.current.getTotalLength()); } catch { setLen(0); }
    }
  }, [d]);

  const p = Math.max(0, Math.min(1, progress));
  const tip = React.useMemo(() => {
    if (!ref.current || !len || tipSize <= 0 || p <= 0 || p >= 1) return null;
    try { const pt = ref.current.getPointAtLength(len * p); return { x: pt.x, y: pt.y }; } catch { return null; }
  }, [len, p, tipSize]);

  if (p <= 0.001) return <path ref={ref} d={d} fill="none" stroke="none" />;

  return (
    <g>
      {/* path de mesure, invisible — sert de reference geometrique a getPointAtLength */}
      <path ref={ref} d={d} fill="none" stroke="none" />
      <GlowStroke d={d} color={color} width={width} on={on}
        strokeDasharray={`${len || 6000}`} strokeDashoffset={(len || 6000) * (1 - p)} />
      {tip && (
        <g>
          <circle cx={tip.x} cy={tip.y} r={tipSize * 2.4} fill={color} opacity={0.22 * on}
            style={{ filter: `blur(${tipSize}px)` }} />
          <circle cx={tip.x} cy={tip.y} r={tipSize} fill="#fff" opacity={0.95 * on}
            style={{ filter: `blur(${tipSize * 0.3}px)` }} />
        </g>
      )}
    </g>
  );
};

// ————————————————————————————————————————————————————————————————————————
// 3. GRÉSILLEMENT D'ALLUMAGE
// ————————————————————————————————————————————————————————————————————————
// Un neon n'atteint pas sa pleine lumiere d'un coup : il accroche, rate, tient. Deterministe (LCG seede) —
// jamais Math.random, sinon chaque frame du render headless serait differente.

/** Renvoie l'intensite 0-1 a la frame donnee. `startF` = debut d'allumage, `settleF` = intensite stable. */
export function flicker(frame: number, startF: number, settleF: number, seed = 3): number {
  if (frame < startF) return 0;
  if (frame >= settleF) return 1;
  const i = Math.floor(frame - startF);
  let s = (seed + i * 977) % 233280;
  s = (s * 9301 + 49297) % 233280;
  const r = s / 233280;
  const ramp = (frame - startF) / Math.max(1, settleF - startF);
  // plus on approche de settleF, plus les ratés se raréfient
  return r < 0.34 * (1 - ramp) ? 0.06 + r * 0.3 : Math.min(1, 0.55 + ramp * 0.45 + r * 0.2);
}

// ————————————————————————————————————————————————————————————————————————
// 4. REFLET AU SOL
// ————————————————————————————————————————————————————————————————————————
// Copie miroir + flou + masque degrade. Cree instantanement un LIEU (sol mouille) au lieu d'un fond noir.
// `groundY` = ligne de sol dans le repere du viewBox ; le contenu est retourne autour d'elle.

export type GroundReflectionProps = {
  children: React.ReactNode;
  groundY: number;
  maskId: string;
  width: number;
  height: number;
  opacity?: number;
  blur?: number;
};

export const GroundReflection: React.FC<GroundReflectionProps> = ({
  children, groundY, maskId, width, height, opacity = 0.28, blur = 3.5,
}) => (
  <>
    <defs>
      <linearGradient id={`${maskId}-grad`} x1="0" y1={groundY} x2="0" y2={height} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="0.45" stopColor="#fff" stopOpacity="0.22" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask id={maskId}>
        <rect x="0" y={groundY} width={width} height={height - groundY} fill={`url(#${maskId}-grad)`} />
      </mask>
    </defs>
    <g mask={`url(#${maskId})`} opacity={opacity} style={{ filter: `blur(${blur}px)` }}>
      {/* miroir vertical autour de groundY, legerement ecrase (le sol n'est pas un miroir parfait) */}
      <g transform={`translate(0 ${2 * groundY}) scale(1 -0.92)`}>{children}</g>
    </g>
  </>
);

export default GlowStroke;
