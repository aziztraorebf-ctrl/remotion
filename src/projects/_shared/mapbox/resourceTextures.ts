// resourceTextures.ts — 6 textures bichromie navy/gold pour ResourceTextureFill
// Chaque texture est dessinees en canvas pur (zero fetch, headless-safe).
// Taille recommandee : 256px (pattern repete dans les gros polygones).
// Palette fixe : NAVY #16213a (fond), GOLD #c8a951 (motif), ACCENT #c08820 (detail).

const NAVY   = "#16213a";
const GOLD   = "#c8a951";
const ACCENT = "#c08820";
const DARK   = "#0d1526";

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas"); c.width = w; c.height = h; return c;
}

// ── 1. PETROLE — gouttes + derricks ──────────────────────────────────────────

export function drawOilTexture(size = 256): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = NAVY; ctx.fillRect(0, 0, size, size);

  const u = size / 4; // unite de base (4x4 cellules)

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cx = col * u + u * 0.5;
      const cy = row * u + u * 0.5;
      const stagger = (row + col) % 2;

      if (stagger === 0) {
        // Goutte d'huile
        const r = u * 0.22;
        ctx.fillStyle = GOLD;
        ctx.beginPath();
        ctx.arc(cx, cy + r * 0.3, r, 0, Math.PI * 2);
        ctx.fill();
        // Pointe en haut
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.5, cy + r * 0.2);
        ctx.quadraticCurveTo(cx, cy - r * 1.0, cx + r * 0.5, cy + r * 0.2);
        ctx.fill();
        // Reflet
        ctx.fillStyle = ACCENT;
        ctx.beginPath();
        ctx.arc(cx - r * 0.2, cy - r * 0.1, r * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Derrick (triangle + tige)
        ctx.strokeStyle = GOLD; ctx.lineWidth = size * 0.018;
        const h = u * 0.55; const base = u * 0.35;
        // Triangle derrick
        ctx.beginPath();
        ctx.moveTo(cx, cy - h * 0.5);
        ctx.lineTo(cx - base * 0.5, cy + h * 0.5);
        ctx.lineTo(cx + base * 0.5, cy + h * 0.5);
        ctx.closePath(); ctx.stroke();
        // Traverse milieu
        ctx.beginPath();
        ctx.moveTo(cx - base * 0.25, cy + h * 0.0);
        ctx.lineTo(cx + base * 0.25, cy + h * 0.0);
        ctx.stroke();
        // Tige pompe
        ctx.strokeStyle = ACCENT;
        ctx.beginPath(); ctx.moveTo(cx, cy + h * 0.5); ctx.lineTo(cx, cy + h * 0.8); ctx.stroke();
      }
    }
  }
  return c;
}

// ── 2. OR — pepites + lingots ──────────────────────────────────────────────────

export function drawGoldTexture(size = 256): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = DARK; ctx.fillRect(0, 0, size, size);

  const u = size / 4;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cx = col * u + u * 0.5;
      const cy = row * u + u * 0.5;
      const stagger = (row + col) % 2;

      if (stagger === 0) {
        // Pepite d'or (hexagone irregulier)
        const r = u * 0.28;
        ctx.fillStyle = GOLD;
        ctx.beginPath();
        const sides = 6;
        for (let i = 0; i < sides; i++) {
          const a = (i / sides) * Math.PI * 2 - Math.PI / 6;
          const jitter = 0.85 + (((row * 4 + col + i) * 13) % 30) * 0.01;
          const px = cx + Math.cos(a) * r * jitter;
          const py = cy + Math.sin(a) * r * jitter;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.fill();
        // Eclat
        ctx.fillStyle = ACCENT;
        ctx.beginPath(); ctx.arc(cx - r * 0.25, cy - r * 0.25, r * 0.2, 0, Math.PI * 2); ctx.fill();
      } else {
        // Lingot (rectangle biseaute)
        const w = u * 0.55; const h = u * 0.35; const bevel = u * 0.07;
        ctx.fillStyle = GOLD;
        ctx.beginPath();
        ctx.moveTo(cx - w * 0.5 + bevel, cy - h * 0.5);
        ctx.lineTo(cx + w * 0.5 - bevel, cy - h * 0.5);
        ctx.lineTo(cx + w * 0.5, cy - h * 0.5 + bevel);
        ctx.lineTo(cx + w * 0.5, cy + h * 0.5 - bevel);
        ctx.lineTo(cx + w * 0.5 - bevel, cy + h * 0.5);
        ctx.lineTo(cx - w * 0.5 + bevel, cy + h * 0.5);
        ctx.lineTo(cx - w * 0.5, cy + h * 0.5 - bevel);
        ctx.lineTo(cx - w * 0.5, cy - h * 0.5 + bevel);
        ctx.closePath(); ctx.fill();
        // Ligne biseautee en haut (3D)
        ctx.fillStyle = ACCENT;
        ctx.fillRect(cx - w * 0.5 + bevel, cy - h * 0.5, w - bevel * 2, h * 0.2);
      }
    }
  }
  return c;
}

// ── 3. PHOSPHATE — cristaux hexagonaux ────────────────────────────────────────

export function drawPhosphateTexture(size = 256): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = NAVY; ctx.fillRect(0, 0, size, size);

  // Grille hexagonale
  const hexR = size * 0.1;
  const hexW = hexR * Math.sqrt(3);
  const hexH = hexR * 2;

  for (let row = -1; row <= 5; row++) {
    for (let col = -1; col <= 5; col++) {
      const stagger = (col % 2) * hexH * 0.5;
      const cx = col * hexW * 0.88;
      const cy = row * hexH * 0.75 + stagger;

      ctx.fillStyle = (row + col) % 3 === 0 ? ACCENT : GOLD;
      ctx.strokeStyle = NAVY; ctx.lineWidth = size * 0.02;

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
        const px = cx + Math.cos(a) * hexR * 0.82;
        const py = cy + Math.sin(a) * hexR * 0.82;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  }
  return c;
}

// ── 4. AGRICULTURE — epis + champs ────────────────────────────────────────────

export function drawAgricultureTexture(size = 256): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  // Fond vert tres sombre (champ la nuit)
  ctx.fillStyle = "#0f1e14"; ctx.fillRect(0, 0, size, size);

  const u = size / 5;

  // Lignes de sillon horizontales
  ctx.strokeStyle = "#1a3020"; ctx.lineWidth = size * 0.04;
  for (let i = 0; i < 6; i++) {
    const y = i * u;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
  }

  // Epis de ble (gold)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const stagger = (col % 2) * u * 0.5;
      const cx = col * u + u * 0.5;
      const cy = row * u + u * 0.5 + stagger;

      // Tige
      ctx.strokeStyle = GOLD; ctx.lineWidth = size * 0.014;
      ctx.beginPath(); ctx.moveTo(cx, cy + u * 0.35); ctx.lineTo(cx, cy - u * 0.1); ctx.stroke();

      // Grains (3 niveaux)
      const grainColor = (row + col) % 2 === 0 ? GOLD : ACCENT;
      for (let g = 0; g < 3; g++) {
        const gy = cy - u * 0.1 - g * u * 0.13;
        const gr = size * 0.024;
        ctx.fillStyle = grainColor;
        ctx.beginPath(); ctx.arc(cx - gr * 1.3, gy, gr, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + gr * 1.3, gy, gr, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx, gy - gr * 0.5, gr, 0, Math.PI * 2); ctx.fill();
      }

      // Pointe
      ctx.fillStyle = GOLD;
      ctx.beginPath();
      ctx.moveTo(cx, cy - u * 0.1 - u * 0.39 - size * 0.025);
      ctx.lineTo(cx - size * 0.018, cy - u * 0.1 - u * 0.39);
      ctx.lineTo(cx + size * 0.018, cy - u * 0.1 - u * 0.39);
      ctx.closePath(); ctx.fill();
    }
  }
  return c;
}

// ── 5. LITHIUM — cellules batteries ───────────────────────────────────────────

export function drawLithiumTexture(size = 256): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  // Fond tres sombre bleu-nuit
  ctx.fillStyle = "#0a1220"; ctx.fillRect(0, 0, size, size);

  const cols = 4; const rows = 4;
  const cw = size / cols; const ch = size / rows;
  const pad = size * 0.04;
  const radius = size * 0.03;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cw + pad;
      const y = row * ch + pad;
      const w = cw - pad * 2;
      const h = ch - pad * 2;
      const isCharged = (row + col) % 3 !== 2;

      // Contour cellule
      ctx.strokeStyle = GOLD; ctx.lineWidth = size * 0.018;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.stroke();

      // Remplissage selon charge
      if (isCharged) {
        ctx.fillStyle = `${GOLD}33`;
        ctx.beginPath(); ctx.roundRect(x, y, w, h * 0.72, radius); ctx.fill();
        ctx.fillStyle = GOLD;
        ctx.beginPath(); ctx.roundRect(x + w * 0.15, y + h * 0.3, w * 0.7, h * 0.12, 2); ctx.fill();
      }

      // Borne positive (rectangle en haut)
      ctx.fillStyle = GOLD;
      ctx.fillRect(x + w * 0.38, y - size * 0.025, w * 0.24, size * 0.025);

      // Symbole eclair
      if ((row + col) % 2 === 0) {
        ctx.fillStyle = ACCENT;
        const lx = x + w * 0.5; const ly = y + h * 0.5;
        ctx.beginPath();
        ctx.moveTo(lx + w * 0.1, ly - h * 0.3);
        ctx.lineTo(lx - w * 0.05, ly + h * 0.05);
        ctx.lineTo(lx + w * 0.04, ly + h * 0.05);
        ctx.lineTo(lx - w * 0.1, ly + h * 0.3);
        ctx.lineTo(lx + w * 0.05, ly - h * 0.05);
        ctx.lineTo(lx - w * 0.04, ly - h * 0.05);
        ctx.closePath(); ctx.fill();
      }
    }
  }
  return c;
}

// ── 6. GAZ — flammes stylisees ────────────────────────────────────────────────

export function drawGasTexture(size = 256): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0b1222"; ctx.fillRect(0, 0, size, size);

  const u = size / 4;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const stagger = (col % 2) * u * 0.5;
      const cx = col * u + u * 0.5;
      const cy = row * u + u * 0.5 + stagger;

      // Flamme (courbe bezier)
      const fh = u * 0.7;
      const fw = u * 0.32;
      const isAlt = (row + col) % 2 === 1;
      const color = isAlt ? ACCENT : GOLD;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy + fh * 0.5);
      // Bord gauche de la flamme
      ctx.bezierCurveTo(
        cx - fw, cy + fh * 0.1,
        cx - fw * 0.6, cy - fh * 0.4,
        cx, cy - fh * 0.5
      );
      // Bord droit de la flamme
      ctx.bezierCurveTo(
        cx + fw * 0.6, cy - fh * 0.4,
        cx + fw, cy + fh * 0.1,
        cx, cy + fh * 0.5
      );
      ctx.closePath(); ctx.fill();

      // Flamme interieure (plus claire, plus petite)
      ctx.fillStyle = `${GOLD}88`;
      const ih = fh * 0.5; const ifw = fw * 0.45;
      ctx.beginPath();
      ctx.moveTo(cx, cy + ih * 0.3);
      ctx.bezierCurveTo(cx - ifw, cy, cx - ifw * 0.5, cy - ih * 0.5, cx, cy - ih * 0.5);
      ctx.bezierCurveTo(cx + ifw * 0.5, cy - ih * 0.5, cx + ifw, cy, cx, cy + ih * 0.3);
      ctx.closePath(); ctx.fill();

      // Bec de brulee (cercle a la base)
      ctx.fillStyle = color; ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.arc(cx, cy + fh * 0.45, fw * 0.45, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }
  return c;
}

// ── Registry ──────────────────────────────────────────────────────────────────

export type ResourceType = "oil" | "gold" | "phosphate" | "agriculture" | "lithium" | "gas";

export const RESOURCE_DRAW_FNS: Record<ResourceType, (size?: number) => HTMLCanvasElement> = {
  oil:         drawOilTexture,
  gold:        drawGoldTexture,
  phosphate:   drawPhosphateTexture,
  agriculture: drawAgricultureTexture,
  lithium:     drawLithiumTexture,
  gas:         drawGasTexture,
};

/**
 * Dessine la texture d'une ressource en canvas pur.
 * Retourne un canvas pret a etre injecte dans Mapbox via pushCanvas().
 */
export function drawResourceTexture(type: ResourceType, size = 256): HTMLCanvasElement {
  return RESOURCE_DRAW_FNS[type](size);
}

/**
 * Cle Mapbox image pour une ressource : "texture-oil", "texture-gold", etc.
 */
export function resourceImageId(type: ResourceType): string {
  return `texture-${type}`;
}
