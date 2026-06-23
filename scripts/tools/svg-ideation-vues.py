"""
svg-ideation-vues.py — IDEATION de VUES par le LLM qui CONNAIT sa capacite (methode Aziz 2026-06-22).
On joint l'IMAGE-CIBLE deja prouvee a 100%% (le LLM sait donc ce qu'il peut rendre) + le SCRIPT du beat.
On lui demande PLUSIEURS idees de VUES / facons de representer la scene, et d'aller plus loin.
Sortie = idees a EXAMINER (Aziz tranche) -> ensuite on genere l'image-cible de la vue choisie.
Modeles verrouilles : gemini-3.1-pro-preview / openai/gpt-5.5.
Usage:
  python3 scripts/tools/svg-ideation-vues.py --provider gemini|gpt --refs proof.png[,b.png] \
    --script "<texte du beat>" --contexte "<sujet/registre/contraintes>" --out /tmp/x.json
"""
import argparse, base64, os
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_MODEL = "openai/gpt-5.5"

BRIEF = r"""Tu es directeur artistique + illustrateur SVG VECTORIEL. L'IMAGE JOINTE est une scene que TU as deja
generee a 100%% en SVG (registre hachure/encre epuree, vue de coupe). Elle te prouve TON niveau reel de dessin SVG
vectoriel animable : trait brun epure sur creme, hachures schematiques, lignes de construction, colorisation discrete.
Tu connais donc EXACTEMENT ce que tu sais rendre proprement en SVG (et ce que tu ne sais PAS : pas de photoreal, pas
de gravure de musee ultra-dense, pas de vraie carte geo-realiste — ca s'effondre en vectoriel).

NOTRE SYSTEME (rappel) : tu livres une MATIERE SVG statique decoupee en <g id> nommes ; NOUS animons par frame
(apparition, trace stroke-dasharray "se-dessine", croissance) et pilotons la COULEUR (monde mort en encre, vie en couleur).

CONTEXTE / SUJET :
{CONTEXTE}

SCENE A REPRESENTER (texte du beat / voix off) :
{SCRIPT}

MISSION : propose PLUSIEURS DIRECTIONS pour representer CE beat en SVG, en restant dans CE que tu sais faire (calibre
sur l'image jointe) mais en cherchant a ALLER PLUS LOIN / surprendre. Pour chaque idee : la VUE (coupe / profil /
top-down schematique / eclate / sequence...), ce qu'on voit, l'element-cle, le GESTE animable, et pourquoi ca sert le sens.

REPONDS EN JSON STRICT (rien d'autre, pas de ```), forme exacte :
{
  "idees": [
    {"titre":"...", "vue":"...", "description":"ce qu'on voit, compo", "element_cle":"...", "geste_anime":"le mouvement/se-dessine", "pourquoi":"ce que ca fait ressentir / pourquoi ca sert le beat", "faisable_note":"0-10 ta confiance que TU rends ca proprement en SVG"}
  ],
  "reco":"laquelle TU recommandes et pourquoi (1-2 phrases)"
}
Donne 3 a 5 idees DISTINCTES (vraiment differentes, pas des variantes)."""

def run(provider, refs, script, contexte, out):
    prompt = BRIEF.replace("{SCRIPT}", script).replace("{CONTEXTE}", contexte)
    if provider == "gemini":
        from google import genai
        from google.genai import types
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        parts = [types.Part.from_text(text=prompt)]
        for r in refs:
            parts.append(types.Part.from_bytes(data=Path(r).read_bytes(), mime_type="image/png"))
        print(f"[gemini] {GEMINI_MODEL} ideation ...")
        resp = client.models.generate_content(model=GEMINI_MODEL, contents=parts)
        out.write_text(resp.candidates[0].content.parts[0].text, encoding="utf-8")
    else:
        import requests
        content = [{"type": "text", "text": prompt}]
        for r in refs:
            b64 = base64.b64encode(Path(r).read_bytes()).decode()
            content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}})
        payload = {"model": GPT_MODEL, "messages": [{"role": "user", "content": content}]}
        print(f"[gpt] {GPT_MODEL} ideation ...")
        rr = requests.post("https://openrouter.ai/api/v1/chat/completions",
                           headers={"Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}", "Content-Type": "application/json"},
                           json=payload, timeout=600)
        rr.raise_for_status()
        out.write_text(rr.json()["choices"][0]["message"]["content"], encoding="utf-8")
    print(f"[{provider}] saved -> {out}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--provider", required=True, choices=["gemini", "gpt"])
    ap.add_argument("--refs", required=True)
    ap.add_argument("--script", required=True)
    ap.add_argument("--contexte", default="")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    refs = [r for r in a.refs.split(",") if r.strip()]
    out = Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
    run(a.provider, refs, a.script, a.contexte, out)

if __name__ == "__main__":
    main()
