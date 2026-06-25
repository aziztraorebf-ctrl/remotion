"""
Detoure le faux damier de transparence peint par gpt-image (mode RGB) -> vrai alpha.
Le damier = pixels quasi-neutres tres clairs (R~=G~=B, luminosite >238, saturation faible).
- Pour les overlays satures (or/rouge) : alpha base sur la saturation + ecart au gris clair.
- Conserve les pixels colores ou sombres (= le contenu reel).
Usage: python3 scripts/tools/dechecker-damier.py <png1> [png2 ...]
"""
import sys
from pathlib import Path
from PIL import Image


def dechecker(path: str):
    im = Image.open(path).convert("RGB")
    px = im.load()
    w, h = im.size
    out = Image.new("RGBA", (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            mx = max(r, g, b)
            mn = min(r, g, b)
            sat = mx - mn  # saturation approx (0 = gris)
            lum = (r + g + b) / 3
            # damier = clair ET peu sature
            if lum > 232 and sat < 16:
                a = 0
            else:
                # transition : plus c'est clair+neutre, plus c'est transparent
                a = 255
                if sat < 28 and lum > 210:
                    a = int(max(0, min(255, (lum - 210) * -8 + sat * 9 + 255)))
                    a = max(0, min(255, a))
            op[x, y] = (r, g, b, a)
    out.save(path)
    print(f"detoure: {path}")


if __name__ == "__main__":
    for p in sys.argv[1:]:
        dechecker(p)
