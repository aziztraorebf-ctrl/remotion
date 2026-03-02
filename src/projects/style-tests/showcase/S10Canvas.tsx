import React, { useRef, useEffect } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { W, H, GROUND_Y, enter, exit, StyleTitle } from "./ShowcaseShared";

const BG = "#f5ede0";

function drawScene(ctx: CanvasRenderingContext2D, frame: number): void {
  ctx.clearRect(0, 0, W, H);

  // Background — warm paper
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Subtle paper grain
  ctx.save();
  for (let i = 0; i < 1400; i++) {
    const seed = i * 6271;
    const gx = ((seed * 1103515245 + 12345) & 0x7fffffff) % W;
    const gy = ((seed * 1664525 + 1013904223) & 0x7fffffff) % H;
    const ga = ((seed * 22695477 + 1) & 0x7fffffff) % 100;
    ctx.fillStyle = `rgba(100, 60, 20, ${ga / 4000})`;
    ctx.fillRect(gx, gy, 1, 1);
  }
  ctx.restore();

  // Ground
  ctx.save();
  ctx.fillStyle = "#8a7050";
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
  ctx.strokeStyle = "#5a3a18";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(W, GROUND_Y);
  ctx.stroke();
  ctx.restore();

  // Background foliage silhouettes
  drawFoliage(ctx, frame);

  // Compute positions
  const bardWalking = frame < 88;
  const danseurWalking = frame < 96;

  const bardX = bardWalking
    ? interpolate(frame, [15, 88], [180, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 640;
  const danseurX = danseurWalking
    ? interpolate(frame, [28, 96], [W - 180, 1120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1120;

  const bardPhase = frame * 0.14;
  const danseurPhase = frame * 0.16 + 0.7;

  const isBardPlaying = frame >= 140 && frame < 260;
  const isDanseurSpinning = frame >= 160 && frame < 260;
  const spinAngle = isDanseurSpinning
    ? interpolate(frame - 160, [0, 60], [0, Math.PI * 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Draw characters
  drawBard(ctx, bardX, GROUND_Y, bardWalking ? bardPhase : 0, isBardPlaying, frame);
  drawDanseur(ctx, danseurX, GROUND_Y, danseurWalking ? danseurPhase : 0, isDanseurSpinning, spinAngle, frame);

  // Music notes
  if (isBardPlaying) {
    drawMusicNotes(ctx, bardX, frame);
  }

  // Labels
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.font = "italic 22px Georgia, serif";
  ctx.fillStyle = "#3a2010";
  ctx.textAlign = "center";
  const bardLabelOpacity = interpolate(frame, [88, 100], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const danseurLabelOpacity = interpolate(frame, [96, 108], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (bardLabelOpacity > 0) {
    ctx.globalAlpha = bardLabelOpacity;
    ctx.fillText("Le Barde", bardX, GROUND_Y + 48);
  }
  if (danseurLabelOpacity > 0) {
    ctx.globalAlpha = danseurLabelOpacity;
    ctx.fillText("La Danseuse", danseurX, GROUND_Y + 48);
  }
  ctx.restore();
}

function crayonStroke(ctx: CanvasRenderingContext2D, frame: number, seed: number): void {
  // Multiple offset passes = crayon texture
  for (let j = 0; j < 3; j++) {
    ctx.save();
    ctx.translate(
      Math.sin(frame * 0.012 + seed * 1.4 + j * 0.8) * 1.4,
      Math.sin(frame * 0.017 + seed * 2.1 + j * 0.6) * 1.0,
    );
    ctx.globalAlpha = 0.55 + j * 0.18;
    ctx.stroke();
    ctx.restore();
  }
}

function drawBard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  walkPhase: number,
  playing: boolean,
  frame: number,
): void {
  const bob = Math.abs(Math.sin(walkPhase)) * 5;
  const legSwing = Math.sin(walkPhase) * 0.32;
  const legSwing2 = Math.sin(walkPhase + Math.PI) * 0.32;
  const armSwing = Math.sin(walkPhase + Math.PI) * 0.28;

  // Guitar arm angle when playing
  const guitarArmAngle = playing ? -Math.PI / 3 - Math.sin(frame * 0.15) * 0.15 : armSwing;

  const torsoY = y - 260 + bob;
  const headCy = y - 330 + bob;
  const hipY = y - 110 + bob;

  ctx.save();

  // Body — tunic
  ctx.strokeStyle = "#4a2810";
  ctx.fillStyle = "#7a4a22";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x - 30, torsoY);
  ctx.lineTo(x + 30, torsoY);
  ctx.lineTo(x + 32, torsoY + 110);
  ctx.lineTo(x - 32, torsoY + 110);
  ctx.closePath();
  ctx.fill();
  crayonStroke(ctx, frame, 1);

  // Legs
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#3a2810";
  // Left leg
  ctx.save();
  ctx.translate(x - 14, hipY);
  ctx.rotate(legSwing2);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.sin(legSwing2) * 12, 110);
  crayonStroke(ctx, frame, 3);
  // Boot
  ctx.fillStyle = "#1a1008";
  ctx.beginPath();
  ctx.ellipse(Math.sin(legSwing2) * 12 - 4, 112, 16, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Right leg
  ctx.save();
  ctx.translate(x + 14, hipY);
  ctx.rotate(legSwing);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.sin(legSwing) * -12, 110);
  crayonStroke(ctx, frame, 4);
  ctx.fillStyle = "#1a1008";
  ctx.beginPath();
  ctx.ellipse(Math.sin(legSwing) * -12 + 4, 112, 16, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Back arm
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#c8a070";
  ctx.save();
  ctx.translate(x - 28, torsoY + 20);
  ctx.rotate(armSwing);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-8, 72);
  crayonStroke(ctx, frame, 5);
  ctx.restore();

  // Guitar (when playing)
  if (playing) {
    ctx.save();
    ctx.translate(x + 28, torsoY + 18);
    ctx.rotate(guitarArmAngle);
    // Arm
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#c8a070";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(20, 58);
    crayonStroke(ctx, frame, 6);
    // Guitar body
    ctx.translate(24, 66);
    ctx.fillStyle = "#8a4a10";
    ctx.strokeStyle = "#3a2010";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 18, 0.3, 0, Math.PI * 2);
    ctx.fill();
    crayonStroke(ctx, frame, 7);
    // Sound hole
    ctx.fillStyle = "#1a0808";
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    // Neck
    ctx.strokeStyle = "#6a3a10";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-10, -16);
    ctx.lineTo(-20, -70);
    crayonStroke(ctx, frame, 8);
    // Strings
    ctx.strokeStyle = "#c8c0a0";
    ctx.lineWidth = 1;
    for (let s = 0; s < 4; s++) {
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(-8 + s * 4, -14);
      ctx.lineTo(-18 + s * 2, -68);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  } else {
    // Arm at rest
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#c8a070";
    ctx.save();
    ctx.translate(x + 28, torsoY + 18);
    ctx.rotate(-armSwing);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(8, 70);
    crayonStroke(ctx, frame, 6);
    ctx.restore();
  }

  // Head
  ctx.fillStyle = "#d4a870";
  ctx.strokeStyle = "#4a2810";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(x, headCy, 32, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  crayonStroke(ctx, frame, 9);
  // Hat (beret)
  ctx.fillStyle = "#4a2810";
  ctx.beginPath();
  ctx.ellipse(x, headCy - 22, 34, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 6, headCy - 32, 22, 14, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Eyes
  ctx.fillStyle = "#2a1008";
  ctx.beginPath();
  ctx.arc(x - 11, headCy - 4, 4, 0, Math.PI * 2);
  ctx.arc(x + 11, headCy - 4, 4, 0, Math.PI * 2);
  ctx.fill();
  // Smile / song mouth
  ctx.strokeStyle = "#4a2810";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  if (playing) {
    ctx.arc(x, headCy + 10, 8, 0.1 * Math.PI, 0.9 * Math.PI);
  } else {
    ctx.moveTo(x - 8, headCy + 12);
    ctx.quadraticCurveTo(x, headCy + 20, x + 8, headCy + 12);
  }
  crayonStroke(ctx, frame, 10);

  ctx.restore();
}

function drawDanseur(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  walkPhase: number,
  spinning: boolean,
  spinAngle: number,
  frame: number,
): void {
  const bob = Math.abs(Math.sin(walkPhase)) * 5;
  const legSwing = Math.sin(walkPhase + 0.5) * 0.3;
  const legSwing2 = Math.sin(walkPhase + 0.5 + Math.PI) * 0.3;

  const torsoY = y - 240 + bob;
  const headCy = y - 310 + bob;
  const hipY = y - 100 + bob;

  ctx.save();

  if (spinning) {
    ctx.save();
    ctx.translate(x, y - 150);
    ctx.rotate(spinAngle);
    ctx.translate(-x, -(y - 150));
  }

  // Dress/skirt
  ctx.fillStyle = "#c83050";
  ctx.strokeStyle = "#6a1820";
  ctx.lineWidth = 2.5;
  const skirtSpread = spinning ? 60 + Math.sin(frame * 0.3) * 10 : 38;
  ctx.beginPath();
  ctx.moveTo(x - 30, torsoY + 90);
  ctx.quadraticCurveTo(x - skirtSpread, y - 20, x - skirtSpread + 10, y);
  ctx.lineTo(x + skirtSpread - 10, y);
  ctx.quadraticCurveTo(x + skirtSpread, y - 20, x + 30, torsoY + 90);
  ctx.closePath();
  ctx.fill();
  crayonStroke(ctx, frame, 20);

  // Torso
  ctx.fillStyle = "#d85070";
  ctx.strokeStyle = "#6a1820";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 26, torsoY);
  ctx.lineTo(x + 26, torsoY);
  ctx.lineTo(x + 28, torsoY + 92);
  ctx.lineTo(x - 28, torsoY + 92);
  ctx.closePath();
  ctx.fill();
  crayonStroke(ctx, frame, 21);

  // Arms — raised gracefully when spinning
  const leftArmAngle = spinning ? -Math.PI / 2.2 - spinAngle * 0.1 : legSwing2 * 0.8;
  const rightArmAngle = spinning ? -Math.PI / 2.4 + spinAngle * 0.1 : -legSwing * 0.8;

  ctx.lineWidth = 10;
  ctx.strokeStyle = "#e0b080";
  // Left arm
  ctx.save();
  ctx.translate(x - 26, torsoY + 16);
  ctx.rotate(leftArmAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-12, 64);
  crayonStroke(ctx, frame, 22);
  ctx.restore();
  // Right arm
  ctx.save();
  ctx.translate(x + 26, torsoY + 16);
  ctx.rotate(rightArmAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(12, 64);
  crayonStroke(ctx, frame, 23);
  ctx.restore();

  // Legs
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#c83050";
  ctx.save();
  ctx.translate(x - 12, hipY);
  ctx.rotate(spinning ? Math.sin(spinAngle * 3) * 0.3 : legSwing2);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-6, 100);
  crayonStroke(ctx, frame, 24);
  // Ballet shoe
  ctx.fillStyle = "#f0c0a0";
  ctx.beginPath();
  ctx.ellipse(-8, 104, 12, 6, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(x + 12, hipY);
  ctx.rotate(spinning ? Math.sin(spinAngle * 3 + Math.PI) * 0.3 : legSwing);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(6, 100);
  crayonStroke(ctx, frame, 25);
  ctx.fillStyle = "#f0c0a0";
  ctx.beginPath();
  ctx.ellipse(8, 104, 12, 6, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Head
  ctx.fillStyle = "#e0b080";
  ctx.strokeStyle = "#6a3010";
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.ellipse(x, headCy, 28, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  crayonStroke(ctx, frame, 26);
  // Hair bun
  ctx.fillStyle = "#4a2010";
  ctx.beginPath();
  ctx.ellipse(x, headCy - 28, 22, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, headCy - 38, 10, 0, Math.PI * 2);
  ctx.fill();
  // Eyes
  ctx.fillStyle = "#2a1008";
  ctx.beginPath();
  ctx.arc(x - 10, headCy - 2, 4, 0, Math.PI * 2);
  ctx.arc(x + 10, headCy - 2, 4, 0, Math.PI * 2);
  ctx.fill();
  // Smile
  ctx.strokeStyle = "#6a3010";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 8, headCy + 12);
  ctx.quadraticCurveTo(x, headCy + 22, x + 8, headCy + 12);
  crayonStroke(ctx, frame, 27);

  if (spinning) ctx.restore();

  ctx.restore();
}

function drawFoliage(ctx: CanvasRenderingContext2D, frame: number): void {
  ctx.save();
  const sway = Math.sin(frame * 0.05) * 4;
  [[180, GROUND_Y - 160], [1720, GROUND_Y - 140], [960, GROUND_Y - 180]].forEach(([tx, ty], i) => {
    ctx.fillStyle = i === 2 ? "#4a7a30" : "#3a6020";
    ctx.strokeStyle = "#2a4810";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx + sway, ty);
    ctx.bezierCurveTo(tx - 60 + sway, ty - 80, tx + 60 + sway, ty - 80, tx + sway, ty);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(tx + sway * 0.5, ty + 20);
    ctx.bezierCurveTo(tx - 80 + sway * 0.5, ty - 60, tx + 80 + sway * 0.5, ty - 60, tx + sway * 0.5, ty + 20);
    ctx.fill();
    // Trunk
    ctx.strokeStyle = "#3a2010";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(tx, ty + 20);
    ctx.lineTo(tx, GROUND_Y);
    ctx.stroke();
  });
  ctx.restore();
}

function drawMusicNotes(ctx: CanvasRenderingContext2D, x: number, frame: number): void {
  const notes = [
    { delay: 0,  xOff: 20 },
    { delay: 12, xOff: 50 },
    { delay: 24, xOff: 10 },
    { delay: 36, xOff: 38 },
  ];
  notes.forEach(({ delay, xOff }, i) => {
    const f = (frame - delay) % 60;
    if (f < 0) return;
    const ny = GROUND_Y - 340 - f * 2.2;
    const nx = x + xOff + Math.sin(f * 0.18 + i) * 16;
    const opacity = 1 - f / 60;
    if (opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#3a2010";
    ctx.strokeStyle = "#3a2010";
    ctx.lineWidth = 2;
    // Note head
    ctx.beginPath();
    ctx.ellipse(nx, ny, 7, 5, -0.4, 0, Math.PI * 2);
    ctx.fill();
    // Note stem
    ctx.beginPath();
    ctx.moveTo(nx + 6, ny);
    ctx.lineTo(nx + 6, ny - 22);
    ctx.stroke();
    // Flag
    if (i % 2 === 0) {
      ctx.beginPath();
      ctx.moveTo(nx + 6, ny - 22);
      ctx.quadraticCurveTo(nx + 24, ny - 18, nx + 18, ny - 8);
      ctx.stroke();
    }
    ctx.restore();
  });
}

export const S10Canvas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bgOpacity = enter(frame, 0, 20);
  const sceneOpacity = frame >= 280 ? exit(frame, 280, 20) : bgOpacity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawScene(ctx, frame);
  }, [frame]);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: sceneOpacity }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ position: "absolute", top: 0, left: 0, display: "block" }}
      />
      <StyleTitle
        frame={frame}
        number="10"
        title="Canvas 2D Procedural"
        subtitle="Rendu frame-par-frame, texture crayon, dessin programmatique"
        textColor="#3a2010"
        bgColor="rgba(245,237,224,0.90)"
      />
    </div>
  );
};
