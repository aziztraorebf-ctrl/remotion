/**
 * Export project knowledge base to NotebookLM-friendly .md files.
 *
 * Each output file is a thematic bundle: headers describe origin,
 * file contents are included verbatim.  NotebookLM accepts .md natively
 * and can generate Audio Overviews (podcasts) from them.
 *
 * Usage:  npx ts-node scripts/export-for-notebooklm.ts
 * Output: notebooklm-export/*.md
 */

import fs from "fs";
import path from "path";

// __dirname can be unreliable with ts-node; use explicit project root
const ROOT = "/Users/clawdbot/Workspace/remotion";
const OUT = path.join(ROOT, "notebooklm-export");
const MEMORY_DIR =
  "/Users/clawdbot/.claude/projects/-Users-clawdbot-Workspace-remotion/memory";
const GLOBAL_CLAUDE_MD = "/Users/clawdbot/.claude/CLAUDE.md";
const CHARACTERS_DIR = path.join(
  ROOT,
  "public/assets/peste-pixel/pixellab/characters"
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readSafe(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return `[File not found: ${filePath}]`;
  }
}

function relPath(abs: string): string {
  if (abs.startsWith(ROOT)) return path.relative(ROOT, abs);
  return abs;
}

/** Bundle multiple files into a single .md with clear separators */
function bundle(
  title: string,
  description: string,
  files: Array<{ path: string; label?: string }>
): string {
  const sections = files.map((f) => {
    const label = f.label || relPath(f.path);
    const content = readSafe(f.path);
    return `\n---\n## ${label}\n\`\`\`\n${content}\n\`\`\`\n`;
  });

  return `# ${title}\n\n${description}\n\nGenerated: ${new Date().toISOString().slice(0, 10)}\nFiles included: ${files.length}\n${sections.join("\n")}`;
}

/** Collect all files matching extensions in a directory (non-recursive) */
function listFiles(dir: string, exts: string[]): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => exts.some((e) => f.endsWith(e)))
    .sort()
    .map((f) => path.join(dir, f));
}

/** Extract PixelLab character summary from metadata.json (skip massive keypoint data) */
function extractCharacterSummary(metadataPath: string): string {
  try {
    const raw = fs.readFileSync(metadataPath, "utf-8");
    const data = JSON.parse(raw);
    const char = data.character || {};
    const frames = data.frames || {};

    // Count animations and their frames
    const anims = frames.animations || {};
    const animSummary = Object.entries(anims)
      .map(([name, dirs]: [string, any]) => {
        const dirCount = Object.keys(dirs).length;
        const frameCount = Object.values(dirs).flat().length;
        return `  - ${name}: ${dirCount} directions, ${frameCount} frames total`;
      })
      .join("\n");

    // Count rotations
    const rotations = frames.rotations || {};
    const rotDirs = Object.keys(rotations).join(", ");

    return [
      `### ${char.name || path.basename(path.dirname(metadataPath))}`,
      `- **ID**: ${char.id || "unknown"}`,
      `- **Prompt**: "${char.prompt || "N/A"}"`,
      `- **Size**: ${char.size?.width || "?"}x${char.size?.height || "?"}px`,
      `- **Template**: ${char.template_id || "N/A"}`,
      `- **Directions**: ${char.directions || "?"}`,
      `- **View**: ${char.view || "N/A"}`,
      `- **Created**: ${char.created_at || "N/A"}`,
      `- **Rotations**: ${rotDirs}`,
      `- **Animations**:`,
      animSummary || "  (none)",
      "",
    ].join("\n");
  } catch {
    return `### ${path.basename(path.dirname(metadataPath))}\n[Error reading metadata]\n`;
  }
}

/** Collect files recursively */
function listFilesRecursive(dir: string, exts: string[]): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFilesRecursive(full, exts));
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results.sort();
}

// ---------------------------------------------------------------------------
// Export definitions  (each = 1 output .md file for NotebookLM)
// ---------------------------------------------------------------------------

interface ExportBundle {
  filename: string;
  title: string;
  description: string;
  files: Array<{ path: string; label?: string }>;
}

function buildExports(): ExportBundle[] {
  const bundles: ExportBundle[] = [];
  const peste = path.join(ROOT, "src/projects/peste-1347-pixel");

  // -----------------------------------------------------------------------
  // 1. PROJECT RULES & INSTRUCTIONS
  // -----------------------------------------------------------------------
  bundles.push({
    filename: "01-project-rules-and-instructions.md",
    title: "Project Rules & Instructions (CLAUDE.md)",
    description:
      "Master instructions governing the human-AI collaboration. " +
      "The Global CLAUDE.md defines Aziz's personal workflow (Superpowers skills, security rules, Playwright testing, trust rules). " +
      "The Project CLAUDE.md defines the 9-phase video production method, agent team orchestration, " +
      "Remotion best practices, and style guidelines. " +
      "Together, these are the primary governance documents for the entire project.",
    files: [
      { path: GLOBAL_CLAUDE_MD, label: "Global CLAUDE.md (Aziz's personal workflow rules)" },
      { path: path.join(ROOT, "CLAUDE.md"), label: "Project CLAUDE.md (Remotion-specific rules)" },
      { path: path.join(ROOT, "README.md"), label: "README.md" },
    ],
  });

  // -----------------------------------------------------------------------
  // 2. MULTI-AGENT SYSTEM
  // -----------------------------------------------------------------------
  const agentDir = path.join(ROOT, ".claude/agents");
  const agentMemDir = path.join(ROOT, ".claude/agent-memory");
  const agentFiles: Array<{ path: string; label?: string }> = [];

  for (const f of listFiles(agentDir, [".md"])) {
    if (path.basename(f) === "CLAUDE.md") continue;
    agentFiles.push({ path: f, label: `Agent Definition: ${path.basename(f, ".md")}` });
  }
  // Agent memories
  for (const sub of ["creative-director", "pixel-art-director", "pixellab-expert", "kimi-reviewer"]) {
    const mem = path.join(agentMemDir, sub, "MEMORY.md");
    if (fs.existsSync(mem)) {
      agentFiles.push({ path: mem, label: `Agent Memory: ${sub}` });
    }
  }
  // Shared pipeline
  const pipeline = path.join(agentMemDir, "shared/PIPELINE.md");
  if (fs.existsSync(pipeline)) {
    agentFiles.push({ path: pipeline, label: "Shared Pipeline (9-step orchestration)" });
  }

  bundles.push({
    filename: "02-multi-agent-system.md",
    title: "Multi-Agent Team System (4 Specialized Agents)",
    description:
      "The project uses 4 specialized AI agents orchestrated in a 9-step pipeline: " +
      "Creative Director (artistic direction + preflight + circuit-breaker), " +
      "Pixel Art Director (composition, perspective, palette validation), " +
      "PixelLab Expert (asset generation with error registry), " +
      "Kimi Reviewer (video quality review via Moonshot API). " +
      "Includes agent definitions, their persistent memories, and the shared pipeline document.",
    files: agentFiles,
  });

  // -----------------------------------------------------------------------
  // 3. PROJECT MEMORY & LEARNINGS
  // -----------------------------------------------------------------------
  const memoryFiles: Array<{ path: string; label?: string }> = [];
  const priorityMemory = [
    "MEMORY.md",
    "current-project.md",
    "apis-and-tools.md",
    "key-learnings.md",
    "COLLABORATION_TRUST.md",
    "pixellab-api-v2.md",
    "pixel-art-assets.md",
    "fal-ai-pipeline.md",
  ];
  for (const f of priorityMemory) {
    const full = path.join(MEMORY_DIR, f);
    if (fs.existsSync(full)) {
      memoryFiles.push({ path: full, label: `Memory: ${f}` });
    }
  }

  bundles.push({
    filename: "03-project-memory-and-learnings.md",
    title: "Project Memory & Key Learnings",
    description:
      "Persistent memory accumulated across sessions. " +
      "Contains project state, API references, key learnings (bugs, patterns, anti-patterns), " +
      "collaboration trust rules, PixelLab API documentation, and asset source references. " +
      "This is the institutional knowledge of the project.",
    files: memoryFiles,
  });

  // -----------------------------------------------------------------------
  // 4. STYLE GUIDES & VISUAL RESEARCH
  // -----------------------------------------------------------------------
  const styleFiles: Array<{ path: string; label?: string }> = [];
  const styleNames = [
    "brutalist-dataviz-style-guide.md",
    "sketch-doodle-style-guide.md",
    "data-viz-style-guide.md",
    "style-exploration-analysis.md",
    "last30days-style-trends-scan-feb2026.md",
  ];
  for (const f of styleNames) {
    const full = path.join(MEMORY_DIR, f);
    if (fs.existsSync(full)) {
      styleFiles.push({ path: full, label: `Style: ${f}` });
    }
  }
  const styleGuide = path.join(peste, "STYLE_GUIDE.md");
  if (fs.existsSync(styleGuide)) {
    styleFiles.push({ path: styleGuide, label: "Peste 1347 Pixel Art Style Guide" });
  }
  const prompts = path.join(peste, "prompts/prompts.md");
  if (fs.existsSync(prompts)) {
    styleFiles.push({ path: prompts, label: "PixelLab Generation Prompts" });
  }

  bundles.push({
    filename: "04-style-guides-and-visual-research.md",
    title: "Style Guides & Visual Research",
    description:
      "Visual identity documents for the project. " +
      "Three style generations tested (generic data-viz -> brutalist -> sketch-doodle), " +
      "with the brutalist style currently active. " +
      "Includes pixel art style guide, PixelLab prompts, and trend analysis.",
    files: styleFiles,
  });

  // -----------------------------------------------------------------------
  // 5. SCRIPT & NARRATION (Peste 1347)
  // -----------------------------------------------------------------------
  const scriptFiles: Array<{ path: string; label?: string }> = [];
  const scriptDir = path.join(peste, "scripts");

  // Locked script first
  scriptFiles.push({
    path: path.join(scriptDir, "script-lecture-v3.md"),
    label: "LOCKED Script V3.1 - Final Narration",
  });
  scriptFiles.push({
    path: path.join(scriptDir, "script-lecture.md"),
    label: "Script V1 - Initial Draft (for comparison)",
  });
  // Jury reviews
  for (const f of ["jury-gemini-v3.md", "jury-grok-v3.md", "jury-gpt4o.md", "jury-gemini.md", "jury-grok.md"]) {
    const full = path.join(scriptDir, f);
    if (fs.existsSync(full)) {
      scriptFiles.push({ path: full, label: `AI Jury Review: ${f}` });
    }
  }
  // Scene config
  scriptFiles.push({
    path: path.join(scriptDir, "scenes.json"),
    label: "Scene Configuration (timing, props, data bindings)",
  });

  bundles.push({
    filename: "05-script-and-narration.md",
    title: "Script, Narration & AI Jury Reviews (Peste 1347)",
    description:
      "The complete locked script (V3.1) for the Peste 1347 video, " +
      "including the multi-LLM jury review process (Gemini, Grok, GPT-4o). " +
      "The jury system uses 4 different LLMs to evaluate script quality. " +
      "Also includes scene-by-scene configuration with timing and data bindings.",
    files: scriptFiles,
  });

  // -----------------------------------------------------------------------
  // 6. TECHNICAL CONFIG
  // -----------------------------------------------------------------------
  const configFiles: Array<{ path: string; label?: string }> = [];
  for (const f of listFiles(path.join(peste, "config"), [".ts"])) {
    configFiles.push({ path: f, label: `Config: ${path.basename(f)}` });
  }
  configFiles.push({
    path: path.join(ROOT, "src/Root.tsx"),
    label: "Root.tsx (Remotion composition routing)",
  });
  const pkgJson = path.join(ROOT, "package.json");
  if (fs.existsSync(pkgJson)) {
    configFiles.push({ path: pkgJson, label: "package.json (dependencies)" });
  }

  bundles.push({
    filename: "06-technical-config.md",
    title: "Technical Configuration (Remotion + Peste 1347)",
    description:
      "All configuration files: color palette (theme.ts), scene timing (timing.ts, hookTiming.ts), " +
      "epidemic data (data.ts, hookData.ts, ticker-data.ts), " +
      "PixelLab asset registry (pixellab.ts), " +
      "Remotion composition routing (Root.tsx), and project dependencies (package.json).",
    files: configFiles,
  });

  // -----------------------------------------------------------------------
  // 7. KEY SCENES (latest versions only)
  // -----------------------------------------------------------------------
  const keyScenes = [
    "PixelWorldV5.tsx",
    "PestePixelScene.tsx",
    "HookScene.tsx",
    "ParchmentHook.tsx",
  ];
  const sceneFiles = keyScenes
    .map((f) => path.join(peste, "scenes", f))
    .filter((f) => fs.existsSync(f))
    .map((f) => ({ path: f, label: `Scene: ${path.basename(f)}` }));

  bundles.push({
    filename: "07-key-scenes.md",
    title: "Key Scene Implementations (Latest Versions)",
    description:
      "The main scene files that compose the video. " +
      "PixelWorldV5 is the latest full pipeline. " +
      "PestePixelScene is the main composition. " +
      "HookScene handles the first 15 seconds (hook). " +
      "Only latest versions included to avoid confusion.",
    files: sceneFiles,
  });

  // -----------------------------------------------------------------------
  // 8. REUSABLE COMPONENTS
  // -----------------------------------------------------------------------
  const compDir = path.join(peste, "components");
  const compFiles = listFiles(compDir, [".tsx"])
    .filter((f) => path.basename(f) !== "CLAUDE.md")
    .map((f) => ({ path: f, label: `Component: ${path.basename(f)}` }));

  bundles.push({
    filename: "08-reusable-components.md",
    title: "Reusable Components Library (Peste 1347)",
    description:
      "21 reusable React/Remotion components: " +
      "map visualizations (PlagueSpreadMap, PixelEuropeMap, TerminalEuropeMap), " +
      "data displays (PixelLineChart, TerminalDataPanel, DeathCounter), " +
      "sprite systems (PixelLabSprite, SpriteAnimator, GridSpritesheetAnimator), " +
      "backgrounds (MedievalTownBackground, PixelBackground, GraveyardBackground), " +
      "effects (CRTOverlay, AnimatedFire, RatSwarm, ReaperReveal), " +
      "text (PixelTypewriter, HookTextOverlay).",
    files: compFiles,
  });

  // -----------------------------------------------------------------------
  // 9. RESEARCH & DEEP ANALYSIS
  // -----------------------------------------------------------------------
  const researchDir = path.join(ROOT, "research");
  const researchFiles: Array<{ path: string; label?: string }> = [];
  for (const f of [
    "04_multistep_scriptwriting_synthesis.md",
    "02_gemini_scriptwriting_academic.md",
    "03_grok_scriptwriting_trends.md",
    "01_chatgpt_scriptwriting_frameworks.md",
    "multistep_reactions_humaines_pendant_la_peste_noire_de_1347_1353_comme_20260213_1900.md",
    "multistep_persona_et_audience_cible_pour_une_chaine_youtube_francophon_20260211_1020.md",
  ]) {
    const full = path.join(researchDir, f);
    if (fs.existsSync(full)) {
      researchFiles.push({ path: full, label: `Research: ${path.basename(f)}` });
    }
  }
  // Niche research from memory
  const nicheResearch = path.join(MEMORY_DIR, "medieval-niche-research-feb2026.md");
  if (fs.existsSync(nicheResearch)) {
    researchFiles.push({ path: nicheResearch, label: "Niche Research: Medieval Plague (Feb 2026)" });
  }
  const personaResearch = path.join(MEMORY_DIR, "persona-finance-fr.md");
  if (fs.existsSync(personaResearch)) {
    researchFiles.push({ path: personaResearch, label: "Persona Research: Thomas (target audience)" });
  }

  bundles.push({
    filename: "09-research-and-analysis.md",
    title: "Research & Deep Analysis (Multi-LLM Pipeline)",
    description:
      "Research conducted using a parallel multi-LLM pipeline (Gemini Deep Research + Grok + ChatGPT). " +
      "Includes: scriptwriting synthesis (118 sources integrated), " +
      "academic research on the Black Death, " +
      "YouTube trend analysis, audience persona research, " +
      "and medieval niche market analysis. " +
      "The multi-step research pipeline decomposes questions, researches in parallel, expands, and synthesizes.",
    files: researchFiles,
  });

  // -----------------------------------------------------------------------
  // 10. PLANS & PRODUCTION DOCS
  // -----------------------------------------------------------------------
  const planFiles = listFiles(path.join(ROOT, "docs/plans"), [".md"])
    .filter((f) => path.basename(f) !== "CLAUDE.md")
    .map((f) => ({ path: f, label: `Plan: ${path.basename(f)}` }));

  bundles.push({
    filename: "10-production-plans.md",
    title: "Production Plans & Roadmaps",
    description:
      "Detailed production plans for the Peste 1347 video: " +
      "complete video plan (all phases), hook bloc 1 plan (9 tasks), " +
      "and PixelLab migration plan for scenes 6-7. " +
      "These documents track what was done, what is pending, and architectural decisions.",
    files: planFiles,
  });

  // -----------------------------------------------------------------------
  // 11. SKILLS & FRAMEWORKS
  // -----------------------------------------------------------------------
  const skillFiles: Array<{ path: string; label?: string }> = [];
  const skillsDir = path.join(ROOT, ".claude/skills");
  for (const sub of ["youtube-scriptwriting", "video-production"]) {
    const skill = path.join(skillsDir, sub, "SKILL.md");
    if (fs.existsSync(skill)) {
      skillFiles.push({ path: skill, label: `Skill: ${sub}` });
    }
  }

  // Custom commands (slash commands)
  const commandsDir = path.join(ROOT, ".claude/commands");
  for (const f of listFiles(commandsDir, [".md"])) {
    skillFiles.push({ path: f, label: `Command: ${path.basename(f, ".md")}` });
  }

  // Hooks (automation triggers)
  const hooksDir = path.join(ROOT, ".claude/hooks");
  for (const f of listFiles(hooksDir, [".sh"])) {
    skillFiles.push({ path: f, label: `Hook: ${path.basename(f)}` });
  }

  bundles.push({
    filename: "11-skills-and-frameworks.md",
    title: "Reusable Skills, Commands & Automation Hooks",
    description:
      "Custom skills (reusable prompt frameworks): " +
      "YouTube Scriptwriting (5 phases: Discovery -> Research -> Synthesis -> Script -> Review), " +
      "Video Production (14 phases with fal.ai, 2 visual modes). " +
      "Custom commands: analyze-channel (YouTube analysis pipeline), integrate-feedback (multi-LLM critique triage). " +
      "Automation hooks: preflight checks before rendering, auto Kimi review after render, " +
      "lint on edit, context compaction alerts.",
    files: skillFiles,
  });

  // -----------------------------------------------------------------------
  // 12. UTILITY SCRIPTS & TOOLS
  // -----------------------------------------------------------------------
  const utilFiles: Array<{ path: string; label?: string }> = [];
  for (const f of [
    "scripts/review_with_kimi.py",
    "scripts/generate-audio.ts",
    "scripts/polish-audio.ts",
    "research/launch_deep_research.py",
    "research/multi_step_research.py",
  ]) {
    const full = path.join(ROOT, f);
    if (fs.existsSync(full)) {
      utilFiles.push({ path: full, label: `Tool: ${f}` });
    }
  }

  bundles.push({
    filename: "12-utility-scripts-and-tools.md",
    title: "Utility Scripts & Production Tools",
    description:
      "Custom tools built for this project: " +
      "Kimi K2.5 video reviewer (Moonshot API), " +
      "ElevenLabs audio generator (TTS with markers), " +
      "Auphonic audio polisher, " +
      "multi-LLM deep research launcher (Gemini + Grok + ChatGPT in parallel), " +
      "and multi-step research pipeline (decompose -> research -> expand -> synthesize).",
    files: utilFiles,
  });

  return bundles;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  ensureDir(OUT);

  const bundles = buildExports();
  let totalFiles = 0;
  let totalSize = 0;

  console.log("=== NotebookLM Export ===\n");

  for (const b of bundles) {
    const content = bundle(b.title, b.description, b.files);
    const outPath = path.join(OUT, b.filename);
    fs.writeFileSync(outPath, content, "utf-8");

    const sizeKB = Math.round(Buffer.byteLength(content, "utf-8") / 1024);
    totalSize += sizeKB;
    totalFiles += b.files.length;

    console.log(`  ${b.filename} (${b.files.length} files, ${sizeKB} KB)`);
  }

  // -----------------------------------------------------------------------
  // 13. PIXELLAB CHARACTER REGISTRY (generated separately - custom format)
  // -----------------------------------------------------------------------
  if (fs.existsSync(CHARACTERS_DIR)) {
    const charDirs = fs
      .readdirSync(CHARACTERS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();

    const summaries = charDirs
      .map((dir) => {
        const meta = path.join(CHARACTERS_DIR, dir, "metadata.json");
        if (fs.existsSync(meta)) return extractCharacterSummary(meta);
        return `### ${dir}\n[No metadata.json found]\n`;
      })
      .join("\n");

    const charContent = `# PixelLab Character Registry (Peste 1347)

7 pixel art characters generated via PixelLab AI for the Black Death video project.
Each character is 64x64px, uses the "mannequin" template with "low top-down" camera view.
Characters have 4-directional rotations and various animations (walking, idle, etc.).

These are the generation parameters used - the actual prompt, size, style settings -
which can be reused to generate new characters in the same visual style.

Generated: ${new Date().toISOString().slice(0, 10)}
Characters: ${charDirs.length}

---

${summaries}

## Notes on Asset Pipeline
- Characters are generated via PixelLab MCP tools (create_character + animate_character)
- Sprites are extracted and stored as individual PNGs per frame per direction
- Upscaling uses nearest-neighbor (no blur) to maintain pixel art crispness
- Animation playback uses GridSpritesheetAnimator or PixelLabSprite components in Remotion
- The "low top-down" view was chosen for scene consistency with the town square background
`;

    const outPath = path.join(OUT, "13-pixellab-character-registry.md");
    fs.writeFileSync(outPath, charContent, "utf-8");

    const sizeKB = Math.round(Buffer.byteLength(charContent, "utf-8") / 1024);
    totalSize += sizeKB;
    totalFiles += charDirs.length;
    console.log(`  13-pixellab-character-registry.md (${charDirs.length} characters, ${sizeKB} KB)`);
  }

  // Generate index/manifest
  const manifest = bundles
    .map(
      (b, i) =>
        `${i + 1}. **${b.filename}** - ${b.title}\n   ${b.description.slice(0, 120)}...\n   Files: ${b.files.length}`
    )
    .join("\n\n");

  const indexContent = `# NotebookLM Export - Project Remotion (Peste 1347)

Generated: ${new Date().toISOString().slice(0, 10)}
Total bundles: ${bundles.length}
Total source files: ${totalFiles}
Total size: ~${totalSize} KB

## How to use
1. Open Google NotebookLM (notebooklm.google.com)
2. Create a new notebook
3. Upload all .md files from this directory as sources
4. NotebookLM will index everything and you can:
   - Ask questions about the project
   - Generate Audio Overviews (podcasts)
   - Get citation-backed answers from your own codebase

## Bundle Index

${manifest}

## What is included
- Global + project governance rules (both CLAUDE.md files)
- 4-agent AI team system with persistent memory
- Locked script V3.1 with multi-LLM jury reviews
- All scene and component source code (TypeScript/React)
- Research from 118+ sources across 3 LLMs
- Production plans and roadmaps
- Custom skills (YouTube scriptwriting, video production)
- Custom commands (channel analysis, feedback integration)
- Automation hooks (preflight, Kimi review, lint, context alerts)
- Utility scripts (audio generation, video review, research pipeline)
- Style guides (3 generations tested)
- Technical configuration (Remotion, assets, timing)
- PixelLab character registry (7 characters with generation prompts)

## What is NOT included
- Binary assets (images, audio, video)
- node_modules
- .env secrets and API keys
- Older scene versions (V1-V4) to avoid confusion
- Raw skeleton keypoint data (summaries only)
`;

  fs.writeFileSync(path.join(OUT, "00-INDEX.md"), indexContent, "utf-8");

  console.log(`\n  00-INDEX.md (manifest)`);
  console.log(`\n=== Done ===`);
  console.log(`  ${bundles.length + 1} files written to notebooklm-export/`);
  console.log(`  ${totalFiles} source files bundled`);
  console.log(`  ~${totalSize} KB total`);
  console.log(`\n  Upload all .md files to NotebookLM to create your knowledge base.`);
}

main();
