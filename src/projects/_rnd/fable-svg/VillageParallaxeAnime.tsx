import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  VILLAGE_DEFS,
  PLAN_CIEL,
  PLAN_OCEAN,
  PLAN_LOINTAIN,
  PLAN_VILLAGE,
  PLAN_SABLE,
  PLAN_PIROGUES,
  PLAN_AVANT,
  SUN_CX,
  SUN_GLOW_CY,
  SUN_CY,
  OCEAN_REFLECTS,
  BIRDS,
  PALM_TREES,
  WINDOWS,
} from "./villageParallaxeGroups";

export const VILLAGE_PARALLAXE_FRAMES = 780; // 26s @ 30fps

// ---------------------------------------------------------------------------
// SCENE CONTEMPLATIVE : village de pecheurs senegalais, coucher de soleil.
// Matiere = village-parallaxe.svg (7 plans nommes). Vie = code React par frame.
//
// 3 couches d'animation simultanees :
//  1) PARALLAXE : chaque plan glisse a une vitesse propre (lointain lent, avant rapide).
//  2) VIE AMBIANTE permanente : reflet qui ondule, oiseaux qui derivent, palmiers
//     qui balancent, scintillement de l'eau.
//  3) COUCHER DE SOLEIL accelere : soleil qui descend, ciel qui s'assombrit
//     (overlay nuit 0 -> 0.55), fenetres des cases qui s'allument.
//
// Frame-driven uniquement (useCurrentFrame + interpolate). Zero CSS/keyframe/timeout.
// ---------------------------------------------------------------------------

const W = 1920;
const H = 1080;
const DUR = VILLAGE_PARALLAXE_FRAMES;

// helper injection : wrapper <g> anime + contenu statique injecte
const Inject: React.FC<{ html: string; transform?: string; opacity?: number }> = ({
  html,
  transform,
  opacity = 1,
}) => <g transform={transform} opacity={opacity} dangerouslySetInnerHTML={{ __html: html }} />;

export const VillageParallaxeAnime: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- 1) PARALLAXE : la camera derive lentement vers la droite ----
  // -> les plans translatent vers la GAUCHE (tx negatif). Vitesse croissante du
  // fond vers l'avant. Amplitudes calibrees pour rester dans la marge de 200px.
  // tx(plan) = -progress * amplitude(plan). progress: 0 -> 1 sur toute la duree.
  const prog = interpolate(frame, [0, DUR], [0, 1], { extrapolateRight: "clamp" });
  const txCiel = -prog * 22; // ciel : quasi immobile
  const txLointain = -prog * 48;
  const txOcean = -prog * 70;
  const txVillage = -prog * 105;
  const txSable = -prog * 130;
  const txPirogues = -prog * 158;
  const txAvant = -prog * 190; // avant : le plus rapide (<200)

  // ---- 3) COUCHER DE SOLEIL ----
  // le soleil descend (translateY croissant) et s'enfonce sous l'horizon vers la fin
  const sunDrop = interpolate(frame, [0, DUR], [0, 175], { extrapolateRight: "clamp" });
  // le halo du soleil faiblit a mesure qu'il descend
  const sunGlowOp = interpolate(frame, [0, DUR * 0.7, DUR], [1, 0.8, 0.35], {
    extrapolateRight: "clamp",
  });
  // le disque du soleil rougit / faiblit legerement vers la fin
  const sunDiscOp = interpolate(frame, [0, DUR * 0.85, DUR], [1, 0.95, 0.7], {
    extrapolateRight: "clamp",
  });

  // overlay nuit : opacite 0 -> 0.55, montee douce, plus marquee dans le dernier tiers
  const nightOp = interpolate(
    frame,
    [0, DUR * 0.35, DUR * 0.7, DUR],
    [0, 0.12, 0.34, 0.55],
    { extrapolateRight: "clamp" },
  );

  // fenetres qui s'allument : eclat qui monte quand la nuit tombe
  // (retarde : les gens allument quand il commence a faire sombre)
  const windowGlow = interpolate(frame, [DUR * 0.32, DUR * 0.75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#16213a" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: VILLAGE_DEFS }} />

        {/* ============ PLAN CIEL (parallaxe la plus lente) + SOLEIL ============ */}
        <g transform={`translate(${txCiel} 0)`}>
          <g dangerouslySetInnerHTML={{ __html: PLAN_CIEL }} />
          {/* soleil : glow + disque, descendent ensemble (translateY) */}
          <g transform={`translate(0 ${sunDrop})`}>
            <ellipse
              cx={SUN_CX}
              cy={SUN_GLOW_CY}
              rx={460}
              ry={330}
              fill="url(#gSunGlow)"
              opacity={sunGlowOp}
            />
            <circle cx={SUN_CX} cy={SUN_CY} r={95} fill="url(#gSun)" opacity={sunDiscOp} />
          </g>
        </g>

        {/* ============ PLAN OCEAN + REFLET ONDULANT ============ */}
        <g transform={`translate(${txOcean} 0)`}>
          <g dangerouslySetInnerHTML={{ __html: PLAN_OCEAN }} />
          {/* reflet du soleil : chaque bande ondule (scaleX + opacite en sin), et
              descend avec le soleil (translateY partiel), s'eteint avec la nuit */}
          <g transform={`translate(0 ${sunDrop * 0.55})`}>
            {OCEAN_REFLECTS.map((r, i) => {
              const wobble = Math.sin(frame / 14 + i * 0.9);
              const scaleX = 1 + 0.16 * wobble;
              const op =
                r.op *
                (0.78 + 0.22 * Math.sin(frame / 11 + i * 1.4)) *
                (1 - nightOp * 0.75);
              return (
                <ellipse
                  key={i}
                  cx={r.cx}
                  cy={r.cy}
                  rx={r.rx}
                  ry={r.ry}
                  fill={r.fill}
                  opacity={Math.max(0, op)}
                  transform={`translate(${r.cx} ${r.cy}) scale(${scaleX} 1) translate(${-r.cx} ${-r.cy})`}
                />
              );
            })}
          </g>
        </g>

        {/* ============ PLAN LOINTAIN + OISEAUX qui derivent ============ */}
        <g transform={`translate(${txLointain} 0)`}>
          <g dangerouslySetInnerHTML={{ __html: PLAN_LOINTAIN }} />
          {BIRDS.map((b, i) => {
            // derive lente vers la gauche + petit flottement vertical
            const drift = -(frame * (0.18 + i * 0.02));
            const bob = 6 * Math.sin(frame / 22 + i * 1.3);
            return (
              <use
                key={i}
                href="#bird"
                transform={`translate(${b.x + drift} ${b.y + bob}) scale(${b.scale})`}
                stroke="#4a3242"
                strokeWidth={3}
                fill="none"
              />
            );
          })}
        </g>

        {/* ============ PLAN VILLAGE + PALMIERS qui balancent + FENETRES ============ */}
        <g transform={`translate(${txVillage} 0)`}>
          <g dangerouslySetInnerHTML={{ __html: PLAN_VILLAGE }} />
          {/* palmiers : chaque fronde tourne tres legerement autour du pivot */}
          {PALM_TREES.map((tree, ti) => {
            const sway = 2.6 * Math.sin(frame / 26 + ti * 0.8); // amplitude douce (deg)
            return (
              <g key={ti} transform={`translate(${tree.px} ${tree.py})`}>
                <g transform={`rotate(${sway})`}>
                  {tree.fronds.map((f, fi) => (
                    <use
                      key={fi}
                      href="#frond"
                      transform={`rotate(${f.rot}) scale(${f.scale})`}
                      fill={f.fill}
                    />
                  ))}
                </g>
              </g>
            );
          })}
          {/* fenetres : eclat de base + halo qui monte a la nuit tombante */}
          {WINDOWS.map((win, i) => {
            const cx = win.x + win.w / 2;
            const cy = win.y + win.h / 2;
            const flicker = 1 + 0.05 * windowGlow * Math.sin(frame / 7 + i * 2.1);
            const haloR = Math.max(win.w, win.h) * (0.9 + 0.5 * windowGlow);
            return (
              <g key={i}>
                {/* halo chaud qui grandit avec la nuit */}
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={haloR}
                  ry={haloR * 0.8}
                  fill="#ffdf9a"
                  opacity={0.45 * windowGlow * flicker}
                />
                {/* vitre : plus vive la nuit */}
                <rect
                  x={win.x}
                  y={win.y}
                  width={win.w}
                  height={win.h}
                  fill={win.fill}
                  opacity={(0.55 + 0.45 * windowGlow) * flicker}
                />
              </g>
            );
          })}
        </g>

        {/* ============ PLAN SABLE ============ */}
        <Inject html={PLAN_SABLE} transform={`translate(${txSable} 0)`} />

        {/* ============ PLAN PIROGUES ============ */}
        <Inject html={PLAN_PIROGUES} transform={`translate(${txPirogues} 0)`} />

        {/* ============ PLAN AVANT (parallaxe la plus rapide) ============ */}
        <Inject html={PLAN_AVANT} transform={`translate(${txAvant} 0)`} />

        {/* ============ OVERLAY NUIT (assombrissement global corail -> violet-nuit) ============ */}
        {/* Ne couvre PAS le sable/premier plan integralement pour garder les lumieres :
            un rect plein ecran en multiply-like via opacite. Le degrade nuit tombe du
            haut (ciel) vers le bas. */}
        <rect x={-200} y={-60} width={2320} height={1200} fill="url(#gNight)" opacity={nightOp} />

        {/* premieres etoiles qui apparaissent en haut du ciel quand la nuit tombe */}
        <g opacity={interpolate(frame, [DUR * 0.6, DUR], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          {STARS.map((s, i) => {
            const tw = 0.5 + 0.5 * Math.sin(frame / 9 + i * 1.7);
            return <circle key={i} cx={s.x + txCiel} cy={s.y} r={s.r} fill="#fff6d8" opacity={tw} />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// petites etoiles fixes (haut du ciel), scintillent en fin de scene
const STARS: { x: number; y: number; r: number }[] = [
  { x: 240, y: 90, r: 2.2 },
  { x: 430, y: 150, r: 1.6 },
  { x: 610, y: 80, r: 2 },
  { x: 820, y: 130, r: 1.5 },
  { x: 1360, y: 100, r: 2.1 },
  { x: 1580, y: 160, r: 1.7 },
  { x: 1780, y: 90, r: 1.9 },
  { x: 1050, y: 70, r: 1.6 },
  { x: 1220, y: 180, r: 1.4 },
  { x: 340, y: 210, r: 1.5 },
];
