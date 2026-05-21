import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("ERROR: GEMINI_API_KEY missing in env");
  process.exit(1);
}

const fileManager = new GoogleAIFileManager(API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);

const MODEL_CANDIDATES = [
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
];

async function uploadAndWait(videoPath: string, label: string) {
  console.log(`[${label}] Uploading ${path.basename(videoPath)}...`);
  const uploadResult = await fileManager.uploadFile(videoPath, {
    mimeType: "video/mp4",
    displayName: label,
  });
  let file = uploadResult.file;
  console.log(`[${label}] Uploaded. URI: ${file.uri}. Waiting for ACTIVE state...`);
  while (file.state === FileState.PROCESSING) {
    await new Promise((r) => setTimeout(r, 5000));
    file = await fileManager.getFile(file.name);
    process.stdout.write(".");
  }
  console.log(`\n[${label}] State: ${file.state}`);
  if (file.state !== FileState.ACTIVE) {
    throw new Error(`Upload failed for ${label}: state=${file.state}`);
  }
  return file;
}

async function tryWithModel(modelName: string, files: { uri: string; mimeType: string; label: string }[], prompt: string) {
  const model = genAI.getGenerativeModel({ model: modelName });
  const parts: any[] = [{ text: prompt }];
  for (const f of files) {
    parts.push({ text: `\n--- VIDEO: ${f.label} ---` });
    parts.push({ fileData: { fileUri: f.uri, mimeType: f.mimeType } });
  }
  const result = await model.generateContent(parts);
  return result.response.text();
}

const PROMPT = `Tu es un expert en motion design, cartographie numerique et production video. J'ai deux videos de la chaine YouTube francaise "Jacques a dit" sur la geographie. Je veux reproduire leur style avec Mapbox GL JS + Remotion + assets SVG custom.

ANALYSE A FOURNIR (structure ton output en sections markdown numerotees) :

# 1. STYLE DE CARTE
- Quel type de carte de fond utilisent-ils ? (vector clean type Mapbox outdoors / Google Maps lite ? raster custom dessine main ? composition After Effects ? autre ?)
- Couleurs precises : ocean, terres, lacs, regions colorisees, frontieres
- Y a-t-il des labels (noms de villes, pays) visibles ? Si oui dans quels contextes ?
- Le relief est-il visible (ombrages, montagnes) ?

# 2. COLORISATION DES PAYS / REGIONS
- Comment colorisent-ils certains pays/regions specifiques en couleur unie ? (overlay GeoJSON dynamique ? mask SVG dessine main ? layer Mapbox fill ?)
- Les contours des pays/regions colorises sont-ils nets ou flous ?
- Y a-t-il animation d'apparition des couleurs (fade-in, draw progressive) ?

# 3. CAMERA & TRANSITIONS
- Types de mouvements caméra observes (zoom in/out, pan, rotation, cut hard, fade) ?
- Vitesse et easing (lineaire ? ease-out ? snap rapide ?)
- Comment ils enchainent les scenes (cut sec, fondu, transition graphique) ?
- Tiennent-ils l'image fixe pendant que des elements apparaissent par-dessus ? Combien de temps ?

# 4. OVERLAYS & ASSETS
- Quels types d'overlays sur la carte (fleches, cercles, pins, illustrations, photos en vignette, texte) ?
- Style graphique des assets (illustres / vectoriel / photo decoupee / mix) ?
- Comment apparaissent-ils (pop spring, fade, slide, draw) ?

# 5. TYPOGRAPHIE & TEXTE
- Polices observees (sans-serif geometrique ? serif ? handwritten ?)
- Comment le texte apparait/disparait
- Hierarchie (titre / chiffres / sous-titre)

# 6. PRESENTATEUR / FACE A LA CAMERA
- Y a-t-il un presentateur visible ? Comment est-il integre (incrustation, photo decoupee, plein cadre) ?

# 7. REPRODUCTIBILITE AVEC MAPBOX GL JS + REMOTION
- Pour chaque element identifie, dis si c'est faisable nativement avec Mapbox GL JS (style outdoors-v12 sans labels), Remotion overlays, ou s'il faut creer du custom (Mapbox Studio style, assets SVG generes, mask After Effects-style en SVG, etc.)
- Donne un verdict global : niveau de difficulte pour reproduire (1=trivial, 5=tres complexe)

# 8. RECOMMANDATIONS CONCRETES
- 3 a 5 actions concretes que je devrais prendre pour me rapprocher de leur qualite visuelle

Reponds en francais, sois precis et concret. Si tu vois une technique specifique (ex: "ils utilisent un overlay raster avec opacity 0.6 sur un layer fill GeoJSON"), nomme-la.`;

async function main() {
  const videosDir = path.resolve(__dirname, "../research/videos");
  const outputPath = path.resolve(__dirname, "../research/analyse-gemini.md");

  const vid1Path = path.join(videosDir, "vid1-PXtrBiWvoZQ.mp4");
  const vid2Path = path.join(videosDir, "vid2-j3rYE-_RSpg.mp4");

  if (!fs.existsSync(vid1Path) || !fs.existsSync(vid2Path)) {
    console.error("Videos missing in", videosDir);
    process.exit(1);
  }

  const [f1, f2] = await Promise.all([
    uploadAndWait(vid1Path, "Jacques a dit - Bresil (9 min)"),
    uploadAndWait(vid2Path, "Jacques a dit - Quebec (12 min)"),
  ]);

  const filesPayload = [
    { uri: f1.uri, mimeType: "video/mp4", label: "Jacques a dit - Bresil" },
    { uri: f2.uri, mimeType: "video/mp4", label: "Jacques a dit - Quebec" },
  ];

  let analysis = "";
  let usedModel = "";
  for (const m of MODEL_CANDIDATES) {
    try {
      console.log(`\nTrying model: ${m}`);
      analysis = await tryWithModel(m, filesPayload, PROMPT);
      usedModel = m;
      console.log(`OK with ${m}`);
      break;
    } catch (e: any) {
      console.log(`Model ${m} failed: ${e?.message?.slice(0, 200)}`);
    }
  }

  if (!analysis) {
    console.error("All models failed.");
    process.exit(1);
  }

  const header = `# Analyse Gemini Vision - Jacques a dit (Bresil + Quebec)\n\n**Modele utilise** : ${usedModel}\n**Date** : ${new Date().toISOString()}\n\n---\n\n`;
  fs.writeFileSync(outputPath, header + analysis, "utf-8");
  console.log(`\nAnalysis written to: ${outputPath}`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
