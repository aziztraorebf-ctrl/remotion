// R&D STICK FIGURES — LOT "GESTES EXPRESSIFS" (2026-07-26). PROTO JETABLE, pas un livrable.
//
// POURQUOI : sur le beat 4 du Franc CFA, une stick figure DE PROFIL s'est revelee remarquablement
// animable (marche, vacillement, chute, rebond). Question posee par Aziz : qu'est-ce que ce registre
// ouvre NARRATIVEMENT ? Ce fichier teste 3 gestes qu'il a cites nommement.
//
// CRITERE ELIMINATOIRE (mot d'Aziz) : "si tu ne peux pas l'animer aussi bien qu'on l'a anime sur le
// franc CFA, ce n'est pas la bonne voie". On juge le MOUVEMENT, jamais le dessin statique.
//
// PRINCIPES REPRIS DE LA REFERENCE (CfaActe4Filet16x9 > FunambuleProfil) :
//   - hanche a hy = -26 - bob, bob = |cos(a)| * 2.5
//   - jambes en CISEAU dans le plan de l'image, L=34, 2e jambe a opacity 0.75 (profondeur)
//   - tete r=9 decalee cx=+3 (sens de la marche)
//   - strokeWidth 4.5 membres / 3.5-4 accessoires, strokeLinecap round
//   - encre creme sur nuit #182746
//
// ⛔ DETERMINISME : zero Math.random(). Toutes les irregularites sont des SOMMES DE SINUS de
//    frequences incommensurables (rapports irrationnels) — le motif ne se repete pas a l'oeil mais
//    reste identique a chaque calcul de frame.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const W = 1920;
const H = 1080;
const FPS = 30;
const S = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const rad = (d: number) => (d * Math.PI) / 180;

const NUIT = "#22345c";
const NUIT2 = "#182746";
const ENCRE = "#f0e8d2";
const ENCRE_FAIBLE = "rgba(240,232,210,0.34)";
const OR_CLAIR = "#d9a93a";

// ============================================================================================
// SQUELETTE COMMUN — un seul corps parametre, partage par TOUS les gestes.
// C'est le point du test : le MEME corps doit pouvoir jouer 5 intentions differentes.
// Toutes les longueurs sont celles de la reference (tete r=9, jambe L=34, buste ~32).
// Angles en degres, 0 = vers le bas pour les jambes / vers le bas pour les bras.
// ============================================================================================
type Pose = {
  // corps
  bob: number;          // deplacement vertical du bassin (respiration, pas, tassement)
  leanBuste: number;    // inclinaison du buste en degres (+ = vers l'avant/droite)
  leanTete: number;     // inclinaison additionnelle de la tete
  // bras : angle depuis l'epaule, 0 = le long du corps, 180 = tendu vers le haut
  brasAvantAngle: number;
  brasArriereAngle: number;
  brasAvantCoude: number;   // flexion du coude en degres (0 = tendu)
  brasArriereCoude: number;
  // jambes : angle d'ouverture du ciseau depuis la verticale
  jambeAvant: number;
  jambeArriere: number;
  jambeAvantGenou: number;  // flexion du genou (assis = fort)
  jambeArriereGenou: number;
  // decalages globaux (tremblement, poids)
  dx: number;
  dy: number;
  // hauteur du bassin par rapport a la ligne de sol (assis = plus bas)
  hancheY: number;
};

const POSE_NEUTRE: Pose = {
  bob: 0,
  leanBuste: 0,
  leanTete: 0,
  brasAvantAngle: 12,
  brasArriereAngle: -8,
  brasAvantCoude: 8,
  brasArriereCoude: 8,
  // ⚠️ jamais 0/0 : deux jambes au meme angle = un seul trait a l'ecran. Un appui minimal
  // (+/-5 deg, ~12px d'ecart aux pieds) est le plancher de lisibilite a 74px de haut.
  jambeAvant: 5,
  jambeArriere: -5,
  jambeAvantGenou: 0,
  jambeArriereGenou: 0,
  dx: 0,
  dy: 0,
  hancheY: -26,
};

// Un segment a 2 os (bras ou jambe) : epaule/hanche -> coude/genou -> main/pied.
// racineAngle = angle du 1er os depuis la verticale BASSE, coude = flexion additionnelle.
const chaine = (
  ox: number, oy: number, l1: number, l2: number, racineAngle: number, flexion: number,
): { mx: number; my: number; ex: number; ey: number } => {
  const a1 = rad(racineAngle);
  const mx = ox + Math.sin(a1) * l1;
  const my = oy + Math.cos(a1) * l1;
  const a2 = rad(racineAngle + flexion);
  const ex = mx + Math.sin(a2) * l2;
  const ey = my + Math.cos(a2) * l2;
  return { mx, my, ex, ey };
};

const Stick: React.FC<{
  x: number; y: number; pose: Pose; opacity?: number; couleur?: string; tilt?: number;
}> = ({ x, y, pose, opacity = 1, couleur = ENCRE, tilt = 0 }) => {
  const p = pose;
  // bassin
  const hx = 0;
  const hy = p.hancheY - p.bob;
  // buste : longueur ~32, incline de leanBuste
  const busteL = 32;
  const sx = hx + Math.sin(rad(180 + p.leanBuste)) * busteL; // vers le haut
  const sy = hy + Math.cos(rad(180 + p.leanBuste)) * busteL;
  // tete posee au-dessus des epaules, decalee de +3 en x (sens de la marche, comme la ref)
  const teteA = rad(180 + p.leanBuste + p.leanTete);
  const tx = sx + Math.sin(teteA) * 11 + 3;
  const ty = sy + Math.cos(teteA) * 11;

  // bras : depuis un point legerement sous les epaules.
  // ⚠️ CORRECTION apres verification par calcul + frame rendue (2026-07-26) : la 1re version
  // appliquait le MEME signe aux deux bras -> ils se superposaient (un seul trait visible), et
  // l'allonge (17+15=32) etait trop courte pour depasser la tete a 74px de haut. Deux fixes :
  //   (a) le bras ARRIERE est MIROIR (angle negatif) — c'est ce que fait la ref avec +swing/-swing ;
  //   (b) allonge portee a 20+18=38 (~la moitie de la hauteur du corps), sinon un bras leve
  //       arrive a hauteur de tete au lieu de la depasser franchement.
  const epX = sx + (hx - sx) * 0.12;
  const epY = sy + (hy - sy) * 0.12;
  const brasA = chaine(epX, epY, 20, 18, p.brasAvantAngle + p.leanBuste, p.brasAvantCoude);
  const brasB = chaine(epX, epY, 20, 18, -p.brasArriereAngle + p.leanBuste, -p.brasArriereCoude);

  // jambes : 2 os de 17 chacun (L=34 au total, comme la ref).
  // Ici PAS de miroir automatique : les angles avant/arriere sont deja donnes de signes opposes
  // par les gestes (jambeAvant: +17 / jambeArriere: -13), exactement comme le ciseau de la ref.
  const jbA = chaine(hx, hy, 17, 17, p.jambeAvant, p.jambeAvantGenou);
  const jbB = chaine(hx, hy, 17, 17, p.jambeArriere, p.jambeArriereGenou);

  const L = (a: number, b: number, c: number, d: number, w = 4.5, o = 1, key?: string) => (
    <line key={key} x1={a} y1={b} x2={c} y2={d} stroke={couleur} strokeWidth={w}
      strokeLinecap="round" opacity={o} />
  );

  return (
    <g transform={`translate(${x + p.dx} ${y + p.dy}) rotate(${tilt})`} opacity={opacity}>
      {/* membres ARRIERE d'abord (opacity 0.75 = profondeur, principe de la ref) */}
      {L(hx, hy, jbB.mx, jbB.my, 4.5, 0.75, "jb1")}
      {L(jbB.mx, jbB.my, jbB.ex, jbB.ey, 4.5, 0.75, "jb2")}
      {L(epX, epY, brasB.mx, brasB.my, 4.2, 0.75, "brb1")}
      {L(brasB.mx, brasB.my, brasB.ex, brasB.ey, 4.2, 0.75, "brb2")}
      {/* buste */}
      {L(hx, hy, sx, sy, 4.5, 1, "buste")}
      {/* membres AVANT */}
      {L(hx, hy, jbA.mx, jbA.my, 4.5, 1, "ja1")}
      {L(jbA.mx, jbA.my, jbA.ex, jbA.ey, 4.5, 1, "ja2")}
      {L(epX, epY, brasA.mx, brasA.my, 4.2, 1, "bra1")}
      {L(brasA.mx, brasA.my, brasA.ex, brasA.ey, 4.2, 1, "bra2")}
      {/* tete */}
      <circle cx={tx} cy={ty} r={9} fill={couleur} />
    </g>
  );
};

// ============================================================================================
// ETIQUETTES (Georgia serif sobre, comme la reference)
// ============================================================================================
const Etiq: React.FC<{ x: number; y: number; label: string; sous?: string; op?: number }> = ({
  x, y, label, sous, op = 1,
}) => (
  <g opacity={op}>
    <text x={x} y={y} textAnchor="middle" fontFamily="Georgia, serif" fontSize={26} fill={ENCRE}
      letterSpacing={3} opacity={0.9}>{label}</text>
    {sous && (
      <text x={x} y={y + 30} textAnchor="middle" fontFamily="Georgia, serif" fontSize={17}
        fill={ENCRE} letterSpacing={1.4} opacity={0.5} fontStyle="italic">{sous}</text>
    )}
  </g>
);

const Sol: React.FC<{ y: number; x0: number; x1: number; op?: number }> = ({ y, x0, x1, op = 1 }) => (
  <line x1={x0} y1={y} x2={x1} y2={y} stroke={ENCRE_FAIBLE} strokeWidth={2} opacity={op} />
);

// ============================================================================================
// GESTE 1 — LEVER LES BRAS, 3 INTENTIONS
//
// HYPOTHESE TESTEE : le meme geste "bras qui montent" doit lire ALERTE / CELEBRATION / REDDITION
// uniquement par la VITESSE, la TENSION et ce que fait le RESTE DU CORPS.
//
//   ALERTE      — montee BRUTALE (spring raide, damping bas -> depassement puis vibration),
//                 bras ASYMETRIQUES et non tendus a fond (un bras plus haut = il designe/avertit),
//                 buste projete en AVANT, tete relevee, un pied qui avance : il PART vers l'avant.
//                 Le corps est en surtension : oscillation residuelle rapide qui ne s'eteint pas.
//   CELEBRATION — montee AMPLE et ronde (spring souple), bras SYMETRIQUES ouverts en V large,
//                 buste renverse en ARRIERE, tete en arriere, et surtout : le corps DECOLLE
//                 (petit saut, jambes qui se replient sous lui). Puis rebond, il retombe et
//                 repart. C'est un geste qui va vers le HAUT et vers l'EXTERIEUR.
//   REDDITION   — montee LENTE et REGULIERE (interpolate lineaire, pas de spring, pas de rebond),
//                 bras COLLES en dedans, coudes flechis (la posture "mains en l'air" reelle, pas
//                 le V du vainqueur), buste TASSE vers le bas (le bassin descend pendant que les
//                 bras montent : contradiction interne = la soumission), tete BAISSEE. Aucune
//                 oscillation : ce qui monte reste fige. C'est le seul des 3 ou rien ne rebondit.
//
// LE DISCRIMINANT PRINCIPAL n'est PAS l'angle des bras, c'est LE SENS DU CORPS :
//   alerte = vers l'avant · celebration = vers le haut · reddition = vers le bas.
// ============================================================================================
type IntentionBras = "alerte" | "celebration" | "reddition";

const useLeverBras = (frameLocal: number, fps: number, intention: IntentionBras): Pose => {
  const f = frameLocal;
  // cycle de 4.0s : 0.6s de repos, la montee, le maintien, la redescente, puis on reboucle
  const CYCLE = S(4.0);
  const t = ((f % CYCLE) + CYCLE) % CYCLE;
  const depart = S(0.55);

  if (intention === "alerte") {
    // ══ REFAIT DEPUIS L'INTENTION (2026-07-26, retour Aziz : "trop exagere") ══
    //
    // INTENTION : quelqu'un vient de voir ce que personne d'autre n'a vu, et son corps
    //             s'est arrete AVANT sa voix.
    //
    // FORME DEDUITE : ce n'est PAS "lever les bras". C'est un ARRET NET en pleine marche.
    //   Le discriminant de l'alerte, c'est la RUPTURE DE RYTHME, pas l'amplitude. La v1
    //   jouait un ressort raide (damping 7) avec depassement + vibration residuelle + deux
    //   bras a 168/138 deg : de la pantomime, un corps qui gesticule. Un corps reellement
    //   alerte se BLOQUE : il etait en mouvement, il se fige d'un coup, le buste continue une
    //   fraction de seconde par inertie puis se rattrape, UN SEUL bras se leve — a mi-hauteur,
    //   pas au-dessus de la tete — pour DESIGNER, et la tete se verrouille sur ce qu'elle voit.
    //   Puis PLUS RIEN NE BOUGE. C'est l'immobilite soudaine qui glace, pas l'agitation.
    //
    // CE QUI CHANGE vs v1 : (1) plus de spring a depassement — un arret amorti sans rebond ;
    //   (2) un seul bras leve, a 96 deg (horizontal-haut = pointer) au lieu de 168 ; l'autre
    //   reste bas, quasi immobile ; (3) plus de buzz residuel — le maintien est TENU, fige ;
    //   (4) le lean du buste fait un contretemps court (inertie) puis se stabilise a 6 deg ;
    //   (5) les jambes s'ARRETENT jambe avant plantee, elles ne "partent" plus vers l'avant.

    // l'arret : rapide mais AMORTI (damping haut = il se bloque, il ne rebondit pas)
    const stop = spring({
      frame: t - depart, fps,
      config: { mass: 0.5, damping: 26, stiffness: 300 },
    });
    const down = interpolate(t, [S(3.0), S(3.6)], [0, 1], clamp);
    const lvl = Math.max(0, stop - down);
    // INERTIE DU BUSTE : il depasse de 5 deg pendant ~0.25s puis se rattrape. C'est le seul
    // depassement qu'on garde — celui du poids, pas celui d'un ressort de dessin anime.
    const inertie = interpolate(t, [depart, depart + S(0.14), depart + S(0.4), depart + S(0.62)],
      [0, 5.5, -1.2, 0], clamp);
    // respiration TRES contenue pendant le maintien : il est en apnee, pas en surtension.
    const souffle = Math.sin(t * 0.21) * 0.5 + Math.sin(t * 0.34) * 0.25;
    return {
      ...POSE_NEUTRE,
      // UN SEUL bras se leve, et pas haut : 96 deg = l'avant-bras part a l'horizontale
      // vers ce qu'il designe. L'autre bras reste le long du corps (il n'accompagne pas).
      brasAvantAngle: interpolate(lvl, [0, 1], [12, 96], clamp) + souffle * lvl * 0.5,
      brasArriereAngle: interpolate(lvl, [0, 1], [-8, -14], clamp),
      brasAvantCoude: interpolate(lvl, [0, 1], [8, 14], clamp),  // coude presque tendu = il DESIGNE
      brasArriereCoude: interpolate(lvl, [0, 1], [8, 12], clamp),
      // le buste se redresse et se BLOQUE (6 deg) ; l'inertie fait le seul depassement.
      leanBuste: interpolate(lvl, [0, 1], [0, 6], clamp) + inertie,
      leanTete: interpolate(lvl, [0, 1], [0, -7], clamp) + inertie * 0.35,  // tete verrouillee
      // ARRET NET : la jambe avant se PLANTE (elle encaisse), l'arriere reste en arriere,
      // en appui sur la pointe. Ecart ~26px : la silhouette d'un pas interrompu, pas d'un depart.
      // ⚠️ Le bassin ne descend PAS ici (bob reste ~0, cf. plus bas). C'est deliberate : des que
      // le bassin descend, la jambe (34px, fixe) doit se replier pour que le pied reste au sol,
      // et la geometrie impose alors un ecart de pieds >= 36px — soit une posture accroupie,
      // jambes ecartees, qui n'est plus celle d'un arret en pleine marche. Un arret net se joue
      // en HAUT du corps (buste, tete, bras), pas dans un flechissement de jambes.
      jambeAvant: interpolate(lvl, [0, 1], [4, 22], clamp),
      jambeArriere: interpolate(lvl, [0, 1], [-4, -19], clamp),
      jambeAvantGenou: interpolate(lvl, [0, 1], [0, -7], clamp),   // le genou encaisse l'arret
      jambeArriereGenou: interpolate(lvl, [0, 1], [0, 9], clamp),
      bob: souffle * lvl * 0.4,   // pas de tassement : cf. la note sur les jambes ci-dessus
      dx: 0,
      dy: 0,
      hancheY: -26,
    };
  }

  if (intention === "celebration") {
    // MONTEE AMPLE + LE CORPS DECOLLE. spring souple, on laisse le depassement etre RONDE.
    const up = spring({
      frame: t - depart, fps,
      config: { mass: 1.05, damping: 11, stiffness: 105 },
    });
    const down = interpolate(t, [S(2.9), S(3.6)], [0, 1], clamp);
    const lvl = Math.max(0, up - down);
    // le saut : une cloche courte pendant la montee, puis un petit rebond amorti
    const saut = interpolate(t, [depart, depart + S(0.22), depart + S(0.55), depart + S(0.82)],
      [0, 26, 0, 0], clamp);
    const rebond = interpolate(t, [depart + S(0.55), depart + S(0.72), depart + S(0.95)],
      [0, 7, 0], clamp);
    const air = saut + rebond;
    // respiration lente pendant le maintien (il est vivant, pas fige)
    const resp = Math.sin(t * 0.19) * 1.6 + Math.sin(t * 0.31) * 0.8;
    return {
      ...POSE_NEUTRE,
      // bras SYMETRIQUES, V LARGE, tendus (pas de coude casse).
      // ⚠️ 152 deg mettait les 2 mains a x=+/-14 seulement : un "V" invisible, les bras collaient
      // a la tete. Verifie par calcul : a 128 deg les mains s'ecartent a ~+/-30px = un vrai V ouvert.
      brasAvantAngle: interpolate(lvl, [0, 1], [12, 128], clamp) + resp * lvl * 0.6,
      brasArriereAngle: interpolate(lvl, [0, 1], [-8, 128], clamp) - resp * lvl * 0.6,
      brasAvantCoude: interpolate(lvl, [0, 1], [8, 6], clamp),
      brasArriereCoude: interpolate(lvl, [0, 1], [8, 6], clamp),
      // buste RENVERSE EN ARRIERE, tete en arriere
      leanBuste: interpolate(lvl, [0, 1], [0, -11], clamp),
      leanTete: interpolate(lvl, [0, 1], [0, -13], clamp),
      // jambes qui se REPLIENT sous lui pendant le saut.
      // ⚠️ Elles partent de l'appui NEUTRE (+/-5 deg) et non de 0 : sinon, des que le saut est
      // retombe (air=0), les 2 jambes se superposent et le personnage redevient un batonnet.
      jambeAvant: interpolate(air, [0, 26], [7, 24], clamp),
      jambeArriere: interpolate(air, [0, 26], [-7, -20], clamp),
      jambeAvantGenou: interpolate(air, [0, 26], [0, -34], clamp),
      jambeArriereGenou: interpolate(air, [0, 26], [0, 28], clamp),
      bob: 0,
      dx: 0,
      dy: -air,          // LE DECOLLAGE
      hancheY: -26,
    };
  }

  // REDDITION — montee LENTE, LINEAIRE, sans le moindre rebond.
  const lvl = interpolate(t, [depart, S(2.2), S(3.55), S(3.9)], [0, 1, 1, 0.06], clamp);
  // le seul mouvement residuel : une respiration TRES lente et un tassement qui continue.
  const resp = Math.sin(t * 0.13) * 1.1;
  const tasse = interpolate(t, [depart, S(3.55)], [0, 6.5], clamp);
  return {
    ...POSE_NEUTRE,
    // bras COLLES vers l'interieur, coudes FLECHIS (la vraie posture "mains en l'air")
    brasAvantAngle: interpolate(lvl, [0, 1], [12, 128], clamp),
    brasArriereAngle: interpolate(lvl, [0, 1], [-8, 118], clamp),
    brasAvantCoude: interpolate(lvl, [0, 1], [8, 52], clamp),    // avant-bras qui remonte, main pres de la tete
    brasArriereCoude: interpolate(lvl, [0, 1], [8, 58], clamp),
    // CONTRADICTION INTERNE : les bras montent, le corps DESCEND
    leanBuste: interpolate(lvl, [0, 1], [0, 5], clamp),
    leanTete: interpolate(lvl, [0, 1], [0, 16], clamp),          // tete BAISSEE
    // jambes qui flechissent, appui LARGE mais passif : il ne va nulle part, il tient debout.
    // (6 deg donnait 6.8px d'ecart = un seul trait a 74px. 14 deg -> ~16px, lisible sans etre un pas.)
    jambeAvant: interpolate(lvl, [0, 1], [4, 14], clamp),
    jambeArriere: interpolate(lvl, [0, 1], [-4, -13], clamp),
    jambeAvantGenou: interpolate(lvl, [0, 1], [0, 9], clamp),
    jambeArriereGenou: interpolate(lvl, [0, 1], [0, 8], clamp),
    bob: -tasse + resp * lvl,   // bob negatif = le bassin DESCEND
    dx: 0,
    dy: tasse * 0.55,
    hancheY: -26,
  };
};

// ============================================================================================
// GESTE 2 — TREMBLER / HESITER (peur, froid, effort)
//
// LE PIEGE identifie dans le brief : une vibration uniforme lit comme un BUG D'AFFICHAGE.
// CE QUI FAIT LA DIFFERENCE, teste ici :
//   (a) FREQUENCES INCOMMENSURABLES : somme de 3 sinus dont les rapports sont irrationnels
//       (1 / 1.618 / 2.718). Le motif ne se repete jamais a l'oeil -> ca ne lit plus "boucle".
//   (b) AMPLITUDE MODULEE : une enveloppe lente (~0.35 Hz) fait respirer le tremblement par
//       VAGUES. Un tremblement constant = machine ; un tremblement qui monte et retombe = corps.
//   (c) ASYMETRIE MEMBRE PAR MEMBRE : chaque segment a sa propre phase (dephasage fixe par index)
//       et son propre gain. Un corps qui tremble EN BLOC est un objet secoue, pas un vivant.
//   (d) LA SIGNATURE PROPRE A CHAQUE CAUSE — c'est le vrai enjeu :
//       PEUR   : basse frequence, forte amplitude, IRREGULIERE, avec des SURSAUTS isoles (des pics
//                brefs qui cassent la vague). Corps ferme sur lui-meme (buste plie, bras rentres).
//                Le tremblement est surtout dans le TRONC et la tete.
//       FROID  : haute frequence, faible amplitude, TRES REGULIERE (le grelottement est un
//                mecanisme mecanique). Corps recroqueville, bras SERRES contre le torse, epaules
//                remontees. Le tremblement est GLOBAL et uniforme — et c'est justement ici que
//                l'uniformite est JUSTE, parce que la posture dit deja "froid".
//       EFFORT : frequence moyenne, amplitude qui AUGMENTE avec la duree (la fatigue s'accumule)
//                puis LACHE d'un coup. Corps en tension dirigee (buste penche, bras tendus vers
//                le bas comme s'il retenait une charge), jambes flechies. Le tremblement est dans
//                les MEMBRES PORTEURS, pas dans la tete.
// ============================================================================================
type CauseTremble = "peur" | "froid" | "effort";

// bruit deterministe lisse : somme de sinus a frequences incommensurables.
// seed decale la phase par membre -> chaque segment tremble differemment SANS random.
const bruit = (f: number, seed: number, base: number): number => {
  const p = seed * 1.7139;
  return (
    Math.sin(f * base + p) * 0.55 +
    Math.sin(f * base * 1.618 + p * 2.3) * 0.3 +
    Math.sin(f * base * 2.718 + p * 0.7) * 0.15
  );
};

const useTrembler = (frameLocal: number, cause: CauseTremble): Pose => {
  const f = frameLocal;

  if (cause === "peur") {
    // enveloppe par VAGUES + SURSAUTS isoles
    const vague = 0.45 + 0.55 * Math.max(0, Math.sin(f * 0.078));
    // sursauts : des pics brefs, espaces de facon non periodique (2 sinus rapides ecretes)
    const pic = Math.max(0, Math.sin(f * 0.041) * Math.sin(f * 0.0173) - 0.72) / 0.28;
    const amp = vague * 2.6 + pic * 5.4;
    const b = (s: number) => bruit(f, s, 0.62) * amp;
    return {
      ...POSE_NEUTRE,
      // CORPS FERME : buste plie en avant, bras rentres DEVANT le torse.
      // ⚠️ Le coude doit RAMENER la main vers l'axe du corps. Avec le miroir du bras arriere,
      // une flexion positive des deux cotes ouvrait les bras vers l'exterieur (mains a x=+/-28).
      // Flexion NEGATIVE cote avant = l'avant-bras revient en travers du buste (main proche de x=0).
      leanBuste: 15 + b(1) * 0.9,
      leanTete: 13 + b(2) * 1.5,      // la tete tremble le PLUS
      brasAvantAngle: 30 + b(3) * 1.3,
      brasArriereAngle: 24 + b(4) * 1.1,
      brasAvantCoude: -96 + b(5) * 2.2,
      brasArriereCoude: -102 + b(6) * 2.0,
      // appui plus LARGE que le froid (qui, lui, joint les pieds) : il est fige, pret a reculer
      jambeAvant: 11 + b(7) * 0.7,
      jambeArriere: -10 + b(8) * 0.6,
      jambeAvantGenou: 8 + b(9) * 0.9,
      jambeArriereGenou: 7,
      bob: b(10) * 0.7,
      dx: b(11) * 0.9,
      dy: b(12) * 0.5,
      hancheY: -24,                    // legerement tasse
    };
  }

  if (cause === "froid") {
    // HAUTE frequence, FAIBLE amplitude, tres reguliere : le grelottement mecanique.
    // Ici l'uniformite est VOULUE — c'est la posture recroquevillee qui dit "froid",
    // le tremblement ne fait que la confirmer.
    const amp = 1.15 + 0.35 * Math.sin(f * 0.045);
    const b = (s: number) => bruit(f, s, 1.55) * amp;
    // en plus : des VAGUES DE FRISSON qui parcourent le corps (une bouffee toutes les ~2.4s)
    const frisson = Math.max(0, Math.sin(f * 0.087)) ** 3;
    return {
      ...POSE_NEUTRE,
      leanBuste: 8 + b(1) * 0.8 + frisson * 3,
      leanTete: 15 + b(2) * 0.9,          // tete RENTREE dans les epaules (signature du froid)
      // bras SERRES : ils s'AUTO-ENLACENT (chacun agrippe l'epaule opposee). C'est CA qui
      // distingue froid de peur au premier coup d'oeil : peur = bras devant, coudes bas et
      // ouverts ; froid = avant-bras remontes en travers de la POITRINE, tres haut, tres serres.
      brasAvantAngle: 14 + b(3) * 0.7,
      brasArriereAngle: 11 + b(4) * 0.7,
      brasAvantCoude: -128 + b(5) * 1.2,
      brasArriereCoude: -134 + b(6) * 1.2,
      // pieds JOINTS et genoux serres : il se fait tout petit (peur garde un appui plus large)
      jambeAvant: 3 + b(7) * 0.5,
      jambeArriere: -3 + b(8) * 0.5,
      jambeAvantGenou: 11 + frisson * 4,
      jambeArriereGenou: 10 + frisson * 3.5,
      bob: b(9) * 0.5 - frisson * 1.8,
      dx: b(10) * 0.55,
      dy: b(11) * 0.4,
      hancheY: -23,
    };
  }

  // ══ EFFORT — REFAIT DEPUIS L'INTENTION (2026-07-26, retour Aziz : "moins reussi") ══
  //
  // INTENTION : il tient quelque chose qui est en train de GAGNER contre lui.
  //
  // FORME DEDUITE : l'effort ne se lit pas dans le TREMBLEMENT, il se lit dans la RESISTANCE —
  //   c'est-a-dire dans une posture qui s'oppose a une force, et dans le fait qu'elle CEDE
  //   millimetre par millimetre. La v1 mettait l'effort dans la meme famille que peur/froid
  //   (une amplitude de bruit qui monte) : elle repondait a la question "comment ca vibre ?"
  //   au lieu de "contre quoi ca lutte ?". Or dans le lot Locomotion, ce qui fait qu'on SENT
  //   l'effort en poussant/tirant une caisse, ce n'est aucun tremblement : ce sont 4 marqueurs
  //   de posture (buste penche, hanche abaissee, appui court, bob ecrase) + une charge VISIBLE
  //   qui repond par a-coups. On reprend exactement ce vocabulaire-la.
  //
  // CE QUI CHANGE vs v1 : (1) une CHARGE VISIBLE (la barre + la masse au-dessus de lui, dessinee
  //   par le panneau) — sans antagoniste, "l'effort" n'a rien contre quoi s'exercer et redevient
  //   du bruit ; (2) posture d'ARC-BOUTEMENT : les 2 mains poussent VERS LE HAUT ET L'AVANT
  //   (verifie par calcul : mains a x~+6, y~-77, franchement au-dessus des epaules) ;
  //   (3) le corps CEDE progressivement — le bassin descend de 9px sur le cycle, les genoux
  //   flechissent : c'est la charge qui gagne ; (4) le tremblement subsiste mais REDUIT et
  //   confine aux MEMBRES PORTEURS (bras/jambes), plus dans le tronc ni la tete ; (5) le
  //   "lachage" devient une REPRISE : il se redresse d'un coup et regagne les 9px.
  const CYCLE = S(4.0);
  const t = ((f % CYCLE) + CYCLE) % CYCLE;
  // la charge gagne : montee en 3.0s, puis il REPREND le dessus d'un coup en 0.35s
  const cede = interpolate(t, [0, S(3.0)], [0, 1], clamp);
  const reprise = interpolate(t, [S(3.0), S(3.3), S(3.85)], [0, 1, 0.04], clamp);
  const perte = cede * (1 - reprise);      // 0 = il tient · 1 = il a cede au maximum
  // tremblement RESIDUEL, uniquement dans les membres porteurs, et faible : la posture parle
  // deja. On garde le principe des frequences incommensurables pour ne pas lire "boucle".
  const amp = (0.55 + perte * 1.5) * (1 - reprise * 0.85);
  const b = (s: number) => bruit(f, s, 0.88) * amp;
  // le sursaut de la reprise : un coup de reins bref
  const coup = interpolate(t, [S(3.0), S(3.16), S(3.4)], [0, 1, 0], clamp);
  return {
    ...POSE_NEUTRE,
    // ARC-BOUTEMENT SOUS UNE CHARGE AU-DESSUS DE LUI. Le buste reste assez droit (16 deg) :
    // ⚠️ verifie par calcul et par frame rendue. Deux versions fausses avant celle-ci :
    //   (a) buste a 30 deg + mains devant -> le haut du crane arrivait a 10px de la barre et la
    //       silhouette lisait "penche en avant sous un objet", pas "il pousse contre" ;
    //   (b) buste a 24 deg + barre centree sur les mains -> la plaque GAUCHE de la barre tombait
    //       exactement au-dessus de la tete (tete a x=-16, plaque a x=-29) : on lisait "la barre
    //       repose sur son crane". Aucun decalage lateral ne reglait ca sans decentrer la prise.
    // La solution est de faire MONTER la charge au-dessus de la tete (developpe) : le point de
    // prise passe a (-2.7, -90.4) et le haut du crane a -75.6, soit 15px de degagement franc,
    // avec une prise CENTREE sur l'axe du corps. C'est la forme juste : il POUSSE vers le haut.
    // Le tronc ne tremble PAS (c'est le point d'appui) — seuls les membres tremblent.
    leanBuste: 16 * (1 - reprise * 0.6) + perte * 7 - coup * 6,
    leanTete: 10 + perte * 8 - coup * 12,       // la tete rentre a mesure qu'il cede
    // les 2 bras poussent VERTICALEMENT au-dessus de la tete, coudes presque tendus quand il
    // tient, qui se plient a mesure qu'il cede (la charge redescend sur lui). Bras arriere en
    // signe NEGATIF pour que le miroir de Stick ramene la 2e main DU MEME COTE.
    brasAvantAngle: 166 - perte * 26 + b(1) * 1.2,
    brasArriereAngle: -158 + perte * 24 - b(2) * 1.1,
    brasAvantCoude: -10 + perte * 34 + b(3) * 1.6,
    brasArriereCoude: 14 - perte * 34 - b(4) * 1.5,
    // jambes PORTEUSES : appui large, genoux qui flechissent de plus en plus. C'est ici,
    // avec le bassin, que se lit "il perd du terrain".
    // ⚠️ DEUX BUGS TROUVES PAR LE CALCUL (invisibles a la lecture du code) : la version
    // precedente faisait descendre le bassin de 9px SANS raccourcir la jambe — les pieds
    // s'enfoncaient donc a 16px SOUS la ligne de sol — et l'ecart des pieds tombait de 12px a
    // 4.6px, ce qui refermait les 2 jambes en UN SEUL trait (le defaut n°1 deja documente sur
    // ce registre). La flexion du genou est donc RESOLUE, pas reglee : pour une hanche a une
    // hauteur h et une cuisse a 24 deg, le tibia doit verifier cos(B) = (h - 17.cos24)/17.
    // Les 2 jambes sont resolues SEPAREMENT (18 deg devant / 12 deg derriere) : un appui
    // symetrique lirait comme une vue de FACE, or tout ce registre est de profil. Solutions
    // calculees : h=26 -> flexions 36.7/44.5 · h=21.5 -> 53.7/61.3 · h=17 -> 69.2/76.7.
    // Le pied reste a y=0 exactement sur tout le cycle, et l'appui s'elargit de 37 a 43px
    // a mesure qu'il encaisse (il s'ecarte pour tenir : c'est le geste juste).
    jambeAvant: 18 + b(5) * 1.0,
    jambeArriere: -12 - b(6) * 0.9,
    jambeAvantGenou: 36.7 + perte * 32.5 + b(7) * 1.2,
    jambeArriereGenou: -44.5 - perte * 32.2 - b(8) * 1.1,
    // LE BASSIN DESCEND : 9px perdus sur le cycle. C'est le marqueur n°1 du poids (hipDrop
    // du lot Locomotion). Il les regagne d'un coup a la reprise.
    bob: -perte * 9 + coup * 3 + b(9) * 0.4,
    dx: b(10) * 0.3,
    dy: 0,
    hancheY: -26,
  };
};

// La CHARGE que l'effort combat : une masse posee sur une barre, au-dessus de ses mains.
// Sans antagoniste visible, "l'effort" n'a rien contre quoi s'exercer. Elle DESCEND quand il
// cede et remonte quand il reprend — c'est elle qui rend l'effort lisible en une frame.
const ChargeEffort: React.FC<{ frameLocal: number; x: number; solY: number }> = ({
  frameLocal, x, solY,
}) => {
  const CYCLE = S(4.0);
  const t = ((frameLocal % CYCLE) + CYCLE) % CYCLE;
  const cede = interpolate(t, [0, S(3.0)], [0, 1], clamp);
  const reprise = interpolate(t, [S(3.0), S(3.3), S(3.85)], [0, 1, 0.04], clamp);
  const perte = cede * (1 - reprise);
  const coup = interpolate(t, [S(3.0), S(3.16), S(3.4)], [0, 1, 0], clamp);
  // ⚠️ POSITION CALCULEE, PAS AU JUGE : en rejouant la chaine cinematique de Stick avec les
  // valeurs exactes de la pose EFFORT, le point de prise (milieu des 2 mains) va de
  // (x-2.7, solY-90.4) quand il tient a (x-4.8, solY-79.6) quand il a cede — 10.8px de descente,
  // avec le haut du crane qui reste 15px SOUS la barre sur tout le cycle (pas de collision).
  // La barre est CENTREE sur ce point et suit sa trajectoire : c'est ce contact qui fait qu'on
  // lit "il porte" et pas "il gesticule sous un objet".
  const barreY = solY - 90.4 + perte * 10.8 - coup * 3.5;
  const barreX = x - 2.7 - perte * 2.1;
  const dem = 40;   // demi-largeur : assez large pour peser, assez etroit pour ne pas noyer le corps
  return (
    <g>
      <line x1={barreX - dem} y1={barreY} x2={barreX + dem} y2={barreY}
        stroke={OR_CLAIR} strokeWidth={4} strokeLinecap="round" />
      {/* les 2 masses aux extremites : c'est le poids, il doit se VOIR */}
      {[-1, 1].map((s) => (
        <rect key={s} x={barreX + s * dem - 8} y={barreY - 15} width={16} height={30}
          fill="none" stroke={OR_CLAIR} strokeWidth={3.4} strokeLinejoin="round" />
      ))}
    </g>
  );
};

// ============================================================================================
// GESTE 3 — S'ASSEOIR, ATTENDRE : L'IMMOBILITE HABITEE
//
// USAGE NARRATIF VISE (Aziz) : "ceux qui attendent depuis 40 ans".
//
// LE PROBLEME : un personnage arrete est un personnage MORT. Il faut de la vie sans mouvement.
// CE QUI EST TESTE ICI, en 3 couches superposees d'echelles de temps differentes — c'est cette
// SUPERPOSITION D'ECHELLES qui fait la vie, pas une seule oscillation :
//   COUCHE 1 (~4s)  RESPIRATION : le buste se souleve/retombe, ~14 cycles/min. Amplitude 1.5px.
//                   Toujours presente, jamais interrompue. C'est le socle du vivant.
//   COUCHE 2 (~9s)  BALANCEMENT DU POIDS : le bassin se deplace lentement d'un appui a l'autre,
//                   le buste compense en sens inverse. C'est l'inconfort de la duree.
//   COUCHE 3 (~13s, non periodique) MICRO-AJUSTEMENTS : des gestes BREFS et ESPACES — la tete
//                   qui tourne, le dos qui se redresse puis retombe, une jambe qui change de
//                   position. Declenches par un produit de sinus ecrete (deterministe, apparemment
//                   irregulier). C'est ce qui empeche la lecture "boucle de 4 secondes".
//
// LA PHASE S'ASSEOIR : 1.4s, avec le POIDS. Le bassin descend en 2 temps (il flechit, puis il
// se laisse tomber les 30 derniers %), le buste part en avant puis se redresse APRES que le
// bassin soit pose (contretemps = poids ressenti). Sans ce contretemps, s'asseoir lit comme
// "descendre un ascenseur".
// ============================================================================================
// ── L'APPUI (2026-07-26, retour Aziz : "il est assis un peu dans le vide, c'est ca le probleme") ─
// La MECANIQUE de l'assise est validee (genoux qui plient, corps qui se plie). Ce qui manquait,
// c'est la SURFACE sur laquelle le bassin se pose. On teste 4 appuis pour savoir ce que le
// registre encaisse comme mobilier.
//
// ⚠️ GEOMETRIE VERIFIEE PAR CALCUL, jamais a l'oeil (un bassin qui flotte a 5px de son banc ruine
//    tout). Contraintes : bassin EXACTEMENT a y = -hauteur de l'appui ; pieds a y = 0 (au sol).
//    La jambe fait 34px (2 os de 17). Pour une hauteur d'assise SEAT et une cuisse d'angle A,
//    l'angle du tibia est impose : cos(B) = (SEAT - 17.cos A)/17. Les couples ci-dessous sont
//    les solutions de cette equation, verifiees une par une (pied a moins de 3px du sol).
type Appui = "banc" | "caisse" | "marche" | "sol";

type ProfilAppui = {
  seat: number;        // hauteur de la surface d'assise au-dessus du sol
  cuisseA: number;     // angle de la cuisse (jambe avant)
  flexA: number;       // flexion du genou avant
  cuisseB: number;     // jambe arriere
  flexB: number;
  brasAngle: number;   // ou tombent les avant-bras selon la hauteur d'assise
  brasCoude: number;
  label: string;
  sous: string;
};

// Solutions calculees (cf. /tmp/geo3.py) — pied a y = -0.9 / 0.0 / +1.8 / +3.8 px du sol.
const APPUIS: Record<Appui, ProfilAppui> = {
  banc: {
    seat: 18, cuisseA: 84, flexA: -58, cuisseB: 78, flexB: -44,
    brasAngle: 48, brasCoude: -30,
    label: "BANC", sous: "trait + 2 pieds · même encre que le corps",
  },
  caisse: {
    seat: 22, cuisseA: 72, flexA: -62, cuisseB: 66, flexB: -48,
    brasAngle: 52, brasCoude: -34,
    label: "CAISSE", sous: "le rectangle du lot Locomotion",
  },
  marche: {
    seat: 15, cuisseA: 88, flexA: -70, cuisseB: 80, flexB: -52,
    brasAngle: 56, brasCoude: -38,
    label: "MARCHE", sous: "l'angle d'un rebord, assis dessus",
  },
  sol: {
    // assis PAR TERRE : bassin au sol (4px = l'epaisseur du trait), une jambe repliee genou haut,
    // l'autre tendue devant. Ce n'est PAS la version "tabouret invisible" : le bassin touche.
    seat: 4, cuisseA: 120, flexA: -104, cuisseB: 94, flexB: -6,
    brasAngle: 62, brasCoude: -46,
    label: "SOL NU", sous: "bassin par terre · une jambe repliée, une tendue",
  },
};

const useAssisAttendre = (
  frameLocal: number, fps: number, appui: Appui = "sol",
): { pose: Pose; assis: number } => {
  const f = frameLocal;
  const A = APPUIS[appui];
  const T_ASSIS = S(0.9);   // il commence a s'asseoir

  // descente en 2 temps : flexion controlee puis lachage
  const desc = interpolate(f, [T_ASSIS, T_ASSIS + S(0.85), T_ASSIS + S(1.35)], [0, 0.7, 1], {
    ...clamp, easing: (t) => t,
  });
  // le buste part en avant PENDANT la descente, puis se redresse APRES (contretemps = le poids)
  const busteAvant = interpolate(f,
    [T_ASSIS, T_ASSIS + S(0.7), T_ASSIS + S(1.5), T_ASSIS + S(2.1)],
    [0, 22, 22, 7], clamp);
  // petit tassement amorti a l'arrivee : le corps encaisse son propre poids
  const impact = spring({
    frame: f - (T_ASSIS + S(1.35)), fps,
    config: { mass: 0.7, damping: 9, stiffness: 190 },
  });
  const encaisse = f >= T_ASSIS + S(1.35)
    ? interpolate(impact, [0, 1], [3.5, 0], clamp)
    : 0;

  // temps ecoule DEPUIS qu'il est assis (c'est lui qui pilote l'immobilite habitee)
  const ta = Math.max(0, f - (T_ASSIS + S(1.35)));

  // COUCHE 1 — respiration (~4s/cycle, soit ~15/min)
  const respPhase = ta * (2 * Math.PI) / S(4.0);
  const resp = Math.sin(respPhase);

  // COUCHE 2 — balancement du poids (~9s), le buste compense a contre-sens
  const poids = Math.sin(ta * (2 * Math.PI) / S(9.0)) * 0.62
    + Math.sin(ta * (2 * Math.PI) / S(14.6)) * 0.38;

  // COUCHE 3 — micro-ajustements brefs et espaces. Produit de 2 sinus lents ecrete :
  // il ne depasse le seuil que rarement, a des intervalles non periodiques a l'oeil.
  const decl = (a: number, b: number, seuil: number) =>
    Math.max(0, Math.sin(ta * a) * Math.sin(ta * b) - seuil) / (1 - seuil);
  const ajTete = decl(0.0271, 0.0113, 0.55);     // la tete tourne / se releve
  const ajDos = decl(0.0189, 0.0074, 0.62);      // le dos se redresse puis retombe
  const ajJambe = decl(0.0143, 0.0097, 0.68);    // une jambe change d'appui

  return {
    assis: desc,
    pose: {
      ...POSE_NEUTRE,
      // le bassin descend de -26 (debout) a -seat, ou seat est la hauteur EXACTE de l'appui.
      // ⚠️ Verifie par calcul, jamais a l'oeil : avec un appui, le bassin doit se poser SUR la
      // surface (pas 5px au-dessus, pas dedans) et les pieds doivent toucher le sol. Les angles
      // de jambe sont donc imposes par la hauteur d'assise, pas choisis (cf. table APPUIS).
      hancheY: interpolate(desc, [0, 1], [-26, -A.seat], clamp) + encaisse,
      // buste : penche en avant pendant la descente, puis quasi vertical + respiration + poids
      leanBuste: busteAvant * (1 - desc * 0.15)
        + desc * (resp * -0.9 + poids * 2.6 - ajDos * 7),
      leanTete: desc * (4 + resp * 0.8 + ajTete * -13 - poids * 1.6),
      // bras : ils tombent vers l'AVANT et se posent sur les genoux releves — c'est LA posture de
      // l'attente longue. Flexion negative = l'avant-bras repart vers le bas/l'avant (vers le genou),
      // et non vers l'exterieur (cf. correction du miroir des bras).
      brasAvantAngle: interpolate(desc, [0, 1], [12, A.brasAngle], clamp)
        + desc * (poids * 2.2 + ajDos * 5),
      brasArriereAngle: interpolate(desc, [0, 1], [-8, A.brasAngle - 8], clamp) + desc * poids * 1.8,
      brasAvantCoude: interpolate(desc, [0, 1], [8, A.brasCoude], clamp)
        + desc * (resp * 1.2 - ajTete * 9),
      brasArriereCoude: interpolate(desc, [0, 1], [8, A.brasCoude + 4], clamp) + desc * resp * 1.0,
      // jambes : angles IMPOSES par la hauteur de l'appui (table APPUIS), pas regles a l'oeil.
      // Sur un appui haut la cuisse est presque horizontale et le tibia tombe droit ; au sol la
      // cuisse remonte fort (genou haut) et le tibia redescend. Une jambe bouge parfois.
      jambeAvant: interpolate(desc, [0, 1], [5, A.cuisseA], clamp)
        + desc * (ajJambe * 7 + poids * 1.4),
      jambeArriere: interpolate(desc, [0, 1], [-5, A.cuisseB], clamp) + desc * (poids * -1.2),
      jambeAvantGenou: interpolate(desc, [0, 1], [0, A.flexA], clamp) + desc * ajJambe * -8,
      jambeArriereGenou: interpolate(desc, [0, 1], [0, A.flexB], clamp),
      // la respiration est un DEPLACEMENT REEL du buste, pas seulement une inclinaison
      bob: desc * (resp * 1.5 + poids * 0.9),
      dx: desc * poids * 1.3,
      dy: 0,
    },
  };
};

// ============================================================================================
// SOUS-SCENES
// ============================================================================================

// --- PANNEAU 1 : les 3 intentions du lever de bras, SIMULTANEMENT (seule facon de les juger) ---
const PanneauBras: React.FC<{ frameLocal: number; op: number }> = ({ frameLocal, op }) => {
  const { fps } = useVideoConfig();
  const solY = 720;
  const xs = [430, 960, 1490];
  const labels: { i: IntentionBras; l: string; s: string }[] = [
    { i: "alerte", l: "ALERTE", s: "arrêt net · un seul bras désigne · le corps se fige" },
    { i: "celebration", l: "CÉLÉBRATION", s: "ample · symétrique · le corps décolle" },
    { i: "reddition", l: "REDDITION", s: "lent · fermé · le corps s'affaisse" },
  ];
  const poseA = useLeverBras(frameLocal, fps, "alerte");
  const poseC = useLeverBras(frameLocal, fps, "celebration");
  const poseR = useLeverBras(frameLocal, fps, "reddition");
  const poses = [poseA, poseC, poseR];

  return (
    <g opacity={op}>
      <Etiq x={960} y={168} label="GESTE 1 — LEVER LES BRAS" sous="le même corps, trois intentions" />
      {xs.map((x, i) => (
        <g key={i}>
          <Sol y={solY} x0={x - 150} x1={x + 150} op={0.7} />
          <Stick x={x} y={solY} pose={poses[i]} />
          <Etiq x={x} y={solY + 78} label={labels[i].l} sous={labels[i].s} />
        </g>
      ))}
      {/* separateurs verticaux discrets : on compare, il faut des colonnes */}
      {[695, 1225].map((x) => (
        <line key={x} x1={x} y1={300} x2={x} y2={800} stroke={ENCRE} strokeWidth={1} opacity={0.1} />
      ))}
    </g>
  );
};

// --- PANNEAU 2 : trembler, 3 causes cote a cote (meme logique de comparaison) ---
const PanneauTrembler: React.FC<{ frameLocal: number; op: number }> = ({ frameLocal, op }) => {
  const solY = 700;
  const xs = [430, 960, 1490];
  const labels: { c: CauseTremble; l: string; s: string }[] = [
    { c: "peur", l: "PEUR", s: "lent · vagues + sursauts · corps fermé" },
    { c: "froid", l: "FROID", s: "rapide · faible · régulier · recroquevillé" },
    // EFFORT refait : ce n'est plus une famille de tremblement, c'est une RESISTANCE.
    { c: "effort", l: "EFFORT", s: "arc-bouté · il cède, puis il reprend" },
  ];
  const p1 = useTrembler(frameLocal, "peur");
  const p2 = useTrembler(frameLocal, "froid");
  const p3 = useTrembler(frameLocal, "effort");
  const poses = [p1, p2, p3];

  return (
    <g opacity={op}>
      <Etiq x={960} y={168} label="GESTE 2 — TREMBLER, RÉSISTER"
        sous="peur et froid : l'oscillation · effort : la posture qui cède" />
      {xs.map((x, i) => (
        <g key={i}>
          <Sol y={solY} x0={x - 150} x1={x + 150} op={0.7} />
          {/* la charge que l'effort combat : dessinee AVANT le corps (les bras passent devant,
              ce qui dit "il la retient" — meme principe que le sac du lot Locomotion) */}
          {labels[i].c === "effort" && (
            <ChargeEffort frameLocal={frameLocal} x={x} solY={solY} />
          )}
          <Stick x={x} y={solY} pose={poses[i]} />
          <Etiq x={x} y={solY + 78} label={labels[i].l} sous={labels[i].s} />
        </g>
      ))}
      {[695, 1225].map((x) => (
        <line key={x} x1={x} y1={300} x2={x} y2={780} stroke={ENCRE} strokeWidth={1} opacity={0.1} />
      ))}
      {/* ZOOM x2.4 sur la figure "peur" : a 74px les micro-oscillations sont a la limite du visible.
          Le zoom sert au DIAGNOSTIC (est-ce que ca lit comme un corps ou comme un bug ?), il ne
          fait pas partie de l'usage narratif. Place en HAUT A DROITE, dans le vide du cadre, a une
          echelle qui ne deborde pas (x3 sortait de l'ecran par le bas et par la droite). */}
      <g transform="translate(1712 470) scale(2.4)">
        <Stick x={0} y={0} pose={p1} opacity={0.85} couleur={OR_CLAIR} />
      </g>
      <Etiq x={1712} y={512} label="×2,4" sous="contrôle · peur" op={0.7} />
    </g>
  );
};

// --- LES 4 APPUIS, dessines dans le MEME REGISTRE que la stick figure -----------------------
// Regle : meme encre, meme epaisseur de trait (3.5-4 pour les accessoires, cf. la reference),
// strokeLinecap round, jamais de remplissage. Ce ne sont pas des meubles illustres : ce sont
// des traits. Un appui plus "dessine" que le corps casserait le registre.
const DessinAppui: React.FC<{ appui: Appui; x: number; solY: number }> = ({ appui, x, solY }) => {
  const A = APPUIS[appui];
  const y = solY - A.seat;   // la surface d'assise, a la hauteur EXACTE du bassin

  if (appui === "banc") {
    // un trait horizontal + 2 pieds. Rien d'autre.
    return (
      <g stroke={ENCRE} strokeWidth={3.8} strokeLinecap="round" fill="none" opacity={0.9}>
        <line x1={x - 34} y1={y} x2={x + 40} y2={y} />
        <line x1={x - 26} y1={y} x2={x - 26} y2={solY} />
        <line x1={x + 32} y1={y} x2={x + 32} y2={solY} />
      </g>
    );
  }
  if (appui === "caisse") {
    // le meme rectangle que le lot Locomotion (pousser/tirer) : rect + une latte, or clair.
    const w = 62;
    return (
      <g fill="none" strokeLinejoin="round">
        <rect x={x - 30} y={y} width={w} height={A.seat} stroke={OR_CLAIR} strokeWidth={3.5} />
        <line x1={x - 30} y1={y + A.seat * 0.55} x2={x - 30 + w} y2={y + A.seat * 0.55}
          stroke={OR_CLAIR} strokeWidth={2} opacity={0.6} />
      </g>
    );
  }
  if (appui === "marche") {
    // l'angle d'une marche : une horizontale (le nez de marche) + une verticale (la contremarche)
    // qui remonte hors cadre a gauche. Un seul angle, c'est tout ce qu'il faut pour lire "rebord".
    return (
      <g stroke={ENCRE} strokeWidth={3.8} strokeLinecap="round" strokeLinejoin="round" fill="none"
        opacity={0.9}>
        <path d={`M ${x + 46} ${y} L ${x - 40} ${y} L ${x - 40} ${y - 40}`} />
        <line x1={x - 40} y1={solY} x2={x + 52} y2={solY} opacity={0.35} />
      </g>
    );
  }
  // SOL NU : aucun appui a dessiner. C'est le point du test — le sol seul suffit-il ?
  return null;
};

// --- PANNEAU 3 : s'asseoir et attendre. LES 4 APPUIS cote a cote + le temoin fige -----------
const PanneauAttendre: React.FC<{ frameLocal: number; op: number }> = ({ frameLocal, op }) => {
  const { fps } = useVideoConfig();
  const solY = 620;
  const appuis: Appui[] = ["banc", "caisse", "marche", "sol"];
  // 4 colonnes regulieres, marges 160px : la 4e ne doit pas coller au bord (elle etait a 1690,
  // soit 230px du bord, et son etiquette debordait sous le zoom).
  const xs = [330, 750, 1170, 1590];

  const aBanc = useAssisAttendre(frameLocal, fps, "banc");
  const aCaisse = useAssisAttendre(frameLocal, fps, "caisse");
  const aMarche = useAssisAttendre(frameLocal, fps, "marche");
  const aSol = useAssisAttendre(frameLocal, fps, "sol");
  const etats = [aBanc, aCaisse, aMarche, aSol];
  // TEMOIN : la meme figure (sur banc) SANS aucune couche de vie. Il reste : c'est lui qui
  // permet de juger que l'immobilite est HABITEE et pas seulement immobile.
  const { pose: poseMorte } = useAssisAttendre(S(6.0), fps, "banc");

  return (
    <g opacity={op}>
      <Etiq x={960} y={150} label="GESTE 3 — S'ASSEOIR : SUR QUOI ?"
        sous="même mécanique, quatre appuis · le bassin repose exactement sur la surface" />
      {xs.map((x, i) => (
        <g key={appuis[i]}>
          <Sol y={solY} x0={x - 118} x1={x + 118} op={0.55} />
          <DessinAppui appui={appuis[i]} x={x} solY={solY} />
          <Stick x={x} y={solY} pose={etats[i].pose} />
          <Etiq x={x} y={solY + 84} label={APPUIS[appuis[i]].label}
            sous={APPUIS[appuis[i]].sous} />
        </g>
      ))}
      {[540, 960, 1380].map((x) => (
        <line key={x} x1={x} y1={230} x2={x} y2={700} stroke={ENCRE} strokeWidth={1} opacity={0.1} />
      ))}
      {/* ── BANDE BASSE : le controle. A gauche le TEMOIN FIGE (meme figure, meme banc, zero
          couche de vie — si on ne voit pas la difference avec la colonne 1, l'immobilite habitee
          ne se lit pas). A droite le zoom x2.4 sur le contact bassin/banc, qui est le point a
          verifier a l'oeil et qui, a 74px de haut, est a la limite du visible. */}
      <line x1={160} y1={800} x2={1760} y2={800} stroke={ENCRE} strokeWidth={1} opacity={0.09} />
      <g transform={`translate(420 ${960})`}>
        <Sol y={0} x0={-120} x1={120} op={0.35} />
        <DessinAppui appui="banc" x={0} solY={0} />
        <Stick x={0} y={0} pose={poseMorte} opacity={0.5} />
      </g>
      <Etiq x={640} y={945} label="TÉMOIN FIGÉ" sous="aucune couche de vie" op={0.6} />
      <g transform={`translate(1290 ${985}) scale(2.4)`}>
        <DessinAppui appui="banc" x={0} solY={0} />
        <Stick x={0} y={0} pose={aBanc.pose} opacity={0.9} couleur={OR_CLAIR} />
      </g>
      <Etiq x={1560} y={945} label="×2,4" sous="contact bassin / banc" op={0.7} />
      {/* jauge de la phase "s'asseoir" : elle rend lisible le contretemps du poids */}
      <g opacity={interpolate(aBanc.assis, [0, 1], [1, 0.2], clamp)}>
        <line x1={790} y1={760} x2={1130} y2={760} stroke={ENCRE} strokeWidth={2} opacity={0.2} />
        <line x1={790} y1={760} x2={790 + 340 * aBanc.assis} y2={760}
          stroke={OR_CLAIR} strokeWidth={3} />
      </g>
    </g>
  );
};

// ============================================================================================
// COMPOSITION — 3 panneaux en sequence. Chaque geste tourne assez longtemps pour etre juge.
//   P1 lever de bras : 9s   (2 cycles complets de 4s + marge) — les 3 intentions simultanees
//   P2 trembler      : 9s   (2 cycles d'effort, et assez de vagues de peur/frisson)
//   P3 attendre      : 10s  (1.4s pour s'asseoir + ~8.5s d'attente : il FAUT du temps pour que
//                            les micro-ajustements aient une chance de se declencher)
// Total 28s.
// ============================================================================================
const P1 = S(9.0);
const P2 = S(9.0);
// P3 passe de 10s a 13s : la planche compare desormais 4 appuis simultanement, et les
// micro-ajustements (couche 3) sont espaces de ~13s — il faut du temps pour qu'ils se declenchent.
const P3 = S(13.0);
const FONDU = S(0.5);
export const GESTES_EXPRESSIFS_FRAMES = P1 + P2 + P3;

export const GestesExpressifs16x9: React.FC = () => {
  const frame = useCurrentFrame();

  const opGlobal = interpolate(frame, [0, 10, GESTES_EXPRESSIFS_FRAMES - 12, GESTES_EXPRESSIFS_FRAMES],
    [0, 1, 1, 0], clamp);

  // fondus croises courts entre panneaux (on ne coupe pas sec : on doit pouvoir comparer)
  const op1 = interpolate(frame, [0, 6, P1 - FONDU, P1], [0, 1, 1, 0], clamp);
  const op2 = interpolate(frame, [P1 - FONDU, P1 + 4, P1 + P2 - FONDU, P1 + P2], [0, 1, 1, 0], clamp);
  const op3 = interpolate(frame, [P1 + P2 - FONDU, P1 + P2 + 4], [0, 1], clamp);

  // etoiles discretes (continuite avec l'episode CFA)
  const stars = React.useMemo(() => {
    const a: { x: number; y: number; r: number; o: number }[] = [];
    let s = 11;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < 45; i++) {
      a.push({ x: rnd() * W, y: rnd() * H * 0.72, r: rnd() * 1.4 + 0.4, o: rnd() * 0.32 + 0.12 });
    }
    return a;
  }, []);

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 40%, ${NUIT} 0%, ${NUIT2} 100%)`,
      opacity: opGlobal,
    }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={ENCRE} opacity={s.o} />)}

        {/* bandeau R&D discret, en haut a gauche */}
        <text x={72} y={78} fontFamily="Georgia, serif" fontSize={19} fill={ENCRE} opacity={0.4}
          letterSpacing={4}>R&amp;D STICK FIGURES — GESTES EXPRESSIFS</text>

        {op1 > 0.005 && <PanneauBras frameLocal={frame} op={op1} />}
        {op2 > 0.005 && <PanneauTrembler frameLocal={frame - P1} op={op2} />}
        {op3 > 0.005 && <PanneauAttendre frameLocal={frame - P1 - P2} op={op3} />}
      </svg>
    </AbsoluteFill>
  );
};

export default GestesExpressifs16x9;
