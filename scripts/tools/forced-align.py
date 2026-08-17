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


def detect_stuck_timestamps(words: list) -> str | None:
    """Detecte le bug 'timestamps figes' de l'API forced-alignment (cf memory/tools/elevenlabs.md).

    Symptome : l'API repond 200 avec une loss BASSE (donc les garde-fous existants ne voient rien),
    mais des mots consecutifs partagent le meme start/end. Les reperes tombent alors tous sur la
    meme frame. Deja subi en production : src/projects/souverain/senegal-petrole-gaz/beats/Beat4.tsx
    ("Le forced-alignment v1 a des timestamps bloques sur cette phrase").

    ATTENTION au critere : la memoire proposait `words[0].start == words[1].start` — c'est un
    FAUX POSITIF verifie. Deux alignements SAINS du repo (memory/episodes/warmap-sahel/audio-fixes/
    aes-v6-acte1 et -actes234) ont 3+ starts identiques en tete, simplement parce que des en-tetes
    markdown non retires ("### PARTIE 0 —") sont tasses en une fraction de seconde. Leur alignement
    est bon a 97-98%. On raisonne donc sur la MASSE (ratio de starts distincts, plus longue serie
    consecutive, amplitude totale), jamais sur les 2-3 premiers mots.

    Seuils valides sur les 23 alignments reels du repo : 0 faux positif.
    Retourne un message d'alerte, ou None si l'alignement est sain.
    """
    n = len(words)
    if n < 3:
        return None
    starts = [w["start"] for w in words]
    ratio_uniq = len(set(starts)) / n
    longest = cur = 1
    for i in range(1, n):
        cur = cur + 1 if starts[i] == starts[i - 1] else 1
        longest = max(longest, cur)
    span = words[-1]["end"] - words[0]["start"]

    if span <= 0.01:
        return f"l'alignement couvre {span:.3f}s au total — tous les mots sont sur le meme instant"
    if ratio_uniq < 0.5:
        return (f"seulement {ratio_uniq * 100:.0f}% des mots ont un timestamp distinct "
                f"({len(set(starts))}/{n})")
    if longest >= max(10, 0.5 * n):
        return f"{longest} mots consecutifs partagent le meme timestamp"
    return None


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

    # Bug 'timestamps figes' : l'API repond 200 avec une loss basse mais un alignement inutilisable.
    # A verifier AVANT d'annoncer OK, sinon on grave des frames fausses dans un timing.ts.
    stuck = detect_stuck_timestamps(words)
    if stuck:
        print(f"ERREUR : alignement CORROMPU (timestamps figes) — {stuck}")
        print(f"  loss={loss} (basse = trompeur, elle ne detecte PAS ce bug)")
        print(f"  Reponse brute conservee pour inspection : {out}")
        print()
        print("  ⛔ NE PAS deriver de frames de cet alignement — elles tomberaient toutes au meme endroit.")
        print("  Il n'existe PAS d'endpoint /v2/forced-alignment de secours : verifie 2026-08-17,")
        print("  api.elevenlabs.io/v2/forced-alignment repond 404 (alors que /v2/voices repond bien).")
        print("  Le contournement note dans memory/tools/elevenlabs.md est donc INAPPLICABLE.")
        print("  Contournements reels, par ordre :")
        print("    1. relancer — le bug est intermittent sur un meme MP3")
        print("    2. re-encoder l'audio (ffmpeg -i in.mp3 -c:a libmp3lame -ar 44100 out.mp3) puis relancer")
        print("    3. decouper la VO en segments plus courts et aligner segment par segment")
        return 1

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
