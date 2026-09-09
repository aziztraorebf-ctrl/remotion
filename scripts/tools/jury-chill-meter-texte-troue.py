#!/usr/bin/env python3
"""
jury-chill-meter-texte-troue.py — jury externe A USAGE UNIQUE (ce probleme precis).

Contexte : un pochoir binaire (masque) sert a isoler du texte grave-en-relief sur une
plaque metal texturee, pour n'en recolorer que le texte (pas la plaque) via un masque SVG.
Le pochoir actuel, extrait par segmentation morphologique du relief (top-hat sur la
luminance), a des trous a l'interieur de certaines lettres — la cliente a vu le defaut a
l'oeil nu (lettres partiellement grises au lieu de pleinement colorees). Plusieurs
raffinements de la MEME methode (seuils, fermeture morphologique) ont echoue : soit
insuffisant, soit fusionne les lettres, soit ramasse du bruit de texture parasite.
Objectif : 4 voix EXTERNES independantes, sans le contexte biaise du repo, pour challenger
la methode elle-meme (segmentation pixel par relief) et proposer une meilleure approche.

Usage :
  python3 scripts/tools/jury-chill-meter-texte-troue.py

Sorties : /tmp/da-refs/jury-texte-troue-<voix>.md (une par modele) + resume console.
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import force_ipv4  # noqa: E402,F401 — DOIT s'importer avant tout appel reseau (IPv6 mort en sandbox)

import json
import base64
import threading
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = "/tmp/da-refs"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MAX_TOKENS = 24000

# ⛔ Jamais d'identifiant en dur : la source de verite est api_models.py.
from api_models import GPT_SOL as GPT6_MODEL, GROK_TEXT_VISION as GROK_MODEL, KIMI  # noqa: E402

GEMINI_MODEL = "gemini-3.1-pro-preview"   # dernier PRO existant (la serie 3.5+ est Flash only)
KIMI_MODEL = KIMI


def load_env():
    env = os.path.join(ROOT, ".env")
    if os.path.exists(env):
        for line in open(env):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())


def b64(path):
    return base64.b64encode(open(path, "rb").read()).decode()


PROMPT = """Tu es consulte comme AVIS EXTERNE INDEPENDANT sur un probleme de traitement
d'image / vision par ordinateur. Tu n'as aucun autre contexte que ce qui suit — ne suppose
rien au-dela.

CONTEXTE TECHNIQUE : une plaque metallique texturee (grunge, rouille, reflets) porte un mot
grave en RELIEF EMBOSSE (pas peint, pas en creux — un relief physique sculpte dans le metal,
avec un lisere clair fin sur un bord et une ombre portee sur le bord oppose). L'objectif est
d'isoler ce texte par un MASQUE BINAIRE (pochoir) precis, pour pouvoir recolorer UNIQUEMENT
le texte (le rendre lumineux) sans toucher a la plaque autour, qui doit garder sa texture
d'origine intacte.

CE QUI A DEJA ETE MESURE :
- La luminance de la zone est UNIMODALE (pas de coude net dans l'histogramme) : les faces
  eclairees des lettres (~110-125/255) chevauchent les reflets du metal environnant
  (~90-100/255). Un seuil de luminance global ne peut donc PAS separer texte et metal.
- Une methode par TOP-HAT MORPHOLOGIQUE (lum - ouverture grise 7x7, seuil ~70) isole le
  lisere fin du relief (bord clair) sans repondre au grain plus large de la rouille — measure
  p99=120 vs p50=10 sur ce filtre. Combine a une detection d'ombre portee locale (luminance
  sous la moyenne locale glissante), puis fermeture morphologique + remplissage des trous
  (`binary_fill_holes`), ca donne un masque qui SUIT le trace reel du texte au pixel pres —
  MAIS le contour est par endroits INCOMPLET (le lisere ou l'ombre ratent un segment sur
  certaines lettres a jambages fins ou courbes complexes, ex: 'i', 'l', 'G'), donc
  `fill_holes` ne peut pas refermer ces trous : le "trou" fuit vers l'exterieur du contour
  au lieu d'etre rempli, laissant l'interieur de CES lettres precises non couvert par le
  masque.

CE QUI A DEJA ETE TENTE ET A ECHOUE (ne pas re-proposer sans variante substantielle) :
1. Fermeture morphologique du masque final (`binary_closing`) : noyau 5x5 insuffisant
   (trous persistent), noyau 9x9 ou 11x11 FUSIONNE les lettres adjacentes entre elles
   (deforme completement les glyphes, illisible).
2. Seuils du top-hat/ombre abaisses progressivement (plus permissifs) : comble mieux les
   lettres troueees, MAIS capte de plus en plus de bruit de texture (taches de rouille
   isolees hors du texte) ; au seuil le plus bas teste, les 2 symboles decoratifs (petits,
   fins) disparaissent completement du masque tellement le bruit domine.
3. Masque hybride (garder dans un masque permissif seulement les composantes connexes qui
   touchent geographiquement un masque strict dilate) : reduit un peu le bruit parasite mais
   insuffisant, taches parasites encore visibles hors du texte.
4. Reconstituer le texte en police vectorielle de substitution (Arial Black) cale sur la
   position mesuree : ABANDONNE, la police ne correspond pas a la vraie typo gravee — une
   derive cumulee d'une largeur de lettre complete a ete mesuree sur la fin du mot.

Tu recois 3 images :
1. [defaut-vu-a-loeil] : un rendu final ou le defaut est visible SANS ZOOM — certaines
   lettres du texte "AbiGirl Reacts" restent partiellement grises/metal au lieu d'etre
   pleinement colorees en bleu clair, alors que d'autres lettres sont pleinement colorees.
2. [masque-actuel-troue] : le pochoir binaire actuel isole (fond noir, texte en blanc =
   zone qui doit s'allumer). On y voit les trous internes qui causent le defaut.
3. [plaque-source-nue] : l'image source AVANT tout traitement — la plaque metal avec le
   texte grave, dans son etat naturel (pas de masque, pas de couleur ajoutee).

CONTRAINTE ABSOLUE (mot pour mot, exigee par la cliente finale du produit) : « I want only
the wording and symbols to light up blue — not the plaque/nameplate or the metal behind
them. Please make sure the wording and symbols stay sharp and not blurry. » Donc : le texte
doit etre PLEINEMENT et NETTEMENT colore (pas de flou, pas de zones partielles), et la
plaque autour ne doit JAMAIS changer de texture/couleur.

QUESTIONS :
1. Le choix de la segmentation par RELIEF (top-hat + ombre locale) est-il la bonne approche
   de depart pour ce type de texture (relief embosse sur fond bruite/unimodal en luminance),
   ou existe-t-il une technique de vision par ordinateur mieux adaptee a ce cas precis (ex :
   gradient directionnel oriente selon l'angle de la lumiere du relief, transformee de
   distance + watershed, detection de contours actifs/snakes, template matching par lettre,
   autre) ?
2. Comment reboucher PROPREMENT les trous internes d'un contour PARTIELLEMENT ferme sans
   fusionner les lettres voisines ET sans capter le bruit de texture environnant — sachant
   que la fermeture morphologique globale a echoue dans les 2 sens (trop faible = trous,
   trop forte = fusion) ?
3. Est-ce que travailler lettre par lettre (composante connexe individuelle + traitement
   local a chaque bounding box) plutot que sur l'image entiere changerait la donne ? Si oui,
   quel critere utiliser pour regrouper les bons fragments (relief clair + ombre) appartenant
   a UNE MEME lettre quand ils sont geometriquement disjoints (ex: le point du 'i', la barre
   du 'l') ?
4. Donne un diagnostic tranche et une recommandation concrete, avec le nom de la ou des
   fonctions/techniques precises a utiliser (ex: `cv2.findContours` + strategie de
   retrieval, `skimage.morphology.reconstruction`, etc.) — pas de generalites.

Reponds de facon structuree et concrete, en listant des techniques ACTIONNABLES et
IMPLEMENTABLES en Python (numpy/scipy/opencv/skimage). Sois direct si tu juges que
l'approche par relief est fondamentalement mal adaptee et qu'il faut en changer entierement.
"""


def call_model(model_key, model_id, frames, results):
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        results[model_key] = ("[ERREUR] OPENROUTER_API_KEY absente", None)
        return
    content = [{"type": "text", "text": PROMPT}]
    for fp, caption in frames:
        content.append({"type": "text", "text": f"\n[{caption}] :"})
        content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64(fp)}"}})
    payload = {"model": model_id, "messages": [{"role": "user", "content": content}],
               "max_tokens": MAX_TOKENS, "temperature": 0.4}
    try:
        print(f"[{model_key}] envoi...")
        req = urllib.request.Request(
            OPENROUTER_URL, data=json.dumps(payload).encode(),
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json",
                     "HTTP-Referer": "https://kora-cartes.local", "X-Title": "Jury texte troue chill-meter"},
        )
        with urllib.request.urlopen(req, timeout=420) as r:
            data = json.loads(r.read().decode())
        choice = data["choices"][0]
        finish = choice.get("finish_reason")
        msg = choice["message"]
        results[model_key] = (msg.get("content") or "[vide]", finish)
        print(f"[{model_key}] OK (finish_reason={finish})")
    except Exception as e:
        results[model_key] = (f"[ERREUR {model_key}] {e}", None)
        print(f"[{model_key}] ERREUR: {e}")


def main():
    load_env()
    frames = [
        (os.path.join(OUT_DIR, "defaut-vu-par-aziz.jpg"), "defaut-vu-a-loeil"),
        (os.path.join(OUT_DIR, "masque-actuel-troue.png"), "masque-actuel-troue"),
        (os.path.join(OUT_DIR, "bandeau-source-nu.png"), "plaque-source-nue"),
    ]
    for fp, _ in frames:
        if not os.path.exists(fp):
            print(f"[ERREUR] fichier manquant : {fp}")
            sys.exit(1)

    results = {}
    threads = [
        threading.Thread(target=call_model, args=("gpt6-astra", GPT6_MODEL, frames, results)),
        threading.Thread(target=call_model, args=("grok", GROK_MODEL, frames, results)),
        threading.Thread(target=call_model, args=("gemini", GEMINI_MODEL, frames, results)),
        threading.Thread(target=call_model, args=("kimi", KIMI_MODEL, frames, results)),
    ]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    os.makedirs(OUT_DIR, exist_ok=True)
    for key, (content, finish) in results.items():
        out_path = os.path.join(OUT_DIR, f"jury-texte-troue-{key}.md")
        with open(out_path, "w") as f:
            f.write(f"# Jury texte troue — {key} (finish_reason={finish})\n\n{content}\n")
        print(f"-> {out_path}")

    print("\n=== RESUME ===")
    for key, (content, finish) in results.items():
        flag = " ⚠️ TRONQUE" if finish == "length" else ""
        print(f"\n--- {key}{flag} ---")
        print(content[:400] + ("..." if len(content) > 400 else ""))


if __name__ == "__main__":
    main()
