// MOTEUR: objet/metaphore SVG (matiere calculee, pas d'image generee)
//
// Les 2 effets d'ecran du Chill Meter : 75 % (banquise du bord bas) et 100 % (gel des
// 4 bords + onde de choc + neige). Livrable client, contrat Upwork actif.
//
// POURQUOI DU SVG CALCULE ET PAS UNE IMAGE GENEREE
// -----------------------------------------------
// Les 2 cibles Gemini disent LA MATIERE (glace solide facettee au 75 %, fleurs de givre
// plumeuses au 100 %) mais aucune ne respecte les interdits : celle du 100 % accroche du
// givre sur les 4 cotes de la fenetre video, ce que le brief interdit deux fois
// (« Make sure it does not block the music video », Important Creative Rules).
// Une image ne se decoupe pas autour d'une zone protegee ; une geometrie, si.
// Ici, chaque piece connait sa position exacte, donc les 3 zones interdites (fenetre
// video, visage, tiers superieur au 75 %) sont des CONTRAINTES DE CONSTRUCTION, pas un
// masque applique apres coup.
//
// ⛔ Tout est deterministe (pseudo-random par graine) : deux rendus de la meme frame
// donnent le meme pixel. Aucun Math.random.

import React from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { GivreDefs, CRISTAUX, FLEURS } from "./GivrePlanche";

// ============================================================================
// LES ZONES PROTEGEES — mesurees sur public/_shared/rnd/abigirl-decor.png
// ============================================================================

/** La fenetre du clip musical. Cadre noir mesure : x 28..872, y 237..725.
 *  On garde 12 px de marge autour : RIEN ne doit y entrer, ni s'y accrocher.
 *  ⛔ Interdit n°1 du brief, repete dans « Important Creative Rules ». */
export const VIDEO = { x0: 16, y0: 225, x1: 884, y1: 737 };

/** Son visage (avec le casque). « My face should never be heavily obscured. »
 *  Mesure sur le livrable 100 %, sur les 135 frames : pic a 0,043 % — quelques flocons
 *  isoles, ce que le brief autorise explicitement (« a small amount of snow MAY pass
 *  over my face »). Jamais un voile. */
export const VISAGE = { x0: 1150, y0: 280, x1: 1460, y1: 700 };
const VISAGE_CX = (VISAGE.x0 + VISAGE.x1) / 2;
const VISAGE_CY = (VISAGE.y0 + VISAGE.y1) / 2;

const W = 1920;
const H = 1080;

/** Bruit deterministe : meme graine -> meme valeur, entre 0 et 1. */
const rnd = (seed: number) => {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Une piece touche-t-elle la fenetre video ? (test de boite, marge incluse) */
const toucheVideo = (x: number, y: number, w: number, h: number) =>
  x + w > VIDEO.x0 && x < VIDEO.x1 && y + h > VIDEO.y0 && y < VIDEO.y1;

// ============================================================================
// 75 % — LA BANQUISE DU BORD BAS
// ============================================================================
//
// La cible (RETENU-75-C3) montre de la MATIERE SOLIDE : des blocs de glace TRANSLUCIDES
// et facettes, empiles le long du bord bas, avec des stalactites qui pendent de leur
// arete superieure et un halo bleu derriere. Pas de vapeur, pas de volutes.
//
// ⭐ Construction par BLOCS INDIVIDUELS, pas par une masse continue (1re version testee
//    le 04/09 : une seule silhouette remplie donnait un aplat bleu opaque qui masquait
//    tout le bas du plateau et se lisait comme un zigzag decoupe aux ciseaux — la glace
//    n'etait plus lisible comme de la glace). Chaque bloc est un quadrilatere irregulier
//    avec ses propres facettes et ses aretes eclairees ; ils se CHEVAUCHENT, ce qui cree
//    la profondeur, et ils sont translucides, donc le decor rose reste visible dessous.
//
// ⛔ Interdit n°3 : « bottom edge only [...] The rest of the screen should remain clear. »
//    Le point le plus haut de tout l'effet est borne a CRETE_Y_MIN.
//    Verifie sur les 105 frames du livrable 75 % : tiers superieur a 0,000 %.
//    ⚠️ Cette contrainte vaut UNIQUEMENT au 75 %. Au 100 %, le brief demande au
//    contraire du givre sur les 4 bords « across the frame » : le tiers superieur y
//    mesure ~18 %, et c'est CONFORME, pas un defaut.
// ⛔ Interdit n°5 : le halo est LOCAL au bord bas, il ne desature pas le plateau.

/** y le plus haut atteint par la matiere. 852 = 79 % de la hauteur : on reste dans le
 *  quart bas. La fenetre video finit a y=737, on garde donc 115 px de vide entre les deux. */
const CRETE_Y_MIN = 852;

type Bloc = {
  /** sommets du quadrilatere, en coordonnees LOCALES au bloc (0 = son ancrage au sol) */
  x: number;
  larg: number;
  haut: number;
  /** decalage vertical des 2 coins hauts -> le dessus n'est jamais horizontal */
  dgauche: number;
  ddroite: number;
  /** inclinaison des cotes : un bloc de glace n'est pas un rectangle */
  penche: number;
  seed: number;
  /** plan : 0 = arriere (plus pale, plus haut), 1 = avant (plus contraste) */
  plan: number;
};

/** Les blocs, calcules une seule fois. Deux rangees : une en retrait (plan 0), une devant. */
const BLOCS: Bloc[] = (() => {
  const out: Bloc[] = [];
  // rangee arriere : plus haute, plus pale, moins nombreuse
  const N0 = 15;
  for (let i = 0; i < N0; i += 1) {
    const s = i * 3.7 + 1;
    const larg = 110 + rnd(s * 2.1) * 130;
    out.push({
      x: (i / N0) * (W + 160) - 80 + (rnd(s * 4.3) - 0.5) * 60,
      larg,
      // forte variance : une banquise a des pics et des creux, pas une bande reguliere
      haut: 34 + Math.pow(rnd(s * 5.9), 1.5) * 118,
      dgauche: (rnd(s * 7.1) - 0.5) * 46,
      ddroite: (rnd(s * 8.9) - 0.5) * 46,
      penche: (rnd(s * 11.3) - 0.5) * 26,
      seed: s,
      plan: 0,
    });
  }
  // rangee avant : plus basse, plus large, plus contrastee
  const N1 = 13;
  for (let i = 0; i < N1; i += 1) {
    const s = i * 6.1 + 200;
    const larg = 140 + rnd(s * 2.7) * 150;
    out.push({
      x: (i / N1) * (W + 180) - 90 + (rnd(s * 3.3) - 0.5) * 70,
      larg,
      haut: 26 + Math.pow(rnd(s * 4.7), 1.6) * 96,
      dgauche: (rnd(s * 6.7) - 0.5) * 38,
      ddroite: (rnd(s * 9.7) - 0.5) * 38,
      penche: (rnd(s * 12.1) - 0.5) * 22,
      seed: s,
      plan: 1,
    });
  }
  return out;
})();

/** Stalactites : elles pendent de l'arete superieure d'un bloc, vers le BAS.
 *  (1re version : elles etaient noyees DANS la masse, invisibles. Ici elles sont
 *  attachees au sommet d'un bloc identifie et pendent devant lui.) */
const STALACS = Array.from({ length: 38 }).map((_, i) => {
  const b = BLOCS[Math.floor(rnd(i * 5.3) * BLOCS.length)];
  const f = 0.12 + rnd(i * 7.9) * 0.76; // position le long de l'arete du bloc
  return {
    seed: i,
    bloc: b,
    f,
    len: 26 + rnd(i * 9.1) * 78,
    larg: 6 + rnd(i * 2.7) * 12,
  };
});

/** Le quadrilatere d'un bloc, a une hauteur de pousse donnee. */
const blocPath = (b: Bloc, pousse: number, respire: number) => {
  const h = b.haut * pousse;
  const yG = H - h + b.dgauche * pousse + respire;
  const yD = H - h + b.ddroite * pousse + respire;
  const xG = b.x + b.penche * pousse;
  const xD = b.x + b.larg - b.penche * pousse;
  // ⭐ Le dessus est POINTU, jamais un plateau. Test du 04/09 : avec deux « epaules »
  // horizontales, la banquise se lisait comme une skyline de rectangles. Un bloc de
  // glace se termine en POINTE (une arete relevee), avec un cran secondaire.
  // Sommet principal, place hors du centre pour eviter la symetrie.
  const fp = 0.3 + rnd(b.seed * 13.7) * 0.4;
  const xP = xG + (xD - xG) * fp;
  const pic = 26 + rnd(b.seed * 15.1) * 62;
  const yP = Math.min(yG, yD) - pic * pousse;
  // cran secondaire, plus bas, du cote le plus large
  const fs = fp > 0.5 ? fp * 0.42 : fp + (1 - fp) * 0.58;
  const xS = xG + (xD - xG) * fs;
  const yS = Math.min(yG, yD) - pic * pousse * (0.28 + rnd(b.seed * 17.3) * 0.28);
  // les 2 crans, ranges de gauche a droite
  const mids = [
    { x: xP, y: yP },
    { x: xS, y: yS },
  ].sort((u, v) => u.x - v.x);
  const d =
    `M ${b.x} ${H + 20} L ${xG} ${yG} L ${mids[0].x} ${mids[0].y} L ${mids[1].x} ${mids[1].y} ` +
    `L ${xD} ${yD} L ${b.x + b.larg} ${H + 20} Z`;
  const crete = `M ${xG} ${yG} L ${mids[0].x} ${mids[0].y} L ${mids[1].x} ${mids[1].y} L ${xD} ${yD}`;
  return { d, crete, yG, yD, xG, xD, yTop: Math.min(yG, yD, yP, yS) };
};

export const BottomIceBank: React.FC<{ intensity: number; t: number }> = ({ intensity, t }) => {
  if (intensity <= 0.002) return null;
  const pousse = Math.min(1, intensity);
  // Respiration : la banquise craque doucement, elle n'est pas une image fixe. ±1,8 px.
  const respire = Math.sin(t * 1.15) * 1.8 * pousse;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <GivreDefs />
      <defs>
        {/* Halo bleu LOCAL au bord bas — c'est lui qui porte le froid.
            ⛔ Interdit n°5 : on ne pose jamais de filtre froid sur tout le plateau. */}
        <linearGradient id="ice75_halo" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#7fd8ff" stopOpacity={0.3} />
          <stop offset="55%" stopColor="#5cc8ff" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#5cc8ff" stopOpacity={0} />
        </linearGradient>
        {/* Matiere du bloc : TRANSLUCIDE. La glace laisse voir a travers — c'est ce qui
            la distingue d'un aplat de peinture. Opacites max 0,52 en avant-plan. */}
        <linearGradient id="ice75_bloc_av" x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor="#f4fcff" stopOpacity={0.62} />
          <stop offset="30%" stopColor="#cfeeff" stopOpacity={0.44} />
          <stop offset="100%" stopColor="#63b8e8" stopOpacity={0.3} />
        </linearGradient>
        <linearGradient id="ice75_bloc_ar" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#eaf8ff" stopOpacity={0.42} />
          <stop offset="40%" stopColor="#b6e6ff" stopOpacity={0.26} />
          <stop offset="100%" stopColor="#7cc6ea" stopOpacity={0.18} />
        </linearGradient>
        <linearGradient id="ice75_facette" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.42} />
          <stop offset="100%" stopColor="#8fd8ff" stopOpacity={0} />
        </linearGradient>
      </defs>

      <g opacity={intensity}>
        {/* 1. le halo, borne au bord bas */}
        <rect x={0} y={790} width={W} height={H - 790} fill="url(#ice75_halo)" />

        {/* 2. les blocs, arriere puis avant. Ils se chevauchent -> profondeur. */}
        {[0, 1].map((plan) => (
          <g key={plan}>
            {BLOCS.filter((b) => b.plan === plan).map((b) => {
              const q = blocPath(b, pousse, respire);
              if (b.haut * pousse < 12) return null;
              return (
                <g key={`b${b.seed}`}>
                  <path d={q.d} fill={plan === 1 ? "url(#ice75_bloc_av)" : "url(#ice75_bloc_ar)"} />
                  {/* facette interne : une bande claire sous la crete, qui s'evanouit vers
                      le bas -> le bloc a du volume sans devenir un coin de verre. */}
                  <path
                    d={`${q.crete} L ${q.xD} ${q.yD + b.haut * pousse * 0.5} L ${q.xG} ${
                      q.yG + b.haut * pousse * 0.42
                    } Z`}
                    fill="url(#ice75_facette)"
                  />
                  {/* la crete eclairee, en 4 points : c'est elle qui fait lire « glace taillee ».
                      ⛔ Pas d'arete LATERALE : testee le 04/09, elle se lisait comme un joint
                      de panneau vitre, pas comme de la glace. */}
                  <path
                    d={q.crete}
                    stroke="#ffffff"
                    strokeWidth={plan === 1 ? 2.8 : 1.9}
                    strokeOpacity={plan === 1 ? 0.9 : 0.58}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}
          </g>
        ))}

        {/* 3. les stalactites — elles PENDENT de l'arete d'un bloc, vers le bas.
               Un objet de glace ne glisse pas : il pousse et il pend. */}
        {STALACS.map((st) => {
          const q = blocPath(st.bloc, pousse, respire);
          const yA = q.yG + (q.yD - q.yG) * st.f;
          const xA = q.xG + (q.xD - q.xG) * st.f;
          const g = Math.max(0, Math.min(1, (pousse - 0.3) / 0.55));
          // Elle ne depasse jamais la moitie de la hauteur du bloc : une stalactite qui
          // traverse tout le bloc se lit comme une rayure.
          const L = Math.min(st.len, st.bloc.haut * 0.55) * g;
          if (L < 6 || st.bloc.haut * pousse < 26) return null;
          return (
            <g key={`s${st.seed}`} opacity={0.62 + rnd(st.seed * 4.4) * 0.3}>
              {/* pointe legerement courbe : une stalactite n'est pas un triangle isocele */}
              <path
                d={`M ${xA - st.larg / 2} ${yA - 2} Q ${xA - st.larg * 0.28} ${yA + L * 0.55} ${
                  xA + rnd(st.seed * 3.1) * 5 - 2.5
                } ${yA + L} Q ${xA + st.larg * 0.3} ${yA + L * 0.5} ${xA + st.larg / 2} ${yA - 2} Z`}
                fill="#f4fdff"
                fillOpacity={0.82}
              />
              <path
                d={`M ${xA} ${yA} L ${xA} ${yA + L * 0.8}`}
                stroke="#ffffff"
                strokeWidth={1.1}
                strokeOpacity={0.55}
              />
            </g>
          );
        })}

        {/* 4. quelques cristaux accroches a la crete + quelques-uns qui montent lentement
               dans le halo. ⛔ Bornes : rien au-dessus de CRETE_Y_MIN - 40. */}
        {Array.from({ length: 24 }).map((_, i) => {
          const seed = i + 1;
          const vitesse = 0.03 + rnd(seed * 3.3) * 0.04;
          const phase = (t * vitesse + rnd(seed * 9.7)) % 1;
          const x = rnd(seed * 12.9) * W + Math.sin(t * 0.5 + seed) * 12;
          const y = Math.max(CRETE_Y_MIN - 40, H - 60 - phase * 240);
          const size = 11 + rnd(seed * 5.1) * 16;
          const op = intensity * (1 - phase * 0.85) * (0.2 + rnd(seed * 2.4) * 0.32);
          if (op < 0.02) return null;
          const rot = (t * (7 + (seed % 4) * 5) + seed * 31) % 360;
          return (
            <g key={`c${i}`} transform={`rotate(${rot} ${x} ${y + size / 2})`} opacity={op}>
              <use href={`#${CRISTAUX[i % CRISTAUX.length]}`} x={x - size / 2} y={y} width={size} height={size} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

// ============================================================================
// 100 % — GEL DES 4 BORDS + ONDE DE CHOC + NEIGE
// ============================================================================
//
// La cible (RETENU-100-F3) montre des fleurs de givre plumeuses qui poussent vers
// l'interieur depuis les 4 bords, plus des flocons dans l'air.
// ⛔ Sa version accroche du givre TOUT AUTOUR de la fenetre video : interdit. Ici le
//    bord gauche saute la tranche y 225..737 (la fenetre y occupe toute la largeur du
//    bord), et chaque piece est testee individuellement contre la boite VIDEO.

/** L'origine de l'onde : le centre du meter, dans le repere 1920x1080.
 *  Valeurs reprises du placement fige dans ChillMeterOverlay (chassis rustique). */
export const ONDE_ORIGINE = { x: 450, y: 900 };

/** Rayon auquel l'onde doit etre COMPLETEMENT eteinte du cote de son visage.
 *  Distance origine -> bord gauche de son visage = ~735 px. On s'eteint a 640,
 *  soit ~95 px avant de la toucher. ⛔ « fades before fully reaching my face », dit 2x. */
const R_EXTINCTION_VISAGE = 640;

/** L'onde est DIRECTIONNELLE : « expands upward and toward the right side ».
 *  On module le rayon par l'angle -> une onde ovale poussee en haut-a-droite,
 *  et on module l'opacite par la proximite du visage -> elle s'y eteint plus tot. */
const rayonDirectionnel = (angle: number, rBase: number) => {
  // angle 0 = droite, -PI/2 = haut. Facteur 1 vers le haut-droite, 0,55 vers le bas-gauche.
  const dirX = Math.cos(angle);
  const dirY = -Math.sin(angle); // positif = vers le haut
  const vers = (dirX * 0.62 + dirY * 0.78 + 1) / 2; // 0..1
  // 0,46 vers le bas-gauche, 1,32 vers le haut-droite : l'onde est franchement
  // poussee dans la direction demandee (« expands upward and toward the right side »).
  return rBase * (0.46 + vers * 0.86);
};

export const FullChillCoded: React.FC<{ progress: number; t: number }> = ({ progress, t }) => {
  if (progress <= 0.002) return null;

  const edge = Math.min(1, progress * 1.55);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <GivreDefs />
      <defs>
        <linearGradient id="fc_edge_h" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe4ff" stopOpacity={0.38} />
          <stop offset="45%" stopColor="#6fc4ea" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#6fc4ea" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="fc_edge_v" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bfe4ff" stopOpacity={0.38} />
          <stop offset="45%" stopColor="#6fc4ea" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#6fc4ea" stopOpacity={0} />
        </linearGradient>
        <radialGradient id="fc_wave_core">
          <stop offset="70%" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="92%" stopColor="#dff4ff" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#8fe4ff" stopOpacity={0} />
        </radialGradient>
      </defs>

      <EdgeFrost edge={edge} t={t} />
      <ShockWaveCoded progress={progress} />
      <Neige progress={progress} t={t} />
    </svg>
  );
};

/** Le gel des 4 bords.
 *
 *  ⭐⭐ ANCRAGE PAR LA RACINE, ET BOITE CALCULEE APRES ROTATION.
 *  Le symbole fleur_givre a sa racine en (100,190) dans un viewBox 200x200 et pousse vers
 *  le HAUT. On le place donc par SA RACINE sur le bord, puis on le tourne pour qu'il pousse
 *  vers l'interieur du cadre.
 *  ⛔ Bug paye le 04/09 : je testais la boite AVANT rotation. Une fleur du bord haut,
 *     tournee de 180 deg autour de sa racine, se retrouvait 1,4 x sa taille PLUS BAS que
 *     la boite testee — plusieurs plongeaient en plein dans la fenetre video (mesure :
 *     11,7 % de la fenetre couverte). La boite doit etre calculee APRES la rotation.
 */
const EdgeFrost: React.FC<{ edge: number; t: number }> = ({ edge, t }) => {
  type Piece = {
    key: string;
    /** racine, POSEE SUR LE BORD */
    rx: number;
    ry: number;
    size: number;
    /** direction de pousse, en degres : 0 = vers le haut (orientation native du symbole) */
    rot: number;
    seuil: number;
    id: string;
  };

  /** Boite reellement occupee par la fleur, une fois posee racine en (rx,ry), taille `size`,
   *  et tournee de `rot` degres autour de sa racine.
   *  Non tournee, la fleur occupe [rx - size/2, rx + size/2] x [ry - size*0.95, ry + size*0.05]. */
  const boite = (p: Piece) => {
    const hw = p.size / 2;
    const hautRel = p.size * 0.95;
    const basRel = p.size * 0.05;
    const coins: [number, number][] = [
      [-hw, -hautRel],
      [hw, -hautRel],
      [hw, basRel],
      [-hw, basRel],
    ];
    const a = (p.rot * Math.PI) / 180;
    const co = Math.cos(a);
    const si = Math.sin(a);
    const xs = coins.map(([cx, cy]) => p.rx + cx * co - cy * si);
    const ys = coins.map(([cx, cy]) => p.ry + cx * si + cy * co);
    return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  };

  const pieces: Piece[] = [];

  // --- bord HAUT : racine sur y=0, pousse vers le BAS (rot 180) ---
  // La fenetre video commence a y=225 : une fleur du bord haut ne doit donc jamais
  // depasser 225 - marge. Sa portee vers l'interieur = size * 0,95, d'ou size <= ~200
  // au-dessus de la fenetre, et libre ailleurs.
  // ⭐ BEAUCOUP de PETITES fleurs, pas quelques grandes. Test du 04/09 : a 300 px, le
  // symbole fleur_givre se lit comme une BRANCHE D'ARBRE NUE, pas comme du givre. Le
  // givre d'une vitre est un TAPIS dense de petites fougeres qui se recouvrent — la
  // densite fait la matiere, la taille la detruit.
  const N_HAUT = 52;
  for (let i = 0; i < N_HAUT; i += 1) {
    const s = i * 3.1 + 1;
    const rx = ((i + 0.5) / N_HAUT) * W + (rnd(s * 5.5) - 0.5) * 80;
    // au-dessus de la fenetre video, on borne la portee ; ailleurs on laisse grand
    const auDessusVideo = rx > VIDEO.x0 - 60 && rx < VIDEO.x1 + 60;
    const maxPortee = auDessusVideo ? (VIDEO.y0 - 18) / 0.95 : 300;
    pieces.push({
      key: `h${i}`,
      rx,
      ry: -6 - rnd(s * 3.3) * 14,
      size: Math.min(maxPortee, 58 + Math.pow(rnd(s * 2.2), 1.7) * 105),
      // l'angle varie de ±32 deg : un tapis de givre n'est pas peigne dans un seul sens
      rot: 180 + (rnd(s * 21.7) - 0.5) * 64,
      seuil: rnd(s * 7.7) * 0.45,
      id: FLEURS[i % FLEURS.length],
    });
  }

  // --- bord BAS : racine sur y=H, pousse vers le HAUT (rot 0) ---
  const N_BAS = 44;
  for (let i = 0; i < N_BAS; i += 1) {
    const s = i * 4.7 + 40;
    pieces.push({
      key: `b${i}`,
      rx: ((i + 0.5) / N_BAS) * W + (rnd(s * 5.5) - 0.5) * 80,
      ry: H + 6 + rnd(s * 3.3) * 14,
      size: 62 + Math.pow(rnd(s * 2.2), 1.7) * 115,
      rot: (rnd(s * 21.7) - 0.5) * 64,
      seuil: rnd(s * 7.7) * 0.45,
      id: FLEURS[i % FLEURS.length],
    });
  }

  // --- bord GAUCHE : racine sur x=0, pousse vers la DROITE (rot 90).
  // La fenetre video occupe y 225..737 sur toute la largeur du bord gauche : on ne pose
  // donc AUCUNE fleur dans cette tranche. C'est la traduction geometrique de
  // « Make sure it does not block the music video ».
  [
    { y0: 8, y1: 205, n: 11 },
    { y0: 758, y1: H - 8, n: 15 },
  ].forEach((b, bi) =>
    Array.from({ length: b.n }).forEach((_, i) => {
      const s = bi * 17 + i * 6.3 + 80;
      pieces.push({
        key: `g${bi}_${i}`,
        rx: -6 - rnd(s * 4.1) * 12,
        ry: b.y0 + ((i + 0.5) / b.n) * (b.y1 - b.y0),
        size: 52 + Math.pow(rnd(s * 2.9), 1.6) * 92,
        rot: 90 + (rnd(s * 21.7) - 0.5) * 60,
        seuil: rnd(s * 8.8) * 0.45,
        id: FLEURS[(i + bi) % FLEURS.length],
      });
    })
  );

  // --- bord DROIT : racine sur x=W, pousse vers la GAUCHE (rot 270).
  // Devant son visage on reduit fortement (« never heavily obscured »).
  for (let i = 0; i < 32; i += 1) {
    const s = i * 5.9 + 130;
    pieces.push({
      key: `d${i}`,
      rx: W + 6 + rnd(s * 4.4) * 12,
      ry: ((i + 0.5) / 32) * H + (rnd(s * 3.7) - 0.5) * 40,
      size: 55 + Math.pow(rnd(s * 2.4), 1.6) * 98,
      rot: 270 + (rnd(s * 21.7) - 0.5) * 60,
      seuil: rnd(s * 9.3) * 0.45,
      id: FLEURS[i % FLEURS.length],
    });
  }

  return (
    <g>
      {/* Nappes de bord — ⛔ INTERDIT n°5 : elles ne doivent pas desaturer le plateau.
          1re version testee le 04/09 : des rectangles gris pale de 104 px sur les 4 cotes
          faisaient tomber la saturation de la zone temoin de 60,3 a 49,8. Ici : bandes
          COURTES (56 px), en degrade qui part de transparent, et en `screen` — un mode
          qui n'ajoute que de la lumiere et ne peut donc pas laver la couleur.
          La nappe gauche est coupee pour epargner la tranche de la fenetre video. */}
      <g opacity={edge * 0.85} style={{ mixBlendMode: "screen" }}>
        <rect x={0} y={0} width={W} height={56} fill="url(#fc_edge_h)" />
        <rect
          x={0}
          y={H - 72}
          width={W}
          height={72}
          fill="url(#fc_edge_h)"
          transform={`rotate(180 ${W / 2} ${H - 36})`}
        />
        <rect x={0} y={0} width={56} height={200} fill="url(#fc_edge_v)" />
        <rect x={0} y={762} width={56} height={H - 762} fill="url(#fc_edge_v)" />
        <rect
          x={W - 56}
          y={0}
          width={56}
          height={H}
          fill="url(#fc_edge_v)"
          transform={`rotate(180 ${W - 28} ${H / 2})`}
        />
      </g>

      {pieces.map((p) => {
        const local = Math.max(0, Math.min(1, (edge - p.seuil) / 0.45));
        if (local <= 0.01) return null;

        // ⛔ garde-fou dur, sur la boite REELLE (apres rotation) : aucune fleur ne
        // chevauche la fenetre video, jamais.
        const bb = boite(p);
        if (bb.x1 > VIDEO.x0 && bb.x0 < VIDEO.x1 && bb.y1 > VIDEO.y0 && bb.y0 < VIDEO.y1) return null;

        // La fleur POUSSE depuis sa racine : elle grandit, elle n'apparait pas en fondu seul.
        const g = 0.5 + local * 0.5;
        // fremissement lent : le givre respire
        const frem = 1 + Math.sin(t * 0.9 + p.rx * 0.01) * 0.014;
        const ech = g * frem;

        // proche de son visage -> tres attenue
        const dVisage = Math.hypot(p.rx - VISAGE_CX, p.ry - VISAGE_CY);
        const faceGuard = dVisage < 340 ? 0.16 : dVisage < 560 ? 0.45 : 1;

        // le <use> est pose de sorte que la RACINE du symbole (100,190 sur 200) tombe
        // exactement en (0,0) du repere local, puis on tourne et on met a l'echelle.
        return (
          <g
            key={p.key}
            transform={`translate(${p.rx} ${p.ry}) rotate(${p.rot}) scale(${ech})`}
            opacity={local * 0.95 * faceGuard}
          >
            <use href={`#${p.id}`} x={-p.size / 2} y={-p.size * 0.95} width={p.size} height={p.size} />
          </g>
        );
      })}
    </g>
  );
};

/** L'onde de choc — CODEE, pas generee.
 *
 *  ⭐⭐ C'EST UN ARC, PAS UN CERCLE. Trois versions ont ete rendues et mesurees le 04/09
 *  avant d'arriver la :
 *    v1 cercle complet, rayon file a 1750 : invisible, hors cadre en 10 frames.
 *    v2 cercle complet + extinction par segment : l'onde sortait en MORCEAUX epars
 *       (mesure : 0,82 % du cadre a la frame 10, puis 0,02 %) — la fenetre video lui
 *       arrachait tout le quart haut-gauche et le visage tout le cote droit. Ca ne se
 *       lisait pas comme une onde, mais comme trois arcs sans rapport.
 *    v3 (celle-ci) : on ne dessine QUE le secteur qui part reellement « upward and
 *       toward the right side ». Le reste du cercle n'existe pas — il n'a donc plus a
 *       etre efface, et il n'y a plus de trous.
 *
 *  Le secteur va de -12 deg (vers la droite, legerement descendant) a +104 deg (vers le
 *  haut, un peu a gauche). L'angle 0 est vers la droite, positif vers le haut.
 *  ⛔ Il ne peut pas atteindre la fenetre video : celle-ci est a GAUCHE et EN HAUT de
 *     l'origine, hors du secteur. Verifie quand meme, segment par segment.
 *  ⛔ Il s'eteint avant le visage : l'opacite tombe a 0 des que le front passe sous
 *     440 px du centre du visage.
 *  ⛔ Aucun flou : un gros cercle floute sort en rectangle opaque en headless. */
// ⛔ A1 ramene de 104 a 88 deg : au-dela, le haut de l'arc venait fraiser le coin
// bas-droit de la fenetre video (mesure du 04/09 : 0,027 % de la fenetre a la frame 20).
// A 88 deg l'arc reste vertical au plus haut, il ne bascule jamais vers la gauche.
const A0 = (-14 * Math.PI) / 180;
const A1 = (88 * Math.PI) / 180;

const ShockWaveCoded: React.FC<{ progress: number }> = ({ progress }) => {
  // Le front part vite puis ralentit (une onde perd son energie). 760 px de portee :
  // il reste DANS le cadre au lieu d'en sortir au tiers du clip.
  const rBase = interpolate(progress, [0, 0.9], [0, 760], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  if (rBase < 8) return null;

  const opGlobale = interpolate(progress, [0, 0.08, 0.62, 1], [0, 1, 0.72, 0], {
    extrapolateRight: "clamp",
  });
  if (opGlobale <= 0.01) return null;

  /** Un front d'onde : la polyligne du secteur, a un rayon donne. */
  const front = (rb: number) => {
    const N = 96;
    const segs: { d: string; op: number }[] = [];
    let prev: { x: number; y: number; op: number } | null = null;
    for (let i = 0; i <= N; i += 1) {
      const a = A0 + ((A1 - A0) * i) / N;
      const r = rayonDirectionnel(a, rb);
      const x = ONDE_ORIGINE.x + Math.cos(a) * r;
      const y = ONDE_ORIGINE.y - Math.sin(a) * r;

      // Extinction — le visage. « fades before fully reaching my face », dit 2 fois.
      const dV = Math.hypot(x - VISAGE_CX, y - VISAGE_CY);
      let op = 1;
      if (dV < 440) op = 0;
      else if (dV < 660) op = (dV - 440) / 220;

      // Les extremites de l'arc s'estompent : un front d'onde n'a pas de bout net.
      const f = i / N;
      op *= Math.min(1, f / 0.14) * Math.min(1, (1 - f) / 0.14);

      // ⛔ garde-fou : jamais dans la fenetre video. Le test porte sur la LIGNE MEDIANE
      // du trait, alors que le halo fait 34 px de large : on elargit donc la zone
      // interdite de la demi-epaisseur du trait le plus large (+24 px de marge).
      // Sans cette marge, mesure du 04/09 : 86 px du cadre bas de la fenetre etaient
      // effleures a la frame 20 (y 720..724) — invisible a l'oeil, mais c'est
      // exactement l'interdit n°1, qui ne tolere pas « un peu ».
      const M = 24;
      if (x > VIDEO.x0 - M && x < VIDEO.x1 + M && y > VIDEO.y0 - M && y < VIDEO.y1 + M) op = 0;
      if (x < -40 || x > W + 40 || y < -40 || y > H + 40) op = 0;

      if (prev) {
        const so = Math.min(prev.op, op);
        if (so > 0.02) {
          segs.push({
            d: `M ${prev.x.toFixed(1)} ${prev.y.toFixed(1)} L ${x.toFixed(1)} ${y.toFixed(1)}`,
            op: so,
          });
        }
      }
      prev = { x, y, op };
    }
    return segs;
  };

  const principal = front(rBase);
  // Deux fronts en retard : l'onde a une EPAISSEUR, elle n'est pas un trait unique.
  const suivant = rBase > 120 ? front(rBase * 0.82) : [];
  const dernier = rBase > 240 ? front(rBase * 0.64) : [];

  return (
    <g>
      {/* halo large, tres doux : c'est lui qui donne le « souffle » */}
      {principal.map((s, i) => (
        <path
          key={`h${i}`}
          d={s.d}
          stroke="#bfe9ff"
          strokeWidth={34}
          strokeOpacity={s.op * opGlobale * 0.16}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      {/* front principal : net et clair, c'est lui qu'on lit */}
      {principal.map((s, i) => (
        <g key={`p${i}`}>
          <path d={s.d} stroke="#ffffff" strokeWidth={7} strokeOpacity={s.op * opGlobale * 0.95} fill="none" strokeLinecap="round" />
          <path d={s.d} stroke="#8fe4ff" strokeWidth={13} strokeOpacity={s.op * opGlobale * 0.4} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* trainee : 2 fronts plus faibles, en retard */}
      {suivant.map((s, i) => (
        <path key={`s${i}`} d={s.d} stroke="#dff4ff" strokeWidth={3.5} strokeOpacity={s.op * opGlobale * 0.45} fill="none" strokeLinecap="round" />
      ))}
      {dernier.map((s, i) => (
        <path key={`d${i}`} d={s.d} stroke="#bfe9ff" strokeWidth={2.2} strokeOpacity={s.op * opGlobale * 0.24} fill="none" strokeLinecap="round" />
      ))}
    </g>
  );
};

/** La neige. « Wind gusts, snow, icy particles across the frame », mais
 *  « a SMALL amount of snow may pass over my face » et jamais sur la fenetre video. */
const Neige: React.FC<{ progress: number; t: number }> = ({ progress, t }) => {
  const N = 90;
  return (
    <g>
      {Array.from({ length: N }).map((_, i) => {
        const seed = i + 1;
        const seuil = rnd(seed * 1.9) * 0.3;
        const local = Math.max(0, Math.min(1, (progress - seuil) / 0.45));
        if (local <= 0.01) return null;

        // rafale : portee vers la droite (le vent vient du meter, en bas a gauche)
        const drift = t * (34 + rnd(seed * 2.4) * 78);
        const x = ((rnd(seed * 12.9) * (W + 200) + drift) % (W + 200)) - 100;
        const chute = t * (16 + rnd(seed * 4.1) * 40);
        const y = ((rnd(seed * 78.2) * (H + 160) + chute) % (H + 160)) - 80;

        const prof = Math.min(1, Math.max(0, y / H));
        const size = 12 + prof * 34 + rnd(seed * 5.9) * 12;

        // ⛔ jamais sur la fenetre video. Le flocon est un carre `size` centre en (x, y+size/2),
        // et il tourne : sa boite reelle vaut sa diagonale. On teste la DIAGONALE, pas le carre.
        const diag = size * 0.71;
        if (toucheVideo(x - diag, y + size / 2 - diag, diag * 2, diag * 2)) return null;

        // sur son visage : seulement 1 flocon sur 6, petit et discret
        const surVisage = x > VISAGE.x0 - 40 && x < VISAGE.x1 + 40 && y > VISAGE.y0 - 40 && y < VISAGE.y1;
        if (surVisage && seed % 6 !== 0) return null;
        const faceGuard = surVisage ? 0.3 : 1;
        const tailleReelle = surVisage ? Math.min(size, 16) : size;

        const op = local * (0.22 + prof * 0.5) * faceGuard;
        if (op < 0.02) return null;
        const rot = (t * (7 + (seed % 5) * 5) + seed * 47) % 360;
        return (
          <g key={i} transform={`rotate(${rot} ${x} ${y + tailleReelle / 2})`} opacity={op}>
            <use
              href={`#${CRISTAUX[i % CRISTAUX.length]}`}
              x={x - tailleReelle / 2}
              y={y}
              width={tailleReelle}
              height={tailleReelle}
            />
          </g>
        );
      })}
    </g>
  );
};

// ============================================================================
// COMPOSITION D'ESSAI — les 2 effets, plein cadre, fond transparent
// ============================================================================

export const EFFET75_FRAMES = 90;
export const EFFET100_FRAMES = 120;

/** L'effet 75 % seul, sans le meter : sert a MESURER les zones protegees sans que
 *  l'objet ne fausse le comptage de pixels. */
export const Effet75Seul: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intensity = interpolate(frame, [0, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill>
      <BottomIceBank intensity={intensity} t={frame / fps} />
    </AbsoluteFill>
  );
};

/** L'effet 100 % seul. */
export const Effet100Seul: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // ⛔ Rampe LINEAIRE — voir OndeSeule : le double easing eteignait l'onde.
  const progress = interpolate(frame, [0, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <BottomIceBank intensity={1} t={frame / fps} />
      <FullChillCoded progress={progress} t={frame / fps} />
    </AbsoluteFill>
  );
};


/** L'onde SEULE, sans givre ni neige — outil de diagnostic. */
export const OndeSeule: React.FC = () => {
  const frame = useCurrentFrame();
  // ⛔ Rampe LINEAIRE. Chaque effet applique DEJA sa propre courbe : empiler un
  // Easing.out ici saturait progress a 1 en quelques frames et l'onde s'eteignait
  // avant d'avoir ete vue (mesure du 04/09 : 0,12 % du cadre a la frame 15, 0 % a 35).
  const progress = interpolate(frame, [0, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <ShockWaveCoded progress={progress} />
      </svg>
    </AbsoluteFill>
  );
};
