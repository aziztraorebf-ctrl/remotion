// Precompute SVG paths for African countries + Mali Empire 1300 + sea outline
// Output: src/africa-svg-data.json with viewBox + per-country SVG path strings
// Usage: node scripts-atlas/precompute-africa-svg-paths.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { geoMercator, geoPath } from "d3-geo";

const ROOT = "/Users/clawdbot/Workspace/remotion/quebec-jacques-poc";

const NE_PATH = path.join(ROOT, "data/ne_50m_countries.geojson");
const WORLD_1300 = path.join(ROOT, "data/world_1300.geojson");
const OUT = path.join(ROOT, "src/africa-svg-data.json");

const ne = JSON.parse(fs.readFileSync(NE_PATH, "utf8"));
const w1300 = JSON.parse(fs.readFileSync(WORLD_1300, "utf8"));

// Africa-relevant countries by ISO_A3 (rough Africa + neighbors for context)
const AFRICA_ISO = new Set([
  "DZA","AGO","BEN","BWA","BFA","BDI","CMR","CPV","CAF","TCD","COM","COG","COD",
  "CIV","DJI","EGY","GNQ","ERI","SWZ","ETH","GAB","GMB","GHA","GIN","GNB","KEN",
  "LSO","LBR","LBY","MDG","MWI","MLI","MRT","MUS","MAR","MOZ","NAM","NER","NGA",
  "RWA","STP","SEN","SYC","SLE","SOM","ZAF","SSD","SDN","TZA","TGO","TUN","UGA",
  "ZMB","ZWE","ESH","SAU","YEM","JOR","ISR","PSX","SYR","LBN","IRQ","IRN","TUR",
  "ESP","PRT","ITA","GRC","MLT","CYP","FRA"
]);

const COUNTRIES_TO_LABEL = ["MLI","EGY","DZA","NER","TCD","SDN","MRT","SEN","BFA","NGA","CIV","GIN","MAR","LBY","ESH"];

// Frame: vertical 9:16, 720x1280
const WIDTH = 720;
const HEIGHT = 1280;

// Center on West Africa + show Med + part of Europe + Sahara
// Mercator projected, fitted to bbox of "extended West Africa"
const projection = geoMercator()
  .center([5, 18]) // around southern Algeria/northern Mali, lon=5 lat=18
  .scale(720) // empirical, adjust below if needed
  .translate([WIDTH / 2, HEIGHT / 2]);

const pathGen = geoPath(projection);

const countries = [];
for (const feat of ne.features) {
  const iso = feat.properties.ISO_A3 || feat.properties.ADM0_A3 || "";
  if (!AFRICA_ISO.has(iso)) continue;
  const d = pathGen(feat);
  if (!d) continue;
  countries.push({
    iso,
    name: feat.properties.NAME || feat.properties.ADMIN || iso,
    d,
    centroid: pathGen.centroid(feat),
  });
}

// Empire Mali 1300
let maliEmpire1300 = null;
for (const feat of w1300.features) {
  const name = (feat.properties.NAME || "").toLowerCase();
  if (name === "mali") {
    maliEmpire1300 = pathGen(feat);
    break;
  }
}

// Cities of interest (lon, lat) -> projected (x, y)
const CITIES = {
  Niani: [-8.0, 11.4],            // capitale Empire Mali (approx)
  Tombouctou: [-3.0, 16.77],
  Gao: [0.04, 16.27],
  LeCaire: [31.24, 30.04],
  Mecque: [39.83, 21.42],
  Marrakech: [-7.99, 31.63],
};
const cities = {};
for (const [name, lonLat] of Object.entries(CITIES)) {
  cities[name] = projection(lonLat);
}

const out = {
  viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
  width: WIDTH,
  height: HEIGHT,
  projection: { type: "mercator", center: [5, 18], scale: 720 },
  countries,
  maliEmpire1300,
  cities,
  labelISOs: COUNTRIES_TO_LABEL,
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(`OK wrote ${OUT}`);
console.log(`  Countries: ${countries.length}`);
console.log(`  Mali Empire 1300 path: ${maliEmpire1300 ? "yes" : "no"}`);
console.log(`  Cities: ${Object.keys(cities).length}`);
