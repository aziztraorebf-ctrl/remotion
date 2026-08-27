"""h3-clip-avec-previs.py — genere un clip MiniMax H3 pilote par un PREVIS de camera.

Pourquoi ce script
------------------
`minimax-h3-image-to-video.py` passe par fal.ai (~1,30 $/clip) et n'accepte PAS de
previs. Or le previs est precisement ce qui distingue un clip VIVANT d'un clip FIGE :
sans lui, l'ecart mesure entre la 1re et la derniere frame est de 0,68/255 (immobile) ;
avec lui, 38-48/255. Decrire un mouvement de camera en mots ne suffit pas — il faut
le MONTRER. (`memory/fiches/FICHE-CLIP-GENERE.md`)

Ce script soumet le graphe `r2v` sur Comfy Cloud (inclus dans le forfait GPU,
~0,04-0,20 $ de temps GPU par clip) avec le previs branche sur `ref_videos`.

Les gotchas encodes ici — chacun a coute un essai ailleurs
----------------------------------------------------------
1. `input_overrides` via `run_template` n'est PAS fiable sur ce template : il retombe
   SILENCIEUSEMENT sur le clip de demo. -> graphe API construit a la main + submit_workflow.
2. Le node ComfyMathExpression attend `values.a`, pas `a` (rejet `required_input_missing`).
3. `upload_file` REFUSE les .mp4 -> le previs doit etre un GIF ANIME, lu par LoadImage
   comme une sequence d'images.
4. `ref_videos.ref_video_0` attend un IMAGE, pas un VIDEO : brancher LoadImage
   DIRECTEMENT (intercaler un CreateVideo = erreur 400 return_type_mismatch).
5. width/height en INT litteraux sur le node 136 — piloter via ResolutionSelector
   sort un carre 640x640 au lieu du 864x480 demande.
6. duration=5.0 -> exactement 124 frames (la formule d'arrondi du node 131 impose
   des paliers : 5,2 sauterait a 141 frames et desynchroniserait le previs).

USAGE
  python3 scripts/tools/h3-clip-avec-previs.py \
      --image maison.png --previs previs.gif \
      --prompt-file prompt.txt --seed 12345 --label maison-A
"""

import argparse
import json
from pathlib import Path

GRAPH = Path(__file__).parent / "comfy-graphs" / "minimax-h3-r2v-graph-template.json"


def build_graph(image_name: str, previs_name: str, prompt: str, seed: int,
                duration: float = 5.0, width: int = 864, height: int = 480) -> dict:
    """Construit le graphe API complet, valeurs cablees en dur (cf. gotcha 1)."""
    g = json.loads(GRAPH.read_text())

    # L'image de style (ref_image_0) et le previs (ref_video_0).
    g["137"]["inputs"]["image"] = image_name
    # Le graphe modele attend 2 ref_images ; on renvoie la meme dans le second
    # emplacement plutot que de laisser le defaut du template (gotcha 1 : un
    # emplacement non ecrase retombe sur le clip de demo super-heros).
    g["139"]["inputs"]["image"] = image_name

    # Le previs : LoadImage branche DIRECTEMENT sur ref_videos (gotchas 3 et 4).
    g["140"] = {"class_type": "LoadImage", "inputs": {"image": previs_name}}
    g["136"]["inputs"]["ref_videos.ref_video_0"] = ["140", 0]

    g["138"]["inputs"]["value"] = prompt
    g["129"]["inputs"]["noise_seed"] = seed
    g["132"]["inputs"]["value"] = duration          # 5.0 -> 124 frames (gotcha 6)
    g["136"]["inputs"]["width"] = width             # INT litteral (gotcha 5)
    g["136"]["inputs"]["height"] = height
    return g


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--image", required=True, help="nom du fichier DEJA uploade")
    ap.add_argument("--previs", required=True, help="nom du GIF DEJA uploade")
    ap.add_argument("--prompt-file", required=True)
    ap.add_argument("--seed", type=int, required=True)
    ap.add_argument("--duration", type=float, default=5.0)
    ap.add_argument("--out", required=True, help="ou ecrire le graphe JSON a soumettre")
    a = ap.parse_args()

    prompt = Path(a.prompt_file).read_text().strip()
    g = build_graph(a.image, a.previs, prompt, a.seed, a.duration)
    Path(a.out).write_text(json.dumps(g, ensure_ascii=False, indent=2))
    print(f"graphe ecrit -> {a.out}")
    print(f"  image  : {a.image}")
    print(f"  previs : {a.previs}")
    print(f"  seed   : {a.seed}")
    print(f"  duree  : {a.duration} s")
