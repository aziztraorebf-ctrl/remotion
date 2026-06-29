/**
 * VergerCacao — composant PAYSAGE 3 ETATS, reutilise B3 (extraction) + B4 (renversement/nuance).
 *
 * Fil de transformation continu (doctrine cacao) : UN MEME verger qui evolue —
 *   - etat "mort"     (B3)  : verger en encre morte, SAUF 2 cacaoyers sur 14 colorises brun-vie
 *                              = "le Ghana produit un septieme du cacao" (proportion = chiffre).
 *   - etat "reverdit" (B4A) : les 14 reverdissent en cascade = climax "pas pauvre / sous-payee".
 *   - etat "fissure"  (B4B) : une fissure d'encre fend le sol depuis le centre = nuance interne.
 *
 * Le pilotage des 3 etats se fait par les props (greenProgress[], crackProgress). Ce composant
 * ne contient AUCUNE logique de frame : c'est le beat (B3/B4) qui calcule les progressions
 * audio-derived et les passe. Ici = la MATIERE + le rendu d'un etat.
 *
 * Registre ENCRE NARRATIVE (GGW, ferme) : trait encre #2b2117 sur parchemin #e8dcc0.
 * Munition couleur : brun-vie #6b4423 (= COCOA de B1, coherence) = EVENEMENT, jamais d'emblee partout.
 * Vue 3/4 plongeante, point de fuite haut, 14 arbres etages (avant-plan NON dominant). Ancrage sol + ombres.
 */
import React from "react";
import { interpolate } from "remotion";

const W = 1080;
const H = 1920;

// ---- Palette (coherence B1) ----
const PARCH = "#e8dcc0";
const INK = "#2b2117";
const COCOA = "#6b4423"; // brun-vie (= B1)
const COCOA_DARK = "#4a2c14";
const POD = "#a26432"; // cabosse vive
const DEAD = "#5a4b38"; // encre morte (trait)

// 3 tons de feuillage vivant (le champ "respire" au climax B4A — pas 14 bruns identiques)
const LEAF_TONES = ["#6b4423", "#5e7245", "#8a5a2f"]; // brun-cacao, vert-cacao, ocre chaud

// ---- Un cacaoyer parametrique ----
// alive 0..1 : 0 = encre morte (trait pale), 1 = brun-vie plein (tronc + couronne + cabosses).
// Le cacaoyer = tronc DROIT ramifie + couronne irreguliere + CABOSSES OVALES sur le tronc (signature).
type TreeProps = {
  alive: number; // 0..1 colorisation
  deadOpacity?: number; // densite du trait mort (pour qu'on COMPTE les 14)
  tone?: number; // index de ton de feuillage (LEAF_TONES) — varie le champ au climax
  grow?: number; // 0..1 croissance (tronc se trace bas->haut, couronne eclot). Defaut 1.
};

const CacaoTree: React.FC<TreeProps> = ({ alive, deadOpacity = 0.55, tone = 0, grow = 1 }) => {
  // interpolation couleur encre-morte -> brun-vie (ton variable)
  const barkFill = alive > 0.01 ? COCOA_DARK : "none";
  const leafFill = alive > 0.01 ? LEAF_TONES[tone % LEAF_TONES.length] : "none";
  const podFill = alive > 0.01 ? POD : "none";
  const lineStroke = alive > 0.01 ? INK : DEAD;
  const lineOpacity = alive > 0.01 ? 1 : deadOpacity;
  const lineW = alive > 0.01 ? 4 : 3.4;
  // opacite de remplissage progressive (colorisation = buvard)
  const fillOp = alive;

  // CROISSANCE : tronc pousse d'abord (grow 0->0.5, scaleY depuis le sol), couronne eclot apres (0.4->1).
  const trunkGrow = Math.min(1, grow / 0.5); // 0..1 sur la 1ere moitie
  const trunkScaleY = 0.15 + 0.85 * trunkGrow;
  const crownGrow = Math.max(0, (grow - 0.4) / 0.6); // 0..1 sur la 2e partie
  // eclosion couronne : scale avec leger overshoot (organique), pivot a la base du houppier (~y=-260)
  const crownEase = crownGrow < 1 ? 1 - Math.pow(1 - crownGrow, 3) : 1;
  const crownScale = crownGrow <= 0 ? 0 : crownEase * (crownGrow < 0.85 ? 1 : 1);
  const crownOp = crownGrow;

  return (
    <g>
      {/* ombre portee (ancrage) — grandit avec l'arbre */}
      <ellipse cx={0} cy={20} rx={132 * (0.4 + 0.6 * trunkGrow)} ry={30} fill={INK} opacity={0.12 * (0.3 + 0.7 * trunkGrow)} />
      {/* tronc ramifie — pousse depuis le sol (scaleY) */}
      <g transform={`scale(1 ${trunkScaleY})`} style={{ transformOrigin: "0px 0px" }}>
        {/* corps du tronc (rempli si vivant) */}
        <path
          d="M-34 0 C-22 -92 -24 -165 -28 -252 C-12 -266 12 -266 30 -252 C24 -165 30 -92 42 0 Z"
          fill={barkFill}
          fillOpacity={fillOp}
          stroke={lineStroke}
          strokeOpacity={lineOpacity}
          strokeWidth={lineW}
          strokeLinejoin="round"
        />
        {/* branches (courtes, restent SOUS la couronne — pas de squelette qui depasse) */}
        <path
          d="M-12 0 C-8 -90 -6 -170 -12 -254 C-30 -278 -52 -300 -72 -330 M-10 -254 C14 -284 40 -306 70 -336 M-6 -200 C24 -226 54 -238 84 -252 M-13 -160 C-40 -188 -68 -208 -94 -232"
          fill="none"
          stroke={lineStroke}
          strokeOpacity={lineOpacity}
          strokeWidth={lineW}
          strokeLinecap="round"
        />
      </g>
      {/* COURONNE + nervures + cabosses : ECLOSION (scale depuis la base du houppier, apres le tronc) */}
      <g transform={`translate(0 -260) scale(${crownScale}) translate(0 260)`} opacity={crownOp}>
      {/* couronne irreguliere PLEINE silhouette (mort = trait dense lisible, vivant = rempli brun-vie) */}
      <path
        d="M-194 -340 C-238 -410 -182 -488 -100 -474 C-66 -558 58 -562 102 -480 C184 -502 250 -426 204 -350 C238 -292 150 -232 70 -262 C18 -212 -92 -222 -126 -282 C-188 -268 -238 -302 -194 -340 Z"
        fill={alive > 0.01 ? leafFill : PARCH}
        fillOpacity={alive > 0.01 ? fillOp : 0.92}
        stroke={lineStroke}
        strokeOpacity={lineOpacity}
        strokeWidth={lineW}
        strokeLinejoin="round"
      />
      {/* nervures de feuillage (detail) */}
      <path
        d="M-100 -474 C-48 -444 -8 -450 36 -480 M-126 -282 C-68 -326 -14 -330 50 -296 M102 -480 C138 -430 166 -402 204 -350"
        fill="none"
        stroke={lineStroke}
        strokeOpacity={lineOpacity * 0.8}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      {/* CABOSSES ovales sur le tronc (signature du cacaoyer — plus presentes : 4, plus grandes) */}
      <g>
        <ellipse cx={4} cy={-128} rx={23} ry={42} fill={podFill} fillOpacity={fillOp} stroke={lineStroke} strokeOpacity={lineOpacity} strokeWidth={3.4} />
        <ellipse cx={-46} cy={-206} rx={19} ry={37} fill={podFill} fillOpacity={fillOp} stroke={lineStroke} strokeOpacity={lineOpacity} strokeWidth={3.4} />
        <ellipse cx={50} cy={-182} rx={18} ry={35} fill={podFill} fillOpacity={fillOp} stroke={lineStroke} strokeOpacity={lineOpacity} strokeWidth={3.4} />
        <ellipse cx={-14} cy={-238} rx={15} ry={29} fill={podFill} fillOpacity={fillOp} stroke={lineStroke} strokeOpacity={lineOpacity} strokeWidth={3} />
        {/* cotes des cabosses (texture striee) */}
        <path
          d="M4 -166 L4 -90 M-10 -158 C-2 -142 -2 -114 -10 -98 M18 -158 C10 -142 10 -114 18 -98 M-46 -240 L-46 -172 M50 -214 L50 -150 M-14 -266 L-14 -210"
          fill="none"
          stroke={lineStroke}
          strokeOpacity={lineOpacity}
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      </g>
      </g>
    </g>
  );
};

// ---- Placement des 14 arbres en PERSPECTIVE EQUILIBREE (avant-plan NON dominant) ----
// x,y = position au sol ; s = echelle (profondeur). Etagement regulier, de part et d'autre du couloir.
// Index 0..13. Les 2 "vivants" en B3 = indices VIVANTS_B3 (1 grand avant + 1 milieu, places pour que 2/14 saute aux yeux).
type Slot = { x: number; y: number; s: number };
const TREES: Slot[] = [
  // fond (petits, pres horizon) — ECARTES du couloir central pour aerer
  { x: 410, y: 766, s: 0.30 },
  { x: 668, y: 762, s: 0.31 },
  { x: 290, y: 808, s: 0.36 },
  { x: 792, y: 806, s: 0.37 },
  // milieu — ecartes
  { x: 250, y: 928, s: 0.45 },
  { x: 832, y: 926, s: 0.47 },
  { x: 392, y: 1024, s: 0.52 },
  { x: 690, y: 1030, s: 0.54 },
  // avant-milieu
  { x: 196, y: 1196, s: 0.62 },
  { x: 884, y: 1202, s: 0.63 },
  { x: 372, y: 1336, s: 0.70 },
  { x: 716, y: 1356, s: 0.72 },
  // premier plan (grands mais PAS geants — equilibre)
  { x: 178, y: 1592, s: 0.86 },
  { x: 902, y: 1612, s: 0.88 },
];

// les 2 cacaoyers VIVANTS en B3 = "un septieme" (2/14). 1 grand premier-plan (#13) + 1 milieu (#7).
export const VIVANTS_B3 = [13, 7];

export type VergerEtat = "mort" | "reverdit" | "fissure";

type VergerProps = {
  /** progression de colorisation par arbre (0..1), longueur 14. Pilote par le beat. */
  greenProgress?: number[];
  /** progression d'APPARITION par arbre (0..1) — le champ s'eveille en cascade. Defaut: tous visibles. */
  appearProgress?: number[];
  /** progression de la fissure (0..1) — B4B seulement. 0 = pas de fissure. */
  crackProgress?: number;
  /** densite du trait des arbres morts (qu'on COMPTE les 14). Defaut 0.6. */
  deadOpacity?: number;
  /** afficher chapeau + cabosses au sol (artefact humain). Defaut true. */
  showHat?: boolean;
  /** progression d'apparition du chapeau (0..1). Defaut 1. */
  hatProgress?: number;
  /** balancement leger des houppiers (sway-houppier, 0=immobile). Defaut 0. */
  sway?: number;
  /** lever de soleil (0 = bas/pale, 1 = haut/plein). Defaut 1 (deja leve). */
  sunRise?: number;
  /** micro-vie : reseau racinaire qui s'eveille sous le sol (0..1). Defaut 0. */
  rootLife?: number;
  /** phase de VENT permanente (= frame courant). Pilote sway+glow+nuages+oiseaux en boucle. Defaut 0. */
  windPhase?: number;
};

export const VergerCacao: React.FC<VergerProps> = ({
  greenProgress = [],
  appearProgress,
  crackProgress = 0,
  deadOpacity = 0.72,
  showHat = true,
  hatProgress = 1,
  sway = 0,
  sunRise = 1,
  rootLife = 0,
  windPhase = 0,
}) => {
  const wf = windPhase; // frame pour les boucles de vie permanente
  // soleil : monte de y=380 (bas) a y=250 (haut), grandit et s'eclaire
  const sunY = 380 - 130 * sunRise;
  const sunR = 80 + 30 * sunRise;
  const sunFill = sunRise > 0.5 ? "#f2c14e" : "#efe2b9"; // pale -> jaune en montant
  const sunOp = 0.5 + 0.5 * sunRise;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      {/* FOND parchemin */}
      <rect width={W} height={H} fill={PARCH} />

      {/* CIEL : soleil qui SE LEVE + GLOW qui pulse + RAYONS qui bougent (facon GGW) + nuages + oiseaux */}
      <g id="ciel">
        {/* GLOW radial qui respire (pulse permanent) */}
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f2c14e" stopOpacity={0.55} />
            <stop offset="55%" stopColor="#f2c14e" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#f2c14e" stopOpacity={0} />
          </radialGradient>
        </defs>
        {(() => {
          const pulse = 0.85 + 0.15 * Math.sin(wf / 22); // respiration
          const glowR = sunR * (2.1 + 0.2 * Math.sin(wf / 22));
          return <circle cx={250} cy={sunY} r={glowR} fill="url(#sunGlow)" opacity={sunRise * pulse} />;
        })()}
        {/* disque */}
        <circle cx={250} cy={sunY} r={sunR} fill={sunFill} opacity={sunOp} />
        <circle cx={250} cy={sunY} r={sunR} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />
        {/* RAYONS qui bougent : 8 rayons qui tournent lentement + s'allongent en boucle */}
        <g stroke={sunFill} strokeWidth={4} opacity={sunRise * 0.6} strokeLinecap="round">
          {Array.from({ length: 8 }, (_, k) => {
            const baseAngle = (k / 8) * Math.PI * 2 + wf / 120; // rotation lente
            const len = 38 + 18 * Math.sin(wf / 18 + k); // pulsation des rayons
            const r0 = sunR + 12;
            const r1 = sunR + 12 + len;
            return (
              <line key={k}
                x1={250 + Math.cos(baseAngle) * r0} y1={sunY + Math.sin(baseAngle) * r0}
                x2={250 + Math.cos(baseAngle) * r1} y2={sunY + Math.sin(baseAngle) * r1} />
            );
          })}
        </g>
        {/* NUAGES qui derivent droite->gauche (organique, jamais hors cadre : fade aux bords) */}
        {[
          { baseX: 760, y: 300, w: 1.0, speed: 0.18, phase: 0 },
          { baseX: 900, y: 240, w: 0.8, speed: 0.14, phase: 2 },
          { baseX: 640, y: 420, w: 0.7, speed: 0.22, phase: 4 },
        ].map((c, k) => {
          // derive lente vers la gauche, bouclee dans [120, 980] (jamais le bord)
          const range = 860;
          const x = 120 + ((c.baseX - 120 - wf * c.speed) % range + range) % range;
          const bob = Math.sin(wf / 30 + c.phase) * 6; // ondulation verticale douce
          // fade aux extremites de la plage (ne sort jamais franchement)
          const edgeFade = Math.min(1, Math.min(x - 120, 980 - x) / 120);
          const op = 0.5 * Math.max(0, edgeFade);
          return (
            <g key={k} transform={`translate(${x} ${c.y + bob}) scale(${c.w})`} opacity={op}>
              <path d="M0 0 Q30 -22 62 0 T128 -6" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
              <path d="M18 14 Q52 -2 92 10" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" opacity={0.7} />
            </g>
          );
        })}
        {/* OISEAUX qui MONTENT en battant des ailes + fade (jamais hors cadre lateral) */}
        {[
          { x: 660, y0: 560, speed: 0.5, phase: 0, flap: 0 },
          { x: 790, y0: 600, speed: 0.42, phase: 1.4, flap: 2 },
        ].map((b, k) => {
          // montee lente, boucle sur ~5s, fade en haut (disparait avant le bord)
          const cycle = ((wf * b.speed + b.phase * 40) % 280) / 280; // 0..1
          const y = b.y0 - cycle * 360; // monte
          const op = interpolate(cycle, [0, 0.12, 0.78, 1], [0, 0.7, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // battement d'ailes (angle qui oscille vite)
          const flap = Math.sin(wf / 4 + b.flap) * 8; // degres
          const wingY = 0 - Math.abs(Math.sin(wf / 4 + b.flap)) * 6;
          return (
            <g key={k} transform={`translate(${b.x} ${y})`} opacity={op}>
              {/* deux ailes en V qui battent */}
              <path d={`M-22 ${wingY} Q-8 ${-6 - flap} 0 0 Q8 ${-6 - flap} 22 ${wingY}`} fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
            </g>
          );
        })}
      </g>

      {/* SOL : couloir central qui s'enfonce + sillons en perspective + horizon (ancrage) */}
      <g id="sol">
        {/* ligne d'horizon vallonnee */}
        <path d="M0 705 C210 690 350 720 520 716 C720 712 860 694 1080 708" fill="none" stroke={INK} strokeWidth={2.4} opacity={0.6} />
        {/* couloir central (terre qui s'enfonce vers le point de fuite) */}
        <path d="M478 720 C430 940 345 1228 255 1920 M593 720 C649 948 723 1238 812 1920" fill="none" stroke={INK} strokeWidth={3} opacity={0.5} />
        {/* sillons convergents */}
        <g stroke={INK} strokeWidth={2} opacity={0.3} fill="none">
          <path d="M0 1032 C190 958 365 842 506 740" />
          <path d="M1080 1030 C895 948 714 838 590 740" />
          <path d="M0 1450 C210 1280 382 980 500 752" />
          <path d="M1080 1450 C875 1290 706 985 594 752" />
        </g>
        {/* bandes de sol au pied (profondeur) */}
        <path d="M0 1180 C300 1160 540 1190 1080 1170" fill="none" stroke={INK} strokeWidth={2} opacity={0.32} />
        <path d="M0 1520 C320 1490 560 1530 1080 1505" fill="none" stroke={INK} strokeWidth={2} opacity={0.28} />
        {/* MICRO-VIE : reseau racinaire qui s'eveille sous le sol (rootLife) — exploite le silence audio.
            Les racines se tracent (strokeDashoffset) + petites lueurs aux noeuds = la vie qui dort dans la terre. */}
        {rootLife > 0.001 && (
          <g id="racines" opacity={Math.min(1, rootLife * 1.4)}>
            {[
              { d: "M540 1340 C480 1420 430 1500 380 1600", len: 360 },
              { d: "M540 1340 C600 1420 660 1500 720 1600", len: 360 },
              { d: "M540 1380 C520 1480 510 1580 500 1700", len: 360 },
              { d: "M480 1500 C420 1540 360 1560 300 1600", len: 220 },
              { d: "M660 1500 C720 1540 780 1560 840 1600", len: 220 },
            ].map((r, k) => (
              <path key={k} d={r.d} fill="none" stroke={COCOA} strokeWidth={2.2} strokeLinecap="round"
                opacity={0.5} strokeDasharray={r.len} strokeDashoffset={r.len * (1 - rootLife)} />
            ))}
            {/* lueurs aux noeuds (graines qui s'eveillent) */}
            {[[380, 1600], [720, 1600], [500, 1700], [540, 1340]].map(([cx, cy], k) => (
              <circle key={k} cx={cx} cy={cy} r={6 + 3 * Math.sin(k)} fill={COCOA} opacity={rootLife * 0.6} />
            ))}
          </g>
        )}
      </g>

      {/* LES 14 CACAOYERS (du fond vers l'avant pour le z-order) */}
      {TREES.map((t, i) => {
        const alive = greenProgress[i] ?? 0;
        // ton de feuillage varie (pseudo-aleatoire stable par index) — champ qui respire au climax
        const tone = (i * 5 + 2) % 3;
        // CROISSANCE (si pilotee) : tronc pousse + couronne eclot. Defaut 1 = deja pousse.
        const grow = appearProgress ? appearProgress[i] ?? 0 : 1;
        if (grow <= 0.001) return null;
        // VENT PERMANENT + VISIBLE (boucle sin, des l'apparition) : TOUS les arbres bougent, meme les morts.
        // periode ~2.7s, dephasage par index, amplitude visible (1.6deg) modulee par un 2e sin lent (rafales).
        const gust = 0.7 + 0.3 * Math.sin(wf / 38 + i);
        const swayPermanent = Math.sin(wf / 26 + i * 0.9) * 1.6 * gust;
        // sway additionnel optionnel (sway prop) pour accentuer ponctuellement
        const swayAngle = (swayPermanent + sway * Math.sin(i * 1.3) * 1.2) * grow;
        return (
          <g key={i} transform={`translate(${t.x} ${t.y}) scale(${t.s})`}>
            <g transform={`rotate(${swayAngle} 0 0)`}>
              <CacaoTree alive={alive} deadOpacity={deadOpacity} tone={tone} grow={grow} />
            </g>
          </g>
        );
      })}

      {/* CHAPEAU au CENTRE (bout du couloir) + cabosses ouvertes au sol (artefact humain absent) */}
      {showHat && hatProgress > 0.001 && (
        <g id="chapeau" transform={`translate(535 1335) scale(${0.6 + 0.4 * hatProgress})`} opacity={hatProgress}>
          <ellipse cx={0} cy={-10} rx={122} ry={36} fill="#d1b46b" stroke={INK} strokeWidth={4} />
          <path d="M-77 -15 C-53 -69 -15 -95 23 -83 C63 -71 87 -47 102 -13 C53 7 -21 10 -77 -15 Z" fill="#c39a4f" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <path d="M-59 -13 C-17 -1 46 -3 89 -15 M-41 -39 C-9 -27 37 -27 73 -41 M-20 -67 C5 -57 35 -57 57 -67" fill="none" stroke={INK} strokeWidth={2.2} opacity={0.75} strokeLinecap="round" />
          {/* cabosses ouvertes au sol */}
          <g transform="translate(-130 60)">
            <path d="M0 0 C23 -26 65 -24 89 2 C65 32 23 34 0 0 Z" fill={POD} stroke={INK} strokeWidth={3} />
            <path d="M13 0 C35 -10 57 -10 79 2" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          </g>
          <g transform="translate(62 47)">
            <path d="M0 0 C25 -28 69 -24 93 6 C65 36 23 34 0 0 Z" fill="#b06d36" stroke={INK} strokeWidth={3} />
            <path d="M15 0 C38 -8 60 -7 81 6" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          </g>
          {/* feves */}
          <g transform="translate(-5 71)">
            <ellipse cx={0} cy={0} rx={38} ry={18} fill="#e2c07a" stroke={INK} strokeWidth={3} />
            <circle cx={-16} cy={-1} r={5} fill="#6b3e22" />
            <circle cx={2} cy={-8} r={5} fill="#6b3e22" />
            <circle cx={18} cy={2} r={5} fill="#6b3e22" />
          </g>
        </g>
      )}

      {/* FISSURE (B4B) : veine d'encre qui TRAVERSE le sol de part en part — elle se trace du FOND (haut,
          vers le point de fuite) jusqu'a l'AVANT (bas), passant des DEUX COTES du chapeau. Le sol est fendu
          de bout en bout (la perte vient du dedans, pas d'un seul cote). crackProgress 0..1 */}
      {crackProgress > 0.001 && (
        <g id="fissure" opacity={1}>
          {/* segment HAUT : du point de fuite jusqu'au-dessus du chapeau (se trace en premier) */}
          <path
            d="M538 752 C528 880 548 1010 530 1140 C524 1210 532 1260 534 1300"
            fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round"
            strokeDasharray={620} strokeDashoffset={620 * (1 - Math.min(1, crackProgress * 1.6))}
          />
          {/* segment BAS : du dessous du chapeau jusqu'au bord bas (se trace ensuite) */}
          <path
            d="M536 1372 C530 1460 556 1540 532 1630 C548 1720 520 1790 540 1880 C544 1905 538 1915 540 1920"
            fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round"
            strokeDasharray={640} strokeDashoffset={640 * (1 - Math.max(0, (crackProgress - 0.35) / 0.65))}
          />
          {/* ramifications laterales (apparaissent quand la fissure est avancee) */}
          <path
            d="M530 1140 C480 1150 440 1180 410 1230 M534 1300 C588 1310 626 1346 648 1396 M532 1630 C500 1650 470 1690 455 1740 M540 1500 C585 1510 615 1546 632 1588"
            fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round"
            opacity={Math.max(0, (crackProgress - 0.5) / 0.5)}
          />
        </g>
      )}
    </svg>
  );
};
