// MOTEUR: GEOMETRIE D3 (axe temporel + courbe + barre proportionnelle) — le beat porte sur le TEMPS
// et la QUANTITE (2030, "des dizaines de milliards", un marche qui RETRECIT), pas sur l'espace. Les
// mouvements 4A et 4B du meme acte ont ete portes par la CARTE : un 3e beat cartographique serait une
// redite, et la carte ne sait pas dire "trop tard". Choix d'Aziz apres 2 rounds de storyboard.
//
// GazoducActe4Calendrier — Acte 4, MOUVEMENT C : "le calendrier se retourne" (74.5 -> 124.04s absolu).
//
// LE CONCEPT, EN UNE PHRASE : un axe de temps, UNE courbe (la demande) qui reste vivante et s'en va,
// UNE barre ambre (les milliards) qui s'empile puis se FIGE pour toujours. Le sens est porte par le
// CONTRASTE DE MOUVEMENT, pas par un symbole : l'argent bouge puis se verrouille, la demande continue
// de glisser. Le PIC du beat est l'instant precis ou la courbe passe SOUS le sommet de la barre.
//
// ⛔ REGLE DES 5 SECONDES (exigence Aziz, non negociable, cause du rejet de la v1) : jamais plus de
// ~5s sans evenement visuel. La v1 de ce concept laissait 14s d'immobilite pendant l'empressement —
// c'est pour ca que l'argent s'EMPILE ici par tranches successives au lieu de se planter d'un bloc.
//
// ⛔ AUCUNE DONNEE INVENTEE : la baisse est QUALITATIVE. Pas de graduation de valeurs sur l'axe
// vertical, pas de pourcentage. Seuls chiffres autorises par le script : 2030, "des dizaines de
// milliards", et l'AIE comme source.
//
// Breakdown : memory/episodes/souverain/gazoduc-aagp-tsgp/breakdown-acte4/4C/4C-breakdown.json
// Briques REUTILISEES (jamais recodees) : palette sombre + conventions S()/clamp de
// GazoducActe4RessourceUnique et GazoducActe4Objectifs (meme acte, meme palette PAL_GPT).
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);

// Palette sombre — identique a 4A et 4B (PAL_GPT, adoptee par Aziz 2026-08-15).
const BG_TOP = "#0d1f38";
const BG_BOT = "#050c1a";
const GOLD = "#FFC742";
const GOLD_DEEP = "#c98f16";
const CYAN = "#2E9FD4";
const CYAN_EDGE = "#7FD8FF";
const CREAM = "#e8ecf5";
const PLATE = "#0a1526";
const GHOST = "#5b6b84";
const MONO = "Menlo, 'SF Mono', 'Courier New', monospace";

// ===== TIMINGS REELS (BEATS_4C de GazoducActe4Timing.ts, forced-align — jamais arrondis) =====
const M = {
  segStart: 0,
  calendrier: S(3.902),        // "c'est le calendrier."
  gazRusse: S(10.122),         // "remplacer le gaz russe"
  enterrerMilliards: S(20.542), // "enterrer des dizaines de milliards"
  sableOuMer: S(24.242),       // "dans le sable ou sous la mer"
  declinerDemande: S(29.842),  // "la demande [...] va, elle, decliner"
  baisserDIci2030: S(38.102),  // "vouee a baisser d'ici deux mille trente."
  retrecit: S(42.562),         // "Un marche qui RETRECIT," (CAPS script)
  unSeulSuffirait: S(47.062),  // "un seul de ces deux tuyaux suffirait"
  segEnd: S(49.541),
};

// ===== GEOMETRIE DU GRAPHE =====
// Le plot occupe la moitie basse : l'espace vide au-dessus fait respirer le beat (registre premium).
const PLOT_X0 = 340;          // AUJOURD'HUI (decale : les 2 conduites + les reperes Y tiennent a gauche)
const PLOT_X1 = 1620;         // 2030
const AXIS_Y = 820;           // ligne de temps
const CURVE_Y_HIGH = 520;     // demande pleine (haute) — laisse respirer le haut du cadre
const CURVE_Y_LOW = 715;      // demande apres declin
const BAR_W = 128;   // 2 conduites de 52 + 24 d'ecart : elles se lisent comme DEUX objets distincts
const PIPE_GAP = 24;
const BAR_TOP_FINAL = 300;    // sommet de la barre ambre une fois empilee (au-dessus de la courbe)

const xAt = (t: number) => PLOT_X0 + (PLOT_X1 - PLOT_X0) * t; // t normalise 0..1

// Niveaux de la grille de repere. Remontent haut (jusqu'a 190) pour occuper le tiers superieur,
// mesure vide a 100% avant cette correction. Aucune VALEUR n'y est inscrite : la baisse est
// qualitative, on ne fabrique pas de donnees chiffrees (interdit du breakdown).
const GRID_LEVELS = [190, 300, 410, 520, 630, 740];

/** Courbe de la demande : plate jusqu'a `dropProgress`, puis glissement continu (pas de paliers).
 *  `shrink` (P4) fait DESCENDRE le sommet de la courbe : c'est ce qui rend le RETRECISSEMENT visible.
 *  ⛔ Ne jamais "retrecir" en remontant le sol de l'aire : l'oeil ne le voit pas (defaut v1 mesure). */
function demandY(t: number, drop: number, shrink = 0): number {
  const base = (() => {
    if (drop <= 0) return CURVE_Y_HIGH;
    // Le declin s'amorce a 35% de l'axe : avant, le marche est stable.
    const START_T = 0.35;
    if (t <= START_T) return CURVE_Y_HIGH;
    const local = (t - START_T) / (1 - START_T);
    // Sigmoide douce : glissement CONTINU, decision d'Aziz (pas de decrochage en marches).
    const eased = local * local * (3 - 2 * local);
    return CURVE_Y_HIGH + (CURVE_Y_LOW - CURVE_Y_HIGH) * eased * drop;
  })();
  if (shrink <= 0) return base;
  // Compression verticale de TOUTE la bande vers l'axe : la surface restante devient mince.
  // 0.72 (et non 0.58) : c'est ce GESTE qui doit dire "le marche retrecit" — la plaque qui le
  // repetait mot pour mot apres la voix a ete supprimee (exigence Aziz : ne pas doubler la narration).
  return base + (AXIS_Y - base) * 0.72 * shrink;
}

/** Fremissement permanent : un marche n'est jamais une ligne morte. Deterministe (pas de random).
 *  4 harmoniques a periodes NON multiples + une composante figee dans l'espace (independante du
 *  temps) : la courbe garde un relief propre a chaque abscisse, comme une vraie serie. Sinon on lit
 *  une ondulation periodique regulière — "ca hurle tutoriel code" (downstream 2026-08-16, juste). */
function jitter(t: number, _frame: number, amp: number): number {
  // ⛔ RELIEF FIXE UNIQUEMENT (exigence Aziz 2026-08-16, version finale) : la composante animee dans
  // le TEMPS a ete retiree — elle faisait vibrer la courbe en permanence, ce qu'Aziz a decrit comme
  // "des tremblements". Le relief irregulier reste (il evite la sinusoide "procedurale"), mais il est
  // desormais fige dans l'espace : la courbe ne bouge que lorsqu'elle DESCEND, ce qui est le propos.
  return (
    Math.sin(t * 23.7) * 0.5 +
    Math.sin(t * 57.1 + 1.7) * 0.3 +
    Math.sin(t * 113.3 + 4.1) * 0.2
  ) * amp;
}

function buildCurvePath(drop: number, frame: number, amp: number, shrink = 0): string {
  const N = 90;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = xAt(t);
    const y = demandY(t, drop, shrink) + jitter(t, frame, amp);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

function buildAreaPath(drop: number, frame: number, amp: number, shrink = 0): string {
  return `${buildCurvePath(drop, frame, amp, shrink)} L${PLOT_X1},${AXIS_Y} L${PLOT_X0},${AXIS_Y} Z`;
}

// ===== PLAQUE DE TEXTE (registre commun a l'acte : jamais de texte flottant) =====
const Plate: React.FC<{
  x: number; y: number; label: string; color?: string; appear: number; anchor?: "start" | "middle";
}> = ({ x, y, label, color = CREAM, appear, anchor = "middle" }) => {
  if (appear <= 0) return null;
  const padX = 20;
  // 22px Menlo : ~14.6px d'avance par caractere. Sous-estimer rogne le texte (defaut v1 mesure).
  const w = label.length * 14.6 + padX * 2;
  const x0 = anchor === "middle" ? x - w / 2 : x;
  return (
    <g opacity={appear} transform={`translate(0, ${(1 - appear) * 10})`}>
      <rect x={x0} y={y - 22} width={w} height={40} rx={5} fill={PLATE} stroke={color} strokeWidth={1.4} opacity={0.96} />
      <text x={x0 + w / 2} y={y + 5} fill={color} fontSize={22} fontFamily={MONO} letterSpacing={1.6} textAnchor="middle">
        {label}
      </text>
    </g>
  );
};

export const GazoducActe4Calendrier: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---------- P1 — LE CALENDRIER (0 -> 10.12s) : installer le TEMPS comme sujet ----------
  // ⛔ Ouverture DENSIFIEE : la v1 mesurait 7.5s sans changement notable ici (mesure objective par
  // diff de frames), soit une violation directe de la regle des 5s. Les evenements sont desormais
  // rapproches ET d'amplitude suffisante pour etre VUS, pas seulement presents dans le code.
  const axisDraw = interpolate(frame, [0, S(0.8)], [0, 1], clampB);
  // La grille se dessine AVEC l'axe : elle fait partie de l'installation du cadre, pas d'un ajout tardif.
  const gridIn = interpolate(frame, [S(0.4), S(2.6)], [0, 1], clampB);
  const ticksIn = interpolate(frame, [S(0.6), S(1.8)], [0, 1], clampB);
  const anchorsIn = interpolate(frame, [S(1.5), S(2.3)], [0, 1], clampB);
  const curveDraw = interpolate(frame, [S(2.6), S(4.2)], [0, 1], clampB);
  // L'aire se remplit LONGUEMENT (4.4 -> 11.5s), de gauche a droite via un masque anime : c'est un
  // geste continu qui traverse le creux mesure entre l'installation et la 1re tranche d'argent.
  const areaIn = interpolate(frame, [S(4.4), S(5.8)], [0, 1], clampB);
  const areaSweep = interpolate(frame, [S(5.0), S(11.5)], [0, 1], clampB);

  // Tete de lecture : garantit "le temps avance" meme dans les phases calmes. Demarre AVEC les
  // ancrages (2.2s) et non au mot "calendrier" — sinon l'ouverture reste morte trop longtemps.
  const headT = interpolate(frame, [S(1.7), M.baisserDIci2030], [0, 1], clampB);
  // ⛔ Plus de pulse sur la tete de lecture : son AVANCEE suffit a dire que le temps passe.
  // Accent sur le mot "calendrier" (3.902s) : les graduations s'illuminent en vague de gauche a droite.
  const calWave = interpolate(frame, [M.calendrier, M.calendrier + S(1.5)], [0, 1], clampB);

  // ---------- P2 — L'EMPRESSEMENT (10.12 -> 24.24s) : l'argent S'EMPILE ----------
  // 4 tranches successives (jamais plus de ~2.8s d'ecart) — c'est la correction du trou de 14s.
  const SLICES = [S(12.6), S(15.4), S(18.2), S(21.0)];
  const sliceSprings = SLICES.map((f) =>
    spring({ frame: frame - f, fps, config: { damping: 14, stiffness: 150, mass: 0.7 } })
  );
  const stacked = sliceSprings.reduce((acc, s) => acc + s, 0) / SLICES.length; // 0..1
  const barTop = interpolate(stacked, [0, 1], [AXIS_Y, BAR_TOP_FINAL], clampB);
  const barOpacity = interpolate(stacked, [0, 1], [0.55, 1], clampB); // l'argent "durcit"

  // Trace fantome : le fournisseur qu'on remplace se retire.
  const ghostOut = interpolate(frame, [M.gazRusse, M.gazRusse + S(2.4)], [0, 1], clampB);

  // L'instant qui portait la plaque "DES DIZAINES DE MILLIARDS" porte desormais un GESTE : la masse
  // ambre rayonne brievement (l'argent devient massif), sans mot pour le dire.
  const massePulse = interpolate(frame, [S(18.2), S(19.0), S(20.4)], [0, 1, 0], clampB);
  // Micro-pulse d'attente avant le retournement (evite un trou de 2.2s en fin de P2).
  const waitPulse = frame >= S(23.2) && frame < M.sableOuMer
    ? 1 + Math.sin((frame - S(23.2)) * 0.5) * 0.02
    : 1;

  // ---------- P3 — LE RETOURNEMENT (24.24 -> 42.56s) : LE PIC ----------
  // La barre s'enfonce sous l'axe : elle est ENTERREE (sable/mer), pas posee.
  const buried = interpolate(frame, [M.sableOuMer, M.sableOuMer + S(1.8)], [0, 1], clampB);
  // VERROUILLAGE : evenement, pas absence. Apres ca la barre ne bouge PLUS JAMAIS.
  // VERROUILLAGE etale sur toute la zone 21->29.5s (et non 1.2s) : le lisere se ferme lentement
  // autour des conduites pendant que la voix dit "au moment meme ou ces pays s'appretent a enterrer
  // des dizaines de milliards". C'est un SCELLEMENT progressif — le geste occupe le temps qu'il
  // decrit, au lieu de laisser 10s molles (trou mesure objectivement).
  const lockIn = interpolate(frame, [S(21.4), S(29.5)], [0, 1], clampB);
  const lockFlash = interpolate(frame, [S(26.4), S(26.9), S(28.0)], [0, 1, 0], clampB);

  // DECROCHAGE : glissement continu (decision Aziz).
  const drop = interpolate(frame, [M.declinerDemande, S(40.5)], [0, 1], {
    ...clampB,
    easing: (x) => x * x * (3 - 2 * x),
  });
  const aieIn = interpolate(frame, [S(33.0), S(34.0)], [0, 1], clampB);

  // ⭐ LE PIC : l'instant ou la courbe passe SOUS le sommet de la barre.
  const barTopNow = barTop; // figee des le verrouillage
  const curveYAtBar = demandY(0.5, drop);
  const crossed = curveYAtBar > barTopNow;
  const crossFrame = S(35.8);
  // Apparition SIMPLE et durable (plus d'aller-retour 0->1->0 : c'etait le flash).
  const crossFlash = interpolate(frame, [crossFrame - S(0.2), crossFrame + S(0.5)], [0, 1], clampB);
  // Leger resserrement au croisement : le cadrage marque l'evenement.
  const punch = interpolate(frame, [crossFrame, crossFrame + S(0.5), crossFrame + S(2.0)], [1, 1.022, 1.006], clampB);

  const zone2030 = interpolate(frame, [M.baisserDIci2030, M.baisserDIci2030 + S(1.2)], [0, 1], clampB);

  // ---------- P4 — RETRECIT (42.56 -> 49.54s) : le verdict ----------
  const shrink = interpolate(frame, [M.retrecit, M.retrecit + S(2.2)], [0, 1], clampB);
  // L'instant qui portait "UN MARCHÉ QUI RÉTRÉCIT" porte desormais la CONTRACTION elle-meme :
  // un liseré parcourt le sommet de la bande pendant qu'elle s'ecrase (le geste EST le propos).
  const shrinkSweep = interpolate(frame, [M.retrecit, M.retrecit + S(2.4)], [0, 1], clampB);
  const gapMark = interpolate(frame, [S(45.4), S(46.2)], [0, 1], clampB);
  // Un SEUL tuyau aurait suffi : un trait ambre fin epouse pile la bande cyan restante.
  const oneEnough = interpolate(frame, [M.unSeulSuffirait, M.unSeulSuffirait + S(1.6)], [0, 1], clampB);

  // Amplitude du fremissement : vivant tout du long, calme a la toute fin.
  // Amplitude du RELIEF de la courbe (fige dans l'espace, plus anime dans le temps depuis la
  // suppression des tremblements). Elle s'installe avec la courbe puis reste constante.
  const jitAmp = interpolate(frame, [S(2.6), S(4.4)], [0, 3.4], clampB);

  // ⭐ EVENEMENTS DE REMPLISSAGE — ajoutes apres MESURE : retirer le fremissement a fait apparaitre
  // 2 trous reels (9.5s a partir de 21s, 6.5s a partir de 5.5s) au-dela de la limite des 5s d'Aziz.
  // Ce sont de VRAIS gestes narratifs, pas du bruit decoratif ajoute pour occuper l'oeil.
  //
  // (a) 7.4s — la zone 2030 se signale brievement : on montre l'horizon dont on va parler.
  const horizonHint = interpolate(frame, [S(7.4), S(8.6), S(10.6)], [0, 1, 0.35], clampB);
  // (b) 23.5s — le sol se marque sous les conduites : "dans le sable ou sous la mer" approche.
  // Le sol se dessine PROGRESSIVEMENT et longuement (23.5 -> 29s) : c'est un geste continu qui
  // traverse la zone molle mesuree entre le pic des milliards (20.5s) et le decrochage (29.8s),
  // au lieu d'un flash instantane. Les hachures apparaissent une a une.
  const groundIn = interpolate(frame, [S(23.5), S(29.0)], [0, 1], clampB);
  // (c) 30.5s — la trainee de niveau du sommet des conduites se prolonge vers la droite, pendant que
  //     la courbe descend : l'ecart se CREUSE visiblement au lieu d'attendre le verdict.
  const gapGrow = interpolate(frame, [S(30.5), S(36.5)], [0, 1], clampB);

  const curvePath = useMemo(
    () => buildCurvePath(drop, frame, jitAmp, shrink),
    [drop, frame, jitAmp, shrink]
  );
  const areaPath = useMemo(
    () => buildAreaPath(drop, frame, jitAmp, shrink),
    [drop, frame, jitAmp, shrink]
  );

  const barTopVisible = barTop + buried * 0; // la barre garde son sommet ; seul le pied s'enfonce
  const barBottom = AXIS_Y + buried * 46;

  return (
    <AbsoluteFill style={{ backgroundColor: BG_BOT }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="c4bg" cx="50%" cy="42%" r="78%">
            <stop offset="0%" stopColor={BG_TOP} />
            <stop offset="100%" stopColor={BG_BOT} />
          </radialGradient>
          <linearGradient id="c4area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CYAN} stopOpacity={0.30} />
            <stop offset="100%" stopColor={CYAN} stopOpacity={0.02} />
          </linearGradient>
          {/* Barre : degrade LATERAL (volume) plutot qu'un aplat — l'argent a de la matiere. */}
          <linearGradient id="c4bar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={GOLD_DEEP} />
            <stop offset="38%" stopColor={GOLD} />
            <stop offset="72%" stopColor="#ffdd7a" />
            <stop offset="100%" stopColor={GOLD_DEEP} />
          </linearGradient>
          {/* Halo ambre : la masse d'argent rayonne, elle ne se contente pas d'occuper l'espace. */}
          <filter id="c4goldglow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="14" result="gb" />
            <feMerge>
              <feMergeNode in="gb" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="c4glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={W} height={H} fill="url(#c4bg)" />

        {/* ⛔ AUCUN SCALE DE CADRE (exigence Aziz 2026-08-16, version finale) : le punch au croisement
            et la respiration d'attente faisaient TREMBLER toute l'image. Un graphe premium ne tremble
            pas — le sens passe par les gestes des elements, jamais par une secousse du cadre. */}
        <g>
          {/* ---------- GRILLE DE REPERE ----------
              Corrige un defaut MESURE (downstream 2026-08-16) : le tiers superieur de l'ecran etait
              vide a 100% et tout le contenu tassé entre 50 et 80% de la hauteur. Ce n'etait pas du
              minimalisme mais un desequilibre de composition. La grille structure l'espace ET donne
              une echelle a la chute de la courbe (un graphe sans aucun repere fait amateur). */}
          {GRID_LEVELS.map((gy, i) => {
            const appear = interpolate(gridIn, [i * 0.12, i * 0.12 + 0.45], [0, 1], clampB);
            if (appear <= 0) return null;
            return (
              <line
                key={`grid${i}`}
                x1={PLOT_X0 - 60}
                y1={gy}
                x2={(PLOT_X0 - 60) + (PLOT_X1 + 60 - (PLOT_X0 - 60)) * appear}
                y2={gy}
                stroke={CYAN_EDGE}
                strokeWidth={1}
                strokeDasharray="4 10"
                opacity={0.13 * appear}
              />
            );
          })}
          {/* Repere d'echelle vertical (tirets discrets) : materialise l'axe Y implicite. */}
          {GRID_LEVELS.map((gy, i) => {
            const appear = interpolate(gridIn, [i * 0.12 + 0.2, i * 0.12 + 0.6], [0, 1], clampB);
            if (appear <= 0) return null;
            return (
              <line
                key={`ytick${i}`}
                x1={PLOT_X0 - 74}
                y1={gy}
                x2={PLOT_X0 - 60}
                y2={gy}
                stroke={CYAN_EDGE}
                strokeWidth={1.4}
                opacity={0.32 * appear}
              />
            );
          })}
          {/* ---------- AXE DU TEMPS ---------- */}
          <line
            x1={PLOT_X0 - 60}
            y1={AXIS_Y}
            x2={PLOT_X0 - 60 + (PLOT_X1 + 60 - (PLOT_X0 - 60)) * axisDraw}
            y2={AXIS_Y}
            stroke={CYAN_EDGE}
            strokeWidth={2.4}
            opacity={0.75}
          />

          {/* Graduations d'annees (rythme, aucune valeur chiffree inventee) */}
          {Array.from({ length: 11 }).map((_, i) => {
            const t = i / 10;
            const appear = interpolate(ticksIn, [i / 14, i / 14 + 0.25], [0, 1], clampB);
            const isEdge = i === 0 || i === 10;
            // Vague d'illumination sur le mot "calendrier" : le temps se REVEILLE, de gauche a droite.
            const wave = interpolate(calWave, [t * 0.55, t * 0.55 + 0.28, t * 0.55 + 0.6], [0, 1, 0], clampB);
            return (
              <line
                key={`tick${i}`}
                x1={xAt(t)}
                y1={AXIS_Y}
                x2={xAt(t)}
                y2={AXIS_Y + (isEdge ? 20 : 11) + wave * 9}
                stroke={CYAN_EDGE}
                strokeWidth={isEdge ? 2.2 : 1.2 + wave * 1.1}
                opacity={appear * ((isEdge ? 0.85 : 0.42) + wave * 0.5)}
              />
            );
          })}

          {/* (a) L'horizon 2030 se signale tot : on montre la zone dont la voix va parler. */}
          {horizonHint > 0 && (
            <rect
              x={xAt(0.86)}
              y={AXIS_Y - 560}
              width={PLOT_X1 - xAt(0.86)}
              height={560}
              fill={CYAN}
              opacity={horizonHint * 0.05}
            />
          )}

          {/* (b) Le SOL sous les conduites : elles sont enterrees, "dans le sable ou sous la mer". */}
          {groundIn > 0 && (() => {
            const N_HATCH = 14;
            const spanL = PLOT_X0 - BAR_W / 2 - 40;
            const spanR = PLOT_X0 + BAR_W / 2 + 190;
            return (
              <g>
                <line
                  x1={spanL}
                  y1={AXIS_Y + 30}
                  x2={spanL + (spanR - spanL) * groundIn}
                  y2={AXIS_Y + 30}
                  stroke={GOLD_DEEP}
                  strokeWidth={1.6}
                  opacity={0.5}
                />
                {Array.from({ length: N_HATCH }).map((_, i) => {
                  const p = i / (N_HATCH - 1);
                  const app = interpolate(groundIn, [p * 0.85, p * 0.85 + 0.14], [0, 1], clampB);
                  if (app <= 0) return null;
                  const x = spanL + (spanR - spanL) * p;
                  return (
                    <line
                      key={`hatch${i}`}
                      x1={x}
                      y1={AXIS_Y + 30}
                      x2={x - 14}
                      y2={AXIS_Y + 30 + 16 * app}
                      stroke={GOLD_DEEP}
                      strokeWidth={1.2}
                      opacity={0.42 * app}
                    />
                  );
                })}
              </g>
            );
          })()}

          {/* Zone 2030 qui s'allume quand la tete de lecture y arrive */}
          {zone2030 > 0 && (
            <rect
              x={xAt(0.86)}
              y={AXIS_Y - 300}
              width={PLOT_X1 - xAt(0.86)}
              height={300}
              fill={CYAN}
              opacity={zone2030 * 0.07}
            />
          )}

          {/* ---------- AIRE + COURBE (la demande, toujours vivante) ---------- */}
          {areaIn > 0 && (
            <>
              <clipPath id="c4areaClip">
                <rect
                  x={PLOT_X0}
                  y={0}
                  width={(PLOT_X1 - PLOT_X0) * Math.max(areaSweep, shrink > 0 ? 1 : areaSweep)}
                  height={H}
                />
              </clipPath>
              <path
                d={areaPath}
                fill="url(#c4area)"
                opacity={areaIn * (1 - shrink * 0.22)}
                clipPath="url(#c4areaClip)"
              />
            </>
          )}

          {/* CONTRACTION (remplace la plaque "UN MARCHÉ QUI RÉTRÉCIT") : un liseré clair court le long
              du sommet de la bande pendant qu'elle s'ecrase — le geste porte le mot. */}
          {shrinkSweep > 0 && shrinkSweep < 1 && (
            <path
              d={curvePath}
              fill="none"
              stroke="#ffffff"
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.5 * (1 - shrinkSweep)}
              strokeDasharray={`${240} ${2600}`}
              strokeDashoffset={2600 - 2840 * shrinkSweep}
            />
          )}

          {curveDraw > 0 && (
            <g opacity={curveDraw}>
              <path
                d={curvePath}
                fill="none"
                stroke={CYAN_EDGE}
                strokeWidth={4.2}
                strokeLinecap="round"
                filter="url(#c4glow)"
                strokeDasharray={curveDraw < 1 ? 2400 : undefined}
                strokeDashoffset={curveDraw < 1 ? 2400 * (1 - curveDraw) : undefined}
              />
            </g>
          )}

          {/* Trace fantome : le fournisseur qu'on remplace se retire par le haut/gauche */}
          {ghostOut > 0 && ghostOut < 1 && (
            <path
              d={`M${PLOT_X0},${CURVE_Y_HIGH - 34} L${PLOT_X1},${CURVE_Y_HIGH - 34}`}
              fill="none"
              stroke={GHOST}
              strokeWidth={2.6}
              strokeDasharray="10 12"
              opacity={(1 - ghostOut) * 0.6}
              transform={`translate(${-ghostOut * 220}, ${-ghostOut * 60})`}
            />
          )}

          {/* ---------- BARRE AMBRE : les milliards ---------- */}
          {stacked > 0.001 && (
            <g opacity={barOpacity}>
              {/* pied enterre sous l'axe (sable / mer) */}
              {/* DEUX CONDUITES, pas un bloc abstrait : la forme dit "deux gazoducs", et c'est ce qui
                  permet d'EN ETEINDRE UNE a la fin pour signifier la surcapacite (correction downstream
                  2026-08-16 — un petit carre ajoute ex nihilo etait juge cryptique, a raison). */}
              {[0, 1].map((k) => {
                const wPipe = (BAR_W - PIPE_GAP) / 2;
                const xPipe = PLOT_X0 - BAR_W / 2 + k * (wPipe + PIPE_GAP);
                // La 2e conduite s'eteint sur "un seul suffirait" : elle devient un contour vide.
                const off = k === 1 ? oneEnough : 0;
                return (
                  <g key={`pipe${k}`}>
                    <rect
                      x={xPipe}
                      y={barTopVisible}
                      width={wPipe}
                      height={Math.max(0, barBottom - barTopVisible)}
                      fill="url(#c4bar)"
                      rx={3}
                      opacity={1 - off * 0.88}
                      filter={off > 0.5 ? undefined : "url(#c4goldglow)"}
                    />
                    {off > 0.05 && (
                      <rect
                        x={xPipe}
                        y={barTopVisible}
                        width={wPipe}
                        height={Math.max(0, barBottom - barTopVisible)}
                        fill="none"
                        stroke={GOLD_DEEP}
                        strokeWidth={1.6}
                        strokeDasharray="6 7"
                        rx={3}
                        opacity={off * 0.75}
                      />
                    )}
                  </g>
                );
              })}
              {/* Separations + ONDE D'IMPACT a chaque tranche : l'argent TOMBE, on ne le lit pas.
                  C'est ce graphisme qui remplace la plaque "DES DIZAINES DE MILLIARDS" supprimee. */}
              {SLICES.map((f0, i) => {
                const s = sliceSprings[i];
                if (s < 0.05) return null;
                const yTop = interpolate(
                  sliceSprings.slice(0, i + 1).reduce((a, b) => a + b, 0) / SLICES.length,
                  [0, 1],
                  [AXIS_Y, BAR_TOP_FINAL],
                  clampB
                );
                const impact = interpolate(frame, [f0, f0 + S(0.55)], [1, 0], clampB);
                return (
                  <g key={`slice${i}`}>
                    {/* Une separation PAR conduite : ne jamais traverser l'ecart entre les deux. */}
                    {[0, 1].map((k) => {
                      const wPipe = (BAR_W - PIPE_GAP) / 2;
                      const xPipe = PLOT_X0 - BAR_W / 2 + k * (wPipe + PIPE_GAP);
                      return (
                        <line
                          key={`sl${i}-${k}`}
                          x1={xPipe}
                          y1={yTop}
                          x2={xPipe + wPipe}
                          y2={yTop}
                          stroke={BG_BOT}
                          strokeWidth={1.6}
                          opacity={0.5}
                        />
                      );
                    })}
                    {/* ⛔ Onde d'impact retiree : elle ajoutait un flash a chaque tranche. La montee
                        de la conduite (spring) suffit a faire sentir que l'argent tombe. */}
                  </g>
                );
              })}
              {/* VERROUILLAGE : le lisere se ferme — l'argent devient irreversible */}
              {lockIn > 0 && (
                <rect
                  x={PLOT_X0 - BAR_W / 2 - 6}
                  y={barTopVisible - 6}
                  width={BAR_W + 12}
                  height={Math.max(0, barBottom - barTopVisible) + 12}
                  fill="none"
                  stroke={GOLD}
                  strokeWidth={2}
                  rx={5}
                  opacity={lockIn * 0.9}
                  strokeDasharray={1400}
                  strokeDashoffset={1400 * (1 - lockIn)}
                />
              )}
              {/* ⛔ Halo pulsant et flash de verrouillage RETIRES (exigence Aziz, version finale).
                  Le verrouillage reste dit par le LISERE qui se ferme (trace continu, sans clignotement)
                  et par le fait que les conduites cessent definitivement de monter. */}
            </g>
          )}

          {/* (c) L'ECART SE CREUSE EN DIRECT : la ligne de niveau du sommet des conduites se prolonge
              vers la droite pendant que la courbe descend. Le spectateur VOIT l'ecart grandir au lieu
              de le decouvrir au verdict. (Comble un trou mesure de 9.5s entre 21s et 30s.) */}
          {gapGrow > 0 && gapMark <= 0 && (
            <line
              x1={PLOT_X0 + BAR_W / 2}
              y1={barTopVisible}
              x2={PLOT_X0 + BAR_W / 2 + (PLOT_X1 - PLOT_X0 - BAR_W) * 0.62 * gapGrow}
              y2={barTopVisible}
              stroke={GOLD}
              strokeWidth={1.2}
              strokeDasharray="5 11"
              opacity={0.42}
            />
          )}

          {/* Repere d'ECART (P4) : du sommet de la barre jusqu'au niveau reel du marche restant.
              C'est la mesure visuelle de "on a construit trop grand pour ce qui reste". */}
          {gapMark > 0 && (() => {
            const restTop = demandY(0.18, drop, shrink);
            const xEnd = PLOT_X0 + BAR_W / 2 + (PLOT_X1 - PLOT_X0) * 0.30;
            return (
              <g opacity={gapMark * 0.8}>
                <line
                  x1={PLOT_X0 + BAR_W / 2} y1={barTopVisible}
                  x2={xEnd} y2={barTopVisible}
                  stroke={GOLD} strokeWidth={1.4} strokeDasharray="7 9"
                />
                {/* fleche verticale : la hauteur perdue entre l'investissement et le marche reel */}
                <line
                  x1={xEnd - 30} y1={barTopVisible}
                  x2={xEnd - 30} y2={restTop}
                  stroke={GOLD} strokeWidth={1.6} opacity={0.9}
                />
                <line x1={xEnd - 36} y1={restTop - 9} x2={xEnd - 30} y2={restTop} stroke={GOLD} strokeWidth={1.6} />
                <line x1={xEnd - 24} y1={restTop - 9} x2={xEnd - 30} y2={restTop} stroke={GOLD} strokeWidth={1.6} />
              </g>
            );
          })()}

          {/* Un SEUL tuyau aurait suffi : un bloc ambre fin, de la HAUTEUR de ce qui reste du marche.
              Il se compare directement a la barre geante juste a cote — l'ecart EST le verdict. */}
          {/* "un seul suffirait" = UNE CONDUITE S'ETEINT (voir le bloc des 2 conduites plus haut).
              Le bloc ajoute ex nihilo qui vivait ici a ete SUPPRIME : introduire une forme neuve au
              dernier moment etait cryptique (downstream 2026-08-16). On eteint ce qui est deja la. */}

          {/* ---------- TETE DE LECTURE : le temps avance, toujours ---------- */}
          {anchorsIn > 0 && (
            <g opacity={anchorsIn}>
              <line
                x1={xAt(headT)}
                y1={AXIS_Y + 24}
                x2={xAt(headT)}
                y2={AXIS_Y - 330}
                stroke={CYAN_EDGE}
                strokeWidth={1.6}
                opacity={0.3}
              />
              <circle cx={xAt(headT)} cy={AXIS_Y} r={7} fill={CYAN_EDGE} opacity={0.9} />
              <circle cx={xAt(headT)} cy={AXIS_Y} r={15} fill="none" stroke={CYAN_EDGE} strokeWidth={1.2} opacity={0.35} />
            </g>
          )}

          {/* ---------- LE PIC : l'instant ou la courbe passe SOUS le sommet de la barre ----------
              Le marqueur se pose sur le POINT DE PASSAGE reel (intersection courbe / hauteur de la
              barre), jamais a un x arbitraire — sinon il flotte dans le vide (defaut v1 mesure). */}
          {crossFlash > 0 && crossed && (() => {
            // Le PIC n'est pas "la courbe est basse" — c'est l'endroit ou elle DECROCHE nettement
            // sous son niveau de depart. On mesure la ou elle a perdu 40% de sa chute totale.
            const yStart = CURVE_Y_HIGH;
            const yEnd = demandY(1, drop, shrink);
            const target = yStart + (yEnd - yStart) * 0.4;
            let tCross = 0.6;
            for (let i = 0; i <= 120; i++) {
              const t = i / 120;
              if (demandY(t, drop, shrink) >= target) { tCross = t; break; }
            }
            const yCross = demandY(tCross, drop, shrink);
            // Repere STABLE du point de bascule : il se pose et RESTE (plus de cercle qui enfle puis
            // disparait — c'etait un flash). Il monte en opacite une fois, sans clignoter.
            return (
              <g opacity={crossFlash * 0.9}>
                <circle cx={xAt(tCross)} cy={yCross} r={9}
                  fill={BG_BOT} stroke={CREAM} strokeWidth={2} opacity={0.9} />
              </g>
            );
          })()}

          {/* ---------- TEXTES (toujours en plaque, jamais flottants) ---------- */}
          {/* ⛔ REGLE DE TEXTE (exigence Aziz 2026-08-16) : le texte NOMME ce que l'image ne peut pas
              dire (un repere d'axe, l'identite d'une courbe, une source). Il ne REPETE JAMAIS la
              narration. Trois plaques ont ete SUPPRIMEES parce qu'elles doublaient la voix au meme
              instant ("DES DIZAINES DE MILLIARDS", "UN MARCHÉ QUI RÉTRÉCIT", "UN SEUL SUFFIRAIT") :
              c'etait du sous-titrage deguise. Leur fonction est reprise par le GRAPHISME (masse de
              la barre, contraction de la bande, comparaison des deux volumes ambre). */}
          <Plate x={PLOT_X0} y={AXIS_Y + 62} label="AUJOURD'HUI" appear={anchorsIn} />
          <Plate x={PLOT_X1} y={AXIS_Y + 62} label="2030" appear={anchorsIn} />
          <Plate x={xAt(0.60)} y={CURVE_Y_HIGH - 58} label="DEMANDE EUROPÉENNE" color={CYAN_EDGE} appear={areaIn} anchor="start" />
          {/* ⛔ Badge "AIE" RETIRE (decision Aziz 2026-08-16) : la voix cite deja l'Agence
              internationale de l'energie, l'ecrire n'apportait rien. Il ne reste que les textes
              indeductibles de l'image : AUJOURD'HUI, 2030, DEMANDE EUROPÉENNE. */}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default GazoducActe4Calendrier;
