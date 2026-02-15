import * as fs from "fs";
import * as path from "path";
import * as https from "https";

// Parse .env manually
const envPath = path.resolve(__dirname, "../../../../.env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars: Record<string, string> = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
}

const API_KEY = envVars.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("ELEVENLABS_API_KEY not found in .env");
  process.exit(1);
}

const OUTPUT_DIR = path.resolve(__dirname, "../../../../public/audio/data-viz-explainer");

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Voice segments - timed to match the video's 4 acts
// Using Chris (Lively Narrator) for energetic, expressive delivery
const VOICE_ID = "iP95p4xoKVk53GoZ742B"; // Chris

const VOICE_SEGMENTS = [
  {
    id: "hook",
    text: "Ta banque ne veut pas que tu voies ce chiffre. Ton credit immobilier... te coute PRESQUE LE DOUBLE. -- Fois un virgule huit. -- Laisse-moi te montrer.",
    description: "ACT 1: Hook - Conspiratorial, then punch, then invitation",
  },
  {
    id: "setup",
    text: "Imagine. Tu empruntes trois cent quarante mille euros... sur vingt-cinq ans... a trois et demi pourcent. Ta mensualite? Mille sept cent quinze euros. Ca a l'air... raisonnable. Hein? C'est exactement ce que ta banque veut que tu penses. Mais regarde bien ce qui se passe... en arriere-plan. Chaque mois -- la banque prend sa part. Et cette part... elle s'accumule. Lentement. Silencieusement.",
    description: "ACT 2: Setup - Calm invitation, false security, then ominous build",
  },
  {
    id: "reveal",
    text: "Et voici la verite qu'on ne te dit jamais. Tu as emprunte trois cent quarante mille euros? Tu vas en rembourser... SIX CENT DOUZE MILLE! Deux cent soixante-douze mille euros -- d'interets purs! C'est QUATRE-VINGT POURCENT du montant que tu as emprunte! Partis. Directement. Dans la poche de ta banque.",
    description: "ACT 3: Reveal - Building outrage, staccato punchlines",
  },
  {
    id: "cta",
    text: "Mais... ne panique pas. Des strategies existent. Renegociation. Remboursement anticipe. Apport plus eleve. Chacune peut te faire economiser des dizaines de milliers d'euros. L'analyse complete? Elle est juste en-dessous... dans la description.",
    description: "ACT 4: CTA - Calm reassurance, each beat lands, then redirect",
  },
];

// Background music prompt
const MUSIC_PROMPT = "Minimal electronic ambient music, dark moody atmosphere, subtle bass pulse, corporate data visualization style, no vocals, 60 seconds";

async function makeRequest(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string | Buffer
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method,
      headers,
    };

    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        const data = Buffer.concat(chunks);
        if (res.statusCode && res.statusCode >= 400) {
          console.error(`HTTP ${res.statusCode}: ${data.toString("utf-8").substring(0, 500)}`);
          reject(new Error(`HTTP ${res.statusCode}`));
        } else {
          resolve(data);
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function generateVoice(segment: typeof VOICE_SEGMENTS[0]) {
  const outputPath = path.join(OUTPUT_DIR, `${segment.id}.mp3`);
  if (fs.existsSync(outputPath)) {
    console.log(`[SKIP] ${segment.id}.mp3 already exists`);
    return;
  }

  console.log(`[VOICE] Generating ${segment.id}: ${segment.description}`);

  const payload = JSON.stringify({
    text: segment.text,
    model_id: "eleven_v3",
    voice_settings: {
      stability: 0.0,
      similarity_boost: 0.8,
      style: 0.8,
      use_speaker_boost: true,
    },
    language_code: "fr",
  });

  const data = await makeRequest(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    "POST",
    {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    payload
  );

  fs.writeFileSync(outputPath, data);
  console.log(`[OK] ${segment.id}.mp3 (${(data.length / 1024).toFixed(1)} KB)`);
}

async function generateMusic() {
  const outputPath = path.join(OUTPUT_DIR, "bg-music.mp3");
  if (fs.existsSync(outputPath)) {
    console.log("[SKIP] bg-music.mp3 already exists");
    return;
  }

  console.log("[MUSIC] Generating background music...");

  // Use sound-generation endpoint (available on free plan) instead of music/generate (paid only)
  const payload = JSON.stringify({
    text: MUSIC_PROMPT,
    duration_seconds: 15,
    prompt_influence: 0.5,
  });

  const data = await makeRequest(
    "https://api.elevenlabs.io/v1/sound-generation",
    "POST",
    {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    payload
  );

  fs.writeFileSync(outputPath, data);
  console.log(`[OK] bg-music.mp3 (${(data.length / 1024).toFixed(1)} KB)`);
}

async function generateSFX() {
  const sfxList = [
    { id: "whoosh", prompt: "quick digital whoosh transition sound, clean, modern", duration: 1 },
    { id: "impact", prompt: "deep bass impact hit, cinematic, data reveal", duration: 1.5 },
    { id: "counter-tick", prompt: "soft digital counter ticking, UI interface, subtle", duration: 2 },
  ];

  for (const sfx of sfxList) {
    const outputPath = path.join(OUTPUT_DIR, `${sfx.id}.mp3`);
    if (fs.existsSync(outputPath)) {
      console.log(`[SKIP] ${sfx.id}.mp3 already exists`);
      continue;
    }

    console.log(`[SFX] Generating ${sfx.id}...`);

    const payload = JSON.stringify({
      text: sfx.prompt,
      duration_seconds: sfx.duration,
      prompt_influence: 0.4,
    });

    const data = await makeRequest(
      "https://api.elevenlabs.io/v1/sound-generation",
      "POST",
      {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      payload
    );

    fs.writeFileSync(outputPath, data);
    console.log(`[OK] ${sfx.id}.mp3 (${(data.length / 1024).toFixed(1)} KB)`);
  }
}

async function main() {
  console.log("=== Data Viz Explainer - Audio Generation ===");
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log("");

  // Generate all voice segments
  for (const segment of VOICE_SEGMENTS) {
    await generateVoice(segment);
  }

  console.log("");

  // Generate SFX
  await generateSFX();

  console.log("");

  // Generate background music
  await generateMusic();

  console.log("");
  console.log("=== Done! ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
