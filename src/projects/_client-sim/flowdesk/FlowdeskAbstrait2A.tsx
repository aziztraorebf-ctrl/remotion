import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { focusTx, focusTy, cameraShake, elementDrift } from "./camera";
import {
  CHAOS_DEFS,
  CHAOS_F5_PERSPECTIVE_GRID,
  CHAOS_F5_PERSPECTIVE_GRID_ATTRS,
  CHAOS_F5_DUST,
  CHAOS_GS_PACKETW,
  CHAOS_GS_PACKETO,
  CHAOS_GS_DARTW,
  CHAOS_GS_DARTO,
  CHAOS_GS_DIAMONDW,
  CHAOS_GS_DIAMONDO,
  CHAOS_GPT56SOL_RIGHT,
  CHAOS_GPT56SOL_RIGHT_ATTRS,
} from "./groups/chaosGroups";
import { CHAOS_BG_ELLIPSE, CHAOS_FOREGROUND, CHAOS_SHARDS } from "./groups/chaosShards";
import { BASCULE_DEFS, BASCULE_FULL, BASCULE_BG } from "./groups/basculeGroups";
import {
  MECANISME_DEFS,
  MECANISME_BG,
  MECANISME_VIGNETTE,
  MECANISME_PERSPECTIVE_GRID,
  MECANISME_PERSPECTIVE_GRID_ATTRS,
  MECANISME_FAR_ARCHITECTURE,
  MECANISME_FAR_ARCHITECTURE_ATTRS,
  MECANISME_GHOST_RAILS,
  MECANISME_GHOST_RAILS_ATTRS,
  MECANISME_SECONDARY_BANK,
  MECANISME_SECONDARY_BANK_ATTRS,
  MECANISME_DUST,
  MECANISME_INFLOW,
  MECANISME_GATE,
  MECANISME_ROUTES_BACK,
  MECANISME_ROUTES_BACK_ATTRS,
  MECANISME_ROUTES,
  MECANISME_TERMINALS,
  MECANISME_FOREGROUND_STREAKS,
  MECANISME_FOREGROUND_STREAKS_ATTRS,
} from "./groups/mecanismeGroups";
import {
  RESOLUTION_DEFS,
  RESOLUTION_BG,
  RESOLUTION_VIGNETTE,
  RESOLUTION_REST_WAVES,
  RESOLUTION_REST_WAVES_ATTRS,
  RESOLUTION_GROUND,
  RESOLUTION_GROUND_ATTRS,
  RESOLUTION_SEAL_GHOST,
  RESOLUTION_SEAL_GHOST_ATTRS,
  RESOLUTION_SEAL_ARC,
  RESOLUTION_SEAL_ARC_ATTRS,
  RESOLUTION_SEAL_TICKS,
  RESOLUTION_SEAL_TICKS_ATTRS,
  RESOLUTION_SEAL_WELD,
  RESOLUTION_SEAL_WELD_ATTRS,
  RESOLUTION_APPROACH,
  RESOLUTION_APPROACH_ATTRS,
  RESOLUTION_PACKET,
  RESOLUTION_IMPACT,
  RESOLUTION_CORE,
  RESOLUTION_CORE_ATTRS,
  RESOLUTION_RESIDUE,
} from "./groups/resolutionGroups";

// ---------------------------------------------------------------------------
// Registre ABSTRAIT (Volet 2A) -- 4 panneaux Fable5 statiques, animes en JSX.
// Doctrine SVG-SCENES-GENERATIVES : matiere LLM figee dans groups/*.ts, vie = code.
// Timing calé sur forced-alignment de narration-flowdesk.mp3 (frame 1444 = fin VO).
// ---------------------------------------------------------------------------

const FPS = 30;
export const FLOWDESK_ABSTRAIT_FPS = FPS;

const CHAOS_START = 0;
const BASCULE_START = 495;
const MECANISME_START = 810;
const RESOLUTION_START = 1105;
const TOTAL_FRAMES = 1474; // fin VO (1444) + marge 30f pour fade musique

// Fenetre de chevauchement aux 3 transitions -- whip pan avec blur CSS (pattern valide
// ProtoAtlasMondeCameraTest.tsx, doctrine Souverain §3.4). Chaque panneau ENTRANT demarre
// TRANSITION_OVERLAP frames avant la fin du panneau precedent (Sequence etendue), les deux
// sont visibles simultanement pendant la fenetre -- le blur au pic masque le cut, jamais de
// fondu simple (consensus des 3 modeles : "zero fondu, transition = mouvement").
const TRANSITION_OVERLAP = 35;

export const FLOWDESK_ABSTRAIT_FRAMES = TOTAL_FRAMES;

const W = 1920;
const H = 1080;
const BG = "#0B1F3A";

// attrs = attributs herites de la balise <g id=...> SOURCE (fill/stroke/filter/transform...),
// captures par extract-svg-groups.py. Sans eux, un enfant "stroke only" retombe sur le fill
// noir par defaut SVG (bug constate 2026-08-05, panneau resolution). Le transform local
// (anime, passe en prop) se compose APRES le transform herite s'il y en a un.
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
// PANNEAU 1 -- CHAOS. V2 (2026-08-05, brief mouvement 3 modeles). Fond 1920x1080
// deja plein cadre (mix Fable5+GPT56Sol). Geste : HOOK explosif f0-90 (les 80
// shards partent compactes au centre puis explosent en tempete), puis chaque
// shard vit sa PROPRE derive continue (rotation+flottement individuels, jamais
// synchronises) jusqu'a la transition -- parallaxe far/mid native au SVG source.
// Camera : push-in leger continu + shake permanent qui s'attenue vers la fin
// (tension qui redescend juste avant de basculer).
// ---------------------------------------------------------------------------
const CHAOS_PIVOT = { x: 460, y: 520 }; // centre du nuage de shards (cf ellipse de fond f5-chaos)

const ChaosShardEl: React.FC<{ shard: (typeof CHAOS_SHARDS)[number]; index: number; frame: number }> = ({
  shard,
  index,
  frame,
}) => {
  // HOOK explosif f0-90 : le shard part COMPACTE au pivot (scale 0.05, sur place) puis
  // explose vers sa position finale (spring nerveux, stiffness haute = impact sec).
  const explode = spring({
    frame,
    fps: FPS,
    config: { mass: 0.8, damping: 11, stiffness: 140 },
    durationInFrames: 55,
  });
  const posX = CHAOS_PIVOT.x + (shard.tx - CHAOS_PIVOT.x) * explode;
  const posY = CHAOS_PIVOT.y + (shard.ty - CHAOS_PIVOT.y) * explode;
  const explodeScale = 0.05 + 0.95 * explode;

  // derive individuelle continue APRES l'explosion -- rotation propre + micro-flottement,
  // jamais synchronisee entre shards (seed = index).
  const drift = elementDrift(frame, index);
  const driftAmount = interpolate(frame, [50, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const depthFactor = shard.depth === "far" ? 0.5 : 1; // couches far bougent moins (parallaxe)
  const fx = posX + drift.floatX * driftAmount * depthFactor;
  const fy = posY + drift.floatY * driftAmount * depthFactor;
  const rot = shard.rot + drift.rotate * driftAmount * depthFactor;

  return (
    <g
      opacity={shard.depth === "far" ? 0.3 : 0.6}
      transform={`translate(${fx} ${fy}) rotate(${rot}) scale(${explodeScale})`}
      dangerouslySetInnerHTML={{ __html: shard.content }}
    />
  );
};

const PanneauChaos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const dustIn = interpolate(frame, [5, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const foregroundIn = spring({ frame, fps, config: { mass: 1, damping: 14, stiffness: 90 }, durationInFrames: 40 });
  const rightHubIn = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { mass: 1, damping: 13, stiffness: 100 },
    durationInFrames: 40,
  });

  // CAMERA : push-in continu (1 -> 1.08) + shake permanent qui s'attenue en fin de panneau.
  const localEnd = BASCULE_START - CHAOS_START;
  const camScale = interpolate(frame, [0, localEnd], [1, 1.08], { extrapolateRight: "clamp" });
  const shakeDecay = interpolate(frame, [localEnd - 90, localEnd], [1, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = cameraShake(frame, 4 * shakeDecay, localEnd);
  const camTx = focusTx(960, camScale) + shake.x;
  const camTy = focusTy(540, camScale) + shake.y;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: CHAOS_DEFS }} />
        {/* symboles gs-* declares en <defs> AVEC leur id d'origine -- servent UNIQUEMENT de
            templates <use> consommes par CHAOS_GPT56SOL_RIGHT (moitie droite) ; jamais dessines
            seuls dans le SVG source (verifie : zero <use> dans f5-chaos, la moitie gauche). */}
        <defs>
          <g id="gs-packetW" dangerouslySetInnerHTML={{ __html: CHAOS_GS_PACKETW }} />
          <g id="gs-packetO" dangerouslySetInnerHTML={{ __html: CHAOS_GS_PACKETO }} />
          <g id="gs-dartW" dangerouslySetInnerHTML={{ __html: CHAOS_GS_DARTW }} />
          <g id="gs-dartO" dangerouslySetInnerHTML={{ __html: CHAOS_GS_DARTO }} />
          <g id="gs-diamondW" dangerouslySetInnerHTML={{ __html: CHAOS_GS_DIAMONDW }} />
          <g id="gs-diamondO" dangerouslySetInnerHTML={{ __html: CHAOS_GS_DIAMONDO }} />
        </defs>

        <g transform={`translate(${camTx} ${camTy}) scale(${camScale})`}>
          <Inject html={CHAOS_F5_PERSPECTIVE_GRID} attrs={CHAOS_F5_PERSPECTIVE_GRID_ATTRS} opacity={gridIn * 0.5} />
          <Inject html={CHAOS_F5_DUST} opacity={dustIn} />
          <Inject html={CHAOS_BG_ELLIPSE} />

          {/* 80 shards individuels : explosion f0-55 puis derive propre continue */}
          {CHAOS_SHARDS.map((shard, i) => (
            <ChaosShardEl key={i} shard={shard} index={i} frame={frame} />
          ))}

          <Inject html={CHAOS_FOREGROUND} opacity={foregroundIn} />

          {/* moitie droite GPT-5.6Sol : hub + rayons, consomme les <use href="#gs-*"> definis
              ci-dessus en <defs> -- pas de rendu direct des symboles gs-* (ils ne servent QUE
              de templates <use>, jamais dessines seuls -- verifie dans le SVG source). */}
          <Inject html={CHAOS_GPT56SOL_RIGHT} attrs={CHAOS_GPT56SOL_RIGHT_ATTRS} opacity={rightHubIn} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// PANNEAU 2 -- BASCULE. V2 (2026-08-05). SVG source 960x524 -- centre a
// l'echelle native dans le cadre 1920x1080, fond BG comble l'espace (decision
// Aziz). Geste : le flux de convergence tourne EN PERMANENCE sur son pivot
// (rotation lente jamais interrompue -- "turbine"/"trou noir" propose par les
// 3 modeles), + particules additionnelles qui VOYAGENT visiblement le long
// des lignes de convergence (superposees, independantes du bloc statique).
// Camera : travelling zoom continu + shake, jamais figee.
// ---------------------------------------------------------------------------
const SRC_BASCULE_W = 960;
const SRC_BASCULE_H = 524;
// pivot de rotation herite du SVG source (transform="rotate(-10 742 246)" sur le cone) --
// c'est le centre naturel du flux, on tourne autour de ce meme point.
const BASCULE_PIVOT = { x: 742, y: 246 };

// particules additionnelles qui voyagent le long de trajectoires de convergence vers le pivot
// (independantes du bloc BASCULE_FULL statique -- renforce la sensation de flux REEL, pas juste
// un bloc qui tourne). Positions de depart reparties en arc a gauche du pivot.
const BASCULE_TRAVEL_PARTICLES = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 0.9 - Math.PI * 0.45; // eventail vers la gauche
  const startDist = 480 + (i % 4) * 60;
  return {
    startX: BASCULE_PIVOT.x + Math.cos(Math.PI - angle) * startDist,
    startY: BASCULE_PIVOT.y + Math.sin(angle) * startDist * 0.55,
    phase: (i * 37) % 100, // decale chaque particule dans son cycle
    color: i % 2 === 0 ? "#FFFFFF" : "#FF6B1A",
  };
});

const BasculeTravelParticle: React.FC<{
  p: (typeof BASCULE_TRAVEL_PARTICLES)[number];
  frame: number;
}> = ({ p, frame }) => {
  const cycleLen = 70;
  const t = ((frame + p.phase) % cycleLen) / cycleLen; // 0 -> 1 boucle continue
  // accelere en approchant le pivot (ease-in) -- sensation d'aspiration
  const eased = t * t;
  const x = p.startX + (BASCULE_PIVOT.x - p.startX) * eased;
  const y = p.startY + (BASCULE_PIVOT.y - p.startY) * eased;
  const opacity = interpolate(t, [0, 0.15, 0.85, 1], [0, 0.9, 0.9, 0]);
  const r = 2.5 + (1 - t) * 1.5; // retrecit en approchant (perspective)
  return <circle cx={x} cy={y} r={r} fill={p.color} opacity={opacity} />;
};

const PanneauBascule: React.FC = () => {
  // sa Sequence demarre TRANSITION_OVERLAP frames avant le debut narratif "officiel" (chevauchement
  // whip-pan avec Chaos) -- on compense pour que frame=0 reste le vrai debut de Bascule, jamais negatif.
  const frame = Math.max(0, useCurrentFrame() - TRANSITION_OVERLAP);
  const { fps } = useVideoConfig();

  const hornIn = spring({ frame, fps, config: { mass: 1, damping: 15, stiffness: 80 }, durationInFrames: 45 });
  const localEnd = MECANISME_START - BASCULE_START;

  // rotation perpetuelle du flux entier sur son pivot -- jamais interrompue (0.35deg/frame)
  const perpetualRotate = frame * 0.35;

  // camera : travelling zoom continu 1 -> 1.18 sur toute la duree + shake permanent
  const camScale = interpolate(frame, [0, localEnd], [1, 1.18], { extrapolateRight: "clamp" });
  const shake = cameraShake(frame, 2.5, localEnd);

  const scale = 1.55; // echelle native -> occupe une bonne portion du cadre sans deformation
  const offsetX = (W - SRC_BASCULE_W * scale) / 2;
  const offsetY = (H - SRC_BASCULE_H * scale) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: BASCULE_DEFS }} />
        <g
          transform={`translate(${offsetX + shake.x} ${offsetY + shake.y}) translate(${BASCULE_PIVOT.x * scale} ${BASCULE_PIVOT.y * scale}) scale(${camScale}) translate(${-BASCULE_PIVOT.x * scale} ${-BASCULE_PIVOT.y * scale}) scale(${scale})`}
        >
          <Inject html={BASCULE_BG} />
          <g
            transform={`translate(${BASCULE_PIVOT.x} ${BASCULE_PIVOT.y}) rotate(${perpetualRotate}) translate(${-BASCULE_PIVOT.x} ${-BASCULE_PIVOT.y})`}
          >
            <Inject html={BASCULE_FULL} opacity={hornIn} />
          </g>
          {/* particules voyageuses superposees -- flux visible en mouvement continu */}
          {BASCULE_TRAVEL_PARTICLES.map((p, i) => (
            <BasculeTravelParticle key={i} p={p} frame={frame} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// PANNEAU 3 -- MECANISME. V2 (2026-08-05). SVG source 960x1080 (demi-largeur).
// Consensus fort des 3 modeles sur le vide gauche : PAS de recadrage statique --
// la camera demarre resserree a DROITE (cache le vide), puis PAN continu vers
// la gauche qui revele tout le systeme (traversee, pas une image fixe). En plus,
// un flux de particules ORANGE entre depuis hors-cadre gauche (x<0) vers la
// boite de tri en continu -- occupe l'espace ET raconte "les donnees arrivent".
// Cascade sequentielle des 5 aiguillages + pulsations continues sur boite/cibles.
// ---------------------------------------------------------------------------
const SRC_MECANISME_W = 960;
const SRC_MECANISME_H = 1080;
const MECANISME_GATE_CENTER = { x: 330, y: 392 }; // cf ellipse glow du groupe "gate"

// particules qui arrivent depuis hors-cadre gauche vers la boite de tri, en continu
const MECANISME_INCOMING = Array.from({ length: 10 }, (_, i) => ({
  y: 180 + (i * 720) / 10 + (i % 3) * 15,
  phase: (i * 43) % 90,
  speed: 0.9 + (i % 3) * 0.2,
}));

const MecanismeIncomingParticle: React.FC<{
  p: (typeof MECANISME_INCOMING)[number];
  frame: number;
}> = ({ p, frame }) => {
  const cycleLen = 90 / p.speed;
  const t = ((frame + p.phase) % cycleLen) / cycleLen;
  const startX = -120;
  const x = startX + (MECANISME_GATE_CENTER.x - startX) * t;
  const y = p.y + (MECANISME_GATE_CENTER.y - p.y) * (t * 0.7); // convergent legerement vers la porte
  const opacity = interpolate(t, [0, 0.1, 0.85, 1], [0, 0.85, 0.85, 0]);
  return <circle cx={x} cy={y} r={3.5} fill="#FF6B1A" opacity={opacity} />;
};

const PanneauMecanisme: React.FC = () => {
  // sa Sequence demarre TRANSITION_OVERLAP frames avant le debut narratif "officiel" (chevauchement
  // whip-pan avec Bascule) -- on compense pour que frame=0 reste le vrai debut de Mecanisme.
  const frame = Math.max(0, useCurrentFrame() - TRANSITION_OVERLAP);
  const { fps } = useVideoConfig();
  const localEnd = RESOLUTION_START - MECANISME_START;

  const gridIn = interpolate(frame, [0, 20], [0, 0.5], { extrapolateRight: "clamp" });
  const architectureIn = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const inflowIn = spring({ frame, fps, config: { mass: 1, damping: 14, stiffness: 100 }, durationInFrames: 30 });
  const gateIn = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { mass: 1, damping: 13, stiffness: 110 },
    durationInFrames: 25,
  });
  const routesIn = interpolate(frame, [35, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const terminalsIn = spring({
    frame: Math.max(0, frame - 60),
    fps,
    config: { mass: 1, damping: 14, stiffness: 95 },
    durationInFrames: 30,
  });
  const streaksIn = interpolate(frame, [70, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // pulsation continue de la porte (jamais figee une fois apparue)
  const gatePulse = 1 + 0.03 * Math.sin(frame / 18);

  const scale = 1.0;
  const offsetX = W - SRC_MECANISME_W * scale;
  const offsetY = (H - SRC_MECANISME_H * scale) / 2;

  // CAMERA : demarre resserree sur la porte (cache le vide gauche), PAN continu vers la
  // gauche pour reveler tout le systeme -- traversee, pas une image fixe.
  const panProgress = interpolate(frame, [0, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const camScaleStart = 1.35;
  const camScaleEnd = 1.0;
  const camScale = interpolate(panProgress, [0, 1], [camScaleStart, camScaleEnd]);
  // point focal en espace SOURCE (avant offset/scale panneau) : porte -> centre du cadre
  const focalXSrc = interpolate(panProgress, [0, 1], [MECANISME_GATE_CENTER.x, SRC_MECANISME_W / 2 - 150]);
  const focalYSrc = MECANISME_GATE_CENTER.y;
  // conversion en espace ecran (apres offset/scale panneau) pour recentrer via focusTx/focusTy
  const focalXScreen = offsetX + focalXSrc * scale;
  const focalYScreen = offsetY + focalYSrc * scale;
  const shake = cameraShake(frame, 1.8, localEnd);
  const camTx = focusTx(focalXScreen, camScale) + shake.x;
  const camTy = focusTy(focalYScreen, camScale) + shake.y;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: MECANISME_DEFS }} />
        <g transform={`translate(${camTx} ${camTy}) scale(${camScale})`}>
          <g transform={`translate(${offsetX} ${offsetY}) scale(${scale})`}>
            <Inject html={MECANISME_BG} />
            <Inject html={MECANISME_PERSPECTIVE_GRID} attrs={MECANISME_PERSPECTIVE_GRID_ATTRS} opacity={gridIn} />
            <Inject html={MECANISME_FAR_ARCHITECTURE} attrs={MECANISME_FAR_ARCHITECTURE_ATTRS} opacity={architectureIn * 0.6} />
            <Inject html={MECANISME_GHOST_RAILS} attrs={MECANISME_GHOST_RAILS_ATTRS} opacity={routesIn * 0.4} />
            <Inject html={MECANISME_SECONDARY_BANK} attrs={MECANISME_SECONDARY_BANK_ATTRS} opacity={architectureIn * 0.5} />
            <Inject html={MECANISME_DUST} opacity={architectureIn} />

            {/* flux entrant hors-cadre gauche -- occupe le vide + raconte l'arrivee des donnees */}
            {MECANISME_INCOMING.map((p, i) => (
              <MecanismeIncomingParticle key={i} p={p} frame={frame} />
            ))}

            <Inject html={MECANISME_INFLOW} opacity={inflowIn} />
            <Inject
              html={MECANISME_GATE}
              opacity={gateIn}
              transform={`translate(${MECANISME_GATE_CENTER.x} ${MECANISME_GATE_CENTER.y}) scale(${gatePulse}) translate(${-MECANISME_GATE_CENTER.x} ${-MECANISME_GATE_CENTER.y})`}
            />
            <Inject html={MECANISME_ROUTES_BACK} attrs={MECANISME_ROUTES_BACK_ATTRS} opacity={routesIn * 0.5} />
            <Inject html={MECANISME_ROUTES} opacity={routesIn} />
            <Inject html={MECANISME_TERMINALS} opacity={terminalsIn} />
            <Inject html={MECANISME_FOREGROUND_STREAKS} attrs={MECANISME_FOREGROUND_STREAKS_ATTRS} opacity={streaksIn} />
            <Inject html={MECANISME_VIGNETTE} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// PANNEAU 4 -- RESOLUTION. V2 (2026-08-05). SVG source 960x1080, centre dans
// le cadre. Geste narratif inchange (paquet VOYAGE -> soudure se trace ->
// flash) + APRES la fermeture (frame 160+), la boucle ne s'arrete jamais :
// rotation lente perpetuelle de l'anneau, respiration du centre lumineux,
// petit point qui orbite sur l'anneau. Camera : pull-back lent continu
// (recul progressif) -- coherent avec la decrescendo narrative de fin.
// ---------------------------------------------------------------------------
const SRC_RESOLUTION_W = 960;
const SRC_RESOLUTION_H = 1080;
const RESOLUTION_RING_CENTER = { x: 560, y: 672 }; // cf seal-arc/core cx/cy

const PanneauResolution: React.FC = () => {
  // sa Sequence demarre TRANSITION_OVERLAP frames avant le debut narratif "officiel" (chevauchement
  // whip-pan avec Mecanisme) -- on compense pour que frame=0 reste le vrai debut de Resolution.
  const frame = Math.max(0, useCurrentFrame() - TRANSITION_OVERLAP);
  const { fps } = useVideoConfig();
  const localEnd = TOTAL_FRAMES - RESOLUTION_START;

  const ghostIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const arcIn = spring({ frame, fps, config: { mass: 1, damping: 14, stiffness: 100 }, durationInFrames: 30 });

  // le paquet voyage le long de sa trajectoire (approach) entre frame 20 et 110
  const travel = interpolate(frame, [20, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const packetOpacity = interpolate(frame, [20, 35, 100, 115], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // approche du paquet dessinee au fur et a mesure (trace de trajectoire)
  const approachDraw = interpolate(frame, [20, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // la soudure se scelle juste apres l'arrivee du paquet (110-130)
  const weldIn = interpolate(frame, [108, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // flash au moment exact de la fermeture
  const impactPulse = interpolate(frame, [125, 135, 160], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ticksIn = interpolate(frame, [130, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const residueIn = interpolate(frame, [140, 180], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wavesLoop = 0.5 + 0.5 * Math.sin(frame / 20);
  const wavesIn = interpolate(frame, [150, 190], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (0.4 + 0.3 * wavesLoop);

  // APRES fermeture (frame 160+) : la boucle vit -- rotation lente perpetuelle de l'anneau,
  // respiration du centre (jamais figee, meme au tout dernier frame).
  const ringSpinIn = interpolate(frame, [155, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringSpin = frame * 0.12 * ringSpinIn;
  const breathe = 1 + 0.04 * Math.sin(frame / 35);
  // petit point qui orbite en continu sur l'anneau (r=192, cf seal-arc)
  const orbitAngle = (frame * 0.55 * ringSpinIn * Math.PI) / 180;
  const orbitR = 192;
  const orbitX = RESOLUTION_RING_CENTER.x + Math.cos(orbitAngle) * orbitR;
  const orbitY = RESOLUTION_RING_CENTER.y + Math.sin(orbitAngle) * orbitR;
  const orbitOpacity = ringSpinIn * (0.6 + 0.4 * Math.sin(frame / 12));

  const scale = 1.0;
  const offsetX = (W - SRC_RESOLUTION_W * scale) / 2;
  const offsetY = (H - SRC_RESOLUTION_H * scale) / 2;

  // CAMERA : pull-back lent continu (recul progressif, jamais figee) sur toute la duree.
  const camScale = interpolate(frame, [0, localEnd], [1.1, 0.98], { extrapolateRight: "clamp" });
  const shake = cameraShake(frame, 1, localEnd);
  const focalXScreen = offsetX + RESOLUTION_RING_CENTER.x * scale;
  const focalYScreen = offsetY + RESOLUTION_RING_CENTER.y * scale;
  const camTx = focusTx(focalXScreen, camScale) + shake.x;
  const camTy = focusTy(focalYScreen, camScale) + shake.y;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: RESOLUTION_DEFS }} />
        <g transform={`translate(${camTx} ${camTy}) scale(${camScale})`}>
          <g transform={`translate(${offsetX} ${offsetY}) scale(${scale})`}>
            <Inject html={RESOLUTION_BG} />
            <Inject html={RESOLUTION_GROUND} attrs={RESOLUTION_GROUND_ATTRS} opacity={ghostIn * 0.5} />
            <Inject html={RESOLUTION_SEAL_GHOST} attrs={RESOLUTION_SEAL_GHOST_ATTRS} opacity={ghostIn * 0.3} />

            <g
              transform={`translate(${RESOLUTION_RING_CENTER.x} ${RESOLUTION_RING_CENTER.y}) rotate(${ringSpin}) translate(${-RESOLUTION_RING_CENTER.x} ${-RESOLUTION_RING_CENTER.y})`}
            >
              <Inject html={RESOLUTION_SEAL_ARC} attrs={RESOLUTION_SEAL_ARC_ATTRS} opacity={arcIn} />
            </g>

            {approachDraw > 0.01 && (
              <g
                {...RESOLUTION_APPROACH_ATTRS}
                opacity={approachDraw}
                style={{
                  strokeDasharray: 1000,
                  strokeDashoffset: 1000 * (1 - approachDraw),
                }}
                dangerouslySetInnerHTML={{ __html: RESOLUTION_APPROACH }}
              />
            )}

            {packetOpacity > 0.01 && (
              <g
                opacity={packetOpacity}
                transform={`translate(${-40 * (1 - travel)} ${-30 * (1 - travel)})`}
                dangerouslySetInnerHTML={{ __html: RESOLUTION_PACKET }}
              />
            )}

            {weldIn > 0.01 && (
              <g
                {...RESOLUTION_SEAL_WELD_ATTRS}
                opacity={1}
                style={{
                  strokeDasharray: 260,
                  strokeDashoffset: 260 * (1 - weldIn),
                }}
                dangerouslySetInnerHTML={{ __html: RESOLUTION_SEAL_WELD }}
              />
            )}

            <Inject html={RESOLUTION_SEAL_TICKS} attrs={RESOLUTION_SEAL_TICKS_ATTRS} opacity={ticksIn} />

            {impactPulse > 0.01 && (
              <g
                opacity={impactPulse}
                transform={`translate(${RESOLUTION_RING_CENTER.x} ${RESOLUTION_RING_CENTER.y}) scale(${1 + 0.3 * impactPulse}) translate(${-RESOLUTION_RING_CENTER.x} ${-RESOLUTION_RING_CENTER.y})`}
                dangerouslySetInnerHTML={{ __html: RESOLUTION_IMPACT }}
              />
            )}

            <Inject
              html={RESOLUTION_CORE}
              attrs={RESOLUTION_CORE_ATTRS}
              opacity={interpolate(frame, [0, 20], [0.6, 1], { extrapolateRight: "clamp" })}
              transform={`translate(${RESOLUTION_RING_CENTER.x} ${RESOLUTION_RING_CENTER.y}) scale(${breathe}) translate(${-RESOLUTION_RING_CENTER.x} ${-RESOLUTION_RING_CENTER.y})`}
            />
            <Inject html={RESOLUTION_RESIDUE} opacity={residueIn} />
            <Inject html={RESOLUTION_REST_WAVES} attrs={RESOLUTION_REST_WAVES_ATTRS} opacity={wavesIn} />

            {/* petit point qui orbite en continu sur l'anneau -- la boucle ne s'arrete jamais */}
            <circle cx={orbitX} cy={orbitY} r={5} fill="#FFFFFF" opacity={orbitOpacity} />

            <Inject html={RESOLUTION_VIGNETTE} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// Wrapper whip-pan : sa propre useCurrentFrame() est relative a SA Sequence (independante
// de la logique interne du panneau enfant), pilote opacity+blur CSS sans toucher au code
// du panneau. `edge="out"` = ce panneau SORT (fade+blur sur les derniers TRANSITION_OVERLAP
// frames de sa propre duree) ; `edge="in"` = ce panneau ENTRE (Sequence commence
// TRANSITION_OVERLAP frames avant le debut narratif "officiel", fade+blur sur ces frames-la).
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
    <AbsoluteFill style={{ opacity, filter: blur > 0.3 ? `blur(${blur}px)` : "none" }}>
      {children}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// COMPOSITION PRINCIPALE
// ---------------------------------------------------------------------------
export const FlowdeskAbstrait2A: React.FC = () => {
  const chaosDur = BASCULE_START - CHAOS_START;
  const basculeDur = MECANISME_START - BASCULE_START;
  const mecanismeDur = RESOLUTION_START - MECANISME_START;
  const resolutionDur = TOTAL_FRAMES - RESOLUTION_START;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* CHAOS : sort en whip-pan vers Bascule (derniers TRANSITION_OVERLAP frames de sa duree) */}
      <Sequence from={CHAOS_START} durationInFrames={chaosDur}>
        <TransitionLayer edge="out" ownDuration={chaosDur}>
          <PanneauChaos />
        </TransitionLayer>
      </Sequence>

      {/* BASCULE : entre en whip-pan (Sequence demarre TRANSITION_OVERLAP plus tot, superposee
          a la fin de Chaos), sort en whip-pan vers Mecanisme. */}
      <Sequence from={BASCULE_START - TRANSITION_OVERLAP} durationInFrames={basculeDur + TRANSITION_OVERLAP}>
        <TransitionLayer edge="in" ownDuration={basculeDur + TRANSITION_OVERLAP}>
          <TransitionLayer edge="out" ownDuration={basculeDur + TRANSITION_OVERLAP}>
            <PanneauBascule />
          </TransitionLayer>
        </TransitionLayer>
      </Sequence>

      <Sequence from={MECANISME_START - TRANSITION_OVERLAP} durationInFrames={mecanismeDur + TRANSITION_OVERLAP}>
        <TransitionLayer edge="in" ownDuration={mecanismeDur + TRANSITION_OVERLAP}>
          <TransitionLayer edge="out" ownDuration={mecanismeDur + TRANSITION_OVERLAP}>
            <PanneauMecanisme />
          </TransitionLayer>
        </TransitionLayer>
      </Sequence>

      <Sequence from={RESOLUTION_START - TRANSITION_OVERLAP} durationInFrames={resolutionDur + TRANSITION_OVERLAP}>
        <TransitionLayer edge="in" ownDuration={resolutionDur + TRANSITION_OVERLAP}>
          <PanneauResolution />
        </TransitionLayer>
      </Sequence>

      <Audio src={staticFile("_client-sim/flowdesk/audio/narration-flowdesk.mp3")} />
      <Audio
        src={staticFile("_client-sim/flowdesk/audio/music-flowdesk-45s.mp3")}
        volume={(f) => interpolate(f, [0, 30, TOTAL_FRAMES - 30, TOTAL_FRAMES], [0, 0.15, 0.15, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
    </AbsoluteFill>
  );
};
