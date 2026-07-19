// sahelFlatGeo — carte plate Sahel en 16:9 (D3 geoMercator), pour le proto "jetons + dezoom".
// Meme logique que aesGeo (Short vertical) mais cadre 1920x1080 + camera scale/tx/ty qui DEZOOME.
// Une seule projection Mercator, paths pre-projetes ; jetons ancres via project([lon,lat]).
import { geoMercator, geoPath, type GeoProjection } from "d3-geo";
import {
  MALI_RING,
  NIGER_RING,
  BURKINA_RING,
  LIBYE_RING,
  BENIN_RING,
  NIGERIA_RING,
  GHANA_RING,
  COTE_IVOIRE_RING,
  type Ring,
} from "../../warmap/parties/sahelCountries";

export const W = 1920;
export const H = 1080;

const ringToFeature = (ring: Ring) => ({
  type: "Feature" as const,
  properties: {},
  geometry: { type: "Polygon" as const, coordinates: [ring] },
});
const fcOf = (rings: Ring[]) => ({
  type: "FeatureCollection" as const,
  features: rings.map(ringToFeature),
});

export type CountryPath = { name: string; d: string; cx: number; cy: number };
export type SahelFlat = {
  projection: GeoProjection;
  project: (c: [number, number]) => [number, number];
  trio: CountryPath[];
  voisins: CountryPath[];
  trioCenter: [number, number]; // en espace projete (base scale=1)
  trioZoom: number; // scale pour remplir le trio
};

let _cache: SahelFlat | null = null;

export function getSahelFlat(): SahelFlat {
  if (_cache) return _cache;

  const trioRings: [string, Ring][] = [
    ["Mali", MALI_RING],
    ["Burkina Faso", BURKINA_RING],
    ["Niger", NIGER_RING],
  ];
  const voisinRings: [string, Ring][] = [
    ["Libye", LIBYE_RING],
    ["Benin", BENIN_RING],
    ["Nigeria", NIGERIA_RING],
    ["Ghana", GHANA_RING],
    ["Cote d'Ivoire", COTE_IVOIRE_RING],
  ];

  // fitExtent englobant TOUT (trio + voisins + Libye) => quand on dezoome, tout tient dans le cadre.
  const allRings = [...trioRings, ...voisinRings].map(([, r]) => r);
  const projection = geoMercator().fitExtent(
    [
      [W * 0.05, H * 0.08],
      [W * 0.95, H * 0.92],
    ],
    fcOf(allRings) as any
  );
  const path = geoPath(projection);

  const mk = ([name, ring]: [string, Ring]): CountryPath => {
    const d = path(ringToFeature(ring) as any) || "";
    let sx = 0, sy = 0;
    for (const [lon, lat] of ring) {
      const p = projection([lon, lat]);
      if (p) { sx += p[0]; sy += p[1]; }
    }
    return { name, d, cx: sx / ring.length, cy: sy / ring.length };
  };

  const trio = trioRings.map(mk);
  const voisins = voisinRings.map(mk);

  // centre du trio en espace projete
  const trioBounds = geoPath(projection).bounds(fcOf(trioRings.map(([, r]) => r)) as any) as [[number, number], [number, number]];
  const trioW = trioBounds[1][0] - trioBounds[0][0];
  const trioH = trioBounds[1][1] - trioBounds[0][1];
  const trioCenter: [number, number] = [
    (trioBounds[0][0] + trioBounds[1][0]) / 2,
    (trioBounds[0][1] + trioBounds[1][1]) / 2,
  ];
  // zoom pour que le trio remplisse ~78% de la largeur / ~78% de la hauteur (le plus contraignant)
  const trioZoom = Math.min((W * 0.78) / trioW, (H * 0.78) / trioH);

  _cache = {
    projection,
    project: (c) => {
      const p = projection(c);
      return p ? [p[0], p[1]] : [0, 0];
    },
    trio,
    voisins,
    trioCenter,
    trioZoom,
  };
  return _cache;
}

// Camera scale/tx/ty : on part ZOOME sur le trio (scale=trioZoom) et on DEZOOME vers 1.0 (contexte regional).
export type Cam = { scale: number; tx: number; ty: number };
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function getDezoomCam(
  frame: number,
  flat: SahelFlat,
  opts: { start: number; dur: number }
): Cam {
  const p = Math.min(1, Math.max(0, (frame - opts.start) / opts.dur));
  const e = easeInOut(p);
  const scale = flat.trioZoom + (1.0 - flat.trioZoom) * e;

  // ancrage : au debut on centre le trio ; en dezoomant on garde le trio au centre du cadre.
  const cx = flat.trioCenter[0];
  const cy = flat.trioCenter[1];
  const tx = W / 2 - cx * scale;
  const ty = H / 2 - cy * scale;
  return { scale, tx, ty };
}
