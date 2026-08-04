// Genere gazoducGeoElargie.json — extension de gazoducAfriqueCompleteGeo.json (memes 54 pays,
// meme fitExtent sur le continent africain) + voisins pour combler le vide autour (retour Aziz
// 2026-08-03 : "rester a vue eloignee sur une carte plate avec du vide autour ne marche pas").
// Ajoute : bande Ameriqe du Sud (ouest), Moyen-Orient + peninsule arabique (est), reste Europe.
// Meme pipeline que ProtoGazoducAfriqueComplete.tsx (world-atlas/countries-110m via
// topojson-client + d3-geo geoMercator().fitExtent() SUR L'AFRIQUE SEULE — les voisins debordent
// naturellement du cadre, pas de recalibrage de la projection).
import fs from "node:fs";
import path from "node:path";
import { geoMercator, geoPath } from "d3-geo";
import * as topojson from "topojson-client";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "../..");
const topo = JSON.parse(
  fs.readFileSync(`${ROOT}/public/_shared/geo-data/world/world-atlas-countries-110m.json`, "utf8")
);
const worldGeo = topojson.feature(topo, topo.objects.countries);

const W = 1920;
const H = 1080;

// Memes 51 pays africains (110m) que gazoducAfriqueCompleteGeo.json — recalcule via nom, pas ID,
// car le fichier source original utilisait des noms (verifie dans les commentaires .tsx).
const AFRICA_NAMES = new Set([
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon",
  "Central African Rep.", "Chad", "Congo", "Dem. Rep. Congo", "Djibouti", "Egypt",
  "Eq. Guinea", "Eritrea", "eSwatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea",
  "Guinea-Bissau", "Ivory Coast", "Côte d'Ivoire", "Kenya", "Lesotho", "Liberia", "Libya",
  "Madagascar", "Malawi", "Mali", "Mauritania", "Morocco", "Mozambique", "Namibia", "Niger",
  "Nigeria", "Rwanda", "Senegal", "Sierra Leone", "Somalia", "Somaliland", "South Africa",
  "S. Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "W. Sahara", "Zambia",
  "Zimbabwe",
]);
// Voisins a inclure pour "habiller" le vide (retour Aziz) — PAS tout le monde, juste une bande
// suffisante pour que le cadre ne soit jamais vide sur les cotes est/ouest quand la camera
// dezoome. Ameriqe du Sud (ouest, cote Atlantique) + Moyen-Orient/peninsule arabique (est) +
// reste Europe (deja Spain/Portugal/France presents, on complete l'arc mediterraneen).
const NEIGHBOR_NAMES = new Set([
  // Ameriqe du Sud (bande Atlantique, cote face a l'Afrique de l'Ouest)
  "Brazil", "Venezuela", "Guyana", "Suriname", "Colombia", "Ecuador", "Peru",
  // Europe (complement — Spain/Portugal/France deja dans le fitExtent existant mais on les
  // regenere ici pour un fichier autonome)
  "Spain", "Portugal", "France", "Italy", "Greece", "United Kingdom", "Ireland",
  // Moyen-Orient / peninsule arabique (est, face a la Corne de l'Afrique / Mer Rouge)
  "Saudi Arabia", "Yemen", "Oman", "United Arab Emirates", "Qatar", "Iraq", "Iran",
  "Israel", "Jordan", "Syria", "Turkey",
]);

// geoMercator().fitExtent() sur l'AFRIQUE SEULE (identique gazoducAfriqueCompleteGeo.json) —
// les voisins sont projetes avec la MEME fonction, donc debordent naturellement, jamais recadres.
const africaFeatures = worldGeo.features.filter((f) => AFRICA_NAMES.has(f.properties.name));
const proj = geoMercator().fitExtent(
  [
    [80, 90],
    [1840, 918],
  ],
  { type: "FeatureCollection", features: africaFeatures }
);
const pathFor = geoPath(proj);

const countries = [];
const allTargetNames = new Set([...AFRICA_NAMES, ...NEIGHBOR_NAMES]);
for (const feat of worldGeo.features) {
  const name = feat.properties.name;
  if (!allTargetNames.has(name)) continue;
  const d = pathFor(feat);
  if (!d) continue;
  countries.push({ name, d, isAfrica: AFRICA_NAMES.has(name) });
}

// Centroides utiles (memes cles que gazoducAfriqueCompleteGeo.json + quelques voisins)
function bboxCentroid(d) {
  const nums = (d.match(/-?\d+\.?\d*/g) || []).map(Number);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length - 1; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}
const centroidNames = [
  "Nigeria", "Niger", "Algeria", "Morocco", "Spain", "Portugal", "France", "Chad", "Mali",
  "Brazil", "Saudi Arabia", "Turkey",
];
const centroids = {};
for (const name of centroidNames) {
  const c = countries.find((x) => x.name === name);
  if (c) centroids[name] = bboxCentroid(c.d);
}

const out = {
  meta: {
    source: "world-atlas/countries-110m.json via topojson-client + d3-geo geoMercator().fitExtent()",
    africaCount: africaFeatures.length,
    neighborCount: countries.length - africaFeatures.length,
    fitExtentOn: "continent africain SEUL (memes bornes que gazoducAfriqueCompleteGeo.json) — voisins debordent naturellement, projection non recadree",
    canvasW: W,
    canvasH: H,
    generatedFor: "prototype comparatif camera-resserree vs voisins-visibles (Aziz 2026-08-03)",
  },
  countries,
  centroids,
};
fs.writeFileSync(
  `${ROOT}/src/projects/_rnd/d3-16x9/gazoducGeoElargie.json`,
  JSON.stringify(out)
);
console.log(`OK — ${countries.length} pays (${africaFeatures.length} Afrique + ${countries.length - africaFeatures.length} voisins)`);
