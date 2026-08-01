/**
 * GlobeRecitProto — adaptation SHORT 9:16 du proto "le globe se dessine" (v2, direction Aziz 2026-07-31),
 * calee sur le timing.ts reel du Short Soudan (produit par le storyboarder, 2026-08-01).
 *
 * ⭐ LE PRINCIPE (inchange depuis le proto original) : le globe se dessine AU RYTHME DU RECIT — seul
 * existe ce que la voix vient de nommer. Le vide n'est plus un manque, c'est du sens.
 *
 * ⚠️ DIFFERENCES vs le proto 16:9 original (src/projects/_rnd/d3-16x9/GlobeRecitProto.tsx, worktree
 * remotion-soudan, branche feat/soudan-passe-finale-6lots) :
 *  1. Format 9:16 natif (W=1080, H=1920 dans globeGeo.ts) — PAS un recadrage d'un rendu 16:9
 *     (decision Aziz 2026-08-01 : "reflow natif 9:16").
 *  2. SEQUENCE reelle du Short (5 pays : Sudan -> Emirats -> Egypte -> Russie -> Turquie), pas la
 *     sequence demo (Soudan/France/Russie). Chaque frame de pivot/trace vient de BEATS dans
 *     src/projects/warmap/shorts/soudan-short/timing.ts (aucune valeur inventee).
 *  3. Duree totale = SCENES.mouvementA + pause1 + pivot + SCENES.mouvementB (jusqu'au climax
 *     "incendie/main", frame 2681) — le globe couvre Mouvement A + Pivot + Mouvement B ; la Chute et
 *     le CTA sont d'autres scenes (texte/cartouche), pas le globe.
 *  4. Emirats et Egypte apparaissent 2 FOIS chacun (Mouvement A puis Mouvement B) : la 2e mention ne
 *     re-trace PAS le pays (deja dessine), elle ne fait que re-pivoter la camera dessus (highlight).
 *
 * ⛔ LES PIEGES TOUJOURS EVITES (heritage du proto original) :
 *  - longueurs de path MESUREES (jamais d'heuristique) — lecon CFA beat 6a.
 *  - la camera DOIT tourner entre pays, ce qui recalcule les paths et invaliderait un trace en cours.
 *    PARADE : on ALTERNE strictement [pivot, rien ne se trace] -> [pose, le pays se dessine] -> [pivot] ...
 */
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { W, H, GLOBE_R, worldFeatures, featureByName, orthoAt, pathOf, isVisible } from "./globeGeo";
import { arcPathD, projectPoint, type LonLat } from "./geoArc";
import { THEMES } from "./globeThemes";
import { BEATS, SCENES } from "../timing";

// Le globe couvre Mouvement A + pause1 + Pivot + Mouvement B (jusqu'au climax "main").
// La Chute et le CTA sont d'autres scenes visuelles (cf timing.ts) — ce composant s'arrete ici.
export const GLOBE_RECIT_START = SCENES.mouvementA.start; // 0
export const GLOBE_RECIT_END = BEATS.climax_incendie_main.frame; // 2681
export const GLOBE_RECIT_FRAMES = GLOBE_RECIT_END - GLOBE_RECIT_START; // 2681 frames (~89.4s @30fps)

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);

const t = THEMES.mixte;
const TRAIT = "#F4ECD2"; // le trait de plume = le sudanFill du registre (crème chaud)
const OR = "#d9a441";

// ── Longueur RÉELLE d'un path (jamais d'heuristique — leçon CFA beat 6a) ──
function polylineLength(d: string): number {
  let total = 0;
  const re = /([MLZ])([^MLZ]*)/gi;
  let m: RegExpExecArray | null;
  let cur: number[][] = [];
  const flush = () => {
    for (let i = 1; i < cur.length; i++) {
      total += Math.hypot(cur[i][0] - cur[i - 1][0], cur[i][1] - cur[i - 1][1]);
    }
    cur = [];
  };
  while ((m = re.exec(d)) !== null) {
    const cmd = m[1].toUpperCase();
    if (cmd === "Z") { if (cur.length) { total += Math.hypot(cur[0][0] - cur[cur.length - 1][0], cur[0][1] - cur[cur.length - 1][1]); flush(); } continue; }
    const nums = m[2].trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (cmd === "M" && cur.length) flush();
    for (let i = 0; i + 1 < nums.length; i += 2) cur.push([nums[i], nums[i + 1]]);
  }
  flush();
  return total;
}

// Un pays qui SE DESSINE puis se remplit.
const PaysTrace: React.FC<{
  d: string; trace: number; fill: number; fillColor?: string; strokeW?: number;
}> = ({ d, trace, fill, fillColor = t.land, strokeW = 1.6 }) => {
  const len = useMemo(() => polylineLength(d), [d]);
  if (trace <= 0) return null;
  return (
    <g>
      {fill > 0.01 && <path d={d} fill={fillColor} fillOpacity={0.95 * fill} stroke="none" />}
      <path
        d={d} fill="none" stroke={TRAIT} strokeWidth={strokeW}
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - trace)}
        strokeOpacity={0.95}
      />
    </g>
  );
};

// ═══ SÉQUENCE NARRATIVE ═══
// Chaque étape : [pivot caméra] puis [tracé, caméra posée]. Les fenêtres ne se chevauchent JAMAIS.
//
// ⭐ CORRECTION (retour Aziz 2026-08-01) : `traceEnd` etait confondu avec "le pays reste affiche
// jusqu'a l'etape suivante" — resultat, le GESTE de trace durait 15s+ (toute la fenetre de narration
// du pays), beaucoup trop lent pour un Short. On separe maintenant :
//  - `traceDuration` : duree du GESTE de trace (court, 2-3s ~ 60-90 frames), fixe independamment
//    de la narration — c'est un choix de MISE EN SCENE, pas une contrainte texte.
//  - `staysUntil` : frame jusqu'a laquelle le pays reste affiche/rempli (peut durer tout le bloc).
type Etape = {
  nom: string;
  pays: string;          // nom Natural Earth
  lonLat: LonLat;        // cible caméra + ancrage de l'arc
  camIn: number;         // début du pivot
  camEnd: number;        // fin du pivot = début du tracé (caméra posée à partir d'ici)
  traceDuration: number; // durée du GESTE de tracé en frames (court, ~60-90f = 2-3s), pas la narration
  staysUntil: number;    // frame jusqu'a laquelle le pays reste affiche (peut durer plus longtemps)
  arcDepuis?: number;    // index de l'étape précédente à relier (arc)
};

const TRACE_COURT = 75; // ~2.5s @30fps — duree du geste de trace, uniforme pour tous les pays

// Coordonnees geographiques REELLES (centroides d3-geo sur le geoJSON Natural Earth 110m utilise
// par globeGeo.ts — calculees, pas estimees). Russie : centroide brut pointe tres au nord (Siberie,
// lat ~66) car le pays est enorme — on cadre plutot sur Moscou (lon 37.6, lat 55.7, deja utilise
// dans le proto original) pour un pivot visuellement coherent avec "la Russie" comme acteur/capitale.
//
// Chaque frame de camIn/camEnd/staysUntil vient de BEATS dans ../timing.ts (aucune valeur inventee).
// `traceDuration` en revanche est un choix de MISE EN SCENE fixe (TRACE_COURT, ~2.5s) — le geste de
// tracé ne doit PAS durer aussi longtemps que la fenetre de narration du pays (c'etait le bug v1).
// Le pays reste ensuite affiche/rempli (staysUntil) jusqu'a l'etape suivante, mais le TRACE lui-meme
// (l'animation du contour qui se dessine) est court et se termine bien avant.
const ETAPES: Etape[] = [
  // ── MOUVEMENT A ──
  // 1. LE SOUDAN (sujet) — deja cadre des l'ouverture, se dessine sans pivot (camIn=camEnd=0).
  { nom: "Soudan", pays: "Sudan", lonLat: [29.8, 16.0], camIn: 0, camEnd: 0, traceDuration: TRACE_COURT, staysUntil: BEATS.darfour_2e_mention.frame },
  // 2. LES EMIRATS (1ere mention, route de l'or) — pivot depuis le Soudan, tracé, arc Soudan->Emirats.
  { nom: "Emirats (or)", pays: "United Arab Emirates", lonLat: [54.2, 23.9], camIn: BEATS.darfour_2e_mention.frame, camEnd: BEATS.emirats_1ere_mention.frame, traceDuration: TRACE_COURT, staysUntil: BEATS.egypte_1ere_mention.frame, arcDepuis: 0 },
  // 3. L'EGYPTE (1ere mention, 2e circuit de l'or via l'armee reguliere) — pivot, tracé, arc Soudan->Egypte.
  { nom: "Egypte (or)", pays: "Egypt", lonLat: [29.9, 26.5], camIn: BEATS.emirats_1ere_mention.frame, camEnd: BEATS.egypte_1ere_mention.frame, traceDuration: TRACE_COURT, staysUntil: BEATS.front_fin_mouvementA.frame, arcDepuis: 0 },

  // ── MOUVEMENT B (apres pause1 + pivot narratif) ──
  // 4. LA RUSSIE (1ere des 4 puissances) — pivot loin depuis l'Egypte, tracé, arc Soudan->Russie.
  { nom: "Russie", pays: "Russia", lonLat: [37.6, 55.7], camIn: BEATS.autour_soudan_debut_B.frame, camEnd: BEATS.russie_1ere_mention.frame, traceDuration: TRACE_COURT, staysUntil: BEATS.turquie_mention.frame, arcDepuis: 0 },
  // 5. LA TURQUIE (2e puissance) — pivot, tracé, arc Soudan->Turquie.
  { nom: "Turquie", pays: "Turkey", lonLat: [35.1, 39.1], camIn: BEATS.russie_1ere_mention.frame, camEnd: BEATS.turquie_mention.frame, traceDuration: TRACE_COURT, staysUntil: BEATS.egypte_2e_mention.frame, arcDepuis: 0 },
];

// Re-mentions (Egypte, Emirats) au Mouvement B : le pays est DEJA tracé (etape ci-dessus), on ne fait
// que RE-PIVOTER la camera dessus pour le mettre en evidence — pas de nouveau tracé, pas de nouvel arc.
const RE_MENTIONS: { nom: string; pays: string; lonLat: LonLat; camIn: number; camEnd: number }[] = [
  { nom: "Egypte (2e, puissance)", pays: "Egypt", lonLat: [29.9, 26.5], camIn: BEATS.turquie_mention.frame, camEnd: BEATS.egypte_2e_mention.frame },
  { nom: "Emirats (2e, mediateur=financeur)", pays: "United Arab Emirates", lonLat: [54.2, 23.9], camIn: BEATS.egypte_2e_mention.frame, camEnd: BEATS.emirats_2e_mention.frame },
];

export const GlobeRecitProto: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== CAMÉRA : pivote entre les étapes, POSÉE pendant chaque tracé =====
  // On interpole la cible d'une étape à l'autre UNIQUEMENT sur les fenêtres [camIn, camEnd].
  // Hors de ces fenêtres, la caméra est strictement immobile → aucun path ne bouge pendant un tracé.
  // Chaque étape déclare le CADRAGE dans lequel elle doit être vue (centre + échelle). On interpole
  // d'un cadrage à l'autre UNIQUEMENT sur [camIn, camEnd] ; ailleurs la caméra est strictement figée.
  //
  // ⭐⭐ CORRECTION MAJEURE (retour Aziz 2026-08-01, 1er rendu juge) : le calibrage herite du proto
  // 16:9 original (s=2.05 -> 1.16) faisait DEBORDER le globe du cadre — a s=2.05, le rayon affiche
  // (GLOBE_R*s ~ 749*2.05 ~ 1536px) depasse largement W=1080 : on ne voyait qu'un fragment de surface
  // (l'impression de "fond bleu plat" signalee). Le globe doit etre ENTIER et bien visible des la
  // frame 0 (decision Aziz : "globe entier tres visible"). Nouvelle cible : s ~ 0.55-0.65 pour que le
  // diametre affiche fasse ~85% de W=1080 (calcule : 1080*0.85/2 / 749 ~ 0.61). Le dezoom reste (le
  // globe recule legerement a mesure que le reseau s'etend) mais dans une fourchette RESTREINTE
  // (0.62 -> 0.42), jamais retour a des scales >1 qui feraient a nouveau deborder.
  // ⭐⭐⭐ VARIANTE "DRIFT" v2 (retour Aziz 2026-08-01 : "a peine perceptible, on ne voit meme pas ce
  // que tu as dit par drift") : amplitude MULTIPLIEE PAR 6 (0.008 -> 0.05 deg/frame, soit 1.5deg/s au
  // lieu de 0.24deg/s) + un VA-ET-VIENT sinusoidal (pas juste une derive dans un seul sens, qui finirait
  // par faire sortir le pays du cadre sur une longue fenetre) — le globe oscille visiblement d'un cote
  // a l'autre du pays affiche, TOUJOURS actif uniquement en fenetre de pose (jamais pendant un pivot).
  const DRIFT_SPEED = 0.05; // degres/frame de la vitesse angulaire du va-et-vient (nettement visible)
  const DRIFT_AMPLITUDE = 4.5; // amplitude en degres du va-et-vient (avant: aucune, derive infinie)
  const cam = useMemo(() => {
    const KEYS = [
      { f: 0, lon: 29.8, lat: 16.0, s: 0.62 }, // globe ENTIER visible, leger zoom sur le Soudan
      { f: ETAPES[0].staysUntil, lon: 29.8, lat: 16.0, s: 0.62 }, // pose pendant le trace + affichage Soudan
      { f: ETAPES[1].camEnd, lon: 54.2, lat: 23.9, s: 0.58 }, // pivot vers Emirats + recul leger
      { f: ETAPES[1].staysUntil, lon: 54.2, lat: 23.9, s: 0.58 }, // pose pendant le trace + affichage Emirats
      { f: ETAPES[2].camEnd, lon: 40.0, lat: 22.0, s: 0.54 }, // pivot vers Egypte (cadrage median) + recul
      { f: ETAPES[2].staysUntil, lon: 40.0, lat: 22.0, s: 0.54 }, // pose pendant le trace + affichage Egypte = fin Mouvement A
      { f: ETAPES[3].camEnd, lon: 37.6, lat: 55.7, s: 0.50 }, // pivot vers la Russie (Moscou) + recul
      { f: ETAPES[3].staysUntil, lon: 37.6, lat: 55.7, s: 0.50 }, // pose pendant le trace + affichage Russie
      { f: ETAPES[4].camEnd, lon: 35.1, lat: 39.1, s: 0.46 }, // pivot vers la Turquie + recul (les 4 puissances doivent tenir)
      { f: ETAPES[4].staysUntil, lon: 35.1, lat: 39.1, s: 0.46 }, // pose pendant le trace + affichage Turquie
      { f: RE_MENTIONS[0].camEnd, lon: 29.9, lat: 26.5, s: 0.46 }, // re-pivot Egypte (highlight, deja trace)
      { f: RE_MENTIONS[1].camEnd, lon: 42.0, lat: 30.0, s: 0.42 }, // re-pivot Emirats + dezoom final : les 5 pays + Soudan tiennent
      { f: GLOBE_RECIT_FRAMES, lon: 42.0, lat: 30.0, s: 0.42 }, // pose final : le climax "incendie/main" tient sans mouvement
    ];
    let k = 0;
    while (k < KEYS.length - 2 && frame >= KEYS[k + 1].f) k++;
    const a = KEYS[k], b = KEYS[k + 1];
    const p = interpolate(frame, [a.f, b.f], [0, 1], { ...clampB, easing: easeInOut });
    // Drift actif UNIQUEMENT quand la camera est POSEE (fenetre ou a et b partagent la meme position —
    // jamais pendant un pivot, sinon le trace en cours serait invalide). VA-ET-VIENT sinusoidal (pas
    // une derive a sens unique) : amplitude DRIFT_AMPLITUDE degres, vitesse angulaire DRIFT_SPEED.
    const isPoseWindow = a.lon === b.lon && a.lat === b.lat;
    const driftLon = isPoseWindow ? DRIFT_AMPLITUDE * Math.sin(DRIFT_SPEED * (frame - a.f)) : 0;
    return {
      lon: a.lon + (b.lon - a.lon) * p + driftLon,
      lat: a.lat + (b.lat - a.lat) * p,
      s: a.s + (b.s - a.s) * p,
    };
  }, [frame]);

  const proj = useMemo(
    () => orthoAt(-cam.lon, -cam.lat).scale(GLOBE_R * cam.s),
    [cam.lon, cam.lat, cam.s]
  );
  const path = useMemo(() => pathOf(proj), [proj]);
  const sphereD = useMemo(() => path({ type: "Sphere" } as any) || "", [path]);

  // ⭐ Retour Aziz n°3 : le globe est POSÉ dès la frame 0 (léger fondu d'ouverture, pas un tracé).
  const globeIn = interpolate(frame, [0, 16], [0, 1], { ...clampB, easing: easeOut });

  // Les pays de la séquence
  const feats = useMemo(
    () => ETAPES.map((e) => ({ etape: e, feat: featureByName(e.pays) })),
    []
  );

  // Le reste du monde arrive TRÈS tard et TRÈS discret : le récit fini, le contexte se devine.
  // Fenetre proportionnelle a la nouvelle durée (dernier pivot RE_MENTIONS -> fin du globe).
  const mondeFade = interpolate(frame, [RE_MENTIONS[1].camEnd, GLOBE_RECIT_FRAMES], [0, 0.30], { ...clampB, easing: easeInOut });
  const autresPays = useMemo(() => {
    if (mondeFade <= 0.01) return [];
    const noms = new Set(ETAPES.map((e) => e.pays));
    return worldFeatures()
      .filter((f) => !noms.has(f.properties.name))
      .map((f) => path(f as any))
      .filter(Boolean) as string[];
  }, [path, mondeFade]);

  // ⭐ CHAMP D'ETOILES (retour Aziz 2026-08-01) : le format 9:16 laisse beaucoup de vide au-dessus
  // et en-dessous du globe (H=1920 >> largeur du globe) — un fond etoile ancre le "vu depuis l'espace"
  // et remplit le cadre. DETERMINISTE (positions generees par une PRNG a seed fixe, jamais
  // Math.random() qui casserait la reproductibilite du rendu) : meme rendu a chaque frame identique.
  const stars = useMemo(() => {
    let seed = 42;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    return Array.from({ length: 140 }, () => ({
      x: rand() * W,
      y: rand() * H,
      r: 0.6 + rand() * 1.6,
      op: 0.25 + rand() * 0.55,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          {/* océan du registre Soudan — dégradé "côté éclairé" */}
          <radialGradient id="grOcean" cx="40%" cy="34%" r="76%">
            <stop offset="0%" stopColor={t.oceanInner} />
            <stop offset="58%" stopColor={t.oceanMid} />
            <stop offset="100%" stopColor={t.oceanOuter} />
          </radialGradient>
          {/* halo atmosphérique : le volume sphérique sans 3D */}
          <radialGradient id="grAtmo" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor={t.atmoColor} stopOpacity="0" />
            <stop offset="97%" stopColor={t.atmoColor} stopOpacity={String(t.atmoOpacity * 0.55)} />
            <stop offset="100%" stopColor={t.atmoColor} stopOpacity="0" />
          </radialGradient>
          <clipPath id="grClip"><path d={sphereD} /></clipPath>
        </defs>

        {/* CHAMP D'ETOILES — sous le globe, remplit le vide du cadre 9:16 (vu depuis l'espace) */}
        <g>
          {stars.map((s, i) => (
            <circle key={`star${i}`} cx={s.x} cy={s.y} r={s.r} fill="#F4ECD2" opacity={s.op} />
          ))}
        </g>

        <g opacity={globeIn}>
          {/* ⭐ LE GLOBE EST LÀ DÈS LE DÉPART (retour Aziz) : sphère + océan, PAS de graticule. */}
          <path d={sphereD} fill="url(#grOcean)" stroke={t.sphereStroke} strokeWidth={1.2} strokeOpacity={0.5} />

          <g clipPath="url(#grClip)">
            {/* le reste du monde, très discret, tout à la fin */}
            {autresPays.map((d, i) => (
              <path key={`w${i}`} d={d} fill={t.land} fillOpacity={mondeFade * 0.55}
                stroke={t.landStroke} strokeWidth={0.4} strokeOpacity={mondeFade} />
            ))}

            {/* ── LES ARCS : la ligne qui relie, tracée APRÈS le GESTE de tracé du pays (pas apres
                staysUntil — l'arc doit apparaitre vite, ~2.5s apres le pivot, pas 15s plus tard). */}
            {ETAPES.map((e, i) => {
              if (e.arcDepuis === undefined) return null;
              const from = ETAPES[e.arcDepuis];
              const traceGestEnd = e.camEnd + e.traceDuration;
              const reveal = interpolate(frame, [traceGestEnd - 12, traceGestEnd + 26], [0, 1], { ...clampB, easing: easeInOut });
              if (reveal <= 0) return null;
              const d = arcPathD(proj, path, from.lonLat, e.lonLat, reveal);
              if (!d) return null;
              return (
                <g key={`a${i}`}>
                  <path d={d} fill="none" stroke={OR} strokeWidth={4.5} strokeOpacity={0.16} strokeLinecap="round" />
                  <path d={d} fill="none" stroke={OR} strokeWidth={1.9} strokeOpacity={0.92} strokeLinecap="round" />
                </g>
              );
            })}

            {/* ── LES PAYS : le GESTE de tracé est court (traceDuration, ~2.5s), puis le pays reste
                affiche/rempli jusqu'a staysUntil (peut durer tout le bloc de narration). */}
            {feats.map(({ etape, feat }, i) => {
              if (!feat) return null;
              const d = path(feat as any);
              if (!d) return null; // face cachée
              const traceGestEnd = etape.camEnd + etape.traceDuration;
              const trace = interpolate(frame, [etape.camEnd, traceGestEnd], [0, 1], { ...clampB, easing: easeOut });
              const fill = interpolate(frame, [traceGestEnd - 18, traceGestEnd + 16], [0, 1], { ...clampB, easing: easeInOut });
              // le Soudan (sujet) garde sa teinte claire du registre ; les autres sont kaki
              const col = etape.pays === "Sudan" ? t.sudanFill : t.land;
              // le trait garde une épaisseur PERÇUE constante malgré le dézoom (sinon il maigrit
              // au fur et à mesure qu'on recule et le geste de tracé se perd). Diviseur recalibre
              // pour la nouvelle plage cam.s (0.42-0.62, cf correction "globe entier visible").
              const w = (etape.pays === "Sudan" ? 2.1 : 1.8) / Math.max(0.35, cam.s);
              return <PaysTrace key={`p${i}`} d={d} trace={trace} fill={fill} fillColor={col} strokeW={w} />;
            })}

            {/* ── RE-MENTIONS (Mouvement B) : le pays est DEJA trace, on affiche un PULSE de rappel
                sur son centroide au moment du re-pivot — pas de nouveau trace, pas de nouvel arc. */}
            {RE_MENTIONS.map((rm, i) => {
              const pulse = interpolate(frame, [rm.camEnd - 4, rm.camEnd + 10, rm.camEnd + 30], [0, 1, 0], { ...clampB, easing: easeInOut });
              if (pulse <= 0.01) return null;
              const visibleNow = (p: LonLat) => isVisible(p, -cam.lon, -cam.lat);
              const pt = projectPoint(proj, rm.lonLat, visibleNow);
              if (!pt) return null;
              return (
                <g key={`rm${i}`}>
                  <circle cx={pt.x} cy={pt.y} r={10 + 22 * pulse} fill="none" stroke={OR} strokeWidth={2.4} strokeOpacity={0.55 * pulse} />
                  <circle cx={pt.x} cy={pt.y} r={5} fill={OR} opacity={0.85 * pulse} />
                </g>
              );
            })}
          </g>

          {/* halo par-dessus */}
          <path d={sphereD} fill="url(#grAtmo)" style={{ pointerEvents: "none" }} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
