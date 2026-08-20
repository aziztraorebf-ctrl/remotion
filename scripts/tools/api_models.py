"""Identifiants des modeles/voix NON-Gemini — SOURCE DE VERITE UNIQUE.

Pendant de `gemini_models.py`, pour tous les AUTRES fournisseurs.

POURQUOI CE FICHIER
-------------------
Le 2026-08-20, la migration du modele image Gemini a coute une session entiere
parce que l'identifiant etait duplique **188 fois dans 121 fichiers**. Le meme
risque existait, non traite, sur tous les autres fournisseurs. Mesure ce jour-la
dans le code ACTIF (hors archives) :

    voix ElevenLabs GeoAfrique .....  9 fichiers
    Kimi (Moonshot) ................ 34 fichiers
    GPT / OpenRouter ............... 20 fichiers
    GLM (z-ai) .....................  9 fichiers
    DeepSeek .......................  2 fichiers
    Minimax music (fal) ............  1 fichier

⛔ NE JAMAIS re-ecrire un de ces identifiants en dur. Importer :

    import sys
    sys.path.insert(0, str(ROOT / "scripts" / "tools"))   # si hors scripts/tools/
    from api_models import VOICE_SOUVERAIN, KIMI_REVIEW

⚠️ MIGRATION EN COURS : ce module est la cible, mais les ~75 fichiers existants
n'ont PAS encore ete migres (chantier volontairement etale — la migration Gemini
a montre qu'un remplacement de masse se relit fichier par fichier). Tout NOUVEAU
script doit importer d'ici ; les anciens se migrent au fil des touches.

⚠️ VARIANTES CONSTATEES, NON TRANCHEES (releve 2026-08-20, code actif) :
  Kimi : `kimi-k2.5` (43 occ.) · `kimi-k3` (34) · `kimi-k2.6` (2) · `kimi-k26` (1, coquille probable)
  GPT  : `openai/gpt-5.5` (15) · `openai/gpt-5.6-sol` (10)
  Les constantes ci-dessous fixent la valeur MAJORITAIRE de chaque usage. Si un
  script a besoin d'une autre variante, c'est une decision a documenter ici,
  pas une valeur a recopier en dur.

Autorite editoriale (quel modele pour quoi) : bloc « MODELES API VERROUILLES »
en tete de CLAUDE.md. Ce fichier porte les CHAINES, CLAUDE.md porte la DOCTRINE.
"""

# --- ElevenLabs -------------------------------------------------------------
# Voix Souverain/Atlas (« GeoAfrique V2 ») — la seule voix de narration validee.
VOICE_SOUVERAIN = "z3gESu49naEZW8Af2Upm"

# --- Moonshot / Kimi --------------------------------------------------------
# Review technique de rendu (score consultatif — ⛔ Kimi = SIGNAL, jamais JUGE).
KIMI_REVIEW = "kimi-k2.5"
# Vision -> SVG one-shot, visage organique (registre complementaire a Fable 5).
KIMI_VISION_SVG = "kimi-k3"

# --- OpenRouter -------------------------------------------------------------
GPT_TEXT_VISION = "openai/gpt-5.5"        # texte + vision (SVG, breakdown, ideation)
GPT_IMAGE = "gpt-5.4-image-2"             # ⛔ PAS `gpt-5.5-image` : n'existe pas
GPT_SOL = "openai/gpt-5.6-sol"            # variante Sol (usage SVG specifique)
GLM_SVG = "z-ai/glm-5.2"                  # jetons/assets low-cost, planches en lot
DEEPSEEK_TEXT = "deepseek/deepseek-v4-pro"  # 3e voix DA-brief — TEXTE only, PAS de vision

# --- fal.ai -----------------------------------------------------------------
# Payload attendu : {prompt, is_instrumental: true} — ⛔ pas de reference_audio_url.
MINIMAX_MUSIC = "fal-ai/minimax-music/v2.6"

__all__ = [
    "VOICE_SOUVERAIN",
    "KIMI_REVIEW",
    "KIMI_VISION_SVG",
    "GPT_TEXT_VISION",
    "GPT_IMAGE",
    "GPT_SOL",
    "GLM_SVG",
    "DEEPSEEK_TEXT",
    "MINIMAX_MUSIC",
]
