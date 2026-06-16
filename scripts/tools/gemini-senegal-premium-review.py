#!/usr/bin/env python3
"""
Breakdown PREMIUM de la video Senegal Petrole & Gaz (mid-form 7min39) par Gemini 3.1 Pro
via upload VIDEO complete (Files API). Cadre = REVIEW-PREMIUM-TEMPLATE (faire monter en
gamme une version semi-finale, PAS chasser les bugs). Stack Souverain, sans TikTok.

Usage : python3 scripts/tools/gemini-senegal-premium-review.py <video.mp4> [out.md]
"""
import os
import sys
import time
from pathlib import Path

from google import genai
from google.genai import types

GEMINI_MODEL = "gemini-3.1-pro-preview"


def load_key():
    env = Path(__file__).resolve().parents[2] / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return os.environ.get("GEMINI_API_KEY")


PROMPT = """\
Tu es directeur artistique expert en motion-design documentaire (carto + data-viz), niveau
chaines premium (Kings & Generals, Polymatter, Johnny Harris, Vox, Bloomberg Originals).
Tu analyses une video FINIE et DEJA PUBLIABLE (7min39, francais) : un mid-form economique
sur le petrole/gaz du Senegal, format "Souverain" (geopolitique-eco Afrique, ton analyste
sobre, PAS TikTok, PAS sensationnaliste).

MANDAT : ce n'est PAS une chasse aux bugs. Le fond est valide. Mission = qu'est-ce qui
ELEVERAIT cette video au PREMIUM et la rendrait plus VIVANTE, dans NOTRE stack, sans rien
refaire de zero, sans tout re-rendre. Tu as DROIT aux idees neuves mais elles doivent etre
realisables dans nos contraintes.

NOTRE STACK (ce qu'on peut faire) :
- Remotion (React) frame-driven : SVG anime par code (formes geometriques dessinees/morph),
  opacite/couleurs/echelle/rotation, spring(), interpolate, grain/displacement par shader leger.
- Mapbox GL headless frame-driven (camera via jumpTo + interpolate ; JAMAIS flyTo/easeTo).
  Carte vivante : FlagFill (drapeau dans polygone), halos, marqueurs, lignes/arcs tracees,
  textures, pulse, contours qui se dessinent.
- ~1500 icones Lucide nettes ; sprites/objets generes Gemini (fond transparent) posables sur la carte.
- Tailwind. Palette : navy #16213a, or/gold, ivoire, kraft/beige (registre "dossier d'enquete"),
  rouge alerte.
INTERDITS ABSOLUS : After Effects, 3D lourde, filter:blur CSS, easeTo/flyTo Mapbox,
setTimeout/@keyframes/transition CSS, pixel-art (reserve a un autre format).

CONTEXTE NARRATIF (les 3 registres visuels de la video, tous VALIDES, ne pas proposer de les casser) :
- REGISTRE A "renseignement/carte" : Mapbox navy, Senegal en FlagFill jaune, Sangomar/Yakaar
  marqueurs+halos, donut revenus, carte Afrique, lignes ITIE/FONSIS. (Acte1, Acte2, Mecanisme3)
- REGISTRE B "dossier d'enquete" : inserts data-viz sur fond kraft/beige : barres segmentees
  (60%->36%), coffre FONSIS, fiches contrat tamponnees CONTESTE, calebasse-dette 132%. (Mecanisme1/2)
- REGISTRE C "cartons typo" : hook (flip date AVRIL, drapeau, GOUVERNEMENT DISSOUS 22 mai 2026),
  chiffres choc ("<50%" neon rouge), carton final "Prochaine video".

DEJA PREVU / DEJA FAIT (cherche AU-DELA de ca, ne le re-propose pas) :
- Le fait que "le fond respire" est deja un objectif connu.
- La carte Mapbox est deja bien exploitee (FlagFill, halos, lignes tracees).
- Fact-check : on sait deja que "Dette 80% PIB" (carte Mecanisme3) doit devenir 132% (incoherence interne).

LES 7 DEMANDES (precis, actionnable, hierarchise, avec TIMECODES) :
1. TEMPS MORTS (priorite 1) : timecodes precis ou l'ecran est vide/mou/statique trop longtemps
   (gros aplats kraft ou navy inertes, espace mort autour d'un petit element). Pour CHACUN :
   quoi y mettre de FAISABLE dans notre stack.
2. RETENTION & RYTHME : ou risque-t-on de perdre le spectateur ? quels passages traient trop ?
   ou un mouvement semble gratuit (sans intention) ? Tu vois le MOUVEMENT et entends le SON :
   signale les transitions molles ou les coupes seches entre registres.
3. EXPLOITER LA CARTE VIVANTE & LES INSERTS : qu'est-ce qu'on sous-utilise (texture, lumiere,
   particules, micro-animations d'entree, profondeur) sur les inserts kraft (registre B) surtout ?
4. AUDIT STACK : utilise-t-on au max raisonnable nos outils (SVG anime, icones, objets Gemini,
   carte vivante) ? Ou aurait-on pu faire +50% d'impact pour peu d'effort ?
5. BENCHMARK : qu'est-ce qu'un mid-form eco premium (Bloomberg, Vox, Johnny Harris, Polymatter)
   a que cette video n'a PAS, et qui est reproductible dans notre stack ? (specifique, pas "plus pro")
6. ECRAN FINAL & CTA : le carton final "Prochaine video" est tres nu. Comment le rendre premium
   + y integrer un CTA retention (sans casser le ton sobre) ?
7. HIERARCHISE : donne un TOP 5 final classe par rapport IMPACT / EFFORT (effort = faible si
   1 insert/1 beat a retoucher ; eleve si plusieurs beats). Precise pour chacun : le timecode,
   le registre (A/B/C), l'effort estime, l'impact attendu.

+ Les 5 ANGLES (passe-les en revue brievement) : (a) spectateur lambda non-expert,
(b) narration/synchro audio-visuel, (c) transitions entre les 3 registres, (d) signaux "AI-slop"
ou amateur a eviter, (e) credibilite aupres d'un expert du secteur petrolier/eco.

REGLE : chaque suggestion DOIT etre dans notre stack (pas d'AE/3D/blur). Si tu proposes une idee
hors stack, signale-le explicitement. Sois CONCRET (timecode + quoi + comment), pas generique.
Format : Markdown, sections numerotees 1-7 + TOP 5. Va a l'essentiel, densite maximale.
"""


def main():
    if len(sys.argv) < 2:
        print("usage: gemini-senegal-premium-review.py <video.mp4> [out.md]")
        sys.exit(1)
    video_path = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else "out/episodes/senegal-petrole-gaz/_review-prepub/GEMINI-PREMIUM-REVIEW.md"

    key = load_key()
    client = genai.Client(api_key=key)

    print(f"[1/3] Upload {Path(video_path).name} ({Path(video_path).stat().st_size/1e6:.0f} Mo)...")
    f = client.files.upload(file=video_path)
    print("[2/3] Attente ACTIVE...")
    t0 = time.time()
    while str(f.state) not in ("ACTIVE", "FileState.ACTIVE"):
        if str(f.state) in ("FAILED", "FileState.FAILED"):
            print("ECHEC."); sys.exit(2)
        time.sleep(5)
        f = client.files.get(name=f.name)
        if time.time() - t0 > 300:
            print("TIMEOUT."); sys.exit(3)
    print(f"      ACTIVE en {time.time()-t0:.0f}s")

    print("[3/3] Breakdown premium (peut prendre 1-2min)...")
    resp = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[f, types.Part.from_text(text=PROMPT)],
        config=types.GenerateContentConfig(temperature=0.5, max_output_tokens=8000),
    )
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    Path(out).write_text(resp.text or "(vide)")
    print(f"\n=== ECRIT : {out} ===\n")
    print(resp.text)


if __name__ == "__main__":
    main()
