// PROTO 2.4 — EXTINCTION D'UNE BASE FR ENCERCLÉE (refonte premium P2).
//
// Couche PURE par-dessus la carte du moteur (pattern <PartieX>). Reçoit
// SahelRenderContext (frame + project lon/lat→px). Ne possède PAS la map.
//
// OBJECTIF (Aziz) : refaire en PREMIUM le moment le plus mort de la P2 rejetée.
// Décisions verrouillées :
//   - Marqueurs = SPRITES à ombre portée (base-france.png), PAS d'étoiles SVG.
//   - Front jihadiste = FRONT MOUVANT ORGANIQUE (path bezier morphé), PAS un cercle qui scale.
//   - Lottie SUR-MESURE (extinctionCollapse) sur le moment d'extinction de chaque base.
//   - Caméra serrée qui suit (gérée par getProto24Cam dans le moteur).
//   - "40%" supprimé (la voix le dit).
//
// 5 GARDE-FOUS ANTI-SATURATION (la P2 rejetée saturait — cercles+étoiles+X qui restaient) :
//   1. Le front est UNE nappe qui se DÉPLACE (bord chaud net + arrière sourd opacity 0.15),
//      jamais des taches additives qui s'empilent.
//   2. La caméra (moteur) sort les bases éteintes du cadre → on ne voit pas les 3 morts avant la fin.
//   3. Les Lottie sont des ÉVÉNEMENTS (~75f puis disparaissent), espacés ≥30f, jamais 3 simultanés.
//   4. Quota : max 1 nappe + 1 onde active + 3 sprites. Aucun label flottant, aucun chiffre.
//   5. La désaturation EST l'outil de lisibilité : base morte = grise/plate/opacity basse = "ne regarde plus ici".
//
// Triggers V5 (alignment, ×30fps) : F_ECHEC = 3887 ("dix ans plus tard").

import mapboxgl from "mapbox-gl";
import lottie from "lottie-web";
import React, { useEffect, useRef, useState } from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig, staticFile, Easing } from "remotion";
import type { SahelRenderContext } from "../engine/SahelContext";
import { extinctionCollapse, RED_INK_RGB } from "../../_shared/lottie/premiumLottieAssets";

// ============================================================
// TRIGGERS + GÉOGRAPHIE
// ============================================================
const F_ECHEC = 3887; // "dix ans plus tard" — début du beat 2.4

// Bases FR (triangle du Nord-Mali). coord [lon, lat].
type FrBase = { id: string; name: string; coord: [number, number]; extinctAt: number };
const FR_BASES: FrBase[] = [
  { id: "gao", name: "GAO", coord: [-0.04, 16.27], extinctAt: F_ECHEC + 100 },     // 1re à tomber (push-in T2)
  { id: "menaka", name: "MÉNAKA", coord: [2.40, 15.92], extinctAt: F_ECHEC + 175 }, // PAN est T3a
  { id: "tessalit", name: "TESSALIT", coord: [1.01, 20.20], extinctAt: F_ECHEC + 240 }, // remonte nord T3b
];

// FRONT MOUVANT : key-shapes du bord d'attaque jihadiste (lon/lat), interpolés dans le temps.
// Le front part du Liptako (sud-est, foyer historique) et REMONTE/ENSERRE le triangle FR.
// Chaque "shape" = anneau de points géo qui décrivent le bord de la zone contrôlée. On interpole
// point à point entre 2 shapes consécutives (même longueur) → morphing organique.
// 3 états : large (lâche, sud) → moyen (monte) → serré (a englobé Gao/Ménaka).
type GeoRing = [number, number][];
const FRONT_SHAPES: { at: number; ring: GeoRing }[] = [
  {
    at: F_ECHEC, // état 0 : front lâche au sud-est (Liptako)
    ring: [
      [-1.5, 14.2], [1.0, 13.8], [3.5, 14.0], [4.5, 15.5],
      [3.8, 17.0], [2.0, 17.2], [0.0, 16.8], [-1.8, 16.0],
    ],
  },
  {
    at: F_ECHEC + 90, // état 1 : remonte, enveloppe Gao/Ménaka
    ring: [
      [-2.2, 14.5], [0.8, 14.0], [3.8, 14.6], [5.0, 16.2],
      [4.2, 18.4], [2.2, 18.8], [-0.4, 18.0], [-2.6, 16.5],
    ],
  },
  {
    at: F_ECHEC + 220, // état 2 : étreinte serrée tout le triangle (jusqu'à Tessalit)
    ring: [
      [-2.6, 14.6], [1.0, 14.2], [4.4, 15.0], [5.6, 17.5],
      [4.6, 20.6], [1.6, 21.2], [-1.4, 20.2], [-3.0, 17.0],
    ],
  },
];

// Palette
const RED_INK = "#8B3A3A";     // rouge-brique (front, décision Aziz)
const RED_DEEP = "#5A2424";    // rouge sourd (arrière du front, acquis)
const STEEL = "#5E7FA0";       // bleu-acier (base vivante)
const STEEL_DEAD = "#8A857B";  // gris-brun (base morte)

// ============================================================
// HELPERS
// ============================================================
// Interpolation d'un anneau géo entre 2 shapes (même nb de points), au temps `frame`.
function interpRing(frame: number): GeoRing {
  const shapes = FRONT_SHAPES;
  if (frame <= shapes[0].at) return shapes[0].ring;
  if (frame >= shapes[shapes.length - 1].at) return shapes[shapes.length - 1].ring;
  for (let i = 0; i < shapes.length - 1; i++) {
    const a = shapes[i], b = shapes[i + 1];
    if (frame >= a.at && frame <= b.at) {
      const t = (frame - a.at) / (b.at - a.at);
      const e = t * t * (3 - 2 * t); // smoothstep
      return a.ring.map((p, k) => [
        p[0] + (b.ring[k][0] - p[0]) * e,
        p[1] + (b.ring[k][1] - p[1]) * e,
      ]);
    }
  }
  return shapes[shapes.length - 1].ring;
}

// Path SVG lisse (Catmull-Rom → bezier) fermé, à partir de points écran.
function smoothClosedPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 3) return "";
  const n = pts.length;
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d + "Z";
}

type Props = { ctx: SahelRenderContext | null };

export const Proto24Extinction: React.FC<Props> = ({ ctx }) => {
  const { fps } = useVideoConfig();

  // ── Lottie extinctionCollapse off-screen (1 instance partagée, frame-driven) ──
  const lottieRef = useRef<{ anim: any; canvas: HTMLCanvasElement | null; container: HTMLDivElement } | null>(null);
  const [, force] = useState(0);
  useEffect(() => {
    if (lottieRef.current) return;
    const container = document.createElement("div");
    container.style.cssText = "position:absolute;width:512px;height:512px;left:-9999px;top:-9999px;opacity:0;";
    document.body.appendChild(container);
    try {
      const anim = lottie.loadAnimation({
        container,
        animationData: extinctionCollapse(RED_INK_RGB),
        renderer: "canvas",
        loop: false,
        autoplay: false,
        rendererSettings: { clearCanvas: true, progressiveLoad: false },
      } as any);
      lottieRef.current = { anim, canvas: null, container };
      anim.addEventListener("DOMLoaded", () => {
        const cv = container.querySelector("canvas") as HTMLCanvasElement | null;
        if (cv && lottieRef.current) { lottieRef.current.canvas = cv; force((n) => n + 1); }
      });
    } catch {}
    return () => {
      try { lottieRef.current?.anim?.destroy?.(); } catch {}
      try { if (lottieRef.current) document.body.removeChild(lottieRef.current.container); } catch {}
      lottieRef.current = null;
    };
  }, []);

  if (!ctx) return null;
  const { frame, width, height, project } = ctx;

  // ── FRONT MOUVANT : anneau géo interpolé → projeté → path lisse ──
  const ring = interpRing(frame);
  const ringPx = ring.map(([lon, lat]) => project(lon, lat));
  const frontPath = smoothClosedPath(ringPx);
  // Le front apparaît à F_ECHEC (fade-in court).
  const frontOp = interpolate(frame, [F_ECHEC, F_ECHEC + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Sprites base-france + état d'extinction ──
  const baseSprite = staticFile("_shared/sprites/warmap/base-france.png");

  // ── Lottie : rendre l'onde d'extinction de la base la plus récemment éteinte ──
  // Garde-fou #3 : une seule onde active à la fois (la dernière déclenchée), espacées ≥75f.
  let activeWave: { base: FrBase; rel: number } | null = null;
  for (const b of FR_BASES) {
    const rel = frame - b.extinctAt;
    if (rel >= 0 && rel < 75) {
      // si plusieurs candidates (ne devrait pas arriver, espacées 75f), garder la plus récente
      if (!activeWave || b.extinctAt > activeWave.base.extinctAt) activeWave = { base: b, rel };
    }
  }
  let waveDataUrl: string | null = null;
  let wavePos: { x: number; y: number } | null = null;
  if (activeWave && lottieRef.current?.canvas) {
    try {
      const inst = lottieRef.current;
      const cv = inst.canvas;
      const totalF = inst.anim.totalFrames || 75;
      const lf = (activeWave.rel * (inst.anim.frameRate || 30)) / fps;
      inst.anim.goToAndStop(Math.min(lf, totalF - 1), true);
      waveDataUrl = cv ? cv.toDataURL("image/png") : null;
      wavePos = project(activeWave.base.coord[0], activeWave.base.coord[1]);
    } catch {}
  }
  const vmin = Math.min(width, height);
  const waveSize = 0.42 * vmin;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {/* Dégradé radial du front : bord chaud net → arrière sourd (la nappe se déplace, pas additive) */}
          <radialGradient id="p24-front" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={RED_DEEP} stopOpacity={0.15} />
            <stop offset="72%" stopColor={RED_INK} stopOpacity={0.32} />
            <stop offset="100%" stopColor={RED_INK} stopOpacity={0.5} />
          </radialGradient>
          {/* Hachures de tension sous le bord d'attaque (l'encre seule ne se lit pas — leçon P1) */}
          <pattern id="p24-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke={RED_INK} strokeWidth="1.4" strokeOpacity="0.4" />
          </pattern>
        </defs>

        {/* FRONT MOUVANT — nappe organique (garde-fou #1) */}
        {frontPath && (
          <g opacity={frontOp}>
            <path d={frontPath} fill="url(#p24-front)" />
            <path d={frontPath} fill="url(#p24-hatch)" opacity={0.5} />
            {/* bord d'attaque net (le "front" lui-même) */}
            <path d={frontPath} fill="none" stroke={RED_INK} strokeWidth={2.2} strokeOpacity={0.62} />
          </g>
        )}

        {/* BASES FR — sprites à ombre, désaturation à l'extinction (garde-fous #4 #5) */}
        {FR_BASES.map((b) => {
          const p = project(b.coord[0], b.coord[1]);
          // apparition : les bases sont déjà là au début du beat (installées en P2). Spring léger d'arrivée.
          const appear = spring({ frame: frame - F_ECHEC, fps, config: { damping: 14 }, durationInFrames: 18 });
          const rel = frame - b.extinctAt;
          // extinction : sur 40f, grayscale + opacity + perte d'ombre.
          const deadT = interpolate(rel, [0, 40], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
          });
          const sizeBase = 0.062 * vmin;
          // micro-effondrement du sprite au moment de l'extinction (scale 1 → 0.86)
          const scale = appear * (1 - deadT * 0.14);
          const op = appear * (1 - deadT * 0.55); // morte = opacity 0.45 (fantôme grisé, pas disparue)
          const sz = sizeBase * scale;
          const halo = (1 - deadT); // halo d'ancrage disparaît à la mort
          return (
            <g key={b.id} transform={`translate(${p.x},${p.y})`} opacity={op}>
              {/* halo d'ancrage vivant (anneau acier discret) */}
              {halo > 0.02 && (
                <circle r={sz * 0.92} fill="none" stroke={STEEL} strokeWidth={1.6}
                  strokeOpacity={0.4 * halo} />
              )}
            </g>
          );
        })}
      </svg>

      {/* SPRITES base-france en <img> (drop-shadow encre chaude). Hors SVG pour le filtre CSS. */}
      {FR_BASES.map((b) => {
        const p = project(b.coord[0], b.coord[1]);
        const appear = spring({ frame: frame - F_ECHEC, fps, config: { damping: 14 }, durationInFrames: 18 });
        const rel = frame - b.extinctAt;
        const deadT = interpolate(rel, [0, 40], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
        });
        const sizeBase = 0.072 * vmin;
        const scale = appear * (1 - deadT * 0.14);
        const op = appear * (1 - deadT * 0.55);
        const sz = sizeBase * scale;
        if (op <= 0.02) return null;
        // ombre : chaude et présente quand vivante, s'éteint à la mort.
        const shadowAlpha = 0.45 * (1 - deadT);
        // désaturation : grayscale monte, légère teinte sépia-mort.
        const grayscale = deadT;
        const brightness = 1 - deadT * 0.25;
        return (
          <img
            key={b.id}
            src={baseSprite}
            style={{
              position: "absolute",
              left: p.x - sz / 2,
              top: p.y - sz / 2,
              width: sz,
              height: sz,
              opacity: op,
              filter: `grayscale(${grayscale}) brightness(${brightness}) drop-shadow(0 ${3 * (1 - deadT) + 1}px ${8 * (1 - deadT) + 2}px rgba(80,30,20,${shadowAlpha}))`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* ONDE D'EXTINCTION (Lottie sur-mesure) — un événement à la fois (garde-fou #3) */}
      {waveDataUrl && wavePos && (
        <img
          src={waveDataUrl}
          style={{
            position: "absolute",
            left: wavePos.x - waveSize / 2,
            top: wavePos.y - waveSize / 2,
            width: waveSize,
            height: waveSize,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export default Proto24Extinction;
