"""
assemble_mix.py — fusionne les 3 planches SVG en prenant le meilleur groupe de chacune.

Les 3 modeles ont livre le MEME viewBox et les MEMES noms de <g id>, parce que le brief
les dictait. Le mix est donc mecanique : on extrait chaque groupe de sa source et on
reassemble dans l'ordre de peinture voulu.

Seule precaution : les <defs> des 3 fichiers ont des ids de gradients/filtres qui peuvent
entrer en collision (ex: "metalGrad" chez deux modeles). On prefixe donc tous les ids de
defs par la source, et on reecrit les references url(#...) dans les groupes correspondants.
"""
import re
from pathlib import Path

HERE = Path(__file__).parent
SOURCES = {n: (HERE / f"out-{n}.svg").read_text(encoding="utf-8") for n in ("kimi", "gpt", "fable")}

# Qui fournit quoi (cf. recommandation du comparatif).
PLAN = [
    ("chassis", "gpt"),
    ("plaque_titre", "gpt"),
    ("ecran", "gpt"),
    ("panneau_power", "gpt"),
    ("titre_texte", "fable"),
    ("sous_titre", "fable"),
    ("graduation", "kimi"),
    ("gauge_track", "kimi"),
    ("legende", "kimi"),
    ("bouton_power", "kimi"),
    ("boutons_bas", "kimi"),
    ("frost_layer", "fable"),
    ("icicles", "gpt"),
]

# Les 26 segments et les glacons sont des groupes FRERES (pas des enfants de gauge_track).
# On les prend chez la meme source que gauge_track / icicles pour garder la coherence geometrique.
SEGMENTS_FROM = "kimi"
ICICLES_FROM = "gpt"

# Ordre de peinture (du fond vers l'avant).
PAINT_ORDER = [
    "chassis",
    "ecran",
    "graduation",
    "gauge_track",
    "__segments__",
    "legende",
    "sous_titre",
    "panneau_power",
    "bouton_power",
    "boutons_bas",
    "plaque_titre",
    "titre_texte",
    "frost_layer",
    "icicles",
]


def extract_group(svg: str, gid: str) -> str:
    """Extrait <g id="gid"> ... </g> en comptant les balises imbriquees."""
    start = svg.find(f'<g id="{gid}"')
    if start < 0:
        raise KeyError(gid)
    i = start
    depth = 0
    while i < len(svg):
        if svg.startswith("<g", i) and not svg.startswith("</g", i):
            # ignorer les auto-fermantes
            end_tag = svg.find(">", i)
            if end_tag > 0 and svg[end_tag - 1] != "/":
                depth += 1
            i = end_tag + 1
            continue
        if svg.startswith("</g>", i):
            depth -= 1
            if depth == 0:
                return svg[start : i + 4]
            i += 4
            continue
        i += 1
    raise ValueError(f"groupe non ferme: {gid}")


def extract_defs(svg: str) -> str:
    m = re.search(r"<defs>([\s\S]*?)</defs>", svg)
    return m.group(1) if m else ""


def prefix_ids(defs: str, groups: dict, tag: str):
    """Prefixe tous les id= des defs par tag_, et reecrit les url(#..) partout."""
    ids = re.findall(r'id="([^"]+)"', defs)
    for i in sorted(set(ids), key=len, reverse=True):
        defs = defs.replace(f'id="{i}"', f'id="{tag}_{i}"')
        defs = defs.replace(f"url(#{i})", f"url(#{tag}_{i})")
        defs = defs.replace(f'href="#{i}"', f'href="#{tag}_{i}"')
        for k in groups:
            groups[k] = groups[k].replace(f"url(#{i})", f"url(#{tag}_{i})")
            groups[k] = groups[k].replace(f'href="#{i}"', f'href="#{tag}_{i}"')
            groups[k] = groups[k].replace(f'xlink:href="#{i}"', f'xlink:href="#{tag}_{i}"')
    return defs, groups


def main():
    # 1) recuperer les groupes voulus, par source
    by_source: dict[str, dict[str, str]] = {n: {} for n in SOURCES}
    for gid, src in PLAN:
        by_source[src][gid] = extract_group(SOURCES[src], gid)

    # les 26 segments individuels
    seg_ids = [f"seg_{i:02d}" for i in range(26)]
    for sid in seg_ids:
        by_source[SEGMENTS_FROM][sid] = extract_group(SOURCES[SEGMENTS_FROM], sid)

    # les glacons individuels (nombre variable selon la source)
    import re as _re
    ice_ids = sorted(set(_re.findall(r'<g id="(icicle_\d+)"', SOURCES[ICICLES_FROM])))
    for iid in ice_ids:
        by_source[ICICLES_FROM][iid] = extract_group(SOURCES[ICICLES_FROM], iid)

    # 2) prefixer les defs de chaque source + reecrire les refs de SES groupes
    all_defs = []
    for src, svg in SOURCES.items():
        if not by_source[src]:
            continue
        d = extract_defs(svg)
        d, by_source[src] = prefix_ids(d, by_source[src], src)
        all_defs.append(f"<!-- defs issus de {src} -->\n{d}")

    # 3) reassembler dans l'ordre de peinture
    flat = {}
    for src, groups in by_source.items():
        for gid, content in groups.items():
            flat[gid] = (src, content)

    body = []
    for gid in PAINT_ORDER:
        if gid == "__segments__":
            segs = "\n  ".join(flat[s2][1] for s2 in seg_ids)
            body.append(f"  <!-- seg_00..seg_25 <- {SEGMENTS_FROM} -->\n  {segs}")
            continue
        src, content = flat[gid]
        if gid == "icicles":
            # le groupe icicles de la source contient deja ses enfants : on le prend tel quel
            pass
        body.append(f"  <!-- {gid} <- {src} -->\n  {content}")

    header = "<!--\n  Max Chill Factor Meter — MIX assemble depuis 3 planches.\n"
    for gid in PAINT_ORDER:
        if gid == "__segments__":
            header += f"    seg_00..seg_25 <- {SEGMENTS_FROM}\n"
            continue
        header += f"    {gid:<14} <- {flat[gid][0]}\n"
    header += """
  Anime depuis React (aucune animation embarquee ici) :
    seg_00..seg_25 : opacite, allumes 1 par 1 selon le niveau 0-100
    frost_layer    : opacity 0 -> 1 quand le givre pousse
    icicles        : chaque icicle_NN a son origine a son point d'attache -> scale(1,k)
    bouton_power   : opacite pulsee
-->"""

    out = (
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
        'viewBox="0 0 1448 1086" width="1448" height="1086">\n'
        f"{header}\n<defs>\n" + "\n".join(all_defs) + "\n</defs>\n" + "\n".join(body) + "\n</svg>\n"
    )
    dest = HERE / "chill-meter-MIX.svg"
    dest.write_text(out, encoding="utf-8")
    print(f"ecrit {dest.name} ({len(out)} chars)")
    for gid in PAINT_ORDER:
        if gid == "__segments__":
            print(f"  seg_00..seg_25 <- {SEGMENTS_FROM}")
            continue
        print(f"  {gid:<14} <- {flat[gid][0]}")


if __name__ == "__main__":
    main()
