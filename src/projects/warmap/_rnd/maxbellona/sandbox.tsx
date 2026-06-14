// BAC A SABLE R&D — décodage Max Bellona porté sur notre carte plate Sahel.
//
// But : prototyper VITE les mécaniques graphiques (liens orthogonaux, badges, transformation, flux)
// SANS dépendre du moteur Mapbox complet (lourd au render). On fournit ici un `project` Mercator
// LOCAL sur le bbox Sahel + un fond carte plate (RINGS réels des 3 pays AES) en identité parchemin.
//
// ⭐ Signature `project(lon,lat) -> {x,y}` IDENTIQUE à SahelRenderContext.project → toute mécanique
// codée ici se TRANSPOSE telle quelle dans une <PartieX> réelle (juste passer ctx.project au lieu de
// ce project local). Voir memory/atlas-decode/DECODE-maxbellona.md.

import React from "react";
import { AbsoluteFill } from "remotion";
import { MALI_RING, NIGER_RING, BURKINA_RING, type Ring } from "../../parties/sahelCountries";

export type Pt = { x: number; y: number };
export type ProjectFn = (lon: number, lat: number) => Pt;

// Couleurs carte plate (cohérent contours nationaux P4 Sahel)
export const SAND = {
  PAPER_TOP: "#E8DCC0",
  PAPER_BOT: "#D8C8A4",
  INK: "#2A1C0E",
  MALI: "#D98A3D",
  BURKINA: "#C0553C",
  NIGER: "#4E8C7D",
  RED_WAR: "#8B3A3A",
} as const;

// bbox Sahel (lon/lat) — cadre les 3 pays AES cœur, marge confort
const BBOX = { lonMin: -12.5, lonMax: 16.5, latMin: 9.0, latMax: 25.5 };

// Projection équirectangulaire fit-au-bbox → pixels écran. Closure-compatible avec le moteur.
// On fit X et Y INDÉPENDAMMENT (proto : pas besoin de fidélité Mercator parfaite, on veut l'espace
// exploitable). margin = padding écran autour du bbox.
export function makeSahelProject(width: number, height: number, margin = 0.07): ProjectFn {
  const { lonMin, lonMax, latMin, latMax } = BBOX;
  const mx = width * margin, my = height * margin;
  const usableW = width - 2 * mx, usableH = height - 2 * my;
  return (lon: number, lat: number): Pt => ({
    x: mx + ((lon - lonMin) / (lonMax - lonMin)) * usableW,
    y: my + ((latMax - lat) / (latMax - latMin)) * usableH, // lat haute = haut écran
  });
}

// Projection paramétrable par bbox custom → permet de CADRER chaque volet d'un split sur SA zone
// (le volet "Mali" zoome sur le Mali, etc.). bbox = {lonMin,lonMax,latMin,latMax}.
export type Bbox = { lonMin: number; lonMax: number; latMin: number; latMax: number };
export function makeProjectFor(bbox: Bbox, width: number, height: number, margin = 0.08): ProjectFn {
  const { lonMin, lonMax, latMin, latMax } = bbox;
  const mx = width * margin, my = height * margin;
  const usableW = width - 2 * mx, usableH = height - 2 * my;
  // garder le ratio géo pour éviter l'écrasement quand le volet est étroit/large
  const lonSpan = lonMax - lonMin, latSpan = latMax - latMin;
  const sx = usableW / lonSpan, sy = usableH / latSpan;
  const s = Math.min(sx, sy);
  const cx = width / 2, cy = height / 2;
  const midLon = (lonMin + lonMax) / 2, midLat = (latMin + latMax) / 2;
  return (lon: number, lat: number): Pt => ({
    x: cx + (lon - midLon) * s,
    y: cy - (lat - midLat) * s,
  });
}

export function ringToPath(ring: Ring, project: ProjectFn): string {
  const pts = ring.map(([lon, lat]) => project(lon, lat));
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) d += `L${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
  return d + "Z";
}

// Fond carte plate Sahel : pays remplis sable + contours encre. Registre "parchemin" (passé/neutre).
// warTint 0..1 = bascule vers registre "guerre" (pays se teintent rouge sourd) — pour la mécanique 3.
export const SahelFlatMap: React.FC<{
  project: ProjectFn; width: number; height: number; warTint?: number; showFill?: boolean;
}> = ({ project, width, height, warTint = 0, showFill = true }) => {
  const countries: { ring: Ring; color: string }[] = [
    { ring: MALI_RING, color: SAND.MALI },
    { ring: BURKINA_RING, color: SAND.BURKINA },
    { ring: NIGER_RING, color: SAND.NIGER },
  ];
  const mix = (hex: string, t: number) => {
    // lerp vers rouge-guerre
    const a = hex.replace("#", ""), b = SAND.RED_WAR.replace("#", "");
    const ar = parseInt(a.slice(0, 2), 16), ag = parseInt(a.slice(2, 4), 16), ab = parseInt(a.slice(4, 6), 16);
    const br = parseInt(b.slice(0, 2), 16), bg = parseInt(b.slice(2, 4), 16), bb = parseInt(b.slice(4, 6), 16);
    const r = Math.round(ar + (br - ar) * t), g = Math.round(ag + (bg - ag) * t), bl = Math.round(ab + (bb - ab) * t);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
  };
  return (
    <AbsoluteFill>
      {/* fond papier dégradé */}
      <AbsoluteFill style={{ background: `linear-gradient(160deg, ${SAND.PAPER_TOP}, ${SAND.PAPER_BOT})` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {showFill && countries.map((c, i) => (
          <path key={i} d={ringToPath(c.ring, project)} fill={mix(c.color, warTint * 0.6)}
            stroke={SAND.INK} strokeWidth={2} strokeOpacity={0.55} opacity={0.9} />
        ))}
      </svg>
      {/* grain léger */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(40,28,14,0.18) 100%)",
        mixBlendMode: "multiply", pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
