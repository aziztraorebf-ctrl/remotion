**Mesure du 2026-07-28, sur deux tests successifs.** La regle n.0 de
[[SVG-SCENES-GENERATIVES]] (« le modele dessine le statique, NOUS animons ») a ete mise a
l'epreuve en la LEVANT volontairement, puis en la retablissant. Verdict : elle tient, et on sait
maintenant **pourquoi**.

**Test 1 — un agent max fait TOUT (dessin + animation).** Resultat : animation riche
(6 couches simultanees, arc nuit->jour, parallaxe, grues a cycle de levage) mais **decor pauvre**
— hangars = rectangles a nervures, personnages illisibles. Repartition mesuree du code :
**459 lignes de matiere SVG contre 939 lignes d'animation**, et les 3 passes de correction ont
TOUTES porte sur la mecanique, aucune sur l'enrichissement du dessin.

**Test 2 — meme modele, meme duree, mais UNIQUEMENT dessiner.** Resultat sans commune mesure :
tole ondulee, enseignes, rouille, chalutier immatricule, 35-40 groupes adressables. Verdict Aziz :
« aussi bon que ce que nous produisons d'habitude ».

**Why:** ce n'est pas une faiblesse de dessin, c'est un **budget d'attention**. Demander
l'animation DEGRADE activement le dessin — arbitrage interne au modele. C'est une raison neuve,
qui s'ajoute aux 3 deja connues (tokens, vitesse, controle du rythme). Intuition d'Aziz,
confirmee par isolation d'une seule variable.

**How to apply — LE PARTAGE A 3 ETAGES :**
1. **Le modele dessine le DECOR VIDE** (statique, decoupe en `<g id>` nommes par plan de
   profondeur). Fable 5 reste le defaut : gagnant d'un **2e test aveugle** le 2026-07-28, sur
   decor riche cette fois (le terrain le plus favorable a Opus). Voir [[svg-generatif-2-appels-fusion-par-claude]].
2. **NOUS animons l'ambiance** : arc de lumiere, parallaxe, machines, bateaux, eau.
3. **Nos briques prennent les PERSONNAGES** : socle stick figure + [[brique-habillage-stick-figure]].
   Ne jamais laisser un modele reinventer le personnage — il produit plus faible que notre socle.

**Ce qu'il faut EXIGER du modele dessinateur** (sinon le decor est inexploitable) :
- decoupage par **plan de profondeur** (ciel / ville / eau / quai / batiments / avant-plan)
- chaque element animable **isole et nomme** (grue = mat + fleche + cable separes, avec pivots)
- les **coordonnees exportees en donnees** (ligne d'horizon, bande de circulation, ancrages)
- une **echelle personnage documentee** (hauteur px a l'avant et au fond)
- une **palette en constantes** (sinon la lumiere est figee dans chaque forme, arc jour/nuit
  impossible)
- ⭐ **exiger qu'il RENDE et REGARDE son travail** : c'est ce qui a fait la difference — un agent
  a trouve en regardant que son decor cachait completement le fleuve (bateaux echoues a terre).

Preuve : branche `rnd/port-decor-scene-vivante`, `PortVivant16x9.tsx` + `portDecorGroups.ts`.
