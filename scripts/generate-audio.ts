import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("ELEVENLABS_API_KEY is not set in .env");
  process.exit(1);
}

const BASE_URL = "https://api.elevenlabs.io/v1";
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George - Warm, Captivating Storyteller

interface VoiceLine {
  id: string;
  text: string;
  outputPath: string;
}

interface SoundEffect {
  id: string;
  description: string;
  durationSeconds: number;
  loop: boolean;
  outputPath: string;
}

const voiceLines: VoiceLine[] = [
  {
    id: "idle",
    text: "Voici Bob. Il ne fait rien de special.",
    outputPath: "public/audio/voice/voice-idle.mp3",
  },
  {
    id: "reaction",
    text: "Oh? Quelque chose attire son attention!",
    outputPath: "public/audio/voice/voice-reaction.mp3",
  },
  {
    id: "walking",
    text: "Et le voila parti! Bob est curieux.",
    outputPath: "public/audio/voice/voice-walking.mp3",
  },
  {
    id: "waving",
    text: "Coucou!",
    outputPath: "public/audio/voice/voice-waving.mp3",
  },
  {
    id: "jumping",
    text: "Et hop! Quelle joie!",
    outputPath: "public/audio/voice/voice-jumping.mp3",
  },
];

const soundEffects: SoundEffect[] = [
  {
    id: "ambiance",
    description:
      "Gentle outdoor ambiance with birds chirping softly and a light breeze",
    durationSeconds: 10,
    loop: true,
    outputPath: "public/audio/sfx/sfx-ambiance.mp3",
  },
  {
    id: "surprise",
    description: "Short cartoon surprise sound effect, like a spring boing",
    durationSeconds: 0.5,
    loop: false,
    outputPath: "public/audio/sfx/sfx-surprise.mp3",
  },
  {
    id: "footsteps",
    description:
      "Cartoon character walking footsteps on grass, rhythmic and light",
    durationSeconds: 3,
    loop: false,
    outputPath: "public/audio/sfx/sfx-footsteps.mp3",
  },
  {
    id: "wave",
    description: "Short cheerful whistle or hello sound",
    durationSeconds: 0.8,
    loop: false,
    outputPath: "public/audio/sfx/sfx-wave.mp3",
  },
  {
    id: "jump",
    description: "Cartoon bouncy jump with springy landing",
    durationSeconds: 1.5,
    loop: false,
    outputPath: "public/audio/sfx/sfx-jump.mp3",
  },
];

async function generateVoice(line: VoiceLine): Promise<void> {
  console.log(`[Voice] Generating: ${line.id} - "${line.text}"`);

  const url = `${BASE_URL}/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: line.text,
      model_id: "eleven_multilingual_v2",
      language_code: "fr",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `TTS failed for "${line.id}": HTTP ${response.status} - ${errorText}`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const dir = path.dirname(line.outputPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(line.outputPath, buffer);
  console.log(`  -> Saved: ${line.outputPath} (${buffer.length} bytes)`);
}

async function generateSFX(sfx: SoundEffect): Promise<void> {
  console.log(`[SFX] Generating: ${sfx.id} - "${sfx.description}"`);

  const response = await fetch(`${BASE_URL}/sound-generation`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: sfx.description,
      duration_seconds: sfx.durationSeconds,
      prompt_influence: 0.3,
      loop: sfx.loop,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `SFX failed for "${sfx.id}": HTTP ${response.status} - ${errorText}`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const dir = path.dirname(sfx.outputPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(sfx.outputPath, buffer);
  console.log(`  -> Saved: ${sfx.outputPath} (${buffer.length} bytes)`);
}

async function main(): Promise<void> {
  console.log("=== 11Labs Audio Generation Pipeline ===");
  console.log(`Voice: George (${VOICE_ID})`);
  console.log(`Voice lines: ${voiceLines.length}`);
  console.log(`Sound effects: ${soundEffects.length}`);
  console.log("");

  console.log("--- Voice Lines ---");
  for (const line of voiceLines) {
    await generateVoice(line);
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("");
  console.log("--- Sound Effects ---");
  for (const sfx of soundEffects) {
    await generateSFX(sfx);
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("");
  console.log("=== Pipeline complete! ===");

  const voiceFiles = fs.readdirSync("public/audio/voice");
  const sfxFiles = fs.readdirSync("public/audio/sfx");
  console.log(`Voice files: ${voiceFiles.join(", ")}`);
  console.log(`SFX files: ${sfxFiles.join(", ")}`);
}

main().catch((err) => {
  console.error("Pipeline failed:", err.message);
  process.exit(1);
});
