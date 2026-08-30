#!/usr/bin/env python3
"""DA-brief ANIMATION — 4 voix, avec ou SANS reference.

POURQUOI CE SCRIPT (idee d'Aziz, 2026-08-30)
--------------------------------------------
`da-brief-compare-2videos.py` compare notre rendu a une REFERENCE. C'est le bon
outil quand on reproduit une piece existante — mais **ce sera l'exception**.
Des qu'on produit nos propres animations, ou celles d'un client, il n'y a
aucune reference : personne n'a fait la piece avant nous.

D'ou les DEUX modes de ce script :
  --reference X.mp4   comparatif  : « qu'est-ce qui manque vs cette piece ? »
  (sans reference)    autoportant : « juge CETTE animation et fais-la monter »

⭐ Le mode SANS reference est le mode PRINCIPAL. Il ne demande pas au modele de
comparer : il lui demande de se comporter en directeur artistique de motion
design qui recoit un rendu et doit le faire passer au niveau superieur.

LES 4 VOIX (identifiants importes de `api_models.py`, jamais en dur)
--------------------------------------------------------------------
  gemini  — video NATIVE (Files API). Voit le MOUVEMENT, le rythme, les
            transitions. La seule voix qui juge vraiment l'animation.
  kimi    — video NATIVE via l'API Moonshot directe (⛔ pas OpenRouter).
  gpt     — frames seulement (refuse la video). Bon sur la composition,
            la hierarchie, la typographie.
  grok    — frames seulement. 4e voix ajoutee a la demande d'Aziz.

⛔ GEMINI/KIMI/GPT/GROK = SIGNAL, JAMAIS JUGE. Procedure : 1 appel -> verifier
chaque point contre le rendu reel -> appliquer seulement ce qui est vrai -> STOP.
Jamais de boucle appel -> fix -> appel. Le jugement d'Aziz prime.
"""

import argparse
import base64
import json
import os
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, "scripts", "tools"))

from api_models import KIMI, GPT_TEXT_VISION, GROK_TEXT_VISION  # noqa: E402

GEMINI_MODEL = "gemini-3.1-pro-preview"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


# ---------------------------------------------------------------- les briefs

ROLE = """Tu es directeur artistique de MOTION DESIGN, specialiste des animations
d'INTERFACE et d'explication produit (registre SaaS premium : le genre de piece
qu'un studio facture plusieurs milliers de dollars a un editeur de logiciel).

Tu n'es PAS la pour dire si c'est joli. Tu es la pour dire ce qui separe cette
piece d'une piece vendue au prix fort, et COMMENT combler l'ecart."""

CONTRAINTES = """=== NOTRE BOITE A OUTILS (ne propose rien hors de ca) ===
- SVG anime par CODE, frame par frame (React/Remotion). Tout est deterministe.
- Pas d'After Effects, pas de 3D, pas de librairie d'icones externe.
- On sait faire : opacite, position, echelle, rotation, parentage (un objet
  porte par un autre), deformation de trace (morphing), masques/pochoirs,
  degrades, decalages temporels, courbes d'acceleration arbitraires.
- La sortie finale peut etre une video OU un fichier Lottie (JSON) livrable
  au client, qui s'ouvre dans ses outils.
⛔ Si tu proposes une technique, dis en UNE phrase comment elle se fait avec ca.
Une proposition qu'on ne peut pas coder ne nous sert a rien."""

BLOC_RECIT = """## 1. LE RECIT — d'abord, avant toute question de technique
⭐ C'est le bloc le plus important. Reponds-y en premier et sans complaisance.
- En regardant cette animation SANS aucune explication, qu'est-ce que tu
  comprends ? Formule-le en UNE phrase, comme si tu etais un spectateur.
- Combien de SECONDES te faut-il pour comprendre de quoi il s'agit ?
- Qu'est-ce qui reste OBSCUR, ou demande un effort d'interpretation ?
- Y a-t-il un moment ou l'oeil ne sait pas ou regarder ?
- Le rythme SERT-il le propos (on s'arrete quand c'est important, ca va vite
  quand c'est du liant), ou est-il uniforme et indifferent au contenu ?"""

BLOC_MOTION = """## 2. LE MOTION DESIGN — ce qu'un studio premium ferait et qu'on ne fait pas
Sois PRECIS et TECHNIQUE. Pour chaque point : ce qui manque, et le geste exact.
- Les entrees/sorties : simples fondus, ou vrais gestes (decalage, glissement,
  echelle, masque qui revele, rebond, depassement puis retour) ?
- Le DECALAGE temporel entre elements voisins est-il exploite ? A quel point ?
- Les courbes d'acceleration : plates et uniformes, ou differenciees selon le
  role de chaque element ?
- Y a-t-il de l'ANTICIPATION (un petit contre-mouvement avant le mouvement) et
  de la SUITE (un depassement, un retour) ? C'est ce qui distingue le plus
  nettement l'amateur du professionnel.
- La hierarchie : un element PRINCIPAL porte-t-il l'attention, les autres
  restant secondaires ? Ou tout bouge-t-il avec la meme importance ?
- Le CONTINU : y a-t-il des moments morts ou plus rien ne vit a l'ecran ?
- Que ferait un studio premium ICI, precisement, que cette piece ne fait pas ?"""

BLOC_PRIX = """## 3. LE TEST DU PRIX
Une question directe, reponds franchement :
- Cette animation, telle quelle, se vend-elle 200 $ ou 2000 $ ? Pourquoi ?
- Nomme les 3 elements CONCRETS qui font la difference entre les deux prix,
  dans CETTE piece precisement (pas en general)."""

BLOC_ACTIONS = """## 4. LES 3 CORRECTIONS A PLUS FORT IMPACT
Classees par rapport impact/effort. Pour chacune :
- ce qu'on change exactement (quel element, quel moment, quelle valeur)
- le geste technique, dans notre boite a outils
- ce que ca apporte au SPECTATEUR (pas « c'est plus beau » : ce qu'il comprend
  ou ressent mieux)"""

BLOC_ANCRAGE = """## 5. ANCRE TON JUGEMENT DANS DU REEL — pas dans du vocabulaire
⛔ Interdiction d'utiliser les mots « premium », « haut de gamme », « pro » sans
les ADOSSER a un exemple precis. Un conseil generique ne nous sert a rien.
Pour CHACUNE des 3 corrections que tu viens de donner :
- NOMME une piece, un studio, un produit ou une marque REELLE ou ce geste est
  fait, et que nous pourrions aller regarder. Sois specifique (« l'onboarding de
  Linear », « les transitions de Stripe Checkout », « le studio Ordinary Folk »)
  — pas « les bonnes animations SaaS ».
- Dis en une phrase POURQUOI cette reference-la et pas une autre : qu'est-ce
  qu'elle resout que nous ne resolvons pas ?
- Si tu n'es pas SUR qu'une reference existe, dis-le franchement plutot que
  d'en inventer une. Une reference fausse nous coute plus cher qu'une absence."""

BLOC_IDEES = """## 6. L'IDEE QU'ON N'A PAS EUE
⭐ Ce bloc est le plus utile de tous, prends-le au serieux.
Ne bonifie pas : PROPOSE. Une idee d'animation a laquelle nous n'avons
visiblement pas pense, qui rendrait cette piece nettement meilleure. Elle peut
remettre en cause notre approche. Decris-la assez precisement pour qu'on puisse
la coder demain. Une seule idee, mais forte."""


def brief_autoportant(contexte, focus):
    parts = [
        ROLE,
        "",
        "On te montre UNE animation que nous avons produite. Il n'existe pas de",
        "reference : c'est une piece originale. Ton travail est de la juger et de",
        "dire comment la faire monter d'un cran.",
        "",
        f"=== CE QUE LA PIECE EST CENSEE RACONTER ===\n{contexte}"
        if contexte
        else "",
        "",
        "⛔ Ne te contente pas de valider. Si c'est moyen, dis-le et dis pourquoi.",
        "Un retour complaisant ne nous sert a rien.",
        "",
        CONTRAINTES,
        "",
        f"=== POINT D'ATTENTION PRIORITAIRE ===\n{focus}" if focus else "",
        "",
        "=== STRUCTURE DE REPONSE OBLIGATOIRE ===",
        "",
        BLOC_RECIT,
        "",
        BLOC_MOTION,
        "",
        BLOC_PRIX,
        "",
        BLOC_ACTIONS,
        "",
        BLOC_ANCRAGE,
        "",
        BLOC_IDEES,
    ]
    return "\n".join(p for p in parts if p is not None)


def brief_comparatif(contexte, focus):
    parts = [
        ROLE,
        "",
        "On te montre DEUX videos dans cet ordre :",
        "  1. LA REFERENCE — une piece d'un studio qui vend, deja livree a un client.",
        "  2. NOTRE VERSION — notre tentative d'atteindre ce niveau.",
        "",
        f"=== CE QUE NOTRE PIECE EST CENSEE RACONTER ===\n{contexte}"
        if contexte
        else "",
        "",
        "⛔ Ne compare pas les SUJETS (les deux pieces peuvent raconter autre chose) :",
        "compare le NIVEAU DE METIER — recit, rythme, gestes, finition.",
        "",
        CONTRAINTES,
        "",
        f"=== POINT D'ATTENTION PRIORITAIRE ===\n{focus}" if focus else "",
        "",
        "=== STRUCTURE DE REPONSE OBLIGATOIRE ===",
        "",
        "## 0. Verdict en 3 phrases",
        "Notre version est-elle au niveau, en dessous, au-dessus ? Quel est LE",
        "probleme le plus important a corriger en priorite ?",
        "",
        BLOC_RECIT.replace("cette animation", "NOTRE version")
        + "\n- Et la reference, sur ces memes questions : fait-elle mieux ? En quoi ?",
        "",
        BLOC_MOTION
        + "\n- Quels gestes la REFERENCE utilise-t-elle que nous n'utilisons pas ?",
        "",
        BLOC_PRIX,
        "",
        BLOC_ACTIONS,
        "",
        BLOC_ANCRAGE,
        "",
        BLOC_IDEES,
    ]
    return "\n".join(p for p in parts if p is not None)


# ---------------------------------------------------------------- utilitaires


def load_env():
    env = os.path.join(ROOT, ".env")
    if os.path.exists(env):
        for line in open(env):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())


def extraire_frames(video, n, out_dir):
    """N frames reparties, pour les modeles qui refusent la video."""
    os.makedirs(out_dir, exist_ok=True)
    dur = float(
        subprocess.check_output(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=nw=1:nk=1", video]
        ).decode().strip()
    )
    chemins = []
    for i in range(n):
        t = dur * i / max(n - 1, 1) * 0.98
        p = os.path.join(out_dir, f"f{i:02d}.jpg")
        subprocess.run(
            ["ffmpeg", "-v", "error", "-ss", str(t), "-i", video, "-frames:v", "1",
             "-vf", "scale=640:-2", "-q:v", "3", p, "-y"],
            check=True,
        )
        chemins.append(p)
    return chemins


def b64(path):
    return base64.b64encode(open(path, "rb").read()).decode()


# ---------------------------------------------------------------- les 4 voix


def call_gemini(prompt, videos, res):
    try:
        from google import genai
    except ImportError:
        res["gemini"] = "[ERREUR] SDK google-genai absent"
        return
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        res["gemini"] = "[ERREUR] GEMINI_API_KEY absente"
        return
    try:
        client = genai.Client(api_key=key)
        contents = []
        for label, v in videos:
            f = client.files.upload(file=v)
            for _ in range(60):
                f = client.files.get(name=f.name)
                if f.state.name == "ACTIVE":
                    break
                if f.state.name == "FAILED":
                    res["gemini"] = f"[ERREUR] upload FAILED sur {label}"
                    return
                time.sleep(2)
            contents.append(f"=== {label} ===")
            contents.append(f)
        contents.append(prompt)
        r = client.models.generate_content(model=GEMINI_MODEL, contents=contents)
        res["gemini"] = r.text or "[vide]"
    except Exception as e:  # noqa: BLE001
        res["gemini"] = f"[ERREUR gemini] {e}"


def call_kimi(prompt, videos, res):
    """⛔ Video native = API Moonshot DIRECTE, jamais OpenRouter."""
    import urllib.request

    key = os.environ.get("MOONSHOT_API_KEY")
    if not key:
        res["kimi"] = "[ERREUR] MOONSHOT_API_KEY absente"
        return
    content = []
    for label, v in videos:
        content.append({"type": "text", "text": f"=== {label} ==="})
        content.append(
            {"type": "video_url",
             "video_url": {"url": f"data:video/mp4;base64,{b64(v)}"}}
        )
    content.append({"type": "text", "text": prompt})
    payload = {
        "model": KIMI,
        "messages": [{"role": "user", "content": content}],
        "max_tokens": 4000,
    }
    req = urllib.request.Request(
        "https://api.moonshot.ai/v1/chat/completions",
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {key}",
                 "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            d = json.loads(r.read())
        msg = d["choices"][0]["message"]
        # ⚠️ k3 peut ne remplir que `reasoning_content` (cf.
        # memory/tools/kimi-k3-reasoning-borne.md) : on lit les 3 champs.
        res["kimi"] = (
            msg.get("content")
            or msg.get("reasoning_content")
            or msg.get("reasoning")
            or "[vide]"
        )
    except Exception as e:  # noqa: BLE001
        res["kimi"] = f"[ERREUR kimi] {e}"


def call_openrouter(cle, modele, prompt, frames_par_video, res):
    """GPT et Grok : FRAMES seulement, ils refusent la video."""
    import urllib.request

    key = os.environ.get("OPENROUTER_API_KEY")
    if not key:
        res[cle] = "[ERREUR] OPENROUTER_API_KEY absente"
        return
    content = [{"type": "text", "text": prompt}]
    for label, frames in frames_par_video:
        content.append(
            {"type": "text",
             "text": f"\n=== {label} — frames dans l'ordre chronologique "
                     f"(la video elle-meme n'est pas transmissible a ce modele) ==="}
        )
        for p in frames:
            content.append(
                {"type": "image_url",
                 "image_url": {"url": f"data:image/jpeg;base64,{b64(p)}"}}
            )
    payload = {
        "model": modele,
        "messages": [{"role": "user", "content": content}],
        "max_tokens": 4000,
    }
    req = urllib.request.Request(
        OPENROUTER_URL,
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {key}",
                 "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            d = json.loads(r.read())
        msg = d["choices"][0]["message"]
        res[cle] = msg.get("content") or msg.get("reasoning") or "[vide]"
    except Exception as e:  # noqa: BLE001
        res[cle] = f"[ERREUR {cle}] {e}"


# ---------------------------------------------------------------- entree


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--video", required=True, help="NOTRE animation")
    ap.add_argument("--reference", help="Piece de reference (mode comparatif)")
    ap.add_argument("--label", required=True)
    ap.add_argument("--contexte", help="Ce que la piece est censee raconter (1-3 phrases)")
    ap.add_argument("--focus", help="Point d'attention prioritaire")
    ap.add_argument("--frames", type=int, default=10,
                    help="Nb de frames pour GPT/Grok (defaut 10)")
    ap.add_argument("--only", choices=["gemini", "kimi", "gpt", "grok"])
    ap.add_argument("--out-dir", default=os.path.join(ROOT, "out", "_r-and-d", "da-brief-anim"))
    args = ap.parse_args()

    load_env()
    os.makedirs(args.out_dir, exist_ok=True)

    comparatif = bool(args.reference)
    prompt = (brief_comparatif if comparatif else brief_autoportant)(
        args.contexte, args.focus
    )

    videos = ([("LA REFERENCE", args.reference)] if comparatif else []) + [
        ("NOTRE VERSION", args.video)
    ]
    tmp = os.path.join(args.out_dir, f"_frames-{args.label}")
    frames_par_video = [
        (label, extraire_frames(v, args.frames, os.path.join(tmp, label.replace(" ", "_"))))
        for label, v in videos
    ]

    print(f"mode      : {'COMPARATIF (avec reference)' if comparatif else 'AUTOPORTANT (sans reference)'}")
    print(f"videos    : {[v for _, v in videos]}")
    print(f"frames    : {args.frames} par video (pour GPT/Grok)")
    print(f"voix      : gemini + kimi (video native) · gpt + grok (frames)")
    print()

    res = {}
    taches = []
    with ThreadPoolExecutor(max_workers=4) as ex:
        if args.only in (None, "gemini"):
            taches.append(ex.submit(call_gemini, prompt, videos, res))
        if args.only in (None, "kimi"):
            taches.append(ex.submit(call_kimi, prompt, videos, res))
        if args.only in (None, "gpt"):
            taches.append(ex.submit(call_openrouter, "gpt", GPT_TEXT_VISION,
                                    prompt, frames_par_video, res))
        if args.only in (None, "grok"):
            taches.append(ex.submit(call_openrouter, "grok", GROK_TEXT_VISION,
                                    prompt, frames_par_video, res))
        for t in taches:
            t.result()

    mode = "comparatif" if comparatif else "autoportant"
    sortie = os.path.join(args.out_dir, f"{args.label}-{mode}.md")
    with open(sortie, "w", encoding="utf-8") as f:
        f.write(f"# DA-brief ANIMATION — {args.label} ({mode})\n\n")
        if args.contexte:
            f.write(f"> Contexte donne aux modeles : {args.contexte}\n\n")
        f.write("> ⛔ Ces 4 voix sont un SIGNAL, jamais un JUGE. Verifier chaque\n")
        f.write("> point contre le rendu reel avant d'appliquer quoi que ce soit.\n\n")
        for cle, titre in (("gemini", "GEMINI 3.1 Pro (video native)"),
                           ("kimi", f"KIMI {KIMI} (video native)"),
                           ("gpt", f"GPT ({GPT_TEXT_VISION}, frames)"),
                           ("grok", f"GROK ({GROK_TEXT_VISION}, frames)")):
            if cle in res:
                f.write(f"\n---\n\n## {titre}\n\n{res[cle]}\n")
    print(f"-> {sortie}")
    for cle, v in res.items():
        etat = "ERREUR" if v.startswith("[ERREUR") else f"{len(v)} car"
        print(f"   {cle:8} {etat}")


if __name__ == "__main__":
    main()
