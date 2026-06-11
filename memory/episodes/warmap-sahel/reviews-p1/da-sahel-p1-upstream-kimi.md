 Voici la review technique et créative, structurée pour prévenir l’amateurisme procédural avant codage.

---

### RÉPONSE AUX 3 QUESTIONS CRÉATIVES DU BRIEF

**1. Le "flot d'armes" : particules vs. encre**
Le risque "TikTok" est réel. Des particules SVG libres (même avec une texture) créent un effet "science-fiction / jeu vidéo" qui rompt la sobriété documentaire.  
**Parade :** Remplacer par un **path SVG animé en `stroke-dashoffset`** (trait d'encre qui se dessine) avec une largeur variable (tapering) : épais à la source (Libye), fin en pointe à l'arrivée (Mali). Utiliser un `feTurbulence` + `feDisplacementMap` sur le trait pour le faire frémir comme de l'encre sur papier rugueux. C'est du "dessin animé" (lisible, narratif) sans physique de particules (qui fait "généré").

**2. Matérialiser le vide d'État sans texte**
Les icônes "village" + "tension" risquent fort de ressembler à de l'UI de jeu de stratégie (clash of clans). C'est de l'**addition visuelle** là où il faut de la **soustraction**.  
**Parade :** Le vide se montre par **disparition de la couche "Forces gouvernementales"**. La zone bleue claire (ou la couleur choisie pour l'État) ne s'étend pas ou **s'efface progressivement** (mask animé) sur les zones rurales, révélant le parchemin brut en dessous. Pour les tensions anciennes : des **fissures fines** (paths SVG hairline, opacité 0.3) gravées dans le parchemin, geo-ancrées, qui s'assombrissent légèrement. Pas d'icônes, juste de la texture et du néant cartographique.

**3. Surcharge de la séquence 1.1→1.2→1.3**
Oui, risque de surcharge si tout bouge en même temps.  
**Parade stricte :**  
- **Beat 1.1** (0-3s) : Board clearing (fade tokens) + Pulse Libye seul. Caméra fixe.  
- **Beat 1.2** (3-9s) : Le path d'encre descend SEUL (la Libye reste visible mais s'estompe légèrement). Arrivée = spread d'encre (A1_INK_SPREAD) sur Kidal/Gao/Tombouctou.  
- **Beat 1.3** (9-15s) : **Drift caméra** (Ken Burns lent vers le sud) PENDANT que le path précédent passe à opacité 0.2 (reste en fond mais ne parasite plus). Puis, une fois le centre Mali cadré, **fade out** de la couche bleue État (le vide se révèle) et **fade in** des fissures de tension.  
Règle d'or : **Un seul élément dominant à l'écran par seconde.**

---

### ANGLES OBLIGATOIRES

**1. SPECTATEUR LAMBDA (Hiérarchie du regard)**
- **Problème :** Le spectateur ne sait pas où est la Libye sur cette carte (hors champ nord potentiel). S'il manque le point de départ, le flot semble sortir de nulle part.  
- **Piste :** Au beat 1.1, faire un **léger zoom-out** ou un **pan nord** pour que la frontière libyenne soit visible dans le tiers supérieur de l'écran (règle des tiers). Maintenir un repère subtil (un léger assombrissement du parchemin) sur la Libye pendant tout le beat 1.2 pour ancrer la source.

**2. NARRATION / SYNCHRO**
- **Problème :** Le beat 1.2 ("descendent vers le sud") dure ~6 secondes (75.5-69.9). Si le path SVG met 4s à se dessiner et 2s à s'effacer, c'est parfait. Si c'est instantané ou trop lent, la synchro est cassée.  
- **Piste :** Utiliser un **easing personnalisé** (cubic-bezier(0.4, 0, 0.2, 1)) pour que le trait accélère légèrement au début (effondrement brutal) et ralentisse à l'approche du Mali (installation progressive). Le "spread" d'encre sur les villes doit coïncider exactement avec la fin du mot "s'enflamme" (beat 1.2).

**3. TRANSITIONS vs ÉTATS**
- **Problème :** Risque de "diapos" si on coupe entre la Libye, le flot, et le Mali.  
- **Piste :** **Transitions liquides**. Le path d'encre relie physiquement la Libye au Mali ; il ne disparaît pas brutalement mais s'intensifie puis s'estompe (opacity 0.15) pour devenir une "veine" sous-jacente pendant le beat 1.3. La caméra ne coupe jamais, elle **glisse** (transform translate/scale sur le viewport SVG).

**4. AI-SLOP (Signes d'amateurisme procédural)**
- **Risque 1 :** Particules sans physique de fluide = "généré par IA".  
  **Parade :** Pas de particules. Path SVG avec `stroke-linecap: round` et animation de `stroke-dasharray` uniquement.
- **Risque 2 :** Couleurs trop saturées pour les "flammes" (rouge vif).  
  **Parade :** Utiliser la palette existante : des **taches d'encre brun-rouge** (même teinte que JNIM/EIGS mais plus diluée) qui s'étalent (scale + opacity) sur les villes. Même langage visuel que les jetons de l'Acte 1.
- **Risque 3 :** Easing linéaire (robotique).  
  **Parade :** Toutes les animations utilisent `cubic-bezier` avec une légère "trainée" (ink-like). Jamais de `linear`, jamais de `ease` par défaut.
- **Risque 4 :** Manque d'espace négatif pendant le beat 1.3 (trop d'icônes).  
  **Parade :** Soustraction visuelle (voir §2 ci-dessus). Le "vide" est du parchemon nu, pas du parchemin + symboles.

**5. EXPERT DU MÉTIER (Différence pro/amateur)**
- **Ce que l'amateur fait :** Ajoute des calques d'information (icônes, textes, flèches) pour expliquer.  
- **Ce que le pro fait :** **Manipule les calques existants**. La couche "Forces gouvernementales" n'est pas un fond, c'est un acteur narratif qui se retire (fade) pour révéler le vide. Les frontières administratives (GeoJSON) peuvent s'effacer légèrement (stroke-opacity 0.3) dans les zones de vide pour montrer que l'État (structure) disparaît.  
- **Manque à combler :** Une **légende temporelle** subtile. Le spectateur doit sentir qu'on est en 2012 sans lire de texte. Le repère "2012" doit apparaître avec un effet d'**encre qui dégouline** (feTurbulence sur un mask), pas un fade simple.

---

### SECTION OBLIGATOIRE — ÉVITER L'AI-SLOP (PRÉVENTIF)

| Risque identifié dans le plan | Parade concrète (Stack SVG/Opacité/Caméra) |
|-------------------------------|--------------------------------------------|
| **Particules "flot d'armes"** créant un effet "fond d'écran Windows Media Player" | Remplacer par un **`<path>` unique** avec `stroke-dashoffset` animé. Appliquer un filtre SVG `feTurbulence` baseFrequency="0.02" sur le path pour simuler l'irrégularité de l'encre. Largeur stroke variable via `stroke-width` animé (10px → 2px). |
| **"Flammes" aux villes** ressemblant à des emojis ou assets stock | Utiliser le template **A1_INK_SPREAD** existant : cercles SVG avec `transform: scale()` et `opacity` animés. Couleur : `#8B4513` (SaddleBrown) mélangé au rouge des jetons EIGS existants, mais à 40% opacity. Pas de jaune/orange (hors palette). |
| **Icônes "village/tension"** (beat 1.3) créant un clutter d'UI | **Suppression pure** : pas d'icônes. Utiliser une **texture de parchemin différente** (image overlay avec `mix-blend-mode: multiply`) qui apparaît dans les zones rurales. Pour les tensions : paths SVG fins (`stroke-width: 0.5`) en zigzag, opacité 0.2, qui "vibrent" légèrement (animation rotate 0.5deg) pour suggérer l'instabilité. |
| **Caméra drift robotique** (mouvement linéaire sans intention) | Caméra **frame-driven** avec easing `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out-quad). Le drift commence **après** que le flot d'encre s'est posé (beat 1.2 fini), jamais pendant. Direction : du nord (Libye) vers le centre Mali, suivant la route du flot. |
| **Timeline "2012"** apparaissant comme un texte Powerpoint | Texte "2012" en SVG avec un mask animé : l'encre "remplit" les chiffres depuis le bas (`y` mask animation). Police : même serif que les labels de villes (Bamako, etc.) pour cohérence. |

---

### SECTION OBLIGATOIRE — EXPERT CONSTRUCTEUR

**1. 2e AVIS SUR LES TEMPLATES CHOISIS**
- **A1_REGION_PULSES** pour la Libye : **Correct**, mais ajuster la fréquence. Un pulse lent (3s) suggère l'effondrement structurel, pas une alerte rapide.
- **A1_INK_SPREAD** pour l'arrivée au Mali : **Optimal** pour remplacer les flammes. S'assurer que les 3 taches (Kidal, Gao, Tombouctou) ne sont pas synchronisées (délai 0.2s entre chaque) pour éviter l'effet "copié-collé".
- **PATH_DRAW** (à créer) pour le flot : **Indispensable**. Utiliser un `clipPath` avec un gradient animé si besoin de "remplissage", mais le simple trait qui se dessine est plus lisible.
- **OPACITY_LAYERS** pour le vide d'État : **La clé du beat 1.3**. Animer l'attribut `fill-opacity` de la couche bleue gouvernementale, pas seulement l'alpha global, pour que les frontières restent visibles (structure fantôme) pendant que la couleur s'évacue.

**2. SI JE CONSTRUISAIS DE ZÉRO (Ordre et pièges)**
- **Étape 1 : Board Clearing** (0.0-1.5s) : Fade des jetons Acte 1 à opacity 0.15 + `filter: grayscale(80%)`. Ils deviennent des "fantômes" du futur, ancrant le spectateur dans le fait qu'on va expliquer leur origine.
- **Étape 2 : Ancrage temporel** (1.5-3.0s) : Apparition du label "2012" (ink fill) + léger assombrissement du reste de la carte (vignette dynamique) pour focaliser sur le nord.
- **Étape 3 : La Cassure** (3.0-6.0s) : Pulse Libye (subtil, pas stroboscopique).
- **Étape 4 : La Connexion** (6.0-12.0s) : **Un seul trait d'encre** part de la Libye, traverse le désert (suivre la route réelle via Ghat/Aouzou, pas une ligne droite mathématique), arrive au Mali. **Piège à éviter :** ne pas faire bouger la caméra pendant ce trajet ; le spectateur doit suivre le trait du regard sans panning.
- **Étape 5 : L'Infection** (12.0-15.0s) : Arrivée du trait = trigger immédiat des A1_INK_SPREAD sur les trois villes. Le trait s'arrête, les taches grossissent.
- **Étape 6 : Le Paradoxe** (15.0-22.0s) : **Drift caméra lent** vers le sud. Pendant le drift, les taches des villes passent à 0.1 opacity (elles restent mais s'effacent). Arrivée sur le centre Mali : **Fade out** de la couche bleue État (révélation du vide). Apparition des fissures de tension (0.3s de delay entre chaque pour effet "domino").
- **Piège majeur à éviter dès le départ :** Ne jamais montrer les jetons JNIM/EIGS pendant cette séquence. Ils sont le *résultat*, pas la cause. Les montrer créerait une confusion temporelle (on serait tenté de penser qu'ils descendent de Libye).

**3. ENCHAÎNEMENT POUR LA COMPRÉHENSION (Respirations)**
- **Respiration 1** (après 1.1) : La Libye pulse, puis reste "chaude" (légère teinte rosée fixe) pendant 1 seconde avant que le trait ne parte. Le spectateur intègre : "On parle de ce pays là-haut."
- **Respiration 2** (après 1.2) : Le trait arrive, les taches s'étalent, puis **pause 0.8s** avant le drift. Le spectateur comprend : "Le mal est arrivé ici (Nord Mali)."
- **Respiration 3** (pendant 1.3) : Le drift caméra vers le sud doit être assez lent (4-5 secondes) pour que le spectateur réalise qu'on change d'échelle (on quitte le front pour voir le terreau). Pendant ce drift, **aucun nouvel élément n'apparaît** (juste le mouvement). Puis seulement, le fade de l'État.  
- **Signal visuel de causalité :** Le trait d'encre du beat 1.2 ne disparaît pas complètement au beat 1.3 ; il devient une **ligne pointillée très fine** (opacity 0.2) qui relie toujours la Libye au Mali, rappelant silencieusement la cause pendant qu'on montre le terreau. C'est le fil narratif invisible qui évite la confusion "pourquoi on parle du centre Mali maintenant ?".

**Checklist finale anti-slop :**  
- [ ] Pas de rouge vif (hors palette parchemin)  
- [ ] Pas de mouvement de caméra sans easing personnalisé  
- [ ] Pas d'éléments qui "pop" (apparition brutale), tout doit "s'écouler" (ink)  
- [ ] Pas de texte explicatif sur la carte (sauf "2012" et noms de villes déjà présents)  
- [ ] Les jetons Acte 1 restent à 0.2 opacity tout le long (ils sont le contexte, pas le sujet)