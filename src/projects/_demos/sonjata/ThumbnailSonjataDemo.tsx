import React from "react";
import { ThumbnailSonjata } from "../../_shared/thumbnails/ThumbnailSonjata";
import { SonjataCroquisIcon } from "../../_shared/thumbnails/icons/sonjata/SonjataCroquisIcon";

// ─────────────────────────────────────────────────────────────────────────────
// ThumbnailSonjataDemo — Thumbnail Sonjata pour épopée Mandé 1235
// Métaphore : silhouette héro avec arc + baobab + soleil couchant
// ─────────────────────────────────────────────────────────────────────────────

export interface ThumbnailSonjataDemoProps {
  variant?: "A" | "B";
}

export const ThumbnailSonjataDemo: React.FC<ThumbnailSonjataDemoProps> = ({
  variant = "A",
}) => {
  return (
    <ThumbnailSonjata
      icon={<SonjataCroquisIcon />}
      title="Les premiers droits de l'homme en Afrique"
      subtitle="Sonjata · Empire Mandé · 1235"
      variant={variant}
    />
  );
};
