/**
 * SoudanSocleTest — validation du SOCLE carte Soudan (SoudanWarMapEngine).
 * Grammaire AES : Soudan crème lumineux + voisins kaki sombre + contour permanent.
 * Halos LOCAUX qui rayonnent (rouge RSF ouest, bleu SAF est), JAMAIS d'aplat plein.
 * Routes Mapbox masquées, Nil discret.
 *
 * 2 variantes comparatives (prop `stateLines`) :
 *   A (0)    = grand bloc quasi-vide (look AES pur, aucun liseré d'état interne)
 *   B (0.15) = bloc propre + états très pâles (un peu de richesse cartographique)
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SoudanWarMapEngine, CamKey, ZoneControl } from "./engine/SoudanWarMapEngine";

export const SOUDAN_SOCLE_FPS = 30;
export const SOUDAN_SOCLE_FRAMES = 300; // 10s

const CAM: CamKey[] = [
  { f: 0, lon: 29.8, lat: 15.4, zoom: 5.05 },
  { f: 150, lon: 30.3, lat: 15.2, zoom: 5.0 },
  { f: 300, lon: 30.0, lat: 15.35, zoom: 5.03 },
];

const DARFUR: [number, number] = [24.9, 14.6];
const EST_SAF: [number, number] = [33.5, 15.6];

export const SoudanSocleTest: React.FC<{ stateLines?: number }> = ({ stateLines = 0 }) => {
  const frame = useCurrentFrame();
  const rsfInt = interpolate(frame, [70, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const safInt = interpolate(frame, [120, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zones: ZoneControl[] = [
    { at: DARFUR, faction: "rsf", radiusKm: 430, intensity: rsfInt },
    { at: EST_SAF, faction: "saf", radiusKm: 430, intensity: safInt },
  ];
  return <SoudanWarMapEngine camKeys={CAM} zones={zones} showNationalBorder stateLineOpacity={stateLines} />;
};

export default SoudanSocleTest;
