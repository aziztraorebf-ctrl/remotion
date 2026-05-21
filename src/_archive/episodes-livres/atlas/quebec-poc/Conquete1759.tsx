// La Conquête 1759 — Carte tactique — POC Quebec Atlas
// Scène : Siège de Québec, bataille des Plaines d'Abraham
// Format : 1920x1080 (16:9), 15s, 30fps = 450 frames
// NO audio — concept visuel pur

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

export const CONQUETE_1759_FRAMES = 450; // 15s @ 30fps

// Palette
const C = {
  ocean: "#1a2a4a",
  oceanLight: "#1e3359",
  cliff: "#2d2d2d",
  plains: "#4a6741",
  city: "#c8b89a",
  french: "#2d4a8a",
  british: "#8a1a1a",
  gold: "#c9a84c",
  goldLight: "#e8c96a",
  cartouche: "#1a1a2e",
  river: "#1a3a6a",
  text: "#f0e6c8",
  arrow: "#cc2222",
  smoke: "rgba(200,180,140,0.15)",
};

// Timing des beats narratifs
const T = {
  // Phase 1 : révélation de la carte (0-60)
  mapReveal: 0,
  // Phase 2 : flotte britannique entre (60-120)
  fleetIn: 60,
  // Phase 3 : la nuit — percée à l'Anse-au-Foulon (120-200)
  nightClimb: 120,
  // Phase 4 : formations sur les Plaines (200-300)
  formations: 200,
  // Phase 5 : flèches d'attaque + cartouches (300-400)
  attack: 300,
  // Phase 6 : cartouches finaux (380-450)
  cartouches: 380,
};

function easeOut(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function fadeIn(frame: number, start: number, duration = 20) {
  return clamp(interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }), 0, 1);
}

// Composant navire pixel-art SVG
function ShipIcon({ x, y, size = 18, opacity = 1 }: { x: number; y: number; size?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity}>
      <rect x={-size * 0.5} y={-size * 0.15} width={size} height={size * 0.35} fill={C.british} rx={2} />
      <line x1={0} y1={-size * 0.15} x2={0} y2={-size * 0.7} stroke={C.british} strokeWidth={1.5} />
      <polygon points={`0,${-size * 0.65} ${size * 0.35},${-size * 0.35} 0,${-size * 0.35}`} fill={C.british} opacity={0.8} />
      <polygon points={`0,${-size * 0.35} ${size * 0.32},${-size * 0.15} 0,${-size * 0.15}`} fill={C.british} opacity={0.6} />
    </g>
  );
}

// Composant formation militaire (carré de soldats)
function Formation({ x, y, color, size = 22, opacity = 1 }: { x: number; y: number; color: string; size?: number; opacity?: number }) {
  return (
    <g opacity={opacity}>
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={x + col * (size * 0.38) - size * 0.38}
            y={y + row * (size * 0.38) - size * 0.38}
            width={size * 0.3}
            height={size * 0.3}
            fill={color}
            rx={1}
          />
        ))
      )}
    </g>
  );
}

// Cartouche ornemental réutilisable
function Cartouche({
  x, y, width, height, opacity, children,
}: {
  x: number; y: number; width: number; height: number; opacity: number; children?: React.ReactNode;
}) {
  return (
    <g opacity={opacity}>
      {/* Fond */}
      <rect x={x} y={y} width={width} height={height} fill={C.cartouche} rx={4} opacity={0.92} />
      {/* Bordure or */}
      <rect x={x} y={y} width={width} height={height} fill="none" stroke={C.gold} strokeWidth={2.5} rx={4} />
      {/* Coins ornementaux */}
      {[
        [x + 6, y + 6], [x + width - 6, y + 6],
        [x + 6, y + height - 6], [x + width - 6, y + height - 6],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={4} fill={C.gold} opacity={0.7} />
          <circle cx={cx} cy={cy} r={2} fill={C.goldLight} />
        </g>
      ))}
      {/* Ligne intérieure */}
      <rect x={x + 10} y={y + 10} width={width - 20} height={height - 20} fill="none" stroke={C.gold} strokeWidth={0.8} rx={2} opacity={0.4} />
      {children}
    </g>
  );
}

export function Conquete1759() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase 1 : révélation de la carte ──
  const mapOpacity = fadeIn(frame, T.mapReveal, 40);
  const mapScale = interpolate(frame, [0, 60], [1.08, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Phase 2 : flotte britannique ──
  const fleetOpacity = fadeIn(frame, T.fleetIn, 30);
  const fleetX = interpolate(frame, [T.fleetIn, T.fleetIn + 80], [820, 680], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Phase 3 : flèches percée nuit (Anse-au-Foulon) ──
  const arrowProgress = interpolate(frame, [T.nightClimb, T.nightClimb + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Phase 4 : formations apparaissent ──
  const frenchFormOpacity = fadeIn(frame, T.formations, 25);
  const britishFormOpacity = fadeIn(frame, T.formations + 15, 25);

  // ── Phase 5 : flèches d'attaque britannique ──
  const attackProgress = interpolate(frame, [T.attack, T.attack + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Phase 6 : cartouches ──
  const cartouche1Opacity = fadeIn(frame, T.cartouches, 25);
  const cartouche2Opacity = fadeIn(frame, T.cartouches + 30, 25);

  // Pulse marker sur Québec
  const pulseScale = 1 + 0.3 * Math.sin(frame * 0.15);
  const pulseOpacity = 0.4 + 0.3 * Math.sin(frame * 0.15);

  // Étoiles (nuit) qui apparaissent à la phase 3
  const starsOpacity = fadeIn(frame, T.nightClimb - 20, 40);

  return (
    <AbsoluteFill style={{ background: C.ocean }}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={C.oceanLight} />
            <stop offset="100%" stopColor={C.ocean} />
          </linearGradient>
          <linearGradient id="cliffGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3a3530" />
            <stop offset="100%" stopColor="#1e1a16" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Fond océan / fleuve Saint-Laurent ── */}
        <rect width="1920" height="1080" fill="url(#oceanGrad)" opacity={mapOpacity} />

        {/* Étoiles (apparaissent à la phase nuit) */}
        {Array.from({ length: 60 }, (_, i) => {
          const sx = (((i * 137.5) % 1) * 1920);
          const sy = (((i * 97.3) % 1) * 400);
          const twinkle = 0.3 + 0.5 * Math.sin(frame * 0.08 + i * 1.7);
          return (
            <circle key={i} cx={sx} cy={sy} r={1.2} fill="white"
              opacity={starsOpacity * twinkle} />
          );
        })}

        {/* ── Géographie principale ── */}
        <g opacity={mapOpacity} transform={`scale(${mapScale}) translate(${(1 - mapScale) * 960}, ${(1 - mapScale) * 540})`}>

          {/* Rive sud du Saint-Laurent (bas) */}
          <path
            d="M 0 700 Q 300 660 600 680 Q 900 700 1200 690 Q 1500 680 1920 660 L 1920 1080 L 0 1080 Z"
            fill="#3d4a32"
            opacity={0.7}
          />

          {/* Le Saint-Laurent — fleuve principal */}
          <path
            d="M 0 580 Q 200 560 400 555 Q 600 550 750 545 Q 900 540 1050 535 Q 1200 530 1400 520 Q 1600 510 1920 500"
            fill="none"
            stroke={C.river}
            strokeWidth={90}
            opacity={0.9}
          />
          <path
            d="M 0 580 Q 200 560 400 555 Q 600 550 750 545 Q 900 540 1050 535 Q 1200 530 1400 520 Q 1600 510 1920 500"
            fill="none"
            stroke="#1e3d6a"
            strokeWidth={85}
          />

          {/* La falaise de Québec — élément central */}
          {/* Rive nord — plateau avant la falaise */}
          <path
            d="M 0 470 Q 200 450 380 445 Q 500 442 560 440 L 560 540 Q 480 535 380 530 Q 200 525 0 510 Z"
            fill="#4a5a3a"
          />

          {/* La falaise escarpée */}
          <path
            d="M 560 440 Q 600 438 640 442 L 660 460 Q 670 480 665 520 Q 660 540 640 545 L 560 540 Z"
            fill="url(#cliffGrad)"
          />

          {/* Plateau des Plaines d'Abraham */}
          <path
            d="M 560 350 Q 650 320 780 310 Q 900 300 1000 305 Q 1100 310 1150 320 L 1160 440 Q 1100 445 1000 442 Q 900 440 780 445 Q 660 450 640 442 L 560 440 Z"
            fill={C.plains}
          />

          {/* Québec City — zone construite sur le cap */}
          <path
            d="M 640 442 Q 700 430 820 420 Q 900 415 960 418 L 970 445 Q 900 450 820 455 Q 700 460 660 460 Z"
            fill={C.city}
            opacity={0.85}
          />

          {/* Bâtiments stylisés Québec */}
          {[[700, 428], [740, 424], [780, 422], [820, 420], [860, 422], [900, 425], [940, 428]].map(([bx, by], i) => (
            <rect key={i} x={bx - 6} y={by - 10} width={10} height={12}
              fill="#a09070" opacity={0.9} rx={1} />
          ))}

          {/* Pulse marker — Québec City */}
          <circle cx={800} cy={435} r={12 * pulseScale} fill={C.gold}
            opacity={pulseOpacity * mapOpacity} />
          <circle cx={800} cy={435} r={6} fill={C.goldLight} opacity={mapOpacity} />

          {/* Label Québec City */}
          <text x={830} y={432} fill={C.text} fontSize={18} fontFamily="Georgia, serif"
            opacity={mapOpacity} fontStyle="italic">Québec</text>

          {/* Anse-au-Foulon — point de débarquement */}
          <circle cx={595} cy={500} r={5} fill={C.goldLight} opacity={mapOpacity * 0.8} />
          <text x={540} y={520} fill={C.text} fontSize={12} fontFamily="Georgia, serif"
            opacity={mapOpacity * 0.7} fontStyle="italic">Anse-au-Foulon</text>

          {/* Label Saint-Laurent */}
          <text x={300} y={590} fill={C.text} fontSize={16} fontFamily="Georgia, serif"
            opacity={mapOpacity * 0.6} fontStyle="italic">Fleuve Saint-Laurent</text>
        </g>

        {/* ── Flotte britannique (Phase 2) ── */}
        <g opacity={fleetOpacity}>
          {[
            [fleetX, 600],
            [fleetX + 55, 585],
            [fleetX + 110, 595],
            [fleetX + 30, 622],
            [fleetX + 85, 615],
            [fleetX + 140, 605],
            [fleetX - 30, 612],
          ].map(([sx, sy], i) => (
            <ShipIcon key={i} x={sx} y={sy} size={20} />
          ))}
          <text x={fleetX + 55} y={648} fill={C.british} fontSize={13}
            fontFamily="Georgia, serif" textAnchor="middle" opacity={0.8}>
            Flotte britannique
          </text>
        </g>

        {/* ── Flèches percée nocturne Anse-au-Foulon (Phase 3) ── */}
        {arrowProgress > 0 && (
          <g opacity={clamp(arrowProgress * 2, 0, 1)}>
            {/* Flèche principale : rivière → falaise → plaines */}
            <path
              d={`M 650 ${580 + (1 - arrowProgress) * 80}
                  Q 610 520 595 ${500 - arrowProgress * 30}
                  Q 585 460 575 ${440 - arrowProgress * 60}
                  L 575 ${380 - arrowProgress * 30}`}
              fill="none"
              stroke={C.arrow}
              strokeWidth={3.5}
              strokeDasharray="8 4"
              opacity={0.9}
              filter="url(#glow)"
              strokeLinecap="round"
            />
            <polygon
              points={`575,${380 - arrowProgress * 30 - 12} 568,${380 - arrowProgress * 30 + 2} 582,${380 - arrowProgress * 30 + 2}`}
              fill={C.arrow}
              opacity={clamp((arrowProgress - 0.6) * 2.5, 0, 1)}
            />
            <text x={510} y={490} fill={C.arrow} fontSize={13}
              fontFamily="Georgia, serif" fontStyle="italic"
              opacity={clamp((arrowProgress - 0.3) * 2, 0, 1)}>
              Débarquement nocturne
            </text>
          </g>
        )}

        {/* ── Formations militaires sur les Plaines (Phase 4) ── */}
        {/* Français — côté droit des Plaines */}
        <g opacity={frenchFormOpacity}>
          {[[880, 355], [920, 355], [960, 355], [880, 390], [920, 390]].map(([fx, fy], i) => (
            <Formation key={i} x={fx} y={fy} color={C.french} size={24} />
          ))}
          <text x={920} y={335} fill={C.text} fontSize={13} fontFamily="Georgia, serif"
            textAnchor="middle" opacity={frenchFormOpacity * 0.9}>Français</text>
        </g>

        {/* Britanniques — côté gauche des Plaines */}
        <g opacity={britishFormOpacity}>
          {[[680, 355], [720, 355], [760, 355], [680, 390], [720, 390], [760, 390]].map(([bx, by], i) => (
            <Formation key={i} x={bx} y={by} color={C.british} size={24} />
          ))}
          <text x={720} y={335} fill={C.text} fontSize={13} fontFamily="Georgia, serif"
            textAnchor="middle" opacity={britishFormOpacity * 0.9}>Britanniques</text>
        </g>

        {/* ── Flèches d'attaque britannique (Phase 5) ── */}
        {attackProgress > 0 && (
          <g>
            {[
              { x1: 760, y1: 370, x2: 860, y2: 370 },
              { x1: 760, y1: 385, x2: 860, y2: 385 },
              { x1: 760, y1: 358, x2: 860, y2: 358 },
            ].map((line, i) => {
              const len = (line.x2 - line.x1) * attackProgress;
              return (
                <g key={i}>
                  <line
                    x1={line.x1} y1={line.y1}
                    x2={line.x1 + len} y2={line.y2}
                    stroke={C.arrow} strokeWidth={2.5}
                    opacity={clamp(attackProgress * 1.5, 0, 0.9)}
                    strokeLinecap="round"
                  />
                  {attackProgress > 0.85 && (
                    <polygon
                      points={`${line.x2 + 8},${line.y2} ${line.x2 - 2},${line.y2 - 5} ${line.x2 - 2},${line.y2 + 5}`}
                      fill={C.arrow}
                      opacity={0.9}
                    />
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* ── Cartouche 1 : durée de la bataille (Phase 6) ── */}
        <Cartouche x={60} y={60} width={320} height={130} opacity={cartouche1Opacity}>
          <text x={220} y={108} fill={C.goldLight} fontSize={36}
            fontFamily="Georgia, serif" textAnchor="middle" fontWeight="bold">
            15 minutes
          </text>
          <text x={220} y={128} fill={C.text} fontSize={13}
            fontFamily="Georgia, serif" textAnchor="middle" opacity={0.8}>
            durée de la bataille
          </text>
          <text x={220} y={82} fill={C.gold} fontSize={12}
            fontFamily="Georgia, serif" textAnchor="middle" opacity={0.7}
            letterSpacing="2">
            13 SEPTEMBRE 1759
          </text>
        </Cartouche>

        {/* ── Cartouche 2 : les deux généraux (Phase 6) ── */}
        <Cartouche x={1540} y={820} width={340} height={130} opacity={cartouche2Opacity}>
          <text x={1710} y={860} fill={C.gold} fontSize={12}
            fontFamily="Georgia, serif" textAnchor="middle" opacity={0.7}
            letterSpacing="2">
            MONTCALM · WOLFE
          </text>
          <text x={1710} y={890} fill={C.goldLight} fontSize={22}
            fontFamily="Georgia, serif" textAnchor="middle" fontWeight="bold">
            Meurent le même jour
          </text>
          <text x={1710} y={916} fill={C.text} fontSize={12}
            fontFamily="Georgia, serif" textAnchor="middle" opacity={0.75}>
            les deux commandants
          </text>
          <text x={1710} y={934} fill={C.text} fontSize={12}
            fontFamily="Georgia, serif" textAnchor="middle" opacity={0.75}>
            tombent à Québec
          </text>
        </Cartouche>

        {/* ── Titre discret en bas ── */}
        <text x={960} y={1050} fill={C.gold} fontSize={14}
          fontFamily="Georgia, serif" textAnchor="middle" opacity={mapOpacity * 0.5}
          letterSpacing="3">
          LA CONQUÊTE · 1759 · PLAINES D'ABRAHAM
        </text>
      </svg>
    </AbsoluteFill>
  );
}
