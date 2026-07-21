Voici un plan d'action concret pour enrichir le langage du globe dans vos actes 3-6, strictement calibré pour D3.js + SVG 2D.

---

### VOLET 1 : EMPHASE SUR UN PAYS NOMMÉ
**Problème** : Le remplissage drapeau est plat. Le spectateur ne sait pas où regarder.

**Solution prioritaire : Le "souffle" de frontière**
- **Timecode** : ~3:40 (Turquie), ~4:10 (Égypte), ~4:43 (Russie)
- **Statut** : À CODER (réaliste, ~2h dev)
- **Effet SVG exact** : Au moment du nommage, le `path` du pays passe à `stroke-width: 3px` (contre 0.5px) avec un `stroke: #FFD700` (or) ou blanc cassé, et une `filter: url(#glow)` (feGaussianBlur stdDeviation="2"). Le `stroke-opacity` pulse une fois de 0 → 1 → 0.6 en 800ms. 
- **Pourquoi ça marche** : C'est discret mais immédiat. L'œil est attiré par le mouvement du contour sans que le remplissage drapeau ne soit masqué.

**Alternative : Le spot radial**
- **Timecode** : Mêmes points
- **Statut** : À CODER
- **Effet SVG exact** : Un `radialGradient` (centre sur le centroid du pays) passe de `opacity: 0` à `opacity: 0.3` en 600ms, créant une auréole dorée sous le pays qui persiste en fond très léger pendant toute la séquence.

---

### VOLET 2 : MOUVEMENTS DE CAMÉRA D3
**Problème** : La projection orthographique est figée (sauf les cuts secs).

**Solution 1 : Rotation continue lente (ambiance)**
- **Timecode** : ~3:10 à 3:40 (introduction du globe)
- **Statut** : À CODER (simple update de projection.rotate dans le tick)
- **Effet D3 exact** : `projection.rotate([λ + t*0.2, φ])` où t est le temps. Vitesse : 0.2 degré/frame (très lent). S'arrête doucement (easing) quand le pays cible entre dans le champ.
- **Intention** : Donner vie au globe comme "planète en rotation" avant de stabiliser sur l'action.

**Solution 2 : Dolly-in sur Port-Soudan (dramaturgie)**
- **Timecode** : ~5:07 (quand la voix dit "Port-Soudan")
- **Statut** : À CODER
- **Effet D3 exact** : Zoom progressif de `scale(200)` à `scale(600)` en 1.5s avec `projection.center([37.2, 19.6])` (coordonnées Port-Soudan). La caméra "plonge" vers le port pour voir le pictogramme navire apparaître en grand.
- **Intention** : Marquer le caractère stratégique de ce port comme "clé de voûte" de l'approvisionnement.

**Solution 3 : Pan dynamique entre influences**
- **Timecode** : ~6:20 (passage Turquie → Égypte → Émirats)
- **Statut** : À CODER
- **Effet D3 exact** : Au lieu d'un cut, interpolation de la `projection.center()` de Ankara (32, 39) vers Le Caire (31, 30) en 1s. Le globe "glisse" d'ouest en est, montrant physiquement la proximité géographique des puissances.

---

### VOLET 3 : VARIER LE VOCABULAIRE DES FLUX
**Problème** : Seuls des arcs jaunes/bleus relient les pays (monotonie visuelle).

**Solution 1 : Le convoi discret (pour les armes lourdes)**
- **Timecode** : ~3:24 (flux Dubaï vers Soudan), ~7:20 (Libye vers Soudan)
- **Statut** : À CODER (utilisation de getPointAtLength sur le path)
- **Effet SVG exact** : Le lien est un `path` invisible. Tous les 400ms, un petit cercle (`r: 3px`, couleur selon le camp : rouge RSF, bleu SAF) naît à l'origine et parcourt le path en 2s avec `opacity` qui fade out à l'arrivée. Cela crée un "train de ravitaillement" continu plutôt qu'une ligne statique.
- **Contrainte respectée** : Pas de particules physiques, juste des éléments DOM animés le long d'un path.

**Solution 2 : Ligne pointillée vivante (pour les ingérences secrètes)**
- **Timecode** : ~4:59 (liaison russe)
- **Statut** : DÉJÀ FAISABLE (stroke-dasharray animé)
- **Effet SVG exact** : `stroke-dasharray: 5,5` avec animation CSS ou D3 de `stroke-dashoffset` de 10 à 0 en boucle. Cela donne l'impression que des "données" coulent le long du fil, suggérant l'ingérence discrète.

**Solution 3 : Épaisseur variable (hiérarchie)**
- **Timecode** : ~6:30 (tous les flux vers Khartoum)
- **Statut** : À CODER (simple stroke-width dynamique)
- **Effet SVG exact** : Les flux principaux (Émirats) ont `stroke-width: 4px`, les flux secondaires (Turquie) `stroke-width: 2px`. Au hover ou à l'activation vocale, l'épaisseur pulse pour confirmer la narration.

---

### VOLET 4 : MARQUER UN LIEU DE CRISE (EL-FASHER)
**Problème** : À ~7:36, El-Fasher est un simple point rouge dans une zone rouge. On ne comprend pas l'urgence.

**Solution : Les anneaux de siège**
- **Timecode** : ~7:36 (quand la voix dit "El-Fasher")
- **Statut** : À CODER (3 cercles concentriques animés)
- **Effet SVG exact** : 
  1. Cercle 1 (intérieur) : `r: 5px`, `stroke: #ff4444`, `stroke-width: 2px`, pulse scale de 1 à 1.5 en 1s, opacity 1→0.
  2. Cercle 2 (moyen) : identique, décalé de 0.3s.
  3. Cercle 3 (extérieur) : identique, décalé de 0.6s.
  4. Point central : `r: 4px`, `fill: white`, `stroke: red`, `stroke-width: 2px`, clignote lentement (opacity 0.8↔1).
- **Intention** : Créer un effet "radar" ou "SOS" immédiatement lisible comme "zone chaude active" sans texte supplémentaire.

**Alternative : Le halo de bataille**
- **Timecode** : Même
- **Statut** : À CODER
- **Effet SVG exact** : Un `radialGradient` rouge-orange très diffus (`stdDeviation="15"`) apparaît sous le point El-Fasher, suggérant une chaleur/une explosion contenue.

---

### VOLET 5 : MATIÈRE & AMBIANCE SOBRE
**Problème** : Le globe est un beige plat sans profondeur.

**Solution 1 : Voile de brouillard de guerre (zone de conflit)**
- **Timecode** : ~8:00 (quand on montre l'ensemble des pays instables), ~9:44 (fin sur la carte africa)
- **Statut** : À CODER (path SVG avec gradient mask)
- **Effet SVG exact** : Un `path` couvrant le Soudan et les pays voisins avec `fill: url(#warFog)` où le gradient va du noir transparent (centre) au noir semi-opaque (bords). Opacity: 0.4. Cela crée une "tache sombre" sur la région sans masquer les drapeaux.
- **Traduction** : Le "brouillard de guerre" documentaire.

**Solution 2 : Terminateur jour/nuit renforcé**
- **Timecode** : Global sur toutes les séquences globe
- **Statut** : À CODER (gradient selon l'heure ou fixe dramatique)
- **Effet SVG exact** : Un `path` d'ombre (calculé par D3.geoNight) avec `fill: #001133` et `opacity: 0.3` recouvre la partie nuit du globe. Côté jour, un `radialGradient` jaune très léger (opacity 0.1) vient du centre. Cela donne du volume sphérique.

**Solution 3 : Texture de grain (film documentaire)**
- **Timecode** : Tout le globe
- **Statut** : DÉJÀ FAISABLE (filter SVG)
- **Effet SVG exact** : Un `<filter id="noise">` avec `<feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" />` appliqué à un rectangle couvrant le globe en `opacity: 0.05` et `mix-blend-mode: overlay`. Cela casse le plat du vectoriel pour un rendu "papier ancien" très subtil.

---

**Résumé des priorités de dev :**
1. **Urgent** : Les anneaux de siège pour El-Fasher (fort impact narratif, facile à coder).
2. **Important** : Le dolly-in sur Port-Soudan et le souffle de frontière (donnent du rythme).
3. **Polish** : Le grain de texture et les convois de points (crédibilité visuelle finale).

Toutes ces solutions respectent la contrainte "lisibilité prime" : elles s'activent sur les beats narratifs et s'effacent ou se stabilisent en transparence pendant l'exposition.