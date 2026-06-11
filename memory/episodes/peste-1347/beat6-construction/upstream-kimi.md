Voici la review upstream, structurée pour verrouiller la construction avant codage.

---

## PARTIE A — TABLEAU DES SEGMENTS

| Segment vocal | Template / Effet | Enrichissement concret | SFX | Statut | Priorité |
|--------------|------------------|------------------------|-----|---------|----------|
| **"Deux épidémies, deux destins"** (0.0-1.5s) | **AtlasGeoAntithesis** (état existant du Beat 5) + micro-animation | **Respiration synchronisée** : Opacité des zones Europe (rouge) et Mali (or) qui oscille très subtilement (0.92 ↔ 1.0) en alternance — quand l'une inspire, l'autre expire. Pas de zoom, la carte reste stable pour ancrer la dualité. | Silence total ou ambience désert très basse (-40dB) | Déjà faisable | Haute |
| **"Un désert entre les deux"** (1.7-3.4s) | **AtlasGeoBarrier** modifié (style "fracture naturelle") | Au lieu d'une "digue" artificielle, tracer une **ligne ondulée fine** (1px) couleur ocre sable (#d4a373) suivant la limite sud du Maghreb/nord du Mali. Style "faille géologique" plutôt que mur. Stroke-dasharray de l'Atlantique vers l'Est. La ligne s'achève pile au moment où la voix dit "deux". | Grain de sable subtil (white noise filtré) | À coder mais faisable (modifier géométrie path) | Haute |
| **"La géographie n'est pas neutre"** (3.9-6.5s) | **Pull-back lent** + **Texte SVG stroke-dasharray** + **Vignettage** | 1. Zoom out très lent (5-8%) avec easing non-linéaire (cubic-bezier).<br>2. **Texte centré** (pas bandeau bas) : positionné dans le "vide" du Sahara, entre les deux mondes.<br>3. Écriture lettre-par-lettre synchronisée à la voix.<br>4. Vignettage progressif (radial gradient SVG) qui assombrit bords à 60% pour focaliser centre. | Musique désert crescendo final | Déjà faisable | Critique |

---

## PARTIE B — [MOMENT FORT] "La géographie n'est pas neutre"

Pour éviter l'effet PowerPoint et créer une signature mémorable :

**1. Positionnement anti-bandeau**
Ne pas mettre la phrase en bas (trop institutionnel). La placer **au centre vertical**, légèrement au-dessus du Sahara, comme une inscription gravée dans l'espace entre les deux civilisations. Utiliser une police serif (Cinzel) avec une légère ombre portée très diffuse (SVG filter shadow, PAS blur) pour la détacher du fond.

**2. Animation "encre fraîche"**
Pas de fade. Utiliser `stroke-dasharray` sur le contour des lettres (couleur #2c1810) puis remplissage progressif. La phrase doit finir de s'écrire exactement à la fin de la voix (6.5s), créant une tension jusqu'au dernier instant.

**3. Réaction des territoires**
Au moment où le point final s'inscrit (6.5s), déclencher un **dernier pulse simultané** : Europe (rouge) et Mali (or) clignotent une fois brièvement (opacity 1.0 → 0.8 → 1.0) comme un battement de cœur commun, répondant à la phrase. C'est la dernière image avant fade out.

**4. Espace négatif dramatique**
Pendant l'apparition du texte (3.9-6.5s), réduire l'opacité globale de la carte (pays et océan) à 0.5 pour que le texte et la ligne saharienne deviennent les seuls éléments en pleine lumière.

---

## PARTIE C — 3 IDÉES BONUS FAISABLES

1. **"Étoiles de Niani"**  
   Pendant le pull-back final, faire apparaître 3-4 points dorés (sprites pixel art 4x4px) sur Niani, Tombouctou et Gao, qui scintillent (opacity pulse lent) comme des étoiles fixes, contrastant avec les points rouges sombres des villes européennes.  
   *Statut : Déjà faisable (sprites + opacity animation).*

2. **"La route qui s'efface"**  
   Inverse de la barrière : pendant que la phrase finale s'inscrit, la route dorée Niani-Venise s'estompe progressivement (stroke-dashoffset inverse) symbolisant que la géographie (le désert) prime sur les routes commerciales temporaires.  
   *Statut : Déjà faisable (animation stroke inverse).*

3. **"Grain de temps"**  
   Overlay SVG d'un pattern texture parchemin (bruit Perlin simplifié en tile) avec opacity 0.05-0.1 qui "respire" (légère translation xy) pendant tout le Beat 6 pour éviter le plat vectoriel.  
   *Statut : À coder mais faisable (pattern SVG animé).*

---

## ANGLES OBLIGATOIRES

### 1. SPECTATEUR LAMBDA
**Problème** : Le spectateur ne sait pas forcément que le vide entre le Mali et l'Europe est le Sahara. Il peut croire que c'est juste de l'océan ou du vide cartographique.  
**Piste** : Ajouter un label "SAHARA" très discret (opacity 0.7, petit caractère) qui apparaît brièvement entre 2.0s et 3.0s, ou utiliser une teinte légèrement plus chaude/ocre pour le fond du désert (distinct du bleu nuit océan et du terracotta terres).

**Hiérarchie du regard** :  
- 0-1.5s : Regard balade entre le rouge (haut) et l'or (bas) — guidé par le pulse alterné.  
- 1.7-3.4s : Le tracé de la ligne force le regard à parcourir l'horizontalité du désert.  
- 3.9-6.5s : Le vignettage concentre forcément le regard au centre où apparaît le texte.

### 2. NARRATION / SYNCHRO
**Problème** : Risque de décalage si la barrière Sahara se termine avant que la voix dise "deux", ou si le texte apparaît trop tôt.  
**Piste** : Verrouiller les keyframes :  
- Début tracé ligne : frame exacte du "Un" (1.7s).  
- Fin tracé ligne : frame exacte du "deux" (3.4s).  
- Premier caractère texte : frame du "La" (3.9s).  
- Dernier caractère : frame de "neutre" (6.5s).

### 3. TRANSITIONS vs ÉTATS
**Problème** : Risque de 3 "diapos" figées si on coupe entre les phases.  
**Piste** : **Aucun cut**. Tout est fluide :  
- Le pulse continue sous la ligne qui se trace.  
- Le zoom out commence imperceptiblement dès 3.9s sans saccade.  
- Le texte s'écrit pendant que la caméra recule.

### 4. AI-SLOP (PRÉVENTIF)
**Ce qui crierait "généré par IA"** :  
- **Saturation agressive** : Rouge #ff0000 et Or #ffd700 criards (solution : respecter #8b1a1a et or mat #d4af37, moins de luminosité).  
- **Glow partout** : Si on met un glow rouge sur toute l'Europe et doré sur tout le Mali, ça fait clipart (solution : limiter le glow au strict minimum, ou l'éliminer au profit de variations d'opacité).  
- **Typographie fade générique** : Arial ou Roboto qui fondent (solution : Cinzel/Georgia + stroke-dasharray obligatoire).  
- **Mouvement mécanique** : Zoom out linéaire (solution : easing `cubic-bezier(0.25, 0.46, 0.45, 0.94)`).

### 5. EXPERT DU MÉTIER
**Ce qu'un pro ferait différemment** :  
- **Courbe de projection** : Animer légèrement la projection d3-geo elle-même (rotation x/y micro) pendant le zoom out pour donner une sensation de "globe" tangible, pas d'image plate.  
- **Parallaxe des labels** : Faire bouger les labels (Venise, Niani) 20% plus lentement que la carte pendant le pull-back pour créer de la profondeur (simulation z-index).  
- **Timing audio-visuel** : Le mot "neutre" devrait coïncider avec l'apogée de la musique (si possible), pas juste une fin technique.

---

## SECTION AI-SLOP — PRÉVENTIF SUR LE PLAN

| Risque identifié | Parade concrète (stack SVG/frame-driven) |
|------------------|------------------------------------------|
| **Couleurs clash Rouge/Or** (risque drapeau McDo) | Baisser saturation rouge à #8b1a1a (déjà prévu), or en #d4af37 (mat). Ajouter un overlay noir très transparent (opacity 0.15) sur toute la carte pendant le Beat 6 pour "vintageiser" et unifier. |
| **Barrière Sahara trop "mur de Berlin"** | Ne pas utiliser de ligne épaisse ou de glow. Utiliser ligne 1px style "fracture" avec stroke-linecap="round" et dasharray irrégulier pour aspect organique. Couleur : même teinte que le parchemin mais plus claire (inversion lumineuse). |
| **Texte final "collage WordArt"** | Intégrer le texte en SVG `<text>` avec `path` si besoin de courbe, pas HTML overlay. Utiliser `stroke-dasharray` sur le contour des glyphes avant remplissage. Police : Cinzel Bold. |
| **Zoom robotique** | Appliquer un `easeOutCubic` sur le zoom (factor interpolation non-linéaire). Ajouter un micro-drift sinusoïdal sur la position x/y de la caméra pendant le zoom (bruit de Perlin 2D) pour éviter la trajectoire mécanique. |
| **Manque de texture** (aspect vectoriel stérile) | Ajouter un `<pattern>` SVG de grain parchemin (image base64 répétée) en overlay avec `mix-blend-mode: multiply` et opacity 0.08. Animer sa position de 0,0 à 10,10 pixels pendant les 6.5s pour éviter la staticité. |

---

## SECTION EXPERT CONSTRUCTEUR

### 1. Nos templates choisis — 2e avis
**AtlasGeoAntithesis** et **AtlasGeoBarrier** sont les bons outils. Cependant, je suggère de combiner avec un **template "AtlasBreath"** (micro-animation d'opacité/alternance) pour le premier segment. Pour la barrière Sahara, détourner **AtlasGeoBarrier** en mode "ligne topographique" plutôt que "digue" — utiliser une géométrie de path qui suit les contours du désert (pas une ligne droite).

### 2. Si je construisais de zéro
**Ordre de construction** :  
1. **Base stable** : Carte avec Europe rouge/Mali or fixe (mais avec micro-drift permanent).  
2. **Rythme** : Introduire la respiration alternée (pulse opacité) pour créer le "dialogue" visuel.  
3. **Tension** : La ligne Sahara qui se trace (guidage du regard horizontal).  
4. **Résolution** : Pull-back + vignettage + texte qui s'inscrit (verticalité du recul et de la lecture).  

**Pièges à éviter dès le départ** :  
- Ne pas animer la barrière Sahara en même temps que le texte (surcharge narrative).  
- Ne pas faire apparaître le texte avant le recul de caméra (il flotterait sans ancrage spatial).

### 3. Enchaînement pour la compréhension
**Séquence pour le lambda** :  
- **0.0-1.5s** : "Je vois deux zones opposées" (pas de distraction, juste les couleurs).  
- **Respiration** : Cut invisible entre 1.5s et 1.7s (micro-pause) pour marquer la fin de l'antithèse.  
- **1.7-3.4s** : "Quelque chose separe ces deux zones" (la ligne guide l'œil de gauche à droite, on comprend que c'est le Sahara sans le nommer forcément).  
- **3.9-6.5s** : "Le message moral de l'histoire" (recul = prise de conscience, le texte est la conclusion intellectuelle).  

**Respirations** :  
- Pause à 1.6s (noir ou freeze 2 frames) entre les deux premières phrases.  
- Silence total à 6.5s avant le fade out (0.5s de "blanc" visuel pour laisser résonner).

---

## RÉPONSES AUX QUESTIONS SPÉCIFIQUES

**a) Direction actuelle (prolonger la carte) vs scène épurée ?**  
C'est la **bonne direction**. Une conclusion typographique pure casserait le contrat établi avec le spectateur (Atlas = cartographie). Cependant, il faut **épuré la carte progressivement** : retirer les labels secondaires (Florence, Venise, Maghreb) dès le début du Beat 6 pour ne garder que "NIANI" et peut-être un label "EUROPE" discret. La carte doit devenir une abstraction géographique, pas une carte routière.

**b) La digue Sahara : bonne idée ou cliché ?**  
C'est un **bon concept mais dangereux s'il est trop littéral** (mur/tranchée). Solution : ne pas l'appeler "digue" mais **"fracture"** ou **"faille"**. La tracer comme une ligne de contour topographique (fine, discontinue, ocre) plutôt qu'une barrière. Elle matérialise le vide, pas un obstacle artificiel. Alternative plus subtile : simplement **éclaircir la couleur du Sahara** (teinte plus chaude) pendant cette phrase pour le désigner comme sujet, sans ligne.

**c) Éviter l'effet "slide PowerPoint" pour la phrase finale ?**  
**Jamais de fondu simple**. Utiliser impérativement l'**écriture à la plume** (stroke-dasharray sur les lettres). Positionner le texte **au centre**, pas en bas. Faire interagir la carte avec le texte : quand le texte apparaît, la carte s'assombrit légèrement (opacity 0.6) pour que le texte soit le seul élément lumineux. Enfin, utiliser une police avec du caractère (Cinzel, pas Georgia) et une taille généreuse (20-25% de la hauteur d'écran).