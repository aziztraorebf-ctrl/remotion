// Precompute SVG paths for Nouvelle-France Atlas POC
// Projection : Mercator centree Amerique du Nord (16:9, 1920x1080)
// Output : data/geo/nouvelle-france-data.json

import fs from "node:fs";
import { geoMercator, geoPath } from "d3-geo";

const ROOT = "/Users/clawdbot/Workspace/remotion";
const ne = JSON.parse(fs.readFileSync(
  `${ROOT}/quebec-jacques-poc/data/ne_50m_countries.geojson`, "utf8"
));

const W = 1920;
const H = 1080;

// Projection centree sur l'Amerique du Nord
// Center: ~90W, 50N pour voir Canada + USA + Mexique
const proj = geoMercator()
  .center([-90, 50])
  .scale(700)
  .translate([W / 2, H / 2]);

const path = geoPath(proj);

// Pays d'Amerique du Nord a inclure
const NA_ISOS = new Set([
  "CAN", "USA", "MEX", "GTM", "BLZ", "HND", "SLV", "NIC", "CRI", "PAN",
  "CUB", "JAM", "HTI", "DOM", "PRI", "GRL",
  // Antilles et Caraibes pertinentes
  "TTO", "BRB", "LCA", "VCT", "GRD", "ATG", "DMA", "KNA",
]);

// Generer paths pour tous les pays d'Amerique du Nord
const countries = [];
for (const feat of ne.features) {
  const iso = feat.properties.ISO_A3 || feat.properties.ADM0_A3 || "";
  if (!iso || iso === "-99") continue;
  if (!NA_ISOS.has(iso)) continue;
  const d = path(feat);
  if (!d) continue;
  countries.push({ iso, d });
}

console.log(`Pays generes: ${countries.length}`);

// Verifier que Canada et USA sont presents
const hasCA = countries.some(c => c.iso === "CAN");
const hasUS = countries.some(c => c.iso === "USA");
console.log(`Canada: ${hasCA}, USA: ${hasUS}`);

// Territoire de la Nouvelle-France (1712 — apogee)
// Approximation par polygone couvrant:
// - Acadie (est du Canada)
// - Vallee du Saint-Laurent
// - Grands Lacs
// - Mississippi jusqu'au golfe du Mexique
// - Louisiane
// Coordonnees geo [lon, lat] -> projetees en SVG
function project(lon, lat) {
  return proj([lon, lat]);
}

// Contour du territoire Nouvelle-France 1712
// Source approximation historique (Nouvelle-France + Louisiane)
const nouvelleFranceCoords = [
  // Acadie / Maritimes (est)
  [-60, 47], [-64, 45], [-66, 44], [-70, 43],
  // Cote atlantique jusqu'a la frontiere avec colonies anglaises
  [-72, 41], [-74, 40],
  // Remonte vers les Grands Lacs via les Alleghenys
  [-76, 42], [-78, 43], [-80, 43],
  // Grands Lacs (rive nord)
  [-82, 43], [-84, 46], [-86, 47], [-88, 47], [-90, 47],
  // Vers le nord jusqu'a la Baie d'Hudson
  [-92, 50], [-88, 53], [-82, 56], [-78, 60], [-74, 62],
  // Baie d'Hudson rive ouest
  [-80, 65], [-86, 68], [-92, 68],
  // Nord-Ouest (Rupert's Land - moins controle mais revendique)
  [-95, 60], [-100, 55],
  // Mississippi vers le sud
  [-97, 49], [-95, 45], [-92, 43], [-90, 38],
  [-90, 32], [-90, 29],
  // Golfe du Mexique (Louisiane)
  [-89, 29], [-93, 29], [-97, 26],
  // Remonte le Mississippi
  [-97, 30], [-95, 35], [-93, 40],
  // Ferme la boucle vers les Grands Lacs
  [-90, 42], [-86, 40], [-82, 41],
  // Retour vers l'est
  [-78, 42], [-76, 43], [-74, 44], [-72, 44],
  [-70, 45], [-68, 46], [-66, 46], [-64, 46], [-62, 46], [-60, 47],
];

const nouvelleFrancePath = nouvelleFranceCoords
  .map((coord, i) => {
    const [x, y] = project(coord[0], coord[1]);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  })
  .join(" ") + " Z";

// Colonies anglaises (cote est, 1712)
const coloniesAnglaiseCoords = [
  [-70, 43], [-72, 41], [-74, 40], [-75, 38],
  [-76, 36], [-77, 34], [-78, 32], [-79, 31],
  [-81, 30], [-82, 29], [-80, 25],
  // Retour nord
  [-75, 28], [-77, 32], [-79, 35],
  [-80, 37], [-78, 39], [-76, 41],
  [-74, 42], [-72, 43], [-70, 43],
];

const coloniesAnglaisePath = coloniesAnglaiseCoords
  .map((coord, i) => {
    const [x, y] = project(coord[0], coord[1]);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  })
  .join(" ") + " Z";

// Route principale : Saint-Laurent + Mississippi (spine de l'empire)
const saintLaurentPoints = [
  [-64, 47], [-66, 47], [-68, 47], [-70, 46],
  [-72, 46], [-74, 45], [-76, 44], [-78, 44],
  [-80, 44], [-82, 45], [-84, 45], [-86, 44],
  [-88, 45], [-90, 46], [-90, 44], [-90, 42],
  [-90, 40], [-90, 37], [-90, 34], [-90, 31], [-90, 29],
];

const saintLaurentPath = saintLaurentPoints
  .map((coord, i) => {
    const [x, y] = project(coord[0], coord[1]);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  })
  .join(" ");

// Villes cles avec coordonnees
const cities = [
  { name: "Quebec", lon: -71.2, lat: 46.8 },
  { name: "Montreal", lon: -73.6, lat: 45.5 },
  { name: "Louisiane", lon: -90.0, lat: 29.9 },
  { name: "Tadoussac", lon: -69.7, lat: 48.1 },
  { name: "Detroit", lon: -83.0, lat: 42.3 },
];

const citiesProjected = cities.map(c => {
  const [x, y] = project(c.lon, c.lat);
  return { name: c.name, x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) };
});

// Position coureur des bois (sur le Saint-Laurent, entre Quebec et Montreal)
const [coureurX, coureurY] = project(-72.5, 46.0);

// Output JSON
const output = {
  width: W,
  height: H,
  countries,
  nouvelleFrancePath,
  coloniesAnglaisePath,
  saintLaurentPath,
  cities: citiesProjected,
  coureurPosition: {
    x: parseFloat(coureurX.toFixed(1)),
    y: parseFloat(coureurY.toFixed(1)),
  },
};

const outPath = `${ROOT}/data/geo/nouvelle-france-data.json`;
fs.writeFileSync(outPath, JSON.stringify(output));
console.log(`Sauvegarde: ${outPath}`);
console.log(`Taille: ${(JSON.stringify(output).length / 1024).toFixed(0)} KB`);
console.log(`Coureur des bois position: x=${coureurX.toFixed(0)}, y=${coureurY.toFixed(0)}`);
console.log("Villes projetees:", citiesProjected);
