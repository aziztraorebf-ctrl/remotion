/**
 * SoudanMouvementTest — valide la DERNIÈRE brique : les jetons qui se DÉPLACENT sur la carte avec
 * SILLAGE derrière eux (effet AES "le jeton bouge, la scène trace derrière"), + highlight d'état au
 * passage + flèche de manœuvre. Si ça passe, le socle carte Soudan est validé à 100%.
 *
 * Séquence 14s :
 *  - Hemeti (RSF, rouge) apparaît à l'ouest (Darfour) et AVANCE vers le centre, sillage rouge derrière.
 *    Au passage : "El Fasher"/Nord-Darfour se trace en rouge (on nomme → ça se trace).
 *  - al-Burhan (SAF, bleu) apparaît à l'est et tient sa position (léger mouvement), Khartoum se trace bleu.
 *  - Une flèche de manœuvre RSF pousse de l'ouest vers le centre (SahelAttackArrow).
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SoudanWarMapEngine, CamKey, StateHighlight } from "./engine/SoudanWarMapEngine";
import { SoudanToken, SoudanTrail, Pt } from "./engine/soudanActors";

export const SOUDAN_MVT_FPS = 30;
export const SOUDAN_MVT_FRAMES = 420; // 14s

const CAM: CamKey[] = [
  { f: 0, lon: 29.8, lat: 15.3, zoom: 5.0 },
  { f: 420, lon: 30.3, lat: 15.25, zoom: 4.98 },
];

// trajet de Hemeti (RSF) : part du Darfour (ouest) et avance vers le centre
const HEMETI_WP: [number, number][] = [
  [24.9, 14.6], [26.6, 14.9], [28.4, 15.1], [29.6, 15.2],
];
// al-Burhan (SAF) : tient l'est, léger repositionnement vers Khartoum
const BURHAN_WP: [number, number][] = [
  [34.2, 15.9], [33.7, 15.7], [33.3, 15.6],
];

const HEMETI_APPEAR = 30;
const BURHAN_APPEAR = 90;

// interpole une position le long d'un chemin de waypoints selon un t 0..1
function alongPath(wp: [number, number][], t: number): [number, number] {
  const clamped = Math.min(1, Math.max(0, t));
  const seg = clamped * (wp.length - 1);
  const i = Math.min(wp.length - 2, Math.floor(seg));
  const f = seg - i;
  return [wp[i][0] + (wp[i + 1][0] - wp[i][0]) * f, wp[i][1] + (wp[i + 1][1] - wp[i][1]) * f];
}

const HIGHLIGHTS: StateHighlight[] = [
  { state: "North Darfur", faction: "rsf", drawAt: 45, drawFrames: 28, holdFrames: 200, fadeFrames: 40 },
  { state: "Khartoum", faction: "saf", drawAt: 110, drawFrames: 28, holdFrames: 180, fadeFrames: 40 },
];

export const SoudanMouvementTest: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SoudanWarMapEngine camKeys={CAM} highlights={HIGHLIGHTS} showNationalBorder stateLineOpacity={0}>
      {(proj) => {
        const { width, height } = { width: 1920, height: 1080 };
        // position + sillage (queue de positions récentes) de chaque jeton
        // le sillage échantillonne les positions sur une LARGE fenêtre de frames (SILLAGE_SPAN),
        // sinon (mouvement lent) tous les points se superposent et la trace est invisible.
        const SILLAGE_SPAN = 30; // frames de traîne
        const buildTrail = (wp: [number, number][], moveStart: number, moveEnd: number): { pos: Pt | null; trail: Pt[] } => {
          const tOf = (f: number) => interpolate(f, [moveStart, moveEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const pos = proj(alongPath(wp, tOf(frame)));
          const trail: Pt[] = [];
          // n'afficher le sillage que si le jeton est EN MOUVEMENT (t entre 0 et 1)
          const moving = frame > moveStart + 4 && frame < moveEnd + 8;
          if (moving) {
            for (let k = SILLAGE_SPAN; k >= 2; k -= 3) {
              const pp = proj(alongPath(wp, tOf(frame - k)));
              if (pp) trail.push(pp);
            }
            const cur = proj(alongPath(wp, tOf(frame)));
            if (cur) trail.push(cur);
          }
          return { pos, trail };
        };

        // mouvements RESSERRÉS/rapides (poussée nette, pas un glissement mou) → sillage franc et lisible
        const hemeti = buildTrail(HEMETI_WP, HEMETI_APPEAR + 20, HEMETI_APPEAR + 110);
        const burhan = buildTrail(BURHAN_WP, BURHAN_APPEAR + 15, BURHAN_APPEAR + 80);

        return (
          <>
            {/* sillages (sous les jetons) */}
            <SoudanTrail trail={hemeti.trail} faction="rsf" width={width} height={height} />
            <SoudanTrail trail={burhan.trail} faction="saf" width={width} height={height} />
            {/* jetons */}
            {hemeti.pos && <SoudanToken pos={hemeti.pos} faction="rsf" frame={frame} appear={HEMETI_APPEAR} label="Hemeti" />}
            {burhan.pos && <SoudanToken pos={burhan.pos} faction="saf" frame={frame} appear={BURHAN_APPEAR} label="al-Burhan" />}
          </>
        );
      }}
    </SoudanWarMapEngine>
  );
};

export default SoudanMouvementTest;
