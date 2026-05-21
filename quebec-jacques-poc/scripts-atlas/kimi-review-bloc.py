"""Kimi review wrapper for Atlas Mansa Moussa V2 BLOC validation.
Strict brief : Kimi suggests improvements WITHIN our constraints (Remotion vectoriel, no AE, no Mapbox).
Usage: python kimi-review-bloc.py <video.mp4> <bloc_name>
"""
import sys
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[2]

ATLAS_BRIEF = """Tu es Kimi, directeur technique pour la chaine YouTube "Atlas GeoAfrique" — Shorts educatifs sur des figures africaines oubliees.

CONTEXTE TECHNIQUE STRICT :
- Stack : Remotion (React/TypeScript) + d3-geo + Natural Earth GeoJSON, ZERO After Effects, ZERO Mapbox runtime, ZERO Google Earth Studio
- Style : carte vectorielle 2D animee (pas satellite tilted), inspire Jacques a dit Lumera mais code-only
- Format : 720x1280 (Shorts vertical), 30fps
- Palette ACTEE (NE PAS REMETTRE EN CAUSE) :
  * ocean #3A5A7E (indigo)
  * land #C97D5A (terracotta)
  * gold #D4A574
  * cream #F5EBD8
  * empire outline noir mat
- Acquis stylistiques VALIDES (NE PAS REMETTRE EN CAUSE) :
  * rythme rapide spring stiffness:400, crossfade 6 frames (0.2s)
  * tilt skewX peak 20-28deg avec breath +/-2deg
  * drift Ken Burns 10-18px sinusoidal
  * parallax foreground (Mali + Empire bougent un peu plus)
  * halo dore subtil continu sur Mali (signature)
  * vignette qui respire
  * cartouches Cormorant Garamond fond cream

CE QUE TU DOIS FAIRE :
Analyse cette video et donne TROIS ameliorations concretes a cout marginal qui rendraient cette scene 10% plus pro, DANS NOS CONTRAINTES (pas d'AE, pas de Mapbox, code-only).

CE QUE TU NE DOIS PAS FAIRE :
- Ne suggere PAS d'utiliser After Effects, Adobe Suite, Mapbox runtime, Google Earth Studio
- Ne suggere PAS de changer la palette (deja actee)
- Ne suggere PAS de changer le rythme (deja acte)
- Ne suggere PAS d'ajouter des images Gemini superflues (on en a deja)

STRUCTURE DE TA REPONSE :
## CE QUI MARCHE (3 points forts)
1. ...
2. ...
3. ...

## 3 AMELIORATIONS PROPOSEES (faisables Remotion vectoriel)
1. **[Titre court]** : description + COMMENT l'implementer en SVG/Remotion code (sois precis : nouvelles props, nouveaux paths, animations a ajouter)
2. ...
3. ...

## VERDICT
- Note technique : X/10
- Note narrative : X/10
- Bloquant ? OUI/NON

REPOND EN FRANCAIS, CONCIS (max 400 mots total)."""


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: python kimi-review-bloc.py <video.mp4> <bloc_name>")
        return 1
    video_path = sys.argv[1]
    bloc_name = sys.argv[2]
    out_md = ROOT / "quebec-jacques-poc" / "out" / "atlas-mansa-moussa" / f"kimi-review-{bloc_name}.md"
    print(f"Reviewing {video_path} as {bloc_name}")
    print(f"Output: {out_md}")
    cmd = [
        "python3", "-u",
        str(ROOT / "scripts" / "tools" / "review_with_kimi.py"),
        video_path,
        "--prompt", ATLAS_BRIEF,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
    print(result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr[-500:], file=sys.stderr)
    out_md.parent.mkdir(parents=True, exist_ok=True)
    out_md.write_text(result.stdout)
    print(f"\nSaved review to {out_md}")
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
