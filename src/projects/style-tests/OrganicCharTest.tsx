import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from "remotion";

// ── Palette gravure ──────────────────────────────────────────────────────────
const PARCHMENT   = "#f0e6c8";
const INK         = "#1a1008";
const INK_MID     = "#3a2510";
const SKIN        = "#c8a070";
const TUNIC       = "#d8c8a8";
const TUNIC_DARK  = "#b8a888";

// ── Interpolation point par point entre deux paths ───────────────────────────
// Chaque path est une liste de nombres [x0,y0, x1,y1, ...] (coordonnées aplaties)
// On interpole lineairement chaque coordonnee, puis on reconstruit le path d
function lerpPoints(a: number[], b: number[], t: number): number[] {
  return a.map((v, i) => v + (b[i] - v) * t);
}

// Reconstructeur : prend un tableau plat de coords et le template de commandes
// Template exemple : "M {0},{1} C {2},{3} {4},{5} {6},{7} ..."
function buildPath(coords: number[], template: string): string {
  let result = template;
  coords.forEach((v, i) => {
    result = result.replace(`{${i}}`, v.toFixed(2));
  });
  return result;
}

// ── Définition des 3 poses (coordonnées normalisées, personnage 200px de haut)
// Origine : pieds = (0, 0). Tout vers le haut (y négatif).
// Toutes les poses ont le MÊME nombre de points dans le MÊME ordre.
//
// Contour complet du personnage en UN SEUL path fermé :
// On trace : pied droit -> jambe droite ext -> hanche droite -> torse droit ->
//   épaule droite -> bras droit ext -> main droite -> bras droit int ->
//   épaule droite int -> cou -> tête (contour complet) -> cou gauche ->
//   épaule gauche -> bras gauche -> main gauche -> bras gauche int ->
//   torse gauche -> hanche gauche -> jambe gauche ext -> pied gauche -> Z

// Template path : 3 courbes de Bezier cubiques par membre majeur
// Format : M + séquence de C (cubic bezier) + Z
// Chaque C = 6 valeurs : cx1,cy1 cx2,cy2 x,y
// On utilise une representation aplatie : [x_start, y_start, ...points...]

// ── POSE 0 : IDLE (debout, légère posture naturelle) ─────────────────────────
// Silhouette complète vue de profil droit
// 200px total : pieds à y=0, tête à y=-200
const IDLE: number[] = [
  // Pied droit (avant) - pointe vers la droite
  18, 0,
  // Jambe avant - montée externe (tibia bombé devant)
  28, -8,   32, -40,  22, -68,
  // Genou avant
  20, -75,  18, -82,  16, -90,
  // Cuisse avant - bombée à l'avant
  14, -100, 16, -118, 14, -130,
  // Hanche droite
  10, -132, 8, -134,  6, -136,
  // Torse droit - léger renflement poitrine
  4,  -140, 6, -155,  8, -168,
  // Épaule droite - tombante naturellement
  10, -172, 16, -176, 22, -174,
  // Bras avant ext - coude légèrement fléchi vers l'arrière
  28, -172, 34, -160, 30, -148,
  // Avant-bras avant
  28, -140, 24, -128, 22, -116,
  // Main avant
  20, -112, 18, -108, 16, -106,
  // Avant-bras int retour
  14, -112, 12, -126, 10, -140,
  // Bras avant int retour vers épaule
  8,  -152, 8, -166,  6, -172,
  // Cou
  4,  -174, 2,  -178, 0, -180,
  // Tête : contour de profil (nez vers la droite)
  // Front
  2,  -188, 8,  -196, 14, -198,
  // Sommet crâne
  20, -200, 28, -200, 30, -196,
  // Arrière crâne
  34, -194, 34, -186, 30, -180,
  // Mâchoire
  26, -176, 20, -172, 16, -170,
  // Menton
  10, -168, 4,  -168, 0, -168,
  // Retour cou gauche
  -4, -170, -6, -174, -8, -178,
  // Épaule gauche
  -10,-174, -16,-170, -20,-166,
  // Bras arrière ext
  -26,-162, -30,-148, -26,-136,
  // Avant-bras arrière
  -24,-128, -20,-116, -18,-108,
  // Main arrière
  -16,-104, -14,-102, -12,-104,
  // Avant-bras arrière retour
  -10,-112, -8, -126, -6, -138,
  // Bras arrière retour
  -4, -150, -2, -162, -2, -168,
  // Torse gauche
  -4, -158, -6, -144, -6, -136,
  // Hanche gauche
  -8, -132, -8, -128, -6, -124,
  // Cuisse arrière ext
  -4, -112, -2, -98,  2, -90,
  // Genou arrière
  4,  -82,  6, -74,   6, -68,
  // Jambe arrière - tibia plus droit
  8,  -56,  10, -30,  6, -8,
  // Pied arrière
  4,  -4,   0,  0,    -4, 2,
];

// ── POSE 1 : PAS GAUCHE (pied gauche en avant, pied droit en arrière) ────────
const STEP_L: number[] = [
  // Pied droit (maintenant arrière, relevé légèrement)
  12, -8,
  // Jambe droite arrière - tendue vers l'arrière
  8,  -18,  4, -48,  6, -78,
  // Genou droit arrière
  8,  -86,  10, -94, 10, -100,
  // Cuisse droite arrière - vers l'arrière
  8,  -108, 4, -122, 0, -132,
  // Hanche droite
  -2, -134, -2,-136, 0, -138,
  // Torse droit - légèrement incliné vers l'avant
  2,  -142, 8, -156, 12, -168,
  // Épaule droite avec bras balancé vers l'avant
  16, -172, 22, -174, 28, -170,
  // Bras droit ext balancé en avant
  34, -166, 40, -152, 36, -140,
  // Avant-bras
  34, -132, 30, -120, 28, -110,
  // Main
  26, -106, 24, -102, 22, -100,
  // Avant-bras retour
  20, -106, 16, -120, 14, -136,
  // Bras int retour
  10, -150, 8,  -164, 6, -170,
  // Cou
  4,  -172, 2,  -176, 0, -178,
  // Tête - légèrement penchée vers l'avant (momentum)
  2,  -186, 10, -194, 16, -196,
  20, -198, 28, -198, 30, -194,
  34, -192, 34, -184, 30, -178,
  26, -174, 20, -170, 16, -168,
  10, -166, 4,  -166, 0, -166,
  // Cou gauche
  -4, -168, -6, -172, -8, -176,
  // Épaule gauche - bras balancé vers l'arrière
  -12,-172, -18,-166, -22,-158,
  // Bras gauche arrière balancé
  -28,-150, -32,-136, -28,-124,
  // Avant-bras gauche
  -26,-116, -22,-104, -20,-96,
  // Main gauche
  -18,-92,  -16,-90,  -14,-92,
  // Retour avant-bras
  -12,-98,  -8, -112, -6, -126,
  // Retour bras
  -4, -140, -2, -154, -2, -166,
  // Torse gauche
  -4, -156, -8, -142, -8, -134,
  // Hanche gauche - cuisse avant en extension
  -6, -130, -2, -126, 2, -122,
  // Cuisse gauche avant - projetée en avant
  6,  -108, 12, -92,  16, -78,
  // Genou gauche
  18, -70,  20, -62,  20, -56,
  // Jambe gauche avant - flexion naturelle au contact
  18, -40,  14, -20,  10, -6,
  // Pied gauche - plat au sol, en avant
  8,  -2,   4,  0,    -2, 0,
];

// ── POSE 2 : PAS DROIT (pied droit en avant) — miroir asymétrique de STEP_L ─
const STEP_R: number[] = [
  // Pied droit maintenant en avant
  14, -4,
  // Jambe droite avant - flexion naturelle
  18, -18, 22, -40, 20, -58,
  // Genou
  20, -66, 20, -74, 18, -80,
  // Cuisse droite avant
  14, -96,  10, -114, 4, -126,
  // Hanche droite
  2,  -130, 0, -133, -2,-136,
  // Torse droit - légèrement vers l'avant
  0,  -140, 6, -154, 10, -166,
  // Épaule droite - bras vers l'arrière
  14, -170, 18, -172, 22, -170,
  // Bras droit ext vers l'arrière
  28, -166, 32, -152, 28, -140,
  // Avant-bras
  26, -132, 22, -120, 20, -110,
  // Main
  18, -106, 16, -102, 14, -100,
  // Avant-bras retour
  12, -106, 8,  -120, 6, -136,
  // Bras retour
  4,  -150, 2,  -164, 2, -170,
  // Cou
  0,  -172, -2, -176, -4,-178,
  // Tête
  -2, -186, 6,  -194, 12, -196,
  18, -198, 26, -198, 28, -194,
  32, -192, 32, -184, 28, -178,
  24, -174, 18, -170, 14, -168,
  8,  -166, 2,  -166, -2,-166,
  // Cou gauche
  -6, -168, -8, -172, -10,-176,
  // Épaule gauche - bras balancé vers l'avant
  -14,-172, -20,-168, -26,-162,
  // Bras gauche avant
  -32,-156, -38,-142, -34,-130,
  // Avant-bras
  -32,-122, -28,-110, -26,-102,
  // Main
  -24,-98,  -22,-94,  -20,-96,
  // Retour
  -18,-102, -14,-116, -12,-130,
  // Bras retour
  -8, -144, -4, -158, -4,-168,
  // Torse gauche
  -6, -158, -8, -142, -8,-132,
  // Hanche gauche - cuisse arrière
  -6, -128, -4, -124, -2,-120,
  // Cuisse gauche arrière
  2,  -106, 6,  -88,  8, -74,
  // Genou
  10, -66,  12, -58,  12, -52,
  // Jambe gauche tendue vers l'arrière
  10, -36,  6,  -16,  4, -4,
  // Pied gauche arrière
  2,  0,    -2, 2,    -6, 2,
];

// ── Template du path (même structure pour les 3 poses) ───────────────────────
// Chaque groupe de 3 paires = 1 courbe cubique C cx1,cy1 cx2,cy2 x,y
// 34 points x 2 coords = 68 valeurs dans chaque pose
// Le path final : M {0},{1} C {2},{3} {4},{5} {6},{7} C ... Z
function buildPersonPath(pts: number[]): string {
  // pts[0],pts[1] = point de départ M
  // Ensuite groupes de 6 = courbe C
  let d = `M ${pts[0].toFixed(1)},${pts[1].toFixed(1)}`;
  for (let i = 2; i < pts.length; i += 6) {
    if (i + 5 < pts.length) {
      d += ` C ${pts[i].toFixed(1)},${pts[i+1].toFixed(1)} ${pts[i+2].toFixed(1)},${pts[i+3].toFixed(1)} ${pts[i+4].toFixed(1)},${pts[i+5].toFixed(1)}`;
    }
  }
  d += " Z";
  return d;
}

// ── Interpolation walk cycle ─────────────────────────────────────────────────
// Cycle : IDLE -> STEP_L -> IDLE -> STEP_R -> IDLE -> ...
// Période = 24 frames (0.8s à 30fps) = foulée naturelle
function getWalkPose(frame: number): number[] {
  const period = 24;
  const t = (frame % period) / period; // 0..1

  if (t < 0.25) {
    // IDLE -> STEP_L
    const u = t / 0.25;
    return lerpPoints(IDLE, STEP_L, smoothstep(u));
  } else if (t < 0.5) {
    // STEP_L -> IDLE
    const u = (t - 0.25) / 0.25;
    return lerpPoints(STEP_L, IDLE, smoothstep(u));
  } else if (t < 0.75) {
    // IDLE -> STEP_R
    const u = (t - 0.5) / 0.25;
    return lerpPoints(IDLE, STEP_R, smoothstep(u));
  } else {
    // STEP_R -> IDLE
    const u = (t - 0.75) / 0.25;
    return lerpPoints(STEP_R, IDLE, smoothstep(u));
  }
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

// ── Personnage : contour + ombres hachurées internes ─────────────────────────
interface OrganicCharProps {
  x: number;
  groundY: number;
  frame: number;
  scale?: number;
  facingRight?: boolean;
}

const OrganicChar: React.FC<OrganicCharProps> = ({
  x, groundY, frame, scale = 1, facingRight = true,
}) => {
  const pts = getWalkPose(frame);
  const scaledPts = pts.map((v, i) => {
    // x coords (pairs) : appliquer scale
    // y coords (impairs) : appliquer scale (déjà négatifs)
    return v * scale;
  });

  const silhouette = buildPersonPath(scaledPts);

  // Bob vertical naturel
  const period = 24;
  const t = (frame % period) / period;
  const bob = Math.sin(t * Math.PI * 2) * 2 * scale;

  // Zone d'ombre : même path mais clippé sur la moitié gauche
  // On utilise un rect clip simple
  const charH = 200 * scale;
  const charW = 80 * scale;
  const uid = `oc-${Math.round(x)}`;

  // Visage de profil (séparé, par-dessus le contour)
  // Position tête calculée depuis les pts de la pose courante
  // La tête est autour de l'index 13-20 dans les points (y entre -168 et -200)
  const headCY = -184 * scale + bob;
  const headRX = 18 * scale;
  const headRY = 16 * scale;
  const faceX  = 14 * scale;  // centre face légèrement vers la droite (profil)

  // Nez
  const noseX1 = faceX + headRX * 0.55;
  const noseY1 = headCY + headRY * 0.1;
  const noseX2 = faceX + headRX * 0.82;
  const noseY2 = headCY + headRY * 0.35;

  // Oeil
  const eyeX = faceX + headRX * 0.3;
  const eyeY = headCY - headRY * 0.1;

  // Bouche
  const mouthX1 = faceX + headRX * 0.48;
  const mouthX2 = faceX + headRX * 0.26;
  const mouthY  = headCY + headRY * 0.42;

  return (
    <g transform={`translate(${x}, ${groundY + bob}) scale(${facingRight ? 1 : -1}, 1)`}>

      {/* Ombre sol */}
      <ellipse cx={0} cy={2 * scale} rx={28 * scale} ry={6 * scale}
        fill={INK} opacity="0.15" />

      {/* ── Clip pour zone d'ombre ── */}
      <defs>
        <clipPath id={uid}>
          <path d={silhouette} />
        </clipPath>
      </defs>

      {/* Remplissage peau / tunique (fond) */}
      <path d={silhouette} fill={TUNIC} stroke="none" />

      {/* Zone d'ombre gauche — rect clippé sur la silhouette */}
      <rect
        x={-60 * scale} y={-205 * scale}
        width={45 * scale} height={210 * scale}
        fill="url(#hatch-45)"
        opacity={0.38}
        clipPath={`url(#${uid})`}
      />

      {/* Contour encre — le trait principal */}
      <path d={silhouette} fill="none" stroke={INK} strokeWidth={2 * scale}
        strokeLinejoin="round" strokeLinecap="round" />

      {/* ── Plis du vêtement — quelques traits dans la silhouette ── */}
      {/* Plis torse */}
      <line
        x1={2 * scale}  y1={-136 * scale}
        x2={0 * scale}  y2={-168 * scale}
        stroke={INK_MID} strokeWidth={0.9 * scale} opacity="0.4"
        clipPath={`url(#${uid})`}
      />
      <line
        x1={8 * scale}  y1={-134 * scale}
        x2={6 * scale}  y2={-164 * scale}
        stroke={INK_MID} strokeWidth={0.8 * scale} opacity="0.3"
        clipPath={`url(#${uid})`}
      />
      {/* Pli genou */}
      <line
        x1={14 * scale} y1={-80 * scale}
        x2={18 * scale} y2={-72 * scale}
        stroke={INK_MID} strokeWidth={0.9 * scale} opacity="0.35"
        clipPath={`url(#${uid})`}
      />

      {/* ── Ceinture ── */}
      <ellipse cx={3 * scale} cy={-132 * scale} rx={10 * scale} ry={3 * scale}
        fill={INK_MID} opacity="0.6"
        clipPath={`url(#${uid})`}
      />

      {/* ── Visage de profil ── */}
      {/* Nez */}
      <path
        d={`M ${noseX1},${noseY1} L ${noseX2},${noseY2} Q ${noseX2 - 4 * scale},${noseY2 + 5 * scale} ${faceX + headRX * 0.5},${noseY2 + 4 * scale}`}
        stroke={INK} strokeWidth={1.6 * scale} fill={SKIN} strokeLinejoin="round"
      />
      {/* Oeil */}
      <ellipse cx={eyeX} cy={eyeY} rx={4 * scale} ry={3 * scale}
        fill={INK} />
      <ellipse cx={eyeX + scale * 0.8} cy={eyeY - scale * 0.4} rx={scale} ry={scale * 0.8}
        fill={TUNIC} opacity="0.5" />
      {/* Sourcil */}
      <path
        d={`M ${faceX + headRX * 0.12},${eyeY - 6 * scale} Q ${faceX + headRX * 0.3},${eyeY - 9 * scale} ${faceX + headRX * 0.52},${eyeY - 6 * scale}`}
        stroke={INK} strokeWidth={1.6 * scale} fill="none" strokeLinecap="round"
      />
      {/* Bouche */}
      <path
        d={`M ${mouthX1},${mouthY} Q ${(mouthX1 + mouthX2) / 2},${mouthY + 4 * scale} ${mouthX2},${mouthY}`}
        stroke={INK} strokeWidth={1.4 * scale} fill="none" strokeLinecap="round"
      />

      {/* ── Chapeau / bonnet ── */}
      <path
        d={`M ${faceX - headRX * 0.8},${headCY - headRY * 0.6}
            Q ${faceX - headRX * 0.2},${headCY - headRY * 1.6} ${faceX + headRX * 0.6},${headCY - headRY * 1.2}
            Q ${faceX + headRX * 0.8},${headCY - headRY * 0.5} ${faceX + headRX * 0.55},${headCY - headRY * 0.2}
            L ${faceX - headRX * 0.8},${headCY - headRY * 0.6} Z`}
        fill={INK_MID} stroke={INK} strokeWidth={1.5 * scale}
      />
      {/* Hachures chapeau */}
      <path
        d={`M ${faceX - headRX * 0.8},${headCY - headRY * 0.6}
            Q ${faceX - headRX * 0.2},${headCY - headRY * 1.6} ${faceX + headRX * 0.6},${headCY - headRY * 1.2}
            Q ${faceX + headRX * 0.8},${headCY - headRY * 0.5} ${faceX + headRX * 0.55},${headCY - headRY * 0.2}
            L ${faceX - headRX * 0.8},${headCY - headRY * 0.6} Z`}
        fill="url(#hatch-v)" opacity={0.35}
      />

    </g>
  );
};

// ── Scene test ───────────────────────────────────────────────────────────────
export const OrganicCharTest: React.FC = () => {
  const frame = useCurrentFrame();
  const groundY = 780;

  return (
    <AbsoluteFill style={{ background: PARCHMENT }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">

        <defs>
          <filter id="parchment-age">
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" seed="5" result="n" />
            <feColorMatrix type="matrix"
              values="0 0 0 0 0.88  0 0 0 0 0.78  0 0 0 0 0.58  0 0 0 0.12 0"
              result="t" />
            <feComposite in="t" in2="SourceGraphic" operator="over" />
          </filter>
          <pattern id="hatch-45" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={INK} strokeWidth="0.9" opacity="0.45" />
          </pattern>
          <pattern id="hatch-v" patternUnits="userSpaceOnUse" width="5" height="5">
            <line x1="0" y1="0" x2="0" y2="5" stroke={INK} strokeWidth="0.8" opacity="0.4" />
          </pattern>
        </defs>

        {/* Fond parchemin */}
        <rect width="1920" height="1080" fill={PARCHMENT} filter="url(#parchment-age)" />

        {/* Sol */}
        <rect x={0} y={groundY} width={1920} height={4} fill={INK} opacity="0.4" />
        <rect x={0} y={groundY + 4} width={1920} height={100} fill={TUNIC_DARK} opacity="0.15" />

        {/* Ligne de base */}
        <line x1={100} y1={groundY} x2={1820} y2={groundY} stroke={INK} strokeWidth="2" opacity="0.35" />

        {/* ── Personnage central (grande taille) ── */}
        <OrganicChar x={760} groundY={groundY} frame={frame} scale={2} facingRight />

        {/* ── Même personnage côté droit (taille normale) ── */}
        <OrganicChar x={1200} groundY={groundY} frame={frame + 6} scale={1.4} facingRight />

        {/* ── De dos (flip) ── */}
        <OrganicChar x={1450} groundY={groundY} frame={frame + 12} scale={1.2} facingRight={false} />

        {/* Label */}
        <text x={960} y={60} textAnchor="middle" fontSize="22"
          fontFamily="serif" fill={INK} letterSpacing="4" opacity="0.7">
          PERSONNAGE FULL-PATH — POSES INTERPOLÉES
        </text>
        <text x={960} y={88} textAnchor="middle" fontSize="14"
          fontFamily="serif" fill={INK_MID} fontStyle="italic" opacity="0.5">
          Silhouette unique · Morphing entre 3 poses · Zéro segments séparés
        </text>

        {/* Cadre */}
        <rect x={20} y={20} width={1880} height={1040} fill="none" stroke={INK} strokeWidth="2" opacity="0.3" />
      </svg>
    </AbsoluteFill>
  );
};
