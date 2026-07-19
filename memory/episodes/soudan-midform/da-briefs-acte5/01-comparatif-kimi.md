**CLASSEMENT DES DIFFÉRENCES**  
*(du plus déterminant au moins important)*

1. **Grammaire narrative causale absente** — La référence raconte une histoire avec des *acteurs* (icônes de personnages), des *actions* (conflits, fumées, bases qui pop) et des *conséquences* (zones de contrôle qui s'étendent). Le nouveau montre du terrain vide : pas de protagonistes visibles, pas de timeline, pas de territorialité dynamique. C'est une carte géographique, pas une carte de guerre.

2. **Mouvements de caméra non motivés** — Dans la référence, chaque zoom/pan est *justifié* par l'apparition d'un nouvel élément (une base, un chef de guerre, une ville). Dans le nouveau, la caméra zoome dans le vide (00:06 : zoom out sur l'Afrique entière sans raison narrative, puis retour sur la Libye... pour montrer quoi ? Du sable).

3. **Densité informationnelle nulle** — La référence empile les couches : timeline + icônes 3D + portraits + zones de contrôle colorées + labels de villes. Le nouveau est monolithique : contours de pays + une ligne. L'œil n'a rien à scanner.

4. **Rythme temporel inexistant** — La référence utilise la timeline comme métronome (2013 → 2023). Le nouveau flotte dans le temps : on ne sait pas quand se passent les événements, s'ils sont passés ou présents.

---

**DIAGNOSTIC SPÉCIFIQUE DU BLOCAGE**

Le point bloquant est le **décollage sans focal**. À 00:06-00:12, la caméra quitte le Soudan pour un zoom out erratique qui révèle... l'espace vide entre la Libye et le Soudan. Puis elle se repositionne sur la Libye (00:12) sans qu'aucun élément narratif n'apparaisse. L'œil cherche un sujet, il ne trouve que des frontières.

**Pourquoi la référence fait mieux :**  
Elle ne bouge jamais sans *cible*. Quand la caméra zoome à 00:06, c'est pour révéler des bases militaires 3D. Quand elle pan à 00:13, c'est pour suivre l'apparition d'icônes de chefs militaires. Chaque mouvement est une *réaction* à un événement graphique. Le nouveau fait l'inverse : il bouge la caméra *d'abord*, puis espère que quelque chose apparaîtra (et rien n'apparaît, ou trop tard, ou trop petit).

---

**3-4 CORRECTIONS LES PLUS RENTABLES**

1. **Injecter des acteurs visuels** (SVG maison ou icônes)  
   - Placer un portrait/icône du général Haftar (Libye) et un icône des Forces de Soutien Rapide (Soudan) *avant* de tracer la ligne de connexion.  
   - **Effet immédiat :** La ligne n'est plus un trait abstrait mais un flux entre deux protagonistes.

2. **Animer le territoire** (teintes de contrôle Mapbox)  
   - Ajouter des zones colorées (même simples, semi-transparentes) qui s'étalent depuis les foyers de pouvoir.  
   - **Effet immédiat :** La carte devient dynamique, on voit le "terrain" changer, pas juste des frontières fixes.

3. **Chaîner les apparitions** (GeoFlowConnection + ArrivalLabel)  
   - Faire apparaître "Benghazi" *en même temps* qu'une icône militaire, *puis* tracer la ligne vers El-Fasher, *puis* faire apparaître le label El-Fasher.  
   - **Effet immédiat :** Le parcours a un sens (A → B), la caméra est tirée par la séquence.

4. **Geler les mouvements non justifiés**  
   - Supprimer le zoom out de 00:06. Rester sur le Soudan, faire apparaître un élément (icône), *puis* transitionner vers la Libye via un morphing ou un déplacement rapide (pas un drift lent dans le vide).

---

**VERDICT TRANCHÉ**

**Le VRAI problème n°1 :** L'absence de **sujets** sur la carte. La référence est peuplée (bases, personnages, fumées), le nouveau est un désert géopolitique. On ne peut pas faire de la "war map" sans montrer les belligérants.

**Le FAUX coupable :** Le stack technique. Non, le moteur fonctionne (les lignes tracées et les zooms sont fluides). Ce n'est pas une question de performance ou de palette, mais de *mise en scène*.

**Sauvable ?** Oui, par ajustements. Le concept (connexion Libye-Soudan via Abu Dhabi) est valide. Il faut simplement appliquer la grammaire de la référence :  
- *Qui* (icônes) → *Où* (labels + zones) → *Quand* (timestamp ou timeline) → *Quoi* (lignes de flux).  
Actuellement, le nouveau montre seulement "Où" (géographie) et "Quoi" (ligne), en oubliant les acteurs et la temporalité. Ajouter ces deux couches transformera immédiatement le morceau en narration fonctionnelle.