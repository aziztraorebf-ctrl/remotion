// resourceMatter.ts — VRAIES MATIERES (pas des icones repetees) pour le fill de ressource sur carte.
// Probleme resolu : resourceTextures.ts dessine des PICTOGRAMMES repetes (gouttes/derricks/flammes) =
// rendu "emoji/SVG", pas une matiere. Ici : surface continue (degrade + bruit + reflets) qui evoque
// la NAPPE d'hydrocarbure vue de dessus. Canvas pur, headless-safe, zero fetch.
//
// Usage identique aux textures existantes :
//   const c = drawOilMatter(512);
//   pushCanvas(map, "matter-oil", c);   // fill-pattern: "matter-oil"
// Recommande 512px (matiere = moins de repetition visible que 256, le tiling se voit moins).

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas"); c.width = w; c.height = h; return c;
}

// bruit de valeur deterministe (pas de Math.random — render reproductible)
function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
// bruit lisse (interpolation bilineaire de hash2) → grain organique, pas de points secs
function smoothNoise(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const tl = hash2(xi, yi), tr = hash2(xi + 1, yi);
  const bl = hash2(xi, yi + 1), br = hash2(xi + 1, yi + 1);
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return (tl * (1 - u) + tr * u) * (1 - v) + (bl * (1 - u) + br * u) * v;
}
// bruit fractal (plusieurs octaves) → turbulence type fluide
function fbm(x: number, y: number): number {
  let val = 0, amp = 0.5, freq = 1;
  for (let o = 0; o < 4; o++) { val += amp * smoothNoise(x * freq, y * freq); freq *= 2; amp *= 0.5; }
  return val;
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp01(v: number) { return v < 0 ? 0 : v > 1 ? 1 : v; }

/**
 * PETROLE — nappe d'hydrocarbure : noir profond, reflets iris/ambres, surface huileuse.
 * Pas d'icone. Degrade sombre + turbulence fbm + irisation chaude par endroits.
 */
export function drawOilMatter(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const d = img.data;
  // palette nappe : base noir-bleute -> reflets ambre/or sur les "vagues"
  const baseDark = [14, 16, 22];     // nappe sombre mais PAS noire (contraste vs navy carte)
  const mid = [54, 44, 24];          // brun-or huileux (plus clair qu'avant)
  const sheen = [212, 178, 92];      // GOLD reflet chaud
  const irisCool = [70, 120, 130];   // irisation froide (essence sur l'eau)
  const scale = 3.2;                 // densite de la turbulence
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x / size) * scale, ny = (y / size) * scale;
      // domaine warp : deplace les coords par un 2e bruit -> aspect fluide, pas grille
      const wx = nx + fbm(nx + 5.2, ny + 1.3) * 0.9;
      const wy = ny + fbm(nx + 2.7, ny + 9.1) * 0.9;
      const t = fbm(wx, wy);
      // reflets chauds : cretes de turbulence (seuil plus bas => plus de surface brille)
      const spec = clamp01((t - 0.52) / 0.48);
      const specEased = spec * spec * 1.15;
      // irisation froide : bandes (sin de la turbulence) = arc-en-ciel essence/petrole
      const iris = clamp01(Math.sin(t * 14.0) * 0.5 + 0.5 - 0.55) * 1.6;
      let r = lerp(lerp(baseDark[0], mid[0], t), sheen[0], clamp01(specEased));
      let g = lerp(lerp(baseDark[1], mid[1], t), sheen[1], clamp01(specEased));
      let b = lerp(lerp(baseDark[2], mid[2], t), sheen[2], clamp01(specEased));
      // ajoute l'irisation froide par-dessus (melange additif doux)
      r = lerp(r, irisCool[0], iris * 0.35);
      g = lerp(g, irisCool[1], iris * 0.35);
      b = lerp(b, irisCool[2], iris * 0.35);
      const i = (y * size + x) * 4;
      d[i] = clamp01(r / 255) * 255; d[i + 1] = clamp01(g / 255) * 255; d[i + 2] = clamp01(b / 255) * 255; d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  // glaze final : vignettage radial pour le volume (centre plus lumineux/chaud)
  const grd = ctx.createRadialGradient(size * 0.4, size * 0.38, size * 0.1, size * 0.5, size * 0.5, size * 0.75);
  grd.addColorStop(0, "rgba(212,178,92,0.16)");
  grd.addColorStop(1, "rgba(0,0,0,0.20)");
  ctx.fillStyle = grd; ctx.fillRect(0, 0, size, size);
  return c;
}

/**
 * GAZ — matiere gazeuse : bleu-gris froid, volutes/nuees, transluciide.
 * Pas d'icone flamme. Turbulence douce + voiles clairs (le gaz "respire").
 */
export function drawGasMatter(size = 512): HTMLCanvasElement {
  const c = makeCanvas(size, size); const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const d = img.data;
  const baseDark = [11, 18, 34];     // #0b1222 (fond gaz, cohérent V1)
  const mid = [40, 58, 82];          // bleu-gris
  const haze = [150, 180, 205];      // voile clair froid
  const scale = 2.6;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x / size) * scale, ny = (y / size) * scale;
      const wx = nx + fbm(nx + 3.1, ny + 7.7) * 1.1;   // warp plus ample -> volutes
      const wy = ny + fbm(nx + 8.3, ny + 0.6) * 1.1;
      const t = fbm(wx, wy);
      const veil = clamp01((t - 0.5) / 0.5);
      const veilEased = veil * veil * 0.8;
      const r = lerp(lerp(baseDark[0], mid[0], t), haze[0], veilEased);
      const g = lerp(lerp(baseDark[1], mid[1], t), haze[1], veilEased);
      const b = lerp(lerp(baseDark[2], mid[2], t), haze[2], veilEased);
      const i = (y * size + x) * 4;
      d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

export type MatterType = "oil" | "gas";
export const MATTER_DRAW_FNS: Record<MatterType, (size?: number) => HTMLCanvasElement> = {
  oil: drawOilMatter,
  gas: drawGasMatter,
};
export function drawResourceMatter(type: MatterType, size = 512): HTMLCanvasElement {
  return MATTER_DRAW_FNS[type](size);
}
export function matterImageId(type: MatterType): string {
  return `matter-${type}`;
}
