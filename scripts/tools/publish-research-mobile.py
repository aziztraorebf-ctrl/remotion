"""
Publish research .md files to Vercel Blob as mobile-friendly HTML pages.

Generates:
- 1 HTML per .md file (rendered, dark mode, mobile-optimized)
- 1 index.html with links to all pages

Usage: python3 scripts/tools/publish-research-mobile.py
"""

import sys
import os
from datetime import datetime
from pathlib import Path

import markdown
import requests
from dotenv import load_dotenv

ROOT = Path(__file__).parent.parent.parent
load_dotenv(ROOT / ".env")

BLOB_TOKEN = os.getenv("BLOB_READ_WRITE_TOKEN")
BLOB_API_URL = "https://blob.vercel-storage.com"

if not BLOB_TOKEN:
    print("ERROR: BLOB_READ_WRITE_TOKEN missing in .env")
    sys.exit(1)

RESEARCH_DIR = ROOT / "quebec-jacques-poc" / "research"
SCRIPTS_DIR = ROOT / "quebec-jacques-poc" / "scripts-atlas"
TEMPLATES_DIR = ROOT / "memory" / "templates"
MEMORY_DIR = ROOT / "memory"
FOLDER_PREFIX = "jacques-research"

# Tuples (source_dir, filename, title)
FILES = [
    (RESEARCH_DIR, "LAST30-SYNTHESIS.md", "1. Validation Last30Days - 6 angles"),
    (RESEARCH_DIR, "RPM-COMPETITIVE-ANALYSIS.md", "2. RPM + analyse competition"),
    (RESEARCH_DIR, "JACQUES-A-DIT-DNA.md", "3. ADN visuel Jacques a dit"),
    (RESEARCH_DIR, "REMOGEN-CROATIA-BRIEF.md", "4. Analyse Remogen - Croatie"),
    (RESEARCH_DIR, "JACQUES-CROSS-VIDEO-TEMPLATE.md", "5. Template cross-video definitif"),
    (TEMPLATES_DIR, "script-atlas-v1.md", "6. Template Atlas v1 - methode complete"),
    (SCRIPTS_DIR, "script-mali-mansa-moussa-v1.md", "7. Script Mali (Mansa Moussa) v1"),
    (SCRIPTS_DIR, "script-tombouctou-v1.md", "8. Script Tombouctou v1"),
    (RESEARCH_DIR, "FACT-CHECK-CONVERSATION.md", "9. Fact-Check de la conversation (2026-04-28)"),
    (MEMORY_DIR, "NEXT-SESSION-atlas-mali-tombouctou.md", "10. Brief NEXT SESSION - Atlas Tombouctou"),
]

HTML_WRAPPER = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0d0d0d; color: #e8e8e8;
  padding: 16px; max-width: 760px; margin: 0 auto;
  line-height: 1.65; font-size: 16px;
}}
h1 {{ font-size: 1.5em; margin: 18px 0 12px; color: #fff; line-height: 1.3; }}
h2 {{ font-size: 1.25em; margin: 22px 0 10px; color: #ffd57a; border-bottom: 1px solid #333; padding-bottom: 6px; }}
h3 {{ font-size: 1.1em; margin: 18px 0 8px; color: #9ad9ff; }}
h4 {{ font-size: 1em; margin: 14px 0 6px; color: #c0c0c0; }}
p {{ margin: 10px 0; }}
ul, ol {{ margin: 10px 0 10px 22px; }}
li {{ margin: 5px 0; }}
strong {{ color: #fff; }}
em {{ color: #c8a8e0; }}
code {{
  background: #222; padding: 2px 6px; border-radius: 4px;
  font-family: 'SF Mono', Menlo, monospace; font-size: 0.9em;
  color: #ffb8b8; word-break: break-word;
}}
pre {{
  background: #1a1a1a; padding: 12px; border-radius: 6px;
  overflow-x: auto; margin: 12px 0; border: 1px solid #2a2a2a;
}}
pre code {{ background: transparent; padding: 0; color: #d8d8d8; }}
blockquote {{
  border-left: 3px solid #6cb4ee; padding: 6px 14px;
  margin: 12px 0; color: #b8b8b8; background: #161616;
}}
table {{
  border-collapse: collapse; width: 100%; margin: 14px 0;
  display: block; overflow-x: auto; white-space: nowrap;
}}
th, td {{
  padding: 8px 12px; border: 1px solid #333; text-align: left;
}}
th {{ background: #1f1f1f; color: #ffd57a; }}
td {{ background: #141414; }}
hr {{ border: none; border-top: 1px solid #333; margin: 22px 0; }}
a {{ color: #6cb4ee; }}
.meta {{
  color: #888; font-size: 0.85em; margin-bottom: 18px;
  padding-bottom: 10px; border-bottom: 1px solid #222;
}}
.nav {{
  background: #161616; padding: 12px; border-radius: 6px;
  margin-bottom: 20px; border: 1px solid #2a2a2a;
}}
.nav a {{ display: block; padding: 6px 0; }}
.back {{
  display: inline-block; margin-bottom: 16px;
  color: #6cb4ee; text-decoration: none;
  background: #1a1a1a; padding: 8px 14px; border-radius: 6px;
  border: 1px solid #2a2a2a;
}}
@media (max-width: 600px) {{
  body {{ padding: 12px; font-size: 15px; }}
  table {{ font-size: 0.85em; }}
}}
</style>
</head>
<body>
{back_link}
<div class="meta">{meta}</div>
{content}
</body>
</html>
"""


def upload_html(content_bytes, pathname):
    # Stable URL: x-add-random-suffix=0 + x-allow-overwrite=1
    response = requests.put(
        f"{BLOB_API_URL}/{pathname}",
        headers={
            "Authorization": f"Bearer {BLOB_TOKEN}",
            "x-content-type": "text/html; charset=utf-8",
            "x-api-version": "7",
            "x-cache-control-max-age": "31536000",
            "x-add-random-suffix": "0",
            "x-allow-overwrite": "1",
        },
        data=content_bytes,
    )
    if response.status_code != 200:
        print(f"ERROR ({response.status_code}): {response.text}")
        sys.exit(1)
    return response.json().get("url", "")


def predict_url(pathname):
    """Predict the URL Vercel will return for a stable upload (no random suffix)."""
    # Pattern: https://{store-id}.public.blob.vercel-storage.com/{pathname}
    # We must learn store-id from a real upload. Hardcode from observed behavior.
    return f"https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/{pathname}"


def md_to_html_page(md_path, title, back_url=None):
    md_text = Path(md_path).read_text(encoding="utf-8")
    html_body = markdown.markdown(
        md_text,
        extensions=["tables", "fenced_code", "nl2br"],
    )
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    meta = f"{timestamp} — Source: {Path(md_path).name}"
    back_link = f'<a href="{back_url}" class="back">← Index</a>' if back_url else ""
    return HTML_WRAPPER.format(
        title=title,
        meta=meta,
        content=html_body,
        back_link=back_link,
    )


def main():
    # Use stable folder name (no timestamp) so URL never changes
    folder = FOLDER_PREFIX

    # Pre-compute all URLs (stable, no random suffix)
    index_pathname = f"{folder}/index.html"
    index_url = predict_url(index_pathname)
    print(f"Stable index URL: {index_url}\n")

    page_urls = []
    print(f"Uploading {len(FILES)} pages with back-link to index...\n")

    for source_dir, filename, title in FILES:
        md_path = source_dir / filename
        if not md_path.exists():
            print(f"  SKIP (not found): {md_path}")
            continue

        html = md_to_html_page(md_path, title, back_url=index_url)
        slug = filename.replace(".md", "").lower()
        pathname = f"{folder}/{slug}.html"
        print(f"  {filename} -> ...")
        url = upload_html(html.encode("utf-8"), pathname)
        page_urls.append({"title": title, "url": url, "filename": filename})
        print(f"    {url}")

    # Build and upload final index
    print("\nBuilding final index page...")
    index_items = []
    for i, page in enumerate(page_urls, 1):
        index_items.append(
            f'<li><a href="{page["url"]}">{page["title"]}</a></li>'
        )

    index_md_like = f"""# Chaine YouTube Afrique - Index recherche + scripts

Mise a jour: {datetime.now().strftime('%Y-%m-%d %H:%M')}

10 documents lisibles sur mobile : analyses + template Atlas + scripts + fact-check + brief next session.

## ⚡ DEMARRER LA PROCHAINE SESSION

[**Starter Prompt - Session Atlas Tombouctou**](https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/starter-prompt.html) - Page mobile avec bouton "Copier" en un tap. Pour reprendre exactement ou on s'est arrete dans une nouvelle session Claude Code sur PC.

## RECHERCHE STRATEGIQUE (1-5)

<div class="nav">
<ol>
{chr(10).join(index_items[:5])}
</ol>
</div>

## TEMPLATE + SCRIPTS (6-8)

<div class="nav">
<ol start="6">
{chr(10).join(index_items[5:8])}
</ol>
</div>

## FACT-CHECK + NEXT SESSION (9-10)

<div class="nav">
<ol start="9">
{chr(10).join(index_items[8:])}
</ol>
</div>

## Resume rapide

**Doc 1 - Validation Last30Days** : 6 angles testes. Verdict: Angle 6 (comparaisons echelle) + Angle 5 (heros oublies) = pilier propose.

**Doc 2 - RPM + competition** : RPM Afrique francophone 1-3$/1000 vues. Modele monetisation hybride propose.

**Doc 3 - ADN visuel Jacques a dit** : 9 elements visuels constants. Stack reproductible 100% Remotion + Mapbox.

**Doc 4 - Analyse Remogen Croatie** : Gemini 3 Flash 27.7s. Hook 13s, 5 chapitres, 18 stats, 4 faiblesses -> 4 differenciations.

**Doc 5 - Template cross-video definitif** : Constantes Jacques universel + variables selon format. Notre stack: 5-10h/video vs 25-30h Jacques.

**Doc 6 - Template Atlas v1** : Methode complete pour scripts geo/richesse-record/echelle. 9 etapes, 6 segments fixes, regle "tu invitatif vs presomptif", fact-check pre-ecriture obligatoire.

**Doc 7 - Script Mali (Mansa Moussa)** : Brouillon V1 finalise. 80s, 9 stats, hook "effondrer cours de l'or 12 ans", CTA "Demande qui est l'homme le plus riche... Rockefeller, Bezos, Musk. Pas lui."

**Doc 8 - Script Tombouctou** : Brouillon V1 finalise. 80s, 11 stats, hook "plus de livres que toutes universites Europe", CTA "Pose-toi la question : pourquoi ?". Mini-serie avec Mali.

**Doc 9 - Fact-Check Conversation (2026-04-28)** : verifications systematiques. Mapbox = gratuit (pas $50/mois comme dit avant), ElevenLabs $22, Gemini $0.067/image, Vercel Blob 1GB free. Stack ~$33-48/mois total bootstrap.

**Doc 10 - Brief NEXT SESSION** : plan complet pour produire Tombouctou. Style Parchemin Mande choisi. Toutes decisions figees. Starter prompt copier-coller inclus.

## Decisions FIGEES 2026-04-27/28

- ✅ **Pivot YouTube hors politique** (newsletter politique reste separee)
- ✅ **Audience cible** : francophonie mondiale + diaspora bilingue (RPM ~$3-5/1000)
- ✅ **Pilier Atlas** + Heros Oublies long-format Paper-Craft
- ✅ **Style choisi** : **B Parchemin Mande** (differenciation maximale)
- ✅ **Pilote choisi** : **Tombouctou** (mini-serie avec Mali apres)
- ✅ **Seuil revenu** : 2500-3000 EUR/mois mois 12-18
- ✅ **Bootstrap accepte** : 6 mois a 0-300 EUR
- ✅ **Cout stack** : ~$33-48/mois (Mapbox gratuit, ElevenLabs $22, Gemini $5-15, Vercel free, Perplexity $5-10)
- ✅ **Template Atlas v1** sauvegarde + regle "tu invitatif" validee
- ✅ **2 brouillons valides** : Mali + Tombouctou
- ✅ **3 styles testes Gemini** : Parchemin Mande gagne

## NEXT SESSION (sur PC)

Etape 1 : coder `mapbox-styles/atlas-parchemin-mande.json` (4-8h)
Etape 2 : Aziz upload Mapbox Studio (5 min) → me donne Style ID
Etape 3 : mini-render 5s validation
Etape 4 : iterations style si necessaire
Etape 5+ : decoupage scene-par-scene + production Tombouctou

⚠️ **Risque a valider session 1** : performance Remotion+Mapbox en headless mode (GPU disabled par defaut). A tester sur Mac avec config `chromiumOptions.gl: "angle-egl"`.
"""
    # Convert this manually-built markdown to HTML
    index_html_body = markdown.markdown(
        index_md_like,
        extensions=["tables", "fenced_code", "nl2br"],
    )
    index_html = HTML_WRAPPER.format(
        title="Recherche chaine YouTube Afrique - Index",
        meta=f"{datetime.now().strftime('%Y-%m-%d %H:%M')} - 5 documents",
        content=index_html_body,
        back_link="",
    )
    actual_index_url = upload_html(index_html.encode("utf-8"), index_pathname)
    assert actual_index_url == index_url, f"URL mismatch: {actual_index_url} vs {index_url}"

    print(f"\n{'='*60}")
    print(f"INDEX URL (a partager - stable, ne change jamais):")
    print(f"  {actual_index_url}")
    print(f"{'='*60}\n")
    print("Ouvrir ce lien sur mobile pour acceder aux 5 documents.")


if __name__ == "__main__":
    main()
