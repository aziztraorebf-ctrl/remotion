# Demande réelle sur les plateformes Lottie — mesures du 2026-08-30

Mission : établir ce que les gens CHERCHENT et TÉLÉCHARGENT, et où est le manque, pour décider
quelles pièces GRATUITES produire (crédibilité + trafic, pas revenu).

> ⛔ Règle appliquée dans tout ce document : chaque chiffre porte sa source. Ce qui n'a pas pu être
> mesuré est écrit **NON MESURÉ**, jamais comblé par du plausible.

---

## 1. Ce qui est accessible, et ce qui ne l'est pas

| Cible | Méthode | Résultat |
|---|---|---|
| `lottiefiles.com/free-animations/*` | WebFetch | **HTTP 403** |
| `lottiefiles.com/popular-free-animations` | WebFetch | **HTTP 403** |
| `lottiefiles.com/sitemap.xml` | curl | **HTTP 403** |
| `iconscout.com/lotties/*` | WebFetch + curl | **HTTP 403** |
| `iconscout.com/lottie-animation/<id>` (fiche unitaire) | WebFetch | **HTTP 403** |
| `iconscout.com/api/v3/*` | curl | **Cloudflare challenge** ("Just a moment...") |
| `api.iconscout.com/v3/search` | curl | **HTTP 500** — `{"message":"Client-ID is missing."}` (clé API requise) |
| `reddit.com/search.json`, `old.reddit.com` | curl | **HTTP 403** (renvoie du HTML, pas du JSON) |
| `api.pullpush.io` (archive Reddit) | curl | **HTTP 429** persistant, sur ~6 tentatives espacées |
| `html.duckduckgo.com` | WebFetch | **CAPTCHA** |
| `hn.algolia.com/api/v1` (Hacker News) | curl | ✅ **200 — seule source conversationnelle exploitable** |
| Titres de pages indexés par le moteur de recherche | WebSearch | ✅ **exploitable** (voir §2) |

Aucun contournement anti-bot n'a été tenté (consigne respectée).

### ⛔ Conséquence directe sur le point n°1 de la mission

**Les compteurs de téléchargements par pièce sont NON MESURÉS, et je n'ai trouvé aucune voie
publique pour les obtenir.** C'est le trou principal de ce rapport, et il faut le dire net :

- Les fiches unitaires sont en 403, donc leur compteur (s'il existe) est inaccessible.
- Les **snippets de recherche ne contiennent jamais de compteur** de téléchargement/vue par pièce —
  j'ai fait 4 requêtes ciblées là-dessus, aucune n'a fait remonter un nombre de downloads.
- L'hypothèse de départ de la mission (« les plateformes affichent des compteurs publics ») **ne
  s'est pas vérifiée** pour LottieFiles et IconScout : ce qui est public et indexé, c'est le **volume
  de l'OFFRE** par thème, pas la demande par pièce.
- ⚠️ Je n'ai PAS pu confirmer que ces compteurs existent seulement — ne pas conclure « ils n'existent
  pas », conclure « non accessibles par cette voie ».

**Ce que j'ai pu mesurer à la place** : le volume d'offre par thème, chiffré et sourcé, qui répond
directement à la question de la saturation (§2) et, par contraste, à celle du manque (§4). C'est un
proxy de la demande, pas la demande. Je le signale explicitement plutôt que de le maquiller.

---

## 2. La découverte méthodologique qui a débloqué le rapport

IconScout **écrit le nombre de résultats dans le `<title>` de ses pages de catégorie**, et ces titres
sont indexés. Format : `« 9,020 Load Lottie Animations - Free in JSON, LOTTIE, GIF - IconScout »`.

Donc, même avec les pages en 403, **le volume d'offre par thème est mesurable** via les titres
indexés. Tous les chiffres du §3 et du §4 viennent de là — ce sont les chiffres affichés par
IconScout lui-même, relevés le 2026-08-30.

---

## 3. Où est la SATURATION (les sujets à ÉVITER) — chiffré

Volume d'offre IconScout par thème, décroissant :

| Thème | Pièces | URL |
|---|---:|---|
| Website error 404 | **99 445** | https://iconscout.com/lottie-animations/website-error-404 |
| Chart | **46 524** | https://iconscout.com/lotties/chart |
| Analytics | **30 889** | https://iconscout.com/lotties/analytics |
| Interactive | **31 224** | https://iconscout.com/lotties/interactive |
| Event | **27 904** | https://iconscout.com/lotties/event |
| Success checkmark | **25 110** | https://iconscout.com/lottie-animations/success-checkmark |
| Animation (générique) | **24 700** | https://iconscout.com/lotties/animation |
| Statistics | **23 297** | https://iconscout.com/lottie-animations/statistics |
| Icon | **18 736** | https://iconscout.com/lotties/icon |
| Login | **15 050** | https://iconscout.com/lotties/login |
| Analytics dashboard | **11 291** | https://iconscout.com/lotties/analytics-dashboard |
| Dashboard data visualization | **11 108** | https://iconscout.com/lottie-animations/dashboard-data-visualization |
| Loading error | **10 645** | https://iconscout.com/lotties/loading-error |
| Load | **9 020** | https://iconscout.com/lotties/load |
| Upload | **6 077** | https://iconscout.com/lotties/upload |
| Error message | **2 703** | https://iconscout.com/lotties/error-message |
| Virtual tour | **2 393** | https://iconscout.com/lotties/virtual-tour |

Volumes de catalogue global :
- IconScout : **1,3 M+ animations Lottie** — https://iconscout.com/lottie-animations
- IconScout tous assets : **14,4 M+** — https://iconscout.com/
- LottieFiles : **800 000+ animations gratuites et premium** (source : snippet indexé de
  https://lottiefiles.com/)

**⛔ Verdict saturation.** La contrainte d'Aziz (« ne pas concurrencer 5 000 icônes identiques ») est
non seulement fondée, elle est **très en dessous de la réalité** : le 404 seul, c'est ~99 000 pièces,
et le checkmark de succès ~25 000. Loader, checkmark, 404, icône de dashboard, login, upload,
graphique : **tout ce bloc est mort pour une stratégie de visibilité.** Cela recoupe et confirme le
verdict interne « le Lottie simple est commoditisé ».

⚠️ Réserve honnête sur ces chiffres : ce sont des comptes de **recherche par mot-clé**, pas des
catégories propres. Ils se recoupent (« analytics » et « chart » partagent des pièces) et ils sont
gonflés par du bruit sémantique. Ils mesurent bien un ordre de grandeur de l'encombrement, pas un
inventaire strict.

---

## 4. ⭐ Où est le MANQUE — chiffré, par contraste

Même méthode, mêmes pages, même jour. Les termes qui décrivent un **moment produit** au lieu d'un
**état d'interface** :

| Thème | Pièces | URL |
|---|---:|---|
| **New feature** (annonce de fonctionnalité) | **9** | https://iconscout.com/lotties/new-feature |
| **Changelog** | **1** (packs) | https://iconscout.com/lotties/changelog?product_type=pack |
| **API interface** | **24** | https://iconscout.com/lotties/api-interface |
| **Sync cloud** | **184** | https://iconscout.com/lotties/sync-cloud |
| **Integration** | **298** | https://iconscout.com/lotties/integration |
| **Optimize** | **579** (packs) | https://iconscout.com/lotties/optimize?product_type=pack |
| **Human design** | **717** | https://iconscout.com/lotties/human-design |

### L'indice qui fait dire « manque »

**Le rapport d'écart est de 1 à 11 000.** « Login » (un état d'interface isolé) = 15 050 pièces.
« New feature » (un moment du produit) = **9 pièces**. « Changelog » = **1**.

Ce n'est pas un écart marginal, c'est un ordre de grandeur qui change de nature. Et il tombe très
exactement sur ce que la mission décrit comme notre force : **les flux d'interface complets, les
séquences de plusieurs secondes, les moments produit** — par opposition aux icônes isolées.

**Lecture du signal, avec sa limite.** Une catégorie vide peut vouloir dire deux choses : personne
n'en veut, ou personne n'en fournit. Je ne peux pas trancher avec les compteurs de téléchargement
(inaccessibles, §1). Ce qui fait pencher vers « manque d'offre » plutôt que « absence de demande » :

1. Ces termes correspondent à des moments qui existent dans **tout** SaaS (on annonce des features,
   on migre des données, on connecte des intégrations) — la demande fonctionnelle est structurelle.
2. Le vocabulaire de l'offre existante est **technique** (« load », « icon », « animation »), pas
   **produit** (« new feature », « changelog »). C'est le même phénomène que celui déjà observé chez
   nous sur Dribbble (nommer par l'emplacement produit vaut 5-10x nommer par la technique) — voir §7.
3. ⚠️ Mais ces trois points sont un **raisonnement**, pas une mesure. À traiter comme une hypothèse
   forte à tester par publication, pas comme un fait établi.

**Vérification du phénomène « nommage produit vs nommage technique » sur les plateformes d'assets** :
partiellement confirmé, dans un sens inattendu. Sur IconScout, le nommage produit n'est pas
*mieux valorisé* — il est **quasi absent du catalogue**. Le déficit d'offre EST le signal.

---

## 5. Format / durée / poids

| Donnée | Valeur | Source |
|---|---|---|
| dotLottie vs Lottie JSON brut | **jusqu'à −80 %** de taille | https://lottiefiles.com/blog/working-with-lottie-animations/optimize-lottie-files-for-faster-page-load-speeds |
| dotLottie, usage courant | **~60 % d'espace en moins** | idem |
| Cas réel documenté | **1,3 Mo → 58 Ko** après conversion dotLottie | idem |
| Optimiseur LottieFiles | **~20 %** de gain moyen | https://lottiefiles.com/advanced-optimizer |
| Lottie vs GIF | **~600 % plus petit** en moyenne | idem source LottieFiles |
| Runtime `lottie-web` | **65,5 Ko gzip** de baseline (mesure d'un dev, 2021) | https://news.ycombinator.com/item?id=28623270 |
| dotLottie player (2024) | **326 Ko** sur le réseau en brotli, cible < 200 Ko | https://news.ycombinator.com/item?id=39936116 |

**⛔ NON MESURÉ** : la durée typique, le poids réel et le style visuel dominant **des pièces les plus
téléchargées**. Impossible sans accès aux fiches ni aux classements (§1). Ne pas inventer ce point.

**Repère interne déjà mesuré, à réutiliser** (hors de cette mission, non re-vérifié ici) : le corpus
de référence des 22 pièces d'un studio pro donne 3,9 s / carré / 60 fps — cf.
`corpus-kamotion/CORPUS-REFERENCE-UI.md`.

---

## 6. Ce que disent les développeurs — verbatims

Seule source conversationnelle accessible : Hacker News (Reddit bloqué sur toutes les voies testées).
**Ce sont des verbatims de développeurs sur Lottie en général, pas sur ce qu'ils cherchent à
télécharger.** Ils répondent au point 5 de la mission, pas au point 3.

Le thème dominant, et de loin, est le **coût** de Lottie, pas le manque de pièces :

> « I've personally pushed against the use of Lottie in projects I've worked on due to the **file
> sizes being very difficult to justify** for the kinds of animations that our designers wanted to
> use it for. » — andrewingram, 2025-05-25 — https://news.ycombinator.com/item?id=44089029

> « I've found that the **baseline filesize (65.5kb gzipped) for Lottie makes it somewhat unsuited
> for "website" animations**, though perhaps more suitable for apps. In the past, when I've vetoed
> Lottie on this basis, designers have achieved decent results using SVGator instead. » — andrewingram,
> 2021-09-22 — https://news.ycombinator.com/item?id=28623270

> « One thing I ran into as well was that **horrid after effects → Lottie workflow**. Many layers and
> styles also just don't work when you export them, so you have to **explain to motion designers
> which features they're allowed to use and which they aren't**, which a lot of time they're not
> thrilled about. In many cases just rendering a video and binding playback to interaction is much
> more lightweight. » — chrisldgk, 2025-05-25 — https://news.ycombinator.com/item?id=44088911

> « Lottie for me is sadness. I love the idea […] but the implementation of it is very disappointing.
> The format is probably one of the worst choices they could do for a use case like this — it's JSON,
> for something that is usually a bunch of numbers. » — panstromek, 2025-05-25 —
> https://news.ycombinator.com/item?id=44088844

> « On paper, Lottie seems like the perfect bridge between designers and devs, but **once you start
> poking under the hood, the trade-offs pile up fast** » — interludead, 2025-05-26 —
> https://news.ycombinator.com/item?id=44094938

> « My current customer has a designer, who claimed that we used Lottie Script for animations all
> over the site […] The animation was rotating an svg, and changing opacity on some svg children.
> **It could all be done in pure html/svg and css, but we almost ended up bloating our, already huge
> bundle** with all this Lottie stuff. » — spyke112, 2022-10-10 — https://news.ycombinator.com/item?id=33150697

Contre-exemple (usage en production assumé, à ne pas cacher) :

> « We've been using Lottie for years now for certain **PBS KIDS** brand animations and it has
> multiple benefits over other formats. […] Lottie implements into all our pipelines and workflows
> nicely; game, app, video. » — nye2k, 2025-05-25 — https://news.ycombinator.com/item?id=44091391

**Volume de discussion** : 32 996 hits sur « lottie » dans l'index HN
(https://hn.algolia.com/api/v1/search?query=lottie), mais les fils les plus votés portent sur
**l'outil et le format** (Airbnb 643 pts, format ouvert 350 pts, Rive comme alternative), **jamais sur
la recherche d'une pièce précise**. Aucun verbatim du type « je cherche une animation qui… » trouvé.

⭐ **Lecture actionnable** : le point de douleur exprimé par les devs n'est pas « je ne trouve pas la
bonne animation », c'est **« le fichier est trop lourd et le workflow After Effects est infernal »**.
Une pièce gratuite qui affiche **son poids optimisé** et **ne vient pas d'un export AE** parle
directement à ce grief. Notre chaîne (déterministe, sans AE) est exactement ça — c'est un angle de
communication, pas seulement un angle de production.

---

## 7. Contexte de distribution (utile pour l'arbitrage)

- LottieFiles gratuit : **10 téléchargements publics/mois**, **5 fichiers privés**, mais **uploads
  publics illimités**. Source :
  https://help.lottiefiles.com/hc/en-us/articles/16240626895385-File-Upload-and-Download-Limits-on-Free-Workspace
  → **Publier est illimité et gratuit ; c'est télécharger qui est rationné.** Le coût d'entrée d'une
  stratégie de publication est nul côté plateforme.
- Le rationnement à 10/mois a un effet second : un utilisateur gratuit **choisit** ses 10
  téléchargements. Il ne « ramasse » pas — il arbitre. Cela favorise mécaniquement les pièces
  perçues comme rares/difficiles à refaire soi-même, et défavorise le loader qu'on peut coder en CSS.
  ⚠️ Raisonnement, **non mesuré**.
- Rappel licence, déjà établi en interne : Lottie Simple License = virale, OK portfolio, ⛔ jamais un
  livrable client (`memory/tools/banques-lottie-et-greffe.md`).

---

## 8. Recommandations — 3 pièces à produire, chacune adossée à une donnée

Principe commun : **nommer par le moment produit, pas par la technique**, et viser les zones où
l'offre est à 2 chiffres au lieu de 5.

### Reco 1 — « New Feature Announcement » (séquence 3-5 s)
Le modal/toast qui annonce une nouveauté dans un SaaS : badge qui apparaît, panneau qui se déplie,
CTA qui pulse.
- **Donnée** : `new-feature` = **9 pièces** sur IconScout
  (https://iconscout.com/lotties/new-feature) contre **15 050** pour `login`
  (https://iconscout.com/lotties/login). Rapport ≈ **1 : 1 670**.
- **Pourquoi nous** : c'est une séquence multi-états, pas une icône — exactement notre force déclarée.

### Reco 2 — « Integration Connected » (deux systèmes qui se relient)
Deux cartes de service qui se rapprochent, le lien qui s'établit, l'état qui passe à « connecté ».
- **Donnée** : `integration` = **298** (https://iconscout.com/lotties/integration),
  `api-interface` = **24** (https://iconscout.com/lotties/api-interface),
  `sync-cloud` = **184** (https://iconscout.com/lotties/sync-cloud) — à comparer aux **9 020** de
  `load` (https://iconscout.com/lotties/load).
- **Pourquoi nous** : moment structurel de tout SaaS (chaque produit a une page « Integrations »),
  et zone d'offre à 2-3 chiffres.

### Reco 3 — « Onboarding Flow » (séquence multi-écrans, 6-8 s)
Un vrai enchaînement : écran 1 → 2 → 3, avec la progression qui avance. Pas trois icônes séparées.
- **Donnée** : aucune catégorie « onboarding flow » n'est ressortie des titres indexés IconScout
  malgré une requête dédiée — l'offre indexée se limite à des pièces unitaires. À l'opposé,
  `interactive` = **31 224** (https://iconscout.com/lotties/interactive) : le marché est saturé en
  éléments isolés, pas en enchaînements.
- ⚠️ **Réserve à assumer** : ici l'indice est une **absence de résultat**, plus faible qu'un compteur
  bas explicite (§4). C'est la reco la moins solidement sourcée des trois — la garder, mais la
  produire après les deux premières.

### Ce que je ne recommande PAS, et pourquoi
Loader, spinner, checkmark de succès, 404, icône de dashboard, login, upload. **Chiffré** :
99 445 / 46 524 / 25 110 / 15 050 / 9 020 pièces (§3). Publier là-dedans, c'est très exactement le
mur qu'Aziz a décrit.

### Angle de communication transverse (gratuit, à appliquer aux 3)
Afficher le **poids dotLottie** et le fait que la pièce **n'est pas un export After Effects**.
Adossé aux verbatims du §6 : le grief n°1 des devs est le poids et le workflow AE, pas le manque de
choix.

---

## 9. Ce qu'il reste à établir (honnêtement)

1. ⛔ **Les compteurs de téléchargement réels** — le point n°1 de la mission, non résolu. Voies non
   testées ici : compte IconScout avec **Client-ID d'API officiel** (l'API a répondu proprement
   « Client-ID is missing », donc elle existe et est documentée) ; consultation manuelle par Aziz
   depuis un navigateur ordinaire (les pages sont accessibles à un humain, seul l'accès automatisé
   est bloqué).
2. **Reddit** — bloqué sur toutes les voies testées ce jour. Un compte Reddit + API officielle
   lèverait le blocage.
3. **Durée / poids / style des pièces les plus téléchargées** — dépend entièrement du point 1.
4. **Test réel** : les 3 recos reposent sur un déficit d'OFFRE, pas sur une demande mesurée. Le seul
   moyen honnête de trancher est de publier 2-3 pièces et de regarder leurs compteurs — la
   publication est gratuite et illimitée (§7), donc le coût du test est le temps de production seul.
