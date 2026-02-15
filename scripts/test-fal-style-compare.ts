import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";

dotenv.config();

fal.config({ credentials: process.env.FAL_KEY });

const OUTPUT_DIR = path.join(__dirname, "..", "generated", "style-compare");

// Same base scene, 3 different style treatments
const BASE_SCENE =
  "Dark medieval alley at night, narrow cobblestone street between tall stone buildings " +
  "with timber frame houses, a single warm lantern mounted on wall casting golden light, " +
  "thick fog rolling through, wet cobblestones, plague-era 14th century European city, " +
  "eerie atmosphere";

const VARIANTS = [
  {
    name: "A - Realiste (actuel)",
    filename: "style-A-realiste.png",
    prompt:
      BASE_SCENE +
      ", atmospheric lighting, volumetric fog, dramatic shadows, " +
      "cinematic composition, photorealistic digital art, hyper detailed, " +
      "no text no letters no words",
    seed: 1347,
  },
  {
    name: "B - Stylise digital painting",
    filename: "style-B-stylise.png",
    prompt:
      BASE_SCENE +
      ", stylized digital painting, hand-painted look, visible brush strokes, " +
      "muted warm color palette, low detail background, painterly medieval illustration, " +
      "slightly flat lighting, art style similar to Darkest Dungeon or Octopath Traveler backgrounds, " +
      "game environment concept art, limited color palette, " +
      "no text no letters no words",
    seed: 1347,
  },
  {
    name: "C - Pixel art pur",
    filename: "style-C-pixelart.png",
    prompt:
      BASE_SCENE +
      ", pixel art, 16-bit retro game screenshot, low resolution aesthetic, " +
      "limited color palette, dithering shading technique, visible individual pixels, " +
      "SNES era graphics, classic RPG game environment, " +
      "no text no letters no words",
    seed: 1347,
  },
];

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith("https") ? https : http;
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location!, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (err) => { reject(err); });
  });
}

async function main(): Promise<void> {
  console.log("=== Style Comparison: 3 variants of the same medieval alley ===\n");

  if (!process.env.FAL_KEY) {
    console.error("ERROR: FAL_KEY not found in .env");
    process.exit(1);
  }

  ensureDir(OUTPUT_DIR);

  for (const variant of VARIANTS) {
    console.log(`--- ${variant.name} (seed: ${variant.seed}) ---`);
    const start = Date.now();

    try {
      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt: variant.prompt,
          image_size: "landscape_16_9",
          num_inference_steps: 28,
          guidance_scale: 3.5,
          seed: variant.seed,
          num_images: 1,
          enable_safety_checker: false,
        },
        logs: false,
      });

      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      const imageUrl = (result as any).data?.images?.[0]?.url;

      if (imageUrl) {
        const dest = path.join(OUTPUT_DIR, variant.filename);
        await downloadFile(imageUrl, dest);
        const size = (fs.statSync(dest).size / 1024).toFixed(0);
        console.log(`  OK - ${elapsed}s - ${size} KB -> ${variant.filename}`);
      } else {
        console.error(`  FAIL - no image URL`);
      }
    } catch (err: any) {
      console.error(`  FAIL - ${err.message}`);
    }
  }

  console.log(`\nFiles in: ${OUTPUT_DIR}`);
}

main().catch(console.error);
