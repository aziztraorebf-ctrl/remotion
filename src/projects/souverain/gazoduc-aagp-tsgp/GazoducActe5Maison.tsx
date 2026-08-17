// ⭐ RESPIRATION FINALE (demande Aziz 2026-08-17) : le plan s'arretait a 9.321s, soit a l'ATTAQUE du
// mot "facture" — coupe brutale des que la courbe finissait de monter. Or "facture." se termine a
// 9.861s et la phrase suivante n'ouvre qu'a 10.941s : il y a 1.08s de silence. La coupe se pose
// desormais a 10.40s, DANS ce silence : la courbe a le temps de se poser, la voix respire.
// ⛔ Meme lecon que "SOUVERAINS" : une frontiere de plan se pose APRES la fin du mot, jamais sur son
// ancre. C'est la 2e fois — c'est un reflexe a garder pour tout futur decoupage.
// MOTEUR: objet/metaphore SVG — "ma maison, mon chauffage, ma facture" est une idee domestique et
// ⭐ MIX-AND-MATCH (choix Aziz 2026-08-16) : le TRACE DU FIL vient du SVG de Kimi K3, issu du
// concours 5 modeles sur ce meme panneau. Il epouse la courbe au lieu de la contourner par un
// coude anguleux (ma v2) ou de tomber a l'ecart (GPT) : le lien flamme->facture se lit d'un
// seul coup d'oeil. Recale sur NOTRE geometrie, puis CORRIGE apres mesure : le trace brut de Kimi
// frolait notre courbe a 0.1px (x=518, calcul sur curveY) — ils se collaient. Et pres de l'origine
// notre courbe est deja sur l'axe (y=917 a x=400), donc impossible de glisser le fil dessous.
// => le fil REJOINT la courbe franchement a mi-parcours puis suit l'axe : une jonction nette au
// lieu d'un cotoiement ambigu. Tout le reste est de nous.
// abstraite a la fois : ni carte ni acteur, seule la metaphore-objet en SVG plat (maison en coupe +
// courbe qualitative) relie le geopolitique au vecu du spectateur.
//
// GazoducActe5Maison — OUVERTURE de l'Acte 5 (retour vers le spectateur).
// Narration : "Si vous vous chauffez au gaz... cette rivalite finira un jour sur votre facture."
// Le mot "facture" tombe a 9.32s (frame 280) : la courbe culmine exactement la.
//
// DEROULE : la maison se dessine (0-60) -> chauffage interieur (55-80) -> la flamme s'allume (70-90)
// -> le fil ambre descend de la chaudiere, file A GAUCHE au-dessus de la courbe, et plonge dans
// l'ORIGINE de la courbe (88-118) — il ne croise JAMAIS la courbe (routage storyboard : la flamme
// alimente le depart de la facture) -> flux ambre discret dans le fil -> l'axe se pose (100-122)
// -> la courbe s'allume a l'arrivee du fil (118-280) et culmine pile sur "facture". Fermeture
// droite de l'aire : fondu horizontal + pointille vertical de rappel (repris du storyboard).
// La flamme ondule LEGERES sinusoides deterministes pendant toute la scene.
//
// ZERO TREMBLEMENT, ZERO FLASH, ZERO PULSE (exigence realisateur) : seul mouvement narratif.
// AUCUN CHIFFRE, AUCUN TEXTE : la montee est qualitative, pas de fausse donnee.
// Determinisme total : aucun Math.random(), aucun Date.now() — tout depend de `frame`.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";

const W = 1920;
const H = 1080;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ---- Geometrie du graphique (bas de cadre) ----
const CHART_X0 = 360; // origine de la courbe
const CHART_X1 = 1560; // extremite droite
const CHART_BASE_Y = 920; // axe horizontal
const CHART_RISE = 265; // hauteur totale de la montee (qualitative)

// Forme de la courbe : montee reguliere qui accelere, avec de petites respirations.
// Monotone a l'oeil : ca se lit immediatement comme "ca augmente".
const curveY = (t: number): number => {
  const rise = CHART_RISE * Math.pow(t, 1.35) + 16 * Math.sin(t * 7.2) * t;
  return CHART_BASE_Y - rise;
};

// Construit le chemin de la courbe jusqu'a la progression p (0..1).
const buildCurve = (p: number): { line: string; area: string; tipX: number; tipY: number } => {
  const steps = 72;
  const n = Math.max(2, Math.round(steps * p));
  let line = "";
  for (let i = 0; i <= n; i++) {
    const tt = Math.min(p, i / steps);
    const x = CHART_X0 + (CHART_X1 - CHART_X0) * tt;
    const y = curveY(tt);
    line += (i === 0 ? "M " : "L ") + x.toFixed(1) + " " + y.toFixed(1) + " ";
  }
  const tipX = CHART_X0 + (CHART_X1 - CHART_X0) * p;
  const tipY = curveY(p);
  const area = line + `L ${tipX.toFixed(1)} ${CHART_BASE_Y} L ${CHART_X0} ${CHART_BASE_Y} Z`;
  return { line, area, tipX, tipY };
};

// ---- Flamme stylisee : 2 langues plates, teardrop en cubiques, ondulation sinusoidale legere ----
const flamePath = (cx: number, baseY: number, h: number, w: number, sway: number): string => {
  const tipX = cx + sway;
  const tipY = baseY - h;
  return (
    `M ${cx - w} ${baseY} ` +
    `C ${cx - w * 1.15} ${baseY - h * 0.5}, ${cx - w * 0.35 + sway * 0.6} ${baseY - h * 0.75}, ${tipX} ${tipY} ` +
    `C ${cx + w * 0.35 + sway * 0.6} ${baseY - h * 0.75}, ${cx + w * 1.15} ${baseY - h * 0.5}, ${cx + w} ${baseY} Z`
  );
};

export const GazoducActe5Maison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1) La maison se dessine (trace continu, pathLength normalise -> pas d'heuristique de longueur).
  const houseDraw = interpolate(frame, [0, 58], [1, 0], { ...clampB, easing: Easing.inOut(Easing.ease) });
  const detailsIn = interpolate(frame, [40, 66], [0, 1], clampB); // fenetres + cheminee
  const heatIn = interpolate(frame, [55, 80], [1, 0], { ...clampB, easing: Easing.out(Easing.ease) }); // chaudiere + radiateur

  // 2) La flamme s'allume : petite pousse decidee, puis ondulation permanente (c'est du feu).
  const ignite = spring({ frame: frame - 70, fps, config: { damping: 16, stiffness: 120, mass: 0.6 } });
  const flameScale = interpolate(ignite, [0, 1], [0, 1], clampB);
  const swayOut = 4.5 * Math.sin(frame * 0.16);
  const swayIn = 3.0 * Math.sin(frame * 0.21 + 1.7);
  const breathe = 1 + 0.045 * Math.sin(frame * 0.11 + 0.6); // respiration de hauteur, tres legere

  // 3) Le fil conducteur descend de la chaudiere vers l'origine de la courbe.
  const linkDraw = interpolate(frame, [88, 118], [1, 0], { ...clampB, easing: Easing.inOut(Easing.ease) });
  const flowIn = interpolate(frame, [118, 136], [0, 1], clampB);
  const flowOffset = -((frame * 0.0028) % 1); // flux orienté chaudiere -> facture, deterministe

  // 4) L'axe se pose, puis la courbe s'allume a l'ARRIVEE du fil (118) et culmine pile a 280 ("facture").
  const axisDraw = interpolate(frame, [100, 122], [1, 0], { ...clampB, easing: Easing.out(Easing.ease) });
  const curveP = interpolate(frame, [118, 280], [0.02, 1], {
    ...clampB,
    easing: Easing.bezier(0.42, 0.0, 0.58, 1.0),
  });
  const { line: curveLine, area: curveArea, tipX, tipY } = buildCurve(curveP);
  const chartIn = interpolate(frame, [118, 132], [0, 1], clampB);
  // Pointille de rappel sous la pointe (repris du storyboard) : apparait quand la montee est engagee.
  const dropIn = interpolate(frame, [150, 176], [0, 1], clampB);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050c1a" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="a5m-bg" cx="0.5" cy="0.12" r="1.15">
            <stop offset="0" stopColor="#0d1f38" />
            <stop offset="1" stopColor="#050c1a" />
          </radialGradient>
          <linearGradient id="a5m-area" x1="0" y1={CHART_BASE_Y - CHART_RISE} x2="0" y2={CHART_BASE_Y} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2E9FD4" stopOpacity="0.30" />
            <stop offset="1" stopColor="#2E9FD4" stopOpacity="0.02" />
          </linearGradient>
          {/* Fondu horizontal de l'aire pres de son bord droit : la fermeture n'est plus un mur sec */}
          <linearGradient id="a5m-edgefade" x1={Math.max(CHART_X0, tipX - 170)} y1="0" x2={tipX} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#5a5a5a" />
          </linearGradient>
          <mask id="a5m-areamask">
            <rect x={CHART_X0 - 8} y={CHART_BASE_Y - CHART_RISE - 60} width={Math.max(1, tipX - CHART_X0 + 16)} height={CHART_RISE + 80} fill="url(#a5m-edgefade)" />
          </mask>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#a5m-bg)" />

        {/* ===================== MAISON EN COUPE (tiers superieur/central) ===================== */}
        <g id="house">
          {/* Silhouette continue : mur gauche, debord de toit, deux pentes, mur droit, plancher */}
          <path
            d="M 745 560 L 745 370 L 700 370 L 960 215 L 1220 370 L 1175 370 L 1175 560 Z"
            fill="none"
            stroke="#2E9FD4"
            strokeWidth={3.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={houseDraw}
          />
          {/* Cheminee + fenetres suggerees (coupe schema technique) */}
          <g opacity={detailsIn}>
            <path d="M 1090 293 L 1090 240 L 1132 240 L 1132 318" fill="none" stroke="#2E9FD4" strokeWidth={3} strokeLinecap="round" />
            <rect x="800" y="415" width="52" height="52" fill="none" stroke="#2E9FD4" strokeWidth={2.5} />
            <rect x="895" y="415" width="52" height="52" fill="none" stroke="#2E9FD4" strokeWidth={2.5} />
          </g>
          {/* Interieur : radiateur a fins + conduite au sol + chaudiere */}
          <g id="heating" opacity={1 - heatIn}>
            {/* radiateur */}
            <path d="M 772 498 L 856 498" stroke="#2E9FD4" strokeWidth={2.5} strokeLinecap="round" fill="none" />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <path key={i} d={`M ${772 + i * 14} 498 L ${772 + i * 14} 552`} stroke="#2E9FD4" strokeWidth={2.5} strokeLinecap="round" />
            ))}
            {/* conduite le long du plancher, du radiateur a la chaudiere */}
            <path d="M 856 548 L 1042 548" stroke="#2E9FD4" strokeWidth={2} strokeLinecap="round" strokeOpacity={0.7} />
            {/* chaudiere : caisson clair, la flamme vit dedans */}
            <rect x="1042" y="446" width="92" height="110" rx="8" fill="none" stroke="#7FD8FF" strokeWidth={3} />
          </g>
          {/* Flamme stylisee et PLATE : 2 langues ambre, ondulation sinusoidale legere */}
          <g id="flame" transform={`translate(1088 545) scale(${flameScale * breathe}) translate(-1088 -545)`}>
            <path d={flamePath(1088, 545, 62, 21, swayOut)} fill="#c98f16" opacity={0.9} />
            <path d={flamePath(1088, 545, 40, 12, swayIn)} fill="#FFC742" />
          </g>
        </g>

        {/* ===================== FIL CONDUCTEUR flamme -> origine de la courbe ===================== */}
        <g id="link">
          <path
            d="M 1088 560 L 1088 700 C 1088 812 1010 872 900 892 C 800 910 700 918 640 920 L 361 920"
            fill="none"
            stroke="#FFC742"
            strokeWidth={2.5}
            strokeOpacity={0.4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={linkDraw}
          />
          {/* Flux discret : le gaz consomme "coule" vers la facture (mouvement narratif, pas un pulse) */}
          <path
            d="M 1088 560 L 1088 700 C 1088 812 1010 872 900 892 C 800 910 700 918 640 920 L 361 920"
            fill="none"
            stroke="#FFC742"
            strokeWidth={2.5}
            strokeOpacity={0.8 * flowIn}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="0.035 0.075"
            strokeDashoffset={flowOffset}
          />
        </g>

        {/* ===================== COURBE QUI MONTE (qualitative, zero chiffre) ===================== */}
        <g id="chart">
          {/* Axe horizontal simple */}
          <path
            d="M 336 920 L 1584 920"
            fill="none"
            stroke="#7FD8FF"
            strokeWidth={2}
            strokeOpacity={0.55}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={axisDraw}
          />
          <g opacity={chartIn}>
            {/* Aire sous la courbe, legerement remplie, bord droit fondu (jamais de mur sec) */}
            <path d={curveArea} fill="url(#a5m-area)" mask="url(#a5m-areamask)" />
            {/* Pointille vertical de rappel sous la pointe (echo du storyboard, zero texte) */}
            <path
              d={`M ${tipX.toFixed(1)} ${(tipY + 16).toFixed(1)} L ${tipX.toFixed(1)} ${CHART_BASE_Y - 6}`}
              fill="none"
              stroke="#7FD8FF"
              strokeWidth={2}
              strokeOpacity={0.32 * dropIn}
              strokeDasharray="5 9"
              strokeLinecap="round"
            />
            {/* La courbe elle-meme */}
            <path d={curveLine} fill="none" stroke="#2E9FD4" strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" />
            {/* Pointe : le "maintenant" qui grimpe */}
            <circle cx={tipX} cy={tipY} r={7} fill="#7FD8FF" />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
