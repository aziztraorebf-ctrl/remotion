// aesGeo — projection fixe + paths projetes pour le Short "L'AES en 90 secondes".
// Un seul fitExtent (bbox trio + Libye), calcule une fois. Tous les panels consomment ces paths.
// Rings reels lon/lat depuis warmap/parties/sahelCountries.ts (deja decimes, zero fetch).
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
} from "../../parties/sahelCountries";

export const W = 1080;
export const H = 1920;

const ringToFeature = (ring: Ring) => ({
  type: "Feature" as const,
  properties: {},
  geometry: { type: "Polygon" as const, coordinates: [ring] },
});

const fcOf = (rings: Ring[]) => ({
  type: "FeatureCollection" as const,
  features: rings.map(ringToFeature),
});

export const approxLen = (d: string) => (d.match(/[MLC]/g)?.length ?? 60) * 14;

// Coordonnees reelles (lon, lat) des villes/points cles du recit.
export const CITIES = {
  bamako: [-8.0, 12.65] as [number, number],
  ouagadougou: [-1.52, 12.37] as [number, number],
  niamey: [2.11, 13.51] as [number, number],
  gao: [-0.04, 16.27] as [number, number],
  tombouctou: [-3.0, 16.77] as [number, number],
  kidal: [1.41, 18.44] as [number, number],
  // point source de la contagion cote libyen (sud Libye)
  libyeSud: [15.0, 24.5] as [number, number],
  // centroides approx pour ancrer flux/labels
  nordMali: [1.5, 19.0] as [number, number],
};

export type CountryPath = {
  name: string;
  d: string;
  len: number;
  cx: number;
  cy: number;
  // bounding box projetee [[x0,y0],[x1,y1]] — pour remplir toute la forme (bandes drapeau)
  bbox: [[number, number], [number, number]];
};

export type AesGeo = {
  projection: GeoProjection;
  project: (coord: [number, number]) => [number, number];
  mali: CountryPath;
  burkina: CountryPath;
  niger: CountryPath;
  libye: CountryPath;
  // pays cotiers CEDEAO (menace) — paths projetes, contour fantome
  cedeao: CountryPath[];
  // centre + zoom du bloc trio (pour cadrer le trio plein ecran quand la Libye est absente)
  trioCenter: [number, number];
  trioZoom: number;
};

let _cache: AesGeo | null = null;

export function getAesGeo(): AesGeo {
  if (_cache) return _cache;

  const trio = [MALI_RING, NIGER_RING, BURKINA_RING];
  const all = [...trio, LIBYE_RING];

  // bbox fixe englobant trio + Libye. AGRANDIE (sous-titres compacts -> espace libere a exploiter).
  // Marges laterales serrees (0.03) + zone verticale large (0.10 -> 0.80) : la carte occupe presque
  // toute la largeur et bien plus de hauteur. Cadre FIXE (camera fixe, retour Aziz).
  const projection = geoMercator().fitExtent(
    [
      [W * 0.03, H * 0.10],
      [W * 0.97, H * 0.80],
    ],
    fcOf(all) as any
  );
  const path = geoPath(projection);

  const mk = (name: string, ring: Ring): CountryPath => {
    const d = path(ringToFeature(ring) as any) || "";
    // centroide + bounding box projetee (min/max des sommets)
    let sx = 0, sy = 0, x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [lon, lat] of ring) {
      const p = projection([lon, lat]);
      if (p) {
        sx += p[0]; sy += p[1];
        x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]);
        x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]);
      }
    }
    return { name, d, len: approxLen(d), cx: sx / ring.length, cy: sy / ring.length, bbox: [[x0, y0], [x1, y1]] };
  };

  const mali = mk("Mali", MALI_RING);
  const burkina = mk("Burkina Faso", BURKINA_RING);
  const niger = mk("Niger", NIGER_RING);

  // Bounding box du bloc TRIO (Mali+Burkina+Niger) dans l'espace projete — sert a calculer le zoom qui
  // fait REMPLIR l'ecran au trio quand la Libye est absente (0-14s).
  const trioPath = geoPath(projection);
  const trioBounds = trioPath.bounds(fcOf(trio) as any) as [[number, number], [number, number]];
  const trioW = trioBounds[1][0] - trioBounds[0][0];
  const trioH = trioBounds[1][1] - trioBounds[0][1];
  const trioCenter: [number, number] = [
    (trioBounds[0][0] + trioBounds[1][0]) / 2,
    (trioBounds[0][1] + trioBounds[1][1]) / 2,
  ];
  // scale pour que le trio remplisse ~96% de la largeur OU ~52% de la hauteur (le plus contraignant).
  // Le trio est un bloc HORIZONTAL : la largeur contraint. On le laisse toucher presque les bords lateraux.
  const trioZoom = Math.min((W * 0.96) / trioW, (H * 0.52) / trioH);

  _cache = {
    projection,
    project: (coord) => {
      const p = projection(coord);
      return p ? [p[0], p[1]] : [0, 0];
    },
    mali,
    burkina,
    niger,
    libye: mk("Libye", LIBYE_RING),
    cedeao: [
      mk("Benin", BENIN_RING),
      mk("Nigeria", NIGERIA_RING),
      mk("Ghana", GHANA_RING),
      mk("Cote d'Ivoire", COTE_IVOIRE_RING),
    ],
    trioCenter,
    trioZoom,
  };
  return _cache;
}

// ===== CAMERA frame-driven — DECISION Aziz : quasi-fixe + 2 gestes motives + respiration subtile.
// - Phase TRIO (0 -> tLibye) : la carte est zoomee sur le trio (scale = trioZoom) => trio REMPLIT l'ecran.
// - Phase LIBYE (tLibye -> +dur) : DEZOOM doux (scale -> 1.0) + recentrage => la Libye entre, cadre complet.
// - Respiration TRES subtile en continu (scale *1.012 lent, monotone — PAS d'oscillation avant-arriere).
// Ce n'est PAS un pan/travelling permanent : 2 mouvements motives seulement, sinon quasi-fixe.
export type Cam = { scale: number; tx: number; ty: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function getCamera(
  frame: number,
  geo: AesGeo,
  opts?: { tLibye?: number; dur?: number; totalFrames?: number }
): Cam {
  const zoomStart = geo.trioZoom; // calcule pour que le trio remplisse l'ecran
  const tLibye = opts?.tLibye ?? 13.3 * 30; // debut du dezoom (arrivee Libye ~13.3s)
  const dur = opts?.dur ?? 2.4 * 30;
  const totalFrames = opts?.totalFrames ?? 1080;

  // Cible du cadrage : centre trio (phase 1) -> centre du cadre complet (phase 2).
  const cxStart = geo.trioCenter[0];
  const cyStart = geo.trioCenter[1];
  const cxEnd = W / 2;
  const cyEnd = H * 0.44;

  // respiration subtile MONOTONE (un seul aller tres lent sur toute la duree, pas de retour).
  const breath = 1 + 0.012 * (frame / totalFrames);

  let p = 0; // progression du dezoom 0->1
  if (frame >= tLibye) p = Math.min(1, (frame - tLibye) / dur);
  const e = easeInOut(p);

  const scale = lerp(zoomStart, 1.0, e) * breath;
  const cx = lerp(cxStart, cxEnd, e);
  const cy = lerp(cyStart, cyEnd, e);

  // translate pour ancrer (cx,cy). Phase trio : ancre plus HAUT (0.37) = trio dans le tiers sup-centre,
  // vide en bas pour les sous-titres. Phase Libye : redescend vers 0.44 (cadre complet centre).
  const anchorX = W / 2;
  const anchorY = lerp(H * 0.37, H * 0.44, e);
  const tx = anchorX - cx * scale;
  const ty = anchorY - cy * scale;

  return { scale, tx, ty };
}

// CAMERA TRIO FIXE — pour la partie 2 (la Libye a fini son role, on recentre/zoome sur le trio).
// Cadre le trio plein ecran, centre-haut (zone sous-titres en bas), respiration subtile. Stable.
export function getTrioCamera(frame: number, geo: AesGeo, opts?: { totalFrames?: number; zoomBoost?: number }): Cam {
  const totalFrames = opts?.totalFrames ?? 1680;
  const boost = opts?.zoomBoost ?? 1.08; // un peu plus serre que la 1re moitie (plus de detail, retour Aziz)
  const breath = 1 + 0.01 * (frame / totalFrames);
  const scale = geo.trioZoom * boost * breath;
  const anchorX = W / 2;
  const anchorY = H * 0.40;
  const tx = anchorX - geo.trioCenter[0] * scale;
  const ty = anchorY - geo.trioCenter[1] * scale;
  return { scale, tx, ty };
}
