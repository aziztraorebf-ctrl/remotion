#!/usr/bin/env python3
"""Build mood-board dashboard — VALIDATED references only.

Group selected frames by template (not by channel). Zero noise, zero text
analysis, just visual references for Aziz to come back to.

Usage:
    python3 build-moodboard.py
"""
import base64
import html
from pathlib import Path

ROOT = Path("/Users/clawdbot/Workspace/remotion/memory/templates-research/scouting/par-chaine")
OUT = Path("/tmp/scout-dashboard/moodboard.html")


# Frames groupées par template, selon les validations Aziz cumulatives
# Chaque entrée : (chemin relatif depuis ROOT, légende courte une ligne)
MOODBOARD = {
    "Template A — Or Africain V5 (existant, locked)": {
        "description": "Noir + or + ledger financier. Référence : épisode 1 livré.",
        "frames": [],  # Pas de frames de scout pour A — c'est notre épisode existant
    },
    "Template B — Carto Caspian (locked V1)": {
        "description": "Océan bleu pâle + crème + frontières fines + highlight or/terracotta.",
        "frames": [
            ("caspian-report/video-1-mali-niger-burkina/frame-003-libya-highlight-orange.jpg", "Libya highlight orange — palette signature"),
            ("caspian-report/video-1-mali-niger-burkina/frame-006-flags-pins-colonial.jpg", "Flags + pins — densité Caspian (à éviter, anti-référence)"),
            ("caspian-report/video-1-mali-niger-burkina/frame-070-niger-river-blue-flow.jpg", "Niger river — bleu pâle océan"),
        ],
    },
    "Template C — Atlas réaliste 3D (locked V1)": {
        "description": "Satellite + relief + mask country shape + tilt 3D oblique.",
        "frames": [
            ("wendover/video-2-central-african-city/frame-001-satellite-airport-tilt.jpg", "Satellite tilt 3D oblique — signature C"),
            ("wendover/video-2-central-african-city/frame-009-country-shape-mask-flags.jpg", "Country mask shape — pays focus couleur, monde gris"),
            ("reallifelore/video-2-russia-collapsing/frame-030-overlay-portrait-pin-stat-grid.jpg", "Portrait pin + stat grid (RealLifeLore)"),
            ("reallifelore/video-2-russia-collapsing/frame-010-signature-map-flat-fills-arrow.jpg", "Carte signature + flat fills + flèche (RealLifeLore)"),
        ],
    },
    "Template D — WonderWhy beige épuré (locked V1)": {
        "description": "Fond papier kraft + drapeaux SVG + objet/portrait centré + morph chromatique.",
        "frames": [
            ("wonderwhy/video-1-two-congos/frame-0006-kraft-flag-card.jpg", "Kraft flag card — référence brique <KraftCard>"),
            ("wonderwhy/video-3-western-sahara/frame-0005-sand-bubble-flags.jpg", "Drapeau + bulle dialogue (sable Sahara) — référence <SpeakingFlag>"),
            ("wonderwhy/video-3-western-sahara/frame-0008-sand-flags-actors.jpg", "Drapeaux acteurs sur fond sable"),
        ],
    },
    "Brique <MapGlobeGrid> (Map Men)": {
        "description": "Fond globe terrestre + continents flat + drapeau-sur-mât + label allcaps.",
        "frames": [
            ("map-men/video-1-most-annoying-road/frame-0018-panama-flat-flags.jpg", "Panama flat flags — référence <MapGlobeGrid>"),
            ("map-men/video-2-not-195-countries/frame-0014-satellite-flag-fill.jpg", "Satellite + drapeau-fill territoire"),
        ],
    },
    "Template E candidat 1 — PolyMatter rouge mandarin": {
        "description": "Fond rouge plein + slab condensed + pills + drapeaux-textures. Risque rouge moral.",
        "frames": [
            ("polymatter/video-2-taiwan-not-ukraine/01-comparison-icons-pills.jpg", "Country pills + slab + flat icons"),
            ("polymatter/video-2-taiwan-not-ukraine/02-comparison-table-yes-no.jpg", "Tableau YES/NO avec pills cyan/orange"),
            ("polymatter/video-2-taiwan-not-ukraine/03-calendar-grid-red.jpg", "Calendar grid storytelling temporel"),
        ],
    },
    "Template E candidat 2a — Investigation OSINT (NYT VI)": {
        "description": "Noir pur + accent rouge + serif italique + diagrammes entités + cadre vertical flottant.",
        "frames": [
            ("nyt-visual-investigations/video-3-nk-ship/04-satellite-red-dots.jpg", "Satellite + dots rouges OSINT"),
            ("nyt-visual-investigations/video-3-nk-ship/05-ledger-diagram-ships.jpg", "Diagramme entités noir pur — pattern signature"),
            ("nyt-visual-investigations/video-1-wagner-car/02-vertical-floating-card.jpg", "Cadre vertical flottant + bandeau source"),
        ],
    },
    "Template E candidat 2b — Africa Eye OSINT BBC (variante britannique)": {
        "description": "Variante OSINT plus agressive : rouge BBC + barre date pleine largeur + match-cut footage/satellite.",
        "frames": [
            ("africa-eye/video-2-sudan-hit-squads/frame-006-network-graph.jpg", "Network graph Sudan hit squads"),
            ("africa-eye/video-2-sudan-hit-squads/frame-005-suspect-id.jpg", "Suspect ID OSINT"),
        ],
    },
    "Template E candidat 3 — Le Monde cartographique presse FR": {
        "description": "Halftone océan + serif capitales + italique 'Le Monde' + globe miniature + couches sémantiques.",
        "frames": [
            ("le-monde/video-2-mali-5min/frame-025-azawad-rebellion-stars.jpg", "Azawad rebellion + couches sémantiques"),
            ("le-monde/video-2-mali-5min/frame-035-aqmi-zone-action.jpg", "AQMI zone action — empilement translucide"),
            ("le-monde/video-3-russie-armes-afrique/frame-010-afrique-or-globe-noir.jpg", "Globe or sur noir (clin d'œil Or Africain)"),
            ("le-monde/video-3-russie-armes-afrique/frame-035-libye-pill-jaune.jpg", "Libye pill jaune — annotation OSINT FR"),
        ],
    },
    "Template F candidat — Carnet Reporter (Johnny Harris)": {
        "description": "Texture papier scanné + micro-shake handheld + ivoire + terracotta + hachures graphite.",
        "frames": [
            ("johnny-harris/video-1-europe-stole-africa/frame-005-paper-map-1800-empires.jpg", "Paper map 1800 empires — texture papier scanné"),
            ("johnny-harris/video-1-europe-stole-africa/frame-010-vintage-grid-map-handheld.jpg", "Vintage grid map — handheld"),
            ("johnny-harris/video-3-ignored-war/frame-015-hatched-map-eritrea-yemen-trade-lines.jpg", "Hatched map + trade lines — hachures + tracé"),
            ("johnny-harris/video-3-ignored-war/frame-320-red-shipping-routes-egypt-callout.jpg", "Red shipping routes — callout terracotta"),
        ],
    },
    "Template F2 sous-variante — Carnet scrapbook satirique (General Knowledge)": {
        "description": "Fond kraft + cartoon aplat + tape jaune fluo + screenshot presse collé. Sous-variante F plus légère/satirique.",
        "frames": [
            ("general-knowledge/video-2-sahel-confederation/frame-014-paperbeige-darkshapes-yellowtape.jpg", "Kraft + dark shapes + tape jaune — signature F2"),
            ("general-knowledge/video-2-sahel-confederation/frame-005-cartoon-infographic-flags.jpg", "Drapeaux cartoon + infographie aplat"),
            ("general-knowledge/video-2-sahel-confederation/frame-016-news-collage-sketchy.jpg", "Collage presse + sketchy — preuve documentaire inline"),
        ],
    },
    "Template G candidat — Grille SCRT (The Pudding)": {
        "description": "N pays simultanés, même composition, couleur synchronisée à une métrique. Palette nocturne mauve. Densité parallèle.",
        "frames": [
            ("the-pudding/video-2-loneliness-epidemic/frame-005-grid-twilight-purple.jpg", "Grille SCRT twilight mauve — pattern signature G"),
            ("the-pudding/video-2-loneliness-epidemic/frame-003-grid-sunset.jpg", "Grille SCRT sunset — recolouring temporal"),
            ("the-pudding/video-2-loneliness-epidemic/frame-002-grid-morning-clock.jpg", "Horloge HUD metronome narratif — ancrage temporel"),
            ("the-pudding/video-1-big-hair/frame-003-small-multiples-charts.jpg", "Small multiples + charts — variante data-viz"),
        ],
    },
}


def img_to_b64(path: Path) -> str:
    if not path.exists():
        return ""
    data = path.read_bytes()
    return "data:image/jpeg;base64," + base64.b64encode(data).decode()


def build():
    sections = []

    for template_name, template_data in MOODBOARD.items():
        frames_html = []
        for rel_path, caption in template_data["frames"]:
            full_path = ROOT / rel_path
            b64 = img_to_b64(full_path)
            if b64:
                frames_html.append(
                    f'<figure>'
                    f'<img src="{b64}" alt="{html.escape(caption)}" loading="lazy"/>'
                    f'<figcaption>{html.escape(caption)}</figcaption>'
                    f'</figure>'
                )

        if not frames_html:
            frames_html.append(
                '<div class="placeholder">Pas encore de frames référencées — à compléter</div>'
            )

        sections.append(f"""
<section class="template">
  <h2>{html.escape(template_name)}</h2>
  <p class="desc">{html.escape(template_data['description'])}</p>
  <div class="frames-grid">{''.join(frames_html)}</div>
</section>
""")

    css = """
* { box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  background: #0a0a0a; color: #f0e8d8;
  margin: 0 auto; padding: 16px 20px; max-width: 720px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
}
h1 {
  font-size: 22px; margin: 8px 0 4px; color: #f5d547;
  font-weight: 700; letter-spacing: 1px;
}
.subtitle {
  font-size: 13px; color: #9a8e7a; margin-bottom: 20px;
}
.template {
  background: #14110a; border-radius: 8px; padding: 14px 16px;
  margin-bottom: 18px; border: 1px solid #1f1a10;
}
.template h2 {
  font-size: 17px; margin: 0 0 6px; color: #e89b3c;
  letter-spacing: 0.3px;
}
.template .desc {
  font-size: 13px; color: #9a8e7a; margin: 0 0 12px;
  font-style: italic;
}
.frames-grid {
  display: flex; gap: 8px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
}
.frames-grid figure {
  margin: 0; flex: 0 0 280px; scroll-snap-align: center;
}
.frames-grid img {
  width: 100%; height: auto; border-radius: 4px;
  display: block; aspect-ratio: 16/9; object-fit: cover;
  border: 1px solid #2a2018;
}
.frames-grid figcaption {
  font-size: 11px; color: #d4c5a0; margin-top: 4px;
  text-align: center; line-height: 1.3;
}
.placeholder {
  background: #0e0c08; padding: 24px 16px; border-radius: 4px;
  text-align: center; color: #5a5a5a; font-size: 12px;
  font-style: italic; flex: 1;
}
"""

    html_doc = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Souverain Moodboard — Templates validés</title>
<style>{css}</style>
</head>
<body>
<h1>Souverain — Moodboard validé</h1>
<p class="subtitle">Références visuelles par template. Zéro analyse, zéro bruit.<br>Pour les détails techniques : voir CONSOLIDATION-V1.md.</p>
{''.join(sections)}
</body>
</html>
"""
    OUT.write_text(html_doc, encoding="utf-8")
    size_kb = OUT.stat().st_size / 1024
    print(f"✅ Moodboard generated: {OUT}")
    print(f"   Size: {size_kb:.1f} KB")
    print(f"   Templates: {len(MOODBOARD)}")


if __name__ == "__main__":
    build()
