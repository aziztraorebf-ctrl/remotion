import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ICON_EMAIL,
  ICON_SLACK,
  ICON_TABLEUR,
  ICON_CHAT,
  ICON_FLUX,
  ICON_HR,
  ICON_DOCUMENT,
} from "./icons/iconsInline";
import {
  ICON_EMAIL_V2,
  ICON_SLACK_V2,
  ICON_TABLEUR_V2,
  ICON_CHAT_V2,
  ICON_FLUX_V2,
  ICON_HR_V2,
  ICON_PROFIL_V2,
  ICON_DOCUMENT_V2,
  ICON_QUESTION_V2,
} from "./icons/iconsInlineV2";

// ---------------------------------------------------------------------------
// Registre PERSONNE/EMOTION (Volet 2B) -- silhouette animee via MiniMax H3
// (image-to-video, clips 5s ping-pong pour etirer sur la duree VO), + icones
// SVG Fable5 calees sur whisper-words.ts (forced alignment narration-flowdesk.mp3).
// Meme decoupage temporel que FlowdeskAbstrait2A (registre abstrait) pour
// comparaison directe : panneau 1 Chaos 0-495f, panneau 2 Bascule 495-810f.
// ---------------------------------------------------------------------------

const FPS = 30;
export const FLOWDESK_PERSONNE_FPS = FPS;

const CHAOS_START = 0;
const BASCULE_START = 495; // 16.5s -- fin "...chaque message" (whisper: 15.94s) + marge
const PANEL2_END = 810; // 27.0s -- fin "...un seul systeme" (whisper: 26.32s) + marge

// Whip-pan de transition 1->2 -- pris SUR la fin du panneau 1 (pas d'ajout de duree totale,
// le timing narratif whisper reste la contrainte dure). DA-brief upstream 2026-08-05,
// convergence 3/3 modeles (G+K+D) : "manque d'action" a la bascule -> priorite CRITIQUE.
const WHIPPAN_DURATION = 10; // frames, ~0.33s -- rapide et sec, pas une transition douce
const WHIPPAN_START = BASCULE_START - WHIPPAN_DURATION;

export const FLOWDESK_PERSONNE_FRAMES = PANEL2_END;

const W = 1920;
const H = 1080;
const BG = "#0B1F3A";

// Clips source H3 : 2176x1440 (ratio 1.511). Duree reelle clip = 5.1667s (24fps natif),
// mais OffthreadVideo se synchronise au projet 30fps -- donc en frames PROJET (30fps),
// un clip de 5.1667s = 155 frames. Ping-pong = alternance clip normal / clip pre-inverse
// (ffmpeg -vf reverse -af areverse, cf test-minimax-h3/panel*-reversed.mp4) toutes les
// 155 frames, via <Sequence> empilees -- pas de seek dynamique (OffthreadVideo ne supporte
// pas playbackRate negatif, limitation navigateur).
const CLIP_FRAMES_AT_30FPS = 155;
const CLIP_W = 2176;
const CLIP_H = 1440;

// Genere la liste de <Sequence> normal/inverse alternees pour couvrir totalFrames.
const PingPongVideo: React.FC<{
  normalSrc: string;
  reversedSrc: string;
  totalFrames: number;
  muted?: boolean;
  style: React.CSSProperties;
}> = ({ normalSrc, reversedSrc, totalFrames, muted, style }) => {
  const segments: { from: number; duration: number; reversed: boolean }[] = [];
  let cursor = 0;
  let idx = 0;
  while (cursor < totalFrames) {
    const duration = Math.min(CLIP_FRAMES_AT_30FPS, totalFrames - cursor);
    segments.push({ from: cursor, duration, reversed: idx % 2 === 1 });
    cursor += duration;
    idx += 1;
  }

  return (
    <>
      {segments.map((seg, i) => (
        <Sequence key={i} from={seg.from} durationInFrames={seg.duration}>
          <OffthreadVideo
            src={seg.reversed ? reversedSrc : normalSrc}
            pauseWhenBuffering
            muted={muted}
            style={style}
          />
        </Sequence>
      ))}
    </>
  );
};

// ---------------------------------------------------------------------------
// Icone dessinee -- contour du cercle se TRACE en stroke-dashoffset (technique
// svg-library/techniques/strokeDashoffset-drawing.md), puis le contenu (fill +
// details internes) pop une fois le cercle trace. Grille dense, calee sur un
// timestamp whisper (secondes) -- feedback Aziz 2026-08-05 : icones trop
// petites/eparses vs storyboard reference (mur d'icones serre, pas des points
// epars) -- corrige ici par grille 3x3 + taille x2.
// ---------------------------------------------------------------------------
// v2 : bulles RECTANGULAIRES arrondies (viewBox 220x180 commun, cf iconsInlineV2.ts),
// remplace les cercles v1 -- feedback Aziz 2026-08-05 apres comparaison directe avec
// le storyboard reference envoye en image (bulles rect, tailles variables, mur dense
// qui se chevauche, pas une grille reguliere de points epars).
// Perimetre d'un rect arrondi (approx bonne, coins traites comme des quarts de cercle) :
// 2*(w+h) - 8*rx + 2*PI*rx = 2*(w+h) - (8-2*PI)*rx
function rectPerimeter(w: number, h: number, rx: number): number {
  return 2 * (w + h) - (8 - 2 * Math.PI) * rx;
}

// ---------------------------------------------------------------------------
// FlyingIcon -- remplace DrawnIconV2 (statique apres apparition). Feedback Aziz
// 2026-08-06 : "les icones ne devraient pas rester immobiles, elles devraient
// voler tout autour de la tete, occuper le haut ET le bas, mouvement desordonne
// -- exception ASSUMEE a la regle 'objet inerte ne glisse jamais', le CHAOS est
// le sujet meme de ce panneau, pas un decor".
//
// Trajectoire : Lissajous bruite (2 sinusoides a frequences/phases differentes
// par icone, seedees par driftSeed) -- mouvement organique jamais periodique a
// l'oeil sur 17s, contrairement a un cercle/ellipse pur. Amplitude couvre tout
// le cadre (haut ET bas, feedback explicite).
//
// Techniques motion design ajoutees (jamais utilisees ailleurs dans ce repo,
// suggestion Claude sur demande explicite d'Aziz) :
// - SQUASH & STRETCH : l'icone s'etire dans le sens du mouvement (scaleX/scaleY
//   differencies selon la vitesse instantanee), se tasse legerement aux pics de
//   changement de direction -- donne du poids/vie a un pictogramme plat.
// - ANTICIPATION : un leger mouvement inverse (2-3 frames) precede chaque
//   inversion de direction marquee -- vend le chaos comme volontaire.
// - TRAIL FANTOME : 2 copies dupliquees a opacite degressive, decalees de
//   quelques frames dans le passe -- vend la vitesse sans blur CSS (interdit).
// ---------------------------------------------------------------------------
function lissajousPos(frame: number, seed: number): { x: number; y: number; vx: number; vy: number } {
  // Frequences/phases derivees du seed -- chaque icone a une trajectoire distincte.
  const fx = 0.012 + (seed % 5) * 0.0018;
  const fy = 0.009 + ((seed * 3) % 5) * 0.0021;
  const phaseX = seed * 1.7;
  const phaseY = seed * 2.3 + 1.1;
  const x = Math.sin(frame * fx + phaseX);
  const y = Math.sin(frame * fy + phaseY) * Math.cos(frame * fx * 0.6 + phaseX * 0.5);
  // vitesse instantanee (derivee approx par difference finie, pour squash&stretch)
  const dx = Math.sin((frame + 1) * fx + phaseX) - x;
  const dy =
    Math.sin((frame + 1) * fy + phaseY) * Math.cos((frame + 1) * fx * 0.6 + phaseX * 0.5) - y;
  return { x, y, vx: dx, vy: dy };
}

const FlyingIcon: React.FC<{
  html: string;
  appearSec: number;
  centerXPct: number; // centre de la zone de vol (pas une position figee)
  centerYPct: number;
  rangeXPct: number; // amplitude du vol autour du centre
  rangeYPct: number;
  width: number;
  rectW: number;
  rectH: number;
  rectRx: number;
  driftSeed: number;
  sfxSrc?: string; // SFX joue au moment de l'apparition (une seule fois)
}> = ({ html, appearSec, centerXPct, centerYPct, rangeXPct, rangeYPct, width, rectW, rectH, rectRx, driftSeed, sfxSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appearFrame = appearSec * fps;
  const rel = frame - appearFrame;
  if (rel < -1) return null;

  const perimeter = rectPerimeter(rectW, rectH, rectRx);
  const drawProgress = interpolate(rel, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drawOffset = (1 - drawProgress) * perimeter;

  const contentPop = spring({
    frame: rel - 10,
    fps,
    config: { mass: 0.6, damping: 11, stiffness: 150 },
    durationInFrames: 20,
  });

  // Anticipation : un leger recul (2-3f) juste avant que le vol chaotique ne s'engage vraiment,
  // une fois l'icone posee (rel > 24, apres le pop initial).
  const anticipation = rel > 24 && rel < 30 ? interpolate(rel, [24, 27, 30], [0, -8, 0]) : 0;

  const { x: lx, y: ly, vx, vy } = lissajousPos(frame, driftSeed);
  const flyX = lx * rangeXPct;
  const flyY = ly * rangeYPct;
  const speed = Math.sqrt(vx * vx + vy * vy);

  // Squash & stretch : etirement dans le sens du mouvement, proportionnel a la vitesse instantanee.
  const stretchAmount = Math.min(0.22, speed * 14);
  const moveAngle = Math.atan2(vy, vx);
  const scaleX = 1 + stretchAmount * Math.abs(Math.cos(moveAngle));
  const scaleY = 1 + stretchAmount * Math.abs(Math.sin(moveAngle)) - stretchAmount * 0.5;

  const rotationDeg = interpolate(lx, [-1, 1], [-14, 14]) + interpolate(ly, [-1, 1], [-6, 6]);

  const xPct = centerXPct + flyX;
  const yPct = centerYPct + flyY + anticipation * 0.05;
  const height = width * (180 / 220);

  const rippleProgress = interpolate(rel, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rippleScale = interpolate(rippleProgress, [0, 1], [0.3, 2.2]);
  const rippleOpacity = interpolate(rippleProgress, [0, 0.15, 1], [0, 0.55, 0]);

  // Trail fantome : 2 copies decalees de 3 et 6 frames dans le passe, opacite degressive.
  const trailFrames = [6, 3];
  const trails = rel > 20
    ? trailFrames.map((delay) => {
        const { x: tx, y: ty } = lissajousPos(frame - delay, driftSeed);
        return {
          xPct: centerXPct + tx * rangeXPct,
          yPct: centerYPct + ty * rangeYPct,
          opacity: 0.12,
        };
      })
    : [];

  return (
    <>
      {trails.map((t, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${t.xPct}%`,
            top: `${t.yPct}%`,
            width,
            height,
            transform: "translate(-50%, -50%)",
            opacity: t.opacity,
            pointerEvents: "none",
          }}
        >
          <svg width={width} height={height} viewBox="0 0 220 180">
            <rect x={(220 - rectW) / 2} y={(180 - rectH) / 2} width={rectW} height={rectH} rx={rectRx} fill="#F5EFE4" />
          </svg>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: `${xPct}%`,
          top: `${yPct}%`,
          width,
          height,
          transform: `translate(-50%, -50%) rotate(${rotationDeg}deg) scale(${scaleX}, ${scaleY})`,
        }}
      >
        {rippleProgress < 1 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: width * 0.6,
              height: width * 0.6,
              borderRadius: "50%",
              border: "3px solid #FFFFFF",
              transform: `translate(-50%, -50%) scale(${rippleScale})`,
              opacity: rippleOpacity,
            }}
          />
        )}
        <svg width={width} height={height} viewBox="0 0 220 180" style={{ overflow: "visible" }}>
          <rect
            x={(220 - rectW) / 2}
            y={(180 - rectH) / 2}
            width={rectW}
            height={rectH}
            rx={rectRx}
            fill="none"
            stroke="#FF6B1A"
            strokeWidth={5}
            strokeDasharray={`${perimeter}`}
            strokeDashoffset={drawOffset}
            opacity={drawProgress > 0 && drawProgress < 1 ? 1 : 0}
          />
          <g
            style={{ transform: `scale(${contentPop})`, transformOrigin: "110px 90px" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </svg>
      </div>
      {sfxSrc && rel >= 0 && rel <= 2 && <Audio src={sfxSrc} volume={0.5} />}
    </>
  );
};

// ---------------------------------------------------------------------------
// Logo Flowdesk anime -- se DESSINE par sequence (spine -> arm-top -> arm-mid
// -> flow-line -> flow-arrow), pas un simple fade texte. Longueurs de path
// EXACTES calculees numeriquement (segments droits/bezier connus, cf session) --
// pas de DASH sur-dimensionne, precision garantie.
// Source : icons/logo-flowdesk.svg (Fable5, groupes nommes des l'origine pour
// permettre exactement cette animation sequentielle).
// ---------------------------------------------------------------------------
const LOGO_LEN = {
  spine: 116,
  armTop: 78,
  armMid: 64,
  flowLine: 157, // approx numerique (bezier), marge +1 suffisante
  flowArrow: 40,
};

const AnimatedLogo: React.FC<{ startFrame: number; size: number }> = ({ startFrame, size }) => {
  const frame = useCurrentFrame();
  const rel = frame - startFrame;
  if (rel < -1) return null;

  const clamp01 = (f: number, range: [number, number]) =>
    interpolate(f, range, [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Sequence : shape pop (0-12f) -> spine (10-24f) -> arm-top (22-32f) ->
  // arm-mid (30-40f) -> flow-line (38-54f) -> flow-arrow pop (52-64f).
  const shapeProgress = clamp01(rel, [0, 12]);
  const spineProgress = clamp01(rel, [10, 24]);
  const armTopProgress = clamp01(rel, [22, 32]);
  const armMidProgress = clamp01(rel, [30, 40]);
  const flowLineProgress = clamp01(rel, [38, 54]);
  const flowArrowProgress = clamp01(rel, [52, 64]);

  const draw = (progress: number, len: number) => ({
    strokeDasharray: `${len}`,
    strokeDashoffset: (1 - progress) * len,
  });

  return (
    <div style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 300 300" style={{ overflow: "visible" }}>
        <g style={{ transform: `scale(${shapeProgress})`, transformOrigin: "150px 150px" }}>
          <circle cx={150} cy={150} r={138} fill="#0B1F3A" />
          <circle cx={150} cy={150} r={138} fill="none" stroke="#FF6B1A" strokeWidth={6} />
        </g>
        <g fill="none" stroke="#FFFFFF" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round">
          <path d="M108 208 V92" {...draw(spineProgress, LOGO_LEN.spine)} />
          <path d="M108 92 H186" {...draw(armTopProgress, LOGO_LEN.armTop)} />
          <path d="M108 150 H172" {...draw(armMidProgress, LOGO_LEN.armMid)} />
        </g>
        <path
          d="M74 226 C 110 246, 190 246, 226 226"
          fill="none"
          stroke="#FF6B1A"
          strokeWidth={10}
          strokeLinecap="round"
          {...draw(flowLineProgress, LOGO_LEN.flowLine)}
        />
        <g style={{ transform: `scale(${flowArrowProgress})`, transformOrigin: "220px 227px" }}>
          <path
            d="M212 214 L228 226 L214 240"
            fill="none"
            stroke="#FF6B1A"
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// PANNEAU 1 -- CHAOS. Silhouette H3 (panel1-chaos-h3.mp4) en ping-pong loop,
// icones qui s'accumulent au rythme des mots-cles (whisper-words.ts).
// ---------------------------------------------------------------------------
// Micro-evenements de rupture -- toutes les ~3-4s, un "sursaut" bref casse la lineaire du mur
// d'icones qui s'accumule (DA-brief 2026-08-05, D : "eviter que le panneau 1 soit un etat qui
// dure 17s" -- sans ca, l'oeil se lasse malgre le mouvement continu). Chaque event = un flash
// blanc tres bref + un scale-punch collectif du mur d'icones deja pose.
const RUPTURE_FRAMES = [95, 215, 335, 455]; // ~3.2s, 7.2s, 11.2s, 15.2s -- espacement ~4s
const RUPTURE_DURATION = 6;

const RuptureFlash: React.FC<{ frame: number }> = ({ frame }) => {
  let opacity = 0;
  for (const t of RUPTURE_FRAMES) {
    const rel = frame - t;
    if (rel >= 0 && rel <= RUPTURE_DURATION) {
      opacity = Math.max(opacity, interpolate(rel, [0, 1, RUPTURE_DURATION], [0, 0.35, 0]));
    }
  }
  if (opacity === 0) return null;
  return <AbsoluteFill style={{ backgroundColor: "#FFFFFF", opacity, pointerEvents: "none" }} />;
};

// scale-punch collectif du mur d'icones -- pulse bref synchronise aux memes RUPTURE_FRAMES.
function rupturePunch(frame: number): number {
  let punch = 1;
  for (const t of RUPTURE_FRAMES) {
    const rel = frame - t;
    if (rel >= 0 && rel <= RUPTURE_DURATION) {
      punch = Math.max(punch, interpolate(rel, [0, 2, RUPTURE_DURATION], [1, 1.06, 1]));
    }
  }
  return punch;
}

// Glitch RETIRE -- feedback Aziz 2026-08-06 : "ca ne sert a rien, distrayant, ne fait pas
// mieux comprendre la situation". Le vol chaotique continu des icones (FlyingIcon) porte
// maintenant seul la sensation de debordement -- plus besoin d'un effet de coupure separe.

// Element SVG (une icone du meme registre, ex bulle "flux") qui traverse rapidement le cadre
// en plein ecran juste au moment de la jonction ping-pong (155f) -- masque un eventuel saut de
// pose visible a l'inversion du clip H3 (DA-brief 2026-08-05, G : risque identifie). Traverse
// vite (10 frames), donc lisible comme un "coup" plutot qu'un ralentissement du rythme.
const PING_PONG_MASK_DURATION = 10;

const PingPongMask: React.FC<{ junctionFrame: number }> = ({ junctionFrame }) => {
  const frame = useCurrentFrame();
  const rel = frame - (junctionFrame - PING_PONG_MASK_DURATION / 2);
  if (rel < 0 || rel > PING_PONG_MASK_DURATION) return null;

  const x = interpolate(rel, [0, PING_PONG_MASK_DURATION], [-260, W + 260]);
  const opacity = interpolate(rel, [0, 2, PING_PONG_MASK_DURATION - 2, PING_PONG_MASK_DURATION], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotation = interpolate(rel, [0, PING_PONG_MASK_DURATION], [-15, 15]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: "58%",
        width: 260,
        height: 213,
        transform: `translateY(-50%) rotate(${rotation}deg)`,
        opacity,
      }}
    >
      <svg width={260} height={213} viewBox="0 0 220 180">
        <g dangerouslySetInnerHTML={{ __html: ICON_FLUX_V2 }} />
      </svg>
    </div>
  );
};

const PanneauChaosPersonne: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // clip source 2176x1440 recadre/centre dans 1920x1080 (cover), personnage bas-cadre
  const scale = Math.max(W / CLIP_W, H / CLIP_H) * 1.12;
  const videoIn = spring({ frame, fps, config: { mass: 1, damping: 16, stiffness: 90 }, durationInFrames: 30 });

  // Zoom-in continu du cadre entier -- sensation d'etouffement qui monte (DA-brief, G : scale
  // 1->1.15 sur toute la duree du panneau).
  const localEnd = BASCULE_START - CHAOS_START;
  const globalZoom = interpolate(frame, [0, localEnd], [1, 1.15], { extrapolateRight: "clamp" });

  const punch = rupturePunch(frame);

  const content = (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        transform: `scale(${globalZoom})`,
        transformOrigin: "50% 50%",
        display: "block", // inoffensif mais inutile ici -- la vraie cause du decalage etait le
        // wrapper punch (icones) sans position:absolute, PAS le display du wrapper zoom (verifie
        // par agent dedie 2026-08-05 : coordonnees identiques flex/block dans ce cas precis,
        // les enfants absolute sont hors flux donc display n'a pas de prise sur eux).
      }}
    >
      <AbsoluteFill style={{ opacity: videoIn, overflow: "hidden" }}>
        <PingPongVideo
          normalSrc={staticFile("_client-sim/flowdesk/video/panel1-chaos-h3.mp4")}
          reversedSrc={staticFile("_client-sim/flowdesk/video/panel1-chaos-h3-rev.mp4")}
          totalFrames={BASCULE_START - CHAOS_START}
          muted
          style={{
            position: "absolute",
            left: "50%",
            top: "58%",
            width: CLIP_W * scale,
            height: CLIP_H * scale,
            transform: "translate(-50%, -50%)",
          }}
        />
      </AbsoluteFill>

      {/* Element SVG au premier plan qui passe devant le personnage pile a la frame de jonction
          ping-pong (155f, cf CLIP_FRAMES_AT_30FPS) -- masque le point de couture eventuel
          (DA-brief 2026-08-05, G : risque "respiration robotique" identifie sur le clip H3 loope). */}
      <PingPongMask junctionFrame={CLIP_FRAMES_AT_30FPS} />

      {/* Icones v3 -- VOL CHAOTIQUE CONTINU sur TOUT le cadre (haut ET bas), tailles
          agrandies (feedback Aziz 2026-08-06 : "plus gros, plus disperses, jamais
          immobiles, occuper tout l'espace, mouvement desordonne" -- exception ASSUMEE
          a la regle objet-inerte-ne-bouge-pas, le chaos EST le sujet de ce panneau).
          Chaque icone a sa propre zone de vol (centre + amplitude) qui se chevauche
          avec les autres -- pas de grille, un vrai debordement. SFX sur les 3
          premieres icones (email/Slack/tableur, les plus reconnaissables au son). */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${punch})`, transformOrigin: "50% 50%" }}>
        <FlyingIcon html={ICON_EMAIL_V2} appearSec={0.0} centerXPct={14} centerYPct={22} rangeXPct={10} rangeYPct={14} width={300} rectW={200} rectH={140} rectRx={34} driftSeed={1} sfxSrc={staticFile("_client-sim/flowdesk/audio/sfx/sfx-notif-email.mp3")} />
        <FlyingIcon html={ICON_SLACK_V2} appearSec={0.9} centerXPct={32} centerYPct={15} rangeXPct={12} rangeYPct={16} width={260} rectW={172} rectH={120} rectRx={28} driftSeed={2} sfxSrc={staticFile("_client-sim/flowdesk/audio/sfx/sfx-notif-slack.mp3")} />
        <FlyingIcon html={ICON_TABLEUR_V2} appearSec={1.34} centerXPct={50} centerYPct={20} rangeXPct={14} rangeYPct={18} width={300} rectW={200} rectH={140} rectRx={34} driftSeed={3} sfxSrc={staticFile("_client-sim/flowdesk/audio/sfx/sfx-notif-tableur.mp3")} />
        <FlyingIcon html={ICON_CHAT_V2} appearSec={1.76} centerXPct={68} centerYPct={16} rangeXPct={12} rangeYPct={16} width={260} rectW={172} rectH={120} rectRx={28} driftSeed={4} sfxSrc={staticFile("_client-sim/flowdesk/audio/sfx/sfx-notif-generic-soft.mp3")} />
        <FlyingIcon html={ICON_HR_V2} appearSec={2.2} centerXPct={85} centerYPct={22} rangeXPct={10} rangeYPct={14} width={200} rectW={120} rectH={96} rectRx={24} driftSeed={5} sfxSrc={staticFile("_client-sim/flowdesk/audio/sfx/sfx-notif-generic-sharp.mp3")} />
        {/* Zones du bas RECENTREES sur les cotes extremes -- le personnage occupe le centre-bas
            du cadre (~40-65% x, ~55-100% y) ; une icone qui y volerait collerait sur le visage,
            nuisant a la lisibilite du sujet principal (constate au render v8 -- ICON_DOCUMENT
            recouvrait completement la tete a plusieurs frames). Corrige en resserrant vers les
            bords gauche/droite, hors de la zone du personnage. */}
        <FlyingIcon html={ICON_FLUX_V2} appearSec={2.46} centerXPct={10} centerYPct={62} rangeXPct={8} rangeYPct={16} width={260} rectW={172} rectH={120} rectRx={28} driftSeed={6} sfxSrc={staticFile("_client-sim/flowdesk/audio/sfx/sfx-notif-generic-soft.mp3")} />
        <FlyingIcon html={ICON_PROFIL_V2} appearSec={2.72} centerXPct={18} centerYPct={82} rangeXPct={8} rangeYPct={12} width={200} rectW={120} rectH={96} rectRx={24} driftSeed={7} sfxSrc={staticFile("_client-sim/flowdesk/audio/sfx/sfx-notif-generic-sharp.mp3")} />
        <FlyingIcon html={ICON_DOCUMENT_V2} appearSec={4.54} centerXPct={88} centerYPct={65} rangeXPct={8} rangeYPct={16} width={300} rectW={200} rectH={140} rectRx={34} driftSeed={8} sfxSrc={staticFile("_client-sim/flowdesk/audio/sfx/sfx-notif-generic-soft.mp3")} />
        <FlyingIcon html={ICON_QUESTION_V2} appearSec={4.96} centerXPct={90} centerYPct={85} rangeXPct={8} rangeYPct={12} width={200} rectW={120} rectH={96} rectRx={24} driftSeed={9} sfxSrc={staticFile("_client-sim/flowdesk/audio/sfx/sfx-notif-generic-sharp.mp3")} />
      </div>

      {/* Lit de tension sonore continu -- monte legerement en intensite sur les 17s
          (DA-brief + feedback Aziz : "il manque les SFX"). Boucle 6s, repetee. */}
      {Array.from({ length: Math.ceil(localEnd / (6 * fps)) }).map((_, i) => (
        <Sequence key={`tension-${i}`} from={i * 6 * fps} durationInFrames={Math.min(6 * fps, localEnd - i * 6 * fps)}>
          <Audio
            src={staticFile("_client-sim/flowdesk/audio/sfx/sfx-tension-bed-loop.mp3")}
            volume={(f) => interpolate(f + i * 6 * fps, [0, localEnd], [0.12, 0.28])}
          />
        </Sequence>
      ))}

      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#FFFFFF",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: 2,
          opacity: 0.85,
        }}
      >
        ÉTAT INITIAL
      </div>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {content}
      <RuptureFlash frame={frame} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Icone convergente -- vole depuis un bord du cadre vers le logo en spirale
// (rotation + scale-down + trajectoire courbe), absorbee au point d'impact.
// Feedback Aziz 2026-08-05 : "le panneau 2 manque d'action" -- ce mouvement
// vend la bascule/absorption (echo du vortex vu dans storyboard-v1-gemini.png,
// adapte au format/registre de ce panneau plutot que copie telle quelle).
// ---------------------------------------------------------------------------
// Trajectoire en SPIRALE LOGARITHMIQUE vers le point d'absorption (DA-brief 2026-08-05, formule
// Kimi retenue Chantier 5 -- remplace le trajet lineaire precedent, mouvement plus riche/organique
// pour vendre l'"absorption vortex" identifiee comme LE moment fort par les 3 modeles).
// x(t) = cx + r(t)*cos(theta(t)), y(t) = cy + r(t)*sin(theta(t)) -- r decroit de la distance
// initiale vers 0, theta tourne plusieurs fois (spirale, pas une ligne droite).
const ConvergingIcon: React.FC<{
  html: string;
  startFrame: number;
  fromXPct: number;
  fromYPct: number;
  toXPct: number;
  toYPct: number;
  size: number;
}> = ({ html, startFrame, fromXPct, fromYPct, toXPct, toYPct, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - startFrame;
  const DURATION = 46;
  if (rel < 0 || rel > DURATION + 4) return null;

  const progress = spring({ frame: rel, fps, config: { mass: 1, damping: 18, stiffness: 60 }, durationInFrames: DURATION });
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Coordonnees en % converties en pseudo-pixels (base 1920x1080) pour calculer la spirale en
  // espace euclidien correct (les % X/Y n'ont pas la meme echelle physique en absolu).
  const fromX = (fromXPct / 100) * W;
  const fromY = (fromYPct / 100) * H;
  const toX = (toXPct / 100) * W;
  const toY = (toYPct / 100) * H;

  const dx0 = fromX - toX;
  const dy0 = fromY - toY;
  const r0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
  const theta0 = Math.atan2(dy0, dx0);

  // r decroit de r0 vers 0 (easeOut naturel via clampedProgress issu du spring, deja non-lineaire).
  const r = r0 * (1 - clampedProgress);
  // theta tourne de 2.2 tours (~800deg) sur tout le trajet -- spirale visible, pas juste une courbe.
  const theta = theta0 + clampedProgress * (Math.PI * 2 * 2.2);

  const x = toX + r * Math.cos(theta);
  const y = toY + r * Math.sin(theta);

  const rotation = interpolate(rel, [0, DURATION], [0, 500], { extrapolateRight: "clamp" });
  const scale = interpolate(clampedProgress, [0, 0.7, 1], [1, 0.65, 0.12]);
  const opacity = interpolate(rel, [0, 8, DURATION - 6, DURATION], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        opacity,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 200 200" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// PANNEAU 2 -- BASCULE/REORGANISATION. Silhouette H3 (panel2, papiers en
// desordre CONTINU -- decision Aziz, pas de convergence) + SFX clavier du
// clip source (piste audio extraite, cf <Audio> plus bas), + icones convergentes
// vers le logo pour vendre l'action de "bascule/absorption".
// ---------------------------------------------------------------------------
const PanneauBasculePersonne: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = Math.max(W / CLIP_W, H / CLIP_H) * 1.0;
  const videoIn = spring({ frame, fps, config: { mass: 1, damping: 16, stiffness: 90 }, durationInFrames: 30 });

  // Overlay de teinte pendant la bascule -- allegement subtil marine->marine plus clair pendant
  // les 40 premieres frames (DA-brief 2026-08-05, Chantier 5 nuance K : overlay plutot que
  // changer la teinte du clip video lui-meme, teste au rendu avant validation visuelle).
  const tintOpacity = interpolate(frame, [0, 20, 40], [0.22, 0.1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AbsoluteFill style={{ opacity: videoIn, overflow: "hidden" }}>
        <PingPongVideo
          normalSrc={staticFile("_client-sim/flowdesk/video/panel2-bascule-h3.mp4")}
          reversedSrc={staticFile("_client-sim/flowdesk/video/panel2-bascule-h3-rev.mp4")}
          totalFrames={PANEL2_END - BASCULE_START}
          muted
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: CLIP_W * scale,
            height: CLIP_H * scale,
            transform: "translate(-50%, -50%)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#2E4C7A", opacity: tintOpacity, pointerEvents: "none" }} />

      {/* Icones convergentes -- volent des bords vers le logo (coin haut-gauche, ~6%/9%
          -- repositionne en meme temps que le logo, cf ci-dessous), absorbees en spirale.
          Echelonnees pour eviter un paquet visuel d'un coup, reprennent le meme set
          que le panneau 1 (coherence visuelle, pas de nouvel asset). */}
      <ConvergingIcon html={ICON_EMAIL} startFrame={4} fromXPct={8} fromYPct={40} toXPct={6} toYPct={9} size={130} />
      <ConvergingIcon html={ICON_SLACK} startFrame={14} fromXPct={92} fromYPct={22} toXPct={6} toYPct={9} size={125} />
      <ConvergingIcon html={ICON_CHAT} startFrame={24} fromXPct={12} fromYPct={70} toXPct={6} toYPct={9} size={120} />
      <ConvergingIcon html={ICON_TABLEUR} startFrame={34} fromXPct={88} fromYPct={68} toXPct={6} toYPct={9} size={125} />
      <ConvergingIcon html={ICON_DOCUMENT} startFrame={48} fromXPct={20} fromYPct={85} toXPct={6} toYPct={9} size={115} />
      <ConvergingIcon html={ICON_HR} startFrame={60} fromXPct={80} fromYPct={88} toXPct={6} toYPct={9} size={115} />

      {/* Logo anime -- remplace le texte statique "Flowdesk" (feedback Aziz 2026-08-05 :
          "creer un vrai logo qu'on peut animer, faire apparaitre, dessiner" -- exploiter
          le SVG plutot que rester au texte). Positionne HAUT-GAUCHE (logo + texte cote a
          cote), aligne sur la reference storyboard envoyee par Aziz -- pas centre. Se
          dessine sequentiellement (spine->arm-top->arm-mid->flow-line->flow-arrow). */}
      {/* Logo agrandi (feedback Aziz 2026-08-06 : "pourrait etre beaucoup plus grand"). */}
      <div style={{ position: "absolute", top: 36, left: 64, display: "flex", alignItems: "center", gap: 28 }}>
        <AnimatedLogo startFrame={0} size={180} />
        <div
          style={{
            color: "#FF6B1A",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: 1,
            opacity: interpolate(frame, [58, 74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          Flowdesk
        </div>
      </div>

      {/* Sous-titre discret, coin haut-droit -- ne concurrence pas le lockup logo+texte. */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 64,
          color: "#FFFFFF",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 2,
          opacity: interpolate(frame, [66, 82], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        BASCULE
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Whip-pan de transition 1->2 -- panneau 1 est ejecte violemment vers la droite
// (spring overshoot), panneau 2 entre depuis la gauche au meme rythme, une barre
// orange pleine largeur traverse l'ecran pour masquer le point de coupe (technique
// K+D : "coupe cachee par un element graphique" plutot qu'un fondu enchaine --
// piege AI-slop identifie par les 3 modeles si on utilise un simple fondu ici).
// ---------------------------------------------------------------------------
// useCurrentFrame() ICI retourne la frame LOCALE a la Sequence englobante (from=CHAOS_START=0
// pour le panneau 1 -> local==global ; from=BASCULE_START=495 pour le panneau 2 -> local repart
// de 0 au debut du panneau 2) -- comportement standard Remotion, un composant enfant d'une
// <Sequence> lit toujours la frame relative a cette Sequence, pas la frame absolue composition.
const WhipPanWrapper: React.FC<{ children: React.ReactNode; direction: "out" | "in" }> = ({ children, direction }) => {
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "out" (fin panneau 1, Sequence locale 0..BASCULE_START-CHAOS_START) : le whip-pan demarre a
  // localFrame == (WHIPPAN_START - CHAOS_START).
  // "in" (debut panneau 2, Sequence locale 0..PANEL2_END-BASCULE_START) : le whip-pan demarre a
  // localFrame == 0 (BASCULE_START est le tout debut de cette Sequence).
  const springFrame = direction === "out" ? localFrame - (WHIPPAN_START - CHAOS_START) : localFrame;

  const progress = spring({
    frame: springFrame,
    fps,
    config: { mass: 0.8, damping: 12, stiffness: 200 },
    durationInFrames: WHIPPAN_DURATION,
  });

  const clampedProgress = Math.max(0, Math.min(1, progress));
  // "out" : 0 -> sort a droite (+2400px) une fois le whip-pan demarre, 0 avant.
  // "in" : entre depuis la gauche (-2400px) -> 0 des le debut de la Sequence panneau 2.
  const translateX =
    direction === "out"
      ? springFrame >= 0
        ? clampedProgress * 2400
        : 0
      : (1 - clampedProgress) * -2400;

  return <AbsoluteFill style={{ transform: `translateX(${translateX}px)` }}>{children}</AbsoluteFill>;
};

const WhipPanBar: React.FC = () => {
  // Sequence appelante a from={WHIPPAN_START} -- frame locale demarre deja a 0 pile au bon moment.
  const rel = useCurrentFrame();
  if (rel < 0 || rel > WHIPPAN_DURATION + 2) return null;

  // La barre traverse l'ecran de gauche a droite en WHIPPAN_DURATION frames, pleine largeur+hauteur
  // au pic (masque totalement la coupe), fine avant/apres (effet "coup de fouet").
  const sweepX = interpolate(rel, [0, WHIPPAN_DURATION], [-400, W + 400], { extrapolateRight: "clamp" });
  const opacity = interpolate(rel, [0, 2, WHIPPAN_DURATION - 2, WHIPPAN_DURATION], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: sweepX,
          top: 0,
          width: 340,
          height: H,
          background: "#FF6B1A",
          opacity,
          transform: "skewX(-18deg)",
        }}
      />
    </AbsoluteFill>
  );
};

export const FlowdeskPersonne2B: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Sequence from={CHAOS_START} durationInFrames={BASCULE_START - CHAOS_START}>
        <WhipPanWrapper direction="out">
          <PanneauChaosPersonne />
        </WhipPanWrapper>
      </Sequence>
      <Sequence from={BASCULE_START} durationInFrames={PANEL2_END - BASCULE_START}>
        <WhipPanWrapper direction="in">
          <PanneauBasculePersonne />
        </WhipPanWrapper>
      </Sequence>
      <Sequence from={WHIPPAN_START} durationInFrames={WHIPPAN_DURATION + 4}>
        <WhipPanBar />
      </Sequence>

      <Audio src={staticFile("_client-sim/flowdesk/audio/narration-flowdesk.mp3")} />
      <Audio
        src={staticFile("_client-sim/flowdesk/audio/music-flowdesk-45s.mp3")}
        volume={(f) => interpolate(f, [0, 30, PANEL2_END - 30, PANEL2_END], [0, 0.15, 0.15, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
      {/* SFX clavier -- piste audio extraite du clip H3 panneau 2 (frappe + leger fond H3,
          gardee telle quelle -- decision Aziz). Clip source = 5.17s, repete en boucle simple
          (pas ping-pong -- un bruit de frappe repetitif reste credible, contrairement a l'image). */}
      {Array.from({ length: Math.ceil((PANEL2_END - BASCULE_START) / CLIP_FRAMES_AT_30FPS) }).map((_, i) => (
        <Sequence
          key={i}
          from={BASCULE_START + i * CLIP_FRAMES_AT_30FPS}
          durationInFrames={Math.min(CLIP_FRAMES_AT_30FPS, PANEL2_END - BASCULE_START - i * CLIP_FRAMES_AT_30FPS)}
        >
          <Audio src={staticFile("_client-sim/flowdesk/audio/panel2-keyboard-sfx.mp3")} volume={0.35} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
