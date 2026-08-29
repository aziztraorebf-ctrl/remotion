#!/usr/bin/env python3
"""Regenere `../silhouette.ts` depuis `main-greffee.svg` (source de verite).

⛔ Existe pour empecher la divergence : sans lui, quelqu'un (moi) retape le
chemin dans le TSX et les deux versions se separent en silence.
"""
import re, pathlib
ICI = pathlib.Path(__file__).resolve().parent
svg = (ICI / "main-greffee.svg").read_text(encoding="utf-8")
d = re.search(r'id="repos-silhouette" d="([^"]+)"', svg).group(1)
cible = ICI.parent / "silhouette.ts"
txt = cible.read_text(encoding="utf-8")
neuf = re.sub(r'export const MAIN_SILHOUETTE =\n  "[^"]*";',
              f'export const MAIN_SILHOUETTE =\n  "{d}";', txt)
cible.write_text(neuf, encoding="utf-8")
print(f"silhouette.ts <- main-greffee.svg ({len(d)} car.)")
