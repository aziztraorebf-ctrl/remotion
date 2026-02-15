import * as fs from "fs";
import * as path from "path";

// Load .env manually without dotenv dependency
const envPath = path.resolve(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) continue;
  const key = trimmed.slice(0, eqIndex);
  const value = trimmed.slice(eqIndex + 1);
  process.env[key] = value;
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
const BASE_URL = "https://api.elevenlabs.io/v1";
const OUTPUT_DIR = path.resolve(__dirname, "../public/audio/retro-explainer");

interface SFXRequest {
  name: string;
  prompt: string;
  duration: number;
  subfolder: "sfx" | "voice";
}

const SFX_REQUESTS: SFXRequest[] = [
  {
    name: "chiptune-loop",
    prompt:
      "8-bit chiptune background music, retro video game soundtrack, upbeat NES style, loopable, energetic pixel art game music",
    duration: 15,
    subfolder: "sfx",
  },
  {
    name: "level-up",
    prompt:
      "retro 8-bit level up sound effect, triumphant short fanfare, NES style victory jingle, pixelated game achievement",
    duration: 3,
    subfolder: "sfx",
  },
  {
    name: "text-blip",
    prompt:
      "retro RPG text scroll sound, single short beep blip for dialogue box text appearing, 8-bit game UI sound",
    duration: 1,
    subfolder: "sfx",
  },
  {
    name: "boss-alarm",
    prompt:
      "retro game boss warning alarm, 8-bit danger siren, NES style alert sound, dramatic pixel game warning",
    duration: 3,
    subfolder: "sfx",
  },
  {
    name: "coin-collect",
    prompt:
      "8-bit coin collect sound effect, retro game pickup sound, short bright chime, classic NES coin",
    duration: 1,
    subfolder: "sfx",
  },
  {
    name: "power-up",
    prompt:
      "retro game power-up sound, ascending 8-bit tones, classic NES powerup, bright cheerful upgrade sound",
    duration: 2,
    subfolder: "sfx",
  },
];

async function generateSFX(req: SFXRequest): Promise<void> {
  const outPath = path.join(OUTPUT_DIR, req.subfolder, `${req.name}.mp3`);

  if (fs.existsSync(outPath)) {
    console.log(`[SKIP] ${req.name} already exists`);
    return;
  }

  console.log(`[GEN] Generating ${req.name}...`);

  const response = await fetch(`${BASE_URL}/sound-generation`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: req.prompt,
      duration_seconds: req.duration,
      prompt_influence: 0.5,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error(`[ERR] ${req.name}: ${response.status} - ${errBody}`);
    return;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outPath, buffer);
  console.log(`[OK] ${req.name} saved (${buffer.length} bytes)`);
}

async function generateVoiceOver(): Promise<void> {
  const voiceLines = [
    {
      name: "hook",
      text: "Savais-tu que ton credit immobilier te coute presque le double?",
    },
    {
      name: "stage1",
      text: "Stage un. Tu empruntes trois cent quarante mille euros. Ca a l'air simple.",
    },
    {
      name: "boss-intro",
      text: "Attention! Boss final. Les interets composes!",
    },
    {
      name: "reveal",
      text: "En realite, tu rembourseras six cent douze mille euros. Presque le double.",
    },
    {
      name: "victory",
      text: "Mais il existe des strategies pour gagner cette bataille. Analyse complete dans la description.",
    },
  ];

  // Use a default French voice from ElevenLabs
  // "Antoine" is a common French voice ID - we'll list voices first
  const voicesRes = await fetch(`${BASE_URL}/voices`, {
    headers: { "xi-api-key": API_KEY! },
  });

  if (!voicesRes.ok) {
    console.error(`[ERR] Could not fetch voices: ${voicesRes.status}`);
    return;
  }

  const voicesData = await voicesRes.json();
  // Find a French male voice
  const frenchVoice = voicesData.voices?.find(
    (v: { labels?: { language?: string; accent?: string }; name?: string }) =>
      v.labels?.language === "fr" ||
      v.labels?.accent === "french" ||
      v.name?.toLowerCase().includes("antoine") ||
      v.name?.toLowerCase().includes("french")
  );

  // Fallback to "Thomas" which is a commonly available multilingual voice
  const voiceId = frenchVoice?.voice_id || "GBv7mTt0atIp3Br8iCZE"; // Thomas (multilingual)

  console.log(
    `[VOICE] Using voice: ${frenchVoice?.name || "Thomas (fallback)"} (${voiceId})`
  );

  for (const line of voiceLines) {
    const outPath = path.join(OUTPUT_DIR, "voice", `${line.name}.mp3`);

    if (fs.existsSync(outPath)) {
      console.log(`[SKIP] voice/${line.name} already exists`);
      continue;
    }

    console.log(`[GEN] Generating voice: ${line.name}...`);

    const response = await fetch(
      `${BASE_URL}/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: line.text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.75,
            style: 0.4,
          },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error(
        `[ERR] voice/${line.name}: ${response.status} - ${errBody}`
      );
      continue;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outPath, buffer);
    console.log(`[OK] voice/${line.name} saved (${buffer.length} bytes)`);
  }
}

async function main() {
  console.log("=== Retro Explainer Audio Generation ===\n");

  // Ensure output dirs exist
  fs.mkdirSync(path.join(OUTPUT_DIR, "sfx"), { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, "voice"), { recursive: true });

  // Generate SFX in parallel (batches of 3 to avoid rate limits)
  for (let i = 0; i < SFX_REQUESTS.length; i += 3) {
    const batch = SFX_REQUESTS.slice(i, i + 3);
    await Promise.all(batch.map((req) => generateSFX(req)));
    if (i + 3 < SFX_REQUESTS.length) {
      console.log("[WAIT] Pause between batches...");
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log("\n--- Voice Generation ---\n");
  await generateVoiceOver();

  console.log("\n=== Done! ===");
}

main().catch(console.error);
