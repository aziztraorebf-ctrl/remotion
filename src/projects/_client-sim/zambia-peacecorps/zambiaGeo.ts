// zambiaGeo — socle geo partage des 2 traitements du gabarit de choix Zambie (brief Peace Corps).
//
// Le brief client nomme 7 provinces et INTERDIT d'en montrer d'autres. Cette contrainte est
// portee ici par la DONNEE (inBrief) et non par le code de scene : une province hors brief
// n'a pas de path expose, elle ne peut donc pas etre dessinee par accident.
//
// GeoJSON genere par scripts/warmap/generate-zambia-admin1.py (Natural Earth 10m admin-1).
import { geoMercator, geoPath, type GeoProjection } from "d3-geo";

/** Chemin staticFile du GeoJSON (public/ est gitignore : charge au runtime, jamais importe). */
export const ZAMBIA_GEOJSON = "_shared/geo-data/zambia/zambia-admin1.geojson";

export const W = 1920;
export const H = 1080;

type ZambiaFeature = {
  type: "Feature";
  properties: {
    name: string;
    inBrief: boolean;
    briefOrder: number | null;
    centroidLon: number;
    centroidLat: number;
  };
  geometry: { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] };
};

export type ProvincePath = {
  name: string;
  /** path SVG de la province */
  d: string;
  /** centroide projete, pour ancrer le semis de points et les etiquettes */
  cx: number;
  cy: number;
  briefOrder: number;
  /** anneaux projetes en coordonnees ecran : servent au test point-dans-polygone du semis */
  rings: [number, number][][];
  /** boite englobante projetee [minX, minY, maxX, maxY] */
  bbox: [number, number, number, number];
};

export type ZambiaGeo = {
  /** contour national complet (les 10 provinces fusionnees visuellement par superposition) */
  outlineD: string;
  /** UNIQUEMENT les 7 provinces du brief, dans l'ordre narratif (Luapula en premier) */
  briefProvinces: ProvincePath[];
  project: (c: [number, number]) => [number, number];
};

export type ZambiaFeatureCollection = { features: ZambiaFeature[] };

/**
 * Construit le socle geo a partir du GeoJSON charge (fetch + staticFile cote scene).
 * ⛔ Pas de cache module-level : les 2 traitements partagent ce module, un cache global
 * ferait silencieusement resservir le cadrage du premier appelant.
 */
export function getZambiaGeo(FC: ZambiaFeatureCollection): ZambiaGeo {

  // fitExtent sur TOUT le pays (les 10 provinces) : le contour national doit rester
  // geographiquement juste meme si on ne met en avant que 7 provinces.
  const projection: GeoProjection = geoMercator().fitExtent(
    [
      [W * 0.30, H * 0.10],
      [W * 0.86, H * 0.92],
    ],
    FC as never
  );
  const path = geoPath(projection);

  const outlineD = FC.features.map((f) => path(f as never) || "").join(" ");

  const briefProvinces = FC.features
    .filter((f) => f.properties.inBrief)
    .sort((a, b) => (a.properties.briefOrder ?? 0) - (b.properties.briefOrder ?? 0))
    .map((f) => {
      const p = projection([f.properties.centroidLon, f.properties.centroidLat]);

      // Projeter tous les anneaux exterieurs en coordonnees ecran.
      const raw =
        f.geometry.type === "Polygon"
          ? [(f.geometry.coordinates as number[][][])[0]]
          : (f.geometry.coordinates as number[][][][]).map((poly) => poly[0]);
      const rings: [number, number][][] = raw.map((ring) =>
        ring
          .map((c) => projection([c[0], c[1]]))
          .filter((q): q is [number, number] => q !== null)
          .map((q) => [q[0], q[1]] as [number, number])
      );

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const ring of rings) {
        for (const [x, y] of ring) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }

      return {
        name: f.properties.name,
        d: path(f as never) || "",
        cx: p ? p[0] : 0,
        cy: p ? p[1] : 0,
        briefOrder: f.properties.briefOrder ?? 0,
        rings,
        bbox: [minX, minY, maxX, maxY] as [number, number, number, number],
      };
    });

  return {
    outlineD,
    briefProvinces,
    project: (c) => {
      const p = projection(c);
      return p ? [p[0], p[1]] : [0, 0];
    },
  };
}

// --- Jalons du brief client (volontaires Peace Corps en Zambie) ---
// Le gabarit ne couvre que 1995 -> 2005 (extrait, cf NEXT-ACTION : ne pas livrer tout le projet).
export const JALONS = [
  { annee: 1995, volontaires: 40 },
  { annee: 2005, volontaires: 220 },
] as const;

// Repartition des volontaires par province, par jalon.
// ⚠️ HYPOTHESE DE TRAVAIL, pas une donnee client : le brief ne precise pas si les points sont
// geolocalises au village ou repartis par province. Question posee dans la candidature.
// 1995 : implantation initiale, Luapula seule (indique par le brief comme point de depart).
// 2005 : extension a l'ensemble des 7 provinces nommees.
export const REPARTITION: Record<number, Record<string, number>> = {
  1995: {
    Luapula: 40,
  },
  2005: {
    Luapula: 42,
    "North-Western": 34,
    Eastern: 38,
    Western: 28,
    Northern: 32,
    Southern: 26,
    Lusaka: 20,
  },
};

/** Test point-dans-polygone (ray casting) sur les anneaux projetes. */
function dansProvince(x: number, y: number, rings: [number, number][][]): boolean {
  let inside = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
  }
  return inside;
}

/**
 * Semis de points DETERMINISTE contenu DANS le polygone de la province.
 *
 * Deterministe = meme entree, meme sortie a chaque render (contrainte Remotion :
 * Math.random() ferait scintiller les points d'une frame a l'autre).
 *
 * ⛔ Tirage par REJET dans la bbox, chaque point valide contre la geometrie reelle.
 * Une version anterieure semait dans un disque de rayon fixe autour du centroide :
 * les points debordaient des frontieres (mesure : provinces d'aires 1.83 a 5.69,
 * un rayon unique ne peut pas convenir). Le brief client INTERDIT de montrer une
 * autre province — un point hors frontiere est donc disqualifiant, pas cosmetique.
 */
export function semisDansProvince(
  province: ProvincePath,
  n: number
): { x: number; y: number }[] {
  let seed = 0;
  for (let i = 0; i < province.name.length; i++) {
    seed = (seed * 31 + province.name.charCodeAt(i)) % 2147483647;
  }
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  const [minX, minY, maxX, maxY] = province.bbox;
  const points: { x: number; y: number }[] = [];
  // Marge interieure : on ne colle pas la frontiere, l'oeil doit lire le point comme "dedans".
  const marge = 6;
  let essais = 0;
  const MAX_ESSAIS = n * 400;

  while (points.length < n && essais < MAX_ESSAIS) {
    essais++;
    const x = minX + rand() * (maxX - minX);
    const y = minY + rand() * (maxY - minY);
    if (!dansProvince(x, y, province.rings)) continue;
    // rejeter aussi ce qui est trop pres du bord
    if (
      !dansProvince(x - marge, y, province.rings) ||
      !dansProvince(x + marge, y, province.rings) ||
      !dansProvince(x, y - marge, province.rings) ||
      !dansProvince(x, y + marge, province.rings)
    ) {
      continue;
    }
    // Reserver un couloir autour de l'etiquette (posee au centroide) pour qu'elle reste lisible.
    if (Math.abs(y - province.cy) < 22 && Math.abs(x - province.cx) < 120) continue;
    points.push({ x, y });
  }
  return points;
}
