#!/usr/bin/env python3
"""
dataviz-selfreview.py — Self-review SCRIPTEE d'une scene DATA-VIZ Remotion (le VRAI gate).

Pourquoi ce script (2026-06-20) : 2 dettes du workflow data-viz, toutes deux causees par
un MODELE qui ment juste assez (score Gemini bruite ; mesure de taille GPT biaisee). La doctrine
dit "le modele est SIGNAL, jamais juge". Le vrai gate doit donc etre DETERMINISTE, pas un score LLM.
Ce script est a la data-viz ce que mapbox-selfreview.py est au Mapbox : des assertions mecaniques
sur les regles qui ont coute des iterations. A lancer AVANT toute review Gemini et AVANT de presenter.

Regles verifiees (chacune = lecon documentee 2026-06-20, voir WORKFLOW-DATAVIZ.md) :
  E1  PICTO secondaire sous le seuil PLANCHER (w-[..%] < 13%) = sous-dimensionne (faiblesse recurrente n1)
  E2  LABEL secondaire sous le seuil PLANCHER (fontSize < 40 @1080) = sous-dimensionne
  E3  Police nommee (Bebas Neue/Anton/Oswald/Archivo Black) utilisee SANS @remotion/google-fonts charge
      -> fallback systeme = faux rendu (Impact a la place de Bebas Neue, etc.)
  E4  Asset <Img> reference un fichier qui n'existe pas sur disque (chemin staticFile casse)
  W1  CSS transition: / @keyframes / setTimeout / requestAnimationFrame (interdits Remotion)
  W2  Asset PNG avec bbox opaque = 100% du canvas ET place a une petite taille -> verifier la PRESENCE
      en plein format (le picto remplit sa toile, donc w-[x%] = taille reelle du glyphe, pas de marge)

Le seuil PLANCHER (picto >= 13% largeur, label >= 40px @1080) vient du template de breakdown
(PROMPT-BREAKDOWN-DATAVIZ.txt, regle "PICTO + LABEL SECONDAIRE"). Les deux DOIVENT rester alignes.

Usage : python3 scripts/tools/dataviz-selfreview.py <Scene.tsx> [--public-root public] [--strict]
  --strict : les W deviennent bloquantes (exit 1). Par defaut seules les E bloquent.
Exit code 0 si 0 ERROR, 1 sinon. WARN s'affiche sans bloquer (sauf --strict).
"""
import argparse
import re
import sys
from pathlib import Path

RED = "\033[91m"; YEL = "\033[93m"; GRN = "\033[92m"; DIM = "\033[2m"; RST = "\033[0m"

# Seuils PLANCHER — DOIVENT rester alignes avec PROMPT-BREAKDOWN-DATAVIZ.txt
PICTO_MIN_WIDTH_PCT = 13.0      # un picto/label secondaire sous 13% de largeur = riquiqui
LABEL_MIN_FONT_PX = 40          # un label secondaire sous 40px @1080 = riquiqui

# Polices condensees qui exigent un chargement explicite (sinon fallback systeme silencieux)
NAMED_FONTS = {
    "Bebas Neue": "BebasNeue",
    "Anton": "Anton",
    "Oswald": "Oswald",
    "Archivo Black": "ArchivoBlack",
    "Teko": "Teko",
}
# Polices systeme tolerees (pas de chargement requis)
SYSTEM_FONTS = {"Impact", "Arial", "Helvetica", "sans-serif", "monospace", "serif"}

# Indices qu'un Img/label est SECONDAIRE (picto illustratif + son label) plutot que le chiffre hero.
# On ne veut PAS flagger le chiffre hero (legitimement grand) ni la barre.
SECONDARY_HINT = re.compile(
    r"(picto|icon|globe|terre|reserve|embleme|label|legend|mention)", re.I
)
HERO_HINT = re.compile(r"(num70|hero|chiffre|count|titre|title|barre|bar|segment)", re.I)


def _pct_in_w_class(cls: str):
    """Extrait la valeur de w-[NN%] d'une chaine de classes Tailwind, sinon None."""
    m = re.search(r"w-\[\s*([\d.]+)%\s*\]", cls)
    return float(m.group(1)) if m else None


def _block_for_line(lines, idx, span=6):
    """Renvoie le bloc de quelques lignes autour de idx (pour chercher src/classes voisines)."""
    lo = max(0, idx - span)
    hi = min(len(lines), idx + span + 1)
    return "\n".join(lines[lo:hi])


def check_file(path: Path, public_root: Path):
    src = path.read_text(encoding="utf-8")
    lines = src.split("\n")
    errors = []
    warns = []

    # ── E3 : polices nommees chargees ───────────────────────────────────────────
    # Une police nommee dans un fontFamily mais jamais chargee via @remotion/google-fonts
    # tombe en fallback systeme silencieux -> faux rendu. On verifie chaque police nommee
    # presente dans une string fontFamily contre la presence d'un import google-fonts.
    used_named = set()
    for fam, pkg in NAMED_FONTS.items():
        # cherche la police citee dans un contexte fontFamily (pas un commentaire libre)
        if re.search(rf'fontFamily\s*[:=]\s*[`"\'][^`"\']*{re.escape(fam)}', src):
            used_named.add((fam, pkg))
    for fam, pkg in used_named:
        loaded = (
            re.search(rf'@remotion/google-fonts/{pkg}\b', src) is not None
            or re.search(rf'loadFont[^\n]*{re.escape(fam)}', src) is not None
        )
        if not loaded:
            errors.append((
                "E3", f"Police '{fam}' utilisee en fontFamily mais JAMAIS chargee via "
                f"@remotion/google-fonts/{pkg}. -> fallback systeme silencieux (faux rendu). "
                f"Ajouter: import {{loadFont}} from '@remotion/google-fonts/{pkg}'; const {{fontFamily}} = loadFont();"
            ))

    # ── E1 : picto SECONDAIRE sous le seuil plancher de largeur ─────────────────
    # On scanne les <Img ...> ; si le bloc autour evoque un element secondaire (picto/label)
    # et PAS le hero, on lit son w-[NN%]. Sous PICTO_MIN_WIDTH_PCT -> ERROR.
    for i, ln in enumerate(lines):
        if "<Img" not in ln and "Img " not in ln:
            continue
        block = _block_for_line(lines, i, span=4)
        if not SECONDARY_HINT.search(block) or HERO_HINT.search(block):
            continue
        # chercher la classe w-[..%] dans le bloc (souvent sur la meme ligne ou className voisin)
        w = _pct_in_w_class(block)
        if w is not None and w < PICTO_MIN_WIDTH_PCT:
            errors.append((
                "E1", f"Picto SECONDAIRE (l. {i+1}) dimensionne w-[{w}%], SOUS le plancher "
                f"{PICTO_MIN_WIDTH_PCT}% -> riquiqui (faiblesse recurrente n1). "
                f"-> agrandir a w-[{max(PICTO_MIN_WIDTH_PCT, round(w*1.4,1))}%] minimum et JUGER en plein format."
            ))

    # ── E2 : label SECONDAIRE sous le seuil plancher de fontSize ────────────────
    # fontSize: NN (px @1080) sur un bloc qui evoque un label secondaire.
    for i, ln in enumerate(lines):
        m = re.search(r"fontSize\s*:\s*(\d+)\b", ln)
        if not m:
            continue
        px = int(m.group(1))
        block = _block_for_line(lines, i, span=4)
        if not SECONDARY_HINT.search(block) or HERO_HINT.search(block):
            continue
        if px < LABEL_MIN_FONT_PX:
            errors.append((
                "E2", f"Label SECONDAIRE (l. {i+1}) fontSize {px}px, SOUS le plancher "
                f"{LABEL_MIN_FONT_PX}px @1080 -> riquiqui. -> remonter a >= {LABEL_MIN_FONT_PX}px et JUGER en plein format."
            ))

    # ── E4 : assets staticFile existent sur disque ──────────────────────────────
    for i, ln in enumerate(lines):
        for m in re.finditer(r'staticFile\(\s*[`"\']([^`"\']+)[`"\']\s*\)', ln):
            rel = m.group(1).lstrip("/")
            if not (public_root / rel).exists():
                errors.append((
                    "E4", f"Asset introuvable (l. {i+1}) : staticFile('{rel}') -> "
                    f"{public_root / rel} n'existe pas. Render = image cassee."
                ))

    # ── W1 : patterns interdits Remotion ────────────────────────────────────────
    for pat, name in [
        (r"transition\s*:", "CSS transition:"),
        (r"@keyframes", "@keyframes"),
        (r"\bsetTimeout\s*\(", "setTimeout"),
        (r"\brequestAnimationFrame\s*\(", "requestAnimationFrame"),
    ]:
        hits = [i + 1 for i, ln in enumerate(lines)
                if re.search(pat, ln) and not ln.strip().startswith("//")]
        if hits:
            warns.append((
                "W1", f"{name} present (l. {hits}) — interdit en Remotion (ne s'anime pas en render). "
                "-> utiliser interpolate/spring pilotes par useCurrentFrame."
            ))

    # ── W2 : asset PNG opaque plein canvas + place petit -> verifier presence ────
    # Un asset dont le contenu remplit 100% de sa toile, place a petite taille, n'a aucune
    # marge : son glyphe fait exactement la taille de la classe -> tres vite riquiqui.
    try:
        from PIL import Image  # import paresseux (PIL pas toujours requis)
        for i, ln in enumerate(lines):
            for m in re.finditer(r'staticFile\(\s*[`"\']([^`"\']+\.png)[`"\']\s*\)', ln):
                rel = m.group(1).lstrip("/")
                fp = public_root / rel
                if not fp.exists():
                    continue
                im = Image.open(fp)
                if im.mode != "RGBA":
                    continue
                bb = im.getbbox()
                if not bb:
                    continue
                fill_w = (bb[2] - bb[0]) / im.size[0]
                block = _block_for_line(lines, i, span=4)
                w = _pct_in_w_class(block)
                if fill_w > 0.98 and w is not None and SECONDARY_HINT.search(block):
                    warns.append((
                        "W2", f"Asset '{rel}' (l. {i+1}) remplit {round(fill_w*100)}% de sa toile ET "
                        f"place a w-[{w}%] : pas de marge, le glyphe = la classe. "
                        "VERIFIER en PLEIN FORMAT que la presence est suffisante (cf. faiblesse n1)."
                    ))
    except ImportError:
        warns.append(("W2", "PIL non dispo — saut du check de presence des assets (bbox). pip install Pillow."))

    return errors, warns


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+")
    ap.add_argument("--public-root", default="public")
    ap.add_argument("--strict", action="store_true", help="les WARN deviennent bloquantes")
    args = ap.parse_args()

    public_root = Path(args.public_root)
    total_errors = 0
    total_warns = 0
    for arg in args.files:
        path = Path(arg)
        print(f"\n{DIM}── {path.name} ──{RST}")
        if not path.exists():
            print(f"{RED}  FICHIER INTROUVABLE{RST}: {arg}")
            total_errors += 1
            continue
        errors, warns = check_file(path, public_root)
        if not errors and not warns:
            print(f"{GRN}  ✓ PASS — 0 erreur, 0 warning{RST}")
        for code, msg in errors:
            print(f"{RED}  ✗ ERROR [{code}]{RST} {msg}")
        for code, msg in warns:
            print(f"{YEL}  ⚠ WARN  [{code}]{RST} {msg}")
        total_errors += len(errors)
        total_warns += len(warns)

    print()
    blocking = total_errors + (total_warns if args.strict else 0)
    if blocking:
        print(f"{RED}SELF-REVIEW DATA-VIZ ECHOUEE : {total_errors} erreur(s)"
              f"{f' + {total_warns} warn (strict)' if args.strict else ''}. Corriger AVANT review/presentation.{RST}")
        sys.exit(1)
    print(f"{GRN}SELF-REVIEW DATA-VIZ OK : 0 erreur bloquante."
          f"{f' ({total_warns} warn a verifier)' if total_warns else ''}{RST}")
    sys.exit(0)


if __name__ == "__main__":
    main()
