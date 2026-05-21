/**
 * MapboxProjectionsTest — POC pour Souverain Template C
 *
 * Objectif : valider la projection equirectangulaire comme signature
 * visuelle Souverain Template C (différenciation forte vs Or Africain V5).
 *
 * Décisions Aziz (2026-05-08, dashboard scout v2 / Caspian Report) :
 * - Adopter projection equirectangulaire (Plate Carrée)
 * - Cartes épurées SANS noms de pays
 * - Palette à inventer (ne pas copier Caspian ivoire+bleu)
 *
 * Ce POC compare 3 vues :
 *   - Vue 1 (0-150f) : Mercator (réf actuelle Or Africain) — pour comparaison
 *   - Vue 2 (150-300f) : Equirectangular palette neutre désaturée
 *   - Vue 3 (300-450f) : Equirectangular palette Souverain proposée
 *
 * Stack : Mapbox GL JS v3.x. equirectangular est natif (vérifié docs Context7
 * 2026-05-08). Pas de contrainte de zoom signalée.
 */
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide } from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Total : 3 vues x 5s @ 30fps = 450 frames
export const MAPBOX_PROJECTIONS_TEST_FRAMES = 450;
const VIEW_FRAMES = 150;

// Centrage Afrique pour les 3 vues
const CENTER: [number, number] = [15, 5];
const ZOOM = 2.4;

// Palettes candidates Template C
const PALETTE_NEUTRE = {
  water: "#1f2937",   // gris-bleu charbon
  land: "#3a3a3a",    // gris terre désaturé
  border: "rgba(220,220,220,0.35)",
  bg: "#0a0a0a",
};

const PALETTE_SOUVERAIN_C = {
  // Hypothèse : terre cuite + indigo profond + accent or (signature distincte
  // d'Or Africain V5 qui est noir+or pur). À valider visuellement.
  water: "#0e1a2a",   // bleu nuit profond (pas le bleu pâle Caspian)
  land: "#3d2a1c",   // terre cuite sombre (vs noir charbon Or Africain)
  border: "rgba(245,213,71,0.25)", // or sourd, faible opacité
  bg: "#0a0605",
};

// ---------------------------------------------------------------------------
// MapView — affiche une carte Mapbox dans un container avec config donnée
// ---------------------------------------------------------------------------
type Projection = "mercator" | "equirectangular";

const MapView: React.FC<{
  projection: Projection;
  palette: typeof PALETTE_NEUTRE;
  label: string;
}> = ({ projection, palette, label }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender(`mapbox-proj-${projection}-${label}`));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: CENTER,
      zoom: ZOOM,
      pitch: 0,
      bearing: 0,
      interactive: false,
      preserveDrawingBuffer: true,
      projection: projection, // <-- la clé du POC
    });

    map.on("style.load", () => {
      // Retirer TOUS les labels (règle Aziz : cartes épurées sans noms pays)
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }
      // Appliquer palette
      const safe = (id: string, prop: string, val: unknown) => {
        try {
          if (map.getLayer(id)) {
            (map.setPaintProperty as (id: string, prop: string, val: unknown) => void)(
              id, prop, val
            );
          }
        } catch {
          // ignore
        }
      };
      safe("water", "fill-color", palette.water);
      safe("water-shadow", "fill-color", palette.water);
      safe("background", "background-color", palette.land);
      safe("land", "background-color", palette.land);
      safe("landuse", "fill-color", palette.land);
      safe("national-park", "fill-color", palette.land);
      safe("landcover", "fill-color", palette.land);
      safe("admin-0-boundary", "line-color", palette.border);
      safe("admin-0-boundary", "line-width", 1.5);
      safe("admin-0-boundary-disputed", "line-color", palette.border);
      safe("admin-1-boundary", "line-color", "rgba(180,180,180,0.0)"); // hors-vue

      setReady(true);
      continueRender(handle);
    });

    return () => map.remove();
  }, []);

  return (
    <AbsoluteFill style={{ background: palette.bg }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
      {ready && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "#f0e8d8",
            fontFamily: "Georgia, serif",
            fontSize: 22,
            letterSpacing: 4,
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {label}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Composition principale — 1080x1920 vertical, 3 vues séquentielles
// ---------------------------------------------------------------------------
export const MapboxProjectionsTest: React.FC = () => {
  const frame = useCurrentFrame();
  // Petit fade-in/out entre les vues pour comparaison fluide
  const fade = (start: number) =>
    interpolate(frame, [start, start + 10, start + VIEW_FRAMES - 10, start + VIEW_FRAMES], [0, 1, 1, 0], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={VIEW_FRAMES}>
        <div style={{ position: "absolute", inset: 0, opacity: fade(0) }}>
          <MapView
            projection="mercator"
            palette={PALETTE_NEUTRE}
            label="MERCATOR — référence"
          />
        </div>
      </Sequence>
      <Sequence from={VIEW_FRAMES} durationInFrames={VIEW_FRAMES}>
        <div style={{ position: "absolute", inset: 0, opacity: fade(VIEW_FRAMES) }}>
          <MapView
            projection="equirectangular"
            palette={PALETTE_NEUTRE}
            label="EQUIRECTANGULAIRE — palette neutre"
          />
        </div>
      </Sequence>
      <Sequence from={VIEW_FRAMES * 2} durationInFrames={VIEW_FRAMES}>
        <div style={{ position: "absolute", inset: 0, opacity: fade(VIEW_FRAMES * 2) }}>
          <MapView
            projection="equirectangular"
            palette={PALETTE_SOUVERAIN_C}
            label="EQUIRECTANGULAIRE — palette Template C"
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
