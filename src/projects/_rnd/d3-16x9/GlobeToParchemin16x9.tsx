// A1-K1 — PROTO raccord GLOBE -> CARTE PARCHEMIN AES (D3 pur, 16:9).
// Prolonge A1 : le globe orthographique tourne, amene le Sahel au centre, PUIS se "deplie" en
// carte plate facon video LONGUE AES (fond parchemin, trio vide en creme, contours colores par pays).
//
// METHODE du raccord (continue, une seule projection, zero crossfade) :
//  - On garde geoOrthographic tout du long.
//  - Phase 3 : on AUGMENTE le scale de l'ortho (zoom-in) jusqu'a ce que la courbure du globe
//    devienne imperceptible => un globe tres zoome EST visuellement une carte plate.
//  - En parallele : palette bleu-marine -> parchemin (lerp hex), l'ocean vire bleu-gris pale,
//    le trio se remplit en creme lumineux, les contours colores par pays apparaissent, le
//    reste du monde (parchemin sombre) recule.
// Palette AES longue reelle (extraite du code Partie1Origine / ProtoSilhouetteRiseFx) :
//   land parchemin #F5EFD6 · ocean #C8D9E0 · encre #3A2A18.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import {
  W,
  H,
  GLOBE_R,
  SAHEL_TARGET,
  GRATICULE,
  worldFeatures,
  featureByName,
  orthoAt,
  pathOf,
} from "./globeGeo";

export const GLOBE_PARCHEMIN_FRAMES = 390; // 13s @30fps

// --- palettes (etat GLOBE bleu -> etat CARTE parchemin) ---------------------
const G = {
  bg: "#0b1220",
  ocean: "#16233f",
  land: "#26375f",
  landStroke: "#3a5486",
  grat: "#2b3f66",
  atmo: "#4a7fd0",
};
const P = {
  bg: "#b8ac93", // parchemin sombre (hors-sujet) — le "monde" recule dans ce ton
  ocean: "#c8d9e0", // ocean AES longue
  land: "#cfc4a8", // terres hors-sujet, parchemin neutre
  landStroke: "#8a7c60",
  grat: "#b0a488",
  atmo: "#c8d9e0",
};
const CREME = "#f5efd6"; // trio "vide" — parchemin clair lumineux (SAHEL_LAND)
const INK = "#3a2a18"; // encre contours

// contours colores par pays (registre AES longue)
const TRIO_STROKE: Record<string, string> = {
  Mali: "#d98a2b", // orange
  "Burkina Faso": "#c0392b", // rouge
  Niger: "#2e9e6b", // vert/turquoise
};
const TRIO = ["Mali", "Burkina Faso", "Niger"];

// lerp hex simple
const hx = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const lerpHex = (a: string, b: string, t: number) => {
  const A = hx(a), B = hx(b);
  const r = Math.round(A[0] + (B[0] - A[0]) * t);
  const g = Math.round(A[1] + (B[1] - A[1]) * t);
  const bl = Math.round(A[2] + (B[2] - A[2]) * t);
  return `rgb(${r},${g},${bl})`;
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// centre du trio en lon/lat (pour ancrer le zoom-in du deplie)
const TRIO_CENTER: [number, number] = [1.0, 15.5]; // approx centre Mali-Niger-Burkina

export const GlobeToParchemin16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ===================== TIMELINE ==========================================
  // 0-15    : fade in
  // 15-150  : ROTATION Atlantique -> Sahel (globe bleu)
  // 150-175 : petit temps de pose (globe centre Sahel)
  // 175-290 : DEPLIE = zoom-in ortho + palette bleu->parchemin + trio se vide + contours colores
  // 290-390 : carte parchemin plate finale (respiration, drapeaux)
  const startLon = -40, startLat = 12;
  const targetLon = SAHEL_TARGET[0], targetLat = SAHEL_TARGET[1];

  const pRot = interpolate(frame, [15, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eRot = easeInOut(pRot);

  // Phase deplie
  const pUnroll = interpolate(frame, [175, 290], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eUnroll = easeInOut(pUnroll);

  // Pendant le deplie, on recentre la rotation exactement sur le trio (pas le centroide monde).
  const curLon = startLon + (targetLon - startLon) * eRot + (TRIO_CENTER[0] - targetLon) * eUnroll;
  const curLat = startLat + (targetLat - startLat) * eRot + (TRIO_CENTER[1] - targetLat) * eUnroll;

  // SCALE ortho : rayon de base -> gros zoom (la courbure disparait). On multiplie par ~6.5.
  const scaleMul = 1 + 5.5 * eUnroll;
  const proj = orthoAt(-curLon, -curLat).scale(GLOBE_R * scaleMul);
  const path = pathOf(proj);

  // palette interpolee selon le deplie
  const bg = lerpHex(G.bg, P.bg, eUnroll);
  const ocean = lerpHex(G.ocean, P.ocean, eUnroll);
  const land = lerpHex(G.land, P.land, eUnroll);
  const landStroke = lerpHex(G.landStroke, P.landStroke, eUnroll);
  const gratCol = lerpHex(G.grat, P.grat, eUnroll);

  // sphere + graticule (le graticule s'efface pendant le deplie — la carte plate n'en a pas besoin)
  const sphere = path({ type: "Sphere" } as any) || "";
  const grat = path(GRATICULE as any) || "";
  const gratOpacity = interpolate(eUnroll, [0, 0.6], [0.55, 0], { extrapolateRight: "clamp" });

  // trio : passe de "dore accent" (globe) a "creme vide + contour colore" (carte)
  const trioFill = lerpHex("#c9a23a", CREME, eUnroll); // or -> creme
  const feats = worldFeatures();
  const trioFeats = TRIO.map(featureByName).filter(Boolean) as any[];

  // halo atmospherique s'efface au deplie
  const atmoOpacity = interpolate(eUnroll, [0, 0.5], [1, 0], { extrapolateRight: "clamp" });

  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  // drapeaux + titre : apparaissent en fin (carte plate installee)
  const flagSpring = spring({ frame: frame - 300, fps, config: { damping: 200, mass: 0.7 } });
  const titleOp = interpolate(frame, [315, 340], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // positions projetees des capitales pour planter les drapeaux (en fin)
  const flagAnchors: { name: string; lonlat: [number, number]; colors: string[] }[] = [
    { name: "Mali", lonlat: [-8.0, 12.65], colors: ["#14b53a", "#fcd116", "#ce1126"] },
    { name: "Burkina Faso", lonlat: [-1.52, 12.37], colors: ["#ce1126", "#009e49"] },
    { name: "Niger", lonlat: [2.11, 13.51], colors: ["#e05206", "#ffffff", "#0db02b"] },
  ];

  return (
    <AbsoluteFill style={{ background: bg }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <radialGradient id="atmo2" cx="50%" cy="50%" r="50%">
              <stop offset="82%" stopColor={G.atmo} stopOpacity="0" />
              <stop offset="94%" stopColor={G.atmo} stopOpacity="0.5" />
              <stop offset="100%" stopColor={G.atmo} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="oceanShade2" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor={lerpHex("#1d3055", P.ocean, eUnroll)} />
              <stop offset="70%" stopColor={ocean} />
              <stop offset="100%" stopColor={lerpHex("#0f1a30", "#b9cdd6", eUnroll)} />
            </radialGradient>
          </defs>

          {/* HALO (globe uniquement) */}
          <circle cx={W / 2} cy={H / 2} r={GLOBE_R + 26} fill="url(#atmo2)" opacity={atmoOpacity} />

          {/* OCEAN / sphere */}
          <path d={sphere} fill="url(#oceanShade2)" stroke={G.atmo} strokeWidth={1.5} strokeOpacity={0.6 * atmoOpacity} />

          {/* GRATICULE (s'efface au deplie) */}
          <path d={grat} fill="none" stroke={gratCol} strokeWidth={0.8} strokeOpacity={gratOpacity} />

          {/* MONDE hors-sujet */}
          {feats.map((f, i) => {
            if (TRIO.includes(f.properties.name)) return null;
            const d = path(f as any);
            if (!d) return null;
            return <path key={i} d={d} fill={land} stroke={landStroke} strokeWidth={0.5} strokeOpacity={0.7} />;
          })}

          {/* TRIO : creme vide + contour colore par pays qui s'intensifie au deplie */}
          {trioFeats.map((f, i) => {
            const d = path(f as any);
            if (!d) return null;
            const stroke = lerpHex("#f0d478", TRIO_STROKE[f.properties.name] || INK, eUnroll);
            return (
              <path
                key={`trio-${i}`}
                d={d}
                fill={trioFill}
                fillOpacity={0.35 + 0.55 * eUnroll}
                stroke={stroke}
                strokeWidth={1 + 3.5 * eUnroll}
                strokeOpacity={0.6 + 0.4 * eUnroll}
                strokeLinejoin="round"
              />
            );
          })}

          {/* DRAPEAUX plantes sur mats (fin, carte plate) */}
          {flagSpring > 0.01 &&
            flagAnchors.map((fa) => {
              const p = proj(fa.lonlat as any);
              if (!p) return null;
              const [x, y] = p;
              const fw = 66, fh = 44, mastH = 60;
              const bandH = fh / fa.colors.length;
              return (
                <g key={fa.name} transform={`translate(${x},${y})`} opacity={flagSpring}>
                  {/* mat */}
                  <line x1={0} y1={0} x2={0} y2={-mastH} stroke={INK} strokeWidth={2.5} />
                  {/* drapeau (bandes horizontales, ancre en haut du mat) */}
                  <g transform={`translate(2,${-mastH})`}>
                    {fa.colors.map((c, ci) => (
                      <rect key={ci} x={0} y={ci * bandH} width={fw} height={bandH} fill={c} />
                    ))}
                    <rect x={0} y={0} width={fw} height={fh} fill="none" stroke={INK} strokeWidth={1} />
                  </g>
                </g>
              );
            })}
        </svg>
      </AbsoluteFill>

      {/* Titre final — registre AES longue (parchemin) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 90,
          textAlign: "center",
          opacity: titleOp,
          fontFamily: "'Archivo', 'Arial Narrow', sans-serif",
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 7, color: "#6b5a3f", fontWeight: 700, marginBottom: 6 }}>
          2024 · LA BASCULE
        </div>
        <div style={{ fontSize: 60, fontWeight: 900, color: "#3a2a18", letterSpacing: 1 }}>
          TROIS PAYS QUITTENT L'ORBITE
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default GlobeToParchemin16x9;
