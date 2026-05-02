import React, { useEffect, useState, useRef } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  delayRender,
  continueRender,
  staticFile,
  Sequence,
} from "remotion";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";

// ============================================================
// GEO SHORT PROTO — Mini-Short 45s (1350 frames @ 30fps)
//
// Format : 1080 x 1920 (Shorts vertical 9:16)
// Sujet  : "Pourquoi Israel peut frapper l'Iran depuis si loin"
//
// Phase 1 (0-90f)     : Hook — titre choc
// Phase 2 (90-480f)   : Carte Moyen-Orient — zoom + arc de frappe
// Phase 3 (480-600f)  : Transition — carte -> fond blanc
// Phase 4 (600-900f)  : Scene stick figures — soldats face-a-face avec distance
// Phase 5 (900-1050f) : Retour carte — donnees chiffrees
// Phase 6 (1050-1350f): Outro — CTA + stat cle
//
// ============================================================

const W = 1080;
const H = 1920;

// ISO codes
const ISO_IRAN = 364;
const ISO_ISRAEL = 376;
const ISO_SAUDI = 682;
const ISO_IRAQ = 368;
const ISO_TURKEY = 792;
const ISO_EGYPT = 818;
const ISO_JORDAN = 400;
const ISO_LEBANON = 422;
const ISO_SYRIA = 760;

// Coordonnees geographiques (lon, lat)
const COORDS = {
  tehran:    [51.42, 35.69] as [number, number],
  telaviv:   [34.78, 32.09] as [number, number],
  natanz:    [51.72, 33.72] as [number, number],
  jerusalem: [35.21, 31.77] as [number, number],
};

// Palette : coloree, lisible, energique
const C = {
  ocean:       "#a8d5e8",
  land:        "#e8e0d0",
  landStroke:  "#c0b090",
  iran:        "#e07040",
  iranStroke:  "#a04010",
  israel:      "#5080e0",
  israelStroke:"#2050b0",
  saudi:       "#e8d080",
  iraq:        "#90c890",
  turkey:      "#d090c0",
  egypt:       "#c8b870",
  jordan:      "#b0d0a0",
  lebanon:     "#e09090",
  syria:       "#a0c0d0",
  red:         "#e03030",
  blue:        "#2060d0",
  gold:        "#f0b000",
  white:       "#ffffff",
  dark:        "#0a0a1a",
  textDark:    "#111111",
  textLight:   "#ffffff",
  orange:      "#e06000",
} as const;

// Projection Moyen-Orient portrait (1080x1920)
function buildProjection(scale = 2400, cx = 450, cy = 820) {
  return d3Geo
    .geoMercator()
    .center([44, 30])
    .scale(scale)
    .translate([cx, cy]);
}

// ============================================================
// COMPOSANT CARTE DE BASE
// ============================================================

type Topology = Parameters<typeof topojson.feature>[0];

const GeoMap: React.FC<{
  topology: Topology;
  projection: d3Geo.GeoProjection;
  frame: number;
  localFrame: number;  // frame relative au debut de la phase carte
  fps: number;
  showArc: boolean;
  showDistance: boolean;
}> = ({ topology, projection, frame, localFrame, fps, showArc, showDistance }) => {
  const path = d3Geo.geoPath().projection(projection);

  const countries = topojson.feature(topology, (topology as any).objects.countries);
  const countryFeatures = (countries as any).features as any[];

  function getCountryColor(id: number): string {
    switch (id) {
      case ISO_IRAN:   return C.iran;
      case ISO_ISRAEL: return C.israel;
      case ISO_SAUDI:  return C.saudi;
      case ISO_IRAQ:   return C.iraq;
      case ISO_TURKEY: return C.turkey;
      case ISO_EGYPT:  return C.egypt;
      case ISO_JORDAN: return C.jordan;
      case ISO_LEBANON:return C.lebanon;
      case ISO_SYRIA:  return C.syria;
      default:         return C.land;
    }
  }

  function getCountryStroke(id: number): string {
    switch (id) {
      case ISO_IRAN:   return C.iranStroke;
      case ISO_ISRAEL: return C.israelStroke;
      default:         return C.landStroke;
    }
  }

  // Points geographiques projetes
  const pTelAviv  = projection(COORDS.telaviv)  as [number, number];
  const pNatanz   = projection(COORDS.natanz)   as [number, number];
  const pTehran   = projection(COORDS.tehran)   as [number, number];

  // Milieu de l'arc (courbure vers le haut)
  const midX = (pTelAviv[0] + pNatanz[0]) / 2;
  const midY = Math.min(pTelAviv[1], pNatanz[1]) - 200;

  // Arc progress (localFrame 0 -> 300 frames pour la section arc)
  const arcProgress = showArc
    ? interpolate(localFrame, [60, 240], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Path SVG de l'arc complet
  const arcPath = `M ${pTelAviv[0]} ${pTelAviv[1]} Q ${midX} ${midY} ${pNatanz[0]} ${pNatanz[1]}`;

  // Longueur approximative de l'arc (1800 km en px projected)
  const arcLength = 600;
  const arcDashOffset = arcLength * (1 - arcProgress);

  // Labels spring
  const labelSpring = (delay: number) =>
    spring({
      frame: localFrame - delay,
      fps,
      config: { damping: 20, stiffness: 200 },
    });

  const iranLabelOpacity = interpolate(labelSpring(10), [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });
  const israelLabelOpacity = interpolate(labelSpring(20), [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <g>
      {/* Ocean */}
      <rect x={0} y={0} width={W} height={H} fill={C.ocean} />

      {/* Countries */}
      {countryFeatures.map((feature: any) => {
        const id = Number(feature.id);
        const d = path(feature);
        if (!d) return null;
        return (
          <path
            key={feature.id}
            d={d}
            fill={getCountryColor(id)}
            stroke={getCountryStroke(id)}
            strokeWidth={id === ISO_IRAN || id === ISO_ISRAEL ? 2.5 : 1}
          />
        );
      })}

      {/* Arc de frappe Tel Aviv -> Natanz */}
      {showArc && arcProgress > 0 && (
        <>
          {/* Ombre de l'arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth={5}
            strokeDasharray={`${arcLength} ${arcLength}`}
            strokeDashoffset={arcDashOffset + 2}
            strokeLinecap="round"
          />
          {/* Arc principal */}
          <path
            d={arcPath}
            fill="none"
            stroke={C.red}
            strokeWidth={3.5}
            strokeDasharray={`${arcLength} ${arcLength}`}
            strokeDashoffset={arcDashOffset}
            strokeLinecap="round"
          />
          {/* Pointe de fleche au bout de l'arc */}
          {arcProgress > 0.95 && (
            <circle
              cx={pNatanz[0]}
              cy={pNatanz[1]}
              r={8 * arcProgress}
              fill={C.red}
              opacity={arcProgress}
            />
          )}
        </>
      )}

      {/* Point Tel Aviv */}
      <circle
        cx={pTelAviv[0]}
        cy={pTelAviv[1]}
        r={8}
        fill={C.blue}
        stroke={C.white}
        strokeWidth={2}
        opacity={israelLabelOpacity}
      />
      <circle
        cx={pTelAviv[0]}
        cy={pTelAviv[1]}
        r={20}
        fill="none"
        stroke={C.blue}
        strokeWidth={1.5}
        opacity={israelLabelOpacity * 0.5}
      />

      {/* Label Israel */}
      <text
        x={pTelAviv[0] - 70}
        y={pTelAviv[1] - 20}
        fontSize={22}
        fontWeight="bold"
        fill={C.blue}
        fontFamily="Arial, sans-serif"
        opacity={israelLabelOpacity}
      >
        ISRAEL
      </text>

      {/* Point Natanz */}
      {showArc && arcProgress > 0.8 && (
        <>
          <circle
            cx={pNatanz[0]}
            cy={pNatanz[1]}
            r={8}
            fill={C.orange}
            stroke={C.white}
            strokeWidth={2}
            opacity={arcProgress}
          />
          <text
            x={pNatanz[0] + 14}
            y={pNatanz[1] + 5}
            fontSize={18}
            fontWeight="bold"
            fill={C.orange}
            fontFamily="Arial, sans-serif"
            opacity={arcProgress}
          >
            Natanz
          </text>
          <text
            x={pNatanz[0] + 14}
            y={pNatanz[1] + 25}
            fontSize={14}
            fill={C.orange}
            fontFamily="Arial, sans-serif"
            opacity={arcProgress * 0.8}
          >
            Site nucleaire
          </text>
        </>
      )}

      {/* Label Iran */}
      <text
        x={pTehran[0] + 10}
        y={pTehran[1] - 30}
        fontSize={24}
        fontWeight="bold"
        fill={C.iranStroke}
        fontFamily="Arial, sans-serif"
        opacity={iranLabelOpacity}
      >
        IRAN
      </text>

      {/* Distance badge au milieu de l'arc */}
      {showDistance && arcProgress > 0.7 && (
        <g
          transform={`translate(${midX}, ${midY})`}
          opacity={interpolate(arcProgress, [0.7, 0.9], [0, 1], { extrapolateRight: "clamp" })}
        >
          <rect
            x={-60}
            y={-22}
            width={120}
            height={44}
            rx={8}
            fill={C.dark}
            opacity={0.9}
          />
          <text
            x={0}
            y={-4}
            fontSize={13}
            fill={C.gold}
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            textAnchor="middle"
          >
            1 800 km
          </text>
          <text
            x={0}
            y={14}
            fontSize={11}
            fill={C.white}
            fontFamily="Arial, sans-serif"
            textAnchor="middle"
            opacity={0.8}
          >
            vol a vide
          </text>
        </g>
      )}
    </g>
  );
};

// ============================================================
// STICK FIGURES MODERNES
// ============================================================

// Soldat israelien — plus anguleux, casque
const SoldierIsrael: React.FC<{
  x: number;
  y: number;
  legAngle: number;
  armAngle: number;
  scale?: number;
}> = ({ x, y, legAngle, armAngle, scale = 1 }) => {
  const s = scale;
  const legLen = 60 * s;
  const armLen = 40 * s;
  const bodyH = 80 * s;
  const headR = 20 * s;

  // y = niveau des pieds (sol)
  const hipY = y - legLen;
  const bodyTop = hipY - bodyH;
  const shoulderY = bodyTop + 16 * s;

  const legSpread = legLen * 0.35;
  const lLegX = x + Math.sin(legAngle) * legSpread - legSpread * 0.3;
  const lLegY = y;
  const rLegX = x + Math.sin(-legAngle) * legSpread + legSpread * 0.3;
  const rLegY = y;

  const lArmX = x - armLen * 0.7 + Math.sin(-armAngle) * armLen * 0.3;
  const lArmY = shoulderY + armLen * 0.8;
  const rArmX = x + armLen * 0.7 + Math.sin(armAngle) * armLen * 0.3;
  const rArmY = shoulderY + armLen * 0.8;

  const color = C.blue;
  const strokeW = 5 * s;

  return (
    <g>
      {/* Tete */}
      <circle cx={x} cy={bodyTop - headR} r={headR} fill={color} />
      {/* Casque militaire */}
      <ellipse
        cx={x}
        cy={bodyTop - headR * 1.9}
        rx={headR * 1.3}
        ry={headR * 0.5}
        fill={C.blue}
      />
      {/* Corps */}
      <line x1={x} y1={bodyTop} x2={x} y2={hipY} stroke={color} strokeWidth={strokeW * 1.4} strokeLinecap="round" />
      {/* Bras gauche */}
      <line x1={x} y1={shoulderY} x2={lArmX} y2={lArmY} stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
      {/* Bras droit */}
      <line x1={x} y1={shoulderY} x2={rArmX} y2={rArmY} stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
      {/* Jambe gauche */}
      <line x1={x} y1={hipY} x2={lLegX} y2={lLegY} stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
      {/* Jambe droite */}
      <line x1={x} y1={hipY} x2={rLegX} y2={rLegY} stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
      {/* Badge etoile de david */}
      <text
        x={x}
        y={bodyTop + bodyH * 0.5}
        fontSize={14 * s}
        fill={C.white}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Arial, sans-serif"
      >
        ✡
      </text>
    </g>
  );
};

// Soldat iranien — turban / silhouette differente
const SoldierIran: React.FC<{
  x: number;
  y: number;
  legAngle: number;
  armAngle: number;
  scale?: number;
}> = ({ x, y, legAngle, armAngle, scale = 1 }) => {
  const s = scale;
  const legLen = 60 * s;
  const armLen = 40 * s;
  const bodyH = 80 * s;
  const headR = 20 * s;

  // y = niveau des pieds (sol)
  const hipY = y - legLen;
  const bodyTop = hipY - bodyH;
  const shoulderY = bodyTop + 16 * s;

  const legSpread = legLen * 0.35;
  const lLegX = x + Math.sin(legAngle) * legSpread - legSpread * 0.3;
  const lLegY = y;
  const rLegX = x + Math.sin(-legAngle) * legSpread + legSpread * 0.3;
  const rLegY = y;

  const lArmX = x - armLen * 0.7 + Math.sin(-armAngle) * armLen * 0.3;
  const lArmY = shoulderY + armLen * 0.8;
  const rArmX = x + armLen * 0.7 + Math.sin(armAngle) * armLen * 0.3;
  const rArmY = shoulderY + armLen * 0.8;

  const color = C.iran;
  const strokeW = 5 * s;

  return (
    <g>
      {/* Tete */}
      <circle cx={x} cy={bodyTop - headR} r={headR} fill={color} />
      {/* Turban */}
      <ellipse
        cx={x}
        cy={bodyTop - headR * 1.9}
        rx={headR * 1.5}
        ry={headR * 0.6}
        fill={C.iranStroke}
      />
      <rect
        x={x - headR * 0.4}
        y={bodyTop - headR * 2.5}
        width={headR * 0.8}
        height={headR * 0.6}
        rx={2}
        fill={C.iranStroke}
      />
      {/* Corps */}
      <line x1={x} y1={bodyTop} x2={x} y2={hipY} stroke={color} strokeWidth={strokeW * 1.4} strokeLinecap="round" />
      {/* Bras gauche */}
      <line x1={x} y1={shoulderY} x2={lArmX} y2={lArmY} stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
      {/* Bras droit */}
      <line x1={x} y1={shoulderY} x2={rArmX} y2={rArmY} stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
      {/* Jambe gauche */}
      <line x1={x} y1={hipY} x2={lLegX} y2={lLegY} stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
      {/* Jambe droite */}
      <line x1={x} y1={hipY} x2={rLegX} y2={rLegY} stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
    </g>
  );
};

// ============================================================
// PHASE 1 : Hook titre
// ============================================================
const PhaseHook: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 180 },
  });

  const titleY = interpolate(titleSpring, [0, 1], [80, 0]);
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [60, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.dark, opacity: opacity * exitOpacity }}>
      {/* Ligne decorative */}
      <div
        style={{
          position: "absolute",
          top: 700,
          left: 80,
          right: 80,
          height: 4,
          background: `linear-gradient(to right, ${C.red}, ${C.gold})`,
          borderRadius: 2,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 720,
          left: 0,
          right: 0,
          transform: `translateY(${titleY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: C.gold,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 6,
            marginBottom: 24,
          }}
        >
          Geopolitique
        </div>
        <div
          style={{
            fontSize: 72,
            color: C.white,
            fontFamily: "Arial Black, sans-serif",
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 32,
          }}
        >
          Pourquoi Israel peut frapper l&apos;Iran
        </div>
        <div
          style={{
            fontSize: 46,
            color: C.red,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          depuis 1 800 km
        </div>
      </div>

      {/* Sous-titre */}
      <div
        style={{
          position: "absolute",
          bottom: 300,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 26,
          color: "rgba(255,255,255,0.6)",
          fontFamily: "Arial, sans-serif",
          transform: `translateY(${titleY * 0.5}px)`,
        }}
      >
        La reponse en 45 secondes
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 2 : Carte avec arc
// ============================================================
const PhaseMap: React.FC<{
  topology: Topology;
  frame: number;    // frame absolue
  localFrame: number;
  fps: number;
  showArc: boolean;
  showDistance: boolean;
  opacity?: number;
}> = ({ topology, frame, localFrame, fps, showArc, showDistance, opacity = 1 }) => {
  const proj = buildProjection(2400, W / 2, 900);

  const mapScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 30, stiffness: 120 },
    from: 0.85,
    to: 1,
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={W} height={H} style={{ transform: `scale(${mapScale})`, transformOrigin: "center center" }}>
        <GeoMap
          topology={topology}
          projection={proj}
          frame={frame}
          localFrame={localFrame}
          fps={fps}
          showArc={showArc}
          showDistance={showDistance}
        />
      </svg>

      {/* Title overlay */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(localFrame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            color: C.dark,
            fontFamily: "Arial Black, sans-serif",
            padding: "16px 40px",
            background: "rgba(255,255,255,0.92)",
            display: "inline-block",
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          Moyen-Orient
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 3 : Transition carte -> stick figures
// ============================================================
const PhaseTransition: React.FC<{
  topology: Topology;
  frame: number;
  fps: number;
}> = ({ topology, frame, fps }) => {
  const progress = interpolate(frame, [0, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mapOpacity = 1 - progress;
  const bgOpacity = progress;

  const proj = buildProjection(2400, W / 2, 900);

  return (
    <AbsoluteFill>
      {/* Fond blanc qui arrive */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.white,
          opacity: bgOpacity,
        }}
      />
      {/* Carte qui s'efface */}
      <div style={{ position: "absolute", inset: 0, opacity: mapOpacity }}>
        <svg width={W} height={H}>
          <GeoMap
            topology={topology}
            projection={proj}
            frame={0}
            localFrame={200}
            fps={fps}
            showArc={true}
            showDistance={true}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 4 : Scene stick figures
// ============================================================
const PhaseStickFigures: React.FC<{
  frame: number;    // frame locale (0 = debut de cette phase)
  fps: number;
}> = ({ frame, fps }) => {
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  // Les deux soldats entrent depuis les cotes
  const israelEnter = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 150 },
  });
  const iranEnter = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, stiffness: 150 },
  });

  const israelX = interpolate(israelEnter, [0, 1], [-200, W * 0.22]);
  const iranX = interpolate(iranEnter, [0, 1], [W + 200, W * 0.78]);

  // Animation de marche qui ralentit une fois en place (60 frames)
  const walkPhase = frame * 0.12;
  const walkIntensity = interpolate(frame, [40, 80], [1, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const legAngle = Math.sin(walkPhase) * 0.5 * walkIntensity;
  const armAngle = Math.sin(walkPhase + Math.PI) * 0.4 * walkIntensity;

  const groundY = H * 0.68;
  const figScale = 2.4;

  // Badge de distance (apparait apres 80 frames)
  const distOpacity = interpolate(frame, [80, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ligne de pointilles entre les deux
  const lineOpacity = interpolate(frame, [90, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fleche du missile (apparait a 140f)
  const missileOpacity = interpolate(frame, [140, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const missileProgress = interpolate(frame, [150, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const missileStartX = W * 0.22;
  const missileEndX = W * 0.78;
  const missileMidY = groundY - 280;
  const missileCurrentX = interpolate(missileProgress, [0, 1], [missileStartX, missileEndX]);
  const missileCurrentY = interpolate(
    missileProgress,
    [0, 0.5, 1],
    [groundY - 100, missileMidY, groundY - 100]
  );

  // Texte explicatif (apparait a 160f)
  const textOpacity = interpolate(frame, [160, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: C.white, opacity }}>
      {/* Titre en haut */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: C.dark,
            fontFamily: "Arial Black, sans-serif",
            lineHeight: 1.1,
          }}
        >
          Deux adversaires.
        </div>
        <div
          style={{
            fontSize: 42,
            fontWeight: "bold",
            color: C.textDark,
            fontFamily: "Arial, sans-serif",
            marginTop: 12,
            opacity: 0.7,
          }}
        >
          Une distance impossible ?
        </div>
      </div>

      <svg width={W} height={H} overflow="visible">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={C.red} />
          </marker>
        </defs>

        {/* Sol */}
        <line
          x1={0}
          y1={groundY + 5}
          x2={W}
          y2={groundY + 5}
          stroke="#cccccc"
          strokeWidth={3}
        />
        <rect x={0} y={groundY + 5} width={W} height={H - groundY} fill="#f0f0f0" />

        {/* Ligne pointillee entre les deux soldats */}
        <line
          x1={W * 0.28}
          y1={groundY - 80}
          x2={W * 0.72}
          y2={groundY - 80}
          stroke="#999999"
          strokeWidth={2}
          strokeDasharray="12 8"
          opacity={lineOpacity}
        />

        {/* Soldats */}
        <SoldierIsrael
          x={israelX}
          y={groundY}
          legAngle={legAngle}
          armAngle={armAngle}
          scale={figScale}
        />

        {/* Soldat iranien miroir (tourne vers la gauche) */}
        <g transform={`scale(-1, 1) translate(${-iranX * 2 + iranX - iranX}, 0)`}>
          <SoldierIran
            x={iranX}
            y={groundY}
            legAngle={-legAngle}
            armAngle={-armAngle}
            scale={figScale}
          />
        </g>
        {/* Reaffiche sans le transform miroir pour le vrai rendu */}
        <g transform={`translate(${iranX * 2 - W}, 0) scale(-1, 1)`}>
          <SoldierIran
            x={W * 0.78}
            y={groundY}
            legAngle={-legAngle}
            armAngle={-armAngle}
            scale={figScale}
          />
        </g>

        {/* Missile arc */}
        {missileOpacity > 0 && (
          <>
            <path
              d={`M ${missileStartX} ${groundY - 100} Q ${(missileStartX + missileEndX) / 2} ${missileMidY} ${missileEndX} ${groundY - 100}`}
              fill="none"
              stroke={C.red}
              strokeWidth={2.5}
              strokeDasharray="8 6"
              opacity={missileOpacity * 0.4}
            />
            <circle
              cx={missileCurrentX}
              cy={missileCurrentY}
              r={8}
              fill={C.red}
              opacity={missileOpacity}
            />
          </>
        )}

        {/* Badge distance */}
        <g
          transform={`translate(${W / 2}, ${groundY - 80})`}
          opacity={distOpacity}
        >
          <rect x={-90} y={-30} width={180} height={60} rx={12} fill={C.dark} />
          <text
            x={0}
            y={-8}
            fontSize={18}
            fontWeight="bold"
            fill={C.gold}
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
          >
            1 800 km
          </text>
          <text
            x={0}
            y={12}
            fontSize={13}
            fill={C.white}
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            opacity={0.8}
          >
            Entre Israel et Natanz
          </text>
        </g>
      </svg>

      {/* Labels sous les personnages */}
      <div
        style={{
          position: "absolute",
          left: W * 0.22 - 60,
          top: groundY + 20,
          textAlign: "center",
          width: 120,
          opacity: distOpacity,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: C.blue,
            fontFamily: "Arial Black, sans-serif",
          }}
        >
          ISRAEL
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: W * 0.78 - 60,
          top: groundY + 20,
          textAlign: "center",
          width: 120,
          opacity: distOpacity,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: C.iran,
            fontFamily: "Arial Black, sans-serif",
          }}
        >
          IRAN
        </div>
      </div>

      {/* Texte explicatif en bas */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 60,
          right: 60,
          textAlign: "center",
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontSize: 38,
            fontWeight: "bold",
            color: C.textDark,
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.3,
          }}
        >
          Missiles balistiques :{" "}
          <span style={{ color: C.red }}>portee 2 000 km</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 5 : Retour carte avec stats
// ============================================================
const PhaseMapStats: React.FC<{
  topology: Topology;
  frame: number;
  fps: number;
}> = ({ topology, frame, fps }) => {
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const proj = buildProjection(2400, W / 2, 900);

  // Stats qui apparaissent progressivement
  const stat1Op = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stat2Op = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stat3Op = interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={W} height={H}>
        <GeoMap
          topology={topology}
          projection={proj}
          frame={0}
          localFrame={200}
          fps={fps}
          showArc={true}
          showDistance={true}
        />
      </svg>

      {/* Stats overlay en bas */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(10,10,26,0.92)",
          padding: "40px 50px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ opacity: stat1Op, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: C.red, flexShrink: 0 }} />
          <div style={{ fontSize: 28, color: C.white, fontFamily: "Arial, sans-serif" }}>
            <span style={{ color: C.gold, fontWeight: "bold" }}>1 800 km</span> — Distance Israel-Natanz
          </div>
        </div>
        <div style={{ opacity: stat2Op, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: C.blue, flexShrink: 0 }} />
          <div style={{ fontSize: 28, color: C.white, fontFamily: "Arial, sans-serif" }}>
            <span style={{ color: C.gold, fontWeight: "bold" }}>2 000 km</span> — Portee F-35I (ravitaille)
          </div>
        </div>
        <div style={{ opacity: stat3Op, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: C.orange, flexShrink: 0 }} />
          <div style={{ fontSize: 28, color: C.white, fontFamily: "Arial, sans-serif" }}>
            <span style={{ color: C.gold, fontWeight: "bold" }}>~2h30</span> — Temps de vol estime
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 6 : Outro CTA
// ============================================================
const PhaseOutro: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [240, 280], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ctaSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 18, stiffness: 200 },
  });
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.7, 1]);

  return (
    <AbsoluteFill
      style={{
        background: C.dark,
        opacity: opacity * exitOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          transform: `scale(${ctaScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Titre recap */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: C.white,
            fontFamily: "Arial Black, sans-serif",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Israel peut frapper l&apos;Iran.
        </div>

        {/* Stat cle */}
        <div
          style={{
            background: C.red,
            padding: "24px 60px",
            borderRadius: 16,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 900, color: C.white, fontFamily: "Arial Black, sans-serif" }}>
            1 800 km
          </div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.85)", fontFamily: "Arial, sans-serif" }}>
            La distance qui fait tout
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            fontSize: 32,
            color: C.gold,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Suis pour la suite
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
          }}
        >
          Geopolitique expliquee en 60s
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export const GeoShortProto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [topology, setTopology] = useState<Topology | null>(null);
  const handleRef = useRef<number | null>(null);

  useEffect(() => {
    handleRef.current = delayRender("Loading topology");
    fetch(staticFile("assets/peste-pixel/maps/countries-50m.json"))
      .then((r) => r.json())
      .then((data) => {
        setTopology(data);
        if (handleRef.current !== null) continueRender(handleRef.current);
      })
      .catch(() => {
        if (handleRef.current !== null) continueRender(handleRef.current);
      });
    return () => {};
  }, []);

  if (!topology) return null;

  // Timing des phases
  const T = {
    hook:       { start: 0,    end: 90 },
    map:        { start: 90,   end: 480 },
    transition: { start: 480,  end: 600 },
    figures:    { start: 600,  end: 900 },
    mapStats:   { start: 900,  end: 1050 },
    outro:      { start: 1050, end: 1350 },
  };

  const inRange = (s: number, e: number) => frame >= s && frame < e;

  return (
    <AbsoluteFill style={{ background: C.dark }}>
      {/* Phase 1 : Hook */}
      {inRange(T.hook.start, T.hook.end + 30) && (
        <PhaseHook frame={frame - T.hook.start} fps={fps} />
      )}

      {/* Phase 2 : Carte principale */}
      {inRange(T.map.start, T.map.end) && (
        <PhaseMap
          topology={topology}
          frame={frame}
          localFrame={frame - T.map.start}
          fps={fps}
          showArc={frame > T.map.start + 60}
          showDistance={frame > T.map.start + 150}
        />
      )}

      {/* Phase 3 : Transition */}
      {inRange(T.transition.start, T.transition.end) && (
        <PhaseTransition
          topology={topology}
          frame={frame - T.transition.start}
          fps={fps}
        />
      )}

      {/* Phase 4 : Stick figures */}
      {inRange(T.figures.start, T.figures.end) && (
        <PhaseStickFigures
          frame={frame - T.figures.start}
          fps={fps}
        />
      )}

      {/* Phase 5 : Carte + stats */}
      {inRange(T.mapStats.start, T.mapStats.end) && (
        <PhaseMapStats
          topology={topology}
          frame={frame - T.mapStats.start}
          fps={fps}
        />
      )}

      {/* Phase 6 : Outro */}
      {inRange(T.outro.start, T.outro.end) && (
        <PhaseOutro frame={frame - T.outro.start} fps={fps} />
      )}
    </AbsoluteFill>
  );
};
