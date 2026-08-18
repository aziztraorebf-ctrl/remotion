# NEXT-ACTION — Recommandations actives
> Mis a jour : 2026-08-13 (purge : 26,5 Ko → ce fichier. Sections closes/mergées/dupliquées supprimées, git garde tout)
> Ce fichier repond a : "Que fait-on maintenant ?" et "Quelle voie je recommande ?"
> ⛔ **Format : 3 lignes max par projet.** Un projet TERMINÉ se SUPPRIME de ce fichier, il ne
> s'accumule pas — c'est faute d'appliquer cette règle qu'il a atteint 116 Ko en juillet, puis 26,5 Ko en août.
> ⭐ **RÈGLE DE MAINTENANCE (issue de 2 échecs, 07-27 et 07-30) : ce bloc reste le PREMIER du fichier.**
> Toute nouvelle section de session s'insère APRÈS lui, jamais avant — sinon l'avertissement descend
> et se fait enterrer, et un état périmé est annoncé à Aziz malgré l'avertissement présent et lu.

## ⛔⛔ AVANT DE LIRE QUOI QUE CE SOIT — LES CHANTIERS VIVANTS SONT DANS DES WORKTREES

> **Ce fichier (repo principal) est structurellement EN RETARD** sur les chantiers qui vivent ailleurs.
> ⛔ **Ne JAMAIS recopier ici une table figée des worktrees** (elle se périme en 1-3 jours — vécu 2×,
> 2026-07-27 et 2026-07-30, alors même que l'avertissement était présent et lu). **Toujours exécuter** :
> ```bash
> for w in $(git worktree list --porcelain | grep ^worktree | cut -d' ' -f2); do
>   echo "=== $w [$(git -C $w branch --show-current)]"; git -C $w log --oneline -3
> done
> git stash list
> ```
> Un commit récent dans un worktree **prime toujours** sur ce fichier-ci.
>
> ⚠️ **Stashs connus à vérifier** (peuvent être périmés — confirmer avant de dropper, re-vérifiés
> présents le 2026-08-13) : au moins 1 sur la branche Soudan (`wip-soudan-itineraire-avant-rnd-port`,
> chantier « itinéraire multi-étapes » — `ItineraireMultiEtapes16x9.tsx` etc.) et 2 WIP CFA sur
> `feat/cfa-nuit1994-svg-mix`.

---

## ✅ PACKAGING APPLIQUÉ DANS YOUTUBE STUDIO — FAIT PAR AZIZ LE 2026-08-17

**CFA** (publiée, était à 48 vues / 0 commentaire / 0 vue-jour depuis J+4) :
titre → « Ils dormaient. Le Franc CFA a été divisé par deux. » (50 c.) · commentaire épinglé
(registre conversationnel) · question en fin de description · sous-titres `.srt` propres importés.

**SOUDAN** (sortie 20 août) : titre → « **La guerre au Soudan n'a aucune raison de s'arrêter** »
(50 c., formulation d'Aziz) · miniature → **Serpent retouché** (`serpent-de-lor-SANS-TEXTE.png`),
Machine à Guerre écartée · sous-titres importés. Détail + titres écartés :
`out/PRET-PUBLICATION/soudan-midform-FINAL.PUBLICATION-NOTE.md`.

📁 **Sous-titres propres des 2 vidéos** : `out/PRET-PUBLICATION/sous-titres/franc-cfa-midform-FR.srt`
(54 segments) et `soudan-midform-FR.srt` (179 segments). ⚠️ `out/` est **gitignoré** → ces fichiers
ne sont PAS versionnés, ce pointeur est leur seule trace. Le Soudan a été produit par **alignement
forcé sur l'audio de la vidéo finale** (aucune transcription n'existait, la vidéo n'étant pas
publiée) — méthode complète : `memory/doctrines/PACKAGING-YOUTUBE.md` §7.

⏭️ **À RELEVER À J+3 ET J+7** (point de départ : CFA 48 vues / 0 comm. · Sénégal 93 / 0 · AES 42 / 0) —
outil et méthode : `memory/doctrines/DIAGNOSTIC-FLOP-VIDEO.md` (`vidiq_channel_analytics` donne
impressions, CTR et rétention seconde-par-seconde). ⚠️ Si le CTR ne bouge pas après 7 jours, le
levier suivant est la **miniature**, pas un nouveau titre — ne pas re-titrer en boucle.
⚠️ Deux variables changent en même temps (CFA re-titré ET Soudan qui sort) : ne pas attribuer trop
vite un effet à une seule cause.

---

## ✅ DETTE MÉMOIRE A/B — SOLDÉE (2026-08-18)

**9 doublons traités, 0 collision restante** (`check-memoire-doublons.py` → exit 0).
⛔ La leçon qui reste : les 2 arborescences peuvent TOUTES DEUX être à jour, mais l'index ne pointe
que vers UNE → un même nom des deux côtés crée un fragment **présent mais INVISIBLE**.
**5 fichiers sur 9 contenaient du contenu unique introuvable ailleurs** — dont 2 doctrines à interdits
durs (la règle « drapeau ≠ compagnie » de CARTO, le point 2bis anti-redondance de scène de CONTINUITÉ)
et un corpus entier de 400 lignes dans `key-learnings` (ère Seedance/Atlas 2026-02→04, disjoint).
⛔ **La date et la taille ne disent RIEN** : plusieurs fois la version la plus ancienne/petite portait
l'unique exemplaire.

🚦 **Outillé** : `python3 scripts/tools/check-memoire-doublons.py` (référencé dans CLAUDE.md) — scanne
les 2 arborescences, écarte les collisions résolues (stub/identiques) et les faux positifs connus.
**À relancer après tout ajout de fichier mémoire.**

---

## ⭐⭐⭐ PROCHAINE SESSION — EXPLORATION DES FORMATS NARRATIFS (décidé 2026-08-17)

> ✅ **LIVRABLE PRODUIT LE 2026-08-17 : [`memory/doctrines/FORMES-NARRATIVES.md`]
> (doctrines/FORMES-NARRATIVES.md)** — 7 formes narratives, conditions d'usage, arbre de décision,
> dosage mesuré. **C'est LUI qu'on ouvre pour choisir une forme** ; il est inscrit dans `ROUTAGE.md`,
> pointé depuis `DOCTRINE-SCRIPT-UNIFIEE` et `HOOK-PREMIERE-MINUTE`, et devient le 7e réflexe de MEMORY.
> ⛔ **Correction de cadrage (Aziz, 2026-08-17)** : la session avait produit surtout des **mécanismes
> d'écriture**, pas des formats. Les deux sont maintenant SÉPARÉS dans la doctrine (§ formes vs
> § boîte à outils). Reste ouvert : chercher d'autres FORMES (pas d'autres techniques).
>
> 📂 **Dossier de recherche (sources, 9 transcripts, niveaux de preuve)** :
> **`memory/recherche-formats/REGISTRE-FORMATS-NARRATIFS.md`** — cas étudiés, transcripts sauvegardés,
> 3 mécaniques convergentes, leçons de méthode TubeLab, état d'avancement. **L'ouvrir en premier**
> pour reprendre ce chantier ; le présent § garde le cadrage et le cas Adam Ivy.

> **Le principe qui cadre tout ce chantier, mots d'Aziz** : « On est sur YouTube, on est sur les
> réseaux sociaux, adaptons-nous à ce que les gens veulent voir. **Et le défi, c'est de ne pas perdre
> son âme.** » — c'est-à-dire ne pas virer MrBeast ni TikTok-agressif-toutes-les-2-secondes, mais
> **regarder pourquoi les gens aiment ça et le modifier pour nous**. Emprunter la MÉCANIQUE, pas le TON.
> Preuve que ce n'est pas un compromis mais une compétence : le titre « Most of you will never get
> monetized now » utilise tous les codes du genre (interpellation, enjeu personnel, promesse) sur un
> contenu nuancé et chiffré — Aziz a cliqué, et la vidéo n'avait rien perdu de sa substance.
> **Rester flexible** est la consigne explicite.

### Pourquoi ce chantier existe
Le pipeline actuel va : sujet → script → storyboard → **moteur visuel** → code. Le **FORMAT NARRATIF
n'est jamais choisi explicitement** — il est hérité par défaut, et ce défaut est le documentaire
explicatif. C'est exactement le mécanisme que la doctrine des moteurs visuels a déjà corrigé pour
l'image : sauter l'étape = retomber sur ce qu'on a déjà en tête.
⭐ Constat d'Aziz : nos scripts SONT devenus plus narratifs (le CFA ouvre sur une nuit, un
basculement, des gens qui dorment). Mais **le format est amorcé et pas tenu** — abandonné après 30 s
pour repasser en explication.

### ⛔ La question à poser (mesurée, pas supposée)
Sur l'AES, le décrochage n'est **PAS dans le hook** mais entre **30 s et 3 min** — précisément là où
nos vidéos quittent le récit pour entrer en explication (source : rétention seconde-par-seconde,
`DIAGNOSTIC-FLOP-VIDEO.md`). Donc la question n'est pas « quelle accroche » mais :
> **Qu'est-ce qui tient un spectateur PENDANT la partie explicative, sans donner un cours magistral ?**

Et le cadrage de recherche, plus étroit que « les formats viraux » (qui ramène du bruit non
transposable) :
> **Quels formats fonctionnent sur des sujets où il ne se passe RIEN visuellement ?**
> (ni action, ni personnage, ni archives — c'est notre vraie contrainte)
Niches qui l'ont déjà résolu : true crime (enquête sur faits froids), vulgarisation scientifique,
analyse économique. ⛔ Chercher HORS géopolitique — c'est tout l'intérêt du niche bending.

### Les 3 temps de la session
1. **CHERCHER** — TubeLab (**566 crédits**, vérifié), outliers sur sujets sans matière visuelle dans
   des niches adjacentes. Compléter avec vidIQ (**154 crédits**) si besoin.
2. **DÉCORTIQUER** — transcripts des gagnants : comment ils OUVRENT, comment ils TIENNENT la minute
   1→3, comment ils RELANCENT. C'est la minute 1-3 qui compte, pas l'accroche.
   ⭐ **+ 4e question à mesurer sur les mêmes transcripts (ajoutée 2026-08-17)** : **à quelle FRÉQUENCE,
   et par quel GESTE, ramènent-ils l'abstrait à une expérience vécue ?** Compter les occurrences, ne pas
   supposer. Hypothèse à valider ou tuer : c'est une des réponses à « qu'est-ce qui tient pendant
   l'explication ». Voir § ÉCHELLE HUMAINE ci-dessous.
3. **FORMALISER** — un **registre de formats** (sur le modèle du registre des moteurs visuels), plus
   une **étape de choix explicite insérée dans le pipeline, entre le sujet et le script**.
   Si la mesure du temps 2 confirme : l'échelle humaine entre dans le registre comme **composant de
   format** (fréquence + geste), pas comme une note de style.

**Livrable concret** : appliquer un format choisi au sujet **FMI**, en SCRIPT SEULEMENT, zéro production.

---

### ⭐⭐⭐ FMI — CE QUI RESTE À FAIRE (consigné 2026-08-17, rien n'est commencé)

⛔ **État réel vérifié** : **AUCUNE recherche FMI n'existe.** Le sujet n'apparaît que comme EXEMPLE dans
des doctrines, plus un composant R&D `src/projects/_rnd/svg-scenes/DetteFmiMecanismeSVG.tsx` (test, pas
un acquis). **La phase A entière est à faire.** Ne pas croire qu'on a de l'avance.

**Faire le tout PROPREMENT = suivre [[RECHERCHE-PRESCRIPT-UNIFIEE]] de bout en bout** (9 étapes,
3 phases). Ne PAS sauter directement à l'écriture — c'est la leçon racine déjà documentée dans cette
doctrine (§ « pourquoi j'ai sauté des étapes »).

**PHASE A — valider le sujet (étapes 0-6)** → [[SUJET-PRIME-SUR-PRODUCTION]]
- 1 **TubeLab** (566 crédits) · 2 **`last30days`** ⚠️ *jamais TubeLab sans lui* · 3 **yt-dlp**
  transcripts + TOP COMMENTAIRES (gratuit — mine d'or à angle)
- ⛔ **Croiser 2 seeds** (leçon n°0 : un seed unique pollue tout le résultat)
- 4 synthèse angle · 5 verdict GO/NO-GO · 6 **étoile polaire de positionnement**
- ⭐ **Point de départ déjà acquis (session 2026-08-17)** : la demande est PROUVÉE — Hidden Capital fait
  **805 K vues** dont la dernière partie porte sur la dette africaine (53 pays qui paient plus en dette
  qu'en santé, Zambie, Sri Lanka, Djibouti à 77 % du PIB). **Le sujet n'a pas de problème de demande.**
  Reste à trouver NOTRE angle, pas à prouver le sujet.

**PHASE B — écrire (étape 7)**, précédée de **6 bis : choisir la forme narrative** → [[FORMES-NARRATIVES]]
- ⭐ **Reco de forme : n°2 « la question que personne ne résout »** — la mieux étayée du corpus pour ce
  sujet (2 chaînes, la même question sur ce terrain exact, 1,5 M de vues cumulées). Condition remplie :
  la question est déjà dans la tête du spectateur.
- ⚠️ **NE PAS prendre la forme 3 (révision du récit officiel)** ici : plus puissante mais elle glisse
  très vite vers « on vous cache la vérité » sur le FMI. Le doublet Lorenzana (823 likes complotistes)
  vs Hidden Capital (question de fond) est la démonstration du risque.
- ⛔⛔ **LE VRAI RISQUE DU SUJET — machine à chiffres abstraits.** La forme ne sauvera rien seule. 3 points
  non négociables : (1) **incarner chaque chiffre dans un corps** (l'équivalent des ingénieurs grecs
  devenus chauffeurs Uber) · (2) **une métaphore physique unique tenue 10 min** à la place des graphiques
  · (3) **rester sur le MÉCANISME**, jamais sur les intentions cachées.
- 🚦 Le gate `forme-narrative-gate.sh` bloquera la création du fichier de script sans `FORME:` — c'est voulu.

**PHASE C — blinder (étapes 8-9)** : jury créatif **PUIS** fact-check (ordre inversé prouvé sur Gazoduc).

**Livrable visé : SCRIPT SEULEMENT, zéro production.** Le FMI est le premier test de la méthode.
⭐ **Le FMI est le terrain d'essai idéal de l'échelle humaine** : sujet 100 % chiffres abstraits, sans
matière visuelle ni personnage. Si le geste ne se prouve pas là, il ne se prouve nulle part.

### ⭐⭐ ÉCHELLE HUMAINE — pourquoi c'est rattaché ici et pas un chantier à part (2026-08-17)

**Le constat** : c'est le **trou n°1** du catalogue des moteurs visuels (`MOTEURS-VISUELS-ET-SOCLE.md`,
convergence de plusieurs voix) — *« rien ne rapporte un chiffre à une expérience vécue »*. Il n'était
cadré dans AUCUNE session : simple note passive dans 2 fichiers, donc rien ne le déclenchait.

⛔ **Ce N'EST PAS un trou de doctrine script — vérifié le 2026-08-17.** La règle existe et elle est
déjà concrète : `DOCTRINE-SCRIPT-UNIFIEE.md` **Règle 7** porte une table de traduction
(« 20 GWh/an » → « de quoi équiper 300 000 voitures par an »). `DECODE-INFOGRAPHICS-SHOW.md` la
formule 2× (« chiffre toujours converti, jamais nu »). **C'est un trou d'APPLICATION, pas d'écriture** —
le pattern exact de [[feedback_regle-ecrite-insuffisante-sans-gate-outille]].

**Les 2 questions ouvertes que la session doit trancher (ne pas les préjuger)** :
1. **Fréquence** — la Règle 7 dit *quoi* traduire, jamais *à quelle cadence*. Un chiffre traduit toutes
   les 3 min ne tient pas une minute 1→3. C'est ce que la mesure du temps 2 doit donner.
2. **Statut** — la Règle 7 vit en section **A. CLARTÉ** (confort de lecture). Si la mesure montre que
   c'est un levier de **rétention**, elle doit remonter en section **C**. ⛔ Ne PAS déplacer avant
   d'avoir la mesure : on ne réorganise pas une doctrine sur une intuition.

**Au-delà du script** : le trou reste aussi VISUEL (aucun composant ne porte le geste — silhouette
d'échelle, comparaison corporelle, destinataire). Traitement séparé et PLUS TARD : **1 prototype sur
une scène réelle, jamais une abstraction générique** (règle projet : ne pas généraliser sur un seul cas).

### 📌 CAS DE RÉFÉRENCE À ÉTUDIER EN PREMIER (analysé le 2026-08-17)

**Adam Ivy — « Most Of You Will Never Get Monetized Now | YouTube Monetization Update »**
→ https://youtu.be/klYbu-sVWFA · chaîne : https://www.youtube.com/@TheAdamIvy
⭐ **Regarder la vidéo et lire les commentaires soi-même** — ce résumé ne remplace pas le visionnage
(demande explicite d'Aziz : « en regardant la vidéo, on en saura beaucoup mieux que n'importe quel résumé »).

**Chiffres (4 jours après publication)** : 11 785 vues · 657 likes · **601 commentaires (5,1 %)**.
Nos vidéos : **0 %**. C'est l'écart le plus violent mesuré dans toute la session.

⛔ **Le fait le plus important** : sa production est **inférieure à la nôtre**. Un homme assis qui
parle 9 min face caméra, zéro animation/carte/graphique, des hésitations dans le transcript, et un
**bug audio de désynchronisation** (42 likes sur le commentaire qui le signale). Il fait 11 785 vues
avec une vidéo techniquement défaillante. **La qualité de production n'est pas la variable.**

**Structure de titre `Accroche | Mot-clé cherchable`** — ⛔ **NE PAS la voler telle quelle.**
« Most Of You Will Never Get Monetized Now **| YouTube Monetization Update** » obtient la tension ET
l'indexation… mais ⚠️ **correction d'Aziz (2026-08-17)** : il n'utilise cette structure QUE parce que
son accroche ne contient **aucun** mot cherchable (ni « YouTube », ni « monétisation ») — la barre
**compense un manque propre à sa phrase**. C'est une rustine, pas un modèle. Aziz : « je n'ai jamais
vu personne mettre le mot-clé à la toute fin, ce n'est pas du SEO traditionnel ».
→ Nos titres du patron « créer le manque » portent **déjà** le mot-clé dans l'accroche (« La guerre
**au Soudan** n'a aucune raison de s'arrêter ») : y ajouter « | Soudan » serait redondant et
violerait la règle 8 (§3 PACKAGING-YOUTUBE). Vérifier au cas par cas si notre accroche manque
d'ancrage AVANT d'envisager cette forme.
⭐ Leçon de méthode générale tirée de ce raté :
[[feedback_generaliser-un-seul-cas-isoler-la-condition-pas-juste-l-effet]].

**Le titre tient sa promesse en s'y opposant** : titre = panique maximale ; contenu = « take a
breath, nobody is getting removed tomorrow ». Tension à l'entrée, apaisement raisonné à l'intérieur.

#### Les 5 mécanismes qui tiennent le spectateur pendant la partie explicative

1. ⭐⭐ **OUVRIR SUR UNE PERSONNE, PAS SUR UN SUJET.** « J'ai eu une cliente qui m'a écrit ce matin,
   elle était sincèrement bouleversée. » Un humain avec une émotion AVANT toute donnée.
   Notre CFA ouvre sur « des millions d'Africains » = une abstraction. **Une personne bat un million
   de personnes.** ⚠️ Nuance d'Aziz : **à utiliser avec parcimonie**, parfois ouvrir sur le sujet
   reste meilleur. Le principe réel derrière : le spectateur qui clique est déjà dans un état
   (énervé, curieux, inquiet) — lui montrer quelqu'un dans CE MÊME état le fait se reconnaître
   immédiatement, au lieu de recevoir un cours magistral.
2. ⭐⭐⭐ **RENDRE LES CHIFFRES RÉELS ET INCARNÉS.** Il expose SON revenu : « 12 000 heures de
   visionnage en 28 jours → 858 $ ». Risqué, et c'est ce qui rend tout le reste crédible.
   **Position d'Aziz, à appliquer au-delà du choix de format** : « tout le monde s'en fout si on ne
   peut pas le voir, l'imaginer, et surtout si ça n'a pas d'effet réel ». **C'est un de nos gros
   problèmes passés** — et le risque n°1 du sujet **FMI**, qui est une machine à chiffres abstraits.
   Aucun graphisme ne sauve un chiffre auquel on ne peut pas se rattacher.
3. **QUESTION RHÉTORIQUE QUI RELANCE.** « La ligne d'arrivée d'une course que tu ne cours pas, ça
   change quoi ? » → le spectateur répond mentalement, donc reste ACTIF au lieu d'écouter passivement.
   ⚠️ **Le plus difficile à transposer chez nous** (voix off, pas d'humain à l'écran) : risque de
   sonner robotique. Piste d'Aziz : s'en servir pour **annoncer ce qui vient sans y basculer** —
   activer le cerveau à la charnière entre deux parties, là où on retombe d'habitude en cours magistral.
4. **TRAITER L'OBJECTION AVANT QU'ELLE ARRIVE.** « Il y a un contre-argument valide, je veux le
   partager avant que vous me hurliez dessus dans les commentaires. » Désamorce ET invite en même
   temps. ⚠️ Chez lui ça passe par une adresse directe au spectateur (4e mur) — chez nous, trouver
   la forme équivalente, et surtout **le placer au bon endroit**, organiquement.
5. **PRENDRE UN RISQUE D'OPINION.** « C'est là que je vais en perdre certains d'entre vous. »
   Résultat : 4 des commentaires les plus likés sont des **désaccords argumentés** de créateurs
   d'animation. **Le désaccord est du carburant** ; une nuance parfaite ne donne à personne une
   raison d'écrire.
   ⭐ **Comment il le fait sans prendre parti** (vérifié dans le transcript, question d'Aziz) — il
   sépare visiblement trois niveaux : (a) un **mécanisme expliqué** = le *pool* AdSense (« l'argent
   des annonceurs va dans un bassin, chaque chaîne y boit ; ajoutez des centaines de milliers de
   chaînes, le verre de chacun rétrécit ») — c'est lui qui porte l'argument ; (b) des **chiffres
   officiels YouTube** (200 Md de vues Shorts/jour, 1 Md d'heures sur TV) ; (c) une **opinion
   attribuée et distanciée** (« Dylan's words, and I'm quoting him » + « je ne suis pas assez naïf
   pour croire que vous serez tous d'accord »). **Il ne prend pas parti — il rend le désaccord
   possible.** C'est pour ça qu'on lui répond avec des arguments et non avec de la colère.
   → Cohérent avec notre charte déjà modifiée : **la neutralité absolue est une illusion**.

#### 🔍 Son commentaire épinglé — remet notre gabarit en question
> « How many watch hours do you actually have right now? **Drop the real number below, no rounding
> up**, and tell me if this update changed anything about your plan. » (11 likes)

Il ne demande PAS une opinion — il demande **une donnée personnelle précise**. Beaucoup plus facile
à honorer qu'un « vous en pensez quoi ? », parce que chacun connaît déjà sa réponse et n'a pas à
fabriquer un avis.
→ ⚠️ **Piste à TESTER contre notre gabarit du §6 de PACKAGING-YOUTUBE, pas à substituer d'office** :
un seul cas observé. Aziz : « on y arrive quand même avec les commentaires qu'on a choisis, mais
il y a peut-être lieu à amélioration. »

### ⛔ Corrections factuelles à ne pas reperdre
- **PixelLab ≠ outil de recherche YouTube.** C'est notre générateur de pixel art (sprites, tilesets).
  L'outil de recherche est **TubeLab**. Confusion faite 2× le 2026-08-17.
  ⭐ **CAUSE IDENTIFIÉE (2026-08-17, Aziz)** : c'est la **dictée vocale** qui transcrit « TubeLab » en
  « PixelLab » — pas une erreur de raisonnement. → Quand Aziz écrit « PixelLab » dans un contexte de
  recherche YouTube/formats/outliers, lire **TubeLab** sans demander confirmation.
- **Aucun achat d'outil nécessaire** (1of10 / ViewStats / Spotter Studio) : TubeLab + vidIQ suffisent.
- **Compte réel des vidéos** : 3 longues PUBLIÉES (Sénégal, AES, CFA) + Soudan (sort le 20/08) +
  Gazoduc (en cours) = 5. Le FMI n'existe pas encore.
- **FMI** : ⛔ ne PAS le lancer dans le moule actuel. Le sujet est excellent — le problème serait de
  le produire AVANT d'avoir choisi son format. Il devient le premier test de la méthode.
- Le concept « niche bending » = **niche = MARCHÉ + FORMAT**, on transplante un format éprouvé
  ailleurs sur son propre marché. ⚠️ L'écosystème autour du terme est saturé de vendeurs de formation
  « chaîne faceless à 10 000 $/mois » : le concept est bon, l'emballage marketing est du bruit.

→ Socle de cette session : **[PACKAGING-YOUTUBE.md](memory/doctrines/PACKAGING-YOUTUBE.md)** (le
packaging AVANT publication) · **[DIAGNOSTIC-FLOP-VIDEO.md](memory/doctrines/DIAGNOSTIC-FLOP-VIDEO.md)**
(la mesure APRÈS — c'est lui qui donne la rétention seconde-par-seconde).

---

## 🎬 Showcase des capacités — VIRAGE : source = production vivante publiée (2026-08-15 soir)

⛔ **L'arbitrage des 2 planches-contact est ANNULÉ** — ne PAS le redemander à Aziz. Les 53 templates
sont **archivés** (consultables, pas supprimés) : ils ne sont plus la source de la showcase (« des
templates qui défilent sans intention ne veulent rien dire »). Nouvelle source = **production vivante
publiée** (Sénégal, Soudan, AES, CFA, Gazoduc Actes 1-2 ; ⛔ Acte 3 exclu, gelé non validé).
⏭️ **PROCHAINE ACTION = écrire la CHARTE DE DA** (palette 4 couleurs + 1 typo + fond en dégradé
vivant à halos au lieu d'aplat `#16213a`) — ~1/2 journée, ⛔ **zéro composant neuf à coder**. C'est le
chaînon manquant du cut vente, identifié par le benchmark de 3 références Fiverr. Ensuite seulement :
déroulé (ordre/durée/musique) → index interne 3-4 min → cut vente 60-90 s.
→ **[SHOWCASE-CAPACITES.md](memory/projects/SHOWCASE-CAPACITES.md)** (§ Benchmark ÉLARGI + § CE QUI
MANQUE VRAIMENT) · **[planche-contact = archive](memory/projects/SHOWCASE-PLANCHE-CONTACT.md)**

## 💼 GIG FIVERR ENTRÉE DE GAMME (2026-08-12/13)

Page validée par Aziz (`freelance-linkedin/GIG-PAGE-VALIDEE.md`), persona solo founder/startup.
Reste ouvert : prix réels, nom commercial, portfolio de démo. Détail :
`freelance-linkedin/BRIEF-GIG-ENTREE-DE-GAMME.md` § "Ce qui reste à trancher".

---

## ⭐ KORA & CARTES — 2 pistes de sujet en exploration (2026-08-12/13)

Piste A retenue : "pourquoi l'Afrique évolue / pays qui montent" (entrepreneuriat, démographie) —
relancer SUJET-PRIME 6 étapes dessus en priorité. Piste B (FMI/dette) : angle + squelette narratif
posés ("comment une dette remboursée peut ne jamais diminuer ?"), décision en suspens = script direct
OU fact-check du chiffre-choc d'abord. Diagnostic flop Short CFA CLOS (miniature illisible, fixé).
Détail complet des 3 : `projects/EXPLORATION-DIVERSIFICATION-CHAINES.md` § sessions 2026-08-12 et 2026-08-12/13.

**⭐⭐ Piste Poster Vector/Whiteboard Doodle pour Kora & Cartes — 2 styles VALIDÉS sur mythe Anansi, dialogue+animation OK (2026-08-13)**
Test complet mené sur le mythe Anansi/Nyame (Akan/Ghana, pacte des histoires du monde — angle
"ruse > force pour capturer la valeur", mythologie africaine pure retenue vs piste A/pays-qui-montent).
2 styles H3 VALIDÉS bout en bout par Aziz, chacun en V2 corrigée (dialogue FR propre + geste
animé + upscale 1080p sans passer par le 720p) : **Poster Vector** (flat vector, orbite dorée continue)
et **Whiteboard Doodle** (couleur sélective jaune/bleu choisie spontanément par le modèle, très
appréciée par Aziz — comparable à notre pratique SVG maison). Défaut résiduel (œil qui semblait
"morphé" en 480p) confirmé être un simple artefact de basse résolution, réglé par l'upscale — pas un
vrai défaut H3. Détail technique complet + prompts reproductibles + syntaxe dialogue validée :
`tools/minimax-h3-styles-tests.md`. Assets : `episodes/_rnd/kora-cartes-mythologie/tests-visuels/`.
(ces tests du 2026-08-13 utilisaient le format 6-sections, depuis remplacé par le format officiel
H3-Base — voir `tools/minimax-h3-styles-tests.md` § "FORMAT DE PROMPT OFFICIEL" avant de reproduire
cette méthode sur un nouveau sujet).
**Reste ouvert** : décision de format (insert dans vidéo Mapbox/D3 existante vs vidéo complète) — pas
encore tranché, sujet pas encore choisi non plus (piste A "pays qui montent" vs mythe reste à trancher).

**⭐⭐ SVG codé direct (Fable5 mode MAX, sans jury LLM) — VALIDÉ sur 2 cas distincts, méthode fiable (2026-08-13)**
Hypothèse d'Aziz confirmée deux fois : un agent Claude en mode MAX, codant DIRECTEMENT en SVG en
observant une image de référence Gemini (zéro appel API externe, zéro jury), produit un résultat au
niveau ou au-dessus de la référence — ET produit des groupes SVG adressables/animables (avantage net
sur une image figée). **Cas 1** (scène dette/FMI, objets fabriqués simples — piles de billets,
factures, flèches, pièces) : réussi, mais géographie réelle (continent Afrique) a échoué 2× à main
levée avant de pivoter vers de vraies données `d3-geo`/Natural Earth — **jamais dessiner un contour de
pays à l'œil, même dans une scène par ailleurs simple**, règle confirmée sur ce 2e cas aussi. **Cas 2**
(décor complet aéroport Niamey Gazoduc Acte 3 — architecture + atmosphère nocturne + lumières
multiples, PAS juste des objets simples) : jugé par Aziz supérieur au décor existant, **action directe
prise** — voir bloc GAZODUC ci-dessous. Composants sources : `src/projects/_rnd/svg-scenes/
DetteFmiMecanismeSVG.tsx` + `GazoducAeroportFable5Test.tsx`. Réserve d'Aziz : pas encore un pilier
du workflow, à retester sur plusieurs styles/registres dans une session dédiée avant de généraliser
davantage — mais déjà utilisable au cas par cas dès maintenant (2 preuves suffisantes pour un test
ponctuel, pas encore pour une automatisation).

**⭐⭐⭐ Storyboard cartographique multi-modèles (Gemini+GPT) — méthode NOUVELLE, documentée, 1er usage réel en cours (2026-08-13)**
Découverte majeure de session : un DA-brief textuel seul (3 voix, `da-brief.py`) ne suffit PAS à éviter
un rendu de carte plat — le storyboard VISUEL reste nécessaire même après un brief écrit soigné (constat
direct d'Aziz sur l'Acte 3 Gazoduc, "tracés plats qui ne représentent pas grand-chose" malgré 3 DA-briefs
déjà faits). Méthode découverte et validée : donner à Gemini/GPT une frame réelle de NOTRE carte +
nos capacités techniques listées explicitement + le texte du script + des références de chaînes connues
(Vox Atlas "montrer le terrain", discipline Kurzgesagt "peu d'éléments bien timés") → 3 concepts
DISTINCTS (1 image = 1 concept, jamais un montage multi-concepts en une image basse résolution) →
Aziz choisit/mix-and-match les meilleures idées → Claude écrit directement le breakdown de fusion
(pas de 3e aller-retour image). **Verdict comparatif GPT Image 2 vs Gemini** : GPT supérieur pour ce
type de storyboard annoté (français propre, annotations caméra réalisateur explicites et utiles —
ne PAS les brider, les encourager explicitement dans le prompt). Doctrine complète mise à jour :
`doctrines/STORYBOARD-MAPBOX.md` § "EXTENSION D3 + VERDICT GPT vs GEMINI" (2026-08-13) — **à proposer
systématiquement dès qu'une scène carte D3/Mapbox est jugée plate/statique**, référencé dans ROUTAGE.md.

---

## ⭐⭐ NOUVELLE CHAÎNE CANADA EN — test PIPELINE en cours (2026-08-14)

Marché EN validé (TubeLab, RPM jusqu'à 20$+). Script V3 FR validé jury 4 LLM. **3 styles H3 validés**
(Hand Drawn, Poster Vector narratif + Poster Vector SaaS/logo/scène-2-personnages) + **format de prompt
H3 officiel découvert et adopté par défaut** (l'ancien format 6-sections n'était pas le vrai format
documenté) — détail `tools/minimax-h3-styles-tests.md` § "FORMAT DE PROMPT OFFICIEL". Reste à tester :
Whiteboard Doodle. Décision à prendre : scène Mapbox réelle ou assembler la 1ère scène complète.
Détail : `episodes/_rnd/canada-red-bay/STATUS.md`.

---

## ⚠️ MiniMax H3 — défaut racine non résolu, contournement prouvé (2026-08-10/12)

Scène multi-personnages dense (3+, contact physique) : écran noir/personnage disparaît, **toujours NON
résolu** — seuil de délégation agent dédié atteint et non déclenché. Contournement PROUVÉ : 2
personnages max, zéro contact croisé (4 clips testés, succès complet). Guide de prompting officiel +
storyboard multi-panneaux également testés. Détail complet : `tools/minimax-h3-comfy-cloud.md`.

---

## ⭐⭐⭐ GAZODUC — ACTE 3 EN COURS, 2 SEGMENTS SUR 3 FAITS (2026-08-18)

**Actes 1, 2, 4, 5 : FINAUX.** L'Acte 3 est le dernier en chantier, et il a été DÉBLOQUÉ le 18/08
après des semaines de gel.

| Segment | État |
|---|---|
| A / Beats 1-2 (0→55 s) | ⭐ **débloqué, à faire valider** — `versions/acte3-segmentA-beats12-V3.mp4` |
| A / Beat 3 (55→72,3 s) | ⏭️ **PROCHAINE ACTION** — spec V5 complète, codée à moitié |
| B (73,9→105,8 s) | ⏭️ porter l'animation sur le décor Fable 5 |
| C (105,8→123,1 s) | ✅ **FINAL** — `acte3-segmentC-verrou-FINAL.mp4` |

**⏭️ PAR QUOI REPRENDRE — le Beat 3 (panneau financement).** C'est le morceau le plus prêt : la spec
existe au pixel près dans `breakdown-v5-json/beat3-breakdown.json`, aucune décision de goût à prendre,
l'image-cible a déjà été montrée à Aziz. Manquent la banque barrée DANS le panneau, le trio
ALGÉRIE → vanne ← NIGERIA, et les cylindres comparatifs. Détail : STATUS.md § ACTE 3.

⛔ **NE PAS ressortir la TRANCHÉE** (codée puis retirée le 18/08) : le script ne parle jamais de
creusement, et c'est MON brief qui l'avait soufflée aux modèles.
⛔ **NE PAS prolonger la rupture plein écran** au-delà de 155 frames : le clip ne boucle pas.
⛔ **NE PAS remettre l'encart Adrar après la rupture** : décision d'Aziz, ce serait une redite.

**Reste ensuite** : assemblage de l'Acte 4 (3 fichiers, 300 ms de marges à rogner, filtre
`concat=n=N:v=1:a=0`) · CTA de fin (jamais commencé, ⛔ pas d'interpellation directe) · passe finale
en palette sombre `PAL_GPT` pour les Actes 1/2/3, ⛔ PAS acte par acte.

⭐ **MÉTHODE STORYBOARD REFONDUE cette session** (`memory/fiches/FICHE-STORYBOARD.md`) : audit du
brief par un modèle tiers OBLIGATOIRE · 3 modèles dessinateurs (Grok/GPT/Gemini), 1 appel chacun,
2 concepts par planche · le modèle pose un LISERÉ au lieu d'écrire · description case-par-case
demandée APRÈS le choix, au modèle qui a dessiné. Testée le 18/08 : marche sur Grok et Gemini,
GPT a rendu une planche inexploitable (à corriger en imposant « 4 colonnes par rangée »).

---

## 🔧 BACKLOG — Studio réutilisable (Mécanisme 1 Gardien, pas urgent)

Mécanisme 2 (Extracteur) codé et validé (~30 briques indexées) — détail `doctrines/STUDIO-REUTILISABLE-GATE.md`.
Mécanisme 1 (Gardien) : pas codé, volontairement — à réévaluer si besoin, rien d'urgent.
⚠️ **Dette CTA Short CFA** : worktree `remotion-cfa` (`feat/cfa-short-9x16`) jamais mergé, `SceneCta.tsx:152`
dit encore "EN DESCRIPTION" alors que le rendu publié a été patché en aval par splice ffmpeg direct sur
le fichier final — le fix n'est PAS dans la source. À trancher : appliquer le fix dans la source (resync)
ou fermer le worktree si le repo principal fait foi. Un futur re-render depuis ce worktree réintroduirait le bug.

---

## 📤 PUBLICATION

> ⭐⭐ La chaîne publie. Calendrier détaillé + IDs de posts + interdits :
> `/Users/clawdbot/.claude/projects/-Users-clawdbot-Workspace-remotion/memory/calendrier-publication-2026-08.md`
> (source de vérité unique — ce fichier-ci ne recopie plus l'état, qui périme trop vite).
>
> ⏭️ **Prochaine action** : construire le Short Soudan (boucle NotebookLM, scripts déjà présents dans
> `scripts/tools/soudan-short-audio/`) — dernier Short manquant du calendrier. Puis GAZODUC.
> Outils : `scripts/tools/jury-titres-llm.py` · `scripts/tools/jury-thumbnail-llm.py` · ROUTAGE.md § « Publier ».

---

## ✅ AES — ABANDONNÉ VOLONTAIREMENT (décision Aziz 2026-08-17). PAS une dette.

⛔ **Ne plus le proposer en début de session, ne plus le compter dans le reste-à-faire.**
La refonte V6 (script découpé/tagué/généré, audio validé, retiming vérifié) ne sera PAS assemblée
ni republiée. **Raison, et c'est elle qui généralise** : l'échec à 5 vues/24h est un problème de
TITRE / MINIATURE / SUJET, pas de production. Republier une version améliorée sur une vidéo morte
ne rachète pas la distribution — l'historique de non-distribution reste attaché à la vidéo.
✅ Ce qui reste utile : le **script V6 comme gold-standard de script dense** (pointeur conservé dans
`ROUTAGE.md`), et les leçons de production, qui partent dans les prochaines vidéos.
Détail historique : `episodes/warmap-sahel/STATUS.md`.

---

## 1. Maroc Batteries Short — reste A5 Géographie + assemblage

⚠️ L'état « A5 = STUB » est FAUX (`Beat4Geographie.tsx` fait 417 lignes, Mapbox complet, vérifié
2026-07-30). Les 5 autres beats sont FINAUX. RENDRE ET REGARDER avant de conclure quoi que ce soit.
Starter (à revérifier) : `archive/starters-perimes-2026-06-15/STARTER-PROMPT-maroc-a5-geographie.md`.

---

## ⏳ ACTIONS OUVERTES

### Recharger le crédit OpenAI
Quota épuisé le 2026-07-25 (`429 insufficient_quota`). Bloque `whisper-align.py`/`transcribe-openai.py`.
Contournement en place : `scripts/tools/forced-align.py` (ElevenLabs).

### Activer les routines /schedule — NON FAIT, rappeler à Aziz
Re-signaler en début de session jusqu'à confirmation. 2 routines cloud Postiz (Aziz les crée lui-même) :
`/schedule jeudi 9h ... postiz-weekly-check.py` · `/schedule samedi 10h ... postiz-weekly-report.py`.
Ajouter `POSTIZ_API_KEY` en env. **Quand Aziz confirme → supprimer cette section.**

### Audit des skills du workspace — demandé le 2026-07-11, jamais fait
88 dossiers sous `~/.claude/skills/` (global), suspicion de redondance. Cadrage : génériques vs
spécifiques Remotion, traces d'usage réel, doublons fonctionnels, agents-vierges-en-parallèle.

---

## 💡 BACKLOG (rien d'actif — ne pas lancer sans décision d'Aziz)

- **Carrousel « Good News »** — pipeline prêt, jamais relancé : `python3 scripts/prepare-goodnews-weekly.py`.
- **Carousels Instagram** — Or Africain + Thiaroye prêts, Mansa Moussa à refaire. Reco : Sénégal Pétrole.
- **Système hook + CTA commentaire** — checklist hook 20s + template CTA 30-60s, jamais construits.
- **Xénophobie SA** — angle validé (« double face »), données 2026 intégrées. Gate : demande TubeLab.
  Dossier : `episodes/souverain/xenophobie-sa-EXPLORATION/`.
- **Pipeline Shorts automatisé trending** — pas maintenant, revenir quand le long format est en place.
- **Peste 1347 mid-form horizontal** — concept validé, backlog après AES + Maroc Batteries.
  Fiche : `projects/peste-1347-midform.md`. 2 chantiers actés (narration voix vivante, multi-agent
  post-fix) : `episodes/peste-1347/STATUS.md`.
- ~~**`GeoFlowConnection`** — « à coder au 1er sujet à flux »~~ ⛔ **LIGNE PÉRIMÉE, retirée 2026-08-15** :
  le composant EXISTE et est **publié** (Soudan Actes 3/4/5 + `SoudanWarMapEngine`, vérifié par grep).
  ⚠️ Attention, **DEUX** fichiers portent ce nom, contrats opposés : `warmap/_shared/` = marqueur nu
  (publié) · `_shared/mapbox/` = sprite orienté (dormant). Détail : `INTENTION-FORME-INDEX.md`.
- **Patterns `_reference-atlas-poc/` non portés** : `AtlasParcheminGlobe.tsx` · `AnimatedCaravan.tsx` ·
  `atlas-parchemin-mande.json`.
- **Vox Papercraft** — pipeline officialisé (`doctrines/REVERSE-STYLE-VIDEO-VERS-ASSETS.md`). Reste :
  halo détourage, retirer noms d'États, photo halftone, séquence multi-plans.
- **R&D D3 16:9** — moteur agnostique ratio, prouvé sur Soudan. Backlog : sol enrichi, globe 2.0,
  data-viz cartographique, flux `d3-force`/`d3-chord`, HUD tactique. Détail : `_rnd/d3-16x9/README.md`.
- **Seedance personnage** — technique prouvée mais ÉCARTÉE (coût ~6.85$/clip). SVG reste la voie par défaut.

---

## Regles de mise a jour de ce fichier

Claude met a jour ce fichier en FIN DE SESSION quand :
- Un projet change de statut (termine, bloque, decision prise)
- Une nouvelle decision technique est arretee
- L'ordre des priorites change

**Format : 3 lignes max par projet** (Etat / Decision en attente / Recommandation).

⛔ **Un projet TERMINÉ se SUPPRIME de ce fichier** — son état vit dans `memory/episodes/<ep>/STATUS.md`
et sa publication dans le calendrier. Ne jamais garder de « trace historique » ici : git la conserve.
Ce fichier a déjà dépassé 116 Ko (juillet) puis 26,5 Ko (août) faute d'appliquer cette règle en continu.
