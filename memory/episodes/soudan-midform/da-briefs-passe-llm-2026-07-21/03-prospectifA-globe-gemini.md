En tant que directeur artistique, mon constat est clair : nous avons un excellent moteur (D3.js + SVG) mais nous l'utilisons actuellement comme un simple outil de présentation "PowerPoint". Le globe orthographique de D3 est puissant, il faut l'exploiter pour raconter l'histoire par le mouvement et la texture, tout en respectant strictement nos contraintes de rendu 2D et de lisibilité documentaire.

Voici le plan d'action concret pour enrichir le langage du globe.

### 1. EMPHASE SUR UN PAYS QU'ON NOMME (Sortir du simple remplissage)
L'apparition brutale d'un drapeau aplatit l'image. Il faut donner une dimension "tactique" à l'entrée en scène d'un acteur.

*   **Onde de choc frontalière (Pulse)**
    *   *Timecode :* ~3:40 (Turquie), ~4:10 (Égypte), ~4:43 (Russie).
    *   *Faisabilité :* **À CODER (mais très simple en D3)**.
    *   *Description SVG :* Au moment où le pays se remplit de son drapeau, on duplique le `<path>` de sa frontière. On anime ce second path avec un `stroke-width` qui passe de 1px à 10px, et un `stroke-opacity` qui passe de 0.8 à 0 en 1 seconde (effet *ease-out*). Cela crée une onde lumineuse qui épouse parfaitement la forme du pays, marquant son activation sans surcharger la carte.
*   **Élévation par l'ombre (Drop Shadow)**
    *   *Timecode :* Sur tous les pays "ingérents" quand ils sont actifs.
    *   *Faisabilité :* **DÉJÀ FAISABLE / À CODER (ajout d'un filtre)**.
    *   *Description SVG :* Appliquer un `<filter id="drop-shadow">` (avec `feGaussianBlur` et `feOffset`) sur le `<path>` du pays. Cela donne l'illusion que le pays se "détache" légèrement de la surface du globe, lui conférant un statut d'acteur majeur par rapport aux pays neutres qui restent plats.

### 2. MOUVEMENTS DE CAMÉRA D3 (Briser la fixité)
Le globe D3 n'est pas une image fixe, c'est une projection mathématique. Utilisons `projection.rotate()` et `projection.scale()` pour guider l'œil.

*   **Dolly-in (Zoom) sur un enjeu stratégique**
    *   *Timecode :* ~5:07 (Négociation de la base navale à Port-Soudan).
    *   *Faisabilité :* **DÉJÀ FAISABLE**.
    *   *Description D3 :* Transition fluide (ex: 2 secondes, *ease-in-out*) augmentant le `projection.scale()` (zoom) tout en ajustant le `projection.rotate()` pour centrer Port-Soudan. Intention narrative : on passe de la macro-géopolitique (Moscou) à l'enjeu micro-territorial (la base navale).
*   **Dérive lente (Slow Drift)**
    *   *Timecode :* ~6:24 à 6:37 (Résumé des 4 puissances autour du Soudan).
    *   *Faisabilité :* **À CODER (interpolation continue)**.
    *   *Description D3 :* Au lieu d'un plan fixe, appliquer une rotation très lente et continue sur l'axe X de `projection.rotate()` (ex: +5 degrés sur 10 secondes). Intention : donne un aspect "monde en mouvement" et dramatique pendant la synthèse des forces en présence.
*   **Pull-out (Dézoom) institutionnel**
    *   *Timecode :* ~8:25 (Union Africaine) et ~8:47 (ONU).
    *   *Faisabilité :* **DÉJÀ FAISABLE**.
    *   *Description D3 :* Réduction du `projection.scale()` pour montrer l'Afrique entière, puis le monde. Intention : souligner visuellement l'impuissance de la communauté internationale en montrant l'immensité du globe face au point de crise.

### 3. VARIER LE VOCABULAIRE DES FLUX (Au-delà de l'arc solide)
Tous les flux ne se valent pas. Une livraison d'armes secrète ne doit pas avoir la même signature visuelle qu'un accord diplomatique officiel.

*   **Le flux clandestin (Marching Ants)**
    *   *Timecode :* ~3:31 (Armes via les Émirats), ~7:35 (Route libyenne vers le Darfour).
    *   *Faisabilité :* **À CODER (animation CSS/SVG native)**.
    *   *Description SVG :* Utiliser un `<path>` d'arc classique, mais lui appliquer un `stroke-dasharray` (ex: "5, 5"). Animer la propriété `stroke-dashoffset` en continu. Cela crée un effet de pointillés qui "coulent" le long de la ligne. Parfait pour illustrer la contrebande, les mercenaires ou les flux non officiels.
*   **Le convoi logistique (Traveling Dots)**
    *   *Timecode :* ~4:08 (Route de l'or vers l'Égypte).
    *   *Faisabilité :* **À CODER (interpolation D3 le long d'un path)**.
    *   *Description SVG :* Au lieu d'une ligne continue, faire glisser 2 ou 3 petits `<circle>` le long du path de l'arc (en utilisant `getPointAtLength` ou les transitions D3). Cela matérialise un flux physique et continu (camions/navires) plutôt qu'un lien abstrait.

### 4. MARQUER UN LIEU DE CRISE (Dramatiser El-Fasher)
Un simple point pour une ville assiégée est une erreur de direction artistique. Il faut faire ressentir l'étau.

*   **L'anneau de siège (Encirclement)**
    *   *Timecode :* ~7:36 (El-Fasher).
    *   *Faisabilité :* **À CODER (très simple)**.
    *   *Description SVG :* Autour du point de la ville, ajouter un `<circle>` sans remplissage, avec un `stroke` rouge et un `stroke-dasharray` (pour faire un cercle en pointillés). Appliquer une animation de rotation lente (`transform="rotate(...)"`) sur ce cercle. Intention : symbolise visuellement l'encerclement et le siège militaire sans alourdir la carte.
*   **Le halo de tension (Heatmap pulse)**
    *   *Timecode :* ~7:36 (El-Fasher).
    *   *Faisabilité :* **DÉJÀ FAISABLE**.
    *   *Description SVG :* Placer sous le point de la ville un `<circle>` rempli avec un `<radialGradient>` (rouge au centre, transparent sur les bords). Animer son rayon (`r`) et son opacité en boucle (pulse lent). Cela crée une "zone de chaleur" qui attire l'œil sur l'urgence humanitaire et militaire.

### 5. MATIÈRE & AMBIANCE SOBRE (Habiller le globe)
Le globe fait trop "vecteur plat". Nous pouvons lui donner du volume et une esthétique de salle de commandement avec des éléments SVG très légers.

*   **Atmosphère et Volume (Inner Glow)**
    *   *Timecode :* Tout au long des actes 3 à 6.
    *   *Faisabilité :* **DÉJÀ FAISABLE**.
    *   *Description SVG :* Superposer au globe un `<circle>` de la taille exacte de la projection, rempli avec un `<radialGradient>`. Ce dégradé sera transparent au centre et légèrement sombre/bleuté sur les bords externes (ex: `stop-color="black" stop-opacity="0.3"` à 100%). Cela donne instantanément l'illusion d'une sphère 3D volumétrique sans aucun calcul 3D.
*   **Le Graticule Tactique (Lat/Long lines)**
    *   *Timecode :* Tout au long des actes 3 à 6.
    *   *Faisabilité :* **DÉJÀ FAISABLE (natif dans D3)**.
    *   *Description D3 :* Activer `d3.geoGraticule()`. Rendre ces lignes extrêmement subtiles (ex: `stroke="white" stroke-opacity="0.05" stroke-width="0.5"`). Cela habille les océans vides, donne une échelle géographique et renforce le côté "dossier géopolitique sérieux" sans gêner la lecture des flux.