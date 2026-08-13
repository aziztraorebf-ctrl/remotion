// AtmosphereCanvas — couche d'ambiance en <canvas> 2D, frame-driven et deterministe.
//
// POURQUOI CANVAS ET PAS SVG (la raison d'etre de cette brique) :
// nos scenes SVG excellent sur la FORME (contours nets, tracé, jetons, cartes) mais sont seches :
// pas de grain, pas de lumiere volumetrique. Un millier de particules en <circle> SVG = un millier de
// noeuds DOM par frame (lent, et le rendu reste "propre" donc plat). Le canvas peint des PIXELS : on
// obtient de la poussiere en suspension, du halo qui bave, de la profondeur — impossible proprement en
// SVG. Les deux couches coexistent dans la meme composition Remotion.
//
// DETERMINISME (non-negociable pour le rendu headless) :
//  - zero Math.random au render : LCG seede, meme logique que ParticleDissolve.
//  - zero requestAnimationFrame / setTimeout : on repeint sur useCurrentFrame(), rien d'autre.
//  - le repaint est un effet de useCurrentFrame -> chaque frame est reproductible a l'identique.
//
// Origine : test "couche atmosphere" (2026-07-25) — inspire des demos HTML/canvas Opus 5 (neon, pluie),
// ramene a notre registre : discret, sous les SVG, jamais decoratif pour lui-meme.
//
// Usage (entre le fond et le <svg> de la scene) :
//   <AtmosphereCanvas width={W} height={H} count={220} color="#f0e8d2" glowColor="#b8860b" />

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type AtmosphereCanvasProps = {
  width: number;
  height: number;
  /** nombre de grains. 150-300 = suspension discrete ; au-dela ca devient une tempete. */
  count?: number;
  /** couleur du grain (typiquement l'encre claire de la palette). */
  color?: string;
  /** halo chaud autour des plus gros grains (palette du beat, ex OR). */
  glowColor?: string;
  seed?: number;
  /** opacite globale de la couche. Defaut 0.5 : on doit la DEVINER, pas la voir. */
  intensity?: number;
  /** vitesse de derive verticale, en px/seconde (negatif = monte). Defaut -9. */
  driftY?: number;
  /** amplitude de l'oscillation horizontale, px. Defaut 18. */
  swayX?: number;
  /** "dust" = grains ronds en suspension (defaut) · "rain" = traits inclines qui tombent. */
  mode?: "dust" | "rain";
  /** mode rain : longueur des traits, px. Defaut 18. */
  streakLen?: number;
  /** mode rain : inclinaison des traits (px d'ecart horizontal sur la longueur). Defaut 3. */
  slant?: number;
};

type Grain = {
  x: number;
  y: number;
  size: number;
  /** vitesse propre, multiplie driftY — cree la parallaxe (les gros grains vont plus vite = plus proches) */
  speed: number;
  phase: number;
  swayFreq: number;
  alpha: number;
};

function makeGrains(count: number, w: number, h: number, seed: number): Grain[] {
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const grains: Grain[] = [];
  for (let i = 0; i < count; i++) {
    const depth = rnd(); // 0 = loin (petit, lent, pale), 1 = proche (gros, rapide, net)
    grains.push({
      x: rnd() * w,
      y: rnd() * h,
      size: 0.6 + depth * 2.2,
      speed: 0.35 + depth * 1.0,
      phase: rnd() * Math.PI * 2,
      swayFreq: 0.15 + rnd() * 0.35,
      alpha: 0.18 + depth * 0.55,
    });
  }
  return grains;
}

export const AtmosphereCanvas: React.FC<AtmosphereCanvasProps> = ({
  width,
  height,
  count = 220,
  color = "#f0e8d2",
  glowColor,
  seed = 7,
  intensity = 0.5,
  driftY = -9,
  swayX = 18,
  mode = "dust",
  streakLen = 18,
  slant = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const grains = React.useMemo(() => makeGrains(count, width, height, seed), [count, width, height, seed]);

  // Repaint pilote par la frame — jamais rAF. Deterministe : t depend uniquement de frame/fps.
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const t = frame / fps;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter"; // les grains s'additionnent a la lumiere du fond

    for (const g of grains) {
      // derive verticale continue + wrap : le champ ne se vide jamais
      const rawY = g.y + driftY * g.speed * t;
      const y = ((rawY % height) + height) % height;
      const x = g.x + Math.sin(t * g.swayFreq * Math.PI * 2 + g.phase) * swayX * g.speed;

      const a = g.alpha * intensity;
      if (a <= 0.005) continue;

      if (glowColor && g.size > 1.9) {
        ctx.shadowBlur = g.size * 3;
        ctx.shadowColor = glowColor;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = a;

      if (mode === "rain") {
        // une goutte se lit comme une TRAINEE, pas comme un point : trait incline, longueur/opacite
        // indexees sur la profondeur (les gouttes proches sont plus longues et plus nettes).
        const len = streakLen * (0.5 + g.speed * 0.7);
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(0.6, g.size * 0.5);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - slant * (len / streakLen), y - len);
        ctx.stroke();
      } else {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, g.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "source-over";
  }, [frame, fps, grains, width, height, color, glowColor, intensity, driftY, swayX, mode, streakLen, slant]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0, width, height, pointerEvents: "none" }}
    />
  );
};

export default AtmosphereCanvas;
