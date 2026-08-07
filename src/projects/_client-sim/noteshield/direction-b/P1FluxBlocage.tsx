// P1 — "On traite encore toutes les connexions de la meme maniere" / "ralentit tout le monde" /
// "croise les doigts". 0 -> 10.9s. Flux indifferencie qui percute une barriere et s'embouteille,
// puis repart trop vite (traits rouges non filtres qui filent avec le reste).
//
// Le SVG Fable v3 fournit DEJA les deux etats (flux_arrivant libre / flux_bloque compresse) dans
// le meme cadre de coordonnees — on ne fait QUE piloter opacite/position selon la frame, jamais
// interpoler entre deux fichiers SVG separes (cf. PLAN-ANIMATION-DIRECTION-B.md § P1).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { P1_FLUX_SVG } from "./bodies/P1FluxBody";
import { extractGroup, extractDefs } from "./svgGroupExtractor";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const DEFS = extractDefs(P1_FLUX_SVG);

const G = {
  bg: extractGroup(P1_FLUX_SVG, "bg"),
  structureGrid: extractGroup(P1_FLUX_SVG, "structure_grid"),
  horizonDormant: extractGroup(P1_FLUX_SVG, "horizon_dormant"),
  speedHairlines: extractGroup(P1_FLUX_SVG, "speed_hairlines"),
  fluxArrivant: extractGroup(P1_FLUX_SVG, "flux_arrivant"),
  barriere: extractGroup(P1_FLUX_SVG, "barriere"),
  fluxBloque: extractGroup(P1_FLUX_SVG, "flux_bloque"),
  traitsRouges: extractGroup(P1_FLUX_SVG, "traits_rouges"),
  zoneVideDroite: extractGroup(P1_FLUX_SVG, "zone_vide_droite"),
  dustParticles: extractGroup(P1_FLUX_SVG, "dust_particles"),
  vignette: extractGroup(P1_FLUX_SVG, "vignette"),
};

const Raw: React.FC<{ body: string; opacity?: number; transform?: string }> = ({ body, opacity, transform }) => (
  <g opacity={opacity} transform={transform} dangerouslySetInnerHTML={{ __html: body }} />
);

// Timings relatifs au debut du panneau (P1 commence a 0s dans la composition globale).
// "ralentit" : 4.319 -> 4.859s (mot-cle blocage). "doigts." : 9.099 -> 9.319s (mot-cle liberation).
const T_BARRIERE_IN = 4.319;
const T_BARRIERE_HOLD_END = 8.4; // la barriere tient jusqu'a juste avant "doigts"
const T_BARRIERE_OUT = 8.6; // disparition rapide, juste avant/pendant "doigts" (9.099-9.319)
const T_FUITE_START = 8.7; // le flux repart en vitesse juste apres la barriere

export const P1FluxBlocage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Barriere : apparition spring a T_BARRIERE_IN, disparition rapide a T_BARRIERE_OUT.
  const barriereIn = spring({
    frame: frame - T_BARRIERE_IN * fps,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const barriereOut = interpolate(t, [T_BARRIERE_OUT, T_BARRIERE_OUT + 0.25], [1, 0], clamp);
  const barriereOpacity = Math.min(barriereIn, barriereOut);
  const barriereScaleY = interpolate(barriereIn, [0, 1], [0.3, 1]);

  // Flux arrivant (libre) visible avant le blocage, puis re-visible en fuite acceleree apres.
  const fluxArrivantOpacityBeforeBlock = interpolate(t, [T_BARRIERE_IN - 0.3, T_BARRIERE_IN], [1, 0], clamp);
  const fluxArrivantOpacityFuite = interpolate(t, [T_FUITE_START, T_FUITE_START + 0.2], [0, 1], clamp);
  const fluxArrivantOpacity = Math.max(fluxArrivantOpacityBeforeBlock, fluxArrivantOpacityFuite);
  // Translation de sortie rapide en fuite : easing "in" (accelere), tout part d'un coup.
  const fuiteProgress = interpolate(t, [T_FUITE_START, 10.9], [0, 1], clamp);
  const fluxArrivantTranslateX = fuiteProgress > 0 ? interpolate(fuiteProgress, [0, 1], [0, 260], {
    ...clamp,
    easing: (x) => x * x,
  }) : 0;

  // Flux bloque (compresse) : apparait au moment du blocage, disparait a la fuite.
  const fluxBloqueOpacity = interpolate(
    t,
    [T_BARRIERE_IN, T_BARRIERE_IN + 0.4, T_BARRIERE_OUT, T_BARRIERE_OUT + 0.15],
    [0, 1, 1, 0],
    clamp,
  );

  // Traits rouges : noyes dans l'embouteillage, puis filent avec la fuite sans etre arretes.
  const traitsRougesOpacity = interpolate(t, [T_BARRIERE_IN + 0.4, T_BARRIERE_IN + 0.6], [0, 1], clamp);

  // Horizon dormant : fil cyan constant en arriere-plan, leger sursaut de luminosite au blocage.
  const horizonPulse = interpolate(t, [T_BARRIERE_IN, T_BARRIERE_IN + 0.5, T_BARRIERE_IN + 1.2], [1, 1.4, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "#0A1628" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />
        <Raw body={G.bg} />
        <Raw body={G.structureGrid} />
        <Raw body={G.horizonDormant} opacity={horizonPulse} />
        <Raw body={G.speedHairlines} />
        <Raw
          body={G.fluxArrivant}
          opacity={fluxArrivantOpacity}
          transform={fuiteProgress > 0 ? `translate(${fluxArrivantTranslateX}, 0)` : undefined}
        />
        <Raw
          body={G.barriere}
          opacity={barriereOpacity}
          transform={`translate(1240, 540) scale(1, ${barriereScaleY}) translate(-1240, -540)`}
        />
        <Raw body={G.fluxBloque} opacity={fluxBloqueOpacity} />
        <Raw body={G.traitsRouges} opacity={traitsRougesOpacity * fluxBloqueOpacity} />
        <Raw body={G.zoneVideDroite} />
        <Raw body={G.dustParticles} />
        <Raw body={G.vignette} />
      </svg>
    </AbsoluteFill>
  );
};
