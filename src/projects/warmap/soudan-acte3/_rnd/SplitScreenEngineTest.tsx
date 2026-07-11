/**
 * SplitScreenEngineTest — proto ISOLÉ (v8 R&D, clarification split-screen tranchée avec Aziz 2026-07-10).
 *
 * ⛔ VERDICT (2026-07-10, render réel) : ÉCARTÉ. 2e instance SoudanWarMapEngine dans le volet central de
 * WarMapSplitScreen → `Error: Failed to initialize WebGL` sur la 2e mapboxgl.Map. Cause confirmée : le
 * renderer headless Chrome de ce projet ne supporte pas 2 contextes WebGL Mapbox simultanés (PAS les
 * enfants complexes GeoFlowConnection/pictogrammes comme l'hypothèse initiale de l'agent 3 — l'échec
 * survient dès l'init de la 2e Map, avant tout enfant). Confirme la décision antérieure du code
 * ("testé, écarté") avec une cause précise cette fois.
 * Décision : le beat 7 Acte 3 RESTE sur les panneaux glissants actuels (Acte3SideFlags/SidePanelTerritory
 * dans SoudanActe3.tsx) — carte Soudan plein écran unique + volets SVG/silhouette qui glissent par-dessus,
 * pas de 2e Map réelle. Piste alternative si un vrai split est un jour nécessaire : un seul contexte WebGL
 * (une Map) avec 2 viewports rendus séquentiellement puis composités en image statique — pas tenté ici,
 * hors scope Acte 3.
 *
 * Ce fichier reste comme trace du test (ne pas relancer sans changer l'approche ci-dessus).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SoudanWarMapEngine, CamKey, ZoneControl } from "../../engine/SoudanWarMapEngine";
import { WarMapSplitScreen } from "../../_shared/WarMapSplitScreen";

export const SPLIT_ENGINE_TEST_FPS = 30;
export const SPLIT_ENGINE_TEST_FRAMES = 150;

const DARFUR: [number, number] = [26.0, 14.9];
const KHARTOUM: [number, number] = [32.55, 15.6];

const CENTER_CAM: CamKey[] = [{ f: 0, lon: 29.6, lat: 15.4, zoom: 4.6 }];

export const SplitScreenEngineTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const zones: ZoneControl[] = [
    { at: DARFUR, faction: "rsf", radiusKm: 200, intensity: 0.4 },
    { at: KHARTOUM, faction: "saf", radiusKm: 200, intensity: 0.4 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <WarMapSplitScreen
        frame={frame}
        inAt={0}
        outAt={SPLIT_ENGINE_TEST_FRAMES}
        width={width}
        height={height}
        orientation="vertical"
        ratios={[0.25, 0.5, 0.25]}
        labels={["EAU", "SOUDAN", "TURQUIE"]}
        panels={[
          (w, h) => (
            <AbsoluteFill style={{ backgroundColor: "#1a1108", justifyContent: "center", alignItems: "center" }}>
              <div style={{ color: "#D4A574", fontFamily: "Georgia, serif", fontSize: 22 }}>volet gauche (statique, témoin)</div>
            </AbsoluteFill>
          ),
          (w, h) => (
            // ⭐ LE TEST : 2e instance SoudanWarMapEngine réduite, width/height = panel réduit, SANS enfants
            <SoudanWarMapEngine camKeys={CENTER_CAM} zones={zones} showNationalBorder stateLineOpacity={0.1} width={w} height={h}>
              {() => null}
            </SoudanWarMapEngine>
          ),
          (w, h) => (
            <AbsoluteFill style={{ backgroundColor: "#0a1a18", justifyContent: "center", alignItems: "center" }}>
              <div style={{ color: "#4A9A8A", fontFamily: "Georgia, serif", fontSize: 22 }}>volet droit (statique, témoin)</div>
            </AbsoluteFill>
          ),
        ]}
        connector={(w, h) => (
          <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
            <line x1={w * 0.25} y1={h * 0.5} x2={w * 0.75} y2={h * 0.5} stroke="#D4A574" strokeWidth={3} opacity={0.6} />
          </svg>
        )}
      />
    </AbsoluteFill>
  );
};

export default SplitScreenEngineTest;
