// CartePanneauGeo — carte trio Sahel cadree dans la MOITIE GAUCHE d'un 16:9 (A5 : carte + panneau).
// La projection fitExtent ne remplit que la zone gauche [0..LEFT_W], laissant le flanc droit libre
// pour le panneau data. C'est ca que le 9:16 interdit : mettre carte et data COTE A COTE.
import { geoMercator, geoPath, type GeoProjection } from "d3-geo";
import { MALI_RING, NIGER_RING, BURKINA_RING, type Ring } from "../../warmap/parties/sahelCountries";

export const W = 1920;
export const H = 1080;
export const LEFT_W = 1150; // largeur de la zone carte (60%) ; le reste (770px) = panneau

const ringToFeature = (ring: Ring) => ({
  type: "Feature" as const, properties: {}, geometry: { type: "Polygon" as const, coordinates: [ring] },
});
const fcOf = (rings: Ring[]) => ({ type: "FeatureCollection" as const, features: rings.map(ringToFeature) });

export type CountryPath = { name: string; d: string; cx: number; cy: number };
export type CartePanneau = {
  project: (c: [number, number]) => [number, number];
  trio: CountryPath[];
};

let _cache: CartePanneau | null = null;

export function getCartePanneau(): CartePanneau {
  if (_cache) return _cache;
  const trioRings: [string, Ring][] = [
    ["Mali", MALI_RING],
    ["Burkina Faso", BURKINA_RING],
    ["Niger", NIGER_RING],
  ];
  // fitExtent sur la ZONE GAUCHE uniquement (marge haut/bas pour titre + respiration)
  const projection: GeoProjection = geoMercator().fitExtent(
    [
      [LEFT_W * 0.08, H * 0.16],
      [LEFT_W * 0.94, H * 0.90],
    ],
    fcOf(trioRings.map(([, r]) => r)) as any
  );
  const path = geoPath(projection);
  const mk = ([name, ring]: [string, Ring]): CountryPath => {
    const d = path(ringToFeature(ring) as any) || "";
    let sx = 0, sy = 0;
    for (const [lon, lat] of ring) { const p = projection([lon, lat]); if (p) { sx += p[0]; sy += p[1]; } }
    return { name, d, cx: sx / ring.length, cy: sy / ring.length };
  };
  _cache = {
    project: (c) => { const p = projection(c); return p ? [p[0], p[1]] : [0, 0]; },
    trio: trioRings.map(mk),
  };
  return _cache;
}

// faits reels AES (ordre chrono des coups d'Etat + population Banque mondiale ~2023, arrondie)
export const COUPS = [
  { pays: "Mali", annee: 2020, pop: 22.6 }, // millions
  { pays: "Burkina Faso", annee: 2022, pop: 22.7 },
  { pays: "Niger", annee: 2023, pop: 25.3 },
] as const;
export const POP_TOTALE = 70.6; // millions cumules (arrondi)
