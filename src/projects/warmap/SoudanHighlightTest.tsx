/**
 * SoudanHighlightTest — valide le principe "on nomme → ça se trace" (option C, décision Aziz).
 * Base = grand bloc vide (look AES). Quand on nomme un état, son CONTOUR se DESSINE (draw-in) dans
 * la couleur de la faction qui le tient, puis s'estompe. Intérieur reste crème vide (pas d'aplat).
 * Le Nil + le contour national restent permanents.
 *
 * Séquence 12s : (1) carte vide propre · (2) "El Fasher" → Nord-Darfour se trace en ROUGE RSF ·
 * (3) "Khartoum" → Khartoum se trace en BLEU SAF · (4) les deux s'estompent → retour vide.
 */
import React from "react";
import { SoudanWarMapEngine, CamKey, StateHighlight } from "./engine/SoudanWarMapEngine";

export const SOUDAN_HL_FPS = 30;
export const SOUDAN_HL_FRAMES = 360; // 12s

const CAM: CamKey[] = [
  { f: 0, lon: 29.9, lat: 15.3, zoom: 5.0 },
  { f: 360, lon: 30.4, lat: 15.25, zoom: 4.98 },
];

const HIGHLIGHTS: StateHighlight[] = [
  // "El Fasher" (capitale du Nord-Darfour, tenu RSF) → contour rouge se trace à f60
  { state: "North Darfur", faction: "rsf", drawAt: 60, drawFrames: 30, holdFrames: 120, fadeFrames: 30 },
  // "Khartoum" (capitale, tenue SAF) → contour bleu se trace à f180
  { state: "Khartoum", faction: "saf", drawAt: 180, drawFrames: 30, holdFrames: 90, fadeFrames: 30 },
];

export const SoudanHighlightTest: React.FC = () => {
  return <SoudanWarMapEngine camKeys={CAM} highlights={HIGHLIGHTS} showNationalBorder stateLineOpacity={0} />;
};

export default SoudanHighlightTest;
