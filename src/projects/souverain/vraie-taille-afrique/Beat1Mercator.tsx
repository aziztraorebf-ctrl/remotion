import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";
import { applyCartoCaspian, CartoCaspianOverlay, CASPIAN_PALETTE } from "../../_shared/mapbox/templates/CartoCaspian";
import { AUDIO_SEGMENTS, BEATS } from "./timing";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Afrique centree, Mercator plat — vue atlas pedagogique
const CAM = { lon: 20.0, lat: 2.0, zoomStart: 2.2, zoomEnd: 2.45 };

// ISO codes pays africains pour highlight continent
const AFRICA_ISO = [
  "DZA","AGO","BEN","BWA","BFA","BDI","CPV","CMR","CAF","TCD",
  "COM","COD","COG","CIV","DJI","EGY","GNQ","ERI","SWZ","ETH",
  "GAB","GMB","GHA","GIN","GNB","KEN","LSO","LBR","LBY","MDG",
  "MWI","MLI","MRT","MUS","MAR","MOZ","NAM","NER","NGA","RWA",
  "STP","SEN","SLE","SOM","ZAF","SSD","SDN","TZA","TGO","TUN",
  "UGA","ZMB","ZWE","ESH","SHN",
];

export const BEAT1_MERCATOR_FRAMES = BEATS.beat1.durationInFrames; // 150f = 5s

export const Beat1Mercator: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("beat1-mercator-map"));

  const totalFrames = BEAT1_MERCATOR_FRAMES;

  const zoom = interpolate(frame, [0, totalFrames], [CAM.zoomStart, CAM.zoomEnd], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM.lon, CAM.lat],
      zoom: CAM.zoomStart,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
      projection: { name: "mercator" },
    });

    mapRef.current = map;

    map.on("style.load", () => {
      applyCartoCaspian(map, CASPIAN_PALETTE);

      // Source frontieres pays pour highlight Afrique
      map.addSource("country-boundaries", {
        type: "vector",
        url: "mapbox://mapbox.country-boundaries-v1",
      });

      // Highlight Afrique — or chaud sur fond creme
      map.addLayer({
        id: "africa-fill",
        type: "fill",
        source: "country-boundaries",
        "source-layer": "country_boundaries",
        filter: ["in", ["get", "iso_3166_1_alpha_3"], ["literal", AFRICA_ISO]],
        paint: {
          "fill-color": CASPIAN_PALETTE.highlightOr,
          "fill-opacity": 0.35,
        },
      });

      // Contour Afrique plus marque
      map.addLayer({
        id: "africa-outline",
        type: "line",
        source: "country-boundaries",
        "source-layer": "country_boundaries",
        filter: ["in", ["get", "iso_3166_1_alpha_3"], ["literal", AFRICA_ISO]],
        paint: {
          "line-color": CASPIAN_PALETTE.highlightOr,
          "line-width": 1.2,
          "line-opacity": 0.7,
        },
      });

      continueRender(handle);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setZoom(zoom);
    mapRef.current.setCenter([CAM.lon, CAM.lat]);
  });

  return (
    <AbsoluteFill style={{ backgroundColor: CASPIAN_PALETTE.water }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ width: "100%", height: "100%", opacity }} />
      <CartoCaspianOverlay opacity={0.06} />

      {/* Audio beat 1 — standalone (frame 0 = Beat1_START) */}
      <Audio
        src={staticFile(AUDIO_SEGMENTS.beat1.file)}
        startFrom={0}
        endAt={AUDIO_SEGMENTS.beat1.durationFrames}
      />

      {/* Carton "Projection Mercator" — apparait f20, tient jusqu'a f110, fade out f110->f130 */}
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <g opacity={interpolate(frame, [20, 45, 110, 130], [0, 1, 1, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        })}>
          <rect x={240} y={80} width={600} height={100} rx={8} fill="rgba(10,10,10,0.72)" />
          <text
            x={540}
            y={122}
            textAnchor="middle"
            fill="#d4c29d"
            fontSize={32}
            fontFamily="Georgia, serif"
            fontWeight="700"
          >
            Projection Mercator
          </text>
          <text
            x={540}
            y={158}
            textAnchor="middle"
            fill="#a89070"
            fontSize={22}
            fontFamily="Georgia, serif"
            fontStyle="italic"
          >
            1569
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
