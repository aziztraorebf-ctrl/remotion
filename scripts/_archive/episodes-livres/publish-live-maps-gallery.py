"""
Publish a mobile-friendly Vercel Blob gallery showing Mapbox moving maps in action.
Goal: Aziz understands that maps MOVE (not static images), with custom styles applied,
plus Remotion overlays on top.
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
SOURCE_DIR = ROOT / "quebec-jacques-poc" / "research" / "mapbox-examples"
FOLDER = "jacques-research/live-maps"

if not BLOB_TOKEN:
    sys.exit("ERROR: BLOB_READ_WRITE_TOKEN missing")


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


def upload_file(path: Path, pathname: str, content_type: str) -> str:
    return upload(path.read_bytes(), pathname, content_type)


# What to upload
ASSETS = {
    # Demo videos (moving maps with style)
    "demo-clip-1-history.mp4": ("video/mp4", "Video 1 - History Animators (Mapbox satellite + drapeaux animes overlays)"),
    "demo-clip-2-capcut.mp4": ("video/mp4", "Video 2 - Carte vintage style en rotation (proche option B)"),

    # Frames
    "history-frame_04.jpg": ("image/jpeg", "Frame Ukraine - drapeaux-cutout + carte satellite Mapbox + bordures neon overlays"),
    "history-frame_06.jpg": ("image/jpeg", "Frame Nord Stream - drapeaux multiples + ligne pipeline + label overlay"),
    "capcut-frame_03.jpg": ("image/jpeg", "Frame parchemin vintage - tres proche de notre option B (Mande)"),
    "capcut-frame_06.jpg": ("image/jpeg", "Frame monochrome - tres proche de notre option C (editorial)"),
    "mapbox-studio-frame_07.jpg": ("image/jpeg", "Mapbox Studio en action - configuration de calques personnalises"),
}


def main():
    print(f"Uploading assets to Vercel Blob...\n")

    asset_urls = {}
    for filename, (content_type, _description) in ASSETS.items():
        path = SOURCE_DIR / filename
        if not path.exists():
            print(f"  SKIP (not found): {filename}")
            continue
        pathname = f"{FOLDER}/{filename}"
        url = upload_file(path, pathname, content_type)
        asset_urls[filename] = url
        print(f"  {filename} -> {url}")

    print("\nBuilding gallery page...")

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    index_url = "https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/index.html"
    comparison_url = "https://t6olmi2nloe9nhkg.public.blob.vercel-storage.com/jacques-research/style-comparison/comparison.html"

    page = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cartes vivantes Mapbox - exemples reels</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0d0d0d; color: #e8e8e8;
  padding: 16px; max-width: 760px; margin: 0 auto;
  line-height: 1.6; font-size: 16px;
}}
h1 {{ font-size: 1.5em; margin: 8px 0 6px; color: #fff; }}
h2 {{ color: #ffd57a; font-size: 1.2em; margin: 24px 0 10px; padding-bottom: 6px; border-bottom: 1px solid #333; }}
h3 {{ color: #9ad9ff; font-size: 1em; margin: 14px 0 6px; }}
.meta {{ color: #888; font-size: 0.85em; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid #222; }}
.intro {{
  background: #161616; padding: 14px 16px; border-radius: 8px;
  border: 1px solid #2a2a2a; margin-bottom: 24px;
  font-size: 0.95em; color: #c8c8c8;
}}
.intro strong {{ color: #fff; }}
.intro em {{ color: #ffd57a; font-style: normal; font-weight: 600; }}
.card {{
  background: #161616; border-radius: 10px; padding: 18px;
  margin-bottom: 20px; border: 1px solid #2a2a2a;
}}
.card video, .card img {{
  width: 100%; display: block; border-radius: 6px;
  border: 1px solid #2a2a2a; margin: 10px 0;
}}
.card .caption {{ font-size: 0.85em; color: #aaa; margin-top: 6px; }}
.card p {{ margin: 8px 0; font-size: 0.92em; }}
.layers {{
  background: #0d0d0d; padding: 12px; border-radius: 6px;
  margin: 12px 0; border: 1px solid #2a2a2a;
}}
.layers h3 {{ margin-top: 0; }}
.layers ul {{ margin: 6px 0 0 22px; font-size: 0.9em; }}
.layers li {{ margin: 4px 0; }}
.back {{
  display: inline-block; margin-bottom: 16px;
  color: #6cb4ee; text-decoration: none;
  background: #1a1a1a; padding: 8px 14px; border-radius: 6px;
  border: 1px solid #2a2a2a;
}}
.tldr {{
  background: linear-gradient(135deg, #1a3320, #0d1f15);
  padding: 14px 16px; border-radius: 8px;
  border: 1px solid #2a5a40; margin: 20px 0;
  font-size: 0.95em;
}}
.tldr strong {{ color: #6fcf6f; }}
@media (max-width: 600px) {{
  body {{ padding: 12px; font-size: 15px; }}
}}
</style>
</head>
<body>
<a href="{index_url}" class="back">&larr; Index recherche</a>
<h1>Cartes vivantes Mapbox - exemples reels en mouvement</h1>
<div class="meta">{timestamp} - Reponse a ta question : "Est-ce que les cartes bougent?"</div>

<div class="tldr">
<strong>Reponse courte :</strong> OUI, les cartes BOUGENT. Les images Gemini que tu as vues (A/B/C) ne sont que des moodboards de couleur/typo. Le rendu reel = carte 3D Mapbox qui bouge en direct + ton style applique automatiquement + overlays Remotion par-dessus.
</div>

<h2>1. Comprendre les 3 couches qui composent une video Atlas</h2>

<div class="card">
<div class="layers">
<h3>Couche 1 - Le moteur (Mapbox GL JS)</h3>
<p>Carte 3D interactive qui FAIT BOUGER le decor. Le mouvement (flyTo, zoom, rotation, tilt, pan) est code, pas dessine. La carte reste toujours geographiquement exacte meme quand elle bouge.</p>
</div>

<div class="layers">
<h3>Couche 2 - Le style (Mapbox Studio custom)</h3>
<p>Configuration qui dit a Mapbox COMMENT afficher la carte : couleurs, traits, typographie, textures. C'est ici que ton choix A/B/C s'applique. Le style est applique automatiquement a chaque frame quand la carte bouge.</p>
</div>

<div class="layers">
<h3>Couche 3 - Les overlays (Remotion)</h3>
<p>Badges chiffres (25 000 ETUDIANTS), comparaisons barres, labels villes, pins, animations spring/interpolate. Ajoutes par-dessus la carte vivante. Suivent les coordonnees geographiques meme pendant que la carte bouge.</p>
</div>
</div>

<h2>2. Exemple video #1 - History Animators (Mapbox + drapeaux + bordures)</h2>

<div class="card">
<video controls preload="metadata" playsinline>
<source src="{asset_urls.get('demo-clip-1-history.mp4', '')}" type="video/mp4">
</video>
<p class="caption">Extrait 80-90s de "How History Animators Make Their Maps" (269k vues). Notice : la carte satellite Mapbox BOUGE en arriere-plan pendant que les drapeaux-cutout pays apparaissent et que les bordures ondulent.</p>

<h3>Frame 1 - Carte satellite Mapbox + drapeaux pays + bordures animees</h3>
<img src="{asset_urls.get('history-frame_04.jpg', '')}" alt="Frame Ukraine">
<p class="caption">Drapeaux Ukraine/Russie/etc en cutout par-dessus la carte satellite. Tout est anime : carte qui bouge + drapeaux qui se remplissent + bordures qui se dessinent.</p>

<h3>Frame 2 - Multi-overlays + label + pipeline anime</h3>
<img src="{asset_urls.get('history-frame_06.jpg', '')}" alt="Frame Nord Stream">
<p class="caption">Plusieurs drapeaux + label "NORD STREAM PIPELINES" + ligne de pipeline orange animee + badge annee "2022". Tous ces elements sont des overlays Remotion AJOUTES par-dessus la carte qui bouge en arriere-plan.</p>
</div>

<h2>3. Exemple video #2 - Style vintage en mouvement (proche option B)</h2>

<div class="card">
<video controls preload="metadata" playsinline>
<source src="{asset_urls.get('demo-clip-2-capcut.mp4', '')}" type="video/mp4">
</video>
<p class="caption">Extrait 280-290s de "Advanced Map Animation in CapCut" (106k vues). Carte historique style PARCHEMIN VINTAGE en rotation/zoom - exactement le rendu visuel que ton option B (Parchemin Mande) produirait, mais EN MOUVEMENT.</p>

<h3>Frame parchemin vintage applique sur carte mobile</h3>
<img src="{asset_urls.get('capcut-frame_03.jpg', '')}" alt="Frame parchemin vintage">
<p class="caption">On voit la zone Mali/Algerie/Libya. La texture parchemin et les contours de pays sont integres au moteur de carte. Quand la carte zoome ou tourne, ce style suit automatiquement.</p>

<h3>Frame monochrome en mouvement (proche option C)</h3>
<img src="{asset_urls.get('capcut-frame_06.jpg', '')}" alt="Frame monochrome">
<p class="caption">Style monochrome blanc/gris (CANADA, USA, EUROPE visibles). Quand la carte tourne dans la video, tout reste en monochrome. Style applique = constant pendant le mouvement.</p>
</div>

<h2>4. Exemple #3 - Mapbox Studio (l'outil qui cree le style custom)</h2>

<div class="card">
<img src="{asset_urls.get('mapbox-studio-frame_07.jpg', '')}" alt="Mapbox Studio">
<p class="caption">Interface Mapbox Studio - on voit les calques (Mapbox Streets V7, Satellite, Terrain V2, Natural Earth Countries...) qu'on active/desactive et stylise pour creer NOTRE style custom. Une fois le style sauve, il s'applique a toute carte qui utilise ce style ID.</p>
</div>

<h2>5. Ce que ca veut dire pour ton choix A/B/C</h2>

<div class="card">
<p><strong>Le style choisi (A, B ou C) sera applique a notre Mapbox custom.</strong> Quand on demande a la carte de zoomer sur Tombouctou, de tourner autour, de fly-to vers le Caire - le style choisi suivra automatiquement.</p>

<p><strong>Les overlays Remotion (chiffres, badges, comparaisons, pins) sont AJOUTES par-dessus.</strong> Ils sont independants du style - ils peuvent meme etre legerement differents selon la scene.</p>

<p><strong>Donc tu choisis A/B/C en regardant les images Gemini comme des AMBIANCES de couleur/typo, pas comme des cartes finales.</strong> La carte finale BOUGERA toujours, mais elle aura l'ambiance de l'option choisie.</p>
</div>

<div class="tldr">
<strong>Prochaine etape :</strong> retourne a la <a href="{comparison_url}" style="color: #6fcf6f;">page de comparaison A/B/C</a> avec cette comprehension. Choisis l'AMBIANCE qui te plait le plus. Le mouvement viendra avec Mapbox automatiquement.
</div>
</body>
</html>"""

    page_url = upload(page.encode("utf-8"), f"{FOLDER}/live-maps.html", "text/html; charset=utf-8")

    print(f"\n{'='*60}")
    print(f"GALERIE CARTES VIVANTES (a ouvrir sur mobile):")
    print(f"  {page_url}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
