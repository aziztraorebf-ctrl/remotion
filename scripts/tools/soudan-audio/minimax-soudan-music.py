"""Minimax Music 2.6 - musique mid-form Soudan (2 variantes A/B).

Ton : thriller geopolitique documentaire minimaliste, registre "renseignement/enquete".
Ecrit dans le repo PRINCIPAL (public partage) pour etre accessible worktree + assemblage.
"""
import os
import sys
import time
import urllib.request
from pathlib import Path

import fal_client
from dotenv import load_dotenv

# repo principal (pas le worktree) pour l'ecriture des assets audio
MAIN = Path("/Users/clawdbot/Workspace/remotion")
load_dotenv(MAIN / ".env")

if not os.environ.get("FAL_KEY"):
    print("[ERROR] FAL_KEY missing", file=sys.stderr)
    sys.exit(1)

OUT_DIR = MAIN / "public" / "_shared" / "audio" / "soudan" / "music"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Retour Aziz : direction KORA + DUNDUN retenue (variante B v1), mais PLUS DOUCE, moins agressive.
# 3 nuances autour de ce coeur : dundun feutre (pas martele), kora plus presente/melodique, tempo
# un peu plus lent, atmosphere posee/digne plutot que menacante. MEME famille (no synth, organique).
VARIANTS = {
    "soudan-music-D-kora-douce": (
        "Warm contemporary African documentary score. Gentle traditional kora melody over "
        "soft, deep dundun drums played lightly. Style of Toumani Diabate film score. "
        "Slow, calm 60 BPM. Tender, dignified, contemplative, with quiet underlying gravity. "
        "No synthesizers, no hi-hats, no electronic elements, not aggressive."
    ),
    "soudan-music-E-kora-melodique": (
        "Melodic African documentary score. Flowing kora phrases carrying the melody over "
        "soft muted dundun heartbeat and warm acoustic bass. Style of Ballake Sissoko meets "
        "a gentle film score. Slow 62 BPM. Graceful, warm, reflective, sorrowful but soft. "
        "No synthesizers, no electronic beats, no orchestral strings."
    ),
    "soudan-music-F-kora-ample": (
        "Spacious contemporary African score. Sparse kora notes with generous space, over a "
        "slow, soft dundun pulse and deep warm bass. Style of Toumani Diabate, meditative and "
        "unhurried. Slow 58 BPM. Calm, dignified, breathing, quietly emotional. "
        "No synthesizers, no hi-hats, no electronic elements, gentle throughout."
    ),
}


def log(msg: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def main() -> int:
    log("=== Minimax Music 2.6 - Soudan mid-form (2 variantes) ===")
    t0 = time.time()
    handles = {}
    for name, prompt in VARIANTS.items():
        log(f"submit {name} ({len(prompt)} chars)")
        handles[name] = fal_client.submit(
            "fal-ai/minimax-music/v2.6",
            arguments={"prompt": prompt, "is_instrumental": True},
        )
        log(f"  request_id = {handles[name].request_id}")

    completed = []
    for name, handle in handles.items():
        log(f"waiting {name}...")
        result = handle.get()
        audio = result.get("audio") if isinstance(result, dict) else None
        if not audio or not audio.get("url"):
            log(f"[ERROR] {name}: no audio.url: {result}")
            continue
        out = OUT_DIR / f"{name}.mp3"
        urllib.request.urlretrieve(audio["url"], out)
        import subprocess
        probe = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(out)],
            capture_output=True, text=True,
        )
        dur = float(probe.stdout.strip()) if probe.returncode == 0 else -1.0
        log(f"saved {name}.mp3 ({out.stat().st_size/1024/1024:.2f} MB, {dur:.0f}s)")
        completed.append((name, dur, out))

    log("=== RESULTATS ===")
    for name, dur, out in completed:
        log(f"  {name}: {dur:.0f}s -> {out}")
    log(f"Total elapsed: {time.time()-t0:.1f}s")
    return 0 if completed else 1


if __name__ == "__main__":
    sys.exit(main())
