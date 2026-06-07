Voici une analyse experte et un plan de construction millimétré pour l'Acte 1. En tant que motion designer cartographique, mon but ici est de t'éviter les itérations douloureuses dans le code. On va structurer ça pour que l'intégration Remotion + Mapbox soit fluide, logique et visuellement irréprochable.

---

### VOLET A — ENCHAÎNEMENT BEAT PAR BEAT (Le plan de montage)

La règle d'or ici est **l'économie de l'attention**. Le spectateur ne peut lire qu'une seule information nouvelle à la fois. Voici le séquençage exact avec les easings Remotion :

*   **[f0 - f150] L'Installation :**
    *   *Action :* La carte est vide de data géopolitique. Le parchemin et la vignette sépia (42%) sont actifs.
    *   *Caméra :* Début du `drift` (glissement lent + très léger zoom-in). Easing : `cubic-out` très étiré pour adoucir le démarrage.
*   **[f151] Le Choc 1 (Mali) :**
    *   *Action :* Remplissage Mali (0 → 0.82, `spring` rapide mais sans rebond excessif : `stiffness: 150, damping: 14`).
    *   *Détail :* Le front beige #F3E9C8 se dessine (`stroke-dashoffset` sur 20 frames).
    *   *Focus :* Bamako apparaît et pulse (1 onde SVG radiale qui fade out).
*   **[f231] Le Choc 2 (Burkina) :**
    *   *Action :* Remplissage Burkina + Front beige + Pulse Ouaga. Même timing exact que le Mali pour créer un rythme (pattern).
*   **[f302] Le Choc 3 (Niger + CEDEAO) :**
    *   *Action :* Remplissage Niger + Front beige + Pulse Niamey.
    *   *Mécanique CEDEAO :* Un grand anneau SVG fin (englobant l'Afrique de l'Ouest) apparaît, clignote 2 fois (opacity 0.4 → 0.8), puis **s'étend vers l'extérieur tout en s'effaçant** (scale 1 → 1.5, opacity → 0). Ça symbolise visuellement la "rupture/sortie" sans texte.
*   **[f423] La Convergence (Liptako-Gourma) :**
    *   *Action :* 3 lignes SVG beiges partent des 3 capitales et se dessinent (`stroke-dashoffset`) pour converger vers la zone des trois frontières.
    *   *Impact :* À l'intersection, un `glow` SVG (cercle avec gradient radial beige/or très doux) s'allume progressivement.
*   **[f572] La Respiration (Le Hook) :**
    *   *Action :* **Arrêt total du drift caméra.** Les vecteurs de convergence restent allumés. Silence visuel pendant 2 secondes. C'est crucial pour laisser le cerveau imprimer la nouvelle masse géopolitique (l'AES).
*   **[f727] La Transition (Le Passé) :**
    *   *Action :* Le drift reprend. **Nettoyage :** Les 3 vecteurs et le glow s'effacent en fondu (15 frames). La couleur unie des 3 états baisse en opacité (0.82 → 0.3) pour faire place à la couche tactique.
*   **[f1014 - f1198] L'Ennemi 1 (JNIM) :**
    *   *Action :* La zone rouge #B14B3C s'allume (fade in doux, 30 frames).
    *   *UI :* Le tampon texte "JNIM" apparaît avec un léger `scale` (0.9 → 1, `spring` très raide).
*   **[f1396] La Menace rurale :**
    *   *Action :* Les véhicules JNIM (rouges) *fade in* et commencent leur patrouille. Mouvement lent, linéaire, sur des chemins SVG invisibles.
*   **[f1717 - f1876] L'Ennemi 2 (EIGS) :**
    *   *Action :* La zone orange-brun s'allume. Tampon "EIGS" apparaît. Les véhicules EIGS *fade in* et patrouillent à l'est.
*   **[f2167] La Friction :**
    *   *Action :* 2 véhicules (1 JNIM, 1 EIGS) se dirigent vers la même frontière.
    *   *Impact :* Au moment où ils sont proches, de petits arcs de cercle SVG (ondes de choc) apparaissent entre eux. Les véhicules s'arrêtent, puis reculent légèrement. Pas d'explosions, juste une "répulsion" magnétique.
*   **[f2299] La Clarté finale :**
    *   *Action :* Les véhicules s'estompent (opacity → 0). Les deux zones (Rouge et Orange) montent en opacité pour être parfaitement distinctes. Arrêt caméra. Fin de l'Acte 1.

---

### VOLET B — NOS TEMPLATES + CATALOGUE

Vos choix actuels sont excellents et matures. Voici mon avis et comment injecter l'ADN des meilleurs templates du catalogue :

1.  **Allumage séquentiel + Frontière dorée/beige :** Validé. C'est l'esprit du template **#91 (Europe Rapid Sequence)**. L'allumage crée l'urgence, la frontière trace la limite.
2.  **Anneau CEDEAO :** Au lieu d'un simple clignotement, inspirez-vous du **#155 (Radial Pulse Waves)**. Une onde qui s'échappe vers l'extérieur est beaucoup plus sémantique pour illustrer un "départ" qu'un simple on/off.
3.  **Flèches de convergence (f423) :** Regardez le **#139 (Arrows Spreading)**, mais en reverse. Utilisez des lignes SVG effilées (plus larges à la capitale, finissant en pointe au Liptako-Gourma), animées au `stroke-dashoffset`. Pas de "marching ants" (trop cheap/fourmilière), préférez un trait continu qui se dessine.
4.  **Véhicules + Friction (f2167) :** Vos véhicules top-down sont votre signature. Pour le combat, inspirez-vous du **#118 (Durand Line Clashes)** : pas besoin de feu, juste des marqueurs de friction (arcs SVG qui pulsent à la frontière contestée) pendant que les véhicules reculent.

**Ce qui manque dans votre plan :** Un traitement typographique hiérarchisé. Quand les tampons JNIM/EIGS apparaissent, la typo doit contraster avec les labels Mapbox des villes. Utilisez une police Serif grasse (type Playfair ou un dérivé parchemin) encadrée d'un fin liseré pour faire "dossier classifié".

---

### VOLET C — ÉVITER L'AI-SLOP (Préventif)

Le risque principal avec Remotion + Mapbox, c'est l'effet "Dashboard de Data Scientist" ou "Généré procéduralement sans âme". Voici les parades strictes à coder :

1.  **Risque : Couleurs "Plastique" (Surcharge) :**
    *   *Le Piège :* Des opacités Mapbox standards qui masquent la texture parchemin en dessous, donnant un effet aplat vectoriel plat.
    *   *La Parade :* Dans Remotion, assurez-vous que les layers de polygones (Mali, JNIM, etc.) utilisent `mix-blend-mode: multiply` en CSS (ou l'équivalent Mapbox si supporté nativement, sinon via un overlay SVG synchronisé). La couleur doit *teinter* le parchemin, pas le recouvrir.
2.  **Risque : Mouvements de Caméra Robotiques :**
    *   *Le Piège :* Un `map.panTo` ou `flyTo` avec un easing linéaire. Ça hurle "Google Earth par défaut".
    *   *La Parade :* Utilisez une courbe de Bézier personnalisée ou un `spring` très amorti pour piloter les coordonnées de la caméra à chaque frame. Le mouvement doit ressembler à un cadreur qui pousse doucement un trépied fluide.
3.  **Risque : L'effet "Sapin de Noël" (Tout clignote) :**
    *   *Le Piège :* Les pulses des villes, les frontières qui se dessinent et les textes qui poppent *exactement* sur la même frame. C'est l'erreur n°1 des amateurs.
    *   *La Parade :* **Le Staggering (Décalage).** Frame X : Remplissage. Frame X+5 : Frontière. Frame X+10 : Pulse de la ville. Ce micro-décalage de 5-10 frames donne un aspect organique et "dirigé" à l'animation.
4.  **Risque : Typographie flottante :**
    *   *Le Piège :* Du texte brut posé par-dessus la carte, sans ancrage.
    *   *La Parade :* Les tampons JNIM/EIGS doivent avoir un fond (légèrement beige/opacité 90%) avec une fine bordure, et idéalement une petite ligne (leader-line) qui pointe vers le centre de gravité de leur zone. Ça ancre l'information dans la géographie.

---

### SECTION OBLIGATOIRE — EXPERT CONSTRUCTEUR

**1. Vos templates choisis (2e avis) :**
Ils sont chirurgicaux. Le choix de garder la palette (Bleu/Rouge/Or) et de l'appliquer sur un fond parchemin + sépia est ce qui vous sauve de l'effet "carte d'actu TV". Si je devais combiner des éléments du catalogue, je prendrais la tension du **#128 (Cinematic Military Advance)** pour le mouvement des véhicules (lent, inexorable, ciblé) et la clarté du **#91** pour la séquence d'ouverture.

**2. Si je construisais ça de zéro (L'Ordre de travail) :**
Je ne touche pas au design tant que le squelette n'est pas parfait.
*   **Étape 1 : Le Track Caméra.** Je code uniquement le `drift` de f0 à f2299. Je valide le rythme, la pause à f572, la reprise.
*   **Étape 2 : Le Séquençage Data.** J'intègre les GeoJSON (Mali, BFA, NER, JNIM, EIGS) et je les allume en "cut" (sans animation) aux frames exactes du script. Ça valide la synchro voix/image.
*   **Étape 3 : L'Easing (La magie).** C'est là que j'ajoute les `springs` Remotion sur les opacités et les `stroke-dashoffset` pour les frontières.
*   **Étape 4 : Le "Chrome" (Les détails).** J'ajoute les véhicules, les pulses SVG, les tampons textes.
*   *Le piège à éviter :* Essayer de coder l'animation du véhicule JNIM avant d'avoir validé le mouvement de caméra. Le véhicule glissera sur la carte (effet moonwalk) si la caméra et le SVG ne sont pas parfaitement synchronisés sur la même boucle de rendu.

**3. Enchaînement pour la compréhension (Le Spectateur Lambda) :**
Le spectateur lambda ne sait pas où est le Burkina Faso.
*   **La règle du regard :** Quand le Mali s'allume, l'œil est attiré. Le Burkina s'allume *à côté*, l'œil glisse. Le Niger s'allume *à côté*, l'œil glisse encore. La progression géographique est logique (Ouest → Est).
*   **La respiration vitale :** La pause à **f572** ("Comment est-ce possible ?") est le moment le plus important de l'Acte 1. Ne faites *rien* bouger à ce moment-là. Le spectateur vient d'assimiler 3 pays + 1 rupture d'alliance + 1 nouvelle alliance. Il a besoin de ces 2 secondes de carte figée pour se dire "Ok, voici le nouveau bloc".
*   **Le nettoyage cognitif :** À f727, quand on passe aux groupes armés, il est impératif de "dimmer" (baisser l'opacité) des états. Si vous gardez le bleu vif des états ET que vous ajoutez le rouge du JNIM par-dessus, le cerveau sature. On éteint la lumière sur la géopolitique pour allumer la lumière sur la tactique terrain.