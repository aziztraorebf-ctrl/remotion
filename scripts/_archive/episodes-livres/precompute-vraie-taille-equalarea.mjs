/**
 * Precompute SVG paths pour "La Vraie Taille de l'Afrique" — Equal Earth projection
 *
 * Projection : geoEqualEarth centree sur Afrique — aires preservees (pas de distorsion de taille)
 * Output : src/projects/souverain/vraie-taille-afrique/geo-data-equalarea.json
 *
 * Usage : node scripts/precompute-vraie-taille-equalarea.mjs
 */

import { geoEqualEarth, geoPath, geoCentroid } from "d3-geo";
import { feature, merge } from "topojson-client";
import fs from "node:fs";

// Dimensions composition Remotion 1080x1920
const WIDTH  = 1080;
const HEIGHT = 1920;

// Equal Earth — meme centrage que Mercator pour comparaison directe
// scale plus eleve car Equal Earth comprime les latitudes hautes (inverse de Mercator)
const PROJECTION = geoEqualEarth()
  .center([20, -5])
  .scale(520)
  .translate([WIDTH / 2, HEIGHT * 0.44]);

const pathGen = geoPath().projection(PROJECTION);

// Charger le TopoJSON
const topoRaw = JSON.parse(
  fs.readFileSync("public/_shared/geo-data/countries-50m.json", "utf8")
);

const countriesFC = feature(topoRaw, topoRaw.objects.countries);
const allFeatures = countriesFC.features;

// USA 48 etats contigus (Alaska + Hawaii exclus — convention universelle pour cet effet)
const usa48 = JSON.parse(
  fs.readFileSync("public/_shared/geo-data/us-48states.json", "utf8")
);

// ---------------------------------------------------------------------------
// IDs numeriques par continent/pays
// ---------------------------------------------------------------------------

// Afrique — liste complete ISO numerique
const AFRICA_IDS = [
  12,24,204,72,854,108,132,120,140,148,174,180,178,384,262,818,226,232,748,231,
  266,270,288,324,624,404,426,430,434,450,454,466,478,480,504,508,516,562,566,646,
  678,686,694,706,710,716,728,729,834,768,788,800,894,716,732,
];

// USA
const USA_IDS = [840];

// Chine
const CHINA_IDS = [156];

// Inde
const INDIA_IDS = [356];

// Europe (principaux pays)
const EUROPE_IDS = [
  8,40,56,70,100,191,203,208,233,246,250,276,300,348,352,372,380,428,
  440,442,470,492,498,528,578,616,620,642,643,703,705,724,752,756,804,826,
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mergeByIds(ids) {
  const matching = topoRaw.objects.countries.geometries.filter(
    (g) => ids.includes(Number(g.id))
  );
  if (!matching.length) return null;
  return merge(topoRaw, matching);
}

function featureFromIds(ids) {
  const geo = mergeByIds(ids);
  if (!geo) return null;
  return { type: "Feature", properties: {}, geometry: geo };
}

function computeEntry(ids, label) {
  const feat = featureFromIds(ids);
  if (!feat) return null;

  const d = pathGen(feat) ?? "";
  const bounds = pathGen.bounds(feat);
  if (!bounds) return null;

  const [[x0, y0], [x1, y1]] = bounds;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const w  = x1 - x0;
  const h  = y1 - y0;

  return { label, path: d, cx, cy, w, h };
}

// ---------------------------------------------------------------------------
// Afrique — path + bounding box (centre de reference pour les overlays)
// ---------------------------------------------------------------------------

const africaEntry = computeEntry(AFRICA_IDS, "Afrique");

const africaCX = africaEntry?.cx ?? WIDTH / 2;
const africaCY = africaEntry?.cy ?? HEIGHT / 2;

console.log(`Afrique centre : (${africaCX.toFixed(1)}, ${africaCY.toFixed(1)})`);
console.log(`Afrique bbox   : w=${africaEntry?.w?.toFixed(0)} h=${africaEntry?.h?.toFixed(0)}`);

// ---------------------------------------------------------------------------
// Pays a superposer — translater les coordonnees GEO vers lat=0 avant projection
// C'est le principe de thetruesize.com : en deplacant un pays vers l'equateur,
// Mercator affiche sa vraie taille relative (sans le gonflement des hautes latitudes)
// ---------------------------------------------------------------------------

// Centre cible pour tous les overlays = centroide de l'Afrique en coordonnees geo
const AFRICA_GEO_CENTER = [20, 0]; // lon, lat

function translateFeatureToAfrica(feature) {
  // Calcule le centroide geographique du pays
  const centroid = geoCentroid(feature);
  const dLon = AFRICA_GEO_CENTER[0] - centroid[0];
  const dLat = AFRICA_GEO_CENTER[1] - centroid[1];

  // Translate toutes les coordonnees du GeoJSON
  function translateCoords(coords) {
    if (typeof coords[0] === "number") {
      // Point simple
      return [coords[0] + dLon, coords[1] + dLat];
    }
    return coords.map(translateCoords);
  }

  function translateGeometry(geom) {
    if (!geom) return geom;
    if (geom.type === "Point") {
      return { ...geom, coordinates: translateCoords(geom.coordinates) };
    }
    if (geom.type === "MultiPolygon" || geom.type === "Polygon" ||
        geom.type === "LineString" || geom.type === "MultiLineString" ||
        geom.type === "MultiPoint") {
      return { ...geom, coordinates: translateCoords(geom.coordinates) };
    }
    if (geom.type === "GeometryCollection") {
      return { ...geom, geometries: geom.geometries.map(translateGeometry) };
    }
    return geom;
  }

  return {
    ...feature,
    geometry: translateGeometry(feature.geometry),
  };
}

function computeOverlay(ids, label, customFeature = null) {
  const feat = customFeature ?? featureFromIds(ids);
  if (!feat) return null;

  // Translater le pays vers lat=0 (latitude Afrique) avant projection
  const translated = translateFeatureToAfrica(feat);

  const d = pathGen(translated) ?? "";
  const bounds = pathGen.bounds(translated);
  if (!bounds) return null;

  const [[x0, y0], [x1, y1]] = bounds;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const w  = x1 - x0;
  const h  = y1 - y0;

  // Offset pour centrer exactement sur le centre pixel de l'Afrique
  const dx = africaCX - cx;
  const dy = africaCY - cy;

  console.log(`${label.padEnd(12)} : w=${w.toFixed(0)} h=${h.toFixed(0)} | offset (${dx.toFixed(0)}, ${dy.toFixed(0)})`);

  return { label, path: d, cx, cy, w, h, dx, dy };
}

// USA : utiliser le fichier 48 etats contigus (Alaska/Hawaii exclus)
const usa    = computeOverlay(null, "USA",    usa48);
const china  = computeOverlay(CHINA_IDS,  "Chine");
const india  = computeOverlay(INDIA_IDS,  "Inde");
const europe = computeOverlay(EUROPE_IDS, "Europe");

// ---------------------------------------------------------------------------
// Tous les pays du monde pour la carte de fond
// ---------------------------------------------------------------------------

const worldPaths = allFeatures.map((f) => ({
  id:   f.id,
  d:    pathGen(f) ?? "",
}));

// IDs africains pour coloration differenciee
const africaIdSet = new Set(AFRICA_IDS);
const africaPaths = allFeatures
  .filter((f) => africaIdSet.has(Number(f.id)))
  .map((f) => ({ id: f.id, d: pathGen(f) ?? "" }));

// ---------------------------------------------------------------------------
// Output JSON
// ---------------------------------------------------------------------------

const output = {
  meta: {
    width: WIDTH,
    height: HEIGHT,
    projection: "geoEqualEarth",
    center: [20, 0],
    scale: 520,
  },
  africa: {
    cx: africaCX,
    cy: africaCY,
    w:  africaEntry?.w,
    h:  africaEntry?.h,
    path: africaEntry?.path,
    paths: africaPaths,
  },
  overlays: { usa, china, india, europe },
  world: { paths: worldPaths },
};

const outPath = "src/projects/souverain/vraie-taille-afrique/geo-data-equalarea.json";
fs.writeFileSync(outPath, JSON.stringify(output));
console.log(`\nOutput: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
