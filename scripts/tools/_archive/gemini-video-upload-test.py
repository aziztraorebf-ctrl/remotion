#!/usr/bin/env python3
"""
Test de FIABILITE de l'upload video complete a Gemini 3.1 Pro (Files API).
But : verifier si Gemini "voit" vraiment la video (et pas hallucine sans la lire,
bug connu du 13 juin). On pose 3 questions piege dont on connait la reponse.

Usage : python3 scripts/tools/gemini-video-upload-test.py <video.mp4>
"""
import os
import sys
import time
from pathlib import Path

from google import genai
from google.genai import types

GEMINI_MODEL = "gemini-3.1-pro-preview"


def load_key():
    # lire GEMINI_API_KEY depuis .env racine
    env = Path(__file__).resolve().parents[2] / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return os.environ.get("GEMINI_API_KEY")


def main():
    if len(sys.argv) < 2:
        print("usage: gemini-video-upload-test.py <video.mp4>")
        sys.exit(1)
    video_path = sys.argv[1]
    if not Path(video_path).exists():
        print(f"introuvable: {video_path}")
        sys.exit(1)

    key = load_key()
    if not key:
        print("GEMINI_API_KEY manquante")
        sys.exit(1)
    client = genai.Client(api_key=key)

    print(f"[1/3] Upload {video_path} ({Path(video_path).stat().st_size/1e6:.0f} Mo)...")
    f = client.files.upload(file=video_path)
    print(f"      file name = {f.name}, state = {f.state}")

    # attendre que le fichier soit ACTIVE (traitement video)
    print("[2/3] Attente traitement (ACTIVE)...")
    t0 = time.time()
    while f.state and str(f.state) not in ("ACTIVE", "FileState.ACTIVE"):
        if str(f.state) in ("FAILED", "FileState.FAILED"):
            print("      ECHEC traitement video.")
            sys.exit(2)
        time.sleep(5)
        f = client.files.get(name=f.name)
        if time.time() - t0 > 300:
            print("      TIMEOUT 5min.")
            sys.exit(3)
    print(f"      ACTIVE en {time.time()-t0:.0f}s")

    # questions piege (reponses connues, verifiees dans les frames/audio)
    prompt = (
        "Tu analyses une video documentaire (7min39, francais). Reponds PRECISEMENT et "
        "UNIQUEMENT a partir de ce que tu vois/entends reellement dans la video. Si tu ne "
        "trouves pas une info, dis 'NON TROUVE' — n'invente jamais.\n\n"
        "1. Une CALEBASSE (recipient courbe) rouge se remplit a un moment. Quel POURCENTAGE "
        "exact est affiche a cote, et de quoi parle-t-il ? Donne le timecode approximatif.\n"
        "2. Au tout debut, une date de DISSOLUTION du gouvernement senegalais s'affiche. "
        "Quelle est cette date exacte ?\n"
        "3. Vers la fin, une carte montre 'DE ZERO A EXPORTATEUR' avec 3 etiquettes "
        "(FONSIS, ITIE, LOI LOCAL CONTENT). Quel pourcentage de dette est ecrit en rouge "
        "a cote de FONSIS ?\n"
    )
    print("[3/3] Question piege a Gemini...\n")
    resp = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[f, types.Part.from_text(text=prompt)],
        config=types.GenerateContentConfig(temperature=0.2, max_output_tokens=1200),
    )
    print("=" * 60)
    print(resp.text)
    print("=" * 60)
    print("\nREPONSES ATTENDUES (verite terrain) :")
    print("  1. 132% (dette publique / PIB Senegal 2025), ~5min")
    print("  2. 22 mai 2026")
    print("  3. 80% (FONSIS / Dette 80% PIB) -- l'incoherence qu'on corrige")


if __name__ == "__main__":
    main()
