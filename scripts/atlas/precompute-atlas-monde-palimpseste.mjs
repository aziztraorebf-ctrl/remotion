// Precompute SVG paths (d3-geo geoEqualEarth) pour le proto carte-monde
// "Palimpseste Mondial" — Afrique en premier plan colore, reste du monde en
// silhouette taupe sepia en retrait. Format 16:9 (1920x1080).
//
// Source geo : world-atlas@2 countries-110m.json (Natural Earth 110m standard,
// telecharge depuis cdn.jsdelivr.net, copie en dur dans public/_shared/geo-data/world/
// pour reproductibilite). 177 pays, resolution adaptee a une vue monde entier.

import fs from "node:fs";
import path from "node:path";
import { geoEqualEarth, geoPath } from "d3-geo";
import * as topojson from "topojson-client";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "../..");
const topo = JSON.parse(
  fs.readFileSync(`${ROOT}/public/_shared/geo-data/world/world-atlas-countries-110m.json`, "utf8")
);
const worldGeo = topojson.feature(topo, topo.objects.countries);

const W = 1920;
const H = 1080;

// 50 pays africains continentaux presents dans le dataset 110m (codes ISO 3166-1
// numeriques). Les micro-etats insulaires (Cap-Vert, Sao Tome, Seychelles, Maurice,
// Comores) sont absents de cette resolution — normal, pas une omission.
const AFRICA_IDS = new Set([
  "012", "024", "072", "108", "120", "140", "148", "178", "180", "204",
  "226", "231", "232", "262", "266", "270", "288", "324", "384", "404",
  "426", "430", "434", "450", "454", "466", "478", "504", "508", "516",
  "562", "566", "624", "646", "686", "694", "706", "710", "716", "728",
  "729", "732", "748", "768", "788", "800", "818", "834", "854", "894",
]);

// geoEqualEarth : projection moderne a surfaces respectees (esprit Gall-Peters/
// MacArthur, sans les distorsions angulaires extremes du vrai Peters). Centree
// Afrique via rotate (decale la longitude de reference vers l'Afrique).
const proj = geoEqualEarth()
  .rotate([-20, 0]) // recentre l'Afrique dans le cadre plutot que le Pacifique
  .fitExtent(
    [
      [40, 60],
      [1880, 1020],
    ],
    worldGeo
  );
const pathFor = geoPath(proj);

const countries = [];
for (const feat of worldGeo.features) {
  const id = String(feat.id).padStart(3, "0");
  const d = pathFor(feat);
  if (!d) continue;
  countries.push({ id, name: feat.properties.name, isAfrica: AFRICA_IDS.has(id), d });
}

// Contour du globe (sphere) pour le fond ocean — via geoPath({type: "Sphere"}).
const sphereD = pathFor({ type: "Sphere" });

const out = { width: W, height: H, sphereD, countries };

const outPath = `${ROOT}/public/_shared/geo-data/world/world-equalearth-africa-focus.json`;
fs.writeFileSync(outPath, JSON.stringify(out));

const africaCount = countries.filter((c) => c.isAfrica).length;
console.log(`Wrote ${countries.length} countries (${africaCount} Africa) to ${outPath}`);
