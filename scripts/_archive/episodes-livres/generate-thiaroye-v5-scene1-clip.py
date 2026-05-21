"""Thiaroye V5 Scene 1 — Seedance 2.0 image-to-video (i2v).

Pipeline: paper-craft i2v UNIQUEMENT (R-PC11 : pas de ref-to-video en paper-craft).
Image source: scene1-source-v1.png (validee par Aziz 2026-04-23).

Camera movement (manifest Thiaroye V5):
  "Slow dolly in toward central tirailleur, then cinematic arc 45 degrees
   around his profile. Smooth, stable motion."

Duration: 13s (Format 5 exploration contemplative).
  Note manifest: scene dure 14s total (start_s=5, end_s=19). 13s clip + 1s
  freeze/fade dans Remotion si besoin.
Aspect ratio: 9:16 natif (pas de crop post).
Resolution: 720p.
Cost: 13s x $0.30/s = $3.90 (standard endpoint).

Rules applied:
- Regle 75 : i2v >> ref-to-video pour fidelite de style (paper-craft)
- Regle 76 : clause STRICT STYLE FIDELITY obligatoire
- Regle 5  : anti-texte (no banners, no writing)
- Regle 54 : "no music, no words" fin de prompt
- Regle 68 : scene contemplative = mouvement camera explicite + micro-actions
- Regle 73 : eviter "slowly" (remplace par "steadily")
- Regle 77 : separer mouvement camera vs mouvement personnage (tirailleurs STILL)
- Regle 79 : dolly in fonctionne proprement en paper-craft (valide 9/10)
- Regle 86 : ref-to-video ECHEC en paper-craft (0/3) -> on fait i2v
- R-PC11  : paper-craft = i2v only, pas de ref-to-video
"""

import os
import sys
import json
import time
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

FAL_KEY = os.environ.get("FAL_KEY", "")
if not FAL_KEY:
    print("ERROR: FAL_KEY not set")
    sys.exit(1)

import fal_client

REPO = Path("/Users/clawdbot/Workspace/remotion")
SOURCE_IMAGE = REPO / "public/assets/thiaroye-1944/scene1/scene1-source-v1.png"

OUTPUT_DIR = REPO / "public/assets/thiaroye-1944/clips"
OUTPUT_MP4 = OUTPUT_DIR / "s1-retour.mp4"
OUTPUT_META = OUTPUT_DIR / "s1-retour.meta.json"

DURATION = "13"

PROMPT = """Animate this exact paper-craft illustration of three Senegalese tirailleurs standing on a dock at the port of Dakar at sunset.

STRICT STYLE FIDELITY — CRITICAL: maintain the exact paper-craft storybook visual style of the source image throughout the entire clip. Thick black outlines. Flat color fills with NO gradients. Paper kraft texture background. Pure dot-eyes on every character. Rounded cartoon proportions. Do NOT add detail, do NOT add realism, do NOT add shading, do NOT add 3D depth, do NOT drift toward BD flat or Pixar 3D. The last frame must look identical in style to the first frame.

CAMERA MOVEMENT — THE ONLY MOTION IN THIS CLIP:
0 TO 7s: Camera PUSHES IN steadily toward the central tirailleur (the tallest soldier in the middle of the frame, facing the camera full-front). Smooth stable forward dolly motion, continuous throughout, no stuttering, no stopping. The central tirailleur grows larger and more present as the camera approaches. The two side tirailleurs gradually drift out of frame on the left and right edges.
7 TO 13s: Camera ARCS 45 degrees clockwise around the central tirailleur, revealing his right profile. Smooth stable cinematic arc motion, the central tirailleur stays centered in the frame, the camera moves around him in a gentle quarter-turn. The background dock infrastructure and troop ship slowly slide from his left side to behind him as the camera rotates. Continuous smooth motion, no cuts.

CHARACTER MOTION — CRITICAL: the THREE tirailleurs are STILL. They do NOT walk, do NOT wave, do NOT salute, do NOT turn their heads, do NOT raise their arms, do NOT gesture. They stand dignified and motionless, waiting. ONLY the camera moves, NOT the tirailleurs. The duffel bags at their feet stay exactly where they are on the dock planks.

BACKGROUND MOTION — MINIMAL: the troop ship in the far right background remains ANCHORED at the dock, gentle almost imperceptible sway only, no visible propulsion, no wake in the water. The harbor water shows a few very gentle flat-color ripples, no photoreal reflections, no shimmering. The sun on the horizon is FIXED, it does NOT move, it does NOT pulse, it does NOT glow brighter. A few simple paper-craft clouds drift very slightly.

NO unnecessary 360-degree turns. NO unnecessary spins. Without motion distortion. Without abrupt changes. The human body structure is normal. NO morphing of any character. NO shifting uniforms, NO appearing or disappearing French flag patches, NO changing beret colors.

COLOR GRADE — CRITICAL: maintain the exact dual-tone palette of the source image. COLD DESATURATED greys and steel blues for the dock, buildings, crates, ship, water, and sky background. WARM OCHRE-KHAKI tones retained on the three tirailleurs themselves (khaki-green uniforms, dark brown skin, dark green berets, brown leather boots, tan canvas duffel bags). A warm orange-gold horizon glow behind them, applied as flat color fields, NOT as shaded volumetric light. Do NOT shift the palette toward full saturation, do NOT warm up the cold areas, do NOT cool down the warm tirailleurs.

No text, no banners, no signs, no writing visible anywhere. No ship names, no flag text. No music, no words, no dialogue."""


def main():
    print("=" * 70)
    print("SEEDANCE 2.0 — Thiaroye V5 Scene 1 (image-to-video, paper-craft)")
    print("=" * 70)
    print()

    # Step 1: verify source
    print("[1/4] Verifying source image...")
    if not SOURCE_IMAGE.exists():
        print(f"  MISSING: {SOURCE_IMAGE}")
        sys.exit(1)
    size_kb = SOURCE_IMAGE.stat().st_size // 1024
    print(f"  OK ({size_kb} KB) {SOURCE_IMAGE.name}")
    print()

    # Step 2: upload source
    print("[2/4] Uploading source image to fal.ai CDN...")
    image_url = fal_client.upload_file(str(SOURCE_IMAGE))
    print(f"  {SOURCE_IMAGE.name} -> {image_url}")
    print()

    # Step 3: submit
    print("[3/4] Submitting to Seedance 2.0 image-to-video...")
    print(f"  Endpoint: bytedance/seedance-2.0/image-to-video")
    print(f"  Duration: {DURATION}s")
    print(f"  Aspect: 9:16 (native, no crop)")
    print(f"  Resolution: 720p")
    print(f"  Audio: generate_audio=false (narration ElevenLabs overlay separate)")
    print(f"  Prompt length: {len(PROMPT)} chars")
    print(f"  Est. cost: ${int(DURATION) * 0.30:.2f}")
    print()

    args = {
        "prompt": PROMPT,
        "image_url": image_url,
        "duration": DURATION,
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": False,
    }

    handler = fal_client.submit(
        "bytedance/seedance-2.0/image-to-video",
        arguments=args,
    )
    request_id = handler.request_id
    print(f"  Request ID: {request_id}")
    print()

    # Poll
    print("  Polling for completion...")
    start = time.time()
    last_log = ""
    while True:
        status = fal_client.status(
            "bytedance/seedance-2.0/image-to-video",
            request_id,
            with_logs=False,
        )
        elapsed = int(time.time() - start)
        status_name = type(status).__name__
        if status_name != last_log:
            print(f"    [{elapsed}s] status: {status_name}")
            last_log = status_name
        if status_name == "Completed":
            break
        if elapsed > 600:
            print("  TIMEOUT after 10 min")
            sys.exit(1)
        time.sleep(5)

    result = fal_client.result(
        "bytedance/seedance-2.0/image-to-video",
        request_id,
    )
    print()

    # Step 4: download + save
    print("[4/4] Downloading video and metadata...")
    video_url = result["video"]["url"]
    seed = result.get("seed")
    file_size = result["video"].get("file_size")
    print(f"  URL: {video_url}")
    print(f"  Seed: {seed}")
    if file_size:
        print(f"  Size: {file_size} bytes ({file_size/1024/1024:.1f} MB)")

    import urllib.request
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(video_url, OUTPUT_MP4)
    print(f"  SAVED video: {OUTPUT_MP4}")

    meta = {
        "request_id": request_id,
        "endpoint": "bytedance/seedance-2.0/image-to-video",
        "duration_s": int(DURATION),
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": False,
        "seed": seed,
        "video_url": video_url,
        "file_size": file_size,
        "source_image": str(SOURCE_IMAGE.relative_to(REPO)),
        "source_image_url": image_url,
        "prompt": PROMPT,
        "cost_usd_estimate": int(DURATION) * 0.30,
        "camera_movement": "Slow dolly in 0-7s + cinematic arc 45deg 7-13s",
        "scene": "thiaroye-v5 scene 1 Le Retour",
    }
    OUTPUT_META.write_text(json.dumps(meta, indent=2))
    print(f"  SAVED meta: {OUTPUT_META}")
    print()
    print("=" * 70)
    print(f"DONE — review video: {OUTPUT_MP4}")
    print("=" * 70)


if __name__ == "__main__":
    main()
