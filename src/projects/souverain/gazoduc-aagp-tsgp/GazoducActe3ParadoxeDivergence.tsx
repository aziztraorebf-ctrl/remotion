// MOTEUR: carte Mapbox/D3 — le paradoxe est SPATIAL (deux tracés sur le même territoire divergent
// d'état), donc il se dit sur la carte, pas dans un dispositif abstrait. Registre déjà porté par les
// Segments A/B de l'Acte 3 : on reste dans la continuité cartographique au lieu de couper vers un
// split-screen à jauges.
//
// GazoducActe3ParadoxeDivergence — Acte 3, SEGMENT C, OPTION B (2026-08-17).
//
// ⚠️ CE FICHIER EST UNE OPTION SOUMISE À ARBITRAGE, PAS UN REMPLACEMENT ACTÉ.
// Option A = `GazoducActe3InsertParadoxe.tsx` (split-screen 2 fenêtres + 4 barres d'indicateurs,
// refondu v3 après 3 DA-briefs unanimes le 2026-08-07). Option B = ce fichier.
// Les deux disent le MÊME paradoxe par deux moyens opposés :
//   A — des JAUGES ÉTIQUETÉES qui expliquent ("SÉCURITÉ · PACIFIÉ", "FINANCEMENT · SUSPENDU"...)
//   B — l'ÉTAT DES LIGNES qui montre (Maroc doré continu et stable / Algérie rouge cassé + boucliers)
// Aziz tranche au rendu comparatif. Ne PAS supprimer l'option A avant sa décision.
//
// Source : memory/episodes/souverain/gazoduc-aagp-tsgp/breakdown-v5-json/beat4-breakdown.json.
// Le breakdown V5 dimensionne ce beat sur 15.2s en temps RELATIF (aucun timecode absolu, jamais calé
// sur l'audio) — il est ici recalé sur BEATS_C (Segment C réel, 17.57s), dont le texte narré est
// précisément "Le Maroc mise sur... / L'Algérie mise sur... zone de conflit."
//
// ⛔ 2 CONTRAINTES DU V5 RESPECTÉES ICI, à ne pas défaire :
//  1. `final_no_text_contrast_hold` — aucun texte explicatif en fin de beat : "le contraste doit être
//     lisible sans explication textuelle finale". C'est pourquoi il n'y a AUCUNE étiquette de statut.
//     Les labels "PACIFIÉ"/"ZONE ACTIVE" du code v3 rejeté ne viennent d'aucun breakdown (vérifié :
//     0 occurrence dans beat3 ET beat4 JSON) — ils ne sont pas repris.
//  2. `continuity.cut: false` — les 2 tracés sont DÉJÀ visibles au premier frame, la caméra est déjà
//     en mouvement. Pas de fondu d'ouverture, pas de reveal : on est dans la continuité du Segment B.
//
// Palette sombre PAL_GPT (Acte 4 et la suite). ⚠️ Les Actes 1/2/3 se re-rendent en PAL_GPT à la passe
// finale d'assemblage, PAS acte par acte — ce fichier l'adopte parce qu'il est comparé aux Actes 4/5.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import geoData from "../../_rnd/d3-16x9/gazoducGeoElargie.json";
import { BEATS_C, GAZODUC_A3_INSERT_PARADOXE_FRAMES } from "./GazoducActe3Timing";

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * FPS);
const B = BEATS_C;

// ===== Palette sombre PAL_GPT (source : src/projects/_rnd/d3-16x9/ProtoCartePaletteGPT.tsx) =====
const BG_TOP = "#0d1f38";
const BG_BOT = "#050c1a";
const LAND = "#16304f";
const LAND_STROKE = "#58809f";
const GOLD = "#FFC742";
const GOLD_HI = "#FFE38A";
const CYAN = "#00C4FF";
const RED_CONFLICT = "#FF4B45";

type CountryGeo = { name: string; d: string };
const countries = geoData.countries as CountryGeo[];
const byName = (name: string) => countries.find((c) => c.name === name);

const AAGP_NAMES = [
  "Nigeria", "Benin", "Togo", "Ghana", "Côte d'Ivoire", "Liberia", "Sierra Leone",
  "Guinea", "Guinea-Bissau", "Gambia", "Senegal", "Mauritania", "Morocco",
] as const;
const TSGP_NAMES = ["Nigeria", "Niger", "Algeria"] as const;
const aagpCountries = AAGP_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c);
const tsgpCountries = TSGP_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c);

function bboxCentroid(d: string): [number, number] {
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}

function ctrlOf(a: [number, number], b: [number, number], bendPerp: number): [number, number] {
  const mx = a[0] + (b[0] - a[0]) * 0.5, my = a[1] + (b[1] - a[1]) * 0.5;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return [mx + (-dy / len) * bendPerp, my + (dx / len) * bendPerp];
}
function quadD(a: [number, number], ctrl: [number, number], b: [number, number]): string {
  return `M ${a[0]} ${a[1]} Q ${ctrl[0]} ${ctrl[1]} ${b[0]} ${b[1]}`;
}
function quadPt(a: [number, number], ctrl: [number, number], b: [number, number], t: number): [number, number] {
  const x = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ctrl[0] + t * t * b[0];
  const y = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ctrl[1] + t * t * b[1];
  return [x, y];
}

// Mêmes jalons/courbures que GazoducActe3InsertParadoxe.tsx (géométrie déjà validée) — on ne
// réinvente pas le tracé, on ne change QUE la façon dont il raconte son état.
//
// ⚠️ CORRECTIF (2026-08-17) : les jalons sont des CENTROÏDES de pays, donc le tracé s'arrêtait au
// milieu de l'Algérie / du Maroc, en plein désert, au lieu d'atteindre la côte — un gazoduc qui
// s'arrête en l'air ne dit rien. Défaut HÉRITÉ, présent aussi dans GazoducActe3CarteTSGP.tsx (les
// deux fichiers construisent leurs jalons de la même façon) : à corriger là-bas aussi, hors périmètre
// de cet arbitrage. Ici on prolonge les 2 tracés jusqu'à un point d'arrivée côtier réel, dérivé de la
// bbox du pays terminal (bord NORD = façade méditerranéenne), jamais dessiné à main levée.
function bboxOf(d: string): [number, number, number, number] {
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return [minX, minY, maxX, maxY];
}
// Point d'arrivée côtier : X = centroïde du pays (on reste dans son territoire), Y = bord nord de sa
// bbox (la côte). Léger retrait (+6%) pour que le trait meure SUR la terre, pas dans la mer.
function coastalOutlet(country: CountryGeo): [number, number] {
  const [, minY, , maxY] = bboxOf(country.d);
  const [cx] = bboxCentroid(country.d);
  return [cx, minY + (maxY - minY) * 0.06];
}
const morocco = byName("Morocco") as CountryGeo;
const algeria = byName("Algeria") as CountryGeo;

const aagpJalons: [number, number][] = [
  ...aagpCountries.map((c) => bboxCentroid(c.d)),
  coastalOutlet(morocco),
];
const tsgpJalons: [number, number][] = [
  ...tsgpCountries.map((c) => bboxCentroid(c.d)),
  coastalOutlet(algeria),
];
const aagpSegs = aagpJalons.slice(0, -1).map((a, i) => {
  const b2 = aagpJalons[i + 1];
  const ctrl = ctrlOf(a, b2, -18);
  return { d: quadD(a, ctrl, b2), a, ctrl, b: b2 };
});
const tsgpSegs = tsgpJalons.slice(0, -1).map((a, i, arr) => {
  const b2 = tsgpJalons[i + 1];
  // Le dernier segment est la remontée centroïde-Algérie -> côte : quasi droite (bend 3), sinon le
  // prolongement côtier ajoute un crochet parasite à l'arrivée.
  const isOutlet = i === arr.length - 1;
  const ctrl = ctrlOf(a, b2, isOutlet ? 3 : 14);
  return { d: quadD(a, ctrl, b2), a, ctrl, b: b2 };
});

// Points de conflit le long du segment algérien (Niger -> Algérie), en fraction du dernier segment.
// Le V5 place 4 boucliers ; on les échelonne en stagger 0.16s comme spécifié.
const SHIELD_TS = [0.28, 0.48, 0.68, 0.86];

// ===== deathFlicker déterministe (principe repris de GazoducActe3InsertSecurite.tsx) — vacillement
// organique, JAMAIS un fondu linéaire (exigence explicite du V5 : "jamais fondu linéaire"). =====
function hash01(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function deathFlicker(frame: number, seed: number, intensity: number, decay: number): number {
  const t = Math.max(0, frame);
  const env = Math.exp(-decay * (t / FPS));
  const n1 = hash01(Math.floor(t * 0.9) + seed);
  const n2 = hash01(Math.floor(t * 2.3) + seed * 7);
  const flick = 0.5 + 0.5 * Math.sin(t * 0.55 + n1 * 6.28);
  const spike = n2 > 0.86 ? 1 : 0;
  return Math.max(0, Math.min(1, 1 - intensity * env * (1 - flick * 0.55) + spike * 0.18 * env));
}

// ===== Caméra : push-in continu, jamais figée (V5 : "end_hold_not_static"). Cadrage large sur les
// DEUX tracés — le paradoxe exige de voir les deux à la fois, c'est tout l'intérêt vs le split. =====
const ALL_PTS = [...aagpJalons, ...tsgpJalons];
const CAM_MIN_X = Math.min(...ALL_PTS.map((p) => p[0]));
const CAM_MAX_X = Math.max(...ALL_PTS.map((p) => p[0]));
const CAM_MIN_Y = Math.min(...ALL_PTS.map((p) => p[1]));
const CAM_MAX_Y = Math.max(...ALL_PTS.map((p) => p[1]));
const CAM_CX = (CAM_MIN_X + CAM_MAX_X) / 2;
const CAM_CY = (CAM_MIN_Y + CAM_MAX_Y) / 2;
// Cadrage : marge 1.22 autour des tracés (1.45 était trop lâche — l'Algérie finissait dans un coin ;
// 1.12 était trop serré — les 2 arrivées côtières sortaient de l'écran une fois le push-in appliqué).
// ⚠️ La marge doit absorber le zoom final (camZoom 1.2), sinon le haut des tracés se fait couper.
const CAM_SPAN_X = (CAM_MAX_X - CAM_MIN_X) * 1.22;
const CAM_SPAN_Y = (CAM_MAX_Y - CAM_MIN_Y) * 1.22;
const CAM_BASE_SCALE = Math.min(W / CAM_SPAN_X, H / CAM_SPAN_Y);

const Bouclier: React.FC<{ x: number; y: number; opacity: number; frame: number }> = ({ x, y, opacity, frame }) => {
  if (opacity <= 0.01) return null;
  // Pulsation légère et IRRÉGULIÈRE (V5 : "léger seulement sur glow, pas extinction complète").
  const g = 0.75 + 0.25 * deathFlicker(frame, 4192, 0.35, 0.08);
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <path d="M 0 -15 L 13 -9 L 13 3 Q 13 13 0 18 Q -13 13 -13 3 L -13 -9 Z"
        fill={RED_CONFLICT} fillOpacity={0.16 * g} stroke={RED_CONFLICT} strokeOpacity={0.9 * g}
        strokeWidth={2} strokeLinejoin="round" />
      <path d="M 0 -7 L 0 6" stroke={RED_CONFLICT} strokeOpacity={0.95 * g} strokeWidth={2.2} strokeLinecap="round" />
    </g>
  );
};

export const GazoducActe3ParadoxeDivergence: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== Caméra : push-in lent et continu (V5 panel 01->03, zoom 1.18 -> 1.58) =====
  // Push-in volontairement FAIBLE (1.0 -> 1.08) : le beat doit garder les DEUX arrivées côtières
  // visibles de bout en bout — c'est la comparaison qui porte le sens. Un zoom plus ample coupait le
  // haut des tracés (constaté au rendu). La non-immobilité vient d'abord de la dérive, pas du zoom.
  const camZoom = interpolate(
    frame,
    [0, B.marocPhraseEnd, B.segEnd],
    [1.0, 1.04, 1.08],
    { ...clampB, easing: (t) => t * t * (3 - 2 * t) },
  );
  // Dérive douce vers l'est (le regard part du Maroc et glisse vers l'Algérie au fil du texte).
  const camDriftX = interpolate(frame, [0, B.segEnd], [18, -24], clampB);
  const camDriftY = interpolate(frame, [0, B.segEnd], [7, -10], clampB);
  const scale = CAM_BASE_SCALE * camZoom;
  const tx = W / 2 - CAM_CX * scale + camDriftX;
  const ty = H / 2 - CAM_CY * scale + camDriftY;

  // ===== PHASE MAROC (0 -> ~6.8s) : le tracé doré se RENFORCE, propre et continu. =====
  // "mise sur un tracé pacifié" -> sweep de renfort sud->nord ; "mais accord suspendu" -> la ligne
  // ne casse PAS (c'est la sécurité qui est en jeu, pas le tuyau), elle se stabilise.
  const marocBoost = interpolate(frame, [B.marocStart, B.marocPacifieEnd], [0.22, 1], clampB);
  const marocSweep = interpolate(frame, [B.marocStart, B.marocPacifieEnd + S(0.6)], [0, 1], clampB);
  // Pulsation PARFAITEMENT régulière (V5 : "stability_pulse régulier, non anxiogène") — c'est le
  // contraste avec le vacillement algérien qui porte tout le sens.
  const marocPulse = 0.86 + 0.14 * Math.sin((2 * Math.PI * frame) / 54);

  // ===== PHASE ALGÉRIE (7.86s -> fin) : le tracé cyan vire au rouge cassé. =====
  const algStart = B.algerieStart;
  const algLocal = frame - algStart;
  // 1) cyan -> doré d'alerte -> rouge, par étapes (V5 phase_1 puis phase_2 deathFlicker).
  const toWarn = interpolate(frame, [algStart, algStart + S(0.9)], [0, 1], clampB);
  const toRed = interpolate(frame, [algStart + S(0.9), algStart + S(2.1)], [0, 1], clampB);
  // 2) deathFlicker sur l'opacité du sous-jacent cyan (1.0 -> 0.18, vacillement irrégulier).
  const cyanUnder = algLocal > 0
    ? interpolate(deathFlicker(algLocal, 7319, 0.92, 0.18), [0, 1], [0.18, 1], clampB)
    : 1;
  // 3) après bascule : trait ROUGE CASSÉ (dasharray "12 7" + jitter lent, V5 phase_3).
  const jitter = Math.sin(frame * 0.21) * 2.4 + Math.sin(frame * 0.07) * 1.6;
  const redGlow = 0.55 + 0.45 * deathFlicker(frame, 1177, 0.5, 0.02);

  const shieldsBase = algStart + S(2.4);

  // Les boucliers se posent sur la TRAVERSÉE Niger->Algérie (avant-dernier segment), pas sur le
  // court exutoire côtier ajouté ensuite — sinon les 4 se tassent sur quelques pixels.
  const lastTsgp = tsgpSegs[Math.max(0, tsgpSegs.length - 2)];

  return (
    <AbsoluteFill style={{ background: BG_BOT }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="pdxBg" cx="50%" cy="46%" r="74%">
            <stop offset="0%" stopColor={BG_TOP} />
            <stop offset="100%" stopColor={BG_BOT} />
          </radialGradient>
          <filter id="pdxGoldGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={GOLD} floodOpacity="0.55" />
          </filter>
          <filter id="pdxRedGlow" x="-45%" y="-45%" width="190%" height="190%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={RED_CONFLICT} floodOpacity="0.6" />
          </filter>
        </defs>
        <rect width={W} height={H} fill="url(#pdxBg)" />

        <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
          {/* Fond continental — inactif, discret (PAL_GPT). */}
          {countries.map((c, i) => (
            <path key={`land-${i}`} d={c.d} fill={LAND} fillOpacity={0.92}
              stroke={LAND_STROKE} strokeOpacity={0.72} strokeWidth={0.75 / scale} />
          ))}

          {/* ===== TRACÉ AAGP (Maroc) — doré, CONTINU, stable. Aucun pointillé : c'est la ligne
                  qui ne casse pas. Le renfort passe par un sweep de sur-brillance sud->nord. ===== */}
          {aagpSegs.map((s, i) => {
            const segT = aagpSegs.length > 1 ? i / (aagpSegs.length - 1) : 1;
            const lit = interpolate(marocSweep, [Math.max(0, segT - 0.22), segT + 0.06], [0, 1], clampB);
            return (
              <g key={`aagp-${i}`}>
                <path d={s.d} fill="none" stroke={GOLD} strokeWidth={3.4 / scale}
                  strokeOpacity={(0.3 + 0.62 * marocBoost) * marocPulse} strokeLinecap="round"
                  filter="url(#pdxGoldGlow)" />
                {lit > 0.01 && (
                  <path d={s.d} fill="none" stroke={GOLD_HI} strokeWidth={5.2 / scale}
                    strokeOpacity={0.5 * lit * marocPulse} strokeLinecap="round" />
                )}
              </g>
            );
          })}

          {/* ===== TRACÉ TSGP (Algérie) — cyan qui vire au ROUGE CASSÉ. ===== */}
          {tsgpSegs.map((s, i) => {
            // Zone de conflit = la traversée Niger -> Algérie ET la remontée vers la côte (les 2
            // derniers segments depuis l'ajout de l'exutoire côtier), pas seulement le tout dernier.
            const isLast = i >= tsgpSegs.length - 2;
            const warnT = isLast ? toWarn : toWarn * 0.35;
            const redT = isLast ? toRed : toRed * 0.25;
            return (
              <g key={`tsgp-${i}`}>
                {/* sous-jacent cyan qui s'éteint par vacillement */}
                <path d={s.d} fill="none" stroke={CYAN} strokeWidth={3.2 / scale}
                  strokeOpacity={0.72 * cyanUnder * (1 - redT * 0.85)} strokeLinecap="round" />
                {/* couche d'alerte dorée transitoire */}
                {warnT > 0.01 && redT < 0.99 && (
                  <path d={s.d} fill="none" stroke={GOLD} strokeWidth={3.4 / scale}
                    strokeOpacity={0.8 * warnT * (1 - redT)} strokeLinecap="round" />
                )}
                {/* couche finale rouge CASSÉE — dasharray + jitter lent (V5 phase_3) */}
                {redT > 0.01 && (
                  <path d={s.d} fill="none" stroke={RED_CONFLICT} strokeWidth={3.6 / scale}
                    strokeOpacity={0.95 * redT * redGlow} strokeLinecap="round"
                    strokeDasharray={`${12 / scale} ${7 / scale}`}
                    strokeDashoffset={jitter / scale}
                    filter={isLast ? "url(#pdxRedGlow)" : undefined} />
                )}
              </g>
            );
          })}

          {/* ===== Boucliers le long du segment algérien — stagger 0.16s (V5). ===== */}
          {lastTsgp && SHIELD_TS.map((t, i) => {
            const appear = shieldsBase + Math.round(i * 0.16 * FPS);
            const op = interpolate(frame, [appear, appear + S(0.32)], [0, 1], clampB);
            const [sx, sy] = quadPt(lastTsgp.a, lastTsgp.ctrl, lastTsgp.b, t);
            return (
              <g key={`shield-${i}`} transform={`translate(${sx} ${sy}) scale(${1 / scale})`}>
                <Bouclier x={0} y={0} opacity={op} frame={frame} />
              </g>
            );
          })}
        </g>

        {/* Vignette finale — se resserre lentement (V5 : 0.16 -> 0.48). */}
        <rect width={W} height={H} fill="url(#pdxVig)" opacity={0} />
      </svg>

      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 100%)",
        opacity: interpolate(frame, [0, B.algerieStart, B.segEnd], [0.16, 0.34, 0.48], clampB),
      }} />
    </AbsoluteFill>
  );
};

export const GAZODUC_A3_PARADOXE_DIVERGENCE_FRAMES = GAZODUC_A3_INSERT_PARADOXE_FRAMES;

export default GazoducActe3ParadoxeDivergence;
