En tant que Directeur Artistique, je partage totalement l'analyse de ton réalisateur. Cette première scène a un potentiel narratif énorme (le paradoxe de la ressource), mais l'exécution actuelle est **scolaire et plate**. On est sur du "point sur une carte" façon journal télévisé des années 2000, pas sur du motion-design éditorial premium type Vox ou Johnny Harris. 

Voici mon audit et mes directives pour transformer cette séquence en une introduction implacable, en exploitant à 100% notre stack (Mapbox + Remotion).

---

### A. PROBLÈMES CONFIRMÉS & NUANCÉS (Audit)

1. **[00:00 - 00:32] L'intro "Morte" :** *Confirmé à 200%.* Placer des concepts abstraits ("Malédiction" vs "Miracle") sur une carte géographique est une erreur de grammaire visuelle. La carte est spatiale, l'idée est abstraite. Résultat : 32 secondes de vide visuel qui vont tuer la rétention (Watch Time).
2. **[00:32 - 01:19] Le syndrome du "Point + Étiquette" :** *Confirmé.* Sangomar, GTA, Yakaar... on répète trois fois la même animation (un point qui pulse, un texte qui pop). C'est redondant. Chaque gisement a une histoire différente (Pétrole national vs Gaz partagé vs Mystère absolu), le design doit refléter ça.
3. **[00:32+] Le bug de géo-ancrage (Drift) :** *Confirmé et critique.* Rien ne fait plus "amateur" qu'une UI qui glisse sur la carte pendant un mouvement de caméra. Il faut impérativement lier les coordonnées des popups aux coordonnées GPS via `map.project()` à chaque frame.
4. **[Tout le long] La carte grise et morte :** *Nuancé.* Le gris n'est pas un problème s'il sert de toile de fond pour faire exploser une couleur. Le problème ici, c'est qu'on ne combat jamais ce gris. Le Sénégal n'existe pas visuellement, il n'a pas de "poids".
5. **[01:19 - 01:40] Le graphique "60%" primaire :** *Confirmé.* Un chiffre jaune au milieu de l'écran n'est pas de la data-viz. Le texte "Moyenne pays émergents" écrit en tout petit ne crée aucun impact. Il faut spatialiser cette donnée ou la rendre cinétique.

---

### B. IDÉES CONCRÈTES PAR MOMENT (Le Storyboard Premium)

Voici comment on va restructurer la scène en appliquant notre doctrine : *Abstrait = Remotion / Spatial = Mapbox.*

#### 1. L'Intro : Le Choc des Récits (00:00 - 00:32)
* **Le geste visuel :** On sort de la carte. Full-screen Remotion. Écran scindé en deux. À gauche, une texture sombre, visqueuse (pétrole), avec une typographie cinétique agressive : **MALÉDICTION**. À droite, un fond lumineux, presque doré, avec le mot **MIRACLE**. 
* **La transition (Le Pont) :** À 00:28, quand la voix dit "La réalité se joue ailleurs", un faisceau laser fin vient découper l'écran en son centre. Ce laser trace en réalité la silhouette de la côte ouest-africaine. La texture abstraite se dissipe, la caméra plonge (pitch 60°) : **on entre dans la carte Mapbox**.

#### 2. Sangomar : L'Ancrage National (00:32 - 00:43)
* **Le geste visuel :** Dès qu'on arrive sur le Sénégal, le pays ne reste pas gris. Une onde remplit la silhouette du pays avec les couleurs du **drapeau sénégalais** (effet d'envahissement depuis la frontière terrestre vers la mer). 
* **Le gisement :** Pas un simple point. On trace un polygone hachuré (la vraie zone offshore). Un encart UI *glassmorphism* (fond flouté, bordure fine) s'ancre parfaitement au centre. Dedans : un mini-donut chart animé montrant le rapport de force : Woodside (Drapeau Australien, 82%) vs Petrosen (Drapeau Sénégalais, 18%). On montre le déséquilibre visuellement.

#### 3. GTA & Exports : L'Échelle Mondiale (00:43 - 01:04)
* **Le geste visuel :** La caméra Mapbox se déplace vers le nord. On trace une ligne laser lumineuse pour la frontière maritime Sénégal/Mauritanie. Le gisement GTA pulse à cheval sur cette ligne (couleur cyan/gaz).
* **Les exports :** Fini les petites lignes pointillées tristes. On utilise des flux de particules lumineuses (courbes de Bézier) qui partent de GTA. La caméra dézoome fortement. Lorsque les flux touchent l'Europe et l'Asie, ces continents s'allument en aplat de couleur (un bleu très sombre qui devient soudainement cyan). On ressent l'impact géopolitique (remplacer le gaz russe).

#### 4. Yakaar-Teranga : Le Mystère (01:04 - 01:19)
* **Le geste visuel :** Contraste total avec les deux premiers. La voix dit "Personne n'a décidé... il attend". La caméra replonge sur les côtes sénégalaises. Le gisement apparaît non pas comme un point fixe, mais comme une zone d'onde de choc lente (un pulse radar). 
* **L'UI :** Le popup *glassmorphism* s'ouvre, mais les données à l'intérieur sont cryptées/brouillées (effet glitch) ou remplacées par un gros point d'interrogation rougeoyant. Ça crée une tension immédiate : c'est "la plus grosse surprise".

#### 5. Le Paradoxe des 60% (01:19 - 01:40)
* **Le geste visuel :** On quitte la carte. Le chiffre "60%" apparaît en géant au centre de l'écran (Remotion). **Masque vidéo :** À l'intérieur des chiffres géants, on voit la carte du Sénégal tourner.
* **La Data-Viz :** Le 60% glisse sur le côté. Un diagramme de flux (Sankey) très épuré se déploie. On voit 100% de la richesse générée : 40% partent vers des drapeaux étrangers (Multinationales), 60% descendent vers le Sénégal. 
* **Le twist narratif :** Quand la voix dit "ce chiffre ne dit rien sur ce qui décide vraiment", la jauge des 60% se fait engloutir par une ombre noire ou se fragmente, préparant le spectateur à la révélation de la scène suivante.

---

### C. PRINCIPES DIRECTEURS (Amateur vs Premium)

Pour que tes motion-designers comprennent l'exigence, voici la grille de lecture :

| Ce qui fait "Amateur" (À bannir) | Ce qui fait "Premium" (Notre standard) |
| :--- | :--- |
| **L'UI flottante** (les textes glissent quand la caméra bouge). | **L'ancrage absolu** (`map.project()`). L'UI est plantée dans le sol géographiquement. |
| **La carte fond d'écran** (vue de haut, 2D, grise, statique). | **La carte environnement** (Pitch 3D, textures, drapeaux, pays qui s'allument au passage de la data). |
| **Le pléonasme visuel** (écrire le texte exact de la voix off). | **Le complément visuel** (la voix donne le nom, l'image montre l'échelle ou le rapport de force via un graphique). |
| **Les cuts secs** entre la carte et les graphiques. | **La continuité spatiale**. On zoome dans un détail de la carte pour révéler un graphique plein écran (masque/transition fluide). |
| **Le point unique** pour représenter un gisement. | **La zone hachurée / le polygone** pour montrer l'emprise réelle sur le territoire marin. |

**En résumé pour le client :** Le script est excellent, mais l'image actuelle est en retard sur le texte. En assumant des moments 100% motion-design (pour les concepts) et en dynamisant la carte Mapbox (drapeaux, UI ancrée, flux de particules), on va passer d'une "vidéo explicative" à un **véritable documentaire géopolitique premium**.