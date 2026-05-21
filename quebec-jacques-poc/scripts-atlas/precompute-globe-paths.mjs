// Precompute globe orthographic + zoomed mercator paths for Atlas V2.
// Generates 2 datasets: world orthographic (full) + west-africa mercator (zoomed).

import fs from "node:fs";
import { geoOrthographic, geoMercator, geoPath, geoGraticule10 } from "d3-geo";

const ROOT = "/Users/clawdbot/Workspace/remotion/quebec-jacques-poc";

const ne = JSON.parse(fs.readFileSync(`${ROOT}/data/ne_50m_countries.geojson`, "utf8"));
const w1300 = JSON.parse(fs.readFileSync(`${ROOT}/data/world_1300.geojson`, "utf8"));

const W = 720;
const H = 1280;

// === Orthographic globe (vue espace) ===
// Center on Africa: lon 20, lat 5
const radius = 280; // globe radius in pixels
const orthoProj = geoOrthographic()
  .scale(radius)
  .translate([W / 2, H / 2])
  .rotate([-20, -5, 0])
  .clipAngle(90);

const orthoPath = geoPath(orthoProj);

const orthoCountries = [];
for (const feat of ne.features) {
  const iso = feat.properties.ISO_A3 || feat.properties.ADM0_A3 || "";
  if (!iso || iso === "-99") continue;
  const d = orthoPath(feat);
  if (!d) continue;
  orthoCountries.push({ iso, d });
}

let orthoMaliEmpire1300 = null;
for (const feat of w1300.features) {
  if ((feat.properties.NAME || "").toLowerCase() === "mali") {
    orthoMaliEmpire1300 = orthoPath(feat);
    break;
  }
}

const orthoCenter = orthoProj([20, 5]);

// === Mercator zoomed on West Africa ===
const mercProj = geoMercator()
  .center([5, 18])
  .scale(900)
  .translate([W / 2, H / 2]);

const mercPath = geoPath(mercProj);

const AFRICA_ISO = new Set([
  "DZA","AGO","BEN","BWA","BFA","BDI","CMR","CPV","CAF","TCD","COM","COG","COD",
  "CIV","DJI","EGY","GNQ","ERI","SWZ","ETH","GAB","GMB","GHA","GIN","GNB","KEN",
  "LSO","LBR","LBY","MDG","MWI","MLI","MRT","MUS","MAR","MOZ","NAM","NER","NGA",
  "RWA","STP","SEN","SYC","SLE","SOM","ZAF","SSD","SDN","TZA","TGO","TUN","UGA",
  "ZMB","ZWE","ESH","SAU","YEM","JOR","ISR","PSX","SYR","LBN","IRQ","IRN","TUR",
  "ESP","PRT","ITA","GRC","MLT","CYP","FRA","DEU","CHE","AUT","BEL","NLD","GBR","IRL",
  "POL","UKR","ROU","BGR","HRV","SRB","BIH","ALB","MKD","HUN","CZE","SVK","SVN"
]);

const mercCountries = [];
for (const feat of ne.features) {
  const iso = feat.properties.ISO_A3 || feat.properties.ADM0_A3 || "";
  if (!AFRICA_ISO.has(iso)) continue;
  const d = mercPath(feat);
  if (!d) continue;
  mercCountries.push({ iso, d });
}

let mercMaliEmpire1300 = null;
for (const feat of w1300.features) {
  if ((feat.properties.NAME || "").toLowerCase() === "mali") {
    mercMaliEmpire1300 = mercPath(feat);
    break;
  }
}

const CITIES = {
  Niani: [-8.0, 11.4],
  Tombouctou: [-3.0, 16.77],
  Gao: [0.04, 16.27],
  LeCaire: [31.24, 30.04],
  Mecque: [39.83, 21.42],
};

const mercCities = {};
for (const [name, ll] of Object.entries(CITIES)) {
  mercCities[name] = mercProj(ll);
}

const orthoCities = {};
for (const [name, ll] of Object.entries(CITIES)) {
  orthoCities[name] = orthoProj(ll);
}

const out = {
  width: W,
  height: H,
  ortho: {
    radius,
    centerXY: orthoCenter,
    rotate: [-20, -5, 0],
    countries: orthoCountries,
    maliEmpire1300: orthoMaliEmpire1300,
    cities: orthoCities,
  },
  mercator: {
    countries: mercCountries,
    maliEmpire1300: mercMaliEmpire1300,
    cities: mercCities,
  },
};

fs.writeFileSync(`${ROOT}/src/atlas-globe-data.json`, JSON.stringify(out));
console.log(`OK wrote atlas-globe-data.json`);
console.log(`  Ortho countries: ${orthoCountries.length}`);
console.log(`  Merc countries: ${mercCountries.length}`);
console.log(`  Mali Empire 1300 ortho: ${orthoMaliEmpire1300 ? "yes" : "no"}`);
console.log(`  Mali Empire 1300 merc: ${mercMaliEmpire1300 ? "yes" : "no"}`);
console.log(`  Ortho center XY: ${orthoCenter}`);
