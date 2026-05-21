#!/usr/bin/env python3
"""Build mobile-first dashboard for Souverain Scout.

Reads memory/templates-research/scouting/par-chaine/* and generates a
single self-contained HTML with base64 frames (top 3 per video).
"""
import argparse
import base64
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path("/Users/clawdbot/Workspace/remotion/memory/templates-research/scouting/par-chaine")
OUT = Path("/tmp/scout-dashboard/dashboard.html")

# Map batch number to channels (so we can filter by --batch=N)
BATCH_CHANNELS = {
    1: ["caspian-report"],
    2: ["reallifelore", "map-men", "wonderwhy", "vox"],
    3: ["wendover", "polymatter", "bloomberg", "nyt-visual-investigations"],
    4: ["le-monde", "geopolitics-explained", "johnny-harris", "africa-eye"],
    5: ["general-knowledge", "kurzgesagt", "the-pudding", "tldr-news-global"],
}

VERDICT_EMOJI = {"🟢": "🟢", "🟡": "🟡", "🔴": "🔴"}


def read_md(path: Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")


def extract_verdict(text: str) -> str:
    for emoji in ("🟢", "🟡", "🔴"):
        if emoji in text:
            return emoji
    return "⚪"


def first_h1(text: str) -> str:
    m = re.search(r"^#\s+(.+)$", text, flags=re.MULTILINE)
    return m.group(1).strip() if m else ""


def section(text: str, header: str) -> str:
    """Return content of a `## header` section (until next ## or EOF)."""
    pattern = rf"^##\s+{re.escape(header)}\s*$(.*?)(?=^##\s|\Z)"
    m = re.search(pattern, text, flags=re.MULTILINE | re.DOTALL)
    return m.group(1).strip() if m else ""


def md_to_html(md: str) -> str:
    """Tiny markdown renderer for our specific format."""
    out = []
    in_list = False
    for line in md.splitlines():
        stripped = line.strip()
        if not stripped:
            if in_list:
                out.append("</ul>")
                in_list = False
            out.append("")
            continue
        # bold
        rendered = html.escape(stripped)
        rendered = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", rendered)
        rendered = re.sub(r"`([^`]+)`", r"<code>\1</code>", rendered)
        if stripped.startswith("- "):
            if not in_list:
                out.append("<ul>")
                in_list = True
            out.append(f"<li>{rendered[4:]}</li>")
        elif re.match(r"^\d+\.\s", stripped):
            if not in_list:
                out.append("<ol>")
                in_list = True
            out.append(f"<li>{re.sub(r'^\d+\.\s', '', rendered)}</li>")
        else:
            if in_list:
                out.append("</ul></ol>"[: 5 if "<ol>" in "".join(out[-5:]) else 5])
                in_list = False
            out.append(f"<p>{rendered}</p>")
    if in_list:
        out.append("</ul>")
    return "\n".join(out)


def img_to_b64(path: Path) -> str:
    data = path.read_bytes()
    return "data:image/jpeg;base64," + base64.b64encode(data).decode()


def build_video_block(video_dir: Path) -> str:
    notes_md = read_md(video_dir / "notes.md")
    title = first_h1(notes_md) or video_dir.name
    # Try both: section body (batch 1) and title-line emoji (batch 2)
    title_line = re.search(r"^##\s+Verdict (?:global )?vid[ée]o[^\n]*", notes_md, flags=re.MULTILINE)
    title_line_text = title_line.group(0) if title_line else ""
    verdict = extract_verdict(title_line_text) if title_line_text and extract_verdict(title_line_text) != "⚪" else extract_verdict(section(notes_md, "Verdict vidéo")) or extract_verdict(section(notes_md, "Verdict global vidéo"))

    # Match both naming conventions: frame-001-* and 01-* (some agents in batch 3 used short naming)
    frames_glob1 = sorted(video_dir.glob("frame-*.jpg"))
    frames_glob2 = sorted(video_dir.glob("[0-9][0-9]-*.jpg"))
    frames = (frames_glob1 + frames_glob2)[:3]
    frame_imgs = []
    for f in frames:
        b64 = img_to_b64(f)
        label = f.stem.replace("frame-", "").replace("-", " ")
        frame_imgs.append(
            f'<figure><img src="{b64}" alt="{html.escape(label)}" loading="lazy"/>'
            f'<figcaption>{html.escape(label)}</figcaption></figure>'
        )

    # Try both batch formats (batch 1 = Palette/Typo/Mouvement/Transitions, batch 2 = Axes 1/2/3)
    top3 = section(notes_md, "Top 3 idées à voler pour Souverain")
    palette_b1 = section(notes_md, "Palette")
    typo_b1 = section(notes_md, "Typographie")
    movement_b1 = section(notes_md, "Mouvement caméra")
    transitions_b1 = section(notes_md, "Transitions")

    palette_b2 = section(notes_md, "Axe 1 — Palette de couleurs")
    assets_b2 = section(notes_md, "Axe 2 — Assets / figures d'animation")
    camera_b2 = section(notes_md, "Axe 3 — Mouvements caméra")
    recipe_b2 = section(notes_md, "Recette technique (pour reproduire en Mapbox + Remotion)")

    sections_html = []
    if top3:
        sections_html.append(f'<details><summary>💡 Top 3 idées à voler</summary>{md_to_html(top3)}</details>')
    if palette_b2:
        sections_html.append(f'<details><summary>🎨 Axe 1 — Palette</summary>{md_to_html(palette_b2)}</details>')
    elif palette_b1:
        sections_html.append(f'<details><summary>🎨 Palette</summary>{md_to_html(palette_b1)}</details>')
    if assets_b2:
        sections_html.append(f'<details><summary>🧩 Axe 2 — Assets / figures</summary>{md_to_html(assets_b2)}</details>')
    if typo_b1:
        sections_html.append(f'<details><summary>🔤 Typographie</summary>{md_to_html(typo_b1)}</details>')
    if camera_b2:
        sections_html.append(f'<details><summary>🎥 Axe 3 — Mouvements caméra</summary>{md_to_html(camera_b2)}</details>')
    elif movement_b1:
        sections_html.append(f'<details><summary>🎥 Mouvement caméra</summary>{md_to_html(movement_b1)}</details>')
    if transitions_b1:
        sections_html.append(f'<details><summary>✂️ Transitions</summary>{md_to_html(transitions_b1)}</details>')
    if recipe_b2:
        sections_html.append(f'<details><summary>⚙️ Recette technique Mapbox+Remotion</summary>{md_to_html(recipe_b2)}</details>')

    return f"""
<details class="video">
  <summary>
    <span class="verdict">{verdict}</span>
    <span class="vid-title">{html.escape(title)}</span>
  </summary>
  <div class="frames">{''.join(frame_imgs)}</div>
  <div class="notes">
    {''.join(sections_html)}
  </div>
</details>
"""


def build_channel_block(channel_dir: Path) -> str:
    summary_md = read_md(channel_dir / "_summary.md")
    title = first_h1(summary_md) or channel_dir.name
    title = title.replace("— Résumé scout", "").strip()
    # Verdict resolution — try multiple patterns:
    # 1. "## Verdict global chaîne : 🟢" (batch 2 inline)
    # 2. "## Verdict global chaîne" with body containing emoji (batch 1)
    # 3. Look for "Verdict global chaîne**" or similar bold inline
    # 4. Fallback : take MAJORITY verdict from per-video table or any verdict found
    verdict = "⚪"
    candidates = [
        # Title line with optional "chaîne" word and any whitespace
        re.search(r"^##\s+Verdict global(?:\s+cha[îi]ne)?[^\n]*", summary_md, flags=re.MULTILINE),
        # Body of section after title (multi-line)
        re.search(r"##\s+Verdict global(?:\s+cha[îi]ne)?[^\n]*\n+([^\n#]+)", summary_md),
        # Bold inline
        re.search(r"\*\*Verdict global(?:\s+cha[îi]ne)?[^\n]*", summary_md),
        # Generic fallback
        re.search(r"Verdict global(?:\s+cha[îi]ne)?[^\n]{0,80}", summary_md),
    ]
    for c in candidates:
        if c:
            v = extract_verdict(c.group(0))
            if v != "⚪":
                verdict = v
                break
    if verdict == "⚪":
        verdict = extract_verdict(section(summary_md, "Verdict global chaîne"))
    # Last resort: if still unknown, take majority from per-video subdirs
    if verdict == "⚪":
        emojis_found = []
        for video_dir in channel_dir.iterdir():
            if not video_dir.is_dir():
                continue
            v_md = read_md(video_dir / "notes.md")
            t_match = re.search(r"^##\s+Verdict (?:global )?vid[ée]o[^\n]*", v_md, flags=re.MULTILINE)
            if t_match:
                e = extract_verdict(t_match.group(0))
                if e != "⚪":
                    emojis_found.append(e)
        if emojis_found:
            # Majority verdict
            from collections import Counter
            verdict = Counter(emojis_found).most_common(1)[0][0]

    signature = section(summary_md, "Signature visuelle (cross-vidéos)")
    diff = section(summary_md, "Différenciation vs Or Africain V5")
    top5 = section(summary_md, "Top 5 idées à voler (consolidé sur les 3 vidéos)")
    synthese_3axes = section(summary_md, "Synthèse 3 axes (collecté pour tests post-scout)") or section(summary_md, "Synthèse 3 axes")
    template_c = section(summary_md, 'Pertinence Template C "satellite tramé dramatique"')
    reco = section(summary_md, "Recommandation")

    videos = sorted([d for d in channel_dir.iterdir() if d.is_dir()])
    video_blocks = "".join(build_video_block(v) for v in videos)

    return f"""
<section class="channel" data-verdict="{verdict}">
  <header class="channel-header">
    <span class="verdict-big">{verdict}</span>
    <h2>{html.escape(title)}</h2>
  </header>
  <details open class="summary">
    <summary>📋 Résumé chaîne</summary>
    {f"<h3>Signature visuelle</h3>{md_to_html(signature)}" if signature else ""}
    {f"<h3>Différenciation vs Or Africain V5</h3>{md_to_html(diff)}" if diff else ""}
    {f"<h3>Synthèse 3 axes (palette / assets / caméra)</h3>{md_to_html(synthese_3axes)}" if synthese_3axes else ""}
    {f"<h3>Top 5 idées à voler</h3>{md_to_html(top5)}" if top5 else ""}
    {f"<h3>Pertinence Template C</h3>{md_to_html(template_c)}" if template_c else ""}
    {f"<h3>Recommandation</h3>{md_to_html(reco)}" if reco else ""}
  </details>
  <h3 class="videos-heading">Vidéos analysées ({len(videos)})</h3>
  {video_blocks}
</section>
"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch", type=int, help="Restrict dashboard to channels of given batch (1-5)")
    parser.add_argument("--channels", type=str, help="Comma-separated channel folder names")
    parser.add_argument("--out", type=str, default=str(OUT), help="Output HTML path")
    args = parser.parse_args()

    all_channels = sorted([d for d in ROOT.iterdir() if d.is_dir()])
    if args.batch and args.batch in BATCH_CHANNELS:
        wanted = set(BATCH_CHANNELS[args.batch])
        channels = [c for c in all_channels if c.name in wanted]
    elif args.channels:
        wanted = set(args.channels.split(","))
        channels = [c for c in all_channels if c.name in wanted]
    else:
        channels = all_channels

    if not channels:
        print("No channels found matching filter.", file=sys.stderr)
        sys.exit(1)

    out_path = Path(args.out)
    channel_blocks = "".join(build_channel_block(c) for c in channels)

    css = """
* { box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
  background: #0a0a0a; color: #f0e8d8;
  margin: 0 auto; padding: 16px 20px; max-width: 720px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
}
p, li { padding-left: 2px; }
ul, ol { padding-left: 24px; }
h1 { font-size: 24px; margin: 8px 0; color: #f5d547; }
h2 { font-size: 20px; margin: 8px 0; color: #f5d547; }
h3 { font-size: 16px; margin: 12px 0 6px; color: #e89b3c; }
p { margin: 6px 0; font-size: 15px; }
code {
  background: #1a1a1a; padding: 1px 5px; border-radius: 3px;
  font-size: 13px; color: #f5d547;
}
ul, ol { padding-left: 20px; margin: 6px 0; }
li { margin: 4px 0; font-size: 15px; }
.intro {
  background: #14110a; padding: 12px; border-radius: 8px;
  border-left: 3px solid #f5d547; margin-bottom: 16px;
  font-size: 14px;
}
.filters {
  display: flex; gap: 8px; margin-bottom: 16px;
  position: sticky; top: 0; background: #0a0a0a; padding: 8px 0;
  z-index: 10; border-bottom: 1px solid #1a1a1a;
}
.filters button {
  background: #1a1a1a; color: #f0e8d8; border: 1px solid #333;
  padding: 6px 12px; border-radius: 4px; font-size: 13px;
  cursor: pointer;
}
.filters button.active {
  background: #f5d547; color: #0a0a0a; border-color: #f5d547;
}
.channel {
  background: #14110a; border-radius: 8px; padding: 12px;
  margin-bottom: 20px; border: 1px solid #1f1a10;
}
.channel-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 8px;
}
.channel-header h2 { margin: 0; flex: 1; }
.verdict-big { font-size: 24px; }
.summary {
  background: #0e0c08; padding: 8px 12px; border-radius: 6px;
  margin-bottom: 12px;
}
.summary > summary {
  font-weight: bold; cursor: pointer; padding: 4px 0;
  color: #e89b3c;
}
.videos-heading { color: #9a8e7a; font-size: 13px; margin-top: 16px; }
.video {
  background: #0e0c08; border-radius: 6px; margin: 8px 0;
  border: 1px solid #1f1a10;
}
.video > summary {
  padding: 10px 12px; cursor: pointer; display: flex;
  align-items: center; gap: 8px; font-size: 14px;
}
.verdict { font-size: 18px; }
.vid-title { flex: 1; }
.frames {
  display: flex; gap: 8px; padding: 8px 12px;
  overflow-x: auto; scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.frames figure {
  margin: 0; flex: 0 0 280px; scroll-snap-align: center;
}
.frames img {
  width: 100%; height: auto; border-radius: 4px;
  display: block; aspect-ratio: 16/9; object-fit: cover;
}
.frames figcaption {
  font-size: 11px; color: #9a8e7a; margin-top: 4px;
  text-align: center;
}
.notes { padding: 0 12px 12px; }
.notes details {
  background: #14110a; padding: 6px 10px; border-radius: 4px;
  margin: 6px 0;
}
.notes details summary {
  cursor: pointer; font-size: 13px; color: #d4c5a0; padding: 2px 0;
}
.notes details[open] summary { color: #f5d547; }
.hidden { display: none; }
.empty-msg {
  text-align: center; padding: 30px 20px; color: #9a8e7a;
  font-style: italic; display: none;
}
.empty-msg.show { display: block; }
.channel { padding: 14px 16px; }
.summary { padding: 10px 14px; }
.video > summary { padding: 12px 14px; }
.frames { padding: 10px 14px; }
.notes { padding: 0 14px 12px; }
"""

    js = """
function filterByVerdict(v) {
  document.querySelectorAll('.filters button').forEach(b =>
    b.classList.toggle('active', b.dataset.verdict === v));
  let visible = 0;
  document.querySelectorAll('.channel').forEach(c => {
    const match = (v === 'all' || c.dataset.verdict === v);
    c.classList.toggle('hidden', !match);
    if (match) visible++;
  });
  document.getElementById('empty-msg').classList.toggle('show', visible === 0);
}
"""

    html_doc = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Souverain Scout — Dashboard</title>
<style>{css}</style>
</head>
<body>
<h1>Souverain Scout — Bibliothèque templates</h1>
<div class="intro">
  <strong>Branche</strong> : feat/souverain-templates-library<br>
  <strong>Chaînes scoutées</strong> : {len(channels)}/17<br>
  <strong>Objectif</strong> : valider verdict 🟢/🟡/🔴 par chaîne pour passer en dissection (Jour 2).
</div>
<div class="filters">
  <button class="active" data-verdict="all" onclick="filterByVerdict('all')">Tout</button>
  <button data-verdict="🟢" onclick="filterByVerdict('🟢')">🟢 Garder</button>
  <button data-verdict="🟡" onclick="filterByVerdict('🟡')">🟡 Partiel</button>
  <button data-verdict="🔴" onclick="filterByVerdict('🔴')">🔴 Skip</button>
</div>
{channel_blocks}
<div id="empty-msg" class="empty-msg">Aucune chaîne dans cette catégorie pour le moment.<br>Essaye un autre filtre.</div>
<script>{js}</script>
</body>
</html>
"""
    out_path.write_text(html_doc, encoding="utf-8")
    size_kb = out_path.stat().st_size / 1024
    print(f"✅ Dashboard generated: {out_path}")
    print(f"   Size: {size_kb:.1f} KB")
    print(f"   Channels: {len(channels)} ({', '.join(c.name for c in channels)})")


if __name__ == "__main__":
    main()
