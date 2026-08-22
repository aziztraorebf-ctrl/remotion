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
GAZODUC_A2 = os.path.join(REPO, "out/episodes/gazoduc-aagp-tsgp/acte2-FINAL.mp4")
SOUDAN_A3  = os.path.join(REPO, "out/PRET-PUBLICATION/soudan-midform/soudan-acte3-suivre-lor-globe-FINAL.mp4")
PAGECAM    = os.path.join(REPO, "out/templates-souverain/_camera/pagecam-flyover.mp4")
BP = lambda n: os.path.join(REPO, f"out/templates-souverain/_camera/{n}.mp4")

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
 # --- Gestes extraits d'episodes publies (verifies image par image) ---
 # 30.5s : la camera suit le trace Nigeria -> cote (fenetre glissante back 45% / ahead 10%)
 ("suivi-de-trace","Suivi de trace","approche",
  "La camera avance avec le trace qui se dessine, en gardant l'amont visible derriere. Le geste canonique du gazoduc.",
  "Nigeria vers Portugal","moyenne",(GAZODUC_A2,30.5,6),28),
 # 40.0s : le Soudan plein cadre recule jusqu'a la courbure planetaire
 ("pull-back-globe-d3","Pull Back globe D3","revelation",
  "Le pays plein cadre recule jusqu'a devenir un globe avec sa courbure. Version D3 du Pull Back Reveal.",
  "Soudan","haute",(SOUDAN_A3,40.0,6),28),
 # Rendu depuis la composition NorthShieldCursorFlyover (PageCam + curseur solidaires)
 ("pagecam-flyover","PageCam — survol d'interface","approche",
  "Camera 2.5D par keyframes sur une page capturee : elle se rapproche pendant que le curseur descend. Le seul systeme de camera generique et parametrable du repo.",
  "Interface produit","moyenne",(PAGECAM,0.8,6),28),
 # --- Blueprints Atlas rendus le 2026-08-21 (n'avaient aucune image) ---
 # Ces compositions durent 10-23 s : le geste ne se joue PAS au debut. Timecodes
 # trouves par sonde image par image, jamais estimes (1re passe a 1.0 s = 4 clips vides).
 ("camera-track-entity","Caméra qui suit un personnage","approche",
  "Un personnage marche d'un point a un autre et la camera reste sur lui. Blueprint Atlas n°9.",
  "Trajet A vers B","moyenne",(BP("Atlas-BP-CameraTrackEntity"),1.0,5),28),
 ("dual-entity-sequential","Passage d'un personnage a l'autre","transition",
  "Deux personnages se succedent, la camera change de sujet actif puis recule. Blueprint Atlas n°10.",
  "Echange entre deux","moyenne",(BP("Atlas-BP-DualEntitySequential"),9.0,5),28),
 ("formation-march","Marche en formation","approche",
  "Plusieurs personnages avancent ensemble avec des retards individuels. Blueprint Atlas n°11.",
  "Groupe en mouvement","haute",(BP("Atlas-BP-FormationMarch"),12.0,5),28),
 ("waypoint-march","Voyage par etapes","approche",
  "Un personnage traverse plusieurs villes avant d'arriver. Blueprint Atlas n°12.",
  "Multi-villes","moyenne",(BP("Atlas-BP-WaypointMarch"),2.6,5),28),
 ("dutch-tilt-collapse","Bascule d'effondrement","accent",
  "La carte s'incline, la couleur se desature, la camera tremble a l'impact. Blueprint Atlas n°13.",
  "Chute d'empire","haute",(BP("Atlas-BP-DutchTiltCollapse"),6.6,5),28),
 ("gold-route-atlas-zoom","Zoom sur une route","approche",
  "La camera se resserre progressivement sur un trajet qui se dessine.",
  "Route commerciale","moyenne",(BP("Template-GoldRouteAtlasZoom"),1.0,5),28),
]

# Pour chaque geste : (a quoi ca sert -- affiche, mots que tu taperais -- recherche seule).
# C'est le champ le plus consulte : il dit QUAND utiliser le geste, pas comment il marche.
INTENTIONS = {
 "drift-continu": ("Poser un lieu sans le commenter, laisser respirer sous une voix off.",
   "reperage calme lent respirer voix off fond installer poser contexte introduction ambiance"),
 "orbit-dolly-in": ("Faire le tour d'un lieu pour l'installer, en se rapprochant.",
   "tourner autour orbite rotation approcher zoom avant presenter installer lieu ville decouvrir"),
 "whip-pan-multistop": ("Passer d'un pays a un autre sans montrer le trajet.",
   "aller de a vers b saut deplacement rapide flou file transition pays distance relier deux lieux ville"),
 "zoom-freeze": ("Arriver sur un point et s'arreter net pour plaquer un chiffre.",
   "zoom rapide arret stop fige chiffre donnee statistique frapper accent ponctuer nom"),
 "tilt-pull-back": ("Se redresser puis reculer pour decouvrir le contexte autour.",
   "basculer redresser incliner reculer decouvrir contexte revelation elargir voir autour"),
 "counter-rotation": ("Creer du mouvement en faisant tourner carte et camera en sens inverse.",
   "rotation inverse contraire tourner dynamique mouvement complexe energie tension"),
 "drift-blur": ("Un fond de plan doux pour poser du texte ou une narration.",
   "flou fond arriere plan texte narration doux calme atmosphere support lisible"),
 "pull-back-reveal": ("Montrer qu'un pays est petit face au monde.",
   "reculer zoom arriere echelle petit grand monde planete comparaison ecraser situer perspective globe"),
 "zoom-sol-3d": ("Descendre du ciel jusqu'a la rue, en relief.",
   "descendre plonger 3d relief satellite ville rue sol immersion spectaculaire impressionnant terrain"),
 "fade-style-switch": ("Changer d'ambiance sans bouger la camera.",
   "fondu changement style ambiance basculer satellite sombre registre transition douce immobile"),
 "whip-pan-style-switch": ("Changer de lieu et d'ambiance d'un coup, sans qu'on voie la couture.",
   "flou file transition invisible changement style lieu ambiance masquer coupe raccord ville"),
 "zoom-out-in": ("Traverser une ellipse : on recule, ca change, on revient.",
   "ellipse temps saut temporel avant apres reculer revenir changement epoque evolution"),
 "suivi-de-trace": ("Suivre un trace qui se construit, en gardant l'amont visible.",
   "suivre trace route trajet pipeline gazoduc chemin progression construire avancer parcours ligne"),
 "pull-back-globe-d3": ("Passer d'un pays au globe entier, en D3.",
   "globe planete terre courbure reculer echelle monde d3 pays petit spatial vue satellite"),
 "pagecam-flyover": ("Parcourir une interface produit comme si on la montrait a quelqu'un.",
   "interface ui produit saas ecran dashboard curseur souris demo logiciel application survol montrer"),
 "camera-track-entity": ("Accompagner quelqu'un dans son deplacement, sans le perdre de vue.",
   "suivre personnage marcher accompagner voyage deplacement acteur figurant caravane pieton trajet"),
 "dual-entity-sequential": ("Montrer un echange : la camera lache le premier pour prendre le second.",
   "deux personnages echange rencontre commerce troc passer relais changer sujet dialogue dolly recul"),
 "formation-march": ("Faire avancer un groupe : armee, cortege, caravane.",
   "armee groupe cortege caravane troupe soldats ensemble marche formation avancer masse collectif"),
 "waypoint-march": ("Raconter un long voyage en marquant chaque etape.",
   "voyage etapes villes escales route longue conquete progression traverser parcours itineraire"),
 "dutch-tilt-collapse": ("Faire sentir qu'un monde s'ecroule.",
   "effondrement chute defaite catastrophe crise drame basculer incliner trembler desaturer tension empire"),
 "gold-route-atlas-zoom": ("Resserrer sur une route pendant qu'elle se trace.",
   "route commerce or trajet zoom resserrer suivre chemin caravane atlas parcours ligne"),
}

# Favoris partages (versionnes, donc lisibles par Claude) : ce qu'Aziz privilegie.
FAVORIS = {"drift-blur", "drift-continu", "pull-back-globe-d3", "pull-back-reveal",
           "suivi-de-trace", "tilt-pull-back", "whip-pan-multistop"}

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
    sans = [x for x in slugs if x not in INTENTIONS]
    if sans:
        sys.exit(f"INTENTION manquante pour: {sans}\n"
                 "Chaque geste doit dire a quoi il sert, sinon il est introuvable.")

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
        usage, kw = INTENTIONS.get(slug, ("", ""))
        cards.append(dict(slug=slug,titre=titre,cat=cat,desc=desc,usage=usage,
                          kw=kw, fav=slug in FAVORIS,
                          lieu=lieu,energie=energie,poids=ko))
        print(f"  {slug:24s} {ko:5d} Ko")

    with open(f"{ROOT}/data.json","w") as f:
        json.dump(cards, f, ensure_ascii=False, indent=1)
    print(f"\n{len(cards)} mouvements | {total/1024:.1f} Mo | data.json ecrit")

if __name__ == "__main__":
    main()
