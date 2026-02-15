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
const VOICE_ID = "TX3LPaxmHKxFdv7VOQHJ"; // Liam - Energetic, Social Media Creator

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

const OUTPUT_DIR = "public/audio/speed-reading";

const voiceLines: VoiceLine[] = [
  {
    id: "voice-hook",
    text: "(excited, teasing) How fast can YOUR brain read? Let's find out!",
    outputPath: `${OUTPUT_DIR}/voice/voice-hook.mp3`,
  },
  {
    id: "voice-warmup-intro",
    text: "(casual, encouraging) Starting with a warm-up. One hundred and fifty words per minute. Ready?",
    outputPath: `${OUTPUT_DIR}/voice/voice-warmup-intro.mp3`,
  },
  {
    id: "voice-warmup-success",
    text: "(upbeat, positive) Well done! Next level incoming.",
    outputPath: `${OUTPUT_DIR}/voice/voice-warmup-success.mp3`,
  },
  {
    id: "voice-level1-intro",
    text: "(confident) Level one. Two hundred words per minute.",
    outputPath: `${OUTPUT_DIR}/voice/voice-level1-intro.mp3`,
  },
  {
    id: "voice-level1-success",
    text: "(impressed) Impressive! Can you keep going?",
    outputPath: `${OUTPUT_DIR}/voice/voice-level1-success.mp3`,
  },
  {
    id: "voice-level2-intro",
    text: "(building energy) Level two. Three hundred words per minute.",
    outputPath: `${OUTPUT_DIR}/voice/voice-level2-intro.mp3`,
  },
  {
    id: "voice-level2-success",
    text: "(hyped) You're doing great! It's about to get intense.",
    outputPath: `${OUTPUT_DIR}/voice/voice-level2-success.mp3`,
  },
  {
    id: "voice-level3-intro",
    text: "(serious, focused) Level three. Four hundred words per minute.",
    outputPath: `${OUTPUT_DIR}/voice/voice-level3-intro.mp3`,
  },
  {
    id: "voice-level3-success",
    text: "(amazed) Incredible! Only two levels remain.",
    outputPath: `${OUTPUT_DIR}/voice/voice-level3-success.mp3`,
  },
  {
    id: "voice-level4-intro",
    text: "(intense) Level four. Five hundred words per minute.",
    outputPath: `${OUTPUT_DIR}/voice/voice-level4-intro.mp3`,
  },
  {
    id: "voice-level4-success",
    text: "(blown away) Amazing! One final challenge.",
    outputPath: `${OUTPUT_DIR}/voice/voice-level4-success.mp3`,
  },
  {
    id: "voice-level5-intro",
    text: "(intense, dramatic) Level five. Six hundred words per minute. Stay focused.",
    outputPath: `${OUTPUT_DIR}/voice/voice-level5-intro.mp3`,
  },
  {
    id: "voice-level5-success",
    text: "(shocked, excited) Unbelievable! Are you ready for inhuman mode?",
    outputPath: `${OUTPUT_DIR}/voice/voice-level5-success.mp3`,
  },
  {
    id: "voice-inhuman-intro",
    text: "(dark, ominous) Inhuman mode. Eight hundred words per minute. (whispered) Good luck.",
    outputPath: `${OUTPUT_DIR}/voice/voice-inhuman-intro.mp3`,
  },
  {
    id: "voice-outro",
    text: "(friendly, curious) What level did you reach? Subscribe for more brain challenges!",
    outputPath: `${OUTPUT_DIR}/voice/voice-outro.mp3`,
  },
];

const soundEffects: SoundEffect[] = [
  {
    id: "sfx-ding",
    description: "Single clean crystal bell ding, subtle and pleasant, like a meditation bell tap",
    durationSeconds: 1,
    loop: false,
    outputPath: `${OUTPUT_DIR}/sfx/sfx-ding.mp3`,
  },
  {
    id: "sfx-ambient",
    description: "Very soft ambient drone, calm and minimal, suitable for concentration and focus, dark atmospheric pad",
    durationSeconds: 15,
    loop: true,
    outputPath: `${OUTPUT_DIR}/sfx/sfx-ambient.mp3`,
  },
  {
    id: "sfx-whoosh",
    description: "Quick subtle digital whoosh sound effect, futuristic and clean",
    durationSeconds: 1,
    loop: false,
    outputPath: `${OUTPUT_DIR}/sfx/sfx-whoosh.mp3`,
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
      language_code: "en",
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
  console.log("=== Speed Reading Audio Generation Pipeline ===");
  console.log(`Voice: Liam (${VOICE_ID})`);
  console.log(`Language: English`);
  console.log(`Voice lines: ${voiceLines.length}`);
  console.log(`Sound effects: ${soundEffects.length}`);
  console.log("");

  console.log("--- Voice Lines ---");
  for (const line of voiceLines) {
    await generateVoice(line);
    // Rate limit: wait 500ms between calls
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

  const voiceDir = `${OUTPUT_DIR}/voice`;
  const sfxDir = `${OUTPUT_DIR}/sfx`;

  if (fs.existsSync(voiceDir)) {
    const voiceFiles = fs.readdirSync(voiceDir);
    console.log(`Voice files (${voiceFiles.length}): ${voiceFiles.join(", ")}`);
  }
  if (fs.existsSync(sfxDir)) {
    const sfxFiles = fs.readdirSync(sfxDir);
    console.log(`SFX files (${sfxFiles.length}): ${sfxFiles.join(", ")}`);
  }
}

main().catch((err) => {
  console.error("Pipeline failed:", err.message);
  process.exit(1);
});
