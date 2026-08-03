// ============================================================================================
// BANC D'ESSAI JETABLE — POSE "CORPS EFFONDRE" POUR <Stick>, ROUND 2  (2026-08-03)
// ============================================================================================
//
// ⛔ PROTOTYPE DE COMPARAISON, PAS DU CODE DE PRODUCTION. Aucun fichier partage n'est importe ni
// modifie : le socle `_shared/stick-figure-svg/StickFigure.tsx` n'est pas touche. Le round 1
// (`TestPoseSolOptions.tsx`) est laisse INTACT — ce fichier s'ajoute a cote, il ne le remplace pas.
//
// ⭐ CE QUE LE ROUND 1 A ETABLI, ET QU'ON NE REDECOUVRE PAS :
//   · la longueur du bras n'est PAS la cause (balayage de 14u a 46u de portee : 0 solution)
//   · la cause = la COLLINEARITE hanche/epaule/tete de la pose heritee de <Figure>
//   · un critere purement geometrique NE SUFFIT PAS a produire une pose credible :
//       A     -> calcul OK (17.8u) mais lit "un baton pose"          (ratio H/V = 5.6)
//       A-bis -> calcul + relief OK mais lit "quelqu'un qui se debat" (membres LEVES)
//       A-ter -> rien de leve, mais triangle FERME sous le buste     -> "appuye sur les coudes"
//
// ⭐⭐ CE QUE J'AI VU EN REGARDANT LES 3 RENDUS DU ROUND 1, ET QUI EST LE VRAI ANGLE MORT :
// dans LES TROIS options, `leanTete = 0`. La tete est donc TOUJOURS dans la prolongation exacte
// du buste, posee au bout de la ligne comme une bille au bout d'un baton. C'est LITTERALEMENT la
// collinearite diagnostiquee comme cause — jamais levee, seulement contournee en deplaçant les
// bras autour d'elle. Or c'est le premier signal que l'oeil lit : un corps inconscient LAISSE
// TOMBER SA TETE (menton sur la poitrine, ou nuque renversee). Une tete alignee sur le buste est
// une tete TENUE, donc un corps conscient — d'ou "il se debat" / "il est appuye".
//
// ⛔⛔ ERREUR DE METHODE COMMISE ET CORRIGEE DANS CE MEME ROUND — a lire avant de reprendre :
// ma 1re traduction du critere « tete tombee » etait ANGULAIRE : |leanTete| >= 25 deg. Les 5
// variantes la passaient, et LES 5 lisaient encore "assis / appuye / qui se redresse" au rendu.
// Mesure de ce que l'oeil voyait (hauteur de la tete au-dessus du sol) :
//        V1 25.3u · V2 36.5u · V3 36.4u · V4 25.6u · V5 24.3u   pour une hanche a 11-14u.
// LA TETE ETAIT LE POINT LE PLUS HAUT DU CORPS dans les 5 cas. Cause : `leanTete` est RELATIF au
// buste — quand le buste est lui-meme redresse, une tete a -30 deg reste tres haut. Je contraignais
// un PARAMETRE D'ENTREE au lieu de la POSITION RESULTANTE : je ne mesurais pas la chose dont je
// parlais. C'est la meme faute que le round 1 (mesurer les COUDES au lieu des SEGMENTS), a un
// niveau different. ⭐ Regle qui en sort : un critere de pose se formule TOUJOURS sur une position
// mesuree dans le repere monde, JAMAIS sur un angle d'entree du moteur.
//
// ⭐ LES 5 CRITERES NEUFS DE CE ROUND (en plus des 6 herites du round 1) :
//    7. TETE TOMBEE — version POSITIONNELLE (3 mesures, apres la correction ci-dessus) :
//       7a. le centre de la tete est a 7-15u du sol (crane de rayon 9u : il repose, sans s'enfoncer)
//       7b. la tete est PLUS BASSE que l'epaule (tete_y - epaule_y >= 1u) — la nuque a lache
//       7c. la tete n'est pas le point le plus haut du corps
//    8. PAS DE TRIANGLE FERME : interdit que les 2 mains soient a la fois proches (<20u) ET
//       toutes deux entre hanche et epaule en x (c'est exactement le defaut de A-ter).
//    9. ASYMETRIE DE RELACHEMENT : ecart de tension entre les 2 bras >= 15 points. Un corps
//       relache n'a jamais ses 2 bras dans la meme configuration.
//   10. RIEN DE LEVE (herite de A-ter) : aucun repere au-dessus de -46u.
//   11. AU MOINS UN BRAS VRAIMENT MOU : min(tension) <= 0.60. Un bras a 85% de portee "tend" vers
//       quelque chose ; a 50% il pend. C'est la traduction mesurable du RELACHEMENT MUSCULAIRE
//       qui manquait au round 1.
//   12. ⭐ AUCUN COUDE LEVE (ajoute apres le 2e rendu de ce round) : un coude au-dessus de
//       l'epaule = un bras qui PREND APPUI. Sur le rendu 2-B, les 5 variantes avaient la tete au
//       sol et lisaient POURTANT encore "il se souleve" — mesure : coude1 entre -19u et -34u pour
//       une epaule a -14u/-19u, donc pointe vers le haut. C'est le dernier reste du "triangle
//       ferme" de A-ter, deplace du couple de mains vers UN SEUL coude.
//       ⛔ Ce critere a ELIMINE V4 et V5 (0 solution) : leur mise en scene de bras EXIGE un coude
//       haut. Elimination par le calcul, pas par le gout — leur intention est incompatible avec ce
//       moteur, il ne sert a rien de les retoucher.
//
// ⭐ DEGAGEMENT MESURE SUR TOUS LES SEGMENTS (bras ET jambes ET buste), pas sur les articulations :
// un coude peut etre loin du crane pendant que l'humerus le traverse en plein milieu.
//
// METHODE : 5 MISES EN SCENE ecrites en francais AVANT toute recherche, chacune traduite en son
// domaine de recherche PROPRE (filtres de bras distincts). Le calcul choisit DANS une intention,
// il ne choisit jamais l'intention — c'est ce qui avait produit A-bis (optimum geometrique,
// contresens narratif).
//
// TECHNIQUE : frame-driven, zero Math.random, zero setTimeout / CSS transition / @keyframes.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

const W = 1920;
const H = 1080;

const NUIT = "#22345c";
const NUIT2 = "#182746";
const ENCRE = "#f0e8d2";
const ENCRE_FAIBLE = "rgba(240,232,210,0.34)";
const ALERTE = "#e0653f";
const OK = "#5fc98a";

const rad = (d: number) => (d * Math.PI) / 180;

// Echelle d'usage du registre — regle dure : les defauts invisibles a 74px deviennent grotesques
// ici, c'est donc a CETTE echelle qu'un verdict visuel a une valeur.
const PERSO_SCALE = 2.6;

// ============================================================================================
// LE MOTEUR <Stick> — RECOPIE CONFORME (convention : 180 = bras vers le haut)
// ============================================================================================
type PoseStick = {
  bob: number;
  leanBuste: number;
  leanTete: number;
  brasAvantAngle: number;
  brasArriereAngle: number;
  brasAvantCoude: number;
  brasArriereCoude: number;
  jambeAvant: number;
  jambeArriere: number;
  jambeAvantGenou: number;
  jambeArriereGenou: number;
  dx: number;
  dy: number;
  hancheY: number;
};

const POSE_NEUTRE: PoseStick = {
  bob: 0, leanBuste: 0, leanTete: 0,
  brasAvantAngle: 12, brasArriereAngle: -8,
  brasAvantCoude: 8, brasArriereCoude: 8,
  jambeAvant: 5, jambeArriere: -5,
  jambeAvantGenou: 0, jambeArriereGenou: 0,
  dx: 0, dy: 0, hancheY: -26,
};

const chaine = (
  ox: number, oy: number, l1: number, l2: number, racineAngle: number, flexion: number,
) => {
  const a1 = rad(racineAngle);
  const mx = ox + Math.sin(a1) * l1;
  const my = oy + Math.cos(a1) * l1;
  const a2 = rad(racineAngle + flexion);
  const ex = mx + Math.sin(a2) * l2;
  const ey = my + Math.cos(a2) * l2;
  return { mx, my, ex, ey };
};

const BRAS_L1 = 20;
const BRAS_L2 = 18;

const Stick: React.FC<{
  x: number; y: number; pose: PoseStick; couleur?: string; scale?: number;
  debug?: boolean;
  // ⭐ Le fix du cou trouve au round 1 : l'offset +3 en x de la tete est ABSOLU dans ce moteur,
  // il n'est pas tourne avec `leanBuste` — donc le cou S'ALLONGE des que le corps s'incline
  // (mesure : +2.40u debout, +5.00u a plat). Ici il est ACTIF PARTOUT pour ne pas juger une pose
  // deformee par un bug independant. ⛔ Il reste confine a ce prototype, le socle n'est pas touche.
  fixCou?: boolean;
}> = ({ x, y, pose, couleur = ENCRE, scale = 1, debug = false, fixCou = true }) => {
  const p = pose;
  const hx = 0;
  const hy = p.hancheY - p.bob;
  const busteL = 32;
  const sx = hx + Math.sin(rad(180 + p.leanBuste)) * busteL;
  const sy = hy + Math.cos(rad(180 + p.leanBuste)) * busteL;
  const teteA = rad(180 + p.leanBuste + p.leanTete);
  const lb = rad(p.leanBuste);
  const tx = sx + Math.sin(teteA) * 11 + (fixCou ? 3 * Math.cos(lb) : 3);
  const ty = sy + Math.cos(teteA) * 11 - (fixCou ? 3 * Math.sin(lb) : 0);

  const epX = sx + (hx - sx) * 0.12;
  const epY = sy + (hy - sy) * 0.12;
  const brasA = chaine(epX, epY, BRAS_L1, BRAS_L2, p.brasAvantAngle + p.leanBuste, p.brasAvantCoude);
  const brasB = chaine(epX, epY, BRAS_L1, BRAS_L2, -p.brasArriereAngle + p.leanBuste, -p.brasArriereCoude);

  const jbA = chaine(hx, hy, 17, 17, p.jambeAvant, p.jambeAvantGenou);
  const jbB = chaine(hx, hy, 17, 17, p.jambeArriere, p.jambeArriereGenou);

  const L = (a: number, b: number, c: number, d: number, w = 4.5, o = 1, key?: string) => (
    <line key={key} x1={a} y1={b} x2={c} y2={d} stroke={couleur} strokeWidth={w}
      strokeLinecap="round" opacity={o} />
  );

  return (
    <g transform={`translate(${x + p.dx * scale} ${y + p.dy * scale}) scale(${scale})`}>
      {L(hx, hy, jbB.mx, jbB.my, 4.5, 0.75, "jb1")}
      {L(jbB.mx, jbB.my, jbB.ex, jbB.ey, 4.5, 0.75, "jb2")}
      {L(epX, epY, brasB.mx, brasB.my, 4.2, 0.75, "brb1")}
      {L(brasB.mx, brasB.my, brasB.ex, brasB.ey, 4.2, 0.75, "brb2")}
      {L(hx, hy, sx, sy, 4.5, 1, "buste")}
      {L(hx, hy, jbA.mx, jbA.my, 4.5, 1, "ja1")}
      {L(jbA.mx, jbA.my, jbA.ex, jbA.ey, 4.5, 1, "ja2")}
      {L(epX, epY, brasA.mx, brasA.my, 4.2, 1, "bra1")}
      {L(brasA.mx, brasA.my, brasA.ex, brasA.ey, 4.2, 1, "bra2")}
      <circle cx={tx} cy={ty} r={9} fill={couleur} />
      {debug && (
        <g>
          <circle cx={tx} cy={ty} r={13} fill="none" stroke={ALERTE} strokeWidth={0.8}
            strokeDasharray="3 3" opacity={0.9} />
          <circle cx={brasA.mx} cy={brasA.my} r={2} fill={OK} />
          <circle cx={brasB.mx} cy={brasB.my} r={2} fill={OK} />
        </g>
      )}
    </g>
  );
};

// ============================================================================================
// LES 5 VARIANTES DU ROUND 2
// ============================================================================================
// ⛔ Chaque bloc de valeurs est le MEILLEUR representant de son intention, sorti du balayage sous
// les 15 contraintes (scripts `round2b.py` / `round2b_search.py`). Les valeurs ne sont pas
// retouchees a la main : ce qui est ecrit a la main, c'est L'INTENTION et son domaine de
// recherche, jamais le resultat.
//
// ⛔⛔ ETAT FINAL DU ROUND 2 — AUCUNE VARIANTE N'EST VALIDEE. Il faut le dire net plutot que de
// presenter la moins mauvaise comme un resultat. Sous le jeu COMPLET des 15 criteres :
//     V1 · V3 · V4 · V5 : 0 SOLUTION (elimination par le calcul, detail sur chaque bloc)
//     V2                : 1277 solutions, mais TOUTES partagent le meme corps — seule la flexion
//                         du coude varie. Et le rendu de ce corps unique ECHOUE AU REGARD (cf. le
//                         verdict sur son bloc). Le round 2 se termine donc SANS pose retenue.
// Les poses V1/V3/V4/V5 ci-dessous sont conservees comme LES MEILLEURS REPRESENTANTS AVANT le
// critere qui les a tuees, pour que le defaut soit VISIBLE sur la planche et pas seulement decrit.

// --- V1 « TETE LA PREMIERE » -----------------------------------------------------------------
// Intention : il est tombe en avant, la tete a touche avant le reste. Buste presque a plat, tete
// tombee vers le sol. Un bras est passe SOUS le buste (main derriere la hanche), l'autre est
// reste ou il etait, mou, coude au sol.
// ⛔ ELIMINEE PAR LE CALCUL (critere 15, les pieds au sol) : 0 solution. La pose affichee est son
// meilleur representant AVANT ce critere, et le defaut se VOIT — pied1 vole a 25.9u du sol pour une
// hanche a 8u, soit une jambe pointee vers le ciel. Cause : l'intention "buste presque a plat +
// jambes qui trainent derriere" pousse mecaniquement les jambes vers le haut des que la hanche
// descend au sol.
// Mesure avant elimination : degagement 16.06u · relief H/V 2.64 · tension 55%/87%
//          tete a 10.5u du sol (elle repose) · tete 6.2u SOUS l'epaule
const V1_TETE_PREMIERE: PoseStick = {
  ...POSE_NEUTRE,
  hancheY: -8, leanBuste: -72, leanTete: -60,
  jambeAvant: -95, jambeArriere: -98, jambeAvantGenou: -70, jambeArriereGenou: 50,
  brasAvantAngle: -20, brasAvantCoude: 114,
  brasArriereAngle: -28, brasArriereCoude: 58,
  bob: 0, dx: 0, dy: 0,
};

// --- V2 « SUR LE FLANC, RECROQUEVILLE » -------------------------------------------------------
// Intention : tombe de cote, genoux ramenes vers le ventre, tete rentree. Les deux bras devant
// mais a des HAUTEURS differentes (un au sol, un sur le flanc) — jamais en miroir.
// ⭐ SEULE VARIANTE A SURVIVRE AU CALCUL : 1277 solutions — mais toutes sur LE MEME corps, seule
// la flexion du coude varie. C'est deja un signal : l'espace n'est pas riche, il est residuel.
// Mesure : degagement 13.68u · relief H/V 1.94 · tension 80%/43%
//          tete a 14.4u du sol · tete 9.3u SOUS l'epaule · aucun coude au-dessus de l'epaule
// ⛔⛔ VERDICT VISUEL AU RENDU (echelle 2.6) : ELLE NE CONVAINC PAS NON PLUS. Ce que je vois :
//   · les jambes repliees forment une BOITE FERMEE a gauche (cuisse+tibia+buste font un carre) ;
//   · les 2 bras traversent le buste en diagonale — la silhouette est un enchevetrement de
//     segments, pas un corps ;
//   · `leanTete = -90` (tete rentree a fond) ouvre un VIDE de 3.26u entre le crane et le haut du
//     buste : la tete se DETACHE du corps au lieu d'y pendre. Le critere 7a la voulait basse, il
//     l'a obtenue en la decrochant. C'est encore une contrainte satisfaite par un contournement.
// => a l'oeil, ca lit "une forme abstraite", pas "un homme effondre". NON RETENUE.
const V2_FLANC_FOETUS: PoseStick = {
  ...POSE_NEUTRE,
  hancheY: -15, leanBuste: -72, leanTete: -90,
  jambeAvant: -22, jambeArriere: -95, jambeAvantGenou: -95, jambeArriereGenou: 80,
  brasAvantAngle: -20, brasAvantCoude: 74,
  brasArriereAngle: -20, brasArriereCoude: 130,
  bob: 0, dx: 0, dy: 0,
};

// --- V3 « BRAS ETALE, NUQUE LACHEE » ----------------------------------------------------------
// Intention : le corps est de cote, un bras est parti LOIN devant, completement etale au sol ;
// l'autre est plie court contre le torse. La nuque a lache.
// ⚠️ Le domaine de recherche autorisait la tete renversee EN ARRIERE (leanTete positif) : AUCUNE
// solution positive n'a survecu aux criteres 7a/7b/7c — renverser la tete la porte HAUT, ce que le
// critere positionnel refuse desormais. La solution retenue est donc a leanTete negatif.
// ⛔ ELIMINEE PAR LE CALCUL (critere 15) : 0 solution, 25 867 combinaisons rejetees pour
// "pied en l'air". Meme cause mecanique que V1, en pire : pied1 a 32.7u du sol.
// Mesure avant elimination : degagement 16.87u · relief H/V 2.02 · tension 82%/43%
//          tete a 7.3u du sol · tete 6.6u SOUS l'epaule
const V3_BRAS_ETALE: PoseStick = {
  ...POSE_NEUTRE,
  hancheY: -13, leanBuste: -88, leanTete: -40,
  jambeAvant: -100, jambeArriere: -91, jambeAvantGenou: -70, jambeArriereGenou: 55,
  brasAvantAngle: 52, brasAvantCoude: -70,
  brasArriereAngle: -40, brasArriereCoude: 130,
  bob: 0, dx: 0, dy: 0,
};

// --- V4 « GENOUX SOUS LUI » — ⛔ ELIMINEE PAR LE CALCUL (critere 12) ---------------------------
// Intention : il s'est effondre a genoux puis le buste est parti en avant. Hanche plus haute que
// le sol, jambes repliees SOUS le corps, tete et epaules basses. Un bras s'ecrase sous le buste.
// ⛔ 0 SOLUTION sous le critere 12 (aucun coude leve) : sur 749 574 combinaisons de bras testees
// pour cette intention, TOUTES placent au moins un coude au-dessus de l'epaule. Raison : avec la
// hanche remontee (-18 a -22) le buste est haut, et une main qui doit revenir SOUS lui force le
// coude a passer par le dessus. L'intention est incompatible avec ce moteur — la retoucher ne
// servirait a rien. La pose ci-dessous est le MEILLEUR representant AVANT le critere 12, garde
// UNIQUEMENT pour montrer le defaut (coude a -34.3u pour une epaule a -19.0u).
const V4_GENOUX_SOUS: PoseStick = {
  ...POSE_NEUTRE,
  hancheY: -18, leanBuste: -88, leanTete: -50,
  jambeAvant: -40, jambeArriere: -36, jambeAvantGenou: -125, jambeArriereGenou: 125,
  brasAvantAngle: -52, brasAvantCoude: 146,
  brasArriereAngle: -44, brasArriereCoude: 58,
  bob: 0, dx: 0, dy: 0,
};

// --- V5 « DOS AU SOL, TETE DE COTE » — ⛔ ELIMINEE PAR LE CALCUL (critere 12) ------------------
// Intention : sur le dos, tete tombee de cote, un bras rejete au sol dans le prolongement (pas en
// l'air), l'autre pose sur le ventre, mou.
// ⛔ 0 SOLUTION sous le critere 12. Raison : "la main sur le ventre" impose une main HAUTE
// (-28u < main_y < -6u) alors que l'epaule est basse (-14.9u) — le coude doit alors se lever pour
// que l'avant-bras remonte. La pose ci-dessous est le meilleur representant AVANT le critere 12,
// gardee pour montrer le defaut (coude a -22.4u pour une epaule a -14.9u).
const V5_DOS_TETE_COTE: PoseStick = {
  ...POSE_NEUTRE,
  hancheY: -12, leanBuste: -84, leanTete: -50,
  jambeAvant: -100, jambeArriere: -93, jambeAvantGenou: -65, jambeArriereGenou: 55,
  brasAvantAngle: -28, brasAvantCoude: 66,
  brasArriereAngle: -52, brasArriereCoude: 146,
  bob: 0, dx: 0, dy: 0,
};

// --- RAPPEL : A-TER, la moins mauvaise du round 1, pour comparer a echelle egale ---------------
const RAPPEL_A_TER: PoseStick = {
  ...POSE_NEUTRE,
  hancheY: -10, leanBuste: -72, leanTete: 0,
  jambeAvant: -60, jambeArriere: -100, jambeAvantGenou: -60, jambeArriereGenou: 45,
  brasAvantAngle: -55, brasAvantCoude: 95,
  brasArriereAngle: -10, brasArriereCoude: 65,
  bob: 0, dx: 0, dy: 0,
};

// ============================================================================================
// LA PLANCHE DE COMPARAISON
// ============================================================================================
const Case: React.FC<{
  cx: number; cy: number; titre: string; sous: string; verdict: string; ok: boolean;
  pose: PoseStick;
}> = ({ cx, cy, titre, sous, verdict, ok, pose }) => (
  <g>
    <line x1={cx - 220} y1={cy} x2={cx + 220} y2={cy} stroke={ENCRE_FAIBLE} strokeWidth={2} />
    <Stick x={cx} y={cy} pose={pose} scale={PERSO_SCALE} debug />
    <text x={cx} y={cy - 210} fill={ENCRE} fontSize={24} fontWeight={700} textAnchor="middle"
      fontFamily="Helvetica, Arial, sans-serif">{titre}</text>
    <text x={cx} y={cy - 184} fill={ENCRE} fontSize={16} opacity={0.72} textAnchor="middle"
      fontFamily="Helvetica, Arial, sans-serif">{sous}</text>
    <text x={cx} y={cy + 108} fill={ok ? OK : ALERTE} fontSize={17} fontWeight={700}
      textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif">{verdict}</text>
  </g>
);

export const TestPoseSolRound2: React.FC = () => {
  useCurrentFrame(); // frame-driven meme si la planche est statique
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 40%, ${NUIT} 0%, ${NUIT2} 100%)`,
    }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <text x={W / 2} y={46} fill={ENCRE} fontSize={28} fontWeight={700} textAnchor="middle"
          fontFamily="Helvetica, Arial, sans-serif">
          ROUND 2 — CORPS EFFONDRE · 5 intentions · AUCUNE RETENUE · &lt;Stick&gt; a l&apos;echelle d&apos;usage (2.6)
        </text>
        <text x={W / 2} y={78} fill={ENCRE} fontSize={17} opacity={0.7} textAnchor="middle"
          fontFamily="Helvetica, Arial, sans-serif">
          15 criteres · 4 intentions eliminees PAR LE CALCUL (0 solution) · la 5e (V2) survit au calcul mais echoue au regard
        </text>

        <Case cx={330} cy={400} pose={V1_TETE_PREMIERE}
          titre="V1 — tete la premiere"
          sous="ELIMINEE (critere 15) — 0 solution"
          verdict="pied a 25.9u du sol : jambe en l'air" ok={false} />

        <Case cx={960} cy={400} pose={V2_FLANC_FOETUS}
          titre="V2 — flanc, recroqueville"
          sous="SEULE a passer le calcul (1277 sol.)"
          verdict="mais ECHOUE AU REGARD : tete decrochee 3.3u" ok={false} />

        <Case cx={1590} cy={400} pose={V3_BRAS_ETALE}
          titre="V3 — bras etale, nuque lachee"
          sous="ELIMINEE (critere 15) — 0 solution"
          verdict="pied a 32.7u du sol : jambe en l'air" ok={false} />

        <Case cx={330} cy={870} pose={V4_GENOUX_SOUS}
          titre="V4 — genoux sous lui"
          sous="ELIMINEE PAR LE CALCUL — 0 solution"
          verdict="coude a -34.3u / epaule -19.0u : il POUSSE" ok={false} />

        <Case cx={960} cy={870} pose={V5_DOS_TETE_COTE}
          titre="V5 — dos au sol, tete de cote"
          sous="ELIMINEE PAR LE CALCUL — 0 solution"
          verdict="coude a -22.4u / epaule -14.9u : il POUSSE" ok={false} />

        <Case cx={1590} cy={870} pose={RAPPEL_A_TER}
          titre="RAPPEL — A-ter (round 1)"
          sous="la moins mauvaise, NON validee"
          verdict="triangle ferme · tete dans l'axe" ok={false} />
      </svg>
    </AbsoluteFill>
  );
};

export default TestPoseSolRound2;
