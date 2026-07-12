/**
 * ProtoSilhouetteRiseFx — R&D v2 : teste 3 techniques vues dans une reference YouTube (Vox-style
 * map animation, world-atlas/d3-geo) transposees sur une VRAIE carte Mapbox AVEC le reskin
 * parchemin reel (SAHEL_COLORS, meme logique que SahelWarMapEngine.tsx) — pas le style Mapbox brut.
 *
 * 1. Silhouette qui "rise" depuis un pays (overlay 2D ancre a un point projete map.project()).
 * 2. Sprite d'explosion (fx-explosion/*.png, deja alpha) plaque en overlay au point d'impact.
 * 3. Un jet (icone lucide, faute d'asset avion top-down dans la bibliotheque) qui VOLE d'un point
 *    geo a un autre — trajectoire interpolee en lon/lat (pas en pixels), projetee a chaque frame,
 *    avec rotation orientee vers le cap de vol. Teste si la trajectoire reste rectiligne/fluide
 *    en pixels malgre la projection mercator (question ouverte non testee en v1).
 *
 * v1 (style Mapbox brut) avait prouve la mecanique de base mais PAS le rendu dans la vraie charte.
 * Corrige ici : reskin identique a SAHEL_COLORS (parchemin, labels masques, admin-0/1 recolores).
 */
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
  Easing,
} from "remotion";
import { Plane, TriangleAlert } from "lucide-react";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";
import { WarMapPlaque } from "../parties/WarMapPlaque";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Meme palette que SahelWarMapEngine (SahelControlData.ts) — reskin identique, pas invente.
const SAHEL_COLORS = {
  land: "#F5EFD6",
  ocean: "#C8D9E0",
  outline: "#3A2A18",
};

// Variante B (R&D, PAS la doctrine) — fond quasi-uni fonce, inspire des captures Vox fournies
// par Aziz (fond marine uni, zero admin-1, zero bruit visuel, focus total sur le pays cible).
const EPURE_COLORS = {
  land: "#1B2838",
  ocean: "#141D28",
  outline: "#3E5872",
};

// Burkina Faso — centre approx pour un cadrage serre pays-unique
const BURKINA_CENTER: [number, number] = [-1.5, 12.4];
const BURKINA_ZOOM = 5.6;

const RISE_START = 20;
const RISE_DUR = 25;
const IMPACT_AT = 100;
const EXPLOSION_FRAMES = 9;
const EXPLOSION_FPS_DIV = 2;

// Trajectoire du jet : depart Ouagadougou-ish -> impact pres du point Burkina, en degres lon/lat.
const JET_START: [number, number] = [-3.0, 13.6];
const JET_END: [number, number] = [-0.9, 12.9];
const JET_TAKEOFF = 55;
const JET_ARRIVAL = IMPACT_AT;
const JET_SIZE = 110; // v3: etait 48 — trop petit face a la reference (jets Vox ~15% largeur ecran)

// Draw-in + pulse du contour Burkina — meme mecanique que SahelWarMapEngine.tsx (countryBorderPaths,
// stroke-dasharray/dashoffset + double-stroke glow qui bat). Timing calque sur le pattern acte1Refonte.
const BORDER_DRAW_START = 5;
const BORDER_DRAW_DUR = 40;
const PULSE_RISE = 10;
const PULSE_HOLD_END = 45;
const PULSE_FALL_END = 90;
const BURKINA_ACCENT = "#B14B3C"; // meme rouge JNIM que SAHEL_COLORS.etat/jnim (SahelControlData.ts)

// Plaque nom pays — meme composant WarMapPlaque que la prod (parchemin + slide-in + fadeIn).
const PLAQUE_APPEAR_AT = BORDER_DRAW_START + BORDER_DRAW_DUR - 8;

// Drapeau reel plaque (public/_shared/flags/bf.png) — pattern vu dans la reference Aziz
// (Israel/Iran, capture screen-recording-vox-ref.mov 0:16) : PNG drapeau, pas juste un contour
// colore. Apparait juste apres le draw-in, meme timing que la plaque nom.
const FLAG_APPEAR_AT = PLAQUE_APPEAR_AT;
const FLAG_W = 130;
const FLAG_H = 87; // ratio 3:2 standard

// Alerte + ligne de blocus pointillee — pattern vu dans la reference (detroit d'Hormuz,
// capture 0:25) : triangle jaune + ligne dashed en diagonale traversant un point de passage.
const ALERT_AT = BORDER_DRAW_START + BORDER_DRAW_DUR + PULSE_RISE + 10;
const ALERT_POINT: [number, number] = [-1.05, 12.35]; // point fictif pres du centre Burkina

export const PROTO_SILHOUETTE_FRAMES = 180;
export const PROTO_SILHOUETTE_FPS = 30;
const PLAQUE_HIDE_AT = PROTO_SILHOUETTE_FRAMES;

export const ProtoSilhouetteRiseFx: React.FC<{ epure?: boolean }> = ({ epure = false }) => {
  const COLORS = epure ? EPURE_COLORS : SAHEL_COLORS;
  const frame = useCurrentFrame();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("proto-silhouette-map-init"));
  const [ready, setReady] = useState(false);
  // Anneau (ring) brut du contour Burkina en lon/lat — reprojete en path SVG a CHAQUE FRAME plus
  // bas (synchrone, meme raison que projBurkina/projJetNow : un useEffect decalerait d'une frame).
  const [burkinaRing, setBurkinaRing] = useState<[number, number][] | null>(null);

  useEffect(() => {
    fetch(staticFile("_shared/geo-data/sahel/sahel-countries.geojson"))
      .then((r) => r.json())
      .then((fc) => {
        const feat = fc.features.find((f: any) => f.properties?.country === "BFA");
        if (!feat) return;
        const geom = feat.geometry;
        const polys = geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
        // 1 seul ring (BFA = Polygon simple, pas de multi-polygone connu) — le plus long si jamais.
        let longest: [number, number][] = [];
        for (const poly of polys) {
          for (const ring of poly) {
            if (ring.length > longest.length) longest = ring;
          }
        }
        setBurkinaRing(longest);
      })
      .catch((e) => console.warn("[Proto] sahel-countries.geojson load failed:", e));
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: BURKINA_CENTER,
      zoom: BURKINA_ZOOM,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      projection: { name: "mercator" },
    });
    mapRef.current = map;

    // RESKIN — mode "parchemin" (defaut, identique SahelWarMapEngine.tsx) ou "epure" (R&D,
    // fond quasi-uni fonce + admin-1 masques, inspire des captures Vox fournies par Aziz).
    const reskinMap = () => {
      try {
        const layers = map.getStyle().layers ?? [];
        for (const l of layers) {
          if (l.type === "symbol") map.setLayoutProperty(l.id, "visibility", "none");
          // Epure : masque aussi routes/ponts/tunnels — invisibles sur fond clair (SahelWarMapEngine
          // ne les traite pas car peu visibles sur parchemin), mais ressortent violemment en fond
          // sombre (bug trouve en comparant A vs B : reseau de lignes blanches parasites partout).
          if (epure && (l.id.includes("road") || l.id.includes("bridge") || l.id.includes("tunnel"))) {
            try { map.setLayoutProperty(l.id, "visibility", "none"); } catch {}
          }
          if (l.id.includes("water") && l.type === "fill") {
            map.setPaintProperty(l.id, "fill-color", COLORS.ocean);
          }
          if (
            l.id === "land" || l.id.includes("landuse") || l.id.includes("landcover") ||
            l.id === "background" || l.id.includes("national-park")
          ) {
            try { map.setPaintProperty(l.id, "background-color", COLORS.land); } catch {}
            try { map.setPaintProperty(l.id, "fill-color", COLORS.land); } catch {}
          }
          if (l.id.includes("admin-0")) {
            try { map.setPaintProperty(l.id, "line-opacity", (l.id.includes("-bg") || l.id.includes("-disputed")) ? 0 : 1); } catch {}
            try { map.setPaintProperty(l.id, "line-color", COLORS.outline); } catch {}
          }
          if (l.id.includes("admin-1")) {
            // Epure : admin-1 totalement masque (zero bruit interne, focus pays).
            // Parchemin : admin-1 visible attenue (registre carte d'etat-major, deja en prod).
            try { map.setLayoutProperty(l.id, "visibility", epure ? "none" : "visible"); } catch {}
            try { map.setPaintProperty(l.id, "line-color", "rgba(58,42,24,0.25)"); } catch {}
          }
        }
        if (map.getLayer("background")) {
          map.setPaintProperty("background", "background-color", COLORS.land);
        }
      } catch (e) { console.warn("[Proto] reskin partial:", e); }
    };

    let reskinPending = false;
    map.on("sourcedata", () => {
      if (reskinPending) return;
      reskinPending = true;
      requestAnimationFrame(() => { reskinMap(); reskinPending = false; });
    });

    map.on("load", () => {
      reskinMap();
      setReady(true);
      continueRender(handle);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // IMPORTANT : map.project() est calcule de facon SYNCHRONE pendant le rendu (pas dans un
  // useEffect). Un effect met a jour un useState APRES le rendu courant, ce qui decale la
  // position affichee d'une frame par rapport au calcul reel — invisible a l'oeil en preview
  // interactive (60fps, l'oeil lisse les sauts), mais un vrai bug en render Remotion frame-par-
  // frame : chaque frame capturee montre la position calculee a la frame precedente, ce qui
  // donnait le mouvement saccade/en retard observe dans la v2 (la trajectoire lon/lat elle-meme
  // etait bien lineaire — verifie : le bug etait dans le timing du useEffect, pas la projection).
  if (mapRef.current && ready) {
    mapRef.current.jumpTo({ center: BURKINA_CENTER, zoom: BURKINA_ZOOM, pitch: 0, bearing: 0 });
  }
  const map = mapRef.current;
  const canProject = !!map && ready;

  const jetT = interpolate(frame, [JET_TAKEOFF, JET_ARRIVAL], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });
  const jetLon = interpolate(jetT, [0, 1], [JET_START[0], JET_END[0]]);
  const jetLat = interpolate(jetT, [0, 1], [JET_START[1], JET_END[1]]);
  const jetTNext = Math.min(1, jetT + 0.01);
  const jetLonNext = interpolate(jetTNext, [0, 1], [JET_START[0], JET_END[0]]);
  const jetLatNext = interpolate(jetTNext, [0, 1], [JET_START[1], JET_END[1]]);

  const projBurkina = canProject ? map!.project(BURKINA_CENTER) : null;
  const projImpact = canProject ? map!.project(JET_END) : null;
  const projJetNow = canProject ? map!.project([jetLon, jetLat]) : null;
  const projJetNext = canProject ? map!.project([jetLonNext, jetLatNext]) : null;
  const projAlert = canProject ? map!.project(ALERT_POINT) : null;
  const jetAngle = projJetNow && projJetNext
    ? Math.atan2(projJetNext.y - projJetNow.y, projJetNext.x - projJetNow.x) * (180 / Math.PI)
    : 0;

  // Contour Burkina reprojete en path SVG — meme construction que SahelWarMapEngine.tsx
  // (M/L/Z + longueur cumulee par distance euclidienne entre points successifs).
  let burkinaBorderPath: { d: string; len: number } | null = null;
  if (canProject && burkinaRing) {
    let d = "";
    let len = 0;
    let prev: { x: number; y: number } | null = null;
    for (let i = 0; i < burkinaRing.length; i++) {
      const p = map!.project(burkinaRing[i]);
      d += (i === 0 ? "M" : "L") + p.x.toFixed(1) + "," + p.y.toFixed(1);
      if (prev) len += Math.hypot(p.x - prev.x, p.y - prev.y);
      prev = p;
    }
    d += "Z";
    burkinaBorderPath = { d, len: Math.max(len, 1) };
  }
  // Draw-in : stroke-dashoffset descend de len (rien trace) vers 0 (trace complet).
  const borderDrawn = interpolate(
    frame, [BORDER_DRAW_START, BORDER_DRAW_START + BORDER_DRAW_DUR], [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );
  const borderOffset = burkinaBorderPath ? burkinaBorderPath.len * borderDrawn : 0;
  // Pulse glow apres le draw-in — meme forme que countryPulseAt (rise -> hold -> fall).
  const borderLit = interpolate(
    frame,
    [BORDER_DRAW_START + BORDER_DRAW_DUR, BORDER_DRAW_START + BORDER_DRAW_DUR + PULSE_RISE,
     BORDER_DRAW_START + BORDER_DRAW_DUR + PULSE_HOLD_END, BORDER_DRAW_START + BORDER_DRAW_DUR + PULSE_FALL_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const borderBeat = borderLit > 0.05 ? 1 + 0.45 * Math.sin(frame * 0.18) : 1;
  const borderGlowW = (6 + 11 * Math.max(0, borderLit)) * borderBeat;
  const borderVisible = frame >= BORDER_DRAW_START;

  const riseT = interpolate(frame, [RISE_START, RISE_START + RISE_DUR], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const riseY = interpolate(riseT, [0, 1], [60, -40]);
  const riseOpacity = interpolate(frame, [RISE_START, RISE_START + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const explosionLocalFrame = frame - IMPACT_AT;
  const explosionActive = explosionLocalFrame >= 0 && explosionLocalFrame < EXPLOSION_FRAMES * EXPLOSION_FPS_DIV;
  const explosionIdx = Math.min(
    EXPLOSION_FRAMES - 1,
    Math.floor(explosionLocalFrame / EXPLOSION_FPS_DIV)
  );
  const explosionOpacity = explosionActive
    ? interpolate(
        explosionLocalFrame,
        [0, EXPLOSION_FRAMES * EXPLOSION_FPS_DIV * 0.7, EXPLOSION_FRAMES * EXPLOSION_FPS_DIV],
        [1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  const jetVisible = frame >= JET_TAKEOFF && frame <= JET_ARRIVAL + 2;

  // Drapeau : meme fade+slide que WarMapPlaque (pop discret, pas d'invention de nouvelle courbe).
  const flagOpacity = interpolate(frame, [FLAG_APPEAR_AT, FLAG_APPEAR_AT + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const flagScale = interpolate(frame, [FLAG_APPEAR_AT, FLAG_APPEAR_AT + 10], [0.85, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });

  // Alerte : triangle qui pop (spring-like via easeOut) + ligne pointillee qui se dessine
  // (meme mecanique stroke-dasharray/dashoffset que le contour, appliquee a un segment court).
  const alertPop = interpolate(frame, [ALERT_AT, ALERT_AT + 8], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)),
  });
  const alertBlink = 0.7 + 0.3 * Math.max(0, Math.sin(frame * 0.15));
  const lineDraw = interpolate(frame, [ALERT_AT + 4, ALERT_AT + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ background: COLORS.land }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
      <MapboxBrandingHide />

      {/* Contour Burkina : draw-in stroke-dashoffset + pulse-glow apres, meme mecanique que
          SahelWarMapEngine.tsx (countryBorderPaths / acte1Refonte). */}
      {burkinaBorderPath && borderVisible && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {borderLit > 0.02 && (
            <>
              <path d={burkinaBorderPath.d} fill="none" stroke={BURKINA_ACCENT}
                strokeWidth={borderGlowW} strokeOpacity={0.20 * borderLit}
                strokeLinejoin="round" strokeLinecap="round" />
              <path d={burkinaBorderPath.d} fill="none" stroke={BURKINA_ACCENT}
                strokeWidth={borderGlowW * 0.55} strokeOpacity={0.28 * borderLit}
                strokeLinejoin="round" strokeLinecap="round" />
            </>
          )}
          <path d={burkinaBorderPath.d} fill="none" stroke={BURKINA_ACCENT}
            strokeWidth={3.4} strokeOpacity={0.95}
            strokeLinejoin="round" strokeLinecap="round"
            strokeDasharray={burkinaBorderPath.len} strokeDashoffset={borderOffset} />
        </svg>
      )}

      {/* Nom du pays — meme composant WarMapPlaque que la prod (parchemin + slide-in + fadeIn) */}
      {projBurkina && (
        <WarMapPlaque
          frame={frame}
          name="BURKINA FASO"
          pos={{ x: projBurkina.x, y: projBurkina.y }}
          appearAt={PLAQUE_APPEAR_AT}
          hideAt={PLAQUE_HIDE_AT}
          accent={BURKINA_ACCENT}
          yOffset={260}
        />
      )}

      {/* Drapeau reel plaque (public/_shared/flags/bf.png) — pattern Israel/Iran de la reference */}
      {projBurkina && frame >= FLAG_APPEAR_AT && (
        <div
          style={{
            position: "absolute",
            left: projBurkina.x - 200 - FLAG_W / 2,
            top: projBurkina.y - 40 - FLAG_H / 2,
            width: FLAG_W,
            height: FLAG_H,
            opacity: flagOpacity,
            transform: `scale(${flagScale})`,
            pointerEvents: "none",
            border: `2px solid ${BURKINA_ACCENT}`,
            boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
          }}
        >
          <img
            src={staticFile("_shared/flags/bf.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      {projBurkina && (
        <div
          style={{
            position: "absolute",
            left: projBurkina.x - 55,
            top: projBurkina.y - 20,
            width: 110,
            height: 40,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(139,26,26,0.55) 0%, rgba(139,26,26,0) 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      {projBurkina && (
        <div
          style={{
            position: "absolute",
            left: projBurkina.x - 90,
            top: projBurkina.y - 220 + riseY,
            width: 180,
            height: 240,
            opacity: riseOpacity,
            pointerEvents: "none",
            filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.5))",
          }}
        >
          <img
            src={staticFile("_shared/sprites/warmap/jeton-junte.png")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      )}

      {/* Jet : trajectoire interpolee en lon/lat + rotation orientee vers le cap de vol */}
      {projJetNow && jetVisible && (
        <div
          style={{
            position: "absolute",
            left: projJetNow.x - JET_SIZE / 2,
            top: projJetNow.y - JET_SIZE / 2,
            width: JET_SIZE,
            height: JET_SIZE,
            transform: `rotate(${jetAngle}deg)`,
            pointerEvents: "none",
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))",
          }}
        >
          <Plane size={JET_SIZE} color={COLORS.outline} strokeWidth={2.2} fill={COLORS.land} />
        </div>
      )}

      {projImpact && explosionActive && (
        <div
          style={{
            position: "absolute",
            left: projImpact.x - 90,
            top: projImpact.y - 90,
            width: 180,
            height: 180,
            opacity: explosionOpacity,
            pointerEvents: "none",
          }}
        >
          <img
            src={staticFile(`_shared/sprites/warmap/fx-explosion/${explosionIdx}.png`)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      )}

      {/* Alerte + ligne de blocus pointillee — pattern detroit d'Hormuz de la reference :
          ligne dashed en diagonale (stroke-dasharray/dashoffset, meme mecanique que le contour)
          + triangle jaune qui pop au point de croisement. */}
      {projAlert && frame >= ALERT_AT && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <line
            x1={projAlert.x - 70} y1={projAlert.y - 70}
            x2={projAlert.x + 30} y2={projAlert.y + 55}
            stroke="#E8C547" strokeWidth={4} strokeLinecap="round"
            strokeDasharray="10 8"
            strokeDashoffset={160 * (1 - lineDraw)}
            opacity={lineDraw > 0.01 ? 1 : 0}
          />
        </svg>
      )}
      {projAlert && alertPop > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: projAlert.x - 26,
            top: projAlert.y - 26 - 50,
            transform: `scale(${alertPop})`,
            opacity: alertBlink,
            pointerEvents: "none",
            filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.5))",
          }}
        >
          <TriangleAlert size={52} color="#1A1A1A" fill="#E8C547" strokeWidth={1.8} />
        </div>
      )}
    </AbsoluteFill>
  );
};

export default ProtoSilhouetteRiseFx;
