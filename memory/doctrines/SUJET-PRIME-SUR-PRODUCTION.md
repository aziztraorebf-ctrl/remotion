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

### LE WORKFLOW EN 6 ÉTAPES (Aziz 2026-06-16 — checklist exécutable, ~45-60 min, du large au précis)
Miroir du DA-BRIEF-GATE (visuel) et de /beat, mais pour le CHOIX DU SUJET en amont. Logique : large → précis,
"quoi" → "comment". Coût maîtrisé (TubeLab a des crédits ; voir [[tools/tubelab]] règle de routage).

**0. INTAKE** : les idées d'Aziz OU la question ouverte « qu'est-ce qui marche en ce moment dans notre sphère ? »

**1. DÉCOUVERTE LARGE (TubeLab, ~10 min)** — sphère Afrique FR, PAS que géopo (rester ouvert à ce qui se démarque) :
   - `search_outliers` mots-clés LARGES (`["Afrique", "Africa economy", "histoire africaine"...]`), `language:["fr"]`,
     `classificationIsFaceless:true`, `durationFrom:360`, tri `averageViewsRatio` desc → vidéos qui SURPERFORMENT.
   - `search_channels` (niche + faceless + ratio vues/subs élevé) → CHAÎNES qui montent (≠ vidéos).
   → Sortie : 3-4 vidéos/sujets qui SE DÉMARQUENT.

**2. TIMING — éliminer les sujets FROIDS (`last30days` skill, ~10 min)** :
   - Une vidéo à succès peut dater de 1 an → sujet refroidi/mort. last30days dit ce qui est CHAUD MAINTENANT
     (Reddit/X/YouTube/TikTok/news). → garder les 2-3 sujets ENCORE vivants, éliminer les froids AVANT de dépenser
     des crédits à remonter les fils. (TubeLab=passé ; last30days=présent.)

**3. REMONTER LE FIL — sur 2-3 candidats SEULEMENT (le "fil d'Ariane", ~20 min)** :
   - `search_related_outliers` par **`videoId`** (PAS par chaîne — leçon N°0) → qui d'autre a traité ça, quels angles.
   - `get_video_comments` (yt-dlp gratuit de préférence) → ce que le public VALIDE / REPROCHE / RÉCLAME = matière à angle.
   - transcript (yt-dlp gratuit) → quel angle est DÉJÀ pris → donc lequel est LIBRE pour nous.
   - ⚠️ plafonner à 2-3 vidéos max (coût/temps). Ne pas remonter le fil sur tout.

**4. SYNTHÈSE ANGLE (~10 min)** — croiser last30days + commentaires + transcripts :
   - l'angle FRAIS du moment (l'actu qui relance le sujet) + l'angle analyste LIBRE (camp 2, PAS militant — cf.
     [[DECODE-modeles-fr-afrique]] : World View/Open Box = doc neutre ; Yamb/Traoré = militant à éviter).
   - ⚠️ PIÈGE d'angle : si tous les outliers qui marchent sont militants/racoleurs, le sujet "marche" mais pas pour
     nous → trouver l'angle analyste distinct OU écarter (leçon Caspian). NB : l'outil ne donne pas d'« idée toute
     faite » — il donne la MATIÈRE (outliers + commentaires + trends), c'est NOUS qui déduisons l'angle inédit.
   - pré-TITRE testé (doctrine titres : fait + conséquence + cause inattendue), DISTINCT des militants.

**5. VERDICT** :
   - Chaud (last30days) + outliers passés + angle analyste libre + demande FR prouvée + matière dispo → **GO**.
   - Froid OU seulement angles militants OU aucun angle distinct → **NO-GO ou RÉ-ANGLER**.
   - Souvent le gate REDIRIGE vers un MEILLEUR sujet que l'idée initiale (coup de tête) = c'est le but.
   - Décision GOÛT (Aziz tranche) si borderline/hors-niche ; TECHNIQUE (Claude tranche) si données claires.
   → On sort avec : SUJET validé + ANGLE libre + pré-TITRE + ce que le public veut + FORMAT pressenti.
   → SEULEMENT ENSUITE : pré-production. Jamais avant. **MAIS le 1er livrable de la pré-prod = le POSITIONNEMENT (ci-dessous), AVANT le script.**

### ⭐ CHOIX DU FORMAT — la NATURE du sujet décide (short vs mid-form/long) — Aziz 2026-06-27
Prouvé par le Short franc CFA : on a passé une heure à comprimer un contenu qui VOULAIT respirer. Leçon racine :
- **Sujet NARRATIF / VISUEL / ÉMOTIONNEL** (une image forte, une histoire, un geste : la Muraille Verte qui avance,
  un héros, une tragédie) → **SHORT**. Le short excelle sur l'image forte et l'émotion, pas sur l'explication.
- **Sujet à MÉCANISME / CHAÎNE CAUSALE** (il faut expliquer comment ça marche : franc CFA = parité→garantie→réserves
  →réforme ; un système financier, juridique, institutionnel) → **MID-FORM ou LONG**. Comprimer un mécanisme en
  90-140s le mutile. Le signal "je n'arrête pas de couper sans perdre le sens" = le sujet veut du long.
- **Le short reste la PORTE D'ENTRÉE audience** (un short qui perce amène vers les longs). Stratégie : short = amorce
  émotionnelle d'un sujet narratif ; long = profondeur d'un sujet à mécanisme. Choisir par la NATURE, jamais par habitude.
- **Notre avantage structurel** (data-driven Remotion) s'exprime MIEUX sur le long : un long ne coûte pas
  proportionnellement plus cher qu'à un YouTuber qui filme. → ne pas fuir le long par réflexe "short = plus simple".
- ⚠️ Un sujet à mécanisme PEUT donner un short SI on en fait l'amuse-bouche émotionnel (1 angle, 1 image) + CTA vers
  le long. Mais ne pas vouloir TOUT expliquer dans le short (piège CFA). Cf. [[RECHERCHE-PRESCRIPT-UNIFIEE]] étape 7.

## ⭐ ÉTAPE 6 — L'ÉTOILE POLAIRE DE POSITIONNEMENT (1er livrable de pré-prod, AVANT le script) — Aziz 2026-06-16
Une fois le sujet validé (étapes 0-5), AVANT d'écrire le script ou de choisir la manière visuelle : **écrire l'étoile polaire**. C'est ce qui empêche les dérives en aval — sans elle, on écrit des actes « corrects » qui glissent vers le générique. Avec elle, chaque décision (titre, phrase, choix visuel) a un juge : *« est-ce que ça sert notre différenciation ? »*.

**L'ordre canonique de pré-prod (tous formats) :**
1. **SUJET** (la demande prouvée — étapes 0-5 ci-dessus). *Le sujet décide du clic.*
2. **POSITIONNEMENT** (l'étoile polaire — cette étape). *Pourquoi NOUS, ce qu'on apporte de différent.*
3. **DONNÉES** (le factuel tracé, qui PRIME sur le ressenti/l'émotion). Gate factuel.
4. **PUIS** seulement : la manière visuelle, le script, le code.

**Ce que contient l'étoile polaire :**
- Pourquoi cette vidéo (à quel besoin du public on répond — souvent issu des commentaires de l'étape 3).
- Ce qui nous DIFFÉRENCIE des concurrents (le trou éditorial qu'on occupe vs l'émotionnel / le jargon / le superficiel).
- La phrase-étoile (le test de réussite : qu'est-ce que le spectateur ressort en ayant COMPRIS, pas juste ressenti).
- Implication titrage + ton (déclaratif/mécanique, pas émotionnel).

**Proportionné à l'enjeu (pas de bureaucratie) :**
- **Formats longs/de fond** (mid-form, War-Map Long, Atlas) → 1 page de positionnement (ex. modèle : [[soudan-midform-POSITIONNEMENT]]).
- **Formats courts** (Short 90s, carrousel) → 1 LIGNE suffit (l'angle différenciant en une phrase). Ne pas alourdir un Short d'une page formelle.

**Principe de fond** : notre seul avantage concurrentiel DÉFENDABLE = la JUSTESSE (données > émotion). Si on est « l'émotionnel en plus joli » → interchangeable. Si on est « la compréhension limpide et rigoureuse » → seuls sur le créneau. Le positionnement fige CE choix avant qu'on écrive une ligne. Cohérent avec [[CHARTE-EDITORIALE-SOUVERAIN]] (pas de méchant, multi-perspective) et les doctrines de script (données > ressenti) — le positionnement les ACTIVE pour un projet précis, il ne les remplace pas.

## RAPPEL — notre avantage structurel
Notre production est DATA-DRIVEN Remotion : un short/carrousel coûte une fraction d'un long (vs LeChefOtaku qui
re-tourne/re-monte à la main). Donc le coût marginal du contenu réutilisable est notre allié CONTRE l'anxiété de
performance — mais ça ne dispense PAS de valider le sujet : produire pas cher un sujet sans demande reste du
temps perdu.

**SUITE → APRÈS le verdict GO + positionnement, enchaîner sur [[RECHERCHE-PRESCRIPT-UNIFIEE]]** (étapes 7-9 :
script conforme DOCTRINE-SCRIPT-UNIFIEE → fact-check 3 niveaux → jury LLM). Ce fichier-ci = étapes 0-6 ; ne pas dupliquer.

Liens : [[CHARTE-EDITORIALE-SOUVERAIN]] · [[feedback_doctrine-titres-youtube-kora-cartes]] · [[ANGLE-MACRO-SOUVERAIN]] ·
[[DA-BRIEF-GATE]] (miroir visuel) · [[STRATEGIE-DERIVES-SHORT-CARROUSEL]] · [[DECODE-sahel-chronicles]] ·
[[RECHERCHE-PRESCRIPT-UNIFIEE]] (la suite : script + fact-check + jury).
