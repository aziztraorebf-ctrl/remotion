import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AUDIO_SEGMENTS, BEATS } from "./timing";
import { DualStat } from "../../_shared/components/layouts/DualStat";
import { QuoteImpact } from "../../_shared/components/layouts/QuoteImpact";

// Beat 6 — Question ouverte (54.44s -> 86.08s)
// Orchestrateur : DualStat (Zimbabwe vs Chine) -> QuoteImpact (freeze final)

const BEAT_START = BEATS.question.startFrame;

// Frames locales (depuis 0, relatif au beat)
const F_ZIMBABWE = AUDIO_SEGMENTS.beat6ZimbabweForce  - BEAT_START;
const F_CHINE    = AUDIO_SEGMENTS.beat6SelonSesRegles - BEAT_START;
const F_QUOTE    = AUDIO_SEGMENTS.beat6QuiAVraiment   - BEAT_START;

// Dots CSS navy — fond du beat entier
const DOT_BG: React.CSSProperties = {
  backgroundColor: "#141c2e",
  backgroundImage: "radial-gradient(#c8a95122 1px, transparent 1px)",
  backgroundSize: "40px 40px",
};

export const Beat6Question: React.FC = () => {
  const frame = useCurrentFrame();

  // Fondu sortie DualStat juste avant la quote
  const dualFadeOut = interpolate(
    frame,
    [F_QUOTE - 5, F_QUOTE + 10],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={DOT_BG}>

      {/* Phase 1 — DualStat Zimbabwe vs Chine */}
      {frame < F_QUOTE + 10 && (
        <AbsoluteFill style={{ opacity: dualFadeOut }}>
          <DualStat
            title="Qui a force qui ?"
            subtitle="Zimbabwe · Lithium · 2023"
            dividerStartFrame={30}
            entityA={{
              entity: "Zimbabwe",
              stat: "16M",
              label: "habitants",
              startFrame: F_ZIMBABWE,
              side: "left",
            }}
            entityB={{
              entity: "Chine",
              stat: "1.4Md",
              label: "habitants",
              startFrame: F_CHINE,
              side: "right",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Phase 2 — QuoteImpact */}
      {frame >= F_QUOTE - 5 && (
        <QuoteImpact
          question="Qui a vraiment gagne ?"
          subtitle="Zimbabwe · Lithium · 2023"
          startFrame={F_QUOTE}
        />
      )}

    </AbsoluteFill>
  );
};
