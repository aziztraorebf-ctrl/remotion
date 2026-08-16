// MOTEUR: objet/metaphore SVG — deux tuyaux identiques dont seule l'extremite raconte tout : papiers en apesanteur (parole) contre meche qui perce le sol (acte), la metaphore d'objet rend l'opposition lisible sans carte ni texte.
// Acte 5 — "negocier pendant que d'autres creusent" (avant-dernier plan).
// Palette stricte des actes precedents. SVG plat, degrades lineaires simples.
// Groupes adressables : #ground, #pipe-left, #floaters, #pipe-right, #drill, #cracks.

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

const C = {
  bgTop: "#0d1f38",
  bgBottom: "#050c1a",
  cyan: "#2E9FD4",
  cyanEdge: "#7FD8FF",
  amber: "#FFC742",
  amberDark: "#c98f16",
  groundTop: "#123047",
  groundBottom: "#0a1c2c",
};

const W = 1920;
const H = 1080;
const GROUND_Y = 880; // ligne de surface du sol

const PIPE_W = 116; // largeur des deux tuyaux
const LEFT_X = 520; // centre tuyau gauche
const RIGHT_X = 1400; // centre tuyau droit

// Objets en apesanteur : documents (coin plie + lignes), billets (cadre interne
// + medaillon central), pieces/sceaux (anneaux + motif). Chaque objet a sa
// propre trajectoire (phase / vitesse / amplitude uniques), jamais en phase
// avec les autres. Tout depend uniquement de frame. Aucun texte reel : les
// lignes et motifs restent des formes abstraites.
type FloatKind = "doc" | "note" | "coin";

type FloatItem = {
  kind: FloatKind;
  x: number;
  y: number;
  w: number; // doc/note : largeur — coin : diametre
  h: number; // doc/note : hauteur — coin : ignore
  rot: number; // inclinaison de base en degres
  phase: number; // dephasage propre
  speed: number; // vitesse angulaire (rad/frame), tres lente
  drift: number; // amplitude de derive en px
  wobble: number; // amplitude de rotation en degres
  bright: boolean; // contour clair ou standard
  lines: number; // doc : nombre de lignes internes
};

const FLOATERS: FloatItem[] = [
  // Grappe gauche : la negociation brasse des documents autour du tuyau suspendu
  { kind: "doc", x: 330, y: 300, w: 88, h: 116, rot: -14, phase: 0.4, speed: 0.010, drift: 15, wobble: 4, bright: true, lines: 4 },
  { kind: "doc", x: 236, y: 452, w: 98, h: 128, rot: -24, phase: 2.1, speed: 0.012, drift: 14, wobble: 5, bright: false, lines: 5 },
  { kind: "doc", x: 366, y: 566, w: 80, h: 106, rot: 10, phase: 4.0, speed: 0.009, drift: 17, wobble: 4, bright: false, lines: 4 },
  { kind: "doc", x: 672, y: 420, w: 92, h: 120, rot: 16, phase: 1.2, speed: 0.011, drift: 15, wobble: 5, bright: false, lines: 4 },
  { kind: "doc", x: 706, y: 646, w: 100, h: 132, rot: 26, phase: 5.3, speed: 0.008, drift: 18, wobble: 4, bright: true, lines: 5 },
  { kind: "doc", x: 428, y: 716, w: 82, h: 108, rot: -8, phase: 3.2, speed: 0.013, drift: 13, wobble: 6, bright: false, lines: 3 },
  { kind: "note", x: 306, y: 668, w: 122, h: 64, rot: -12, phase: 0.9, speed: 0.011, drift: 13, wobble: 4, bright: true, lines: 0 },
  { kind: "coin", x: 636, y: 764, w: 52, h: 52, rot: 0, phase: 2.8, speed: 0.012, drift: 11, wobble: 8, bright: false, lines: 0 },
  { kind: "coin", x: 224, y: 588, w: 40, h: 40, rot: 0, phase: 4.7, speed: 0.014, drift: 12, wobble: 9, bright: false, lines: 0 },
  // Zone centrale : l'argent circule entre les deux logiques, l'espace respire
  { kind: "note", x: 962, y: 356, w: 134, h: 72, rot: 6, phase: 1.6, speed: 0.009, drift: 16, wobble: 4, bright: true, lines: 0 },
  { kind: "coin", x: 872, y: 512, w: 48, h: 48, rot: 0, phase: 3.9, speed: 0.011, drift: 14, wobble: 9, bright: false, lines: 0 },
  { kind: "coin", x: 1058, y: 588, w: 40, h: 40, rot: 0, phase: 0.2, speed: 0.013, drift: 12, wobble: 8, bright: true, lines: 0 },
  { kind: "coin", x: 1006, y: 236, w: 36, h: 36, rot: 0, phase: 5.8, speed: 0.010, drift: 13, wobble: 7, bright: false, lines: 0 },
  { kind: "doc", x: 902, y: 692, w: 72, h: 96, rot: -18, phase: 2.4, speed: 0.010, drift: 14, wobble: 5, bright: false, lines: 3 },
  // Cote droit : quelques promesses flottent aussi pres de celui qui creuse
  { kind: "doc", x: 1702, y: 330, w: 92, h: 120, rot: 12, phase: 1.1, speed: 0.009, drift: 14, wobble: 4, bright: true, lines: 4 },
  { kind: "coin", x: 1798, y: 214, w: 42, h: 42, rot: 0, phase: 3.5, speed: 0.012, drift: 12, wobble: 8, bright: false, lines: 0 },
  { kind: "coin", x: 1612, y: 486, w: 48, h: 48, rot: 0, phase: 5.1, speed: 0.010, drift: 13, wobble: 9, bright: false, lines: 0 },
  { kind: "coin", x: 1822, y: 552, w: 36, h: 36, rot: 0, phase: 0.7, speed: 0.014, drift: 11, wobble: 7, bright: true, lines: 0 },
];

// Document : rectangle en trait cyan, coin plie, lignes internes abstraites.
const DocShape: React.FC<{ it: FloatItem; stroke: string }> = ({ it, stroke }) => {
  const { w, h, lines } = it;
  const fold = Math.min(20, w * 0.24);
  const inset = 13;
  const lineGap = (h - inset * 2 - fold) / (lines + 1);
  return (
    <g>
      <path
        d={`M ${-w / 2} ${-h / 2} H ${w / 2} V ${h / 2 - fold} L ${w / 2 - fold} ${h / 2} H ${-w / 2} Z`}
        fill={C.bgBottom}
        fillOpacity={0.6}
        stroke={stroke}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d={`M ${w / 2} ${h / 2 - fold} L ${w / 2 - fold} ${h / 2 - fold} L ${w / 2 - fold} ${h / 2}`}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        opacity={0.7}
      />
      {Array.from({ length: lines }).map((_, i) => (
        <line
          key={i}
          x1={-w / 2 + inset}
          y1={-h / 2 + inset + lineGap * (i + 1)}
          x2={w / 2 - inset * (i % 2 === 0 ? 1 : 2.4)}
          y2={-h / 2 + inset + lineGap * (i + 1)}
          stroke={stroke}
          strokeWidth={2.2}
          opacity={0.55}
        />
      ))}
    </g>
  );
};

// Billet : cadre externe + cadre interne + medaillon central a motif abstrait.
const NoteShape: React.FC<{ it: FloatItem; stroke: string }> = ({ it, stroke }) => {
  const { w, h } = it;
  const r = h * 0.3;
  return (
    <g>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={3}
        fill={C.bgBottom}
        fillOpacity={0.6}
        stroke={stroke}
        strokeWidth={2.5}
      />
      <rect
        x={-w / 2 + 7}
        y={-h / 2 + 7}
        width={w - 14}
        height={h - 14}
        rx={2}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        opacity={0.55}
      />
      <circle cx={0} cy={0} r={r} fill="none" stroke={stroke} strokeWidth={2} opacity={0.85} />
      <polygon
        points={`0,${-r * 0.5} ${r * 0.42},0 0,${r * 0.5} ${-r * 0.42},0`}
        fill="none"
        stroke={stroke}
        strokeWidth={1.8}
        opacity={0.7}
      />
      {[-1, 1].map((s) => (
        <circle
          key={s}
          cx={s * (w / 2 - 17)}
          cy={0}
          r={3.5}
          fill={stroke}
          opacity={0.5}
        />
      ))}
    </g>
  );
};

// Piece / sceau : anneaux concentriques + motif hexagonal + crans radiaux.
const CoinShape: React.FC<{ it: FloatItem; stroke: string }> = ({ it, stroke }) => {
  const r = it.w / 2;
  const hex = Array.from({ length: 6 })
    .map((_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return `${Math.cos(a) * r * 0.34},${Math.sin(a) * r * 0.34}`;
    })
    .join(" ");
  return (
    <g>
      <circle
        cx={0}
        cy={0}
        r={r}
        fill={C.bgBottom}
        fillOpacity={0.6}
        stroke={stroke}
        strokeWidth={2.5}
      />
      <circle cx={0} cy={0} r={r * 0.68} fill="none" stroke={stroke} strokeWidth={1.6} opacity={0.6} />
      <polygon points={hex} fill="none" stroke={stroke} strokeWidth={1.8} opacity={0.8} />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (Math.PI / 4) * i + Math.PI / 8;
        return (
          <line
            key={i}
            x1={Math.cos(a) * r * 0.78}
            y1={Math.sin(a) * r * 0.78}
            x2={Math.cos(a) * r * 0.92}
            y2={Math.sin(a) * r * 0.92}
            stroke={stroke}
            strokeWidth={1.6}
            opacity={0.5}
          />
        );
      })}
    </g>
  );
};

// Un objet flottant : halo cyan doux + forme, derive propre, deterministe.
const Floater: React.FC<{ it: FloatItem; frame: number; appear: number }> = ({
  it,
  frame,
  appear,
}) => {
  const dx = it.drift * Math.sin(frame * it.speed + it.phase);
  const dy = it.drift * 0.72 * Math.cos(frame * it.speed * 0.83 + it.phase * 1.7);
  const rot = it.rot + it.wobble * Math.sin(frame * it.speed * 0.62 + it.phase * 2.3);
  const stroke = it.bright ? C.cyanEdge : C.cyan;
  const haloRx = it.kind === "coin" ? it.w * 0.95 : it.w * 0.82;
  const haloRy = it.kind === "coin" ? it.w * 0.95 : it.h * 0.72;
  return (
    <g transform={`translate(${it.x + dx}, ${it.y + dy}) rotate(${rot})`} opacity={appear}>
      <ellipse cx={0} cy={0} rx={haloRx} ry={haloRy} fill="url(#a5-obj-halo)" />
      {it.kind === "doc" && <DocShape it={it} stroke={stroke} />}
      {it.kind === "note" && <NoteShape it={it} stroke={stroke} />}
      {it.kind === "coin" && <CoinShape it={it} stroke={stroke} />}
    </g>
  );
};

// Mouchetis du sol : positions deterministes du tile de pattern (pas de random).
const GRAIN_TILE = 168;
const GRAIN_DOTS: Array<[number, number, number, number]> = [
  // [cx, cy, r, opacity]
  [12, 18, 3.4, 0.6], [44, 8, 2.2, 0.5], [82, 24, 4.2, 0.55], [128, 12, 2.6, 0.5],
  [156, 34, 3.0, 0.6], [26, 52, 2.4, 0.5], [66, 58, 3.8, 0.6], [108, 46, 2.2, 0.45],
  [142, 66, 4.6, 0.55], [8, 88, 3.2, 0.5], [52, 96, 2.6, 0.55], [96, 84, 3.6, 0.6],
  [132, 102, 2.4, 0.5], [162, 92, 3.0, 0.55], [22, 128, 4.0, 0.6], [70, 136, 2.2, 0.5],
  [112, 124, 3.4, 0.55], [150, 142, 2.8, 0.5], [40, 158, 3.2, 0.6], [92, 160, 2.4, 0.5],
  [134, 156, 3.8, 0.55], [8, 148, 2.0, 0.45],
];

export const Acte5NegocierCreuserFable: React.FC = () => {
  const frame = useCurrentFrame();

  // Entree en scene : les deux tuyaux descendent du haut du cadre puis se figent.
  const leftDrop = interpolate(frame, [0, 55], [-360, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightDrop = interpolate(frame, [8, 66], [-360, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // La meche descend progressivement dans le sol pendant tout le plan.
  const drillDescent = interpolate(frame, [80, 430], [0, 64], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rotation de la meche : les stries helicoidales defilent en continu.
  const stripePeriod = 34;
  const stripeShift = (frame * 1.7) % stripePeriod;

  // Fissures a l'entree du forage : progression lente et monotone.
  const crackGrow = interpolate(frame, [70, 400], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Apparition globale des objets flottants apres l'arrivee du tuyau gauche.
  const floaterAppear = (i: number) =>
    interpolate(frame, [46 + i * 5, 82 + i * 5], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const shadowIn = interpolate(frame, [40, 90], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Geometrie tuyau gauche : s'arrete en l'air, loin du sol.
  const leftPipeBottom = 612;
  // Geometrie tuyau droit (coordonnees locales du groupe, avant descentes) :
  // le corps plonge sous la surface, la meche est deja enfoncee au depart.
  const bitTipY = 924; // pointe de la meche a frame 0 (44 px sous la surface)
  const bitLen = 150;
  const bitTopY = bitTipY - bitLen;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bgBottom }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="a5-bg" cx="50%" cy="22%" r="95%">
            <stop offset="0%" stopColor={C.bgTop} />
            <stop offset="100%" stopColor={C.bgBottom} />
          </radialGradient>
          <linearGradient id="a5-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.groundTop} />
            <stop offset="100%" stopColor={C.groundBottom} />
          </linearGradient>
          {/* Modele lateral du tuyau : cylindre plat, centre clair, flancs sombres */}
          <linearGradient id="a5-pipe" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.amberDark} />
            <stop offset="18%" stopColor={C.amberDark} />
            <stop offset="48%" stopColor={C.amber} />
            <stop offset="58%" stopColor={C.amber} />
            <stop offset="100%" stopColor={C.amberDark} />
          </linearGradient>
          {/* Halo ambre discret qui detache les tuyaux du fond */}
          <linearGradient id="a5-pipe-halo" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.amber} stopOpacity={0} />
            <stop offset="50%" stopColor={C.amber} stopOpacity={0.14} />
            <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
          </linearGradient>
          {/* Halo cyan doux derriere chaque objet flottant */}
          <radialGradient id="a5-obj-halo">
            <stop offset="0%" stopColor={C.cyanEdge} stopOpacity={0.3} />
            <stop offset="55%" stopColor={C.cyanEdge} stopOpacity={0.1} />
            <stop offset="100%" stopColor={C.cyanEdge} stopOpacity={0} />
          </radialGradient>
          {/* Lueur au point de forage */}
          <radialGradient id="a5-bit-halo">
            <stop offset="0%" stopColor={C.amber} stopOpacity={0.3} />
            <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
          </radialGradient>
          {/* Tache sombre a bord doux pour la variation basse frequence du sol */}
          <radialGradient id="a5-blotch">
            <stop offset="0%" stopColor={C.bgBottom} stopOpacity={0.3} />
            <stop offset="65%" stopColor={C.bgBottom} stopOpacity={0.14} />
            <stop offset="100%" stopColor={C.bgBottom} stopOpacity={0} />
          </radialGradient>
          {/* Mouchetis granuleux du sol : semis de points deterministe */}
          <pattern
            id="a5-grain"
            width={GRAIN_TILE}
            height={GRAIN_TILE}
            patternUnits="userSpaceOnUse"
          >
            {GRAIN_DOTS.map(([cx, cy, r, o], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill={C.bgBottom} opacity={o} />
            ))}
          </pattern>
          <clipPath id="a5-bit-clip">
            {/* Silhouette de la meche : trapeze effile vers la pointe */}
            <polygon
              points={`${RIGHT_X - 66},${bitTopY} ${RIGHT_X + 66},${bitTopY} ${RIGHT_X + 30},${bitTipY - 34} ${RIGHT_X},${bitTipY} ${RIGHT_X - 30},${bitTipY - 34}`}
            />
          </clipPath>
          <clipPath id="a5-underground">
            <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} />
          </clipPath>
        </defs>

        {/* Fond */}
        <rect x={0} y={0} width={W} height={H} fill="url(#a5-bg)" />

        {/* Tuyau droit : descend jusqu'au sol et le perce (dessine avant le sol
            pour que sa partie enterree soit assombrie par la bande de sol) */}
        <g id="pipe-right" transform={`translate(0, ${rightDrop + drillDescent})`}>
          {/* Halo ambre : detache le tuyau du fond sans volumetrie */}
          <rect
            x={RIGHT_X - PIPE_W * 1.5}
            y={-500}
            width={PIPE_W * 3}
            height={bitTipY + 520}
            fill="url(#a5-pipe-halo)"
          />
          <rect
            x={RIGHT_X - PIPE_W / 2}
            y={-500}
            width={PIPE_W}
            height={bitTopY - 42 + 500}
            fill="url(#a5-pipe)"
          />
          {/* Joints de segments : bande sombre + anneau en relief plat */}
          {[120, 340, 560].map((y) => (
            <g key={y}>
              <rect
                x={RIGHT_X - PIPE_W / 2}
                y={y}
                width={PIPE_W}
                height={10}
                fill={C.amberDark}
              />
              <rect
                x={RIGHT_X - PIPE_W / 2 - 5}
                y={y + 10}
                width={PIPE_W + 10}
                height={7}
                fill={C.amberDark}
              />
              <line
                x1={RIGHT_X - PIPE_W / 2 - 5}
                y1={y + 17}
                x2={RIGHT_X + PIPE_W / 2 + 5}
                y2={y + 17}
                stroke={C.amber}
                strokeWidth={2.5}
                opacity={0.7}
              />
            </g>
          ))}
          <g id="drill">
            {/* Lueur discrete autour de la tete de forage */}
            <ellipse
              cx={RIGHT_X}
              cy={bitTopY + bitLen * 0.4}
              rx={150}
              ry={120}
              fill="url(#a5-bit-halo)"
            />
            {/* Raccord entre tuyau et meche */}
            <rect
              x={RIGHT_X - 74}
              y={bitTopY - 42}
              width={148}
              height={42}
              fill={C.amberDark}
            />
            <line
              x1={RIGHT_X - 74}
              y1={bitTopY - 42}
              x2={RIGHT_X + 74}
              y2={bitTopY - 42}
              stroke={C.amber}
              strokeWidth={3}
              opacity={0.8}
            />
            {/* Corps de la meche + stries helicoidales defilantes (rotation) */}
            <g clipPath="url(#a5-bit-clip)">
              <rect
                x={RIGHT_X - 70}
                y={bitTopY - 10}
                width={140}
                height={bitLen + 20}
                fill={C.amber}
              />
              {Array.from({ length: 9 }).map((_, i) => {
                const y = bitTopY - stripePeriod + i * stripePeriod + stripeShift;
                return (
                  <line
                    key={i}
                    x1={RIGHT_X - 74}
                    y1={y}
                    x2={RIGHT_X + 74}
                    y2={y - 26}
                    stroke={C.amberDark}
                    strokeWidth={11}
                  />
                );
              })}
            </g>
            {/* Arete de la meche pour garder la silhouette nette */}
            <polygon
              points={`${RIGHT_X - 66},${bitTopY} ${RIGHT_X + 66},${bitTopY} ${RIGHT_X + 30},${bitTipY - 34} ${RIGHT_X},${bitTipY} ${RIGHT_X - 30},${bitTipY - 34}`}
              fill="none"
              stroke={C.amberDark}
              strokeWidth={3}
            />
          </g>
        </g>

        {/* Sol : bande sombre semi-couvrante — la partie enterree de la meche
            reste devinable derriere la matiere */}
        <g id="ground">
          <rect
            x={0}
            y={GROUND_Y}
            width={W}
            height={H - GROUND_Y}
            fill="url(#a5-ground)"
            fillOpacity={0.86}
          />
          {/* Mouchetis granuleux : la terre a du grain, pas un aplat */}
          <g clipPath="url(#a5-underground)">
            <rect
              x={0}
              y={GROUND_Y}
              width={W}
              height={H - GROUND_Y}
              fill="url(#a5-grain)"
            />
            {/* Deuxieme semis decale et agrandi pour casser la repetition du tile */}
            <g transform={`translate(${GRAIN_TILE * 0.4}, ${GRAIN_TILE * 0.55}) scale(1.6)`}>
              <rect
                x={-GRAIN_TILE}
                y={GROUND_Y / 1.6 - GRAIN_TILE}
                width={W}
                height={H}
                fill="url(#a5-grain)"
                opacity={0.55}
              />
            </g>
            {/* Blotches larges tres discrets : variation basse frequence */}
            {[
              [240, 980, 300, 90],
              [760, 1030, 360, 110],
              [1180, 960, 260, 80],
              [1660, 1010, 340, 100],
              [520, 1070, 280, 90],
            ].map(([cx, cy, rx, ry], i) => (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill="url(#a5-blotch)"
              />
            ))}
          </g>
          {/* Levre de surface : bande a peine plus claire sous la ligne */}
          <rect
            x={0}
            y={GROUND_Y}
            width={W}
            height={22}
            fill={C.groundTop}
            opacity={0.5}
          />
          {/* Ligne de surface */}
          <line
            x1={0}
            y1={GROUND_Y}
            x2={W}
            y2={GROUND_Y}
            stroke={C.cyan}
            strokeWidth={3}
            opacity={0.55}
          />
          {/* Ombre portee sous le tuyau suspendu : souligne qu'il ne touche pas */}
          <ellipse
            id="left-pipe-shadow"
            cx={LEFT_X}
            cy={GROUND_Y + 14}
            rx={140}
            ry={11}
            fill={C.bgBottom}
            opacity={shadowIn}
          />
          {/* Monticules de terre deplacee au point d'entree du forage */}
          <polygon
            points={`${RIGHT_X - 100},${GROUND_Y} ${RIGHT_X - 62},${GROUND_Y - 26} ${RIGHT_X - 52},${GROUND_Y}`}
            fill={C.groundTop}
          />
          <polygon
            points={`${RIGHT_X + 52},${GROUND_Y} ${RIGHT_X + 66},${GROUND_Y - 30} ${RIGHT_X + 104},${GROUND_Y}`}
            fill={C.groundTop}
          />
          {/* Lueur de friction au point d'entree */}
          <ellipse
            cx={RIGHT_X}
            cy={GROUND_Y}
            rx={78}
            ry={9}
            fill={C.amber}
            opacity={0.22}
          />
        </g>

        {/* Fissures : s'etendent lentement depuis le point d'entree */}
        <g id="cracks" opacity={0.5}>
          <polyline
            points={`${RIGHT_X - 62},${GROUND_Y + 4} ${RIGHT_X - 118},${GROUND_Y + 22} ${RIGHT_X - 150},${GROUND_Y + 18} ${RIGHT_X - 208},${GROUND_Y + 44}`}
            fill="none"
            stroke={C.cyanEdge}
            strokeWidth={2.5}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - crackGrow}
          />
          <polyline
            points={`${RIGHT_X + 62},${GROUND_Y + 6} ${RIGHT_X + 112},${GROUND_Y + 30} ${RIGHT_X + 148},${GROUND_Y + 24} ${RIGHT_X + 196},${GROUND_Y + 52}`}
            fill="none"
            stroke={C.cyanEdge}
            strokeWidth={2.5}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - crackGrow * 0.85}
          />
        </g>

        {/* Tuyau gauche : identique mais suspendu en l'air, immobile apres l'entree */}
        <g id="pipe-left" transform={`translate(0, ${leftDrop})`}>
          {/* Halo ambre : meme presence lumineuse que le tuyau droit */}
          <rect
            x={LEFT_X - PIPE_W * 1.5}
            y={-500}
            width={PIPE_W * 3}
            height={leftPipeBottom + 560}
            fill="url(#a5-pipe-halo)"
          />
          <rect
            x={LEFT_X - PIPE_W / 2}
            y={-500}
            width={PIPE_W}
            height={leftPipeBottom - 26 + 500}
            fill="url(#a5-pipe)"
          />
          {[110, 330].map((y) => (
            <g key={y}>
              <rect
                x={LEFT_X - PIPE_W / 2}
                y={y}
                width={PIPE_W}
                height={10}
                fill={C.amberDark}
              />
              <rect
                x={LEFT_X - PIPE_W / 2 - 5}
                y={y + 10}
                width={PIPE_W + 10}
                height={7}
                fill={C.amberDark}
              />
              <line
                x1={LEFT_X - PIPE_W / 2 - 5}
                y1={y + 17}
                x2={LEFT_X + PIPE_W / 2 + 5}
                y2={y + 17}
                stroke={C.amber}
                strokeWidth={2.5}
                opacity={0.7}
              />
            </g>
          ))}
          {/* Collerette d'extremite : un tuyau pret a etre raccorde... a rien */}
          <rect
            x={LEFT_X - 86}
            y={leftPipeBottom - 26}
            width={172}
            height={26}
            fill={C.amberDark}
          />
          <line
            x1={LEFT_X - 86}
            y1={leftPipeBottom}
            x2={LEFT_X + 86}
            y2={leftPipeBottom}
            stroke={C.amber}
            strokeWidth={4}
          />
          {/* Boulons de la collerette */}
          {[-62, -22, 22, 62].map((dx) => (
            <circle
              key={dx}
              cx={LEFT_X + dx}
              cy={leftPipeBottom - 13}
              r={5}
              fill={C.amber}
            />
          ))}
        </g>

        {/* Objets en apesanteur : la negociation brasse papiers, billets, sceaux */}
        <g id="floaters">
          {FLOATERS.map((it, i) => (
            <Floater key={i} it={it} frame={frame} appear={floaterAppear(i)} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
