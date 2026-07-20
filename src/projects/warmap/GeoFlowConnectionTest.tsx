/**
 * GeoFlowConnectionTest — valide le nouveau composant GeoFlowConnection en isolation, AVANT intégration
 * au beat réel de l'Acte 3. Cas simple : Darfour (Jebel Amer) → Dubaï, aller-retour avec transformation.
 *
 * Séquence 12s (360f @30) :
 *  - f0-40   : caméra se pose, mine Darfour visible (SoudanBase, sprite existant mine-or-td)
 *  - f40-160 : tracé + marqueur DORÉ voyagent Darfour → Dubaï (courbe via point intermédiaire)
 *  - f160-190: le marqueur "s'attarde" à Dubaï, bascule couleur doré → gris-métal (markerColorTransition)
 *  - f190-310: le marqueur repart en sens inverse Dubaï → Darfour (2e instance, waypoints inversés)
 *  - f310-360: persistAfterArrival — le tracé aller reste visible en trace fantôme (opacity réduite)
 *
 * Si ce test passe (marqueur lisible, transformation nette, trace fantôme discrète), le composant est
 * prêt pour SoudanActe3.tsx (beats 3-4).
 */
import React from "react";
import mapboxgl from "mapbox-gl";
import { useCurrentFrame, interpolate } from "remotion";
import { SoudanWarMapEngine, CamKey } from "./engine/SoudanWarMapEngine";
import { SoudanBase } from "./engine/soudanActors";
import { GeoFlowConnection } from "./_shared/GeoFlowConnection";
import { useClipFlags, ClipFlagsLayer, ClipFlag } from "../_shared/mapbox/useClipFlags";

// drapeau EAU qui s'allume à l'arrivée du marqueur (persiste ensuite, jamais de fade-out —
// cf retour Aziz 2026-07-09 : compense le voile khaki qui s'aplatit au dézoom large).
const FLAGS: ClipFlag[] = [
  { iso: "ae", geoNames: ["United Arab Emirates"], flagFile: "ae.png", at: 160, bgColor: "#00732F" },
];

export const GFC_TEST_FPS = 30;
export const GFC_TEST_FRAMES = 360;

const JEBEL_AMER: [number, number] = [23.706, 13.834];
const DUBAI: [number, number] = [55.27, 25.2];
// courbe accentuée : point de contrôle décalé au-dessus (nord) de la ligne droite Darfour-Dubaï,
// pour un arc visible plutôt qu'un quasi-segment (les 2 points intermédiaires du 1er jet étaient
// trop proches de la droite AB, la courbe ne se voyait presque pas — corrigé après revue frame).
const WAYPOINTS_ALLER: [number, number][] = [JEBEL_AMER, [30, 20.5], [38, 24.5], [47, 25.5], DUBAI];
const WAYPOINTS_RETOUR: [number, number][] = [DUBAI, [47, 25.5], [38, 24.5], [30, 20.5], JEBEL_AMER];

// caméra large pour voir Darfour + Dubaï simultanément (test du cas le plus contraignant du breakdown)
const CAM: CamKey[] = [
  { f: 0, lon: 32, lat: 18, zoom: 3.6 },
  { f: 40, lon: 38, lat: 20, zoom: 3.2 },
  { f: 360, lon: 38, lat: 20, zoom: 3.2 },
];

const clamp01 = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const GeoFlowConnectionTest: React.FC = () => {
  const frame = useCurrentFrame();

  // trajet aller : f40 -> f160
  const allerT = interpolate(frame, [40, 160], [0, 1], clamp01);
  // pause + transformation à Dubaï : f160 -> f190 (couleur bascule au milieu de cette fenêtre)
  // trajet retour : f190 -> f310
  const retourT = interpolate(frame, [190, 310], [0, 1], clamp01);

  const showAller = frame >= 40 && frame < 310;
  const showRetour = frame >= 190;

  return (
    <SoudanWarMapEngine camKeys={CAM} showNationalBorder stateLineOpacity={0}>
      {(proj, mapRef) => {
        return (
          <>
            {/* mine Darfour (objet isométrique déjà validé Acte 1) */}
            <SoudanBase pos={proj(JEBEL_AMER) ?? { x: 0, y: 0 }} frame={frame} appear={10} sprite="mine-or-td" size={64} />

            {/* drapeau EAU — teste l'ajout du breakdown v2 (apparaît à l'arrivée du marqueur, reste ensuite) */}
            {mapRef && <FlagLayer mapRef={mapRef} frame={frame} />}

            {/* Dubaï : placeholder simple (pas encore le sprite neuf, juste un repère visuel pour le test) */}
            {frame >= 30 && (
              <div style={{
                position: "absolute",
                left: (proj(DUBAI)?.x ?? 0) - 8, top: (proj(DUBAI)?.y ?? 0) - 8,
                width: 16, height: 16, borderRadius: "50%",
                background: "#8A6F3A", border: "2px solid #F2E5C8", opacity: 0.85,
              }} />
            )}

            {/* TRAJET ALLER : doré, tracé + marqueur ensemble (comportement simple) */}
            {showAller && (
              <GeoFlowConnectionInner
                waypoints={WAYPOINTS_ALLER}
                progress={allerT}
                markerProgress={allerT}
                lineColor="#D4A574"
                markerColor="#D4A574"
                dashOffsetFrame={frame}
                persistAfterArrival={frame >= 310}
                proj={proj}
              />
            )}

            {/* TRAJET RETOUR : le marqueur repart, transformation doré->gris-métal au départ (simule "s'attarde à Dubaï") */}
            {showRetour && (
              <GeoFlowConnectionInner
                waypoints={WAYPOINTS_RETOUR}
                progress={1} // tracé déjà entièrement dessiné (même chemin que l'aller, sens inverse)
                markerProgress={retourT}
                lineColor="#8A8F94"
                markerColor="#8A8F94"
                markerColorTransition={{ beforeT: 0.02, colorBefore: "#D4A574", colorAfter: "#8A8F94" }}
                dashOffsetFrame={frame}
                proj={proj}
              />
            )}
          </>
        );
      }}
    </SoudanWarMapEngine>
  );
};

/** Wrapper : useClipFlags est un hook, doit être appelé au niveau composant (pas inline dans le JSX parent). */
const FlagLayer: React.FC<{ mapRef: React.MutableRefObject<mapboxgl.Map | null>; frame: number }> = ({ mapRef, frame }) => {
  const { paths } = useClipFlags(mapRef, FLAGS, frame);
  return <ClipFlagsLayer width={1920} height={1080} flags={FLAGS} paths={paths} frame={frame} />;
};

/**
 * Wrapper : GeoFlowConnection attend une instance mapboxgl.Map (pour re-projeter à chaque frame),
 * mais dans ce test on a déjà `proj` (le projecteur exposé par le moteur). On simule un mini-objet
 * compatible avec juste `.project()`, suffisant pour le test isolé.
 */
const GeoFlowConnectionInner: React.FC<{
  waypoints: [number, number][];
  progress: number;
  markerProgress: number;
  lineColor: string;
  markerColor: string;
  markerColorTransition?: { beforeT: number; colorBefore: string; colorAfter: string };
  dashOffsetFrame: number;
  persistAfterArrival?: boolean;
  proj: (c: [number, number]) => { x: number; y: number } | null;
}> = ({ waypoints, progress, markerProgress, lineColor, markerColor, markerColorTransition, dashOffsetFrame, persistAfterArrival, proj }) => {
  const fakeMap = { project: (c: [number, number]) => proj(c) ?? { x: 0, y: 0 } } as any;
  return (
    <GeoFlowConnection
      map={fakeMap}
      waypoints={waypoints}
      progress={progress}
      markerProgress={markerProgress}
      lineColor={lineColor}
      markerColor={markerColor}
      markerColorTransition={markerColorTransition}
      dashOffsetFrame={dashOffsetFrame}
      persistAfterArrival={persistAfterArrival}
      markerIcon="dot"
    />
  );
};

export default GeoFlowConnectionTest;
