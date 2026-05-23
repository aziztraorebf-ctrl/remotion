### 6-8 NOUVEAUX TEMPLATES (Comblement des lacunes & Exploitation de l'existant)

**1. FlowArrowsMap (Flux & Routes commerciales)**
*   **Anatomie :** Fond Mapbox minimaliste (`bg-navy`). Tracé progressif de flèches courbées SVG (via `stroke-dashoffset`). Épaisseur des flèches proportionnelle au volume. Étiquettes `text-ivory` suivant le chemin.
*   **Cas d'usage :** Maroc Batteries. Visualiser l'exportation des batteries vers l'Europe vs les investissements entrants depuis la Chine.
*   **Référence :** Caspian Report / Wendover (indispensable pour la géopolitique).

**2. StatComparisonSplitFlap (Choc des grandeurs économiques)**
*   **Anatomie :** Écran scindé verticalement. Typographie massive `text-stat-lg` `text-gold`. Utilisation du composant **`SplitFlap`** ou **`OdometerFlip`** pour faire défiler les chiffres de 0 au montant final. Sous-titres minimalistes.
*   **Cas d'usage :** Sénégal Pétrole. Contraste entre le PIB actuel et les revenus projetés du champ GTA (Grand Tortue Ahmeyim).
*   **Référence :** PolyMatter / Vox (Data-design pur).

**3. GeopoliticalRadarScan (Tensions & Découvertes offshore)**
*   **Anatomie :** Carte stylisée sombre. Le composant **`RadarScan`** balaie une zone maritime. Le composant **`RadarPing`** s'active sur des coordonnées précises, révélant des blocs SVG (Recraft) avec labels.
*   **Cas d'usage :** Sénégal Pétrole. Localisation des plateformes gazières sur la frontière maritime contestée/partagée avec la Mauritanie.
*   **Référence :** Real Life Lore / Caspian Report (Esthétique militaire/stratégique).

**4. SupplyChainShatter (Déconstruction d'une industrie)**
*   **Anatomie :** Un objet central SVG (généré par Recraft). Déclenchement du **`ShatterReform`** : l'objet éclate en 3-4 sous-composants qui s'alignent horizontalement. Apparition de connecteurs et textes explicatifs.
*   **Cas d'usage :** Maroc Batteries. Une batterie de VE éclate pour révéler la chaîne de valeur : extraction (Cobalt), raffinage, assemblage.
*   **Référence :** PolyMatter (Explication de systèmes complexes).

**5. ParadigmShiftTimeline (Rupture chronologique)**
*   **Anatomie :** Ligne de temps horizontale classique. Au passage d'une date clé, déclenchement du **`TimelineFracture`** : l'axe se brise, change de trajectoire (vers le haut) et l'environnement colorimétrique bascule (ex: gris vers `text-gold`).
*   **Cas d'usage :** Sénégal. Historique de l'économie pré-2014 (découverte) fracturé par l'ère de l'exploitation gazière (2024+).
*   **Référence :** Johnny Harris / Vox (Storytelling temporel dynamique).

**6. DeclassifiedBurnReveal (Preuve documentaire)**
*   **Anatomie :** Image de fond (Gemini : photo de sommet politique ou carte). Utilisation du **`BurnReveal`** (effet de papier qui se consume) pour révéler un document officiel (traité, contrat) en dessous. Suivi d'un surlignage.
*   **Cas d'usage :** Sénégal/Mauritanie. Révélation de l'accord de partage des revenus à 50/50 sur le champ GTA.
*   **Référence :** Johnny Harris (Esthétique journalisme d'investigation).

**7. DilemmaCoinFlip (Le choix binaire de l'État)**
*   **Anatomie :** Concept visuel centré. Une pièce/médaille SVG 3D. Face A visible (texte/icône). Déclenchement du **`CoinFlip`** pour révéler la Face B avec un changement de teinte dramatique.
*   **Cas d'usage :** Sénégal Pétrole. Le dilemme de la "Malédiction des ressources" : Face A (Boom économique) vs Face B (Inflation / Syndrome hollandais).
*   **Référence :** Caspian Report (Conceptualisation des impasses géopolitiques).

---

### CRITIQUE DU TOP 6 ACTUEL

**Top 6 actuel :** `MapboxSatelliteSenegal`, `CountryIsolatePin`, `HighlightedQuote`, `LineChartDrawOn`, `HatchedZone`, `TripleCollage`.

*   **Le trou béant (Priorité absolue) :** Aucune représentation de *flux* ou de *relations*. La géopolitique, c'est l'interaction. Il manque cruellement de flèches (exports, routes maritimes, influence). Le *FlowArrowsMap* proposé ci-dessus doit intégrer le Top 6.
*   **Redondance spatiale :** `CountryIsolatePin` et `HatchedZone` font doublon narratif (isoler une géographie). Il faut fusionner l'idée : on isole le pays, *puis* on hachure la zone d'intérêt en un seul template fluide.
*   **Faiblesse dynamique :** `TripleCollage` est un template de "remplissage" (B-Roll). Dans un format mid-form dense (5-8s), un collage statique fait chuter la rétention. À remplacer par une composition data-driven (ex: `StatComparisonSplitFlap`).
*   **Priorités mal classées :** `LineChartDrawOn` est essentiel, mais `HighlightedQuote` est souvent sur-utilisé. Dans le style Caspian Report, la carte et les datas priment sur les citations textuelles (plus propres au style Vox/Harris).

**Nouveau Top 6 recommandé :**
1. MapboxSatelliteSenegal (Contexte macro)
2. FlowArrowsMap (Interactions/Géopolitique) *(Nouveau)*
3. StatComparisonSplitFlap (Enjeux éco) *(Nouveau)*
4. HatchedZone + Isolate (Fusionnés - Focus micro)
5. LineChartDrawOn (Évolution)
6. ParadigmShiftTimeline (Chronologie) *(Nouveau)*

---

### BONUS : IDÉE ORIGINALE "OUTSIDE-THE-BOX" (Signature Souverain)

**Le Template : "LoomWeaver" (Le Métier à Tisser Géopolitique)**

*   **Concept :** Au lieu d'utiliser les classiques "points reliés par des lignes" (style PolyMatter/Wendover) pour montrer des alliances ou des chaînes d'approvisionnement, la signature visuelle de *Souverain* utilise la métaphore du tissage (inspiré des textiles africains Kente ou Bogolan, mais dans un design ultra-minimaliste et moderne).
*   **Mécanique Remotion :** Des fils de chaîne (verticaux, `text-ivory`) et de trame (horizontaux, `text-gold`) entrent dans le cadre et s'entrecroisent dynamiquement (via `stroke-dashoffset` et gestion des `z-index` alternés) pour former un motif solide représentant un accord, une alliance (ex: ZLECAf) ou un écosystème industriel (Maroc Batteries).
*   **Pourquoi ça marche :** C'est subtil, profondément ancré dans le patrimoine sémantique africain, visuellement hypnotique (excellente rétention sur 5-8s), et totalement absent des vidéos occidentales du benchmark. Cela crie "Premium" sans aucun effet tape-à-l'œil.