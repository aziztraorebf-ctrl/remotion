/**
 * SenegalScene1IntroCoin — INTRO scene 1 V3 "LE DUEL DES RECITS" (~25s, REMOTION PUR).
 *
 * Utilise le VRAI template 3D <CoinFlip> (preserve-3d, rotateY, faces custom). Pivot Data-Hero.
 * Face A "LA MALEDICTION" (illustration gravee navire+derrick rouge) <-> Face B "LE MIRACLE"
 * (illustration gravee arbre a billets / richesse qui afflue). Illus GPT-image projetees dans la piece.
 *
 * ⚠️ TIMING CALE sur la narration V3 (frames LOCALES, intro = 23.5s -> 48.5s) :
 *   f0    "ces deux recits"               -> piece Face A apparait immediatement
 *   f30+  (intro)                         -> data greffees etalees pendant que la voix decrit
 *   f355  "multinationales qui pompent"   -> malediction pleine
 *   f476  "de l'autre, une nation..."     -> FLIP (image precede : flip demarre ~f460)
 *   f593  "se joue ailleurs"              -> FISSURE (la piece se brise en deux) + verdict "DEUX ILLUSIONS"
 *   f740  "teste en direct"               -> sortie vers la carte (gere par le parent)
 *
 * MODIFS Aziz (2026-06-19) : (1) suppression des titres FACE A/B + MALEDICTION/MIRACLE en haut ;
 * (2) vraies illustrations gravees projetees (GPT) au lieu des SVG codes ; (3) fond quadrille blueprint
 * au lieu du navy plat ; (4) VRAIE fissure (piece fendue en deux + ecartement + ombre interne + eclats).
 */
import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { CoinFlip } from "../_shared/components/layouts/CoinFlip";
import { SenegalCoinFaceA_SVG } from "./SenegalCoinFaceA_SVG";

const W = 1920, H = 1080;
const NAVY = "#16213a", NAVY_DEEP = "#0d1424", OCRE = "#e7bd78";
const IVORY = "#f2ebd9", CRISIS = "#c8553d", NOIR = "#050505"; // rouge patine (charte navy/or), pas vif

// ⛔ AUDIO : narration-v3-VALIDEE.mp3 = narration COMPLETE (492s) qui commence par "avril 2026".
// Le segment "duel des recits" (scene 1) demarre a 20.08s ABSOLU (cf. scripts/senegal-scene1-alignment.py
// WINDOW_OFFSET=20). On fait donc demarrer l'audio a AUDIO_START et on cale les beats en LOCAL (frame 0 = "Ces").
// Timecodes LOCAUX (depuis scene1-alignment.json, relatifs au debut du duel) :
//   0.1s  "Ces deux recits"            -> piece Face A se revele
//   3.5s  "recits"                     -> le pompage demarre
//  17.18s "multinationales qui pompent"-> navire CHARGE + ocean NOIRCIT
//  17.66s "et repartent"               -> navire s'efface
//  18.8s  "De l'autre, une nation"     -> FLIP (image precede)
//  23.1s  "la realite se joue ailleurs"-> FISSURE + oxydation
//  23.3s  "ailleurs"                   -> verdict "L'ENVERS DU DECOR"
//  24.5s  "details qu'on ne montre"    -> sortie vers les gisements
const AUDIO_START = 20.08;     // s, debut du duel dans le fichier complet
const OFFSET = 0;
const tl = (s: number) => Math.round((s - OFFSET) * 30);
const F_FLIP_S  = tl(19.8);   // flip retarde : laisse le navire finir de partir (17.2->19s) + ~0.8s pièce vide qui respire. Tombe sur "une nation qui reprend".
const F_FLIP_E  = tl(21.6);   // flip fini
const F_FISSURE = tl(23.0);   // sur "la realite se joue"
const F_VERDICT = tl(23.4);   // accompagne la cassure
const F_OUT     = tl(25.0);   // sortie -> enchaine gisements
const TOTAL     = tl(25.8);

const DIAM = 920;             // taille VALIDEE par Aziz (proto SVG). NE PAS rabaisser a 620.
const CX = W / 2, CY = H * 0.44;

const COIN_A = staticFile("souverain/senegal-petrole-gaz/beat0/assets/coin/faceA-malediction-gpt.png");
const COIN_B = staticFile("souverain/senegal-petrole-gaz/beat0/assets/coin/faceB-arbre-gpt.png");

// Le disque GPT a une marge de fond autour -> scale up pour que le rim colle au bord de la face ronde.
const COIN_IMG_SCALE = 1.06;

// ── face = illustration gravee plein cadre, clippee en cercle ──
const CoinFaceImg: React.FC<{ src: string }> = ({ src }) => (
  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
    <img
      src={src}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${COIN_IMG_SCALE})` }}
    />
    {/* leger glaze radial pour relief metal coherent avec le 3D */}
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, rgba(255,245,210,0.18), transparent 55%)", pointerEvents: "none" }} />
  </div>
);

const ease = (p: number) => interpolate(p, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const SenegalScene1IntroCoin: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grainSeed = Math.floor(frame / 18);

  // flip rotateY pilote (spring), sync voix
  const flipP = spring({ frame: frame - F_FLIP_S, fps, config: { damping: 15, stiffness: 90 }, durationInFrames: F_FLIP_E - F_FLIP_S + 10 });
  const rotateY = interpolate(flipP, [0, 1], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showA = rotateY < 90;

  // === VRAIE FISSURE : la piece se fend en deux, les moities s'ecartent ===
  const fissure = interpolate(frame, [F_FISSURE, F_FISSURE + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fissureEase = ease(fissure);
  const shake = frame >= F_FISSURE && frame < F_FISSURE + 16 ? Math.sin(frame * 1.6) * 5 * (1 - (frame - F_FISSURE) / 16) : 0;
  // ecartement des deux moities (px) une fois fendue
  const split = fissureEase * 26;
  const splitTilt = fissureEase * 2.5; // leger basculement de chaque moitie

  const verdictP = spring({ frame: frame - F_VERDICT, fps, config: { damping: 14, stiffness: 150 }, durationInFrames: 16 });
  const verdictOp = ease(verdictP);
  const verdictScale = interpolate(verdictP, [0, 1], [0.96, 1], { extrapolateRight: "clamp" });

  const outVeil = interpolate(frame, [F_OUT, TOTAL], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // halo couleur (rouge->or au flip)
  const haloGold = ease(interpolate(rotateY, [80, 180], [0, 1]));

  // la fissure est active : on remplace l'affichage de la piece par les deux moities fendues
  const broken = !showA && fissure > 0;

  // ====== ANIMATION PREMIUM "hero object fixe" (3 modeles : Gemini+DeepSeek+Kimi convergents) ======
  // On ne touche JAMAIS l'interieur de l'illustration : on anime camera + lumiere + profondeur.
  // 1) SLOW SCALE (Ken Burns inverse) : la piece recule lentement = "repartent". Stoppe au flip.
  const camEnd = F_FLIP_S;
  const coinScale = interpolate(frame, [0, camEnd], [1.10, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const coinDriftY = interpolate(frame, [0, camEnd], [-6, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 2) PARALLAXE : le fond grille bouge a contre-sens + scale leger (profondeur studio).
  const bgScale = interpolate(frame, [0, camEnd], [1.0, 1.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgDriftY = interpolate(frame, [0, camEnd], [0, -16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 4) OMBRE PORTEE EVOLUTIVE : suit le scale (plus la piece "recule", plus l'ombre se resserre).
  const shadowY = interpolate(frame, [0, camEnd], [26, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shadowBlur = interpolate(frame, [0, camEnd], [40, 16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 3) SPECULAR SWEEP : reflet doux qui balaie le metal (s2->s8), le metal "vit" sans animer la gravure.
  const sweepX = interpolate(frame, [60, 240], [-130, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // % de la piece
  const sweepOp = interpolate(frame, [60, 90, 210, 240], [0, 0.55, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // === EFFETS FACE A SVG (gravure vivante), cales sur la voix — ETALES (respiration, Aziz) ===
  //  T1  0s     : pompage DEJA actif + piece revelee (parent)
  //  T2  ~3.5s  "Ces deux recits" -> l'OCEAN COMMENCE A NOIRCIR, lentement jusqu'a ~12s
  //  T3  ~8s    : SWEEP lumineux + goutte de petrole (tension)
  //  T4  ~17.2s "pompent" -> le NAVIRE charge puis s'efface (part). Pièce finit vide (derrick+mer noire) avant le flip.
  const F_RECITS   = tl(3.5);    // "Ces deux recits" -> noircissement demarre
  const F_SHIMMER  = tl(8.0);
  const F_DROP     = tl(9.0);
  const F_POMPENT  = tl(17.18);  // "pompent" -> le navire part
  // pompage actif des le debut (la pompe tourne deja)
  const faceA_pump = interpolate(frame, [0, tl(2.0)], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // OCEAN NOIRCIT : demarre sur "ces deux recits" (3.5s), montee LENTE jusqu'a ~12s
  const faceA_oil = interpolate(frame, [F_RECITS, tl(12.0)], [0, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // shimmer + goutte (tension) sur la zone mediane, avant le depart
  const faceA_shimmer = interpolate(frame, [F_SHIMMER, tl(10.0)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const faceA_drop = frame >= F_DROP && frame < tl(15.0) ? 1 : 0;
  // NAVIRE part sur "pompent" (17.2s) -> charge puis fade, FINI ~0.6s AVANT le flip (piece vide respire)
  const faceA_sail = interpolate(frame, [F_POMPENT, tl(19.2)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ligne de fissure (zigzag) en coords locales piece (DIAM x DIAM), du haut vers le bas.
  // Un seul tableau de points -> derive proprement le trace + les deux demi-masques (pas de replace/reverse fragile).
  const D = DIAM;
  const crackPts: [number, number][] = [
    [D * 0.62, 0],
    [D * 0.50, D * 0.26],
    [D * 0.60, D * 0.44],
    [D * 0.44, D * 0.66],
    [D * 0.52, D * 0.82],
    [D * 0.40, D],
  ];
  const crackPath = "M " + crackPts.map(([x, y]) => `${x},${y}`).join(" L ");
  // moitie GAUCHE = fissure (haut->bas) puis coin bas-gauche -> haut-gauche
  const leftHalfPath = crackPath + ` L 0,${D} L 0,0 Z`;
  // moitie DROITE = fissure (haut->bas) puis coin bas-droit -> haut-droit
  const rightHalfPath = crackPath + ` L ${D},${D} L ${D},0 Z`;

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={Math.round(AUDIO_START * 30)} volume={1} />
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")} startFrom={Math.round(AUDIO_START * 30)} volume={0.14} />
      <Sequence from={F_FLIP_S} durationInFrames={40}><Audio src={staticFile("souverain/senegal-petrole-gaz/audio/sfx/sfx-whoosh-transition.mp3")} volume={0.4} /></Sequence>
      <Sequence from={F_FISSURE} durationInFrames={40}><Audio src={staticFile("_shared/sfx/warmap/cedeao-snap.mp3")} volume={0.55} /></Sequence>

      {/* === FOND QUADRILLE BLUEPRINT (au lieu du navy plat) === */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, #1d2a47 0%, ${NAVY} 45%, ${NAVY_DEEP} 100%)` }} />
      {/* grille (parallaxe : bouge a contre-sens de la piece = profondeur studio) */}
      <AbsoluteFill style={{ transform: `scale(${bgScale}) translateY(${bgDriftY}px)` }}>
        {/* grille fine */}
        <AbsoluteFill style={{
          backgroundImage: `linear-gradient(rgba(130,165,225,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(130,165,225,0.16) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }} />
        {/* grille majeure (plus marquee tous les 4 carreaux) */}
        <AbsoluteFill style={{
          backgroundImage: `linear-gradient(rgba(150,185,235,0.24) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(150,185,235,0.24) 1.5px, transparent 1.5px)`,
          backgroundSize: "256px 256px",
        }} />
      </AbsoluteFill>

      {/* grain + vignette + halo */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="grainIC"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={grainSeed} stitchTiles="stitch" result="n" /><feColorMatrix in="n" type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer><feComposite operator="over" in2="SourceGraphic" /></filter>
          <radialGradient id="vignIC"><stop offset="55%" stopColor="transparent" /><stop offset="100%" stopColor="rgba(8,12,22,0.55)" /></radialGradient>
        </defs>
        <rect width={W} height={H} fill="#000" filter="url(#grainIC)" opacity={0.4} />
        <rect width={W} height={H} fill="url(#vignIC)" />
        {/* halo derriere la piece */}
        <circle cx={CX} cy={CY} r={DIAM * 0.62} fill={`rgba(${Math.round(178 - haloGold * (178 - 231))},${Math.round(58 + haloGold * (189 - 58))},${Math.round(46 + haloGold * (120 - 46))},0.2)`} style={{ filter: "blur(50px)" }} />
      </svg>

      {/* === LE TEMPLATE COINFLIP 3D, pilote par la voix (cache pendant la fissure) === */}
      {/* slow-scale + drift + ombre portee evolutive : la piece "vit" sans qu'on touche la gravure */}
      {!broken && (
        <div style={{ position: "absolute", inset: 0, top: CY - H / 2,
          transform: `translate(${shake}px, ${coinDriftY}px) scale(${coinScale})`,
          filter: `drop-shadow(0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,0.55))` }}>
          <CoinFlip
            rotateYExternal={rotateY}
            diameter={DIAM}
            showDotGrid={false}
            bgColor="transparent"
            faceA={{ icon: "ship", label: "", value: "", custom: <SenegalCoinFaceA_SVG sailProgress={faceA_sail} pumpActive={faceA_pump} oilSpread={faceA_oil} oilDrop={Math.max(faceA_shimmer * 0.4, faceA_drop)} /> }}
            faceB={{ icon: "landmark", label: "", value: "", custom: <CoinFaceImg src={COIN_B} /> }}
          />
          {/* SPECULAR SWEEP : reflet doux qui balaie le metal (clippe au cercle de la piece) */}
          {showA && sweepOp > 0.01 && (
            <div style={{ position: "absolute", left: "50%", top: "50%", width: DIAM, height: DIAM,
              transform: "translate(-50%,-50%)", borderRadius: "50%", overflow: "hidden", pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: "-20%", left: `${sweepX}%`, width: "45%", height: "140%",
                background: "linear-gradient(105deg, transparent, rgba(255,248,225,0.85), transparent)",
                transform: "rotate(8deg)", mixBlendMode: "overlay", opacity: sweepOp, filter: "blur(6px)" }} />
            </div>
          )}
        </div>
      )}

      {/* === FISSURE : deux moities de la piece (Face B) qui se separent === */}
      {broken && (
        <div style={{ position: "absolute", left: CX, top: CY, transform: `translate(${shake}px,0)` }}>
          <svg width={D} height={D} viewBox={`0 0 ${D} ${D}`} style={{ position: "absolute", left: -D / 2, top: -D / 2, overflow: "visible" }}>
            <defs>
              {/* masque moitie GAUCHE de la piece (cote fissure) */}
              <clipPath id="leftHalf"><path d={leftHalfPath} /></clipPath>
              {/* masque moitie DROITE */}
              <clipPath id="rightHalf"><path d={rightHalfPath} /></clipPath>
              <clipPath id="roundClip"><circle cx={D / 2} cy={D / 2} r={D / 2} /></clipPath>
            </defs>

            {/* ombre interne de la faille (derriere, plus large) */}
            <g clipPath="url(#roundClip)" opacity={fissureEase}>
              <path d={crackPath} fill="none" stroke={NOIR} strokeWidth={28 + split} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
            </g>

            {/* MOITIE GAUCHE : image piece B, decalee a gauche + leger tilt */}
            <g clipPath="url(#roundClip)">
              <g clipPath="url(#leftHalf)" transform={`translate(${-split},0) rotate(${-splitTilt} ${D * 0.3} ${D / 2})`}>
                <image href={COIN_B} x={0} y={0} width={D} height={D} preserveAspectRatio="xMidYMid slice" transform={`scale(${COIN_IMG_SCALE})`} transform-origin="center" />
                {/* tranche metal sur le bord de cassure */}
                <path d={crackPath} fill="none" stroke="#8a6a1f" strokeWidth={6} opacity={0.9} />
                <path d={crackPath} fill="none" stroke="#d8b25a" strokeWidth={2} opacity={0.9} />
              </g>
              {/* MOITIE DROITE : decalee a droite */}
              <g clipPath="url(#rightHalf)" transform={`translate(${split},0) rotate(${splitTilt} ${D * 0.7} ${D / 2})`}>
                <image href={COIN_B} x={0} y={0} width={D} height={D} preserveAspectRatio="xMidYMid slice" transform={`scale(${COIN_IMG_SCALE})`} transform-origin="center" />
                <path d={crackPath} fill="none" stroke="#8a6a1f" strokeWidth={6} opacity={0.9} />
                <path d={crackPath} fill="none" stroke="#d8b25a" strokeWidth={2} opacity={0.9} />
              </g>
            </g>

            {/* eclats projetes par la cassure (renforces : plus nombreux, plus gros) */}
            {[...Array(20)].map((_, i) => {
              const ang = (i / 20) * Math.PI - Math.PI / 2 + (i % 2 ? 0.35 : -0.25);
              const dist = (55 + (i % 4) * 70) * fissureEase;
              const ex = D / 2 + Math.cos(ang) * (D * 0.28) + Math.cos(ang) * dist;
              const ey = D / 2 + Math.sin(ang) * (D * 0.42) + Math.sin(ang) * dist * 0.7;
              const sz = 7 + (i % 5) * 4;
              return <rect key={i} x={ex} y={ey} width={sz} height={sz * (0.5 + (i % 3) * 0.4)} fill={i % 3 ? "#e7bd78" : (i % 3 === 1 ? "#d8b25a" : "#8a6a1f")} opacity={fissureEase * (1 - i / 26)} transform={`rotate(${i * 33} ${ex} ${ey})`} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))" }} />;
            })}
          </svg>
        </div>
      )}

      {/* etincelles du FLIP (sur la tranche, autour de la mi-rotation) */}
      {(() => {
        const sparkP = interpolate(rotateY, [55, 90, 125], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (sparkP < 0.02) return null;
        return (
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {[...Array(14)].map((_, i) => {
              const ang = (i / 14) * Math.PI * 2;
              const r = (DIAM * 0.32) + ((i * 37) % 80);
              const sx = CX + Math.cos(ang) * r * 0.45;
              const sy = CY + Math.sin(ang) * r;
              const sz = 2 + (i % 4);
              return <circle key={i} cx={sx} cy={sy} r={sz} fill={i % 2 ? "#f6e2b0" : "#d8b25a"} opacity={sparkP * (0.5 + (i % 3) * 0.2)} style={{ filter: "blur(0.6px)" }} />;
            })}
          </svg>
        );
      })()}

      {/* PAS de label sur Face A : la gravure VIVANTE (navire charge+repart, ocean qui noircit)
          raconte deja "multinationales qui pompent et repartent". L'image precede l'oreille (doctrine). */}

      {/* verdict — "L'ENVERS DU DECOR" (epouse "la realite se joue ailleurs") */}
      {verdictOp > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.8, textAlign: "center", opacity: verdictOp, transform: `scale(${verdictScale})`, pointerEvents: "none",
          fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: 84, fontWeight: 700, color: IVORY, letterSpacing: "0.06em", textShadow: "0 3px 18px #000" }}>
          L'ENVERS DU DÉCOR
        </div>
      )}

      {outVeil > 0.01 && <AbsoluteFill style={{ background: NAVY_DEEP, opacity: outVeil }} />}
    </AbsoluteFill>
  );
};

export default SenegalScene1IntroCoin;
