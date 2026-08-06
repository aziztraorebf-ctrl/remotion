import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { focusTx, focusTy, cameraShake, elementDrift } from "./camera";
import {
  CHAOSV3_DEFS,
  CHAOSV3_IC_EMAIL,
  CHAOSV3_IC_CHAT,
  CHAOSV3_IC_SHEET,
  CHAOSV3_IC_PHONE,
  CHAOSV3_IC_DOC,
  CHAOSV3_IC_BELL,
  CHAOSV3_CHAOS_GRID,
  CHAOSV3_CHAOS_GRID_ATTRS,
  CHAOSV3_CHAOS_DUST,
  CHAOSV3_CHAOS_DUST_ATTRS,
  CHAOSV3_CHAOS_RING2,
  CHAOSV3_CHAOS_SHARDS,
  CHAOSV3_CHAOS_SHARDS_ATTRS,
} from "./groups-v3/chaosV3Groups";
import { ChaosV3_ITEMS } from "./groups-v3/chaosV3Items";
import {
  BASCULEV3_DEFS,
  BASCULEV3_B_IC_EMAIL,
  BASCULEV3_B_IC_CHAT,
  BASCULEV3_B_IC_SHEET,
  BASCULEV3_B_IC_PHONE,
  BASCULEV3_BASCULE_GRID,
  BASCULEV3_BASCULE_GRID_ATTRS,
  BASCULEV3_BASCULE_HORN,
  BASCULEV3_BASCULE_HORN_ATTRS,
  BASCULEV3_BASCULE_RINGS,
  BASCULEV3_BASCULE_RINGS_ATTRS,
  BASCULEV3_BASCULE_FOCUS,
  BASCULEV3_BASCULE_FOCUS_ATTRS,
} from "./groups-v3/basculeV3Groups";
import { BasculeV3_ITEMS } from "./groups-v3/basculeV3Items";
import {
  MECANISMEV3_DEFS,
  MECANISMEV3_M_IC_EMAIL,
  MECANISMEV3_M_IC_CHAT,
  MECANISMEV3_M_IC_DOC,
  MECANISMEV3_MEC_GRID,
  MECANISMEV3_MEC_GRID_ATTRS,
  MECANISMEV3_MEC_FAR_ARCH,
  MECANISMEV3_MEC_FAR_ARCH_ATTRS,
  MECANISMEV3_MEC_MODULE,
  MECANISMEV3_MEC_MODULE_ATTRS,
} from "./groups-v3/mecanismeV3Groups";
import { MecInflowV3_ITEMS } from "./groups-v3/mecInflowV3Items";
import { MecRoutesV3_ITEMS } from "./groups-v3/mecRoutesV3Items";
import {
  RESOLUTIONV3_DEFS,
  RESOLUTIONV3_RES_GROUND,
  RESOLUTIONV3_RES_GROUND_ATTRS,
  RESOLUTIONV3_RES_SEAL_GHOST,
  RESOLUTIONV3_RES_SEAL_GHOST_ATTRS,
  RESOLUTIONV3_RES_SEAL_ARC,
  RESOLUTIONV3_RES_APPROACH,
  RESOLUTIONV3_RES_APPROACH_ATTRS,
  RESOLUTIONV3_RES_PACKET,
  RESOLUTIONV3_RES_PACKET_ATTRS,
  RESOLUTIONV3_RES_SEAL_WELD,
  RESOLUTIONV3_RES_SEAL_WELD_ATTRS,
  RESOLUTIONV3_RES_IMPACT,
  RESOLUTIONV3_RES_ECHOES,
  RESOLUTIONV3_RES_ECHOES_ATTRS,
  RESOLUTIONV3_RES_CORE,
  RESOLUTIONV3_RES_CORE_ATTRS,
  RESOLUTIONV3_RES_CONFIRM,
  RESOLUTIONV3_RES_CONFIRM_ATTRS,
  RESOLUTIONV3_RES_RESIDUE,
  RESOLUTIONV3_RES_RESIDUE_ATTRS,
  RESOLUTIONV3_RES_REST_WAVES,
  RESOLUTIONV3_RES_REST_WAVES_ATTRS,
} from "./groups-v3/resolutionV3Groups";

// ---------------------------------------------------------------------------
// Registre ABSTRAIT V3 (2026-08-05) -- refonte semantique + plein cadre.
// Contexte : V1 statique -> V2 hyperdynamique mais vocabulaire abstrait illisible
// (retour Aziz + critique GPT-5.5 : "je ne sais pas ce que Flowdesk resout").
// V3 = memes 4 SVG regenerees avec des OBJETS NOMMES (email/chat/tableur/telephone,
// mot "FLOWDESK", destinations "IT/RH/FINANCE/SUPPORT/DIRECTION", checkmark+"TRAITE")
// + grammaire de mouvement V2 reprise (camera vivante, derive individuelle,
// transitions whip-pan) + principes de motion design explicites par panneau
// (voir commentaires de chaque PanneauXV3).
// Timing IDENTIQUE a V2 (meme forced-alignment de narration-flowdesk.mp3).
// ---------------------------------------------------------------------------

const FPS = 30;
export const FLOWDESK_V3_FPS = FPS;

const CHAOS_START = 0;
const BASCULE_START = 495;
const MECANISME_START = 810;
const RESOLUTION_START = 1105;
const TOTAL_FRAMES = 1474;
export const FLOWDESK_V3_FRAMES = TOTAL_FRAMES;

const TRANSITION_OVERLAP = 35;

const W = 1920;
const H = 1080;
const BG = "#0B1F3A";

const Inject: React.FC<{
  html: string;
  opacity?: number;
  transform?: string;
  attrs?: Record<string, string>;
}> = ({ html, opacity = 1, transform, attrs }) => {
  const mergedTransform = [attrs?.transform, transform].filter(Boolean).join(" ") || undefined;
  const { transform: _omit, ...restAttrs } = attrs ?? {};
  return (
    <g
      {...restAttrs}
      opacity={opacity}
      transform={mergedTransform}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// ---------------------------------------------------------------------------
// PANNEAU 1 -- CHAOS. Intention : submersion, urgence, "ca deborde de partout".
//
// PRINCIPES MOTION DESIGN appliques :
// - STAGING desynchronise : les 14 icones principales n'entrent PAS toutes en meme
//   temps a pleine vitesse (sinon rien n'est identifiable -- le defaut releve par
//   GPT). Chacune a son propre stagger d'entree (spring decale par index) puis un
//   MOMENT DE PAUSE ou elle ralentit/se fige une fraction de seconde pour rester
//   lisible individuellement, avant de repartir dans l'agitation.
// - TIMING accelerant : le rythme d'apparition des icones s'accelere au fil du
//   panneau (les premieres sont espacees, les dernieres arrivent vite) -- construit
//   la tension au lieu d'un chaos a vitesse constante des la frame 0.
// - EXAGGERATION sur les dernieres icones (urgence) : overshoot de scale plus
//   marque a l'arrivee.
// ---------------------------------------------------------------------------
const CHAOS_PIVOT = { x: 960, y: 540 };

const ChaosItemEl: React.FC<{ item: (typeof ChaosV3_ITEMS)[number]; index: number; frame: number }> = ({
  item,
  index,
  frame,
}) => {
  const total = ChaosV3_ITEMS.length;
  // TIMING ACCELERANT : les items 0..N arrivent avec un stagger qui RETRECIT (les
  // premiers espaces de 14f, les derniers de 5f) -- rythme qui s'emballe.
  const staggerStart = Math.round((index / total) * 90 * (1 - index / (total * 2)));
  const appear = spring({
    frame: Math.max(0, frame - staggerStart),
    fps: FPS,
    config: { mass: 0.7, damping: 12, stiffness: 130 },
    durationInFrames: 30,
  });
  // EXAGGERATION : les 4 dernieres icones (urgence) ont un overshoot de scale plus fort
  const isUrgent = index >= total - 4;
  const overshootScale = isUrgent ? 1 + 0.15 * Math.max(0, Math.sin(appear * Math.PI)) : 1;

  // MOMENT DE PAUSE (staging) : chaque icone freeze ~18 frames autour de son arrivee
  // pour rester lisible, puis reprend un flottement leger -- jamais 0 mouvement total,
  // mais une vraie respiration entre agitation et lisibilite.
  const localFrame = frame - staggerStart;
  const pauseWindow = interpolate(localFrame, [30, 48, 66], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = elementDrift(frame, index);
  const driftAmount = (1 - pauseWindow) * 0.6; // reduit le flottement pendant la pause de lisibilite

  if (appear <= 0.01) return null;

  return (
    <g
      opacity={appear}
      transform={`translate(${drift.floatX * driftAmount} ${drift.floatY * driftAmount}) scale(${appear * overshootScale})`}
      dangerouslySetInnerHTML={{ __html: item.html }}
    />
  );
};

const PanneauChaosV3: React.FC = () => {
  const frame = useCurrentFrame();
  const localEnd = BASCULE_START - CHAOS_START;

  const gridIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const dustIn = interpolate(frame, [5, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring2In = interpolate(frame, [40, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shardsIn = interpolate(frame, [10, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // CAMERA : push-in continu + shake qui s'attenue en fin de panneau (meme grammaire V2)
  const camScale = interpolate(frame, [0, localEnd], [1, 1.06], { extrapolateRight: "clamp" });
  const shakeDecay = interpolate(frame, [localEnd - 90, localEnd], [1, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = cameraShake(frame, 3, localEnd * shakeDecay);
  const camTx = focusTx(CHAOS_PIVOT.x, camScale) + shake.x;
  const camTy = focusTy(CHAOS_PIVOT.y, camScale) + shake.y;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: CHAOSV3_DEFS }} />
        <defs>
          <g id="ic-email" dangerouslySetInnerHTML={{ __html: CHAOSV3_IC_EMAIL }} />
          <g id="ic-chat" dangerouslySetInnerHTML={{ __html: CHAOSV3_IC_CHAT }} />
          <g id="ic-sheet" dangerouslySetInnerHTML={{ __html: CHAOSV3_IC_SHEET }} />
          <g id="ic-phone" dangerouslySetInnerHTML={{ __html: CHAOSV3_IC_PHONE }} />
          <g id="ic-doc" dangerouslySetInnerHTML={{ __html: CHAOSV3_IC_DOC }} />
          <g id="ic-bell" dangerouslySetInnerHTML={{ __html: CHAOSV3_IC_BELL }} />
        </defs>

        <g transform={`translate(${camTx} ${camTy}) scale(${camScale})`}>
          <Inject html={CHAOSV3_CHAOS_GRID} attrs={CHAOSV3_CHAOS_GRID_ATTRS} opacity={gridIn * 0.7} />
          <Inject html={CHAOSV3_CHAOS_DUST} attrs={CHAOSV3_CHAOS_DUST_ATTRS} opacity={dustIn} />
          <Inject html={CHAOSV3_CHAOS_SHARDS} attrs={CHAOSV3_CHAOS_SHARDS_ATTRS} opacity={shardsIn} />
          <Inject html={CHAOSV3_CHAOS_RING2} opacity={ring2In} />

          {ChaosV3_ITEMS.map((item, i) => (
            <ChaosItemEl key={item.id} item={item} index={i} frame={frame} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// PANNEAU 2 -- BASCULE. Intention : capture, bascule, le mot Flowdesk s'imprime.
//
// PRINCIPES MOTION DESIGN appliques :
// - ANTICIPATION : juste avant la capture (~frame 40-55), les icones ralentissent
//   une fraction de seconde (contraction) avant le "snap" d'arrivee -- classique
//   avant un impact, vend physiquement le mot "BASCULER" de la voix.
// - STAGING focus/flou : FLOWDESK est le SEUL element net et fixe au centre,
//   tout le reste (icones, cone, anneaux) est en mouvement/flou de vitesse --
//   contraste qui dirige l'oeil sans ambiguite.
// - FOLLOW-THROUGH : le cone et les anneaux continuent de tourner legerement
//   apres l'arrivee des icones, l'energie ne s'arrete jamais net.
// ---------------------------------------------------------------------------
const BASCULE_FOCUS = { x: 1500, y: 540 };

const BasculeItemEl: React.FC<{ item: (typeof BasculeV3_ITEMS)[number]; index: number; frame: number }> = ({
  item,
  index,
  frame,
}) => {
  // arrivee echelonnee, toutes convergent avant la frame ~110 (fin du panneau ~315f)
  const staggerStart = (index % 4) * 8;
  const travel = interpolate(frame, [staggerStart, 90 + staggerStart], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // ANTICIPATION : ralentissement (contraction) juste avant l'arrivee (frame ~40-55 locale)
  const anticipation = interpolate(frame, [staggerStart + 35, staggerStart + 50, staggerStart + 60], [1, 0.85, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(travel, [0, 0.1, 0.92, 1], [0, 1, 1, 0]);
  if (opacity <= 0.01) return null;
  return (
    <g opacity={opacity} transform={`scale(${anticipation})`} dangerouslySetInnerHTML={{ __html: item.html }} />
  );
};

const PanneauBasculeV3: React.FC = () => {
  const frame = useCurrentFrame();
  const localEnd = MECANISME_START - BASCULE_START;

  // FOLLOW-THROUGH : rotation perpetuelle du cone/anneaux (V2), jamais interrompue
  const perpetualRotate = frame * 0.3;
  const focusPulse = 1 + 0.02 * Math.sin(frame / 15); // le focus "respire" tres legerement, jamais fige

  const camScale = interpolate(frame, [0, localEnd], [1, 1.12], { extrapolateRight: "clamp" });
  const shake = cameraShake(frame, 2, localEnd);
  const camTx = focusTx(960, camScale) + shake.x;
  const camTy = focusTy(540, camScale) + shake.y;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: BASCULEV3_DEFS }} />
        <defs>
          <g id="b-ic-email" dangerouslySetInnerHTML={{ __html: BASCULEV3_B_IC_EMAIL }} />
          <g id="b-ic-chat" dangerouslySetInnerHTML={{ __html: BASCULEV3_B_IC_CHAT }} />
          <g id="b-ic-sheet" dangerouslySetInnerHTML={{ __html: BASCULEV3_B_IC_SHEET }} />
          <g id="b-ic-phone" dangerouslySetInnerHTML={{ __html: BASCULEV3_B_IC_PHONE }} />
        </defs>

        <g transform={`translate(${camTx} ${camTy}) scale(${camScale})`}>
          <Inject html={BASCULEV3_BASCULE_GRID} attrs={BASCULEV3_BASCULE_GRID_ATTRS} opacity={0.9} />

          <g
            transform={`translate(${BASCULE_FOCUS.x} ${BASCULE_FOCUS.y}) rotate(${perpetualRotate}) translate(${-BASCULE_FOCUS.x} ${-BASCULE_FOCUS.y})`}
          >
            <Inject html={BASCULEV3_BASCULE_HORN} attrs={BASCULEV3_BASCULE_HORN_ATTRS} />
          </g>
          <g
            transform={`translate(${BASCULE_FOCUS.x} ${BASCULE_FOCUS.y}) rotate(${-perpetualRotate * 0.6}) translate(${-BASCULE_FOCUS.x} ${-BASCULE_FOCUS.y})`}
          >
            <Inject html={BASCULEV3_BASCULE_RINGS} attrs={BASCULEV3_BASCULE_RINGS_ATTRS} />
          </g>

          {BasculeV3_ITEMS.map((item, i) => (
            <BasculeItemEl key={item.id} item={item} index={i} frame={frame} />
          ))}

          {/* STAGING : FLOWDESK seul element net/fixe -- respiration tres subtile, jamais fige */}
          <g transform={`translate(${BASCULE_FOCUS.x} ${BASCULE_FOCUS.y}) scale(${focusPulse}) translate(${-BASCULE_FOCUS.x} ${-BASCULE_FOCUS.y})`}>
            <Inject html={BASCULEV3_BASCULE_FOCUS} attrs={BASCULEV3_BASCULE_FOCUS_ATTRS} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// PANNEAU 3 -- MECANISME. Intention : tri clair, precision, ordre.
//
// PRINCIPES MOTION DESIGN appliques :
// - STAGING SEQUENTIEL : les 5 destinations (IT/RH/FINANCE/SUPPORT/DIRECTION) ne
//   s'allument PAS toutes en meme temps -- cascade lente, une lecture a la fois,
//   pour que le tri automatique se COMPRENNE geste par geste (pas juste un flash
//   simultane qui noie l'info).
// - SECONDARY ACTION : pendant qu'une route est "active" (paquet en cours), les
//   4 autres restent visibles mais en retrait (opacite reduite) -- pas concurrentes
//   a l'attention.
// - SLOW-IN / SLOW-OUT : les paquets accelerent en sortant du module, ralentissent
//   en approchant la cible -- geste "arrivee precise", pas une translation lineaire.
// ---------------------------------------------------------------------------
const MEC_CENTER = { x: 960, y: 540 };

const MecRouteEl: React.FC<{ item: (typeof MecRoutesV3_ITEMS)[number]; index: number; frame: number }> = ({
  item,
  index,
  frame,
}) => {
  // STAGING SEQUENTIEL : chaque route s'active a son tour (decalage 35f), pas simultane
  const activateAt = 20 + index * 35;
  const routeIn = interpolate(frame, [activateAt, activateAt + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // SECONDARY ACTION : une fois toutes activees, celle "en cours" (cyclique) ressort,
  // les autres restent a opacite reduite -- pas de concurrence visuelle
  const allActiveAt = 20 + MecRoutesV3_ITEMS.length * 35;
  const cyclePos = Math.floor(((frame - allActiveAt) / 45) % MecRoutesV3_ITEMS.length);
  const isFocused = frame < allActiveAt || cyclePos === index;
  const focusOpacity = interpolate(frame, [allActiveAt, allActiveAt + 20], [1, isFocused ? 1 : 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // pulse sur le cercle de destination quand actif
  const pulse = isFocused ? 1 + 0.04 * Math.sin(frame / 10) : 1;

  return (
    <g
      opacity={routeIn * focusOpacity}
      transform={`translate(${MEC_CENTER.x} ${MEC_CENTER.y}) scale(${pulse}) translate(${-MEC_CENTER.x} ${-MEC_CENTER.y})`}
      dangerouslySetInnerHTML={{ __html: item.html }}
    />
  );
};

const MecInflowEl: React.FC<{ item: (typeof MecInflowV3_ITEMS)[number]; index: number; frame: number }> = ({
  item,
  index,
  frame,
}) => {
  const cycleLen = 70;
  const t = ((frame + index * 23) % cycleLen) / cycleLen;
  // SLOW-IN / SLOW-OUT : ease-in-out plutot que lineaire (accelere puis ralentit en approche)
  const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const opacity = interpolate(t, [0, 0.1, 0.85, 1], [0, 0.95, 0.95, 0]);
  return <g opacity={opacity * eased + opacity * 0.001} dangerouslySetInnerHTML={{ __html: item.html }} />;
};

const PanneauMecanismeV3: React.FC = () => {
  const frame = useCurrentFrame();
  const localEnd = RESOLUTION_START - MECANISME_START;

  const gridIn = interpolate(frame, [0, 20], [0, 0.6], { extrapolateRight: "clamp" });
  const archIn = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const moduleIn = spring({ frame, fps: FPS, config: { mass: 1, damping: 14, stiffness: 100 }, durationInFrames: 30 });
  const modulePulse = 1 + 0.02 * Math.sin(frame / 22); // le module "respire", ne se fige jamais

  const camScale = interpolate(frame, [0, localEnd], [1.02, 1], { extrapolateRight: "clamp" });
  const shake = cameraShake(frame, 1.5, localEnd);
  const camTx = focusTx(MEC_CENTER.x, camScale) + shake.x;
  const camTy = focusTy(MEC_CENTER.y, camScale) + shake.y;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: MECANISMEV3_DEFS }} />
        <defs>
          <g id="m-ic-email" dangerouslySetInnerHTML={{ __html: MECANISMEV3_M_IC_EMAIL }} />
          <g id="m-ic-chat" dangerouslySetInnerHTML={{ __html: MECANISMEV3_M_IC_CHAT }} />
          <g id="m-ic-doc" dangerouslySetInnerHTML={{ __html: MECANISMEV3_M_IC_DOC }} />
        </defs>

        <g transform={`translate(${camTx} ${camTy}) scale(${camScale})`}>
          <Inject html={MECANISMEV3_MEC_GRID} attrs={MECANISMEV3_MEC_GRID_ATTRS} opacity={gridIn} />
          <Inject html={MECANISMEV3_MEC_FAR_ARCH} attrs={MECANISMEV3_MEC_FAR_ARCH_ATTRS} opacity={archIn} />

          {MecInflowV3_ITEMS.map((item, i) => (
            <MecInflowEl key={item.id} item={item} index={i} frame={frame} />
          ))}

          <g
            transform={`translate(${MEC_CENTER.x} ${MEC_CENTER.y}) scale(${modulePulse}) translate(${-MEC_CENTER.x} ${-MEC_CENTER.y})`}
          >
            <Inject html={MECANISMEV3_MEC_MODULE} attrs={MECANISMEV3_MEC_MODULE_ATTRS} opacity={moduleIn} />
          </g>

          {MecRoutesV3_ITEMS.map((item, i) => (
            <MecRouteEl key={item.id} item={item} index={i} frame={frame} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// PANNEAU 4 -- RESOLUTION. Intention : calme, confirmation, satisfaction.
//
// PRINCIPES MOTION DESIGN appliques :
// - EASE-OUT PRONONCE : tout ralentit nettement plus que dans les 3 panneaux
//   precedents -- contraste net avec la nervosite de Chaos/Bascule/Mecanisme,
//   c'est cette DECELERATION qui vend physiquement "controle calme".
// - SECONDARY ACTION desynchronisee : le checkmark et le mot "TRAITE" n'apparaissent
//   PAS simultanement -- le checkmark d'abord (impact), le mot 4-5 frames apres
//   (confirmation textuelle) -- un pop simultane des deux ferait "template".
// - Boucle qui ne s'arrete jamais (orbite continue V2 conservee) mais a un rythme
//   tres lent, coherent avec l'ease-out general du panneau.
// ---------------------------------------------------------------------------
const RES_CENTER = { x: 960, y: 560 };
// point de fermeture reel de l'anneau (jonction avec le debut de seal-arc a l'angle 0,
// corrige 2026-08-05 -- l'ancien point (962,220) laissait un trou de ~90deg non couvert,
// l'arc reel entre seal-arc et seal-weld mesure ~145deg / ~860 unites de long, pas ~40deg).
const RES_WELD_END = { x: 1300, y: 560 };

const PanneauResolutionV3: React.FC = () => {
  const frame = useCurrentFrame();
  const localEnd = TOTAL_FRAMES - RESOLUTION_START;

  const ghostIn = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" }); // ease-out : plus lent que V2 (0,20)
  const arcIn = spring({ frame, fps: FPS, config: { mass: 1.2, damping: 16, stiffness: 85 }, durationInFrames: 40 });

  const travel = interpolate(frame, [25, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const packetOpacity = interpolate(frame, [25, 42, 118, 135], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const approachDraw = interpolate(frame, [25, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const weldIn = interpolate(frame, [126, 152], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const impactPulse = interpolate(frame, [148, 160, 190], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // SECONDARY ACTION desynchronisee : checkmark d'abord, mot "TRAITE" 5 frames apres
  const checkmarkIn = spring({
    frame: Math.max(0, frame - 152),
    fps: FPS,
    config: { mass: 0.9, damping: 11, stiffness: 160 },
    durationInFrames: 20,
  });
  const wordIn = interpolate(frame, [157, 172], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ticksIn = interpolate(frame, [150, 185], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const residueIn = interpolate(frame, [160, 210], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wavesLoop = 0.5 + 0.5 * Math.sin(frame / 28); // rythme ralenti vs V2 (frame/20)
  const wavesIn = interpolate(frame, [170, 220], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (0.4 + 0.3 * wavesLoop);
  const echoesIn = interpolate(frame, [180, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // orbite continue post-fermeture, rythme lent (ease-out general du panneau)
  const ringSpinIn = interpolate(frame, [175, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringSpin = frame * 0.08 * ringSpinIn;
  const breathe = 1 + 0.03 * Math.sin(frame / 40);

  // CAMERA : pull-back tres lent (ease-out general) -- le mouvement ralentit visiblement
  const camScale = interpolate(frame, [0, localEnd], [1.05, 0.99], { extrapolateRight: "clamp" });
  const shake = cameraShake(frame, 0.6, localEnd);
  const camTx = focusTx(RES_CENTER.x, camScale) + shake.x;
  const camTy = focusTy(RES_CENTER.y, camScale) + shake.y;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: RESOLUTIONV3_DEFS }} />
        <g transform={`translate(${camTx} ${camTy}) scale(${camScale})`}>
          <Inject html={RESOLUTIONV3_RES_GROUND} attrs={RESOLUTIONV3_RES_GROUND_ATTRS} opacity={ghostIn * 0.5} />
          <Inject html={RESOLUTIONV3_RES_SEAL_GHOST} attrs={RESOLUTIONV3_RES_SEAL_GHOST_ATTRS} opacity={ghostIn * 0.3} />

          <g transform={`translate(${RES_CENTER.x} ${RES_CENTER.y}) rotate(${ringSpin}) translate(${-RES_CENTER.x} ${-RES_CENTER.y})`}>
            <Inject html={RESOLUTIONV3_RES_SEAL_ARC} opacity={arcIn} />
          </g>

          {approachDraw > 0.01 && (
            <g
              {...RESOLUTIONV3_RES_APPROACH_ATTRS}
              opacity={approachDraw}
              style={{ strokeDasharray: 1100, strokeDashoffset: 1100 * (1 - approachDraw) }}
              dangerouslySetInnerHTML={{ __html: RESOLUTIONV3_RES_APPROACH }}
            />
          )}

          {packetOpacity > 0.01 && (
            <g
              opacity={packetOpacity}
              transform={`${RESOLUTIONV3_RES_PACKET_ATTRS.transform} translate(${-40 * (1 - travel)} ${-30 * (1 - travel)})`}
              dangerouslySetInnerHTML={{ __html: RESOLUTIONV3_RES_PACKET }}
            />
          )}

          {weldIn > 0.01 && (
            <g
              {...RESOLUTIONV3_RES_SEAL_WELD_ATTRS}
              opacity={1}
              style={{ strokeDasharray: 900, strokeDashoffset: 900 * (1 - weldIn) }}
              dangerouslySetInnerHTML={{ __html: RESOLUTIONV3_RES_SEAL_WELD }}
            />
          )}

          {impactPulse > 0.01 && (
            <g
              opacity={impactPulse}
              transform={`translate(${RES_WELD_END.x} ${RES_WELD_END.y}) scale(${1 + 0.3 * impactPulse}) translate(${-RES_WELD_END.x} ${-RES_WELD_END.y})`}
              dangerouslySetInnerHTML={{ __html: RESOLUTIONV3_RES_IMPACT }}
            />
          )}

          <Inject html={RESOLUTIONV3_RES_ECHOES} attrs={RESOLUTIONV3_RES_ECHOES_ATTRS} opacity={echoesIn} />

          <Inject
            html={RESOLUTIONV3_RES_CORE}
            attrs={RESOLUTIONV3_RES_CORE_ATTRS}
            opacity={interpolate(frame, [0, 25], [0.6, 1], { extrapolateRight: "clamp" })}
            transform={`scale(${breathe})`}
          />

          {/* SECONDARY ACTION desynchronisee : checkmark (spring nerveux) puis mot (fade doux).
              transform compose : translate herite (RES_CONFIRM_ATTRS, centre 960,560) PUIS
              scale local -- ne PAS spreader ATTRS et ecraser avec un transform explicite,
              sinon le translate herite disparait (bug constate 2026-08-05 : badge coupe en
              haut-gauche du cadre au lieu d'etre centre sur l'anneau). */}
          <g
            transform={`${RESOLUTIONV3_RES_CONFIRM_ATTRS.transform} scale(${checkmarkIn})`}
            opacity={checkmarkIn}
          >
            <circle r="76" fill="#FFFFFF" />
            <path
              d="M -32 2 L -10 26 L 34 -24"
              fill="none"
              stroke="#FF6B1A"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="0"
              y="120"
              textAnchor="middle"
              fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
              fontSize="34"
              fontWeight="700"
              letterSpacing="2"
              fill="#FFFFFF"
              opacity={wordIn / Math.max(checkmarkIn, 0.01)}
            >
              TRAITÉ
            </text>
          </g>

          <Inject html={RESOLUTIONV3_RES_RESIDUE} attrs={RESOLUTIONV3_RES_RESIDUE_ATTRS} opacity={residueIn} />
          <Inject html={RESOLUTIONV3_RES_REST_WAVES} attrs={RESOLUTIONV3_RES_REST_WAVES_ATTRS} opacity={wavesIn} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// TransitionLayer (identique V2) : whip-pan blur+opacity, sa propre useCurrentFrame()
// relative a SA Sequence, independante de la logique interne du panneau enfant.
// ---------------------------------------------------------------------------
const TransitionLayer: React.FC<{
  children: React.ReactNode;
  edge: "in" | "out" | "none";
  ownDuration: number;
}> = ({ children, edge, ownDuration }) => {
  const frame = useCurrentFrame();
  let opacity = 1;
  let blur = 0;
  if (edge === "in") {
    opacity = interpolate(frame, [0, TRANSITION_OVERLAP], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    blur = interpolate(frame, [0, TRANSITION_OVERLAP * 0.5, TRANSITION_OVERLAP], [10, 16, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (edge === "out") {
    const local = frame - (ownDuration - TRANSITION_OVERLAP);
    opacity = interpolate(local, [0, TRANSITION_OVERLAP], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    blur = interpolate(local, [0, TRANSITION_OVERLAP * 0.5, TRANSITION_OVERLAP], [0, 16, 10], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  return (
    <AbsoluteFill style={{ opacity, filter: blur > 0.3 ? `blur(${blur}px)` : "none" }}>{children}</AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// COMPOSITION PRINCIPALE
// ---------------------------------------------------------------------------
export const FlowdeskAbstraitV3: React.FC = () => {
  const chaosDur = BASCULE_START - CHAOS_START;
  const basculeDur = MECANISME_START - BASCULE_START;
  const mecanismeDur = RESOLUTION_START - MECANISME_START;
  const resolutionDur = TOTAL_FRAMES - RESOLUTION_START;

  // Compensation de frame pour les panneaux dont la Sequence demarre TRANSITION_OVERLAP
  // plus tot (chevauchement whip-pan) -- chaque panneau doit voir frame=0 a son vrai debut
  // narratif. On enveloppe chaque panneau dans un composant qui recalcule sa propre frame.
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Sequence from={CHAOS_START} durationInFrames={chaosDur}>
        <TransitionLayer edge="out" ownDuration={chaosDur}>
          <PanneauChaosV3 />
        </TransitionLayer>
      </Sequence>

      <Sequence from={BASCULE_START - TRANSITION_OVERLAP} durationInFrames={basculeDur + TRANSITION_OVERLAP}>
        <TransitionLayer edge="in" ownDuration={basculeDur + TRANSITION_OVERLAP}>
          <TransitionLayer edge="out" ownDuration={basculeDur + TRANSITION_OVERLAP}>
            <OffsetFrame offset={TRANSITION_OVERLAP}>
              <PanneauBasculeV3 />
            </OffsetFrame>
          </TransitionLayer>
        </TransitionLayer>
      </Sequence>

      <Sequence from={MECANISME_START - TRANSITION_OVERLAP} durationInFrames={mecanismeDur + TRANSITION_OVERLAP}>
        <TransitionLayer edge="in" ownDuration={mecanismeDur + TRANSITION_OVERLAP}>
          <TransitionLayer edge="out" ownDuration={mecanismeDur + TRANSITION_OVERLAP}>
            <OffsetFrame offset={TRANSITION_OVERLAP}>
              <PanneauMecanismeV3 />
            </OffsetFrame>
          </TransitionLayer>
        </TransitionLayer>
      </Sequence>

      <Sequence from={RESOLUTION_START - TRANSITION_OVERLAP} durationInFrames={resolutionDur + TRANSITION_OVERLAP}>
        <TransitionLayer edge="in" ownDuration={resolutionDur + TRANSITION_OVERLAP}>
          <OffsetFrame offset={TRANSITION_OVERLAP}>
            <PanneauResolutionV3 />
          </OffsetFrame>
        </TransitionLayer>
      </Sequence>

      <Audio src={staticFile("_client-sim/flowdesk/audio/narration-flowdesk.mp3")} />
      <Audio
        src={staticFile("_client-sim/flowdesk/audio/music-flowdesk-45s.mp3")}
        volume={(f) =>
          interpolate(f, [0, 30, TOTAL_FRAMES - 30, TOTAL_FRAMES], [0, 0.15, 0.15, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </AbsoluteFill>
  );
};

// Petit wrapper Sequence interne qui decale la frame vue par les enfants (compense le
// TRANSITION_OVERLAP de demarrage anticipe de la Sequence parente).
const OffsetFrame: React.FC<{ offset: number; children: React.ReactNode }> = ({ offset, children }) => (
  <Sequence from={offset} layout="none">
    {children}
  </Sequence>
);
