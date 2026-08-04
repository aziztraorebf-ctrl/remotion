// GazoducActe2Signature — Acte 2, insert SVG narratif "genèse 2016 + signature Freetown", joué en
// DEUX temps distincts (composant réutilisé à 2 endroits du montage, cf STATUS.md découpage réel) :
//   - Temps A "Freetown" (94.3s→116.3s narration-p2, 22s/660f) : le décor se met en place (arche,
//     bannières encore GRISES/ternes — accord annoncé mais pas encore détaillé), PUIS coupe vers la
//     carte (segment distinct, GazoducActe2AAGP.tsx).
//   - Temps B "Flashback 2016" (138.3s→171.4s narration-p2, 33.06s/992f) : les 12 bannières se
//     colorient une à une (vraies couleurs ECOWAS) en synchro avec chaque signature qui apparaît,
//     sceau doré final.
// Composition statique de base : mix SVG "signature-gpt-libre" (arche+colonnes+document+sceau+plume,
// GPT-5.6 Sol, brief liberté créative) + 12 bannières (remplacent les 15 fauteuils GPT, empruntées au
// gabarit "signature-fable-libre") — cf memory/episodes/souverain/gazoduc-aagp-tsgp/
// svg-inserts-acte2-candidats/. Choix Aziz 2026-08-04 après comparaison des 20 candidats (12 dirigés
// + 8 "liberté créative" testés sur 4 modèles externes ce jour, cf STATUS.md).
//
// ⛔ Correction factuelle (recherche web 2026-08-04, PAS la mémoire pré-entraînement) : le script narre
// "quinze chefs d'État" mais les sources (maroc.ma, capmad, tribuneonlineng) confirment que Freetown
// n'a réuni QUE les 12 membres ECOWAS actuels (Bénin, Cap-Vert, Côte d'Ivoire, Gambie, Ghana, Guinée,
// Guinée-Bissau, Libéria, Nigeria, Sénégal, Sierra Leone, Togo) — Maroc et Mauritanie signent à part,
// lors d'une cérémonie séparée au Maroc. Décision Aziz : garder le texte "quinze" tel quel (audio déjà
// validé, pas de re-génération), mais afficher 12 VRAIS drapeaux + une correction factuelle courte en
// bas d'écran ("12 États membres actuels de la CEDEAO", 2-3s, PAS un sous-titre karaoké).
//
// Ordre des 12 bannières : PAS alphabétique — plusieurs pays partagent la même famille de palette
// panafricaine rouge/jaune/vert (Ghana 1957, copié par Guinée puis Guinée-Bissau, plus Bénin/Sénégal/
// Togo) ou rouge/blanc/bleu (Cap-Vert/Gambie/Libéria) — l'ordre alphabétique les collait en bloc
// ("on dirait que c'est tout le temps le même drapeau", retour Aziz). Réordonné pour qu'aucune paire
// adjacente ne partage la même famille.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const GAZODUC_A2_SIGNATURE_FREETOWN_FRAMES = 660; // 22s @30fps — temps A
// Marge de sécurité audio (retour Aziz 2026-08-04) : "s'enchaînent." coupé avant sa fin au montage
// v1/v2 — la Sequence tranche l'Audio net à sa durée. +9f (300ms) de hold visuel avant la coupe.
const AUDIO_SAFETY_MARGIN_F = 9;
export const GAZODUC_A2_SIGNATURE_FLASHBACK_FRAMES = 992 + AUDIO_SAFETY_MARGIN_F; // 33.06s + marge

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * 30);

const BG = "#182746";
const GOLD = "#FFC742";

// ===== 12 pays ECOWAS actuels — couleurs vérifiées (recherche web 2026-08-04), ordre réordonné =====
const COUNTRIES: { name: string; colors: [string, string, string] }[] = [
  { name: "Ghana", colors: ["#ce1126", "#fcd116", "#006b3f"] },
  { name: "Cap-Vert", colors: ["#003893", "#ffffff", "#cf2027"] },
  { name: "Bénin", colors: ["#008751", "#fcd116", "#e8112d"] },
  { name: "Sierra Leone", colors: ["#1eb53a", "#ffffff", "#0072c6"] },
  { name: "Guinée", colors: ["#ce1126", "#fcd116", "#009460"] },
  { name: "Côte d'Ivoire", colors: ["#f77f00", "#ffffff", "#009e60"] },
  { name: "Togo", colors: ["#006a4e", "#ffce00", "#d21034"] },
  { name: "Gambie", colors: ["#ce1126", "#ffffff", "#0c1c8c"] },
  { name: "Sénégal", colors: ["#00853f", "#fcd116", "#e31b23"] },
  { name: "Nigeria", colors: ["#008751", "#ffffff", "#008751"] },
  { name: "Guinée-Bissau", colors: ["#ce1126", "#fcd116", "#009e49"] },
  { name: "Libéria", colors: ["#ef3340", "#ffffff", "#00205b"] },
];
const GRIS_BANNIERE = "#3a5488"; // teinte neutre "pas encore signé" (temps A)

// Positions sur l'arc — reprises telles quelles de signature-gpt-libre.svg (quinze_fauteuils),
// ré-échantillonnées de 15 à 12 points en gardant la même courbure (cf build-signature-mix.py).
const ARC_POS: [number, number, number][] = [
  [350, 385, 0.76], [438, 345, 0.8], [525, 314, 0.84], [612, 288, 0.88], [699, 270, 0.92],
  [786, 257, 0.95], [873, 250, 0.98], [960, 247, 1.0], [1047, 250, 0.98], [1134, 257, 0.95],
  [1221, 270, 0.92], [1308, 288, 0.88], [1395, 314, 0.84], [1482, 345, 0.8], [1570, 385, 0.76],
];
function interpArcPos(i: number, n = 12): [number, number, number] {
  const t = (i / (n - 1)) * (ARC_POS.length - 1);
  const i0 = Math.floor(t);
  const i1 = Math.min(i0 + 1, ARC_POS.length - 1);
  const frac = t - i0;
  const [x0, y0, s0] = ARC_POS[i0];
  const [x1, y1, s1] = ARC_POS[i1];
  return [x0 + (x1 - x0) * frac, y0 + (y1 - y0) * frac, s0 + (s1 - s0) * frac];
}

// Signatures : grille 4×3 (au lieu des 15 d'origine en 5×5×5) — même forme relative de paraphe que
// signature-gpt-libre.svg (juste repositionnée), même largeur totale de document.
const SIG_SHAPE = "c14-26 15 26 36-6 c6-9 3 26 30 5 c9-7 8 10 23 6"; // forme relative (delta depuis M)
const SIG_ROWS_Y = [646, 717, 788];
const SIG_COLS_X = [640, 830, 1020, 1210]; // 4 colonnes, centré sur le document (611-1309)

// ===== Bannière (drapeau stylisé, 3 bandes horizontales) =====
const Banniere: React.FC<{
  x: number; y: number; scale: number; colors: [string, string, string]; colorProgress: number; dropIn: number;
}> = ({ x, y, scale, colors, colorProgress, dropIn }) => {
  const w = 42, h = 128, bandH = h / 3;
  const [c1, c2, c3] = colors;
  const bands: [string, number][] = [[c1, 0], [c2, 1], [c3, 2]];
  return (
    <g transform={`translate(${x} ${y - 200 + dropIn * 200}) scale(${scale})`} opacity={interpolate(dropIn, [0, 0.15], [0, 1], clampB)}>
      <line x1={0} y1={-h / 2} x2={0} y2={-140} stroke="#7285a7" strokeWidth={3} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={GRIS_BANNIERE} opacity={1 - colorProgress} />
      {colorProgress > 0.01 &&
        bands.map(([c, i]) => (
          <rect key={i} x={-w / 2} y={-h / 2 + i * bandH} width={w} height={bandH} fill={c} opacity={colorProgress} />
        ))}
      <path d={`M${-21} ${h / 2} H${21} L${21} ${h / 2 + 38} L0 ${h / 2 + 12} L${-21} ${h / 2 + 38} Z`}
        fill={colorProgress > 0.5 ? c1 : GRIS_BANNIERE} stroke="#182746" strokeWidth={1.5} />
      <rect x={-21} y={-h / 2} width={42} height={h} fill="none" stroke="#182746" strokeWidth={2} />
    </g>
  );
};

const SIG_WIDTH = 108;
const SIG_DASH_LEN = 140;

const Signature: React.FC<{ x: number; y: number; reveal: number }> = ({ x, y, reveal }) => {
  if (reveal <= 0) return null;
  return (
    <g opacity={interpolate(reveal, [0, 0.2], [0, 1], clampB)}>
      <path d={`M${x - SIG_WIDTH / 2} ${y} ${SIG_SHAPE}`} fill="none" stroke="#526684" strokeWidth={3}
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={SIG_DASH_LEN} strokeDashoffset={SIG_DASH_LEN * (1 - reveal)} />
      <line x1={x - SIG_WIDTH / 2 - 15} y1={y + 15} x2={x + SIG_WIDTH / 2 + 15} y2={y + 15} stroke="#8493aa" strokeWidth={1.5}
        opacity={interpolate(reveal, [0.7, 1], [0, 1], clampB)} />
    </g>
  );
};

// ===== Plume mobile — suit la pointe du tracé en cours d'écriture (Temps B uniquement, retour Aziz
// 2026-08-04 : "le stylo qui écrit" plutôt que des signatures qui se dessinent seules). Pointe
// positionnée à x_courant = x_debut + w*reveal (avance de gauche à droite pendant le tracé), saute
// à la signature suivante entre 2 écritures (interpolation linéaire du point de pose). =====
const PlumeMobile: React.FC<{ nibX: number; nibY: number; opacity: number }> = ({ nibX, nibY, opacity }) => {
  // géométrie reprise de plume_ceremonielle (signature-gpt-libre.svg) : pointe en bas-gauche du corps,
  // corps qui monte à ~34° vers la droite. Ancrée sur la pointe (nibX,nibY) au lieu de la position fixe.
  const dx = 1453 - 1192, dy = 690 - 861; // vecteur corps original
  const len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len;
  const bodyEndX = nibX + ux * len, bodyEndY = nibY + uy * len;
  const tipX = bodyEndX + ux * 63, tipY = bodyEndY + uy * 41;
  const tipSideX = bodyEndX + ux * 18 - uy * 25, tipSideY = bodyEndY + uy * 18 + ux * 25;
  return (
    <g opacity={opacity}>
      <path d={`M${nibX} ${nibY} L${bodyEndX} ${bodyEndY}`} fill="none" stroke="#111d34" strokeWidth={22} strokeLinecap="round" />
      <path d={`M${nibX + ux * 20 - uy * 14} ${nibY + uy * 20 + ux * 14} L${bodyEndX - ux * 15} ${bodyEndY - uy * 15}`}
        fill="none" stroke="#7285a7" strokeWidth={5} strokeLinecap="round" />
      <path d={`M${bodyEndX} ${bodyEndY} L${tipX} ${tipY} L${tipSideX} ${tipSideY} Z`} fill={GOLD} stroke="#182746" strokeWidth={5} />
    </g>
  );
};

// Longueurs de path approx (pour strokeDashoffset) — colonnes/chapiteaux/arche.
const COLONNE_LEN = 1550; // périmètre approx d'une colonne (x2 dans le même path)
const CHAPITEAU_LEN = 480;
const ARCHE_LEN = 1520; // courbe Q approx 238,312 -> 1682,312

// ===== Décor statique repris de signature-gpt-libre.svg (fond, architecture, table, document) =====
const DecorStatique: React.FC<{ reveal: number }> = ({ reveal }) => (
  <>
    <g id="fond_bleu_marine">
      <rect width={1920} height={1080} fill={BG} />
      <path d="M0 0H1920V1080H0Z" fill="none" stroke="#2a3f66" strokeWidth={28} />
    </g>
    <g id="rayonnement_institutionnel" opacity={0.42 * reveal}>
      <path d="M960 180 L182 688 M960 180 L318 810 M960 180 L505 950
               M960 180 L714 1015 M960 180 L960 1040 M960 180 L1206 1015
               M960 180 L1415 950 M960 180 L1602 810 M960 180 L1738 688"
        fill="none" stroke="#3a5488" strokeWidth={2} />
      <circle cx={960} cy={180} r={52} fill="none" stroke="#3a5488" strokeWidth={2} />
      <circle cx={960} cy={180} r={86} fill="none" stroke="#2a3f66" strokeWidth={2} />
    </g>
    <g id="architecture_salle_diplomatique">
      {/* Colonnes + arche se DESSINENT (contour), pas un simple fondu (retour Aziz 2026-08-04 :
          "pour la scène numéro un, la scène avec les bannières" — même traitement que le document
          signature). Colonnes en premier, puis arche, médaillon en dernier — les bannières
          descendent APRÈS (synchro déjà câblée sur BANNIERE_SYNC_START, cf composant appelant). */}
      <path d="M92 653V154 H238 V653 M1682 653V154 H1828 V653" fill="#22375c" fillOpacity={interpolate(reveal, [0.15, 0.4], [0, 1], clampB)}
        stroke="#7285a7" strokeWidth={3} strokeDasharray={COLONNE_LEN} strokeDashoffset={COLONNE_LEN * (1 - interpolate(reveal, [0, 0.35], [0, 1], clampB))} />
      <path d="M72 154H258V122H72Z M1662 154H1848V122H1662Z" fill="#2a3f66" fillOpacity={interpolate(reveal, [0.25, 0.5], [0, 1], clampB)}
        stroke="#91a0b8" strokeWidth={3} strokeDasharray={CHAPITEAU_LEN} strokeDashoffset={CHAPITEAU_LEN * (1 - interpolate(reveal, [0.1, 0.45], [0, 1], clampB))} />
      <path d="M105 154V653 M139 154V653 M191 154V653 M225 154V653
               M1695 154V653 M1729 154V653 M1781 154V653 M1815 154V653"
        fill="none" stroke="#3a5488" strokeWidth={4} opacity={interpolate(reveal, [0.2, 0.5], [0, 1], clampB)} />
      <path d="M92 653H238 M1682 653H1828" fill="none" stroke="#9ca9be" strokeWidth={4} opacity={interpolate(reveal, [0.3, 0.55], [0, 1], clampB)} />
      <path d="M238 312 Q960-130 1682 312" fill="none" stroke="#7285a7" strokeWidth={4}
        strokeDasharray={ARCHE_LEN} strokeDashoffset={ARCHE_LEN * (1 - interpolate(reveal, [0.4, 0.85], [0, 1], clampB))} />
      <path d="M270 327 Q960-75 1650 327" fill="none" stroke="#3a5488" strokeWidth={12}
        strokeDasharray={ARCHE_LEN} strokeDashoffset={ARCHE_LEN * (1 - interpolate(reveal, [0.45, 0.9], [0, 1], clampB))} />
      <path d="M308 337 Q960-28 1612 337" fill="none" stroke="#2a3f66" strokeWidth={24}
        strokeDasharray={ARCHE_LEN} strokeDashoffset={ARCHE_LEN * (1 - interpolate(reveal, [0.5, 1], [0, 1], clampB))} />
      <g transform="translate(960 177)" opacity={interpolate(reveal, [0.7, 1], [0, 1], clampB)}>
        <circle r={42} fill={BG} stroke="#91a0b8" strokeWidth={3} />
        <circle r={31} fill="none" stroke="#3a5488" strokeWidth={3} />
        <path d="M0-23 L6-8 L22-4 L10 6 L13 22 L0 13 L-13 22 L-10 6 L-22-4 L-6-8 Z" fill="none" stroke="#9ca9be" strokeWidth={2} />
      </g>
    </g>
  </>
);

// Longueurs de path approx (pour strokeDashoffset) — mesurées sur les contours rectangulaires/
// trapézoïdaux ci-dessous.
const PARCHEMIN_OUTER_LEN = 1970; // 611,374 -> 1309,374 -> 1486,902 -> 433,902 -> fermé
const PARCHEMIN_INNER_LEN = 1750;
const CACHET_R26_LEN = 163; // 2*PI*26
const CACHET_R18_LEN = 113;
const LIGNE1_LEN = 508, LIGNE2_LEN = 556, LIGNE3_LEN = 526;

const TableEtDocument: React.FC<{ reveal: number }> = ({ reveal }) => {
  const rise = interpolate(reveal, [0, 1], [40, 0], clampB);
  const op = interpolate(reveal, [0, 0.3], [0, 1], clampB);
  // Le document se DESSINE (contour du parchemin en premier), pas un simple fondu (retour Aziz
  // 2026-08-04 : "y a-t-il des parties où on pourrait rajouter du strokeDasharray [...] quand on voit
  // les documents qui se font signer"). Estrade/table restent en fondu (masse architecturale, pas un
  // tracé de contour narrativement significatif) ; le PARCHEMIN lui-même se trace.
  const outerProgress = interpolate(reveal, [0, 0.6], [0, 1], clampB);
  const innerProgress = interpolate(reveal, [0.25, 0.75], [0, 1], clampB);
  const cachetProgress = interpolate(reveal, [0.55, 0.85], [0, 1], clampB);
  const lignesProgress = interpolate(reveal, [0.7, 1], [0, 1], clampB);
  return (
    <g opacity={op} transform={`translate(0 ${rise})`}>
      <g id="estrade_protocolaire">
        <path d="M208 535 L1712 535 L1848 729 L72 729 Z" fill="#22375c" stroke="#7285a7" strokeWidth={3} />
        <path d="M72 729H1848V787H72Z" fill="#2a3f66" stroke="#91a0b8" strokeWidth={3} />
        <path d="M172 535 L78 729 M1748 535 L1842 729" fill="none" stroke="#3a5488" strokeWidth={3} />
      </g>
      <g id="table_de_signature">
        <path d="M281 460 L1639 460 L1826 1001 L94 1001 Z" fill="#202f50" stroke="#9ca9be" strokeWidth={4} />
        <path d="M281 460 L1639 460 L1686 596 L234 596 Z" fill="#2a3f66" stroke="#7285a7" strokeWidth={3} />
        <path d="M94 1001H1826L1806 1041H114Z" fill="#101d35" stroke="#3a5488" strokeWidth={3} />
      </g>
      <g id="traite_sur_parchemin">
        <path d="M611 374 L1309 374 L1486 902 L433 902 Z" fill="#d9deea" fillOpacity={interpolate(outerProgress, [0.5, 1], [0, 1], clampB)}
          stroke="#aeb8c9" strokeWidth={5} strokeDasharray={PARCHEMIN_OUTER_LEN} strokeDashoffset={PARCHEMIN_OUTER_LEN * (1 - outerProgress)} />
        <path d="M638 402 L1284 402 L1443 871 L477 871 Z" fill="#cbd2df" fillOpacity={interpolate(innerProgress, [0.5, 1], [0, 1], clampB)}
          stroke="#7285a7" strokeWidth={2} strokeDasharray={PARCHEMIN_INNER_LEN} strokeDashoffset={PARCHEMIN_INNER_LEN * (1 - innerProgress)} />
        <g transform="translate(960 488)" opacity={cachetProgress > 0 ? 1 : 0}>
          <circle r={26} fill="none" stroke="#7285a7" strokeWidth={2}
            strokeDasharray={CACHET_R26_LEN} strokeDashoffset={CACHET_R26_LEN * (1 - cachetProgress)} />
          <circle r={18} fill="none" stroke="#7285a7" strokeWidth={1.5}
            strokeDasharray={CACHET_R18_LEN} strokeDashoffset={CACHET_R18_LEN * (1 - interpolate(cachetProgress, [0.3, 1], [0, 1], clampB))} />
          <path d="M0-18 L5-6 L18 0 L5 6 L0 18 L-5 6 L-18 0 L-5-6 Z" fill="none" stroke="#7285a7" strokeWidth={1.4}
            opacity={interpolate(cachetProgress, [0.6, 1], [0, 1], clampB)} />
        </g>
        <g fill="none" stroke="#8493aa">
          <path d="M706 535H1214" strokeWidth={3} strokeDasharray={LIGNE1_LEN}
            strokeDashoffset={LIGNE1_LEN * (1 - interpolate(lignesProgress, [0, 0.4], [0, 1], clampB))} />
          <path d="M682 556H1238" strokeWidth={2} strokeDasharray={LIGNE2_LEN}
            strokeDashoffset={LIGNE2_LEN * (1 - interpolate(lignesProgress, [0.3, 0.7], [0, 1], clampB))} />
          <path d="M697 575H1223" strokeWidth={2} strokeDasharray={LIGNE3_LEN}
            strokeDashoffset={LIGNE3_LEN * (1 - interpolate(lignesProgress, [0.6, 1], [0, 1], clampB))} />
        </g>
      </g>
    </g>
  );
};

const Sceau: React.FC<{ reveal: number }> = ({ reveal }) => {
  if (reveal <= 0) return null;
  const scale = interpolate(reveal, [0, 0.4], [0.3, 1], { ...clampB, easing: (t) => 1 - (1 - t) ** 3 });
  const op = interpolate(reveal, [0, 0.25], [0, 1], clampB);
  return (
    <g opacity={op}>
      <g transform={`translate(976 832) scale(${scale})`}>
        <path d="M-16-56 C2-73 21-63 31-49 C52-54 68-38 64-17 C81-3 73 20 55 28 C55 49-49 62 16 53
                 C2 70-22 67-32 48 C-53 53-69 36-65 15 C-82 1-74-22-56-30 C-56-44-40-58-16-56Z"
          fill={GOLD} stroke="#182746" strokeWidth={5} />
        <circle r={48} fill="none" stroke="#182746" strokeWidth={4} />
        <circle r={36} fill="none" stroke="#9b741d" strokeWidth={2} />
      </g>
    </g>
  );
};

// ===== TEMPS A — Freetown (22s/660f) : décor se met en place, bannières grises, hold =====
// V2 (2026-08-04, retour Aziz + GPT) :
//  - Bannières synchronisées EXACTEMENT sur "quinze chefs d'État" (96.5s narration absolue = 2.2s /
//    66f dans ce segment qui démarre à 94.3s, forced-align réel, pas une estimation).
//  - Hiérarchie temporelle décor→États→document (retour GPT : "les éléments ont encore un peu trop
//    la même importance temporelle") : colonnes/arche se tracent EN PREMIER (0-1.8s), PUIS bannières
//    (dès 2.2s, synchro texte), PUIS document qui arrive en DERNIER comme point focal (après les
//    bannières, pas en parallèle).
export const GazoducActe2SignatureFreetown: React.FC = () => {
  const frame = useCurrentFrame();
  const decorReveal = interpolate(frame, [0, S(1.8)], [0, 1], clampB);
  const BANNIERE_SYNC_START = 66; // "quinze chefs d'État" = 96.5s narration, forced-align réel
  const banniereGlobalReveal = interpolate(frame, [BANNIERE_SYNC_START, BANNIERE_SYNC_START + S(7)], [0, 1], clampB);
  const tableReveal = interpolate(frame, [BANNIERE_SYNC_START + S(8), S(20)], [0, 1], clampB);
  const globalFade = interpolate(frame, [0, S(0.5), S(21), S(22)], [0, 1, 1, 0], clampB);

  return (
    <AbsoluteFill style={{ opacity: globalFade }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <DecorStatique reveal={decorReveal} />
        {COUNTRIES.map((c, i) => {
          const [x, y, scale] = interpArcPos(i);
          const dropIn = interpolate(frame, [BANNIERE_SYNC_START + i * 4, BANNIERE_SYNC_START + i * 4 + 20], [0, 1], clampB);
          return <Banniere key={c.name} x={x} y={y} scale={scale} colors={c.colors} colorProgress={0} dropIn={dropIn * banniereGlobalReveal} />;
        })}
        <TableEtDocument reveal={tableReveal} />
      </svg>
    </AbsoluteFill>
  );
};

// ===== TEMPS B — Flashback 2016 (33.06s/992f) : bannières se colorient + la plume ECRIT chaque
// signature en se deplacant (retour Aziz 2026-08-04 : "le stylo qui écrit" plutôt que des traits qui
// se dessinent seuls) =====
// Timing d'accumulation à ÉNERGIE CROISSANTE (retour GPT 2026-08-04 : "les premières bannières
// prennent leur couleur individuellement, puis les suivantes arrivent progressivement plus vite —
// un pays rejoint → puis un autre → puis le projet prend de l'ampleur"). Espacement décroissant
// (ease-in quadratique inversé) au lieu d'un espacement uniforme — 1er pays le plus posé, dernier
// le plus rapide.
const ACCUMULATION_TOTAL = S(21); // les 12 pays s'accumulent sur 21s (au lieu de 24s uniforme)
function countryStartTime(i: number, n = 12): number {
  const t = i / n; // 0..~0.92
  const eased = 1 - (1 - t) ** 1.8; // accélère vers la fin
  return eased * ACCUMULATION_TOTAL;
}

export const GazoducActe2SignatureFlashback: React.FC = () => {
  const frame = useCurrentFrame();
  // Fondu de sortie avancé (hold sceau réduit de ~8s à ~3s — retour Aziz 2026-08-04 : "hold un peu
  // long/statique" repéré au montage final v1) + marge de sécurité audio en toute fin.
  const globalFade = interpolate(frame, [0, S(0.5), S(27.5), S(33.06) + AUDIO_SAFETY_MARGIN_F], [0, 1, 1, 0], clampB);

  const writeDuration = S(0.6); // durée du geste d'écriture par signature
  const lastCountryStart = countryStartTime(COUNTRIES.length - 1);
  const RESPIRATION_END = lastCountryStart + writeDuration + S(1.4); // petite pause avant le sceau (retour GPT)
  const SCEAU_START = RESPIRATION_END + S(0.3);
  const SCEAU_END = SCEAU_START + S(1.5);

  // Position de la pointe du stylo pour le pays i, a l'instant "reveal" (0..1) de son ecriture.
  function nibPos(i: number, localReveal: number): [number, number] {
    const col = i % 4, row = Math.floor(i / 4);
    const cx = SIG_COLS_X[col], cy = SIG_ROWS_Y[row];
    return [cx - SIG_WIDTH / 2 + SIG_WIDTH * localReveal, cy + 6];
  }

  // Trouve l'index de la signature "active" (en cours d'ecriture ou dernier ecrit) pour placer la plume.
  let plumeNibX = 0, plumeNibY = 0, plumeOpacity = 0;
  for (let i = 0; i < COUNTRIES.length; i++) {
    const t0 = countryStartTime(i);
    const t1 = t0 + writeDuration;
    if (frame < t0) break;
    const localReveal = interpolate(frame, [t0, t1], [0, 1], clampB);
    const [nx, ny] = nibPos(i, localReveal);
    plumeNibX = nx; plumeNibY = ny;
    plumeOpacity = 1;
  }
  // Transition douce entre 2 signatures (la plume glisse, pas de saut sec) : interpole vers la
  // position de depart de la signature suivante pendant le court intervalle entre 2 ecritures.
  for (let i = 0; i < COUNTRIES.length - 1; i++) {
    const tEndCur = countryStartTime(i) + writeDuration;
    const tStartNext = countryStartTime(i + 1);
    if (frame >= tEndCur && frame < tStartNext) {
      const [, endY] = nibPos(i, 1);
      const [startX, startY] = nibPos(i + 1, 0);
      const [endX] = nibPos(i, 1);
      const p = interpolate(frame, [tEndCur, tStartNext], [0, 1], clampB);
      plumeNibX = endX + (startX - endX) * p;
      plumeNibY = endY + (startY - endY) * p;
    }
  }
  const plumeFadeOut = interpolate(frame, [RESPIRATION_END - S(0.5), RESPIRATION_END], [1, 0], clampB);

  return (
    <AbsoluteFill style={{ opacity: globalFade }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <DecorStatique reveal={1} />
        {COUNTRIES.map((c, i) => {
          const [x, y, scale] = interpArcPos(i);
          const t0 = countryStartTime(i);
          const colorProgress = interpolate(frame, [t0, t0 + S(0.6)], [0, 1], clampB);
          return <Banniere key={c.name} x={x} y={y} scale={scale} colors={c.colors} colorProgress={colorProgress} dropIn={1} />;
        })}
        <TableEtDocument reveal={1} />
        {COUNTRIES.map((c, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const t0 = countryStartTime(i);
          const reveal = interpolate(frame, [t0, t0 + writeDuration], [0, 1], clampB);
          return <Signature key={c.name} x={SIG_COLS_X[col]} y={SIG_ROWS_Y[row]} reveal={reveal} />;
        })}
        {plumeOpacity > 0 && (
          <PlumeMobile nibX={plumeNibX} nibY={plumeNibY} opacity={plumeOpacity * plumeFadeOut} />
        )}
        <Sceau reveal={interpolate(frame, [SCEAU_START, SCEAU_END], [0, 1], clampB)} />
      </svg>
    </AbsoluteFill>
  );
};

export default GazoducActe2SignatureFlashback;
