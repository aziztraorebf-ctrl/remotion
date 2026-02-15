import React from "react";
import { useCurrentFrame, useVideoConfig, staticFile, Img } from "remotion";

interface ParallaxLayer {
  src: string; // path relative to public/
  speed: number; // scroll speed multiplier (0 = static, 1 = normal)
  opacity?: number;
  yOffset?: number; // vertical offset in pixels
}

interface ParallaxBackgroundProps {
  layers: ParallaxLayer[];
  baseSpeed?: number; // base pixels per frame
}

// Multi-layer parallax background using real PNG assets
export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  layers,
  baseSpeed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        overflow: "hidden",
      }}
    >
      {layers.map((layer, i) => {
        const offset = frame * baseSpeed * layer.speed;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: layer.yOffset ?? 0,
              left: 0,
              width: width * 3,
              height,
              transform: `translateX(${-offset % width}px)`,
              opacity: layer.opacity ?? 1,
            }}
          >
            {/* Repeat the image 3 times for seamless scrolling */}
            {[0, 1, 2].map((rep) => (
              <Img
                key={rep}
                src={staticFile(layer.src)}
                style={{
                  position: "absolute",
                  left: rep * width,
                  top: 0,
                  width,
                  height: "100%",
                  objectFit: "cover",
                  imageRendering: "pixelated",
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};
