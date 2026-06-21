/**
 * SvgTokenCompare — SCENE JETABLE : compare les jetons SVG generes par Gemini 3.1 Pro vs GPT-5.5.
 * Le contenu interieur de chaque jeton est colle depuis /tmp/carto-v5/svg-{gemini,gpt}.txt (f -> frame).
 * Fond navy + hexagones cadres, 2 rangees (Gemini / GPT), 5 colonnes (gas/oil/sonar/export/reserve).
 * A SUPPRIMER apres jugement.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";

const { fontFamily: BEBAS } = loadBebas();
const NAVY = "#16213a", GOLD = "#c8a951", IVORY = "#f2efe6";

const hexPoints = (r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

const Hex: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <g>
    <polygon points={hexPoints(60)} fill={NAVY} stroke={GOLD} strokeWidth={3} />
    {children}
  </g>
);

// ── GEMINI tokens (f -> frame) ──────────────────────────────────────────────
const Gemini = {
  gas: (f: number) => (
    <g>
      <path d="M-6,15 L6,15 L6,25 L-6,25 Z M-8,12 L8,12 L8,15 L-8,15 Z" fill={IVORY} />
      <g transform={`translate(0, 15) scale(${1 + 0.05 * Math.sin(f / 6)}, ${1 + 0.08 * Math.cos(f / 9)}) rotate(${3 * Math.sin(f / 12)})`}>
        <path d="M0,0 C12,-15 15,-25 10,-35 C5,-45 -5,-45 -10,-35 C-15,-25 -12,-15 0,0 Z" fill={GOLD} />
      </g>
      <g transform={`translate(0, 15) scale(${1 + 0.08 * Math.cos(f / 7)}, ${1 + 0.1 * Math.sin(f / 10)}) rotate(${-2 * Math.sin(f / 11)})`}>
        <path d="M0,0 C6,-8 7.5,-15 5,-22 C2.5,-28 -2.5,-28 -5,-22 C-7.5,-15 -6,-8 0,0 Z" fill={IVORY} />
      </g>
    </g>
  ),
  oil: (f: number) => (
    <g>
      <g transform={`translate(0, ${-5 + 3 * Math.sin(f / 15)}) scale(${1 + 0.02 * Math.cos(f / 10)})`}>
        <path d="M0,-15 Q12,5 12,15 A12,12 0 0,1 -12,15 Q-12,5 0,-15 Z" fill={GOLD} />
      </g>
      <ellipse cx="0" cy="25" rx={(f % 60) * 0.5} ry={(f % 60) * 0.15} stroke={GOLD} strokeWidth={2} fill="none" opacity={1 - (f % 60) / 60} />
      <ellipse cx="0" cy="25" rx={((f + 30) % 60) * 0.5} ry={((f + 30) % 60) * 0.15} stroke={GOLD} strokeWidth={2} fill="none" opacity={1 - ((f + 30) % 60) / 60} />
    </g>
  ),
  sonar: (f: number) => (
    <g>
      <circle cx="0" cy="0" r="35" stroke={GOLD} strokeWidth={1} strokeDasharray="4 4" opacity={0.4} fill="none" />
      <circle cx="0" cy="0" r="17.5" stroke={GOLD} strokeWidth={1} strokeDasharray="2 4" opacity={0.3} fill="none" />
      <circle cx="0" cy="0" r={(f % 90) * 0.4} stroke={IVORY} strokeWidth={1.5} fill="none" opacity={1 - (f % 90) / 90} />
      <circle cx="0" cy="0" r={((f + 45) % 90) * 0.4} stroke={IVORY} strokeWidth={1.5} fill="none" opacity={1 - ((f + 45) % 90) / 90} />
      <g transform={`rotate(${f * 3})`}>
        <line x1="0" y1="0" x2="0" y2="-35" stroke={IVORY} strokeWidth={2} />
        <polygon points="0,0 0,-35 -15,-31.5" fill={IVORY} opacity={0.2} />
      </g>
      <circle cx="0" cy="0" r="3" fill={GOLD} />
    </g>
  ),
  export: (f: number) => (
    <g>
      <circle cx="-20" cy="0" r="4" fill={IVORY} />
      <circle cx="-20" cy="0" r={4 + (f % 45) * 0.3} stroke={IVORY} fill="none" opacity={1 - (f % 45) / 45} strokeWidth={1.5} />
      <g transform="translate(-20,0) rotate(-25)">
        <line x1="5" y1="0" x2="35" y2="0" stroke={GOLD} strokeWidth={1.5} strokeDasharray="2 3" opacity={0.4} />
        <g transform={`translate(${5 + (f % 60) * 0.5}, 0)`} opacity={Math.sin(((f % 60) / 60) * Math.PI)}><polygon points="0,-3 6,0 0,3 2,0" fill={GOLD} /></g>
      </g>
      <g transform="translate(-20,0) rotate(25)">
        <line x1="5" y1="0" x2="35" y2="0" stroke={GOLD} strokeWidth={1.5} strokeDasharray="2 3" opacity={0.4} />
        <g transform={`translate(${5 + ((f + 20) % 60) * 0.5}, 0)`} opacity={Math.sin((((f + 20) % 60) / 60) * Math.PI)}><polygon points="0,-3 6,0 0,3 2,0" fill={GOLD} /></g>
      </g>
      <g transform="translate(-20,0)">
        <line x1="5" y1="0" x2="40" y2="0" stroke={GOLD} strokeWidth={1.5} strokeDasharray="2 3" opacity={0.4} />
        <g transform={`translate(${5 + ((f + 40) % 60) * 0.58}, 0)`} opacity={Math.sin((((f + 40) % 60) / 60) * Math.PI)}><polygon points="0,-4 8,0 0,4 2.5,0" fill={GOLD} /></g>
      </g>
    </g>
  ),
  reserve: (f: number) => (
    <g>
      <rect x="-15" y="-22" width="30" height="44" rx="4" stroke={IVORY} strokeWidth={2.5} fill={NAVY} />
      <rect x="-8" y="-26" width="16" height="4" rx="1" fill={IVORY} />
      <line x1="-15" y1="-11" x2="-8" y2="-11" stroke={IVORY} strokeWidth={1.5} />
      <line x1="-15" y1="0" x2="-8" y2="0" stroke={IVORY} strokeWidth={1.5} />
      <line x1="-15" y1="11" x2="-8" y2="11" stroke={IVORY} strokeWidth={1.5} />
      <rect x="-11" y={18 - 36 * (0.5 - 0.5 * Math.cos(f / 30))} width="22" height={36 * (0.5 - 0.5 * Math.cos(f / 30))} fill={GOLD} />
      <polygon points="20,0 26,-4 26,4" fill={GOLD} transform={`translate(0, ${18 - 36 * (0.5 - 0.5 * Math.cos(f / 30))})`} />
    </g>
  ),
};

// ── GPT-5.5 tokens (f -> frame) ─────────────────────────────────────────────
const Gpt = {
  gas: (f: number) => (
    <g strokeLinecap="round" strokeLinejoin="round">
      <g opacity={0.95}>
        <line x1="-10" y1="33" x2="-2" y2="-8" stroke={GOLD} strokeWidth={3} />
        <line x1="10" y1="33" x2="2" y2="-8" stroke={GOLD} strokeWidth={3} />
        <line x1="-8" y1="22" x2="8" y2="22" stroke={IVORY} strokeWidth={2} opacity={0.75} />
        <line x1="-6" y1="10" x2="6" y2="10" stroke={IVORY} strokeWidth={2} opacity={0.65} />
        <line x1="-4" y1="-2" x2="4" y2="-2" stroke={IVORY} strokeWidth={2} opacity={0.55} />
        <line x1="-7" y1="24" x2="5" y2="11" stroke={GOLD} strokeWidth={1.6} opacity={0.8} />
        <line x1="7" y1="24" x2="-5" y2="11" stroke={GOLD} strokeWidth={1.6} opacity={0.8} />
        <line x1="-4" y1="8" x2="4" y2="-3" stroke={GOLD} strokeWidth={1.5} opacity={0.7} />
        <line x1="4" y1="8" x2="-4" y2="-3" stroke={GOLD} strokeWidth={1.5} opacity={0.7} />
        <line x1="0" y1="-9" x2="0" y2="-15" stroke={IVORY} strokeWidth={3} />
        <line x1="-8" y1="-15" x2="8" y2="-15" stroke={IVORY} strokeWidth={3} />
      </g>
      <g transform={`translate(${1.1 * Math.sin(f / 9) + 0.5 * Math.sin(f / 17)} ${0.7 * Math.sin(f / 13)}) rotate(${3.2 * Math.sin(f / 11) + 1.4 * Math.sin(f / 19)}) scale(${1 + 0.035 * Math.sin(f / 8)})`}>
        <path d="M0 -37 C8 -29 7 -23 2 -18 C11 -21 14 -11 7 -5 C2 0 -8 -3 -10 -11 C-12 -19 -3 -23 0 -37Z" fill={GOLD} opacity={0.88 + 0.1 * Math.sin(f / 10)} />
        <path d="M1 -29 C5 -22 3 -18 -1 -14 C5 -15 8 -8 3 -4 C-1 -1 -6 -5 -6 -11 C-6 -17 -1 -21 1 -29Z" fill={IVORY} opacity={0.72 + 0.18 * Math.sin(f / 7 + 1.2)} />
      </g>
      <circle cx="0" cy="-15" r="2.3" fill={NAVY} stroke={GOLD} strokeWidth={1.7} />
    </g>
  ),
  oil: (f: number) => (
    <g strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="0" cy="25" rx="14" ry="3.5" fill="none" stroke={GOLD} strokeWidth={2} opacity={0.35 + 0.25 * Math.sin(f / 24)} />
      <ellipse cx="0" cy="25" rx="22" ry="4.5" fill="none" stroke={IVORY} strokeWidth={1.7} opacity={0.22 + 0.18 * Math.sin(f / 24 + 1.4)} />
      <ellipse cx="0" cy="25" rx="29" ry="5.2" fill="none" stroke={GOLD} strokeWidth={1.4} opacity={0.16 + 0.14 * Math.sin(f / 24 + 2.8)} />
      <g transform={`scale(${1 + 0.035 * Math.sin(f / 22)})`}>
        <path d="M0 -31 C10 -18 18 -8 18 4 C18 16 10 24 0 24 C-10 24 -18 16 -18 4 C-18 -8 -10 -18 0 -31Z" fill={NAVY} stroke={GOLD} strokeWidth={3} />
        <path d="M0 -24 C7 -14 12 -6 12 3 C12 11 7 17 0 17 C-7 17 -12 11 -12 3 C-12 -6 -7 -14 0 -24Z" fill={GOLD} opacity={0.78 + 0.12 * Math.sin(f / 22)} />
        <path d="M-5 -12 C-9 -5 -8 6 -2 11" fill="none" stroke={IVORY} strokeWidth={2} opacity={0.65} />
      </g>
      <circle cx="0" cy="4" r={2.2 + 0.7 * Math.sin(f / 18)} fill={IVORY} opacity={0.75} />
    </g>
  ),
  sonar: (f: number) => (
    <g strokeLinecap="round" strokeLinejoin="round">
      <circle cx="0" cy="0" r="3.8" fill={IVORY} />
      <circle cx="0" cy="0" r="7" fill="none" stroke={GOLD} strokeWidth={1.6} opacity={0.65} />
      <circle cx="0" cy="0" r={5 + 29 * ((f / 60) % 1)} fill="none" stroke={GOLD} strokeWidth={2} opacity={0.7 * (1 - ((f / 60) % 1))} />
      <circle cx="0" cy="0" r={5 + 29 * ((f / 60 + 0.33) % 1)} fill="none" stroke={IVORY} strokeWidth={1.6} opacity={0.55 * (1 - ((f / 60 + 0.33) % 1))} />
      <circle cx="0" cy="0" r={5 + 29 * ((f / 60 + 0.66) % 1)} fill="none" stroke={GOLD} strokeWidth={1.3} opacity={0.45 * (1 - ((f / 60 + 0.66) % 1))} />
      <g transform={`rotate(${f * 1.1})`} opacity={0.55}>
        <line x1="0" y1="0" x2="0" y2="-28" stroke={GOLD} strokeWidth={1.4} />
        <circle cx="0" cy="-28" r="1.7" fill={GOLD} />
      </g>
    </g>
  ),
  export: (f: number) => (
    <g strokeLinecap="round" strokeLinejoin="round">
      <circle cx="-29" cy="13" r="4.2" fill={NAVY} stroke={IVORY} strokeWidth={2} />
      <path d="M-29 13 C-14 15 -8 -6 5 -7 C16 -8 21 -16 28 -22" fill="none" stroke={IVORY} strokeWidth={6} opacity={0.18} />
      <path d="M-29 13 C-14 15 -8 -6 5 -7 C16 -8 21 -16 28 -22" fill="none" stroke={GOLD} strokeWidth={3.2} strokeDasharray="10 16" strokeDashoffset={-f * 0.85} opacity={0.78 + 0.12 * Math.sin(f / 20)} />
      <path d="M-23 12 C-10 11 -6 -2 5 -3 C14 -4 19 -11 24 -17" fill="none" stroke={IVORY} strokeWidth={1.4} strokeDasharray="5 14" strokeDashoffset={-f * 0.55} opacity={0.7} />
      <polygon points="28,-22 16,-20 23,-11" fill={GOLD} opacity={0.9 + 0.08 * Math.sin(f / 18)} />
      <polygon points="24,-21 18,-20 22,-16" fill={IVORY} opacity={0.65} />
      <g transform={`translate(${1.8 * Math.sin(f / 26)} ${-1.2 * Math.sin(f / 21)})`}>
        <circle cx="-11" cy="2" r="2" fill={GOLD} opacity={0.35 + 0.45 * Math.sin(f / 30) * Math.sin(f / 30)} />
        <circle cx="8" cy="-8" r="1.7" fill={IVORY} opacity={0.25 + 0.4 * Math.sin(f / 30 + 1.1) * Math.sin(f / 30 + 1.1)} />
      </g>
    </g>
  ),
  reserve: (f: number) => (
    <g strokeLinecap="round" strokeLinejoin="round">
      <rect x="-15" y={16 - 28 * (0.55 + 0.35 * Math.sin(f / 30))} width="30" height={28 * (0.55 + 0.35 * Math.sin(f / 30))} fill={GOLD} opacity={0.68} />
      <ellipse cx="0" cy={16 - 28 * (0.55 + 0.35 * Math.sin(f / 30))} rx="15" ry="3.8" fill={IVORY} opacity={0.35 + 0.15 * Math.sin(f / 30)} />
      <line x1="-18" y1="-18" x2="-18" y2="16" stroke={GOLD} strokeWidth={2.5} />
      <line x1="18" y1="-18" x2="18" y2="16" stroke={GOLD} strokeWidth={2.5} />
      <ellipse cx="0" cy="-18" rx="18" ry="6" fill={NAVY} stroke={IVORY} strokeWidth={2} />
      <ellipse cx="0" cy="16" rx="18" ry="6" fill="none" stroke={GOLD} strokeWidth={2.5} />
      <path d="M-18 16 C-10 22 10 22 18 16" fill="none" stroke={IVORY} strokeWidth={1.5} opacity={0.6} />
      <line x1="-12" y1="-6" x2="12" y2="-6" stroke={NAVY} strokeWidth={1.5} opacity={0.45} />
      <line x1="-12" y1="4" x2="12" y2="4" stroke={NAVY} strokeWidth={1.5} opacity={0.38} />
    </g>
  ),
};

const COLS = ["gas", "oil", "sonar", "export", "reserve"] as const;

export const SvgTokenCompare: React.FC = () => {
  const frame = useCurrentFrame();
  const cellW = 360, cellH = 360;
  const x0 = 180, y0 = 240;
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <svg width={1920} height={1080}>
        <text x={60} y={90} fontFamily={BEBAS} fontSize={56} fill={IVORY} letterSpacing={2}>JETONS SVG — GEMINI 3.1 PRO (haut) vs GPT-5.5 (bas)</text>
        {COLS.map((k, i) => (
          <text key={k} x={x0 + i * cellW} y={180} fontFamily={BEBAS} fontSize={32} fill={GOLD} textAnchor="middle" letterSpacing={1}>{k.toUpperCase()}</text>
        ))}
        {/* rangee Gemini */}
        {COLS.map((k, i) => (
          <g key={`gem-${k}`} transform={`translate(${x0 + i * cellW}, ${y0})`}>
            <Hex>{Gemini[k](frame)}</Hex>
          </g>
        ))}
        <text x={60} y={y0 + 6} fontFamily={BEBAS} fontSize={28} fill={IVORY} opacity={0.7}>GEMINI</text>
        {/* rangee GPT */}
        {COLS.map((k, i) => (
          <g key={`gpt-${k}`} transform={`translate(${x0 + i * cellW}, ${y0 + cellH + 60})`}>
            <Hex>{Gpt[k](frame)}</Hex>
          </g>
        ))}
        <text x={60} y={y0 + cellH + 66} fontFamily={BEBAS} fontSize={28} fill={IVORY} opacity={0.7}>GPT-5.5</text>
      </svg>
    </AbsoluteFill>
  );
};

export const SVG_TOKEN_COMPARE_FRAMES = 240;
export default SvgTokenCompare;
