// =============================================================================================
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

export { PORTEUR_NARRE_FRAMES as PORTEUR_POUSSE_FRAMES };

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

// ================== C. LE COMPTEUR ==================
// Montant affiche. Courbe PLUS RAIDE que la charge (2.2) : le chiffre s'emballe pendant que le
// corps plafonne — c'est ce qui doit faire lire le RATIO plutot que le montant.
const MONTANT_MAX = 148;
const montantAt = (charge: number): number =>
  Math.round(MONTANT_MAX * Math.pow(charge, 2.2));

export const PorteurPousse16x9: React.FC<{ perso?: "stick" | "habille" }> = ({
  perso = "stick",
}) => {
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

  // ===== C. LE COMPTEUR (ancre au sac, donc il monte avec la charge) =====
  const montant = montantAt(charge);
  const compteurOp = rampF(frame, ENTREE + 20, ENTREE + 50, 0, 1);
  // taille du sac (meme formule que le Sac ci-dessous) pour poser le compteur juste au-dessus
  const sacH = 7 + charge * 26;
  const sacW = 8 + charge * 30;
  const sacEcart = 4 + charge * 7;
  // ⛔ Corrige au 1er rendu : ancre sur l'epaule, le compteur CHEVAUCHAIT LA TETE en fin de scene
  // (le sac ayant grossi vers l'arriere, le texte passait derriere le personnage). Il est donc
  // centre sur le SAC lui-meme, et remonte a mesure que le sac grossit.
  const compteurX = x + (bp.sx - sacW - sacEcart + sacW / 2) * PERSO_SCALE;
  const compteurY = solSousPerso + (bp.sy - Math.min(sacH * 0.45, 9) - 16) * PERSO_SCALE;

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 45%, ${NUIT} 0%, ${NUIT2} 100%)`,
      opacity: op,
    }}>
      <Audio src={staticFile("_rnd/porteur-narre/narration.mp3")} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <g transform={camXf}>
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

          {/* ===== C. LE COMPTEUR — ancre au sac, il monte AVEC la charge ===== */}
          <g opacity={compteurOp}>
            <text x={compteurX} y={compteurY} textAnchor="middle"
              fontFamily="Georgia, serif" fontSize={34} fill={OR_CLAIR}
              letterSpacing={1.5}
              style={{ paintOrder: "stroke", stroke: NUIT2, strokeWidth: 5 }}>
              {montant} Md $
            </text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default PorteurPousse16x9;
