// Coordonnees geo dediees "Gazoduc AAGP vs TSGP" — verifiees depuis NOTRE GeoJSON reel
// (public/_rnd/vox-repro/countries-110m.json, centroides d3.geoCentroid), pas inventees.
// Meme esprit que GEO dans _rnd/d3-16x9/geoArc.ts, mais fichier dedie a cet episode
// pour ne pas polluer le socle partage Soudan.

import type { LonLat } from "../../_rnd/d3-16x9/geoArc";

export const GAZODUC_GEO = {
  // Point source precis : delta du Niger, embouchure golfe de Guinee (pas le centroide pays).
  deltaNiger: [6.5, 5.0] as LonLat,
  nigeriaCenter: [7.99, 9.54] as LonLat,

  // Destinations des 2 tracés.
  marocCenter: [-8.69, 29.82] as LonLat,
  algerieCenter: [2.61, 28.09] as LonLat,

  // Pays intermediaires TSGP.
  nigerCenter: [9.27, 17.34] as LonLat,

  // Pays du tracé côtier AAGP (ordre géographique Nigeria -> Maroc le long de la côte).
  beninCenter: [2.32, 9.31] as LonLat,
  ghanaCenter: [-1.23, 7.95] as LonLat,
  coteIvoireCenter: [-5.55, 7.62] as LonLat,
  senegalCenter: [-14.47, 14.5] as LonLat,
  mauritanieCenter: [-10.35, 20.18] as LonLat,

  // Europe (destination finale du gaz, cible symbolique de l'arc unique avant le split).
  europeSud: [-3.5, 40.0] as LonLat, // péninsule ibérique, approx pour l'arc symbolique de l'état 3

  // Sierra Leone : lieu de signature AAGP (19 juillet 2026, Freetown) — mentionné Acte 2, pas Acte 1.
  sierraLeoneCenter: [-11.8, 8.53] as LonLat,
};
