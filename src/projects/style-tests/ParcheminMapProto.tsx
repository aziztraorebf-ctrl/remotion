import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

// Palette enluminure
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
  landMapDark: "#A89858",
};

// Fond : galeres en arriere-plan (version simplifiee reutilisee)
function BackgroundGaleres({ frame }: { frame: number }) {
  const g1x = interpolate(frame, [0, 150], [200, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const g2x = interpolate(frame, [0, 150], [600, 1300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const waveOffset = (frame * 1.5) % 80;

  return (
    <g>
      {/* Ciel */}
      <rect width="1920" height="620" fill={C.skyDay} />
      {/* Mer */}
      <rect x="0" y="580" width="1920" height="500" fill={C.seaDay} />
      {/* Vagues simples */}
      {[0, 1, 2, 3].map((i) => {
        const wx = ((i * 500) - waveOffset + 1920) % 2400 - 200;
        return (
          <path
            key={i}
            d={`M ${wx} 660 Q ${wx + 125} 640 ${wx + 250} 660 Q ${wx + 375} 680 ${wx + 500} 660`}
            fill="none"
            stroke="#4A80B0"
            strokeWidth={4}
            opacity={0.5}
          />
        );
      })}
      {/* Galere 1 */}
      <g transform={`translate(${g1x}, 640) scale(0.7)`}>
        <path d="M -120 0 Q -140 35 -100 50 L 100 50 Q 140 35 120 0 Z" fill="#6B3010" stroke="#3D1A05" strokeWidth={2} />
        <rect x="-110" y="-6" width="220" height="10" fill="#6B3010" stroke="#3D1A05" strokeWidth={1} />
        <line x1="0" y1="-6" x2="0" y2="-160" stroke="#3D1A05" strokeWidth={3} />
        <path d="M 0 -150 Q 45 -105 40 -50 L -40 -50 Q -45 -105 0 -150 Z" fill={C.parchment} stroke="#3D1A05" strokeWidth={1} />
      </g>
      {/* Galere 2 */}
      <g transform={`translate(${g2x}, 655) scale(0.55)`}>
        <path d="M -120 0 Q -140 35 -100 50 L 100 50 Q 140 35 120 0 Z" fill="#6B3010" stroke="#3D1A05" strokeWidth={2} />
        <line x1="0" y1="-6" x2="0" y2="-160" stroke="#3D1A05" strokeWidth={3} />
        <path d="M 0 -150 Q 45 -105 40 -50 L -40 -50 Q -45 -105 0 -150 Z" fill={C.parchment} stroke="#3D1A05" strokeWidth={1} />
      </g>
      {/* Voile d'assombrissement sur le fond */}
      <rect width="1920" height="1080" fill="#050202" opacity={0.55} />
    </g>
  );
}

// Contour simplifie de l'Europe (SVG path approximatif mais lisible)
function EuropeContour() {
  // Contour tres simplifie, centre sur 0,0 dans un espace 500x400
  // Points cles : Iberie, France, Angleterre, Scandinavie, Balkans, Anatolie
  return (
    <g>
      {/* Masse continentale principale */}
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
      {/* Peninsule iberique */}
      <path
        d="M 60 320 Q 30 340 20 370 Q 10 400 40 420 Q 70 440 100 430 Q 130 450 150 435 Q 170 420 160 390 Q 170 360 150 340 Q 130 320 110 330 Q 90 340 60 320 Z"
        fill={C.landMap}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      {/* Italie */}
      <path
        d="M 290 310 Q 300 330 295 360 Q 290 390 280 410 Q 275 430 285 445 Q 295 455 305 445 Q 315 430 320 400 Q 330 370 325 340 Q 315 315 290 310 Z"
        fill={C.landMap}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      {/* Sicile (Messana) */}
      <ellipse cx="295" cy="462" rx="18" ry="10" fill={C.landMap} stroke={C.ink} strokeWidth={1} />
      {/* Angleterre */}
      <path
        d="M 120 80 Q 100 60 110 40 Q 130 20 150 30 Q 170 20 175 50 Q 180 80 160 95 Q 140 100 120 80 Z"
        fill={C.landMap}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      {/* Scandinavie */}
      <path
        d="M 270 25 Q 285 5 300 0 Q 330 -10 345 15 Q 355 40 340 65 Q 355 80 345 100 Q 330 110 315 90 Q 300 110 285 95 Q 270 75 285 55 Q 270 40 270 25 Z"
        fill={C.landMap}
        stroke={C.ink}
        strokeWidth={1.5}
      />
      {/* Mer Mediterranee (zone bleue) */}
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

// Ornements de bordure du parchemin
function ParcheminBorder({ w, h }: { w: number; h: number }) {
  return (
    <g>
      {/* Cadre principal double */}
      <rect x="0" y="0" width={w} height={h} rx="6" fill={C.parchment} />
      <rect x="0" y="0" width={w} height={h} rx="6" fill="none" stroke={C.gold} strokeWidth={3} />
      <rect x="8" y="8" width={w - 16} height={h - 16} rx="4" fill="none" stroke={C.goldDark} strokeWidth={1} />
      {/* Coins ornementes */}
      {[
        [18, 18],
        [w - 18, 18],
        [18, h - 18],
        [w - 18, h - 18],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={7} fill={C.gold} stroke={C.goldDark} strokeWidth={1} />
          <circle cx={cx} cy={cy} r={3} fill={C.goldDark} />
        </g>
      ))}
      {/* Motif entrelace sur les bords */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={80 + i * 75}
          y={4}
          width={40}
          height={8}
          rx={4}
          fill={C.gold}
          opacity={0.4}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={80 + i * 75}
          y={h - 12}
          width={40}
          height={8}
          rx={4}
          fill={C.gold}
          opacity={0.4}
        />
      ))}
    </g>
  );
}

// Point de propagation anime avec halo
function PropagationPoint({
  x,
  y,
  label,
  sublabel,
  frame,
  appearFrame,
  color = C.vermillon,
  isDestination = false,
}: {
  x: number;
  y: number;
  label: string;
  sublabel?: string;
  frame: number;
  appearFrame: number;
  color?: string;
  isDestination?: boolean;
}) {
  const localFrame = frame - appearFrame;
  if (localFrame < 0) return null;

  const scale = spring({ frame: localFrame, fps: 30, config: { damping: 12, stiffness: 200 } });
  const pulseOpacity = interpolate(
    (localFrame % 40) / 40,
    [0, 0.3, 0.6, 1],
    [0.8, 0.3, 0.6, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const r = isDestination ? 10 : 7;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Halo pulsant */}
      <circle cx={0} cy={0} r={r * 2.5} fill={color} opacity={pulseOpacity * 0.3} />
      <circle cx={0} cy={0} r={r * 1.5} fill={color} opacity={pulseOpacity * 0.4} />
      {/* Point central */}
      <circle cx={0} cy={0} r={r} fill={color} stroke={C.ink} strokeWidth={1.5} />
      {isDestination && (
        <circle cx={0} cy={0} r={r * 0.5} fill={C.parchment} />
      )}
      {/* Etiquette */}
      <text
        x={0}
        y={-r - 6}
        textAnchor="middle"
        fontSize={isDestination ? "13" : "11"}
        fontFamily="Georgia, serif"
        fontWeight={isDestination ? "bold" : "normal"}
        fill={C.ink}
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={0}
          y={r + 16}
          textAnchor="middle"
          fontSize="9"
          fontFamily="Georgia, serif"
          fill={C.inkLight}
          fontStyle="italic"
        >
          {sublabel}
        </text>
      )}
    </g>
  );
}

// Fleche de propagation animee (trait qui se trace progressivement)
function PropagationArrow({
  x1, y1, x2, y2,
  frame,
  startFrame,
  endFrame,
  color = C.vermillon,
}: {
  x1: number; y1: number; x2: number; y2: number;
  frame: number; startFrame: number; endFrame: number;
  color?: string;
}) {
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cx = x1 + (x2 - x1) * progress;
  const cy = y1 + (y2 - y1) * progress;

  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const totalLen = len;
  const drawnLen = totalLen * progress;

  // On trace un chemin partiel via stroke-dasharray
  return (
    <g>
      <line
        x1={x1} y1={y1}
        x2={x2} y2={y2}
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray={`${drawnLen} ${totalLen}`}
        strokeLinecap="round"
        opacity={0.8}
      />
      {/* Tete de fleche au point actuel */}
      {progress > 0.05 && (
        <circle cx={cx} cy={cy} r={3} fill={color} opacity={0.9} />
      )}
    </g>
  );
}

// Titre du parchemin avec lettrine
function ParcheminTitle({ w }: { w: number }) {
  return (
    <g>
      {/* Lettrine V */}
      <text
        x="32"
        y="68"
        fontSize="40"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fill={C.vermillon}
        stroke={C.gold}
        strokeWidth={0.5}
      >
        V
      </text>
      {/* Titre */}
      <text
        x={w / 2}
        y="48"
        textAnchor="middle"
        fontSize="16"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fill={C.ink}
        letterSpacing="3"
      >
        IA PESTIS
      </text>
      <text
        x={w / 2}
        y="66"
        textAnchor="middle"
        fontSize="11"
        fontFamily="Georgia, serif"
        fill={C.inkLight}
        letterSpacing="2"
        fontStyle="italic"
      >
        La Route de la Mort · Anno Domini MCCCXLVII
      </text>
      {/* Separateur orne */}
      <line x1="30" y1="76" x2={w - 30} y2="76" stroke={C.gold} strokeWidth={1} />
      <circle cx={w / 2} cy={76} r={4} fill={C.gold} />
    </g>
  );
}

// Legende en bas du parchemin
function ParcheminLegend({ w, h, frame, overlayFrame }: { w: number; h: number; frame: number; overlayFrame: number }) {
  const localFrame = frame - overlayFrame - 20;
  const opacity = interpolate(localFrame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g opacity={opacity}>
      <line x1="30" y1={h - 50} x2={w - 30} y2={h - 50} stroke={C.gold} strokeWidth={0.8} opacity={0.6} />
      <circle cx={50} cy={h - 30} r={6} fill={C.vermillon} stroke={C.ink} strokeWidth={1} />
      <text x="62" y={h - 25} fontSize="10" fontFamily="Georgia, serif" fill={C.ink}>
        Foyer de la Pestilence
      </text>
      <circle cx={180} cy={h - 30} r={9} fill={C.vermillon} stroke={C.ink} strokeWidth={1} />
      <circle cx={180} cy={h - 30} r={4} fill={C.parchment} />
      <text x="195" y={h - 25} fontSize="10" fontFamily="Georgia, serif" fill={C.ink}>
        Arrivée de la Pestilence
      </text>
    </g>
  );
}

export const ParcheminMapProto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing du parchemin
  // [0-15]   : fond galeres visible
  // [15-35]  : parchemin entre (slide + fade)
  // [35-115] : carte se dessine (Kirghizstan -> Caffa -> Messana)
  // [115-130]: lecture
  // [130-150]: parchemin sort

  const OVERLAY_IN_START = 15;
  const OVERLAY_IN_END = 35;
  const OVERLAY_OUT_START = 130;
  const OVERLAY_OUT_END = 150;

  const overlayScale = spring({
    frame: frame - OVERLAY_IN_START,
    fps,
    config: { damping: 18, stiffness: 150 },
  });
  const overlayOpacity = interpolate(
    frame,
    [OVERLAY_IN_START, OVERLAY_IN_END, OVERLAY_OUT_START, OVERLAY_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const overlayY = interpolate(
    frame,
    [OVERLAY_IN_START, OVERLAY_IN_END, OVERLAY_OUT_START, OVERLAY_OUT_END],
    [60, 0, 0, -60],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const W = 620;
  const H = 490;
  const cx = (1920 - W) / 2;
  const cy = (1080 - H) / 2;

  // Coordonnees des villes sur la carte (dans l'espace 500x400 du contour)
  // Offset pour centrer dans le parchemin : x+50, y+90
  const MAP_OFFSET_X = 50;
  const MAP_OFFSET_Y = 90;

  // Kirghizistan : hors carte Europe, on le place a droite
  const kirghizX = MAP_OFFSET_X + 520;
  const kirghizY = MAP_OFFSET_Y + 180;
  // Caffa (Crimee) : cote nord-est
  const caffaX = MAP_OFFSET_X + 410;
  const caffaY = MAP_OFFSET_Y + 200;
  // Messana (Sicile)
  const messanaX = MAP_OFFSET_X + 295;
  const messanaY = MAP_OFFSET_Y + 462;

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ display: "block" }}>
        {/* Fond : galeres */}
        <BackgroundGaleres frame={frame} />

        {/* Parchemin overlay */}
        <g
          transform={`translate(${cx}, ${cy + overlayY})`}
          opacity={overlayOpacity}
          style={{ transformOrigin: `${W / 2}px ${H / 2}px` }}
        >
          {/* Ombre portee */}
          <rect
            x="6"
            y="6"
            width={W}
            height={H}
            rx="6"
            fill="#000"
            opacity={0.35}
          />
          {/* Bordure + fond parchemin */}
          <ParcheminBorder w={W} h={H} />

          {/* Titre */}
          <ParcheminTitle w={W} />

          {/* Carte Europe */}
          <g transform={`translate(${MAP_OFFSET_X}, ${MAP_OFFSET_Y}) scale(0.92)`}>
            {/* Fond mer */}
            <rect x="-10" y="-10" width="530" height="430" rx="4" fill={C.seaMap} opacity={0.4} />
            <EuropeContour />

            {/* Zone orientale (Asie) indication */}
            <text x="480" y="170" fontSize="8" fontFamily="Georgia, serif" fill={C.inkLight} fontStyle="italic">
              Orient
            </text>
            <line x1="470" y1="175" x2="460" y2="200" stroke={C.inkLight} strokeWidth={0.8} strokeDasharray="2,2" />

            {/* Fleche Kirghizistan -> Caffa */}
            <PropagationArrow
              x1={kirghizX - MAP_OFFSET_X}
              y1={kirghizY - MAP_OFFSET_Y}
              x2={caffaX - MAP_OFFSET_X}
              y2={caffaY - MAP_OFFSET_Y}
              frame={frame}
              startFrame={40}
              endFrame={70}
            />

            {/* Fleche Caffa -> Messana */}
            <PropagationArrow
              x1={caffaX - MAP_OFFSET_X}
              y1={caffaY - MAP_OFFSET_Y}
              x2={messanaX - MAP_OFFSET_X}
              y2={messanaY - MAP_OFFSET_Y}
              frame={frame}
              startFrame={75}
              endFrame={110}
            />

            {/* Points de propagation */}
            <PropagationPoint
              x={kirghizX - MAP_OFFSET_X}
              y={kirghizY - MAP_OFFSET_Y}
              label="Kirgisia"
              sublabel="1338"
              frame={frame}
              appearFrame={35}
              color={C.vermillon}
            />
            <PropagationPoint
              x={caffaX - MAP_OFFSET_X}
              y={caffaY - MAP_OFFSET_Y}
              label="Caffa"
              sublabel="1346"
              frame={frame}
              appearFrame={70}
              color={C.vermillon}
            />
            <PropagationPoint
              x={messanaX - MAP_OFFSET_X}
              y={messanaY - MAP_OFFSET_Y}
              label="Messana"
              sublabel="Oct. 1347"
              frame={frame}
              appearFrame={110}
              color={C.vermillon}
              isDestination={true}
            />
          </g>

          {/* Legende */}
          <ParcheminLegend w={W} h={H} frame={frame} overlayFrame={OVERLAY_IN_START} />
        </g>

        {/* Texte narratif en bas (hors parchemin) */}
        <g opacity={interpolate(frame, [35, 55, 120, 135], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <text
            x="960"
            y="990"
            textAnchor="middle"
            fontSize="22"
            fontFamily="Georgia, serif"
            fill={C.parchment}
            fontStyle="italic"
          >
            En deux ans, la moitié de l'Europe allait disparaître.
          </text>
        </g>
      </svg>
    </div>
  );
};
