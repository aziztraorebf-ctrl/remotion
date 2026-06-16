/**
 * HookAESActe1Proto — PROTOTYPE de hook pour l'ouverture de la War-Map Sahel AES.
 *
 * Remplace le cartouche statique "Tout a change en trois ans" par CrosshairLock (caméra serrée + pan),
 * calé sur la narration V5 reelle (les 3 verbes : chassent f145 / rompent f217 / quittent f286).
 * Audio = 20 premieres secondes de narration-v5-expressive (clip hook-test/v5-hook-20s.mp3).
 *
 * But : JUGER le hook isolé AVANT de decider comment l'integrer (concat au montage OU dans le moteur).
 * Carte parchemin AES (sahel-countries.geojson) = raccord exact avec le corps de l'Acte 1.
 *
 * Render via scripts/render-mapbox.sh (WebGL headless).
 */

import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { CrosshairLock } from "../_shared/hooks-lib/CrosshairLock";

export const HookAESActe1Proto: React.FC = () => {
  return (
    <AbsoluteFill>
      <CrosshairLock
        // cadrage AES (centre des 3 pays), camera serree + pan comme l'Acte 1 reel
        center={[-0.5, 15.2]}
        theme="parchment"
        focusIso={["MLI", "BFA", "NER"]}
        countriesGeoJson="_shared/geo-data/sahel/sahel-countries.geojson"
        camKeys={[
          { f: 0, lon: -1.8, lat: 16.2, zoom: 4.2 },   // installation : un peu large, le viseur cherche
          { f: 140, lon: -1.0, lat: 15.4, zoom: 4.55 }, // lock : resserre sur l'AES
          { f: 320, lon: 0.0, lat: 15.3, zoom: 4.6 },   // pan vers l'est pendant l'allumage
          { f: 600, lon: -0.3, lat: 15.3, zoom: 4.55 }, // pose sur la question
        ]}
        // viseur se verrouille a la fin de "trois pays ont tout change" (~f140)
        lockAt={140}
        // les 3 pays s'allument en cascade sur les 3 verbes : Mali f140 (chassent),
        // Burkina f212 (rompent ~f217), Niger f284 (quittent ~f286)
        litStagger={72}
        label="LE SAHEL"
        subLabel="TROIS PAYS, UNE RUPTURE"
        // la question est DEJA dans la voix V5 ("Comment est-ce possible ? pourquoi maintenant ?") ~f539
        question="COMMENT EST-CE POSSIBLE ?"
        durationFrames={600}
      />
      <Audio src={staticFile("_shared/audio/sahel-warmap/hook-test/v5-hook-20s.mp3")} />
    </AbsoluteFill>
  );
};

export default HookAESActe1Proto;
