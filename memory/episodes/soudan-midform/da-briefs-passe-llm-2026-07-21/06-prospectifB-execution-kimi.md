Voici un diagnostic précis et des solutions concrètes, opérables dans votre moteur D3.js/SVG, organisées par priorité de réalisation.

---

### 1. MUSCLER LE DÉBUT (0:00-2:30) — Rythme & tension

**A. L'accroche (0:00-0:15) — "Révélation territoriale"**
- **Problème** : La carte apparaît statiquement avec un fondu fade trop doux.
- **Solution** : Zoom cinématique D3 rapide (scale 0.8 → 1.4 en 1.5s ease-out) sur le Darfour, synchronisé avec l'apparition des 3 icônes de mines. 
  - **Effet SVG** : Les mines apparaissent par "scale pop" (0→1 avec un léger overshoot à 1.2 puis retour à 1) + halo radial doré qui pulse 2 fois (opacity 0.8→0, scale 1→1.5).
  - **Status** : A CODER (animation scale D3 + création du halo pulse en SVG).
  - **SFX** : *Gong métallique grave* + *crépitement de radio* (suggère extraction minière et communication militaire).

**B. La fracture RSF/SAF (~1:26) — "Ligne de faille"**
- **Problème** : La scission entre les deux factions est illustrée par de simples cercles qui apparaissent, sans impact visuel de "rupture".
- **Solution** : 
  - Tracer une **ligne brisée SVG** (path avec dasharray) qui se dessine de haut en bas entre les deux territoires, avec un effet de **vibration** (translate X aléatoire de ±2px sur 3 frames) quand la ligne atteint le centre.
  - Changement de colorimétrie : le fond passe de beige neutre à un **dégradé radial** : rougeâtre à l'ouest (RSF), bleuâtre à l'est (SAF), se rencontrant en ligne de crête sombre au centre.
  - **Status** : A CODER (path animation + filtre SVG turbulence légère pour la vibration).
  - **SFX** : *Craquement de roche* + *bip sonore militaire* (comme un radar qui détecte une anomalie).

**C. Transition 2019→2021 (~0:57) — "Distorsion temporelle"**
- **Problème** : Simple fondu entre deux états de la carte.
- **Solution** : **Morphing de path** (D3 geo interpolation) entre les frontières administratives de 2019 et la carte "vierge" de 2021, combiné à un **flash blanc** (rectangle SVG blanc opacity 0→0.8→0 en 0.3s) au moment du changement d'année affichée.
- **Status** : A CODER (interpolation de paths géographiques).

---

### 2. DENSIFIER LES MOMENTS-CHIFFRES — Incarnation spatiale

**A. "50 millions d'habitants" (~0:29)**
- **Problème** : Texte flottant dans le vide.
- **Solution** : **Pictogrammes diffusants**. Superposer sur le Soudan une grille invisible de 50 silhouettes humaines SVG (simples path de bustes). Les faire apparaître une par une (stagger 20ms) depuis le centre vers la périphérie, puis **comparer visuellement** : une carte de la France (ou de la Tunisie) apparaît en surimpression semi-transparente à côté pour l'échelle, avec une ligne de connexion.
- **Status** : A CODER (génération procédurale des pictogrammes + positionnement).

**B. L'empire de l'or (~2:48) — "Barres de ravitaillement"**
- **Problème** : Les mines sont montrées mais pas la "valeur" ou le volume.
- **Solution** : À côté de chaque mine, faire émerger une **barre verticale SVG** (comme un graphique) constituée de rectangles dorés empilés qui montent progressivement (height 0→valeur max en 1s ease-out). Au sommet, afficher un symbole "$" ou une icône de camion.
- **Status** : DEJA FAISABLE avec simples rectangles SVG animés en height.

**C. Bilan humain final (~10:00) — "Grille d'évanescence"**
- **Problème** : Carton texte statique "13,5 millions".
- **Solution** : Une **grille de 135 petits points rouges** (représentant 100 000 personnes chacun) sur fond de carte. Progressivement (sur 3 secondes), 13 d'entre eux changent de couleur (gris ou s'éteignent) pour représenter le ratio de déplacés. Les points restants pulsent doucement. C'est symbolique, sobre, et évite l'accumulation visuelle de 13M d'icônes.
- **Status** : A CODER (génération de grille + animation de couleur).

---

### 3. SALLE ONU/UA (~8:08-9:11) — Humanisation symbolique

**Problème** : Cercles vides, abstraction trop forte.

**Solutions SVG réalisables :**
- **Silhouettes géométriques** : Remplacer les cercles vides par des **triangles isocèles** (chefs d'État) ou des **carrés** (représentants) en gris neutre, tous orientés vers le centre. 
- **Drapeaux discrets** : Sur chaque siège, un petit **rectangle vertical** (4px × 6px) avec le drapeau du pays membre, lisible uniquement au zoom (scale > 1.2).
- **Le Veto Russe (~8:55)** : Le jeton russe (cercle avec drapeau) se déplace vers le centre et "bloque" le passage : un **symbole X blanc** apparaît en overlay avec un effet de "gel" (le cercle devient bleu glacé, les autres sièges autour s'assombrissent légèrement via un voile de masque SVG radial).
- **Status** : A CODER (positionnement des formes + changement de couleur conditionnel).

---

### 4. LISIBILITÉ DES JETONS — Hiérarchie visuelle

**A. Hiérarchie de taille dynamique (~0:33-1:15)**
- **Problème** : Jetons-visages trop petits, tous de même taille.
- **Solution** : **Échelle proportionnelle au pouvoir** :
  - Hemedti & Al-Burhan : rayon 12px + contour blanc épais 3px + ombre portée SVG (drop-shadow filter).
  - Sous-chefs (généraux) : rayon 8px + contour 1px.
  - Soldats/simples unités : simples points 4px.
- Au zoom de la caméra D3, les rayons s'ajustent inversement (restent constants en pixels écran) pour garantir la lisibilité.

**B. Flux géopolitiques (~3:48) — "Lignes vivantes"**
- **Problème** : Lignes jaunes statiques entre pays, confusion des directions.
- **Solution** : Remplacer par des **paths avec des " particules"** : de petits cercles (3px) qui se déplacent le long du trait (animateMotion SVG) de la source vers la destination. 
  - Flux financiers : particules dorées, vitesse lente.
  - Flux militaires : particules rouges, vitesse rapide.
  - **Status** : A CODER (animateMotion sur path SVG).

**C. Contraste des factions**
- Toujours utiliser le **rouge #D32F2F** (RSF) vs **bleu #1976D2** (SAF) avec des **saturation élevées**. Les cercles de territoire actuels sont trop pastel.
- Ajouter un **halo de territoire** : un cercle de 40px d'opacity 0.2 autour de chaque jeton principal, coloré selon la faction, pour "marquer" visuellement la zone d'influence immédiate.

---

### 5. AUDIO — Bande-son & Design Sonore

**A. MUSIQUE (Minimax/Instrumental)**
Style précis : **"Thriller Géopolitique Minimaliste"**
- **0:00-2:30** : Cordes aigües tenues (sustain) + une note de basse drone en sous-continu (freq ~60Hz). Tempo 70 BPM. Créer l'angoisse sourde.
- **2:30-5:00** : Introduction de percussions tribales africaines subtiles (djembe électronique) au moment de l'explication du trafic d'or. Le tempo monte à 85 BPM.
- **5:00-8:00** : Phase diplomatique : piano préparé ou synthé épuré, notes désaccordées (intervalles de 2ème mineure) pour suggérer la tension internationale.
- **8:00-Fin** : Retour du drone + ajout d'une ligne de violoncelle grave, solitaire. Fin sur un fade-out des basses (sensation de "non-résolution").

**Règle d'or** : Le mixage doit laisser 6dB de headroom sous la voix off. La musique est une nappe, jamais une mélodie entêtante.

**B. SFX PONCTUELS (Palette documentaire)**

| Timecode | Moment | SFX proposé | Justification |
|----------|--------|-------------|---------------|
| **0:06** | Apparition des mines d'or | *Ting* métallique aigu (comme une pièce qui tombe) | Incarne la valeur, l'extraction |
| **1:26** | Séparation RSF/SAF | *Craquement* de glace/roche + *Bass drop* (sub) | Marque la rupture irréversible |
| **3:09** | Connexion Dubaï | *Bip* de modem/sonar + *whoosh* aigu | Symbolise la connexion internationale, le financement |
| **4:44** | Arrivée de la Russie | *Klaxon* de bateau lointain + grésillement radio | Évoque la flotte et les mercenaires Wagner |
| **6:03** | Drone strike | *Bourdonnement* croissant (3s) puis *impact sourd* (cut brutal du son) | Immersion dans la frappe aérienne |
| **8:55** | Veto Russe ONU | *Blocage mécanique* (clank) + silence total 1s | Marque le blocage diplomatique |
| **10:00** | Chiffre final 13,5M | *Vent* qui souffle + *craquement* de bois | Évoque le déplacement massif, l'effondrement |

**Technique** : Ces SFX sont des **stingers** (courts, <2s), jamais en loop, placés exactement sur les cuts ou les apparitions d'éléments clés (keyframes D3).

---

### SYNTHÈSE DES PRIORITÉS À CODER

1. **Urgent** : Hiérarchie des jetons (taille/contraste) + animation des flux (particules sur path).
2. **Important** : Muscler l'accroche (halo pulse mines) + ligne de fracture au 1:26.
3. **Polissage** : Salle ONU avec silhouettes + grille de points pour le bilan humain.
4. **Finishing** : Pack audio (musique drone + 7 stingers SFX).

Toutes ces propositions respectent la contrainte D3.js/SVG 2D et maintiennent la lisibilité cartographique première.