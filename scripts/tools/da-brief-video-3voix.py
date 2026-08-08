#!/usr/bin/env python3
"""
da-brief-video-3voix.py — DA-BRIEF-GATE upstream à 3 voix avec VIDEO NATIVE (Gemini + Kimi)
+ frames dense (GPT-5.6 Sol, qui n'accepte pas la video via OpenRouter — verifie 2026-08-03,
erreur "No endpoints found that support input video", meme limite que Kimi via OpenRouter).

Reutilise les blocs ANGLES/AISLOP_UPSTREAM/EXPERT_UPSTREAM de da-brief.py (memes 5 angles +
AI-slop + expert-constructeur qui ont fait le succes du protocole DA-BRIEF-GATE) — copie
textuelle volontaire (pas d'import croise) pour garder ce script autonome et lisible.

Usage :
  python3 scripts/tools/da-brief-video-3voix.py \\
    --brief path/to/brief.txt --label gazoduc-acte1 --video path/to/proto.mp4 \\
    --frame path/to/f1.jpg --frame path/to/f2.jpg ... (frames pour GPT-5.6 Sol)

Bloc EXPERT : générique par défaut (EXPERT_BLOCK_EXTERNAL_REF, pour breakdown d'une référence
externe déjà finie — ex. portfolio Fiverr). Ajouter --cartographic-upstream pour le bloc
cartographique Souverain (prototype interne 16s -> acte 84.68s) — sinon le modèle hallucine une
extension cartographique hors-sujet (constaté 2026-08-08, test breakdown MOCH-IT).

Sorties : /tmp/da-refs/da-<label>-{gemini,kimi,gpt56sol}.md
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import force_ipv4  # noqa: E402,F401 — DOIT s'importer avant tout appel réseau (IPv6 mort en sandbox)

import json
import time
import base64
import argparse
import subprocess
import threading
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = "/tmp/da-refs"
GEMINI_MODEL = "gemini-3.1-pro-preview"
KIMI_MODEL = "kimi-k2.5"  # API Moonshot directe (PAS OpenRouter) — seul chemin video native
KIMI_MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions"
GPT56_MODEL = "openai/gpt-5.6-sol"  # via OpenRouter — video refusee, frames seulement
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# ── mêmes 5 angles que da-brief.py (ANGLES_BLOCK) — copie volontaire, garder synchronisé à la main
# si la doctrine évolue (cf memory/doctrines/DA-BRIEF-GATE.md).
ANGLES_BLOCK = """

=== ANGLES OBLIGATOIRES (réponds à CHACUN, c'est le coeur de la review) ===
1. SPECTATEUR LAMBDA : quelqu'un qui ne connaît PAS le sujet — que comprend-il à chaque instant ?
   Où décroche-t-il ? Sait-il toujours où regarder (hiérarchie du regard) ?
2. NARRATION / SYNCHRO : ce qui APPARAÎT à l'écran suit-il la voix ? Le visuel accompagne-t-il le
   récit (un "beat" visuel par idée), ou est-il en décalage / redondant avec ce que la voix dit déjà ?
3. TRANSITIONS vs ÉTATS : a-t-on des ÉTATS figés ("diapos") ou de vraies TRANSITIONS animées ?
   Les enchaînements entre moments fonctionnent-ils, ou y a-t-il des cuts secs / temps morts ?
4. AI-SLOP : qu'est-ce qui CRIE "généré par IA / amateur / procédural mal maîtrisé" ? (couleurs,
   typo, éléments sans fonction, surcharge, manque d'espace négatif, easing robotique). Sois technique.
5. EXPERT DU MÉTIER : qu'est-ce qu'un pro reconnu du genre jugerait raté / ferait autrement / mettrait
   là où il n'y a rien (ou retirerait) ? Ce qui fait la différence pro/amateur.
Pour CHAQUE point : le problème + une PISTE concrète dans NOTRE stack (pas d'After Effects/3D/blur CSS).
"""

EXPERT_BLOCK_UPSTREAM = """

=== SECTION OBLIGATOIRE — EXPERT CONSTRUCTEUR (préventif, sur un PROTOTYPE partiel) ===
Tu es un EXPERT reconnu du motion design cartographique documentaire. On te montre un PROTOTYPE
DE TEST (16s), pas le rendu final (84.68s). Réponds à TROIS questions :
1. SI TU CONSTRUISAIS L'ACTE 1 COMPLET (84.68s) À PARTIR DE CE PROTOTYPE : par quoi tu
   continuerais après les 16 premières secondes, dans quel ordre, quelles animations/transitions
   tu mettrais où, pour que les 85 secondes ne traînent JAMAIS ?
2. PIÈGES À ÉVITER dès maintenant vu ce que le prototype montre déjà (couleurs, rythme, lisibilité).
3. ENCHAÎNEMENT POUR LA COMPRÉHENSION : comment séquencer pour qu'un spectateur qui ne connaît
   pas le sujet comprenne tout, sans surcharge, à chaque instant ? Où mettre les respirations ?
CONTRAINTE ABSOLUE : reste dans NOTRE boîte à outils (SVG/D3 frame-driven en React/Remotion,
projection orthographique 2D, PAS de 3D/WebGL/After Effects/particules volumétriques). Décris
l'INTENTION visuelle, jamais de code — nous traduisons nous-mêmes dans notre stack.
"""

# Générique (repris tel quel de da-brief.py EXPERT_BLOCK, PAS la variante _UPSTREAM ci-dessus qui
# est câblée pour un PROTOTYPE INTERNE cartographique Souverain 84.68s). À utiliser pour breakdown
# d'une RÉFÉRENCE EXTERNE déjà finie (ex. portfolio Fiverr) — sinon le modèle hallucine une
# extension cartographique hors-sujet (constaté 2026-08-08, test breakdown MOCH-IT/feel-good).
EXPERT_BLOCK_EXTERNAL_REF = """

=== SECTION OBLIGATOIRE — POINT DE VUE DE L'EXPERT ===
Joue le rôle d'un EXPERT reconnu du motion design (le genre des meilleures productions du domaine).
Sans concession. Réponds à DEUX points de vue distincts :
1. L'EXPERT qui connaît le métier : qu'est-ce qu'il regarderait en premier ? Quelles parties
   il jugerait ratées / amateures ? Qu'est-ce qui manque qui ferait la différence pro/amateur ?
   Quelles animations/transitions un pro mettrait là où on ne met rien (ou l'inverse) ?
2. LE SPECTATEUR lambda : qu'est-ce qu'il cherche, comprend, ressent ? Où décroche-t-il ?
CONTRAINTE ABSOLUE : reste dans NOTRE boîte à outils — (1) SVG animé frame-driven (formes géométriques
dessinées maison, déformation de paths, jauges/compteurs/cascades), (2) ICÔNES LUCIDE (lucide-react installé,
~1500 icônes nettes posables/animables), (3) sprites Gemini + PixelLab, opacité/couleurs/timing/caméra frame-driven,
(4) clips MiniMax H3 (image-to-video) pour l'incarnation humaine si le sujet l'exige. NE PROPOSE PAS de 3D,
geo-layers, particules volumétriques, After Effects. L'expertise s'exprime DANS nos contraintes — ce qu'un pro
ferait de mieux AVEC LES MÊMES OUTILS, pas un rêve infaisable.
"""


def load_env():
    env = os.path.join(ROOT, ".env")
    if os.path.exists(env):
        for line in open(env):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())


def downscale_frame(path):
    os.makedirs(OUT_DIR, exist_ok=True)
    base = os.path.splitext(os.path.basename(path))[0]
    out = os.path.join(OUT_DIR, f"da3v-{base}-sm.jpg")
    subprocess.run(
        ["ffmpeg", "-y", "-i", path, "-vf", "scale=1280:-1", "-q:v", "4", out],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True,
    )
    return out


def b64_file(path):
    return base64.b64encode(open(path, "rb").read()).decode()


def build_prompt(brief_path, cartographic_upstream=False):
    prompt = open(brief_path, encoding="utf-8").read()
    prompt += ANGLES_BLOCK
    prompt += EXPERT_BLOCK_UPSTREAM if cartographic_upstream else EXPERT_BLOCK_EXTERNAL_REF
    return prompt


def call_gemini_video(prompt, video_path, max_tokens, results):
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
        print("[gemini] video ACTIVE, envoi prompt...")
        resp = client.models.generate_content(
            model=GEMINI_MODEL, contents=[f, prompt],
            config=types.GenerateContentConfig(max_output_tokens=max_tokens, temperature=0.4),
        )
        results["gemini"] = resp.text or "[vide]"
        print("[gemini] OK")
    except Exception as e:
        results["gemini"] = f"[ERREUR gemini] {e}"
        print(f"[gemini] ERREUR: {e}")


def call_kimi_video(prompt, video_path, max_tokens, results):
    """API Moonshot NATIVE (pas OpenRouter) — seul chemin qui accepte la video, en base64
    uniquement (cf memory/tools/kimi-video-native-base64.md). temperature FORCEE a 1."""
    key = os.getenv("MOONSHOT_API_KEY") or os.getenv("OPENROUTER_API_KEY")
    moonshot_key = os.getenv("MOONSHOT_API_KEY")
    if not moonshot_key:
        results["kimi"] = "[ERREUR] MOONSHOT_API_KEY absente (video native Kimi exige l'API Moonshot directe, pas OpenRouter)"
        return
    try:
        print("[kimi] encodage base64 video...")
        video_b64 = b64_file(video_path)
        content = [
            {"type": "text", "text": prompt},
            {"type": "video_url", "video_url": {"url": f"data:video/mp4;base64,{video_b64}"}},
        ]
        payload = {"model": KIMI_MODEL, "messages": [{"role": "user", "content": content}],
                   "max_tokens": max_tokens, "temperature": 1}
        print("[kimi] envoi (API Moonshot native)...")
        req = urllib.request.Request(
            KIMI_MOONSHOT_URL, data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {moonshot_key}", "Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=300) as r:
            data = json.loads(r.read().decode())
        msg = data["choices"][0]["message"]
        results["kimi"] = msg.get("content") or msg.get("reasoning") or "[vide]"
        print("[kimi] OK")
    except Exception as e:
        results["kimi"] = f"[ERREUR kimi] {e}"
        print(f"[kimi] ERREUR: {e}")


def call_gpt56sol_frames(prompt, frames, max_tokens, results):
    """GPT-5.6 Sol via OpenRouter — VIDEO REFUSEE (teste 2026-08-03, 404 'No endpoints found
    that support input video'). On envoie donc des frames denses a la place."""
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        results["gpt56sol"] = "[ERREUR] OPENROUTER_API_KEY absente"
        return
    content = [{"type": "text", "text": prompt + "\n\n=== FRAMES (extraites du prototype video, ordre chronologique — la video elle-meme n'est pas transmissible a ce modele) ==="}]
    for fp in frames:
        content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64_file(fp)}"}})
    payload = {"model": GPT56_MODEL, "messages": [{"role": "user", "content": content}],
               "max_tokens": max_tokens, "temperature": 0.4}
    try:
        print("[gpt56sol] envoi...")
        req = urllib.request.Request(
            OPENROUTER_URL, data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json",
                     "HTTP-Referer": "https://kora-cartes.local", "X-Title": "Kora Cartes DA Brief"},
        )
        with urllib.request.urlopen(req, timeout=300) as r:
            data = json.loads(r.read().decode())
        msg = data["choices"][0]["message"]
        results["gpt56sol"] = msg.get("content") or msg.get("reasoning") or "[vide]"
        print("[gpt56sol] OK")
    except Exception as e:
        results["gpt56sol"] = f"[ERREUR gpt56sol] {e}"
        print(f"[gpt56sol] ERREUR: {e}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--brief", required=True)
    ap.add_argument("--label", required=True)
    ap.add_argument("--video", required=True, help="Video du prototype (Gemini + Kimi natif)")
    ap.add_argument("--frame", action="append", default=[], help="Frame pour GPT-5.6 Sol (repetable)")
    ap.add_argument("--max-tokens", type=int, default=16000)
    ap.add_argument("--only", choices=["gemini", "kimi", "gpt56sol"], default=None)
    ap.add_argument("--cartographic-upstream", action="store_true",
                     help="Bloc EXPERT cartographique Souverain (prototype 16s -> acte 84.68s). "
                          "SANS ce flag (défaut) : bloc EXPERT générique, pour breakdown de "
                          "référence externe déjà finie (ex. portfolio Fiverr).")
    args = ap.parse_args()

    load_env()
    if not os.path.exists(args.brief):
        print(f"[ERREUR] brief introuvable: {args.brief}"); sys.exit(1)
    if not os.path.exists(args.video):
        print(f"[ERREUR] video introuvable: {args.video}"); sys.exit(1)

    frames_sm = []
    for fp in args.frame:
        if not os.path.exists(fp):
            print(f"[ERREUR] frame introuvable: {fp}"); sys.exit(1)
        frames_sm.append(downscale_frame(fp))
    print(f"[frames] {len(frames_sm)} frame(s) downscalees pour GPT-5.6 Sol")

    prompt = build_prompt(args.brief, cartographic_upstream=args.cartographic_upstream)
    print(f"\n[brief] {len(prompt)} chars -> gemini(video) + kimi(video) + gpt56sol({len(frames_sm)} frames)\n")

    results = {}
    targets = []
    if args.only in (None, "gemini"):
        targets.append(threading.Thread(target=call_gemini_video, args=(prompt, args.video, args.max_tokens, results)))
    if args.only in (None, "kimi"):
        targets.append(threading.Thread(target=call_kimi_video, args=(prompt, args.video, args.max_tokens, results)))
    if args.only in (None, "gpt56sol"):
        targets.append(threading.Thread(target=call_gpt56sol_frames, args=(prompt, frames_sm, args.max_tokens, results)))
    for t in targets: t.start()
    for t in targets: t.join()

    os.makedirs(OUT_DIR, exist_ok=True)
    for name in ("gemini", "kimi", "gpt56sol"):
        if name in results:
            out = os.path.join(OUT_DIR, f"da-{args.label}-{name}.md")
            open(out, "w", encoding="utf-8").write(results[name])
            print(f"[sauvegarde] {name} -> {out} ({len(results[name])} chars)")


if __name__ == "__main__":
    main()
