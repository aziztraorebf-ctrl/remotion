import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";

dotenv.config();
fal.config({ credentials: process.env.FAL_KEY });

const OUTPUT_DIR = path.join(__dirname, "..", "generated", "previz-v3");

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
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
      .on("error", reject);
  });
}

const VARIANTS = [
  {
    name: "E - Realistic Remotion mockup: flat parchment photo + flat green SVG map overlay",
    filename: "previz-realistic-remotion.png",
    prompt:
      "A computer screenshot of a video editor showing a 1920x1080 frame, " +
      "the background is a flat photograph of aged parchment paper filling the entire frame, warm golden beige tones, " +
      "the parchment photo is flat like a wallpaper not a 3D object, evenly lit with no perspective or curling edges, " +
      "on top of the parchment a flat 2D vector map of Europe is overlaid, the map is filled with solid flat green color (#00CC44), " +
      "the countries have thin dark black border lines between them like an SVG drawing, " +
      "the green is a solid flat color sitting ON TOP of the parchment not blended into the paper texture, " +
      "you can see the parchment texture around the edges of the map where there is no green, " +
      "5 small bright red circles are placed on the map at city locations like data points on a dashboard, " +
      "each red dot has a faint red glow around it, " +
      "very subtle horizontal scanlines across the entire image like an old CRT monitor, " +
      "the overall look is a flat 2D digital composition not a photograph of a real object, " +
      "it looks like a React web application rendering layers on top of each other, " +
      "NO text NO numbers NO labels NO writing, just the parchment background and the green map with red dots, " +
      "clean digital aesthetic, 16:9 aspect ratio, dark subtle vignette at the very edges",
    seed: 1347,
  },
  {
    name: "F - Alternate: same concept, warmer parchment, slightly transparent green",
    filename: "previz-realistic-remotion-warm.png",
    prompt:
      "A flat digital composition at 1920x1080 resolution, " +
      "the entire background is a flat scanned photograph of old yellowed parchment paper, well lit, warm golden tones, " +
      "the parchment is perfectly flat like a scanned document with visible grain stains and age marks, " +
      "centered on the parchment is a flat 2D vector-style map of Europe rendered as a simple colored overlay, " +
      "the countries are filled with semi-transparent green (#00FF41 at 70% opacity) so the parchment texture shows through slightly, " +
      "thin dark lines separate each country like borders on a simple SVG map, " +
      "the map is clearly a flat digital layer placed on top of the paper background not physically part of it, " +
      "6 bright red glowing dots are scattered across the map marking cities, each with a soft red halo, " +
      "faint horizontal CRT scanlines visible across the whole image very subtle, " +
      "slight dark vignette in the corners, " +
      "the aesthetic is a retro computer terminal displaying data over an old paper background, " +
      "everything is flat and 2D like a web page rendering, NO 3D effects NO perspective NO curling paper, " +
      "NO text NO numbers NO writing anywhere on the image, " +
      "clean sharp digital rendering, 16:9 widescreen format",
    seed: 1351,
  },
];

async function main(): Promise<void> {
  console.log("=== Previz V3: Parchment + Green Projection ===\n");
  if (!process.env.FAL_KEY) {
    console.error("ERROR: FAL_KEY missing in .env");
    process.exit(1);
  }
  ensureDir(OUTPUT_DIR);

  for (const v of VARIANTS) {
    console.log(`--- ${v.name} ---`);
    const start = Date.now();
    try {
      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: {
          prompt: v.prompt,
          image_size: "landscape_16_9",
          num_inference_steps: 28,
          guidance_scale: 3.5,
          seed: v.seed,
          num_images: 1,
          enable_safety_checker: false,
        },
        logs: false,
      });
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      const imageUrl = (result as any).data?.images?.[0]?.url;
      if (imageUrl) {
        const dest = path.join(OUTPUT_DIR, v.filename);
        await downloadFile(imageUrl, dest);
        const size = (fs.statSync(dest).size / 1024).toFixed(0);
        console.log(`  OK - ${elapsed}s - ${size} KB -> ${v.filename}`);
      } else {
        console.error("  FAIL - no image URL");
      }
    } catch (err: any) {
      console.error(`  FAIL - ${err.message}`);
    }
  }
  console.log(`\nFiles in: ${OUTPUT_DIR}`);
}

main().catch(console.error);
