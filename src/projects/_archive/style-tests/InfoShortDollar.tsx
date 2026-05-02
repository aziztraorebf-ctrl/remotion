import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// ============================================================
// INFO SHORT DOLLAR — Infographie pure, 60s, 1080x1920
//
// Sujet : "Pourquoi le dollar perd son pouvoir depuis 50 ans"
// Pas de carte — infographie SVG + data visualisation
//
// 0-60f    (2s)  Hook titre — comparaison choc 100$ 1971/2026
// 60-360f  (10s) Timeline animee 1971->2026 (fin Gold Standard, crises)
// 360-660f (10s) Courbe pouvoir d'achat qui descend (SVG path anime)
// 660-900f (8s)  Blocs comparatifs panier 1971 vs 2026
// 900-1200f(10s) Stats live — inflation, salaire, immobilier
// 1200-1500f(10s)Ce que ca veut dire pour toi
// 1500-1800f(10s)Outro
// ============================================================

const W = 1080;
const H = 1920;

const C = {
  bg:       "#0d0d1a",
  bgLight:  "#f5f2ec",
  gold:     "#f0b000",
  red:      "#e03030",
  green:    "#28a060",
  blue:     "#4080e0",
  white:    "#ffffff",
  grey:     "#aaaaaa",
  darkCard: "rgba(13,13,26,0.93)",
  lineOld:  "#28a060",
  lineNew:  "#e03030",
} as const;

// ============================================================
// HELPERS
// ============================================================

// Interpolation clamped
function ci(frame: number, [f0, f1]: [number,number], [v0, v1]: [number,number]): number {
  return interpolate(frame, [f0, f1], [v0, v1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

// Genere un path SVG pour une courbe de donnees
// points = [[x,y], ...] — coordonnees dans le repere SVG
function linePath(points: [number, number][], progress: number): string {
  if (points.length < 2) return "";
  const count = Math.max(2, Math.floor(points.length * progress));
  const pts = points.slice(0, count);
  return pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
}

// ============================================================
// DONNEES HISTORIQUES (valeurs normalisees)
// ============================================================

// Pouvoir d'achat de 100$ — index 1971 = 100
// Source : Bureau of Labor Statistics CPI-U
const PURCHASING_POWER: [number, number][] = [
  [1971, 100], [1973, 88], [1975, 72], [1980, 50],
  [1985, 41], [1990, 35], [1995, 30], [2000, 27],
  [2005, 24], [2010, 21], [2015, 18], [2020, 16],
  [2024, 13],
];

// Evenements cles timeline
const EVENTS = [
  { year: 1971, label: "Nixon: fin du Gold Standard",    color: C.red   },
  { year: 1973, label: "Choc petrolier x4",              color: C.red   },
  { year: 1980, label: "Inflation 13.5%",                color: C.red   },
  { year: 2008, label: "Crise financiere — QE massif",   color: C.red   },
  { year: 2020, label: "COVID — 40% de dollars crees",   color: C.red   },
  { year: 2022, label: "Inflation 9.1% — pic 40 ans",    color: C.red   },
];

// ============================================================
// PHASE 1 : HOOK
// ============================================================

const PhaseHook: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 160 } });
  const fadeIn  = ci(frame, [0, 15],  [0, 1]);
  const fadeOut = ci(frame, [45, 60], [1, 0]);

  const card1S = spring({ frame,          fps, config: { damping: 20, stiffness: 200 } });
  const card2S = spring({ frame: frame - 20, fps, config: { damping: 20, stiffness: 200 } });

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeIn * fadeOut }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 70px",
      }}>
        {/* Titre */}
        <div style={{
          fontSize: 56, fontWeight: 900, color: C.white,
          fontFamily: "Arial Black, sans-serif", textAlign: "center",
          lineHeight: 1.1, marginBottom: 20,
          opacity: s, transform: `translateY(${interpolate(s, [0,1], [40,0])}px)`,
        }}>
          100 dollars.
        </div>
        <div style={{
          fontSize: 32, color: C.grey, fontFamily: "Arial, sans-serif",
          textAlign: "center", marginBottom: 60,
          opacity: s,
        }}>
          Meme billet. Deux epoques.
        </div>

        {/* Card 1971 */}
        <div style={{
          width: "100%", background: "rgba(40,160,96,0.12)", border: `2px solid ${C.green}`,
          borderRadius: 16, padding: "28px 36px", marginBottom: 20,
          opacity: card1S, transform: `translateX(${interpolate(card1S, [0,1], [-60,0])}px)`,
        }}>
          <div style={{ fontSize: 22, color: C.green, fontFamily: "Arial, sans-serif", marginBottom: 10 }}>
            1971
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: C.white, fontFamily: "Arial Black, sans-serif" }}>
            100$
          </div>
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.7)", fontFamily: "Arial, sans-serif", marginTop: 8 }}>
            Loyer 1 mois / Voiture neuve (fraction) / Epicerie 3 semaines
          </div>
        </div>

        {/* Card 2026 */}
        <div style={{
          width: "100%", background: "rgba(224,48,48,0.12)", border: `2px solid ${C.red}`,
          borderRadius: 16, padding: "28px 36px",
          opacity: card2S, transform: `translateX(${interpolate(card2S, [0,1], [60,0])}px)`,
        }}>
          <div style={{ fontSize: 22, color: C.red, fontFamily: "Arial, sans-serif", marginBottom: 10 }}>
            2026
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, color: C.white, fontFamily: "Arial Black, sans-serif" }}>
            100$
          </div>
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.7)", fontFamily: "Arial, sans-serif", marginTop: 8 }}>
            2 plein d'essence / 1 semaine d'epicerie / 1 nuit d'hotel basique
          </div>
        </div>

        <div style={{
          fontSize: 26, color: C.gold, fontFamily: "Arial, sans-serif",
          marginTop: 40, textAlign: "center", fontWeight: "bold",
          opacity: ci(frame, [20, 40], [0, 1]),
        }}>
          Pourquoi en 60 secondes
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 2 : TIMELINE 1971 -> 2026
// ============================================================

const PhaseTimeline: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const fadeIn  = ci(frame, [0, 25],   [0, 1]);
  const fadeOut = ci(frame, [270, 300], [1, 0]);

  // La ligne de temps progresse sur 200 frames
  const lineP = ci(frame, [20, 220], [0, 1]);

  // Annees de debut et fin
  const YEAR_START = 1971;
  const YEAR_END   = 2026;
  const TOTAL_YEARS = YEAR_END - YEAR_START;

  // Layout ligne horizontale
  const LX = 80;
  const RX = W - 80;
  const LY = H * 0.38;
  const lineW = RX - LX;

  function yearToX(year: number): number {
    return LX + ((year - YEAR_START) / TOTAL_YEARS) * lineW;
  }

  // Largeur visible de la ligne selon progress
  const visibleX = LX + lineP * lineW;

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeIn * fadeOut }}>
      {/* Titre */}
      <div style={{
        position: "absolute", top: 80, left: 60, right: 60, textAlign: "center",
        opacity: ci(frame, [0, 30], [0, 1]),
      }}>
        <div style={{
          fontSize: 40, fontWeight: 900, color: C.white,
          fontFamily: "Arial Black, sans-serif",
        }}>
          50 ans de decisions
        </div>
        <div style={{
          fontSize: 24, color: C.grey, fontFamily: "Arial, sans-serif", marginTop: 12,
        }}>
          qui ont change le pouvoir d'achat
        </div>
      </div>

      <svg width={W} height={H}>
        {/* Ligne de base */}
        <line x1={LX} y1={LY} x2={RX} y2={LY}
          stroke="rgba(255,255,255,0.15)" strokeWidth={3} />

        {/* Ligne animee */}
        <line x1={LX} y1={LY} x2={visibleX} y2={LY}
          stroke={C.gold} strokeWidth={4} strokeLinecap="round" />

        {/* Annees reperes */}
        {[1971, 1980, 1990, 2000, 2010, 2020, 2026].map((year) => {
          const x = yearToX(year);
          const visible = x <= visibleX + 2;
          return (
            <g key={year} opacity={visible ? 1 : 0}>
              <line x1={x} y1={LY - 10} x2={x} y2={LY + 10}
                stroke={C.gold} strokeWidth={2} />
              <text x={x} y={LY + 32} fontSize={18} fill={C.gold}
                textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold">
                {year}
              </text>
            </g>
          );
        })}

        {/* Evenements */}
        {EVENTS.map(({ year, label, color }, i) => {
          const x = yearToX(year);
          const visible = x <= visibleX - 10;
          const eventFrame = Math.max(0, frame - Math.round(20 + ((year - YEAR_START) / TOTAL_YEARS) * 200));
          const eS = Math.min(1, eventFrame / 8);
          const above = i % 2 === 0;
          const labelY = above ? LY - 90 - (i % 3) * 20 : LY + 70 + (i % 3) * 20;

          return (
            <g key={year} opacity={visible ? eS : 0}>
              {/* Trait vertical */}
              <line
                x1={x} y1={above ? LY - 14 : LY + 14}
                x2={x} y2={above ? labelY + 28 : labelY - 6}
                stroke={color} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6}
              />
              {/* Pastille */}
              <circle cx={x} cy={LY} r={7} fill={color} />
              {/* Label */}
              <rect
                x={x - 160} y={above ? labelY - 26 : labelY - 26}
                width={320} height={40} rx={6}
                fill="rgba(10,10,26,0.88)"
              />
              <text
                x={x} y={above ? labelY : labelY}
                fontSize={15} fill={C.white} textAnchor="middle"
                fontFamily="Arial, sans-serif" fontWeight="bold">
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 2b : VISAGES DE DECISIONS (silhouettes SVG stylisees)
// ============================================================

const PhaseDecisions: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const fadeIn  = ci(frame, [0, 25],   [0, 1]);
  const fadeOut = ci(frame, [270, 300], [1, 0]);

  // 3 decisions historiques majeures avec silhouette + micro + contexte
  const decisions = [
    {
      year: "1971",
      name: "Nixon",
      action: "Fin du Gold Standard",
      consequence: "Le dollar n'est plus adosse a l'or. L'impression commence.",
      color: C.red,
      delay: 0,
    },
    {
      year: "2008",
      name: "Bernanke (Fed)",
      action: "Quantitative Easing massif",
      consequence: "700 milliards $ injectes. La planche a billets tourne.",
      color: "#e08000",
      delay: 60,
    },
    {
      year: "2020",
      name: "Powell (Fed)",
      action: "COVID — 40% des dollars",
      consequence: "5 000 milliards $ en 18 mois. Record absolu.",
      color: C.red,
      delay: 120,
    },
  ];

  // Silhouette homme au micro — SVG pur
  const Silhouette: React.FC<{ x: number; y: number; color: string; scale?: number }> = ({
    x, y, color, scale = 1,
  }) => {
    const s = scale;
    return (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        {/* Corps */}
        <rect x={-18} y={10} width={36} height={50} rx={6} fill={color} opacity={0.9} />
        {/* Tete */}
        <circle cx={0} cy={0} r={18} fill={color} opacity={0.95} />
        {/* Micro */}
        <rect x={14} y={-8} width={8} height={18} rx={4} fill="rgba(255,255,255,0.7)" />
        <rect x={14} y={14} width={8} height={3} rx={1} fill="rgba(255,255,255,0.5)" />
        {/* Podium */}
        <rect x={-30} y={60} width={60} height={8} rx={3} fill={color} opacity={0.5} />
        {/* Lumiere de scene */}
        <ellipse cx={0} cy={-30} rx={30} ry={10}
          fill={color} opacity={0.08} />
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeIn * fadeOut }}>
      {/* Titre */}
      <div style={{
        position: "absolute", top: 80, left: 60, right: 60, textAlign: "center",
        opacity: ci(frame, [0, 30], [0, 1]),
      }}>
        <div style={{
          fontSize: 40, fontWeight: 900, color: C.white,
          fontFamily: "Arial Black, sans-serif",
        }}>
          3 hommes. 3 decisions.
        </div>
        <div style={{
          fontSize: 22, color: C.grey, fontFamily: "Arial, sans-serif", marginTop: 10,
        }}>
          Qui ont change la valeur de ton argent.
        </div>
      </div>

      {/* Silhouettes en haut */}
      <svg width={W} height={400} style={{ position: "absolute", top: 200 }}>
        {decisions.map(({ color, delay }, i) => {
          const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 20, stiffness: 180 } });
          const xPos = W * (0.22 + i * 0.28);
          return (
            <g key={i} opacity={s} transform={`translate(0, ${interpolate(s, [0,1], [30,0])})`}>
              <Silhouette x={xPos} y={130} color={color} scale={1.1} />
            </g>
          );
        })}
      </svg>

      {/* Cards decisions */}
      <div style={{
        position: "absolute", top: 480, left: 60, right: 60,
        display: "flex", flexDirection: "column", gap: 18,
      }}>
        {decisions.map(({ year, name, action, consequence, color, delay }, i) => {
          const s = spring({ frame: Math.max(0, frame - delay - 10), fps, config: { damping: 20, stiffness: 180 } });
          return (
            <div key={i} style={{
              background: "rgba(255,255,255,0.04)",
              borderLeft: `5px solid ${color}`,
              borderRadius: 14, padding: "20px 24px",
              opacity: s,
              transform: `translateX(${interpolate(s, [0,1], [-40,0])}px)`,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                <span style={{
                  fontSize: 28, fontWeight: 900, color,
                  fontFamily: "Arial Black, sans-serif",
                }}>
                  {year}
                </span>
                <span style={{
                  fontSize: 18, color: "rgba(255,255,255,0.6)",
                  fontFamily: "Arial, sans-serif",
                }}>
                  {name}
                </span>
              </div>
              <div style={{
                fontSize: 22, fontWeight: 900, color: C.white,
                fontFamily: "Arial Black, sans-serif", marginBottom: 6,
              }}>
                {action}
              </div>
              <div style={{
                fontSize: 18, color: "rgba(255,255,255,0.6)",
                fontFamily: "Arial, sans-serif",
              }}>
                {consequence}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 3 : COURBE POUVOIR D'ACHAT
// ============================================================

const PhaseCurve: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const fadeIn  = ci(frame, [0, 25],   [0, 1]);
  const fadeOut = ci(frame, [270, 300], [1, 0]);

  const curveP = ci(frame, [20, 200], [0, 1]);

  // Repere graphique
  const GX = 80;
  const GY_TOP = 220;
  const GY_BOT = 780;
  const GW = W - 160;
  const GH = GY_BOT - GY_TOP;

  const YEAR_START = 1971;
  const YEAR_END   = 2024;

  function dataToSvg(year: number, value: number): [number, number] {
    const x = GX + ((year - YEAR_START) / (YEAR_END - YEAR_START)) * GW;
    const y = GY_TOP + (1 - value / 100) * GH;
    return [x, y];
  }

  const svgPoints = PURCHASING_POWER.map(([y, v]) => dataToSvg(y, v));
  const pathD = linePath(svgPoints, curveP);

  // Valeur actuelle animee
  const currentIdx = Math.max(0, Math.floor(curveP * (PURCHASING_POWER.length - 1)));
  const currentVal = PURCHASING_POWER[Math.min(currentIdx, PURCHASING_POWER.length - 1)][1];

  // Point mobile sur la courbe
  const lastPt = svgPoints[Math.min(
    Math.max(0, Math.floor(curveP * (svgPoints.length - 1))),
    svgPoints.length - 1
  )];

  const labelS = spring({ frame: frame - 180, fps, config: { damping: 20, stiffness: 200 } });

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeIn * fadeOut }}>
      <div style={{
        position: "absolute", top: 80, left: 60, right: 60, textAlign: "center",
        opacity: ci(frame, [0, 30], [0, 1]),
      }}>
        <div style={{
          fontSize: 38, fontWeight: 900, color: C.white,
          fontFamily: "Arial Black, sans-serif",
        }}>
          Pouvoir d'achat de 100$
        </div>
        <div style={{
          fontSize: 22, color: C.grey, fontFamily: "Arial, sans-serif", marginTop: 10,
        }}>
          Index 1971 = 100
        </div>
      </div>

      <svg width={W} height={H}>
        {/* Grille horizontale */}
        {[100, 75, 50, 25, 13].map((v) => {
          const [, gy] = dataToSvg(YEAR_START, v);
          return (
            <g key={v}>
              <line x1={GX} y1={gy} x2={GX + GW} y2={gy}
                stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="6 4" />
              <text x={GX - 10} y={gy + 5} fontSize={16} fill="rgba(255,255,255,0.35)"
                textAnchor="end" fontFamily="Arial, sans-serif">
                {v}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={GX} y1={GY_TOP} x2={GX} y2={GY_BOT}
          stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
        <line x1={GX} y1={GY_BOT} x2={GX + GW} y2={GY_BOT}
          stroke="rgba(255,255,255,0.2)" strokeWidth={2} />

        {/* Zone de remplissage sous la courbe */}
        {pathD && (
          <path
            d={`${pathD} L ${lastPt[0]} ${GY_BOT} L ${GX} ${GY_BOT} Z`}
            fill="rgba(224,48,48,0.12)"
          />
        )}

        {/* Courbe principale */}
        {pathD && (
          <path d={pathD} fill="none" stroke={C.red} strokeWidth={4.5}
            strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Point mobile */}
        {curveP > 0 && (
          <>
            <circle cx={lastPt[0]} cy={lastPt[1]} r={12}
              fill={C.red} stroke={C.white} strokeWidth={3} />
            <rect x={lastPt[0] + 16} y={lastPt[1] - 30} width={120} height={50}
              rx={8} fill={C.darkCard} opacity={0.95} />
            <text x={lastPt[0] + 76} y={lastPt[1] - 6} fontSize={22} fontWeight="bold"
              fill={C.gold} textAnchor="middle" fontFamily="Arial Black, sans-serif">
              {currentVal}$
            </text>
            <text x={lastPt[0] + 76} y={lastPt[1] + 14} fontSize={14}
              fill={C.grey} textAnchor="middle" fontFamily="Arial, sans-serif">
              valeur reelle
            </text>
          </>
        )}

        {/* Labels annees axe X */}
        {[1971, 1990, 2010, 2024].map((year) => {
          const [x] = dataToSvg(year, 0);
          return (
            <text key={year} x={x} y={GY_BOT + 30} fontSize={17}
              fill="rgba(255,255,255,0.4)" textAnchor="middle" fontFamily="Arial, sans-serif">
              {year}
            </text>
          );
        })}
      </svg>

      {/* Encart conclusion */}
      <div style={{
        position: "absolute", bottom: 100, left: 60, right: 60,
        opacity: labelS,
        transform: `translateY(${interpolate(labelS, [0,1], [20,0])}px)`,
      }}>
        <div style={{
          background: "rgba(224,48,48,0.15)", border: `2px solid ${C.red}`,
          borderRadius: 16, padding: "24px 32px", textAlign: "center",
        }}>
          <div style={{
            fontSize: 42, fontWeight: 900, color: C.red,
            fontFamily: "Arial Black, sans-serif",
          }}>
            -87% de pouvoir d'achat
          </div>
          <div style={{
            fontSize: 22, color: "rgba(255,255,255,0.75)",
            fontFamily: "Arial, sans-serif", marginTop: 10,
          }}>
            En 53 ans. Votre argent dort, il perd.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 4 : PANIER COMPARATIF 1971 vs 2026
// ============================================================

const PhaseBasket: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const fadeIn  = ci(frame, [0, 25],   [0, 1]);
  const fadeOut = ci(frame, [210, 240], [1, 0]);

  const items = [
    { label: "Maison moyenne",  val1971: "25 000$",  val2026: "420 000$", mult: "17x" },
    { label: "Voiture neuve",   val1971: "3 500$",   val2026: "48 000$",  mult: "14x" },
    { label: "Universite/an",   val1971: "400$",     val2026: "11 000$",  mult: "28x" },
    { label: "Pain (kg)",       val1971: "0.22$",    val2026: "3.50$",    mult: "16x" },
  ];

  return (
    <AbsoluteFill style={{ background: C.bgLight, opacity: fadeIn * fadeOut }}>
      <div style={{
        position: "absolute", top: 80, left: 60, right: 60,
        textAlign: "center",
        opacity: ci(frame, [0, 30], [0, 1]),
      }}>
        <div style={{
          fontSize: 42, fontWeight: 900, color: "#111",
          fontFamily: "Arial Black, sans-serif",
        }}>
          Ce que 100$ achetait
        </div>
      </div>

      {/* En-tetes colonnes */}
      <div style={{
        position: "absolute", top: 200, left: 60, right: 60,
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px",
        gap: 8,
        opacity: ci(frame, [10, 35], [0, 1]),
      }}>
        <div style={{ fontSize: 18, fontWeight: "bold", color: "#666", fontFamily: "Arial, sans-serif" }}>Produit</div>
        <div style={{ fontSize: 18, fontWeight: "bold", color: C.green, fontFamily: "Arial, sans-serif", textAlign: "center" }}>1971</div>
        <div style={{ fontSize: 18, fontWeight: "bold", color: C.red, fontFamily: "Arial, sans-serif", textAlign: "center" }}>2026</div>
        <div style={{ fontSize: 18, fontWeight: "bold", color: C.gold, fontFamily: "Arial, sans-serif", textAlign: "center" }}>x</div>
      </div>

      <div style={{
        position: "absolute", top: 260, left: 60, right: 60,
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        {items.map(({ label, val1971, val2026, mult }, i) => {
          const rowS = spring({ frame: Math.max(0, frame - 20 - i * 35), fps, config: { damping: 20, stiffness: 180 } });
          return (
            <div key={label} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px",
              gap: 8, alignItems: "center",
              background: "white", borderRadius: 12, padding: "20px 24px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              opacity: rowS,
              transform: `translateX(${interpolate(rowS, [0,1], [-30,0])}px)`,
            }}>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#111", fontFamily: "Arial, sans-serif" }}>
                {label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.green, textAlign: "center",
                fontFamily: "Arial Black, sans-serif" }}>
                {val1971}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.red, textAlign: "center",
                fontFamily: "Arial Black, sans-serif" }}>
                {val2026}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.gold, textAlign: "center",
                fontFamily: "Arial Black, sans-serif" }}>
                {mult}
              </div>
            </div>
          );
        })}
      </div>

      {/* Note bas */}
      <div style={{
        position: "absolute", bottom: 120, left: 60, right: 60,
        opacity: ci(frame, [160, 200], [0, 1]),
      }}>
        <div style={{
          background: C.bg, borderRadius: 14, padding: "22px 28px", textAlign: "center",
        }}>
          <div style={{
            fontSize: 28, fontWeight: 900, color: C.gold,
            fontFamily: "Arial Black, sans-serif",
          }}>
            Les salaires ont-ils suivi ?
          </div>
          <div style={{
            fontSize: 20, color: "rgba(255,255,255,0.7)",
            fontFamily: "Arial, sans-serif", marginTop: 8,
          }}>
            Salaire median USA 1971 : 9 000$ → 2026 : 59 000$ = 6.5x seulement
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 5 : STATS LIVE
// ============================================================

const PhaseStats: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const fadeIn = ci(frame, [0, 20], [0, 1]);

  const s1 = spring({ frame: frame - 10, fps, config: { damping: 20, stiffness: 180 } });
  const s2 = spring({ frame: frame - 50, fps, config: { damping: 20, stiffness: 180 } });
  const s3 = spring({ frame: frame - 90, fps, config: { damping: 20, stiffness: 180 } });

  const inflCount = Math.round(ci(frame, [20, 130], [0, 870]));

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeIn }}>
      {/* Titre */}
      <div style={{
        position: "absolute", top: 120, left: 60, right: 60, textAlign: "center",
      }}>
        <div style={{
          fontSize: 38, fontWeight: 900, color: C.white,
          fontFamily: "Arial Black, sans-serif",
        }}>
          Les chiffres bruts
        </div>
      </div>

      {/* Big visual — 100$ → 13$ */}
      <div style={{
        position: "absolute", top: 260, left: 60, right: 60, textAlign: "center",
      }}>
        <svg width={W - 120} height={160}>
          <text x={(W-120)/2} y={80} fontSize={100} fontWeight={900}
            fill="rgba(255,255,255,0.08)" textAnchor="middle"
            fontFamily="Arial Black, sans-serif">
            100$
          </text>
          <text x={(W-120)/2} y={150} fontSize={40} fontWeight={900}
            fill={C.red} textAnchor="middle" fontFamily="Arial Black, sans-serif">
            = {Math.max(13, 100 - Math.round(ci(frame, [10, 110], [0, 87])))}$ aujourd'hui
          </text>
        </svg>
      </div>

      {/* Stats */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: C.darkCard, padding: "36px 48px 60px",
        display: "flex", flexDirection: "column", gap: 24,
      }}>
        {[
          {
            s: s1,
            icon: "📉",
            iconBg: C.red,
            val: `+${inflCount}%`,
            label: "Inflation cumulee depuis 1971 (USA)",
          },
          {
            s: s2,
            icon: "🏠",
            iconBg: C.blue,
            val: "17x",
            label: "Hausse prix immobilier median USA",
          },
          {
            s: s3,
            icon: "💰",
            iconBg: "#9060c0",
            val: "40%",
            label: "Dollars crees entre 2020 et 2022",
          },
        ].map(({ s, icon, iconBg, val, label }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 18,
            opacity: s, transform: `translateX(${interpolate(s, [0,1], [-40,0])}px)`,
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: "50%",
              background: iconBg, display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0, fontSize: 22,
            }}>
              {icon}
            </div>
            <div>
              <div style={{
                fontSize: 36, fontWeight: 900, color: C.gold,
                fontFamily: "Arial Black, sans-serif",
              }}>
                {val}
              </div>
              <div style={{
                fontSize: 18, color: "rgba(255,255,255,0.7)",
                fontFamily: "Arial, sans-serif",
              }}>
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 6 : CE QUE CA VEUT DIRE POUR TOI
// ============================================================

const PhaseAction: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const fadeIn  = ci(frame, [0, 25],   [0, 1]);
  const fadeOut = ci(frame, [270, 300], [1, 0]);

  const titleS = spring({ frame,          fps, config: { damping: 20, stiffness: 160 } });
  const c1S    = spring({ frame: frame - 30, fps, config: { damping: 20, stiffness: 180 } });
  const c2S    = spring({ frame: frame - 60, fps, config: { damping: 20, stiffness: 180 } });
  const c3S    = spring({ frame: frame - 90, fps, config: { damping: 20, stiffness: 180 } });

  const cards = [
    {
      s: c1S, icon: "🏦",
      title: "Epargne dormante = perte garantie",
      desc: "3% d'interets face a 7% d'inflation = -4%/an net",
      color: C.red,
    },
    {
      s: c2S, icon: "📊",
      title: "Les actifs surperforment le cash",
      desc: "S&P500 : +10%/an moyen depuis 50 ans",
      color: C.green,
    },
    {
      s: c3S, icon: "⏱",
      title: "Le temps est le vrai ennemi",
      desc: "Attendre 10 ans = perdre 50% de pouvoir d'achat",
      color: C.gold,
    },
  ];

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fadeIn * fadeOut }}>
      <div style={{
        position: "absolute", top: 80, left: 60, right: 60,
        opacity: titleS,
        transform: `translateY(${interpolate(titleS, [0,1], [30,0])}px)`,
      }}>
        <div style={{
          fontSize: 42, fontWeight: 900, color: C.white,
          fontFamily: "Arial Black, sans-serif", textAlign: "center",
        }}>
          Ce que ca change pour toi
        </div>
      </div>

      <div style={{
        position: "absolute", top: 220, left: 60, right: 60,
        display: "flex", flexDirection: "column", gap: 24,
      }}>
        {cards.map(({ s, icon, title, desc, color }) => (
          <div key={title} style={{
            background: "rgba(255,255,255,0.04)",
            border: `2px solid ${color}22`,
            borderLeft: `5px solid ${color}`,
            borderRadius: 16, padding: "28px 32px",
            opacity: s,
            transform: `translateX(${interpolate(s, [0,1], [-40,0])}px)`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
              <span style={{ fontSize: 30 }}>{icon}</span>
              <div style={{
                fontSize: 24, fontWeight: 900, color,
                fontFamily: "Arial Black, sans-serif",
              }}>
                {title}
              </div>
            </div>
            <div style={{
              fontSize: 20, color: "rgba(255,255,255,0.65)",
              fontFamily: "Arial, sans-serif",
            }}>
              {desc}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 7 : OUTRO
// ============================================================

const PhaseOutro: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const fadeIn  = ci(frame, [0, 25],   [0, 1]);
  const fadeOut = ci(frame, [260, 300], [1, 0]);

  const s1   = spring({ frame,          fps, config: { damping: 18, stiffness: 160 } });
  const s2   = spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 160 } });
  const s3   = spring({ frame: frame - 40, fps, config: { damping: 18, stiffness: 160 } });
  const ctaS = spring({ frame: frame - 80, fps, config: { damping: 15, stiffness: 140 } });

  return (
    <AbsoluteFill style={{
      background: C.bg,
      opacity: fadeIn * fadeOut,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 70px",
    }}>
      <div style={{
        fontSize: 50, fontWeight: 900, color: C.white,
        fontFamily: "Arial Black, sans-serif", textAlign: "center",
        lineHeight: 1.1, marginBottom: 48,
        opacity: s1, transform: `translateY(${interpolate(s1, [0,1], [30,0])}px)`,
      }}>
        Ton argent se depense. Meme sans rien acheter.
      </div>

      <div style={{
        display: "flex", flexDirection: "column", gap: 16,
        width: "100%", marginBottom: 48,
      }}>
        {[
          { num: "-87%",    label: "Pouvoir d'achat perdu depuis 1971", color: C.red,   delay: s1 },
          { num: "+870%",   label: "Inflation cumulee USA",             color: C.gold,  delay: s2 },
          { num: "40%",     label: "Dollars crees en 2 ans (2020-22)",  color: C.blue,  delay: s3 },
        ].map(({ num, label, color, delay }) => (
          <div key={num} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "rgba(255,255,255,0.06)", borderRadius: 12,
            padding: "18px 28px",
            opacity: delay,
            transform: `translateX(${interpolate(delay, [0,1], [-30,0])}px)`,
          }}>
            <div style={{ fontSize: 38, fontWeight: 900, color, fontFamily: "Arial Black, sans-serif" }}>
              {num}
            </div>
            <div style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", fontFamily: "Arial, sans-serif" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        opacity: ctaS,
        transform: `scale(${interpolate(ctaS, [0,1], [0.85,1])})`,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 34, fontWeight: "bold", color: C.gold,
          fontFamily: "Arial, sans-serif", marginBottom: 10,
        }}>
          Suis pour la suite
        </div>
        <div style={{
          fontSize: 21, color: "rgba(255,255,255,0.45)",
          fontFamily: "Arial, sans-serif",
        }}>
          Economie expliquee en 60s
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export const InfoShortDollar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Total : 2100 frames = 70s (PhaseDecisions ajoutee entre Timeline et Courbe)
  const phases = [
    { start: 0,    end: 60   }, // 0 Hook
    { start: 60,   end: 360  }, // 1 Timeline
    { start: 360,  end: 660  }, // 2 Decisions (nouveau)
    { start: 660,  end: 960  }, // 3 Courbe
    { start: 960,  end: 1200 }, // 4 Basket
    { start: 1200, end: 1500 }, // 5 Stats
    { start: 1500, end: 1800 }, // 6 Action
    { start: 1800, end: 2100 }, // 7 Outro
  ];

  const localFrame = (i: number) => Math.max(0, frame - phases[i].start);
  const visible    = (i: number) => frame >= phases[i].start && frame < phases[i].end + 30;

  // Compteur temps reel : perte de valeur pendant cette video (60s)
  // 1 000$ en epargne perd ~0.019$ par minute de valeur reelle (inflation 7%/an)
  // Sur 70s : 0.019 * (70/60) ~ 0.022$
  // On affiche au centieme, anime sur toute la duree de la video
  const lostCents = interpolate(frame, [60, 2100], [0, 2.2], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const showCounter = frame >= 60 && frame < 2070;

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: "Arial, sans-serif" }}>
      {visible(0) && <PhaseHook      frame={localFrame(0)} fps={fps} />}
      {visible(1) && <PhaseTimeline  frame={localFrame(1)} fps={fps} />}
      {visible(2) && <PhaseDecisions frame={localFrame(2)} fps={fps} />}
      {visible(3) && <PhaseCurve     frame={localFrame(3)} fps={fps} />}
      {visible(4) && <PhaseBasket    frame={localFrame(4)} fps={fps} />}
      {visible(5) && <PhaseStats     frame={localFrame(5)} fps={fps} />}
      {visible(6) && <PhaseAction    frame={localFrame(6)} fps={fps} />}
      {visible(7) && <PhaseOutro     frame={localFrame(7)} fps={fps} />}

      {/* Compteur temps reel — overlay permanent coin bas gauche */}
      {showCounter && (
        <div style={{
          position: "absolute", bottom: 36, left: 36,
          opacity: interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          <div style={{
            background: "rgba(10,10,26,0.88)",
            border: `1px solid rgba(224,48,48,0.4)`,
            borderRadius: 12, padding: "10px 18px",
          }}>
            <div style={{
              fontSize: 13, color: "rgba(255,255,255,0.45)",
              fontFamily: "Arial, sans-serif", marginBottom: 4,
            }}>
              1 000$ en epargne perdent...
            </div>
            <div style={{
              fontSize: 26, fontWeight: 900, color: C.red,
              fontFamily: "Arial Black, sans-serif",
            }}>
              -{lostCents.toFixed(2)}$
            </div>
            <div style={{
              fontSize: 11, color: "rgba(255,255,255,0.3)",
              fontFamily: "Arial, sans-serif",
            }}>
              pendant que tu regardes cette video
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
