import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_OUTPUT = path.join(__dirname, "../assets/images");

const ASSETS_TO_GENERATE = [
  {
    id: "thinking_character",
    filename: "thinking-character.png",
    prompt:
      "Cartoon man thinking with hand on chin, flat vector style, minimalist design, isolated on transparent background, clean lines, modern illustration style, no text, 512x512",
  },
  {
    id: "quiz_bubble",
    filename: "quiz-bubble.png",
    prompt:
      "Comic book style QUIZ speech bubble, bold yellow and orange colors, explosive starburst border, high energy, the word QUIZ in bold black letters inside, transparent background, vector style, 512x512",
  },
  {
    id: "red_circle_marker",
    filename: "red-circle-marker.png",
    prompt:
      "Red circle highlight marker, hand-drawn marker pen style, transparent background, simple round stroke, no fill, like a hand-drawn annotation on a map, 256x256",
  },
  {
    id: "iran_flag_pin",
    filename: "iran-flag-pin.png",
    prompt:
      "Flag of Iran on a 3D map pin / location marker, realistic 3D render style, clean design, the Iranian tricolor flag (green white red with emblem) on the pin face, transparent background, 256x512",
  },
  {
    id: "libya_flag_pin",
    filename: "libya-flag-pin.png",
    prompt:
      "Flag of Libya on a 3D map pin / location marker, realistic 3D render style, clean design, the Libyan flag (black red green with crescent and star) on the pin face, transparent background, 256x512",
  },
  {
    id: "spine_vertebra",
    filename: "spine-vertebra.png",
    prompt:
      "Single human vertebra bone illustration, white clean medical style, isolated on transparent background, anatomical detail, suitable for animation along a river path, top-down view, 256x256",
  },
  {
    id: "distance_arrow",
    filename: "distance-arrow.png",
    prompt:
      "White double-headed arrow indicating distance on a map, clean flat design, bold white stroke with arrowheads on both ends, transparent background, horizontal orientation, 512x128",
  },
  {
    id: "chapter_number_bg",
    filename: "chapter-number-bg.png",
    prompt:
      "Small red square badge / label for a chapter number, flat design, solid red background, white border, no text inside, suitable for overlaying a number digit, 128x128",
  },
];

async function generateImage(
  genAI: GoogleGenerativeAI,
  asset: (typeof ASSETS_TO_GENERATE)[0]
): Promise<void> {
  const outputPath = path.join(ASSETS_OUTPUT, asset.filename);

  if (fs.existsSync(outputPath)) {
    console.log(`  SKIP (exists): ${asset.filename}`);
    return;
  }

  console.log(`  Generating: ${asset.filename}`);
  console.log(`  Prompt: ${asset.prompt.slice(0, 80)}...`);

  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-image-preview",
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: asset.prompt }] }],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
    } as Record<string, unknown>,
  });

  const parts = result.response.candidates?.[0]?.content?.parts ?? [];
  let saved = false;

  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith("image/")) {
      const imageData = Buffer.from(part.inlineData.data!, "base64");
      fs.writeFileSync(outputPath, imageData);
      console.log(`  Saved: ${asset.filename} (${(imageData.length / 1024).toFixed(1)} KB)`);
      saved = true;
      break;
    }
  }

  if (!saved) {
    const textPart = parts.find((p) => p.text);
    console.warn(`  WARN: No image returned for ${asset.id}. Response: ${textPart?.text?.slice(0, 200) ?? "none"}`);
  }
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not set");
    process.exit(1);
  }

  if (!fs.existsSync(ASSETS_OUTPUT)) {
    fs.mkdirSync(ASSETS_OUTPUT, { recursive: true });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  console.log(`Generating ${ASSETS_TO_GENERATE.length} assets via Gemini Image...`);
  console.log(`Output: ${ASSETS_OUTPUT}\n`);

  for (const asset of ASSETS_TO_GENERATE) {
    try {
      await generateImage(genAI, asset);
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error(`  ERROR generating ${asset.id}:`, err);
    }
  }

  console.log("\nDone. Assets:");
  for (const f of fs.readdirSync(ASSETS_OUTPUT)) {
    const size = fs.statSync(path.join(ASSETS_OUTPUT, f)).size;
    console.log(`  ${f} (${(size / 1024).toFixed(1)} KB)`);
  }
}

main();
