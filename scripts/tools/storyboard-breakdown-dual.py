"""BREAKDOWN JSON croise : chaque modele decompose SES PROPRES storyboards multi-planche (il sait ce qu'il
a voulu dessiner). Gemini breakdowne ses 2 planches, GPT(via OpenRouter, vision) breakdowne ses 2 planches.
But : obtenir une recette technique codable en Remotion (timing, calques, assets a generer, couleurs, etapes).
Puis on FUSIONNE le meilleur des deux.

Sortie : /tmp/breakdown/<moment>-<modele>.json (+ .md si texte)
"""
import os, sys, base64, json, time, requests
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")
OUT = Path("/tmp/breakdown"); OUT.mkdir(exist_ok=True)
SB = Path("/tmp/storyboard-gen")

GEMINI_MODEL = "gemini-3.1-pro-preview"  # vision breakdown (pas le flash image)
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_KEY}"
GPT_MODEL = "openai/gpt-5.4-image-2"  # ou un vision GPT via OpenRouter
GPT_VISION = "openai/gpt-5.5"  # vision breakdown
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

BRIEF = """Tu es directeur technique motion-design. Voici TON PROPRE storyboard multi-planche (3 panneaux
BEGINNING/MIDDLE/END) pour un moment d'un documentaire geopolitique premium (Senegal petrole, chaine
"Kora & Cartes", charte navy #16213a + or #e7bd78 + ivoire + rouge crise #b23a2e).

On va RECODER cette scene en Remotion (React/SVG, frame-driven, spring()). Donne-moi un BREAKDOWN JSON
technique precis pour qu'on code FIDELEMENT ton intention. Structure JSON STRICTE :

{
  "scene": "nom",
  "duree_estimee_s": <number>,
  "pivot_central": {"objet": "...", "description_visuelle": "...", "comment_anime": "..."},
  "background": {"couleur": "#...", "texture": "grain/grille/vignette ?", "evolution": "change avec le sens ?"},
  "etapes": [
    {"t_relatif_s": [debut, fin], "nom": "...", "ce_qui_apparait": "...", "position": "left/right/center/...",
     "animation": "spring/fade/slide/flip... + easing", "couleur": "#...", "texte": "..."}
  ],
  "assets_a_generer": [{"quoi": "...", "pourquoi_pas_codable": "...", "prompt_suggere": "..."}],
  "ce_qui_est_codable_directement": ["..."],
  "details_premium": ["ombres, glow, grain, profondeur..."],
  "ordre_de_code": ["etape 1: ...", "etape 2: ..."]
}

IMPORTANT : distingue ce qui est CODABLE en SVG/Remotion (formes, texte, jauges, flip 3D CSS, particules) vs
ce qui demande un ASSET genere (illustration complexe, texture realiste). Pour les assets, donne un prompt.
Sois precis sur le TIMING (l'image precede la voix ~0.5s) et l'EASING (spring, jamais lineaire). JSON valide uniquement."""


def gemini_breakdown(img: Path, out: Path):
    parts = [{"text": BRIEF}, {"inline_data": {"mime_type": "image/png", "data": base64.b64encode(img.read_bytes()).decode()}}]
    payload = {"contents": [{"parts": parts}], "generationConfig": {"temperature": 0.3, "maxOutputTokens": 4000}}
    r = requests.post(GEMINI_URL, json=payload, timeout=180)
    if r.status_code != 200:
        print(f"  [gemini] ERROR {r.status_code}: {r.text[:200]}"); return
    txt = ""
    for c in r.json().get("candidates", []):
        for p in c.get("content", {}).get("parts", []):
            if p.get("text"): txt += p["text"]
    out.write_text(txt); print(f"  [gemini] -> {out.name} ({len(txt)} chars)")


def gpt_breakdown(img: Path, out: Path):
    if not OPENROUTER_KEY:
        print("  [gpt] OPENROUTER_API_KEY manquante"); return
    b64 = base64.b64encode(img.read_bytes()).decode()
    payload = {
        "model": GPT_VISION,
        "messages": [{"role": "user", "content": [
            {"type": "text", "text": BRIEF},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}},
        ]}],
        "temperature": 0.3, "max_tokens": 4000,
    }
    r = requests.post(OPENROUTER_URL, headers={"Authorization": f"Bearer {OPENROUTER_KEY}", "Content-Type": "application/json"}, json=payload, timeout=240)
    if r.status_code != 200:
        print(f"  [gpt] ERROR {r.status_code}: {r.text[:200]}"); return
    txt = r.json()["choices"][0]["message"]["content"]
    out.write_text(txt); print(f"  [gpt] -> {out.name} ({len(txt)} chars)")


if __name__ == "__main__":
    for moment in ["intro-recits", "soixante-pourcent"]:
        print(f"\n=== {moment} ===")
        g = SB / f"{moment}-gemini.png"
        if g.exists(): gemini_breakdown(g, OUT / f"{moment}-gemini-breakdown.md")
        gp = SB / f"{moment}-gpt.png"
        if gp.exists(): gpt_breakdown(gp, OUT / f"{moment}-gpt-breakdown.md")
    print(f"\n-> {OUT}")
