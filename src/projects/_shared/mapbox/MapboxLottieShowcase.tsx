import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mapboxgl from "mapbox-gl";
import lottie from "lottie-web";
import {
  MapboxBrandingHide,
  MAPBOX_STYLES,
  applyGeoAfriqueV5,
} from "./MapboxBase";

// ─────────────────────────────────────────────────────────────────────────────
// MapboxLottieShowcase — Narrative pétrole africain via Lottie + Mapbox
//
// 5 scènes × 10s = 1500f @ 30fps = 50s
// Combine Lottie générés inline + Lottie premium (smoke.json)
//
// S1 (0-10s)   Dakar          PULSE MULTI-ANNEAUX     "Découverte"
// S2 (10-20s)  Sénégal champ  SMOKE PREMIUM (web)      "Le site"
// S3 (20-30s)  SN → Dakar     PIPELINE LIGNE + FLUX    "Le pipeline"
// S4 (30-40s)  AO → Europe    MARQUEURS SÉQUENTIELS    "L'export"
// S5 (40-50s)  Afrique Ouest  COMBO smoke+pulse+flux   "Le réseau"
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const SCENE_DUR = 300;
const S = Array.from({ length: 6 }, (_, i) => i * SCENE_DUR);

const LOC = {
  dakar:      [-17.457, 14.712] as [number, number],
  champSN:    [-17.85,  14.05]  as [number, number], // Champ Sangomar offshore
  westAfrica: [-3.0,    10.0]   as [number, number],
  europe:     [4.0,     45.0]   as [number, number],
};

const COLORS = {
  gold:   "#c8a951",
  goldHi: "#e8c472",
  ivory:  "#f2ebd9",
  amber:  "#d4831f",
};

function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOTTIE JSON GÉNÉRÉS INLINE
// ═══════════════════════════════════════════════════════════════════════════════

// S1 — Pulse multi-anneaux (3 cercles concentriques avec délai)
// Chaque anneau scale 0→max + fade out
function lottiePulseRings() {
  const makeRing = (delay: number, color: number[]) => ({
    ddd: 0, ind: 1, ty: 4, nm: `ring${delay}`, sr: 1,
    ks: {
      o: { a: 1, k: [
        { t: delay,      s: [90] },
        { t: delay + 30, s: [0] },
      ]},
      r: { a: 0, k: 0 },
      p: { a: 0, k: [256, 256, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [
        { i: { x: [0.2], y: [1] }, o: { x: [0.8], y: [0] },
          t: delay,      s: [10, 10, 100] },
        { t: delay + 30, s: [180, 180, 100] },
      ]},
    },
    ao: 0,
    shapes: [{
      ty: "gr",
      it: [
        // Anneau (ellipse stroke seulement)
        { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [200, 200] } },
        { ty: "st", c: { a: 0, k: color }, o: { a: 0, k: 100 }, w: { a: 0, k: 6 },
          lc: 2, lj: 1, ml: 4 },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
      ],
    }],
    ip: delay, op: delay + 30, st: 0,
  });

  return {
    v: "5.7.4", fr: 30, ip: 0, op: 60, w: 512, h: 512, nm: "pulse-rings",
    ddd: 0, assets: [],
    layers: [
      makeRing(0,  [0.784, 0.663, 0.318, 1]),  // or
      makeRing(15, [0.910, 0.769, 0.447, 1]),  // or clair
      makeRing(30, [0.831, 0.514, 0.122, 1]),  // ambre
      // Point central permanent
      {
        ddd: 0, ind: 99, ty: 4, nm: "center", sr: 1,
        ks: {
          o: { a: 0, k: 100 }, r: { a: 0, k: 0 },
          p: { a: 0, k: [256, 256, 0] }, a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [
            { t: 0,  s: [80, 80, 100] },
            { t: 15, s: [120, 120, 100] },
            { t: 30, s: [80, 80, 100] },
            { t: 45, s: [120, 120, 100] },
            { t: 59, s: [80, 80, 100] },
          ]},
        },
        ao: 0,
        shapes: [{
          ty: "gr",
          it: [
            { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [30, 30] } },
            { ty: "fl", c: { a: 0, k: [0.910, 0.769, 0.447, 1] }, o: { a: 0, k: 100 }, r: 1 },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        }],
        ip: 0, op: 60, st: 0,
      },
    ],
  };
}

// S3 — Flux de particules le long d'un pipeline
// 5 points qui suivent une trajectoire horizontale avec délais
function lottieFlowParticles() {
  const makeParticle = (delay: number) => ({
    ddd: 0, ind: delay + 1, ty: 4, nm: `p${delay}`, sr: 1,
    ks: {
      o: { a: 1, k: [
        { t: delay,      s: [0] },
        { t: delay + 5,  s: [100] },
        { t: delay + 35, s: [100] },
        { t: delay + 40, s: [0] },
      ]},
      r: { a: 0, k: 0 },
      p: { a: 1, k: [
        { i: { x: 0.5, y: 0.5 }, o: { x: 0.5, y: 0.5 }, t: delay,
          s: [50, 256], e: [462, 256] },
        { t: delay + 40, s: [462, 256] },
      ]},
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    ao: 0,
    shapes: [{
      ty: "gr",
      it: [
        { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [22, 22] } },
        { ty: "fl", c: { a: 0, k: [0.910, 0.769, 0.447, 1] }, o: { a: 0, k: 100 }, r: 1 },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
      ],
    }],
    ip: delay, op: delay + 40, st: 0,
  });

  return {
    v: "5.7.4", fr: 30, ip: 0, op: 60, w: 512, h: 512, nm: "flow",
    ddd: 0, assets: [],
    layers: [
      makeParticle(0),
      makeParticle(8),
      makeParticle(16),
      makeParticle(24),
      makeParticle(32),
    ],
  };
}

// S4 — Marqueurs séquentiels (6 points qui apparaissent en cascade)
function lottieMarkers() {
  // 6 positions distribuées (simulant ports européens)
  const positions: Array<[number, number]> = [
    [120, 180], [220, 140], [320, 160], [180, 280], [300, 260], [240, 340],
  ];
  const layers = positions.map(([x, y], i) => {
    const delay = i * 8;
    return {
      ddd: 0, ind: i + 1, ty: 4, nm: `m${i}`, sr: 1,
      ks: {
        o: { a: 1, k: [
          { t: delay,      s: [0] },
          { t: delay + 6,  s: [100] },
        ]},
        r: { a: 0, k: 0 },
        p: { a: 0, k: [x, y, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [
          { i: { x: [0.3], y: [1.5] }, o: { x: [0.7], y: [0] },
            t: delay,      s: [0, 0, 100] },
          { t: delay + 6,  s: [130, 130, 100] },
          { t: delay + 10, s: [100, 100, 100] },
        ]},
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [
          { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [28, 28] } },
          { ty: "fl", c: { a: 0, k: [0.910, 0.769, 0.447, 1] }, o: { a: 0, k: 100 }, r: 1 },
          { ty: "st", c: { a: 0, k: [0.95, 0.92, 0.85, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 3 } },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
        ],
      }],
      ip: delay, op: 60, st: 0,
    };
  });

  return {
    v: "5.7.4", fr: 30, ip: 0, op: 60, w: 512, h: 512, nm: "markers",
    ddd: 0, assets: [],
    layers,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function ensureSource(map: mapboxgl.Map) {
  if (!map.getSource("cb-source")) {
    map.addSource("cb-source", { type: "vector", url: "mapbox://mapbox.country-boundaries-v1" });
  }
}

function pushCanvas(map: mapboxgl.Map, id: string, canvas: HTMLCanvasElement) {
  if (!canvas || canvas.width === 0) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  try {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data as unknown as Uint8Array;
    if (!map.hasImage(id)) {
      map.addImage(id, { width: canvas.width, height: canvas.height, data });
    } else {
      map.updateImage(id, { width: canvas.width, height: canvas.height, data });
    }
  } catch {}
}

function ensureFillLayer(map: mapboxgl.Map, layerId: string, imgId: string, iso: string) {
  if (!map.getLayer(layerId)) {
    map.addLayer({
      id: layerId, type: "fill", source: "cb-source",
      "source-layer": "country_boundaries",
      filter: ["==", ["get", "iso_3166_1_alpha_3"], iso],
      paint: { "fill-pattern": imgId, "fill-opacity": 0 },
    });
  }
}

// Convert lon/lat → screen pixels via mapbox.project (utile pour overlay positionné)
function projectToScreen(map: mapboxgl.Map, lon: number, lat: number) {
  const p = map.project([lon, lat]);
  return { x: p.x, y: p.y };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT
// ═══════════════════════════════════════════════════════════════════════════════

export const MapboxLottieShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [smokeJson, setSmokeJson] = useState<object | null>(null);
  const [, forceRender] = useState(0);

  // 4 Lottie instances : pulse / flow / markers / smoke
  const lottieInstances = useRef<Record<string, {
    anim: { goToAndStop: (f: number, b: boolean) => void; destroy?: () => void; totalFrames: number };
    canvas: HTMLCanvasElement | null;
    container: HTMLDivElement;
  }>>({});

  const sceneIdx = Math.min(Math.floor(frame / SCENE_DUR), 4);
  const sceneFrame = frame - S[sceneIdx];
  const tScene = clamp01(sceneFrame / SCENE_DUR);

  // ── Load smoke JSON premium ─────────────────────────────────────────────────
  useEffect(() => {
    if (smokeJson) return;
    fetch(staticFile("_shared/lottie/smoke.json"))
      .then(r => r.json())
      .then(j => setSmokeJson(j))
      .catch(() => {});
  }, []);

  // ── Init Lottie helper ──────────────────────────────────────────────────────
  function createLottie(key: string, json: object, width: number, height: number) {
    if (lottieInstances.current[key]) return;
    const container = document.createElement("div");
    container.style.cssText = `position:absolute;width:${width}px;height:${height}px;opacity:0;left:-9999px;top:-9999px;`;
    document.body.appendChild(container);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anim = lottie.loadAnimation({
        container,
        animationData: json,
        renderer: "canvas",
        loop: true,
        autoplay: false,
        rendererSettings: { clearCanvas: true, progressiveLoad: false },
      } as any);

      lottieInstances.current[key] = {
        anim: anim as unknown as typeof lottieInstances.current[string]["anim"],
        canvas: null,
        container,
      };

      anim.addEventListener("DOMLoaded", () => {
        const created = container.querySelector("canvas") as HTMLCanvasElement | null;
        if (created && lottieInstances.current[key]) {
          lottieInstances.current[key].canvas = created;
          forceRender(n => n + 1);
        }
      });
    } catch {}
  }

  // ── Init map + premium Lottie quand smokeJson dispo ─────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    // Créer les 3 Lottie générés (pulse, flow, markers)
    createLottie("pulse",   lottiePulseRings(),    512, 512);
    createLottie("flow",    lottieFlowParticles(), 512, 512);
    createLottie("markers", lottieMarkers(),       512, 512);

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES.dark,
      center: LOC.dakar,
      zoom: 5.5,
      pitch: 20,
      bearing: 0,
      interactive: false,
      preserveDrawingBuffer: true,
      antialias: true,
    });

    map.on("style.load", () => {
      try {
        (map as mapboxgl.Map & { setProjection?: (p: string) => void })
          .setProjection?.("mercator");
      } catch {}
      applyGeoAfriqueV5(map);
      setReady(true);
    });

    mapRef.current = map;
    return () => {
      Object.values(lottieInstances.current).forEach(({ anim, container }) => {
        try { anim.destroy?.(); } catch {}
        try { document.body.removeChild(container); } catch {}
      });
      lottieInstances.current = {};
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Init smoke premium quand JSON chargé ────────────────────────────────────
  useEffect(() => {
    if (!smokeJson) return;
    createLottie("smoke", smokeJson, 512, 512);
  }, [smokeJson]);

  // ── Récupérer un canvas Lottie de manière sûre ──────────────────────────────
  function getLottieCanvas(key: string, atFrame: number): HTMLCanvasElement | null {
    const inst = lottieInstances.current[key];
    if (!inst || !inst.canvas) return null;
    try {
      const total = inst.anim.totalFrames || 60;
      inst.anim.goToAndStop(atFrame % Math.floor(total), true);
    } catch {}
    return inst.canvas;
  }

  // ── Engine principal ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    const map = mapRef.current;
    ensureSource(map);

    // ── S1 : PULSE depuis Dakar — "Découverte" ─────────────────────────────
    if (sceneIdx === 0) {
      map.jumpTo({
        center: LOC.dakar,
        zoom: interpolate(tScene, [0, 1], [4.5, 5.8]),
        pitch: 20,
        bearing: tScene * 5,
      });

      const c = getLottieCanvas("pulse", sceneFrame);
      if (c) {
        pushCanvas(map, "img-pulse", c);
        ensureFillLayer(map, "sn-pulse", "img-pulse", "SEN");
        const opacity = Math.min(0.85, tScene * 2.5);
        try { map.setPaintProperty("sn-pulse", "fill-opacity", opacity); } catch {}
      }
    }

    // ── S2 : SMOKE PREMIUM sur le champ Sangomar ───────────────────────────
    if (sceneIdx === 1) {
      map.jumpTo({
        center: LOC.champSN,
        zoom: interpolate(tScene, [0, 1], [6.0, 7.5]),
        pitch: 35,
        bearing: -10,
      });

      const c = getLottieCanvas("smoke", sceneFrame);
      if (c) {
        pushCanvas(map, "img-smoke", c);
        ensureFillLayer(map, "sn-smoke", "img-smoke", "SEN");
        const opacity = Math.min(0.7, tScene * 2);
        try { map.setPaintProperty("sn-smoke", "fill-opacity", opacity); } catch {}
      } else {
        // Fallback : pulse en attendant le chargement smoke
        const cb = getLottieCanvas("pulse", sceneFrame);
        if (cb) {
          pushCanvas(map, "img-pulse-fb", cb);
          ensureFillLayer(map, "sn-pulse-fb", "img-pulse-fb", "SEN");
          try { map.setPaintProperty("sn-pulse-fb", "fill-opacity", Math.min(0.5, tScene * 1.5)); } catch {}
        }
      }
    }

    // ── S3 : PIPELINE FLUX — Sénégal → Dakar ──────────────────────────────
    if (sceneIdx === 2) {
      map.jumpTo({
        center: LOC.dakar,
        zoom: 5.3,
        pitch: 25,
        bearing: 0,
      });

      const c = getLottieCanvas("flow", sceneFrame);
      if (c) {
        pushCanvas(map, "img-flow", c);
        ensureFillLayer(map, "sn-flow", "img-flow", "SEN");
        const opacity = Math.min(0.9, tScene * 2.5);
        try { map.setPaintProperty("sn-flow", "fill-opacity", opacity); } catch {}
      }
    }

    // ── S4 : MARQUEURS — exports vers Europe ──────────────────────────────
    if (sceneIdx === 3) {
      map.jumpTo({
        center: [-3.0, 28.0],
        zoom: interpolate(tScene, [0, 1], [3.2, 3.8]),
        pitch: 15,
        bearing: 0,
      });

      // Markers sur 5 pays exportateurs : SEN, MAR, NGA, GHA, AGO
      const exportCountries = ["SEN", "MAR", "NGA", "GHA", "AGO"];
      const c = getLottieCanvas("markers", sceneFrame);
      if (c) {
        pushCanvas(map, "img-markers", c);
        exportCountries.forEach(iso => {
          ensureFillLayer(map, `markers-${iso}`, "img-markers", iso);
          const opacity = Math.min(0.85, tScene * 2);
          try { map.setPaintProperty(`markers-${iso}`, "fill-opacity", opacity); } catch {}
        });
      }
    }

    // ── S5 : COMBO — smoke + pulse + flow sur l'Afrique de l'Ouest ────────
    if (sceneIdx === 4) {
      map.jumpTo({
        center: LOC.westAfrica,
        zoom: interpolate(tScene, [0, 1], [3.5, 4.3]),
        pitch: interpolate(tScene, [0, 0.5], [10, 30], { extrapolateRight: "clamp" }),
        bearing: interpolate(tScene, [0, 1], [-10, 10]),
      });

      // 3 pays avec 3 Lottie différents simultanément
      // Sénégal = smoke premium
      // Nigeria = pulse
      // Ghana = flow
      const cSmoke = getLottieCanvas("smoke", sceneFrame);
      const cPulse = getLottieCanvas("pulse", sceneFrame);
      const cFlow  = getLottieCanvas("flow",  sceneFrame);

      if (cSmoke) {
        pushCanvas(map, "img-smoke-2", cSmoke);
        ensureFillLayer(map, "sen-smoke-2", "img-smoke-2", "SEN");
        try { map.setPaintProperty("sen-smoke-2", "fill-opacity", Math.min(0.75, tScene * 2)); } catch {}
      }
      if (cPulse) {
        pushCanvas(map, "img-pulse-2", cPulse);
        ensureFillLayer(map, "nga-pulse-2", "img-pulse-2", "NGA");
        try { map.setPaintProperty("nga-pulse-2", "fill-opacity", Math.min(0.85, tScene * 2)); } catch {}
      }
      if (cFlow) {
        pushCanvas(map, "img-flow-2", cFlow);
        ensureFillLayer(map, "gha-flow-2", "img-flow-2", "GHA");
        try { map.setPaintProperty("gha-flow-2", "fill-opacity", Math.min(0.9, tScene * 2)); } catch {}
      }
    }
  });

  // ── Labels narratifs ────────────────────────────────────────────────────────
  const LABELS = [
    { title: "Découverte",   sub: "Pétrole offshore au large de Dakar", lottie: "PULSE MULTI-ANNEAUX (généré)" },
    { title: "Le site",      sub: "Champ Sangomar — production en cours", lottie: "SMOKE — Lottie premium" },
    { title: "Le pipeline",  sub: "Du champ au port d'export",            lottie: "FLUX PARTICULES (généré)" },
    { title: "L'export",     sub: "5 producteurs africains majeurs",     lottie: "MARQUEURS SÉQUENTIELS (généré)" },
    { title: "Le réseau",    sub: "Trois pôles, trois rôles simultanés", lottie: "COMBO 3 Lottie en même temps" },
  ];
  const label = LABELS[sceneIdx];

  return (
    <AbsoluteFill style={{ background: "#0d1520" }}>
      <MapboxBrandingHide />
      <AbsoluteFill>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>

      {/* HUD narratif */}
      <div style={{
        position: "absolute", top: 50, left: 56,
        display: "flex", flexDirection: "column", gap: 8,
        maxWidth: 600,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            background: COLORS.gold,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700,
            color: "#0d1520",
          }}>
            {sceneIdx + 1}
          </div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 700,
            color: COLORS.ivory, letterSpacing: 0.5,
          }}>
            {label.title}
          </div>
        </div>
        <div style={{
          paddingLeft: 56,
          fontFamily: "Georgia, serif", fontSize: 18,
          color: "rgba(242,235,217,0.75)", fontStyle: "italic",
        }}>
          {label.sub}
        </div>
        <div style={{
          paddingLeft: 56, marginTop: 4,
          fontFamily: "monospace", fontSize: 11, color: COLORS.gold,
          letterSpacing: 2, textTransform: "uppercase",
        }}>
          ▸ {label.lottie}
        </div>
      </div>

      {/* Barre progression scène */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 3, background: "rgba(255,255,255,0.08)",
      }}>
        <div style={{
          height: "100%",
          width: `${(sceneFrame / SCENE_DUR) * 100}%`,
          background: COLORS.gold, transition: "none",
        }} />
      </div>

      {/* Minimap 5 scènes */}
      <div style={{
        position: "absolute", bottom: 24, left: "50%",
        transform: "translateX(-50%)", display: "flex", gap: 8,
      }}>
        {LABELS.map((_, i) => (
          <div key={i} style={{
            width: 32, height: 5, borderRadius: 2,
            background: i === sceneIdx ? COLORS.gold
              : frame > S[i] ? "rgba(200,169,81,0.4)"
              : "rgba(255,255,255,0.15)",
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const MAPBOX_LOTTIE_SHOWCASE_FRAMES = S[5]; // 1500
