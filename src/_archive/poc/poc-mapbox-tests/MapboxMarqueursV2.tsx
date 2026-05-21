import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  MapboxBrandingHide,
  removeLabels,
  type CamState,
} from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const MAPBOX_MARQUEURS_V2_FRAMES = 600; // 20s @ 30fps

// Caméra Afrique de l'Ouest — format vertical
const CAM: CamState = { lon: -3.5, lat: 12.5, zoom: 3.6, pitch: 15, bearing: 0 };

// Marqueurs — apparition sequentielle
const PINS = [
  { id: "ghana",    lon: -1.023,  lat:  7.947, type: "ornement",  label: "GHANA",    color: "#D4AF37", value: 0,  appearAt: 30  },
  { id: "mali",     lon: -2.000,  lat: 17.571, type: "chiffre",   label: "MALI",     color: "#E8A020", value: 1,  appearAt: 90  },
  { id: "senegal",  lon: -14.452, lat: 14.497, type: "drapeau",   label: "SÉNÉGAL",  color: "#2E7D32", value: 0,  appearAt: 150 },
  { id: "nigeria",  lon:  8.675,  lat:  9.082, type: "portrait",  label: "NIGERIA",  color: "#C62828", value: 0,  appearAt: 210 },
  { id: "niger",    lon:  8.082,  lat: 17.608, type: "pulse",     label: "NIGER",    color: "#7B5EA7", value: 0,  appearAt: 270 },
  { id: "burkina",  lon: -1.562,  lat: 12.364, type: "tag",       label: "BURKINA",  color: "#D4AF37", value: 0,  appearAt: 330 },
  { id: "guinee",   lon: -11.307, lat: 11.000, type: "losange",   label: "GUINÉE",   color: "#4A90D9", value: 0,  appearAt: 390 },
] as const;

// ---------------------------------------------------------------------------
// Hook projection Mapbox → pixel
// ---------------------------------------------------------------------------
const useProjection = (map: mapboxgl.Map | null, points: { lon: number; lat: number }[]) => {
  const [positions, setPositions] = useState<({ x: number; y: number } | null)[]>(
    points.map(() => null)
  );
  useEffect(() => {
    if (!map) return;
    const update = () => {
      setPositions(points.map(({ lon, lat }) => {
        const p = map.project([lon, lat]);
        return { x: p.x, y: p.y };
      }));
    };
    map.on("render", update);
    update();
    return () => { map.off("render", update); };
  }, [map]);
  return positions;
};

// ---------------------------------------------------------------------------
// spring helper
// ---------------------------------------------------------------------------
const useSpring = (elapsed: number) =>
  spring({ frame: Math.max(0, elapsed), fps: 30, config: { damping: 200 } });

// ---------------------------------------------------------------------------
// A — Ornemental doré
// ---------------------------------------------------------------------------
const MarqueurOrnement: React.FC<{ color: string; label: string; elapsed: number }> = ({ color, label, elapsed }) => {
  const s = useSpring(elapsed);
  const op = interpolate(elapsed, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g transform={`scale(${s})`} opacity={op}>
      <circle r={24} fill="none" stroke={color} strokeWidth={1.5} opacity={0.5} strokeDasharray="4 3" />
      <circle r={17} fill={color} opacity={0.92} />
      <circle r={5}  fill="#1a1209" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <line key={a}
            x1={Math.cos(rad) * 19} y1={Math.sin(rad) * 19}
            x2={Math.cos(rad) * 26} y2={Math.sin(rad) * 26}
            stroke={color} strokeWidth={a % 90 === 0 ? 2 : 1} opacity={a % 90 === 0 ? 0.9 : 0.4}
          />
        );
      })}
      <text y={40} textAnchor="middle" fill={color} fontSize={11} fontFamily="Georgia, serif" fontWeight="700" letterSpacing={2}>{label}</text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// B — Pion chiffré
// ---------------------------------------------------------------------------
const MarqueurChiffre: React.FC<{ color: string; label: string; value: number; elapsed: number }> = ({ color, label, value, elapsed }) => {
  const s = useSpring(elapsed);
  const op = interpolate(elapsed, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g transform={`scale(${s})`} opacity={op}>
      <circle r={19} fill="#1a1209" stroke={color} strokeWidth={2.5} />
      <text y={6} textAnchor="middle" fill={color} fontSize={17} fontFamily="Georgia, serif" fontWeight="900">{value + 1}</text>
      <polygon points="0,19 -6,30 6,30" fill={color} />
      <text y={44} textAnchor="middle" fill={color} fontSize={10} fontFamily="Georgia, serif" fontWeight="700" letterSpacing={2}>{label}</text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// C — Drapeau Sénégal
// ---------------------------------------------------------------------------
const MarqueurDrapeau: React.FC<{ label: string; elapsed: number }> = ({ label, elapsed }) => {
  const s = useSpring(elapsed);
  const op = interpolate(elapsed, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g transform={`scale(${s})`} opacity={op}>
      <clipPath id="clip-flag"><circle r={19} /></clipPath>
      <g clipPath="url(#clip-flag)">
        <rect x={-19} y={-19} width={13} height={38} fill="#00853F" />
        <rect x={-6}  y={-19} width={12} height={38} fill="#FDEF42" />
        <rect x={6}   y={-19} width={13} height={38} fill="#E31B23" />
        <text y={5} textAnchor="middle" fill="#00853F" fontSize={14} fontWeight="bold">★</text>
      </g>
      <circle r={20} fill="none" stroke="#D4AF37" strokeWidth={2} />
      <text y={36} textAnchor="middle" fill="#D4AF37" fontSize={10} fontFamily="Georgia, serif" fontWeight="700" letterSpacing={1.5}>{label}</text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// D — Portrait Gemini dans médaillon
// ---------------------------------------------------------------------------
const MarqueurPortrait: React.FC<{ color: string; label: string; elapsed: number }> = ({ color, label, elapsed }) => {
  const s = useSpring(elapsed);
  const op = interpolate(elapsed, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const r = 26;
  return (
    <g transform={`scale(${s})`} opacity={op}>
      {/* Anneau extérieur ornemental */}
      <circle r={r + 5} fill="none" stroke={color} strokeWidth={2} opacity={0.5} />
      <circle r={r + 5} fill="none" stroke={color} strokeWidth={1} opacity={0.3} strokeDasharray="3 4" />
      {/* Fond sombre */}
      <circle r={r} fill="#1a1209" />
      {/* Portrait clippé dans le cercle — focus haut (visage) */}
      <clipPath id="clip-portrait"><circle r={r} /></clipPath>
      <image
        href={staticFile("poc-mapbox-tests/portrait-roi.png")}
        x={-r}
        y={-r * 1.1}
        width={r * 2}
        height={r * 2.8}
        clipPath="url(#clip-portrait)"
        preserveAspectRatio="xMidYMin slice"
      />
      {/* Anneau couleur par-dessus */}
      <circle r={r} fill="none" stroke={color} strokeWidth={2.5} />
      {/* Pointe basse */}
      <polygon points={`0,${r} -6,${r + 10} 6,${r + 10}`} fill={color} />
      {/* Label */}
      <text y={r + 22} textAnchor="middle" fill={color} fontSize={10} fontFamily="Georgia, serif" fontWeight="700" letterSpacing={1.5}>{label}</text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// E — Pulse animé (onde radar)
// ---------------------------------------------------------------------------
const MarqueurPulse: React.FC<{ color: string; label: string; elapsed: number; frame: number }> = ({ color, label, elapsed, frame }) => {
  const s = useSpring(elapsed);
  const op = interpolate(elapsed, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  // 3 ondes décalées en phase
  const waves = [0, 20, 40].map((offset) => {
    const cycle = ((frame + offset) % 60) / 60;
    const r = 14 + cycle * 30;
    const waveOp = (1 - cycle) * 0.6;
    return { r, waveOp };
  });
  return (
    <g transform={`scale(${s})`} opacity={op}>
      {waves.map(({ r, waveOp }, i) => (
        <circle key={i} r={r} fill="none" stroke={color} strokeWidth={1.5} opacity={waveOp} />
      ))}
      <circle r={10} fill={color} opacity={0.9} />
      <circle r={4}  fill="#1a1209" />
      <text y={56} textAnchor="middle" fill={color} fontSize={10} fontFamily="Georgia, serif" fontWeight="700" letterSpacing={2}>{label}</text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// F — Tag éditorial (rectangle + ligne pointillée + stat)
// ---------------------------------------------------------------------------
const MarqueurTag: React.FC<{ color: string; label: string; elapsed: number }> = ({ color, label, elapsed }) => {
  const s = useSpring(elapsed);
  const op = interpolate(elapsed, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const tagW = 100;
  const tagH = 36;
  return (
    <g transform={`scale(${s})`} opacity={op}>
      {/* Point ancrage */}
      <circle r={5} fill={color} />
      {/* Ligne pointillée vers tag */}
      <line x1={5} y1={-5} x2={20} y2={-22} stroke={color} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
      {/* Rectangle tag */}
      <g transform="translate(20, -22)">
        <rect x={0} y={-tagH / 2} width={tagW} height={tagH} rx={4} fill="#1a1209" stroke={color} strokeWidth={1.5} opacity={0.95} />
        {/* Bande couleur gauche */}
        <rect x={0} y={-tagH / 2} width={4} height={tagH} rx={2} fill={color} />
        {/* Texte pays */}
        <text x={12} y={-4} fill={color} fontSize={10} fontFamily="Georgia, serif" fontWeight="700" letterSpacing={1.5}>{label}</text>
        {/* Stat exemple */}
        <text x={12} y={10} fill="#ffffff" fontSize={9} fontFamily="Georgia, serif" opacity={0.7}>12% royalties</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------------------
// G — Losange premium
// ---------------------------------------------------------------------------
const MarqueurLosange: React.FC<{ color: string; label: string; elapsed: number }> = ({ color, label, elapsed }) => {
  const s = useSpring(elapsed);
  const op = interpolate(elapsed, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const size = 18;
  return (
    <g transform={`scale(${s})`} opacity={op}>
      {/* Losange externe (contour) */}
      <polygon
        points={`0,${-(size + 6)} ${size + 6},0 0,${size + 6} ${-(size + 6)},0`}
        fill="none" stroke={color} strokeWidth={1.5} opacity={0.5}
      />
      {/* Losange principal (rempli) */}
      <polygon
        points={`0,${-size} ${size},0 0,${size} ${-size},0`}
        fill={color} opacity={0.9}
      />
      {/* Centre */}
      <polygon
        points={`0,${-6} ${6},0 0,${6} ${-6},0`}
        fill="#1a1209"
      />
      {/* Tirets ornementaux aux 4 coins */}
      {[[-1, 0], [1, 0], [0, -1], [0, 1]].map(([dx, dy], i) => (
        <line key={i}
          x1={dx * (size + 7)} y1={dy * (size + 7)}
          x2={dx * (size + 13)} y2={dy * (size + 13)}
          stroke={color} strokeWidth={1.5}
        />
      ))}
      <text y={40} textAnchor="middle" fill={color} fontSize={10} fontFamily="Georgia, serif" fontWeight="700" letterSpacing={2}>{label}</text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// Composition principale — 1080×1920 vertical
// ---------------------------------------------------------------------------
export const MapboxMarqueursV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-marqueurs-v2"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [CAM.lon, CAM.lat],
      zoom: CAM.zoom,
      pitch: CAM.pitch,
      bearing: CAM.bearing,
      interactive: false,
      preserveDrawingBuffer: true,
    });
    map.on("style.load", () => {
      removeLabels(map);
      if (map.getLayer("water"))      map.setPaintProperty("water",      "fill-color", "#03224c");
      if (map.getLayer("background")) map.setPaintProperty("background", "fill-color", "#2a1e0e");
      mapRef.current = map;
      setReady(true);
      continueRender(handle);
    });
    return () => map.remove();
  }, []);

  const positions = useProjection(mapRef.current, PINS.map((p) => ({ lon: p.lon, lat: p.lat })));

  // Titre qui apparait au debut
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#1a1209" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />

      {ready && (
        <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={width} height={height}>
          {PINS.map((pin, i) => {
            const pos = positions[i];
            if (!pos) return null;
            const elapsed = frame - pin.appearAt;
            if (elapsed < 0) return null;

            return (
              <g key={pin.id} transform={`translate(${pos.x}, ${pos.y})`}>
                {pin.type === "ornement"  && <MarqueurOrnement  color={pin.color} label={pin.label} elapsed={elapsed} />}
                {pin.type === "chiffre"   && <MarqueurChiffre   color={pin.color} label={pin.label} value={i} elapsed={elapsed} />}
                {pin.type === "drapeau"   && <MarqueurDrapeau   label={pin.label} elapsed={elapsed} />}
                {pin.type === "portrait"  && <MarqueurPortrait  color={pin.color} label={pin.label} elapsed={elapsed} />}
                {pin.type === "pulse"     && <MarqueurPulse     color={pin.color} label={pin.label} elapsed={elapsed} frame={frame} />}
                {pin.type === "tag"       && <MarqueurTag       color={pin.color} label={pin.label} elapsed={elapsed} />}
                {pin.type === "losange"   && <MarqueurLosange   color={pin.color} label={pin.label} elapsed={elapsed} />}
              </g>
            );
          })}
        </svg>
      )}

      {/* Titre */}
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0,
        textAlign: "center", opacity: titleOp,
        fontFamily: "Georgia, serif", color: "#D4AF37",
        fontSize: 22, letterSpacing: 4, fontWeight: 700,
      }}>
        MARQUEURS — POC R&D
      </div>

      {/* Légende verticale */}
      <div style={{
        position: "absolute", bottom: 60, left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        opacity: interpolate(frame, [420, 450], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        {[
          { label: "ORNEMENTAL", color: "#D4AF37" },
          { label: "CHIFFRÉ",    color: "#E8A020" },
          { label: "DRAPEAU",    color: "#D4AF37" },
          { label: "PORTRAIT",   color: "#C62828" },
          { label: "PULSE",      color: "#7B5EA7" },
          { label: "TAG",        color: "#D4AF37" },
          { label: "LOSANGE",    color: "#4A90D9" },
        ].map(({ label, color }) => (
          <div key={label} style={{
            fontFamily: "Georgia, serif", fontSize: 10,
            letterSpacing: 2, color, opacity: 0.8,
          }}>{label}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
