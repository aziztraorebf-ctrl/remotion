/**
 * B2Sablier — Beat 2 "L'echec" de la Grande Muraille Verte, scene "LE SABLIER".
 * Registre ENCRE NARRATIVE sur parchemin (grammaire identique au hook GgwHookEncreVivant).
 *
 * Vue de cote : une rangee de 4 arbres plantes en ligne droite face au sable.
 * 3 a gauche meurent et s'enfoncent dans le sol qui s'ouvre (les "poches"/fosses = le sablier),
 * 1 survivant a droite reverdit et s'ancre par des racines laterales.
 * SIGNATURE : a la fin, le sol DECROCHE et s'enfuit sous le survivant (amorce Beat 3 = plongee sous terre).
 *
 * On PART de idee2.svg (groupes lhorizon / le_sol_qui_souvre / les_racines_laterales /
 * les_3_arbres_engloutis / larbre_survivant / le_sable). Retouches Claude-editeur-SVG :
 *   - les 4 arbres reconstruits en composant unique (Tree) parametrable encre/vert/cendre
 *     pour permettre le cross-fade d'opacite (PAS de fill brutal) impose par le SOCLE.
 *   - les 3 morts NAISSENT verts (plantation) puis cross-fadent vers cendre a la mort (~240f).
 *   - le survivant NAIT en encre neutre puis cross-fade vers vert plein a "REVERDIT" (~393f).
 *   - le sol qui s'ouvre = clip-path (rect masque) qui s'elargit vers le bas a la mort -> revele le vide.
 *   - particules de sable qui tombent dans le gouffre, frame-driven.
 *   - decrochage final : le groupe MONDE descend (translateY+) tandis que le survivant reste fixe.
 *
 * CALAGE (frames @30fps, audio narration-beat2.mp3, 571f / 19.04s) :
 *   0   -> 138f : horizon se trace + sol = dalle + 4 arbres "poussent" (scaleY 0->1, spring), verts.
 *   ~240f       : MEURENT -> sol des 3 gauche s'ouvre, ils basculent (rotate 0->15deg) + s'enfoncent
 *                 (translateY+ / scale 0.9->0.6) + grisent (cross-fade vert->cendre) + sable qui tombe.
 *   ~393f       : REVERDIT -> survivant s'impregne de vert (cross-fade encre->vert), spring pop + glow,
 *                 racines laterales se colorent brun et s'ancrent (suction translateY- puis ressort).
 *   450 -> 571f : sol sous le survivant se craquelle (fissures stroke-draw) + le MONDE descend
 *                 (translateY+) alors que le survivant reste fixe = decrochage "le sol s'enfuit sous lui".
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// --- PALETTE (SOCLE, non-negociable) ---
const CREME = "#e8dcc0";
const ENCRE = "#2b2117";
const VERT = "#3e8f34";
const VERT_D = "#295c1c";
const CENDRE_D = "#3a3a3a";
const BRUN = "#5c371f";
const BRUN_TRONC = "#704521";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ----------------------------------------------------------------------------
// Arbre parametrable (tronc + 2 branches + 4 touffes). Dessine a l'origine locale
// (tronc base ~y=1150 dans le repere du SVG source) pour pouvoir le poser via transform.
// `leaf` / `bark` / `stroke` pilotent la couleur ; on superpose 2 versions par opacite.
// ----------------------------------------------------------------------------
type TreePaint = { bark: string; leaf1: string; leaf2: string; leaf3: string; leaf4: string; stroke: string };

const PAINT_VERT: TreePaint = {
  bark: BRUN_TRONC,
  leaf1: VERT,
  leaf2: "#55bb4f",
  leaf3: VERT_D,
  leaf4: "#247b31",
  stroke: ENCRE,
};
const PAINT_CENDRE: TreePaint = {
  bark: "#6e6254",
  leaf1: "#99998d",
  leaf2: "#8b8d80",
  leaf3: "#a6a69a",
  leaf4: "#85877b",
  stroke: CENDRE_D,
};
const PAINT_ENCRE: TreePaint = {
  bark: "#9a8f7c",
  leaf1: "#cdbd9a",
  leaf2: "#cdbd9a",
  leaf3: "#bdac88",
  leaf4: "#bdac88",
  stroke: ENCRE,
};

// petit arbre (les 4 plantes), dessine centre sur x=0, base du tronc a y=0
const SmallTree: React.FC<{ paint: TreePaint }> = ({ paint }) => (
  <g>
    {/* tronc */}
    <path d="M0 0 C-4 -43 -2 -82 6 -126" fill="none" stroke={paint.bark} strokeWidth={18} strokeLinecap="round" />
    {/* branches */}
    <path d="M4 -78 C-24 -100 -44 -120 -62 -151" fill="none" stroke={paint.bark} strokeWidth={5} strokeLinecap="round" />
    <path d="M5 -86 C32 -112 54 -133 77 -166" fill="none" stroke={paint.bark} strokeWidth={5} strokeLinecap="round" />
    {/* touffes */}
    <ellipse cx={-34} cy={-150} rx={38} ry={31} fill={paint.leaf1} stroke={paint.stroke} strokeWidth={3} />
    <ellipse cx={7} cy={-186} rx={45} ry={35} fill={paint.leaf2} stroke={paint.stroke} strokeWidth={3} />
    <ellipse cx={48} cy={-153} rx={39} ry={31} fill={paint.leaf3} stroke={paint.stroke} strokeWidth={3} />
    <ellipse cx={1} cy={-131} rx={48} ry={34} fill={paint.leaf4} stroke={paint.stroke} strokeWidth={3} />
  </g>
);

// grand arbre survivant, dessine centre sur x=0, base du tronc a y=0
const BigTree: React.FC<{ paint: TreePaint }> = ({ paint }) => (
  <g>
    <path d="M0 0 C-5 -78 0 -161 11 -248" fill="none" stroke={paint.bark} strokeWidth={30} strokeLinecap="round" />
    <path d="M7 -146 C-40 -174 -70 -211 -95 -258" fill="none" stroke={paint.bark} strokeWidth={7} strokeLinecap="round" />
    <path d="M10 -162 C55 -194 93 -232 125 -284" fill="none" stroke={paint.bark} strokeWidth={7} strokeLinecap="round" />
    <path d="M7 -196 C-20 -232 -43 -267 -63 -312" fill="none" stroke={paint.bark} strokeWidth={6} strokeLinecap="round" />
    <path d="M11 -206 C49 -240 73 -277 95 -326" fill="none" stroke={paint.bark} strokeWidth={6} strokeLinecap="round" />
    <ellipse cx={-63} cy={-263} rx={65} ry={50} fill={paint.leaf1} stroke={paint.stroke} strokeWidth={4} />
    <ellipse cx={-5} cy={-326} rx={78} ry={58} fill={paint.leaf2} stroke={paint.stroke} strokeWidth={4} />
    <ellipse cx={77} cy={-273} rx={69} ry={52} fill={paint.leaf3} stroke={paint.stroke} strokeWidth={4} />
    <ellipse cx={-13} cy={-211} rx={82} ry={55} fill={paint.leaf4} stroke={paint.stroke} strokeWidth={4} />
    <ellipse cx={63} cy={-190} rx={72} ry={49} fill={paint.leaf2} stroke={paint.stroke} strokeWidth={4} />
    <ellipse cx={20} cy={-271} rx={94} ry={66} fill={paint.leaf1} stroke={paint.stroke} strokeWidth={4} />
  </g>
);

// fosse / poche du sablier (teardrop sombre), dessinee centree x=0, ouverture en haut a y=0
const Pit: React.FC<{ fill: string }> = ({ fill }) => (
  <path
    d="M-62 0 C-100 -36 -28 -42 4 -7 C36 -42 108 -34 70 4 C46 64 14 150 -8 290 C-30 150 -52 64 -62 0 Z"
    fill={fill}
    stroke={ENCRE}
    strokeWidth={5}
    strokeLinejoin="round"
  />
);

// position des 4 arbres + fosses (base de tronc / ouverture de fosse au niveau du sol y~1175)
const DEAD_X = [170, 390, 610];
const GROUND_Y = 1178;
const SURVIVOR_X = 862;

export const B2Sablier: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ===== PHASE 1 : installation 0-138f =====
  // horizon + sol se tracent (dashoffset), arbres poussent.
  const horizonDraw = interpolate(frame, [0, 90], [1, 0], clamp); // 1 = invisible (dashoffset plein)
  const groundDraw = interpolate(frame, [20, 130], [1, 0], clamp);

  // ===== PHASE 2 : MEURENT ~240f =====
  const DEATH = 240;
  // ouverture du sol : un masque rectangulaire grandit vers le bas (revele le vide / la fosse)
  const pitOpen = interpolate(frame, [DEATH - 18, DEATH + 40], [0, 1], clamp);

  // ===== PHASE 3 : REVERDIT ~393f =====
  const REVIVE = 393;
  const greenIn = interpolate(frame, [REVIVE - 6, REVIVE + 40], [0, 1], clamp); // cross-fade encre -> vert
  const revivePop = spring({ frame: frame - REVIVE, fps, config: { mass: 1, damping: 11, stiffness: 130 } });
  const glow = interpolate(frame, [REVIVE, REVIVE + 24, REVIVE + 70], [0, 0.55, 0.28], clamp);
  // racines : suction (translateY- bref) puis ressort -> ancrage
  const rootsDraw = interpolate(frame, [REVIVE - 4, REVIVE + 50], [1, 0], clamp);
  const rootAnchor = spring({ frame: frame - (REVIVE + 4), fps, config: { mass: 1, damping: 9, stiffness: 140 } });

  // ===== PHASE 4 : DECROCHAGE 450-571f =====
  const DROP = 450;
  const crackDraw = interpolate(frame, [DROP, DROP + 60], [1, 0], clamp); // fissures se tracent
  const worldDrop = interpolate(frame, [DROP + 20, 571], [0, 520], { ...clamp, easing: (t) => t * t }); // le monde s'enfuit (accelere)

  // base du tronc du survivant : reste FIXE (decrochage = c'est le sol qui part)
  // donc le survivant n'est PAS dans le groupe "monde".

  return (
    <AbsoluteFill style={{ background: CREME }}>
      <Audio src={staticFile("audio/ggw-muraille-verte/narration-beat2.mp3")} />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        {/* clip qui revele la fosse sous les 3 morts (s'elargit vers le bas) */}
        <defs>
          <clipPath id="pitClip">
            <rect x={60} y={GROUND_Y - 4} width={680} height={pitOpen * 360} />
          </clipPath>
        </defs>

        {/* fond parchemin + cadre epure (identite hook) */}
        <rect width={1080} height={1920} fill={CREME} />
        <rect x={40} y={40} width={1000} height={1840} stroke={ENCRE} strokeWidth={1.5} fill="none" />
        <rect x={50} y={50} width={980} height={1820} stroke={ENCRE} strokeWidth={1} strokeDasharray="4 8" fill="none" />

        {/* ============ GROUPE MONDE (descend au decrochage) ============ */}
        <g id="monde" transform={`translate(0 ${worldDrop})`}>
          {/* horizon (se trace) */}
          <g id="horizon">
            <path
              d="M0 520 C210 505 350 535 530 520 C710 505 850 530 1080 510"
              fill="none"
              stroke={ENCRE}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={1400}
              strokeDashoffset={horizonDraw * 1400}
            />
            <path
              d="M40 642 C210 610 350 690 520 655 C760 606 900 648 1080 616"
              fill="none"
              stroke="#706b5b"
              strokeWidth={1.7}
              strokeDasharray="9 18"
              strokeLinecap="round"
              opacity={(1 - horizonDraw) * 0.75}
            />
          </g>

          {/* vents obliques (encre, discrets) */}
          <g id="vents" opacity={(1 - horizonDraw) * 0.6}>
            <path d="M150 390 l110 36" fill="none" stroke="#7a7464" strokeWidth={3.2} strokeLinecap="round" />
            <path d="M765 360 l92 72" fill="none" stroke="#7a7464" strokeWidth={4} strokeLinecap="round" />
            <path d="M905 612 l118 54" fill="none" stroke="#7a7464" strokeWidth={3.2} strokeLinecap="round" />
          </g>

          {/* ligne de sol = dalle (se trace) */}
          <g id="sol">
            <path
              d="M0 1185 C180 1158 318 1170 478 1179 C650 1189 842 1174 1080 1194"
              fill="none"
              stroke="#211b15"
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={1300}
              strokeDashoffset={groundDraw * 1300}
            />
          </g>

          {/* dunes / sable de fond (encre, monde aride) */}
          <g id="sable" opacity={(1 - groundDraw) * 0.9}>
            <path d="M0 1335 C160 1290 330 1315 506 1338 C700 1364 860 1326 1080 1352" fill="none" stroke="#6f6958" strokeWidth={1.8} strokeDasharray="13 25" strokeLinecap="round" opacity={0.75} />
            <path d="M0 1510 C218 1450 454 1488 650 1520 C826 1550 940 1515 1080 1482" fill="none" stroke={ENCRE} strokeWidth={5} strokeLinecap="round" />
            <path d="M0 1700 C220 1628 472 1620 656 1594 C846 1568 970 1505 1080 1430" fill="none" stroke={ENCRE} strokeWidth={4} strokeLinecap="round" />
          </g>

          {/* ============ LES 3 FOSSES + 3 ARBRES ENGLOUTIS ============ */}
          {DEAD_X.map((cx, i) => {
            // naissance echelonnee (avant-plan gauche d'abord) en phase 1
            const birth = 28 + i * 9;
            const grow = spring({ frame: frame - birth, fps, config: { mass: 1, damping: 13, stiffness: 120 } });
            if (grow < 0.01) return null;
            // mort echelonnee gauche->droite (cascade)
            const di = i * 8;
            const sinkI = interpolate(frame, [DEATH - 12 + di, DEATH + 70 + di], [0, 1], clamp);
            const ashI = interpolate(frame, [DEATH - 10 + di, DEATH + 45 + di], [0, 1], clamp);
            const tilt = sinkI * 15; // bascule 0->15deg
            const drop = sinkI * 150; // s'enfonce
            const depthScale = interpolate(sinkI, [0, 1], [1, 0.6], clamp); // profondeur
            return (
              <g key={cx}>
                {/* la fosse revelee dans le clip qui s'ouvre */}
                <g clipPath="url(#pitClip)">
                  <g transform={`translate(${cx} ${GROUND_Y})`}>
                    <Pit fill="#4b4b46" />
                  </g>
                </g>
                {/* arbre : pousse (phase1) puis bascule + s'enfonce + grise (phase2) */}
                <g
                  transform={`translate(${cx} ${GROUND_Y + drop}) rotate(${tilt}) scale(${grow * depthScale} ${grow * depthScale})`}
                >
                  {/* version verte (plantee, vivante) */}
                  <g opacity={1 - ashI}>
                    <SmallTree paint={PAINT_VERT} />
                  </g>
                  {/* version cendre (morte) en cross-fade */}
                  <g opacity={ashI}>
                    <SmallTree paint={PAINT_CENDRE} />
                  </g>
                </g>
              </g>
            );
          })}

          {/* particules de sable qui tombent dans le gouffre (phase 2) */}
          <g id="sable-chute">
            {Array.from({ length: 22 }).map((_, k) => {
              const px = 90 + (k * 31) % 640;
              const start = DEATH - 4 + (k % 11) * 4;
              const local = frame - start;
              if (local < 0) return null;
              const cycle = 60;
              const t = (local % cycle) / cycle;
              const fy = GROUND_Y + t * (260 + (k % 5) * 30);
              const op = pitOpen * (1 - t) * 0.8;
              if (op <= 0.01) return null;
              return <circle key={k} cx={px + Math.sin(local / 7 + k) * 6} cy={fy} r={2 + (k % 3)} fill="#8a8069" opacity={op} clipPath="url(#pitClip)" />;
            })}
          </g>

          {/* fissures sous le survivant (phase 4) */}
          <g id="fissures" opacity={interpolate(frame, [DROP, DROP + 20], [0, 1], clamp)}>
            <path d="M760 1184 C795 1210 805 1255 792 1300" fill="none" stroke={ENCRE} strokeWidth={3} strokeLinecap="round" strokeDasharray={200} strokeDashoffset={crackDraw * 200} />
            <path d="M960 1188 C996 1215 1010 1262 998 1312" fill="none" stroke={ENCRE} strokeWidth={3} strokeLinecap="round" strokeDasharray={210} strokeDashoffset={crackDraw * 210} />
            <path d="M868 1190 C860 1240 872 1290 860 1340" fill="none" stroke={ENCRE} strokeWidth={2.5} strokeLinecap="round" strokeDasharray={180} strokeDashoffset={crackDraw * 180} />
          </g>
        </g>
        {/* ============ FIN GROUPE MONDE ============ */}

        {/* ============ SURVIVANT (HORS monde : reste fixe au decrochage) ============ */}
        {(() => {
          const birth = 46; // pousse en phase 1 avec les autres
          const grow = spring({ frame: frame - birth, fps, config: { mass: 1, damping: 13, stiffness: 120 } });
          if (grow < 0.01) return null;
          // au decrochage, le tronc se "tient" : leger sursaut vers le haut quand le sol part
          const hold = interpolate(frame, [DROP + 20, DROP + 60], [0, -14], clamp);
          const sway = Math.sin(frame / 22) * 0.8;
          const popScale = 1 + revivePop * 0.04; // petit pop a REVERDIT
          return (
            <g id="survivant" transform={`translate(${SURVIVOR_X} ${GROUND_Y + hold})`}>
              {/* glow vie a REVERDIT */}
              <ellipse cx={10} cy={-250} rx={170} ry={150} fill="#7fd36a" opacity={glow} style={{ filter: "blur(34px)" }} />

              {/* racines laterales : se tracent + s'ancrent (ressort) */}
              <g
                id="racines"
                transform={`translate(0 ${(1 - rootAnchor) * -10})`}
                opacity={interpolate(frame, [REVIVE - 6, REVIVE + 10], [0, 1], clamp)}
              >
                <path d="M-20 14 C-112 -14 -182 -14 -249 12" fill="none" stroke={BRUN} strokeWidth={10} strokeLinecap="round" strokeDasharray={300} strokeDashoffset={rootsDraw * 300} />
                <path d="M-15 14 C74 -16 138 -11 208 23" fill="none" stroke={BRUN} strokeWidth={10} strokeLinecap="round" strokeDasharray={300} strokeDashoffset={rootsDraw * 300} />
                <path d="M-48 24 C-114 45 -158 66 -200 99" fill="none" stroke={BRUN} strokeWidth={5} strokeLinecap="round" strokeDasharray={260} strokeDashoffset={rootsDraw * 260} />
                <path d="M11 24 C74 50 123 78 170 118" fill="none" stroke={BRUN} strokeWidth={5} strokeLinecap="round" strokeDasharray={260} strokeDashoffset={rootsDraw * 260} />
                <path d="M-59 11 C-120 4 -162 12 -210 37" fill="none" stroke={BRUN} strokeWidth={4} strokeLinecap="round" strokeDasharray={230} strokeDashoffset={rootsDraw * 230} />
                <path d="M28 10 C92 5 138 14 194 46" fill="none" stroke={BRUN} strokeWidth={4} strokeLinecap="round" strokeDasharray={230} strokeDashoffset={rootsDraw * 230} />
              </g>

              {/* arbre : encre neutre -> vert plein (cross-fade a REVERDIT) */}
              <g transform={`rotate(${sway}) scale(${grow * popScale})`}>
                <g opacity={1 - greenIn}>
                  <BigTree paint={PAINT_ENCRE} />
                </g>
                <g opacity={greenIn}>
                  <BigTree paint={PAINT_VERT} />
                </g>
              </g>
            </g>
          );
        })()}
      </svg>
    </AbsoluteFill>
  );
};

export default B2Sablier;
