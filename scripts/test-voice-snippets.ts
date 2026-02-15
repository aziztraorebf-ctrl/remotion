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

interface VoiceCandidate {
  name: string;
  voiceId: string;
  description: string;
}

const candidates: VoiceCandidate[] = [
  {
    name: "Liam",
    voiceId: "TX3LPaxmHKxFdv7VOQHJ",
    description: "Energetic, Social Media Creator - young male, american",
  },
  {
    name: "Charlie",
    voiceId: "IKne3meq5aSn9XLyUdCD",
    description: "Deep, Confident, Energetic - young male, australian",
  },
  {
    name: "Chris",
    voiceId: "iP95p4xoKVk53GoZ742B",
    description: "Charming, Down-to-Earth - middle aged male, american",
  },
];

// Test text with voice direction in parentheses
const testText =
  "(excited, energetic) How fast can YOUR brain read? Let's find out! " +
  "(calm, focused) Level three. Four hundred words per minute. " +
  "(impressed) Incredible! Only two levels remain.";

const OUTPUT_DIR = "public/audio/speed-reading/voice-tests";

async function generateSnippet(candidate: VoiceCandidate): Promise<void> {
  const outputPath = path.join(OUTPUT_DIR, `test-${candidate.name.toLowerCase()}.mp3`);

  console.log(`[Test] Generating snippet for: ${candidate.name}`);
  console.log(`  Voice ID: ${candidate.voiceId}`);
  console.log(`  Description: ${candidate.description}`);

  const url = `${BASE_URL}/text-to-speech/${candidate.voiceId}?output_format=mp3_44100_128`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: testText,
      model_id: "eleven_multilingual_v2",
      language_code: "en",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `TTS failed for "${candidate.name}": HTTP ${response.status} - ${errorText}`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const dir = path.dirname(outputPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, buffer);
  console.log(`  -> Saved: ${outputPath} (${buffer.length} bytes)`);
}

async function main(): Promise<void> {
  console.log("=== Voice Snippet Test ===");
  console.log(`Test text: "${testText}"`);
  console.log(`Candidates: ${candidates.length}`);
  console.log("");

  for (const candidate of candidates) {
    await generateSnippet(candidate);
    // Rate limit
    await new Promise((r) => setTimeout(r, 500));
    console.log("");
  }

  console.log("=== Done! ===");
  console.log(`Listen to the snippets in: ${OUTPUT_DIR}/`);
  console.log("Files:");
  const files = fs.readdirSync(OUTPUT_DIR);
  for (const file of files) {
    const filePath = path.join(OUTPUT_DIR, file);
    const stats = fs.statSync(filePath);
    console.log(`  - ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  }
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
