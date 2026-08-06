"""Extrait les groupes <g id="..."> de premier niveau d'un SVG source (+ <defs>) et genere
un fichier TypeScript de constantes exploitable par le pattern d'injection Remotion
(doctrine SVG-SCENES-GENERATIVES : matiere LLM statique -> vie animee en JSX).

Usage:
  python3 extract-svg-groups.py <source.svg> <out.ts> <PREFIX>
"""
import re
import sys
from pathlib import Path


def extract_top_level_groups(svg_text: str):
    """Retourne [(id, attrs_string, inner_html), ...] pour chaque <g id="..."> de PREMIER
    NIVEAU (profondeur 1 sous <svg>), en gerant l'imbrication de balises <g>.

    attrs_string = les attributs AUTRES que id portes par la balise <g> elle-meme
    (opacity/fill/stroke/filter/transform/stroke-linecap...). CRITIQUE : ces attributs
    sont hebergeants (ex fill="none" sur le <g> => les enfants sans fill explicite en
    heritent). Les perdre fait basculer un cercle "stroke only" vers le fill noir par
    defaut SVG -- bug constate (disque noir opaque, panneau resolution 2026-08-05)."""
    # Localise le contenu du <svg> racine (apres la balise ouvrante)
    svg_open_end = svg_text.index(">", svg_text.index("<svg")) + 1
    svg_close_start = svg_text.rindex("</svg>")
    body = svg_text[svg_open_end:svg_close_start]

    groups = []
    i = 0
    tag_re = re.compile(r"<(/?)g\b([^>]*)>")
    while True:
        m = tag_re.search(body, i)
        if not m:
            break
        if m.group(1) == "/":
            i = m.end()
            continue
        # balise <g ...> ouvrante de premier niveau trouvee
        attrs = m.group(2)
        id_m = re.search(r'id="([^"]*)"', attrs)
        gid = id_m.group(1) if id_m else None
        other_attrs = re.sub(r'\s*id="[^"]*"', "", attrs).strip()
        # trouver la fermeture correspondante en comptant la profondeur
        depth = 1
        j = m.end()
        while depth > 0:
            nm = tag_re.search(body, j)
            if not nm:
                raise ValueError(f"Balise <g> non fermee pour id={gid}")
            if nm.group(1) == "/":
                depth -= 1
                close_end = nm.end()
            else:
                depth += 1
            j = nm.end()
        inner = body[m.end():close_end - len("</g>")]
        if gid:
            groups.append((gid, other_attrs, inner.strip()))
        i = close_end
    return groups


def extract_defs(svg_text: str):
    m = re.search(r"<defs[^>]*>(.*?)</defs>", svg_text, re.DOTALL)
    return m.group(1).strip() if m else ""


def to_const_name(prefix: str, gid: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", gid).strip("_")
    return f"{prefix}_{slug}".upper()


def ts_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


ATTR_RE = re.compile(r'([a-zA-Z:_-]+)="([^"]*)"')


def parse_attrs_to_jsobj(attrs: str) -> str:
    """'fill=\"none\" stroke-linecap=\"round\"' -> '{ "fill": "none", "strokeLinecap": "round" }'
    (camelCase pour les attributs SVG multi-mots, requis par React)."""
    pairs = ATTR_RE.findall(attrs)
    js_pairs = []
    for key, val in pairs:
        # camelCase les attributs a tiret (React exige className/strokeLinecap, PAS class/stroke-linecap)
        # sauf data-*/aria-* (non presents ici) et les attributs deja simples.
        camel = re.sub(r"-([a-z])", lambda m: m.group(1).upper(), key)
        js_pairs.append(f'"{camel}": "{val}"')
    return "{ " + ", ".join(js_pairs) + " }"


def main():
    if len(sys.argv) != 4:
        print(__doc__)
        sys.exit(1)
    src, out, prefix = sys.argv[1], sys.argv[2], sys.argv[3]
    svg_text = Path(src).read_text()

    defs = extract_defs(svg_text)
    groups = extract_top_level_groups(svg_text)

    lines = [
        f"// Groupes SVG extraits de {Path(src).name} (source Fable 5, statique).",
        "// Doctrine SVG-SCENES-GENERATIVES : matiere LLM figee ici, animation en JSX cote composant.",
        "// Genere par scripts/extract-svg-groups.py -- ne pas editer a la main, regenerer si le SVG source change.",
        "//",
        "// *_ATTRS : attributs portes par la balise <g id=...> source (opacity/fill/stroke/filter/",
        "// transform/stroke-linecap...) -- HERITAGE CRITIQUE (ex fill=\"none\" sur le <g> => les enfants",
        "// sans fill explicite en heritent). A reappliquer sur le <g> wrapper qui injecte le contenu,",
        "// sinon un cercle \"stroke only\" bascule vers le fill noir par defaut SVG.",
        "",
    ]
    if defs:
        lines.append(f"export const {prefix}_DEFS = `{ts_escape(defs)}`;")
        lines.append("")

    group_ids = []
    for gid, other_attrs, inner in groups:
        const_name = to_const_name(prefix, gid)
        group_ids.append((gid, const_name, other_attrs))
        lines.append(f"export const {const_name} = `{ts_escape(inner)}`;")
        if other_attrs:
            lines.append(f"export const {const_name}_ATTRS = {parse_attrs_to_jsobj(other_attrs)} as const;")
        lines.append("")

    lines.append(f"export const {prefix}_GROUP_IDS = {[gid for gid, _, _ in group_ids]!r};".replace("'", '"'))
    lines.append("")

    Path(out).write_text("\n".join(lines))
    print(f"OK -> {out} ({len(groups)} groupes, defs={'oui' if defs else 'non'})")
    for gid, const_name, other_attrs in group_ids:
        marker = f"  [ATTRS: {other_attrs}]" if other_attrs else ""
        print(f"  {gid:30s} -> {const_name}{marker}")


if __name__ == "__main__":
    main()
