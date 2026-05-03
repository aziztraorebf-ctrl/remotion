// Precompute all data needed for Atlas Empire du Ghana composition.
// 2 datasets : Mercator Sahel (vue principale Wagadou + voisins + Sahara)
//              + Mercator Wagadou close (zoom serre Koumbi Saleh)
// + POI : Taghaza, Bambouk, Koumbi Saleh
// + Wagadou empire approximate borders (10e siecle apogee)
// + Routes commerciales sel-or

import fs from "node:fs";
import { geoMercator, geoPath } from "d3-geo";

const ROOT = "/Users/clawdbot/Workspace/remotion/quebec-jacques-poc";
const ne = JSON.parse(fs.readFileSync(`${ROOT}/data/ne_50m_countries.geojson`, "utf8"));

const W = 720;
const H = 1280;

// === 1) Mercator SAHEL — vue principale ===
// Centre entre Wagadou (17°N, -7°W) et zone visible jusqu'au Sahara nord
const mercSahelProj = geoMercator()
  .center([-3, 18])  // longitude 3°W, latitude 18°N (Sahel)
  .scale(1400)
  .translate([W / 2, H / 2]);
const mercSahelPath = geoPath(mercSahelProj);

const sahelCountries = [];
for (const feat of ne.features) {
  const iso = feat.properties.ISO_A3 || feat.properties.ADM0_A3 || "";
  if (!iso || iso === "-99") continue;
  const d = mercSahelPath(feat);
  if (!d) continue;
  sahelCountries.push({ iso, d });
}

// === 2) Mercator WAGADOU CLOSE — zoom serre sur Koumbi Saleh ===
// Pour Beat 3 silent barter ou zoom dramatique
const mercCloseProj = geoMercator()
  .center([-7, 16])  // quasi sur Koumbi Saleh
  .scale(2400)
  .translate([W / 2, H / 2]);
const mercClosePath = geoPath(mercCloseProj);

const closeCountries = [];
for (const feat of ne.features) {
  const iso = feat.properties.ISO_A3 || feat.properties.ADM0_A3 || "";
  if (!iso || iso === "-99") continue;
  const d = mercClosePath(feat);
  if (!d) continue;
  closeCountries.push({ iso, d });
}

// === 3) POI cles — coordonnees [lon, lat] historiques (sources Wikipedia) ===
const POI_COORDS = {
  TAGHAZA: [-4.55, 22.69],     // mines de sel, extreme nord Mali (Wikipedia exact)
  BAMBOUK: [-11.0, 13.0],      // mines d'or, entre Mali et Senegal
  KOUMBI_SALEH: [-7.97, 15.77], // capitale Wagadou, sud Mauritanie (Wikipedia exact 15.766°N, -7.969°W)
  // Bonus pour CTA / cross-promo
  TIMBUKTU: [-3.0, 16.77],     // pour positionner reference culturelle
  CAIRE: [31.24, 30.04],       // si on veut comparer Florence/Venise
};

const projectPOI = (proj) => {
  const result = {};
  for (const [name, coords] of Object.entries(POI_COORDS)) {
    const [x, y] = proj(coords);
    result[name] = { lon: coords[0], lat: coords[1], x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
  }
  return result;
};

const sahelPOI = projectPOI(mercSahelProj);
const closePOI = projectPOI(mercCloseProj);

// === 4) Routes commerciales bezier (Taghaza -> Koumbi Saleh -> Bambouk) ===
// Path SVG bezier pour AtlasCaravane
const buildRoute = (proj, points) => {
  const projected = points.map(p => proj(p));
  if (projected.length < 2) return "";
  let d = `M ${projected[0][0]} ${projected[0][1]}`;
  for (let i = 1; i < projected.length; i++) {
    const [x, y] = projected[i];
    if (i === 1) {
      // Quadratic curve via midpoint with offset
      const [mx, my] = [(projected[0][0] + x) / 2, (projected[0][1] + y) / 2];
      d += ` Q ${mx + 30} ${my} ${x} ${y}`;
    } else {
      d += ` T ${x} ${y}`;
    }
  }
  return d;
};

const routeSel = buildRoute(mercSahelProj, [POI_COORDS.TAGHAZA, POI_COORDS.KOUMBI_SALEH]);
const routeOr = buildRoute(mercSahelProj, [POI_COORDS.BAMBOUK, POI_COORDS.KOUMBI_SALEH]);
const routeAlmoravides = buildRoute(mercSahelProj, [[-5.0, 28.0], POI_COORDS.KOUMBI_SALEH]); // descend du nord-ouest

// === 5) Empire Wagadou — DONNEES OPENHISTORICALMAP (relation 2822617) ===
// Source : OpenHistoricalMap (ODbL), 23 vertices vectorises depuis sources academiques
// Periode : VIIIe-XIIIe siecle (start_date 200, end_date 1250)
// Wikidata Q206789, Wikipedia EN "Ghana Empire"
const wagadouOhm = JSON.parse(fs.readFileSync(
  "/Users/clawdbot/Workspace/remotion/data/geo/empire-ghana/wagadou_ohm.geojson",
  "utf8"
));
const wagadouFeature = wagadouOhm.features[0];

const wagadouPathSahel = mercSahelPath(wagadouFeature);
const wagadouPathClose = mercClosePath(wagadouFeature);

// Conserver coords lat/lon brutes pour reference
const WAGADOU_BORDERS_LATLON = wagadouFeature.geometry.coordinates[0];

// === Output ===
const out = {
  width: W,
  height: H,
  mercSahel: {
    countries: sahelCountries,
    poi: sahelPOI,
    wagadouEmpire: wagadouPathSahel,
    routes: {
      sel: routeSel,
      or: routeOr,
      almoravides: routeAlmoravides,
    },
  },
  mercClose: {
    countries: closeCountries,
    poi: closePOI,
    wagadouEmpire: wagadouPathClose,
  },
  poiCoords: POI_COORDS,
  wagadouBordersLatLon: WAGADOU_BORDERS_LATLON,
};

const outPath = "/Users/clawdbot/Workspace/remotion/data/geo/empire-ghana-data.json";
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`✓ Wrote ${outPath}`);
console.log(`  Sahel countries: ${sahelCountries.length}`);
console.log(`  Close countries: ${closeCountries.length}`);
console.log(`  POI projetes Sahel:`);
for (const [name, p] of Object.entries(sahelPOI)) {
  console.log(`    ${name.padEnd(15)} (${p.lon}°E, ${p.lat}°N) -> (${p.x}, ${p.y})`);
}
