// ProtoCartePaletteGPT — PROTOTYPE COMPARATIF de fond de carte (2026-08-15).
//
// Question posee par Aziz : le fond de carte propose par GPT dans le storyboard de l'Acte 4 semble
// "plus premium" que celui qu'on utilise depuis le debut de la serie. Vrai ou impression ?
// Ce prototype met les deux COTE A COTE sur la MEME geometrie, les memes traces, les memes
// elements — seule la PALETTE DE FOND change. C'est la seule facon de juger honnetement.
//
// ⛔ Ce fichier ne touche a AUCUN fichier de production. Si la palette GPT est retenue, elle devra
// etre portee sur les Actes 1/2/3 deja produits (coherence de serie) — c'est un chantier a part
// entiere, a ne PAS engager sans decision explicite d'Aziz.
//
// Les 5 differences relevees a l'analyse du storyboard GPT (mesurees sur l'image, pas supposees) :
//   1. Fond BEAUCOUP plus sombre (bleu nuit profond vs notre bleu-gris moyen).
//   2. Pays inactifs a peine plus clairs que l'ocean (discrets) vs les notres, massifs.
//   3. Degrade RADIAL qui assombrit les bords (concentre le regard) vs notre degrade lineaire.
//   4. Frontieres fines et SOMBRES (murmurees) vs les notres, claires et appuyees.
//   5. Fleches directionnelles en bout de trace (absentes chez nous).
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import geoData from "./gazoducGeoElargie.json";

const W = 1920;
const H = 1080;
const FPS = 30;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const PROTO_CARTE_PALETTE_GPT_FRAMES = 8 * FPS;

type CountryGeo = { name: string; d: string };
const countries = geoData.countries as CountryGeo[];
const byName = (name: string) => countries.find((c) => c.name === name);

function bboxCentroid(d: string): [number, number] {
  const nums = d.match(/-?\d+(\.\d+)?/g);
  if (!nums) return [W / 2, H / 2];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = parseFloat(nums[i]), y = parseFloat(nums[i + 1]);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}
function ctrlOf(a: [number, number], b: [number, number], perp: number, t: number): [number, number] {
  const mx = a[0] + (b[0] - a[0]) * t, my = a[1] + (b[1] - a[1]) * t;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return [mx + (-dy / len) * perp, my + (dx / len) * perp];
}
function quadD(a: [number, number], c: [number, number], b: [number, number]): string {
  return `M ${a[0]} ${a[1]} Q ${c[0]} ${c[1]} ${b[0]} ${b[1]}`;
}

const NIGERIA = (geoData.centroids as unknown as Record<string, [number, number]>).Nigeria;
const TSGP_NAMES = ["Nigeria", "Niger", "Algeria"] as const;
const tsgpJalons: [number, number][] = TSGP_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c).map((c) => bboxCentroid(c.d));
const tsgpD = tsgpJalons.slice(0, -1).map((a, i) => quadD(a, ctrlOf(a, tsgpJalons[i + 1], 14, 0.5), tsgpJalons[i + 1])).join(" ");
const AAGP_NAMES = [
  "Nigeria", "Benin", "Togo", "Ghana", "Côte d'Ivoire", "Liberia", "Sierra Leone",
  "Guinea", "Guinea-Bissau", "Gambia", "Senegal", "Mauritania", "Morocco",
] as const;
const aagpJalons: [number, number][] = AAGP_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c).map((c) => bboxCentroid(c.d));
const aagpD = aagpJalons.slice(0, -1).map((a, i) => quadD(a, ctrlOf(a, aagpJalons[i + 1], -18, 0.5), aagpJalons[i + 1])).join(" ");

const ACTIVE = ["Nigeria", "Morocco", "Algeria"] as const;
const LABELS: Record<string, string> = { Nigeria: "NIGERIA", Morocco: "MAROC", Algeria: "ALGÉRIE" };

// Cadrage identique a celui de l'Acte 4 (bbox projetee calculee).
const FRAME_CENTER: [number, number] = [821.3, 237.7];
const FRAME_SCALE = 1.98;

// ===== LES DEUX PALETTES COMPAREES =====
type Palette = {
  key: string; label: string;
  bgTop: string; bgBot: string; radial: boolean;
  land: string; landOpacity: number;
  stroke: string; strokeOpacity: number; strokeWidth: number;
  active: string; activeOpacity: number; activeStroke: string;
};
// A — NOTRE palette de serie (Actes 1/2/3 deja produits).
const PAL_NOUS: Palette = {
  key: "nous", label: "A — NOTRE PALETTE (serie actuelle)",
  bgTop: "#3a5488", bgBot: "#2a3f66", radial: false,
  land: "#4a608e", landOpacity: 0.5,
  stroke: "#e8ecf5", strokeOpacity: 0.3, strokeWidth: 0.85,
  active: "#1EA7D7", activeOpacity: 0.46, activeStroke: "#53D7FF",
};
// B — Palette derivee du storyboard GPT (echantillonnee sur l'image, pas inventee).
// ⭐ RETENUE PAR AZIZ (2026-08-15) comme palette de l'Acte 4 et de la suite.
// Ajustement demande : frontieres "un tout petit peu plus lumineuses, pour que ca se voie un peu
// mieux" — stroke #3c5f80 -> #58809f et opacite 0.55 -> 0.72. Volontairement LEGER : le but reste
// des frontieres murmurees (c'est ce qui fait reculer le fond), juste un cran plus lisibles.
const PAL_GPT: Palette = {
  key: "gpt", label: "B — PALETTE GPT (storyboard Acte 4)",
  bgTop: "#0d1f38", bgBot: "#050c1a", radial: true,
  land: "#16304f", landOpacity: 0.92,
  stroke: "#58809f", strokeOpacity: 0.72, strokeWidth: 0.75,
  active: "#2E9FD4", activeOpacity: 0.72, activeStroke: "#7FD8FF",
};

const CarteVariante: React.FC<{ pal: Palette; frame: number; half: "left" | "right" }> = ({ pal, frame, half }) => {
  const draw = interpolate(frame, [10, 90], [0, 1], clampB);
  const cam = { scale: FRAME_SCALE, tx: W / 2 - FRAME_CENTER[0] * FRAME_SCALE, ty: H / 2 - FRAME_CENTER[1] * FRAME_SCALE };
  const screenOf = (p: [number, number]): [number, number] => [p[0] * cam.scale + cam.tx, p[1] * cam.scale + cam.ty];
  const len = 4000;
  const pulse = 1 + 0.08 * Math.sin((2 * Math.PI * frame) / 42);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id={`bg-${pal.key}`} cx="50%" cy="46%" r="72%">
          <stop offset="0%" stopColor={pal.bgTop} />
          <stop offset="100%" stopColor={pal.bgBot} />
        </radialGradient>
        <linearGradient id={`bgl-${pal.key}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pal.bgTop} />
          <stop offset="100%" stopColor={pal.bgBot} />
        </linearGradient>
        <filter id={`glow-${pal.key}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={`url(#${pal.radial ? `bg-${pal.key}` : `bgl-${pal.key}`})`} />
      <g transform={`translate(${cam.tx} ${cam.ty}) scale(${cam.scale})`}>
        {countries.map((c, i) => (
          <path key={`l-${i}`} d={c.d} fill={pal.land} fillOpacity={pal.landOpacity}
            stroke={pal.stroke} strokeOpacity={pal.strokeOpacity} strokeWidth={pal.strokeWidth} />
        ))}
        {ACTIVE.map((n) => {
          const c = byName(n);
          if (!c) return null;
          return <path key={`a-${n}`} d={c.d} fill={pal.active} fillOpacity={pal.activeOpacity}
            stroke={pal.activeStroke} strokeOpacity={0.5} strokeWidth={1.5} />;
        })}
        {[aagpD, tsgpD].map((d, i) => (
          <g key={`r-${i}`}>
            <path d={d} fill="none" stroke="#FFB020" strokeOpacity={0.3} strokeWidth={9 / cam.scale}
              strokeLinecap="round" filter={`url(#glow-${pal.key})`}
              strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
            <path d={d} fill="none" stroke="#FFC742" strokeOpacity={0.92} strokeWidth={3.4 / cam.scale}
              strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
          </g>
        ))}
        <circle cx={NIGERIA[0]} cy={NIGERIA[1]} r={(26 * pulse) / cam.scale} fill="none"
          stroke="#2DE6FF" strokeWidth={3 / cam.scale} opacity={0.7} />
        <circle cx={NIGERIA[0]} cy={NIGERIA[1]} r={9 / cam.scale} fill="#DFFFFF" opacity={0.95} />
      </g>
      {ACTIVE.map((n) => {
        const c = byName(n);
        if (!c) return null;
        const [px, py] = screenOf(bboxCentroid(c.d));
        const label = LABELS[n];
        const wBox = label.length * 13 + 26;
        return (
          <g key={`lab-${n}`} transform={`translate(${px} ${py - 46})`}>
            <rect x={-wBox / 2} y={-17} width={wBox} height={30} rx={4}
              fill="#0a1626" fillOpacity={0.95} stroke={pal.activeStroke} strokeWidth={1.4} />
            <text x={0} y={4} textAnchor="middle" fill="#e8ecf5" fontSize={17} fontWeight={700}
              fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.08em">{label}</text>
          </g>
        );
      })}
      {/* Libelle : double taille, car la carte est affichee a 50% dans le split comparatif. */}
      <g>
        <rect x={24} y={24} width={860} height={72} rx={6}
          fill="#000000" fillOpacity={0.75} stroke={pal.activeStroke} strokeWidth={2} />
        <text x={48} y={73} fill="#e8ecf5" fontSize={34} fontWeight={700}
          fontFamily="'IBM Plex Mono', monospace">{pal.label}</text>
      </g>
    </svg>
  );
};

// Variantes PLEIN FORMAT — la finesse des frontieres et le grain du degrade ne se jugent pas sur un
// split a 50% (regle projet : la qualite visuelle se juge en full HD, jamais sur un rendu reduit).
export const ProtoCartePaletteNous: React.FC = () => (
  <AbsoluteFill><CarteVariante pal={PAL_NOUS} frame={useCurrentFrame()} half="left" /></AbsoluteFill>
);
export const ProtoCartePaletteGPTSeule: React.FC = () => (
  <AbsoluteFill><CarteVariante pal={PAL_GPT} frame={useCurrentFrame()} half="left" /></AbsoluteFill>
);

export const ProtoCartePaletteGPT: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Split ecran : meme scene, meme geometrie, meme timing — SEULE la palette differe. */}
      {/* ⛔ Chaque moitie doit montrer la MEME zone geographique, sinon on ne compare pas la palette
          mais deux cadrages. On affiche donc la scene ENTIERE dans chaque moitie, mise a l'echelle
          0.5 — pas une fenetre decoupee dans une scene pleine largeur (1re version : le split
          tombait au milieu du Nigeria et masquait le libelle de droite). */}
      {[PAL_NOUS, PAL_GPT].map((pal, i) => (
        <div key={pal.key} style={{
          position: "absolute", top: H / 4, left: i * (W / 2), width: W / 2, height: H / 2,
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", width: W, height: H, transform: "scale(0.5)", transformOrigin: "top left" }}>
            <CarteVariante pal={pal} frame={frame} half="left" />
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", left: W / 2 - 1, top: H / 4, width: 2, height: H / 2, background: "#FFC742", opacity: 0.85 }} />
      <div style={{
        position: "absolute", top: H / 4 - 62, left: 0, width: W, textAlign: "center",
        color: "#e8ecf5", fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 700,
        letterSpacing: "0.06em",
      }}>MÊME SCÈNE, MÊME CADRAGE — SEULE LA PALETTE DE FOND CHANGE</div>
    </AbsoluteFill>
  );
};

export default ProtoCartePaletteGPT;
