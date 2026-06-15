Voici la Direction Artistique complète pour la refonte du Hook (0-30s). 

Le constat est sans appel : le hook actuel est un "rapport de stage" (UI dashboard, couleurs pastels, rythme linéaire) alors que le texte est un "thriller géopolitique" (rupture, urgence, mystère). Nous allons utiliser notre stack React/SVG pour créer un **mini-TikTok visuel**, basé sur la mécanique d'escalade et le gabarit A (Transformation).

---

### SECTION OBLIGATOIRE — TEST AI-SLOP (Analyse des frames fournies)

En tant qu'œil expert, voici ce qui hurle "généré programmatiquement sans DA" dans les captures actuelles, et comment on le corrige avec notre stack :

*   **[Frame 0s] Le vide beige :**
    *   *Problème :* Cadrage lointain, aucun point focal, océan de beige. C'est l'état par défaut de Mapbox. Ça crie "je n'ai pas designé mon intro".
    *   *Correction :* On supprime ce plan large. On commence en zoom serré. On utilise `countryOutline` avec un `stroke-dashoffset` pour dessiner les frontières dynamiquement, sur un fond très assombri.
*   **[Frame 5s] Le syndrome du Dashboard (Légende + Timeline) :**
    *   *Problème :* Plaquer une légende statique et une timeline de type "composant UI" sur une vidéo, c'est la signature d'un outil de data-viz automatisé. Ça tue l'immersion narrative.
    *   *Correction :* **Suppression totale** de la légende et de la timeline dans le hook. L'information doit être *diégétique* (intégrée à la carte). Si on montre le JNIM, on utilise un `jeton-faction` rouge, pas besoin de légende.
*   **[Frame 12s/20s] Le remplissage "Pot de peinture" plat :**
    *   *Problème :* Les zones de contrôle apparaissent d'un coup, avec des couleurs ternes (bleu/jaune/rouge pastel) et une opacité uniforme. Aucune tension, aucun easing organique.
    *   *Correction :* Remplacer par des hachures SVG animées ou le composant `SahelAttackArrow` pour montrer une *poussée* agressive, pas juste un état statique. Utiliser des couleurs saturées (Rouge sang pour JNIM) contrastant avec le parchemin.

---

### ANGLES OBLIGATOIRES (La Review DA)

1.  **SPECTATEUR LAMBDA (Hiérarchie du regard) :** Actuellement, l'œil erre. Dans la refonte, on utilise `WarMapDimmedOverlay` avec le helper `dimmedOverlayHole()` pour forcer l'œil : tout est sombre SAUF l'action en cours (ex: la capitale qui expulse les militaires).
2.  **NARRATION / SYNCHRO (Le Beat) :** Le visuel doit frapper *exactement* sur les verbes. "Chassent" = mouvement centrifuge. "Rompent" = rupture de ligne. "Quittent" = fracture de zone. Pas de décalage.
3.  **TRANSITIONS vs ÉTATS :** Fini les fondus enchaînés mous. On utilise des animations SVG basées sur la physique (spring) : ça claque, ça rebondit légèrement, ça a du poids.
4.  **AI-SLOP (Le détail qui tue) :** L'utilisation de polices sans-serif basiques pour les labels. On passe sur notre typo titre à empattement, intégrée via `WarMapOverlayDynamic` en mode *card* flottante, avec une ombre portée dure (pas de blur CSS baveux).
5.  **EXPERT DU MÉTIER (Causalité) :** Un pro ne montre pas juste "la France n'est plus là". Il montre *l'acte* de rupture. C'est ce qu'on va coder avec le proto **P1 (liens orthogonaux)** qui se brisent.

---

### DÉCOUPAGE SECONDE PAR SECONDE (Le Hook "Max Bellona" AES)

Voici la chorégraphie exacte, codable avec nos briques.

#### 1. Le Cold-Open : L'Éveil (0.0s - 4.5s)
*   *Audio :* « En moins de trois ans, trois pays ont tout changé en même temps. »
*   *Visuel :* **Pas de carte globale.** Écran presque noir (grain papier très prononcé).
    *   0.5s : Un trait SVG incandescent se dessine à toute vitesse (`countryOutline` animé via stroke-dasharray). C'est le Mali.
    *   1.5s : Le Burkina se dessine.
    *   2.5s : Le Niger se dessine.
    *   3.5s : Sur "tout changé", un flash (opacité 100% -> 0% d'un calque blanc) révèle la carte parchemin avec les 3 pays remplis de leurs couleurs pleines (Ocre, Brique, Sarcelle).
*   *Pourquoi ça marche :* Ça happe immédiatement. Pas de stock footage, juste la puissance de notre moteur vectoriel.

#### 2. L'Escalade : Les 3 Verbes d'Action (4.6s - 12.6s)
*   *Audio :* « Ils chassent leurs partenaires militaires. » (4.6-7.1s)
    *   *Visuel :* Zoom rapide sur les 3 capitales. 3 `jetons-factions` (Drapeau FR / Barkhane) apparaissent au centre. Sur le mot "chassent", ils sont **éjectés violemment** hors des frontières vers le haut de l'écran (animation de translation Y + rotation avec un easing *spring* très sec).
*   *Audio :* « Rompent leurs alliances historiques. » (7.2-9.3s)
    *   *Visuel :* Utilisation du **Proto P1 (liens orthogonaux)**. Des lignes dorées relient les 3 pays vers l'extérieur (Europe/ONU). Sur "Rompent", les lignes deviennent rouges, tremblent (SVG path distortion) et **claquent** en leur milieu, se rétractant comme des élastiques coupés.
*   *Audio :* « Et quittent la principale organisation régionale du continent. » (9.4-12.6s)
    *   *Visuel :* Un grand cercle SVG en pointillés (représentant la CEDEAO) englobe l'Afrique de l'Ouest. Sur "quittent", les 3 pays (Mali, Burkina, Niger) font un *pulse* (scale 1.05) qui **brise physiquement** le cercle de la CEDEAO. Les pointillés volent en éclats (particules SVG simples).

#### 3. Le Pivot : L'Illusion (13.5s - 16.2s)
*   *Audio :* « Et bâtissent, à la place, quelque chose de nouveau. »
*   *Visuel :* Utilisation de **WarMapDimmedOverlay**. La carte s'assombrit fortement. Au centre des 3 pays, le sceau de l'AES (Alliance des États du Sahel) s'imprime comme un tampon en or massif. Utilisation de `dimmedOverlayHole()` pour que la zone sous le sceau reste lumineuse. C'est propre, c'est triomphant.

#### 4. La Transformation & Le Paradoxe (17.4s - 21.0s)
*   *Audio :* « Comment est-ce possible ? Et surtout... pourquoi maintenant ? »
*   *Visuel :* **C'est ici qu'on utilise le Proto P3 (Transformation géo -> guerre) et qu'on plante le paradoxe.**
    *   Sur "Comment est-ce possible ?" : Le sceau doré de l'AES se fissure (SVG path).
    *   Des icônes **Lucide** dorées apparaissent (Lingots d'or, Barils, symbole Uranium) = *La Richesse*.
    *   Sur "Pourquoi maintenant ?" : **Transformation brutale**. Le filtre sombre saute. Les icônes de richesse sont instantanément englouties par une marée rouge sang (fill de contrôle territorial JNIM/EIGS) qui s'étend agressivement. Des flèches **SahelAttackArrow** transpercent la carte. Le composant **RefugeeFlow** (lignes de points fuyant les zones rouges) s'active massiveton.
*   *Pourquoi ça marche :* Contraste total entre le discours politique (le sceau) et la réalité du terrain (la guerre). La promesse de la vidéo est scellée.

#### 5. La Boucle Ouverte (22.7s - 28.5s)
*   *Audio :* « Pour répondre, il faut d'abord regarder ce qui existait avant. Et ce qui ne fonctionnait plus. »
*   *Visuel :* Utilisation de `MAP_HIDE_WINDOWS` (masque plein écran). La carte de guerre chaotique est recouverte par un aplat parchemin.
    *   Au centre, un composant **WarMapOverlayDynamic** (mode fullscreen) affiche en typo géante et élégante : **"AVANT."** (avec une icône Lucide `RotateCcw` qui tourne lentement).
    *   La carte réapparaît, vide, apaisée, prête pour le début de l'Acte 1.

---

### SYNTHÈSE DES DÉCISIONS (Matrice de validation)

| Idée / Brique | Statut | Justification DA |
| :--- | :---: | :--- |
| **Cold Open (Tracés SVG)** | ✅ RETENU | Remplace le plan large beige. Happe l'attention sans utiliser de stock footage interdit. |
| **Proto P1 (Liens orthogonaux)** | ✅ RETENU | Parfait pour incarner visuellement le verbe "Rompre". |
| **Proto P3 (Transformation)** | ✅ RETENU | Le cœur du hook. Passage du sceau politique AES à la carte de guerre sanglante. |
| **Légende & Timeline (UI)** | ❌ ÉCARTÉ | Tue la rétention. Fait "amateur/généré". L'info doit être visuellement évidente. |
| **Icônes Lucide (Or/Uranium)** | ✅ RETENU | Plante le paradoxe (richesse) de manière vectorielle et nette avant l'invasion rouge. |
| **WarMapDimmedOverlay** | ✅ RETENU | Isole l'action (le sceau AES) pour guider l'œil du spectateur lambda. |
| **Animation "Spring" (Rebond)** | ✅ RETENU | Indispensable pour l'éjection des jetons militaires (chassent). Donne du poids. |
| **Texte "Comment/Pourquoi" à l'écran**| ❌ ÉCARTÉ | Redondant avec la voix très expressive. On préfère montrer le *paradoxe* visuel à ce moment précis. |

**Conclusion :** Ce hook de 30 secondes utilise 100% de notre stack existante et de nos protos R&D. Il ne nécessite aucun After Effects, mais demande un séquençage précis des composants React (montage *frame-driven*). Il transforme une présentation PowerPoint en un trailer nerveux qui justifie de rester pour les 20 prochaines minutes.