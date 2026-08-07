// P1 v2 — "On traite encore toutes les connexions de la meme maniere" / "ralentit tout le
// monde" / "croise les doigts". 0 -> 10.9s.
//
// REFONTE POST-JURY (2026-08-07, rejet v1 unanime 4/4 : Gemini/Kimi/GPT/Grok — "diaporama
// statique"). Cause racine identifiee : le flux v1 utilisait le SVG Fable (image DEJA figee de
// traits positionnes), anime seulement en opacite/translation de bloc — jamais de vrai mouvement
// continu. v2 genere 120 traits PROCEDURALEMENT en code, chacun avec sa propre vitesse/longueur/
// phase, en boucle perpetuelle — le flux ne s'arrete JAMAIS de bouger du debut a la fin du
// panneau (regle n°1 du jury : rien de statique > 1s). Le decor (grille, vignette) reste le SVG
// Fable (matiere statique legitime). Cf memory/client-sim-tests/noteshield/
// SCRIPT-ANIMATION-V2-SYNTHESE-JURY.md § P1 pour le detail du brief retenu.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { P1_FLUX_SVG } from "./bodies/P1FluxBody";
import { extractGroup, extractDefs } from "./svgGroupExtractor";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920;
const H = 1080;
const BARRIER_X = 1240;

const DEFS = extractDefs(P1_FLUX_SVG);
const G = {
  bg: extractGroup(P1_FLUX_SVG, "bg"),
  structureGrid: extractGroup(P1_FLUX_SVG, "structure_grid"),
  vignette: extractGroup(P1_FLUX_SVG, "vignette"),
};
const Raw: React.FC<{ body: string; opacity?: number }> = ({ body, opacity }) => (
  <g opacity={opacity} dangerouslySetInnerHTML={{ __html: body }} />
);

// "ralentit" : 4.319 -> 4.859s (blocage). "doigts." : 9.099 -> 9.319s (liberation).
const T_BARRIERE_IN = 4.319;
const T_BARRIERE_OUT = 9.099;

type Trait = {
  y: number;
  len: number;
  speed: number; // px/frame en phase libre
  phase: number; // decalage temporel (frames) pour desynchroniser
  isRed: boolean;
  lane: "far" | "mid" | "near"; // profondeur -> opacite/epaisseur
  packJitter: number;
};

// 120 traits generes deterministiquement (seed fixe -> meme resultat a chaque render).
function makeTraits(count: number, redIndices: number[]): Trait[] {
  const traits: Trait[] = [];
  for (let i = 0; i < count; i++) {
    // pseudo-random deterministe base sur i (pas de Math.random -- jamais entre renders).
    const seed = (i * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    const rnd2 = ((i * 3571 + 1013) % 233280) / 233280;
    const lane: Trait["lane"] = i % 3 === 0 ? "far" : i % 3 === 1 ? "mid" : "near";
    traits.push({
      y: 60 + rnd * (H - 120),
      len: 40 + rnd2 * 90,
      speed: lane === "far" ? 6 + rnd * 3 : lane === "mid" ? 10 + rnd * 5 : 15 + rnd * 8,
      phase: Math.floor(rnd * 400),
      isRed: redIndices.includes(i),
      lane,
      packJitter: rnd * 70, // decale la compression contre la barriere pour eviter l'effet grille
    });
  }
  return traits;
}

const LANE_STYLE = {
  far: { opacity: 0.35, height: 3, blur: 1.8 },
  mid: { opacity: 0.6, height: 5, blur: 0.6 },
  near: { opacity: 0.9, height: 7, blur: 0 },
};

export const P1FluxBlocage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const traits = useMemo(() => makeTraits(120, [17, 53, 89]), []);

  const barriereIn = spring({
    frame: frame - T_BARRIERE_IN * fps,
    fps,
    config: { damping: 11, stiffness: 170 },
  });
  const barriereOut = interpolate(t, [T_BARRIERE_OUT, T_BARRIERE_OUT + 0.06], [1, 0], clamp);
  const barriereOpacity = Math.min(barriereIn, barriereOut);
  const barriereScaleY = interpolate(barriereIn, [0, 0.7, 1], [0.2, 1.08, 1], clamp);
  const barriereFlash = interpolate(t, [T_BARRIERE_IN, T_BARRIERE_IN + 0.12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isBlocked = t >= T_BARRIERE_IN && t < T_BARRIERE_OUT;
  const isFleeing = t >= T_BARRIERE_OUT;
  const fuiteProgress = interpolate(t, [T_BARRIERE_OUT, T_BARRIERE_OUT + 1.1], [0, 1], {
    ...clamp,
    easing: (x) => x * x * x,
  });

  // Densification progressive du flux jusqu'au blocage (1.5-3.8s dans le brief jury).
  const densityRamp = interpolate(t, [0, 1.5, 3.8], [0.5, 0.75, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "#0A1628" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />
        <Raw body={G.bg} />
        <Raw body={G.structureGrid} />

        {traits.map((tr, i) => {
          const style = LANE_STYLE[tr.lane];
          let x: number;
          let opacity = style.opacity * densityRamp;

          if (!isBlocked && !isFleeing) {
            // Flux libre continu : boucle perpetuelle de la droite du cadre... non, gauche->droite,
            // repart a gauche des qu'il sort a droite (avant blocage) ou juste avant la barriere.
            const cycle = (W + tr.len * 2) / tr.speed;
            const localFrame = (frame + tr.phase) % cycle;
            x = -tr.len + localFrame * tr.speed;
            if (x > BARRIER_X - 20) x = BARRIER_X - 20 - ((x - (BARRIER_X - 20)) % (BARRIER_X - 20 + tr.len));
          } else if (isBlocked) {
            // Compression contre la barriere : la position d'equilibre depend du lane (near = plus
            // proche du mur) + packJitter (par-trait, evite l'effet grille) + jitter perpetuel
            // (photo jamais figee tant que le blocage dure).
            const laneOffset = tr.lane === "near" ? 6 : tr.lane === "mid" ? 90 : 180;
            const jitter = Math.sin((frame + tr.phase) * 0.15) * 2.5;
            const settle = interpolate(t, [T_BARRIERE_IN, T_BARRIERE_IN + 0.5], [220, 0], clamp);
            x = BARRIER_X - 30 - laneOffset - tr.packJitter + jitter + settle;
            opacity = style.opacity;
          } else {
            // Fuite : acceleration exponentielle vers la droite, sort du cadre.
            const laneOffset = tr.lane === "near" ? 6 : tr.lane === "mid" ? 90 : 180;
            const startX = BARRIER_X - 30 - laneOffset - tr.packJitter;
            const speedMul = tr.isRed ? 1.6 : 1;
            x = startX + fuiteProgress * (W - startX + 400) * speedMul;
            opacity = style.opacity;
          }

          const color = tr.isRed ? "#F43F5E" : tr.lane === "far" ? "#7FA8C9" : "#00D9FF";
          const trailColor = tr.isRed ? "#F43F5E" : "#F4F1EA";

          return (
            <g key={i} opacity={opacity}>
              <rect
                x={x}
                y={tr.y}
                width={tr.len * (isFleeing ? 1.6 : 1)}
                height={style.height}
                rx={style.height / 2}
                fill={color}
                filter={style.blur > 0 ? `blur(${style.blur}px)` : undefined}
              />
              <rect
                x={x + tr.len * (isFleeing ? 1.6 : 1) - 10}
                y={tr.y}
                width={10}
                height={style.height}
                rx={style.height / 2}
                fill={trailColor}
              />
            </g>
          );
        })}

        {/* Barriere : jaillit avec overshoot + flash d'impact, disparait net. */}
        <g opacity={barriereOpacity}>
          <rect
            x={BARRIER_X - 4}
            y={540 - 470 * barriereScaleY}
            width={8}
            height={940 * barriereScaleY}
            rx={4}
            fill="#F4F1EA"
          />
          <rect
            x={BARRIER_X - 14}
            y={540 - 470 * barriereScaleY}
            width={28}
            height={940 * barriereScaleY}
            rx={14}
            fill="#00D9FF"
            opacity={0.25}
          />
        </g>
        {barriereFlash > 0 && (
          <circle cx={BARRIER_X} cy={540} r={40 + (1 - barriereFlash) * 200} fill="#F4F1EA" opacity={barriereFlash * 0.5} />
        )}

        <Raw body={G.vignette} />
      </svg>
    </AbsoluteFill>
  );
};
