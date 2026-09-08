Réutiliser une géo/pattern déjà validé sur un autre beat n'exempte pas de reconfirmer le périmètre exact
voulu avec Aziz.

À chaque réutilisation d'une géo, d'un mécanisme visuel ou d'un pattern déjà validé sur un AUTRE beat (même
projet), reformuler explicitement le périmètre/l'échelle envisagée à Aziz AVANT de coder — ne pas assumer
que "pattern validé ailleurs" = "paramètres transférables tels quels ici".

**Why** : sur le Beat 6a CFA, la géo "monde" (116 pays, incluant Europe/Moyen-Orient/Asie) avait été validée
et utilisée sur l'Acte 2 du même projet. Réutilisée par défaut pour le 6a, elle a été rejetée par Aziz
(capture d'écran de l'Acte 2 à l'appui) : il voulait le CONTINENT AFRICAIN SEUL (51 pays) — "trop de
contours qui se confondent, un bouilli illisible". Le contexte narratif change l'échelle et le périmètre
pertinents même à l'intérieur d'un seul projet ; assumer la transférabilité d'un asset validé sans revalider
l'échelle exacte a coûté une itération complète (génération, review, rejet) avant la bonne version.

**How to apply** : recoupe la règle CLAUDE.md "réutiliser un pattern est OK si justifié" mais en révèle
l'angle mort — la réutilisation du MÉCANISME est correcte, celle des PARAMÈTRES (échelle/périmètre exact)
ne l'est pas automatiquement. Reformuler explicitement ("je réutilise le mécanisme de l'Acte 2, je pars sur
la géo monde comme là-bas — c'est bien ça que tu veux ici, ou recadré ?") avant de générer/coder, surtout
quand le pattern source vient d'un beat au sujet narratif différent (ici : Acte 2 montrait CFA+France,
6a ne concerne que le Sahel/Afrique).

---
Migré depuis auto-memory (`feedback_geo-reutilisee-reverifier-perimetre-echelle.md`) le 2026-08-31, contenu
original inchangé.

---

## ⭐⭐⭐ LE MIROIR (2026-09-08) — avant de migrer vers un « canonique », vérifier ce qu'il NE FAIT PAS

Ci-dessus : réutiliser un pattern validé ailleurs sans reconfirmer son périmètre. Voici le même
piège dans l'autre sens — **remplacer une version « périmée » par la version « canonique »** sans
vérifier que la canonique couvre tout.

Deux `GeminiRig` coexistaient (collision détectée par `audit-composants-index.py`) : le canonique
`_shared/personnage-vivant-svg/rig/` et un proto `_rnd/svg-scenes/ProtoGeminiActionChain`. La
consigne évidente était « migrer vers le canonique ». Le canonique est plus riche partout — 5
expressions de visage, 2 vues, 3 chapeaux — **sauf sur un point** : il n'exposait **aucune couleur
de botte**, là où le proto avait `palette.boot`.

⛔ Migrer tel quel aurait **dégradé** une composition R&D active dont le sujet EST la recoloration.
« Canonique » veut dire *fait autorité*, pas *fait tout*.

⭐ **Ce qui a sauvé le coup** : comparer les DEUX signatures avant de toucher au code. `LimbAngles`
était identique (cinématique compatible) — seul l'habillage divergeait. Et le correctif s'est
révélé trivial : la semelle **était déjà dessinée** dans le canonique, sa couleur simplement codée
en dur (`const sole = "#3E2723"`, exactement le défaut du proto). Exposer `bootColor` a suffi.

**Le geste, avant toute migration vers un canonique** :
1. lister les props/capacités des DEUX versions et faire le diff, pas seulement lire le nom ;
2. tout ce que l'ancienne fait et pas la nouvelle → **porter dans le canonique D'ABORD**, migrer ensuite ;
3. rendre et regarder (cf. [[feedback_rapport-vert-ne-prouve-rien-regarder-l-image]] § variante 08/09 :
   ici le `hipY` différait entre les deux rigs et coupait les pieds hors cadre).

⭐ Résoudre une collision par la suppression de l'export du doublon (plutôt que par la suppression
du fichier) préserve la trace de l'exploration tout en rendant l'import ambigu impossible.
