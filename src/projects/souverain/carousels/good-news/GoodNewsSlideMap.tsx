import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { MapboxBrandingHide, addCountryHighlight, ISO } from "../../../_shared/mapbox/MapboxBase";
import { applyCartoCaspian, CASPIAN_PALETTE } from "../../../_shared/mapbox/templates/CartoCaspian";
import { GN } from "./theme";

/**
 * GoodNewsSlideMap — slide carrousel Good News avec vraie carte Mapbox,
 * style Caspian beige (cohérent avec la charte LUMINEUSE).
 *
 * Cas : corridor hydrogène Algérie → Europe. Tracé doré animé Alger→Rome→Berlin
 * dessiné en SVG overlay (projeté via map.project), Algérie surlignée.
 * Frame-driven (jumpTo + interpolate), headless-safe.
 * Format 1080x1350 (4:5).
 */

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Coordonnées géocodées via Mapbox MCP (jamais hardcodées à l'œil)
const ALGIERS: [number, number] = [3.058845, 36.772933];
const ROME: [number, number] = [12.476713, 41.899986];
const BERLIN: [number, number] = [13.395131, 52.517389];
const ROUTE: [number, number][] = [ALGIERS, ROME, BERLIN];

// Vue cadrant Méditerranée + Europe (Alger en bas, Berlin en haut)
const CAM = { lon: 8.5, lat: 44.5, zoom: 3.15 };

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 8, width: "100%" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{ height: 3, flex: 1, borderRadius: 2, backgroundColor: i <= current ? GN.gold : "rgba(200,169,81,0.30)" }}
        />
      ))}
    </div>
  );
}

export interface GoodNewsSlideMapProps {
  slideIndex: number;
  totalSlides: number;
  kicker?: string;
  body: string;
}

export const GoodNewsSlideMap: React.FC<GoodNewsSlideMapProps> = ({
  slideIndex,
  totalSlides,
  kicker = "3 — Algérie",
  body,
}) => {
  const frame = useCurrentFrame();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("GoodNewsSlideMap"));
  const [ready, setReady] = useState(false);

  const textOpacity = interpolate(frame, [16, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Fade-in global pour masquer le clipping de chargement Mapbox (1er frames)
  const slideOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Progression du tracé (se dessine après stabilisation de la carte)
  const drawT = interpolate(frame, [24, 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM.lon, CAM.lat],
      zoom: CAM.zoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
    });

    map.on("style.load", () => {
      if (typeof (map as any).setProjection === "function") (map as any).setProjection("mercator");
      applyCartoCaspian(map);
      addCountryHighlight(map, ISO.ALGERIE, CASPIAN_PALETTE.highlightOr, 0.5, 1.2);
      mapRef.current = map;
      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle]);

  // Projection des points route en pixels (recalculé chaque frame — carte fixe ici)
  const projected = (() => {
    const map = mapRef.current;
    if (!map || !ready) return null;
    return ROUTE.map((c) => {
      const p = map.project(c as mapboxgl.LngLatLike);
      return [p.x, p.y] as [number, number];
    });
  })();

  // Calcul du tracé partiel selon drawT (interpolation le long des 2 segments)
  const partialPath = (() => {
    if (!projected) return "";
    const segs = [
      [projected[0], projected[1]],
      [projected[1], projected[2]],
    ];
    const totalLen = segs.reduce((s, [a, b]) => s + Math.hypot(b[0] - a[0], b[1] - a[1]), 0);
    const target = totalLen * drawT;
    let acc = 0;
    let d = `M ${projected[0][0]} ${projected[0][1]}`;
    for (const [a, b] of segs) {
      const segLen = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (acc + segLen <= target) {
        d += ` L ${b[0]} ${b[1]}`;
        acc += segLen;
      } else {
        const remain = Math.max(0, target - acc);
        const r = segLen > 0 ? remain / segLen : 0;
        d += ` L ${a[0] + (b[0] - a[0]) * r} ${a[1] + (b[1] - a[1]) * r}`;
        break;
      }
    }
    return d;
  })();

  const headPos = (() => {
    if (!projected) return null;
    const segs = [
      [projected[0], projected[1]],
      [projected[1], projected[2]],
    ];
    const totalLen = segs.reduce((s, [a, b]) => s + Math.hypot(b[0] - a[0], b[1] - a[1]), 0);
    const target = totalLen * drawT;
    let acc = 0;
    for (const [a, b] of segs) {
      const segLen = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (acc + segLen >= target) {
        const r = segLen > 0 ? (target - acc) / segLen : 0;
        return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r] as [number, number];
      }
      acc += segLen;
    }
    return projected[2];
  })();

  return (
    <AbsoluteFill style={{ backgroundColor: CASPIAN_PALETTE.land }}>
      {/* fond plein dès frame 0 (évite tout flash blanc pendant le chargement) */}
      <AbsoluteFill style={{ backgroundColor: CASPIAN_PALETTE.land }} />
      <AbsoluteFill style={{ opacity: slideOpacity }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ width: 1080, height: 1350 }} />

      {/* voile bas pour lisibilité texte (clair, doux) */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(237,229,211,0) 48%, rgba(237,229,211,0.55) 70%, rgba(237,229,211,0.95) 100%)",
        }}
      />

      {/* tracé + pins (SVG overlay) */}
      {projected && (
        <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* halo du tracé */}
          <path d={partialPath} fill="none" stroke={GN.gold} strokeWidth={12} strokeLinecap="round" opacity={0.22} />
          {/* pointillés qui DÉFILENT en continu le long du corridor (anti-boucle-morte) */}
          <path
            d={partialPath}
            fill="none"
            stroke={GN.goldDeep}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="2 10"
            strokeDashoffset={-(frame * 0.6)}
          />
          {/* pin départ Alger */}
          <circle cx={projected[0][0]} cy={projected[0][1]} r={14} fill={GN.goldDeep} />
          <circle cx={projected[0][0]} cy={projected[0][1]} r={6} fill="#fff" />
          {/* tête mobile */}
          {headPos && drawT < 1 && <circle cx={headPos[0]} cy={headPos[1]} r={11} fill="#fff" stroke={GN.goldDeep} strokeWidth={4} />}
          {/* pin arrivée Berlin (apparait à la fin, halo pulsant) */}
          {drawT >= 0.99 && (
            <>
              <circle cx={projected[2][0]} cy={projected[2][1]} r={18 + 5 * (0.5 + 0.5 * Math.sin(frame / 10))} fill={GN.sky} opacity={0.22} />
              <circle cx={projected[2][0]} cy={projected[2][1]} r={12} fill={GN.sky} />
              <circle cx={projected[2][0]} cy={projected[2][1]} r={5} fill="#fff" />
            </>
          )}
        </svg>
      )}

      {/* labels villes */}
      {projected && (
        <>
          <CityLabel x={projected[0][0]} y={projected[0][1]} name="Alger" color={GN.goldDeep} anchor="below" />
          {drawT >= 0.99 && <CityLabel x={projected[2][0]} y={projected[2][1]} name="Berlin" color={GN.sky} anchor="above" />}
        </>
      )}

      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "28px 40px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: GN.goldDeep, letterSpacing: 4, fontWeight: 700 }}>
            K&amp;C
          </span>
        </div>
        <ProgressBar current={slideIndex} total={totalSlides} />
      </div>

      {/* Texte */}
      <AbsoluteFill
        style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 64px 250px", opacity: textOpacity }}
      >
        {kicker && (
          <span style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, letterSpacing: 3, color: GN.goldDeep, textTransform: "uppercase", marginBottom: 18 }}>
            {kicker}
          </span>
        )}
        <p style={{ fontFamily: "Georgia, serif", fontSize: 50, lineHeight: 1.32, fontWeight: 500, color: GN.ink, margin: 0 }}>{body}</p>
      </AbsoluteFill>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0 36px", textAlign: "center" }}>
        <span style={{ color: GN.goldDeep, fontSize: 20, letterSpacing: 3, opacity: 0.8 }}>@koraetcartes</span>
      </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

function CityLabel({ x, y, name, color, anchor }: { x: number; y: number; name: string; color: string; anchor: "above" | "below" }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: anchor === "below" ? y + 24 : y - 78,
        transform: "translateX(-50%)",
        backgroundColor: "rgba(255,255,255,0.96)",
        border: `2px solid ${color}`,
        color: GN.ink,
        fontFamily: "Georgia, serif",
        fontSize: 38,
        fontWeight: 700,
        padding: "8px 22px",
        borderRadius: 6,
        whiteSpace: "nowrap",
        boxShadow: "0 3px 12px rgba(0,0,0,0.16)",
      }}
    >
      {name}
    </div>
  );
}
