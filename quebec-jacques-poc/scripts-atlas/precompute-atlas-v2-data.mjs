// Precompute all data needed for Atlas Mansa Moussa V2 composition.
// 3 datasets: globe orthographic + Mercator wide (Mali->Mecque visible) + bezier caravane path.

import fs from "node:fs";
import { geoOrthographic, geoMercator, geoPath } from "d3-geo";

const ROOT = "/Users/clawdbot/Workspace/remotion/quebec-jacques-poc";
const ne = JSON.parse(fs.readFileSync(`${ROOT}/data/ne_50m_countries.geojson`, "utf8"));
const w1300 = JSON.parse(fs.readFileSync(`${ROOT}/data/world_1300.geojson`, "utf8"));

const W = 720;
const H = 1280;

// === 1) Globe orthographic (vue espace, hook + finale) ===
const orthoRadius = 280;
const orthoProj = geoOrthographic()
  .scale(orthoRadius)
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

// === 2) Mercator WIDE (Mali->Mecque visible, scene Climax Hadj) ===
// Center between Mali and Mecque, scale to fit both
const mercWideProj = geoMercator()
  .center([15, 20])  // entre Niger central et Mer Rouge nord
  .scale(550)         // dezoome pour voir Mali ET Mecque
  .translate([W / 2, H / 2]);
const mercWidePath = geoPath(mercWideProj);

// === 3) Mercator NARROW (focus West Africa, scenes setup/densite) ===
const mercNarrowProj = geoMercator()
  .center([5, 18])
  .scale(900)
  .translate([W / 2, H / 2]);
const mercNarrowPath = geoPath(mercNarrowProj);

// === 4) Mercator EGYPT close-up (scene Caire) ===
const mercCaireProj = geoMercator()
  .center([31, 30])
  .scale(1400)
  .translate([W / 2, H / 2]);
const mercCairePath = geoPath(mercCaireProj);

const ALL_COUNTRY_ISO = new Set([
  "DZA","AGO","BEN","BWA","BFA","BDI","CMR","CPV","CAF","TCD","COM","COG","COD",
  "CIV","DJI","EGY","GNQ","ERI","SWZ","ETH","GAB","GMB","GHA","GIN","GNB","KEN",
  "LSO","LBR","LBY","MDG","MWI","MLI","MRT","MUS","MAR","MOZ","NAM","NER","NGA",
  "RWA","STP","SEN","SYC","SLE","SOM","ZAF","SSD","SDN","TZA","TGO","TUN","UGA",
  "ZMB","ZWE","ESH","SAU","YEM","JOR","ISR","PSX","SYR","LBN","IRQ","IRN","TUR",
  "OMN","ARE","QAT","BHR","KWT","ARM","AZE","GEO","KAZ","TKM","UZB","AFG","PAK",
  "ESP","PRT","ITA","GRC","MLT","CYP","FRA","DEU","CHE","AUT","BEL","NLD","GBR","IRL",
  "POL","UKR","ROU","BGR","HRV","SRB","BIH","ALB","MKD","HUN","CZE","SVK","SVN"
]);

const buildCountrySet = (pathGen, isoSet) => {
  const arr = [];
  for (const feat of ne.features) {
    const iso = feat.properties.ISO_A3 || feat.properties.ADM0_A3 || "";
    if (!isoSet.has(iso)) continue;
    const d = pathGen(feat);
    if (!d) continue;
    arr.push({ iso, d });
  }
  return arr;
};

const findEmpire = (pathGen) => {
  for (const feat of w1300.features) {
    if ((feat.properties.NAME || "").toLowerCase() === "mali") {
      return pathGen(feat);
    }
  }
  return null;
};

const CITIES = {
  Niani: [-8.0, 11.4],
  Tombouctou: [-3.0026, 16.7666],
  Gao: [0.04, 16.27],
  LeCaire: [31.2357, 30.0444],
  Mecque: [39.8262, 21.4225],
  Marrakech: [-7.99, 31.63],
  // === 18 capitales africaines (pour mini-flag overlay) ===
  Bamako: [-7.99, 12.65],
  Dakar: [-17.45, 14.69],
  Conakry: [-13.68, 9.64],
  Yamoussoukro: [-3.96, 5.32],
  Accra: [-0.20, 5.60],
  Abuja: [7.49, 9.05],
  AddisAbeba: [38.74, 9.03],
  Nairobi: [36.82, -1.29],
  Pretoria: [28.19, -25.75],
  NDjamena: [15.05, 12.13],
  Niamey: [2.12, 13.51],
  Ouagadougou: [-1.52, 12.37],
  Yaounde: [11.50, 3.85],
  Alger: [3.05, 36.75],
  Tunis: [10.18, 36.81],
  Tripoli: [13.19, 32.89],
  Rabat: [-6.83, 34.02],
};

const projectCities = (proj) => {
  const out = {};
  for (const [name, ll] of Object.entries(CITIES)) {
    out[name] = proj(ll);
  }
  return out;
};

// === Caravane bezier path Niani -> Tombouctou -> Caire -> Mecque ===
// In MERC WIDE coords (the scene where caravane animates)
const caravanePoints = [
  mercWideProj([-8.0, 11.4]),    // Niani
  mercWideProj([-3.0, 16.77]),   // Tombouctou
  mercWideProj([10, 25]),         // Sahara crossing midpoint
  mercWideProj([20, 28]),         // Sahara east
  mercWideProj([31.24, 30.04]),  // Caire
  mercWideProj([35, 26]),         // Sinai
  mercWideProj([39.83, 21.42]),  // Mecque
];

const caravanePath = `M${caravanePoints[0][0]},${caravanePoints[0][1]} ` +
  caravanePoints.slice(1).map(p => `L${p[0]},${p[1]}`).join(" ");

// Build smooth Catmull-Rom approximation via SVG cubic Bezier
const smoothCaravanePath = (() => {
  const pts = caravanePoints;
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
})();

const out = {
  width: W,
  height: H,
  ortho: {
    radius: orthoRadius,
    centerXY: [W / 2, H / 2],
    rotate: [-20, -5, 0],
    countries: orthoCountries,
    maliEmpire1300: orthoMaliEmpire1300,
    cities: projectCities(orthoProj),
  },
  mercWide: {
    countries: buildCountrySet(mercWidePath, ALL_COUNTRY_ISO),
    maliEmpire1300: findEmpire(mercWidePath),
    cities: projectCities(mercWideProj),
    caravanePath,
    caravaneSmooth: smoothCaravanePath,
    caravaneWaypoints: {
      Niani: caravanePoints[0],
      Tombouctou: caravanePoints[1],
      Sahara1: caravanePoints[2],
      Sahara2: caravanePoints[3],
      LeCaire: caravanePoints[4],
      Sinai: caravanePoints[5],
      Mecque: caravanePoints[6],
    },
  },
  mercNarrow: {
    countries: buildCountrySet(mercNarrowPath, ALL_COUNTRY_ISO),
    maliEmpire1300: findEmpire(mercNarrowPath),
    cities: projectCities(mercNarrowProj),
  },
  mercCaire: {
    countries: buildCountrySet(mercCairePath, ALL_COUNTRY_ISO),
    cities: projectCities(mercCaireProj),
  },
};

fs.writeFileSync(`${ROOT}/src/atlas-v2-data.json`, JSON.stringify(out));
console.log("OK wrote atlas-v2-data.json");
console.log(`  Ortho countries: ${orthoCountries.length}`);
console.log(`  MercWide countries: ${out.mercWide.countries.length}`);
console.log(`  MercWide cities Mecque XY: ${out.mercWide.cities.Mecque}`);
console.log(`  MercWide cities Niani XY: ${out.mercWide.cities.Niani}`);
console.log(`  Caravane path waypoints: ${caravanePoints.length}`);
console.log(`  MercNarrow countries: ${out.mercNarrow.countries.length}`);
console.log(`  MercCaire countries: ${out.mercCaire.countries.length}`);
