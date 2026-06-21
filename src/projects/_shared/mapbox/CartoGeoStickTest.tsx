/**
 * CartoGeoStickTest — test de STRESS du collage geo des overlays (pas un livrable).
 * Dezoom BRUTAL (zoom 8.5 -> 2.5 en 30 frames = ~10x la vitesse d'une scene normale) + pan + rotation.
 * Un marqueur ancre sur Dakar [-17.45, 14.69]. But : verifier au pixel qu'il reste COLLE a la cote
 * pendant le mouvement violent (pas de trainee d'1 frame en headless). Prouve le pattern map.project()/frame.
 */
import React, { useRef, useState } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type mapboxgl from "mapbox-gl";
import { CartoSouverainV5 } from "./CartoSouverainV5";

const DAKAR: [number, number] = [-17.45, 14.69];

export const CartoGeoStickTest: React.FC = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [, force] = useState(0);
  return (
    <AbsoluteFill>
      <CartoSouverainV5
        focusIsos={["SEN"]}
        camKeys={[
          // dezoom brutal + pan + rotation simultanes (stress max du collage)
          { atProgress: 0.0, cam: { lon: -17.45, lat: 14.69, zoom: 8.5, pitch: 0, bearing: 0 } },
          { atProgress: 1.0, cam: { lon: -6.0, lat: 18.0, zoom: 2.5, pitch: 40, bearing: 35 } },
        ]}
        onMapReady={(m) => { mapRef.current = m; force((n) => n + 1); }}
      >
        <Crosshair mapRef={mapRef} />
      </CartoSouverainV5>
    </AbsoluteFill>
  );
};

// Croix de visee EXACTEMENT sur Dakar (reprojetee chaque frame). Doit rester sur la pointe de Dakar.
const Crosshair: React.FC<{ mapRef: React.MutableRefObject<mapboxgl.Map | null> }> = ({ mapRef }) => {
  useCurrentFrame(); // force re-render par frame
  const map = mapRef.current;
  if (!map) return null;
  const p = map.project(DAKAR as any);
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {/* croix fine + cercle : doit coller a la pointe de Dakar pendant tout le mouvement */}
      <circle cx={p.x} cy={p.y} r={16} fill="none" stroke="#ff3b30" strokeWidth={3} />
      <line x1={p.x - 28} y1={p.y} x2={p.x + 28} y2={p.y} stroke="#ff3b30" strokeWidth={2} />
      <line x1={p.x} y1={p.y - 28} x2={p.x} y2={p.y + 28} stroke="#ff3b30" strokeWidth={2} />
    </svg>
  );
};

export default CartoGeoStickTest;
