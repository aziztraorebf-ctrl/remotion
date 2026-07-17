/**
 * VoxPapercutAvion16x9 — PROTO R&D (2026-07-17, v2 assets réels).
 * Preuve finale : reproduire le "style Vox papercraft" de Higgsfield en HYBRIDE déterministe —
 * IMAGES générées 1× (Gemini 3.1 Flash : avion papercraft + fond journal) + OVERLAYS codés gratuits
 * (chart à barres, étiquette "1978", sous-titre déchiré) + animation stop-motion (pop + wiggle).
 *
 * Cible : plan "airlines competed on price / 1978" (portion 3:50->5:18 de la vidéo Zinho Automates).
 * Doctrine : memory/doctrines/REVERSE-STYLE-VIDEO-VERS-ASSETS.md
 * Assets : public/_rnd/vox-repro/assets/{avion-transparent.png, fond-journal.jpg}
 *
 * v1 (tout-SVG plat) ABANDONNÉE : le style Vox est du 3D papercraft généré, pas du vectoriel.
 * Ici l'avion = IMAGE générée détourée ; seuls chart/texte/étiquette restent codés.
 */
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const VOX_PAPERCUT_AVION_FRAMES = 150; // 5s a 30fps

const W = 1920;
const H = 1080;

const INK = "#232019";
const CREAM = "#F4EFE4";
const ORANGE = "#D97B29";
const ORANGE_DK = "#B5561E";

const PAPER_SHADOW = "drop-shadow(4px 7px 5px rgba(40,32,20,0.30))";
const PAPER_SHADOW_SM = "drop-shadow(2px 3px 2px rgba(40,32,20,0.25))";

/** Wiggle stop-motion : bruit 2D decorrele par seed, permanent. */
const useWiggle = (seed: number, ampXY = 2.4, ampRot = 0.6) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const x = Math.sin(t * 5.3 + seed * 1.7) * ampXY + Math.sin(t * 9.1 + seed) * (ampXY * 0.4);
  const y = Math.cos(t * 4.7 + seed * 2.3) * ampXY + Math.cos(t * 8.3 + seed * 1.1) * (ampXY * 0.4);
  const rot = Math.sin(t * 3.9 + seed * 0.9) * ampRot;
  return { x, y, rot };
};

const usePop = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 150, mass: 0.8 } });
};

/** Wrapper : pop (scale+opacity) + wiggle + drop-shadow, autour d'un enfant absolu. */
const Cutout: React.FC<{
  delay: number;
  seed: number;
  style?: React.CSSProperties;
  baseRot?: number;
  shadow?: string;
  ampXY?: number;
  children: React.ReactNode;
}> = ({ delay, seed, style, baseRot = 0, shadow = PAPER_SHADOW, ampXY = 2.4, children }) => {
  const pop = usePop(delay);
  const w = useWiggle(seed, ampXY);
  const scale = interpolate(pop, [0, 1], [0.62, 1]);
  const opacity = interpolate(pop, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${w.x}px, ${w.y}px) rotate(${baseRot + w.rot}deg) scale(${scale})`,
        opacity,
        filter: shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const A = (p: string) => staticFile(`_rnd/vox-repro/assets/${p}`);

export const VoxPapercutAvion16x9: React.FC = () => {
  const barGrow = (delay: number) => interpolate(usePop(delay), [0, 1], [0, 1]);
  // V2 : 4 barres croissantes, plus grandes/épaisses (réf)
  const bars = [
    { h: 90, delay: 44, c: ORANGE_DK },
    { h: 160, delay: 50, c: ORANGE },
    { h: 240, delay: 56, c: ORANGE },
    { h: 330, delay: 62, c: ORANGE },
  ];
  const barVals = bars.map((b) => barGrow(b.delay));
  const BAR_W = 78;
  const BAR_GAP = 30;
  const CHART_BASE = 370; // hauteur zone chart (plus grande)

  const subOpacity = interpolate(usePop(30), [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* FOND papier journal (image générée) + assombrissement (V2: réf plus sombre/chaude) + vignette */}
      <Img src={A("fond-journal.jpg")} style={{ position: "absolute", width: W, height: H, objectFit: "cover" }} />
      {/* teinte chaude sombre par-dessus le journal (multiply) pour matcher la réf */}
      <AbsoluteFill style={{ background: "#6b5836", mixBlendMode: "multiply", opacity: 0.32 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 72% at 50% 46%, rgba(0,0,0,0) 48%, rgba(25,18,8,0.34) 100%)" }} />

      {/* AVION papercraft (détouré nettoyé, miroité nez à droite) — V2.1: recentré, un poil réduit */}
      <Cutout delay={4} seed={1} ampXY={1.8} style={{ left: W / 2 - 810, top: H / 2 - 420, width: 1440 }}>
        <Img src={A("avion-flip-clean.png")} style={{ width: 1440, height: "auto" }} />
      </Cutout>

      {/* GRAPHIQUE À BARRES (bas droite) — overlay codé — V2: 4 barres plus grandes */}
      <Cutout delay={40} seed={4} ampXY={1.4} shadow={PAPER_SHADOW_SM} style={{ left: 1420, top: 470, width: 500, height: 400 }}>
        <svg width={500} height={400} viewBox="0 0 500 400">
          {/* axes L noir */}
          <path d={`M22 ${CHART_BASE - 350} L22 ${CHART_BASE + 6} L${22 + 4 * (BAR_W + BAR_GAP)} ${CHART_BASE + 6}`} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
          {bars.map((b, i) => {
            const grown = barVals[i] * b.h;
            const x = 42 + i * (BAR_W + BAR_GAP);
            return (
              <g key={i}>
                <rect x={x} y={CHART_BASE - grown} width={BAR_W} height={grown} fill={b.c} stroke={ORANGE_DK} strokeWidth={2} />
                <rect x={x + 6} y={CHART_BASE - grown + 5} width={BAR_W * 0.3} height={Math.max(0, grown - 10)} fill="#EFA766" opacity={0.5} />
              </g>
            );
          })}
        </svg>
      </Cutout>

      {/* ÉTIQUETTE "1978" scotchée (haut droite) — overlay codé — V2: plus grande, manuscrite, scotch jaune net */}
      <Cutout delay={22} seed={7} baseRot={-4} ampXY={2.0} style={{ left: 1430, top: 120, width: 320 }}>
        <div style={{ position: "relative", width: 320, height: 150 }}>
          <div style={{ position: "absolute", inset: 0, background: CREAM, borderRadius: 3, boxShadow: "inset 0 0 0 1px #DCD4C4" }} />
          {/* scotch jaune en haut-droite, bien visible */}
          <div style={{ position: "absolute", right: 18, top: -18, width: 96, height: 40, background: "#EBD86A", opacity: 0.7, transform: "rotate(14deg)", boxShadow: "1px 1px 2px rgba(0,0,0,0.12)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bradley Hand','Segoe Script','Comic Sans MS',cursive", fontSize: 86, fontWeight: 700, color: INK, transform: "rotate(-1deg)" }}>
            1978
          </div>
        </div>
      </Cutout>

      {/* SOUS-TITRE bandeau papier déchiré (bas centre) — overlay codé */}
      <div style={{ position: "absolute", left: W / 2 - 300, top: H - 140, width: 600, filter: PAPER_SHADOW_SM, opacity: subOpacity }}>
        <svg width={600} height={72} viewBox="0 0 600 72">
          <path d="M0 8 L120 3 L280 9 L440 2 L600 6 L600 66 L430 72 L250 65 L110 72 L0 68 Z" fill={CREAM} stroke="#DCD4C4" strokeWidth={1} />
          <text x={300} y={48} textAnchor="middle" fontFamily="'Arial Black', Impact, sans-serif" fontSize={36} fontWeight={800} fill={INK}>
            airlines competed on price
          </text>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

export default VoxPapercutAvion16x9;
