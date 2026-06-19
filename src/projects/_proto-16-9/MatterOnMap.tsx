// MatterOnMap — teste une matiere ressource projetee sur le VRAI Senegal en Mapbox.
// 3 modes via defaultProps : "none" (ref, dot seul) | "canvas" (resourceMatter) | "gemini" (texture image).
// Render still pour juger en CONTEXTE (le vrai test : tiling + integration carte).
import React, { useEffect, useRef, useState } from "react";
import { AbsoluteFill, useVideoConfig, delayRender, continueRender, staticFile } from "remotion";
import mapboxgl from "mapbox-gl";
import { MapboxBrandingHide, MAPBOX_STYLES, applyGeoAfriqueV5, addCountryHighlight, ISO } from "../_shared/mapbox/MapboxBase";
import { pushCanvas } from "../_shared/mapbox/flagCanvas";
import { drawOilMatter } from "../_shared/mapbox/resourceMatter";

const TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";

type Mode = "none" | "canvas" | "gemini";

// charge un PNG (staticFile) dans un canvas -> pushCanvas
async function loadPngToCanvas(src: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      c.getContext("2d")!.drawImage(img, 0, 0);
      resolve(c);
    };
    img.onerror = reject;
    img.src = src;
  });
}

export const MatterOnMap: React.FC<{ mode?: Mode }> = ({ mode = "canvas" }) => {
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender(`matter-${mode}`));

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [-15.2, 14.4], zoom: 6.6, pitch: 0, bearing: 0,
      interactive: false, attributionControl: false,
    });
    map.on("style.load", async () => {
      (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");
      applyGeoAfriqueV5(map);
      const safe = (id: string, prop: string, val: unknown) => {
        try { if (map.getLayer(id)) (map.setPaintProperty as (i: string, p: string, v: unknown) => void)(id, prop, val); } catch {}
      };
      safe("land", "background-color", "#5a5a5a");
      safe("water", "fill-color", "#2a4f72");
      safe("water-shadow", "fill-color", "#2a4f72");
      addCountryHighlight(map, ISO.SENEGAL, GOLD, 0.06, 2, "mom-");

      if (mode !== "none") {
        let canvas: HTMLCanvasElement;
        if (mode === "canvas") canvas = drawOilMatter(512);
        else canvas = await loadPngToCanvas(staticFile("_shared/textures/gemini-oil.png"));
        pushCanvas(map, "mom-oil", canvas);
        if (!map.getLayer("mom-fill")) {
          map.addLayer({
            id: "mom-fill", type: "fill",
            source: "mapbox-country-boundaries", "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], ISO.SENEGAL],
            paint: { "fill-pattern": "mom-oil", "fill-opacity": 0.92 },
          });
        }
      }
    });
    map.on("idle", () => { try { continueRender(handle); } catch {} });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  return (
    <AbsoluteFill style={{ background: "#0d1424" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <div style={{ position: "absolute", left: 30, bottom: 28, fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, color: GOLD, letterSpacing: "0.12em", textShadow: "0 2px 6px #000" }}>
        FILL = {mode.toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};

export default MatterOnMap;
