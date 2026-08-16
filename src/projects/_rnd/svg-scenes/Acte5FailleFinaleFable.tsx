// MOTEUR: objet/metaphore SVG — le fait accompli (un coin enfonce dans la terre qui se fend) est une idee abstraite : seul l'objet-metaphore en SVG plat lui donne ce poids definitif, sans carte ni decor parasite.
// Plan final du documentaire Gazoduc (240f @ 30fps, 1920x1080).
// Timeline : f12-f38 le tuyau s'enfonce (course decidee + micro-tassement, zero rebond),
// f29-f44 la terre se souleve de part et d'autre, f32-f130 les fissures se propagent
// (strokeDasharray, origines MULTIPLES le long du tuyau et de la surface, ramifications),
// puis TOUT est immobile jusqu'a la fin — image definitive.
// Groupes adressables : #bg, #ground (#ground_left, #ground_right), #pipe_glow, #pipe,
// #burial_shade, #chasm, #cracks, #debris, #impact_glow.

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

const C = {
  bgTop: "#0d1f38",
  bgBottom: "#050c1a",
  cyan: "#2E9FD4",
  cyanEdge: "#7FD8FF",
  amber: "#FFC742",
  amberShade: "#c98f16",
  groundTop: "#123047",
  groundBottom: "#0a1c2c",
};

// Geometrie du tuyau — legerement decentre a droite
const PIPE_L = 1086; // bord gauche
const PIPE_R = 1210; // bord droit
const PIPE_CX = (PIPE_L + PIPE_R) / 2; // 1148
const TIP_Y = 852; // pointe finale, enfouie
const TIP_BASE = TIP_Y - 70; // debut du biseau
const DRIVE = 154; // course d'enfoncement en px

type Pt = [number, number];

// Longueur totale d'une polyligne (pour strokeDasharray)
const polyLength = (pts: Pt[]): number => {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0];
    const dy = pts[i][1] - pts[i - 1][1];
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
};

const toPoints = (pts: Pt[]): string => pts.map((p) => `${p[0]},${p[1]}`).join(" ");

// Lignes de surface irregulieres (legerement bosselees, comme la cible)
const SURF_L: Pt[] = [
  [0, 664], [240, 670], [470, 660], [700, 668], [820, 676], [1000, 648], [PIPE_L, 628],
];
const SURF_R: Pt[] = [
  [PIPE_R, 646], [1320, 668], [1400, 700], [1600, 694], [1920, 702],
];
const RIM_DEPTH = 26; // epaisseur de la levre claire en surface

const rimBand = (surf: Pt[]): Pt[] => [
  ...surf,
  ...[...surf].reverse().map(([x, y]): Pt => [x, y + RIM_DEPTH]),
];

// Semis de taches sombres DETERMINISTE pour la texture du sol (motif 280x280).
// Aucun aleatoire : tout est derive de l'indice i par arithmetique entiere.
// Mouchetis fin et dense (petits cailloux), pas de gros amas repetitifs.
const GRAIN_TILE = 280;
const GRAIN: { x: number; y: number; rx: number; ry: number; rot: number; o: number }[] = [];
for (let i = 0; i < 110; i++) {
  GRAIN.push({
    x: (i * 97 + (i * i * 13) % 61) % GRAIN_TILE,
    y: (i * 151 + (i * i * 7) % 43) % GRAIN_TILE,
    rx: 2 + ((i * 31) % 6),
    ry: 1.5 + ((i * 17) % 5),
    rot: (i * 47) % 180,
    o: 0.14 + ((i * 13) % 14) / 70,
  });
}

// Fissures anguleuses — origines MULTIPLES (surface, flancs du tuyau enterre, pointe),
// epaisseurs variees, ramifications secondaires qui partent d'un point du trace parent.
// d = delai de declenchement en frames apres CRACK_START.
const CRACKS: { pts: Pt[]; w: number; d: number }[] = [
  // Faille maitresse GAUCHE — longe le tuyau depuis la levre de surface
  { pts: [[1080, 634], [1050, 700], [1076, 762], [1038, 822], [1064, 884], [1028, 952], [1052, 1022], [1022, 1080]], w: 5, d: 0 },
  // Faille maitresse DROITE
  { pts: [[1218, 650], [1250, 716], [1222, 788], [1258, 850], [1228, 920], [1258, 992], [1234, 1080]], w: 5, d: 4 },
  // Plongee centrale sous la pointe
  { pts: [[1148, 858], [1170, 930], [1144, 1002], [1168, 1080]], w: 3.5, d: 8 },
  // Branche gauche haute (part d'un coude de la faille gauche)
  { pts: [[1050, 704], [978, 742], [1000, 792], [928, 822]], w: 2.5, d: 14 },
  // Branche gauche basse
  { pts: [[1038, 826], [958, 868], [980, 918], [898, 942]], w: 2, d: 20 },
  // Branche droite haute — repart vers la surface, comme la cible
  { pts: [[1250, 720], [1330, 756], [1312, 704], [1370, 682]], w: 2.5, d: 16 },
  // Branche droite basse
  { pts: [[1258, 854], [1342, 898], [1326, 950], [1408, 972]], w: 2, d: 22 },
  // Fissure nee de la SURFACE, a gauche, loin du tuyau
  { pts: [[938, 654], [912, 712], [936, 766], [900, 818]], w: 2, d: 26 },
  // Fissure nee de la SURFACE, a droite
  { pts: [[1348, 676], [1378, 732], [1356, 786], [1386, 842]], w: 2, d: 28 },
  // Brindilles terminales (fines)
  { pts: [[978, 746], [942, 708], [948, 676]], w: 1.5, d: 30 },
  { pts: [[1342, 902], [1390, 878], [1430, 892]], w: 1.5, d: 32 },
  { pts: [[1170, 934], [1210, 968], [1204, 1012]], w: 1.5, d: 34 },
];

const CRACK_START = 32;
const CRACK_DUR = 44;

const JOINT_YS = [120, 330, 540, 720];

export const Acte5FailleFinaleFable: React.FC = () => {
  const frame = useCurrentFrame();

  // --- Tuyau : course courte et decidee (acceleration), puis micro-tassement ---
  const drive = interpolate(frame, [12, 28], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const settle = interpolate(frame, [28, 38], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pipeDy = -DRIVE + drive * (DRIVE - 8) + settle * 8;

  // --- Terre soulevee et decalee au moment de l'impact, puis figee ---
  const heave = interpolate(frame, [29, 44], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leftDy = 8 * (1 - heave);
  const rightDy = 13 * (1 - heave);

  // --- Lueurs residuelles : montent une fois, puis restent fixes (aucune pulsation) ---
  const glowIn = interpolate(frame, [60, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Debris + gouffre sous la pointe : poses a l'impact, puis figes ---
  const debrisIn = interpolate(frame, [30, 42], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const debrisDy = 10 * (1 - debrisIn);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bgBottom }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="a5f_bg" cx="50%" cy="28%" r="90%">
            <stop offset="0%" stopColor={C.bgTop} />
            <stop offset="100%" stopColor={C.bgBottom} />
          </radialGradient>
          <linearGradient id="a5f_ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.groundTop} />
            <stop offset="100%" stopColor={C.groundBottom} />
          </linearGradient>
          <linearGradient id="a5f_pipe" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.amberShade} />
            <stop offset="30%" stopColor={C.amber} />
            <stop offset="62%" stopColor={C.amber} />
            <stop offset="100%" stopColor={C.amberShade} />
          </linearGradient>
          <linearGradient id="a5f_pipehalo" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.amber} stopOpacity="0" />
            <stop offset="50%" stopColor={C.amber} stopOpacity="0.16" />
            <stop offset="100%" stopColor={C.amber} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="a5f_glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.amber} stopOpacity="1" />
            <stop offset="100%" stopColor={C.amber} stopOpacity="0" />
          </radialGradient>
          {/* Mouchetis deterministe : grain sombre qui donne sa masse a la terre */}
          <pattern id="a5f_grain" width={GRAIN_TILE} height={GRAIN_TILE} patternUnits="userSpaceOnUse">
            {GRAIN.map((g, i) => (
              <ellipse
                key={i}
                cx={g.x}
                cy={g.y}
                rx={g.rx}
                ry={g.ry}
                fill={C.bgBottom}
                opacity={g.o}
                transform={`rotate(${g.rot} ${g.x} ${g.y})`}
              />
            ))}
          </pattern>
          {/* Silhouette du tuyau pour borner les rehauts plats */}
          <clipPath id="a5f_pipeclip">
            <rect x={PIPE_L} y={-60} width={PIPE_R - PIPE_L} height={TIP_BASE + 60} />
            <polygon points={toPoints([[PIPE_L, TIP_BASE], [PIPE_R, TIP_BASE], [1174, TIP_Y], [1122, TIP_Y]])} />
          </clipPath>
        </defs>

        {/* Fond — grand vide sombre au-dessus, solennel */}
        <g id="bg">
          <rect x={0} y={0} width={1920} height={1080} fill="url(#a5f_bg)" />
        </g>

        {/* Sol en deux masses decalees : aplat + grain + levre claire en surface */}
        <g id="ground">
          <g id="ground_left" transform={`translate(0, ${leftDy})`}>
            <polygon
              fill="url(#a5f_ground)"
              points={toPoints([...SURF_L, [PIPE_L, 1080], [0, 1080]])}
            />
            <polygon
              fill="url(#a5f_grain)"
              points={toPoints([...SURF_L, [PIPE_L, 1080], [0, 1080]])}
            />
            {/* Levre de surface : bande claire epaisse, plus vive pres de la rupture */}
            <polygon fill={C.cyan} opacity={0.3} points={toPoints(rimBand(SURF_L))} />
            <polyline
              points={toPoints(SURF_L.slice(0, 5))}
              fill="none" stroke={C.cyan} strokeWidth={3.5}
            />
            <polyline
              points={toPoints(SURF_L.slice(4))}
              fill="none" stroke={C.cyanEdge} strokeWidth={3.5}
            />
          </g>
          <g id="ground_right" transform={`translate(0, ${rightDy})`}>
            <polygon
              fill="url(#a5f_ground)"
              points={toPoints([...SURF_R, [1920, 1080], [PIPE_R, 1080]])}
            />
            <polygon
              fill="url(#a5f_grain)"
              points={toPoints([...SURF_R, [1920, 1080], [PIPE_R, 1080]])}
            />
            <polygon fill={C.cyan} opacity={0.3} points={toPoints(rimBand(SURF_R))} />
            <polyline
              points={toPoints(SURF_R.slice(0, 2))}
              fill="none" stroke={C.cyanEdge} strokeWidth={3.5}
            />
            <polyline
              points={toPoints(SURF_R.slice(1))}
              fill="none" stroke={C.cyan} strokeWidth={3.5}
            />
          </g>
        </g>

        {/* Eclat residuel autour du point d'impact — statique une fois installe */}
        <g id="impact_glow" opacity={glowIn * 0.13}>
          <ellipse cx={PIPE_CX} cy={860} rx={360} ry={230} fill="url(#a5f_glow)" />
        </g>

        {/* Halo vertical du tuyau : l'energie du coin, en aplat degrade simple */}
        <g id="pipe_glow" opacity={0.35 + glowIn * 0.65}>
          <rect x={PIPE_L - 120} y={-60} width={PIPE_R - PIPE_L + 240} height={760} fill="url(#a5f_pipehalo)" />
        </g>

        {/* Le tuyau — un seul, massif, vertical, plante comme un coin */}
        <g id="pipe" transform={`translate(0, ${pipeDy})`}>
          {/* Corps depuis le haut du cadre */}
          <rect x={PIPE_L} y={-60} width={PIPE_R - PIPE_L} height={TIP_BASE + 60} fill="url(#a5f_pipe)" />
          {/* Biseau de coin */}
          <polygon
            fill="url(#a5f_pipe)"
            points={toPoints([[PIPE_L, TIP_BASE], [PIPE_R, TIP_BASE], [1174, TIP_Y], [1122, TIP_Y]])}
          />
          {/* Rehauts plats : coeur clair + filet vif — modele sans 3D */}
          <g clipPath="url(#a5f_pipeclip)">
            <rect x={PIPE_L + 32} y={-60} width={30} height={TIP_Y + 60} fill="#FFFFFF" opacity={0.2} />
            <rect x={PIPE_L + 24} y={-60} width={5} height={TIP_Y + 60} fill="#FFFFFF" opacity={0.32} />
          </g>
          {/* Collerettes de jonction : segments plats, legerement debordants */}
          {JOINT_YS.map((y) => (
            <g key={y}>
              <rect x={PIPE_L - 7} y={y} width={PIPE_R - PIPE_L + 14} height={18} fill={C.amberShade} />
              <rect x={PIPE_L - 7} y={y} width={PIPE_R - PIPE_L + 14} height={4} fill={C.amber} opacity={0.7} />
            </g>
          ))}
          {/* Aretes nettes */}
          <line x1={PIPE_L} y1={-60} x2={PIPE_L} y2={TIP_BASE} stroke={C.amberShade} strokeWidth={3} />
          <line x1={PIPE_R} y1={-60} x2={PIPE_R} y2={TIP_BASE} stroke={C.amberShade} strokeWidth={3} />
        </g>

        {/* Voile sombre : la partie enterree du tuyau lue a travers la terre */}
        <g id="burial_shade">
          <polygon
            fill={C.bgBottom}
            opacity={0.42}
            points={toPoints([
              [PIPE_L, 628 + leftDy], [PIPE_R, 646 + rightDy], [PIPE_R, 1080], [PIPE_L, 1080],
            ])}
          />
        </g>

        {/* Gouffre : la terre s'ouvre en V sombre sous la pointe */}
        <g id="chasm" opacity={debrisIn * 0.55}>
          <polygon
            fill={C.bgBottom}
            points={toPoints([[1104, 862], [1192, 862], [1240, 1080], [1056, 1080]])}
          />
        </g>

        {/* Fissures : origines multiples, epaisseurs variees, ramifications staggerees */}
        <g id="cracks">
          {CRACKS.map((crack, i) => {
            const len = polyLength(crack.pts);
            const start = CRACK_START + crack.d;
            const progress = interpolate(frame, [start, start + CRACK_DUR], [0, 1], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const dashoffset = len * (1 - progress);
            const pointsStr = toPoints(crack.pts);
            return (
              <g key={i} id={`crack_${i}`}>
                {/* Halo ambre : l'energie qui s'echappe de la faille */}
                <polyline
                  points={pointsStr}
                  fill="none"
                  stroke={C.amber}
                  strokeWidth={crack.w * 3.4}
                  opacity={0.22}
                  strokeLinejoin="miter"
                  strokeDasharray={len}
                  strokeDashoffset={dashoffset}
                />
                {/* Trait vif */}
                <polyline
                  points={pointsStr}
                  fill="none"
                  stroke={C.amber}
                  strokeWidth={crack.w}
                  strokeLinejoin="miter"
                  strokeDasharray={len}
                  strokeDashoffset={dashoffset}
                />
              </g>
            );
          })}
        </g>

        {/* Debris : mottes de terre anguleuses POSEES sur la levre soulevee —
            quadrilateres pleins (masse), filet clair discret, jamais des fleches */}
        <g id="debris" opacity={debrisIn} transform={`translate(0, ${debrisDy})`}>
          <polygon fill={C.groundTop} stroke={C.cyanEdge} strokeWidth={1.5}
            points={toPoints([[978, 664], [1010, 632], [1050, 640], [1044, 672]])} />
          <polygon fill={C.groundTop} stroke={C.cyan} strokeWidth={1.5}
            points={toPoints([[912, 678], [944, 652], [976, 662], [968, 686]])} />
          <polygon fill={C.groundTop} stroke={C.cyanEdge} strokeWidth={1.5}
            points={toPoints([[1238, 658], [1276, 636], [1312, 650], [1296, 680]])} />
          <polygon fill={C.groundTop} stroke={C.cyan} strokeWidth={1.5}
            points={toPoints([[1332, 676], [1360, 652], [1394, 664], [1382, 692]])} />
          <polygon fill={C.groundTop} stroke={C.cyan} strokeWidth={1.2}
            points={toPoints([[1052, 636], [1074, 618], [1088, 642]])} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
