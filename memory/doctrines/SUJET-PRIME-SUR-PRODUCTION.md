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

**2. TIMING — éliminer les sujets FROIDS (`last30days` skill, ~10 min)** — ⚠️ scoper à UN thème ciblé,
   PAS une liste de 6-8 sujets en un seul appel (vécu 2026-08-13 : un appel `Sahel/AES + CFA + ressources +
   Wagner + Maroc-Algérie + FMI + Chine-Russie` en une requête a produit un résultat trop large pour
   décider — le skill last30days est conçu pour approfondir une entité/thème, pas balayer une liste).
   Si plusieurs sujets candidats existent après l'étape 1, lancer last30days séquentiellement sur les 2-3
   qui se démarquent le plus, pas en vrac :
   - Une vidéo à succès peut dater de 1 an → sujet refroidi/mort. last30days dit ce qui est CHAUD MAINTENANT
     (Reddit/X/YouTube/TikTok/news). → garder les 2-3 sujets ENCORE vivants, éliminer les froids AVANT de dépenser
     des crédits à remonter les fils. (TubeLab=passé ; last30days=présent.)

**3. REMONTER LE FIL — sur 2-3 candidats SEULEMENT (le "fil d'Ariane", ~20 min)** :
   - `search_related_outliers` par **`videoId`** (PAS par chaîne — leçon N°0) → qui d'autre a traité ça, quels angles.
   - `get_video_comments` (yt-dlp gratuit de préférence) → ce que le public VALIDE / REPROCHE / RÉCLAME = matière à angle.
   - transcript (yt-dlp gratuit) → quel angle est DÉJÀ pris → donc lequel est LIBRE pour nous.
   - ⚠️ plafonner à 2-3 vidéos max (coût/temps). Ne pas remonter le fil sur tout.
   - **Variante — remonter le fil sur un CATALOGUE ENTIER (preuve 2026-08-12, TED-Ed)** : quand la question
     porte sur un PATTERN de chaîne plutôt qu'un sujet précis ("ce concurrent réussit sur tous ses sujets,
     pourquoi ?"), une seule vidéo ne suffit pas — utiliser `TubeLab get_channel` pour lire un échantillon
     large (ex. 120 vidéos/an) et chercher le dénominateur commun. Cas vécu : analyser tout le catalogue
     annuel de TED-Ed a révélé que le succès venait de la FORMULATION du titre (question-curiosité
     universelle), pas des sujets eux-mêmes (aucun sujet Afrique/actualité dans le top 40 de l'année) —
     invisible en examinant les vidéos une à une. Ça a permis de trancher une hypothèse qu'Aziz soupçonnait
     fausse sans pouvoir le prouver ("garder un sujet conflit + juste changer le ton"). Distingue "cette
     vidéo a marché" (1 point, bruit possible) de "ce pattern marche systématiquement" (tout le catalogue,
     signal). Détail complet du cas : [[EXPLORATION-DIVERSIFICATION-CHAINES]] § session 2026-08-12.

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

### ⭐ TYPER LE MOTEUR NARRATIF → dynamisme + format + style (à l'étape 4-5, AVANT toute prod) — Aziz 2026-06-27
> Évolution de la simple règle « narratif→short / mécanisme→long ». Le franc CFA a montré que le format seul ne
> suffit pas : il faut prédire AUSSI le DYNAMISME (ce sujet va-t-il claquer comme GGW ?) et le STYLE, dès qu'on
> type le sujet. Le **moteur narratif** (la mécanique qui crée la tension) est le bon prédicteur des trois.
> ⚠️ Ce n'est PAS « bon sujet vs mauvais sujet » : c'est l'ADÉQUATION moteur ↔ format. Le CFA n'était pas mauvais,
> il était mal formaté (short) → son moteur (mécanisme) voulait du mid-form. On type le moteur, le reste suit.

**Les 4 moteurs narratifs** (déduits à l'étape 4 Synthèse-angle, en même temps que l'angle) :

| Moteur du sujet | Dynamisme natif | Format | Registre / accent visuel pressenti |
|---|---|---|---|
| **RETOURNEMENT** — « on croyait X, c'est faux, la vraie réponse est Y » | Fort (surprise par beat) | Short OU mid | Encre **parchemin** + colorisation sémantique verte (GGW : inerte→la vie apparaît) |
| **MÉCANISME** — « A cause B cause C » (système financier/juridique/institutionnel) | Moyen, à DOSER (construction) | Mid/long | Encre **blanc cassé** (analytique, net) + accent or/bleu-acier (valeur). Blueprint qui se construit (CFA) |
| **RÉCIT / CHRONOLOGIE** — « il s'est passé X, puis Y, puis l'effondrement » | Fort (tension temporelle) | Mid/long | Carte vivante Mapbox OU encre **blanc froid** grave (Soudan, Thiaroye) |
| **RÉVÉLATION-CHIFFRE** — « un chiffre qui tue » | Fort mais BREF (choc unique) | Short | Échelle objet + colorisation du chiffre (or africain, vraie-taille-Afrique) |

**Comment lire la table :**
- Le **moteur prédit le PUNCH** : retournement / récit / révélation-chiffre claquent nativement (comme GGW). Le
  mécanisme est le seul à dynamisme « moyen » → il a besoin de la CONSTRUCTION séquentielle pour vivre (et donc de
  durée). C'est pour ça que le CFA en short était plat : on coupait la construction qui EST son dynamisme.
- Le **moteur prédit le FORMAT** : mécanisme/récit → mid/long ; retournement/chiffre → short possible. Signal-clé :
  « je coupe sans perdre le sens » = retournement/chiffre (short OK) ; « je coupe et le sens se mutile » = mécanisme (mid).
- Le **moteur oriente le STYLE par le TON** (cf. trousseau ci-dessous), il ne le FIGE pas : le DA-brief tranche en aval.

**⭐ FOND + ACCENT selon le TON (ce N'EST PAS un nouveau registre — Aziz 2026-06-27, test `files.catbox.moe/jb8puk.png`).**
⚠️ CORRECTION d'une formulation initiale fausse : changer la couleur d'accent (vert→or→rouge) et le fond
(parchemin→blanc) NE CRÉE PAS un nouveau registre. C'est exactement ce que la colorisation sémantique fait DÉJÀ
par design. Le registre `encre` reste UN registre (cf. les 7 registres réels dans [[SVG-SCENES-GENERATIVES]]). Le
seul acquis réel du test : **le fond n'est pas obligé d'être le parchemin** — un blanc cassé / blanc froid tient
aussi bien et adapte le TON. Le N&B intégral est PROSCRIT (sans accent, les formes grises ne lisent plus comme
vivantes — graines = pierres mortes). Toujours garder UNE couleur d'accent réservée au sens.

| Ton du sujet | Fond | Accent sémantique (le seul colorisé) |
|---|---|---|
| Espoir / nature / vie | parchemin `#e8dcc0` | vert (la vie qui revient) |
| Analytique / mécanisme / argent | blanc cassé `#f4f1ea` | or ou bleu-acier (la valeur) |
| Tragique / guerre / perte | blanc froid `#fbfaf7` | rouge sang (le seul accent, jamais de vert) |

**⭐ AXE PHYSICALITÉ — le sujet a-t-il une incarnation physique naturelle ? (prouvé Grand Inga 2026-06-28)**
> Hypothèse validée en R&D : GGW vit car arbres = gestes physiques (croissance, ombre, vent). CFA peinait car mécanisme = métaphore froide (flux monétaire = abstraction). Ce n'est pas un nouveau moteur narratif — c'est un MODIFICATEUR qui affecte la vivacité native d'un moteur.

**Test de physicalité :** « Est-ce que l'objet central de cette scène bougerait dans la vraie vie sans intervention humaine ? »
- OUI (turbine qui tourne, eau qui coule, arbre qui pousse, flamme qui vacille) → **SVG encre vivant natif**. L'animation raconte sans effort.
- NON (mécanisme pur, flux monétaire, abstraction réglementaire) → **SVG possible** mais demande un VECTEUR D'INCARNATION explicite (un objet porteur : la pièce, le décret, la main qui signe, la bougie). Sans vecteur → effet PowerPoint garanti.

**Corollaire (objet inerte) :** un objet qui ne se déplace pas dans la vraie vie (lingot, coffre, pierre, bâtiment, turbine à l'ARRÊT) NE GLISSE JAMAIS — il s'illumine, change de couleur, ou fade sur place. Seuls les objets naturellement mobiles (eau, flamme, végétation, véhicules) peuvent se déplacer de façon crédible.

**⭐ AXE FRICTION DE PRODUCTION — 3 facteurs qui prédisent le temps/risque de blocage (Aziz 2026-07-10, comparatif rétrospectif).**
> RECOMMANDATION, pas un gate bloquant — un sujet à friction élevée reste un GO légitime (le Soudan a servi
> de banc d'essai pour combiner Mapbox + inserts SVG + split-screen + jury LLM densité en un seul projet ; ce
> code et ces patterns sont maintenant réutilisables, ce n'est pas du temps perdu). L'utilité de l'axe est de
> **savoir à quoi s'attendre AVANT de s'engager**, pas de refuser un sujet ambitieux.

Comparatif rétrospectif (GGW/Cacao produits en 2 jours-1,5 semaine sans blocage ; Soudan/War-Map Sahel
étalés sur plusieurs sessions avec blocages répétés) fait ressortir 3 facteurs qui, cumulés, prédisent la
friction — aucun seul ne suffit à en faire un sujet difficile :

1. **Nombre d'acteurs/entités externes dans le récit.** 0-2 acteurs (GGW, Cacao) = récit auto-contenu, facile
   à mettre en scène. 4+ acteurs externes (Soudan : EAU/Turquie/Russie/Égypte) exige une fiche de hiérarchie
   dédiée et une règle anti-complexité explicite ("max 2 acteurs/beat") rien que pour rester lisible.
2. **Actualité en cours vs fait stable.** Un fait historique/économique stable (GGW, Cacao, Peste 1347) se
   fact-check une fois et ne bouge plus. Une actualité en cours (guerre active, faits niés officiellement,
   chiffres disputés) oblige à revoir le script en pleine production quand un fait se précise ou se corrige.
3. **Registre visuel unique vs hybride.** SVG pur du début à la fin (GGW, Cacao) = un seul système à
   maîtriser. Combiner Mapbox + inserts SVG narratifs + split-screen (Soudan, War-Map Sahel) transforme
   chaque insert en mini-chantier de conception à part entière, pas une simple scène de plus.

**Comment s'en servir** : à l'étape 4-5 (typer le moteur narratif), noter ces 3 facteurs pour le sujet
candidat. 0-1 facteur présent → friction faible attendue, produire directement. 2-3 facteurs cumulés →
prévoir plus de sessions, un fact-check continu si actualité mouvante, et accepter qu'un ou deux inserts
techniques (caméra, registre hybride) demandent plusieurs itérations avant validation — ce n'est pas un
signal d'échec, c'est le coût attendu d'un sujet qui combine plusieurs briques à la fois.

**⭐⭐ DENSITÉ NARRATIVE = le ratio change la GRAMMAIRE DE MONTAGE, pas que la composition (Aziz 2026-06-27, prouvé).**
> Réfute la doctrine antérieure « format = simple paramètre de composition » (fausse, cf. test
> `files.catbox.moe/6u1usb.png` vertical vs horizontal + scène-port animée `files.catbox.moe/voh2fv.mp4`).
- **VERTICAL 9:16** = séquence dans le TEMPS. Plan-objet : UN héros-objet qui pose une idée, remplacé par le suivant.
  Le vide est élégant (page de carnet). L'encre minimaliste y excelle nativement.
- **HORIZONTAL 16:9** = séquence dans l'ESPACE. Le champ large a une EXIGENCE DE DENSITÉ que le vertical n'a pas :
  un seul objet au centre lit « inachevé / perdu », pas « aéré ». Remède = **densité NARRATIVE, jamais décorative** :
  une **scène-lieu composée** (plusieurs objets cohérents d'un même lieu, SANS organique humain) qu'on POSE calme,
  PUIS qu'on ACTIVE objet par objet (colorisation / traçage / mouvement timé sur le script). L'attention VOYAGE
  d'objet en objet = le moteur de rétention sur ~1 min. Chaque objet porte un SENS activable, aucun n'est du remplissage.
- **Bonus** : la contrainte du champ large FORCE à montrer une séquence causale (port : la ressource sort → le prix
  vient d'ailleurs) → le format pousse vers l'explication, qui est la force Souverain. Parent du pattern Data-Hero
  ([[DECODE-mpesa-data-hero-MOTION]]) étendu à une scène-lieu narrative. Détail technique : [[SVG-MIDFORM-FORMAT]].

- **Le short reste la PORTE D'ENTRÉE audience** : un sujet à mécanisme PEUT donner un short SI on en fait l'amuse-bouche
  émotionnel (1 angle, 1 image forte) + CTA vers le long — sans vouloir TOUT expliquer (piège CFA). Cf. [[RECHERCHE-PRESCRIPT-UNIFIEE]] étape 7.
- **Notre avantage structurel** (data-driven Remotion) s'exprime MIEUX sur le long : un long ne coûte pas
  proportionnellement plus cher qu'à un YouTuber qui filme. → ne pas fuir le long par réflexe « short = plus simple ».
- Détail du trousseau visuel : [[SVG-MIDFORM-FORMAT]] · palettes de fond : [[_PALETTE-BACKGROUNDS]] (§ backgrounds).

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
[[RECHERCHE-PRESCRIPT-UNIFIEE]] (la suite : script + fact-check + jury) ·
[[STRUCTURE-OBJET-MECANISME]] (squelette narratif du corps, une fois le sujet validé).

---

## ⭐⭐ PREUVE EMPIRIQUE 2026-07-29 — L'EXPÉRIENCE À VARIABLE NEUTRALISÉE

Cette doctrine reposait sur un verbatim et des analyses qualitatives. Elle a maintenant une **preuve
quasi-expérimentale** : une chaîne concurrente où la variable PRODUCTION est strictement neutralisée
entre un flop et un outlier.

**Le dispositif** (Guinée en Données, 459 abonnés, économie guinéenne = notre créneau exact ; 9 vidéos
mesurées yt-dlp + TubeLab ; ratio vues/abonnés 4,07 → YouTube distribue bien, elle ne plafonne pas :
elle a un problème de VARIANCE) :

| | Vidéo à 64 vues (4 j) | Vidéo à 10 000 vues |
|---|---|---|
| Durée | 21 min 47 | ~21 min 30 |
| Habillage | fond noir + typo | identique |
| Matière visuelle | stock footage, **162 Mo** de flux | stock footage, **42 Mo** — soit MOINS |
| Voix | synthèse | synthèse (identique) |

**Écart ×157 à production constante — et l'outlier a MOINS de matière visuelle que le flop.** L'écart
est donc produit ENTIÈREMENT par le titre, la miniature et le choix du sujet. Ce n'est plus une
conviction, c'est une mesure.

**Les 3 transferts actionnables** :
1. **Sujet MATÉRIEL > sujet MÉTA.** « L'argent qui part » bat « la statistique qui manque ». Si l'angle
   candidat porte sur une absence/lacune/donnée manquante → le reformuler sur l'objet matériel en jeu,
   ou l'écarter.
2. **Miniature décodable en 0,4 s.** Objet de valeur + sujet humain **DESSINÉ** (l'outlier raté
   n'affichait que 2 pourcentages nus). ⛔ **décodable ≠ criard** : la Décision 4 de
   [[feedback_strategie-vs-chaines-youtube-2026-05]] (validée Aziz 2026-05-28) refuse les visages-photos
   clickbait — notre niche les rejette activement. Portraits en médaillon dessinés = OK, photo criarde = non.
3. **Le chiffre tombe en < 3 s.** Le hook globe + plongée caméra de 15 s de l'outlier RATÉ était ABSENT
   de la vidéo qui a marché. Cf [[HOOK-PREMIERE-MINUTE]] : le mouvement caméra RETIENT après le clic,
   il n'ACCROCHE pas.

**⛔ La conséquence inconfortable** : notre moat visuel (moteur déterministe, SVG, D3, cartes vivantes)
agit **entièrement APRÈS le clic**. Il décide de la rétention, de l'abonnement, de la valeur perçue — il
ne déclenche RIEN. Un épisode magnifique avec une miniature typographique et un titre à absence fera
64 vues. D'où : ne jamais sauter le gate sujet+angle au motif qu'« on produit mieux qu'eux ».

Angle commercial de ce constat (offre freelance) : `memory/freelance-linkedin/STRATEGIE-LINKEDIN-FREELANCE.md`.
⚠️ Chiffres de chaîne périssables (mesure 2026-07-29) ; le MÉCANISME ne périme pas.
