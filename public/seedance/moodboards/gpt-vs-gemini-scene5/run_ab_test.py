"""
A/B Test : Seedance 2.0 i2v vs Happy Horse 1.0 r2v
720p, 10s, 9:16, MEME prompt, MEME storyboard ref.
Output: V1-seedance-720p-10s.mp4 et V2-happy-horse-720p-10s.mp4
"""

import os
import sys
import time
import json
import threading
import urllib.request
from pathlib import Path
from dotenv import load_dotenv
import fal_client

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

TEST_DIR = Path(__file__).resolve().parent
STORYBOARD = TEST_DIR / "A-gemini-v2-FROM-SCRATCH.png"
V1_OUT = TEST_DIR / "V1-seedance-720p-10s.mp4"
V2_OUT = TEST_DIR / "V2-happy-horse-720p-10s.mp4"
RESULTS = TEST_DIR / "RESULTS.md"

PROMPT = """Reference image: 9-panel papercraft storyboard of a young African boy uprooting a baobab tree.

Use the storyboard ONLY as visual DNA - character appearance, papercraft sepia style, thick black outlines, warm earthy palette, village setting are ALL LOCKED from the reference.

Output: ONE continuous cinematic shot, no panel borders visible, no comic grid structure in output, single seamless animated sequence.

Action: a young African boy with dark chocolate brown skin, curly black hair, red sash at waist, bare-chested, walks toward a giant baobab tree, grips the trunk with both arms, pulls hard until the ground cracks and roots tear free, lifts the entire baobab above his head triumphantly, then walks carrying it over his shoulder toward his mother and lays it on the ground at her feet while the diverse village crowd watches in awe.

Style: papercraft cutout aesthetic, warm sepia palette, thick black outlines, chibi proportions, dot-eyes for background characters, Mande village with conical straw huts and clay-red ground, golden hour lighting. NO floating particles, NO dust motes, NO sparkles, NO text, NO banners, NO signs visible anywhere. Smooth continuous footage."""


def log(tag, msg):
    print(f"[{tag}] {msg}", flush=True)


def on_update_v1(update):
    if isinstance(update, fal_client.InProgress):
        for line in update.logs:
            log("seedance", line.get("message", ""))


def on_update_v2(update):
    if isinstance(update, fal_client.InProgress):
        for line in update.logs:
            log("happy-horse", line.get("message", ""))


results = {}


def run_seedance(image_url):
    log("seedance", "submitting...")
    t0 = time.time()
    try:
        result = fal_client.subscribe(
            "bytedance/seedance-2.0/image-to-video",
            arguments={
                "prompt": PROMPT,
                "image_url": image_url,
                "resolution": "720p",
                "duration": "10",
                "aspect_ratio": "9:16",
                "generate_audio": False,
                "enable_safety_checker": True,
            },
            with_logs=True,
            on_queue_update=on_update_v1,
        )
        elapsed = time.time() - t0
        video_url = result["video"]["url"]
        log("seedance", f"done in {elapsed:.0f}s, downloading {video_url}")
        urllib.request.urlretrieve(video_url, V1_OUT)
        size_mb = V1_OUT.stat().st_size / (1024 * 1024)
        log("seedance", f"saved {V1_OUT.name} ({size_mb:.1f} MB)")
        results["seedance"] = {
            "ok": True,
            "elapsed_s": elapsed,
            "video_url": video_url,
            "file_mb": size_mb,
            "raw": result,
        }
    except Exception as e:
        elapsed = time.time() - t0
        log("seedance", f"ERROR after {elapsed:.0f}s : {e}")
        results["seedance"] = {"ok": False, "elapsed_s": elapsed, "error": str(e)}


def run_happy_horse(image_url):
    log("happy-horse", "submitting...")
    t0 = time.time()
    try:
        result = fal_client.subscribe(
            "fal-ai/happy-horse/reference-to-video",
            arguments={
                "prompt": PROMPT,
                "image_urls": [image_url],
                "resolution": "720p",
                "duration": 10,
                "aspect_ratio": "9:16",
            },
            with_logs=True,
            on_queue_update=on_update_v2,
        )
        elapsed = time.time() - t0
        video_url = result["video"]["url"]
        log("happy-horse", f"done in {elapsed:.0f}s, downloading {video_url}")
        urllib.request.urlretrieve(video_url, V2_OUT)
        size_mb = V2_OUT.stat().st_size / (1024 * 1024)
        log("happy-horse", f"saved {V2_OUT.name} ({size_mb:.1f} MB)")
        results["happy_horse"] = {
            "ok": True,
            "elapsed_s": elapsed,
            "video_url": video_url,
            "file_mb": size_mb,
            "raw": result,
        }
    except Exception as e:
        elapsed = time.time() - t0
        log("happy-horse", f"ERROR after {elapsed:.0f}s : {e}")
        results["happy_horse"] = {"ok": False, "elapsed_s": elapsed, "error": str(e)}


def main():
    if not STORYBOARD.exists():
        log("ERR", f"storyboard not found: {STORYBOARD}")
        sys.exit(1)

    log("preview", "=" * 60)
    log("preview", "A/B TEST - Seedance 2.0 i2v vs Happy Horse 1.0 r2v")
    log("preview", "Storyboard : " + STORYBOARD.name)
    log("preview", "Resolution : 720p / 9:16 / 10s / SAME prompt")
    log("preview", f"Prompt length : {len(PROMPT)} chars")
    log("preview", "Cost estimate : ~$3.02 (seedance) + ~$1.40 (happy horse) = ~$4.42")
    log("preview", "=" * 60)

    log("upload", "uploading storyboard to fal storage...")
    image_url = fal_client.upload_file(str(STORYBOARD))
    log("upload", f"image_url = {image_url}")

    t_start = time.time()
    threads = [
        threading.Thread(target=run_seedance, args=(image_url,)),
        threading.Thread(target=run_happy_horse, args=(image_url,)),
    ]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    total = time.time() - t_start
    log("done", f"both calls finished in {total:.0f}s wallclock")

    write_results(image_url, total)


def write_results(image_url, wallclock_s):
    seed = results.get("seedance", {})
    horse = results.get("happy_horse", {})

    md = []
    md.append("# A/B Test - Seedance 2.0 i2v vs Happy Horse 1.0 r2v")
    md.append("")
    md.append(f"Date : {time.strftime('%Y-%m-%d %H:%M:%S')}")
    md.append(f"Wallclock total : {wallclock_s:.0f}s (parallel submission)")
    md.append("")
    md.append("## Parametres communs")
    md.append("")
    md.append("- Resolution : 720p")
    md.append("- Aspect ratio : 9:16")
    md.append("- Duree : 10s")
    md.append(f"- Storyboard input : `{STORYBOARD.name}` (uploaded {image_url})")
    md.append("- Audio : DESACTIVE pour parite (Sonjata pipeline mixe audio dans Remotion)")
    md.append("")
    md.append("## Prompt envoye (identique aux deux)")
    md.append("")
    md.append("```")
    md.append(PROMPT)
    md.append("```")
    md.append("")
    md.append("## V1 - Seedance 2.0 i2v")
    md.append("")
    md.append("- Endpoint : `bytedance/seedance-2.0/image-to-video` (no fal-ai/ prefix)")
    md.append(f"- Status : {'OK' if seed.get('ok') else 'FAIL'}")
    if seed.get("ok"):
        md.append(f"- Duree generation : {seed['elapsed_s']:.0f}s")
        md.append(f"- Output local : `{V1_OUT.name}` ({seed['file_mb']:.1f} MB)")
        md.append(f"- URL fal : {seed['video_url']}")
        md.append("- Cout estime : ~$3.02 (720p i2v 10s, $0.30/s)")
    else:
        md.append(f"- Erreur : {seed.get('error', 'unknown')}")
    md.append("")
    md.append("## V2 - Happy Horse 1.0 r2v")
    md.append("")
    md.append("- Endpoint : `fal-ai/happy-horse/reference-to-video`")
    md.append(f"- Status : {'OK' if horse.get('ok') else 'FAIL'}")
    if horse.get("ok"):
        md.append(f"- Duree generation : {horse['elapsed_s']:.0f}s")
        md.append(f"- Output local : `{V2_OUT.name}` ({horse['file_mb']:.1f} MB)")
        md.append(f"- URL fal : {horse['video_url']}")
        md.append("- Cout estime : ~$1.40 (720p r2v 10s, $0.14/s)")
    else:
        md.append(f"- Erreur : {horse.get('error', 'unknown')}")
    md.append("")
    md.append("## Verdict (a remplir apres self-review visuelle)")
    md.append("")
    md.append("- Style papercraft preserve (sepia, contours noirs, chibi) ?")
    md.append("- Bordures de panels visibles dans la sortie (BUG critique a detecter) ?")
    md.append("- Coherence personnage (red sash + dark skin + chibi) ?")
    md.append("- Action narrative (grip - pull - tear - lift - carry - lay) ?")
    md.append("- Particules flottantes parasites ?")
    md.append("")
    md.append("## Notes pipeline")
    md.append("")
    md.append("- Endpoint Seedance 2.0 : NE PAS prefixer `fal-ai/` (slug = `bytedance/seedance-2.0/...`).")
    md.append("- Endpoint Happy Horse : SI prefixer `fal-ai/` (slug = `fal-ai/happy-horse/...`).")
    md.append("- Schemas valides : duration string sur Seedance, int sur Happy Horse.")

    RESULTS.write_text("\n".join(md))
    log("results", f"wrote {RESULTS}")


if __name__ == "__main__":
    main()
