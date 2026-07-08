# STORYBOARD — "L'AES en 90 secondes" (Agent B, direction figée : carte vivante d3-geo)

> Angle de travail : produit en aveugle d'un autre agent créatif sur le même brief. Aucune tentative de deviner sa proposition. Direction visuelle NON NÉGOCIÉE : 1 seule carte d3-geo pur (parchemin ocre), 1 seul cadre continu, 1 seule rupture de registre (fracture CEDEAO). J'exécute avec des gestes précis, quitte à aller loin — le réalisateur préfère trop loin que plat.

Base 30fps. Durée totale 91.86s = 2756 frames. `f(s) = round(s*30)`.

---

## 0. PRINCIPE DE CONTINUITÉ — "LA CARTE QUI S'ÉCRIT" (signature du storyboard)

Un seul objet vit à l'écran du frame 0 au frame 2756 : **la carte parchemin Sahel** (Mali/Burkina/Niger, projection `geoMercator().fitExtent`, calée sur `sahel-countries.geojson`). Rien ne coupe vers un nouveau décor. Chaque bloc est un ÉTAT que cette carte traverse : elle se trace, se peuple, se fracture, se refonde, se recolore en insert, redevient elle-même. La caméra ne bouge jamais artificiellement (pas de pan/zoom gratuit) — seul un `pushIn` continu très léger (identique au pattern `ProtoEffect_Fracture`, `scale 1 → 1.06` sur toute la durée) donne une tension de fond, plus la respiration `breath = 1 + 0.005*sin(frame*0.07)`.

Signature perso (là où le brief laisse la main) : je traite la carte comme un **parchemin qui s'écrit au fur et à mesure du récit** — chaque bloc ajoute une couche d'encre (trait, fill, symbole) sans jamais effacer la précédente avant que le sens exige une rupture (Libye qui vire au gris/rouge, fracture CEDEAO). La carte accumule de la mémoire visuelle comme le texte accumule du sens. C'est la réponse à "comment un bloc efface le précédent" : **il ne l'efface pas, il le recouvre ou le fait muter en place**.

Grille commune (reprise `ProtoCarto_ContinentDraw` / `ProtoEffect_Fracture`) :
- `PARCH #e4ddca`, `PARCH_DARK #d6cdb4`, `GRID #c2a96a`, `OCRE #e7bd78`, `OCRE_MID #d2ad66`, `OCRE_DARK #bf9442`, `NAVY #16213a`, `NAVY_DEEP #0d1424`, `GOLD #d8b25a`, `CRISIS #b23a2e`, `CRISIS_DARK #7d2118`.
- Fond papier texture (`feTurbulence baseFrequency=0.02`) + grille verticale/horizontale `GRID_STEP=185` + grain global `mixBlendMode: overlay` + balayage de lumière diagonal en boucle 240-280f — ces 4 couches restent ACTIVES sans interruption du frame 0 à 2756 (prouvé, code existant).
- Projection : `geoMercator().fitExtent([[W*0.08,H*0.30],[W*0.92,H*0.86]], sahelFeatureCollection)` — carte ancrée dans le tiers inférieur de l'écran pour laisser la moitié haute libre aux sous-titres/cartouches (format 1080×1920 vertical, contrainte que `ProtoCarto_ContinentDraw` n'a pas puisque conçu en 16:9). Le cadrage vertical est LE choix de composition spécifique à ce Short — à trancher en review avant code (voir §7).
- Sous-titres mot-par-mot : `WHISPER_WORDS`, ancrés bande basse `y=1750-1850`, fond bandeau semi-opaque navy `rgba(22,33,58,0.55)` pour rester lisibles par-dessus la carte quel que soit son état de couleur. Chaque mot : `opacity spring-in ~4f`, mot courant en `GOLD`, mots passés en `PARCH` à 70% opacité (pattern karaoké standard, pas de nouveauté à prototyper).

---

## 1. PANEL PAR PANEL

### Panel 1 — "En moins de trois ans, trois nations ont tout changé en même temps."
**Bornes** : 0.0–4.1s → **f0–f123** (+ pad respiration jusqu'à f130 avant le silence 4.1-5.5s)

**À l'écran** : fond parchemin + grille + texture qui FADE IN (`introFade` 0→14f, pattern existant). Les 3 pays (Mali, Burkina, Niger) se tracent au trait navy, `strokeDasharray/strokeDashoffset`, décalés dans l'ordre ouest→est (Mali puis Burkina puis Niger, sur le modèle `perCountry(i)` de `ProtoCarto_ContinentDraw`, `drawWindow` compressé à 70f pour tenir dans 123f). Le fill ocre monte derrière chaque contour, décalé de +20f par rapport à son trait. AUCUN drapeau encore — pays "vierges", juste tracés.

**Geste précis** :
- `t0(i) = (i/3) * 52` (i=0 Mali, 1 Burkina, 2 Niger), `drawProg = interpolate(frame, [t0, t0+30], [0,1], clamp)`.
- `fillProg = interpolate(frame, [t0+20, t0+20+34], [0,1], clamp)`, fill = `url(#ocreFillC)` (même dégradé que le proto).
- Cartouche titre "DOSSIER / L'AES EN 90 SECONDES" en haut (pattern `ProtoCarto_ContinentDraw` lignes 254-267), `opacity 18→42f`.
- Sur "tout changé en même temps" (f97-123) : les 3 pays, une fois tracés, respirent en phase — pulse synchronisé léger `1+0.02*sin(frame*0.15)` sur le `<g>` des 3 pays ensemble (pas individuellement) pour signifier "en même temps" par le mouvement, pas par un texte qui paraphrase.

**Enchaîne sans cut** : c'est l'ouverture, rien à raccorder en amont. Le fade-in de la texture EST l'entrée en matière.

**Sous-titres actifs** : mot-par-mot sur toute la plage, karaoké standard.

**Faisabilité** : PROUVÉ (brique `ProtoCarto_ContinentDraw`, juste changer la featureCollection de "Afrique entière" à `sahel-countries.geojson` + réduire `drawWindow`).

---

### Panel 2 — "Ils chassent leurs partenaires militaires, rompent leurs alliances historiques, et quittent la CEDEAO pour bâtir quelque chose de nouveau."
**Bornes** : 5.5–12.7s → **f165–f381**

**À l'écran** : les 3 pays sont pleins (fill ocre stable), contour navy net. Un ANCIEN LIEN se dessine et se rompt : un trait fin pointillé doré partant du bloc Sahel vers le cadre (symbolisant "partenaires historiques"/CEDEAO), qui se DÉCHIRE en 2 segments qui reculent (courte animation ~20f) au moment exact de "chassent"/"rompent". Puis le mot "CEDEAO" (f10.46-11.0, f314-330) déclenche l'apparition d'un cartouche discret en haut-droite (texte "CEDEAO" en grisé/estompé, pas encore l'écusson complet — celui-ci arrive au panel 8b).

**Geste précis** :
- Trait de lien : `<path>` navy pointillé de `sahelCentroid` vers un point hors-cadre en haut (symbolisant l'extérieur/les partenaires), tracé f165-200 (`strokeDashoffset`), puis CASSÉ f230-250 : le trait se scinde en 2 segments qui `translate` chacun de ±40px en s'éloignant, `opacity → 0` sur 15f. Petit `SFX` `cedeao-snap.mp3` (déjà dans le repo, utilisé par `ProtoEffect_Fracture`) à très faible volume (0.35) ici — PAS le craquement fort réservé à la vraie fracture du panel 8b (économie de l'effet : celui-ci doit rester le climax).
- Sur "quittent la CEDEAO" (f301-330) : le cartouche CEDEAO apparaît en haut à droite, gris `#8a8272`, `opacity 0→0.5`, PAS encore actif (annonce discrète, la vraie confrontation visuelle vient en 8b).
- Sur "bâtir quelque chose de nouveau" (f339-381) : les 3 pays pulsent une seconde fois, plus fort (`1+0.04*sin`), légère montée de saturation du fill ocre (`OCRE_MID → OCRE` sur ces 42f) — un frémissement d'énergie neuve, pas encore l'AES (ça vient au panel 9).

**Enchaîne sans cut** : continuité directe du panel 1, la carte ne bouge pas, on ajoute juste la couche "lien rompu" par-dessus l'état stable acquis.

**Faisabilité** : trait+cassure = ADAPTATION DIRECTE du geste `ProtoEffect_Fracture` (zigzag `random()` déterministe) à un trait simple point-à-point — PROUVÉ dans son principe (dash + cassure), À PROTOTYPER dans sa forme exacte (trait vs path pays). Cartouche CEDEAO discret = trivial (texte + opacity).

---

### Panel 3 — "Tout bascule en 2012, quand la Libye s'effondre :"
**Bornes** : 14.3–17.6s → **f429–f528**

**À l'écran** : RUPTURE DE FOCALE SANS CUT DE DÉCOR — la carte Sahel se DÉCALE légèrement vers le bas-cadre (translation douce, pas de zoom caméra artificiel : c'est la PROJECTION qui se recale) pour faire de la place en haut-cadre à la Libye qui apparaît et se trace, au nord, hors du geojson Sahel (topoJSON mondial `countries-50m.json`, filtre `name === "Libya"`, projetée dans LE MÊME `projection` géographique que le bloc Sahel — cohérence géo garantie par construction puisque c'est la même fonction `geoMercator`).

**Geste précis** :
- `projection.fitExtent` est recalculé une seule fois pour englober Sahel+Libye ensemble dès le début du plan (pas de re-fit dynamique en cours de route — ça créerait un flottement des pays déjà tracés, anti-pattern à éviter). Ce recalcul est anticipé DÈS le panel 1 en fixant l'extent définitif sur la collection combinée ; la Libye est juste invisible (opacity 0 / non montée) jusqu'ici. **Décision technique clé** : un seul `fitExtent` pour toute la durée du plan, calculé une fois au chargement des données — pas de transition de projection en vol.
- Trait Libye se dessine f429-475 (`drawProg` identique au pattern pays), fill ocre monte f455-495.
- Sur "bascule" (f431-447) : léger `shake` de 6px d'amplitude sur tout le groupe carte (reprend `shakeAmp`/`shakeX/Y` de `ProtoEffect_Fracture`, amorti sur 15f) — le mot "bascule" EST un geste physique, pas juste un mot qui passe.
- "2012" (f460-479) apparaît en incrustation datée, cartouche sobre type `22 MAI` du proto fracture (`Bebas Neue`, 72px, `NAVY`), posé RIGIDE sous la Libye, pas flottant.

**Enchaîne sans cut** : le décalage de projection est progressif (`interpolate` sur le `translate` du groupe carte, 30f d'ease), la Libye monte DANS le même cadre que le Sahel — jamais de coupure, juste un cadrage qui s'élargit pour "regarder plus loin".

**Faisabilité** : trace Libye = PROUVÉ (même mécanique que pays Sahel, juste une géométrie TopoJSON différente). Décalage de projection anticipé = À PROTOTYPER (le risque : si le fitExtent Sahel+Libye est calculé dès le départ, les 3 pays Sahel du panel 1 seront plus petits à l'écran qu'un fitExtent Sahel-seul — à valider visuellement que ça reste lisible en format vertical serré). Alternative si trop petit : garder le Sahel en fitExtent propre et faire apparaître la Libye en médaillon séparé raccordé par un trait — MAIS ça romprait "un seul cadre continu". Je recommande la 1ère option (fitExtent unique dès le départ) et j'assume le risque de pays plus petits — compensable par un HALO/contour plus épais sur Mali/Burkina/Niger pour garder leur poids visuel.

---

### Panel 4 — "Armes et combattants descendent vers le sud, et le nord du Mali s'enflamme."
**Bornes** : 18.9–22.9s → **f569–f687**

**À l'écran** : depuis la Libye (déjà tracée, fill ocre stable), un FLUX descend vers le nord du Mali. Le nord du Mali (à l'intérieur du polygone Mali existant, pas un nouveau shape) VIRE progressivement à une teinte rouge-brique en partant du haut du pays.

**Geste précis** :
- Flux : `FlowDots` (brique déjà prouvée dans `ResourcesRevealSVG9x16` lignes 18-34 — `strokeDasharray` en pointillés animés qui glissent via `strokeDashoffset = -t*gap`) le long d'un path simple reliant le centroïde Libye au centroïde nord-Mali (coordonnées géo réelles projetées par la MÊME `projection`, pas de path arbitraire). Couleur `CRISIS #b23a2e`, `count=4`, actif f569-620.
- "Nord du Mali s'enflamme" (f641-687) : un **masque de dégradé radial** centré sur un point nord-Mali réel (ex. région de Kidal, lon/lat approx `[1.4, 18.4]`) recouvre PROGRESSIVEMENT le fill du polygone Mali existant avec `CRISIS`, `clipPath` = le path Mali lui-même (le rouge ne déborde jamais du contour du pays — rigueur géo). `interpolate(frame, [641,687], [0,1])` pilote le rayon du dégradé radial (`0 → 380px`), Mali entier n'est PAS rouge, seule sa moitié nord.
- Micro-tremblement (`shakeAmp` réduit à 3px) au moment exact de "enflamme" (f680-687), écho discret du panel 3.

**Enchaîne sans cut** : le flux part d'un pays déjà là (Libye), arrive sur un pays déjà là (Mali) — aucune nouvelle géométrie introduite, seulement une propagation de couleur sur les polygones acquis. C'est la démonstration la plus pure du principe "la carte accumule, elle ne recommence jamais".

**Faisabilité** : `FlowDots` = PROUVÉ (code existant, copier direct). Masque radial clippé sur path Mali = À PROTOTYPER (mécaniquement simple : `<clipPath>` + `<circle>` en dégradé qui grandit — proche de patterns déjà vus mais pas exactement ce montage-là dans le repo).

---

### Panel 5 — "La France, puis l'ONU interviennent — mais tiennent les villes, pas les campagnes."
**Bornes** : 24.5–29.3s → **f735–f879**

**À l'écran** : sur la carte (nord-Mali toujours teinté rouge du panel 4, qui NE S'EFFACE PAS), des POINTS PULSANTS bleu-blanc (France) puis bleu-ONU apparaissent sur les VRAIES coordonnées des villes majeures tenues (Bamako, Gao, Tombouctou — coords géo réelles). Le rouge, lui, reste actif et VISIBLE dans les zones rurales autour — la carte montre littéralement "villes tenues (points) vs campagnes non tenues (fond rouge diffus)".

**Geste précis** :
- Points villes : reprise directe du pattern `RESOURCE_POINTS` (cercle navy + centre ocre qui pulse, `0.5+0.5*sin(frame*0.16+i)`) mais recoloré : anneau extérieur `#3a5a8c` (bleu sobre France/ONU, pas un bleu drapeau criard), apparition décalée par ville (`appear = interpolate(frame,[start,start+18],[0,1])`, start f735, f755, f775 pour Bamako/Gao/Tombouctou).
- "France" (f744-755) : les points premières villes (Bamako) s'allument bleu-blanc plus franc `#eef2f7` bordure.
- "ONU" (f778-782) : un 2e halo bleu (`#4a7ab8`, plus institutionnel) se superpose en cerne fin autour des mêmes points — 2 anneaux concentriques = 2 acteurs sur les mêmes villes, sans dupliquer la géométrie.
- "tiennent les villes, pas les campagnes" (f826-879) : le fond rouge du nord-Mali (acquis panel 4) PULSE doucement plus fort (`opacity 0.55→0.75` en respiration lente, pas un flash) pendant que les points villes restent stables — contraste direct stable/instable qui EST la phrase, sans texte qui la répète.

**Enchaîne sans cut** : les points s'ajoutent sur la carte déjà rouge — encore une fois, accumulation, pas remplacement.

**Faisabilité** : PROUVÉ (mécanique identique à `RESOURCE_POINTS` de `ProtoCarto_ContinentDraw`, juste recoloré + coords Sahel réelles au lieu de coords Afrique-hydrocarbures).

---

### Panel 6 — "Dix ans plus tard, les groupes armés contrôlent PLUS de territoire qu'en 2012."
**Bornes** : 30.3–35.8s → **f909–f1074**

**À l'écran** : le rouge, jusqu'ici confiné au nord-Mali, S'ÉTEND visuellement — le masque radial clippé (panel 4) grandit encore, déborde maintenant sur des portions de Burkina et Niger (toujours strictement clippé à l'intérieur des 3 polygones pays, jamais hors-frontière — rigueur géo absolue). Les points bleus (villes) restent figés, minoritaires, noyés dans le rouge grandissant.

**Geste précis** :
- 3 masques radiaux indépendants (un par pays, centré sur un point représentatif de zone d'insécurité réelle par pays — nord-Mali, est-Burkina zone Liptako, ouest-Niger zone Liptako), chacun `clipPath` = son propre path pays, rayon `interpolate(frame,[909,1050],[rayonActuel, rayonActuel*2.4])`.
- Un compteur discret "TERRITOIRE CONTRÔLÉ" en cartouche marge (pattern colonne cartouche du proto `ProtoCarto_ContinentDraw` lignes 269-296) avec un **count-up** simple (pas le donut complexe de `SceneBilanV3` — trop lourd visuellement ici, sobriété demandée) : `2012` qui se barre, `AUJOURD'HUI: +X%` qui monte en `spring()`. Valeur X à faire confirmer par le script/sources (ne pas confabuler un chiffre non présent dans le script — le texte dit juste "PLUS de territoire", je propose d'afficher "+territoire ▲" sans pourcentage inventé, sauf si une source chiffrée existe déjà dans `FACTS-RESSOURCES-2026.md` ou équivalent — À VÉRIFIER avant code, ne pas broder).
- Pulse de la vignette sombre légère (`vignetteRaw` du proto fracture, plafonnée à 0.25 seulement, pas le 0.52 du proto original qui est trop dramatique ici) qui monte doucement en bord de cadre — tension sans assombrir la lisibilité des sous-titres.

**Enchaîne sans cut** : extension pure du geste panel 4/5, aucun nouvel objet introduit à part le cartouche chiffré (marge, pas plein cadre).

**Faisabilité** : masque radial multi-pays = À PROTOTYPER (extension directe du geste panel 4, complexité linéaire). Cartouche count-up sobre = PROUVÉ dans son principe (spring + texte), le chiffre exact reste à vérifier factuellement.

---

### Panel 7 — "Face à cet échec, les militaires prennent le pouvoir dans les trois pays."
**Bornes** : 37.4–41.2s → **f1122–f1236**

**À l'écran** : sur les 3 polygones Sahel (toujours rouges en dégradé de panel 6, ÇA NE PART PAS), un symbole simple et sobre apparaît au centroïde de CHAQUE pays l'un après l'autre : pas un blason/écu (proscrit — le réalisateur a rejeté ce registre), mais une FORME GÉOMÉTRIQUE SIMPLE qui dit "bascule institutionnelle" sans figuration héraldique — je propose un **anneau qui se ferme** (cercle `strokeDasharray/strokeDashoffset` qui boucle sur lui-même en ~20f, épais, navy) au-dessus de chaque capitale, séquencé Mali→Burkina→Niger (l'ordre chronologique réel des coups : Mali 2020/21, Burkina 2022, Niger 2023 — respecter l'ordre historique, PAS l'ordre ouest→est mécanique des panels précédents ; c'est un choix délibéré pour ancrer la vérité factuelle plutôt que la cohérence purement graphique).

**Geste précis** :
- Anneau pays i : `start = 1122 + i*24` (Mali i=0, Burkina i=1, Niger i=2), `strokeDashoffset` boucle `0→ringLen` sur 20f, couleur `NAVY`, rayon 46px, positionné au centroïde de la capitale (coords réelles Bamako/Ouagadougou/Niamey).
- Le rouge de fond, lui, arrête de progresser ici (fige sa valeur de panel 6) — signe que l'échec est acté, on tourne une page sans effacer la précédente.
- Léger `NAVY` qui gagne en épaisseur sur le CONTOUR des 3 pays (`strokeWidth 2.2 → 3.6`) au fil de leur anneau — l'État qui se redresse visuellement se lit dans l'épaisseur du trait qui les délimite.

**Enchaîne sans cut** : toujours la même carte, seul le rythme de séquencement (3 anneaux successifs) crée la respiration.

**Faisabilité** : PROUVÉ dans son mécanisme (cercle `strokeDashoffset`, identique en principe au trait de contour pays déjà utilisé partout). Aucun nouvel asset.

---

### Panel 8a — "La CEDEAO menace d'une intervention armée."
**Bornes** : 42.5–45.4s → **f1275–f1362**

**À l'écran** : reprise du cartouche CEDEAO discret posé au panel 2 (toujours présent en haut-droite, gris, jamais retiré) — il se RÉVEILLE : passe de gris `#8a8272` à un ROUGE D'ALERTE `#b23a2e` (même `CRISIS` que le rouge-crise des zones rouges), pulse fort (`1+0.08*sin`), une flèche fine (pas `SahelAttackArrow`, voir note faisabilité) part du cartouche CEDEAO vers le bloc des 3 pays, tracée en `strokeDasharray` rouge, s'arrêtant à mi-chemin (menace suspendue, pas encore exécutée).

**Geste précis** :
- `cedeaoColorK = interpolate(frame,[1275,1310],[0,1])`, `mix(#8a8272, CRISIS, cedeaoColorK)` (fonction `mix()` déjà présente dans `ProtoEffect_Fracture`, copiable telle quelle).
- Flèche menace : simple `<path>` avec tête de flèche SVG dessinée à la main (`<polygon>` triangle en bout de trait) — PAS le composant `SahelAttackArrow` qui dépend de `map.project()` Mapbox (incompatible d3-geo pur, voir §6 faisabilité). Le trait se dessine `strokeDashoffset` f1275-1320, s'arrête à 55% du trajet (jamais ne touche le bloc pays — la menace n'est pas encore l'acte).
- Micro-shake (4px) sur le bloc des 3 pays à "armée" (f1350-1362) — la menace fait vibrer la carte, avant-goût de la fracture réelle qui vient.

**Enchaîne sans cut** : le cartouche CEDEAO existe depuis le panel 2 — ce n'est pas un nouvel élément, c'est une MUTATION d'un élément déjà là. Exactement le principe "accumulation, jamais un nouveau décor".

**Faisabilité** : PROUVÉ (mix couleur + strokeDashoffset, tout déjà utilisé). Flèche maison en SVG pur = trivial, pas de dépendance Mapbox.

---

### Panel 8b — "Cette menace... va produire l'inverse de l'effet recherché." → **LA RUPTURE UNIQUE**
**Bornes** : 46.8–50.8s → **f1404–f1524**

C'est l'unique rupture de registre autorisée par le brief. Généralisation directe de `ProtoEffect_Fracture` (déjà prouvé sur le Sénégal) au bloc des 3 pays AES.

**À l'écran** : sur "menace" (f1405-1430, avant les points de suspension marqués dans le texte), rien ne bouge encore — tension pure (silence relatif, la voix hésite "cette menace..."). Puis sur "va produire l'inverse" (f1430-1466) : la FRACTURE zigzag (identique en principe au `fracturePath()` du proto, généralisée pour traverser le BLOC ENTIER des 3 pays au lieu d'un seul pays) se trace d'un coup (`strokeDashoffset`, 12f), `SFX cedeao-snap.mp3` plein volume (0.9, réservé jusqu'ici), `shakeAmp` fort (18px amorti) — LE craquement de toute la séquence. La flèche CEDEAO du panel 8a, elle, RECULE et se BRISE en morceaux (mini-debris, pattern `debris` du proto fracture) : la menace échoue littéralement sous nos yeux.

**Geste précis (généralisation du proto)** :
- `fracturePath()` recalculé pour traverser TOUT le bloc Sahel (segment `x0,y0 → x1,y1` élargi aux bounds combinés Mali+Burkina+Niger dans l'espace écran, mêmes 9 segments zigzag + `jitter` déterministe via `random()`).
- Chaque pays est scindé en 2 moitiés via `clipPath` (exactement le mécanisme `halfA`/`halfB` du proto, mais appliqué aux 3 paths pays simultanément, chaque paire de moitiés se sépare avec son propre `split` — Mali s'écarte le plus (épicentre historique de la crise), Burkina et Niger un peu moins, `splitMali > splitBurkina ≈ splitNiger`, hiérarchie visuelle qui suit la gravité réelle de la rupture).
- `crisisK = interpolate(since,[2,22],[0,1])` : le fill ocre-et-déjà-rouge (accumulé depuis panel 4/6) vire à un rouge PLUS profond et sombre (`CRISIS → CRISIS_DARK`), signature "ça empire encore".
- "Effet recherché" (f1490-1524) : la fracture NE SE REFERME PAS encore ici (contrairement au proto Sénégal où elle se recompose vite) — elle reste ouverte, tenue, jusqu'au panel 9 où le sceau AES viendra littéralement la RESSOUDER (continuité de sens : c'est l'AES qui répare la fracture CEDEAO, pas un simple fondu).

**Enchaîne sans cut vers Panel 9** : la fracture reste ouverte à la fin de 8b — le panel 9 commence la recomposition SUR cette fracture, pas après un cut.

**Faisabilité** : PROUVÉ dans son mécanisme exact (c'est littéralement `ProtoEffect_Fracture`, code existant, généralisé de 1 à 3 pays — travail d'adaptation mécanique, pas d'invention). Seul point neuf : synchroniser 3 splits différentiels au lieu d'1 seul — complexité additive raisonnable, pas un risque.

---

### Panel 9 — "Le 16 septembre 2023, les trois pays scellent leur union : naît l'Alliance des États du Sahel." → INSERT LIPTAKO RECOLORÉ
**Bornes** : 52.6–60.5s → **f1578–f1815**

**À l'écran** : la fracture ouverte (panel 8b) commence à se REFERMER — les 3 moitiés-paires reviennent vers le centre (`recompose`, ease-out cubique, identique au proto). AU MOMENT DU CONTACT (les moitiés se rejoignent, ~f1650), au lieu de rester une carte plate, la scène BASCULE en douceur (sans cut — cross-shape morph, voir ci-dessous) vers la chorégraphie `LiptakoRevealSVG9x16` (sceau + 3 cordages + emblèmes Mali/Niger/Burkina) déjà codée, mais **recolorée pour rester dans la palette carte** (voir §5 palette).

**Comment ça enchaîne SANS cut** : le sceau central de `LiptakoRevealSVG9x16` apparaît EXACTEMENT au point de jonction de la fracture (mêmes coordonnées écran — le sceau "nait" du point de recomposition, littéralement à l'endroit où les 3 pays se retouchent). Les 3 "cordages" du Liptako (qui relient normalement 3 emblèmes au sceau) sont redessinés pour partir des 3 CENTROÏDES RÉELS des pays sur la carte (pas des positions arbitraires du composant original) — donc les cordages SONT la continuité géographique : ils partent des mêmes points que les pays qu'on vient de voir se fracturer/recomposer. Le fond passe du parchemin `#e4ddca` au parchemin Liptako `#EBE0C8` (quasi identique, transition imperceptible, `interpolate` 20f) — pas un saut de décor, une continuité de matière.

**Geste précis** :
- `recompose` du panel 8b continue jusqu'à 1 vers f1650.
- Sceau (`LiptakoRevealSVG9x16` lignes 206+) : `sealOpacityFinal` apparaît pile au point de jonction, montée f1650-1680.
- 3 cordages : recalculés pour partir des centroïdes carte réels (`MALI/NIGER/BURKINA` du composant original REMPLACÉS par les `cx,cy` projetés de la vraie carte) vers le sceau central.
- "16 septembre 2023" (f1580-1630) : cartouche date sobre, `Bebas Neue`, apparaît discrètement en haut (pas de nouvelle typo criarde).
- "naît l'Alliance des États du Sahel" (f1721-1815) : les 3 emblèmes/drapeaux se révèlent (`flagOp`, mécanisme clippé déjà prouvé lignes 132-142/196-198), sceau final stable, respiration `breathe` continue.
- Grille+texture+grain parchemin restent ACTIFS en fond superposé (overlay) même par-dessus l'insert recoloré — c'est ce qui garantit qu'on ne "saute" jamais de registre, juste une densité d'ornement qui monte.

**Enchaîne sans cut vers Panel 10** : le sceau final reste posé, stable, pendant que le panel 10 ajoute les veines de ressources par-dessus (pas de sortie).

**Faisabilité** : PROUVÉ pour la chorégraphie Liptako elle-même (code existant, à recolorer — trivial). À PROTOTYPER pour le raccord géométrique exact (cordages recalés sur coords carte réelles au lieu des positions fixes du composant original) — travail de recalibrage de coordonnées, pas de nouvelle mécanique d'animation.

---

### Panel 10 — "Pour tenir face aux sanctions, l'alliance s'appuie sur un levier : l'or du Mali et du Burkina Faso, l'uranium et le pétrole du Niger." → INSERT RESOURCES RECOLORÉ
**Bornes** : 62.1–70.9s → **f1863–f2127**

**À l'écran** : le sceau AES (acquis panel 9, ne disparaît pas) devient le point d'ancrage du bouclier `ResourcesRevealSVG9x16` — continuité littérale : le bouclier du Resources REMPLACE visuellement le sceau au même endroit écran (fondu direct, pas de saut de position), recoloré pour sortir du noir héraldique `#080808/#111111` d'origine et rejoindre la palette carte (voir §5).

**Geste précis** :
- Reprise identique du timing interne `ResourcesRevealSVG9x16` (shield draw f0-30, or f20-55, uranium f157-192, pétrole f188-223 — relatif à l'`inAt` du panel, soit f1863).
- 3 veines (or/uranium/pétrole) redessinées pour partir des 3 centroïdes pays réels (même logique de raccord géo que le panel 9) au lieu des coordonnées `SHIELD_CX ± offset` arbitraires du composant original — cohérence : l'or part littéralement du territoire Mali/Burkina qu'on a vu se tracer au panel 1.
- "l'or du Mali et du Burkina Faso" (f1902-1943) : les 2 veines or s'allument, cartouches pays apparaissent.
- "l'uranium et le pétrole du Niger" (f2066-2128) : 2 veines depuis le Niger.

**Enchaîne sans cut vers Panel 11** : le bouclier reste, sert de socle visuel au count-up qui suit.

**Faisabilité** : PROUVÉ pour la chorégraphie (code existant). À PROTOTYPER pour le raccord géo des veines (même travail que panel 9, recalibrage de coordonnées).

---

### Panel 11 — "En trois ans, le Sahel a fait tomber un statu quo vieux de SOIXANTE ANS. Reste à savoir si cette nouvelle alliance va tenir dans le temps."
**Bornes** : 72.3–83.0s → **f2169–f2490**

**À l'écran** : le bouclier AES (acquis) reste posé, stable, en fond. Un COUNT-UP "60" apparaît en grand, sobre (`Bebas Neue`, ~120px, `NAVY` sur fond parchemin — pas le style bling du donut `SceneBilanV3`, trop lourd ici), qui monte de 0 à 60 en `spring()`, cale sur "soixante ans" (f76.28-77.6 → f2288-2328).

**Geste précis** :
- `count = spring({frame: frame-2288, fps, config:{damping:14,stiffness:90}})`, valeur affichée = `Math.round(interpolate(count,[0,1],[0,60]))`, format `tabular-nums`.
- "statu quo" (f2242-2258) : un TRAIT BARRÉ traverse discrètement le cartouche CEDEAO résiduel (toujours présent depuis panel 2/8, jamais retiré) — dernière mention visuelle de l'ancien ordre qui tombe, cohérence avec le principe d'accumulation : on ne fait pas juste apparaître un nouveau symbole, on ferme visuellement celui qui existait déjà.
- "Reste à savoir si... va tenir dans le temps" (f2360-2490) : légère respiration d'incertitude — le fill des 3 pays PULSE une dernière fois plus lentement (`period` doublée vs les pulses précédents, ~0.03 rad/frame au lieu de 0.07-0.08) pour marquer un ton suspensif, pas conclusif. Pas de nouvelle géométrie.

**Enchaîne sans cut vers Panel 12** : fondu doux (pas cut) vers le CTA — voir panel 12.

**Faisabilité** : PROUVÉ (spring+count-up = mécanique triviale et déjà vue ailleurs dans le repo, ex. `SceneBilanV3`, simplifiée ici).

---

### Panel 12 — "L'histoire complète — la Libye, Kidal, le vrai coût humain — dans la vidéo longue. Lien en description." → CTA (vraie carte Mapbox + 3 leaders)
**Bornes** : 84.0–91.86s → **f2520–f2756**

**À l'écran** : SEULE transition qui n'est PAS un "un seul cadre continu" au sens strict — le brief l'autorise explicitement ("CTA vraie carte Mapbox + 3 leaders", composant `CtaCard.tsx`, à ne pas toucher). Je le traite comme la SORTIE du parchemin plutôt qu'un cut brutal : la carte parchemin (état final panel 11) se referme comme on referme un livre — un fondu-enchaîné où le fond parchemin `bgOp` du CTA (0→14f, mécanisme déjà dans `CtaCard.tsx`) chevauche la sortie du parchemin sur 14-20f, pas un cut sec à la frame près.

**Geste précis** : reprise intégrale de `CtaCard.tsx` sans modification (instruction explicite du brief). Seul ajout : caler le fondu d'entrée du CTA pour qu'il commence 10f AVANT la fin réelle du panel 11 (chevauchement `Sequence` de 10f), pour adoucir le seul vrai raccord de toute la vidéo.

**Faisabilité** : PROUVÉ, ne pas toucher (instruction du brief).

---

## 2. STYLE DRAPEAU — CHOIX TRANCHÉ

**Décision : APLAT/DÉGRADÉ DE LA COULEUR DOMINANTE, PAS l'image clippée**, pour les polygones PAYS eux-mêmes (Mali/Burkina/Niger/Libye tracés sur la carte principale des panels 1-8).

**Justification lisibilité** : les polygones Mali/Burkina/Niger en projection Mercator à l'échelle d'un cadre 1080px de large sont de PETITE taille et fortement CONCAVES (Burkina notamment a un contour très découpé). Un drapeau réel (Mali = 3 bandes verticales vert/jaune/rouge, Burkina = 2 bandes horizontales rouge/vert + étoile, Niger = 3 bandes horizontales orange/blanc/vert + disque) clippé dans un polygone concave de moins de 150px de large va soit (a) se retrouver tronqué de façon illisible sur les bandes fines, soit (b) exiger un `preserveAspectRatio="xMidYMid slice"` qui recadre le drapeau au point de le rendre méconnaissable (ex. le disque orange du Niger totalement hors-cadre). Le brief demande "couleurs projetées dans les polygones" comme intention — un aplat de la couleur DOMINANTE du drapeau (Mali → vert `#14A24A` ou or, Burkina → rouge `#EF2B2D`, Niger → orange `#E05206`) porte le SENS (couleur nationale = appartenance) sans le risque de bouillie visuelle à petite échelle. C'est cohérent avec le principe "fill ocre qui monte" déjà utilisé sur `ProtoCarto_ContinentDraw` — je remplace juste l'ocre neutre par la couleur du pays une fois son identité affirmée (au moment de l'AES, panel 9+), gardant l'ocre neutre tant que le pays n'est "que" un territoire pas encore politiquement défini (panels 1-6).

**Où l'image réelle du drapeau EST utilisée (et c'est prouvé, brique `LiptakoRevealSVG9x16` lignes 132-142/196-198)** : dans les INSERTS (Liptako panel 9, où chaque pays est représenté par un écusson de taille FIXE ~180×260px, largement assez grand pour qu'un vrai drapeau clippé reste lisible). Cohérence : gros médaillon = vrai drapeau ; petit polygone pays = aplat couleur.

**Libye** : même logique — aplat vert `#007A3D` (drapeau libyen actuel, uni vert n'existant plus depuis 2011, ambiguïté à signaler : le drapeau "royaume" tricolore rouge-noir-vert-croissant est le drapeau POST-2011, celui d'avant l'effondrement était le vert uni Kadhafi — **ATTENTION FACTUELLE, à vérifier avant render** : le script dit "en 2012 la Libye s'effondre", le drapeau vert Kadhafi est celui D'AVANT la chute, le tricolore actuel est celui institué APRÈS. Le geste demandé — "vire au gris puis rouge" — a plus de sens en partant du TRICOLORE post-Kadhafi (le nouvel État libyen instable) qui s'éteint, pas du vert Kadhafi. Je pars de l'hypothèse tricolore rouge-noir-vert avec croissant/étoile, à confirmer.)

---

## 3. GESTE LIBYE — CHORÉGRAPHIE EXACTE

Séquence complète (chevauche panels 3 à 5, f429 à f879) :

1. **f429-475** : trace du contour Libye (`drawProg` standard), fill encore neutre ocre (pas encore de drapeau — la Libye est d'abord juste "un pays sur la carte", comme les 3 du Sahel au panel 1).
2. **f475-520** : le drapeau (aplat tricolore simplifié — 3 bandes horizontales rouge/noir/vert, pas le croissant/étoile trop petit à cette échelle) monte en `opacity 0→1` DANS le clipPath du polygone Libye (mécanisme clippé identique à `LiptakoRevealSVG9x16`, mais ici appliqué au polygone pays réel, pas à un écusson stylisé) — Libye "existe" politiquement au moment où sa géométrie se remplit.
3. **f569 (panel 4, "armes et combattants descendent")** : le drapeau libyen COMMENCE à virer au GRIS — `griseK = interpolate(frame,[569,650],[0,1])`, `mix(couleurDrapeauLibye, "#8a8878", griseK)` appliqué à CHAQUE bande du drapeau indépendamment (les 3 bandes grisent ensemble, synchronisées).
4. **f650-720** : le gris continue de dominer, PUIS vire au ROUGE crise (`rougeK = interpolate(frame,[650,720],[0,1])`, `mix("#8a8878", CRISIS, rougeK)`) — le pays entier (pas seulement les bandes du drapeau, le FILL du polygone aussi) devient `CRISIS`, cohérent avec le rouge qui descend vers le Mali au même moment (panel 4) : la couleur EST le vecteur du récit, la Libye "contamine" visuellement le Sahel par la continuité de la teinte rouge qui voyage d'un polygone à l'autre via le `FlowDots`.
5. **f879 (fin panel 5) → "Libye consommée"** : une fois le rouge Libye stabilisé, son `opacity` de fill redescend doucement à 0.35 (elle s'estompe en arrière-plan, jamais totalement effacée — elle reste visible, cicatrice permanente) pendant que le focus visuel (pulse, saturation) revient sur le bloc Sahel pour les panels 6-12. Pas de `dim` complet à 0 : la Libye doit rester lisible en fond jusqu'à la fin, rappel silencieux (cohérent avec la mention finale "la Libye... dans la vidéo longue" du CTA panel 12 — la carte doit encore montrer une Libye visible à ce moment-là, sinon la phrase du CTA n'a plus d'ancrage visuel).

**PAS de mouvement de caméra** : confirmé, tout le geste Libye est porté par `opacity`+`mix()` couleur+`fill`, zéro `translate`/`scale` caméra dédié à ce geste (seul le `pushIn` global continu, commun à toute la vidéo, s'applique).

**Faisabilité** : PROUVÉ dans le mécanisme (`mix()` déjà écrit dans `ProtoEffect_Fracture`, clipPath drapeau déjà écrit dans `LiptakoRevealSVG9x16`) — la SEULE nouveauté est de les combiner sur un polygone pays réel au lieu d'un écusson stylisé. Risque faible.

---

## 4. GESTE FRACTURE CEDEAO — GÉNÉRALISATION SVG PUR

Détaillé au Panel 8b ci-dessus. Résumé technique pour l'agent codeur :

1. `fracturePath()` : reprendre la fonction telle quelle (zigzag 9 segments + `random()` déterministe), recalculer `x0,y0,x1,y1` pour traverser le BBOX combiné des 3 polygones Sahel dans l'espace écran (pas juste le Sénégal).
2. **3 paires de `clipPath`** au lieu d'1 — une paire par pays (`mali-halfA/halfB`, `burkina-halfA/halfB`, `niger-halfA/halfB`), chacune construite avec le MÊME `FRACTURE_D` (une seule ligne de fracture traverse les 3 pays d'un coup — cohérence visuelle : c'est UNE fracture qui frappe les 3 à la fois, pas 3 fractures indépendantes).
3. **3 valeurs de `split` différentielles** : `splitMali = base*1.3`, `splitBurkina = base*0.9`, `splitNiger = base*0.85` (Mali s'écarte le plus — épicentre historique + narrativement le pays le plus ancien dans la crise).
4. Couleur : `crisisK` s'applique au fill de chaque pays en partant de SA couleur actuelle (rouge déjà partiellement présent depuis panel 4/6, PAS l'ocre neutre du proto original) vers `CRISIS_DARK` — continuité de teinte, pas un reset.
5. `recompose` : NE PAS aller jusqu'à 1 immédiatement (contrairement au proto Sénégal qui referme vite) — s'arrêter à `recompose=0.7` en fin de panel 8b, et ACHEVER la recomposition (0.7→1) au début du panel 9, synchronisée avec l'apparition du sceau AES au point de jonction. C'est le lien mécanique exact entre "la carte se déchire" et "l'AES naît de cette déchirure" — pas 2 effets juxtaposés mais 1 seul mouvement continu qui traverse 2 panels.

**Faisabilité** : PROUVÉ dans le principe à 95% (tout le mécanisme existe et fonctionne sur 1 pays) — le travail réel est l'ORCHESTRATION de 3 instances simultanées + le passage de relais vers le sceau AES, qui EST à prototyper (pas risqué, mais pas gratuit non plus — compter un vrai cycle de dev/preview avant validation).

---

## 5. PALETTE DE RECOLORAGE — Liptako/Resources → carte vivante

### LiptakoRevealSVG9x16 (fond `#EBE0C8`, hachures `#2C1E16`, or `#F1D58A`/`#CBA358`, sceau rouge cire `#8A170E`/`#C82A1D`/`#4A0A05`)

| Élément | Couleur actuelle | Couleur cible (palette carte) |
|---|---|---|
| Fond global | `#EBE0C8` | `#e4ddca` (PARCH — quasi identique, transition à 20f suffit, pas un vrai recolorage) |
| Hachures/traits fins | `#2C1E16` (brun-noir héraldique) | `#16213a` (NAVY — aligne sur le contour pays qu'on a tracé tout le long) |
| Traits gras contour cartouche | `#1A1008` | `#16213a` (NAVY) |
| Or cordages/écussons | `#8F6D35 → #F1D58A → #A37C3A` (dégradé or héraldique) | garder tel quel — l'or `#d8b25a` (GOLD carte) est déjà très proche, AUCUN changement nécessaire, c'est la seule famille de teinte qui traverse déjà les deux registres sans couture |
| Sceau cire rouge | `#C82A1D / #8A170E / #4A0A05` | `#b23a2e / #7d2118` (CRISIS / CRISIS_DARK — réutilise la palette rouge-crise déjà vue aux panels 4-8, cohérence : le sceau AES nait littéralement de la même teinte que la rupture qu'il referme) |
| Ruban/ornements | `#F4EBD5 / #E3D0A8 / #C5AD7C` | garder tel quel (déjà proche PARCH) |

### ResourcesRevealSVG9x16 (fond noir héraldique `#080808`/`#111111`, contours `#15120e`/`#25211d`)

| Élément | Couleur actuelle | Couleur cible |
|---|---|---|
| Fond bouclier (dégradés sombres) | `#080808 / #111111 / #1f1a16 / #3A2F25 / #4e463c` | remplacer toute la gamme noir-brun par une gamme `#16213a → #1a2947 → #223258` (NAVY et ses tons plus clairs) — le bouclier devient "carte de nuit" plutôt que "cuir héraldique noir" |
| Contours durs | `#15120e / #25211d` | `#0d1424` (NAVY_DEEP) |
| Or (veine Mali/Burkina) | `#A67C00 / #D1FFB8(?) / #f9de79 / #dcb970 / #c99f2e` | garder la famille or telle quelle (`GOLD #d8b25a` déjà quasi identique) — seule la veine EST recolorée en `OCRE #e7bd78` pour matcher le fill carte des panels 1-8 (cohérence : c'est le MÊME ocre qui a rempli les polygones Mali/Burkina tout du long) |
| Vert uranium | `#2B4C33 / #87C177 / #E8FFDA` | garder le vert (seule touche de couleur "hors palette carte" tolérée, car sémantiquement nécessaire pour distinguer uranium de pétrole/or — mais désaturer légèrement vers `#7a9b6e` pour rester dans un rendu parchemin plutôt que "néon nature") |
| Brun pétrole | `#8B6914` sombre + `#8A7A6C` flow dots | vers `#5a4a3a` (brun-navy plus sombre, cohérent avec la gamme nocturne du bouclier recoloré) |
| Cartouches noms pays (fond clair) | `#aedda4 / #ebd69f / #fdfaf3` | garder clair mais recadrer vers `#e4ddca` (PARCH) uniforme pour les 3 cartouches au lieu de 3 teintes différentes par ressource — unifie visuellement |

**Principe général du recolorage** : ne PAS recolorer l'or (déjà cohérent nativement dans les 2 inserts avec la carte) — concentrer l'effort sur les FONDS SOMBRES (héraldique noir/brun → navy carte) et les ROUGES (cire héraldique → CRISIS carte), qui sont les 2 vraies ruptures de registre à corriger. C'est un recolorage CIBLÉ, pas une reteinte totale — moins de risque de dénaturer une chorégraphie déjà validée.

---

## 6. FAISABILITÉ — RÉCAPITULATIF HONNÊTE

| Geste | Statut | Détail |
|---|---|---|
| Trace pays Sahel (panel 1) | **PROUVÉ** | Copie directe `ProtoCarto_ContinentDraw`, changement de featureCollection |
| Lien CEDEAO qui casse (panel 2) | **À PROTOTYPER** | Trait simple + cassure, principe proche de `ProtoEffect_Fracture` mais forme neuve |
| Décalage projection pour intégrer Libye (panel 3) | **À PROTOTYPER — RISQUE** | Le `fitExtent` unique Sahel+Libye peut rendre les pays Sahel visuellement petits en format vertical serré ; alternative de repli documentée si échec visuel |
| Flux Libye→Mali (`FlowDots`) | **PROUVÉ** | Code existant `ResourcesRevealSVG9x16`, copie directe |
| Masque radial rouge clippé sur path pays | **À PROTOTYPER** | Mécanisme simple (clipPath+cercle dégradé), pas encore ce montage exact dans le repo |
| Extension masques 3 pays (panel 6) | **À PROTOTYPER** | Extension linéaire du geste précédent |
| Anneau coup d'État (panel 7) | **PROUVÉ** | `strokeDashoffset` sur cercle, mécanique déjà utilisée partout |
| Cartouche CEDEAO qui vire rouge + flèche (panel 8a) | **PROUVÉ** (mix couleur) / **flèche = trivial SVG maison** | Ne PAS utiliser `SahelAttackArrow` — il dépend de `map.project()` Mapbox, **INCOMPATIBLE** avec d3-geo pur. Un simple `<path>` + `<polygon>` triangle suffit, aucune brique existante à réutiliser mais aucun risque non plus |
| Fracture généralisée 3 pays (panel 8b) | **PROUVÉ dans le principe, ORCHESTRATION à prototyper** | Le mécanisme de base marche (1 pays validé), la synchronisation de 3 instances + le relais vers le sceau AES demande un vrai cycle preview |
| Raccord fracture → sceau AES au point de jonction (panel 9) | **À PROTOTYPER** | Recalibrage de coordonnées (cordages sur centroïdes carte réels au lieu de positions fixes du composant) — mécaniquement pas complexe mais demande un test visuel pour caler les positions exactes |
| Recolorage Liptako/Resources | **PROUVÉ** | Simple substitution de valeurs hex, zéro nouvelle mécanique d'animation |
| Veines ressources raccordées aux centroïdes réels (panel 10) | **À PROTOTYPER** | Même nature que le raccord panel 9 |
| Count-up "60" (panel 11) | **PROUVÉ** | `spring()` standard, mécanique déjà vue (`SceneBilanV3`, simplifiée) |
| CTA (panel 12) | **PROUVÉ, ne pas toucher** | Composant existant intact |
| Asset drapeau Libye (`ly.png`) | **MANQUANT** | Aucun fichier trouvé dans `public/_shared/flags/` — mais NON BLOQUANT puisque le choix tranché (§2) est un APLAT couleur pour les polygones pays, pas une image. Un `ly.png` ne serait utile QUE si un médaillon Libye façon Liptako était ajouté — pas prévu dans ce storyboard. Si le réalisateur veut un médaillon Libye plus tard, signaler l'asset manquant à ce moment-là |
| Chiffre "+territoire" panel 6 | **À VÉRIFIER FACTUELLEMENT** | Ne pas confabuler un pourcentage — checker `FACTS-RESSOURCES-2026.md`/sources avant d'afficher un chiffre, sinon rester sur un symbole non-chiffré ("+territoire ▲") |
| Drapeau Libye pré/post-Kadhafi | **À VÉRIFIER FACTUELLEMENT** | Le geste "vire au gris puis rouge" suppose de partir du tricolore post-2011, pas du vert Kadhafi pré-2011 — à trancher avant code, cf §2 |

**Aucun geste n'est jugé irréalisable en SVG pur.** Le seul vrai risque technique identifié est le §3 (fitExtent Sahel+Libye combiné en format vertical) — solution de repli documentée. Le seul écart d'architecture à corriger EN AMONT du code est le remplacement de `SahelAttackArrow` (Mapbox-only) par un tracé maison pour la flèche-menace CEDEAO.

---

## 7. RYTHME SUR 92S DANS UN CADRE CONTINU

**Risque identifié** : un seul cadre pendant 92 secondes, même vivant, peut lasser l'œil si chaque panel se contente d'ajouter une couche sans jamais RENOUVELER l'échelle du regard. Le risque concret est la "carte-tapis" — on regarde le même rectangle parchemin pendant 1min30, aussi bien animé soit-il, et la texture de familiarité s'installe vers la 40e-50e seconde (creux classique d'un plan continu long).

**Comment je le romps (sans changer de décor)** :
1. **Variation d'échelle du sujet, pas de la caméra** : panels 1-2 = 3 petits pays qui s'affirment (échelle "territoire"). Panel 3-6 = le regard s'élargit à la région (Sahel+Libye, échelle "géopolitique"). Panel 7-8 = resserrement sur les 3 capitales (échelle "pouvoir", anneaux ponctuels). Panel 9-11 = re-largissement vers le symbole (sceau, bouclier, chiffre géant) — échelle "récit". C'est un mouvement respiratoire large→étroit→large qui n'est PAS un zoom caméra (interdit par le principe) mais une variation de ce que l'œil doit lire, portée par la composition des éléments eux-mêmes.
2. **Alternance de rythme temporel** : les panels courts et denses (3, 4, 7 : 3-4s, gestes physiques secs — shake, flash couleur) alternent avec les panels longs et posés (2, 5, 9, 10 : 6-8s, respirations lentes, cartouches qui s'installent). Sans cette alternance, 92s de "même tempo" serait le vrai risque de lassement — pas le décor fixe en soi.
3. **La fracture (panel 8b) comme pivot de rythme, pas seulement de sens** : elle arrive à 47-50s, quasi pile au milieu du Short — c'est le point où l'œil a le plus besoin d'un choc (creux naturel d'attention en milieu de format court). Le placement narratif du brief tombe donc, par chance ou par construction du script, exactement où le rythme en avait besoin — je le souligne pour confirmer qu'aucun ajustement de timing n'est nécessaire de mon côté.
4. **Densité d'ornement croissante** : la grille/texture/grain restent visuellement IDENTIQUES tout du long (aucune raison de les faire varier, ce serait un bruit inutile), mais la DENSITÉ D'INFORMATION à l'écran (cartouches, symboles, couleurs actives) croît globalement du panel 1 (quasi nu) au panel 11 (carte + bouclier + count-up + vestiges CEDEAO barrés) — le cadre "se remplit" au sens propre, ce qui donne une sensation de progression même si le cadre lui-même ne bouge pas. C'est la traduction concrète de la signature "parchemin qui s'écrit" du §0 : plus on avance, plus il y a de choses écrites dessus, jamais moins.
5. **Point de vigilance pour la review Aziz** : le panel 6 (territoire qui s'étend, 30.3-35.8s) et le panel 10 (ressources, 62-71s) sont les 2 candidats les plus probables à un sentiment de "ça traîne" si l'exécution reste trop sage — ce sont les 2 panels où je recommande le plus de laisser l'agent codeur pousser l'intensité du geste (pulse plus marqué, montée de saturation plus rapide) plutôt que de rester flat par prudence.

---

## 8. POINTS À TRANCHER AVANT CODE (liste courte, pas de sur-cadrage)

1. Drapeau Libye : tricolore post-2011 ou vert Kadhafi pré-2011 pour le geste "vire au gris puis rouge" (voir §2) — je recommande le tricolore.
2. Chiffre "+territoire" panel 6 : vérifier une source chiffrée existante avant d'afficher un %, sinon rester symbolique.
3. Cadrage vertical de la carte (ancrée tiers-bas, §0) : à valider visuellement en preview avant d'investir le reste du code dessus — c'est LA décision de composition qui conditionne tout le reste.
4. Risque fitExtent Sahel+Libye combiné (§3/§6) : accepter le risque de pays plus petits, ou activer d'entrée le plan de repli (médaillon séparé raccordé par trait) — à trancher tôt pour ne pas recoder après coup.

---

**Fichier écrit** : `/Users/clawdbot/Workspace/remotion/memory/episodes/warmap-sahel/STORYBOARD-AGENT-B.md`
