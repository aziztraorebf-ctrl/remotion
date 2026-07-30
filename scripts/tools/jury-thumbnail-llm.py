#!/usr/bin/env python3
"""
Jury LLM 4 modeles pour CONCEPTS DE THUMBNAIL YouTube composables en SVG.
Kimi k2.5 (Moonshot) + Gemini 3.1 Pro (Google genai) + GPT-5.5 (OpenRouter) + Grok 4.20 (xAI).

Difference avec le Pipeline C (Gemini web -> image generee) : ici on ne demande AUCUNE image.
On demande des CONCEPTS composables en SVG vectoriel, parce que nos videos SONT du SVG et qu'une
miniature 3D photorealiste cree une rupture d'attente avec le contenu (leçon 2026-07-30 : les 4
images 3D generees par Gemini web pour le CFA etaient hors-registre ET fautives -- "EETATS", "FRAC").

Usage :
    python3 scripts/tools/jury-thumbnail-llm.py <script.md> --contexte "texte" [--out chemin.md]

Doctrines : memory/doctrines/SUJET-PRIME-SUR-PRODUCTION.md (miniature decodable en 0,4 s ;
sujet MATERIEL > meta) · public/_shared/thumbnails-library/README.md (grammaire des thumbnails valides)
· feedback_strategie-vs-chaines-youtube-2026-05.md (Decision 4 : minimalisme intentionnel, l'audience
rejette le clickbait criard -- decodable n'est PAS criard).
"""

import os
import socket
import argparse
import requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv

# Fix connu du projet : IPv6 mort dans le sandbox bloque les SDK Python (cf memory/tools/yt-dlp.md).
_orig_getaddrinfo = socket.getaddrinfo
socket.getaddrinfo = lambda *a, **k: [ai for ai in _orig_getaddrinfo(*a, **k) if ai[0] == socket.AF_INET]

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

MOONSHOT_API_KEY = os.getenv("MOONSHOT_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
XAI_API_KEY = os.getenv("XAI_API_KEY")

BRIEF_TEMPLATE = """Tu es directeur artistique specialise dans les miniatures YouTube pour chaines de
vulgarisation geopolitique et economique haut de gamme.

⛔ LIS D'ABORD CECI : on ne te demande PAS de generer une image, ni de decrire une photo ou un rendu 3D.
On te demande des CONCEPTS composables en SVG VECTORIEL PLAT (formes, traits, aplats, degrades simples,
texte vectoriel). Tout concept qui suppose du photorealisme, une texture de matiere, un rendu 3D, une
profondeur de champ ou un eclairage volumetrique est HORS SUJET et sera ecarte.

## LA CHAINE ET SON MOYEN DE PRODUCTION

"Kora et Cartes" -- vulgarisation geopolitique et economique sur l'Afrique.
Audience : 25-50 ans, curieux eduques + diaspora eduquee.

⭐ POINT CLE : nos videos sont animees ENTIEREMENT en SVG vectoriel (style illustration a plat, trait
fin lumineux, aplats sobres, palette restreinte). Nous composons nous-memes chaque scene en code. Donc :
- Une miniature 3D photorealiste creerait une RUPTURE D'ATTENTE avec le contenu (le spectateur clique
  sur du 3D et tombe sur de l'illustration animee) -- ca abime la retention dans les premieres secondes.
- Nous n'avons AUCUNE contrainte de generation d'image : tout ce qui est descriptible en formes
  vectorielles, nous savons le composer exactement. Ne t'auto-censure pas sur la complexite de la
  composition -- censure-toi uniquement sur le REALISME.

## LA PALETTE ET LA GRAMMAIRE DE L'EPISODE

- Fond de l'episode : bleu nuit profond `#182746`.
- Accent principal : or chaud (`#C9A227` environ) reserve au SENS (ce qui compte, ce qui est en jeu).
- Accent d'alerte : rouge (a doser, jamais decoratif).
- Trait blanc/creme fin pour les contours et les objets.
- Une seule couleur d'accent saturee par image, jamais deux qui se disputent l'oeil.

## LES DEUX MINIATURES DEJA VALIDEES SUR CETTE CHAINE (grammaire a prolonger)

1. Petrole senegalais : un baril noir ENCHAINE de rouge, un afficheur LED rouge "132%", la carte du
   Senegal en contour lumineux, fond bleu nuit avec grille de coordonnees. Texte : "PETROLE : LE PIEGE
   SENEGALAIS ?"
2. Alliance des Etats du Sahel : la carte des trois pays FRACTUREE, fissures rouge incandescent, sceau
   officiel au centre avec halo dore, icones de ressources qui giclent hors de la carte. Texte :
   "SAHEL : LA RUPTURE"

Grammaire commune : UN objet-metaphore central fort, une seule couleur d'accent, un chiffre ou un mot
qui frappe, du texte court, et une lisibilite totale en vignette de 3 cm.

## LES REGLES NON NEGOCIABLES

1. **DECODABLE EN 0,4 SECONDE.** C'est la contrainte maitresse. Mesure interne sur une chaine
   concurrente : a production strictement identique, un ecart de x157 de vues s'expliquait entierement
   par le titre, la miniature et le sujet. Une miniature qui demande un effort de lecture est morte.

2. **DECODABLE N'EST PAS CRIARD.** Notre audience REJETTE ACTIVEMENT le clickbait : pas de visage qui
   hurle, pas de fleche rouge, pas de cercle rouge, pas d'emoji, pas de majuscules sur toute la largeur,
   pas d'expression choquee. Reference editoriale visee : couverture de Bloomberg Businessweek ou
   Financial Times. Sobre, mais avec UNE idee forte.

3. **AUCUN VISAGE HUMAIN, AUCUN PORTRAIT.** Regle absolue de la chaine.

4. **SUJET MATERIEL > SUJET META.** Un objet physique concret bat toujours une abstraction ou un
   schema. ⚠️ Corollaire important : un GRAPHIQUE, une COURBE, un DIAGRAMME ou un SCHEMA explicatif est
   un sujet meta -- ca explique au lieu de raconter, et en vignette ca se lit comme un slide de rapport
   annuel. Preferer une SCENE ou un OBJET qui raconte.

5. **LISIBILITE EN CONDITIONS REELLES.** La miniature sera vue sur un telephone, parfois en plein
   soleil. Un fond bleu nuit sur toute la surface fait disparaitre l'image. Il FAUT un objet principal
   tres contraste occupant au moins 40% de la hauteur, et/ou un halo qui eclaircit localement le fond.
   Dis explicitement, pour ton concept, ce qui garantit sa survie a la lumiere du jour.

6. **NEUTRALITE EDITORIALE STRICTE.** La video explique un mecanisme, elle n'accuse personne. Sont
   PROSCRITS tous les symboles qui suggerent un vol, une domination, une humiliation ou un asservissement
   (chaines qui entravent, main etrangere qui saisit, drapeau qui ecrase un autre, marionnette...).
   Un cadenas ou une cle sont acceptables SI ils lisent comme un MECANISME, pas comme une captivite.

7. **TEXTE GRAVE : 2 a 5 mots MAXIMUM**, en francais, avec les accents corrects.

## LE SCRIPT COMPLET DE LA VIDEO

---
{script_text}
---

## CONTEXTE PARTICULIER

{contexte}

## CE QUE TU DOIS PRODUIRE

Propose 5 CONCEPTS de miniature REELLEMENT DISTINCTS -- pas 5 variantes de la meme idee. Chacun doit
partir d'un moment ou d'une idee DIFFERENTE du script.

Pour chaque concept :

1. **Le titre du concept** (3-5 mots)
2. **L'objet ou la scene centrale** -- ce qui porte l'idee, decrit en termes de FORMES VECTORIELLES
   (pas de matiere, pas de rendu). Est-ce un objet seul, ou une petite scene avec un decor ?
3. **La composition precise** -- ce qui est ou dans le cadre 16:9, les proportions, ce qui occupe
   l'oeil en premier, ce qui vient en second
4. **La palette exacte** -- ou est le fond, ou est l'accent, quelle couleur est reservee a quoi
5. **La garantie de lisibilite** -- pourquoi ce concept survit en vignette de 3 cm ET en plein soleil
6. **Le texte grave** (2-5 mots, accents corrects)
7. **Le ressort psychologique** -- quelle question ou quelle emotion ca declenche en une demi-seconde
8. **Le risque** -- ce qui pourrait ne pas fonctionner (chaque concept en a un, sois honnete)
9. **Verification de neutralite** -- en une phrase : ce concept accuse-t-il quelqu'un ? Si oui, corrige-le.

Au moins 2 de tes 5 concepts doivent proposer une VRAIE SCENE NARRATIVE (un petit decor ou il se passe
quelque chose, avec une temporalite implicite) et non un objet isole sur fond uni -- une scene retient
mieux qu'un pictogramme.

Classe tes 5 concepts du plus fort au plus faible, et termine par une section "RECOMMANDATION FINALE" :
lequel tu publierais et pourquoi celui-la plutot que le second.

Reponds en francais."""


def call_kimi(brief):
    if not MOONSHOT_API_KEY:
        return "ERROR: MOONSHOT_API_KEY missing"
    payload = {
        "model": "kimi-k2.5",
        "messages": [{"role": "user", "content": brief}],
        "max_tokens": 8000,
    }
    try:
        r = requests.post(
            "https://api.moonshot.ai/v1/chat/completions",
            headers={"Authorization": f"Bearer {MOONSHOT_API_KEY}", "Content-Type": "application/json"},
            json=payload, timeout=300,
        )
        if r.status_code != 200:
            return f"ERROR Kimi {r.status_code}: {r.text[:500]}"
        msg = r.json()["choices"][0]["message"]
        return msg.get("content") or msg.get("reasoning_content") or ""
    except Exception as e:
        return f"EXCEPTION Kimi: {e}"


def call_gemini(brief):
    if not GEMINI_API_KEY:
        return "ERROR: GEMINI_API_KEY missing"
    try:
        import google.genai as genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-3.1-pro-preview",
            contents=[brief],
        )
        return response.text
    except Exception as e:
        return f"ERROR Gemini: {e}"


def call_gpt(brief):
    if not OPENROUTER_API_KEY:
        return "ERROR: OPENROUTER_API_KEY missing"
    payload = {
        "model": "openai/gpt-5.5",
        "messages": [{"role": "user", "content": brief}],
    }
    try:
        r = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json"},
            json=payload, timeout=300,
        )
        if r.status_code != 200:
            return f"ERROR GPT {r.status_code}: {r.text[:500]}"
        return r.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"EXCEPTION GPT: {e}"


def call_grok(brief):
    if not XAI_API_KEY:
        return "ERROR: XAI_API_KEY missing"
    payload = {
        "model": "grok-4.20-reasoning",
        "messages": [{"role": "user", "content": brief}],
    }
    try:
        r = requests.post(
            "https://api.x.ai/v1/chat/completions",
            headers={"Authorization": f"Bearer {XAI_API_KEY}", "Content-Type": "application/json"},
            json=payload, timeout=300,
        )
        if r.status_code != 200:
            return f"ERROR Grok {r.status_code}: {r.text[:500]}"
        msg = r.json()["choices"][0]["message"]
        return msg.get("content") or msg.get("reasoning_content") or ""
    except Exception as e:
        return f"EXCEPTION Grok: {e}"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("fichier", help="Chemin du fichier .md contenant le script complet")
    parser.add_argument("--contexte", default="", help="Contexte (duree, registre visuel, contraintes)")
    parser.add_argument("--out", default=None, help="Chemin de sortie (defaut: <fichier>-jury-thumbnail.md)")
    args = parser.parse_args()

    script_text = Path(args.fichier).read_text(encoding="utf-8")
    brief = BRIEF_TEMPLATE.format(contexte=args.contexte, script_text=script_text)

    print(f"Script lu : {args.fichier} ({len(script_text)} caracteres)")
    print("Appel des 4 modeles en parallele (Kimi, Gemini, GPT, Grok)...\n")

    results = {}
    with ThreadPoolExecutor(max_workers=4) as ex:
        futures = {
            ex.submit(call_kimi, brief): "kimi-k2.5",
            ex.submit(call_gemini, brief): "gemini-3.1-pro-preview",
            ex.submit(call_gpt, brief): "gpt-5.5",
            ex.submit(call_grok, brief): "grok-4.20-reasoning",
        }
        for fut in as_completed(futures):
            name = futures[fut]
            try:
                results[name] = fut.result()
            except Exception as e:
                results[name] = f"EXCEPTION: {e}"
            print(f"  [OK] {name}")

    out_path = args.out or (str(Path(args.fichier).with_suffix("")) + "-jury-thumbnail.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"# Jury LLM concepts thumbnail SVG (4 modeles) - {Path(args.fichier).name}\n\n")
        f.write(f"> Contexte : {args.contexte}\n")
        for name, verdict in results.items():
            f.write(f"\n\n---\n## {name}\n\n{verdict}\n")

    for name, verdict in results.items():
        print(f"\n\n{'='*80}\n{name}\n{'='*80}\n")
        print(verdict)

    print(f"\n\n--- Sauvegarde complete dans {out_path} ---")


if __name__ == "__main__":
    main()
