"""Forced alignment ElevenLabs pour la SCENE 1 Senegal V3 (les 3 gisements + paradoxe).
Le texte = SCENE 1 du SCRIPT-V3 (tags [..] retires, non prononces), ponctuation conservee.
Sert a caler PRECISEMENT les beats visuels (Sangomar / GTA / Yakaar / 60%) sur la narration V3.

Fenetre audio : /tmp/senegal-s1-window.mp3 = extrait 20s->220s de narration-v3-VALIDEE.mp3.
Les timestamps produits sont RELATIFS a cette fenetre (ajouter +20s pour l'absolu dans la video).
"""
import os, sys, json
from pathlib import Path
import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")
API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY missing"); sys.exit(1)

AUDIO_FILE = Path("/tmp/senegal-s1-window.mp3")
WINDOW_OFFSET = 20.0  # la fenetre commence a 20s dans l'audio complet
OUT_FILE = ROOT / "public" / "souverain" / "senegal-petrole-gaz" / "audio" / "scene1-alignment.json"

# SCENE 1 du SCRIPT-V3, tags [..] RETIRES (non prononces), ponctuation conservee.
TEXT = (
    "Ces deux recits, on les entend partout. D'un cote, des multinationales qui pompent et repartent. "
    "De l'autre, une nation qui reprend enfin son destin en main. Mais la realite se joue ailleurs "
    "- dans des details qu'on ne montre jamais. Et le Senegal est en train de les tester en direct. "
    "Premiere chose a comprendre : le Senegal n'a pas trouve un gisement. Il en a trouve trois. "
    "Le premier s'appelle Sangomar. Du petrole brut, au large de Dakar. Il est exploite par l'Australien "
    "Woodside Energy. A ses cotes, Petrosen - la compagnie nationale - detient dix-huit pour cent du projet. "
    "Le deuxieme, c'est GTA : un champ de gaz pose sur la frontiere avec la Mauritanie, opere par le "
    "Britannique BP. Depuis 2025, il produit. Les premieres cargaisons sont parties vers l'Europe et l'Asie "
    "- des clients qui cherchent a remplacer le gaz russe depuis la guerre en Ukraine. En quelques mois, "
    "le Senegal cesse d'etre un candidat. Il devient un fournisseur. "
    "Et il y a un troisieme champ. Yakaar-Teranga. Du gaz, lui aussi, encore offshore. Mais personne n'a "
    "decide comment il sera exploite. Il attend. Et plusieurs capitales le regardent. On y reviendra "
    "- c'est lui qui reserve la plus grosse surprise. "
    "Reste la vraie question : sur tout cet argent, combien reste au Senegal ? Le gouvernement affirme "
    "toucher environ soixante pour cent des revenus - participation, taxes, royalties compris. Soixante "
    "pour cent, c'est la moyenne des pays producteurs emergents. Ni un scandale, ni un jackpot. Sauf que "
    "ce chiffre ne dit rien sur ce qui decide vraiment du resultat."
)

# mots-cles a remonter pour caler les beats visuels
KEYS = ["sangomar", "woodside", "petrosen", "dix-huit", "gta", "mauritanie", "britannique",
        "cargaisons", "fournisseur", "yakaar", "yakaar-teranga", "attend", "surprise",
        "soixante", "moyenne", "decide", "resultat."]


def main() -> int:
    if not AUDIO_FILE.exists():
        print(f"ERROR: audio not found: {AUDIO_FILE}"); return 2
    url = "https://api.elevenlabs.io/v1/forced-alignment"
    with open(AUDIO_FILE, "rb") as f:
        files = {"file": (AUDIO_FILE.name, f, "audio/mpeg")}
        data = {"text": TEXT}
        headers = {"xi-api-key": API_KEY}
        print("Calling forced alignment API (scene 1)...")
        resp = requests.post(url, files=files, data=data, headers=headers, timeout=180)
    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:500]}"); return 3
    result = resp.json()
    OUT_FILE.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    words = result.get("words", [])
    print(f"OK: {len(words)} words, loss={result.get('loss','n/a')}")
    print(f"   (timestamps RELATIFS a la fenetre ; +{WINDOW_OFFSET}s pour l'absolu video)\n")
    for w in words:
        t = (w.get("text") or w.get("word") or "").strip().lower()
        if any(k in t for k in KEYS):
            rel = w.get("start")
            print(f"  rel {rel:6.2f}s  | abs {rel+WINDOW_OFFSET:6.2f}s  | {w.get('text') or w.get('word')}")
    print(f"\n-> {OUT_FILE}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
