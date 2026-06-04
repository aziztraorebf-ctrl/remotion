// AtlasV2EncerclementScene — "Cannae" : banc d'essai ENCERCLEMENT (sprites en courbe)
// =============================================================================
// 4e beat systeme Atlas (2026-06-04). BANC D'ESSAI de CAPACITE (pas production : le
// script Hannibal ne parle pas de Cannae, on teste sur carte Mansa pour PROUVER qu'on
// peut representer une manoeuvre d'enveloppement avec des sprites en TRAJECTOIRES
// COURBES — le palier au-dessus de la bataille en ligne droite).
//
// Ce qu'on eprouve (NOUVEAU) :
//   1. Sprites qui suivent une COURBE (spline Catmull-Rom en coords SVG natives), pas
//      un segment droit. Les 2 ailes contournent et se referment derriere l'ennemi.
//   2. Direction du sprite DEDUITE du deplacement (dx/dy) frame par frame -> il marche
//      du bon cote meme en courbe (est/ouest/nord/sud selon la dominante du mouvement).
//   3. Double couche doctrine : N0 (fleches AtlasEncirclement = geographie de la
//      manoeuvre) + N2 (sprites = les acteurs qui l'executent).
//   4. Reutilise le moteur bataille : estoc play-once + pertes (death) sur l'encercle.
//
// Sprites : soldat-mali (walk 4 dirs apres generation n/s). 2 camps teintes (filtre).
//   Camp ROUGE = l'armee qui encercle (les ailes). Camp encercle = au centre.
// COORDONNEES : repere natif mercWide (waypoints du json), comme la bataille.

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
import { AtlasPixelChar } from "./AtlasPixelChar";

type Pt = [number, number];

// ─── Spline Catmull-Rom en coords SVG (repere natif, PAS geoUtils lon/lat) ────────
// Evalue un point a t in [0,1] le long de la courbe passant par tous les waypoints.
const catmullRom = (pts: Pt[], t: number): Pt => {
  if (pts.length < 2) return pts[0] ?? [360, 640];
  if (pts.length === 2) {
    return [
      pts[0][0] + (pts[1][0] - pts[0][0]) * t,
      pts[0][1] + (pts[1][1] - pts[0][1]) * t,
    ];
  }
  const segs = pts.length - 1;
  const scaled = Math.min(Math.max(t, 0), 1) * segs;
  const i = Math.min(Math.floor(scaled), segs - 1);
  const lt = scaled - i;
  const p0 = pts[i - 1] ?? pts[i];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const p3 = pts[i + 2] ?? p2;
  const t2 = lt * lt;
  const t3 = t2 * lt;
  const cr = (a: number, b: number, c: number, d: number) =>
    0.5 *
    (2 * b + (-a + c) * lt + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  return [cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])];
};

// Genere la chaine "d" d'un path SVG echantillonnant la spline (pour tracer la route).
const splinePathD = (pts: Pt[], samples = 64): string => {
  let d = "";
  for (let s = 0; s <= samples; s++) {
    const [x, y] = catmullRom(pts, s / samples);
    d += (s === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
  }
  return d.trim();
};

interface EncerclementBeats {
  enter: number; // les armees apparaissent (encercle au centre, ailes aux flancs)
  envelop: number; // les ailes s'elancent en courbe (enveloppement)
  close: number; // les ailes se referment derriere l'encercle (piege ferme)
  insert: number; // Spotlight "CANNAE" + rapport de forces
  insertOut: number;
  clash: number; // estoc (play-once)
  death: number; // l'encercle subit les pertes
}

interface EncerclementSceneProps {
  startFrame: number;
  endFrame: number;
  beats: EncerclementBeats;
  trappedSize?: number; // soldats encercles dans le bloc (def 6 = 2x3)
}

const FLANK_RED = "#B3322C"; // teinte camp qui encercle (rouge carthaginois)

export const AtlasV2EncerclementScene: React.FC<EncerclementSceneProps> = ({
  startFrame,
  endFrame,
  beats,
  trappedSize = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < startFrame || frame >= endFrame) return null;

  const localFrame = frame - startFrame;
  const { enter, envelop, close, insert, insertOut, clash, death } = beats;

  // ─── GEOMETRIE (repere natif mercWide) ────────────────────────────────────────
  const wp = data.mercWide.caravaneWaypoints;
  const sahara1 = wp.Sahara1 as Pt; // [~312,588] centre du champ
  const fieldX = sahara1[0];
  const fieldY = sahara1[1];

  // L'armee ENCERCLEE : BLOC COMPACT 2 colonnes x N lignes au centre (lisible comme
  // une masse cernee, pas une longue file). Carthaginois... non : l'encercle.
  const blockCols = 2;
  const blockGapX = 24;
  const blockGapY = 24;
  const trappedRows = Math.ceil(trappedSize / blockCols);
  const blockLeftX = fieldX - ((blockCols - 1) * blockGapX) / 2;
  const blockTopY = fieldY - ((trappedRows - 1) * blockGapY) / 2;

  // 1 SEUL cavalier par cote (decision Aziz : plus lisible, pas de chevauchement
  // d'animations, et libere de la place au centre). 3 cotes : OUEST, EST, BAS (sud).
  // TOUS les departs sont TERRESTRES (le nord = Mediterranee -> on ferme par le BAS,
  // pas par le haut). Le bloc est cerne gauche / droite / dessous.
  const ringR = 40; // distance du cavalier au centre du bloc, une fois en place
  // Chaque courbe : depart loin (terre, au sud des flancs) -> arc -> position finale
  // exactement sur l'anneau autour du bloc, oriente vers le centre.
  const wingWest: Pt[] = [
    [fieldX - 175, fieldY + 95], // depart SO terrestre
    [fieldX - 150, fieldY + 10], // arc
    [fieldX - 90, fieldY - 5],
    [fieldX - ringR, fieldY], // cale a GAUCHE du bloc
  ];
  const wingEast: Pt[] = [
    [fieldX + 175, fieldY + 95], // depart SE terrestre
    [fieldX + 150, fieldY + 10],
    [fieldX + 90, fieldY - 5],
    [fieldX + ringR, fieldY], // cale a DROITE du bloc
  ];
  const wingSouth: Pt[] = [
    [fieldX - 30, fieldY + 165], // depart SUD terrestre (Sahel)
    [fieldX + 30, fieldY + 120],
    [fieldX, fieldY + ringR + 8], // ferme le BAS
  ];
  // [courbe, direction d'estoc vers le centre]
  const wings: { curve: Pt[]; attackDir: "east" | "west" | "north" }[] = [
    { curve: wingWest, attackDir: "east" }, // a gauche -> attaque vers l'est (centre)
    { curve: wingEast, attackDir: "west" }, // a droite -> vers l'ouest
    { curve: wingSouth, attackDir: "north" }, // en bas -> vers le nord (centre)
  ];

  // ─── POSITION D'UN SOLDAT D'AILE le long de sa courbe ─────────────────────────
  // t avance de 0 (depart) a 1 (jonction) sur [envelop, close]. Chaque soldat de
  // l'aile est decale en t (file le long de la courbe).
  const wingT = (atFrame: number) =>
    interpolate(atFrame, [envelop, close], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  type SoldierVis = {
    x: number;
    y: number;
    dir: "east" | "west" | "north" | "south";
    anim: string;
    frameCount: number;
    loop: boolean;
    animated: boolean; // false = frame 0 fixe (idle propre, pas fige en pleine foulee)
    animStartAt: number;
    opacity: number;
  };

  // Direction 4-way deduite d'un vecteur de deplacement (dx,dy). Dominante.
  const dir4 = (dx: number, dy: number): "east" | "west" | "north" | "south" => {
    if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? "east" : "west";
    return dy >= 0 ? "south" : "north";
  };

  // Cavalier d'aile (numide) : 1 SEUL par cote. Suit la courbe (anim walk en boucle),
  // direction deduite du mouvement. ARRIVE -> idle propre (frame 0) oriente vers le
  // CENTRE (attackDir), PAS fige en pleine foulee. Le numide n'a pas d'estoc -> idle.
  const wingSoldier = (
    curve: Pt[],
    attackDir: "east" | "west" | "north"
  ): SoldierVis => {
    const tNow = wingT(frame);
    const tPrev = wingT(frame - 1);
    const cur = catmullRom(curve, tNow);
    const prev = catmullRom(curve, tPrev);
    const dx = cur[0] - prev[0];
    const dy = cur[1] - prev[1];

    const arrived = tNow >= 0.999;
    if (arrived) {
      return {
        x: cur[0],
        y: cur[1],
        dir: attackDir, // oriente vers le centre
        anim: "walk_cycle",
        frameCount: 6,
        loop: false,
        animated: false, // frame 0 = idle debout propre (pas fige en foulee)
        animStartAt: envelop,
        opacity: 1,
      };
    }
    const moving = Math.abs(dx) + Math.abs(dy) >= 0.05;
    return {
      x: cur[0],
      y: cur[1],
      dir: moving ? dir4(dx, dy) : attackDir,
      anim: "walk_cycle",
      frameCount: 6,
      loop: true,
      animated: true,
      animStartAt: envelop,
      opacity: 1,
    };
  };

  // Soldat encercle (bloc 2xN) : immobile au centre ; meurt apres `death` (cascade).
  const trappedSoldier = (idx: number): SoldierVis => {
    const col = idx % blockCols;
    const row = Math.floor(idx / blockCols);
    const x = blockLeftX + col * blockGapX;
    const y = blockTopY + row * blockGapY;
    const myDeath = death + idx * 8;
    if (frame >= myDeath) {
      const deathAnimFrames = 7;
      const fadeStart = myDeath + Math.round((deathAnimFrames / 8) * fps);
      const opacity = interpolate(frame, [fadeStart, fadeStart + 12], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      return {
        x,
        // death n'existe qu'en est/ouest (pas south) -> orienter selon la colonne
        // (gauche tombe vers l'ouest, droite vers l'est) pour une frame valide.
        y,
        dir: col === 0 ? "west" : "east",
        anim: "death",
        frameCount: 7,
        loop: false,
        animated: true, // joue la chute une fois
        animStartAt: myDeath,
        opacity,
      };
    }
    return {
      x,
      y,
      dir: "south",
      anim: "walk_cycle",
      frameCount: 6,
      loop: false,
      animated: false, // idle frame 0 propre (face camera)
      animStartAt: enter,
      opacity: 1,
    };
  };

  // ─── CAMERA : drift + zoom resserre + tilt annule ─────────────────────────────
  const driftX = Math.sin(frame * 0.014) * 14;
  const driftY = Math.cos(frame * 0.011) * 8;
  const camZoom = interpolate(
    frame,
    [enter, envelop, insertOut, endFrame],
    [1.5, 2.4, 2.4, 2.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tiltPeak = 22;
  const tiltBreath = Math.sin(localFrame * 0.04) * 2;
  const effectiveTilt = interpolate(frame, [enter, envelop], [tiltPeak + tiltBreath, 7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const skewX = effectiveTilt * 0.15;
  const scaleY = 1 - effectiveTilt * 0.008;

  // ─── SPOTLIGHT INSERT ─────────────────────────────────────────────────────────
  const insertSpring = spring({ frame: frame - insert, fps, config: { damping: 18, stiffness: 140 } });
  const insertOpacity = interpolate(frame, [insert, insert + 8, insertOut - 12, insertOut], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dimOpacity = interpolate(frame, [insert, insert + 12, insertOut - 12, insertOut], [0, 0.72, 0.72, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const globalFade = interpolate(frame, [startFrame, startFrame + 15, endFrame - 12, endFrame], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── PAYS ─────────────────────────────────────────────────────────────────────
  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const other = data.mercWide.countries.filter((c) => c.iso !== "MLI");

  const trappedIdx = Array.from({ length: trappedSize }, (_, i) => i);

  // Progress des fleches d'enveloppement (trace qui suit les ailes).
  const arrowProg = interpolate(frame, [envelop, close], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const renderSprite = (
    key: string,
    s: SoldierVis,
    charPath: string,
    size: number
  ) => (
    <g key={key} opacity={s.opacity}>
      <AtlasPixelChar
        charPath={charPath}
        animName={s.anim}
        x={s.x}
        y={s.y}
        size={size}
        direction={s.dir}
        animated={s.animated}
        frameCount={s.frameCount}
        loop={s.loop}
        animStartAt={s.animStartAt}
        appearAt={enter}
      />
    </g>
  );

  const TRAPPED_CHAR = "atlas-mansa-moussa/characters/soldat-mali"; // a death anim
  const WING_CHAR = "atlas-mansa-moussa/characters/numide-mali"; // cavalerie ailes

  return (
    <g opacity={globalFade}>
      <AtlasSharedDefs />
      <defs>
        <radialGradient id="encGlow" cx="50%" cy="50%" r="50%">
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
          scale(${camZoom} ${camZoom * scaleY})
          skewX(${skewX})
          translate(${-fieldX} ${-fieldY})
        `}
      >
        <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.oceanDeep} />
        {other.map((c) => (
          <path key={c.iso} d={c.d} fill={ATLAS_COLORS.land} stroke={ATLAS_COLORS.landStroke} strokeWidth="0.8" strokeOpacity="0.8" />
        ))}
        {mali && (
          <g>
            <path d={mali.d} fill={ATLAS_COLORS.maliFill} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2" />
            <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="10" opacity={0.1} />
          </g>
        )}
        {data.mercWide.maliEmpire1300 && <AtlasEmpire pathD={data.mercWide.maliEmpire1300} outlineDark={true} />}

        {/* === FLECHES D'ENVELOPPEMENT (N0 : geographie de la manoeuvre, 3 cotes) === */}
        {frame >= envelop && (
          <g opacity={interpolate(frame, [envelop, envelop + 10], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            {wings.map((w, ci) => (
              <path
                key={`arrow${ci}`}
                d={splinePathD(w.curve, 64)}
                fill="none"
                stroke={FLANK_RED}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={1000}
                strokeDashoffset={1000 * (1 - arrowProg)}
                opacity={0.85}
              />
            ))}
          </g>
        )}

        {/* === ENCERCLE (soldat-mali, bloc 2xN) au centre — subit les pertes === */}
        {frame >= enter && trappedIdx.map((i) => renderSprite(`trap${i}`, trappedSoldier(i), TRAPPED_CHAR, 42))}

        {/* === 3 cavaliers numides (1 par cote) qui enferment en courbe === */}
        {frame >= envelop &&
          wings.map((w, ci) =>
            renderSprite(`wing${ci}`, wingSoldier(w.curve, w.attackDir), WING_CHAR, 42)
          )}
      </g>

      {/* === CARTOUCHE === */}
      <AtlasCartouche text="L'ENCERCLEMENT" appearAt={close} disappearAt={insert} x={360} y={220} fontSize={36} />

      {/* === SPOTLIGHT INSERT === */}
      {frame >= insert && insertOpacity > 0.01 && (
        <>
          <rect x="0" y="0" width="720" height="1280" fill={ATLAS_COLORS.empireOutlineDark} opacity={dimOpacity} pointerEvents="none" />
          <g transform={`translate(360 640) scale(${0.85 + 0.15 * insertSpring})`} opacity={insertOpacity}>
            <circle cx="0" cy="0" r="300" fill="url(#encGlow)" />
            <rect x="-280" y="-150" width="560" height="300" fill={ATLAS_COLORS.cream} stroke={ATLAS_COLORS.empireGold} strokeWidth="4" rx="10" />
            <rect x="-270" y="-140" width="540" height="280" fill="none" stroke={ATLAS_COLORS.textInk} strokeWidth="1.5" rx="6" opacity="0.75" />
            <text x="0" y="-55" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="40" fontWeight="700" fill={ATLAS_COLORS.textInk} letterSpacing="4">CANNAE</text>
            <text x="0" y="10" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="26" fontWeight="700" fill={ATLAS_COLORS.land} letterSpacing="2">216 av. J.-C.</text>
            <text x="0" y="80" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="22" fontStyle="italic" fill={ATLAS_COLORS.textInk} letterSpacing="2">la tenaille qui se referme</text>
          </g>
        </>
      )}

      {/* === SFX : charge a l'enveloppement, choc a l'estoc === */}
      <Sequence from={envelop} durationInFrames={40}>
        <Audio src={staticFile("_shared/sfx/sfx-army-charge.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={clash} durationInFrames={40}>
        <Audio src={staticFile("_shared/sfx/sfx-clash-impact.mp3")} volume={0.55} />
      </Sequence>
    </g>
  );
};
