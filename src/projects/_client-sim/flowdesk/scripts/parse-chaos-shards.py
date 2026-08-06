"""Parse le contenu de CHAOS_F5_CHAOS en shards individuels + leur couche de profondeur, pour
generer un tableau TS exploitable par React (chaque shard anime individuellement -- V2 mouvement,
brief 2026-08-05). Sans ca, f5-chaos reste un bloc figé anime en groupe (le probleme signale par
Aziz : "un mouvement minimal de wiggle" au lieu d'un vrai mouvement individuel par element).

Usage : python3 parse-chaos-shards.py
"""
import re
import json
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "groups" / "chaosGroups.ts"
OUT = Path(__file__).resolve().parent.parent / "groups" / "chaosShards.ts"


def extract_const(name: str, text: str) -> str:
    m = re.search(rf"export const {name} = `(.*?)`;", text, re.DOTALL)
    if not m:
        raise ValueError(f"const {name} introuvable")
    return m.group(1)


def parse_shards(inner: str, depth: str):
    """Extrait les <g transform="translate(x y) rotate(d)">...</g> de premier niveau."""
    shards = []
    tag_re = re.compile(r'<g transform="translate\(([-\d.]+) ([-\d.]+)\) rotate\(([-\d.]+)\)">')
    i = 0
    while True:
        m = tag_re.search(inner, i)
        if not m:
            break
        tx, ty, rot = float(m.group(1)), float(m.group(2)), float(m.group(3))
        close = inner.index("</g>", m.end())
        content = inner[m.end():close]
        shards.append({"tx": tx, "ty": ty, "rot": rot, "content": content, "depth": depth})
        i = close + 4
    return shards


def main():
    text = SRC.read_text()
    inner = extract_const("CHAOS_F5_CHAOS", text)

    # ellipse de fond (avant tout <g>)
    first_g = inner.index("<g opacity=")
    bg_ellipse = inner[:first_g].strip()

    tag_re = re.compile(r"<(/?)g\b[^>]*>")  # matche la balise ENTIERE (jusqu'au > inclus)

    def find_matching_close(text: str, open_end: int) -> int:
        """Retourne l'index JUSTE APRES le '>' du </g> qui ferme le <g> ouvert en open_end
        (en comptant la profondeur, gere l'imbrication)."""
        depth = 1
        j = open_end
        while depth > 0:
            m = tag_re.search(text, j)
            if m.group(0).startswith("</"):
                depth -= 1
            else:
                depth += 1
            j = m.end()
        return j

    # couche FAR (depthFar, opacity 0.3)
    far_start = inner.index('<g opacity="0.3" filter="url(#f5-depthFar)">')
    far_open_end = inner.index(">", far_start) + 1
    far_close_end = find_matching_close(inner, far_open_end)
    far_inner = inner[far_open_end:far_close_end - len("</g>")]

    # couche MID (depthMid, opacity 0.6) -- juste apres far
    mid_start = inner.index('<g opacity="0.6" filter="url(#f5-depthMid)">', far_close_end)
    mid_open_end = inner.index(">", mid_start) + 1
    mid_close_end = find_matching_close(inner, mid_open_end)
    mid_inner = inner[mid_open_end:mid_close_end - len("</g>")]

    # reste = premier plan net (lignes fines hors couches far/mid)
    foreground = inner[mid_close_end:].strip()

    far_shards = parse_shards(far_inner, "far")
    mid_shards = parse_shards(mid_inner, "mid")
    all_shards = far_shards + mid_shards

    print(f"far shards: {len(far_shards)}, mid shards: {len(mid_shards)}, foreground chars: {len(foreground)}")

    def ts_escape(s):
        return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

    lines = [
        "// Shards individuels de f5-chaos (panneau CHAOS), extraits pour animation V2 --",
        "// chaque shard anime independamment (rotation propre + micro-flottement), au lieu",
        "// d'un seul bloc fige. Genere par scripts/parse-chaos-shards.py.",
        "",
        "export type ChaosShard = { tx: number; ty: number; rot: number; content: string; depth: \"far\" | \"mid\" };",
        "",
        f"export const CHAOS_BG_ELLIPSE = `{ts_escape(bg_ellipse)}`;",
        "",
        f"export const CHAOS_FOREGROUND = `{ts_escape(foreground)}`;",
        "",
        "export const CHAOS_SHARDS: ChaosShard[] = [",
    ]
    for s in all_shards:
        lines.append(
            f'  {{ tx: {s["tx"]}, ty: {s["ty"]}, rot: {s["rot"]}, depth: "{s["depth"]}", '
            f'content: `{ts_escape(s["content"])}` }},'
        )
    lines.append("];")

    OUT.write_text("\n".join(lines))
    print(f"OK -> {OUT} ({len(all_shards)} shards)")


if __name__ == "__main__":
    main()
