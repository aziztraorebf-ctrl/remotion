// Precompute geo data for Atlas Hannibal — Traversée des Alpes
// Zone narrative : Espagne → Rhône → Alpes → Italie du Nord
// 3 vues : contexte large Méd (Hook), pan sud (Beat 1-2), zoom Alpes (Beat 3-4)
// + POI : Carthago Nova, Rhône crossing, Col alpin, Plaine du Pô, Rome
// + Fleuve Rhône path SVG

import fs from "node:fs";
import { geoMercator, geoPath } from "d3-geo";

const NE = JSON.parse(
  fs.readFileSync(
    "/Users/clawdbot/Workspace/remotion/quebec-jacques-poc/data/ne_50m_countries.geojson",
    "utf8"
  )
);

const W = 1080;
const H = 1920;
const OUT = "/Users/clawdbot/Workspace/remotion/data/geo/hannibal-data.json";

// === PAYS MÉDITERRANÉE (filtre par bbox) ===
// On garde uniquement les pays dans la zone narrative
const MED_ISO = new Set([
  "ESP", "FRA", "ITA", "CHE", "AUT", "DEU", "PRT", "MAR", "DZA",
  "TUN", "LBY", "GRC", "HRV", "SVN", "MKD", "ALB", "MNE", "BIH",
  "SRB", "HUN", "SVK", "CZE", "POL", "UKR", "ROU", "BGR", "TUR",
  "LBN", "SYR", "ISR", "JOR", "EGY", "LUX", "BEL", "NLD", "GBR",
  "MCO", "AND", "SMR", "VAT", "MLT",
]);

function projectCountries(proj) {
  const path = geoPath(proj);
  const result = [];
  for (const feat of NE.features) {
    const iso = feat.properties.ISO_A3 || feat.properties.ADM0_A3 || "";
    if (!MED_ISO.has(iso)) continue;
    const d = path(feat);
    if (!d) continue;
    result.push({ iso, d });
  }
  return result;
}

function projectPOI(proj, pois) {
  const result = {};
  for (const [name, [lon, lat]] of Object.entries(pois)) {
    const [x, y] = proj([lon, lat]);
    result[name] = { lon, lat, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  }
  return result;
}

function bezierPath(proj, points) {
  const pts = points.map(p => proj(p));
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx1 = prev[0] + (curr[0] - prev[0]) * 0.4;
    const cpy1 = prev[1];
    const cpx2 = curr[0] - (curr[0] - prev[0]) * 0.4;
    const cpy2 = curr[1];
    d += ` C ${cpx1.toFixed(1)} ${cpy1.toFixed(1)}, ${cpx2.toFixed(1)} ${cpy2.toFixed(1)}, ${curr[0].toFixed(1)} ${curr[1].toFixed(1)}`;
  }
  return d;
}

// === POI HISTORIQUES (sources : Polybe, Tite-Live, Wikipedia) ===
const POI = {
  // Départ
  CARTHAGO_NOVA: [-0.98, 37.60],   // Carthagène, Espagne — QG Hannibal
  PYRENEES:       [1.75, 42.50],   // Traversée des Pyrénées
  // Rhône
  RHONE_CROSSING: [4.65, 43.87],   // Roquemaure / Beaucaire — zone de traversée probable
  MASSALIA:       [5.37, 43.30],   // Marseille (colonie grecque alliée de Rome)
  // Alpes
  COL_MONT_GENEVRE: [6.73, 44.93], // Col du Mont-Genèvre — hypothèse principale (Polybe)
  COL_CLAPIER:    [7.07, 45.10],   // Col de Clapier — hypothèse alternative (Tite-Live)
  // Italie
  PLAINE_PO:      [8.00, 45.00],   // Entrée plaine du Pô
  TICINUS:        [8.73, 45.15],   // Fleuve Tessin — première bataille en Italie
  // Référence
  ROME:           [12.49, 41.90],  // Rome
  CARTHAGE:       [10.34, 36.85],  // Carthage (Tunisie)
};

// === VUE 1 — CONTEXTE LARGE MÉD (Hook 5s) ===
// Vue d'ensemble Méditerranée occidentale — Espagne à Italie visible
const projContext = geoMercator()
  .center([5.0, 43.5])    // Centre Méditerranée occidentale
  .scale(1800)
  .translate([W / 2, H / 2 + 200]); // Décalé vers le bas pour montrer mer en bas

// === VUE 2 — PAN SUD (Beat 1-2 : Espagne + Rhône) ===
// Caméra au sud, Espagne visible, Pyrénées et Rhône en haut
const projSouth = geoMercator()
  .center([2.5, 41.5])    // Centre Espagne / Pyrénées
  .scale(2800)
  .translate([W / 2, H / 2 + 300]);

// === VUE 3 — ALPES FOCUS (Beat 3-4 : traversée montagne + descente) ===
// Zoom serré sur zone alpine — Rhône à Plaine du Pô
const projAlpes = geoMercator()
  .center([5.5, 44.8])    // Centre zone alpine
  .scale(5500)
  .translate([W / 2, H / 2]);

// === VUE 4 — ITALIE RÉVÉLATION (fin Beat 3 "Vous traverserez les murs de Rome") ===
// Dolly-out qui révèle l'Italie — scale intermédiaire
const projItalia = geoMercator()
  .center([7.5, 44.0])    // Entre Alpes et Plaine du Pô
  .scale(3800)
  .translate([W / 2, H / 2 + 100]);

// === ROUTE D'HANNIBAL (waypoints historiques) ===
const ROUTE_WAYPOINTS = [
  [-0.98, 37.60], // Carthago Nova
  [1.75, 42.50],  // Pyrénées
  [4.65, 43.87],  // Rhône crossing
  [6.73, 44.93],  // Col du Mont-Genèvre
  [7.50, 45.05],  // Descente Alpes
  [8.00, 45.00],  // Plaine du Pô
];

// === RHÔNE — path approximatif (source → mer) pour visualisation fleuve ===
const RHONE_PATH = [
  [7.59, 46.30],  // Lac Léman
  [5.73, 45.20],  // Lyon
  [4.83, 44.93],  // Valence
  [4.65, 43.87],  // Zone traversée Hannibal
  [4.63, 43.68],  // Beaucaire
  [4.64, 43.40],  // Delta Camargue
];

console.log("Projecting countries...");
const data = {
  meta: {
    generated: new Date().toISOString(),
    script: "precompute-hannibal.mjs",
    source: "ne_50m_countries.geojson",
    W, H, FPS: 30,
  },

  // Pays projetés dans les 4 vues
  views: {
    context: {
      countries: projectCountries(projContext),
      poi: projectPOI(projContext, POI),
      route: bezierPath(projContext, ROUTE_WAYPOINTS),
      rhone: bezierPath(projContext, RHONE_PATH),
      projection: { center: [5.0, 43.5], scale: 1800 },
    },
    south: {
      countries: projectCountries(projSouth),
      poi: projectPOI(projSouth, POI),
      route: bezierPath(projSouth, ROUTE_WAYPOINTS),
      rhone: bezierPath(projSouth, RHONE_PATH),
      projection: { center: [2.5, 41.5], scale: 2800 },
    },
    alpes: {
      countries: projectCountries(projAlpes),
      poi: projectPOI(projAlpes, POI),
      route: bezierPath(projAlpes, ROUTE_WAYPOINTS),
      rhone: bezierPath(projAlpes, RHONE_PATH),
      projection: { center: [5.5, 44.8], scale: 5500 },
    },
    italia: {
      countries: projectCountries(projItalia),
      poi: projectPOI(projItalia, POI),
      route: bezierPath(projItalia, ROUTE_WAYPOINTS),
      rhone: bezierPath(projItalia, RHONE_PATH),
      projection: { center: [7.5, 44.0], scale: 3800 },
    },
  },
};

// Vérification des POI clés dans la vue context
const ctxPoi = data.views.context.poi;
console.log("\nPOI vérification (vue context 1080×1920) :");
for (const [name, p] of Object.entries(ctxPoi)) {
  const inFrame = p.x >= 0 && p.x <= W && p.y >= 0 && p.y <= H;
  console.log(`  ${name.padEnd(20)} x=${Math.round(p.x).toString().padStart(5)} y=${Math.round(p.y).toString().padStart(5)}  ${inFrame ? "IN" : "OUT"}`);
}

const southPoi = data.views.south.poi;
console.log("\nPOI vérification (vue south) :");
for (const [name, p] of Object.entries(southPoi)) {
  const inFrame = p.x >= 0 && p.x <= W && p.y >= 0 && p.y <= H;
  console.log(`  ${name.padEnd(20)} x=${Math.round(p.x).toString().padStart(5)} y=${Math.round(p.y).toString().padStart(5)}  ${inFrame ? "IN" : "OUT"}`);
}

fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
const size = fs.statSync(OUT).size;
console.log(`\nSaved: ${OUT} (${(size / 1024).toFixed(1)} KB)`);
console.log(`Countries in context view: ${data.views.context.countries.length}`);
console.log(`Countries in alpes view: ${data.views.alpes.countries.length}`);
