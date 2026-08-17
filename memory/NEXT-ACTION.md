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
Machine à Guerre écartée. Détail + titres écartés : `out/PRET-PUBLICATION/soudan-midform-FINAL.PUBLICATION-NOTE.md`.

⏭️ **À RELEVER À J+3 ET J+7** (point de départ : CFA 48 vues / 0 comm. · Sénégal 93 / 0 · AES 42 / 0) —
outil et méthode : `memory/doctrines/DIAGNOSTIC-FLOP-VIDEO.md` (`vidiq_channel_analytics` donne
impressions, CTR et rétention seconde-par-seconde). ⚠️ Si le CTR ne bouge pas après 7 jours, le
levier suivant est la **miniature**, pas un nouveau titre — ne pas re-titrer en boucle.
⚠️ Deux variables changent en même temps (CFA re-titré ET Soudan qui sort) : ne pas attribuer trop
vite un effet à une seule cause.

---

## ⭐⭐⭐ PROCHAINE SESSION — EXPLORATION DES FORMATS NARRATIFS (décidé 2026-08-17)

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
3. **FORMALISER** — un **registre de formats** (sur le modèle du registre des moteurs visuels), plus
   une **étape de choix explicite insérée dans le pipeline, entre le sujet et le script**.

**Livrable concret** : appliquer un format choisi au sujet **FMI**, en SCRIPT SEULEMENT, zéro production.

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

## ⭐⭐⭐ GAZODUC — ACTES 4 ET 5 FINAUX. PROCHAINE ACTION = ACTE 3 (2026-08-17)

**Acte 5 FINAL** (dernier acte de l'épisode) : `out/episodes/gazoduc-aagp-tsgp/acte5-FINAL.mp4`
(46,17s / 1385 frames / 4 segments), commit `2dc1464c`. Breakdown : `breakdown-acte5/`.
Acte 4 : les 3 mouvements A/B/C sont FINAUX (voir STATUS pour le détail des décisions de goût).

**⏭️ PRIORITÉ 1 = ACTE 3** — c'est le SEUL acte non validé, le dernier morceau manquant.
Le gel du 2026-08-14 est **LEVÉ** : sa condition était « produire les Actes 4 et 5 d'abord » (un acte
du milieu se juge par rapport à ses voisins) — c'est fait. Voir la section Acte 3 ci-dessous pour
l'état gelé mesuré et les acquis à ne pas refaire.

**⚠️ Acte 4 NON ASSEMBLÉ** : 3 fichiers séparés (A 41,45s + B 33,40s + C 49,83s = 124,68s cumulées
pour 124,04s d'audio). Les marges de sécurité de 300ms se cumulent → à rogner au montage.
⛔ Assembler avec le FILTRE `concat=n=N:v=1:a=0`, jamais `-f concat` par liste (cf `tools/remotion.md`).

**🆕 CTA DE FIN — chantier ouvert, non commencé.** L'épisode s'arrête net sur « CREUSER ». Aziz :
il faut quelque chose, mais ⛔ **jamais d'interpellation directe du spectateur ni de « abonnez-vous »
frontal** — « de manière classe ». À trancher : nouvelle voix vs carton visuel discret.

⭐ Palette sombre `PAL_GPT` = Actes 4 et 5. Actes 1/2/3 re-rendus à la **passe finale**, ⛔ PAS acte par acte.

⛔ **Gate actif** : tout nouveau `.tsx` de scène doit déclarer `// MOTEUR: <registre> — <pourquoi>`
(`.claude/hooks/moteur-visuel-gate.sh`).

⚠️ **Décision de goût à ne pas défaire** : 4B v3 (arcs schématiques) a été PRÉFÉRÉE à v4 (géométrie
réelle Medgaz) — choix de LISIBILITÉ, pas un oubli d'exactitude.

⭐ **3 leçons de méthode de la session Acte 5** (détail : STATUS.md) :
1. **Renvoyer un SVG à son propre modèle** pour qu'il le prépare à l'animation (pièces séparées, axe
   documenté). Seuil : 2 essais infructueux sur un pivot → déléguer. Gain mesuré : 4 essais ratés
   remplacés par 1 appel juste (mon axe manuel était faux de 29px).
2. **Boucle d'amélioration** : renvoyer à un agent SON rendu + une cible enrichie.
3. **Concours SVG multi-modèles** (`svg-concours-vision.py`) — il n'y a PAS de meilleur modèle absolu,
   le classement s'inverse par élément → mix-and-match des groupes `<g id>`.

⛔⛔ **RÈGLE DE DÉCOUPAGE** (erreur commise 2× dans la même session, trouvée par Aziz les 2 fois) :
**une frontière de plan se pose APRÈS la fin d'un mot, jamais sur son ancre.** Le forced-align donne
`start` ET `end` — poser la coupe dans le SILENCE qui suit. Doctrine : `AUDIO-PAUSES-DETERMINISTES.md`.

⚠️ **Limite d'outil** : le détecteur d'immobilité (vignettes 320px) est aveugle aux mouvements lents
et localisés — 2 faux positifs consécutifs. Mesurer finement + REGARDER avant d'itérer sur son verdict.

## ⛔ GAZODUC — ACTE 3 : GEL LEVÉ, C'EST LA PRIORITÉ 1 (2026-08-17)

**Le gel du 2026-08-14 avait UNE condition : produire les Actes 4 et 5 d'abord**, pour qu'un acte du
milieu puisse se juger par rapport à ses voisins. **C'est fait** (4 et 5 FINAUX) → on peut rouvrir
l'Acte 3, et c'est la priorité 1. ⛔ Repartir de l'état gelé MESURÉ (ci-dessous), pas de zéro.
⚠️ Le motif du gel reste une leçon de méthode valable : un acte du milieu ne se juge pas dans le vide.

Raison structurelle (pas seulement de la fatigue) : un acte du milieu se juge par rapport à ses
voisins. L'Acte 3 est coincé entre un Acte 2 validé et des Actes 4/5 inexistants, donc sa fin se
juge dans le vide — le conflit de budget du Beat 4 (15.2s demandés vs 1.9s disponibles) en est la
preuve directe, et il se tranchera bien mieux une fois le climax de l'Acte 4 écrit.

État gelé complet (acquis + ce qui reste cassé, mesuré) : `episodes/souverain/gazoduc-aagp-tsgp/
STATUS.md` § "ACTE 3 — GELÉ EN WIP" (en tête de fichier). Rendu de référence :
`out/episodes/gazoduc-aagp-tsgp/versions/acte3-segmentA-suite-V12-WIP.mp4`.
Commit `9e302fb2` (`feat/gazoduc-acte1-hook-globe`).
✅ Le starter `memory/starters/STARTER-PROMPT-gazoduc-acte3-suite.md` est **RÉACTIVÉ** — son corps
(contraintes, protocole de vérification par mesure, briques) reste exact. ⛔ Seul son § final
« Après l'Acte 3 » est faux (il dit que 4 et 5 n'existent pas).

**Acquis à ne PAS refaire** : Beat 1 validé (caméra continue) · Beat 2 = vrai insert composé (clip H3,
jauge, badge, connecteur) — le principe de l'insert composé est le gain de ces sessions · Segment B
décor Fable5 porté.

⚠️ (Ligne périmée retirée le 2026-08-17 : elle disait « Actes 4 et 5 : rien n'existe » — les deux sont
FINAUX depuis. Leurs pics narratifs sont consommés : les 70% siphonnés sont dans 4A, le robinet est
devenu UNE vanne + bifurcation dans l'Acte 5, sans mains.)

**Leçon caméra (3 itérations perdues)** : un mouvement « par à-coups » n'est presque jamais un problème
de dosage. `easeInOut` appliqué PAR SEGMENT met la vitesse à exactement 0 à chaque point de passage.
**Mesurer la vitesse frame à frame avant de retoucher une valeur**, et chercher la brique existante
(le mécanisme continu était déjà dans l'Acte 2 validé + un prototype dédié).

(ARCHIVE — approche abandonnée, ne pas repartir dessus) Le rendu v2 et le plan de refonte v3 par 4 agents
vierges (`PLAN-ACTES2-5.md` § "TEST STUDIO RÉUTILISABLE") ont été DÉPASSÉS le 2026-08-14 : on repart
désormais du storyboard V5 + ses 4 breakdowns JSON, directement. Le v3 a été explicitement rejeté par
Aziz. Point de goût Segment B : tranché (décor Fable5 porté, fait).

Repère sujet : `projects/GAZODUC-MEGAPROJETS-SUJET.md`. Tests client-sim (Flowdesk/NorthShield/MOCH-IT)
TOUS CLOS, détail isolé `client-sim-tests/INDEX.md`.

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
