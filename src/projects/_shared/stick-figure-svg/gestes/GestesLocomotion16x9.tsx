// R&D VAGUE 1 — LES GESTES / LOT "LOCOMOTION + POIDS" (2026-07-26).
//
// POURQUOI : le beat 4 du CFA a montre qu'une stick figure DE PROFIL s'anime remarquablement bien
// (marche, vacille, tombe, rebondit). Question d'Aziz : qu'est-ce que ce registre ouvre
// NARRATIVEMENT ? Cette planche teste 3 familles de gestes contre un critere unique :
//
//   ⛔ CRITERE ELIMINATOIRE : "si tu ne peux pas l'animer aussi bien qu'on l'a anime sur le CFA
//      — le faire marcher, lever les bras, s'il faut trembler — ce n'est pas la bonne voie."
//   => on juge le MOUVEMENT, jamais la beaute du dessin fige. Un perso qui GLISSE = echec.
//
// ACQUIS REPRIS DE LA REFERENCE (CfaActe4Filet16x9 > FunambuleProfil) :
//   hanche a hy = -26 - bob · bob = |cos(a)| * 2.5 · jambes en ciseau swing = sin(a)*17 deg ·
//   L = 34 · 2e jambe a opacity 0.75 (profondeur) · tete r=9 decalee cx=+3 (sens de marche) ·
//   strokeWidth 4.5 membres / 3.5-4 accessoires · strokeLinecap round · encre sur nuit.
//
// ⭐ LA DECOUVERTE DE CE LOT (la chose a retenir) : LE VERROU PAS/DISTANCE.
//   Dans la reference, le funambule avance par un interpolate de X independant de la phase de
//   marche. Ca passe parce que la vitesse est lente et le trajet court. Des qu'on change de
//   cadence (marche pressee, montee, arret), le decouplage se voit IMMEDIATEMENT : les pieds
//   patinent. Ici X est DERIVE de la phase :
//        x(t) = x0 + (nombre de pas ecoules) * (longueur d'un pas)
//   avec longueur d'un pas = 2 * L * sin(swingMax) — la vraie distance geometrique couverte par
//   l'ouverture du ciseau. Le pied ne peut plus patiner : c'est le pas qui produit le
//   deplacement, pas l'inverse. C'est CA qui fait la difference entre "il marche" et "il glisse".
//
// STRUCTURE : planche comparative en 3 bandes, chaque geste a taille reelle (74-110px de haut),
// etiquete en Georgia serif. Tout boucle ou se rejoue en continu -> jugeable a n'importe quelle
// frame. Aucun Math.random : toute variation est derivee de l'index ou de la frame.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const rad = (d: number) => (d * Math.PI) / 180;

// Palette identique a la reference CFA
const NUIT = "#22345c";
const NUIT2 = "#182746";
const ENCRE = "#f0e8d2";
const OR_CLAIR = "#d9a93a";
const CUIVRE = "#c17e3a";

export const GESTES_LOCOMOTION_FRAMES = S(27); // 27s

// ============================================================================
// LE MOTEUR DE MARCHE — parametre, verrou pas/distance integre
// ============================================================================
// L = longueur de jambe (34 = valeur de la reference).
const L = 34;
// distance horizontale couverte par UN pas complet, pour une ouverture de ciseau donnee.
// Geometrie : a l'ecart maximal, un pied est a +sin(swing)*L, l'autre a -sin(swing)*L.
// L'ecart entre les deux pieds = 2*L*sin(swing) = exactement ce que le corps avance par pas.
const stepLength = (swingDeg: number) => 2 * L * Math.sin(rad(swingDeg));

type WalkParams = {
  swingMax: number;   // amplitude du ciseau (deg) — grand pas vs petit pas
  bobAmp: number;     // amplitude du rebond vertical du bassin
  lean: number;       // inclinaison du buste (deg, + = penche en avant)
  hipDrop: number;    // abaissement de la hanche (px) — s'accroupir sous une charge
  armSwing: number;   // amplitude du balancement des bras (deg)
};

const WALK_DEFAULT: WalkParams = { swingMax: 17, bobAmp: 2.5, lean: 0, hipDrop: 0, armSwing: 22 };

// --------------------------------------------------------------------------
// LA FIGURE — un seul composant, pilote par (phase, params, override de pose)
// --------------------------------------------------------------------------
// phase in [0,1[ = ou on en est dans le cycle de marche. 1 cycle = 2 pas.
// pose = override optionnel pour les etats non-locomoteurs (au sol, en train de se relever).
type Pose = {
  hipY?: number;       // position verticale de la hanche (defaut: -26 - bob - hipDrop)
  torsoDeg?: number;   // angle du buste par rapport a la verticale (0 = debout)
  leg1Deg?: number;    // angle jambe avant (0 = pendante a la verticale)
  leg2Deg?: number;
  arm1Deg?: number;    // bras avant : angle depuis l'epaule (0 = pendant)
  arm2Deg?: number;
  arm1Len?: number;
  arm2Len?: number;
  headTuck?: number;   // rentre la tete vers le buste (rentrer la tete = encaisser)
  // ⭐ GENOU (ajoute pour le relevage par la position ASSISE — cf. GESTE 3).
  // Le registre est volontairement a SEGMENTS RIGIDES : c'est ce qui donne sa lisibilite a la
  // marche. Mais un relevage credible passe par l'assise, et l'assise est GEOMETRIQUEMENT
  // impossible sans genou : depuis une hanche a -4 (bassin au sol), une jambe rigide de 34 ne
  // touche le sol qu'a 83° d'ouverture, soit un pied a 34px devant = jambes etalees a plat, ni
  // assis ni capable de pousser. Avec un genou : genou releve a (14,-13.5), pied pose a (17.6,+3)
  // = la silhouette assise compacte (geometrie reprise de GestesExpressifs16x9, deja validee).
  // ⚠️ OPTIONNEL et INERTE par defaut : si leg1Knee/leg2Knee sont absents, la jambe reste UN SEUL
  // segment rigide de longueur L — la marche, la montee, le port et la poussee sont inchanges.
  leg1Knee?: number;   // flexion du genou avant (deg, 0 = jambe tendue)
  leg2Knee?: number;
  // ⭐ CIBLE DE MAIN (ajoute apres render) : au lieu de deviner un angle de bras et d'esperer
  // qu'il tombe sur la caisse, on donne le POINT (repere local du perso) que la main doit
  // atteindre. Le bras se tend vers lui. C'est ce qui supprime le "bras trop court qui ne touche
  // pas la charge" — le defaut le plus visible du premier render.
  hand1?: [number, number];
  hand2?: [number, number];
};

const Figure: React.FC<{
  x: number;
  y: number;              // y = le SOL sous les pieds
  phase: number;
  p?: Partial<WalkParams>;
  pose?: Pose;
  rotate?: number;        // rotation globale du corps (chute)
  color?: string;
  opacity?: number;
  scale?: number;
}> = ({ x, y, phase, p, pose = {}, rotate = 0, color = ENCRE, opacity = 1, scale = 1 }) => {
  const P = { ...WALK_DEFAULT, ...p };
  const a = phase * Math.PI * 2;
  const swing = Math.sin(a) * P.swingMax;
  const bob = Math.abs(Math.cos(a)) * P.bobAmp;

  // hanche (repere local : y negatif = vers le haut, le sol est a y=0)
  // ⚠️ BUG CORRIGE (vu au render) : hipDrop etait soustrait de hy, ce qui REMONTAIT la hanche
  // et donc DECOLLAIT les pieds du sol (le perso planait au-dessus de sa ligne). S'accroupir,
  // c'est descendre : hipDrop doit RAPPROCHER la hanche du sol -> on l'ADDITIONNE (y vers le bas).
  const hx = 0;
  const hy = pose.hipY !== undefined ? pose.hipY : -26 - bob + P.hipDrop;

  // jambes en ciseau. Angle mesure depuis la verticale descendante.
  // ⚠️ 2e correction : la longueur de jambe doit s'ADAPTER pour que le pied touche TOUJOURS le
  // sol (y=0) quel que soit le bob / le hipDrop. Sinon le pied flotte ou s'enfonce a chaque pas.
  // On resout : hy + cos(angle)*Leff = 0  ->  Leff = -hy / cos(angle), borne pour rester credible.
  const l1 = pose.leg1Deg !== undefined ? pose.leg1Deg : swing;
  const l2 = pose.leg2Deg !== undefined ? pose.leg2Deg : -swing;
  const legLen = (deg: number) => {
    if (pose.leg1Deg !== undefined || pose.leg2Deg !== undefined) return L; // poses manuelles : longueur fixe
    const c = Math.cos(rad(deg));
    if (c < 0.2) return L;
    return Math.max(L * 0.72, Math.min(L * 1.06, -hy / c));
  };
  const L1 = legLen(l1);
  const L2 = legLen(l2);
  // Genou optionnel : sans flexion, on garde UN segment (hanche -> pied) — comportement
  // historique strictement identique. Avec flexion, la jambe devient 2 os de L/2 chacun.
  const k1 = pose.leg1Knee ?? 0;
  const k2 = pose.leg2Knee ?? 0;
  const jambe = (deg: number, flex: number, len: number) => {
    if (flex === 0) {
      const ex = hx + Math.sin(rad(deg)) * len;
      const ey = hy + Math.cos(rad(deg)) * len;
      return { kx: ex, ky: ey, ex, ey, plie: false };
    }
    const kx = hx + Math.sin(rad(deg)) * (len / 2);
    const ky = hy + Math.cos(rad(deg)) * (len / 2);
    const ex = kx + Math.sin(rad(deg + flex)) * (len / 2);
    const ey = ky + Math.cos(rad(deg + flex)) * (len / 2);
    return { kx, ky, ex, ey, plie: true };
  };
  const J1 = jambe(l1, k1, L1);
  const J2 = jambe(l2, k2, L2);
  const j1x = J1.ex, j1y = J1.ey;
  const j2x = J2.ex, j2y = J2.ey;

  // buste : de la hanche vers l'epaule. lean incline tout le haut du corps.
  const torso = pose.torsoDeg !== undefined ? pose.torsoDeg : P.lean;
  const torsoLen = 32;
  const sx = hx + Math.sin(rad(torso)) * torsoLen;
  const sy = hy - Math.cos(rad(torso)) * torsoLen;

  // tete : dans le prolongement du buste, legerement en avant (sens de la marche)
  const tuck = pose.headTuck ?? 0;
  const headLen = 12 - tuck * 7;
  const headCx = sx + Math.sin(rad(torso)) * headLen + 3 * Math.cos(rad(torso));
  const headCy = sy - Math.cos(rad(torso)) * headLen + 3 * Math.sin(rad(torso));

  // bras : contre-balancement (oppose aux jambes) — c'est ce qui rend la marche "vivante"
  // ⚠️ BUG CORRIGE (vu au render sur MONTEE) : les angles de bras etaient additionnes au `torso`.
  // Des que le buste se penchait (montee, pousser), les bras se REPLIAIENT dans le corps et le
  // perso se ratatinait en batonnet. Comme les jambes, les bras pendent par rapport a la GRAVITE,
  // pas par rapport au buste : ils s'ancrent a l'epaule mais gardent leur reference verticale.
  // Seules les poses MANUELLES (tenir un sac, pousser une caisse) restent solidaires du buste,
  // parce que la charge, elle, est bien tenue dans le repere du corps.
  const armLen1 = pose.arm1Len ?? 28;
  const armLen2 = pose.arm2Len ?? 28;
  const manuel1 = pose.arm1Deg !== undefined;
  const manuel2 = pose.arm2Deg !== undefined;
  const a1 = manuel1 ? (pose.arm1Deg as number) + torso : -Math.sin(a) * P.armSwing;
  const a2 = manuel2 ? (pose.arm2Deg as number) + torso : Math.sin(a) * P.armSwing;
  // la cible de main, si fournie, GAGNE sur l'angle : la main se pose sur la charge.
  const b1x = pose.hand1 ? pose.hand1[0] : sx + Math.sin(rad(a1)) * armLen1;
  const b1y = pose.hand1 ? pose.hand1[1] : sy + Math.cos(rad(a1)) * armLen1;
  const b2x = pose.hand2 ? pose.hand2[0] : sx + Math.sin(rad(a2)) * armLen2;
  const b2y = pose.hand2 ? pose.hand2[1] : sy + Math.cos(rad(a2)) * armLen2;

  // ⭐ CALAGE AU SOL (ajoute apres render) : en pose couchee, le corps entier flottait AU-DESSUS
  // de sa ligne de sol — parce que la Figure est ancree par la HANCHE, ce qui n'a de sens que
  // debout. Couche, c'est le FLANC qui touche. Regle generique : on mesure le point le plus bas
  // du corps et on decale tout pour qu'il repose exactement sur y=0. Vaut pour n'importe quelle
  // pose, sans avoir a recalculer chaque angle a la main.
  const posesManuelles = pose.hipY !== undefined;
  const bas = Math.max(j1y, j2y, J1.ky, J2.ky, sy, headCy + 9, b1y, b2y);
  const calage = posesManuelles && bas < 0 ? -bas : 0;

  return (
    <g transform={`translate(${x} ${y + calage}) scale(${scale}) rotate(${rotate})`} opacity={opacity}>
      {/* jambe arriere + bras arriere en premier (opacity 0.75 = profondeur, cf. reference) */}
      <line x1={hx} y1={hy} x2={J2.kx} y2={J2.ky} stroke={color} strokeWidth={4.5} strokeLinecap="round" opacity={0.75} />
      {J2.plie && (
        <line x1={J2.kx} y1={J2.ky} x2={j2x} y2={j2y} stroke={color} strokeWidth={4.5} strokeLinecap="round" opacity={0.75} />
      )}
      <line x1={sx} y1={sy} x2={b2x} y2={b2y} stroke={color} strokeWidth={4} strokeLinecap="round" opacity={0.75} />
      {/* buste */}
      <line x1={hx} y1={hy} x2={sx} y2={sy} stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      {/* jambe avant + bras avant */}
      <line x1={hx} y1={hy} x2={J1.kx} y2={J1.ky} stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      {J1.plie && (
        <line x1={J1.kx} y1={J1.ky} x2={j1x} y2={j1y} stroke={color} strokeWidth={4.5} strokeLinecap="round" />
      )}
      <line x1={sx} y1={sy} x2={b1x} y2={b1y} stroke={color} strokeWidth={4} strokeLinecap="round" />
      {/* tete */}
      <circle cx={headCx} cy={headCy} r={9} fill={color} />
    </g>
  );
};

// --------------------------------------------------------------------------
// Etiquette sobre (Georgia serif, comme la reference)
// --------------------------------------------------------------------------
const Etiquette: React.FC<{ x: number; y: number; label: string; sub?: string; op?: number }> = ({
  x, y, label, sub, op = 1,
}) => (
  <g opacity={op}>
    <text x={x} y={y} textAnchor="middle" fontFamily="Georgia, serif" fontSize={23} fill={ENCRE}
      letterSpacing={2.5} opacity={0.85}>{label}</text>
    {sub && (
      <text x={x} y={y + 25} textAnchor="middle" fontFamily="Georgia, serif" fontSize={16} fill={ENCRE}
        letterSpacing={1.4} opacity={0.42} fontStyle="italic">{sub}</text>
    )}
  </g>
);

// ligne de sol discrete (elle donne l'echelle et prouve que les pieds ne patinent pas)
const Sol: React.FC<{ y: number; x0: number; x1: number; op?: number }> = ({ y, x0, x1, op = 0.28 }) => (
  <line x1={x0} y1={y} x2={x1} y2={y} stroke={ENCRE} strokeWidth={1.6} opacity={op} />
);

// ============================================================================
// GESTE 1 — MARCHER, 5 VARIANTES
// ============================================================================
// Chaque variante a sa propre cadence et sa propre amplitude de pas. Le deplacement X est
// DERIVE de la phase (verrou pas/distance) : cadence * longueur de pas = vitesse reelle.
// Boucle : quand le perso sort du couloir, il rentre par la gauche (modulo sur la distance).
type VarianteMarche = {
  label: string;
  sub: string;
  cadence: number;        // cycles de marche par seconde (1 cycle = 2 pas)
  p: Partial<WalkParams>;
  slope: number;          // pente du sol (deg) — montee / descente
  couloir: [number, number];
};

const VARIANTES: VarianteMarche[] = [
  {
    label: "MARCHE LENTE",
    sub: "cadence 0,55 Hz · pas ample",
    cadence: 0.55, p: { swingMax: 16, bobAmp: 2.4, armSwing: 18 }, slope: 0, couloir: [90, 400],
  },
  {
    label: "MARCHE PRESSÉE",
    sub: "cadence 1,45 Hz · buste en avant",
    cadence: 1.45, p: { swingMax: 21, bobAmp: 4.2, lean: 9, armSwing: 38 }, slope: 0, couloir: [440, 760],
  },
  {
    label: "MONTÉE",
    sub: "pente 11° · buste plongé, pas qui poussent",
    // ⚠️ swingMax remonte de 13 -> 17 apres render : a 13 les 2 jambes se superposaient et le
    // perso se lisait comme un batonnet immobile. La montee ne se dit PAS par des mini-pas ;
    // elle se dit par le buste plonge + la cadence lente + la ligne de sol.
    cadence: 0.72, p: { swingMax: 17, bobAmp: 3.4, lean: 16, hipDrop: 3, armSwing: 30 }, slope: -11, couloir: [810, 1120],
  },
  {
    label: "DESCENTE",
    sub: "pente 11° · buste en arrière, retenue",
    cadence: 0.72, p: { swingMax: 19, bobAmp: 1.6, lean: -8, hipDrop: 4, armSwing: 26 }, slope: 11, couloir: [1180, 1490],
  },
];

const BandeMarche: React.FC<{ frame: number; solY: number }> = ({ frame, solY }) => {
  const t = frame / FPS;
  return (
    <g>
      {VARIANTES.map((v, i) => {
        const [c0, c1] = v.couloir;
        const largeur = c1 - c0;
        // phase de marche continue
        const phase = (t * v.cadence) % 1;
        // ⭐ VERROU PAS/DISTANCE : distance = (cycles ecoules) * 2 pas * longueur d'un pas.
        // La vitesse n'est JAMAIS choisie a la main — elle tombe de la cadence et de l'amplitude.
        const pasParCycle = 2;
        const dist = t * v.cadence * pasParCycle * stepLength(v.p.swingMax ?? 17);
        // boucle dans le couloir. Le modulo est sur la DISTANCE, donc le pas reste continu.
        const x = c0 + ((dist % (largeur + 90)) );
        const visible = x < c1 + 40;
        // le sol est incline pour la montee/descente : le perso suit EXACTEMENT la ligne de sol
        // (meme formule que la ligne tracee plus bas, pente centree sur le couloir).
        const dx = x - c0;
        const y = solY + Math.tan(rad(v.slope)) * (dx - largeur / 2);
        return (
          <g key={i}>
            {/* le sol incline lui-meme — c'est lui qui DIT la pente, pas le personnage.
                La pente est CENTREE sur le couloir (elle monte a gauche et descend a droite
                d'autant) : sans ca la ligne debordait dans le couloir voisin au render. */}
            <line
              x1={c0} y1={solY - (Math.tan(rad(v.slope)) * largeur) / 2}
              x2={c1} y2={solY + (Math.tan(rad(v.slope)) * largeur) / 2}
              stroke={ENCRE} strokeWidth={1.6} opacity={0.28} />
            {visible && (
              // ⚠️ le perso ne pivote PAS avec la pente : un marcheur reste vertical par rapport
              // a la GRAVITE. Ce qui dit la montee, c'est le buste plonge (lean) + les pas
              // courts + la ligne de sol inclinee — pas une figure couchee sur le cote.
              <Figure x={x} y={y} phase={phase} p={v.p} />
            )}
            <Etiquette x={(c0 + c1) / 2} y={solY + 74} label={v.label} sub={v.sub} />
          </g>
        );
      })}
      {/* 5e variante : S'ARRETER NET — traitee a part, elle a besoin d'un cycle propre */}
      <ArretNet frame={frame} solY={solY} x0={1580} x1={1760} />
    </g>
  );
};

// --------------------------------------------------------------------------
// S'ARRETER NET — le test de la deceleration credible
// --------------------------------------------------------------------------
// Le piege : figer la phase => le perso se transforme en statue au milieu d'un pas (freeze).
// Ce qu'on fait : on decelere la PHASE elle-meme (integrale d'une cadence qui tombe a 0), donc
// les pas se raccourcissent et se rapprochent, et le corps s'arrete SUR un appui. On ajoute
// l'inertie du haut du corps : le buste continue vers l'avant puis revient (contre-mouvement).
const ArretNet: React.FC<{ frame: number; solY: number; x0: number; x1: number }> = ({ frame, solY, x0, x1 }) => {
  const CYCLE = S(4.2);
  const f = frame % CYCLE;
  const t = f / FPS;
  const T_STOP = 1.9;       // debut du freinage
  const T_ARRET = 2.6;      // pied pose, immobile

  // cadence(t) : 1.15 Hz puis descend a 0 entre T_STOP et T_ARRET
  const cad0 = 1.15;
  const cadence = t < T_STOP ? cad0 : interpolate(t, [T_STOP, T_ARRET], [cad0, 0], { ...clamp, easing: (u) => 1 - Math.pow(1 - u, 2) });
  // phase = INTEGRALE de la cadence (analytique, deterministe — pas d'accumulation frame a frame,
  // sinon le rendu depend de l'ordre de calcul des frames, ce qui casse le determinisme Remotion).
  const phaseInt = (u: number) => {
    if (u <= T_STOP) return cad0 * u;
    const d = Math.min(u, T_ARRET) - T_STOP;
    const span = T_ARRET - T_STOP;
    // integrale de cad0*(1-(1-(d/span))^2 inverse) -> on integre la rampe ease-out
    // cadence(d) = cad0 * (1 - (1 - (1 - d/span))^2) ... simplifie : cad0 * (1 - d/span)^2 approx.
    const k = d / span;
    const integ = cad0 * span * (k - k * k + (k * k * k) / 3);
    const apres = u > T_ARRET ? 0 : 0;
    return cad0 * T_STOP + integ + apres;
  };
  const phase = phaseInt(t) % 1;
  const arrete = t >= T_ARRET;

  // distance derivee de la phase (meme verrou)
  const swingMax = 18;
  const dist = phaseInt(t) * 2 * stepLength(swingMax);
  const x = x0 + Math.min(dist, x1 - x0 + 20);

  // INERTIE DU HAUT DU CORPS : au moment ou les pieds s'arretent, le buste part en avant
  // puis revient. C'est ce contre-mouvement qui rend l'arret credible (sinon = freeze).
  const inertie = interpolate(t, [T_STOP + 0.15, T_ARRET, T_ARRET + 0.45, T_ARRET + 1.0],
    [0, 13, -4, 0], clamp);

  // ⚠️ DEFAUT CORRIGE (signale par Aziz au visionnage) : "il se retrouve a lever les mains en
  // l'air". Cause racine = une CONFUSION DE CONVENTION D'ANGLE, pas un reglage.
  // Dans Figure, la main est posee a  y = sy + cos(angle) * armLen  : cos(0) = +1 place donc la
  // main SOUS l'epaule (bras pendant), et cos(180) = -1 la place AU-DESSUS (bras leve).
  // Les valeurs 172/186 avaient ete ecrites avec la convention INVERSE (celle de
  // GestesExpressifs, ou 180 = tendu vers le haut) : cos(172°) = -0.99 -> la main finissait
  // 28px AU-DESSUS de l'epaule, soit deux "oreilles" verticales au-dessus de la tete.
  // Un bras qui pend = angle proche de 0. On garde un tres leger ecart au corps (8° / -8°) pour
  // que les deux bras ne se confondent pas en un seul trait.
  //
  // + BALANCEMENT RESIDUEL AMORTI : les bras ne se figent pas a l'instant de l'arret. Ils
  // continuent d'osciller sur leur elan et s'eteignent en ~1.2s (pendule amorti). C'est ce qui
  // fait la difference entre "il s'arrete" et "on a coupe le courant".
  const dtArret = t - T_ARRET;
  const balanResiduel = arrete
    ? Math.cos(dtArret * 7.6) * 15 * Math.exp(-dtArret * 2.6)
    : 0;

  // a l'arret : appui stable, jambes legerement ecartees, bras qui retombent LE LONG DU CORPS
  const posePlantee: Pose | undefined = arrete
    ? {
        hipY: -26 - 1.2,
        torsoDeg: inertie,
        leg1Deg: 7,
        leg2Deg: -7,
        arm1Deg: 8 + balanResiduel - inertie * 0.35,
        arm2Deg: -8 + balanResiduel * 0.85 - inertie * 0.35,
      }
    : { torsoDeg: inertie };

  return (
    <g>
      <Sol y={solY} x0={x0 - 30} x1={x1 + 60} />
      <Figure x={x} y={solY} phase={phase} p={{ swingMax, bobAmp: 2.8, armSwing: 24 }} pose={posePlantee} />
      <Etiquette x={(x0 + x1) / 2 + 40} y={solY + 74} label="S'ARRÊTER NET" sub="décélération + inertie du buste" />
    </g>
  );
};

// ============================================================================
// GESTE 2 — PORTER / POUSSER / TIRER (le test le plus dur : le POIDS)
// ============================================================================
// Principe : le poids ne se dessine pas, il se DEDUIT de la posture. 4 marqueurs cumules :
//   1. buste penche (vers l'avant si on pousse/porte devant, en arriere si on tire)
//   2. hanche abaissee (hipDrop) = les jambes encaissent
//   3. pas plus courts (swingMax reduit) => et donc, par le verrou, une vitesse plus lente
//      AUTOMATIQUEMENT — on ne ralentit pas a la main, c'est la charge qui ralentit
//   4. bob ECRASE (le corps ne rebondit plus, il est plaque au sol)
// + un 5e marqueur cle : la charge suit EXACTEMENT le meme x que le perso (aucun decalage), et
//   elle a une micro-oscillation en retard de phase (elle "pese" a chaque pas).

const BandePoids: React.FC<{ frame: number; solY: number }> = ({ frame, solY }) => {
  const t = frame / FPS;

  // ---- 2a. PORTER un sac sur l'epaule ----
  const porterCad = 0.5;
  const porterSwing = 15;
  const phP = (t * porterCad) % 1;
  const distP = t * porterCad * 2 * stepLength(porterSwing);
  const xP = 140 + (distP % 480);
  const aP = phP * Math.PI * 2;
  // le sac pese : il s'enfonce dans l'epaule a chaque appui, en RETARD de phase (inertie)
  const sacBob = Math.abs(Math.cos(aP - 0.7)) * 3.2;

  // ---- 2b. POUSSER une caisse ----
  const pousserCad = 0.42;   // cadence basse = c'est LA charge qui ralentit, pas un reglage a la main
  const pousserSwing = 16;   // aligne sur le swingMax reel de la Figure (verrou pas/distance)
  const phPo = (t * pousserCad) % 1;
  const distPo = t * pousserCad * 2 * stepLength(pousserSwing);
  const xPo = 740 + (distPo % 460);
  const aPo = phPo * Math.PI * 2;
  // la caisse n'avance pas regulierement : elle est POUSSEE par a-coups, un par appui.
  // Sans ca elle "flotte" devant le perso. Le sursaut est cale sur la poussee du pied arriere.
  const acoup = Math.max(0, Math.sin(aPo)) * 2.4;

  // ---- 2c. TIRER une caisse ----
  const tirerCad = 0.38;
  const tirerSwing = 16;   // aligne sur le swingMax reel de la Figure
  const phT = (t * tirerCad) % 1;
  const distT = t * tirerCad * 2 * stepLength(tirerSwing);
  const xT = 1340 + (distT % 470);
  const aT = phT * Math.PI * 2;
  const acoupT = Math.max(0, Math.sin(aT + Math.PI)) * 2.6;

  // ⚠️ CAISSE agrandie apres render : a 34px elle etait plus petite que la tete du perso et se
  // lisait comme un petit carre decoratif, pas comme une charge. 46px = a hauteur de hanche.
  const CAISSE = 46;

  return (
    <g>
      {/* ===== PORTER ===== */}
      <Sol y={solY} x0={110} x1={650} />
      <g>
        {(() => {
          // ⚠️ Le sac flottait detache au-dessus de l'epaule au 1er render. On calcule
          // l'epaule EXACTEMENT comme le fait Figure (meme formule), et on POSE le sac dessus.
          const lean = -7, hipDrop = 4;
          const bob = Math.abs(Math.cos(aP)) * 1.1;
          const hy = -26 - bob + hipDrop;
          const sxL = Math.sin(rad(lean)) * 32;
          const syL = hy - Math.cos(rad(lean)) * 32;
          // ⚠️ CORRIGE apres render : le sac se dessinait a hauteur de TETE et l'encerclait
          // comme un anneau. Un sac porte se cale sur le HAUT DU DOS, derriere l'epaule et
          // NETTEMENT sous la tete. On le descend et on le recule.
          const sacCx = sxL - 20;                 // derriere (le perso marche vers la droite)
          const sacCy = syL + 6 + sacBob;         // sous la ligne d'epaule
          const sacR = 13;
          return (
            <>
              {/* le sac EN PREMIER : le bras passera devant, ce qui dit "il le retient" */}
              <g transform={`translate(${xP} ${solY})`}>
                <path
                  d={`M ${sacCx - sacR} ${sacCy - sacR * 0.2}
                      q ${-2} ${-sacR * 1.5} ${sacR} ${-sacR * 1.35}
                      q ${sacR * 1.6} ${-0.5} ${sacR * 1.15} ${sacR * 1.2}
                      q ${-0.5} ${sacR * 1.15} ${-sacR * 1.2} ${sacR * 0.95} z`}
                  fill="none" stroke={CUIVRE} strokeWidth={3.4} strokeLinejoin="round" />
                {/* la sangle : du sac vers l'epaule — le lien visible charge/porteur */}
                <line x1={sacCx + sacR * 0.5} y1={sacCy - sacR * 1.1} x2={sxL + 2} y2={syL + 3}
                  stroke={CUIVRE} strokeWidth={2.4} strokeLinecap="round" opacity={0.85} />
              </g>
              <Figure
                x={xP} y={solY} phase={phP}
                p={{ swingMax: porterSwing, bobAmp: 1.1, lean, hipDrop, armSwing: 9 }}
                pose={{
                  // la main qui retient le sac VA CHERCHER le sac (cible de main) : plus de
                  // bras trop court dans le vide.
                  hand1: [sacCx + sacR * 0.35, sacCy - sacR * 0.5],
                  // l'autre bras contrebalance largement (contre-appui)
                  arm2Deg: 34 + Math.sin(aP) * 18, arm2Len: 29,
                }}
              />
            </>
          );
        })()}
      </g>
      <Etiquette x={380} y={solY + 74} label="PORTER" sub="épaule chargée, buste contre-penché" />

      {/* ===== POUSSER ===== */}
      <Sol y={solY} x0={710} x1={1250} />
      <g>
        {(() => {
          const caisseX = xPo + 52 + acoup;
          // les 2 mains se posent sur la FACE ARRIERE de la caisse, a 2 hauteurs differentes
          // (une main haute, une main basse) : c'est ce qui dit "il s'arc-boute dessus".
          const faceX = caisseX - CAISSE / 2 - xPo; // en repere local du perso
          return (
            <>
              {/* la caisse, poussee par a-coups (un par appui) */}
              <g transform={`translate(${caisseX} ${solY})`}>
                <rect x={-CAISSE / 2} y={-CAISSE} width={CAISSE} height={CAISSE} fill="none"
                  stroke={OR_CLAIR} strokeWidth={3.5} strokeLinejoin="round" />
                <line x1={-CAISSE / 2} y1={-CAISSE * 0.62} x2={CAISSE / 2} y2={-CAISSE * 0.62}
                  stroke={OR_CLAIR} strokeWidth={2} opacity={0.6} />
              </g>
              <Figure
                x={xPo} y={solY} phase={phPo}
                // ⚠️ swingMax remonte a 16 : a 11 les 2 jambes se superposaient en une seule
                // ligne et le perso ne marchait plus du tout (defaut n°1 du render).
                p={{ swingMax: 16, bobAmp: 0.8, lean: 30, hipDrop: 3, armSwing: 0 }}
                pose={{
                  hand1: [faceX, -CAISSE * 0.82],
                  hand2: [faceX - 2, -CAISSE * 0.5],
                  headTuck: 0.3,
                }}
              />
            </>
          );
        })()}
      </g>
      <Etiquette x={980} y={solY + 74} label="POUSSER" sub="30° de buste, caisse par à-coups" />

      {/* ===== TIRER ===== */}
      <Sol y={solY} x0={1310} x1={1850} />
      <g>
        {(() => {
          const caisseX = xT - 78 - acoupT;
          const faceX = caisseX + CAISSE / 2 - xT; // repere local
          // la main tient la corde derriere le corps ; la corde va de la main a la caisse.
          const mainX = -30, mainY = -34;
          // mou de la corde : elle se detend quand il n'est pas en phase de traction
          const mou = 6 * (1 - Math.max(0, Math.sin(aT + Math.PI)));
          return (
            <>
              {/* la caisse est DERRIERE : elle traine, en retard */}
              <g transform={`translate(${caisseX} ${solY})`}>
                <rect x={-CAISSE / 2} y={-CAISSE} width={CAISSE} height={CAISSE} fill="none"
                  stroke={OR_CLAIR} strokeWidth={3.5} strokeLinejoin="round" />
                <line x1={-CAISSE / 2} y1={-CAISSE * 0.62} x2={CAISSE / 2} y2={-CAISSE * 0.62}
                  stroke={OR_CLAIR} strokeWidth={2} opacity={0.6} />
              </g>
              {/* la corde : de la caisse a la main. Elle se detend legerement hors traction —
                  c'est ce mou qui montre l'effort par a-coups. */}
              <path
                d={`M ${xT + faceX} ${solY - CAISSE * 0.66}
                    Q ${xT + (faceX + mainX) / 2} ${solY + (-CAISSE * 0.66 + mainY) / 2 + mou}
                      ${xT + mainX} ${solY + mainY}`}
                fill="none" stroke={CUIVRE} strokeWidth={2.8} strokeLinecap="round" />
              <Figure
                x={xT} y={solY} phase={phT}
                // swingMax remonte (meme defaut que POUSSER) + lean negatif = il se couche en arriere
                p={{ swingMax: 16, bobAmp: 0.9, lean: -21, hipDrop: 4, armSwing: 0 }}
                pose={{
                  // les 2 mains tiennent la corde derriere : le corps fait contrepoids
                  hand1: [mainX, mainY],
                  hand2: [mainX - 5, mainY + 5],
                }}
              />
            </>
          );
        })()}
      </g>
      <Etiquette x={1580} y={solY + 74} label="TIRER" sub="contrepoids arrière, corde qui se détend" />
    </g>
  );
};

// ============================================================================
// GESTE 3 — TOMBER ET SE RELEVER, SANS FILET
// ============================================================================
// Difference avec le beat CFA : la-bas la chute etait RATTRAPEE (spring vers le filet). Ici il
// touche le sol, et surtout il DOIT SE RELEVER — c'est le geste neuf.
//
// ⭐⭐ REECRIT SUR RETOUR D'AZIZ (visionnage) — deux defauts, deux causes distinctes :
//
//   (1) "quand il tombe il y a les bras qui se levent en arriere donc il plante face premiere".
//       Exact, et verifie a la frame : les bras partaient VERS L'ARRIERE ET VERS LE HAUT pendant
//       la chute. C'est l'inverse du reflexe reel. Une chute vers l'avant declenche le REFLEXE
//       PARACHUTE : les bras se jettent EN AVANT, mains ouvertes devant le visage, pour amortir.
//       Ce sont les mains qui touchent en premier, JAMAIS la tete. Corrige : dans P_CHUTE puis
//       P_SOL, les deux mains sont projetees devant (x ~ +59), au niveau du sol.
//
//   (2) "la maniere dont il se releve n'est pas tout a fait optimale [...] peut-etre un genou qui
//       se flanche ou il se releve en utilisant la position assise". C'est la piste retenue.
//       Un relevage reel ne part PAS du ventre directement a la verticale : on se pousse sur un
//       bras, on passe par l'ASSISE, on ramene un genou sous soi, et c'est cette jambe qui pousse.
//
// LA METHODE (reprise du predecesseur, elle est bonne) : des POSES-CLES EXPLICITES, chacune une
// silhouette valide verifiee PAR LE CALCUL (position de chaque articulation dans le repere local,
// contact au sol a y=0), reliees par un fondu SEQUENTIEL. Jamais d'accumulation de ressorts sur
// les memes angles : ca derive et ca ne retombe jamais debout.
//
// LA CHAINE : DEBOUT -> CHUTE (bras devant) -> SOL (a plat) -> APPUI (pousse sur les bras)
//             -> ASSIS (geometrie de GestesExpressifs) -> GENOU (un genou au sol) -> DEBOUT
const BandeChute: React.FC<{ frame: number; solY: number; fps: number }> = ({ frame, solY, fps }) => {
  // cycle allonge (6.0 -> 8.2s) : l'assise et la mise a genoux ont besoin de temps pour se LIRE.
  // Precipitees, elles repassent en "pantin qui se deplie", exactement ce qu'on corrige.
  const CYCLE = S(8.2);
  const f = frame % CYCLE;
  const t = f / FPS;

  const X = W / 2;

  // --- PHASE A : il marche (0 -> 1.1s) ---
  const cad = 0.85;
  const swingMax = 17;
  const T_TREBUCHE = 1.1;
  const T_SOL = 1.75;
  const T_INERTE = 2.6;   // il reste au sol, inerte (le temps mort qui dit l'encaissement)
  const T_APPUI = 3.0;    // il se pousse sur les bras
  const T_ASSIS = 3.9;    // il bascule en position ASSISE (le pivot du relevage)
  const T_GENOU = 5.1;    // un genou se ramene sous lui et prend appui
  const T_DEBOUT = 6.1;   // il se redresse
  const T_REPART = 6.9;

  const phaseMarche = (Math.min(t, T_TREBUCHE) * cad) % 1;
  const distA = Math.min(t, T_TREBUCHE) * cad * 2 * stepLength(swingMax);

  // --- PHASE B : la chute (spring, atterrissage amorti — acquis du beat CFA) ---
  // ⚠️ RALENTIE (verifie a la frame) : avec stiffness 130 la chute etait bouclee en ~5 frames.
  // Le reflexe parachute existait dans les angles mais ne se VOYAIT pas — il faut ~0.6s pour lire
  // le basculement + les bras qui se jettent devant. Masse plus lourde, ressort plus doux.
  const chute = spring({
    frame: f - S(T_TREBUCHE), fps,
    config: { mass: 2.2, damping: 20, stiffness: 62 },
  });
  const estTombe = t >= T_TREBUCHE;
  // il continue sur sa lancee en tombant (une chute n'annule pas l'elan)
  const glissade = estTombe ? interpolate(chute, [0, 1], [0, 34], clamp) : 0;

  // --- PHASE C : le relevage. Un ressort par ETAPE, jamais deux qui se somment sur un angle. ---
  // Les raideurs disent le CARACTERE de chaque etape : se pousser sur les bras est vif (stiffness
  // haute), basculer en assise est lourd (mass haute, damping haut : le corps pese), la poussee
  // sur le genou est franche, le redressement final est ample.
  const sAppui = spring({ frame: f - S(T_APPUI), fps, config: { mass: 0.7, damping: 15, stiffness: 170 } });
  const sAssis = spring({ frame: f - S(T_ASSIS), fps, config: { mass: 1.2, damping: 17, stiffness: 105 } });
  const sGenou = spring({ frame: f - S(T_GENOU), fps, config: { mass: 0.9, damping: 15, stiffness: 130 } });
  const sDebout = spring({ frame: f - S(T_DEBOUT), fps, config: { mass: 1.0, damping: 17, stiffness: 95 } });

  const enRelevage = t >= T_INERTE;
  const repart = t >= T_REPART;

  // --- construction de la pose ---
  let pose: Pose | undefined;
  let rot = 0;
  let x = X - 130 + distA + glissade;
  let phase = phaseMarche;

  if (estTombe && !repart) {
    // ⚠️ REECRIT apres render. La 1re version ADDITIONNAIT 3 interpolations sur les memes angles
    // (torso = 78 + bassin*(-32) + debout*(-46), etc.). Les 3 ressorts se chevauchant dans le
    // temps, les sommes ne retombaient jamais sur une pose propre : le perso finissait en baton
    // couche a 45°, jamais debout. C'est LE piege de l'animation par accumulation.
    // La bonne facon : des POSES-CLES explicites (chacune est une silhouette valide, verifiable
    // a la main), et un FONDU SEQUENTIEL de l'une a l'autre. A tout instant on est sur le
    // segment entre 2 poses correctes — impossible de deriver.
    type K = Required<Pick<Pose, "hipY" | "torsoDeg" | "leg1Deg" | "leg2Deg" | "arm1Deg" | "arm2Deg">> & {
      arm1Len: number; arm2Len: number; headTuck: number; leg1Knee: number; leg2Knee: number;
    };
    // ⚠️ CONVENTION D'ANGLE (la meme erreur a produit le defaut "mains en l'air" a l'arret) :
    // pour un BRAS, la main est a  y = epaule + cos(angle) * longueur. Donc angle 0 = bras qui
    // PEND, angle ~90 = bras a l'horizontale VERS L'AVANT, angle 180 = bras leve. Toutes les
    // valeurs ci-dessous sont dans CETTE convention, et chaque pose a ete verifiee par calcul
    // (position de chaque articulation, contact au sol).
    //
    // P0 = DEBOUT (pose d'arrivee ET de depart, pour que la boucle se referme).
    // Bras pendants (8 / -8), pas 172/188 : c'etait le bug des mains en l'air.
    const P_DEBOUT: K = {
      hipY: -26, torsoDeg: 0, leg1Deg: 8, leg2Deg: -8,
      arm1Deg: 8, arm2Deg: -8, arm1Len: 28, arm2Len: 28, headTuck: 0,
      leg1Knee: 0, leg2Knee: 0,
    };
    // P1 = LA CHUTE EN COURS — LE REFLEXE PARACHUTE. Le corps bascule vers l'avant mais les bras
    // sont deja JETES EN AVANT, mains ouvertes devant, pretes a encaisser. C'est precisement ce
    // qui manquait : avant, ils partaient en arriere et il plantait la tete en premier.
    const P_CHUTE: K = {
      hipY: -20, torsoDeg: 58, leg1Deg: -30, leg2Deg: -52,
      arm1Deg: 74, arm2Deg: 88, arm1Len: 29, arm2Len: 28, headTuck: 0.12,
      leg1Knee: -14, leg2Knee: 8,
    };
    // P2 = A PLAT AU SOL, CONTACT FRANC. Verifie par calcul : hanche(0,-3) epaule(32,-3)
    // tete(41,0) genou1(-17,-2) pied1(-34,-3) mains(+59/+60, -4/-1). Tout le corps repose sur la
    // ligne de sol, les DEUX MAINS sont devant lui au sol (elles ont amorti), les jambes trainent
    // derriere. Ce n'est plus un baton en l'air : c'est un corps a terre.
    const P_SOL: K = {
      hipY: -3, torsoDeg: 90, leg1Deg: -86, leg2Deg: -100,
      arm1Deg: 2, arm2Deg: -4, arm1Len: 28, arm2Len: 27, headTuck: 0.45,
      leg1Knee: -8, leg2Knee: 10,
    };
    // P3 = IL SE POUSSE SUR LES BRAS. Verifie : epaule remonte a -28, les deux mains restent
    // PLANTEES au sol (-10 / -5) et portent le buste. Le bassin decolle. C'est le premier effort.
    const P_APPUI: K = {
      hipY: -14, torsoDeg: 58, leg1Deg: -58, leg2Deg: -80,
      arm1Deg: -6, arm2Deg: -30, arm1Len: 30, arm2Len: 26, headTuck: 0.22,
      leg1Knee: -28, leg2Knee: 20,
    };
    // P4 = ⭐ LA POSITION ASSISE — la piste d'Aziz, et le pivot de tout le relevage.
    // GEOMETRIE REPRISE DE GestesExpressifs16x9 (geste "s'asseoir", deja validee par Aziz) :
    // bassin AU sol (-5), cuisses ouvertes vers l'avant au-dela de 90° et genoux FORTEMENT
    // flechis en negatif -> genou releve a (14,-14) et pied POSE a (17.6,+2). Verifie par calcul.
    // Sans genou, cette pose est geometriquement impossible (cf. commentaire du type Pose).
    const P_ASSIS: K = {
      hipY: -5, torsoDeg: 14, leg1Deg: 124, leg2Deg: 112,
      arm1Deg: 52, arm2Deg: 62, arm1Len: 27, arm2Len: 26, headTuck: 0,
      leg1Knee: -112, leg2Knee: -104,
    };
    // P5 = UN GENOU SOUS LUI, L'AUTRE PIED AU SOL (la fente d'appui). Verifie : hanche(-25),
    // genou avant(12,-13) pied avant(10,+4), jambe arriere en appui derriere. C'est CETTE jambe
    // qui va pousser. Le buste est encore penche : il n'a pas fini de monter.
    const P_GENOU: K = {
      hipY: -25, torsoDeg: 26, leg1Deg: 46, leg2Deg: -34,
      arm1Deg: 26, arm2Deg: -14, arm1Len: 28, arm2Len: 27, headTuck: 0.05,
      leg1Knee: -52, leg2Knee: -6,
    };

    const mix = (A: K, B: K, u: number): K => ({
      hipY: A.hipY + (B.hipY - A.hipY) * u,
      torsoDeg: A.torsoDeg + (B.torsoDeg - A.torsoDeg) * u,
      leg1Deg: A.leg1Deg + (B.leg1Deg - A.leg1Deg) * u,
      leg2Deg: A.leg2Deg + (B.leg2Deg - A.leg2Deg) * u,
      arm1Deg: A.arm1Deg + (B.arm1Deg - A.arm1Deg) * u,
      arm2Deg: A.arm2Deg + (B.arm2Deg - A.arm2Deg) * u,
      arm1Len: A.arm1Len + (B.arm1Len - A.arm1Len) * u,
      arm2Len: A.arm2Len + (B.arm2Len - A.arm2Len) * u,
      headTuck: A.headTuck + (B.headTuck - A.headTuck) * u,
      leg1Knee: A.leg1Knee + (B.leg1Knee - A.leg1Knee) * u,
      leg2Knee: A.leg2Knee + (B.leg2Knee - A.leg2Knee) * u,
    });

    // ENCHAINEMENT SEQUENTIEL. Chaque etape part de la pose COURANTE et va vers une pose-cle
    // valide : a tout instant on est sur le segment entre 2 silhouettes correctes. Les ressorts
    // ne se somment jamais sur un meme angle -> aucune derive possible.
    //   DEBOUT -> CHUTE -> SOL -> APPUI -> ASSIS -> GENOU -> DEBOUT
    // La chute elle-meme passe par P_CHUTE (bras devant) AVANT P_SOL : c'est ce passage qui
    // montre le reflexe parachute, au lieu d'un basculement direct en planche.
    const versChute = interpolate(chute, [0, 0.55], [0, 1], clamp);
    const versSol = interpolate(chute, [0.4, 1], [0, 1], clamp);
    let k = mix(P_DEBOUT, P_CHUTE, versChute);
    k = mix(k, P_SOL, versSol);
    if (enRelevage) {
      k = mix(k, P_APPUI, sAppui);
      k = mix(k, P_ASSIS, sAssis);
      k = mix(k, P_GENOU, sGenou);
      k = mix(k, P_DEBOUT, sDebout);
    }

    pose = {
      hipY: k.hipY,
      torsoDeg: k.torsoDeg,
      leg1Deg: k.leg1Deg,
      leg2Deg: k.leg2Deg,
      leg1Knee: k.leg1Knee,
      leg2Knee: k.leg2Knee,
      arm1Deg: k.arm1Deg,
      arm1Len: k.arm1Len,
      arm2Deg: k.arm2Deg,
      arm2Len: k.arm2Len,
      headTuck: k.headTuck,
    };
    rot = 0;
  } else if (repart) {
    // il repart en marchant. La phase de marche redemarre proprement a 0.
    const tr = t - T_REPART;
    phase = (tr * cad) % 1;
    const distB = tr * cad * 2 * stepLength(swingMax);
    x = X - 130 + distA + glissade + distB;
    // il se remet en route en boitant legerement : le bob est amorti au depart
    pose = undefined;
  }

  // poussiere a l'impact — 6 traits courts, deterministes (index-derives), qui s'ecartent et
  // s'effacent. Sans eux la chute manque de contact (le sol ne "repond" pas).
  const impact = interpolate(f, [S(T_SOL - 0.12), S(T_SOL + 0.05), S(T_SOL + 0.75)], [0, 1, 0], clamp);

  const fadeCycle = interpolate(f, [0, 6, CYCLE - 10, CYCLE - 2], [0, 1, 1, 0], clamp);

  return (
    <g opacity={fadeCycle}>
      <Sol y={solY} x0={520} x1={1420} />
      {impact > 0.01 && [0, 1, 2, 3, 4, 5].map((i) => {
        const dir = i < 3 ? -1 : 1;
        const k = (i % 3) / 2;                        // 0, 0.5, 1 — deterministe
        const len = 11 + k * 9;
        const px = x + dir * (16 + k * 30 + impact * 22 * (1 + k));
        const py = solY - 3 - k * 9 * impact;
        return (
          <line key={i} x1={px} y1={py} x2={px + dir * len} y2={py - 3 - k * 4}
            stroke={ENCRE} strokeWidth={2} strokeLinecap="round" opacity={impact * (0.5 - k * 0.15)} />
        );
      })}
      <Figure
        x={x} y={solY} phase={phase}
        p={{ swingMax, bobAmp: repart ? 2.0 : 2.5, armSwing: 22 }}
        pose={pose} rotate={rot}
      />
      <Etiquette x={W / 2} y={solY + 78} label="TOMBER ET SE RELEVER"
        sub="bras devant (réflexe parachute) · au sol · appui · assis · genou · debout" />
      {/* reperes de temps discrets : ils rendent la decomposition lisible a l'oeil nu */}
      <g opacity={0.5}>
        {[
          { at: T_TREBUCHE, l: "trébuche" },
          { at: T_SOL, l: "au sol" },
          { at: T_APPUI, l: "appui" },
          { at: T_ASSIS, l: "assis" },
          { at: T_GENOU, l: "genou" },
          { at: T_DEBOUT, l: "debout" },
        ].map((m, i) => {
          const actif = t >= m.at && t < m.at + 0.55;
          const mx = 520 + i * 176;
          return (
            <g key={i}>
              <circle cx={mx} cy={solY + 120} r={actif ? 5.5 : 3} fill={actif ? OR_CLAIR : ENCRE}
                opacity={actif ? 1 : 0.3} />
              <text x={mx} y={solY + 146} textAnchor="middle" fontFamily="Georgia, serif" fontSize={14}
                fill={actif ? OR_CLAIR : ENCRE} opacity={actif ? 0.95 : 0.3} letterSpacing={1.2}>{m.l}</text>
            </g>
          );
        })}
      </g>
    </g>
  );
};

// ============================================================================
// LA PLANCHE
// ============================================================================
export const GestesLocomotion16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const op = interpolate(frame, [0, 12, GESTES_LOCOMOTION_FRAMES - 14, GESTES_LOCOMOTION_FRAMES],
    [0, 1, 1, 0], clamp);

  // etoiles (continuite avec le registre CFA) — PRNG a graine fixe, calcule une seule fois
  const stars = React.useMemo(() => {
    const a: { x: number; y: number; r: number; o: number }[] = [];
    let s = 11;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 55; i++) {
      a.push({ x: rnd() * W, y: rnd() * H, r: rnd() * 1.3 + 0.4, o: rnd() * 0.28 + 0.1 });
    }
    return a;
  }, []);

  const SOL_1 = 250;
  const SOL_2 = 560;
  const SOL_3 = 880;

  const b1 = interpolate(frame, [0, 20], [0, 1], clamp);
  const b2 = interpolate(frame, [S(0.5), S(1.2)], [0, 1], clamp);
  const b3 = interpolate(frame, [S(1.0), S(1.8)], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${NUIT} 0%, ${NUIT2} 100%)`, opacity: op }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={ENCRE} opacity={s.o} />)}

        {/* titre de planche */}
        <text x={70} y={62} fontFamily="Georgia, serif" fontSize={26} fill={ENCRE} letterSpacing={4}
          opacity={0.7}>R&amp;D — GESTES : LOCOMOTION ET POIDS</text>
        <text x={70} y={92} fontFamily="Georgia, serif" fontSize={15} fill={ENCRE} letterSpacing={1.6}
          opacity={0.36} fontStyle="italic">
          déplacement dérivé du pas (jamais l&apos;inverse) — taille réelle, ~74 px
        </text>
        <line x1={70} y1={112} x2={1850} y2={112} stroke={ENCRE} strokeWidth={1} opacity={0.16} />

        {/* ===== BANDE 1 : MARCHER ===== */}
        <g opacity={b1}>
          <text x={70} y={SOL_1 - 128} fontFamily="Georgia, serif" fontSize={19} fill={OR_CLAIR}
            letterSpacing={3.5} opacity={0.75}>1 · MARCHER</text>
          <BandeMarche frame={frame} solY={SOL_1} />
        </g>

        {/* ===== BANDE 2 : LE POIDS ===== */}
        <g opacity={b2}>
          <text x={70} y={SOL_2 - 128} fontFamily="Georgia, serif" fontSize={19} fill={OR_CLAIR}
            letterSpacing={3.5} opacity={0.75}>2 · PORTER · POUSSER · TIRER</text>
          <BandePoids frame={frame} solY={SOL_2} />
        </g>

        {/* ===== BANDE 3 : TOMBER ET SE RELEVER ===== */}
        <g opacity={b3}>
          <text x={70} y={SOL_3 - 148} fontFamily="Georgia, serif" fontSize={19} fill={OR_CLAIR}
            letterSpacing={3.5} opacity={0.75}>3 · TOMBER ET SE RELEVER (sans filet)</text>
          <BandeChute frame={frame} solY={SOL_3} fps={fps} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default GestesLocomotion16x9;
