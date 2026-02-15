import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY not found in .env");
  process.exit(1);
}

const OUTPUT_DIR = path.join(
  __dirname,
  "..",
  "generated",
  "showcase-previz",
  "pixel-mockups"
);

const PROMPT = `A pixel art image in 16-bit SNES/GBA style.

Scene: A medieval European city street during the Black Death plague of 1347.

STRICT PIXEL ART RULES:
- Every single element must be made of visible, crisp, individual square pixels
- NO anti-aliasing, NO smooth gradients, NO blending between colors
- Limited color palette (max 32 colors) like a real 16-bit console game
- Clean pixel edges everywhere, like Super Nintendo or Game Boy Advance games
- The entire image looks like a screenshot from a retro 2D side-scrolling RPG

SCENE COMPOSITION (side-view, like a platformer game):
- Left side: A timber-frame medieval building with pixel-perfect wooden beams, a door, and a window with shutters
- Center: A cobblestone street made of small square pixel blocks, some cracked
- Right side: Another building, partially collapsed, with pixel fire coming from inside
- Foreground: 2-3 small rat sprites (4-5 pixels tall) scurrying on the cobblestones
- Middle ground: A plague doctor character sprite (~20 pixels tall) wearing the iconic beak mask and dark robe, standing in a walking pose
- Background: More buildings receding into a yellowish-green hazy sky (miasma fog)
- A wooden cart with a white cloth partially covering dark shapes underneath
- Scattered bones and a skull on the ground (3-4 pixels each)
- A hanging lantern with warm orange pixel glow (2-frame animation style, showing the brighter frame)

GAME HUD at top of screen:
- Top-left: Red pixel heart icons (3 full, 1 empty) for health
- Top-center: "LEVEL 3 - THE PLAGUE" in pixel font
- Top-right: Skull counter showing "x47" next to a small skull icon
- Below HUD: thin pixel line separator

COLOR PALETTE: Dark browns, deep greens, amber/gold, bone white, blood red accents.
Muted and somber like Castlevania or Dark Souls pixel art.

This must look EXACTLY like a real retro video game screenshot, not a digital painting or illustration.
No text other than the HUD elements. No modern elements.`;

async function main(): Promise<void> {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("=== GPT Image 1 (gpt-image-1) ===");
  console.log("Generating pixel art mockup...");
  const start = Date.now();

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: PROMPT,
      n: 1,
      size: "1536x1024",
      quality: "high",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error ${response.status}: ${errorText}`);
    process.exit(1);
  }

  const data = await response.json();
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`Response received in ${elapsed}s`);

  const imageData = data.data?.[0];
  if (!imageData) {
    console.error("No image data in response");
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  // GPT Image 1 returns base64
  if (imageData.b64_json) {
    const buffer = Buffer.from(imageData.b64_json, "base64");
    const destPath = path.join(OUTPUT_DIR, "peste-pixel-GPTIMAGE1.png");
    fs.writeFileSync(destPath, buffer);
    const size = (buffer.length / 1024).toFixed(0);
    console.log(`Saved: peste-pixel-GPTIMAGE1.png (${size} KB)`);
  } else if (imageData.url) {
    // Fallback if URL is returned instead
    const imgResponse = await fetch(imageData.url);
    const arrayBuffer = await imgResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const destPath = path.join(OUTPUT_DIR, "peste-pixel-GPTIMAGE1.png");
    fs.writeFileSync(destPath, buffer);
    const size = (buffer.length / 1024).toFixed(0);
    console.log(`Saved: peste-pixel-GPTIMAGE1.png (${size} KB)`);
  } else {
    console.error("No b64_json or url in response");
    console.error(JSON.stringify(Object.keys(imageData), null, 2));
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
