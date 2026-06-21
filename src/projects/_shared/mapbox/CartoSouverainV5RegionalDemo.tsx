/**
 * CartoSouverainV5RegionalDemo — le 3e MODE de la cible canonique : "regional-relief".
 * Cam BASSE (pitch ~50), zoom serre, qui cadre un GROUPE de pays voisins a hauteur de terrain
 * (l'angle "au ras" valide Aziz, type scene AES Mali/Burkina/Niger qui se colorient).
 * Meme cible CartoSouverainV5, meme registre navy/or — juste un reglage camera different.
 *
 * Les 3 presets de reference de la cible :
 *   1. flat          (pitch 0)   : vue large situation / top-down
 *   2. country-relief(pitch ~32) : zoom 1 pays, relief signature
 *   3. regional-relief(pitch ~50): cam basse, groupe de pays voisins a hauteur de terrain  ← CE FICHIER
 */
import React from "react";
import { CartoSouverainV5 } from "./CartoSouverainV5";

export const CartoSouverainV5RegionalDemo: React.FC = () => (
  <CartoSouverainV5
    focusIsos={["MLI", "BFA", "NER"]}
    camKeys={[
      // entree : un peu plus haute pour amorcer la descente
      { atProgress: 0.0, cam: { lon: 1.0, lat: 14.5, zoom: 4.2, pitch: 38, bearing: 0 } },
      // cam BASSE pitch fort, cadre le triangle AES a hauteur de terrain (vise plus au sud, perspective vers le nord)
      { atProgress: 0.5, cam: { lon: 0.5, lat: 13.2, zoom: 4.8, pitch: 52, bearing: 8 } },
      { atProgress: 1.0, cam: { lon: 1.5, lat: 13.0, zoom: 5.0, pitch: 54, bearing: 14 } },
    ]}
  />
);

export default CartoSouverainV5RegionalDemo;
