import React from "react";
import {
  AbsoluteFill, Audio, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { LaCalebasse } from "../../../_shared/components/layouts/LaCalebasse";
import { SourceTag } from "../../../_shared/components/overlays/SourceTag";
import { KraftGrain } from "../../../_shared/components/overlays/KraftDepth";
import { Landmark, Settings2, Building2 } from "lucide-react";

// Beat12 — S3 Mecanisme 2 : FONSIS + Piege de la Dette
// Duree : 1618f = 53.9s @30fps
// Audio : narration-v1-clean.mp3 startFrom=7182 (239.40s)
//
// Phase A  f0→616     Coffre FONSIS + pièces en boucle + odometer (FONSIS intro)
// Phase B  f616→1093  LaCalebasse remplissage live 0→132% (dette 132% PIB — chiffre officiel FMI 2025)
// Phase C  f1093→1307 ProcessFlow draw-on + flux liquide + icônes (tentation)
// Phase D  f1307→1618 Shields draw-on contour + intérieur animé (comparaison Norvège)
//
// Timestamps Whisper (offset depuis 239.40s) :
//   "Mais voilà le piège"     → 259.94s → +20.54s → f616
//   "La tentation"            → 270.58s → +31.18s → f935 → Phase B end = f1093 (FMI)
//   "Et les règles"           → 282.96s → +43.56s → f1307
//   "Mécanisme 3" (à couper)  → 293.34s → +53.94s → f1618
// endAt = 7182 + 1618 = 8800

const F_A_END = 616;
const F_B_END = 1093;
const F_C_END = 1307;
const F_END   = 1618;

// Palette SVG uniquement (fill/stroke/cx/cy)
const KRAFT_BG   = "#e8d5b0";
const KRAFT_DARK = "#2d1810";
const KRAFT_MID  = "#c4a882";
const GOLD       = "#c8a951";
const GOLD_LIGHT = "#f0d88a";
const RED_BRICK  = "#8b2020";
const SAUGE      = "#7a9e7e";
const IVORY      = "#f5f0e8";

// Arc SVG helper
function arc(cx: number, cy: number, r: number, a1: number, a2: number) {
  const r2d = (d: number) => (d * Math.PI) / 180;
  const sx = cx + r * Math.cos(r2d(a1)), sy = cy + r * Math.sin(r2d(a1));
  const ex = cx + r * Math.cos(r2d(a2)), ey = cy + r * Math.sin(r2d(a2));
  return `M ${sx} ${sy} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${ex} ${ey}`;
}

// Typewriter helper
function typewriter(text: string, frame: number, speed = 3): string {
  return text.slice(0, Math.floor(frame / speed));
}

export const Beat12: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Transitions
  const opA = interpolate(frame, [F_A_END - 20, F_A_END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opB = interpolate(frame, [F_A_END, F_A_END + 20, F_B_END - 20, F_B_END], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opC = interpolate(frame, [F_B_END, F_B_END + 20, F_C_END - 20, F_C_END], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opD = interpolate(frame, [F_C_END, F_C_END + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Phase A ───────────────────────────────────────────────
  const aAppear  = spring({ frame, fps, config: { damping: 14, stiffness: 80 }, durationInFrames: 25 });
  const aOuv     = interpolate(frame, [20, 80], [0, -52], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pièces en boucle (5 pièces, cycle de 60f, staggerées de 12f)
  const COIN_CYCLE = 60;
  const coins = [0, 12, 24, 36, 48].map((offset, i) => {
    const t = ((frame - 60 + offset) % COIN_CYCLE + COIN_CYCLE) % COIN_CYCLE;
    const prog = Math.min(t / 50, 1);
    const angles = [-45, -20, 0, 20, 45];
    const angle = (angles[i] * Math.PI) / 180;
    const dist = prog * 180;
    const x = Math.sin(angle) * dist;
    const y = -Math.abs(Math.cos(angle)) * dist + 10 * prog * prog * dist;
    const opacity = prog < 0.15 ? prog / 0.15 : prog > 0.75 ? 1 - (prog - 0.75) / 0.25 : 1;
    return { x, y, opacity: opacity * (frame >= 60 ? 1 : 0) };
  });

  // Odometer $0 → $245M
  const odoVal = Math.floor(interpolate(frame, [80, 380], [0, 245], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const odoOp  = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Typewriter "INTOUCHABLE EN THÉORIE"
  const twFrame = Math.max(0, frame - 160);
  const tw1 = typewriter("INTOUCHABLE", twFrame, 4);
  const tw2 = twFrame > 50 ? typewriter("EN THÉORIE", twFrame - 50, 4) : "";

  // ── Phase C ───────────────────────────────────────────────
  const cL = Math.max(0, frame - F_B_END);

  // Nœuds spring
  const cn1 = spring({ frame: cL,       fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 20 });
  const cn2 = spring({ frame: cL - 50,  fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 20 });
  const cn3 = spring({ frame: cL - 100, fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 20 });

  // Flèche 1 draw-on (strokeDashoffset, longueur ~340px)
  const ARROW_LEN = 340;
  const arr1Prog = interpolate(cL, [28, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arr2Prog = interpolate(cL, [78, 108], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Flux liquide : cercles qui glissent sur les deux flèches en boucle
  const FLUX_CYCLE = 45;
  const fluxParticles = [0, 15, 30].map((offset) => {
    const t = ((cL - 60 + offset) % FLUX_CYCLE + FLUX_CYCLE) % FLUX_CYCLE;
    return { t: t / FLUX_CYCLE, opacity: cL > 60 ? Math.min(1, (cL - 60) / 15) : 0 };
  });

  // Icônes scale spring (légèrement décalé après nœud)
  const icon1 = spring({ frame: Math.max(0, cL - 12), fps, config: { damping: 10, stiffness: 120 } });
  const icon2 = spring({ frame: Math.max(0, cL - 62), fps, config: { damping: 10, stiffness: 120 } });
  const icon3 = spring({ frame: Math.max(0, cL - 112), fps, config: { damping: 10, stiffness: 120 } });

  // Shake BUDGET (quand cn3 > 0.5)
  const shakeB = cn3 > 0.5 && cL < 130
    ? 4 * Math.sin((cL - 100) * 1.8) * Math.exp(-(cL - 100) * 0.15)
    : 0;

  // ── Phase D ───────────────────────────────────────────────
  const dL = Math.max(0, frame - F_C_END);

  // Ligne centrale draw-on
  const lineH = 460;
  const lineProg = interpolate(dL, [0, 30], [0, lineH], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bouclier Norvège : draw-on contour puis fill/croix
  const shieldLen = 700; // périmètre approximatif du path
  const norvContourProg = interpolate(dL, [10, 55], [shieldLen, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const norvFillOp      = interpolate(dL, [55, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Croix : barre verticale puis horizontale
  const norvCrossV = interpolate(dL, [70, 95], [0, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const norvCrossH = interpolate(dL, [92, 118], [0, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bouclier Sénégal : décalé de 25f
  const senContourProg  = interpolate(dL, [35, 80], [shieldLen, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const senFillOp       = interpolate(dL, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // "?" draw-on via path
  const senQmarkProg    = interpolate(dL, [100, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Labels typewriter Phase D
  const dTw1Frame = Math.max(0, dL - 75);
  const dTw2Frame = Math.max(0, dL - 100);
  const norvLabel  = typewriter("RÈGLES STRICTES", dTw1Frame, 3);
  const senLabel   = typewriter("RÈGLES FRAGILES", dTw2Frame, 3);

  const shieldPath = "M 0,-110 L 95,-55 L 95,35 L 0,115 L -95,35 L -95,-55 Z";

  return (
    <AbsoluteFill style={{ backgroundColor: KRAFT_BG }}>
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v1-clean.mp3")}
        startFrom={7182} endAt={8742} volume={1}
      />
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        startFrom={7182}
        volume={interpolate(frame, [F_END - 45, F_END], [0.05, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />

      {/* ── PHASE A : Coffre + pièces boucle + odometer ── */}
      <AbsoluteFill style={{ opacity: opA, pointerEvents: "none" }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          <defs>
            <filter id="fonsis-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx={8} dy={10} stdDeviation={6} floodColor="#16213a" floodOpacity={0.3} />
            </filter>
          </defs>
          <g transform={`translate(960, 460) scale(${aAppear})`} filter="url(#fonsis-shadow)">
            {/* Base */}
            <rect x={-200} y={-130} width={400} height={290} rx={18} fill={KRAFT_DARK} stroke={GOLD} strokeWidth={4} />
            <rect x={-200} y={-20} width={400} height={20} fill={GOLD} opacity={0.35} />
            <rect x={-22} y={-130} width={44} height={290} fill={GOLD} opacity={0.25} />
            {/* Serrure */}
            <circle cx={0} cy={65} r={28} fill={GOLD} />
            <rect x={-12} y={65} width={24} height={30} rx={5} fill={KRAFT_DARK} />
            <circle cx={0} cy={58} r={12} fill={KRAFT_DARK} />
            {/* Couvercle */}
            <g transform={`rotate(${aOuv}, 0, -130)`}>
              <rect x={-200} y={-255} width={400} height={130} rx={18} fill={KRAFT_DARK} stroke={GOLD} strokeWidth={4} />
              <rect x={-200} y={-175} width={400} height={20} fill={GOLD} opacity={0.3} />
              <text x={0} y={-190} textAnchor="middle" fill={GOLD}
                fontFamily="'Bebas Neue', sans-serif" fontSize={52} letterSpacing={8}>
                FONSIS
              </text>
            </g>
            {/* Pièces en boucle */}
            {coins.map((c, i) => (
              <g key={i} transform={`translate(${c.x}, ${c.y - 140})`} opacity={c.opacity}>
                <ellipse cx={0} cy={0} rx={20} ry={12} fill={GOLD_LIGHT} stroke={GOLD} strokeWidth={2} />
                <text x={0} y={4} textAnchor="middle" fill={KRAFT_DARK} fontSize={10} fontFamily="monospace" fontWeight="bold">$</text>
              </g>
            ))}
            {/* Odometer */}
            <g opacity={odoOp}>
              <text x={0} y={230} textAnchor="middle" fill={GOLD}
                fontFamily="'IBM Plex Mono', monospace" fontSize={38} fontWeight="bold" letterSpacing={4}>
                ${odoVal}M
              </text>
              <text x={0} y={262} textAnchor="middle" fill={KRAFT_DARK}
                fontFamily="'IBM Plex Mono', monospace" fontSize={16} letterSpacing={3} opacity={0.7}>
                REVENUS PÉTROLIERS ESTIMÉS
              </text>
            </g>
            {/* Typewriter */}
            <text x={0} y={315} textAnchor="middle" fill={KRAFT_DARK}
              fontFamily="'Bebas Neue', sans-serif" fontSize={32} letterSpacing={6} opacity={0.9}>
              {tw1}
            </text>
            {tw2 && (
              <text x={0} y={355} textAnchor="middle" fill={RED_BRICK}
                fontFamily="'Bebas Neue', sans-serif" fontSize={32} letterSpacing={6}>
                {tw2}
              </text>
            )}
          </g>
        </svg>
      </AbsoluteFill>

      {/* ── PHASE B : LaCalebasse remplissage live ── */}
      <AbsoluteFill style={{ opacity: opB, pointerEvents: "none" }}>
        <LaCalebasse
          percentage={132}
          label="DETTE PUBLIQUE"
          sublabel="132% DU PIB · SÉNÉGAL 2025"
          liquidColor={RED_BRICK}
          strokeColor={KRAFT_DARK}
          textColor={KRAFT_DARK}
          bgColor={KRAFT_BG}
          startFrame={F_A_END}
          depth
        />
        {/* Badge FMI */}
        <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: 80 }}>
          <div style={{
            opacity: interpolate(Math.max(0, frame - F_A_END), [300, 330], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `scale(${spring({ frame: Math.max(0, frame - F_A_END - 300), fps, config: { damping: 10, stiffness: 120 } })})`,
          }}>
            <div className="font-bebas tracking-widest text-center"
              style={{ fontSize: 28, color: RED_BRICK, letterSpacing: "0.25em", padding: "10px 40px", border: `2px solid ${RED_BRICK}`, backgroundColor: `${RED_BRICK}12` }}>
              ⚠ LE FMI TIRE LA SONNETTE D'ALARME
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* ── PHASE C : ProcessFlow draw-on + flux + icônes ── */}
      <AbsoluteFill style={{ opacity: opC, pointerEvents: "none" }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" overflow="visible">
          {/* Titre */}
          <text x={960} y={290} textAnchor="middle" fill={KRAFT_DARK}
            fontFamily="'Bebas Neue', sans-serif" fontSize={34} letterSpacing={8} opacity={cn1}>
            LE RISQUE : VIDER LE FONDS
          </text>

          {/* Nœud 1 — FONSIS */}
          <g transform={`translate(380, 540) scale(${cn1})`}>
            <rect x={-100} y={-75} width={200} height={150} rx={12} fill={KRAFT_DARK} stroke={GOLD} strokeWidth={3} />
            <g transform={`scale(${icon1})`}>
              <foreignObject x={-18} y={-58} width={36} height={36}>
                <Landmark size={36} color={GOLD} />
              </foreignObject>
            </g>
            <text x={0} y={20} textAnchor="middle" fill={GOLD}
              fontFamily="'Bebas Neue', sans-serif" fontSize={30} letterSpacing={3}>FONSIS</text>
            <text x={0} y={48} textAnchor="middle" fill={IVORY}
              fontFamily="'IBM Plex Mono', monospace" fontSize={13}>Revenus pétroliers</text>
          </g>

          {/* Flèche 1 draw-on */}
          <g>
            <line x1={480} y1={540} x2={860} y2={540}
              stroke={GOLD} strokeWidth={3} strokeDasharray={`${ARROW_LEN}`}
              strokeDashoffset={ARROW_LEN * (1 - arr1Prog)} strokeLinecap="round" />
            {arr1Prog > 0.95 && <polygon points="855,531 878,540 855,549" fill={GOLD} />}
          </g>

          {/* Flux liquide flèche 1 */}
          {fluxParticles.map((p, i) => {
            const px = 480 + (860 - 480) * p.t;
            return (
              <circle key={i} cx={px} cy={540} r={6}
                fill={GOLD_LIGHT} opacity={p.opacity * arr1Prog * (1 - Math.abs(p.t - 0.5) * 0.4)} />
            );
          })}

          {/* Nœud 2 — VANNE */}
          <g transform={`translate(960, 540) scale(${cn2})`}>
            <rect x={-100} y={-75} width={200} height={150} rx={12} fill={KRAFT_DARK} stroke={KRAFT_MID} strokeWidth={3} />
            <g transform={`scale(${icon2})`}>
              <foreignObject x={-18} y={-58} width={36} height={36}>
                <Settings2 size={36} color={KRAFT_MID} />
              </foreignObject>
            </g>
            <text x={0} y={20} textAnchor="middle" fill={KRAFT_MID}
              fontFamily="'Bebas Neue', sans-serif" fontSize={30} letterSpacing={3}>VANNE</text>
            <text x={0} y={48} textAnchor="middle" fill={IVORY}
              fontFamily="'IBM Plex Mono', monospace" fontSize={13}>Transfert possible</text>
          </g>

          {/* Flèche 2 draw-on */}
          <g>
            <line x1={1060} y1={540} x2={1440} y2={540}
              stroke={RED_BRICK} strokeWidth={3} strokeDasharray={`${ARROW_LEN}`}
              strokeDashoffset={ARROW_LEN * (1 - arr2Prog)} strokeLinecap="round" />
            {arr2Prog > 0.95 && <polygon points="1435,531 1458,540 1435,549" fill={RED_BRICK} />}
          </g>

          {/* Flux liquide flèche 2 */}
          {fluxParticles.map((p, i) => {
            const px = 1060 + (1440 - 1060) * p.t;
            return (
              <circle key={i} cx={px} cy={540} r={6}
                fill={`${RED_BRICK}cc`} opacity={p.opacity * arr2Prog * (1 - Math.abs(p.t - 0.5) * 0.4)} />
            );
          })}

          {/* Nœud 3 — BUDGET avec shake */}
          <g transform={`translate(${1540 + shakeB}, 540) scale(${cn3})`}>
            <rect x={-100} y={-75} width={200} height={150} rx={12} fill={KRAFT_DARK} stroke={RED_BRICK} strokeWidth={3} />
            <g transform={`scale(${icon3})`}>
              <foreignObject x={-18} y={-58} width={36} height={36}>
                <Building2 size={36} color={RED_BRICK} />
              </foreignObject>
            </g>
            <text x={0} y={20} textAnchor="middle" fill={RED_BRICK}
              fontFamily="'Bebas Neue', sans-serif" fontSize={30} letterSpacing={3}>BUDGET</text>
            <text x={0} y={48} textAnchor="middle" fill={IVORY}
              fontFamily="'IBM Plex Mono', monospace" fontSize={13}>Général</text>
          </g>

          {/* Note alerte */}
          <text x={960} y={710} textAnchor="middle" fill={RED_BRICK}
            fontFamily="'IBM Plex Mono', monospace" fontSize={18} letterSpacing={2}
            opacity={interpolate(cL, [110, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            La tentation de piocher dans le FONSIS est immense
          </text>
        </svg>
      </AbsoluteFill>

      {/* ── PHASE D : Shields draw-on ── */}
      <AbsoluteFill style={{ opacity: opD, pointerEvents: "none" }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080">
          {/* Ligne centrale draw-on */}
          <line x1={960} y1={310} x2={960} y2={310 + lineProg}
            stroke={KRAFT_MID} strokeWidth={1.5} opacity={0.4} />

          {/* Titre */}
          <text x={960} y={278} textAnchor="middle" fill={KRAFT_DARK}
            fontFamily="'Bebas Neue', sans-serif" fontSize={28} letterSpacing={7}
            opacity={interpolate(dL, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            COMPARAISON RÉGLEMENTAIRE
          </text>

          {/* ── Bouclier Norvège ── */}
          <g transform="translate(480, 490)">
            {/* Contour draw-on */}
            <path d={shieldPath} fill={`${KRAFT_DARK}${Math.round(norvFillOp * 255).toString(16).padStart(2, "0")}`}
              stroke={GOLD} strokeWidth={4}
              strokeDasharray={shieldLen} strokeDashoffset={norvContourProg} />
            {/* Barre verticale croix */}
            <clipPath id="norv-v">
              <rect x={-10} y={-75 + (150 - norvCrossV)} width={20} height={norvCrossV} />
            </clipPath>
            <rect x={-10} y={-75} width={20} height={150} fill={GOLD} clipPath="url(#norv-v)" opacity={norvFillOp} />
            {/* Barre horizontale croix */}
            <clipPath id="norv-h">
              <rect x={-70} y={-10} width={norvCrossH} height={20} />
            </clipPath>
            <rect x={-70} y={-10} width={140} height={20} fill={GOLD} clipPath="url(#norv-h)" opacity={norvFillOp} />
            {/* Labels */}
            <text x={0} y={178} textAnchor="middle" fill={GOLD}
              fontFamily="'Bebas Neue', sans-serif" fontSize={38} letterSpacing={5} opacity={norvFillOp}>
              NORVÈGE
            </text>
            <text x={0} y={210} textAnchor="middle" fill={KRAFT_DARK}
              fontFamily="'IBM Plex Mono', monospace" fontSize={16} opacity={norvFillOp}>
              {norvLabel}
            </text>
          </g>

          {/* ── Bouclier Sénégal ── */}
          <g transform="translate(1440, 490)">
            {/* Contour draw-on */}
            <path d={shieldPath} fill={`${SAUGE}${Math.round(senFillOp * 40).toString(16).padStart(2, "0")}`}
              stroke={SAUGE} strokeWidth={4}
              strokeDasharray={shieldLen} strokeDashoffset={senContourProg} />
            {/* "?" progressif via opacité + scale */}
            <text x={0} y={38} textAnchor="middle" fill={SAUGE}
              fontFamily="'Bebas Neue', sans-serif" fontSize={110}
              opacity={senQmarkProg}
              style={{ transform: `scale(${0.5 + senQmarkProg * 0.5})`, transformOrigin: "0 0" }}>
              ?
            </text>
            {/* Labels */}
            <text x={0} y={178} textAnchor="middle" fill={SAUGE}
              fontFamily="'Bebas Neue', sans-serif" fontSize={38} letterSpacing={5} opacity={senFillOp}>
              SÉNÉGAL
            </text>
            <text x={0} y={210} textAnchor="middle" fill={KRAFT_DARK}
              fontFamily="'IBM Plex Mono', monospace" fontSize={16} opacity={senFillOp}>
              {senLabel}
            </text>
          </g>
        </svg>
      </AbsoluteFill>

      {/* Grain papier global (toutes phases kraft) */}
      <KraftGrain />

      {/* Sources */}
      <SourceTag source="FONSIS — Rapport activité 2024" startFrame={80} endFrame={350} />
      <SourceTag source="FMI — Article IV 2025" startFrame={F_A_END + 80} endFrame={F_B_END} />
    </AbsoluteFill>
  );
};
