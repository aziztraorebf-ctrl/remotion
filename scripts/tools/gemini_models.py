"""Identifiants des modeles Gemini — SOURCE DE VERITE UNIQUE.

Pourquoi ce fichier existe
--------------------------
L'identifiant du modele image etait ecrit en dur 188 fois dans 121 fichiers.
Quand Google a deprecie la version preview (shutdown annonce au 2026-06-25),
il aurait fallu editer 121 fichiers. Desormais : une seule ligne ici.

⛔ NE JAMAIS re-ecrire un identifiant de modele en dur dans un script.
   Importer depuis ce module :

       from gemini_models import IMAGE_MODEL

   Les scripts de `scripts/tools/` sont lances directement (leur dossier est
   donc dans sys.path) — l'import simple fonctionne. Depuis un autre dossier :

       sys.path.insert(0, str(ROOT / "scripts" / "tools"))

Historique des changements
--------------------------
- 2026-08-20 : `-preview` -> GA. La version preview etait en shutdown DEPASSE
  depuis le 2026-06-25. Meme modele, meme prix (0,067 $/image en 1K), mais la
  version preview pouvait cesser de repondre sans preavis.

Reference : https://ai.google.dev/gemini-api/docs/deprecations
Detail projet : memory/tools/gemini.md
"""

# --- Image : generation ET edition (image en entree + instruction) ---------
# GA depuis le 2026-05-28. Resolutions 0.5K/1K/2K/4K. ~0,067 $/image en 1K.
IMAGE_MODEL = "gemini-3.1-flash-image"

# Variante economique : ~0,0336 $/image (-50 %).
# ⚠️ NON ADOPTEE — 2 contraintes verifiees, a tester avant tout usage :
#    (1) exige generationConfig.responseModalities = ["IMAGE"], sinon elle
#        renvoie ZERO image SANS erreur (echec silencieux) ;
#    (2) plafonnee a 1K (pas de 2K/4K).
IMAGE_MODEL_LITE = "gemini-3.1-flash-lite-image"

# Haut de gamme image : ~0,134 $/image. Reserve aux cas ou le Flash echoue.
IMAGE_MODEL_PRO = "gemini-3-pro-image"

# --- Texte / vision (breakdown JSON, review, analyse de frames) ------------
VISION_MODEL = "gemini-3.1-pro-preview"

# Fallback review si le vision timeout. A n'utiliser qu'avec thinking_budget=0.
VISION_FALLBACK_MODEL = "gemini-2.5-flash"

__all__ = [
    "IMAGE_MODEL",
    "IMAGE_MODEL_LITE",
    "IMAGE_MODEL_PRO",
    "VISION_MODEL",
    "VISION_FALLBACK_MODEL",
]
