**MANDAT — PASSE PREMIUM : AUDIT PARTIE 3**
*Review Direction Artistique & Technique — Stack Mapbox/Remotion frame-driven*

---

### 1. TEMPS MORTS (Priorité 1 : Tuer la carte morte)

**Moments identifiés (approximatifs sur timeline 1min50) :**

| Timecode | Diagnostic "Carte morte" | Solution immédiate (dans stack) |
|----------|-------------------------|--------------------------------|
| **00:03-00:05** | Entre la fade-out de l'overlay AES et l'apparition de Kidal. Carte grise/beige uniforme, aucune texture, pas de respiration. | **Activer immédiatement un "drift" caméra lent** (0.2px/frame) sur le Sahara + apparition progressive des **sprites-lieux Gemini** (pistes, montagnes) autour de Kidal *avant* le zoom. Ne pas attendre le focus sur Kidal pour peupler l'environnement. |
| **00:08-00:11** | Statu quo Touaregs + ONU. Deux bases statiques, deux portraits figés. Impression de "pause PowerPoint". | **Animer les bases ONU** : ajouter des sprites PixelLab de véhicules/blindés légers qui patrouillent en boucle autour des bases (rayon court, 20px). Ajouter un **halo "no-fire"** (cercle rouge barré) qui pulse lentement (opacity 0.3→0.6) pour signifier "présence sans mandat de combat". |
| **00:12-00:15** | Offensive en tenaille. Les jetons FAMa/AfricaCorps bougent mais sans trajectoire visible, flottant au-dessus du vide. | **Waypoints "wet ink" visibles** : tracer les lignes d'approche *avant* que les jetons ne bougent (dash-array animé). Ajouter des **sprites PixelLab de colonnes marchant** le long de ces lignes (2-3 sprites par axe, échelle 0.6) pour incarner le "matériel" qui avance, pas juste les chefs. |
| **00:18-00:22** | Flashback Moura. Sépia appliqué, mais la tache de sang est statique (cercle bordeaux). Manque d'ancrage traumatique. | **Distorsion temporelle** : ajouter un **vignettage dynamique** (masque radial qui se resserre sur Moura) + **grain de film accentué** (intensité x3 sur cette séquence). Faire pulser la tache de sang comme un cœur (scale 1.0→1.1) sur 2s pour signifier "blessure ouverte". |
| **00:24-00:28** | Combat 2026. Jetons rouges vs bleus qui se superposent sans collision narrative. Espace vide autour. | **Champ de bataille**: ajouter des **ondes de choc concentriques** au point de contact (frame 0-15 de l'impact). Ajouter des **sprites PixelLab d'explosions** (2-3 frames) au moment du choc. Ne pas laisser les jetons statiques : les faire "reculer" légèrement (10px) sur l'impact pour simuler le rebuff. |
| **00:29-00:32** | Fin serrée. Zoom-out sur losange Mali flottant seul. Carte vide, perte de tension. | **Résolution territoriale**: activer le "fond de contrôle territorial" (déjà prévu) mais avec **texture de "sable stabilisé"** (bichromie bleu clair/bleu foncé) qui s'étend depuis Kidal vers le sud. Ajouter des **jetons de garnison** (petits cercles sans portrait, juste drapeau) qui apparaissent sur les capitales régionales pour signifier "tenir les points clés". |

---

### 2. RÉTENTION — Transformer le mouvement en intention narrative

**Le problème "jetons sans raison"** vient de l'absence de **causalité visuelle préalable**.

*Piste corrective :*
- **Anticipation systématique** : Avant tout déplacement de jeton, afficher une **flèche SahelAttackArrow fantôme** (opacité 0.3) qui indique la direction 1s avant le départ. Le spectateur lit l'intention avant l'action.
- **Easing narratif** : Remplacer les interpolations linéaires sur les waypoints par des **easeInOutCubic** (accélération puis décélération). Un jeton qui démarre net et s'arrête net = robotique. Un jeton qui "amorce" = humain/tactique.
- **Hiérarchie de regard** : Utiliser la **désaturation locale**. Quand la voix dit "Kidal", tout le reste de la carte passe en grayscale 0.7, sauf la zone concernée. Quand la voix dit "Moura", c'est le centre du Mali qui reste coloré. Le spectateur sait toujours où regarder sans effort.

---

### 3. EXPLOITER LA CARTE VIVANTE (Mapbox sous-utilisé)

**Ce qu'on ne sollicite pas assez :**

- **Relief/Pitch tactique** : Pendant l'offensive sur Kidal (Nov 2023), incliner la caméra à **pitch 35-40°** pour révéler les montagnes de l'Adrar des Iforas (relief Mapbox). Cela explique *visuellement* pourquoi la ville était imprenable (verrou géographique). Revenir à **pitch 0°** (top-down) uniquement au moment de la prise, pour un effet "écran de situation".
- **Ombres portées** : Ajouter sous chaque jeton une **ellipse noire SVG** (scaleY 0.3, opacity 0.2) décalée selon une source de lumière fixe (haut-gauche). Quand le jeton bouge, l'ombre bouge. Ancrage immédiat au sol.
- **Atmosphère désert** : Overlay canvas avec un **"heat haze"** (lignes ondulantes horizontales, opacity 0.05) sur les zones sahéliennes. Effet subtil mais vivant.
- **Profondeur par le brouillard** : Activer le **fog Mapbox** (horizon blend) pour masquer légèrement les bords de la carte, concentrant le regard sur le centre d'action.

---

### 4. AUDIT STACK — Assets sous-utilisés

| Asset | Utilisation actuelle | Sous-utilisation critique | Action concrète |
|-------|---------------------|--------------------------|-----------------|
| **PixelLab** | Absent des frames fournies | **Très critique**. On a des sprites animés (marche/combat) et on ne les utilise pas pour la colonne d'assaut ni pour le retrait ONU. | Générer 3 sprites: 1) Colonne de trucks ONU qui roule vers le nord (retrait Nov 2023), 2) Infanterie FAMa qui avance en file indienne (tenaille), 3) Explosion pixel (combat 2026). Les ancrer sur les waypoints avec `useCurrentFrame` pour la boucle de marche. |
| **Gemini (sprites top-down)** | Bases ONU, Kidal | Manque d'**obstacles géographiques narratifs**. | Générer: 1) Un "poste de contrôle" (barrière/bunker) sur la route de Kidal, 2) Des "montagnes" (rochers) autour de Kidal pour justifier la tenaille (passage obligé), 3) Un "campement touareg" (tentes) à côté des portraits Touaregs (phase statu quo). |
| **Jetons portraits** | Chefs militaires/Touaregs | Manque de **différenciation d'unité**. | Créer des sous-catégories visuelles: **Africa Corps** = casque russe/teinte grise sur le portrait, **FAMa** = béret vert/teinte sable. Quand ils se séparent après la prise de Kidal, on comprend visuellement qui tient quoi. |
| **TerritorialExpansion** | Losange Mali | Pas utilisé pour l'**expansion progressive**. | Au lieu d'un losange qui pop, utiliser TerritorialExpansion avec un **mask clipPath** qui grandit depuis Kidal vers les points cardinaux, frame par frame, synchronisé avec la phrase "la région se remplit". |
| **Sillage "wet ink"** | Non visible | Absent des déplacements. | Activer sur *tous* les déplacements de jetons (opacity 0.4, couleur du jeton) pour tracer l'histoire du mouvement. Effet "trace du doigt sur la poussière". |

---

### 5. BENCHMARK — Ce que la concurrence premium a (et pas nous)

**Kings & Generals :**
- **Pictogrammes d'armée** : Ils n'utilisent pas que des portraits, mais des icônes de unités (infanterie, cavalerie) qui changent de formation. *Nous:* Ajouter des **badges SVG** (deux fusils croisés) sous les portraits des jetons pour indiquer "force militaire" vs "leader politique".

**Ollie Bye (morphing territorial) :**
- **Transitions liquides** : Les changements de frontière se font par "remplissage" progressif. *Nous:* Notre TerritorialExpansion est brutal. Le transformer en **"ink spread"** (propagation d'une tache via un algorithme de flood fill animé frame par frame) plutôt qu'un simple fade.

**Al Jazeera Carto :**
- **Typographie d'urgence** : Textes courts, gras, placés en coin, qui disparaissent vite. *Nous:* Nos plaques parchemin sont trop centrales et statiques. **Déplacer les labels en overlay semi-transparent près des jetons** (style "tag" militaire) avec une police plus condensée (sans-serif étroit), pas une serif classique.

**Ce qu'ils ont tous et nous manque :**
- **Échelle temporelle relative** : Une barre de "distance" ou "temps de trajet" (ex: "3 jours de route") qui s'anime quand les jetons bougent. *Solution:* Ajouter un **count-up de "km parcourus"** en overlay lors de l'offensive sur Kidal pour rendre tangible l'effort logistique.

---

### 6. DÉFAUTS À FIXER (lisibilité & rythme)

- **Superposition z-index** : Quand les jetons FAMa et Africa Corps se rejoignent (tenaille), ils se chevauchent mal. **Fix:** Implémenter un léger **écartement automatique** (spread) quand deux jetons sont à <20px l'un de l'autre, ou un **effet de "stack"** (un jeton légèrement décalé en hauteur pour montrer la coordination, pas la fusion).
- **La timeline "trop présente"** : Elle occupe 10% de la hauteur en bas pour une info (l'année) redondante avec la voix. **Fix:** La réduire à une **barre fine de 4px** avec un curseur doré qui **clignote** aux changements d'année, sinon reste discret.
- **Manque de "impact frame"** : Quand Kidal est reprise (moment fort), il n'y a pas de **flash blanc** ou de **shake** subtil. **Fix:** Un **flash #C9A24B (or)** de 3 frames sur toute la carte au moment de la prise, suivi d'un **zoom-out très lent** (0.5% sur 2s) pour signifier le "souffle" de la victoire.
- **Typo des noms de ville** : "KIDAL" est dans une box trop lourde. **Fix:** Texte blanc pur (pas de box) avec un **halo noir** (stroke 2px #000, opacity 0.5) pour la lisibilité sur le sable, style carte tactique militaire.

---

### 7. HIÉRARCHISE — TOP 3 Impact/Effort

| Rang | Action | Effort Technique | Impact Premium | Pourquoi |
|------|--------|------------------|----------------|----------|
| **1** | **Wet Ink + Waypoints visibles** sur tous les déplacements de jetons. | Moyen (déjà dans stack, activation systématique) | **Très élevé** | Transforme immédiatement le "glissement magique" en "trajectoire logique". Résout le problème "jetons sans raison". |
| **2** | **Sprites PixelLab sur les axes d'approche** (colonne marchante pour Kidal, retrait ONU). | Moyen (pipeline existant, génération assets) | **Très élevé** | Donne l'impression d'une "armée" réelle, pas d'abstractions. Différencie immédiatement du "template Mapbox". |
| **3** | **Pitch caméra variable** (35° sur l'approche de Kidal, 0° sur la prise) + **ombres portées SVG** sous les jetons. | Faible (paramètres de caméra + SVG ellipse) | **Élevé** | Crée de la profondeur et du "réalisme tactique" sans coût de rendu. |

---

### ANGLES OBLIGATOIRES — ANALYSE PROFONDE

#### 1. SPECTATEUR LAMBDA (Le néophyte du Sahel)
**Où il décroche :**
- **00:06** : Il ne sait pas où est Kidal par rapport au reste du Mali (échelle). La carte zoome direct sans contexte géo.
- **00:13** : Il ne comprend pas la "tenaille" (tactique militaire) car deux jetons qui convergent = juste deux points qui se touchent, pas une manœuvre.
- **00:20** : Le flashback à Moura (2022) est trop subtil (juste un sépia). Il ne comprend pas qu'on remonte le temps.

**Fix :**
- **Contexte géo** : Garder un **encart miniature** (carte du Mali entier avec rectangle de zoom) en coin haut-droite pendant le zoom sur Kidal.
- **Lecture tactique** : Ajouter une **ligne brisée** (chemin) qui relie les deux forces FAMa/AfricaCorps avec un **angle de convergence** dessiné (comme sur les cartes d'état-major). Le lambda voit alors la "pince".
- **Flashback** : Faire **reculer le curseur timeline de 2023 à 2022** visuellement (animation fluide) + ajouter un **label "RAPPEL 2022"** en haut de l'écran, pas juste sur la carte.

#### 2. NARRATION / SYNCHRO
**Décalages :**
- L'overlay AES (00:00-00:03) reste alors que la voix enchaîne déjà sur "Kidal, ville isolée". La carte est déjà passée à autre chose, mais l'overlay bloque la vue.
- Le son dit "les forces avancent en tenaille" à 00:12, mais les jetons bougent à 00:14.

**Fix :**
- **Beat matching** : Chaque phrase clé doit avoir un **trigger visuel frame-précis** (utiliser les SFX déjà prévus pour marquer le beat). Ex: Quand la voix dit "se retire", les bases ONU commencent à **clignoter** (3 frames on/off) puis fade out.
- **Overlay dynamique** : L'overlay AES doit commencer à **glisser vers le haut** (translateY -50px + opacity down) dès que la voix prononce "Kidal", libérant l'espace visuel avant même la fin de la phrase.

#### 3. TRANSITIONS vs ÉTATS
**Problème** : On a des états figés ("diapos") entre :
- La prise de Kidal (losange Mali) et le flashback Moura (cut sec).
- Le retour à 2026 (cut sec).

**Fix :**
- **Transition temporelle** : Utiliser un **effet de "distorsion"** (shaders simples sur un canvas overlay) : la carte se "tord" comme du papier brûlé pendant 10 frames pour passer au sépia de Moura.
- **Fond de carte commun** : Maintenir un **élément constant** pendant la transition (ex: la ville de Kidal reste visible mais désaturée) pendant que le reste change. Cela crée la continuité narrative.

#### 4. AI-SLOP (Test critique)
**Ce qui crie "généré procéduralement" :**

- **La propreté aseptique** : La carte est trop propre. Pas de poussière, de traces de doigts, d'imperfections de papier qui bougent. *Fix:* Animer le **grain papier** (déjà dans stack) pour qu'il se déplace légèrement (offset aléatoire frame par frame, amplitude 1px) pour simuler la texture d'un projecteur/ancien film.
- **Typo générique** : La police des labels est probablement une Inter ou Roboto standard. *Fix:* Utiliser une **police serif condensée** (type "IM Fell English" ou "Merriweather") pour l'historique, et une **sans-serif stencil** (type "Black Ops One" allégé) pour les noms militaires (FAMa, Africa Corps). Cela crée une hiérarchie de registre (Histoire vs Tactique).
- **Easing mécanique** : Les interpolations de `map.jumpTo` sont probablement linéaires. *Fix:* Forcer un **easing personnalisé** (cubic-bezier 0.45, 0, 0.55, 1) sur tous les pans/zooms pour un mouvement "lourd" de caméra d'époque.
- **Manque d'espace négatif abusif** : Les éléments sont trop centrés, trop symétriques. *Fix:* Décaler les jetons de **5-10px aléatoirement** de leur position géo exacte (offset calculé une fois au montage, pas animé) pour casser la grille invisible.

#### 5. EXPERT DU MÉTIER (War Room Cartography)
**Ce qu'il jugerait raté :**
- **Absence de "ligne de front"** : On montre des points (villes) mais pas la continuité spatiale. Un état-major dessine des lignes entre les points tenus. *Fix:* Ajouter des **lignes SVG** (dash-array animé) reliant les positions tenues par le même camp, créant des "zones de contrôle" visuelles continues, pas juste des points.
- **Échelle flottante** : On ne sait jamais si on voit 50km ou 500km. *Fix:* Insérer une **échelle graphique** (barre blanche avec "100 km") qui apparaît/disparaît lors des zooms.
- **Symboles militaires standard manquants** : Les jetons sont des photos, pas des symboles OTAN. *Fix:* Superposer en petit (coin bas-droit des jetons) un **symbole tactique** (carré = infanterie, losange = cavalerie) pour le public initié, sans gêner le lambda.

---

**SYNTHÈSE EXÉCUTIVE POUR CLAUDE :**

Pour passer au premium sans tout recommencer, concentre-toi sur **l'incarnation du mouvement** (wet ink + PixelLab) et **l'ancrage géographique** (pitch/relief + ombres). La carte doit passer de "fond de décor" à **acteur narratif** (elle respire, elle se tord, elle porte les traces des passages). Le reste est affinement de timing et de typographie.