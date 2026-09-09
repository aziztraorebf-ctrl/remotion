# Recherche de catégorie Fiverr — quel mot-clé viser (08/09, en cours)

> Objectif d'Aziz : trouver un mot-clé/sous-catégorie ni mort ni saturé pour le gig Lottie/UI
> (`GIG-PAGE-VALIDEE.md`). Méthode : Firecrawl sur les pages de RÉSULTATS DE RECHERCHE Fiverr
> (`fiverr.com/search/gigs?query=...`), PAS les pages catégorie officielles (le dossier
> `RECHERCHE-MARCHE-INDEX.md` documente qu'une tentative sur une page catégorie a halluciné
> 10 faux avis). Outil confirmé : Firecrawl, PAS Playwright (correction d'Aziz, 08/09 — c'est
> Firecrawl qui a produit toute la recherche des 9 vendeurs du 05/09).

## ⛔⛔ FAIT DE MÉTHODE NOUVEAU — le compteur de résultats de RECHERCHE ment aussi

Le dossier existant documentait déjà que le compteur des pages CATÉGORIE est trompeur
(plafond d'affichage à 10 000). Mesuré ici en plus : **le compteur des pages de RECHERCHE PAR
MOT-CLÉ ment différemment** — Fiverr élargit silencieusement une requête sans résultat vers un
terme plus large, sans jamais dire "aucun résultat", et le `totalResults` reflète la requête
ÉLARGIE, pas celle tapée.

Preuve : `query=animated gauge` → `og:description: "Results for animated gauge"` + `totalResults:
100000`, mais **les 16 gigs retournés sont TOUS hors sujet** (vidéos lyriques, explainers 2D,
mascottes — zéro gauge/meter/jauge). Fiverr a élargi vers "animated" seul en coulisse.

**Conséquence pour la méthode** : ⛔ ne JAMAIS comparer les `totalResults` entre mots-clés comme
proxy de volume — ce nombre ne mesure pas ce qu'on croit. La seule mesure fiable est de LIRE
chaque gig retourné et juger sa pertinence réelle au mot-clé tapé (à la main ou par un 2e passage
LLM qui compare gig_title vs query).

## Mots-clés testés

| Mot-clé | Résultats pertinents | Vendeurs vus | Verdict |
|---|---|---|---|
| `lottie animation` | ~15/15 pertinents | Stanislav, Oleh, Christina, Kozka (déjà connus) + Shubham (726 avis!), Md Rakib, Mubeen Liaqat, Lottie Expert, Srikanto Biswas — **beaucoup plus de vendeurs actifs que les 9 du 05/09** | Bassin dense, déjà cartographié en partie |
| `svg animation` | ~7/8 pertinents | Quasi les mêmes vendeurs que `lottie animation` (Oleh, Kozka, Stanislav, Meer Azzum=Shubham) | **Même bassin, pas une catégorie distincte** — ne pas compter 2 fois |
| `animated gauge` | **0/16 pertinent** | Aucun vendeur du registre jauge/meter | Élargi silencieusement vers "animated" — confirme la note du 05/09 : "aucun résultat" sur ce terme précis, mais Fiverr ne le DIT pas, il triche la réponse |
| `progress bar animation` | ~3/30 pertinents (Mohsin, Luqman Rana, Zaeem Imran — peu/pas d'avis) | Très peu de vendeurs spécialisés vs 30 résultats bruités (Twitch, logos, CGI produit) | **Candidatà creuser** : soit peu de demande, soit peu de vendeurs s'y sont mis malgré la demande — À TRANCHER |

## Nouveau vendeur repéré, absent du dossier du 05/09

**Shubham** (nom affiché ; handle probable différent), Level 2, **726 avis**, note 5,0, entre à
20 $. Gig : "I will make lottie and svg animation for your website". Volume d'avis le plus élevé
mesuré à ce jour sur ce marché (devant Dmitry/heavymo à 626). À creuser : ce vendeur illustre-t-il
lui-même, ou refuse-t-il comme Christina/Dmitry ? Sa page profil donnerait le prix réellement payé
(fourchette dans les avis).

## Prochaines étapes (non faites)

1. Trancher `progress bar animation` : est-ce un vrai trou de marché ou une fausse piste ? →
   vérifier le profil des 3 vendeurs pertinents (avis réels, cadence de livraison).
2. Tester d'autres mots-clés proches du produit réel : `loading animation`, `data visualization
   animation`, `dashboard animation`, `counter animation`, `meter animation`, `stat animation`.
3. Élargir depuis les 9 vendeurs déjà mesurés (2e piste envisagée par Aziz, pas encore lancée) :
   scraper leurs pages profil pour lister tous les tags sous lesquels ILS sont indexés.
4. Fusionner ce fichier avec `RECHERCHE-MARCHE-INDEX.md` une fois la recherche stabilisée — ne
   pas laisser 2 dossiers de recherche marché vivre en parallèle (un seul existant à enrichir,
   règle du CLAUDE.md § améliorer l'existant avant de créer).

## Axe SECTEUR CLIENT (choisi par Aziz après le signal "progress bar")

Mohsin (progress bar) approfondi : gig 10/15/20 $, **réellement payé 50-100 $** — ratio x5-x10,
le PLUS EXTRÊME mesuré sur tout ce dossier (dépasse même Oleh, x6, du 05/09). Mais seulement
**12 avis en 10 mois** (membre fév. 2025), 0 commande en file, dernière livraison 3 semaines.
Verdict Aziz confirmé : demande réelle et bien payée, mais trop rare pour porter un
positionnement seul — un signal, pas une catégorie.

### `saas animation` → RÉCUSÉ, pas notre marché

100 % explainer video (jusqu'à 750 $) — exactement la catégorie déjà retirée de la page de gig
le 05/09 (28× plus encombrée). Confirme que le mot-clé secteur seul ramène vers le mauvais
produit si on ne combine pas avec un mot d'ANIMATION D'ÉTAT (pas de vidéo de présentation).

### `fintech app animation` → SIGNAL FORT, à creuser en priorité

Résultats mélangent 3 métiers (dev d'app complète 600-1000$, design UI/UX Figma 25-150$,
et l'ANIMATION pure qu'on vend) — preuve que ce mot-clé n'a PAS encore de catégorie dédiée
propre, contrairement à `saas animation` qui est déjà un marché mûr et saturé.

**Seulement 3 vendeurs qui font vraiment de l'animation d'interface fintech**, tous avec très
peu d'avis (3-7) :
- Casey (Level 1, 7 avis, 150$) — "fintech website fintech app fintech banking loan app"
- Prosperity F (pas de badge, 6 avis, 150$) — "fintech app animation fintech website..."
- Robert Silvey (pas de badge, 3 avis, 200$) — "fintech app animation, app demo videos, UI walkthroughs, landing page animations"

⭐⭐⭐ **Nouveau concurrent DIRECT découvert, absent du dossier du 05/09** : **Alan**, badge
**Fiverr's Choice**, 96 avis, note 4,9, **650 $** — "I will create interactive rive UI
animation and motion for your saas". Apparaît une 2e fois à 600$ sur une offre mascotte Rive.
C'est EXACTEMENT notre créneau (motion d'UI, pas explainer) mais dans le registre RIVE, pas
Lottie, et à un prix bien au-dessus de notre grille (650$ vs notre Premium à 250$). À
approfondir : son gig complet, ses avis (prix réellement payé), et si "Fiverr's Choice" est
un badge qui se mérite ou qui s'achète.

**Lecture** : combiner secteur + "animation" retourne un marché encore mixte (dev + design +
animation), donc PAS saturé sur l'animation pure — mais il faut un mot-clé qui isole mieux le
métier animation du métier développement/design, sinon on partage la page avec des devs à
1000$ qui n'ont rien à voir avec nous.

## Prochaine étape immédiate

Approfondir **Alan** (concurrent direct découvert) : son gig complet, ses prix réellement
payés, depuis quand il vend, s'il refuse une partie du travail comme Christina/Dmitry.

## Alan_art — approfondi, 10e vendeur mesuré, LE PLUS PROCHE de notre positionnement

⛔⛔ **Il est classé dans NOTRE MÊME catégorie Fiverr** ("Lottie & Web Animation",
`fiverrmeta:pagename` confirmé) — pas une catégorie Rive séparée. Un acheteur qui atterrit sur
notre futur gig peut voir le sien juste à côté.

| | Alan_art | Notre gig |
|---|---|---|
| Membre depuis | Sept. 2019 (6 ans) | — |
| Avis | 96, note 4,9 | 0 |
| Badge | Top Rated | — |
| Grille | 650 / 1200 / 2400 $ | 50 / 120 / 250 $ |
| Réellement payé | 400-600 $ (Basic/Standard), 1000-2500 $ (Premium) | — |
| **Écart affiché vs payé** | **FAIBLE** (x0,6-1,5) | — |
| Unité | Composant Rive interactif (state machine) | Élément Lottie |
| Positionnement affiché | "Premium Motion for Brands that Lead" — startups/SaaS/agences | Founders avec un produit qui a déjà un design |

**Ce qui explique l'écart de prix, ce n'est PAS le talent mais l'UNITÉ ET LA PROFONDEUR** :
son Basic à 650$ livre "1 interactive Rive component, full **state machine**" — pas juste une
animation qui joue, un composant qui RÉAGIT (hover, click, état). Son Premium à 2400$ inclut
"data binding" — l'animation se connecte à de vraies données. C'est un niveau d'ingénierie
au-dessus de notre "Lottie JSON silencieux qui joue" — le format Rive permet l'interactivité,
Lottie non (documenté dans notre propre FAQ : "The Lottie format cannot carry audio").

**Ce que ça dit de notre grille 50/120/250 $** : elle n'est PAS trop basse par rapport à Alan —
elle vend un LIVRABLE DIFFÉRENT (JSON qui joue en boucle vs composant Rive interactif avec
state machine). Les deux peuvent coexister dans la même catégorie sans se cannibaliser, à
condition que notre page ne prétende jamais à l'interactivité qu'on ne livre pas. ⚠️ Si on
veut un jour monter en gamme, la voie mesurée ici est le RIVE + state machine, pas juste
un prix plus élevé sur le même Lottie statique.

**Piste terminologique trouvée via sa recherche** : "**micro interactions**" — un terme
d'usage (pas un secteur, pas un format de fichier) qui pourrait être le bon axe. Page Fiverr
dédiée existe : `fiverr.com/gigs/micro-interactions` ("Design custom interactive rive
animations for saas, apps and landing pages" — la description même de cette page catégorie
cite Alan). À tester en recherche directe.

## `micro interactions` — LE MEILLEUR SIGNAL TROUVÉ À CE STADE

Retombe dans NOTRE catégorie exacte (`og:description`: "Lottie & Website Animation Services").
Terme d'USAGE (ni secteur, ni format de fichier) — exactement l'axe qu'Aziz demandait.

⭐⭐⭐ **Alan a DEUX gigs, pas un seul** — découverte qui change la lecture de son profil :
- Le Rive haut de gamme déjà mesuré (650-2400$, 96 avis, "Fiverr's Choice")
- **"I will animate lottie icons and UI micro interactions" — 540 avis, entrée à 180$**
  C'est SON gig Lottie abordable. Il tient donc 2 étages de gamme sur le même mot-clé — une
  architecture à explorer nous-mêmes une fois le premier gig prouvé (pas maintenant).

**Densité de nouveaux entrants, contrairement à `lottie animation` seul** : sur les ~15
résultats vraiment pertinents (animation d'UI/icônes/micro-interactions, pas les dashboards
Power BI ou cartes hors-sujet qui polluent le bas de la liste), plus de la MOITIÉ ont entre
1 et 22 avis avec des notes de 4,9-5 :
- Uzair A (Top Rated, 2 avis, 50$)
- arlojamesmayson (Top Rated, 2 avis, 35$) — "rive and lottie... state machine mascot"
- Angie Expert (Level 2, 12 avis, 50$) — "figma to interactive rive"
- Riyima (Level 2, 12 avis, 50$)
- Fivarous (Top Rated, 12 avis, 50$)
- Andrew V. (Level 1, **1 avis**, 300$) — "premium micro interactions and UI animations for digital products"

**Contraste avec `lottie animation` seul** (1er test) : ce mot-clé ramenait immédiatement
Stanislav (439), Oleh (412), Christina (222), Shubham (726) — des mastodontes établis, aucune
place visible pour un nouvel entrant en 1re page.

**Lecture** : "micro interactions" semble être le terme que les VENDEURS RÉCENTS utilisent pour
se positionner sur ce marché SANS entrer en collision frontale avec les mastodondes de "lottie
animation" — soit parce que c'est un terme plus recherché par un acheteur plus qualifié (qui
sait déjà ce qu'il veut : une interaction, pas juste "une animation"), soit parce que c'est un
terme assez récent pour que la concurrence ne s'y soit pas encore density. À TRANCHER par la
suite (vérifier date d'inscription des vendeurs à faible avis — récents ou juste peu actifs ?).

## Point d'étape (08/09, 6 mots-clés testés, 10 vendeurs profilés)

| Mot-clé | Verdict |
|---|---|
| `lottie animation` | Bassin dense déjà connu — pas un nouvel axe |
| `svg animation` | Même bassin que ci-dessus |
| `animated gauge` | N'existe pas comme catégorie cherchable |
| `progress bar animation` | Signal fort (x5-x10 payé) mais volume trop rare pour porter seul |
| `saas animation` | Mauvais marché (explainer video, déjà écarté 05/09) |
| `fintech app animation` | Signal : secteur + animation = marché encore mixte, pas mûr |
| ⭐⭐⭐ `micro interactions` | **MEILLEUR SIGNAL** — notre catégorie, densité de nouveaux entrants à notes parfaites, terme d'usage pas de secteur |

**Recommandation à ce stade** : `micro interactions` mérite d'être le titre/mot-clé principal
du gig plutôt que "Lottie JSON and SVG animations" seul — à combiner, pas à remplacer (les 2
mots comptent dans l'algorithme de recherche Fiverr, cf. doctrine du 05/09 : "9 vendeurs sur 9
portent lottie dans leur URL"). Reste à vérifier : les vendeurs à faible avis sur ce terme
sont-ils récents (opportunité fraîche) ou juste peu actifs (terme qui ne convertit pas) ?

## ⛔⛔ CORRECTION — arlojamesmayson : donnée FAUSSE écartée (piège du dossier déjà documenté)

Vérification demandée par Aziz ("récent ou juste peu actif ?") a révélé une extraction FAUSSE :
le 1er scrape de son gig donnait "188 avis" + "Member since Jul 2026" — incohérent en soi (188
avis sur un compte vieux d'~1 mois, sur un gig à 15-35$, est impossible même à cadence intense).

**Vérifié sur son profil complet (markdown, pas JSON structuré)** : arlojamesmayson n'est PAS un
vendeur Rive/Lottie. Sa vraie identité affichée : "3D and WebGL Developer — Spline, Framer and
Interactive Websites", Royaume-Uni. Le gig rive/lottie n'est qu'UN de ses 4 gigs très disparates
(les 3 autres sont des labs réseau Cisco/CCNA). Le "188 avis" était soit le total agrégé de tous
ses gigs mal attribué à celui-ci par l'extraction JSON, soit une hallucination pure.

⭐ **Exactement le piège déjà documenté dans `RECHERCHE-MARCHE-INDEX.md`** ("une extraction a
renvoyé la MÊME pièce jointe pour deux clients différents... résultat faux, écarté") — mais
version compteur d'avis plutôt que pièce jointe. Règle confirmée : **toute donnée numérique qui
semble incohérente (avis élevé + compte récent, prix qui ne colle pas) doit être revérifiée sur
le HTML/markdown brut avant d'être utilisée**, jamais prise telle quelle depuis un prompt JSON.

→ **arlojamesmayson RETIRÉ de la liste des vendeurs "micro interactions" à faible avis.** Les
autres (Uzair A, Angie Expert, Riyima, Fivarous, Andrew V.) n'ont pas encore été revérifiés sur
profil complet — À FAIRE avant de conclure quoi que ce soit sur "récent vs peu actif".

## ✅ Page tag `fiverr.com/gigs/micro-interactions` — 21 vendeurs, liste BRUTE (pas de compteur)

⭐ Ici la page "catégorie" est exploitée en sécurité : pas pour un COMPTEUR (piège documenté),
mais pour la LISTE des vendeurs qui s'y sont eux-mêmes tagués — chacun revérifiable
individuellement. Les données sont cohérentes entre elles (pas d'incohérence type
"188 avis / membre 1 mois" comme sur arlojamesmayson) donc CRÉDIBLES à ce stade.

| Vendeur | Handle réel | Avis | Prix | Registre |
|---|---|---|---|---|
| Alan | alan_art | **540** (5,0) | 180$ | Lottie + micro interactions — SON gig d'entrée, pas le Rive à 650$ |
| Uzair A | uzasigner | 2 (5,0) | 50$ | Lottie, Rive, GIF, SVG |
| Lukas Ok | lukaslima | (Top Rated) | 150$ | Framer, pas Lottie |
| ~~arlojamesmayson~~ | — | **DONNÉE FAUSSE, écarté** | — | 3D/WebGL dev, PAS Lottie |
| Creativestudio | muhammadadre995 | 1 (4,3) | 5$ | Lottie/GIF/SVG |
| Stephen | framerstudio_ | (Top Rated) | 40$ | Framer, pas Lottie |
| Motahar | motahar_hosen | (Top Rated) | 50$ | UI animation |
| Angie Expert | **angie_nation23** | 12 (5,0) | 50$ | Figma → Rive interactif |
| Riyima | riyimafumilow | 12 (5,0) | 50$ | Icônes/loaders Rive+Lottie |
| Fivarous | fivarous | 12 (Top Rated) | 50$ | Rive UI pour apps |
| Shamsher Baloch | shamsherkpk | 12 (Top Rated) | 15$ | Icônes Lottie |
| Ilyes B | workwithlyes | (Level 2) | 400$ | 3D site, pas Lottie pur |
| Armando S | armandosoma | (Level 2) | 30$ | Lottie |
| Andrew V. | agpvty | 1 (5,0) | 300$ | Micro interactions premium |
| Ruli Rahmandani | rulirahmandani | (Level 1) | 10$ | Lottie smooth |
| Jolinaynina | jolinaynina | — | 10$ | Icônes Lottie |
| RASHEED A | rasheed_3dd | — | 60$ | Spline/Rive, SaaS landing |

**Sur les vendeurs vraiment "Lottie/Rive UI animation" (en excluant Framer-only, 3D-only,
elearning)** : Alan seul dépasse 100 avis. TOUS les autres sont sous 12 avis, plusieurs à 1
ou 0. C'est le contraste le plus net mesuré dans toute cette recherche — confirme que
`micro interactions` est un terme jeune/peu disputé, avec UN SEUL acteur dominant (Alan) et
un océan de très petits entrants.

**Mots-clés Fiverr OFFICIELS liés, trouvés en bas de page (à tester)** : `ui-animation`,
`ux-animation`, `rive-animation`, `app-animation`, `web-animation` — ce sont les tags que
Fiverr propose lui-même comme proches, donc probablement déjà indexés/reconnus par son moteur
de recherche interne (contrairement à nos essais empiriques comme "fintech app animation").

## VERDICT PROVISOIRE (08/09, 7 mots-clés + 1 page tag, 12 vendeurs profilés dont 1 écarté)

**`micro interactions` + `ui animation`** ressort comme la meilleure combinaison trouvée :
catégorie vivante (Alan y vend 540 fois), mais un seul acteur établi et une dizaine de tout
petits entrants — exactement le "ni mort ni enterré" demandé par Aziz. À tester ensuite :
les 5 mots-clés OFFICIELS Fiverr listés ci-dessus, avant de figer une recommandation finale
pour le titre du gig.

## `icon animation` (piste d'Aziz, cohérente avec le gig d'Alan qui dit "lottie icons")

**24 résultats, quasi 100 % pertinents** (contraste net avec `animated gauge` ou
`fintech app animation`) — mais c'est un marché MÛR et SATURÉ, pas un trou :
- Waseem Ahmad : **660 avis**, 20$
- Devie : **639 avis**, 20$
- Abuzar : **438 avis**, 10$
- Rshoun : 188 avis, 15$
- Asim Ishaq : 187 avis, 15$
- Ezza : 182 avis, 20$
- Lottie Expert : 255 avis, 15$
- Soju UX : 244 avis, 30$

**Prix d'entrée écrasé vers le bas** : la majorité des gigs pertinents démarrent à 5-20$, pas
50$ comme sur `micro interactions`. C'est le profil INVERSE de ce qu'Aziz cherche : ni mort ni
enterré, mais ici clairement **enterré** — bassin dense de vendeurs à 100+ avis, prix tirés
vers le bas par la concurrence.

⭐ **Lecture utile malgré tout** : `icon animation` confirme que le mot "icon" DANS le titre
attire un public différent (et plus nombreux) que "micro interactions" — plus proche du
"fichier livré" (registre le moins cher mesuré le 05/09) que du "élément/composant" qu'on
vend. **Ne pas mettre "icon" en avant dans le titre du gig** : ça positionnerait vers ce
bassin saturé et bas de gamme plutôt que vers le créneau ouvert de `micro interactions`.

## VERDICT FINAL (08/09, 8 mots-clés + 1 page tag, 13 vendeurs profilés dont 1 écarté)

| Mot-clé | Densité | Prix dominant | Verdict |
|---|---|---|---|
| `lottie animation` / `svg animation` | Dense, mastodontes connus | 20-150$ | Bassin déjà cartographié |
| `animated gauge` | Vide (faux résultats) | — | N'existe pas |
| `progress bar animation` | Très rare | 10-20$ affiché / 50-100$ payé | Signal fort, volume trop faible |
| `saas animation` | Dense, mature | 70-750$ | Mauvais marché (explainer, déjà écarté) |
| `fintech app animation` | Mixte, pas mûr | 100-1000$ | 3 vrais animateurs seulement |
| `icon animation` | **DENSE, saturé** | **5-20$** | Enterré — à éviter comme axe de titre |
| ⭐⭐⭐ `micro interactions` | **1 acteur dominant, reste <12 avis** | 50-180$ | **MEILLEUR SIGNAL — ni mort ni enterré** |

**Recommandation qui se dégage** : titre/description du gig doivent porter "micro
interactions" et "UI animation" en avant, PAS "icon" en tête (ça tire vers le bassin saturé
5-20$). "Lottie" reste nécessaire pour l'indexation Fiverr (règle du 05/09 : 9 vendeurs sur 9
le portent), mais combiné à "micro interactions", pas à "icon".

Reste non testé si besoin d'aller plus loin : les 4 mots-clés officiels Fiverr encore non
essayés (`ui-animation`, `ux-animation`, `rive-animation`, `app-animation`).

## Les 4 mots-clés OFFICIELS Fiverr — testés

### `ui animation` → majoritairement HORS SUJET (saas explainer), mais 2 outliers premium
Marché dominant = explainer/demo video, PAS l'animation d'élément pur. Signal : 2 vendeurs à
très peu d'avis mais prix élevés — **Armin Beciragic** (12 avis, **2800$**, "sleek ui
animations") et **Modjo Studios** (8 avis, **1200$**, "animated UI explainer"). À vérifier si
outliers non représentatifs ou preuve qu'un positionnement UI pur porte des prix hauts sans
volume d'avis — non tranché, cohérence à confirmer sur leurs profils si besoin plus tard.

### `ux animation` → même profil, beaucoup de bruit (WordPress/Shopify/Webflow/Roblox)
**Alan réapparaît** (3e mot-clé), toujours à 650$. Signal net : **Shawlz S** (12 avis, 25$,
"UI UX animations in rive for saas and apps") et **Isaak** (91 avis, Fiverr's Choice, 125$).

### `rive animation` → 100% PERTINENT, notre catégorie confirmée par og:description
12 résultats, ZÉRO bruit. Densité moyenne (Elmerv 111, Folarin 173, Vlad M. 149 établis ;
Richard 2, Waqas 1, Marcus R 4 = entrants récents). **Alan réapparaît** (4e mot-clé).

### `app animation` → retombe dans le bassin DÉJÀ CONNU
Mêmes vendeurs que `lottie animation`/`svg animation` (Stanislav, Eugene A., Arigato,
Md. Rakib) — pas un axe distinct, juste un synonyme de recherche qui converge au même endroit.

## ⭐⭐⭐ FAIT LE PLUS MARQUANT DE TOUTE LA RECHERCHE : Alan domine 5 mots-clés sur 8

Alan_art (alan_art) apparaît en 1re page sur `lottie animation` (implicite via sa présence
dans le dossier du 05/09), `fintech app animation`, `micro interactions`, `ux animation`,
`rive animation` — **5 mots-clés distincts sur les 8 testés**, TOUJOURS en tête ou proche.
Aucun autre vendeur mesuré dans ce dossier n'approche cette couverture. C'est la preuve
la plus solide que "micro interactions" + "UI/UX animation" + "rive" forment un espace
sémantique COHÉRENT que le moteur de recherche Fiverr traite comme un seul marché — et
qu'Alan l'a occupé en écrivant un titre/tags qui couvrent délibérément tout cet espace.

**Conséquence directe pour notre gig** : le titre doit lui aussi couvrir plusieurs de ces
mots simultanément plutôt que d'en choisir un seul — c'est ce qu'Alan fait ("interactive
rive UI animation and motion for your saas" touche rive + ui + animation + saas d'un coup).

## TABLEAU FINAL — 12 mots-clés testés, 14 vendeurs profilés (1 écarté, donnée fausse)

| Mot-clé | Densité | Prix dominant | Verdict |
|---|---|---|---|
| `lottie animation` / `svg animation` / `app animation` | Dense, mêmes mastodontes | 20-150$ | Bassin déjà cartographié, 3 mots-clés = 1 seul marché |
| `animated gauge` | Vide (faux résultats) | — | N'existe pas |
| `progress bar animation` | Très rare | 10-20$ affiché / 50-100$ payé | Signal fort, volume trop faible |
| `saas animation` | Dense, mature | 70-750$ | Mauvais marché (explainer) |
| `fintech app animation` | Mixte, pas mûr | 100-1000$ | 3 vrais animateurs seulement |
| `icon animation` | Dense, saturé | 5-20$ | Enterré — à éviter en tête de titre |
| `ui animation` / `ux animation` | Bruité (explainer/no-code) | 2 outliers 1200-2800$ | Pas un axe fiable seul |
| ⭐⭐⭐ `micro interactions` | 1 acteur dominant, reste <12 avis | 50-180$ | **MEILLEUR SIGNAL confirmé** |
| `rive animation` | 100% pertinent, densité moyenne | 20-650$ | Notre catégorie exacte, sain |

## RECOMMANDATION FINALE POUR LE TITRE DU GIG

Combiner **"micro interactions"** + **"UI animation"** + **"Lottie"** dans le titre/tags —
suivre le modèle Alan qui couvre plusieurs mots-clés d'un coup plutôt qu'un seul terme isolé.
NE PAS mettre "icon" en tête (tire vers le bassin saturé bas de gamme). "Rive" à garder en
réserve pour une montée en gamme future (state machine/interactivité), pas pour le titre
actuel qui vend du Lottie silencieux.

Exemple de titre à tester (à valider avec Aziz avant modification du gig) :
"I will create Lottie UI animations and micro interactions for your app" — remplace
"and SVG animations" (trop générique, dilue le focus) par "and micro interactions" (le
terme qui a le meilleur ratio densité/opportunité mesuré).

---

## ⭐⭐⭐ DÉCOUVERTE MAJEURE (question d'Aziz) — le chill-meter vit dans UNE AUTRE catégorie

### Correction d'abord : le chill-meter n'est PAS un fichier Lottie ni Rive

⛔ J'avais dit "state machine" à propos du chill-meter dans la synthèse précédente — FAUX,
corrigé ici. Le mot `state` dans `ChillMeterOverlay.tsx` (`state: MeterState`) est juste le nom
de notre PROP React qui sélectionne quelle animation Remotion jouer (idle/fill25/fill75...).
Aucun rapport avec le format "state machine" de Rive (interactivité utilisateur : clic, survol).
Le chill-meter est du **Remotion pur**, livré en MOV/PNG alpha — ni un .json Lottie, ni un .riv
Rive. Vérifié dans le code ET dans le brief (`BRIEF-SVG-CHILL-METER.md`) : SVG statique animé
en interne, jamais de format de fichier interactif exporté au client.

### Le vrai mot qu'Abigail a utilisé : "OVERLAY"

Titre exact du contrat Upwork (vérifié via API, contract 44402562) : **"Custom Animated Max
Chill Factor Meter OVERLAY for YouTube Reaction Videos"**. Pas "Lottie", pas "widget" de son
côté — mais "overlay" est un mot D'USAGE (le fichier posé par-dessus une vidéo dans un
éditeur), exactement le type de terme qu'Aziz demandait de chercher.

### Testé : `animated overlay for youtube` → CATÉGORIE ENTIÈREMENT DIFFÉRENTE

`og:description`: **"Graphics for Streamers by Stream Graphics Designers"** — PAS "Lottie &
Website Animation". C'est une catégorie Fiverr séparée, orientée Twitch/YouTube/stream
branding (panels, logo animé, intro/outro), TRÈS établie :
- Besignerr : 1000 avis (plafond d'affichage), 10$
- Fares : 1000 avis, 10$
- Kong Vector : 594 avis, 235$
- Digituscreative : 150 avis, 20$

**Aucun de ces vendeurs ne mentionne un meter/gauge/tracker dans son titre** — le marché existe
pour le BRANDING de stream (logos, panels, overlays d'ambiance), pas pour des INSTRUMENTS
animés comme le chill-meter.

### Testé : `custom animated widget for streamer` → LE MOT EST "WIDGET"

Confirmation : ce marché utilise **"widget"**, pas "meter" ni "overlay" seul —
"chat widget", "goal event widget", "chat goal event animated widget". C'est la famille
conceptuelle du chill-meter (un indicateur dynamique affiché sur un stream) mais nommée
différemment par ses propres vendeurs :
- Kong Vector : 703 avis, 40$ — "chat widget and widget animation for streamers"
- G4streamer : 125 avis, 35$ / 100 avis, 60$ (2 gigs)
- Arek Design : 3 avis, 50$
- Kawai Kanjo : 8 avis, 25$ — "chat goal event animated widget"

⛔ Toujours ZÉRO mention de "meter"/"gauge"/"detector" explicite — même dans cette catégorie la
plus proche conceptuellement, le vocabulaire du marché ne nomme pas l'OBJET (un compteur), il
nomme sa FONCTION dans le stream ("chat widget", "goal event" = objectif de dons/abonnés).

## CE QUE ÇA CHANGE POUR NOTRE STRATÉGIE

⭐⭐⭐ **Il existe DEUX marchés Fiverr distincts pour deux types de clients différents** :
1. **"Lottie & Website Animation"** (celui qu'on cartographie depuis le début) — clients
   FONDATEURS DE PRODUIT qui veulent animer un élément d'interface (app, SaaS, site web).
   C'est le marché de Christina, Alan, Oleh — et celui qu'on vise avec le gig actuel.
2. **"Stream Graphics" / "widget"** (découvert maintenant) — clients STREAMERS/YOUTUBERS qui
   veulent un habillage visuel pour leur chaîne (overlays, widgets, chat, alertes). C'est le
   marché où vit RÉELLEMENT Abigail — un chill-meter est un widget/overlay de stream, pas un
   élément d'interface produit.

**Abigail n'est PAS le persona du gig Lottie/UI qu'on construit.** Elle est venue par Upwork,
pas par ce segment Fiverr — mais si on veut vendre CE type d'objet (compteurs/trackers/jauges
pour streamers) en volume, le bon marché Fiverr à cibler est "widget"/"stream overlay", PAS
"micro interactions"/"Lottie & Website Animation". Ce sont deux gigs différents, deux pages
différentes, deux vocabulaires différents — à ne pas mélanger dans un seul gig.

⚠️ **Non testé encore** : la densité réelle de "widget" pour des OBJETS COMME LE CHILL-METER
spécifiquement (pas juste chat/goal widgets génériques) — personne dans les résultats vus
jusqu'ici ne vend un "meter"/"gauge"/"tracker" nommé comme tel pour du stream. Soit ce
sous-créneau n'existe pas encore sous ce nom (opportunité), soit il se cache sous un autre mot
qu'on n'a pas encore trouvé (à chercher : "stream tracker", "twitch meter", "donation goal
meter", "hype meter").

---

## PARTIE 2 (08/09, suite) — le marché streamer/widget, creusé

### Explication de fond posée par Aziz — pourquoi "live" change tout

Question : pourquoi les acheteurs de Rive demandent du "live" plutôt que du Lottie ? Vérifié
(pas deviné) : la différence est structurelle, pas une question d'outil.
- **Lottie/Remotion (notre offre actuelle)** : le mouvement est ÉCRIT À L'AVANCE, frame par
  frame, dans le fichier — le lecteur ne fait que rejouer une bande enregistrée, comme une
  vidéo. Aucune connaissance de ce qui se passe autour de lui (pas de clic, pas de données).
  Peut être fabriqué entièrement chez nous, en batch, sans interaction du client final.
- **Rive (.riv)** : le fichier contient une MACHINE (états + règles de transition), pas un
  mouvement enregistré. Le mouvement n'existe qu'au moment où l'utilisateur RÉEL interagit
  (clic, donnée qui change) — calculé en direct dans SON navigateur. D'où "live".
- **Conséquence sur l'outil** : le MCP Rive officiel (`rive.app/docs/editor/ai/mcp`) n'est PAS
  headless/scriptable comme nos pipelines Remotion. Il pilote l'ÉDITEUR DESKTOP en direct
  (Mac/Windows, Early Access) : ouvrir un fichier, prompter, attendre, taper "End Prompt" pour
  valider. Construire une state machine reste un travail dans l'éditeur (graphe de logique),
  pas un script qu'on lance. Le runtime JS existe pour CONSOMMER un .riv déjà fait (int  égrer
  dans un site = code normal), mais pas pour le CONSTRUIRE par API.
- **Pourquoi les acheteurs le veulent** : un composant branché sur la réalité du produit
  (loader qui dure tant que le vrai chargement dure, pas un minutage fixe) plutôt qu'une
  décoration qui tourne en boucle sans rapport avec l'état réel de l'app.

→ Mis en réserve pour une montée en gamme future (crédite le plafond 650-2400$ d'Alan), pas
une action immédiate — nécessite d'apprendre un vrai métier (logique d'états/transitions),
pas juste un nouvel outil.

### Le marché streamer, approfondi

`twitch alert widget` → confirme un marché MASSIF et mûr, mot central = **"alert"** (pas
"meter") : Doni Rachman (1000 avis), Lior (864), Kong Vector (1000), Shameel (327),
Sakib (477). Les "widgets" ici sont surtout des NOTIFICATIONS ponctuelles (nouveau follower,
don reçu), pas des instruments qui persistent à l'écran comme un meter.

`donation goal meter` → **VRAI zéro résultat** cette fois (message honnête "we couldn't find",
pas d'élargissement silencieux comme `animated gauge`). Le mot "meter" ne fonctionne toujours
pas sur ce marché.

⭐⭐⭐ `donation goal widget` → **SIGNAL LE PLUS FORT DE TOUTE LA RECHERCHE (partie 2)**

**Shapla Khatun** (shapla360) apparaît 4 fois dans les résultats avec des gigs portant
explicitement "**goal widget**" :
- "I will design and code goal widget with any character" — 30$, 2 avis, **payé réellement
  50-200$** (ratio jusqu'à x6-7, parmi les plus extrêmes de tout ce dossier)
- "I will create and code custom stream chat widget alerts goal widget" — 65$, 5 avis
- "I will design and code custom stream chat, event widget, goal widget" — 165$, 2 avis (3,5★)

Membre depuis **août 2022** (3+ ans d'ancienneté) mais quasi aucun avis sur ces gigs précis —
un signal de sous-exploitation, pas d'incohérence (vérifié : catégorie "Graphics for
Streamers" confirmée dans la description du gig, cohérent avec le reste).

**C'est EXACTEMENT le concept du chill-meter** (une jauge qui se remplit vers un objectif),
sous le nom "**goal widget**" — et quasiment personne d'autre ne s'y positionne explicitement
sous ce nom. Piste la plus proche mesurée à ce jour d'un "meter" nommé comme tel côté stream.

## VERDICT PARTIE 2

Le marché streamer confirme le même motif que le marché Lottie/UI : le mot qui NOMME l'objet
("meter", "gauge") ne fonctionne jamais, mais le mot qui nomme sa FONCTION ("goal widget",
"chat widget", "alert") ouvre une vraie case, et "goal widget" spécifiquement a un profil de
quasi-monopole non défendu (une seule vendeuse, très peu active sur ce gig précis, ratio
payé/affiché extrême).

**Reste à trancher avant toute décision** : est-ce un marché sain à faible activité, ou un
marché qui n'a jamais vraiment décollé (personne d'autre ne s'y met, peut-être parce que la
demande réelle est trop rare) ? Comparer avec `progress bar animation`/Mohsin (même profil
mesuré côté Lottie/UI) — les deux marchés ont produit le même type de signal : ratio extrême,
volume quasi nul. Ça pourrait être un pattern général plutôt qu'une vraie opportunité propre
à chaque cas — à vérifier par un 3e exemple avant de conclure que c'est un signal fiable.

---

## PARTIE 3 (08/09) — 2 questions d'Aziz, 2 corrections

### Un test Rive réussi débloquerait-il de nouvelles offres ?

Non, et ce n'est pas une nouvelle question — déjà tranché le 05/09 dans
`memory/tools/rive-et-polymation.md`. Le mur est structurel : on sait déjà LIRE un `.riv` dans
Remotion (`@remotion/rive` marche en headless, vérifié), mais Polymation ne convertit jamais
SVG → Rive (seulement Rive/Spline/Lottie entre eux). Nos SVG à centaines de calques nommés ne
peuvent pas y entrer. Tester le MCP Rive Desktop débloquerait la capacité de CONSTRUIRE un
composant à la main dans l'éditeur (un vrai métier, un graphe d'états/transitions à dessiner) —
pas une extension de notre pipeline existant. Le MCP automatise des tâches répétitives DANS ce
métier, il ne le remplace pas.

### Le vendeur à 5$ trouvé par Aziz (fiverr.com/s/61bBVgb) — hypothèse "nouveau profil" infirmée

Vérifié : **Haseeb (haseebakhtar581), membre depuis DÉCEMBRE 2021** — près de 4 ans
d'ancienneté, 36 avis au total, PAS un profil construit en moins d'un mois. Les avis qui
semblaient récents (1 semaine, 5 jours) sont ses derniers avis, pas la date de création du
compte.

Grille affichée 5/10/15$ ("Rookie/Growth/Pro Streamer Package") mais réellement payé **50-100$**
sur ses 5 derniers avis — ratio x10-20, l'un des plus extrêmes du dossier. Catégorie confirmée :
"Graphics for Streamers" (branding complet : overlay, panels, alertes, bannière — pas un objet
technique isolé comme un meter). Un avis mentionne un usage d'IA "more like a TOOL than a
generator" — probablement Recraft/Gemini + retouche, pas dessin pur.

**Conclusion** : pas une preuve qu'un compte neuf perce vite sur ce marché — une preuve de plus
que le prix affiché ne veut jamais rien dire tant qu'on n'a pas lu les avis. Cohérent avec
Mohsin et Shapla (partie 2) : ce marché entier semble fonctionner sur des prix d'appel très bas
et des commandes réelles bien plus chères, indépendamment de l'ancienneté du vendeur.

### Clarification : Haseeb a 2 gigs distincts, pas un seul mélangé

Ce qui semblait "mélangé" à Aziz (panels, bannières, écrans plein-cadre type vidéo) vient de
**2 gigs séparés** dans la même catégorie, pas d'un seul gig confus :
1. "streaming overlays and streamer graphics" (36 avis) — STATIQUE (bannières, panels, écrans
   offline/about-me).
2. "animated twitch overlays screens alerts and panels" (20 avis) — les "entre-écrans" vus par
   Aziz (Starting Soon / Be Right Back / Stream Ended, style cyberpunk/néon en boucle) + un
   intro vidéo au portfolio.

Profil : "Graphic Designer with 5 years of experience" (About me) — généraliste Photoshop/
réseaux sociaux/posters, PAS un spécialiste technique. 56 avis au total (44★★★★★/8/1/0/3),
rythme réel et soutenu sur 4 ans, pas fabriqué.

### DÉCISION AZIZ (08/09) : abandonner la piste "gig bas prix pour bâtir des avis vite" via ce modèle

Le rythme d'Haseeb vient d'un métier DIFFÉRENT du nôtre (design graphique généraliste :
Photoshop, montage vidéo léger) où notre chaîne technique (SVG à calques, Lottie, Remotion)
n'apporte AUCUN avantage — n'importe quel designer généraliste rivalise à égalité. Copier ce
modèle nous ferait concourir sur un terrain qu'on ne maîtrise pas mieux que la concurrence.

⭐ Le principe (bas prix, rotation rapide, pour construire des avis avant de viser plus haut)
n'est pas rejeté en soi — seulement CE modèle précis. S'il revient, chercher un équivalent qui
EXPLOITE notre outillage réel (ex: un loader Lottie simple, une icône animée) plutôt qu'un
objet hors de notre métier. Non fait à ce stade — piste fermée, pas explorée plus loin.
