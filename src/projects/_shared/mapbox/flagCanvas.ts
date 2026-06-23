// flagCanvas.ts — Bibliotheque drapeaux canvas pur (zero fetch, headless-safe)
// Helper central : drawFlagCanvas(iso) + pushFlagToMap(map, iso)
// Tous les drapeaux sont dessines en canvas pur ou charges depuis public/_shared/flags/
// Usage : await pushFlagToMap(map, "MAR") → injecte "flag-MAR" dans Mapbox

import mapboxgl from "mapbox-gl";
import { staticFile } from "remotion";

// Pays avec drapeau canvas pur (synchrone, disponible a f0, pas de fichier requis)
const PURE_CANVAS_ISOS = new Set([
  "MAR", "ESH", // Maroc + Sahara occidental (meme drapeau)
  "SEN", "CIV", "CMR", "GHA", "NGA", "MLI", "BFA", "GIN", "TUN", "DZA", "LBY", "EGY",
  "ETH", "KEN", "TZA", "UGA", "RWA", "BDI", "ZAF", "ZWE", "ZMB", "COD", "AGO",
  "MDG", "MOZ", "BWA", "NAM", "MWI", "SOM", "SDN", "SSD", "CAF", "GAB", "COG",
  "CHN", "USA", "GBR", "RUS", "JPN", "BRA", "IND", "SAU", "ARE",
  "DEU", "FRA", "ESP", "ITA", "PRT", "BEL", "NLD", "NOR",
]);

// Mapping iso → fichier PNG dans public/_shared/flags/
const FLAG_PNG_FILES: Record<string, string> = {
  ESP: "es.png",
  FRA: "fr.png",
  DEU: "de.png",
  MAR: "ma.png",
};

// ── DESSIN CANVAS PUR par pays ──────────────────────────────────────────────────

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return c;
}

// Etoile 5 branches generique (centree, pour les drapeaux a etoile)
function drawStar5(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, r: number, color: string, stroke?: string, sw?: number) {
  ctx.fillStyle = color;
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw ?? 1; }
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const ao = (i * 72 - 90) * Math.PI / 180;
    const ai = ((i * 72 + 36) - 90) * Math.PI / 180;
    if (i === 0) ctx.moveTo(cx + Math.cos(ao) * R, cy + Math.sin(ao) * R);
    else ctx.lineTo(cx + Math.cos(ao) * R, cy + Math.sin(ao) * R);
    ctx.lineTo(cx + Math.cos(ai) * r, cy + Math.sin(ai) * r);
  }
  ctx.closePath();
  ctx.fill();
  if (stroke) ctx.stroke();
}

// Croissant generique (pour les drapeaux musulmans)
function drawCrescent(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, color: string, offset = 0.28) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = ctx.canvas.style.background || "#000";
  // Cercle decoupe pour former le croissant
  ctx.beginPath();
  ctx.arc(cx + R * offset, cy, R * 0.82, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

// ── Drapeaux africains ──────────────────────────────────────────────────────────

function drawMAR(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#c1272d"; ctx.fillRect(0, 0, size, size);
  const cx = size / 2, cy = size / 2, R = size * 0.28, r = R * 0.38;
  ctx.fillStyle = "#006233"; ctx.strokeStyle = "#006233"; ctx.lineWidth = size * 0.015;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const ao = (i * 72 - 90) * Math.PI / 180; const ai = ((i * 72 + 36) - 90) * Math.PI / 180;
    if (i === 0) ctx.moveTo(cx + Math.cos(ao) * R, cy + Math.sin(ao) * R);
    else ctx.lineTo(cx + Math.cos(ao) * R, cy + Math.sin(ao) * R);
    ctx.lineTo(cx + Math.cos(ai) * r, cy + Math.sin(ai) * r);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  return c;
}

function drawSEN(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const w3 = size / 3;
  ctx.fillStyle = "#00853f"; ctx.fillRect(0, 0, w3, size);
  ctx.fillStyle = "#fcd116"; ctx.fillRect(w3, 0, w3, size);
  ctx.fillStyle = "#e31b23"; ctx.fillRect(w3 * 2, 0, w3, size);
  drawStar5(ctx, size / 2, size / 2, size * 0.16, size * 0.065, "#00853f");
  return c;
}

function drawCIV(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const w3 = size / 3;
  ctx.fillStyle = "#f77f00"; ctx.fillRect(0, 0, w3, size);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(w3, 0, w3, size);
  ctx.fillStyle = "#009a44"; ctx.fillRect(w3 * 2, 0, w3, size);
  return c;
}

function drawCMR(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const w3 = size / 3;
  ctx.fillStyle = "#007a5e"; ctx.fillRect(0, 0, w3, size);
  ctx.fillStyle = "#ce1126"; ctx.fillRect(w3, 0, w3, size);
  ctx.fillStyle = "#fcd116"; ctx.fillRect(w3 * 2, 0, w3, size);
  drawStar5(ctx, size / 2, size / 2, size * 0.14, size * 0.056, "#fcd116");
  return c;
}

function drawGHA(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h3 = size / 3;
  ctx.fillStyle = "#006b3f"; ctx.fillRect(0, 0, size, h3);
  ctx.fillStyle = "#fcd116"; ctx.fillRect(0, h3, size, h3);
  ctx.fillStyle = "#ce1126"; ctx.fillRect(0, h3 * 2, size, h3);
  drawStar5(ctx, size / 2, size / 2, size * 0.14, size * 0.056, "#000000");
  return c;
}

function drawNGA(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const w3 = size / 3;
  ctx.fillStyle = "#008751"; ctx.fillRect(0, 0, w3, size);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(w3, 0, w3, size);
  ctx.fillStyle = "#008751"; ctx.fillRect(w3 * 2, 0, w3, size);
  return c;
}

function drawMLI(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const w3 = size / 3;
  ctx.fillStyle = "#009a00"; ctx.fillRect(0, 0, w3, size);
  ctx.fillStyle = "#ffcd00"; ctx.fillRect(w3, 0, w3, size);
  ctx.fillStyle = "#de0000"; ctx.fillRect(w3 * 2, 0, w3, size);
  return c;
}

function drawBFA(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#ef2b2d"; ctx.fillRect(0, 0, size, size / 2);
  ctx.fillStyle = "#009a44"; ctx.fillRect(0, size / 2, size, size / 2);
  drawStar5(ctx, size / 2, size / 2, size * 0.15, size * 0.06, "#fcd116");
  return c;
}

function drawGIN(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const w3 = size / 3;
  ctx.fillStyle = "#ce1126"; ctx.fillRect(0, 0, w3, size);
  ctx.fillStyle = "#fcd116"; ctx.fillRect(w3, 0, w3, size);
  ctx.fillStyle = "#009460"; ctx.fillRect(w3 * 2, 0, w3, size);
  return c;
}

function drawTUN(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#e70013"; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.28, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#e70013";
  drawCrescent(ctx, size * 0.47, size / 2, size * 0.17, "#e70013", 0.30);
  drawStar5(ctx, size * 0.57, size / 2, size * 0.09, size * 0.036, "#e70013");
  return c;
}

function drawDZA(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#006233"; ctx.fillRect(0, 0, size / 2, size);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(size / 2, 0, size / 2, size);
  ctx.fillStyle = "#d21034";
  drawCrescent(ctx, size * 0.48, size / 2, size * 0.2, "#d21034", 0.28);
  drawStar5(ctx, size * 0.59, size / 2, size * 0.1, size * 0.04, "#d21034");
  return c;
}

function drawLBY(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, size, size);
  const h = size / 4;
  ctx.fillStyle = "#239e46"; ctx.fillRect(0, 0, size, h);
  ctx.fillStyle = "#e70013"; ctx.fillRect(0, size - h, size, h);
  ctx.fillStyle = "#ffffff";
  drawCrescent(ctx, size * 0.46, size / 2, size * 0.18, "#ffffff", 0.28);
  drawStar5(ctx, size * 0.57, size / 2, size * 0.09, size * 0.036, "#ffffff");
  return c;
}

function drawEGY(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h3 = size / 3;
  ctx.fillStyle = "#ce1126"; ctx.fillRect(0, 0, size, h3);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, h3, size, h3);
  ctx.fillStyle = "#000000"; ctx.fillRect(0, h3 * 2, size, h3);
  // Aigle stylise (simplifie)
  ctx.fillStyle = "#c09300";
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.1, 0, Math.PI * 2); ctx.fill();
  return c;
}

function drawETH(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h3 = size / 3;
  ctx.fillStyle = "#078930"; ctx.fillRect(0, 0, size, h3);
  ctx.fillStyle = "#fcdd09"; ctx.fillRect(0, h3, size, h3);
  ctx.fillStyle = "#da121a"; ctx.fillRect(0, h3 * 2, size, h3);
  ctx.fillStyle = "#0f47af";
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fcdd09";
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.14, 0, Math.PI * 2); ctx.fill();
  return c;
}

function drawKEN(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h = size / 5;
  ctx.fillStyle = "#006600"; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#bb0000"; ctx.fillRect(0, h, size, h * 3);
  ctx.fillStyle = "#000000"; ctx.fillRect(0, h * 0.8, size, h * 0.4);
  ctx.fillRect(0, h * 2.8, size, h * 0.4);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, h * 0.7, size, h * 0.2); ctx.fillRect(0, h * 3, size, h * 0.2);
  return c;
}

function drawTZA(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#1eb53a"; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#00a3dd"; ctx.fillRect(0, size * 0.6, size, size * 0.4);
  ctx.strokeStyle = "#fcd116"; ctx.lineWidth = size * 0.1;
  ctx.beginPath(); ctx.moveTo(0, size); ctx.lineTo(size, 0); ctx.stroke();
  ctx.strokeStyle = "#000000"; ctx.lineWidth = size * 0.06;
  ctx.beginPath(); ctx.moveTo(-size * 0.05, size * 1.05); ctx.lineTo(size * 1.05, -size * 0.05); ctx.stroke();
  return c;
}

function drawZAF(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#de3831"; ctx.fillRect(0, 0, size, size / 2);
  ctx.fillStyle = "#0032a0"; ctx.fillRect(0, size / 2, size, size / 2);
  ctx.fillStyle = "#007a4d";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size * 0.4, size / 2); ctx.lineTo(0, size); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#ffb81c"; ctx.lineWidth = size * 0.09;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size * 0.4, size / 2); ctx.lineTo(0, size); ctx.stroke();
  ctx.strokeStyle = "#ffffff"; ctx.lineWidth = size * 0.05;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size * 0.4, size / 2); ctx.lineTo(0, size); ctx.stroke();
  ctx.fillStyle = "#000000"; ctx.fillRect(size * 0.38, size * 0.35, size * 0.62, size * 0.3);
  ctx.fillStyle = "#007a4d"; ctx.fillRect(size * 0.38, size * 0.38, size * 0.62, size * 0.24);
  ctx.strokeStyle = "#ffb81c"; ctx.lineWidth = size * 0.06;
  ctx.beginPath(); ctx.moveTo(size * 0.38, size / 2 - size * 0.06); ctx.lineTo(size, size / 2 - size * 0.06); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(size * 0.38, size / 2 + size * 0.06); ctx.lineTo(size, size / 2 + size * 0.06); ctx.stroke();
  return c;
}

function drawCOD(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#007fff"; ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "#f7d618"; ctx.lineWidth = size * 0.12;
  ctx.beginPath(); ctx.moveTo(0, size); ctx.lineTo(size, 0); ctx.stroke();
  ctx.fillStyle = "#ce1126"; ctx.fillRect(0, 0, size * 0.18, size * 0.5);
  drawStar5(ctx, size * 0.09, size * 0.12, size * 0.09, size * 0.036, "#f7d618");
  return c;
}

function drawAGO(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#cc0000"; ctx.fillRect(0, 0, size, size / 2);
  ctx.fillStyle = "#000000"; ctx.fillRect(0, size / 2, size, size / 2);
  ctx.fillStyle = "#ffcc00";
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.15, 0, Math.PI * 2); ctx.fill();
  return c;
}

function drawGAB(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h3 = size / 3;
  ctx.fillStyle = "#009e60"; ctx.fillRect(0, 0, size, h3);
  ctx.fillStyle = "#fcd116"; ctx.fillRect(0, h3, size, h3);
  ctx.fillStyle = "#3a75c4"; ctx.fillRect(0, h3 * 2, size, h3);
  return c;
}

function drawCOG(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#009543"; ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "#fbde4a"; ctx.lineWidth = size * 0.12;
  ctx.beginPath(); ctx.moveTo(0, size); ctx.lineTo(size, 0); ctx.stroke();
  ctx.fillStyle = "#dc241f"; ctx.fillRect(0, 0, size, size * 0.4);
  return c;
}

function drawBWA(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h5 = size / 5;
  ctx.fillStyle = "#75aadb"; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#000000"; ctx.fillRect(0, h5 * 2, size, h5);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, h5 * 2 + size * 0.04, size, h5 - size * 0.08);
  return c;
}

function drawNOR(size = 512): HTMLCanvasElement {
  // Drapeau norvegien : fond rouge, croix nordique blanche, croix bleue par-dessus.
  // Croix decalee vers la gauche (vexillologie nordique). Proportions adaptees au canvas carre.
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#ba0c2f"; ctx.fillRect(0, 0, size, size);   // rouge
  const vx = size * 0.36;       // centre vertical de la croix (decale a gauche)
  const hy = size * 0.5;        // centre horizontal de la croix
  const wWhite = size * 0.22;   // largeur croix blanche
  const wBlue  = size * 0.11;   // largeur croix bleue
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(vx - wWhite / 2, 0, wWhite, size);             // bras vertical blanc
  ctx.fillRect(0, hy - wWhite / 2, size, wWhite);             // bras horizontal blanc
  ctx.fillStyle = "#00205b";
  ctx.fillRect(vx - wBlue / 2, 0, wBlue, size);               // bras vertical bleu
  ctx.fillRect(0, hy - wBlue / 2, size, wBlue);               // bras horizontal bleu
  return c;
}

function drawNAM(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#009543"; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#003580"; ctx.fillRect(0, 0, size, size * 0.45);
  ctx.strokeStyle = "#ffffff"; ctx.lineWidth = size * 0.1;
  ctx.beginPath(); ctx.moveTo(0, size); ctx.lineTo(size, 0); ctx.stroke();
  ctx.strokeStyle = "#d21034"; ctx.lineWidth = size * 0.05;
  ctx.beginPath(); ctx.moveTo(0, size); ctx.lineTo(size, 0); ctx.stroke();
  ctx.fillStyle = "#d21034"; ctx.beginPath(); ctx.arc(size * 0.28, size * 0.28, size * 0.12, 0, Math.PI * 2); ctx.fill();
  return c;
}

function drawZWE(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h7 = size / 7;
  const colors = ["#006400","#ffd200","#de2010","#000000","#de2010","#ffd200","#006400"];
  for (let i = 0; i < 7; i++) { ctx.fillStyle = colors[i]; ctx.fillRect(0, i * h7, size, h7); }
  return c;
}

function drawZMB(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#198a00"; ctx.fillRect(0, 0, size, size);
  const h3 = size / 3;
  ctx.fillStyle = "#de2010"; ctx.fillRect(size * 0.67, 0, h3 * 0.45, size);
  ctx.fillStyle = "#000000"; ctx.fillRect(size * 0.67 + h3 * 0.45, 0, h3 * 0.45, size);
  ctx.fillStyle = "#ef7d00"; ctx.fillRect(size * 0.67 + h3 * 0.9, 0, h3 * 0.45, size);
  return c;
}

function drawMDG(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, size * 0.33, size);
  ctx.fillStyle = "#fc3d32"; ctx.fillRect(size * 0.33, 0, size * 0.67, size / 2);
  ctx.fillStyle = "#007e3a"; ctx.fillRect(size * 0.33, size / 2, size * 0.67, size / 2);
  return c;
}

function drawMOZ(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h3 = size / 3;
  ctx.fillStyle = "#009a44"; ctx.fillRect(0, 0, size, h3);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, h3, size, h3);
  ctx.fillStyle = "#fce100"; ctx.fillRect(0, h3 * 2, size, h3);
  ctx.fillStyle = "#000000";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size * 0.38, size / 2); ctx.lineTo(0, size); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#de2110"; ctx.beginPath(); ctx.arc(size * 0.18, size / 2, size * 0.12, 0, Math.PI * 2); ctx.fill();
  return c;
}

function drawMWI(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h3 = size / 3;
  ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, size, h3);
  ctx.fillStyle = "#ce1126"; ctx.fillRect(0, h3, size, h3);
  ctx.fillStyle = "#339e35"; ctx.fillRect(0, h3 * 2, size, h3);
  // Soleil rouge
  ctx.fillStyle = "#ce1126";
  ctx.beginPath(); ctx.arc(size / 2, h3 * 0.5, size * 0.12, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 12; i++) {
    const a = (i * 30) * Math.PI / 180;
    ctx.beginPath(); ctx.moveTo(size / 2 + Math.cos(a) * size * 0.13, h3 * 0.5 + Math.sin(a) * size * 0.13);
    ctx.lineTo(size / 2 + Math.cos(a) * size * 0.2, h3 * 0.5 + Math.sin(a) * size * 0.2);
    ctx.lineWidth = size * 0.02; ctx.strokeStyle = "#ce1126"; ctx.stroke();
  }
  return c;
}

function drawSOM(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#4189dd"; ctx.fillRect(0, 0, size, size);
  drawStar5(ctx, size / 2, size / 2, size * 0.2, size * 0.08, "#ffffff");
  return c;
}

function drawSDN(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h3 = size / 3;
  ctx.fillStyle = "#d21034"; ctx.fillRect(0, 0, size, h3);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, h3, size, h3);
  ctx.fillStyle = "#000000"; ctx.fillRect(0, h3 * 2, size, h3);
  ctx.fillStyle = "#007229";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size * 0.35, size / 2); ctx.lineTo(0, size); ctx.closePath(); ctx.fill();
  return c;
}

function drawSSD(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h3 = size / 3;
  ctx.fillStyle = "#078930"; ctx.fillRect(0, 0, size, h3);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, h3, size, h3);
  ctx.fillStyle = "#da121a"; ctx.fillRect(0, h3 * 2, size, h3);
  ctx.fillStyle = "#000000"; ctx.fillRect(0, h3 - size * 0.025, size, size * 0.05);
  ctx.fillRect(0, h3 * 2 - size * 0.025, size, size * 0.05);
  ctx.fillStyle = "#078930";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size * 0.38, size / 2); ctx.lineTo(0, size); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#0f47af";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size * 0.33, size / 2); ctx.lineTo(0, size); ctx.closePath(); ctx.fill();
  drawStar5(ctx, size * 0.14, size / 2, size * 0.1, size * 0.04, "#ffffff");
  return c;
}

function drawCAF(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h5 = size / 5;
  ctx.fillStyle = "#003082"; ctx.fillRect(0, 0, size, h5);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, h5, size, h5);
  ctx.fillStyle = "#289728"; ctx.fillRect(0, h5 * 2, size, h5);
  ctx.fillStyle = "#ffcb00"; ctx.fillRect(0, h5 * 3, size, h5);
  ctx.fillStyle = "#ff0000"; ctx.fillRect(0, h5 * 4, size, h5);
  ctx.fillStyle = "#ff0000"; ctx.fillRect(size * 0.47, 0, size * 0.06, size);
  drawStar5(ctx, size * 0.12, size * 0.15, size * 0.1, size * 0.04, "#ffcb00");
  return c;
}

function drawUGA(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h6 = size / 6;
  const colors6 = ["#000000","#ffd100","#de3108","#000000","#ffd100","#de3108"];
  for (let i = 0; i < 6; i++) { ctx.fillStyle = colors6[i]; ctx.fillRect(0, i * h6, size, h6); }
  ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.2, 0, Math.PI * 2); ctx.fill();
  return c;
}

function drawRWA(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#20603d"; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#fad201"; ctx.fillRect(0, size * 0.4, size, size * 0.3);
  ctx.fillStyle = "#20603d"; ctx.fillRect(0, size * 0.7, size, size * 0.3);
  ctx.fillStyle = "#00a1de"; ctx.fillRect(0, 0, size, size * 0.4);
  ctx.fillStyle = "#e5be01";
  ctx.beginPath(); ctx.arc(size * 0.72, size * 0.22, size * 0.12, 0, Math.PI * 2); ctx.fill();
  return c;
}

function drawBDI(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#ce1126"; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#1eb53a"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size, 0); ctx.lineTo(size, size * 0.44); ctx.lineTo(0, size * 0.44); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#1eb53a"; ctx.beginPath(); ctx.moveTo(0, size * 0.56); ctx.lineTo(size, size * 0.56); ctx.lineTo(size, size); ctx.lineTo(0, size); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath(); ctx.moveTo(0, size * 0.44); ctx.lineTo(size * 0.5, size / 2); ctx.lineTo(0, size * 0.56); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(size, size * 0.44); ctx.lineTo(size * 0.5, size / 2); ctx.lineTo(size, size * 0.56); ctx.closePath(); ctx.fill();
  return c;
}

// ── Grands partenaires ──────────────────────────────────────────────────────────

function drawCHN(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#de2910"; ctx.fillRect(0, 0, size, size);
  const bigR = size * 0.15;
  drawStar5(ctx, size * 0.21, size * 0.23, bigR, bigR * 0.4, "#ffde00");
  const sR = size * 0.055;
  const smPos = [[0.37,0.12],[0.42,0.2],[0.42,0.3],[0.37,0.38]];
  for (const [sx,sy] of smPos) drawStar5(ctx, size*sx, size*sy, sR, sR*0.4, "#ffde00");
  return c;
}

function drawUSA(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const stripe = size / 13;
  for (let i = 0; i < 13; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#b22234" : "#ffffff";
    ctx.fillRect(0, i * stripe, size, stripe);
  }
  ctx.fillStyle = "#3c3b6e"; ctx.fillRect(0, 0, size * 0.4, stripe * 7);
  return c;
}

function drawGBR(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#012169"; ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "#ffffff"; ctx.lineWidth = size * 0.2;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size, size); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(size, 0); ctx.lineTo(0, size); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2); ctx.stroke();
  ctx.strokeStyle = "#c8102e"; ctx.lineWidth = size * 0.12;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(size, size); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(size, 0); ctx.lineTo(0, size); ctx.stroke();
  ctx.lineWidth = size * 0.14;
  ctx.beginPath(); ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2); ctx.stroke();
  return c;
}

function drawRUS(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h3 = size / 3;
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, size, h3);
  ctx.fillStyle = "#0039a6"; ctx.fillRect(0, h3, size, h3);
  ctx.fillStyle = "#d52b1e"; ctx.fillRect(0, h3 * 2, size, h3);
  return c;
}

function drawJPN(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#bc002d"; ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.3, 0, Math.PI * 2); ctx.fill();
  return c;
}

function drawBRA(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#009c3b"; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#ffdf00";
  ctx.beginPath(); ctx.moveTo(size / 2, size * 0.1); ctx.lineTo(size * 0.9, size / 2); ctx.lineTo(size / 2, size * 0.9); ctx.lineTo(size * 0.1, size / 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#002776"; ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.22, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#ffffff"; ctx.lineWidth = size * 0.02;
  ctx.beginPath(); ctx.arc(size / 2, size * 0.47, size * 0.22, -Math.PI * 0.25, Math.PI * 0.25); ctx.stroke();
  return c;
}

function drawIND(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h3 = size / 3;
  ctx.fillStyle = "#ff9933"; ctx.fillRect(0, 0, size, h3);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, h3, size, h3);
  ctx.fillStyle = "#138808"; ctx.fillRect(0, h3 * 2, size, h3);
  ctx.strokeStyle = "#000080"; ctx.lineWidth = size * 0.025;
  ctx.beginPath(); ctx.arc(size / 2, size / 2, size * 0.12, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 24; i++) {
    const a = (i * 15) * Math.PI / 180;
    ctx.beginPath(); ctx.moveTo(size / 2, size / 2); ctx.lineTo(size / 2 + Math.cos(a) * size * 0.12, size / 2 + Math.sin(a) * size * 0.12);
    ctx.lineWidth = size * 0.01; ctx.stroke();
  }
  return c;
}

function drawSAU(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#006c35"; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#ffffff";
  // Shahada + epee simplifiees
  ctx.font = `bold ${size * 0.1}px Arial`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("لا إله إلا الله", size / 2, size * 0.42);
  ctx.fillRect(size * 0.25, size * 0.6, size * 0.5, size * 0.04);
  return c;
}

function drawARE(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h3 = size / 3;
  ctx.fillStyle = "#00732f"; ctx.fillRect(0, 0, size, h3);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, h3, size, h3);
  ctx.fillStyle = "#000000"; ctx.fillRect(0, h3 * 2, size, h3);
  ctx.fillStyle = "#ff0000"; ctx.fillRect(0, 0, size * 0.25, size);
  return c;
}

function drawITA(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const w3 = size / 3;
  ctx.fillStyle = "#009246"; ctx.fillRect(0, 0, w3, size);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(w3, 0, w3, size);
  ctx.fillStyle = "#ce2b37"; ctx.fillRect(w3 * 2, 0, w3, size);
  return c;
}

function drawPRT(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#006600"; ctx.fillRect(0, 0, size * 0.4, size);
  ctx.fillStyle = "#ff0000"; ctx.fillRect(size * 0.4, 0, size * 0.6, size);
  ctx.fillStyle = "#ffff00"; ctx.beginPath(); ctx.arc(size * 0.4, size / 2, size * 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#003399"; ctx.beginPath(); ctx.arc(size * 0.4, size / 2, size * 0.09, 0, Math.PI * 2); ctx.fill();
  return c;
}

function drawBEL(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const w3 = size / 3;
  ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, w3, size);
  ctx.fillStyle = "#fae042"; ctx.fillRect(w3, 0, w3, size);
  ctx.fillStyle = "#ef3340"; ctx.fillRect(w3 * 2, 0, w3, size);
  return c;
}

function drawNLD(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const h3 = size / 3;
  ctx.fillStyle = "#ae1c28"; ctx.fillRect(0, 0, size, h3);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, h3, size, h3);
  ctx.fillStyle = "#21468b"; ctx.fillRect(0, h3 * 2, size, h3);
  return c;
}

// ── ESH (Sahara Occidental) = meme que MAR pour nos usages ─────────────────────
const drawESH = drawMAR;

// ── Registry ────────────────────────────────────────────────────────────────────

const DRAW_REGISTRY: Record<string, (size?: number) => HTMLCanvasElement> = {
  MAR: drawMAR, ESH: drawESH,
  SEN: drawSEN, CIV: drawCIV, CMR: drawCMR, GHA: drawGHA, NGA: drawNGA,
  MLI: drawMLI, BFA: drawBFA, GIN: drawGIN, TUN: drawTUN, DZA: drawDZA,
  LBY: drawLBY, EGY: drawEGY, ETH: drawETH, KEN: drawKEN, TZA: drawTZA,
  ZAF: drawZAF, COD: drawCOD, AGO: drawAGO, GAB: drawGAB, COG: drawCOG,
  BWA: drawBWA, NAM: drawNAM, ZWE: drawZWE, ZMB: drawZMB, MDG: drawMDG,
  MOZ: drawMOZ, MWI: drawMWI, SOM: drawSOM, SDN: drawSDN, SSD: drawSSD,
  CAF: drawCAF, UGA: drawUGA, RWA: drawRWA, BDI: drawBDI,
  CHN: drawCHN, USA: drawUSA, GBR: drawGBR, RUS: drawRUS, JPN: drawJPN,
  BRA: drawBRA, IND: drawIND, SAU: drawSAU, ARE: drawARE,
  DEU: (s = 512) => { const c = makeCanvas(s, s); const ctx = c.getContext("2d")!; const h3 = s / 3; ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, s, h3); ctx.fillStyle = "#dd0000"; ctx.fillRect(0, h3, s, h3); ctx.fillStyle = "#ffce00"; ctx.fillRect(0, h3 * 2, s, h3); return c; },
  FRA: (s = 512) => { const c = makeCanvas(s, s); const ctx = c.getContext("2d")!; const w3 = s / 3; ctx.fillStyle = "#002395"; ctx.fillRect(0, 0, w3, s); ctx.fillStyle = "#ffffff"; ctx.fillRect(w3, 0, w3, s); ctx.fillStyle = "#ed2939"; ctx.fillRect(w3 * 2, 0, w3, s); return c; },
  ESP: (s = 512) => { const c = makeCanvas(s, s); const ctx = c.getContext("2d")!; const h4 = s / 4; ctx.fillStyle = "#c60b1e"; ctx.fillRect(0, 0, s, h4); ctx.fillStyle = "#ffc400"; ctx.fillRect(0, h4, s, h4 * 2); ctx.fillStyle = "#c60b1e"; ctx.fillRect(0, h4 * 3, s, h4); return c; },
  ITA: drawITA, PRT: drawPRT, BEL: drawBEL, NLD: drawNLD, NOR: drawNOR,
};

// ── API publique ────────────────────────────────────────────────────────────────

/**
 * Dessine le drapeau d'un pays en canvas pur (synchrone).
 * Retourne un canvas 512x512 (ou la taille demandee).
 * Utilise la fonction draw* dediee si disponible, sinon canvas uni navy.
 */
export function drawFlagCanvas(iso: string, size = 512): HTMLCanvasElement {
  const fn = DRAW_REGISTRY[iso.toUpperCase()];
  if (fn) return fn(size);
  // Fallback : canvas navy uni avec le code ISO
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#16213a"; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#c8a951"; ctx.font = `bold ${size * 0.2}px monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(iso.toUpperCase(), size / 2, size / 2);
  return c;
}

/**
 * pushCanvas — injecte un canvas dans Mapbox comme fill-pattern.
 * L'image est identifiee par `id` dans le registre Mapbox.
 */
export function pushCanvas(map: mapboxgl.Map, id: string, canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d")!;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data as unknown as Uint8Array;
  if (!map.hasImage(id)) {
    map.addImage(id, { width: canvas.width, height: canvas.height, data });
  } else {
    try {
      map.updateImage(id, { width: canvas.width, height: canvas.height, data });
    } catch {
      map.removeImage(id); map.addImage(id, { width: canvas.width, height: canvas.height, data });
    }
  }
}

/**
 * pushFlagToMap — dessine le drapeau `iso` et l'injecte dans Mapbox sous "flag-ISO".
 * Version synchrone (canvas pur). Disponible a f0.
 * @returns l'id de l'image injectee ("flag-MAR", "flag-SEN", etc.)
 */
export function pushFlagToMap(map: mapboxgl.Map, iso: string, size = 512): string {
  const id = `flag-${iso.toUpperCase()}`;
  const canvas = drawFlagCanvas(iso, size);
  pushCanvas(map, id, canvas);
  return id;
}

/**
 * loadFlagFromFile — charge un drapeau depuis public/_shared/flags/<filename>.
 * Asynchrone (image locale, quasi-instantane). Fallback sur canvas pur si erreur.
 */
export function loadFlagFromFile(filename: string, size = 256): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = makeCanvas(size, size); c.getContext("2d")!.drawImage(img, 0, 0, size, size); resolve(c);
    };
    img.onerror = () => resolve(makeCanvas(size, size));
    img.src = staticFile(`_shared/flags/${filename}`);
  });
}

/**
 * pushFlagToMapAsync — charge depuis fichier PNG local si dispo,
 * sinon fallback sur canvas pur. Retourne une Promise.
 */
export async function pushFlagToMapAsync(map: mapboxgl.Map, iso: string, size = 512): Promise<string> {
  const upper = iso.toUpperCase();
  const id = `flag-${upper}`;
  const pngFile = FLAG_PNG_FILES[upper];
  if (pngFile) {
    const canvas = await loadFlagFromFile(pngFile, size);
    pushCanvas(map, id, canvas);
  } else {
    pushFlagToMap(map, iso, size);
  }
  return id;
}

/**
 * Liste de tous les ISO couverts par des drapeaux canvas pur.
 */
export const SUPPORTED_FLAG_ISOS = Object.keys(DRAW_REGISTRY);

/**
 * countryFilter — filtre Mapbox country-boundaries-v1 par ISO (FIABLE en headless).
 * Le filtre sur "name" ne matche PAS en headless → toujours utiliser iso_3166_1_alpha_3.
 * @param iso ISO principal (ex: "MAR")
 * @param boundaryIsos ISO additionnels a fusionner (ex: ["ESH"] pour le Sahara occidental)
 */
export function countryFilter(iso: string, boundaryIsos: string[] = []): mapboxgl.Expression {
  const focus = [iso.toUpperCase(), ...boundaryIsos.map((s) => s.toUpperCase())];
  return ["in", ["get", "iso_3166_1_alpha_3"], ["literal", focus]];
}
