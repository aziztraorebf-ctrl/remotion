C'est une excellente vision. L'intégration de personnages sous forme d'illustrations éditoriales (style *The Economist* ou *Le Monde*) sur fond Kraft est **exactement** ce qui va donner à Souverain sa patte visuelle unique, la distinguant des chaînes qui utilisent de la photo de presse brute.

Le 16:9 offre un espace magnifique pour jouer sur la composition (règle des tiers, face-à-face, grilles).

Voici 8 templates Remotion 16:9, conçus pour s'intégrer parfaitement à ta stack (Remotion + CSS/SVG + Gemini BD portraits + fond Kraft), couvrant 100% de tes besoins narratifs.

---

### 1. Le Héros / L'Expert (1 Personne)
**Nom : Portrait Éditorial (Editorial Spread)**
*   **Anatomie :** Composition asymétrique type magazine. À droite (ou gauche), le portrait grand format coupé à la taille, ancré en bas de l'écran. Derrière lui, un grand cercle ou un aplat géométrique SVG (couleur ivoire ou slate) pour le détacher du fond Kraft. À l'opposé, Typographie massive (Nom) + Sous-titre (Rôle).
*   **Mécanique Remotion :** `spring` sur le `translateY` du personnage (monte depuis le bas de l'écran) + `scale` du cercle SVG en background. Le texte apparaît via un masque d'écrêtage (`clip-path: inset()`) de gauche à droite.
*   **Cas d'usage :** Présenter **Bassirou Diomaye Faye** lors de son élection.
*   **Type de portrait :** BD encre + aplats de couleurs (style ligne claire), détouré (PNG transparent).
*   **Risque technique :** FAIBLE. Très standard, impact maximal.

### 2. L'Opposition (2 Personnes)
**Nom : Ligne de Fracture (The Rift)**
*   **Anatomie :** L'écran est divisé en diagonale ou verticalement par une ligne vectorielle texturée (style trait de crayon appuyé ou déchirure). Portrait A à gauche regardant vers la droite ; Portrait B à droite regardant vers la gauche. Les noms sont alignés de part et d'autre de la fracture.
*   **Mécanique Remotion :** La ligne se dessine au centre (`stroke-dasharray`). Les deux personnages glissent (`translateX` + `spring`) depuis les bords extérieurs pour venir "buter" contre la ligne centrale.
*   **Cas d'usage :** La crise diplomatique **Emmanuel Macron vs Abdelmadjid Tebboune**.
*   **Type de portrait :** BD buste de profil ou trois-quarts face, détouré. Couleurs contrastées (tons froids pour l'un, chauds pour l'autre).
*   **Risque technique :** FAIBLE.

### 3. L'Équipe / Le Cabinet (3-4 Personnes)
**Nom : Trombinoscope Stratégique (The Vanguard)**
*   **Anatomie :** Alignement horizontal de 3 ou 4 portraits coupés aux épaules. Le personnage central (ou le leader) est légèrement plus grand et au premier plan. Des "étiquettes" minimalistes (rectangles SVG) chevauchent le bas de chaque portrait avec leur nom et fonction.
*   **Mécanique Remotion :** Apparition en cascade (`delay` sur `Interpolate`). Les personnages du fond apparaissent d'abord (légèrement floutés via `filter: blur()` qui se dissipe), puis le leader au centre en dernier, net et vibrant.
*   **Cas d'usage :** Les leaders de l'**Alliance des États du Sahel (AES)** : Assimi Goïta, Ibrahim Traoré, Abdourahamane Tiani.
*   **Type de portrait :** BD aquarelle ou encre, bustes détourés, même échelle de dessin pour la cohérence.
*   **Risque technique :** MOYEN (demande un bon z-indexing en CSS et une gestion fine des délais pour ne pas faire "cheap").

### 4. Transition / Succession (2 Personnes)
**Nom : Passation de Pouvoir (The Handover)**
*   **Anatomie :** Le Portrait A occupe le centre de l'écran. Une flèche de flux (FlowArrowsMap) ou une timeline apparaît en bas. Le Portrait A "recule" visuellement vers la gauche, tandis que le Portrait B émerge de la droite pour prendre la place centrale.
*   **Mécanique Remotion :** Portrait A : `translateX` vers la gauche, `scale` de 1 à 0.8, `opacity` de 1 à 0.5 (il devient grisé via `filter: grayscale(1)`). Portrait B : inverse (vient de la droite, grandit, prend ses couleurs).
*   **Cas d'usage :** La succession au Sénégal : **Macky Sall** passant le relais à **Bassirou Diomaye Faye**.
*   **Type de portrait :** BD détouré classique.
*   **Risque technique :** MOYEN (chorégraphie des `springs` croisés à bien calibrer).

### 5. Évolution dans le temps (1 Personne)
**Nom : Diptyque Temporel (Time Warp)**
*   **Anatomie :** Un seul personnage, mais deux époques. Les deux portraits sont superposés au millimètre près au centre de l'écran. Une barre verticale (type scanner) balaye l'écran de gauche à droite, révélant la version âgée/modifiée du personnage.
*   **Mécanique Remotion :** Utilisation de `clip-path: polygon()` animé sur le portrait B (le "Après") pour donner l'illusion d'un balayage (wipe effect). Affichage dynamique des années ("1999" -> "2024").
*   **Cas d'usage :** L'évolution de **Paul Biya** (jeune leader vs patriarche actuel) ou un chef rebelle avant/après sa prise de pouvoir.
*   **Type de portrait :** BD. *Contrainte forte :* Gemini doit générer les deux portraits dans la même pose exacte (via un prompt strict ou Image-to-Image).
*   **Risque technique :** ÉLEVÉ (La difficulté n'est pas le code Remotion, mais la génération IA de deux images superposables).

### 6. Acteur Sensible / Source
**Nom : Ombre & Caviardage (The Whistleblower)**
*   **Anatomie :** Un portrait transformé en silhouette sombre (couleur Slate/Navy). Un bloc noir brutal (Caviardage) vient barrer les yeux ou le visage. Le fond Kraft s'assombrit ou gagne un effet de vignette (bords sombres). Typographie type "machine à écrire" (Courier).
*   **Mécanique Remotion :** Le personnage apparaît en fondu. Le trait de caviardage noir est un `div` dont le `width` passe de 0 à 100% brutalement. Le texte s'écrit lettre par lettre.
*   **Cas d'usage :** Un informateur anonyme sur les contrats miniers en RDC, ou l'évocation d'un **cadre de Wagner** non identifié.
*   **Type de portrait :** N'importe quel portrait généré, que l'on passe en silhouette via CSS (`filter: brightness(0) drop-shadow(...)`) + bruit SVG.
*   **Risque technique :** FAIBLE. Très élégant et facile à coder.

---

### 🌟 BONUS 1 : Le Panaroma Complexe (6-8 Personnes)
**Nom : Matrice des Acteurs (Intel Dossier) - *Réponse à la demande Galerie de contacts***
*   **Anatomie :** Une grille type "mur d'enquête" ou écran de renseignement (2x3 ou 2x4). Chaque case est une "fiche" rectangulaire (fond Ivoire sur fond Kraft) contenant : un petit portrait carré/rond, Nom, Rôle, et un "Point de statut" coloré (Vert = Allié, Rouge = Hostile, Gris = Neutre).
*   **Mécanique Remotion :** Révélation en grille (Grid Layout CSS). Les fiches "tombent" sur le bureau Kraft l'une après l'autre (légère rotation aléatoire `rotate(-2deg)` à `rotate(2deg)` pour faire organique).
*   **Cas d'usage :** Cartographier l'écosystème du **conflit dans l'Est de la RDC** (Tshisekedi, Kagame, chefs du M23, commandants MONUSCO).
*   **Type de portrait :** BD style "photo d'identité" (headshots rapprochés), encadrés dans des carrés. Ne nécessite pas de détourage complexe.
*   **Risque technique :** MOYEN (beaucoup de props à passer au composant Remotion : tableau d'objets avec images, noms, statuts).

### 🌟 BONUS 2 : La Déclaration (1 Personne + Citation)
**Nom : Citation Souveraine (The Stand) - *Réponse à la demande Citation Attribuée***
*   **Anatomie :** La typographie est reine. Le texte de la citation occupe 60% de l'écran avec une typographie Serif prestigieuse et d'énormes guillemets SVG en filigrane derrière le texte. Le personnage est réduit (buste) et placé en bas dans un coin, relié au texte par une subtile "queue de bulle" géométrique (faisant écho au template KraftCard). La source (Lieu, Date) est soulignée en bas.
*   **Mécanique Remotion :** Le personnage glisse discrètement d'un côté. Les guillemets SVG apparaissent via un `scale(1.5)` avec une opacité très faible (10%). La citation apparaît via un `Opacity` global ou ligne par ligne. La queue de la bulle se dessine via un `Path` animé.
*   **Cas d'usage :** Le discours de **Thomas Sankara** à l'ONU, ou une déclaration choc de **Paul Kagame** sur la souveraineté africaine.
*   **Type de portrait :** BD détouré, regardant *obligatoirement* en direction du texte (vers la gauche ou la droite).
*   **Risque technique :** MOYEN (gérer la taille dynamique du texte pour qu'il ne déborde pas si la citation est longue).

---

### Comment intégrer ça dans ta pipeline de prod ?

1. **Le Prompt Gemini "Secret Sauce" :** Pour garantir la cohérence visuelle sur le fond Kraft, tes prompts IA doivent être standardisés : *"Portrait of [Name], editorial illustration style, clear lines, flat watercolor fills, muted colors, white background, masterpiece, professional geopolitical magazine style."*
2. **Le Script de Nettoyage :** Tu passes le résultat dans un outil de background removal (ou via Remotion si l'image a un fond parfaitement blanc, tu peux utiliser CSS `mix-blend-mode: multiply` sur le fond Kraft : le blanc disparaît et le dessin fusionne avec le grain du papier ! C'est une astuce technique énorme pour gagner du temps).
3. **Le Composant Maître :** Crée un composant `<CharacterPortrait />` dans Remotion qui accepte des props : `imageSrc`, `scale`, `flipX` (pour inverser le regard), et `shadow` (pour générer une ombre portée réaliste sur le Kraft). Tous les templates ci-dessus utiliseront ce composant de base.