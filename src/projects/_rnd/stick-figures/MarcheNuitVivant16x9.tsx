import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  DEFS,
  PLAN_CIEL,
  PLAN_VILLE,
  PLAN_ETALS_FOND,
  PLAN_ETALS,
  PLAN_SOL,
  PLAN_AVANT,
} from "./marcheNuitGroupsB";
import {
  Figure,
  rad,
  LEG_LENGTH,
  HIP_Y_STANDING,
  walkPhaseFromSteps,
  BRAS_LAG,
} from "../../_shared/stick-figure-svg/StickFigure";
import { PersonnageRole, CARNATIONS } from "../../_shared/stick-figure-svg/identite/Roles";

/**
 * "LE MARCHE DE NUIT" — LA SCENE VIVANTE (2026-07-28)
 *
 * LE DEFI POSE PAR AZIZ : « prouver qu'on peut creer une vraie scene d'animation, meme si les
 * personnages ne reagissent pas directement entre eux ». Des marchands ARRETES a leurs etals qui
 * helent les passants, et des passants qui vaquent a leurs occupations en arriere-plan.
 *
 * ⭐ CE QUE CETTE SCENE PRECISE DANS LA DOCTRINE (elle ne la contredit PAS) :
 * La regle de la vague D dit « UN GROUPE IMMOBILE RESTE FIGE » — l'immobilite habitee appliquee a
 * N personnages produit un bobbing qui se lit comme un DEFAUT technique. Cette regle vaut pour des
 * personnages qui NE FONT RIEN. Ici les marchands FONT quelque chose : ils helent. C'est un GESTE
 * INTENTIONNEL (lever le bras, l'agiter, le redescendre), pas une respiration decorative.
 * -> La regle devient : pas de mouvement SANS INTENTION. Un geste, meme sur place, est legitime.
 *
 * DECOR : `marcheNuitGroupsB.ts` — choisi par AZIZ EN TEST AVEUGLE contre un autre modele
 * (« clairement plus riche, les etals sont beaucoup plus beaux, le ciel etoile avec la lune
 * vraiment plus beau, ca raconte une histoire »). Les positions d'etals ci-dessous sont MESUREES
 * dans ce fichier (comptoirs centres x=240, 908, 1580 ; bas des comptoirs y=778), pas estimees.
 *
 * ⛔ Registre : profil uniquement, aucun visage, socle IMPORTE, frame-driven pur.
 */

export const MARCHE_NUIT_VIVANT_FRAMES = 600; // 20s @ 30fps

const W = 1920;
const H = 1080;

// ⭐ GEOMETRIE MESUREE DANS LE DECOR (pas estimee a l'oeil)
const ETALS_X = [240, 908, 1580];   // centres des 3 comptoirs visibles
// ⛔ PIEGE DU PLACEMENT VERTICAL (mesure avant rendu, confirme au rendu v1) :
//  - MARCHAND a 792 -> ses pieds tombaient SOUS le comptoir (qui finit a y=778), donc ses
//    jambes depassaient en bas au lieu d'etre masquees. Un marchand DERRIERE son etal doit
//    avoir ses pieds AU-DESSUS du bas du comptoir : le comptoir le coupe a mi-corps.
//  - PASSANTS DU FOND a 862 -> ils marchaient DEVANT les etals (dont la base est a 778),
//    alors qu'ils sont censes passer DERRIERE. Il faut les remonter au-dessus de 778.
const SOL_MARCHAND = 768;           // pieds au-dessus du bas du comptoir -> jambes masquees
const SOL_PASSANT_FOND = 762;       // derriere les etals, dans la ruelle du fond
const SOL_PASSANT_AVANT = 946;      // rangee de devant, plus grande (plus proche)

// ⛔⛔ 17e PIEGE — LA PERSPECTIVE INVERSEE (repere par Aziz : « les marchands sont gigantesques
// tandis que les passants sont dans une taille normale »). MESURE : marchand 198px de haut,
// passant du premier plan 174px — alors que le marchand est le PLUS LOIN de la camera (sol
// y=768 contre 946). Un personnage plus loin doit etre PLUS PETIT. J'avais regle chaque scale
// A L'OEIL, un par un, au lieu de le DERIVER de la profondeur.
// ⭐ REGLE : dans une scene au sol, la taille n'est JAMAIS un reglage libre — c'est une
// FONCTION de la position en profondeur. Une seule ligne d'horizon, une seule echelle, et tous
// les personnages y obeissent. C'est ce qui fait qu'ils appartiennent au meme monde.
const Y_HORIZON = 700;   // la ou un personnage serait infiniment loin (taille mini)
const Y_PROCHE = 1000;   // le bas du cadre (taille maxi)
const SCALE_LOIN = 1.35;
const SCALE_PRES = 2.30;
const scaleAt = (solY: number) => {
  const t = Math.max(0, Math.min(1, (solY - Y_HORIZON) / (Y_PROCHE - Y_HORIZON)));
  return SCALE_LOIN + (SCALE_PRES - SCALE_LOIN) * t;
};

const SWING = 18;
const PAS_L = 2 * LEG_LENGTH * Math.sin(rad(SWING));

// ===========================================================================
// LES MARCHANDS — arretes, mais PAS figes : ils helent.
// ===========================================================================
// Le geste : lever le bras vers les passants, l'agiter 2-3 fois, le redescendre, attendre.
// ⭐ DESYNCHRONISATION PAR RAPPORTS IRRATIONNELS (regle du socle, brique 5) : phi, e, sqrt(2).
// Un simple offset de phase retombe parfois sur des postures identiques par coincidence — a
// 3 marchands ca se verrait immediatement comme une chorégraphie.
const PHI = 1.618033988;
const E = 2.718281828;
const SQRT2 = 1.414213562;
const DESYNC = [0, PHI, E];          // decalage temporel par marchand
const PERIODE = [196, 232, 214];     // duree d'un cycle heler+attente, differente pour chacun

// ⭐ LES 3 MARCHANDS SONT DIFFERENCIES (retour d'Aziz : « les marchands aussi devraient se
// differencier »). Roles + carnations distincts, comme les passants — ils ne sont plus de
// simples stick figures nues a cote de passants habilles.
// ⚠️ Le 3e (`actif: false`) NE HELE JAMAIS : il attend, point. C'est la demande d'Aziz —
// « peut-etre que le marchand A leve la main en meme temps que le marchand B mais le marchand
// C reste immobile ». Un marche ou TOUS helent en boucle se lit comme un mecanisme.
const MARCHANDS = [
  { role: "commercante" as const, carnation: 2, actif: true },
  { role: "agriculteur" as const, carnation: 4, actif: true },
  { role: "fonctionnaire" as const, carnation: 1, actif: false },
];

type Marchand = {
  brasDeg: number;      // angle du bras qui hele (0 = pend, 180 = leve)
  torsoDeg: number;
  appui: number;        // -1..1 : transfert de poids lent (le corps n'est jamais fige net)
};

const marchandAt = (frame: number, i: number): Marchand => {
  const p = PERIODE[i];
  const actif = MARCHANDS[i].actif;
  const t = ((frame + DESYNC[i] * 61) % p) / p;   // 0..1 sur le cycle

  // Le cycle : 0->0.12 le bras monte · 0.12->0.34 il agite · 0.34->0.46 il redescend ·
  // 0.46->1 il attend (bras le long du corps). L'attente occupe la MOITIE du temps : un
  // marchand ne hele pas en continu, sinon ca devient un moulin.
  let brasDeg: number;
  if (t < 0.12) {
    const u = t / 0.12;
    brasDeg = 148 * (u * u * (3 - 2 * u));         // monte franchement
  } else if (t < 0.34) {
    const u = (t - 0.12) / 0.22;
    // il AGITE : 2.5 oscillations autour de la position haute
    brasDeg = 148 + 22 * Math.sin(u * Math.PI * 5);
  } else if (t < 0.46) {
    const u = (t - 0.34) / 0.12;
    brasDeg = 148 * (1 - u * u * (3 - 2 * u));      // redescend
  } else {
    brasDeg = 0;
  }
  // le marchand "passif" ne hele pas : seul son transfert de poids le rend vivant
  if (!actif) brasDeg = 0;

  // ⭐ LE TRANSFERT DE POIDS — la reponse a « comment ne pas etre fige sans que ce soit bizarre ».
  // TRES lent (periode ~7s, irrationnelle par marchand) et de faible amplitude. Contrairement au
  // bobbing rejete en vague D, un transfert de poids est un DEPLACEMENT DU CENTRE DE GRAVITE :
  // il se lit comme quelqu'un qui attend debout, pas comme une vibration technique.
  const appui = Math.sin((frame / (188 + i * 31)) * Math.PI * 2 + i * SQRT2);

  return {
    brasDeg,
    // quand il hele, il se redresse legerement (l'intention passe par tout le corps)
    torsoDeg: 3 + (brasDeg > 20 ? 2.5 : 0) + appui * 1.2,
    appui,
  };
};

// ===========================================================================
// LES PASSANTS — ils traversent, chacun a sa vitesse et sa profondeur.
// ===========================================================================
type Passant = {
  x: number;
  pas: number;
  scale: number;
  swing: number;
  lean: number;
  sol: number;
  versGauche: boolean;
  couleur: string;
  role: "commercante" | "agriculteur" | "mineur" | "fonctionnaire" | null;
  opacity: number;
};

// 5 passants : 2 dans la rangee du fond (petits, ternes), 3 devant (plus grands).
// ⚠️ Vitesses et departs volontairement IRRATIONNELS entre eux : sinon deux passants se
// retrouvent au meme x au meme moment et se superposent (collision visuelle).
// ⭐ RYTHMES VARIES (retour d'Aziz : « les gens qui marchent pourraient marcher a differents
// rythmes. La tout le monde marche assez lentement. Certains disparaissent en dehors de
// l'ecran plus vite que d'autres et ne reviennent pas, tandis que d'autres prennent leur
// temps »). Les vitesses vont maintenant de 0.48 (flanerie) a 2.05 (pressee) pas/seconde —
// un rapport de 4x, contre 1.7x avant, ou tout le monde se ressemblait.
// ⚠️ `swing` varie AVEC la vitesse : un marcheur presse allonge le pas ET penche le buste
// (c'est la marche rapide validee en vague A, « surtout la rapide avec le corps penche »).
// ⚠️ Les `sol` sont legerement decales entre passants d'une meme zone : deux personnages
// exactement sur la meme ligne se lisent comme un decor plat.
// ⚠️ Les `x0` ne sont PAS choisis a l'oeil : ils sont issus d'une recherche par balayage qui
// minimise les chevauchements sur les 600 frames (resultat : 10 frames a >=57px d'ecart, soit
// deux personnes qui se croisent — pas une superposition).
const PASSANTS = [
  // le fond : lointains, en silhouette, allures moyennes
  { x0: -140, vit: 0.74, sol: SOL_PASSANT_FOND,      versGauche: false, c: 4, role: null,          op: 0.5,  swing: 18, lean: 2 },
  { x0: 2180, vit: 1.32, sol: SOL_PASSANT_FOND - 6,  versGauche: true,  c: 2, role: null,          op: 0.5,  swing: 21, lean: 5 },
  // l'avant : habilles, tailles derivees de leur profondeur
  { x0: -860, vit: 0.48, sol: SOL_PASSANT_AVANT - 22, versGauche: false, c: 3, role: "agriculteur", op: 1,   swing: 15, lean: 0 },
  { x0: 2260, vit: 2.05, sol: SOL_PASSANT_AVANT,      versGauche: true,  c: 1, role: "commercante", op: 1,   swing: 24, lean: 8 },
  { x0: -1020, vit: 1.05, sol: SOL_PASSANT_AVANT + 18, versGauche: false, c: 0, role: "mineur",      op: 1,   swing: 19, lean: 3 },
] as const;

const passantAt = (frame: number, i: number): Passant => {
  const P = PASSANTS[i];
  // ⭐ LA TAILLE DECOULE DE LA PROFONDEUR — jamais reglee a la main (cf. 17e piege).
  const scale = scaleAt(P.sol);
  // ⭐ VERROU PAS/DISTANCE : on derive le nombre de pas, puis x. Jamais l'inverse.
  // La vitesse est exprimee en PAS PAR SECONDE, pas en pixels — le pied ne patine donc jamais.
  // ⚠️ PAS_L depend du swing PROPRE a ce passant : un marcheur presse fait de plus grands pas.
  const pasL = 2 * LEG_LENGTH * Math.sin(rad(P.swing));
  const pasParFrame = P.vit / 30;
  const pas = frame * pasParFrame;
  const dir = P.versGauche ? -1 : 1;
  const xLocal = P.x0 + dir * pas * pasL * scale;
  // ils bouclent : quand un passant sort du cadre, il rentre de l'autre cote
  const span = 2600;
  let x = xLocal;
  if (dir > 0) x = ((xLocal + 400) % span + span) % span - 400;
  else x = span - (((span - xLocal + 400) % span + span) % span) - 400;

  return {
    x,
    pas,
    scale,
    swing: P.swing,
    lean: P.lean,
    sol: P.sol,
    versGauche: P.versGauche,
    couleur: CARNATIONS[P.c].couleur,
    role: P.role,
    opacity: P.op,
  };
};

// ---------------------------------------------------------------------------
export const MarcheNuitVivant16x9: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a2238" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />

        {/* ===== DECOR : fond ===== */}
        <g dangerouslySetInnerHTML={{ __html: PLAN_CIEL }} />
        <g dangerouslySetInnerHTML={{ __html: PLAN_VILLE }} />
        <g dangerouslySetInnerHTML={{ __html: PLAN_ETALS_FOND }} />

        {/* ===== LES PASSANTS DU FOND — derriere les etals principaux, en silhouette =====
            La nuit fait le tri : eloignes et peu contrastes, ils se lisent comme une presence,
            pas comme des sujets. C'est ce qui permet d'en avoir plusieurs sans saturer. */}
        {[0, 1].map((i) => {
          const p = passantAt(frame, i);
          return (
            <g key={`fond${i}`} opacity={p.opacity}>
              <g transform={`translate(${p.x} ${p.sol}) scale(${p.versGauche ? -p.scale : p.scale} ${p.scale})`}>
                <Figure
                  x={0} y={0}
                  phase={walkPhaseFromSteps(p.pas)}
                  p={{ swingMax: p.swing, bobAmp: 2.2, armSwing: 15 + p.swing * 0.3, lean: p.lean }}
                  color={p.couleur}
                />
              </g>
            </g>
          );
        })}

        {/* ===== LES ETALS (plan principal) ===== */}
        <g dangerouslySetInnerHTML={{ __html: PLAN_ETALS }} />

        {/* ===== LES MARCHANDS — DERRIERE leur comptoir, ils helent =====
            Montes APRES le plan des etals : le comptoir passe devant leurs jambes, donc on ne
            voit que leur buste — exactement comme un vrai marchand derriere son etal. */}
        {ETALS_X.map((ex, i) => {
          const m = marchandAt(frame, i);
          return (
            <g key={`m${i}`} transform={`translate(${ex - 96} ${SOL_MARCHAND}) scale(${scaleAt(SOL_MARCHAND)})`}>
              {/* ⭐ HABILLES comme les passants (retour Aziz) : role + carnation distincts.
                  Un marchand en stick figure nue a cote de passants habilles cassait l'unite
                  de la scene. `avecObjet={false}` : leurs mains servent a heler, pas a tenir. */}
              <PersonnageRole
                x={0} y={0}
                phase={0}
                scale={1}
                role={MARCHANDS[i].role}
                couleur={CARNATIONS[MARCHANDS[i].carnation].couleur}
                pose={{
                  hipY: HIP_Y_STANDING + Math.abs(m.appui) * 0.8,
                  torsoDeg: m.torsoDeg,
                  // les appuis : ecartes, le poids bascule lentement de l'un a l'autre
                  leg1Deg: 9 + m.appui * 4,
                  leg2Deg: -11 + m.appui * 4,
                  // LE BRAS QUI HELE (convention socle : 0 = pend, 180 = leve)
                  arm1Deg: m.brasDeg,
                  arm2Deg: -4 + m.appui * 3,
                }}
                avecObjet={false}
              />
            </g>
          );
        })}

        {/* ===== LE SOL et ses flaques de lumiere ===== */}
        <g dangerouslySetInnerHTML={{ __html: PLAN_SOL }} />

        {/* ===== LES PASSANTS DE DEVANT — plus grands, habilles (roles), pleine opacite =====
            Ils passent DEVANT le sol et ses flaques, donc devant les marchands : la profondeur
            se lit par la taille ET par l'ordre de rendu. */}
        {[2, 3, 4].map((i) => {
          const p = passantAt(frame, i);
          return (
            <g key={`av${i}`} transform={`translate(${p.x} ${p.sol})`}>
              <g transform={`scale(${p.versGauche ? -p.scale : p.scale} ${p.scale})`}>
                {p.role ? (
                  <PersonnageRole
                    x={0} y={0}
                    phase={walkPhaseFromSteps(p.pas)}
                    scale={1}
                    role={p.role}
                    couleur={p.couleur}
                    p={{ swingMax: p.swing, bobAmp: 2.5, armSwing: 15 + p.swing * 0.35, lean: p.lean }}
                    pose={{ torsoDeg: 4 + p.lean }}
                    avecObjet={false}
                  />
                ) : (
                  <Figure
                    x={0} y={0}
                    phase={walkPhaseFromSteps(p.pas)}
                    p={{ swingMax: p.swing, bobAmp: 2.5, armSwing: 15 + p.swing * 0.35, lean: p.lean }}
                    color={p.couleur}
                  />
                )}
              </g>
            </g>
          );
        })}

        {/* ===== PREMIER PLAN — passe devant tout le monde ===== */}
        <g dangerouslySetInnerHTML={{ __html: PLAN_AVANT }} />
      </svg>
    </AbsoluteFill>
  );
};

export default MarcheNuitVivant16x9;
