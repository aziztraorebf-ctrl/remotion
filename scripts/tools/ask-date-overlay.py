#!/usr/bin/env python3
"""
Brief conceptuel ponctuel : que faire du compteur de DATE (haut-droite) dans
l'Acte 1 War-Map Sahel ? Garder / modifier / retirer ?
Envoie le brief + 3 frames a Gemini 3.1 Pro ET Kimi K2.5, LES DEUX via OpenRouter
(economie : pas d'appel API officiel Google).
"""
import base64
import json
import os
import sys
import threading
import urllib.request

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
GEMINI_MODEL = "google/gemini-3.1-pro-preview"
KIMI_MODEL = "moonshotai/kimi-k2.5"

FRAMES = [
    ("/tmp/date-brief/date-2020.jpg", "Date affichee : 2020.08.18 (debut de l'acte)"),
    ("/tmp/date-brief/date-2021.jpg", "Date affichee : 2021.05.24 (milieu)"),
    ("/tmp/date-brief/date-2022.jpg", "Date affichee : 2022.01.24 (fin de l'acte)"),
]

BRIEF = """Tu es directeur artistique de motion design documentaire (war-map geopolitique premium, style chaine YouTube analytique type "day-by-day war map" mais en identite parchemin/etat-major).

CONTEXTE DE LA SCENE (Acte 1, ~77 secondes) :
- Carte du Sahel central (Mali, Burkina Faso, Niger) en projection parchemin.
- Le recit montre l'emergence de deux groupes armes (JNIM lie a Al-Qaida, EIGS lie a Daesh) entre 2020 et 2022.
- Mecaniques a l'ecran : allumage sequentiel des pays, rupture de la CEDEAO, jetons-combattants qui se deploient, taches d'influence, pulse des territoires quand la voix les nomme.
- En HAUT-GAUCHE : une legende des factions (couleurs = qui controle quoi). Elle fonctionne TRES bien, comprehensible en permanence.
- En HAUT-DROITE : un compteur de DATE precise (ex "2020.08.18", puis "2021.05.24", puis "2022.01.24"). C'est l'objet de ce brief.

LE PROBLEME (retour du realisateur) :
"La date est trop abstraite. Elle reste figee longtemps puis SAUTE d'un coup vers une autre date, parfois en avant, et je ne comprends pas pourquoi elle est la ni a quoi elle sert. C'est un compteur statique la plupart du temps qui change parfois sans que je relie ce saut a ce qui se passe a l'ecran. C'est tout le contraire de la legende des factions a gauche qui, elle, fonctionne. Si moi je me pose la question, d'autres spectateurs aussi."

TA MISSION :
Donne ton avis de DA franc et argumente. Reponds precisement a :
1. La date precise (jour/mois/annee) a-t-elle une UTILITE narrative ici, ou cree-t-elle plus de confusion qu'elle n'aide ?
2. Si tu la GARDES : sous quelle forme exacte pour qu'elle devienne lisible et utile (granularite, animation, position, format) ? Donne une reco concrete implementable.
3. Si tu la MODIFIES : par quoi (ex : annee seule qui defile en continu, timeline/barre de progression graduee, "JOUR N du conflit", label de phase) ? Justifie ce que CHAQUE option apporte a la comprehension et a l'ecoute.
4. Si tu la RETIRES : pourquoi, et qu'est-ce qui porte alors le reperage temporel ?

Sois concis et tranche : a la fin, donne TA recommandation unique (1 phrase) classee #1, avec une alternative #2.
Reponds en francais."""


def encode_image(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()


def build_content():
    content = [{"type": "text", "text": BRIEF}]
    for path, caption in FRAMES:
        content.append({"type": "text", "text": f"\n[FRAME] {caption}"})
        b64 = encode_image(path)
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{b64}"},
        })
    return content


def call_model(model, key, content, results):
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": content}],
        "max_tokens": 2000,
    }
    req = urllib.request.Request(
        OPENROUTER_URL,
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://koraetcartes.local",
            "X-Title": "Sahel WarMap Date Overlay Brief",
        },
    )
    try:
        print(f"[{model}] envoi...")
        with urllib.request.urlopen(req, timeout=180) as resp:
            data = json.loads(resp.read())
        msg = data["choices"][0]["message"]
        results[model] = msg.get("content") or msg.get("reasoning") or "[vide]"
        print(f"[{model}] OK")
    except Exception as e:
        results[model] = f"[ERREUR {model}] {e}"
        print(f"[{model}] ERREUR: {e}")


def main():
    key = os.environ.get("OPENROUTER_API_KEY")
    if not key:
        # lire depuis .env
        try:
            with open(".env") as f:
                for line in f:
                    if line.startswith("OPENROUTER_API_KEY="):
                        key = line.split("=", 1)[1].strip()
                        break
        except FileNotFoundError:
            pass
    if not key:
        print("OPENROUTER_API_KEY absente")
        sys.exit(1)

    content = build_content()
    results = {}
    threads = [
        threading.Thread(target=call_model, args=(GEMINI_MODEL, key, content, results)),
        threading.Thread(target=call_model, args=(KIMI_MODEL, key, content, results)),
    ]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    print("\n" + "=" * 70)
    print("GEMINI 3.1 PRO")
    print("=" * 70)
    print(results.get(GEMINI_MODEL, "[absent]"))
    print("\n" + "=" * 70)
    print("KIMI K2.5")
    print("=" * 70)
    print(results.get(KIMI_MODEL, "[absent]"))

    with open("/tmp/date-brief/reponses.json", "w") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("\n[sauvegarde] /tmp/date-brief/reponses.json")


if __name__ == "__main__":
    main()
