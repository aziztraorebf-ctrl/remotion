// AtlasV2ArmyDeployScene — "Deux armees se deploient face a face"
// =============================================================================
// 3e beat produit via le systeme Atlas (test 2026-06-04). Eprouve le palier
// au-dessus de la confrontation 1v1 : la CHOREGRAPHIE MULTI-SPRITES en 2 temps.
//   PHASE 1 — FILES : chaque camp avance en FILE INDIENNE (Recette A du PixelLab-
//     Playbook : 1 path, N sprites par offset de parametre). 4 Mali montent depuis
//     le SO (walk east), 4 Sosso descendent depuis le NE (walk west).
//   PHASE 2 — DEPLOIEMENT : arrives a mi-distance, chaque file s'OUVRE en LIGNE
//     horizontale (les soldats glissent lateralement pour s'aligner cote a cote,
//     face a l'ennemi). C'est le morceau NEUF : une transition file->ligne.
//   PHASE 3 — FACE-A-FACE D'ARMEES : les 2 lignes se font face + cartouche +
//     Spotlight Insert chiffre (reutilise le pattern valide du beat confrontation).
//
// TEST CRITIQUE (anti-moonwalk multi-sprites) : pendant le deploiement, chaque
//   soldat se deplace lateralement ; sa `direction` est DEDUITE du signe de son
//   deplacement horizontal (dx) recalcule par frame -> il marche TOUJOURS du bon
//   pied, jamais a reculons. Sprites est/ouest natifs seulement (zero generation).
//
// Anti-clonage : reutilise la grammaire camera (drift+zoom+tilt annule) et le
//   Spotlight Insert, mais la choregraphie file->ligne est NEUVE.
// COORDONNEES : axe Niani <-> Sahara2 via Sahara1 (waypoints natifs du json mercWide).

import {
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasEmpire,
  AtlasSubtleStars,
  AtlasCartouche,
  atlasV2Data as data,
} from "../atlas-v2-components";
import { AtlasSharedDefs } from "../atlas-v2-shared-defs";
import { getFlagFill } from "../atlas-v2-flags";
import { AtlasPixelChar } from "./AtlasPixelChar";

interface ArmyDeployBeats {
  // En prod : forced-alignment Whisper. Ici : props du wrapper demo.
  march: number; // les 2 files entrent et avancent
  deploy: number; // les files s'ouvrent en ligne (debut du redeploiement lateral)
  formed: number; // les 2 lignes sont formees, face a face + cartouche
  insert: number; // la carte dim, l'encart rapport de forces surgit
  insertOut: number; // l'encart se retire
  charge?: number; // (optionnel) les 2 lignes se ruent l'une sur l'autre (anim charge)
  clash?: number; // (optionnel) contact : estoc (spear_attack, play-once)
  death?: number; // (optionnel) le camp perdant encaisse : 2-3 soldats tombent + disparaissent
  clashEnd?: number; // (optionnel) fin du combat
}

interface ArmyDeploySceneProps {
  startFrame: number;
  endFrame: number;
  beats: ArmyDeployBeats;
  perSide?: number; // soldats par camp (defaut 4)
  forceA?: string;
  forceB?: string;
  labelA?: string;
  labelB?: string;
  // Mode de declenchement du combat :
  //   "sequential" = camp A attaque, PUIS camp B repond (delai CLASH_SEQ_DELAY)
  //   "simultaneous" = les 2 camps attaquent en meme temps
  clashMode?: "sequential" | "simultaneous";
  // Camp qui subit les pertes (tombe a `death`). "B" par defaut.
  losingSide?: "A" | "B";
  // Combien de soldats du camp perdant tombent (defaut 3, depuis l'arriere).
  casualties?: number;
}

const CLASH_SEQ_DELAY = 14; // frames de retard du camp B en mode sequentiel

// Helper : position le long d'un segment [p0,p1] au parametre t (0..1), clamp.
const lerpSeg = (
  p0: [number, number],
  p1: [number, number],
  t: number
): [number, number] => {
  const c = Math.max(0, Math.min(1, t));
  return [p0[0] + (p1[0] - p0[0]) * c, p0[1] + (p1[1] - p0[1]) * c];
};

export const AtlasV2ArmyDeployScene: React.FC<ArmyDeploySceneProps> = ({
  startFrame,
  endFrame,
  beats,
  perSide = 4,
  forceA = "8 000",
  forceB = "30 000",
  labelA = "SOSSO",
  labelB = "MALI",
  clashMode = "sequential",
  losingSide = "B",
  casualties = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame >= endFrame) return null;

  const localFrame = frame - startFrame;
  const { march, deploy, formed, insert, insertOut, charge, clash, death, clashEnd } =
    beats;

  // Frame d'estoc par camp (selon clashMode).
  const clashA = clash; // camp A (Mali, gauche) attaque a `clash`
  const clashB =
    clash === undefined
      ? undefined
      : clashMode === "sequential"
        ? clash + CLASH_SEQ_DELAY
        : clash; // simultane

  // ─── GEOMETRIE (repere natif mercWide via waypoints) ──────────────────────────
  const wp = data.mercWide.caravaneWaypoints;
  const sahara1 = wp.Sahara1 as [number, number]; // [~312,588] zone de rencontre

  // Centre du champ de bataille = Sahara1.
  const fieldX = sahara1[0];
  const fieldY = sahara1[1];

  // Les 2 lignes se font face de part et d'autre d'un axe vertical au centre.
  // Camp A (Mali) se forme a GAUCHE ; camp B (Sosso) a DROITE.
  // lineGap RESSERRE (14) : tension d'avant-bataille (demande Aziz, valid 100%).
  const lineGap = 14; // ecart entre les 2 lignes (de chaque cote du centre)
  const soldierSpacing = 30; // ecart vertical entre soldats d'une meme ligne
  const lineTopY = fieldY - ((perSide - 1) * soldierSpacing) / 2; // centre la ligne verticalement

  // Points de DEPART terrestres et SYMETRIQUES (fix Aziz : le camp droit partait dans
  // la Mediterranee). Construits par offset depuis le champ, vers le continent :
  //   Mali  arrive du SUD-OUEST (en terre, cote empire) ;
  //   Sosso arrive du SUD-EST   (en terre, cote Tchad/Niger) — PAS du nord (mer).
  const aStart: [number, number] = [fieldX - 150, fieldY + 110]; // SO terrestre
  const bStart: [number, number] = [fieldX + 165, fieldY + 95]; // SE terrestre (continent)

  // Tete de file : juste devant la position de ligne du camp.
  const aFileEnd: [number, number] = [fieldX - lineGap - 55, fieldY]; // tete de file Mali
  const bFileEnd: [number, number] = [fieldX + lineGap + 55, fieldY]; // tete de file Sosso
  const fileStep = 26; // espacement entre soldats dans la file (le long du path)

  // Position LIGNE (phase 3) : cote a cote, perpendiculaire a l'axe.
  const aLineX = fieldX - lineGap; // ligne Mali (gauche)
  const bLineX = fieldX + lineGap; // ligne Sosso (droite)

  // ─── ETAT D'UN SOLDAT (camp, index) -> {x, y, direction, animated, anim} ──────
  // tM (file) calcule par soldat dans computeSoldier ; tD (deploiement) en VAGUE par idx.
  type SoldierState = {
    x: number;
    y: number;
    dir: "east" | "west";
    moving: boolean;
    anim: string; // "walk_cycle" | "charge" | "spear_attack" | "death"
    frameCount: number;
    loop: boolean; // false => play-once (estoc, mort)
    animStartAt: number; // recale le cycle au changement d'etat
    opacity: number; // pour le fade-out des soldats qui meurent
  };

  // memorise la position x de la frame precedente par soldat pour deduire la direction.
  // En SVG pur (pas de state), on calcule analytiquement la position a frame ET a frame-1.
  const computeSoldier = (
    camp: "A" | "B",
    idx: number,
    atFrame: number
  ): { x: number; y: number } => {
    const tM = interpolate(atFrame, [march, deploy], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    // VAGUE de deploiement (solution #2) : chaque soldat du fond (idx eleve) commence
    // son redeploiement un peu plus tard -> la ligne se forme par vague, pas en bloc.
    const waveStagger = 7; // frames de retard par rang
    const dWindow = formed - deploy;
    const dStart = deploy + idx * waveStagger;
    const dEnd = dStart + Math.max(1, dWindow - (perSide - 1) * waveStagger);
    const tD = interpolate(atFrame, [dStart, dEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // --- Phase FILE : tete de file atteint *FileEnd ; soldats suivent par offset ---
    const start = camp === "A" ? aStart : bStart;
    const fileEnd = camp === "A" ? aFileEnd : bFileEnd;
    // direction d'avance de la file (vecteur unitaire start->fileEnd)
    const fdx = fileEnd[0] - start[0];
    const fdy = fileEnd[1] - start[1];
    const flen = Math.hypot(fdx, fdy) || 1;
    const ux = fdx / flen;
    const uy = fdy / flen;
    // chaque soldat est `idx*fileStep` derriere la tete, le long de l'axe d'avance.
    const headPos = lerpSeg(start, fileEnd, tM);
    const fileX = headPos[0] - ux * idx * fileStep;
    const fileY = headPos[1] - uy * idx * fileStep;

    // --- Phase LIGNE : position finale cote a cote ---
    const lineX = camp === "A" ? aLineX : bLineX;
    const lineY = lineTopY + idx * soldierSpacing;

    // interpolation file -> ligne (easing doux via smoothstep)
    const e = tD * tD * (3 - 2 * tD);
    let x = fileX + (lineX - fileX) * e;
    const y = fileY + (lineY - fileY) * e;

    // --- Phase CHARGE : les lignes avancent VERS le centre (rapprochement) -------
    // Entre `charge` et `clash`, chaque soldat glisse de sa position-ligne vers une
    // position de contact plus proche du centre (mais pas superposee : on garde un
    // petit gap de contact). Reste fige a partir de `clash`.
    if (charge !== undefined) {
      const chargeEnd = clash ?? charge;
      const tC = interpolate(atFrame, [charge, chargeEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const contactX = camp === "A" ? fieldX - 8 : fieldX + 8; // contact serre au centre
      x = x + (contactX - x) * (tC * tC * (3 - 2 * tC));
    }

    return { x, y };
  };

  const enemyDir = (camp: "A" | "B"): "east" | "west" => (camp === "A" ? "east" : "west");

  const getState = (camp: "A" | "B", idx: number): SoldierState => {
    const cur = computeSoldier(camp, idx, frame);
    const prev = computeSoldier(camp, idx, frame - 1);
    const dx = cur.x - prev.x;
    // direction DEDUITE du deplacement horizontal (anti-moonwalk multi-sprites).
    let dir: "east" | "west";
    if (Math.abs(dx) < 0.05) {
      dir = enemyDir(camp);
    } else {
      dir = dx >= 0 ? "east" : "west";
    }

    const clashX = camp === "A" ? clashA : clashB;

    // ── MORT : soldats de l'arriere du camp perdant tombent a `death` ───────────
    // On choisit les `casualties` derniers index (idx les plus eleves = arriere de ligne).
    const isCasualty = camp === losingSide && idx >= perSide - casualties;
    if (death !== undefined && isCasualty && frame >= death) {
      // leger decalage par soldat pour que la chute soit en cascade, pas en bloc.
      const myDeath = death + (perSide - 1 - idx) * 6;
      if (frame >= myDeath) {
        // anim death play-once, puis fade-out apres la fin de l'anim (~7 frames @8fps).
        const deathAnimFrames = 7; // template falling-back-death
        const deathDurSec = deathAnimFrames / 8; // WALK_FPS
        const fadeStart = myDeath + Math.round(deathDurSec * fps);
        const opacity = interpolate(frame, [fadeStart, fadeStart + 12], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return {
          x: cur.x,
          y: cur.y,
          dir: enemyDir(camp),
          moving: true,
          anim: "death",
          frameCount: deathAnimFrames,
          loop: false,
          animStartAt: myDeath,
          opacity,
        };
      }
    }

    // ── ESTOC : a `clash`, anim spear_attack PLAY-ONCE (ne boucle pas) ──────────
    if (clashX !== undefined && frame >= clashX) {
      return {
        x: cur.x,
        y: cur.y,
        dir: enemyDir(camp),
        moving: true,
        anim: "spear_attack",
        frameCount: 7,
        loop: false, // play-once : l'estoc se fige lance tendue
        animStartAt: clashX,
        opacity: 1,
      };
    }

    // ── CHARGE : entre `charge` et `clash`, les soldats se ruent (anim charge) ───
    if (charge !== undefined && frame >= charge && (clash === undefined || frame < clash)) {
      return {
        x: cur.x,
        y: cur.y,
        dir: enemyDir(camp),
        moving: true,
        anim: "charge",
        frameCount: 6,
        loop: true,
        animStartAt: charge,
        opacity: 1,
      };
    }

    // ── DEFAUT : marche/file/deploiement ────────────────────────────────────────
    const moving = frame < formed && Math.abs(dx) >= 0.05;
    return {
      x: cur.x,
      y: cur.y,
      dir,
      moving,
      anim: "walk_cycle",
      frameCount: 6,
      loop: true,
      animStartAt: march,
      opacity: 1,
    };
  };

  // ─── CAMERA : drift + zoom resserre + tilt annule (grammaire confrontation) ────
  const driftX = Math.sin(frame * 0.014) * 16;
  const driftY = Math.cos(frame * 0.011) * 9;

  const camTargetX = fieldX;
  const camTargetY = fieldY;

  const camZoom = interpolate(
    frame,
    [march, deploy, formed, insertOut, endFrame],
    [1.4, 2.0, 2.6, 2.6, 2.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const tiltPeak = 24;
  const tiltBreath = Math.sin(localFrame * 0.04) * 2;
  const baseTilt = tiltPeak + tiltBreath;
  const effectiveTilt = interpolate(frame, [march, deploy], [baseTilt, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const skewX = effectiveTilt * 0.15;
  const scaleY = 1 - effectiveTilt * 0.008;

  // Bump impact quand les lignes sont formees (les armees "s'arc-boutent").
  const bumpDur = 12;
  const bumpT = interpolate(frame, [formed, formed + bumpDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bump =
    frame >= formed && frame < formed + bumpDur ? 1 + 0.04 * Math.sin(bumpT * Math.PI) : 1;

  // ─── SPOTLIGHT INSERT (reutilise le pattern valide) ───────────────────────────
  const insertSpring = spring({
    frame: frame - insert,
    fps,
    config: { damping: 18, stiffness: 140 },
  });
  const insertOpacity = interpolate(
    frame,
    [insert, insert + 8, insertOut - 12, insertOut],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const dimOpacity = interpolate(
    frame,
    [insert, insert + 12, insertOut - 12, insertOut],
    [0, 0.72, 0.72, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ─── FADE global ──────────────────────────────────────────────────────────────
  const globalFade = interpolate(
    frame,
    [startFrame, startFrame + 15, endFrame - 12, endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ─── PAYS ─────────────────────────────────────────────────────────────────────
  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");

  const indices = Array.from({ length: perSide }, (_, i) => i);

  return (
    <g opacity={globalFade}>
      <AtlasSharedDefs />
      <defs>
        <radialGradient id="armyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ATLAS_COLORS.empireGold} stopOpacity="0.55" />
          <stop offset="70%" stopColor={ATLAS_COLORS.empireGold} stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.6} />

      <g
        transform={`
          translate(${360 + driftX} ${640 + driftY})
          scale(${camZoom * bump} ${camZoom * scaleY * bump})
          skewX(${skewX})
          translate(${-camTargetX} ${-camTargetY})
        `}
      >
        <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.oceanDeep} />

        {otherCountries.map((c) => (
          <path
            key={c.iso}
            d={c.d}
            fill={ATLAS_COLORS.land}
            stroke={ATLAS_COLORS.landStroke}
            strokeWidth="0.8"
            strokeOpacity="0.8"
          />
        ))}

        {mali && (
          <g>
            <path d={mali.d} fill={ATLAS_COLORS.maliFill} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2" />
            <path d={mali.d} fill={getFlagFill("MLI", ATLAS_COLORS.maliFill)} opacity={0.4} stroke="none" />
            <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="14" opacity={0.12} />
            <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="6" opacity={0.22} />
          </g>
        )}

        {data.mercWide.maliEmpire1300 && (
          <AtlasEmpire pathD={data.mercWide.maliEmpire1300} outlineDark={true} />
        )}

        {/* === CAMP A (Mali) gauche + CAMP B (Sosso) droite : === */}
        {/* walk -> ligne -> charge -> estoc (play-once) -> [mort si perdant] === */}
        {frame >= march &&
          (["A", "B"] as const).flatMap((camp) =>
            indices.map((i) => {
              const s = getState(camp, i);
              return (
                <g key={`${camp}${i}`} opacity={s.opacity}>
                  <AtlasPixelChar
                    charPath="atlas-mansa-moussa/characters/soldat-mali"
                    animName={s.anim}
                    x={s.x}
                    y={s.y}
                    size={46}
                    direction={s.dir}
                    animated={s.moving}
                    frameCount={s.frameCount}
                    loop={s.loop}
                    animStartAt={s.animStartAt}
                    appearAt={march}
                  />
                </g>
              );
            })
          )}
      </g>

      {/* === CARTOUCHE titre (haut) — apparait a la formation === */}
      <AtlasCartouche
        text="DEUX ARMEES"
        appearAt={formed}
        disappearAt={insert}
        x={360}
        y={220}
        fontSize={40}
      />

      {/* === SPOTLIGHT INSERT — rapport de forces (pattern valide) === */}
      {frame >= insert && insertOpacity > 0.01 && (
        <>
          <rect x="0" y="0" width="720" height="1280" fill={ATLAS_COLORS.empireOutlineDark} opacity={dimOpacity} pointerEvents="none" />
          <g transform={`translate(360 640) scale(${0.85 + 0.15 * insertSpring})`} opacity={insertOpacity}>
            <circle cx="0" cy="0" r="300" fill="url(#armyGlow)" />
            <rect x="-280" y="-150" width="560" height="300" fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.empireGold} strokeWidth="4" rx="10" />
            <rect x="-270" y="-140" width="540" height="280" fill="none" stroke={ATLAS_COLORS.textInk} strokeWidth="1.5" rx="6" opacity="0.75" />
            <text x="-150" y="-40" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="26" fontWeight="700" fill={ATLAS_COLORS.textInk} letterSpacing="3">{labelA}</text>
            <text x="-150" y="45" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="64" fontWeight="700" fill={ATLAS_COLORS.land}>{forceA}</text>
            <text x="0" y="20" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="56" fontWeight="700" fill={ATLAS_COLORS.empireGold}>⇌</text>
            <text x="150" y="-40" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="26" fontWeight="700" fill={ATLAS_COLORS.textInk} letterSpacing="3">{labelB}</text>
            <text x="150" y="45" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="64" fontWeight="700" fill={ATLAS_COLORS.empireGold}>{forceB}</text>
            <text x="0" y="115" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="22" fontStyle="italic" fill={ATLAS_COLORS.textInk} letterSpacing="2">le rapport de forces</text>
          </g>
        </>
      )}

      {/* === SFX footsteps pendant marche + deploiement (en <Sequence>) === */}
      <Sequence from={march} durationInFrames={Math.max(1, formed - march)}>
        <Audio src={staticFile("_shared/sfx/sfx-footsteps.mp3")} volume={0.4} />
      </Sequence>

      {/* === SFX combat : cri de charge a `charge`, choc d'impact a `clash` === */}
      {charge !== undefined && (
        <Sequence from={charge} durationInFrames={40}>
          <Audio src={staticFile("_shared/sfx/sfx-army-charge.mp3")} volume={0.5} />
        </Sequence>
      )}
      {clash !== undefined && (
        <Sequence from={clash} durationInFrames={40}>
          <Audio src={staticFile("_shared/sfx/sfx-clash-impact.mp3")} volume={0.55} />
        </Sequence>
      )}
    </g>
  );
};
