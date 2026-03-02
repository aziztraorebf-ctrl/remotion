import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { AbsoluteFill } from "remotion";

// Palette gravure
const PARCHMENT = "#f0e6c8";
const INK = "#1a1008";
const INK_MID = "#3a2510";
const INK_LIGHT = "#7a5c38";
const STONE = "#c8b898";
const ROOF_DARK = "#2a1a08";

// ── Patterns et filtres ─────────────────────────────────────────────────────
const Defs: React.FC = () => (
  <defs>
    {/* Hachure 45 degres */}
    <pattern id="td-hatch45" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="6" stroke={INK} strokeWidth="0.8" opacity="0.4" />
    </pattern>
    {/* Hachure croisee */}
    <pattern id="td-crosshatch" patternUnits="userSpaceOnUse" width="6" height="6">
      <line x1="0" y1="0" x2="6" y2="6" stroke={INK} strokeWidth="0.7" opacity="0.35" />
      <line x1="6" y1="0" x2="0" y2="6" stroke={INK} strokeWidth="0.7" opacity="0.35" />
    </pattern>
    {/* Hachure dense ombre */}
    <pattern id="td-dense" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="1.2" opacity="0.55" />
    </pattern>
    {/* Pierres */}
    <pattern id="td-cobble" patternUnits="userSpaceOnUse" width="16" height="10">
      <rect width="16" height="10" fill="none" stroke={INK} strokeWidth="0.6" opacity="0.3" />
      <line x1="8" y1="0" x2="8" y2="10" stroke={INK} strokeWidth="0.5" opacity="0.2" />
    </pattern>
    {/* Texture parchemin */}
    <filter id="td-parchment">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" seed="5" result="noise" />
      <feColorMatrix type="matrix"
        values="0 0 0 0 0.88  0 0 0 0 0.78  0 0 0 0 0.58  0 0 0 0.12 0"
        result="tint" />
      <feComposite in="tint" in2="SourceGraphic" operator="over" />
    </filter>
    {/* Ombre douce */}
    <filter id="td-drop" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="3" dy="3" stdDeviation="5" floodColor={INK} floodOpacity="0.25" />
    </filter>
    {/* Grain encre */}
    <filter id="td-ink-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="n" />
      <feColorMatrix type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0"
        result="g" />
      <feComposite in="g" in2="SourceGraphic" operator="over" />
    </filter>
  </defs>
);

// ── Batiment vu de dessus (cavalier) ────────────────────────────────────────
// Face visible sur le bas du batiment, toit incline vers le haut
interface CavalierBuildingProps {
  x: number;       // centre X
  y: number;       // centre Y (point de reference sol)
  w: number;       // largeur
  faceH: number;   // hauteur de la facade visible (perspective cavaliere)
  roofH: number;   // profondeur du toit vu du dessus
  label?: string;
  hasChurch?: boolean;
  hasTower?: boolean;
}

const CavalierBuilding: React.FC<CavalierBuildingProps> = ({
  x, y, w, faceH, roofH, label, hasChurch, hasTower,
}) => {
  const left = x - w / 2;
  const faceTop = y - faceH;
  const roofTop = faceTop - roofH;

  return (
    <g filter="url(#td-drop)">
      {/* Toit (vue du dessus - plan incline) */}
      <rect x={left} y={roofTop} width={w} height={roofH}
        fill={ROOF_DARK} stroke={INK} strokeWidth="1.5" />
      {/* Hachures du toit */}
      <rect x={left} y={roofTop} width={w} height={roofH}
        fill="url(#td-hatch45)" />
      {/* Arete de toit */}
      <line x1={left + w * 0.18} y1={roofTop + roofH * 0.3} x2={left + w * 0.82} y2={roofTop + roofH * 0.3}
        stroke={INK_LIGHT} strokeWidth="1" opacity="0.6" />

      {/* Facade visible */}
      <rect x={left} y={faceTop} width={w} height={faceH}
        fill={STONE} stroke={INK} strokeWidth="1.5" />
      {/* Texture pierres facade */}
      <rect x={left} y={faceTop} width={w} height={faceH}
        fill="url(#td-cobble)" />

      {/* Fenetre(s) */}
      {w > 70 && (
        <>
          <rect x={x - 24} y={faceTop + faceH * 0.25} width={14} height={faceH * 0.45}
            rx={7} fill={INK} stroke={INK} strokeWidth="1" />
          <rect x={x + 10} y={faceTop + faceH * 0.25} width={14} height={faceH * 0.45}
            rx={7} fill={INK} stroke={INK} strokeWidth="1" />
        </>
      )}
      {w <= 70 && w > 40 && (
        <rect x={x - 8} y={faceTop + faceH * 0.25} width={16} height={faceH * 0.45}
          rx={8} fill={INK} stroke={INK} strokeWidth="1" />
      )}

      {/* Porte */}
      <rect x={x - w * 0.12} y={faceTop + faceH * 0.4} width={w * 0.24} height={faceH * 0.6}
        rx={w * 0.06} fill={INK} stroke={INK} strokeWidth="1" />

      {/* Clocher eglise */}
      {hasChurch && (
        <g>
          <rect x={x - 16} y={roofTop - 60} width={32} height={60}
            fill={STONE} stroke={INK} strokeWidth="1.5" />
          <rect x={x - 16} y={roofTop - 60} width={32} height={60}
            fill="url(#td-hatch45)" />
          {/* Fleche */}
          <polygon
            points={`${x},${roofTop - 100} ${x - 12},${roofTop - 62} ${x + 12},${roofTop - 62}`}
            fill={INK} stroke={INK} strokeWidth="1" />
          {/* Croix */}
          <line x1={x} y1={roofTop - 116} x2={x} y2={roofTop - 100} stroke={INK} strokeWidth="2" />
          <line x1={x - 7} y1={roofTop - 110} x2={x + 7} y2={roofTop - 110} stroke={INK} strokeWidth="2" />
        </g>
      )}

      {/* Tour fortifiee */}
      {hasTower && (
        <g>
          <rect x={left - 20} y={roofTop - 50} width={25} height={50 + faceH}
            fill={STONE} stroke={INK} strokeWidth="1.5" />
          {/* Creneaux */}
          {[0, 1, 2].map(i => (
            <rect key={i} x={left - 19 + i * 8} y={roofTop - 58} width={5} height={10}
              fill={STONE} stroke={INK} strokeWidth="1" />
          ))}
        </g>
      )}

      {/* Label */}
      {label && (
        <text x={x} y={faceTop + faceH * 0.22} textAnchor="middle"
          fontSize="9" fontFamily="serif" fill={INK_MID} fontStyle="italic">
          {label}
        </text>
      )}
    </g>
  );
};

// ── Personnage top-down (silhouette vue du dessus) ──────────────────────────
interface TopDownCharProps {
  x: number;
  y: number;
  angle: number; // direction de marche en radians
  type?: "a" | "b" | "c" | "d";
}

const TopDownChar: React.FC<TopDownCharProps> = ({ x, y, angle, type = "a" }) => {
  const bodyW = type === "c" ? 10 : 8;
  const bodyH = type === "c" ? 18 : 14;
  const headR = type === "c" ? 6 : 5;
  const bodyFill = type === "b" ? ROOF_DARK : type === "d" ? "#6a4a2a" : INK_MID;

  return (
    <g transform={`translate(${x},${y}) rotate(${(angle * 180) / Math.PI + 90})`} filter="url(#td-ink-grain)">
      {/* Corps ellipse */}
      <ellipse cx={0} cy={0} rx={bodyW / 2} ry={bodyH / 2} fill={bodyFill} stroke={INK} strokeWidth="0.8" />
      {/* Ombre corps */}
      <ellipse cx={0} cy={0} rx={bodyW / 2} ry={bodyH / 2} fill="url(#td-hatch45)" />
      {/* Tete */}
      <circle cx={0} cy={-bodyH / 2 - headR + 2} r={headR} fill={bodyFill} stroke={INK} strokeWidth="0.8" />
    </g>
  );
};

// ── Puits central ───────────────────────────────────────────────────────────
const Well: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    {/* Bassin */}
    <circle cx={x} cy={y} r={28} fill={STONE} stroke={INK} strokeWidth="2" />
    <circle cx={x} cy={y} r={28} fill="url(#td-crosshatch)" />
    <circle cx={x} cy={y} r={20} fill={INK} stroke={INK} strokeWidth="1.5" fillOpacity="0.7" />
    <circle cx={x} cy={y} r={12} fill={INK} fillOpacity="0.9" />
    {/* Reflets eau */}
    <ellipse cx={x - 4} cy={y - 3} rx={5} ry={2} fill={PARCHMENT} opacity="0.25" />
    {/* Structure bois */}
    <line x1={x - 28} y1={y - 28} x2={x + 28} y2={y - 28} stroke={INK} strokeWidth="2.5" />
    <line x1={x - 28} y1={y + 28} x2={x + 28} y2={y + 28} stroke={INK} strokeWidth="2.5" />
    <rect x={x - 4} y={y - 40} width={8} height={20} fill={INK_MID} stroke={INK} strokeWidth="1" />
    <text x={x} y={y + 50} textAnchor="middle" fontSize="8" fontFamily="serif" fill={INK_MID} fontStyle="italic">
      fons
    </text>
  </g>
);

// ── Arbre vu du dessus ──────────────────────────────────────────────────────
const TopDownTree: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 22 }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={INK_MID} stroke={INK} strokeWidth="1.2" opacity="0.8" />
    <circle cx={x} cy={y} r={r} fill="url(#td-hatch45)" />
    <circle cx={x - r * 0.25} cy={y - r * 0.2} r={r * 0.55} fill={INK} opacity="0.25" />
    <circle cx={x} cy={y} r={4} fill={INK} opacity="0.6" />
  </g>
);

// ── Marche (etals) ──────────────────────────────────────────────────────────
const MarketStall: React.FC<{ x: number; y: number; angle: number }> = ({ x, y, angle }) => (
  <g transform={`translate(${x},${y}) rotate(${angle})`}>
    <rect x={-22} y={-10} width={44} height={20} rx={2}
      fill={STONE} stroke={INK} strokeWidth="1.2" />
    <rect x={-22} y={-10} width={44} height={20} rx={2}
      fill="url(#td-hatch45)" />
    {/* Auvent */}
    <rect x={-22} y={-16} width={44} height={8}
      fill={INK_MID} stroke={INK} strokeWidth="1" />
    {/* Franges */}
    {[-16, -8, 0, 8, 16].map(i => (
      <line key={i} x1={i} y1={-8} x2={i + 2} y2={-4} stroke={INK} strokeWidth="0.7" />
    ))}
  </g>
);

// ── Dalle pavee (place centrale) ────────────────────────────────────────────
const PlacePavee: React.FC<{ cx: number; cy: number; rx: number; ry: number }> = ({
  cx, cy, rx, ry,
}) => (
  <g>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={STONE} stroke={INK} strokeWidth="2" opacity="0.5" />
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#td-cobble)" />
  </g>
);

// ── Scene principale ─────────────────────────────────────────────────────────
export const TopDownVillage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Centre de la place
  const cx = 960;
  const cy = 560;

  // Personnages qui tournent autour du puits
  const walk = frame * 0.008;
  const charA = { x: cx + Math.cos(walk) * 120,           y: cy + Math.sin(walk) * 60,            angle: walk + Math.PI / 2 };
  const charB = { x: cx + Math.cos(walk + Math.PI) * 110, y: cy + Math.sin(walk + Math.PI) * 55,  angle: walk + Math.PI * 1.5 };
  const charC = { x: cx + Math.cos(walk * 0.7 + 1) * 80,  y: cy + Math.sin(walk * 0.7 + 1) * 40,  angle: walk * 0.7 + 1.5 };

  // Personnage statique (marchand a son etal)
  const merchantX = cx - 180;
  const merchantY = cy + 80;

  // Groupe de gens pres de l'eglise
  const groupWalk = frame * 0.006;
  const p1 = { x: cx - 280 + Math.cos(groupWalk) * 15, y: cy - 200 + Math.sin(groupWalk) * 8 };
  const p2 = { x: cx - 250 + Math.cos(groupWalk + 1) * 10, y: cy - 185 + Math.sin(groupWalk + 1) * 6 };

  // Charrette qui traverse (gauche a droite)
  const cartX = interpolate(frame, [0, 300], [-80, 2000], { extrapolateRight: "clamp" });
  const cartY = cy + 140;

  return (
    <AbsoluteFill style={{ background: PARCHMENT }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <Defs />

        {/* ── Fond parchemin ── */}
        <rect width="1920" height="1080" fill={PARCHMENT} />
        <rect width="1920" height="1080" fill={PARCHMENT} filter="url(#td-parchment)" />

        {/* ── Rues rayonnantes depuis la place ── */}
        {/* Rue nord */}
        <rect x={cx - 35} y={100} width={70} height={cy - 100} fill="url(#td-cobble)" opacity="0.7" />
        {/* Rue sud */}
        <rect x={cx - 35} y={cy} width={70} height={980 - cy} fill="url(#td-cobble)" opacity="0.7" />
        {/* Rue ouest */}
        <rect x={50} y={cy - 35} width={cx - 50} height={70} fill="url(#td-cobble)" opacity="0.7" />
        {/* Rue est */}
        <rect x={cx} y={cy - 35} width={1870 - cx} height={70} fill="url(#td-cobble)" opacity="0.7" />

        {/* Bords de rues (encadrement) */}
        <line x1={cx - 35} y1={100} x2={cx - 35} y2={cy - 95} stroke={INK} strokeWidth="1.5" opacity="0.5" />
        <line x1={cx + 35} y1={100} x2={cx + 35} y2={cy - 95} stroke={INK} strokeWidth="1.5" opacity="0.5" />
        <line x1={50} y1={cy - 35} x2={cx - 95} y2={cy - 35} stroke={INK} strokeWidth="1.5" opacity="0.5" />
        <line x1={50} y1={cy + 35} x2={cx - 95} y2={cy + 35} stroke={INK} strokeWidth="1.5" opacity="0.5" />
        <line x1={cx + 95} y1={cy - 35} x2={1870} y2={cy - 35} stroke={INK} strokeWidth="1.5" opacity="0.5" />
        <line x1={cx + 95} y1={cy + 35} x2={1870} y2={cy + 35} stroke={INK} strokeWidth="1.5" opacity="0.5" />

        {/* ── Place centrale ── */}
        <PlacePavee cx={cx} cy={cy} rx={200} ry={110} />

        {/* ── Batiments ── */}
        {/* Eglise - nord */}
        <CavalierBuilding x={cx} y={cy - 270} w={160} faceH={55} roofH={90} hasChurch label="Sanctus Petrus" />

        {/* Taverne - ouest */}
        <CavalierBuilding x={cx - 400} y={cy + 80} w={130} faceH={50} roofH={70} label="Auberge du Rat" />

        {/* Maison marchande - est */}
        <CavalierBuilding x={cx + 380} y={cy - 80} w={110} faceH={45} roofH={65} />

        {/* Rempart / guet - nord-ouest */}
        <CavalierBuilding x={cx - 550} y={cy - 200} w={90} faceH={40} roofH={55} hasTower />

        {/* Maison 2 - sud-est */}
        <CavalierBuilding x={cx + 480} y={cy + 180} w={100} faceH={42} roofH={60} />

        {/* Maison 3 - nord-est */}
        <CavalierBuilding x={cx + 320} y={cy - 230} w={85} faceH={38} roofH={52} />

        {/* Maison 4 - sud-ouest */}
        <CavalierBuilding x={cx - 450} y={cy + 250} w={95} faceH={40} roofH={58} />

        {/* ── Arbres dans les coins ── */}
        <TopDownTree x={cx - 680} y={cy - 300} r={28} />
        <TopDownTree x={cx - 640} y={cy - 240} r={20} />
        <TopDownTree x={cx + 650} y={cy - 280} r={26} />
        <TopDownTree x={cx + 700} y={cy + 300} r={24} />
        <TopDownTree x={cx - 700} y={cy + 320} r={30} />
        <TopDownTree x={cx + 150} y={cy + 350} r={18} />

        {/* ── Etals du marche ── */}
        <MarketStall x={cx - 180} y={cy + 70} angle={0} />
        <MarketStall x={cx + 160} y={cy + 80} angle={0} />
        <MarketStall x={cx + 80}  y={cy - 100} angle={90} />

        {/* ── Puits central ── */}
        <Well x={cx} y={cy} />

        {/* ── Charrette traversant la rue est-ouest ── */}
        <g transform={`translate(${cartX}, ${cartY})`}>
          <rect x={-35} y={-14} width={70} height={28} rx={3}
            fill={INK_MID} stroke={INK} strokeWidth="1.5" />
          {/* Roues */}
          <circle cx={-22} cy={14} r={10} fill="none" stroke={INK} strokeWidth="2" />
          <circle cx={22}  cy={14} r={10} fill="none" stroke={INK} strokeWidth="2" />
          <line x1={-22} y1={4} x2={-22} y2={24} stroke={INK} strokeWidth="1" />
          <line x1={-32} y1={14} x2={-12} y2={14} stroke={INK} strokeWidth="1" />
          <line x1={22} y1={4} x2={22} y2={24} stroke={INK} strokeWidth="1" />
          <line x1={12} y1={14} x2={32} y2={14} stroke={INK} strokeWidth="1" />
          {/* Timon */}
          <line x1={-35} y1={0} x2={-60} y2={-5} stroke={INK} strokeWidth="2" />
        </g>

        {/* ── Personnages en mouvement ── */}
        <TopDownChar x={charA.x} y={charA.y} angle={charA.angle} type="a" />
        <TopDownChar x={charB.x} y={charB.y} angle={charB.angle} type="b" />
        <TopDownChar x={charC.x} y={charC.y} angle={charC.angle} type="c" />

        {/* Marchand statique */}
        <TopDownChar x={merchantX} y={merchantY} angle={0} type="d" />

        {/* Groupe pres de l'eglise */}
        <TopDownChar x={p1.x} y={p1.y} angle={Math.PI * 0.8} type="a" />
        <TopDownChar x={p2.x} y={p2.y} angle={Math.PI * 0.6} type="b" />

        {/* ── Cadre double bord parchemin ── */}
        <rect x={18} y={18} width={1884} height={1044} fill="none" stroke={INK} strokeWidth="3" />
        <rect x={26} y={26} width={1868} height={1028} fill="none" stroke={INK} strokeWidth="1" />

        {/* ── Titre cartographique ── */}
        <text x={cx} y={60} textAnchor="middle" fontSize="24"
          fontFamily="serif" fill={INK} letterSpacing="6">
          PLATEA VILLAE SANCTI PETRI
        </text>
        <line x1={cx - 280} y1={70} x2={cx + 280} y2={70} stroke={INK} strokeWidth="1" opacity="0.5" />

        {/* Rose des vents - coin bas droit */}
        <g transform="translate(1820, 980)">
          <text x={0} y={-24} textAnchor="middle" fontSize="10" fontFamily="serif" fill={INK_MID}>N</text>
          <line x1={0} y1={-20} x2={0} y2={-8} stroke={INK} strokeWidth="1.5" />
          <polygon points="0,-8 -4,0 4,0" fill={INK} />
          <circle cx={0} cy={0} r={14} fill="none" stroke={INK} strokeWidth="1" opacity="0.5" />
          <line x1={-14} y1={0} x2={14} y2={0} stroke={INK} strokeWidth="0.7" opacity="0.4" />
          <line x1={0} y1={-14} x2={0} y2={14} stroke={INK} strokeWidth="0.7" opacity="0.4" />
        </g>

        {/* Annotation marginale */}
        <text x={40} y={1040} fontSize="9" fontFamily="serif" fill={INK_MID}
          fontStyle="italic" opacity="0.6">
          Anno Domini MCCCXLVII · Ante pestem
        </text>
      </svg>
    </AbsoluteFill>
  );
};
