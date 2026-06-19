/**
 * PROTO FRACTURE — Phase 2 du hook Senegal (le limogeage du 22 mai).
 *
 * METHODE (intention -> forme -> template, PAS l'inverse) :
 *   Intention = faire RESSENTIR la BASCULE : un pays au sommet de sa richesse qui s'effondre
 *   au meme instant. Le mot de la voix est "bascule" → la forme doit etre un RENVERSEMENT, pas
 *   une annonce statique. Donc : on REPREND le 8M$ fige sur la carte (continuite du hook phase 1),
 *   PUIS une FRACTURE traverse, la couleur vire a la crise, "22 MAI" tombe en couperet.
 *
 * Capital reutilise du hook phase 1 : meme fond parchemin quadrille + meme geometrie Senegal
 * (continuite visuelle = c'est ca, le vrai template — pas un composant plaque).
 *
 * mode : "parchemin" (le fond connu se contamine de rouge) | "sombre" (bascule vers la nuit navy).
 * Narration (withNarration) : cale sur "le 22 mai, le gouvernement saute" (~f210-220 de la narration).
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  Sequence,
  staticFile,
  random,
} from "remotion";
import { SENEGAL_PATH, SENEGAL_PATH_LEN, SENEGAL_CENTROID } from "./senegalPath";

const W = 1920;
const H = 1080;

const PARCH = "#e4ddca";
const PARCH_DARK = "#d6cdb4";
const GRID = "#c2a96a";
const OCRE = "#e7bd78";
const OCRE_DARK = "#bf9442";
const NAVY = "#16213a";
const NAVY_DEEP = "#0d1424";
const CRISIS = "#b23a2e"; // rouge brique crise
const CRISIS_DARK = "#7d2118";

const MAP_SCALE = 1.2;
const MAP_X = W / 2 - (900 * MAP_SCALE) / 2;
const MAP_Y = H / 2 - (700 * MAP_SCALE) / 2 - 40;
const GRID_STEP = 185;

const centerX = MAP_X + SENEGAL_CENTROID[0] * MAP_SCALE;
const centerY = MAP_Y + SENEGAL_CENTROID[1] * MAP_SCALE;

// Ligne de fracture brisee qui traverse le pays (zigzag genere, deterministe).
function fracturePath(): string {
  const x0 = MAP_X + 120 * MAP_SCALE;
  const y0 = MAP_Y + 60 * MAP_SCALE;
  const x1 = MAP_X + 820 * MAP_SCALE;
  const y1 = MAP_Y + 640 * MAP_SCALE;
  const segs = 9;
  let d = `M ${x0} ${y0}`;
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const bx = x0 + (x1 - x0) * t;
    const by = y0 + (y1 - y0) * t;
    const jitter = (random(`frac-${i}`) - 0.5) * 130;
    const perpX = -(y1 - y0);
    const perpY = x1 - x0;
    const len = Math.hypot(perpX, perpY);
    d += ` L ${bx + (perpX / len) * jitter} ${by + (perpY / len) * jitter}`;
  }
  return d;
}
const FRACTURE_D = fracturePath();

export const ProtoEffect_Fracture: React.FC<{ mode?: "parchemin" | "sombre"; withNarration?: boolean }> = ({
  mode = "parchemin",
  withNarration = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── CALAGE AUDIO (FORCED ALIGNMENT ElevenLabs, loss 0.27 — hook-alignment.json) ──
  //   "saute" @11.84s · "limoge" @13.48s · "Comment" (question) @15.90s. (precis, ≠ Whisper)
  //   On demarre la narration a NARR_FROM ; les beats visuels se calent dans l'horloge du clip.
  const NARR_FROM = 9.0; // s : juste apres "8M$ chaque jour"
  const f2s = (abs: number) => Math.round((abs - NARR_FROM) * fps); // abs(s) -> frame clip

  // BREAK = la cassure (+SFX dechirure) tombe sur "limoge" (13.48s) — decision Aziz : meilleur timing
  // que "saute" (le geste du president qui LIMOGE colle a la dechirure).
  const BREAK = f2s(13.48); // ~134
  const since = frame - BREAK;

  // Secousse (shake) brusque a la cassure, puis s'amortit.
  const shakeAmp = since > 0 ? Math.max(0, 18 - since * 1.1) : 0;
  const shakeX = since > 0 ? (random(`sx${Math.floor(frame / 2)}`) - 0.5) * 2 * shakeAmp : 0;
  const shakeY = since > 0 ? (random(`sy${Math.floor(frame / 2)}`) - 0.5) * 2 * shakeAmp : 0;

  // ── MICRO-ANIMATIONS (polish, anti-statique — on reste dans la meme scene ~22s) ──
  // 1) respiration continue de la carte (micro-pulse d'echelle), toujours active.
  const breath = 1 + 0.006 * Math.sin(frame * 0.08);
  // 1b) micro-tremblement au VERROUILLAGE final (DA Gemini) : les 2 moities se rejoignent ("verite froide").
  const lockFrame = f2s(31.0); // fin de recomposition
  const lockAmp = Math.max(0, 6 - Math.abs(frame - lockFrame) * 1.2);
  const lockX = lockAmp > 0 ? (random(`lx${frame}`) - 0.5) * 2 * lockAmp : 0;
  const lockY = lockAmp > 0 ? (random(`ly${frame}`) - 0.5) * 2 * lockAmp : 0;
  // 2) lumiere douce qui derive lentement en diagonale (balayage de highlight).
  const lightSweep = interpolate((frame % 240) / 240, [0, 1], [-30, 130]);
  // 3) debris : petites particules ejectees de la faille a la cassure (since 0..40).
  const debris = Array.from({ length: 14 }, (_, i) => {
    const seed = random(`deb${i}`);
    const ang = (random(`ang${i}`) - 0.5) * Math.PI; // ejecte de part et d'autre
    const life = interpolate(since, [0, 6, 40], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const dist = since > 0 ? since * (2 + seed * 4) : 0;
    // point de depart le long de la faille
    const t = i / 14;
    const px = MAP_X + (120 + t * 700) * MAP_SCALE;
    const py = MAP_Y + (60 + t * 580) * MAP_SCALE;
    return { x: px + Math.cos(ang) * dist, y: py + Math.sin(ang) * dist - since * 0.3, op: life * (0.5 + seed * 0.5), r: 1.5 + seed * 3 };
  });

  // La fracture se trace vite a la cassure.
  const crackProg = interpolate(since, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Virage couleur du remplissage vers la crise.
  const crisisK = interpolate(since, [2, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bascule de fond (mode sombre) ou contamination rouge (mode parchemin).
  // Transition RAPIDE + ease pour eviter le gris boueux de mi-parcours (bug signale Aziz).
  const darkRaw = interpolate(since, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const darkK = mode === "sombre" ? darkRaw * darkRaw * (3 - 2 * darkRaw) : 0; // smoothstep
  const bg = mode === "sombre" ? mix(PARCH, NAVY_DEEP, darkK) : PARCH;
  const gridColor = mode === "sombre" ? mix(GRID, "#33405e", darkK) : mix(GRID, CRISIS, crisisK * 0.5);

  // Le chiffre 8M$ : repris fige, puis tremble (leger tilt). Reste LISIBLE.
  const numTilt = since > 0 ? Math.sin(since * 0.6) * Math.max(0, 4 - since * 0.15) : 0;
  const numColor = mode === "sombre" ? mix(NAVY, "#f2ebd9", darkK) : mix(NAVY, "#f7efdd", crisisK);

  // ── EPURE (polish Aziz) : un SEUL texte sur la fracture = "22 MAI" + pulse. Rien d'autre. ──
  const slamStart = BREAK + 12;
  const slam = spring({ fps, frame: Math.max(0, frame - slamStart), config: { damping: 11, stiffness: 240 } });
  const slamY = interpolate(slam, [0, 1], [-60, 0]);
  const slamOp = interpolate(frame, [slamStart, slamStart + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // pulse continu de "22 MAI" une fois pose (respire, ne fige pas mort)
  const datePulse = frame > slamStart + 8 ? 1 + 0.035 * Math.sin((frame - slamStart) * 0.18) : 1;

  // ── BEAT 2 : LA RUPTURE S'AGGRAVE (open loop SANS texte — l'image raconte). ──
  // Decision Aziz : ZERO texte plein ecran (pas de paraphrase de la voix, pas de meublage).
  // L'ecart entre les 2 moities se CREUSE, la faille palpite, une vignette sombre gagne du terrain
  // sur "la tourmente politique". Le mouvement DIT que ca empire. La voix porte la question.
  const QUESTION_START = f2s(14.5);
  const qz = frame - QUESTION_START;

  // Le split s'ouvre a la cassure PUIS continue de se creuser lentement pendant la question (~jusqu'a "politique").
  const splitBase = interpolate(since, [0, 12], [0, 34], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const splitAggrav = interpolate(qz, [0, 165], [0, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // se creuse

  // Faille qui palpite (epaisseur + lueur), s'intensifie avec l'aggravation.
  const faultPulse = 1 + 0.5 * Math.sin(frame * 0.22);
  const faultGlow = interpolate(qz, [0, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "22 MAI" : pose apres la cassure, PUIS DISPARAIT quand la question commence (epure totale).
  const dateOut = interpolate(qz, [0, 16], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Vignette sombre qui monte sur "la tourmente", PUIS se leve a la recomposition (clarte retrouvee).
  const vignetteRaw = interpolate(qz, [25, 150], [0, mode === "sombre" ? 0.52 : 0.44], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Tres leger push-in continu (la carte ne quitte JAMAIS l'ecran, elle se resserre un peu).
  const pushIn = 1 + interpolate(qz, [0, 165], [0, 0.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── BEAT 3 : TRANSITION (ecarter 2 recits -> annoncer la 3e voie). ZERO texte. ──
  // Forced alignment : "malediction" 25.10s · "miracle" 27.20s · "verite" 29.56s · "precise" 31.72s.
  // La fracture DEVIENT le dispositif : moitie G = "malediction" (barree), moitie D = "miracle" (barree),
  // PUIS les 2 moities se REJOIGNENT + couleurs s'apaisent = "la verite, plus froide, plus precise".
  // halfDim : 0 = pleine, 1 = eteinte. Chaque moitie s'eteint sur SON recit, puis revit a la recomposition.
  const dimLeft = interpolate(frame, [f2s(24.9), f2s(25.6), f2s(29.4), f2s(30.2)], [0, 0.72, 0.72, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dimRight = interpolate(frame, [f2s(27.0), f2s(27.7), f2s(29.4), f2s(30.2)], [0, 0.72, 0.72, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // halo qui designe la moitie active (le recit nomme)
  const haloLeft = interpolate(frame, [f2s(24.9), f2s(25.3), f2s(26.2), f2s(26.6)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const haloRight = interpolate(frame, [f2s(27.0), f2s(27.4), f2s(28.3), f2s(28.7)], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // RECOMPOSITION : sur "la verite" (29.56s), les 2 moities se rejoignent (split -> 0) + faille se ferme.
  // Easing EXPO (DA Gemini) : vive au depart puis freine doucement = sensation de "precision".
  const recRaw = interpolate(frame, [f2s(29.4), f2s(31.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const recompose = 1 - Math.pow(1 - recRaw, 3); // ease-out cubic (vif -> freine)
  // apaisement couleur (du rouge/sombre crise vers un ton net plus clair) sur la recomposition
  const apaise = recompose;

  // split EFFECTIF : se creuse pendant la question, puis se REFERME a la recomposition.
  const split = (splitBase + splitAggrav) * (1 - recompose);

  // vignette finale : se leve a la recomposition (le chaos se resout en clarte).
  const vignette = vignetteRaw * (1 - recompose);

  // 8M$ : repris fige (continuite), PUIS DISPARAIT apres la dechirure (decision Aziz : aucune raison
  // qu'il reste sur place une fois la carte fendue). Sort ~0.8s apres la cassure.
  const numFade = interpolate(since, [16, 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fill couleur (parchemin : ocre -> rouge ; sombre : ocre -> ocre eteint)
  const fillTop = mode === "sombre" ? mix(OCRE, "#5a4a6b", darkK) : mix(OCRE, CRISIS, crisisK);
  const fillBot = mode === "sombre" ? mix(OCRE_DARK, "#3a2e4d", darkK) : mix(OCRE_DARK, CRISIS_DARK, crisisK);

  const exitOp = interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const gridV = Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => 40 + i * GRID_STEP);
  const gridH = Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => 28 + i * GRID_STEP);

  const amountStr = (8_000_000).toLocaleString("fr-FR") + " $";

  return (
    <AbsoluteFill style={{ background: bg, opacity: exitOp }}>
      {withNarration && (
        <>
          <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={Math.round(NARR_FROM * fps)} volume={1} />
          <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")} startFrom={Math.round(NARR_FROM * fps)} volume={0.16} />
        </>
      )}
      {/* SFX DECHIRURE — cedeao-snap (craquement sec) cale sur "limoge" (forced alignment 13.48s). */}
      <Sequence from={BREAK} durationInFrames={40}>
        <Audio src={staticFile("_shared/sfx/warmap/cedeao-snap.mp3")} volume={0.9} />
      </Sequence>
      {/* SFX CONTACT — clic sec quand les 2 moities sont COLLEES (pas de whoosh de glissement, decision Aziz).
          Cale sur le contact final de la recomposition. N'affecte aucun timing visuel/narration. */}
      <Sequence from={f2s(31.0)} durationInFrames={12}>
        <Audio src={staticFile("_shared/sfx/data/stat-tick.mp3")} volume={0.6} />
      </Sequence>

      {/* SCENE (carte fracturee) : plein ecran, push-in + micro-respiration (anti-statique) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${pushIn * breath})`,
          transformOrigin: "center 44%",
        }}
      >
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="fracFill" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor={fillTop} />
            <stop offset="100%" stopColor={fillBot} />
          </linearGradient>
          {/* deux clips : moitie gauche/haut de la faille, moitie droite/bas */}
          <clipPath id="halfA">
            <path d={`${FRACTURE_D} L ${MAP_X - 200} ${H} L ${MAP_X - 200} ${-200} Z`} />
          </clipPath>
          <clipPath id="halfB">
            <path d={`${FRACTURE_D} L ${W + 200} ${H} L ${W + 200} ${-200} Z`} />
          </clipPath>
          {/* GAIN PREMIUM (DA Gemini) : ombre portee DIFFUSE (vs 'calque Illustrator') */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="18" floodColor="#000000" floodOpacity={mode === "sombre" ? 0.45 : 0.28} />
          </filter>
          {/* GAIN PREMIUM : grain papier (matiere, sort du 'vectoriel plat') */}
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" />
            <feComponentTransfer><feFuncA type="linear" slope={mode === "sombre" ? 0.05 : 0.07} /></feComponentTransfer>
          </filter>
        </defs>

        {/* GRILLE (se teinte) */}
        <g stroke={gridColor} strokeWidth={1.6} opacity={mode === "sombre" ? 0.5 : 0.7}>
          {gridV.map((x) => <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />)}
          {gridH.map((y) => <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />)}
        </g>

        {/* groupe carte avec secousse (cassure) + verrouillage final */}
        <g transform={`translate(${shakeX + lockX},${shakeY + lockY})`}>
          {/* MOITIE A (gauche = recit "malediction petroliere", barre puis recompose) */}
          <g clipPath="url(#halfA)" transform={`translate(${-split},${-split * 0.5})`} filter="url(#softShadow)">
            <g transform={`translate(${MAP_X},${MAP_Y}) scale(${MAP_SCALE})`}>
              <path d={SENEGAL_PATH} fill="url(#fracFill)" />
              {apaise > 0.01 && <path d={SENEGAL_PATH} fill="#f2ebd9" opacity={apaise * (mode === "sombre" ? 0.22 : 0.32)} />}
              {/* halo recit : lueur chaude DIFFUSE (DA Gemini : pas de neon 'gaming') */}
              {haloLeft > 0.01 && <path d={SENEGAL_PATH} fill="#c87a3a" opacity={haloLeft * 0.30} style={{ filter: "blur(16px)" }} />}
              <path d={SENEGAL_PATH} fill="none" stroke={mode === "sombre" ? mix(NAVY, "#6f86b5", darkK) : NAVY} strokeWidth={4.5} strokeLinejoin="round" />
              {dimLeft > 0.01 && <path d={SENEGAL_PATH} fill="#0a0610" opacity={dimLeft} />}
            </g>
          </g>
          {/* MOITIE B (droite = recit "miracle souverainete", barre puis recompose) */}
          <g clipPath="url(#halfB)" transform={`translate(${split},${split * 0.5})`} filter="url(#softShadow)">
            <g transform={`translate(${MAP_X},${MAP_Y}) scale(${MAP_SCALE})`}>
              <path d={SENEGAL_PATH} fill="url(#fracFill)" />
              {apaise > 0.01 && <path d={SENEGAL_PATH} fill="#f2ebd9" opacity={apaise * (mode === "sombre" ? 0.22 : 0.32)} />}
              {haloRight > 0.01 && <path d={SENEGAL_PATH} fill="#c87a3a" opacity={haloRight * 0.30} style={{ filter: "blur(16px)" }} />}
              <path d={SENEGAL_PATH} fill="none" stroke={mode === "sombre" ? mix(NAVY, "#6f86b5", darkK) : NAVY} strokeWidth={4.5} strokeLinejoin="round" />
              {dimRight > 0.01 && <path d={SENEGAL_PATH} fill="#0a0610" opacity={dimRight} />}
            </g>
          </g>

          {/* PROFONDEUR de faille : lueur CHAUDE diffuse (DA Gemini : pas de neon fluo 'gaming') */}
          {faultGlow > 0.01 && (
            <path
              d={FRACTURE_D}
              fill="none"
              stroke="#a85a2a"
              strokeWidth={8 + 8 * faultPulse}
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={faultGlow * 0.22 * faultPulse}
              style={{ filter: "blur(12px)" }}
            />
          )}
          {/* TRAIT DE FRACTURE (noir profond, se trace a la cassure, epaissit a l'aggravation) */}
          <path
            d={FRACTURE_D}
            fill="none"
            stroke={mode === "sombre" ? "#02060e" : "#1a0f0d"}
            strokeWidth={5 + faultGlow * 2}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={2600}
            strokeDashoffset={2600 * (1 - crackProg)}
            opacity={0.9 * (1 - recompose)}
          />

          {/* DEBRIS ejectes de la faille a la cassure (micro-anim) */}
          {debris.map((d, i) => (
            d.op > 0.01 ? <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={mode === "sombre" ? "#c9a96a" : "#7d2118"} opacity={d.op} /> : null
          ))}
        </g>

        {/* LUMIERE douce qui derive (highlight balaye, anti-statique) */}
        <defs>
          <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity={mode === "sombre" ? 0.05 : 0.08} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x={`${lightSweep - 40}%`} y="0" width="40%" height="100%" fill="url(#sweep)" opacity={0.6} />

        {/* GRAIN papier global (DA Gemini : matiere, sort du 'vectoriel plat') */}
        <rect width={W} height={H} filter="url(#grain)" opacity={0.9} style={{ mixBlendMode: "overlay" }} />
      </svg>

      {/* CHIFFRE 8M$ repris (continuite), tremble puis vire crise */}
      <div
        style={{
          position: "absolute",
          left: centerX + shakeX,
          top: centerY + shakeY,
          transform: `translate(-50%,-50%) rotate(${numTilt}deg)`,
          fontFamily: "'Bebas Neue','Impact',sans-serif",
          fontSize: 104,
          color: numColor,
          letterSpacing: "1px",
          lineHeight: 1,
          textShadow: "0 2px 10px rgba(20,10,8,0.55), 0 1px 0 rgba(0,0,0,0.3)",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
          opacity: numFade,
        }}
      >
        {amountStr}
      </div>

      {/* COUPERET EPURE : "22 MAI" SEUL + pulse, PUIS disparait quand la question commence */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 96,
          textAlign: "center",
          pointerEvents: "none",
          opacity: slamOp * dateOut,
          transform: `translateY(${slamY}px) scale(${datePulse})`,
        }}
      >
        <span
          style={{
            fontFamily: "'Bebas Neue','Impact',sans-serif",
            fontSize: 104,
            color: mode === "sombre" ? "#f2ebd9" : CRISIS_DARK,
            letterSpacing: "3px",
            lineHeight: 1,
            textShadow: mode === "sombre" ? "0 2px 16px rgba(0,0,0,0.6)" : "0 2px 0 rgba(255,255,255,0.4)",
          }}
        >
          22 MAI
        </span>
      </div>
      </div>{/* fin SCENE carte fracturee */}

      {/* BEAT 2 — VIGNETTE qui monte sur "la tourmente politique" (ZERO texte, l'image raconte).
          Decision Aziz : ne pas meubler. La carte vit, la rupture s'aggrave, la voix porte la question. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse at center 44%, rgba(10,8,12,0) 38%, rgba(10,8,12,${vignette}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Interpole 2 couleurs hex.
function mix(a: string, b: string, t: number): string {
  const pa = hex(a), pb = hex(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function hex(h: string): [number, number, number] {
  const s = h.replace("#", "");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

export default ProtoEffect_Fracture;
