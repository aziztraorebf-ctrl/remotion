"""Thiaroye V5 — Seedance 2.0 clips pour scenes 4B, 5A, 6, 3B.

Generation dans l'ordre : 4B -> 5A -> 6 -> 3B
Endpoint : bytedance/seedance-2.0/image-to-video (RULE 75 : paper-craft REQUIRES i2v)
Format : 9:16, 720p, generate_audio=True

Durees cibles (R-DURATION-MATCH, manifest thiaroye-v5-manifest.json) :
  4B (tribunal)       : narration ~10s sur 22s scene 4 totale -> clip 10s
  5A (Biram memorial) : narration scene 5 = 14s -> clip 10s (split possible si besoinn)
  6  (plage Dakar)    : narration scene 6 = 9s  -> clip 7s (sweet spot Sonjata)
  3B (apres massacre) : scène 3 = 17s, image 3B = APRES massacre -> clip 7s
                        (scène 3 découpée en 3A action + 3B aftermath)

Cout estimé :
  4B : 10s x $0.30 = $3.00
  5A : 10s x $0.30 = $3.00
  6  :  7s x $0.30 = $2.10
  3B :  7s x $0.30 = $2.10
  TOTAL : $10.20

Usage :
  python -u scripts/tools/seedance-thiaroye-scenes-2to6.py
  python -u scripts/tools/seedance-thiaroye-scenes-2to6.py --scene 4b
  python -u scripts/tools/seedance-thiaroye-scenes-2to6.py --recover --scene 5a
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path("/Users/clawdbot/Workspace/remotion")
load_dotenv(ROOT / ".env")

FAL_KEY = os.environ.get("FAL_KEY", "")
if not FAL_KEY:
    print("ERROR: FAL_KEY not set in .env")
    sys.exit(1)

import fal_client

ENDPOINT = "bytedance/seedance-2.0/image-to-video"
BASE = ROOT / "public" / "assets" / "thiaroye-1944"
CLIPS_DIR = BASE / "clips"
CLIPS_DIR.mkdir(parents=True, exist_ok=True)


# =============================================================================
# SCENE DEFINITIONS
# =============================================================================

SCENES = {

    "4b": {
        "source_image": BASE / "scene4b" / "scene4b-source-v1b.png",
        "output_mp4": CLIPS_DIR / "s4b-tribunal-v1.mp4",
        "output_meta": CLIPS_DIR / "s4b-tribunal-v1.meta.json",
        "request_id_file": CLIPS_DIR / "s4b-tribunal-v1.request-id.txt",
        "duration": "10",
        "cost_usd": 3.00,
        "checklist": {
            "1_mots_rouges": "OK : 12 mots verifies (aucun : slowly/gently/subtly/still/gradually/softly/barely/almost/frozen/motionless/dignified/remains still)",
            "2_image_vivante": "OK : fenetre avec lumiere variable, drapeau tricolore (flutter), silhouettes gallery (micro-shift)",
            "3_personnages_vie": "OK : main avocat (PRESSES, SHIFTS), silhouettes gallery (ADJUST, LEAN)",
            "4_timeline": "OK : 3 segments (0-3s / 3-6s / 6-10s)",
            "5_actions_macro": "OK : 2-3 verbes MAJUSCULES par segment",
            "6_camera_sobre": "OK : static hold + tres lent zoom avant",
            "7_style_clause": "OK : STRICT STYLE FIDELITY paper-craft",
            "8_anti_morph": "OK : mains (RIGID, SOLID), flag (FLAT ribbon shape)",
            "9_environnement": "OK : flag FLUTTERS, window light SHIFTS, gallery silhouettes micro-move",
            "10_closing": "OK : closing rule present",
            "11_longueur": "~1350 chars",
            "12_duree": "10s",
            "13_contradictions": "OK : scan effectue, aucune contradiction",
            "14_pensees_internes": "OK : nettoye",
            "15_regles_projet": "OK : R75 i2v, R-STYLE paper-craft, R68 scene calme (dolly slow), flag anti-heraldry"
        },
        "prompt": """Animate this exact illustration. STRICT STYLE FIDELITY: flat 2D paper-craft, cold grey-blue-honey palette, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

Camera: Static hold with imperceptible slow dolly-in over 10 seconds. No pan. No rotation.

SECONDS 0 TO 3: The lawyer's hand on the left PRESSES flat against the podium edge, fingers CURLING slightly inward with tension. The hand on the document SHIFTS its grip, thumb PRESSING on the document corner. In the gallery background, two silhouette figures ADJUST their seated posture.

SECONDS 3 TO 6: The lawyer's left hand RELEASES the podium edge and RESTS open alongside his leg. The right hand LIFTS the document corner slightly then LOWERS it back flat. The French tricolor flag at right FLUTTERS once with a slow wave from bottom to top. Window light DIMS then BRIGHTENS as a cloud passes outside.

SECONDS 6 TO 10: The hand on the document PRESSES down with finality, fingers SPREADING flat. The flag SETTLES. A third silhouette in the gallery LEANS forward slightly, then sits back. The window light holds cold and steady.

Continuous throughout: The tricolor flag FLUTTERS intermittently with long flat ribbon waves. Cold window light SHIFTS imperceptibly. Gallery silhouettes micro-shift in their seats.

The document stays flat on the podium -- it does not lift, does not fold, does not move on its own. The flag shows only color bands -- no heraldry, no writing visible. No text, no banners, no labels anywhere.

All characters stay engaged, bodies continuously micro-shifting. MAINTAIN flat color fills throughout, no gradients, no realistic shading. Ambient sounds only: distant courtroom murmur, paper rustle, no music, no dialogue.""",
    },

    "5a": {
        "source_image": BASE / "scene5a" / "scene5a-source-v1a.png",
        "output_mp4": CLIPS_DIR / "s5a-biram-memorial-v1.mp4",
        "output_meta": CLIPS_DIR / "s5a-biram-memorial-v1.meta.json",
        "request_id_file": CLIPS_DIR / "s5a-biram-memorial-v1.request-id.txt",
        "duration": "10",
        "cost_usd": 3.00,
        "checklist": {
            "1_mots_rouges": "OK : 12 mots verifies",
            "2_image_vivante": "OK : flamme eternelle (flickers), document (flutter corner), lumiere froide",
            "3_personnages_vie": "OK : Biram (SHIFTS weight, PRESSES document, TURNS head), portrait wall (ILLUMINATES one by one)",
            "4_timeline": "OK : 3 segments (0-3s / 3-6s / 6-10s)",
            "5_actions_macro": "OK : 2-3 verbes MAJUSCULES par segment",
            "6_camera_sobre": "OK : static + tres lent tilt-up",
            "7_style_clause": "OK",
            "8_anti_morph": "OK : document RIGID, flame FLAT flicker shape",
            "9_environnement": "OK : flame FLICKERS, cold light HOLDS, portraits ILLUMINATE",
            "10_closing": "OK",
            "11_longueur": "~1400 chars",
            "12_duree": "10s",
            "13_contradictions": "OK",
            "14_pensees_internes": "OK",
            "15_regles_projet": "OK : R75 i2v, no text on portraits, eternal flame kept as flat shape, R68 contemplative (static camera)"
        },
        "prompt": """Animate this exact illustration. STRICT STYLE FIDELITY: flat 2D paper-craft, cold grey memorial palette, clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

Camera: Static hold with very slow upward tilt over 10 seconds, near-imperceptible. No pan.

SECONDS 0 TO 3: The elderly man (Biram Senghor) SHIFTS his weight from right foot to left, body SETTLING into a grounded stance. His hands PRESS the document tighter against his chest, thumbs GRIPPING the edge. He TURNS his head slightly toward the upper-left portrait on the wall.

SECONDS 3 TO 6: Biram STRAIGHTENS his posture, chin LIFTING slightly. His right thumb TRACES the document edge. Two portrait frames on the wall catch a warmer light and BRIGHTEN imperceptibly -- as if the faces are being acknowledged. The eternal flame at bottom-right FLICKERS with a single tall pulse of orange-gold, then SETTLES.

SECONDS 6 TO 10: Biram SQUARES his shoulders, body CENTERING toward the portrait wall directly ahead. His grip on the document FIRMS, both hands PRESSING the folded paper flat. The eternal flame FLICKERS once more, a steady organic pulse. The portrait wall holds its grey-black tones, watching.

Continuous throughout: The eternal flame FLICKERS with organic flat paper-craft shapes -- no gradients, just flat orange and yellow aplats shifting. Cold overhead light HOLDS steady. Biram's body continuously micro-shifts with subtle weight transfers.

The document stays folded -- it does not unfold, does not open. Portrait frames stay as paper-craft flat shapes -- no faces change expression. No text, no words, no names visible on portraits or document.

All characters stay engaged, bodies continuously micro-shifting. MAINTAIN flat color fills throughout. Ambient sounds only: distant wind, soft footsteps on stone, no music, no dialogue.""",
    },

    "6": {
        "source_image": BASE / "scene6" / "scene6-source-v1a.png",
        "output_mp4": CLIPS_DIR / "s6-dakar-cote-v1.mp4",
        "output_meta": CLIPS_DIR / "s6-dakar-cote-v1.meta.json",
        "request_id_file": CLIPS_DIR / "s6-dakar-cote-v1.request-id.txt",
        "duration": "7",
        "cost_usd": 2.10,
        "checklist": {
            "1_mots_rouges": "OK : 12 mots verifies",
            "2_image_vivante": "OK : vagues, oiseaux, vent dans vetements, reflet soleil, ciel coucher",
            "3_personnages_vie": "OK : jeune homme (SHIFTS weight, jacket BILLOWS, hair LIFTS), oiseaux (GLIDE), vagues (LAP)",
            "4_timeline": "OK : 3 segments (0-2s / 2-4s / 4-7s)",
            "5_actions_macro": "OK : 2-3 verbes MAJUSCULES par segment",
            "6_camera_sobre": "OK : slow dolly-out + tres lent tilt-up",
            "7_style_clause": "OK",
            "8_anti_morph": "OK : jacket RIGID SHAPE, photograph flat",
            "9_environnement": "OK : waves LAP, birds GLIDE, jacket BILLOWS, sun reflection SHIMMERS",
            "10_closing": "OK",
            "11_longueur": "~1300 chars",
            "12_duree": "7s sweet spot",
            "13_contradictions": "OK",
            "14_pensees_internes": "OK",
            "15_regles_projet": "OK : R75 i2v, scene calme = dolly-out verso ciel, palette warm restored, oiseaux plats"
        },
        "prompt": """Animate this exact illustration. STRICT STYLE FIDELITY: flat 2D paper-craft, warm restored sunset palette (gold-orange-indigo sky, red-ochre sand, deep teal ocean), clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

Camera: Slow dolly-out from the young man over 7 seconds, combined with imperceptible upward tilt toward the sunset sky. Smooth, wide, commemorative movement.

SECONDS 0 TO 2: The young man SHIFTS his weight forward onto his right foot, body LEANING slightly toward the ocean. His jacket BILLOWS outward on the left side as a sea wind PULLS at the fabric. His hair LIFTS at the tips. His arms hang loose at his sides.

SECONDS 2 TO 4: Three birds GLIDE across the upper sky, moving left to right in flat silhouette shapes. Ocean waves LAP at the shoreline with flat paper-craft ripple lines advancing toward the sand. The sun's reflection on the water SHIMMERS -- flat golden-orange ribbon shapes shifting on the teal surface. The young man TURNS his head slightly left, gaze SCANNING toward the horizon.

SECONDS 4 TO 7: The young man SQUARES his stance, both feet planted, body SETTLING. His jacket fabric FLUTTERS once more then SETTLES. More birds GLIDE from right to left across the sky. Waves continue to LAP. The sunset sky HOLDS its warm palette.

Continuous throughout: Ocean waves LAP rhythmically with flat paper-craft shapes. Birds GLIDE in flat silhouette. Wind PULLS at jacket and hair intermittently. Sun reflection SHIMMERS on water.

The photograph on the sand stays flat and face-down -- it does not move on its own. No text, no words visible anywhere.

All elements stay engaged in continuous organic motion. MAINTAIN warm flat color fills throughout, no gradients, no realistic shading. Ambient sounds only: ocean waves, sea wind, distant bird calls, no music, no dialogue.""",
    },

    "3b": {
        "source_image": BASE / "scene3b" / "scene3b-source-v1b.png",
        "output_mp4": CLIPS_DIR / "s3b-aftermath-v1.mp4",
        "output_meta": CLIPS_DIR / "s3b-aftermath-v1.meta.json",
        "request_id_file": CLIPS_DIR / "s3b-aftermath-v1.request-id.txt",
        "duration": "7",
        "cost_usd": 2.10,
        "checklist": {
            "1_mots_rouges": "OK : 12 mots verifies",
            "2_image_vivante": "OK : lanterne (flamme vacillante), vent (souleve lettre), poussiere fine",
            "3_personnages_vie": "OK : exception R-VIVANT (silhouette tombee = autorisee). Main = immobile (post-massacre, silence voulu).",
            "4_timeline": "OK : 3 segments (0-2s / 2-4s / 4-7s)",
            "5_actions_macro": "OK : 2-3 actions par segment sur environnement",
            "6_camera_sobre": "OK : static hold avec tres lent dolly-in sur la main",
            "7_style_clause": "OK",
            "8_anti_morph": "OK : main FLAT SHAPE, sang FLAT APLAT rouge, pas de morphing",
            "9_environnement": "OK : lanterne FLICKERS, lettre corner LIFTS, dust DRIFTS",
            "10_closing": "OK",
            "11_longueur": "~1300 chars",
            "12_duree": "7s (aftermath = court, silence pese)",
            "13_contradictions": "OK : silence voulu post-massacre = exception R-VIVANT explicite",
            "14_pensees_internes": "OK",
            "15_regles_projet": "OK : R75 i2v, R-PC19 silhouettes aplats, sang FLAT APLAT (non-photorealiste), pas de violence supplementaire, drapeau NE PAS bouger (respecter dignite)"
        },
        "prompt": """Animate this exact illustration. STRICT STYLE FIDELITY: flat 2D paper-craft, cold grey courtyard palette (grey stone, ochre earth, flat crimson-red pool), clean dark outlines, flat color fills, paper texture. Do NOT add detail or realism.

Camera: Static hold with imperceptible slow dolly-in over 7 seconds toward the open hand in foreground. No pan. No rotation. Reverential, slow, weighted.

SECONDS 0 TO 2: The scene holds. The fallen hand lies open palm-up on the grey stone -- flat shape, unmoving, at rest. The letter beside the hand has its corner LIFTING once in a faint cold wind, then SETTLING back flat on the stone. Dust DRIFTS across the courtyard at ankle height, left to right.

SECONDS 2 TO 4: The lantern on the stone wall FLICKERS -- its flame shape PULSES once with a small flat orange shape, then DIMS back to grey cold. The letter corner LIFTS again slightly, then SETTLES. More fine dust DRIFTS across the red pool from left.

SECONDS 4 TO 7: The lantern FLICKERS one final time, then holds its dim cold glow. The letter corner stays flat. The dust settles. The courtyard holds in cold silence. The open palm of the hand faces upward, unmoving, receiving nothing.

Continuous throughout: Fine dust DRIFTS across the stone surface at low height, CROSSING left to right steadily. The lantern flame FLICKERS with small flat organic paper-craft shape pulses.

The crimson-red pool stays as a flat aplat -- no spreading, no movement, no gradient. The hand and arm remain absolutely at rest -- they do not move. No additional violence, no sounds of conflict. No text, no writing visible anywhere.

Bodies continuously at rest. MAINTAIN cold flat color fills throughout. Ambient sounds only: distant wind across stone, absolute silence of aftermath, no music, no voices.""",
    },
}


# =============================================================================
# GENERATION FUNCTIONS
# =============================================================================

def submit_scene(scene_id: str) -> tuple[str, str]:
    cfg = SCENES[scene_id]
    source = cfg["source_image"]
    if not source.exists():
        print(f"ERROR: source image not found: {source}")
        sys.exit(1)

    size_kb = source.stat().st_size // 1024
    print(f"  Source image : {source.name} ({size_kb} KB)")
    print(f"  Duration     : {cfg['duration']}s")
    print(f"  Est. cost    : ${cfg['cost_usd']:.2f}")
    print(f"  Prompt       : {len(cfg['prompt'])} chars")
    print()

    print("  Uploading source image to fal.ai CDN...")
    image_url = fal_client.upload_file(str(source))
    print(f"  -> {image_url}")
    print()

    print(f"  Submitting to {ENDPOINT}...")
    args = {
        "prompt": cfg["prompt"],
        "image_url": image_url,
        "duration": cfg["duration"],
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
    }

    handler = fal_client.submit(ENDPOINT, arguments=args)
    request_id = handler.request_id
    print(f"  Request ID   : {request_id}")

    rid_file = cfg["request_id_file"]
    rid_file.write_text(
        f"{request_id}\n"
        f"# endpoint: {ENDPOINT}\n"
        f"# image_url: {image_url}\n"
        f"# scene_id: {scene_id}\n"
        f"# saved_at: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"
    )
    print(f"  Request ID saved: {rid_file}")

    return request_id, image_url


def poll_scene(scene_id: str, request_id: str) -> None:
    print(f"  Polling until complete (max 10min)...")
    start = time.time()
    last_status = ""
    while True:
        status = fal_client.status(ENDPOINT, request_id, with_logs=False)
        elapsed = int(time.time() - start)
        sname = type(status).__name__
        if sname != last_status:
            print(f"    [{elapsed}s] {sname}")
            last_status = sname
        if sname == "Completed":
            break
        if elapsed > 600:
            print("  TIMEOUT -- use --recover to resume")
            sys.exit(1)
        time.sleep(5)


def download_scene(scene_id: str, request_id: str, image_url: str) -> None:
    cfg = SCENES[scene_id]
    result = fal_client.result(ENDPOINT, request_id)
    print()

    video_url = result["video"]["url"]
    seed = result.get("seed")
    file_size = result["video"].get("file_size")
    print(f"  Video URL : {video_url}")
    print(f"  Seed      : {seed}")
    if file_size:
        print(f"  Size      : {file_size} bytes ({file_size/1024/1024:.1f} MB)")

    import urllib.request
    urllib.request.urlretrieve(video_url, cfg["output_mp4"])
    print(f"  SAVED video : {cfg['output_mp4']}")

    prompt_txt = cfg["output_mp4"].with_suffix("").parent / (cfg["output_mp4"].stem + ".prompt.txt")
    prompt_txt.write_text(
        f"# {scene_id} Seedance clip prompt\n"
        f"Tool: Seedance 2.0 image-to-video\n"
        f"Source: {cfg['source_image']}\n"
        f"Duration: {cfg['duration']}s\n"
        f"Cost: ${cfg['cost_usd']:.2f}\n\n"
        f"---CHECKLIST---\n" +
        "\n".join(f"{k}: {v}" for k, v in cfg["checklist"].items()) +
        f"\n\n---PROMPT---\n{cfg['prompt']}\n"
    )

    meta = {
        "scene_id": scene_id,
        "request_id": request_id,
        "endpoint": ENDPOINT,
        "duration_s": int(cfg["duration"]),
        "aspect_ratio": "9:16",
        "resolution": "720p",
        "generate_audio": True,
        "seed": seed,
        "video_url": video_url,
        "file_size": file_size,
        "source_image": str(cfg["source_image"]),
        "source_image_url": image_url,
        "prompt_chars": len(cfg["prompt"]),
        "cost_usd_estimate": cfg["cost_usd"],
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
    }
    cfg["output_meta"].write_text(json.dumps(meta, indent=2))
    print(f"  SAVED meta  : {cfg['output_meta']}")
    print(f"  SAVED prompt: {prompt_txt}")


def generate_scene(scene_id: str) -> bool:
    cfg = SCENES[scene_id]
    print(f"\n{'=' * 60}")
    print(f"SCENE {scene_id.upper()} — Seedance 2.0 i2v {cfg['duration']}s")
    print(f"{'=' * 60}")
    try:
        request_id, image_url = submit_scene(scene_id)
        poll_scene(scene_id, request_id)
        download_scene(scene_id, request_id, image_url)
        print(f"\n  DONE : {cfg['output_mp4']}")
        return True
    except Exception as e:
        print(f"\n  EXCEPTION scene {scene_id}: {e}")
        return False


def recover_scene(scene_id: str) -> bool:
    cfg = SCENES[scene_id]
    rid_file = cfg["request_id_file"]
    if not rid_file.exists():
        print(f"ERROR: no request ID file at {rid_file}")
        return False
    lines = rid_file.read_text().splitlines()
    request_id = lines[0].strip()
    image_url = ""
    for line in lines[1:]:
        if line.startswith("# image_url:"):
            image_url = line.split(":", 1)[1].strip()
    print(f"RECOVER scene {scene_id}: request_id = {request_id}")
    try:
        poll_scene(scene_id, request_id)
        download_scene(scene_id, request_id, image_url)
        return True
    except Exception as e:
        print(f"EXCEPTION recover {scene_id}: {e}")
        return False


# =============================================================================
# MAIN
# =============================================================================

ORDER = ["4b", "5a", "6", "3b"]


def main():
    parser = argparse.ArgumentParser(description="Seedance Thiaroye scenes 4B/5A/6/3B")
    parser.add_argument("--scene", choices=["4b", "5a", "6", "3b"], help="Run only this scene")
    parser.add_argument("--recover", action="store_true", help="Recover mode: poll existing request_id")
    args = parser.parse_args()

    scenes_to_run = [args.scene] if args.scene else ORDER

    total_cost = sum(SCENES[s]["cost_usd"] for s in scenes_to_run)
    print(f"\nThiaroye V5 — Seedance batch : {', '.join(s.upper() for s in scenes_to_run)}")
    print(f"Total estimated cost: ${total_cost:.2f}")
    print()

    results = {}
    for scene_id in scenes_to_run:
        if args.recover:
            ok = recover_scene(scene_id)
        else:
            ok = generate_scene(scene_id)
        results[scene_id] = ok
        if not ok:
            print(f"\nFAILED: {scene_id} — stopping batch to avoid further spend.")
            break

    print(f"\n{'=' * 60}")
    print("BATCH SUMMARY")
    print(f"{'=' * 60}")
    for sid, ok in results.items():
        status = "OK" if ok else "FAIL"
        print(f"  {sid.upper()} : {status} -> {SCENES[sid]['output_mp4']}")

    success_count = sum(1 for v in results.values() if v)
    total_run = len(results)
    print(f"\nResult: {success_count}/{total_run} clips generated")

    return 0 if success_count == total_run else 1


if __name__ == "__main__":
    sys.exit(main())
