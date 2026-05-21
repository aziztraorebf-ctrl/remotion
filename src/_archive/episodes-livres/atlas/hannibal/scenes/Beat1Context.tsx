// Beat 1 — Contexte : 218 av. J.-C., Hannibal choisit le nord
// Architecture 2 couches (pattern S3 Mansa Moussa / Beat3 Ghana) :
//   Couche 1 : SVG carte avec camZoom via <g transform> — zoom 2.8x sur POI
//   Couche 2 : CSS assets (Colisée, drapeau, labels) positionnés via svgToComp()
// Timings calés sur Whisper word-level

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { HANNIBAL_PALETTE, HANNIBAL_FONTS, HANNIBAL_LETTERSPACING } from "../components/HannibalPalette";
import { BEATS, DURATIONS } from "../timing";
import {
  svgToComp,
  focusOffsetForPOI,
  ATLAS_SVG_W as SVG_W,
  ATLAS_SVG_H as SVG_H,
  ATLAS_CSS_SCALE as CSS_SCALE,
  ATLAS_CX as CX,
  ATLAS_CY as CY,
} from "../../_shared/atlas-components";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const hannibalData = require("../../../../../data/geo/hannibal-data.json");

const COMP_W = 1080;
const COMP_H = 1920;

const view = hannibalData.views.context;
const countries = view.countries as { iso: string; d: string }[];
const poi = view.poi;
const routePath = view.route as string;
const ROUTE_LENGTH = 700;

// === Coords POI en espace SVG 720×1280 (scale depuis 1080×1920) ===
// Les coords JSON sont en 1080×1920 → diviser par CSS_SCALE (1.5)
const ROME_SVG_X  = poi.ROME.x          / CSS_SCALE; // 775/1.5 = 517
const ROME_SVG_Y  = poi.ROME.y          / CSS_SCALE; // 1228/1.5 = 819
const CART_SVG_X  = poi.CARTHAGO_NOVA.x / CSS_SCALE; // 352/1.5 = 235
const CART_SVG_Y  = poi.CARTHAGO_NOVA.y / CSS_SCALE; // 1404/1.5 = 936
const PYR_SVG_X   = poi.PYRENEES.x      / CSS_SCALE; // 438/1.5 = 292
const PYR_SVG_Y   = poi.PYRENEES.y      / CSS_SCALE; // 1203/1.5 = 802

// === Timings calés sur Whisper word-level (frames relatifs Beat 1) ===
// f+0   "Nous sommes..."  → vue large
// f+75  avant "Hannibal" → zoom Carthagène commence
// f+80  "Hannibal Barca" → camZoom 2.8x sur Carthagène
// f+235 "Rome"           → whiplash focus Rome
// f+280 "au sud"         → retour Carthagène
// f+304 "Il choisit"     → route commence
// f+349 "les Alpes"      → freeze Pyrénées
const CARTOUCHE_IN    = 10;
const ZOOM_CART_START = 75;
const ZOOM_CART_END   = 110;
const ROME_IN         = 230;
const ROME_PEAK       = 255;
const ROME_OUT        = 278;
const CART_RETURN_END = 300;
const ROUTE_START     = 304;
const ROUTE_END       = 380;
const FREEZE_AT       = 349;
const CARTOUCHE_OUT   = 370;

// Grille lon/lat (espace SVG)
const GRID_LON = [-10, -5, 0, 5, 10, 15, 20];
const GRID_LAT = [30, 35, 40, 45, 50];
const dLon = ROME_SVG_X - CART_SVG_X;
const gLon = poi.ROME.lon - poi.CARTHAGO_NOVA.lon;
const dLat = ROME_SVG_Y - CART_SVG_Y;
const gLat = poi.ROME.lat - poi.CARTHAGO_NOVA.lat;
const pxPerLon = dLon / gLon;
const pxPerLat = dLat / gLat;
function lonToX(lon: number) { return CART_SVG_X + (lon - poi.CARTHAGO_NOVA.lon) * pxPerLon; }
function latToY(lat: number) { return CART_SVG_Y + (lat - poi.CARTHAGO_NOVA.lat) * pxPerLat; }

// === Camera state ===
function computeCamera(frame: number) {
  const driftX = Math.sin(frame * 0.008) * 2;
  const driftY = Math.cos(frame * 0.006) * 1.5;

  // Focus point (coordonnées SVG)
  let focusX = CX;
  let focusY = CY;
  let camZoom = 1.0;

  if (frame < ZOOM_CART_START) {
    // Vue large, micro-drift
    focusX = CX;
    focusY = CY;
    camZoom = 1.0;
  } else if (frame < ZOOM_CART_END) {
    // Zoom vers Carthagène : 1.0 → 2.8x
    const t = interpolate(frame, [ZOOM_CART_START, ZOOM_CART_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    focusX = CX + (CART_SVG_X - CX) * t;
    focusY = CY + (CART_SVG_Y - CY) * t;
    camZoom = interpolate(t, [0, 1], [1.0, 2.8]);
  } else if (frame < ROME_IN) {
    // Hold Carthagène 2.8x
    focusX = CART_SVG_X;
    focusY = CART_SVG_Y;
    camZoom = 2.8;
  } else if (frame < ROME_PEAK) {
    // Whiplash vers Rome — focusOffsetForPOI() décale -100px pour garder Rome visible tiers droit
    const ROME_FOCUS_X = focusOffsetForPOI(ROME_SVG_X, 2.8); // 417
    const ROME_FOCUS_Y = ROME_SVG_Y - 20;
    const t = interpolate(frame, [ROME_IN, ROME_PEAK], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    focusX = CART_SVG_X + (ROME_FOCUS_X - CART_SVG_X) * t;
    focusY = CART_SVG_Y + (ROME_FOCUS_Y - CART_SVG_Y) * t;
    camZoom = 2.8;
  } else if (frame < ROME_OUT) {
    // Hold Rome
    focusX = focusOffsetForPOI(ROME_SVG_X, 2.8);
    focusY = ROME_SVG_Y - 20;
    camZoom = 2.8;
  } else if (frame < CART_RETURN_END) {
    // Retour Carthagène depuis focus Rome décalé
    const ROME_FOCUS_X = focusOffsetForPOI(ROME_SVG_X, 2.8);
    const t = interpolate(frame, [ROME_OUT, CART_RETURN_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    focusX = ROME_FOCUS_X + (CART_SVG_X - ROME_FOCUS_X) * t;
    focusY = (ROME_SVG_Y - 20)  + (CART_SVG_Y - (ROME_SVG_Y - 20))  * t;
    camZoom = 2.8;
  } else if (frame < FREEZE_AT) {
    // Route trace — pan Carthagène → Pyrénées
    const t = interpolate(frame, [ROUTE_START, ROUTE_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    focusX = CART_SVG_X + (PYR_SVG_X - CART_SVG_X) * t;
    focusY = CART_SVG_Y + (PYR_SVG_Y - CART_SVG_Y) * t;
    camZoom = 2.8;
  } else {
    // Freeze Pyrénées — léger pull-back
    focusX = PYR_SVG_X;
    focusY = PYR_SVG_Y;
    camZoom = 2.5;
  }

  return { focusX, focusY, camZoom, driftX, driftY };
}

export const Beat1Context: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = computeCamera(frame);

  // === ROUTE ===
  const routeReveal = interpolate(frame, [ROUTE_START, ROUTE_END], [ROUTE_LENGTH, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const routeOpacity = interpolate(frame, [ROUTE_START, ROUTE_START + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // === POI opacités ===
  const cartagenaOpacity = interpolate(
    frame,
    [CARTOUCHE_IN, CARTOUCHE_IN + 20, ROME_IN + 5, ROME_IN + 20, ROME_OUT - 10, ROME_OUT + 5],
    [0, 1, 0.1, 0.1, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const romeOpacity = interpolate(
    frame,
    [ROME_IN, ROME_IN + 15, ROME_OUT - 10, ROME_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const pyreneesOpacity = interpolate(frame, [FREEZE_AT - 20, FREEZE_AT + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cartagenaPulse = 1 + Math.sin(frame * 0.12) * 0.04;
  const freezePulse = frame >= FREEZE_AT ? 1 + Math.sin((frame - FREEZE_AT) * 0.2) * 0.06 : 1;

  // === SPRITE HANNIBAL ===
  const hannibalOpacity = interpolate(
    frame,
    [CARTOUCHE_IN, CARTOUCHE_IN + 20, ROUTE_START - 15, ROUTE_START],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const SPRITE_SIZE = 32;

  // === CARTOUCHE UI ===
  const cartoucheOpacity = interpolate(
    frame,
    [CARTOUCHE_IN, CARTOUCHE_IN + 20, CARTOUCHE_OUT, CARTOUCHE_OUT + 20],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const freezeLabelOpacity = frame >= FREEZE_AT
    ? interpolate(frame, [FREEZE_AT, FREEZE_AT + 20], [0, 1], { extrapolateRight: "clamp" })
    : 0;

  // === Positions CSS des assets (via svgToComp) ===
  const cartPos   = svgToComp(CART_SVG_X, CART_SVG_Y, cam);
  const romePos   = svgToComp(ROME_SVG_X, ROME_SVG_Y, cam);
  const pyrPos    = svgToComp(PYR_SVG_X, PYR_SVG_Y, cam);
  const hannibalPos = svgToComp(CART_SVG_X, CART_SVG_Y - 24, cam);

  // Taille des assets scalée avec le zoom
  const assetZoom = cam.camZoom * CSS_SCALE;

  return (
    <AbsoluteFill style={{ backgroundColor: HANNIBAL_PALETTE.NOIR_GUERRE }}>
      <Audio src={staticFile("hannibal/audio/narration-v2.mp3")} startFrom={BEATS.beat1} endAt={BEATS.beat2} />
      <Audio src={staticFile("hannibal/audio/music/v1-A-marche-punique.mp3")} volume={0.15} />

      {/* === COUCHE 1 : Carte SVG avec camZoom via <g transform> === */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
      >
        <g transform={`translate(${CX + cam.driftX} ${CY + cam.driftY}) scale(${cam.camZoom}) translate(${-cam.focusX} ${-cam.focusY})`}>
          {/* Fond mer */}
          <rect x={-SVG_W * 5} y={-SVG_H * 5} width={SVG_W * 11} height={SVG_H * 11} fill={HANNIBAL_PALETTE.MER} />

          {/* Grille lon/lat */}
          {GRID_LON.map((lon) => {
            const x = lonToX(lon);
            return <line key={`lon${lon}`} x1={x} y1={-SVG_H * 3} x2={x} y2={SVG_H * 4} stroke="#FFFFFF" strokeWidth={0.3} strokeOpacity={0.10} strokeDasharray="3 8" />;
          })}
          {GRID_LAT.map((lat) => {
            const y = latToY(lat);
            return <line key={`lat${lat}`} x1={-SVG_W * 3} y1={y} x2={SVG_W * 4} y2={y} stroke="#FFFFFF" strokeWidth={0.3} strokeOpacity={0.10} strokeDasharray="3 8" />;
          })}

          {/* Pays — les paths JSON sont en 1080×1920, on les scale à 720×1280 */}
          <g transform={`scale(${1 / CSS_SCALE})`}>
            {countries.map((c: { iso: string; d: string }) => {
              const zoneNarrative = ["ESP", "FRA", "ITA", "CHE"].includes(c.iso);
              const afriqueNord = ["MAR", "DZA", "TUN", "LBY"].includes(c.iso);
              const fill = zoneNarrative ? "#D4C8B0" : afriqueNord ? "#C0AE88" : "#B8A882";
              return <path key={c.iso} d={c.d} fill={fill} stroke="#6A5E4A" strokeWidth={1.0} strokeOpacity={0.9} />;
            })}

            {/* Route */}
            <path d={routePath} fill="none" stroke={HANNIBAL_PALETTE.ROUTE_GLOW} strokeWidth={9} strokeOpacity={routeOpacity * 0.25} strokeLinecap="round" />
            <path d={routePath} fill="none" stroke={HANNIBAL_PALETTE.ROUTE} strokeWidth={5} strokeOpacity={routeOpacity} strokeLinecap="round" strokeDasharray={ROUTE_LENGTH} strokeDashoffset={routeReveal} />

            {/* POI dots — Carthagène */}
            <g opacity={cartagenaOpacity}>
              <circle cx={poi.CARTHAGO_NOVA.x} cy={poi.CARTHAGO_NOVA.y} r={15 * cartagenaPulse} fill={HANNIBAL_PALETTE.CARTHAGE} opacity={0.25} />
              <circle cx={poi.CARTHAGO_NOVA.x} cy={poi.CARTHAGO_NOVA.y} r={7 * cartagenaPulse} fill={HANNIBAL_PALETTE.CARTHAGE_VIF} />
            </g>

            {/* POI dot — Rome */}
            <g opacity={romeOpacity}>
              <circle cx={poi.ROME.x} cy={poi.ROME.y} r={12} fill={HANNIBAL_PALETTE.ROME} opacity={0.3} />
              <circle cx={poi.ROME.x} cy={poi.ROME.y} r={6} fill={HANNIBAL_PALETTE.ROME_VIF} />
            </g>

            {/* POI dot — Pyrénées */}
            <g opacity={pyreneesOpacity}>
              <circle cx={poi.PYRENEES.x} cy={poi.PYRENEES.y} r={5 * freezePulse} fill={HANNIBAL_PALETTE.ROUTE_GLOW} />
            </g>
          </g>
        </g>
      </svg>

      {/* === COUCHE 2 : Assets CSS positionnés via svgToComp (zoom 2.8x réel) === */}

      {/* Drapeau carthaginois */}
      <div style={{ position: "absolute", opacity: cartagenaOpacity, left: cartPos.x - 12 * cam.camZoom, top: cartPos.y - 84 * cam.camZoom, pointerEvents: "none" }}>
        <Img src={staticFile("hannibal/assets/map-objects/drapeau-carthaginois.png")} width={32 * cam.camZoom} height={48 * cam.camZoom} style={{ imageRendering: "pixelated" }} />
      </div>

      {/* Sprite Hannibal */}
      <div style={{ position: "absolute", opacity: hannibalOpacity, left: hannibalPos.x - SPRITE_SIZE * cam.camZoom / 2, top: hannibalPos.y - SPRITE_SIZE * cam.camZoom, pointerEvents: "none" }}>
        <Img src={staticFile("_lab-hannibal/sprites/hannibal/east.png")} width={SPRITE_SIZE * cam.camZoom} height={SPRITE_SIZE * cam.camZoom} style={{ imageRendering: "pixelated" }} />
      </div>

      {/* Label Carthagène */}
      <div style={{
        position: "absolute",
        opacity: cartagenaOpacity,
        left: cartPos.x - 68 * cam.camZoom,
        top: cartPos.y + 10 * cam.camZoom,
        pointerEvents: "none",
        backgroundColor: "rgba(10,10,18,0.85)",
        borderRadius: 4,
        padding: `${4 * cam.camZoom}px ${10 * cam.camZoom}px`,
      }}>
        <span style={{ fontFamily: HANNIBAL_FONTS.SERIF, fontSize: 18 * cam.camZoom, color: HANNIBAL_PALETTE.CARTHAGE_VIF, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
          Carthagène
        </span>
      </div>

      {/* Colisée Rome */}
      <div style={{ position: "absolute", opacity: romeOpacity, left: romePos.x - 48 * cam.camZoom, top: romePos.y - 135 * cam.camZoom, pointerEvents: "none" }}>
        <Img src={staticFile("hannibal/assets/map-objects/rome-city.png")} width={96 * cam.camZoom} height={96 * cam.camZoom} style={{ imageRendering: "pixelated" }} />
      </div>

      {/* Aigle SPQR */}
      <div style={{ position: "absolute", opacity: romeOpacity, left: romePos.x + 52 * cam.camZoom, top: romePos.y - 147 * cam.camZoom, pointerEvents: "none" }}>
        <Img src={staticFile("hannibal/assets/map-objects/aigle-romain.png")} width={32 * cam.camZoom} height={48 * cam.camZoom} style={{ imageRendering: "pixelated" }} />
      </div>

      {/* Label ROME */}
      <div style={{
        position: "absolute",
        opacity: romeOpacity,
        left: romePos.x - 120 * cam.camZoom,
        top: romePos.y + 8 * cam.camZoom,
        pointerEvents: "none",
        backgroundColor: "rgba(10,10,18,0.85)",
        borderRadius: 4,
        padding: `${4 * cam.camZoom}px ${12 * cam.camZoom}px`,
      }}>
        <span style={{ fontFamily: HANNIBAL_FONTS.TITRE, fontSize: 22 * cam.camZoom, fontWeight: 700, color: HANNIBAL_PALETTE.ROME_VIF, letterSpacing: "0.12em" }}>
          ROME
        </span>
      </div>

      {/* Pyrénées montagnes */}
      <div style={{ position: "absolute", opacity: pyreneesOpacity, left: pyrPos.x - 96 * cam.camZoom, top: pyrPos.y - 78 * cam.camZoom, pointerEvents: "none" }}>
        <Img src={staticFile("hannibal/assets/map-objects/pyrenees-montagnes.png")} width={128 * cam.camZoom} height={64 * cam.camZoom} style={{ imageRendering: "pixelated" }} />
      </div>

      {/* Label Pyrénées */}
      <div style={{
        position: "absolute",
        opacity: pyreneesOpacity,
        left: pyrPos.x - 60 * cam.camZoom,
        top: pyrPos.y + 6 * cam.camZoom,
        pointerEvents: "none",
        backgroundColor: "rgba(10,10,18,0.85)",
        borderRadius: 4,
        padding: `${4 * cam.camZoom}px ${10 * cam.camZoom}px`,
      }}>
        <span style={{ fontFamily: HANNIBAL_FONTS.SERIF, fontSize: 18 * cam.camZoom, color: HANNIBAL_PALETTE.ROUTE, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
          Pyrénées
        </span>
      </div>

      {/* === COUCHE 3 : UI fixe (cartouche, label freeze) === */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: 100, left: 60, right: 60,
          opacity: cartoucheOpacity,
          backgroundColor: HANNIBAL_PALETTE.CARTOUCHE_FOND,
          border: `1px solid ${HANNIBAL_PALETTE.CARTOUCHE_BORD}`,
          borderRadius: 4, padding: "14px 22px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ fontFamily: HANNIBAL_FONTS.TITRE, fontSize: 28, color: HANNIBAL_PALETTE.IVOIRE, letterSpacing: HANNIBAL_LETTERSPACING.CARTOUCHE }}>
            218 av. J.-C.
          </div>
          <div style={{ fontFamily: HANNIBAL_FONTS.SERIF, fontSize: 18, color: HANNIBAL_PALETTE.ROUTE, letterSpacing: HANNIBAL_LETTERSPACING.LABEL }}>
            HISPANIE · CARTHAGINOIS
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: 220, left: 0, right: 0, textAlign: "center",
          opacity: freezeLabelOpacity,
          fontFamily: HANNIBAL_FONTS.SERIF, fontSize: 32,
          color: HANNIBAL_PALETTE.PARCHEMIN,
          letterSpacing: HANNIBAL_LETTERSPACING.CARTOUCHE, fontStyle: "italic",
        }}>
          Par les Alpes. En automne.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const BEAT1_FRAMES = DURATIONS.beat1;
