// useClipFlags.tsx — Hook + composant pour projeter des VRAIS drapeaux dans des pays
// via clip SVG (net a toute echelle, etoile non coupee). Technique validee Beat3 (2026-06-03).
//
// ⛔⛔ A NE PAS UTILISER SUR UNE CARTE AVEC PITCH (relief V5) — DERIVE prouvee 2026-06-21.
//   L'image SVG est plate dans une bbox 2D : au pitch, le pays devient un trapeze 3D incline et le
//   drapeau GLISSE/deborde (il ne suit pas le terrain). OK uniquement a plat (pitch 0).
//   Pour projeter un drapeau sur une carte AVEC PITCH → utiliser MapboxCountryFlagDecal (source image
//   decoupee a la silhouette, drapee sur le terrain). Doctrine : memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md.
//
// Remplace le fill-pattern Mapbox (qui carrelle, deforme les etoiles) par :
//   - vraies images drapeaux officiels HD (public/_shared/flags/), pas de dessin approximatif
//   - clip SVG du pays reprojete chaque frame via map.project()
//   - preserveAspectRatio "meet" (drapeau entier) + fond couleur nationale pour combler
//
// Usage :
//   const { paths, ready } = useClipFlags(mapRef, FLAGS, frame, assetsReady);
//   <ClipFlagsLayer width={w} height={h} flags={FLAGS} paths={paths} frame={frame} />

import React, { useEffect, useRef, useState } from "react";
import { staticFile, continueRender, delayRender } from "remotion";
import mapboxgl from "mapbox-gl";
import { feature } from "topojson-client";

const TOPO_PATH = "_shared/geo-data/countries-50m.json";

export interface ClipFlag {
  iso: string;
  // Noms Natural Earth pour la silhouette (ex: ["Morocco","W. Sahara"])
  geoNames: string[];
  // Fichier image dans public/_shared/flags/ (ex: "ma.png")
  flagFile: string;
  // Frame d'allumage (le drapeau apparait a partir de cette frame)
  at: number;
  // Couleur de fond nationale (comble les bords en mode "meet"). Defaut rouge.
  bgColor?: string;
  // Duree du fade-in (defaut 20f)
  fadeFrames?: number;
  // OPTIONNEL : ne garder que les polygones dont le centre tombe dans cette bbox
  // [minLon, minLat, maxLon, maxLat]. INDISPENSABLE pour les pays a territoires d'outre-mer
  // (France = Guyane+Reunion+... -> bbox geante qui casse le clip si non filtree).
  mainlandBox?: [number, number, number, number];
}

export interface ProjectedFlag {
  path: string;
  bbox: { x: number; y: number; w: number; h: number };
  url: string;
}

// Hook : charge geometries + images, reprojette chaque frame.
export function useClipFlags(
  mapRef: React.MutableRefObject<mapboxgl.Map | null>,
  flags: ClipFlag[],
  frame: number,
): { paths: Record<string, ProjectedFlag>; ready: boolean } {
  const ringsRef = useRef<Record<string, number[][][]>>({});
  const urlRef   = useRef<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const [paths, setPaths] = useState<Record<string, ProjectedFlag>>({});
  const [handle] = useState(() => delayRender("useClipFlags geo+flags"));

  useEffect(() => {
    let cancelled = false;
    for (const f of flags) urlRef.current[f.iso] = staticFile(`_shared/flags/${f.flagFile}`);
    fetch(staticFile(TOPO_PATH))
      .then(r => r.json())
      .then((topo: any) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries) as unknown as { features: any[] };
        for (const f of flags) {
          let rings: number[][][] = [];
          for (const nm of f.geoNames) {
            const feat = fc.features.find((ff: any) => ff.properties?.name === nm);
            if (!feat) continue;
            const g = feat.geometry;
            if (g.type === "Polygon") rings.push(...(g.coordinates as number[][][]));
            else if (g.type === "MultiPolygon") for (const poly of g.coordinates) rings.push(...(poly as number[][][]));
          }
          // Filtre territoires d'outre-mer : ne garder que les anneaux dont le 1er point
          // tombe dans mainlandBox (evite la bbox geante France/etc.)
          if (f.mainlandBox) {
            const [mnLon, mnLat, mxLon, mxLat] = f.mainlandBox;
            rings = rings.filter(ring => {
              const [lon, lat] = ring[0];
              return lon >= mnLon && lon <= mxLon && lat >= mnLat && lat <= mxLat;
            });
          }
          ringsRef.current[f.iso] = rings;
        }
        setReady(true);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
    return () => { cancelled = true; try { continueRender(handle); } catch (_e) {} };
  }, [handle]);

  // Reprojeter chaque frame
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const out: Record<string, ProjectedFlag> = {};
    for (const f of flags) {
      if (frame < f.at) continue;
      const rings = ringsRef.current[f.iso];
      if (!rings || !rings.length) continue;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const parts: string[] = [];
      for (const ring of rings) {
        let dseg = "";
        ring.forEach((coord, i) => {
          const p = map.project(coord as [number, number]);
          if (p.x < minX) minX = p.x; if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x; if (p.y > maxY) maxY = p.y;
          dseg += `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        });
        dseg += "Z";
        parts.push(dseg);
      }
      out[f.iso] = { path: parts.join(" "), bbox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY }, url: urlRef.current[f.iso] };
    }
    setPaths(out);
  });

  return { paths, ready };
}

function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }
function easeOut(t: number) { return 1 - Math.pow(1 - clamp01(t), 3); }

// Composant de rendu SVG : drapeaux clippes + fond couleur nationale.
export const ClipFlagsLayer: React.FC<{
  width: number;
  height: number;
  flags: ClipFlag[];
  paths: Record<string, ProjectedFlag>;
  frame: number;
  // Opacite cible du drapeau (defaut 0.95)
  flagOpacity?: number;
  idPrefix?: string;
}> = ({ width, height, flags, paths, frame, flagOpacity = 0.95, idPrefix = "clipflag" }) => {
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        {flags.map(f => {
          const pp = paths[f.iso];
          return pp ? <clipPath key={f.iso} id={`${idPrefix}-${f.iso}`}><path d={pp.path} /></clipPath> : null;
        })}
      </defs>
      {flags.map(f => {
        const pp = paths[f.iso];
        if (!pp || frame < f.at) return null;
        const op = easeOut(clamp01((frame - f.at) / (f.fadeFrames ?? 20))) * flagOpacity;
        const bg = f.bgColor ?? "#de2910";
        return (
          <g key={f.iso}>
            <path d={pp.path} fill={bg} opacity={op * 0.92} />
            <image href={pp.url} x={pp.bbox.x} y={pp.bbox.y} width={pp.bbox.w} height={pp.bbox.h}
              preserveAspectRatio="xMidYMid meet" clipPath={`url(#${idPrefix}-${f.iso})`} opacity={op} />
            <path d={pp.path} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={2} opacity={op * 0.6} />
          </g>
        );
      })}
    </svg>
  );
};
