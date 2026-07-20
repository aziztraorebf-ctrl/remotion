// AfriqueOpening — ouverture du Short : le CONTINENT AFRICAIN se trace lentement (contours ocre) sur
// le fond navy, cadre FIXE. Puis fade/dissolution (gere par le parent) vers la carte Sahel/AES.
// Caméra FIXE (retour Aziz) : PAS de plongee/zoom — c'est un CHANGEMENT DE CONTENU par fade, pas un travelling.
//
// d3-geo pur (geoMercator.fitExtent sur l'Afrique), TopoJSON monde countries-50m. Tracé LENT (voir les
// pays se former). Le trio AES (Mali/Burkina/Niger) se distingue deja (contour un peu plus clair) pour
// preparer le raccord avec la scene Sahel qui suit.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { geoMercator, geoPath, geoCentroid } from "d3-geo";
import { feature } from "topojson-client";
import { useTopology } from "../../../_shared/components/inserts/useTopology";

const W = 1080;
const H = 1920;

const OCRE_LINE = "#f0cf8f";
const OCRE_DIM = "#e8d5a3"; // contours pays eclaircis (reco Kimi : meilleur contraste sur navy)
const AES_LINE = "#ffe9b8"; // trio plus lumineux encore (preparation du focus)

const AES_NAMES = new Set(["Mali", "Burkina Faso", "Niger"]);

// Fenetre de trace (frames) : LENTE. Le continent se dessine ouest->est sur ~cette duree.
const DRAW_WIN = 130;

// nonAesFade : 1 = tous les pays visibles ; 0 = pays hors-AES effaces (le trio reste). Pilote le "focus"
// progressif (reco Kimi : au lieu d'un hard cut, les autres pays s'estompent, le trio se detache).
export const AfriqueOpening: React.FC<{ opacity?: number; nonAesFade?: number }> = ({ opacity = 1, nonAesFade = 1 }) => {
  const frame = useCurrentFrame();
  const topo = useTopology("_shared/geo-data/countries-50m.json");

  const data = useMemo(() => {
    if (!topo) return null;
    const fc: any = feature(topo as any, (topo as any).objects.countries);
    const features = fc.features as any[];
    const inAfrica = (f: any) => {
      const c = geoCentroid(f);
      return c[0] > -20 && c[0] < 52 && c[1] > -36 && c[1] < 38;
    };
    const african = features.filter(inAfrica);
    const projection = geoMercator();
    // cadre fixe : Afrique centree, un peu remontee (zone basse pour sous-titres)
    projection.fitExtent(
      [
        [W * 0.08, H * 0.14],
        [W * 0.92, H * 0.82],
      ],
      { type: "FeatureCollection", features: african } as any
    );
    const path = geoPath(projection);
    const enriched = african
      .map((f) => {
        const c = geoCentroid(f);
        const d = path(f) || "";
        const len = (d.match(/[ML]/g)?.length ?? 50) * 12;
        const isAes = AES_NAMES.has(f.properties?.name);
        return { name: f.properties?.name as string, d, len, lon: c[0], isAes };
      })
      .sort((a, b) => a.lon - b.lon);
    return { enriched, N: african.length };
  }, [topo]);

  if (!topo || !data) return <AbsoluteFill />;

  const { enriched, N } = data;

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="afr-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f0cf8f" floodOpacity="0.5" />
          </filter>
        </defs>
        {enriched.map((c, i) => {
          const t0 = (i / N) * (DRAW_WIN - 30);
          const drawProg = interpolate(frame, [t0, t0 + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (drawProg <= 0) return null;
          // les pays hors-AES s'estompent (nonAesFade) ; le trio reste lumineux (focus progressif)
          const baseOp = c.isAes ? 0.98 : 0.62 * nonAesFade;
          if (baseOp <= 0.01) return null;
          return (
            <path
              key={c.name}
              d={c.d}
              fill="none"
              stroke={c.isAes ? AES_LINE : OCRE_DIM}
              strokeWidth={c.isAes ? 3 : 1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={c.len}
              strokeDashoffset={c.len * (1 - drawProg)}
              opacity={baseOp}
              filter={c.isAes ? "url(#afr-glow)" : undefined}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export default AfriqueOpening;
