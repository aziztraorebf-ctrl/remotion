/**
 * B2MecheEteinte — Beat 2 "L'echec" de la Grande Muraille Verte, scene "LA MECHE ETEINTE".
 * Registre ENCRE NARRATIVE sur parchemin (meme grammaire que GgwHookEncreVivant : spring pop,
 * se-dessine stroke-dashoffset, colorisation par CROSS-FADE d'opacite encre<->couleur).
 *
 * SVG source = idee3.svg (diagonale-meche bas-gauche -> haut-droite faite d'arbres ; feu GRIS de
 * fumee ; arbres calcines en croix en bas ; 1 survivant vert explosif tout en haut ; soleil hachure).
 * Retouches Claude-editeur-SVG : la ligne-meche est conservee (3 traits superposes du source) ; les
 * arbres ne sont plus statiques mais GENERES le long de la courbe-meche (11 arbres) pour pouvoir les
 * animer un a un (naissance, verdissement, puis CONSUMATION sequentielle) ; le survivant est l'arbre
 * du sommet, repris de #larbre_survivant_vert et anime (explosion + spores). Soleil & decor d'encre.
 *
 * TIMING (571f @30fps = 19.04s, cale sur narration-beat2) :
 *   GROUPE                 | frames        | geste
 *   -----------------------|---------------|------------------------------------------------------
 *   fond + cadre + decor   | 0..end        | parchemin, dunes/vents d'encre permanents
 *   ligne-meche (trace)    | 0 -> 30       | stroke-dashoffset bas-gauche -> haut-droite
 *   soleil (hachure)       | 0 -> 40       | apparait en fondu, hachures qui respirent (encre/gris)
 *   arbres (naissance)     | 26 -> ~138    | s'allument un a un du BAS vers le HAUT, fill vert inonde
 *   feu gris (depart)      | ~200          | volute basale d'anticipation (avant le mot)
 *   CONSUMATION sequentielle| 210 -> ~315  | la mort grise REMONTE la meche, ~10.5f/arbre (cf burn[])
 *                          |               | chaque arbre : volute grise + vert->cendre + scale1->0.8
 *                          |               | + recroqueville -> croix calcinee + cendres montantes
 *   survivant (sommet)     | 393 -> ~430   | EXPLOSE en vert (spring 0.4->1.5->1.2) + glow + spores
 *   verdict / descente     | 450 -> 571    | glow du survivant pulse plus bas, volutes residuelles,
 *                          |               | le groupe-monde amorce une DESCENTE (translateY+) -> B3
 *
 * SIGNATURE soignee = la PROPAGATION SEQUENTIELLE de la mort grise qui remonte la meche, arbre par
 * arbre, visible montant (chaque arbre meurt ~10.5f apres le precedent, du bas vers le haut).
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";

/* ---- PALETTE (SOCLE, NON-NEGOCIABLE) ---- */
const CREME = "#e8dcc0";
const ENCRE = "#2b2117";
const VERT = "#3e8f34";
const VERT_D = "#295c1c";
const VERT_VIF = "#37c94a";
const CENDRE = "#6b6b6b";
const CENDRE_D = "#3a3a3a";
const FUMEE = "#9d9b91";
// (pas d'or : soleil de plomb en encre/gris — registre mort, pas d'embrasement)

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/* La COURBE-MECHE (reprise de #la_ligne_meche du source, bas-gauche -> haut-droite). */
const MECHE_D =
  "M112 1648 C230 1530 330 1395 448 1192 C575 975 705 740 915 406";

/* 11 arbres places le long de la meche, du BAS (index 0) au HAUT (index 10 = survivant).
 * Positions echantillonnees a la main le long de MECHE_D (x,y) + taille selon la profondeur
 * (bas = avant-plan = gros ; haut = lointain = plus petit, sauf le survivant qui explose). */
type TreePos = { x: number; y: number; s: number };
const TREES: TreePos[] = [
  { x: 150, y: 1600, s: 1.0 }, // 0 bas-gauche (avant-plan)
  { x: 200, y: 1530, s: 0.95 },
  { x: 255, y: 1452, s: 0.9 },
  { x: 312, y: 1372, s: 0.86 },
  { x: 372, y: 1284, s: 0.82 },
  { x: 432, y: 1190, s: 0.78 },
  { x: 500, y: 1078, s: 0.74 },
  { x: 568, y: 962, s: 0.7 },
  { x: 640, y: 838, s: 0.66 },
  { x: 728, y: 690, s: 0.62 },
  { x: 905, y: 432, s: 1.0 }, // 10 = SURVIVANT au sommet (gros, explose)
];
const LAST = TREES.length - 1;

/* Calage de la consumation : chaque arbre (sauf le survivant) prend feu a burnStart[i].
 * Demarre a 210f (mot "MEURENT"), ~10.5f d'intervalle => le 10e arbre meurt vers ~305f. */
const BURN0 = 210;
const BURN_STEP = 10.5;
const burnStart = (i: number) => BURN0 + i * BURN_STEP;

/* ---- ARBRE VIVANT (vert) : tronc + houppier en cercles etages (style source survivant, simplifie) ---- */
const LivingTree: React.FC = () => (
  <g>
    {/* tronc */}
    <path
      d="M0 6 C-1 -10 1 -26 0 -44"
      fill="none"
      stroke="#7b4b27"
      strokeWidth={9}
      strokeLinecap="round"
    />
    {/* branches courtes */}
    <path
      d="M0 -30 C-16 -40 -28 -50 -40 -66 M0 -30 C16 -40 28 -52 41 -68"
      fill="none"
      stroke="#6b4125"
      strokeWidth={4}
      strokeLinecap="round"
    />
    {/* houppier (cercles etages, verts) */}
    <circle cx={0} cy={-78} r={30} fill={VERT_VIF} stroke={VERT_D} strokeWidth={2.4} />
    <circle cx={-26} cy={-66} r={23} fill={VERT} stroke={VERT_D} strokeWidth={2.2} />
    <circle cx={27} cy={-66} r={24} fill="#45d154" stroke={VERT_D} strokeWidth={2.2} />
    <circle cx={-12} cy={-96} r={18} fill="#5be461" stroke={VERT_D} strokeWidth={1.8} />
    <circle cx={14} cy={-94} r={17} fill="#56df61" stroke={VERT_D} strokeWidth={1.8} />
    {/* nervures */}
    <path
      d="M-16 -74 C-4 -66 8 -68 18 -78"
      fill="none"
      stroke="#1f6f2d"
      strokeWidth={2}
      strokeLinecap="round"
      opacity={0.7}
    />
  </g>
);

/* ---- ARBRE CALCINE (croix / piquet mort, nuances cendre) ---- */
const DeadTree: React.FC = () => (
  <g>
    {/* ombre au sol */}
    <ellipse cx={0} cy={8} rx={42} ry={11} fill="#8a8572" opacity={0.32} />
    {/* tronc nu, legerement penche */}
    <path
      d="M0 8 C2 -16 -2 -40 1 -62"
      fill="none"
      stroke={CENDRE_D}
      strokeWidth={9}
      strokeLinecap="round"
    />
    {/* branches nues en croix (squelette) */}
    <path
      d="M0 -34 C-22 -44 -38 -56 -54 -72 M1 -36 C24 -46 40 -60 56 -78 M0 -16 C-20 -10 -36 -2 -52 8 M1 -18 C22 -12 38 -4 54 6"
      fill="none"
      stroke={CENDRE_D}
      strokeWidth={4.5}
      strokeLinecap="round"
    />
    {/* moignons de cendre froide */}
    <circle cx={-46} cy={-66} r={9} fill={CENDRE} opacity={0.55} />
    <circle cx={48} cy={-70} r={8} fill={CENDRE_D} opacity={0.55} />
  </g>
);

/* ---- VOLUTE DE FUMEE GRISE (geste de mort, PAS de flammes) ---- */
const SmokePlume: React.FC<{ rise: number; spread: number; opacity: number }> = ({
  rise,
  spread,
  opacity,
}) => (
  <g opacity={opacity} transform={`translate(0 ${-rise}) scale(${spread})`}>
    {/* corps de fumee (lobes) */}
    <path
      d="M0 30 C-26 5 -8 -22 -22 -55 C18 -32 22 0 12 28 C40 -8 56 -42 38 -78 C72 -38 64 18 30 56 C8 44 -16 48 0 30Z"
      fill={FUMEE}
      opacity={0.6}
      stroke={CENDRE_D}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    {/* filaments montants */}
    <path
      d="M-6 28 C-22 -2 -6 -34 -18 -70 M14 22 C30 -10 22 -44 8 -78 M0 36 C-12 10 -2 -18 -2 -48"
      fill="none"
      stroke={CENDRE}
      strokeWidth={2.4}
      strokeLinecap="round"
      opacity={0.5}
    />
  </g>
);

export const B2MecheEteinte: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* --- TRACE DE LA MECHE (bas-gauche -> haut-droite, f0..30) --- */
  const MECHE_LEN = 2300; // longueur approx de la courbe (>= reelle) pour dashoffset
  const mecheDraw = interpolate(frame, [0, 30], [MECHE_LEN, 0], clamp);

  /* --- SOLEIL : apparition en fondu (encre/gris, registre mort) --- */
  const sunIn = interpolate(frame, [0, 40], [0, 1], clamp);
  const sunBreath = 0.6 + 0.12 * Math.sin(frame / 14);

  /* --- DESCENTE DU MONDE (verdict, 450 -> 571 : on plonge vers les croix du bas, tend vers B3) --- */
  const worldDescend = interpolate(frame, [450, 571], [0, 140], clamp);

  return (
    <AbsoluteFill style={{ background: CREME }}>
      <Audio src={staticFile("audio/ggw-muraille-verte/narration-beat2.mp3")} />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        {/* fond parchemin + cadre epure (identique grammaire hook) */}
        <rect width={1080} height={1920} fill={CREME} />
        <rect x={40} y={40} width={1000} height={1840} stroke={ENCRE} strokeWidth={1.5} fill="none" />
        <rect
          x={50}
          y={50}
          width={980}
          height={1820}
          stroke={ENCRE}
          strokeWidth={1}
          strokeDasharray="4 8"
          fill="none"
        />

        {/* === GROUPE MONDE (descend a la fin) === */}
        <g id="monde" transform={`translate(0 ${worldDescend})`}>
          {/* --- DECOR D'ENCRE (dunes / horizon / vents, permanent) --- */}
          <g id="decor" opacity={0.92}>
            <path
              d="M-40 520 C200 500 360 540 560 525 C760 508 900 535 1120 508"
              fill="none"
              stroke={ENCRE}
              strokeWidth={2.3}
              strokeLinecap="round"
            />
            <path
              d="M-60 760 C150 720 310 820 470 875 C650 940 800 965 1130 910"
              fill="none"
              stroke={ENCRE}
              strokeWidth={4.2}
              strokeLinecap="round"
            />
            <path
              d="M-60 1245 C130 1185 325 1225 520 1265 C750 1310 915 1340 1130 1265"
              fill="none"
              stroke={ENCRE}
              strokeWidth={2.1}
              strokeLinecap="round"
              strokeDasharray="34 42"
              opacity={0.75}
            />
            <path
              d="M-60 1570 C150 1480 375 1515 590 1490 C795 1468 925 1355 1130 1205"
              fill="none"
              stroke={ENCRE}
              strokeWidth={5.2}
              strokeLinecap="round"
            />
            <path
              d="M-20 1085 C165 1125 345 1120 520 1082 C680 1045 870 990 1115 1065"
              fill="none"
              stroke={ENCRE}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeDasharray="15 34"
              opacity={0.6}
            />
            <path
              d="M760 610 C860 725 930 786 1110 835"
              fill="none"
              stroke={ENCRE}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.7}
            />
          </g>

          {/* --- SOLEIL (hachure, encre/gris : ciel de plomb, pas d'embrasement) --- */}
          <g id="soleil" opacity={sunIn}>
            <circle cx={535} cy={275} r={162} fill="none" stroke="#2a241d" strokeWidth={5} />
            <circle
              cx={535}
              cy={275}
              r={204}
              fill="none"
              stroke="#615948"
              strokeWidth={2}
              strokeDasharray="14 23"
              opacity={0.85}
            />
            <circle
              cx={535}
              cy={275}
              r={260}
              fill="none"
              stroke="#9b9178"
              strokeWidth={1.2}
              strokeDasharray="2 18"
              opacity={0.45}
            />
            <g opacity={sunBreath}>
              <path
                d="M535 60 L535 95 M355 100 L388 156 M715 98 L683 156 M230 205 L288 238 M845 204 L788 238 M178 318 L240 318 M894 318 L832 318 M355 472 L388 415 M715 472 L683 415 M535 510 L535 450"
                fill="none"
                stroke="#8a8170"
                strokeWidth={3}
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* --- LIGNE-MECHE (se trace, puis reste comme le sentier des arbres) --- */}
          <g id="ligne_meche">
            {/* halo doux */}
            <path
              d={MECHE_D}
              fill="none"
              stroke="#6b6253"
              strokeWidth={18}
              strokeLinecap="round"
              opacity={0.2 * interpolate(frame, [0, 30], [0, 1], clamp)}
            />
            {/* trait d'encre principal, se-dessine */}
            <path
              d={MECHE_D}
              fill="none"
              stroke={ENCRE}
              strokeWidth={6.5}
              strokeLinecap="round"
              strokeDasharray={MECHE_LEN}
              strokeDashoffset={mecheDraw}
            />
            {/* pointilles clairs (texture meche) */}
            <path
              d={MECHE_D}
              fill="none"
              stroke="#d8cfb5"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeDasharray="2 18"
              opacity={0.7 * interpolate(frame, [10, 40], [0, 1], clamp)}
            />
          </g>

          {/* --- LES ARBRES (naissent un a un du BAS vers le HAUT, puis consumes sequentiellement) --- */}
          <g id="arbres">
            {TREES.map((t, i) => {
              const isSurvivor = i === LAST;

              /* Naissance echelonnee bas->haut pendant l'installation */
              const birth = 28 + i * 9;
              const pop = spring({
                frame: frame - birth,
                fps,
                config: { mass: 1, damping: 13, stiffness: 120 },
              });
              if (pop < 0.01) return null;
              const greenIn = interpolate(frame, [birth + 4, birth + 22], [0, 1], clamp);
              const sway = Math.sin((frame - birth) / 18 + t.x) * 1.4;

              /* ====================== SURVIVANT (sommet) ====================== */
              if (isSurvivor) {
                // explose en vert a 393f (spring 0.4 -> ~1.5 -> 1.2)
                const exp = spring({
                  frame: frame - 393,
                  fps,
                  config: { mass: 0.8, damping: 9, stiffness: 150 },
                });
                const burst = interpolate(exp, [0, 0.6, 1], [0.4, 1.5, 1.2], clamp);
                // avant l'explosion : taille de croisiere normale ; l'explosion s'ajoute
                const preScale = pop; // 0->1 a la naissance
                const scaleNow = frame < 393 ? preScale : burst;
                // glow vert : intense a l'explosion, puis pulse plus BAS (verdict 450+)
                const glowPeak = interpolate(frame, [393, 420], [0, 1], clamp);
                const glowSettle = interpolate(frame, [450, 571], [1, 0.45], clamp);
                const glowPulse = 0.85 + 0.15 * Math.sin(frame / 8);
                const glow = glowPeak * glowSettle * glowPulse;
                // spores radiales jaillissant a l'explosion
                const sporeT = interpolate(frame, [393, 440], [0, 1], clamp);
                const sporeOp = interpolate(frame, [400, 470], [0.9, 0], clamp);

                return (
                  <g key={`tree-${i}`} transform={`translate(${t.x} ${t.y})`}>
                    {/* glow vert */}
                    <circle
                      cx={0}
                      cy={-78 * t.s}
                      r={120 * t.s}
                      fill={VERT_VIF}
                      opacity={glow * 0.45}
                      style={{ filter: "blur(30px)" }}
                    />
                    {/* spores radiales */}
                    {sporeT > 0 &&
                      Array.from({ length: 14 }).map((_, k) => {
                        const a = (k / 14) * Math.PI * 2;
                        const rad = 60 + sporeT * 130;
                        const cx = Math.cos(a) * rad;
                        const cy = -78 * t.s + Math.sin(a) * rad;
                        return (
                          <circle
                            key={k}
                            cx={cx}
                            cy={cy}
                            r={4 + (1 - sporeT) * 5}
                            fill={k % 2 ? VERT_VIF : "#5be461"}
                            opacity={sporeOp}
                          />
                        );
                      })}
                    {/* l'arbre vivant (toujours vert : il resiste) */}
                    <g transform={`rotate(${sway}) scale(${t.s * scaleNow})`}>
                      {/* fondu encre->vert a la naissance */}
                      <g opacity={1 - greenIn}>
                        <LivingTree />
                      </g>
                      <g opacity={greenIn}>
                        <LivingTree />
                      </g>
                    </g>
                  </g>
                );
              }

              /* ====================== ARBRES MORTELS (consumes) ====================== */
              const bStart = burnStart(i);
              // progression de la consumation 0->1 sur ~18f
              const burn = interpolate(frame, [bStart, bStart + 18], [0, 1], clamp);
              // cross-fade vert -> cendre ; recroquevillement scale 1 -> 0.8
              const ashIn = burn; // opacite version morte
              const shrink = interpolate(burn, [0, 1], [1, 0.8], clamp);
              const droopY = interpolate(burn, [0, 1], [0, 10], clamp); // s'affaisse un peu
              // volute grise : monte et grossit pendant la consumation, puis residuelle
              const plumeRise = interpolate(frame, [bStart, bStart + 40], [0, 70], clamp);
              const plumeSpread = interpolate(frame, [bStart, bStart + 20], [0.3, 1.1], clamp);
              const plumeOp =
                interpolate(frame, [bStart - 4, bStart + 10], [0, 0.85], clamp) *
                interpolate(frame, [bStart + 40, 571], [1, 0.25], clamp);
              // cendres qui s'echappent vers le haut
              const ashFly = interpolate(frame, [bStart, bStart + 60], [0, 1], clamp);

              return (
                <g key={`tree-${i}`} transform={`translate(${t.x} ${t.y + droopY})`}>
                  {/* arbre : vivant (fond) cross-fade vers calcine (dessus) */}
                  <g transform={`rotate(${sway}) scale(${t.s * pop * shrink})`}>
                    <g opacity={(1 - greenIn) * (1 - ashIn)}>
                      {/* version encre/brune a la toute naissance (avant verdissement) */}
                      <g opacity={0.9}>
                        <DeadTree />
                      </g>
                    </g>
                    <g opacity={greenIn * (1 - ashIn)}>
                      <LivingTree />
                    </g>
                    <g opacity={ashIn}>
                      <DeadTree />
                    </g>
                  </g>

                  {/* VOLUTE DE FUMEE GRISE qui engloutit l'arbre */}
                  {plumeOp > 0.01 && (
                    <g transform={`scale(${t.s})`}>
                      <SmokePlume rise={plumeRise} spread={plumeSpread} opacity={plumeOp} />
                    </g>
                  )}

                  {/* cendres qui montent */}
                  {ashFly > 0 &&
                    Array.from({ length: 4 }).map((_, k) => {
                      const fx = (k - 1.5) * 16;
                      const fy = -40 - ashFly * (90 + k * 25);
                      const fop = interpolate(ashFly, [0, 0.5, 1], [0, 0.6, 0], clamp);
                      return (
                        <circle
                          key={k}
                          cx={fx}
                          cy={fy}
                          r={3 - k * 0.4}
                          fill={CENDRE}
                          opacity={fop}
                        />
                      );
                    })}
                </g>
              );
            })}
          </g>

          {/* --- FEU GRIS BASAL (anticipation a ~200f, au pied de la meche) --- */}
          <g id="feu_gris_basal">
            {(() => {
              const baseOp =
                interpolate(frame, [196, 215], [0, 0.7], clamp) *
                interpolate(frame, [300, 571], [1, 0.3], clamp);
              const baseRise = interpolate(frame, [196, 260], [0, 60], clamp);
              const baseSpread = interpolate(frame, [196, 230], [0.4, 1.3], clamp);
              if (baseOp <= 0.01) return null;
              return (
                <g transform={`translate(150 1600)`}>
                  <ellipse cx={0} cy={10} rx={70} ry={18} fill={CENDRE} opacity={baseOp * 0.4} />
                  <SmokePlume rise={baseRise} spread={baseSpread} opacity={baseOp} />
                </g>
              );
            })()}
          </g>
        </g>
        {/* === fin GROUPE MONDE === */}
      </svg>
    </AbsoluteFill>
  );
};

export default B2MecheEteinte;
