# SEEDANCE LAUNCH — Méthode d'exécution (NON-NÉGOCIABLE)

> Mis à jour : 2026-04-26
> **NE PAS tenter d'appeler Seedance via un outil MCP ou une fonction inexistante.**
> La seule méthode valide est : écrire un script Python + l'exécuter via Bash.

---

## Méthode obligatoire

1. **Copier le template ci-dessous**
2. **Remplacer les 5 variables** : SOURCE_IMAGE, OUTPUT_MP4, OUTPUT_META, REQUEST_ID_FILE, PROMPT, duration, cost_usd_estimate
3. **Écrire le script dans** `scripts/tools/seedance-{projet}-{scene}.py`
4. **Exécuter** : `python -u scripts/tools/seedance-{projet}-{scene}.py`
5. **Si timeout / coupure** : relancer avec `--recover` (lit le request_id sauvegardé)

---

## Template Python (copier-coller, ne pas réécrire from scratch)

```python
"""Projet — Scene X — Seedance 2.0 image-to-video.
Duration : Xs  |  Cost est : $X.XX  |  Audio : True/False
"""

import os, sys, json, time
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

FAL_KEY = os.environ.get("FAL_KEY", "")
if not FAL_KEY:
    print("ERROR: FAL_KEY not set"); sys.exit(1)

import fal_client

REPO = Path("/Users/clawdbot/Workspace/remotion")

SOURCE_IMAGE    = REPO / "public/assets/PROJET/scenes/SCENE-IMAGE.png"
OUTPUT_DIR      = REPO / "public/assets/PROJET/clips"
OUTPUT_MP4      = OUTPUT_DIR / "SCENE-v1.mp4"
OUTPUT_META     = OUTPUT_DIR / "SCENE-v1.meta.json"
REQUEST_ID_FILE = OUTPUT_DIR / "SCENE-v1.request-id.txt"

ENDPOINT = "bytedance/seedance-2.0/image-to-video"
# V1 Pro (moins cher, pas d'audio) : "bytedance/seedance/v1/pro/image-to-video"

DURATION        = "10"   # "5", "6", "7", "8", "9", "10" (paliers entiers)
GENERATE_AUDIO  = True   # False pour V1 Pro ou scènes sans SFX
COST_ESTIMATE   = 3.00   # DURATION_s * $0.30 (V2) ou $0.18 (V1 Pro)

PROMPT = """...votre prompt ici..."""


def submit_and_save_request_id():
    print("[1/4] Verifying source image...")
    if not SOURCE_IMAGE.exists():
        print(f"  MISSING: {SOURCE_IMAGE}"); sys.exit(1)
    print(f"  OK ({SOURCE_IMAGE.stat().st_size // 1024} KB) {SOURCE_IMAGE.name}")

    print("[2/4] Uploading to fal.ai CDN...")
    image_url = fal_client.upload_file(str(SOURCE_IMAGE))
    print(f"  -> {image_url}")

    print("[3/4] Submitting...")
    args = {
        "prompt": PROMPT,
        "image_url": image_url,
        "duration": DURATION,
        "aspect_ratio": "9:16",
        "resolution": "1080p",
        "generate_audio": GENERATE_AUDIO,
    }
    handler = fal_client.submit(ENDPOINT, arguments=args)
    request_id = handler.request_id
    print(f"  Request ID: {request_id}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    REQUEST_ID_FILE.write_text(
        f"{request_id}\n# endpoint: {ENDPOINT}\n# image_url: {image_url}\n"
        f"# saved_at: {time.strftime('%Y-%m-%d %H:%M:%S')}\n"
    )
    return request_id, image_url


def poll_until_complete(request_id):
    print("  Polling...")
    start, last_log = time.time(), ""
    while True:
        status = fal_client.status(ENDPOINT, request_id, with_logs=False)
        elapsed = int(time.time() - start)
        s = type(status).__name__
        if s != last_log:
            print(f"    [{elapsed}s] {s}"); last_log = s
        if s == "Completed": break
        if elapsed > 600: print("  TIMEOUT — use --recover"); sys.exit(1)
        time.sleep(5)


def download_and_save(request_id, image_url):
    result = fal_client.result(ENDPOINT, request_id)
    print("[4/4] Downloading...")
    video_url = result["video"]["url"]
    seed = result.get("seed")
    file_size = result["video"].get("file_size")
    print(f"  URL: {video_url}  |  Seed: {seed}")
    if file_size: print(f"  Size: {file_size/1024/1024:.1f} MB")

    import urllib.request
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(video_url, OUTPUT_MP4)
    print(f"  SAVED: {OUTPUT_MP4}")

    OUTPUT_META.write_text(json.dumps({
        "request_id": request_id, "endpoint": ENDPOINT,
        "duration_s": int(DURATION), "generate_audio": GENERATE_AUDIO,
        "seed": seed, "video_url": video_url, "file_size": file_size,
        "source_image": SOURCE_IMAGE.name, "source_image_url": image_url,
        "prompt": PROMPT, "cost_usd_estimate": COST_ESTIMATE,
    }, indent=2))


def recover():
    if not REQUEST_ID_FILE.exists():
        print(f"ERROR: {REQUEST_ID_FILE} not found"); sys.exit(1)
    lines = REQUEST_ID_FILE.read_text().splitlines()
    rid = lines[0].strip()
    url = next((l.split(":",1)[1].strip() for l in lines[1:] if l.startswith("# image_url:")), "")
    print(f"RECOVER: {rid}")
    poll_until_complete(rid)
    download_and_save(rid, url)


def main():
    print("=" * 60)
    if "--recover" in sys.argv:
        recover()
    else:
        rid, url = submit_and_save_request_id()
        poll_until_complete(rid)
        download_and_save(rid, url)
    print(f"\nDONE — {OUTPUT_MP4}")
    print("=" * 60)

if __name__ == "__main__":
    main()
```

---

## Paramètres clés

| Param | Valeurs valides | Note |
|-------|----------------|------|
| `duration` | `"5"` à `"10"` (entiers) | Paliers 1s — pas de `"7.5"` |
| `aspect_ratio` | `"9:16"` | Toujours pour Shorts |
| `resolution` | `"1080p"` | Toujours (pas `"720p"`) sauf test |
| `generate_audio` | `True` / `False` | True = V2 obligatoire |
| endpoint V2 | `bytedance/seedance-2.0/image-to-video` | $0.30/s, audio |
| endpoint V1 Pro | `bytedance/seedance/v1/pro/image-to-video` | $0.18/s, pas d'audio |

## Coût réel observé (2026-04-26 — fal.ai dashboard)
**ANCIEN pricing $0.30/s = FAUX. Pricing réel ~$0.683/s (V2).**

| Durée | Coût réel V2 | Ancien estimé (faux) |
|-------|-------------|----------------------|
| 10s   | ~$6.83      | $3.00 |
| 9s    | ~$6.15      | $2.70 |
| 7s    | ~$4.78      | $2.10 |
| 6s    | ~$4.10      | $1.80 |
| 5s    | ~$3.42      | $1.50 |

- V1 Pro : pricing non re-vérifié — estimer ~2× moins cher que V2 (~$0.34/s)
- Video Extend : même endpoint, `video_url` au lieu de `image_url`
- Content policy violation audio = $0.00 facturé (confirmé 2026-04-26)

---

## Règle absolue : une seule génération à la fois
- Ne pas lancer 2 scripts en parallèle sans validation Aziz entre les deux
- Après chaque clip : extraire des frames + review visuelle AVANT de présenter à Aziz
- Claude principal valide → puis seulement lancer le suivant

## Review visuelle obligatoire après chaque clip (NON-NÉGOCIABLE)
Après download du MP4, TOUJOURS extraire des frames avec ffmpeg avant de présenter :
```bash
ffmpeg -i public/assets/PROJET/clips/SCENE-v1.mp4 \
  -vf "select='eq(n,0)+eq(n,89)+eq(n,179)+eq(n,269)'" \
  -vsync vfr /tmp/review-SCENE-%03d.png
```
(frames 0, 89, 179, 269 = début / 3s / 6s / 9s pour un clip 10s@30fps)

Puis Read chaque frame PNG et analyser :
- Style drift ? (paper-craft tenu ou dérive réaliste ?)
- Dot-eyes maintenus ?
- Direction personnage correcte ?
- Artefacts visibles (morphing, texte parasite, clones) ?
- R-NO-PARTICLES respecté ?

Formuler un avis clair AVANT de présenter à Aziz.
