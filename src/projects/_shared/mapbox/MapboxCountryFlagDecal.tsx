/**
 * MapboxCountryFlagDecal — projette un DRAPEAU dans la silhouette d'un pays, SANS derive ni carrelage.
 *
 * ⛔ DOCTRINE (grave 2026-06-21, apres 3 echecs) :
 *   - Overlay SVG (clipPath + <image>) : DERIVE au pitch (image 2D plate dans une bbox, ne suit pas le terrain 3D).
 *   - fill-pattern Mapbox : suit le terrain MAIS carrele au dezoom (le pattern garde sa taille pixel → bouillie quand
 *     le pays devient plus petit que la tuile).
 *   - ✅ SOLUTION : source `image` Mapbox (4 coords geo = bbox du pays) + canvas pre-decoupe a la SILHOUETTE.
 *     Mapbox drape la source image sur le terrain → suit pitch/zoom/pan, ZERO derive. Le canvas est deja
 *     decoupe a la forme du pays (clip dans le canvas, pas dans Mapbox) → pas de debordement, pas de carrelage.
 *
 * C'est la methode des chaines premium (GeoLes3 etc.) : le drapeau devient une decalcomanie drapee sur le pays.
 *
 * Usage : <MapboxCountryFlagDecal mapRef={mapRef} iso="SEN" geoNames={["Senegal"]}
 *           drawFlag={(s)=>drawFlagCanvas("SEN", s)} />
 */
import React, { useEffect, useRef, useState } from "react";
import { continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import type mapboxgl from "mapbox-gl";
import { feature } from "topojson-client";

const TOPO_PATH = "_shared/geo-data/countries-50m.json";

export type FlagDecalProps = {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  iso: string;
  /** noms Natural Earth du pays (silhouette). Ex: ["Senegal"], ["Morocco","W. Sahara"]. */
  geoNames: string[];
  /** fonction qui dessine le drapeau dans un canvas carre de taille `size`. */
  drawFlag: (size: number) => HTMLCanvasElement;
  /** resolution du canvas decoupe (defaut 2048 pour rester net en gros plan). */
  size?: number;
  /** opacite raster (defaut 1). */
  opacity?: number;
  /** couleur du liseré de frontiere (defaut ivoire). */
  borderColor?: string;
};

export const MapboxCountryFlagDecal: React.FC<FlagDecalProps> = ({
  mapRef,
  iso,
  geoNames,
  drawFlag,
  size = 2048,
  opacity = 1,
  borderColor = "#f2efe6",
}) => {
  useCurrentFrame(); // force re-render pour capter map ready
  const [handle] = useState(() => delayRender(`flag-decal-${iso}`));
  const doneRef = useRef(false);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || doneRef.current) return;
    doneRef.current = true;

    (async () => {
      try {
        const topo = await fetch(staticFile(TOPO_PATH)).then((r) => r.json());
        const fc = feature(topo, topo.objects.countries) as unknown as { features: any[] };
        // recolter les anneaux du pays
        const rings: number[][][] = [];
        for (const nm of geoNames) {
          const feat = fc.features.find((ff: any) => ff.properties?.name === nm);
          if (!feat) continue;
          const g = feat.geometry;
          if (g.type === "Polygon") rings.push(...(g.coordinates as number[][][]));
          else if (g.type === "MultiPolygon") for (const poly of g.coordinates) rings.push(...(poly as number[][][]));
        }
        if (!rings.length) { continueRender(handle); return; }

        // bbox geo du pays
        let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
        for (const ring of rings) for (const [lon, lat] of ring) {
          if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon;
          if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
        }

        // canvas : drapeau dessine PUIS decoupe a la silhouette (clip dans le canvas)
        const cnv = document.createElement("canvas");
        cnv.width = size; cnv.height = size;
        const ctx = cnv.getContext("2d")!;
        // mapper lon/lat -> pixel canvas (y inverse). preserve aspect via fit dans le carre.
        const wGeo = maxLon - minLon, hGeo = maxLat - minLat;
        const geoAspect = wGeo / hGeo;
        // on dessine la bbox geo dans le canvas carre en remplissant (le drapeau couvre toute la bbox)
        const toPx = (lon: number, lat: number): [number, number] => [
          ((lon - minLon) / wGeo) * size,
          (1 - (lat - minLat) / hGeo) * size,
        ];
        // 1) construire le clip = silhouette du pays
        ctx.beginPath();
        for (const ring of rings) {
          ring.forEach(([lon, lat], i) => {
            const [px, py] = toPx(lon, lat);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          });
          ctx.closePath();
        }
        ctx.clip("evenodd");
        // 2) dessiner le drapeau (couvre toute la bbox) — il sera decoupe par le clip
        const flag = drawFlag(size);
        ctx.drawImage(flag, 0, 0, size, size);
        // 3) liseré de frontiere par-dessus (dans le clip)
        ctx.lineWidth = Math.max(2, size * 0.004);
        ctx.strokeStyle = borderColor;
        ctx.beginPath();
        for (const ring of rings) {
          ring.forEach(([lon, lat], i) => {
            const [px, py] = toPx(lon, lat);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          });
          ctx.closePath();
        }
        ctx.stroke();

        // source image Mapbox : la bbox geo (le drapeau decoupe occupe la bonne place dedans, le reste transparent)
        const dataUrl = cnv.toDataURL("image/png");
        const srcId = `flagdecal-src-${iso}`;
        const layerId = `flagdecal-lyr-${iso}`;
        const coords: [number, number][] = [
          [minLon, maxLat], // top-left
          [maxLon, maxLat], // top-right
          [maxLon, minLat], // bottom-right
          [minLon, minLat], // bottom-left
        ];
        if (!map.getSource(srcId)) {
          map.addSource(srcId, { type: "image", url: dataUrl, coordinates: coords as any });
          map.addLayer({ id: layerId, type: "raster", source: srcId, paint: { "raster-opacity": opacity, "raster-fade-duration": 0, "raster-resampling": "linear" } });
        }
        continueRender(handle);
      } catch (_e) {
        continueRender(handle);
      }
    })();
  });

  return null;
};

export default MapboxCountryFlagDecal;
