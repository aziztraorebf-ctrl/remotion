// Precompute SVG paths for La Peste et le Sahara 1347 (Atlas pur)
// Coverage: Europe + Afrique du Nord + Afrique de l'Ouest
// 4 vues Mercator selon les beats du script + coordonnées POI projetées

import fs from "node:fs";
import path from "node:path";
import { geoMercator, geoPath } from "d3-geo";

const ROOT = path.resolve("/Users/clawdbot/Workspace/remotion");
const ne = JSON.parse(fs.readFileSync(`${ROOT}/quebec-jacques-poc/data/ne_50m_countries.geojson`, "utf8"));
const w1300 = JSON.parse(fs.readFileSync(`${ROOT}/public/atlas/peste-1347/geo/mali-1300.geojson`, "utf8"));

const W = 720;
const H = 1280;

// ─── ISO CODES — Europe + Afrique du Nord + Afrique de l'Ouest ──────────────
const ISO_EUROPE = new Set([
  "GBR","IRL","FRA","ESP","PRT","ITA","CHE","AUT","DEU","BEL","NLD","LUX",
  "DNK","SWE","NOR","FIN","POL","CZE","SVK","HUN","ROU","BGR","HRV","SRB",
  "BIH","ALB","MKD","GRC","SVN","LVA","LTU","EST","BLR","UKR","MDA","RUS",
  "MLT","CYP","TUR","GEO","ARM","AZE",
]);

const ISO_AFRIQUE_NORD = new Set([
  "MAR","ESH","DZA","TUN","LBY","EGY","SDN","SSD","MRT","MLI","NER","TCD",
]);

const ISO_AFRIQUE_OUEST = new Set([
  "SEN","GMB","GNB","GIN","SLE","LBR","CIV","GHA","TGO","BEN","NGA","BFA",
  "CMR","CAF","COG","COD","GAB","GNQ","STP","CPV",
]);

const ISO_AFRIQUE_EST_SUD = new Set([
  "ETH","ERI","DJI","SOM","KEN","UGA","TZA","RWA","BDI",
  "MOZ","ZMB","ZWE","MWI","AGO","NAM","BWA","ZAF","LSO","SWZ","MDG",
  "COM","MUS","SYC",
]);

const ISO_MOYEN_ORIENT = new Set([
  "SAU","YEM","OMN","ARE","QAT","BHR","KWT","IRQ","IRN","SYR","LBN","JOR","ISR","PSE",
]);

const ISO_ASIE_CENTRALE = new Set([
  "KAZ","UZB","TKM","KGZ","TJK","AFG","PAK","IND","NPL","BTN","BGD","LKA",
]);

const ISO_ASIE_EST_SE = new Set([
  "CHN","MNG","PRK","KOR","JPN","TWN","VNM","LAO","KHM","THA","MMR","MYS",
  "BRN","SGP","IDN","PHL","TLS",
]);

const ISO_AMERIQUES = new Set([
  "CAN","USA","MEX","GTM","BLZ","HND","SLV","NIC","CRI","PAN",
  "CUB","JAM","HTI","DOM","PRI","TTO","BRB","GRD","VCT","LCA","ATG","DMA","KNA",
  "COL","VEN","GUY","SUR","BRA","ECU","PER","BOL","CHL","ARG","PRY","URY",
  "GRL","BHS",
]);

const ISO_OCEANIE = new Set([
  "AUS","NZL","PNG","FJI","SLB","VUT","WSM","TON","KIR","TUV","NRU","PLW","MHL","FSM",
]);

const ALL_ISO = new Set([
  ...ISO_EUROPE, ...ISO_AFRIQUE_NORD, ...ISO_AFRIQUE_OUEST, ...ISO_AFRIQUE_EST_SUD,
  ...ISO_MOYEN_ORIENT, ...ISO_ASIE_CENTRALE, ...ISO_ASIE_EST_SE,
  ...ISO_AMERIQUES, ...ISO_OCEANIE,
]);

// ─── POI (lon, lat) ──────────────────────────────────────────────────────────
const POI = {
  // Route propagation Peste (rouge)
  Caffa:      [35.382, 45.030],  // Crimée — point d'entrée
  Sicile:     [13.360, 38.120],  // Premier port touché
  Paris:      [2.350,  48.850],
  Londres:    [-0.120, 51.500],
  Stockholm:  [18.070, 59.330],
  LeCaire:    [31.241, 30.048],  // 7000 morts/jour
  // Empire Mali (or)
  Tombouctou: [-3.014, 16.787],
  Niani:      [-8.386, 11.379],  // Capitale Mali 1347
  // Route commerciale or
  Maghreb:    [-5.000, 34.000],  // Maroc/Maghreb approx
  Florence:   [11.255, 43.768],
  Venise:     [12.336, 45.434],
};

// ─── SAHARA BOUNDARY (clipPath vague Peste) ──────────────────────────────────
// Polygone simplifié Sahara : lat 15-20°N, lon -17°W à 35°E
const SAHARA_CLIP = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    coordinates: [[
      [-17, 15], [-17, 20], [-5, 22], [5, 22], [15, 22],
      [25, 20], [35, 18], [35, 15], [25, 14], [15, 14],
      [5, 13], [-5, 13], [-17, 15],
    ]],
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const buildCountries = (pathGen, isoSet) => {
  const arr = [];
  for (const feat of ne.features) {
    const iso3 = feat.properties.ISO_A3 || "";
    const iso = (iso3 === "-99" || iso3 === "") ? (feat.properties.ADM0_A3 || "") : iso3;
    if (!isoSet.has(iso)) continue;
    const d = pathGen(feat);
    if (!d) continue;
    arr.push({ iso, d });
  }
  return arr;
};

const projectPOI = (proj) => {
  const out = {};
  for (const [name, ll] of Object.entries(POI)) {
    const xy = proj(ll);
    out[name] = { x: +xy[0].toFixed(2), y: +xy[1].toFixed(2), lon: ll[0], lat: ll[1] };
  }
  return out;
};

const getMaliEmpire = (pathGen) => {
  for (const feat of w1300.features) {
    if ((feat.properties.NAME || "").toLowerCase() === "mali") {
      return pathGen(feat);
    }
  }
  return null;
};

const getSaharaPath = (pathGen) => pathGen(SAHARA_CLIP);

// ─── VUE 1 : LARGE — Europe + Afrique (vue principale du script) ──────────────
// Centre méditerranée/sahara — couvre Crimée en haut, Mali en bas
const mercLargeProj = geoMercator()
  .center([12, 24])
  .scale(420)
  .translate([W / 2, H / 2]);
const mercLargePath = geoPath(mercLargeProj);

// ─── VUE 2 : EUROPE — focus propagation Peste (Sicile → Stockholm) ───────────
const mercEuropeProj = geoMercator()
  .center([12, 48])
  .scale(700)
  .translate([W / 2, H / 2]);
const mercEuropePath = geoPath(mercEuropeProj);

// ─── VUE 3 : MALI — focus Afrique de l'Ouest + routes commerciales ───────────
const mercMaliProj = geoMercator()
  .center([-3, 18])
  .scale(700)
  .translate([W / 2, H / 2]);
const mercMaliPath = geoPath(mercMaliProj);

// ─── VUE 4 : SAHARA — zoom Sahara comme barrière (climax bouclier) ───────────
const mercSaharaProj = geoMercator()
  .center([5, 22])
  .scale(900)
  .translate([W / 2, H / 2]);
const mercSaharaPath = geoPath(mercSaharaProj);

// ─── ROUTE COMMERCIALE OR : Niani → Tombouctou → Maghreb → Florence → Venise ─
const buildOrRoute = (proj) => {
  const waypoints = [
    proj(POI.Niani),
    proj(POI.Tombouctou),
    proj(POI.Maghreb),
    proj(POI.Florence),
    proj(POI.Venise),
  ];
  // Catmull-Rom smooth
  let d = `M${waypoints[0][0].toFixed(2)},${waypoints[0][1].toFixed(2)}`;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p0 = waypoints[Math.max(0, i - 1)];
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    const p3 = waypoints[Math.min(waypoints.length - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return { d, waypoints };
};

// ─── CERCLE PROPAGATION depuis Sicile (vague Peste) ──────────────────────────
// Centre projeté pour chaque vue — le composant AtlasPropagationWave
// animera r de 0 à maxR en pixels, avec clipPath Sahara
const buildPropagationCenter = (proj) => {
  const xy = proj(POI.Sicile);
  return { cx: +xy[0].toFixed(2), cy: +xy[1].toFixed(2) };
};

// ─── ASSEMBLE OUTPUT ─────────────────────────────────────────────────────────
console.log("Building vue Large (Europe + Afrique)...");
const mercLarge = {
  countries: buildCountries(mercLargePath, ALL_ISO),
  maliEmpire1300: getMaliEmpire(mercLargePath),
  saharaPath: getSaharaPath(mercLargePath),
  poi: projectPOI(mercLargeProj),
  orRoute: buildOrRoute(mercLargeProj),
  propagationCenter: buildPropagationCenter(mercLargeProj),
};
console.log(`  countries: ${mercLarge.countries.length}`);

console.log("Building vue Europe (propagation Peste)...");
const mercEurope = {
  countries: buildCountries(mercEuropePath, ALL_ISO),
  maliEmpire1300: getMaliEmpire(mercEuropePath),
  poi: projectPOI(mercEuropeProj),
  propagationCenter: buildPropagationCenter(mercEuropeProj),
};
console.log(`  countries: ${mercEurope.countries.length}`);

console.log("Building vue Mali (Afrique de l'Ouest)...");
const mercMali = {
  countries: buildCountries(mercMaliPath, new Set([...ISO_AFRIQUE_NORD, ...ISO_AFRIQUE_OUEST])),
  maliEmpire1300: getMaliEmpire(mercMaliPath),
  saharaPath: getSaharaPath(mercMaliPath),
  poi: projectPOI(mercMaliProj),
  orRoute: buildOrRoute(mercMaliProj),
};
console.log(`  countries: ${mercMali.countries.length}`);

console.log("Building vue Sahara (climax barrière)...");
const mercSahara = {
  countries: buildCountries(mercSaharaPath, new Set([...ISO_AFRIQUE_NORD, ...ISO_AFRIQUE_OUEST, "ESP", "ITA", "MLT"])),
  maliEmpire1300: getMaliEmpire(mercSaharaPath),
  saharaPath: getSaharaPath(mercSaharaPath),
  poi: projectPOI(mercSaharaProj),
  propagationCenter: buildPropagationCenter(mercSaharaProj),
};
console.log(`  countries: ${mercSahara.countries.length}`);

const out = {
  width: W,
  height: H,
  mercLarge,
  mercEurope,
  mercMali,
  mercSahara,
};

const OUTFILE = `${ROOT}/public/atlas/peste-1347/geo/peste-map-data.json`;
fs.writeFileSync(OUTFILE, JSON.stringify(out));
const size = (fs.statSync(OUTFILE).size / 1024).toFixed(1);
console.log(`\nOK → ${OUTFILE} (${size} KB)`);
console.log("Vues disponibles: mercLarge, mercEurope, mercMali, mercSahara");
