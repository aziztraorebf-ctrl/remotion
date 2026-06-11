"""Pipeline VOIX VIVANTE industrialise (valide Aziz 2026-06-10).

Resout la MONOTONIE de GeoAfrique : texte tagge V3 -> Oceane V3 FR -> Speech-to-Speech GeoAfrique.
L'intention emotionnelle des tags V3 se transmet au timbre de marque par conversion STS.
Doctrine : memory/tools/PIPELINE-VOIX-VIVANTE-VALIDE.md

PIPELINE (par segment) :
  1. TTS V3 : texte tagge -> Oceane V3 (eleven_v3)               [cout : 1 credit / caractere]
  2. STS    : audio Oceane -> GeoAfrique (eleven_multilingual_sts_v2)  [cout : 1000 credits / minute]
  3. concat ffmpeg des segments -> mp3 final

USAGE :
  python3 scripts/generate-narration-expressive.py --text-file <txt> --out <mp3> [--sample] [--dry-run]
  python3 scripts/generate-narration-expressive.py --text "..." --out <mp3>

  --dry-run : estime le cout (caracteres + minutes approx) SANS appel API. A LANCER EN PREMIER.
  --sample  : ne traite que le 1er segment (echantillon de validation, cout minimal).

DECOUPE : ElevenLabs limite ~5000 char/appel. On coupe sur un [pause] ou fin de paragraphe, jamais en
plein milieu d'une phrase. Reglages = doctrine PIPELINE-VOIX-VIVANTE-VALIDE.md.

Tags V3 pour narration analyste (registre documentaire) : [solemn] [serious] [reflective] [deliberate]
[slows down] [pause] [tense] [calm] [dramatic tone]. EVITER rires/soupirs/SFX (hors registre).
"""
import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing dans .env")
    sys.exit(1)

# --- Voix (doctrine) ---
VOICE_V3_OCEANE = "CqTrL0ThT2GJVJEIiLcY"   # source expressive V3 FR
VOICE_GEOAFRIQUE = "z3gESu49naEZW8Af2Upm"  # cible STS (timbre de marque)

MODEL_V3 = "eleven_v3"
MODEL_STS = "eleven_multilingual_sts_v2"

# Reglages doctrine
V3_SETTINGS = {"stability": 0.30, "similarity_boost": 0.75, "style": 0.0, "speed": 1.0}
# stability 0.45 valide Aziz 2026-06-10 : 0.30 bavait sur certaines voyelles (artefact "epreuve").
# 0.45 corrige la prononciation SANS perdre l'expressivite transmise par les tags V3. Defaut serie.
STS_SETTINGS = {"stability": 0.45, "similarity_boost": 0.80, "style": 0.0}

MAX_CHARS = 4800  # marge sous la limite 5000
WPM_APPROX = 150  # mots/min FR narration posee -> pour estimer la duree (cout STS)

TAG_RE = re.compile(r"\[[^\]]+\]")


def count_billable_chars(text: str) -> int:
    """Caracteres factures par la TTS. Les tags [..] comptent aussi (ils sont dans le texte envoye)."""
    return len(text)


def estimate_minutes(text: str) -> float:
    """Duree approx de l'audio -> base du cout STS (1000 credits/min). Mots hors tags."""
    words = len(TAG_RE.sub(" ", text).split())
    return words / WPM_APPROX


PART_RE = re.compile(r"^###\s*PARTIE\s*(.+?)\s*$", re.MULTILINE | re.IGNORECASE)


def split_parts(text: str):
    """Decoupe le texte sur les marqueurs '### PARTIE <n> — <titre>'.
    Retourne [(slug, contenu), ...]. Si aucun marqueur -> [('full', text)].
    REGLE Aziz 2026-06-10 : generer par acte/scene, jamais en bloc (reparation chirurgicale)."""
    matches = list(PART_RE.finditer(text))
    if not matches:
        return [("full", text.strip())]
    parts = []
    for i, m in enumerate(matches):
        label = m.group(1).strip()
        # slug : 1er token (numero) ou label nettoye
        slug = re.sub(r"[^a-zA-Z0-9]+", "-", label.split("—")[0].split("-")[0].strip()).strip("-").lower() or f"p{i+1}"
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        body = text[start:end].strip()
        if body:
            parts.append((f"p{slug}", body))
    return parts


def split_segments(text: str, max_chars: int = MAX_CHARS):
    """Coupe sur double-saut de ligne (paragraphe) sans depasser max_chars. Jamais en plein paragraphe."""
    paras = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    segs, cur = [], ""
    for p in paras:
        candidate = (cur + "\n\n" + p).strip() if cur else p
        if len(candidate) <= max_chars:
            cur = candidate
        else:
            if cur:
                segs.append(cur)
            # paragraphe seul trop long -> coupe sur phrases
            if len(p) > max_chars:
                sentences = re.split(r"(?<=[.!?])\s+", p)
                buf = ""
                for s in sentences:
                    cand = (buf + " " + s).strip() if buf else s
                    if len(cand) <= max_chars:
                        buf = cand
                    else:
                        if buf:
                            segs.append(buf)
                        buf = s
                cur = buf
            else:
                cur = p
    if cur:
        segs.append(cur)
    return segs


def tts_v3(text: str, dest: Path) -> bool:
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_V3_OCEANE}",
        json={"text": text, "model_id": MODEL_V3, "voice_settings": V3_SETTINGS,
              "output_format": "mp3_44100_128"},
        headers={"xi-api-key": API_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"},
        timeout=180,
    )
    if r.status_code != 200:
        print(f"  TTS V3 ERR {r.status_code}: {r.text[:250]}")
        return False
    dest.write_bytes(r.content)
    cost = r.headers.get("x-character-count", "?")
    print(f"  TTS V3 OK ({len(r.content)/1024:.0f}KB, {cost} credits)")
    return True


def sts_geoafrique(src: Path, dest: Path) -> bool:
    import json as _json
    with open(src, "rb") as fh:
        r = requests.post(
            f"https://api.elevenlabs.io/v1/speech-to-speech/{VOICE_GEOAFRIQUE}",
            headers={"xi-api-key": API_KEY},
            data={"model_id": MODEL_STS, "output_format": "mp3_44100_128",
                  "voice_settings": _json.dumps(STS_SETTINGS)},
            files={"audio": ("src.mp3", fh, "audio/mpeg")},
            timeout=300,
        )
    if r.status_code != 200:
        print(f"  STS ERR {r.status_code}: {r.text[:250]}")
        return False
    dest.write_bytes(r.content)
    cost = r.headers.get("x-character-count", "?")
    print(f"  STS GeoAfrique OK ({len(r.content)/1024:.0f}KB, {cost} credits)")
    return True


def concat_mp3(parts, out: Path):
    if len(parts) == 1:
        subprocess.run(["cp", str(parts[0]), str(out)], check=True)
        return
    listf = out.with_suffix(".concat.txt")
    # chemins ABSOLUS (ffmpeg resout depuis son cwd, pas depuis la liste)
    listf.write_text("\n".join(f"file '{p.resolve()}'" for p in parts))
    # re-encode (PAS -c copy : headers/bitrates STS varient -> glitch)
    r = subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listf),
         "-c:a", "libmp3lame", "-b:a", "128k", str(out)],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        print(f"  FFMPEG ERR: {r.stderr[-400:]}")
        sys.exit(1)
    listf.unlink(missing_ok=True)


def gen_part(part_text: str, out_part: Path, tmp: Path, prefix: str) -> Path:
    """Genere UNE partie (decoupee en sous-segments si >MAX_CHARS) -> 1 mp3."""
    segs = split_segments(part_text)
    finals = []
    for i, seg in enumerate(segs):
        print(f"  segment {i+1}/{len(segs)} ({len(seg)} chars)")
        v3f = tmp / f"{prefix}_v3_{i:02d}.mp3"
        gaf = tmp / f"{prefix}_geo_{i:02d}.mp3"
        if not tts_v3(seg, v3f):
            print("  ABORT (TTS V3 echec)"); sys.exit(1)
        if not sts_geoafrique(v3f, gaf):
            print("  ABORT (STS echec)"); sys.exit(1)
        finals.append(gaf)
    concat_mp3(finals, out_part)
    return out_part


def catbox(f: Path) -> str:
    return subprocess.run(
        ["curl", "-s", "-F", "reqtype=fileupload", "-F", f"fileToUpload=@{f}",
         "https://catbox.moe/user/api.php"], capture_output=True, text=True).stdout.strip()


def main():
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--text-file", type=Path)
    g.add_argument("--text", type=str)
    ap.add_argument("--out", type=Path, required=True,
                    help="mp3 concat global. Les parties sortent en <out_stem>-<slug>.mp3 a cote.")
    ap.add_argument("--sample", action="store_true", help="1ere partie seulement (validation)")
    ap.add_argument("--only-part", type=str, default=None,
                    help="slug d'UNE partie a (re)generer seule (reparation chirurgicale). Ex: --only-part p3")
    ap.add_argument("--no-concat", action="store_true", help="ne pas assembler le mp3 global")
    ap.add_argument("--dry-run", action="store_true", help="estime le cout sans appel API")
    ap.add_argument("--sts-stability", type=float, default=None,
                    help="override stability STS (defaut serie 0.45)")
    args = ap.parse_args()

    if args.sts_stability is not None:
        STS_SETTINGS["stability"] = args.sts_stability
        print(f"[override] STS stability = {args.sts_stability}")

    text = args.text if args.text else args.text_file.read_text()
    parts = split_parts(text)  # REGLE : par acte/scene
    if args.sample:
        parts = parts[:1]
    if args.only_part:
        parts = [(s, b) for (s, b) in parts if s == args.only_part]
        if not parts:
            print(f"ERREUR : partie '{args.only_part}' introuvable. Slugs dispo : "
                  f"{[s for s,_ in split_parts(text)]}")
            sys.exit(1)

    # estimation
    all_chars = sum(count_billable_chars(b) for _, b in parts)
    all_min = sum(estimate_minutes(b) for _, b in parts)
    sts_credits = round(all_min * 1000)
    print(f"=== ESTIMATION COUT ===")
    print(f"Parties         : {len(parts)} ({', '.join(s for s,_ in parts)})")
    print(f"Caracteres (V3) : {all_chars} credits")
    print(f"Duree approx    : {all_min:.1f} min -> STS {sts_credits} credits")
    print(f"TOTAL ESTIME    : ~{all_chars + sts_credits} credits")

    if args.dry_run:
        print("\n[DRY-RUN] aucun appel API effectue.")
        return

    args.out.parent.mkdir(parents=True, exist_ok=True)
    tmp = args.out.parent / "_expressive_tmp"
    tmp.mkdir(exist_ok=True)
    stem = args.out.with_suffix("")

    part_files = []
    for slug, body in parts:
        out_part = Path(f"{stem}-{slug}.mp3")
        print(f"\n=== PARTIE {slug} ({len(body)} chars) -> {out_part.name} ===")
        gen_part(body, out_part, tmp, prefix=slug)
        print(f"  OK -> {out_part.name}  {catbox(out_part)}")
        part_files.append(out_part)

    if args.no_concat or args.only_part or args.sample:
        print(f"\nOK parties generees : {[p.name for p in part_files]}")
        print("(pas de concat global : mode partie unique / sample / no-concat)")
        return

    concat_mp3(part_files, args.out)
    print(f"\nOK concat global -> {args.out}  {catbox(args.out)}")


if __name__ == "__main__":
    main()
