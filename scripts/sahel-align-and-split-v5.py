"""Forced alignment V5 + decoupe du mp3 par PARTIES (option A : decouper le bloc valide).

1. Lit memory/episodes/warmap-sahel/SCRIPT-V5-TAGGED.txt (marqueurs ### PARTIE + tags [..]).
2. Derive le texte PRONONCE (sans tags ni marqueurs) en gardant la frontiere de chaque partie.
3. Forced alignment ElevenLabs -> word timing JSON (narration-v5-alignment.json).
4. Trouve le timestamp de coupe entre chaque partie (milieu du silence entre dernier mot d'une
   partie et premier mot de la suivante) et decoupe narration-v5-expressive.mp3 en narration-v5-pX.mp3.

REGLE Aziz 2026-06-10 : audio par acte/scene. Ici on PART d'un bloc valide -> on le decoupe proprement
aux vraies frontieres (timestamps alignment), zero credit de regeneration, on garde la prise validee.
"""
import os
import re
import sys
import json
import subprocess
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")
API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing"); sys.exit(1)

AUDIO = ROOT / "public/_shared/audio/sahel-warmap/narration-v5-expressive.mp3"
TAGGED = ROOT / "memory/episodes/warmap-sahel/SCRIPT-V5-TAGGED.txt"
OUT_ALIGN = ROOT / "public/_shared/audio/sahel-warmap/narration-v5-alignment.json"

TAG_RE = re.compile(r"\[[^\]]+\]")
PART_RE = re.compile(r"^###\s*PARTIE\s*(.+?)\s*$", re.MULTILINE | re.IGNORECASE)


def clean(t: str) -> str:
    """Retire tags + normalise espaces (le texte prononce, pour l'alignment)."""
    t = TAG_RE.sub(" ", t)
    return re.sub(r"\s+", " ", t).strip()


def parse_parts():
    """Retourne [(slug, texte_prononce), ...] depuis le fichier tagge."""
    raw = TAGGED.read_text()
    matches = list(PART_RE.finditer(raw))
    parts = []
    for i, m in enumerate(matches):
        label = m.group(1).strip()
        slug = "p" + re.sub(r"[^0-9]", "", label.split("—")[0]) if re.search(r"\d", label.split("—")[0]) else f"p{i}"
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(raw)
        body = clean(raw[start:end])
        if body:
            parts.append((slug, body))
    return parts


def word_count(t: str) -> int:
    return len(t.split())


def main():
    if not AUDIO.exists():
        print(f"ERROR audio manquant: {AUDIO}"); return 2

    parts = parse_parts()
    full_text = " ".join(b for _, b in parts)
    print(f"Parties : {[(s, word_count(b)) for s,b in parts]}")
    print(f"Texte total : {len(full_text)} chars, {word_count(full_text)} mots")

    # 1. Forced alignment sur le bloc complet
    print("\nForced alignment...")
    with open(AUDIO, "rb") as f:
        resp = requests.post(
            "https://api.elevenlabs.io/v1/forced-alignment",
            files={"file": (AUDIO.name, f, "audio/mpeg")},
            data={"text": full_text},
            headers={"xi-api-key": API_KEY}, timeout=300,
        )
    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:400]}"); return 3
    result = resp.json()
    OUT_ALIGN.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    words = result.get("words", [])
    print(f"OK alignment : {len(words)} words, loss={result.get('loss','n/a')} -> {OUT_ALIGN.name}")

    # 2. Frontieres de parties = index cumule de mots
    # L'API forced-alignment insere une entree ' ' (espace) entre chaque mot reel.
    # On ne garde QUE les mots reels pour aligner sur word_count(body).
    seg_words = [w for w in words if w.get("text", "").strip()]
    print(f"  (mots reels apres filtrage espaces : {len(seg_words)})")
    cum = 0
    boundaries = []  # word-index (mots reels) ou commence chaque partie
    for slug, body in parts:
        boundaries.append((cum, slug))
        cum += word_count(body)
    splits = []  # t en secondes
    for bidx in range(1, len(boundaries)):
        widx = boundaries[bidx][0]
        if widx == 0 or widx >= len(seg_words):
            continue
        prev_end = seg_words[widx - 1].get("end")
        next_start = seg_words[widx].get("start")
        if prev_end is None or next_start is None:
            t_cut = next_start or prev_end
        else:
            t_cut = (prev_end + next_start) / 2.0
        splits.append((boundaries[bidx][1], t_cut))

    # 3. Decoupe ffmpeg : segments [0, t1], [t1, t2], ... [tn, fin]
    dur = float(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(AUDIO)],
        capture_output=True, text=True).stdout.strip())
    bounds = [0.0] + [t for _, t in splits] + [dur]
    slugs = [parts[0][0]] + [s for s, _ in splits]
    print(f"\nFrontieres (s) : {[round(b,2) for b in bounds]}")
    print(f"Slugs          : {slugs}")

    outdir = AUDIO.parent
    made = []
    for i, slug in enumerate(slugs):
        start, end = bounds[i], bounds[i + 1]
        out = outdir / f"narration-v5-{slug}.mp3"
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(AUDIO), "-ss", f"{start:.3f}", "-to", f"{end:.3f}",
             "-c:a", "libmp3lame", "-b:a", "128k", str(out)],
            capture_output=True, check=True)
        d = end - start
        print(f"  {out.name}  [{start:.2f} -> {end:.2f}]  {d:.1f}s")
        made.append(out)

    print(f"\nOK {len(made)} parties decoupees. Alignment global : {OUT_ALIGN.name}")
    print("(les triggers de beats se calent sur les timestamps de narration-v5-alignment.json)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
