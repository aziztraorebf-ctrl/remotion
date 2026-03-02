import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("ELEVENLABS_API_KEY manquant dans .env");
  process.exit(1);
}

const SFX_DIR = "public/audio/peste-pixel/sfx";
const MUSIC_DIR = "public/audio/peste-pixel";

// ── SFX a generer ─────────────────────────────────────────────
// Chaque SFX correspond a un moment precis de HookBlocA
const SFX_LIST = [
  {
    id: "parchment-reveal",
    prompt: "Soft parchment paper unfolding, gentle papyrus rustling, quiet medieval document reveal",
    duration_seconds: 2.0,
    description: "Fade-in carte (frames 0-14)",
  },
  {
    id: "village-ambiance",
    prompt: "Medieval village ambiance, distant church bell, soft wind, quiet marketplace murmur, birds, peaceful summer morning 1300s",
    duration_seconds: 24.0,
    loop: true,
    description: "Ambiance village loop 23s",
  },
  {
    id: "token-drop-wood",
    prompt: "Wooden board game token placed on wooden table, soft muffled thud, single short sound",
    duration_seconds: 0.8,
    description: "Jeton pose sur la carte (x6, un par personnage)",
  },
  {
    id: "church-bell-single",
    prompt: "Single medieval church bell toll, deep resonant bronze bell, one ring fading slowly",
    duration_seconds: 3.0,
    description: "Cloche eglise (frame 217 - entree Martin le pretre)",
  },
  {
    id: "lute-sting",
    prompt: "Short medieval lute pluck, single note resonating, quiet intimate, warm wood sound",
    duration_seconds: 1.5,
    description: "Accent musical court (optionnel sur entrees jetons)",
  },
];

// ── Musique de fond ───────────────────────────────────────────
const MUSIC_CONFIG = {
  filename: "hookbloca-luth.mp3",
  prompt: "Solo medieval lute, gentle fingerpicking, quiet and contemplative, warm acoustic tone, medieval French village atmosphere, peaceful summer mood, no percussion, solo instrument only, intimate and subtle",
  music_length_ms: 30000, // 30s - pour boucler sur 23s de BlocA
  force_instrumental: true,
};

// ── Generateur SFX ────────────────────────────────────────────
async function generateSFX(sfx: typeof SFX_LIST[0]): Promise<void> {
  const outputPath = path.join(SFX_DIR, `${sfx.id}.mp3`);

  if (fs.existsSync(outputPath)) {
    console.log(`  [SKIP] Existe deja: ${sfx.id}.mp3`);
    return;
  }

  console.log(`[SFX] ${sfx.id}`);
  console.log(`  -> ${sfx.description}`);
  console.log(`  -> "${sfx.prompt.substring(0, 70)}..."`);

  const body: Record<string, unknown> = {
    text: sfx.prompt,
    duration_seconds: sfx.duration_seconds,
    prompt_influence: 0.5,
  };
  if (sfx.loop) {
    body.model_id = "eleven_text_to_sound_v2";
    body.loop = true;
  }

  const response = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY as string,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`SFX failed [${sfx.id}]: HTTP ${response.status} - ${err}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.mkdirSync(SFX_DIR, { recursive: true });
  fs.writeFileSync(outputPath, buffer);
  console.log(`  -> Saved: ${outputPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

// ── Generateur Musique ────────────────────────────────────────
async function generateMusic(): Promise<void> {
  const outputPath = path.join(MUSIC_DIR, MUSIC_CONFIG.filename);

  if (fs.existsSync(outputPath)) {
    console.log(`  [SKIP] Existe deja: ${MUSIC_CONFIG.filename}`);
    return;
  }

  console.log(`[MUSIC] Luth medieval solo`);
  console.log(`  -> "${MUSIC_CONFIG.prompt.substring(0, 70)}..."`);
  console.log(`  -> Duree: ${MUSIC_CONFIG.music_length_ms / 1000}s`);

  const response = await fetch("https://api.elevenlabs.io/v1/music/compose", {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY as string,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify({
      prompt: MUSIC_CONFIG.prompt,
      music_length_ms: MUSIC_CONFIG.music_length_ms,
      model_id: "music_v1",
      force_instrumental: MUSIC_CONFIG.force_instrumental,
      output_format: "mp3_44100_128",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Music failed: HTTP ${response.status} - ${err}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.mkdirSync(MUSIC_DIR, { recursive: true });
  fs.writeFileSync(outputPath, buffer);
  console.log(`  -> Saved: ${outputPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

// ── Main ─────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log("=== HookBlocA - Audio Generation ===");
  console.log(`SFX: ${SFX_LIST.length} effets sonores`);
  console.log(`Musique: luth medieval solo 30s`);
  console.log("");

  console.log("--- SFX ---");
  for (const sfx of SFX_LIST) {
    await generateSFX(sfx);
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("");
  console.log("--- MUSIQUE ---");
  await generateMusic();

  console.log("");
  console.log("=== Termine ===");
  console.log("Prochaine etape: integrer les fichiers dans HookBlocA.tsx");
  console.log(`  SFX: ${SFX_DIR}/`);
  console.log(`  Musique: ${MUSIC_DIR}/${MUSIC_CONFIG.filename}`);
}

main().catch((err) => {
  console.error("Echec:", err.message);
  process.exit(1);
});
