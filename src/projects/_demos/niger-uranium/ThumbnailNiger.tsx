import React from "react";
import { ThumbnailSouverain, C } from "../../_shared/thumbnails/ThumbnailSouverain";
import { AmpouleIcon } from "../../_shared/thumbnails/icons/AmpouleIcon";

// ─────────────────────────────────────────────────────────────────────────────
// ThumbnailNiger — métaphore "ampoule alimentée par 12% Niger"
// ─────────────────────────────────────────────────────────────────────────────

export interface ThumbnailNigerProps {
  ratio?: number;
  variant?: "A" | "B" | "C";
}

export const ThumbnailNiger: React.FC<ThumbnailNigerProps> = ({
  ratio = 12,
  variant = "B",
}) => {
  return (
    <ThumbnailSouverain
      icon={
        <AmpouleIcon
          ratio={ratio}
          flagColors={C.flags.niger}
          position={{ cx: 540, cy: 430 }}
          size={{ w: 340, h: 460 }}
        />
      }
      title="L'uranium qui éclaire la France"
      subtitle="Niger"
      variant={variant}
      showStats={variant === "A"}
      statTop={{ label: "EXPORT", value: `${100 - ratio}%` }}
      statBottom={{ label: "NIGER", value: `${ratio}%` }}
    />
  );
};
