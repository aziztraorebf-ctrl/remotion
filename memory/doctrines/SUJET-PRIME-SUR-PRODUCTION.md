# DOCTRINE ÉDITORIALE N°1 — LE SUJET PRIME SUR LA PRODUCTION (NON-NÉGOCIABLE, TOUS FORMATS)

> Gravé 2026-06-16 (Aziz). Règle TRANSVERSALE : War-Map, Atlas, Souverain, Short, Carrousel, vertical OU
> horizontal, tout format présent ou futur. Dérivée de la confession LeChefOtaku (1M abonnés, 15 ans) +
> analyses Caspian / Sahel Chronicles / Bellona. S'applique AVANT toute production (script, code, render).

## LA RÈGLE
**Le SUJET prime sur la production. Une recherche de validation du sujet (demande réelle + angle/titre qui
clique) est OBLIGATOIRE AVANT tout lancement de vidéo — jamais l'inverse.**

Si le sujet n'intéresse pas / n'a pas de demande prouvée → on NE lance PAS (ou on change l'angle), PEU IMPORTE
la qualité visuelle ou narrative qu'on pourrait y mettre. Une carte vivante magnifique sur un sujet sans public
fera moins qu'une vidéo sobre sur un sujet recherché.

## POURQUOI (le mécanisme)
1. **Le sujet décide du CLIC, la qualité décide du RETOUR.** (LeChefOtaku, verbatim : « ce qui fait que les gens
   cliquent, c'est le sujet, et ça a toujours été le sujet. La qualité fait qu'ils reviennent, pas qu'ils
   cliquent. ») YouTube moderne segmente par NICHE/public cible : un sujet hors-demande n'est même pas montré
   (« zéro impression »), donc personne ne clique, donc la vidéo suivante est moins recommandée = engrenage.
2. **Le coût est asymétrique.** Valider un sujet = 30-60 min. Produire = des jours/semaines. Mettre l'effort de
   validation EN AMONT (pas cher) plutôt qu'EN AVAL (le mal est fait) = le meilleur ratio risque/coût qui existe.
   LeChefOtaku a mis 3 SEMAINES sur sa meilleure vidéo (Fire Force/Togashi) → flop, parce que le sujet
   n'intéressait pas. Une heure de recherche le lui aurait dit.
3. **C'est la règle ANTI-DÉCEPTION.** Un flop fait mal SURTOUT quand on y a cru à 100%. Si le sujet est validé
   en amont, un échec devient un signal de données, pas un jugement sur le talent. On ne tombe pas amoureux
   d'une idée avant d'avoir vérifié qu'elle a un public. → détacher la qualité du travail du compteur de vues.
4. **Ça rend la chaîne FAISABLE/soutenable** : on ne PRIE plus qu'une vidéo marche, on choisit des sujets à
   demande prouvée → le risque baisse à chaque vidéo. Différence entre un pari et un métier.

## GARDE-FOUS (pour rester aligné avec qui on est)
- **Le sujet prime DANS notre niche, PAS en dehors.** La règle = « parmi les sujets géopo/éco africains (notre
  créneau), lesquels ont de la demande ? » — PAS « quel sujet viral récupérer ». Sinon on trahit la cohérence
  (leçon Caspian : la crédibilité s'effondre dès qu'un élément racole). Ne JAMAIS sacrifier la charte analyste
  (pas de "HUMILIÉ", pas de prise de camp) pour du clic.
- **Sujet ET angle/titre.** Pas le sujet brut : le MÊME sujet sous un mauvais angle flop, sous le bon il clique
  (ex. LeChefOtaku : « Marine Ford » cartonne, « Devy Back Fight » floppe — même manga). La validation porte sur
  « ce sujet a-t-il un public + sous quel angle/titre il clique ».

## PROTOCOLE DE VALIDATION — GATE À 2 NIVEAUX (Aziz 2026-06-16 : un titre + un nombre de vues ≠ validation)
Miroir du DA-BRIEF-GATE (protège le VISUEL) mais pour le SUJET. ⚠️ LEÇON : les VUES mesurent l'attractivité du
TITRE/sujet, PAS la qualité, le format, ni la transposabilité. Une vidéo à 279k vues peut être un clip de podcast
recyclé, de la désinfo panafricaniste virale, ou une vraie analyse — on ne le SAIT pas sans lire le contenu.
Valider sur les vues seules = valider une coquille. D'où 2 niveaux :

### ⛔⛔ LEÇON N°0 — LE SEED/INPUT DÉTERMINE TOUT (Aziz 2026-06-16, prouvé en test)
La qualité d'une recherche de découverte = la qualité de son POINT DE DÉPART. Erreur commise : lancer
`search_related_outliers` sur Sahel Chronicles (chaîne Nigeria + ANGLOPHONE) → résultats = sujets Nigeria-EN,
INUTILES pour nous (FR, Sahel/Afrique de l'Ouest). On avait choisi cette chaîne pour son ANGLE (analyste), pas
son SUJET ni sa LANGUE → mauvais seed. RÈGLES :
1. **Partir d'une VIDÉO (`videoId`), PAS d'une chaîne** quand on veut éviter le biais d'ADN de la chaîne. Une
   vidéo Afrique qui perce dans une chaîne FR généraliste = signal PUR (un public francophone non-spécialiste a
   cliqué) = meilleur que partir d'une chaîne 100% Afrique anglophone.
2. **Filtre `language: ["fr"]` NON-NÉGOCIABLE** pour valider NOTRE marché. L'EN sert à l'inspiration d'ANGLE, pas
   à la demande.
3. **Le SEED tire vers SON sujet** : seed "La Corée du Nord d'Afrique" → moitié des résultats sur la Corée du Nord
   (vrai test 06-16). Choisir des seeds dont le SUJET CENTRAL est le nôtre (Sahel, CFA, France-Afrique).
4. **Croiser PLUSIEURS seeds alignés + recouper** : un sujet qui ressort sur plusieurs seeds = vraie demande ; sur
   un seul = biais de ce seed. + recouper avec `search_outliers` par MOTS-CLÉS FR purs (non contaminé par un seed).
→ Bons seeds pour NOUS : vidéos FR carto/géopo Afrique qui cartonnent (ex. Max Bellona). Voir [[DECODE-modeles-fr-afrique]].

### NIVEAU 1 — FILTRAGE rapide (~10 min) : le thème attire-t-il des clics ? Y a-t-il une demande VIVANTE ?
- ⭐ **`last30days` (skill) = PLACE CENTRALE/PRIVILÉGIÉE** : ce que les gens disent/cherchent/débattent MAINTENANT
  (Reddit, X, YouTube, TikTok, HN, news, web). C'est le détecteur de DEMANDE FRAÎCHE + d'ANGLE ÉMERGENT + de
  TIMING (le timing = la moitié du clic ; cf. LeChefOtaku « Fire Force fait un an trop tôt »). TubeLab = rétroviseur
  (le passé) ; last30days = la demande VIVANTE. → lancer last30days sur le sujet candidat EN PREMIER.
- `TubeLab search_outliers` (langue en+fr, durée long-form) → le THÈME a-t-il produit des outliers (ratio
  averageViewsRatio élevé) ? Filtre les sujets MORTS. + `get_channel_videos` sur chaînes de réf (Sahel Chronicles,
  Bellona, The Invisible Hand) : qu'est-ce qui marche dans NOTRE registre exact.
- Sortie niveau 1 : 2-3 sujets candidats qui ont une demande (passé TubeLab + vivante last30days). Les morts sont éliminés.

### NIVEAU 2 — VALIDATION ACTIONNABLE (~20-30 min) : sur les 2-3 candidats SEULEMENT
- ⭐ **EXTRAIRE LES TRANSCRIPTS** des meilleurs outliers (yt-dlp `--write-auto-sub`) + les LIRE. Répondre à :
  (a) POURQUOI ça marche (angle, promesse, hook, structure) ? (b) Est-ce de la QUALITÉ ou du creux/clickbait/podcast
  recyclé ? (c) Quel ANGLE LIBRE reste pour NOUS (analyste, carte vivante) que les outliers ne couvrent pas ?
  → c'est ÇA la validation actionnable, pas le compteur de vues.
- ⚠️ Repérer le PIÈGE d'angle : si les outliers qui marchent sont TOUS militants/pompeux/pro-Traoré
  inspirationnel (registre qu'on REFUSE), le sujet "marche" mais PAS pour nous → soit on trouve un angle analyste
  distinct, soit on écarte (on se ferait écraser sur leur terrain). Cf. leçon Caspian + charte analyste.
- **Angle/titre** : doctrine titres Kora & Cartes (fait + conséquence + cause inattendue) → 2-3 titres testés,
  DISTINCTS des outliers militants. Le bon angle sauve un sujet moyen ; le mauvais tue un bon sujet.

### VERDICT
- Demande vivante (last30days) + outliers dans le passé + angle analyste libre + matière dispo → **GO**.
- Demande faible OU seulement des angles militants OU aucun angle distinct → **NO-GO ou RÉ-ANGLER**.
- Souvent le gate REDIRIGE vers un MEILLEUR sujet que l'idée initiale (coup de tête) → c'est le but.
- Décision GOÛT (Aziz tranche) si borderline/hors-niche ; décision TECHNIQUE (Claude tranche) si données claires.

## RAPPEL — notre avantage structurel
Notre production est DATA-DRIVEN Remotion : un short/carrousel coûte une fraction d'un long (vs LeChefOtaku qui
re-tourne/re-monte à la main). Donc le coût marginal du contenu réutilisable est notre allié CONTRE l'anxiété de
performance — mais ça ne dispense PAS de valider le sujet : produire pas cher un sujet sans demande reste du
temps perdu.

Liens : [[CHARTE-EDITORIALE-SOUVERAIN]] · [[feedback_doctrine-titres-youtube-kora-cartes]] · [[ANGLE-MACRO-SOUVERAIN]] ·
[[DA-BRIEF-GATE]] (miroir visuel) · [[STRATEGIE-DERIVES-SHORT-CARROUSEL]] · [[DECODE-sahel-chronicles]].
