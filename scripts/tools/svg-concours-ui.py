"""
svg-concours-ui.py — concours SVG multi-modeles sur le registre UI/ORGANIQUE.

⭐ POURQUOI CE SCRIPT (2026-08-28) : Fable 5 est notre defaut SVG, mais Aziz a juge sa MAIN
insuffisante et a rappele que GPT-5.6 Sol avait reussi le visage du pecheur la ou les autres
echouaient (`memory/tools/openrouter-svg.md` § Sol). Ce script tranche par MESURE au lieu de
memoire : meme brief, meme planche, N modeles, resultats presentes ANONYMISES.

⛔ Protocole de test a l'aveugle : `feedback_leaderboard-preselectionne-test-aveugle-tranche`.
Ne JAMAIS dire a Aziz quel modele a produit quelle planche avant qu'il ait juge.

⭐⭐ LE LEVIER TECHNIQUE (mesure sur la piece vendue « Redeem All », 2026-08-28) :
le relief « 3D » des references NE vient PAS des degrades (15 seulement sur 168 remplissages)
mais de l'EMPILEMENT DE FORMES — 227 chemins pour 168 remplissages, soit ~10 formes par objet.
Un modele rend PLAT quand on lui demande « dessine un billet » ; il rend du VOLUME quand on lui
impose la technique. Le brief ci-dessous l'impose explicitement. C'est la variable testee.

Usage :
    python3 scripts/tools/svg-concours-ui.py --lot main    --provider all
    python3 scripts/tools/svg-concours-ui.py --lot objets  --provider all
    python3 scripts/tools/svg-concours-ui.py --lot main    --provider gpt --out /tmp/x.svg
"""

import argparse
import os
import re
import time
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / ".env")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# ⛔ Slugs verrouilles — cf. CLAUDE.md § MODELES API VERROUILLES. Ne pas "moderniser".
GEMINI_MODEL = "gemini-3.1-pro-preview"
GPT_SOL_MODEL = "openai/gpt-5.6-sol"   # le champion organique (visage pecheur, 2026-07-10)
KIMI_K3_MODEL = "moonshotai/kimi-k3"
GROK_MODEL = "x-ai/grok-4.6"
GLM_MODEL = "z-ai/glm-5.2"

# ---------------------------------------------------------------------------
# LE SOCLE COMMUN — identique pour tous les modeles ET pour les deux lots.
# Toute difference entre deux planches vient donc du MODELE, pas du brief.
# ---------------------------------------------------------------------------
SOCLE = r"""
Tu produis UN SVG STATIQUE, et rien d'autre.

## REGLE ABSOLUE
⛔ AUCUNE animation : pas de <animate>, pas de SMIL, pas de CSS, pas de JS, pas de React.
C'est le studio qui animera ensuite par code. Un element dessine "en train de bouger" est
inutilisable. Ton SEUL travail est la QUALITE DU DESSIN. Tout ton effort va la.

## LA TECHNIQUE QUI FAIT LA DIFFERENCE (mesuree sur une piece professionnelle vendue)
Nous avons mesure un livrable d'un studio qui vit de ce metier. Le relief, le "volume",
l'aspect presque 3D de ses objets NE viennent PAS des degrades : il n'y a que 15 degrades
pour 168 remplissages. Le volume vient de l'EMPILEMENT DE FORMES PLEINES :
**227 chemins pour 168 remplissages, soit environ 10 formes par objet.**

Concretement, un billet de banque n'est PAS un rectangle vert. C'est :
le corps du billet · une bande d'ombre le long d'un bord · un pli · un liseré interieur clair ·
une pastille centrale · le symbole · un reflet en biais · le contour.
Chaque forme est un aplat d'une teinte legerement differente de sa voisine.

⭐ APPLIQUE CETTE TECHNIQUE : chaque objet que tu dessines doit etre compose de
**5 a 12 formes empilees** (corps, ombre interne, pli, liseré, reflet, detail).
⛔ Un objet rendu en UNE seule forme plate est un echec, meme s'il a un degrade.
Les degrades sont autorises et bienvenus, mais ils ne remplacent PAS l'empilement.

## CONTRAINTES TECHNIQUES (le fichier finit converti en Lottie)
- ⛔ Pas de <filter>, <feGaussianBlur>, <mask>, <clipPath>, <use>, <pattern>.
  Une ombre portee se fait par une forme sombre decalee a faible opacite.
- ✅ <linearGradient> et <radialGradient> autorises (dans <defs>).
- ⛔ Pas d'emoji. Pas d'accent dans les identifiants.
- Chaque forme doit etre un <path>/<circle>/<rect> FERME et REMPLI (recolorable).

## NOMMAGE (critere de qualite, pas un detail)
Chaque <g> porte un id qui dit sa FONCTION, pas sa forme :
`billet-ombre` et non `rect-3`. Ces noms deviennent les calques que le client manipule.
⛔ Les ids doivent etre TOUS UNIQUES dans le fichier (un id duplique casse le lecteur).

## SORTIE
Reponds UNIQUEMENT avec le code SVG complet, commencant par <svg et finissant par </svg>.
Aucun texte autour, aucun bloc markdown.
"""

BRIEF_MAIN = SOCLE + r"""
## CE QUE TU DESSINES : UNE MAIN-CURSEUR DE DEMO D'INTERFACE

C'est LA piece difficile. Elle sert dans les videos de demonstration d'application mobile :
la main qui touche l'ecran, celle qui raconte l'action. Elle doit etre CREDIBLE, pas
approximative — c'est le dessin ou la moindre erreur de proportion se voit.

### Le style
- Vue de TROIS QUARTS ARRIERE : on regarde sa propre main toucher un ecran.
- Silhouette blanche remplie, contour violet #c888f8 epais (~5), jointures et bouts arrondis.
- INDEX TENDU VERS LE HAUT ; les trois autres doigts replies en rouleau les uns derriere
  les autres ; pouce replie sur le cote.
- Poignet ouvert en bas (la main sort du cadre par le bas).

### Les points ou les dessins ratent, et que tu dois reussir
1. Les TROIS DOIGTS REPLIES doivent se lire comme trois arcs DISTINCTS, pas une masse.
2. Le POUCE doit EMERGER DE LA MASSE de la paume : sa base se fond dans le bord de la
   paume, le contour se poursuit sans rupture. ⛔ Un pouce dessine comme une capsule
   fermee posee a cote de la paume est l'erreur classique — il flotte, il ne se lit pas.
3. Les PROPORTIONS : un index qui fait la moitie de la paume est faux.
4. Le raccord POIGNET/PAUME ne doit pas montrer de rupture de contour.

### LES 3 POSES (dans le MEME fichier, cote a cote, decalees de 170 unites en X)
1. `main-repos`  — index tendu, au repos.
2. `main-appui`  — LA MEME main, index raccourci d'environ 16 unites et bout legerement
   elargi (la pulpe s'ecrase au contact). ⚠️ Tout le RESTE strictement identique au repos :
   c'est ce qui rend l'animation credible quand on passe de l'une a l'autre.
   La difference doit SAUTER AUX YEUX sans comparer les deux images.
3. `main-pointe` — index tendu en diagonale (vers le haut-gauche, ~20 degres).

Les trois poses doivent etre visiblement LA MEME MAIN : memes proportions, meme contour,
meme epaisseur. C'est une serie, pas trois dessins independants.

### Sous-groupes obligatoires dans chaque pose (ids uniques : prefixe par la pose)
`index`, `doigts-replies`, `pouce`, `paume`
(exemple : `repos-index`, `appui-index`, `pointe-index`).

### Canevas
viewBox="0 0 500 260", fond transparent. Chaque main fait environ 132 de large sur 240 de haut.
"""

BRIEF_OBJETS = SOCLE + r"""
## CE QUE TU DESSINES : 4 OBJETS D'INTERFACE D'UNE APP DE RECOMPENSES

Registre : design d'interface SaaS moderne, style illustratif propre et chaleureux.
Pense a l'esthetique d'une app fintech grand public soignee : rondeurs genereuses,
couleurs saturees mais douces, volume obtenu par empilement de formes.

### Canevas
viewBox="0 0 800 854", fond transparent. Respecte les positions : elles sont mesurees.

### 1. <g id="medaille"> — centre (400, 226), diametre 189
Une medaille/badge de recompense. Contour en COURONNE DENTELEE (festons ARRONDIS sur tout
le pourtour, environ 20 lobes — pas un cercle lisse : c'est ce detail qui fait le cachet).
Degrade vertical mesure sur l'original, a respecter :
#e6aa0f (haut) -> #fee22f -> #feda49 -> #ba5336 -> #a74d6f -> #ffb8b3 -> #ffb4be (bas).
Au centre, une etoile a 5 branches aux pointes arrondies, dans un ton rose (#b05053 -> #ffb4be).

### 2. <g id="bouton-redeem"> — centre (400, 486), 264 x 78, rayon 39
Un bouton pilule, degrade rose vers ambre doux, avec un reflet en haut.
Le mot « Redeem » en blanc, gras, taille 32, centre, en <text> avec
font-family="Arial, Helvetica, sans-serif".

### 3. <g id="vignette-giftcard"> — centre (400, 227), carte 124 x 170, rayon 16
Une carte blanche a bord fin gris clair (#e8e6f5), ombre portee tres legere.
Dedans : un PAQUET CADEAU vu de face — boite violette (#c888f8), ruban rose (#f9a8d4) en
croix, et un noeud a deux boucles sur le dessus. Soigne le noeud : c'est ce qui fait la
lisibilite de l'objet.

### 4. <g id="vignette-cash"> — centre (400, 479), carte 124 x 170, rayon 16
Meme carte blanche. Dedans : une LIASSE DE BILLETS verts (#86c67c) legerement en eventail
(3 billets decales), le symbole $ sur celui du dessus, et UNE PIECE DE MONNAIE DOREE posee
en bas a droite qui deborde du billet. C'est la piece qui donne la richesse a l'objet —
et c'est exactement l'objet ou l'empilement de formes se voit le plus.
"""

BRIEFS = {"main": BRIEF_MAIN, "objets": BRIEF_OBJETS}


def strip_fences(txt: str) -> str:
    """Retire un eventuel bloc markdown et tout texte hors du <svg>."""
    txt = txt.strip()
    m = re.search(r"```(?:svg|xml|html)?\s*\n(.*?)```", txt, re.S)
    if m:
        txt = m.group(1).strip()
    d, f = txt.find("<svg"), txt.rfind("</svg>")
    if d >= 0 and f > d:
        return txt[d : f + 6]
    return txt


def call_gemini(brief: str) -> str:
    key = os.getenv("GEMINI_API_KEY")
    if not key:
        raise RuntimeError("GEMINI_API_KEY absente")
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={key}"
    )
    r = requests.post(
        url,
        json={
            "contents": [{"parts": [{"text": brief}]}],
            "generationConfig": {"temperature": 0.9, "maxOutputTokens": 32000},
        },
        timeout=900,
    )
    r.raise_for_status()
    parts = r.json()["candidates"][0]["content"]["parts"]
    return "".join(p.get("text", "") for p in parts)


def call_openrouter(model: str, brief: str, extra: dict | None = None) -> str:
    key = os.getenv("OPENROUTER_API_KEY")
    if not key:
        raise RuntimeError("OPENROUTER_API_KEY absente")
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": brief}],
        "max_tokens": 32000,
    }
    if extra:
        payload.update(extra)
    r = requests.post(
        OPENROUTER_URL,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json=payload,
        timeout=900,
    )
    r.raise_for_status()
    msg = r.json()["choices"][0]["message"]
    content = msg.get("content")
    if not content:
        raise RuntimeError(
            f"{model} a rendu content vide (reasoning={bool(msg.get('reasoning'))}) "
            "— cf. memory/tools/kimi-k3-reasoning-borne.md"
        )
    return content


PROVIDERS = {
    "gemini": lambda b: call_gemini(b),
    "gpt": lambda b: call_openrouter(GPT_SOL_MODEL, b),
    # Kimi K3 : BORNER le reasoning, sinon content=null (kimi-k3-reasoning-borne.md)
    "kimi": lambda b: call_openrouter(
        KIMI_K3_MODEL, b, {"reasoning": {"max_tokens": 2000}, "max_tokens": 16000}
    ),
    "grok": lambda b: call_openrouter(GROK_MODEL, b),
    "glm": lambda b: call_openrouter(GLM_MODEL, b),
}


def controles(svg: str) -> list[str]:
    """Les refus qu'on peut detecter sans rendre. ⛔ Ne remplace PAS le regard."""
    pbs = []
    for interdit in ("<filter", "<mask", "<clipPath", "<use ", "<pattern", "<animate"):
        if interdit in svg:
            pbs.append(f"contient {interdit}")
    ids = re.findall(r'id="([^"]+)"', svg)
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        pbs.append(f"ids dupliques: {sorted(dup)[:5]}")
    if not ids:
        pbs.append("aucun id")
    formes = sum(svg.count(f"<{t}") for t in ("path", "circle", "rect", "ellipse", "polygon"))
    pbs.append(f"[{formes} formes, {len(ids)} ids]")
    return pbs


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--lot", choices=sorted(BRIEFS), required=True)
    ap.add_argument("--provider", default="all")
    ap.add_argument("--out-dir", default=None)
    args = ap.parse_args()

    brief = BRIEFS[args.lot]
    noms = list(PROVIDERS) if args.provider == "all" else args.provider.split(",")
    dest = Path(args.out_dir or (ROOT / "out" / "_r-and-d" / "concours-svg-ui" / args.lot))
    dest.mkdir(parents=True, exist_ok=True)

    for nom in noms:
        t0 = time.time()
        try:
            svg = strip_fences(PROVIDERS[nom](brief))
            if not svg.startswith("<svg"):
                raise RuntimeError(f"pas de <svg> dans la reponse ({len(svg)} car.)")
            chemin = dest / f"{nom}.svg"
            chemin.write_text(svg, encoding="utf-8")
            print(f"✓ {nom:8} {time.time()-t0:6.1f}s  {len(svg):>6} o  {chemin}")
            for p in controles(svg):
                print(f"      {p}")
        except Exception as e:  # noqa: BLE001 — on veut continuer les autres modeles
            print(f"✗ {nom:8} {time.time()-t0:6.1f}s  {type(e).__name__}: {str(e)[:150]}")

    print(f"\n⛔ Presenter les planches ANONYMISEES a Aziz (protocole test a l'aveugle).")
    print(f"   Rendre AVANT de juger : les controles ci-dessus ne voient pas le dessin.")


if __name__ == "__main__":
    main()
