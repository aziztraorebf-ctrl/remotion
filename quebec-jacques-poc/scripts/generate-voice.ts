import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRIPT_PATH = path.join(__dirname, "narration-script.json");
const AUDIO_OUTPUT = path.join(__dirname, "../assets/audio");
const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1";

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  speed: number;
}

interface NarrationScript {
  voice_id: string;
  model: string;
  voice_settings: VoiceSettings;
  full_text: string;
}

async function generateTTS(script: NarrationScript): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not set");

  const audioPath = path.join(AUDIO_OUTPUT, "narration.mp3");
  if (fs.existsSync(audioPath)) {
    console.log(`TTS already exists, skipping: ${audioPath}`);
    return audioPath;
  }

  console.log("Generating TTS via ElevenLabs...");
  console.log(`Voice ID: ${script.voice_id}`);
  console.log(`Text length: ${script.full_text.length} chars`);

  const response = await fetch(
    `${ELEVENLABS_BASE}/text-to-speech/${script.voice_id}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: script.full_text,
        model_id: script.model,
        voice_settings: script.voice_settings,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`TTS failed: ${response.status} ${error}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const audioPath = path.join(AUDIO_OUTPUT, "narration.mp3");
  fs.writeFileSync(audioPath, Buffer.from(audioBuffer));
  console.log(`Audio saved: ${audioPath} (${(audioBuffer.byteLength / 1024).toFixed(1)} KB)`);
  return audioPath;
}

async function runForceAlignment(
  audioPath: string,
  text: string,
  voiceId: string
): Promise<object> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not set");

  console.log("\nRunning Force Alignment...");

  const audioBuffer = fs.readFileSync(audioPath);
  const formData = new FormData();
  const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });
  formData.append("file", audioBlob, "narration.mp3");
  formData.append("text", text);

  const response = await fetch(
    `${ELEVENLABS_BASE}/forced-alignment`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.warn(`Force Alignment failed: ${response.status} ${error}`);
    console.warn("Continuing without alignment data...");
    return {};
  }

  const alignment = await response.json();
  return alignment;
}

function buildTimeline(
  alignment: Record<string, unknown>,
  script: NarrationScript & { scenes: Array<{ scene_id: string; text: string }> }
): object {
  const timeline: Record<string, unknown> = {
    generated_at: new Date().toISOString(),
    scenes: [],
  };

  if (!alignment || !alignment.words) {
    console.warn("No alignment data — using estimated timestamps");
    let cursor = 0;
    timeline.scenes = script.scenes.map((scene: { scene_id: string; text: string }, i: number) => {
      const wordsInScene = scene.text.trim().split(/\s+/).length;
      const wpm = 160;
      const estimatedDuration = (wordsInScene / wpm) * 60;
      const start = cursor;
      cursor += estimatedDuration;
      return {
        scene_id: scene.scene_id,
        start_s: parseFloat(start.toFixed(3)),
        end_s: parseFloat(cursor.toFixed(3)),
        words: [],
      };
    });
    return timeline;
  }

  const words = alignment.words as Array<{ word: string; start: number; end: number }>;
  let wordIdx = 0;

  timeline.scenes = script.scenes.map((scene: { scene_id: string; text: string }) => {
    const sceneWords = scene.text.trim().split(/\s+/).length;
    const sceneWordData = words.slice(wordIdx, wordIdx + sceneWords);
    wordIdx += sceneWords;

    const start = sceneWordData[0]?.start ?? 0;
    const end = sceneWordData[sceneWordData.length - 1]?.end ?? 0;

    return {
      scene_id: scene.scene_id,
      start_s: start,
      end_s: end,
      words: sceneWordData.map((w) => ({
        word: w.word,
        start_s: w.start,
        end_s: w.end,
      })),
    };
  });

  return timeline;
}

async function main() {
  if (!fs.existsSync(AUDIO_OUTPUT)) {
    fs.mkdirSync(AUDIO_OUTPUT, { recursive: true });
  }

  const script = JSON.parse(fs.readFileSync(SCRIPT_PATH, "utf-8")) as NarrationScript & {
    scenes: Array<{ scene_id: string; text: string }>;
  };

  const audioPath = await generateTTS(script);

  const alignment = await runForceAlignment(audioPath, script.full_text, script.voice_id);

  const timeline = buildTimeline(alignment as Record<string, unknown>, script);

  const timelinePath = path.join(AUDIO_OUTPUT, "timeline.json");
  fs.writeFileSync(timelinePath, JSON.stringify(timeline, null, 2));
  console.log(`\nTimeline saved: ${timelinePath}`);

  const timelineTyped = timeline as { scenes: Array<{ scene_id: string; start_s: number; end_s: number }> };
  console.log("\n=== WORD TIMELINE ===");
  for (const scene of timelineTyped.scenes || []) {
    console.log(`${scene.scene_id}: ${scene.start_s}s → ${scene.end_s}s`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
