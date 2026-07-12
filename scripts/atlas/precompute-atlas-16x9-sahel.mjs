// Precompute SVG paths (d3-geo, Natural Earth-derived GGW dataset) pour le
// proto ProtoAtlasMercator16x9 — bande sahelienne, format 16:9 (1920x1080).
// Source geo : public/_shared/geo-data/ggw/ggw-countries.geojson (11 pays,
// deja utilise en production pour la Grande Muraille Verte).

import fs from "node:fs";
import path from "node:path";
import { geoMercator, geoPath } from "d3-geo";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "../..");
const ggw = JSON.parse(
  fs.readFileSync(`${ROOT}/public/_shared/geo-data/ggw/ggw-countries.geojson`, "utf8")
);

const W = 1920;
const H = 1080;

const proj = geoMercator().fitExtent(
  [
    [140, 100],
    [1780, 980],
  ],
  ggw
);
const pathFor = geoPath(proj);

const countries = [];
for (const feat of ggw.features) {
  const name = feat.properties.name;
  const d = pathFor(feat);
  if (!d) continue;
  countries.push({ name, d });
}

const out = { width: W, height: H, countries };

const outPath = `${ROOT}/public/_shared/geo-data/sahel/sahel-16x9-mercator.json`;
fs.writeFileSync(outPath, JSON.stringify(out));
console.log(`Wrote ${countries.length} countries to ${outPath}`);
