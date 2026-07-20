"""
Test R&D 2026-07-02 (session doctrine 3 chaines tierces) : comparer ce que Gemini/GPT proposent NATIVEMENT
pour la Scene 3 "retour au champ" (16:9 narratif, suite CargoVoyage->PortDechargement) en leur donnant
NOS 3 doctrines fraiches (mise-en-scene, structure narrative, scriptwriting) comme contexte texte, PAS de
brief technique impose (viewBox/groupes) -- on veut voir CE QU'ILS PROPOSENT en scene+description, pas
juste un SVG brut (registre 16:9 riche difficile a tenir en un seul appel SVG). Sortie = texte (proposition
de scene + reflexion), pas un rendu Remotion -- objectif comparatif, pas production.
Usage: python3 scripts/tools/_test-scene3-gemini-gpt.py --provider gemini|gpt --with-ref/--no-ref --out <path>
"""
import argparse, base64, os
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.5"

DOCTRINES = (ROOT / "out/_rnd/gemini-gpt-svg-test/doctrines-combined.txt").read_text(encoding="utf-8")

BRIEF = f"""Tu es un directeur artistique / motion designer expert en scenes narratives SVG pour video
educative (registre "Souverain" : economie/geopolitique africaine, 16:9, style ENCRE MINIMALISTE stick-figure
-- PAS d'illustration vectorielle riche, PAS de visage detaille, registre pictogramme digne).

Voici nos doctrines de mise en scene, tirees d'une analyse de 5 chaines YouTube reelles (Infographics Show,
SimpleHistory, Hypothetically) menee cette session -- lis-les avant de proposer quoi que ce soit :

=== DOCTRINES ===
{DOCTRINES}
=== FIN DOCTRINES ===

CONTEXTE DE LA SEQUENCE (deja codee et validee par le realisateur, ne PAS refaire ces 2 scenes) :
- Scene 1 "CargoVoyage16x9" : plan large parallaxe, un cargo traverse l'ocean d'Afrique de l'Ouest vers
  l'Europe (Suisse), palette qui glisse chaud->froid, horizon parametrique (dunes/cacaoyers -> montagnes
  enneigees), petits cueilleurs de cacao en fond de plan (silhouettes miniatures, geste de recolte en boucle).
- Scene 2 "PortDechargement16x9" : le cargo arrive a quai en Europe, une grue le decharge, une usine a
  l'arriere-plan se colorise progressivement de neutre a "premium" (le paradoxe : la valeur nait a l'arrivee,
  pas au depart) -- un docker regarde la manoeuvre.

TA TACHE -- proposer la SCENE 3, suite narrative directe (meme registre, meme monde) : le realisateur veut
"revenir au producteur oublie" -- pendant que l'usine europeenne prospere (Scene 2), on coupe sur LE MEME
planteur de cacao (deja vu miniature en Scene 1) qui continue exactement le meme geste de recolte, comme si
rien n'avait change pour lui. Le contraste EST le message -- pas de texte explicatif, pas de morale affichee.

Propose :
1. Une DESCRIPTION DETAILLEE de la mise en scene (cadrage, mouvement de camera si besoin, placement du
   planteur, gestion du decor/ciel/horizon, comment tu rendrais visible le "rien n'a change" sans texte).
2. Le RAISONNEMENT : quelles regles de nos doctrines tu appliques et pourquoi (cite les explicitement).
3. Si tu identifies un COMPROMIS ou une TENSION entre nos regles (ex: "echelle realiste" vs "gros plan
   lisible"), explique comment tu le resous.
4. PAS besoin de code SVG brut -- une description suffisamment precise pour qu'un developpeur Remotion/SVG
   puisse la coder ensuite. Sois concret sur les valeurs (echelle approximative, position, palette).

Reponds en francais, texte structure, pas de JSON.
"""

def gen_gemini(has_ref, ref_path, out):
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    parts = [types.Part.from_text(text=BRIEF)]
    if has_ref:
        parts.append(types.Part.from_text(text="\n\nIMAGE JOINTE = notre rendu actuel (v2, deja code) de cette meme Scene 3 -- sers-t-en comme reference de registre/style, mais AMELIORE-la, ne te contente pas de la decrire."))
        parts.append(types.Part.from_bytes(data=Path(ref_path).read_bytes(), mime_type="image/png"))
    print(f"[gemini] {GEMINI_MODEL} test-scene3 (ref={has_ref}) ...")
    resp = client.models.generate_content(model=GEMINI_MODEL, contents=parts)
    out.write_text(resp.candidates[0].content.parts[0].text, encoding="utf-8")
    print(f"[gemini] saved -> {out}")

def gen_gpt(has_ref, ref_path, out):
    import requests
    content = [{"type": "text", "text": BRIEF}]
    if has_ref:
        content.append({"type": "text", "text": "\n\nIMAGE JOINTE = notre rendu actuel (v2, deja code) de cette meme Scene 3 -- sers-t-en comme reference de registre/style, mais AMELIORE-la, ne te contente pas de la decrire."})
        b64 = base64.b64encode(Path(ref_path).read_bytes()).decode()
        content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}})
    payload = {"model": GPT_MODEL, "messages": [{"role": "user", "content": content}]}
    print(f"[gpt] {GPT_MODEL} test-scene3 (ref={has_ref}) ...")
    rr = requests.post("https://openrouter.ai/api/v1/chat/completions",
                       headers={"Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}", "Content-Type": "application/json"},
                       json=payload, timeout=900)
    rr.raise_for_status()
    out.write_text(rr.json()["choices"][0]["message"]["content"], encoding="utf-8")
    print(f"[gpt] saved -> {out}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt"])
    ap.add_argument("--with-ref", action="store_true")
    ap.add_argument("--ref-path", default=str(ROOT / "out/_r-and-d/16x9-narratif/retour-champ-v2-frame350.png"))
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    out = Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
    (gen_gemini if a.provider == "gemini" else gen_gpt)(a.with_ref, a.ref_path, out)

if __name__ == "__main__":
    main()
