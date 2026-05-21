import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ============================================================
// HOOK BLOC B - Carte de propagation : Issyk-Kul -> Caffa -> Messine
// Architecture : fond nautique enluminure + overlay parchemin carte
// Total : 1018 frames @30fps (~34s)
//
// Seg 1 : hook_01 (0-286f)   - galeres en route, carte apparait
// Seg 2 : hook_02 (286-663f) - Caffa, catapulte, fleche vers Messine
// Seg 3 : hook_03 (663-1018f)- Messine, octobre 1347, marins mourants
// ============================================================

// Timing audio
const SEG1_START = 0;
const SEG2_START = 286;
const SEG3_START = 663;
const TOTAL_FRAMES = 1018;

// Palette enluminure (mode couleur fixe - pas de transition vers gravure)
const C = {
  skyDay: "#2D3A8C",
  gold: "#C9A227",
  goldDark: "#8B6914",
  parchment: "#F5E6C8",
  parchmentDark: "#D4B896",
  vermillon: "#C1392B",
  ink: "#1A1008",
  inkLight: "#3D2810",
  seaDay: "#1B4F8C",
  seaMap: "#A8C4E0",
  landMap: "#C8B878",
  hullDay: "#8B4513",
  sailDay: "#F5E6C8",
};

// ============================================================
// FOND NAUTIQUE (style EnluminureGravureProto - enluminure fixe)
// ============================================================

// Particule de fumee en espace local galere (sommet du mat)
function GalereSmokePuff({ frame, phase, opacity }: { frame: number; phase: number; opacity: number }) {
  const t = (frame * 0.7 + phase * 35) % 80;
  const rise  = interpolate(t, [0, 80], [0, -70], { extrapolateRight: "clamp" });
  const drift = Math.sin((frame + phase * 25) * 0.06) * 14;
  const fade  = interpolate(t, [0, 20, 80], [0, opacity * 0.6, 0]);
  const r     = interpolate(t, [0, 80], [5, 18]);
  return (
    <ellipse cx={drift} cy={-230 + rise} rx={r * 1.3} ry={r}
      fill="#A08060" opacity={fade} />
  );
}

function Galere({ x, y, scale = 1, frame = 0, phase = 0 }: { x: number; y: number; scale?: number; frame?: number; phase?: number }) {
  const sailTilt = Math.sin(frame * 0.05 + phase) * 3;

  // Seg3 : le bateau porte les traces du voyage maudit
  // Progress 0 (debut Seg3) -> 1 (fin de la scene)
  const wearProgress = interpolate(frame, [SEG3_START, SEG3_START + 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Coque assombrie progressivement
  const hullColor = lerpHex(C.hullDay, "#3A1A05", wearProgress);
  // Voile ternie (de creme vers gris-brun)
  const sailColor = lerpHex(C.sailDay, "#C0AA88", wearProgress);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <path
        d="M -160 0 Q -180 40 -140 60 L 140 60 Q 180 40 160 0 Z"
        fill={hullColor}
        stroke="#3A1005"
        strokeWidth={2 / scale}
      />
      <rect x="-150" y="-8" width="300" height="12" fill={hullColor} stroke="#3A1005" strokeWidth={1.5 / scale} />
      <line x1="0" y1="-8" x2="0" y2="-220" stroke="#3A1005" strokeWidth={4 / scale} />
      <g transform={`rotate(${sailTilt}, 0, -130)`}>
        <path
          d="M 0 -200 Q 60 -140 50 -60 L -50 -60 Q -60 -140 0 -200 Z"
          fill={sailColor}
          stroke="#5C2A0A"
          strokeWidth={1.5 / scale}
        />
        {/* Dechirure dans la voile (apparait progressivement en Seg3) */}
        {wearProgress > 0.3 && (
          <path
            d="M 20 -160 L 35 -140 L 18 -125"
            fill="none"
            stroke="#3A1005"
            strokeWidth={2 / scale}
            opacity={Math.min(1, (wearProgress - 0.3) / 0.4)}
            strokeLinecap="round"
          />
        )}
        <line x1="0" y1="-190" x2="0" y2="-70" stroke="#5C2A0A" strokeWidth={2 / scale} />
        <line x1="-40" y1="-145" x2="40" y2="-145" stroke="#5C2A0A" strokeWidth={2 / scale} />
      </g>
      <line x1="0" y1="-180" x2="-100" y2="-100" stroke="#5C2A0A" strokeWidth={2.5 / scale} />
      <path
        d="M -100 -100 Q -70 -110 0 -180 Q -30 -100 -80 -85 Z"
        fill={sailColor}
        stroke="#5C2A0A"
        strokeWidth={1 / scale}
        opacity={0.9}
      />
      {([-80, 0, 80] as number[]).map((rx, i) => (
        <g key={i}>
          <line x1={rx} y1="40" x2={rx - 20} y2="90" stroke="#8B6B3D" strokeWidth={3 / scale} />
          <line x1={rx} y1="40" x2={rx + 20} y2="90" stroke="#8B6B3D" strokeWidth={3 / scale} />
        </g>
      ))}
      <line x1="0" y1="-220" x2="0" y2="-200" stroke="#5C2A0A" strokeWidth={2 / scale} />
      <path d="M 0 -220 L 30 -210 L 0 -200 Z" fill={C.vermillon} opacity={0.9} />
      {/* Fumee — apparait progressivement en Seg3 (voyage maudit) */}
      {wearProgress > 0 && (
        <>
          <GalereSmokePuff frame={frame} phase={0} opacity={wearProgress} />
          <GalereSmokePuff frame={frame} phase={1.3} opacity={wearProgress} />
          <GalereSmokePuff frame={frame} phase={2.7} opacity={wearProgress} />
        </>
      )}
    </g>
  );
}

function Waves({ frame }: { frame: number }) {
  const offset = (frame * 1.5) % 80;
  return (
    <g>
      <rect x="0" y="580" width="1920" height="500" fill={C.seaDay} />
      {([0, 1, 2, 3, 4] as number[]).map((i) => {
        const wx = ((i * 400) - offset * 2 + 1920) % 2200 - 200;
        return (
          <path
            key={i}
            d={`M ${wx} 600 Q ${wx + 100} 575 ${wx + 200} 600 Q ${wx + 300} 625 ${wx + 400} 600`}
            fill="none"
            stroke="#A8C8E8"
            strokeWidth={3}
            opacity={0.5}
          />
        );
      })}
      {([0, 1, 2, 3] as number[]).map((i) => {
        const wx = ((i * 500) - offset + 1920) % 2400 - 200;
        return (
          <path
            key={i}
            d={`M ${wx} 680 Q ${wx + 125} 655 ${wx + 250} 680 Q ${wx + 375} 705 ${wx + 500} 680`}
            fill="none"
            stroke="#A8C8E8"
            strokeWidth={5}
            opacity={0.7}
          />
        );
      })}
    </g>
  );
}

// La cote sicilienne apparait progressivement en Seg 3 (galeres approchent de Messine)
// Design plus detaille : falaises, relief, tour, port, ville
function SicilianCoast({ frame }: { frame: number }) {
  const opacity = interpolate(
    frame,
    [SEG3_START, SEG3_START + 60],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (opacity < 0.01) return null;
  return (
    <g opacity={opacity}>
      {/* Relief principal - terrain avec irregularites */}
      <path
        d="M 1380 580 Q 1395 520 1420 490 Q 1450 460 1480 450 Q 1510 440 1540 455 Q 1570 435 1600 445 Q 1640 430 1670 440 Q 1710 425 1750 438 Q 1790 428 1830 440 Q 1870 430 1900 445 Q 1915 452 1920 460 L 1920 1080 L 1380 1080 Z"
        fill="#7A9448"
        stroke="#4A6A20"
        strokeWidth={2}
      />
      {/* Colline de relief (profondeur) */}
      <path
        d="M 1500 460 Q 1560 410 1620 425 Q 1680 415 1720 430 Q 1700 460 1620 455 Q 1560 440 1500 460 Z"
        fill="#6B8840"
        opacity={0.7}
      />
      {/* Falaises sur la cote (texture) */}
      <path
        d="M 1380 580 Q 1390 545 1410 520 L 1410 580 Z"
        fill="#5A7A30"
        opacity={0.6}
      />
      <path
        d="M 1440 500 L 1445 460 L 1450 500 Z"
        fill="#5A7A30"
        opacity={0.5}
      />
      {/* Tour de guet medievale (Messine) */}
      <rect x="1615" y="400" width="22" height="50" fill="#C8B878" stroke="#8B7040" strokeWidth={1.5} />
      {/* Crenaux de la tour */}
      {([0, 6, 12, 18] as number[]).map((dx, i) => (
        <rect key={i} x={1615 + dx} y="393" width="4" height="10" fill="#C8B878" stroke="#8B7040" strokeWidth={1} />
      ))}
      {/* Fenetre de la tour */}
      <rect x="1623" y="415" width="7" height="9" rx="3" fill="#4A3010" />
      {/* Petites maisons groupees (ville de Messine) */}
      <rect x="1640" y="435" width="16" height="20" fill="#D4C59A" stroke="#8B7040" strokeWidth={1} />
      <polygon points="1638,435 1658,435 1648,420" fill={C.vermillon} opacity={0.85} />
      <rect x="1660" y="440" width="12" height="15" fill="#C8B878" stroke="#8B7040" strokeWidth={1} />
      <polygon points="1658,440 1674,440 1666,427" fill="#8B5A2A" opacity={0.8} />
      {/* Drapeau sur la tour */}
      <line x1="1626" y1="393" x2="1626" y2="378" stroke="#8B7040" strokeWidth={1.5} />
      <path d="M 1626 378 L 1642 383 L 1626 388 Z" fill={C.vermillon} opacity={0.9} />
      {/* Vegetation (arbres) sur les collines */}
      {([
        { x: 1480, y: 462 },
        { x: 1550, y: 440 },
        { x: 1700, y: 435 },
        { x: 1760, y: 442 },
        { x: 1840, y: 438 },
      ]).map((t, i) => (
        <g key={i}>
          <line x1={t.x} y1={t.y} x2={t.x} y2={t.y + 14} stroke="#3A5A18" strokeWidth={2} />
          <ellipse cx={t.x} cy={t.y} rx={8} ry={11} fill="#4A7A28" opacity={0.85} />
        </g>
      ))}
      {/* Label Messine */}
      <text
        x="1628" y="388"
        fontSize="15"
        fontFamily="Georgia, serif"
        fill={C.parchment}
        fontStyle="italic"
        fontWeight="bold"
        textAnchor="middle"
        style={{ textShadow: "0 1px 3px #1A1008" }}
      >
        Messine
      </text>
      {/* Ligne de rivage - transition eau/terre */}
      <path
        d="M 1380 578 Q 1420 568 1460 572 Q 1500 566 1540 570 Q 1600 563 1640 567 Q 1700 560 1760 564 Q 1830 558 1880 562 L 1920 560"
        fill="none"
        stroke="#4A6A20"
        strokeWidth={2}
        opacity={0.7}
      />
    </g>
  );
}

function Clouds({ frame }: { frame: number }) {
  const offset = frame * 0.3;
  return (
    <g opacity={0.6}>
      {([
        { x: 200, y: 120, r: 60 },
        { x: 320, y: 100, r: 80 },
        { x: 440, y: 115, r: 55 },
        { x: 900, y: 140, r: 70 },
        { x: 1020, y: 120, r: 90 },
        { x: 1150, y: 135, r: 60 },
      ]).map((c, i) => (
        <ellipse
          key={i}
          cx={((c.x - offset * (i % 2 === 0 ? 1 : 0.7)) % 2100 + 2100) % 2100}
          cy={c.y}
          rx={c.r}
          ry={c.r * 0.55}
          fill="#E8EFF8"
        />
      ))}
    </g>
  );
}

// ============================================================
// CONTEXT OVERLAY : indicateur lieu + date (remplace le % animé)
// Seg 1 : "Lac Issyk-Koul · 1338"
// Seg 2 : "Caffa, Crimée · 1346"
// Seg 3 : "Messine, Sicile · Octobre 1347"
// ============================================================

function ContextOverlay({ frame }: { frame: number }) {
  const fadeIn = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Transition entre segments
  const seg2opacity = interpolate(
    frame,
    [SEG2_START - 8, SEG2_START + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const seg3opacity = interpolate(
    frame,
    [SEG3_START - 8, SEG3_START + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const seg1opacity = Math.max(0, 1 - seg2opacity);

  // Choisir le texte actif
  let lieu = "Lac Issyk-Koul";
  let date = "1338";
  let opacity = seg1opacity * fadeIn;
  if (seg3opacity > 0.5) {
    lieu = "Messine, Sicile";
    date = "Octobre 1347";
    opacity = seg3opacity;
  } else if (seg2opacity > 0.5) {
    lieu = "Caffa, Crim\u00e9e";
    date = "1346";
    opacity = seg2opacity;
  }

  return (
    <g opacity={opacity}>
      <rect x="60" y="55" width="260" height="70" rx="4" fill="rgba(0,0,0,0.55)" stroke={C.gold} strokeWidth={1.5} />
      <text x="72" y="76" fontSize="10" fill={C.gold} fontFamily="serif">{"✦"}</text>
      <text x="302" y="76" fontSize="10" fill={C.gold} fontFamily="serif">{"✦"}</text>
      <text
        x="190" y="84"
        textAnchor="middle"
        fontSize="11"
        fontFamily="Georgia, serif"
        fill={C.gold}
        letterSpacing="2"
        fontStyle="italic"
      >
        {lieu}
      </text>
      <text
        x="190" y="112"
        textAnchor="middle"
        fontSize="24"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fill={C.parchment}
      >
        {date}
      </text>
    </g>
  );
}

// ============================================================
// OVERLAY PARCHEMIN - CARTE EUROPE
// ============================================================

function EuropeContour() {
  return (
    <g>
      <path
        d="
          M 60 320
          Q 20 300 10 260
          Q 0 220 30 190
          Q 10 170 20 140
          Q 40 110 80 100
          Q 70 70 100 50
          Q 130 30 160 40
          Q 180 20 210 30
          Q 240 10 270 25
          Q 300 15 320 40
          Q 350 30 370 60
          Q 400 50 420 80
          Q 450 90 460 120
          Q 480 150 460 180
          Q 490 210 470 240
          Q 480 270 460 290
          Q 440 320 400 330
          Q 380 360 350 370
          Q 320 390 290 380
          Q 260 400 230 390
          Q 200 410 170 400
          Q 140 415 110 400
          Q 80 390 60 370
          Q 40 350 60 320
          Z
        "
        fill={C.landMap}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      <path
        d="M 60 320 Q 30 340 20 370 Q 10 400 40 420 Q 70 440 100 430 Q 130 450 150 435 Q 170 420 160 390 Q 170 360 150 340 Q 130 320 110 330 Q 90 340 60 320 Z"
        fill={C.landMap}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      <path
        d="M 290 310 Q 300 330 295 360 Q 290 390 280 410 Q 275 430 285 445 Q 295 455 305 445 Q 315 430 320 400 Q 330 370 325 340 Q 315 315 290 310 Z"
        fill={C.landMap}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      <ellipse cx="295" cy="462" rx="18" ry="10" fill={C.landMap} stroke={C.ink} strokeWidth={1} />
      <path
        d="M 120 80 Q 100 60 110 40 Q 130 20 150 30 Q 170 20 175 50 Q 180 80 160 95 Q 140 100 120 80 Z"
        fill={C.landMap}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      <path
        d="M 270 25 Q 285 5 300 0 Q 330 -10 345 15 Q 355 40 340 65 Q 355 80 345 100 Q 330 110 315 90 Q 300 110 285 95 Q 270 75 285 55 Q 270 40 270 25 Z"
        fill={C.landMap}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      <path
        d="M 170 390 Q 200 380 230 385 Q 260 380 290 390 Q 310 370 320 380 Q 295 410 280 420 Q 260 430 240 420 Q 210 430 185 415 Q 165 405 170 390 Z"
        fill={C.seaMap}
        stroke={C.ink}
        strokeWidth={0.8}
        opacity={0.7}
      />
    </g>
  );
}

function PropagationArrow({
  x1, y1, x2, y2, frame, startFrame, endFrame, color = C.vermillon,
}: {
  x1: number; y1: number; x2: number; y2: number;
  frame: number; startFrame: number; endFrame: number; color?: string;
}) {
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const px = x1 + (x2 - x1) * progress;
  const py = y1 + (y2 - y1) * progress;
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const drawnLen = len * progress;

  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray={`${drawnLen} ${len}`}
        strokeLinecap="round"
        opacity={0.8}
      />
      {progress > 0.05 && <circle cx={px} cy={py} r={3} fill={color} opacity={0.9} />}
    </g>
  );
}

function PropagationPoint({
  x, y, label, sublabel, frame, appearFrame, isDestination = false,
}: {
  x: number; y: number; label: string; sublabel?: string;
  frame: number; appearFrame: number; isDestination?: boolean;
}) {
  const localFrame = frame - appearFrame;
  if (localFrame < 0) return null;

  const sc = spring({ frame: localFrame, fps: 30, config: { damping: 12, stiffness: 200 } });
  const pulseOpacity = interpolate(
    (localFrame % 40) / 40,
    [0, 0.3, 0.6, 1],
    [0.8, 0.3, 0.6, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const r = isDestination ? 10 : 7;

  return (
    <g transform={`translate(${x}, ${y}) scale(${sc})`}>
      <circle cx={0} cy={0} r={r * 2.5} fill={C.vermillon} opacity={pulseOpacity * 0.3} />
      <circle cx={0} cy={0} r={r * 1.5} fill={C.vermillon} opacity={pulseOpacity * 0.4} />
      <circle cx={0} cy={0} r={r} fill={C.vermillon} stroke={C.ink} strokeWidth={1.5} />
      {isDestination && <circle cx={0} cy={0} r={r * 0.5} fill={C.parchment} />}
      <text
        x={0} y={-r - 6}
        textAnchor="middle"
        fontSize={isDestination ? "13" : "11"}
        fontFamily="Georgia, serif"
        fontWeight={isDestination ? "bold" : "normal"}
        fill={C.ink}
      >
        {label}
      </text>
      {sublabel && (
        <text x={0} y={r + 17} textAnchor="middle" fontSize="12" fontFamily="Georgia, serif" fill={C.ink} fontStyle="italic" fontWeight="bold">
          {sublabel}
        </text>
      )}
    </g>
  );
}

function ParcheminBorder({ w, h }: { w: number; h: number }) {
  return (
    <g>
      <rect x="0" y="0" width={w} height={h} rx="6" fill={C.parchment} />
      <rect x="0" y="0" width={w} height={h} rx="6" fill="none" stroke={C.gold} strokeWidth={3} />
      <rect x="8" y="8" width={w - 16} height={h - 16} rx="4" fill="none" stroke={C.goldDark} strokeWidth={1} />
      {([
        [18, 18],
        [w - 18, 18],
        [18, h - 18],
        [w - 18, h - 18],
      ] as [number, number][]).map(([px, py], i) => (
        <g key={i}>
          <circle cx={px} cy={py} r={7} fill={C.gold} stroke={C.goldDark} strokeWidth={1} />
          <circle cx={px} cy={py} r={3} fill={C.goldDark} />
        </g>
      ))}
    </g>
  );
}

function ParcheminMapOverlay({ frame }: { frame: number }) {
  const OVERLAY_IN = 60;
  const OVERLAY_IN_END = 100;
  // La carte reste visible pendant toute la narration hook_03 (355f)
  // Elle disparait sur les 48 dernieres frames (fin de Seg 3)
  const OVERLAY_OUT_START = TOTAL_FRAMES - 48;
  const OVERLAY_OUT_END = TOTAL_FRAMES - 5;

  const overlayOpacity = interpolate(
    frame,
    [OVERLAY_IN, OVERLAY_IN_END, OVERLAY_OUT_START, OVERLAY_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const overlayY = interpolate(
    frame,
    [OVERLAY_IN, OVERLAY_IN_END],
    [40, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (overlayOpacity < 0.01) return null;

  const W = 580;
  const H = 460;
  const ox = (1920 - W) / 2;
  const oy = (1080 - H) / 2 + 20;

  // MAP_OFFSET_Y=90, scale=0.85 : contient toutes les villes dans H=460
  // Espace disponible en Y pour les points : (H - MAP_OFFSET_Y - 30) / scale = (460-90-30)/0.85 = 400px
  const MAP_OFFSET_X = 45;
  const MAP_OFFSET_Y = 90;
  const MAP_SCALE = 0.85;

  // Coordonnees dans l'espace non-scale (converties en scale(MAP_SCALE) dans le g transform)
  // Kirgisia = droite haute, Caffa = milieu droite, Messana = gauche basse (Italie sud)
  const kirghizRX = 480;
  const kirghizRY = 140;
  const caffaRX = 395;
  const caffaRY = 165;
  const messanaRX = 265;
  const messanaRY = 350;

  // Synchronisation avec l'audio :
  // Kirgisia apparait au debut Seg 1 (frame 0 -> overlay apparait a 100)
  // Caffa apparait au debut Seg 2 (frame 286)
  // Messana apparait au debut Seg 3 (frame 663)
  const arrow1Start = OVERLAY_IN_END + 20;
  const arrow1End = SEG2_START - 10;
  const caffaAppear = SEG2_START;
  const arrow2Start = SEG2_START + 30;
  const arrow2End = SEG3_START - 20;
  const messanaAppear = SEG3_START;

  return (
    <g transform={`translate(${ox}, ${oy + overlayY})`} opacity={overlayOpacity}>
      <rect x="6" y="6" width={W} height={H} rx="6" fill="#000" opacity={0.3} />
      <ParcheminBorder w={W} h={H} />

      <text
        x={W / 2} y="42"
        textAnchor="middle"
        fontSize="15"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fill={C.ink}
        letterSpacing="3"
      >
        VIA PESTIS
      </text>
      <text
        x={W / 2} y="60"
        textAnchor="middle"
        fontSize="10"
        fontFamily="Georgia, serif"
        fill={C.inkLight}
        letterSpacing="2"
        fontStyle="italic"
      >
        {"La Route de la Mort \u00B7 Anno Domini MCCCXLVII"}
      </text>
      <line x1="25" y1="70" x2={W - 25} y2="70" stroke={C.gold} strokeWidth={1} />
      <circle cx={W / 2} cy={70} r={4} fill={C.gold} />

      {/* ClipPath pour contenir la carte strictement dans le parchemin */}
      <defs>
        <clipPath id="mapClip">
          <rect x="-10" y="-10" width={Math.floor((W - MAP_OFFSET_X * 2 + 10) / MAP_SCALE)} height={Math.floor((H - MAP_OFFSET_Y - 30) / MAP_SCALE)} rx="4" />
        </clipPath>
      </defs>

      <g transform={`translate(${MAP_OFFSET_X}, ${MAP_OFFSET_Y}) scale(${MAP_SCALE})`} clipPath="url(#mapClip)">
        <rect x="-10" y="-10" width="530" height="410" rx="4" fill={C.seaMap} opacity={0.4} />
        <EuropeContour />

        <text x="475" y="160" fontSize="8" fontFamily="Georgia, serif" fill={C.inkLight} fontStyle="italic">
          Orient
        </text>
        <line x1="465" y1="165" x2="450" y2="185" stroke={C.inkLight} strokeWidth={0.8} strokeDasharray="2,2" />

        <PropagationArrow
          x1={kirghizRX} y1={kirghizRY}
          x2={caffaRX} y2={caffaRY}
          frame={frame} startFrame={arrow1Start} endFrame={arrow1End}
        />
        <PropagationArrow
          x1={caffaRX} y1={caffaRY}
          x2={messanaRX} y2={messanaRY}
          frame={frame} startFrame={arrow2Start} endFrame={arrow2End}
        />

        <PropagationPoint
          x={kirghizRX} y={kirghizRY}
          label="Kirgisia" sublabel="1338"
          frame={frame} appearFrame={OVERLAY_IN_END}
        />
        <PropagationPoint
          x={caffaRX} y={caffaRY}
          label="Caffa" sublabel="1346"
          frame={frame} appearFrame={caffaAppear}
        />
        <PropagationPoint
          x={messanaRX} y={messanaRY}
          label="Messana" sublabel="Oct. 1347"
          frame={frame} appearFrame={messanaAppear}
          isDestination={true}
        />

        {/* Trebuchet a Caffa pendant Seg 2 (coherence SFX catapulte) */}
        {frame >= SEG2_START + 20 && frame < SEG3_START + 60 && (() => {
          const catOpacity = interpolate(
            frame,
            [SEG2_START + 20, SEG2_START + 50],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          // Position a gauche de Caffa pour ne pas couvrir le label
          const tx = caffaRX - 35;
          const ty = caffaRY - 5;
          return (
            <g opacity={catOpacity}>
              {/* Base / chassis du trebuchet */}
              <line x1={tx - 14} y1={ty + 12} x2={tx + 14} y2={ty + 12} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
              {/* Roues */}
              <circle cx={tx - 10} cy={ty + 14} r={3.5} fill="none" stroke={C.ink} strokeWidth={1.5} />
              <circle cx={tx + 10} cy={ty + 14} r={3.5} fill="none" stroke={C.ink} strokeWidth={1.5} />
              {/* Axe central vertical */}
              <line x1={tx} y1={ty + 12} x2={tx} y2={ty + 4} stroke={C.ink} strokeWidth={2} />
              {/* Bras long (pointe vers haut-gauche) */}
              <line x1={tx} y1={ty + 4} x2={tx - 22} y2={ty - 14} stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
              {/* Bras court + contrepoids (pointe vers bas-droite) */}
              <line x1={tx} y1={ty + 4} x2={tx + 12} y2={ty + 10} stroke={C.ink} strokeWidth={2} strokeLinecap="round" />
              <rect x={tx + 9} y={ty + 8} width={7} height={6} rx={1} fill={C.inkLight} />
              {/* Fronde (corde au bout du bras long) */}
              <line x1={tx - 22} y1={ty - 14} x2={tx - 26} y2={ty - 8} stroke={C.ink} strokeWidth={1} strokeDasharray="2,1" />
              {/* Projectile lance (en haut) */}
              <circle cx={tx - 27} cy={ty - 7} r={4} fill={C.vermillon} stroke={C.ink} strokeWidth={1} />
              {/* Trajectoire pointillee vers Messana */}
              <line
                x1={tx - 27} y1={ty - 7}
                x2={messanaRX} y2={messanaRY - 12}
                stroke={C.vermillon} strokeWidth={1}
                strokeDasharray="5,4"
                opacity={0.45}
              />
            </g>
          );
        })()}
      </g>

    </g>
  );
}

// ============================================================
// ASSOMBRISSEMENT SEG 3 (les sous-titres sont supprimés —
// la narration audio suffit, pas de redondance texte/voix)
// ============================================================

function DarkenOverlay({ frame }: { frame: number }) {
  const darken = interpolate(
    frame,
    [SEG3_START, SEG3_START + 90, TOTAL_FRAMES],
    [0, 0.15, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <rect width="1920" height="1080" fill="#050205" opacity={darken} />;
}

// ============================================================
// GALERES PRINCIPALES (naviguent vers la Sicile)
// ============================================================

function MainGaleres({ frame }: { frame: number }) {
  const g1x = interpolate(frame, [0, TOTAL_FRAMES], [-200, 1350], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const g2x = interpolate(frame, [0, TOTAL_FRAMES], [-700, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const houle1 = Math.sin(frame * 0.08) * 15;
  const houle2 = Math.sin(frame * 0.06 + 1.2) * 12;

  return (
    <>
      <Galere x={g2x} y={660 + houle2} scale={0.75} frame={frame} phase={1.8} />
      <Galere x={g1x} y={640 + houle1} scale={0.9} frame={frame} phase={0} />
    </>
  );
}

// ============================================================
// BORDURE ENLUMINURE
// ============================================================

function EnluminureBorder({ frame }: { frame: number }) {
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <g opacity={opacity}>
      <rect x="0" y="0" width="1920" height="1080" fill="none" stroke={C.gold} strokeWidth={8} opacity={0.8} />
      <text x="12" y="38" fontSize="30" fill={C.gold} fontFamily="serif">{"✦"}</text>
      <text x="1878" y="38" fontSize="30" fill={C.gold} fontFamily="serif">{"✦"}</text>
      <text x="12" y="1070" fontSize="30" fill={C.gold} fontFamily="serif">{"✦"}</text>
      <text x="1878" y="1070" fontSize="30" fill={C.gold} fontFamily="serif">{"✦"}</text>
    </g>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

// Interpolation lineaire entre deux couleurs hex (#RRGGBB)
function lerpHex(a: string, b: string, t: number): string {
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

export const HookBlocB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Supprime l'avertissement TypeScript sur fps
  void fps;

  // Ciel : bleu enluminure vif (Seg 1) -> bleu profond/crepusculaire (Seg 3)
  const skyProgress = interpolate(frame, [0, TOTAL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const skyColor = lerpHex(C.skyDay, "#1A2456", skyProgress);

  return (
    <AbsoluteFill style={{ backgroundColor: skyColor, overflow: "hidden" }}>
      {/* Audio narration - Seg 1 : Issyk-Kul */}
      <Sequence from={SEG1_START} durationInFrames={SEG2_START - SEG1_START}>
        <Audio src={staticFile("audio/peste-pixel/hook/hook_01_issyk_kul.mp3")} startFrom={0} volume={1.0} />
      </Sequence>
      {/* Audio narration - Seg 2 : Caffa/catapulte */}
      <Sequence from={SEG2_START} durationInFrames={SEG3_START - SEG2_START}>
        <Audio src={staticFile("audio/peste-pixel/hook/hook_02_catapulte.mp3")} startFrom={0} volume={1.0} />
      </Sequence>
      {/* Audio narration - Seg 3 : galeres/Messine */}
      <Sequence from={SEG3_START} durationInFrames={TOTAL_FRAMES - SEG3_START}>
        <Audio src={staticFile("audio/peste-pixel/hook/hook_03_galeres.mp3")} startFrom={0} volume={1.0} />
      </Sequence>
      {/* Luth medieval en fond (loop) */}
      <Audio src={staticFile("audio/peste-pixel/hookbloca-luth.mp3")} startFrom={0} loop volume={0.05} />
      {/* SFX galere (ambiance maritime, loop) - volume reduit */}
      <Audio src={staticFile("audio/peste-pixel/sfx/galere-creaking.mp3")} startFrom={0} loop volume={0.07} />
      {/* SFX catapulte (2s apres debut Seg 2) - volume reduit */}
      <Sequence from={SEG2_START + 60} durationInFrames={60}>
        <Audio src={staticFile("audio/peste-pixel/sfx/catapulte-impact.mp3")} startFrom={0} volume={0.15} />
      </Sequence>

      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ display: "block", position: "absolute", top: 0, left: 0 }}
      >
        {/* Ciel enluminure - shift progressif Seg1 (bleu vif) -> Seg3 (bleu profond) */}
        <rect width="1920" height="700" fill={skyColor} />

        {/* Nuages */}
        <Clouds frame={frame} />

        {/* Cote sicilienne en fond a droite (apparait en Seg 3 seulement) */}
        <SicilianCoast frame={frame} />

        {/* Mer + vagues animees */}
        <Waves frame={frame} />

        {/* Galeres naviguant vers la Sicile */}
        <MainGaleres frame={frame} />

        {/* Overlay parchemin carte (Issyk-Kul -> Caffa -> Messine) */}
        <ParcheminMapOverlay frame={frame} />

        {/* Assombrissement progressif Seg 3 (sous-titres supprimes : audio suffit) */}
        <DarkenOverlay frame={frame} />

        {/* Context overlay haut-gauche (lieu + date par segment) */}
        <ContextOverlay frame={frame} />

        {/* Bordure enluminure doree */}
        <EnluminureBorder frame={frame} />
      </svg>
    </AbsoluteFill>
  );
};
