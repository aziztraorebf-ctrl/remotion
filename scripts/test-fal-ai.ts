import { fal } from "@fal-ai/client";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";

dotenv.config();

fal.config({ credentials: process.env.FAL_KEY });

const OUTPUT_DIR = path.join(__dirname, "..", "generated", "fal-test");

function ensureDir(dir: string) {
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
      response.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}

async function test1_parchmentBackground() {
  console.log("\n=== TEST 1: Fond parchemin medieval ===");
  console.log("Modele: fal-ai/flux/dev");
  const start = Date.now();

  try {
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: `Ancient medieval manuscript parchment texture, burned and torn edges with darkening, faded ink stains and water damage, subtle green mold spots in corners, texture of aged animal skin, sepia tones and dark olive, highly detailed macro photography, no text no letters no words, pure organic texture, atmospheric dust motes visible in light beam, dark academia aesthetic, ominous plague atmosphere, decay and time visible, 16:9 aspect ratio`,
        image_size: "landscape_16_9",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        seed: 42,
      },
      logs: false,
    });

    const elapsed = Date.now() - start;
    const imageUrl = (result.data as any).images?.[0]?.url;
    console.log(`Temps: ${elapsed}ms`);
    console.log(`URL: ${imageUrl}`);

    if (imageUrl) {
      const dest = path.join(OUTPUT_DIR, "test1-parchment.png");
      await downloadFile(imageUrl, dest);
      console.log(`Sauvegarde: ${dest}`);
    }

    return imageUrl;
  } catch (err: any) {
    console.error(`ERREUR: ${err.message}`);
    if (err.body) console.error("Details:", JSON.stringify(err.body, null, 2));
    return null;
  }
}

async function test2_upscaleSprite() {
  console.log("\n=== TEST 2: Upscale sprite plague doctor ===");

  const spritePath = path.join(
    __dirname, "..", "public", "assets", "peste-pixel", "sprites", "plague-doctor", "plague-doctor.png"
  );

  if (!fs.existsSync(spritePath)) {
    console.error("Sprite non trouve:", spritePath);
    return null;
  }

  console.log("Sprite source: 480x192 (sprite sheet)");

  // Upload the sprite to fal storage first
  const start = Date.now();
  try {
    const fileBuffer = fs.readFileSync(spritePath);
    const file = new File([fileBuffer], "plague-doctor.png", { type: "image/png" });
    const uploadedUrl = await fal.storage.upload(file);
    console.log(`Upload: ${uploadedUrl}`);

    const result = await fal.subscribe("fal-ai/esrgan", {
      input: {
        image_url: uploadedUrl,
        scale: 4,
      },
      logs: false,
    });

    const elapsed = Date.now() - start;
    const imageUrl = (result.data as any).image?.url;
    console.log(`Temps: ${elapsed}ms`);
    console.log(`URL: ${imageUrl}`);

    if (imageUrl) {
      const dest = path.join(OUTPUT_DIR, "test2-upscaled-plague-doctor.png");
      await downloadFile(imageUrl, dest);
      console.log(`Sauvegarde: ${dest}`);
    }

    return imageUrl;
  } catch (err: any) {
    console.error(`ERREUR: ${err.message}`);
    if (err.body) console.error("Details:", JSON.stringify(err.body, null, 2));
    return null;
  }
}

async function test3_generateMedievalScene() {
  console.log("\n=== TEST 3: Scene medievale complete (pour storyboard) ===");
  console.log("Modele: fal-ai/flux/dev");
  const start = Date.now();

  try {
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: `Medieval plague data visualization interface, ancient parchment texture as background with burned edges, green CRT terminal overlay showing mortality data, faint outline map of Europe in dark green ink beneath, red glowing dots marking afflicted cities along Mediterranean, horizontal scan lines across screen, dust particles floating in candlelight, sepia and phosphor green color palette, fusion of 14th century manuscript and 1980s computer terminal, mood ominous historical technological decay, highly detailed cinematic composition, 16:9`,
        image_size: "landscape_16_9",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        seed: 1347,
      },
      logs: false,
    });

    const elapsed = Date.now() - start;
    const imageUrl = (result.data as any).images?.[0]?.url;
    console.log(`Temps: ${elapsed}ms`);
    console.log(`URL: ${imageUrl}`);

    if (imageUrl) {
      const dest = path.join(OUTPUT_DIR, "test3-medieval-interface.png");
      await downloadFile(imageUrl, dest);
      console.log(`Sauvegarde: ${dest}`);
    }

    return imageUrl;
  } catch (err: any) {
    console.error(`ERREUR: ${err.message}`);
    if (err.body) console.error("Details:", JSON.stringify(err.body, null, 2));
    return null;
  }
}

async function main() {
  ensureDir(OUTPUT_DIR);
  console.log("=== TESTS FAL.AI - Pipeline Peste 1347 ===");
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`FAL_KEY: ${process.env.FAL_KEY ? "OK (set)" : "MANQUANTE!"}`);

  const parchmentUrl = await test1_parchmentBackground();
  const upscaleUrl = await test2_upscaleSprite();
  const sceneUrl = await test3_generateMedievalScene();

  console.log("\n=== RESULTATS ===");
  console.log(`Test 1 (Parchemin): ${parchmentUrl ? "OK" : "ECHEC"}`);
  console.log(`Test 2 (Upscale):   ${upscaleUrl ? "OK" : "ECHEC"}`);
  console.log(`Test 3 (Scene):     ${sceneUrl ? "OK" : "ECHEC"}`);
  console.log(`\nFichiers dans: ${OUTPUT_DIR}`);
}

main().catch(console.error);
