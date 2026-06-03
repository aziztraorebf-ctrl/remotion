import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  applyGeoAfriqueV5,
  MapboxBrandingHide,
  MAPBOX_STYLES,
} from "../../../_shared/mapbox/MapboxBase";
import { useClipFlags, ClipFlagsLayer, ClipFlag } from "../../../_shared/mapbox/useClipFlags";
import { SEGMENTS } from "../timing";
import { MAROC_WORDS } from "../maroc-words";

// Beat 1 — Phosphate v12
// Architecture : 1 Map continue, altitude fixe, drift continu
// Drapeaux projetes dans silhouettes (MAR + ESP + FRA + DEU)
// Pas de zoom-in — carte lisible a tout moment
// Plaques avec ligne de connexion + role explicite

const SEG      = SEGMENTS.beat1_phosphate;
const DURATION = SEG.endFrame - SEG.startFrame;

const GOLD  = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY  = "#16213a";
const ACCENT= "#c08820";
const RED   = "#e63946";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const KHOURIBGA: [number, number] = [-6.91, 32.88];
const KENITRA:   [number, number] = [-6.58, 34.26];

// Timing local
const F_SLAM_START = 53;
const F_SLAM_PEAK  = 68;
const F_SLAM_END   = 110;
const F_KHOURIBGA  = 130;
const F_LINE       = 280;
const F_KENITRA    = 360;
const F_EUROPE     = 430;
const F_ESP        = 440;
const F_FRA        = 460;
const F_DEU        = 480;
const F_BEAT_END   = DURATION;

// Drapeaux clip SVG (vraies images officielles HD, net a toute echelle).
// Maroc des f0 (le sujet), Europe sequentielle f440-480 (marche export).
const BEAT1_FLAGS: ClipFlag[] = [
  { iso: "MAR", geoNames: ["Morocco", "W. Sahara"], flagFile: "ma.png", at: 0,     bgColor: "#c1272d", fadeFrames: 40 },
  { iso: "ESP", geoNames: ["Spain"],                flagFile: "es.png", at: F_ESP, bgColor: "#c60b1e", fadeFrames: 30 },
  { iso: "FRA", geoNames: ["France"],               flagFile: "fr.png", at: F_FRA, bgColor: "#002395", fadeFrames: 30, mainlandBox: [-5, 41, 10, 52] },
  { iso: "DEU", geoNames: ["Germany"],              flagFile: "de.png", at: F_DEU, bgColor: "#1a1a1a", fadeFrames: 30 },
];

const HALO_PERIOD = 80;

// ── Helpers ────────────────────────────────────────────────────────────────────
function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }
function easeInOut(t: number) { const c = clamp01(t); return c < 0.5 ? 2*c*c : -1+(4-2*c)*c; }
function easeOut(t: number)   { return 1 - Math.pow(1 - clamp01(t), 3); }

// ── Camera : altitude fixe Maroc entier + drift continu ───────────────────────
// Regle : jamais en dessous de zoom 4.6 — Maroc + Espagne + Gibraltar visibles
function getCam(frame: number): { lon: number; lat: number; zoom: number; pitch: number; bearing: number } {
  // Drift bearing lent -5 → +5 sur toute la duree
  const bearing = interpolate(frame, [0, F_BEAT_END], [-5, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Leger dolly vers le nord (Maroc → Detroit) quand les arcs vers Europe s'activent
  const lat = frame < F_EUROPE
    ? interpolate(frame, [0, F_EUROPE], [32.0, 33.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : interpolate(frame, [F_EUROPE, F_BEAT_END], [33.0, 35.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoom = frame < F_EUROPE
    ? 4.8
    : interpolate(frame, [F_EUROPE, F_BEAT_END], [4.8, 4.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { lon: -5.5, lat, zoom, pitch: 0, bearing };
}

// ── pushCanvas → Mapbox fill-pattern ─────────────────────────────────────────
function pushCanvas(map: mapboxgl.Map, id: string, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data as unknown as Uint8Array;
  if (!map.hasImage(id)) map.addImage(id, { width: canvas.width, height: canvas.height, data });
  else { try { map.updateImage(id, { width: canvas.width, height: canvas.height, data }); } catch { map.removeImage(id); map.addImage(id, { width: canvas.width, height: canvas.height, data }); } }
}

// ── Drapeau Maroc en canvas pur (pas de fetch — immediat a f0) ────────────────
function drawMarocFlagCanvas(size = 128): HTMLCanvasElement {
  const c = document.createElement("canvas"); c.width = size; c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#c1272d"; ctx.fillRect(0, 0, size, size);
  // Etoile verte 5 branches
  const cx = size/2; const cy = size/2; const R = size*0.28; const r = R*0.38;
  ctx.fillStyle = "#006233"; ctx.strokeStyle = "#006233"; ctx.lineWidth = size*0.015;
  ctx.beginPath();
  for (let i=0; i<5; i++) {
    const ao = (i*72-90)*Math.PI/180; const ai = ((i*72+36)-90)*Math.PI/180;
    i===0 ? ctx.moveTo(cx+Math.cos(ao)*R, cy+Math.sin(ao)*R) : ctx.lineTo(cx+Math.cos(ao)*R, cy+Math.sin(ao)*R);
    ctx.lineTo(cx+Math.cos(ai)*r, cy+Math.sin(ai)*r);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  return c;
}

// ── Charger drapeau depuis public/_shared/flags/ (local, headless-safe) ───────
function loadFlagCanvas(filename: string, size = 256): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = size; c.height = size;
      c.getContext("2d")!.drawImage(img, 0, 0, size, size); resolve(c);
    };
    img.onerror = () => { const c = document.createElement("canvas"); c.width = size; c.height = size; resolve(c); };
    img.src = staticFile(`_shared/flags/${filename}`);
  });
}

// ── Plaque geolocalise (label avec ligne de connexion) ────────────────────────
const GeoPlaque: React.FC<{
  pos: { x: number; y: number } | null;
  opacity: number;
  sp: number;
  title: string;
  subtitle: string;
  color: string;
  side?: "right" | "left";
}> = ({ pos, opacity, sp, title, subtitle, color, side = "right" }) => {
  if (!pos || opacity <= 0.01) return null;
  const offset = side === "right" ? 28 : -28;
  const lineDir = side === "right" ? 1 : -1;
  const translateX = (1 - sp) * 16 * lineDir;

  return (
    <div style={{
      position: "absolute",
      left: pos.x + offset,
      top: pos.y - 34,
      opacity,
      transform: `translateX(${translateX}px)`,
      pointerEvents: "none",
    }}>
      {/* Ligne connexion dot → plaque */}
      <svg style={{ position: "absolute", left: side === "right" ? -28 : "auto", right: side === "left" ? -28 : "auto", top: 24, overflow: "visible" }} width={28} height={1}>
        <line x1={0} y1={0} x2={28} y2={0} stroke={color} strokeWidth={1.5} strokeOpacity={0.8} />
        <circle cx={side === "right" ? 0 : 28} cy={0} r={3} fill={color} />
      </svg>
      <div style={{ display: "flex", alignItems: "stretch", height: 56 }}>
        <div style={{ width: 4, background: color, borderRadius: 2, flexShrink: 0 }} />
        <div style={{ background: "rgba(13,21,37,0.92)", padding: "0 14px", display: "flex", flexDirection: "column", justifyContent: "center", border: `1px solid ${color}33`, borderLeft: "none", minWidth: 160 }}>
          <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 20, color: IVORY, letterSpacing: "0.1em", lineHeight: 1.1 }}>{title}</span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2, opacity: 0.9 }}>{subtitle}</span>
        </div>
      </div>
    </div>
  );
};

// ── Label destination arc (bout de ligne) ─────────────────────────────────────
const ArcLabel: React.FC<{
  pos: { x: number; y: number } | null;
  opacity: number;
  text: string;
  flagCode: string;
}> = ({ pos, opacity, text, flagCode }) => {
  if (!pos || opacity <= 0.01) return null;
  return (
    <div style={{
      position: "absolute",
      left: pos.x - 40,
      top: pos.y - 44,
      opacity,
      pointerEvents: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
    }}>
      <img
        src={staticFile(`_shared/flags/${flagCode}.png`)}
        width={32} height={20}
        style={{ borderRadius: 2, border: `1px solid ${IVORY}44`, objectFit: "cover" }}
      />
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: IVORY, letterSpacing: "0.1em", textTransform: "uppercase", textShadow: "0 0 6px #000", whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
};

// ── Popup 70% geolocalise ──────────────────────────────────────────────────────
const Popup70: React.FC<{ pos: { x: number; y: number } | null; opacity: number; sp: number }> = ({ pos, opacity, sp }) => {
  if (!pos || opacity <= 0.01) return null;
  return (
    <div style={{ position:"absolute", left:pos.x+32, top:pos.y-40, opacity, transform:`translateX(${(1-sp)*16}px)`, pointerEvents:"none" }}>
      <svg style={{ position:"absolute", left:-32, top:30, overflow:"visible" }} width={32} height={1}>
        <line x1={0} y1={0} x2={32} y2={0} stroke={GOLD} strokeWidth={1.5} strokeOpacity={0.7} />
        <circle cx={0} cy={0} r={3} fill={GOLD} />
      </svg>
      <div style={{ display:"flex", alignItems:"stretch", height:66 }}>
        <div style={{ width:4, background:GOLD, borderRadius:2, flexShrink:0 }} />
        <div style={{ background:"rgba(13,21,37,0.92)", padding:"0 16px", display:"flex", flexDirection:"column", justifyContent:"center", border:"1px solid rgba(200,169,81,0.25)", borderLeft:"none" }}>
          <span style={{ fontFamily:"'Anton',sans-serif", fontSize:42, color:GOLD, lineHeight:1, letterSpacing:"0.02em" }}>70%</span>
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:IVORY, letterSpacing:"0.1em", textTransform:"uppercase", opacity:0.8 }}>RÉSERVES MONDIALES</span>
        </div>
      </div>
    </div>
  );
};

// ── Karaoké ────────────────────────────────────────────────────────────────────
type WordTs = [string, number, number];
function buildPhrases(words: WordTs[], beatStartS: number) {
  const phrases: { words: WordTs[]; start: number; end: number }[] = [];
  let current: WordTs[] = [];
  for (let i = 0; i < words.length; i++) {
    current.push(words[i]);
    const next = words[i+1]; const gap = next ? next[1] - words[i][2] : 999;
    if (gap > 0.4 || current.length >= 6 || !next) {
      phrases.push({ words:[...current], start:current[0][1]-beatStartS, end:current[current.length-1][2]-beatStartS });
      current = [];
    }
  }
  return phrases;
}

const KaraokeSubtitles: React.FC<{ visible: boolean }> = ({ visible }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const currentS = SEG.startS + frame/fps;
  const beatWords = MAROC_WORDS.filter(w => w[1]>=SEG.startS-0.05 && w[2]<=SEG.endS+0.1);
  const phrases = buildPhrases(beatWords, SEG.startS);
  const hardShadow = "2px 2px 0 #000,-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,0 0 8px rgba(0,0,0,0.9)";
  const goldGlow   = "0 0 16px rgba(200,169,81,0.8),2px 2px 0 #000,-2px -2px 0 #000";
  if (!visible) return null;
  return (
    <div style={{ position:"absolute", bottom:160, left:0, right:0, display:"flex", justifyContent:"center" }}>
      {phrases.map((phrase,i) => {
        const nextStart = phrases[i+1]?.start ?? SEG.durationS;
        const localFrame = frame - Math.round(phrase.start*fps);
        const displayFrames = Math.round((nextStart-phrase.start)*fps)+5;
        if (localFrame<0 || localFrame>displayFrames) return null;
        const fadeIn  = spring({ frame:localFrame, fps, config:{damping:35,stiffness:130} });
        const fadeOut = interpolate(localFrame,[displayFrames-6,displayFrames+2],[1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
        return (
          <div key={i} style={{ position:"absolute", left:0, right:0, opacity:Math.min(fadeIn,fadeOut), textAlign:"center", padding:"0 48px" }}>
            <div style={{ display:"inline-block", background:"linear-gradient(180deg,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.65) 100%)", padding:"14px 24px", borderRadius:12, backdropFilter:"blur(2px)" }}>
              <p style={{ fontFamily:"'Anton',sans-serif", fontSize:58, fontWeight:400, margin:0, lineHeight:1.15, letterSpacing:"0.02em", textTransform:"uppercase", wordBreak:"break-word" }}>
                {phrase.words.map((w,j) => (
                  <span key={j} style={{ color:currentS>=w[1]?GOLD:"#fff", textShadow:currentS>=w[1]?goldGlow:hardShadow, marginRight:10, display:"inline-block" }}>{w[0]}</span>
                ))}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Composant principal ────────────────────────────────────────────────────────
export const Beat1Phosphate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const setupRef     = useRef(false);

  // Positions geolocalises (mises a jour chaque frame via map.project)
  const [khouribgaPos, setKhouribgaPos] = useState<{x:number;y:number}|null>(null);
  const [kenitraPos,   setKenitraPos]   = useState<{x:number;y:number}|null>(null);
  const [madridPos,    setMadridPos]    = useState<{x:number;y:number}|null>(null);
  const [parisPos,     setParisPos]     = useState<{x:number;y:number}|null>(null);
  const [berlinPos,    setBerlinPos]    = useState<{x:number;y:number}|null>(null);

  // ── Init Mapbox ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const cam0 = getCam(0);
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: [cam0.lon, cam0.lat], zoom: cam0.zoom, pitch: 0, bearing: cam0.bearing,
      interactive: false, attributionControl: false, fadeDuration: 0,
    });
    map.on("style.load", () => {
      try {
        (map as unknown as {setProjection:(p:string)=>void}).setProjection("mercator");
        applyGeoAfriqueV5(map);
        if (!map.getSource("cb")) map.addSource("cb", { type:"vector", url:"mapbox://mapbox.country-boundaries-v1" });

        // Drapeaux : geres par useClipFlags (clip SVG, vraies images) — pas de fill-pattern ici.

        // Frontiere laser Maroc
        if (!map.getLayer("maroc-laser")) map.addLayer({ id:"maroc-laser", type:"line", source:"cb", "source-layer":"country_boundaries",
          filter:["==",["get","iso_3166_1_alpha_3"],"MAR"],
          paint:{ "line-color":GOLD, "line-width":2.5, "line-opacity":0, "line-dasharray":[1,8] } });

        // Bordures pays europeens (le drapeau vient de l'overlay clip SVG)
        const euros = [
          { id:"esp-flag", iso:"ESP" },
          { id:"fra-flag", iso:"FRA" },
          { id:"deu-flag", iso:"DEU" },
        ];
        for (const e of euros) {
          if (!map.getLayer(e.id+"-border")) map.addLayer({ id:e.id+"-border", type:"line", source:"cb", "source-layer":"country_boundaries",
            filter:["==",["get","iso_3166_1_alpha_3"],e.iso],
            paint:{ "line-color":IVORY, "line-width":1.2, "line-opacity":0 } });
        }

        // Voisins neutres subtils
        if (!map.getLayer("neighbors")) map.addLayer({ id:"neighbors", type:"fill", source:"cb", "source-layer":"country_boundaries",
          filter:["match",["get","iso_3166_1_alpha_3"],["MAR","ESH","ESP","FRA","PRT","DEU","ITA","BEL","NLD"],false,true],
          paint:{ "fill-color":IVORY, "fill-opacity":0.03 } });

        // Ligne phosphate rouge Khouribga→Kenitra (sous les dots)
        if (!map.getSource("phosphate-line")) map.addSource("phosphate-line", { type:"geojson", data:{ type:"Feature", geometry:{ type:"LineString", coordinates:[KHOURIBGA,KENITRA] }, properties:{} } });
        if (!map.getLayer("phosphate-glow")) map.addLayer({ id:"phosphate-glow", type:"line", source:"phosphate-line", paint:{ "line-color":RED, "line-width":14, "line-opacity":0, "line-blur":6 } });
        if (!map.getLayer("phosphate-dash")) map.addLayer({ id:"phosphate-dash", type:"line", source:"phosphate-line", paint:{ "line-color":RED, "line-width":4, "line-dasharray":[4,3], "line-opacity":0 } });

        // Arcs export ivory (Kenitra → Madrid / Paris / Berlin)
        if (!map.getSource("export-arcs")) map.addSource("export-arcs", { type:"geojson", data:{
          type:"FeatureCollection", features:[
            { type:"Feature", geometry:{ type:"LineString", coordinates:[KENITRA,[-3.0,37.5],[-3.7,40.4]] }, properties:{ dest:"ESP" } },
            { type:"Feature", geometry:{ type:"LineString", coordinates:[KENITRA,[-1.0,41.0],[0.5,44.5],[2.35,48.85]] }, properties:{ dest:"FRA" } },
            { type:"Feature", geometry:{ type:"LineString", coordinates:[KENITRA,[0.0,42.0],[5.0,46.0],[13.4,52.5]] }, properties:{ dest:"DEU" } },
          ]
        }});
        if (!map.getLayer("export-glow")) map.addLayer({ id:"export-glow", type:"line", source:"export-arcs", paint:{ "line-color":IVORY, "line-width":8, "line-opacity":0, "line-blur":6 } });
        if (!map.getLayer("export-line")) map.addLayer({ id:"export-line", type:"line", source:"export-arcs", paint:{ "line-color":IVORY, "line-width":2, "line-dasharray":[3,4], "line-opacity":0 } });

        // Dots + halos EN DERNIER — par-dessus tous les fills et lignes
        if (!map.getSource("khouribga-src")) map.addSource("khouribga-src", { type:"geojson", data:{ type:"Feature", geometry:{ type:"Point", coordinates:KHOURIBGA }, properties:{} } });
        if (!map.getLayer("khouribga-halo")) map.addLayer({ id:"khouribga-halo", type:"circle", source:"khouribga-src", paint:{ "circle-radius":18, "circle-color":"transparent", "circle-stroke-color":ACCENT, "circle-stroke-width":2.5, "circle-stroke-opacity":0 } });
        if (!map.getLayer("khouribga-dot")) map.addLayer({ id:"khouribga-dot", type:"circle", source:"khouribga-src", paint:{ "circle-radius":13, "circle-color":ACCENT, "circle-stroke-color":GOLD, "circle-stroke-width":3, "circle-opacity":0, "circle-stroke-opacity":0 } });

        if (!map.getSource("kenitra-src")) map.addSource("kenitra-src", { type:"geojson", data:{ type:"Feature", geometry:{ type:"Point", coordinates:KENITRA }, properties:{} } });
        if (!map.getLayer("kenitra-halo")) map.addLayer({ id:"kenitra-halo", type:"circle", source:"kenitra-src", paint:{ "circle-radius":16, "circle-color":"transparent", "circle-stroke-color":RED, "circle-stroke-width":2.5, "circle-stroke-opacity":0 } });
        if (!map.getLayer("kenitra-dot")) map.addLayer({ id:"kenitra-dot", type:"circle", source:"kenitra-src", paint:{ "circle-radius":12, "circle-color":RED, "circle-stroke-color":IVORY, "circle-stroke-width":2, "circle-opacity":0, "circle-stroke-opacity":0 } });

        setupRef.current = true;
      } catch (_e) {}
    });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; setupRef.current = false; };
  }, []);

  // ── Engine frame ────────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const cam = getCam(frame);
    map.jumpTo({ center:[cam.lon,cam.lat], zoom:cam.zoom, pitch:0, bearing:cam.bearing });

    // Projeter positions geo
    try {
      const pk = map.project(KHOURIBGA); setKhouribgaPos({x:pk.x,y:pk.y});
      const pn = map.project(KENITRA);   setKenitraPos({x:pn.x,y:pn.y});
      const pm = map.project([-3.7,40.4]); setMadridPos({x:pm.x,y:pm.y});
      const pp = map.project([2.35,48.85]); setParisPos({x:pp.x,y:pp.y});
      const pb = map.project([13.4,52.5]);  setBerlinPos({x:pb.x,y:pb.y});
    } catch (_e) {}

    if (!setupRef.current) return;

    const safe = (id:string, prop:string, val:unknown) => {
      try { if (map.getLayer(id)) (map.setPaintProperty as (a:string,b:string,c:unknown)=>void)(id,prop,val); } catch(_e){}
    };

    // Drapeaux : geres par useClipFlags (overlay SVG), plus de fill-opacity ici.

    // Laser frontiere Maroc f0→f60
    const lp = clamp01(frame/60);
    const ld = interpolate(lp,[0,1],[1,14]);
    safe("maroc-laser","line-dasharray",[ld,Math.max(0.5,8-ld)]);
    safe("maroc-laser","line-opacity",interpolate(frame,[0,15,520,609],[0,0.9,0.9,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}));

    // Khouribga f130
    if (frame>=F_KHOURIBGA) {
      const kp = easeOut(clamp01((frame-F_KHOURIBGA)/20));
      safe("khouribga-dot","circle-opacity",kp); safe("khouribga-dot","circle-stroke-opacity",kp);
      const hf=(frame-F_KHOURIBGA)%HALO_PERIOD/HALO_PERIOD;
      safe("khouribga-halo","circle-radius",18+hf*32);
      safe("khouribga-halo","circle-stroke-opacity",interpolate(hf,[0,0.15,0.7,1],[0,0.9*kp,0.4*kp,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}));
    }

    // Ligne rouge phosphate f280
    if (frame>=F_LINE) {
      const lnp=easeOut(clamp01((frame-F_LINE)/35));
      safe("phosphate-dash","line-opacity",lnp);
      safe("phosphate-glow","line-opacity",lnp*0.30);
      const off=((frame-F_LINE)*0.6)%7;
      safe("phosphate-dash","line-dasharray",[Math.max(1,4-off*0.15),Math.max(1.5,3+off*0.15)]);
    }

    // Kenitra f360
    if (frame>=F_KENITRA) {
      const kn=easeOut(clamp01((frame-F_KENITRA)/20));
      safe("kenitra-dot","circle-opacity",kn); safe("kenitra-dot","circle-stroke-opacity",kn);
      const hf=(frame-F_KENITRA)%HALO_PERIOD/HALO_PERIOD;
      safe("kenitra-halo","circle-radius",16+hf*29);
      safe("kenitra-halo","circle-stroke-opacity",interpolate(hf,[0,0.15,0.7,1],[0,0.9*kn,0.4*kn,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}));
    }

    // Arcs export f430
    if (frame>=F_EUROPE) {
      const ap=easeOut(clamp01((frame-F_EUROPE)/50));
      safe("export-line","line-opacity",ap*0.85);
      safe("export-glow","line-opacity",ap*0.20);
      const off=((frame-F_EUROPE)*0.45)%7;
      safe("export-line","line-dasharray",[Math.max(1,3-off*0.08),Math.max(2,4+off*0.08)]);
    }

    // Bordures pays europeens (le drapeau vient de useClipFlags / overlay SVG)
    if (frame>=F_ESP) { const p=easeOut(clamp01((frame-F_ESP)/30)); safe("esp-flag-border","line-opacity",p); }
    if (frame>=F_FRA) { const p=easeOut(clamp01((frame-F_FRA)/30)); safe("fra-flag-border","line-opacity",p); }
    if (frame>=F_DEU) { const p=easeOut(clamp01((frame-F_DEU)/30)); safe("deu-flag-border","line-opacity",p); }
  });

  // Drapeaux clip SVG (vraies images, net a toute echelle)
  const { paths: flagPaths } = useClipFlags(mapRef, BEAT1_FLAGS, frame);

  // ── Dots CSS React (par-dessus tout, visibles a tout zoom) ───────────────────
  const khDotOp = frame>=F_KHOURIBGA ? interpolate(frame,[F_KHOURIBGA,F_KHOURIBGA+15,F_BEAT_END-15,F_BEAT_END],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}) : 0;
  const knDotOp = frame>=F_KENITRA   ? interpolate(frame,[F_KENITRA,F_KENITRA+15,F_BEAT_END-15,F_BEAT_END],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}) : 0;
  // Pulse halo : scale sin
  const khPulse = frame>=F_KHOURIBGA ? 1 + Math.sin((frame-F_KHOURIBGA)*0.15)*0.18 : 1;
  const knPulse = frame>=F_KENITRA   ? 1 + Math.sin((frame-F_KENITRA)*0.15)*0.18   : 1;

  // ── Overlays calcules ───────────────────────────────────────────────────────
  // Slam 70%
  const slamSp = spring({frame:Math.max(0,frame-F_SLAM_START),fps,config:{damping:8,stiffness:220},durationInFrames:F_SLAM_PEAK-F_SLAM_START});
  const slamScale = interpolate(slamSp,[0,1],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"})
    + (frame>F_SLAM_PEAK ? interpolate(frame,[F_SLAM_PEAK,F_SLAM_END],[0,1.6],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}) : 0);
  const veilOp = frame<F_SLAM_START ? 1
    : interpolate(frame,[F_SLAM_START,F_SLAM_PEAK,F_SLAM_END-8,F_SLAM_END+4],[1,0.82,0.35,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const slamVisible = frame>=F_SLAM_START-2 && frame<=F_SLAM_END+6;
  const bigFont = Math.round(width*0.38);
  const cx=width/2; const cy=height*0.48;

  // Popup 70%
  const popupOp = interpolate(frame,[F_KHOURIBGA,F_KHOURIBGA+20,F_LINE-20,F_LINE],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const popupSp = spring({frame:Math.max(0,frame-F_KHOURIBGA),fps,config:{damping:16},durationInFrames:25});

  // Plaques Khouribga + Kenitra
  const khOp = frame>=F_KHOURIBGA ? interpolate(frame,[F_KHOURIBGA,F_KHOURIBGA+20,F_BEAT_END-20,F_BEAT_END],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}) : 0;
  const khSp = spring({frame:Math.max(0,frame-F_KHOURIBGA),fps,config:{damping:16},durationInFrames:25});
  const knOp = frame>=F_KENITRA ? interpolate(frame,[F_KENITRA,F_KENITRA+20,F_BEAT_END-20,F_BEAT_END],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}) : 0;
  const knSp = spring({frame:Math.max(0,frame-F_KENITRA),fps,config:{damping:16},durationInFrames:20});

  // Labels destinations arcs
  const espOp = frame>=F_ESP+20 ? interpolate(frame,[F_ESP+20,F_ESP+40,F_BEAT_END-15,F_BEAT_END],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}) : 0;
  const fraOp = frame>=F_FRA+20 ? interpolate(frame,[F_FRA+20,F_FRA+40,F_BEAT_END-15,F_BEAT_END],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}) : 0;
  const deuOp = frame>=F_DEU+20 ? interpolate(frame,[F_DEU+20,F_DEU+40,F_BEAT_END-15,F_BEAT_END],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"}) : 0;

  const volNarr  = interpolate(frame,[0,8,F_BEAT_END-12,F_BEAT_END],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const volMusic = interpolate(frame,[0,20,F_BEAT_END-20,F_BEAT_END],[0,0.12,0.12,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});

  return (
    <AbsoluteFill style={{ background:NAVY }}>
      <Audio src={staticFile("souverain/maroc-batteries/audio/narration-maroc-v3.mp3")} startFrom={SEG.startFrame} volume={volNarr} />
      <Audio src={staticFile("souverain/maroc-batteries/audio/music-C-analytique-tendu.mp3")} startFrom={0} volume={volMusic} />
      {/* SFX — <Sequence> OBLIGATOIRE. Plancher 0.50. Map CONTINUE (dezoom lent) :
          PAS de swoosh-zoom (debut a altitude fixe) ni swoosh-pullback (dezoom trop lent).
          On garde les SFX d'EVENEMENT : slam stat, dots, plaque, allumage Europe. */}
      <Sequence from={F_SLAM_START} durationInFrames={20}><Audio src={staticFile("_shared/sfx/data/stat-tick.mp3")} volume={0.55} /></Sequence>
      <Sequence from={F_KHOURIBGA} durationInFrames={20}><Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.50} /></Sequence>
      <Sequence from={F_KENITRA} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.50} /></Sequence>
      <Sequence from={F_EUROPE} durationInFrames={20}><Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.50} /></Sequence>

      <div ref={containerRef} style={{ position:"absolute", inset:0, backgroundColor:NAVY }} />
      <MapboxBrandingHide />

      {/* Drapeaux clip SVG (vraies images officielles, net a toute echelle) */}
      <ClipFlagsLayer width={width} height={height} flags={BEAT1_FLAGS} paths={flagPaths} frame={frame} flagOpacity={0.85} idPrefix="b1flag" />

      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,rgba(22,33,58,0.38) 0%,rgba(22,33,58,0.0) 40%,rgba(22,33,58,0.32) 100%)", pointerEvents:"none" }} />

      {/* Dots CSS React — visibles par-dessus les drapeaux */}
      {khouribgaPos && khDotOp > 0.01 && (
        <div style={{ position:"absolute", left:khouribgaPos.x-13, top:khouribgaPos.y-13, pointerEvents:"none" }}>
          {/* Halo pulse externe */}
          <div style={{ position:"absolute", left:13-28, top:13-28, width:56, height:56, borderRadius:"50%",
            border:`2px solid ${ACCENT}`, opacity:khDotOp * (0.3 + Math.abs(Math.sin((frame-F_KHOURIBGA)*0.1))*0.5),
            transform:`scale(${khPulse})` }} />
          {/* Dot central */}
          <div style={{ width:26, height:26, borderRadius:"50%", background:ACCENT,
            border:`3px solid ${GOLD}`, boxShadow:`0 0 10px rgba(200,169,81,0.6)`,
            opacity:khDotOp }} />
        </div>
      )}
      {kenitraPos && knDotOp > 0.01 && (
        <div style={{ position:"absolute", left:kenitraPos.x-12, top:kenitraPos.y-12, pointerEvents:"none" }}>
          {/* Halo pulse externe */}
          <div style={{ position:"absolute", left:12-26, top:12-26, width:52, height:52, borderRadius:"50%",
            border:`2px solid ${RED}`, opacity:knDotOp * (0.3 + Math.abs(Math.sin((frame-F_KENITRA)*0.1))*0.5),
            transform:`scale(${knPulse})` }} />
          {/* Dot central */}
          <div style={{ width:24, height:24, borderRadius:"50%", background:RED,
            border:`2px solid ${IVORY}`, boxShadow:`0 0 10px rgba(230,57,70,0.6)`,
            opacity:knDotOp }} />
        </div>
      )}

      {/* Slam 70% SVG mask */}
      {slamVisible && (
        <svg width={width} height={height} style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <defs>
            <mask id="mask70b1">
              <rect width={width} height={height} fill="white" />
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
                fontFamily="'Anton','Impact',sans-serif" fontWeight={900} fontSize={bigFont} fill="black"
                transform={`translate(${cx} ${cy}) scale(${slamScale}) translate(${-cx} ${-cy})`}>70%</text>
            </mask>
          </defs>
          <rect width={width} height={height} fill={NAVY} opacity={veilOp} mask="url(#mask70b1)" />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
            fontFamily="'Anton','Impact',sans-serif" fontWeight={900} fontSize={bigFont}
            fill="none" stroke={GOLD} strokeWidth={3} opacity={veilOp*0.9}
            transform={`translate(${cx} ${cy}) scale(${slamScale}) translate(${-cx} ${-cy})`}>70%</text>
        </svg>
      )}

      {/* Popup 70% geolocalise */}
      <Popup70 pos={frame>=F_KHOURIBGA && frame<F_LINE ? khouribgaPos : null} opacity={popupOp} sp={popupSp} />

      {/* Plaque KHOURIBGA — mine de phosphate (gauche du dot) */}
      <GeoPlaque pos={khouribgaPos} opacity={khOp} sp={khSp}
        title="KHOURIBGA" subtitle="MINE DE PHOSPHATE" color={GOLD} side="left" />

      {/* Plaque KENITRA — gigafactory batteries (droite du dot) */}
      <GeoPlaque pos={kenitraPos} opacity={knOp} sp={knSp}
        title="KÉNITRA" subtitle="GIGAFACTORY BATTERIES" color={RED} side="right" />

      {/* Labels destinations arcs */}
      <ArcLabel pos={madridPos} opacity={espOp} text="ESPAGNE" flagCode="es" />
      <ArcLabel pos={parisPos}  opacity={fraOp} text="FRANCE"  flagCode="fr" />
      <ArcLabel pos={berlinPos} opacity={deuOp} text="ALLEMAGNE" flagCode="de" />

      <KaraokeSubtitles visible={frame>F_SLAM_END} />
    </AbsoluteFill>
  );
};
