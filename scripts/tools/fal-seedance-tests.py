"""
Seedance 2.0 API Tests via fal.ai — 4 tests strategiques
Objectif : valider chaining, multi-ref production, et lip sync longue duree.

Usage :
  python scripts/tools/fal-seedance-tests.py --test 1      # un seul test
  python scripts/tools/fal-seedance-tests.py --test 1,2    # tests specifiques
  python scripts/tools/fal-seedance-tests.py --all          # les 4 tests
  python scripts/tools/fal-seedance-tests.py --dry-run      # affiche les params sans generer
  python scripts/tools/fal-seedance-tests.py --list         # liste les tests

Cout estime : ~$12-15 pour les 4 tests (720p, 10s chacun)
"""

import argparse
import json
import os
import pathlib
import sys
import time
import urllib.request

import fal_client
from dotenv import load_dotenv

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
load_dotenv(ROOT / ".env")

OUTPUT_DIR = ROOT / "tmp" / "fal-seedance-tests"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

CLIP_SOUNDJATA = ROOT / "public" / "assets" / "library" / "geoafrique" / "heros-oublies" / "soundjata-iron-bar-v1.mp4"
REF_SOUNDJATA_STYLEREF = ROOT / "tmp" / "heros-oublies-styleref" / "soundjata-iron-bar-styleref-v2.png"
REF_LATDIOR_SHEET = ROOT / "tmp" / "yaroflasher-test" / "ref1-latdior-historical-sheet.png"
REF_LATDIOR_SAVANNA = ROOT / "tmp" / "yaroflasher-test" / "ref2-location-savanna.png"
REF_LATDIOR_FRENCH = ROOT / "tmp" / "yaroflasher-test" / "ref3-french-soldiers-v3.png"
REF_LATDIOR_INKWASH = ROOT / "tmp" / "lat-dior-battle" / "ref-31-inkwash-v4.png"


def upload(path):
    """Upload a local file to fal.ai CDN and return the URL."""
    p = pathlib.Path(path)
    if not p.exists():
        print(f"  [SKIP] File not found: {p}")
        return None
    print(f"  Uploading {p.name} ({p.stat().st_size // 1024}KB)...")
    url = fal_client.upload_file(str(p))
    print(f"  -> {url[:80]}...")
    return url


def extract_last_seconds(video_path, seconds=4):
    """Extract last N seconds of a video using ffmpeg. Returns path to trimmed clip."""
    import subprocess

    out_path = OUTPUT_DIR / f"tail-{seconds}s-{pathlib.Path(video_path).stem}.mp4"
    if out_path.exists():
        print(f"  [CACHE] {out_path.name} already exists, reusing")
        return out_path

    probe = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", video_path],
        capture_output=True, text=True
    )
    duration = float(json.loads(probe.stdout)["format"]["duration"])
    start = max(0, duration - seconds)

    print(f"  Extracting last {seconds}s from {pathlib.Path(video_path).name} (total={duration:.1f}s, start={start:.1f}s)...")
    subprocess.run(
        ["ffmpeg", "-y", "-ss", str(start), "-i", str(video_path),
         "-t", str(seconds), "-c", "copy", str(out_path)],
        capture_output=True
    )
    print(f"  -> {out_path.name}")
    return out_path


# ---------------------------------------------------------------------------
# Test definitions
# ---------------------------------------------------------------------------

TESTS = {
    1: {
        "name": "Chaining clip A -> clip B (Soundjata barre de fer -> exil)",
        "description": (
            "Utilise les 4 dernieres secondes du clip Soundjata (barre de fer) "
            "comme video ref + la styleref comme image ref + prompt pour la scene SUIVANTE "
            "(exil a Mema). Teste si Seedance maintient le style/personnage entre clips."
        ),
        "endpoint": "bytedance/seedance-2.0/reference-to-video",
        "build_args": lambda urls: {
            "prompt": (
                "@Image1 is the visual style reference. @Video1 is the previous scene.\n\n"
                "2D flat illustration style, bold outlines, warm African palette.\n\n"
                "SECONDS 0 TO 3: Wide shot — young Soundjata walks alone on a dusty savanna trail, "
                "small bundle on his back. His mother Sogolon walks behind him, hunched with fatigue. "
                "Camera PULLS BACK slowly revealing the vast empty landscape ahead. "
                "Golden dust rises from their footsteps.\n\n"
                "SECONDS 3 TO 6: Medium shot — Soundjata turns his head LEFT, looking back one last time "
                "at the distant village of Niani disappearing behind baobab trees. "
                "His jaw is set, determined. Wind SWEEPS his robe. "
                "Camera DOLLIES alongside him at walking pace.\n\n"
                "SECONDS 6 TO 10: Wide aerial shot — the two figures become small silhouettes "
                "crossing a golden plain toward distant mountains of Mema. "
                "Flocks of birds BURST from tall grass as they pass. "
                "Camera RISES slowly to reveal the scale of the journey ahead.\n\n"
                "COLOR GRADE: burnt gold, warm ochre, deep indigo sky, dusty amber.\n"
                "No text, no banners, no writing visible anywhere. No words, no music."
            ),
            "image_urls": [urls["styleref"]],
            "video_urls": [urls["video_tail"]],
            "duration": "10",
            "aspect_ratio": "9:16",
            "resolution": "720p",
            "generate_audio": False,
        },
        "files_needed": {
            "video_source": CLIP_SOUNDJATA,
            "styleref": REF_SOUNDJATA_STYLEREF,
        },
        "cost_estimate": "$1.81 (10s x $0.18/s avec video ref)",
    },

    2: {
        "name": "Chaining clip B -> clip C (exil -> retour Kirina)",
        "description": (
            "Utilise les 4 dernieres secondes du resultat du Test 1 comme video ref "
            "+ la styleref + prompt pour la bataille de Kirina. "
            "Mesure le style drift apres 2 chainings consecutifs."
        ),
        "endpoint": "bytedance/seedance-2.0/reference-to-video",
        "build_args": lambda urls: {
            "prompt": (
                "@Image1 is the visual style reference. @Video1 is the previous scene.\n\n"
                "2D flat illustration style, bold outlines, warm African palette.\n\n"
                "SECONDS 0 TO 3: Medium shot — adult Soundjata in full warrior armor rides a dark horse, "
                "leading a column of Mandinka cavalry. Dust ERUPTS behind them. "
                "His face is fierce, eyes locked forward. "
                "Camera TRACKS alongside the galloping horses.\n\n"
                "SECONDS 3 TO 6: SNAP ZOOM to Soundjata's hand — he raises a spear tipped with "
                "a rooster's spur. The golden metal CATCHES contrasting light against storm clouds. "
                "Camera WHIPS UP to his determined face. Warriors behind him ROAR silently.\n\n"
                "SECONDS 6 TO 10: Wide aerial shot — two massive armies CLASH on the plains of Kirina. "
                "Soundjata's golden cavalry SURGES into a dark mass of Soumaoro's forces. "
                "Dust clouds BILLOW. Camera SWEEPS in a wide orbital arc above the battlefield. "
                "The scale is epic — hundreds of warriors.\n\n"
                "COLOR GRADE: storm grey vs. molten gold, deep red earth, indigo shadows.\n"
                "No text, no banners, no writing visible anywhere. No words, no music."
            ),
            "image_urls": [urls["styleref"]],
            "video_urls": [urls["video_tail"]],
            "duration": "10",
            "aspect_ratio": "9:16",
            "resolution": "720p",
            "generate_audio": False,
        },
        "files_needed": {
            "video_source": "__TEST_1_OUTPUT__",
            "styleref": REF_SOUNDJATA_STYLEREF,
        },
        "depends_on": 1,
        "cost_estimate": "$1.81 (10s x $0.18/s avec video ref)",
    },

    3: {
        "name": "Multi-ref production (Lat Dior — 3 refs Gemini existantes)",
        "description": (
            "Teste le mode reference-to-video avec 3 images de reference (character sheet + "
            "decor savane + soldats francais) + prompt Format 3 SECONDS pour un vrai beat "
            "du script Lat Dior. Compare avec le resultat Dreamina web (9.5/10)."
        ),
        "endpoint": "bytedance/seedance-2.0/reference-to-video",
        "build_args": lambda urls: {
            "prompt": (
                "@Image1 is Lat Dior Diop, Damel of Cayor — tall Wolof warrior with traditional turban, "
                "embroidered grand boubou, gris-gris amulets, tiedo earrings. "
                "@Image2 is the West African savanna battlefield. "
                "@Image3 shows the opposing French colonial soldiers.\n\n"
                "2D flat illustration style, bold outlines, ink-wash textures for battle scenes.\n\n"
                "SECONDS 0 TO 3: Wide aerial shot — Lat Dior on horseback at the front of a V-formation "
                "of Wolof cavalry. He RAISES his sword above his turban. "
                "The cavalry SURGES forward across golden savanna. "
                "Dust ERUPTS in massive clouds behind them. Camera SWEEPS in a wide arc.\n\n"
                "SECONDS 3 TO 6: Medium tracking shot — Lat Dior CHARGES directly at camera, "
                "his horse's hooves POUND the red earth. His boubou BILLOWS behind him. "
                "Warriors flanking him brandish spears and shields. "
                "Camera PULLS BACK as the charge approaches.\n\n"
                "SECONDS 6 TO 10: Close-up to wide — Lat Dior's sword SLASHES downward, "
                "camera SNAPS to wide aerial — the two armies COLLIDE in a storm of dust and steel. "
                "Wolof yellow-gold cavalry CRASHES into French grey-blue infantry lines. "
                "The battle of Dekheule, 1886. Camera RISES above the chaos.\n\n"
                "COLOR GRADE: golden ochre, blood red earth, storm grey enemies, indigo shadows.\n"
                "No text, no banners, no writing visible anywhere. No words, no music."
            ),
            "image_urls": [urls["character"], urls["location"], urls["soldiers"]],
            "duration": "10",
            "aspect_ratio": "9:16",
            "resolution": "720p",
            "generate_audio": False,
        },
        "files_needed": {
            "character": REF_LATDIOR_SHEET,
            "location": REF_LATDIOR_SAVANNA,
            "soldiers": REF_LATDIOR_FRENCH,
        },
        "cost_estimate": "$3.02 (10s x $0.30/s sans video ref)",
    },

    4: {
        "name": "Lip sync francais — narration longue 10s (Soundjata)",
        "description": (
            "Teste le lip sync Audio-Guided avec un passage narratif francais de 10s. "
            "Le test precedent etait une phrase courte. On veut savoir si ca tient "
            "sur un beat complet. Utilise la styleref + prompt avec dialogue inline."
        ),
        "endpoint": "bytedance/seedance-2.0/reference-to-video",
        "build_args": lambda urls: {
            "prompt": (
                "@Image1 is the visual style reference. 2D flat illustration style.\n\n"
                "A wise elderly griot sits cross-legged by a fire at night in a Malian village. "
                "He wears a traditional boubou with intricate patterns. "
                "His weathered face is illuminated by warm firelight.\n\n"
                "SECONDS 0 TO 3: Medium close-up — the griot looks directly into camera. "
                "He speaks with gentle authority:\n"
                "\"Aujourd'hui encore, les griots du Mali chantent son nom.\"\n"
                "His hands gesture slowly as he speaks. Firelight flickers on his face.\n\n"
                "SECONDS 3 TO 7: Same shot, slightly closer — he leans forward:\n"
                "\"Pas dans les livres. De bouche a oreille, de pere en fils, "
                "depuis huit siecles.\"\n"
                "His eyes glisten with pride. Sparks RISE slowly from the fire behind him.\n\n"
                "SECONDS 7 TO 10: Wide shot pulling back — the griot is surrounded by "
                "a circle of children and young adults listening intently in the firelight. "
                "Camera PULLS BACK revealing the vast starry Sahel sky above.\n\n"
                "COLOR GRADE: deep amber firelight, indigo night sky, warm skin tones.\n"
                "No text, no banners, no writing visible anywhere."
            ),
            "image_urls": [urls["styleref"]],
            "duration": "10",
            "aspect_ratio": "9:16",
            "resolution": "720p",
            "generate_audio": True,
        },
        "files_needed": {
            "styleref": REF_SOUNDJATA_STYLEREF,
        },
        "cost_estimate": "$3.02 (10s x $0.30/s sans video ref, avec audio)",
    },
}


def check_files(test_config):
    """Verify all needed files exist. Returns dict of key -> path."""
    files = test_config["files_needed"]
    missing = []
    for key, path in files.items():
        if str(path) == "__TEST_1_OUTPUT__":
            continue
        if not pathlib.Path(path).exists():
            missing.append(f"  {key}: {path}")
    return missing


def run_test(test_id, dry_run=False, prev_output=None):
    """Run a single test. Returns output path or None."""
    config = TESTS[test_id]
    print(f"\n{'='*60}")
    print(f"TEST {test_id}: {config['name']}")
    print(f"{'='*60}")
    print(f"Description: {config['description']}")
    print(f"Cout estime: {config['cost_estimate']}")
    print(f"Endpoint: {config['endpoint']}")
    print()

    # Check dependencies
    if config.get("depends_on") and not prev_output:
        print(f"  [SKIP] Test {test_id} depends on Test {config['depends_on']} output")
        print(f"  Run Test {config['depends_on']} first, then run: --test {test_id}")
        return None

    # Check files
    missing = check_files(config)
    if missing:
        print(f"  [ERROR] Missing files:")
        for m in missing:
            print(f"    {m}")
        return None

    # Prepare files
    files = config["files_needed"]
    urls = {}

    for key, path in files.items():
        if str(path) == "__TEST_1_OUTPUT__":
            if prev_output:
                tail = extract_last_seconds(prev_output, seconds=4)
                if dry_run:
                    urls[f"video_tail"] = f"[would upload {tail}]"
                else:
                    urls["video_tail"] = upload(tail)
            continue

        p = pathlib.Path(path)

        # If it is a video source, extract tail
        if p.suffix == ".mp4":
            tail = extract_last_seconds(p, seconds=4)
            if dry_run:
                urls["video_tail"] = f"[would upload {tail}]"
            else:
                urls["video_tail"] = upload(tail)
        else:
            if dry_run:
                urls[key] = f"[would upload {p.name}]"
            else:
                urls[key] = upload(p)

    # Build arguments
    args = config["build_args"](urls)

    if dry_run:
        print("\n  [DRY RUN] Arguments:")
        safe_args = {k: v for k, v in args.items()}
        print(json.dumps(safe_args, indent=2, ensure_ascii=False))
        return "DRY_RUN"

    # Submit
    print(f"\n  Submitting to {config['endpoint']}...")
    handler = fal_client.submit(config["endpoint"], arguments=args)
    request_id = handler.request_id
    print(f"  Request ID: {request_id}")

    # Poll
    print(f"  Waiting for generation...")
    max_wait = 600
    interval = 15
    elapsed = 0

    while elapsed < max_wait:
        try:
            status = fal_client.status(config["endpoint"], request_id, with_logs=False)
            status_type = type(status).__name__
            print(f"  [{elapsed}s] Status: {status_type}")

            if status_type == "Completed":
                result = fal_client.result(config["endpoint"], request_id)
                video_url = result["video"]["url"]
                seed = result.get("seed", "unknown")
                out_path = OUTPUT_DIR / f"test{test_id}-{test_id_to_slug(test_id)}.mp4"
                print(f"  Downloading...")
                urllib.request.urlretrieve(video_url, out_path)
                file_size = out_path.stat().st_size / (1024 * 1024)
                print(f"  Saved: {out_path} ({file_size:.1f}MB)")
                print(f"  Seed: {seed}")
                print(f"  CDN URL: {video_url}")
                return str(out_path)

            if status_type == "Failed":
                print(f"  [FAILED] Generation failed")
                if hasattr(status, "error"):
                    print(f"  Error: {status.error}")
                return None

        except Exception as e:
            print(f"  [ERROR] Poll error: {e}")

        time.sleep(interval)
        elapsed += interval

    print(f"  [TIMEOUT] after {max_wait}s")
    return None


def test_id_to_slug(test_id):
    slugs = {
        1: "chaining-A-to-B",
        2: "chaining-B-to-C",
        3: "multiref-latdior",
        4: "lipsync-griot",
    }
    return slugs.get(test_id, f"test{test_id}")


def list_tests():
    print("\n=== Tests disponibles ===\n")
    for tid, config in TESTS.items():
        deps = f" (depends on Test {config['depends_on']})" if config.get("depends_on") else ""
        print(f"  Test {tid}: {config['name']}{deps}")
        print(f"           {config['cost_estimate']}")
        missing = check_files(config)
        if missing:
            print(f"           [!] Missing files: {len(missing)}")
        else:
            print(f"           [OK] All files present")
        print()


def main():
    parser = argparse.ArgumentParser(description="Seedance 2.0 API tests via fal.ai")
    parser.add_argument("--test", type=str, help="Test ID(s) to run (e.g. 1 or 1,2)")
    parser.add_argument("--all", action="store_true", help="Run all 4 tests")
    parser.add_argument("--dry-run", action="store_true", help="Show params without generating")
    parser.add_argument("--list", action="store_true", help="List available tests")
    args = parser.parse_args()

    if args.list:
        list_tests()
        return

    if not args.test and not args.all:
        parser.print_help()
        return

    test_ids = []
    if args.all:
        test_ids = [1, 2, 3, 4]
    else:
        test_ids = [int(x.strip()) for x in args.test.split(",")]

    print("=== Seedance 2.0 API Tests ===")
    print(f"Tests: {test_ids}")
    print(f"Mode: {'DRY RUN' if args.dry_run else 'LIVE'}")
    print(f"Output: {OUTPUT_DIR}")

    results = {}
    for tid in test_ids:
        if tid not in TESTS:
            print(f"\n[ERROR] Test {tid} does not exist")
            continue

        prev_output = results.get(TESTS[tid].get("depends_on"))
        result = run_test(tid, dry_run=args.dry_run, prev_output=prev_output)
        results[tid] = result

    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    for tid in test_ids:
        result = results.get(tid)
        status = "OK" if result else "FAILED/SKIPPED"
        print(f"  Test {tid}: {status} — {TESTS[tid]['name']}")
        if result and result != "DRY_RUN":
            print(f"           Output: {result}")

    print(f"\nOutput directory: {OUTPUT_DIR.resolve()}")


if __name__ == "__main__":
    main()
