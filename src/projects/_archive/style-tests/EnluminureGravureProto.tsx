import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

// Palette enluminure
const C = {
  skyDay: "#2D3A8C",
  skyStorm: "#6B7280",
  gold: "#C9A227",
  parchment: "#F5E6C8",
  vermillon: "#C1392B",
  ink: "#1A1008",
  seaDay: "#1B4F8C",
  seaStorm: "#3D4B5C",
  foamDay: "#A8C8E8",
  foamStorm: "#8A9BA8",
  hullDay: "#8B4513",
  hullInk: "#2A1A08",
  sailDay: "#F5E6C8",
  sailInk: "#E8D5A0",
};

function lerpColor(a: string, b: string, t: number): string {
  const hex = (s: string) => [
    parseInt(s.slice(1, 3), 16),
    parseInt(s.slice(3, 5), 16),
    parseInt(s.slice(5, 7), 16),
  ];
  const ca = hex(a);
  const cb = hex(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

// Galere medievale en SVG
function Galere({
  x,
  y,
  scale = 1,
  saturation,
}: {
  x: number;
  y: number;
  scale?: number;
  saturation: number;
}) {
  const hull = lerpColor(C.hullDay, C.hullInk, 1 - saturation);
  const sail = lerpColor(C.sailDay, C.sailInk, 1 - saturation);
  const stroke = lerpColor("#5C2A0A", C.ink, 1 - saturation);
  const ropeColor = lerpColor("#8B6B3D", C.ink, 1 - saturation);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Coque */}
      <path
        d="M -160 0 Q -180 40 -140 60 L 140 60 Q 180 40 160 0 Z"
        fill={hull}
        stroke={stroke}
        strokeWidth={2 / scale}
      />
      {/* Pont */}
      <rect x="-150" y="-8" width="300" height="12" fill={hull} stroke={stroke} strokeWidth={1.5 / scale} />
      {/* Mat central */}
      <line x1="0" y1="-8" x2="0" y2="-220" stroke={stroke} strokeWidth={4 / scale} />
      {/* Voile principale */}
      <path
        d="M 0 -200 Q 60 -140 50 -60 L -50 -60 Q -60 -140 0 -200 Z"
        fill={sail}
        stroke={stroke}
        strokeWidth={1.5 / scale}
      />
      {/* Croix sur la voile (medievale) */}
      <line x1="0" y1="-190" x2="0" y2="-70" stroke={stroke} strokeWidth={2 / scale} />
      <line x1="-40" y1="-145" x2="40" y2="-145" stroke={stroke} strokeWidth={2 / scale} />
      {/* Voile avant */}
      <line x1="0" y1="-180" x2="-100" y2="-100" stroke={stroke} strokeWidth={2.5 / scale} />
      <path
        d="M -100 -100 Q -70 -110 0 -180 Q -30 -100 -80 -85 Z"
        fill={sail}
        stroke={stroke}
        strokeWidth={1 / scale}
        opacity={0.9}
      />
      {/* Rames (3 de chaque cote) */}
      {[-80, 0, 80].map((rx, i) => (
        <g key={i}>
          <line
            x1={rx}
            y1="40"
            x2={rx - 20}
            y2="90"
            stroke={ropeColor}
            strokeWidth={3 / scale}
          />
          <line
            x1={rx}
            y1="40"
            x2={rx + 20}
            y2="90"
            stroke={ropeColor}
            strokeWidth={3 / scale}
          />
        </g>
      ))}
      {/* Banniere */}
      <line x1="0" y1="-220" x2="0" y2="-200" stroke={stroke} strokeWidth={2 / scale} />
      <path d="M 0 -220 L 30 -210 L 0 -200 Z" fill={C.vermillon} opacity={saturation * 0.8 + 0.2} />
    </g>
  );
}

// Vagues
function Waves({ frame, saturation }: { frame: number; saturation: number }) {
  const seaColor = lerpColor(C.seaDay, C.seaStorm, 1 - saturation);
  const foamColor = lerpColor(C.foamDay, C.foamStorm, 1 - saturation);
  const offset = (frame * 1.5) % 80;

  return (
    <g>
      {/* Mer de base */}
      <rect x="0" y="580" width="1920" height="500" fill={seaColor} />
      {/* Vagues fond */}
      {[0, 1, 2, 3, 4].map((i) => {
        const wx = ((i * 400) - offset * 2 + 1920) % 2200 - 200;
        return (
          <path
            key={i}
            d={`M ${wx} 600 Q ${wx + 100} 575 ${wx + 200} 600 Q ${wx + 300} 625 ${wx + 400} 600`}
            fill="none"
            stroke={foamColor}
            strokeWidth={3}
            opacity={0.5}
          />
        );
      })}
      {/* Vagues avant-plan */}
      {[0, 1, 2, 3].map((i) => {
        const wx = ((i * 500) - offset + 1920) % 2400 - 200;
        return (
          <path
            key={i}
            d={`M ${wx} 680 Q ${wx + 125} 655 ${wx + 250} 680 Q ${wx + 375} 705 ${wx + 500} 680`}
            fill="none"
            stroke={foamColor}
            strokeWidth={5}
            opacity={0.7}
          />
        );
      })}
    </g>
  );
}

// Cote sicilienne en fond
function SicilianCoast({ saturation }: { saturation: number }) {
  const landColor = lerpColor("#8B9B5A", "#6B7060", 1 - saturation);
  const stroke = lerpColor("#5C6A2A", C.ink, 1 - saturation);
  return (
    <g>
      <path
        d="M 1400 400 Q 1500 350 1600 380 Q 1700 360 1800 390 Q 1900 370 1920 380 L 1920 600 L 1400 600 Z"
        fill={landColor}
        stroke={stroke}
        strokeWidth={2}
      />
      {/* Petite tour/eglise */}
      <rect x="1650" y="320" width="30" height="70" fill={lerpColor("#D4C59A", "#B0A880", 1 - saturation)} stroke={stroke} strokeWidth={1.5} />
      <polygon points="1650,320 1680,320 1665,295" fill={lerpColor(C.vermillon, "#4A3020", 1 - saturation)} />
    </g>
  );
}

// Nuages
function Clouds({ frame, saturation }: { frame: number; saturation: number }) {
  const cloudColor = lerpColor("#E8EFF8", "#9AA0A8", 1 - saturation);
  const offset = frame * 0.3;

  return (
    <g opacity={0.6 + (1 - saturation) * 0.3}>
      {[
        { x: 200, y: 120, r: 60 },
        { x: 320, y: 100, r: 80 },
        { x: 440, y: 115, r: 55 },
        { x: 900, y: 140, r: 70 },
        { x: 1020, y: 120, r: 90 },
        { x: 1150, y: 135, r: 60 },
      ].map((c, i) => (
        <ellipse
          key={i}
          cx={((c.x - offset * (i % 2 === 0 ? 1 : 0.7)) % 2100 + 2100) % 2100}
          cy={c.y}
          rx={c.r}
          ry={c.r * 0.55}
          fill={cloudColor}
        />
      ))}
    </g>
  );
}

// Data Overlay : compteur + barre de progression
function DataOverlay({
  frame,
  saturation,
}: {
  frame: number;
  saturation: number;
}) {
  // Apparait a partir du frame 20
  const opacity = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Barre de progression : 0 -> 50% entre frames 30 et 150
  const progress = interpolate(frame, [30, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const percentage = Math.round(progress * 50);

  const textColor = saturation > 0.5 ? C.gold : C.ink;
  const barFill = saturation > 0.5 ? C.vermillon : C.ink;
  const bgColor = saturation > 0.5 ? "rgba(0,0,0,0.5)" : "rgba(245,230,200,0.85)";
  const borderColor = saturation > 0.5 ? C.gold : C.ink;

  return (
    <g opacity={opacity}>
      {/* Cadre parchemin en haut-gauche */}
      <rect
        x="60"
        y="55"
        width="280"
        height="100"
        rx="4"
        fill={bgColor}
        stroke={borderColor}
        strokeWidth={saturation > 0.5 ? 1.5 : 2}
      />
      {/* Ornement coin (style enluminure) */}
      {saturation > 0.3 && (
        <>
          <text x="68" y="78" fontSize="11" fill={C.gold} fontFamily="serif">✦</text>
          <text x="322" y="78" fontSize="11" fill={C.gold} fontFamily="serif">✦</text>
        </>
      )}
      {/* Titre */}
      <text
        x="200"
        y="82"
        textAnchor="middle"
        fontSize="13"
        fontFamily="Georgia, serif"
        fill={textColor}
        letterSpacing="1.5"
        fontStyle="italic"
      >
        Europe, 1347-1351
      </text>
      {/* Compteur */}
      <text
        x="200"
        y="120"
        textAnchor="middle"
        fontSize="28"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fill={textColor}
      >
        {percentage}% de l'Europe
      </text>
      {/* Sous-titre */}
      <text
        x="200"
        y="140"
        textAnchor="middle"
        fontSize="11"
        fontFamily="Georgia, serif"
        fill={textColor}
        opacity={0.8}
      >
        de la population disparait
      </text>
      {/* Barre de progression */}
      <rect x="80" y="148" width="240" height="6" rx="3" fill="rgba(0,0,0,0.2)" />
      <rect
        x="80"
        y="148"
        width={240 * progress}
        height="6"
        rx="3"
        fill={barFill}
      />
    </g>
  );
}

// Hachures de gravure (pattern)
function HatchureFilter() {
  return (
    <defs>
      <filter id="desaturate">
        <feColorMatrix type="saturate" values="1" />
      </filter>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke={C.ink} strokeWidth="0.8" opacity="0.15" />
      </pattern>
    </defs>
  );
}

export const EnluminureGravureProto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Transition : enluminure [0,60] -> transition [60,120] -> gravure [120,180]
  const saturation = interpolate(frame, [60, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Mouvement des galeres
  const galere1X = interpolate(frame, [0, 180], [-200, 1400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const galere2X = interpolate(frame, [0, 180], [-600, 1000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ciel : interpolation de couleur
  const skyColor = lerpColor(C.skyDay, "#3A3F50", 1 - saturation);

  // Assombrissement progressif (ambiance de mort)
  const darknessOverlay = interpolate(frame, [60, 150], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Texte narratif
  const textOpacity1 = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textOpacity2 = interpolate(frame, [70, 90, 170, 180], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const textColor1 = lerpColor("#F5E6C8", "#F0E8D0", 1 - saturation);

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", backgroundColor: skyColor }}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ display: "block" }}
      >
        <HatchureFilter />

        {/* Ciel */}
        <rect width="1920" height="700" fill={skyColor} />

        {/* Etoiles (apparaissent avec la gravure) */}
        {saturation < 0.7 &&
          [[200, 80], [450, 60], [700, 90], [1100, 70], [1400, 85], [1700, 65], [350, 140], [950, 50]].map(([sx, sy], i) => (
            <circle
              key={i}
              cx={sx}
              cy={sy}
              r={1.5}
              fill="#F0E8D0"
              opacity={(1 - saturation) * 0.8}
            />
          ))
        }

        {/* Nuages */}
        <Clouds frame={frame} saturation={saturation} />

        {/* Cote sicilienne */}
        <SicilianCoast saturation={saturation} />

        {/* Mer + vagues */}
        <Waves frame={frame} saturation={saturation} />

        {/* Galeres */}
        <Galere x={galere2X} y={660} scale={0.75} saturation={saturation} />
        <Galere x={galere1X} y={640} scale={0.9} saturation={saturation} />

        {/* Hachures de gravure sur tout l'ecran (apparaissent avec transition) */}
        {saturation < 0.5 && (
          <rect
            width="1920"
            height="1080"
            fill="url(#hatch)"
            opacity={(1 - saturation) * 0.6}
          />
        )}

        {/* Voile d'assombrissement */}
        <rect
          width="1920"
          height="1080"
          fill="#0A0505"
          opacity={darknessOverlay}
        />

        {/* Texte narratif haut */}
        <g opacity={textOpacity1}>
          <text
            x="960"
            y="55"
            textAnchor="middle"
            fontSize="20"
            fontFamily="Georgia, serif"
            fill={textColor1}
            letterSpacing="4"
            fontStyle="italic"
          >
            Messine, Sicile — Octobre 1347
          </text>
        </g>

        {/* Texte narratif principal (pendant la transition) */}
        <g opacity={textOpacity2}>
          <text
            x="960"
            y="980"
            textAnchor="middle"
            fontSize="26"
            fontFamily="Georgia, serif"
            fill={textColor1}
            fontStyle="italic"
          >
            "Les marins étaient déjà morts ou mourants..."
          </text>
        </g>

        {/* Bordure enluminure (frame doree) */}
        <rect
          x="0"
          y="0"
          width="1920"
          height="1080"
          fill="none"
          stroke={lerpColor(C.gold, C.ink, 1 - saturation)}
          strokeWidth={saturation > 0.3 ? 8 : 4}
          opacity={saturation * 0.8 + 0.2}
        />
        {/* Coins ornementes */}
        {saturation > 0.2 && (
          <>
            <text x="12" y="38" fontSize="30" fill={lerpColor(C.gold, C.ink, 1 - saturation)} fontFamily="serif" opacity={saturation}>✦</text>
            <text x="1878" y="38" fontSize="30" fill={lerpColor(C.gold, C.ink, 1 - saturation)} fontFamily="serif" opacity={saturation}>✦</text>
            <text x="12" y="1070" fontSize="30" fill={lerpColor(C.gold, C.ink, 1 - saturation)} fontFamily="serif" opacity={saturation}>✦</text>
            <text x="1878" y="1070" fontSize="30" fill={lerpColor(C.gold, C.ink, 1 - saturation)} fontFamily="serif" opacity={saturation}>✦</text>
          </>
        )}

        {/* Data overlay */}
        <DataOverlay frame={frame} saturation={saturation} />
      </svg>
    </div>
  );
};
