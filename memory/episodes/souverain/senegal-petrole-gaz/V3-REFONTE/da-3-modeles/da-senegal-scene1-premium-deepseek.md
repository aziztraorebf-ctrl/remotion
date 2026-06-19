Voici une analyse détaillée, actionnable et sans complaisance, organisée selon vos instructions. Chaque piste est concrète et compatible avec votre stack (Remotion, Mapbox, templates de votre catalogue, SVG animé, Lucide).

---

## A — INTENTIONS & GESTES VISUELS PAR MOMENT

| Moment | Intention narrative profonde | Geste visuel premium |
|---|---|---|
| **0–32s — LES 2 RÉCITS** | Pas "expliquer", mais **DÉCONSTRUIRE** : montrer que ces 2 discours sont des prisons mentales. Le spectateur doit sentir l’étouffement, puis le soulagement quand on les écarte. | **Duel graphique abstrait qui s’autodétruit.** Continuité avec le hook scène 0 (parchemin, trait qui se dessine). Deux formes organiques (une noire type "pétrole qui suce", une dorée type "forteresse") se construisent en parallèle, se heurtent, puis EXPLOSENT/SE DÉCHIRENT pour révéler la carte Mapbox. La voix dit "AILLEURS" → boom, la carte apparaît. |
| **32s–50s — SANGOMAR** | **PREUVE DE SOUVERAINETÉ.** "Le Sénégal a pris sa part". Montrer que le pays existe concrètement dans ce game. Fierté nationale, acteur identifié (Woodside, Petrosen). | **Le Sénégal se REMPLIT.** D’abord son drapeau (MapboxFlagFill), puis un point offshore se connecte à Dakar par un trait laser qui se dessine (FiberOptic). Un cartouche premium (GlassmorphismGeoPopup) ancré affiche "Woodside (AU) + Petrosen 18%". Le point n’est pas un dot : c’est une mini plateforme pétrolière SVG qui pulse. |
| **50s–70s — GTA** | **INTERDÉPENDANCE GÉOPOLITIQUE.** "Frontière partagée, export mondial". Montrer que ce n’est pas un projet sénégalais, c’est un projet régional connecté au monde. | **FRONTIÈRE qui s’allume** entre Sénégal/Mauritanie via FiberOpticBorderDraw. Le gaz est un FLUX (GeoFlowConnection stylisé) qui part du point offshore, se divise en deux branches : Europe (icône drapeau UE + gel bleu) et Asie (icône drapeau asiatique + gel rouge). Icône "gaz russe barré" (Lucide `X` sur une flamme) remplacée. |
| **70s–85s — YAKAAR-TERANGA** | **MYSTÈRE & TENSION.** "Objet de désir, personne n’a décidé". Créer un OPEN LOOP puissant. Le spectateur doit se demander "MAIS QUOI ?!" et rester pour la suite. | **HALO qui RESPIRE.** Le gisement est un point entouré d’un halo pulsatile PulsingRegionFill version offshore. Plusieurs "regards" : des silhouettes d’yeux (Lucide `Eye` en or low opacity) apparaissent autour du point — depuis Dakar, depuis l’Europe, depuis l’Asie. Aucun texte, juste des regards. Le point clignote comme un signal. |
| **85s–100s — 60%** | **RELATIVISER, ENNUYER POUR MIEUX SURPRENDRE (?).** Le chiffre n’est pas le climax. "Ni scandale ni jackpot". L’intention : frustrer la conclusion simple, préparer le pont vers la scène suivante ("ce qui décide vraiment"). | **Partition visuelle du gâteau.** Un cercle (le revenu total) se divise en portions qui se détachent : part État (bleu Sénégal), part opérateur (gris), coûts (hachuré). La part État se stabilise à ~60%. Puis un ZOOM dans ce camembert révèle une nouvelle carte (la suite). Transition MapCutaway mode "reveal". |

---

## B — COMBATTRE LE GRIS ET MEUBLER LA CARTE (avec intention)

**Règle d’or : chaque ajout visuel répond à une question du spectateur.**

| Ce que le spectateur se demande | Réponse visuelle | Template / Stack |
|---|---|---|
| "C’est où, précisément ?" | Le Sénégal est **rempli** (drapeau ou texture ressource), pas juste un contour. Les pays de destination des exports (UE, Asie) sont colorés. | **MapboxFlagFill** pour le Sénégal. **SequentialFlagReveal** pour les pays d’export (UE en bleu nuit, Asie en rouge sombre). |
| "C’est quoi les enjeux maritimes ?" | La ZEE (Zone Économique Exclusive) du Sénégal est tracée en **ligne dorée pointillée fine** (pas un bloc opaque). | SVG `path` avec `stroke-dasharray` animé (style FiberOpticBorderDraw mais sur la ZEE). |
| "Qui regarde / qui est impliqué ?" | Silhouettes de pays voisins (Mauritanie, Gambie, Guinée-Bissau) en **basse opacité**, pas en gris, avec leur drapeau en aplat discret pour "meubler" le hors-champ stratégique. | **FlagFillStatic** avec mainIso=Sénégal, secondaryCountries configurés pour les voisins. |
| "C’est offshore, c’est comment ?" | La mer n’est pas vide : bathymétrie subtile (courbes de niveau marines en bleu très sombre) qui suggère la profondeur, ancre les gisements dans un espace. | Mapbox style custom avec couche bathymétrique (si disponible) ou overlay SVG de courbes de niveau générées (votre motor `svgGen`). |

**À éviter absolument :** les icônes de bateau génériques, les grilles HUD sans sens, les points qui flottent sans rattachement à la terre.

---

## C — DIFFÉRENCIER LES 3 GISEMENTS (3 histoires, 3 gestes)

| Gisement | Histoire | Signature visuelle unique |
|---|---|---|
| **SANGOMAR** | **Pétrole NATIONAL. Fierté.** | **FORME : Plateforme pétrolière SVG stylisée** (rectangle sur pilotis, torchère minuscule). **COULEUR : Or chaud** (fierté nationale). **ANIMATION : Construction** (les pilotis se plantent, la plateforme se pose). **CONNEXION :** Trait laser ancré à Dakar. **POPUP :** Woodside + Petrosen 18%. |
| **GTA** | **Gaz PARTAGÉ. Export.** | **FORME : Nœud de flux** (point central d’où partent 2 arcs épais vers UE et Asie). **COULEUR : Bleu électrique** (gaz, énergie propre). **ANIMATION : Tissage** (les flux se tissent comme des câbles sous-marins). **POPUP :** BP (UK). Stats d’export. Icône "gaz russe remplacé". |
| **YAKAAR-TERANGA** | **Mystère EN ATTENTE.** | **FORME : Halo pulsatile + regards** (pas de structure construite, un signal). **COULEUR : Blanc/or pulsatile** (signal, alerte, potentiel). **ANIMATION : Respiration** (opacité sinusoidale). **POPUP : AUCUN.** Juste le nom "Yakaar-Teranga" en serif discret + les yeux. |

---

## D — IDÉE PREMIUM POUR LE 60% (cinétique, spatial, politique)

**Concept : "Le Partage Cinétique"**

1. **Déclencheur** : La voix dit "environ 60% des revenus". Un faisceau lumineux (SweepRevealTerritory style) balaye l’écran, effaçant temporairement la carte.
2. **Apparition** : Un **flux monétaire abstrait** — un tube strié or/noir (comme un billet de banque torsadé) — traverse l’écran de gauche à droite.
3. **Séparation** : Le tube se divise en 3 flux qui se stabilisent :
   - **Flux large** (~60%) qui va vers une silhouette remplie du drapeau sénégalais.
   - **Flux moyen** (~30%) qui part vers l’Europe et l’Asie (opérateurs BP, Woodside).
   - **Flux fin** (~10%) qui se perd en pointillés (coûts techniques, maintenance).
4. **Révélation** : Chaque flux se transforme en cercle de camembert, le camembert se reconstitue, puis un **zoom dans le centre** du camembert révèle la scène suivante (MapCutaway mode "reveal").
5. **Texte** : "60%" apparaît en KineticMaskSlam sur le flux principal, mais ce n’est pas le climax : un sous-texte "moyenne des économies émergentes" dégonfle immédiatement le chiffre.

---

## E — AMATEUR/STATIQUE vs PREMIUM/VIVANT

| Ce qui crie AMATEUR | Ce qui fait PREMIUM |
|---|---|
| **Transitions en cut sec.** On passe de l’intro Remotion à la carte Mapbox d’un coup. | **Transition TENUE.** Le duel abstrait s’écarte, une déchirure au milieu révèle la carte en dessous (mask animé). |
| **Points qui flottent sans ancrage.** Les dots "gisements" driftent quand la caméra bouge. | **Ancrage Mapbox project.** Les coordonnées des gisements sont `map.project([lon, lat])` chaque frame. Les éléments SVG sont positionnés en `position: absolute` avec `left/top` calculés. Testé avec `easeInOutCubic` pour éviter le "décrochage". |
| **3x la même animation.** "Point + plaque" pour Sangomar, GTA, Yakaar. | **Variation narrative.** Chaque gisement a sa propre chorégraphie (construction / tissage / respiration). |
| **Carte grise sans vie.** Contour Sénégal + mer vide. | **Sénégal rempli drapeau, mer avec bathymétrie, pays voisins contextuels.** Chaque élément justifié (cf. section B). |
| **Plaques de texte en police sans-serif basique** qui flottent sans rattachement aux points. | **GlassmorphismGeoPopup** : navy translucide + bordure dorée + ligne fine ancrée au point. Typo serif pour les noms, mono pour les sources. |
| **Chiffre 60% en gros jaune sur fond noir.** Aucune mise en scène. | **Partage cinétique** (section D), le chiffre est un flux, pas un solide bloqué. |
| **Easing linéaire.** Les trucs apparaissent d’un coup en opacity 0→1, ou glissent en linéaire. | **Easing spring custom.** Tout ce qui pop utilise `spring({ damping: 12, stiffness: 180 })`. Tout ce qui glisse utilise `easeInOutCubic`. |
| **Typographie redondante.** "SANGOMAR" écrit ENORME sur la carte ET dans la plaque ET dans la voix. | **Hiérarchie.** Voix = narration, carte = localisation, plaque = data. Pas de doublon. Le nom du gisement est sur la carte en petit, la plaque donne Woodside/Petrosen. |

---

## SECTION OBLIGATOIRE — TEST AI-SLOP

Ce que le premier jet (décrit) CRIE comme "généré sans oeil pro" :

| Problème | Piste de correction NOTRE STACK |
|---|---|
| **Couleurs saturées par défaut.** Le jaune "60%" pue le `#FFFF00` ou un gold CSS sans nuance. Aucune charte perceptible. | Utiliser la charte "Kora & Cartes" : **Navy profond `#0B1A2E`** pour les fonds, **Or `#C6A45E`** pour les accents, **Blanc `#F4F0E6`** pour le texte. Le 60% ne doit pas être jaune mais **or métallique texturé** (dégradé SVG `linearGradient` avec 3 stops). |
| **Typo sans hiérarchie.** Une seule police partout, tailles aléatoires. | 3 niveaux typographiques : (1) **Serif display** (Playfair Display ou Cormorant) pour les grands titres/gisements ; (2) **Sans-serif medium** (Inter) pour les stats ; (3) **Mono** (JetBrains Mono) pour les sources. Cohérence avec votre Scène 0. |
| **Éléments sans fonction.** La carte grise n’apporte aucune information, elle "décore". C’est le péché AI-slope ultime : mettre une carte parce que c’est un template carte. | Si la carte est là, elle DOIT montrer quelque chose : drapeau, ressource, frontière. Sinon, rester en Remotion pur (intro 32s). La transition carte s’opère uniquement quand un LIEU est nommé. |
| **Surcharge de données dans les plaques.** "Woodside Australie, Petrosen Sénégal 18%, Sangomar, offshore Dakar, 2024..." en bloc. | Un seul chiffre/acteur par plaque. Format : `Acteur principal` en grand, `Part locale` en plus petit, `Source` en mono. Ex : "WOODSIDE (AU)" / "Petrosen : 18%" / "Woodside Report, 2024". |
| **Opacity 0→1 partout.** Robotique, mort. | Utiliser `spring()` pour les apparitions, `stroke-dashoffset` pour les tracés, `scale(0.8→1)` avec easing custom pour les popups. Proscrire les bêtes `opacity` seules. |
| **Icônes PNG/blurry.** Le premier jet a probablement des icônes bateau/pétrole pixelisées ou trop complexes. | **Icônes Lucide-react.** `Ship`, `Anchor`, `Droplets` (pétrole), `Flame` (gaz), `Eye` (Yakaar). Animées en SVG natif (scale, rotate, spring sur le path). Pas d’assets externes pour les icônes simples. |
| **Pas de space négatif.** Tout est serré, les plaques touchent les bords, la carte est zoomée au max. | Laisser respirer. La carte doit avoir une marge de 10% autour de la zone d’intérêt. Les plaques GlassmorphismGeoPopup ont un padding généreux. Le 60% est au centre d’un écran sombre, pas collé à un bord. |
| **Caméra qui drift sans raison.** Le bug "driftment" des dots suggère que la caméra bouge en continu même quand rien ne le justifie. | La caméra bouge UNIQUEMENT pour suivre un tracé (GeoFlowConnection) ou recadrer un nouvel élément. Sinon, elle est fixe. Quand elle bouge, c’est un mouvement intentionnel avec ease-in-out, pas un lerp permanent. |

---

**Résumé exécutif pour le monteur/codeur :**

1. **Intro :** Remotion pur, duel abstrait qui se déchire → carte.
2. **Sangomar :** Drapeau Sénégal → plateforme pétrolière construite → popup ancré Woodside/Petrosen.
3. **GTA :** Frontière laser Sénégal-Mauritanie → flux gaz vers UE+Asie → popup BP.
4. **Yakaar :** Point pulsatile + yeux → aucun texte → tension.
5. **60% :** Flux qui se divise → camembert → zoom transition.
6. **Partout :** Carte non grise (drapeau, ZEE, voisins), easing spring, icônes Lucide, charte Navy/Or/Blanc, hiérarchie typo.