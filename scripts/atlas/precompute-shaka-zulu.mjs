// Precompute SVG paths for Atlas Shaka Zulu.
// 3 projections: azimuthal equal area KwaZulu-Natal (territoire + expansion + mourning)
// + impi expansion path waypoints.
// Output: src/projects/shaka-zulu/shaka-zulu-data.json

import fs from "node:fs";
import { geoAzimuthalEqualArea, geoPath } from "d3-geo";

const ROOT = "/Users/clawdbot/Workspace/remotion";
const ne = JSON.parse(
  fs.readFileSync(`${ROOT}/quebec-jacques-poc/data/ne_50m_countries.geojson`, "utf8")
);

const W = 720;
const H = 1280;

// === KwaZulu-Natal bounds (historique c.1816-1828) ===
// geoAzimuthalEqualArea : utiliser .rotate([-lon, -lat, 0]) pour centrer sur un point.
// .center() ne fonctionne pas comme attendu avec cette projection — .rotate() est la bonne approche.
const KWAZULU_LON = 31.0;
const KWAZULU_LAT = -28.5;

// Convention geoAzimuthalEqualArea.rotate([lambda, phi, gamma]) :
// lambda = -lon (rotation autour axe Z), phi = -lat (axe X). Hémisphère sud = lat négatif → phi positif.
// Scale 9:16 portrait : H=1280 >> W=720, donc il faut un scale plus modéré pour rester dans le cadre.

// Stratégie centrage portrait 9:16 :
// - translate Y > H/2 pousse le point focal vers le bas du canvas
//   → la carte remonte → la zone d'intérêt (côte est KwaZulu) se retrouve au centre visuel.
// - rotate([-lon, lat_sud_positif]) : pour l'hémisphère sud, phi = -lat donc lat -29 → phi = 29.

// === 1) Vue TERRITOIRE — côte est KwaZulu au centre ===
// Cible : voir la bande côtière KwaZulu (lon~31, lat~-29) au milieu du canvas
const territorioProj = geoAzimuthalEqualArea()
  .scale(1600)
  .translate([W / 2, H * 0.62])
  .rotate([-31.0, 29.0, 0]); // centre lat -29, lon 31
const territorioPath = geoPath(territorioProj);

// === 2) Vue EXPANSION — Afrique australe + un peu de contexte continental ===
const expansionProj = geoAzimuthalEqualArea()
  .scale(850)
  .translate([W / 2, H * 0.55])
  .rotate([-27.0, 27.0, 0]); // centre lat -27, lon 27 — milieu Afrique australe
const expansionPath = geoPath(expansionProj);

// === 3) Vue MOURNING — zoom intermédiaire, KwaZulu centré ===
const mourningProj = geoAzimuthalEqualArea()
  .scale(1200)
  .translate([W / 2, H * 0.58])
  .rotate([-31.0, 29.0, 0]);
const mourningPath = geoPath(mourningProj);

// Pays concernés — Afrique australe + voisins visibles
const AFRICA_AUSTRAL_ISO = new Set([
  "ZAF", "ZWE", "ZMB", "MWI", "MOZ", "LSO", "SWZ",
  "BWA", "NAM", "AGO", "TZA", "KEN", "UGA", "COD",
  "SOM", "ETH", "ERI", "MDG", "COM", "MUS",
  "RWA", "BDI", "COG", "GAB", "CMR", "NGA",
  "SSD", "SDN", "DJI", "SOM",
]);

const buildCountries = (pathGen, isoSet) => {
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

// === Villes / lieux clés (pour markers + labels) ===
const PLACES = {
  uMgungundlovu: [31.46, -28.84],  // palais royal de Shaka
  KwaBulawayo:   [31.40, -28.23],  // premier kraal royal
  GqokliHill:    [30.31, -28.18],  // bataille 1818
  eZiklatini:    [31.74, -28.41],  // site assassinat 1828
  Durban:        [31.02, -29.87],  // zone cotiere
};

const projectPlaces = (proj) => {
  const out = {};
  for (const [name, ll] of Object.entries(PLACES)) {
    const xy = proj(ll);
    if (xy) out[name] = xy;
  }
  return out;
};

// === Impi expansion path (S3) — du kraal vers les quatre directions ===
// Chemin nord-est (principal axe d'expansion 1820-1828)
const impiWaypoints = [
  expansionProj([31.40, -28.23]),  // KwaBulawayo (depart)
  expansionProj([32.10, -27.50]),  // vers côte nord
  expansionProj([32.80, -26.30]),  // Mozambique border
  expansionProj([33.00, -25.00]),  // expansion nord
];

// Chemin ouest (vers les hauts plateaux)
const impiWestWaypoints = [
  expansionProj([31.40, -28.23]),  // KwaBulawayo (depart)
  expansionProj([30.20, -28.50]),  // vers ouest
  expansionProj([29.00, -29.00]),  // Drakensberg
];

const smoothPath = (points) => {
  if (!points || points.length < 2) return "";
  const pts = points.filter(Boolean);
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
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
};

const out = {
  width: W,
  height: H,
  // Vue serrée KwaZulu — utilisée dans S1 territoire
  territoire: {
    scale: 1800,
    center: [KWAZULU_LON, KWAZULU_LAT],
    countries: buildCountries(territorioPath, AFRICA_AUSTRAL_ISO),
    places: projectPlaces(territorioProj),
  },
  // Vue large Afrique australe — utilisée dans S3 expansion
  expansion: {
    scale: 900,
    center: [28.0, -26.0],
    countries: buildCountries(expansionPath, AFRICA_AUSTRAL_ISO),
    places: projectPlaces(expansionProj),
    impiPathNord: smoothPath(impiWaypoints),
    impiPathOuest: smoothPath(impiWestWaypoints),
    impiWaypointsNord: impiWaypoints.filter(Boolean),
    impiWaypointsOuest: impiWestWaypoints.filter(Boolean),
  },
  // Vue deuil — utilisée dans S4 (même centre, légèrement dézoomée)
  mourning: {
    scale: 1400,
    center: [KWAZULU_LON, KWAZULU_LAT],
    countries: buildCountries(mourningPath, AFRICA_AUSTRAL_ISO),
    places: projectPlaces(mourningProj),
  },
};

const outPath = `${ROOT}/src/projects/shaka-zulu/shaka-zulu-data.json`;
fs.writeFileSync(outPath, JSON.stringify(out));

console.log("OK wrote shaka-zulu-data.json");
console.log(`  territoire countries: ${out.territoire.countries.length}`);
console.log(`  expansion countries: ${out.expansion.countries.length}`);
console.log(`  mourning countries: ${out.mourning.countries.length}`);
console.log(`  territoire places: ${Object.keys(out.territoire.places).join(", ")}`);
console.log(`  expansion places: ${Object.keys(out.expansion.places).join(", ")}`);
console.log(`  impiPath nord length: ${out.expansion.impiPathNord.length}`);
