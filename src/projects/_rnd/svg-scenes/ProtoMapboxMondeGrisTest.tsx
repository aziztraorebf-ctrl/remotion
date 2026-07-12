import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  delayRender,
  continueRender,
} from "remotion";
import mapboxgl from "mapbox-gl";
import {
  MAPBOX_STYLES,
  MapboxBrandingHide,
  addCountryHighlight,
} from "../../_shared/mapbox/MapboxBase";

// Comparaison directe avec ProtoAtlasMondeCameraTest (SVG) — meme sequence
// camera (Dolly In Ghana -> Whip Pan Nigeria -> Pull Back vue monde), mais en
// vrai Mapbox WebGL headless (pattern robuste repris de Beat0Accroche.tsx,
// projet Senegal : delayRender/continueRender sur style.load, jumpTo frame-
// driven, jamais flyTo/easeTo). Palette : GeoAfrique V5 eclaircie (gris clair
// desature au lieu du gris fonce/navy habituel) — demande Aziz 2026-07-03 :
// "plus serieux, sans hachures, une carte normale stylisee suffit".
//
// Render : npx remotion render/render-mapbox.sh (WebGL headless obligatoire,
// jamais npx remotion render direct — voir scripts/render-mapbox.sh).

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const PROTO_MAPBOX_MONDE_GRIS_TEST_FRAMES = 360;

// Palette "GeoAfrique V5 clair" — variante eclaircie de STYLE_GEO_AFRIQUE_V5
// (MapboxBase.tsx: water #1a3a5c / land #4a4a4a / border #c8c8c8, trop sombre
// pour un registre qui doit cohabiter avec les scenes SVG parchemin claires).
const PALETTE_CLAIRE = {
  water: "#dfe6ea", // gris-bleu tres clair (au lieu du bleu marine)
  land: "#e4e1d8", // gris-beige clair desature (au lieu du gris fonce)
  border: "#8a8578", // frontieres sepia discret (au lieu du blanc)
};

const GHANA_ISO = "GHA";
const NIGERIA_ISO = "NGA";
const GHANA_LONLAT: [number, number] = [-1.2369, 7.9291];
const NIGERIA_LONLAT: [number, number] = [7.9952, 9.5480];
const AFRICA_CENTER: [number, number] = [17, 5]; // vue monde centree Afrique

export const ProtoMapboxMondeGrisTest: React.FC = () => {
  const frame = useCurrentFrame();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const delayHandleRef = useRef<number | null>(null);
  const layersReadyRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const handle = delayRender("ProtoMapboxMondeGrisTest — chargement style", {
      timeoutInMilliseconds: 45000,
    });
    delayHandleRef.current = handle;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark, // base dark-v11, repeint entierement en style.load
      center: AFRICA_CENTER,
      zoom: 1.8,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
      preserveDrawingBuffer: true,
    });

    map.on("style.load", () => {
      try {
        (map as unknown as { setProjection: (p: string) => void }).setProjection("mercator");

        const layers = map.getStyle().layers ?? [];
        for (const layer of layers) {
          if (layer.type === "symbol") map.setLayoutProperty(layer.id, "visibility", "none");
          if (layer.id.includes("waterway") || layer.id.includes("wetland")) {
            map.setLayoutProperty(layer.id, "visibility", "none");
          }
        }
        const safe = (id: string, prop: string, val: unknown) => {
          try {
            if (map.getLayer(id)) (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)(id, prop, val);
          } catch {
            /* layer absent selon le style — non bloquant */
          }
        };
        safe("water", "fill-color", PALETTE_CLAIRE.water);
        safe("water-shadow", "fill-color", PALETTE_CLAIRE.water);
        safe("land", "background-color", PALETTE_CLAIRE.land);
        safe("landuse", "fill-color", PALETTE_CLAIRE.land);
        safe("landcover", "fill-color", PALETTE_CLAIRE.land);
        safe("national-park", "fill-color", PALETTE_CLAIRE.land);
        safe("admin-0-boundary", "line-color", PALETTE_CLAIRE.border);
        safe("admin-0-boundary", "line-width", 1.2);
        safe("admin-1-boundary", "line-color", "rgba(138,133,120,0.25)");

        addCountryHighlight(map, GHANA_ISO, "#c9a876", 0, 2.5, "test-");
        addCountryHighlight(map, NIGERIA_ISO, "#c9a876", 0, 2.5, "test-");

        layersReadyRef.current = true;
        setMapReady(true);
      } catch (_e) {
        /* si un override echoue, on continue quand meme le render */
      }
      // Attendre un repaint GPU reel avant de debloquer Remotion — sinon la
      // toute premiere frame capturee peut tomber entre le style.load et le
      // premier paint effectif du canvas WebGL (frame noire au frame 0).
      map.once("idle", () => {
        continueRender(handle);
        delayHandleRef.current = null;
      });
      map.triggerRepaint();
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      layersReadyRef.current = false;
      if (delayHandleRef.current !== null) {
        continueRender(delayHandleRef.current);
        delayHandleRef.current = null;
      }
    };
  }, []);

  // ─── Camera frame-driven (jumpTo, jamais flyTo/easeTo) ───
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    // SEQUENCE 1 (0-130f) : Dolly In vue monde -> Ghana
    // SEQUENCE 2 (150-210f, 60f) : Whip Pan Ghana -> Nigeria (translation rapide)
    // SEQUENCE 3 (270-330f, 60f) : Pull Back Reveal -> retour vue monde
    let lon: number;
    let lat: number;
    let zoom: number;

    if (frame < 150) {
      const t = interpolate(frame, [0, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      lon = interpolate(t, [0, 1], [AFRICA_CENTER[0], GHANA_LONLAT[0]]);
      lat = interpolate(t, [0, 1], [AFRICA_CENTER[1], GHANA_LONLAT[1]]);
      zoom = interpolate(t, [0, 1], [1.8, 6.8]);
    } else if (frame < 270) {
      const t = interpolate(frame, [150, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      lon = interpolate(t, [0, 1], [GHANA_LONLAT[0], NIGERIA_LONLAT[0]]);
      lat = interpolate(t, [0, 1], [GHANA_LONLAT[1], NIGERIA_LONLAT[1]]);
      zoom = interpolate(t, [0, 1], [6.8, 6.4]);
    } else {
      const t = interpolate(frame, [270, 330], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      lon = interpolate(t, [0, 1], [NIGERIA_LONLAT[0], AFRICA_CENTER[0]]);
      lat = interpolate(t, [0, 1], [NIGERIA_LONLAT[1], AFRICA_CENTER[1]]);
      zoom = interpolate(t, [0, 1], [6.4, 1.8]);
    }

    map.jumpTo({ center: [lon, lat], zoom, pitch: 0, bearing: 0 });

    // Highlight opacite : Ghana actif en sequence 1, Nigeria actif en sequence 2
    if (layersReadyRef.current) {
      const ghanaOp = interpolate(frame, [40, 100, 140, 150], [0, 0.55, 0.55, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const nigeriaOp = interpolate(frame, [160, 210, 260, 270], [0, 0.55, 0.55, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      try {
        (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)("test-fill-GHA", "fill-opacity", ghanaOp);
        (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)("test-fill-NGA", "fill-opacity", nigeriaOp);
      } catch {
        /* layer pas encore pret */
      }
    }
  });

  const phaseLabel =
    frame < 150 ? "Dolly In -> Ghana (Mapbox jumpTo)" : frame < 270 ? "Whip Pan -> Nigeria (Mapbox jumpTo)" : "Pull Back -> vue monde";

  return (
    <AbsoluteFill style={{ background: PALETTE_CLAIRE.water }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <div
        style={{
          position: "absolute",
          bottom: 40,
          width: "100%",
          textAlign: "center",
          fontFamily: "Georgia, serif",
          fontSize: 18,
          color: "#3A2A18",
          opacity: 0.85,
        }}
      >
        {phaseLabel}
      </div>
    </AbsoluteFill>
  );
};
