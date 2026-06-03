/**
 * LottieGeoAura — anime un Lottie premium ANCRE a un point geographique, sur Mapbox.
 *
 * Plan Gemini (Chantier C — "effet vivant : lottie", Playbook P5). Le vrai gap n'etait
 * pas la mecanique (deja prouvee dans MapboxLottieShowcase) mais des ASSETS premium :
 * on les genere via premiumLottieAssets.ts (shockwave / networkFlow / orbitalDataCrown).
 *
 * Technique :
 *   - Lottie rendu OFF-SCREEN (canvas, autoplay off) → goToAndStop(frame) frame-driven
 *     (deterministe pour le render headless, pas de timing temps-reel).
 *   - Canvas affiche en overlay <img>/<canvas> a la position map.project(coord) →
 *     l'aura suit le drift de la camera, ancree au sol.
 *
 * Hybride V/H : scale en vmin (% du plus petit cote) → ne deborde jamais.
 *
 * Usage :
 *   <LottieGeoAura center={[-17.15,13.45]} baseZoom={6.2}
 *     auras={[{ coord:[-17.15,13.45], asset:"shockwaveDiscovery", at:10, sizeVmin:55 }]} />
 *
 * IMPORTANT : render via scripts/render-mapbox.sh (WebGL headless).
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import lottie from "lottie-web";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { applyGeoAfriqueV5, MapboxBrandingHide } from "./MapboxBase";
import {
  shockwaveDiscovery,
  networkFlow,
  orbitalDataCrown,
} from "../lottie/premiumLottieAssets";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export type LottieAssetKey =
  | "shockwaveDiscovery"
  | "networkFlow"
  | "orbitalDataCrown";

const ASSET_FACTORY: Record<LottieAssetKey, () => object> = {
  shockwaveDiscovery: () => shockwaveDiscovery(),
  networkFlow: () => networkFlow(),
  orbitalDataCrown: () => orbitalDataCrown(),
};

export interface AuraSpec {
  coord: [number, number];
  asset: LottieAssetKey;
  /** Frame de demarrage de l'aura */
  at: number;
  /** Taille en % du plus petit cote de l'ecran (vmin). Defaut 50. */
  sizeVmin?: number;
  /** Label optionnel sous l'aura */
  label?: string;
}

export interface LottieGeoAuraProps {
  center: [number, number];
  baseZoom?: number;
  highlightIso?: string;
  auras: AuraSpec[];
  driftAmplitude?: number;
  durationFrames?: number;
}

export const LottieGeoAura: React.FC<LottieGeoAuraProps> = ({
  center,
  baseZoom = 6.0,
  highlightIso,
  auras,
  driftAmplitude = 0.5,
  durationFrames = 150,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;
  const vmin = Math.min(width, height);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("LottieGeoAura init"));
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<Record<number, { x: number; y: number }>>(
    {}
  );

  // Instances Lottie off-screen, une par aura
  const lottieRefs = useRef<
    Record<number, { anim: any; canvas: HTMLCanvasElement | null; container: HTMLDivElement }>
  >({});
  const [, force] = useState(0);

  const effZoom = baseZoom + (isVertical ? 0 : -0.4);

  // ── Creer les instances Lottie off-screen ───────────────────────────────────
  useEffect(() => {
    auras.forEach((a, i) => {
      if (lottieRefs.current[i]) return;
      const container = document.createElement("div");
      container.style.cssText =
        "position:absolute;width:512px;height:512px;left:-9999px;top:-9999px;opacity:0;";
      document.body.appendChild(container);
      try {
        const anim = lottie.loadAnimation({
          container,
          animationData: ASSET_FACTORY[a.asset](),
          renderer: "canvas",
          loop: true,
          autoplay: false,
          rendererSettings: { clearCanvas: true, progressiveLoad: false },
        } as any);
        lottieRefs.current[i] = { anim, canvas: null, container };
        anim.addEventListener("DOMLoaded", () => {
          const cv = container.querySelector("canvas") as HTMLCanvasElement | null;
          if (cv && lottieRefs.current[i]) {
            lottieRefs.current[i].canvas = cv;
            force((n) => n + 1);
          }
        });
      } catch {}
    });
    return () => {
      Object.values(lottieRefs.current).forEach(({ anim, container }) => {
        try {
          anim.destroy?.();
        } catch {}
        try {
          document.body.removeChild(container);
        } catch {}
      });
      lottieRefs.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center,
      zoom: effZoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;
    map.on("style.load", () => {
      try {
        (map as mapboxgl.Map & { setProjection?: (p: string) => void }).setProjection?.(
          "mercator"
        );
      } catch {}
      applyGeoAfriqueV5(map);
      if (highlightIso) {
        if (!map.getSource("cb-source")) {
          map.addSource("cb-source", {
            type: "vector",
            url: "mapbox://mapbox.country-boundaries-v1",
          });
        }
        if (!map.getLayer("aura-hl")) {
          map.addLayer({
            id: "aura-hl",
            type: "line",
            source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], highlightIso],
            paint: { "line-color": "#c8a951", "line-width": 1.5, "line-opacity": 0.5 },
          });
        }
      }
      setReady(true);
      continueRender(handle);
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Drift + projection des ancres ───────────────────────────────────────────
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const driftT = interpolate(frame, [0, durationFrames], [-1, 1]);
    const driftLon = isVertical ? 0 : driftT * driftAmplitude;
    const driftLat = isVertical ? driftT * driftAmplitude : 0;
    map.jumpTo({
      center: [center[0] + driftLon, center[1] + driftLat],
      zoom: effZoom + interpolate(frame, [0, durationFrames], [0, 0.08]),
      bearing: 0,
      pitch: 0,
    });
    const pos: Record<number, { x: number; y: number }> = {};
    auras.forEach((a, i) => {
      const s = map.project(a.coord);
      pos[i] = { x: s.x, y: s.y };
    });
    setScreen(pos);
  }, [frame, ready, center, effZoom, durationFrames, isVertical, driftAmplitude, auras]);

  // ── Avancer chaque Lottie a sa frame locale (deterministe) ──────────────────
  const auraCanvases: Record<number, string> = {};
  auras.forEach((a, i) => {
    const inst = lottieRefs.current[i];
    if (!inst || !inst.canvas) return;
    const rel = frame - a.at;
    if (rel < 0) return;
    try {
      const totalF = inst.anim.totalFrames || 90;
      // assets a 30fps ; on map la frame Remotion → frame Lottie (loop)
      const lf = (rel * (inst.anim.frameRate || 30)) / fps;
      inst.anim.goToAndStop(lf % Math.max(1, Math.floor(totalF)), true);
      auraCanvases[i] = inst.canvas.toDataURL("image/png");
    } catch {}
  });

  const globalOpacity = interpolate(
    frame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: "#16213a", opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {auras.map((a, i) => {
        const sp = screen[i];
        const dataUrl = auraCanvases[i];
        if (!sp || !dataUrl) return null;
        const rel = frame - a.at;
        const op = interpolate(rel, [0, 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (op <= 0.01) return null;
        const size = ((a.sizeVmin ?? 50) / 100) * vmin;
        return (
          <React.Fragment key={i}>
            <img
              src={dataUrl}
              style={{
                position: "absolute",
                left: sp.x - size / 2,
                top: sp.y - size / 2,
                width: size,
                height: size,
                opacity: op,
                pointerEvents: "none",
              }}
            />
            {a.label && (
              <div
                style={{
                  position: "absolute",
                  left: sp.x,
                  top: sp.y + size / 2 + 8,
                  transform: "translateX(-50%)",
                  opacity: op,
                  color: "#f2ebd9",
                  fontSize: isVertical ? 28 : 22,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  textShadow: "0 2px 12px rgba(0,0,0,0.9)",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {a.label}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

export default LottieGeoAura;
