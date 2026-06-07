**POINT DE VUE DE L'EXPERT — Motion Design Cartographique**

Ce que je regarde en premier : la **grammaire temporelle** et la **cinématique de caméra**. Dans un documentaire de qualité (style *Arte* ou *Financial Times*), la carte ne saute pas — elle respire. Ici, j'ai l'impression de regarder 4 diapositives PowerPoint avec des effets CSS basiques.

**Ce qui est raté/amateur :**

1. **La caméra est morte**. Vous avez 4 plans fixes coupés net. Un pro exploiterait Remotion pour faire **glisser la caméra** de manière continue : du Mali (Frame 1) qui zoome out pour révéler l'anneau CEDEAO (Frame 2), puis dérive vers l'est pour le focus JNIM (Frame 3), et plonge vers le sud pour la confrontation (Frame 4). Avec `useCurrentFrame` et des interpolations ease-in-out-cubic, ça coûte 3 lignes de code et ça transforme le statique en récit.

2. **L'absence d'anticipation**. Vos éléments apparaissent (pop) ou pulsent mécaniquement. Un pro ferait :
   - **Frame 1** : La frontière dorée ne pulse pas en sinusoïde linéaire — elle "bat" avec un easing `elastic(1, 0.5)` et, surtout, elle s'illumine *avant* que le texte n'arrive (préparation visuelle).
   - **Frame 2** : L'anneau CEDEAO ne devrait pas être un cercle static mais un SVG dont le `stroke-dashoffset` se dessine progressivement (0.8s), suivi des flèches qui apparaissent en *stagger* (décalage de 6 frames chacune) avec un trail (traînée SVG semi-transparente).

3. **La typographie statique**. Vos cartouches ("JNIM / LIÉ À AL-QAÏDA") et dates sont des images fixes. Amateur. Un pro anime le texte avec un `clipPath` qui se révèle (type-on effect) ou un masque glissant. La date en haut à droite devrait être un compteur mécanique (odometer) qui tourne entre les frames, pas un cut brutal.

4. **Le manque de "souffle" entre les actions**. Frame 4 : les véhicules se rapprochent — mais où est le *ralentissement* (ease-in) avant l'impact ? Où est le flash blanc SVG (simple `opacity` spike sur un overlay) au moment de la collision suggérée ?

**Ce qui manque (différence pro/amateur) :**

- **La gestion de la profondeur** : Frame 3, quand le carton JNIM apparaît, le fond devrait flouter (SVG `feGaussianBlur` animé sur les régions non concernées) pour guider l'œil. Vous avez tout à plat.
- **Les transitions de territoires** : Vos zones changent de couleur entre les dates (implicite), mais sans morphing. Un pro interpolerait les `fill` des SVG paths entre le bleu et l'or quand la date change, montrant la dégradation du contrôle.
- **La hiérarchie lumineuse** : L'éclairage est plat. Utilisez des overlays SVG dégradés (radialGradient animé) pour créer des "spots" sur la zone active, le reste de la carte passant en desaturation (filter `saturate`).

---

**POINT DE VUE DU SPECTATEUR LAMBDA**

**Ce qu'il cherche :** Une histoire claire. "Qui est où, qui fait quoi, quand." Il ne connaît pas la géographie du Sahel.

**Où il décroche :**

- **Frame 1** : "Ils ont expulsé leurs partenaires" — le spectateur cherche les partenaires. Il ne voit que le Mali qui pulse. Il ne comprend pas *qui* est expulsé (manque d'icônes de forces étrangères qui s'estompent avec une traînée vers la sortie de l'écran).
- **Frame 2** : L'anneau orange est ambigu. Est-ce un siège ? Une cible ? Une union ? Les 3 flèches convergent vers le Liptako-Gourma, mais sans label clair, c'est du décor abstrait. Le spectateur ne capte pas "naissance de l'alliance" mais voit juste "des flèches qui pointent vers le désert".
- **Frame 3** : Surcharge cognitive. Le carton central masque la carte qu'il essaie de lire. Les lignes fines reliant Bamako au carton ressemblent à des frontières ou des routes, pas à des liens hiérarchiques. Il ne sait pas si JNIM est une zone (rouge) ou un point (carton).
- **Frame 4** : Confusion des acteurs. Rouge vs Orange-brun — sur un écran mobile ou mal calibré, c'est la même couleur. Le spectateur ne distingue pas JNIM d'EIGS. Les véhicules sont de petits pixels sans direction évidente (pas de flèches de mouvement, pas de traînées).

**Ce qu'il ressent :** De la friction. L'œil saute partout sans guide. Il n'y a pas de "beat" visuel qui accompagne la narration. Quand le narrateur dit "quelque chose de nouveau", l'image devrait *exhaler* (zoom out doux), mais ici, rien ne bouge.

---

**SOLUTIONS TECHNIQUES (Dans vos contraintes Remotion/Mapbox/SVG)**

**Frame 1 (Le Hook) :**
- Animer la frontière dorée avec `stroke-dasharray` qui se dessine en spirale, puis pulse avec `scale` et `opacity` (0.6 → 1.0) en ease-elastic.
- Ajouter des icônes de drapeaux français/ONU qui *sortent* du territoire malien (translation X négative avec `opacity` fade out et blur croissant) pour visualiser "expulsion".

**Frame 2 (La Convergence) :**
- L'anneau CEDEAO : Cercle SVG avec `stroke-dashoffset` animé (se dessine), couleur orange pulsante douce (`opacity` 0.3 → 0.6).
- Les 3 flèches : Paths SVG avec `marker-end`. Animation : `stroke-dashoffset` + `opacity` staggered (0s, 0.15s, 0.3s). Ajouter une traînée (dupliquer le path, stroke plus large, opacity 0.2, décalage de 2 frames).
- **Caméra** : Zoom out simultané pour montrer que le Mali sort d'un système (CEDEAO) pour entrer dans un autre (convergence).

**Frame 3 (La Menace JNIM) :**
- Ne pas poser le carton brutalement. Le faire glisser depuis le haut avec `translateY` et `opacity`, mais surtout : **flouter le reste** (`backdrop-filter: blur(2px)` sur un overlay couvrant les zones non-rouges).
- Les zones rouges JNIM : Les faire "saigner" — `scale` de 0.95 → 1.0 avec `fill-opacity` 0 → 1 en ease-out-cubic, comme une tache qui s'étale.
- Les véhicules : Apparaître en séquence (stagger 0.2s) avec un effet "drop" (scale 1.5 → 1.0 + opacity).

**Frame 4 (La Confrontation) :**
- **Couleurs** : Augmenter le contraste. JNIM = rouge vif (#D00000), EIGS = violet-brun (#6B2D00) pour éviter la confusion.
- **Animation** : Les véhicules ne se déplacent pas linéairement. Ils avancent avec `ease-in` (ralentissement avant impact). Au point de rencontre : flash blanc SVG (rect blanc full screen, opacity 0 → 0.3 → 0 en 10 frames) + "shake" de caméra (translation X aléatoire de ±3px sur 5 frames).
- **Trails** : Lignes pointillées SVG animées (`stroke-dashoffset` en boucle) montrant le chemin parcouru, pour que le spectateur comprenne le sens du mouvement.

**Général (L'Expertise dans les détails) :**
- **Dates** : Compteur animé entre les frames (2020-08-18 → 2021-05-24), pas de cut. Les chiffres tournent comme un cadran.
- **Grain** : Animer légèrement le bruit du parchemin (noise SVG filter avec `seed` qui change toutes les 30 frames) pour éviter l'aspect "image figée".
- **Typo** : Utiliser `letter-spacing` animé (de 5px à 0px) sur les titres pour un effet "révélation" cinéma.

**Ce qui ferait la différence immédiate :** Une **caméra continue** et des **easing non-linéaires** sur chaque propriété animée. C'est gratuit en CPU avec Remotion, mais ça change tout. Actuellement, vous avez des états. Il vous manque les **transitions**.