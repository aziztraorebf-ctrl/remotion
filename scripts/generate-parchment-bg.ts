import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";

dotenv.config();

fal.config({ credentials: process.env.FAL_KEY });

const OUTPUT_DIR = path.join(__dirname, "..", "generated", "parchment-bg");

const VARIANTS = [
  {
    name: "A - Clean parchment (for data overlay)",
    filename: "parchment-clean.png",
    prompt:
      "Old medieval parchment scroll with burned edges, aged sepia tones, " +
      "subtle stains and foxing marks, leather texture background behind the parchment, " +
      "warm candlelight illumination from the left, slightly rolled edges, " +
      "empty center area suitable for text and map overlay, " +
      "photorealistic texture, high detail, 14th century document feel, " +
      "no text no letters no words no writing no symbols",
    seed: 1347,
  },
  {
    name: "B - Parchment with faint map outline",
    filename: "parchment-map-faint.png",
    prompt:
      "Old medieval parchment with a very faint hand-drawn map of Europe barely visible, " +
      "aged sepia yellowed paper, burned edges with dark brown scorching, " +
      "subtle ink stains and water damage marks, " +
      "warm dim candlelight illumination, leather and wood desk beneath, " +
      "14th century cartography style, old compass rose watermark, " +
      "photorealistic aged paper texture, high detail, " +
      "no modern text no printed letters no typed words",
    seed: 1347,
  },
  {
    name: "C - War table with parchment",
    filename: "parchment-war-table.png",
    prompt:
      "Medieval war room table seen from above, old parchment map spread on dark oak table, " +
      "candles on the edges casting warm golden glow, " +
      "ink well and quill nearby, wax seal stamp, " +
      "leather bound book partially visible, dried herbs scattered, " +
      "14th century military planning aesthetic, " +
      "dark atmospheric lighting, photorealistic detail, " +
      "no modern objects no text no letters no words",
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
    client
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          downloadFile(response.headers.location!, dest)
            .then(resolve)
            .catch(reject);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function main(): Promise<void> {
  console.log("=== Parchment Backgrounds for Terminal Tactique Medieval ===\n");

  if (!process.env.FAL_KEY) {
    console.error("ERROR: FAL_KEY not found in .env");
    process.exit(1);
  }

  ensureDir(OUTPUT_DIR);

  for (const variant of VARIANTS) {
    console.log(`--- ${variant.name} ---`);
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
