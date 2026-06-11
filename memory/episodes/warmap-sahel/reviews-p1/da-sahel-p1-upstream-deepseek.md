**REVIEW CRÉATIVE & TECHNIQUE — PLAN PARTIE 1 (2012)**  
*Analyse pré-code, stack SVG/encre/parchemin, caméra frame-driven*

---

### 1. ANGLES OBLIGATOIRES

#### 1. SPECTATEUR LAMBDA
**Ce qu’il comprend à chaque instant :**  
- **Beat 1.1** : La Libye pulse, un repère « 2012 » apparaît. Un spectateur non averti identifiera un pays en crise, mais sans label « Libye » il risque de ne pas situer la zone (la carte Sahel est centrée plus au sud). La timeline qui glisse est une bonne idée pour ancrer la chronologie.  
- **Beat 1.2** : Un flux descend vers le nord du Mali, des flammes s’allument sur trois villes. Le lien de causalité (effondrement → armes → feu) est visuellement fort. Cependant, un flux de particules seules peut être perçu comme un simple effet décoratif, pas comme un transfert d’armes et de combattants.  
- **Beat 1.3** : Apparition d’icônes villages et tensions. Le concept d’« État absent » est abstrait ; sans légende, le spectateur peut ne pas comprendre que ces icônes représentent un terreau préexistant. Il risque de penser que ce sont de nouveaux foyers de conflit créés par le flux.

**Où il décroche :**  
- Si le flux n’a pas de connotation clairement « militaire » ou « dangereuse » (ex. une couleur trop neutre, un mouvement trop uniforme).  
- Si les icônes de tension apparaissent sans contraste avec un « vide » visible. Le spectateur a besoin de voir l’absence avant de voir les tensions.

**Hiérarchie du regard :**  
- Le board clearing est excellent pour respirer. Ensuite, le pulse attire l’œil sur la Libye. Le flux guide naturellement le regard vers le sud. Mais à 1.3, le drift caméra doit être très lent et centré sur une zone où le « vide » saute aux yeux. Si la carte est trop chargée en frontières ou topographie, l’attention se disperse.

**Pistes concrètes dans notre stack :**  
- Ajouter un label « LIBYE » discret (encre, opacité 0.6) qui apparaît avec le pulse, puis s’estompe.  
- Pour le flux, ne pas utiliser que des particules : tracer un **trait principal animé** (stroke-dashoffset) avec une tête de flèche, et quelques particules erratiques autour. Lui donner une couleur « encre brûlée » (dark orange désaturé) pour évoquer la dangerosité.  
- Pour 1.3, créer un **masque de vide** : une texture de hachures légères ou un assombrissement très doux (opacity 0.15) appliqué aux zones rurales éloignées des capitales, qui apparaît avant les icônes. Ainsi, le spectateur voit d’abord « il n’y a rien ici », puis les tensions émergent de ce rien.

---

#### 2. NARRATION / SYNCHRO
**Alignement voix ↔ visuel :**  
- **69,9 s** : « Tout bascule en 2012… » → Le pulse Libye doit démarrer exactement à ce moment, avec l’apparition de « 2012 ». La timeline glisse. OK.  
- **75,5 s** : « Cet effondrement libère un flot… » → Le flux doit s’élancer à cet instant. Attention : si l’animation du flux dure plus de 3 secondes, elle débordera sur la phrase suivante. Il faut que le trait atteigne Kidal/Gao/Tombouctou en ~4 s max, avec les flammes qui s’allument progressivement pendant la fin de la phrase.  
- **84,5 s** : « si ces groupes s’enracinent… » → Ici, le visuel doit déjà montrer le contexte de vide. Le drift caméra doit être terminé avant cette phrase, ou commencer juste avant (pendant le silence éventuel). Les icônes villages/tensions apparaissent en synchronisation avec « État absent » et « tensions anciennes ».

**Risque de décalage :**  
- Si le flux est trop lent, la voix aura déjà introduit le Mali alors que le trait n’a pas encore atteint la zone.  
- Si le drift caméra est trop long, l’apparition des icônes sera en retard.

**Piste concrète :**  
- Utiliser un **timing précis** : à 75,5 s, lancer l’animation du trait (durée 3,5 s). À 79 s, les flammes commencent à apparaître (opacity 0 → 1 en 1 s). À 82 s, la caméra entame un lent zoom arrière/drift (durée 2,5 s) pour révéler la zone de vide. À 84,5 s, les hachures de vide sont déjà visibles, et les premières icônes de tension apparaissent.  
- La voix off peut marquer une micro-pause après « s’enflamme le premier » pour laisser respirer l’image avant le paradoxe.

---

#### 3. TRANSITIONS vs ÉTATS
**Le plan propose :**  
- Board clearing → pulse Libye → flux → flammes → drift + icônes.  
C’est une séquence de transformations, pas des diapositives. Bonne direction.

**Points de vigilance :**  
- Le passage du pulse au flux : si la caméra reste fixe sur la Libye puis saute brusquement vers le sud, on aura une coupure. Il faut un **mouvement de caméra continu** (pan sud lent) pendant que le flux s’élance.  
- L’arrivée du flux et l’allumage des flammes : risque de superposition d’animations (trait qui avance + flammes qui apparaissent). C’est acceptable si c’est fluide, mais il faut que le trait se termine avant que les flammes ne soient pleinement visibles.  
- La transition vers 1.3 : après les flammes, un zoom arrière progressif (Ken Burns) permet de passer du nord Mali à une vue plus large. Pas de cut sec.

**Piste concrète :**  
- Coder la caméra comme un rectangle de vue animé (viewBox en SVG) avec des transitions fluides (ease-in-out).  
- Pour le flux, utiliser un chemin SVG unique, animer `stroke-dashoffset` pour le trait principal, et `animateMotion` pour quelques particules.  
- Les flammes peuvent être des symboles SVG pré-dessinés, avec une animation d’opacité et de scale (de 0.8 à 1.0) pour un effet d’allumage.

---

#### 4. AI-SLOP
**Ce qui crie « généré par IA / amateur » dans le plan actuel :**  
- **Flux de particules** : si ce sont des centaines de petits cercles qui descendent de façon uniforme, cela évoque les templates « particle stream » des outils no-code.  
- **Flammes top-down** : si elles sont trop géométriques (triangles parfaits) ou symétriques, elles feront clipart.  
- **Icônes village/tension** : si elles sont piochées dans une banque d’icônes génériques (Material Design), elles jureront avec le style encre/parchemin.  
- **Typo « 2012 »** : un chiffre en Arial ou Helvetica serait un contresens esthétique.  
- **Surcharge** : vouloir montrer trop de villages/tensions d’un coup, sans respiration.

**Parades dans notre stack (SVG, opacité, couleurs, timing) :**  
- **Flux** : remplacer les particules par un **trait d’encre animé** (`stroke-dasharray` + `stroke-dashoffset`) avec une forme irrégulière (épaisseur variable grâce à un `stroke` de 2px avec des pointes à 4px par endroits, simulable via plusieurs paths superposés). Ajouter 5-6 particules seulement, avec des trajectoires légèrement aléatoires (mais toujours vers le sud).  
- **Flammes** : dessiner trois formes de flammes uniques en SVG (courbes de Bézier irrégulières), les animer avec une légère déformation de path (SMIL `animate` sur `d`) ou une rotation de quelques degrés. Couleur : `#B85C38` (orange brûlé) avec opacité 0.8.  
- **Icônes** : créer des mini-croquis SVG : un cercle tremblé avec une croix pour village, deux lignes ondulées qui se croisent pour tension. Les animer en `opacity` avec un léger décalage temporel.  
- **Typo** : utiliser une police serif à empattement (ex. « IM Fell English » ou « Cormorant Garamond ») ou dessiner « 2012 » en SVG avec un effet d’écriture (stroke-dashoffset).  
- **Espace négatif** : ne montrer que 3-4 villages clés et 2-3 symboles de tension maximum. Laisser la texture de vide parler.

---

#### 5. EXPERT DU MÉTIER
**Ce qu’un pro du genre (Kora & Cartes, Le Dessous des Cartes) jugerait raté ou améliorerait :**  
- **Le flux** : un pro éviterait un simple « effet particules » et utiliserait une **métaphore visuelle** : une traînée d’encre qui se propage comme une tache, avec des ramifications secondaires vers les villes. L’idée de « contamination » ou de « déversement » est plus forte.  
- **Le vide d’État** : un pro ne se contenterait pas d’icônes. Il créerait un **contraste narratif** : avant le flux, la zone apparaît normale (frontières, villes), puis après le passage du flux, les symboles d’État (capitales, routes) s’estompent ou se fissurent, laissant place à un espace « blanc » où ne subsistent que les tensions. Cela rendrait visible la causalité : le flux révèle le vide.  
- **Respiration** : après l’allumage des flammes, un pro laisserait un plan fixe de 2 secondes sur les villes en feu, sans mouvement, pour que le spectateur assimile. Puis un très lent zoom arrière introduirait le paradoxe.  
- **La timeline** : elle doit être un fil conducteur permanent, pas juste un gadget. Un pro l’intégrerait en bas de l’écran, discrète, avec une graduation qui avance.

**Piste concrète dans notre stack :**  
- Pour le flux « encre », utiliser un path avec `stroke-linecap="round"` et `stroke-linejoin="round"`, et animer `stroke-dashoffset` de 100% à 0%. Ajouter un second path plus fin avec un léger décalage pour l’effet « bavure ».  
- Pour le contraste État/vide : créer deux calques de symboles. Le calque « État » (bâtiments administratifs, routes) s’estompe (opacity 1 → 0.1) pendant le drift caméra. Le calque « tensions » apparaît en superposition. C’est techniquement simple (opacity transitions) et terriblement efficace.  
- La timeline : une ligne horizontale fine avec des graduations, animée en `stroke-dashoffset` pour l’avancée, et un curseur « 2012 » qui se déplace.

---

### 2. ÉVITER L’AI-SLOP (PRÉVENTIF, SUR LE PLAN)

| Risque anticipé | Parade concrète dans notre stack |
|----------------|----------------------------------|
| **Flux de particules générique** | Remplacer par un trait d’encre animé (stroke-dashoffset) avec 5-6 particules erratiques maximum. Le trait doit avoir une épaisseur variable (superposition de deux paths). |
| **Flammes trop propres** | Dessiner 3 flammes SVG uniques, asymétriques. Animer leur opacité et une légère déformation de path (SMIL). Couleur : `#B85C38`, jamais de jaune pur. |
| **Icônes « template »** | Créer des icônes croquis : traits tremblés, opacité non uniforme. Les faire apparaître avec un effet de dessin (stroke-dashoffset). |
| **Typo générique** | Utiliser une police serif à empattement ou un dessin SVG. Animer l’apparition de « 2012 » en écriture (dashoffset). |
| **Surcharge d’informations** | Limiter à 3 villes en feu, 4 villages, 3 symboles de tension. Tout le reste est estompé ou absent. |
| **Couleurs criardes** | Tout doit rester dans la palette parchemin désaturée. Le rouge/orange est un « orange brûlé » (#B85C38), le flux est un brun encre (#4A3B32). |
| **Absence d’espace négatif** | Laisser des zones de parchemin vierge autour des points d’intérêt. Ne pas remplir chaque recoin. |
| **Effet « diaporama »** | Toutes les transitions sont des animations continues (caméra, opacité, dashoffset). Aucun cut sec. |

---

### 3. EXPERT CONSTRUCTEUR (PRÉVENTIF, SUR LE PLAN)

#### 1. NOS TEMPLATES CHOISIS : 2ᵉ AVIS
Le plan mentionne `A1_REGION_PULSES`, taches d’influence, vignette.  
- **A1_REGION_PULSES** est parfait pour le beat 1.1 (pulse Libye). On peut le paramétrer avec une couleur encre sombre et une durée de 2 secondes.  
- **Taches d’influence** : pourraient servir à montrer la propagation du vide (1.3) plutôt qu’un flux. Une tache d’influence « négative » (couleur parchemin plus clair) qui s’étend autour des zones rurales serait plus parlante que des icônes seules.  
- **Vignette** : à utiliser avec parcimonie pour assombrir les bords et concentrer le regard.  

**Autres templates à envisager dans le catalogue Map Animation (si disponible) :**  
- **FlowLine** : pour le trait d’encre principal du flux.  
- **MarkerFlame** : pour les flammes géo-ancrées.  
- **WritingText** : pour « 2012 » et d’éventuels labels discrets.  
- **HatchPattern** : une texture de hachures animée pour le vide d’État.  

Si ces templates n’existent pas, on les code en SVG pur : `stroke-dashoffset` pour les flux et l’écriture, `opacity` + `transform` pour les flammes, `pattern` SVG pour les hachures.

#### 2. SI JE CONSTRUISAIS ÇA DE ZÉRO
**Ordre de construction :**  
1. **Fond de carte** : parchemin, frontières admin, topographie légère (grain).  
2. **Calques géo** : Libye, Mali, Burkina, villes clés (Kidal, Gao, Tombouctou, Mopti, Ouagadougou).  
3. **Board clearing** : transition d’opacité sur les jetons Acte 1 (0.2).  
4. **Beat 1.1** : pulse Libye (cercles concentriques, opacité décroissante). Apparition de « 2012 » (écriture). Timeline en bas.  
5. **Transition 1.1 → 1.2** : caméra pan sud lent (viewBox déplacée de la Libye vers le nord Mali).  
6. **Beat 1.2** : trait d’encre principal (stroke-dashoffset) le long d’un chemin Libye → Kidal → Gao → Tombouctou. Quelques particules. Arrivée → flammes (opacity + scale).  
7. **Respiration** : 2 secondes de plan fixe sur les flammes.  
8. **Transition 1.2 → 1.3** : zoom arrière/drift pour cadrer le centre Mali / nord Burkina. Pendant ce mouvement, estomper les symboles d’État (routes, capitales) et faire apparaître une texture de hachures légères.  
9. **Beat 1.3** : apparition progressive des icônes villages et tensions (dashoffset ou opacity), en synchronisation avec la voix.  

**Pièges à éviter :**  
- Mouvements de caméra trop rapides (max 0.5° par seconde).  
- Animations qui se chevauchent sans hiérarchie (toujours une seule transformation principale à la fois).  
- Oublier le grain papier global (un calque SVG `<image>` ou `<rect>` avec `mix-blend-mode: multiply` et opacité 0.3).  

#### 3. ENCHAÎNEMENT POUR LA COMPRÉHENSION (SPECTATEUR LAMBDA)
**Séquençage idéal :**  
1. **Contexte** : Libye pulse → le spectateur comprend qu’un événement majeur se produit.  
2. **Cause → conséquence** : un flux part de Libye et atteint des villes maliennes qui s’enflamment → lien direct.  
3. **Respiration** : plan sur les flammes (2 s).  
4. **Élargissement** : la caméra recule, révélant que ces villes sont dans une zone « vide » (hachures, absence de symboles étatiques).  
5. **Révélation du terreau** : des icônes de tensions apparaissent dans ce vide, montrant que le terrain était déjà fragile.  

**Où mettre les respirations :**  
- Après le board clearing (1 s de parchemin nu).  
- Après l’allumage des flammes (2 s).  
- Pendant le drift caméra (2,5 s de transition lente, sans nouvelle information).  

**Pourquoi ça fonctionne :**  
Le spectateur voit d’abord l’étincelle (Libye), puis la propagation (flux), puis l’impact (feu), et enfin la raison de l’impact (vide). C’est une narration visuelle progressive, sans texte.

---

### RÉPONSES AUX QUESTIONS PRÉCISES

**1. Le « flot d’armes » en particules SVG : lisible ou « effet TikTok » ?**  
Risque élevé d’effet TikTok si on utilise des dizaines de particules uniformes. **Alternative sobre** : un trait d’encre principal animé en `stroke-dashoffset`, évoquant un flux, avec 5-6 particules erratiques pour l’ambiance. Le trait doit avoir une couleur brun encre (#4A3B32) et une épaisseur variable. On peut ajouter un second trait plus clair en dessous pour un effet de « bavure ». C’est lisible à l’échelle 16:9 car le trait est fin mais continu, et le mouvement attire l’œil.

**2. Matérialiser « l’État absent + tensions anciennes » par la carte seule :**  
- **Texture de vide** : appliquer un motif de hachures légères (opacity 0.2) sur les zones rurales éloign