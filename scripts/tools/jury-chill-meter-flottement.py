#!/usr/bin/env python3
"""
jury-chill-meter-flottement.py — jury externe A USAGE UNIQUE (ce probleme precis).

Contexte : la cliente Abigail (chill-meter, contrat Upwork) dit que le meter "still
visually reads like it is hovering" meme si le calage au sol est mesure correct. Jusqu'ici
seuls Aziz et Claude ont cherche la cause. Objectif : 4 voix EXTERNES independantes,
sans le contexte biaise du repo, pour verifier/completer le diagnostic et proposer des
corrections concretes.

⚠️ Script MODIFIE juste pour cette fois (demande explicite d'Aziz, 06/09) : 4 voix au lieu
des 2-3 habituelles de da-brief.py — GPT-6 Astra, Grok, Gemini 3.1 Pro, Kimi K3. Ne PAS
generaliser cette liste a d'autres briefs sans decision explicite.
⛔ max_tokens releve a 24000 (vs 16000 par defaut dans da-brief.py) : la consigne d'Aziz est
qu'aucune reponse ne soit tronquee. Si "finish_reason":"length" apparait quand meme, le
signaler dans la sortie plutot que de le passer sous silence.

Usage :
  python3 scripts/tools/jury-chill-meter-flottement.py

Sorties : /tmp/da-refs/jury-flottement-<voix>.md (une par modele) + resume console.
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import force_ipv4  # noqa: E402,F401 — DOIT s'importer avant tout appel reseau (IPv6 mort en sandbox)

import json
import base64
import subprocess
import threading
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = "/tmp/da-refs"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MAX_TOKENS = 24000  # consigne explicite : jamais de reponse coupee

GPT6_MODEL = "openai/gpt-6-astra"      # remplace gpt-5.6-sol (decision Aziz 2026-09-05)
GROK_MODEL = "x-ai/grok-4.6"
GEMINI_MODEL = "gemini-3.1-pro-preview"
KIMI_MODEL = "kimi-k3"


def load_env():
    env = os.path.join(ROOT, ".env")
    if os.path.exists(env):
        for line in open(env):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())


def downscale(path, tag):
    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, f"jury-flottement-{tag}.jpg")
    subprocess.run(
        ["ffmpeg", "-y", "-i", path, "-vf", "scale=1280:-1", "-q:v", "4", out],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True,
    )
    return out


def b64(path):
    return base64.b64encode(open(path, "rb").read()).decode()


PROMPT = """Tu es consulte comme AVIS EXTERNE INDEPENDANT sur un probleme de compositing 2D.
Tu n'as aucun autre contexte que ce qui suit — ne suppose rien au-dela.

CONTEXTE : un motion designer a cree un overlay transparent (un "chill meter" — instrument
retro-futuriste en metal patine, avec jauge, boutons, ecran) destine a etre incruste en bas a
gauche d'une video de reaction YouTube. La cliente valide que le calage vertical est CORRECT
au pixel pres (mesure : le bas de l'objet touche la ligne de sol de son cadre), mais elle
persiste a dire que l'objet "still visually reads like it is hovering" (flotte visuellement).
Une ombre de contact simple a deja ete ajoutee sous l'objet, sans que ca resolve totalement
sa perception.

Tu recois 2 images :
1. [reference-client] : une capture ecran RECENTE et REELLE de son plateau de streaming
   (pas une reference generee par IA), montrant son decor tel qu'il apparait vraiment dans
   ses videos — avec un premier plan (piano, meuble) visible en bas de cadre.
2. [notre-rendu] : le rendu ACTUEL du chill meter compose sur le decor qu'on utilise pour le
   produire (une frame extraite d'une AUTRE de ses videos, sans le meme premier plan).

QUESTIONS :
1. En comparant les 2 images, quelles differences de PROFONDEUR/PERSPECTIVE/ANCRAGE VISUEL
   remarques-tu entre le decor de reference et notre decor de production ?
2. Au-dela d'une ombre de contact plus prononcee (deja envisagee), quelles AUTRES techniques
   de compositing 2D peuvent renforcer la sensation qu'un objet plat "repose" sur une surface
   reelle plutot que de "flotter" par-dessus une image (ex : perspective, echelle relative,
   occlusion partielle par un element du premier plan, grain/flou de profondeur de champ,
   reflet au sol, variation de luminosite locale) ?
3. Le probleme peut-il venir du CHOIX DU DECOR DE FOND lui-meme (l'image sur laquelle
   l'objet est compose) plutot que de l'objet ou de son ombre ? Si oui, quel critere
   devrait guider le choix d'une bonne frame de decor pour ce genre d'incrustation ?
4. Donne un diagnostic tranche : le probleme est-il plus probablement (a) l'intensite/qualite
   de l'ombre, (b) l'absence de repere de profondeur dans le decor de fond, (c) autre chose ?
   Justifie en 2-3 phrases.

Reponds de facon structuree et concrete, en listant des techniques ACTIONNABLES (pas de
generalites). Sois direct si tu juges qu'une piste envisagee (l'ombre seule) est insuffisante.
"""


def call_gpt6(frames, results):
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        results["gpt6"] = ("[ERREUR] OPENROUTER_API_KEY absente", None)
        return
    content = [{"type": "text", "text": PROMPT}]
    for fp, caption in frames:
        content.append({"type": "text", "text": f"\n[{caption}] :"})
        content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64(fp)}"}})
    payload = {"model": GPT6_MODEL, "messages": [{"role": "user", "content": content}],
               "max_tokens": MAX_TOKENS, "temperature": 0.4}
    try:
        print("[gpt6-astra] envoi...")
        req = urllib.request.Request(
            OPENROUTER_URL, data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json",
                     "HTTP-Referer": "https://kora-cartes.local", "X-Title": "Jury flottement chill-meter"},
        )
        with urllib.request.urlopen(req, timeout=420) as r:
            data = json.loads(r.read().decode())
        choice = data["choices"][0]
        finish = choice.get("finish_reason")
        msg = choice["message"]
        results["gpt6"] = (msg.get("content") or "[vide]", finish)
        print(f"[gpt6-astra] OK (finish_reason={finish})")
    except Exception as e:
        results["gpt6"] = (f"[ERREUR gpt6-astra] {e}", None)
        print(f"[gpt6-astra] ERREUR: {e}")


def call_grok(frames, results):
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        results["grok"] = ("[ERREUR] OPENROUTER_API_KEY absente", None)
        return
    content = [{"type": "text", "text": PROMPT}]
    for fp, caption in frames:
        content.append({"type": "text", "text": f"\n[{caption}] :"})
        content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64(fp)}"}})
    payload = {"model": GROK_MODEL, "messages": [{"role": "user", "content": content}],
               "max_tokens": MAX_TOKENS, "temperature": 0.4}
    try:
        print("[grok] envoi...")
        req = urllib.request.Request(
            OPENROUTER_URL, data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json",
                     "HTTP-Referer": "https://kora-cartes.local", "X-Title": "Jury flottement chill-meter"},
        )
        with urllib.request.urlopen(req, timeout=420) as r:
            data = json.loads(r.read().decode())
        choice = data["choices"][0]
        finish = choice.get("finish_reason")
        msg = choice["message"]
        results["grok"] = (msg.get("content") or "[vide]", finish)
        print(f"[grok] OK (finish_reason={finish})")
    except Exception as e:
        results["grok"] = (f"[ERREUR grok] {e}", None)
        print(f"[grok] ERREUR: {e}")


def call_gemini(frames, results):
    try:
        from google import genai
        from google.genai import types
    except ImportError:
        results["gemini"] = ("[ERREUR] SDK google-genai absent", None)
        return
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        results["gemini"] = ("[ERREUR] GEMINI_API_KEY absente", None)
        return
    try:
        client = genai.Client(api_key=key)
        parts = [types.Part.from_text(text=PROMPT)]
        for fp, caption in frames:
            parts.append(types.Part.from_text(text=f"\n[{caption}] :"))
            parts.append(types.Part.from_bytes(data=open(fp, "rb").read(), mime_type="image/jpeg"))
        print("[gemini] envoi...")
        resp = client.models.generate_content(
            model=GEMINI_MODEL, contents=parts,
            config=types.GenerateContentConfig(max_output_tokens=MAX_TOKENS, temperature=0.4),
        )
        finish = None
        try:
            finish = resp.candidates[0].finish_reason
        except Exception:
            pass
        results["gemini"] = (resp.text or "[vide]", finish)
        print(f"[gemini] OK (finish_reason={finish})")
    except Exception as e:
        results["gemini"] = (f"[ERREUR gemini] {e}", None)
        print(f"[gemini] ERREUR: {e}")


def call_kimi(frames, results):
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        results["kimi"] = ("[ERREUR] OPENROUTER_API_KEY absente", None)
        return
    content = [{"type": "text", "text": PROMPT}]
    for fp, caption in frames:
        content.append({"type": "text", "text": f"\n[{caption}] :"})
        content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64(fp)}"}})
    # Kimi K3 : reasoning non-borne peut faire hang sans ce champ (gotcha connu du repo).
    payload = {"model": KIMI_MODEL, "messages": [{"role": "user", "content": content}],
               "max_tokens": MAX_TOKENS, "temperature": 0.4,
               "reasoning": {"max_tokens": 3000}}
    try:
        print("[kimi-k3] envoi...")
        req = urllib.request.Request(
            OPENROUTER_URL, data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json",
                     "HTTP-Referer": "https://kora-cartes.local", "X-Title": "Jury flottement chill-meter"},
        )
        with urllib.request.urlopen(req, timeout=420) as r:
            data = json.loads(r.read().decode())
        choice = data["choices"][0]
        finish = choice.get("finish_reason")
        msg = choice["message"]
        results["kimi"] = (msg.get("content") or msg.get("reasoning") or "[vide]", finish)
        print(f"[kimi-k3] OK (finish_reason={finish})")
    except Exception as e:
        results["kimi"] = (f"[ERREUR kimi-k3] {e}", None)
        print(f"[kimi-k3] ERREUR: {e}")


def main():
    load_env()
    if len(sys.argv) != 3:
        print("Usage: python3 jury-chill-meter-flottement.py <reference-client.png> <notre-rendu.png>")
        sys.exit(1)
    ref_path, rendu_path = sys.argv[1], sys.argv[2]
    for p in (ref_path, rendu_path):
        if not os.path.exists(p):
            print(f"[ERREUR] fichier introuvable: {p}")
            sys.exit(1)

    ref_sm = downscale(ref_path, "reference-client")
    rendu_sm = downscale(rendu_path, "notre-rendu")
    frames = [(ref_sm, "reference-client : capture reelle de son plateau"),
              (rendu_sm, "notre-rendu : le chill meter compose sur notre decor actuel")]

    print(f"\n[jury] 4 voix en parallele, max_tokens={MAX_TOKENS}\n")
    results = {}
    threads = [
        threading.Thread(target=call_gpt6, args=(frames, results)),
        threading.Thread(target=call_grok, args=(frames, results)),
        threading.Thread(target=call_gemini, args=(frames, results)),
        threading.Thread(target=call_kimi, args=(frames, results)),
    ]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    os.makedirs(OUT_DIR, exist_ok=True)
    print("\n" + "=" * 78)
    for voix in ("gpt6", "grok", "gemini", "kimi"):
        text, finish = results.get(voix, ("[non execute]", None))
        out_path = os.path.join(OUT_DIR, f"jury-flottement-{voix}.md")
        with open(out_path, "w") as f:
            f.write(f"# {voix} — finish_reason={finish}\n\n{text}\n")
        tronque = " ⛔ REPONSE TRONQUEE (finish_reason=length)" if finish == "length" else ""
        print(f"\n### {voix.upper()}{tronque}")
        print(f"-> {out_path} ({len(text)} caracteres)")
    print("\n" + "=" * 78)


if __name__ == "__main__":
    main()
