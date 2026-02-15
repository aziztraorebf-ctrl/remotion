import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";

dotenv.config();
fal.config({ credentials: process.env.FAL_KEY });

const OUTPUT_DIR = path.join(__dirname, "..", "generated", "showcase-previz");

// NO pixel art suffix - fal.ai is for RICH BACKGROUNDS, not pixel sprites
// Sprites, HUD, data overlays, speech bubbles = Remotion (React/SVG/CSS)

interface SceneConfig {
  name: string;
  filename: string;
  prompt: string;
  seed: number;
  description: string; // what Remotion would overlay on top
}

const SCENES: SceneConfig[] = [
  // IMAGE 1: PESTE 1347 - Medieval street with plague atmosphere
  {
    name: "Peste 1347 - Ruelle medievale pendant la Peste",
    filename: "01-peste-medieval-street.png",
    prompt:
      "A narrow medieval European city street during the Black Death plague of 1347, " +
      "14th century stone and timber-frame buildings leaning inward creating claustrophobic perspective, " +
      "thick yellow-green miasma fog rolling through at ground level, " +
      "a single iron lantern on a wall casting warm amber light through the fog, " +
      "wet cobblestones with puddles reflecting sickly light, " +
      "abandoned wooden cart with cloth-covered bodies partially visible, " +
      "dried herbs hanging from doorframes as plague remedies, " +
      "a crude chalk cross marked on a boarded-up door, " +
      "rats silhouetted along the gutter edge, " +
      "dark stormy sky barely visible between rooftops, " +
      "oil painting style, rich textures, dramatic chiaroscuro lighting, " +
      "Caravaggio meets Bruegel atmosphere, cinematic composition, " +
      "muted earth tones with warm amber accents, photorealistic detail, " +
      "no text, no words, no letters, no UI elements, no modern objects, no people visible",
    seed: 1347,
    description:
      "Remotion overlay: pixel art plague doctor sprite walking through fog, " +
      "HUD top-left showing 'MORT: 24,987,231' counter incrementing, " +
      "health bar labeled 'EUROPE' draining from green to red, " +
      "speech bubble: 'Les rats... personne ne regarde les rats.'",
  },

  // IMAGE 2: PESTE 1347 - Town square with bonfire (flagellants scene)
  {
    name: "Peste 1347 - Place publique au crepuscule",
    filename: "02-peste-town-square.png",
    prompt:
      "A large medieval town square at twilight during the 14th century Black Death, " +
      "massive bonfire in the center with orange flames reaching high, casting dancing shadows, " +
      "gothic cathedral silhouette against deep purple-blue twilight sky, " +
      "half-timbered buildings surrounding the square with some windows boarded up, " +
      "multiple torches mounted on wooden poles around the perimeter, " +
      "scattered personal belongings on the cobblestones - shoes, bags, a broken rosary, " +
      "wooden platform or stage near the bonfire with whipping posts, " +
      "smoke mixing with evening mist creating atmospheric layers, " +
      "a well with a bucket in the corner of the square, " +
      "oil painting style, Dutch Golden Age atmosphere, Rembrandt lighting, " +
      "rich warm and cool contrast, deep shadows, cinematic wide shot, " +
      "no text, no words, no letters, no UI elements, no modern objects, no people visible",
    seed: 1348,
    description:
      "Remotion overlay: 3-4 pixel art flagellant sprites in procession, " +
      "crowd of tiny pixel townspeople watching, " +
      "animated counter 'JOUR 847 DE LA PESTE' in top-right, " +
      "temperature-style bar showing 'PANIQUE COLLECTIVE' rising",
  },

  // IMAGE 3: FINANCE - Modern city at night (economic RPG concept)
  {
    name: "Finance RPG - Ville moderne nocturne",
    filename: "03-finance-city-night.png",
    prompt:
      "A dramatic aerial view of a modern financial district at night, " +
      "glass skyscrapers with glowing windows creating a canyon of light, " +
      "one building prominently displays a large stock ticker board with green and red lights, " +
      "rain-slicked streets below reflecting neon signs and building lights, " +
      "a single pedestrian bridge connecting two towers, illuminated from below, " +
      "dark storm clouds above with occasional lightning, " +
      "warm golden light from street-level cafes and shops contrasting with cold blue tower lights, " +
      "volumetric fog between buildings creating depth layers, " +
      "a distant view of more city lights stretching to the horizon, " +
      "cinematic photography style, cyberpunk-lite aesthetic, " +
      "Blade Runner meets Wall Street atmosphere, dramatic contrast, " +
      "no text, no words, no letters, no UI elements, no visible brand names",
    seed: 2024,
    description:
      "Remotion overlay: pixel art character sprite at bottom, " +
      "RPG-style HUD: 'SALAIRE: 2,847 EUR/mois' with gold coin icon, " +
      "'EPARGNE: 12%' bar filling up, 'BOSS: RETRAITE' health bar at top, " +
      "animated stock chart drawing itself in real-time, " +
      "speech bubble: 'Ton ennemi numero 1? L inflation. Et elle ne dort jamais.'",
  },

  // IMAGE 4: SCIENCE - Deep space / cosmic exploration
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
    description:
      "Remotion overlay: pixel astronaut sprite floating with tether, " +
      "HUD showing 'DISTANCE: 4.2 annees-lumiere' incrementing, " +
      "animated scale comparison bar: 'Soleil → ici → Proxima', " +
      "data viz: temperature graph of nebula layers drawing in real-time, " +
      "speech bubble: 'A cette echelle, la Terre est invisible. Toi aussi.'",
  },

  // IMAGE 5: HISTORY - Ancient Roman forum (versatility demo)
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
    description:
      "Remotion overlay: pixel art Roman senator sprite walking, " +
      "HUD: 'EMPIRE ROMAIN - 117 AP. J.-C.' with map of territory, " +
      "animated population counter: '70,000,000 citoyens', " +
      "timeline bar at bottom showing expansion/contraction of empire, " +
      "speech bubble: 'Le plus grand empire du monde... et il tient avec 30 legions.'",
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
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function generateScene(scene: SceneConfig): Promise<string> {
  console.log(`\n--- Generating: ${scene.name} (seed: ${scene.seed}) ---`);
  console.log(`Prompt (first 150 chars): ${scene.prompt.substring(0, 150)}...`);

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
        console.log(
          `  Queue position: ${(update as any).queue_position ?? "?"}`
        );
      } else if (update.status === "IN_PROGRESS") {
        const logs = (update as any).logs;
        if (logs && logs.length > 0) {
          console.log(`  Progress: ${logs[logs.length - 1].message}`);
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
  console.log(`  Downloading...`);
  await downloadFile(imageUrl, destPath);

  const stats = fs.statSync(destPath);
  console.log(`  Saved: ${scene.filename} (${(stats.size / 1024).toFixed(0)} KB)`);

  return destPath;
}

async function main(): Promise<void> {
  console.log("=== SHOWCASE PREVIZ - HD-2D Backgrounds for Remotion ===");
  console.log(`Model: fal-ai/flux/dev`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Scenes: ${SCENES.length}`);
  console.log(
    `Strategy: fal.ai = rich backgrounds ONLY. Sprites/HUD/data = Remotion.\n`
  );

  if (!process.env.FAL_KEY) {
    console.error("ERROR: FAL_KEY not found in .env");
    process.exit(1);
  }

  ensureDir(OUTPUT_DIR);

  const results: {
    name: string;
    path: string;
    success: boolean;
    error?: string;
  }[] = [];

  for (const scene of SCENES) {
    try {
      const filePath = await generateScene(scene);
      results.push({ name: scene.name, path: filePath, success: true });
    } catch (err: any) {
      console.error(`  ERROR: ${err.message}`);
      results.push({
        name: scene.name,
        path: "",
        success: false,
        error: err.message,
      });
    }
  }

  console.log("\n=== RESULTS ===");
  for (const r of results) {
    const status = r.success ? "OK" : "FAIL";
    console.log(`  [${status}] ${r.name}`);
  }

  const successCount = results.filter((r) => r.success).length;
  console.log(`\n${successCount}/${SCENES.length} generated successfully.`);
  console.log(
    `Estimated cost: ~$${(successCount * 0.03).toFixed(2)} (flux/dev ~$0.03/image)`
  );

  // Save metadata with overlay descriptions for future reference
  const metadata = {
    generatedAt: new Date().toISOString(),
    model: "fal-ai/flux/dev",
    purpose:
      "Showcase previz - backgrounds only. Remotion overlays described in each scene.",
    settings: {
      image_size: "landscape_16_9",
      num_inference_steps: 28,
      guidance_scale: 3.5,
    },
    scenes: SCENES.map((s, i) => ({
      name: s.name,
      filename: s.filename,
      seed: s.seed,
      prompt: s.prompt,
      remotionOverlay: s.description,
      status: results[i]?.success ? "ok" : "failed",
    })),
  };
  const metaPath = path.join(OUTPUT_DIR, "showcase-metadata.json");
  fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
  console.log(`\nMetadata saved to ${metaPath}`);

  // Also save prompts as standalone text for testing in other tools
  const promptsText = SCENES.map(
    (s) =>
      `=== ${s.name} ===\nSeed: ${s.seed}\n\n${s.prompt}\n\n[Remotion Overlay]\n${s.description}\n`
  ).join("\n---\n\n");
  const promptsPath = path.join(OUTPUT_DIR, "prompts-for-comparison.txt");
  fs.writeFileSync(promptsPath, promptsText);
  console.log(`Prompts for comparison saved to ${promptsPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
