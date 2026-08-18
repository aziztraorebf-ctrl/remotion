// MOTEUR: carte D3 (split-screen) — dispositif hérité de GazoducActe3InsertParadoxe, conservé tel
// quel. Ce fichier n'invente aucun moteur : il RETIRE des éléments pour produire une image de brief.
//
// GazoducActe3SplitDepouille — VARIANTE DE TRAVAIL, R&D, NON DESTINÉE AU MONTAGE (2026-08-17).
//
// ⛔ CE N'EST PAS UN LIVRABLE. C'est le MATÉRIAU joint au brief de storyboard : le split-screen
// Maroc/Algérie débarrassé de ses béquilles, pour que les modèles voient le dispositif NU et
// proposent ce qui le tient 17 secondes.
//
// Verdict d'Aziz (2026-08-17) sur `GazoducActe3InsertParadoxe.tsx` (option A, préférée à l'option B
// "divergence des tracés" parce que le SPLIT NOMME LE SUJET PAR LE CADRE — quand la voix dit "le
// Maroc", un écran apparaît ; l'attribution est immédiate, ce que 2 lignes coexistantes ne font pas) :
//   1. Les 4 barres étiquetées ("SÉCURITÉ · PACIFIÉ", "FINANCEMENT · SUSPENDU", "AUTONOMIE · FONDS
//      PROPRES", "SÉCURITÉ · ZONE DE CONFLIT") ne représentent rien de réel — "ce n'est pas comme ça
//      qu'une jauge se remplit", "on passe en mode PowerPoint". RETIRÉES ICI.
//      → Converge avec le breakdown V5 (beat4-breakdown.json), qui INTERDIT le texte de statut :
//        `final_no_text_contrast_hold` = "le contraste doit être lisible sans explication textuelle".
//   2. Le tremblement de l'écran algérien est "gimmicky" — un territoire ne tremble pas. NEUTRALISÉ ICI.
//
// ⚠️ CE QUI RESTE À RÉSOUDRE, et c'est LA question du brief : les 4 barres portaient 4 informations
// (sécurité + financement pour le Maroc, autonomie + sécurité pour l'Algérie). Les retirer sans rien
// mettre à la place laisse 2 cartes côte à côte qui ne disent plus le PARADOXE. Ce fichier montre donc
// volontairement un dispositif INCOMPLET — c'est son objet.
//
// Tout le reste (timing audio-dérivé, cadrage par pays, ordre d'apparition, tracé Maroc qui s'arrête
// à 85%) est conservé À L'IDENTIQUE du fichier de production : on ne compare pas deux variables à la fois.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import geoData from "../d3-16x9/gazoducGeoElargie.json";
import { BEATS_C, GAZODUC_A3_INSERT_PARADOXE_FRAMES } from "../../souverain/gazoduc-aagp-tsgp/GazoducActe3Timing";

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
const aagpJalons = aagpCountries.map((c) => bboxCentroid(c.d));
const tsgpJalons = tsgpCountries.map((c) => bboxCentroid(c.d));
const aagpSegs = aagpJalons.slice(0, -1).map((a, i) => {
  const b2 = aagpJalons[i + 1];
  const ctrl = ctrlOf(a, b2, -18);
  return { d: quadD(a, ctrl, b2), len: quadLen(a, ctrl, b2) };
});
const tsgpSegs = tsgpJalons.slice(0, -1).map((a, i) => {
  const b2 = tsgpJalons[i + 1];
  const ctrl = ctrlOf(a, b2, 14);
  return { d: quadD(a, ctrl, b2), len: quadLen(a, ctrl, b2) };
});

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

export const GazoducActe3SplitDepouille: React.FC = () => {
  const frame = useCurrentFrame();
  const globalFade = interpolate(frame, [0, S(0.5), B.segEnd + 9 - S(0.4), B.segEnd + 9], [0, 1, 1, 0], clampB);
  const continentReveal = interpolate(frame, [0, S(0.6)], [0, 1], clampB);

  const leftReveal = interpolate(frame, [B.marocStart, B.marocStart + S(1.2)], [0, 1], clampB);
  const rightSlideIn = interpolate(frame, [B.algerieStart, B.algerieStart + S(1.2)], [HALF_W, 0], {
    ...clampB, easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const rightReveal = interpolate(frame, [B.algerieStart, B.algerieStart + S(1.2)], [0, 1], clampB);

  const marocTraceReveal = interpolate(frame, [B.marocStart, B.marocPacifieEnd], [0, 0.85], clampB);
  const algerieTraceReveal = interpolate(frame, [B.algerieStart, B.conflitPhraseEnd], [0, 1], clampB);
  // ⛔ `algerieTremble` SUPPRIMÉ (verdict Aziz : gimmicky). Le groupe algérien ne reçoit plus aucune
  // translation parasite — il est strictement immobile, comme le marocain.

  return (
    <AbsoluteFill style={{ background: "#0e1424", opacity: globalFade }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: HALF_W, height: H, overflow: "hidden", opacity: leftReveal }}>
        <svg width={HALF_W} height={H} viewBox={`0 0 ${HALF_W} ${H}`} style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_BOT} 100%)` }}>
          <g transform={`translate(${CAM_MAROC.tx} ${CAM_MAROC.ty}) scale(${CAM_MAROC.scale})`}>
            {countries.map((c, i) => (
              <path key={`land-l-${i}`} d={c.d} fill={LAND} fillOpacity={0.5 * continentReveal}
                stroke={LAND_STROKE} strokeOpacity={0.32 * continentReveal} strokeWidth={0.5} />
            ))}
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
          {/* ⛔ 2 BarreTension retirées ici (SÉCURITÉ · PACIFIÉ / FINANCEMENT · SUSPENDU). */}
        </svg>
      </div>

      <div style={{
        position: "absolute", left: HALF_W + rightSlideIn, top: 0, width: HALF_W, height: H,
        overflow: "hidden", opacity: rightReveal,
      }}>
        <svg width={HALF_W} height={H} viewBox={`0 0 ${HALF_W} ${H}`} style={{ background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_BOT} 100%)` }}>
          {/* ⛔ Le `translate(sin/cos)` de tremblement a été retiré de ce groupe. */}
          <g transform={`translate(${CAM_ALGERIE.tx} ${CAM_ALGERIE.ty}) scale(${CAM_ALGERIE.scale})`}>
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
          {/* ⛔ 2 BarreTension retirées ici (AUTONOMIE · FONDS PROPRES / SÉCURITÉ · ZONE DE CONFLIT). */}
        </svg>
      </div>

      <div style={{
        position: "absolute", left: HALF_W - 1, top: 0, width: 2, height: H,
        background: "#e8ecf5", opacity: 0.3 * Math.min(leftReveal, rightReveal),
      }} />
    </AbsoluteFill>
  );
};

export const GAZODUC_A3_SPLIT_DEPOUILLE_FRAMES = GAZODUC_A3_INSERT_PARADOXE_FRAMES;

export default GazoducActe3SplitDepouille;
