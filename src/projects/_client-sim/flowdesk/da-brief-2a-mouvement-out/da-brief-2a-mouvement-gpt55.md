## PARTIE A — Mouvements continus par panneau

### 1) PANNEAU CHAOS — f0 → f495 / 0s → 16,5s

| Élément du SVG à animer | Mouvement précis proposé | Durée/rythme | Statut |
|---|---|---:|---|
| Fragments blancs/orange dispersés à gauche | Tempête vectorielle permanente : chaque fragment a une dérive propre, rotation continue, micro-accélérations par vagues, avec trajectoires légèrement convergentes vers le centre droit. Les plus proches bougent vite, les lointains plus lentement pour créer une parallaxe. | Continu f0-f495. Rythme nerveux : cycles de 35-80 frames selon les couches. | Déjà faisable directement |
| Paquets/losanges sur les courbes vers le losange central | Les paquets ne restent jamais figés : ils glissent le long des courbes avec `stroke-dashoffset` + positions interpolées. Plusieurs vitesses : certains filent, d’autres hésitent, se croisent, repartent. | Continu, boucles toutes les 45-90 frames, désynchronisées. | Faisable mais demande plus de code |
| Courbes de flux à droite | Les lignes se comportent comme des “câbles sous tension” : léger oscillation sinusoïdale, dash animé, apparition de petites impulsions qui remontent vers le losange central. | Continu f0-f495, amplitude plus forte f0-f120 pour le “wow” initial. | Déjà faisable directement |
| Losange central / nœud d’absorption | Rotation très lente du losange interne, pulsation du losange externe, anneaux concentriques qui se dilatent puis disparaissent en boucle. Le centre donne l’impression de “tirer” le chaos. | Pulses toutes les 40-55 frames, rotation continue. | Déjà faisable directement |
| Séparateur vertical / zone frontière entre chaos et système | Ligne verticale animée comme une membrane : elle vibre légèrement, se courbe/respire, puis attire des fragments qui la traversent sous forme de paquets ordonnés. | Continu f0-f495, vibration plus intense f0-f180. | Faisable mais demande plus de code |
| Caméra virtuelle globale | Push-in immédiat dès f0, léger pan gauche→droite, puis contre-dérive. Aucun plan fixe : le cadre semble aspiré vers le losange. | f0-f495. Push fort f0-f90, dérive plus subtile ensuite. | Déjà faisable directement |
| Micro-éclats / traits fins de fond | Streaks courts qui traversent le cadre en diagonale, avec opacité basse, pour donner une sensation de vitesse sans ajouter de nouvelles couleurs. | Boucles rapides 20-50 frames, aléatoires mais frame-driven. | Déjà faisable directement |

---

### 2) PANNEAU BASCULE — f495 → f810 / 16,5s → 27s

| Élément du SVG à animer | Mouvement précis proposé | Durée/rythme | Statut |
|---|---|---:|---|
| Lignes de convergence à gauche | Flux permanent vers le goulot : animation `stroke-dashoffset`, légères ondulations de chaque ligne, avec décalage de phase pour éviter l’effet rigide. | Continu f495-f810. Vitesse forte au début, stabilisation après f650. | Déjà faisable directement |
| Points blancs / petits fragments sur les lignes | Les points voyagent réellement le long des chemins vers le tunnel. Ils se regroupent progressivement : trajectoires chaotiques au départ, puis plus alignées en entrant dans la capture. | Continu. Stagger toutes les 8-15 frames. | Faisable mais demande plus de code |
| Tunnel / cône de capture central | Le cône “respire” : largeur très légèrement modulée, lignes internes qui se décalent en phase comme une onde. Impression de matière de données qui se tend puis absorbe. | Continu f495-f810, respiration lente 80-120 frames. | Faisable mais demande plus de code |
| Anneaux concentriques à droite | Rotation lente + expansion/rétraction en boucle. Les anneaux réagissent quand des paquets arrivent : micro-pulse sur le rayon et l’opacité. | Continu, pulse toutes les 35-50 frames. | Déjà faisable directement |
| Formes piégées dans l’anneau droit | Les fragments orbitent autour du centre, puis se font capturer sur une trajectoire plus circulaire. Sensation : le chaos a basculé dans un système. | Continu f560-f810. | Faisable mais demande plus de code |
| Titre / ligne typographique | Plutôt qu’un simple affichage : le titre glisse très légèrement en tracking/position, et le trait orange se trace puis reste vivant avec un léger balayage. | Apparition f495-f545, puis micro-mouvement continu. | Déjà faisable directement |
| Caméra virtuelle | Pan latéral gauche→droite synchronisé avec la capture : on suit les flux qui entrent dans le tunnel. Petit zoom au passage du goulot. | f495-f810, accent f600-f690. | Déjà faisable directement |

---

### 3) PANNEAU MÉCANISME — f810 → f1105 / 27s → 36,8s

| Élément du SVG à animer | Mouvement précis proposé | Durée/rythme | Statut |
|---|---|---:|---|
| Source d’entrée à gauche / nœud lumineux | Transformer le vide gauche en vraie zone d’arrivée : un nœud source émet en continu des paquets vers le module. Cercles concentriques qui pulsent, lignes d’entrée qui tremblent légèrement puis se stabilisent. | Continu f810-f1105. Pulses toutes les 45-60 frames. | Déjà faisable directement |
| Module central de tri | Le module ne doit pas être immobile : très légère rotation/tilt simulée par transform, respiration de l’opacité des faces, balayage vertical interne comme un scanner. | Continu f810-f1105, rythme mécanique régulier. | Déjà faisable directement |
| 5 curseurs / aiguillages orange dans le module | Chaque slot agit comme un switch : mini-rotation ou translation du curseur, puis envoi d’un paquet vers une sortie. Les aiguillages s’activent en cascade de haut en bas, puis se réinitialisent. | Cycle complet 90-120 frames, répété 2-3 fois. | Déjà faisable directement |
| Trajets sortants vers les cibles à droite | Chaque chemin est animé par dash + paquets qui circulent. Les flux ne partent pas tous en même temps : alternance email/chat/document pour faire sentir le tri automatique. | Continu, départs stagger toutes les 12-20 frames. | Faisable mais demande plus de code |
| Cibles circulaires à droite | Anneaux rotatifs, ticks radiaux qui tournent, pulse quand un paquet arrive. Chaque cible confirme une “classification” sans texte additionnel. | Continu, pulse à chaque arrivée. | Déjà faisable directement |
| Petites particules blanches/orange sur les lignes | Les particules accélèrent en sortie du module, puis ralentissent à l’approche des cibles. Cela donne une sensation de routage intelligent, pas de simple ligne décorative. | Continu f830-f1105. | Faisable mais demande plus de code |
| Cubes/fantômes en bas gauche | Les formes fantômes remontent lentement en parallaxe, très basse opacité : elles occupent le vide gauche sans voler l’attention. | Continu, dérive lente 160-220 frames. | Déjà faisable directement |
| Caméra virtuelle | Départ plus à gauche pour montrer l’entrée, puis tracking fluide vers le module et les sorties. Le panneau devient une traversée, pas une image fixe. | f810-f1105. Pan principal f810-f930, settle f930-f1105. | Déjà faisable directement |

---

### 4) PANNEAU RÉSOLUTION — f1105 → f1474 / 36,8s → 49,1s

| Élément du SVG à animer | Mouvement précis proposé | Durée/rythme | Statut |
|---|---|---:|---|
| Paquet entrant sur la trajectoire courbe | Le paquet suit la courbe vers l’anneau, mais avec vitesse variable : arrivée élégante, léger ralentissement au point de jonction, puis insertion dans la boucle. | f1105-f1245 pour l’arrivée principale, puis boucle continue. | Faisable mais demande plus de code |
| Grand anneau de résolution | L’anneau se complète en stroke-dashoffset, puis continue de tourner très lentement. Pas d’arrêt après fermeture : il devient une boucle stable. | Tracé f1160-f1320, rotation lente f1320-f1474. | Déjà faisable directement |
| Centre lumineux / point de contrôle | Pulsation calme : cercles concentriques fins qui s’étendent, opacité douce, cadence régulière. Le chaos est transformé en respiration contrôlée. | Continu f1105-f1474, pulses toutes les 70-90 frames. | Déjà faisable directement |
| Ticks autour du cercle | Les ticks s’allument en séquence autour de l’anneau, comme une confirmation de fermeture. Après fermeture, ils continuent en balayage lent. | Séquence f1250-f1380, puis boucle lente. | Déjà faisable directement |
| Petit repère central à droite du cercle | Micro-orbite ou légère oscillation horizontale, comme un point de calibration. Il donne de la vie au vide intérieur sans perturber le calme. | Continu f1180-f1474. | Déjà faisable directement |
| Lignes horizontales basses | Balayage subtil de gauche à droite, comme une interface qui se stabilise. Elles peuvent apparaître par tracé progressif puis rester animées très lentement. | f1105-f1300 apparition, puis dérive lente. | Déjà faisable directement |
| Caméra virtuelle | Slow push-out ou settle : après l’énergie des panneaux précédents, la caméra ralentit visiblement. On sent l’ordre final s’installer. | Continu f1105-f1474, décélération progressive. | Déjà faisable directement |
| Titre / éventuel wordmark final Flowdesk si SVG disponible | Le texte final peut apparaître par masquage horizontal ou tracking subtil, synchronisé avec “Flowdesk. L’ordre, enfin visible.” Pas de pop statique : apparition fluide et premium. | f1360-f1474. | Déjà faisable directement |

---

## PARTIE B — Transitions entre panneaux

### Transition 1 — CHAOS → BASCULE / autour de f495

| Coupure | Enchaînement concret | Statut |
|---|---|---|
| f455-f525 | Le losange central du panneau Chaos devient le goulot du panneau Bascule. Les flux qui arrivaient depuis la gauche sont aspirés dans un whip horizontal. La membrane verticale du panneau 1 se resserre, puis s’étire en tunnel de capture. Les fragments chaotiques se transforment en points/paquets alignés sur les lignes du panneau 2. | Faisable mais demande plus de code |
| f480-f510 | Utiliser un wipe organique mais géométrique : les courbes orange/blanches du panneau 1 balaient l’écran et révèlent les lignes de convergence du panneau 2 par clip-path. | Faisable mais demande plus de code |
| f495 précis | Pas de fondu. Le centre d’énergie du panneau 1 doit “claquer” en tunnel : compression rapide, léger overshoot, puis absorption. | Déjà faisable directement |

---

### Transition 2 — BASCULE → MÉCANISME / autour de f810

| Coupure | Enchaînement concret | Statut |
|---|---|---|
| f770-f835 | L’anneau de capture du panneau 2 se contracte en un nœud source situé à gauche du panneau 3. Les paquets qui tournaient dans l’anneau sortent sous forme d’un faisceau unique qui entre dans le module de tri. | Faisable mais demande plus de code |
| f790-f820 | Le tunnel du panneau 2 se replie en perspective pour devenir la face d’entrée du module du panneau 3. Les lignes internes du cône deviennent les lignes de grille du boîtier. | Faisable mais demande plus de code |
| f810 précis | Cut masqué par mouvement : caméra suit un paquet qui traverse le goulot, le paquet devient le premier signal entrant dans le mécanisme. | Déjà faisable directement |

---

### Transition 3 — MÉCANISME → RÉSOLUTION / autour de f1105

| Coupure | Enchaînement concret | Statut |
|---|---|---|
| f1060-f1125 | Une des sorties du mécanisme devient dominante : les autres cibles se calment/fadent légèrement, tandis qu’un paquet sort de la cible principale et continue sa trajectoire vers le grand anneau de résolution. | Déjà faisable directement |
| f1085-f1120 | Les cibles circulaires du panneau 3 se superposent par scale/translation pour former le grand anneau du panneau 4. Le spectateur comprend que les sorties séparées se referment en un système unique. | Faisable mais demande plus de code |
| f1105 précis | La dernière impulsion arrivant dans une cible déclenche la fermeture de l’anneau du panneau 4 : même énergie, mais ralentie et maîtrisée. | Déjà faisable directement |

---

## PARTIE C — Le moment fort

| Moment | Intention | Exécution recommandée |
|---|---|---|
| f0-f90 / 0-3s | “Waouh” immédiat YouTube. Il ne faut pas attendre l’installation du panneau. | Démarrer déjà en mouvement : tempête de fragments, caméra en push-in, lignes qui s’allument, paquets aspirés vers le losange. Aucun fade lent. Dès la première seconde, le spectateur doit voir un système sous pression. |
| f455-f525 / transition Chaos → Bascule | Premier vrai pic narratif : le chaos bascule physiquement. | Compression des fragments vers un goulot, transformation des éclats en flux alignés. C’est le moment où l’animation prouve qu’elle n’est pas un slideshow. |
| f770-f835 / transition Bascule → Mécanisme | Pic de précision : capture → tri automatique. | Le tunnel devient entrée du module. Les paquets se distribuent en plusieurs routes. Rythme plus mécanique, plus contrôlé. |
| f1320-f1474 / clôture | Satisfaction finale premium. | Fermeture complète de la boucle, pulse calme du centre, apparition finale Flowdesk si disponible. Le mouvement continue, mais il devient lent, sûr, stable. |

**Courbe d’énergie globale recommandée :**  
Chaos très rapide → Bascule énergique mais plus directionnelle → Mécanisme cadencé et précis → Résolution lente, maîtrisée, respirante.

---

## PARTIE D — 3 idées bonus niveau “référence du genre”

| Idée bonus | Description | Statut |
|---|---|---|
| 1. Système de “paquets persistants” entre panneaux | Créer 8-12 paquets identifiés qui ne disparaissent jamais vraiment : ils changent de forme/échelle/opacité mais traversent toute la vidéo. Un fragment du chaos devient un point de capture, puis un signal trié, puis un paquet entrant dans la boucle finale. Cela crée une continuité haut de gamme. | Faisable mais demande plus de code |
| 2. Moteur de paths animé réutilisable | Construire un helper Remotion/SVG pour faire avancer des objets le long de n’importe quel path via longueur de tracé, `getPointAtLength`, offset, rotation tangentielle et vitesse variable. Cela rend les flux beaucoup plus premium que de simples translations. | Faisable mais demande plus de code |
| 3. Parallaxe globale multi-couches | Séparer chaque panneau en 4 profondeurs : fond étoilé/traits fins, lignes principales, paquets, éléments de premier plan. Chaque profondeur a une vitesse de caméra et une amplitude de drift différente. Effet 3D premium sans 3D réelle. | Déjà faisable directement |

---

## PARTIE E — Spécifique panneau MÉCANISME : résolution du vide à gauche

| Problème | Solution concrète | Statut |
|---|---|---|
| Module trop à droite, moitié gauche vide | Recomposer le panneau en 1920x1080 : placer le module autour de x≈640-760, pas collé à droite. Garder les destinations à droite x≈1450-1780. La gauche devient une zone d’entrée active, pas un fond vide. | Déjà faisable directement |
| Gauche sans contenu narratif | Ajouter/étendre un nœud source à gauche x≈140-220, y≈520, connecté au module par 2-3 faisceaux entrants. Ces faisceaux reprennent les paquets issus de la transition Bascule. | Déjà faisable directement |
| Composition trop statique | Faire voyager la caméra de gauche à droite : départ cadré sur le nœud source et les flux entrants, puis pan vers le module, puis légère ouverture vers les sorties. Même si la composition reste épurée, le regard traverse tout le cadre. | Déjà faisable directement |
| Vide bas gauche | Utiliser les cubes/fantômes déjà présents comme profondeur : dérive lente verticale, opacité subtile, parallaxe lente. Ils ne doivent pas devenir le sujet, seulement remplir l’espace avec une matière technique. | Déjà faisable directement |
| Manque de continuité avec panneau 2 | Faire arriver le tunnel de Bascule directement depuis la gauche du panneau 3 : l’anneau du panneau 2 se contracte en source d’entrée. Les paquets capturés deviennent les signaux qui alimentent les aiguillages. | Faisable mais demande plus de code |
| Module/connecteur perçu comme collé à droite | En plus de la recomposition, animer les sorties avec un léger éventail dynamique : les lignes respirent, les cibles pulsent, les paquets avancent. L’espace droit reste actif, mais la gauche devient le point de départ de l’action. | Faisable mais demande plus de code |