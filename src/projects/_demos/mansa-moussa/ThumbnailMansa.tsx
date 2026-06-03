import React from "react";
import { ThumbnailAtlas } from "../../_shared/thumbnails/ThumbnailAtlas";
import { CaravaneIcon } from "../../_shared/thumbnails/icons/atlas/CaravaneIcon";

// ─────────────────────────────────────────────────────────────────────────────
// ThumbnailMansa — Thumbnail Atlas pour Mansa Moussa
// Métaphore : carte Afrique avec Mali en or massif + route caravane vers Caire
// ─────────────────────────────────────────────────────────────────────────────

export interface ThumbnailMansaProps {
  variant?: "A" | "B";
}

export const ThumbnailMansa: React.FC<ThumbnailMansaProps> = ({
  variant = "A",
}) => {
  return (
    <ThumbnailAtlas
      icon={<CaravaneIcon position={{ cx: 400, cy: 360 }} size={{ w: 700, h: 480 }} />}
      title="Le pèlerinage qui ruina l'Égypte"
      subtitle="Mansa Moussa · 1324"
      variant={variant}
    />
  );
};
