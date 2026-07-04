"""Forced alignment ElevenLabs PROPRE pour SCENE 4 (dette) + SCENE 5 (coulisses) Senegal V3.
Refait 2026-07-04 (passe finition, sur demande Aziz) : verifier chantier 7 (SFX a retirer) et
chantier 4 (soudure mp3 sc.5) avec un vrai forced-align au lieu d'une deduction par recoupement.

Fenetre : 243.0s -> 350.0s de narration-v3-VALIDEE.mp3 (fin sc.3 + sc.4 entiere + sc.5 entiere).
WINDOW_OFFSET=243.0 : timestamps produits sont RELATIFS a cette fenetre.
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

AUDIO_FILE = Path("/private/tmp/claude-502/-Users-clawdbot-Workspace-remotion/11e84109-a426-4c2c-a02c-2b061de7508f/scratchpad/forcealign/segment-sc4-sc5.mp3")
WINDOW_OFFSET = 243.0
OUT_FILE = ROOT / "public" / "souverain" / "senegal-petrole-gaz" / "audio" / "scene4-5-realign-2026-07-04.json"

TEXT = (
    "C'est exactement ce genre de bras de fer qui revele si les regles tiennent... ou pas. "
    "Mais le terrain le plus piegeux n'est pas la. Il est dans la dette. "
    "Le Senegal a cree son fonds souverain - on l'appelle le FONSIS. Une caisse reservee aux revenus "
    "du petrole, verrouillee avant meme le premier baril. Sur le papier, c'est une bonne nouvelle. "
    "Mais voila le piege. La dette publique du pays atteint cent trente-deux pour cent de toute la "
    "richesse qu'il produit en un an. Rembourser cette dette etouffe deja le budget. Alors la tentation "
    "devient enorme : piocher dans l'argent du petrole pour payer les factures d'aujourd'hui. "
    "Le FMI - le Fonds monetaire international - tire la sonnette d'alarme. Parce que les regles qui "
    "protegent le FONSIS sont plus souples que celles de la Norvege. Un fonds qu'on peut vider... "
    "ne protege plus rien. Reste le dernier terrain. Et celui-la, il se joue loin de Dakar. "
    "Souvenez-vous du troisieme champ - Yakaar-Teranga, celui qui attendait. Il est deja sous contrat "
    "entre l'Americain Kosmos, BP et Petrosen. Mais la decision finale d'investir n'est pas prise. "
    "Le champ attend toujours. Et pendant ce temps, on regarde qui paiera son developpement. "
    "Des discussions avec des entreprises chinoises ont ete rapportees. Rien de signe - mais Pekin "
    "observe. Pourquoi ca compte ? Parce que l'Europe, sous pression climatique, ralentit ses "
    "investissements dans le gaz. Si les Occidentaux reculent sur Yakaar-Teranga, une question se "
    "posera tres vite : qui prend leur place... et a quel prix ? Voila ou en est le Senegal."
)

KEYS = ["fonsis", "verrouillee", "papier", "piege", "132", "trente-deux", "etouffe", "piocher",
        "fmi", "norvege", "vider", "protege", "dernier", "dakar.", "souvenez-vous", "yakaar",
        "kosmos", "attend", "paiera", "chinoises", "pekin", "compte", "europe", "reculent",
        "place", "prix", "voila", "senegal."]


def main() -> int:
    if not AUDIO_FILE.exists():
        print(f"ERROR: audio not found: {AUDIO_FILE}"); return 2
    url = "https://api.elevenlabs.io/v1/forced-alignment"
    with open(AUDIO_FILE, "rb") as f:
        files = {"file": (AUDIO_FILE.name, f, "audio/mpeg")}
        data = {"text": TEXT}
        headers = {"xi-api-key": API_KEY}
        print("Calling forced alignment API (scene 4+5 REALIGN)...")
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
