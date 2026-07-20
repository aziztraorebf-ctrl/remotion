#!/usr/bin/env python3
"""
atlas-selfreview.py — Self-review SCRIPTÉE d'un beat Atlas (phase 3 du pipeline).

Miroir de scripts/tools/mapbox-selfreview.py, même patron : check EXTERNE
(pas auto-évaluation), grep mécanique des règles qui ont déjà coûté des
itérations. Un Claude qui a écrit un clipPath en dur ne se reproche pas
d'avoir dupliqué le pattern -> il faut un grep externe qui le voie.

Règles vérifiées (RÈGLE N = memory/rules/rules-atlas-production.md SECTION 1) :
  E-CLIP   RÈGLE 1/3 — clipPath continental redéfini EN DUR dans le beat au lieu
                        d'être un paramètre AtlasMercator. Bug réel Peste-1347 :
                        fix fait sur Beat5/6 puis OUBLIÉ sur Beat1/2/3 (découvert
                        tardivement en audit géo). Détecté sur TOUS les 6 beats
                        de l'épisode (europeClipB1..B6) — la duplication existe
                        même quand chaque beat "sait" pourquoi le clip est là.
  E-DUP    RÈGLE 1 — Fork avant reconstruire : redéfinition LOCALE d'un nom déjà
                      exporté par atlas-components.tsx (ex: Beat2Setup.tsx définit
                      `const makeMapCoord = (...)` en local alors que mapConfig.ts/
                      atlas-components.tsx l'exporte déjà).
  W-CAM    RÈGLE 3 — Caméra recalculée à la main (motifs `- 360`/`* 0.65` etc.)
                      hors d'un appel AtlasMercator/useSpringCamera/cameraTo.
                      Signal, pas certitude — vérif humaine requise.
  E-SVG    RÈGLE 2 — SVG racine unique 720×1280. Compte les <svg de premier niveau
                      (hors commentaires) : doit être exactement 1.
  W-SPRITE Checklist pre-coding — référence à un dossier archive/ pour des frames
                      PixelLab (6 designs alternatifs, PAS un walk cycle — piège
                      documenté SECTION 7) au lieu du chemin canonique
                      characters/<perso>/animations/<anim-id>/<dir>/.

Doctrine : memory/rules/rules-atlas-production.md (13 RÈGLES + checklist pre-coding)

Usage : python3 scripts/tools/atlas-selfreview.py <Beat*.tsx> [Beat2.tsx ...]
Exit code 0 si 0 ERROR, 1 sinon. WARN n'échoue pas mais s'affiche.
"""
import re
import sys
from pathlib import Path

RED = "\033[91m"; YEL = "\033[93m"; GRN = "\033[92m"; DIM = "\033[2m"; RST = "\033[0m"

# Composants partagés qu'un beat ne doit JAMAIS redéfinir localement — chemin
# vers _shared/atlas-components.tsx (relatif depuis n'importe quel Beat*.tsx
# d'un projet Atlas: <projet>/Beat*.tsx -> ../_shared/atlas-components.tsx).
SHARED_COMPONENTS_REL = "../_shared/atlas-components.tsx"

# Pays d'Europe/côtiers fréquemment concernés par le clip continental (pattern
# observé sur Peste-1347 : ITA/FRA/GBR/ESP/PRT ont des territoires d'outre-mer
# lointains qui débordent en pleine mer sans clip). Sert à détecter qu'un fichier
# est "à risque clip" même s'il n'a pas encore de highlightFills sur ces ISO.
EUROPE_RISK_ISO = {"FRA", "GBR", "ESP", "PRT", "NLD", "NOR", "DNK", "ITA", "GRC"}


def _strip_comment(ln: str) -> str:
    """Retire un commentaire de fin de ligne `// ...` (hors http:// dans une string).
    Ligne entièrement commentée (// ... ou * ...) -> chaîne vide."""
    s = ln.strip()
    if s.startswith("//") or s.startswith("*") or s.startswith("/*"):
        return ""
    m = re.search(r"(?<!:)//", ln)
    if m:
        return ln[: m.start()]
    return ln


def parse_shared_exports(shared_path: Path) -> list[str]:
    """Parse les noms exportés par atlas-components.tsx : `export const X` /
    `export function X` / `export interface X`. On exclut les types/interfaces
    purs (pas de risque de redéfinition de valeur), on garde const+function."""
    if not shared_path.exists():
        return []
    src = shared_path.read_text(encoding="utf-8")
    names = re.findall(r"export\s+(?:const|function)\s+([A-Za-z_][A-Za-z0-9_]*)", src)
    return sorted(set(names))


def find_shared_components_file(beat_path: Path) -> Path:
    """Résout _shared/atlas-components.tsx à partir du chemin du beat scanné.
    Convention projet: src/projects/atlas/<projet>/Beat*.tsx
                     -> src/projects/atlas/_shared/atlas-components.tsx"""
    candidate = (beat_path.parent / SHARED_COMPONENTS_REL).resolve()
    if candidate.exists():
        return candidate
    # Fallback : chercher en remontant jusqu'à src/projects/atlas/_shared/
    for parent in beat_path.resolve().parents:
        c = parent / "atlas" / "_shared" / "atlas-components.tsx"
        if c.exists():
            return c
    return candidate  # peut ne pas exister — check_file gère l'absence


def find_project_mapconfig_file(beat_path: Path) -> Path | None:
    """Résout mapConfig.ts dans le MÊME dossier que le beat scanné (source de
    vérité géo/caméra propre au projet, ex: peste-1347/mapConfig.ts exporte
    makeMapCoord/cameraTo/STATIONS/PALETTE — un beat du même projet ne doit
    jamais redéfinir ces noms localement, cf. bug réel Beat2Setup.tsx qui
    redéfinit makeMapCoord en dur alors que Beat4Climax.tsx l'importe)."""
    candidate = beat_path.parent / "mapConfig.ts"
    return candidate if candidate.exists() else None


def check_file(path: Path):
    src = path.read_text(encoding="utf-8")
    lines = src.split("\n")
    code_lines = [_strip_comment(ln) for ln in lines]
    errors = []
    warns = []

    def find_lines(pattern, hay=code_lines):
        return [i + 1 for i, ln in enumerate(hay) if re.search(pattern, ln)]

    # ── E-SVG : SVG racine unique (RÈGLE 2) ─────────────────────────────────
    # On compte les balises <svg ouvrantes de premier niveau (pas <svg/> auto-
    # fermantes isolées comptent aussi comme une racine si utilisées telles quelles).
    svg_open = find_lines(r"<svg\b")
    if len(svg_open) == 0:
        warns.append((
            "W-SVG0", "Aucune balise <svg> trouvée — fichier non-scène ou hors convention "
            "Atlas (SVG racine 720×1280 attendu par RÈGLE 2)."
        ))
    elif len(svg_open) > 1:
        errors.append((
            "E-SVG", f"{len(svg_open)} balises <svg> de premier niveau détectées (lignes {svg_open}). "
            "RÈGLE 2 : une scène = UN SEUL <svg viewBox=\"0 0 720 1280\">. "
            "→ fusionner en un seul SVG racine, tout le reste en <g>."
        ))

    # ── E-CLIP : clipPath continental redéfini en dur (RÈGLE 1/3) ──────────
    # Détecte un <clipPath id="..."> déclaré EN DUR dans le beat (au lieu d'être
    # un paramètre AtlasMercator/prop réutilisable). On ne bloque QUE si le
    # fichier touche aussi highlightFills ou un pays à risque (le clip n'a de
    # sens que dans ce contexte — un clipPath isolé sans lien pays peut être
    # légitime pour autre chose, ex: clip de vague nord/sud).
    clip_decls = [i + 1 for i, ln in enumerate(code_lines)
                  if re.search(r'<clipPath\s+id=["\']', ln)]
    # "à risque" = le fichier référence highlightFills OU un ISO européen/côtier
    # connu pour avoir des territoires d'outre-mer qui débordent sans clip.
    touches_highlight_fills = bool(re.search(r"\bhighlightFills\b", src))
    touches_europe_iso = any(re.search(rf'["\']{iso}["\']', src) for iso in EUROPE_RISK_ISO)
    at_risk = touches_highlight_fills or touches_europe_iso
    if clip_decls and at_risk:
        errors.append((
            "E-CLIP", f"<clipPath id=\"...\"> redéfini EN DUR dans le beat (lignes {clip_decls}), "
            "alors que le fichier touche highlightFills/pays à territoires d'outre-mer. "
            "Bug documenté Peste-1347 : ce fix a été fait beat par beat puis OUBLIÉ sur "
            "d'autres beats du même épisode (audit géo tardif). "
            "→ le clip continental doit être un PARAMÈTRE de AtlasMercator (ex: "
            "continentalClipRect/clipIso), pas une déclaration locale par beat. "
            "Si AtlasMercator ne le supporte pas encore, l'ajouter avant de dupliquer plus loin."
        ))
    elif clip_decls:
        warns.append((
            "W-CLIP", f"<clipPath id=\"...\"> déclaré localement (lignes {clip_decls}) sans signal "
            "highlightFills/pays-à-risque détecté — probablement légitime (vague, zone non-pays) "
            "mais à vérifier si c'est en fait un clip continental oublié par le check principal."
        ))

    # ── E-DUP : redéfinition locale d'un composant partagé (RÈGLE 1) ───────
    # Deux sources à ne jamais redéfinir localement :
    #  (1) _shared/atlas-components.tsx — composants partagés cross-projets
    #  (2) mapConfig.ts du MÊME dossier — helpers géo/caméra propres au projet
    #      (ex: makeMapCoord, cameraTo, STATIONS — bug réel Beat2Setup.tsx qui
    #      redéfinit makeMapCoord en dur alors que mapConfig.ts l'exporte déjà)
    shared_file = find_shared_components_file(path)
    shared_names = parse_shared_exports(shared_file)
    mapconfig_file = find_project_mapconfig_file(path)
    if mapconfig_file is not None and mapconfig_file.resolve() != path.resolve():
        shared_names = sorted(set(shared_names) | set(parse_shared_exports(mapconfig_file)))
    dup_hits = []
    for name in shared_names:
        # redéfinition locale : `const NAME =` ou `function NAME` NON précédée
        # d'un import (une ligne d'import contenant ce nom ne compte pas).
        local_def = re.compile(rf"^\s*(?:export\s+)?(?:const|function)\s+{re.escape(name)}\b")
        for i, ln in enumerate(code_lines):
            if local_def.search(ln):
                # vérifier qu'il n'y a pas déjà un import de ce nom (sinon c'est
                # un shadowing détecté à tort — rare mais on protège le faux positif)
                already_imported = bool(re.search(rf"import[^;]*\b{re.escape(name)}\b[^;]*;", src))
                if not already_imported:
                    dup_hits.append((name, i + 1))
    if dup_hits:
        detail = ", ".join(f"{n} (l.{ln})" for n, ln in dup_hits)
        errors.append((
            "E-DUP", f"Redéfinition LOCALE de composant(s)/helper(s) déjà exporté(s) par "
            f"_shared/atlas-components.tsx : {detail}. RÈGLE 1 — Fork avant reconstruire : "
            "INTERDIT d'écrire un équivalent si atlas-components.tsx l'exporte déjà. "
            "→ importer depuis _shared/atlas-components.tsx (ou mapConfig.ts si c'est un "
            "helper géo-spécifique au projet) au lieu de dupliquer la logique."
        ))

    # ── W-CAM : caméra recalculée à la main (RÈGLE 3) ───────────────────────
    # Motifs suspects : `- 360`, `* 0.65`, ou toute formule proche de la formule
    # canonique camOffX = (targetX-360)*0.65, écrite EN DEHORS d'un appel à
    # AtlasMercator/useSpringCamera/cameraTo (qui sont les emplacements légitimes
    # où cette formule EST censée vivre, dans _shared/ ou mapConfig.ts).
    cam_pattern = re.compile(r"(-\s*360\b|\*\s*0\.65\b|targetX\s*-\s*\d+)")
    cam_hits = []
    for i, ln in enumerate(code_lines):
        if not cam_pattern.search(ln):
            continue
        # ignorer si la ligne appelle explicitement les helpers officiels
        if re.search(r"\b(AtlasMercator|useSpringCamera|cameraTo|camToPoint)\b", ln):
            continue
        cam_hits.append(i + 1)
    # Ne signaler que si ce fichier N'EST PAS mapConfig.ts/atlas-components.tsx
    # eux-mêmes (là-bas la formule canonique DOIT vivre).
    if cam_hits and path.name not in ("mapConfig.ts", "atlas-components.tsx"):
        warns.append((
            "W-CAM", f"Motif de calcul caméra à la main détecté (lignes {cam_hits}) — "
            "RÈGLE 3 : caméra via props AtlasMercator UNIQUEMENT (scale/driftX/driftY/"
            "centerOffsetX/Y/rotation), formule canonique camOffX=(targetX-360)*0.65. "
            "Signal heuristique (faux positifs possibles sur un helper local légitime type "
            "camToPoint) → vérifier humainement que ce n'est pas un recalcul manuel dupliqué."
        ))

    # ── W-SPRITE : référence archive/ au lieu du chemin canonique PixelLab ──
    # SECTION 7 : archive/<perso>-east/frame_XXX.png = 6 designs alternatifs,
    # PAS un walk cycle. Vrais walk cycles = characters/<perso>/animations/
    # <animation-id>/<direction>/frame_XXX.png.
    archive_hits = [i + 1 for i, ln in enumerate(code_lines)
                    if re.search(r'staticFile\([`"\'][^`"\']*archive/', ln)
                    or re.search(r'[`"\'][^`"\']*archive/[^`"\']*frame_', ln)]
    if archive_hits:
        errors.append((
            "E-SPRITE", f"Référence à un dossier archive/ pour des frames PixelLab (lignes {archive_hits}). "
            "SECTION 7 : archive/<perso>-<dir>/frame_XXX.png = 6 designs ALTERNATIFS, PAS un "
            "walk cycle. Boucler dessus = effet 'palpitation' désastreux. "
            "→ chemin canonique characters/<perso>/animations/<animation-id>/<direction>/frame_XXX.png."
        ))

    return errors, warns


def main():
    if len(sys.argv) < 2:
        print("Usage: atlas-selfreview.py <Beat*.tsx> [...]")
        sys.exit(2)

    total_errors = 0
    total_warns = 0
    for arg in sys.argv[1:]:
        path = Path(arg)
        if not path.exists():
            print(f"{RED}FICHIER INTROUVABLE{RST}: {arg}")
            total_errors += 1
            continue
        errors, warns = check_file(path)
        head = f"\n{DIM}── {path.name} ──{RST}"
        print(head)
        if not errors and not warns:
            print(f"{GRN}  ✓ PASS — 0 erreur, 0 warning{RST}")
        for code, msg in errors:
            print(f"{RED}  ✗ ERROR [{code}]{RST} {msg}")
        for code, msg in warns:
            print(f"{YEL}  ⚠ WARN  [{code}]{RST} {msg}")
        total_errors += len(errors)
        total_warns += len(warns)

    print()
    print(f"{DIM}RÉSUMÉ : {total_errors} erreur(s) / {total_warns} avertissement(s).{RST}")
    if total_errors:
        print(f"{RED}SELF-REVIEW ÉCHOUÉE : {total_errors} erreur(s) bloquante(s). Corriger AVANT présentation à Aziz.{RST}")
        sys.exit(1)
    print(f"{GRN}SELF-REVIEW OK : 0 erreur bloquante. (Vérifier les WARN au cas par cas.){RST}")
    sys.exit(0)


if __name__ == "__main__":
    main()
