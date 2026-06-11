Voici une analyse experte et sans concession de ton plan pour la Partie 1, en respectant strictement tes contraintes techniques (SVG, opacité, frame-driven) et ta direction artistique (parchemin, analyste honnête).

### RÉPONSES DIRECTES AUX QUESTIONS CRÉATIVES

**1. Le "flot d'armes" en particules SVG : lisible ou effet TikTok ?**
**C'est un risque majeur d'effet "TikTok/Motion Design cheap".** Des particules individuelles qui descendent vont casser l'esthétique "encre/parchemin" (l'encre ne vole pas en petites boules parfaites).
*L'alternative sobre (dans notre stack) :* L'effet de **capillarité/infiltration d'encre**. Utilise un `path` SVG épais, de couleur sombre (gris anthracite/brun), animé via `stroke-dasharray` et `stroke-dashoffset`. L'encre "coule" le long des routes de contrebande transsahariennes depuis le sud libyen vers le nord Mali. C'est organique, menaçant, et 100% raccord avec le style carte papier.

**2. Comment matérialiser "l'État absent + tensions anciennes" (1.3) ?**
**L'erreur serait d'AJOUTER des éléments (icônes village/tension) pour montrer un VIDE.** C'est un contresens visuel.
*La solution par la carte seule :*
*   **Pour le vide d'État :** SOUSTRACTION. Actuellement, tes régions ont des couleurs pleines (bleu/jaune/etc.). Fais chuter l'opacité du `fill` des immenses régions rurales du Nord/Centre Mali à 0.1, en ne gardant l'opacité forte (0.8) *que* sur un petit rayon autour des capitales régionales (Bamako, Mopti, Gao). L'État s'évapore visuellement.
*   **Pour les tensions :** TEXTURE. Fais apparaître en fondu (opacity 0 -> 0.4) un motif SVG de **hachures irrégulières** (style gravure/griffures à l'encre) spécifiquement dans ces zones rurales évidées. Le vide n'est pas lisse, il est "rugueux".

**3. La transition 1.1 -> 1.2 -> 1.3 : surcharge ?**
Le timing est bon si l'œil est guidé.
*   1.1 (69s) : L'œil est en haut (Libye).
*   1.2 (75s) : L'œil *suit* la ligne d'encre qui descend vers le Mali.
*   1.3 (84s) : L'œil est déjà sur le Mali. La caméra zoome légèrement (drift) pendant que les couleurs d'État s'estompent.
C'est fluide car **l'action 1.2 déplace le regard vers le lieu de l'action 1.3**. Il n'y a qu'une transformation majeure à la fois.

---

### === ANGLES OBLIGATOIRES ===

**1. SPECTATEUR LAMBDA (Compréhension & Hiérarchie du regard)**
*   **Le problème :** Si des flammes s'allument au Mali *en même temps* que la Libye clignote, le spectateur ne sait plus où regarder. S'il voit des icônes "village" apparaître, il va chercher à lire une légende qui n'existe pas.
*   **La piste :** Le regard doit suivre une balle de ping-pong. 1. Focus Libye (pulse). 2. La ligne d'encre descend (le regard suit la ligne). 3. Impact au Mali (taches d'encre rouge/brûlée, pas de "flammes" littérales). 4. La zone autour de l'impact perd sa couleur d'État. La causalité est évidente sans un mot.

**2. NARRATION / SYNCHRO (Le rythme)**
*   **Le problème :** Le mot "s'enracinent" (84,5s) est fort. Si l'animation de la tension arrive avant ou après, l'effet tombe à plat.
*   **La piste :**
    *   *69,9s ("Libye s'effondre")* : Pulse assombrissant sur la Libye.
    *   *75,5s ("flot d'armes")* : Départ du path SVG (capillarité).
    *   *79,0s ("nord du Mali s'enflamme")* : Les taches d'impact apparaissent sur Kidal/Gao.
    *   *84,5s ("s'enracinent... État absent")* : Fade out des couleurs étatiques + apparition des hachures de tension. Synchro parfaite.

**3. TRANSITIONS VS ÉTATS (Fluidité)**
*   **Le problème :** Un cut sec de la caméra entre la Libye et le Mali.
*   **La piste :** Un Ken Burns continu. La caméra est en plan large englobant Libye + Sahel au début. Au moment où l'encre touche le Mali (79s), la caméra commence un *lent* zoom/pan (easing `ease-in-out`) pour se recentrer sur le Mali/Burkina pendant que l'État s'efface.

**4. AI-SLOP (Ce qui fait amateur)**
*   **Le problème :** Des icônes "flammes" ou "villages" téléchargées sur Flaticon ou générées par Midjourney, posées sur la carte. Cela détruit l'échelle macro-géopolitique.
*   **La piste :** Reste dans le langage cartographique. Une "flamme" géopolitique, c'est une zone d'influence rouge sang/encre qui s'étend. Un "village", c'est un point kilométrique. Une "tension", c'est une hachure.

**5. EXPERT DU MÉTIER (La différence pro)**
*   **Le problème :** L'amateur a peur du vide et rajoute des calques pour expliquer ce que dit la voix.
*   **La piste :** Le pro utilise l'espace négatif. Le beat 1.3 est brillant *si* tu as le courage de vider la carte. Montrer la fragilité d'un pays en effaçant sa couleur de remplissage pour ne laisser que ses frontières (le trait) sur le parchemin brut, c'est du motion design de très haut niveau.

---

### === SECTION OBLIGATOIRE — ÉVITER L'AI-SLOP (Préventif) ===

Voici les pièges identifiés dans ton plan et comment les désamorcer dans le code :

1.  **RISQUE : Les "flammes géo-ancrées" (Beat 1.2)**
    *   *Pourquoi ça crie AI-Slop :* Des sprites de feu animés en boucle sur une carte parchemin font jeu vidéo mobile cheap.
    *   *La PARADE (Stack) :* Utilise des polygones SVG organiques (comme tes taches d'influence de l'Acte 1, mais plus irrégulières). Anime leur `scale` (de 0 à 1) avec un léger overshoot (effet "splat" d'encre), et utilise une couleur rouge brique désaturée (`#8B3A3A`), en mode de fusion `multiply` (ou opacité 0.7) pour laisser transparaître le grain papier.
2.  **RISQUE : Les icônes "village" et "tension" (Beat 1.3)**
    *   *Pourquoi ça crie AI-Slop :* Surcharge visuelle, mélange d'échelles (on voit des pays entiers, on ne peut pas voir des maisons).
    *   *La PARADE (Stack) :* Zéro icône. Utilise un `pattern` SVG de hachures (`<line>` répétées) défini dans les `<defs>`. Applique ce pattern comme `fill` des régions rurales, et anime son opacité de 0 à 0.4 au moment où la voix dit "tensions".
3.  **RISQUE : Le "Board Clearing" brutal**
    *   *Pourquoi ça crie AI-Slop :* Les jetons de l'Acte 1 qui disparaissent d'un coup sec (display: none) font "slide PowerPoint".
    *   *La PARADE (Stack) :* Transition CSS sur l'opacité (`transition: opacity 1.5s ease`). Les jetons passent à 0.15 ou 0.2. Ils deviennent des "fantômes" sur le parchemin, rappelant qu'on raconte leur genèse.

---

### === SECTION OBLIGATOIRE — EXPERT CONSTRUCTEUR (Préventif) ===

**1. NOS TEMPLATES CHOISIS : Ton 2e avis**
*   *Taches d'influence (Validé) :* Parfait pour l'embrasement du Mali (1.2).
*   *Pulse région (Validé) :* Parfait pour l'effondrement libyen (1.1).
*   *Ce qu'il manque :* Il te faut un **Template "Infiltration"** (un `path` SVG avec `stroke-dasharray` animé pour le flot d'armes) et un **Template "Érosion"** (transition d'un `fill` de couleur unie vers un `fill` transparent + pattern de hachures pour le vide d'État).

**2. SI TU CONSTRUISAIS ÇA DE ZÉRO : L'ordre et les pièges**
Si je code cette séquence, voici mon ordre d'implémentation :
*   **Étape 1 : Le setup de la caméra.** Je définis mes deux keyframes de caméra. KF1 (69s) : Vue large englobant le sud Libye et le fleuve Niger. KF2 (84s) : Cadrage resserré sur la zone des trois frontières (Mali/Burkina/Niger). Je lie ça au scroll/time.
*   **Étape 2 : Le Board Clearing.** Dès 68s (avant que la voix ne commence), j'estompe les jetons de l'Acte 1. Le spectateur "respire" visuellement.
*   **Étape 3 : Le flot (Le fil conducteur).** Je trace mon `path` SVG de la Libye vers Kidal/Gao. C'est l'élément le plus dur à timer. Il doit durer exactement le temps de la phrase (75.5s à 79s).
*   **Étape 4 : L'érosion (Le chef-d'œuvre).** Je sépare le GeoJSON du Mali en deux : les "points de contrôle" (villes) et le "territoire rural". À 84.5s, je tween l'opacité du territoire rural vers 0.1 et je fade-in mon pattern de hachures.
*   *Le piège à éviter :* Ne pas changer la couleur de fond de la mer ou des pays hors-sujet. Garder le focus strict sur l'axe Libye-Mali.

**3. ENCHAÎNEMENT POUR LA COMPRÉHENSION (Le séquençage Lambda)**
Pour que le spectateur ne décroche jamais, la règle est **"L'action A provoque l'action B"**.
*   (Respiration) Les jetons actuels s'estompent. Le spectateur comprend qu'on fait un flashback.
*   (Action A) La Libye pulse (sombre). L'œil monte.
*   (Lien A->B) Un trait d'encre noire coule de la Libye vers le sud. L'œil redescend, guidé par le trait.
*   (Action B) Le trait touche le nord Mali. Des taches rouge brique (influence) s'étendent.
*   (Conséquence) La caméra se rapproche de ces taches. Autour d'elles, la couleur de l'État s'évapore, révélant un parchemin hachuré et rugueux.
Le spectateur a compris : *Le choc au nord a profité d'un terrain déjà vide et fracturé.* Pas besoin de texte, la carte a fait le travail.