#!/usr/bin/env python3
"""
forced-align.py — timestamps mot-par-mot d'une VO, et les FRAMES des reperes narratifs.

Sert a caler un bloc de timings Remotion sur la voix reelle au lieu d'une estimation.
Une duree estimee "au nombre de mots" se trompe facilement de 20% (verifie 2026-07-24 sur les
beats CFA 5a/5b : 28s estimees pour 22.9s reelles) — et un geste visuel qui rate son mot se voit.

MOTEUR = API forced-alignment ElevenLabs. C'est le FALLBACK documente quand Whisper/OpenAI est
indisponible (quota 429), mais il est ici le defaut : il prend le texte ATTENDU en entree, donc
il ne peut pas mal transcrire un nom propre ou un sigle — plus fiable qu'une transcription libre
pour du calage. Precision constatee : loss 0.04-0.09.

USAGE :
  python3 scripts/tools/forced-align.py <audio.mp3> <texte.txt> [reperes...]

  <texte.txt>  le texte PRONONCE. Les tags V3 entre crochets ([solemn], [pause]...) sont
               retires automatiquement — passer le meme fichier qu'a la generation TTS.
  [reperes]    mots-cles dont on veut la frame exacte (ex: grimpe flambent devaluer).
               Accents et casse indifferents. Repere absent = signale, jamais silencieux.

EXEMPLE :
  python3 scripts/tools/forced-align.py public/_rnd/x/beat5a-vo.mp3 /tmp/vo.txt grimpe flambent
    -> FIN VO : 22.92s = frame 688
    ->   "grimpe"   -> 18.96s = frame 569
    ->   "flambent" -> 20.50s = frame 615

Sortie JSON complete : <audio>.alignment.json (a cote de l'audio).
"""
import argparse
import json
import os
import re
import sys
import unicodedata
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
API_URL = "https://api.elevenlabs.io/v1/forced-alignment"


def norm(s: str) -> str:
    """Comparaison tolerante : sans casse, sans ponctuation, SANS ACCENTS.
    Les accents doivent sauter : on tape les reperes au terminal ("devaluer") alors que la VO
    dit "dévaluer" — sans ca le repere est introuvable et on croit a tort le mot absent."""
    decomposed = unicodedata.normalize("NFD", s.lower())
    stripped = "".join(c for c in decomposed if unicodedata.category(c) != "Mn")
    return re.sub(r"[^0-9a-z]", "", stripped)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("text_file")
    ap.add_argument("reperes", nargs="*", help="mots-cles dont on veut la frame")
    ap.add_argument("--fps", type=int, default=30)
    a = ap.parse_args()

    key = os.getenv("ELEVENLABS_API_KEY")
    if not key:
        print("ERREUR : ELEVENLABS_API_KEY absente de .env")
        return 1
    audio = Path(a.audio)
    if not audio.exists():
        print(f"ERREUR : audio introuvable — {audio}")
        return 1

    # le texte envoye doit etre le texte PRONONCE : on retire les tags V3
    raw = Path(a.text_file).read_text(encoding="utf-8")
    spoken = re.sub(r"\s+", " ", re.sub(r"\[[^\]]+\]", " ", raw)).strip()
    if not spoken:
        print("ERREUR : texte vide apres retrait des tags")
        return 1

    with open(audio, "rb") as fh:
        resp = requests.post(API_URL, files={"file": (audio.name, fh, "audio/mpeg")},
                             data={"text": spoken}, headers={"xi-api-key": key}, timeout=300)
    if resp.status_code != 200:
        print(f"ERREUR {resp.status_code} : {resp.text[:300]}")
        return 1

    result = resp.json()
    out = audio.with_suffix(".alignment.json")
    out.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    # l'API insere une entree ' ' entre chaque mot reel : on ne garde que les mots
    words = [w for w in result.get("words", []) if w.get("text", "").strip()]
    if not words:
        print("ERREUR : aucun mot dans la reponse")
        return 1

    loss = result.get("loss", "n/a")
    end = words[-1]["end"]
    print(f"OK {len(words)} mots · loss={loss} -> {out.name}")
    print(f"FIN VO : {end:.2f}s = frame {round(end * a.fps)}")
    if isinstance(loss, (int, float)) and loss > 0.25:
        print("  ⚠️  loss elevee : le texte fourni ne correspond peut-etre pas a l'audio")
    print()

    for rep in a.reperes:
        target = norm(rep)
        hit = next((w for w in words if norm(w["text"]) == target), None)
        if hit:
            print(f'  "{rep}" -> {hit["start"]:.2f}s = frame {round(hit["start"] * a.fps)}')
        else:
            print(f'  "{rep}" -> INTROUVABLE dans la VO')
    return 0


if __name__ == "__main__":
    sys.exit(main())
