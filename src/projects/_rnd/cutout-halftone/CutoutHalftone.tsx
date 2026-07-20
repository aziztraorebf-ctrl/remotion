import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  delayRender,
  continueRender,
  staticFile,
} from "remotion";

type Props = {
  imageSrc: string;
  strokeColor: string;
  strokeX: number;
  strokeY: number;
  strokeOpacity: number;
  scale: number;
  dotSize: number;
  width: number;
  height: number;
};

export const defaultProps: Props = {
  imageSrc: staticFile("flags-portraits/leaders/leader-portrait-editorial.png"),
  strokeColor: "#E8A427",
  strokeX: -20,
  strokeY: -14,
  strokeOpacity: 0.9,
  scale: 1,
  dotSize: 5,
  width: 380,
  height: 460,
};

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export const CutoutHalftone: React.FC<Partial<Props>> = (overrides) => {
  const props = { ...defaultProps, ...overrides };
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [handle] = useState(() => delayRender("loading-portrait"));

  // Spring pop entrance
  const pop = spring({ frame, fps, config: { damping: 13, stiffness: 110 } });
  const scaleAnim = interpolate(pop, [0, 1], [0.65, props.scale]);
  const opacity = interpolate(pop, [0, 0.15, 1], [0, 0, 1]);

  const drawCanvases = useCallback(
    (img: HTMLImageElement) => {
      // --- Halftone canvas ---
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d")!;
        const off = document.createElement("canvas");
        off.width = props.width;
        off.height = props.height;
        const octx = off.getContext("2d")!;
        octx.drawImage(img, 0, 0, props.width, props.height);
        const id = octx.getImageData(0, 0, props.width, props.height);

        ctx.clearRect(0, 0, props.width, props.height);
        const step = props.dotSize * 2;

        for (let y = 0; y < props.height; y += step) {
          for (let x = 0; x < props.width; x += step) {
            const i = (y * props.width + x) * 4;
            const a = id.data[i + 3];
            if (a < 30) continue;
            const lum =
              0.299 * id.data[i] +
              0.587 * id.data[i + 1] +
              0.114 * id.data[i + 2];
            const radius = (1 - lum / 255) * props.dotSize * 1.3;
            if (radius < 0.4) continue;
            ctx.beginPath();
            ctx.arc(x + step / 2, y + step / 2, radius, 0, Math.PI * 2);
            ctx.fillStyle = "#000000";
            ctx.fill();
          }
        }
      }

      // --- Stroke shadow canvas ---
      const sCanvas = strokeCanvasRef.current;
      if (sCanvas) {
        const ctx = sCanvas.getContext("2d")!;
        const off = document.createElement("canvas");
        off.width = props.width;
        off.height = props.height;
        const octx = off.getContext("2d")!;
        octx.drawImage(img, 0, 0, props.width, props.height);
        const id = octx.getImageData(0, 0, props.width, props.height);
        const { r: sr, g: sg, b: sb } = hexToRgb(props.strokeColor);
        const out = ctx.createImageData(props.width, props.height);
        for (let i = 0; i < id.data.length; i += 4) {
          const a = id.data[i + 3];
          if (a > 20) {
            out.data[i] = sr;
            out.data[i + 1] = sg;
            out.data[i + 2] = sb;
            out.data[i + 3] = Math.round(a * props.strokeOpacity);
          }
        }
        ctx.putImageData(out, 0, 0);
      }

      continueRender(handle);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.imageSrc, props.width, props.height, props.dotSize, props.strokeColor, props.strokeOpacity]
  );

  useEffect(() => {
    const img = new Image();
    img.onload = () => drawCanvases(img);
    img.onerror = () => continueRender(handle);
    img.src = props.imageSrc;
  }, [props.imageSrc, drawCanvases, handle]);

  return (
    <div
      style={{
        position: "relative",
        width: props.width,
        height: props.height,
        transform: `scale(${scaleAnim})`,
        transformOrigin: "bottom center",
        opacity,
      }}
    >
      {/* Stroke shadow décalée */}
      <canvas
        ref={strokeCanvasRef}
        width={props.width}
        height={props.height}
        style={{
          position: "absolute",
          top: props.strokeY,
          left: props.strokeX,
          pointerEvents: "none",
        }}
      />
      {/* Halftone principal */}
      <canvas
        ref={canvasRef}
        width={props.width}
        height={props.height}
        style={{ position: "relative" }}
      />
    </div>
  );
};
