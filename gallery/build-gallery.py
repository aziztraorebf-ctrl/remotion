#!/usr/bin/env python3
"""Regenere data.json + les posters de la galerie de mouvements de camera.

Source de verite unique : MOVES ci-dessous. Les clips sont decoupes depuis les
rendus listes dans SOURCES, transcodes en 720p, et deposes dans gallery/clips/
(ignore par git : ils vivent sur la release `gallery-media`).

  python3 gallery/build-gallery.py           # tout regenerer
  python3 gallery/build-gallery.py --check   # verifier sans rien ecrire

Ajouter un mouvement = une ligne dans MOVES, puis relancer. Ne jamais editer
data.json a la main : il est ecrase.
"""
import json, os, subprocess, sys, shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(ROOT)
CLIPS = os.path.join(ROOT, "clips")
POSTERS = os.path.join(ROOT, "posters")

CAMERA_LAB = os.path.join(REPO, "out/episodes/_shared/mapbox-camera-lab-v2.mp4")

# slug, titre, categorie, description, lieu, energie, (fichier source, debut s, duree s), crf
MOVES = [
 ("drift-continu","Drift continu","reperage",
  "Dérive lente + bearing 0 à 12°, pitch 25. Le plan qui respire sans intention forte.",
  "Dakar","basse",(CAMERA_LAB,2.5,5),28),
 ("orbit-dolly-in","Orbit + Dolly In","approche",
  "Bearing 0 à -180° pendant que le zoom passe 4.5 à 6.2 et le pitch 0 à 50. On tourne autour en se rapprochant.",
  "Marrakech","haute",(CAMERA_LAB,12.5,5),28),
 ("whip-pan-multistop","Multi-stop A → B + Whip Pan","transition",
  "Déplacement Lagos vers Nairobi avec flou de filé au milieu. Le raccord qui avale la distance.",
  "Lagos → Nairobi","haute",(CAMERA_LAB,22.5,5),28),
 ("zoom-freeze","Zoom rapide + Freeze","accent",
  "Zoom 3.2 à 5.8 puis arrêt net. Sert à plaquer un chiffre ou un nom sur l'arrêt.",
  "Agadez","moyenne",(CAMERA_LAB,32.5,5),28),
 ("tilt-pull-back","Tilt + Pull Back","revelation",
  "Le pitch bascule 0 à 60 puis le zoom recule 5.5 à 3.0. On se redresse et on découvre le contexte.",
  "Kinshasa","moyenne",(CAMERA_LAB,42.5,5),28),
 ("counter-rotation","Counter-rotation + Orbit","approche",
  "Bearing -45 à +35 : la carte tourne dans un sens, la caméra dans l'autre.",
  "Johannesburg","moyenne",(CAMERA_LAB,52.5,5),28),
 ("drift-blur","Drift lent + blur atmosphère","reperage",
  "Dérive avec flou atmosphérique constant. Fond de plan pour poser une voix off.",
  "Alger","basse",(CAMERA_LAB,62.5,5),28),
 # 69.5 et non 72.5 : le recul planetaire se joue en debut de scene (verifie visuellement)
 ("pull-back-reveal","Pull Back Reveal planétaire","revelation",
  "Zoom 5.5 à 2.8 en 60 frames : le pays s'éloigne jusqu'à la vue planétaire. Le geste canonique de la doctrine.",
  "Afrique","haute",(CAMERA_LAB,69.5,5),28),
 # 81.5 : avant, le clip contenait deux gestes (satellite vertical puis 3D rasant)
 ("zoom-sol-3d","Zoom sol 3D","approche",
  "Descente depuis l'orbite jusqu'au niveau du sol, pitch 70°, zoom 14, satellite-streets. Le plan le plus spectaculaire du lot.",
  "Nairobi","haute",(CAMERA_LAB,81.5,5),30),
 ("fade-style-switch","Fade style switch","transition",
  "Bascule dark vers satellite en fondu, caméra fixe. Changer de registre sans bouger.",
  "Lagos","basse",(CAMERA_LAB,92.5,5),28),
 ("whip-pan-style-switch","Whip Pan + style switch","transition",
  "Déplacement Casablanca vers Accra avec changement de style au pic du flou. Le switch est invisible.",
  "Casablanca → Accra","haute",(CAMERA_LAB,102.5,5),28),
 ("zoom-out-in","Zoom out → style → Zoom in","transition",
  "On recule, on change de style, on revient. Traverser une ellipse temporelle.",
  "Dakar","moyenne",(CAMERA_LAB,112.5,5),28),
]

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"echec: {' '.join(cmd[:6])}...\n{r.stderr[:400]}")

def main():
    check = "--check" in sys.argv
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg introuvable")

    missing = sorted({m[6][0] for m in MOVES if not os.path.exists(m[6][0])})
    if missing:
        sys.exit("SOURCE MANQUANTE:\n  " + "\n  ".join(missing))

    slugs = [m[0] for m in MOVES]
    if len(slugs) != len(set(slugs)):
        sys.exit("slugs en double")

    if check:
        absents = [s for s in slugs if not os.path.exists(f"{CLIPS}/{s}.mp4")]
        print(f"{len(MOVES)} mouvements | sources OK | clips absents: {absents or 'aucun'}")
        return

    os.makedirs(CLIPS, exist_ok=True)
    os.makedirs(POSTERS, exist_ok=True)
    cards, total = [], 0
    for slug, titre, cat, desc, lieu, energie, (src, ss, dur), crf in MOVES:
        out = f"{CLIPS}/{slug}.mp4"
        run(["ffmpeg","-v","error","-ss",str(ss),"-t",str(dur),"-i",src,
             "-vf","scale=1280:-2","-c:v","libx264","-crf",str(crf),
             "-preset","slow","-an","-movflags","+faststart","-y",out])
        run(["ffmpeg","-v","error","-ss","2","-i",out,"-vf","scale=640:-2",
             "-frames:v","1","-q:v","6","-y",f"{POSTERS}/{slug}.jpg"])
        ko = round(os.path.getsize(out)/1024); total += ko
        cards.append(dict(slug=slug,titre=titre,cat=cat,desc=desc,
                          lieu=lieu,energie=energie,poids=ko))
        print(f"  {slug:24s} {ko:5d} Ko")

    with open(f"{ROOT}/data.json","w") as f:
        json.dump(cards, f, ensure_ascii=False, indent=1)
    print(f"\n{len(cards)} mouvements | {total/1024:.1f} Mo | data.json ecrit")

if __name__ == "__main__":
    main()
