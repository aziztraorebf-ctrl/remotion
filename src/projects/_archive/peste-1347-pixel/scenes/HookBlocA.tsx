import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Audio,
  Sequence,
  staticFile,
} from "remotion";

// ============================================================
// HookBlocA v5d — Saint-Pierre, ete 1347
// Style : carte jeu de societe (jetons sur schema plat)
// Duration : 706 frames (23.55s @30fps) — audio etire 1.12x, coupe avant derniere phrase
// Audio    : hook_00_saint_pierre_slow.mp3
//
// Corrections Kimi 8.5/10 -> 9/10 :
// - Ombre portee renforcee sous jetons (0.28 -> 0.40) pour ancrage
// - Reflet gloss matifie (0.11 -> 0.06) pour style plus parchemin
// - Label padding augmente (+12px) -> GUILLAUME ne touche plus les bords
// - Fade-in ease-out (14f au lieu de 10f) pour sophistication
// ============================================================

// ── Palette ──────────────────────────────────────────────────
const PARCHMENT   = "#F5E6C8";
const PARCHMENT_D = "#E8D4A8";
const INK         = "#1A1008";
const INK_LIGHT   = "#6B5030";

// Couleurs jetons — palette terre medievale, pas de neon
const TOKEN = {
  thomas:    "#5C3A1E", // brun terre
  martin:    "#111111", // noir soutane
  isaac:     "#9A7218", // or brule
  guillaume: "#7B1B2A", // bordeaux
  agnes:     "#3A5228", // vert mousse
  renaud:    "#18182A", // noir-bleu masque
} as const;

const W = 1920;
const H = 1080;
const CX = W / 2;
const CY = H / 2 - 20;
const ROAD_W = 64;
const TOKEN_R = 74;

// ── Timestamps audio (etires x1.119 — audio slow 26.23s) ─────
const TOKEN_ENTERS: Record<string, number> = {
  thomas:    125,
  martin:    243,
  isaac:     278,
  guillaume: 331,
  agnes:     398,
  renaud:    504,
};

// ── Positions jetons ─────────────────────────────────────────
const TOKEN_POS: Record<string, { x: number; y: number }> = {
  thomas:    { x: CX + 340,  y: CY + 268 },
  martin:    { x: CX + 80,   y: CY - 308 },
  isaac:     { x: CX - 378,  y: CY - 22  },
  guillaume: { x: CX - 288,  y: CY - 268 },
  agnes:     { x: CX - 138,  y: CY + 288 },
  renaud:    { x: CX + 498,  y: CY + 12  },
};

// ── Chemin (route) ───────────────────────────────────────────
const Road: React.FC<{ x1: number; y1: number; x2: number; y2: number; w?: number }> = ({
  x1, y1, x2, y2, w = ROAD_W,
}) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len * w / 2;
  const ny = dx / len * w / 2;
  const pts = [
    `${x1 + nx},${y1 + ny}`,
    `${x2 + nx},${y2 + ny}`,
    `${x2 - nx},${y2 - ny}`,
    `${x1 - nx},${y1 - ny}`,
  ].join(" ");
  return <polygon points={pts} fill={PARCHMENT_D} stroke={INK} strokeWidth="1.5" opacity="0.82" />;
};

// ── Icone Eglise ─────────────────────────────────────────────
const IcEglise: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 14} y={y - 52} width={28} height={36} fill={PARCHMENT} stroke={INK} strokeWidth="2" />
    {[-10, -4, 2, 8].map((ox, i) => (
      <rect key={i} x={x + ox} y={y - 58} width={5} height={8} fill={PARCHMENT} stroke={INK} strokeWidth="1.5" />
    ))}
    <rect x={x - 22} y={y - 18} width={44} height={28} fill={PARCHMENT} stroke={INK} strokeWidth="2" />
    <path d={`M ${x - 7},${y + 10} L ${x - 7},${y - 2} Q ${x},${y - 10} ${x + 7},${y - 2} L ${x + 7},${y + 10}`}
      fill={INK} opacity="0.75" />
    <line x1={x} y1={y - 72} x2={x} y2={y - 54} stroke={INK} strokeWidth="3" strokeLinecap="round" />
    <line x1={x - 7} y1={y - 65} x2={x + 7} y2={y - 65} stroke={INK} strokeWidth="3" strokeLinecap="round" />
    <ellipse cx={x} cy={y - 38} rx={5} ry={4} fill={INK} opacity="0.6" />
    <text x={x} y={y + 26} textAnchor="middle" fontSize="11" fontFamily="serif" fill={INK_LIGHT} fontStyle="italic">
      Eglise
    </text>
  </g>
);

// ── Icone Tour ───────────────────────────────────────────────
const IcTour: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 16} y={y - 48} width={32} height={58} fill={PARCHMENT} stroke={INK} strokeWidth="2" />
    {[-12, -5, 2, 9].map((ox, i) => (
      <rect key={i} x={x + ox} y={y - 56} width={6} height={10} fill={PARCHMENT} stroke={INK} strokeWidth="1.5" />
    ))}
    <rect x={x - 3} y={y - 30} width={6} height={14} rx={3} fill={INK} opacity="0.7" />
    <text x={x} y={y + 20} textAnchor="middle" fontSize="11" fontFamily="serif" fill={INK_LIGHT} fontStyle="italic">
      Tour
    </text>
  </g>
);

// ── Icone Auberge ────────────────────────────────────────────
const IcAuberge: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 22} y={y - 24} width={44} height={32} fill={PARCHMENT} stroke={INK} strokeWidth="2" />
    <polygon points={`${x - 26},${y - 24} ${x},${y - 44} ${x + 26},${y - 24}`}
      fill={PARCHMENT} stroke={INK} strokeWidth="2" />
    <rect x={x - 8} y={y - 16} width={12} height={16} rx={2} fill={INK} opacity="0.65" />
    <path d={`M ${x + 4},${y - 12} Q ${x + 14},${y - 12} ${x + 14},${y - 4} Q ${x + 14},${y + 2} ${x + 4},${y + 2}`}
      fill="none" stroke={INK} strokeWidth="2" opacity="0.65" />
    <text x={x} y={y + 20} textAnchor="middle" fontSize="11" fontFamily="serif" fill={INK_LIGHT} fontStyle="italic">
      Auberge
    </text>
  </g>
);

// ── Icone Grange ─────────────────────────────────────────────
const IcGrange: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 24} y={y - 22} width={48} height={30} fill={PARCHMENT} stroke={INK} strokeWidth="2" />
    <polygon points={`${x - 28},${y - 22} ${x},${y - 46} ${x + 28},${y - 22}`}
      fill={PARCHMENT} stroke={INK} strokeWidth="2" />
    <path d={`M ${x - 10},${y + 8} L ${x - 10},${y - 8} Q ${x},${y - 18} ${x + 10},${y - 8} L ${x + 10},${y + 8}`}
      fill={INK} opacity="0.65" />
    <text x={x} y={y + 22} textAnchor="middle" fontSize="11" fontFamily="serif" fill={INK_LIGHT} fontStyle="italic">
      Grange
    </text>
  </g>
);

// ── Icone Forge ──────────────────────────────────────────────
const IcForge: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 18} y={y - 18} width={36} height={26} fill={PARCHMENT} stroke={INK} strokeWidth="2" />
    <rect x={x - 10} y={y - 8} width={20} height={8} rx={2} fill={INK} opacity="0.7" />
    <rect x={x - 7} y={y - 14} width={14} height={6} rx={1} fill={INK} opacity="0.7" />
    <path d={`M ${x - 5},${y - 18} Q ${x - 8},${y - 30} ${x - 2},${y - 40}`}
      fill="none" stroke={INK} strokeWidth="2" strokeDasharray="2 3" opacity="0.5" />
    <text x={x} y={y + 20} textAnchor="middle" fontSize="11" fontFamily="serif" fill={INK_LIGHT} fontStyle="italic">
      Forge
    </text>
  </g>
);

// ── Icone Puits ──────────────────────────────────────────────
const IcPuits: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y} r={20} fill={PARCHMENT} stroke={INK} strokeWidth="2.5" />
    <circle cx={x} cy={y} r={13} fill={INK} opacity="0.45" />
    <line x1={x - 20} y1={y - 18} x2={x + 20} y2={y - 18} stroke={INK} strokeWidth="3" strokeLinecap="round" />
    <rect x={x - 3} y={y - 26} width={6} height={10} rx={1} fill={INK_LIGHT} opacity="0.8" />
    <text x={x} y={y + 34} textAnchor="middle" fontSize="10" fontFamily="serif" fill={INK_LIGHT} fontStyle="italic">
      Puits
    </text>
  </g>
);

// ── Arbres (triangles stylises) ───────────────────────────────
const IcArbre: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 20 }) => (
  <g opacity="0.4">
    <rect x={x - 2} y={y + r * 0.25} width={4} height={r * 0.65} fill={INK} opacity="0.5" />
    <polygon
      points={`${x},${y - r} ${x - r * 0.82},${y + r * 0.25} ${x + r * 0.82},${y + r * 0.25}`}
      fill={PARCHMENT} stroke={INK} strokeWidth="1.5"
    />
    <polygon
      points={`${x - r * 0.5},${y - r * 0.15} ${x - r * 0.95},${y + r * 0.5} ${x + r * 0.95},${y + r * 0.5} ${x + r * 0.5},${y - r * 0.15}`}
      fill={PARCHMENT} stroke={INK} strokeWidth="1.2"
    />
  </g>
);

// ── Symboles jetons ───────────────────────────────────────────

const SymFourche: React.FC = () => (
  <g stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none">
    <line x1="0" y1="20" x2="0" y2="-20" />
    <line x1="-11" y1="10" x2="-11" y2="-16" />
    <line x1="11" y1="10" x2="11" y2="-16" />
    <line x1="-11" y1="-2" x2="11" y2="-2" />
  </g>
);

const SymCroix: React.FC = () => (
  <g stroke="white" strokeWidth="5" strokeLinecap="round" fill="none">
    <line x1="0" y1="-22" x2="0" y2="22" />
    <line x1="-14" y1="-6" x2="14" y2="-6" />
  </g>
);

const SymBourse: React.FC = () => (
  <g fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
    <ellipse cx="0" cy="7" rx="16" ry="15" />
    <path d="M -9,-8 Q -9,-22 0,-20 Q 9,-22 9,-8" />
    <line x1="-5" y1="-8" x2="5" y2="-8" />
  </g>
);

const SymEpee: React.FC = () => (
  <g stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none">
    <line x1="0" y1="-24" x2="0" y2="20" />
    <line x1="-14" y1="5" x2="14" y2="5" />
    <ellipse cx="0" cy="18" rx="5" ry="5" fill="white" stroke="none" />
  </g>
);

const SymFeuille: React.FC = () => (
  <g>
    <path d="M 0,-22 Q 18,0 0,22 Q -18,0 0,-22 Z" fill="white" opacity="0.9" />
    <line x1="0" y1="-22" x2="0" y2="22" stroke="#3A5228" strokeWidth="2.5" />
    <line x1="-11" y1="-5" x2="11" y2="-5" stroke="#3A5228" strokeWidth="2" />
    <line x1="-13" y1="5" x2="13" y2="5" stroke="#3A5228" strokeWidth="2" />
    <line x1="-9" y1="14" x2="9" y2="14" stroke="#3A5228" strokeWidth="1.5" />
  </g>
);

const SymMasque: React.FC = () => (
  <g fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <ellipse cx="0" cy="-3" rx="15" ry="17" />
    <path d="M -8,7 L -15,22 L 15,22 L 8,7" fill="white" stroke="white" strokeWidth="1" />
    <circle cx="-7" cy="-9" r="5" />
    <circle cx="7" cy="-9" r="5" />
    <line x1="-2" y1="-9" x2="2" y2="-9" />
  </g>
);

const SYMBOLS: Record<string, React.FC> = {
  thomas: SymFourche, martin: SymCroix, isaac: SymBourse,
  guillaume: SymEpee, agnes: SymFeuille, renaud: SymMasque,
};

const LABELS: Record<string, string> = {
  thomas: "THOMAS", martin: "MARTIN", isaac: "ISAAC",
  guillaume: "GUILLAUME", agnes: "AGNES", renaud: "RENAUD",
};

// ── Jeton anime ───────────────────────────────────────────────
const GameToken: React.FC<{ id: keyof typeof TOKEN; frame: number }> = ({ id, frame }) => {
  const enterFrame = TOKEN_ENTERS[id];
  const localF = frame - enterFrame;
  if (localF < 0) return null;

  const FADE_IN  = 10;
  const SCALE_IN = 16;
  const LABEL_IN = SCALE_IN + 8;

  const opacity = interpolate(localF, [0, FADE_IN], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const scale = interpolate(localF, [0, SCALE_IN * 0.65, SCALE_IN], [0.35, 1.1, 1.0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const labelOpacity = interpolate(localF, [LABEL_IN, LABEL_IN + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const { x, y } = TOKEN_POS[id];
  const color = TOKEN[id];
  const Sym = SYMBOLS[id];
  const label = LABELS[id];
  const labelW = label.length * 9 + 38;

  // Renaud : label italique et plus petit (personnage mystere)
  const isRenaud = id === "renaud";

  return (
    <g opacity={opacity} transform={`translate(${x}, ${y})`}>
      {/* Ombre portee SE — ancrage sur parchemin */}
      <ellipse cx={10} cy={TOKEN_R * 0.22 + 10} rx={TOKEN_R * 0.9} ry={TOKEN_R * 0.28}
        fill={INK} opacity="0.40" />

      {/* Jeton avec relief */}
      <g transform={`scale(${scale})`}>
        <circle cx={0} cy={0} r={TOKEN_R} fill={color} />
        {/* Ombre interne bas-droite */}
        <ellipse cx={TOKEN_R * 0.15} cy={TOKEN_R * 0.38} rx={TOKEN_R * 0.82} ry={TOKEN_R * 0.52}
          fill={INK} opacity="0.2" />
        {/* Reflet haut-gauche (lumiere 11h) — matifie pour style parchemin */}
        <ellipse cx={-TOKEN_R * 0.22} cy={-TOKEN_R * 0.3} rx={TOKEN_R * 0.48} ry={TOKEN_R * 0.3}
          fill="white" opacity="0.06" />
        {/* Lisere interne */}
        <circle cx={0} cy={0} r={TOKEN_R - 5} fill="none" stroke="white" strokeWidth="2.5" opacity="0.25" />
        {/* Symbole */}
        <Sym />
      </g>

      {/* Label — typo unifiee INK sur fond parchemin */}
      <g opacity={labelOpacity}>
        <rect
          x={-labelW / 2}
          y={TOKEN_R + 10}
          width={labelW}
          height={28}
          rx={5}
          fill={PARCHMENT}
          stroke={INK}
          strokeWidth="1.5"
          opacity="0.94"
        />
        <text
          x={0}
          y={TOKEN_R + 29}
          textAnchor="middle"
          fontSize={isRenaud ? 14 : 16}
          fontFamily="serif"
          fontWeight={isRenaud ? "normal" : "bold"}
          fontStyle={isRenaud ? "italic" : "normal"}
          fill={INK}
          letterSpacing={isRenaud ? "1" : "2.5"}
          opacity={isRenaud ? 0.75 : 1}
        >
          {label}
        </text>
      </g>
    </g>
  );
};

// ── Taches d'encre vieillissement ─────────────────────────────
const InkStains: React.FC = () => (
  <g opacity="0.055" fill={INK}>
    {/* Taches organiques aux coins et bords */}
    <ellipse cx={68} cy={72} rx={42} ry={18} transform="rotate(-18 68 72)" />
    <ellipse cx={W - 82} cy={88} rx={30} ry={14} transform={`rotate(12 ${W - 82} 88)`} />
    <ellipse cx={W - 72} cy={H - 68} rx={46} ry={16} transform={`rotate(-8 ${W - 72} ${H - 68})`} />
    <ellipse cx={58} cy={H - 80} rx={34} ry={14} transform={`rotate(22 58 ${H - 80})`} />
    {/* Trainee bord haut */}
    <ellipse cx={620} cy={28} rx={55} ry={8} />
    {/* Trainee bord bas */}
    <ellipse cx={W - 480} cy={H - 24} rx={42} ry={7} />
    {/* Tache centre-droit */}
    <ellipse cx={W - 240} cy={CY + 180} rx={24} ry={10} transform={`rotate(35 ${W - 240} ${CY + 180})`} />
  </g>
);

// ── Coin ornemental heraldique ─────────────────────────────────
// Dessin depuis (0,0) vers l'interieur (bas-droite).
// mirror=true inverse horizontalement (coin droit), flip=true inverse verticalement (coin bas).
const HeraldCorner: React.FC<{ mirror?: boolean; flip?: boolean }> = ({
  mirror = false, flip = false,
}) => {
  const sx = mirror ? -1 : 1;
  const sy = flip ? -1 : 1;
  return (
    <g transform={`scale(${sx}, ${sy})`}>
      {/* Branche verticale : de 0 vers le bas */}
      <line x1={0} y1={4} x2={0} y2={56} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      {/* Branche horizontale : de 0 vers la droite */}
      <line x1={4} y1={0} x2={56} y2={0} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      {/* Double liseret interne */}
      <line x1={7} y1={8} x2={7} y2={50} stroke={INK} strokeWidth="1" opacity="0.4" />
      <line x1={8} y1={7} x2={50} y2={7} stroke={INK} strokeWidth="1" opacity="0.4" />
      {/* Raccord courbe interne */}
      <path d="M 0,4 Q 0,0 4,0" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 7,8 Q 7,7 8,7" fill="none" stroke={INK} strokeWidth="1" opacity="0.4" />
      {/* Ecusson central */}
      <g transform="translate(26, 26)">
        {/* Corps ecusson */}
        <path d="M -16,-18 L 16,-18 L 16,4 Q 0,18 -16,4 Z"
          fill={PARCHMENT} stroke={INK} strokeWidth="2" />
        {/* Motif : croix de saint */}
        <line x1="0" y1="-12" x2="0" y2="10" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
        <line x1="-9" y1="-2" x2="9" y2="-2" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
      </g>
      {/* Rosette extremite branche verticale */}
      <g transform="translate(0, 60)">
        <line x1={-8} y1={0} x2={8} y2={0} stroke={INK} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <circle cx={0} cy={0} r={4} fill={PARCHMENT} stroke={INK} strokeWidth="1.5" opacity="0.85" />
        <circle cx={0} cy={0} r={1.5} fill={INK} opacity="0.7" />
      </g>
      {/* Rosette extremite branche horizontale */}
      <g transform="translate(60, 0)">
        <line x1={0} y1={-8} x2={0} y2={8} stroke={INK} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <circle cx={0} cy={0} r={4} fill={PARCHMENT} stroke={INK} strokeWidth="1.5" opacity="0.85" />
        <circle cx={0} cy={0} r={1.5} fill={INK} opacity="0.7" />
      </g>
    </g>
  );
};

// ── Liseret interieur avec ornements ──────────────────────────
const InnerBorderOrnaments: React.FC = () => {
  const MARGIN = 38;
  const STEP = 72;
  const ornaments: React.ReactNode[] = [];
  // Bord haut et bas
  let x = MARGIN + STEP;
  while (x < W - MARGIN - STEP) {
    ornaments.push(
      <g key={`h-t-${x}`} transform={`translate(${x}, ${MARGIN})`}>
        <line x1={-6} y1={0} x2={6} y2={0} stroke={INK} strokeWidth="1" opacity="0.3" />
        <circle cx={0} cy={0} r={2} fill={INK} opacity="0.25" />
      </g>
    );
    ornaments.push(
      <g key={`h-b-${x}`} transform={`translate(${x}, ${H - MARGIN})`}>
        <line x1={-6} y1={0} x2={6} y2={0} stroke={INK} strokeWidth="1" opacity="0.3" />
        <circle cx={0} cy={0} r={2} fill={INK} opacity="0.25" />
      </g>
    );
    x += STEP;
  }
  // Bord gauche et droit
  let y = MARGIN + STEP;
  while (y < H - MARGIN - STEP) {
    ornaments.push(
      <g key={`v-l-${y}`} transform={`translate(${MARGIN}, ${y})`}>
        <line x1={0} y1={-6} x2={0} y2={6} stroke={INK} strokeWidth="1" opacity="0.3" />
        <circle cx={0} cy={0} r={2} fill={INK} opacity="0.25" />
      </g>
    );
    ornaments.push(
      <g key={`v-r-${y}`} transform={`translate(${W - MARGIN}, ${y})`}>
        <line x1={0} y1={-6} x2={0} y2={6} stroke={INK} strokeWidth="1" opacity="0.3" />
        <circle cx={0} cy={0} r={2} fill={INK} opacity="0.25" />
      </g>
    );
    y += STEP;
  }
  return <g>{ornaments}</g>;
};

// ── Cadre ornemental ─────────────────────────────────────────
const Frame: React.FC = () => (
  <g>
    {/* Bordure exterieure epaisse */}
    <rect x={14} y={14} width={W - 28} height={H - 28} fill="none" stroke={INK} strokeWidth="4" />
    {/* Bordure interieure fine */}
    <rect x={32} y={32} width={W - 64} height={H - 64} fill="none" stroke={INK} strokeWidth="1.2" opacity="0.5" />
    {/* Espace entre = zone brulee */}
    <rect x={15} y={15} width={W - 30} height={H - 30} fill="none"
      stroke={INK} strokeWidth="10" opacity="0.06" />

    {/* Coins heraldiques */}
    <g transform={`translate(32, 32)`}><HeraldCorner /></g>
    <g transform={`translate(${W - 32}, 32)`}><HeraldCorner mirror={true} /></g>
    <g transform={`translate(32, ${H - 32})`}><HeraldCorner flip={true} /></g>
    <g transform={`translate(${W - 32}, ${H - 32})`}><HeraldCorner mirror={true} flip={true} /></g>

    {/* Liseret avec ornements repetes */}
    <InnerBorderOrnaments />

    {/* Taches vieillissement */}
    <InkStains />

    {/* Titre */}
    <text x={CX} y={54} textAnchor="middle" fontSize="22" fontFamily="serif"
      fill={INK} letterSpacing="5" opacity="0.7">
      PLATEA VILLAE SANCTI PETRI
    </text>
    <line x1={CX - 260} y1={64} x2={CX + 260} y2={64}
      stroke={INK} strokeWidth="0.8" opacity="0.35" />
    {/* Petits ornements flanquant le titre */}
    <text x={CX - 282} y={56} textAnchor="middle" fontSize="18" fontFamily="serif"
      fill={INK} opacity="0.35">✦</text>
    <text x={CX + 282} y={56} textAnchor="middle" fontSize="18" fontFamily="serif"
      fill={INK} opacity="0.35">✦</text>

    {/* Mention bas gauche */}
    <text x={52} y={H - 28} fontSize="9" fontFamily="serif"
      fill={INK_LIGHT} fontStyle="italic" opacity="0.5">
      Anno Domini MCCCXLVII · Ante pestem
    </text>

    {/* Compas */}
    <g transform={`translate(${W - 65}, ${H - 65})`}>
      <circle cx={0} cy={0} r={22} fill="none" stroke={INK} strokeWidth="1" opacity="0.38" />
      <text x={0} y={-26} textAnchor="middle" fontSize="11" fontFamily="serif" fill={INK_LIGHT}>N</text>
      <polygon points="0,-20 -5,-5 5,-5" fill={INK} opacity="0.65" />
      <line x1={0} y1={20} x2={0} y2={7} stroke={INK} strokeWidth="1" opacity="0.38" />
      <line x1={-20} y1={0} x2={-7} y2={0} stroke={INK} strokeWidth="1" opacity="0.38" />
      <line x1={20} y1={0} x2={7} y2={0} stroke={INK} strokeWidth="1" opacity="0.38" />
    </g>
  </g>
);

// ── Scene principale ─────────────────────────────────────────
export const HookBlocA: React.FC = () => {
  const frame = useCurrentFrame();

  const globalOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t), // ease-in-out smooth
  });

  return (
    <AbsoluteFill style={{ background: INK }}>
      {/* Voix-off principale (version ralentie 1.12x) */}
      <Audio src={staticFile("audio/peste-pixel/hook/hook_00_saint_pierre_slow.mp3")} />

      {/* Parchemin au fade-in (seul pendant les 2 premieres secondes) */}
      <Sequence from={0} durationInFrames={45}>
        <Audio src={staticFile("audio/peste-pixel/sfx/parchment-reveal.mp3")} volume={0.40} />
      </Sequence>

      {/* Musique luth : demarre quand la voix commence (~frame 70) */}
      <Sequence from={70} durationInFrames={706 - 70}>
        <Audio src={staticFile("audio/peste-pixel/hookbloca-luth.mp3")} volume={0.05} />
      </Sequence>

      {/* Cloche eglise sur entree de Martin (pretre) */}
      <Sequence from={TOKEN_ENTERS.martin} durationInFrames={90}>
        <Audio src={staticFile("audio/peste-pixel/sfx/church-bell-single.mp3")} volume={0.30} />
      </Sequence>

      {/* Token drop : un son par jeton qui arrive */}
      {(Object.keys(TOKEN_ENTERS) as (keyof typeof TOKEN_ENTERS)[]).map((id) => (
        <Sequence key={`sfx-${id}`} from={TOKEN_ENTERS[id]} durationInFrames={25}>
          <Audio src={staticFile("audio/peste-pixel/sfx/token-drop-wood.mp3")} volume={0.35} />
        </Sequence>
      ))}

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ba-parchment" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="4" seed="7" result="n" />
            <feColorMatrix type="matrix"
              values="0 0 0 0 0.96  0 0 0 0 0.90  0 0 0 0 0.78  0 0 0 0.09 0"
              result="t" />
            <feComposite in="t" in2="SourceGraphic" operator="over" />
          </filter>
          <radialGradient id="ba-vignette" cx="50%" cy="50%" r="62%">
            <stop offset="50%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor={INK} stopOpacity="0.18" />
          </radialGradient>
        </defs>

        {/* Fond noir (derriere le fade-in) */}
        <rect width={W} height={H} fill={INK} />

        {/* Contenu carte — fade in global */}
        <g opacity={globalOpacity}>
          {/* Fond parchemin */}
          <rect width={W} height={H} fill={PARCHMENT} />
          <rect width={W} height={H} fill={PARCHMENT} filter="url(#ba-parchment)" />
          <rect width={W} height={H} fill="url(#ba-vignette)" />

          {/* Foret peripherique */}
          <IcArbre x={CX - 680} y={CY - 340} r={28} />
          <IcArbre x={CX - 625} y={CY - 298} r={22} />
          <IcArbre x={CX - 702} y={CY - 258} r={20} />
          <IcArbre x={CX + 678} y={CY - 318} r={26} />
          <IcArbre x={CX + 718} y={CY - 258} r={20} />
          <IcArbre x={CX - 658} y={CY + 298} r={24} />
          <IcArbre x={CX - 698} y={CY + 358} r={18} />
          <IcArbre x={CX + 658} y={CY + 298} r={22} />
          <IcArbre x={CX + 698} y={CY + 358} r={20} />
          <IcArbre x={CX + 52} y={CY + 378} r={16} />
          <IcArbre x={CX - 82} y={CY - 388} r={16} />

          {/* Chemins */}
          <Road x1={CX} y1={80} x2={CX} y2={H - 80} />
          <Road x1={80} y1={CY} x2={W - 80} y2={CY} />
          <Road x1={CX - 48} y1={CY - 48} x2={CX - 422} y2={CY - 362} w={44} />
          <Road x1={CX + 48} y1={CY + 48} x2={CX + 442} y2={CY + 362} w={44} />

          {/* Champs SE */}
          <rect x={CX + 185} y={CY + 148} width={295} height={178} rx={8}
            fill={PARCHMENT_D} stroke={INK} strokeWidth="1" opacity="0.32" />
          {[0, 22, 44, 66, 88, 110, 132, 154].map((dy, i) => (
            <line key={i} x1={CX + 190} y1={CY + 153 + dy} x2={CX + 475} y2={CY + 153 + dy}
              stroke={INK} strokeWidth="0.6" opacity="0.18" />
          ))}
          <text x={CX + 332} y={CY + 352} textAnchor="middle" fontSize="10" fontFamily="serif"
            fill={INK_LIGHT} fontStyle="italic" opacity="0.55">Champs</text>

          {/* Place centrale */}
          <ellipse cx={CX} cy={CY} rx={158} ry={92}
            fill={PARCHMENT_D} stroke={INK} strokeWidth="2" opacity="0.48" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
            const r = (deg * Math.PI) / 180;
            return (
              <line key={i} x1={CX} y1={CY}
                x2={CX + Math.cos(r) * 142} y2={CY + Math.sin(r) * 82}
                stroke={INK} strokeWidth="0.7" opacity="0.16" />
            );
          })}

          {/* Batiments (scale via group) */}
          <g transform={`translate(${CX + 10},${CY - 264}) scale(1.6)`}><IcEglise x={0} y={0} /></g>
          <g transform={`translate(${CX - 384},${CY - 258}) scale(1.4)`}><IcTour x={0} y={0} /></g>
          <g transform={`translate(${CX - 282},${CY + 8}) scale(1.3)`}><IcAuberge x={0} y={0} /></g>
          <g transform={`translate(${CX + 348},${CY - 198}) scale(1.3)`}><IcGrange x={0} y={0} /></g>
          <g transform={`translate(${CX - 12},${CY + 128}) scale(1.3)`}><IcForge x={0} y={0} /></g>
          <IcPuits x={CX} y={CY} />

          {/* 6 Jetons */}
          {(Object.keys(TOKEN) as (keyof typeof TOKEN)[]).map((id) => (
            <GameToken key={id} id={id} frame={frame} />
          ))}

          {/* Cadre */}
          <Frame />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
