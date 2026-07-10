---
name: feedback_juger-asset-cote-a-cote-storyboard
description: Ne jamais juger un asset genere "trop X" de memoire — toujours comparer cote-a-cote avec le panneau storyboard-cible. Le breakdown du modele est plus fiable que mon oeil sans reference. Inclut aussi le cas miroir : la verification TECHNIQUE (XML, rotation, structure) ne remplace pas le jugement VISUEL a l'oeil.
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

## Cas miroir — verification TECHNIQUE ≠ jugement VISUEL (2026-07-10, session GPT-5.6 Sol)

**Ce qui s'est passe** : lors d'une session de tests exhaustifs de GPT-5.6 Sol pour la generation SVG, j'ai
affirme 2 verdicts trop optimistes en verifiant seulement l'aspect TECHNIQUE, sans faire le second passage
VISUEL rigoureux qui aurait revele le vrai probleme — Aziz a du corriger les deux fois :
1. **Personnage complet articule** : j'ai verifie que la hierarchie XML etait bien imbriquee et que les
   rotations (jusqu'a 70°) ne decrochaient pas mecaniquement -> j'ai conclu "succes total". Aziz a regarde
   la VIDEO et juge le resultat "grotesque, cutout visible, bras pas continus" — un probleme de silhouette
   organique que la seule verification de rotation ne pouvait pas detecter.
2. **Scene "usine" imitee sans image de reference** : j'ai verifie que le SUJET/la composition (cheminee,
   toit, rails) correspondait a la scene reelle -> j'ai conclu a tort "polyvalence de style confirmee".
   Aziz a demande "as-tu vraiment extrait les frames et compare le style ?" — une fois la comparaison
   cote-a-cote FAITE, l'ecart de registre (trait epais+degrades vs trait fin+aplats) etait evident.

**Why** : la verification structurelle/mecanique (XML valide, JSON de pivots coherent, rotation sans
decrochage, meme sujet present) est un axe ORTHOGONAL au jugement esthetique/stylistique — verifier l'un
ne dit rien sur l'autre. Le meme piege que le cas storyboard ci-dessus (juger sans la cible a l'ecran),
mais applique a un autre type de verification : la preuve technique donne un FAUX sentiment de certitude
qui dispense (a tort) de faire le vrai test visuel.

**How to apply** :
- Des qu'une question porte sur la QUALITE ou le STYLE (pas juste la fonction/robustesse), faire un
  passage DEDIE : extraire des frames reelles, composer une planche cote-a-cote, regarder avant d'affirmer.
- Une verification technique reussie ("ca ne crash pas", "la structure est bonne", "meme sujet present")
  n'autorise PAS a sauter cette étape — ce sont deux preuves de nature differente.
- Vaut pour tout jugement d'agent qui verifie "ca marche" sans verifier "ca a l'air bien" — pas limite au
  SVG/Sol, applicable a toute generation (image, video, code UI, etc.).

Preuve complete : `memory/tools/openrouter-svg.md` § "GPT-5.6 Sol" (session 2026-07-10).
