import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const entry = path.join(process.cwd(), "src/index.ts");
const outDir = process.argv[2];
const frames = process.argv.slice(3).map(Number);

fs.mkdirSync(outDir, { recursive: true });

console.error("Bundling...");
const bundled = await bundle({ entryPoint: entry, onProgress: () => {} });
console.error("Bundled.");

const composition = await selectComposition({
  serveUrl: bundled,
  id: "NorthShield-V3",
});

for (const f of frames) {
  const outPath = path.join(outDir, `f${f}.png`);
  await renderStill({
    composition,
    serveUrl: bundled,
    output: outPath,
    frame: f,
  });
  console.error("Rendered frame", f);
}
console.error("Done.");
