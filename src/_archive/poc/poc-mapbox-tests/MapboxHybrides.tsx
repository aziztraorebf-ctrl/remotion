import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide, removeLabels, type CamState } from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const MAPBOX_HYBRIDES_FRAMES = 600; // 20s @ 30fps

const SEG = {
  SPLIT:   { start: 0,   end: 200, label: "SPLIT-SCREEN",        desc: "Carte gauche + portrait droit 50/50" },
  FLOU:    { start: 200, end: 400, label: "CARTE FLOUE + TEXTE", desc: "Fond carte décoratif + texte premium" },
  STATIQUE:{ start: 400, end: 600, label: "KEN BURNS STATIQUE",  desc: "Capture PNG + zoom CSS — zéro WebGL" },
};

const CAM_SPLIT:   CamState = { lon: -3.0,  lat: 14.0, zoom: 3.8, pitch: 20, bearing: 0 };
const CAM_FLOU:    CamState = { lon: -1.0,  lat: 12.0, zoom: 3.5, pitch: 30, bearing: 5 };

const segOp = (frame: number, s: { start: number; end: number }) =>
  interpolate(frame, [s.start, s.start + 20, s.end - 20, s.end], [0, 1, 1, 0], { extrapolateRight: "clamp" });

const Badge: React.FC<{ label: string; desc: string; opacity: number }> = ({ label, desc, opacity }) => (
  <div style={{ position: "absolute", top: 50, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity, pointerEvents: "none", zIndex: 10 }}>
    <div style={{ background: "rgba(26,18,9,0.82)", padding: "6px 22px", borderRadius: 4, fontFamily: "Georgia, serif", fontSize: 13, letterSpacing: 3, color: "#D4AF37", fontWeight: 700 }}>{label}</div>
    <div style={{ fontFamily: "Georgia, serif", fontSize: 10, letterSpacing: 1.5, color: "#555" }}>{desc}</div>
  </div>
);

// ---------------------------------------------------------------------------
// HYBRIDE 1 — Split-screen 50/50 carte + portrait
// ---------------------------------------------------------------------------
const SplitScreen: React.FC<{ op: number; width: number; height: number }> = ({ op, width, height }) => {
  const half = width / 2;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op, pointerEvents: "none" }}>
      {/* Ligne de séparation centrale */}
      <div style={{
        position: "absolute", left: half - 1, top: 0, width: 2, height: "100%",
        background: "linear-gradient(to bottom, transparent, #D4AF37, #D4AF37, transparent)",
        opacity: 0.6, zIndex: 5,
      }} />
      {/* Côté gauche — masque carte (laisse passer la moitié gauche) */}
      <div style={{
        position: "absolute", right: 0, top: 0, width: half, height: "100%",
        background: "#1a1209", zIndex: 2,
      }} />
      {/* Côté droit — portrait + fond sombre */}
      <div style={{
        position: "absolute", right: 0, top: 0, width: half, height: "100%",
        background: "#1a1209", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 20, zIndex: 3,
      }}>
        {/* Portrait dans médaillon */}
        <div style={{
          width: 180, height: 180, borderRadius: "50%",
          border: "3px solid #D4AF37",
          overflow: "hidden", position: "relative",
          boxShadow: "0 0 30px rgba(212,175,55,0.3)",
        }}>
          <img
            src={staticFile("poc-mapbox-tests/portrait-roi.png")}
            style={{ width: "100%", height: "140%", objectFit: "cover", objectPosition: "center top" }}
          />
        </div>
        {/* Texte éditorial */}
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 15, letterSpacing: 3, color: "#D4AF37", fontWeight: 700, marginBottom: 8 }}>MANSA MOUSSA</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 10, letterSpacing: 1, color: "#aaa", lineHeight: 1.6 }}>Roi du Mali — 1312–1337</div>
          <div style={{ width: 40, height: 1, background: "#D4AF37", margin: "12px auto", opacity: 0.5 }} />
          <div style={{ fontFamily: "Georgia, serif", fontSize: 10, color: "#888", lineHeight: 1.7, fontStyle: "italic" }}>
            "L'homme le plus riche<br />de l'histoire du monde"
          </div>
        </div>
      </div>
      {/* Label carte côté gauche */}
      <div style={{
        position: "absolute", left: 20, bottom: 80, zIndex: 4,
        fontFamily: "Georgia, serif", fontSize: 10, letterSpacing: 2, color: "#D4AF37", opacity: 0.7,
      }}>EMPIRE DU MALI — XIVe s.</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// HYBRIDE 2 — Carte floue + texte premium centré
// ---------------------------------------------------------------------------
const CarteFlouTexte: React.FC<{ frame: number; op: number; width: number; height: number }> = ({ frame, op, width, height }) => {
  const relFrame = frame - SEG.FLOU.start;
  const textOp = interpolate(relFrame, [20, 50], [0, 1], { extrapolateRight: "clamp" });
  const statOp = interpolate(relFrame, [60, 90], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, opacity: op, pointerEvents: "none" }}>
      {/* Blur overlay sur la carte */}
      <div style={{
        position: "absolute", inset: 0,
        backdropFilter: "blur(6px)",
        background: "rgba(26,18,9,0.55)",
        zIndex: 2,
      }} />
      {/* Contenu texte premium au centre */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 16, padding: "0 60px",
      }}>
        {/* Ligne ornementale */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: textOp }}>
          <div style={{ width: 40, height: 1, background: "#D4AF37", opacity: 0.6 }} />
          <div style={{ width: 5, height: 5, background: "#D4AF37", borderRadius: "50%" }} />
          <div style={{ width: 40, height: 1, background: "#D4AF37", opacity: 0.6 }} />
        </div>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 28, letterSpacing: 5,
          color: "#D4AF37", fontWeight: 700, textAlign: "center", opacity: textOp,
          lineHeight: 1.3,
        }}>
          OR AFRICAIN
        </div>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 11, letterSpacing: 2,
          color: "#ccc", textAlign: "center", opacity: textOp * 0.8, lineHeight: 1.8,
        }}>
          Le Ghana impose 12% de royalties<br />sur l'or extrait de son territoire
        </div>
        {/* Stats */}
        <div style={{ display: "flex", gap: 40, marginTop: 8, opacity: statOp }}>
          {[["$4.2B", "revenus annuels"], ["6 pays", "contestent"], ["2023", "année clé"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#D4AF37", fontWeight: 700 }}>{val}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 9, color: "#888", letterSpacing: 1, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
        {/* Ligne ornementale bas */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: textOp }}>
          <div style={{ width: 40, height: 1, background: "#D4AF37", opacity: 0.6 }} />
          <div style={{ width: 5, height: 5, background: "#D4AF37", borderRadius: "50%" }} />
          <div style={{ width: 40, height: 1, background: "#D4AF37", opacity: 0.6 }} />
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// HYBRIDE 3 — Ken Burns sur capture PNG statique (zéro WebGL)
// Simule un zoom CSS + pan sur une image fixe de carte
// ---------------------------------------------------------------------------
const KenBurnsStatique: React.FC<{ frame: number; op: number; width: number; height: number }> = ({ frame, op, width, height }) => {
  const relFrame = frame - SEG.STATIQUE.start;
  const total = SEG.STATIQUE.end - SEG.STATIQUE.start;
  const t = relFrame / total;

  // Zoom CSS : 1.0 → 1.35 progressif
  const scale = interpolate(t, [0, 1], [1.0, 1.35], { extrapolateRight: "clamp" });
  // Pan : légèrement vers la droite + haut
  const tx = interpolate(t, [0, 1], [0, -40], { extrapolateRight: "clamp" });
  const ty = interpolate(t, [0, 1], [0, -20], { extrapolateRight: "clamp" });

  const labelOp = interpolate(relFrame, [30, 60], [0, 1], { extrapolateRight: "clamp" }) * op;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: op, overflow: "hidden" }}>
      {/* Image carte statique — utilise la carte screenshot de style light */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
        transformOrigin: "center center",
        // Fond de remplacement : gradient qui simule une carte claire
        background: "linear-gradient(135deg, #d4c9a8 0%, #c8b98a 30%, #b8a870 50%, #d4c9a8 100%)",
      }}>
        {/* Simulation carte avec SVG inline */}
        <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
          {/* Océan */}
          <rect width={width} height={height} fill="#b8d4e8" />
          {/* Continent africain simplifié */}
          <ellipse cx={width * 0.5} cy={height * 0.55} rx={width * 0.32} ry={height * 0.38} fill="#d4c9a8" />
          {/* Sahara */}
          <ellipse cx={width * 0.5} cy={height * 0.35} rx={width * 0.28} ry={height * 0.12} fill="#e8dbb0" opacity={0.6} />
          {/* Lignes latitude subtiles */}
          {[0.3, 0.45, 0.6, 0.75].map((y, i) => (
            <line key={i} x1={0} y1={height * y} x2={width} y2={height * y} stroke="#aaa" strokeWidth={0.5} opacity={0.3} />
          ))}
          {/* Point Mali */}
          <circle cx={width * 0.46} cy={height * 0.42} r={8} fill="#D4AF37" opacity={0.9} />
          <circle cx={width * 0.46} cy={height * 0.42} r={14} fill="none" stroke="#D4AF37" strokeWidth={1.5} opacity={0.5} />
        </svg>
      </div>
      {/* Label "PNG STATIQUE — zéro WebGL" */}
      <div style={{
        position: "absolute", bottom: 100, left: 0, right: 0,
        textAlign: "center", opacity: labelOp, zIndex: 4,
      }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 12, letterSpacing: 2, color: "#D4AF37" }}>RENDU CPU UNIQUEMENT</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 9, letterSpacing: 1, color: "#888", marginTop: 4 }}>Aucun WebGL requis — compatible npx remotion render</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Composition principale
// ---------------------------------------------------------------------------
export const MapboxHybrides: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("mapbox-hybrides"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM_SPLIT.lon, CAM_SPLIT.lat],
      zoom: CAM_SPLIT.zoom,
      pitch: CAM_SPLIT.pitch,
      bearing: CAM_SPLIT.bearing,
      interactive: false,
      preserveDrawingBuffer: true,
    });
    map.on("style.load", () => {
      removeLabels(map);
      mapRef.current = map;
      setReady(true);
      continueRender(handle);
    });
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const map = mapRef.current;
    if (frame < SEG.FLOU.start) {
      map.jumpTo({ center: [CAM_SPLIT.lon, CAM_SPLIT.lat], zoom: CAM_SPLIT.zoom, pitch: CAM_SPLIT.pitch, bearing: CAM_SPLIT.bearing });
    } else if (frame < SEG.STATIQUE.start) {
      map.jumpTo({ center: [CAM_FLOU.lon, CAM_FLOU.lat], zoom: CAM_FLOU.zoom, pitch: CAM_FLOU.pitch, bearing: CAM_FLOU.bearing });
    }
  }, [frame, ready]);

  const splitOp  = segOp(frame, SEG.SPLIT);
  const flouOp   = segOp(frame, SEG.FLOU);
  const statOp   = segOp(frame, SEG.STATIQUE);
  const currentSeg = frame < SEG.FLOU.start ? SEG.SPLIT : frame < SEG.STATIQUE.start ? SEG.FLOU : SEG.STATIQUE;
  const badgeOp  = interpolate(frame, [currentSeg.start, currentSeg.start + 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#1a1209" }}>
      <MapboxBrandingHide />
      {/* Carte Mapbox — visible uniquement pour split + flou */}
      {frame < SEG.STATIQUE.start && (
        <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      )}
      {ready && frame >= SEG.SPLIT.start  && frame < SEG.SPLIT.end   && <SplitScreen      op={splitOp} width={width} height={height} />}
      {ready && frame >= SEG.FLOU.start   && frame < SEG.FLOU.end    && <CarteFlouTexte   frame={frame} op={flouOp} width={width} height={height} />}
      {frame >= SEG.STATIQUE.start && frame < SEG.STATIQUE.end       && <KenBurnsStatique frame={frame} op={statOp} width={width} height={height} />}
      <Badge label={currentSeg.label} desc={currentSeg.desc} opacity={badgeOp} />
    </AbsoluteFill>
  );
};
