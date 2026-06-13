"""
Review DOWNSTREAM Gemini SEUL sur la vidéo P3 rendue + commentaires du réalisateur.
Pas un score, pas un JSON rigide : un AVIS DE RÉALISATEUR libre. Gemini a liberté créative
(il n'a pas à être 100% d'accord avec Aziz). On lui joint la vidéo + les commentaires + le
catalogue COMPLET de nos templates/composants War-Map (liberté cadrée = faisable chez nous).
Modèle : gemini-3.1-pro-preview (verrouillé CLAUDE.md).
"""
import os, sys, time
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")
MODEL = "gemini-3.1-pro-preview"

CATALOGUE = """## NOTRE BOÎTE À OUTILS WAR-MAP (ce que Claude SAIT coder, frame-driven Remotion + Mapbox)

ARCHITECTURE : 1 seule Map Mapbox continue (top-down, parchemin terre/sable), caméra frame-driven
(useCurrentFrame + interpolate + map.jumpTo, JAMAIS flyTo). Une couche pure <Partie3Rupture> dessine
par-dessus via ctx.project(lon,lat)->pixel. On a AUSSI l'instance map (pour les briques _shared).

BRIQUES / TECHNIQUES DISPONIBLES :
- JETONS CIRCULAIRES (chip) : cercle parchemin + bordure couleur-faction + PORTRAIT clippé (vraie image
  PixelLab/Gemini, PAS un point nu). C'est notre marqueur d'acteur. Respiration sin. Ombre portée.
- Jetons à WAYPOINTS (interpWaypoints) : se déplacent frame-driven sur la carte (avancée, recul, dispersion).
- SILLAGE par mask SVG flouté ("wet ink") : une couleur se révèle DERRIÈRE un jeton qui avance.
- countryOutline : contour d'un pays qui se DESSINE (stroke-dashoffset) + flash au nommage.
- Remplissage de contour clippé (une donnée/couleur qui monte dans un pays).
- SPRITES-LIEUX ancrés carte (bases, fortins top-down Gemini, ex: base ONU, fortin Africa Corps).
- VRAI DRAPEAU clippé dans une silhouette (image PNG) + clip-path déformable (ondulation).
- WarMapPlaque : plaque-nom parchemin élégante, géo-ancrée.
- Halos qui pulsent, onde de choc concentrique, zones qui pulsent.
- TIMELINE graduée pleine largeur en bas (curseur année qui glisse), peut reculer (flashback).
- Caméra : drift continu + ZOOM/PAN frame-driven qui peut SUIVRE un jeton en mouvement (traque l'action).
- Assombrissement sélectif / focus radial (hiérarchie du regard).
- SFX frame-précis. Désaturation/sépia globale (flashback).
- ⭐ SahelAttackArrow (flèche tactique qui pousse) · TerritorialExpansion (zone qui grandit).

⭐ OVERLAYS PLEIN ÉCRAN REMOTION (hors carte) : on a TOUTE une bibliothèque de composants Remotion plein
écran (cartes data, citations, blocs comparatifs, portraits, timelines, splits, plaques, etc.) — on PEUT
casser la carte pour un plan plein écran qui raconte, puis revenir sur la carte (comme Kings & Generals).
Possible aussi en semi-transparent par-dessus la carte (overlay translucide centré).

INTERDIT (non reproductible) : filter:blur CSS sur la carte, vraie 3D, particules volumétriques, lens flare,
After Effects. Tout doit être frame-driven et headless-safe.

IDENTITÉ : palette terre/sable/parchemin. Couleurs codées : ROUGE-brique=menace jihadiste · BLEU désaturé
#2B4F7C=Mali/État · OR #C9A24B=AES · ORANGE=CEDEAO · bordeaux #6B1A1A=gravité (Moura). Grain papier + vignette.
GRAMMAIRE CAUSALE non-négociable : un ACTEUR AGIT -> le territoire change EN CONSÉQUENCE (jamais un état qui pop)."""

CONTEXTE = """## CE QUE RACONTE LA PARTIE 3 (war-map Sahel, format long 16:9, ~1min55)
C'est la 3e partie d'une war-map sur le Sahel. Avant : P1 (origine 2012), P2 (10 ans d'intervention
France/ONU qui échoue, les jihadistes gagnent du terrain, coup d'État au Niger, la CEDEAO menace le Niger).
P3 = "La Rupture" : 1. les 3 pays (Mali/Burkina/Niger) font bloc et créent l'AES (Alliance des États du
Sahel, charte du Liptako-Gourma, 16 sept 2023) en réponse à la menace CEDEAO. 2. Première épreuve : KIDAL,
ville tenue par des groupes armés touaregs depuis 2012, où l'ONU est présente mais sans mandat de combat.
3. Nov 2023 : l'ONU se retire, l'armée malienne (FAMa) + Africa Corps (ex-Wagner) lancent l'offensive et
REPRENNENT Kidal (drapeau malien). 4. Part d'ombre : exactions de Moura (flashback mars 2022, +500 civils,
rapport ONU). 5. 2026 : les attaques jihadistes s'intensifient mais sont REPOUSSÉES — "prendre un territoire
est une chose, le conserver en est une autre".

IDÉE STRUCTURANTE : inversion chromatique — en P2 l'avancée des jetons était ROUGE (jihadistes prennent),
en P3 l'avancée principale est BLEU MALI (l'État reprend Kidal). Le rouge ne revient qu'à la fin, refoulé."""

PROMPT = f"""Tu es un RÉALISATEUR / directeur artistique expérimenté de war-maps documentaires géopolitiques
(type Kings & Generals, mais avec notre identité parchemin). On te montre un PREMIER JET rendu de notre
Partie 3, AVEC le son (narration française + musique + SFX). On te donne aussi les commentaires de NOTRE
réalisateur (Aziz) sur ce jet.

{CONTEXTE}

{CATALOGUE}

## LES COMMENTAIRES DE NOTRE RÉALISATEUR (Aziz) sur ce jet
{Path("/tmp/da-refs/p3-v2-aziz-feedback.txt").read_text()}

## CE QU'ON TE DEMANDE (avis de réalisateur LIBRE)
Regarde la vidéo en entier (avec le son). Donne ton point de vue de réalisateur. TU AS LA LIBERTÉ CRÉATIVE :
tu n'as PAS à être d'accord à 100% avec Aziz — si tu penses qu'un de ses points est discutable ou qu'il y a
mieux, dis-le et explique pourquoi. À l'inverse, confirme ce que tu approuves.

Structure ta réponse (prose claire, pas de JSON) :

1. IMPRESSION GÉNÉRALE (3-4 phrases) : qu'est-ce qui marche, qu'est-ce qui ne marche pas dans ce jet ? Le
   rythme est-il vraiment "statique/contemplatif" comme le dit Aziz, ou pas ?

2. SUR CHAQUE POINT D'AZIZ (1 à 9) : pour chacun, dis si tu es D'ACCORD / PARTIELLEMENT / EN DÉSACCORD, et
   ta recommandation concrète FAISABLE dans notre boîte à outils ci-dessus. Sois précis (quel template, quel
   mouvement de caméra, quel asset).

3. LA QUESTION CLÉ — OVERLAY PLEIN ÉCRAN vs SEMI-TRANSPARENT pour Ph1 (la naissance de l'AES) :
   selon TOI réalisateur, casser la carte avec un plan plein écran est-il une bonne idée ici ? Ou vaut-il
   mieux un overlay semi-transparent par-dessus la carte ? Ou rester 100% carte avec un zoom serré ? Tranche
   et justifie. Pense au RYTHME de la vidéo entière (quand casser la carte a du sens, quand ça la fragmente).

4. CE QUE TOI TU CHANGERAIS EN PRIORITÉ (top 3) que Aziz n'a PAS mentionné — tes propres yeux de réalisateur.

5. CE QU'IL NE FAUT SURTOUT PAS CASSER (ce qui marche déjà et qu'on doit garder).

Reste 100% dans notre boîte à outils et notre identité parchemin. Sois concret et actionnable, pas de
généralités. Tu es un œil externe précieux : dis la vérité, même si elle nuance Aziz."""

def main():
    video_path = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "out/episodes/warmap-sahel/wip/p3-FULL_v1.mp4"
    if not video_path.exists():
        print(f"ERREUR : video introuvable : {video_path}", file=sys.stderr); sys.exit(1)
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERREUR : GEMINI_API_KEY absent", file=sys.stderr); sys.exit(1)
    client = genai.Client(api_key=api_key)

    print(f"[1/4] Upload {video_path.name} ({video_path.stat().st_size // 1024} KB)...")
    vf = client.files.upload(file=str(video_path), config=types.UploadFileConfig(mime_type="video/mp4"))
    print("[2/4] Attente traitement (ACTIVE)...")
    while vf.state.name == "PROCESSING":
        time.sleep(3); vf = client.files.get(name=vf.name)
    if vf.state.name != "ACTIVE":
        print(f"ERREUR : etat = {vf.state.name}", file=sys.stderr); sys.exit(1)
    print(f"[3/4] Analyse via {MODEL} (avis realisateur libre)...")
    resp = client.models.generate_content(
        model=MODEL,
        contents=[types.Part.from_uri(file_uri=vf.uri, mime_type="video/mp4"), types.Part(text=PROMPT)],
        config=types.GenerateContentConfig(max_output_tokens=8000, temperature=0.5),
    )
    print("[4/4] Cleanup...")
    try: client.files.delete(name=vf.name)
    except Exception: pass
    out = ROOT / "memory/episodes/warmap-sahel/reviews-p3" / "gemini-p3-jet2-review.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(resp.text)
    print(f"\n=== REVIEW SAUVEGARDÉE -> {out} ===\n")
    print(resp.text)

if __name__ == "__main__":
    main()
