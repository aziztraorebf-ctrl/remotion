/**
 * AtlasEncirclement — orchestrateur de PLUSIEURS flèches tactiques coordonnées
 * (encerclement, enveloppement, manœuvre en tenaille). C'est le différentiel
 * Atlas : mapanimation.io ÉCHOUE sur les batailles (confrontation localisée sans
 * trajet A→B) — voir [[feedback_atlas-inspiration-externe-faisabilite]] (Cannes
 * rendu illisible chez eux). Ici on dessine N flèches frame-précises, chacune avec
 * son délai/durée, dans une projection régionale injectée (geoUtils PROJECTIONS).
 *
 * Chaque flèche est un AtlasAttackArrow piloté par sa fenêtre [delay, delay+duration].
 * Le wrapper se contente de calculer le `progress` de chacune depuis le frame courant
 * et de leur passer la MÊME projection (cohérence géo de toute la scène de bataille).
 *
 * RENDU : SVG en coords carte (720×1280). À placer DANS le <g transform caméra> du
 * beat, comme AtlasAttackArrow. Ne crée PAS sa propre <svg>. Headless-safe.
 *
 *   <g transform={camG}>
 *     <AtlasEncirclement
 *       frame={frame}
 *       projection={PROJECTIONS.cannae}
 *       arrows={[
 *         { waypoints: [aileA0, aileA1], delay: 30, duration: 70, color: "#b3322c" },
 *         { waypoints: [aileB0, aileB1], delay: 30, duration: 70, color: "#b3322c" },
 *         { waypoints: [romeStart, trap], delay: 0, duration: 60, color: "#3a3a3a", curved: false },
 *       ]}
 *     />
 *   </g>
 *
 * Helper `pincerArrows(...)` construit le cas "tenaille" (2 ailes symétriques qui se
 * referment derrière l'ennemi) sans avoir à composer les fenêtres à la main.
 */

import React from "react";
import { interpolate } from "remotion";
import { AtlasAttackArrow } from "./AtlasAttackArrow";
import { lngLatToSvg, type GeoPoint, type Projection } from "./geoUtils";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Spec d'une flèche dans l'encerclement. Reprend les props utiles d'AtlasAttackArrow
 *  + une fenêtre temporelle (delay/duration) au lieu d'un progress brut. */
export interface EncircleArrow {
  waypoints: GeoPoint[];
  /** frame de DÉPART du tracé (relatif au frame passé au wrapper) */
  delay: number;
  /** durée du tracé en frames */
  duration: number;
  color?: string;
  strokeWidth?: number;
  headType?: "arrow" | "dot" | "none";
  curved?: boolean;
  /** courbure de l'arc : signe et amplitude du bombé latéral (def. via curved). */
  samples?: number;
  /** opacité cible de la flèche une fois tracée (def 1) */
  opacity?: number;
}

export interface AtlasEncirclementProps {
  /** frame courant (useCurrentFrame du beat) */
  frame: number;
  /** les flèches à orchestrer */
  arrows: EncircleArrow[];
  /** projection régionale partagée (def Mali). Pour une bataille hors zone, passer
   *  PROJECTIONS.cannae / .mediterranee / .grece / .europe. */
  projection?: Projection;
  /** marching ants : passer le frame pour animer le défilement (def = frame interne) */
  marchingFrame?: number;
  /** opacité globale du groupe (fade in/out depuis le beat) */
  opacity?: number;
}

export const AtlasEncirclement: React.FC<AtlasEncirclementProps> = ({
  frame,
  arrows,
  projection = lngLatToSvg,
  marchingFrame,
  opacity = 1,
}) => {
  return (
    <g opacity={opacity} style={{ pointerEvents: "none" }}>
      {arrows.map((a, i) => {
        const progress = interpolate(
          frame,
          [a.delay, a.delay + Math.max(1, a.duration)],
          [0, 1],
          CLAMP,
        );
        return (
          <AtlasAttackArrow
            key={i}
            waypoints={a.waypoints}
            progress={progress}
            projection={projection}
            color={a.color}
            strokeWidth={a.strokeWidth}
            headType={a.headType}
            curved={a.curved}
            samples={a.samples}
            opacity={a.opacity}
            marchingFrame={marchingFrame ?? frame}
          />
        );
      })}
    </g>
  );
};

// ─── HELPER : manœuvre en tenaille (enveloppement symétrique) ─────────────────

export interface PincerSpec {
  /** point de départ commun (ou proche) des deux ailes */
  wingTop: { from: GeoPoint; to: GeoPoint };
  /** aile basse (symétrique) */
  wingBot: { from: GeoPoint; to: GeoPoint };
  /** flèche centrale (l'appât qui recule), optionnelle */
  center?: { from: GeoPoint; to: GeoPoint };
  /** frame de départ des ailes */
  wingDelay?: number;
  /** durée du mouvement des ailes */
  wingDuration?: number;
  /** frame de départ du centre (souvent AVANT les ailes : il avance, puis recule) */
  centerDelay?: number;
  centerDuration?: number;
  /** couleur des ailes (assaillant) et du centre (défenseur/appât) */
  wingColor?: string;
  centerColor?: string;
}

/**
 * Construit les EncircleArrow d'une tenaille classique (Cannes) :
 *  - 2 ailes assaillantes qui partent de l'avant et se referment derrière l'ennemi,
 *  - 1 flèche centrale (appât) qui avance droit (le centre qui « plie »).
 * Les ailes sont COURBÉES (curved) pour le mouvement d'enveloppement ; le centre est droit.
 */
export const pincerArrows = (spec: PincerSpec): EncircleArrow[] => {
  const {
    wingTop,
    wingBot,
    center,
    wingDelay = 30,
    wingDuration = 70,
    centerDelay = 0,
    centerDuration = 55,
    wingColor = "#b3322c",
    centerColor = "#3a3a3a",
  } = spec;

  const out: EncircleArrow[] = [];
  if (center) {
    out.push({
      waypoints: [center.from, center.to],
      delay: centerDelay,
      duration: centerDuration,
      color: centerColor,
      headType: "arrow",
      curved: false,
      strokeWidth: 2.4,
    });
  }
  out.push(
    {
      waypoints: [wingTop.from, wingTop.to],
      delay: wingDelay,
      duration: wingDuration,
      color: wingColor,
      headType: "arrow",
      curved: true,
      strokeWidth: 2.6,
    },
    {
      waypoints: [wingBot.from, wingBot.to],
      delay: wingDelay,
      duration: wingDuration,
      color: wingColor,
      headType: "arrow",
      curved: true,
      strokeWidth: 2.6,
    },
  );
  return out;
};
