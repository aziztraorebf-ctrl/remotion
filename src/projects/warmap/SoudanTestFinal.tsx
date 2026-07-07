/**
 * SoudanTestFinal — test de bout en bout avant la vraie construction. Valide :
 *  1. régions qui s'allument au nom et RESTENT allumées (cumul, couleur faction)
 *  2. jetons qui apparaissent pendant que les régions restent
 *  3. jeton qui se déplace → la région d'arrivée s'allume aussi (et reste)
 *  4. ZOOM plus serré sur le Soudan (moins de voisins) → lisibilité de l'action
 *  5. OBJET ISO 3D posé sur la carte (base militaire) → perspective iso tient-elle ?
 *  6. fin : jetons + régions + base disparaissent → RETOUR à l'état initial vide
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SoudanWarMapEngine, CamKey, StateHighlight } from "./engine/SoudanWarMapEngine";
import { SoudanToken, SoudanTrail, SoudanBase, Pt } from "./engine/soudanActors";

export const SOUDAN_TF_FPS = 30;
export const SOUDAN_TF_FRAMES = 600; // 20s

// ZOOM PLUS SERRÉ : le Soudan remplit davantage l'écran (zoom 5.5 vs 5.0), léger drift.
const CAM: CamKey[] = [
  { f: 0, lon: 29.5, lat: 14.8, zoom: 5.45 },
  { f: 300, lon: 30.2, lat: 15.0, zoom: 5.5 },
  { f: 600, lon: 29.8, lat: 14.9, zoom: 5.48 },
];

// régions qui s'allument au fil de l'action et RESTENT (fadeFrames 0), puis fade COLLECTIF à la fin.
const FADE_AT = 500; // toutes les régions s'estompent ensemble à f500 (retour état initial)
const hl = (state: string, faction: "rsf" | "saf" | "contested", drawAt: number): StateHighlight => ({
  state, faction, drawAt, drawFrames: 28, holdFrames: FADE_AT - drawAt - 28, fadeFrames: 40,
});
const HIGHLIGHTS: StateHighlight[] = [
  hl("North Darfur", "rsf", 45),      // "El Fasher / Nord-Darfour" — RSF
  hl("Southern Darfur", "rsf", 110),  // le Darfour s'étend
  hl("North Kordufan", "rsf", 250),   // Hemeti arrive au Kordofan → s'allume à l'arrivée
  hl("Khartoum", "saf", 180),         // al-Burhan tient Khartoum — SAF
];

// jeton Hemeti : part du Nord-Darfour, avance vers le Kordofan (mouvement resserré → sillage franc)
const HEMETI_WP: [number, number][] = [[25.0, 14.8], [27.0, 14.2], [29.5, 13.6], [30.5, 13.4]];
const HEMETI_APPEAR = 60;
const HEMETI_MOVE_START = 200;
const HEMETI_MOVE_END = 285; // arrive au Kordofan ~ quand North Kordufan s'allume (250)

const BURHAN_POS: [number, number] = [33.4, 15.6]; // tient l'est (Khartoum/Nil)
const BURHAN_APPEAR = 150;

// base ISO placée DÉGAGÉE (zone Nord vide) et plus GRANDE → vrai test de la perspective iso 3D
const BASE_POS: [number, number] = [29.5, 18.8]; // Northern, zone vide au nord
const BASE_APPEAR = 210;

function alongPath(wp: [number, number][], t: number): [number, number] {
  const c = Math.min(1, Math.max(0, t));
  const seg = c * (wp.length - 1);
  const i = Math.min(wp.length - 2, Math.floor(seg));
  const f = seg - i;
  return [wp[i][0] + (wp[i + 1][0] - wp[i][0]) * f, wp[i][1] + (wp[i + 1][1] - wp[i][1]) * f];
}

export const SoudanTestFinal: React.FC = () => {
  const frame = useCurrentFrame();
  // fade collectif des acteurs à la fin (retour état initial)
  const actorsFade = interpolate(frame, [FADE_AT, FADE_AT + 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SoudanWarMapEngine camKeys={CAM} highlights={HIGHLIGHTS} showNationalBorder stateLineOpacity={0}>
      {(proj) => {
        const width = 1920, height = 1080;
        const tOf = (f: number) => interpolate(f, [HEMETI_MOVE_START, HEMETI_MOVE_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const hemetiPos = proj(alongPath(HEMETI_WP, tOf(frame)));
        // sillage (fenêtre de frames, uniquement en mouvement)
        const trail: Pt[] = [];
        const moving = frame > HEMETI_MOVE_START + 3 && frame < HEMETI_MOVE_END + 8;
        if (moving) {
          for (let k = 30; k >= 2; k -= 3) {
            const pp = proj(alongPath(HEMETI_WP, tOf(frame - k)));
            if (pp) trail.push(pp);
          }
          if (hemetiPos) trail.push(hemetiPos);
        }
        const burhanPos = proj(BURHAN_POS);
        const basePos = proj(BASE_POS);

        return (
          <>
            <SoudanTrail trail={trail} faction="rsf" width={width} height={height} />
            {basePos && <SoudanBase pos={basePos} frame={frame} appear={BASE_APPEAR} sprite="base-fr-td" size={160} label="Base SAF" fade={actorsFade} />}
            {hemetiPos && frame < FADE_AT + 40 && (
              <div style={{ opacity: actorsFade }}>
                <SoudanToken pos={hemetiPos} faction="rsf" frame={frame} appear={HEMETI_APPEAR} label="Hemeti" />
              </div>
            )}
            {burhanPos && frame < FADE_AT + 40 && (
              <div style={{ opacity: actorsFade }}>
                <SoudanToken pos={burhanPos} faction="saf" frame={frame} appear={BURHAN_APPEAR} label="al-Burhan" />
              </div>
            )}
          </>
        );
      }}
    </SoudanWarMapEngine>
  );
};

export default SoudanTestFinal;
