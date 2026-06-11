"""Genere un SRT sobre (phrase par phrase) depuis l'alignement Peste 1347.

Regroupe les mots en lignes courtes coupees a la ponctuation forte (.!?:) ou
quand la ligne depasse ~42 caracteres. Style analyste = phrases lisibles, pas
karaoke mot-a-mot.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ALIGN = ROOT / "public" / "atlas" / "peste-1347" / "audio" / "narration-v1-alignment.json"
OUT = ROOT / "public" / "atlas" / "peste-1347" / "audio" / "narration-v1.srt"

MAX_CHARS = 42  # longueur max d'une ligne de sous-titre
STRONG_PUNCT = ".!?:"


# Le texte d'alignement etait sans accents (eviter bugs TTS liaison). On les remet
# pour l'affichage. Remplacement mot-entier insensible a la casse initiale.
ACCENTS = {
    "disparait": "disparaît", "crimee": "crimée", "decembre": "décembre",
    "bacterie": "bactérie", "humidite": "humidité", "elevee": "élevée",
    "asseche": "assèche", "desert": "désert", "meme": "même", "epoque": "époque",
    "pathogene": "pathogène", "recits": "récits", "sures": "sûres",
    "prospere": "prospère", "epidemie": "épidémie", "epidemies": "épidémies",
    "geographie": "géographie", "decrivent": "décrivent", "A": "À",
}


def reaccent(text: str) -> str:
    import re
    def repl(m):
        w = m.group(0)
        low = w.lower()
        if low in ACCENTS:
            acc = ACCENTS[low]
            return acc[0].upper() + acc[1:] if w[0].isupper() else acc
        return w
    return re.sub(r"[A-Za-zÀ-ÿ]+", repl, text)


def fmt_ts(t: float) -> str:
    h = int(t // 3600)
    m = int((t % 3600) // 60)
    s = int(t % 60)
    ms = int(round((t - int(t)) * 1000))
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main() -> int:
    data = json.loads(ALIGN.read_text())
    words = [w for w in data["words"] if w["text"].strip()]  # virer les espaces

    cues = []
    cur_words = []
    cur_start = None

    def flush():
        if not cur_words:
            return
        text = " ".join(w["text"] for w in cur_words).strip()
        # nettoyer espaces avant ponctuation
        for p in [",", ".", ":", ";", "!", "?"]:
            text = text.replace(" " + p, p)
        cues.append({
            "start": cur_words[0]["start"],
            "end": cur_words[-1]["end"],
            "text": reaccent(text),
        })

    for w in words:
        if cur_start is None:
            cur_start = w["start"]
        cur_words.append(w)
        line = " ".join(x["text"] for x in cur_words)
        last_char = w["text"].strip()[-1:] if w["text"].strip() else ""
        # couper sur ponctuation forte OU longueur max
        if last_char in STRONG_PUNCT or len(line) >= MAX_CHARS:
            flush()
            cur_words = []
            cur_start = None
    flush()

    # ecrire SRT
    lines = []
    for i, c in enumerate(cues, 1):
        lines.append(str(i))
        lines.append(f"{fmt_ts(c['start'])} --> {fmt_ts(c['end'])}")
        lines.append(c["text"])
        lines.append("")
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"OK: {len(cues)} sous-titres -> {OUT}")
    # apercu
    for c in cues[:6]:
        print(f"  [{c['start']:.1f}-{c['end']:.1f}] {c['text']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
