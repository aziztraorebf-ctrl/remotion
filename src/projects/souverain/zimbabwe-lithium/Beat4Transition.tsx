import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BEATS } from "./timing";

// Beat 4 — Transition "Mais à quel prix ?"
// Durée : 33.58s → 38.82s = ~158 frames
//
// RÈGLES BACKGROUND SOUVERAIN respectées :
// - Fond navy sombre avec grille de points régulière (CSS, pas photo)
// - Pas de texture organique (fumée, nuages, etc.)
//
// RÈGLE GÉOGRAPHIE respectée :
// - Path Zimbabwe = d3-geo + Natural Earth 50m (ISO 716)
// - Jamais de SVG dessiné à la main
//
// Source path : node d3-geo, center=[29.5,-20], scale=2200, 800x800 viewBox
// Centré dans 1080x1920 : translate(140, 560) pour positionner dans le tiers supérieur

const F_MAP_DRAW  = 30;  // "Le Zimbabwe" — draw-stroke
const F_MAP_PULSE = 60;  // "a gagné" — pulse glow
const F_QUESTION  = 90;  // "Mais à quel prix ?" — fade-in

// Path Zimbabwe réel via d3-geo (Natural Earth 50m, ISO 716)
const ZIMBABWE_PATH = "M468.582,498.956L465.126,496.577L460.426,494.992L454.344,494.343L446.465,494.631L436.927,495.928L426.559,494.343L415.501,489.878L406.239,488.295L395.319,490.238L394.766,490.31L392.969,488.799L389.928,486.64L389.928,484.264L390.482,481.67L391.312,477.641L393.247,474.182L396.149,470.722L397.669,467.694L397.669,464.451L397.117,462.724L395.32,460.999L393.247,458.623L393.109,455.812L394.352,453.006L396.149,450.413L397.392,448.904L398.359,447.178L398.359,444.802L397.669,441.56L396.287,438.75L394.628,436.588L394.766,432.773L396.701,429.96L399.741,427.368L404.028,425.641L408.867,424.129L410.248,421.965L410.109,419.587L409.281,418.295L407.898,417.649L406.378,415.915L404.995,413.107L402.921,410.299L400.985,407.492L400.017,403.246L399.188,401.52L398.497,399.578L398.773,397.203L400.156,394.613L402.368,393.101L405.548,392.24L409.281,391.163L413.428,389.652L416.884,387.275L419.094,384.034L420.613,382.09L421.997,380.578L423.931,380.146L426.559,380.793L430.292,381.44L433.61,381.44L436.65,380.578L439.69,378.201L442.454,374.96L445.633,371.503L448.535,368.694L451.437,366.75L455.033,364.158L458.075,361.133L461.115,357.675L463.877,354.433L466.365,351.192L468.444,348.167L469.411,345.574L469.135,342.55L467.614,339.741L466.089,336.499L465.676,333.475L466.089,330.882L468.167,328.72L470.794,327.424L473.973,326.561L477.981,325.7L481.438,325.7L484.617,326.561L487.381,328.072L490.974,329.797L494.846,331.095L498.994,331.309L502.589,330.231L506.046,328.072L508.394,326.561L510.882,325.484L513.645,325.7L516.547,327.424L519.587,329.367L522.075,331.095L525.115,333.475L527.74,336.284L529.538,339.741L530.919,343.196L532.576,346.22L534.373,348.167L534.373,350.974L533.269,353.998L531.748,357.244L530.781,360.271L530.781,363.51L531.748,367.182L533.545,370.638L534.373,373.446L534.373,376.255L533.545,378.634L531.748,381.44L529.538,384.034L527.74,386.627L526.22,388.786L525.115,390.73L523.594,393.534L521.66,396.341L519.587,399.795L518.066,403.03L517.515,406.5L517.237,409.307L517.237,412.548L516.547,416.22L515.44,419.587L514.474,423.483L514.198,427.584L514.474,431.041L515.164,434.065L515.44,437.089L514.888,440.13L513.921,443.372L513.369,446.178L513.508,449.42L514.198,452.228L515.164,455.252L516.547,458.277L518.204,461.085L519.725,463.459L520.969,465.187L521.521,466.913L520.969,468.638L519.449,470.362L517.237,472.305L514.888,474.25L513.369,476.192L512.817,478.352L512.817,480.727L512.817,483.099L511.158,485.476L508.946,487.635L506.736,489.359L504.524,490.651L503.005,492.806L503.005,495.828L503.005,498.419L502.727,500.579L501.484,501.656L499.41,501.441L497.06,499.929L494.571,498.419L492.085,497.991L489.459,498.849L486.833,500.794L484.343,501.656L481.161,501.441L478.259,500.362L475.77,499.5L473.42,499.929L471.347,499.929Z";

// Longueur approximative pour le dash animation
const PATH_LENGTH = 3800;

export const Beat4Transition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Springs
  const mapDrawProg = spring({
    frame: frame - F_MAP_DRAW,
    fps,
    config: { damping: 100, stiffness: 55 },
    durationInFrames: 30,
  });

  const pulseProg = spring({
    frame: frame - F_MAP_PULSE,
    fps,
    config: { damping: 80, stiffness: 50 },
    durationInFrames: 30,
  });

  const questionFade = spring({
    frame: frame - F_QUESTION,
    fps,
    config: { damping: 100, stiffness: 70 },
    durationInFrames: 20,
  });

  // Permanent motion — grille qui drift lentement
  const grainShiftX = Math.sin(frame * 0.025) * 4;
  const grainShiftY = Math.cos(frame * 0.022) * 3;

  // Glow gold pulsant
  const pulseGlow = interpolate(pulseProg, [0, 0.5, 1], [12, 35, 12], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const mapFloat = Math.sin(frame * 0.04) * 5;

  // Draw-stroke
  const dashOffset = interpolate(mapDrawProg, [0, 1], [PATH_LENGTH, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#141c2e", overflow: "hidden" }}>

      {/* Background — grille de points navy */}
      {/* Fond #141c2e (navy profond lisible mobile), dots #6080c0 à 30% */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(96,128,192,0.30) 1.5px, transparent 2px)",
        backgroundSize: "32px 32px",
        transform: `translate(${grainShiftX}px, ${grainShiftY}px)`,
      }} />

      {/* Spotlight central subtil — donne de la profondeur sans assombrir */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(30,50,90,0.5) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Vignette centre — spotlight naturel sur la carte */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 42%, transparent 20%, rgba(4,7,12,0.75) 80%)",
        pointerEvents: "none",
      }} />

      {/* Carte Zimbabwe — d3-geo Natural Earth 50m, ISO 716 */}
      {/* viewBox 800x800, translate(140, 480) pour centrer verticalement haut */}
      {mapDrawProg > 0.01 && (
        <div style={{
          position: "absolute",
          left: 0, top: 0, width: 1080, height: 1920,
          transform: `translateY(${mapFloat}px)`,
          filter: `drop-shadow(0px 0px ${pulseGlow}px rgba(200,169,81,0.9)) drop-shadow(0px 0px ${pulseGlow * 0.5}px rgba(255,215,0,0.5))`,
        }}>
          <svg
            width={1080}
            height={1920}
            viewBox="0 0 1080 1920"
            style={{ position: "absolute", inset: 0 }}
          >
            {/* Translate+scale : centrer la bbox Zimbabwe (235→534 x, 224→498 y), center=(385,361) → (540,560), scale 1.6x */}
            <g transform="translate(-77, 203) scale(1.6)">
              <path
                d={ZIMBABWE_PATH}
                fill="rgba(200,169,81,0.06)"
                stroke="#c8a951"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={PATH_LENGTH}
                strokeDashoffset={dashOffset}
              />
            </g>
          </svg>
        </div>
      )}

      {/* Texte top — "Le Zimbabwe a gagné sa bataille industrielle." */}
      {mapDrawProg > 0.4 && (
        <div style={{
          position: "absolute",
          left: 80, right: 80, top: 360,
          textAlign: "center",
          opacity: interpolate(mapDrawProg, [0.4, 0.9], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
        }}>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 44,
            color: "#f0e8d8",
            lineHeight: 1.3,
            fontStyle: "italic",
          }}>
            Le Zimbabwe a gagné<br/>sa bataille industrielle.
          </div>
        </div>
      )}

      {/* Séparateur gold */}
      {mapDrawProg > 0.7 && (
        <div style={{
          position: "absolute",
          left: "35%", right: "35%",
          top: 970,
          height: 2,
          background: "#c8a951",
          opacity: interpolate(mapDrawProg, [0.7, 1], [0, 0.8], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
        }} />
      )}

      {/* "MAIS À QUEL PRIX ?" — stamp impact */}
      {questionFade > 0.01 && (
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          top: 1110,
          textAlign: "center",
          opacity: questionFade,
          transform: `scale(${interpolate(questionFade, [0, 1], [0.85, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          })})`,
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 148,
            color: "#f0e8d8",
            letterSpacing: "0.02em",
            lineHeight: 0.9,
            textShadow: "0 6px 24px rgba(0,0,0,0.9)",
          }}>
            MAIS À<br/>QUEL PRIX ?
          </div>
        </div>
      )}

    </AbsoluteFill>
  );
};
