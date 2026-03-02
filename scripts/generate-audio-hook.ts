import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { execFileSync } from "child_process";

dotenv.config();

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("ELEVENLABS_API_KEY is not set in .env");
  process.exit(1);
}

const BASE_URL = "https://api.elevenlabs.io/v1";
const VOICE_ID = "iP95p4xoKVk53GoZ742B"; // Chris
const OUTPUT_DIR = "public/audio/peste-pixel/hook";

// Hook scenes from scenes.json V3.1
const hookScenes = [
  {
    id: "hook_00_saint_pierre",
    text: "Saint-Pierre, Bourgogne, été mil trois cent quarante-sept. Thomas rentre des champs, les bras chargés de blé. Martin dit la messe. Isaac compte ses pièces. Guillaume surveille ses terres. Agnès prépare ses remèdes. [pause] Quant à Renaud... personne ne le connaît encore. [pause] Dans deux ans, la moitié d'entre eux seront morts. [short pause] Cette vidéo parle de ce qu'ils ont fait en attendant.",
  },
  {
    id: "hook_01_issyk_kul",
    text: "En mille trois cent trente-huit, au bord du lac Issyk-Kul, au Kirghizistan, des gens meurent. On grave sur leurs tombes un seul mot -- \"pestilence.\"",
  },
  {
    id: "hook_02_catapulte",
    text: "Sept ans plus tard, un khan mongol assiegeait la ville de Caffa, en Crimee. Son armee mourait de cette meme maladie. Alors il a eu une idee... catapulter les cadavres de ses soldats par-dessus les murs.",
  },
  {
    id: "hook_03_galeres",
    text: "Les marchands genois ont fui Caffa sur douze galeres. Quand ces navires firent escale a Messine, en Sicile, en octobre mille trois cent quarante-sept... les marins etaient deja morts ou mourants.",
  },
  {
    id: "hook_04_moitie",
    text: "En deux ans, la MOITIE de l'Europe allait disparaitre.",
  },
  {
    id: "hook_05_reframe",
    text: "Mais cette video ne parle pas de la maladie.",
  },
  {
    id: "hook_06_reveal",
    text: "Elle parle de ce que les HUMAINS ont fait... quand ils ont cru que c'etait la fin du monde.",
  },
  {
    id: "hook_07_reflexes",
    text: "Car a chaque crise... les memes reflexes reviennent. Encore et encore.",
  },
];

const voiceSettings = {
  stability: 0.0,
  similarity_boost: 0.8,
  style: 0.8,
  use_speaker_boost: true,
};

async function generateScene(scene: { id: string; text: string }): Promise<void> {
  const outputPath = path.join(OUTPUT_DIR, `${scene.id}.mp3`);

  if (fs.existsSync(outputPath)) {
    console.log(`  [SKIP] Already exists: ${scene.id}.mp3`);
    return;
  }

  console.log(`[TTS] Generating: ${scene.id}`);
  console.log(`  Text: "${scene.text.substring(0, 60)}..."`);

  const url = `${BASE_URL}/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: scene.text,
      model_id: "eleven_v3",
      language_code: "fr",
      voice_settings: voiceSettings,
      text_normalization: "on",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`TTS failed for "${scene.id}": HTTP ${response.status} - ${errorText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(outputPath, buffer);
  console.log(`  -> Saved: ${outputPath} (${buffer.length} bytes)`);
}

function measureDuration(filePath: string): number {
  const result = execFileSync("ffprobe", [
    "-v", "quiet",
    "-print_format", "json",
    "-show_format",
    filePath,
  ]).toString();
  const data = JSON.parse(result);
  return parseFloat(data.format.duration);
}

async function main(): Promise<void> {
  console.log("=== Peste 1347 - Hook Audio Generation ===");
  console.log(`Voice: Chris (${VOICE_ID})`);
  console.log(`Scenes: ${hookScenes.length} (hook_01 to hook_07)`);
  console.log(`Output: ${OUTPUT_DIR}/`);
  console.log("");

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const scene of hookScenes) {
    await generateScene(scene);
    await new Promise((r) => setTimeout(r, 800));
  }

  console.log("");
  console.log("=== Measuring durations ===");
  let totalDuration = 0;
  for (const scene of hookScenes) {
    const filePath = path.join(OUTPUT_DIR, `${scene.id}.mp3`);
    if (fs.existsSync(filePath)) {
      const duration = measureDuration(filePath);
      totalDuration += duration;
      console.log(`  ${scene.id}: ${duration.toFixed(2)}s`);
    }
  }
  console.log(`  TOTAL: ${totalDuration.toFixed(2)}s`);
  console.log(`  TOTAL (frames @30fps): ${Math.round(totalDuration * 30)} frames`);

  console.log("");
  console.log("=== Generation complete ===");
  console.log("Next step: Run storyboarder with these durations to produce SCENE_TIMING.ts");
}

main().catch((err) => {
  console.error("Pipeline failed:", err.message);
  process.exit(1);
});
