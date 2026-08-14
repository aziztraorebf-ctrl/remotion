// GazoducActe3InsertSecurite — Acte 3, SEGMENT B, scène-lieu "aéroport de Niamey", 965f/32.17s.
//
// V3 (2026-08-07) — REFONTE APRÈS VERDICT AZIZ sur le rendu v1/v2 : "un simple diaporama qui
// s'éteint" — 3 DA-briefs critiques (Gemini+Kimi+DeepSeek) convergents sur le fond (cf
// PLAN-ACTES2-5.md § CLIMAX SÉCURITÉ). Corrections V3 appliquées :
//   1. Extinction JAMAIS un fondu linéaire uniforme — chaque feu VACILLE (flicker rapide) avant de
//      s'éteindre, la tour meurt différemment (staccato décroissant), pas une cascade mécanique.
//   2. Chiffre "35" jamais un scale spring doux — apparition plus dure (cut net), countup rapide
//      (0->35 sur 12 frames), onde de choc dont le strokeWidth VARIE pendant l'expansion (tranche,
//      ne décore pas).
//   3. Caméra qui RESPIRE en continu (micro-zoom + micro-parallaxe ciel/sol) sur TOUTE la durée du
//      segment, pas seulement au climax — cause racine partagée avec le Segment A ("plan fixe").
//   4. GATE TRANCHÉ AZIZ : décor gardé EN FILIGRANE (opacité résiduelle très faible sur tour/terminal)
//      pendant le climax — jamais un fond noir total, le lien lieu/drame reste visible (approche
//      Gemini+DeepSeek, PAS le marquage au sol de Kimi).
//   5. Manche à air : bruit composé (2 fréquences sinus superposées) au lieu d'un sinus pur jugé
//      "mécanique/pantin" par 2/3 voix.
//
// Base SVG toujours FABLE 5 (mode MAX) + enrichissements GPT (lune) + Gemini (inspiration contraste)
// — voir historique complet dans PLAN-ACTES2-5.md § SEGMENT B (2026-08-05/07).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BEATS_B, GAZODUC_A3_INSERT_SECURITE_FRAMES } from "./GazoducActe3Timing";

export const GAZODUC_A3_INSERT_SECURITE_FRAMES_EXPORT = GAZODUC_A3_INSERT_SECURITE_FRAMES;

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * 30);
const B = BEATS_B;

const FEUX_AMBRE: { cx: number; cy: number; rHalo: number; rPoint: number }[] = [
  { cx: 320, cy: 1051, rHalo: 20, rPoint: 7 }, { cx: 1398, cy: 1051, rHalo: 20, rPoint: 7 },
  { cx: 410, cy: 1006, rHalo: 18, rPoint: 6 }, { cx: 1366, cy: 1006, rHalo: 18, rPoint: 6 },
  { cx: 508, cy: 959, rHalo: 16, rPoint: 5 }, { cx: 1331, cy: 959, rHalo: 16, rPoint: 5 },
  { cx: 605, cy: 911, rHalo: 14, rPoint: 5 }, { cx: 1296, cy: 911, rHalo: 14, rPoint: 5 },
  { cx: 695, cy: 867, rHalo: 12, rPoint: 4 }, { cx: 1263, cy: 867, rHalo: 12, rPoint: 4 },
  { cx: 785, cy: 822, rHalo: 11, rPoint: 4 }, { cx: 1231, cy: 822, rHalo: 11, rPoint: 4 },
  { cx: 860, cy: 786, rHalo: 9, rPoint: 3 }, { cx: 1204, cy: 786, rHalo: 9, rPoint: 3 },
  { cx: 935, cy: 749, rHalo: 8, rPoint: 3 }, { cx: 1177, cy: 749, rHalo: 8, rPoint: 3 },
];
const FEUX_VERTS: { cx: number; cy: number }[] = [
  { cx: 380, cy: 1070 }, { cx: 560, cy: 1070 }, { cx: 740, cy: 1070 },
  { cx: 940, cy: 1070 }, { cx: 1120, cy: 1070 }, { cx: 1300, cy: 1070 },
];
const FEUX_BLEUS: { cx: number; cy: number }[] = [
  { cx: 1470, cy: 1015 }, { cx: 1520, cy: 975 }, { cx: 1565, cy: 940 }, { cx: 1605, cy: 910 },
];
const FENETRES_TERMINAL: { x: number; y: number }[] = [
  { x: 175, y: 630 }, { x: 213, y: 630 }, { x: 251, y: 630 }, { x: 327, y: 630 },
  { x: 365, y: 630 }, { x: 403, y: 630 }, { x: 441, y: 630 }, { x: 517, y: 630 },
  { x: 555, y: 630 }, { x: 593, y: 630 },
];

// ===== Extinction avec vacillement organique — retour DA-brief : "chaque feu doit VACILLER avant de
// s'éteindre, pas un fondu poli". Génère une opacité qui flicker rapidement dans les ~6 frames avant
// l'extinction programmée, puis chute nette (pas un fondu doux). =====
function deathFlicker(frame: number, deathFrame: number, seed: number): number {
  const preDeath = deathFrame - 7;
  if (frame < preDeath) return 1;
  if (frame < deathFrame) {
    const t = frame - preDeath;
    const flicker = 0.3 + 0.7 * Math.abs(Math.sin(t * 2.4 + seed));
    return flicker;
  }
  return interpolate(frame, [deathFrame, deathFrame + 4], [1, 0], clampB); // chute nette, pas un fondu 0.4s
}

const OndeDeChoc: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const local = frame - startFrame;
  if (local < 0) return null;
  const rings = [0, 5, 10];
  return (
    <g>
      {rings.map((delay, i) => {
        const t = Math.max(0, local - delay);
        const r = interpolate(t, [0, 40], [10, 420], clampB);
        // strokeWidth qui VARIE pendant l'expansion — "tranche l'écran, ne le décore pas" (retour DA-brief).
        const strokeW = interpolate(t, [0, 15, 40], [5 - i, 1, 0], clampB);
        const op = interpolate(t, [0, 40], [0.9, 0], clampB);
        if (op <= 0) return null;
        return <circle key={i} cx={960} cy={620} r={r} fill="none" stroke="#00C4FF" strokeWidth={Math.max(0, strokeW)} opacity={op} />;
      })}
    </g>
  );
};

const ChiffreClimax: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const local = frame - startFrame;
  if (local < 0) return null;
  // Apparition plus dure : quasi cut (scale 0.92->1 en 5 frames), pas un spring doux étalé sur 18f.
  const scale = interpolate(local, [0, 5], [0.92, 1], { ...clampB, easing: (t) => 1 - Math.pow(1 - t, 4) });
  const opacity = interpolate(local, [0, 4], [0, 1], clampB);
  const countUp = Math.round(interpolate(local, [0, 12], [0, 35], { ...clampB, easing: (t) => t * t }));
  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", opacity,
    }}>
      <div style={{
        fontSize: 210, fontWeight: 800, color: "#e8ecf5", fontFamily: "'IBM Plex Mono', monospace",
        transform: `scale(${scale})`, letterSpacing: "-0.02em",
      }}>{countUp}</div>
      <div style={{ fontSize: 30, color: "#8fa0bb", marginTop: -12, letterSpacing: "0.15em", fontFamily: "'IBM Plex Mono', monospace" }}>
        MORTS
      </div>
    </div>
  );
};

// ===== VIE AMBIANTE (2026-08-08, retour Aziz sur v3) — décor qui VIT en parallèle (registre Khartoum
// sans acteur/figuration) plutôt qu'un seul canal d'extinction. 3 couches indépendantes, chacune avec
// son propre rythme, actives UNIQUEMENT pendant la phase "vie normale" (0→extinctionStart) — coupées
// net par darkenOverlay/climaxFilterOpacity comme le reste du décor, jamais visibles pendant le climax.

// Radar rotatif au sommet de la tour — balaie en boucle continue, INDÉPENDANT du cycle d'extinction
// (fauché par tourStaccado comme le reste de la cabine, pas par son propre timer). Généré Fable 5
// mode MAX (2026-08-08, retour Aziz : "les SVG ne sont pas du même niveau que le décor") — treillis
// mécanique complet (réflecteur cosécante grillagé, kingpost, fût boulonné), remplace le secteur
// translucide V1. Source : public/_rnd/fable-svg/gazoduc-acte3-v3-finition/radar-tour-controle.svg
// (pivot à l'origine du groupe `antenne_panneau`, `support` reste fixe — ne PAS tourner le support).
const RadarTour: React.FC<{ cx: number; cy: number; frame: number; opacity: number }> = ({ cx, cy, frame, opacity }) => {
  if (opacity <= 0.01) return null;
  const angle = (frame * 6) % 360; // ~1 tour/2s à 30fps — vitesse radar aéroportuaire plausible
  return (
    <g transform={`translate(${cx} ${cy}) scale(0.85)`} opacity={opacity}>
      <g id="support">
        <rect x={-8} y={11} width={16} height={2.2} rx={0.8} fill="#2a3f66" stroke="#46648c" strokeWidth={0.5} />
        {[-6.5, -3.25, 0, 3.25, 6.5].map((cxb) => <circle key={cxb} cx={cxb} cy={12.1} r={0.45} fill="#0e1b38" />)}
        <path d="M -5.5,10.9 L -5.5,8.4 L -7.7,10.9 Z" fill="#16224a" stroke="#46648c" strokeWidth={0.3} />
        <path d="M 5.5,10.9 L 5.5,8.4 L 7.7,10.9 Z" fill="#16224a" stroke="#46648c" strokeWidth={0.3} />
        <ellipse cx={0} cy={10} rx={5.5} ry={1.5} fill="#16224a" stroke="#46648c" strokeWidth={0.4} />
        <rect x={-5.5} y={3} width={11} height={7} fill="#1c2f57" stroke="#46648c" strokeWidth={0.4} />
        <path d="M -2.2,4 V 9.6 M 2.2,4 V 9.6" stroke="#0e1b38" strokeWidth={0.4} fill="none" />
        <path d="M -4.6,4 V 9.5" stroke="#46648c" strokeWidth={0.5} opacity={0.6} fill="none" />
        <rect x={-1.5} y={5} width={3} height={3} rx={0.4} fill="#16224a" stroke="#46648c" strokeWidth={0.35} />
        <circle cx={-0.9} cy={6.5} r={0.25} fill="#46648c" />
        <ellipse cx={0} cy={3} rx={5.5} ry={1.5} fill="#0e1b38" stroke="#46648c" strokeWidth={0.4} />
        <rect x={-3.2} y={1.6} width={6.4} height={1.8} fill="#16224a" stroke="#46648c" strokeWidth={0.35} />
      </g>
      <g id="pivot">
        <ellipse cx={0} cy={0.9} rx={6} ry={2.1} fill="#16224a" stroke="#46648c" strokeWidth={0.4} />
        <ellipse cx={0} cy={0} rx={6} ry={2.1} fill="#2a3f66" stroke="#46648c" strokeWidth={0.5} />
        {[[-4.8, 1.2], [-2.5, 1.75], [0, 1.95], [2.5, 1.75], [4.8, 1.2]].map(([bx, by]) => (
          <circle key={bx} cx={bx} cy={by} r={0.3} fill="#0e1b38" />
        ))}
        <circle cx={0} cy={0} r={1.1} fill="#0e1b38" stroke="#46648c" strokeWidth={0.35} />
        <circle cx={0} cy={0} r={0.35} fill="#46648c" />
      </g>
      <g id="antenne_panneau" transform={`rotate(${angle})`}>
        <path d="M -1.5,0 L -13,-6 M 1.5,0 L 13,-6" stroke="#0e1b38" strokeWidth={2.6} strokeLinecap="round" fill="none" />
        <path d="M -1.5,0 L -13,-6 M 1.5,0 L 13,-6" stroke="#2a3f66" strokeWidth={1.6} strokeLinecap="round" fill="none" />
        <path d="M -7.2,-3 L 7.2,-3" stroke="#16224a" strokeWidth={0.9} strokeLinecap="round" fill="none" />
        <rect x={-1.3} y={-7} width={2.6} height={7.4} fill="#2a3f66" stroke="#46648c" strokeWidth={0.4} />
        <path d="M -0.4,-6.6 V -0.2" stroke="#0e1b38" strokeWidth={0.35} fill="none" />
        <path d="M -14.2,-5.6 L -11.6,-5.6 L -12.9,-7 Z" fill="#16224a" stroke="#46648c" strokeWidth={0.3} />
        <path d="M 14.2,-5.6 L 11.6,-5.6 L 12.9,-7 Z" fill="#16224a" stroke="#46648c" strokeWidth={0.3} />
        <path d="M -40,-5.5 Q 0,-8.5 40,-5.5 L 40,-4.3 Q 0,-6.9 -40,-4.3 Z" fill="#0e1b38" stroke="#46648c" strokeWidth={0.35} />
        <path d="M -40,-7.2 Q 0,-15.4 40,-7.2" stroke="#46648c" strokeWidth={0.4} opacity={0.8} fill="none" />
        <path d="M -40,-6.3 Q 0,-11.5 40,-6.3" stroke="#46648c" strokeWidth={0.4} opacity={0.6} fill="none" />
        <path d="M -40,-8 Q 0,-19 40,-8 L 40,-5.5 Q 0,-8.5 -40,-5.5 Z" fill="#2a3f66" stroke="#46648c" strokeWidth={0.5} />
        <path
          stroke="#46648c" strokeWidth={0.45} opacity={0.85} fill="none"
          d="M -35,-17 V -4 M -30,-17 V -4 M -25,-17 V -4 M -20,-17 V -4 M -15,-17 V -4 M -10,-17 V -4 M -5,-17 V -4 M 0,-17 V -4 M 5,-17 V -4 M 10,-17 V -4 M 15,-17 V -4 M 20,-17 V -4 M 25,-17 V -4 M 30,-17 V -4 M 35,-17 V -4"
        />
        <rect x={-41.3} y={-8.7} width={2.3} height={4.6} rx={0.6} fill="#16224a" stroke="#46648c" strokeWidth={0.4} />
        <rect x={39} y={-8.7} width={2.3} height={4.6} rx={0.6} fill="#16224a" stroke="#46648c" strokeWidth={0.4} />
        <path d="M -40,-8 Q 0,-19 40,-8" stroke="#7fa1d4" strokeWidth={0.5} opacity={0.85} fill="none" />
        <g id="feu_balisage">
          <rect x={-0.35} y={-14.7} width={0.7} height={1.4} fill="#16224a" stroke="#46648c" strokeWidth={0.25} />
          <circle cx={0} cy={-15.2} r={2.4} fill="#ff5a4d" opacity={0.12} />
          <circle cx={0} cy={-15.2} r={1.3} fill="#ff5a4d" opacity={0.3} />
          <circle cx={0} cy={-15.2} r={0.7} fill="#ff5a4d" />
        </g>
      </g>
    </g>
  );
};

// Véhicule de piste (tracteur remorqueur, sans figure humaine) — immobile, gyrophare qui clignote à son
// PROPRE rythme (déphasé des feux de piste, jamais synchronisé — un vrai véhicule ne cligne pas au
// même tempo que la signalisation fixe). Généré Fable 5 mode MAX (2026-08-08) — carrosserie à volume
// réel (capot/cabine/vitrage/rim-lights lunaires), remplace la primitive rectangle+2 roues V1.
// Source : public/_rnd/fable-svg/gazoduc-acte3-v3-finition/vehicule-piste.svg
const VehiculePiste: React.FC<{ x: number; y: number; frame: number; opacity: number }> = ({ x, y, frame, opacity }) => {
  if (opacity <= 0.01) return null;
  const gyroPhase = (Math.sin(frame * 0.35) + 1) / 2;
  const gyroOn = gyroPhase > 0.72;
  return (
    <g transform={`translate(${x} ${y}) scale(0.9)`} opacity={opacity}>
      <defs>
        <g id="vp_roue">
          <circle r={7.5} fill="#101d3d" stroke="#0e1b38" strokeWidth={0.9} />
          <circle r={5.9} fill="none" stroke="#16244a" strokeWidth={0.7} />
          <circle r={4.3} fill="#2a3f66" stroke="#46648c" strokeWidth={0.6} />
          <circle r={1.6} fill="#16244a" stroke="#0e1b38" strokeWidth={0.4} />
          {[[0, -2.6], [-2.47, -0.8], [-1.53, 2.1], [1.53, 2.1], [2.47, -0.8]].map(([bx, by]) => (
            <circle key={bx} cx={bx} cy={by} r={0.5} fill="#0e1b38" />
          ))}
          <path d="M -3 -2.6 A 4 4 0 0 1 2.2 -3.3" fill="none" stroke="#6f8fc0" strokeWidth={0.7} opacity={0.6} />
        </g>
      </defs>
      <g id="ombre_sol">
        <ellipse cx={-2} cy={15} rx={35} ry={2.6} fill="#0e1b38" opacity={0.5} />
        <ellipse cx={-18} cy={14.6} rx={8} ry={1.5} fill="#0e1b38" opacity={0.55} />
        <ellipse cx={18} cy={14.6} rx={8} ry={1.5} fill="#0e1b38" opacity={0.55} />
      </g>
      <g id="carrosserie">
        <rect x={-38.5} y={-0.5} width={2.2} height={2} rx={0.3} fill="#16244a" />
        <rect x={27} y={-0.8} width={3.5} height={2.2} rx={0.3} fill="#16244a" />
        <circle cx={30.6} cy={0.3} r={0.9} fill="#0e1b38" stroke="#46648c" strokeWidth={0.3} />
        <path d="M -35 -3 L -33 -6 L -4 -6 L 2 -21 L 26 -21 L 27 -19 L 27 8.5 L -35 8.5 Z" fill="#2a3f66" stroke="#0e1b38" strokeWidth={0.6} />
        <path d="M -33 -6 L -4 -6 L -4 -1 L -33 -1 Z" fill="#324a75" />
        <line x1={-33} y1={-1} x2={1} y2={-1} stroke="#0e1b38" strokeWidth={0.4} opacity={0.5} />
        <rect x={-34} y={3.5} width={61} height={5} fill="#16244a" />
        <rect x={3.5} y={8.5} width={7} height={1.6} rx={0.5} fill="#0e1b38" />
        <path d="M -27 8 A 9 9 0 0 1 -9 8 Z" fill="#0e1b38" />
        <path d="M 9 8 A 9 9 0 0 1 27 8 Z" fill="#0e1b38" />
        <rect x={-36.5} y={-4} width={2.5} height={9} rx={0.8} fill="#16244a" stroke="#0e1b38" strokeWidth={0.4} />
        <path d="M -36.5 -1 L -34 -3.5 L -34 -1.8 L -36.5 0.7 Z" fill="#b5714f" opacity={0.9} />
        <path d="M -36.5 2.5 L -34 0 L -34 1.7 L -36.5 4.2 Z" fill="#b5714f" opacity={0.9} />
        {[-30, -27.2, -24.4].map((rx) => <rect key={rx} x={rx} y={-3.8} width={1.3} height={5} rx={0.6} fill="#16244a" />)}
        <rect x={2} y={-22} width={24.5} height={1.2} rx={0.4} fill="#16244a" />
        <path d="M 3.6 -19.3 L 23.8 -19.3 L 23.8 -10.6 L 0.2 -10.6 Z" fill="#101d3d" />
        <rect x={13.2} y={-19.3} width={1.2} height={8.7} fill="#2a3f66" />
        <line x1={6} y1={-18} x2={11} y2={-11.2} stroke="#6f8fc0" strokeWidth={1.4} opacity={0.4} />
        <line x1={8.6} y1={-18} x2={12.6} y2={-12.4} stroke="#6f8fc0" strokeWidth={0.7} opacity={0.3} />
        <line x1={17} y1={-17.5} x2={20.5} y2={-12.5} stroke="#6f8fc0" strokeWidth={0.8} opacity={0.25} />
        <path d="M 3 -10.6 L 3 3 M 13.5 -10.6 L 13.5 3" fill="none" stroke="#0e1b38" strokeWidth={0.5} />
        <rect x={10.8} y={-8.6} width={1.8} height={0.9} rx={0.4} fill="#0e1b38" />
        <line x1={24} y1={-10} x2={24} y2={0} stroke="#0e1b38" strokeWidth={0.4} opacity={0.5} />
        <line x1={2.2} y1={-18.6} x2={-1.4} y2={-17.6} stroke="#16244a" strokeWidth={0.6} />
        <rect x={-3.2} y={-19.4} width={1.7} height={2.6} rx={0.4} fill="#16244a" stroke="#0e1b38" strokeWidth={0.3} />
        <line x1={-32.5} y1={-6} x2={-4.5} y2={-6} stroke="#6f8fc0" strokeWidth={0.8} opacity={0.7} />
        <line x1={2.5} y1={-22} x2={25.5} y2={-22} stroke="#6f8fc0" strokeWidth={0.8} opacity={0.7} />
        <line x1={-3.6} y1={-7} x2={1.8} y2={-20.5} stroke="#6f8fc0" strokeWidth={0.6} opacity={0.5} />
      </g>
      <g id="roues">
        <use href="#vp_roue" transform="translate(-18 7)" />
        <use href="#vp_roue" transform="translate(18 7)" />
      </g>
      <g id="phares">
        <ellipse cx={-37.8} cy={-1.9} rx={2} ry={1.6} fill="#f5e0b8" opacity={0.18} />
        <rect x={-36.8} y={-3.2} width={1.5} height={2.6} rx={0.6} fill="#f5e0b8" stroke="#0e1b38" strokeWidth={0.3} />
        <circle cx={-35.6} cy={1.6} r={0.8} fill="#f5e0b8" opacity={0.9} />
        <rect x={26.6} y={-5.2} width={1} height={2} rx={0.4} fill="#b5714f" />
      </g>
      <g id="gyrophare">
        <circle cx={14} cy={-24} r={7.5} fill="#ff8a5c" opacity={gyroOn ? 0.07 : 0} />
        <circle cx={14} cy={-24} r={4.5} fill="#ff8a5c" opacity={gyroOn ? 0.16 : 0} />
        <ellipse cx={14} cy={-21.6} rx={5} ry={0.8} fill="#ff8a5c" opacity={gyroOn ? 0.18 : 0} />
        <rect x={9.5} y={-23.2} width={9} height={1.2} rx={0.4} fill="#16244a" />
        <rect x={9.8} y={-23} width={1} height={0.8} fill="#ff8a5c" opacity={gyroOn ? 0.8 : 0.25} />
        <rect x={17.2} y={-23} width={1} height={0.8} fill="#ff8a5c" opacity={gyroOn ? 0.8 : 0.25} />
        <path d="M 11.8 -23.2 A 2.2 2.2 0 1 1 16.2 -23.2 Z" fill={gyroOn ? "#ff8a5c" : "#5a3a2a"} stroke="#e0703f" strokeWidth={0.4} />
        <circle cx={13.3} cy={-24.1} r={0.65} fill={gyroOn ? "#ffd0ae" : "#8a5a42"} />
      </g>
    </g>
  );
};

// Avion au sol qui roule lentement en tout début de segment (0-9s) — mouvement d'aéroport nocturne
// banal, JAMAIS un décollage/atterrissage (registre attaque écarté par décision éditoriale antérieure) :
// roule à vitesse constante le long du tarmac puis sort de cadre, ne s'arrête ni ne s'aligne sur la piste.
// Généré Fable 5 mode MAX (2026-08-08) — silhouette pseudo-3/4 (cockpit, réacteurs, dérive, 16 hublots,
// train d'atterrissage), remplace la primitive 2 rectangles+2 triangles V1. Source SVG (nez à GAUCHE,
// donc pas de flip nécessaire — l'ancien trajet allait aussi vers la gauche) :
// public/_rnd/fable-svg/gazoduc-acte3-v3-finition/avion-roulage.svg
const AvionRoulage: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const local = frame; // actif seulement en tout début, appelant contrôle la fenêtre via `opacity`
  if (opacity <= 0.01) return null;
  const x = interpolate(local, [0, S(9)], [1120, 640], clampB);
  const y = interpolate(local, [0, S(9)], [792, 748], clampB);
  const taxiOp = interpolate(local, [0, S(1), S(7.5), S(9)], [0, 1, 1, 0], clampB);
  return (
    <g transform={`translate(${x} ${y}) rotate(-16) scale(0.62)`} opacity={opacity * taxiOp}>
      <g id="ombre_sol">
        <ellipse cx={0} cy={16.5} rx={46} ry={2} fill="#050b1a" opacity={0.5} />
        <ellipse cx={-1} cy={15.9} rx={7} ry={0.9} fill="#04091a" opacity={0.55} />
        <ellipse cx={40} cy={15.9} rx={4} ry={0.8} fill="#04091a" opacity={0.5} />
      </g>
      <g id="train_atterrissage">
        <path d="M 40 3.5 L 40 12.3" stroke="#101c38" strokeWidth={1.1} fill="none" />
        <circle cx={40} cy={13.9} r={1.9} fill="#0b1530" stroke="#223354" strokeWidth={0.5} />
        <circle cx={40} cy={13.9} r={0.6} fill="#1d2f52" />
        <path d="M -1 4 L -1 12" stroke="#101c38" strokeWidth={1.2} fill="none" />
        <path d="M -3.4 12.4 L 1.4 12.4" stroke="#101c38" strokeWidth={1} fill="none" />
        <circle cx={-2.9} cy={13.7} r={2.1} fill="#0b1530" stroke="#223354" strokeWidth={0.5} />
        <circle cx={0.9} cy={13.7} r={2.1} fill="#0b1530" stroke="#223354" strokeWidth={0.5} />
        <circle cx={-2.9} cy={13.7} r={0.7} fill="#1d2f52" />
        <circle cx={0.9} cy={13.7} r={0.7} fill="#1d2f52" />
      </g>
      <g id="ailes">
        <path d="M 4 -4 L -17 -9.6 L -19 -10.4 L -17.6 -8.4 L -1.5 -3.4 Z" fill="#16213a" />
        <path d="M 12.5 1.6 L -18.5 10.2 C -21 11, -22.6 11.6, -22.8 11.9 C -22.9 12.3, -22 12.3, -20.6 11.9 L -1.5 4.6 C 3 3.6, 9 2.4, 12.5 1.6 Z" fill="#35507f" />
        <path d="M -22.8 11.9 L -24.6 9.7 L -23.6 9.5 L -21.8 11.2 Z" fill="#1d2f52" />
        <ellipse cx={6} cy={4.2} rx={8} ry={1.5} fill="#24385f" />
      </g>
      <g id="reacteurs">
        <rect x={16} y={4.6} width={8} height={2.2} rx={1.1} fill="#101c38" />
        <path d="M 5 5.9 L 10.5 5.9 L 9.5 4.4 L 6.4 4.6 Z" fill="#22355c" />
        <rect x={2.5} y={5.6} width={10.5} height={4.4} rx={2.2} fill="#1b2c50" />
        <ellipse cx={12.6} cy={7.8} rx={1.1} ry={2.15} fill="#0a1428" stroke="#3d5a8c" strokeWidth={0.4} opacity={0.9} />
        <ellipse cx={3.1} cy={7.8} rx={0.7} ry={1.6} fill="#0a1428" />
      </g>
      <g id="fuselage">
        <path d="M 52 0.2 C 51.2 -1.8, 49 -3.4, 45 -4.1 C 30 -4.45, -10 -4.45, -27 -4.3 C -34 -4.15, -41 -3.3, -46.5 -2.1 C -46.9 -1.9, -46.9 -1.4, -46.4 -1.2 C -40 -0.1, -32 2.2, -25 4.2 C -5 4.55, 25 4.55, 37 4.35 C 43 4.1, 49.5 2.4, 52 0.2 Z" fill="#2a3f66" />
        <path d="M 45 -4.1 C 30 -4.45, -10 -4.45, -27 -4.3" stroke="#4a6aa0" strokeWidth={0.5} fill="none" opacity={0.6} />
        <path d="M 48.6 -2 L 44.6 -3.5 L 43.2 -2.7 L 47.4 -1.1 C 48.2 -1.3, 48.5 -1.6, 48.6 -2 Z" fill="#0b1732" />
        <path d="M 45 -3.1 L 47.6 -2.1" stroke="#a9c6ff" strokeWidth={0.35} opacity={0.5} fill="none" />
      </g>
      <g id="empennage">
        <path d="M -36.5 -2.6 L -48 -6.8 L -49.6 -6.6 L -47.4 -4.9 L -39.5 -1.6 Z" fill="#1b2c50" />
        <path d="M -29 -4 L -38.8 -15.6 C -39.2 -16.2, -40.4 -16.4, -41 -16 L -45.8 -2.6 C -41 -3.6, -34 -4, -29 -4 Z" fill="#24385f" />
        <path d="M -29.5 -4.1 L -39 -15.7" stroke="#46648f" strokeWidth={0.4} opacity={0.5} fill="none" />
      </g>
      <g id="hublots" fill="#ffdf9e">
        {[[-21, 0.75], [-17.5, 0.55], [-14, 0.7], [-10.5, 0.35], [-7, 0.65], [-3.5, 0.75], [0, 0.5], [3.5, 0.7], [7, 0.6], [10.5, 0.35], [14, 0.75], [17.5, 0.65], [21, 0.5], [24.5, 0.7], [28, 0.55], [31.5, 0.65]].map(([hx, hop]) => (
          <circle key={hx} cx={hx} cy={-1.1} r={0.62} opacity={hop} />
        ))}
      </g>
      <g id="feux_navigation">
        <g id="feu_rouge_gauche">
          <circle cx={-23.2} cy={11.6} r={3} fill="#ff5a4d" opacity={0.16} />
          <circle cx={-23.2} cy={11.6} r={1.5} fill="#ff5a4d" opacity={0.4} />
          <circle cx={-23.2} cy={11.6} r={0.75} fill="#ff5a4d" />
          <circle cx={-23.2} cy={11.6} r={0.3} fill="#ffe3df" />
        </g>
        <g id="feu_vert_droit">
          <circle cx={-19.2} cy={-10.5} r={3} fill="#7de08a" opacity={0.16} />
          <circle cx={-19.2} cy={-10.5} r={1.5} fill="#7de08a" opacity={0.4} />
          <circle cx={-19.2} cy={-10.5} r={0.75} fill="#7de08a" />
          <circle cx={-19.2} cy={-10.5} r={0.3} fill="#eaffee" />
        </g>
        <g id="feu_blanc_queue">
          <circle cx={-46.9} cy={-1.6} r={2} fill="#fff2d8" opacity={0.18} />
          <circle cx={-46.9} cy={-1.6} r={0.6} fill="#fff6e6" />
        </g>
        <g id="beacon_rouge_dorsal">
          <circle cx={6} cy={-4.7} r={1.8} fill="#ff5a4d" opacity={0.2} />
          <circle cx={6} cy={-4.7} r={0.55} fill="#ff5a4d" opacity={0.9} />
        </g>
      </g>
    </g>
  );
};

export const GazoducActe3InsertSecurite: React.FC = () => {
  const frame = useCurrentFrame();
  const globalFade = interpolate(frame, [0, S(0.5), B.segEnd + 9 - S(0.4), B.segEnd + 9], [0, 1, 1, 0], clampB);

  const sceneReveal = interpolate(frame, [0, S(1)], [0, 1], clampB);
  // Manche à air — bruit composé (2 fréquences), pas un sinus pur (retour DA-brief : "mécanique/pantin").
  const vaneAngle = Math.sin(frame * 0.05) * 5 + Math.sin(frame * 0.13) * 2;

  // ===== Caméra qui RESPIRE en continu (retour DA-brief unanime : "plan fixe = diaporama") — micro-zoom
  // + micro-parallaxe entre ciel (lointain, bouge peu) et sol/piste (proche, bouge plus). =====
  const totalDuration = B.segEnd + 9;
  const breathScale = interpolate(frame, [0, totalDuration], [1, 1.06], clampB);
  const skyParallax = interpolate(frame, [0, totalDuration], [0, -8], clampB);
  const groundParallax = interpolate(frame, [0, totalDuration], [0, -22], clampB);

  const extinctionStart = B.actifsEnd;
  const extinctionEnd = B.attaqueVerbeStart;
  const nFeux = FEUX_AMBRE.length / 2;
  const feuxOffAt = (pairIdx: number) => Math.round(interpolate(
    pairIdx, [0, nFeux - 1],
    [extinctionStart, extinctionStart + (extinctionEnd - extinctionStart) * 0.55],
  ));
  const tourOffAt = extinctionStart + (extinctionEnd - extinctionStart) * 0.72;
  const terminalOffAt = extinctionStart + (extinctionEnd - extinctionStart) * 0.85;
  const allOffAt = extinctionEnd;

  const darkenOverlay = interpolate(frame, [extinctionStart, extinctionEnd], [0, 0.75], clampB);
  // Vie ambiante (radar/véhicule/avion) : pleinement visible pendant la phase normale, coupée NETTE
  // à extinctionStart (4f, pas un fondu — le lieu qui bascule en état d'alerte arrête tout net, cohérent
  // avec la doctrine "extinction jamais un fondu poli" appliquée au reste du décor).
  const ambientLifeOpacity = interpolate(frame, [extinctionStart - 4, extinctionStart], [1, 0], clampB);

  const feuOpacity = (pairIdx: number, seed: number) => deathFlicker(frame, feuxOffAt(pairIdx), seed);
  // La tour meurt en STACCATO décroissant (5 flashs rapides), pas un fondu — signature de mort distincte.
  const tourStaccado = (() => {
    const t = frame - (tourOffAt - 18);
    if (t < 0) return 1;
    if (t < 18) {
      const flashIdx = Math.floor(t / 3.6);
      return [1, 0.6, 0.3, 0.1, 0][Math.min(4, flashIdx)];
    }
    return 0;
  })();
  const terminalOpacity = (idx: number) => {
    const t = terminalOffAt + idx * 4;
    return deathFlicker(frame, Math.round(t), idx * 1.7);
  };
  const beaconOpacity = 1 - interpolate(frame, [allOffAt - S(0.2), allOffAt], [0, 1], clampB);

  const shakeLocal = Math.max(0, frame - B.trenteCinqStart);
  const shakeAmp = shakeLocal < 12 ? 14 * Math.exp(-shakeLocal * 0.55) : 0;
  const shakeX = shakeAmp * Math.sin(shakeLocal * 12);
  const shakeY = shakeAmp * Math.cos(shakeLocal * 7);

  const dateOpacity = interpolate(
    frame,
    [B.dateAttaqueStart, B.dateAttaqueStart + S(0.6), B.attaqueVerbeStart - S(0.3), B.attaqueVerbeStart],
    [0, 1, 1, 0],
    clampB,
  );

  const chiffreOut = interpolate(frame, [B.paradoxeStart, B.paradoxeStart + S(0.8)], [1, 0], clampB);

  // ===== GATE TRANCHÉ AZIZ : décor gardé EN FILIGRANE pendant le climax (jamais un noir total) —
  // silhouette fantôme tour/terminal à opacité très faible, le lien lieu/drame reste visible. =====
  const climaxFilterOpacity = frame >= B.trenteCinqStart - 6
    ? Math.max(0.06, 1 - darkenOverlay) // plancher 0.06 : jamais totalement invisible pendant le climax
    : 1 - darkenOverlay;

  return (
    <AbsoluteFill style={{ opacity: globalFade, background: "#050b20" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ transform: `translate(${shakeX}px, ${shakeY}px) scale(${breathScale})`, transformOrigin: "50% 50%", opacity: sceneReveal }}>
        <defs>
          <radialGradient id="dusk_glow"><stop offset="0" stopColor="#8a6448" stopOpacity={0.55} /><stop offset="1" stopColor="#8a6448" stopOpacity={0} /></radialGradient>
          <radialGradient id="light_glow"><stop offset="0" stopColor="#ffd98a" stopOpacity={0.85} /><stop offset="0.5" stopColor="#ffd98a" stopOpacity={0.25} /><stop offset="1" stopColor="#ffd98a" stopOpacity={0} /></radialGradient>
          <radialGradient id="green_glow"><stop offset="0" stopColor="#7de08a" stopOpacity={0.8} /><stop offset="0.5" stopColor="#7de08a" stopOpacity={0.22} /><stop offset="1" stopColor="#7de08a" stopOpacity={0} /></radialGradient>
          <radialGradient id="blue_glow"><stop offset="0" stopColor="#6fc3ff" stopOpacity={0.8} /><stop offset="0.5" stopColor="#6fc3ff" stopOpacity={0.22} /><stop offset="1" stopColor="#6fc3ff" stopOpacity={0} /></radialGradient>
          <radialGradient id="cab_halo"><stop offset="0" stopColor="#ffca70" stopOpacity={0.55} /><stop offset="1" stopColor="#ffca70" stopOpacity={0} /></radialGradient>
          <radialGradient id="warm_pool"><stop offset="0" stopColor="#ffc46b" stopOpacity={0.5} /><stop offset="1" stopColor="#ffc46b" stopOpacity={0} /></radialGradient>
          <linearGradient id="cone_grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe4a8" stopOpacity={0.22} /><stop offset="1" stopColor="#ffe4a8" stopOpacity={0} /></linearGradient>
          <linearGradient id="cab_glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe2a0" /><stop offset="1" stopColor="#f0a95c" /></linearGradient>
          <linearGradient id="sky_grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#050b20" /><stop offset="0.45" stopColor="#0d1c3e" /><stop offset="0.78" stopColor="#1b3560" /><stop offset="1" stopColor="#2c4a74" /></linearGradient>
          <linearGradient id="ground_grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#16274b" /><stop offset="1" stopColor="#091126" /></linearGradient>
          <linearGradient id="runway_grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2947" /><stop offset="1" stopColor="#2b3c60" /></linearGradient>
        </defs>

        {/* Ciel — couche LOINTAINE de la parallaxe, bouge peu */}
        <g transform={`translate(${skyParallax} 0)`}>
          <rect x={-40} y={0} width={1960} height={700} fill="url(#sky_grad)" />
          <ellipse cx={430} cy={700} rx={620} ry={170} fill="url(#dusk_glow)" />
          {[[200,80,2,0.8],[340,150,1.5,0.6],[520,60,2,0.9],[760,120,1.6,0.7],[980,70,2.2,0.8],[1180,160,1.5,0.6],
            [1350,90,2,0.85],[1500,180,1.6,0.6],[1680,60,2,0.9],[1800,140,1.8,0.7],[1080,220,1.3,0.5],[600,210,1.4,0.55]].map(([cx,cy,r,op], i) => (
            <circle key={`star-${i}`} cx={cx} cy={cy} r={r} fill="#dce8ff" opacity={op} />
          ))}
          <ellipse cx={430} cy={430} rx={180} ry={36} fill="#223a60" opacity={0.85} />
          <ellipse cx={560} cy={415} rx={120} ry={30} fill="#223a60" opacity={0.85} />
          <ellipse cx={320} cy={445} rx={110} ry={26} fill="#223a60" opacity={0.85} />
          <ellipse cx={470} cy={408} rx={140} ry={16} fill="#35507c" opacity={0.6} />
          <ellipse cx={1260} cy={505} rx={220} ry={40} fill="#1e3458" opacity={0.9} />
          <ellipse cx={1400} cy={490} rx={130} ry={30} fill="#1e3458" opacity={0.9} />
          <ellipse cx={1130} cy={520} rx={120} ry={28} fill="#1e3458" opacity={0.9} />
          <ellipse cx={1300} cy={482} rx={150} ry={14} fill="#31497a" opacity={0.5} />
          <ellipse cx={1720} cy={415} rx={150} ry={30} fill="#223a60" opacity={0.8} />
          <ellipse cx={1830} cy={432} rx={88} ry={22} fill="#223a60" opacity={0.8} />
          <circle cx={1650} cy={158} r={82} fill="#122544" opacity={0.3} />
          <circle cx={1650} cy={158} r={55} fill="#b6c5d7" opacity={0.35 * sceneReveal} />
        </g>

        {/* Sol/piste/architecture — couche PROCHE de la parallaxe, bouge plus (opacité en filigrane au climax) */}
        <g transform={`translate(${groundParallax} 0)`} opacity={climaxFilterOpacity}>
          <rect x={-40} y={698} width={1960} height={382} fill="url(#ground_grad)" />
          <rect x={-40} y={696} width={1960} height={3} fill="#3a5580" opacity={0.4} />
          <ellipse cx={445} cy={705} rx={250} ry={22} fill="url(#warm_pool)" opacity={0.6} />

          <polygon points="260,1080 1420,1080 1150,712 1010,712" fill="url(#runway_grad)" />
          <path d="M260 1080 L1010 712" stroke="#46608c" strokeWidth={3} opacity={0.5} fill="none" />
          <path d="M1420 1080 L1150 712" stroke="#46608c" strokeWidth={3} opacity={0.5} fill="none" />

          {/* Vie ambiante — décor qui VIT en parallèle (radar/véhicule/avion), coupée net à l'extinction */}
          <AvionRoulage frame={frame} opacity={ambientLifeOpacity} />
          <VehiculePiste x={760} y={758} frame={frame} opacity={ambientLifeOpacity} />
          {["350,1080 402,1080 487,1030 441,1030", "478,1080 530,1080 599,1030 553,1030", "605,1080 657,1080 712,1030 666,1030",
            "733,1080 785,1080 824,1030 778,1030", "895,1080 947,1080 967,1030 921,1030", "1023,1080 1075,1080 1079,1030 1033,1030",
            "1150,1080 1202,1080 1192,1030 1146,1030", "1278,1080 1330,1080 1304,1030 1258,1030"].map((pts, i) => (
            <polygon key={`piano-${i}`} points={pts} fill="#b9c6da" opacity={0.7} />
          ))}

          <polygon points="96,518 184,518 380,1040 20,1040" fill="url(#cone_grad)" opacity={1 - darkenOverlay} />
          <polygon points="128,1040 152,1040 146,520 134,520" fill="#0d1a36" />
          <rect x={92} y={510} width={96} height={10} fill="#12224a" />
          {[96, 118, 146, 168].map((x, i) => <rect key={`pyl-${i}`} x={x} y={498} width={16} height={12} fill="#1a2c50" />)}
          <g opacity={tourStaccado}>
            {[104, 126, 154, 176].map((cx, i) => <ellipse key={`pylglow-${i}`} cx={cx} cy={512} rx={10} ry={5} fill="#ffe4a8" opacity={0.9} />)}
          </g>
          <ellipse cx={200} cy={1036} rx={230} ry={32} fill="#ffd98a" opacity={0.12 * (1 - darkenOverlay)} />

          <rect x={150} y={596} width={490} height={104} fill="#101d3a" />
          <rect x={140} y={586} width={510} height={12} fill="#1a2c50" />
          <rect x={200} y={572} width={40} height={14} fill="#0e1b38" />
          <rect x={560} y={574} width={30} height={12} fill="#0e1b38" />
          <rect x={289} y={630} width={26} height={34} fill="#6b512f" />
          <rect x={479} y={630} width={26} height={34} fill="#6b512f" />
          {FENETRES_TERMINAL.map((f, i) => {
            const op = terminalOpacity(i);
            if (op <= 0.01) return null;
            return <rect key={`fen-${i}`} x={f.x} y={f.y} width={26} height={34} fill="#ffc46b" opacity={op} />;
          })}
          <rect x={388} y={672} width={4} height={28} fill="#1a2c50" />
          <rect x={488} y={672} width={4} height={28} fill="#1a2c50" />
          <rect x={380} y={662} width={120} height={10} fill="#24385e" />
          <rect x={405} y={674} width={70} height={26} fill="#ffd98a" opacity={0.9 * terminalOpacity(FENETRES_TERMINAL.length - 1)} />

          <polygon points="858,700 902,700 894,420 866,420" fill="#0e1b38" />
          <polygon points="866,420 894,420 912,392 848,392" fill="#142648" />
          <rect x={838} y={392} width={84} height={5} fill="#1d3156" />
          <path d="M866 392 L862 340" stroke="#7a5a30" strokeWidth={3} />
          <path d="M880 392 L880 340" stroke="#7a5a30" strokeWidth={3} />
          <path d="M894 392 L898 340" stroke="#7a5a30" strokeWidth={3} />
          <polygon points="836,340 924,340 916,326 844,326" fill="#16294c" />
          <rect x={878} y={266} width={4} height={60} fill="#2a4068" />
          <RadarTour cx={880} cy={266} frame={frame} opacity={ambientLifeOpacity * tourStaccado} />
          <g opacity={tourStaccado}>
            <ellipse cx={880} cy={366} rx={95} ry={50} fill="url(#cab_halo)" />
            <polygon points="852,392 908,392 924,340 836,340" fill="url(#cab_glass)" />
            <rect x={873} y={634} width={12} height={16} fill="#ffca70" opacity={0.85} />
            <rect x={873} y={556} width={12} height={16} fill="#ffca70" opacity={0.85} />
          </g>
          <circle cx={880} cy={262} r={13} fill="#ff5a4d" opacity={0.3 * beaconOpacity} />
          <circle cx={880} cy={262} r={5} fill="#ff5a4d" opacity={beaconOpacity} />

          {FEUX_AMBRE.map((f, i) => {
            const pairIdx = Math.floor(i / 2);
            const op = feuOpacity(pairIdx, i * 1.3);
            if (op <= 0.01) return null;
            return (
              <g key={`amb-${i}`} opacity={op}>
                <circle cx={f.cx} cy={f.cy} r={f.rHalo} fill="url(#light_glow)" />
                <circle cx={f.cx} cy={f.cy} r={f.rPoint} fill="#ffdf9e" />
              </g>
            );
          })}
          {FEUX_VERTS.map((f, i) => {
            const op = feuOpacity(Math.floor((i / FEUX_VERTS.length) * nFeux), i * 2.1);
            if (op <= 0.01) return null;
            return (
              <g key={`grn-${i}`} opacity={op}>
                <circle cx={f.cx} cy={f.cy} r={16} fill="url(#green_glow)" />
                <circle cx={f.cx} cy={f.cy} r={6} fill="#7de08a" />
              </g>
            );
          })}
          {FEUX_BLEUS.map((f, i) => {
            const op = feuOpacity(nFeux - 1, i * 0.9);
            if (op <= 0.01) return null;
            return (
              <g key={`blu-${i}`} opacity={op}>
                <circle cx={f.cx} cy={f.cy} r={14} fill="url(#blue_glow)" />
                <circle cx={f.cx} cy={f.cy} r={5} fill="#8fd0ff" />
              </g>
            );
          })}

          <ellipse cx={1660} cy={1012} rx={42} ry={10} fill="#0c1834" />
          <rect x={1656} y={768} width={8} height={244} fill="#33517e" />
          <circle cx={1660} cy={768} r={7} fill="none" stroke="#46648c" strokeWidth={3} />
          <g transform={`rotate(${vaneAngle} 1660 768)`} opacity={1 - darkenOverlay * 0.6}>
            <circle cx={1660} cy={744} r={12} fill="url(#light_glow)" />
            <circle cx={1660} cy={744} r={4} fill="#ffd98a" />
            <polygon points="1652,750 1652,786 1621,786 1621,754" fill="#E05206" />
            <polygon points="1621,754 1621,786 1590,786 1590,759" fill="#FFFFFF" />
            <circle cx={1605} cy={770} r={7} fill="#E05206" />
            <polygon points="1590,759 1590,786 1559,786 1559,763" fill="#0DB02B" />
            <polygon points="1559,763 1559,786 1528,786 1528,768" fill="#0DB02B" />
          </g>
        </g>

        <rect width={1920} height={1080} fill="#050b20" opacity={darkenOverlay} />
        {frame >= B.trenteCinqStart && <OndeDeChoc frame={frame} startFrame={B.trenteCinqStart} />}
      </svg>

      {dateOpacity > 0.01 && (
        <div style={{
          position: "absolute", top: 60, left: 80, opacity: dateOpacity,
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, color: "#8fa0bb", letterSpacing: "0.1em",
        }}>
          25.06.2026 — NIAMEY
        </div>
      )}

      {frame >= B.trenteCinqStart && (
        <div style={{ opacity: chiffreOut }}>
          <ChiffreClimax frame={frame} startFrame={B.trenteCinqStart} />
        </div>
      )}
    </AbsoluteFill>
  );
};

export default GazoducActe3InsertSecurite;
