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
const OUTPUT_DIR = "public/audio/peste-pixel/s3";

// S3 — La Fuite des Elites (5:20 - 7:00)
// 8 segments vocaux correspondant au script V3.1
const s3Scenes = [
  {
    id: "seg3_01",
    text: "La violence efface. Et pendant qu'elle efface... ceux qui ont les moyens de partir... partent.",
  },
  {
    id: "seg3_02",
    text: "A Florence, Giovanni Boccaccio decrit des nobles qui quittent la ville pour s'installer dans leurs villas de campagne. Ils y passent leurs journees a boire du vin, manger des festins et se raconter des histoires. C'est d'ailleurs l'origine du Decameron -- dix personnes, dix jours, cent histoires... pendant que Florence se vide de ses habitants.",
  },
  {
    id: "seg3_03",
    text: "Pendant ce temps, les cadavres s'entassent dans les rues. Personne ne les ramasse. Les pauvres n'ont nulle part ou fuir.",
  },
  {
    id: "seg3_04",
    text: "Les chiffres sont clairs. A Florence, les registres du Catasto montrent une mortalite de vingt a trente pour cent chez les riches... contre quarante a cinquante pour cent chez les pauvres.",
  },
  {
    id: "seg3_05",
    text: "A Londre, les analyses osteologiques des cimetieres de la peste confirment la meme chose. Les individus malnutris, affaiblis -- les pauvres -- mouraient significativement plus.",
  },
  {
    id: "seg3_06",
    text: "La raison est simple. Les quartiers riches avaient de l'espace, de l'air, de l'eau propre. Les quartiers pauvres n'avaient rien de tout cela -- trop de monde, pas d'hygiene, pas d'air.",
  },
  {
    id: "seg3_07",
    text: "Les siecles changent. Le reflexe reste le meme.",
  },
  {
    id: "seg3_08",
    text: "A Venise, les patriciens evacuaient vers leurs iles. A Londres, les marchands filaient vers la campagne. A chaque crise, ceux qui ont les moyens de fuir... fuient. Et ceux qui restent meurent en premier. C'etait vrai a Florence. C'etait vrai a Londres. C'est une constante.",
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
  console.log(`  Text: "${scene.text.substring(0, 70)}..."`);

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
  console.log("=== Peste 1347 - S3 Audio Generation (La Fuite des Elites) ===");
  console.log(`Voice: Chris (${VOICE_ID})`);
  console.log(`Scenes: ${s3Scenes.length} segments (seg3_01 to seg3_08)`);
  console.log(`Output: ${OUTPUT_DIR}/`);
  console.log("");

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const scene of s3Scenes) {
    await generateScene(scene);
    await new Promise((r) => setTimeout(r, 800));
  }

  console.log("");
  console.log("=== Measuring durations (ffprobe) ===");
  let totalDuration = 0;
  const measurements: Record<string, number> = {};

  for (const scene of s3Scenes) {
    const filePath = path.join(OUTPUT_DIR, `${scene.id}.mp3`);
    if (fs.existsSync(filePath)) {
      const duration = measureDuration(filePath);
      totalDuration += duration;
      measurements[scene.id] = duration;
      const frames = Math.round(duration * 30);
      console.log(`  ${scene.id}: ${duration.toFixed(2)}s = ${frames}f`);
    }
  }

  console.log("");
  console.log(`  TOTAL: ${totalDuration.toFixed(2)}s = ${Math.round(totalDuration * 30)}f`);
  console.log("");
  console.log("=== Generation complete ===");
  console.log("Next step: Pass these measurements to the storyboarder to produce SCENE_TIMING_S3.ts");
  console.log("");
  console.log("IMPORTANT for storyboarder:");
  console.log("  DESAT_START = timestamp of last syllable of 'partent' in seg3_01");
  console.log("  DESAT_END   = DESAT_START + 45 to 60 frames");
}

main().catch((err) => {
  console.error("Pipeline failed:", err.message);
  process.exit(1);
});
