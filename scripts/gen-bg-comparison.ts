/**
 * Generate the SAME background prompt with 3 different AI image models:
 *   1. Nano Banana Pro (Gemini 3 Pro Image Preview)
 *   2. GPT Image 1 (OpenAI)
 *   3. fal.ai Flux Dev
 *
 * All 3 run in parallel. Output goes to generated/showcase-previz/bg-comparison/
 *
 * Usage: npx tsx scripts/gen-bg-comparison.ts
 */
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const OUTPUT_DIR = path.join(
  __dirname,
  "..",
  "generated",
  "showcase-previz",
  "bg-comparison"
);
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Background-only prompt (no sprites, no HUD - just the decor)
const BG_PROMPT = `A wide background scene for a 2D side-scrolling pixel art game, 16-bit SNES style.

Scene: A medieval European town street at dusk during the Black Plague era (1347).

STRICT PIXEL ART RULES:
- Visible individual square pixels, crisp edges
- NO anti-aliasing, NO smooth gradients, NO blur
- Limited color palette (max 24 colors)
- Looks like a real retro game background layer

COMPOSITION (wide panoramic, side-view):
- Cobblestone ground taking up the bottom 20% - varied stone blocks, some cracked, some moss-covered
- 3-4 medieval timber-frame buildings in the middle ground with wooden beams, stone bases, thatched and tile roofs
- One building has a faint warm glow from inside (tavern or forge)
- Narrow alley between two buildings disappearing into shadow
- Background layer: more distant rooftops, a church steeple silhouette, dusk sky with muted orange and purple
- Atmospheric details: a hanging shop sign, a wooden barrel by a wall, a dim street lantern
- NO characters, NO rats, NO HUD, NO text - this is ONLY the background layer
- The scene should feel empty, abandoned, ominous

COLOR PALETTE: Dark slate blues, warm timber browns, muted amber lantern glow, dusty grey cobblestones, deep purple dusk sky.
Style reference: Castlevania, Shovel Knight, Octopath Traveler pixel backgrounds.

Wide format (16:9 ratio). This will be used as a scrollable parallax background layer in a game engine.`;

// --- Nano Banana Pro (Gemini) ---
async function generateNanoBanana(): Promise<void> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) { console.error("SKIP Nano Banana: no GEMINI_API_KEY"); return; }

  console.log("[NanoBanana] Starting...");
  const start = Date.now();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${key}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: BG_PROMPT }] }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: { aspectRatio: "16:9" },
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(`[NanoBanana] API Error ${response.status}: ${err.substring(0, 300)}`);
    return;
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, "base64");
      const ext = (part.inlineData.mimeType || "").includes("jpeg") ? "jpg" : "png";
      const dest = path.join(OUTPUT_DIR, `bg-nanobananapro.${ext}`);
      fs.writeFileSync(dest, buffer);
      console.log(`[NanoBanana] OK: ${dest} (${(buffer.length / 1024).toFixed(0)} KB) in ${((Date.now() - start) / 1000).toFixed(1)}s`);
      return;
    }
  }
  console.error("[NanoBanana] No image in response");
}

// --- GPT Image 1 ---
async function generateGPTImage(): Promise<void> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) { console.error("SKIP GPT Image: no OPENAI_API_KEY"); return; }

  console.log("[GPTImage1] Starting...");
  const start = Date.now();

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: BG_PROMPT,
      n: 1,
      size: "1536x1024",
      quality: "high",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(`[GPTImage1] API Error ${response.status}: ${err.substring(0, 300)}`);
    return;
  }

  const data = await response.json();
  const imageData = data.data?.[0];
  if (!imageData) { console.error("[GPTImage1] No image data"); return; }

  if (imageData.b64_json) {
    const buffer = Buffer.from(imageData.b64_json, "base64");
    const dest = path.join(OUTPUT_DIR, "bg-gptimage1.png");
    fs.writeFileSync(dest, buffer);
    console.log(`[GPTImage1] OK: ${dest} (${(buffer.length / 1024).toFixed(0)} KB) in ${((Date.now() - start) / 1000).toFixed(1)}s`);
  } else if (imageData.url) {
    const imgResp = await fetch(imageData.url);
    const buffer = Buffer.from(await imgResp.arrayBuffer());
    const dest = path.join(OUTPUT_DIR, "bg-gptimage1.png");
    fs.writeFileSync(dest, buffer);
    console.log(`[GPTImage1] OK: ${dest} (${(buffer.length / 1024).toFixed(0)} KB) in ${((Date.now() - start) / 1000).toFixed(1)}s`);
  }
}

// --- fal.ai Flux Dev ---
async function generateFalFlux(): Promise<void> {
  const key = process.env.FAL_KEY;
  if (!key) { console.error("SKIP Fal: no FAL_KEY"); return; }

  console.log("[FalFlux] Starting...");
  const start = Date.now();

  const response = await fetch("https://queue.fal.run/fal-ai/flux/dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${key}`,
    },
    body: JSON.stringify({
      prompt: BG_PROMPT,
      image_size: { width: 1920, height: 1080 },
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: false,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(`[FalFlux] API Error ${response.status}: ${err.substring(0, 300)}`);
    return;
  }

  const data = await response.json();

  // Fal queue returns request_id - need to poll
  if (data.request_id) {
    console.log(`[FalFlux] Queued: ${data.request_id}, polling...`);
    const pollUrl = `https://queue.fal.run/fal-ai/flux/dev/requests/${data.request_id}/status`;
    let result = null;
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const statusResp = await fetch(pollUrl, {
        headers: { Authorization: `Key ${key}` },
      });
      const statusData = await statusResp.json();
      if (statusData.status === "COMPLETED") {
        // Fetch result
        const resultUrl = `https://queue.fal.run/fal-ai/flux/dev/requests/${data.request_id}`;
        const resultResp = await fetch(resultUrl, {
          headers: { Authorization: `Key ${key}` },
        });
        result = await resultResp.json();
        break;
      }
      if (statusData.status === "FAILED") {
        console.error("[FalFlux] Generation failed");
        return;
      }
    }
    if (!result) { console.error("[FalFlux] Timeout"); return; }
    data.images = result.images;
  }

  const imageUrl = data.images?.[0]?.url;
  if (!imageUrl) {
    console.error("[FalFlux] No image URL in response");
    console.error(JSON.stringify(Object.keys(data), null, 2));
    return;
  }

  const imgResp = await fetch(imageUrl);
  const buffer = Buffer.from(await imgResp.arrayBuffer());
  const dest = path.join(OUTPUT_DIR, "bg-falflux.png");
  fs.writeFileSync(dest, buffer);
  console.log(`[FalFlux] OK: ${dest} (${(buffer.length / 1024).toFixed(0)} KB) in ${((Date.now() - start) / 1000).toFixed(1)}s`);
}

// --- Run all 3 in parallel ---
async function main(): Promise<void> {
  console.log("=== Background Comparison: 3 Models in Parallel ===");
  console.log(`Output: ${OUTPUT_DIR}\n`);

  const results = await Promise.allSettled([
    generateNanoBanana(),
    generateGPTImage(),
    generateFalFlux(),
  ]);

  console.log("\n=== Summary ===");
  const labels = ["NanoBanana Pro", "GPT Image 1", "Fal Flux Dev"];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      console.log(`  ${labels[i]}: OK`);
    } else {
      console.log(`  ${labels[i]}: FAILED - ${r.reason}`);
    }
  });

  // List output files
  const files = fs.readdirSync(OUTPUT_DIR).filter((f) => f.startsWith("bg-"));
  console.log(`\nGenerated ${files.length} images:`);
  files.forEach((f) => {
    const stats = fs.statSync(path.join(OUTPUT_DIR, f));
    console.log(`  ${f} (${(stats.size / 1024).toFixed(0)} KB)`);
  });
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
