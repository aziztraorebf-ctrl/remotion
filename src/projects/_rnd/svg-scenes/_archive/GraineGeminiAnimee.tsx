/**
 * GraineGeminiAnimee — "D'UNE GRAINE NAIT UN ARBRE" — scene pedagogique en PAPIER DECOUPE (paper-cut),
 * Gemini 3.1 Pro, animee en JSX. R&D SVG-SCENES-GENERATIVES (registre papier-decoupe = NEUF, cree ici).
 *
 * INTENTION : faire RESSENTIR la CROISSANCE (minuscule -> grand et vivant).
 * FORME : une verticale qui SE CONSTRUIT du bas vers le haut, etape par etape, jusqu'a l'apogee feuillu.
 * REGISTRE : papier decoupe (couches pleines empilees + ombres portees douces + palette claire chaleureuse).
 *
 * ⭐ DOCTRINE 2 COUCHES :
 *   COUCHE DE FOND (permanente, f0 -> fin) : ciel + terre toujours la ; le SOLEIL pulse (la lumiere nourricière) ;
 *     les NUAGES derivent en boucle (jamais hors cadre) ; leger drift Ken Burns. La scene respire en continu.
 *   COUCHE D'EVENEMENTS (se construit, regle ~5s, chaque etape demarre puis CONTINUE) :
 *     ~f20  la GRAINE apparait (scale + petit rebond spring), ISOLEE, lisible avant tout le reste   + plate-pop
 *     ~f55  les RACINES poussent vers le BAS (trace stroke-dashoffset)                               + whoosh doux
 *     ~f95  le TRONC GRANDIT verticalement depuis la base (scaleY ancre au sol y=850) — la pousse     + tick + drone swell
 *     ~f175 les BRANCHES se DEPLOIENT (scale depuis leur point d'attache ~960,550)                    + node-appear x2
 *     ~f235 le FEUILLAGE s'EPANOUIT par VAGUES (5 couches sombre->clair, scale-up successif) = apogee + whoosh/impact
 *     ~f350 les FRUITS popent (rebond elastique), touche finale de vie                                + blip x4
 *
 * ⛔ REGLE OBJET / CROISSANCE : un arbre qui POUSSE est un organisme vivant — sa croissance = scaleY/scale depuis
 *   son ancre (le sol pour le tronc, le tronc pour les branches/feuillage). Ce n'est PAS un "glissement lateral"
 *   d'objet inerte (interdit), c'est le geste NATUREL de la croissance vegetale.
 *
 * Technique : groupes injectes en innerHTML dans des <g> WRAPPER JSX (animables). Les 5 couches de feuillage sont
 * separees pour l'epanouissement en vagues. SFX time frame-perfect.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence, Audio, staticFile } from "remotion";
import {
  G_CIEL, G_NUAGES, G_SOLEIL, G_TERRE, G_RACINES, G_GRAINE, G_TRONC, G_BRANCHES, G_FEUILLAGE, G_FRUITS,
} from "./graineGeminiGroups";

const BG = "#f7ecd2";

const Grp: React.FC<{ body: string; transform?: string; opacity?: number; style?: React.CSSProperties }> = ({
  body, transform, opacity, style,
}) => <g transform={transform} opacity={opacity} style={style} dangerouslySetInnerHTML={{ __html: body }} />;

// --- decoupe du FEUILLAGE en ses 5 paires (ombre+couleur), sombre -> clair, pour l'epanouissement en vagues ---
// chaque "couche" du paper-cut = un <g ombre> suivi d'un <g couleur>. On regroupe par paire (10 <g> -> 5 paires).
const FOLIAGE_LAYERS = (() => {
  const parts = G_FEUILLAGE.match(/<g[\s\S]*?<\/g>/g) || [];
  const pairs: string[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    pairs.push((parts[i] || "") + (parts[i + 1] || ""));
  }
  return pairs; // [#3e7c34 profond, #569b43, #7cba5a, #a8d678 rehaut] — sombre derriere -> clair devant
})();

export const GraineGeminiAnimee: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------- COUCHE DE FOND (permanente) ----------
  const driftScale = interpolate(f, [0, 480], [1.0, 1.035]);
  const driftX = Math.sin(f / 130) * 6;

  // nuages : derive en boucle interne (3 copies, jamais hors cadre)
  const cloudSpan = 900;
  const cloudShift = -((f * 0.32) % cloudSpan);

  // soleil : pulse doux et continu (la lumiere nourricière)
  const sunPulse = 1 + 0.045 * Math.sin(f / 26);
  const sunGlow = 0.85 + 0.15 * (Math.sin(f / 26) + 1) / 2;

  // ---------- COUCHE D'EVENEMENTS ----------
  // GRAINE : pop avec petit rebond, reste visible (l'origine)
  const graineSpring = spring({ frame: f - 20, fps, config: { mass: 0.6, damping: 9, stiffness: 130 }, durationInFrames: 28 });
  const graineScale = f >= 20 ? interpolate(graineSpring, [0, 1], [0, 1]) : 0;
  const graineOn = f >= 20;

  // RACINES : se tracent vers le bas (stroke-dashoffset)
  const ROOT_LEN = 220;
  const rootProg = interpolate(f, [55, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rootDashOffset = ROOT_LEN * (1 - rootProg);
  const rootOn = f >= 55;

  // TRONC : GRANDIT verticalement depuis la base (ancre y=850). scaleY 0 -> 1.
  const troncSpring = spring({ frame: f - 95, fps, config: { mass: 1.0, damping: 14, stiffness: 70 }, durationInFrames: 80 });
  const troncScaleY = f >= 95 ? troncSpring : 0;
  const troncOn = f >= 95;
  const TRUNK_BASE_Y = 850;

  // BRANCHES : se deploient (scale depuis le point d'attache ~960,550)
  const branchSpring = spring({ frame: f - 175, fps, config: { mass: 0.8, damping: 12, stiffness: 85 }, durationInFrames: 55 });
  const branchScale = f >= 175 ? branchSpring : 0;
  const branchOn = f >= 175;
  const BRANCH_ANCHOR = { x: 960, y: 550 };

  // FEUILLAGE : epanouissement par VAGUES. Chaque couche demarre 14f apres la precedente,
  // scale-up depuis le centre de la couronne (~960,330) avec rebond.
  const FOLIAGE_CENTER = { x: 960, y: 330 };
  const foliageStart = 235;
  const foliageLayerSpring = (idx: number) =>
    spring({ frame: f - (foliageStart + idx * 14), fps, config: { mass: 0.7, damping: 11, stiffness: 95 }, durationInFrames: 40 });

  // FRUITS : pop elastique final (apres le feuillage)
  const fruitSpring = spring({ frame: f - 350, fps, config: { mass: 0.5, damping: 8, stiffness: 150 }, durationInFrames: 30 });
  const fruitScale = f >= 350 ? fruitSpring : 0;
  const fruitOn = f >= 350;

  // ---------- COUCHE DE FINITION (orchestration : rendre l'arbre VIVANT) ----------

  // BALANCEMENT AU VENT — s'installe une fois l'arbre pousse (~f240+). Oscillation sin DEPHASEE par etage :
  // le tronc bouge tres peu, les branches moyennement, le feuillage/extremites le plus (vrai arbre au vent).
  const windOn = interpolate(f, [240, 300], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // rotation (deg) autour d'une ancre, amplitude + vitesse + phase parametrables
  const sway = (ampDeg: number, speed: number, phase: number) =>
    Math.sin(f / speed + phase) * ampDeg * windOn;
  const troncSway = sway(0.5, 38, 0);       // tronc : tres leger
  const branchSway = sway(1.3, 32, 0.6);    // branches : moyen
  const foliageSway = sway(2.4, 28, 1.1);   // feuillage : ample (les bouts bougent le plus)

  // SOLEIL ACTIF — rayons qui tournent lentement + halo qui respire (en plus du pulse existant)
  const sunRayAngle = f * 0.25;             // rotation lente continue des rayons
  const sunHalo = 0.5 + 0.3 * (Math.sin(f / 22) + 1) / 2; // halo qui respire

  // UN FRUIT QUI TOMBE — un fruit mur se detache (~f410), tombe + rebondit au sol. Le cycle se referme.
  const dropStart = 410;
  const fruitDropOn = f >= dropStart;
  // chute par gravite + rebond : spring sur la position Y (de la couronne ~y360 jusqu'au sol ~y870)
  const dropSpring = spring({ frame: f - dropStart, fps, config: { mass: 1.1, damping: 11, stiffness: 75 }, durationInFrames: 60 });
  const FRUIT_FALL_FROM = 360, FRUIT_FALL_TO = 872;
  const droppedFruitY = interpolate(dropSpring, [0, 1], [FRUIT_FALL_FROM, FRUIT_FALL_TO]);
  const droppedFruitX = 1012; // un des fruits, cote droit de la couronne
  // squash a l'impact (vers f455)
  const dropSquash = 1 - Math.max(0, interpolate(f, [452, 458, 466], [0, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // FEUILLES QUI FLOTTENT — 4 feuilles se detachent du feuillage (~f300+) et descendent en ZIGZAG.
  const LEAVES = [
    { x: 880, startF: 300, speed: 70, sway: 60, hue: "#7cba5a" },
    { x: 1040, startF: 340, speed: 84, sway: 80, hue: "#569b43" },
    { x: 950, startF: 380, speed: 76, sway: 70, hue: "#a8d678" },
    { x: 1080, startF: 420, speed: 90, sway: 90, hue: "#7cba5a" },
  ];

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* ===== AUDIO NATURE (SFX générés ElevenLabs — ambiance douce, pas War-Map) ===== */}
      {/* lit permanent : chant d'oiseaux (loop) + bruissement de vent par-dessus (sources douces -> volume remonté) */}
      <Sequence from={0} durationInFrames={480}>
        <Audio src={staticFile("_shared/sfx/nature/birds-ambient.mp3")} volume={0.85} loop />
      </Sequence>
      <Sequence from={0} durationInFrames={480}>
        <Audio src={staticFile("_shared/sfx/nature/wind-leaves.mp3")} volume={0.5} loop />
      </Sequence>
      {/* la graine apparait : petit pop doux */}
      <Sequence from={20} durationInFrames={20}>
        <Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.45} />
      </Sequence>
      {/* le tronc pousse : pop organique de croissance */}
      <Sequence from={95} durationInFrames={36}>
        <Audio src={staticFile("_shared/sfx/nature/growth-pop.mp3")} volume={0.55} />
      </Sequence>
      {/* les branches se deploient : 2 pops de croissance plus legers */}
      <Sequence from={175} durationInFrames={36}>
        <Audio src={staticFile("_shared/sfx/nature/growth-pop.mp3")} volume={0.42} />
      </Sequence>
      {/* le feuillage s'epanouit : bruissement de feuilles marque */}
      <Sequence from={235} durationInFrames={40}>
        <Audio src={staticFile("_shared/sfx/nature/wind-leaves.mp3")} volume={0.45} />
      </Sequence>
      {/* les fruits popent : blips doux */}
      {[350, 365, 380, 395].map((s) => (
        <Sequence key={s} from={s} durationInFrames={16}>
          <Audio src={staticFile("_shared/sfx/ui/blip-bubble.mp3")} volume={0.4} />
        </Sequence>
      ))}
      {/* le fruit tombe au sol : thud doux a l'impact (~f455) */}
      <Sequence from={450} durationInFrames={20}>
        <Audio src={staticFile("_shared/sfx/nature/fruit-drop.mp3")} volume={0.55} />
      </Sequence>

      {/* ===== IMAGE ===== */}
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${driftX} 0) scale(${driftScale}) translate(${(1 - driftScale) * 960} ${(1 - driftScale) * 540})`}>

          {/* CIEL (fond permanent) */}
          <Grp body={G_CIEL} />

          {/* NUAGES — derive en boucle interne */}
          <g>
            <Grp body={G_NUAGES} transform={`translate(${cloudShift} 0)`} />
            <Grp body={G_NUAGES} transform={`translate(${cloudShift + cloudSpan} 0)`} />
            <Grp body={G_NUAGES} transform={`translate(${cloudShift + cloudSpan * 2} 0)`} />
          </g>

          {/* SOLEIL ACTIF — halo qui respire + RAYONS QUI TOURNENT + pulse doux (centre 1650,200) */}
          <g transform={`translate(${1650 * (1 - sunPulse)} ${200 * (1 - sunPulse)}) scale(${sunPulse})`} opacity={sunGlow}>
            {/* halo glow doux derriere le soleil */}
            <circle cx={1650} cy={200} r={140} fill="#ffe9ad" opacity={0.35 * sunHalo} />
            <circle cx={1650} cy={200} r={110} fill="#ffd98a" opacity={0.3 * sunHalo} />
            {/* le groupe soleil de l'agent, avec ses rayons qui tournent lentement autour du centre */}
            <g transform={`rotate(${sunRayAngle} 1650 200)`}>
              <Grp body={G_SOLEIL} />
            </g>
          </g>

          {/* TERRE (fond permanent) */}
          <Grp body={G_TERRE} />

          {/* RACINES — se tracent vers le bas (sous la graine) */}
          {rootOn && (
            <g style={{ strokeDasharray: ROOT_LEN, strokeDashoffset: rootDashOffset } as React.CSSProperties}>
              <Grp body={G_RACINES} />
            </g>
          )}

          {/* TRONC — GRANDIT verticalement depuis la base (ancre y=850) */}
          {troncOn && (
            <g transform={`translate(0 ${TRUNK_BASE_Y * (1 - troncScaleY)}) scale(1 ${troncScaleY})`}>
              <Grp body={G_TRONC} />
            </g>
          )}

          {/* GRAINE — pop avec rebond, ISOLEE et lisible AVANT le reste, reste l'origine */}
          {graineOn && (
            <g transform={`translate(${960 * (1 - graineScale)} ${850 * (1 - graineScale)}) scale(${graineScale})`}>
              <Grp body={G_GRAINE} />
            </g>
          )}

          {/* BRANCHES — se deploient (scale) PUIS oscillent au vent (rotate autour de l'attache 960,550) */}
          {branchOn && (
            <g transform={`rotate(${branchSway} ${BRANCH_ANCHOR.x} ${BRANCH_ANCHOR.y}) translate(${BRANCH_ANCHOR.x * (1 - branchScale)} ${BRANCH_ANCHOR.y * (1 - branchScale)}) scale(${branchScale})`}>
              <Grp body={G_BRANCHES} />
            </g>
          )}

          {/* FEUILLAGE — epanouissement par VAGUES PUIS balancement au vent (oscille avec les branches, + ample).
              Rotation autour de l'attache (960,550) pour que toute la couronne bouge comme un tout vivant. */}
          <g transform={`rotate(${foliageSway} ${BRANCH_ANCHOR.x} ${BRANCH_ANCHOR.y})`}>
            {FOLIAGE_LAYERS.map((layer, idx) => {
              const s = foliageLayerSpring(idx);
              if (f < foliageStart + idx * 14) return null;
              return (
                <g
                  key={idx}
                  transform={`translate(${FOLIAGE_CENTER.x * (1 - s)} ${FOLIAGE_CENTER.y * (1 - s)}) scale(${s})`}
                >
                  <Grp body={layer} />
                </g>
              );
            })}
          </g>

          {/* FRUITS — pop elastique final, oscillent AVEC le feuillage (meme balancement) */}
          {fruitOn && (
            <g transform={`rotate(${foliageSway} ${BRANCH_ANCHOR.x} ${BRANCH_ANCHOR.y})`}>
              <g transform={`translate(${FOLIAGE_CENTER.x * (1 - fruitScale)} ${FOLIAGE_CENTER.y * (1 - fruitScale)}) scale(${fruitScale})`}>
                <Grp body={G_FRUITS} />
              </g>
            </g>
          )}

          {/* UN FRUIT QUI TOMBE — se detache de la couronne, chute + rebond au sol (le cycle se referme) */}
          {fruitDropOn && (
            <g transform={`translate(${droppedFruitX} ${droppedFruitY}) scale(1 ${dropSquash})`}>
              <circle cx={0} cy={0} r={22} fill="#d65a4a" stroke="#b3402f" strokeWidth={3} />
              <ellipse cx={-7} cy={-7} rx={6} ry={4} fill="#ee8474" opacity={0.8} />
              <path d="M0 -22 Q4 -32 12 -34" fill="none" stroke="#7a4a22" strokeWidth={3} strokeLinecap="round" />
            </g>
          )}

          {/* FEUILLES QUI FLOTTENT — se detachent et descendent en ZIGZAG (la touche vivante) */}
          {LEAVES.map((lf, i) => {
            if (f < lf.startF) return null;
            const t = (f - lf.startF) / lf.speed;          // progression de la chute
            const fallY = 340 + t * 70;                     // descend lentement
            if (fallY > 1020) return null;                  // disparait avant le bas du cadre
            const zig = Math.sin((f - lf.startF) / 9) * lf.sway; // zigzag horizontal
            const rot = Math.sin((f - lf.startF) / 7) * 40;      // la feuille tourne en tombant
            const op = interpolate(f, [lf.startF, lf.startF + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
              * interpolate(fallY, [820, 1000], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <g key={i} transform={`translate(${lf.x + zig} ${fallY}) rotate(${rot})`} opacity={op}>
                <path d="M0 -11 Q11 -4 0 13 Q-11 -4 0 -11 Z" fill={lf.hue} stroke="#3e7c34" strokeWidth={1.5} />
                <line x1={0} y1={-9} x2={0} y2={11} stroke="#3e7c34" strokeWidth={1} opacity={0.6} />
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default GraineGeminiAnimee;
