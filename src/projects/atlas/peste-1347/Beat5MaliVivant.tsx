// Beat5MaliVivant — "Pendant ce temps, le Mali" — réécriture from scratch
// localF = frame (standalone, durationInFrames=651)
// Souleymane walk/throne supprimés (complexité/bug scale)

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { AtlasMercator, AtlasPulseMarker } from "../_shared/atlas-components";
import {
  WIDTH as W,
  HEIGHT as H,
  STATIONS,
  PALETTE,
  makeMapCoord,
  MERC_LARGE,
  ISO_PLAGUE,
} from "./mapConfig";
import {
  caravanePositions,
  bearingAlongRoute,
  ROUTES_GEO,
} from "../_shared/geoUtils";

const { OCEAN, MALI_GOLD, PARCHMENT, PARCHMENT_DARK, PARCHMENT_INK } = PALETTE;
const MALI_GOLD_VIVID = "#e8b84b";
const EUROPE_SICK = "#4a4a6a";

// Pays zone Mali (illumine en or)
const ISO_MALI_ZONE = new Set([
  "MLI", "SEN", "GMB", "GNB", "GIN", "BFA", "NER", "MRT",
  "GHA", "CIV", "TGO", "BEN", "NGA",
]);

// ─── PIVOTS LOCAUX (0-based, calculés depuis forced-alignment) ───────────────
// f0  = f2323 audio = "Pendant ce temps"
// f47 = f2370 audio = "Souleymane"
// f80 = mosquée + marché apparaissent
// f318 = f2641 audio = "L'or du Mali part en caravane"
// f380 = f2703 audio = "Maghreb"
// f430 = bateau part
// f458 = f2781 audio = "Florence"
// f483 = f2806 audio = "Venise"
// f500 = pull-back Europe
// f520 = f2843 annotations

const F_MALI_GLOW    = 0;
const F_MOSQUEE      = 60;
const F_MARCHE       = 80;
const F_CARAVANE     = 318;  // "L'or du Mali part en caravane"
const F_MAGHREB      = 380;  // "Maghreb"
const F_BATEAU       = 430;
const F_FLORENCE     = 458;
const F_VENISE       = 483;
const F_PULLBACK     = 500;
const F_ANNOTATION_1 = 520;
const F_ANNOTATION_2 = 560;
const F_SOURCE       = 530;
const BEAT_DUR       = 651;

// ─── SOUS-COMPOSANTS ─────────────────────────────────────────────────────────

interface StaticSpriteProps {
  href: string;
  x: number; y: number;
  // displayH = hauteur cible en pixels écran (indépendante du zoom)
  displayH: number;
  srcW: number; srcH: number;
  opacity?: number;
  localF?: number;
  bob?: boolean;
}

const StaticSprite: React.FC<StaticSpriteProps> = ({
  href, x, y, displayH, srcW, srcH, opacity = 1, localF = 0, bob = false,
}) => {
  const scale = displayH / srcH;
  const dy = bob ? Math.sin(localF * 0.1) * 2 : 0;
  return (
    <g transform={`translate(${x} ${y + dy})`} opacity={opacity}>
      <image
        href={staticFile(href)}
        x={-srcW * scale / 2} y={-srcH * scale}
        width={srcW * scale} height={srcH * scale}
        style={{ imageRendering: "pixelated" }}
      />
    </g>
  );
};

interface AnimatedRouteProps {
  fromX: number; fromY: number;
  toX: number; toY: number;
  startAt: number; endAt: number;
  localF: number; camScale: number;
  color?: string; strokeWidthBase?: number;
}

const AnimatedRoute: React.FC<AnimatedRouteProps> = ({
  fromX, fromY, toX, toY, startAt, endAt, localF, camScale,
  color = MALI_GOLD_VIVID, strokeWidthBase = 3.5,
}) => {
  if (localF < startAt - 3) return null;
  const progress = interpolate(localF, [startAt, endAt], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  if (progress <= 0) return null;
  const ex = fromX + (toX - fromX) * progress;
  const ey = fromY + (toY - fromY) * progress;
  const opacity = interpolate(localF, [startAt, startAt + 10], [0, 0.9], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const sw = strokeWidthBase / camScale;
  const angle = Math.atan2(ey - fromY, ex - fromX) * 180 / Math.PI;
  return (
    <g opacity={opacity}>
      <line x1={fromX} y1={fromY} x2={ex} y2={ey}
            stroke={color} strokeWidth={sw + 3 / camScale}
            strokeOpacity={0.2} strokeLinecap="round" />
      <line x1={fromX} y1={fromY} x2={ex} y2={ey}
            stroke={color} strokeWidth={sw} strokeLinecap="round"
            style={{ filter: "drop-shadow(0px 1px 2px rgba(26,10,0,0.7))" }} />
      {progress > 0.08 && (
        <polygon points="-6,-3 5,0 -6,3"
                 transform={`translate(${ex} ${ey}) rotate(${angle})`}
                 fill={color} opacity={Math.min(1, progress * 5)} />
      )}
    </g>
  );
};

interface LabelProps {
  x: number; y: number; text: string;
  appearAt: number; localF: number;
  color?: string; size?: number;
}

const Label: React.FC<LabelProps> = ({
  x, y, text, appearAt, localF, color = PARCHMENT, size = 11,
}) => {
  const opacity = interpolate(localF, [appearAt, appearAt + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  if (opacity < 0.01) return null;
  return (
    <text x={x} y={y} textAnchor="middle" fill={color}
          fontSize={size} fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight={700} letterSpacing={1.2} opacity={opacity}
          style={{ filter: "drop-shadow(0px 1px 2px #000)" }}>
      {text}
    </text>
  );
};

interface AnnotationProps {
  text: string; appearAt: number; hideAt: number;
  localF: number; bottom?: number;
}

const Annotation: React.FC<AnnotationProps> = ({
  text, appearAt, hideAt, localF, bottom = 140,
}) => {
  const fadeIn  = interpolate(localF, [appearAt, appearAt + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(localF, [hideAt, hideAt + 12], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const slideX  = interpolate(localF, [appearAt, appearAt + 15], [-20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);
  if (opacity < 0.01) return null;
  return (
    <div style={{
      position: "absolute", bottom, left: 0, right: 0,
      display: "flex", justifyContent: "center",
      opacity, transform: `translateX(${slideX}px)`, pointerEvents: "none",
    }}>
      <div style={{
        background: PARCHMENT_INK, border: `1px solid ${PARCHMENT_DARK}`,
        padding: "5px 18px", borderRadius: 3,
      }}>
        <span style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 14, color: PARCHMENT,
          letterSpacing: "0.08em", fontWeight: 700,
        }}>
          {text}
        </span>
      </div>
    </div>
  );
};

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

export const Beat5MaliVivant: React.FC = () => {
  const localF = useCurrentFrame(); // 0-based, standalone

  // ── CAMÉRA ──────────────────────────────────────────────────────────────────
  // Phase A (0→120) : pan vertical Sahara→Mali, scale 1.1→1.75
  // Phase B (120→318) : stable sur Mali/Niani
  // Phase C (318→430) : zoom 1.75→2.4 sur la route Mali→Maghreb (caravane visible)
  // Phase D (430→500) : pull-back 2.4→1.1 pour révéler Méditerranée + bateau
  // Phase E (500→651) : pull-back final 1.1→0.85 vue large Europe vs Mali
  const camScale = interpolate(
    localF,
    [  0,  60, 120, 200, F_CARAVANE, F_CARAVANE + 30, F_BATEAU, F_BATEAU + 40, F_PULLBACK, F_PULLBACK + 60, BEAT_DUR],
    [1.1, 1.35, 1.75, 1.75,    1.75,            2.4,      2.4,           1.1,       1.1,             0.85,    0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const driftX = interpolate(
    localF,
    [  0, F_CARAVANE, F_BATEAU, F_BATEAU + 40, F_PULLBACK, F_PULLBACK + 60, BEAT_DUR],
    [  0,        -20,      -20,           120,        120,               0,        0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const driftY = interpolate(
    localF,
    [  0,  60, 120, 200, F_CARAVANE, F_BATEAU, F_PULLBACK, BEAT_DUR],
    [-120,  80,  80, 105,         80,       60,         60,        0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const mc = makeMapCoord(camScale, driftX, driftY);

  const [nianiX,    nianiY]    = mc(STATIONS.NIANI.x,      STATIONS.NIANI.y);
  const [tombX,     tombY]     = mc(STATIONS.TOMBOUCTOU.x,  STATIONS.TOMBOUCTOU.y);
  const [maghrebX,  maghrebY]  = mc(STATIONS.MAGHREB.x,     STATIONS.MAGHREB.y);
  const [florenceX, florenceY] = mc(STATIONS.FLORENCE.x,    STATIONS.FLORENCE.y);
  const [veniseX,   veniseY]   = mc(STATIONS.VENISE.x,      STATIONS.VENISE.y);

  // ── EFFETS COULEUR ───────────────────────────────────────────────────────────
  const maliGlow = interpolate(localF, [F_MALI_GLOW, 60], [0, 0.65], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Europe gris maladif dès f0 (continuité Beat4) — monte à 0.6 en Phase D
  const europeOpacity = interpolate(localF, [0, 30, F_PULLBACK, F_PULLBACK + 45], [0.35, 0.4, 0.4, 0.65], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── MOSQUÉE TOMBOUCTOU (f60 → fin) — scale fixe = 20 / camScale ─────────────
  const mosqueeOpacity = interpolate(
    localF, [F_MOSQUEE, F_MOSQUEE + 15, F_PULLBACK - 20, F_PULLBACK],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── MARCHÉ NIANI (f80 → fin) — scale fixe = 18 / camScale ──────────────────
  const marcheOpacity = interpolate(
    localF, [F_MARCHE, F_MARCHE + 15, F_PULLBACK - 20, F_PULLBACK],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── CARAVANE (f318 → f430) — toute la route Niani→Maghreb ──────────────────
  // progress 0→1.0 sur toute la route CARAVANE_OR, disparaît quand bateau démarre
  const caravaneProgress = interpolate(
    localF, [F_CARAVANE, F_BATEAU], [0, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const caravaneFadeIn  = interpolate(localF, [F_CARAVANE, F_CARAVANE + 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const caravaneFadeOut = interpolate(localF, [F_BATEAU - 10, F_BATEAU + 8], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const caravaneOpacity = Math.min(caravaneFadeIn, caravaneFadeOut);
  const caravaneVisible = localF >= F_CARAVANE && localF <= F_BATEAU + 8;

  let leaderPos: [number, number] = [STATIONS.NIANI.x, STATIONS.NIANI.y];
  let caravaneBearing = 0;
  if (caravaneVisible) {
    leaderPos = caravanePositions(ROUTES_GEO.CARAVANE_OR, caravaneProgress, 1, 0)[0];
    caravaneBearing = bearingAlongRoute(ROUTES_GEO.CARAVANE_OR, caravaneProgress);
  }
  const caravaneFlipX = (caravaneBearing > -90 && caravaneBearing < 90) ? 1 : -1;

  // 4 membres avec décalage pixel fixe (40px) sur l'axe de marche — lisible quelle que soit la caméra
  const caravaneMembers = [
    { basePath: "atlas/peste-1347/assets/characters/marchand-berbere/animations/walk/east", frameCount: 4, srcW: 64, srcH: 64, displayH: 70, tick: 6, phase: 0,  offsetPx: 0   },
    { basePath: "atlas/peste-1347/assets/characters/ane-caravane/animations/walk/east",     frameCount: 4, srcW: 64, srcH: 64, displayH: 65, tick: 6, phase: 3,  offsetPx: -45 },
    { basePath: "atlas/peste-1347/assets/characters/cheval-bat/animations/walk/east",       frameCount: 4, srcW: 64, srcH: 64, displayH: 68, tick: 6, phase: 6,  offsetPx: -90 },
    { basePath: "atlas/peste-1347/assets/characters/porteur-mali/animations/walk/east",     frameCount: 6, srcW: 64, srcH: 64, displayH: 65, tick: 5, phase: 10, offsetPx: -135 },
  ];

  // ── BATEAU BÉZIER (f430 → f500) ──────────────────────────────────────────────
  const bateauProgress = interpolate(localF, [F_BATEAU, F_PULLBACK], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const bateauFadeIn  = interpolate(localF, [F_BATEAU, F_BATEAU + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const bateauFadeOut = interpolate(localF, [F_PULLBACK - 15, F_PULLBACK], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const bateauScale = 65 / 30; // displayH=65px, srcH=30px
  // Bateau sur la flèche linéaire Maghreb→Florence (même interpolation que AnimatedRoute)
  const bateauX = maghrebX + (florenceX - maghrebX) * bateauProgress;
  const bateauY = maghrebY + (florenceY - maghrebY) * bateauProgress;
  const bateauBob = Math.sin(localF * 0.18) * 2.5;

  // ── SOURCE ───────────────────────────────────────────────────────────────────
  const sourceOpacity = interpolate(localF, [F_SOURCE, F_SOURCE + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: OCEAN }}>
      <Sequence from={0} premountFor={30}>
        <Audio
          src={staticFile("atlas/peste-1347/audio/narration-v1.mp3")}
          startFrom={2323}
          volume={1}
          trimAfter={BEAT_DUR}
        />
      </Sequence>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={0} y={0} width={W} height={H} fill={OCEAN} />

        <AtlasMercator
          countries={MERC_LARGE.countries}
          highlightFills={{}}
          driftX={driftX} driftY={driftY} scale={camScale}
          width={W} height={H}
        />

        {/* Mali or */}
        {maliGlow > 0.01 && (
          <g transform={`translate(${W/2+driftX} ${H/2+driftY}) scale(${camScale}) translate(${-W/2} ${-H/2})`}>
            {(MERC_LARGE.countries as Array<{iso:string;d:string}>)
              .filter(c => ISO_MALI_ZONE.has(c.iso))
              .map(c => (
                <path key={c.iso} d={c.d}
                      fill={MALI_GOLD} fillOpacity={maliGlow}
                      stroke={MALI_GOLD_VIVID} strokeOpacity={maliGlow * 0.3} strokeWidth={0.4} />
              ))}
          </g>
        )}

        {/* Europe gris maladif — Phase D uniquement */}
        {europeOpacity > 0.01 && (
          <g transform={`translate(${W/2+driftX} ${H/2+driftY}) scale(${camScale}) translate(${-W/2} ${-H/2})`}>
            {(MERC_LARGE.countries as Array<{iso:string;d:string}>)
              .filter(c => ISO_PLAGUE.includes(c.iso as typeof ISO_PLAGUE[number]))
              .map(c => (
                <path key={c.iso} d={c.d} fill={EUROPE_SICK} fillOpacity={europeOpacity} />
              ))}
          </g>
        )}

        {/* Mosquée Tombouctou (f60→F_PULLBACK) — 80px de haut, fixe */}
        {mosqueeOpacity > 0.01 && (
          <StaticSprite
            href="atlas/peste-1347/assets/objects/mosquee-tombouctou.png"
            x={tombX} y={tombY}
            displayH={80} srcW={64} srcH={64}
            opacity={mosqueeOpacity}
            bob localF={localF}
          />
        )}
        <Label x={tombX} y={tombY - 88}
               text="TOMBOUCTOU" appearAt={F_MOSQUEE} localF={localF} />

        {/* Marché Niani (f80→F_PULLBACK) — 70px de haut, fixe */}
        {marcheOpacity > 0.01 && (
          <StaticSprite
            href="atlas/peste-1347/assets/objects/marche-tombouctou/static.png"
            x={nianiX + 10} y={nianiY}
            displayH={70} srcW={64} srcH={64}
            opacity={marcheOpacity}
            bob localF={localF}
          />
        )}
        <Label x={nianiX + 10} y={nianiY - 78}
               text="NIANI" appearAt={F_MARCHE} localF={localF} />

        {/* Niani pulse */}
        {localF >= F_MARCHE && localF <= F_PULLBACK && (
          <AtlasPulseMarker coord={[nianiX, nianiY]} beatStart={0}
                            color={MALI_GOLD} ringInner={3} ringOuter={16} />
        )}

        {/* Routes or : Niani→Tombouctou→Maghreb */}
        <AnimatedRoute
          fromX={nianiX} fromY={nianiY} toX={tombX} toY={tombY}
          startAt={F_CARAVANE} endAt={F_CARAVANE + 32}
          localF={localF} camScale={camScale} color={MALI_GOLD_VIVID}
        />
        <AnimatedRoute
          fromX={tombX} fromY={tombY} toX={maghrebX} toY={maghrebY}
          startAt={F_CARAVANE + 32} endAt={F_MAGHREB}
          localF={localF} camScale={camScale} color={MALI_GOLD_VIVID}
        />

        {/* Caravane — 4 membres, leader sur la route Turf, membres décalés en pixels écran */}
        {caravaneVisible && caravaneOpacity > 0.01 && (() => {
          const [leaderSvgX, leaderSvgY] = leaderPos;
          const [leaderScreenX, leaderScreenY] = mc(leaderSvgX, leaderSvgY);
          // Direction de marche en radians pour projeter le décalage sur l'axe de déplacement
          const bearing = caravaneBearing * Math.PI / 180;
          const dx = Math.sin(bearing);
          const dy = -Math.cos(bearing);
          return caravaneMembers.map((m, i) => {
            const screenX = leaderScreenX + dx * m.offsetPx;
            const screenY = leaderScreenY + dy * m.offsetPx;
            const scale = m.displayH / m.srcH;
            const frameIdx = Math.floor(Math.max(0, localF - F_CARAVANE + m.phase) / m.tick) % m.frameCount;
            const frameStr = String(frameIdx).padStart(3, "0");
            const hop = Math.abs(Math.sin((localF + m.phase) * 0.25)) * 2;
            return (
              <g key={i} transform={`translate(${screenX} ${screenY - hop})`} opacity={caravaneOpacity}>
                <image
                  href={staticFile(`${m.basePath}/frame_${frameStr}.png`)}
                  x={-(m.srcW * scale / 2)} y={-(m.srcH * scale)}
                  width={m.srcW * scale} height={m.srcH * scale}
                  style={{ imageRendering: "pixelated", transform: `scaleX(${caravaneFlipX})` }}
                />
              </g>
            );
          });
        })()}

        {/* Maghreb marker */}
        {localF >= F_MAGHREB && (
          <AtlasPulseMarker coord={[maghrebX, maghrebY]} beatStart={0}
                            color={MALI_GOLD_VIVID} ringInner={3} ringOuter={14} />
        )}
        <Label x={maghrebX} y={maghrebY - 40 / camScale}
               text="MAGHREB" appearAt={F_MAGHREB} localF={localF} />

        {/* Routes maritimes Maghreb→Florence→Venise */}
        <AnimatedRoute
          fromX={maghrebX} fromY={maghrebY} toX={florenceX} toY={florenceY}
          startAt={F_BATEAU} endAt={F_FLORENCE + 15}
          localF={localF} camScale={camScale} color={MALI_GOLD_VIVID} strokeWidthBase={3}
        />
        <AnimatedRoute
          fromX={florenceX} fromY={florenceY} toX={veniseX} toY={veniseY}
          startAt={F_VENISE - 8} endAt={F_VENISE + 22}
          localF={localF} camScale={camScale} color={MALI_GOLD_VIVID} strokeWidthBase={3}
        />

        {/* Bateau Bézier */}
        {localF >= F_BATEAU && localF <= F_PULLBACK && (
          <g transform={`translate(${bateauX} ${bateauY + bateauBob})`}
             opacity={Math.min(bateauFadeIn, bateauFadeOut)}>
            <image
              href={staticFile("atlas/peste-1347/assets/objects/bateau-genois.png")}
              x={-(24 * bateauScale / 2)} y={-(30 * bateauScale)}
              width={24 * bateauScale} height={30 * bateauScale}
              style={{ imageRendering: "pixelated" }}
            />
          </g>
        )}

        {/* Florence + Venise markers */}
        {localF >= F_FLORENCE && (
          <AtlasPulseMarker coord={[florenceX, florenceY]} beatStart={0}
                            color={MALI_GOLD} ringInner={2} ringOuter={12} />
        )}
        {localF >= F_VENISE && (
          <AtlasPulseMarker coord={[veniseX, veniseY]} beatStart={0}
                            color={MALI_GOLD} ringInner={2} ringOuter={12} />
        )}
        <Label x={florenceX + 32} y={florenceY - 18}
               text="FLORENCE" appearAt={F_FLORENCE} localF={localF}
               color={MALI_GOLD_VIVID} size={10} />
        <Label x={veniseX + 32}  y={veniseY + 22}
               text="VENISE"   appearAt={F_VENISE}   localF={localF}
               color={MALI_GOLD_VIVID} size={10} />
      </svg>

      {/* Annotations Phase D */}
      <Annotation text="L'EUROPE S'EFFONDRE"
                  appearAt={F_ANNOTATION_1} hideAt={F_ANNOTATION_2 - 2} localF={localF} />
      <Annotation text="LE MALI ALIMENTE SES MONNAIES"
                  appearAt={F_ANNOTATION_2} hideAt={BEAT_DUR} localF={localF} />

      {/* Source Ibn Battuta */}
      {sourceOpacity > 0.01 && (
        <div style={{
          position: "absolute", bottom: 28, left: 0, right: 0,
          display: "flex", justifyContent: "center",
          opacity: sourceOpacity, pointerEvents: "none",
        }}>
          <div style={{
            background: PARCHMENT,
            borderTop: `1.5px solid ${PARCHMENT_DARK}`,
            borderBottom: `1.5px solid ${PARCHMENT_DARK}`,
            padding: "3px 14px",
          }}>
            <span style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 11, color: PARCHMENT_INK,
              letterSpacing: "0.04em", fontWeight: 600,
            }}>
              Ibn Battuta, Rihla (1352) · World History Encyclopedia
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
