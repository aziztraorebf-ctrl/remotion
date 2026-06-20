---
name: feedback_juger-asset-cote-a-cote-storyboard
description: Ne jamais juger un asset genere "trop X" de memoire — toujours comparer cote-a-cote avec le panneau storyboard-cible. Le breakdown du modele est plus fiable que mon oeil sans reference.
metadata:
  type: feedback
---

# Juger un asset = TOUJOURS cote-a-cote avec le storyboard-cible

Prouve le 2026-06-20 (test cible "70%" Maroc, methode generation->Remotion).

**Ce qui s'est passe** : GPT-5.5 (breakdown) avait donne le bon prompt pour le "70" or (extrusion 3D
marquee, reflets sur aretes, tranche laterale). L'asset genere (v1) etait FIDELE au storyboard. MAIS j'ai
juge "trop cartoon/gaming" DE MEMOIRE, sans poser l'asset a cote du panneau storyboard. J'ai "corrige" le
prompt vers "extrusion subtile, plat" -> v2 plus PLAT, donc plus ELOIGNE de la cible. Aziz a repere l'erreur
en comparant version finale storyboard <-> version generee cote a cote.

**Why** : mon oeil seul, sans la cible juste a cote, sur-corrige. J'ai vu un ecart de registre qui n'existait
pas. Dans un pipeline agentique, c'est le piege type : un agent "ameliore" un asset deja juste parce qu'il
juge sans reference -> derive, allers-retours, perte de fidelite. Le storyboard premium est la CIBLE a
reproduire a ~100%, pas un brouillon a reinterpreter ([[STORYBOARD-DATAVIZ]]).

**How to apply** :
- Apres CHAQUE generation d'asset, composer une planche `storyboard-panel | asset-genere` AVANT de juger.
  Ne jamais dire "trop X" sans la cible a l'ecran.
- Faire confiance au prompt du breakdown (GPT-5.5/Gemini qui a cree le storyboard) : il sait mieux que mon
  feeling quel prompt reproduit la cible. Ne pas "corriger au feeling" un prompt d'asset.
- Si un asset s'ecarte VRAIMENT (cote-a-cote prouve l'ecart), ajuster ; sinon garder tel quel.
- Vaut pour moi ET pour tout agent frais du pipeline. = garde-fou anti-derive.

Lié : [[STORYBOARD-DATAVIZ]] (storyboard=cible, breakdown fournit les prompts d'asset) ·
[[feedback_gemini-assets-fond-transparent]] (Gemini ne sort pas d'alpha -> detourage Recraft obligatoire).
