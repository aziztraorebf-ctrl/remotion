import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";

dotenv.config();
fal.config({ credentials: process.env.FAL_KEY });

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            downloadFile(redirectUrl, dest).then(resolve).catch(reject);
          } else {
            reject(new Error("Redirect without location"));
          }
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
  const prompt =
    "A complete pixel art video game scene in 16-bit SNES style, showing a medieval plague-era " +
    "European city street. The entire image is rendered in crisp clean pixel art with visible " +
    "individual pixels and no anti-aliasing. Cobblestone street made of square pixel blocks, " +
    "timber-frame buildings with pixel-perfect edges, a wooden cart with plague victims shown " +
    "as simple pixel shapes under cloth, 3 rats as small dark pixel sprites on the ground, " +
    "green-yellow miasma fog as semi-transparent pixel clouds, a hanging lantern with warm " +
    "pixel glow, and a pixel art game HUD at the top showing a red heart health bar, a skull " +
    "counter, and day counter. Dark green brown and amber color palette like classic SNES RPGs. " +
    "Screenshot from a Super Nintendo RPG game. No smooth gradients, only crisp pixel edges, " +
    "no text, no words, no letters.";

  console.log("Generating pixel art via fal.ai Flux/dev...");
  const start = Date.now();

  const result = await fal.subscribe("fal-ai/flux/dev", {
    input: {
      prompt,
      image_size: "landscape_16_9",
      num_inference_steps: 28,
      guidance_scale: 3.5,
      seed: 1347,
      num_images: 1,
      enable_safety_checker: false,
    },
    logs: true,
  });

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`Generated in ${elapsed}s`);

  const data = result as any;
  const imageUrl = data.data?.images?.[0]?.url;
  if (!imageUrl) {
    console.error("No image URL");
    return;
  }

  const outDir = path.join(
    __dirname,
    "..",
    "generated",
    "showcase-previz",
    "pixel-test"
  );
  fs.mkdirSync(outDir, { recursive: true });
  const destPath = path.join(outDir, "peste-pixel-FALAI.png");
  await downloadFile(imageUrl, destPath);
  const size = (fs.statSync(destPath).size / 1024).toFixed(0);
  console.log(`Saved: peste-pixel-FALAI.png (${size} KB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
