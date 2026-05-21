import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  fadeIn,
  drawPath,
  popIn,
  gentleReveal,
} from "../../_shared/animations";

// Beat 5 — Zimbabwe ($400M) → Huayou Cobalt (Chine)
// Durée locale : 0 → ~470 frames (38.82s → 54.44s dans l'épisode)

const F_MAP_DRAW    = 60;
const F_AMOUNT      = 120;
const F_LABEL       = 150;
const F_ANNOTATION  = 180;
const F_RIGHT_PANEL = 210;
const F_FLAG        = 250;
const F_CAPACITY    = 310;
const F_AREA        = 380;

// Sous-titres beat 5 (démonstration — calage approximatif)
const SUBTITLES = [
  { start:  0,  end:  60,  text: "Il interdit tout export de minerai brut." },
  { start:  65, end: 130,  text: "Tu veux exporter — tu transformes d'abord sur place." },
  { start: 140, end: 210,  text: "Les marchés s'affolent." },
  { start: 215, end: 290,  text: "+10% à Shanghai en vingt-quatre heures." },
  { start: 310, end: 380,  text: "La Chine n'a pas le choix." },
  { start: 385, end: 460,  text: "Huayou Cobalt investit 400 millions de dollars." },
];

// Path Zimbabwe d3-geo (Natural Earth 50m, ISO 716)
const ZIMBABWE_PATH = "M468.582,498.956L465.126,496.577L460.426,494.992L454.344,494.343L446.465,494.631L436.927,495.928L426.559,494.343L415.501,489.878L406.239,488.295L395.319,490.238L394.766,490.31L392.969,488.799L389.928,486.64L389.928,484.264L390.482,481.67L391.312,477.641L393.247,474.182L396.149,470.722L397.669,467.694L397.669,464.451L397.117,462.724L395.32,460.999L393.247,458.623L393.109,455.812L394.352,453.006L396.149,450.413L397.392,448.904L398.359,447.178L398.359,444.802L397.669,441.56L396.287,438.75L394.628,436.588L394.766,432.773L396.701,429.96L399.741,427.368L404.028,425.641L408.867,424.129L410.248,421.965L410.109,419.587L409.281,418.295L407.898,417.649L406.378,415.915L404.995,413.107L402.921,410.299L400.985,407.492L400.017,403.246L399.188,401.52L398.497,399.578L398.773,397.203L400.156,394.613L402.368,393.101L405.548,392.24L409.281,391.163L413.428,389.652L416.884,387.275L419.094,384.034L420.613,382.09L421.997,380.578L423.931,380.146L426.559,380.793L430.292,381.44L433.61,381.44L436.65,380.578L439.69,378.201L442.454,374.96L445.633,371.503L448.535,368.694L451.437,366.75L455.033,364.158L458.075,361.133L461.115,357.675L463.877,354.433L466.365,351.192L468.444,348.167L469.411,345.574L469.135,342.55L467.614,339.741L466.089,336.499L465.676,333.475L466.089,330.882L468.167,328.72L470.794,327.424L473.973,326.561L477.981,325.7L481.438,325.7L484.617,326.561L487.381,328.072L490.974,329.797L494.846,331.095L498.994,331.309L502.589,330.231L506.046,328.072L508.394,326.561L510.882,325.484L513.645,325.7L516.547,327.424L519.587,329.367L522.075,331.095L525.115,333.475L527.74,336.284L529.538,339.741L530.919,343.196L532.576,346.22L534.373,348.167L534.373,350.974L533.269,353.998L531.748,357.244L530.781,360.271L530.781,363.51L531.748,367.182L533.545,370.638L534.373,373.446L534.373,376.255L533.545,378.634L531.748,381.44L529.538,384.034L527.74,386.627L526.22,388.786L525.115,390.73L523.594,393.534L521.66,396.341L519.587,399.795L518.066,403.03L517.515,406.5L517.237,409.307L517.237,412.548L516.547,416.22L515.44,419.587L514.474,423.483L514.198,427.584L514.474,431.041L515.164,434.065L515.44,437.089L514.888,440.13L513.921,443.372L513.369,446.178L513.508,449.42L514.198,452.228L515.164,455.252L516.547,458.277L518.204,461.085L519.725,463.459L520.969,465.187L521.521,466.913L520.969,468.638L519.449,470.362L517.237,472.305L514.888,474.25L513.369,476.192L512.817,478.352L512.817,480.727L512.817,483.099L511.158,485.476L508.946,487.635L506.736,489.359L504.524,490.651L503.005,492.806L503.005,495.828L503.005,498.419L502.727,500.579L501.484,501.656L499.41,501.441L497.06,499.929L494.571,498.419L492.085,497.991L489.459,498.849L486.833,500.794L484.343,501.656L481.161,501.441L478.259,500.362L475.77,499.5L473.42,499.929L471.347,499.929Z";
const PATH_LENGTH = 3800;

// Ratio exact carte Zimbabwe — drapeau utilisera le même pour hauteur identique
const MAP_RATIO = "155/185";

const FONT_BEBAS: React.CSSProperties = { fontFamily: "'Bebas Neue', Impact, sans-serif" };
const FONT_MONO: React.CSSProperties  = { fontFamily: "'IBM Plex Mono', monospace" };

export const Beat5Demonstration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mapDraw      = gentleReveal(frame, F_MAP_DRAW, fps);
  const amountPop    = popIn(frame, F_AMOUNT, fps);
  const labelOp      = fadeIn(frame, F_LABEL, 20);
  const annotationOp = fadeIn(frame, F_ANNOTATION, 20);
  const panelSlide   = gentleReveal(frame, F_RIGHT_PANEL, fps);
  const flagFadeVal  = fadeIn(frame, F_FLAG, 25);
  const capacityPop  = gentleReveal(frame, F_CAPACITY, fps);
  const areaFadeVal  = fadeIn(frame, F_AREA, 20);

  const grainX   = Math.sin(frame * 0.025) * 4;
  const grainY   = Math.cos(frame * 0.022) * 3;
  const mapFloat = Math.sin(frame * 0.04) * 5;

  const mapDashOffset = drawPath(frame, F_MAP_DRAW, 60, PATH_LENGTH);
  const mapFillOp     = interpolate(mapDraw, [0, 0.3, 0.9], [0, 0, 0.12], { extrapolateRight: "clamp" });
  const panelX        = interpolate(panelSlide, [0, 1], [120, 0], { extrapolateRight: "clamp" });
  const panelOp       = interpolate(panelSlide, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const scaleAmount   = interpolate(amountPop, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });

  const capacityVal = Math.round(
    interpolate(capacityPop, [0, 1], [0, 50000], { extrapolateRight: "clamp" })
  );
  const capacityStr = capacityVal.toLocaleString("fr-FR");

  const activeSub = SUBTITLES.find(s => frame >= s.start && frame <= s.end);
  const subOp = activeSub
    ? interpolate(frame, [activeSub.start, activeSub.start + 8], [0, 1], { extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill className="bg-navy overflow-hidden flex flex-row">

      <Audio
        src={staticFile("souverain/zimbabwe-lithium/audio/narration-zimbabwe-v1.mp3")}
        startFrom={Math.round(38.82 * fps)}
      />

      {/* Background dots */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(96,128,192,0.38) 1.5px, transparent 2px)",
          backgroundSize: "32px 32px",
          transform: `translate(${grainX}px, ${grainY}px)`,
        }}
      />

      {/* Séparateur vertical */}
      <svg width={1080} height={1920} className="absolute inset-0 pointer-events-none">
        <line
          x1={540} y1={288} x2={540} y2={1680}
          stroke="#c8a951" strokeWidth={3}
          opacity={0.7 + 0.1 * Math.sin(frame * 0.03)}
          strokeDasharray="6 6"
        />
      </svg>

      {/* ══ COLONNE GAUCHE ══════════════════════════════════════════ */}
      <div className="w-1/2 flex flex-col pt-[288px] pb-[200px] px-[30px]">

        {/* Carte Zimbabwe — ratio 155/185, pleine largeur colonne */}
        <div
          className="w-full flex-shrink-0"
          style={{
            aspectRatio: MAP_RATIO,
            transform: `translateY(${mapFloat}px)`,
            filter: "drop-shadow(0 0 28px rgba(200,169,81,0.8))",
            opacity: mapDraw > 0.01 ? 1 : 0,
          }}
        >
          <svg viewBox="385 320 155 185" className="w-full h-full">
            <path
              d={ZIMBABWE_PATH}
              fill={`rgba(200,169,81,${mapFillOp})`}
              stroke="#c8a951"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={PATH_LENGTH}
              strokeDashoffset={mapDashOffset}
            />
          </svg>
        </div>

        {/* Textes gauche — flex-1, 3 items séparés par lignes gold */}
        <div className="flex-1 flex flex-col justify-around pt-4">

          {/* $400M */}
          <div
            style={{
              opacity: Math.min(amountPop, 1),
              transform: `scale(${scaleAmount})`,
              transformOrigin: "left top",
            }}
          >
            <span
              className="text-stat-xl text-gold font-bold leading-none"
              style={{ ...FONT_BEBAS, letterSpacing: "-0.02em", textShadow: "0 0 60px rgba(200,169,81,0.6)" }}
            >
              $400M
            </span>
          </div>

          <div className="h-[3px] w-full bg-gold/80" style={{ opacity: labelOp }} />

          {/* HARARE · ZIMBABWE */}
          <div
            className="text-label text-slate tracking-[0.05em] whitespace-nowrap"
            style={{ ...FONT_MONO, opacity: labelOp }}
          >
            HARARE · ZIMBABWE
          </div>

          <div className="h-[3px] w-full bg-gold/80" style={{ opacity: annotationOp }} />

          {/* A BÂTI L'USINE SUR SON SOL */}
          <div
            className="tracking-[0.02em] whitespace-nowrap"
            style={{ ...FONT_MONO, fontSize: 26, color: "#c8c0a8", opacity: annotationOp }}
          >
            A BÂTI L'USINE SUR SON SOL
          </div>

        </div>
      </div>

      {/* ══ COLONNE DROITE ══════════════════════════════════════════ */}
      <div
        className="w-1/2 flex flex-col pt-[288px] pb-[200px] pl-[54px] pr-[30px]"
        style={{ opacity: panelOp, transform: `translateX(${panelX}px)` }}
      >

        {/* Drapeau Chine — même ratio que carte Zimbabwe = même hauteur visuelle */}
        <div
          className="w-full flex-shrink-0 overflow-hidden"
          style={{ aspectRatio: MAP_RATIO, opacity: flagFadeVal }}
        >
          <Img
            src={staticFile("souverain/zimbabwe-lithium/assets/beat5/chinese_flag_transparent.png")}
            className="w-full h-full"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        {/* Textes droite — flex-1, même structure que gauche */}
        <div className="flex-1 flex flex-col justify-around pt-4">

          {/* HUAYOU COBALT */}
          <div
            className="text-ivory font-bold leading-none"
            style={{ ...FONT_BEBAS, fontSize: 82, opacity: flagFadeVal, letterSpacing: "0.03em" }}
          >
            HUAYOU COBALT
          </div>

          <div className="h-[3px] w-full bg-gold/80" style={{ opacity: flagFadeVal * 0.8 }} />

          {/* ZHEJIANG, CHINE */}
          <div
            className="text-slate tracking-[0.05em] whitespace-nowrap"
            style={{ ...FONT_MONO, fontSize: 34, opacity: flagFadeVal * 0.9 }}
          >
            ZHEJIANG, CHINE
          </div>

          {capacityPop > 0.01 && (
            <div className="h-[3px] w-full bg-gold/80" />
          )}

          {/* 50 000 T/AN */}
          {capacityPop > 0.01 && (
            <>
              <div
                className="text-ivory font-bold leading-none"
                style={{ ...FONT_BEBAS, fontSize: 82, letterSpacing: "0.03em" }}
              >
                {capacityStr} T/AN
              </div>
              <div
                className="text-slate tracking-[0.05em]"
                style={{ ...FONT_MONO, fontSize: 30 }}
              >
                capacité de transformation
              </div>
            </>
          )}

          {capacityPop > 0.5 && (
            <div className="h-[3px] w-full bg-gold/80" />
          )}

          {/* 40 HECTARES */}
          {areaFadeVal > 0.01 && (
            <div
              className="text-ivory font-bold"
              style={{ ...FONT_BEBAS, fontSize: 72, opacity: areaFadeVal, letterSpacing: "0.04em" }}
            >
              40 HECTARES
            </div>
          )}

        </div>
      </div>

      {/* ══ SOUS-TITRES ═════════════════════════════════════════════ */}
      {activeSub && (
        <div
          className="absolute left-0 right-0 flex items-center justify-center px-[60px]"
          style={{ bottom: 60, opacity: subOp }}
        >
          <div
            className="text-center"
            style={{
              ...FONT_MONO,
              fontSize: 36,
              color: "#f0e8d8",
              lineHeight: 1.4,
              background: "rgba(8,13,20,0.75)",
              padding: "16px 32px",
              borderRadius: 8,
            }}
          >
            {activeSub.text}
          </div>
        </div>
      )}

    </AbsoluteFill>
  );
};
