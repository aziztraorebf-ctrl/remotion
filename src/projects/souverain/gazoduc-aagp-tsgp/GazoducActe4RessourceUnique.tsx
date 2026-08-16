// GazoducActe4RessourceUnique — Acte 4, MOUVEMENT A : "une ressource, deux tuyaux" (41.1s).
//
// Storyboard VERROUILLE par Aziz (2026-08-15) — image de reference :
//   memory/episodes/_rnd/kora-cartes-mythologie/tests-visuels/gazoduc-carte-storyboard-ref/
//   acte4-4A/4A-v2-gpt.png
// Breakdown technique : memory/episodes/souverain/gazoduc-aagp-tsgp/breakdown-acte4/4A-breakdown.json
//
// Les 3 etats verrouilles :
//   1. OUVERTURE = panneau 1 du storyboard + le vocabulaire d'animation du panneau 3 (choix Aziz :
//      "les fleches sont vraiment vivantes [...] le pulse, on l'applique sur l'ouverture").
//      => impulsions qui circulent sur les 2 traces + source Nigeria qui pulse.
//   2. PIC = panneau 2 (rupture de forme) : insert coupe de conduite ancre a la source, voile 0.40,
//      "~70%" = LE SEUL chiffre de tout le beat, affiche une seule fois.
//   3. VERDICT = panneau 4 : sobre, AUCUN insert, carte durablement affaiblie (la sobriete du verdict
//      n'existe QUE par contraste avec le pic — raison explicite du choix d'Aziz).
//
// ⛔ DISCIPLINE DE FORME (retour Aziz 2026-08-15, cause racine d'un 1er storyboard rate) : la CARTE
// porte le beat. UN SEUL insert dans tout le mouvement, au pic. Pas d'empilement de panneaux de texte,
// pas de widget de bord. Tout ce qui n'est pas la carte est ancre a un point geo ou centre sur carte
// assombrie.
//
// Briques REUTILISEES (jamais recodees) : camFor/lerpCam + geo gazoducGeoElargie + palette de
// GazoducActe3CarteTSGP.tsx ; pattern insert video (<Loop> + <OffthreadVideo>) du prototype valide
// GazoducH3IntegrationTestReal.tsx ; asset clip validé conduite-gaz-r2v-v1.mp4.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Loop, OffthreadVideo, staticFile } from "remotion";
import geoData from "../../_rnd/d3-16x9/gazoducGeoElargie.json";
import { BEATS_4A, GAZODUC_A4_SEGA_FRAMES } from "./GazoducActe4Timing";

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);

// ⭐ PALETTE SOMBRE (adoptee par Aziz 2026-08-15, dérivée du storyboard GPT de l'Acte 4).
// Source de verite : src/projects/_rnd/d3-16x9/ProtoCartePaletteGPT.tsx -> PAL_GPT.
// 5 differences avec l'ancienne palette de serie : fond bien plus sombre · degrade RADIAL (concentre
// le regard au centre au lieu d'un dessus/dessous neutre) · pays inactifs discrets · frontieres fines
// et sombres · pays actifs qui ressortent par la luminance.
// ⚠️ Portee : Acte 4 ET LA SUITE. Les Actes 1/2/3 restent en palette claire — leur re-render se fait
// a la passe finale d'assemblage (cf POLISH-TODO-FINAL-RENDER.md), PAS acte par acte.
const BG_TOP = "#0d1f38";
const BG_BOT = "#050c1a";
const LAND = "#16304f";
const LAND_STROKE = "#58809f";
const GOLD = "#FFC742";
const CYAN = "#00C4FF";
const RED_WARN = "#ff5a3c";

type CountryGeo = { name: string; d: string };
const countries = geoData.countries as CountryGeo[];
const byName = (name: string) => countries.find((c) => c.name === name);

function bboxCentroid(d: string): [number, number] {
  const nums = d.match(/-?\d+(\.\d+)?/g);
  if (!nums) return [W / 2, H / 2];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = parseFloat(nums[i]), y = parseFloat(nums[i + 1]);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}

function ctrlOf(a: [number, number], b: [number, number], perp: number, t: number): [number, number] {
  const mx = a[0] + (b[0] - a[0]) * t, my = a[1] + (b[1] - a[1]) * t;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return [mx + (-dy / len) * perp, my + (dx / len) * perp];
}
function pointOnQuad(a: [number, number], c: [number, number], b: [number, number], t: number): [number, number] {
  const mt = 1 - t;
  return [mt * mt * a[0] + 2 * mt * t * c[0] + t * t * b[0], mt * mt * a[1] + 2 * mt * t * c[1] + t * t * b[1]];
}
function quadD(a: [number, number], c: [number, number], b: [number, number]): string {
  return `M ${a[0]} ${a[1]} Q ${c[0]} ${c[1]} ${b[0]} ${b[1]}`;
}
function buildSamples(jalons: [number, number][], bendPerp: number, perSeg = 48): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < jalons.length - 1; i++) {
    const a = jalons[i], b = jalons[i + 1];
    const c = ctrlOf(a, b, bendPerp, 0.5);
    for (let s = 0; s <= perSeg; s++) {
      if (i > 0 && s === 0) continue;
      pts.push(pointOnQuad(a, c, b, s / perSeg));
    }
  }
  return pts;
}
// Longueur totale d'une polyligne, calculee UNE fois par tableau de samples (cache module).
const polyLenCache = new WeakMap<[number, number][], number>();
function polyLen(samples: [number, number][]): number {
  const hit = polyLenCache.get(samples);
  if (hit !== undefined) return hit;
  let total = 0;
  for (let k = 1; k < samples.length; k++) {
    total += Math.hypot(samples[k][0] - samples[k - 1][0], samples[k][1] - samples[k - 1][1]);
  }
  polyLenCache.set(samples, total);
  return total;
}

// Position normalisee t (0..1) -> point sur la polyligne echantillonnee.
function pointAtT(samples: [number, number][], t: number): [number, number] {
  const clamped = Math.max(0, Math.min(1, t));
  const idx = clamped * (samples.length - 1);
  const i0 = Math.floor(idx), i1 = Math.min(samples.length - 1, i0 + 1);
  const f = idx - i0;
  return [samples[i0][0] + (samples[i1][0] - samples[i0][0]) * f, samples[i0][1] + (samples[i1][1] - samples[i0][1]) * f];
}

const NIGERIA = (geoData.centroids as unknown as Record<string, [number, number]>).Nigeria;

// ===== Les 2 traces rivaux — memes jalons que les Actes 2/3 (geo reelle, zero approximation) =====
const TSGP_NAMES = ["Nigeria", "Niger", "Algeria"] as const;
const tsgpJalons: [number, number][] = TSGP_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c).map((c) => bboxCentroid(c.d));
const tsgpD = tsgpJalons.slice(0, -1).map((a, i) => quadD(a, ctrlOf(a, tsgpJalons[i + 1], 14, 0.5), tsgpJalons[i + 1])).join(" ");
const tsgpSamples = buildSamples(tsgpJalons, 14, 60);

const AAGP_NAMES = [
  "Nigeria", "Benin", "Togo", "Ghana", "Côte d'Ivoire", "Liberia", "Sierra Leone",
  "Guinea", "Guinea-Bissau", "Gambia", "Senegal", "Mauritania", "Morocco",
] as const;
const aagpJalons: [number, number][] = AAGP_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c).map((c) => bboxCentroid(c.d));
const aagpD = aagpJalons.slice(0, -1).map((a, i) => quadD(a, ctrlOf(a, aagpJalons[i + 1], -18, 0.5), aagpJalons[i + 1])).join(" ");
const aagpSamples = buildSamples(aagpJalons, -18, 48);

// Pays labellises : 3 MAXIMUM (regle non-negociable). Ici Nigeria (source) + les 2 destinations.
const LABELLED = [
  { name: "Nigeria", label: "NIGERIA" },
  { name: "Morocco", label: "MAROC" },
  { name: "Algeria", label: "ALGÉRIE" },
] as const;

type Cam = { scale: number; tx: number; ty: number };
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function camFor(center: [number, number], scale: number): Cam {
  return { scale, tx: W / 2 - center[0] * scale, ty: H / 2 - center[1] * scale };
}
function lerpCam(a: Cam, b: Cam, t: number): Cam {
  return { scale: a.scale + (b.scale - a.scale) * t, tx: a.tx + (b.tx - a.tx) * t, ty: a.ty + (b.ty - a.ty) * t };
}

const B = BEATS_4A;

// ===== Cameras-cles — 4 mouvements, jamais un plan fixe (rien de statique > 5s).
// ⛔ Ces cameras sont interpolees en UNE trajectoire continue (voir camAt) : PAS d'easeInOut par
// segment, qui met la vitesse a exactement 0 a chaque point de passage (bug "camera par a-coups"
// diagnostique sur l'Acte 3 apres 3 iterations perdues — cf STATUS.md).
// ⭐ CADRAGE (gap n°1 du breakdown V2, severite HIGH) : la v1 etait a scale 1.02, ce qui laissait
// entrer l'Amerique du Sud et toute l'Afrique australe — tout paraissait petit et faible. Le cadre
// cible est l'Afrique du Nord-Ouest + Mediterranee SEULEMENT. Bornes derivees par calcul de la bbox
// projetee des pays qui DOIVENT etre visibles (Nigeria/Maroc/Algerie/Niger/Mali/Mauritanie/Senegal/
// Espagne/Libye/Tunisie + cote du golfe de Guinee), pas reglees a l'oeil : scale ~1.98, centre
// (821, 238) en espace projete.
const FRAME_CENTER: [number, number] = [821.3, 237.7];
const FRAME_SCALE = 1.98;
const camOpenWide = camFor(FRAME_CENTER, FRAME_SCALE);
const camSourceIn = camFor([FRAME_CENTER[0] + 26, FRAME_CENTER[1] + 44], FRAME_SCALE * 1.12);
// Pic : la source Nigeria doit RESTER VISIBLE a gauche pendant que l'insert occupe la droite —
// sinon le connecteur part dans le vide et l'insert cesse d'etre ancre geographiquement (defaut
// constate au 1er rendu). On decale le centre vers la DROITE pour pousser la carte a gauche.
const camPeak = camFor([FRAME_CENTER[0] + 210, FRAME_CENTER[1] + 40], FRAME_SCALE * 1.06);
// ⛔ Verdict : NE JAMAIS redezoomer vers un plan Afrique entiere ("no_later_zoom_out" du breakdown).
// On reste dans le meme cadre serre — ce qui change au verdict, c'est l'ENERGIE, pas l'echelle.
const camVerdict = camFor([FRAME_CENTER[0] - 8, FRAME_CENTER[1] + 10], FRAME_SCALE * 1.02);

type CamKey = { f: number; cam: Cam };
const CAM_KEYS: CamKey[] = [
  { f: 0, cam: camOpenWide },
  { f: B.nigeriaNaPasCapacite, cam: lerpCam(camOpenWide, camSourceIn, 0.55) },
  { f: B.silsVoyaient, cam: camSourceIn },
  { f: B.soixanteDixStart, cam: camPeak },
  { f: B.enClair, cam: camPeak },
  { f: B.seBattentPour, cam: lerpCam(camPeak, camVerdict, 0.6) },
  { f: B.segEnd, cam: camVerdict },
];
// Trajectoire CONTINUE : easing global sur la progression totale, jamais par segment.
function camAt(frame: number): Cam {
  if (frame <= CAM_KEYS[0].f) return CAM_KEYS[0].cam;
  const last = CAM_KEYS[CAM_KEYS.length - 1];
  if (frame >= last.f) return last.cam;
  let i = 0;
  while (i < CAM_KEYS.length - 1 && frame > CAM_KEYS[i + 1].f) i++;
  const a = CAM_KEYS[i], b = CAM_KEYS[i + 1];
  const raw = (frame - a.f) / Math.max(1, b.f - a.f);
  // Lissage doux SANS derivee nulle aux extremites : smoothstep attenue (0.25) plutot que easeInOut.
  const t = raw + 0.25 * (raw * raw * (3 - 2 * raw) - raw);
  return lerpCam(a.cam, b.cam, t);
}

// ===== Impulsions qui circulent le long d'un trace — LE geste central du beat.
// ⭐ V2 (gap "impulses_are_dots_not_directional_streaks", severite HIGH) : la v1 dessinait des CERCLES
// de rayon constant, qui lisent comme des billes timides et decoratives. Le storyboard montre des
// COMETES ORIENTEES — une trainee effilee alignee sur la tangente du trace, avec une tete chaude.
// 3 couches superposees (halo flou / median / coeur net) + tete blanche, exactement comme le
// breakdown V2 le specifie. C'est l'orientation le long du trajet qui cree la lecture directionnelle.
//
// Elles s'AFFAMENT : le nombre tombe, la vitesse ralentit, la trainee raccourcit, les ecarts
// s'elargissent — "ils tirent plus que ce que la source peut donner", sans aucun texte.
const Impulsions: React.FC<{
  samples: [number, number][]; frame: number; startF: number;
  count: number; speed: number; lengthMul: number; opacity: number; phase: number; camScale: number;
}> = ({ samples, frame, startF, count, speed, lengthMul, opacity, phase, camScale }) => {
  if (opacity <= 0.01 || count <= 0) return null;
  const local = Math.max(0, frame - startF);
  const out: React.ReactNode[] = [];
  const n = Math.max(1, Math.round(count));
  // Longueurs en px ECRAN (breakdown) -> divisees par camScale car dessinees dans le groupe camera.
  const L_OUT = (132 * lengthMul) / camScale;
  const L_MID = (104 * lengthMul) / camScale;
  const L_CORE = (76 * lengthMul) / camScale;
  for (let i = 0; i < n; i++) {
    const t = ((speed * local) + phase + i / n) % 1;
    const fadeIn = interpolate(t, [0.06, 0.14], [0, 1], clampB);
    const fadeOut = 1 - interpolate(t, [0.86, 0.96], [0, 1], clampB);
    const op = opacity * fadeIn * fadeOut;
    if (op <= 0.01) continue;
    const [hx, hy] = pointAtT(samples, t);
    // ⛔ La trainee doit SUIVRE la courbe du trace, pas la couper. Une tangente droite extrapolee
    // depuis la tete fait sortir la comete du trace des que celui-ci tourne sec — visible sur la
    // cote ouest (virages serres du golfe de Guinee), la trainee partait dans l'ocean.
    // On echantillonne donc la polyligne EN ARRIERE et on construit un polyline qui epouse la courbe.
    const tailPath = (lengthPx: number): string => {
      const steps = 10;
      // Conversion longueur-ecran -> delta-t via la longueur totale du trace (mise en cache au
      // niveau module : la recalculer par comete et par frame serait inutilement couteux).
      const dt = (lengthPx / Math.max(1, polyLen(samples)));
      const pts: string[] = [];
      for (let s = steps; s >= 0; s--) {
        const tt = Math.max(0, t - dt * (s / steps));
        const p = pointAtT(samples, tt);
        pts.push(`${p[0]} ${p[1]}`);
      }
      return `M ${pts.join(" L ")}`;
    };
    const tail = tailPath;
    // Orientation de la tete : tangente locale courte (suffisante pour une ellipse).
    const back = pointAtT(samples, Math.max(0, t - 0.004));
    const ux = hx - back[0], uy = hy - back[1];
    out.push(
      <g key={`imp-${i}`} opacity={op}>
        <path d={tail(L_OUT)} stroke="#FFC247" strokeOpacity={0.42} strokeWidth={18 / camScale}
          strokeLinecap="round" fill="none" filter="url(#a4-comet-soft)" />
        <path d={tail(L_MID)} stroke="#FFD45D" strokeOpacity={0.72} strokeWidth={10 / camScale}
          strokeLinecap="round" fill="none" filter="url(#a4-comet-mid)" />
        <path d={tail(L_CORE)} stroke="#FFF4C2" strokeOpacity={1} strokeWidth={3.5 / camScale}
          strokeLinecap="round" fill="none" />
        <ellipse cx={hx} cy={hy} rx={6 / camScale} ry={3.5 / camScale} fill="#FFFFFF" fillOpacity={0.95}
          transform={`rotate(${(Math.atan2(uy, ux) * 180) / Math.PI} ${hx} ${hy})`} filter="url(#a4-comet-mid)" />
      </g>,
    );
  }
  return <>{out}</>;
};

// ===== Source Nigeria qui pulse puis s'epuise (breakdown § b) — 4 couches concentriques.
// Elle ne s'eteint jamais : elle FAIBLIT et RALENTIT (periode 36f -> 54f), ce qui est plus juste
// narrativement qu'une extinction.
// ⭐ V2 (gap "nigeria_source_underpowered", HIGH) : la v1 etait un petit point cyan avec un halo
// modeste. Le storyboard montre un NOEUD D'ENERGIE dominant : 6 couches empilees (halo externe flou
// 78px -> coeur blanc 4px) + 3 anneaux d'onde dephases de 14 frames. Valeurs du breakdown V2.
// `weaken` (0->1) porte l'epuisement : les rayons se contractent et les opacites tombent, mais la
// source ne s'eteint JAMAIS — elle faiblit et ralentit.
const SourcePulse: React.FC<{
  x: number; y: number; frame: number; period: number; weaken: number; intensity: number; camScale: number;
}> = ({ x, y, frame, period, weaken, intensity, camScale }) => {
  if (intensity <= 0.01) return null;
  const k = 1 / camScale;
  const shrink = interpolate(weaken, [0, 1], [1, 0.55], clampB);
  const dim = interpolate(weaken, [0, 1], [1, 0.6], clampB);
  const breathe = 1 + 0.07 * Math.sin((2 * Math.PI * frame) / 54);
  const R = (px: number) => px * k * shrink * breathe;
  // 3 anneaux d'onde dephases — c'est ce qui donne la sensation de "source vivante qui emet".
  const rings = [0, 14, 28].map((off, i) => {
    const ph = (((frame + off) % period) + period) % period / period;
    const r = interpolate(ph, [0, 1], [24, 86], clampB) * k * shrink;
    const w = interpolate(ph, [0, 1], [3, 1], clampB) * k;
    const op = interpolate(ph, [0, 1], [0.5, 0], clampB) * intensity * dim;
    return <circle key={`ring-${i}`} cx={x} cy={y} r={r} fill="none" stroke="#24DFFF" strokeWidth={w} opacity={op} />;
  });
  return (
    <g>
      <circle cx={x} cy={y} r={R(78)} fill="#00CFFF" opacity={0.18 * intensity * dim} filter="url(#a4-src-soft)" />
      <circle cx={x} cy={y} r={R(48)} fill="#00D8FF" opacity={0.28 * intensity * dim} filter="url(#a4-src-mid)" />
      {rings}
      <circle cx={x} cy={y} r={R(28)} fill="none" stroke="#2DE6FF" strokeWidth={5 * k} opacity={0.85 * intensity * dim} filter="url(#a4-src-mid)" />
      <circle cx={x} cy={y} r={R(18)} fill="none" stroke="#9AF6FF" strokeWidth={2 * k} opacity={0.95 * intensity * dim} />
      <circle cx={x} cy={y} r={R(10)} fill="#031827" stroke="#62F0FF" strokeWidth={3 * k} opacity={intensity} />
      <circle cx={x} cy={y} r={R(4)} fill="#DFFFFF" opacity={0.95 * intensity} filter="url(#a4-src-mid)" />
    </g>
  );
};

export const GazoducActe4RessourceUnique: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const globalFadeIn = interpolate(frame, [0, S(0.5)], [0, 1], clampB);
  const globalFadeOut = interpolate(frame, [B.segEnd - S(0.3), B.segEnd], [1, 0], clampB);
  const cam = camAt(frame);
  const screenOf = (p: [number, number]): [number, number] => [p[0] * cam.scale + cam.tx, p[1] * cam.scale + cam.ty];

  // ===== OUVERTURE — les 2 traces se dessinent depuis le MEME point (storyboard panneau 1).
  // Ils partent ensemble : c'est ce qui les fait lire comme rivaux d'une meme source, pas comme
  // deux routes independantes.
  const traceDraw = interpolate(frame, [B.pourquoiPasLesDeux, B.surLePapier + S(1.4)], [0, 1], { ...clampB, easing: easeInOut });

  // ===== L'AFFAMEMENT — demarre sur le mot "capacite" (13.38s), pas avant : le visuel suit le sens.
  // s = 0 (plein debit) -> 1 (affame). Le pic et le verdict poussent plus loin.
  const starve = interpolate(frame, [B.capaciteMot, B.siphonneraient], [0, 1], clampB);
  const starvePeak = interpolate(frame, [B.siphonneraient, B.enClair], [0, 1], clampB);
  const starveVerdict = interpolate(frame, [B.enClair, B.ressourceLimiteeEnd], [0, 1], clampB);
  const starveTotal = Math.min(1, starve * 0.45 + starvePeak * 0.3 + starveVerdict * 0.25);

  // 6 cometes par trace a plein debit (breakdown V2), 2 a l'agonie. La TRAINEE raccourcit aussi :
  // une impulsion affamee est courte et lente, pas seulement rare.
  const impCount = interpolate(starveTotal, [0, 1], [6, 2], clampB);
  const impSpeed = interpolate(starveTotal, [0, 1], [0.0104, 0.0026], clampB);
  const impLength = interpolate(starveTotal, [0, 1], [1, 0.42], clampB);
  const impOpacity = interpolate(starveTotal, [0, 1], [0.95, 0.30], clampB) * interpolate(frame, [B.pourquoiPasLesDeux + S(0.6), B.surLePapier], [0, 1], clampB);

  // Source : pulse ample et rapide a l'ouverture, contracte et ralenti au verdict (jamais eteinte).
  const srcPeriod = interpolate(starveTotal, [0, 1], [42, 60], clampB);
  const srcIntensity = interpolate(frame, [0, S(1.6)], [0, 1], clampB);

  // ===== LE PIC — insert coupe de conduite (LE seul insert du beat).
  // Voile a 0.40 : l'insert se SUPERPOSE, il ne remplace pas la carte (regle INSERT MATIERE ;
  // ⛔ ne pas monter a 0.62, seuil reserve aux overlays qui remplacent la lecture de la carte).
  // ⭐ Gap "timeline_peak_and_verdict_beats_blurred" : en v1 l'insert tenait jusqu'a
  // `pasComplementaires` (30.5s), donc il empietait sur le verdict et ecrasait le 3e etat.
  // Il sort maintenant des la fin du silence post-climax (28.28s, "En clair"), ce qui laisse au
  // verdict ~13s de carte SEULE. C'est tout le principe du contraste : la sobriete du verdict
  // n'existe que si le pic a vraiment quitte l'ecran.
  const peakIn = B.presDe;
  const peakOut = B.enClair;
  const veil = interpolate(frame, [peakIn - S(1.2), peakIn, peakOut, peakOut + S(0.8)], [0, 0.40, 0.40, 0], clampB);
  const cardT = spring({ frame: frame - peakIn, fps, config: { damping: 18, stiffness: 130 } });
  const cardOut = interpolate(frame, [peakOut, peakOut + S(0.5)], [1, 0], clampB);
  const cardOpacity = (frame < peakOut ? cardT : cardT * cardOut);
  const cardScale = interpolate(cardT, [0, 1], [0.965, 1], clampB);
  const connectorDraw = interpolate(frame, [peakIn + S(0.2), peakIn + S(0.9)], [0, 1], clampB);
  // "~70%" — LE SEUL chiffre de tout le beat, cale sur le mot "SOIXANTE-DIX" (23.62s).
  const pctT = spring({ frame: frame - B.soixanteDixStart, fps, config: { damping: 16, stiffness: 150 } });
  const pctOpacity = interpolate(frame, [B.soixanteDixStart, B.soixanteDixStart + S(0.35), peakOut - S(0.3), peakOut], [0, 1, 1, 0], clampB);

  // Carte-insert : posee a droite, la source Nigeria reste visible a gauche (ancrage geographique).
  const CARD = { x: 1055, y: 292, w: 640, h: 372 };
  const [srcSX, srcSY] = screenOf(NIGERIA);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 72% 72% at 50% 46%, ${BG_TOP} 0%, ${BG_BOT} 100%)`, opacity: globalFadeIn * globalFadeOut }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="a4-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Bloom ambre des traces (gap "routes_too_thin_and_not_luminous_enough") : coeur chaud
              + halo large, pour qu'ils lisent comme une infrastructure sous pression, pas comme une
              annotation de carte. */}
          <filter id="a4-route-bloom" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="9" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="a4-comet-soft" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="a4-comet-mid" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="a4-src-soft" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id="a4-src-mid" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="12" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="a4-country-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
          {/* Fond de carte — pays neutres, jamais tous colores (hierarchie du regard). */}
          {countries.map((c, i) => (
            <path key={`land-${i}`} d={c.d} fill={LAND} fillOpacity={0.92}
              stroke={LAND_STROKE} strokeOpacity={0.72} strokeWidth={0.75} />
          ))}

          {/* ⭐ PAYS ACTIFS (gap "active_countries_missing", HIGH) — Nigeria/Maroc/Algerie remplis en
              bleu clair pour les detacher des pays neutres : ce sont les 3 acteurs strategiques du
              beat. Absents de la v1, alors que le storyboard les montre clairement. Au verdict le
              remplissage RETOMBE (0.46 -> 0.28) : la carte reste durablement affaiblie. */}
          {(() => {
            const revealCountry = interpolate(frame, [S(1.2), S(3.2)], [0, 1], clampB);
            if (revealCountry <= 0.01) return null;
            const fillOp = interpolate(starveVerdict, [0, 1], [0.46, 0.28], clampB) * revealCountry;
            const strokeOp = interpolate(starveVerdict, [0, 1], [0.38, 0.22], clampB) * revealCountry;
            return LABELLED.map(({ name }) => {
              const c = byName(name);
              if (!c) return null;
              const isSource = name === "Nigeria";
              return (
                <path key={`active-${name}`} d={c.d}
                  fill="#1EA7D7" fillOpacity={fillOp + (isSource ? 0.08 * revealCountry : 0)}
                  stroke="#53D7FF" strokeOpacity={strokeOp + (isSource ? 0.12 * revealCountry : 0)}
                  strokeWidth={1.5} filter="url(#a4-country-glow)" />
              );
            });
          })()}

          {/* Les 2 traces rivaux, dessines PROGRESSIVEMENT depuis le meme point.
              Au verdict ils s'assombrissent : la carte reste changee par ce qu'on vient de voir. */}
          {/* ⭐ TRACES (gaps "routes_too_thin_and_not_luminous_enough" + "verdict_not_permanently_
              weakened") : coeur chaud + halo ambre large, pour qu'ils lisent comme une infrastructure
              sous pression. Au VERDICT ils s'eteignent nettement (opacite 0.92 -> 0.42, halo coupe) —
              la v1 les laissait aussi vifs qu'a l'ouverture, ce qui annulait le contraste voulu. */}
          {(() => {
            const dim = interpolate(starveVerdict, [0, 1], [1, 0.46], clampB);
            const haloOp = interpolate(starveVerdict, [0, 1], [0.30, 0.05], clampB);
            const len = 4000;
            const wHalo = 9 / cam.scale;
            const wCore = 3.4 / cam.scale;
            const dash = { strokeDasharray: len, strokeDashoffset: len * (1 - traceDraw) };
            return (
              <>
                {[aagpD, tsgpD].map((d, i) => (
                  <g key={`route-${i}`}>
                    <path d={d} fill="none" stroke="#FFB020" strokeOpacity={haloOp} strokeWidth={wHalo}
                      strokeLinecap="round" filter="url(#a4-route-bloom)" {...dash} />
                    <path d={d} fill="none" stroke={GOLD} strokeOpacity={0.92 * dim} strokeWidth={wCore}
                      strokeLinecap="round" filter="url(#a4-glow)" {...dash} />
                  </g>
                ))}
              </>
            );
          })()}

          {/* ⭐ Les impulsions — le geste qui porte tout le beat. Elles circulent puis s'affament. */}
          <Impulsions samples={aagpSamples} frame={frame} startF={B.pourquoiPasLesDeux}
            count={impCount} speed={impSpeed} lengthMul={impLength} opacity={impOpacity}
            phase={0} camScale={cam.scale} />
          <Impulsions samples={tsgpSamples} frame={frame} startF={B.pourquoiPasLesDeux + S(0.2)}
            count={impCount} speed={impSpeed * 0.96} lengthMul={impLength} opacity={impOpacity}
            phase={0.045} camScale={cam.scale} />

          {/* La source unique — les deux tuyaux tirent dessus. */}
          <SourcePulse x={NIGERIA[0]} y={NIGERIA[1]} frame={frame} period={srcPeriod}
            weaken={starveTotal} intensity={srcIntensity} camScale={cam.scale} />
        </g>

        {/* Plaques pays — 3 MAXIMUM, en espace ecran pour rester lisibles malgre le zoom. */}
        {LABELLED.map(({ name, label }) => {
          const c = byName(name);
          if (!c) return null;
          const [px, py] = screenOf(bboxCentroid(c.d));
          const op = interpolate(frame, [B.hookStart, B.hookStart + S(1)], [0, 1], clampB)
            * interpolate(veil, [0, 0.4], [1, 0.35], clampB);
          if (op <= 0.02) return null;
          const wBox = label.length * 13 + 26;
          return (
            <g key={name} opacity={op} transform={`translate(${px} ${py - 46})`}>
              <rect x={-wBox / 2} y={-17} width={wBox} height={30} rx={4}
                fill="#0e192e" fillOpacity={0.92} stroke={CYAN} strokeWidth={1.4} />
              <text x={0} y={4} textAnchor="middle" fill="#e8ecf5" fontSize={17} fontWeight={700}
                fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.08em">{label}</text>
            </g>
          );
        })}

        {/* Voile du pic — la carte reste LISIBLE derriere (0.40, jamais 0.62). */}
        {veil > 0.005 && <rect x={0} y={0} width={W} height={H} fill="#050b20" opacity={veil} />}

        {/* Connecteur source -> carte insert : c'est ce qui rend l'insert ANCRE et non flottant. */}
        {cardOpacity > 0.01 && (() => {
          const x2 = CARD.x, y2 = CARD.y + CARD.h / 2;
          const d = `M ${srcSX} ${srcSY} L ${x2} ${y2}`;
          const len = Math.hypot(x2 - srcSX, y2 - srcSY);
          return (
            <g opacity={cardOpacity}>
              <path d={d} fill="none" stroke={CYAN} strokeWidth={1.6} strokeOpacity={0.75}
                strokeDasharray={len} strokeDashoffset={len * (1 - connectorDraw)} />
              <circle cx={srcSX} cy={srcSY} r={5} fill="none" stroke={CYAN} strokeWidth={1.6} opacity={0.9} />
            </g>
          );
        })()}
      </svg>

      {/* ===== L'INSERT DU PIC — coupe de conduite (asset valide, jamais regenere).
           Pattern repris tel quel du prototype valide GazoducH3IntegrationTestReal.tsx :
           <Loop> sous la duree reelle du clip (sinon la derniere frame gele en noir). ===== */}
      {cardOpacity > 0.01 && (
        <div style={{
          position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h,
          opacity: cardOpacity, transform: `scale(${cardScale})`, transformOrigin: "center center",
          background: "rgba(7, 24, 45, 0.96)", border: `2px solid ${CYAN}`, borderRadius: 8,
          boxShadow: "0 0 34px rgba(0,196,255,0.20)", overflow: "hidden",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18,
        }}>
          <div style={{
            color: "#AFC7D8", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
            letterSpacing: "0.14em", fontWeight: 700,
          }}>CONDUITE DE GAZ — COUPE</div>
          <div style={{ width: 510, height: 166, borderRadius: 6, overflow: "hidden", border: `1.5px solid rgba(0,196,255,0.45)` }}>
            {/* ⛔ ASSET : "conduite-vide", PAS "conduite-gaz". Le propos du beat est que le Nigeria
                ne PEUT PAS remplir les deux tuyaux — montrer une conduite pleine et bouillonnante
                est un contresens narratif (erreur commise au 1er rendu). Cet asset est celui que le
                registre INTENTION-FORME fleche explicitement pour "les 70% siphonnes".
                Clip conduite-vide mesure a 5.167s (ffprobe — NE PAS reprendre la duree d'un autre
                clip du meme dossier, elles different) : on boucle SOUS cette duree, jamais dessus,
                la derniere frame d'un clip H3 gele en noir si on l'atteint. */}
            <Loop durationInFrames={Math.floor(5.0 * FPS)}>
              <OffthreadVideo
                src={staticFile("_rnd/minimax-h3-tests/insert-matiere/conduite-vide-r2v-v1.mp4")}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                muted
              />
            </Loop>
          </div>
          {/* "~70%" : LE seul chiffre de tout le mouvement, une seule apparition. */}
          <div style={{
            opacity: pctOpacity, transform: `scale(${interpolate(pctT, [0, 1], [0.92, 1], clampB)})`,
            background: "#0e192e", border: `2px solid ${CYAN}`, borderRadius: 5,
            padding: "8px 22px", color: "#e8ecf5",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 34, fontWeight: 800, letterSpacing: "0.04em",
          }}>~70%</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const GAZODUC_A4_SEGA_FRAMES_EXPORT = GAZODUC_A4_SEGA_FRAMES;
export default GazoducActe4RessourceUnique;
