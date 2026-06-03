/**
 * AtlasEncirclementDemo — validation render de AtlasEncirclement (manœuvre en
 * tenaille). Cas : BATAILLE DE CANNES (216 av. J.-C.), l'enveloppement d'Hannibal.
 *
 * POURQUOI ce cas : mapanimation.io ÉCHOUE dessus (flèches minuscules, échelle
 * absurde, enveloppement illisible — voir feedback faisabilité). On prouve ici que
 * notre d3-geo le rend net, frame-précis, séquencé : Rome avance au centre, les deux
 * ailes puniques se referment derrière, le piège se ferme. = NOTRE exclusivité.
 *
 * Projection : PROJECTIONS.cannae (échelle locale plaine, ~3 km). Pas de carte pays
 * réelle (inutile à cette échelle) : terrain tactique stylisé (plaine + Aufidus) +
 * formations + flèches. Pas de son. Cas-test R&D, pas livrable.
 */

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AtlasEncirclement, pincerArrows } from "./AtlasEncirclement";
import { PROJECTIONS } from "./geoUtils";
import { WIDTH as W, HEIGHT as H } from "../peste-1347/mapConfig";

// Charte Atlas parchemin lumineuse (mode diagramme tactique, validé Or Africain Beat4)
const PARCHMENT = "#dcd2bd";
const LAND = "#efe7d4";
const RIVER = "#a9bcc4";
const ROME = "#3a3a3a";
const PUNIC = "#b3322c";
const INK = "#4a4036";

const proj = PROJECTIONS.cannae;
const P = (lon: number, lat: number) => proj(lon, lat);

// ─── DISPOSITIF DE CANNES (lon, lat) — stylisé pour lisibilité ───────────────
// Rome (centre) avance droit ; ailes puniques partent de l'avant et ferment derrière.
// Rome (bloc) au centre. Le croissant punique est devant (est). Les ailes partent du
// FLANC du croissant, débordent largement haut/bas, et ferment DERRIÈRE Rome (ouest) :
// c'est le vrai enveloppement — l'armée romaine prise dans la nasse.
const CANNAE = {
  romeFrom: { lon: 16.0, lat: 41.32 }, // Rome avance d'ouest vers le centre
  trap: { lon: 16.11, lat: 41.32 }, // où le centre punique « plie » et attire Rome
  // aile haute : flanc est → grand débord haut → CONVERGE derrière Rome (nasse)
  wingTopFrom: { lon: 16.14, lat: 41.34 },
  wingTopMid: { lon: 16.06, lat: 41.45 },
  wingTopTo: { lon: 15.99, lat: 41.33 },
  // aile basse : symétrique, converge au même point arrière
  wingBotFrom: { lon: 16.14, lat: 41.3 },
  wingBotMid: { lon: 16.06, lat: 41.19 },
  wingBotTo: { lon: 15.99, lat: 41.31 },
};

// rivière Aufidus (Ofanto) — diagonale traversant la plaine, élément réel du terrain
const AUFIDUS: Array<[number, number]> = [
  [15.96, 41.2],
  [16.06, 41.28],
  [16.14, 41.34],
  [16.24, 41.44],
].map(([lo, la]) => P(lo, la));

const riverD = AUFIDUS.reduce(
  (d, [x, y], i) => d + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`),
  "",
);

export const AtlasEncirclementDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  // léger zoom de respiration (drift continu — jamais statique)
  const camScale = interpolate(frame, [0, 220], [1.45, 1.62], clamp);
  const [cx, cy] = P(16.1, 41.32); // centre du dispositif
  const camG = `translate(${W / 2} ${H / 2}) scale(${camScale}) translate(${-cx} ${-cy})`;

  // formations ennemies (apparition au début)
  const formAppear = interpolate(frame, [0, 25], [0, 1], clamp);
  // le piège se referme : flash quand les ailes ferment (~f95)
  const trapFlash = interpolate(frame, [95, 105, 130], [0, 0.5, 0], clamp);

  const arrows = pincerArrows({
    center: { from: CANNAE.romeFrom, to: CANNAE.trap },
    wingTop: { from: CANNAE.wingTopFrom, to: CANNAE.wingTopTo },
    wingBot: { from: CANNAE.wingBotFrom, to: CANNAE.wingBotTo },
    centerDelay: 0,
    centerDuration: 55,
    wingDelay: 35,
    wingDuration: 75,
    wingColor: PUNIC,
    centerColor: ROME,
  });
  // injecter les waypoints médians pour le bombé d'enveloppement
  arrows[1].waypoints = [CANNAE.wingTopFrom, CANNAE.wingTopMid, CANNAE.wingTopTo];
  arrows[2].waypoints = [CANNAE.wingBotFrom, CANNAE.wingBotMid, CANNAE.wingBotTo];

  const [trapX, trapY] = P(CANNAE.trap.lon, CANNAE.trap.lat);

  return (
    <AbsoluteFill style={{ backgroundColor: PARCHMENT }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={0} y={0} width={W} height={H} fill={PARCHMENT} />
        <g transform={camG}>
          {/* plaine */}
          <rect x={cx - 220} y={cy - 220} width={440} height={440} fill={LAND} opacity={0.6} rx={12} />
          {/* rivière Aufidus */}
          <path d={riverD} fill="none" stroke={RIVER} strokeWidth={7} strokeLinecap="round" opacity={0.8} />
          <path d={riverD} fill="none" stroke={RIVER} strokeWidth={14} strokeLinecap="round" opacity={0.25} />

          {/* flash du piège quand il se referme */}
          {trapFlash > 0 && (
            <circle cx={trapX} cy={trapY} r={26} fill={PUNIC} opacity={trapFlash} />
          )}

          {/* formations ennemies (blocs stylisés) */}
          <g opacity={formAppear}>
            {/* bloc romain dense au centre (la masse prise au piège) */}
            {(() => {
              const [x, y] = P(16.07, 41.32);
              return <rect x={x - 8} y={y - 30} width={16} height={60} rx={3} fill={ROME} opacity={0.85} />;
            })()}
            {/* croissant punique devant (le centre qui pliera vers Rome) */}
            {(() => {
              const [x, y] = P(16.13, 41.32);
              return (
                <path
                  d={`M ${x} ${y - 34} Q ${x + 18} ${y} ${x} ${y + 34}`}
                  fill="none"
                  stroke={PUNIC}
                  strokeWidth={5}
                  opacity={0.8}
                />
              );
            })()}
          </g>

          {/* LES FLÈCHES D'ENCERCLEMENT */}
          <AtlasEncirclement frame={frame} arrows={arrows} projection={proj} marchingFrame={frame} />
        </g>

        {/* titre tactique (hors transform caméra — fixe à l'écran) */}
        <text x={W / 2} y={120} textAnchor="middle" fill={INK} fontSize={38} fontWeight={700} fontFamily="Georgia, serif">
          CANNES — 216 av. J.-C.
        </text>
        <text x={W / 2} y={162} textAnchor="middle" fill={INK} fontSize={22} fontFamily="Georgia, serif" opacity={0.7}>
          l&apos;enveloppement d&apos;Hannibal
        </text>
      </svg>
    </AbsoluteFill>
  );
};
