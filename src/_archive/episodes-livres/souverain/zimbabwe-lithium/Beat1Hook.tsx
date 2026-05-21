import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BEATS, AUDIO_SEGMENTS, SILENCES } from "./timing";

// Beat 1 — Hook (0s → 8.98s = 269 frames)
// "Un pays de seize millions d'habitants a fait bouger le prix de ta future voiture electrique."
// Globe style souverain + Zimbabwe overlay SVG (headless safe — pas de addLayer)

const BEAT_DURATION = BEATS.hook.endFrame - BEATS.hook.startFrame;

const ZW_CENTER: [number, number] = [29.15, -20.0];

const ZW_PATH =
  "M468.582,498.956L465.126,496.577L460.426,494.992L454.344,494.343L446.465,494.631L436.927,495.928L426.559,494.343L415.501,489.878L406.239,488.295L395.319,490.238L394.766,490.31L392.969,488.799L389.928,486.64L389.928,484.264L390.482,481.67L391.312,477.641L393.247,474.182L396.149,470.722L397.669,467.694L397.669,464.451L397.117,462.724L395.32,460.999L393.247,458.623L393.109,455.812L394.352,453.006L396.149,450.413L397.392,448.904L398.359,447.178L398.359,444.802L397.669,441.56L396.287,438.75L394.628,436.588L394.766,432.773L396.701,429.96L399.741,427.368L404.028,425.641L408.867,424.129L410.248,421.965L410.109,419.587L409.281,418.295L407.898,417.649L406.378,415.915L404.995,413.107L402.921,410.299L400.985,407.492L400.017,403.246L399.188,401.52L398.497,399.578L398.773,397.203L400.156,394.613L402.368,393.101L405.548,392.24L409.281,391.163L413.428,389.652L416.884,387.275L419.094,384.034L420.613,382.09L421.997,380.578L423.931,380.146L426.559,380.793L430.292,381.44L433.61,381.44L436.65,380.578L439.69,378.201L442.454,374.96L445.633,371.503L448.535,368.694L451.437,366.75L455.033,364.158L458.075,361.133L461.115,357.675L463.877,354.433L466.365,351.192L468.444,348.167L469.411,345.574L469.135,342.55L467.614,339.741L466.089,336.499L465.676,333.475L466.089,330.882L468.167,328.72L470.794,327.424L473.973,326.561L477.981,325.7L481.438,325.7L484.617,326.561L487.381,328.072L490.974,329.797L494.846,331.095L498.994,331.309L502.589,330.231L506.046,328.072L508.394,326.561L510.882,325.484L513.645,325.7L516.547,327.424L519.587,329.367L522.075,331.095L525.115,333.475L527.74,336.284L529.538,339.741L530.919,343.196L532.576,346.22L534.373,348.167L534.373,350.974L533.269,353.998L531.748,357.244L530.781,360.271L530.781,363.51L531.748,367.182L533.545,370.638L534.373,373.446L534.373,376.255L533.545,378.634L531.748,381.44L529.538,384.034L527.74,386.627L526.22,388.786L525.115,390.73L523.594,393.534L521.66,396.341L519.587,399.795L518.066,403.03L517.515,406.5L517.237,409.307L517.237,412.548L516.547,416.22L515.44,419.587L514.474,423.483L514.198,427.584L514.474,431.041L515.164,434.065L515.44,437.089L514.888,440.13L513.921,443.372L513.369,446.178L513.508,449.42L514.198,452.228L515.164,455.252L516.547,458.277L518.204,461.085L519.725,463.459L520.969,465.187L521.521,466.913L520.969,468.638L519.449,470.362L517.237,472.305L514.888,474.25L513.369,476.192L512.817,478.352L512.817,480.727L512.817,483.099L511.158,485.476L508.946,487.635L506.736,489.359L504.524,490.651L503.005,492.806L503.005,495.828L503.005,498.419L502.727,500.579L501.484,501.656L499.41,501.441L497.06,499.929L494.571,498.419L492.085,497.991L489.459,498.849L486.833,500.794L484.343,501.656L481.161,501.441L478.259,500.362L475.77,499.5L473.42,499.929L471.347,499.929Z";

// Bounding box geo du Zimbabwe (Natural Earth)
const ZW_GEO = { minLon: 25.2, maxLon: 33.1, minLat: -22.4, maxLat: -15.6 };
// Bounding box SVG du path (viewBox 385 320 155 185)
const ZW_SVG = { minX: 385, minY: 320, w: 155, h: 185 };

// Camera keyframes — lat plus bas = globe remonte sur l'ecran, libere espace panel
type CamKf = { frame: number; lon: number; lat: number; zoom: number };
const CAM_KFS: CamKf[] = [
  { frame: 0,            lon: 10,               lat: -8,             zoom: 1.2  },
  { frame: 60,           lon: ZW_CENTER[0] - 8, lat: ZW_CENTER[1] + 4, zoom: 1.55 },
  { frame: 120,          lon: ZW_CENTER[0],     lat: ZW_CENTER[1] - 4, zoom: 1.75 },
  { frame: BEAT_DURATION, lon: ZW_CENTER[0],    lat: ZW_CENTER[1] - 4, zoom: 1.85 },
];

const eio = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

function lerpCam(frame: number, kfs: CamKf[]): CamKf {
  if (frame <= kfs[0].frame) return kfs[0];
  if (frame >= kfs[kfs.length - 1].frame) return kfs[kfs.length - 1];
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i], b = kfs[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = eio((frame - a.frame) / (b.frame - a.frame));
      return { frame, lon: a.lon + (b.lon - a.lon) * t, lat: a.lat + (b.lat - a.lat) * t, zoom: a.zoom + (b.zoom - a.zoom) * t };
    }
  }
  return kfs[kfs.length - 1];
}

// Sous-echantillonnage du path SVG → points geo → pixels ecran
function samplePath(d: string, every = 4): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  const re = /([ML])([\d.]+),([\d.]+)/g;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(d)) !== null) {
    if (i % every === 0 || m[1] === "M") pts.push([parseFloat(m[2]), parseFloat(m[3])]);
    i++;
  }
  return pts;
}

const ZW_PTS = samplePath(ZW_PATH, 4);

function toScreenPoly(map: mapboxgl.Map, pts: Array<[number, number]>): string {
  return pts.map(([sx, sy]) => {
    const lon = ZW_GEO.minLon + ((sx - ZW_SVG.minX) / ZW_SVG.w) * (ZW_GEO.maxLon - ZW_GEO.minLon);
    const lat = ZW_GEO.maxLat - ((sy - ZW_SVG.minY) / ZW_SVG.h) * (ZW_GEO.maxLat - ZW_GEO.minLat);
    const p = map.project([lon, lat]);
    return `${p.x},${p.y}`;
  }).join(" ");
}

// Sous-titres (beat court — pas de karaoke)
const SUBS = [
  { start: AUDIO_SEGMENTS.beat1SeizeMillions, end: BEATS.hook.startFrame + 100,  text: "Un pays de seize millions d'habitants" },
  { start: BEATS.hook.startFrame + 100,       end: AUDIO_SEGMENTS.beat1DixPourCent - 5, text: "a fait bouger le prix" },
  { start: AUDIO_SEGMENTS.beat1DixPourCent,   end: BEATS.hook.endFrame,           text: "de ta future voiture electrique." },
];

const ACCENT   = "#c8a951";
const PANEL_X  = 60;
const PANEL_Y  = 1420;
const PANEL_W  = 960;
const PANEL_H  = 230;
const F_RETICLE = 80;
const F_LINE    = 100;
const F_PANEL   = 118;
const F_NAME    = 142;

export const Beat1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Beat1Hook"));
  const [ready, setReady] = useState(false);
  const [pinScreen, setPinScreen] = useState<{ x: number; y: number } | null>(null);
  const [zwPoly, setZwPoly] = useState<string>("");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const token = process.env.REMOTION_MAPBOX_TOKEN ?? "";
    if (!token) { continueRender(handle); return; }

    mapboxgl.accessToken = token;
    const c0 = CAM_KFS[0];
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      projection: { name: "globe" } as mapboxgl.ProjectionSpecification,
      center: [c0.lon, c0.lat],
      zoom: c0.zoom,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      map.setFog({
        color: "#0a1834",
        "high-color": "#1a2548",
        "horizon-blend": 0.04,
        "space-color": "#020714",
        "star-intensity": 0.65,
      });
      for (const l of map.getStyle().layers ?? []) {
        if (l.type === "symbol") map.setLayoutProperty(l.id, "visibility", "none");
      }
      setReady(true);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [handle]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const cam = lerpCam(frame, CAM_KFS);
    mapRef.current.jumpTo({ center: [cam.lon, cam.lat], zoom: cam.zoom });
    const pin = mapRef.current.project(ZW_CENTER);
    setPinScreen({ x: pin.x, y: pin.y });
    setZwPoly(toScreenPoly(mapRef.current, ZW_PTS));
  }, [frame, ready]);

  const reticleP = spring({ frame: frame - F_RETICLE, fps, config: { damping: 14,  stiffness: 120 }, durationInFrames: 22 });
  const linkP    = spring({ frame: frame - F_LINE,    fps, config: { damping: 100, stiffness: 70  }, durationInFrames: 25 });
  const panelP   = spring({ frame: frame - F_PANEL,   fps, config: { damping: 90,  stiffness: 65  }, durationInFrames: 32 });
  const nameOp   = spring({ frame: frame - F_NAME,    fps, config: { damping: 150, stiffness: 100 }, durationInFrames: 22 });

  const pulseScale = 1 + 0.06 * Math.sin(frame * 0.18);
  const panelTY    = interpolate(panelP, [0, 1], [50, 0]);

  const inSilence = frame >= SILENCES.afterHook.startFrame;
  const haloOp    = inSilence
    ? 0.18 + 0.1 * Math.sin((frame - SILENCES.afterHook.startFrame) * 0.25)
    : 0.08 + 0.04 * Math.sin(frame * 0.12);

  const activeSub = SUBS.find(s => frame >= s.start && frame <= s.end);
  const subOp = activeSub
    ? interpolate(frame, [activeSub.start, activeSub.start + 8], [0, 1], { extrapolateRight: "clamp" })
    : 0;

  const LINE_CX = PANEL_X + PANEL_W / 2;

  return (
    <AbsoluteFill style={{ background: "#020714" }}>
      <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, width, height }} />
      <style>{`.mapboxgl-ctrl-attrib,.mapboxgl-ctrl-logo{display:none!important}`}</style>

      <svg
        width={width} height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="glow-zw" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="20" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Zimbabwe fill — overlay SVG (headless safe, pas de addLayer) */}
        {zwPoly && (
          <>
            <polygon points={zwPoly} fill={ACCENT} fillOpacity={haloOp * 2.5} filter="url(#glow-zw)" />
            <polygon points={zwPoly} fill={ACCENT} fillOpacity={0.75} stroke={ACCENT} strokeWidth={1.5} strokeOpacity={0.95} />
          </>
        )}

        {/* Reticule sur centroid */}
        {pinScreen && reticleP > 0.01 && (
          <g transform={`translate(${pinScreen.x} ${pinScreen.y}) scale(${reticleP * pulseScale})`} opacity={reticleP}>
            <circle cx="0" cy="0" r="44" fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="4 4" opacity="0.85" />
            <circle cx="0" cy="0" r="22" fill="none" stroke={ACCENT} strokeWidth="1.5" opacity="0.65" />
            <circle cx="0" cy="0" r="3" fill={ACCENT} />
            <line x1="-58" y1="0" x2="-30" y2="0" stroke={ACCENT} strokeWidth="2" />
            <line x1="30"  y1="0" x2="58"  y2="0" stroke={ACCENT} strokeWidth="2" />
            <line x1="0" y1="-58" x2="0" y2="-30" stroke={ACCENT} strokeWidth="2" />
            <line x1="0" y1="30"  x2="0" y2="58"  stroke={ACCENT} strokeWidth="2" />
          </g>
        )}

        {/* Ligne pointillee vers panel */}
        {pinScreen && linkP > 0.01 && (
          <g opacity={linkP}>
            <line
              x1={pinScreen.x} y1={pinScreen.y + 55}
              x2={LINE_CX}     y2={PANEL_Y - 6}
              stroke={ACCENT} strokeWidth="2" strokeDasharray="6 6" strokeOpacity="0.8"
            />
            <polygon
              points={`${LINE_CX - 8},${PANEL_Y - 14} ${LINE_CX + 8},${PANEL_Y - 14} ${LINE_CX},${PANEL_Y - 2}`}
              fill={ACCENT}
            />
          </g>
        )}

        {/* Panel bleu nuit */}
        {panelP > 0.01 && (
          <g transform={`translate(0 ${panelTY})`} opacity={panelP}>
            <rect x={PANEL_X} y={PANEL_Y} width={PANEL_W} height={PANEL_H} fill="#1a2548" fillOpacity={0.96} rx={12} />
            <rect x={PANEL_X} y={PANEL_Y} width={PANEL_W} height={PANEL_H} fill="none" stroke={ACCENT} strokeWidth="1.5" strokeOpacity={0.5} rx={12} />
            <rect x={PANEL_X} y={PANEL_Y} width={5} height={PANEL_H} fill={ACCENT} rx={3} />
            {/* Silhouette Zimbabwe dans panel — svg imbriqué dans le canvas SVG principal */}
            {panelP > 0.01 && (
              <svg
                x={PANEL_X + PANEL_W - 210}
                y={PANEL_Y + 12}
                width={195}
                height={PANEL_H - 24}
                viewBox="385 320 155 185"
                overflow="hidden"
                opacity={nameOp * panelP}
              >
                <path
                  d={ZW_PATH}
                  fill="#c8a951"
                  fillOpacity="0.35"
                  stroke="#c8a951"
                  strokeWidth="1.8"
                  strokeOpacity="0.95"
                />
              </svg>
            )}
          </g>
        )}
      </svg>

      {/* Texte panel */}
      {panelP > 0.01 && (
        <div style={{
          position: "absolute",
          left: PANEL_X + 44,
          top: PANEL_Y + 36 + panelTY,
          opacity: nameOp * panelP,
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 82,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.1em",
            lineHeight: 1,
          }}>
            ZIMBABWE
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 22,
            color: ACCENT,
            letterSpacing: "0.22em",
            marginTop: 10,
            opacity: 0.88,
          }}>
            AFRIQUE AUSTRALE
          </div>
        </div>
      )}

      {/* Sous-titres sous le panel */}
      {activeSub && (
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          top: PANEL_Y + PANEL_H + 20,
          display: "flex",
          justifyContent: "center",
          paddingLeft: 60,
          paddingRight: 60,
          opacity: subOp,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 34,
            color: "#f0e8d8",
            lineHeight: 1.4,
            background: "rgba(8,13,20,0.78)",
            padding: "14px 28px",
            borderRadius: 8,
            textAlign: "center",
          }}>
            {activeSub.text}
          </div>
        </div>
      )}

      <Audio
        src={staticFile("souverain/zimbabwe-lithium/audio/narration-zimbabwe-v1.mp3")}
        startFrom={BEATS.hook.startFrame}
        trimAfter={BEATS.hook.endFrame}
      />
    </AbsoluteFill>
  );
};
