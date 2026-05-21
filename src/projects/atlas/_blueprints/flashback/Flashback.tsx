import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import atlasData from "../../_shared/atlas-v2-data.json";
import {
  AtlasMercator,
  AtlasLabel,
} from "../../_shared/atlas-components";

// Blueprint: Flashback
//
// Transition visuelle "retour dans le passé" :
//   - Phase 1: carte en couleurs normales
//   - Phase 2: transition sepia + légère distorsion + vignette
//   - Phase 3: retour progressif aux couleurs normales
//
// Technique: filtres CSS SVG (hueRotate, saturate, brightness) appliqués
// via style inline. Distorsion via skewX sur l'ensemble. Vignette via radial-gradient.
//
// Props:
//   sepiaFrame       — frame de début du flashback (défaut 20)
//   returnFrame      — frame de retour en couleurs (défaut 110)
//   poiSvgX/Y        — centre de la carte pour le flashback
//   labelPast        — texte de l'époque passée
//   labelReturn      — texte du retour au présent
//   durationFrames   — durée totale (défaut 150)
//   camZoom          — zoom carte (défaut 1.5)

interface Props {
  sepiaFrame?: number;
  returnFrame?: number;
  poiSvgX?: number;
  poiSvgY?: number;
  labelPast?: string;
  labelReturn?: string;
  durationFrames?: number;
  camZoom?: number;
}

export const Flashback: React.FC<Props> = ({
  sepiaFrame = 20,
  returnFrame = 110,
  poiSvgX = 270,
  poiSvgY = 550,
  labelPast = "1235 AD — Kouroukan Fouga",
  labelReturn = "Aujourd'hui",
  durationFrames = 150,
  camZoom = 1.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const transitionInEnd = sepiaFrame + 15;
  const transitionOutStart = returnFrame - 15;

  // Intensité du filtre sepia (0 = normal, 1 = full sepia)
  const sepiaIntensity = interpolate(
    frame,
    [sepiaFrame, transitionInEnd, transitionOutStart, returnFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Légère distorsion au moment de la transition
  const distortionPeak = sepiaFrame + 3;
  const skewAngle = (() => {
    if (frame < sepiaFrame || frame > sepiaFrame + 10) return 0;
    return Math.sin((frame - sepiaFrame) * Math.PI / 10) * 2.5;
  })();

  // Zoom carte
  const cameraZoom = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 40, mass: 1 },
    from: 1.0,
    to: camZoom,
    durationInFrames: 40,
  });

  const centerOffsetX = poiSvgX - 360;
  const centerOffsetY = poiSvgY - 640;

  // Filtre CSS appliqué à la carte
  const filterCSS = `sepia(${sepiaIntensity}) brightness(${1 - sepiaIntensity * 0.1}) contrast(${1 + sepiaIntensity * 0.15})`;

  // Label flashback (période historique) — visible pendant le flashback
  const showLabelPast = frame >= transitionInEnd && frame < transitionOutStart;
  // Label retour — visible après le retour
  const showLabelReturn = frame >= returnFrame + 5;

  // Vignette sepia — overlay sombre aux coins
  const vignetteOpacity = sepiaIntensity * 0.4;

  const countries = (atlasData as any).mercWide.countries as { iso: string; d: string }[];

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a0f08" }}>
      {/* Carte avec filtres flashback */}
      <AbsoluteFill
        style={{
          filter: filterCSS,
          transform: `skewX(${skewAngle}deg)`,
        }}
      >
        <svg
          viewBox="0 0 720 1280"
          style={{ width: "100%", height: "100%" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <AtlasMercator
            countries={countries}
            scale={cameraZoom}
            driftX={0}
            driftY={0}
            centerOffsetX={centerOffsetX}
            centerOffsetY={centerOffsetY}
          />
          {/* Label époque historique */}
          {showLabelPast && (
            <AtlasLabel
              text={labelPast}
              coord={[poiSvgX, poiSvgY - 40]}
              appearAt={transitionInEnd}
            />
          )}
          {/* Label retour présent */}
          {showLabelReturn && (
            <AtlasLabel
              text={labelReturn}
              coord={[poiSvgX, poiSvgY - 40]}
              appearAt={returnFrame + 5}
            />
          )}
        </svg>
      </AbsoluteFill>

      {/* Vignette sepia */}
      {vignetteOpacity > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at center, transparent 40%, rgba(101, 67, 33, ${vignetteOpacity}) 100%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Ligne de date en haut — indicateur temporel */}
      {showLabelPast && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: 60,
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 28,
              color: `rgba(212, 163, 100, ${sepiaIntensity})`,
              letterSpacing: "3px",
              textTransform: "uppercase",
              opacity: sepiaIntensity,
            }}
          >
            FLASHBACK
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
