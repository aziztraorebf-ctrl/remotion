import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SonjataStoryboardIcon — Style cartoon storybook Sonjata V7
//
// CARACTÉRISTIQUES :
// - Personnages ronds avec grosses têtes (proportions enfant/adulte storybook)
// - Aplats de couleurs (PAS de dégradés réalistes)
// - Lignes au trait foncé qui délimitent les formes
// - Décor village : huttes coniques, baobab stylisé doux, savane plate
// - Palette ocre/terre cuite/brun chaud/vert mousse
// ─────────────────────────────────────────────────────────────────────────────

export interface SonjataStoryboardIconProps {
  position?: { cx: number; cy: number };
}

const C = {
  // Ciel/fond chaud (savane jour finissant)
  sky:           "#e89a4a",          // orange chaud
  skyLow:        "#d4763a",          // orange brûlé bas
  ground:        "#8a4a2a",          // terre rouge sahel
  groundLight:   "#a55a30",
  // Baobab
  baobabTrunk:   "#5a3818",
  baobabBranch:  "#3a2410",
  baobabLeaves:  "#7a5028",
  // Huttes
  hutWall:       "#c47c5a",          // terre cuite habitat
  hutWallDark:   "#9a5a3a",
  hutRoof:       "#7a4818",          // chaume foncé
  hutRoofHi:     "#9a6028",
  // Sonjata (héro central)
  sonjataSkin:   "#7a3818",          // peau brune
  sonjataSkinHi: "#9a4a20",
  sonjataCloth:  "#c8a040",          // habit doré
  sonjataClothDk: "#a07820",
  sonjataDecor:  "#c4302a",          // ceinture/détail rouge
  // Personnages secondaires
  villager1Cloth: "#7a4818",
  villager2Cloth: "#5a3818",
  // Lignes
  outline:       "#2a1810",          // contours foncés
};

export const SonjataStoryboardIcon: React.FC<SonjataStoryboardIconProps> = () => {
  return (
    <svg
      width="100%" height="100%"
      viewBox="0 0 1280 720"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <defs>
        {/* Pas de gradients — palette en aplats */}
      </defs>

      {/* === CIEL/FOND CHAUD === */}
      {/* Bandeau ciel orange chaud */}
      <rect x={0} y={0} width={1280} height={480} fill={C.sky} />

      {/* === SOL TERRE ROUGE === */}
      <rect x={0} y={480} width={1280} height={240} fill={C.ground} />
      {/* Petite ondulation horizon */}
      <path
        d={`M 0 480
            Q 100 478 200 481
            Q 300 484 400 480
            Q 500 477 600 480
            Q 700 483 800 481
            Q 900 478 1000 481
            Q 1100 483 1200 480
            L 1280 480
            L 1280 500
            L 0 500
            Z`}
        fill={C.groundLight}
      />

      {/* === BAOBAB ARRIÈRE-PLAN (LOIN À DROITE) === */}
      <g transform="translate(950 340)">
        {/* Tronc bombé caractéristique */}
        <path
          d={`M -25 140
              L -30 80
              Q -45 30 -35 -20
              Q -25 -60 -15 -70
              L 15 -70
              Q 25 -60 35 -20
              Q 45 30 30 80
              L 25 140
              Z`}
          fill={C.baobabTrunk}
          stroke={C.outline}
          strokeWidth={3}
        />
        {/* Couronne foliaire arrondie (style "brocoli") */}
        <ellipse cx={0} cy={-90} rx={60} ry={35} fill={C.baobabLeaves} stroke={C.outline} strokeWidth={3} />
        <ellipse cx={-35} cy={-95} rx={25} ry={20} fill={C.baobabLeaves} stroke={C.outline} strokeWidth={3} />
        <ellipse cx={35} cy={-95} rx={25} ry={20} fill={C.baobabLeaves} stroke={C.outline} strokeWidth={3} />
        {/* Détails de tronc */}
        <line x1={-10} y1={50} x2={-8} y2={100} stroke={C.outline} strokeWidth={1.5} opacity={0.5} />
        <line x1={10} y1={50} x2={12} y2={100} stroke={C.outline} strokeWidth={1.5} opacity={0.5} />
      </g>

      {/* === HUTTES VILLAGE (ARRIÈRE-PLAN) === */}
      {/* Hutte 1 — droite, à côté du baobab */}
      <g transform="translate(1130 430)">
        {/* Mur conique terre cuite */}
        <path
          d={`M -45 50 L -38 0 L 38 0 L 45 50 Z`}
          fill={C.hutWall}
          stroke={C.outline}
          strokeWidth={3}
        />
        {/* Toit chaume conique */}
        <path
          d={`M -50 0 L 0 -50 L 50 0 Z`}
          fill={C.hutRoof}
          stroke={C.outline}
          strokeWidth={3}
        />
        {/* Détails toit chaume */}
        <line x1={-30} y1={-15} x2={-20} y2={-30} stroke={C.outline} strokeWidth={1.5} />
        <line x1={0} y1={-30} x2={5} y2={-45} stroke={C.outline} strokeWidth={1.5} />
        <line x1={20} y1={-20} x2={30} y2={-10} stroke={C.outline} strokeWidth={1.5} />
        {/* Porte sombre */}
        <rect x={-8} y={20} width={16} height={30} fill={C.outline} />
      </g>

      {/* Hutte 2 — extrême droite */}
      <g transform="translate(1240 440)">
        <path
          d={`M -35 40 L -28 0 L 28 0 L 35 40 Z`}
          fill={C.hutWallDark}
          stroke={C.outline}
          strokeWidth={3}
        />
        <path
          d={`M -40 0 L 0 -40 L 40 0 Z`}
          fill={C.hutRoofHi}
          stroke={C.outline}
          strokeWidth={3}
        />
      </g>

      {/* === PERSONNAGES SECONDAIRES (villageois arrière-plan) === */}

      {/* Villageois 1 — petit, gauche du baobab */}
      <g transform="translate(870 470)">
        {/* Corps */}
        <ellipse cx={0} cy={0} rx={12} ry={18} fill={C.villager1Cloth} stroke={C.outline} strokeWidth={2.5} />
        {/* Tête grosse ronde */}
        <circle cx={0} cy={-25} r={14} fill={C.sonjataSkin} stroke={C.outline} strokeWidth={2.5} />
        {/* Yeux */}
        <circle cx={-4} cy={-26} r={1.5} fill={C.outline} />
        <circle cx={4} cy={-26} r={1.5} fill={C.outline} />
      </g>

      {/* Villageois 2 — encore plus loin, à gauche */}
      <g transform="translate(800 480) scale(0.85)">
        <ellipse cx={0} cy={0} rx={11} ry={16} fill={C.villager2Cloth} stroke={C.outline} strokeWidth={2.5} />
        <circle cx={0} cy={-22} r={12} fill={C.sonjataSkin} stroke={C.outline} strokeWidth={2.5} />
        <circle cx={-3} cy={-23} r={1.3} fill={C.outline} />
        <circle cx={3} cy={-23} r={1.3} fill={C.outline} />
      </g>

      {/* === SONJATA — HÉRO CENTRAL (premier plan, plus grand) === */}
      <g transform="translate(380 500)">
        {/* Jambes (court pagne) */}
        <path
          d={`M -22 30
              L -28 80
              L -10 80
              L -8 30
              Z`}
          fill={C.sonjataSkin}
          stroke={C.outline}
          strokeWidth={3}
        />
        <path
          d={`M 22 30
              L 28 80
              L 10 80
              L 8 30
              Z`}
          fill={C.sonjataSkin}
          stroke={C.outline}
          strokeWidth={3}
        />

        {/* Pagne / habit central doré (élément royal Sonjata) */}
        <path
          d={`M -28 30
              L -32 -20
              Q -35 -50 -30 -80
              L 30 -80
              Q 35 -50 32 -20
              L 28 30
              Z`}
          fill={C.sonjataCloth}
          stroke={C.outline}
          strokeWidth={3}
        />
        {/* Détail ceinture rouge */}
        <rect x={-32} y={20} width={64} height={10} fill={C.sonjataDecor} stroke={C.outline} strokeWidth={2.5} />

        {/* Bras gauche (le long) */}
        <path
          d={`M -32 -50
              L -40 0
              L -38 30
              L -32 30
              L -32 0
              L -25 -50
              Z`}
          fill={C.sonjataSkin}
          stroke={C.outline}
          strokeWidth={3}
        />

        {/* Bras droit replié vers l'avant (porte un objet symbolique : arc-bâton) */}
        <path
          d={`M 32 -50
              L 50 -40
              L 60 -10
              L 55 -8
              L 45 -35
              L 28 -45
              Z`}
          fill={C.sonjataSkin}
          stroke={C.outline}
          strokeWidth={3}
        />

        {/* Tête énorme et ronde caractéristique (proportions storybook) */}
        <circle cx={0} cy={-110} r={32} fill={C.sonjataSkin} stroke={C.outline} strokeWidth={3} />

        {/* Coiffure : petits cheveux courts (style Sonjata jeune) */}
        <path
          d={`M -28 -125
              Q -20 -145 0 -148
              Q 20 -145 28 -125
              Q 25 -135 0 -138
              Q -25 -135 -28 -125 Z`}
          fill={C.outline}
        />

        {/* Yeux fermés/concentrés style cartoon (lignes horizontales) */}
        <path d={`M -12 -110 Q -8 -114 -4 -110`} fill="none" stroke={C.outline} strokeWidth={2.5} strokeLinecap="round" />
        <path d={`M 4 -110 Q 8 -114 12 -110`} fill="none" stroke={C.outline} strokeWidth={2.5} strokeLinecap="round" />

        {/* Nez (petit trait) */}
        <line x1={0} y1={-108} x2={0} y2={-102} stroke={C.outline} strokeWidth={2} strokeLinecap="round" />

        {/* Sourire bienveillant */}
        <path
          d={`M -8 -98 Q 0 -92 8 -98`}
          fill="none"
          stroke={C.outline}
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* BÂTON DE COMMANDEMENT / SCEPTRE tenu dans la main droite (signature Mansa Mandé) */}
        <line
          x1={55}
          y1={-50}
          x2={75}
          y2={-160}
          stroke={C.baobabBranch}
          strokeWidth={5}
          strokeLinecap="round"
        />
        {/* Petit ornement haut du sceptre */}
        <circle cx={75} cy={-160} r={6} fill={C.sonjataCloth} stroke={C.outline} strokeWidth={2} />
      </g>

      {/* === GROUPE DE PETITES JARRES / OBJETS AU SOL (gauche) === */}
      <g transform="translate(150 580)">
        {/* Jarre 1 */}
        <ellipse cx={0} cy={0} rx={18} ry={22} fill={C.hutWall} stroke={C.outline} strokeWidth={2.5} />
        <ellipse cx={0} cy={-22} rx={10} ry={5} fill={C.outline} />
        {/* Jarre 2 plus petite */}
        <g transform="translate(40 10)">
          <ellipse cx={0} cy={0} rx={14} ry={18} fill={C.hutWallDark} stroke={C.outline} strokeWidth={2.5} />
          <ellipse cx={0} cy={-18} rx={8} ry={4} fill={C.outline} />
        </g>
      </g>

      {/* === HERBES SÈCHES STYLISÉES (sol) === */}
      {[200, 280, 480, 560, 670, 730, 880].map((x, i) => (
        <g key={i} transform={`translate(${x} 590)`}>
          <line x1={0} y1={0} x2={-4} y2={-15} stroke={C.outline} strokeWidth={1.5} strokeLinecap="round" />
          <line x1={0} y1={0} x2={0} y2={-18} stroke={C.outline} strokeWidth={1.5} strokeLinecap="round" />
          <line x1={0} y1={0} x2={4} y2={-15} stroke={C.outline} strokeWidth={1.5} strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
};
