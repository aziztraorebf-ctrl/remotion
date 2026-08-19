# Un geste sans BUT est une boucle décorative — l'action doit changer l'état du monde

**Vécu 2026-08-19, hook Gazoduc (1er plan incarné en épisode réel).** Verdict d'Aziz sur un clip par
ailleurs réussi : « il plante la pelle, ramène le sable, remet le MÊME sable et replante. Logiquement
il devrait jeter le sable sur le côté. On devrait voir une progression de son action, pas qu'il plante
une pelle pour le plaisir de planter. Il devrait avoir un but. »

## La règle
**Tout ce qui bouge à l'écran doit avoir une raison, un but, une progression.** Ça vaut pour le GESTE
HUMAIN exactement comme pour la carte.
⭐ **C'est l'extension au geste d'une règle qu'on avait déjà pour la carte** : « un élément qui bouge
est OK seulement avec une intention claire (prendre un territoire, fuir, avancer) — le glissement sans
but est le vrai problème ». Un geste en boucle est l'équivalent humain du glissement sans but.

## Le test qui tranche
**Après N cycles du geste, l'état du monde a-t-il CHANGÉ ?**
- Non (tout est revenu au point de départ) → boucle décorative, le spectateur sent le faux même sans
  savoir le nommer. C'est un tell d'IA aussi sûr que le morphing.
- Oui (le tas a grossi, la tranchée s'est creusée, la pile a diminué) → vraie action.

## Cause racine : c'était MON PREVIS, encore une fois
J'avais codé un cycle **sinusoïdal symétrique** (`dig` monte puis redescend, la pelle revient exactement
à sa position de départ, rien ne s'accumule). H3 a suivi fidèlement — y compris l'absence de but.
→ Même schéma que le morphing des jambes, le bras étiré, la caméra qui traverse le mur : **le modèle
obéit au previs, défauts compris**. Cf `memory/fiches/FICHE-CLIP-GENERE.md`.

## Comment coder un geste AVEC but dans un previs
1. **Cycle ASYMÉTRIQUE** : l'aller et le retour ne sont pas le même chemin inversé.
   Pelleter = planter → charger → **pivoter vers le tas** → jeter → revenir À VIDE.
2. **Déplacement latéral** : la charge part vers un ailleurs (le tas), elle ne remonte pas et redescend
   au même endroit.
3. **ACCUMULATION visible** : dessiner l'état du monde qui change à chaque cycle (le tas grandit, le
   trou s'approfondit). C'est ça, la progression — sans elle, même un cycle asymétrique reste une boucle.

Lié : [[feedback_metaphore-dans-le-monde-du-sujet]] (le geste comme la métaphore doit appartenir au
monde du sujet) · `memory/fiches/FICHE-CLIP-GENERE.md`.
