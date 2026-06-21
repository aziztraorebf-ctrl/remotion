/**
 * CartoSouverainV5Demo — la CIBLE CANONIQUE rendue (l'equivalent du render-v9 data-viz pour le carto).
 * Montre les 2 modes d'UNE meme cible :
 *   - mode FLAT (pitch 0) : vue large situation Afrique de l'Ouest
 *   - mode RELIEF (pitch 32) : zoom sur le Senegal (le relief signature valide Aziz)
 * Sert de reference a valider + de point de depart pour toute carte Souverain.
 */
import React from "react";
import { CartoSouverainV5 } from "./CartoSouverainV5";

export const CartoSouverainV5Demo: React.FC = () => (
  <CartoSouverainV5
    focusIsos={["SEN"]}
    camKeys={[
      // vue large flat : Afrique de l'Ouest, pitch 0 (situation)
      { atProgress: 0.0, cam: { lon: -8.0, lat: 13.0, zoom: 3.4, pitch: 0, bearing: 0 } },
      { atProgress: 0.35, cam: { lon: -10.0, lat: 13.5, zoom: 3.8, pitch: 0, bearing: 0 } },
      // bascule vers relief : zoom Senegal, pitch 32 (signature)
      { atProgress: 0.7, cam: { lon: -14.8, lat: 14.4, zoom: 5.6, pitch: 32, bearing: 8 } },
      { atProgress: 1.0, cam: { lon: -15.2, lat: 14.5, zoom: 6.0, pitch: 34, bearing: 12 } },
    ]}
  />
);

export default CartoSouverainV5Demo;
