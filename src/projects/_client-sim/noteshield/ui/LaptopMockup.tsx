import React from "react";
import { staticFile } from "remotion";

/**
 * LaptopMockup — chassis d'ordinateur portable genere par Fable 5 (agent Claude Code, mode
 * raisonnement MAX, liberte creative complete), pas code a la main. Remplace la 1ere version
 * CSS/divs (plate) par un vrai SVG matiere (degrades, epaisseur de capot, biseau, grilles
 * haut-parleurs, trackpad, LED statut). Regle projet : le modele DESSINE la matiere statique,
 * NOUS animons/composons ensuite -- zero animation dans le SVG source.
 *
 * Fichier source : public/_client-sim/noteshield/laptop-mockup.svg (copie stable de
 * public/_rnd/fable-svg/northshield-laptop-mockup.svg, genere le 2026-08-06).
 * Zone ecran exacte fournie par Fable dans le viewBox 1920x1080 source : x=515 y=140 w=940 h=588.
 */

const SVG_VIEWBOX_W = 1920;
const SVG_VIEWBOX_H = 1080;
const SCREEN_AREA = { x: 515, y: 140, width: 940, height: 588 };

const CONTENT_W = 1920;
const CONTENT_H = 1080;

export const LaptopMockup: React.FC<{
  width: number;
  screenContent: React.ReactNode;
}> = ({ width, screenContent }) => {
  const scaleFactor = width / SVG_VIEWBOX_W;
  const height = SVG_VIEWBOX_H * scaleFactor;

  const screenLeft = SCREEN_AREA.x * scaleFactor;
  const screenTop = SCREEN_AREA.y * scaleFactor;
  const screenW = SCREEN_AREA.width * scaleFactor;
  const screenH = SCREEN_AREA.height * scaleFactor;
  const contentScale = screenW / CONTENT_W;

  return (
    <div style={{ position: "relative", width, height }}>
      <img
        src={staticFile("_client-sim/noteshield/laptop-mockup.svg")}
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, display: "block" }}
      />
      <div
        style={{
          position: "absolute",
          left: screenLeft,
          top: screenTop,
          width: screenW,
          height: screenH,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: CONTENT_W,
            height: CONTENT_H,
            transform: `scale(${contentScale})`,
            transformOrigin: "top left",
          }}
        >
          {screenContent}
        </div>
      </div>
    </div>
  );
};
