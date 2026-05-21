import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("ERROR: GEMINI_API_KEY missing");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const FILES = [
  { uri: "https://generativelanguage.googleapis.com/v1beta/files/08az62oxe0vx", label: "Jacques a dit - Bresil" },
  { uri: "https://generativelanguage.googleapis.com/v1beta/files/1bbndyep66mg", label: "Jacques a dit - Quebec" },
];

const PROMPT = `Tu es un expert senior en motion design, cartographie numerique et production video.

J'ai DEUX videos de la chaine YouTube francaise "Jacques a dit" sur la geographie. Je veux reproduire leur style avec Mapbox GL JS + Remotion + assets SVG custom.

Une analyse precedente a deja ete faite par Gemini 2.5 Pro. Je veux ton analyse de Gemini 3.1 Pro pour comparer et identifier ce qu'elle a manque ou ce que tu peux preciser davantage.

ANALYSE A FOURNIR (structure ton output en sections markdown numerotees) :

# 1. STYLE DE CARTE
- Type de carte de fond (vector clean / raster custom / compositing AE / Mapbox satellite ?)
- Couleurs precises (ocean, terres, lacs, frontieres) avec codes hex si possible
- Labels visibles ou pas, dans quels contextes
- Relief / ombrages / vignettage

# 2. COLORISATION DES PAYS / REGIONS
- Technique exacte pour coloriser (overlay GeoJSON ? mask SVG ? mode de fusion ?)
- Type de halo lumineux (line-blur Mapbox ? CSS filter blur ? SVG feGaussianBlur ?)
- Animation d'apparition

# 3. CAMERA & TRANSITIONS
- Types de mouvements, easing, vitesse
- Comment ils enchainent les scenes
- Temps d'image fixe entre les transitions

# 4. OVERLAYS & ASSETS
- Photos, vignettes, pins, illustrations, formes
- Style graphique
- Animations d'apparition (spring, fade, slide)

# 5. TYPOGRAPHIE & TEXTE
- Polices precises (essaie d'identifier le nom)
- Hierarchie, animations

# 6. PRESENTATEUR / FACE A LA CAMERA
- Presence, integration

# 7. REPRODUCTIBILITE AVEC MAPBOX GL JS + REMOTION
- Faisabilite par element
- Verdict difficulte 1-5

# 8. RECOMMANDATIONS CONCRETES
- 5 actions concretes

# 9. CE QUI N'A PROBABLEMENT PAS ETE VU PAR GEMINI 2.5 PRO
- Quels details techniques specifiques tu remarques que Gemini 2.5 Pro a probablement manques ?
- Y a-t-il des techniques avancees (ex : layer order specifique Mapbox, post-processing GPU shader, easing curve custom) ?
- Quelle est ton evaluation honnete de la qualite et de la difficulte vs ce que tu connais d'autres chaines similaires ?

Reponds en francais, sois precis et concret. Nomme les techniques specifiques. Cite des timestamps quand tu vois quelque chose de remarquable.`;

async function main() {
  const outputPath = path.resolve(__dirname, "../research/analyse-gemini-3.1-pro.md");

  const model = genAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });
  const parts: any[] = [{ text: PROMPT }];
  for (const f of FILES) {
    parts.push({ text: `\n--- VIDEO: ${f.label} ---` });
    parts.push({ fileData: { fileUri: f.uri, mimeType: "video/mp4" } });
  }

  console.log("Sending request to gemini-3.1-pro-preview...");
  const startTime = Date.now();
  const result = await model.generateContent(parts);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`Response received in ${elapsed}s`);

  const analysis = result.response.text();
  const header = `# Analyse Gemini 3.1 Pro - Jacques a dit (Bresil + Quebec)\n\n**Modele** : gemini-3.1-pro-preview\n**Date** : ${new Date().toISOString()}\n**Temps de reponse** : ${elapsed}s\n\n---\n\n`;
  fs.writeFileSync(outputPath, header + analysis, "utf-8");
  console.log(`Written to: ${outputPath}`);
  console.log(`\n=== FIRST 1500 CHARS ===\n${analysis.slice(0, 1500)}`);
}

main().catch((e) => {
  console.error("FATAL:", e?.message || e);
  if (e?.response) console.error("Response:", JSON.stringify(e.response, null, 2).slice(0, 1000));
  process.exit(1);
});
