"""Extrait les sous-groupes <g id="X">...</g> d'un bloc parent (deja extrait par
extract-svg-groups.py) en tableau TS [{id, html}], pour permettre un stagger/staging
individuel par item cote Remotion (V3 -- principes motion design : staging sequentiel,
timing decale, pas de bloc fige anime en groupe).

Usage: python3 split-subitems.py <groups.ts> <CONST_NAME> <out.ts> <PREFIX>
"""
import re
import sys
from pathlib import Path


def split_subgroups(text):
    tag_re = re.compile(r'<g id="([^"]*)"[^>]*>')
    items = []
    i = 0
    while True:
        m = tag_re.search(text, i)
        if not m:
            break
        gid = m.group(1)
        depth = 1
        j = m.end()
        inner_tag_re = re.compile(r"<(/?)g\b[^>]*>")
        while depth > 0:
            nm = inner_tag_re.search(text, j)
            if nm.group(0).startswith("</"):
                depth -= 1
            else:
                depth += 1
            j = nm.end()
        items.append((gid, text[m.start():j]))
        i = j
    return items


def ts_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def main():
    if len(sys.argv) != 5:
        print(__doc__)
        sys.exit(1)
    groups_ts, const_name, out, prefix = sys.argv[1:5]
    content = Path(groups_ts).read_text()
    m = re.search(rf"export const {const_name} = `(.*?)`;", content, re.DOTALL)
    if not m:
        print(f"ERROR: {const_name} introuvable dans {groups_ts}")
        sys.exit(1)
    items = split_subgroups(m.group(1))

    lines = [
        f"// Sous-items de {const_name} extraits individuellement pour staging/stagger V3.",
        "// Genere par scripts/split-subitems.py.",
        "",
        f"export type {prefix}Item = {{ id: string; html: string }};",
        "",
        f"export const {prefix}_ITEMS: {prefix}Item[] = [",
    ]
    for gid, html in items:
        lines.append(f'  {{ id: "{gid}", html: `{ts_escape(html)}` }},')
    lines.append("];")

    Path(out).write_text("\n".join(lines))
    print(f"OK -> {out} ({len(items)} items)")
    for gid, _ in items:
        print(f"  {gid}")


if __name__ == "__main__":
    main()
