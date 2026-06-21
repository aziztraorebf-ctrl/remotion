#!/usr/bin/env python3
"""
mapbox-selfreview.py — Self-review SCRIPTÉE d'un beat Mapbox (phase 3 du pipeline).

Check EXTERNE (pas auto-evaluation) : verifie mecaniquement les regles techniques
qui ont coute des iterations. Un Claude qui a ecrit drawFlagCanvas ne se reproche pas
de ne pas avoir cherche l'image -> il faut un grep externe.

Regles verifiees (chacune = leçon documentee 2026-06-03) :
  E1  SFX : tout <Audio sfx> doit etre dans un <Sequence> (jamais {frame===X})
  E2  Drapeaux : pas de drawFlagCanvas/drawMarocFlagCanvas pour un drapeau VISIBLE
                 (utiliser useClipFlags + vraies images public/_shared/flags/)
  E3  Frame-driven : map.jumpTo present, JAMAIS flyTo/easeTo (KO headless)
  E4  Pas de filter:blur CSS sur <line>/<image> SVG (KO headless, lignes invisibles)
  E5  Pas de fetch flagcdn.com / https dans <image>/<img> href (KO headless)
  W1  Si une géométrie pays a outre-mer (France/USA/NLD/DNK) sans mainlandBox -> warn
  W2  countryFilter par ISO present si fill country_boundaries (jamais filtre 'name')

CARTO SOUVERAIN V5 (si fichier touche CartoSouverainV5/GisementMarker/map.project) :
  E6  Position left/top FIXE px sur element geo-ancre (DERIVE quand la camera bouge)
  W6  Drapeau SVG (useClipFlags/MapboxFlagFill) + pitch>0 -> DERIVE -> MapboxCountryFlagDecal
  W7  <GisementMarker> sans prop zoom -> taille pas zoom-driven (agglutination au dezoom)
  W8  addCountryFlagFill (fill-pattern) -> CARRELLE au dezoom -> MapboxCountryFlagDecal

Doctrine V5 : memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md

Usage : python3 scripts/tools/mapbox-selfreview.py <Beat*.tsx> [Beat2.tsx ...]
Exit code 0 si 0 ERROR, 1 sinon. WARN n'echoue pas mais s'affiche.
"""
import re
import sys
from pathlib import Path

# Pays a territoires d'outre-mer -> bbox geante -> mainlandBox requis
# (nom anglais ET code ISO-3, car la reco W2 pousse a filtrer par ISO -> il faut
#  detecter les deux formes sinon suivre la reco ISO desarme W1, faux negatif 06-03)
OVERSEAS = {"France", "Netherlands", "United States of America", "Denmark", "Norway", "Spain"}
OVERSEAS_ISO = {"FRA", "NLD", "USA", "DNK", "NOR", "ESP"}

RED = "\033[91m"; YEL = "\033[93m"; GRN = "\033[92m"; DIM = "\033[2m"; RST = "\033[0m"


def _strip_comment(ln: str) -> str:
    """Retire un commentaire de fin de ligne `// ...` (hors http:// dans une string).
    Suffisant pour neutraliser les faux positifs E3/E5 sur les commentaires d'exemple.
    Ligne entièrement commentée (// ... ou * ...) -> chaîne vide."""
    s = ln.strip()
    if s.startswith("//") or s.startswith("*") or s.startswith("/*"):
        return ""
    # retirer `// commentaire` en milieu de ligne, sauf si précédé de `:` (ex: http://)
    m = re.search(r"(?<!:)//", ln)
    if m:
        return ln[: m.start()]
    return ln


def check_file(path: Path):
    src = path.read_text(encoding="utf-8")
    lines = src.split("\n")
    # version "code seul" (commentaires neutralisés) pour les checks sensibles aux faux positifs
    code_lines = [_strip_comment(ln) for ln in lines]
    errors = []
    warns = []

    def find_lines(pattern):
        return [i + 1 for i, ln in enumerate(code_lines) if re.search(pattern, ln)]

    # ── E1 : SFX dans <Sequence> ────────────────────────────────────────────────
    # Tout <Audio> gardé par une condition de frame (frame === / >= / <= / <) ne démarre
    # PAS en render headless. Détection robuste (3 faux négatifs corrigés 2026-06-03) :
    #   (A) ne dépend PLUS du mot "sfx" dans le nom de fichier (ex: ping-impact.mp3)
    #   (B) couvre le multi-ligne : on cherche un <Audio dans une fenêtre de N lignes
    #       APRÈS une garde de frame, pas seulement sur la même ligne
    #   (C) couvre frame === X, frame >= X, frame < X, frame <= X (pas que ===)
    # On exclut les <Audio> de narration/musique (src narration/voix/music/musique) :
    # eux sont légitimement pilotés autrement (startFrom/Sequence parente).
    FRAME_GUARD = re.compile(r"\bframe\s*(===?|>=|<=|<|>)\s*\d")
    AUDIO_TAG = re.compile(r"<Audio\b")
    NARRATION_HINT = re.compile(r"(narration|voix|voice|music|musique|narrat)", re.I)
    WINDOW = 4  # lignes de lookahead pour le multi-ligne
    bad_sfx = []
    for i, ln in enumerate(lines):
        if not FRAME_GUARD.search(ln):
            continue
        # trouver la PREMIÈRE ligne <Audio dans la fenêtre [i, i+WINDOW] et tester
        # l'exclusion narration SUR CETTE LIGNE précise (pas sur toute la fenêtre,
        # sinon un <Audio narration voisin pollue la détection — bug fenêtre 06-03).
        for j in range(i, min(i + WINDOW + 1, len(lines))):
            if AUDIO_TAG.search(lines[j]):
                if not NARRATION_HINT.search(lines[j]):
                    bad_sfx.append(i + 1)
                break
    if bad_sfx:
        errors.append((
            "E1", f"<Audio> SFX gardé par une condition de frame (frame ===/>=/<=/<). "
            f"Ne démarre PAS en render headless. Lignes {bad_sfx}. "
            "→ wrapper dans <Sequence from={F} durationInFrames={20-30}>."
        ))

    # ── E2 : drapeau dessine a la main pour un drapeau visible ──────────────────
    # drawFlagCanvas/drawMarocFlagCanvas APPELE (pas juste importe/defini) = ERROR,
    # TOUJOURS — même si useClipFlags est utilisé ailleurs dans le fichier. Un fichier
    # peut afficher un drapeau A en useClipFlags (correct) ET un drapeau B en canvas
    # (approximatif, réellement rendu) : la présence globale de useClipFlags ne prouve
    # PAS que CE draw-là est mort (faux négatif corrigé 2026-06-03).
    # Exception (2026-06-21) : passe a MapboxCountryFlagDecal via drawFlag=... = usage LEGITIME
    # (le canvas sert de source-image decoupee a la silhouette, PAS de drapeau approximatif pose brut).
    draw_calls = [i + 1 for i, ln in enumerate(code_lines)
                  if re.search(r"\b(drawFlagCanvas|drawMarocFlagCanvas)\s*\(", ln)
                  and not ln.strip().startswith("function")
                  and not ln.strip().startswith("export")
                  and "drawFlag" not in ln
                  and "MapboxCountryFlagDecal" not in ln
                  and "addCountryFlagFill" not in ln]
    if draw_calls:
        errors.append((
            "E2", f"drawFlagCanvas/drawMarocFlagCanvas APPELÉ (drapeau dessiné approximatif, rendu réel). "
            f"Lignes {draw_calls}. → utiliser useClipFlags + vraies images public/_shared/flags/ (Wikimedia). "
            "Si c'est du code mort, le supprimer (le linter ne peut pas le deviner)."
        ))

    # ── E2b : drapeau dessiné via un COMPOSANT IMPORTÉ (faux négatif des imports) ──
    # mapbox-selfreview ne suit pas les imports. Or WavingFlagFill (et alikes) appellent
    # drawFlagCanvas EN INTERNE -> un wrapper qui les importe rend un drapeau approximatif
    # tout en passant E2 (0 appel direct). On force la vérification du cas drapeau-à-emblème.
    FLAG_CANVAS_COMPONENTS = ("WavingFlagFill", "FlagDissolveTransition")
    imported_flag_comps = [c for c in FLAG_CANVAS_COMPONENTS
                           if re.search(rf"\b{c}\b", src) and re.search(rf"import[^;]*\b{c}\b", src)]
    if imported_flag_comps:
        warns.append((
            "W2b", f"Composant drapeau-canvas importé : {imported_flag_comps}. Il dessine le drapeau via "
            "drawFlagCanvas (approximatif). OK SEULEMENT si le pays a un drapeau 3 BANDES UNIES sans emblème "
            "(Mali/France/Guinée…). Pays à étoile/emblème/détail → carrelé/faux → utiliser useClipFlags. "
            "VÉRIFIER le drapeau du pays concerné avant de valider (voir CATALOGUE-CARTE-VIVANTE § drapeaux)."
        ))

    # ── E3 : frame-driven (pas de flyTo/easeTo) ─────────────────────────────────
    fly = find_lines(r"\.(flyTo|easeTo)\s*\(")
    if fly:
        errors.append((
            "E3", f"flyTo/easeTo utilisé (KO headless, pas frame-driven). Lignes {fly}. "
            "→ map.jumpTo() piloté par useCurrentFrame."
        ))
    # Si beat Mapbox sans jumpTo du tout -> suspect
    if "new mapboxgl.Map" in src and ".jumpTo(" not in src:
        warns.append(("W4", "Carte Mapbox sans map.jumpTo() — caméra figée ? (vérifier que getCam pilote la caméra)"))

    # ── E4 : pas de filter:blur CSS sur SVG ─────────────────────────────────────
    # blur sur un élément SVG (<line>/<image>/<path>/<svg>) NE REND PAS en headless
    # (lignes invisibles, bug 2026-06-03) -> ERROR. Sur un <div> c'est toléré -> WARN.
    # On détecte le blur (string OU template-literal OU WebkitFilter) ligne par ligne,
    # et on regarde une fenêtre de contexte pour décider SVG (bloquant) vs div (warn).
    BLUR = re.compile(r"(filter|WebkitFilter)\s*:\s*[\"'`].*blur\(|(filter|WebkitFilter)\s*:\s*`[^`]*blur\(")
    SVG_TAG = re.compile(r"<(line|image|path|circle|polyline|polygon|rect|svg|g|text)\b")
    DIV_TAG = re.compile(r"<(div|span|section|AbsoluteFill|Sequence|Img)\b")
    blur_svg = []
    blur_div = []
    for i, ln in enumerate(code_lines):
        if not BLUR.search(ln):
            continue
        # remonter ligne par ligne jusqu'à la BALISE OUVRANTE la plus proche (la plus
        # fiable pour savoir si le blur s'applique à du SVG ou du div). On s'arrête à
        # la 1re balise rencontrée — pas de fenêtre large qui mélange path et div.
        verdict = None
        for j in range(i, max(-1, i - 8), -1):
            if SVG_TAG.search(code_lines[j]):
                verdict = "svg"; break
            if DIV_TAG.search(code_lines[j]):
                verdict = "div"; break
        if verdict == "svg":
            blur_svg.append(i + 1)
        else:
            blur_div.append(i + 1)  # défaut prudent : div (WARN), pas ERROR sur incertitude
    if blur_svg:
        errors.append((
            "E4", f"filter:blur dans un contexte SVG (<line>/<image>/<path>/<svg>). Lignes {blur_svg}. "
            "→ NE REND PAS en headless (lignes invisibles, bug 2026-06-03). "
            "Remplacer par des halos d'opacité (cercles/paths superposés)."
        ))
    if blur_div:
        warns.append((
            "W5", f"filter:blur CSS inline (l. {blur_div}) — OK sur <div>, KO sur SVG. "
            "Vérifier que le contexte est bien un <div> (sinon = E4)."
        ))

    # ── E5 : pas de fetch distant (http/https) dans image href/src ──────────────
    # tout CDN distant casse le render headless, pas seulement flagcdn.
    cdn = [i + 1 for i, ln in enumerate(code_lines)
           if re.search(r'(href|src)\s*=\s*\{?[`"\']https?://', ln)
           or re.search(r'[`"\']https?://[^`"\']*\.(png|jpg|jpeg|svg|webp|gif)', ln)]
    if cdn:
        errors.append((
            "E5", f"Image distante (http/https CDN) dans href/src ou URL d'image. Lignes {cdn}. "
            "→ image locale via staticFile (fetch externe KO headless)."
        ))

    # ── W1 : pays outre-mer sans mainlandBox ────────────────────────────────────
    overseas_refs = ([c for c in OVERSEAS if f'"{c}"' in src or f"'{c}'" in src]
                     + [iso for iso in OVERSEAS_ISO if re.search(rf'["\']{iso}["\']', src)])
    if overseas_refs and "useClipFlags" in src and "mainlandBox" not in src:
        warns.append((
            "W1", f"Pays à territoires d'outre-mer {sorted(set(overseas_refs))} utilisé avec useClipFlags "
            "SANS mainlandBox — bbox géante risque de casser le drapeau. → ajouter mainlandBox."
        ))

    # ── W2 : filtre par 'name' au lieu d'ISO ────────────────────────────────────
    name_filter = [i + 1 for i, ln in enumerate(lines)
                   if re.search(r'\[\s*["\']get["\']\s*,\s*["\']name["\']\s*\]', ln)]
    if name_filter:
        warns.append((
            "W2", f"Filtre Mapbox sur ['get','name'] (l. {name_filter}) — NON fiable headless. "
            "→ countryFilter(iso, boundaryIsos) (filtre par iso_3166_1_alpha_3)."
        ))

    # ══ CHECKS CARTO SOUVERAIN V5 (doctrine memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md) ══

    # ── W6 : projection drapeau SVG (useClipFlags/MapboxFlagFill) avec PITCH → derive ──
    # S'applique a TOUTE carte Mapbox pitchee (pas seulement V5) : c'est le piege de derive.
    svg_flag = [c for c in ("useClipFlags", "ClipFlagsLayer", "MapboxFlagFill")
                if re.search(rf"\b{c}\b", src)]
    has_pitch = bool(re.search(r"pitch\s*:\s*([1-9]\d*|0*[1-9])", src))  # pitch > 0 quelque part
    if svg_flag and has_pitch:
        warns.append((
            "W6", f"Projection drapeau SVG {svg_flag} AVEC pitch>0 detecte. Le drapeau SVG (image plate dans "
            "une bbox) DERIVE au pitch (prouve 2026-06-21). → MapboxCountryFlagDecal (source image decoupee "
            "a la silhouette, suit le terrain). Doctrine CARTO-OVERLAYS-PRINCIPES."
        ))

    # ── W8 : addCountryFlagFill (fill-pattern) carrelle au dezoom ──────────────────
    if re.search(r"\baddCountryFlagFill\b", src):
        warns.append((
            "W8", "addCountryFlagFill (fill-pattern Mapbox) detecte : CARRELLE/bouillie au DEZOOM. "
            "OK seulement si le pays reste grand a l'ecran. Pour un drapeau-heros → MapboxCountryFlagDecal."
        ))

    # Checks specifiques aux overlays geo-ancres V5 (jetons, anti-derive)
    is_carto = bool(re.search(r"CartoSouverainV5|GisementMarker|MapboxCountryFlagDecal|map\.project\(", src))
    if is_carto:
        # ── E6 : anti-derive — left/top fixe sur element cense etre geo-ancre ──────
        # Regle ZERO : tout element ancre a un lieu = map.project()/frame, JAMAIS left/top px fixe.
        lefttop = [i + 1 for i, ln in enumerate(code_lines)
                   if re.search(r"(left|top)\s*:\s*[\"'`]?\d+(\.\d+)?(px)?[\"'`]?\s*[,}]", ln)
                   and not re.search(r"inset\s*:\s*0", ln)]
        if lefttop:
            errors.append((
                "E6", f"Position left/top FIXE en px dans un fichier carto (l. {lefttop}). Un element geo-ancre "
                "DERIVE si la camera bouge. → position via map.project([lon,lat]) recalcule chaque frame. "
                "(Si c'est un element d'ecran NON ancre — titre, plaque deportee fixe — ignorer ce point.)"
            ))

        # ── W7 : GisementMarker sans prop zoom (taille zoom-driven obligatoire) ────
        marker_lines = [i + 1 for i, ln in enumerate(code_lines) if re.search(r"<GisementMarker\b", ln)]
        if marker_lines and not re.search(r"\bzoom\s*=\s*\{", src):
            warns.append((
                "W7", f"<GisementMarker> sans prop zoom (l. {marker_lines}). La taille DOIT etre pilotee par le "
                "zoom (anti-agglutination au dezoom). → passer zoom={map.getZoom()}. Doctrine CARTO-OVERLAYS."
            ))

    return errors, warns


def main():
    if len(sys.argv) < 2:
        print("Usage: mapbox-selfreview.py <Beat*.tsx> [...]")
        sys.exit(2)

    total_errors = 0
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

    print()
    if total_errors:
        print(f"{RED}SELF-REVIEW ÉCHOUÉE : {total_errors} erreur(s) bloquante(s). Corriger AVANT review Gemini.{RST}")
        sys.exit(1)
    print(f"{GRN}SELF-REVIEW OK : 0 erreur bloquante. (Vérifier les WARN au cas par cas.){RST}")
    sys.exit(0)


if __name__ == "__main__":
    main()
