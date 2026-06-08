 **1. VERDICT SUR LE VIRAGE JETONS**  
**OUI, mais sous conditions strictes.** Le véhicule-sprite échoue parce qu'il prétend à la réalité (échelle 1:1) dans un format où cette échelle est impossible (un pickup ne peut pas être à la fois lisible et géographiquement correct sur 3 pays). Le jeton circulaire réussit parce qu'il est **symbolique**, comme une pièce d'échec ou un sceau sur parchemin — il n'a pas de "taille réelle", donc il peut être grand enough pour lire le détail (visage, arme) sans rompre la suspension d'incroyance.  
**Le piège** : éviter l'effet "punaise PowerPoint" ou "jeton de Risk". Pour cela, le jeton doit s'intégrer à la grammaire "Atlas vivant" : texture parchemin, hachures façon portrait validé, et surtout **pas de glissement**, mais une "respiration" organique.

---

**2. PLAN BEAT PAR BEAT (f750 → f2280)**  
*Hypothèse : 30fps, durée totale 51s (25s→76s)*

- **f750-f960 (25s-40s) : LE TROU COMBLÉ — "L'avant"**  
  *Voix : "ce qui existait avant", "se sont développés au fil des années"*  
  **Visuel** : Pas de jetons encore. La carte est en "mode archive" : saturation baissée à 70%. Les zones "Contesté" (or #C99A3A) pulsent lentement (respiration 4s cycle). Des **années** apparaissent en sépia dans les coins (2012 → 2015 → 2021) avec un effet "encre qui sèche". Des **fissures** (SVG path drawing) apparaissent sur le parchemin dans le Centre-Mali et l'Est-Niger, visualisant la "rupture" avant l'arrivée des acteurs. La caméra fait un micro-drift lent vers l'est (0.3px/frame).

- **f960-f1200 (40s-50s) : JNIM — "Le rural diffuse"**  
  *Voix : "Le premier s'appelle le JNIM... centre du Mali, nord du Burkina"*  
  **Visuel** : 4 jetons JNIM (bordure rouge #B14B3C) apparaissent par **effet tache d'encre** (SVG turbulence filter qui se résout en cercle propre). Position : arc dispersé (Bamako-Niamey axe ouest). Ils ne glissent pas ; ils "s'installent" (scale 0→1 + léger overshoot). Derrière eux, la tache d'influence rouge grandit organiquement comme une moisissure sur parchemin.

- **f1200-f1500 (50s-60s) : EIGS — "L'est concentré"**  
  *Voix : "Le second s'appelle l'EIGS... zone des trois frontières"*  
  **Visuel** : 3 jetons EIGS (bordure sombre #3E2A18) apparaissent en **formation serrée** (triangle). Même effet d'encre, mais plus rapide (2s). Tache d'influence sombre qui s'étend depuis le nord-est Niger. Contraste immédiat avec la dispersion JNIM.

- **f1500-f1800 (60s-70s) : DIFFÉRENCIATION SPATIALE**  
  *Voix : "Les deux groupes ne coopèrent pas"*  
  **Visuel** : Les jetons "respirent" en alternance (JNIM pulse opacity 1→0.8 pendant qu'EIGS reste stable, puis inverse). Une **ligne de friction** subtile (trait pointillé gris) apparaît entre les deux zones d'influence, pulsant en rouge sombre pour montrer la tension.

- **f1800-f2280 (70s-76s) : CLÉ DE LECTURE**  
  *Voix : "Pour lire la carte correctement, il faut les voir séparément"*  
  **Visuel** : Zoom tactique léger (scale 1.1) sur la zone de chevauchement. Les jetons des deux camps font un "clignement" synchronisé (flash blanc sépia) pour marquer leur distinction, puis retour au calme.

---

**3. RECETTE D'INCARNATION DES JETONS**  
**Nombre & Placement :**  
- JNIM : 4 jetons (dispersion rurale). Positionnement : un à l'ouest de Bamako, un au centre Mali, un nord Burkina, un sud Niger (axe Liptako).  
- EIGS : 3 jetons (concentration frontalière). Triangle serré autour de la zone des trois frontières (Mali-Niger-Burkina est).

**Taille :**  
- **Screen-space constant** : 48px de diamètre (ni trop petit pour le détail, ni trop gros pour cacher la carte). Ne pas scaler avec le zoom caméra (reste 48px quelle que soit l'échelle géo).

**Apparition (L'anti-AI-Slop) :**  
- Pas de fade simple. Utiliser un **SVG mask** avec `feTurbulence` type="fractalNoise" qui évolue de 1→0 sur 20 frames. L'encre "gicle" puis se stabilise en cercle parfait.  
- Son : pas de "pop" digital, mais un froissement papier (asset audio léger).

**Vie/Mouvement organique :**  
- **Pas de translation X/Y** (évite le glissement fantôme).  
- **Respiration** : Scale 1.0 → 1.08 → 1.0 sur 3.2s (timing irrégulier par jeton pour éviter le sync robotique).  
- **Micro-drift** : Chaque jeton oscille dans un rayon de 3px (noise de Perlin 2D) pour simuler l'incertitude/la vie.  
- **Glissement interdit** : Si un jeton doit changer de position (rare), il disparaît (encre qui sèche) et réapparaît ailleurs, plutôt que de traverser la carte.

---

**4. LES 3-4 AJOUTS LES PLUS RENTABLES**  
1. **La tache d'encre derrière le jeton** : Un cercle de couleur (rouge/sombre) avec `feDisplacementMap` qui ondule légèrement, montrant le "territoire" sans durcir les frontières.  
2. **Le vignette temporel** : Sur le trou 25-40s, un fondu sépia progressif des bords vers le centre (radial gradient opacity) force l'œil sur la bande sahélienne active.  
3. **L'alternance de phase** : JNIM et EIGS ne pulsent jamais en même temps. Quand l'un inspire, l'autre expire. Crée du rythme sans mouvement.  
4. **Le "souffle" audio-visuel** : Un léger assombrissement global (opacity 0.9) pendant les phrases de la voix off, puis retour à 1.0 sur les mots clés ("JNIM", "EIGS") pour synchroniser l'attention.

---

**5. FAUX COUPABLE & VERDICT**  
**Faux coupable :** Le véhicule-sprite n'est pas le vrai problème — c'est **l'absence de temporalité** dans le trou 25-40s. Même avec des jetons, si ils poppent sans préparation historique, on a juste remplacé un problème par un autre.  
**Verdict :** Le virage jetons est validé **à condition** qu'ils ne "glissent" jamais et qu'on comble le trou par une **visualisation du temps qui passe** (les années, les fissures) avant leur arrivée. Sinon, on passe de "carte vide" à "jeu de société".

---

### ANGLES OBLIGATOIRES

**1. SPECTATEUR LAMBDA**  
*Problème :* Sur le trou 25-40s, il regarde une carte beige vide et ne sait pas où poser les yeux. Il entend "deux groupes" mais n'en voit qu'un (la carte). Il décroche.  
*Piste :* Utiliser le **vignette sépia** pour créer un "spotlight" sur la bande sahélienne (Mali centre → Niger est). Ajouter des **labels géographiques temporaires** ("Centre Mali", "Nord Burkina") qui apparaissent en synchro avec la voix pour ancrer le récit. Hiérarchie : Voix mentionne un lieu → Label apparaît → Œil va là.

**2. NARRATION / SYNCHRO**  
*Problème :* Actuellement, la voix dit "ils se sont développés au fil des années" mais l'image montre un état figé (2021). Décalage temporel.  
*Piste :* Sur "au fil des années", faire défiler **trois états de la carte** (2012, 2016, 2021) avec une transition "vieux papier" (décoloration progressive). Quand la voix dit "le premier s'appelle", un jeton JNIM apparaît exactement sur le mot "JNIM" (frame-perfect sync).

**3. TRANSITIONS vs ÉTATS**  
*Problème :* Risque de "diapos" (état figé → cut → état figé) avec les jetons qui poppent.  
*Piste :* Toutes les apparitions doivent être des **transitions organiques**. Pas de cut. Utiliser `opacity` + `scale` + `filter: url(#inkSpread)` sur 20-30 frames. Entre JNIM et EIGS, utiliser un **wipe** horizontal (mask moving) qui suit la géographie (ouest → est), pas un fondu noir.

**4. AI-SLOP (Test technique)**  
*Ce qui crie "IA/amateur" ici :*  
- **Easing linéaire** : Les éléments qui apparaissent à vitesse constante (robotique). *Correction :* Utiliser `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) pour les apparitions, et `cubic-bezier(0.4, 0, 0.2, 1)` pour les respirations.  
- **Couleurs plates** : Des zones d'influence en rouge pur avec opacité 50% qui piquent les yeux. *Correction :* Multiplier les calques : couche base (rouge #B14B3C à 30%) + texture parchemin (blend-mode multiply) + grain (noise SVG).  
- **Typographie flottante** : Labels sans lien visuel avec le terrain. *Correction :* Ligne de calligraphie (SVG path) qui relie le label au jeton, dessinée avec `stroke-dasharray` animation.  
- **Vide absolu** : Le trou 25-40s ressemble à un écran de chargement. *Correction :* Ajouter du "bruit" de carte (noms de villes secondaires qui apparaissent/fade) pour maintenir la densité informationnelle.

**5. EXPERT DU MÉTIER**  
*Ce qu'il jugerait raté :*  
- **Manque de "grain" temporel"** : Un pro mettrait des **scintillements** (des jetons qui "clignent" brièvement pour simuler des rapports radio/activité) pour montrer que c'est du temps réel, pas une illustration statique.  
- **Caméra morte** : Dans le trou 25-40s, la caméra doit **respirer** (drift lent + micro-zoom 0.98→1.02) pour éviter l'effet "image figée".  
*Ce qu'il ferait avec nos outils :*  
- **Z-index narratif** : JNIM (rouge) vs EIGS (sombre) — il ferait en sorte que quand on parle de l'un, l'autre passe en arrière-plan (opacity 0.4 + blur SVG léger via `feGaussianBlur` sur le groupe SVG, pas sur le DOM).  
- **Graphie des jetons** : Il insisterait pour que le silhouette à l'intérieur du jeton soit **hachurée** (comme le portrait militaire validé), pas un PNG lisse. Cohérence stylistique absolue.

---

### SECTION OBLIGATOIRE — TEST AI-SLOP (Détaillé)

**Problème 1 : La saturation des taches d'influence**  
*Symptôme :* Des blobs rouges/orange qui ressemblent à des heatmaps Google Maps cheap.  
*Correction Stack :* Utiliser `feDisplacementMap` avec une texture de parchemin en input pour déformer légèrement les bords des taches (effet "tache d'encre sur papier buvard"). Opacité jamais supérieure à 40%, blend mode `multiply`.

**Problème 2 : Les jetons "flottants"**  
*Symptôme :* Les cercles apparaissent au-dessus de la carte sans ombre ni ancrage, comme des stickers numériques.  
*Correction Stack :* Ajouter un `drop-shadow` SVG (filtre `feOffset` + `feGaussianBlur`) en dessous de chaque jeton, décalé de 2px vers le sud-est (lumière nord-ouest constante), couleur #3E2A18 à 30% opacity. Cela les "pose" sur le parchemin.

**Problème 3 : Le timing robotique**  
*Symptôme :* Tous les jetons de la même faction apparaissent exactement en même temps (frame 0→20).  
*Correction Stack :* Stagger manuel : jeton 1 à f960, jeton 2 à f975, jeton 3 à f990, avec des durées légèrement différentes (18f, 22f, 20f). Utiliser `Math.random()` seedé pour la phase de respiration de chaque jeton (pas le même point de départ dans le cycle sinusoïdal).

**Problème 4 : La typographie générique**  
*Symptôme :* Labels "JNIM" en Arial bold blanc avec ombre noire.  
*Correction Stack :* Police serif historique (ex: Cinzel ou EB Garamond) en #3E2A18 (sombre), pas blanc. Positionnement en haut à gauche de la zone, avec un **liseré parchemin** derrière le texte (rectangle #F3E9C8 avec opacité 0.8) pour lisibilité sans casser l'esthétique.

---

### SECTION OBLIGATOIRE — POINT DE VUE DE L'EXPERT

**1. L'EXPERT RECONNU**  
*Premier regard :* Il vérifie la **cohérence de lumière**. Si les jetons ont une ombre portée, elle doit correspondre à l'éclairage de la carte (généralement nord-ouest pour les cartes historiques).  
*Ce qui manque pour être pro :*  
- **La légende dynamique** : Quand JNIM apparaît, un pictogramme JNIM doit s'ajouter à la légende en haut à gauche (validée dans le brief) avec une animation de "tampon" (scale bounce).  
- **Le relief** : Un pro ajouterait un **subtle bump map** sur les jetons (SVG filter `feDiffuseLighting`) pour qu'ils aient l'air embossés sur le parchemin, pas plats.  
*Transition pro :* Au lieu de couper entre "avant" (25s) et "JNIM" (40s), il ferait un **match-cut** : une fissure dans le parchemin à l'ouest (25s) s'ouvre et devient la bordure rouge du premier jeton JNIM (40s). Continuité graphique.

**2. LE SPECTATEUR LAMBDA**  
*Ce qu'il cherche :* Une raison de regarder à l'ouest puis à l'est.  
*Où il décroche :* Si les deux groupes apparaissent simultanément (surcharge cognitive).  
*Solution dans nos contraintes :* **Spotlight séquentiel**. Quand on parle de JNIM, le reste de la carte (EIGS inclus) passe à 60% brightness. Quand on passe à EIGS, c'est l'inverse. C'est du simple SVG `opacity` sur des groupes, mais ça guide l'œil comme un projecteur. Le spectateur sait toujours "où regarder" parce que le reste est volontairement assombri (vignette dynamique).