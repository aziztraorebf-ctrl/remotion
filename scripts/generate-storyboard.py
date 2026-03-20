"""
Storyboard Generator — GeoAfrique Shorts
Uses Gemini 2.0 Flash (imagen-3.0-generate-002) to generate one image per script beat.
Output: tmp/storyboard/ — numbered PNG files + HTML gallery
"""

import os
import base64
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent.parent / ".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

OUTPUT_DIR = Path(__file__).parent.parent / "tmp" / "storyboard-abou-bakari"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Style system prompt — appliqué à tous les beats
STYLE_SYSTEM = """
Visual style: flat design vector map aesthetic.
Dark background (#0a0a0f near-black).
African geography rendered as clean SVG-style shapes in warm tones.
Gold (#D4AF37) and amber (#C8820A) for highlights, borders, empire territories.
Deep terracotta (#8B3A2A) for dramatic elements.
Cream/parchment (#F5E6C8) for text overlays and labels.
Cinematic 9:16 vertical format (1080x1920).
No photorealism. No 3D. Pure flat design motion graphics aesthetic.
Think: GeoGlobeTales meets Al Jazeera documentary infographic.
Clean, minimal, impactful. Every frame must feel like a premium animated documentary.
NO people faces. NO realistic humans. Abstract map elements, geometric shapes, gold particles only.
"""

# Les 8 beats du script Abou Bakari II
BEATS = [
    {
        "id": "01-ocean",
        "timestamp": "0-3s",
        "narration": "En 1311, l'océan Atlantique n'a pas de nom. Personne ne sait ce qu'il y a de l'autre côté.",
        "prompt": f"""
{STYLE_SYSTEM}
Scene: Aerial view of the Atlantic Ocean from West African coast perspective.
Composition: Bottom third = African coastline (Senegal/Mali coast) in warm terracotta tones.
Top two-thirds = vast dark ocean, deep blue-black (#0a1628), with subtle gold light on horizon.
No landmarks visible yet. Just the immensity of unknown ocean.
Mood: mysterious, vast, unknown. The ocean is a void.
Text overlay top-center: "1311" in large gold serif font, slight glow.
Atmosphere: pre-dawn light, dramatic.
"""
    },
    {
        "id": "02-empire",
        "timestamp": "3-7s",
        "narration": "Et l'homme qui règne sur l'empire le plus riche du monde décide de le traverser.",
        "prompt": f"""
{STYLE_SYSTEM}
Scene: Map of the Mali Empire at its peak (1311) glowing in gold on dark background.
The empire territory covers West Africa — from Atlantic coast to Niger river bend.
Gold borders pulse with soft light. Interior filled with warm amber gradient.
Trade routes as thin dotted gold lines crossing the Sahara northward.
Cities as small gold circles: Niani (capital), Timbuktu, Gao.
Scale indicator shows this is MASSIVE — larger than Western Europe.
Text overlay: "L'empire le plus riche du monde" in cream colored elegant serif.
Mood: grandeur, power, wealth.
"""
    },
    {
        "id": "03-name",
        "timestamp": "7-12s",
        "narration": "Cet homme, c'est Abou Bakari II. Mansa — roi des rois — du Mali.",
        "prompt": f"""
{STYLE_SYSTEM}
Scene: Abstract royal silhouette — geometric, minimal. NOT a face or realistic person.
A throne-like geometric shape in gold, radiating power. Crown as abstract angular shapes.
Background: dark, with Mali empire map as subtle ghost layer behind.
Arabic calligraphy-inspired text floating: name in elegant gold script.
Text overlay center: "ABOU BAKARI II" bold gold. Below: "Mansa — Roi des Rois" in cream.
Decorative gold geometric border elements in corners, inspired by Islamic geometric patterns.
Mood: regal, mythic, ancient power.
"""
    },
    {
        "id": "04-fleet-prep",
        "timestamp": "12-18s",
        "narration": "Il fait préparer deux mille pirogues. Il en envoie deux cents en éclaireurs. Un seul bateau revient.",
        "prompt": f"""
{STYLE_SYSTEM}
Scene: West African coastline (Senegambian coast) from above.
2000 small gold boat-silhouettes (simple pirogue shapes) clustered at the coast, ready to depart.
Then a subset of 200 boats shown separating, heading west into the dark ocean.
The 200 boats are mid-ocean. Only 1 tiny gold dot is returning eastward toward the coast.
All other dots (199) are faded/ghosted into the ocean darkness — they disappeared.
Counter overlay: "2 000 pirogues" large gold. Then "200 éclaireurs →". Then "1 seul revient ←" in red-amber.
Ocean: dark, hostile, swallowing the fleet.
Mood: scale of ambition + ominous loss.
"""
    },
    {
        "id": "05-abdication",
        "timestamp": "18-24s",
        "narration": "Abou Bakari abdique son trône. Et part avec les deux mille. Il ne reviendra jamais.",
        "prompt": f"""
{STYLE_SYSTEM}
Scene: Split composition.
Left half: the Mali Empire map with a gold crown/throne symbol — being abandoned, dimming.
Right half: 2000 gold boat silhouettes streaming westward into black ocean.
Center: a single bold arrow pointing west, in gold, fading into darkness.
The boats cross the frame edge and disappear — they are gone.
Text overlay: "Il abdique." then below "2 000 pirogues." then below "Il ne reviendra jamais."
Each line appears at different vertical position, stacked dramatically.
Mood: irreversible decision, mythic departure, tragedy.
Color: the empire (left) fades to grey as boats (right) blaze gold then vanish.
"""
    },
    {
        "id": "06-timeline",
        "timestamp": "30-42s",
        "narration": "Son demi-frère monte sur le trône. Mansa Moussa — l'homme le plus riche de toute l'histoire. Quatre cents milliards de dollars. Abou Bakari a abandonné ça.",
        "prompt": f"""
{STYLE_SYSTEM}
Scene: Timeline visualization — horizontal golden line across the frame.
Left point: "1311 — Abou Bakari part" with gold boat icon.
Right point: "1324 — Mansa Moussa au Caire" with crown icon glowing bright gold.
Below the timeline: abstract wealth visualization — gold bars/coins/stacks in stylized flat design.
Counter: "$400 000 000 000" large gold text with subtle glow, suggesting incomprehensible wealth.
Above: ghost outline of Abou Bakari's silhouette (abstract) walking away from this wealth.
Text: "Il a abandonné ça." in bold cream, bottom third.
Mood: scale of sacrifice. The richest kingdom in history — given up.
"""
    },
    {
        "id": "07-colomb",
        "timestamp": "42-55s",
        "narration": "Cent quatre-vingt-un ans plus tard, Christophe Colomb traverse le même océan. On l'appelle le découvreur. Pourtant — qui a traversé en premier ?",
        "prompt": f"""
{STYLE_SYSTEM}
Scene: The Atlantic Ocean as central element. Two timelines converge.
Top: "1311" — gold boat silhouettes (African pirogues) heading west.
Bottom: "1492" — stylized European caravelle silhouettes heading west.
In the center of the ocean: giant bold text "181 ANS" glowing in gold.
A large question mark "?" overlaid on the caravelle path — challenging the narrative.
West edge of map: a landmass (Americas) partially visible.
Text bottom: "Qui a traversé en premier ?" in cream, large.
Mood: confrontational, reframing history. The question hangs in the air.
Color contrast: African fleet in warm gold, European fleet in cold silver-blue.
"""
    },
    {
        "id": "08-close",
        "timestamp": "68-75s",
        "narration": "Un homme a regardé un océan inconnu, a abandonné quatre cents milliards, et a dit — j'y vais. Et toi tu savais ça ?",
        "prompt": f"""
{STYLE_SYSTEM}
Scene: Final frame. Pure black background. Center: a single gold boat silhouette, small, alone on a vast dark ocean.
Horizon line: a thin gold line across the frame. Nothing beyond — the unknown.
Above the boat: stars as tiny gold particles (African night sky, 1311).
Text overlay: "ABOU BAKARI II" in large gold serif font, centered.
Below: "1311" in smaller cream font.
Very bottom: a subtle question mark "?" fading in, in gold.
The single boat faces west — into darkness — forever.
Mood: mythic, melancholic, awe-inspiring. The perfect final image.
Composition: minimal, iconic, shareable.
"""
    }
]


def generate_storyboard_image(beat: dict) -> str:
    print(f"Generating beat {beat['id']} ({beat['timestamp']})...")
    print(f"  Narration: {beat['narration'][:60]}...")

    response = client.models.generate_content(
        model="models/gemini-3.1-flash-image-preview",
        contents=beat["prompt"],
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        ),
    )

    image_bytes = None
    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data:
            image_bytes = part.inline_data.data
            break

    if not image_bytes:
        print(f"  ERROR: No image in response for {beat['id']}")
        return None

    output_path = OUTPUT_DIR / f"{beat['id']}.png"
    with open(output_path, "wb") as f:
        f.write(image_bytes)

    print(f"  Saved: {output_path}")
    return str(output_path)


def generate_html_gallery(results: list) -> str:
    html_path = OUTPUT_DIR / "storyboard.html"

    cards = ""
    for beat, path in zip(BEATS, results):
        if path:
            img_src = Path(path).name
            cards += f"""
        <div class="card">
            <div class="timestamp">{beat['timestamp']}</div>
            <img src="{img_src}" alt="{beat['id']}">
            <div class="narration">"{beat['narration']}"</div>
            <div class="beat-id">{beat['id']}</div>
        </div>"""

    html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Storyboard — Abou Bakari II</title>
    <style>
        body {{ background: #0a0a0f; color: #F5E6C8; font-family: Georgia, serif; margin: 0; padding: 20px; }}
        h1 {{ text-align: center; color: #D4AF37; font-size: 2em; margin-bottom: 30px; }}
        .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; max-width: 1400px; margin: 0 auto; }}
        .card {{ background: #12121a; border: 1px solid #2a2a3a; border-radius: 8px; overflow: hidden; }}
        .card img {{ width: 100%; display: block; }}
        .timestamp {{ background: #D4AF37; color: #0a0a0f; padding: 6px 12px; font-size: 0.85em; font-weight: bold; }}
        .narration {{ padding: 12px; font-style: italic; color: #C8C0A8; font-size: 0.9em; line-height: 1.5; }}
        .beat-id {{ padding: 0 12px 12px; color: #4a4a6a; font-size: 0.75em; font-family: monospace; }}
    </style>
</head>
<body>
    <h1>Storyboard — Abou Bakari II (1311)</h1>
    <div class="grid">{cards}
    </div>
</body>
</html>"""

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"\nGallery saved: {html_path}")
    return str(html_path)


def main():
    print("=== Storyboard Generator — Abou Bakari II ===")
    print(f"Output: {OUTPUT_DIR}")
    print(f"Beats: {len(BEATS)}")
    print(f"Model: imagen-3.0-generate-002\n")

    results = []
    for beat in BEATS:
        path = generate_storyboard_image(beat)
        results.append(path)

    html_path = generate_html_gallery(results)

    success = sum(1 for r in results if r)
    print(f"\nDone: {success}/{len(BEATS)} images generated")
    print(f"Gallery: {html_path}")

    if success > 0:
        import subprocess
        subprocess.run(["open", html_path], check=False)


if __name__ == "__main__":
    main()
