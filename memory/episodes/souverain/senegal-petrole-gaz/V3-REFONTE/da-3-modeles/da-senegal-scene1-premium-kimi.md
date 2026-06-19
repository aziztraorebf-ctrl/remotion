 Voici la review technique et créative, structurée selon vos angles obligatoires. Je réponds en français pour coller à l'intention du projet, avec des références précises à votre stack.

---

### 1. SPECTATEUR LAMBDA — La hiérarchie du regard

**Où il décroche :**
- **0-32s :** Il voit une carte grise avec deux mots flottants. Il ne comprend pas que ce sont des *concepts* à déconstruire. Il attend une action, il voit du "PowerPoint animé".
- **Gisements :** Trois fois la même chose (point qui pulse). Il ne retient pas la différence entre Sangomar et GTA car visuellement c'est identique.
- **60% :** Il lit "52%" (ou 60%), mais sans contexte spatial, c'est un chiffre magique. Il ne comprend pas *à qui* part l'argent.

**Fix :**
- **Intro :** Opposer visuellement les deux récits avec une force de collision (typo géante, textures opposées : craquelure terreuse vs lumière dorée). Le spectateur doit *sentir* le conflit avant de comprendre le texte.
- **Gisements :** Chaque site doit avoir une *silhouette* unique (icône métier : rig, pipeline, radar). Le regard s'accroche à la forme.
- **60% :** Montrer le *flux* physique de l'argent. Une rivière qui se sépare est comprise instantanément ; un chiffre isolé nécessite une explication.

---

### 2. NARRATION / SYNCHRO — Un beat visuel par idée

**Décalages actuels :**
- La voix dit "la réalité se joue ailleurs" à 32s, mais la carte est déjà là depuis 0s. Il n'y a pas de "révélation" spatiale.
- Pour GTA, la voix mentionne "l'Europe et l'Asie", mais les arcs pointillés actuels sont statiques et tristes. Pas de *dynamique* d'exportation.
- Yakaar est décrit comme un mystère, mais visuellement c'est un point jaune identique aux autres.

**Fix :**
- **Beat 0-32s (Abstrait) :** La voix oppose "Malédiction" vs "Miracle" → Visuel : Deux masses typographiques qui *slamment* (KineticMaskSlam), puis s'effritent (mask dissolve) pour révéler la carte au moment exact où la voix dit "ailleurs".
- **Beat Sangomar (National) :** Voix : "pétrole... Woodside... 18%" → Visuel : Construction d'une icône rig (stroke animation), drapeau australien qui apparaît, drapeau sénégalais qui remplit 18% de l'écran (split visuel).
- **Beat GTA (Export) :** Voix : "remplace le gaz russe" → Visuel : **GeoFlowConnection** avec un sprite avion/bateau qui suit la ligne, et les drapeaux des pays destinataires qui s'allument en séquence (SequentialFlagReveal) *synchro* avec la voix.
- **Beat Yakaar (Mystère) :** Voix : "personne n'a décidé... plusieurs capitales regardent" → Visuel : **ClassifiedRedactReveal** (barres de censure qui glissent) + yeux (Lucide `Eye`) qui apparaissent sur les bords de l'écran, regardant le point.

---

### 3. TRANSITIONS vs ÉTATS — Casser la diapositive

**Problème :** Vous avez des états figés (carte + overlay) reliés par des fondus ou des cuts. C'est du "diaporama".

**Solution : Continuité motrice**
- **Caméra frame-driven :** Utilisez `useMapboxFlyTo` entre chaque gisement. La caméra doit *voyager* le long de la côte sénégalaise. Pas de cut.
- **Transitions tenues :**
  - Intro → Sangomar : Le "O" de "RÉALITÉ" (typo géante) devient l'océan Atlantique par un zoom infiniment profond (KineticMaskSlam).
  - Sangomar → GTA : Un *faisceau* (sweep) traverse l'écran horizontalement (SweepRevealTerritory) pour révéler la frontière nord.
  - GTA → Yakaar : Un *effet de profondeur* : GTA s'assombrit (depth of field simulé par opacity layers) pendant que Yakaar s'éclaire.
  - Yakaar → 60% : **MapCutaway** (mode reveal). La carte s'assombit, un overlay plein écran montre le partage, puis on revient à la carte avec un *target lock* sur Dakar.

---

### 4. TEST AI-SLOP — Ce qui crie "généré sans œil"

**Critique technique :**

1. **Le Gris Mort (Couleurs) :** La carte Mapbox par défaut est un gris bureaucratique `#CCCCCC` avec un océan `#AABBCC`. C'est le "thème corporate générique". Il manque de contraste et de personnalité chromatique (votre charte Navy/Gold n'est pas exploitée sur le fond).
   - *Piste :* Utilisez **MapboxFlagFill** avec une bichromie Navy/Gold sur le Sénégal dès le début. Ajoutez une couche bathymétrique (topographie sous-marine) pour l'offshore — ça donne du grain sans surcharger.

2. **Les Points qui Pulsent (Éléments génériques) :** Le "cercle jaune avec un halo" est le *cliché* numéro 1 des visualisations de données automatiques. Ça ne dit rien (c'est un point sur une carte, c'est tout).
   - *Piste :* Remplacez par des **icônes Lucide** contextualisées (`Factory` pour Sangomar, `Plane` pour GTA, `Eye` pour Yakaar) avec une animation de *construction* (stroke-dashoffset) ou un effet *spring* (pop scale).

3. **La Typographie Flottante (Hiérarchie) :** Les textes "LA MALÉDICTION" flottent sans ancrage physique. Ce sont des calques texte sans lien avec le monde.
   - *Piste :* Ancrer les textes avec **GeoCountryPlaque** (pilule + stat) ou utiliser des **masques de forme** (texte qui apparaît dans un rectangle dessiné par une ligne SVG).

4. **L'Easing Robotique :** Les fade-in/fade-out linéaires (`ease-in-out`) sentent le "template CSS".
   - *Piste :* Utilisez `spring({stiffness: 100, damping: 15})` de Remotion pour tous les éléments d'interface. Ressort physique = sentiment "premium".

5. **L'Absence de Source (Data-viz amateur) :** Le chiffre "60%" apparaît sans pedigree. Un pro met toujours la source (Woodside, BP, Ministère).
   - *Piste :* Intégrer systématiquement la source en petit (mono) dans les **GlassmorphismGeoPopup** ou **GeoCountryPlaque**.

---

### 5. EXPERT DU MÉTIER — Ce que Johnny Harris ferait différemment

**Ce qui manque à l'appel :**

- **Le "Pourquoi maintenant ?" :** L'expert voit l'histoire dans la carte. Il manque une **couche temporelle**. Pourquoi Yakaar est-il "en attente" ? Montrez-le avec une **jauge de progression** ou une **horloge** (LottieGeoAura avec une aiguille qui tremble).
- **La Chair géopolitique :** GTA n'est pas juste un point, c'est une *frontière*. Un pro utiliserait **FiberOpticBorderDraw** pour tracer la ligne frontalière sous-marine SN/MR en laser doré, montrant que la ressource est *à cheval*.
- **La dimension humaine :** Le 60% reste abstrait. Un pro montrerait ce que ça représente (écoles, routes) vs ce qui part (dividendes actionnaires). Utilisez **MapCutaway** (mode image) pour montrer une image bichromisée (école vs tour de bureaux) dans le split.
- **La caméra subjective :** L'actuel est une carte vue du ciel statique. Un pro ferait un **fly-through** : on part de l'océan (intro), on plonge sous l'eau (bathymétrie), on remonte à Dakar (60%). C'est du *storytelling spatial*.

---

### (A) INTENTION & GESTE VISUEL PREMIUM (Actionnable)

| Moment | Intention narrative profonde | Geste visuel premium (Template/Technique) |
|--------|------------------------------|-------------------------------------------|
| **0-32s (Intro)** | Déconstruire deux mythes opposés pour créer un vide narratif (la "réalité" à venir). | **KineticMaskSlam** : Deux blocs typographiques géants ("MALÉDICTION" en texture craquelée sombre, "MIRACLE" en or lumineux) entrent en collision. Ils s'effritent (SVG mask dissolve) ou sont balayés par un "vent" (path animation). La caméra zoome dans le "O" de "RÉALITÉ" pour révéler la carte à 32s. |
| **32-45s (Sangomar)** | "Premier pétrole, souveraineté partielle, ancrage national". | **ComboFiberAuraPopup** : Frontière offshore tracée en laser (FiberOpticBorderDraw). Remplissage avec **ResourceTextureFill** (huile noire/or). Icône rig (Lucide `Factory` avec stroke animation). **GeoCountryPlaque** avec drapeaux AU+SN et le "18%" qui compte up (spring). Ligne épaisse vers Dakar (court-circuit national). |
| **45-60s (GTA)** | "Gaz transfrontalier, géopolitique des flux, remplacement russe". | **GeoFlowConnection** (V2) : Ligne pointillée dorée animée (dashoffset) partant du site, avec un **sprite**