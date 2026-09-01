⛔⛔ **SIGNATURE À RECONNAÎTRE : fichier valide + rapport annonçant « porté / OK » + RIEN à l'écran.** Quand ça arrive, ne pas re-vérifier l'élément — **il est juste**. Vérifier ce qui le RELIE au reste.

**Why** : 4 occurrences en 2 jours (25-26/08/2026, convertisseur SVG→Lottie), toutes de la même famille, aucune détectée par les tests ni par le rapport de conversion :

| # | Ce qui était annulé | Le câblage fautif |
|---|---|---|
| 1 | contours réduits de moitié (5 px → 2 px, 7030 → 3475 pixels sombres) | **ordre de peinture** : dans un calque Lottie le PREMIER groupe est peint EN DERNIER — le remplissage recouvrait le trait |
| 2 | flamme qui ne s'anime pas | **ancre** à `[0,0]` = coin de l'écran : la forme se déployait depuis le bord au lieu de grandir sur place |
| 3 | animation transcrite mais figée | **fenêtre temporelle** : keyframes à t=100 sur un calque dont la plage `ip/op` s'arrêtait à 60 |
| 4 | rendu à 99,54 % d'écart, 1,1 % de pixels encrés | **dispatch par type** : le tri des styles ne connaissait que `fl`/`st`, le type `gf` (dégradé) était silencieusement jeté |

| 5 | 23 opacités animées et 9 tracés **perdus** au regroupement (26/08) | **copie partielle** : `group_layers.py` ne recopiait que les FORMES et jetait `ks`, où vivent les animations |
| 6 | le player **FIGE**, `DOMLoaded` jamais émis, zéro erreur console (26/08) | **collision de clé** : `nm` dupliqué dans le tableau `d` d'un trait — lottie-web en fait une clé d'objet (`Object.defineProperty`) |

Dans les 6 cas la géométrie, les couleurs et les keyframes étaient **exactes**. C'est l'aiguillage qui les annulait.

⛔⛔ **LA 5e EST LA PLUS SOURNOISE, PARCE QU'ELLE A PASSÉ LA MESURE.** Le fichier restait valide, et
`check_animation.py` **comptait des frames distinctes et concluait « ça bouge »** — c'était vrai :
quelque chose bougeait. Mais **tout apparaissait EN MÊME TEMPS** : le triangle de la courbe visible
dès la frame 0 au lieu de la 89, la flamme allumée avant que la maison existe.
**L'HISTOIRE ÉTAIT DÉTRUITE PENDANT QUE LA MESURE DISAIT OK.** Seule la planche REGARDÉE l'a montré.
→ Preuve du correctif : après fix, les empreintes des frames 29/60/251 sont **identiques** à celles
de la version non groupée.

⭐ **Le critère de vérification qui manquait** : « est-ce que ça bouge ? » est une question **trop
faible**. La bonne est **« est-ce que ça bouge AU BON MOMENT ? »** — comparer l'ORDRE et les
INSTANTS d'apparition, pas la présence de mouvement. Une mesure qui **agrège sur toute la scène**
(« N frames distinctes », « X % de pixels encrés ») ne peut structurellement pas voir un
effondrement de la chronologie.
⚠️ Même famille, même jour : le taux de pixels encrés restait à ~46 % du début à la fin du Gazoduc
A4 — ce n'était PAS une scène figée (les pays **changent de couleur** sur un fond déjà encré, ils
n'ajoutent pas de surface). La mesure d'encre seule aurait fait conclure à tort.

**How to apply** — face à un livrable valide qui ne montre rien, vérifier dans cet ordre :
1. **Ordre de composition** — qui est peint par-dessus qui ? (⚠️ souvent l'inverse de l'intuition)
2. **Origine / ancre / repère** — la transformation pivote-t-elle sur l'objet, ou sur le coin du monde ?
3. **Fenêtre temporelle** — l'élément EXISTE-t-il encore au moment où on l'anime ? (plages `ip/op`, `from`/`durationInFrames`)
4. **Dispatch par type** — un `if type in (...)` quelque part connaît-il le nouveau type ?
5. **Copie partielle** — en fusionnant/regroupant/dupliquant, ai-je recopié la GÉOMÉTRIE en
   oubliant ce qui l'anime (le bloc de transformation) ? Le résultat bouge encore, mais plus au
   bon moment.
6. **Collision de clé** — un champ qui RESSEMBLE à un libellé (`nm`, `id`, `name`) est-il utilisé
   comme identifiant par le lecteur ? Dupliqué, il fige tout **sans erreur**.
   Cf. [[feedback_champ-decoratif-peut-etre-une-cle-blocage-silencieux]].
7. **D'où vient la CONSTANTE** que j'utilise pour reconstruire ? ⛔ 26/08 : bornes d'une courbe
   lues dans le **FICHIER CONVERTI** (`X1=984`) au lieu du **CODE SOURCE** (`1560`) — elle
   s'arrêtait à mi-parcours, sans erreur. Un converti porte des valeurs **dérivées** (cadrage,
   échelle) : ce sont des SORTIES, pas des paramètres. **Remonter à ce qui les DÉCLARE.**
   ⚠️ Corollaire : un **commentaire** du code source peut lui aussi être périmé (celui du Gazoduc
   A5 affirmait que le fil « ne croise JAMAIS la courbe » — faux dans le rendu ; Aziz avait raison
   contre lui). Le code fait autorité sur les **valeurs**, le RENDU sur le **comportement**.

⛔ **Un test unitaire sur l'élément passe TOUJOURS dans ces 4 cas.** Seul le RENDU les attrape : rendre et REGARDER, ne jamais conclure sur un rapport de conversion. Cf. [[animation-vs-image-fixe-mesurer-frames-uniques]] pour le cas où c'est la MESURE elle-même qui ment.

⭐ **Vaut hors Lottie** : Remotion (`<Sequence>` qui coupe un enfant), SVG (`<defs>` jamais référencé), Mapbox (couche ajoutée avant son style), tout pipeline avec un aiguillage par type.
