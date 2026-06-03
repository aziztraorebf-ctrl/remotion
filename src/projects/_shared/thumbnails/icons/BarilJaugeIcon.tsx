import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// BarilJaugeIcon — Métaphore "baril rempli à X%"
// Pour sujets pétrole/ressources liquides
// ─────────────────────────────────────────────────────────────────────────────

export interface BarilJaugeIconProps {
  ratio: number;                        // % de remplissage (0-100)
  flagColors: { a: string; b: string; c: string };  // 3 couleurs drapeau pays
  starColor?: string;                   // étoile centrale (défaut a)
  showStar?: boolean;
  position?: { cx: number; cy: number };  // position dans canvas 1280x720
  size?: { w: number; h: number };
}

function starPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.4;
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    pts.push(`${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`);
  }
  return pts.join(" ");
}

const C = {
  gold:       "#c8a951",
  goldHi:     "#e8c472",
  anonGray:   "#3a4150",
  anonGrayHi: "#4a5266",
  anonGrayLo: "#1a1f28",
};

export const BarilJaugeIcon: React.FC<BarilJaugeIconProps> = ({
  ratio,
  flagColors,
  starColor,
  showStar = true,
  position = { cx: 540, cy: 360 },
  size = { w: 460, h: 460 },
}) => {
  const { cx, cy } = position;
  const { w, h } = size;
  const left = cx - w / 2;
  const right = cx + w / 2;
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  const ellipseRy = w * 0.10;

  // Niveau de remplissage horizontal
  const cutY = bottom - (h * ratio) / 100;

  // Étoile centrée sur partie remplie
  const starCx = cx;
  const starCy = (cutY + bottom) / 2;
  const starR = Math.min(w * 0.08, (bottom - cutY) * 0.4);

  const gradientId = `senFlagH-${flagColors.a.replace("#", "")}`;
  const metalId = `anonMetal-${flagColors.a.replace("#", "")}`;
  const shadowId = `dropShadow-${flagColors.a.replace("#", "")}`;
  const clipId = `barilBody-${flagColors.a.replace("#", "")}`;

  return (
    <svg
      width="100%" height="100%"
      viewBox="0 0 1280 720"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <defs>
        {/* Drapeau pays en bandes verticales (gauche-droite : a, b, c) */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"      stopColor={flagColors.a} />
          <stop offset="33%"     stopColor={flagColors.a} />
          <stop offset="33.01%"  stopColor={flagColors.b} />
          <stop offset="66%"     stopColor={flagColors.b} />
          <stop offset="66.01%"  stopColor={flagColors.c} />
          <stop offset="100%"    stopColor={flagColors.c} />
        </linearGradient>

        {/* Métal pour la partie vide */}
        <linearGradient id={metalId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={C.anonGrayHi} />
          <stop offset="50%"  stopColor={C.anonGray} />
          <stop offset="100%" stopColor={C.anonGrayLo} />
        </linearGradient>

        {/* Ombre portée */}
        <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0.7)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>

        {/* Clip du corps cylindrique */}
        <clipPath id={clipId}>
          <path d={`
            M ${left} ${top + ellipseRy}
            Q ${left} ${top - ellipseRy} ${cx} ${top - ellipseRy}
            Q ${right} ${top - ellipseRy} ${right} ${top + ellipseRy}
            L ${right} ${bottom - ellipseRy}
            Q ${right} ${bottom + ellipseRy} ${cx} ${bottom + ellipseRy}
            Q ${left} ${bottom + ellipseRy} ${left} ${bottom - ellipseRy}
            Z
          `} />
        </clipPath>
      </defs>

      {/* Ombre portée */}
      <ellipse
        cx={cx} cy={bottom + 35}
        rx={w * 0.55} ry={22}
        fill={`url(#${shadowId})`}
      />

      {/* CORPS BARIL */}
      <g clipPath={`url(#${clipId})`}>
        {/* Partie haute = vide (métal gris) */}
        <rect
          x={left - 10}
          y={top - 30}
          width={w + 20}
          height={cutY - top + 30}
          fill={`url(#${metalId})`}
        />
        {/* Partie basse = remplie (drapeau) */}
        <rect
          x={left - 10}
          y={cutY}
          width={w + 20}
          height={bottom - cutY + 30}
          fill={`url(#${gradientId})`}
        />

        {/* Étoile centrale */}
        {showStar && ratio >= 8 && (
          <polygon
            points={starPoints(starCx, starCy, starR)}
            fill={starColor ?? flagColors.a}
          />
        )}

        {/* Bandes horizontales métal */}
        {[0.15, 0.5, 0.85].map((pos, i) => (
          <line
            key={i}
            x1={left} x2={right}
            y1={top + h * pos}
            y2={top + h * pos}
            stroke="rgba(0,0,0,0.45)"
            strokeWidth={3}
          />
        ))}
      </g>

      {/* DESSUS DU BARIL */}
      <ellipse
        cx={cx} cy={top}
        rx={w / 2} ry={ellipseRy}
        fill="#1a1f28"
        stroke={C.gold}
        strokeWidth={2}
        opacity={0.95}
      />
      <ellipse
        cx={cx} cy={top}
        rx={w / 2 - 8} ry={ellipseRy - 4}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={1.5}
      />

      {/* Contours latéraux */}
      <line x1={left} x2={left} y1={top} y2={bottom}
        stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
      <line x1={right} x2={right} y1={top} y2={bottom}
        stroke="rgba(0,0,0,0.5)" strokeWidth={2} />

      {/* LIGNE DE COUPURE — niveau */}
      <line
        x1={left - 12} x2={right + 12}
        y1={cutY} y2={cutY}
        stroke={C.gold}
        strokeWidth={14}
        strokeOpacity={0.4}
        strokeLinecap="round"
      />
      <line
        x1={left - 12} x2={right + 12}
        y1={cutY} y2={cutY}
        stroke={C.goldHi}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  );
};
