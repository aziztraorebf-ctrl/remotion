import React from "react";
import { Series } from "remotion";
import { S01StickFigure } from "./S01StickFigure";
import { S02Geometrique } from "./S02Geometrique";
import { S03Enluminure } from "./S03Enluminure";
import { S04Gravure } from "./S04Gravure";
import { S05Cartoon } from "./S05Cartoon";
import { S06Silhouette } from "./S06Silhouette";
import { S07PaperCutout } from "./S07PaperCutout";
import { S08Sketch } from "./S08Sketch";
import { S09PixelArt } from "./S09PixelArt";
import { S10Canvas } from "./S10Canvas";

// ============================================================
// StyleShowcase — Panorama complet des styles de personnages
//
// 10 styles x 300 frames = 3000 frames (~100s @ 30fps)
//
// Style 01 — Stick Figure SVG     (f0    - f299)
// Style 02 — Geometrique Bauhaus  (f300  - f599)
// Style 03 — Enluminure Medievale (f600  - f899)
// Style 04 — Gravure Monochrome   (f900  - f1199)
// Style 05 — Cartoon Expressif    (f1200 - f1499)
// Style 06 — Silhouette           (f1500 - f1799)
// Style 07 — Paper Cutout         (f1800 - f2099)
// Style 08 — Sketch / Crayon      (f2100 - f2399)
// Style 09 — CSS Pixel Art        (f2400 - f2699)
// Style 10 — Canvas 2D Procedural (f2700 - f2999)
// ============================================================

export const StyleShowcase: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={300}>
        <S01StickFigure />
      </Series.Sequence>
      <Series.Sequence durationInFrames={300}>
        <S02Geometrique />
      </Series.Sequence>
      <Series.Sequence durationInFrames={300}>
        <S03Enluminure />
      </Series.Sequence>
      <Series.Sequence durationInFrames={300}>
        <S04Gravure />
      </Series.Sequence>
      <Series.Sequence durationInFrames={300}>
        <S05Cartoon />
      </Series.Sequence>
      <Series.Sequence durationInFrames={300}>
        <S06Silhouette />
      </Series.Sequence>
      <Series.Sequence durationInFrames={300}>
        <S07PaperCutout />
      </Series.Sequence>
      <Series.Sequence durationInFrames={300}>
        <S08Sketch />
      </Series.Sequence>
      <Series.Sequence durationInFrames={300}>
        <S09PixelArt />
      </Series.Sequence>
      <Series.Sequence durationInFrames={300}>
        <S10Canvas />
      </Series.Sequence>
    </Series>
  );
};
