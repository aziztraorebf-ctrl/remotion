/**
 * AtlasCannesHannibal — encerclement de Cannes SUR LA VRAIE CARTE Hannibal.
 *
 * Réutilise la carte de l'épisode Hannibal (data/geo/hannibal-data.json, vue "context"
 * Méditerranée large) + sa palette militaire (HannibalPalette). PAS de carte recréée :
 * c'est la map qu'on a déjà produite et validée pour l'épisode.
 *
 * ENCHAÎNEMENT 2 ÉCHELLES, version PROLONGÉE (respire) :
 *   Phase A (régional, ~6s) : carte Hannibal s'installe (pays, mer, POI Carthage/Rome),
 *                             le marqueur "Cannae" se pose sur les Pouilles.
 *   Zoom (~3,5s)            : transform caméra qui plonge lentement vers le site.
 *   Phase B (tactique, ~7s) : le diagramme d'encerclement, avec PAUSES — Rome avance et
 *                             on LAISSE voir, PUIS les ailes puniques se referment.
 *   Hold final (~1,5s)      : la nasse fermée, on respire sur l'image.
 *
 * CLÉ TECHNIQUE : la carte Hannibal est figée (paths pré-projetés à scale 1800, translate
 * [W/2, H/2+200] — offset calibré sur 3 POI). Le zoom = TRANSFORM SVG du <g> (pattern Atlas
 * canonique : caméra = transform, pas reprojection). Les flèches sont projetées avec la MÊME
 * projection geoMercator que la carte → alignées au pixel, et héritent du transform → collées
 * à la géo pendant le zoom.
 */

import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { geoMercator } from "d3-geo";
import { AtlasEncirclement, pincerArrows } from "./AtlasEncirclement";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const hannibalData = require("../../../../data/geo/hannibal-data.json");

// Palette Hannibal (copiée depuis HannibalPalette.ts — l'import direct casse le bundle
// car le fichier d'archive référence un ../../_shared/atlas-components déplacé au ménage).
const PAL = {
  NOIR_GUERRE: "#0F1A1F",
  MER: "#1C3D5A",
  MER_VIF: "#2A5578",
  CARTHAGE: "#8B3A2A",
  CARTHAGE_VIF: "#B54A35",
  ROUTE: "#D4A843",
  ROME: "#5C3D6E",
  ROME_VIF: "#7A5290",
  IVOIRE: "#F2ECD8",
  PARCHEMIN: "#D8CEB4",
} as const;
const FONTS = {
  TITRE: "'Cinzel', 'Cormorant Garamond', serif",
  SERIF: "'Cormorant Garamond', 'EB Garamond', serif",
} as const;

const W = 1080;
const H = 1920;

const view = hannibalData.views.context;
const countries = view.countries as { iso: string; d: string }[];
const rhonePath = view.rhone as string;

// ─── PROJECTION HANNIBAL (identique à la map, offset Y calibré sur POI réels) ──
// La map a été générée avec translate([W/2, H/2 + 200]) — vérifié dx≈0 dy=200 sur
// Rome/Carthage/Massalia. On reproduit EXACTEMENT pour aligner les flèches au pixel.
const Y_OFFSET = 200;
const projection = geoMercator()
  .center(view.projection.center as [number, number])
  .scale(view.projection.scale)
  .translate([W / 2, H / 2 + Y_OFFSET]);
const proj = (lon: number, lat: number): [number, number] =>
  (projection([lon, lat]) ?? [0, 0]) as [number, number];

const CANNAE: [number, number] = [16.13, 41.3];

// ─── DISPOSITIF TACTIQUE (lon/lat réels — mêmes valeurs validées que la démo) ──
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

// ─── TIMELINE (prolongée pour respirer) @30fps ───────────────────────────────
const T = {
  mapIn: [0, 40],          // carte apparaît
  poiIn: [40, 80],         // POI Carthage/Rome
  markerIn: [110, 145],    // marqueur Cannae se pose
  hold1: [145, 195],       // on respire sur la vue régionale
  zoom: [195, 300],        // plongée lente
  terrainIn: [285, 330],   // terrain tactique apparaît
  romeAdvance: [330, 390], // Rome avance au centre
  pauseRome: [390, 430],   // PAUSE : on voit Rome au piège
  wings: [430, 520],       // les ailes se referment
  trapFlash: [505, 520, 545],
  holdFinal: [545, 600],   // nasse fermée, respiration finale
};

export const AtlasCannesHannibal: React.FC = () => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const lerp = (r: number[], out: number[]) => interpolate(frame, r, out, clamp);

  // ─── ZOOM CAMÉRA (transform SVG, pattern Atlas) ─────────────────────────────
  const [canX, canY] = proj(CANNAE[0], CANNAE[1]);
  const zt = lerp(T.zoom, [0, 1]);
  const zEase = zt * zt * (3 - 2 * zt); // smoothstep
  // scale 80 : la carte Hannibal est projetée à scale 1800 (vue Méditerranée), donc
  // le dispositif de 3 km ne fait que ~7,5px → il faut ×80 pour le déployer (~600px).
  const camScale = interpolate(zEase, [0, 1], [1, 80]);
  // pour zoomer sur Cannae : on translate de sorte que (canX,canY) reste au centre
  const camX = interpolate(zEase, [0, 1], [W / 2, canX]);
  const camY = interpolate(zEase, [0, 1], [H / 2, canY]);
  const camG = `translate(${W / 2} ${H / 2}) scale(${camScale}) translate(${-camX} ${-camY})`;

  // ─── OPACITÉS ───────────────────────────────────────────────────────────────
  const mapOpacity = lerp(T.mapIn, [0, 1]);
  const mapFade = lerp([T.zoom[0] + 40, T.zoom[1]], [1, 0.12]); // carte s'efface au zoom
  const poiOpacity = lerp(T.poiIn, [0, 1]) * lerp([T.zoom[0], T.zoom[0] + 50], [1, 0]);
  const markerOpacity = lerp(T.markerIn, [0, 1]) * lerp([T.zoom[0], T.zoom[0] + 50], [1, 0]);
  const terrainOpacity = lerp(T.terrainIn, [0, 1]);
  const titleOpacity = lerp([10, 40], [0, 1]) * lerp([T.zoom[0], T.zoom[0] + 40], [1, 0]);
  const captionOpacity = lerp([T.terrainIn[1], T.terrainIn[1] + 25], [0, 1]); // légende tactique phase B

  // pulse marqueur
  const pulse = 1 + 0.16 * Math.sin(frame * 0.16);

  // ─── ENCERCLEMENT (fenêtres prolongées + pause) ─────────────────────────────
  const arrows = pincerArrows({
    center: { from: DISPO.romeFrom, to: DISPO.trap },
    wingTop: { from: DISPO.wingTopFrom, to: DISPO.wingTopTo },
    wingBot: { from: DISPO.wingBotFrom, to: DISPO.wingBotTo },
    centerDelay: T.romeAdvance[0],
    centerDuration: T.romeAdvance[1] - T.romeAdvance[0],
    wingDelay: T.wings[0],
    wingDuration: T.wings[1] - T.wings[0],
    wingColor: PAL.CARTHAGE_VIF,
    centerColor: PAL.ROME_VIF,
  });
  arrows[1].waypoints = [DISPO.wingTopFrom, DISPO.wingTopMid, DISPO.wingTopTo];
  arrows[2].waypoints = [DISPO.wingBotFrom, DISPO.wingBotMid, DISPO.wingBotTo];
  // strokeWidth en coords CARTE : tout est multiplié par camScale (80) au render.
  // Pour ~3px à l'écran → 3/80 ≈ 0.038. On garde un léger contraste centre/ailes.
  arrows.forEach((a) => { a.strokeWidth = 0.04; });

  const [trapX, trapY] = proj(DISPO.trap.lon, DISPO.trap.lat);
  const trapFlash = lerp(T.trapFlash, [0, 0.55, 0]);

  // terrain tactique (coords écran)
  const aufidusD = useMemo(
    () => AUFIDUS_LL.map((ll) => proj(ll[0], ll[1])).reduce(
      (d, [x, y], i) => d + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`), ""),
    [],
  );
  const [romeBx, romeBy] = proj(16.07, 41.32);
  const [croisX, croisY] = proj(16.13, 41.32);
  const [mkX, mkY] = [canX, canY];

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.NOIR_GUERRE }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <g transform={camG}>
          {/* ─── VRAIE CARTE HANNIBAL ─── */}
          <g opacity={mapOpacity * mapFade}>
            <rect x={-2000} y={-2000} width={6000} height={6000} fill={PAL.MER} />
            {countries.map((c) => {
              const zoneNarr = ["ESP", "FRA", "ITA", "CHE"].includes(c.iso);
              const afrN = ["MAR", "DZA", "TUN", "LBY"].includes(c.iso);
              const fill = zoneNarr ? "#D4C8B0" : afrN ? "#C0AE88" : "#B8A882";
              return <path key={c.iso} d={c.d} fill={fill} stroke="#6A5E4A" strokeWidth={0.7} strokeOpacity={0.9} />;
            })}
            <path d={rhonePath} fill="none" stroke={PAL.MER_VIF} strokeWidth={3} strokeOpacity={0.7} strokeLinecap="round" />
          </g>

          {/* ─── POI contextuels (Carthage, Rome) ─── */}
          <g opacity={poiOpacity}>
            {(["ROME", "CARTHAGE", "CARTHAGO_NOVA"] as const).map((k) => {
              const p = view.poi[k];
              if (!p) return null;
              const col = k === "ROME" ? PAL.ROME_VIF : PAL.CARTHAGE_VIF;
              const label = k === "ROME" ? "Rome" : k === "CARTHAGE" ? "Carthage" : "Carthagène";
              return (
                <g key={k}>
                  <circle cx={p.x} cy={p.y} r={5} fill={col} opacity={0.25} />
                  <circle cx={p.x} cy={p.y} r={2.5} fill={col} />
                  <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={15} fontFamily={FONTS.SERIF} fill={col} letterSpacing="0.08em">{label}</text>
                </g>
              );
            })}
          </g>

          {/* ─── TERRAIN TACTIQUE (phase B) — dimensions en coords CARTE (×80 au render) ─── */}
          <g opacity={terrainOpacity}>
            <path d={aufidusD} fill="none" stroke={PAL.MER_VIF} strokeWidth={0.06} strokeLinecap="round" opacity={0.9} />
            <path d={aufidusD} fill="none" stroke={PAL.MER_VIF} strokeWidth={0.14} strokeLinecap="round" opacity={0.25} />
            {/* bloc romain encerclé (pourpre) */}
            <rect x={romeBx - 0.07} y={romeBy - 0.28} width={0.14} height={0.56} rx={0.03} fill={PAL.ROME} opacity={0.95} />
            {/* croissant punique (rouge Carthage) */}
            <path d={`M ${croisX} ${croisY - 0.3} Q ${croisX + 0.16} ${croisY} ${croisX} ${croisY + 0.3}`} fill="none" stroke={PAL.CARTHAGE_VIF} strokeWidth={0.05} opacity={0.85} />
            {trapFlash > 0 && <circle cx={trapX} cy={trapY} r={0.24} fill={PAL.CARTHAGE_VIF} opacity={trapFlash} />}
            <AtlasEncirclement frame={frame} arrows={arrows} projection={proj} marchingFrame={frame} />
          </g>

          {/* ─── MARQUEUR CANNAE (phase A) ─── */}
          <g opacity={markerOpacity}>
            <circle cx={mkX} cy={mkY} r={6 * pulse} fill={PAL.CARTHAGE_VIF} opacity={0.3} />
            <circle cx={mkX} cy={mkY} r={2.6} fill={PAL.CARTHAGE_VIF} stroke={PAL.IVOIRE} strokeWidth={0.7} />
            <text x={mkX} y={mkY - 9} textAnchor="middle" fontSize={13} fontFamily={FONTS.SERIF} fontWeight={700} fill={PAL.IVOIRE} letterSpacing="0.1em">Cannae</text>
          </g>
        </g>

        {/* ─── TITRE (fixe, phase A) ─── */}
        <g opacity={titleOpacity}>
          <text x={W / 2} y={130} textAnchor="middle" fill={PAL.IVOIRE} fontSize={46} fontFamily={FONTS.TITRE} letterSpacing="0.04em">CANNES</text>
          <text x={W / 2} y={178} textAnchor="middle" fill={PAL.ROUTE} fontSize={24} fontFamily={FONTS.SERIF} letterSpacing="0.08em">l&apos;enveloppement d&apos;Hannibal · 216 av. J.-C.</text>
        </g>

        {/* ─── LÉGENDE TACTIQUE (fixe, phase B) ─── */}
        <g opacity={captionOpacity}>
          <text x={W / 2} y={150} textAnchor="middle" fill={PAL.IVOIRE} fontSize={30} fontFamily={FONTS.TITRE} letterSpacing="0.04em">LA NASSE</text>
          <text x={W / 2} y={1810} textAnchor="middle" fill={PAL.PARCHEMIN} fontSize={22} fontFamily={FONTS.SERIF} letterSpacing="0.04em">Rome avance au centre — les ailes puniques se referment</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
