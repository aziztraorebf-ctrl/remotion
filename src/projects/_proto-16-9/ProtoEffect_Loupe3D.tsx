/**
 * PROTO LOUPE 3D (idee Aziz) — combine @remotion/three (vraie 3D volumetrique) + l'effet loupe
 * magnifier. La ou le proto Loupe 2D grossissait du TEXTE plat, ici on grossit de la GEOMETRIE 3D :
 * la silhouette du Senegal extrudee en relief, survolee par une loupe physique. Sous le verre,
 * une 2e camera RAPPROCHEE revele le territoire de pres + des points de gisement (petrole/gaz)
 * qui n'apparaissent QUE dans le cercle de la loupe = "regarder de plus pres revele ce qui est cache".
 *
 * Technique :
 *   - d3-geo + countries-50m.json → THREE.Shape → ExtrudeGeometry (pattern Country3DRise, eprouve).
 *   - DEUX ThreeCanvas superposes rendant la MEME scene :
 *       (1) couche base : camera large, vue d'ensemble.
 *       (2) couche zoom : camera rapprochee braquee sous la loupe + points emissifs visibles,
 *           clippee dans le cercle (clip-path) → equivalent 3D du magnifier 2D.
 *   - Monture loupe (SVG) par-dessus : verre + anneau metal + or + manche, suit la trajectoire.
 *
 * Pas de police externe (silhouette + label systeme). Render headless via scripts/render-mapbox.sh (--gl=angle).
 */
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  continueRender,
  delayRender,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { geoMercator } from "d3-geo";
import { feature } from "topojson-client";
import * as THREE from "three";

const W = 1920;
const H = 1080;
const NAVY_DEEP = "#0d1424";
const GOLD = "#c8a951";
const IVORY = "#f2ebd9";

// Gisements (coords ecran normalisees dans la boite [-2,2] du pays, devines a la louche
// sur la cote/sud-ouest du Senegal — c'est un proto, l'emplacement exact viendra du sujet).
const DEPOSITS: Array<[number, number, string]> = [
  [-0.9, -0.4, "SANGOMAR"],
  [-1.15, 0.75, "GTA"],
];

/** Charge le topojson une fois et renvoie les THREE.Shape[] du pays (coords normalisees ~[-2,2]). */
function useCountryShapes(geoName: string): THREE.Shape[] | null {
  const [shapes, setShapes] = React.useState<THREE.Shape[] | null>(null);
  const [handle] = React.useState(() => delayRender(`Loupe3D load ${geoName}`));

  React.useEffect(() => {
    let cancelled = false;
    fetch(staticFile("_shared/geo-data/countries-50m.json"))
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;
        const fc = feature(topo, topo.objects.countries) as unknown as {
          features: Array<{ properties: { name: string }; geometry: unknown }>;
        };
        const feat = fc.features.find((f) => f.properties?.name === geoName);
        if (!feat) {
          continueRender(handle);
          return;
        }
        const proj = geoMercator().fitSize([4, 4], feat as never);
        const geom = feat.geometry as {
          type: string;
          coordinates: number[][][] | number[][][][];
        };
        const allPolys: number[][][][] =
          geom.type === "Polygon"
            ? [geom.coordinates as unknown as number[][][]]
            : (geom.coordinates as unknown as number[][][][]);

        const built: THREE.Shape[] = [];
        for (const poly of allPolys) {
          const ring = poly[0]; // anneau exterieur seulement
          const pts: THREE.Vector2[] = [];
          for (const coord of ring) {
            const p = proj(coord as [number, number]);
            if (!p) continue;
            pts.push(new THREE.Vector2(p[0] - 2, -(p[1] - 2)));
          }
          if (pts.length >= 3) built.push(new THREE.Shape(pts));
        }
        if (!cancelled) {
          setShapes(built);
          continueRender(handle);
        }
      })
      .catch(() => continueRender(handle));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoName]);

  return shapes;
}

const ROT_X = -0.25;

/**
 * Pays extrude + gisements, SOLIDAIRES dans un meme groupe : on extrude SANS center(),
 * on calcule le centre du bbox, et on translate tout le groupe de -centre → pays centre a
 * l'origine ET gisements (poses en coords brutes du shape) restent colles au bon endroit.
 * `revealK` 0→1 : gisements invisibles a 0 (couche base), brillants a 1 (sous la loupe).
 */
const CountryGroup: React.FC<{ shapes: THREE.Shape[]; revealK: number; frame: number }> = ({
  shapes,
  revealK,
  frame,
}) => {
  const { geometry, center } = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.045,
      bevelSegments: 2,
    });
    g.computeBoundingBox();
    const bb = g.boundingBox!;
    const c = new THREE.Vector3();
    bb.getCenter(c);
    return { geometry: g, center: c };
  }, [shapes]);

  const pulse = 0.6 + 0.4 * Math.sin(frame * 0.18);

  return (
    <group rotation={[ROT_X, 0, 0]}>
      {/* translate de -centre : le pays vient se centrer a l'origine */}
      <group position={[-center.x, -center.y, -center.z]}>
        <mesh geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial color={"#3a5687"} metalness={0.3} roughness={0.55} />
        </mesh>
        {revealK > 0.001 &&
          DEPOSITS.map(([x, y], i) => (
            <group key={i} position={[x, -y, 0.55]}>
              {/* point de gisement : pastille nette */}
              <mesh>
                <sphereGeometry args={[0.045, 18, 18]} />
                <meshStandardMaterial
                  color={"#ffe9a8"}
                  emissive={new THREE.Color(GOLD)}
                  emissiveIntensity={revealK * 1.6}
                  toneMapped={false}
                />
              </mesh>
              {/* halo plat autour (anneau) qui pulse legerement */}
              <mesh position={[0, 0, -0.02]}>
                <ringGeometry args={[0.07, 0.07 + 0.03 * pulse, 32]} />
                <meshBasicMaterial color={GOLD} transparent opacity={revealK * 0.55} toneMapped={false} side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}
      </group>
    </group>
  );
};

/** Camera imperative frame-driven. */
const Cam: React.FC<{ pos: [number, number, number]; look: [number, number, number]; fov: number }> = ({
  pos,
  look,
  fov,
}) => {
  const { camera } = useThree();
  camera.position.set(...pos);
  camera.lookAt(...look);
  const persp = camera as THREE.PerspectiveCamera;
  if (persp.isPerspectiveCamera && persp.fov !== fov) {
    persp.fov = fov;
  }
  camera.updateProjectionMatrix();
  return null;
};

const Lights: React.FC = () => (
  <>
    <ambientLight intensity={0.9} color={"#8aa0c8"} />
    {/* key frontale forte (le pays doit etre LISIBLE) */}
    <directionalLight position={[2, 4, 8]} intensity={1.8} color={"#fff3df"} />
    {/* gold rasant = relief premium */}
    <directionalLight position={[7, 6, 3]} intensity={1.3} color={GOLD} castShadow />
    {/* fill froid cote oppose */}
    <directionalLight position={[-7, 2, 4]} intensity={0.7} color={"#6fa8dc"} />
    <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color={NAVY_DEEP} roughness={0.95} />
    </mesh>
  </>
);

interface LayerProps {
  shapes: THREE.Shape[];
  frame: number;
  cam: { pos: [number, number, number]; look: [number, number, number]; fov: number };
  revealK: number;
}

const SceneLayer: React.FC<LayerProps> = ({ shapes, frame, cam, revealK }) => (
  <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true }} style={{ backgroundColor: "transparent" }}>
    <Cam pos={cam.pos} look={cam.look} fov={cam.fov} />
    <Lights />
    <CountryGroup shapes={shapes} revealK={revealK} frame={frame} />
  </ThreeCanvas>
);

export const ProtoEffect_Loupe3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shapes = useCountryShapes("Senegal");

  // Trajectoire de la loupe : descend du nord-ouest vers le sud, en passant sur les gisements.
  const t = spring({ fps, frame: Math.max(0, frame - 8), config: { damping: 32, stiffness: 16 } });
  const lensX = interpolate(t, [0, 1], [W * 0.40, W * 0.56]);
  const lensY = interpolate(t, [0, 1], [H * 0.36, H * 0.62]);
  const R = 210; // rayon loupe ecran

  // Reveal des gisements : monte quand la loupe arrive sur la zone (apres ~1s de balayage).
  const revealK = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Camera base : vue large fixe, legere plongee.
  const baseCam = {
    pos: [0, 1.3, 7] as [number, number, number],
    look: [0, 0, 0] as [number, number, number],
    fov: 42,
  };

  // Camera zoom : braquee sur le gisement SANGOMAR, serree FORT (vrai grossissement).
  // On rapproche la camera ET on reduit le FOV → l'echelle apparente double largement.
  // Centre vise = 1er gisement, dans le repere TOURNE du pays (rotation -0.25 sur X).
  const rot = -0.25;
  const [gx, gyRaw] = DEPOSITS[0];
  const gy = -gyRaw; // flip comme dans le mesh
  // applique la rotation X au point (y,z) pour viser le bon endroit en monde
  const target: [number, number, number] = [
    gx,
    gy * Math.cos(rot) - 0.58 * Math.sin(rot),
    gy * Math.sin(rot) + 0.58 * Math.cos(rot),
  ];
  const zoomFov = interpolate(revealK, [0, 1], [42, 20]);
  const zoomCam = {
    pos: [target[0], target[1] + 0.4, target[2] + 2.6] as [number, number, number],
    look: target,
    fov: zoomFov,
  };

  const ready = shapes && shapes.length > 0;

  return (
    <AbsoluteFill style={{ background: NAVY_DEEP }}>
      {/* COUCHE BASE — pays en relief, vue large, gisements INVISIBLES */}
      {ready ? <SceneLayer shapes={shapes!} frame={frame} cam={baseCam} revealK={0} /> : null}

      {/* COUCHE ZOOM — meme scene camera rapprochee + gisements reveles, clippee sous la loupe */}
      {ready ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `circle(${R}px at ${lensX}px ${lensY}px)`,
            WebkitClipPath: `circle(${R}px at ${lensX}px ${lensY}px)`,
          }}
        >
          {/* fond opaque pour que le zoom ne laisse pas voir la couche base par transparence */}
          <div style={{ position: "absolute", inset: 0, background: NAVY_DEEP }} />
          <SceneLayer shapes={shapes!} frame={frame} cam={zoomCam} revealK={revealK} />
        </div>
      ) : null}

      {/* MONTURE LOUPE (SVG) */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <radialGradient id="l3dglass" cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.20)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <circle cx={lensX} cy={lensY} r={R} fill="url(#l3dglass)" />
        <circle cx={lensX} cy={lensY} r={R} fill="none" stroke="#2a2f3a" strokeWidth={16} />
        <circle cx={lensX} cy={lensY} r={R} fill="none" stroke={GOLD} strokeWidth={4} opacity={0.7} />
        <line
          x1={lensX + Math.cos(Math.PI / 4) * R}
          y1={lensY + Math.sin(Math.PI / 4) * R}
          x2={lensX + Math.cos(Math.PI / 4) * (R + 170)}
          y2={lensY + Math.sin(Math.PI / 4) * (R + 170)}
          stroke="#2a2f3a"
          strokeWidth={30}
          strokeLinecap="round"
        />
        <line
          x1={lensX + Math.cos(Math.PI / 4) * R}
          y1={lensY + Math.sin(Math.PI / 4) * R}
          x2={lensX + Math.cos(Math.PI / 4) * (R + 170)}
          y2={lensY + Math.sin(Math.PI / 4) * (R + 170)}
          stroke={GOLD}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.5}
        />
      </svg>

      {/* Labels gisements : apparaissent avec le reveal, sous la loupe seulement */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `circle(${R}px at ${lensX}px ${lensY}px)`,
          WebkitClipPath: `circle(${R}px at ${lensX}px ${lensY}px)`,
          opacity: revealK,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: lensX,
            top: lensY - R * 0.55,
            transform: "translate(-50%,-50%)",
            color: IVORY,
            fontFamily: "'Bebas Neue','Impact',sans-serif",
            fontSize: 28,
            letterSpacing: "0.12em",
            textShadow: `0 0 16px ${GOLD}, 0 2px 8px rgba(0,0,0,0.8)`,
          }}
        >
          GISEMENT SANGOMAR
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default ProtoEffect_Loupe3D;
