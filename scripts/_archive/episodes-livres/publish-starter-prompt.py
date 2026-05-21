"""
Publish a mobile-friendly starter prompt page with one-tap copy button.
Aziz can open this on his phone, tap "Copy", and paste in a new Claude Code session.
"""

import os
import sys
from datetime import datetime
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).parent.parent.parent
load_dotenv(ROOT / ".env")

BLOB_TOKEN = os.getenv("BLOB_READ_WRITE_TOKEN")
BLOB_API_URL = "https://blob.vercel-storage.com"
FOLDER = "jacques-research"

if not BLOB_TOKEN:
    sys.exit("ERROR: BLOB_READ_WRITE_TOKEN missing")


PROMPT = """Charge la memoire de session Atlas en lisant ces 5 fichiers dans l'ordre :

1. memory/MEMORY.md (index general - section "NOUVEAU TERRITOIRE - CHAINE GEOAFRIQUE")
2. memory/NEXT-SESSION-atlas-mali-tombouctou.md (brief complet de cette session)
3. memory/templates/script-atlas-v1.md (template script methode complete)
4. quebec-jacques-poc/scripts-atlas/script-tombouctou-v1.md (script brouillon valide)
5. quebec-jacques-poc/research/FACT-CHECK-CONVERSATION.md (verifications + rectifications)

Session : production video pilote Atlas Tombouctou.

Contexte rapide :
- Chaine YouTube en construction : Geoafrique, hors politique
- Format Atlas (densite Cesar, geo + richesse-record)
- Pilote : Tombouctou (mini-serie avec Mali en episode 2)
- Style choisi : B Parchemin Mande (option deja figee)
- Stack : Remotion 4 + mapbox-gl 3.22 + react-map-gl 8.1 + Gemini 3.1 Flash Image Preview
- Tout l'environnement est setup (.env contient toutes les keys necessaires)
- Cout mensuel estime : ~$33-48/mois (Mapbox gratuit, ElevenLabs $22, Gemini $5-15)

Reference visuelle cible (style Parchemin Mande) :
https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/style-comparison/B-parchemin-mande.png

Decisions FIGEES (ne pas rediscuter sauf demande explicite) :
- Style B Parchemin Mande
- Pilote Tombouctou
- Audience francophonie mondiale + diaspora bilingue
- Bootstrap 6 mois accepte

PREMIERE ETAPE de cette session : coder mapbox-styles/atlas-parchemin-mande.json (estime 4-8h).

ATTENTION risque technique a valider en debut de session :
- Performance Remotion + Mapbox-GL en headless mode (GPU disabled par defaut)
- Test concrete a faire avant de tout coder : 1 frame Mapbox custom doit prendre <10s sur Mac avec config chromiumOptions.gl: "angle-egl"
- Si >30s/frame en headless = pivot vers strategie pre-render Mapbox en images statiques

Process attendu :
1. Tu confirmes que tu as lu les 5 fichiers
2. Tu fais le test technique perf Mapbox+Remotion (1 frame statique) AVANT le style.json
3. Selon le resultat : code style.json OU pivot strategie pre-render
4. Aziz upload sur studio.mapbox.com, recoit Style ID, le donne dans la conversation
5. Mini-render 5s validation
6. Iterations si necessaire
7. Decoupage scene-par-scene Tombouctou

Demarre par confirmer la lecture des 5 fichiers et propose le test perf en premier."""


def upload(data: bytes, pathname: str, content_type: str) -> str:
    response = requests.put(
        f"{BLOB_API_URL}/{pathname}",
        headers={
            "Authorization": f"Bearer {BLOB_TOKEN}",
            "x-content-type": content_type,
            "x-api-version": "7",
            "x-cache-control-max-age": "31536000",
            "x-add-random-suffix": "0",
            "x-allow-overwrite": "1",
        },
        data=data,
    )
    if response.status_code != 200:
        sys.exit(f"ERROR ({response.status_code}): {response.text}")
    return response.json().get("url", "")


def main():
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    index_url = "https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/index.html"

    # Escape backticks for HTML template literal
    prompt_escaped_for_html = PROMPT.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

    page = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Starter Prompt - Atlas Tombouctou</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0d0d0d; color: #e8e8e8;
  padding: 16px; max-width: 760px; margin: 0 auto;
  line-height: 1.6; font-size: 16px;
}}
h1 {{ font-size: 1.5em; margin: 8px 0 6px; color: #fff; }}
.meta {{ color: #888; font-size: 0.85em; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid #222; }}
.intro {{
  background: linear-gradient(135deg, #1a3320, #0d1f15);
  padding: 14px 16px; border-radius: 8px;
  border: 1px solid #2a5a40; margin-bottom: 24px;
  font-size: 0.95em; color: #c8c8c8;
}}
.intro strong {{ color: #6fcf6f; }}

.copy-button {{
  display: block;
  width: 100%;
  background: #6fcf6f;
  color: #0d0d0d;
  font-size: 1.1em;
  font-weight: bold;
  padding: 14px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-bottom: 14px;
  transition: background 0.2s;
}}
.copy-button:hover {{ background: #8fdf8f; }}
.copy-button.copied {{ background: #ffd57a; color: #0d0d0d; }}

.prompt-box {{
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.85em;
  white-space: pre-wrap;
  word-break: break-word;
  color: #d8d8d8;
  max-height: 60vh;
  overflow-y: auto;
}}

.steps {{
  background: #161616;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 14px 16px;
  margin: 20px 0;
}}
.steps h2 {{ color: #ffd57a; font-size: 1.1em; margin-bottom: 12px; }}
.steps ol {{ margin-left: 22px; font-size: 0.9em; }}
.steps li {{ margin: 6px 0; }}
.steps strong {{ color: #fff; }}

.warning {{
  background: #2a1a0d; border: 1px solid #5a3a1d;
  padding: 12px 16px; border-radius: 8px;
  margin: 16px 0;
  font-size: 0.9em; color: #f0c080;
}}
.warning strong {{ color: #ffd57a; }}

.back {{
  display: inline-block; margin-bottom: 16px;
  color: #6cb4ee; text-decoration: none;
  background: #1a1a1a; padding: 8px 14px; border-radius: 6px;
  border: 1px solid #2a2a2a;
}}

@media (max-width: 600px) {{
  body {{ padding: 12px; font-size: 15px; }}
  .copy-button {{ font-size: 1em; padding: 16px; }}
}}
</style>
</head>
<body>
<a href="{index_url}" class="back">&larr; Index recherche</a>
<h1>Starter Prompt - Session Atlas Tombouctou</h1>
<div class="meta">{timestamp} - Pret a copier-coller dans Claude Code sur PC</div>

<div class="intro">
<strong>Comment utiliser :</strong> 1) Tap sur le bouton "Copier le prompt" ci-dessous. 2) Ouvre Claude Code sur ton PC. 3) Colle le prompt. 4) Envoie. Claude reprend exactement ou on s'est arrete avec tout le contexte charge.
</div>

<button class="copy-button" id="copyBtn" onclick="copyPrompt()">Copier le prompt complet</button>

<div class="prompt-box" id="promptText">{PROMPT}</div>

<div class="steps">
<h2>Plan de la session 1 (apercu)</h2>
<ol>
<li><strong>Test perf Mapbox+Remotion</strong> (30 min) - validation critique avant tout</li>
<li><strong>Code style.json Parchemin Mande</strong> (4-8h Claude)</li>
<li><strong>Tu uploades sur Mapbox Studio</strong> (5 min)</li>
<li><strong>Tu colles le Style ID dans la conversation</strong></li>
<li><strong>Mini-render 5s validation</strong> du style en mouvement</li>
<li><strong>Iterations style</strong> si necessaire</li>
<li><strong>Decoupage scene-par-scene Tombouctou</strong> + asset planning</li>
</ol>
</div>

<div class="warning">
<strong>Important - risque technique a valider en premier :</strong> performance Remotion+Mapbox en mode headless. Si trop lent (>30s/frame), pivot vers strategie pre-render Mapbox en images statiques. Le prompt force Claude a faire ce test AVANT de coder le style.
</div>

<div class="steps">
<h2>Decisions deja figees (Claude ne rediscutera pas)</h2>
<ul style="margin-left: 22px; font-size: 0.9em;">
<li>Style choisi : B Parchemin Mande</li>
<li>Pilote choisi : Tombouctou</li>
<li>Audience : francophonie mondiale + diaspora bilingue</li>
<li>Stack : Remotion 4 + Mapbox + Gemini 3.1 Flash Image Preview</li>
<li>Bootstrap : 6 mois a 0-300 EUR accepte</li>
</ul>
</div>

<script>
function copyPrompt() {{
  const text = document.getElementById('promptText').innerText;
  const btn = document.getElementById('copyBtn');

  navigator.clipboard.writeText(text).then(() => {{
    btn.textContent = 'Copie ! Colle dans Claude Code maintenant.';
    btn.classList.add('copied');
    setTimeout(() => {{
      btn.textContent = 'Copier le prompt complet';
      btn.classList.remove('copied');
    }}, 4000);
  }}).catch(err => {{
    // Fallback: select text manually
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('promptText'));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    btn.textContent = 'Texte selectionne - tap-hold puis Copy';
    btn.classList.add('copied');
  }});
}}
</script>
</body>
</html>"""

    page_url = upload(page.encode("utf-8"), f"{FOLDER}/starter-prompt.html", "text/html; charset=utf-8")

    print(f"\n{'='*60}")
    print(f"STARTER PROMPT URL (a partager):")
    print(f"  {page_url}")
    print(f"{'='*60}\n")
    print("Ouvrir sur mobile, tap sur 'Copier le prompt complet'.")
    print("Le bouton selectionne le texte automatiquement (clipboard API).")


if __name__ == "__main__":
    main()
