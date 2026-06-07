/**
 * MapAnimationShowcase — démonstration des 3 nouvelles briques Map Animation.
 *
 * Séquence (30fps, ~40s = 1200 frames) :
 *   f0-60   : carton intro "Map Animation Showcase"
 *   f60-420 : Segment 1 — SahelAttackArrow (3 flèches capitales → Liptako + tenaille Kidal)
 *   f420-480: transition carton
 *   f480-840: Segment 2 — TerritorialExpansion (expansion JNIM 2012→2022)
 *   f840-900: transition carton
 *   f900-1200: Segment 3 — RefugeeFlow (3 corridors de déplacés)
 *
 * Carte : même style parchemin que SahelWarMapEngine.
 * Narration : pas d'audio — démonstration muette.
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";
import { SahelAttackArrow } from "../_shared/SahelAttackArrow";
import { TerritorialExpansion, EXPANSION_REGIONS_ACT2 } from "../_shared/TerritorialExpansion";
import { RefugeeFlow, REFUGEE_FLOWS_ACT4 } from "../_shared/RefugeeFlow";
import { SAHEL_COLORS } from "./SahelControlData";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const SHOWCASE_FPS = 30;
export const SHOWCASE_DURATION = 1200; // 40s

// Segments
const SEG1_START = 60;
const SEG1_END = 420;
const SEG2_CARD = 420;
const SEG2_START = 480;
const SEG2_END = 840;
const SEG3_CARD = 840;
const SEG3_START = 900;
const SEG3_END = 1200;

// Coordonnées géo pivots
const BAMAKO_COORD: [number, number]   = [-7.99, 12.65];
const OUAGA_COORD: [number, number]    = [-1.52, 12.37];
const NIAMEY_COORD: [number, number]   = [2.12, 13.51];
const LIPTAKO_CENTER: [number, number] = [-0.5, 14.5];
const GAO_COORD: [number, number]      = [-0.04, 16.27];
const MENAKA_COORD: [number, number]   = [2.40, 15.92];
const KIDAL_COORD: [number, number]    = [1.44, 18.43];

function cardOpacity(frame: number, start: number, duration = 60): number {
  return interpolate(
    frame,
    [start, start + 10, start + duration - 10, start + duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

const plaque: React.CSSProperties = {
  background: SAHEL_COLORS.cream,
  border: `2px solid ${SAHEL_COLORS.ink}`,
  borderRadius: 6,
  color: SAHEL_COLORS.ink,
  boxShadow: "0 4px 18px rgba(0,0,0,0.28)",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
};

// Carton avec numéro + titre + description
const SegmentCard: React.FC<{
  num: string;
  title: string;
  desc: string;
  opacity: number;
}> = ({ num, title, desc, opacity }) => {
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        opacity,
      }}
    >
      <div
        style={{
          ...plaque,
          textAlign: "center",
          padding: "28px 56px",
          maxWidth: 700,
        }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: 5,
            fontWeight: 700,
            textTransform: "uppercase" as const,
            opacity: 0.55,
            marginBottom: 8,
          }}
        >
          Template {num} / 3
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 12,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 20,
            opacity: 0.72,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {desc}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Badge discret coin bas-droite
const SegBadge: React.FC<{ label: string; opacity: number }> = ({
  label,
  opacity,
}) => {
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 28,
        right: 40,
        ...plaque,
        padding: "6px 18px",
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: 1.5,
        textTransform: "uppercase" as const,
        opacity,
        borderWidth: 1,
      }}
    >
      {label}
    </div>
  );
};

export const MapAnimationShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() =>
    delayRender("MapAnimationShowcase", { timeoutInMilliseconds: 60000 })
  );
  const [ready, setReady] = useState(false);

  // ============================================================
  // INIT MAP
  // ============================================================
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }

    let safety: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      continueRender(handle);
      safety = null;
    }, 45000);

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-1.5, 15.0],
      zoom: 4.2,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      projection: { name: "mercator" },
    });
    mapRef.current = map;

    map.on("style.load", async () => {
      try {
        // Reskin parchemin minimal
        const layers = map.getStyle().layers ?? [];
        for (const layer of layers) {
          if (layer.type === "background") {
            map.setPaintProperty(layer.id, "background-color", "#F5EFD6");
          }
          if (layer.type === "fill") {
            map.setPaintProperty(layer.id, "fill-color", "#EDE4C0");
            map.setPaintProperty(layer.id, "fill-opacity", 0.7);
          }
          if (layer.type === "line" && (layer.id.includes("water") || layer.id.includes("river"))) {
            map.setPaintProperty(layer.id, "line-color", "#C8D9E0");
          }
        }
      } catch {
        // ignore
      }

      if (safety) { clearTimeout(safety); safety = null; }
      continueRender(handle);
      setReady(true);
    });

    map.on("error", (e) => console.error("[Showcase] error:", e?.error?.message ?? e));

    return () => {
      if (safety) clearTimeout(safety);
    };
  }, [handle]);

  // ============================================================
  // UPDATE FRAME — jumpTo caméra selon segment
  // ============================================================
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    let lon = -1.5;
    let lat = 15.0;
    let zoom = 5.5;

    if (frame >= SEG1_START && frame < SEG2_CARD) {
      // Segment 1 : centré sur Liptako-Gourma + Kidal pour voir les flèches
      lon = 0.0;
      lat = 15.5;
      zoom = 5.5;
    } else if (frame >= SEG2_START && frame < SEG3_CARD) {
      // Segment 2 : centré sur Mali pour voir l'expansion depuis Kidal
      lon = -1.5;
      lat = 16.0;
      zoom = 5.3;
    } else if (frame >= SEG3_START) {
      // Segment 3 : centré sur Liptako pour voir les 3 corridors de déplacés
      lon = 0.0;
      lat = 13.8;
      zoom = 5.8;
    }

    try {
      map.jumpTo({ center: [lon, lat], zoom, pitch: 0, bearing: 0 });
    } catch {
      // skip
    }

    const h = delayRender(`showcase-frame-${frame}`, { timeoutInMilliseconds: 40000 });
    let done = false;
    const finish = () => { if (!done) { done = true; continueRender(h); } };
    map.once("idle", finish);
    setTimeout(finish, map.areTilesLoaded() ? 300 : 1000);
  }, [frame, ready]);

  // ============================================================
  // OPACITÉS PAR SEGMENT
  // ============================================================

  // Intro carton (f0-60)
  const introOp = cardOpacity(frame, 0, 55);

  // Segment 1 — SahelAttackArrow (f60-420)
  const seg1Active = frame >= SEG1_START && frame < SEG2_CARD;
  const seg1CardOp = cardOpacity(frame, SEG2_CARD - 60, 55);

  // Flèche 1a : Bamako → Liptako (départ f80)
  const arrow1aProgress = interpolate(frame, [80, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Flèche 1b : Ouaga → Liptako (départ f100)
  const arrow1bProgress = interpolate(frame, [100, 165], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Flèche 1c : Niamey → Liptako (départ f120)
  const arrow1cProgress = interpolate(frame, [120, 190], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Tenaille Kidal (FAMa) départ f220
  const arrowKidalFama = interpolate(frame, [220, 280], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Tenaille Kidal (Africa Corps) départ f250
  const arrowKidalAC = interpolate(frame, [250, 310], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Contre-offensive JNIM départ f340
  const arrowCounter = interpolate(frame, [340, 390], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade out des flèches à la fin du segment
  const seg1FadeOut = interpolate(frame, [SEG2_CARD - 30, SEG2_CARD], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Segment 2 — TerritorialExpansion (f480-840)
  const seg2Active = frame >= SEG2_START && frame < SEG3_CARD;
  const seg2BadgeOp = interpolate(frame, [SEG2_START, SEG2_START + 20, SEG3_CARD - 20, SEG3_CARD], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Segment 3 — RefugeeFlow (f900-1200)
  const seg3Active = frame >= SEG3_START;
  const seg3BadgeOp = interpolate(frame, [SEG3_START, SEG3_START + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Badge segment 1
  const seg1BadgeOp = interpolate(frame, [SEG1_START, SEG1_START + 20, SEG2_CARD - 20, SEG2_CARD], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade global de transition entre segments
  const transitionOp =
    frame >= SEG2_CARD - 15 && frame < SEG2_START + 15
      ? interpolate(frame, [SEG2_CARD - 15, SEG2_CARD, SEG2_START, SEG2_START + 15], [0, 0.7, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : frame >= SEG3_CARD - 15 && frame < SEG3_START + 15
        ? interpolate(frame, [SEG3_CARD - 15, SEG3_CARD, SEG3_START, SEG3_START + 15], [0, 0.7, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        : 0;

  // Données réfugiés adaptées au showcase (triggers décalés pour partir de f900)
  const showcaseRefugeeFlows = [
    { id: "djibo-bobo", label: "Djibo", waypoints: [[-1.32, 14.10], [-2.10, 13.40], [-3.20, 12.60], [-4.30, 11.18]] as [number, number][], triggerFrame: SEG3_START + 10, drawDuration: 100, weight: 1.8 },
    { id: "menaka-gao", label: "Ménaka", waypoints: [[2.40, 15.92], [1.20, 16.10], [-0.04, 16.27], [-1.80, 15.80]] as [number, number][], triggerFrame: SEG3_START + 50, drawDuration: 90, weight: 1.2 },
    { id: "tillaberi-niamey", label: "Tillabéri", waypoints: [[1.45, 14.21], [1.80, 13.85], [2.12, 13.51]] as [number, number][], triggerFrame: SEG3_START + 80, drawDuration: 80, weight: 1.0 },
  ];

  // Données expansion adaptées au showcase (startFrame = SEG2_START)
  const showcaseExpansionRegions = EXPANSION_REGIONS_ACT2.map((r) => ({
    ...r,
    delayFrames: Math.round(r.delayFrames * 0.8), // légèrement accéléré
  }));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: SAHEL_COLORS.ocean,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      <MapboxBrandingHide />

      {/* Filtre grain papier */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="paperShowcase">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.9  0 0 0 0 0.78  0 0 0 0.04 0" />
        </filter>
      </svg>

      {/* Carte Mapbox */}
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {/* Grain + vignette */}
      <AbsoluteFill style={{ filter: "url(#paperShowcase)", opacity: 0.22, pointerEvents: "none", mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 60%, rgba(40,28,16,0.20) 100%)" }} />

      {/* ===================== SEGMENT 1 : FLÈCHES TACTIQUES ===================== */}

      {ready && seg1Active && arrow1aProgress > 0 && (
        <SahelAttackArrow
          map={mapRef.current}
          waypoints={[BAMAKO_COORD, LIPTAKO_CENTER]}
          progress={arrow1aProgress}
          color={SAHEL_COLORS.contested}
          strokeWidth={6}
          headType="arrow"
          marchingFrame={frame}
          opacity={seg1FadeOut * 0.9}
          width={width}
          height={height}
        />
      )}
      {ready && seg1Active && arrow1bProgress > 0 && (
        <SahelAttackArrow
          map={mapRef.current}
          waypoints={[OUAGA_COORD, LIPTAKO_CENTER]}
          progress={arrow1bProgress}
          color={SAHEL_COLORS.contested}
          strokeWidth={6}
          headType="arrow"
          marchingFrame={frame}
          opacity={seg1FadeOut * 0.88}
          width={width}
          height={height}
        />
      )}
      {ready && seg1Active && arrow1cProgress > 0 && (
        <SahelAttackArrow
          map={mapRef.current}
          waypoints={[NIAMEY_COORD, LIPTAKO_CENTER]}
          progress={arrow1cProgress}
          color={SAHEL_COLORS.contested}
          strokeWidth={6}
          headType="arrow"
          marchingFrame={frame}
          opacity={seg1FadeOut * 0.85}
          width={width}
          height={height}
        />
      )}

      {/* Tenaille Kidal — FAMa (bleu) depuis Gao */}
      {ready && seg1Active && arrowKidalFama > 0 && (
        <SahelAttackArrow
          map={mapRef.current}
          waypoints={[GAO_COORD, KIDAL_COORD]}
          progress={arrowKidalFama}
          color={SAHEL_COLORS.etat}
          strokeWidth={8}
          headType="arrow"
          marchingFrame={frame}
          opacity={seg1FadeOut}
          width={width}
          height={height}
        />
      )}
      {/* Tenaille Kidal — Africa Corps (bleu) depuis Ménaka */}
      {ready && seg1Active && arrowKidalAC > 0 && (
        <SahelAttackArrow
          map={mapRef.current}
          waypoints={[MENAKA_COORD, KIDAL_COORD]}
          progress={arrowKidalAC}
          color={SAHEL_COLORS.etat}
          strokeWidth={7}
          headType="arrow"
          marchingFrame={frame}
          opacity={seg1FadeOut}
          width={width}
          height={height}
        />
      )}
      {/* Contre-offensive JNIM (rouge) depuis Ménaka → Kidal */}
      {ready && seg1Active && arrowCounter > 0 && (
        <SahelAttackArrow
          map={mapRef.current}
          waypoints={[MENAKA_COORD, KIDAL_COORD]}
          progress={arrowCounter}
          color={SAHEL_COLORS.jnim}
          strokeWidth={7}
          headType="arrow"
          marchingFrame={frame}
          opacity={seg1FadeOut * 0.85}
          width={width}
          height={height}
        />
      )}

      {/* ===================== SEGMENT 2 : EXPANSION TERRITORIALE ===================== */}
      {ready && seg2Active && (
        <TerritorialExpansion
          map={mapRef.current}
          regions={showcaseExpansionRegions}
          startFrame={SEG2_START}
          endFrame={SEG3_CARD - 30}
          frame={frame}
          color={SAHEL_COLORS.jnim}
          maxOpacity={0.55}
          width={width}
          height={height}
        />
      )}

      {/* ===================== SEGMENT 3 : FLUX RÉFUGIÉS ===================== */}
      {ready && seg3Active && (
        <RefugeeFlow
          map={mapRef.current}
          flows={showcaseRefugeeFlows}
          frame={frame}
          color="#3A2A18"
          baseWidth={10}
          width={width}
          height={height}
        />
      )}

      {/* ===================== CARTON INTRO ===================== */}
      {introOp > 0 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: introOp, pointerEvents: "none" }}>
          <div style={{ ...plaque, textAlign: "center", padding: "34px 64px" }}>
            <div style={{ fontSize: 13, letterSpacing: 6, fontWeight: 700, textTransform: "uppercase" as const, opacity: 0.5, marginBottom: 10 }}>
              War-Map Sahel AES
            </div>
            <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 10 }}>
              Map Animation
            </div>
            <div style={{ fontSize: 20, opacity: 0.65, fontWeight: 500 }}>
              3 nouvelles briques visuelles
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ===================== CARTONS TRANSITION SEGMENTS ===================== */}
      <SegmentCard
        num="1"
        title="Flèches tactiques"
        desc={"Convergence vers Liptako-Gourma\n+ Tenaille Kidal (FAMa + Africa Corps)\n+ Contre-offensive JNIM"}
        opacity={frame >= SEG1_START && frame < SEG2_START ? (frame < SEG1_START + 50 ? cardOpacity(frame, SEG1_START, 45) : 0) : 0}
      />
      <SegmentCard
        num="2"
        title="Expansion territoriale"
        desc={"Propagation JNIM 2012 → 2022\nDepuis Kidal/Gao vers le centre\n8 régions, delays décalés"}
        opacity={frame >= SEG2_CARD && frame < SEG2_START + 50 ? cardOpacity(frame, SEG2_CARD, 45) : 0}
      />
      <SegmentCard
        num="3"
        title="Flux de déplacés"
        desc={"3 corridors humanitaires\nDjibo → Bobo-Dioulasso\nMénaka → Gao · Tillabéri → Niamey"}
        opacity={frame >= SEG3_CARD && frame < SEG3_START + 50 ? cardOpacity(frame, SEG3_CARD, 45) : 0}
      />

      {/* ===================== BADGES ACTIFS ===================== */}
      <SegBadge label="SahelAttackArrow" opacity={seg1BadgeOp} />
      <SegBadge label="TerritorialExpansion" opacity={seg2BadgeOp} />
      <SegBadge label="RefugeeFlow" opacity={seg3BadgeOp} />

      {/* Légende couleurs — Segment 1 */}
      {seg1Active && seg1BadgeOp > 0 && (
        <div style={{ position: "absolute", top: 40, left: 44, opacity: seg1BadgeOp, pointerEvents: "none" }}>
          <div style={{ ...plaque, padding: "12px 20px" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, opacity: 0.55, fontWeight: 700, textTransform: "uppercase" as const, marginBottom: 8 }}>Factions</div>
            {[
              { color: SAHEL_COLORS.contested, label: "Capitales → Liptako (or)" },
              { color: SAHEL_COLORS.etat,      label: "Tenaille FAMa + Africa Corps (bleu)" },
              { color: SAHEL_COLORS.jnim,      label: "Contre-offensive JNIM (rouge)" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, background: color, border: "1.5px solid rgba(26,18,9,0.4)", flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: SAHEL_COLORS.ink }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Légende — Segment 2 */}
      {seg2Active && seg2BadgeOp > 0 && (
        <div style={{ position: "absolute", top: 40, left: 44, opacity: seg2BadgeOp, pointerEvents: "none" }}>
          <div style={{ ...plaque, padding: "12px 20px" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, opacity: 0.55, fontWeight: 700, textTransform: "uppercase" as const, marginBottom: 8 }}>Expansion</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: SAHEL_COLORS.jnim, border: "1.5px solid rgba(26,18,9,0.4)", flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: SAHEL_COLORS.ink }}>JNIM — Zones contrôlées</span>
            </div>
          </div>
        </div>
      )}

      {/* Légende — Segment 3 */}
      {seg3Active && seg3BadgeOp > 0 && (
        <div style={{ position: "absolute", top: 40, left: 44, opacity: seg3BadgeOp, pointerEvents: "none" }}>
          <div style={{ ...plaque, padding: "12px 20px" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, opacity: 0.55, fontWeight: 700, textTransform: "uppercase" as const, marginBottom: 8 }}>Déplacés</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: SAHEL_COLORS.ink, opacity: 0.8 }}>~3 millions de personnes<br />déplacées (2024)</div>
          </div>
        </div>
      )}

      {/* Overlay fondu entre segments */}
      {transitionOp > 0 && (
        <AbsoluteFill style={{ background: "#F5EFD6", opacity: transitionOp, pointerEvents: "none" }} />
      )}
    </AbsoluteFill>
  );
};
