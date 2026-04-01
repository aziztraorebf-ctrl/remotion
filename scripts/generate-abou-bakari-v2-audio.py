"""
Generation audio — Abou Bakari II Short V2 (Seedance-native)
3 fichiers : narration principale + 2 voix dialogue
Modele : eleven_v3
"""

import os
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import requests

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "audio-abou-bakari-v2"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "xi-api-key": API_KEY,
    "Content-Type": "application/json",
}

# --- Voice IDs ---
NARRATRICE_ID = "Y8XqpS6sj6cx5cCTLp8a"  # Narratrice GeoAfrique V3
ABOU_BAKARI_ID = "ICHuIqamER7XZMdm2HYC"  # Narrateur GeoAfrique V3 (grave, baritone)
MOUSSA_ID = "12mpLi4ieFNVlQlAIJ3m"  # Narrateur GeoAfrique B3 (plus jeune)

# =====================================================================
# REGLE TTS NON-NEGOTIABLE — ElevenLabs accent francais
# ---------------------------------------------------------------------
# ElevenLabs drop les accents finaux sur les participes passes en "e/ee".
# "terrifie" -> prononce "terrifie" (plat), "hantee" -> "hante" (plat).
# INTERDIT dans tout script TTS :
#   - Participes passes en "e" : terrifie, hante, tente, obsede, prepare
#   - Participes passes en "ee" : racontee, traversee
#   - "ont + voyelle" : liaisons bizarres -> passe simple
# CORRECTIONS :
#   - Reformuler avec verbe conjugue : "il est terrifie" -> "la terreur le saisit"
#   - Ou construction sans accent final : "qu'on ne t'a pas racontee" -> "qu'on te cache"
# =====================================================================

# --- Narration principale (tout sauf le dialogue) ---
# Partie A : Beat 1 (Hook) -> Beat 4 (Decision) — avant le dialogue
NARRATION_PART_A = """En treize cent onze, l'ocean Atlantique n'est qu'un mur de brouillard. [pause] Personne n'ose regarder vers l'ouest. [pause] Sauf un homme.

[pause]

Abou Bakari deux. Mansa du Mali. Roi des rois. Il regne sur l'empire le plus riche du monde. [pause] Mais l'horizon le hante.

[pause]

Il fait armer deux mille pirogues. [pause] Un seul bateau revient. Le capitaine tremble de peur. [pause] Un courant geant. On ne passe pas.

[pause]

Abou Bakari ne recule pas. [pause] Il abdique. Il quitte son trone, son or, son pouvoir."""

# Partie B : Beat 5b (Moussa) -> Beat 8 (CTA) — apres le dialogue
NARRATION_PART_B = """Son demi-frere monte sur le trone. Mansa Moussa. L'homme le plus riche de toute l'histoire humaine. [pause] Quatre cents milliards de dollars.

[pause]

Et Abou Bakari monte lui-meme a bord. Des milliers d'hommes le suivent. [pause] Le plus grand voyage maritime de l'histoire. [pause] Il ne reviendra jamais.

[pause]

Cent quatre-vingt-un ans plus tard, un marin genois traverse le meme ocean. [pause] Et c'est son nom que le monde retient. [pause] Christophe Colomb. Le decouvreur.

[pause]

Mais qui a fait la traversee en premier ? [pause] L'Afrique a une histoire qu'on te cache, et une actualite qu'on te simplifie. [pause] Pour en savoir plus, le lien est en bio."""

# --- Dialogue Abou Bakari ---
ABOU_BAKARI_DIALOGUE = """L'empire est à toi, Moussa. [pause] Protège-le."""

ABOU_BAKARI_REPLY = """Là où personne n'est jamais allé."""

# --- Dialogue Moussa ---
MOUSSA_DIALOGUE = """Et toi, où iras-tu ?"""


def generate_tts(voice_id, text, output_name, speed=0.88):
    print(f"\nGenerating: {output_name}")
    print(f"  Voice: {voice_id}")
    print(f"  Speed: {speed}")
    print(f"  Text: {text[:80]}...")

    payload = {
        "text": text,
        "model_id": "eleven_v3",
        "voice_settings": {
            "stability": 0.30,
            "similarity_boost": 0.75,
            "style": 0.25,
            "speed": speed,
        },
        "output_format": "mp3_44100_128",
    }

    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers=HEADERS,
        json=payload,
        timeout=120,
    )

    if resp.status_code != 200:
        print(f"  ERROR {resp.status_code}: {resp.text[:300]}")
        return None

    output_path = OUTPUT_DIR / output_name
    output_path.write_bytes(resp.content)
    size_kb = len(resp.content) / 1024
    print(f"  Saved: {output_path} ({size_kb:.0f} KB)")

    result = subprocess.run(
        ["ffprobe", "-i", str(output_path), "-show_entries",
         "format=duration", "-v", "quiet", "-of", "csv=p=0"],
        capture_output=True, text=True
    )
    if result.stdout.strip():
        duration = float(result.stdout.strip())
        print(f"  Duration: {duration:.2f}s")

    return str(output_path)


def get_duration(filepath):
    result = subprocess.run(
        ["ffprobe", "-i", str(filepath), "-show_entries",
         "format=duration", "-v", "quiet", "-of", "csv=p=0"],
        capture_output=True, text=True
    )
    return float(result.stdout.strip()) if result.stdout.strip() else 0


def assemble_dialogue(output_name="dialogue-v3.mp3"):
    """Assemble dialogue: Abou Bakari line 1 + silence + Moussa + silence + Abou Bakari line 2"""
    silence = OUTPUT_DIR / "silence-beat.mp3"
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono",
        "-t", "0.6", "-c:a", "libmp3lame", "-b:a", "128k", str(silence)
    ], capture_output=True)

    concat_file = OUTPUT_DIR / "dialogue-v3-concat.txt"
    concat_file.write_text(
        f"file 'dialogue-abou-bakari-line1.mp3'\n"
        f"file 'silence-beat.mp3'\n"
        f"file 'dialogue-moussa.mp3'\n"
        f"file 'silence-beat.mp3'\n"
        f"file 'dialogue-abou-bakari-line2.mp3'\n"
    )
    output = OUTPUT_DIR / output_name
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_file), "-c:a", "libmp3lame", "-b:a", "128k",
        str(output)
    ], capture_output=True)
    dur = get_duration(output)
    print(f"  Dialogue assembled: {output.name} ({dur:.2f}s)")
    return str(output)


def assemble_final():
    """Assemble: Part A + silence + dialogue + silence + Part B"""
    silence = OUTPUT_DIR / "silence-transition.mp3"
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono",
        "-t", "0.5", "-c:a", "libmp3lame", "-b:a", "128k", str(silence)
    ], capture_output=True)

    concat_file = OUTPUT_DIR / "final-v3-concat.txt"
    concat_file.write_text(
        f"file 'narration-partA-v3.mp3'\n"
        f"file 'silence-transition.mp3'\n"
        f"file 'dialogue-v3.mp3'\n"
        f"file 'silence-transition.mp3'\n"
        f"file 'narration-partB-v3.mp3'\n"
    )
    output = OUTPUT_DIR / "abou-bakari-v2-full-v3.mp3"
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_file), "-c:a", "libmp3lame", "-b:a", "128k",
        str(output)
    ], capture_output=True)
    dur = get_duration(output)
    print(f"\n  FINAL: {output.name} ({dur:.2f}s)")
    return str(output)


def main():
    print("=" * 60)
    print("Abou Bakari II — Short V2 Audio Generation (v3 — pauses courtes)")
    print("=" * 60)

    # 1. Narration Partie A (Beats 1-4) — speed 0.92
    print("\n--- Partie A (Beats 1-4) ---")
    generate_tts(NARRATRICE_ID, NARRATION_PART_A, "narration-partA-v3.mp3", speed=0.92)

    # 2. Narration Partie B (Beats 5b-8) — speed 0.92
    print("\n--- Partie B (Beats 5b-8) ---")
    generate_tts(NARRATRICE_ID, NARRATION_PART_B, "narration-partB-v3.mp3", speed=0.92)

    # 3. Dialogue Abou Bakari ligne 1 — speed 0.85
    print("\n--- Dialogue ---")
    generate_tts(ABOU_BAKARI_ID, ABOU_BAKARI_DIALOGUE, "dialogue-abou-bakari-line1.mp3", speed=0.85)

    # 4. Dialogue Abou Bakari ligne 2 — speed 0.85
    generate_tts(ABOU_BAKARI_ID, ABOU_BAKARI_REPLY, "dialogue-abou-bakari-line2.mp3", speed=0.85)

    # 5. Dialogue Moussa — speed 0.90
    generate_tts(MOUSSA_ID, MOUSSA_DIALOGUE, "dialogue-moussa.mp3", speed=0.90)

    # 6. Assemble dialogue
    print("\n--- Assemblage dialogue ---")
    assemble_dialogue()

    # 7. Assemble final
    print("\n--- Assemblage final ---")
    assemble_final()

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    for name in ["narration-partA-v3.mp3", "dialogue-v3.mp3",
                 "narration-partB-v3.mp3", "abou-bakari-v2-full-v3.mp3"]:
        fp = OUTPUT_DIR / name
        if fp.exists():
            dur = get_duration(fp)
            print(f"  {name:45s} {dur:.2f}s")


if __name__ == "__main__":
    main()
