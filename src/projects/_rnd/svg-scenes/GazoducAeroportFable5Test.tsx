// GazoducAeroportFable5Test — R&D EXPLORATION (2026-08-13, Fable 5 mode MAX)
// Static SVG reproduction of the Gemini reference image (gemini-reference-v1.png):
// Niamey airport at night — control tower, terminal, runway, floodlights, windsock (Niger colors).
// NO human figure, NO silhouette anywhere (hard editorial constraint) — pure infrastructure.
// Target: match or exceed the Gemini raster reference in pure SVG (gradients, halos, no base64 raster).
// Reference production file for palette/structure: souverain/gazoduc-aagp-tsgp/GazoducActe3InsertSecurite.tsx
import React from "react";
import { AbsoluteFill } from "remotion";

export const GAZODUC_AEROPORT_FABLE5_FRAMES = 60;

// ===== Static data =====

// Scattered dot stars [cx, cy, r, opacity]
const STARS: [number, number, number, number][] = [
  [90, 120, 2, 0.8], [210, 240, 1.4, 0.5], [320, 90, 1.8, 0.75], [455, 300, 1.2, 0.45],
  [540, 170, 1.6, 0.6], [660, 60, 2, 0.85], [780, 210, 1.3, 0.5], [1010, 130, 1.7, 0.7],
  [1105, 260, 1.2, 0.45], [1225, 80, 1.9, 0.8], [1330, 190, 1.4, 0.55], [1445, 320, 1.1, 0.4],
  [1500, 60, 1.6, 0.65], [1815, 300, 1.4, 0.5], [1875, 120, 1.8, 0.7], [130, 380, 1.1, 0.35],
  [740, 350, 1.1, 0.4], [980, 400, 1, 0.3], [1580, 380, 1.2, 0.4], [400, 430, 1, 0.3],
  [860, 95, 1.3, 0.55], [1140, 350, 1, 0.35], [250, 160, 1.2, 0.5], [1740, 60, 1.5, 0.6],
];

// 4-point sparkle stars [cx, cy, size, opacity]
const SPARKLES: [number, number, number, number][] = [
  [500, 65, 11, 0.95], [935, 55, 13, 1], [1385, 135, 10, 0.9], [175, 55, 9, 0.85], [1120, 175, 8, 0.8],
];

// Terminal windows [x] — one row, slight fill variation for life
const TERMINAL_WIN_X = [150, 188, 226, 264, 316, 354, 392, 430, 482, 520, 558, 596];
const TERMINAL_WIN_FILL = [
  "#ffc46b", "#f5b95a", "#ffd07a", "#c9924e", "#ffc46b", "#ffd07a",
  "#f5b95a", "#ffc46b", "#8a6a44", "#ffd07a", "#ffc46b", "#f5b95a",
];

// Runway geometry: edges from horizon (t=0) to bottom (t=1)
const rwLeftX = (t: number) => 975 - 355 * t;
const rwRightX = (t: number) => 1160 + 280 * t;
const rwY = (t: number) => 735 + 345 * t;
const rwCenterX = (t: number) => 1067.5 - 37.5 * t;

const RUNWAY_LIGHT_T = [0.03, 0.11, 0.2, 0.3, 0.41, 0.53, 0.66, 0.8, 0.95];

// Center dashed line segments [tStart, tEnd]
const CENTER_DASHES: [number, number][] = [
  [0.05, 0.12], [0.19, 0.27], [0.35, 0.45], [0.54, 0.66], [0.77, 0.91],
];

// Quadratic bezier point helper for taxiway light chains
const qPoint = (
  p0: [number, number], p1: [number, number], p2: [number, number], t: number,
): [number, number] => {
  const mt = 1 - t;
  return [
    mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0],
    mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1],
  ];
};

// Teal taxiway lead-off chains (turquoise)
const TEAL_LEFT: [number, number][] = [0, 0.16, 0.32, 0.48, 0.64, 0.8, 0.96].map((t) =>
  qPoint([880, 1045], [590, 905], [225, 868], t),
);
const TEAL_RIGHT: [number, number][] = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) =>
  qPoint([1548, 872], [1630, 935], [1758, 1042], t),
);

// Amber lights on the left service road / right service road
const ROAD_LEFT_AMBER = [30, 158, 292, 428, 556];
const ROAD_LEFT_TEAL = [92, 224, 360, 494];
const ROAD_RIGHT_AMBER = [1252, 1362, 1472, 1582, 1806, 1888];

// Zebra "piano key" threshold marks at runway bottom (converge toward vanishing point ~(1067,735))
const PIANO_KEYS = [660, 745, 830, 915, 1000, 1085, 1170, 1255, 1340].map((xb) => {
  const vx = 1067.5;
  const shrink = (x: number) => x + (vx - x) * 0.135; // pull top corners toward vanishing point
  const x2 = xb + 52;
  return `${xb},1080 ${x2},1080 ${shrink(x2)},1008 ${shrink(xb)},1008`;
});

// Moon craters [cx offset, cy offset, r, opacity]
const CRATERS: [number, number, number, number][] = [
  [-18, -8, 9, 0.55], [10, 14, 12, 0.5], [22, -16, 6, 0.45], [-4, 24, 5, 0.5],
  [-26, 16, 4, 0.4], [16, 0, 4, 0.35], [-8, -24, 5, 0.4], [30, 8, 3.5, 0.4],
];

// ===== Sub-elements =====

const Star4: React.FC<{ cx: number; cy: number; s: number; op: number }> = ({ cx, cy, s, op }) => (
  <g opacity={op}>
    <circle cx={cx} cy={cy} r={s * 0.55} fill="#dce8ff" opacity={0.25} />
    <path
      d={`M ${cx} ${cy - s} Q ${cx + s * 0.14} ${cy - s * 0.14} ${cx + s} ${cy} Q ${cx + s * 0.14} ${cy + s * 0.14} ${cx} ${cy + s} Q ${cx - s * 0.14} ${cy + s * 0.14} ${cx - s} ${cy} Q ${cx - s * 0.14} ${cy - s * 0.14} ${cx} ${cy - s} Z`}
      fill="#eef4ff"
    />
  </g>
);

const AmberLight: React.FC<{ cx: number; cy: number; rHalo: number; rPoint: number; op?: number }> = ({
  cx, cy, rHalo, rPoint, op = 1,
}) => (
  <g opacity={op}>
    <circle cx={cx} cy={cy} r={rHalo} fill="url(#light_glow)" />
    <ellipse cx={cx} cy={cy + rPoint * 1.6} rx={rHalo * 0.9} ry={rPoint * 1.1} fill="#ffc46b" opacity={0.14} />
    <circle cx={cx} cy={cy} r={rPoint} fill="#ffdf9e" />
    <circle cx={cx} cy={cy - rPoint * 0.25} r={rPoint * 0.45} fill="#fff4d6" />
  </g>
);

const TealLight: React.FC<{ cx: number; cy: number; rHalo: number; rPoint: number }> = ({
  cx, cy, rHalo, rPoint,
}) => (
  <g>
    <circle cx={cx} cy={cy} r={rHalo} fill="url(#teal_glow)" />
    <ellipse cx={cx} cy={cy + rPoint * 1.5} rx={rHalo * 0.85} ry={rPoint} fill="#5ee6d8" opacity={0.13} />
    <circle cx={cx} cy={cy} r={rPoint} fill="#7df0e0" />
    <circle cx={cx} cy={cy - rPoint * 0.2} r={rPoint * 0.42} fill="#d9fffa" />
  </g>
);

// ===== Main component =====

export const GazoducAeroportFable5Test: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#060d24" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          {/* Sky */}
          <linearGradient id="af_sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070f26" />
            <stop offset="0.4" stopColor="#0f1e42" />
            <stop offset="0.72" stopColor="#1e3660" />
            <stop offset="0.92" stopColor="#31517f" />
            <stop offset="1" stopColor="#446690" />
          </linearGradient>
          <radialGradient id="af_dusk" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#8a6448" stopOpacity={0.5} />
            <stop offset="0.6" stopColor="#8a6448" stopOpacity={0.2} />
            <stop offset="1" stopColor="#8a6448" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="af_horizon_pale" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#a9c2df" stopOpacity={0.22} />
            <stop offset="1" stopColor="#a9c2df" stopOpacity={0} />
          </radialGradient>
          {/* Moon */}
          <radialGradient id="af_moon_halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#dfe9f7" stopOpacity={0.35} />
            <stop offset="0.35" stopColor="#c8d8ee" stopOpacity={0.16} />
            <stop offset="0.7" stopColor="#b0c4e2" stopOpacity={0.06} />
            <stop offset="1" stopColor="#b0c4e2" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="af_moon_body" cx="0.38" cy="0.34" r="0.75">
            <stop offset="0" stopColor="#f2f6fc" />
            <stop offset="0.55" stopColor="#d7e1f0" />
            <stop offset="0.85" stopColor="#aebfd8" />
            <stop offset="1" stopColor="#93a7c6" />
          </radialGradient>
          <radialGradient id="af_crater" cx="0.4" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#b6c5dc" />
            <stop offset="0.8" stopColor="#9dafcc" />
            <stop offset="1" stopColor="#8fa2c2" />
          </radialGradient>
          {/* Lights */}
          <radialGradient id="light_glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd98a" stopOpacity={0.9} />
            <stop offset="0.4" stopColor="#ffd98a" stopOpacity={0.3} />
            <stop offset="1" stopColor="#ffd98a" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="teal_glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#6fe8db" stopOpacity={0.85} />
            <stop offset="0.4" stopColor="#6fe8db" stopOpacity={0.28} />
            <stop offset="1" stopColor="#6fe8db" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="af_cab_halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffca70" stopOpacity={0.6} />
            <stop offset="0.5" stopColor="#ffca70" stopOpacity={0.22} />
            <stop offset="1" stopColor="#ffca70" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="af_warm_pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffc46b" stopOpacity={0.5} />
            <stop offset="1" stopColor="#ffc46b" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="af_red_glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ff5a4d" stopOpacity={0.8} />
            <stop offset="0.5" stopColor="#ff5a4d" stopOpacity={0.25} />
            <stop offset="1" stopColor="#ff5a4d" stopOpacity={0} />
          </radialGradient>
          {/* Cab glass + cones + ground */}
          <linearGradient id="af_cab_glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe8b0" />
            <stop offset="0.55" stopColor="#ffd07a" />
            <stop offset="1" stopColor="#eda254" />
          </linearGradient>
          <linearGradient id="af_cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe4a8" stopOpacity={0.42} />
            <stop offset="0.55" stopColor="#ffe4a8" stopOpacity={0.17} />
            <stop offset="1" stopColor="#ffe4a8" stopOpacity={0.04} />
          </linearGradient>
          <linearGradient id="af_ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b4267" />
            <stop offset="0.35" stopColor="#1e3153" />
            <stop offset="1" stopColor="#0d1936" />
          </linearGradient>
          <linearGradient id="af_runway" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b3f63" />
            <stop offset="1" stopColor="#35496e" />
          </linearGradient>
          <linearGradient id="af_win_refl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffc46b" stopOpacity={0.22} />
            <stop offset="1" stopColor="#ffc46b" stopOpacity={0} />
          </linearGradient>
          <radialGradient id="af_vignette" cx="0.5" cy="0.42" r="0.75">
            <stop offset="0" stopColor="#04081a" stopOpacity={0} />
            <stop offset="0.7" stopColor="#04081a" stopOpacity={0} />
            <stop offset="1" stopColor="#04081a" stopOpacity={0.52} />
          </radialGradient>
          <filter id="af_soft6" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="af_soft3" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* ================= CIEL ================= */}
        <g id="ciel">
          <rect x={0} y={0} width={1920} height={720} fill="url(#af_sky)" />
          {/* pale band along the horizon */}
          <ellipse cx={1000} cy={716} rx={1100} ry={95} fill="url(#af_horizon_pale)" />
          {/* warm dusk glow behind the terminal, left */}
          <ellipse cx={420} cy={716} rx={640} ry={165} fill="url(#af_dusk)" />
        </g>

        {/* ================= ETOILES ================= */}
        <g id="etoiles">
          {STARS.map(([cx, cy, r, op], i) => (
            <circle key={`st-${i}`} cx={cx} cy={cy} r={r} fill="#dce8ff" opacity={op} />
          ))}
          {SPARKLES.map(([cx, cy, s, op], i) => (
            <Star4 key={`sp-${i}`} cx={cx} cy={cy} s={s} op={op} />
          ))}
        </g>

        {/* ================= LUNE ================= */}
        <g id="lune">
          <circle cx={1652} cy={168} r={185} fill="url(#af_moon_halo)" />
          <circle cx={1652} cy={168} r={57} fill="url(#af_moon_body)" />
          {CRATERS.map(([dx, dy, r, op], i) => (
            <g key={`cr-${i}`} opacity={op}>
              <circle cx={1652 + dx} cy={168 + dy} r={r} fill="url(#af_crater)" />
              <path
                d={`M ${1652 + dx - r * 0.7} ${168 + dy + r * 0.45} A ${r * 0.85} ${r * 0.85} 0 0 0 ${1652 + dx + r * 0.75} ${168 + dy + r * 0.35}`}
                fill="none" stroke="#8497b8" strokeWidth={r * 0.18} opacity={0.35}
              />
            </g>
          ))}
          {/* limb shading bottom-right */}
          <path
            d="M 1701 133 A 57 57 0 0 1 1621 214 A 66 66 0 0 0 1701 133 Z"
            fill="#7e93b6" opacity={0.35}
          />
        </g>

        {/* ================= NUAGES ================= */}
        <g id="nuages" filter="url(#af_soft6)">
          <g opacity={0.88}>
            <ellipse cx={430} cy={415} rx={175} ry={34} fill="#233c63" />
            <ellipse cx={555} cy={402} rx={115} ry={28} fill="#233c63" />
            <ellipse cx={320} cy={428} rx={105} ry={25} fill="#20385e" />
            <ellipse cx={470} cy={396} rx={135} ry={15} fill="#35507c" opacity={0.55} />
          </g>
          <g opacity={0.95}>
            <ellipse cx={1270} cy={514} rx={280} ry={52} fill="#1d3358" />
            <ellipse cx={1440} cy={494} rx={160} ry={37} fill="#1d3358" />
            <ellipse cx={1100} cy={532} rx={150} ry={33} fill="#1a2f52" />
            <ellipse cx={1310} cy={484} rx={190} ry={17} fill="#30487a" opacity={0.55} />
          </g>
          <g opacity={0.8}>
            <ellipse cx={1730} cy={420} rx={150} ry={28} fill="#233c63" />
            <ellipse cx={1845} cy={436} rx={92} ry={22} fill="#233c63" />
            <ellipse cx={1785} cy={412} rx={95} ry={11} fill="#35507c" opacity={0.5} />
          </g>
          <g opacity={0.6}>
            <ellipse cx={880} cy={330} rx={110} ry={17} fill="#1e3459" />
            <ellipse cx={960} cy={322} rx={70} ry={12} fill="#1e3459" />
          </g>
        </g>

        {/* ================= SOL / TARMAC ================= */}
        <g id="sol">
          <rect x={0} y={716} width={1920} height={364} fill="url(#af_ground)" />
          <rect x={0} y={714} width={1920} height={3} fill="#4a6a94" opacity={0.5} />
          {/* faint distant amber dots along the apron horizon */}
          {[720, 790, 1230, 1310, 1390, 1860].map((x, i) => (
            <circle key={`far-${i}`} cx={x} cy={724} r={2.2} fill="#ffd98a" opacity={0.5} />
          ))}
        </g>

        {/* ================= ROUTES DE SERVICE ================= */}
        <g id="routes">
          {/* left service road */}
          <polygon points="0,820 900,845 900,886 0,876" fill="#2b4065" />
          <path d="M0 822 L900 847" stroke="#4a6a94" strokeWidth={2} opacity={0.5} fill="none" />
          <path d="M0 874 L900 884" stroke="#1a2c50" strokeWidth={2} opacity={0.7} fill="none" />
          {[36, 148, 260, 372, 484].map((x, i) => (
            <rect key={`dashL-${i}`} x={x} y={849 + i * 1.1} width={58} height={5} rx={2.5} fill="#b9c6da" opacity={0.55} transform={`rotate(1.4 ${x} 849)`} />
          ))}
          {/* right service road */}
          <polygon points="1240,840 1920,826 1920,892 1240,886" fill="#2b4065" />
          <path d="M1240 842 L1920 828" stroke="#4a6a94" strokeWidth={2} opacity={0.5} fill="none" />
          <path d="M1240 884 L1920 890" stroke="#1a2c50" strokeWidth={2} opacity={0.7} fill="none" />
          {/* white zebra crossing on the right road */}
          {[1300, 1352, 1404, 1456, 1508, 1560, 1612].map((x, i) => (
            <polygon
              key={`zeb-${i}`}
              points={`${x},886 ${x + 30},885 ${x + 34},842 ${x + 5},843`}
              fill="#c3cfe0" opacity={0.6}
            />
          ))}
        </g>

        {/* ================= PISTE ================= */}
        <g id="piste">
          <polygon
            points={`${rwLeftX(0)},${rwY(0)} ${rwRightX(0)},${rwY(0)} ${rwRightX(1)},${rwY(1)} ${rwLeftX(1)},${rwY(1)}`}
            fill="url(#af_runway)"
          />
          <path d={`M${rwLeftX(0)} ${rwY(0)} L${rwLeftX(1)} ${rwY(1)}`} stroke="#8fa5c5" strokeWidth={2.5} opacity={0.32} fill="none" />
          <path d={`M${rwRightX(0)} ${rwY(0)} L${rwRightX(1)} ${rwY(1)}`} stroke="#8fa5c5" strokeWidth={2.5} opacity={0.32} fill="none" />
          {/* center dashed line */}
          <g id="ligne_centrale">
            {CENTER_DASHES.map(([t0, t1], i) => {
              const w0 = 3 + 20 * t0;
              const w1 = 3 + 20 * t1;
              return (
                <polygon
                  key={`cd-${i}`}
                  points={`${rwCenterX(t0) - w0 / 2},${rwY(t0)} ${rwCenterX(t0) + w0 / 2},${rwY(t0)} ${rwCenterX(t1) + w1 / 2},${rwY(t1)} ${rwCenterX(t1) - w1 / 2},${rwY(t1)}`}
                  fill="#c3cfe0" opacity={0.58}
                />
              );
            })}
          </g>
          {/* distance haze where the runway meets the horizon */}
          <ellipse cx={1067} cy={742} rx={280} ry={30} fill="url(#af_horizon_pale)" opacity={0.7} />
          {/* threshold piano keys */}
          <g id="marquages_seuil">
            {PIANO_KEYS.map((pts, i) => (
              <polygon key={`pk-${i}`} points={pts} fill="#c3cfe0" opacity={0.55} />
            ))}
          </g>
        </g>

        {/* ================= BALISAGE LUMINEUX ================= */}
        <g id="balisage">
          {/* runway edge lights — amber, both sides, hugging the edges, growing toward camera */}
          {RUNWAY_LIGHT_T.map((t, i) => {
            const rP = 2.6 + 4.6 * t;
            const rH = 8 + 14 * t;
            return (
              <g key={`rwl-${i}`}>
                <AmberLight cx={rwLeftX(t) - 8 - 5 * t} cy={rwY(t)} rHalo={rH} rPoint={rP} />
                <AmberLight cx={rwRightX(t) + 8 + 5 * t} cy={rwY(t)} rHalo={rH} rPoint={rP} />
              </g>
            );
          })}
          {/* teal lead-off chains */}
          {TEAL_LEFT.map(([x, y], i) => (
            <TealLight key={`tl-${i}`} cx={x} cy={y} rHalo={10.5 - i * 0.6} rPoint={3.8 - i * 0.22} />
          ))}
          {TEAL_RIGHT.map(([x, y], i) => (
            <TealLight key={`tr-${i}`} cx={x} cy={y} rHalo={10 + i * 1.1} rPoint={3.6 + i * 0.4} />
          ))}
          {/* service road lights */}
          {ROAD_LEFT_AMBER.map((x, i) => (
            <AmberLight key={`rla-${i}`} cx={x} cy={832 + i * 1.2} rHalo={13} rPoint={4.5} />
          ))}
          {ROAD_LEFT_TEAL.map((x, i) => (
            <TealLight key={`rlt-${i}`} cx={x} cy={880} rHalo={10} rPoint={3.6} />
          ))}
          {ROAD_RIGHT_AMBER.map((x, i) => (
            <AmberLight key={`rra-${i}`} cx={x} cy={838 - i * 1} rHalo={13} rPoint={4.5} />
          ))}
        </g>

        {/* ================= PROJECTEURS (mât gauche) ================= */}
        <g id="projecteurs">
          <polygon points="88,522 186,522 348,1080 -120,1080" fill="url(#af_cone)" />
          <ellipse cx={120} cy={1058} rx={300} ry={46} fill="url(#af_warm_pool)" opacity={0.55} />
          <rect x={128} y={520} width={12} height={560} fill="#0d1a36" />
          <rect x={130.5} y={520} width={3} height={560} fill="#33517e" opacity={0.7} />
          <rect x={86} y={512} width={102} height={9} rx={3} fill="#12224a" />
          <path d="M110 522 L96 548 M164 522 L178 548" stroke="#12224a" strokeWidth={5} fill="none" />
          {[94, 120, 148, 174].map((x, i) => (
            <g key={`lamp-${i}`}>
              <ellipse cx={x} cy={508} rx={12} ry={7} fill="#1a2c50" />
              <ellipse cx={x} cy={511} rx={10} ry={5} fill="#ffe4a8" />
              <circle cx={x} cy={511} r={20} fill="url(#light_glow)" opacity={0.8} />
            </g>
          ))}
          <circle cx={134} cy={505} r={46} fill="url(#light_glow)" opacity={0.5} />
        </g>

        {/* ================= TERMINAL ================= */}
        <g id="terminal">
          {/* warm ground reflection in front of the building */}
          <ellipse cx={400} cy={722} rx={300} ry={26} fill="url(#af_warm_pool)" opacity={0.65} />
          {/* body */}
          <rect x={125} y={588} width={520} height={128} fill="#101d3a" />
          <rect x={115} y={574} width={540} height={16} fill="#1a2c50" />
          <rect x={115} y={572} width={540} height={3} fill="#33517e" opacity={0.8} />
          {/* roof equipment */}
          <rect x={200} y={556} width={42} height={16} fill="#0e1b38" />
          <rect x={560} y={558} width={32} height={14} fill="#0e1b38" />
          <rect x={396} y={560} width={22} height={12} fill="#132548" />
          {/* windows row */}
          {TERMINAL_WIN_X.map((x, i) => (
            <g key={`tw-${i}`}>
              <rect x={x - 3} y={617} width={34} height={50} fill={TERMINAL_WIN_FILL[i]} opacity={0.16} />
              <rect x={x} y={620} width={28} height={44} fill={TERMINAL_WIN_FILL[i]} />
              <rect x={x} y={620} width={28} height={10} fill="#fff0cc" opacity={0.35} />
            </g>
          ))}
          {/* entrance */}
          <rect x={276} y={676} width={132} height={10} fill="#24385e" />
          <rect x={280} y={686} width={4} height={30} fill="#1a2c50" />
          <rect x={400} y={686} width={4} height={30} fill="#1a2c50" />
          <rect x={292} y={688} width={100} height={28} fill="#ffd98a" opacity={0.92} />
          <rect x={318} y={688} width={3} height={28} fill="#8a6a44" opacity={0.8} />
          <rect x={344} y={688} width={3} height={28} fill="#8a6a44" opacity={0.8} />
          <rect x={370} y={688} width={3} height={28} fill="#8a6a44" opacity={0.8} />
          <ellipse cx={342} cy={722} rx={95} ry={12} fill="#ffd98a" opacity={0.25} />
          {/* window reflections on the apron */}
          <g id="reflets_terminal" opacity={0.85}>
            {TERMINAL_WIN_X.map((x, i) => (
              <rect key={`twr-${i}`} x={x + 1} y={718} width={26} height={44 - (i % 3) * 8} fill="url(#af_win_refl)" />
            ))}
            <rect x={292} y={718} width={100} height={52} fill="url(#af_win_refl)" opacity={0.9} />
          </g>
        </g>

        {/* ================= TOUR DE CONTROLE ================= */}
        <g id="tour_controle">
          {/* halo behind the cab */}
          <ellipse cx={880} cy={376} rx={132} ry={72} fill="url(#af_cab_halo)" />
          {/* shaft with flared base */}
          <path d="M 866 432 L 894 432 L 900 640 L 916 716 L 844 716 L 860 640 Z" fill="#0e1b38" />
          <path d="M 868 436 L 873 436 L 866 712 L 856 712 Z" fill="#1c2f57" opacity={0.8} />
          <path d="M 892 436 L 894 436 L 903 712 L 899 712 Z" fill="#46648c" opacity={0.5} />
          {[480, 532, 584].map((y, i) => (
            <path key={`band-${i}`} d={`M ${864 - i * 1.4} ${y} L ${896 + i * 1.4} ${y}`} stroke="#1c2f57" strokeWidth={2} opacity={0.7} />
          ))}
          {/* shaft windows */}
          <g>
            <rect x={874} y={500} width={12} height={17} fill="#ffca70" opacity={0.9} />
            <rect x={874} y={600} width={12} height={17} fill="#ffca70" opacity={0.85} />
            <circle cx={880} cy={508} r={14} fill="url(#light_glow)" opacity={0.5} />
            <circle cx={880} cy={608} r={14} fill="url(#light_glow)" opacity={0.5} />
          </g>
          {/* collar under cab */}
          <polygon points="862,432 898,432 906,412 854,412" fill="#142648" />
          <rect x={850} y={408} width={60} height={6} fill="#1d3156" />
          {/* cab floor slab */}
          <polygon points="838,412 922,412 928,400 832,400" fill="#16294c" />
          {/* glass cab (wider at top) */}
          <polygon points="840,400 920,400 934,348 826,348" fill="url(#af_cab_glass)" />
          {/* mullions */}
          {[0.22, 0.42, 0.61, 0.8].map((f, i) => {
            const xb = 840 + 80 * f;
            const xt = 826 + 108 * f;
            return <path key={`mul-${i}`} d={`M ${xb} 400 L ${xt} 348`} stroke="#7a5a30" strokeWidth={3} opacity={0.85} fill="none" />;
          })}
          <path d="M 831 382 L 930 382" stroke="#7a5a30" strokeWidth={2} opacity={0.5} fill="none" />
          {/* inner glass gleam */}
          <polygon points="846,396 868,396 884,352 858,352" fill="#fff4d6" opacity={0.3} />
          {/* roof */}
          <rect x={818} y={340} width={124} height={10} rx={3} fill="#1d3156" />
          <rect x={818} y={338} width={124} height={3} fill="#3a5580" opacity={0.7} />
          {/* satellite dish on the right of the roof */}
          <g id="parabole">
            <path d="M 928 336 L 928 320" stroke="#1d3156" strokeWidth={3} fill="none" />
            <ellipse cx={936} cy={314} rx={13} ry={9} fill="#2a3f66" stroke="#46648c" strokeWidth={1.2} transform="rotate(-28 936 314)" />
            <circle cx={930} cy={310} r={2} fill="#7fa1d4" />
          </g>
          {/* radar mast + red beacon + concentric red waves */}
          <g id="radar">
            <rect x={877} y={292} width={6} height={48} fill="#2a4068" />
            <rect x={873} y={334} width={14} height={6} rx={2} fill="#1d3156" />
            {/* antenna panel */}
            <path d="M 846 296 Q 880 282 914 296 L 914 302 Q 880 289 846 302 Z" fill="#2a3f66" stroke="#46648c" strokeWidth={1} />
            <path
              d="M 851 297 V 289 M 858 295 V 287 M 865 293.5 V 285 M 872 292.5 V 284 M 880 292 V 283.5 M 888 292.5 V 284 M 895 293.5 V 285 M 902 295 V 287 M 909 297 V 289"
              stroke="#5a7bab" strokeWidth={1.4} fill="none" opacity={0.9}
            />
            <path d="M 846 290 Q 880 276 914 290" stroke="#7fa1d4" strokeWidth={1.2} opacity={0.8} fill="none" />
            {/* red beacon */}
            <circle cx={880} cy={268} r={26} fill="url(#af_red_glow)" opacity={0.55} />
            <rect x={877.5} y={272} width={5} height={12} fill="#1d3156" />
            <circle cx={880} cy={267} r={7} fill="#ff5a4d" />
            <circle cx={878} cy={265} r={2.6} fill="#ffd0cb" />
            {/* concentric radio waves */}
            <g stroke="#ff5a4d" fill="none" strokeLinecap="round">
              <path d="M 862 258 A 22 22 0 0 0 862 278" strokeWidth={2.6} opacity={0.75} />
              <path d="M 851 250 A 36 36 0 0 0 851 286" strokeWidth={2.2} opacity={0.45} />
              <path d="M 841 243 A 49 49 0 0 0 841 293" strokeWidth={2} opacity={0.25} />
              <path d="M 898 258 A 22 22 0 0 1 898 278" strokeWidth={2.6} opacity={0.75} />
              <path d="M 909 250 A 36 36 0 0 1 909 286" strokeWidth={2.2} opacity={0.45} />
              <path d="M 919 243 A 49 49 0 0 1 919 293" strokeWidth={2} opacity={0.25} />
            </g>
          </g>
          {/* faint pool of tower light at its base */}
          <ellipse cx={880} cy={720} rx={110} ry={13} fill="url(#af_warm_pool)" opacity={0.4} />
        </g>

        {/* ================= VEHICULE DE PISTE (sans chauffeur) ================= */}
        <g id="vehicule_piste" transform="translate(742 776)">
          <ellipse cx={0} cy={17} rx={50} ry={8} fill="url(#af_warm_pool)" opacity={0.6} />
          <ellipse cx={0} cy={15} rx={38} ry={3.5} fill="#0a1430" opacity={0.6} />
          {/* trailer / flatbed */}
          <rect x={-46} y={2} width={26} height={7} rx={1.5} fill="#16244a" stroke="#0e1b38" strokeWidth={0.8} />
          <rect x={-44} y={-3} width={20} height={5} rx={1} fill="#1c2f57" />
          <circle cx={-38} cy={11} r={5} fill="#101d3d" stroke="#2a3f66" strokeWidth={1} />
          <circle cx={-38} cy={11} r={1.8} fill="#2a3f66" />
          <path d="M -20 6 L -14 6" stroke="#16244a" strokeWidth={2} fill="none" />
          {/* tug body */}
          <path d="M -14 8 L -14 -4 L 4 -4 L 8 -16 L 26 -16 L 28 -13 L 28 8 Z" fill="#2a3f66" stroke="#0e1b38" strokeWidth={1} />
          <path d="M -14 -4 L 4 -4 L 4 0 L -14 0 Z" fill="#324a75" />
          {/* cab glass — empty, no driver */}
          <path d="M 9.5 -14 L 24.5 -14 L 24.5 -6 L 6.5 -6 Z" fill="#101d3d" />
          <line x1={11} y1={-13} x2={15} y2={-7} stroke="#6f8fc0" strokeWidth={1.2} opacity={0.45} />
          <rect x={-12} y={4} width={38} height={4} fill="#16244a" />
          {/* wheels */}
          <circle cx={-4} cy={9} r={5.5} fill="#101d3d" stroke="#2a3f66" strokeWidth={1.2} />
          <circle cx={-4} cy={9} r={2} fill="#2a3f66" />
          <circle cx={19} cy={9} r={5.5} fill="#101d3d" stroke="#2a3f66" strokeWidth={1.2} />
          <circle cx={19} cy={9} r={2} fill="#2a3f66" />
          {/* headlight */}
          <rect x={27} y={-3} width={2.5} height={4} rx={1} fill="#f5e0b8" />
          <ellipse cx={33} cy={-1} rx={5} ry={3} fill="#f5e0b8" opacity={0.25} />
          {/* amber beacon on cab roof */}
          <circle cx={16} cy={-19} r={9} fill="url(#light_glow)" opacity={0.7} />
          <rect x={13.5} y={-19.5} width={5} height={3.5} rx={1.2} fill="#ffb020" />
          <rect x={12.5} y={-16.5} width={7} height={1.5} fill="#16244a" />
          {/* moonlit rim */}
          <line x1={-13} y1={-4.6} x2={4} y2={-4.6} stroke="#6f8fc0" strokeWidth={1} opacity={0.6} />
          <line x1={8} y1={-16.6} x2={26} y2={-16.6} stroke="#6f8fc0" strokeWidth={1} opacity={0.6} />
        </g>

        {/* ================= AVION AU ROULAGE (sans pilote) ================= */}
        <g id="avion" transform="translate(890 790) scale(1.05)">
          <ellipse cx={0} cy={15} rx={62} ry={8} fill="url(#af_warm_pool)" opacity={0.5} />
          <ellipse cx={0} cy={13.5} rx={48} ry={3} fill="#0a1430" opacity={0.6} />
          {/* landing gear */}
          <path d="M 30 4 L 30 10.5" stroke="#101c38" strokeWidth={1.6} fill="none" />
          <circle cx={30} cy={11.8} r={2.2} fill="#0b1530" stroke="#2a3f66" strokeWidth={0.7} />
          <path d="M -8 4 L -8 10.5" stroke="#101c38" strokeWidth={1.6} fill="none" />
          <circle cx={-9.6} cy={11.8} r={2.3} fill="#0b1530" stroke="#2a3f66" strokeWidth={0.7} />
          <circle cx={-6.2} cy={11.8} r={2.3} fill="#0b1530" stroke="#2a3f66" strokeWidth={0.7} />
          {/* far wing */}
          <path d="M 2 -3.5 L -16 -8.5 L -18 -9.2 L -16.4 -7.2 L -2 -3 Z" fill="#16213a" />
          {/* tail */}
          <path d="M -25 -3.4 L -34 -14.5 C -34.4 -15.2 -35.6 -15.4 -36.2 -14.9 L -40 -2.4 C -35.5 -3.2 -29.5 -3.4 -25 -3.4 Z" fill="#24385f" />
          <path d="M -31.5 -2.4 L -41.5 -6 L -43 -5.8 L -40.8 -4.2 L -34 -1.4 Z" fill="#1b2c50" />
          {/* fuselage */}
          <path d="M 45 0.4 C 44.3 -1.4 42.4 -2.9 39 -3.5 C 26 -3.85 -9 -3.85 -23 -3.7 C -29 -3.55 -35.5 -2.8 -40.3 -1.7 C -40.7 -1.5 -40.7 -1.1 -40.2 -0.9 C -34.5 0.1 -27.5 2 -21.5 3.7 C -4.5 4 21.5 4 32 3.8 C 37.5 3.55 43 2.2 45 0.4 Z" fill="#2f4670" />
          <path d="M 39 -3.5 C 26 -3.85 -9 -3.85 -23 -3.7" stroke="#4a6aa0" strokeWidth={0.5} fill="none" opacity={0.65} />
          {/* cockpit — dark glass, nobody visible */}
          <path d="M 42 -1.7 L 38.5 -3 L 37.2 -2.3 L 40.9 -0.9 C 41.6 -1.1 41.9 -1.4 42 -1.7 Z" fill="#0b1732" />
          {/* near wing */}
          <path d="M 10 1.3 L -16.5 8.6 C -18.7 9.3 -20.1 9.8 -20.3 10.1 C -20.4 10.4 -19.6 10.4 -18.4 10.1 L -1.5 3.9 C 2.5 3.1 7 2 10 1.3 Z" fill="#35507f" />
          {/* engine */}
          <rect x={2} y={4.6} width={9} height={3.8} rx={1.9} fill="#1b2c50" />
          <ellipse cx={10.6} cy={6.5} rx={0.9} ry={1.8} fill="#0a1428" stroke="#3d5a8c" strokeWidth={0.4} />
          {/* windows */}
          <g fill="#ffdf9e">
            {[-18, -14.5, -11, -7.5, -4, -0.5, 3, 6.5, 10, 13.5, 17, 20.5, 24, 27.5].map((hx, i) => (
              <circle key={`hb-${i}`} cx={hx} cy={-0.9} r={0.55} opacity={0.4 + (i % 3) * 0.2} />
            ))}
          </g>
          {/* nav lights */}
          <circle cx={-19.8} cy={9.8} r={2.4} fill="url(#af_red_glow)" />
          <circle cx={-19.8} cy={9.8} r={0.8} fill="#ff5a4d" />
          <circle cx={-17.6} cy={-8.8} r={2.2} fill="#7de08a" opacity={0.25} />
          <circle cx={-17.6} cy={-8.8} r={0.7} fill="#7de08a" />
          <circle cx={5} cy={-4.2} r={1.6} fill="#ff5a4d" opacity={0.25} />
          <circle cx={5} cy={-4.2} r={0.5} fill="#ff5a4d" />
          <circle cx={-40.5} cy={-1.3} r={0.6} fill="#fff6e6" />
        </g>

        {/* ================= MANCHE A AIR (couleurs Niger) ================= */}
        <g id="manche_air">
          <ellipse cx={1672} cy={1032} rx={44} ry={9} fill="#0c1834" opacity={0.8} />
          <rect x={1666} y={786} width={9} height={246} fill="#33517e" />
          <rect x={1668} y={786} width={2.5} height={246} fill="#6f8fc0" opacity={0.6} />
          <circle cx={1670.5} cy={782} r={8} fill="none" stroke="#46648c" strokeWidth={3.5} />
          {/* small light at the mast top */}
          <circle cx={1670.5} cy={770} r={13} fill="url(#light_glow)" opacity={0.8} />
          <circle cx={1670.5} cy={770} r={4} fill="#ffd98a" />
          {/* sock pointing left, slight droop at the tip — Niger: orange at ring, white + orange disc, green tip */}
          <g id="manche_cone">
            <polygon points="1662,776 1662,812 1616,810 1616,780" fill="#E05206" />
            <polygon points="1616,780 1616,810 1570,809 1570,784" fill="#f4f2ec" />
            <circle cx={1593} cy={796} r={8.5} fill="#E05206" />
            <polygon points="1570,784 1570,809 1524,807 1524,789" fill="#0DB02B" />
            <polygon points="1524,789 1524,807 1482,804 1482,793" fill="#0a8c22" />
            {/* subtle shading to give the cone volume */}
            <polygon points="1662,776 1662,788 1482,796 1482,793 1570,784 1616,780" fill="#ffffff" opacity={0.14} />
            <polygon points="1662,802 1662,812 1616,810 1570,809 1524,807 1482,804 1482,800" fill="#04091a" opacity={0.25} />
          </g>
        </g>

        {/* ================= ATMOSPHERE FINALE ================= */}
        <rect x={0} y={0} width={1920} height={1080} fill="url(#af_vignette)" />
      </svg>
    </AbsoluteFill>
  );
};

export default GazoducAeroportFable5Test;
