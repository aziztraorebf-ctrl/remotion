**DIRECTEUR ARTISTIQUE — REVIEW PROTOTYPE ACTE 1**
*Chaîne : Kora & Cartes — Sujet : Rivalité AAGP vs TSGP*
*Date : Review technique sur prototype 16s / Cible : Acte 1 final 84.68s*

---

## 1. RÉPONSE AUX 3 PRIORITÉS

### A. DYNAMISME (La caméra ne s'arrête jamais)
**Diagnostic actuel :** Le prototype souffre d'une inertie narrative. Entre frame 120 et 240 (5 secondes), le globe est figé sur le Nigeria avec seulement un changement de sous-titre. C'est une "diapo" — le pire ennemi du mid-form.

**Solution pour les 84.68s :**
Adopter une **logique de "caméra haletante"** : le globe ne fait pas que zoomer/dézoomer, il *pivote* en permanence. Utilisez la projection orthographique D3 comme une caméra sur stabilisateur :
- **0-8s** : Rotation rapide depuis l'Atlantique vers le Nigeria (le globe "tourne" pour nous montrer le sujet).
- **8-15s** : Zoom-in serré sur le Nigeria avec un **micro-mouvement de respiration** (oscillation lente ±2° sur la rotation) pour éviter le figé.
- **15-25s** : Quand les deux tracés apparaissent, la caméra fait un **truck arrière synchronisé** avec le stroke-dashoffset des lignes — on voit les deux chemins se dessiner en même temps que le champ s'élargit.
- **25-40s** : **Split-screen virtuel** : pas un cut, mais une accélération de la rotation du globe qui fait "swipper" la vue entre l'itinéraire côtier (Maroc) et saharien (Niger) — comme si on tournait la tête d'un côté puis de l'autre.
- **40-84s** : Climax avec un **zoom out explosif** : le globe se rétracte pour montrer l'Europe entière, les deux lignes convergent symboliquement vers le marché européen (un halo rouge pulsant sur l'Europe pour l'urgence énergétique).

### B. LISIBILITÉ / COMPRÉHENSION SPECTATEUR
**Risque identifié :** Dans le prototype, les deux tracés (doré vers Espagne, orange vers Algérie) apparaissent simultanément et sans distinction sémantique claire. Un spectateur lambda ne sait pas quel est quel projet, ni pourquoi l'un est une ligne droite et l'autre une courbe.

**Hiérarchie du regard à implémenter :**
1. **Codage couleur strict :** 
   - AAGP (côtier) = **Or satiné** (#D4AF37), trait plein, épaisseur 3px, style "diplomatie/luxe".
   - TSGP (saharien) = **Orange brûlé** (#CC5500), trait pointillé (dasharray 8,4), épaisseur 3px, style "chantier/risque".
   - Jamais les deux mêmes styles.

2. **Focus temporel :** Quand la narration dit "L'un a misé sur...", **toute la carte s'assombrit sauf le tracé concerné** (masque SVG noir à 70% d'opacité sur tout le groupe pays sauf la route active). Le spectateur n'a physiquement pas le choix de regarder ailleurs.

3. **Labels animés :** Les noms "AAGP" et "TSGP" ne doivent pas être des textes statiques mais des **étiquettes qui glissent le long des tracés** (textPath SVG) et s'arrêtent à la position la plus lisible.

### C. IMPACT DU TOUR (Le "Hook" visuel manquant)
**Ce qui manque :** Le prototype a un beau globe, mais il n'y a pas de **moment de bascule** où l'on réalise la contradiction. Le script parle de "guerre silencieuse" et de "un seul verra le jour" — il faut un geste visuel qui traduise cette exclusivité.

**Proposition : Le "Clash" des pipelines (frame 50-60 du script) :**
Au moment de "ils se font une guerre silencieuse", les deux tracés, jusqu'alors pacifiques, doivent **entrer en collision symbolique** :
- Les deux lignes (dorée et orange) arrivent vers le centre de l'écran.
- Elles ne se touchent pas, mais un **effet d'interférence** apparaît : des particules SVG (cercles blancs avec opacité pulse) émergent des deux côtés et se repoussent au milieu.
- La caméra fait un **zoom micro sur le point de divergence** (le Nigeria) avec un effet de "tremblement" simulé (rotation rapide ±0.5° sur 3 frames) comme si la terre résistait à cette tension.

---

## 2. LES 5 ANGLES OBLIGATOIRES

### 1. SPECTATEUR LAMBDA (Qui ne connaît pas le sujet)
**Décrochage critique à prévoir :** Frame 180-250 du prototype. Le spectateur voit deux points jaunes apparaître sur le Nigeria, puis deux lignes partent. Mais il ne comprend pas :
- Pourquoi une va vers l'Espagne et l'autre vers l'Algérie ?
- Quelle est la différence entre les deux ?

**Piste concrete :** Introduire un **"ping" de couleur différente** à chaque destination. Quand la ligne dorée touche l'Espagne, le pays ne se remplit pas juste — il **pulse** et un **label "Marché Européen"** apparaît avec une icône de flamme (gaz). Quand la ligne orange touche l'Algérie, c'est un hub différent (icône usine/raffinerie). Il faut distinguer *destination finale* vs *point de transit*.

### 2. NARRATION / SYNCHRO
**Décalage actuel :** Le texte "Imaginez deux immenses tuyaux..." apparaît alors que visuellement on ne voit encore aucun tuyau (juste le contour du Nigeria). C'est une **redondance en décalage** : la voix parle de l'avenir (les tuyaux) pendant que l'image montre le présent (le pays).

**Correction :** 
- **Beat 1 (0-3s)** : Voix dit "Imaginez deux immenses tuyaux" → Visuel : silhouette fantôme (stroke gris clair, opacity 0.3) des deux tracés apparaît en fond, floue (simulé par opacité basse), comme un projet.
- **Beat 2 (3-8s)** : Voix dit "qui partent du même pays" → Visuel : Zoom serré sur le Nigeria, le contour se trace en vert vif (couleur du drapeau).
- **Règle d'or :** Chaque phrase du script doit avoir son **équivalent visuel unique**. Si la voix dit "Même point de départ", on voit **un** point qui pulse. Si elle dit "Même destination", on voit **un** point européen qui pulse. Jamais tout en même temps.

### 3. TRANSITIONS vs ÉTATS
**Problème :** Le prototype passe d'un état (Nigeria seul) à un autre (Nigeria + deux lignes) sans transition cinématique. C'est un cut.

**Solution stack SVG :**
Utiliser la **rotation de la projection D3 comme moteur de transition**. Au lieu de couper :
- Faire **tourner le globe** (interpolation de la rotation [0,0] à [10,-5]) pendant que les nouveaux éléments (les lignes) fade-in.
- Les éléments qui sortent du champ de vision (l'Afrique de l'Est) s'estompent naturellement via le **clipping path du globe** (masque circulaire), créant une disparition douce sans cut.

### 4. AI-SLOP (Ce qui crie "amateur")
**Signes à éliminer dès maintenant :**
- **Easing linéaire sur le zoom :** Dans le prototype, le `scaleMul` semble progresser linéairement (frame 0-100). C'est robotique. Passer sur une **courbe de Bézier custom** (ease-in-out-back sur les arrivées, ease-out-expo sur les départs).
- **Couleurs par défaut :** Le beige des pays et le bleu marine de l'océan sont trop "carte scolaire". Passer sur un **beige poussiéreux** (#C9B99A) et un **bleu ardoise profond** (#1A2332) avec une **texture de bruit** (noise SVG filter à 2% d'opacité) pour casser le plat.
- **Typo sans personnalité :** Le texte blanc avec ombre noire est standard. Opter pour un **condensé sans-serif** (style Bebas Neue ou Oswald) avec un **léger tracking** (espacement des lettres augmenté de 5%) pour l'uppercase — plus cinéma, plus "Souverain".
- **Particules qui ne servent à rien :** Les étoiles fixes en fond vont très bien, mais si elles ne bougent pas du tout (même un lent drift), ça fige. Les animer avec un **déplacement subtil** (translateX/Y sur 1000 frames) via le PRNG seedé.

### 5. EXPERT DU MÉTIER (Différence pro/amateur)
**Ce qui manque pour être "broadcast quality" :**
- **Profondeur de champ simulée :** Même sans vraie 3D, on peut simuler un DOF en ajoutant un **halo lumineux** (radial gradient blanc à 10% opacité) autour du pays focal, et assombrissant les pays périphériques (darken blend mode sur un overlay noir).
- **Système de grille invisible :** Johnny Harris utilise souvent une **ligne de flottaison** horizontale imaginaire. Ici, le Nigeria devrait toujours rester dans le **tiers inférieur** de l'écran, jamais centré mécaniquement. La règle des tiers appliquée à la cartographie.
- **Anticipation des mouvements :** Avant qu'une ligne ne parte du Nigeria, faire apparaître un **"ghost point"** (point blanc qui pulse 3 fois) exactement au point de départ pour préparer l'œil du spectateur.

---

## 3. SECTION EXPERT CONSTRUCTEUR

### 1. SI TU CONSTRUISAIS L'ACTE 1 COMPLET (84.68s) À PARTIR DE CE PROTOTYPE

**Séquence détaillée (Frame-driven intention) :**

**00:00 - 00:05** — *"Imaginez deux immenses tuyaux..."*
- **Visuel :** Vue depuis l'espace (globe à scale 1.0). Rotation lente. Deux lignes fantômes (gris clair, opacity 0.2) apparaissent déjà tracées en fond, comme un projet futur.
- **Action :** Zoom progressif vers l'Afrique de l'Ouest. Le continent émerge de l'ombre (shader SVG simulant un soleil levant sur la face visible du globe).

**00:05 - 00:12** — *"...qui partent du même pays."*
- **Visuel :** Zoom accéléré (ease-in) sur le Nigeria. Le contour se trace (stroke-dashoffset) en **blanc chaud** (#FFF8E7) puis se remplit du drapeau nigérian avec un effet de "rideau" (clip-path qui s'ouvre verticalement).
- **Camera :** Micro-oscillation (breathing) une fois le zoom terminé.

**00:12 - 00:18** — *"Ils partent exactement du même endroit : les immenses réserves du Nigeria."*
- **Visuel :** Un **halo doré** pulse depuis le centre du Nigeria (3 pulsations). Le texte "Réserves de gaz" apparaît brièvement avec un chiffre choc (ex: "209 milliards de m³") en overlay, style Vox.

**00:18 - 00:25** — *"Ils visent exactement le même client : le marché européen..."*
- **Visuel :** La caméra fait un **pan arrière** (zoom out + rotation vers le Nord). L'Europe apparaît en haut de l'écran. Un **cercle rouge pulsant** apparaît sur l'Espagne/France (le marché). Deux lignes (toujours fantômes) partent du Nigeria vers ce cercle.

**00:25 - 00:32** — *"Même point de départ. Même destination. Même urgence."*
- **Visuel :** Séquence de **3 cuts rapides** (0.8s chacun) :
  1. Gros plan sur le Nigeria (point de départ)
  2. Gros plan sur l'Espagne (destination)
  3. Vue globale avec un **effet de chaleur** (wavy distortion SVG sur les contours) autour de l'Europe pour symboliser l'urgence.
- **Transit :** Pas de cut sec, mais un **flash blanc** (rectangle blanc full screen à 100% opacity pendant 2 frames) entre chaque plan pour le rythme.

**00:32 - 00:40** — *"Et pourtant… ces deux projets ne se parlent pas."*
- **Visuel :** Les deux lignes fantômes deviennent **opauses** mais prennent des couleurs différentes (Or vs Orange). Elles sont côte à côte mais une **barrière invisible** (ligne blanche verticale qui clignote) les sépare au milieu de l'écran.

**00:40 - 00:50** — *"Ils ne partagent quasiment aucun kilomètre de tracé."*
- **Visuel :** **Split screen dynamique** : La caméra se divise virtuellement. À gauche, le tracé côtier (AAGP) se dessine en S dorée passant par le Maroc. À droite, le tracé saharien (TSGP) se dessine en ligne droite orange vers l'Algérie. Les deux animations sont synchronisées mais spatialement séparées.

**00:50 - 01:00** — *"Et pour couronner le tout, ils se font une guerre silencieuse."*
- **Visuel :** Les deux lignes, maintenant complètes, convergent vers le centre de l'écran. Un **effet d'interférence** : des particules (cercles blancs) naissent des deux lignes et se repoussent au milieu, créant une zone de "tension" blanche. La caméra **tremble** légèrement (rotation rapide aléatoire ±0.3°).

**01:00 - 01:08** — *"Selon toute logique, un seul des deux verra vraiment le jour."*
- **Visuel :** Un **VS** (typo épaisse, rouge) apparaît entre les deux lignes. Puis un **cercle de progression** se remplit à 50% autour de chaque logo de projet, suggérant que la compétition est ouverte.

**01:08 - 01:18** — *"C'est l'histoire de deux paris radicalement opposés."*
- **Visuel :** Transition par **rotation du globe** : on passe de la vue globale à une vue de profil (l'Atlantique au centre). Les deux tracés sont vus de côté, montrant leur différence de profondeur (l'un côtier, l'autre continental).

**01:18 - 01:28** — *"L'un a misé sur les grands partenaires internationaux..."*
- **Visuel :** Focus sur le tracé doré (AAGP). Des **icônes de banques** (bâtiments stylisés) apparaissent le long du tracé au Maroc et en Espagne. Le trait devient plus épais (5px) et brillant (glow SVG).

**01:28 - 01:38** — *"L'autre a misé sur ses voisins, sur la vitesse, et sur un tracé droit à travers le Sahara."*
- **Visuel :** Focus sur le tracé orange (TSGP). Des **icônes de chantier** (grues) apparaissent au Niger. Le trait devient pointillé mais avec une **animation de dash-offset rapide** suggérant la vitesse/construction en cours.

**01:38 - 01:45** — *"Un seul de ces deux tuyaux a vraiment des chances d'exister."*
- **Visuel :** Retour à la vue globale. Les deux tracés clignotent alternativement (AAGP visible, TSGP fade out, puis inverse). Suspens maximal.

**01:45 - 01:54** — *"Voici la course secrète pour devenir le futur maître du gaz africain."*
- **Visuel :** Le titre de la vidéo apparaît en **typo massive** par-dessus la carte, avec un **masque de transparence** qui laisse voir le globe en fond. Les deux tracés restent visibles mais estompés (opacity 0.3) sous le texte.

### 2. PIÈGES À ÉVITER DÈS MAINTENANT

**Piège du "Drapeau Kitch" :** Le remplissage des pays avec les drapeaux réels (Espagne, Algérie) risque de créer un effet "carte de Risk" amateur. 
- **Correction :** Ne pas remplir tout le pays. À la place, utiliser le drapeau comme **texture le long du tracé** (un bandeau qui suit la ligne) ou comme **pastille** au centre du pays avec un halo de la couleur du drapeau.

**Piège du "Globe trop parfait" :** La sphère lisse donne un aspect "clip Art".
- **Correction :** Ajouter une **grille de latitude/longitude très subtile** (stroke blanc, opacity 0.05) sur le globe, et un **terminator** (ligne de partage jour/nuit) qui bouge légèrement pour donner vie.

**Piège de la "Sur-information" :** Ne pas montrer tous les pays traversés dès le début.
- **Correction :** Révéler les pays un par un, **synchronisés avec la narration**. Quand on parle du Maroc, seul le Maroc s'allume sur la carte (brightness 1.2), les autres sont en gris.

### 3. ENCHAÎNEMENT POUR LA COMPRÉHENSION

**La règle du "Un élément à la fois" :**
- **Frames 0-150 :** Un seul sujet : le Nigeria. Rien d'autre ne bouge.
- **Frames 150-300 :** Deux sujets : les deux tracés. Mais pas en même temps : d'abord AAGP (5s), puis TSGP (5s), puis les deux ensemble (5s).
- **Frames 300-500 :** Le conflit. Les deux tracés + les éléments de tension (particules).

**Les respirations :**
- **Respiration visuelle à 00:25** : Après le "Même point de départ...", une pause de 1 seconde où la caméra s'arrête de bouger. Le spectateur assimile.
- **Respiration à 00:50** : Avant le "guerre silencieuse", un fondu au noir très bref (6 frames) pour marquer la bascule narrative (de la description au conflit).

**Hiérarchie narrative :**
1. **Quoi ?** (Deux tuyaux) → Visuel : Deux lignes
2. **Où ?** (Nigeria → Europe) → Visuel : Trajectoires
3. **Comment ?** (Deux stratégies) → Visuel : Détail des tracés
4. **Pourquoi c'est important ?** (Un seul survivra) → Visuel : Clash/tension

---

**CONCLUSION OPERATIONNELLE**

Le prototype est techniquement solide (la projection D3 fonctionne, les tracés se dessinent), mais il manque de **narration visuelle agressive**. Pour passer à 84.68s sans perdre le spectateur :

1. **Rythmer par la caméra** : La rotation du globe doit être votre outil de transition principal, pas un simple zoom.
2. **Différencier sémantiquement** : Or = Diplomatie/Long terme, Orange = Chantier/Risque. Jamais de confusion.
3. **Créer le clash** : Le moment "guerre silencieuse" doit être visuellement violent (interférence, tremblement) pour justifier l'enjeu émotionnel de la vidéo.

La stack React/Remotion/SVG est parfaitement capable de cela via des interpolations frame-by-frame sur les attributs `d` des paths (pour les déformations) et les `transform` de la projection D3. Pas besoin de WebGL, juste d'une logique d'animation plus cinématographique.