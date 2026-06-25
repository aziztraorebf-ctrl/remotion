 **=== DIVERGENCE CRÉATIVE — ACTE 1 ===**

### A. CONCEPTS D'OUVERTURE COMPLETS (~32s)

**Concept 1 : "L'ÉJECTION" (Inversion du viseur)**
*Idée forte* : Au lieu d'un viseur extérieur qui "cible", ce sont les pays qui expulsent physiquement leurs partenaires. La violence du rejet est visuelle.
*Déroulé* : Frame 0-60 : Carte stable, calme. Frame 150 : Au mot *"chassent"*, des icônes de bases (petits drapeaux français, UE, OTAN) sont propulsées hors des capitales avec des trajectoires Bézier courbes (comme des débris), laissant des traînées de fumée SVG (paths gris à opacité dégressive) qui s'effacent. Frame 300-440 : Les contours des trois pays se soulèvent (ombre portée SVG dynamique `dx/dy` animés) comme des tapis qu'on secoue. Frame 600-900 (résolution du creux) : Les trois pays "flottent" maintenant 20px au-dessus de la carte (simulé par ombre portée large et floue légère), isolés en contre-plongée caméra (pitch 60°). La voix *"comment est-ce possible"* coïncide avec un zoom lent sur les interstices entre les pays (les frontières deviennent des lignes de fracture rougeoyantes pulsantes). Frame 900 : On plonge dans la fissure entre Mali et Burkina pour révéler le passé.
*Sidération* : L'inversion du regard. On ne vise pas, on explose de l'intérieur. La rupture est physique.
*Faisabilité* : Réalisable. Trajectoires SVG avec `interpolate(frame, [145, 180], [startPos, endPos])`, ombres avec filtres SVG `feOffset` + `feGaussianBlur` (léger).

**Concept 2 : "LA FAILLE TECTONIQUE" (Géologie politique)**
*Idée forte* : La CEDEAO est une plaque continentale qui se brise. Les trois pays dérivent comme un archipel qui se détache.
*Déroulé* : Frame 0 : La carte est une surface "rocheuse" (noise SVG subtil). Frame 150 : Au mot *"rompent"*, une fissure SVG (path épais noir) apparaît et s'ouvre (scaleY sur un masque clip-path) entre l'AES et le reste de l'Afrique de l'Ouest. Frame 300-440 : La fissure s'élargit en canyon. Les trois pays glissent lentement vers le nord-est (translateX/Y sur le groupe SVG des pays). Frame 600-900 (résolution du creux) : Le *gap* est maintenant un gouffre noir. La caméra *traverse* le vide (dolly in sur le noir), et c'est dans ce gouffre que des sprites d'archives (photos sépia des années 60) remontent du fond vers nous. Frame 900 : On émerge de l'autre côté dans le passé.
*Sidération* : La géographie devient fluide. On comprend visuellement la sécession comme un continent qui dérive.
*Faisabilité* : Moyennement complexe. Le clip-path animé sur la fissure est gourmand mais faisable avec des masques SVG simples. Le dérive des pays est un `translate` coordonné.

**Concept 3 : "LE SIGNAL PERDU" (Glitch diplomatique)**
*Idée forte* : L'ouverture est une perte de signal satellite. Le passage du présent militaire au passé analogique se fait par dégradation numérique.
*Déroulé* : Frame 0-60 : Interface de drone (lignes de scan SVG, reticule high-tech animé). Frame 150 : Au mot *"chassent"*, le signal se dégrade. Des "lignes de rupture" (rectangles blancs animés en opacity) traversent l'écran. Les icônes de partenaires deviennent des images glitchées (filtre SVG `feTurbulence` avec `baseFrequency` animé de 0 à 0.1) puis disparaissent. Frame 600-900 (résolution du creux) : Écran partiellement noir, scanlines actives (lignes horizontales qui descendent), bruit blanc SVG (points aléatoires placés via `seed` animé). La voix pose ses questions dans ce "brouillard de guerre électronique". Frame 800 : Le bruit se structure en une image d'archive nette (sprite) qui émerge du chaos.
*Sidération* : L'incertitude visuelle. On ne sait plus si on regarde le présent ou le passé, créant une dissonance cognitive qui force l'attention.
*Faisabilité* : Très réalisable. `feTurbulence` et `feDisplacementMap` sont performants en SVG. Le bruit est un pattern de points avec `opacity` aléatoire frame par frame.

**Concept 4 : "L'HORLOGE SABLÉE" (Temps suspendu)**
*Idée forte* : Le temps ne s'écoule plus normalement. Le "maintenant" est littéralement suspendu dans les airs.
*Déroulé* : Frame 0 : Un sablier géant transparent sur la carte. Frame 150 : Sable (30 particules SVG simples, cercles) tombe sur Bamako. Frame 300 : Sabliers locaux sur chaque capitale. Frame 600-900 (résolution du creux) : Le sable se fige à mi-chute (interpolate sur `cy` des cercles). La voix *"pourquoi maintenant"* coïncide avec cette suspension. Frame 700 : Le sable remonte (time reversal visuel) en emportant les couleurs actuelles (overlay sepia qui s'intensifie) pour révéler la carte historique sous-jacente.
*Sidération* : La manipulation du temps. Le "maintenant" est un moment fragile, suspendu, avant le basculement.
*Faisabilité* : Réalisable. 30 particules SVG avec positions interpolées frame par frame ne pose pas de problème de perf. L'overlay sepia est un `rect` SVG avec `mix-blend-mode: multiply` et `fill: #704214`.

---

### B. SOLUTIONS SPÉCIFIQUES POUR LE CREUX (f600-f900)

Si vous conservez la structure actuelle (3 pays figés), voici 3 traitements pour transformer ce vide en tension :

1. **"La Suspension Tectonique"** : Les trois pays se soulèvent de 15px (simulé par `translateY` négatif + ombre portée exagérée sous eux). La caméra passe en dessous (pitch 45° vers le haut). On voit le "vide" sous les pays : une carte historique (sépia) qui attend d'être révélée. C'est le moment où ils flottent entre deux eaux, entre deux alliances.

2. **"Le Stroboscope des Alliances"** : Pendant que la voix pose les questions, les anciens drapeaux des partenaires (France, UE, US) clignotent rapidement sur les capitales (3 frames opacity 1, 3 frames opacity 0). Puis ils laissent un afterimage rouge qui pulse lentement. Crée une anxiété visuelle, un "fantôme" de l'ancien ordre.

3. **"La Ligne Rouge du Basculement"** : Une ligne SVG épaisse dessine lentement un triangle entre Bamako-Ouaga-Niamey (stroke-dashoffset animé). Pendant le creux, cette ligne pulse comme un électrocardiogramme (stroke-width de 2 à 8px). Simple, minimaliste, mais crée une attente : qu'est-ce qui va naître de ce triangle ?

---

### C. FAISABILITÉ & RÉFÉRENCES

*Faisabilité générale* : Tous les concepts ci-dessus sont dans votre stack (React/SVG/Mapbox). Aucun ne requiert de 3D volumétrique ou de blur CSS. Les particules sont volontairement limitées (<50 éléments) pour garantir 60fps.

*Références précises à étudier* :
- **Johnny Harris** (Vox/YouTube) : Pour le *rythme* de la caméra. Il utilise des accélérations brutales (`easeOutExpo`) et jamais de drift linéaire. Regardez *"The World's Most Dangerous Border"* pour les transitions "plongeon dans la carte".
- **Polymatter** : Pour la densité d'information dans les "pauses". Même quand il pose une question rhétorique, des mini-graphs ou des icônes apparaissent (dataviz géo-ancrée). Votre creux actuel est trop vide comparé à sa standard.
- **Operations Room** : Pour l'esthétique "war map" sans tomber dans le cliché. Eux utilisent des "range circles" qui s'ouvrent comme des ondes sonores — proche de votre viseur actuel mais avec une physicalité (les cercles laissent une trace).

---

### D. RÉPONSES AUX ANGLES OBLIGATOIRES

**1. SPECTATEUR LAMBDA**
*Problème* : Dans le creux actuel (f600-900), le spectateur lambda ne sait pas où regarder. Trois rectangles beiges sans mouvement = perte d'attention immédiate. Il pense que la vidéo a planté.
*Piste* : Introduire un *guide visuel* obligatoire : une ligne, un pulse, ou une ombre qui bouge. Ex: Dans le Concept 2, le gouffre noir force l'œil vers le centre. Dans le Concept 4, les particules suspendues créent un point focal.

**2. NARRATION / SYNCHRO**
*Problème* : La voix dit *"Comment est-ce possible ?"* (question) pendant que l'image montre une carte statique (réponse implicite : rien). C'est un mismatch cognitif.
*Piste* : Chaque interrogation doit avoir un *beat visuel* d'interrogation. Ex: Zoom saccadé (step zoom), glitch, ou suspension du mouvement (Concept 4). Le visuel doit "hésiter" quand la voix hésite.

**3. TRANSITIONS vs ÉTATS**
*Problème* : f150 (Mali allumé) → f300 (viseur) sont des états figés avec interpolation linéaire (fade). C'est du "diaporama".
*Piste* : Remplacer les fades par des *mouvements de caméra continus*. Ex: Au lieu d'allumer le Mali puis couper, la caméra *traverse* le Mali vers le point central. Utiliser `interpolate` sur `bearing` et `pitch` pour un effet de "vol" continu, jamais de cut.

**4. AI-SLOP**
*Risques identifiés* :
- Le combo "parchemin + viseur" est devenu un cliché des chaînes YouTube histoire bas de gamme (RealLifeLore standard).
- Les couleurs pleines ocre/brique sans texture ressemblent à PowerPoint.
- L'easing `ease-in-out` sur tous les mouvements donne un aspect robotique.
*Piste technique* :
- Ajouter des *imperfections* : un léger tremblement sur les contours (noise sur les points du path), ou des variations de teinte très subtiles (`fill` légèrement différent à chaque frame).
- Varier l'easing : `easeOutExpo` pour les impacts (choc), `easeInSine` pour les départs lents.
- Utiliser des patterns SVG ultra-fins (hachures) plutôt que des aplats pour différencier les pays.

**5. EXPERT DU MÉTIER**
*Ce qui manque* :
- *La profondeur de champ simulée* : Chez les pros, les éléments non-focusés perdent en contraste (grisaille) et en opacité, pas juste du flou (que vous ne pouvez pas faire). Ex: Pendant le creux, le reste de l'Afrique devrait passer à 30% d'opacité pour forcer le regard sur les 3 pays.
- *Le "punch" de montage* : Votre drift caméra est trop linéaire. Un pro utiliserait des accélérations saccadées (frame 150 : cut brutal de vitesse, pas un lissage).
- *L'utilisation du négatif* : Le creux est vide, mais pas au sens "minimaliste japonais", au sens "oublié". Un pro mettrait là une information *secondaire* qui ne demande pas de lecture attentive mais enrichit le récit (ex: petite timeline qui défile en bas, ou icônes de population qui diminuent).

**Pour chaque frame spécifique** :
- **f600 (Creux)** : Doit être un *état de tension*, pas un état de repos. Ex: Les trois pays vibrato légèrement (rotation ±0.5° alternée) comme une machine qui surchauffe.
- **f700 (Drift)** : Remplacer le drift vide par une *chute* (Concept 2 : dans le gouffre) ou une *remontée temporelle* (Concept 4 : sable qui remonte).
- **f900 (Push-in)** : Arrive trop tard. La transition vers le corps doit commencer dès f700 pour être complète à f900.