**DIAGNOSTIC MOTION DESIGN — WAR MAPS SOUDAN vs SAHEL**

---

### 1. CLASSEMENT DES DIFFÉRENCES (de la plus déterminante à la moins importante)

**#1. LA FRAGMENTATION TERRITORIALE (la « mosaïque administrative ») — DÉTERMINANT**
**Confirmé.** Le Soudan affiche de grandes masses colorées continues (blocs bleu/rouge/or de taille homogène et généreuse). Le Sahel expose une patchwork de petites régions administratives inégales qui se touchent partout. Ce n'est pas la palette qui crée la « bouillie », c'est la **granularité géographique** : quand 15 petites régions de tailles différentes se côtoient avec 3 couleurs différentes, l'œil ne peut plus faire de figure-fond. Le problème est topologique, pas chromatique.

**#2. LE FORMAT (9:16 vertical vs 16:9 horizontal) — TRÈS IMPORTANT**
**Confirmé.** Le vertical force un cadrage serré qui isole le théâtre d'opérations (Khartoum et environs) et élimine les distractions périphériques. Le horizontal 16:9, couvrant 28° de longitude, oblige à montrer trois pays entiers avec leurs marges, diluant l'attention et créant de la « distance cognitive » entre les points d'intérêt. Le format horizontal invite mécaniquement à remplir l'espace disponible, ce qui amplifie la fragmentation vue au point #1.

**#3. LE RATIO CARTE / ESPACE NÉGATIF — IMPORTANT**
**Confirmé.** Le Soudan laisse respirer : ~60% de beige neutre autour des zones de conflit. Le Sahel remplit ~85% du frame avec des couleurs politiques (bleu/rouge/or), ne laissant que des « interstices » de vide. L'absence de « repos visuel » crée la sensation de surcharge.

**#4. L'ÉCHELLE DES ZONES COLORÉES PAR RAPPORT AU CADRE — MODÉRÉ**
**Confirmé.** Au Soudan, une zone rouge ou bleue occupe une portion significative du frame (lisible à 3 mètres). Au Sahel, une même zone couvre parfois moins de 5% de la surface, devenant une tache indistincte. La taille minimale d'une zone lisible n'est pas respectée dans le Sahel.

**#5. LA DENSITÉ D'ÉLÉMENTS ACTIFS (véhicules, cartouches) — FAIBLE**
**Partiellement confirmé.** Le Soudan montre 3-4 véhicules bien espacés dans une zone or large. Le Sahel montre des clusters de véhicules dans des zones étroites. Cependant, ce n'est pas la densité d'icônes qui crée le chaos initial, mais la densité des régions colorées sous-jacentes.

**#6. LE NOMBRE DE FACTIONS — NON PERTINENT**
**Infirmé.** Les deux cartes utilisent exactement 3 couleurs de factions. La différence de lisibilité ne vient pas du nombre de couleurs, mais de leur **distribution spatiale** (grandes plages vs petits fragments).

---

### 2. LES 3 CORRECTIONS LES PLUS RENTABLES POUR LE SAHEL (Remotion/Mapbox)

**A. AGRÉGATION TERRITORIALE (le « smooth » administratif)**
Regrouper les petites régions administratives en « zones d'influence » plus larges (même si c'est une approximation géopolitique). Passer de 30+ petites régions à 8-10 grandes aires de contrôle. Cela se fait en modifiant la couche GeoJSON : fusionner les polygones adjacents de même couleur ou proches politiquement. **Impact maximal** : supprime la « mosaïque » à la source.

**B. CROP VERTICAL OU FOCUS SÉQUENTIEL**
Abandonner le 16:9 horizontal pour :
- Soit un **9:16 vertical** qui cadre un seul pays à la fois (Mali, puis Burkina, puis Niger en séquence)
- Soit un **16:9 mais avec masque progressif** (vignette) qui assombrit les zones hors-théâtre tout en gardant la géographie visible en fond tamisé (opacité 30% sur les pays voisins)

**C. RÉDUCTION DRASTIQUE DES FRONTIÈRES INTERNES**
Dans Mapbox : passer les frontières administratives (régions/départements) à **opacité 0.2** ou les supprimer totalement, ne garder que les frontières nationales et les lignes de front. Actuellement, le réseau de lignes noires sur le Sahel crée une « grille » qui fragmente encore plus la lecture. Les zones colorées doivent flotter sans cage.

---

### 3. VERDICT TRANCHÉ

**La palette est un FAUX COUPABLE.**

Le vrai problème n°1 est la **fragmentation géographique des données territoriales** (hypothèse #2), amplifiée par le format horizontal qui refuse de cadrer serré. Vous appliquez une palette premium conçue pour des blocs larges (Soudan) sur une mosaïque de confettis administratifs (Sahel). La palette n'est pas en cause ; c'est la **résolution spatiale de l'information** qui dégrade la perception.

**En résumé :** Le Soudan est une carte de **blocs** ; le Sahel est une carte de **pixels**. Le motion design ne peut pas sauver une densité d'information trop élevée sans agrégation préalable des données.