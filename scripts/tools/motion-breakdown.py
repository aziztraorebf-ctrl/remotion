#!/usr/bin/env python3
"""
motion-breakdown.py — RELEVE DE MOUVEMENTS d'un segment video, 2 voix en parallele.

⚠️ CE N'EST PAS une review creative. `da-brief-video-3voix.py` juge la DIRECTION
ARTISTIQUE (5 angles, AI-slop, expert-constructeur). Ici on demande une seule
chose, factuelle : QU'EST-CE QUI BOUGE, DANS QUEL SENS, A QUELLE VITESSE.
Sortie = une liste de gestes a verifier ensuite PAR LA MESURE.

Pourquoi ce script existe (session repro-foster, 2026-08-26) : en analysant ET
codant moi-meme, je regardais les images en pensant deja a l'implementation.
Resultat : 3 defauts majeurs rates (pull back absent, chassis absent, rotation
figee) — tous attrapes par Aziz, pas par moi. Un oeil qui n'a rien a coder les
voit immediatement.

⛔ CE QUE CE SCRIPT NE FAIT PAS : donner des VALEURS. Un modele dira « les images
tournent rapidement », jamais « 83 deg/s ». Les chiffres viennent de la mesure sur
les frames — c'est le travail de l'agent qui code, et il reste obligatoire.

Usage :
  python3 scripts/tools/motion-breakdown.py \\
    --video ref.mp4 --start 13.59 --end 18.03 --label plan05 [--fps 6] [--crop 1920:1080:270:0]

Sorties : /tmp/motion-breakdown/<label>-{gemini,gpt}.md
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import force_ipv4  # noqa: E402,F401 — IPv6 mort en sandbox, doit preceder tout appel reseau

import json  # noqa: E402
import time  # noqa: E402
import base64  # noqa: E402
import argparse  # noqa: E402
import shutil  # noqa: E402
import subprocess  # noqa: E402
import threading  # noqa: E402
import urllib.request  # noqa: E402

from api_models import GPT_TEXT_VISION  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# ⛔ Charger le .env EXPLICITEMENT : da-brief-video-3voix.py ne le fait pas et
# depend d'un shell ou les variables sont deja exportees — d'ou un « API_KEY
# absente » silencieux (paye ici au 1er lancement, seul GPT avait repondu).
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(ROOT, ".env"))
except ImportError:
    pass

OUT_DIR = "/tmp/motion-breakdown"
GEMINI_MODEL = "gemini-3.1-pro-preview"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

PROMPT = """Tu analyses UN SEUL PLAN d'une video promotionnelle (SaaS). Ta seule
mission : RELEVER LES MOUVEMENTS, de facon factuelle et exhaustive.

⛔ Ne juge PAS la qualite, l'esthetique ou la direction artistique. On ne te
demande pas si c'est beau ou efficace. On te demande CE QUI BOUGE.

Reponds dans cet ordre, en francais :

1. INVENTAIRE + TAILLES ET POSITIONS — liste TOUS les elements visibles (texte,
   images, formes, fond, objets). Pour CHACUN, donne :
   - est-il FIXE ou EN MOUVEMENT ?
   - sa TAILLE, en POURCENTAGE DE LA LARGEUR (ou de la hauteur) DU CADRE.
     Ex. « le disque blanc fait ~11 % de la largeur », « le texte occupe 30 % ».
   - sa POSITION : centre de l'element en % du cadre, origine en haut a gauche.
     Ex. « centre a 50 % / 50 % » pour un element parfaitement centre.
   - pour un TEXTE : sa hauteur de capitale en % de la hauteur du cadre.
   ⭐ CES CHIFFRES SONT LA PARTIE LA PLUS UTILE DE TA REPONSE. Estime-les
   soigneusement, meme approximativement — un ordre de grandeur vaut mieux que
   rien. Ne dis jamais « de taille moyenne » : donne un pourcentage.

2. POUR CHAQUE ELEMENT EN MOUVEMENT :
   - la NATURE du geste (translation, rotation, zoom, contraction, fondu,
     changement d'echelle, deformation...)
   - le SENS et la DIRECTION (vers le haut / horaire / vers le centre...)
   - la VITESSE, CHIFFREE quand c'est possible : une rotation en DEGRES PAR
     SECONDE (« ~90 deg/s », « un demi-tour sur le plan »), un deplacement en
     % du cadre par seconde, un zoom en facteur (« x2 en 0,7 s »). Precise si
     elle est CONSTANTE, ACCELEREE ou AMORTIE.
   - AMPLITUDE : de combien l'element se deplace / grandit AU TOTAL
     (« de 20 % a 45 % de la largeur », « il parcourt un demi-cercle »)
   - QUAND il commence et finit dans le plan

3. LA CAMERA — bouge-t-elle ? (zoom avant/arriere, travelling, panoramique,
   rotation) Si oui, dans quel sens et a quelle vitesse ?
   ⚠️ Attention : un objet qui grossit peut etre soit un zoom camera, soit
   l'objet qui grandit. Dis ce que tu observes et l'interpretation la plus
   probable.

4. LES APPARITIONS / DISPARITIONS — a quel moment chaque element entre et sort ?
   Par quel moyen (fondu, coupe franche, glissement, changement d'echelle) ?

5. CE QUI EST FACILE A RATER — quel detail de mouvement passerait inapercu a
   quelqu'un qui regarde vite, mais rendrait la reproduction « cheap » s'il
   etait oublie ? Sois precis et concret.

Sois exhaustif sur le point 5 : c'est le plus utile."""


def build_frames(video, start, end, fps, crop, tmpdir):
    os.makedirs(tmpdir, exist_ok=True)
    vf = f"fps={fps}"
    if crop:
        vf = f"crop={crop},{vf}"
    vf += ",scale=640:-1"
    cmd = ["ffmpeg", "-y", "-v", "error", "-ss", str(start), "-t", str(end - start),
           "-i", video, "-vf", vf, os.path.join(tmpdir, "f_%03d.jpg")]
    subprocess.run(cmd, check=True)
    return sorted(os.path.join(tmpdir, f) for f in os.listdir(tmpdir) if f.endswith(".jpg"))


def cut_segment(video, start, end, crop, out):
    vf = f"crop={crop}" if crop else None
    cmd = ["ffmpeg", "-y", "-v", "error", "-ss", str(start), "-t", str(end - start), "-i", video]
    if vf:
        cmd += ["-vf", vf]
    cmd += ["-an", out]
    subprocess.run(cmd, check=True)
    return out


def call_gemini(prompt, video_path, results):
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
        print("[gemini] upload video...")
        f = client.files.upload(file=video_path)
        for _ in range(60):
            f = client.files.get(name=f.name)
            if f.state == "ACTIVE":
                break
            if f.state == "FAILED":
                results["gemini"] = "[ERREUR] upload FAILED"
                return
            time.sleep(2)
        print("[gemini] ACTIVE, analyse...")
        resp = client.models.generate_content(
            model=GEMINI_MODEL, contents=[f, prompt],
            config=types.GenerateContentConfig(max_output_tokens=4000, temperature=0.3),
        )
        results["gemini"] = resp.text or "[vide]"
        print("[gemini] OK")
    except Exception as e:
        results["gemini"] = f"[ERREUR gemini] {e}"
        print(f"[gemini] ERREUR: {e}")


def call_gpt(prompt, frames, results):
    """⛔ GPT n'accepte PAS la video via OpenRouter (« No endpoints found that
    support input video », verifie 2026-08-03) — on envoie des FRAMES DENSES."""
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        results["gpt"] = "[ERREUR] OPENROUTER_API_KEY absente"
        return
    content = [{"type": "text", "text": prompt + f"\n\n(Tu recois {len(frames)} frames "
                "consecutives, dans l'ordre chronologique, echantillonnees a intervalle "
                "REGULIER sur toute la duree du plan. Traite-les comme une video : le "
                "mouvement se lit dans les differences d'une frame a la suivante.)"}]
    for f in frames:
        with open(f, "rb") as fh:
            b64 = base64.b64encode(fh.read()).decode()
        content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}})
    body = {"model": GPT_TEXT_VISION,
            "messages": [{"role": "user", "content": content}],
            "max_tokens": 4000, "temperature": 0.3}
    req = urllib.request.Request(
        OPENROUTER_URL, data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    try:
        print(f"[gpt] envoi {len(frames)} frames...")
        with urllib.request.urlopen(req, timeout=300) as r:
            data = json.loads(r.read().decode())
        results["gpt"] = data["choices"][0]["message"]["content"]
        print("[gpt] OK")
    except Exception as e:
        results["gpt"] = f"[ERREUR gpt] {e}"
        print(f"[gpt] ERREUR: {e}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--start", type=float, required=True)
    ap.add_argument("--end", type=float, required=True)
    ap.add_argument("--label", required=True)
    ap.add_argument("--fps", type=int, default=6,
                    help="Frames/s pour GPT. 6 = seuil ou un mouvement rapide reste "
                         "lisible d'une frame a l'autre (a 4 fps, 83 deg/s saute de 21 deg).")
    ap.add_argument("--crop", default=None, help="ex. 1920:1080:270:0")
    args = ap.parse_args()

    os.makedirs(OUT_DIR, exist_ok=True)
    tmp = f"/tmp/motion-frames-{args.label}"
    shutil.rmtree(tmp, ignore_errors=True)

    seg = os.path.join(OUT_DIR, f"{args.label}-seg.mp4")
    cut_segment(args.video, args.start, args.end, args.crop, seg)
    frames = build_frames(args.video, args.start, args.end, args.fps, args.crop, tmp)
    print(f"segment {args.end - args.start:.2f} s · {len(frames)} frames a {args.fps} fps")

    results = {}
    threads = [threading.Thread(target=call_gemini, args=(PROMPT, seg, results)),
               threading.Thread(target=call_gpt, args=(PROMPT, frames, results))]
    t0 = time.time()
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    print(f"termine en {time.time() - t0:.0f} s")

    for name in ("gemini", "gpt"):
        p = os.path.join(OUT_DIR, f"{args.label}-{name}.md")
        with open(p, "w") as f:
            f.write(f"# Releve de mouvements — {args.label} ({name})\n")
            f.write(f"Segment {args.start:.2f} -> {args.end:.2f} s\n\n")
            f.write(results.get(name, "[absent]"))
        print(f"  -> {p}")


if __name__ == "__main__":
    main()
