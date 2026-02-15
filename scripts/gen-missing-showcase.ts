import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";

dotenv.config();
fal.config({ credentials: process.env.FAL_KEY });

const OUTPUT_DIR = path.join(__dirname, "..", "generated", "showcase-previz");

interface SceneConfig {
  name: string;
  filename: string;
  prompt: string;
  seed: number;
}

const SCENES: SceneConfig[] = [
  {
    name: "Science - Exploration cosmique",
    filename: "04-science-cosmic.png",
    prompt:
      "A breathtaking view of deep space showing a massive nebula in vivid colors, " +
      "swirling clouds of cosmic gas in deep purple, electric blue, and fiery orange, " +
      "thousands of stars of varying brightness scattered throughout, " +
      "a small spacecraft or space station silhouette in the foreground for scale, " +
      "a nearby planet with visible rings reflecting nebula light, " +
      "cosmic dust trails creating natural leading lines toward the nebula center, " +
      "a distant galaxy visible as a small spiral in the background, " +
      "Hubble Space Telescope photography style, scientifically accurate colors, " +
      "awe-inspiring scale, cinematic composition with rule of thirds, " +
      "ultra detailed, photorealistic space art, " +
      "no text, no words, no letters, no UI elements",
    seed: 42,
  },
  {
    name: "Histoire - Forum romain au crepuscule",
    filename: "05-history-roman-forum.png",
    prompt:
      "The Roman Forum at golden hour sunset, massive marble columns of a temple " +
      "casting long dramatic shadows across travertine paving stones, " +
      "the Colosseum visible in the distant background bathed in warm orange light, " +
      "a triumphal arch with carved relief sculptures partially in shadow, " +
      "marble statues of senators or gods lining a pathway, some weathered and cracked, " +
      "a ceremonial fire burning in a bronze tripod brazier with smoke rising, " +
      "cypress trees and Mediterranean pines framing the scene, " +
      "warm golden light flooding through the columns creating God rays, " +
      "scattered fallen leaves and dust motes visible in the light shafts, " +
      "oil painting style, classical academic art, Alma-Tadema meets Bierstadt, " +
      "rich warm palette, cinematic composition, photorealistic detail, " +
      "no text, no words, no letters, no UI elements, no modern objects, no people visible",
    seed: 753,
  },
];

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
      .on("error", reject);
  });
}

async function main(): Promise<void> {
  if (!process.env.FAL_KEY) {
    console.error("ERROR: FAL_KEY not found");
    process.exit(1);
  }

  for (const scene of SCENES) {
    console.log(`Generating: ${scene.name} (seed: ${scene.seed})...`);
    const start = Date.now();

    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: scene.prompt,
        image_size: "landscape_16_9",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        seed: scene.seed,
        num_images: 1,
        enable_safety_checker: false,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          const logs = (update as any).logs;
          if (logs?.length) console.log(`  ${logs[logs.length - 1].message}`);
        }
      },
    });

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const imageUrl = (result as any).data?.images?.[0]?.url;
    if (!imageUrl) {
      console.error(`  No image URL for ${scene.name}`);
      continue;
    }

    const destPath = path.join(OUTPUT_DIR, scene.filename);
    await downloadFile(imageUrl, destPath);
    const size = (fs.statSync(destPath).size / 1024).toFixed(0);
    console.log(`  Saved: ${scene.filename} (${size} KB) in ${elapsed}s`);
  }
  console.log("DONE");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
