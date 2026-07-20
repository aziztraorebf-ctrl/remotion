**RÉPONSE CONCRÈTE — MISE EN SCÈNE ACTE 6**

---

### 1. LE GLOBE D3 PEUT-IL PORTER L'ABSTRAIT INSTITUTIONNEL ?

**Analyse beat par beat :**

**Beat 1 (L'arbitre manquant)** : **OUI, pur globe.**  
Le globe recule (zoom out depuis l'Acte 5) pour montrer la planète entière. Deux "phares" institutionnels apparaissent comme des pastilles lumineuses geo-ancrées : Addis-Abeba (UA) et New York (ONU). C'est dans le registre "réseau mondial" déjà prouvé.

**Beat 2 (UA suspendue)** : **OUI, globe + icône Lucide.**  
Le territoire soudanais sur le globe passe d'une teinte kaki standard à une teinte "grisée" (saturation -60%, luminosité -20%). Un badge circulaire geo-ancré apparaît au centre du Soudan : l'icône Lucide `ban` (ou `slash`) en contour blanc, rotation lente continue (360° sur 8s). C'est lisible : "fermé/interdit".

**Beat 3 (Le veto ONU)** : **PARTIELLEMENT — globe + overlay UI obligatoire.**  
Le globe seul peut montrer 15 points (les membres du CS) qui s'allument, mais la *logique* du vote (14 vs 1, le veto qui bloque) nécessite une géométrie de "parlement" pour être comprise instantanément. Solution : overlay SVG minimaliste (demi-cercle de 15 sièges stylisés) par-dessus le globe qui tourne lentement en fond. Pas de 3D complexe : 15 cercles SVG disposés en arc de cercle ( Rayon X = 35% de la width, Rayon Y = 20%).

**Beat 4 (La table de négociation)** : **NON — limite atteinte.**  
Une "table de négociation" est un concept diplomatique abstrait, pas un flux géo. Tenter de la représenter par des "arcs" entre pays sur le globe serait cryptique. **Recommandation : INSERT SVG** (registre "salle de réunion") pour ce beat précis, ou risquer l'AI-slop par sur-interpretation du globe.

**Beat 5 (Coût humain)** : **OUI, pur globe.**  
Zoom rapide sur le Soudan. Des "ondes de choc" concentriques (cercles SVG stroke-dashoffset) partent de Khartoum et El-Fasher. Des badges "13.5M" et "Famine" apparaissent en overlay HTML aux coordonnées projetées du Darfour. Retour au registre terrain, cohérent avec l'arsenal existant.

---

### 2. LIMITES IDENTIFIÉES & SOLUTIONS

| Beat | Limite du globe | Solution retenue |
|------|----------------|------------------|
| **3** | Un vote n'est pas un trajet géographique. 15 points sur un globe donnent une dispersion spatiale (Russie loin des USA) mais pas la logique de l'hémicycle politique. | **Overlay UI SVG** : demi-cercle de 15 sièges stylisés (géométrie pure) par-dessus le globe qui tourne en fond calme. |
| **4** | Une table de négociation n'a pas de coordonnées GPS. Représenter ça par des "connexions" sur le globe serait illisible. | **INSERT SVG** (plein écran) : salle de réunion vue de dessus, silhouettes autour d'une table rectangulaire, drapeaux Emirats visibles. Transition : fondu depuis le globe (le globe tourne, blur SVG simulé par opacity layers, on entre dans la salle). |

---

### 3. RECOMMANDATION DE DÉCOUPAGE FINAL

**Transition Acte 5 → 6** : Le globe de l'Acte 5 (réseau Emirats-Libye-Soudan) **zoome out** (échelle 0.8 → 2.5) pour passer de la vue régionale à la vue planétaire. Les arcs de flux s'estompent (opacity 1→0 sur 30 frames).

| Beat | Registre | Geste visuel unique & réalisable |
|------|----------|----------------------------------|
| **1** | **Globe D3** | Vue planétaire stabilisée. Apparition séquentielle (cascade 10 frames) de deux jetons-portraits institutionnels : `UA` (Addis-Abeba) et `ONU` (New York) avec icônes Lucide `building-2` au centre des pastilles. |
| **2** | **Globe D3** | Highlight du Soudan (frontière qui pulse une fois), puis désaturation du remplissage kaki vers gris neutre. Apparition d'un badge circulaire (80px) avec icône Lucide `ban` (stroke blanc, fill transparent) geo-ancré au centroïde du Soudan, rotation lente. |
| **3** | **Globe D3 + Overlay UI** | **Fond** : Globe qui tourne lentement (0.1°/frame). **Overlay SVG** : demi-ellipse en bas d'écran (y: 70% à 90%) avec 15 cercles (r=12px). Animation séquentielle : 14 cercles passent au vert kaki foncé (`#556B2F`), le cercle "Russie" passe au rouge brique (`#8B4513` — éviter le rouge #FF0000 trop agressif/accusateur). Un trait SVG épais (stroke-dashoffset animation) relie les 14 verts puis s'arrête sur le rouge. |
| **4** | **INSERT SVG** | Transition fondu (opacity). Scène : table de réunion vue de dessus (rectangle central, tons sépia/bleus nuit). Silhouettes circulaires autour (8 acteurs). Spotlight sur la silhouette portant le drapeau Emirats (halo jaune subtil). Les autres silhouettes ont des drapeaux USA, Russie, etc. (icônes Lucide `flag`). |
| **5** | **Globe D3** | Fondu retour sur le globe. Zoom rapide (2s) sur le Soudan. Cercles concentriques (3 cercles SVG stroke-only, dashoffset animé) partant de trois villes clés (Khartoum, El-Fasher, Nyala). Apparition de badges chiffrés "13.5M" (typo monospace, couleur blanche, ombre portée noire 2px) aux coords projetées. |

---

### 4. ANGLES OBLIGATOIRES — REVUE CRITIQUE

#### 1. SPECTATEUR LAMBDA (Non-initié)
- **Problème** : Au Beat 3, si on ne met que des points sur le globe, le spectateur ne comprendra pas qu'il s'agit d'un vote à l'ONU. Il verra juste des pays qui s'allument.
- **Piste** : L'overlay UI "hémicycle stylisé" (15 sièges) est indispensable. C'est une métaphore universelle (parlement). Ajouter un label "Conseil de Sécurité — Nov 2024" en haut de l'overlay (typo sans-serif 24px, couleur charte).

#### 2. NARRATION / SYNCHRO
- **Problème** : Au Beat 2, si la grisation du Soudan arrive avant que la voix ne dise "suspendu", le sens est perdu.
- **Piste** : Timing strict Remotion : au frame exact du mot "suspendu" (analyse waveform), déclencher le tween de désaturation du path Soudan (duration 40 frames). L'icône `ban` apparaît 10 frames après pour marquer la conséquence.

#### 3. TRANSITIONS vs ÉTATS
- **Problème** : Risque de "cut sec" entre le globe du Beat 3 et l'insert SVG du Beat 4.
- **Piste** : Utiliser une **transition morphing caméra simulée**. Le globe du Beat 3 continue de tourner mais son opacity passe de 1 à 0 entre les frames 120-150, pendant que l'INSERT SVG passe de 0 à 1 avec un léger scale (0.95 → 1.0). Créer l'illusion que la caméra "entre dans" la terre pour voir l'intérieur des institutions.

#### 4. AI-SLOP (Détection & Correction)
- **Problème 1 : Glows excessifs**. Un "veto" représenté par un glow rouge #FF0000 flou (blur CSS) crie "amateur/IA".
  - **Correction** : Pas de blur CSS. Utiliser un **cercle SVG stroke épais** (`stroke-width: 4px`) avec couleur rouge brique `#A0522D` et `opacity: 0.8`. Net et frame-driven.
- **Problème 2 : Particules random**. Des "dots" qui flottent pour représenter les déplacés (Beat 5) sans trajectoire claire = slop.
  - **Correction** : **Cercles concentriques géométriques** (SVG `circle` avec `stroke-dasharray` animé par `dashoffset`). Forme claire, mouvement maîtrisé, pas de physics engine.
- **Problème 3 : Typo système**. Arial ou Roboto par défaut, mal espacée.
  - **Correction** : Utiliser une police monospace pour les chiffres (Beat 5 : "13.5M") pour évoquer les stats humanitaires. Placement en `position: absolute` calculé par projection D3 (coords x/y), avec `pointer-events: none`.

#### 5. EXPERT DU MÉTIER
- **Ce qui manquerait** : Au Beat 4, l'absence de **hiérarchie visuelle** sur la table. L'expert voudrait voir immédiatement qui est "accusé" par les faits (les Emirats) sans que ce soit explicite.
  - **Piste** : Sur l'INSERT SVG, placer le drapeau Emirats à une position légèrement décalée vers le centre de la table (compositional weight), avec un halo subtil (stroke jaune #DAA520, opacity 0.3) qui pul lentement. Les autres acteurs ont des silhouettes grises. Le fait visuel (lumière sur eux) porte le jugement, pas une flèche rouge.

---

### 5. TEST AI-SLOP — SECTION TECHNIQUE SPÉCIFIQUE

**Diagnostic du risque sur l'Acte 6 :** Ce passage institutionnel est le plus exposé au "slop" car on tente de visualiser l'*absence* d'action (veto, suspension, échec) avec des outils conçus pour le *mouvement* (globe). Voici ce qui crierait "généré sans direction artistique" et comment l'éviter avec NOTRE stack.

| Élément à risque | Pourquoi c'est du SLOP | Correction concrète (Stack Kora) |
|------------------|------------------------|----------------------------------|
| **Le vote "pays qui s'allument"** | 15 pays sur le globe avec des couleurs vives #00FF00 / #FF0000, glows CSS, sans structure. | **Overlay SVG géométrique** : créer un composant React `<HemicycleSVG>` avec 15 cercles (`<circle>`) positionnés par calcul trigonométrique simple (cos/sin). Couleurs charte : vert `#6B8E23` (pour), rouge brique `#8B4513` (contre). Pas de glow, juste `fill-opacity` qui passe de 0.3 à 1 sur 20 frames. |
| **La "table de négociation" sur globe** | Tenter de mapper une texture "table" sur la sphère D3 ou des cylindres 3D sortant du globe. | **Coupure INSERT SVG**. Dessiner une table rectangulaire simple (`<rect>`) et des silhouettes (`<circle>` pour les têtes, `<path>` pour les épaules). Utiliser les icônes Lucide `users` ou `armchair` pour les sièges. Palette : sépia/bleus nuit (cohérent Acte 5). |
| **L'icône "suspendu"** | Un PNG pixellisé de cadenas ou un texte "SUSPENDU" en rouge impact. | **Lucide `ban`** : icône vectorielle nette, stroke-width 2px, animée par `stroke-dashoffset` pour un effet "tiret qui se dessine". Rotation continue lente (`transform: rotate(${frame}deg)`). |
| **Les chiffres "13.5M" flottants** | Texte brut en Helvetica, drop-shadow porcine, position aléatoire. | **Badge SVG maison** : `<rect>` arrondi (rx="4") fond kaki foncé, bordure blanche 1px. Typo monospace (`font-family: monospace`). Position calculée par `projection([longitude, latitude])` de D3. Animation `y` : décalage de 10px vers le haut sur 60 frames (effet "montée des eaux" symbolique). |
| **Easing robotique** | Transitions linéaires sur les zooms du globe (motion sickness). | **Cubic-bezier personnalisé** dans les tween Remotion : `cubic-bezier(0.25, 0.46, 0.45, 0.94)` pour les mouvements de caméra. Ralentissement (ease-out) sur les arrivées de focus. |

**Règle d'or anti-slop pour cet Acte :**  
**Privilégier la géométrie SVG codée main sur le globe D3, plutôt que d'essayer de forcer le globe à devenir une interface UI complexe.** Le globe est un décor (fond étoilé/planétaire), les concepts institutionnels sont des surcouches SVG/Lucide claires, nettes, sans blur.

**Checklist finale réalisable :**
- [ ] Beat 2 : Path Soudan sur le globe avec tween de couleur (kaki → gris) + `<BanIcon>` Lucide rotatif geo-ancré.
- [ ] Beat 3 : Composant `<UNVoteOverlay>` (SVG pur, 15 cercles) qui apparaît par-dessus le globe en `position: absolute`, pas dans le canvas D3.
- [ ] Beat 4 : Scène SVG plein écran (table, silhouettes, drapeaux) avec transition opacity cross-fade depuis le globe.
- [ ] Beat 5 : Triple cercle concentrique SVG (stroke-dasharray: "5,5") animé par frame sur le Soudan.

C'est réalisable, ça respecte la continuité du globe hérité de l'Acte 5, et ça évite l'écueil de "faire tourner le globe pour rien" quand le sujet est une table de négociation.