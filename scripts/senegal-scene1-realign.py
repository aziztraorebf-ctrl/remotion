"""Forced alignment ElevenLabs PROPRE pour SCENE 1 (sc.1a intro + sc.1b gisements) Senegal V3.
Refait 2026-07-04 (passe finition) : l'ancien scene1-alignment.json etait corrompu (genere sur un
extrait /tmp mal decoupe, loss aberrant). Ce script reprend la methode mais avec un segment propre
extrait DIRECTEMENT de narration-v3-VALIDEE.mp3 (32.0s -> 124.5s), verifiable et reproductible.

Fenetre : 32.0s -> 124.5s de narration-v3-VALIDEE.mp3 (contient "Ces deux recits" jusqu'au debut
de la scene 2 "Avant de juger"). WINDOW_OFFSET=32.0 : timestamps produits sont RELATIFS a cette
fenetre (ajouter +32.0s pour l'absolu dans narration-v3-VALIDEE.mp3).
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

AUDIO_FILE = Path("/private/tmp/claude-502/-Users-clawdbot-Workspace-remotion/11e84109-a426-4c2c-a02c-2b061de7508f/scratchpad/forcealign/segment-sc1a-1b.mp3")
WINDOW_OFFSET = 32.0
OUT_FILE = ROOT / "public" / "souverain" / "senegal-petrole-gaz" / "audio" / "scene1-realign-2026-07-04.json"

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
    "ce chiffre ne dit rien sur ce qui decide vraiment du resultat. "
    "Avant de juger le Senegal, regardons trois pays qui sont passes par la."
)

KEYS = ["ces", "pompent", "reprend", "ailleurs", "direct.", "premiere", "gisement.", "trois.",
        "sangomar", "woodside", "dix-huit", "gta", "mauritanie", "cargaisons", "fournisseur",
        "yakaar", "attend.", "surprise", "soixante", "jackpot.", "resultat.", "juger"]


def main() -> int:
    if not AUDIO_FILE.exists():
        print(f"ERROR: audio not found: {AUDIO_FILE}"); return 2
    url = "https://api.elevenlabs.io/v1/forced-alignment"
    with open(AUDIO_FILE, "rb") as f:
        files = {"file": (AUDIO_FILE.name, f, "audio/mpeg")}
        data = {"text": TEXT}
        headers = {"xi-api-key": API_KEY}
        print("Calling forced alignment API (scene 1 REALIGN)...")
        resp = requests.post(url, files=files, data=data, headers=headers, timeout=180)
    if resp.status_code != 200:
        print(f"ERROR {resp.status_code}: {resp.text[:500]}"); return 3
    result = resp.json()
    OUT_FILE.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    words = result.get("words", [])
    print(f"OK: {len(words)} words, loss={result.get('loss','n/a')}")
    print(f"   (timestamps RELATIFS a la fenetre ; +{WINDOW_OFFSET}s pour l'absolu narration-v3-VALIDEE.mp3)\n")
    for w in words:
        t = (w.get("text") or "").strip().lower()
        if any(k in t for k in KEYS):
            rel = w.get("start")
            print(f"  {t:20s} rel={rel:7.2f}s  abs={rel+WINDOW_OFFSET:7.2f}s  loss={w.get('loss', 0):.3f}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
