// MÉCANIQUE P5 — Split-screen 2/3 écrans (décodé Jacques a dit, frames jacques-split2/3).
//
// Technique AE/Geolayers générique (pas la sienne) : l'écran se DIVISE en 2 (ou 3 en horizontal) volets
// verticaux, chacun montrant une carte/donnée. Fait passer 2-3 infos EN MÊME TEMPS. Rôle = COMPARER/OPPOSER
// (2 dates, 2 acteurs, 2 scénarios ; ou 3 pays). Séparateur net qui "s'ouvre" (wipe) depuis le centre.
//
// Brique pure `SplitScreen` : reçoit N panneaux render-prop. Le slit s'ouvre par animation (volets qui
// glissent). Chaque panneau a son propre `project` recadré sur sa zone → vrai zoom indépendant par volet.

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { makeSahelProject, SahelFlatMap, SAND, ringToPath, type ProjectFn } from "./sandbox";
import { MALI_RING, BURKINA_RING, NIGER_RING } from "../../parties/sahelCountries";

export const P5_FRAMES = 220;

// ── Brique : split N panneaux. openAt/openDur = animation d'ouverture (wipe depuis centre). ──
export const SplitScreen: React.FC<{
  panels: ((w: number, h: number) => React.ReactNode)[];
  frame: number; openAt: number; openDur?: number; width: number; height: number;
  labels?: string[]; sepColor?: string;
}> = ({ panels, frame, openAt, openDur = 22, width, height, labels, sepColor = "#F4ECD8" }) => {
  const n = panels.length;
  const t = interpolate(frame, [openAt, openAt + openDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const pw = width / n;
  return (
    <AbsoluteFill>
      {panels.map((panel, i) => {
        // chaque volet glisse depuis l'extérieur vers sa place (effet "se met en place")
        const dir = i < n / 2 ? -1 : 1;
        const dx = (1 - t) * dir * pw * 0.5;
        return (
          <div key={i} style={{
            position: "absolute", left: i * pw, top: 0, width: pw, height,
            overflow: "hidden", transform: `translateX(${dx}px)`, opacity: t,
          }}>
            <div style={{ position: "absolute", left: -i * pw, top: 0, width, height }}>
              {panel(width, height)}
            </div>
            {/* voile latéral léger pour séparer les volets */}
            <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 60px rgba(40,28,14,0.25)", pointerEvents: "none" }} />
            {labels && labels[i] && (
              <div style={{
                position: "absolute", left: 0, right: 0, top: 24, textAlign: "center",
                fontFamily: "Georgia, serif", fontWeight: 800, fontSize: 24, color: SAND.INK,
                textShadow: "0 1px 3px rgba(244,236,216,0.9)", opacity: t,
              }}>{labels[i]}</div>
            )}
          </div>
        );
      })}
      {/* séparateurs nets */}
      {Array.from({ length: n - 1 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", left: (i + 1) * pw - 2, top: 0, width: 4, height,
          background: sepColor, opacity: t, boxShadow: "0 0 8px rgba(40,28,14,0.4)",
        }} />
      ))}
    </AbsoluteFill>
  );
};

// helper : carte Sahel avec un ensemble de zones rouges (état de contrôle à une "date")
const SahelStateMap: React.FC<{ width: number; height: number; redZones: { c: [number, number]; r: number }[] }> = ({ width, height, redZones }) => {
  const project = makeSahelProject(width, height);
  return (
    <AbsoluteFill>
      <SahelFlatMap project={project} width={width} height={height} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id={`clip${redZones.length}${Math.round(redZones[0]?.r ?? 0)}`}>
            <path d={ringToPath(MALI_RING, project)} />
            <path d={ringToPath(BURKINA_RING, project)} />
            <path d={ringToPath(NIGER_RING, project)} />
          </clipPath>
          <radialGradient id="rg">
            <stop offset="0%" stopColor="#9E2B2B" stopOpacity={0.9} />
            <stop offset="100%" stopColor={SAND.RED_WAR} stopOpacity={0} />
          </radialGradient>
        </defs>
        <g clipPath={`url(#clip${redZones.length}${Math.round(redZones[0]?.r ?? 0)})`}>
          {redZones.map((z, i) => {
            const p = project(z.c[0], z.c[1]);
            return <circle key={i} cx={p.x} cy={p.y} r={z.r} fill="url(#rg)" />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const P5_SplitScreenDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // PHASE 1 (0-110) : SPLIT 2 — comparer 2 dates (2022 peu de zones | 2025 beaucoup)
  // PHASE 2 (110-220) : SPLIT 3 — les 3 pays AES côte à côte
  const phase2 = frame >= 110;

  const ZONES_2022 = [{ c: [-3.95, 14.6] as [number, number], r: 55 }];
  const ZONES_2025 = [
    { c: [-3.95, 14.6] as [number, number], r: 80 }, { c: [-1.63, 14.1] as [number, number], r: 60 },
    { c: [1.45, 14.21] as [number, number], r: 65 }, { c: [2.4, 15.92] as [number, number], r: 50 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      {!phase2 ? (
        <SplitScreen frame={frame} openAt={10} width={width} height={height}
          labels={["2022", "2025"]}
          panels={[
            (w, h) => <SahelStateMap width={w} height={h} redZones={ZONES_2022} />,
            (w, h) => <SahelStateMap width={w} height={h} redZones={ZONES_2025} />,
          ]} />
      ) : (
        <SplitScreen frame={frame} openAt={115} width={width} height={height}
          labels={["MALI", "BURKINA", "NIGER"]}
          panels={[
            (w, h) => <SahelStateMap width={w} height={h} redZones={[{ c: [-3.5, 16], r: 70 }]} />,
            (w, h) => <SahelStateMap width={w} height={h} redZones={[{ c: [-1.6, 13], r: 60 }]} />,
            (w, h) => <SahelStateMap width={w} height={h} redZones={[{ c: [8, 17], r: 55 }]} />,
          ]} />
      )}
      <div style={{ position: "absolute", left: 40, bottom: 30, color: "#F4ECD8", fontFamily: "Georgia, serif", opacity: 0.85 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, opacity: 0.7 }}>R&D · MÉCANIQUE P5 · SPLIT-SCREEN</div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{phase2 ? "3 écrans — les 3 pays AES" : "2 écrans — l'avancée (2022 vs 2025)"}</div>
      </div>
    </AbsoluteFill>
  );
};
