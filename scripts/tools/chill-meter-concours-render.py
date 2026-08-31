"""
chill-meter-concours-render.py — rend chaque planche du concours metal en 2 PNG (brushed/machined).

Chaque modele a produit UN document SVG contenant <g id="brushed"> et <g id="machined">.
On isole chaque variante dans son propre document (en gardant les <defs> communs), on rasterise
avec cairosvg, puis on monte la planche comparative.

Usage :
    python3 scripts/tools/chill-meter-concours-render.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "out/_r-and-d/chill-meter-upwork/concours-metal"
W, H = 1448, 1086


def extract_variant(svg: str, variant: str) -> str | None:
    """Isole <g id="variant">...</g> avec les defs, en respectant l'imbrication des <g>."""
    m = re.search(rf'<g[^>]*\bid="{variant}"', svg)
    if not m:
        return None
    start = m.start()
    # avancer en comptant les <g> ouverts/fermes pour trouver le </g> qui ferme CE groupe
    i, depth = start, 0
    for tok in re.finditer(r"<g\b|</g>", svg[start:]):
        if tok.group() == "<g":
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                i = start + tok.end()
                break
    group = svg[start:i]

    defs = ""
    d = re.search(r"<defs\b.*?</defs>", svg, re.S)
    if d:
        defs = d.group(0)

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {W} {H}" '
        f'width="{W}" height="{H}">{defs}{group}</svg>'
    )


def main():
    """Rasterise via Chromium (Playwright). cairosvg est inutilisable ici : libcairo n'est pas
    installe sur cette machine, et on n'ajoute pas une dependance systeme pour une planche."""
    from playwright.sync_api import sync_playwright

    jobs = []
    for f in sorted(SRC.glob("metal-*.svg")):
        model = f.stem.replace("metal-", "")
        svg = f.read_text(encoding="utf-8")
        for variant in ("brushed", "machined"):
            doc = extract_variant(svg, variant)
            if not doc:
                print(f"[{model}/{variant}] groupe absent")
                continue
            jobs.append((model, variant, doc))

    if not jobs:
        print("aucune planche a rendre")
        return

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": W, "height": H})
        for model, variant, doc in jobs:
            # fond sombre explicite : un metal sur blanc est illisible, et la transparence
            # s'affiche comme du noir dans les visualiseurs (piege deja paye sur ce projet).
            html = (
                '<html><body style="margin:0;background:#0e131b">' + doc + "</body></html>"
            )
            page.set_content(html)
            out = SRC / f"{model}-{variant}.png"
            page.screenshot(path=str(out))
            print(f"[{model}/{variant}] -> {out.name}")
        browser.close()


if __name__ == "__main__":
    main()
