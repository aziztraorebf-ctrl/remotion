#!/usr/bin/env python3
"""
proportions-diff.py — COMPARE original vs reproduction et CHIFFRE les ecarts.

⭐ Idee d'Aziz (2026-08-27) : au lieu de demander a un modele de DECRIRE une
scene, lui donner les DEUX images cote a cote (original au-dessus, notre
reproduction en dessous, grille commune en %) et lui demander les ECARTS.
Un modele qui COMPARE voit ce qu'il ne voit pas en decrivant.

Complementaire de `motion-breakdown.py` :
  motion-breakdown  = AVANT de coder  -> quels gestes existent
  proportions-diff  = APRES un rendu  -> qu'est-ce qui n'est pas a la bonne taille

Usage :
  python3 scripts/tools/proportions-diff.py --panel p1.png [--panel p2.png ...] --label plan05

Sorties : /tmp/proportions-diff/<label>-{gemini,gpt}.md
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import force_ipv4  # noqa: E402,F401

import json  # noqa: E402
import base64  # noqa: E402
import argparse  # noqa: E402
import threading  # noqa: E402
import time  # noqa: E402
import urllib.request  # noqa: E402

from api_models import GPT_TEXT_VISION  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(ROOT, ".env"))
except ImportError:
    pass

OUT_DIR = "/tmp/proportions-diff"
GEMINI_MODEL = "gemini-3.1-pro-preview"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

PROMPT = """Chaque image que tu recois contient DEUX captures du MEME instant :
  - EN HAUT : **A = l'ORIGINAL** (la video de reference)
  - EN BAS  : **B = NOTRE REPRODUCTION**
Une grille identique est superposee sur les deux : verticales graduees en % de la
LARGEUR, horizontales tous les 10 % de la HAUTEUR. Sers-t'en pour CHIFFRER.

Ta mission unique : dire **CE QUI N'EST PAS A LA BONNE TAILLE OU AU BON ENDROIT
dans B**, avec des NOMBRES.

⛔ Ne commente ni le style, ni les couleurs, ni la qualite, ni le contenu — on ne
te demande QUE la geometrie : tailles, positions, centrages, espacements.

Pour CHAQUE element present dans les deux images, donne une ligne de ce format :

  ELEMENT | A: <taille en % de largeur> centre a <x%>,<y%> | B: <idem> | ECART: <verdict>

et termine chaque ligne par une CONSIGNE CHIFFREE actionnable, du type :
  « agrandir B de 15 % » · « deplacer B de 4 % vers la gauche » ·
  « reduire B de 8 % » · « conforme, ne rien changer ».

Puis, a la fin :

**LES 3 CORRECTIONS LES PLUS IMPORTANTES**, classees par ce qui se VOIT le plus,
chacune en une phrase avec son chiffre.

Sois precis sur les centres : un element peut avoir la bonne TAILLE mais etre mal
CENTRE, et inversement. Verifie les deux separement.
Si un element est present dans A mais ABSENT de B (ou l'inverse), signale-le.

⚠️ REPONDS DIRECTEMENT au format demande, sans preambule ni raisonnement etale :
les lignes ELEMENT | A | B | ECART, puis les 3 corrections. Rien d'autre."""


def call_gemini(panels, results):
    try:
        from google import genai
        from google.genai import types
    except ImportError:
        results["gemini"] = "[ERREUR] SDK google-genai absent"
        return
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        results["gemini"] = "[ERREUR] GEMINI_API_KEY absente"
        return
    try:
        client = genai.Client(api_key=key)
        parts = []
        for p in panels:
            with open(p, "rb") as fh:
                parts.append(types.Part.from_bytes(data=fh.read(), mime_type="image/png"))
        parts.append(PROMPT)
        print("[gemini] analyse comparative...")
        resp = client.models.generate_content(
            model=GEMINI_MODEL, contents=parts,
            config=types.GenerateContentConfig(max_output_tokens=3500, temperature=0.2),
        )
        txt = resp.text
        if not txt:
            fr = getattr(resp, "candidates", None)
            why = fr[0].finish_reason if fr else "?"
            txt = f"[vide — finish_reason={why}]"
        results["gemini"] = txt
        print("[gemini] OK")
    except Exception as e:
        results["gemini"] = f"[ERREUR gemini] {e}"
        print(f"[gemini] ERREUR: {e}")


def call_gpt(panels, results):
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        results["gpt"] = "[ERREUR] OPENROUTER_API_KEY absente"
        return
    content = [{"type": "text", "text": PROMPT}]
    for p in panels:
        with open(p, "rb") as fh:
            b64 = base64.b64encode(fh.read()).decode()
        content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}})
    # ⛔⛔ GPT-5.5 via OpenRouter consomme son budget en RAISONNEMENT INTERNE
    # avant d'ecrire : avec max_tokens=3500 il rendait `finish_reason: length`,
    # 3500 tokens factures et **0 caractere** de reponse (diagnostique 2026-08-27,
    # ce n'etait ni la taille de l'image ni un refus). Budget large obligatoire.
    body = {"model": GPT_TEXT_VISION,
            "messages": [{"role": "user", "content": content}],
            "max_tokens": 12000, "temperature": 0.2}
    req = urllib.request.Request(
        OPENROUTER_URL, data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    try:
        print(f"[gpt] envoi {len(panels)} planches...")
        with urllib.request.urlopen(req, timeout=300) as r:
            data = json.loads(r.read().decode())
        results["gpt"] = data["choices"][0]["message"].get("content") or "[vide]"
        print("[gpt] OK")
    except Exception as e:
        results["gpt"] = f"[ERREUR gpt] {e}"
        print(f"[gpt] ERREUR: {e}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--panel", action="append", required=True,
                    help="Planche A/B (repeter pour plusieurs instants)")
    ap.add_argument("--label", required=True)
    args = ap.parse_args()

    os.makedirs(OUT_DIR, exist_ok=True)
    results = {}
    threads = [threading.Thread(target=call_gemini, args=(args.panel, results)),
               threading.Thread(target=call_gpt, args=(args.panel, results))]
    t0 = time.time()
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    print(f"termine en {time.time() - t0:.0f} s")

    for name in ("gemini", "gpt"):
        p = os.path.join(OUT_DIR, f"{args.label}-{name}.md")
        with open(p, "w") as f:
            f.write(f"# Ecarts de proportions — {args.label} ({name})\n\n")
            f.write(results.get(name) or "[absent — reponse vide]")
        print(f"  -> {p}")


if __name__ == "__main__":
    main()
