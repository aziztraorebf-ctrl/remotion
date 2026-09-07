"""Regenere le calque neon du bandeau "AbiGirl Reacts" — technique GIVRE (i2i + extraction).

Contexte : le pochoir topologique (chill-meter-bandeau-mask.py) restait "pas net, pas comme
un neon" au visionnage direct (Aziz, 07/09) malgre plusieurs raffinements. Meme technique deja
validee pour le givre (const GIVRE dans ChillMeterRustic.tsx) : Gemini genere l'image ENTIERE
dans l'etat allume, on EXTRAIT le calque (ce qui s'est eclairci), au lieu de construire un
pochoir geometrique puis de le colorer par filtre SVG.

⛔ Restreindre l'extraction aux pixels ou device-rustique.png est deja OPAQUE (alpha>10) —
sinon le fond blanc de studio que Gemini genere HORS de l'objet se fait passer pour de la
lumiere (bug rencontre et corrige le 07/09 : fond bleu ciel plein cadre).

Sortie : public/_client-sim/chill-meter/bandeau-neon.png (1195x896, aligne 1:1).
Relancer uniquement si device-rustique.png change.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import force_ipv4  # noqa: E402,F401

import subprocess
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, "public/_client-sim/chill-meter/device-rustique.png")
GEN = "/tmp/bandeau-neon-gemini-raw.png"
OUT = os.path.join(ROOT, "public/_client-sim/chill-meter/bandeau-neon.png")

PROMPT = (
    "This exact metal device, unchanged in every detail (rust, scratches, screws, gauge, "
    "buttons) EXCEPT: the engraved text 'AbiGirl Reacts' on the top nameplate now glows "
    "brightly like blue neon light — solid, uniform, sharp-edged blue light filling each "
    "letter completely, high contrast against the dark metal plate, similar in clarity to "
    "a lit LED sign. The two snowflake symbols beside it glow the same way. Nothing else "
    "changes."
)

TARGET = np.array([122, 212, 255], dtype=float)  # #7ad4ff, palette du reste du meter


def main():
    subprocess.run(
        [sys.executable, os.path.join(ROOT, "scripts/tools/gemini-i2i.py"),
         "--ref", SRC, "--prompt", PROMPT, "--output", GEN],
        check=True,
    )
    orig = np.asarray(Image.open(SRC).convert("RGBA")).astype(float)
    gen = np.asarray(Image.open(GEN).convert("RGB")).astype(float)

    lum_orig = orig[:, :, :3].mean(2)
    lum_gen = gen.mean(2)
    brighten = np.clip(lum_gen - lum_orig, 0, 255)
    brighten *= orig[:, :, 3] > 10  # exclut le fond blanc de studio de Gemini, hors objet

    alpha = np.clip(brighten * 3.0, 0, 255)
    lum_norm = (gen.mean(2, keepdims=True) / 255.0)
    recolored = np.clip(TARGET[None, None, :] * (0.35 + 0.65 * lum_norm), 0, 255)

    out = np.zeros((*lum_orig.shape, 4), dtype="uint8")
    out[:, :, :3] = recolored.astype("uint8")
    out[:, :, 3] = alpha.astype("uint8")
    Image.fromarray(out, "RGBA").save(OUT)
    print(f"ecrit {OUT} — {(alpha > 20).sum()} px allumes")


if __name__ == "__main__":
    main()
