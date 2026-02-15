import * as fs from "fs";
import * as path from "path";
import * as https from "https";

// Parse .env manually (no dotenv dependency)
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

const OUTPUT_DIR = path.resolve(__dirname, "../../../../public/audio/brutalist-finance");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Chris = Lively Narrator, proven best for educational FR content
const VOICE_ID = "iP95p4xoKVk53GoZ742B";

// Voice segments with ElevenLabs markers:
// MAJUSCULES = emphasis, "..." = pause, "--" = tone break, "?" = inflection, "!" = energy
const VOICE_SEGMENTS = [
  {
    id: "hook",
    text: `Tu empruntes trois cent mille euros pour ta maison.
Tu en rembourses... CINQ CENT QUARANTE MILLE.

Presque... le double.

Et le pire ? C'est écrit dans ton contrat. Page quarante-sept. En police taille huit.

T'as juste... pas regardé.`,
    description: "ACT 1: Hook (20s) - Shock stat, conspiratorial reveal",
  },
  {
    id: "setup",
    text: `Thomas. Trente-quatre ans. Cadre. Un gosse. Un appart' en vue.

Sa banque lui dit -- trois cent vingt mille euros, vingt-cinq ans, trois et demi pourcent. Mensualité : mille six cents euros.

Sur trois mille huit cents net... ça passe. Un peu serré, mais ça passe.

Thomas signe.

Et c'est là que le tour de magie commence. Parce que la banque t'a vendu UN chiffre. La mensualité.

Mais y'a un autre chiffre. Celui qui est écrit en petit. En tout petit.

Le coût total du crédit.`,
    description: "ACT 2: Setup (60s) - Thomas intro, false security, reveal of hidden number",
  },
  {
    id: "mecanisme",
    text: `Pour comprendre l'arnaque -- pardon, le "mécanisme" --

Mois un. Thomas paie mille six cents euros.

Sur ces mille six cents... six cent soixante-dix vont au capital. NEUF CENT TRENTE vont à la banque.

La banque prend plus que toi. Dès le premier mois.

"Oui mais ça s'améliore avec le temps !" Au bout de QUINZE ANS.

Quinze ans avant que tu rembourses plus de capital que d'intérêts.

Et pendant ces quinze ans ?

Ça s'accumule. Silencieusement.

Ton crédit de trois cent vingt mille ? Au bout de vingt-cinq ans, t'auras remboursé...`,
    description: "ACT 3: Mecanisme (90s) - Ironic reveal of interest mechanism, building anger",
  },
  {
    id: "reveal-cta",
    text: `CINQ CENT SOIXANTE-SEIZE MILLE EUROS.

Tu as emprunté trois cent vingt mille. Tu rembourses cinq cent soixante-seize mille.

Deux cent cinquante-six mille euros. D'intérêts purs.

C'est une voiture de luxe. C'est cinq ans de loyer. C'est presque un deuxième appart'.

Tu paies ta maison. Et tu paies presque une deuxième maison... pour la banque.

Ça fait QUATRE-VINGTS POURCENT du montant emprunté.

Mais des solutions existent. Renégociation, remboursement anticipé, apport.

La prochaine vidéo, on décortique chaque stratégie. Avec les vrais chiffres.

C'est ÇA qu'il faut regarder. Pas la mensualité.

Abonne-toi. On se retrouve là-dessous.`,
    description: "ACT 4: Reveal + CTA (70s) - Big number shock, then calm solutions, subscribe",
  },
];

// SFX definitions
const SFX_LIST = [
  { id: "impact", prompt: "deep bass impact hit, brutalist, short cinematic slam, no reverb", duration: 1 },
  { id: "glitch", prompt: "digital glitch distortion, brief data corruption, electronic stutter", duration: 0.5 },
  { id: "counter-tick", prompt: "rapid digital counter ticking, numbers scrolling fast, UI data interface", duration: 2 },
];

// Music prompt - dark ambient tension for 4 min finance video
const MUSIC_PROMPT = "Dark minimal electronic ambient, slow evolving pads, subtle low bass pulse, tension and unease, no drums no beat, corporate dystopian atmosphere, 30 seconds loopable";

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

  // Small delay between API calls to avoid rate limiting
  await new Promise((r) => setTimeout(r, 1000));
}

async function generateSFX() {
  for (const sfx of SFX_LIST) {
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

    await new Promise((r) => setTimeout(r, 500));
  }
}

async function generateMusic() {
  const outputPath = path.join(OUTPUT_DIR, "bg-music.mp3");
  if (fs.existsSync(outputPath)) {
    console.log("[SKIP] bg-music.mp3 already exists");
    return;
  }

  // Try /v1/music/generate first (Starter plan feature)
  console.log("[MUSIC] Trying /v1/music/generate (Starter plan)...");
  try {
    const musicPayload = JSON.stringify({
      prompt: MUSIC_PROMPT,
      duration_seconds: 30,
    });

    const data = await makeRequest(
      "https://api.elevenlabs.io/v1/music/generate",
      "POST",
      {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      musicPayload
    );

    fs.writeFileSync(outputPath, data);
    console.log(`[OK] bg-music.mp3 via music/generate (${(data.length / 1024).toFixed(1)} KB)`);
    return;
  } catch (err) {
    console.log("[MUSIC] /v1/music/generate failed, falling back to /v1/sound-generation...");
  }

  // Fallback: /v1/sound-generation (free tier, 15s max)
  const fallbackPayload = JSON.stringify({
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
    fallbackPayload
  );

  fs.writeFileSync(outputPath, data);
  console.log(`[OK] bg-music.mp3 via sound-generation fallback (${(data.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log("=== Brutalist Finance - Audio Generation ===");
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Voice: Chris (${VOICE_ID})`);
  console.log(`Model: eleven_v3 | stability: 0.0 | style: 0.8`);
  console.log("");

  // Voice segments (4 tracks)
  console.log("--- Voice Generation ---");
  for (const segment of VOICE_SEGMENTS) {
    await generateVoice(segment);
  }

  console.log("");

  // SFX (3 tracks)
  console.log("--- SFX Generation ---");
  await generateSFX();

  console.log("");

  // Background music (1 track)
  console.log("--- Music Generation ---");
  await generateMusic();

  console.log("");
  console.log("=== Done! ===");
  console.log(`Files in: ${OUTPUT_DIR}`);

  // List generated files
  const files = fs.readdirSync(OUTPUT_DIR);
  console.log(`Total: ${files.length} files`);
  for (const f of files) {
    const stat = fs.statSync(path.join(OUTPUT_DIR, f));
    console.log(`  ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
