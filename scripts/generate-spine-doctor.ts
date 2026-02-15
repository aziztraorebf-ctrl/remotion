import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";

dotenv.config();

fal.config({ credentials: process.env.FAL_KEY });

const OUTPUT_DIR = path.join(__dirname, "..", "generated", "spine-doctor");

// We need a front-facing plague doctor with CLEAR separation between body parts
// so we can cut it into layers for animation
const VARIANTS = [
  {
    name: "A - Full body front-facing (dark bg)",
    filename: "doctor-front-dark.png",
    prompt:
      "Full body plague doctor character, front facing, standing upright, " +
      "long dark leather coat reaching knees, iconic bird beak mask with round glass eyes, " +
      "wide-brim hat, holding a wooden staff in right hand, left arm slightly away from body, " +
      "dark flowing cape behind, leather gloves, tall boots, " +
      "stylized digital painting, hand-painted look, Darkest Dungeon art style, " +
      "dramatic side lighting from left, warm golden lantern glow, " +
      "dark background, character concept art, full body visible from head to feet, " +
      "medieval 14th century, atmospheric, moody, detailed clothing textures, " +
      "no text no letters no words no watermark",
    seed: 1347,
  },
  {
    name: "B - Full body front-facing (solid bg for easier cutout)",
    filename: "doctor-front-solid.png",
    prompt:
      "Full body plague doctor character, front facing symmetrical pose, standing upright, " +
      "long dark leather trench coat, iconic plague doctor bird beak mask with circular glass lenses, " +
      "wide-brimmed hat, holding wooden cane staff in right hand, " +
      "left arm relaxed at side, dark cape flowing behind, " +
      "leather gloves and tall boots, medieval 14th century, " +
      "stylized digital painting, painterly illustration, Darkest Dungeon game art style, " +
      "character concept art sheet, solid dark grey background #222222, " +
      "dramatic lighting, warm tones, full body from head to feet visible, " +
      "high detail on clothing folds and textures, no text no watermark",
    seed: 1347,
  },
  {
    name: "C - 3/4 view with gesture (more dynamic)",
    filename: "doctor-threequarter.png",
    prompt:
      "Plague doctor character in three-quarter view, slight forward lean, " +
      "one arm raised holding a lantern emitting warm orange glow, other hand on wooden staff, " +
      "long dark leather coat with visible belt and pouches, " +
      "iconic bird beak mask with round glass eyes reflecting lantern light, " +
      "wide-brimmed hat casting shadow on mask, dark flowing cape, " +
      "stylized digital painting, hand-painted illustration, Darkest Dungeon art style, " +
      "moody atmospheric lighting, dark background with subtle fog, " +
      "character concept art, full body visible, medieval 14th century, " +
      "detailed textures on leather and fabric, no text no watermark",
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
  console.log("=== Plague Doctor - Illustrated Character for Poor Man's Spine ===\n");

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
          image_size: {
            width: 768,
            height: 1024,
          },
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
        console.log("  Response:", JSON.stringify(result).substring(0, 200));
      }
    } catch (err: any) {
      console.error(`  FAIL - ${err.message}`);
    }
  }

  console.log(`\nFiles in: ${OUTPUT_DIR}`);
  console.log("\nNext step: choose best variant, cut into layers, animate in Remotion");
}

main().catch(console.error);
