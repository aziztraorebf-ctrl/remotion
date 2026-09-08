// PIECE « LE CAURI » — version definitive (le dessin remplace les particules grises).
//
// MOTEUR: SVG — QUOI/COMMENT. Meme raisonnement que l'animatic (voir AnimaticCauri.tsx) :
// Mapbox exclu (geographie abstraite, brief § 4), D3 exclu (rien a projeter), stick-figure
// exclu (aucun acteur), RACCORD exclu par la contrainte maitresse (UNE SEULE PRISE).
//
// Ce fichier reprend `animatic-timing.ts` TEL QUEL — c'etait sa raison d'etre : le rythme
// a ete valide sur l'animatic (20,6 s, ecart long/court mesure x5,1) et ne se rejoue pas ici.
// Seule la MATIERE change : chaque particule est desormais une coquille dessinee.
//
// ── Les 3 regles de dessin qui pilotent ce fichier ──────────────────────────────
//
// R6 — UNE SEULE primitive, 5 roles par l'echelle et le groupement (objet precieux,
//   point du semis, grain du flux, brique de la colonne, debris). On ne dessine pas
//   cinq formes : on reassigne un role a la meme coquille.
//
// SEUIL 18 px — sous 18 px de largeur a l'ecran, le calque `fente` est masque (mesure
//   au regard, cf. coquille-geometrie.ts). Concretement : fente visible aux etats 1-2,
//   masquee aux etats 3-4-5-6.
//
// ORIENTATION PAR ROLE (decision Aziz 2026-09-04, nuance a R6) — la primitive change
//   d'echelle, de groupement ET d'orientation. Dressee en objet/semis, COUCHEE dans les
//   flux et la colonne : la forme est allongee, son axe doit travailler dans le sens du
//   geste, sinon le grain lit « plante » au lieu de « en voyage ».
//
// ── Le raccord 1->2 : MORPH PILOTE (nuance a R5, brief § 4) ─────────────────────
//
// Le piege documente disait : jamais position ET zoom sur la meme fenetre, « les deux
// mouvements se contrarient ». C'est vrai quand on INTERPOLE des coordonnees. Ici on
// SUBSTITUE : la coquille-heroine (un dessin unique, grand) et le semis (un groupement
// de petites coquilles) n'ont pas la meme projection et ne partagent aucune coordonnee.
// Echelle continue + fondu croise => l'oeil lit un seul mouvement de recul, alors que
// ce sont deux images distinctes. Preuve du dispositif hors chantier :
// src/projects/_rnd/upwork-earthtosuzy/IntroSignalOrbit.tsx (135/135 frames uniques).
//
// ⚠️ 2e cas d'usage du morph pilote a ce jour. Noter ce qui tient et ce qui casse —
// c'est lui qui confirme ou infirme la forme. NE PAS extraire de composant generique.
//
// Contraintes projet : interpolate()/spring() uniquement, extrapolate "clamp",
// zero CSS transition / setTimeout / @keyframes / requestAnimationFrame.
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BORNES,
  CIBLES,
  ETATS,
  N,
  PART_TRANSFORMATION,
  VB,
  alea,
  zoomCamera,
} from "./animatic-timing";
import {
  D_FENTE,
  D_SILHOUETTE,
  LARGEUR_NATIVE,
  SEUIL_FENTE_PX,
  TEINTES,
} from "./coquille-geometrie";
import { FondVivant, type VarianteFond } from "./fond-vivant";

/**
 * ⭐ Variante de fond active (2026-09-08). 4 variantes SVG codees en parallele pour un
 * choix a l'oeil (cf. fond-vivant.tsx) — retour Aziz : l'aplat uni "fait tres corporatif".
 * Changer cette valeur pour comparer : "texture" | "teinte-par-etat" | "ocean" | "decor-dessine".
 * ⛔ Ignoree si FOND_VIDEO_H3_TEST est actif (ci-dessous) — les deux registres ne se
 * combinent pas, un seul fond a la fois.
 */
const VARIANTE_FOND: VarianteFond = "decor-dessine";

/**
 * ⭐⭐ MOTEUR: MiniMax H3 (matiere filmee) — test EXPLICITEMENT hors du systeme SVG
 * procedural ci-dessus (registre different : une video generee, pas de la geometrie
 * calculee). Active/desactive ce test sans toucher a VARIANTE_FOND.
 * Clip : public/_portfolio/cauri/fond-h3-test.mp4 (bouclage brut de 5,17s -> 23,08s,
 * PAS une boucle sans coupure — juste pour VOIR l'ensemble en mouvement, cf. demande
 * Aziz 2026-09-08 : juger sur l'ensemble anime, pas sur le fond seul en statique).
 */
const FOND_VIDEO_H3_TEST = false;

/** Adoucissement d'une progression 0->1 (demarrage et arrivee calmes). */
const adoucir = (t: number): number => t * t * (3 - 2 * t);

/**
 * Taille A L'ECRAN de la coquille selon son role, en px de largeur (viewBox 1920x1080).
 * Ce sont les valeurs du brief § 4, celles-la memes qui ont servi a mesurer le seuil.
 */
const LARGEUR_ROLE: Record<string, number> = {
  coquille: 240, // objet precieux — la fente se detaille, les dents se comptent
  semis: 34, // point du semis — fente lisible
  "flux-long": 22, // grain du flux — AU-DESSUS du seuil 18 : la fente reste un croissant
  colonne: 24, // brique — la fente lie les briques entre elles
  "flux-court": 22, // grain du 2e flux — meme taille que le flux long, cf. ci-dessous
  effondrement: 22, // debris — on doit reconnaitre ce qui est tombe
  calme: 34, // retour au semis apaise : on RIME avec l'etat 2
};

// ⭐ Pourquoi le flux court a la MEME taille de grain que le flux long : l'ecart de
// sens entre les deux ne doit venir QUE de la longueur du trajet (mesure : 88,9 % de
// la largeur contre 20,6 %). Si on grossissait aussi les grains du 2e flux, on
// melangerait deux signaux et « plus proche » deviendrait « plus gros » — ce n'est pas
// le propos. La distance est le personnage principal (brief § 4).

/**
 * Orientation de la coquille selon son role, en degres.
 * 0 = dressee (telle que dessinee). 90 = couchee, l'axe long a l'horizontale.
 * Les flux sont horizontaux et la colonne s'empile : la forme y travaille couchee.
 */
const ANGLE_ROLE: Record<string, number> = {
  coquille: 0,
  semis: 0,
  "flux-long": 90,
  colonne: 90,
  "flux-court": 90,
  effondrement: 0, // le tas est disperse : l'angle vient de DISPERSION ci-dessous
  calme: 0,
};

/**
 * Ordre de retard propre a chaque particule : elles n'arrivent pas toutes en meme temps
 * sur leur cible. Sans ce decalage, le nuage se deplace comme un bloc rigide et on
 * retombe sur une « diapositive animee » plutot qu'une matiere qui coule.
 */
const RETARDS = (() => {
  const r = alea(1789);
  return Array.from({ length: N }, () => r() * 0.42);
})();

/**
 * Variete par exemplaire : taille et angle propres. Sans elle, 260 exemplaires du MEME
 * dessin lisent comme une trame imprimee — le defaut que le dessinateur avait anticipe
 * dans ses notes (« si le semis parait mecanique, la reponse est une legere rotation »).
 */
const VARIETE = (() => {
  const r = alea(3121);
  return Array.from({ length: N }, () => ({
    echelle: 0.82 + r() * 0.42,
    angle: (r() - 0.5) * 26,
  }));
})();

/** Dispersion angulaire des debris (etat 6) : un tas n'est pas un rangement. */
const DISPERSION = (() => {
  const r = alea(4231);
  return Array.from({ length: N }, () => (r() - 0.5) * 300);
})();

/** Une coquille, a l'echelle et l'orientation demandees. La fente suit le seuil mesure. */
const Coquille: React.FC<{
  x: number;
  y: number;
  largeurPx: number;
  angle: number;
  opacite: number;
}> = ({ x, y, largeurPx, angle, opacite }) => {
  // le dessin est natif en LARGEUR_NATIVE unites : on le ramene a la largeur voulue
  const k = largeurPx / LARGEUR_NATIVE;
  // ⛔ le seuil se juge sur la largeur REELLE a l'ecran, apres mise a l'echelle
  const avecFente = largeurPx >= SEUIL_FENTE_PX;

  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${k})`} opacity={opacite}>
      <path d={D_SILHOUETTE} fill={TEINTES.nacre} />
      {avecFente ? <path d={D_FENTE} fill={TEINTES.fente} /> : null}
    </g>
  );
};

export const PieceCauri: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps; // tout le timing raisonne en secondes, jamais en frames en dur

  // --- ou en est-on ? etat courant + progression de la transformation vers lui ---
  let idx = 0;
  for (let i = 0; i < ETATS.length; i += 1) {
    if (t >= BORNES[i]) idx = i;
  }
  const etat = ETATS[idx];
  const depuis = t - BORNES[idx];
  const dureeTransfo = etat.duree * PART_TRANSFORMATION;

  // Au-dela de dureeTransfo la forme TIENT : ce temps de tenue est ce qui la rend lisible
  // avant qu'elle ne reparte. C'est R10 — le cadre est pose hors transition.
  const avance = dureeTransfo > 0 ? Math.min(1, depuis / dureeTransfo) : 1;

  const cibleArrivee = CIBLES[etat.nom];
  // ⭐ Le raccord 1->2 part du semis LUI-MEME, pas de la coquille (2026-09-06).
  // Dans l'animatic, les N particules COMPOSAIENT la coquille placeholder : partir de
  // `coquille` avait un sens. Avec le morph pilote ce n'est plus le cas — l'etat 1 est
  // l'heroine DESSINEE, un objet a part, et les exemplaires du semis n'ont plus a la
  // composer. Le dispositif exige au contraire qu'ils soient DEJA EN PLACE quand le
  // recul les revele. Partir de `coquille` les faisait naitre agglutines au centre en
  // un amas opaque : un vestige logique, pas un dosage.
  const cibleDepart =
    idx === 0 || idx === 1
      ? CIBLES[ETATS[idx].nom]
      : CIBLES[ETATS[idx - 1].nom];

  // ⛔ Meme correction que `cibleDepart` ci-dessus, etendue aux TAILLES et aux ANGLES
  // (2026-09-06, 2e passe). La 1re passe n'avait corrige que les POSITIONS : `largeurDepart`
  // et `angleDepart` lisaient encore « coquille », donc les 90 exemplaires du semis
  // demarraient a 240 px chacun (la taille de l'HEROINE) au lieu de 34. Avec le zoom IRIS
  // par-dessus, ils entraient a ~587 px : le « mur de coquilles geantes » du rendu v4.
  // Mesure : occupation de l'ecran 3 % a t=1,9 s puis 85,9 % a t=2,5 s. Ce pic n'a PAS
  // disparu en neutralisant semisEchelle — la preuve que 1,5 n'etait pas la cause.
  const nomPrecedent =
    idx === 0 || idx === 1 ? ETATS[idx].nom : ETATS[idx - 1].nom;
  const largeurCible = LARGEUR_ROLE[etat.nom];
  const largeurDepart = LARGEUR_ROLE[nomPrecedent];
  const angleCible = ANGLE_ROLE[etat.nom];
  const angleDepart = ANGLE_ROLE[nomPrecedent];

  // --- respiration : l'etat 1 n'est pas fige, l'etat 7 se pose ---
  const souffle = Math.sin(t * 1.5) * 2.2;

  // --- camera : zoom = 1 partout, sauf sur les 2 passages IRIS (R10) ---
  const zoom = zoomCamera(t);

  // ── MORPH PILOTE, raccord 1->2 ────────────────────────────────────────────────
  // On ne fait PAS voyager la grande coquille vers le semis (leurs coordonnees n'ont
  // rien a voir) : ECHELLE CONTINUE + FONDU CROISE entre deux dessins distincts.
  //
  // ⛔ Corrige le 2026-09-06 apres le rendu v3 : ma 1re version faisait GROSSIR
  // l'heroine (1 -> 3,4) devant un semis fixe. Ca ne lit pas un recul mais un objet qui
  // gonfle et s'efface — un zoom TRAVERSANT, pas un pull-back. Relecture du dispositif
  // prouve (IntroSignalOrbit.tsx) : les arcs RETRECISSENT (2,6 -> 0,92) pendant que le
  // globe GRANDIT (0,82 -> 1). Les deux echelles vont dans le MEME SENS — c'est ca qui
  // fabrique la sensation de recul. On reprend cette forme telle quelle.
  const enRaccord1vers2 = idx === 1; // on transforme vers l'etat « semis »
  // easing de recul : depart franc puis freinage (equivalent du bezier de la reference)
  const pull = enRaccord1vers2 ? 1 - Math.pow(1 - avance, 3) : 0;

  // l'heroine s'ELOIGNE (elle retrecit) et s'efface avant la fin du recul
  const heroineEchelle = interpolate(pull, [0, 1], [1, 0.34]);
  const heroineOpacite = interpolate(pull, [0, 0.55], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // le semis vient de plus PRES et se pose : meme sens de mouvement que l'heroine
  // ⚠️ EN COURS D'INVESTIGATION (2026-09-06) : mis a 1 (neutre) apres le rendu v4.
  // Une echelle de depart a 1,5 transforme le semis en MUR de coquilles geantes qui
  // remplit le cadre — j'ai copie la FORME du dispositif de reference sans sa CONDITION.
  // Un agent dedie diagnostique la cause ; ne pas re-doser cette valeur en attendant.
  const semisEchelle = 1;
  // il monte APRES le debut du recul : le decor s'installe, le detail ensuite (R4)
  const semisOpacite = enRaccord1vers2
    ? interpolate(pull, [0.18, 0.7], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // L'etat 1 est UNE coquille dessinee, pas 260 particules : on la rend a part.
  // Les N exemplaires n'existent qu'a partir du semis.
  const heroineVisible = idx === 0 || (enRaccord1vers2 && heroineOpacite > 0);

  return (
    <AbsoluteFill style={{ backgroundColor: TEINTES.fond }}>
      {/* --- test H3 (2026-09-08) : fond video EN DEHORS du SVG, meme principe que
          FondVivant — jamais dans le groupe zoome par la camera IRIS (R10). --- */}
      {FOND_VIDEO_H3_TEST ? (
        <OffthreadVideo
          src={staticFile("_portfolio/cauri/fond-h3-test.mp4")}
          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
          muted
        />
      ) : null}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        style={{ display: "block", position: "absolute", top: 0, left: 0 }}
      >
        {/* --- le fond SVG : EN DEHORS du groupe zoome par la camera IRIS (R10) --- */}
        {FOND_VIDEO_H3_TEST ? null : (
          <FondVivant
            variante={VARIANTE_FOND}
            t={t}
            vb={VB}
            etatNom={etat.nom}
            etatPrecedent={nomPrecedent}
            avanceEtat={avance}
          />
        )}
        <g
          transform={`translate(${VB.w / 2} ${VB.h / 2}) scale(${zoom}) translate(${-VB.w / 2} ${-VB.h / 2})`}
        >
          {/* --- le semis et tout ce qui suit : N exemplaires de la meme coquille --- */}
          {idx > 0 ? (
            <g
              opacity={semisOpacite}
              transform={`translate(${VB.w / 2} ${VB.h / 2}) scale(${semisEchelle}) translate(${-VB.w / 2} ${-VB.h / 2})`}
            >
              {Array.from({ length: N }, (_, i) => {
                const retard = RETARDS[i];
                const local = interpolate(
                  avance,
                  [retard, Math.min(1, retard + 0.58)],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                const k = adoucir(local);

                const a = cibleDepart[i];
                const b = cibleArrivee[i];
                const x = a.x + (b.x - a.x) * k;
                const y = a.y + (b.y - a.y) * k + souffle;

                // taille et orientation suivent le role, en meme temps que la position :
                // c'est la reassignation R6 rendue litterale
                const largeur =
                  (largeurDepart + (largeurCible - largeurDepart) * k) *
                  VARIETE[i].echelle;
                const angleRole = angleDepart + (angleCible - angleDepart) * k;
                const dispersion = etat.nom === "effondrement" ? DISPERSION[i] * k : 0;
                const angle = angleRole + VARIETE[i].angle + dispersion;

                // ce qui se POSE est plus present que ce qui passe : le regard suit la pose
                const opacite = 0.55 + 0.45 * (k < 1 ? k : 1);

                return (
                  <Coquille
                    key={i}
                    x={x}
                    y={y}
                    largeurPx={largeur}
                    angle={angle}
                    opacite={opacite}
                  />
                );
              })}
            </g>
          ) : null}

          {/* --- l'heroine : l'objet precieux de l'etat 1, et son effacement en 1->2 --- */}
          {heroineVisible ? (
            <Coquille
              x={VB.w / 2}
              y={VB.h / 2 + souffle}
              largeurPx={LARGEUR_ROLE.coquille * heroineEchelle}
              angle={0}
              opacite={idx === 0 ? 1 : heroineOpacite}
            />
          ) : null}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
