// PARTIE 2 — LE BLOCAGE (intervention FR/ONU massive, et pourtant le territoire perdu grandit).
//
// REFONTE PREMIUM (2026-06-11) sur le modèle VALIDÉ du beat 2.4 (Proto24Extinction). La version
// précédente (étoiles/cercles/points SVG niveau-1) a été REJETÉE par Aziz. Voie premium actée :
//   - Marqueurs = SPRITES GEMINI (encre fine, ancrés au pied) — base-fr-td, fr-epervier/licorne/sabre.
//   - Zones d'emprise = STATIQUES (buildStaticZone : installation unique puis figé, contour déchiqueté
//     IMMOBILE). PAS de blob qui ondule. Le mouvement vient des marqueurs/effets, pas du contour.
//   - Effets organiques = PixelLab (fumée fx-smoke, ping-pong ambiant).
//   - Disparition = effacement TOTAL (territoire perdu = plus aucune présence).
//   - Discipline anti-saturation : 1 foyer à la fois, pitch flat (analytique), caméra serrée (moteur).
//
// Couche PURE par-dessus la carte (pattern <PartieX>). Reçoit SahelRenderContext. Ne possède PAS la map.
//
// Beats (triggers V5 alignment, ×30fps) :
//   2.1 Serval/Barkhane  f3196/f3268  bases FR (Gao/Ménaka/Tessalit) sprites + "2013"
//   2.2 présence FR      f3419/f3443  forces pré-positionnées (epervier/licorne/sabre) convergent, SOBRE
//   2.3 MINUSMA          f3660        points ONU soignés (Kidal/Tombouctou/Mopti), halo bleu
//   2.4 échec 10 ans     f3887        ZONE rouge statique + bases s'effacent + fumée (modèle validé)
//   2.5 villes/campagnes f4384/f4421  villes tenues (points) ; zone rouge rurale statique
//   2.6 Burkina déborde  f4955/f4976  zone rouge franchit Mali→Burkina, "2015"
//   (fin) Niger/CEDEAO   f5380/f5639  Niamey bascule (flash net) + anneau CEDEAO (pont Partie 3)

import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useVideoConfig, Easing } from "remotion";
import type { SahelRenderContext } from "../engine/SahelContext";
import {
  PAL, buildStaticZone, smoothClosedPath, smokePingPong, type Pt,
} from "./warmapPremiumKit";

// ============================================================
// TRIGGERS V5 (alignment, ×30fps)
// ============================================================
const F_SERVAL = 3196;
const F_BARKHANE = 3268;
const F_PRESENTE = 3419;
const F_AUTOUR = 3443;
const F_MINUSMA = 3660;
const F_ECHEC = 3887;     // "dix ans plus tard"
const F_VILLES = 4384;
const F_CAMPAGNES = 4421;
const F_DEBORDENT = 4955;
const F_BURKINA = 4976;
const F_NIGER = 5380;
const F_CEDEAO = 5639;

// ============================================================
// GÉOGRAPHIE
// ============================================================
type FrBase = { id: string; name: string; coord: [number, number]; appearAt: number; extinctAt: number };
// Bases FR : apparaissent au 2.1 (Serval/Barkhane), s'éteignent au 2.4 (échec). Staggered.
const FR_BASES: FrBase[] = [
  { id: "gao", name: "GAO", coord: [-0.04, 16.27], appearAt: F_SERVAL + 12, extinctAt: F_ECHEC + 100 },
  { id: "menaka", name: "MÉNAKA", coord: [2.40, 15.92], appearAt: F_SERVAL + 30, extinctAt: F_ECHEC + 175 },
  { id: "tessalit", name: "TESSALIT", coord: [1.01, 20.20], appearAt: F_BARKHANE + 12, extinctAt: F_ECHEC + 240 },
];

// Présence FR pré-positionnée (2.2) — origines régionales AUTOUR du Mali (sobre, marqueurs encre + traits).
// Décision Aziz : pas de sprites portraits. Correction Sonar #5 : pas de total chiffré faux.
type Force = { id: string; coord: [number, number]; delay: number };
const FORCES: Force[] = [
  { id: "epervier", coord: [15.05, 12.10], delay: 0 },   // Tchad (E)
  { id: "licorne", coord: [-5.55, 7.54], delay: 14 },     // Côte d'Ivoire (S)
  { id: "sabre", coord: [2.12, 13.51], delay: 28 },       // Niger/Niamey (E)
];
const MALI_CENTER: [number, number] = [-1.5, 16.5];

// Points MINUSMA (ONU) — marqueurs secondaires soignés (point + double halo bleu), distincts des bases FR.
const MINUSMA_PTS: { coord: [number, number]; name: string; delay: number }[] = [
  { coord: [1.44, 18.43], name: "KIDAL", delay: 0 },
  { coord: [-3.01, 16.79], name: "TOMBOUCTOU", delay: 12 },
  { coord: [-4.20, 14.49], name: "MOPTI", delay: 24 },
];

// Villes tenues (2.5) — les armées tiennent les villes, pas les campagnes. Points bleus nets.
const HELD_CITIES: { coord: [number, number]; name: string }[] = [
  { coord: [-0.04, 16.27], name: "GAO" },
  { coord: [-3.01, 16.79], name: "TOMBOUCTOU" },
  { coord: [-4.20, 14.49], name: "MOPTI" },
];

// Capitales qui basculent (fin).
const NIAMEY: [number, number] = [2.12, 13.51];
// Pays CEDEAO autour (anneau menace, pont P3). Centroïdes approx.
const CEDEAO_RING: [number, number][] = [
  [-1.52, 12.37],  // Ouaga (déjà AES mais voisin)
  [-4.00, 9.50],   // Côte d'Ivoire
  [-1.20, 7.95],   // Ghana
  [2.30, 9.30],    // Bénin
  [8.10, 9.10],    // Nigeria (O)
];

// ============================================================
// ZONES D'EMPRISE STATIQUES (modèle 2.4) — jihadisme = territoire posé, immobile.
// ============================================================
// 2.4 : grande zone qui encercle le triangle des bases FR (centrée nord-Mali).
const ZONE_ECHEC = { center: [0.9, 16.9] as [number, number], rLon: 4.2, rLat: 4.2, startF: F_ECHEC };
// 2.5 : zone rurale (entre-deux) — le rural perdu pendant que les villes tiennent. Plus large, plus sud.
const ZONE_RURAL = { center: [-1.2, 15.6] as [number, number], rLon: 5.0, rLat: 3.4, startF: F_VILLES };
// 2.6 : débordement Burkina — zone qui franchit la frontière sud (nord Burkina).
const ZONE_BURKINA = { center: [-0.6, 13.4] as [number, number], rLon: 3.2, rLat: 2.4, startF: F_DEBORDENT };

const BASE_RATIO = 0.56; // hauteur/largeur du sprite base-fr-td

type Props = { ctx: SahelRenderContext | null };

export const Partie2Blocage: React.FC<Props> = ({ ctx }) => {
  const { fps } = useVideoConfig();
  if (!ctx) return null;
  const { frame, width, height, project } = ctx;
  const vmin = Math.min(width, height);

  const baseSprite = staticFile("_shared/sprites/warmap/base-fr-td.png");

  // ── Helper : rendre une zone statique projetée en path ──
  const zonePath = (z: typeof ZONE_ECHEC): { d: string; op: number } | null => {
    if (frame < z.startF) return null;
    const ring = buildStaticZone({ frame, startF: z.startF, center: z.center, rLon: z.rLon, rLat: z.rLat });
    const px: Pt[] = ring.map(([lon, lat]) => project(lon, lat));
    const d = smoothClosedPath(px);
    const op = interpolate(frame, [z.startF, z.startF + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { d, op };
  };

  const zEchec = zonePath(ZONE_ECHEC);
  const zRural = zonePath(ZONE_RURAL);
  const zBurkina = zonePath(ZONE_BURKINA);

  // ── 2.1/2013 cartouche ──
  const an2013 = interpolate(frame, [F_SERVAL, F_SERVAL + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // ── 2.6/2015 cartouche ──
  const an2015 = interpolate(frame, [F_DEBORDENT, F_DEBORDENT + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // ── fin : Niamey flash + CEDEAO ──
  const niameyFall = interpolate(frame, [F_NIGER, F_NIGER + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cedeaoT = interpolate(frame, [F_CEDEAO, F_CEDEAO + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pNiamey = project(NIAMEY[0], NIAMEY[1]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="p2-zone" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={PAL.RED_DEEP} stopOpacity={0.15} />
            <stop offset="72%" stopColor={PAL.RED_INK} stopOpacity={0.30} />
            <stop offset="100%" stopColor={PAL.RED_INK} stopOpacity={0.48} />
          </radialGradient>
          <pattern id="p2-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke={PAL.RED_INK} strokeWidth="1.4" strokeOpacity="0.4" />
          </pattern>
        </defs>

        {/* ============ ZONES D'EMPRISE STATIQUES (sous les marqueurs) ============ */}
        {[zEchec, zRural, zBurkina].map((z, i) =>
          z && z.d ? (
            <g key={`zone-${i}`} opacity={z.op}>
              <path d={z.d} fill="url(#p2-zone)" />
              <path d={z.d} fill="url(#p2-hatch)" opacity={0.45} />
              <path d={z.d} fill="none" stroke={PAL.RED_INK} strokeWidth={2} strokeOpacity={0.55} />
            </g>
          ) : null
        )}

        {/* ============ 2.2 — PRÉSENCE FR PRÉ-POSITIONNÉE (SOBRE, voix minimale, l'overlay porte) ============
            Décision Aziz 2026-06-11 : PAS de sprites (fr-epervier/licorne/sabre = portraits, incohérents
            top-down). Présence abstraite = petit marqueur encre à chaque origine régionale + trait fin
            pointillé qui se DESSINE vers le centre Mali (la France est déjà là, tout autour). Le point Mali
            persiste à la sortie. Aucun total chiffré (correction Sonar #5). */}
        {frame >= F_PRESENTE && FORCES.map((f, i) => {
          const p0 = project(f.coord[0], f.coord[1]);
          const pc = project(MALI_CENTER[0], MALI_CENTER[1]);
          const t = interpolate(frame, [F_PRESENTE + f.delay, F_PRESENTE + f.delay + 40], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
          });
          // fade-out global quand MINUSMA arrive (le beat 2.2 se solde) — le point Mali reste via la couche bases.
          const fade = interpolate(frame, [F_PRESENTE, F_PRESENTE + 20, F_MINUSMA - 20, F_MINUSMA + 30], [0, 1, 1, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          if (t <= 0 || fade <= 0) return null;
          const hx = p0.x + (pc.x - p0.x) * t;
          const hy = p0.y + (pc.y - p0.y) * t;
          const ap0 = interpolate(frame, [F_PRESENTE + f.delay, F_PRESENTE + f.delay + 14], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          return (
            <g key={`force-line-${i}`} opacity={fade}>
              {/* trait fin pointillé qui se dessine de l'origine vers le Mali */}
              <line x1={p0.x} y1={p0.y} x2={hx} y2={hy}
                stroke={PAL.INK} strokeWidth={1.4} strokeOpacity={0.5}
                strokeLinecap="round" strokeDasharray="2 5" style={{ mixBlendMode: "multiply" }} />
              {/* marqueur d'origine : petit losange encre (présence pré-positionnée) */}
              <g transform={`translate(${p0.x},${p0.y}) rotate(45)`} opacity={ap0}>
                <rect x={-3.4} y={-3.4} width={6.8} height={6.8} fill={PAL.STEEL} fillOpacity={0.85}
                  stroke={PAL.INK} strokeWidth={0.8} strokeOpacity={0.6} />
              </g>
              {/* tête d'avancée discrète */}
              <circle cx={hx} cy={hy} r={2} fill={PAL.INK} fillOpacity={0.5} />
            </g>
          );
        })}

        {/* ============ 2.3 — POINTS MINUSMA (ONU) : point + double halo bleu, soignés ============
            Présents au 2.4 (l'argument : "malgré toutes ces forces") MAIS en RETRAIT (anti-saturation :
            le foyer du 2.4 = l'extinction). Retrait à 35% à l'arrivée du 2.4. Disparaissent à la fin du 2.4. */}
        {frame >= F_MINUSMA && frame < F_VILLES && MINUSMA_PTS.map((m, i) => {
          const p = project(m.coord[0], m.coord[1]);
          const ap = spring({ frame: frame - (F_MINUSMA + m.delay), fps, config: { damping: 13 }, durationInFrames: 16 });
          if (ap <= 0.02) return null;
          // retrait pendant le 2.4 (présent mais discret) puis fade-out à la fin du beat.
          const recede = interpolate(frame, [F_ECHEC - 30, F_ECHEC + 20, F_ECHEC + 280, F_ECHEC + 340], [1, 0.35, 0.35, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const op = ap * recede;
          if (op <= 0.02) return null;
          const pulse = 1 + 0.10 * Math.sin((frame - F_MINUSMA) * 0.10);
          const r = 0.012 * vmin;
          return (
            <g key={`un-${i}`} transform={`translate(${p.x},${p.y})`} opacity={op}>
              <circle r={r * 2.6 * pulse} fill="none" stroke={PAL.UN_BLUE} strokeWidth={1.4} strokeOpacity={0.35} />
              <circle r={r * 1.7} fill="none" stroke={PAL.UN_BLUE} strokeWidth={1.6} strokeOpacity={0.6} />
              <circle r={r} fill={PAL.UN_BLUE} fillOpacity={0.9} />
            </g>
          );
        })}

        {/* ============ 2.5 — VILLES TENUES (points bleus nets dans la zone rurale rouge) ============ */}
        {frame >= F_VILLES && HELD_CITIES.map((c, i) => {
          const p = project(c.coord[0], c.coord[1]);
          const ap = spring({ frame: frame - (F_VILLES + i * 8), fps, config: { damping: 14 }, durationInFrames: 16 });
          if (ap <= 0.02) return null;
          const r = 0.011 * vmin;
          return (
            <g key={`held-${i}`} transform={`translate(${p.x},${p.y})`} opacity={ap}>
              {/* anneau de tenue (la ville résiste dans le rouge) */}
              <circle r={r * 2.2} fill="none" stroke={PAL.STEEL} strokeWidth={1.6} strokeOpacity={0.55} />
              <circle r={r} fill={PAL.STEEL} fillOpacity={0.95} />
            </g>
          );
        })}

        {/* ============ BASES FR — halo d'ancrage acier au sol (sous le fortin) ============
            Apparaît au 2.1, s'éteint au 2.4. Le fortin lui-même est en <img> hors-SVG. */}
        {FR_BASES.map((b) => {
          const p = project(b.coord[0], b.coord[1]);
          const ap = spring({ frame: frame - b.appearAt, fps, config: { damping: 14 }, durationInFrames: 18 });
          if (ap <= 0.02) return null;
          const rel = frame - b.extinctAt;
          const halo = ap * interpolate(rel, [0, 40], [1, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
          });
          if (halo <= 0.02) return null;
          const rHalo = 0.07 * vmin;
          const pulse = 1 + 0.06 * Math.sin((frame - b.appearAt) * 0.12);
          return (
            <g key={`halo-${b.id}`} transform={`translate(${p.x},${p.y})`}>
              <ellipse rx={rHalo * pulse} ry={rHalo * 0.5 * pulse}
                fill="none" stroke={PAL.STEEL} strokeWidth={1.8} strokeOpacity={0.42 * halo} />
            </g>
          );
        })}

        {/* ============ FIN — NIAMEY BASCULE (flash net SVG) + ANNEAU CEDEAO ============ */}
        {niameyFall > 0 && (
          <g transform={`translate(${pNiamey.x},${pNiamey.y})`}>
            {/* flash de bascule (one-shot net : un coup d'État = rupture) */}
            <circle r={0.05 * vmin * interpolate(niameyFall, [0, 0.4], [0.2, 1], { extrapolateRight: "clamp" })}
              fill="none" stroke="#E8DCC0" strokeWidth={2.4}
              strokeOpacity={interpolate(niameyFall, [0, 0.3, 1], [0, 0.8, 0], { extrapolateRight: "clamp" })} />
            <circle r={0.014 * vmin} fill="#E8DCC0" fillOpacity={0.95 * niameyFall} />
          </g>
        )}
        {cedeaoT > 0 && CEDEAO_RING.map((c, i) => {
          const p = project(c[0], c[1]);
          const ap = interpolate(frame, [F_CEDEAO + i * 6, F_CEDEAO + i * 6 + 24], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          if (ap <= 0) return null;
          const r = 0.012 * vmin;
          return (
            <g key={`cedeao-${i}`} transform={`translate(${p.x},${p.y})`} opacity={ap}>
              <circle r={r} fill={PAL.CEDEAO} fillOpacity={0.85} />
              {/* flèche de menace vers Niamey (pont P3) */}
              <line x1={0} y1={0} x2={(pNiamey.x - p.x) * 0.4} y2={(pNiamey.y - p.y) * 0.4}
                stroke={PAL.CEDEAO} strokeWidth={2} strokeOpacity={0.6} strokeDasharray="4 4" />
            </g>
          );
        })}
      </svg>

      {/* ============ SPRITES BASES FR (base-fr-td) — apparition 2.1, EFFACEMENT TOTAL au 2.4 ============ */}
      {FR_BASES.map((b) => {
        const p = project(b.coord[0], b.coord[1]);
        const ap = spring({ frame: frame - b.appearAt, fps, config: { damping: 14 }, durationInFrames: 18 });
        if (ap <= 0.02) return null;
        const rel = frame - b.extinctAt;
        // disparition complète (territoire perdu = plus aucune présence FR) sur 50f.
        const deadT = interpolate(rel, [0, 50], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
        });
        const wBase = 0.22 * vmin;
        const scale = ap * (1 - deadT * 0.14);
        const w = wBase * scale;
        const h = w * BASE_RATIO;
        const op = ap * (1 - deadT);
        if (op <= 0.02) return null;
        const grayscale = deadT;
        const brightness = 1 - deadT * 0.22;
        const shadowAlpha = 0.3 * (1 - deadT);
        return (
          <img key={`base-${b.id}`} src={baseSprite}
            style={{
              position: "absolute", left: p.x - w / 2, top: p.y - h * 0.62, width: w, height: h,
              opacity: op,
              filter: `grayscale(${grayscale}) brightness(${brightness}) drop-shadow(0 ${2 * (1 - deadT) + 1}px ${6 * (1 - deadT) + 2}px rgba(80,30,20,${shadowAlpha}))`,
              pointerEvents: "none",
            }} />
        );
      })}

      {/* ============ FUMÉE (ambiant ping-pong) — chaque base éteinte fume puis SE DISPERSE ============
          Le foyer couve ~12s après l'extinction puis s'estompe (la fumée ne brûle pas éternellement —
          sinon 3 panaches saturent les beats 2.5/2.6/fin). Fade-out sur [+9s, +15s]. */}
      {FR_BASES.map((b) => {
        const sm = smokePingPong({ frame, startF: b.extinctAt, fps });
        if (!sm) return null;
        const rel = frame - b.extinctAt;
        // dispersion : la fumée s'estompe entre +9s et +15s après l'extinction (foyer qui couve puis retombe).
        const disperse = interpolate(rel, [fps * 9, fps * 15], [1, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const op = sm.op * disperse;
        if (op <= 0.02) return null;
        const p = project(b.coord[0], b.coord[1]);
        const sw = 0.16 * vmin;
        return (
          <img key={`smoke-${b.id}`} src={staticFile(`_shared/sprites/warmap/fx-smoke/${sm.idx}.png`)}
            style={{
              position: "absolute", left: p.x - sw / 2, top: p.y - sw * 0.82, width: sw, height: sw,
              opacity: op, imageRendering: "pixelated", pointerEvents: "none",
            }} />
        );
      })}
    </AbsoluteFill>
  );
};

export default Partie2Blocage;
