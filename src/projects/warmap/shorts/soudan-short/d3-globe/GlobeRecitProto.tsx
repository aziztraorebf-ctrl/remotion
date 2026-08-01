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
type Etape = {
  nom: string;
  pays: string;          // nom Natural Earth
  lonLat: LonLat;        // cible caméra + ancrage de l'arc
  camIn: number;         // début du pivot
  camEnd: number;        // fin du pivot = début du tracé (caméra posée à partir d'ici)
  traceEnd: number;      // fin du tracé du pays
  arcDepuis?: number;    // index de l'étape précédente à relier (arc)
};

// Coordonnees geographiques REELLES (centroides d3-geo sur le geoJSON Natural Earth 110m utilise
// par globeGeo.ts — calculees, pas estimees). Russie : centroide brut pointe tres au nord (Siberie,
// lat ~66) car le pays est enorme — on cadre plutot sur Moscou (lon 37.6, lat 55.7, deja utilise
// dans le proto original) pour un pivot visuellement coherent avec "la Russie" comme acteur/capitale.
//
// Chaque frame ci-dessous vient de BEATS dans ../timing.ts (aucune valeur inventee). Le tracé d'un
// pays commence a sa frame de pivot POSE (camEnd) et finit a la frame de sa PROCHAINE mention (le
// pays reste visible/trace jusqu'a l'etape suivante). Emirats et Egypte reapparaissent au Mouvement B
// (2e mention) : arcDepuis pointe alors vers l'INDEX de la meme paire pays/etape precedente si on
// veut un arc de rappel, mais PAS de nouveau trace (deja dessine) — gere via `dejaTraceDepuis`.
const ETAPES: Etape[] = [
  // ── MOUVEMENT A ──
  // 1. LE SOUDAN (sujet) — deja cadre des l'ouverture, se dessine sans pivot (camIn=camEnd=0).
  { nom: "Soudan", pays: "Sudan", lonLat: [29.8, 16.0], camIn: 0, camEnd: 0, traceEnd: BEATS.darfour_2e_mention.frame },
  // 2. LES EMIRATS (1ere mention, route de l'or) — pivot depuis le Soudan, tracé, arc Soudan->Emirats.
  { nom: "Emirats (or)", pays: "United Arab Emirates", lonLat: [54.2, 23.9], camIn: BEATS.darfour_2e_mention.frame, camEnd: BEATS.emirats_1ere_mention.frame, traceEnd: BEATS.egypte_1ere_mention.frame, arcDepuis: 0 },
  // 3. L'EGYPTE (1ere mention, 2e circuit de l'or via l'armee reguliere) — pivot, tracé, arc Soudan->Egypte.
  { nom: "Egypte (or)", pays: "Egypt", lonLat: [29.9, 26.5], camIn: BEATS.emirats_1ere_mention.frame, camEnd: BEATS.egypte_1ere_mention.frame, traceEnd: BEATS.front_fin_mouvementA.frame, arcDepuis: 0 },

  // ── MOUVEMENT B (apres pause1 + pivot narratif) ──
  // 4. LA RUSSIE (1ere des 4 puissances) — pivot loin depuis l'Egypte, tracé, arc Soudan->Russie.
  { nom: "Russie", pays: "Russia", lonLat: [37.6, 55.7], camIn: BEATS.autour_soudan_debut_B.frame, camEnd: BEATS.russie_1ere_mention.frame, traceEnd: BEATS.turquie_mention.frame, arcDepuis: 0 },
  // 5. LA TURQUIE (2e puissance) — pivot, tracé, arc Soudan->Turquie.
  { nom: "Turquie", pays: "Turkey", lonLat: [35.1, 39.1], camIn: BEATS.russie_1ere_mention.frame, camEnd: BEATS.turquie_mention.frame, traceEnd: BEATS.egypte_2e_mention.frame, arcDepuis: 0 },
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
  // ⭐ CORRECTION heritee du proto original : ouverture SERREE sur le Soudan (scale eleve) puis RECUL
  // progressif a mesure que le reseau s'etend — le dezoom raconte l'elargissement du propos. Format
  // 9:16 : le globe est plus HAUT que large dans le cadre (H=1920 > W=1080), donc GLOBE_R (calcule sur
  // H) est deja genereux — les memes echelles relatives (2.05 -> 1.16) restent valables en proportion.
  //
  // Les frames de chaque KEY viennent directement des memes bornes que ETAPES/RE_MENTIONS ci-dessus
  // (camIn/camEnd/traceEnd) — zero valeur inventee. Duree totale = GLOBE_RECIT_FRAMES (~2681f, ~89.4s),
  // tres different des 330f du proto de demo original : le dezoom est donc etale sur un temps bien
  // plus long, avec plus de paliers intermediaires (6 pays vs 3 dans la demo).
  const cam = useMemo(() => {
    const KEYS = [
      { f: 0, lon: 29.8, lat: 16.0, s: 2.05 }, // serre sur le Soudan : il remplit le cadre
      { f: ETAPES[0].traceEnd, lon: 29.8, lat: 16.0, s: 2.05 }, // pose pendant le trace Soudan
      { f: ETAPES[1].camEnd, lon: 54.2, lat: 23.9, s: 1.70 }, // pivot vers Emirats + recul (Soudan+Emirats tiennent)
      { f: ETAPES[1].traceEnd, lon: 54.2, lat: 23.9, s: 1.70 }, // pose pendant le trace Emirats
      { f: ETAPES[2].camEnd, lon: 40.0, lat: 22.0, s: 1.48 }, // pivot vers Egypte (cadrage median Soudan/Emirats/Egypte) + recul
      { f: ETAPES[2].traceEnd, lon: 40.0, lat: 22.0, s: 1.48 }, // pose pendant le trace Egypte = fin Mouvement A
      { f: ETAPES[3].camEnd, lon: 37.6, lat: 55.7, s: 1.15 }, // pivot loin vers la Russie (Moscou) + recul fort
      { f: ETAPES[3].traceEnd, lon: 37.6, lat: 55.7, s: 1.15 }, // pose pendant le trace Russie
      { f: ETAPES[4].camEnd, lon: 35.1, lat: 39.1, s: 1.08 }, // pivot vers la Turquie + recul (les 4 puissances doivent tenir)
      { f: ETAPES[4].traceEnd, lon: 35.1, lat: 39.1, s: 1.08 }, // pose pendant le trace Turquie
      { f: RE_MENTIONS[0].camEnd, lon: 29.9, lat: 26.5, s: 1.08 }, // re-pivot Egypte (highlight, deja trace)
      { f: RE_MENTIONS[1].camEnd, lon: 42.0, lat: 30.0, s: 1.00 }, // re-pivot Emirats + dezoom final : les 5 pays + Soudan tiennent
      { f: GLOBE_RECIT_FRAMES, lon: 42.0, lat: 30.0, s: 1.00 }, // pose final : le climax "incendie/main" tient sans mouvement
    ];
    let k = 0;
    while (k < KEYS.length - 2 && frame >= KEYS[k + 1].f) k++;
    const a = KEYS[k], b = KEYS[k + 1];
    const p = interpolate(frame, [a.f, b.f], [0, 1], { ...clampB, easing: easeInOut });
    return {
      lon: a.lon + (b.lon - a.lon) * p,
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

        <g opacity={globeIn}>
          {/* ⭐ LE GLOBE EST LÀ DÈS LE DÉPART (retour Aziz) : sphère + océan, PAS de graticule. */}
          <path d={sphereD} fill="url(#grOcean)" stroke={t.sphereStroke} strokeWidth={1.2} strokeOpacity={0.5} />

          <g clipPath="url(#grClip)">
            {/* le reste du monde, très discret, tout à la fin */}
            {autresPays.map((d, i) => (
              <path key={`w${i}`} d={d} fill={t.land} fillOpacity={mondeFade * 0.55}
                stroke={t.landStroke} strokeWidth={0.4} strokeOpacity={mondeFade} />
            ))}

            {/* ── LES ARCS : la ligne qui relie, tracée APRÈS que le pays soit dessiné ── */}
            {ETAPES.map((e, i) => {
              if (e.arcDepuis === undefined) return null;
              const from = ETAPES[e.arcDepuis];
              const reveal = interpolate(frame, [e.traceEnd - 12, e.traceEnd + 26], [0, 1], { ...clampB, easing: easeInOut });
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

            {/* ── LES PAYS : chacun se dessine quand le récit le convoque ── */}
            {feats.map(({ etape, feat }, i) => {
              if (!feat) return null;
              const d = path(feat as any);
              if (!d) return null; // face cachée
              const trace = interpolate(frame, [etape.camEnd, etape.traceEnd], [0, 1], { ...clampB, easing: easeOut });
              const fill = interpolate(frame, [etape.traceEnd - 18, etape.traceEnd + 16], [0, 1], { ...clampB, easing: easeInOut });
              // le Soudan (sujet) garde sa teinte claire du registre ; les autres sont kaki
              const col = etape.pays === "Sudan" ? t.sudanFill : t.land;
              // le trait garde une épaisseur PERÇUE constante malgré le dézoom (sinon il maigrit
              // au fur et à mesure qu'on recule et le geste de tracé se perd)
              const w = (etape.pays === "Sudan" ? 2.1 : 1.8) / Math.max(0.85, cam.s * 0.62);
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
