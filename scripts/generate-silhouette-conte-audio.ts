import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("ELEVENLABS_API_KEY is not set in .env");
  process.exit(1);
}

// George — narrative storyteller, warm, captivating. Excellent for French too.
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const OUTPUT_DIR = "public/audio/silhouette-conte";

const segments = [
  {
    id: "s1_lion",
    text: "Il était une fois, dans la savane sans fin, un lion qui ne connaissait pas le mot merci. Il marchait sur la terre comme si elle lui appartenait. Et peut-être... qu'il avait raison.",
  },
  {
    id: "s2_riviere",
    text: "Un soir de grande soif, il trouva une rivière. Mais l'eau ne coulait pas. La rivière le regardait. Et elle parla. Pourquoi viendrais-je à toi... qui n'a jamais remercié la pluie ?",
  },
  {
    id: "s3_enfant",
    text: "Un enfant du village s'approcha. Il posa une main sur la crinière du lion. Et il dit doucement : pose ta tête. Et remercie.",
  },
  {
    id: "s4_gratitude",
    text: "Le lion ferma les yeux. Pour la première fois de sa vie, il s'inclina. Et l'eau monta. Et la lumière avec elle. Car c'est ainsi que les rivières répondent... à ceux qui savent demander.",
  },
];

async function generateAudio(
  text: string,
  outputPath: string
): Promise<void> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.82,
          style: 0.35,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs error: ${response.status} ${err}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  console.log(`Generated: ${outputPath}`);
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const seg of segments) {
    const outputPath = path.join(OUTPUT_DIR, `${seg.id}.mp3`);
    console.log(`Generating ${seg.id}...`);
    await generateAudio(seg.text, outputPath);
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("All segments generated.");
}

main().catch(console.error);
