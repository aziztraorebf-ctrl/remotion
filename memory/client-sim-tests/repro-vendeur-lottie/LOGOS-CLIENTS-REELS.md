# LOGOS DE VRAIS CLIENTS — echantillon Fiverr (2026-08-28)

> ⭐ Idee d'Aziz, et c'est la meilleure de la session : aller chercher les logos que de VRAIS
> clients ont publies dans les avis, au lieu de choisir nous-memes les fichiers de test.
> Corrige le biais de fond : jusqu'ici c'est NOUS qui decidions de l'epreuve.

Sur disque : `public/_client-sim/_references/logos-fiverr/L1..L8`

## L'ECHANTILLON — 8 logos, 6 familles distinctes

| # | Logo | Famille | Couleurs | Trait fin | Difficulte attendue |
|---|---|---|---|---|---|
| L1 | Hinch Irish Whiskey | Embleme classique, texte en arc | 27 | **3,4 %** | Beaucoup de details fins |
| L2 | LoadUp | Logotype + fleche integree | 45 | 0,5 % | Facile |
| L3/L4 | Kanvas iA | Monogramme isometrique 3D + texte | 22-37 | 2,3 % | Volume a rendre |
| L5 | Tigerwild | Trait fin, paysage dans le corps d'un tigre | 43 | 0,4 % | **Le plus detaille** |
| L6 | Yoga with a View | Lettrage MANUSCRIT + feuillages | 22 | 2,4 % | Organique, calligraphie |
| L7 | Renard veterinaire | Mascotte illustree | **82** | 0,2 % | Illustration, pas logo plat |
| L8 | Fokus | Logotype + symbole infini + texte fin | 31 | 0,3 % | Texte tres fin |

Mesure : couleurs distinctes (quantifiees /32), part de pixels de bord (finesse du trait).

## ⛔ CE QUE CET ECHANTILLON CHANGE PAR RAPPORT AUX TESTS PRECEDENTS

Les 6 SVG testes avant venaient de MOI (j'avais demande "de la saleté de production", j'ai eu
des cas extremes, puis j'ai du corriger ma conclusion en testant des logos normaux).
Ici **ni le sujet ni le niveau ne viennent de nous** — meme principe que la repro Foster.

⚠️ Difference majeure : ce sont des **IMAGES** (jpg/png), pas des SVG. Les avis Fiverr montrent
le RESULTAT LIVRE, jamais le fichier source. Donc ce lot ne teste PAS le convertisseur
SVG->Lottie : il teste le chemin **IMAGE -> VECTORIEL**, c'est-a-dire le cas du client qui
n'a qu'un PNG. Cas frequent chez un petit client.

## OBSERVATION MARCHE D'AZIZ (a verifier, non mesuree)

Sur Fiverr, les logos **animes** semblent porter des prix nettement plus eleves et des vendeurs
plus experimentes que les logos **statiques**.
Explication plausible (non verifiee) : un logo statique se dessine dans Illustrator, des milliers
de gens savent le faire -> le prix s'effondre. Un logo anime demande une competence en plus que
beaucoup de designers de logos n'ont pas.
⭐ Effet secondaire plus important : **le client qui fait animer son logo l'a deja paye**. Il a
une identite visuelle, un budget, une entreprise qui tourne. Contexte d'achat different de
celui qui cherche un logo a 15 $.

## ETAT DU TEST
- [x] Telecharges, mesures, classes par famille
- [ ] Vectorisation Fable 5 (agent, gratuit) : LoadUp (facile) + Yoga (manuscrit) EN COURS
- [ ] Verdict : sait-on redessiner proprement depuis une image ?
- [ ] Non teste : Recraft `vectorize_image` (payant — demander a Aziz avant)

---

# ⭐⭐⭐ VERDICT : VECTORISER N'EST PAS GENERER (2026-08-28)

> **Recadrage d'Aziz, decisif.** J'allais faire redessiner un logo client par Fable 5.
> Sa question : *"reproduire a l'identique un logo qui existe deja, n'est-ce pas risque ?
> L'idee avec Fable n'est-elle pas de partir de zero ?"*

## LA DISTINCTION A NE PLUS JAMAIS CONFONDRE

| | Modele GENERATIF (Fable, Kimi, GLM) | VECTORISEUR (Recraft) |
|---|---|---|
| Ce qu'il fait | **Cree** depuis son entrainement | **Calcule** des contours depuis les pixels |
| Sur un logo existant | produit une INTERPRETATION | produit une COPIE |
| Quand l'utiliser | le client veut qu'on CREE | le client a DEJA son identite |

⛔ Un logo est l'identite d'une entreprise, payee a un designer. Le client ne veut pas
qu'on l'"ameliore" : il veut qu'on le TRANSPORTE fidelement. Un modele generatif qui
interprete au passage est un DEFAUT, pas une qualite.
⭐ Le vectoriseur est fidele **parce qu'il ne comprend rien** — il ne peut pas inventer.

## MESURE COMPARATIVE (2 logos clients reels, meme matiere)

| logo | Fable 5 | Recraft | groupes nommes |
|---|---|---|---|
| LoadUp (simple) | bon mais interprete | **0,1 %** d'ecart | Fable oui / Recraft AUCUN |
| Yoga (manuscrit) | **11,3 %** d'ecart | **0,6 %** d'ecart | idem |

⚠️ Piege de mesure rencontre : le SVG de Fable n'a pas de fond, ce qui donnait 98,9 %
d'ecart contre une image a fond blanc. Rendre avec `-b white` avant de conclure.

**Autocritique honnete de Fable, a son credit** : *"le lettrage manuscrit est la vraie
limite... ce n'est PAS la calligraphie brush de l'original — pas de pleins/delies, pas
les rebonds ni la texture fait main"*. Il s'est note 6,5/10 sur Yoga. Un agent qui
reconnait sa limite vaut mieux qu'un score flatteur.

## ⭐ LA CHAINE COMPLETE, PROUVEE DE BOUT EN BOUT

  image du client (PNG/JPG) --Recraft--> SVG --notre convertisseur--> Lottie

| Etape | Perte mesuree |
|---|---|
| Image -> vectoriel | 0,1 % (LoadUp) · 0,6 % (Yoga manuscrit) |
| Vectoriel -> Lottie | **0,01 %** · **0,00 %** ("transportable a l'identique") |
| Poids final | 12 Ko · 53 Ko |

=> **Un client envoie un PNG, on lui rend un Lottie fidele et leger.** Fonctionnel.

## ⛔ CE QUI MANQUE ENCORE : LE NOMMAGE

Recraft produit une geometrie parfaite mais **ZERO id, zero groupe** (59 formes anonymes
pour Yoga). Le fichier est juste, mais on ne peut pas animer "la fleur" ou "le mot YOGA".
C'est exactement le probleme resolu ce matin par `planche_calques.py` (rendre chaque forme
seule pour l'identifier), puis `group_layers.py` (appliquer la carte de noms).

**VOIE HYBRIDE RETENUE** : geometrie Recraft + identification par planche + nommage.
Fable garde sa place quand le client veut qu'on CREE, pas qu'on reproduise.

⭐ Apport inattendu de Fable : il a structure POUR L'ANIMATION (couronne, fleur-haut,
lettre-y/o/g/a separees) et a choisi des TRAITS plutot que des contours pleins, ce qui
permet l'animation d'ecriture progressive (trim path Lottie). Moins fidele, mais animable
autrement. A garder en tete comme technique, pas comme voie de reproduction.
