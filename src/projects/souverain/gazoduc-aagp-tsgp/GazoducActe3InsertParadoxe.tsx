// GazoducActe3InsertParadoxe — Acte 3, SEGMENT C, clôture "paradoxe" Maroc/Algérie, 527f/17.57s.
//
// V3 (2026-08-07) — REFONTE APRÈS VERDICT AZIZ : "on a le côté gauche qui montre tout simplement la
// même carte avec deux lignes différentes. Cela ne veut rien dire [...] complètement à refaire."
// 3 DA-briefs critiques (Gemini+Kimi+DeepSeek) UNANIMES (cf PLAN-ACTES2-5.md § SEGMENT C) :
//   - GARDER le split-screen (les 3 voix le confirment, ce n'est PAS le dispositif qui est fautif).
//   - Le vrai problème : chaque fenêtre ne montrait QUE la géographie, jamais le PARADOXE À 2 AXES
//     par camp (Maroc = stabilité sécuritaire MAIS dépendance financière ; Algérie = autonomie
//     financière MAIS instabilité sécuritaire). 2 cartes cosmétiquement différentes ≠ un paradoxe visible.
// Dispositif retenu (convergence quasi totale) : transformer chaque fenêtre en "tableau de bord de
// tension" — 2 indicateurs par camp (force + faiblesse), calés sur les CLAUSES GRAMMATICALES exactes
// du texte ("mais suspendu" = un beat visuel, "zone de conflit" = un autre beat visuel).
//   - Maroc : tracé qui s'arrête à ~85% + se fige en pointillé sur "suspendu" (barre Financement qui
//     se BRISE) / barre Sécurité pleine et stable dès "pacifié".
//   - Algérie : tracé qui TREMBLE sur "zone de conflit" (shake déjà prouvé ailleurs dans ce projet,
//     cf GazoducActe3InsertSecurite shakeX/Y) / barre Autonomie pleine et fixe (contraste avec le
//     tremblement) dès "propres fonds".
// Cadrage caméra par pays inchangé (2 fenêtres SVG indépendantes, bug de chevauchement géographique
// Maroc/Algérie déjà corrigé le 2026-08-07, cf commentaire historique conservé plus bas).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import geoData from "../../_rnd/d3-16x9/gazoducGeoElargie.json";
import { BEATS_C, GAZODUC_A3_INSERT_PARADOXE_FRAMES } from "./GazoducActe3Timing";

export const GAZODUC_A3_INSERT_PARADOXE_FRAMES_EXPORT = GAZODUC_A3_INSERT_PARADOXE_FRAMES;

const W = 1920;
const H = 1080;
const HALF_W = W / 2;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const S = (sec: number) => Math.round(sec * 30);
const BG_TOP = "#3a5488";
const BG_BOT = "#2a3f66";
const LAND = "#4a608e";
const LAND_STROKE = "#e8ecf5";
const GOLD = "#FFC742";
const CYAN = "#00C4FF";
const B = BEATS_C;

type CountryGeo = { name: string; d: string };
const countries = geoData.countries as CountryGeo[];
const byName = (name: string) => countries.find((c) => c.name === name);

const AAGP_NAMES = [
  "Nigeria", "Benin", "Togo", "Ghana", "Côte d'Ivoire", "Liberia", "Sierra Leone",
  "Guinea", "Guinea-Bissau", "Gambia", "Senegal", "Mauritania", "Morocco",
] as const;
const TSGP_NAMES = ["Nigeria", "Niger", "Algeria"] as const;
const aagpCountries = AAGP_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c);
const tsgpCountries = TSGP_NAMES.map((n) => byName(n)).filter((c): c is CountryGeo => !!c);

function bboxCentroid(d: string): [number, number] {
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}
function bbox(d: string): [number, number, number, number] {
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return [minX, minY, maxX, maxY];
}
const aagpJalons = aagpCountries.map((c) => bboxCentroid(c.d));
const tsgpJalons = tsgpCountries.map((c) => bboxCentroid(c.d));

function ctrlOf(a: [number, number], b: [number, number], bendPerp: number): [number, number] {
  const mx = a[0] + (b[0] - a[0]) * 0.5, my = a[1] + (b[1] - a[1]) * 0.5;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  return [mx + (-dy / len) * bendPerp, my + (dx / len) * bendPerp];
}
function quadD(a: [number, number], ctrl: [number, number], b: [number, number]): string {
  return `M ${a[0]} ${a[1]} Q ${ctrl[0]} ${ctrl[1]} ${b[0]} ${b[1]}`;
}
function quadLen(a: [number, number], ctrl: [number, number], b: [number, number], samples = 40): number {
  let total = 0; let prev = a;
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const x = (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * ctrl[0] + t * t * b[0];
    const y = (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * ctrl[1] + t * t * b[1];
    total += Math.hypot(x - prev[0], y - prev[1]); prev = [x, y];
  }
  return total;
}
const aagpSegs = aagpJalons.slice(0, -1).map((a, i) => {
  const b = aagpJalons[i + 1];
  const ctrl = ctrlOf(a, b, -18);
  return { d: quadD(a, ctrl, b), len: quadLen(a, ctrl, b) };
});
const tsgpSegs = tsgpJalons.slice(0, -1).map((a, i) => {
  const b = tsgpJalons[i + 1];
  const ctrl = ctrlOf(a, b, 14);
  return { d: quadD(a, ctrl, b), len: quadLen(a, ctrl, b) };
});

// ===== Cadrage indépendant par pays — chaque fenêtre centre et zoome sur SON pays entier (bbox),
// avec une marge, pour qu'il soit toujours visible en intégralité dans sa moitié d'écran. Corrige le
// bug diagnostiqué au mini-render (2026-08-07) : Maroc/Algérie se chevauchent en X sur cette
// projection, un rideau vertical unique sur une carte continue coupait le territoire algérien en 2. =====
function fitCam(targetBbox: [number, number, number, number], viewW: number, viewH: number, marginFactor = 1.6) {
  const [minX, minY, maxX, maxY] = targetBbox;
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const spanX = Math.max(20, (maxX - minX) * marginFactor);
  const spanY = Math.max(20, (maxY - minY) * marginFactor);
  const scale = Math.min(viewW / spanX, viewH / spanY);
  return { scale, tx: viewW / 2 - cx * scale, ty: viewH / 2 - cy * scale };
}
const MOROCCO_BBOX = bbox((byName("Morocco") as CountryGeo).d);
const ALGERIA_BBOX = bbox((byName("Algeria") as CountryGeo).d);
const CAM_MAROC = fitCam(MOROCCO_BBOX, HALF_W, H, 2.4);
const CAM_ALGERIE = fitCam(ALGERIA_BBOX, HALF_W, H, 2.0);

// ===== Barre-jauge de tension — pleine/stable OU brisée/fragmentée, avec icône et libellé intégrés
// (jamais un cartouche de texte séparé, retour DA-brief : "les cartouches sont la preuve que le
// visuel a échoué"). =====
const BarreTension: React.FC<{
  x: number; y: number; width: number; color: string; label: string;
  reveal: number; broken: boolean; breakProgress: number; tremble: boolean; frame: number;
}> = ({ x, y, width, color, label, reveal, broken, breakProgress, tremble, frame }) => {
  if (reveal <= 0.01) return null;
  const trembleX = tremble ? Math.sin(frame * 2.3) * 3 * reveal : 0;
  const trembleY = tremble ? Math.cos(frame * 1.7) * 1.5 * reveal : 0;
  const barW = width * reveal;
  const gapStart = broken ? barW * 0.42 : barW;
  const gapEnd = broken ? barW * 0.58 : barW;
  return (
    <g transform={`translate(${x + trembleX} ${y + trembleY})`}>
      {/* Icône intégrée : cadenas simple (broken) ou coche pleine (stable), formes géométriques pures */}
      {broken ? (
        <g opacity={interpolate(breakProgress, [0, 0.3], [0, 1], clampB)}>
          <rect x={-28} y={-8} width={14} height={11} rx={2} fill="none" stroke={color} strokeWidth={2} />
          <path d={`M -25 -8 L -25 -14 A 4 4 0 0 1 -17 -14 L -17 ${-8 - breakProgress * 4}`} fill="none" stroke={color} strokeWidth={2} />
        </g>
      ) : (
        <path d="M -28 -2 L -23 4 L -14 -8" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={reveal} />
      )}
      <rect x={0} y={-6} width={gapStart} height={12} rx={3} fill={color} opacity={0.85} />
      {broken && breakProgress > 0.15 && (
        <rect x={gapEnd + (barW - gapEnd) * 0} y={-6} width={Math.max(0, barW - gapEnd)} height={12} rx={3} fill={color} opacity={0.85} />
      )}
      <text x={0} y={22} fill="#e8ecf5" fontSize={14} fontFamily="'IBM Plex Mono', monospace" letterSpacing="0.08em" opacity={0.85}>
        {label}
      </text>
    </g>
  );
};

export const GazoducActe3InsertParadoxe: React.FC = () => {
  const frame = useCurrentFrame();
  const globalFade = interpolate(frame, [0, S(0.5), B.segEnd + 9 - S(0.4), B.segEnd + 9], [0, 1, 1, 0], clampB);

  const continentReveal = interpolate(frame, [0, S(0.6)], [0, 1], clampB);

  const leftReveal = interpolate(frame, [B.marocStart, B.marocStart + S(1.2)], [0, 1], clampB);
  const rightSlideIn = interpolate(frame, [B.algerieStart, B.algerieStart + S(1.2)], [HALF_W, 0], {
    ...clampB, easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const rightReveal = interpolate(frame, [B.algerieStart, B.algerieStart + S(1.2)], [0, 1], clampB);

  // ===== Maroc : tracé qui s'arrête à ~85%, calé sur "pacifié" puis "suspendu" =====
  const marocTraceReveal = interpolate(frame, [B.marocStart, B.marocPacifieEnd], [0, 0.85], clampB);
  const marocSecuriteReveal = interpolate(frame, [B.marocStart, B.marocStart + S(0.8)], [0, 1], clampB);
  // "Financement" se brise exactement sur "suspendu" (fin de marocPhraseEnd = fin de la clause).
  const marocFinanceReveal = interpolate(frame, [B.marocPacifieEnd, B.marocPacifieEnd + S(0.5)], [0, 1], clampB);
  const marocBreakProgress = interpolate(frame, [B.marocPacifieEnd + S(0.4), B.marocPhraseEnd], [0, 1], clampB);

  // ===== Algérie : tracé qui TREMBLE sur "zone de conflit", autonomie pleine dès "propres fonds" =====
  const algerieTraceReveal = interpolate(frame, [B.algerieStart, B.conflitPhraseEnd], [0, 1], clampB);
  const algerieAutonomieReveal = interpolate(frame, [B.algerieStart, B.algerieStart + S(0.8)], [0, 1], clampB);
  const algerieSecuriteReveal = interpolate(frame, [B.algerieStart + S(2.5), B.algerieStart + S(3.3)], [0, 1], clampB);
  const algerieTremble = frame >= B.algerieStart + S(2.5);

  return (
    <AbsoluteFill style={{ background: "#0e1424", opacity: globalFade }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: HALF_W, height: H, overflow: "hidden", opacity: leftReveal }}>
        <svg width={HALF_W} height={H} viewBox={`0 0 ${HALF_W} ${H}`} style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_BOT} 100%)` }}>
          <g transform={`translate(${CAM_MAROC.tx} ${CAM_MAROC.ty}) scale(${CAM_MAROC.scale})`}>
            {countries.map((c, i) => (
              <path key={`land-l-${i}`} d={c.d} fill={LAND} fillOpacity={0.5 * continentReveal}
                stroke={LAND_STROKE} strokeOpacity={0.32 * continentReveal} strokeWidth={0.5} />
            ))}
            {/* Tracé qui s'arrête net à 85% — l'interruption virtuelle EST "suspendu" (retour DA-brief) */}
            {aagpSegs.map((seg, i) => {
              const segT0 = i / aagpSegs.length, segT1 = (i + 1) / aagpSegs.length;
              const segReveal = interpolate(marocTraceReveal, [segT0, segT1], [0, 1], clampB);
              if (segReveal <= 0) return null;
              return <path key={`aagp-seg-${i}`} d={seg.d} fill="none" stroke={GOLD} strokeWidth={2.2} strokeLinecap="round"
                strokeDasharray={seg.len} strokeDashoffset={seg.len * (1 - segReveal)} />;
            })}
            {aagpCountries.map((c, i) => (
              <path key={`aagp-${i}`} d={c.d} fill={GOLD} fillOpacity={0.24} stroke={GOLD} strokeOpacity={0.75} strokeWidth={1} />
            ))}
          </g>
          <BarreTension x={70} y={100} width={260} color={GOLD} label="SÉCURITÉ · PACIFIÉ"
            reveal={marocSecuriteReveal} broken={false} breakProgress={0} tremble={false} frame={frame} />
          <BarreTension x={70} y={150} width={260} color={GOLD} label="FINANCEMENT · SUSPENDU"
            reveal={marocFinanceReveal} broken={true} breakProgress={marocBreakProgress} tremble={false} frame={frame} />
        </svg>
      </div>

      <div style={{
        position: "absolute", left: HALF_W + rightSlideIn, top: 0, width: HALF_W, height: H,
        overflow: "hidden", opacity: rightReveal,
      }}>
        <svg width={HALF_W} height={H} viewBox={`0 0 ${HALF_W} ${H}`} style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_BOT} 100%)` }}>
          <g transform={`translate(${CAM_ALGERIE.tx} ${CAM_ALGERIE.ty}) scale(${CAM_ALGERIE.scale}) translate(${algerieTremble ? Math.sin(frame * 2.3) * 3 : 0} ${algerieTremble ? Math.cos(frame * 1.7) * 1.5 : 0})`}>
            {countries.map((c, i) => (
              <path key={`land-r-${i}`} d={c.d} fill={LAND} fillOpacity={0.5 * continentReveal}
                stroke={LAND_STROKE} strokeOpacity={0.32 * continentReveal} strokeWidth={0.5} />
            ))}
            {tsgpSegs.map((seg, i) => {
              const segT0 = i / tsgpSegs.length, segT1 = (i + 1) / tsgpSegs.length;
              const segReveal = interpolate(algerieTraceReveal, [segT0, segT1], [0, 1], clampB);
              if (segReveal <= 0) return null;
              return <path key={`tsgp-seg-${i}`} d={seg.d} fill="none" stroke={CYAN} strokeWidth={2.2} strokeLinecap="round"
                strokeDasharray={seg.len} strokeDashoffset={seg.len * (1 - segReveal)} />;
            })}
            {tsgpCountries.map((c, i) => (
              <path key={`tsgp-${i}`} d={c.d} fill={CYAN} fillOpacity={0.24} stroke={CYAN} strokeOpacity={0.75} strokeWidth={1} />
            ))}
          </g>
          <BarreTension x={70} y={100} width={260} color={CYAN} label="AUTONOMIE · FONDS PROPRES"
            reveal={algerieAutonomieReveal} broken={false} breakProgress={0} tremble={false} frame={frame} />
          <BarreTension x={70} y={150} width={260} color={CYAN} label="SÉCURITÉ · ZONE DE CONFLIT"
            reveal={algerieSecuriteReveal} broken={false} breakProgress={0} tremble={algerieTremble} frame={frame} />
        </svg>
      </div>

      <div style={{
        position: "absolute", left: HALF_W - 1, top: 0, width: 2, height: H,
        background: "#e8ecf5", opacity: 0.3 * Math.min(leftReveal, rightReveal),
      }} />
    </AbsoluteFill>
  );
};

export default GazoducActe3InsertParadoxe;
