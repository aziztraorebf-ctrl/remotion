import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AtlasMercator,
  AtlasPulseMarker,
} from "../_shared/atlas-components";
import pesteData from "../../../../public/atlas/peste-1347/geo/peste-map-data.json";
import { BEATS, CITIES, PIVOTS, ROUTES } from "./timing";
import { ISO_PLAGUE, PLAGUE_COUNTRY_COLOR } from "./mapConfig";

// ─── PALETTE ────────────────────────────────────────────────────────────────

const OCEAN = "#1a2744";
const MALI_GOLD = "#c8960c";
const PLAGUE_RED = "#8b1a1a";
const PLAGUE_RED_BRIGHT = "#cc2222";
const ROUTE_COLOR = "#cc6622";
const TEXT_MUTED = "#c4a882";
const CREAM = "#f5e6c8";

const ISO_MALI_ZONE = new Set([
  "MLI", "SEN", "GMB", "GNB", "GIN", "BFA", "NER", "MRT",
]);

const MAX_WAVE_R = 260;
const SAHARA_CLIP_Y = 525;

// ─── MAP COORD HELPER ────────────────────────────────────────────────────────
// Converts raw POI coords (from geo JSON) to actual screen position,
// accounting for AtlasMercator's scale + drift transform:
// transform = translate(cx+driftX, cy+driftY) scale(s) translate(-cx, -cy)
// => screenX = (poiX - cx) * scale + cx + driftX

const makeMapCoord = (W: number, H: number, scale: number, driftX: number, driftY: number) => {
  const cx = W / 2;
  const cy = H / 2;
  return (x: number, y: number): [number, number] => [
    (x - cx) * scale + cx + driftX,
    (y - cy) * scale + cy + driftY,
  ];
};

// ─── HELPER BATEAU ───────────────────────────────────────────────────────────

interface BateauProps {
  fromX: number; fromY: number;
  toX: number; toY: number;
  localStart: number; localEnd: number; localHide: number;
  localF: number;
  flipX?: boolean;
}

const Bateau: React.FC<BateauProps> = ({
  fromX, fromY, toX, toY,
  localStart, localEnd, localHide,
  localF, flipX = false,
}) => {
  if (localF < localStart || localF > localHide) return null;
  const t = interpolate(localF, [localStart, localEnd], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Fade out gently after reaching destination
  const opacity = interpolate(localF, [localEnd, localEnd + 20, localHide - 15, localHide], [1, 0.9, 0.9, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const x = fromX + (toX - fromX) * t - 20;
  const y = fromY + (toY - fromY) * t - 16;
  return (
    <image
      href={staticFile("atlas/peste-1347/assets/objects/bateau-genois.png")}
      x={x} y={y}
      width={86} height={64}
      opacity={opacity}
      style={{
        imageRendering: "pixelated",
        filter: "drop-shadow(0px 0px 2px white)",
        transform: flipX ? `scale(-1,1) translate(${-(x * 2 + 86)}px, 0)` : undefined,
      }}
    />
  );
};

// ─── ROUTE TRACE ─────────────────────────────────────────────────────────────

interface RouteTraceProps {
  fromX: number; fromY: number;
  toX: number; toY: number;
  localStart: number; localEnd: number;
  localF: number;
  color?: string;
}

const RouteTrace: React.FC<RouteTraceProps> = ({
  fromX, fromY, toX, toY,
  localStart, localEnd,
  localF, color = ROUTE_COLOR,
}) => {
  const progress = interpolate(localF, [localStart, localEnd], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  if (progress <= 0) return null;
  const ex = fromX + (toX - fromX) * progress;
  const ey = fromY + (toY - fromY) * progress;
  const opacity = interpolate(localF, [localStart, localStart + 10], [0, 0.6], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <line
      x1={fromX} y1={fromY}
      x2={ex} y2={ey}
      stroke="#ff8833"
      strokeWidth={3}
      strokeOpacity={opacity}
      strokeDasharray="8 4"
      style={{ filter: "drop-shadow(0px 0px 3px #ff6600)" }}
    />
  );
};

// ─── COMPOSANT ──────────────────────────────────────────────────────────────

export const Beat2Setup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  const data = pesteData.mercLarge;
  const W = pesteData.width;
  const H = pesteData.height;

  const beatStart = BEATS.SETUP_START;
  const beatEnd = BEATS.SETUP_END;
  const beatDur = beatEnd - beatStart;
  const localF = frame - beatStart;

  // ── Fade in
  const mapOpacity = interpolate(localF, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Drift caméra — lent, vers le nord pour garder Crimée visible
  const driftX = interpolate(localF, [0, beatDur * 0.5, beatDur], [0, 20, 10], {
    extrapolateRight: "clamp",
  });
  const driftY = interpolate(localF, [0, beatDur * 0.5, beatDur], [0, -20, -10], {
    extrapolateRight: "clamp",
  });
  const camScale = interpolate(localF, [0, beatDur], [1.0, 1.04], {
    extrapolateRight: "clamp",
  });

  // ── Helper: convert POI coords → true screen position (accounts for scale+drift)
  const mc = makeMapCoord(W, H, camScale, driftX, driftY);

  // ── Mali or constant
  const highlightFills: Record<string, string> = {};
  ISO_MALI_ZONE.forEach((iso) => { highlightFills[iso] = MALI_GOLD; });

  // ── Coloriage progressif des pays infectés (fin de la propagation)
  // Démarre quand la vague est à 70% de son expansion, fade-in 80f.
  // En fin de Beat 2 : tous les pays infectés sont rouges.
  const PLAGUE_FADE_START = ROUTES.PROPAGATION_START - beatStart + 60;  // ~f310 local
  const PLAGUE_FADE_END = PIVOTS.SAHARA_BOUCLIER - beatStart;            // ~f418 local
  const plagueOpacity = interpolate(localF, [PLAGUE_FADE_START, PLAGUE_FADE_END], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  if (plagueOpacity > 0.05) {
    // Interpolation couleur ocean → rouge terne (mix simple R/G/B)
    const mixHex = (hex: string, t: number): string => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const baseR = 160, baseG = 105, baseB = 75; // ton terre carte de base
      const nr = Math.round(baseR + (r - baseR) * t);
      const ng = Math.round(baseG + (g - baseG) * t);
      const nb = Math.round(baseB + (b - baseB) * t);
      return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
    };
    const plagueColor = mixHex(PLAGUE_COUNTRY_COLOR, plagueOpacity);
    ISO_PLAGUE.forEach((iso) => {
      if (!highlightFills[iso]) highlightFills[iso] = plagueColor;
    });
  }

  // ── POI — raw coords from geo JSON
  const poi = data.poi as Record<string, { x: number; y: number }>;
  const caffa = poi["Caffa"];
  const sicile = poi["Sicile"];
  const paris = poi["Paris"];
  const londres = poi["Londres"];
  const stockholm = poi["Stockholm"];
  const propagCenter = data.propagationCenter as { cx: number; cy: number };

  // ── Screen-space POI (corrected)
  const [caffaX, caffaY] = mc(caffa.x, caffa.y);
  const [sicileX, sicileY] = mc(sicile.x, sicile.y);
  const [parisX, parisY] = mc(paris.x, paris.y);
  const [londresX, londresY] = mc(londres.x, londres.y);
  const [stockholmX, stockholmY] = mc(stockholm.x, stockholm.y);
  const [propCx, propCy] = mc(propagCenter.cx, propagCenter.cy);

  // ── Destinations bateaux (screen-space)
  const genesX = sicileX - 25;  const genesY = sicileY - 22;
  const constX = sicileX + 55;  const constY = sicileY - 35;

  // ── 3 BATEAUX — Caffa → ports européens, 20f d'écart
  // PROPAGATION_START local = 491-241 = 250. Bateaux doivent arriver AVANT.
  // B1: 104→230 (4.2s), B2: 124→250, B3: 144→270
  const B1_START = CITIES.SICILE - beatStart;        // f104 local
  const B1_END   = B1_START + 126;                   // f230
  const B2_START = B1_START + 20;                    // f124
  const B2_END   = B2_START + 126;                   // f250
  const B3_START = B1_START + 40;                    // f144
  const B3_END   = B3_START + 126;                   // f270

  // BOAT_HIDE doit être > B3_END (270) et avant l'expansion de la vague
  const BOAT_HIDE = B3_END + 40;                     // f310

  // Routes tracées juste avant le départ des bateaux (20f avant)
  const R1_START = B1_START - 20;
  const R2_START = B2_START - 20;
  const R3_START = B3_START - 20;

  // ── Vague propagation — depuis Sicile, expansion f491→f659
  const waveLocalStart = ROUTES.PROPAGATION_START - beatStart;
  // Compressed: reach max radius 120f earlier than SAHARA_BOUCLIER for faster punch
  const waveStopLocal = PIVOTS.SAHARA_BOUCLIER - beatStart - 50;
  const waveRaw = interpolate(localF, [waveLocalStart, waveStopLocal], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const waveEased = Easing.out(Easing.quad)(waveRaw);
  const waveR = waveEased * MAX_WAVE_R;
  const waveOpacity = interpolate(localF, [waveLocalStart, waveLocalStart + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Sahara highlight — apparaît à SAHARA_BOUCLIER
  const saharaLocalStart = PIVOTS.SAHARA_BOUCLIER - beatStart;
  const saharaPulse = interpolate(
    localF,
    [saharaLocalStart, saharaLocalStart + 20, saharaLocalStart + 40, saharaLocalStart + 60],
    [0, 1, 0.6, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const saharaOpacity = interpolate(localF, [saharaLocalStart, saharaLocalStart + 20], [0, 0.35], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Label SAHARA — à SAHARA_EST_LA
  const saharaLabelLocal = PIVOTS.SAHARA_EST_LA - beatStart;
  const saharaLabelOpacity = interpolate(localF, [saharaLabelLocal, saharaLabelLocal + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const saharaLabelScale = interpolate(localF, [saharaLabelLocal, saharaLabelLocal + 20], [0.85, 1.0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const labelOpacity = interpolate(localF, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const SAHARA_LX = W * 0.43;
  const SAHARA_LY = H * 0.62;

  return (
    <AbsoluteFill style={{ backgroundColor: OCEAN }}>
      <Audio
        src={staticFile("atlas/peste-1347/audio/narration-v1.mp3")}
        startFrom={BEATS.SETUP_START}
        endAt={BEATS.SETUP_START + BEATS.SETUP_END}
        volume={1}
      />
      <Audio
        src={staticFile("atlas/peste-1347/audio/music-c-desert.mp3")}
        startFrom={0}
        volume={(f) => {
          const lf = f - beatStart;
          return interpolate(lf, [0, 30, beatDur - 30, beatDur], [0.04, 0.04, 0.04, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
        }}
      />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ opacity: mapOpacity }}>
        <defs>
          <clipPath id="wave-north-clip">
            <rect x={-W} y={-H} width={W * 3} height={SAHARA_CLIP_Y + H} />
          </clipPath>
        </defs>

        <rect x={0} y={0} width={W} height={H} fill={OCEAN} />

        <AtlasMercator
          countries={data.countries}
          highlightFills={highlightFills}
          driftX={driftX}
          driftY={driftY}
          scale={camScale}
          width={W}
          height={H}
        />

        {/* Sahara overlay doré */}
        {saharaOpacity > 0 && (
          <path
            d={data.saharaPath}
            fill={MALI_GOLD}
            fillOpacity={saharaOpacity}
            stroke={MALI_GOLD}
            strokeWidth={1}
            strokeOpacity={saharaPulse * 0.6}
          />
        )}

        {/* Vague rouge clippée au nord du Sahara */}
        {waveR > 0 && (
          <g clipPath="url(#wave-north-clip)">
            <circle
              cx={propCx}
              cy={propCy}
              r={waveR}
              fill={PLAGUE_RED}
              fillOpacity={waveOpacity * 0.22}
              stroke={PLAGUE_RED_BRIGHT}
              strokeWidth={2.5}
              strokeOpacity={waveOpacity * 0.75}
              style={{ pointerEvents: "none" }}
            />
          </g>
        )}

        {/* Tracés de routes pointillés — apparaissent avant les bateaux */}
        <RouteTrace
          fromX={caffaX} fromY={caffaY}
          toX={sicileX} toY={sicileY}
          localStart={R1_START} localEnd={B1_END}
          localF={localF}
        />
        <RouteTrace
          fromX={caffaX} fromY={caffaY}
          toX={genesX} toY={genesY}
          localStart={R2_START} localEnd={B2_END}
          localF={localF}
        />
        <RouteTrace
          fromX={caffaX} fromY={caffaY}
          toX={constX} toY={constY}
          localStart={R3_START} localEnd={B3_END}
          localF={localF}
        />

        {/* 3 bateaux — Caffa → ports européens */}
        <Bateau
          fromX={caffaX} fromY={caffaY}
          toX={sicileX} toY={sicileY}
          localStart={B1_START} localEnd={B1_END} localHide={BOAT_HIDE}
          localF={localF}
        />
        <Bateau
          fromX={caffaX} fromY={caffaY}
          toX={genesX} toY={genesY}
          localStart={B2_START} localEnd={B2_END} localHide={BOAT_HIDE}
          localF={localF}
        />
        <Bateau
          fromX={caffaX} fromY={caffaY}
          toX={constX} toY={constY}
          localStart={B3_START} localEnd={B3_END} localHide={BOAT_HIDE}
          localF={localF}
        />

        {/* Markers villes — coords écran corrects via mc() */}
        {localF >= CITIES.SICILE - beatStart && (
          <AtlasPulseMarker
            coord={[sicileX, sicileY]}
            beatStart={CITIES.SICILE}
            color={PLAGUE_RED_BRIGHT}
            ringInner={5} ringOuter={24}
          />
        )}
        {localF >= CITIES.CRIMEE - beatStart && (
          <AtlasPulseMarker
            coord={[caffaX, caffaY]}
            beatStart={CITIES.CRIMEE}
            color={PLAGUE_RED_BRIGHT}
            ringInner={5} ringOuter={24}
          />
        )}
        {localF >= CITIES.PARIS - beatStart && (
          <AtlasPulseMarker
            coord={[parisX, parisY]}
            beatStart={CITIES.PARIS}
            color={PLAGUE_RED_BRIGHT}
            ringInner={5} ringOuter={24}
          />
        )}
        {localF >= CITIES.LONDRES - beatStart && (
          <AtlasPulseMarker
            coord={[londresX, londresY]}
            beatStart={CITIES.LONDRES}
            color={PLAGUE_RED_BRIGHT}
            ringInner={5} ringOuter={24}
          />
        )}
        {localF >= CITIES.STOCKHOLM - beatStart && (
          <AtlasPulseMarker
            coord={[stockholmX, stockholmY]}
            beatStart={CITIES.STOCKHOLM}
            color={PLAGUE_RED_BRIGHT}
            ringInner={5} ringOuter={24}
          />
        )}

        {/* Labels villes — coords écran corrects */}
        {localF >= CITIES.SICILE - beatStart && (
          <text x={sicileX + 10} y={sicileY - 8} fill={CREAM} fontSize={11} fontFamily="Georgia, serif" opacity={0.85}>Sicile</text>
        )}
        {localF >= CITIES.CRIMEE - beatStart && (
          <text x={caffaX + 10} y={caffaY - 8} fill={CREAM} fontSize={11} fontFamily="Georgia, serif" opacity={0.85}>Caffa</text>
        )}
        {localF >= CITIES.PARIS - beatStart && (
          <text x={parisX + 10} y={parisY - 8} fill={CREAM} fontSize={11} fontFamily="Georgia, serif" opacity={0.85}>Paris</text>
        )}
        {localF >= CITIES.LONDRES - beatStart && (
          <text x={londresX + 10} y={londresY - 8} fill={CREAM} fontSize={11} fontFamily="Georgia, serif" opacity={0.85}>Londres</text>
        )}
        {localF >= CITIES.STOCKHOLM - beatStart && (
          <text x={stockholmX + 10} y={stockholmY - 8} fill={CREAM} fontSize={11} fontFamily="Georgia, serif" opacity={0.85}>Stockholm</text>
        )}

        {/* Label SAHARA */}
        {saharaLabelOpacity > 0 && (
          <g
            transform={`translate(${SAHARA_LX} ${SAHARA_LY}) scale(${saharaLabelScale}) translate(${-SAHARA_LX} ${-SAHARA_LY})`}
            opacity={saharaLabelOpacity}
          >
            <text x={SAHARA_LX + 1} y={SAHARA_LY + 1} textAnchor="middle" fill="#000" fillOpacity={0.35}
              fontSize={22} fontFamily="Georgia, 'Times New Roman', serif" letterSpacing={6}>SAHARA</text>
            <text x={SAHARA_LX} y={SAHARA_LY} textAnchor="middle" fill={MALI_GOLD}
              fontSize={22} fontFamily="Georgia, 'Times New Roman', serif" letterSpacing={6}>SAHARA</text>
          </g>
        )}

        {/* Étiquette titre haut */}
        <text
          x={W / 2} y={H * 0.07}
          textAnchor="middle"
          fill={MALI_GOLD} fillOpacity={labelOpacity}
          fontSize={16} fontFamily="Georgia, 'Times New Roman', serif" letterSpacing={3}
        >
          LA PESTE NOIRE · 1347
        </text>

        {/* Punchline bas */}
        {saharaLabelOpacity > 0.5 && (
          <text
            x={W / 2} y={H * 0.93}
            textAnchor="middle"
            fill={TEXT_MUTED}
            fillOpacity={interpolate(localF, [saharaLabelLocal + 20, saharaLabelLocal + 45], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            })}
            fontSize={15} fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic"
          >
            Mais le Sahara est là.
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};
