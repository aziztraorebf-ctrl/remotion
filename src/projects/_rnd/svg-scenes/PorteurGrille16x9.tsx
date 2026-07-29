// =============================================================================================
// ⭐ 3e MANCHE — LA GRILLE (fixe vs deformee) + UN GRAPHIQUE EN HAUT DU CADRE (2026-07-29)
//
// CE QUE CETTE VARIANTE CHANGE par rapport a PorteurPousse16x9 :
//  - ⛔ LE COMPTEUR COLLE AU SAC EST RETIRE. Diagnostic d'Aziz, plus juste que le mien : je
//    craignais un probleme de FOND (montant vs ratio) ; le vrai probleme etait la PLACE. Un
//    chiffre colle au sac est lu comme une ETIQUETTE DU SAC — il double l'objet au lieu
//    d'ajouter une couche d'information.
//  - ✅ UN CAMEMBERT en haut du cadre, dans la zone vide qui ne servait a rien.
//    ⭐ Il porte une information que LE CORPS NE PEUT PAS PORTER : la COMPOSITION de la dette
//    (a qui elle est due), pas son montant. Le corps porte le POIDS, le graphique porte la
//    STRUCTURE. C'est la condition etablie le matin meme : un element ne se justifie que s'il
//    porte une information que les autres ne portent pas deja. Un camembert qui dirait "la dette
//    monte" redirait le sac — celui-ci dit autre chose.
//    Il se construit UNE FOIS sur le mot "interets" (frame 163, forced-align) puis reste STABLE :
//    pas de pulsation en boucle, qui en ferait un element decoratif qui prend de l'attention.
//  - ✅ UNE GRILLE, en 2 modes compares (prop `grille`) :
//      "fixe"     = grille d'ingenieur reguliere, immobile (la proposition telle quelle)
//      "deformee" = la grille SUIT le creux du sol -> elle cesse d'etre un fond et devient la
//                   materialisation du terrain qui cede. Elle PARTICIPE.
//    C'est une 3e manche du test decor du matin, sur un objet bien plus discret qu'un skyline.
//
// CONSERVE de la manche precedente : le zoom push-in + le sol qui flechit (les 2 seuls elements
// que Claude recommandait de garder).
//
// ⚠️ DEFAUT CONNU, NON CORRIGE (decision d'Aziz : "c'est juste un test") : les pieds passent
// legerement A TRAVERS le sol flechi. Cause : le personnage suit solYAt(x) au point exact, mais
// ses 2 pieds sont ECARTES — celui qui est en avant tombe a cote du creux. Reparable (echantillonner
// le sol sous chaque pied), sans interet pour ce que ce test doit dire.
//
// --- en-tete de la manche precedente, conserve ---
//
// ⭐ LE PORTEUR "POUSSE PLUS LOIN" — 3 ajouts testes ensemble (2026-07-29, derniere manche)
//
// ORIGINE : pistes proposees par Gemini a Aziz sur les 2 prototypes precedents. Aziz en a retenu
// 3 sur 4 ; la 4e (grille d'ingenieur en fond) est ECARTEE — c'est le decor INERTE deja rejete
// 2 fois le meme jour (hierarchie ABSENCE > PARTICIPANT > INERTE). Une 5e piste de Gemini (des
// gouttes de sueur) est ecartee par Aziz ET par la doctrine : elle suppose un visage/une peau
// (⛔ aucun visage, verrou valide plusieurs fois), elle tire vers le cartoon, et l'effort est
// DEJA porte par la mecanique du corps -> redondance (principe 7 : ne pas ajouter ce dont on n'a
// pas besoin).
//
// ⛔ VARIABLE UNIQUE PAR RAPPORT AU PORTEUR NARRE : les 3 ajouts. Voix, timings forced-align,
// charge, mecanique du corps, verrou pas/distance : INCHANGES.
// Le meme composant sert les 2 personnages (prop `perso`) : les 2 rendus partagent EXACTEMENT le
// meme code, sinon la comparaison ne vaudrait rien.
//
// LES 3 AJOUTS, ET CE QU'ILS TESTENT CHACUN :
//
//  A. ZOOM LENT (camera push-in) — le plus sur : n'ajoute AUCUN element, change la FOCALE sur ce
//     qui existe deja. Demarre quand la charge s'emballe ("grossit"), se resserre jusqu'a l'arret.
//     ⛔ REGLE CAMERA SVG (feedback_camera-svg-g-transform-jamais-viewbox) : on transforme le
//     CONTENU via <g transform>, le viewBox reste FIXE. Animer le viewBox ferait decouvrir le vide.
//
//  B. LA LIGNE DE SOL QUI FLECHIT — ⭐ le vrai enjeu de ce test. C'est le "DECOR QUI PARTICIPE"
//     cherche le matin meme sans etre trouve : le sol n'est pas un fond, il CEDE SOUS LE POIDS.
//     Il porte une information que le corps ne porte pas (le terrain lui-meme n'encaisse plus).
//     La fleche est maximale SOUS le personnage et s'attenue en s'eloignant (comme un pont).
//
//  C. LE COMPTEUR DE DETTE — le plus RISQUE, retenu par Aziz malgre la reserve de Claude : le
//     porteur demontre un RATIO, pas un montant ("aucun chiffre a l'ecran, le corps dit le
//     rapport"). Un compteur en dollars deplace la demonstration vers la QUANTITE, ce qu'une
//     carte ou un graphe font mieux.
//     ⭐ PARADE tentee : le compteur monte PLUS VITE que le corps ne peine (courbe puissance 2.2
//     vs charge lineaire). S'il fonctionne, il RENFORCE le ratio au lieu de le remplacer : le
//     chiffre s'emballe pendant que l'homme plafonne.
//
// NO EMOJIS dans le code. Accents francais obligatoires dans les strings AFFICHEES.
// =============================================================================================
import React from "react";
import { AbsoluteFill, Audio, useCurrentFrame, interpolate, staticFile } from "remotion";
import {
  MOTS,
  FIN_VO,
  PORTEUR_NARRE_FRAMES,
  ENTREE,
  CHARGE_ACCEL,
  SUBIT,
  PAS_COURT,
  ARRET_DEBUT,
  ARRET_FIN,
} from "./porteurNarreTiming";
import {
  Figure,
  walkDistance,
  walkPhaseFromSteps,
  ENCRE,
  NUIT,
  NUIT2,
  OR_CLAIR,
  CUIVRE,
  type WalkParams,
  type Pose,
} from "../../_shared/stick-figure-svg/StickFigure";
import { bodyPoints } from "../../_shared/stick-figure-svg/habillage";
import { PersonnageRole } from "../../_shared/stick-figure-svg/identite/Roles";

const W = 1920;
const H = 1080;
const FPS = 30;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const SOL_Y = 760;
const PERSO_SCALE = 3.8;
const PERSO_X0 = 90;

export { PORTEUR_NARRE_FRAMES as PORTEUR_GRILLE_FRAMES };

const rampF = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], clamp);

const chargeAt = (f: number): number => {
  const c1 = rampF(f, ENTREE, CHARGE_ACCEL, 0, 0.22);
  const c2 = rampF(f, CHARGE_ACCEL, SUBIT, 0, 0.38);
  const c3 = rampF(f, SUBIT, FIN_VO + 48, 0, 0.40);
  return Math.min(1, c1 + c2 + c3);
};

// source UNIQUE du pas (boucle d'integration ET affichage) — sinon les pieds glissent
const swingAt = (f: number): number => {
  const c = chargeAt(f);
  const deFond = interpolate(c, [0, 0.35, 0.75, 1], [17, 15.5, 13, 11], clamp);
  const surLeMot = interpolate(f, [PAS_COURT, PAS_COURT + 34], [0, 4.6], clamp);
  return Math.max(7, deFond - surLeMot);
};

// ================== B. LA FLECHE DU SOL ==================
// Profondeur max au point du personnage, attenuee en s'eloignant (profil de pont suspendu).
// Elle suit la CHARGE, pas une horloge : c'est le poids qui fait ceder, donc la cause est visible.
const FLECHE_MAX = 46;          // px de fleche sous le personnage a charge pleine
const FLECHE_PORTEE = 620;      // px de part et d'autre ou la fleche s'attenue
const solYAt = (x: number, persoX: number, charge: number): number => {
  const d = Math.abs(x - persoX);
  if (d > FLECHE_PORTEE) return SOL_Y;
  // cloche cosinus : 1 sous le perso, 0 aux bords de la portee (raccord C1, pas d'angle visible)
  const k = 0.5 * (1 + Math.cos((d / FLECHE_PORTEE) * Math.PI));
  return SOL_Y + FLECHE_MAX * charge * k;
};

// ================== LE CAMEMBERT — LA COMPOSITION DE LA DETTE ==================
// ⭐ Il dit ce que le CORPS NE PEUT PAS DIRE : a qui la dette est due. Le corps porte le poids,
// le graphique porte la structure. (Un camembert qui dirait "elle monte" redirait le sac.)
// Il se construit sur le mot "interets" (frame 163, forced-align) puis reste STABLE.
const PIE_CX = 300;
const PIE_CY = 210;
const PIE_R = 78;
const PIE_MOT = 163; // "interets"
// Parts en pourcentage. Valeurs ILLUSTRATIVES (scene de test, aucun chiffre sourceable ici) —
// en production elles viendraient du fact-check, comme toute donnee affichee.
const PIE_PARTS: { label: string; pct: number; couleur: string }[] = [
  { label: "Marchés", pct: 44, couleur: CUIVRE },
  { label: "Bilatéral", pct: 31, couleur: OR_CLAIR },
  { label: "Multilatéral", pct: 25, couleur: "#7d8fb3" },
];
// arc SVG d'un secteur [a0,a1] en degres (0 = midi, sens horaire)
const secteur = (a0: number, a1: number, r: number): string => {
  const p = (a: number) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return [PIE_CX + Math.cos(rad) * r, PIE_CY + Math.sin(rad) * r];
  };
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const grand = a1 - a0 > 180 ? 1 : 0;
  return `M ${PIE_CX} ${PIE_CY} L ${x0} ${y0} A ${r} ${r} 0 ${grand} 1 ${x1} ${y1} Z`;
};

// ================== LA GRILLE — 2 MODES COMPARES ==================
// "fixe"     : maillage regulier immobile (tableau de bord). Un FOND.
// "deformee" : les lignes horizontales suivent le creux du sol -> le terrain lui-meme accuse le
//              poids. Elle PARTICIPE au lieu de decorer.
const GRILLE_PAS = 96;
const Grille: React.FC<{
  mode: "fixe" | "deformee";
  persoX: number;
  charge: number;
  solYAt: (x: number, px: number, c: number) => number;
}> = ({ mode, persoX, charge, solYAt }) => {
  const lignes: React.ReactElement[] = [];
  const op = 0.13;
  // verticales : elles ne se deforment pas (une deformation laterale se lirait comme un glitch)
  for (let x = 0; x <= W; x += GRILLE_PAS) {
    lignes.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} stroke={ENCRE} strokeWidth={1} opacity={op} />);
  }
  // horizontales : en mode "deformee", chacune epouse le profil du sol, d'autant plus qu'elle en
  // est proche (les lignes du haut restent quasi droites : le creux s'attenue avec la distance).
  for (let y = 0; y <= H; y += GRILLE_PAS) {
    if (mode === "fixe") {
      lignes.push(<line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} stroke={ENCRE} strokeWidth={1} opacity={op} />);
    } else {
      const prox = Math.max(0, 1 - Math.abs(y - SOL_Y) / 520); // 1 au niveau du sol, 0 loin
      const pts: string[] = [];
      for (let x = 0; x <= W; x += 24) {
        const dy = (solYAt(x, persoX, charge) - SOL_Y) * prox;
        pts.push(`${x === 0 ? "M" : "L"} ${x} ${(y + dy).toFixed(1)}`);
      }
      lignes.push(<path key={`h${y}`} d={pts.join(" ")} fill="none" stroke={ENCRE} strokeWidth={1} opacity={op} />);
    }
  }
  return <g>{lignes}</g>;
};

export const PorteurGrille16x9: React.FC<{
  perso?: "stick" | "habille";
  grille?: "fixe" | "deformee";
}> = ({ perso = "stick", grille = "deformee" }) => {
  const frame = useCurrentFrame();

  const op = interpolate(frame, [0, 12, PORTEUR_NARRE_FRAMES - 16, PORTEUR_NARRE_FRAMES],
    [0, 1, 1, 0], clamp);
  const charge = chargeAt(frame);

  const swingMax = swingAt(frame);
  const leanDeFond = interpolate(charge, [0, 0.3, 0.7, 1], [2, 5, 8, 10], clamp);
  const leanSubit = rampF(frame, SUBIT, SUBIT + 45, 0, 4);
  const lean = leanDeFond + leanSubit;
  const hipDrop = interpolate(charge, [0, 0.4, 1], [0, 2.5, 6], clamp)
    + rampF(frame, SUBIT, SUBIT + 45, 0, 1.2);
  const armSwing = interpolate(charge, [0, 1], [22, 9], clamp);

  const arretT = rampF(frame, ARRET_DEBUT, ARRET_FIN, 1, 0);
  const { pasCumules, dist } = React.useMemo(() => {
    let pas = 0;
    let d = 0;
    for (let f = 0; f <= frame; f++) {
      if (f < ENTREE) continue;
      const c = chargeAt(f);
      const cadence = interpolate(c, [0, 0.5, 1], [1.9, 1.35, 0.75], clamp);
      const stop = interpolate(f, [ARRET_DEBUT, ARRET_FIN], [1, 0], clamp);
      const dPas = (cadence * stop) / FPS;
      pas += dPas;
      d += walkDistance(dPas, swingAt(f), PERSO_SCALE);
    }
    return { pasCumules: pas, dist: d };
  }, [frame]);

  const x = PERSO_X0 + dist;
  const phase = walkPhaseFromSteps(pasCumules);
  const estArrete = arretT < 0.02;
  const souffle = estArrete ? Math.sin((frame - ARRET_FIN) / 7) * 1.1 : 0;
  const tremble = charge > 0.72 ? Math.sin(frame * 2.7) * (charge - 0.72) * 3.4 : 0;

  const walkP: Partial<WalkParams> = {
    swingMax, lean: lean + souffle, hipDrop, armSwing,
    bobAmp: interpolate(charge, [0, 1], [2.5, 1.2], clamp),
  };
  const poseArret: Pose | undefined = estArrete
    ? { leg1Deg: 13, leg2Deg: -11, torsoDeg: lean + souffle + 4, arm1Deg: 10, arm2Deg: -7 }
    : undefined;
  const bp = bodyPoints(phase, walkP, poseArret ? poseArret.torsoDeg : undefined);

  // ⭐ LE PERSONNAGE S'ENFONCE AVEC LE SOL : ses pieds suivent la ligne flechie, sinon il
  // marcherait dans le vide au-dessus du creux. C'est ce qui rend la fleche credible.
  const solSousPerso = solYAt(x, x, charge);

  // ===== A. LA CAMERA (push-in) =====
  // Demarre quand la charge s'emballe, se resserre jusqu'a l'arret. Centre sur le personnage.
  // ⛔ viewBox FIXE — on transforme le CONTENU.
  const camK = interpolate(frame, [CHARGE_ACCEL, ARRET_FIN], [1, 1.42], clamp);
  const camCx = x;
  const camCy = solSousPerso - 90;
  const camXf = `translate(${camCx} ${camCy}) scale(${camK}) translate(${-camCx} ${-camCy})`;

  // taille du sac (le compteur colle au sac a ete RETIRE — cf. en-tete)
  const sacH = 7 + charge * 26;
  const sacW = 8 + charge * 30;
  const sacEcart = 4 + charge * 7;

  // ===== LE CAMEMBERT — construction sur le mot "interets", puis STABLE =====
  const pieDraw = rampF(frame, PIE_MOT, PIE_MOT + 40, 0, 1);
  const pieOp = rampF(frame, PIE_MOT - 8, PIE_MOT + 14, 0, 1);

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 45%, ${NUIT} 0%, ${NUIT2} 100%)`,
      opacity: op,
    }}>
      <Audio src={staticFile("_rnd/porteur-narre/narration.mp3")} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <g transform={camXf}>
          {/* ===== LA GRILLE — DERRIERE TOUT (mode compare : fixe vs deformee) ===== */}
          <Grille mode={grille} persoX={x} charge={charge} solYAt={solYAt} />

          {/* ===== B. LE SOL QUI FLECHIT (echantillonne, raccord lisse) ===== */}
          {(() => {
            const pts: string[] = [];
            for (let px = -200; px <= W + 200; px += 20) {
              pts.push(`${px === -200 ? "M" : "L"} ${px} ${solYAt(px, x, charge).toFixed(2)}`);
            }
            return (
              <path d={pts.join(" ")} fill="none" stroke={ENCRE} strokeWidth={2}
                opacity={0.5 + 0.25 * charge} />
            );
          })()}

          {/* ===== LE PERSONNAGE + SA CHARGE (le sac passe DERRIERE : porte dans le dos) ===== */}
          <g transform={`translate(${x + tremble} ${solSousPerso}) scale(${PERSO_SCALE})`}>
            {(() => {
              const HAUT_MAX = 9;
              const haut = Math.min(sacH * 0.45, HAUT_MAX);
              const sx0 = bp.sx - sacW - sacEcart;
              const sy0 = bp.sy - haut;
              return (
                <g>
                  <rect x={sx0} y={sy0} width={sacW} height={sacH} rx={2.2}
                    fill={CUIVRE} opacity={0.55 + 0.35 * charge}
                    stroke={OR_CLAIR} strokeWidth={1.1} />
                  <line x1={sx0 + sacW * 0.62} y1={sy0} x2={bp.sx + 1.2} y2={bp.sy + 4}
                    stroke={OR_CLAIR} strokeWidth={0.9 + charge * 1.1} opacity={0.8} />
                </g>
              );
            })()}
          </g>

          {perso === "habille" ? (
            <PersonnageRole
              x={x + tremble} y={solSousPerso} phase={phase} p={walkP} pose={poseArret}
              couleur={ENCRE} scale={PERSO_SCALE} role="commercante" avecObjet={false}
            />
          ) : (
            <Figure
              x={x + tremble} y={solSousPerso} phase={phase} p={walkP} pose={poseArret}
              color={ENCRE} scale={PERSO_SCALE}
            />
          )}

        </g>

        {/* ===== LE CAMEMBERT — HORS du groupe camera =====
             ⛔ Il appartient au CADRE, pas au MONDE : un graphique qui zoomerait avec la scene se
             lirait comme un objet pose dans le decor. Il reste donc fixe pendant que la camera se
             resserre sur le personnage — c'est ce qui le fait lire comme une COUCHE d'information. */}
        <g opacity={pieOp}>
          {PIE_PARTS.map((part, i) => {
            const debut = PIE_PARTS.slice(0, i).reduce((s, p) => s + p.pct, 0) * 3.6;
            const fin = debut + part.pct * 3.6 * pieDraw;
            if (fin - debut < 0.6) return null;
            return (
              <path key={part.label} d={secteur(debut, fin, PIE_R)}
                fill={part.couleur} opacity={0.82} stroke={NUIT2} strokeWidth={2} />
            );
          })}
          {/* legende : une ligne par part, alignee a droite du camembert */}
          {PIE_PARTS.map((part, i) => (
            <g key={`l${part.label}`} opacity={rampF(frame, PIE_MOT + 12 + i * 7, PIE_MOT + 32 + i * 7, 0, 1)}>
              <rect x={PIE_CX + PIE_R + 26} y={PIE_CY - 34 + i * 27} width={13} height={13}
                fill={part.couleur} opacity={0.85} />
              <text x={PIE_CX + PIE_R + 48} y={PIE_CY - 23 + i * 27}
                fontFamily="Georgia, serif" fontSize={19} fill={ENCRE} opacity={0.82}>
                {part.label} {part.pct}%
              </text>
            </g>
          ))}
          <text x={PIE_CX} y={PIE_CY + PIE_R + 34} textAnchor="middle"
            fontFamily="Georgia, serif" fontSize={19} fill={ENCRE} opacity={0.6}
            letterSpacing={2.4}>
            À QUI ELLE EST DUE
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default PorteurGrille16x9;
