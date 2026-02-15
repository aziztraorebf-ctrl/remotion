import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";

dotenv.config();

fal.config({ credentials: process.env.FAL_KEY });

const OUTPUT_DIR = path.join(__dirname, "..", "generated", "fal-test");

const STYLE_SUFFIX =
  "pixel art style, 16-bit aesthetic, detailed environment, atmospheric lighting, " +
  "cinematic composition, game art quality, dark medieval atmosphere, " +
  "no text, no words, no letters, no UI elements, no modern objects";

interface SceneConfig {
  name: string;
  filename: string;
  prompt: string;
  seed: number;
}

const SCENES: SceneConfig[] = [
  {
    name: "Ruelle medievale nocturne",
    filename: "scene1-ruelle-medievale.png",
    prompt:
      "Dark medieval alley at night, narrow cobblestone street between tall stone buildings " +
      "with timber frame houses, a single warm lantern mounted on a wall casting dramatic " +
      "golden light and long shadows, thick fog rolling through the alley, wooden doors and " +
      "shuttered windows, wet cobblestones reflecting the lantern glow, plague-era 14th century " +
      "European city, mysterious and eerie atmosphere, " +
      STYLE_SUFFIX,
    seed: 1347,
  },
  {
    name: "Place publique - Flagellants",
    filename: "scene2-place-flagellants.png",
    prompt:
      "Medieval town square at dusk, large open cobblestone plaza surrounded by half-timbered " +
      "buildings, a gothic church silhouette looming in the background against a dark purple and " +
      "deep blue twilight sky, multiple torches and lanterns casting warm orange pools of light, " +
      "atmospheric fog drifting across the square, 14th century European architecture, somber and " +
      "oppressive mood, shadows stretching across the ground, " +
      STYLE_SUFFIX,
    seed: 1348,
  },
  {
    name: "Cimetiere nocturne",
    filename: "scene3-cimetiere-nocturne.png",
    prompt:
      "Medieval graveyard at night, rough wooden crosses and simple grave markers scattered " +
      "across uneven ground, thick mist rising from the earth, a distant orange glow on the " +
      "horizon suggesting distant fires, gnarled dead trees with bare branches silhouetted " +
      "against a dark cloudy sky, a crumbling stone wall partially surrounding the cemetery, " +
      "horror undertones, ominous and haunting, 14th century Black Death era, " +
      STYLE_SUFFIX,
    seed: 1349,
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
        downloadFile(response.headers.location!, dest)
          .then(resolve)
          .catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
      file.on("error", (err) => {
        fs.unlinkSync(dest);
        reject(err);
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

async function generateScene(scene: SceneConfig): Promise<string> {
  console.log(`\n--- Generating: ${scene.name} (seed: ${scene.seed}) ---`);
  console.log(`Prompt: ${scene.prompt.substring(0, 120)}...`);

  const startTime = Date.now();

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
      if (update.status === "IN_QUEUE") {
        console.log(`  Queue position: ${(update as any).queue_position ?? "unknown"}`);
      } else if (update.status === "IN_PROGRESS") {
        const logs = (update as any).logs;
        if (logs && logs.length > 0) {
          const lastLog = logs[logs.length - 1];
          console.log(`  Progress: ${lastLog.message}`);
        }
      }
    },
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`  Generated in ${elapsed}s`);

  const imageUrl = (result as any).data?.images?.[0]?.url;
  if (!imageUrl) {
    throw new Error(`No image URL in response for ${scene.name}`);
  }

  const destPath = path.join(OUTPUT_DIR, scene.filename);
  console.log(`  Downloading to ${destPath}...`);
  await downloadFile(imageUrl, destPath);

  const stats = fs.statSync(destPath);
  console.log(`  Saved: ${scene.filename} (${(stats.size / 1024).toFixed(0)} KB)`);

  return destPath;
}

async function main(): Promise<void> {
  console.log("=== Peste 1347 - Scene Background Generation ===");
  console.log(`Model: fal-ai/flux/dev`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Scenes: ${SCENES.length}`);

  if (!process.env.FAL_KEY) {
    console.error("ERROR: FAL_KEY not found in .env");
    process.exit(1);
  }

  ensureDir(OUTPUT_DIR);

  const results: { name: string; path: string; success: boolean; error?: string }[] = [];

  for (const scene of SCENES) {
    try {
      const filePath = await generateScene(scene);
      results.push({ name: scene.name, path: filePath, success: true });
    } catch (err: any) {
      console.error(`  ERROR generating ${scene.name}: ${err.message}`);
      results.push({ name: scene.name, path: "", success: false, error: err.message });
    }
  }

  console.log("\n=== RESULTS ===");
  for (const r of results) {
    const status = r.success ? "OK" : "FAILED";
    console.log(`  [${status}] ${r.name} -> ${r.success ? r.path : r.error}`);
  }

  const successCount = results.filter((r) => r.success).length;
  console.log(`\n${successCount}/${SCENES.length} scenes generated successfully.`);

  if (successCount > 0) {
    const metadata = {
      generatedAt: new Date().toISOString(),
      model: "fal-ai/flux/dev",
      settings: {
        image_size: "landscape_16_9",
        num_inference_steps: 28,
        guidance_scale: 3.5,
      },
      styleSuffix: STYLE_SUFFIX,
      scenes: SCENES.map((s, i) => ({
        name: s.name,
        filename: s.filename,
        seed: s.seed,
        prompt: s.prompt,
        status: results[i].success ? "ok" : "failed",
      })),
    };
    const metaPath = path.join(OUTPUT_DIR, "scenes-metadata.json");
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
    console.log(`Metadata saved to ${metaPath}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
