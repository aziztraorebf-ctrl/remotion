import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, OffthreadVideo } from "remotion";
import { cameraShake } from "./camera";
import { LoopedVideo, LoopedImageSequence } from "./videoLoop";
import {
  CHAOSV3_DEFS,
  CHAOSV3_IC_EMAIL,
  CHAOSV3_IC_CHAT,
  CHAOSV3_IC_SHEET,
  CHAOSV3_IC_PHONE,
  CHAOSV3_IC_DOC,
  CHAOSV3_IC_BELL,
} from "./groups-v3/chaosV3Groups";
import {
  BASCULEV3_DEFS,
  BASCULEV3_B_IC_EMAIL,
  BASCULEV3_B_IC_CHAT,
  BASCULEV3_B_IC_SHEET,
  BASCULEV3_B_IC_PHONE,
  BASCULEV3_BASCULE_HORN,
  BASCULEV3_BASCULE_HORN_ATTRS,
} from "./groups-v3/basculeV3Groups";
import {
  MECANISMEV3_DEFS,
  MECANISMEV3_M_IC_EMAIL,
  MECANISMEV3_M_IC_CHAT,
  MECANISMEV3_M_IC_DOC,
  MECANISMEV3_MEC_FAR_ARCH,
  MECANISMEV3_MEC_FAR_ARCH_ATTRS,
  MECANISMEV3_MEC_MODULE,
  MECANISMEV3_MEC_MODULE_ATTRS,
} from "./groups-v3/mecanismeV3Groups";
import { RESOLUTIONV3_DEFS } from "./groups-v3/resolutionV3Groups";
import { getPointAtLength, getLength } from "@remotion/paths";

// ---------------------------------------------------------------------------
// Registre ABSTRAIT V4 (2026-08-05) -- integration des 2 clips vectoriels
// personnage (registre B, deja avances en session parallele) + retour Aziz sur
// V3 : les icones ne doivent JAMAIS toucher le personnage (orbite continue,
// jamais figees) ; P2 doit montrer le vortex d'aspiration + sortie a droite ;
// P3 doit montrer les icones qui GLISSENT jusqu'a leur destination et y RESTENT
// (pas de disparition) ; P4 reutilise le clip "calme au clavier" + icones
// rangees en cercle (boucle visuelle avec le chaos du P1).
//
// Assets video : panel1-chaos-h3.mp4 (personnage decourage, fond deja #0B1F3A,
// joue en MP4 direct) / panel2-frames/f%04d.png (personnage calme au clavier,
// fond original blanc retire via chroma-key ffmpeg -> sequence PNG alpha --
// le pipeline webm+VP9 alpha s'est revele peu fiable sur cet environnement,
// canal alpha silencieusement perdu a l'export malgre logs ffmpeg corrects).
// ---------------------------------------------------------------------------

const FPS = 30;
export const FLOWDESK_V4_FPS = FPS;

const CHAOS_START = 0;
const BASCULE_START = 495;
const MECANISME_START = 810;
const RESOLUTION_START = 1105;
const TOTAL_FRAMES = 1474;
export const FLOWDESK_V4_FRAMES = TOTAL_FRAMES;

const TRANSITION_OVERLAP = 35;

const W = 1920;
const H = 1080;
const BG = "#0B1F3A";

// clips source : duree/fps reels mesures par ffprobe (panel1 651094 bytes, panel2 848780 bytes,
// tous deux 24fps ~5.17-5.18s -- cf verification 2026-08-05)
const PANEL1_SRC_FPS = 24;
const PANEL1_SRC_FRAMES = 124; // ~5.17s a 24fps
const PANEL2_SRC_FPS = 24;
const PANEL2_SRC_FRAMES = 124;

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
// PANNEAU 1 -- CHAOS. Personnage decourage (panel1), les 6 icones nommees
// tournent en CONTINU au-dessus/autour de lui -- ne s'arretent JAMAIS, ne le
// touchent JAMAIS. Icones plus grosses et plus espacees que V3 (retour Aziz :
// "trop petites/tassees"). Le personnage EST le sujet du chaos -- les icones
// tournent comme une pression mentale continue.
//
// GEOMETRIE MESUREE (agent dedie, 2026-08-06, cf rapport diagnostic complet --
// masque luminance sur 124 frames, mobilier exclu par persistance temporelle) :
// silhouette (tete+torse+bras+dossier) dans le repere de SORTIE 1920x1080 :
// gauche x=693, droite x=1398, haut y=453, bas y=1079 (quasi colle au bord bas
// du cadre -- 1px de marge). UNE ORBITE FERMEE EST GEOMETRIQUEMENT IMPOSSIBLE
// (balayage exhaustif confirme 0 solution avec >=60px de degagement) : tout
// cercle/ellipse qui boucle par le bas traverse forcement la silhouette.
// Solution : grand ARC ELLIPTIQUE OUVERT passant par le haut + les cotes
// (jamais sous le personnage), centre (1120,500), Rx=760, Ry=460, parcouru en
// continu de 170deg a 370deg (200deg de couverture, verifie a >=390px de la
// silhouette). Fondu en entree/sortie aux deux bornes pour simuler une orbite
// continue sans jamais retraverser la zone basse impossible.
// ---------------------------------------------------------------------------
const ARC_CENTER = { x: 1120, y: 500 };
const ARC_START_DEG = 170; // borne basse-gauche de l'arc (juste au-dessus/a cote de l'epaule gauche)
const ARC_END_DEG = 370; // = 10deg -- borne basse-droite (juste au-dessus/a cote du dossier)
const ARC_SPAN_DEG = ARC_END_DEG - ARC_START_DEG; // 200deg
const ARC_FADE_DEG = 18; // fondu aux deux bornes pour masquer la reapparition

type OrbitIcon = { html: string; rx: number; ry: number; speed: number; phase: number; scale: number; label: string };

// rx/ry PAR icone, 10 anneaux CONCENTRIQUES STRICTEMENT DISTINCTS (jamais deux icones sur le
// meme anneau -- deux va-et-vient opposes sur un anneau partage se CROISENT forcement au milieu
// de l'arc, confirme par calcul le 2026-08-06). Retour Aziz (2026-08-06, 2e passe) : "icones
// encore trop petites, plus d'icones, plus chaotique/bordelique, plus rapide" -- scale ~1.6x
// plus grand (1.8-2.3 vs 1.15-1.35), N doublee de 6 a 10, vitesses quasi doublees (0.45-0.95 vs
// 0.24-0.53). Vitesses/phases re-optimisees par recherche exhaustive (8000+ combinaisons sur les
// 495 frames reelles) pour cette nouvelle echelle : marge cadre 1920x1080 >=20px, marge vs
// silhouette mesuree >=54px, distance min inter-icones 28px (un frolement occasionnel a cette
// distance est ACCEPTABLE ici -- coherent avec la consigne "plus bordelique", contrairement au
// P1 precedent ou on visait zero frolement).
const ORBIT_ICONS: OrbitIcon[] = [
  { html: CHAOSV3_IC_EMAIL, rx: 490, ry: 297, speed: 0.85, phase: 0.529, scale: 2.0, label: "email" },
  { html: CHAOSV3_IC_CHAT, rx: 522, ry: 317, speed: 0.95, phase: 0.221, scale: 1.9, label: "chat" },
  { html: CHAOSV3_IC_SHEET, rx: 554, ry: 336, speed: -0.85, phase: 0.874, scale: 2.1, label: "sheet" },
  { html: CHAOSV3_IC_PHONE, rx: 587, ry: 356, speed: 0.75, phase: 0.39, scale: 1.9, label: "phone" },
  { html: CHAOSV3_IC_DOC, rx: 619, ry: 375, speed: 0.75, phase: 0.329, scale: 2.15, label: "doc" },
  { html: CHAOSV3_IC_BELL, rx: 651, ry: 395, speed: -0.85, phase: 0.577, scale: 1.85, label: "bell" },
  { html: CHAOSV3_IC_EMAIL, rx: 683, ry: 414, speed: 0.65, phase: 0.731, scale: 2.05, label: "email2" },
  { html: CHAOSV3_IC_CHAT, rx: 716, ry: 434, speed: 0.95, phase: 0.015, scale: 1.95, label: "chat2" },
  { html: CHAOSV3_IC_DOC, rx: 748, ry: 453, speed: -0.95, phase: 0.476, scale: 2.2, label: "doc2" },
  { html: CHAOSV3_IC_BELL, rx: 780, ry: 473, speed: 0.65, phase: 0.678, scale: 2.0, label: "bell2" },
];

const OrbitIconEl: React.FC<{ icon: OrbitIcon; index: number; frame: number }> = ({ icon, index, frame }) => {
  // apparition initiale (spring), puis va-et-vient perpetuel le long de l'arc -- ne se fige jamais
  const appear = spring({
    frame: Math.max(0, frame - index * 12),
    fps: FPS,
    config: { mass: 0.8, damping: 13, stiffness: 110 },
    durationInFrames: 30,
  });
  if (appear <= 0.01) return null;

  // position le long de l'arc : va-et-vient triangulaire (0..1..0) pour rester DANS l'arc ouvert
  // sans jamais boucler par le bas. IRREGULARITE ajoutee (retour da-brief downstream, Kimi :
  // "easing robotique, screensaver Windows 95" sur une vitesse angulaire parfaitement constante)
  // -- une modulation lente et deterministe (seed par icone) fait fluctuer la vitesse effective
  // de +-20%, cassant le cote parfaitement mecanique sans introduire de saccades visibles.
  const speedWobble = 1 + 0.2 * Math.sin(frame / (40 + index * 6) + index * 3.3);
  const t = ((frame * Math.abs(icon.speed) * speedWobble) / 360 + icon.phase) % 1;
  const triangular = t < 0.5 ? t * 2 : 2 - t * 2; // 0->1->0
  const angleDeg = icon.speed >= 0
    ? ARC_START_DEG + triangular * ARC_SPAN_DEG
    : ARC_END_DEG - triangular * ARC_SPAN_DEG;
  const angleRad = (angleDeg * Math.PI) / 180;

  const x = ARC_CENTER.x + Math.cos(angleRad) * icon.rx;
  const y = ARC_CENTER.y + Math.sin(angleRad) * icon.ry;

  // fondu aux deux bornes de l'arc (triangular proche de 0 ou 1) pour masquer le rebond
  const edgeFade = interpolate(
    triangular,
    [0, ARC_FADE_DEG / ARC_SPAN_DEG, 1 - ARC_FADE_DEG / ARC_SPAN_DEG, 1],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // leger flottement radial (respiration) pour eviter une trajectoire parfaitement mecanique
  const breathe = 1 + 0.06 * Math.sin(frame / 25 + index);

  return (
    <g
      opacity={appear * edgeFade}
      transform={`translate(${x} ${y}) scale(${appear * icon.scale * breathe})`}
      dangerouslySetInnerHTML={{ __html: icon.html }}
    />
  );
};

// SFX ponctuels alignes sur le stagger d'apparition des icones (index*12, cf OrbitIconEl) --
// un son distinct par type d'icone, dispo dans audio/sfx/, aucune generation necessaire.
const CHAOS_SFX_CUES = [
  { frame: 0, file: "sfx-notif-email.mp3" },
  { frame: 12, file: "sfx-notif-slack.mp3" },
  { frame: 24, file: "sfx-notif-tableur.mp3" },
  { frame: 36, file: "sfx-notif-generic-sharp.mp3" },
  { frame: 48, file: "sfx-notif-generic-soft.mp3" },
  { frame: 60, file: "sfx-notif-generic-sharp.mp3" },
];

const PanneauChaosV4: React.FC = () => {
  const frame = useCurrentFrame();
  const localEnd = BASCULE_START - CHAOS_START;

  const videoIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  // caméra : leger zoom-in CSS applique sur TOUT le cadre (video + icones ensemble), pivot
  // centre du cadre -- simple scale CSS, pas de translate focusTx/Ty (pensee pour un espace
  // SVG translate(tx,ty) scale(s), pas transposable telle quelle a un AbsoluteFill HTML).
  const camScale = interpolate(frame, [0, localEnd], [1, 1.05], { extrapolateRight: "clamp" });
  const shakeDecay = interpolate(frame, [localEnd - 90, localEnd], [1, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = cameraShake(frame, 2, localEnd * shakeDecay);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AbsoluteFill
        style={{
          transform: `scale(${camScale}) translate(${shake.x}px, ${shake.y}px)`,
          transformOrigin: "center center",
        }}
      >
        {/* personnage decourage -- MP4 direct, fond deja #0B1F3A, boucle sur toute la duree */}
        <AbsoluteFill style={{ opacity: videoIn }}>
          <LoopedVideo
            src={staticFile("_client-sim/flowdesk/video/panel1-chaos-h3.mp4")}
            clipDurationFrames={Math.round((PANEL1_SRC_FRAMES / PANEL1_SRC_FPS) * FPS)}
            totalDurationFrames={localEnd}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>

        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <defs dangerouslySetInnerHTML={{ __html: CHAOSV3_DEFS }} />
          {ORBIT_ICONS.map((icon, i) => (
            <OrbitIconEl key={icon.label} icon={icon} index={i} frame={frame} />
          ))}
        </svg>
      </AbsoluteFill>

      {/* SFX ponctuels calant l'apparition echelonnee des 6 icones (meme stagger index*12 que
          OrbitIconEl) -- deja disponibles dans audio/sfx/, rien a generer (consigne Aziz). */}
      {CHAOS_SFX_CUES.map((cue, i) => (
        <Sequence key={i} from={cue.frame} durationInFrames={40} layout="none">
          <Audio src={staticFile(`_client-sim/flowdesk/audio/sfx/${cue.file}`)} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// PANNEAU 2 -- BASCULE. Consigne Aziz (STATUS.md) : icone Flowdesk A COTE du mot
// (pas seulement le texte) ; VORTEX D'ASPIRATION VISIBLE (spirale animee qui tourne
// et se resserre, pas un simple fade) ; icones qui SORTENT PAR LA DROITE du cadre
// une fois capturees (pas de disparition sur place).
//
// Geometrie : point focal repris de V3 (1500,540, proche bord droit du cadre 1920)
// -- coherent avec la sortie a droite. Logo simple (cercle marine + cerclage orange
// + initiale stylisee, meme palette que le logo anime du registre 2B sans dupliquer
// son code -- fichiers de sessions paralleles distinctes) positionne a GAUCHE du mot
// FLOWDESK (lockup logo+texte), pas seulement le texte seul comme en V3.
// ---------------------------------------------------------------------------
// Retour Aziz (2026-08-06, 3e passe, apres da-brief downstream) : le vortex ne doit plus etre
// un point fixe -- il DERIVE vers la gauche pendant tout le panneau (315f), comme un vrai
// cyclone qui se deplace. Prepare aussi la transition causale vers le P3 : le point d'arrivee
// du vortex (x=1150) est desormais plus proche du centre du cadre, cote gauche du module
// Flowdesk du P3 (960,540) -- un objet qui "survit" au whip-pan plutot qu'un cut sec.
const BASCULE_FOCUS_START = { x: 1650, y: 540 };
const BASCULE_FOCUS_END = { x: 1150, y: 540 };
function basculeFocusAt(frame: number) {
  const t = interpolate(frame, [0, 315], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease-in-out, derive jamais lineaire/mecanique
  return {
    x: BASCULE_FOCUS_START.x + (BASCULE_FOCUS_END.x - BASCULE_FOCUS_START.x) * eased,
    y: BASCULE_FOCUS_START.y,
  };
}
const BASCULE_ICON_SET = [BASCULEV3_B_IC_EMAIL, BASCULEV3_B_IC_CHAT, BASCULEV3_B_IC_SHEET, BASCULEV3_B_IC_PHONE];

type BasculeIcon = { html: string; startAngleDeg: number; startRadius: number; cycleOffset: number };

// SYSTEME CYCLIQUE (pas un jeu fixe qui s'epuise) : chaque icone repete indefiniment le
// cycle spirale->capture->ejection sur toute la duree du panneau (315f), dephasees par
// cycleOffset -- corrige le bug constate 2026-08-06 ou les icones etaient toutes sorties/
// disparues avant la fin du panneau (0 icone visible sur le dernier tiers). CYCLE_LEN doit
// laisser le temps a l'ejection d'ATTEINDRE le bord du cadre avant de reapparaitre (sinon
// le fade en Phase 2 masque la sortie -- 2e bug corrige : le fade demarrait a 70% du trajet,
// bien avant que l'icone ait quitte le cadre visible a x=1920).
const CYCLE_LEN = 130; // 90f spirale + 40f ejection, aucun temps mort
const BASCULE_ICONS: BasculeIcon[] = [
  { html: BASCULE_ICON_SET[0], startAngleDeg: 200, startRadius: 950, cycleOffset: 0 },
  { html: BASCULE_ICON_SET[1], startAngleDeg: 260, startRadius: 850, cycleOffset: 16 },
  { html: BASCULE_ICON_SET[2], startAngleDeg: 150, startRadius: 1000, cycleOffset: 32 },
  { html: BASCULE_ICON_SET[3], startAngleDeg: 100, startRadius: 900, cycleOffset: 48 },
  { html: BASCULE_ICON_SET[0], startAngleDeg: 320, startRadius: 880, cycleOffset: 65 },
  { html: BASCULE_ICON_SET[1], startAngleDeg: 40, startRadius: 950, cycleOffset: 81 },
  { html: BASCULE_ICON_SET[2], startAngleDeg: 220, startRadius: 1050, cycleOffset: 97 },
  { html: BASCULE_ICON_SET[3], startAngleDeg: 300, startRadius: 900, cycleOffset: 113 },
];

const BasculeIconEl: React.FC<{ icon: BasculeIcon; index: number; frame: number }> = ({ icon, index, frame }) => {
  // le focus DERIVE dans le temps (basculeFocusAt) -- calcule sur le frame GLOBAL du panneau
  // (pas localFrame, qui reboucle) pour que toutes les icones convergent vers le MEME point
  // mouvant a un instant donne, cyclone coherent plutot que des cibles eclatees.
  const basculeFocus = basculeFocusAt(frame);

  // cycle perpetuel : localFrame reboucle sur CYCLE_LEN, dephase par icone ET par index de
  // repetition (seed) pour varier legerement l'angle de depart a chaque tour (pas un boucle
  // mecanique identique a l'infini).
  const globalFrame = frame + icon.cycleOffset;
  const cycleIndex = Math.floor(globalFrame / CYCLE_LEN);
  const localFrame = globalFrame % CYCLE_LEN;
  const angleSeed = (cycleIndex * 47 + index * 31) % 360; // variation deterministe par tour

  // PHASE 0 (0..35f) : FLOTTEMENT DESORDONNE en peripherie, EN DEHORS du cyclone -- retour
  // Aziz (2026-08-06, 2e passe) : "en dehors du cyclone des icones qui flottent de maniere
  // desordonnee". Petit mouvement erratique (Lissajous multi-frequence) autour de la position
  // de depart, PAS de convergence vers le centre pendant cette phase.
  const floatProgress = interpolate(localFrame, [0, 35], [0, 1], { extrapolateRight: "clamp" });
  const floatWobbleX = Math.sin(localFrame / 6 + index * 2.1) * 35 + Math.sin(localFrame / 3.3 + index) * 18;
  const floatWobbleY = Math.cos(localFrame / 7 + index * 1.7) * 30 + Math.cos(localFrame / 4.1 + index) * 15;
  const floatAngleRad = ((icon.startAngleDeg + angleSeed) * Math.PI) / 180;
  const floatX = basculeFocus.x + Math.cos(floatAngleRad) * icon.startRadius + floatWobbleX;
  const floatY = basculeFocus.y + Math.sin(floatAngleRad) * icon.startRadius * 0.65 + floatWobbleY;

  // PHASE 1 (35..90f) : spirale d'aspiration DANS le cyclone -- l'icone tourne en se rapprochant
  // (rayon decroit, vitesse angulaire augmente -- vortex classique), VISIBLE en cours de capture
  // (retour Aziz : "des icones aussi qui sont la, qui sont aspirees en tant que telles" -- scale
  // ne retombe plus pres de zero au centre, reste lisible jusqu'a la capture).
  const spiralProgress = interpolate(localFrame, [35, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const easedSpiral = spiralProgress * spiralProgress; // ease-in : accelere en approchant le centre
  const currentRadius = icon.startRadius * (1 - easedSpiral) + 60 * easedSpiral;
  const angleTravel = 260 * easedSpiral + 500 * Math.pow(spiralProgress, 3);
  const angleRad = ((icon.startAngleDeg + angleSeed + angleTravel) * Math.PI) / 180;
  const spiralX = basculeFocus.x + Math.cos(angleRad) * currentRadius;
  const spiralY = basculeFocus.y + Math.sin(angleRad) * currentRadius * 0.65;

  // PHASE 2 (90..130f) : ejection nette vers la DROITE, hors cadre, avec acceleration.
  // Le FADE ne demarre qu'UNE FOIS l'icone hors du cadre visible (x > W), jamais avant --
  // sinon elle s'efface en plein trajet et la "sortie par la droite" n'est jamais VUE
  // (bug constate : fade a 70% du trajet, l'icone etait encore a l'ecran).
  const exitProgress = interpolate(localFrame, [90, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const easedExit = exitProgress * exitProgress * exitProgress; // ease-in prononce (fonce vers la droite)
  const exitTargetX = W + 220; // au-dela du bord droit, l'icone a physiquement quitte le cadre
  const exitX = spiralX + easedExit * (exitTargetX - spiralX);
  const exitY = spiralY + (index % 2 === 0 ? -1 : 1) * easedExit * 50;

  // composition des 3 phases : float -> spiral -> exit
  let x: number;
  let y: number;
  if (exitProgress > 0) {
    x = exitX;
    y = exitY;
  } else if (spiralProgress > 0) {
    x = spiralX;
    y = spiralY;
  } else {
    x = floatX;
    y = floatY;
  }

  const appear = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  // fade uniquement quand x depasse le bord du cadre (W) -- l'icone a deja disparu de l'ecran
  // a ce stade, le fade sert juste a nettoyer le DOM avant reapparition, jamais visible
  const fadeStartX = W - 40;
  const exitFade = x <= fadeStartX ? 1 : interpolate(x, [fadeStartX, exitTargetX], [1, 0], { extrapolateRight: "clamp" });
  // scale reste lisible meme pres du centre (0.85 min vs 0 avant) -- icone visible en cours d'aspiration
  const scale = 1.5 * (1 - 0.15 * easedSpiral);

  return (
    <g
      opacity={appear * exitFade}
      transform={`translate(${x} ${y}) scale(${scale})`}
      dangerouslySetInnerHTML={{ __html: icon.html }}
    />
  );
};

// Vortex visuel : EXACTEMENT 5 BRAS de spirale, qui SE DESSINENT (strokeDasharray/dashoffset)
// au lieu d'un simple fade -- retour Aziz (2026-08-06, 3e passe, apres da-brief downstream) :
// "notre plus grande force en SVG c'est de faire se dessiner les elements, pas juste un fade" --
// exploite la meme technique deja utilisee pour l'anneau du P4 (signature de registre). Longueurs
// mesurees par echantillonnage bezier (ARM_LEN=727, ARM_LEN_2=469). Le centre DERIVE (cf
// basculeFocusAt) -- tout le vortex suit ce point mouvant, cyclone qui voyage vers la gauche.
const VORTEX_ARM_COUNT = 5;
const VORTEX_ARM_LEN = 727;
const VORTEX_ARM_LEN_2 = 469;
const BasculeVortex: React.FC<{ frame: number }> = ({ frame }) => {
  const focus = basculeFocusAt(frame);
  // le TRACE se dessine sur les 60 premieres frames -- LINEAIRE, PAS ease-in-out (retour Aziz
  // 2026-08-06, 4e passe : "le stroke-dasharray ne se voit pas" -- verifie par extraction dense
  // 10fps : l'ease-in-out precedent faisait que le trait restait quasi invisible sur les 30
  // premieres frames puis "explosait" d'un coup en ~6 frames au milieu -- lecture en POP, pas
  // en dessin continu. Un trace en direct doit progresser a vitesse PERCEPTIBLE CONSTANTE.
  const drawProgress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" });
  const drawEased = drawProgress; // lineaire
  const spin = frame * 2.0;
  return (
    <>
      <g
        transform={`translate(${focus.x} ${focus.y}) rotate(${spin})`}
        opacity={0.85}
      >
        {Array.from({ length: VORTEX_ARM_COUNT }, (_, i) => (
          <path
            key={i}
            d="M 0 0 C 220 -110, 460 -50, 680 110"
            fill="none"
            stroke="#FF6B1A"
            strokeWidth={8}
            strokeOpacity={0.8}
            strokeLinecap="round"
            style={{
              strokeDasharray: VORTEX_ARM_LEN,
              strokeDashoffset: VORTEX_ARM_LEN * (1 - drawEased),
            }}
            transform={`rotate(${(i * 360) / VORTEX_ARM_COUNT})`}
          />
        ))}
      </g>
      {/* 2e couche, memes 5 bras plus courts/fins en contre-decalage -- donne de l'epaisseur
          au cyclone sans introduire une 2e famille de bras qui brouillerait le compte "5".
          Se dessine avec un leger delai vs la couche principale (15f) -- lecture sequentielle. */}
      <g
        transform={`translate(${focus.x} ${focus.y}) rotate(${spin + 36})`}
        opacity={0.45}
      >
        {Array.from({ length: VORTEX_ARM_COUNT }, (_, i) => {
          // LINEAIRE (meme correction que la couche principale) -- pas d'ease-in-out qui
          // ecrase le trace en un pop au milieu de la fenetre.
          const drawEased2 = interpolate(frame, [15, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <path
              key={i}
              d="M 0 0 C 140 -70, 300 -30, 440 70"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={4}
              strokeOpacity={0.5}
              strokeLinecap="round"
              style={{
                strokeDasharray: VORTEX_ARM_LEN_2,
                strokeDashoffset: VORTEX_ARM_LEN_2 * (1 - drawEased2),
              }}
              transform={`rotate(${(i * 360) / VORTEX_ARM_COUNT})`}
            />
          );
        })}
      </g>
      {/* anneau dense proche du centre -- signale visuellement le point d'aspiration meme
          quand aucune icone n'est en phase finale de capture */}
      <circle
        cx={focus.x}
        cy={focus.y}
        r={150}
        fill="none"
        stroke="#FF6B1A"
        strokeWidth={2.5}
        strokeOpacity={0.35}
        strokeDasharray="16 12"
        transform={`rotate(${spin * 0.6} ${focus.x} ${focus.y})`}
      />
    </>
  );
};

// Logo simple (cercle marine + cerclage orange + "F" stylise), MEME PALETTE que le logo
// anime du registre 2B mais implementation independante (fichiers de sessions paralleles
// distinctes, pas de dependance croisee 2A/2B). Positionne A COTE du mot FLOWDESK (lockup),
// pas le texte seul (defaut V3 releve par Aziz).
const BasculeLogo: React.FC<{ frame: number }> = ({ frame }) => {
  const logoIn = spring({ frame, fps: FPS, config: { mass: 0.8, damping: 12, stiffness: 120 }, durationInFrames: 24 });
  return (
    <g transform={`scale(${logoIn})`} opacity={logoIn}>
      <circle r="34" fill="#0B1F3A" />
      <circle r="34" fill="none" stroke="#FF6B1A" strokeWidth="3" />
      <path
        d="M -12 16 V -16 H 10 M -12 0 H 6"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
};

const PanneauBasculeV4: React.FC = () => {
  const frame = useCurrentFrame();
  const localEnd = MECANISME_START - BASCULE_START;
  const focus = basculeFocusAt(frame);

  const perpetualRotate = frame * 0.3;
  const focusPulse = 1 + 0.02 * Math.sin(frame / 15);

  const camScale = interpolate(frame, [0, localEnd], [1, 1.1], { extrapolateRight: "clamp" });
  const shake = cameraShake(frame, 2, localEnd);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: BASCULEV3_DEFS }} />

        <g
          transform={`translate(${W / 2} ${H / 2}) scale(${camScale}) translate(${-W / 2 + shake.x} ${-H / 2 + shake.y})`}
        >
          <g
            transform={`translate(${focus.x} ${focus.y}) rotate(${perpetualRotate}) translate(${-focus.x} ${-focus.y})`}
          >
            <Inject html={BASCULEV3_BASCULE_HORN} attrs={BASCULEV3_BASCULE_HORN_ATTRS} />
          </g>

          <BasculeVortex frame={frame} />

          {BASCULE_ICONS.map((icon, i) => (
            <BasculeIconEl key={i} icon={icon} index={i} frame={frame} />
          ))}

          {/* focus : glow + pilule blanche + LOGO A COTE DU MOT (lockup, pas texte seul) --
              suit le centre mobile du vortex (basculeFocusAt) */}
          <g transform={`translate(${focus.x} ${focus.y}) scale(${focusPulse})`}>
            <circle r="70" fill="url(#b-focusGlow)" />
            <rect x="-195" y="-38" width="390" height="76" rx="38" fill="#FFFFFF" />
            <g transform="translate(-150 0)">
              <BasculeLogo frame={frame} />
            </g>
            <text
              x="20"
              y="14"
              textAnchor="middle"
              fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
              fontSize="42"
              fontWeight="700"
              letterSpacing="1"
              fill="#0B1F3A"
            >
              FLOWDESK
            </text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// PANNEAU 3 -- MECANISME. Consigne Aziz (STATUS.md) : icones qui GLISSENT le
// long des lignes (pas de teleportation/fade), TRAVERSENT le logo central,
// arrivent a leur destination NOMMEE et Y RESTENT (pas de disparition -- defaut
// V3 ou les inflow disparaissaient en boucle sans jamais se poser).
//
// Mouvement reel le long des paths SVG Bezier existants (mec-in-*, mec-route-*)
// via getPointAtLength (@remotion/paths, mesure geometrique fiable -- PAS une
// heuristique de comptage de commandes, cf feedback_svg-path-length-heuristique-
// commandes-jamais-fiable). Chaque icone : glisse sur son inflow path jusqu'au
// module (960,540), TRAVERSE (translation continue par-dessus le module,
// jamais de saut), puis glisse sur son route path assigne jusqu'a la
// destination, s'immobilise sur le cercle et Y RESTE jusqu'a la fin du panneau.
// ---------------------------------------------------------------------------
const MEC_CENTER = { x: 960, y: 540 };

const MEC_INFLOW_PATHS = [
  "M 140 340 L 780 540", // mec-in-0 (email), aboutit au module (960,540) en ligne droite depuis (140,340)+(640,200)
  "M 100 540 L 780 540", // mec-in-1 (chat)
  "M 140 760 L 780 540", // mec-in-2 (doc)
];
// Routes RECULEES vers la gauche (dest x ~1670-1690 au lieu de 1780-1820) -- retour Aziz + da-brief
// downstream convergent (Gemini/Kimi/GPT) : labels trop pres du bord droit, parfois coupes. Marge
// desormais 166-186px (vs 36-56px avant). Label desormais EXTERNE au cercle (sous, pas dedans) --
// plus lisible a n'importe quelle taille de police.
const MEC_ROUTE_PATHS = [
  { d: "M 1160 400 C 1316 318 1481 252 1670 165", dest: { x: 1670, y: 165 }, label: "IT" },
  { d: "M 1170 470 C 1343 429 1507 412 1680 385", dest: { x: 1680, y: 385 }, label: "RH" },
  { d: "M 1180 540 C 1361 540 1525 540 1690 540", dest: { x: 1690, y: 540 }, label: "FINANCE" },
  { d: "M 1170 610 C 1343 651 1507 668 1680 695", dest: { x: 1680, y: 695 }, label: "SUPPORT" },
  { d: "M 1160 680 C 1316 762 1481 828 1670 915", dest: { x: 1670, y: 915 }, label: "DIRECTION" },
];

type MecTravelIcon = {
  html: string;
  inflowIdx: number;
  routeIdx: number;
  startFrame: number;
  slotAngleDeg: number; // decalage angulaire autour du cercle de destination (evite superposition exacte)
};

// 2 ICONES PAR DESTINATION (10 au total, vs 1 seule avant) -- retour Aziz (2026-08-06, 2e passe) :
// "on pourrait avoir deux, trois icones pour chaque departement... montrer vraiment
// l'organisation". staging sequentiel conserve (chaque PAIRE arrive proche dans le temps mais
// pas simultanee -- 2e icone 18f apres la 1ere) -- lisibilite geste par geste.
const MEC_TRAVEL_ICONS: MecTravelIcon[] = [
  { html: MECANISMEV3_M_IC_EMAIL, inflowIdx: 0, routeIdx: 0, startFrame: 10, slotAngleDeg: -35 },
  { html: MECANISMEV3_M_IC_CHAT, inflowIdx: 1, routeIdx: 0, startFrame: 28, slotAngleDeg: 35 },
  { html: MECANISMEV3_M_IC_DOC, inflowIdx: 2, routeIdx: 1, startFrame: 55, slotAngleDeg: -35 },
  { html: MECANISMEV3_M_IC_EMAIL, inflowIdx: 0, routeIdx: 1, startFrame: 73, slotAngleDeg: 35 },
  { html: MECANISMEV3_M_IC_CHAT, inflowIdx: 1, routeIdx: 2, startFrame: 100, slotAngleDeg: -35 },
  { html: MECANISMEV3_M_IC_DOC, inflowIdx: 2, routeIdx: 2, startFrame: 118, slotAngleDeg: 35 },
  { html: MECANISMEV3_M_IC_EMAIL, inflowIdx: 0, routeIdx: 3, startFrame: 145, slotAngleDeg: -35 },
  { html: MECANISMEV3_M_IC_CHAT, inflowIdx: 1, routeIdx: 3, startFrame: 163, slotAngleDeg: 35 },
  { html: MECANISMEV3_M_IC_DOC, inflowIdx: 2, routeIdx: 4, startFrame: 190, slotAngleDeg: -35 },
  { html: MECANISMEV3_M_IC_EMAIL, inflowIdx: 0, routeIdx: 4, startFrame: 208, slotAngleDeg: 35 },
];

const INFLOW_DURATION = 32; // frames pour glisser de l'entree au module
const TRAVERSE_DURATION = 14; // frames pour traverser visuellement le module
const ROUTE_DURATION = 40; // frames pour glisser du module a la destination
const MEC_ICON_SCALE = 2.0; // taille doublee (retour Aziz : "doubler la taille des icones")
const MEC_DEST_ORBIT_R = 30; // rayon d'ecart autour du centre de la destination (slotAngleDeg)

const MecTravelIconEl: React.FC<{ icon: MecTravelIcon; frame: number }> = ({ icon, frame }) => {
  const localFrame = frame - icon.startFrame;
  if (localFrame < 0) return null;

  const inflowPath = MEC_INFLOW_PATHS[icon.inflowIdx];
  const inflowLen = getLength(inflowPath);
  const route = MEC_ROUTE_PATHS[icon.routeIdx];
  const routeLen = getLength(route.d);

  const inflowT = interpolate(localFrame, [0, INFLOW_DURATION], [0, 1], { extrapolateRight: "clamp" });
  const traverseStart = INFLOW_DURATION;
  const traverseT = interpolate(localFrame, [traverseStart, traverseStart + TRAVERSE_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const routeStart = traverseStart + TRAVERSE_DURATION;
  const routeT = interpolate(localFrame, [routeStart, routeStart + ROUTE_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let x: number;
  let y: number;
  if (localFrame < traverseStart) {
    // PHASE 1 : glisse le long de l'inflow path (slow-in/slow-out, pas lineaire)
    const eased = inflowT < 0.5 ? 2 * inflowT * inflowT : 1 - Math.pow(-2 * inflowT + 2, 2) / 2;
    const p = getPointAtLength(inflowPath, eased * inflowLen);
    x = p.x;
    y = p.y;
  } else if (localFrame < routeStart) {
    // PHASE 2 : TRAVERSE le module -- translation continue du point de FIN reel de l'inflow
    // (pas MEC_CENTER, pour eviter un saut) vers le point de DEBUT reel du route path, en
    // passant par le centre du module -- jamais de saut/teleportation (consigne Aziz : glisser).
    const inflowEndPoint = getPointAtLength(inflowPath, inflowLen);
    const routeStartPoint = getPointAtLength(route.d, 0);
    // ease-in-out + passage explicite par MEC_CENTER a mi-parcours (courbe, pas une ligne
    // directe qui couperait au travers du module sans jamais sembler le "traverser")
    const eased = traverseT < 0.5 ? 2 * traverseT * traverseT : 1 - Math.pow(-2 * traverseT + 2, 2) / 2;
    if (eased < 0.5) {
      const t2 = eased * 2;
      x = inflowEndPoint.x + (MEC_CENTER.x - inflowEndPoint.x) * t2;
      y = inflowEndPoint.y + (MEC_CENTER.y - inflowEndPoint.y) * t2;
    } else {
      const t2 = (eased - 0.5) * 2;
      x = MEC_CENTER.x + (routeStartPoint.x - MEC_CENTER.x) * t2;
      y = MEC_CENTER.y + (routeStartPoint.y - MEC_CENTER.y) * t2;
    }
  } else {
    // PHASE 3 : glisse le long du route path jusqu'a la destination, PUIS Y RESTE (routeT clampe
    // a 1, aucune disparition -- l'icone reste visible sur le cercle jusqu'a la fin du panneau).
    // Sur les 15 dernieres frames du trajet, deporte progressivement vers slotAngleDeg (evite que
    // les 2 icones d'une meme destination se superposent exactement -- retour Aziz : "2-3 icones
    // pour chaque departement").
    const eased = routeT < 0.5 ? 2 * routeT * routeT : 1 - Math.pow(-2 * routeT + 2, 2) / 2;
    const p = getPointAtLength(route.d, eased * routeLen);
    const slotAngleRad = (icon.slotAngleDeg * Math.PI) / 180;
    const slotX = route.dest.x + Math.cos(slotAngleRad) * MEC_DEST_ORBIT_R;
    const slotY = route.dest.y + Math.sin(slotAngleRad) * MEC_DEST_ORBIT_R;
    const slotBlend = interpolate(routeT, [0.75, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    x = p.x + (slotX - p.x) * slotBlend;
    y = p.y + (slotY - p.y) * slotBlend;
  }

  const appear = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  // legere pulsation une fois arrivee a destination (routeT===1) -- signale "traite", jamais fige net
  const arrived = routeT >= 0.999;
  const settledPulse = arrived ? 1 + 0.04 * Math.sin((frame - (icon.startFrame + routeStart + ROUTE_DURATION)) / 14) : 1;

  return (
    <g
      opacity={appear}
      transform={`translate(${x} ${y}) scale(${MEC_ICON_SCALE * settledPulse})`}
      dangerouslySetInnerHTML={{ __html: icon.html }}
    />
  );
};

// Frame a laquelle chaque route "s'active" en premier (icone dont le routeIdx correspond, la
// plus precoce) -- sert au staging SEQUENTIEL strict (une route en avant a la fois) demande
// convergent par les 3 modeles du da-brief downstream (Gemini/Kimi/GPT).
function firstIconFrameForRoute(routeIdx: number) {
  const icons = MEC_TRAVEL_ICONS.filter((it) => it.routeIdx === routeIdx);
  return Math.min(...icons.map((it) => it.startFrame));
}
const MEC_ROUTE_ACTIVE_ORDER = MEC_ROUTE_PATHS.map((_, i) => i).sort(
  (a, b) => firstIconFrameForRoute(a) - firstIconFrameForRoute(b)
);

const PanneauMecanismeV4: React.FC = () => {
  const frame = useCurrentFrame();
  const localEnd = RESOLUTION_START - MECANISME_START;

  const archIn = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const moduleIn = spring({ frame, fps: FPS, config: { mass: 1, damping: 14, stiffness: 100 }, durationInFrames: 30 });
  const modulePulse = 1 + 0.02 * Math.sin(frame / 22);

  const camScale = interpolate(frame, [0, localEnd], [1.02, 1], { extrapolateRight: "clamp" });
  const shake = cameraShake(frame, 1.5, localEnd);

  // STAGING SEQUENTIEL STRICT : une route en avant (orange plein, path qui se DESSINE) a la
  // fois, les autres deja reveleees restent en retrait (blanc attenue) -- retour da-brief
  // downstream (Gemini+Kimi+GPT convergent) : "5 destinations en meme temps = illisible,
  // montrer 1 cas puis generaliser". La route reste "active" jusqu'a ce que la SUIVANTE
  // commence a se reveler.
  //
  // DUREE DE TRACE ALLONGEE (22f=0.73s -> 36f=1.2s) -- retour Aziz (2026-08-06, 4e passe) :
  // "le stroke-dasharray, notre signature registre, ne se voit pas assez, trop rapide" --
  // verification : 22f etait effectivement trop court pour lire "en train de se dessiner"
  // plutot qu'un simple fade. Demarre desormais PLUS TOT (-24f au lieu de -8f) pour que le
  // trace soit COMPLET avec une vraie marge AVANT que l'icone ne commence a glisser dessus
  // (l'icone arrive sur la route a firstIconFrame+INFLOW_DURATION+TRAVERSE_DURATION -- le
  // trace doit etre fini bien avant, sinon l'icone semble glisser sur un trait qui se dessine
  // encore sous elle, lecture confuse).
  const ROUTE_DRAW_DURATION = 36;
  const routeRevealFrame = (routeIdx: number) => firstIconFrameForRoute(routeIdx) + INFLOW_DURATION + TRAVERSE_DURATION - 24;
  const routeVisibility = (routeIdx: number) => {
    const revealAt = routeRevealFrame(routeIdx);
    return interpolate(frame, [revealAt, revealAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };
  const isRouteActive = (routeIdx: number) => {
    const orderPos = MEC_ROUTE_ACTIVE_ORDER.indexOf(routeIdx);
    const nextRouteIdx = MEC_ROUTE_ACTIVE_ORDER[orderPos + 1];
    const nextRevealAt = nextRouteIdx !== undefined ? routeRevealFrame(nextRouteIdx) : Infinity;
    return frame < nextRevealAt;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: MECANISMEV3_DEFS }} />

        <g
          transform={`translate(${W / 2} ${H / 2}) scale(${camScale}) translate(${-W / 2 + shake.x} ${-H / 2 + shake.y})`}
        >
          {/* MECANISMEV3_MEC_GRID (cercles concentriques decoratifs) RETIRE -- retour da-brief
              downstream unanime (3 modeles) : "decoration sans fonction narrative, cree du
              bruit visuel". Seuls les traces FONCTIONNELS (inflow/routes/module) restent. */}
          <Inject html={MECANISMEV3_MEC_FAR_ARCH} attrs={MECANISMEV3_MEC_FAR_ARCH_ATTRS} opacity={archIn} />

          {/* routes : la route ACTIVE se DESSINE en orange plein (stroke-dasharray/dashoffset,
              signature registre SVG -- retour Aziz 2026-08-06 3e passe), les routes deja
              reveleees mais non-actives restent tracees mais attenuees (blanc, opacite reduite) */}
          {MEC_ROUTE_PATHS.map((route, i) => {
            const visibility = routeVisibility(i);
            if (visibility <= 0.01) return null;
            const active = isRouteActive(i);
            const routeLen = getLength(route.d);
            const drawProgress = interpolate(frame, [routeRevealFrame(i), routeRevealFrame(i) + ROUTE_DRAW_DURATION], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const labelFontSize = route.label.length > 6 ? 22 : 26;
            return (
              <g key={route.label} opacity={active ? 1 : 0.4}>
                <path
                  d={route.d}
                  fill="none"
                  stroke={active ? "#FF6B1A" : "#FFFFFF"}
                  strokeWidth={active ? 4 : 2}
                  strokeOpacity={active ? 0.95 : 0.35}
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: routeLen,
                    strokeDashoffset: routeLen * (1 - drawProgress),
                  }}
                />
                <circle
                  cx={route.dest.x}
                  cy={route.dest.y}
                  r={54}
                  fill="#0B1F3A"
                  stroke={active ? "#FF6B1A" : "#FFFFFF"}
                  strokeWidth={active ? 3 : 2}
                  strokeOpacity={active ? 1 : 0.5}
                />
                {/* label EXTERNE (sous le cercle, pas dedans) -- lisible a taille normale,
                    jamais recouvert par les icones qui arrivent dans le cercle */}
                <text
                  x={route.dest.x}
                  y={route.dest.y + 54 + 34}
                  textAnchor="middle"
                  fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
                  fontSize={labelFontSize}
                  fontWeight="700"
                  letterSpacing="1"
                  fill={active ? "#FF6B1A" : "#FFFFFF"}
                  opacity={active ? 1 : 0.6}
                >
                  {route.label}
                </text>
              </g>
            );
          })}

          {/* traces des 3 inflow -- se DESSINENT elles aussi (au lieu d'un simple fade fixe).
              Duree allongee (25f=0.83s -> 45f=1.5s) -- meme correction que les routes : trop
              rapide pour se lire comme un trace en direct plutot qu'un fade. Demarre a la
              frame 0 du panneau (avant meme la 1ere icone) donc pas de contrainte de timing
              avec les icones ici, juste allonger pour la lisibilite. */}
          {MEC_INFLOW_PATHS.map((d, i) => {
            const inflowLen = getLength(d);
            const drawProgress = interpolate(frame, [0, 45], [0, 1], { extrapolateRight: "clamp" });
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="url(#m-trailO)"
                strokeWidth={3}
                opacity={0.7}
                style={{ strokeDasharray: inflowLen, strokeDashoffset: inflowLen * (1 - drawProgress) }}
              />
            );
          })}

          <g
            transform={`translate(${MEC_CENTER.x} ${MEC_CENTER.y}) scale(${modulePulse}) translate(${-MEC_CENTER.x} ${-MEC_CENTER.y})`}
          >
            <Inject html={MECANISMEV3_MEC_MODULE} attrs={MECANISMEV3_MEC_MODULE_ATTRS} opacity={moduleIn} />
          </g>

          {MEC_TRAVEL_ICONS.map((icon, i) => (
            <MecTravelIconEl key={i} icon={icon} frame={frame} />
          ))}
        </g>
      </svg>

      {/* SFX ponctuel a l'arrivee de chaque icone a destination (fin de ROUTE_DURATION) --
          signale "traite" pour cette destination, coherent avec la lisibilite sequentielle. */}
      {MEC_TRAVEL_ICONS.map((icon, i) => {
        const arrivalFrame = icon.startFrame + INFLOW_DURATION + TRAVERSE_DURATION + ROUTE_DURATION;
        return (
          <Sequence key={i} from={arrivalFrame} durationInFrames={30} layout="none">
            <Audio src={staticFile("_client-sim/flowdesk/audio/sfx/sfx-notif-generic-soft.mp3")} volume={0.4} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// PANNEAU 4 -- RESOLUTION. Consigne Aziz (STATUS.md) : clip personnage calme+
// clavier en boucle (LoopedImageSequence deja prete) au CENTRE, "TRAITE" au-
// dessus, icones rangees en CERCLE ORGANISE autour de lui -- boucle visuelle
// avec le chaos du panneau 1 (MEMES icones que ORBIT_ICONS/CHAOSV3_IC_*,
// dispersees/en orbite chaotique au P1, rangees/immobiles ici).
//
// Geometrie clip : source panel2-frames 1200x794 (ratio identique au panel1,
// 1.51), affiche en cover dans 1920x1080 -- personnage DEJA cadre au centre
// du clip source (contrairement au panel1), mapping mesure 2026-08-06 :
// centre ~(944,593) dans le repere de sortie -- cf verification visuelle
// frame source, pas de biais de decentrage a corriger ici.
// ---------------------------------------------------------------------------
const RES_CENTER = { x: 944, y: 500 }; // legerement remonte vs le centre mesure du buste (593)
// pour laisser la place au mot TRAITE au-dessus sans chevaucher le clip
const RES_ICON_RING_RADIUS = 430;

// memes 6 icones que le Panneau 1 (CHAOSV3_IC_*), memes labels -- coherence boucle narrative
// angles decales (aucune icone a -90deg/sommet) pour laisser la zone haute LIBRE pour le mot
// TRAITE -- collision constatee 2026-08-06 (icone email pile derriere le mot au premier rendu).
const RES_RING_ICONS = [
  { html: CHAOSV3_IC_EMAIL, angleDeg: -150, label: "email" },
  { html: CHAOSV3_IC_CHAT, angleDeg: -90 + 60, label: "chat" },
  { html: CHAOSV3_IC_SHEET, angleDeg: -30 + 60, label: "sheet" },
  { html: CHAOSV3_IC_PHONE, angleDeg: 30 + 60, label: "phone" },
  { html: CHAOSV3_IC_DOC, angleDeg: 90 + 60, label: "doc" },
  { html: CHAOSV3_IC_BELL, angleDeg: 150 + 60, label: "bell" },
];

const ResRingIconEl: React.FC<{ icon: (typeof RES_RING_ICONS)[number]; index: number; frame: number }> = ({
  icon,
  index,
  frame,
}) => {
  // arrivee echelonnee (staging sequentiel, coherent avec les autres panneaux), PUIS immobile
  // (cercle ORGANISE -- contraste delibere avec l'orbite jamais figee du chaos P1 : ici le
  // repos EST le message). Tres leger flottement radial (jamais totalement fige, cf regle
  // "rien de completement statique") mais amplitude minime, pas un mouvement lisible comme tel.
  const appearAt = 20 + index * 12;
  const appear = spring({
    frame: Math.max(0, frame - appearAt),
    fps: FPS,
    config: { mass: 0.9, damping: 16, stiffness: 90 },
    durationInFrames: 30,
  });
  if (appear <= 0.01) return null;

  const angleRad = (icon.angleDeg * Math.PI) / 180;
  const breathe = 1 + 0.015 * Math.sin(frame / 45 + index * 2); // flottement minime, quasi imperceptible
  const x = RES_CENTER.x + Math.cos(angleRad) * RES_ICON_RING_RADIUS * breathe;
  const y = RES_CENTER.y + Math.sin(angleRad) * RES_ICON_RING_RADIUS * 0.85 * breathe;

  return (
    <g
      opacity={appear}
      transform={`translate(${x} ${y}) scale(${appear * 1.3})`}
      dangerouslySetInnerHTML={{ __html: icon.html }}
    />
  );
};

// Anneau qui se REFERME progressivement autour du disque du clip -- retour Aziz (2026-08-06,
// 2e passe) : "montrer le contour du cercle qui se ferme lentement... rajouter une icone de
// cadenas pour montrer que c'est bien traite". Geometrie exacte du disque HTML (centre 944,718,
// rx=420 ry=278 -- different de RES_CENTER qui sert aux icones/mot, decale plus haut pour leur
// laisser de la place). Trace via un <ellipse> avec strokeDasharray = perimetre, dashoffset qui
// diminue de perimetre a 0 sur la duree du panneau (dessin complet a la toute fin, pas un simple
// fade -- le contour progresse visiblement comme un vrai trace).
const RES_RING_CENTER = { x: 944, y: 718 };
const RES_RING_RX = 420;
const RES_RING_RY = 278;
// perimetre approx d'une ellipse (formule de Ramanujan)
const RES_RING_PERIMETER = Math.PI * (3 * (RES_RING_RX + RES_RING_RY) - Math.sqrt((3 * RES_RING_RX + RES_RING_RY) * (RES_RING_RX + 3 * RES_RING_RY)));

const PanneauResolutionV4: React.FC = () => {
  const frame = useCurrentFrame();
  const localEnd = TOTAL_FRAMES - RESOLUTION_START;

  const videoIn = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  // EASE-OUT PRONONCE (principe V3 conserve) : camera nettement plus lente que les 3 panneaux
  // precedents -- vend "controle calme" par contraste.
  const camScale = interpolate(frame, [0, localEnd], [1.04, 1], { extrapolateRight: "clamp" });
  const shakeDecay = interpolate(frame, [0, 60], [0.3, 0.05], { extrapolateRight: "clamp" });
  const shake = cameraShake(frame, 1, localEnd * (1 / Math.max(shakeDecay, 0.05)) * shakeDecay);

  // trace de l'anneau : demarre a 15f (apres le clip), se ferme completement sur ~200f.
  // EASE-OUT PUR (pas in-out symetrique) -- retour da-brief downstream (Kimi) : "decelaration
  // longue et amortie" pour vendre physiquement le controle calme -- rapide au debut (l'ordre
  // s'installe vite), tres lent en fin de trace (le calme se stabilise), jamais symetrique.
  const ringDraw = interpolate(frame, [15, 215], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringEased = 1 - Math.pow(1 - ringDraw, 3); // cubic ease-out

  // cadenas : SECONDARY ACTION apres la fermeture complete de l'anneau (spring nerveux, meme
  // grammaire que le checkmark V3 "impact" -- pop net qui confirme "verrouille/traite").
  const lockIn = spring({
    frame: Math.max(0, frame - 220),
    fps: FPS,
    config: { mass: 0.85, damping: 11, stiffness: 170 },
    durationInFrames: 22,
  });

  // SECONDARY ACTION desynchronisee : TRAITE est la CONFIRMATION FINALE, apres le cadenas --
  // corrige un defaut releve par le da-brief downstream (Kimi+GPT) : le mot apparaissait a 35f,
  // bien AVANT que l'anneau ne soit ferme (215f) et le cadenas pose (220f), ce qui annoncait la
  // resolution avant qu'elle soit visuellement demontree. Ordre desormais strict : anneau se
  // ferme -> cadenas pop -> TRAITE (245f, juste apres la fin du spring du cadenas a 242f).
  const wordIn = spring({
    frame: Math.max(0, frame - 245),
    fps: FPS,
    config: { mass: 0.9, damping: 13, stiffness: 130 },
    durationInFrames: 24,
  });
  const wordPulse = 1 + 0.02 * Math.sin(frame / 35);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AbsoluteFill
        style={{
          transform: `scale(${camScale}) translate(${shake.x}px, ${shake.y}px)`,
          transformOrigin: "center center",
        }}
      >
        {/* clip personnage calme+clavier, sequence PNG alpha en boucle, centre sur RES_CENTER.
            IMPORTANT : le personnage de CE clip est trace en #0B1F3A (marine) sur fond BLANC
            chroma-keye transparent -- l'INVERSE du panel1 (personnage blanc / fond marine deja
            en dur). Sur le fond marine du panneau, le personnage marine devient invisible sans
            un disque clair derriere lui (verifie 2026-08-06, silhouette quasi indetectable au
            premier rendu). Disque blanc CERCLE derriere le clip pour retablir le contraste --
            coherent avec le cadrage "circulaire" deja demande par Aziz pour ce panneau. */}
        <AbsoluteFill style={{ opacity: videoIn }}>
          <div
            style={{
              position: "absolute",
              left: RES_CENTER.x - 420,
              top: RES_CENTER.y - 60,
              width: 840,
              height: 556,
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: "#F4F7FB",
              boxShadow: "0 0 60px 10px rgba(255,255,255,0.15)",
            }}
          >
            <LoopedImageSequence
              frameFilePattern={(i) => `_client-sim/flowdesk/video/panel2-frames/f${String(i).padStart(4, "0")}.png`}
              frameCount={PANEL2_SRC_FRAMES}
              sourceFps={PANEL2_SRC_FPS}
              compositionFps={FPS}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }}
            />
          </div>
        </AbsoluteFill>

        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <defs dangerouslySetInnerHTML={{ __html: CHAOSV3_DEFS }} />

          {/* Anneau qui se REFERME progressivement autour du disque (consigne Aziz). Trace via
              strokeDasharray = perimetre complet / dashoffset qui diminue -- le contour se
              dessine visiblement, pas un fade.
              PIEGE EVITE : `rotate(-90)` sur un <ellipse> a RX != RY fait pivoter la FORME
              elle-meme (echange visuel rx/ry), pas seulement le point de depart du trace --
              bug constate 2026-08-06 : l'anneau rendu etait 420x278 tourne en 278x420, bien
              plus etroit/haut que le disque et debordant du cadre. Pas de rotation ici -- le
              trace demarre a son point natif (3h, angle 0 SVG standard), toujours geometriquement
              exact sur le disque. */}
          <ellipse
            cx={RES_RING_CENTER.x}
            cy={RES_RING_CENTER.y}
            rx={RES_RING_RX}
            ry={RES_RING_RY}
            fill="none"
            stroke="#FF6B1A"
            strokeWidth={6}
            strokeLinecap="round"
            opacity={interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            style={{
              strokeDasharray: RES_RING_PERIMETER,
              strokeDashoffset: RES_RING_PERIMETER * (1 - ringEased),
            }}
          />

          {RES_RING_ICONS.map((icon, i) => (
            <ResRingIconEl key={icon.label} icon={icon} index={i} frame={frame} />
          ))}

          {/* Cadenas -- apparait UNE FOIS l'anneau completement referme (SECONDARY ACTION,
              spring nerveux apres frame 220) -- confirme visuellement "bien traite/verrouille"
              en plus du mot TRAITE, positionne sur le contour de l'anneau (point de fermeture,
              en haut). */}
          <g
            transform={`translate(${RES_RING_CENTER.x} ${RES_RING_CENTER.y - RES_RING_RY}) scale(${lockIn})`}
            opacity={lockIn}
          >
            <circle r="42" fill="#FF6B1A" />
            <rect x="-16" y="-4" width="32" height="26" rx="4" fill="#FFFFFF" />
            <path
              d="M -12 -4 V -14 A 12 12 0 0 1 12 -14 V -4"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="0" cy="9" r="3.5" fill="#FF6B1A" />
          </g>

          {/* "TRAITE" au-dessus du clip -- SECONDARY ACTION desynchronisee (spring apres 35f) */}
          <g
            transform={`translate(${RES_CENTER.x} ${RES_CENTER.y - 330}) scale(${wordIn * wordPulse})`}
            opacity={wordIn}
          >
            <rect x="-180" y="-46" width="360" height="92" rx="46" fill="#FFFFFF" />
            <path
              d="M -60 2 L -20 40 L 60 -38"
              fill="none"
              stroke="#FF6B1A"
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(-118 0) scale(0.55)"
            />
            <text
              x="24"
              y="12"
              textAnchor="middle"
              fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
              fontSize="40"
              fontWeight="700"
              letterSpacing="2"
              fill="#0B1F3A"
            >
              TRAITÉ
            </text>
          </g>
        </svg>
      </AbsoluteFill>

      <Audio
        src={staticFile("_client-sim/flowdesk/audio/panel2-keyboard-sfx.mp3")}
        volume={(f) => interpolate(f, [0, 20, localEnd - 20, localEnd], [0, 0.7, 0.7, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
        loop
      />
    </AbsoluteFill>
  );
};

// Previews individuelles (validation panneau par panneau, gardees utiles pour verifier un
// panneau isole sans re-render toute la composition) --------------------------------------
export const FlowdeskV4Panel1Preview: React.FC = () => <PanneauChaosV4 />;
export const FLOWDESK_V4_PANEL1_PREVIEW_FRAMES = BASCULE_START - CHAOS_START;

export const FlowdeskV4Panel2Preview: React.FC = () => <PanneauBasculeV4 />;
export const FLOWDESK_V4_PANEL2_PREVIEW_FRAMES = MECANISME_START - BASCULE_START;

export const FlowdeskV4Panel3Preview: React.FC = () => <PanneauMecanismeV4 />;
export const FLOWDESK_V4_PANEL3_PREVIEW_FRAMES = RESOLUTION_START - MECANISME_START;

export const FlowdeskV4Panel4Preview: React.FC = () => <PanneauResolutionV4 />;
export const FLOWDESK_V4_PANEL4_PREVIEW_FRAMES = TOTAL_FRAMES - RESOLUTION_START;

// ---------------------------------------------------------------------------
// TransitionLayer (identique V2/V3) : whip-pan blur+opacity, sa propre useCurrentFrame()
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

// Petit wrapper Sequence interne qui decale la frame vue par les enfants (compense le
// TRANSITION_OVERLAP de demarrage anticipe de la Sequence parente).
const OffsetFrame: React.FC<{ offset: number; children: React.ReactNode }> = ({ offset, children }) => (
  <Sequence from={offset} layout="none">
    {children}
  </Sequence>
);

// ---------------------------------------------------------------------------
// COMPOSITION PRINCIPALE V4 -- 4 panneaux (chaos/bascule/mecanisme/resolution),
// transitions whip-pan identiques V3 (TRANSITION_OVERLAP=35f), meme narration/
// musique deja generees (timing IDENTIQUE au forced-alignment V3 -- les 4
// panneaux V4 durent exactement CHAOS_START/BASCULE_START/MECANISME_START/
// RESOLUTION_START/TOTAL_FRAMES identiques a V3, seul le CONTENU visuel change).
// ---------------------------------------------------------------------------
export const FlowdeskAbstraitV4: React.FC = () => {
  const chaosDur = BASCULE_START - CHAOS_START;
  const basculeDur = MECANISME_START - BASCULE_START;
  const mecanismeDur = RESOLUTION_START - MECANISME_START;
  const resolutionDur = TOTAL_FRAMES - RESOLUTION_START;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Sequence from={CHAOS_START} durationInFrames={chaosDur}>
        <TransitionLayer edge="out" ownDuration={chaosDur}>
          <PanneauChaosV4 />
        </TransitionLayer>
      </Sequence>

      <Sequence from={BASCULE_START - TRANSITION_OVERLAP} durationInFrames={basculeDur + TRANSITION_OVERLAP}>
        <TransitionLayer edge="in" ownDuration={basculeDur + TRANSITION_OVERLAP}>
          <TransitionLayer edge="out" ownDuration={basculeDur + TRANSITION_OVERLAP}>
            <OffsetFrame offset={TRANSITION_OVERLAP}>
              <PanneauBasculeV4 />
            </OffsetFrame>
          </TransitionLayer>
        </TransitionLayer>
      </Sequence>

      <Sequence from={MECANISME_START - TRANSITION_OVERLAP} durationInFrames={mecanismeDur + TRANSITION_OVERLAP}>
        <TransitionLayer edge="in" ownDuration={mecanismeDur + TRANSITION_OVERLAP}>
          <TransitionLayer edge="out" ownDuration={mecanismeDur + TRANSITION_OVERLAP}>
            <OffsetFrame offset={TRANSITION_OVERLAP}>
              <PanneauMecanismeV4 />
            </OffsetFrame>
          </TransitionLayer>
        </TransitionLayer>
      </Sequence>

      <Sequence from={RESOLUTION_START - TRANSITION_OVERLAP} durationInFrames={resolutionDur + TRANSITION_OVERLAP}>
        <TransitionLayer edge="in" ownDuration={resolutionDur + TRANSITION_OVERLAP}>
          <OffsetFrame offset={TRANSITION_OVERLAP}>
            <PanneauResolutionV4 />
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
