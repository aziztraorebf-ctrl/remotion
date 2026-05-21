"""Thiaroye V5 Scene 1 v4 — Seedance 2.0 image-to-video (paper-craft, sobre dolly-in).

V4 corrections from Aziz (2026-04-23):
1. Palette = "cold grey-blue-olive (Thiaroye 1944 colonial military atmosphere)"
   (was "ochre-khaki" — reste du pattern Sonjata, incorrect pour Thiaroye)
2. generate_audio = True (ambient Seedance, narration ElevenLabs overlay en Remotion)

Learning V2 (rule 87 Seedance) : tracking lateral longue duree en paper-craft = echec.
V4 approach : dolly-in LENT ET SOBRE (not orbit, not lateral tracking) — push vers OTS
figure au premier plan qui regarde Dakar, tirailleurs du fond restent dans le champ.

Source image : scene1-source-v4.png (6 tirailleurs + OTS foreground figure regardant Dakar brumeux).
Duration : 13s (scene 1 narration = 13s per Thiaroye V5 manifest).
Endpoint : bytedance/seedance-2.0/image-to-video (RULE 75 — paper-craft REQUIRES i2v).
Cost : 13s x $0.30 = $3.90.
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

SOURCE_IMAGE = REPO / "public/assets/thiaroye-1944/scene1/scene1-source-v4.png"

OUTPUT_DIR = REPO / "public/assets/thiaroye-1944/clips"
OUTPUT_MP4 = OUTPUT_DIR / "s1-retour-v4.mp4"
OUTPUT_META = OUTPUT_DIR / "s1-retour-v4.meta.json"

# Prompt V4 — Dolly-in sobre, pas de tracking lateral (lesson V2 rule 87)
# Correction 1 : palette "cold grey-blue-olive (Thiaroye 1944 colonial military atmosphere)"
# Correction 2 : generate_audio=True (ambient port : eau, vent)
PROMPT = """Animate this exact paper-craft illustration. Paper-craft cutout style, cold grey-blue-olive palette (Thiaroye 1944 colonial military atmosphere), visible paper texture and cut-edge shadows. STRICT STYLE FIDELITY to the source image throughout — thick black outlines, flat color fills, paper kraft texture, pure dot-eyes, rounded cartoon proportions. Do NOT add detail, do NOT add realism, do NOT shift toward BD flat or Disney or 3D rendering. The style of frame 0 must be the style of every frame.

WHAT IS VISIBLE IN THE IMAGE (animate only these elements):
- Foreground RIGHT (large OTS figure) : a Senegalese tirailleur seen from behind, dark green beret, khaki-olive uniform with French tricolor flag patch on shoulder, seated on a duffel bag leaning against the wooden ship railing, looking out toward the misty Dakar silhouette. Tan canvas duffel bag beside him. His back and right shoulder dominate the right third of the frame.
- Foreground LEFT : coiled rope on the wooden deck planks.
- Mid-ground LEFT : two Senegalese tirailleurs standing quietly in khaki-olive uniforms with dark green berets, French flag patches, weary faces, dot-eyes. Behind them a third tirailleur seated on a dark canvas sack, hands resting, looking down.
- Mid-ground RIGHT : two additional tirailleurs standing near the ship's cabin wall (dark grey-blue metal structure, porthole) — one facing slightly toward the other in quiet conversation. Coil of rope on the deck at their feet. A small wooden lifeboat mounted on the upper right cabin structure.
- Background : cold slate-blue overcast sky covering the upper third. The colonial waterfront of Dakar visible as flat paper-craft silhouettes in cold desaturated grey-blue on the far LEFT horizon — warehouses, rooflines, a small lighthouse. Harbor water in cold grey-blue with flat paper-craft ripple shapes stretching between the ship and Dakar.

CAMERA — SLOW SOBER DOLLY-IN (critical, 13s total):
The camera pushes SLOWLY and STEADILY forward, a gentle dolly-in toward the OTS foreground tirailleur and the distant Dakar silhouette beyond him. The push is EXTREMELY SUBTLE — barely perceptible at each instant, just enough over 13s to give a sense of quiet approach. NO lateral travel. NO orbit. NO tilt. NO zoom-cut. Just a slow forward dolly, as if the viewer is gradually drawn into the weary quiet of the deck.
By the end of the clip the OTS tirailleur and the Dakar horizon feel slightly closer, but the composition remains essentially the same. The six tirailleurs are still all in frame throughout — nothing slides off the edges.

ANIMATION ANCHORS (in-place micro-motion, no character travel):
SECONDS 0 TO 5 : Camera begins its barely perceptible forward dolly. Harbor water shows gentle flat ripples moving slowly between the ship and Dakar. The OTS foreground tirailleur's shoulders rise and fall once with a slow breath. One of the two mid-ground LEFT standing tirailleurs shifts his weight subtly to the other leg. Clouds in the sky drift almost imperceptibly.
SECONDS 5 TO 9 : Camera continues its slow sober dolly-in. The SEATED tirailleur in the mid-ground (on the dark sack) makes a small single blink (paper-craft dot-eyes close briefly to a short line and reopen). The two RIGHT-side tirailleurs near the cabin : one makes a very small hand gesture as if finishing a quiet sentence. Harbor water ripples continue. A seagull could very faintly pass far in the sky background (optional, or none).
SECONDS 9 TO 13 : Camera slows almost to a stop as it completes the push. The OTS foreground tirailleur tilts his head microscopically as he looks toward Dakar. One of the two LEFT standing tirailleurs makes a single slow blink. Water ripples continue. The Dakar silhouette remains distant, misty, unchanged in shape.

CRITICAL CONSTRAINTS :
- EXACTLY SIX tirailleurs in the frame at all times : one OTS foreground (back to camera, seated on duffel), two mid-ground LEFT standing, one mid-ground LEFT seated, two mid-ground RIGHT near cabin. No seventh figure appears. No figure disappears.
- NONE of the tirailleurs walks, travels laterally, or exits the frame. They stay in place. Only the CAMERA moves, and only forward, very slowly.
- Faces remain CALM, WEARY, NEUTRAL throughout. No smiles, no grimaces, no dramatic expressions, no open mouths. Dignified restraint — men quiet on the way home after the war.
- Pure DOT-EYES on every face, every frame. No iris, no pupil structure, no white sclera, no eyelashes, no cartoon round eyes.
- NO morphing, NO wobble, NO shape-shifting on any character or object.
- NO new props appearing. NO text appearing anywhere. NO signs, NO banners, NO ship names, NO writing on the tricolor patches beyond plain flag.
- The Dakar skyline silhouette stays VISUALLY PERSISTENT — same buildings, same lighthouse, same rooflines through the whole clip. No pop-in, no regeneration, no shape-morphing. A painted backdrop, not a procedurally invented space.
- The ship's cabin structure on the right stays coherent — same porthole, same lifeboat, same shape.
- Paper-craft texture and cut-edge shadows remain visible throughout.
- Palette stays COLD GREY-BLUE-OLIVE uniformly through the clip. Cold December morning. NO golden hour, NO sunset warming, NO sudden brightness, NO color drift.

ANTI-PATTERNS (must NOT appear) :
- NO photorealism drift. NO Disney BD flat drift. NO 3D rendering drift. NO anime drift.
- NO camera pan, NO tilt, NO orbit, NO rotation, NO lateral tracking, NO zoom-cut. ONLY slow forward dolly-in.
- NO characters walking. NO characters crossing the frame.
- NO background regeneration (Dakar skyline buildings changing shapes or popping in).
- NO motion lines, NO speed lines, NO dust clouds, NO drawn wind.

The clip depicts a cold, quiet moment of arrival — six tirailleurs on deck, each in his own small silence, as the ship drifts toward Dakar. A slow dolly-in that draws the viewer into their dignified fatigue.
"""


def main():
    print("=" * 70)
    print("SEEDANCE 2.0 — Thiaroye V5 Scene 1 v4 (image-to-video, sober dolly-in)")
    print("=" * 70)
    print()

    print("[1/4] Verifying source image...")
    if not SOURCE_IMAGE.exists():
        print(f"  MISSING: {SOURCE_IMAGE}")
        sys.exit(1)
    size_kb = SOURCE_IMAGE.stat().st_size // 1024
    print(f"  OK ({size_kb} KB) {SOURCE_IMAGE.name}")
    print()

    print("[2/4] Uploading source image to fal.ai CDN...")
    image_url = fal_client.upload_file(str(SOURCE_IMAGE))
    print(f"  -> {image_url}")
    print()

    print("[3/4] Submitting to Seedance 2.0 image-to-video...")
    print(f"  Endpoint   : bytedance/seedance-2.0/image-to-video")
    print(f"  Duration   : 13s")
    print(f"  Aspect     : 9:16")
    print(f"  Resolution : 720p")
    print(f"  Audio      : generate_audio=True (ambient port: water, wind)")
    print(f"  Est. cost  : $3.90")
    print(f"  Prompt     : {len(PROMPT)} chars")
    print()

    args = {
        "prompt": PROMPT,
        "image_url": image_url,
        "duration": "13",
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
    }

    handler = fal_client.submit(
        "bytedance/seedance-2.0/image-to-video",
        arguments=args,
    )
    request_id = handler.request_id
    print(f"  Request ID: {request_id}")
    print()

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
        "generate_audio": True,
        "seed": seed,
        "video_url": video_url,
        "file_size": file_size,
        "source_image": SOURCE_IMAGE.name,
        "source_image_url": image_url,
        "prompt": PROMPT,
        "cost_usd_estimate": 3.90,
        "test_intent": "sober slow dolly-in on paper-craft, cold grey-blue-olive palette, Aziz validated V4",
        "v4_corrections": [
            "palette: cold grey-blue-olive (Thiaroye 1944) -- was ochre-khaki reste Sonjata",
            "generate_audio: true -- ambient port pour enrichir le Short sous la narration ElevenLabs"
        ],
        "v2_learning_applied": "rule 87 Seedance: tracking lateral longue duree = echec, donc dolly-in sobre seulement"
    }
    OUTPUT_META.write_text(json.dumps(meta, indent=2))
    print(f"  SAVED meta : {OUTPUT_META}")
    print()
    print("=" * 70)
    print(f"DONE -- review video: {OUTPUT_MP4}")
    print("=" * 70)


if __name__ == "__main__":
    main()
