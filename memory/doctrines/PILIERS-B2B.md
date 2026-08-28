# LES 5 PILIERS B2B — quelle brique pour quelle demande client

> Posé le 2026-08-20 (constat d'Aziz, session shotcraft). **Voie B2B / freelance**, distincte de la
> voie YouTube. Ce fichier répond à UNE question : *« un client demande X — quel pilier ? »*
>
> ⭐⭐⭐ **DÉCISION D'AZIZ, 2026-08-24 — LA CHAÎNE EST UNE VITRINE, PAS UNE SOURCE DE REVENU.**
> Elle continue (Gazoduc), mais **la priorité d'EFFORT est le freelance**. Ce n'est pas un abandon :
> c'est un changement de ce qu'on demande à la chaîne — elle prouve les capacités, elle ne les
> monétise pas. Les trois mesures qui ont amené là : production ≠ rémunération sur YouTube
> (des chaînes à caméra fixe font 190 k vues sur nos sujets), Shorts 3015 vues vs longues 231 sur
> la même période, et le même actif payé 2 ordres de grandeur plus cher en direct qu'en plateforme.
> ⚠️ **Le freelance n'est pas prouvé non plus** (1 candidature, 0 revenu) — ce qui est décidé, c'est
> où va l'effort marginal, pas ce qui marchera.
>
> ⭐⭐ **FER DE LANCE retenu le 2026-08-24 : le pilier 2 (objets/scènes graphiques animés par code).**
> Les 4 autres restent servis, mais c'est celui qu'on met en avant — le plus mature, le plus
> transversal, et le seul testé en conditions client (chill-meter, Lottie LCD).
> ⛔ Ce n'est PAS un catalogue de composants (ça c'est `INTENTION-FORME-INDEX.md`), ni une doctrine
> de production. C'est un **aiguillage**.

## ⭐⭐⭐ COMMENT LE DIRE AU CLIENT (2026-08-28) — meme capacite, 2 formulations qui portent

⛔ **« Deterministe » est un mot d'INGENIEUR** : il decrit notre moat, il ne le VEND pas. Deux
reformulations, tirees de 5 videos freelance analysees (le reste du corpus etait du bruit) :

**1. « Pourquoi vous plutot qu'un PROMPT ? »** — la question a laquelle une offre doit repondre en
2026 n'est plus « pourquoi vous plutot qu'un autre freelance ». ⭐ Fait dur : **Shopify** a inscrit
dans son processus de recrutement qu'on verifie d'abord si une IA peut faire le travail **avant tout
recrutement humain, salarie OU freelance** (memo public, politique d'achat ecrite — pas une
prediction).

**2. « Ce qui SURVIT a votre depart. »** ⭐⭐ Le plus exploitable. Ce que les clients detestent, c'est
la dependance : si le prestataire part, tout s'ecroule. **On livre litteralement le contraire** — un
`.json` Lottie ou un composant React reste dans SA codebase : versionnable, modifiable, reexecutable
**sans nous**. Un MP4 sorti d'After Effects, non. Argument qu'on possede deja techniquement et qu'on
ne formulait pas.

**Corollaire — l'IA a devalue la PREUVE, pas le travail.** Fabriquer une facade credible (logos,
temoignages, portfolio) coute desormais zero. Donc la **verifiabilite** devient l'actif rare : un
rendu qui bouge reellement, heberge, verifiable, vaut parce qu'il est **couteux a falsifier** — pas
parce qu'il est joli.

⚠️ **Axe orthogonal releve, non tranche** : la reponse la plus courante a la commoditisation n'est pas
la superiorite technique mais **l'elargissement du perimetre** (prendre en charge l'amont et l'aval :
audit → production → integration → iterations mensuelles). Un SaaS change tous les mois, donc la
recurrence est defendable dans notre metier. **Hypothese a tester, pas un acquis.**

## Pourquoi ce fichier existe

Cinq capacités ont été construites séparément, pour la chaîne. Mises ensemble, elles couvrent la
majorité de ce qu'un client B2B peut demander — mais seulement si on sait **laquelle sortir**. Sans
aiguillage, on retombe sur le pilier qu'on a en tête (vécu : Flowdesk fait 100 % en SVG abstrait,
rejeté « illisible sans le son », alors que la demande appelait un écran).

## L'AIGUILLAGE

| Le client veut… | Pilier | Fiche à ouvrir |
|---|---|---|
| montrer **où** ça se passe, un territoire, une route, un flux entre pays | **1. CARTE** | `FICHE-CAMERA.md` · doctrines Mapbox/D3 |
| expliquer un **mécanisme**, une tension, un blocage, une idée sans forme physique | **2. SCÈNE SVG** | `FICHE-SVG-DESSINE.md` |
| montrer **son produit**, son app, son dashboard, un écran qui existe | **3. UI PRODUIT** | `FICHE-UI-PRODUIT.md` ⭐ |
| un **graphisme** : chiffre-choc, portrait, cartouche, lockup, liens animés, badges | **4. MOTION DESIGN REACT** ⭐ | `INTENTION-FORME-INDEX.md` · `COMPOSANTS-INDEX.md` |
| une **scène filmée**, un personnage, une matière organique | **5. VIDÉO GÉNÉRÉE** | `FICHE-CLIP-GENERE.md` |

### ⭐⭐ LE 2e AXE, AJOUTÉ LE 2026-08-24 — SOUS QUEL FORMAT IL REÇOIT

⛔ Ce tableau répondait à « que veut-il MONTRER ? » et jamais à « **comment veut-il le RECEVOIR ?** ».
Trou révélé par le test Lottie : un brief entièrement dans nos cordes (composant d'interface,
géométrie simple = pilier 2) restait illisible tant qu'on lisait « animation » comme « MP4 ».

| Il veut… | Format | Prouvé |
|---|---|---|
| une vidéo à publier / intégrer telle quelle | **MP4 / MOV** | partout |
| un habillage à poser sur SON montage | **MOV ProRes 4444 alpha** | chill-meter 2026-08-22 |
| un composant que SES développeurs intègrent et **contrôlent élément par élément** (app, site, firmware) | **`.json` / `.lottie`** | LCD 2026-08-24 |

**La chaîne Lottie** : image → **Fable mode MAX** (SVG structuré, ids imposés, zéro animation dedans)
→ script → `.json`. C'est « le modèle dessine le STATIQUE, nous animons » appliqué à une autre sortie.
Ce n'est **pas un 6e pilier** : la matière reste le pilier 2, c'est un **canal de livraison** de plus.
⭐ Il renforce le moat déterminisme : un `.json` Lottie est éditable au paramètre **par le client
lui-même**. ⭐ Verdicts (répondre à un brief) : `memory/client-sim-tests/lottie-ui-lcd/CE-QUI-PASSE-EN-LOTTIE.md`
· le récit : `.../STATUS.md`. MAJ 26/08 : chaîne prouvée en **ANIMATION**, et une **PIÈCE
LIVRABLE** existe (maison-gaz, 16 Ko `.lottie`, validée par Aziz dans Creator).

⭐ **Règle de tri devant un brief** : poser les 2 questions SÉPARÉMENT — « sait-on PRODUIRE ça ? »
et « sait-on le LIVRER dans SON format ? ». Un NON à la seconde n'est pas un NON au brief, c'est
un chantier de tuyauterie souvent court. ⛔ Le pire cas est un OUI à la production avec un NON
non identifié sur le format : on produit, puis on découvre qu'on ne peut pas livrer.

## LES 5 PILIERS EN DÉTAIL

### 1. CARTE — Mapbox + D3
Territoire réel, géographie exacte. **Engage une promesse d'EXACTITUDE** (géo zéro approximation) que
les 3 autres piliers n'engagent pas — c'est ce qui en fait un métier à part, et la raison pour laquelle
il mérite **son propre gig** plutôt que d'être noyé dans un service généraliste (décision Aziz 2026-08-19).
Rendu lourd (`render-mapbox.sh` obligatoire, WebGL headless). Mot-clé marché : *animated map*.

### 2. SCÈNE SVG — objet, métaphore, rapport de force
Notre socle historique : 9 registres visuels prouvés (blueprint, papier-découpé, néon/data-terminal,
gravure, braise…), stick-figures, inserts-bloc. Déterministe, révisable au paramètre.
⭐ Le geste le plus vendable et le moins concurrencé : **le rapport de force abstrait** (deux masses,
une tension, une ligne qui retient) — `BlocImpasseB6.tsx` en est la preuve produite.
⛔ Frontière dure : **objet vs organique vivant**. Pas de visages qui jouent, pas de mains articulées.

### 3. UI PRODUIT — capture + shotcraft ⭐ (nouveau, 2026-08-20)
Le pilier qui manquait, et le plus demandé en B2B : *« montrez mon logiciel »*.
Pipeline : page servie → capture Puppeteer (plaque 2x + découpes + **bbox réelles**) → `PageCam`.
**Prouvé agnostique du design** : même film en registre sombre ET en light mode SaaS, sans changer un
composant. Socle importé de video-shotcraft (Apache-2.0). Détail complet : `memory/fiches/FICHE-UI-PRODUIT.md`.

### 4. MOTION DESIGN REACT — Remotion pur ⭐ (le socle qu'on oublie de compter)
**Ajouté le 2026-08-20 sur constat d'Aziz** : « Remotion n'est pas juste pour coller nos vidéos
ensemble, c'est aussi pour créer des graphismes, du motion design. »
Le pilier le PLUS ancien, le plus utilisé, et le seul sans aucune dépendance externe — donc celui
qu'on oublie de compter, précisément parce qu'il est partout.

Briques vérifiées présentes : `PortraitDossier` · `PortraitEditorial` (imageUrl + stats + rubrique) ·
`PortraitGeometry` · `PortraitSilhouette` · `DiscFrame` (disque paramétrable qui accueille n'importe
quel contenu — **les « photos rondes » d'un plan carte+personnes**) · `NoeudTisserand` ·
`MilitaryMarchLine` · compteurs, cartouches, lockups.
Registre : chiffre-choc, portrait encadré, badges de certification, grille d'icônes, liens animés,
carte + avatars, générique de fin. C'est le pilier qui **RELIE** les autres et porte l'habillage commun.

⛔ **ERREUR À NE PAS REFAIRE (commise le 2026-08-20, dans cette même session)** : devant le plan
« carte du UK + photos rondes de personnes » de la vidéo Aikido, j'ai répondu « pilier carte + vidéo
générée » — en cherchant la solution dans l'outil NOUVEAU alors qu'un `PortraitEditorial`/`DiscFrame`
posé sur une carte D3 la donne, en déterministe et révisable au paramètre.
C'est le pattern [[feedback_registre-visuel-briques-existantes-non-consultees]].
**Réflexe : avant de router vers un pilier externe, vérifier si c'est un graphisme composable.**

### 5. VIDÉO GÉNÉRÉE — MiniMax H3 (+ Comfy)
Matière filmée, personnages, organique — tout ce que le SVG s'interdit.
⚠️ **Le seul pilier non déterministe.** On ne peut pas garantir une révision au paramètre près, donc
⛔ **ne pas le vendre comme un service autonome** : c'est un INGRÉDIENT dans un film porté par les
autres piliers. Un client peut obtenir de la génération ailleurs, moins cher.

## ⭐ CE QUI FAIT L'OFFRE — le moat est le DÉTERMINISME (piliers 1-2-3-4)

**Quatre piliers sur cinq** sont du code frame-driven, déterministe, révisable au paramètre. En langage client :
- **« vous voyez le mouvement réel avant que je finisse »** — pas un storyboard statique. L'aperçu
  animé EST le livrable, à l'habillage près.
- **« une correction est un ajustement, pas une reprise »** — je change une valeur, pas un rendu.
- **« si votre produit change dans six mois, on modifie, on ne recommence pas »**.

C'est ce que la génération d'image/vidéo ne peut pas promettre. C'est l'argument, pas la technique.

## COMMENT ON LES COMBINE

Un explainer B2B complet fait souvent **2 → 3** : le problème abstrait (pourquoi c'est cassé), puis
l'écran qui le résout. L'échec de Flowdesk vient d'avoir tenté tout le trajet en pilier 2.
Le pilier 1 reste **à part** (gig distinct). Le pilier 5 n'apparaît jamais seul.

### ⭐⭐⭐ Combiner 5 + 4 DANS UN MÊME PLAN — « est-ce que ça se lit ? » (prouvé 2026-08-20)

Les piliers ne s'enchaînent pas seulement plan par plan : **ils se superposent dans un plan**. Le
pilier 5 (clip H3) porte la couche du fond, le pilier 4 (Remotion) pose par-dessus tout ce qui doit
être EXACT. Critère de tri unique :
- **abstrait** (matière, corps qui souffle, objets qui s'empilent) → **5. H3**
- **précis** (texte, chiffres, dates, sous-titres, logo) → **4. Remotion** — ⛔ H3 ne sait pas écrire.

Mécanisme : demander à H3 de **laisser la zone vide** (`EMPTY WALL LOCK`), pas retirer après coup.
⛔ Et donner au personnage une **INTENTION**, jamais un ordre d'immobilité (un `STILLNESS LOCK` a fait
lâcher le clip à 6,5 s ; l'intention « il souffle » l'a stabilisé sur 9 s).
Recette complète, prompts et livrables : [[REVERSE-STYLE-VIDEO-VERS-ASSETS]] § EXTENSION 2026-08-20.
⭐ Ce geste est aussi **un service vendable en soi** : poser une couche exacte sur une vidéo existante
(sous-titres, chiffre-clé, cartouche) — y compris sur un clip fourni par le client.

## ⭐⭐⭐ LE GABARIT DE CHOIX — ce qu'on vend AVANT le projet (posé 2026-08-20)

> **L'acquis commercial le plus important de la session** (formulé par Aziz). Vaut pour 3 piliers.

**⛔ LA PROMESSE À NE PAS FAIRE** : « on peut changer de style en cours de projet ». C'est vrai
techniquement (seed constant → même animation réhabillée, corrélation 0,90+), et c'est précisément
pour ça qu'il ne faut PAS le vendre : annoncer qu'un changement de style est facile **fabrique** les
demandes de changement de style, en cours de production, plusieurs fois. On transforme une capacité
en promesse de révisions illimitées.

**✅ CE QU'ON VEND À LA PLACE** : la capacité se dépense **UNE fois, en AVANT-VENTE**.
On montre au client **2-3 registres × UNE scène de son projet, animée 5-10 s**. Il choisit.
Le choix ferme la question du style pour toute la production.

| Ce que ça produit | Pourquoi ça vaut plus qu'un portfolio |
|---|---|
| le client choisit sur **SA** scène | un portfolio le fait choisir le travail d'un AUTRE |
| il l'a vu **BOUGER** avant de payer | il ne peut plus dire « ce n'est pas ce que j'imaginais » |
| le désaccord de goût arrive **avant le code** | aujourd'hui il arrive après le rendu, quand il coûte cher |
| le style est **arrêté** à cette étape | protège la production au lieu de l'exposer |

C'est la logique de notre storyboard interne (« le modèle propose, on valide, PUIS on code »),
portée côté client — [[CONTINUITE-SCENE-INTENTION-DABORD]].

**Décliné par pilier** (chacun a SA variable, ne pas les confondre) :

| Pilier | Ce qu'on montre | La variable |
|---|---|---|
| **5. vidéo générée** | 1 scène animée × 3 registres (Sunjata · gravure sépia · poster vector) | le REGISTRE graphique |
| **2. scène SVG** | 1 scène × 2-3 traitements, animée | le registre de DESSIN. ⚠️ La signature du SVG reste le **mix and match** (composer des éléments hétérogènes) — argument distinct, ne pas mélanger |
| **3. UI produit** | le même film d'écran en plusieurs teintes | la PALETTE, pas le montage (agnosticité déjà prouvée : `NorthShieldPromoV4` sombre / `NorthShieldPromoLight` clair) |

**⛔ 3 GARDE-FOUS (chacun payé dans le test du 2026-08-20)** :
1. **Relire chaque planche à l'œil.** Sur 5 styles générés, 1 avait dérivé (fenêtre devenue tableau)
   et 1 prompt a fait PEINDRE le texte sur le mur. Générer coûte ~0 ; relire, non. Une planche fautive
   fait juger notre rigueur, pas notre style.
2. **3 registres, pas 5.** Deux des cinq se disputaient le même terrain (ligne claire vs flat vector).
   Trop de choix affaiblit chaque option et rend la décision plus difficile.
3. **Fermer le choix par écrit.** Une phrase dans l'offre : « le style est arrêté à cette étape ; la
   production s'y tient ». Sans elle, on a offert le choix ET gardé le risque.

📊 **Ce que le marché confirme (veille 2026-08-20)** : les démos personnalisées closent **2,8×** mieux
que les présentations génériques, et une candidature avec échantillon ciblé fait **+35 %** de réponses.
⛔ Mais un simple **lien de portfolio** dans une candidature FAIT BAISSER la réponse (8,22 % sans lien
vs 5,90 % avec) — un lien demande un effort, un aperçu n'en demande aucun. C'est toute la différence.
Chiffres, sources et le positionnement qui en découle (« vidéo DÉTERMINISTE avec de l'IA dedans », pas
« vidéo IA » qui est commoditisée à −13 %/contrat) : [[freelance-dataviz-fiverr-pro]] § VEILLE MARCHÉ.

> ⚠️⚠️ **MISE À JOUR 2026-08-27 — le positionnement ci-dessus est SUPERSÉDÉ.** En vigueur :
> **« rendre visible ce qui est compliqué — interfaces, données, mécanismes — et le livrer au format
> que le client utilise »**. Le créneau mesuré est `ui-animation` (969 services sur Fiverr contre
> 27 366 pour la démo produit générique).
> ⛔⛔ **Le « déterminisme » n'est PAS un positionnement acquis, c'est l'HYPOTHÈSE CENTRALE NON
> VALIDÉE** — aucun acheteur ne l'a jamais confirmée, et « Remotion » remonte **1 seul job Upwork,
> à 15 $**. Le code est un avantage de **COÛT INTERNE**, jamais un argument de vente.
> → Source unique : **`memory/projects/RECHERCHE-MARCHE-INDEX.md`** (8 verdicts, mots, prix,
> et ce qu'on ne sait pas).

⭐ **Bonus** : le triptyque est aussi la **démo d'entrée** qui manquait — un prospect comprend la
méthode en 10 s, sans explication. Plus court à produire que le cut vente 60-90 s en attente.
Recette technique + prompts + livrables : [[REVERSE-STYLE-VIDEO-VERS-ASSETS]] § EXTENSION 2026-08-20.

## ÉTAT COMMERCIAL (2026-08-20)

- Page de gig généraliste rédigée et validée : `memory/freelance-linkedin/GIG-PAGE-VALIDEE.md`
  ⚠️ **prix et délais non mesurés** sur une vraie commande de bout en bout.
- Décidé : **un seul gig d'abord** (piliers 2+3), la carto en second, jamais les deux mélangés.
- ⏭️ Manque : le **cut vente 60-90 s** (charte DA écrite le 2026-08-15, matière disponible).
- ✅ **La démo par geste EXISTE depuis le 2026-08-21** — galerie de 21 mouvements de caméra,
  consultable sur mobile : https://aziztraorebf-ctrl.github.io/remotion/ (source : `gallery/`,
  build = `gallery/build-gallery.py`, médias hors git sur la release `gallery-media`).
  ⭐ **Lecture des 7 favoris d'Aziz** (drift-blur, drift-continu, pull-back-globe-d3, pull-back-reveal,
  suivi-de-trace, tilt-pull-back, whip-pan-multistop) : 4 sur 7 sont des gestes de **recul ou de suivi**,
  2 des fonds calmes, 1 seul geste rapide. Préférence nette pour **le mouvement lent qui installe**,
  pas pour l'effet — à traiter comme une orientation de DA, pas comme une liste de composants.
- ⛔ **Le gabarit de choix se dépense sur un prospect QUALIFIÉ, jamais en tête de tunnel** (recherche
  démarchage 2026-08-21) : à ~10 réponses/100 messages, personnaliser en amont = ~100 clips sur mesure
  pour ~2 clients, ce qui détruit justement l'avantage du registre réutilisable à coût marginal nul.
  Détail : `.claude/projects/-Users-clawdbot-Workspace-remotion/memory/projects/freelance-dataviz-fiverr-pro.md` (auto-mémoire, PAS dans le repo).

## Liens
`memory/fiches/FICHE-UI-PRODUIT.md` (pilier 3, détail) · `memory/doctrines/SVG-SCENES-GENERATIVES.md`
(pilier 2) · `memory/doctrines/CHARTE-DA-FREELANCE.md` (la DA commune) ·
`memory/projects/SHOWCASE-CAPACITES.md` (le cut vente) · `memory/tools/minimax-h3-*.md` (pilier 5).

⭐⭐ **Le segment est MESURÉ (2026-08-26)** : sur les 4 vidéos du portfolio d'une vendeuse Fiverr Level 2 du registre SaaS explainer, **3 n'ont aucun personnage** et **3 n'ont pas de voix off** (musique seule, le récit porté par la TYPO). Le « ce pilier ne fait pas de personnages » n'est donc pas une faiblesse à assumer : c'est **la norme du segment**. Prix observés : **~10 $ CA la seconde livrée**. Détail et réserves : `.claude/projects/-Users-clawdbot-Workspace-remotion/memory/projects/freelance-dataviz-fiverr-pro.md` (auto-mémoire, PAS dans le repo) § BENCHMARK 4 VIDÉOS.
⭐ Le pilier 3 se marie au pilier 4 via un **mockup d'appareil 3D** (la capture devient la texture de l'écran). Ce n'est pas un 6e pilier. Socle + 4 pièges payés : `memory/fiches/FICHE-MOCKUP-3D.md`.

---

## ⛔ CE QU'ON NE VEND PAS : le logo animé à l'unité (décision d'Aziz, 2026-08-28)

Vendeur vu à **60 $** pour du logo animé multi-secondes en offre avancée. Marché de **volume**,
produit standardisé : on ne gagne pas sur le prix, et notre avantage réel (révision instantanée,
source déterministe) est **invisible avant l'achat**.

⭐ Ce qu'on a bâti n'est pas une offre de logos, c'est une **CHAÎNE** :
`image PNG du client → Recraft → SVG → notre convertisseur → Lottie → Remotion → MP4`
Pertes mesurées : image→vectoriel **0,1 %** · vectoriel→Lottie **0,01 %**. Sortie 12 à 53 Ko.
Elle sert les piliers où on est réellement différenciés (UI produit, motion design React, scène
SVG). **Le logo était le cas de test le plus simple pour l'éprouver, pas la cible.**

⭐ Nuance de marché à garder (observation d'Aziz, non mesurée) : **le client qui fait animer son
logo l'a déjà payé** — il a une identité, un budget, une entreprise qui tourne. Contexte d'achat
différent de celui qui cherche un logo à 15 $. Le logo animé reste une bonne **porte d'entrée
conversationnelle**, pas un gig à lister.

### Formulation retenue pour le « pas de 3D » (⛔ ne PAS l'écrire comme un manque)

> « Animations vectorielles livrées en Lottie ou MP4 — légères, modifiables, prêtes pour le web
> et les apps. Pas d'effets 3D lourds : si votre projet en demande, je vous le dirai avant de
> commencer plutôt qu'après. »

⚠️ Nuance exacte : on **sait** faire de la 3D (`ThreeCanvas`, plan 1 de la repro Foster). Ce qu'on
ne fait pas, c'est de la **3D en Lottie** — la frontière est le FORMAT, pas notre capacité.

### Règle commerciale réglée au passage

Un client peut fournir un **.mp4** en demandant un Lottie (cas réel, avis client Cravvy).
Convertir une vidéo en Lottie n'a que 2 voies : redessiner à la main, ou vectoriser
automatiquement (formes tremblantes, fichier énorme, illivrable).
⛔ **Refuser la conversion automatique, toujours. Mais proposer le redessin** — service légitime,
plus cher, et force prouvée chez nous.

→ Détail et mesures : `memory/client-sim-tests/repro-vendeur-lottie/` (sur `feat/repro-ui`)
