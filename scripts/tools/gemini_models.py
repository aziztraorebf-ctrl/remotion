"""Identifiants des modeles Gemini — SOURCE DE VERITE UNIQUE.

Pourquoi ce fichier existe
--------------------------
L'identifiant du modele image etait ecrit en dur 188 fois dans 121 fichiers.
Quand Google a deprecie la version preview, il aurait fallu editer 121 fichiers.
Desormais : une seule ligne ici.

⛔ NE JAMAIS re-ecrire un identifiant de modele en dur dans un script.
   Importer depuis ce module :

       from gemini_models import IMAGE_MODEL

   Les scripts de `scripts/tools/` sont lances directement (leur dossier est
   donc dans sys.path). Depuis un autre dossier (ex. scripts/warmap/) :

       sys.path.insert(0, str(ROOT / "scripts" / "tools"))

⭐ LE DEFAUT EST LE MODELE "LITE" — pourquoi
-------------------------------------------
Decision d'Aziz, 2026-08-20. Le raisonnement : **nos images ne sont jamais le
livrable**. Elles servent de matiere a H3, de reference pour un SVG, ou de
moodboard pour un LLM. Le rendu final depend de la video upscalee ou du SVG
produit — pas de la resolution de l'image intermediaire, qu'on ne publie jamais.
Payer le double pour une resolution inutilisee n'a pas de sens.

Valide par un comparatif a l'aveugle sur 3 editions reelles (identite avec
2 personnages similaires, retrait d'objet, texte dans l'image) : aucune
difference visible entre le Lite et le Standard. Voir memory/tools/gemini.md.

⚠️⚠️ LE RISQUE ASSUME (choix explicite d'Aziz : pas de garde-fou automatique)
-----------------------------------------------------------------------------
**Le Lite plafonne a 1K.** Un usage qui aurait besoin de 2K/4K sortira en 1K
**SANS AVERTISSEMENT**. Aucun mecanisme ne le detecte : c'est a nous d'y penser.
→ Si une image doit etre publiee telle quelle, ou depasser 1K (miniature
  YouTube haute def, affiche, asset final), utiliser explicitement IMAGE_MODEL_HQ.

⚠️ FLAG response_modalities — RECOMMANDE, PAS un piege
-------------------------------------------------------
Passer `response_modalities=["IMAGE"]` reste la config explicite recommandee.
⛔ MAIS l'affirmation « sans ce flag, le Lite renvoie ZERO image sans erreur » etait
FAUSSE : relayee d'un rapport de recherche sans test, puis INFIRMEE par appel reel le
2026-08-20 — sans flag, avec ["IMAGE"], avec ["image","text"] : les 3 variantes
renvoient 1 image, finish=STOP. Ne pas traiter son absence comme une panne.
(Lecon : une regle non testee ne se grave pas. Cf. key-learnings 2026-08-20.)

    # SDK
    client.models.generate_content(
        model=IMAGE_MODEL, contents=parts,
        config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
    )

Historique
----------
- 2026-08-20 : defaut bascule sur le Lite (-50 %). Flag ajoute aux 3 scripts SDK
  qui ne l'avaient pas (par coherence — la panne silencieuse annoncee n'a PAS ete
  reproduite au test).
- 2026-08-20 : `-preview` -> GA. La version preview etait en shutdown DEPASSE
  depuis le 2026-06-25.

Reference : https://ai.google.dev/gemini-api/docs/pricing
Detail projet : memory/tools/gemini.md
"""

# --- Image : DEFAUT = Lite (brouillons, storyboards, matiere H3, refs SVG) ---
# ~0,0336 $/image. 1K MAXIMUM. Exige response_modalities=["IMAGE"] (cf. ci-dessus).
IMAGE_MODEL = "gemini-3.1-flash-lite-image"

# --- Image HAUTE QUALITE : a appeler EXPLICITEMENT ---------------------------
# ~0,067 $/image (2x le Lite). Resolutions 0.5K/1K/2K/4K.
# Quand l'utiliser : image publiee telle quelle, besoin de 2K/4K, asset final.
IMAGE_MODEL_HQ = "gemini-3.1-flash-image"

# Alias retrocompatible : plusieurs scripts nomment encore le standard ainsi.
IMAGE_MODEL_STANDARD = IMAGE_MODEL_HQ

# Haut de gamme image : ~0,134 $/image. Reserve aux cas ou le Flash echoue.
IMAGE_MODEL_PRO = "gemini-3-pro-image"

# --- Texte / vision (breakdown JSON, review, analyse de frames) --------------
# ⚠️⚠️ CENTRALISATION NON FAITE POUR LA VISION (constate 2026-08-20) :
#   VISION_MODEL n'est importe par AUCUN script — l'identifiant est en dur dans
#   42 fichiers actifs (79 occurrences), dont certains DANS UNE URL. Changer la
#   ligne ci-dessous ne change donc le comportement de RIEN. C'est exactement le
#   scenario « 121 fichiers » que ce module dit vouloir eviter, encore intact ici.
#   → Chantier : faire importer VISION_MODEL avant toute bascule. Cf. NEXT-ACTION.
#
# STATUT (verifie a la source le 2026-08-20) : PAS de shutdown annonce, PAS de GA
#   `gemini-3.1-pro` (il n'existe pas). Google pousse VERS ce modele. Aucune urgence.
# ⚠️ Mais il reste un `-preview` : re-verifier la page deprecations periodiquement.
#
# 💡 GISEMENT NON EXPLOITE : `gemini-3.7-flash` (STABLE, aout 2026) coute -62 % en
#   input / -69 % en output et repond 4x plus vite sur video (1,8 s vs 7,2 s mesures).
#   ⛔ Capacite vision verifiee, QUALITE DE JUGEMENT non testee sur nos cas exigeants
#   (breakdown JSON, DA-brief, jury) — Flash n'est pas Pro. A tester avant bascule.
VISION_MODEL = "gemini-3.1-pro-preview"

# Fallback review si le vision timeout. A n'utiliser qu'avec thinking_budget=0.
# ✅ PAS de shutdown annonce (verifie 2026-08-20). ⚠️ Le « 2 octobre 2026 » qui
#   circule appartient a `gemini-2.5-flash-image` (modele IMAGE), pas a celui-ci.
VISION_FALLBACK_MODEL = "gemini-2.5-flash"

__all__ = [
    "IMAGE_MODEL",
    "IMAGE_MODEL_HQ",
    "IMAGE_MODEL_STANDARD",
    "IMAGE_MODEL_PRO",
    "VISION_MODEL",
    "VISION_FALLBACK_MODEL",
]
