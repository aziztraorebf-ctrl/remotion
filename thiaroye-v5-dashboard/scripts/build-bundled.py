#!/usr/bin/env python3
"""Build dashboard-bundled.html - inlines CSS + JS + scenes.json data."""
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
html = (ROOT / "index.html").read_text()
css = (ROOT / "dashboard.css").read_text()
js = (ROOT / "dashboard.js").read_text()
data = json.loads((ROOT / "data" / "scenes.json").read_text())

html = html.replace(
    '<link rel="stylesheet" href="dashboard.css">',
    f'<style>\n{css}\n</style>'
)

original_load_data = '''async function loadData() {
  try {
    const response = await fetch('data/scenes.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error('Failed to load scenes.json:', err);
    document.getElementById('meta-info').textContent =
      `Erreur chargement: ${err.message}. Ouvre via un serveur local (python3 -m http.server).`;
    return null;
  }
}'''

inlined = f"""async function loadData() {{
  return {json.dumps(data, ensure_ascii=False)};
}}"""

if original_load_data in js:
    js_inlined = js.replace(original_load_data, inlined)
else:
    print("WARN: loadData pattern not found - trying fallback inline")
    js_inlined = js + f"\n\nwindow.__SCENES_DATA__ = {json.dumps(data, ensure_ascii=False)};\n"

html = html.replace(
    '<script src="dashboard.js"></script>',
    f'<script>\n{js_inlined}\n</script>'
)

output = ROOT / "dashboard-bundled.html"
output.write_text(html)
size_kb = len(html) / 1024
print(f"Built: {output}")
print(f"Size: {size_kb:.1f} KB")
print(f"Scenes: {len(data['scenes'])}")
print(f"Review notes: {sum(1 for s in data['scenes'] if 'review_notes' in s)}")
