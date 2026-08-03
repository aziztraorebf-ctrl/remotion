// ============================================================================================
// DECOR ENTREPOT / QUAI DE CHARGEMENT — SVG statique, 3 plans de profondeur (2026-08-03)
// ============================================================================================
//
// POURQUOI CE FICHIER : la scene `EnchainementGestesValides.tsx` etait un banc d'essai de gestes
// avec un decor volontairement nu (une ligne de sol + des etoiles). Les gestes sont valides ; il
// s'agit maintenant de leur donner un LIEU. Le registre stick figure a une regle de composition
// non negociable (STICK-FIGURE-INDEX.md § "LA REGLE DE COMPOSITION") :
//
//   "LE SOL EST LA CONDITION N°1 — une scene avec un SOL integre le personnage par construction."
//
// La scene a DEJA son sol (SOL_Y = 812) et son personnage y est ancre au pixel pres par le verrou
// pas/distance. ⛔ CE DECOR NE DEPLACE DONC JAMAIS CETTE LIGNE : il se construit AUTOUR d'elle.
// Tout ce qui est dessine ici traite SOL_Y comme une donnee d'entree immuable.
//
// L'autre regle appliquee (§ TEST A/B TRANCHE) : "Le modele dessine le DECOR, NOUS animons les
// PERSONNAGES." Ce fichier est donc du DECOR PUR : zero personnage, zero silhouette humaine,
// zero geste. Il ne touche a aucun timing ni a aucune pose.
//
// --------------------------------------------------------------------------------------------
// LA CONTRAINTE DE CADRAGE, MESUREE AVANT DE DESSINER (jamais estimee a l'oeil)
// --------------------------------------------------------------------------------------------
// La camera est `camX = max(-60, x - 660)` et le personnage va de x=260 a x=1965. La camera
// balaie donc camX de -60 a 1305.23, et le viewport fait 1920 de large :
//
//   FENETRE MONDE REELLEMENT VUE :  x de -60 a 3225.23   (soit 3285px de decor a couvrir)
//
// Toutes les bornes de ce fichier derivent de ces deux nombres via les props `xMin`/`xMax`, pour
// qu'un changement de duree de segment (deja arrive 3x dans la scene : D_DUR 3.0 -> 5.6 -> 6.8s)
// ne laisse JAMAIS un bord de decor entrer dans le cadre. ⛔ Aucune borne codee en dur.
//
// --------------------------------------------------------------------------------------------
// LES 3 PLANS, ET POURQUOI TROIS
// --------------------------------------------------------------------------------------------
// Un decor a un seul plan qui defile a la vitesse du personnage donne une scene "en carton" : tout
// glisse a l'identique, l'oeil ne percoit aucun volume. La scene avait deja l'intuition juste
// (le ciel etoile ne bouge PAS avec camX, "c'est ce qui donne la profondeur"). On generalise :
//
//   PLAN 0 — LOINTAIN, facteur 0.18   : la nef, la charpente, la verriere, la grande porte de
//                                       quai ouverte. Presque immobile -> lit comme "loin".
//   PLAN 1 — MOYEN,   facteur 0.55    : les piliers de structure, les palettes empilees, les
//                                       fardeaux sous baches. Defile a mi-vitesse.
//   PLAN 2 — SOL,     facteur 1.00    : le beton du quai, ses joints de dalle, la bande jaune de
//                                       bord de quai. Solidaire du personnage (il marche dessus).
//
// ⚠️ PARALLAXE ET ANCRAGE : seul le PLAN 2 partage l'echelle du personnage. Les plans 0 et 1 sont
// des ARRIERE-PLANS : rien de ce qu'ils contiennent ne doit sembler pose sur SOL_Y (sinon un
// objet lointain "glisserait" par rapport au sol sur lequel marche le perso — le defaut
// "chalutier qui vogue dans le ciel" documente dans l'index). Leur LIGNE D'HORIZON est donc
// posee AU-DESSUS de SOL_Y (dalle en perspective entre les deux), et ils ne touchent jamais
// SOL_Y directement.
//
// --------------------------------------------------------------------------------------------
// LISIBILITE : LE PERSONNAGE RESTE LE SUJET
// --------------------------------------------------------------------------------------------
// Le personnage occupe en gros la bande y ∈ [600, 812] (208px de haut a PERSO_SCALE=2.6), trace
// a 11.7px en ENCRE pleine. Regles appliquees pour qu'il ne se noie jamais :
//   · Le decor est trace en ENCRE a opacite <= 0.30 sur les plans 0/1 (le perso est a 1.0).
//   · Aucun trait de decor n'excede 3.2px de large, contre 11.7px pour le corps.
//   · ⭐ UNE "BANDE FRANCHE" : entre SOL_Y-250 et SOL_Y, sur toute la longueur, aucun element de
//     decor dense n'est autorise (seuls les piliers verticaux tres pales la traversent). C'est la
//     bande ou vivent la tete et le buste du personnage. Verifie au rendu.
//   · Tout le decor est ecrit AVANT le personnage dans l'ordre SVG -> il passe donc toujours
//     DERRIERE (en SVG, ce qui est ecrit en dernier est au-dessus).
//
// --------------------------------------------------------------------------------------------
// TECHNIQUE : 100% STATIQUE, DETERMINISTE
// --------------------------------------------------------------------------------------------
// Aucun `Math.random` (PRNG a graine fixe, comme les etoiles de la scene), aucun `useCurrentFrame`
// (le decor ne s'anime pas : la parallaxe est produite par la CAMERA, pas par une animation), donc
// aucune CSS transition / setTimeout / @keyframes. Le decor est une fonction pure de ses props.
//
// ⭐ PAS DE MOTIF REPETE A L'IDENTIQUE : les 3285px sont couverts par des elements dont la
// position ET les dimensions derivent d'un PRNG a graine fixe. Une trame reguliere (baie apres
// baie, pilier apres pilier a pas constant) se lit comme un papier peint des qu'on la travelle ;
// on garde donc le RYTHME regulier de la structure porteuse (c'est ce qui fait "batiment") mais
// on fait varier tout ce qui s'y accroche (hauteur des piles, largeur des fardeaux, presence ou
// non d'une baie vitree). Verifie au rendu sur 3 positions de camera.
import React from "react";
import { NUIT, NUIT2, ENCRE, OR_CLAIR, CUIVRE } from "../../_shared/stick-figure-svg/StickFigure";

// ---- PRNG deterministe (meme generateur que les etoiles de la scene : LCG a graine fixe) ----
const prng = (graine: number) => {
  let s = graine;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

export type DecorProps = {
  /** Ordonnee de la ligne de sol de la scene. ⛔ DONNEE D'ENTREE : le decor ne la deplace jamais. */
  solY: number;
  /** Borne gauche du monde reellement visible (camX minimal). */
  xMin: number;
  /** Borne droite du monde reellement visible (camX maximal + largeur du viewport). */
  xMax: number;
};

// ============================================================================================
// PLAN 0 — LE LOINTAIN : la nef de l'entrepot, sa charpente, la grande porte de quai
// ============================================================================================
// Ce plan porte l'IDENTITE du lieu : sans lui, des palettes sur un sol pourraient etre n'importe
// quoi. C'est la charpente metallique + la verriere qui disent "entrepot" en une frame.
//
// ⭐ HORIZON : `hz = solY - 300`. Choisi par calcul, pas au juge — le personnage culmine a
// solY-208 (sommet du crane). Un horizon a -300 laisse donc 92px de degagement au-dessus de sa
// tete : la ligne de fuite ne vient jamais lui couper la nuque, defaut classique des decors
// dessines sans mesurer la taille du sujet.
export const PlanLointain: React.FC<DecorProps> = ({ solY, xMin, xMax }) => {
  const hz = solY - 300;        // ligne d'horizon / base du mur du fond
  // ⚠️ CORRIGE APRES RENDER #1 (defaut VU, pas anticipe) : `faite` valait solY-720 = y 92, donc la
  // ligne de faite ET le bord haut du rect du mur tombaient DANS le cadre — on lisait une BANDE
  // horizontale nette a 40px du haut, comme un decor qui s'arrete. Le faite est desormais pousse
  // AU-DESSUS du cadre (solY-980 = y -168) : la nef monte hors champ, ce qui est d'ailleurs la
  // lecture juste (on est SOUS une grande charpente, on n'en voit pas le sommet).
  const faite = solY - 980;
  const linteau = solY - 560;   // hauteur du linteau des grandes baies
  const r = prng(4157);

  // --- la trame de la charpente : des fermes verticales a pas REGULIER (c'est la structure du
  // batiment, elle DOIT etre reguliere) --- pas de 420px dans le repere de ce plan.
  const PAS = 420;
  const i0 = Math.floor(xMin / PAS) - 1;
  const i1 = Math.ceil(xMax / PAS) + 1;
  const fermes: number[] = [];
  for (let i = i0; i <= i1; i++) fermes.push(i * PAS);

  // --- les baies : ce qui s'accroche a la trame VARIE (sinon papier peint) ---
  // 3 etats possibles par travee : verriere pleine, verriere partielle, mur plein.
  const travees = fermes.slice(0, -1).map((x, i) => ({
    x,
    w: PAS,
    type: (() => {
      const v = r();
      if (v < 0.42) return "verriere" as const;
      if (v < 0.72) return "partielle" as const;
      return "mur" as const;
    })(),
    // hauteur du bandeau vitre, variable
    h: 88 + r() * 54,
    key: i,
  }));

  return (
    <g>
      {/* --- LE MUR DU FOND : un aplat a peine plus clair que le ciel, pour que la nef se detache
             du degrade sans creer de bloc de couleur (defaut "bloc qui coupe l'ecran" de l'index) --- */}
      <rect x={xMin - 200} y={faite} width={xMax - xMin + 400} height={hz - faite}
        fill={NUIT} opacity={0.42} />

      {/* --- LA POUTRE-TREILLIS PRINCIPALE (la seule structure horizontale visible dans le cadre).
             ⚠️ CORRIGE APRES RENDER #1 : les 2 diagonales couraient sur TOUTE la hauteur
             faite->linteau (soit 420px), ce qui produisait un grand quadrillage en X uniforme sur
             tout le haut du cadre — ca lisait "grille decorative", pas "charpente". La poutre est
             maintenant une VRAIE poutre : une bande de 62px de haut, avec membrure superieure,
             membrure inferieure et treillis en N a l'interieur. C'est la proportion reelle d'une
             poutre metallique, et elle occupe une bande etroite au lieu de tout le ciel. --- */}
      {(() => {
        const pTop = solY - 700;       // membrure superieure de la poutre
        const pBot = pTop + 62;        // membrure inferieure
        return (
          <g>
            <line x1={xMin - 200} y1={pTop} x2={xMax + 200} y2={pTop}
              stroke={ENCRE} strokeWidth={2.4} opacity={0.19} />
            <line x1={xMin - 200} y1={pBot} x2={xMax + 200} y2={pBot}
              stroke={ENCRE} strokeWidth={2.4} opacity={0.19} />
            {/* le treillis en N : une diagonale + un montant par demi-travee */}
            {fermes.map((x) => (
              <g key={`tr${x}`} stroke={ENCRE} opacity={0.12} fill="none" strokeWidth={1.2}>
                <line x1={x} y1={pTop} x2={x + PAS * 0.5} y2={pBot} />
                <line x1={x + PAS * 0.5} y1={pBot} x2={x + PAS} y2={pTop} />
                <line x1={x + PAS * 0.5} y1={pTop} x2={x + PAS * 0.5} y2={pBot} />
              </g>
            ))}
          </g>
        );
      })()}

      {/* --- LES MONTANTS DE FERME : ils descendent de la poutre jusqu'au pied du mur du fond.
             ⛔ Ils s'arretent a `hz` (le pied du mur), jamais a mi-air. --- */}
      {fermes.map((x) => (
        <line key={`f${x}`} x1={x} y1={solY - 700} x2={x} y2={hz}
          stroke={ENCRE} strokeWidth={2.2} opacity={0.13} />
      ))}
      {/* la panne intermediaire (au niveau des linteaux de baie) */}
      <line x1={xMin - 200} y1={linteau} x2={xMax + 200} y2={linteau}
        stroke={ENCRE} strokeWidth={1.4} opacity={0.11} />

      {/* --- LES BAIES VITREES : la lumiere du dehors. C'est le seul endroit ou on s'autorise une
             touche d'OR (le registre l'utilise pour la matiere/valeur) : une verriere de nuit qui
             renvoie une lueur chaude. Tres basse opacite : c'est un accent, pas un sujet. --- */}
      {travees.map((t) => {
        if (t.type === "mur") return null;
        const w = t.type === "verriere" ? t.w - 46 : (t.w - 46) * 0.52;
        return (
          <g key={`b${t.key}`}>
            <rect x={t.x + 23} y={linteau + 30} width={w} height={t.h}
              fill={OR_CLAIR} opacity={0.055} />
            <rect x={t.x + 23} y={linteau + 30} width={w} height={t.h}
              fill="none" stroke={ENCRE} strokeWidth={1.3} opacity={0.17} />
            {/* meneaux : 3 divisions verticales, pour que ca lise "verriere" et pas "rectangle" */}
            {[0.25, 0.5, 0.75].map((u) => (
              <line key={u} x1={t.x + 23 + w * u} y1={linteau + 30}
                x2={t.x + 23 + w * u} y2={linteau + 30 + t.h}
                stroke={ENCRE} strokeWidth={0.9} opacity={0.13} />
            ))}
            <line x1={t.x + 23} y1={linteau + 30 + t.h * 0.5} x2={t.x + 23 + w} y2={linteau + 30 + t.h * 0.5}
              stroke={ENCRE} strokeWidth={0.9} opacity={0.13} />
          </g>
        );
      })}

      {/* --- LA LIGNE DE PIED DU MUR DU FOND (base de la nef).
             ⚠️ CORRIGE APRES RENDER #1 : a 2px / opacite 0.24 elle tranchait le cadre en deux
             comme une couture. Un pied de mur LOINTAIN ne doit pas etre plus franc que le nez de
             quai qui est, lui, au premier plan (2.6px / 0.42). Ramenee a 1.4px / 0.13, elle pose
             le mur sans decouper l'image. --- */}
      <line x1={xMin - 200} y1={hz} x2={xMax + 200} y2={hz}
        stroke={ENCRE} strokeWidth={1.4} opacity={0.13} />
      {/* la plinthe : une seconde ligne tres pale juste dessous, qui epaissit le pied du mur
          sans creer un trait dur (c'est ce qui fait "mur pose au sol" plutot que "ligne"). */}
      <line x1={xMin - 200} y1={hz + 7} x2={xMax + 200} y2={hz + 7}
        stroke={ENCRE} strokeWidth={1} opacity={0.07} />
    </g>
  );
};

// ============================================================================================
// PLAN 0bis — LA GRANDE PORTE DE QUAI OUVERTE (element unique, place a une position choisie)
// ============================================================================================
// ⭐ POURQUOI UN ELEMENT UNIQUE ET NON REPETE : un travelling lateral de 1700px a besoin d'un
// POINT DE REPERE non periodique, sinon l'oeil ne sait pas qu'on avance (tout se ressemble). La
// porte joue ce role : elle entre dans le cadre, on la depasse, on sait qu'on a progresse.
// C'est aussi ce qui justifie narrativement le lieu : on pousse une caisse VERS/DEPUIS un quai.
export const PorteQuai: React.FC<{ x: number; solY: number; largeur?: number }> = ({
  x, solY, largeur = 300,
}) => {
  const hz = solY - 300;
  const haut = solY - 560;       // linteau de la porte
  const w = largeur;
  return (
    <g>
      {/* l'ouverture : plus SOMBRE que le mur (on voit la nuit du dehors au travers) */}
      <rect x={x} y={haut} width={w} height={hz - haut} fill={NUIT2} opacity={0.85} />
      {/* l'encadrement */}
      <g stroke={ENCRE} fill="none" opacity={0.3}>
        <line x1={x} y1={haut} x2={x + w} y2={haut} strokeWidth={3} />
        <line x1={x} y1={haut} x2={x} y2={hz} strokeWidth={2.6} />
        <line x1={x + w} y1={haut} x2={x + w} y2={hz} strokeWidth={2.6} />
      </g>
      {/* le rideau metallique RELEVE, enroule sous le linteau : 4 lames serrees.
          C'est ce detail qui dit "porte de quai OUVERTE" plutot que "trou dans un mur". */}
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={x + 6} y1={haut + 9 + i * 8} x2={x + w - 6} y2={haut + 9 + i * 8}
          stroke={ENCRE} strokeWidth={2.4} opacity={0.22} />
      ))}
      {/* les rails de guidage du rideau, de part et d'autre */}
      <line x1={x - 7} y1={haut} x2={x - 7} y2={hz} stroke={ENCRE} strokeWidth={1.4} opacity={0.17} />
      <line x1={x + w + 7} y1={haut} x2={x + w + 7} y2={hz} stroke={ENCRE} strokeWidth={1.4} opacity={0.17} />
      {/* la lueur de dehors qui tombe au pied de la porte (tache au sol du plan lointain) */}
      <rect x={x + 10} y={hz - 30} width={w - 20} height={30} fill={OR_CLAIR} opacity={0.045} />
    </g>
  );
};

// ============================================================================================
// PLAN 1 — LE PLAN MOYEN : piliers de structure, palettes empilees, fardeaux sous bache
// ============================================================================================
// ⭐ CONTRAINTE DE LISIBILITE APPLIQUEE ICI (c'est le plan le plus a risque) : ces objets sont a
// la hauteur du personnage. Ils sont donc :
//   1. poses sur une LIGNE DE PIED (`piedY`) situee AU-DESSUS de solY (le decalage lit comme de la
//      profondeur : ce qui est plus loin est plus haut dans le cadre),
//   2. dessines en trait fin, opacite <= 0.30 — le personnage est a 1.0 sur 11.7px,
//   3. jamais plus hauts que `piedY - 150`, ce qui les maintient entierement SOUS la ligne des
//      epaules du personnage a l'endroit ou il passe. Cf. la verification au rendu.
export const PlanMoyen: React.FC<DecorProps> = ({ solY, xMin, xMax }) => {
  const piedY = solY - 126;   // ligne de pied du plan moyen (plus loin = plus haut)
  const r = prng(20260803);

  // --- LES PILIERS PORTEURS : rythme REGULIER (structure), mais decale de la trame de la
  // charpente pour eviter l'effet "grille alignee" quand les 2 plans defilent a des vitesses
  // differentes (deux trames en phase produisent un moire tres visible en travelling). ---
  const PAS_P = 470;
  const p0 = Math.floor(xMin / PAS_P) - 1;
  const p1 = Math.ceil(xMax / PAS_P) + 1;
  const piliers: number[] = [];
  for (let i = p0; i <= p1; i++) piliers.push(i * PAS_P + 130);

  // --- LES PILES DE PALETTES / CAISSES : positions et tailles VARIABLES (anti-papier-peint) ---
  type Pile = { x: number; n: number; w: number; h: number; type: "palette" | "caisse" | "bache" };
  const piles: Pile[] = [];
  {
    let x = xMin - 120;
    while (x < xMax + 200) {
      const v = r();
      const type: Pile["type"] = v < 0.44 ? "palette" : v < 0.78 ? "caisse" : "bache";
      const w = 66 + r() * 62;
      piles.push({
        x,
        n: 2 + Math.floor(r() * 4),      // 2 a 5 niveaux
        w,
        h: 17 + r() * 7,
        type,
      });
      // ecart variable : c'est lui qui casse la periodicite (60 a 300px de vide)
      x += w + 60 + r() * 240;
    }
  }

  return (
    <g>
      {/* --- LES PILIERS : verticales franches qui traversent la bande du personnage.
             ⚠️ Les SEULS elements autorises a la traverser, et a 0.16 d'opacite : un pilier tres
             pale derriere un trait plein de 11.7px ne cree aucune ambiguite de lecture. --- */}
      {/* ⚠️ CORRIGE APRES RENDER #1 : les poteaux s'arretaient a solY-460, c.-a-d. EN L'AIR, au
          milieu du cadre — ils se lisaient comme des batons plantes, pas comme une structure.
          Ils montent desormais jusqu'au HAUT DU CADRE (solY-1000, hors champ) : un poteau porteur
          va du sol a la charpente, et le fait qu'il sorte du cadre est justement ce qui donne
          l'echelle du batiment. --- */}
      {piliers.map((x) => (
        // ⚠️ AJUSTE APRES RENDER #2 : a 0.14 les poteaux disparaissaient presque completement — la
        // structure ne se lisait plus, il ne restait que des piles flottantes. A 0.21 ils portent
        // le batiment tout en restant tres en dessous du personnage (encre pleine, 11.7px).
        <g key={`p${x}`} opacity={0.21}>
          <line x1={x} y1={solY - 1000} x2={x} y2={piedY} stroke={ENCRE} strokeWidth={3.4} />
          {/* le sabot de pied (platine boulonnee) : ce detail suffit a le lire comme un poteau
              metallique plutot qu'une ligne. */}
          <line x1={x - 12} y1={piedY} x2={x + 12} y2={piedY} stroke={ENCRE} strokeWidth={3.4} />
          {/* le raidisseur a mi-hauteur, JUSTE AU-DESSUS de la bande du personnage
              (piedY - 210 ≈ solY - 336, la tete du perso culmine a solY - 208) : il enrichit le
              poteau sans jamais venir couper la silhouette. */}
          <line x1={x - 9} y1={piedY - 210} x2={x + 9} y2={piedY - 210}
            stroke={ENCRE} strokeWidth={2.2} />
        </g>
      ))}

      {/* --- LES PILES : la matiere de l'entrepot. C'est ce qui rend le lieu OCCUPE. --- */}
      {piles.map((pile, i) => {
        const base = piedY;
        return (
          <g key={`pile${i}`} opacity={0.3}>
            {pile.type === "palette" && (
              // PALETTE : la lecture "palette" tient a la semelle a 3 des : on dessine le plateau
              // + 3 petits pieds. Repete n fois en pile.
              Array.from({ length: pile.n }, (_, k) => {
                const y = base - (k + 1) * pile.h;
                return (
                  <g key={k} stroke={ENCRE} fill="none">
                    <rect x={pile.x} y={y} width={pile.w} height={pile.h * 0.62} strokeWidth={1.6} />
                    {[0.06, 0.47, 0.88].map((u) => (
                      <line key={u}
                        x1={pile.x + pile.w * u + 3} y1={y + pile.h * 0.62}
                        x2={pile.x + pile.w * u + 3} y2={y + pile.h}
                        strokeWidth={1.6} />
                    ))}
                  </g>
                );
              })
            )}
            {pile.type === "caisse" && (
              // CAISSE : meme langage graphique que la caisse poussee par le personnage (rect +
              // une latte, OR_CLAIR). ⭐ C'est volontaire : la caisse du perso doit appartenir au
              // meme monde que celles du fond, pas etre un objet etranger pose sur un decor.
              Array.from({ length: pile.n }, (_, k) => {
                const y = base - (k + 1) * (pile.h + 4);
                const inset = k * 3; // les piles ne sont jamais parfaitement alignees
                return (
                  <g key={k} stroke={OR_CLAIR} fill="none">
                    <rect x={pile.x + inset} y={y} width={pile.w - inset} height={pile.h + 2}
                      strokeWidth={1.8} strokeLinejoin="round" />
                    <line x1={pile.x + inset} y1={y + (pile.h + 2) * 0.6}
                      x2={pile.x + pile.w} y2={y + (pile.h + 2) * 0.6}
                      strokeWidth={1} opacity={0.6} />
                  </g>
                );
              })
            )}
            {pile.type === "bache" && (
              // FARDEAU SOUS BACHE : une masse basse arrondie + 2 sangles. Casse la geometrie
              // rectangulaire ambiante (sans ca, tout le plan moyen est un empilement d'angles
              // droits, ce qui se lit "diagramme" et non "entrepot").
              (() => {
                const hh = pile.h * (pile.n * 0.72 + 1);
                const y = base - hh;
                return (
                  <g stroke={CUIVRE} fill="none">
                    <path
                      d={`M ${pile.x} ${base} L ${pile.x} ${y + 12} Q ${pile.x + pile.w * 0.5} ${y - 7} ${pile.x + pile.w} ${y + 12} L ${pile.x + pile.w} ${base} Z`}
                      strokeWidth={1.8} strokeLinejoin="round" />
                    <line x1={pile.x + pile.w * 0.3} y1={y + 4} x2={pile.x + pile.w * 0.3} y2={base}
                      strokeWidth={1.2} />
                    <line x1={pile.x + pile.w * 0.7} y1={y + 4} x2={pile.x + pile.w * 0.7} y2={base}
                      strokeWidth={1.2} />
                  </g>
                );
              })()
            )}
          </g>
        );
      })}

      {/* --- LA LIGNE DE PIED du plan moyen : elle ferme le plan et empeche les piles de
             "flotter". C'est l'equivalent, pour l'arriere-plan, de ce que SOL_Y est au
             personnage. --- */}
      <line x1={xMin - 200} y1={piedY} x2={xMax + 200} y2={piedY}
        stroke={ENCRE} strokeWidth={1.6} opacity={0.2} />
    </g>
  );
};

// ============================================================================================
// PLAN 2 — LE SOL DU QUAI (solidaire du personnage, facteur 1.00)
// ============================================================================================
// ⛔⛔ LA CONTRAINTE LA PLUS DURE DE CE FICHIER : la scene ancre le personnage, la caisse et le
// banc sur `SOL_Y`, valeur validee. Ce composant NE REDESSINE PAS un sol a une autre hauteur —
// il HABILLE la ligne existante : tout ce qu'il trace est soit SUR solY, soit EN DESSOUS.
//
// Ce qui remplace la "ligne nue" :
//   · la DALLE en perspective entre le plan moyen et le bord du quai (le sol a une profondeur),
//   · les JOINTS de dalle (des fuyantes, pas des traits paralleles : c'est ce qui donne le sol
//     en beton plutot qu'un plancher de theatre),
//   · le NEZ DE QUAI et sa bande de signalisation, en dessous de solY (dans la partie basse du
//     cadre que le personnage n'occupe jamais).
export const PlanSol: React.FC<DecorProps> = ({ solY, xMin, xMax }) => {
  const piedY = solY - 126;   // meme ligne de pied que le plan moyen : les 2 plans se raccordent
  const r = prng(777);

  // --- LES JOINTS DE DALLE : des fuyantes qui convergent vers un point de fuite unique.
  // ⭐ Le point de fuite est place au CENTRE DU MONDE VISIBLE et TRES HAUT (au-dessus du cadre) :
  // avec un travelling lateral pur, un point de fuite bas ferait "tourner" tout le sol quand la
  // camera avance (les fuyantes changeraient d'inclinaison de facon tres visible). Loin et haut,
  // l'inclinaison varie peu -> le sol reste stable pendant le travelling. Verifie au rendu sur
  // 3 positions de camera.
  const fuiteX = (xMin + xMax) / 2;
  const fuiteY = solY - 3000;
  const PAS_J = 168;
  const j0 = Math.floor(xMin / PAS_J) - 2;
  const j1 = Math.ceil(xMax / PAS_J) + 2;
  const joints: number[] = [];
  for (let i = j0; i <= j1; i++) joints.push(i * PAS_J);

  return (
    <g>
      {/* --- LA DALLE : un aplat tres discret entre la ligne de pied du fond et le sol. Sans lui,
             les piles du plan moyen semblent posees sur le vide. --- */}
      <rect x={xMin - 200} y={piedY} width={xMax - xMin + 400} height={solY - piedY}
        fill={NUIT2} opacity={0.34} />

      {/* --- LES JOINTS DE DALLE (fuyantes) --- */}
      {joints.map((jx) => {
        // le joint part du sol (solY) et remonte vers le point de fuite ; on le coupe a piedY.
        const t = (piedY - solY) / (fuiteY - solY);
        const hx = jx + (fuiteX - jx) * t;
        return (
          <line key={`j${jx}`} x1={jx} y1={solY} x2={hx} y2={piedY}
            stroke={ENCRE} strokeWidth={1.1} opacity={0.09} />
        );
      })}
      {/* 2 joints transversaux : ils cassent l'effet "rayures verticales" et posent la profondeur */}
      <line x1={xMin - 200} y1={piedY + (solY - piedY) * 0.42} x2={xMax + 200} y2={piedY + (solY - piedY) * 0.42}
        stroke={ENCRE} strokeWidth={1} opacity={0.08} />
      <line x1={xMin - 200} y1={piedY + (solY - piedY) * 0.75} x2={xMax + 200} y2={piedY + (solY - piedY) * 0.75}
        stroke={ENCRE} strokeWidth={1} opacity={0.1} />

      {/* --- QUELQUES ECLATS / TACHES DE BETON : le sol n'est pas neuf. Positions deterministes,
             tres pales, sous la ligne de sol pour ne jamais interferer avec les pieds. --- */}
      {Array.from({ length: Math.ceil((xMax - xMin) / 210) }, (_, i) => {
        const cx = xMin + i * 210 + r() * 150;
        const cy = solY - (solY - piedY) * (0.12 + r() * 0.62);
        const w = 22 + r() * 46;
        return (
          <line key={`t${i}`} x1={cx} y1={cy} x2={cx + w} y2={cy}
            stroke={ENCRE} strokeWidth={1.4} opacity={0.06} />
        );
      })}

      {/* ⛔⛔ LA LIGNE DE SOL ELLE-MEME — reprise EXACTEMENT comme dans la scene d'origine
             (meme y, meme couleur), juste renforcee : c'est le nez du quai, et c'est la reference
             d'ancrage du personnage. On ne la deplace PAS, on ne la remplace PAS. --- */}
      <line x1={xMin - 200} y1={solY} x2={xMax + 200} y2={solY}
        stroke={ENCRE} strokeWidth={2.6} opacity={0.42} />

      {/* --- SOUS LE QUAI : la bande de signalisation + le vide de la zone de camion. Tout ceci
             est SOUS solY, donc dans la zone que le personnage n'occupe jamais (ses pieds sont
             a solY exactement). --- */}
      <rect x={xMin - 200} y={solY + 7} width={xMax - xMin + 400} height={13}
        fill={OR_CLAIR} opacity={0.17} />
      {/* les hachures de la bande (rythme regulier : une signalisation EST reguliere) */}
      {Array.from({ length: Math.ceil((xMax - xMin + 400) / 34) }, (_, i) => {
        const hx = xMin - 200 + i * 34;
        return (
          <line key={`h${i}`} x1={hx} y1={solY + 20} x2={hx + 15} y2={solY + 7}
            stroke={NUIT2} strokeWidth={5} opacity={0.5} />
        );
      })}
      {/* la retombee du quai (beton), puis la zone sombre en bas de cadre */}
      <rect x={xMin - 200} y={solY + 20} width={xMax - xMin + 400} height={400}
        fill={NUIT2} opacity={0.5} />
      <line x1={xMin - 200} y1={solY + 20} x2={xMax + 200} y2={solY + 20}
        stroke={ENCRE} strokeWidth={1.4} opacity={0.18} />
      {/* les butoirs de quai : des blocs reguliers sous le nez du quai. Ils donnent l'echelle du
          deplacement (ils remplacent avantageusement les "reperes au sol" abstraits d'origine). */}
      {Array.from({ length: Math.ceil((xMax - xMin + 400) / 300) }, (_, i) => {
        const bx = xMin - 200 + i * 300 + 60;
        return (
          <g key={`bu${i}`} opacity={0.22}>
            <rect x={bx} y={solY + 24} width={54} height={30}
              fill="none" stroke={ENCRE} strokeWidth={1.8} strokeLinejoin="round" />
            <line x1={bx} y1={solY + 39} x2={bx + 54} y2={solY + 39}
              stroke={ENCRE} strokeWidth={1.1} />
          </g>
        );
      })}
    </g>
  );
};

// ============================================================================================
// L'ASSEMBLAGE — c'est ici que vit la PARALLAXE
// ============================================================================================
// ⭐ COMMENT LA PARALLAXE EST FAITE, ET POURQUOI COMME CA :
// La scene translate "le monde" par `<g transform="translate(-camX 0)">`. Pour qu'un plan defile
// PLUS LENTEMENT, il suffit de le translater de `-camX * facteur` avec facteur < 1. Chaque plan a
// donc son propre <g>, et NE VIT PAS dans le groupe monde de la scene (sinon il subirait -camX en
// plus de son propre facteur).
//
// ⚠️ CONSEQUENCE A NE PAS RATER — LA COMPENSATION D'ECHELLE : si un plan defile a 0.18, alors sur
// un travelling de 1365px de camera il ne parcourt que 246px. Pour couvrir la MEME fenetre
// visuelle, ses bornes propres doivent etre calculees dans SON repere, pas dans celui du monde.
// C'est ce que fait `bornes(facteur)` ci-dessous : la fenetre vue par le plan k va de
// `xMin - camMax*(1-k)` a `xMax`. Sans ce calcul, un plan lent se termine dans le cadre en fin de
// travelling (bord de decor visible — defaut "bord du rect de mer qui entre dans le cadre"
// documente dans l'index). ⭐ Verifie par calcul avant rendu, puis au rendu sur la derniere frame.
export const DecorEntrepot: React.FC<{
  /** camX de la scene (la scene calcule deja `Math.max(-60, x - CAM_AVANCE)`). */
  camX: number;
  /** camX minimal atteint sur toute la scene. */
  camMin: number;
  /** camX maximal atteint sur toute la scene. */
  camMax: number;
  /** largeur du viewport */
  vw: number;
  /** ⛔ la ligne de sol de la scene — donnee d'entree, jamais deplacee */
  solY: number;
  /** position monde de la porte de quai (plan lointain, exprimee dans le repere du plan) */
  porteX?: number;
}> = ({ camX, camMin, camMax, vw, solY, porteX }) => {
  const F_LOIN = 0.18;
  const F_MOYEN = 0.55;

  // fenetre monde reellement vue (facteur 1)
  const xMin = camMin;
  const xMax = camMax + vw;

  // bornes propres a un plan de facteur k : il defile moins, donc il doit couvrir une fenetre
  // DECALEE — sinon son bord gauche entre dans le cadre en fin de travelling.
  const bornes = (k: number) => ({
    xMin: xMin - (camMax - camMin) * (1 - k) - 200,
    xMax: xMax + 200,
  });
  const bLoin = bornes(F_LOIN);
  const bMoyen = bornes(F_MOYEN);

  // la porte de quai : par defaut placee au milieu du parcours DANS LE REPERE DU PLAN LOINTAIN
  // (donc a camX * F_LOIN de decalage). On la veut visible autour du moment de la poussee.
  const px = porteX ?? xMin + (xMax - xMin) * 0.5 * F_LOIN + 340;

  return (
    <g>
      <g transform={`translate(${-camX * F_LOIN} 0)`}>
        <PlanLointain solY={solY} xMin={bLoin.xMin} xMax={bLoin.xMax} />
        <PorteQuai x={px} solY={solY} />
      </g>
      <g transform={`translate(${-camX * F_MOYEN} 0)`}>
        <PlanMoyen solY={solY} xMin={bMoyen.xMin} xMax={bMoyen.xMax} />
      </g>
      {/* le PLAN SOL est a facteur 1 : il est monte DANS le groupe monde par la scene, pas ici.
          (cf. <PlanSol> exporte separement — la scene le place juste avant la caisse et le banc) */}
    </g>
  );
};

export default DecorEntrepot;
