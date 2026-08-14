// Partie 1 — ORIGINE 2012 (canari). Direction SOUSTRACTION (validee DA 3 voix + Aziz).
//
// Couche PURE dessinee par-dessus la carte du moteur. Recoit le contexte
// SahelRenderContext (frame, project lon/lat->px, etat). Ne possede PAS la map.
//
// Beats (recales sur narration-v5-alignment.json @30fps) :
//   1.0 board clearing (jetons Acte 1 -> 0.05, gere par le moteur) + reperes "LIBYE" + "2012"
//   1.1 pulse Libye (effondrement)
//   1.2 trait d'encre Libye->Mali (route reelle Sebha->Salvador->Kidal) + taches Kidal/Gao/Tombouctou
//   1.3 vide d'Etat (chute opacite fill rural) + hachures tensions
//
// REGLE P1 : PAS d'overlay, PAS d'objets (origine 2012 = abstraite, 100% cartographiable).
// Encre/taches en mixBlendMode multiply, palette parchemin. PAS de particules TikTok.

import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import type { SahelRenderContext } from "../engine/SahelContext";
import { LIBYE_RING } from "./sahelCountries";

// ============================================================
// TRIGGERS V6 (alignment aes-v6-acte1.alignment.json, x30fps, force-align 2026-08-06)
// Script reecrit (echec vues video V5) - mots-cles changent, structure du texte identique.
//   "commence"    f1153  -> board clearing (moteur) + "2012" s'inscrit  (V5: "bascule" f2102, -949f)
//   "Kadhafi/Libye" f1284 -> repere LIBYE + pulse effondrement          (V5: "Libye" f2178 / "s'effondre" f2210)
//   "arsenal/armes" f1397-1506 -> trait d'encre Libye->Mali + taches    (V5: "flot d'armes" f2305)
//   "vide"        f2155  -> vide d'Etat (1er signal, avant "deja")      (V5: "absent" f2743)
//   "rancoeurs"   f2740  -> hachures tensions (equivalent le + proche)  (V5: "tensions" f2844)
// ============================================================
const F_2012 = 1153;   // "commence" (etait "bascule" f2102, delta -949f/-31.6s)
const F_LIBYE = 1284;  // "Kadhafi tombe en Libye" (etait f2178, delta -894f/-29.8s)
const F_PULSE = 1350;  // pulse effondrement - entre Libye(1284) et arsenal(1397), pas de mot dedie en V6
const F_TRAIT = 1450;  // "arsenal...armes" -> trait d'encre Libye->Mali + taches (etait f2305, delta -855f/-28.5s)
const F_ABSENT = 2155; // "vide" (etait "absent" f2743, delta -588f/-19.6s)
const F_TENSIONS = 2740; // "rancoeurs" (etait "tensions" f2844, delta -104f/-3.5s)

// Encre parchemin (coherence palette Sahel)
const INK = "#3A2A18";
const INK_DEEP = "#2A1C0E";

// Coordonnees geo (lon, lat)
const LIBYE_LABEL_COORD: [number, number] = [16.0, 27.5];   // sud-Libye (label, zone source)
const LIBYE_SOURCE_COORD: [number, number] = [14.4, 27.0];  // Sebha (foyer de l'effondrement / source armes)

// Route REELLE du trafic d'armes (Aziz: pas de ligne droite). Sebha -> Ghat ->
// Salvador Pass (tri-frontiere) -> NE Mali -> Kidal. Corridor documente.
const ARMS_ROUTE: [number, number][] = [
  [14.4, 27.0],  // Sebha (sud-Libye)
  [10.2, 24.9],  // region Ghat
  [5.8, 21.0],   // Passe de Salvador (Niger/Libye/Algerie)
  [3.0, 19.5],   // nord-est Mali
  [1.44, 18.43], // Kidal (porte d'entree nord Mali)
];
// Coords des 3 villes touchees.
const KIDAL_C: [number, number] = [1.44, 18.43];      // porte d'entree (arrivee trait Libye)
const GAO_C: [number, number] = [-0.04, 16.27];
const TOMBOUCTOU_C: [number, number] = [-3.01, 16.79];

// Foyers d'impact. Kidal = entree (delay 0). Gao/Tombouctou = arrivee de la PROPAGATION
// (delay calé sur l'arrivée des traits secondaires depuis Kidal).
const IMPACTS: { coord: [number, number]; delay: number; name: string; dy: number }[] = [
  { coord: KIDAL_C, delay: 0, name: "KIDAL", dy: -26 },             // arrivee du trait Libye
  { coord: GAO_C, delay: 42, name: "GAO", dy: 30 },                 // arrivee propagation Kidal->Gao
  { coord: TOMBOUCTOU_C, delay: 50, name: "TOMBOUCTOU", dy: -26 },  // arrivee propagation Kidal->Tombouctou
];
// PROPAGATION (Aziz): apres Kidal, 2 traits ROUGE-SOMBRE partent de Kidal vers Gao et
// Tombouctou = contagion interne (distincte du trait d'encre brune = armes venues de Libye).
// Routes legerement courbees (waypoint intermediaire pour eviter la ligne droite).
const PROPAGATION: { route: [number, number][]; startDelay: number; dur: number }[] = [
  { route: [KIDAL_C, [0.6, 17.4], GAO_C], startDelay: 14, dur: 34 },        // Kidal -> Gao
  { route: [KIDAL_C, [-0.9, 17.7], TOMBOUCTOU_C], startDelay: 20, dur: 38 }, // Kidal -> Tombouctou
];
const IMPACT_COLOR = "#8B3A3A"; // rouge-sombre encre (PAS flammes)
const SAHEL_LAND = "#F5EFD6";   // parchemin clair (= SAHEL_COLORS.land) pour halo reserve labels

// Zone du VIDE (rural nord/centre Mali + Liptako) — hachures de tension.
// Polygone geo grossier (lon,lat) couvrant le vide d'Etat.
const VOID_ZONE: [number, number][] = [
  [-3.5, 17.4], [1.8, 18.0], [2.6, 15.4], [0.2, 13.9], [-3.2, 14.6], [-4.2, 16.0],
];

// Helper : construit un path SVG lisse (courbes quadratiques via midpoints) + sa longueur
// approx, depuis une liste de points ecran. Utilise pour le trait Libye ET la propagation.
function buildSmoothPath(pts: { x: number; y: number }[]): { d: string; len: number } {
  if (pts.length < 2) return { d: "", len: 0 };
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L${last.x.toFixed(1)},${last.y.toFixed(1)}`;
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return { d, len };
}

type Props = {
  ctx: SahelRenderContext | null;
};

export const Partie1Origine: React.FC<Props> = ({ ctx }) => {
  if (!ctx) return null;
  const { frame, width, height, project } = ctx;

  // -------- BEAT 1.0 : reperes "2012" (encre qui se remplit) + "LIBYE" --------
  // "2012" : apparait au mot "bascule", mask de remplissage gauche->droite (encre).
  // Corrigé 2026-07-01 (Aziz) : ne reste plus affiché en permanence toute la scène — s'efface
  // au moment du trait d'encre (F_TRAIT), le repère temporel a fait son office, laisse la place à l'action.
  const y2012Fill = interpolate(frame, [F_2012, F_2012 + 24], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const y2012Op = interpolate(frame, [F_2012, F_2012 + 12, F_TRAIT - 20, F_TRAIT], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // "LIBYE" : repere geo-ancre (texte encre opacity 0.6) qui apparait au nommage.
  const libyeOp = interpolate(frame, [F_LIBYE, F_LIBYE + 18], [0, 0.6], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const pLibye = project(LIBYE_LABEL_COORD[0], LIBYE_LABEL_COORD[1]);

  // -------- BEAT 1.1 : pulse Libye (effondrement) --------
  // Onde-radar lente (3 cercles concentriques opacity decroissante), encre, ~2.5s.
  // Apres le pulse, Libye reste "chaude" (teinte fixe legere) = foyer persistant.
  const pSource = project(LIBYE_SOURCE_COORD[0], LIBYE_SOURCE_COORD[1]);
  const RINGS = [0, 18, 36]; // decalage d'amorce entre les 3 ondes (frames)
  const pulseDur = 75; // ~2.5s
  // teinte "chaude" persistante (monte pendant le pulse, reste ensuite)
  const libyeHeat = interpolate(frame, [F_PULSE, F_PULSE + 40], [0, 0.22], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // -------- BEAT 1.2 : trait d'encre Libye->Mali + taches d'impact --------
  // Route reelle projetee en px. Path lisse (courbe quadratique entre waypoints).
  // Trace anime via stroke-dashoffset. Epaisseur degressive source->pointe (via 2 traces).
  const routePx = ARMS_ROUTE.map(([lon, lat]) => project(lon, lat));
  const { d: traitD, len: routeLen } = buildSmoothPath(routePx);
  const traitDur = 70; // ~2.3s pour descendre Libye->Kidal
  const traitT = interpolate(frame, [F_TRAIT, F_TRAIT + traitDur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  // Kidal (entree) tombe a l'arrivee du trait Libye. Les 2 autres villes tombent a
  // l'arrivee de la PROPAGATION (traits rouges depuis Kidal). F_IMPACT = base Kidal.
  const F_IMPACT = F_TRAIT + traitDur - 6;

  // PROPAGATION (Aziz) : 2 traits rouge-sombre Kidal->Gao et Kidal->Tombouctou, qui
  // partent APRES la chute de Kidal (contagion interne). Calcules par frame.
  const propagation = PROPAGATION.map((prop) => {
    const pts = prop.route.map(([lon, lat]) => project(lon, lat));
    const { d, len } = buildSmoothPath(pts);
    const start = F_IMPACT + prop.startDelay;
    const t = interpolate(frame, [start, start + prop.dur], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
    });
    return { d, len, t };
  });

  // -------- BEAT 1.3 : veine persistante + hachures tensions --------
  // Le trait 1.2 -> veine fine (opacity 0.2) persistante apres la pose des taches.
  const veineOp = interpolate(frame, [F_IMPACT + 30, F_IMPACT + 60], [0, 0.2], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Hachures (pattern diagonal) fade-in au mot "tensions" (f2844), dans le vide.
  const hachuresOp = interpolate(frame, [F_TENSIONS, F_TENSIONS + 30], [0, 0.55], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const voidPx = VOID_ZONE.map(([lon, lat]) => project(lon, lat));
  const voidD = voidPx.length
    ? "M" + voidPx.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("L") + "Z"
    : "";

  // -------- DRAPEAU LIBYEN sur le territoire (Aziz 2026-07-01) : le territoire de la Libye se
  // colore aux couleurs du drapeau national à l'apparition du repère "LIBYE", puis s'efface au
  // moment du trait d'encre/zoom (F_TRAIT) — pour ne pas distraire une fois l'action lancée.
  const libyeFlagOp = interpolate(frame, [F_LIBYE, F_LIBYE + 20, F_TRAIT - 16, F_TRAIT], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const libyePx = LIBYE_RING.map(([lon, lat]) => project(lon, lat));
  const libyeD = libyePx.length
    ? "M" + libyePx.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("L") + "Z"
    : "";
  const libyeMinY = libyePx.length ? Math.min(...libyePx.map((p) => p.y)) : 0;
  const libyeMaxY = libyePx.length ? Math.max(...libyePx.map((p) => p.y)) : 0;
  const libyeMinX = libyePx.length ? Math.min(...libyePx.map((p) => p.x)) : 0;
  const libyeMaxX = libyePx.length ? Math.max(...libyePx.map((p) => p.x)) : 0;
  const libyeBandH = (libyeMaxY - libyeMinY) / 3;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <defs>
          {/* mask de remplissage pour "2012" (revele gauche->droite) */}
          <clipPath id="p1-2012-fill">
            <rect x={0} y={0} width={width * y2012Fill} height={height} />
          </clipPath>
          {/* hachures diagonales (tension) — rouge-sombre (visible sur parchemin pale, sens
              'violence/tension' coherent avec les taches). Croisillon: 2 directions. */}
          <pattern id="p1-hachures" width={8} height={8} patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)">
            <line x1={0} y1={0} x2={0} y2={8} stroke={IMPACT_COLOR} strokeWidth={1.8} />
          </pattern>
          {/* clip = zone du vide (pour borner les hachures) */}
          <clipPath id="p1-void-clip">
            {voidD && <path d={voidD} />}
          </clipPath>
          {/* clip = territoire libyen (pour peindre les 3 bandes du drapeau à l'intérieur) */}
          <clipPath id="p1-libye-clip">
            {libyeD && <path d={libyeD} />}
          </clipPath>
        </defs>

        {/* BEAT 1.1 — foyer "chaud" persistant sur la Libye (sous les ondes). */}
        {libyeHeat > 0 && (
          <circle
            cx={pSource.x}
            cy={pSource.y}
            r={46}
            fill={INK_DEEP}
            fillOpacity={libyeHeat}
            style={{ mixBlendMode: "multiply", filter: "blur(10px)" }}
          />
        )}

        {/* BEAT 1.1 — onde-radar effondrement (3 cercles concentriques lents). */}
        {frame >= F_PULSE && frame < F_PULSE + pulseDur + 40 && RINGS.map((delay, i) => {
          const t = interpolate(frame, [F_PULSE + delay, F_PULSE + delay + pulseDur], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
          });
          if (t <= 0 || t >= 1) return null;
          const r = 8 + t * 120;
          const op = (1 - t) * 0.5;
          return (
            <circle
              key={`pulse-${i}`}
              cx={pSource.x}
              cy={pSource.y}
              r={r}
              fill="none"
              stroke={INK_DEEP}
              strokeWidth={2.2 - t * 1.4}
              strokeOpacity={op}
              style={{ mixBlendMode: "multiply" }}
            />
          );
        })}

        {/* BEAT 1.2 — trait d'encre Libye->Mali (route reelle, trace anime). */}
        {traitT > 0 && routeLen > 0 && traitD && (
          <g style={{ mixBlendMode: "multiply" }}>
            {/* trace large attenuee (source epaisse) */}
            <path
              d={traitD}
              fill="none"
              stroke={INK_DEEP}
              strokeWidth={5}
              strokeOpacity={0.18}
              strokeLinecap="round"
              strokeDasharray={routeLen}
              strokeDashoffset={routeLen * (1 - traitT)}
            />
            {/* trace nette (encre) */}
            <path
              d={traitD}
              fill="none"
              stroke={INK_DEEP}
              strokeWidth={2.4}
              strokeOpacity={0.85}
              strokeLinecap="round"
              strokeDasharray={routeLen}
              strokeDashoffset={routeLen * (1 - traitT)}
            />
          </g>
        )}

        {/* BEAT 1.2 — PROPAGATION : traits rouge-sombre Kidal->Gao/Tombouctou (contagion
            interne). Couleur des taches (#8B3A3A) pour distinguer des armes venues de Libye. */}
        {propagation.map((prop, i) =>
          prop.t > 0 && prop.len > 0 && prop.d ? (
            <g key={`prop-${i}`} style={{ mixBlendMode: "multiply" }}>
              <path
                d={prop.d}
                fill="none"
                stroke={IMPACT_COLOR}
                strokeWidth={3.4}
                strokeOpacity={0.22}
                strokeLinecap="round"
                strokeDasharray={prop.len}
                strokeDashoffset={prop.len * (1 - prop.t)}
              />
              <path
                d={prop.d}
                fill="none"
                stroke={IMPACT_COLOR}
                strokeWidth={1.8}
                strokeOpacity={0.8}
                strokeLinecap="round"
                strokeDasharray={prop.len}
                strokeDashoffset={prop.len * (1 - prop.t)}
              />
            </g>
          ) : null
        )}

        {/* BEAT 1.2 — taches d'impact (Kidal/Gao/Tombouctou), scale overshoot decale. */}
        {frame >= F_IMPACT && IMPACTS.map((imp, i) => {
          const p = project(imp.coord[0], imp.coord[1]);
          const t = interpolate(frame, [F_IMPACT + imp.delay, F_IMPACT + imp.delay + 16], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.7)),
          });
          if (t <= 0) return null;
          const r = 13 * Math.min(1.15, t); // overshoot via back easing
          const fall = F_IMPACT + imp.delay; // frame de chute de cette ville
          // PULSE VILLE (Aziz) : onde radar a la chute + teinte persistante apres.
          const cityRings = [0, 16]; // 2 ondes decalees
          // teinte persistante (monte a la chute, reste = zone durablement touchee -> sert le vide d'Etat)
          const cityTint = interpolate(frame, [fall, fall + 24], [0, 0.16], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          return (
            <g key={`impact-${i}`}>
              {/* PULSE VILLE — teinte persistante diffuse (zone touchee durablement) */}
              {cityTint > 0 && (
                <circle cx={p.x} cy={p.y} r={42} fill={IMPACT_COLOR} fillOpacity={cityTint}
                  style={{ mixBlendMode: "multiply", filter: "blur(11px)" }} />
              )}
              {/* PULSE VILLE — onde radar a la chute (2 cercles concentriques) */}
              {frame >= fall && frame < fall + 60 && cityRings.map((delay, ri) => {
                const rt = interpolate(frame, [fall + delay, fall + delay + 42], [0, 1], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
                });
                if (rt <= 0 || rt >= 1) return null;
                return (
                  <circle key={`ring-${ri}`} cx={p.x} cy={p.y} r={10 + rt * 52} fill="none"
                    stroke={IMPACT_COLOR} strokeWidth={2.4 - rt * 1.6} strokeOpacity={(1 - rt) * 0.55}
                    style={{ mixBlendMode: "multiply" }} />
                );
              })}
              <g style={{ mixBlendMode: "multiply" }}>
                {/* halo diffus */}
                <circle cx={p.x} cy={p.y} r={r * 1.8} fill={IMPACT_COLOR} fillOpacity={0.22 * t}
                  style={{ filter: "blur(4px)" }} />
                {/* tache nette */}
                <circle cx={p.x} cy={p.y} r={r} fill={IMPACT_COLOR} fillOpacity={0.7 * t} />
              </g>
              {/* DA-downstream A : micro-label ville (encre), ancre le recit (quelle ville tombe).
                  Halo de reserve parchemin pour lisibilite sur taches/hachures (pas de boite blanche). */}
              <text
                x={p.x}
                y={p.y + imp.dy}
                textAnchor="middle"
                fontFamily="'Cormorant Garamond', Georgia, serif"
                fontSize={19}
                fontWeight={700}
                letterSpacing={2}
                fill={INK_DEEP}
                fillOpacity={t}
                stroke={SAHEL_LAND}
                strokeWidth={3}
                strokeOpacity={0.7 * t}
                paintOrder="stroke"
                style={{ mixBlendMode: "normal" }}
              >
                {imp.name}
              </text>
            </g>
          );
        })}

        {/* BEAT 1.3 — veine persistante (le trait 1.2 attenue, reste a l'ecran). */}
        {veineOp > 0 && traitD && (
          <path d={traitD} fill="none" stroke={INK_DEEP} strokeWidth={1.4}
            strokeOpacity={veineOp} strokeLinecap="round" style={{ mixBlendMode: "multiply" }} />
        )}

        {/* BEAT 1.3 — hachures de tension dans le vide d'Etat. Teinte rouge diffuse SOUS
            les hachures = la zone "respire" la tension meme avant que les traits se lisent. */}
        {hachuresOp > 0 && voidD && (
          <g clipPath="url(#p1-void-clip)" style={{ mixBlendMode: "multiply" }}>
            {/* teinte diffuse */}
            <path d={voidD} fill={IMPACT_COLOR} fillOpacity={0.10 * hachuresOp} />
            {/* hachures */}
            <g opacity={hachuresOp}>
              <path d={voidD} fill="url(#p1-hachures)" />
            </g>
          </g>
        )}

        {/* "2012" — cartouche date en encre, ancre bas-gauche (ou la timeline Acte 1
            etait). Se remplit au mot "bascule". Repere temporel du redemarrage du recit. */}
        {y2012Op > 0 && (
          <g opacity={y2012Op} style={{ mixBlendMode: "multiply" }}>
            {/* trace fantome (toujours visible une fois pose) */}
            <text
              x={120}
              y={height - 70}
              fontFamily="'Cormorant Garamond', Georgia, serif"
              fontSize={64}
              fontWeight={700}
              fill={INK}
              fillOpacity={0.18}
              letterSpacing={4}
            >
              2012
            </text>
            {/* remplissage encre (clip anime) */}
            <text
              x={120}
              y={height - 70}
              fontFamily="'Cormorant Garamond', Georgia, serif"
              fontSize={64}
              fontWeight={700}
              fill={INK_DEEP}
              letterSpacing={4}
              clipPath="url(#p1-2012-fill)"
            >
              2012
            </text>
          </g>
        )}

        {/* TERRITOIRE LIBYEN colore au drapeau national (Aziz 2026-07-01) : 3 bandes horizontales
            rouge/noir/vert + croissant+etoile blanche sur la bande noire, clippees au contour reel
            du pays. Apparait avec le repere LIBYE, s'efface au trait d'encre (F_TRAIT). */}
        {libyeFlagOp > 0.01 && libyeD && (
          <g opacity={libyeFlagOp} clipPath="url(#p1-libye-clip)" style={{ mixBlendMode: "multiply" }}>
            <rect x={libyeMinX} y={libyeMinY} width={libyeMaxX - libyeMinX} height={libyeBandH} fill="#E4312B" />
            <rect x={libyeMinX} y={libyeMinY + libyeBandH} width={libyeMaxX - libyeMinX} height={libyeBandH} fill="#1A1A1A" />
            <rect x={libyeMinX} y={libyeMinY + libyeBandH * 2} width={libyeMaxX - libyeMinX} height={libyeBandH} fill="#237F52" />
            {/* croissant + etoile blanche, centres sur la bande noire */}
            {(() => {
              const cx = (libyeMinX + libyeMaxX) / 2;
              const cy = libyeMinY + libyeBandH * 1.5;
              const r = Math.min(libyeMaxX - libyeMinX, libyeBandH) * 0.16;
              return (
                <g fill="#FFFFFF">
                  <circle cx={cx} cy={cy} r={r} />
                  <circle cx={cx + r * 0.5} cy={cy} r={r * 0.82} fill="#1A1A1A" />
                  <polygon points={
                    Array.from({ length: 5 }).map((_, i) => {
                      const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
                      const px = cx + r * 1.7 + Math.cos(a) * r * 0.42;
                      const py = cy + Math.sin(a) * r * 0.42;
                      return `${px.toFixed(1)},${py.toFixed(1)}`;
                    }).join(" ")
                  } />
                </g>
              );
            })()}
          </g>
        )}

        {/* "LIBYE" — repere geo-ancre sur la zone sud-libyenne (source). */}
        {libyeOp > 0 && (
          <g opacity={libyeOp} style={{ mixBlendMode: "multiply" }}>
            <text
              x={pLibye.x}
              y={pLibye.y}
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', Georgia, serif"
              fontSize={30}
              fontWeight={700}
              fill={INK_DEEP}
              letterSpacing={6}
            >
              LIBYE
            </text>
            {/* petit tiret de reperage sous le label */}
            <line
              x1={pLibye.x - 26}
              y1={pLibye.y + 10}
              x2={pLibye.x + 26}
              y2={pLibye.y + 10}
              stroke={INK_DEEP}
              strokeWidth={1.5}
              strokeOpacity={0.8}
            />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
