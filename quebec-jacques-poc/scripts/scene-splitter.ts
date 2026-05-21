import { promptWithVideo } from "./lib/gemini";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REFERENCE_VIDEO = path.join(__dirname, "../reference.mp4");
const SCENES_OUTPUT = path.join(__dirname, "../scenes/scenes.json");

const SCENE_SPLIT_PROMPT = `You are analyzing the first 80 seconds of "9 Faits Incroyables que vous ignorez sur le Québec" by Jacques a dit, a French YouTube geography video. Split it into distinct scenes for recreation in code (Remotion/React + Mapbox).

## CRITICAL: Scene Boundaries

A scene = a separate Remotion Composition (a separate React component).
Only create a new scene when the ENTIRE visual foundation changes (different background, different layout structure).
A scene is like a "page" or "screen" - not a "section" or "moment".

What is NOT a scene:
- A partial animation (text fades in is part of the screen it fades into)
- Micro-segments under 1 second (merge with adjacent scene)
- Same background/layout with different text - ONE SCENE with multiple text states

Fewer Scenes = Better. Maximum reuse of components.

## For Each Scene, Provide:

### Basic Info
- id: scene-XXX (zero-padded)
- start_time: Precise start in seconds
- end_time: Precise end in seconds
- duration: Length

### Visual Description
- description: What happens visually (2-3 sentences in English)
- key_elements: Array of visual elements
- layout: Spatial arrangement
- background: What's the background (Mapbox satellite? topographic? solid color?)
- map_camera: If a map is shown, describe: { center_lon, center_lat, zoom_level (estimate), pitch (0=flat, 60=tilted), bearing }
- map_style_estimate: "satellite" | "outdoors" | "light" | "custom" | "none"
- dominant_colors: Hex codes
- text_overlay: Any text shown (chapter number, title, captions)

### Animation Notes
- camera_motion: "static" | "zoom_in" | "zoom_out" | "pan" | "fly_to" | "tilt" | "rotate" | "complex_3d"
- element_animations: List motion of overlay elements (silhouette draws, flag fades, number bounces)
- transitions_in: How does this scene start? (fade, cut, slide)
- transitions_out: How does this scene end?

### Implementation Strategy
- recommended_tech: "mapbox_static" (cheap, fixed cam) | "mapbox_gl_3d" (cinematic) | "svg_only" (no map)
- build_notes: Specific guidance for recreating in Remotion + our quebec-poc components

### Assets to Generate (CRITICAL)
- generated_assets_needed: Array of objects {type, prompt} for assets we should generate via Gemini Image
  - Examples: {type: "icon", prompt: "minimalist Quebec flag icon, flat design, 512x512, transparent background"}
  - {type: "marker", prompt: "Montreal city pin marker, modern flat illustration"}
  - {type: "decoration", prompt: "vintage map cartouche frame, French colonial style"}

### Audio Hints
- voice_lines: The French narration text spoken during this scene (transcribe exactly)
- sfx_hints: Sound effects expected (whoosh, pop, draw, swipe, chime, transition)

### Cross-References
- similar_to: Array of other scene IDs that share visual elements
- reuses_from: If reuses elements from another scene

## Output Format

Respond ONLY with valid JSON wrapped in \`\`\`json code block:

{
  "video_info": {
    "total_duration": 80.0,
    "fps": 30,
    "resolution": "1280x720",
    "language": "French",
    "topic": "Quebec geography"
  },
  "global_notes": {
    "brand_colors": [],
    "brand_font": "...",
    "recurring_elements": ["chapter number top-left", "Quebec silhouette with flag", "topographic map background", "image inserts in rounded white frames"],
    "narrative_style": "Fast-paced French narration, educational, energetic"
  },
  "reusable_components": [
    {
      "name": "ChapterNumber",
      "description": "...",
      "used_in_scenes": [],
      "props": []
    }
  ],
  "scenes": [...],
  "scene_count": N
}`;

async function main() {
  console.log("Analyzing reference video for scene segmentation...");
  console.log("Video:", REFERENCE_VIDEO);

  if (!fs.existsSync(REFERENCE_VIDEO)) {
    console.error("Reference video not found:", REFERENCE_VIDEO);
    process.exit(1);
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY environment variable not set");
    process.exit(1);
  }

  if (!fs.existsSync(path.dirname(SCENES_OUTPUT))) {
    fs.mkdirSync(path.dirname(SCENES_OUTPUT), { recursive: true });
  }

  try {
    console.log("Sending video to Gemini 3 Flash Preview (this can take 30-60s)...");
    const response = await promptWithVideo(REFERENCE_VIDEO, SCENE_SPLIT_PROMPT);

    let jsonStr = response;
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const scenes = JSON.parse(jsonStr);
    fs.writeFileSync(SCENES_OUTPUT, JSON.stringify(scenes, null, 2));
    console.log("\nScene metadata written to:", SCENES_OUTPUT);
    console.log("Found", scenes.scene_count || scenes.scenes?.length, "scenes");
    console.log("\n=== SCENES SUMMARY ===");
    for (const scene of scenes.scenes || []) {
      console.log(`${scene.id}: ${scene.start_time}-${scene.end_time}s | ${scene.recommended_tech} | ${scene.description?.slice(0, 80)}`);
    }
  } catch (error) {
    console.error("Error analyzing video:", error);
    process.exit(1);
  }
}

main();
