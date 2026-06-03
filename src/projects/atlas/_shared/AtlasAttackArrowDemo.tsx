/**
 * AtlasAttackArrowDemo — validation render de AtlasAttackArrow.
 * Carte Peste réutilisée (MERC_LARGE) pour projection alignée lngLatToSvg.
 * 2 flèches séquentielles sur l'Europe (style diagramme tactique Napoléon).
 * Pas de son. Cas-test, pas livrable.
 */

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AtlasMercator } from "./atlas-components";
import { AtlasAttackArrow } from "./AtlasAttackArrow";
import { MERC_LARGE, WIDTH as W, HEIGHT as H } from "../peste-1347/mapConfig";

const OCEAN = "#dcd2bd"; // fond clair parchemin (charte Atlas lumineuse, mode diagramme tactique)

// villes ouest-africaines (lon, lat) — alignées sur la projection geoUtils (ancrages Mali).
// Conquête/route sahélienne Bamako -> Tombouctou -> Gao -> Agadez.
const BAMAKO = { lon: -8.0, lat: 12.6 };
const TOMBOUCTOU = { lon: -3.0, lat: 16.77 };
const GAO = { lon: 0.04, lat: 16.27 };
const AGADEZ = { lon: 7.99, lat: 16.97 };

export const AtlasAttackArrowDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // caméra : zoom serré sur la zone sahélienne (villes en x~210-330, y~695-728)
  // centrer (~272, 712) au milieu du cadre (360,640) : drift = (360-272, 640-712)*scale
  const camScale = 4.2;
  const driftX = (360 - 272) * camScale;
  const driftY = (640 - 712) * camScale;

  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  // flèche 1 : Bamako -> Tombouctou -> Gao (séquentielle, f15 -> f120)
  const p1 = interpolate(frame, [15, 120], [0, 1], clamp);
  // flèche 2 : Gao -> Agadez (démarre après la 1, f120 -> f200)
  const p2 = interpolate(frame, [120, 200], [0, 1], clamp);

  const camG = `translate(${W / 2 + driftX} ${H / 2 + driftY}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`;

  return (
    <AbsoluteFill style={{ backgroundColor: OCEAN }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={0} y={0} width={W} height={H} fill={OCEAN} />
        <AtlasMercator
          countries={MERC_LARGE.countries}
          highlightFills={{}}
          driftX={driftX}
          driftY={driftY}
          scale={camScale}
          width={W}
          height={H}
          oceanColor="#dcd2bd"
          landColor="#efe7d4"
          strokeColor="#b3a888"
        />
        <g transform={camG}>
          <AtlasAttackArrow
            waypoints={[BAMAKO, TOMBOUCTOU, GAO]}
            progress={p1}
            color="#b3322c"
            strokeWidth={2.2}
            headType="arrow"
            marchingFrame={frame}
            curved={false}
          />
          <AtlasAttackArrow
            waypoints={[GAO, AGADEZ]}
            progress={p2}
            color="#b3322c"
            strokeWidth={2.2}
            headType="arrow"
            marchingFrame={frame}
            curved
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
