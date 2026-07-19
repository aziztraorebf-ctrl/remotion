// A1 — PROTO globe orthographique 16:9 (D3 geoOrthographic frame-driven).
// Intention : SITUER / donner l'echelle planetaire. Le globe tourne depuis l'Atlantique et amene
// le Sahel au centre, la grille tourne avec lui, puis le trio (Mali/Niger/Burkina) s'illumine
// facon AES (drapeaux-couleur + halo) pour raccorder au vocabulaire vertical existant.
//
// Ce que ce proto PROUVE (nouveau vocabulaire D3, jamais fait) :
//  1. geoOrthographic().rotate([lambda,phi]) pilote par useCurrentFrame (rotation continue).
//  2. Le clip natif de l'hemisphere cache (les pays derriere le globe disparaissent tout seuls).
//  3. Sphere + graticule + halo atmospherique — le globe "vit".
//  4. Transition d'echelle : de la planete au fait geographique local (le Sahel qui s'allume).
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

export const GLOBE_SAHEL_FRAMES = 270; // 9s @30fps

const BG = "#0b1220";
const OCEAN = "#16233f";
const LAND = "#26375f";
const LAND_STROKE = "#3a5486";
const GRAT = "#2b3f66";

// Trio Sahel : couleur d'accent facon AES (on ne remplit pas le drapeau ici, juste un accent chaud).
const TRIO = ["Mali", "Niger", "Burkina Faso"];
const TRIO_FILL = "#c9a23a"; // or sahelien
const TRIO_STROKE = "#f0d478";

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const GlobeSahel16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- ROTATION frame-driven -------------------------------------------------
  // Depart : centre sur l'Atlantique (lon ~ -40) pour un plan d'ouverture "vu de l'espace".
  // Arrivee : centre sur le Sahel (SAHEL_TARGET).
  const startLon = -40;
  const startLat = 12;
  const targetLon = SAHEL_TARGET[0];
  const targetLat = SAHEL_TARGET[1];

  // La rotation se fait entre f=15 et f=175 (le reste = respiration + illumination).
  const pRot = interpolate(frame, [15, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const e = easeInOut(pRot);
  const curLon = startLon + (targetLon - startLon) * e;
  const curLat = startLat + (targetLat - startLat) * e;

  // rotate d3 = [-lon, -lat] pour amener (lon,lat) au centre.
  const rotLambda = -curLon;
  const rotPhi = -curLat;

  const proj = orthoAt(rotLambda, rotPhi);
  const path = pathOf(proj);

  // sphere (outline du globe) + graticule
  const sphere = path({ type: "Sphere" } as any) || "";
  const grat = path(GRATICULE as any) || "";

  // --- illumination Sahel (apres l'arrivee) ---------------------------------
  const glow = spring({ frame: frame - 180, fps, config: { damping: 200, mass: 0.8 } });

  // --- respiration finale : leger zoom-in continu apres arrivee -------------
  // (le globe se rapproche tres doucement, sensation de plongee)
  const settleScale = interpolate(frame, [175, 270], [1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // fade in global
  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  const feats = worldFeatures();
  const trioFeats = TRIO.map(featureByName).filter(Boolean) as any[];

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{
            transform: `scale(${settleScale})`,
            transformOrigin: "50% 50%",
          }}
        >
          <defs>
            {/* halo atmospherique autour du globe */}
            <radialGradient id="atmo" cx="50%" cy="50%" r="50%">
              <stop offset="82%" stopColor="#3a60b0" stopOpacity="0" />
              <stop offset="94%" stopColor="#4a7fd0" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#4a7fd0" stopOpacity="0" />
            </radialGradient>
            {/* ombrage spherique de l'ocean (plus clair au centre-haut, sombre en bas) */}
            <radialGradient id="oceanShade" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor="#1d3055" />
              <stop offset="70%" stopColor={OCEAN} />
              <stop offset="100%" stopColor="#0f1a30" />
            </radialGradient>
            {/* glow radial du trio */}
            <radialGradient id="trioGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={TRIO_FILL} stopOpacity="0.55" />
              <stop offset="100%" stopColor={TRIO_FILL} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* HALO atmospherique (disque un peu plus grand que le globe) */}
          <circle cx={W / 2} cy={H / 2} r={GLOBE_R + 26} fill="url(#atmo)" />

          {/* OCEAN (la sphere pleine) */}
          <path d={sphere} fill="url(#oceanShade)" stroke="#4a7fd0" strokeWidth={1.5} strokeOpacity={0.6} />

          {/* GRATICULE (grille qui tourne avec le globe) */}
          <path d={grat} fill="none" stroke={GRAT} strokeWidth={0.8} strokeOpacity={0.55} />

          {/* PAYS (le clip ortho retire nativement l'hemisphere cache) */}
          {feats.map((f, i) => {
            const d = path(f as any);
            if (!d) return null;
            const isTrio = TRIO.includes(f.properties.name);
            if (isTrio) return null; // dessine au-dessus avec accent
            return (
              <path
                key={i}
                d={d}
                fill={LAND}
                stroke={LAND_STROKE}
                strokeWidth={0.5}
                strokeOpacity={0.7}
              />
            );
          })}

          {/* TRIO Sahel — accent chaud qui s'illumine */}
          {trioFeats.map((f, i) => {
            const d = path(f as any);
            if (!d) return null;
            return (
              <path
                key={`trio-${i}`}
                d={d}
                fill={TRIO_FILL}
                fillOpacity={0.25 + 0.65 * glow}
                stroke={TRIO_STROKE}
                strokeWidth={0.8 + 1.4 * glow}
                strokeOpacity={0.5 + 0.5 * glow}
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* Titre bas — registre AES (surtitre + accent) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 70,
          textAlign: "center",
          opacity: interpolate(frame, [190, 215], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontFamily: "'Archivo', 'Arial Narrow', sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            color: "#8fa3c8",
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          AU CŒUR DU SAHEL
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, color: "#f0d478", letterSpacing: 1 }}>
          TROIS PAYS, UNE BASCULE
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default GlobeSahel16x9;
