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
import { SenegalCoinFaceB_SVG } from "./SenegalCoinFaceB_SVG";

const W = 1920, H = 1080;
const NAVY = "#16213a", NAVY_DEEP = "#0d1424", OCRE = "#e7bd78";
const IVORY = "#f2ebd9", CRISIS = "#c8553d", NOIR = "#050505"; // rouge patine (charte navy/or), pas vif

// ⛔ AUDIO : narration-v3-VALIDEE.mp3 = narration COMPLETE (492s) qui commence par "avril 2026".
// CORRIGE 2026-07-04 (passe de finition, bug #1 REPRISE-PASSE-FINITION.md) : l'ancien AUDIO_START=20.08
// venait de scene1-alignment.json, un forced-align LOCAL corrompu (loss aberrant, ex. mot "on" etale sur
// 6.8->13.6s) genere sur un extrait /tmp mal decoupe. Verifie CONTRE forced-align-v3.json (global, fiable)
// + whisper-words-v3.ts (concordants) : le texte "Ces deux recits" tombe en realite a 32.62s ABSOLU, pas
// 20.08s. A 20.08s se trouve encore le texte de la SCENE 0 ("...tourmente politique ? Pour le comprendre,
// il faut oublier les deux recits habituels..."), d'ou le DEDOUBLEMENT audio au raccord sc.0->sc.1a.
// Consequence : la fenetre reelle disponible pour cette scene est ~15.6s (32.62->48.18s "en direct."),
// PAS 28.8s comme l'ancien decoupage le supposait -> tous les beats ci-dessous sont RE-ANCRES sur les
// vrais mots du forced-align global (pas de simple translation, l'ancien alignement derivait).
// Timecodes ABSOLUS (narration-v3-VALIDEE.mp3, forced-align-v3.json) :
//   32.62s "Ces deux recits"             -> piece Face A se revele (frame 0 locale)
//   37.20s "...qui pompent"              -> navire CHARGE + ocean NOIRCIT
//   39.88s "une nation qui reprend"      -> FLIP (image precede)
//   43.24s "la realite se joue ailleurs" -> FISSURE + oxydation
//   45.36s "...qu'on ne montre jamais."  -> tenue verdict
//   48.18s fin de "...en direct."        -> sortie vers les gisements (sc.1b demarre a 49.50s, cf. chantier 2)
const AUDIO_START = 32.62;     // s, debut du duel dans le fichier complet (ex-20.08, corrige)
const OFFSET = 0;
const tl = (s: number) => Math.round((s - OFFSET) * 30);
const F_FLIP_S  = 200;   // 6.66s local (39.88-32.62-0.6 : demarre juste avant "reprend" pour arriver pile dessus)
const F_FLIP_E  = 248;   // 8.26s local : flip fini
const F_FISSURE = 319;   // 10.62s local : sur "la realite se joue ailleurs" (43.24s abs)
const F_VERDICT = 331;   // 11.02s local : accompagne la cassure
const F_OUT     = 467;   // 15.56s local : sortie APRES "...en direct" (48.18s abs), avant gisements (49.50s)
// TOTAL etendu (chantier 2 passe finition, valide Aziz 2026-07-04 apres comparaison A/B) : le fondu
// outVeil de sc.1a couvre "Premiere chose a comprendre...trouve trois." (49.54->53.70s abs) au lieu
// d'un pre-roll navy separe dans gisements (juge "ne fait pas de sens" par Aziz). endAt Audio suit plus bas.
const TOTAL     = 641;   // 21.38s local : jusqu'a la fin de "...trouve trois." (53.70s abs + marge)

const DIAM = 760;             // reduite (920->760) pour degager un VRAI espace sous la piece (label recit). Aziz 21/06.
const CX = W / 2, CY = H * 0.40;  // remontee pour liberer le bas

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
  // 3) SPECULAR SWEEP : reflet doux qui balaie le metal, le metal "vit" sans animer la gravure.
  // recompresse (bug #1) : fenetre avant pompent (16f->137f) au lieu de l'ancienne 60f->240f.
  const sweepX = interpolate(frame, [16, 137], [-130, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // % de la piece
  const sweepOp = interpolate(frame, [16, 28, 110, 137], [0, 0.55, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // === EFFETS FACE A SVG (gravure vivante), cales sur la voix ===
  // RECOMPRESSE 2026-07-04 (bug #1) : la fenetre reelle avant le flip n'est que ~6.66s (pas 19.8s comme
  // l'ancien alignement corrompu le supposait). "pompent" reste l'ancrage texte fiable (137f/4.58s) ;
  // les etapes intermediaires (pompage/noircissement/shimmer/goutte) sont compressees proportionnellement
  // pour garder le meme ORDRE narratif dans la fenetre disponible.
  //  T1  0f     : pompage DEJA actif + piece revelee (parent)
  //  T2  28f    : "Ces deux recits" -> l'OCEAN COMMENCE A NOIRCIR
  //  T3  64f    : SWEEP lumineux + goutte de petrole (tension)
  //  T4  137f   : "pompent" -> le NAVIRE charge puis s'efface (part). Pièce finit vide avant le flip (200f).
  const F_RECITS   = 28;    // 0.93s "Ces deux recits" -> noircissement demarre
  const F_SHIMMER  = 64;    // 2.13s
  const F_DROP     = 72;    // 2.39s
  const F_POMPENT  = 137;   // 4.58s "pompent" (ancrage texte reel) -> le navire part
  // pompage actif des le debut (la pompe tourne deja)
  const faceA_pump = interpolate(frame, [0, 16], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // OCEAN NOIRCIT : demarre sur "ces deux recits", montee jusqu'a la fin du pompage
  const faceA_oil = interpolate(frame, [F_RECITS, 96], [0, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // shimmer + goutte (tension) sur la zone mediane, avant le depart
  const faceA_shimmer = interpolate(frame, [F_SHIMMER, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const faceA_drop = frame >= F_DROP && frame < 120 ? 1 : 0;
  // NAVIRE part sur "pompent" -> charge puis fade, FINI juste AVANT le flip (200f) (piece vide respire)
  const faceA_sail = interpolate(frame, [F_POMPENT, 198], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
      {/* narration : coupee APRES "...en direct" (48.95s absolu) pour ne pas enchainer sur "Premiere chose a comprendre" (gisements) */}
      {/* endAt etendu a 53.9s (chantier 2, valide Aziz) pour couvrir "Premiere chose a comprendre...
          trouve trois." pendant le fondu de sortie, au lieu de 48.95s (juste apres "en direct."). */}
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={Math.round(AUDIO_START * 30)} endAt={Math.round(53.9 * 30)} volume={1} />
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
            faceB={{ icon: "landmark", label: "", value: "", custom: <SenegalCoinFaceB_SVG oxidize={interpolate(frame, [F_FISSURE - 30, F_FISSURE], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} /> }}
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

      {/* === FISSURE : la PIECE SVG (Face B) se fend en deux moities qui se separent ===
           Les deux moities = le MEME composant SVG Face B, clippe par un demi-masque CSS (clip-path),
           decale lateralement. Plus de bitmap : raccord coherent avec le reste de la scene. */}
      {broken && (() => {
        // clip-path CSS en % (le composant remplit un carre DxD). Fissure verticale en zigzag.
        const leftPoly = "polygon(0% 0%, 62% 0%, 50% 26%, 60% 44%, 44% 66%, 52% 82%, 40% 100%, 0% 100%)";
        const rightPoly = "polygon(62% 0%, 100% 0%, 100% 100%, 40% 100%, 52% 82%, 44% 66%, 60% 44%, 50% 26%)";
        const oxB = interpolate(frame, [F_FISSURE - 30, F_FISSURE], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div style={{ position: "absolute", left: CX - D / 2, top: CY - D / 2, width: D, height: D, transform: `translate(${shake}px,0)` }}>
            {/* ombre interne de la faille (derriere) */}
            <svg width={D} height={D} viewBox={`0 0 ${D} ${D}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <path d={crackPath} fill="none" stroke={NOIR} strokeWidth={28 + split} strokeLinecap="round" strokeLinejoin="round" opacity={0.85 * fissureEase} />
            </svg>
            {/* MOITIE GAUCHE : Face B SVG clippee, decalee a gauche + leger tilt */}
            <div style={{ position: "absolute", inset: 0, clipPath: leftPoly, transform: `translate(${-split}px,0) rotate(${-splitTilt}deg)`, transformOrigin: "30% 50%" }}>
              <SenegalCoinFaceB_SVG oxidize={oxB} />
            </div>
            {/* MOITIE DROITE : decalee a droite */}
            <div style={{ position: "absolute", inset: 0, clipPath: rightPoly, transform: `translate(${split}px,0) rotate(${splitTilt}deg)`, transformOrigin: "70% 50%" }}>
              <SenegalCoinFaceB_SVG oxidize={oxB} />
            </div>
            {/* tranche metal + eclats par-dessus */}
            <svg width={D} height={D} viewBox={`0 0 ${D} ${D}`} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
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
        );
      })()}

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

      {/* === LABEL DE RECIT transitoire SOUS la piece (nomme le recit, apparait en fade 2-3s puis disparait) ===
           Face A = "LA MALEDICTION" · Face B = "L'ELDORADO". Ponctuation, pas annotation. */}
      {!broken && (() => {
        // Face A : apparait tot, tient jusqu'a l'approche du flip, disparait avant la suite. Face B : apparait apres le flip.
        // recompresse (bug #1) : fenetre avant pompent/flip au lieu de l'ancienne tl(2.0..9.5).
        const aOp = showA
          ? interpolate(frame, [16, 28, 110, 130], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : 0;
        const bOp = !showA
          ? interpolate(frame, [F_FLIP_E + 6, F_FLIP_E + 20, F_FISSURE - 18, F_FISSURE - 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : 0;
        const op = showA ? aOp : bOp;
        if (op < 0.01) return null;
        const word = showA ? "LA MALÉDICTION" : "L'ELDORADO";
        return (
          <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.85, textAlign: "center", opacity: op, transform: `translateY(${(1 - op) * 10}px)`, pointerEvents: "none",
            fontFamily: "Cinzel, serif", fontSize: 52, fontWeight: 700, letterSpacing: "0.24em", color: showA ? "#d98a5c" : OCRE, textShadow: "0 2px 16px #000, 0 0 30px rgba(0,0,0,0.8)" }}>
            {word}
          </div>
        );
      })()}

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
