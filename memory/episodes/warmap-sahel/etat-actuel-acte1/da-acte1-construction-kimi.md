 Voici la review constructive, structurée pour l'exécution immédiate en code Remotion/Mapbox.

---

### VOLET A — ENCHAÎNEMENT BEAT PAR BEAT (L'architecture du récit visuel)

**Principe directeur :** La caméra ne s'arrête jamais (sauf aux freezes narratifs), mais sa vitesse varie pour marquer la gravité. Les éléments apparaissent en **stagger 3-2-1** (fond → contour → label) pour éviter l'effet "popup".

**Phase 1 : Le choc politique (f0–f572)**

*   **[f0–f150] "En moins de trois ans..."**
    *   **Action :** Drift lent sur le Sahel en sépia (vignette #241809 à 42%). Aucune donnée territoriale. Seul le titre "Tout a changé..." apparaît en fade (opacity 0→1, ease-in-out).
    *   **Respiration :** 1s de silence visuel avant le premier déclencheur.

*   **[f151 "expulsé"] Mali**
    *   **Action :** Fill bleu #3E6E9E opacity 0→0.82 (cubic-bezier 0.25, 0.46, 0.45, 0.94 sur 40 frames). Frontière beige #F3E9C8 se dessine (stroke-dashoffset 100%→0%, ease-out, 60 frames). Bamako pulse une fois (scale 1→1.3→1, spring stiffness 100).
    *   **Caméra :** Zoom-in très doux (+0.2x) centré sur Bamako.

*   **[f231 "Rompu"] Burkina**
    *   **Action :** Même séquence d'allumage. **Nouveau :** Le Mali reste visible mais baisse légèrement en luminosité (brightness 100%→85%) pour diriger l'attention sur le nouveau venu. Ouagadougou pulse.
    *   **Caméra :** Pan latéral vers l'est (ease-in-out).

*   **[f302 "Quitté"] Niger + CEDEAO**
    *   **Action :** Niger s'allume (même séquence). Niamey pulse.
    *   **CEDEAO :** Un anneau fin (stroke 2px, beige #F3E9C8, radius ~150px autour du centre géométrique des 3 pays) apparaît (opacity 0→0.6). Il **clignote** 2 fois (opacity 0.6→0.1→0.6→0.1, 15 frames chacun) puis s'éteint (opacity→0, 30 frames). *Symbolise la rupture, pas une cible.*
    *   **Caméra :** Zoom-out léger pour voir les 3 pays allumés.

*   **[f423 "construit"] Liptako-Gourma**
    *   **Action :** Trois flèches discrètes (beige, stroke-dasharray 10,5) partent des capitales (Bamako, Ouaga, Niamey) et convergent vers le triangle Liptako-Gourma (ease-out, 90 frames). Arrivées, la zone Liptako-Gourma pulse **une seule fois** en or #C99A3A (fill-opacity 0→0.6→0, spring damping 10) comme une "soudure".
    *   **Caméra :** Centre sur le Liptako, léger zoom (+0.3x).

*   **[f572 "possible"] Freeze**
    *   **Action :** Toute animation stoppe. Hold 2s (60 frames). Pas de drift. Les 3 pays restent visibles (bleu 0.82 opacity), Liptako encore légèrement doré (0.3).
    *   **Audio-visuel :** Silence total pour marquer la question rhétorique.

**Phase 2 : Reset historique (f727–f1014)**

*   **[f727 "répondre"]**
    *   **Action :** Crossfade (30 frames) : les couleurs politiques (bleu) s'estompent (opacity 0.82→0) retour au sépia neutre. Les frontières restent (beige, 0.4 opacity).
    *   **Caméra :** Drift lent vers le nord-est, reset de la vue.

*   **[f1014] Contexte groupes armés**
    *   **Action :** Carte "vierge" du Sahel (uniquement géographie). Préparation mentale.

**Phase 3 : Les deux groupes (f1014–f2299)**

*   **[f1164/f1198 "JNIM"]**
    *   **Action :** La masse territoriale JNIM (fusion Turf) apparaît en rouge #B14B3C (fill-opacity 0→0.75, ease-out). Un **tampon** (label typographique style "cachet militaire") "JNIM — Al-Qaïda" apparaît en overlay SVG près du centre Mali (fade-in 20 frames).
    *   **Véhicules :** 3 icônes rouges (pickups) fade-in et commencent leur patrouille sur des chemins SVG pré-calculés (vitesse lente, 20px/seconde).

*   **[f1396 "centre"]**
    *   **Action :** Caméra pan vers le centre Mali/nord Burkina. Les véhicules JNIM bougent le long des axes ruraux (animation path avec `stroke-dashoffset` inversé pour la traînée).

*   **[f1717/f1749 "EIGS"]**
    *   **Action :** Même séquence pour EIGS, couleur orange-brun #C99A3A (mais plus foncé/saturation -30% que le "contesté" pour différenciation). Tampon "EIGS — Daesh" près de la zone des trois frontières.
    *   **Véhicules :** 3 icônes orange-brun apparaissent, patrouille dans le nord-est/Tillabéri.

*   **[f2167 "combattent"]**
    *   **Action :** Un véhicule JNIM (ouest) et un EIGS (est) convergent vers un point médian. À mi-chemin (f2200), **friction visuelle** : glow jaune-or (#F3E9C8, blur 5px - *autorisé car SVG filter, pas CSS blur*) pulse une fois au point de contact. Les véhicules reculent alors (ease-out-back) vers leurs zones d'origine.

*   **[f2299 "séparément"]**
    *   **Action :** Les véhicules s'estompent (opacity→0, 30 frames). La carte reste sur les deux zones colorées distinctes (rouge/orange).
    *   **Freeze :** 1s (30 frames) hold final avant cut.

---

### VOLET B — TEMPLATES & CATALOGUE (Le choix des armes)

**Vos choix actuels sont pertinents**, mais voici les ajustements pro pour éviter le "déjà-vu" :

| Votre mécanique | Référence catalogue | Usage recommandé | Ajustement pro |
|---|---|---|---|
| **Allumage frontière dorée** | #132 (Comet Border) | Inspirez-vous du "trail" mais **simplifié** : pas de néon, juste un dessin progressif du stroke beige avec `stroke-linecap: round`. | Ajoutez un léger `feTurbulence` (baseFrequency 0.02) sur le stroke pour texture "crayon sur papier". |
| **Anneau CEDEAO** | #122 (Pulse Waves) | **À éviter** en l'état : le catalogue monte des ondes radar saturées. | Remplacez par un **cercle de trait fin** (1px) qui se brise : au lieu de clignoter en opacity, utilisez `stroke-dasharray` qui s'allonge (10,5 → 100,5) pour symboliser la dissolution du lien. |
| **Flèches convergence** | #139 (Russia Arrows) / #96 (Silk Road) | Combinez : trajectoires courbes (comme #96) mais style tactique #139. | Couleur beige #F3E9C8, pas rouge. `stroke-dashoffset` animé pour montrer le mouvement des capitales vers le centre. Pas de tête de flèche massive, juste un trait épaisissant à l'arrivée. |
| **Véhicules** | #258 (Tanks Advancing) | Référence pour le mouvement "top-down". | **Différenciation clé** : JNIM = véhicules rouges, légers, mouvement erratique (courbes). EIGS = véhicules orange-brun, plus lourds, mouvement linéaire (discipline Daesh). |
| **Tampons centraux** | #106 (Leader-Line Title) | Adaptez : pas de ligne leader, mais le style "timbre" est bon. | Typo : utilisez une serif condensée (ex: *Tiempos Headline* ou *Merriweather Sans* en bold) pour l'aspect documentaire. Ombre portée très légère (y:1px, blur:2px, noir 20%) pour le détacher du fond. |

**Ce qui manque dans votre plan (à ajouter) :**

1.  **Texture papier animée** : Un overlay SVG `feTurbulence` avec `seed` qui change toutes 120 frames (subtil, 0.03 opacity) pour éviter le "plastic" des vecteurs Mapbox statiques.
2.  **Depth par ombre portée** : Sur les fills de territoires (JNIM/EIGS), ajoutez un `filter: drop-shadow(0px 2px 3px rgba(0,0,0,0.3))` pour qu'ils "flottent" légèrement au-dessus de la carte de base.
3.  **Transition de phase** : Entre f572 (fin politique) et f727 (début historique), utilisez un **flash blanc très bref** (3 frames, opacity 0→0.3→0) ou un **iris wipe** (masque circulaire qui referme puis rouvre) pour signifier le changement de registre narratif.

---

### VOLET C — ÉVITER L'AI-SLOP (Parades concrètes)

| Risque identifié | Pourquoi ça ferait "IA/amateur" | La parade (dans votre stack) |
|---|---|---|
| **1. Couleurs trop "digitales"** | Rouge #B14B3C et bleu #3E6E9E saturés à 100% sur fond sépia créent un contraste chimique, pas organique. | **Appliquer une texture "papier journal"** en overlay multiply (opacity 0.15) sur toutes les couches de couleur. Réduire la saturation des fills à 85%. |
| **2. Véhicules qui glissent** | Mouvement linéaire constant (robotique) ou vitesse trop rapide (jeu vidéo). | **Easing sur les paths** : `ease-in-out` sur chaque segment de patrouille. **Rotation** : orientez les sprites (vehicles) selon la tangente du path (`atan2(dy,dx)`). Ajoutez un léger "wobble" (rotation ±2°) pour simuler le terrain accidenté. |
| **3. Pulses partout** | Si Bamako, Ouaga, Niamey, Liptako, JNIM et EIGS pulsent tous avec la même fréquence, c'est le chaos. | **Hiérarchie des pulses** : Capitales = pulse unique au moment de l'allumage. Liptako = pulse unique au "construit". Groupes armés = **pas de pulse**, juste un fill statique (ou breathing très lent 4s). |
| **4. Texte qui raconte la voix** | Si le label "JNIM" apparaît exactement en même temps que la narration le dit, c'est redondant et scolaire. | **Décalage temporel** : La zone colorée apparaît à f1164, le tampon texte "JNIM" apparaît 20 frames plus tard (f1184), quand la narration dit "Al-Qaïda". Le texte complète l'audio, ne le duplique pas. |
| **5. Le "PowerPoint"** | Changements d'état sans mouvement de caméra (cuts durs). | **Toujours motiver par la caméra** : Même un changement de sujet (politique → militaire) doit être couvert par un drift ou un zoom. Jamais de cut sec sur carte statique. |
| **6. L'anneau CEDEAO "loading spinner"** | Un cercle qui tourne ou clignote trop vite ressemble à une icône de chargement web. | **Animation de rupture** : Au lieu de clignoter, l'anneau se **fissure** (stroke-dasharray qui crée des espaces croissants) ou s'efface par "tranches" horizontales (mask animation). |
| **7. Frontières trop nettes** | Des lignes noires parfaites entre les pays voisins (sépia) et le Sahel (couleur) créent un effet "collage". | **Vignette dynamique** : La frontière sépia/couleur n'est pas une ligne mais un **gradient de désaturation** (50px de large) pour fondre les deux mondes. |
| **8. Easing générique** | `ease-in-out` partout = monotonie robotique. | **Palette d'easing** : <br>- Allumage pays : `cubic-bezier(0.4, 0, 0.2, 1)` (décélération douce)<br>- Convergence flèches : `spring({stiffness: 50, damping: 15})` (rebond tactique)<br>- Friction JNIM/EIGS : `ease-out-back` (recul physique) |

**Checklist finale avant codage :**
- [ ] Les véhicules ont-ils des ombres portées cohérentes (même direction que le relief de la carte) ?
- [ ] Le grain de papier est-il animé (subtilement) pour éviter l'aspect plastique ?
- [ ] Les labels de villes sont-ils en `text-shadow: 0 1px 2px rgba(36,24,9,0.8)` pour lisibilité sur le sépia ?
- [ ] Le freeze de f572 a-t-il bien **tous les mouvements stoppés** (même le drift caméra) pour marquer le silence ?

Ce plan, exécuté avec ces précisions, produira un Acte 1 qui respire la maîtrise documentaire, pas la génération procédurale.