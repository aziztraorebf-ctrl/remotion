Voici une review détaillée, technique et directionnelle pour faire passer cette Partie 3 de "correcte mais figée" à "vivante et organique", tout en respectant strictement vos contraintes techniques (Remotion, SVG, Sprites) et votre charte "Parchemin".

---

### RÉPONSES AUX 6 QUESTIONS CENTRALES

**1. Réveiller les zones mortes (Ph2 et Ph5) avec un ancrage réel**
*   **Ph2 (Liptako - Naissance AES) :** L'idée A (faire converger une énergie) est la bonne. *Exécution technique :* Utilisez 3 tracés SVG (`<path>`) partant de Bamako, Ouaga et Niamey. Animez leur apparition via `stroke-dashoffset` (couleur encre brune ou or mat). Ces 3 lignes "dessinent" le chemin vers le centre du Liptako. **Causalité :** C'est *seulement* lorsque les 3 lignes se touchent au centre que le cercle Or apparaît et pulse. On passe d'un "pop" arbitraire à une construction logique.
*   **Ph5 (Statu Quo - 12s figées) :** L'erreur précédente était le mouvement "hors-sol". Il faut montrer l'**enlisement actif**. *Exécution technique :*
    *   *Sur Kidal :* Ajoutez un sprite de drapeau touareg clippé qui ondule très lentement (animation image par image de 4-5 frames en boucle lente). Cela montre que la ville est *tenue*.
    *   *Sur les bases ONU :* N'animez pas les bases elles-mêmes. Ajoutez un **radar de surveillance passif** : un cercle SVG très fin autour de la base, avec un `conic-gradient` (transparent vers blanc/sable très faible) qui tourne lentement (rotation continue). Cela raconte "l'ONU observe mais n'agit pas". C'est ancré, justifié narrativement, et ça meuble subtilement l'espace sans attirer l'œil outre mesure.

**2. Ce qu'il NE FAUT SURTOUT PAS toucher**
*   **Ph4 (Kidal) et Ph7 (Reprise Kidal) :** Le remplissage du polygone avec le drapeau malien révélé de bas en haut est une excellente trouvaille visuelle. L'onde de choc en encre pour marquer un événement *politique* ou *symbolique* (Ph4) fonctionne parfaitement sur une carte parchemin. Ne les modifiez pas, ce sont vos "hero moments".

**3. Diversifier le vocabulaire d'IMPACT**
L'onde de choc en cercles concentriques doit être réservée aux événements **immatériels/politiques** (annonces, traités, apparitions de villes).
Pour les événements **cinétiques/militaires** (Ph9 - Clash), il faut de la matière :
*   *Exécution :* Utilisez PixelLab pour générer une animation de "nuage de poussière d'impact" (dust kick-up) en 5-6 frames, vue de dessus, couleur sable/brun. Au moment où les jetons se percutent, jouez ce sprite à l'épicentre. Cela donne un côté "pions qu'on claque violemment sur un plateau poussiéreux".

**4. Jetons : Faut-il les animer en image-par-image ?**
**NON. C'est un piège.**
*   *Argument :* Votre format est une "carte de guerre". Les jetons sont des **pions de jeu de plateau** (des entités tactiques), pas des individus. Si le portrait à l'intérieur du jeton se met à courir ou tirer, vous cassez la métaphore du parchemin et de la carte d'état-major pour tomber dans le jeu vidéo mobile cheap.
*   *La solution :* Le "breathe" (scale) pour la vie au repos est suffisant. Pour la charge (Ph9), jouez sur l'**easing du déplacement Remotion**. Une charge n'est pas linéaire : utilisez un easing `easeInExpo` (démarre doucement, accélère violemment) suivi d'un arrêt brutal (impact) avec un très léger `spring` (rebond) au moment du blocage. C'est la *dynamique* du pion qui raconte l'action, pas son contenu.

**5. Utilisation des spritesheets Fumée + Explosion**
*   **Où :** Uniquement dans la **Ph9 (Attaques 2026)**.
*   **Comment :** Quand les jetons Jihadistes percutent les FAMa, déclenchez l'explosion (très brève, 3-4 frames, désaturée pour coller à la charte). *Surtout*, laissez la fumée (en boucle lente, opacité 40%, blend-mode `multiply`) persister sur la zone de front pendant que les jetons reculent. **Causalité :** Le clash crée la fumée, la fumée marque la zone de tension (le "brouillard de la guerre") même après le recul.

**6. Le piège du "Trop" (Garde-fous)**
Le risque majeur est de transformer une carte d'analyse en sapin de Noël.
*   *Garde-fou 1 (La règle du plateau) :* Si un élément ne pourrait pas exister physiquement sur une table d'état-major (pions, fils, encre, sable, lumière), il n'a rien à faire là.
*   *Garde-fou 2 (Hiérarchie du mouvement) :* Il ne doit jamais y avoir plus de **deux types de mouvements simultanés**. Si un jeton avance (action principale), le reste de la carte doit être quasi-statique. On n'anime le statu quo (radar ONU) *que* parce que rien d'autre ne se passe.

---

### ANGLES OBLIGATOIRES

**1. SPECTATEUR LAMBDA (Clarté et Regard)**
*   *Problème :* Dans la Ph9 (Clash), si les jetons rouges et bleus bougent en même temps, l'œil ne sait pas qui attaque qui.
*   *Piste :* Décalez les timings. Les rouges chargent (l'œil les suit) -> *pause de 0.5s* -> les bleus "popent" ou font un micro-mouvement vers l'avant pour bloquer -> Impact. Le regard doit faire du ping-pong, pas du strabisme.

**2. NARRATION / SYNCHRO (Le rythme)**
*   *Problème :* En Ph1, l'overlay est riche mais statique pendant 20s. Si la voix énumère des choses, l'image doit valider.
*   *Piste :* Synchronisez l'allumage des 3 drapeaux de l'overlay *exactement* sur les mots "Mali", "Burkina", "Niger" prononcés par la voix off. Chaque mot = un flag qui passe de 50% d'opacité/désaturé à 100% + léger scale.

**3. TRANSITIONS vs ÉTATS (Le Flow)**
*   *Problème :* Le passage de Ph7 (Reprise Kidal) à Ph8 (Flashback Moura) risque d'être un cut sec.
*   *Piste :* Utilisez la caméra frame-driven. Au lieu de "cuter" sur Moura, faites un *pan* rapide (glissement de caméra) de Kidal vers Moura, pendant que la carte se désature (transition vers le sépia) *durant* le mouvement. Le mouvement relie géographiquement les deux événements.

**4. EXPERT DU MÉTIER (La différence Pro/Amateur)**
*   *Problème :* Les ombres portées (drop shadows) sous les jetons et les overlays (visibles sur vos frames) sont noires et uniformes. Ça fait "CSS par défaut".
*   *Piste :* Un pro n'utilise jamais de noir pur pour une ombre sur du sable. Changez la couleur de vos ombres portées pour un brun très foncé (`#1A1005`), augmentez le blur, et utilisez un blend-mode `multiply` si possible dans votre stack. Les pions auront l'air posés *sur* la carte, pas flottant au-dessus d'un écran.

---

### SECTION OBLIGATOIRE — TEST AI-SLOP & FINITIONS

En regardant vos frames avec un œil critique (le fameux "hater" qui cherche l'IA ou l'amateurisme), voici ce qui trahit un rendu "généré/procédural" et comment le corriger dans votre stack :

**1. L'intégration du polygone "Drapeau" (Frame Ph7)**
*   *Le problème qui crie "Amateur" :* Le polygone aux couleurs du Mali (vert-jaune-rouge) est posé en aplat 100% opaque par-dessus la carte. Il efface complètement la topographie (frontières, rivières) en dessous. Ça fait "forme géométrique collée sur Paint".
*   *La piste (Stack-friendly) :* Appliquez une opacité de 85% au SVG du drapeau ET, si le CSS/SVG le permet, un `mix-blend-mode: multiply`. Si le blend-mode est impossible, baissez l'opacité à 70%. L'objectif est que les lignes de la carte (rivières, routes) restent visibles *à travers* la couleur de conquête. C'est la base de la cartographie pro.

**2. La typographie des badges (Frames Ph5, Ph7)**
*   *Le problème qui crie "Template" :* Les étiquettes "KIDAL" ou "KIDAL REPRISE" ont un fond blanc/crème très net avec une bordure fine et une ombre dure. Elles jurent avec l'esthétique "Parchemin" et ressemblent à des tooltips de site web.
*   *La piste (Stack-friendly) :* Retirez le fond blanc pur. Utilisez la couleur "Sable" de votre fond de carte, assombrie de 5% (`filter: brightness(0.95)`). Remplacez la bordure fine par une bordure légèrement plus épaisse, couleur "Encre brune" (`#2A1C0E`), et appliquez-lui une très légère irrégularité si vous générez le SVG, ou au moins arrondissez légèrement les angles (`rx="4"`).

**3. L'Overlay de la Ph2 (Frame Ph1/Ph2)**
*   *Le problème qui crie "Généré" :* La boîte de l'overlay est parfaitement rectangulaire avec une ombre portée basique. Elle flotte sans interaction avec le fond.
*   *La piste (Stack-friendly) :* Puisque vous êtes en charte parchemin, ajoutez un léger bruit de texture (un pattern SVG très discret en overlay) sur le fond de cette boîte, ou utilisez une bordure "Or mat" (`#C9A24B`) avec un double trait (un épais, un fin à 2px de distance) pour lui donner un aspect "document officiel" plutôt que "div HTML".

**4. Les Jetons (Toutes frames)**
*   *Le problème :* Les portraits générés (IA probable) sont très propres, mais les cercles qui les contiennent manquent de matérialité.
*   *La piste :* Ajoutez un "inner shadow" (ombre interne) subtil en SVG à l'intérieur du cercle du jeton. Cela donnera l'impression que le portrait est enchâssé dans une pièce de bois ou de métal, renforçant l'aspect "pion de jeu physique" et cassant l'effet "image clippée dans un rond".