#!/usr/bin/env python3
"""
warmap-session.py — Point d'entrée COURT et CIBLÉ pour la production War-Map (Mapbox).

⚠️ Ce n'est PAS un pipeline complet façon beat-session.py/mapbox-session.py (scan→storyboard→
breakdown→DA-brief→code→self-review→review→upload). C'est un aide-mémoire + un garde-fou,
répondant aux 2 manques concrets identifiés (audit 2026-07-11) :

  (a) un agent vierge met ~24 lectures de fichiers avant d'être prêt à coder une scène War-Map,
      faute d'un point d'entrée qui pointe direct vers les 4 doctrines essentielles.
  (b) un ZOOM MAPBOX FAUX d'un facteur ×10 (Soudan Acte 3, zoom déclaré "close-up" mais montrant
      ~3000km d'écran réel au lieu de ~460km) a coûté 3 itérations de render (v7→v9) avant d'être
      détecté par confrontation à une vidéo de référence externe — aucun outil ne vérifiait la
      cohérence zoom<->distance-réelle-affichée AVANT ce script.

3 phases seulement :
  --phase scan         imprime les pointeurs doctrine à lire AVANT de coder une scène War-Map.
  --phase zoom-check    calcule la distance réelle (km) visible à l'écran pour un zoom Mapbox donné,
                        et ALERTE si elle est incohérente avec l'intention déclarée (close-up/
                        territorial/regional). Formule Web Mercator standard (EPSG:3857), la même
                        que celle vérifiée dans SoudanActe3.tsx (commentaire "vérifié Mercator").
  --phase self-review   wrapper autour de scripts/tools/mapbox-selfreview.py (ne réinvente rien) +
                        check zoom automatique si un `zoom:`/`zoom=` est détectable dans le fichier.

Usage :
  python3 scripts/warmap-session.py --phase scan
  python3 scripts/warmap-session.py --phase zoom-check src/projects/warmap/soudan-acte4/SoudanActe4.tsx --zoom 6.6 --intent close-up
  python3 scripts/warmap-session.py --phase self-review src/projects/warmap/soudan-acte4/SoudanActe4.tsx
"""
import argparse
import math
import re
import subprocess
import sys
from pathlib import Path

RED = "\033[91m"; YEL = "\033[93m"; GRN = "\033[92m"; DIM = "\033[2m"; BOLD = "\033[1m"; RST = "\033[0m"

REPO_ROOT = Path(__file__).resolve().parent.parent
SELFREVIEW_SCRIPT = REPO_ROOT / "scripts" / "tools" / "mapbox-selfreview.py"

# Latitude par défaut représentative du Sahel/Soudan (utilisée dans toutes les scènes War-Map
# actives : Sahel AES ~15°N, Soudan ~13.5-15°N). Cf CAM1 SoudanActe3.tsx (lat 13.5).
DEFAULT_LAT = 15.0
DEFAULT_SCREEN_WIDTH_PX = 1920

# Seuils indicatifs (km de largeur d'écran visible) par intention narrative déclarée.
# Bornes larges par construction (l'objectif = attraper une incohérence FLAGRANTE d'un ordre
# de grandeur, pas juger un zoom "un peu large" — cf le bug reel = facteur x10, pas x1.3).
# Calibrées sur le cas réel corrigé Soudan Acte 3 (2026-07-11) : zoom 9.3 = "vrai close-up ville"
# validé Aziz produit ~460-465km d'écran (1 ville + 1 point proche, PAS 2 généraux à 707km
# d'écart) -> la borne haute de "close-up" doit couvrir cette valeur, pas seulement "quelques
# dizaines de km" (un close-up Mapbox réaliste sur un pays africain montre souvent 300-600km
# de large à l'écran, le pays entier n'étant visible qu'à zoom "territorial").
INTENT_RANGES = {
    "close-up":    (5, 500),        # ville/2 points proches — jusqu'à ~460km validé (Soudan zoom 9.3)
    "territorial": (500, 3000),     # un pays/une région — plusieurs centaines à ~2-3000km
    "regional":    (3000, 20000),   # plusieurs pays/sous-continent — 3000km+
}


# ─────────────────────────────────────────────────────────────────────────────
# PHASE 1 — scan : aide-mémoire doctrine (le vrai coût mesuré = ~24 lectures/agent)
# ─────────────────────────────────────────────────────────────────────────────

def phase_scan():
    print(f"\n{BOLD}═══ WAR-MAP — SCAN DOCTRINE (à lire dans cet ordre AVANT de coder une scène) ═══{RST}\n")

    entries = [
        (
            "1. WARMAP-GRAMMAIRE.md §2 — TEST D'ANCRAGE GÉO (décide Mapbox vs SVG-insert)",
            "memory/doctrines/WARMAP-GRAMMAIRE.md",
            "Test à se poser AVANT de coder une scène : \"Ce que je veux montrer a-t-il un ANCRAGE\n"
            "   GÉOGRAPHIQUE réel (un lieu, un mouvement, un territoire) ?\"\n"
            "     OUI -> sur la carte (grammaire causale §1 + techniques §3).\n"
            "     NON (concept, accord, donnée pure) -> overlay solide/plein écran (§6-9), PUIS retour carte.\n"
            "   Rappel règle d'or (§1) : CAUSE avant EFFET, jamais un résultat sans montrer sa cause.\n"
            "   Rappel §9 : overlay SEMI-TRANSPARENT BANNI (2 seules options : plein écran opaque OU sur la carte)."
        ),
        (
            "2. WARMAP-PLAYBOOK.md — INTRO MOTEUR MAPBOX ASSUMÉ (tranché 2026-07-11)",
            "memory/doctrines/WARMAP-PLAYBOOK.md",
            "Moteur de production = Mapbox light-v11 reskinné parchemin (la bascule d3-geo envisagée\n"
            "   en juin n'a jamais eu lieu en 6 semaines -> Mapbox tourne en prod sur Sahel/Soudan, voie définitive).\n"
            "   Format 9:16 principal (22-60s) / 16:9 pour le long. Différentiel = objets incarnés + côté\n"
            "   humain + explicatifs (vs mapsinanutshell = constatation muette)."
        ),
        (
            "3. WARMAP-COMPOSANTS-INDEX.md — CATALOGUE (\"quelle brique pour X ?\")",
            "src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md",
            "Catalogue \"quand Aziz dit X -> brique Y\" des 4 briques (carte data-driven, sprites\n"
            "   véhicules top-down, jetons-visage, overlay Remotion) + LINKING mapanimation (flèches\n"
            "   tactiques, encerclement, flux, manœuvres). NE PAS re-coder un effet qui existe déjà."
        ),
        (
            "4. CARTO-OVERLAYS-PRINCIPES.md — OVERLAYS GÉO-ANCRÉS (jetons/drapeaux/marqueurs)",
            "memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md",
            "RÈGLE ZÉRO anti-dérive : tout élément ancré à un lieu = map.project([lon,lat])\n"
            "   RECALCULÉ À CHAQUE FRAME, jamais left/top fixe en pixels.\n"
            "   Drapeaux : MapboxCountryFlagDecal (source-image) si pitch>0 ; useClipFlags SEULEMENT à pitch=0\n"
            "   (dérive au pitch sinon) ; JAMAIS drawFlagCanvas pour un drapeau visible."
        ),
    ]

    for title, path, summary in entries:
        exists = (REPO_ROOT / path).exists()
        mark = f"{GRN}✓{RST}" if exists else f"{RED}✗ INTROUVABLE{RST}"
        print(f"{BOLD}{title}{RST} [{mark}]")
        print(f"  {DIM}{path}{RST}")
        print(f"   {summary}\n")

    print(f"{BOLD}Rappel des 2 gates scriptés à lancer AVANT toute review Gemini/Kimi :{RST}")
    print(f"  python3 scripts/warmap-session.py --phase zoom-check <fichier.tsx> --zoom <N> --intent <close-up|territorial|regional>")
    print(f"  python3 scripts/warmap-session.py --phase self-review <fichier.tsx>")
    print()
    print(f"{DIM}Point d'entrée général : src/projects/warmap/WARMAP-INDEX.md (carte maître du pilier).{RST}\n")


# ─────────────────────────────────────────────────────────────────────────────
# PHASE 2 — zoom-check : le vrai ajout de valeur (formule Web Mercator)
# ─────────────────────────────────────────────────────────────────────────────

def screen_width_km(zoom: float, lat_deg: float, screen_px: int) -> float:
    """
    Largeur réelle (km) visible à l'écran pour un zoom Mapbox/Web-Mercator donné.

    Formule Web Mercator standard (EPSG:3857), identique à celle utilisée par Mapbox GL JS
    en interne pour la résolution des tuiles :
        metersPerPixel = 156543.03392 * cos(latitude_radians) / (2 ** zoom)
    (156543.03392 = circonférence terrestre équatoriale / 256px, la résolution au zoom 0).

    Vérifiée numériquement contre les 2 valeurs de zoom de SoudanActe3.tsx (2026-07-11) :
      zoom=6.6, lat=13.5°N, 1920px -> 3013 km  (≈ "3000km" mentionné dans le diagnostic du bug ×10)
      zoom=9.3, lat=13.5°N, 1920px ->  464 km  (≈ "460km" du commentaire "vérifié formule Mercator")
    Les deux correspondent exactement aux commentaires du code -> formule confirmée correcte,
    pas inventée.
    """
    lat_rad = math.radians(lat_deg)
    meters_per_pixel = 156543.03392 * math.cos(lat_rad) / (2 ** zoom)
    return meters_per_pixel * screen_px / 1000.0


def phase_zoom_check(args):
    zoom = args.zoom
    intent = args.intent
    lat = args.lat if args.lat is not None else DEFAULT_LAT
    width_px = args.width if args.width is not None else DEFAULT_SCREEN_WIDTH_PX

    km = screen_width_km(zoom, lat, width_px)
    lo, hi = INTENT_RANGES[intent]
    coherent = lo <= km <= hi

    print(f"\n{BOLD}═══ ZOOM-CHECK ═══{RST}")
    if args.file:
        print(f"  fichier   : {args.file}")
    print(f"  zoom      : {zoom}")
    print(f"  latitude  : {lat}° (défaut Sahel/Soudan ~15°N, --lat pour préciser)")
    print(f"  largeur   : {width_px}px écran")
    print(f"  intention déclarée : {intent}  (plage attendue : {lo}-{hi} km)")
    print(f"  {BOLD}distance réelle visible à l'écran : ~{km:,.0f} km{RST}".replace(",", " "))
    print()

    if coherent:
        print(f"{GRN}✓ COHÉRENT{RST} — le zoom {zoom} produit ~{km:,.0f} km, dans la plage \"{intent}\" ({lo}-{hi} km).".replace(",", " "))
        return 0
    else:
        # Trouver quelle(s) intention(s) seraient cohérentes avec ce zoom, pour aider au fix.
        matching_intents = [i for i, (l, h) in INTENT_RANGES.items() if l <= km <= h]
        ratio = km / hi if km > hi else lo / km if km > 0 else float("inf")
        print(f"{RED}✗ INCOHÉRENT{RST} — le zoom {zoom} produit ~{km:,.0f} km, HORS plage \"{intent}\" ({lo}-{hi} km).".replace(",", " "))
        if matching_intents:
            print(f"  {YEL}Ce zoom correspond plutôt à l'intention : {', '.join(matching_intents)}.{RST}")
        else:
            print(f"  {YEL}Ce zoom ne correspond à AUCUNE intention connue (trop large même pour 'regional').{RST}")
        print(f"  {YEL}Facteur d'écart approximatif : ×{ratio:.1f}.{RST}")
        print(f"  {DIM}Rappel bug Soudan Acte 3 (2026-07-10/11) : zoom 6.6 déclaré \"close-up\" produisait{RST}")
        print(f"  {DIM}~3000km d'écran réel (pas ~300km) — exactement ce type d'incohérence, facteur ×10,{RST}")
        print(f"  {DIM}détecté seulement après 3 renders (v7-v9) par confrontation à une vidéo de référence.{RST}")
        return 1


# ─────────────────────────────────────────────────────────────────────────────
# PHASE 3 — self-review : wrapper mapbox-selfreview.py + check zoom auto-détecté
# ─────────────────────────────────────────────────────────────────────────────

ZOOM_PATTERN = re.compile(r"\bzoom\s*[:=]\s*([0-9]+(?:\.[0-9]+)?)")
LAT_PATTERN = re.compile(r"\blat\s*[:=]\s*(-?[0-9]+(?:\.[0-9]+)?)")


def phase_self_review(args):
    if not SELFREVIEW_SCRIPT.exists():
        print(f"{RED}mapbox-selfreview.py introuvable à {SELFREVIEW_SCRIPT}{RST}")
        return 1

    print(f"\n{BOLD}═══ SELF-REVIEW WAR-MAP (wrapper mapbox-selfreview.py) ═══{RST}")

    # 1) déléguer au script existant, TEL QUEL — ne rien réinventer.
    result = subprocess.run(
        [sys.executable, str(SELFREVIEW_SCRIPT), *args.files],
        cwd=str(REPO_ROOT),
    )
    exit_code = result.returncode

    # 2) check zoom additionnel : grep un pattern zoom: / zoom= dans chaque fichier, et si on
    #    trouve aussi une intention déclarable, on ne peut pas la deviner automatiquement (elle
    #    n'est pas dans le code) -> on se contente de LISTER les zooms trouvés + la distance km
    #    correspondante, en signal, pour que l'humain/l'agent juge la cohérence avec l'intention
    #    narrative du beat (que ce script ne connaît pas).
    print(f"\n{BOLD}── Zooms détectés dans le(s) fichier(s) (signal, pas un verdict) ──{RST}")
    any_zoom = False
    for f in args.files:
        path = Path(f)
        if not path.exists():
            continue
        src = path.read_text(encoding="utf-8")
        zooms = sorted(set(float(m) for m in ZOOM_PATTERN.findall(src)))
        if not zooms:
            continue
        any_zoom = True
        lat_matches = [float(m) for m in LAT_PATTERN.findall(src)]
        lat = lat_matches[0] if lat_matches else DEFAULT_LAT
        print(f"  {DIM}{path.name}{RST} (lat utilisée pour l'estimation : {lat}°)")
        for z in zooms:
            km = screen_width_km(z, lat, DEFAULT_SCREEN_WIDTH_PX)
            print(f"    zoom={z:<6} -> ~{km:,.0f} km d'écran".replace(",", " "))
    if not any_zoom:
        print(f"  {DIM}(aucun pattern zoom:/zoom= détecté){RST}")
    print(f"\n  {YEL}-> Vérifier manuellement (ou --phase zoom-check --intent ...) que chaque valeur{RST}")
    print(f"  {YEL}   correspond à l'intention narrative RÉELLE du beat (close-up/territorial/regional).{RST}\n")

    return exit_code


# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="War-Map session — scan doctrine + zoom-check (anti-bug ×10) + self-review wrapper.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--phase", required=True, choices=["scan", "zoom-check", "self-review"])
    parser.add_argument("file", nargs="?", help="[zoom-check/self-review] fichier .tsx (positionnel, 1er arg après --phase)")
    parser.add_argument("files", nargs="*", help="[self-review] fichiers .tsx additionnels")
    parser.add_argument("--zoom", type=float, help="[zoom-check] niveau de zoom Mapbox à vérifier")
    parser.add_argument("--intent", choices=list(INTENT_RANGES.keys()), help="[zoom-check] intention narrative déclarée")
    parser.add_argument("--lat", type=float, default=None, help="latitude (défaut 15°N, Sahel/Soudan)")
    parser.add_argument("--width", type=int, default=None, help="largeur écran px (défaut 1920)")

    args = parser.parse_args()

    if args.phase == "scan":
        phase_scan()
        return 0

    if args.phase == "zoom-check":
        if args.zoom is None or args.intent is None:
            parser.error("--phase zoom-check requiert --zoom <valeur> et --intent <close-up|territorial|regional>")
        # reconstruire args.file proprement (positionnel unique attendu ici)
        return phase_zoom_check(argparse.Namespace(
            file=args.file, zoom=args.zoom, intent=args.intent, lat=args.lat, width=args.width,
        ))

    if args.phase == "self-review":
        all_files = ([args.file] if args.file else []) + args.files
        if not all_files:
            parser.error("--phase self-review requiert au moins un fichier .tsx")
        return phase_self_review(argparse.Namespace(files=all_files))

    return 2


if __name__ == "__main__":
    sys.exit(main())
