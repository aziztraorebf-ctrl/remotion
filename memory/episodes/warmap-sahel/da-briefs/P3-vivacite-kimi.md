 Voici la review technique — structurée selon vos angles obligatoires et votre stack SVG/Remotion.

---

### 1. ZONES MORTES — SOLUTIONS CONCRÈTES (ANCRÉES, HORS-SOL INTERDIT)

#### **Ph2 LIPTAKO (Naissance) — "L'alliance s'allume"**
**Problème :** L'overlay est riche, mais la carte dessous est une photo figée. Le cercle qui pulse manque de *cause* géographique.

**Solution :** Faire converger les **contours territoriaux eux-mêmes** (les frontières des trois pays) depuis les capitales vers le centre du Liptako.
- **Technique :** `stroke-dashoffset` sur les polylines des frontières Mali-Burkina-Niger. Chaque frontière "s'allume" en or (#C9A24B) avec un `dashoffset` qui se remplit depuis Bamako/Ouaga/Niamey vers le centre (durée ~1.5s, easing `easeInOutCubic`).
- **Ancrage :** Le mouvement suit la géographie réelle. Ce ne sont pas des "lignes laser" abstraites, mais les frontières qui se dessinent/révèlent.
- **Climax au centre :** Au point de rencontre, au lieu d'un cercle qui respire, un **sceau-cire** (SVG starburst avec `clipPath` qui s'expanse de 0→100%) ou une **tache d'encre** qui s'étale (scale 0→1 avec `feTurbulence` discret pour l'effet "encre sur parchemin"). C'est la naissance de l'AES comme entité territoriale concrète.

#### **Ph5 STATU QUO (12s figées) — "Le gel du désert"**
**Problème :** Narrativement nécessaire (immobilisme depuis 2012), visuellement mort.

**Solution :** Vie *anchrée* suggérant l'attente, le contrôle statique, la chaleur qui stagne.
1. **Drapeau touareg sur Kidal :** Un sprite 3-frames (PixelLab) de tissu qui ondule, **clippé** dans un mask SVG suivant la forme du bâtiment/ville. Ancré à la ville. Signal : "ils tiennent le terrain".
2. **Activité ONU "passive" :** Des **ondes radio lentes** (cercles concentriques très fins, opacité 0.3, expansion lente 4s) émanant des bases ONU, s'interrompant avant d'atteindre Kidal (symbolisant l'inaction). Ancrées aux camps.
3. **Diable de poussière (dust devil) :** Un sprite-sheet PixelLab (9 frames, loop) d'un tourbillon de sable qui traverse lentement l'écran de droite à gauche, **derrière** les jetons. Phénomène réel du Sahel, ancré au sol, indique l'écoulement du temps sans action humaine.
4. **Ombre portée subtile :** Un léger décalage d'ombre (SVG `feDropShadow` avec `dx/dy` animés de 2px→4px sur 12s) sur les jetons suggère le déplacement du soleil (passage du temps).

**Garde-fou :** Choisir 2 éléments max (ex: drapeau + dust devil), pas les 4, pour éviter le bruit.

---

### 2. CE QUI EST DÉJÀ FORT — NE PAS TOUCHER

- **Ph4 (Kidal.) et Ph7 (Reprise) :** Ces beats fonctionnent car ils respectent la **grammaire causale** parfaite : l'onde de choc précède l'apparition, le remplissage drapeau suit l'arrivée des jetons. La sobriété de Ph8 (Moura) est également juste — la gravité exige l'abstraction.
- **La palette Parchemin :** Le contraste entre l'or mat (#C9A24B) et le bleu désaturé (#2B4F7C) est distinctif. Ne pas ajouter de saturation "pour faire vivant".
- **Le "breathe" des jetons :** Le scale ±5% est suffisant pour le statique. Ne pas le remplacer par des oscillations complexes.

---

### 3. VOCABULAIRE D'IMPACT — DIVERSIFICATION PRO

Le cercle d'encre générique (Ph4, Ph7, Ph9) crée de la monotonie. Proposer une **sémantique visuelle des impacts** cohérente avec le parchemin :

| Événement | Impact actuel | Proposition (PixelLab/SVG) | Justification |
|-----------|---------------|----------------------------|---------------|
| **Ph4 (Kidal.)** | Cercle encre | Garder l'**encre** (c'est un choc politique/symbolique) | Identité forte, à préserver |
| **Ph7 (Reprise)** | Cercle encre | **Flash aux couleurs drapeau** + **fumée claire** | La victoire militaire se traduit par l'apparition du drapeau. Remplacer l'onde d'encre par une onde de "lumière" (or pâle) qui révèle le remplissage. |
| **Ph9 (Clash)** | Cercle encre | **Étincelle/Impact** (sprite PixelLab 3-4 frames, blanc-or, très bref) + **poussière** (sprite fumée teintée sable) | Un clash militaire n'est pas un choc politique. Il faut de la matière (poussière) et de l'énergie (étincelle). |
| **Ph6 (Offensive)** | Sillage bleu | **Traînée de poussière** (smoke spritesheet, opacité 0.4, scale 0.5) derrière les jetons | Ancré au déplacement, matérialise le passage des véhicules. |

**Technique :** Générer 2 nouveaux spritesheets PixelLab :
- `impact_dust` (9 frames, tons sable/bordeaux, pour les combats)
- `impact_spark` (5 frames, or/blanc, pour les rebuffades)

---

### 4. JETONS FRAME-BY-FRAME — TRANCHE

**Verdict :** **Gardez le breathe. Utilisez le frame-by-frame SEULEMENT pour l'intention narrative forte.**

**Argument :** Sur une carte 2D top-down, la lisibilité prime. Un jeton qui bouge en permanence (idle animation) devient un "personnage de jeu vidéo" et perd son autorité documentaire. Cependant, pour **Ph9 (Charge)** :
- Le jeton jihadiste (rouge) peut avoir une **animation 3-frame "coup de reins"** (lean forward) au moment précis de l'attaque (frame 0: normal, frame 1: penché, frame 2: normal). Cela dure 6-8 frames (0.25s), synchronisé avec le début du déplacement Remotion.
- Cela *vend* l'intention "charge" sans sur-animer le reste du temps.

**Piège à éviter :** Ne pas animer les jetons FAMa en permanence (marche sur place) — cela créerait du "mouvement sans déplacement", violant votre règle d'intention.

---

### 5. SPRITESHEETS FUMÉE/EXPLOSION — EMPLOI JUSTIFIÉ

**Où les utiliser (ancré & causal) :**
- **Ph6 (Offensive) :** `smoke` en traînée derrière les colonnes FAMa (dust trail). Scale 0.3, opacité 0.5, ancré au sol.
- **Ph7 (Reprise) :** `smoke` petite échelle (0.2) sur Kidal au moment où le drapeau apparaît (fumée de l'affrontement qui se dissipe).
- **Ph8 (Moura) :** `smoke` montant lentement depuis la "tache de sang" (abstraction du village qui brûle). Loop lent, opacité très faible (0.2).
- **Ph9 (Clash) :** `explosion` très court (3 frames) et désaturé (sépia) au point de contact entre jetons rouge et bleu, suivi immédiatement du recul des rouges.

**Où c'est gadget (interdit) :**
- Ph2 (naissance politique) : pas d'explosion.
- Ph5 (statu quo) : pas de fumée sans feu (sauf les petites fumées de cuisine ONU si vous choisissez cette option).

---

### 6. LE PIÈGE DU "TROP" — GARDE-FOU

**Risques identifiés :**
- **Ph2 :** La convergence des frontières peut devenir une "discothèque laser" si l'easing est linéaire ou trop rapide.
- **Ph5 :** Ajouter drapeau + dust devil + radio + ombre + fumée ONU = surcharge cognitive.

**Garde-fous techniques :**
1. **Règle du 20% :** À tout moment, 20% de l'écran doit rester "vide" (sable pur sans élément animé).
2. **Hiérarchie d'opacité :** Les éléments secondaires (dust devil, fumée ONU) ne dépassent jamais 40% d'opacité. Le principal (jetons, drapeau) reste à 100%.
3. **Easing humain :** Utiliser `spring` pour les apparitions (naturel), mais jamais de `linear` pour les mouvements continus (robotique).
4. **Une seule "star" par phase :** En Ph5, le sujet est Kidal. Tout autre élément (dust devil) doit passer *derrière* ou *latéralement*, jamais devant.

---

## ANGLES OBLIGATOIRES — RÉPONSES

### 1. SPECTATEUR LAMBDA
**Où il décroche :**
- **Ph5 (12s statiques) :** Le spectateur lambda pense que la vidéo a planté. "C'est quoi ce jeu de plateau figé ?"
- **Ph2 :** Il ne comprend pas où est "Liptako" (nom abstrait). La carte doit explicitement montrer les **trois capitales** s'allumer avant de converger, pour ancrer la géographie.

**Hiérarchie du regard :**
- **Problème :** En Ph9, le spectateur ne sait pas où regarder entre le haut (Kidal déjà pris) et le bas (nouvelles attaques). La caméra frame-driven doit faire un **léger pan** (ou un zoom out subtil) pour révéler la nouvelle zone de conflit, guidant l'œil.
- **Fix :** Utiliser le `camera` (transform translate/scale) pour que le "beat" visuel (le clash) arrive au centre de l'écran, pas dans un coin.

### 2. NARRATION / SYNCHRO
**Décalage identifié :**
- **Ph5 :** La voix dit "l'ONU est passive", mais visuellement les camps ONU sont juste des bâtiments statiques. Le visuel ne traduit pas "passivité", juste "présence".
  - *Fix :* Les ondes radio lentes qui s'arrêtent (comme suggéré en §1) traduisent visuellement l'inaction (tentative de communication qui n'aboutit pas).

**Redondance :**
- **Ph2 :** L'overlay dit "Alliance des États du Sahel" en texte ET la voix le dit. C'est redondant.
  - *Fix :* Faire apparaître le texte **légèrement après** la voix (0.5s), ou le faire disparaître progressivement pour laisser la carte raconter.

### 3. TRANSITIONS vs ÉTATS
**Problème :** Ph5 est un **état figé** (diapo), pas une transition. Dans un format "War-Map vivante", 12s d'état figé tuent le rythme.

**Solution :** Transformer Ph5 en **"état vivant"** (living state) via les éléments ambiants ancrés (drapeau, dust devil). Le statu quo n'est pas du vide, c'est de la tension statique.

**Cut sec :** La transition Ph5→Ph6 (passage du gel à l'offensive) doit être marquée par un **flash** ou un **changement de luminosité** (le jour se lève ?) pour signaler la rupture narrative.

### 4. AI-SLOP — TEST SPÉCIFIQUE

**Ce qui crie "généré sans œil de DA" :**

- **Le flottement de l'overlay (Ph2) :** La boîte beige avec les drapeaux ressemble à une modale UI flottante au-dessus d'une carte Google Maps. Pas d'ombre portée sur la carte, pas d'intégration.
  - *Fix technique :* Ajouter un `feDropShadow` SVG à l'overlay (dx="2" dy="4" stdDeviation="3") avec une couleur #2A1C0E à 20% d'opacité. L'overlay "pose" sur la carte.

- **Les bordures uniformes (toutes les frames) :** Tous les traits de frontière ont le même `stroke-width`. Ça fait "vectoriel generique".
  - *Fix :* Varier les épaisseurs. Frontière AES : `stroke-width: 3px`, couleur or. Frontières internes : `stroke-width: 1px`, couleur encre à 60%. Les contours des pays extérieurs : `stroke-width: 0.5px`, couleur gris.

- **La typographie "centrale" :** En Ph2, le titre est centré et statique. Manque de personnalité.
  - *Fix :* Utiliser un `writing-mode` ou un effet "machine à écrire" (texte qui s'écrit caractère par caractère avec un caret clignotant) pour la citation en bas. C'est faisable en SVG/Remotion avec un mask et `interpolate` sur la largeur.

- **Le manque de grain :** Le fond parchemin est trop lisse (dégradé parfait = look AI).
  - *Fix :* Superposer un **bruit SVG** (`<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>` + `feColorMatrix` pour le contraste) à 5-10% d'opacité en mode `overlay` sur toute la carte. Cela crée une texture papier réelle.

- **Easing robotique :** Si tous les `interpolate` sont en `linear` ou `ease`, ça fait "template PowerPoint".
  - *Fix :* Utiliser `Easing.bezier(0.25, 0.1, 0.25, 1.0)` (custom cubic-bezier) pour les mouvements importants (convergence Ph2, avancée Ph6).

### 5. EXPERT DU MÉTIER — DIFFÉRENCE PRO/AMATEUR

**Ce qu'un pro (type Tom Hannen ou Neil Halloran) ferait différemment :**

- **La temporalité matérialisée :** Le pro ajouterait une **"trainée temporelle"** sur la timeline du bas (le trait de la timeline reste allumé derrière le curseur, s'effaçant lentement), montrant l'histoire qui s'accumule. C'est faisable avec un simple `rect` SVG dont la largeur s'anime.

- **Le son spatialisé visuellement :** Quand la voix dit "Kidal", un **léger halo** apparaît autour du label de la ville (stroke extérieur pulsant une fois). C'est un sous-titrage visuel de l'audio.

- **L'absence de "pop" :** Un amateur fait apparaître les jetons en `opacity: 0→1`. Un pro les fait **glisser depuis la lisière** de l'écran (ou les fait "tomber" de haut avec un léger rebond spring) pour qu'on comprenne d'où ils viennent géographiquement.

- **La cohérence des ombres :** Un pro s'assurerait que tous les jetons projettent leur ombre dans la même direction (SVG `feDropShadow` avec dx/dy constants partout), renforçant la cohérence spatiale 2D.

**Retirerait :**
- Le badge "interdiction de tirer" en Ph5 si l'icône est trop "clipart". Remplacer par un symbole SVG simple (cercle barré) intégré à l'encre du camp.

---

## RÉSUMÉ EXÉCUTIF DES ACTIONS PRIORITAIRES

1. **Ph2 :** Remplacer le cercle par la **convergence des frontières** (stroke-dashoffset) + sceau central.
2. **Ph5 :** Ajouter **drapeau touareg ondulant** + **dust devil** (sprite ancré) + ondes radio ONU faibles.
3. **Impacts :** Créer 2 nouveaux sprites PixelLab (`dust`, `spark`) pour différencier victoire (Ph7) et clash (Ph9).
4. **Jetons :** Garder le breathe. Animer frame-by-frame **uniquement la charge** en Ph9.
5. **Smoke :** Utiliser en Ph6 (traînée), Ph