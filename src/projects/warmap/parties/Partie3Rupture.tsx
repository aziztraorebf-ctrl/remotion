// PARTIE 3 — LA RUPTURE ET L'ÉPREUVE — VERSION NARRATIVE (grammaire causale, 2026-06-12).
//
// MODÈLE = Partie2Blocage.tsx (P2 validée Aziz). Plan : PLAN-NARRATIF-P3.md. DA-brief upstream
// (Gemini+Kimi+DeepSeek) intégré. Scan templates : SahelAttackArrow + TerritorialExpansion réutilisés.
//
// IDÉE STRUCTURANTE — INVERSION CHROMATIQUE (décision Aziz) :
//   En P2, l'avancée des jetons = ROUGE (les jihadistes prennent). En P3, l'avancée principale = BLEU MALI
//   (l'ÉTAT REPREND Kidal). Le rouge ne revient qu'en Ph9 (attaques 2026), mais REFOULÉ — il ne tient pas.
//   Cette inversion raconte "la rupture" : pour une fois, l'ordre étatique gagne du terrain.
//
// GRAMMAIRE (cause précède effet) :
//   - Ph1 : les flèches CEDEAO (héritées P2) se BRISENT/reculent → cause : l'union AES. Les 3 pays virent OR.
//   - Ph2 : la zone Liptako-Gourma PULSE OR = l'union se VOIT géographiquement. Figée 2s (naissance AES).
//   - Ph4 : "Kidal." seul, onde de choc + label tracé. Emphase chirurgicale (Kidal plein, tour épuré).
//   - Ph5 : jetons touaregs POSÉS (statu quo gelé), ONU présente mais passive.
//   - Ph6 : ONU se retire (points s'effacent) → FAMa AVANCENT (SahelAttackArrow) → Africa Corps en appui.
//   - Ph7 : touaregs reculent, Kidal vire BLEU (TerritorialExpansion), drapeau malien hissé. Figé 2s.
//   - Ph8 : Moura — flashback DATÉ mars 2022, DÉSATURATION globale + timeline qui recule. Très sobre.
//   - Ph9 : attaques 2026 (rouges qui pulsent, SANS sillage) REFOULÉES par halo bleu des capitales.
//
// Couche PURE par-dessus la carte (pattern <PartieX>). Reçoit SahelRenderContext + l'instance map (pour
// SahelAttackArrow/TerritorialExpansion qui projettent via map.project()). Ne possède PAS la map.

import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useVideoConfig, Easing } from "remotion";
import type mapboxgl from "mapbox-gl";
import type { SahelRenderContext } from "../engine/SahelContext";
import {
  PAL, spriteMapWidth, interpWaypoints, countryOutline, lerpHex, type Waypoint,
} from "./warmapPremiumKit";
import { MALI_RING, NIGER_RING, BURKINA_RING } from "./sahelCountries";
import { WarMapPlaque } from "./WarMapPlaque";
import { SahelAttackArrow } from "../_shared/SahelAttackArrow";
import { TerritorialExpansion, type ExpansionRegion } from "../_shared/TerritorialExpansion";
import { LiptakoRevealSVG } from "./LiptakoRevealSVG";

// ============================================================
// TRIGGERS V5 P3 (alignment narration-v5, ×30fps — VÉRIFIÉS contre narration-v5-alignment.json 2026-06-12)
// ============================================================
const F_BAMAKO = 6118;     // "Bamako" — Ph1 union AES, CEDEAO se brise
const F_OUAGA = 6138;      // "Ouagadougou"
const F_LIPTAKO = 6616;    // "Liptako-Gourma" — Ph2 naissance AES (figée 2s)
const F_EPREUVE = 6800;    // "mis à l'épreuve" — Ph3 transition zoom Kidal (approx)
const F_KIDAL = 7083;      // "Kidal." — Ph4 (figée 1s, silence)
const F_TOUAREGS = 7319;   // "touaregs" — Ph5 statu quo 2012
const F_RETIRE = 7673;     // "retire" — Ph6 ONU se retire
const F_AFRICA = 7794;     // "Africa" Corps — Ph6 offensive FAMa
const F_FLOTTE = 8132;     // "flotte" — Ph7 reprise Kidal (figée 2s)
const F_MOURA = 8580;      // "Moura" — Ph8 flashback mars 2022
const F_REPOUSSE = 9121;   // "repousse" — Ph9 attaques 2026 refoulées
const F_CONSERVER = 9372;  // "conserver en est une autre" — fin de la phrase-morale = FIN P3
const F_END = 9410;        // fin P3 : ~1.3s après la morale pour la laisser résonner, puis coupe. PAS de
                           // débordement dans la P4 (réfugiés f9366+ = compo P4 séparée). Décision Aziz 2026-06-12.

// ============================================================
// COORDONNÉES (lon, lat)
// ============================================================
const BAMAKO: [number, number] = [-8.00, 12.65];
const OUAGA: [number, number] = [-1.52, 12.37];
const NIAMEY: [number, number] = [2.12, 13.51];
const LIPTAKO_CENTER: [number, number] = [0.60, 14.40];   // triangle frontalier Mali-BF-Niger
const KIDAL: [number, number] = [1.44, 18.43];
const GAO: [number, number] = [-0.04, 16.27];
const MENAKA: [number, number] = [2.40, 15.92];
const MOURA: [number, number] = [-3.95, 14.92];           // centre Mali (région de Mopti)

// Capitales AES (Ph1 : s'allument + lien or ; Ph9 : halo de protection bleu)
const AES_CAPITALS: { id: string; name: string; coord: [number, number]; at: number }[] = [
  { id: "bamako", name: "BAMAKO", coord: BAMAKO, at: F_BAMAKO },
  { id: "ouaga", name: "OUAGADOUGOU", coord: OUAGA, at: F_OUAGA },
  { id: "niamey", name: "NIAMEY", coord: NIAMEY, at: F_OUAGA + 24 },
];

// CEDEAO (héritée P2) : pays côtiers dont les flèches de menace vont se BRISER vers Niamey.
const CEDEAO_RING: [number, number][] = [
  [-4.00, 9.50], [-1.20, 7.95], [2.30, 9.30], [8.10, 9.10],  // CI, Ghana, Bénin, Nigeria
];

// ONU / MINUSMA autour de Kidal (Ph5 présents passifs → Ph6 se retirent un par un).
// ONU/MINUSMA — JETONS casque bleu disposés en ANNEAU autour de la ville Kidal (pas SUR elle). Impuissants
// (rendu : marqueur "observation" + pas d'action). Au retrait : reculent (translation Y) + s'estompent, AVANT
// l'offensive FAMa (départ anticipé pendant que la voix l'annonce). Espacés pour ne pas se chevaucher.
type Base = { id: string; name: string; coord: [number, number]; appearAt: number; outAt: number };
// 2 BASES MINUSMA (sprites campements ONU top-down, Aziz 2026-06-13) posées près de Kidal. Badge "interdiction
// de tirer" = mandat non-combattant. Au retrait (Ph6) : la base FADE simplement sur place (un bâtiment ne se
// déplace pas — le poste est démantelé/abandonné). Espacées hors footprint ville.
// Espacées LOIN des jetons touaregs (Aziz 2026-06-13 : avant, les bases tombaient sur les jetons → illisible).
// Touaregs au statu quo : SE [2.35,17.95] + NO [0.65,19.10]. Donc bases ONU placées au NORD (Tessalit/Aguelhok,
// vrais sites MINUSMA) + une à l'OUEST franc, à l'écart des jetons.
const MINUSMA_KIDAL: Base[] = [
  { id: "un-tessalit", name: "", coord: [1.01, 20.20], appearAt: F_TOUAREGS, outAt: F_RETIRE + 50 },   // N (Tessalit), loin des touaregs
  { id: "un-ouest", name: "", coord: [-0.70, 18.40], appearAt: F_TOUAREGS + 16, outAt: F_RETIRE + 30 }, // O franc, à l'écart
];

// Africa Corps (ex-Wagner) — base/fortin gris EN APPUI (décision Aziz : pas un jeton acteur principal).
const AFRICACORPS_BASE: Base = { id: "africacorps", name: "AFRICA CORPS", coord: [-0.20, 16.55], appearAt: F_AFRICA, outAt: F_END };

// Jetons touaregs (Ph5 POSÉS en anneau autour de Kidal, BIEN ESPACÉS, hors footprint ville ; ils tiennent ;
// Ph6-7 RECULENT loin vers le nord/NE = dispersion marquée).
type Jeton = { id: string; appear: number; disappear: number; wp: Waypoint[] };
const TOUAREG_JETONS: Jeton[] = [
  // SE de Kidal → recule loin au NE (dispersion poussée, Aziz : "aller encore plus loin")
  { id: "t1", appear: F_TOUAREGS, disappear: F_FLOTTE + 60, wp: [
    { f: F_TOUAREGS, lon: 2.35, lat: 17.95 }, { f: F_AFRICA, lon: 2.35, lat: 17.95 },
    { f: F_FLOTTE, lon: 3.40, lat: 19.40 }, { f: F_FLOTTE + 60, lon: 4.40, lat: 20.30 },
  ] },
  // NO de Kidal → recule loin au N (dispersion)
  { id: "t2", appear: F_TOUAREGS + 12, disappear: F_FLOTTE + 60, wp: [
    { f: F_TOUAREGS, lon: 0.65, lat: 19.10 }, { f: F_AFRICA, lon: 0.65, lat: 19.10 },
    { f: F_FLOTTE, lon: 0.20, lat: 20.40 }, { f: F_FLOTTE + 60, lon: -0.40, lat: 21.20 },
  ] },
];

// Jetons offensive (Ph6 AVANCENT vers Kidal). RACCORD CAUSAL : démarrent PENDANT le retrait ONU. DUO FAMa
// (bleu) + Africa Corps mercenaire (gris). EN TENAILLE (Aziz 2026-06-12) : ils ne s'empilent PAS au centre,
// ils se positionnent à 3 EXTRÉMITÉS de la région Kidal (ouest, sud, est) = ils TIENNENT/encerclent le territoire.
const F_FAMA_START = 7720;
type OffJeton = Jeton & { faction: "fama" | "africacorps" };
const FAMA_JETONS: OffJeton[] = [
  // FAMa #1 → tient le FLANC OUEST de Kidal
  { id: "f1", faction: "fama", appear: F_FAMA_START, disappear: F_MOURA - 40, wp: [
    { f: F_FAMA_START, lon: GAO[0], lat: GAO[1] }, { f: F_FAMA_START + 160, lon: 0.70, lat: 17.60 },
    { f: F_FLOTTE - 20, lon: 0.75, lat: 18.45 }, { f: F_FLOTTE, lon: 0.78, lat: 18.55 },
  ] },
  // FAMa #2 → tient le FLANC SUD de Kidal
  { id: "f2", faction: "fama", appear: F_FAMA_START + 20, disappear: F_MOURA - 40, wp: [
    { f: F_FAMA_START + 20, lon: MENAKA[0], lat: MENAKA[1] }, { f: F_FAMA_START + 170, lon: 1.60, lat: 17.30 },
    { f: F_FLOTTE - 20, lon: 1.50, lat: 17.65 }, { f: F_FLOTTE, lon: 1.48, lat: 17.55 },
  ] },
  // Africa Corps → tient le FLANC EST de Kidal (encerclement complet de la région)
  { id: "ac1", faction: "africacorps", appear: F_FAMA_START + 40, disappear: F_MOURA - 40, wp: [
    { f: F_FAMA_START + 40, lon: 0.10, lat: 16.55 }, { f: F_FAMA_START + 180, lon: 1.80, lat: 17.70 },
    { f: F_FLOTTE - 20, lon: 2.30, lat: 18.55 }, { f: F_FLOTTE, lon: 2.40, lat: 18.65 },
  ] },
];

// Attaques 2026 (Ph9) — REFONTE Aziz 2026-06-12 : 100% DÉMONSTRATION PAR JETONS PHYSIQUES (pas de flèches,
// pas de plaque). Un jeton jihadiste (rouge) CHARGE vite vers une capitale → un jeton FAMa (bleu) lui BLOQUE
// PHYSIQUEMENT la route (posté entre l'attaquant et la capitale) → au contact, le jihadiste est REPOUSSÉ
// (recule vers son origine + fade) tandis que le FAMa tient. La cause (charge) et l'effet (blocage+recul) se
// VOIENT, sans abstraction. `block` = point où l'attaquant est stoppé (court de la capitale). `defend` = poste FAMa.
type Attack = {
  id: string; faction: "jnim" | "eigs"; appear: number; clashAt: number; disappear: number;
  from: [number, number]; block: [number, number]; defend: [number, number];
};
// 2 affrontements DANS le cadre resserré (Ouaga + Niamey). La cam est centrée ~[0.5,13.6] z5.85, donc on cadre
// le corridor Ouaga(SO)→Niamey(E). Bamako (extrême ouest) hors-cadre = on n'y met pas d'attaque (lisibilité).
const ATTACKS_2026: Attack[] = [
  // charge vers Ouaga (depuis le N) — bloquée au nord de la capitale
  { id: "atk1", faction: "jnim", appear: F_REPOUSSE, clashAt: F_REPOUSSE + 48, disappear: F_REPOUSSE + 145,
    from: [-1.10, 14.60], block: [-1.35, 13.30], defend: [-1.52, 12.85] },
  // charge vers Niamey (depuis le NE)
  { id: "atk2", faction: "eigs", appear: F_REPOUSSE + 26, clashAt: F_REPOUSSE + 74, disappear: F_REPOUSSE + 158,
    from: [3.00, 14.70], block: [2.45, 13.95], defend: [2.12, 13.55] },
];

// Région de Kidal (pour le remplissage BLEU à la reprise via TerritorialExpansion geoPolygon).
// Petit polygone autour de Kidal (approximatif, suffisant pour le blob bleu de reconquête).
const KIDAL_REGION: [number, number][] = [
  [0.40, 17.40], [2.60, 17.30], [3.20, 18.60], [2.40, 20.00], [0.90, 20.20], [0.10, 19.00],
];

const JETON_DEG = 1.4;
const JETON_BOUNDS = { min: 64, max: 150 };
const BASE_DEG = 3.0, MINUSMA_DEG = 2.4;
const SPRITE_BOUNDS = { min: 120, max: 320 };
const BASE_RATIO = 0.56, MINUSMA_RATIO = 0.55;
const OR_AES = "#C9A24B";    // or chaud AES (décision Aziz). Mat, pas glossy.
const BLUE_MALI = "#2B4F7C"; // bleu Mali DÉSATURÉ (anti AI-slop chromatique, DA-brief C). Fill 40-60% jamais 100%.
const RED_MOURA = "#6B1A1A"; // rouge bordeaux sourd (gravité Moura, DA-brief C/Q2)

type Props = { ctx: SahelRenderContext | null; map: mapboxgl.Map | null };

export const Partie3Rupture: React.FC<Props> = ({ ctx, map }) => {
  const { fps } = useVideoConfig();
  if (!ctx) return null;
  const { frame, width, height, project } = ctx;
  const vmin = Math.min(width, height);

  const minusmaSprite = staticFile("_shared/sprites/warmap/base-minusma-td.png");
  const africacorpsSprite = staticFile("_shared/sprites/warmap/base-africacorps.png");
  const kidalTownSprite = staticFile("_shared/sprites/warmap/ville-kidal.png");

  // ── Positions courantes des jetons actifs ──
  const activeTouaregs = TOUAREG_JETONS.filter((j) => frame >= j.appear && frame <= j.disappear)
    .map((j) => { const [lon, lat] = interpWaypoints(j.wp, frame); return { j, lon, lat, p: project(lon, lat) }; });
  const activeFama = FAMA_JETONS.filter((j) => frame >= j.appear && frame <= j.disappear)
    .map((j) => { const [lon, lat] = interpWaypoints(j.wp, frame); return { j, lon, lat, p: project(lon, lat) }; });

  // ── Attaques 2026 (Ph9) : JETONS PHYSIQUES. L'attaquant CHARGE (appear→clashAt, ease-out, vite) jusqu'au
  //    point de blocage (court de la capitale) → CLASH avec le FAMa posté → RECULE (clashAt→disappear, ease-in,
  //    retour vers l'origine + fade). Le FAMa défenseur reste fixe à son poste. Démonstration par la vision. ──
  const activeAttacks = ATTACKS_2026.filter((a) => frame >= a.appear && frame <= a.disappear).map((a) => {
    let lon: number, lat: number, op: number;
    const clashT = interpolate(frame, [a.clashAt - 6, a.clashAt + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    if (frame <= a.clashAt) {
      const t = interpolate(frame, [a.appear, a.clashAt], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
      lon = a.from[0] + (a.block[0] - a.from[0]) * t;
      lat = a.from[1] + (a.block[1] - a.from[1]) * t;
      op = interpolate(frame, [a.appear, a.appear + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    } else {
      const t = interpolate(frame, [a.clashAt, a.disappear], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
      lon = a.block[0] + (a.from[0] - a.block[0]) * t;
      lat = a.block[1] + (a.from[1] - a.block[1]) * t;
      op = interpolate(frame, [a.disappear - 30, a.disappear], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    }
    // le FAMa défenseur apparaît avant l'arrivée de l'attaquant (il TIENT déjà le poste), reste tout du long
    const defOp = interpolate(frame, [a.appear - 10, a.appear + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { a, lon, lat, p: project(lon, lat), op, clashT, defP: project(a.defend[0], a.defend[1]), defOp };
  });

  // ── SILLAGE BLEU (Ph6-7) : le territoire repris se révèle DERRIÈRE les FAMa (même mask wet-ink que P2,
  //    en BLEU). Inversion chromatique : l'avancée colore en bleu = l'État reprend. ──
  const sillageStamps: { x: number; y: number; r: number }[] = [];
  const sillageBlueOp = interpolate(frame, [F_AFRICA, F_AFRICA + 20, F_FLOTTE + 40, F_FLOTTE + 90], [0, 1, 1, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (sillageBlueOp > 0.01) {
    for (const j of FAMA_JETONS) {
      if (frame < j.appear) continue;
      const until = Math.min(frame, j.disappear);
      for (let f = j.appear; f <= until; f += 12) {
        const [lon, lat] = interpWaypoints(j.wp, f);
        const pt = project(lon, lat);
        const age = frame - f;
        const r = spriteMapWidth(project, lon, lat, 1.6, { min: 28, max: 90 })
          * interpolate(age, [0, 45], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        sillageStamps.push({ x: pt.x, y: pt.y, r });
      }
    }
  }

  // ── Ph1 : flèches CEDEAO qui VIBRENT puis se BRISENT/reculent (DA : pas un fade mou) ──
  // progress de la menace : 1 (héritée P2) → 0 (brisée par l'union AES)
  const cedeaoBreak = interpolate(frame, [F_BAMAKO, F_BAMAKO + 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const cedeaoShake = frame >= F_BAMAKO && frame < F_BAMAKO + 30 ? 2.5 * Math.sin(frame * 0.9) : 0;

  // ── Ph1 : lien OR entre les 3 capitales (le pacte) ──
  // ── Ph1 : les 3 contours AES virent OR ──
  const aesGold = interpolate(frame, [F_BAMAKO + 20, F_LIPTAKO], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Ph2 : CONVERGENCE CAUSALE (DA-brief Gemini+Kimi) — 3 lignes or se DESSINENT depuis les capitales vers
  //    le centre Liptako (la CAUSE : les 3 pays s'unissent), PUIS le sceau d'union apparaît au point de
  //    rencontre (l'EFFET). Remplace le simple cercle qui poppait. Grammaire causale respectée. ──
  //    converge : 0→1 = les lignes se tracent (F_LIPTAKO-34 → F_LIPTAKO+6). Le sceau suit (déclenché à 1).
  const F_CONVERGE = F_LIPTAKO - 34;
  const converge = interpolate(frame, [F_CONVERGE, F_LIPTAKO + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  // ── Ph2 : SCEAU/zone Liptako OR (l'union se voit) — apparaît APRÈS la convergence, pulse, puis S'ESTOMPE
  //    quand on transite vers Kidal (Ph3). La carte se nettoie pour le focus Kidal. ──
  const liptakoT = interpolate(frame, [F_LIPTAKO + 2, F_LIPTAKO + 26, F_EPREUVE - 30, F_EPREUVE], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const liptakoPulse = liptakoT > 0 ? 1 + 0.10 * Math.sin((frame - F_LIPTAKO) * 0.12) : 0;
  // flash d'union au moment exact où les 3 lignes se rejoignent (climax causal bref)
  const unionFlash = interpolate(frame, [F_LIPTAKO, F_LIPTAKO + 4, F_LIPTAKO + 18], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Ph4 : onde de choc "Kidal." (cercles concentriques) + assombrissement radial ──
  const kidalP = project(KIDAL[0], KIDAL[1]);
  const kidalShock = interpolate(frame, [F_KIDAL, F_KIDAL + 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kidalHalo = frame >= F_KIDAL ? 0.5 + 0.5 * Math.sin((frame - F_KIDAL) * 0.10) : 0;
  // assombrissement radial centré Kidal (Ph3-4 : tout s'épure sauf Kidal). S'estompe à l'offensive.

  // ── Ph6 : offensive FAMa (SahelAttackArrow) progress + retrait ONU ──
  const famaArrowP = interpolate(frame, [F_AFRICA, F_FLOTTE - 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // ── Ph8 : Moura — flashback mars 2022. Carte en ÉTAT ALTÉRÉ : fondu SÉPIA (pas noir, charte parchemin),
  //    retour sépia inverse au sortir (DA-brief A). Point grave ABSTRAIT, halo STATIQUE non pulsé (Q2). ──
  //    (défini AVANT kidalBlueT car celui-ci s'atténue pendant Moura.)
  const mouraDesat = interpolate(frame, [F_MOURA - 10, F_MOURA + 20, F_REPOUSSE - 60, F_REPOUSSE - 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mouraP = project(MOURA[0], MOURA[1]);

  // ── Ph7 : Kidal vire BLEU (remplissage causal, APRÈS l'arrivée des FAMa — délai cognitif DA) ──
  // Pendant Moura (flashback), le calque Kidal-bleu est mis "en pause" à ~20% (DA-brief A : souvenir figé).
  const kidalBlueT = interpolate(frame, [F_FLOTTE, F_FLOTTE + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - 0.8 * mouraDesat);
  // drapeau malien hissé (révélé bas→haut) au mot "flotte". L'ondulation = le clip qui bouge (kidalFlagPath).
  const flagRise = interpolate(frame, [F_FLOTTE + 8, F_FLOTTE + 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // ── Ph9 : halo de protection BLEU depuis capitales (éteint les rouges) ──
  const protectT = interpolate(frame, [F_REPOUSSE + 30, F_REPOUSSE + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Ph5 — DRAPEAU TOUAREG (Azawad) qui ONDULE sur Kidal : "ils tiennent le terrain" pendant le statu quo.
  //    Ambient (boucle d'ondulation tant que la condition dure, R-OBJ doctrine). Apparaît après que la ville
  //    et les jetons soient posés (F_TOUAREGS + délai), DISPARAÎT à la reprise (le drapeau malien le remplace
  //    en Ph7). Ancré à la ville Kidal (clip SVG ondulant = même technique que le drapeau malien Ph7). ──
  const tuaregFlagIn = interpolate(frame, [F_TOUAREGS + 30, F_TOUAREGS + 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // sort quand les FAMa arrivent (la prise approche) — il s'abaisse AVANT que le drapeau malien monte (Ph7)
  const tuaregFlagOut = interpolate(frame, [F_FAMA_START + 120, F_FLOTTE - 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tuaregFlagOp = tuaregFlagIn * tuaregFlagOut;

  // ── helper rendu sprite-lieu ancré carte (ONU + Africa Corps) ──
  const renderBase = (b: Base, src: string, deg: number, ratio: number, fadeOut: boolean) => {
    if (frame < b.appearAt) return null;
    const p = project(b.coord[0], b.coord[1]);
    const ap = spring({ frame: frame - b.appearAt, fps, config: { damping: 14 }, durationInFrames: 18 });
    if (ap <= 0.02) return null;
    // ONU se RETIRE (Ph6) = fade + translation Y vers le haut (un "départ", pas un cut sec — DA-brief B).
    // Africa Corps reste.
    const out = fadeOut ? interpolate(frame, [b.outAt - 30, b.outAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
    const driftY = fadeOut ? (1 - out) * -12 : 0; // monte de 12px en s'effaçant
    const op = ap * out;
    if (op <= 0.02) return null;
    const w = spriteMapWidth(project, b.coord[0], b.coord[1], deg, SPRITE_BOUNDS) * ap;
    const h = w * ratio;
    return (
      <img key={b.id} src={src}
        style={{ position: "absolute", left: p.x - w / 2, top: p.y - h * 0.62 + driftY, width: w, height: h, opacity: op,
          filter: `drop-shadow(0 3px 7px rgba(40,30,20,0.32))`, pointerEvents: "none" }} />
    );
  };

  // ── helper JETON CIRCULAIRE (touaregs / FAMa) — modèle chip() P2 ──
  // badge = pictogramme de faction discret (vocabulaire état-major, reco K&G via review premium) : dit ce que
  // le jeton REPRÉSENTE d'un coup d'œil. "mil" = force militaire régulière (chevrons), "merc" = mercenaire
  // (losange/croix), "armed" = groupe armé (étoile sobre). Petit, coin bas-droit, pastille parchemin.
  const factionBadge = (kind: "mil" | "merc" | "armed", D: number, accent: string) => {
    const s = Math.max(11, D * 0.30);
    let icon: React.ReactNode;
    if (kind === "mil") icon = ( // chevrons (grade militaire)
      <g stroke={accent} strokeWidth={s * 0.11} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={`${s*0.28},${s*0.46} ${s*0.5},${s*0.34} ${s*0.72},${s*0.46}`} />
        <polyline points={`${s*0.28},${s*0.62} ${s*0.5},${s*0.5} ${s*0.72},${s*0.62}`} />
      </g>);
    else if (kind === "merc") icon = ( // losange barré (paramilitaire/mercenaire)
      <g stroke={accent} strokeWidth={s * 0.1} fill="none" strokeLinejoin="round">
        <polygon points={`${s*0.5},${s*0.26} ${s*0.72},${s*0.5} ${s*0.5},${s*0.74} ${s*0.28},${s*0.5}`} />
      </g>);
    else icon = ( // étoile sobre (groupe armé)
      <g stroke={accent} strokeWidth={s * 0.1} fill="none" strokeLinejoin="round">
        <polygon points={`${s*0.5},${s*0.26} ${s*0.57},${s*0.45} ${s*0.74},${s*0.45} ${s*0.6},${s*0.57} ${s*0.66},${s*0.74} ${s*0.5},${s*0.62} ${s*0.34},${s*0.74} ${s*0.4},${s*0.57} ${s*0.26},${s*0.45} ${s*0.43},${s*0.45}`} />
      </g>);
    return (
      <div style={{ position: "absolute", right: -s * 0.18, bottom: -s * 0.18, width: s, height: s,
        borderRadius: "50%", background: "#F5EFD6", border: `${Math.max(1.5, s * 0.08)}px solid ${accent}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>{icon}</svg>
      </div>
    );
  };

  const chip = (o: { key: string; x: number; y: number; D: number; op: number; border: string; sprite: string; seed: number; badge?: "mil" | "merc" | "armed" }) => {
    if (o.op <= 0.02 || o.D <= 1) return null;
    const breathe = 1 + 0.05 * Math.sin((frame + o.seed) * 0.08);
    return (
      <div key={o.key} style={{ position: "absolute", left: o.x, top: o.y,
        transform: `translate(-50%,-50%) scale(${breathe})`, opacity: o.op, pointerEvents: "none" }}>
        {/* ombre portée au sol (ancrage, anti-buste-flottant) */}
        <div style={{ position: "absolute", left: "50%", top: "74%", width: o.D * 0.86, height: o.D * 0.28,
          transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.45)", borderRadius: "50%", filter: "blur(6px)" }} />
        <div style={{ position: "relative", width: o.D, height: o.D }}>
          <div style={{ width: o.D, height: o.D, borderRadius: "50%", overflow: "hidden",
            background: "#F5EFD6", border: `${Math.max(2.5, o.D * 0.06)}px solid ${o.border}`,
            boxShadow: "0 4px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
            <img src={staticFile(`_shared/sprites/warmap/${o.sprite}.png`)}
              style={{ width: "118%", height: "118%", objectFit: "cover", objectPosition: "top center",
                transform: "translate(-8%, 2%)", display: "block" }} />
          </div>
          {o.badge && factionBadge(o.badge, o.D, o.border)}
        </div>
      </div>
    );
  };

  // contour Kidal projeté (pour le drapeau clippé)
  const kidalRegionPx = KIDAL_REGION.map(([lon, lat]) => project(lon, lat));
  const kidalRegionPath = kidalRegionPx.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("") + "Z";
  const kidalBounds = kidalRegionPx.reduce((a, p) => ({ minX: Math.min(a.minX, p.x), maxX: Math.max(a.maxX, p.x), minY: Math.min(a.minY, p.y), maxY: Math.max(a.maxY, p.y) }), { minX: 1e9, maxX: -1e9, minY: 1e9, maxY: -1e9 });
  // clip ONDULANT pour le drapeau (le geste "flotte") : chaque sommet oscille en x d'une amplitude feutrée,
  // déphasée par index → bord du drapeau qui ondule lentement. Continue pendant le figé 2s.
  const wave = (i: number) => kidalBlueT > 0.01 ? Math.sin(frame * 0.10 + i * 1.3) * (vmin * 0.006) : 0;
  const kidalFlagPath = kidalRegionPx.map((p, i) => `${i === 0 ? "M" : "L"}${(p.x + wave(i)).toFixed(1)},${(p.y + wave(i + 2) * 0.5).toFixed(1)}`).join("") + "Z";

  // FLASH OR à la prise de Kidal (climax, review premium) : bref éclat doré plein écran au "flotte" (3-4 frames)
  // = marque l'événement / le "souffle" de la victoire. Très court, ne reste pas.
  const kidalFlash = interpolate(frame, [F_FLOTTE, F_FLOTTE + 4, F_FLOTTE + 14], [0, 0.42, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* FLASH OR climax prise de Kidal (bref) */}
      {kidalFlash > 0.01 && <AbsoluteFill style={{ background: OR_AES, opacity: kidalFlash, mixBlendMode: "screen" }} />}

      {/* ============ ÉTAT ALTÉRÉ MOURA (Ph8) — flashback mars 2022 : la carte vire SÉPIA (pas noir,
           charte parchemin). Désaturation + teinte chaude passé. Retour inverse au sortir (DA-brief A). ============ */}
      {mouraDesat > 0.01 && (
        <>
          {/* désature la carte (souvenir) */}
          <AbsoluteFill style={{ background: "#6b5d44", mixBlendMode: "saturation", opacity: mouraDesat * 0.85 }} />
          {/* teinte sépia chaude par-dessus (passé, pas deuil noir) */}
          <AbsoluteFill style={{ background: "#7a6038", mixBlendMode: "multiply", opacity: mouraDesat * 0.32 }} />
        </>
      )}

      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="p3-blue" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={BLUE_MALI} stopOpacity={0.55} />
            <stop offset="100%" stopColor="#3C5A78" stopOpacity={0.4} />
          </radialGradient>
          <filter id="p3-sillage-blur"><feGaussianBlur stdDeviation="16" /></filter>
          <mask id="p3-sillage">
            <g filter="url(#p3-sillage-blur)">
              {sillageStamps.map((s, i) => (<circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" />))}
            </g>
          </mask>
          <clipPath id="p3-kidal-clip"><path d={kidalRegionPath} /></clipPath>
          <clipPath id="p3-kidal-flag-clip"><path d={kidalFlagPath} /></clipPath>
          <filter id="p3-flag-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#1A1005" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* (FOCUS RADIAL RETIRÉ — Aziz : l'assombrissement+halo lumineux centré donnait une image "brouillée"
            type vignette extrême. La caméra serrée + le zoom suffisent à concentrer l'œil.) */}

        {/* TERRITOIRE BLEU = sillage des FAMa (multiply, révélé par le mask — l'État reprend, Ph6-7) */}
        {sillageStamps.length > 0 && sillageBlueOp > 0.01 && (
          <g style={{ mixBlendMode: "multiply" }} mask="url(#p3-sillage)" opacity={sillageBlueOp}>
            <rect x={0} y={0} width={width} height={height} fill="url(#p3-blue)" opacity={0.5} />
          </g>
        )}

        {/* Ph1 — FLÈCHES CEDEAO QUI SE BRISENT (héritées P2, vibrent puis reculent vers leurs pays) */}
        {cedeaoBreak > 0.02 && CEDEAO_RING.map((c, i) => {
          const p = project(c[0], c[1]);
          const niamey = project(NIAMEY[0], NIAMEY[1]);
          // la flèche RECULE : son extrémité revient vers le pays d'origine quand cedeaoBreak→0
          const tipX = p.x + (niamey.x - p.x) * 0.4 * cedeaoBreak + cedeaoShake;
          const tipY = p.y + (niamey.y - p.y) * 0.4 * cedeaoBreak;
          return (
            <g key={`cedeao-${i}`} opacity={cedeaoBreak}>
              <line x1={p.x} y1={p.y} x2={tipX} y2={tipY}
                stroke={PAL.CEDEAO} strokeWidth={2.4} strokeOpacity={0.6} strokeDasharray="5 4" />
            </g>
          );
        })}

        {/* (LIEN OR entre capitales RETIRÉ — Aziz : c'est la "petite flèche or" qui se dessinait sur la carte
            avant/sous l'overlay AES. Redondant : l'overlay porte déjà l'union (titre + 3 drapeaux + lien doré).) */}

        {/* Ph1 — CONTOURS AES virent OR (Mali + Burkina + Niger ensemble). Le lien doré entre pays est désormais
            DANS l'overlay ; ici les contours colorent le territoire AES (persiste après l'overlay = sens gardé).
            NOTE (2026-07-04) : tenté de prolonger holdDur pour meubler ~F_CONSERVER→F_END (retour Aziz pt.13,
            "sceaux qui clignotent" pauvres) — SANS EFFET : cette couche est rendue AVANT (donc EN DESSOUS de)
            les countryBorderPaths du moteur (SahelWarMapEngine.tsx ~3413) qui sont DÉJÀ actifs en continu sur
            toute la P3 avec les couleurs pays natives — ce calque or est invisible sous eux. Revert. La zone
            f9500 reste à traiter autrement (nouvel asset/idée, pas cette couche). */}
        {aesGold > 0.01 && [MALI_RING, BURKINA_RING, NIGER_RING].map((ring, i) => {
          const oc = countryOutline({ ring, project, frame, startF: F_BAMAKO + i * 8, drawDur: 38, holdDur: 600 });
          if (!oc) return null;
          return (
            <g key={`aes-${i}`} opacity={oc.op * aesGold}>
              {oc.flash > 0.05 && <path d={oc.d} fill={OR_AES} opacity={0.10 * oc.flash} />}
              <path d={oc.d} fill="none" stroke={OR_AES} strokeWidth={6 + 3 * oc.flash} strokeOpacity={0.20}
                strokeDasharray={oc.len} strokeDashoffset={oc.dashOffset} strokeLinejoin="round" />
              <path d={oc.d} fill="none" stroke={OR_AES} strokeWidth={3.2 + 1.6 * oc.flash} strokeOpacity={0.85}
                strokeDasharray={oc.len} strokeDashoffset={oc.dashOffset} strokeLinejoin="round" />
            </g>
          );
        })}

        {/* Ph2 — CONVERGENCE : 3 lignes or se DESSINENT des capitales vers le centre Liptako (CAUSE de l'union).
            Chaque ligne part de sa capitale et "pousse" sa pointe vers le centre (stroke-dashoffset). */}
        {converge > 0.001 && converge < 1 && (() => {
          const lp = project(LIPTAKO_CENTER[0], LIPTAKO_CENTER[1]);
          return (
            <g>
              {[BAMAKO, OUAGA, NIAMEY].map((cap, i) => {
                const cp = project(cap[0], cap[1]);
                // délai léger par capitale (elles s'allument en cascade Bamako→Ouaga→Niamey)
                const t = interpolate(converge, [i * 0.12, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                if (t <= 0.001) return null;
                // pointe qui avance de la capitale vers le centre
                const tipX = cp.x + (lp.x - cp.x) * t;
                const tipY = cp.y + (lp.y - cp.y) * t;
                return (
                  <g key={`conv-${i}`}>
                    {/* halo large doux sous la ligne */}
                    <line x1={cp.x} y1={cp.y} x2={tipX} y2={tipY} stroke={OR_AES} strokeWidth={6} strokeOpacity={0.18} strokeLinecap="round" />
                    {/* trait net */}
                    <line x1={cp.x} y1={cp.y} x2={tipX} y2={tipY} stroke={OR_AES} strokeWidth={2.6} strokeOpacity={0.9} strokeLinecap="round" />
                    {/* pointe lumineuse qui progresse */}
                    <circle cx={tipX} cy={tipY} r={4.5} fill={OR_AES} fillOpacity={0.95} />
                    <circle cx={cp.x} cy={cp.y} r={3} fill={OR_AES} fillOpacity={0.8} />
                  </g>
                );
              })}
            </g>
          );
        })()}

        {/* Ph2 — SCEAU D'UNION OR au point de rencontre (EFFET, après la convergence). Starburst bref au climax
            + zone qui pulse (l'union se voit géographiquement), puis s'estompe vers Kidal. */}
        {(liptakoT > 0.01 || unionFlash > 0.01) && (() => {
          const lp = project(LIPTAKO_CENTER[0], LIPTAKO_CENTER[1]);
          const r = spriteMapWidth(project, LIPTAKO_CENTER[0], LIPTAKO_CENTER[1], 3.2, { min: 60, max: 260 }) * liptakoPulse;
          // starburst : rayons courts qui jaillissent au moment de l'union (climax causal)
          const burstR = spriteMapWidth(project, LIPTAKO_CENTER[0], LIPTAKO_CENTER[1], 1.6, { min: 30, max: 130 });
          return (
            <g transform={`translate(${lp.x},${lp.y})`}>
              {/* zone pulsante (sceau établi) */}
              {liptakoT > 0.01 && (
                <g opacity={liptakoT}>
                  <circle r={r} fill={OR_AES} fillOpacity={0.16} />
                  <circle r={r} fill="none" stroke={OR_AES} strokeWidth={3} strokeOpacity={0.7} />
                  <circle r={r * 1.35} fill="none" stroke={OR_AES} strokeWidth={1.6} strokeOpacity={0.35 * liptakoPulse} />
                </g>
              )}
              {/* starburst bref au moment de l'union (12 rayons) */}
              {unionFlash > 0.01 && (
                <g opacity={unionFlash}>
                  <circle r={burstR * (0.4 + 0.6 * unionFlash)} fill="none" stroke={OR_AES} strokeWidth={2.5} strokeOpacity={0.7} />
                  {Array.from({ length: 12 }).map((_, k) => {
                    const ang = (k / 12) * Math.PI * 2;
                    const r0 = burstR * 0.5, r1 = burstR * (0.9 + 0.4 * unionFlash);
                    return <line key={k} x1={Math.cos(ang) * r0} y1={Math.sin(ang) * r0}
                      x2={Math.cos(ang) * r1} y2={Math.sin(ang) * r1} stroke={OR_AES} strokeWidth={2} strokeOpacity={0.85} strokeLinecap="round" />;
                  })}
                </g>
              )}
            </g>
          );
        })()}

        {/* Ph4 — ONDE DE CHOC "KIDAL." (cercles concentriques encre) + halo permanent */}
        {kidalShock > 0 && kidalShock < 1 && (
          <g transform={`translate(${kidalP.x},${kidalP.y})`}>
            {[0, 0.33, 0.66].map((d, i) => {
              const t = Math.max(0, Math.min(1, kidalShock - d));
              if (t <= 0) return null;
              return <circle key={i} r={vmin * 0.04 + t * vmin * 0.10} fill="none"
                stroke={PAL.INK} strokeWidth={2.2} strokeOpacity={(1 - t) * 0.6} />;
            })}
          </g>
        )}
        {/* halo doux SOUS la ville Kidal (le sprite-lieu, rendu hors-svg, est l'ancre — plus un point GPS).
            Anneau qui pulse une fois au nommage puis se calme. */}
        {frame >= F_KIDAL && frame < F_MOURA && (
          <g transform={`translate(${kidalP.x},${kidalP.y})`}>
            <circle r={vmin * 0.055 * (1 + 0.12 * kidalHalo)} fill="none" stroke={OR_AES} strokeWidth={2} strokeOpacity={0.35 + 0.25 * kidalHalo} />
          </g>
        )}

        {/* TRACÉ DES FRONTIÈRES de la zone Kidal (Aziz 2026-06-13) : quand "Kidal" est nommée, la délimitation
            de la zone contestée se DESSINE (stroke-dashoffset), pas un pop. Couleur = sable (zone hors-contrôle)
            puis vire BLEU à la reprise (l'État délimite ce qu'il reprend). Geste "délimitation claire". */}
        {frame >= F_KIDAL && frame < F_MOURA && (() => {
          const kr = countryOutline({ ring: KIDAL_REGION, project, frame, startF: F_KIDAL + 6, drawDur: 40, holdDur: 1400 });
          if (!kr) return null;
          // couleur : sable tant que tenue par touaregs, vire bleu Mali à la reprise (kidalBlueT)
          const col = lerpHex("#9C8859", BLUE_MALI, Math.min(1, kidalBlueT));
          return (
            <g opacity={kr.op}>
              {kr.flash > 0.05 && <path d={kr.d} fill={col} opacity={0.10 * kr.flash} />}
              <path d={kr.d} fill="none" stroke={col} strokeWidth={5 + 3 * kr.flash} strokeOpacity={0.18}
                strokeDasharray={kr.len} strokeDashoffset={kr.dashOffset} strokeLinejoin="round" />
              <path d={kr.d} fill="none" stroke={col} strokeWidth={2.6 + 1.4 * kr.flash} strokeOpacity={0.9}
                strokeDasharray={kr.len} strokeDashoffset={kr.dashOffset} strokeLinejoin="round" />
            </g>
          );
        })()}

        {/* ONU/MINUSMA — badge "interdiction de tirer" (mandat non-combattant) posé sur chaque base ONU. Le
            CAMPEMENT lui-même est un sprite rendu hors-svg (ci-dessous). Au retrait : la base FADE sur place. */}

        {/* Ph5 — ONDES "OBSERVATION PASSIVE" ONU : cercles très fins qui émanent lentement de chaque base ONU
            puis S'ESTOMPENT avant d'atteindre Kidal (l'onde n'aboutit jamais = mandat non-combattant, inaction).
            Très discret (op faible). Cesse au retrait (Ph6). Ancré aux camps → pas de mouvement hors-sol. */}
        {MINUSMA_KIDAL.map((m) => {
          if (frame < m.appearAt + 20) return null;
          const live = interpolate(frame, [m.appearAt + 20, m.appearAt + 40, m.outAt - 40, m.outAt - 16], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (live <= 0.02) return null;
          const p = project(m.coord[0], m.coord[1]);
          const rMax = vmin * 0.075;          // l'onde meurt court (n'atteint pas Kidal = inaction)
          const period = 120;                  // expansion lente (~4s)
          return (
            <g key={`onu-wave-${m.id}`} opacity={live}>
              {[0, 0.5].map((ph, i) => {
                const t = (((frame - m.appearAt) / period + ph) % 1 + 1) % 1; // 0→1 cyclique, 2 ondes déphasées
                const r = rMax * t;
                const op = (1 - t) * 0.32 * t * 4; // monte vite, meurt en s'éloignant (jamais pleine au bord)
                if (op <= 0.01) return null;
                return <circle key={i} cx={p.x} cy={p.y} r={r} fill="none" stroke={PAL.UN_BLUE}
                  strokeWidth={1.4} strokeOpacity={Math.min(0.32, op)} />;
              })}
            </g>
          );
        })}

        {MINUSMA_KIDAL.map((m) => {
          if (frame < m.appearAt) return null;
          const ap = interpolate(frame, [m.appearAt, m.appearAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const out = interpolate(frame, [m.outAt - 36, m.outAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const noFire = interpolate(frame, [m.appearAt + 18, m.appearAt + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * ap * out;
          if (noFire <= 0.02) return null;
          const p = project(m.coord[0], m.coord[1]);
          const pr = vmin * 0.016;
          return (
            <g key={m.id} transform={`translate(${p.x + vmin * 0.028},${p.y - vmin * 0.028})`} opacity={noFire * 0.9}>
              <circle r={pr} fill="#fff" fillOpacity={0.92} stroke="#B3402F" strokeWidth={2.4} />
              <line x1={-pr * 0.68} y1={pr * 0.68} x2={pr * 0.68} y2={-pr * 0.68} stroke="#B3402F" strokeWidth={2.4} />
            </g>
          );
        })}

        {/* Ph7 — REPRISE : la RÉGION de Kidal se remplit aux COULEURS DU DRAPEAU MALIEN (3 bandes vert-jaune-rouge
            verticales, clippées au contour, RÉVÉLÉES bas→haut = le drapeau se hisse sur le territoire). Décision
            Aziz 2026-06-12 : on revient au "losange aux couleurs Mali" (mieux que losange bleu + clip-art rect). */}
        {kidalBlueT > 0.01 && (() => {
          const { minX, maxX, minY, maxY } = kidalBounds;
          const w = maxX - minX, h = maxY - minY;
          const bandW = w / 3;
          const revealTop = maxY - h * flagRise;        // le remplissage monte du bas
          // ondulation douce des bandes (le drapeau "flotte" sur le territoire)
          const wv = Math.sin(frame * 0.10) * (vmin * 0.004);
          return (
            <g clipPath="url(#p3-kidal-clip)" style={{ mixBlendMode: "multiply" }} opacity={0.82 * kidalBlueT}>
              {flagRise > 0.01 && (
                <>
                  <rect x={minX + wv} y={revealTop} width={bandW} height={maxY - revealTop} fill="#14B53A" />
                  <rect x={minX + bandW + wv} y={revealTop} width={bandW} height={maxY - revealTop} fill="#FCD116" />
                  <rect x={minX + 2 * bandW + wv} y={revealTop} width={bandW} height={maxY - revealTop} fill="#CE1126" />
                </>
              )}
            </g>
          );
        })()}

        {/* Ph7 — ONDE DE CHOC à l'IMPACT (les FAMa atteignent Kidal = la prise). Cinétique qui raconte la
            violence sans soldat écrasé (reco Gemini). 2 cercles bleus concentriques qui s'étendent au "flotte". */}
        {frame >= F_FLOTTE - 6 && frame < F_FLOTTE + 50 && (() => {
          const sh = interpolate(frame, [F_FLOTTE - 6, F_FLOTTE + 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <g transform={`translate(${kidalP.x},${kidalP.y})`}>
              {[0, 0.4].map((d, i) => {
                const t = Math.max(0, Math.min(1, sh - d));
                if (t <= 0 || t >= 1) return null;
                return <circle key={i} r={vmin * 0.03 + t * vmin * 0.11} fill="none"
                  stroke={BLUE_MALI} strokeWidth={3} strokeOpacity={(1 - t) * 0.65} />;
              })}
            </g>
          );
        })()}

        {/* Ph8 — MOURA : ABSTRACTION PURE (Q2). Point rouge bordeaux sourd + halo STATIQUE dilué + UNE onde de
            choc GRAVE (1 seul ripple lent qui s'étend et s'efface, PAS un pulse d'alarme répété — Q2 respecté ;
            ajout Gemini top-3 pour la gravité des 500 morts). Aucun visage. Froideur clinique. */}
        {frame >= F_MOURA && frame < F_REPOUSSE - 20 && (() => {
          const ap = interpolate(frame, [F_MOURA, F_MOURA + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // TACHE DE SANG qui s'étend LENTEMENT (3 voix : gravité des 500 morts). Bords irréguliers via 2 cercles
          // décalés. Scale up doux, opacité dégressive vers les bords. + 1 onde de choc grave initiale.
          const spread = interpolate(frame, [F_MOURA, F_MOURA + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          const shock = interpolate(frame, [F_MOURA, F_MOURA + 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const stain = vmin * 0.02 + spread * vmin * 0.055;
          return (
            <g transform={`translate(${mouraP.x},${mouraP.y})`} opacity={mouraDesat * ap}>
              {shock > 0 && shock < 1 && (
                <circle r={vmin * 0.02 + shock * vmin * 0.10} fill="none" stroke={RED_MOURA}
                  strokeWidth={2.4} strokeOpacity={(1 - shock) * 0.5} />
              )}
              {/* tache de sang : halo diffus + cœur, bords irréguliers (2 cercles décalés) */}
              <circle r={stain * 1.25} fill={RED_MOURA} fillOpacity={0.12} />
              <circle cx={stain * 0.12} cy={-stain * 0.08} r={stain} fill={RED_MOURA} fillOpacity={0.30} />
              <circle r={stain * 0.55} fill={RED_MOURA} fillOpacity={0.55} />
              <circle r={vmin * 0.012} fill={RED_MOURA} fillOpacity={0.95} />
            </g>
          );
        })()}

        {/* Ph9 — CLASH : onde de choc au point de blocage quand le jihadiste percute le FAMa posté (le choc se
            VOIT, pas de flèche). Brève, à clashAt. */}
        {activeAttacks.map(({ a, clashT }) => {
          if (clashT <= 0.01 || clashT >= 0.99) return null;
          const bp = project(a.block[0], a.block[1]);
          return (
            <g key={`clash-${a.id}`} transform={`translate(${bp.x},${bp.y})`}>
              <circle r={vmin * 0.012 + clashT * vmin * 0.05} fill="none" stroke={PAL.INK}
                strokeWidth={2.4} strokeOpacity={(1 - clashT) * 0.6} />
            </g>
          );
        })}
      </svg>

      {/* ============ FLÈCHE OFFENSIVE FAMa (SahelAttackArrow réutilisé — Ph6) ============ */}
      {/* headType "dot" (la tête "arrow" rendait un artefact en étoile au scale réduit). S'efface dès la reprise. */}
      {famaArrowP > 0.01 && frame < F_FLOTTE && (() => {
        const arrowFade = interpolate(frame, [F_FLOTTE - 40, F_FLOTTE], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <SahelAttackArrow map={map} waypoints={[GAO, KIDAL]} progress={famaArrowP}
            color={BLUE_MALI} strokeWidth={4} headType="dot" marchingFrame={frame} opacity={0.85 * arrowFade} width={width} height={height} />
        );
      })()}

      {/* ============ RECONQUÊTE BLEUE / LIGNE DE FRONT (TerritorialExpansion réutilisé — Ph7) ============ */}
      {frame >= F_FLOTTE - 10 && frame < F_MOURA && (
        <TerritorialExpansion map={map} frame={frame} startFrame={F_FLOTTE} endFrame={F_FLOTTE + 60}
          color={BLUE_MALI} maxOpacity={0.30} width={width} height={height}
          regions={[{ id: "kidal", center: KIDAL, delayFrames: 0, durationFrames: 50, geoPolygon: KIDAL_REGION }]} />
      )}

      {/* ============ VILLE KIDAL (sprite-lieu, l'ANCRE — "une forteresse à prendre", pas un point GPS).
           Apparaît à Ph4 "Kidal." (spring), reste tout le reste de P3, ancrée centrée sur la coord. ============ */}
      {frame >= F_KIDAL && (() => {
        const ap = spring({ frame: frame - F_KIDAL, fps, config: { damping: 15 }, durationInFrames: 22 });
        if (ap <= 0.02) return null;
        const w = spriteMapWidth(project, KIDAL[0], KIDAL[1], 1.9, { min: 130, max: 340 }) * ap;
        const h = w * 0.545;
        return (
          <img key="ville-kidal" src={kidalTownSprite}
            style={{ position: "absolute", left: kidalP.x - w / 2, top: kidalP.y - h / 2, width: w, height: h,
              opacity: ap, filter: "drop-shadow(0 4px 10px rgba(40,28,12,0.4))", pointerEvents: "none" }} />
        );
      })()}

      {/* ============ DRAPEAU TOUAREG (Azawad) ondulant PLANTÉ sur Kidal (Ph5 — "ils tiennent le terrain").
           Hampe + voile à 3 bandes horizontales vert-rouge-noir qui ondule (déformation sinusoïdale des bords).
           AMBIANT : ondule en boucle tant qu'ils tiennent. Sort à l'approche des FAMa (le drapeau malien le
           remplace en Ph7). Petit, ancré au sommet de la ville-forteresse. ============ */}
      {tuaregFlagOp > 0.01 && (() => {
        // taille ancrée carte (R-OBJ-1), petit drapeau de garnison
        const fw = spriteMapWidth(project, KIDAL[0], KIDAL[1], 0.62, { min: 42, max: 96 });
        const poleH = fw * 1.35;        // hauteur de hampe
        const voileH = fw * 0.62;       // hauteur du voile
        // planté au sommet de la ville (légèrement décalé pour ne pas masquer le label)
        const baseX = kidalP.x + fw * 0.05;
        const baseY = kidalP.y - spriteMapWidth(project, KIDAL[0], KIDAL[1], 1.9, { min: 130, max: 340 }) * 0.18;
        const topY = baseY - poleH;
        // ondulation : 4 colonnes, chaque bord décalé en phase → voile qui flotte (geste de présence)
        const amp = fw * 0.06;
        const seg = 5;
        const colX = (k: number) => baseX + (fw * k) / (seg - 1);
        const waveY = (k: number, off: number) => Math.sin(frame * 0.13 + k * 0.9 + off) * amp * (k / (seg - 1));
        const bandPath = (yTop: number, yBot: number) => {
          let top = `M${colX(0).toFixed(1)},${(topY + yTop).toFixed(1)}`;
          for (let k = 1; k < seg; k++) top += `L${colX(k).toFixed(1)},${(topY + yTop + waveY(k, 0)).toFixed(1)}`;
          let bot = "";
          for (let k = seg - 1; k >= 0; k--) bot += `L${colX(k).toFixed(1)},${(topY + yBot + waveY(k, 0.6)).toFixed(1)}`;
          return top + bot + "Z";
        };
        const b = voileH / 3;
        return (
          <svg key="tuareg-flag" width={width} height={height} style={{ position: "absolute", inset: 0, opacity: tuaregFlagOp, pointerEvents: "none" }}>
            <g filter="url(#p3-flag-shadow)">
              {/* hampe (encre brune) */}
              <line x1={baseX} y1={baseY} x2={baseX} y2={topY} stroke={PAL.INK} strokeWidth={Math.max(2, fw * 0.05)} strokeLinecap="round" />
              <circle cx={baseX} cy={topY} r={Math.max(2, fw * 0.05)} fill={PAL.INK} />
              {/* voile Azawad : vert / rouge / noir (haut→bas), désaturé pour la charte parchemin */}
              <path d={bandPath(0, b)} fill="#3E6B45" />
              <path d={bandPath(b, b * 2)} fill="#9C3A33" />
              <path d={bandPath(b * 2, b * 3)} fill="#2A241E" />
              {/* liseré sombre au guindant (côté hampe) pour ancrer le voile à la hampe */}
              <line x1={baseX} y1={topY} x2={baseX} y2={topY + voileH} stroke="rgba(0,0,0,0.25)" strokeWidth={Math.max(1, fw * 0.03)} />
            </g>
          </svg>
        );
      })()}

      {/* ============ BASES MINUSMA (campements ONU top-down) près de Kidal (Ph5). Posées, immobiles (mandat
           non-combattant = badge no-fire en svg). Au retrait Ph6 : la base FADE simplement sur place (bâtiment
           démantelé/abandonné, ne se déplace pas — décision Aziz 2026-06-13). ============ */}
      {MINUSMA_KIDAL.map((m) => {
        if (frame < m.appearAt) return null;
        const ap = spring({ frame: frame - m.appearAt, fps, config: { damping: 14 }, durationInFrames: 18 });
        const out = interpolate(frame, [m.outAt - 36, m.outAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = ap * out;
        if (op <= 0.02) return null;
        const p = project(m.coord[0], m.coord[1]);
        const w = spriteMapWidth(project, m.coord[0], m.coord[1], MINUSMA_DEG, { min: 90, max: 240 }) * ap;
        const h = w * MINUSMA_RATIO;
        return (
          <img key={`un-${m.id}`} src={minusmaSprite}
            style={{ position: "absolute", left: p.x - w / 2, top: p.y - h * 0.6, width: w, height: h, opacity: op,
              filter: "drop-shadow(0 3px 7px rgba(40,30,20,0.3))", pointerEvents: "none" }} />
        );
      })}

      {/* (Africa Corps n'est plus un fortin statique — c'est désormais un JETON qui AVANCE avec les FAMa,
          rendu dans le duo offensive ci-dessous. Décision Aziz : des acteurs en mouvement, pas une base posée.) */}

      {/* (DRAPEAU RECTANGULAIRE clip-art RETIRÉ — Aziz 2026-06-12 : on revient au losange aux couleurs Mali,
          c.-à-d. la RÉGION remplie des 3 bandes vert-jaune-rouge, rendue dans le SVG ci-dessus. Plus de petit
          drapeau rectangulaire par-dessus.) */}

      {/* ============ JETONS TOUAREGS (Ph5 posés → Ph6-7 reculent) ============ */}
      {/* Taille LÉGÈREMENT réduite (Aziz 2026-06-14 : jetons touaregs autour de Kidal un peu trop gros). */}
      {activeTouaregs.map(({ j, lon, lat, p }) => {
        const ap = spring({ frame: frame - j.appear, fps, config: { damping: 15 }, durationInFrames: 14 });
        const dis = interpolate(frame, [j.disappear - 30, j.disappear], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = ap * dis;
        if (op <= 0.02) return null;
        const D = spriteMapWidth(project, lon, lat, JETON_DEG * 0.88, { min: 56, max: 132 }) * ap;
        return chip({ key: j.id, x: p.x, y: p.y, D, op, border: "#9C8859", sprite: "jeton-csp", seed: j.id.charCodeAt(1) * 7, badge: "armed" });
      })}

      {/* ============ DUO OFFENSIVE (Ph6) : FAMa (bordure bleu Mali, jeton-fama) + Africa Corps (bordure grise,
           jeton-junte stand-in) montent ENSEMBLE vers Kidal ============ */}
      {activeFama.map(({ j, lon, lat, p }) => {
        const ap = spring({ frame: frame - j.appear, fps, config: { damping: 15 }, durationInFrames: 14 });
        const dis = interpolate(frame, [j.disappear - 30, j.disappear], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = ap * dis;
        if (op <= 0.02) return null;
        const D = spriteMapWidth(project, lon, lat, JETON_DEG, JETON_BOUNDS) * ap;
        const isAC = (j as OffJeton).faction === "africacorps";
        const border = isAC ? "#6E6A60" : BLUE_MALI;   // gris-fer paramilitaire vs bleu Mali
        const sprite = isAC ? "jeton-africacorps" : "jeton-fama"; // vrai mercenaire russe (distinct des FAMa)
        return chip({ key: j.id, x: p.x, y: p.y, D: D * (isAC ? 0.92 : 1), op, border, sprite, seed: j.id.charCodeAt(1) * 7, badge: isAC ? "merc" : "mil" });
      })}

      {/* ============ ATTAQUES 2026 (Ph9) — REFONTE jetons physiques (Aziz) : jihadiste CHARGE → FAMa le BLOQUE
           physiquement → jihadiste REPOUSSÉ. Pas de flèches, pas de plaque. Démonstration par la vision. ============ */}
      {/* FAMa défenseurs postés (bleu) — ils TIENNENT la route devant la capitale */}
      {activeAttacks.map(({ a, defP, defOp }) => {
        if (defOp <= 0.02) return null;
        const D = spriteMapWidth(project, a.defend[0], a.defend[1], JETON_DEG * 0.78, { min: 46, max: 100 });
        return chip({ key: `def-${a.id}`, x: defP.x, y: defP.y, D, op: defOp, border: BLUE_MALI, sprite: "jeton-fama", seed: a.id.charCodeAt(3) * 5, badge: "mil" });
      })}
      {/* jihadistes qui chargent puis sont repoussés (rouge) */}
      {activeAttacks.map(({ a, lon, lat, p, op }) => {
        if (op <= 0.02) return null;
        const D = spriteMapWidth(project, lon, lat, JETON_DEG * 0.78, { min: 46, max: 100 });
        const border = a.faction === "jnim" ? "#C9A24B" : "#2E2A1E";
        const sprite = a.faction === "jnim" ? "fighter-jnim" : "fighter-eigs";
        return chip({ key: a.id, x: p.x, y: p.y, D, op, border, sprite, seed: a.id.charCodeAt(3) * 7, badge: "armed" });
      })}

      {/* (FUMÉE retrait ONU RETIRÉE — décision Aziz : l'ONU "se retire" = effacement PROPRE des points,
          pas une chute en fumée. La fumée centrale sur Kidal brouillait le retrait. Les sprites ONU
          fondent déjà via `out` dans renderBase.) */}

      {/* ============ PLAQUES DE NOMS (WarMapPlaque parchemin) ============ */}
      {/* (Plaque "16 SEPT. 2023 · AES" RETIRÉE — la date + l'événement sont DÉJÀ dans le kicker de l'overlay
          WarMapOverlayDynamic. Cette plaque carte entrait en collision avec l'overlay + doublonnait l'info.) */}
      {/* PLAQUES ÉLAGUÉES (#8 Aziz/3 voix) : chaque plaque vit pour SON moment puis disparaît. KIDAL n'est
          affiché que le temps de situer la ville (Ph4→reprise) PUIS disparaît (le drapeau suffit à dire qui tient).
          Plaques "HORS CONTRÔLE" et "FAMa+Africa Corps" retirées (redondantes avec les jetons/voix). */}
      {/* Ph4 — Kidal (situe la ville, disparaît une fois reprise + drapeau planté) */}
      <WarMapPlaque frame={frame} name="KIDAL" pos={kidalP}
        appearAt={F_KIDAL + 6} hideAt={F_FLOTTE + 50} accent={OR_AES} size={22} yOffset={26} />
      {/* Ph7 — Kidal reprise (l'événement clé, bref) */}
      <WarMapPlaque frame={frame} name="KIDAL REPRISE · NOV. 2023" pos={project(1.44, 19.30)}
        appearAt={F_FLOTTE + 20} hideAt={F_MOURA - 40} accent={BLUE_MALI} size={18} yOffset={20} />
      {/* (Plaque "CONTRÔLE DE L'ÉTAT MALIEN" RETIRÉE — Aziz : le losange aux couleurs du drapeau Mali + les
          jetons FAMa qui tiennent le territoire disent déjà tout. Pas besoin de label.) */}
      {/* Ph8 — Moura (sourcé ONU) */}
      <WarMapPlaque frame={frame} name="MOURA · MARS 2022 · RAPPORT ONU" pos={project(MOURA[0], MOURA[1] - 1.3)}
        appearAt={F_MOURA + 14} hideAt={F_REPOUSSE - 30} accent={RED_MOURA} size={15} yOffset={24} />
      {/* (Chiffre "500+" géant RETIRÉ — Aziz 2026-06-12 : prend trop d'espace sur la carte et casse au dézoom.
          On garde la tache de sang + la plaque sourcée "MOURA · MARS 2022 · RAPPORT ONU" + le SFX grave.) */}
      {/* Ph8 — source visible (retour Aziz 2026-07-01 pt.7+12, DÉPLACÉE 2026-07-04 pt.10) : le texte
          typewriter "500+ morts..." a été RETIRÉ (la plaque "MOURA · MARS 2022 · RAPPORT ONU" suffit).
          La source elle-même était incrustée SUR la carte près de Moura — Aziz : la déplacer vers
          l'emplacement standard (bas d'écran, même pattern que la source OCHA/PAM/HCR de P4), pas
          incrustée dans la géographie. */}
      {frame >= F_MOURA + 50 && frame < F_MOURA + 130 && (() => {
        const op = interpolate(frame, [F_MOURA + 50, F_MOURA + 62, F_MOURA + 118, F_MOURA + 130], [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (op <= 0.01) return null;
        return (
          <div style={{ position: "absolute", bottom: 20, right: 30, fontSize: 12, fontWeight: 700,
            color: RED_MOURA, letterSpacing: 1.5, textTransform: "uppercase",
            opacity: op, fontFamily: "Georgia, serif" }}>
            Haut-Commissariat de l'ONU aux droits de l'homme
          </div>
        );
      })()}
      {/* (Plaque "2026 · ATTAQUES REPOUSSÉES" RETIRÉE — Aziz : pas besoin de plaque, le combat de jetons
          (jihadistes repoussés par les FAMa) raconte tout par la vision.) */}

      {/* ============================================================
          Ph1 SVG NARRATIF — LiptakoRevealSVG (Session A 2026-07-04, remplace WarMapOverlayDynamic jugé
          "peu convaincant" par Aziz, retour 2026-07-01 pt.10). Miroir narratif du CFA : un sceau de cire
          qui SE SCELLE (3 cordages Mali/Niger/Burkina convergent), + 3 vrais drapeaux en séquence.
          inAt=F_BAMAKO → outAt=F_EPREUVE (682 frames = 22.7s, mini-render validé Aziz catbox hlt9kt).
          ============================================================ */}
      <LiptakoRevealSVG frame={frame} inAt={F_BAMAKO} outAt={F_EPREUVE} width={width} height={height} fps={fps} />

      {/* Respiration avant coupe vers P4 (retour Aziz 2026-07-04 pt.13) : le cut P3→P4 passait directement
          d'une scène pleine à une carte vide de jetons, jugé "moins naturel". Fondu au noir bref (~0.6s)
          en toute fin de fenêtre, complété par le fondu d'entrée symétrique en tête de Partie4Cout. */}
      {(() => {
        const FADE_DUR = 18; // ~0.6s à 30fps
        const fadeOp = interpolate(frame, [F_END - FADE_DUR, F_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (fadeOp <= 0.01) return null;
        return <AbsoluteFill style={{ background: "#0a0805", opacity: fadeOp }} />;
      })()}
    </AbsoluteFill>
  );
};

export default Partie3Rupture;
