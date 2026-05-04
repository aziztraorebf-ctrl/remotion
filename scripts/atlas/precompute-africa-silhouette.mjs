// Precompute Africa silhouette for Empire Ghana CTA (Beat6).
// Source : Natural Earth 50m countries (data/ne_50m_countries.geojson)
// Projection : geoMercator centered on Africa, sized for 1080x1920 portrait
// Output : data/geo/africa-cta-paths.json
//
// Output structure:
//   { width, height, africaPath: "M..." (combined SVG path),
//     wagadouXY: [x, y] }

import fs from "node:fs";
import { geoMercator, geoPath } from "d3-geo";

const ROOT = "/Users/clawdbot/Workspace/remotion";
const ne = JSON.parse(fs.readFileSync(`${ROOT}/quebec-jacques-poc/data/ne_50m_countries.geojson`, "utf8"));

// Canvas Beat6CTA = 1080x1920 (portrait). Mais l'Africa silhouette est dans <svg viewBox="0 0 720 1280">
// donc on projette pour 720x1280 (cohérent avec autres scenes Empire Ghana).
const W = 720;
const H = 1280;

// Africa-centered Mercator. Africa span : longitude -18 to 51, latitude -35 to 37.
// Center [17, 0] place l'Afrique entière dans le frame.
const proj = geoMercator()
  .center([17, 0])
  .scale(490)
  .translate([W / 2, H / 2]);
const path = geoPath(proj);

const AFRICA_ISO = new Set([
  "DZA","AGO","BEN","BWA","BFA","BDI","CMR","CPV","CAF","TCD","COM","COG","COD",
  "CIV","DJI","EGY","GNQ","ERI","SWZ","ETH","GAB","GMB","GHA","GIN","GNB","KEN",
  "LSO","LBR","LBY","MDG","MWI","MLI","MRT","MUS","MAR","MOZ","NAM","NER","NGA",
  "RWA","STP","SEN","SYC","SLE","SOM","ZAF","SSD","SDN","TZA","TGO","TUN","UGA",
  "ESH","ZMB","ZWE","ZAR",
]);

const africaPaths = [];
for (const feat of ne.features) {
  const iso = feat.properties.ISO_A3 || feat.properties.ADM0_A3 || "";
  if (!AFRICA_ISO.has(iso)) continue;
  const d = path(feat);
  if (!d) continue;
  africaPaths.push(d);
}

// Combiner en une seule path (silhouette + frontières internes visibles)
const africaPathCombined = africaPaths.join(" ");

// Wagadou center : Koumbi Saleh (-7.97°E, 15.77°N)
const [wagX, wagY] = proj([-7.97, 15.77]);

const out = {
  width: W,
  height: H,
  africaPath: africaPathCombined,
  africaCountriesCount: africaPaths.length,
  wagadouXY: [Math.round(wagX * 100) / 100, Math.round(wagY * 100) / 100],
  source: "Natural Earth 50m countries (public domain)",
  projection: "geoMercator center=[17,0] scale=490 translate=[360,640]",
};

const outPath = `${ROOT}/data/geo/africa-cta-paths.json`;
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`✓ Wrote ${outPath}`);
console.log(`  Africa countries: ${africaPaths.length}`);
console.log(`  Path length: ${africaPathCombined.length} chars`);
console.log(`  Wagadou XY: (${out.wagadouXY[0]}, ${out.wagadouXY[1]})`);
