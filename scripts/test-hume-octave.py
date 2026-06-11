"""Test Hume Octave TTS (FR) — A/B contre GeoAfrique V2 ElevenLabs.
Meme extrait Kidal. Octave 2 (FR) + acting instructions (description).
Cle : passer en arg `python3 scripts/test-hume-octave.py <HUME_API_KEY>` OU env HUME_API_KEY.
Cle jetable (Aziz) — NE PAS commiter. NE PAS ecrire dans .env sans accord.
"""
import os, sys, json, subprocess
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[1]
KEY = sys.argv[1] if len(sys.argv) > 1 else os.getenv("HUME_API_KEY")
if not KEY:
    print("Usage: python3 scripts/test-hume-octave.py <HUME_API_KEY>  (ou env HUME_API_KEY)")
    sys.exit(1)

OUT = ROOT / "public/_shared/audio/sahel-warmap"
OUT.mkdir(parents=True, exist_ok=True)

# Meme extrait Kidal que le test ElevenLabs (A/B equitable)
TEXT = ("Mais ce nouveau bloc va tres vite etre mis a l'epreuve, et tout va se cristalliser sur un seul "
        "point de la carte. Une ville que tout le monde regarde. Kidal. Depuis deux mille douze, cette ville "
        "echappe completement a l'Etat malien. Elle est aux mains de groupes armes touaregs.")

# Acting instruction = le levier expressif. Narration documentaire grave qui monte sur "Kidal".
DESCRIPTION = ("Narrateur de documentaire geopolitique francais, voix masculine grave, posee et analytique. "
               "Ton solennel qui installe une tension croissante, marque un silence dramatique avant le mot "
               "'Kidal', puis reprend calmement. Rythme pose, jamais monotone.")

# Octave 2 EXIGE un voice. On essaie une voix predefinie FR du catalogue Hume (a ajuster selon dispo).
# Si echec 'voice not found', le script liste les voix dispo.
def synth(voice_spec, label):
    url = "https://api.hume.ai/v0/tts/file"
    body = {
        "utterances": [{
            "text": TEXT,
            "description": DESCRIPTION,
            "voice": voice_spec,
        }],
        "format": {"type": "mp3"},
        "version": "2",
        "num_generations": 1,
        "instant_mode": False,
    }
    h = {"X-Hume-Api-Key": KEY, "Content-Type": "application/json"}
    r = requests.post(url, json=body, headers=h, timeout=180)
    if r.status_code == 200:
        f = OUT / f"_hume_{label}.mp3"
        f.write_bytes(r.content)
        print(f"OK {label} ({len(r.content)/1024:.0f} KB) -> {f.name}")
        u = subprocess.run(["curl","-s","-F","reqtype=fileupload","-F",f"fileToUpload=@{f}",
                            "https://catbox.moe/user/api.php"], capture_output=True, text=True)
        print("   catbox:", u.stdout.strip())
        return True
    print(f"ERR {label} {r.status_code}: {r.text[:400]}")
    return False

def list_voices():
    # voix Hume + voix custom de l'utilisateur
    for prov in ("HUME_AI", "CUSTOM_VOICE"):
        r = requests.get("https://api.hume.ai/v0/tts/voices",
                         headers={"X-Hume-Api-Key": KEY}, params={"provider": prov}, timeout=60)
        print(f"\n--- voices {prov} ({r.status_code}) ---")
        if r.status_code == 200:
            data = r.json()
            for v in data.get("voices_page", data.get("voices", []))[:20]:
                print("  ", v.get("name"), "|", v.get("id"), "|", v.get("provider",""))
        else:
            print("  ", r.text[:300])

if __name__ == "__main__":
    print("Etape 1 : lister les voix dispo (pour choisir une voix FR)")
    list_voices()
    print("\nEtape 2 : essai synth avec voix 'Male English Actor' fallback "
          "(remplacer par une voix FR de la liste ci-dessus si dispo)")
    # essai voix design FR generique par nom (a ajuster apres avoir vu la liste)
    ok = synth({"name": "Male English Actor", "provider": "HUME_AI"}, "kidal_v2")
    if not ok:
        print("\n>> Choisir une voix de la liste ci-dessus et relancer en modifiant voice_spec.")
