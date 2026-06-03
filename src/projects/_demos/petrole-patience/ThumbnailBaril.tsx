import React from "react";
import { ThumbnailSouverain, C } from "../../_shared/thumbnails/ThumbnailSouverain";
import { BarilJaugeIcon } from "../../_shared/thumbnails/icons/BarilJaugeIcon";

// ─────────────────────────────────────────────────────────────────────────────
// ThumbnailBaril (refactor 2026-05-28) — utilise le système générique
// Sénégal Pétrole : ratio 18% Petrosen
// ─────────────────────────────────────────────────────────────────────────────

export interface ThumbnailBarilProps {
  ratio?: number;
  variant?: "A" | "B" | "C";
}

export const ThumbnailBaril: React.FC<ThumbnailBarilProps> = ({
  ratio = 18,
  variant = "B",  // défaut B = titre à droite multi-ligne (préférence Aziz 2026-05-28)
}) => {
  return (
    <ThumbnailSouverain
      icon={
        <BarilJaugeIcon
          ratio={ratio}
          flagColors={C.flags.senegal}
          starColor={C.flags.senegal.a}
          position={{ cx: 470, cy: 360 }}
        />
      }
      title="Le pétrole de la patience"
      subtitle="Sénégal"
      variant={variant}
      showStats={variant === "A"}
      statTop={{ label: "EXPORT", value: `${100 - ratio}%` }}
      statBottom={{ label: "PETROSEN", value: `${ratio}%` }}
    />
  );
};
