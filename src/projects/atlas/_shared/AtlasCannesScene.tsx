/**
 * AtlasCannesScene — RENDU FINAL de l'encerclement de Cannes SUR UNE VRAIE CARTE.
 *
 * Répond à la question d'Aziz : "à quoi ça ressemble en final ?" → pas un insert isolé,
 * mais un calque tactique posé sur une carte d3-geo réelle, avec ENCHAÎNEMENT 2 ÉCHELLES :
 *
 *   Phase A (régional) : vraie carte Italie du Sud (Natural Earth projetée) + marqueur
 *                        "Cannae" qui se pose sur les Pouilles → on SITUE la bataille.
 *   Transition         : zoom caméra continu qui plonge vers le site.
 *   Phase B (tactique) : la carte cède au terrain (plaine + Aufidus), le diagramme
 *                        d'encerclement se joue (AtlasEncirclement). C'est l'action.
 *
 * CLÉ TECHNIQUE : UNE SEULE projection d3-geo geoMercator, dont center+scale sont
 * interpolés sur le frame. Carte ET flèches partagent donc la même projection à chaque
 * frame → le zoom est continu et les flèches restent collées à la géo réelle (tout
 * l'intérêt du d3-geo vs animation plaquée). Un wrapper (lon,lat)=>proj([lon,lat])
 * branche cette projection sur AtlasEncirclement.
 *
 * Projection à la volée (d3-geo synchrone, 1 pays) — OK pour R&D. À précalculer
 * (pattern peste-map-data.json) si on industrialise.
 */

import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import * as topojson from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import type { Geometry, FeatureCollection } from "geojson";
import type { Topology, GeometryCollection } from "topojson-specification";
import countries50mRaw from "../../../../public/_shared/geo-data/countries-50m.json";
import { AtlasEncirclement, pincerArrows } from "./AtlasEncirclement";

const W = 720;
const H = 1280;

// Charte Atlas parchemin lumineuse
const PARCHMENT = "#dcd2bd";
const LAND = "#efe7d4";
const SEA = "#cfc3a9";
const RIVER = "#a9bcc4";
const STROKE = "#b3a888";
const ROME = "#3a3a3a";
const PUNIC = "#b3322c";
const INK = "#4a4036";

const CANNAE: [number, number] = [16.13, 41.3];

// ─── Géométries Natural Earth (mémoïsées) ────────────────────────────────────
const countries50m = countries50mRaw as unknown as Topology<{
  countries: GeometryCollection<{ name: string }>;
}>;
const useGeo = () =>
  useMemo(() => {
    const fc = topojson.feature(
      countries50m,
      countries50m.objects.countries,
    ) as FeatureCollection<Geometry, { name: string }>;
    // pays du pourtour pour le contexte (Italie + voisins visibles à l'échelle régionale)
    const keep = new Set([
      "Italy", "Albania", "Greece", "Croatia", "Bosnia and Herz.",
      "Montenegro", "North Macedonia", "Tunisia", "Malta",
    ]);
    return fc.features.filter((f) => keep.has(f.properties.name));
  }, []);

// ─── DISPOSITIF TACTIQUE (réutilise la géométrie validée de la démo) ──────────
const DISPO = {
  romeFrom: { lon: 16.0, lat: 41.32 },
  trap: { lon: 16.11, lat: 41.32 },
  wingTopFrom: { lon: 16.14, lat: 41.34 },
  wingTopMid: { lon: 16.07, lat: 41.41 },
  wingTopTo: { lon: 15.99, lat: 41.33 },
  wingBotFrom: { lon: 16.14, lat: 41.3 },
  wingBotMid: { lon: 16.07, lat: 41.23 },
  wingBotTo: { lon: 15.99, lat: 41.31 },
};
const AUFIDUS_LL: Array<[number, number]> = [
  [15.96, 41.2], [16.06, 41.28], [16.14, 41.34], [16.24, 41.44],
];

export const AtlasCannesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const features = useGeo();

  // ─── PROJECTION FRAME-DRIVEN : center + scale interpolés (zoom continu) ──────
  // Phase A régional (scale ~2600, centré Italie sud) → Phase B tactique (scale
  // ~190000, centré Cannae). Transition f90→f130.
  const t = interpolate(frame, [90, 130], [0, 1], clamp); // 0 = régional, 1 = tactique
  // easing doux sur le zoom (log pour un plongeon naturel)
  const ease = t * t * (3 - 2 * t); // smoothstep
  const scale = Math.exp(
    interpolate(ease, [0, 1], [Math.log(2600), Math.log(150000)]),
  );
  const centerLon = interpolate(ease, [0, 1], [15.0, CANNAE[0]]);
  const centerLat = interpolate(ease, [0, 1], [41.5, CANNAE[1]]);

  const projection = useMemo(
    () => geoMercator().center([centerLon, centerLat]).scale(scale).translate([W / 2, H / 2]),
    [centerLon, centerLat, scale],
  );
  const pathGen = geoPath(projection);
  // wrapper pour AtlasEncirclement (signature (lon,lat)=>[x,y])
  const proj = (lon: number, lat: number): [number, number] =>
    (projection([lon, lat]) ?? [0, 0]) as [number, number];

  // ─── Opacités de phase ──────────────────────────────────────────────────────
  const mapOpacity = interpolate(frame, [0, 20, 95, 130], [0, 1, 1, 0.18], clamp); // carte s'efface au zoom
  const markerAppear = interpolate(frame, [25, 45], [0, 1], clamp);
  const markerFade = interpolate(frame, [95, 120], [1, 0], clamp);
  const terrainAppear = interpolate(frame, [115, 140], [0, 1], clamp); // terrain tactique entre au zoom
  // titre plein écran en phase A (situer), s'efface au zoom pour libérer le terrain tactique
  const titleOpacity = interpolate(frame, [5, 25, 95, 120], [0, 1, 1, 0], clamp);

  // marqueur Cannae (phase A) — pulse
  const [mkx, mky] = proj(CANNAE[0], CANNAE[1]);
  const pulse = 1 + 0.18 * Math.sin(frame * 0.18);

  // ─── ENCERCLEMENT (phase B) — fenêtres décalées APRÈS le zoom (f130+) ───────
  const arrows = pincerArrows({
    center: { from: DISPO.romeFrom, to: DISPO.trap },
    wingTop: { from: DISPO.wingTopFrom, to: DISPO.wingTopTo },
    wingBot: { from: DISPO.wingBotFrom, to: DISPO.wingBotTo },
    centerDelay: 135,
    centerDuration: 45,
    wingDelay: 165,
    wingDuration: 70,
    wingColor: PUNIC,
    centerColor: ROME,
  });
  arrows[1].waypoints = [DISPO.wingTopFrom, DISPO.wingTopMid, DISPO.wingTopTo];
  arrows[2].waypoints = [DISPO.wingBotFrom, DISPO.wingBotMid, DISPO.wingBotTo];

  const [trapX, trapY] = proj(DISPO.trap.lon, DISPO.trap.lat);
  const trapFlash = interpolate(frame, [232, 244, 270], [0, 0.5, 0], clamp);

  // terrain tactique (phase B)
  const aufidusD = AUFIDUS_LL.map((ll) => proj(ll[0], ll[1])).reduce(
    (d, [x, y], i) => d + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`),
    "",
  );
  const [romeBx, romeBy] = proj(16.07, 41.32);
  const [croisX, croisY] = proj(16.13, 41.32);

  return (
    <AbsoluteFill style={{ backgroundColor: PARCHMENT }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={0} y={0} width={W} height={H} fill={frame < 120 ? SEA : PARCHMENT} />

        {/* ─── CARTE RÉELLE (phase A, s'efface au zoom) ─── */}
        <g opacity={mapOpacity}>
          {features.map((f, i) => (
            <path
              key={i}
              d={pathGen(f) ?? ""}
              fill={LAND}
              stroke={STROKE}
              strokeWidth={f.properties.name === "Italy" ? 1.4 : 0.8}
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* ─── TERRAIN TACTIQUE (phase B, entre au zoom) ─── */}
        <g opacity={terrainAppear}>
          <path d={aufidusD} fill="none" stroke={RIVER} strokeWidth={9} strokeLinecap="round" opacity={0.85} />
          <path d={aufidusD} fill="none" stroke={RIVER} strokeWidth={18} strokeLinecap="round" opacity={0.22} />
          {/* bloc romain encerclé */}
          <rect x={romeBx - 8} y={romeBy - 30} width={16} height={60} rx={3} fill={ROME} opacity={0.85} />
          {/* croissant punique */}
          <path
            d={`M ${croisX} ${croisY - 34} Q ${croisX + 18} ${croisY} ${croisX} ${croisY + 34}`}
            fill="none"
            stroke={PUNIC}
            strokeWidth={5}
            opacity={0.8}
          />
          {trapFlash > 0 && <circle cx={trapX} cy={trapY} r={26} fill={PUNIC} opacity={trapFlash} />}
          <AtlasEncirclement frame={frame} arrows={arrows} projection={proj} marchingFrame={frame} />
        </g>

        {/* ─── MARQUEUR CANNAE (phase A) ─── */}
        <g opacity={markerAppear * markerFade}>
          <circle cx={mkx} cy={mky} r={14 * pulse} fill={PUNIC} opacity={0.25} />
          <circle cx={mkx} cy={mky} r={6} fill={PUNIC} stroke="#fff" strokeWidth={1.5} />
          <text x={mkx + 16} y={mky + 5} fill={INK} fontSize={26} fontWeight={700} fontFamily="Georgia, serif">
            Cannae
          </text>
        </g>

        {/* ─── TITRE (fixe) ─── */}
        <g opacity={titleOpacity}>
          <text x={W / 2} y={120} textAnchor="middle" fill={INK} fontSize={40} fontWeight={700} fontFamily="Georgia, serif">
            CANNES — 216 av. J.-C.
          </text>
          <text x={W / 2} y={164} textAnchor="middle" fill={INK} fontSize={22} fontFamily="Georgia, serif" opacity={0.7}>
            l&apos;enveloppement d&apos;Hannibal
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
