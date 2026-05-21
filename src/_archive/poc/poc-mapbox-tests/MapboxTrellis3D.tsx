/**
 * MapboxTrellis3D v2 — modèle TRELLIS .glb ancré géographiquement dans Mapbox
 *
 * Architecture : Mapbox Custom Layer (renderingMode: "3d")
 * Le renderer Three.js partage le contexte WebGL de Mapbox GL.
 *
 * Scène : Ghana (Kumasi) — zoom cinématique depuis vue large vers vue rapprochée
 *   0–60f   : vue large zoom 7, modèle minuscule visible au sol
 *   60–120f : zoom-in 7→14, le modèle grossit
 *   120–165f: vue rapprochée zoom 14, rotation du modèle, pitch 55°
 *
 * Fix v2 : MercatorCoordinate.fromLngLat officiel Mapbox pour position exacte
 * Fix v2 : modelMatrix = translate * scale (pattern Mapbox docs officiel)
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MapboxBrandingHide, applyGeoAfriqueV5 } from "../_shared/mapbox/MapboxBase";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Kumasi, Ghana — capitale Ashanti, ville historique
const KUMASI: mapboxgl.LngLatLike = [-1.6236, 6.6885];
const KUMASI_LON = -1.6236;
const KUMASI_LAT = 6.6885;

// Scène 5.5s @ 30fps
export const MAPBOX_TRELLIS_3D_FRAMES = 165;

// Hauteur du modèle en mètres — volontairement exagérée comme Vox/Johnny Harris
// 3000m = environ la hauteur du Mont Blanc, clairement visible sur carte zoom 9
const MODEL_HEIGHT_METERS = 3000;

// ---------------------------------------------------------------------------
// Keyframes caméra
// ---------------------------------------------------------------------------
const KF = {
  WIDE_END:  60,   // fin de la vue large
  CLOSE_END: 165,  // fin du zoom rapproché
};

// ---------------------------------------------------------------------------
// Helpers interpolation
// ---------------------------------------------------------------------------

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ---------------------------------------------------------------------------
// Custom Layer — pattern officiel Mapbox docs
// Ref: https://docs.mapbox.com/mapbox-gl-js/example/add-3d-model/
// ---------------------------------------------------------------------------

function buildTrellisLayer(getFrame: () => number, totalFrames: number): mapboxgl.CustomLayerInterface {
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.Camera;
  let model: THREE.Object3D | null = null;
  let map: mapboxgl.Map;

  // Coordonnées Mercator du point d'ancrage (via API officielle Mapbox)
  // MercatorCoordinate.fromLngLat retourne {x, y, z} dans [0,1]
  const modelOrigin = mapboxgl.MercatorCoordinate.fromLngLat(
    { lng: KUMASI_LON, lat: KUMASI_LAT },
    0 // altitude au sol
  );

  // Échelle Mercator : meterInMercatorCoordinateUnits() donne le facteur de conversion
  // pour que MODEL_HEIGHT_METERS mètres = la bonne taille dans l'espace Mercator
  const modelScale = modelOrigin.meterInMercatorCoordinateUnits() * MODEL_HEIGHT_METERS;

  // Matrice de transformation : translate vers le point Mercator + scale
  // C'est le pattern exact de la doc Mapbox officielle
  const modelMatrix = new THREE.Matrix4();

  return {
    id: "trellis-3d-model",
    type: "custom",
    renderingMode: "3d",

    onAdd(m: mapboxgl.Map, gl: WebGL2RenderingContext) {
      map = m;

      // Three.js partage le canvas ET le contexte WebGL de Mapbox
      renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl as unknown as WebGLRenderingContext,
        antialias: true,
      });
      renderer.autoClear = false;

      scene = new THREE.Scene();

      // Lumières — soleil Sahel chaud + fill ciel bleu
      const ambient = new THREE.AmbientLight(0xfff4e0, 1.4);
      scene.add(ambient);

      const sun = new THREE.DirectionalLight(0xfff8d0, 3.0);
      sun.position.set(1, 1, 1).normalize();
      scene.add(sun);

      const fill = new THREE.DirectionalLight(0xc8d8ff, 0.8);
      fill.position.set(-1, 0.5, -1).normalize();
      scene.add(fill);

      camera = new THREE.Camera();

      // Charger le GLB
      const loader = new GLTFLoader();
      loader.load(
        staticFile("poc-mapbox-tests/models/trellis-tour-pisee.glb"),
        (gltf) => {
          model = gltf.scene;

          // Orientation : GLB exporté Z-up → corriger pour Mercator
          model.rotation.x = Math.PI / 2;

          // Centrer le pivot du modèle à sa base (pas à son centre de masse)
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          model.position.y = 0; // poser au sol

          scene.add(model);

          // Forcer un re-render Mapbox maintenant que le modèle est prêt
          map.triggerRepaint();
        },
        undefined,
        (err) => console.error("[Trellis3D] GLB error:", err)
      );
    },

    render(_gl: WebGL2RenderingContext, matrix: number[]) {
      if (!model) return;

      const frame = getFrame();
      const progress = frame / totalFrames;

      // Rotation lente sur l'axe vertical (Z après rotation.x = PI/2)
      model.rotation.z = progress * Math.PI * 2;

      // Matrice de transformation Mercator → espace Mapbox GL
      // Pattern officiel : translate(mercX, mercY, mercZ) * scale(modelScale)
      modelMatrix.makeTranslation(
        modelOrigin.x,
        modelOrigin.y,
        modelOrigin.z
      );
      modelMatrix.scale(new THREE.Vector3(modelScale, -modelScale, modelScale));

      // Matrice de projection Mapbox (camera + perspective + zoom + pitch)
      const mapMatrix = new THREE.Matrix4().fromArray(matrix);

      // Camera = projection Mapbox * transformation Mercator
      // C'est ce que Mapbox docs appellent "l-value" pour le custom layer
      camera.projectionMatrix = mapMatrix.multiply(modelMatrix);

      renderer.resetState();
      renderer.render(scene, camera);

      // Déclencher le prochain frame Mapbox pour animation continue
      map.triggerRepaint();
    },

    onRemove() {
      scene?.clear();
      renderer?.dispose();
    },
  };
}

// ---------------------------------------------------------------------------
// Composant Remotion
// ---------------------------------------------------------------------------

export const MapboxTrellis3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(frame);
  const handle = useRef(delayRender("mapbox-trellis-init"));
  const layerAdded = useRef(false);

  frameRef.current = frame;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [KUMASI_LON, KUMASI_LAT],
      zoom: 5,
      pitch: 20,
      bearing: 0,
      interactive: false,
      preserveDrawingBuffer: true,
      antialias: true,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      // Appliquer palette GéoAfrique V5
      applyGeoAfriqueV5(map);

      if (!layerAdded.current) {
        const layer = buildTrellisLayer(
          () => frameRef.current,
          durationInFrames
        );
        map.addLayer(layer);
        layerAdded.current = true;
      }

      continueRender(handle.current);
    });

    map.on("error", (e) => {
      console.error("[Trellis3D] Map error:", e.error);
      continueRender(handle.current);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      layerAdded.current = false;
    };
  }, [durationInFrames]);

  // Animation caméra calée sur les frames Remotion
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (frame <= KF.WIDE_END) {
      // Phase 1 : vue large Afrique de l'Ouest — modèle minuscule mais visible
      map.jumpTo({
        center: [KUMASI_LON, KUMASI_LAT],
        zoom: 5,
        pitch: 20,
        bearing: 0,
      });
    } else {
      // Phase 2 : zoom-in cinématique — le modèle grossit et on tourne autour
      const t = easeInOut((frame - KF.WIDE_END) / (KF.CLOSE_END - KF.WIDE_END));

      map.jumpTo({
        center: [KUMASI_LON, KUMASI_LAT],
        zoom: lerp(5, 10, t),   // zoom 5→10 : modèle passe de point à silhouette imposante
        pitch: lerp(20, 68, t), // pitch 20→68° : on bascule pour voir le modèle de côté
        bearing: lerp(0, 60, t), // rotation 60° autour du modèle
      });
    }
  }, [frame]);

  // Phase courante pour le label
  const phase =
    frame <= KF.WIDE_END
      ? "Vue large — Ghana"
      : "Zoom-in — Kumasi";

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MapboxBrandingHide />
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <div style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        background: "rgba(0,0,0,0.75)",
        color: "#fff",
        fontFamily: "monospace",
        fontSize: 13,
        padding: "6px 14px",
        borderRadius: 4,
        pointerEvents: "none",
      }}>
        {phase} | f{frame}/{durationInFrames} | Kumasi 6.69°N 1.62°O
      </div>
    </AbsoluteFill>
  );
};
