"""Thiaroye V5 Scene 1 v2 — Seedance 2.0 image-to-video (paper-craft).

Test : lateral tracking camera + parallax on a paper-craft scene.
Pipeline test : if this works, we validate the pattern for scenes 2-6.

Source image : scene1-source-v2-navire.png (3 tirailleurs on ship deck arriving Dakar).
Duration : 13s (scene 1 narration = 13s per Thiaroye V5 manifest).
Endpoint : bytedance/seedance-2.0/image-to-video (RULE 75 — paper-craft REQUIRES i2v).
Cost estimate : 13s x $0.30 = $3.90.
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

SOURCE_IMAGE = REPO / "public/assets/thiaroye-1944/scene1/scene1-source-v2-navire.png"

OUTPUT_DIR = REPO / "public/assets/thiaroye-1944/clips"
OUTPUT_MP4 = OUTPUT_DIR / "s1-retour-v2.mp4"
OUTPUT_META = OUTPUT_DIR / "s1-retour-v2.meta.json"

# Prompt structure :
# 1. STRICT STYLE FIDELITY clause (rule 76)
# 2. Describe what is visible (rule 81)
# 3. Camera : lateral tracking + parallax, explicit
# 4. Characters stay in place (rule 70 safeguard)
# 5. Animation anchors : smoke curl, beret, secondary figures, water
# 6. SECONDS timecodes for 13s
# 7. No drift clause
PROMPT = """Animate this exact paper-craft illustration. STRICT STYLE FIDELITY: maintain the exact visual style of the source image throughout — thick black outlines, flat color fills, paper kraft texture, pure dot-eyes, rounded cartoon proportions, desaturated cold palette on the colonial world, warm ochre-khaki on the tirailleurs. Do NOT add detail, do NOT add realism, do NOT shift toward BD flat or Disney or 3D rendering. The style of frame 0 must be the style of every frame.

WHAT IS VISIBLE IN THE IMAGE (animate only these elements):
- Foreground : three Senegalese tirailleurs in khaki uniforms standing on a wooden ship deck, quiet and weary. LEFT tirailleur holds his duffel bag with one hand, other hand in pocket. CENTRAL tirailleur holds his dark green beret in one hand at chest level, other hand on his shoulder bag strap. RIGHT tirailleur lights a cigarette, a thin white-grey smoke curl rising from its tip.
- Mid-ground left : 3-5 secondary tirailleur figures scattered on the deck — one leaning on the railing, one seated on a crate, two in quiet conversation, one walking.
- Mid-ground right : the ship's superstructure (dark grey-blue cabin and chimney shape) with an officer figure on an upper platform.
- Background left : the colonial waterfront of Dakar as flat paper-craft silhouettes in cold desaturated grey-blue — warehouses, a small lighthouse, rooflines, distant buildings.
- Background : cold overcast slate-blue sky with a few flat grey cloud shapes. Harbor water in cold grey-blue with flat paper-craft ripple shapes between the ship and Dakar.

CAMERA — LATERAL TRACKING GLIDE WITH PARALLAX (critical):
The camera GLIDES SLOWLY sideways, from right to left, as if on a smooth dolly rail, revealing more of the Dakar waterfront on the left and letting the ship's superstructure slide off the right edge. The tirailleurs remain roughly centered in the frame throughout — they DO NOT walk, they DO NOT move laterally, only the CAMERA moves. The world slides past them, not the other way around.
Parallax structure :
- Foreground (deck planks and three principal tirailleurs) : slides the LEAST, anchored in the composition.
- Mid-ground (secondary figures, ship superstructure, railings) : slides at a MEDIUM rate.
- Background (Dakar skyline, harbor water, clouds) : slides FASTER relative to the foreground, giving clear depth separation.
Background elements (Dakar buildings, lighthouse, distant warehouses) MUST remain visually PERSISTENT — same shapes, same silhouettes throughout, no regeneration, no morphing, no shape pop-in. The skyline is a painted backdrop sliding past, not a procedurally invented space.

ANIMATION ANCHORS (in-place micro-motion, no lateral travel):
SECONDS 0 TO 4 : Camera begins its slow rightward-to-leftward glide. The cigarette smoke on the RIGHT tirailleur curls gently upward, a thin continuous wisp in flat paper-craft shape. The CENTRAL tirailleur's beret in his hand makes one subtle adjustment — a small turn or tilt. Harbor water shows gentle flat ripples moving slowly.
SECONDS 4 TO 8 : Camera continues its lateral glide at the same steady pace. More of Dakar's waterfront comes into view on the left. The LEFT tirailleur shifts his weight subtly to the other leg. One secondary figure in the mid-ground (the one gesturing in conversation) completes a small hand gesture. The RIGHT tirailleur's beret oscillates very slightly on his head. The cigarette smoke continues to curl.
SECONDS 8 TO 13 : Camera slows gradually as it completes the glide. The Dakar skyline now fills more of the background-left. The CENTRAL tirailleur makes a subtle slow blink (one single blink, paper-craft dot-eyes closing briefly to a short line and reopening). The seated secondary figure on the crate adjusts his posture microscopically. The smoke curl continues steady. Water ripples continue. Clouds drift almost imperceptibly.

CRITICAL CONSTRAINTS :
- The three principal tirailleurs NEVER walk, NEVER travel laterally, NEVER exit the frame. They stand in place the whole clip. Only the CAMERA moves.
- Their COUNT is preserved : EXACTLY three principal tirailleurs in the foreground at all times. No fourth tirailleur appears. No tirailleur disappears.
- Faces remain CALM and NEUTRAL throughout. No smiles, no grimaces, no open mouths, no dramatic emotion. Dignified restraint.
- Pure DOT-EYES on every face, every frame, including profile views. No iris, no pupil structure, no eyelashes.
- NO morphing, NO wobble, NO shape-shifting on any character or object.
- NO new props appearing. NO text appearing. NO signs, NO banners, NO ship names, NO writing anywhere.
- The ship's superstructure on the right stays coherent as it slides off frame — same cabin shape, same chimney, same officer figure, no regeneration.
- The Dakar skyline silhouette stays coherent as it slides into view on the left — persistent building shapes, no pop-in.
- Paper-craft texture remains visible in the background through the whole clip.
- Palette stays COLD on the colonial world, WARM ochre-khaki only on the tirailleurs and their bags, UNIFORMLY through the clip. No sudden warming. No golden hour. No sunset. Cold December morning throughout.

ANTI-PATTERNS (must NOT appear) :
- NO photorealism drift. NO Disney BD flat drift. NO 3D rendering drift.
- NO camera zoom. NO camera pan up or down. NO orbit. NO rotation. Only HORIZONTAL lateral glide.
- NO characters walking, NO characters crossing the frame.
- NO background loop artifact (skyline buildings repeating or popping in identically).
- NO motion lines, NO speed lines, NO dust clouds, NO drawn wind.
- NO music, no dialogue, no voices, no words, no whistles, no speech.

The clip depicts a cold, quiet moment of arrival — the tirailleurs stand still while the world of Dakar slides past them, a visual metaphor for returning to a place that moves on without them.
"""


def main():
    print("=" * 70)
    print("SEEDANCE 2.0 — Thiaroye V5 Scene 1 v2 (image-to-video)")
    print("=" * 70)
    print()

    # Verify source
    print("[1/4] Verifying source image...")
    if not SOURCE_IMAGE.exists():
        print(f"  MISSING: {SOURCE_IMAGE}")
        sys.exit(1)
    size_kb = SOURCE_IMAGE.stat().st_size // 1024
    print(f"  OK ({size_kb} KB) {SOURCE_IMAGE.name}")
    print()

    # Upload
    print("[2/4] Uploading source image to fal.ai CDN...")
    image_url = fal_client.upload_file(str(SOURCE_IMAGE))
    print(f"  -> {image_url}")
    print()

    # Submit
    print("[3/4] Submitting to Seedance 2.0 image-to-video...")
    print(f"  Endpoint   : bytedance/seedance-2.0/image-to-video")
    print(f"  Duration   : 13s")
    print(f"  Aspect     : 9:16")
    print(f"  Resolution : 720p")
    print(f"  Audio      : generate_audio=false (scene has narration + music added in post)")
    print(f"  Est. cost  : $3.90")
    print()

    args = {
        "prompt": PROMPT,
        "image_url": image_url,
        "duration": "13",
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

    # Download + save
    print("[4/4] Downloading video and metadata...")
    video_url = result["video"]["url"]
    seed = result.get("seed")
    file_size = result["video"].get("file_size")
    print(f"  URL  : {video_url}")
    print(f"  Seed : {seed}")
    print(f"  Size : {file_size} bytes ({file_size/1024/1024:.1f} MB)" if file_size else "  Size : (unknown)")

    import urllib.request
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(video_url, OUTPUT_MP4)
    print(f"  SAVED video: {OUTPUT_MP4}")

    meta = {
        "request_id": request_id,
        "endpoint": "bytedance/seedance-2.0/image-to-video",
        "duration_s": 13,
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": False,
        "seed": seed,
        "video_url": video_url,
        "file_size": file_size,
        "source_image": SOURCE_IMAGE.name,
        "source_image_url": image_url,
        "prompt": PROMPT,
        "cost_usd_estimate": 3.90,
        "test_intent": "lateral tracking glide + parallax, paper-craft fidelity",
        "pipeline_test": "if successful, validates multi-anchor complex prompts for scenes 2-6",
    }
    OUTPUT_META.write_text(json.dumps(meta, indent=2))
    print(f"  SAVED meta : {OUTPUT_META}")
    print()
    print("=" * 70)
    print(f"DONE — review video: {OUTPUT_MP4}")
    print("=" * 70)


if __name__ == "__main__":
    main()
