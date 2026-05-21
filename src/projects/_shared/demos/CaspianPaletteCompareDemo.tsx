/**
 * Caspian palette compare — 4 versions sur Niger (Sahel) pour decision lisibilite
 *
 * Genere 4 compositions statiques (zoom Niger pays entier highlighted) :
 *   - CaspianOriginal : palette validee Or Africain
 *   - CaspianSepia    : assombri vers chaud + vignette
 *   - CaspianSmoke    : desature + assombri uniformement
 *   - CaspianNoir     : inversion sombre (water bleu nuit, land terre sombre)
 *
 * Render via render-mapbox.sh, comparer les 4 mp4 cote a cote.
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useVideoConfig,
} from "remotion";
import {
  applyCartoCaspian,
  CASPIAN_PALETTE,
  CASPIAN_SEPIA,
  CASPIAN_SMOKE,
  CASPIAN_NOIR,
  CaspianPaletteShape,
} from "../mapbox/templates/CartoCaspian";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const CASPIAN_COMPARE_FRAMES = 60;

const NIGER_CENTER: [number, number] = [8.082, 17.608];
const ZOOM = 4.4;

interface PaletteVariant {
  key: "original" | "sepia" | "smoke" | "noir";
  palette: CaspianPaletteShape;
  baseStyle: string;
  vignette?: boolean;
  label: string;
}

const VARIANTS: Record<string, PaletteVariant> = {
  original: {
    key: "original",
    palette: CASPIAN_PALETTE,
    baseStyle: "mapbox://styles/mapbox/light-v11",
    label: "ORIGINAL",
  },
  sepia: {
    key: "sepia",
    palette: CASPIAN_SEPIA,
    baseStyle: "mapbox://styles/mapbox/light-v11",
    vignette: true,
    label: "SEPIA",
  },
  smoke: {
    key: "smoke",
    palette: CASPIAN_SMOKE,
    baseStyle: "mapbox://styles/mapbox/light-v11",
    label: "SMOKE",
  },
  noir: {
    key: "noir",
    palette: CASPIAN_NOIR,
    baseStyle: "mapbox://styles/mapbox/dark-v11",
    label: "NOIR",
  },
};

const makeVariantComponent = (variantKey: PaletteVariant["key"]): React.FC => {
  const Comp: React.FC = () => {
    const { width, height } = useVideoConfig();
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [handle] = useState(() => delayRender(`Caspian variant ${variantKey}`));

    const variant = VARIANTS[variantKey];

    useEffect(() => {
      if (!containerRef.current || mapRef.current) return;
      if (!MAPBOX_TOKEN) {
        continueRender(handle);
        return;
      }
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: variant.baseStyle,
        center: NIGER_CENTER,
        zoom: ZOOM,
        interactive: false,
        attributionControl: false,
        preserveDrawingBuffer: true,
        fadeDuration: 0,
      });

      mapRef.current = map;

      map.on("style.load", () => {
        applyCartoCaspian(map, variant.palette);

        // Highlight Niger
        if (!map.getLayer("niger-fill")) {
          map.addLayer({
            id: "niger-fill",
            type: "fill",
            source: {
              type: "vector",
              url: "mapbox://mapbox.country-boundaries-v1",
            },
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], "NER"],
            paint: {
              "fill-color": variant.palette.highlightOr,
              "fill-opacity": 0.75,
            },
          });
        }
        if (!map.getLayer("niger-line")) {
          map.addLayer({
            id: "niger-line",
            type: "line",
            source: {
              type: "vector",
              url: "mapbox://mapbox.country-boundaries-v1",
            },
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], "NER"],
            paint: {
              "line-color": variant.palette.highlightOr,
              "line-width": 1.5,
              "line-opacity": 1,
            },
          });
        }

        continueRender(handle);
      });

      return () => {
        map.remove();
        mapRef.current = null;
      };
    }, [handle, variant]);

    const inkColor = variant.key === "noir" ? "#e6e9f0" : "#2a1f12";

    return (
      <AbsoluteFill style={{ background: variant.palette.water }}>
        <div
          ref={containerRef}
          style={{ position: "absolute", top: 0, left: 0, width, height }}
        />
        <style>{`.mapboxgl-ctrl-attrib, .mapboxgl-ctrl-logo { display: none !important; }`}</style>

        {/* Vignette pour Sepia */}
        {variant.vignette && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.18) 100%)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Label palette en haut */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: inkColor,
            textShadow:
              variant.key === "noir"
                ? "0 2px 12px rgba(0,0,0,0.6)"
                : "0 2px 8px rgba(255,255,255,0.5)",
          }}
        >
          {variant.label}
        </div>

        {/* Sous-label palette */}
        <div
          style={{
            position: "absolute",
            top: 180,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
            fontSize: 22,
            letterSpacing: "0.3em",
            color: inkColor,
            opacity: 0.7,
          }}
        >
          NIGER · SAHEL · CASPIAN
        </div>

        {/* Specs palette en bas */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 80,
            right: 80,
            fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
            fontSize: 18,
            color: inkColor,
            opacity: 0.75,
            lineHeight: 1.6,
            letterSpacing: "0.05em",
          }}
        >
          <div>WATER  {variant.palette.water}</div>
          <div>LAND   {variant.palette.land}</div>
          <div>BORDER {variant.palette.border} @ {variant.palette.borderOpacity}</div>
          <div>NIGER  {variant.palette.highlightOr}</div>
        </div>
      </AbsoluteFill>
    );
  };
  Comp.displayName = `CaspianVariant_${variantKey}`;
  return Comp;
};

export const CaspianOriginalDemo = makeVariantComponent("original");
export const CaspianSepiaDemo = makeVariantComponent("sepia");
export const CaspianSmokeDemo = makeVariantComponent("smoke");
export const CaspianNoirDemo = makeVariantComponent("noir");
