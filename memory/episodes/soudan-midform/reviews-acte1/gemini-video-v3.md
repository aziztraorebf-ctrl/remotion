**Q1. CAMÉRA — Cadrage**
**Verdict :** Oui, il faut un cadrage plus serré au début (Beats 1 et 2), puis un dézoom sur le Beat 3. 
**Justification :** Commencer sur une vue globale du Soudan alors que l'action se passe au Darfour (Ouest) crée un vide visuel et minimise l'importance de Hemeti. Démarre avec un zoom serré sur le Darfour pour les mines et l'apparition de Hemeti. Au Beat 3 ("3e plus grand pays"), utilise un *jumpTo* avec un *easing* très lent pour révéler l'ensemble du pays. Le risque de couper des jetons est nul si le dézoom est synchronisé *avant* l'apparition d'al-Burhan à l'Est.

**Q2. DRIFT CAMÉRA — Mouvement continu**
**Verdict :** Oui, un drift continu (Ken Burns très lent) est absolument indispensable.
**Justification :** Une carte totalement statique fait "diapositive PowerPoint". Un drift imperceptible (ex: un pan/zoom de 2 à 3% sur 10 secondes) donne vie au registre parchemin et renforce l'aspect "documentaire premium". Puisque tes jetons ont une taille écran fixe, ils glisseront de manière fluide avec la carte sans aucune distorsion ni perte de lisibilité.

**Q3. DYNAMISME — Rythme et ajouts visuels**
**Verdict :** Le rythme manque de liant géographique ; on a l'impression d'une simple succession de calques (apparitions de jetons). 
**Justification par beat :**
*   **Beat 1 :** Applique ta règle "On nomme -> ça se trace". Quand le Darfour est cité, trace son contour régional avec un effet trait de plume *avant* de poser les mines.
*   **Beat 2 :** Le halo rouge de Hemeti ne doit pas juste "apparaître" (fade-in plat). Fais-le pulser (scale de 0 à 100% avec un léger rebond) pour symboliser l'expansion de son pouvoir.
*   **Beat 4 :** Avant que les halos rouge et bleu ne s'installent, trace une ligne de front (trait d'encre noir, hachuré ou irrégulier) du nord au sud pour matérialiser physiquement le pays "coupé en deux".

**Q4. MINES D'OR — Drapeaux**
**Verdict :** (c) Aucune mine avec drapeau.
**Justification :** Mettre un seul drapeau donne l'impression d'une erreur (pourquoi pas les autres ?). Mettre trois drapeaux surcharge un espace déjà petit. Visuellement, les mines d'or (icônes) suffisent. C'est la voix off ("bénédiction du gouvernement") qui apporte le contexte politique. L'image doit rester épurée, façon carte d'état-major.

**Q5. RYTHME / CLARTÉ GLOBALE — Narration visuelle**
**Verdict :** Le récit est clair, mais la transition vers le Beat 5 (population prise au piège) risque d'être confuse si mal gérée.
**Justification :** Passer les militaires en semi-transparent est une excellente idée pour focaliser sur les civils. Cependant, il est crucial que les **halos de contrôle (rouge et bleu) restent bien opaques/visibles** en dessous. C'est ce contraste (civils nets sur fond de zones militaires colorées) qui fait comprendre visuellement le concept de "pris au piège". 

**Q6. PREMIUM — Améliorations (Remotion / Mapbox / SVG)**
**Verdict :** Ajoute de la physicalité aux éléments et de la profondeur à l'éclairage.
**Justifications concrètes :**
1.  **Physique des jetons ("Boardgame feel") :** À leur apparition, anime l'ombre portée (Drop Shadow) du jeton. L'ombre commence large et floue, puis se resserre et s'assombrit quand le jeton "touche" la carte (Scale 110% -> 100%). Ça donne un poids physique immédiat.
2.  **Texture des halos (Ink Bleed) :** N'utilise pas de simples gradients radiaux SVG pour les halos rouge/bleu. Applique un filtre SVG `feTurbulence` ou `feDisplacementMap` très léger sur les bords du halo pour simuler de l'encre ou de l'aquarelle qui bave dans les fibres du parchemin.
3.  **Éclairage global (Vignette) :** Ajoute un calque fixe par-dessus la carte (en mode produit/multiply) : un vignettage sombre sur les bords de l'écran et un centre légèrement plus chaud/lumineux. Cela simule l'éclairage d'une lampe de bureau sur une vieille carte et concentre le regard au centre.