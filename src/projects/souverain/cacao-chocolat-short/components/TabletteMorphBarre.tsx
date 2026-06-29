import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

// TabletteMorphBarre — composant PURE PROP pour le Beat 3 cacao-chocolat-short
// Morphing : tablette de chocolat (progress=0) → barre de répartition de valeur 6%/94% (progress=1)
// Prop : progress 0..1 (calculé par le beat parent, jamais par useCurrentFrame ici)
// Palette fermée : encre #2b2117, parchemin #e8dcc0, brun #6b4423, brun-sombre #4a2c14, nuit #2b1810, rouge #c8202f
// Pas de texte, pas d'emoji dans le code.

// ── Palette ──────────────────────────────────────────────────────────────────
const COCOA = "#6b4423";        // brun chocolat, part du paysan
const COCOA_DARK = "#4a2c14";   // brun sombre profond
const NIGHT = "#2b1810";        // brun nuit = part marques/distributeurs
const SWISS_RED = "#c8202f";    // rouge croix suisse
const INK = "#2b2117";          // encre principale (contours, sillons)
const PARCH_WHITE = "#e8dcc0";  // parchemin, réserve croix blanche

// ── Dimensions tablette (progress=0) ─────────────────────────────────────────
const TAB_W = 700;
const TAB_H = 860;
const TAB_CX = 540;
const TAB_CY = 960; // centré verticalement sur 1920
const COLS = 4;
const ROWS = 6;

// ── Dimensions barre (progress=1) ────────────────────────────────────────────
const BAR_W = 940;
const BAR_H = 190; // plus haute = plus presente, le 6/94 a du poids
const BAR_CX = 540;
const BAR_CY = 960;

// Part paysan ~6%, marques ~94%
const PAYSAN_RATIO = 0.06;

// ── Croix suisse : dimensions calées sur 1 carreau de tablette ───────────────
// Un carreau = TAB_W/COLS × TAB_H/ROWS => ~175px × 143px
// La croix s'inscrit dans ce carreau, centré sur la tablette
const CROSS_SIZE = 104;
const CROSS_ARM = CROSS_SIZE * 0.62;
const CROSS_ARM_W = CROSS_SIZE * 0.24;
const CROSS_CX = TAB_CX; // centré horizontalement sur la tablette
const CROSS_CY = TAB_CY - 40; // légèrement au-dessus du centre pour tomber dans un carreau

// ── Helper interpolation clampée ─────────────────────────────────────────────
const lerp = (p: number, a: number, b: number): number =>
  interpolate(p, [0, 1], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Interpolation partielle (sous-plage de progress)
const lerpRange = (p: number, pA: number, pB: number, vA: number, vB: number): number =>
  interpolate(p, [pA, pB], [vA, vB], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ── Calcul des coordonnées morphées ──────────────────────────────────────────
// La tablette passe de ses dimensions à celles de la barre via interpolation directe des coins.
// L'effet "écrasement + étirement" est obtenu en morphant w, h, cx, cy séparément.
const getMorphed = (progress: number) => {
  const w = lerp(progress, TAB_W, BAR_W);
  const h = lerp(progress, TAB_H, BAR_H);
  const cx = lerp(progress, TAB_CX, BAR_CX);
  const cy = lerp(progress, TAB_CY, BAR_CY);

  const x = cx - w / 2;
  const y = cy - h / 2;

  return { w, h, cx, cy, x, y };
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface TabletteMorphBarreProps {
  progress: number; // 0 = tablette complète, 1 = barre 6/94
}

// ── Groupe SILLONS (quadrillage carreaux) ─────────────────────────────────────
// Fondent progressivement : opacité 1→0 entre progress 0.3→0.7
// Géométrie : les sillons se déforment avec la tablette (proportionnel)
const GrilleSillons: React.FC<{ progress: number }> = ({ progress }) => {
  const { w, h, x, y } = getMorphed(progress);
  const opacity = lerpRange(progress, 0.25, 0.65, 1, 0);

  if (opacity < 0.01) return null;

  const vlines: string[] = [];
  for (let c = 1; c < COLS; c++) {
    const lx = x + w * (c / COLS);
    vlines.push(`M ${lx} ${y} L ${lx} ${y + h}`);
  }
  const hlines: string[] = [];
  for (let r = 1; r < ROWS; r++) {
    const ly = y + h * (r / ROWS);
    hlines.push(`M ${x} ${ly} L ${x + w} ${ly}`);
  }

  return (
    <g opacity={opacity} stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round">
      {vlines.map((d, i) => (
        <path key={`v${i}`} d={d} />
      ))}
      {hlines.map((d, i) => (
        <path key={`h${i}`} d={d} />
      ))}
    </g>
  );
};

// ── Croix suisse ──────────────────────────────────────────────────────────────
// Opacité 1 à progress=0, disparait entre 0→0.4
const CrossSuisse: React.FC<{ progress: number }> = ({ progress }) => {
  const opacity = lerpRange(progress, 0, 0.4, 1, 0);
  if (opacity < 0.01) return null;

  const cs = CROSS_SIZE;
  const arm = CROSS_ARM;
  const aw = CROSS_ARM_W;
  const cx = CROSS_CX;
  const cy = CROSS_CY;

  return (
    <g opacity={opacity}>
      {/* Carré rouge */}
      <rect
        x={cx - cs / 2}
        y={cy - cs / 2}
        width={cs}
        height={cs}
        rx={8}
        fill={SWISS_RED}
        stroke={INK}
        strokeWidth={2.4}
      />
      {/* Ombre interne embossée (effet en creux) */}
      <path
        d={`M ${cx - cs / 2 + 3} ${cy + cs / 2 - 3}
            L ${cx - cs / 2 + 3} ${cy - cs / 2 + 3}
            L ${cx + cs / 2 - 3} ${cy - cs / 2 + 3}`}
        stroke={COCOA_DARK}
        strokeWidth={2.6}
        fill="none"
        opacity={0.65}
      />
      {/* Croix blanche en réserve */}
      <path
        d={`M ${cx - aw} ${cy - arm}
            L ${cx + aw} ${cy - arm}
            L ${cx + aw} ${cy - aw}
            L ${cx + arm} ${cy - aw}
            L ${cx + arm} ${cy + aw}
            L ${cx + aw} ${cy + aw}
            L ${cx + aw} ${cy + arm}
            L ${cx - aw} ${cy + arm}
            L ${cx - aw} ${cy + aw}
            L ${cx - arm} ${cy + aw}
            L ${cx - arm} ${cy - aw}
            L ${cx - aw} ${cy - aw} Z`}
        fill={PARCH_WHITE}
        stroke="none"
      />
    </g>
  );
};

// ── Corps principal morphé (remplissage + contour) ────────────────────────────
// progress 0→1 : tablette brune → barre segmentée 6/94
const CorpsMorphe: React.FC<{ progress: number }> = ({ progress }) => {
  const { w, h, x, y } = getMorphed(progress);

  // À partir de progress 0.5, on commence à voir la segmentation 6/94 apparaître
  const segmentOpacity = lerpRange(progress, 0.45, 0.85, 0, 1);

  const paysanW = w * PAYSAN_RATIO;
  const marquesX = x + paysanW;
  const marquesW = w * (1 - PAYSAN_RATIO);

  // Rayon des coins : arrondi fort sur tablette (16px), plat sur barre (4px)
  const rx = lerp(progress, 16, 4);

  return (
    <g>
      {/* ── Fond tablette unifié (visible surtout à progress < 0.5) ── */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill={COCOA}
        stroke={INK}
        strokeWidth={lerpRange(progress, 0, 0.5, 3, 2)}
      />

      {/* ── Segment marques (94% droite) — brun NUIT avec TEXTURE (relief, pas plat) ── */}
      <rect
        x={marquesX}
        y={y}
        width={marquesW}
        height={h}
        rx={rx}
        fill={NIGHT}
        opacity={segmentOpacity}
        stroke="none"
      />
      {/* texture du 94% : fines lignes verticales (relief de masse, plus "lourd") */}
      {segmentOpacity > 0.1 &&
        Array.from({ length: 7 }, (_, k) => {
          const lx = marquesX + (marquesW * (k + 1)) / 8;
          return (
            <line key={k} x1={lx} y1={y + 8} x2={lx} y2={y + h - 8}
              stroke="#1a0f08" strokeWidth={1.5} opacity={segmentOpacity * 0.4} />
          );
        })}

      {/* ── Segment paysan (6% gauche) — brun-vie VIF bien marque (le petit qui doit ressortir) ── */}
      <rect
        x={x}
        y={y}
        width={paysanW}
        height={h}
        rx={rx}
        fill="#8a5a2f"
        opacity={segmentOpacity}
        stroke="none"
      />

      {/* SEPARATEUR FORT entre 6% et 94% (la coupure de l'injustice) */}
      {segmentOpacity > 0.05 && (
        <line
          x1={marquesX}
          y1={y - 6}
          x2={marquesX}
          y2={y + h + 6}
          stroke={INK}
          strokeWidth={4}
          opacity={segmentOpacity}
        />
      )}

      {/* Contour final sur la barre segmentee (epais = present) */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill="none"
        stroke={INK}
        strokeWidth={3.5}
        opacity={segmentOpacity}
      />
    </g>
  );
};

// ── Filet "valeur qui fuit" vers la droite ────────────────────────────────────
// Actif à partir de progress > 0.6 : un path sombre s'allonge vers le bord droit de l'écran.
// Comme de l'or/chocolat fondu qui s'écoule hors cadre — référence pipelines Sénégal.
const FiletFuite: React.FC<{ progress: number }> = ({ progress }) => {
  if (progress < 0.6) return null;

  const { w, h, x, y } = getMorphed(progress);
  const barreRight = x + w; // bord droit de la barre
  const barre_cy = y + h / 2; // centre vertical de la barre

  // Le filet s'allonge jusqu'au bord (la valeur FUIT hors cadre vers les marques)
  const filetLength = lerpRange(progress, 0.55, 1, 0, 520);
  const filetOpacity = lerpRange(progress, 0.55, 0.72, 0, 0.95);
  const filetH = lerpRange(progress, 0.55, 1, h * 0.7, h * 0.42); // reste epais = coulee visible

  if (filetLength < 2) return null;

  // Le filet est un trapèze : large à gauche (côté barre), fin à droite (disparaît)
  const ly = barre_cy - filetH / 2;
  const ry = barre_cy - filetH * 0.06;
  const endX = Math.min(barreRight + filetLength, 1080); // ne dépasse pas le bord SVG

  const pathD = [
    `M ${barreRight} ${ly}`,
    `L ${endX} ${ry}`,
    `L ${endX} ${barre_cy + filetH * 0.06}`,
    `L ${barreRight} ${ly + filetH}`,
    "Z",
  ].join(" ");

  // Dégradé : plein côté barre, transparent côté bord
  const gradId = "filetGrad";

  return (
    <g opacity={filetOpacity}>
      <defs>
        <linearGradient id={gradId} x1={barreRight} y1="0" x2={endX} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={NIGHT} stopOpacity={0.92} />
          <stop offset="70%" stopColor={NIGHT} stopOpacity={0.5} />
          <stop offset="100%" stopColor={NIGHT} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={pathD} fill={`url(#${gradId})`} stroke="none" />
    </g>
  );
};

// ── Labels 6% / 94% (discrets, apparaissent quand la barre est formee) ───────────
const LabelsBarre: React.FC<{ progress: number }> = ({ progress }) => {
  if (progress < 0.7) return null;
  const { w, h, x, y } = getMorphed(progress);
  const op = lerpRange(progress, 0.7, 0.92, 0, 0.85);
  const paysanW = w * PAYSAN_RATIO;
  const yLabel = y + h + 38;
  return (
    <g opacity={op} fontFamily="Georgia, 'Times New Roman', serif">
      {/* tiret indicateur + label PAYSAN sous le petit segment */}
      <line x1={x + paysanW / 2} y1={y + h + 4} x2={x + paysanW / 2} y2={y + h + 22} stroke={INK} strokeWidth={2} />
      <text x={x - 6} y={yLabel} fontSize={26} fontWeight={700} fill="#8a5a2f">PAYSAN ~6%</text>
      {/* label MARQUES sous le grand segment (aligne a droite) */}
      <text x={x + w} y={yLabel} fontSize={26} fontWeight={700} fill={NIGHT} textAnchor="end">MARQUES + DISTRIBUTEURS ~94%</text>
    </g>
  );
};

// ── Composant principal exporté ────────────────────────────────────────────────
export const TabletteMorphBarre: React.FC<TabletteMorphBarreProps> = ({ progress }) => {
  return (
    <svg
      viewBox="0 0 1080 1920"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Groupe 1 : corps morphé tablette → barre */}
      <CorpsMorphe progress={progress} />

      {/* Groupe 2 : sillons/quadrillage qui fondent pendant le morphing */}
      <GrilleSillons progress={progress} />

      {/* Groupe 3 : croix suisse (présente à progress=0, disparait avant 0.4) */}
      <CrossSuisse progress={progress} />

      {/* Groupe 4 : filet de fuite vers la droite (actif après progress=0.6) */}
      <FiletFuite progress={progress} />

      {/* Groupe 5 : labels 6% / 94% (discrets, fin de morph) */}
      <LabelsBarre progress={progress} />
    </svg>
  );
};

// ── Compositions de preview pour Root.tsx ─────────────────────────────────────
// progress=0 : tablette complète + croix suisse
const TabletteMorph0Inner: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#e8dcc0" }}>
    <TabletteMorphBarre progress={0} />
  </AbsoluteFill>
);

// progress=1 : barre 6/94 + filet de fuite
const TabletteMorph1Inner: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#e8dcc0" }}>
    <TabletteMorphBarre progress={1} />
  </AbsoluteFill>
);

export const TabletteMorphPreview0 = TabletteMorph0Inner;
export const TabletteMorphPreview1 = TabletteMorph1Inner;
