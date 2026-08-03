// ============================================================================================
// BANC D'ESSAI JETABLE — POSE "AU SOL" POUR LE MOTEUR <Stick>  (2026-08-03)
// ============================================================================================
//
// ⛔ CE FICHIER EST UN PROTOTYPE DE COMPARAISON, PAS DU CODE DE PRODUCTION. Il n'est reference
// que par sa propre composition Remotion et ne modifie AUCUN fichier partage. Le socle
// `_shared/stick-figure-svg/StickFigure.tsx` n'est ni importe ni touche ici.
//
// POURQUOI : le prototype EnchainementGestesExpressifs.tsx s'arrete a l'effondrement EN COURS
// (P_CHUTE) parce que la pose "corps a plat" (P_SOL) y a ete jugee INDESSINABLE par ce moteur :
// les bras se refermaient autour de la tete en losange. Le fichier conclut a une contrainte
// "purement arithmetique" liee a la LONGUEUR DU BRAS (38u pour une cible a 31-32u).
//
// ⭐⭐ CE QUE LA MESURE A MONTRE, ET QUI CORRIGE CE DIAGNOSTIC (scripts de geometrie, cf. rapport) :
// la longueur du bras n'est PAS la cause. En balayant les longueurs de 14u a 46u de portee,
// le sous-probleme reste insoluble POUR TOUTES. La vraie cause est la COLLINEARITE de P_SOL :
// dans cette pose, hanche / epaule / tete sont TOUTES LES TROIS a y = -3, parfaitement alignees
// a l'horizontale. La tete est donc un disque de rayon 9u pose a 17.84u DEVANT l'epaule, dans
// l'axe exact du bras — et "poser la main au sol DEVANT la tete" oblige a traverser ce disque,
// quelle que soit la geometrie du membre. C'est une contrainte de DIRECTION, pas de LONGUEUR.
//
// CONSEQUENCE : ce qui debloque n'est pas de changer le bras (option B), c'est de changer
// L'INTENTION du bras — ne plus l'envoyer devant la tete. D'ou l'option A.
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
// LE MOTEUR <Stick> — RECOPIE CONFORME du prototype (donc de GestesExpressifs16x9)
// ============================================================================================
// ⛔ Convention : 180 = bras vers le haut (l'INVERSE du socle). Tout ce fichier vit dans CETTE
// convention. La seule chose parametree ici est la GEOMETRIE du bras (l1, l2), pour pouvoir
// dessiner l'option B sans dupliquer le composant.
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

// Geometrie de bras par defaut du moteur actuel.
const BRAS_L1 = 20;
const BRAS_L2 = 18;

const Stick: React.FC<{
  x: number; y: number; pose: PoseStick; couleur?: string; scale?: number;
  l1?: number; l2?: number;
  // debug : marque la tete et les articulations pour verifier a l'oeil ce que le calcul annonce
  debug?: boolean;
  // ⭐ BUG TROUVE EN CHEMIN (independant de la question des bras) : dans ce moteur, l'offset de
  // +3 en x de la tete est ABSOLU — il n'est pas tourne avec le buste. Le socle <Figure>, lui,
  // le fait tourner (`3*cos(torso)` / `3*sin(torso)`). Consequence : des que le corps s'incline,
  // le cou S'ALLONGE et la tete se detache visuellement du buste.
  //   MESURE du gap au cou (distance haut-du-buste au bord du crane) :
  //     debout (0 deg)   : +2.40u  ( +6.2 px)   <- normal
  //     P_CHUTE (-58)    : +4.64u  (+12.1 px)   <- la pose actuellement livree est deja touchee
  //     a plat  (-90)    : +5.00u  (+13.0 px)
  // Le fix rend le cou CONSTANT a 2.40u a toutes les inclinaisons, et ne change RIEN a 0 deg —
  // donc zero regression sur les poses debout des planches validees. Mis derriere un flag pour
  // que la comparaison avant/apres soit visible dans la meme image.
  fixCou?: boolean;
}> = ({ x, y, pose, couleur = ENCRE, scale = 1, l1 = BRAS_L1, l2 = BRAS_L2, debug = false,
        fixCou = false }) => {
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
  const brasA = chaine(epX, epY, l1, l2, p.brasAvantAngle + p.leanBuste, p.brasAvantCoude);
  const brasB = chaine(epX, epY, l1, l2, -p.brasArriereAngle + p.leanBuste, -p.brasArriereCoude);

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
          {/* le "couloir interdit" : le disque de degagement de 13u autour du centre du crane */}
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
// LES 4 POSES COMPAREES
// ============================================================================================

// --- REFERENCE 1 : P_CHUTE portee (ce que le prototype actuel affiche en fin de chaine).
// Valeurs issues du portage IK deja fait dans EnchainementGestesExpressifs.tsx, recopiees
// telles quelles (verifiees par mon script : coude1 a 13.84u, coude2 a 18.38u de la tete).
const POSE_CHUTE_PORTEE: PoseStick = {
  ...POSE_NEUTRE,
  hancheY: -20, leanBuste: -58, leanTete: 0,
  jambeAvant: -30, jambeArriere: -52, jambeAvantGenou: -14, jambeArriereGenou: 8,
  brasAvantAngle: 217.4735, brasAvantCoude: -60.8161,
  brasArriereAngle: -233.0704, brasArriereCoude: 67.8731,
  bob: 0, dx: 0, dy: 0,
};

// --- REFERENCE 2 : P_SOL portee par IK — LE DEFAUT A REPRODUIRE.
// C'est la pose qui a ete VUE au render et rejetee (bras refermes autour de la tete).
// On la RE-DESSINE volontairement pour que la comparaison soit honnete : on ne compare pas une
// proposition a une description, mais a l'image du defaut reel.
// (valeurs produites par le meme portage IK, meilleure des 4 combinaisons de sens de coude)
const POSE_SOL_PORTEE_IK: PoseStick = {
  ...POSE_NEUTRE,
  hancheY: -3, leanBuste: -90, leanTete: 0,
  jambeAvant: -86, jambeArriere: -100, jambeAvantGenou: -8, jambeArriereGenou: 10,
  brasAvantAngle: 212.9299, brasAvantCoude: -66.2781,
  brasArriereAngle: -142.8459, brasArriereCoude: -71.6559,
  bob: 0, dx: 0, dy: 0,
};

// --- ⭐ OPTION A : LA POSE "AU SOL" NATIVE.
// LE CORPS est celui de P_SOL, inchange (correspondance demontree a 0.00u entre les 2 moteurs) :
// hanche -3, buste a plat, jambes qui trainent derriere. On n'invente RIEN du corps.
// LES BRAS sont les seuls termes neufs, et ils ne sont PAS choisis au juge : ils sortent d'un
// balayage exhaustif (pas de 1 deg sur la racine, 2 deg sur la flexion) sous 5 contraintes
// mesurees — degagement de la tete > 13u sur les SEGMENTS (pas seulement les articulations),
// rien sous le sol, coude et main poses au sol, tension <= 89% (regle dure : jamais de bras en
// butee), et ecart entre les 2 bras > 8u (regle dure : 2 membres au meme angle = 1 seul trait).
//
// INTENTION (formulee AVANT la recherche, pas deduite du resultat) : "il vient de s'effondrer.
// Le bras du dessous est pris SOUS le buste, coude casse ; celui du dessus est retombe LE LONG
// DU CORPS, coude au sol, avant-bras ramene vers le bassin. Un corps qui ne se rattrape plus ne
// tend plus les bras devant : les bras ne cherchent plus rien, ils suivent."
//
// ⚠️ CE RENONCEMENT EST UN JUGEMENT NARRATIF, PAS UN RESULTAT DE CALCUL, et il est le vrai objet
// de la decision : on abandonne la position de main de P_SOL (les 2 mains projetees devant a
// x~+59). Cette position a un sens dans P_SOL parce qu'elle prepare LA SUITE du geste (les mains
// vont pousser pour se relever). Ici la chaine s'arrete a l'effondrement : les mains n'ont plus
// rien a pousser.
const POSE_A_SOL_NATIVE: PoseStick = {
  ...POSE_NEUTRE,
  hancheY: -3, leanBuste: -90, leanTete: 0,
  jambeAvant: -86, jambeArriere: -100, jambeAvantGenou: -8, jambeArriereGenou: 10,
  brasAvantAngle: -26, brasAvantCoude: 56,
  brasArriereAngle: -14, brasArriereCoude: 66,
  bob: 0, dx: 0, dy: 0,
};

// --- ⭐⭐ OPTION A-BIS : LA POSE QUE LE RENDU A RENDUE NECESSAIRE.
// L'option A passe le CALCUL mais ECHOUE AU REGARD : vue a l'echelle d'usage, elle ne se lit pas
// comme un corps effondre mais comme un BATON POSE. Mesure de ce que l'oeil a vu :
//     OPTION A : etalement vertical 14.2u / horizontal 79.9u -> ratio H/V = 5.6  (une barre)
//     P_CHUTE  : etalement vertical 67.1u                    -> ratio H/V = 1.1  (lisible)
// Le corps STRICTEMENT a plat degenere en trait. C'est la regle dure du registre ("2 membres au
// meme angle = un seul trait") mais appliquee au CORPS ENTIER — un cas que le registre n'avait
// pas encore formule, et que le calcul de degagement de tete ne pouvait pas voir.
//
// ⭐ CRITERE NEUF ajoute aux 5 autres : RATIO H/V <= 2.6 (garder du RELIEF VERTICAL).
// INTENTION : "il est tombe SUR LE FLANC. Bassin et jambes au sol, mais le buste n'est pas
// completement a plat — l'epaule est encore relevee, comme un corps qui vient de basculer et
// dont le haut n'a pas fini de descendre."
// Issue du meme balayage exhaustif, sous les 6 contraintes : degagement 17.80u, ratio H/V 1.50,
// ecart entre bras 37.0u, tension 88%/49%.
const POSE_A_BIS_FLANC: PoseStick = {
  ...POSE_NEUTRE,
  hancheY: -10, leanBuste: -80, leanTete: 0,
  jambeAvant: -100, jambeArriere: -95, jambeAvantGenou: -50, jambeArriereGenou: 50,
  brasAvantAngle: -90, brasAvantCoude: -56,
  brasArriereAngle: -45, brasArriereCoude: -122,
  bob: 0, dx: 0, dy: 0,
};

// --- ⭐⭐⭐ OPTION A-TER : la pose COMPOSEE A LA MAIN, apres l'echec visuel de A ET de A-bis.
// A-bis passe le calcul (17.8u de degagement, relief 1.50) mais echoue AUSSI au regard : vue de
// pres, elle ne lit pas "effondre" mais "qui se debat" — un bras pointe vers le haut, les
// membres s'ecartent. L'optimiseur avait maximise le RELIEF et trouve une silhouette lisible
// mais NARRATIVEMENT FAUSSE. C'est la limite de l'approche par score : aucun de mes criteres
// numeriques ne distinguait "corps qui gît" de "corps qui se debat".
//
// ⭐ CONTRAINTE NEUVE, tiree de l'echec de A-bis : RIEN NE DOIT ETRE LEVE. On borne le point le
// plus haut du corps (aucun repere au-dessus de -46u) — un corps effondre RETOMBE, il ne pointe
// pas. Plus des jambes repliees VERS L'AVANT (foetus) et non ecartees en l'air.
// Resultat : degagement 17.72u, relief H/V 2.55, point le plus haut -30.7u, tension 68%/84%.
const POSE_A_TER_EFFONDRE: PoseStick = {
  ...POSE_NEUTRE,
  hancheY: -10, leanBuste: -72, leanTete: 0,
  jambeAvant: -60, jambeArriere: -100, jambeAvantGenou: -60, jambeArriereGenou: 45,
  brasAvantAngle: -55, brasAvantCoude: 95,
  brasArriereAngle: -10, brasArriereCoude: 65,
  bob: 0, dx: 0, dy: 0,
};

// --- OPTION B : MEME pose de bras "devant la tete" que P_SOL, mais avec un bras RACCOURCI.
// Sert a MONTRER, et pas seulement affirmer, que raccourcir le bras ne resout pas le probleme :
// le pli se loge ailleurs mais le membre traverse toujours le crane, parce que la tete est dans
// l'axe. (Geometrie B1 : 20+14 au lieu de 20+18.)
const POSE_B_SOL_BRAS_COURT: PoseStick = { ...POSE_SOL_PORTEE_IK };

// ============================================================================================
// LA PLANCHE DE COMPARAISON
// ============================================================================================
const Case: React.FC<{
  cx: number; cy: number; titre: string; sous: string; verdict: string; ok: boolean;
  pose: PoseStick; l1?: number; l2?: number; fixCou?: boolean;
}> = ({ cx, cy, titre, sous, verdict, ok, pose, l1, l2, fixCou }) => (
  <g>
    <line x1={cx - 230} y1={cy} x2={cx + 230} y2={cy} stroke={ENCRE_FAIBLE} strokeWidth={2} />
    <Stick x={cx} y={cy} pose={pose} scale={PERSO_SCALE} l1={l1} l2={l2} debug fixCou={fixCou} />
    <text x={cx} y={cy - 250} fill={ENCRE} fontSize={26} fontWeight={700} textAnchor="middle"
      fontFamily="Helvetica, Arial, sans-serif">{titre}</text>
    <text x={cx} y={cy - 220} fill={ENCRE} fontSize={18} opacity={0.72} textAnchor="middle"
      fontFamily="Helvetica, Arial, sans-serif">{sous}</text>
    <text x={cx} y={cy + 120} fill={ok ? OK : ALERTE} fontSize={20} fontWeight={700}
      textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif">{verdict}</text>
  </g>
);

export const TestPoseSolOptions: React.FC = () => {
  useCurrentFrame(); // frame-driven meme si la planche est statique
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 40%, ${NUIT} 0%, ${NUIT2} 100%)`,
    }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <text x={W / 2} y={54} fill={ENCRE} fontSize={30} fontWeight={700} textAnchor="middle"
          fontFamily="Helvetica, Arial, sans-serif">
          POSE « AU SOL » — moteur &lt;Stick&gt; a l&apos;echelle d&apos;usage (2.6)
        </text>
        <text x={W / 2} y={90} fill={ENCRE} fontSize={19} opacity={0.7} textAnchor="middle"
          fontFamily="Helvetica, Arial, sans-serif">
          cercle pointille = degagement de 13u exige autour du crane · points verts = coudes
        </text>

        <Case cx={330} cy={420} pose={POSE_CHUTE_PORTEE}
          titre="REFERENCE — P_CHUTE"
          sous="ce que le prototype affiche aujourd'hui"
          verdict="degage (11.8u au segment)" ok />

        <Case cx={810} cy={420} pose={POSE_SOL_PORTEE_IK}
          titre="LE DEFAUT — P_SOL par IK"
          sous="bras 20+18, mains imposees devant"
          verdict="ECHEC : 7.2u — bras dans la tete" ok={false} />

        <Case cx={1290} cy={420} pose={POSE_B_SOL_BRAS_COURT} l1={20} l2={14}
          titre="OPTION B — bras raccourci"
          sous="20+14 (portee 34u), meme intention"
          verdict="ECHEC AUSSI : la tete est dans l'axe" ok={false} />

        <Case cx={330} cy={880} pose={POSE_A_SOL_NATIVE}
          titre="OPTION A — au sol NATIVE (a plat)"
          sous="bras le long du corps, jamais devant la tete"
          verdict="calcul OK (17.8u) — mais LIT COMME UN BATON" ok={false} />

        <Case cx={810} cy={880} pose={POSE_A_BIS_FLANC}
          titre="OPTION A-BIS — sur le FLANC"
          sous="calcul OK, relief OK"
          verdict="mais LIT 'se debat', pas 'effondre'" ok={false} />

        <Case cx={1290} cy={880} pose={POSE_A_TER_EFFONDRE} fixCou
          titre="⭐ OPTION A-TER — compose a la main"
          sous="rien de leve + fix du cou"
          verdict="17.7u · H/V 2.55 · tension 68/84%" ok />

        {/* NOTE — placee en zone libre (colonne de droite, bande haute) */}
        <text x={1560} y={600} fill={ENCRE} fontSize={17} opacity={0.8} fontWeight={700}
          fontFamily="Helvetica, Arial, sans-serif">Pourquoi B echoue :</text>
        <text x={1560} y={626} fill={ENCRE} fontSize={15} opacity={0.66}
          fontFamily="Helvetica, Arial, sans-serif">hanche / epaule / tete sont TOUTES a</text>
        <text x={1560} y={648} fill={ENCRE} fontSize={15} opacity={0.66}
          fontFamily="Helvetica, Arial, sans-serif">y = -3 : le corps est une ligne, et la</text>
        <text x={1560} y={670} fill={ENCRE} fontSize={15} opacity={0.66}
          fontFamily="Helvetica, Arial, sans-serif">tete un disque de 9u DANS l&apos;axe du bras.</text>
        <text x={1560} y={698} fill={ALERTE} fontSize={15} fontWeight={700}
          fontFamily="Helvetica, Arial, sans-serif">Aucune longueur (14u a 46u de portee)</text>
        <text x={1560} y={720} fill={ALERTE} fontSize={15} fontWeight={700}
          fontFamily="Helvetica, Arial, sans-serif">ne debloque : 0 solution partout.</text>
        <text x={1560} y={748} fill={ENCRE} fontSize={15} opacity={0.66}
          fontFamily="Helvetica, Arial, sans-serif">Ce n&apos;est pas la LONGUEUR, c&apos;est la DIRECTION.</text>
      </svg>
    </AbsoluteFill>
  );
};

export default TestPoseSolOptions;
