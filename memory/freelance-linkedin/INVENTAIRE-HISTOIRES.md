# Inventaire des histoires postables + chemin parcouru

> Extrait le 2026-07-29 par balayage archiviste de 157 fichiers de mémoire (73 feedbacks
> `.claude/.../memory/feedbacks/` + 38 `memory/feedbacks/` + 46 doctrines + racine).
> 30 histoires retenues sur ~157 fichiers lus. Stratégie : [STRATEGIE-LINKEDIN-FREELANCE.md](STRATEGIE-LINKEDIN-FREELANCE.md).
>
> ⚠️ **Ce fichier ne devient pas FAUX, il devient INCOMPLET.** Procédure de mise à jour en bas.

---

## PARTIE A — LE CHEMIN PARCOURU (mars → juillet 2026)

L'arc d'ensemble, et c'est l'histoire la plus forte du corpus :

> **Parti du génératif (Seedance, Vidu, Kling) en avril, convergé vers le déterministe en juillet —
> pas par idéologie, par accumulation de coûts mesurés.** La session du 2026-07-29 (analyse Higgsfield)
> a redécouvert de l'extérieur une question déjà tranchée en interne, avec preuves.

| Période | État | Le basculement |
|---|---|---|
| **Mars** | Outillage. Galerie Vercel Blob (review mobile par URL) | Le canal de validation d'Aziz naît |
| **Avril** | Ère générative. Seedance quad-modal, Motion Reference Transfer | **13 gates pré-API**, chacun né d'un dollar perdu nommément · refonte en 5 agents · pipeline carte d3-geo validé (12/04) |
| **Mai** | Doute sur l'outillage | **4 moteurs écartés avec motif daté** (Motion Canvas, Revideo, Shotstack/Creatomate, Theatre.js) · D3 en utility-only · fond 100% dark ABANDONNÉ (illisible mobile au soleil) · décision de ne pas copier le modèle hit-and-run IA |
| **Juin** | La carte devient vivante | **FlagFill** (10 templates, 45 drapeaux) · bataille multi-sprites sans Mapbox · bascule Shorts→**mid-form** · **DA-brief-gate** (modèles passent de l'aval à l'amont) · pipeline 3D maison (~0,07 $) · **INTENTION→FORME→TEMPLATE** devient doctrine · **le SVG devient un FORMAT** (25/06) |
| **Juillet** | Maturité | **Moteur globe D3 réutilisable** (19/07, « ouvre une voie qu'on n'avait pas ») · **Remotion requalifié en SOCLE** · moat nommé = déterminisme (20/07) · **pauses audio déterministes** (22/07) · **caméra SVG débloquée** (25/07) · **stick figure de profil qui marche** (26/07) · CFA mid-form complet validé · **partage à 3 étages** + hiérarchie figurant/héros (28/07) · **3 registres de scène** (29/07) |

Jalons les plus citables en post : les 13 gates · les 4 moteurs écartés avec date et condition de
réouverture · le SVG qui passe d'effet à format · le globe D3 · la caméra SVG.

---

## PARTIE B — LES HISTOIRES (classées par force)

Format : **Titre** · forme · accroche · diagnostic · règle · essais rejetés · source.
Les 3 premières sont DÉJÀ RÉDIGÉES (voir `CALENDRIER-EDITORIAL.md`) et exclues de ce classement.

### Les 10 plus fortes

**1. « Dessine ET anime » vs « dessine seulement »**
· *Découverte (expérience à variable isolée)*
· Accroche : deux fois la même tâche au même modèle, un seul mot de différence. Le résultat n'était
  pas un peu meilleur — il était d'une autre catégorie.
· Diagnostic : demander 2 compétences à la fois **dégrade activement** celle qu'on venait chercher.
  Chiffré : 939 lignes d'animation contre 459 de matière dessinée ; les 3 passes de correction toutes
  sur la mécanique, aucune sur le dessin.
· Règle : ne demandez jamais deux talents dans la même phrase — le second mange le premier.
· Rejetés : agent unique effort max (hangars = rectangles à nervures) · Fable en mode animation
  (~105k tokens, fichier pas écrit du 1er coup) vs Kimi K3 image-cible (~2k tokens, 0,035 $, 50 s) ·
  laisser un modèle produire un personnage animé (3 tentatives + 1 agent perdus)
· `memory/feedbacks/feedback_partage-decor-animation-personnages.md` · `doctrines/SVG-SCENES-GENERATIVES.md`

**2. Trois modèles d'IA étaient d'accord. Ils avaient tort.**
· *Erreur de méthode*
· Accroche : Gemini, Kimi et DeepSeek ont convergé spontanément sans se consulter. J'ai pris ça pour
  une preuve. C'était trois bonnes réponses à la mauvaise question.
· Diagnostic : les 3 avaient optimisé la FORCE de l'image, parce que le brief ne posait nulle part
  « compréhensible en 2 secondes » comme critère éliminatoire. La coupe géologique proposée exigeait
  5 conventions arbitraires à mémoriser.
· Règle : une convergence d'avis ne vaut que le critère qu'on a donné à mesurer — écrivez votre
  critère n°1 en toutes lettres avant de demander l'avis de qui que ce soit.
· Rejetés : la coupe verticale de terrain · le beat 6b v1 (« trop abstrait ») · faire juger un modèle
  qui a vu la vidéo entière → remplacé par le **test aveugle** (extrait 6-12 s, sans son ni script)
· `memory/feedbacks/feedback_convergence-modeles-vaut-le-critere-donne.md`

**3. La vidéo était figée 4 minutes. Toutes mes vérifications étaient vertes.**
· *Erreur de méthode*
· Accroche : images extraites à plusieurs endroits, toutes correctes. Durée correcte. Audio normal.
  L'image était gelée depuis quatre minutes.
· Diagnostic : une image isolée prouve que le contenu est plausible à cet instant, jamais que la vidéo
  BOUGE. Le signal réel était un warning « Non-monotonic DTS » noyé dans les logs.
· Règle : trois sondages réussis ne prouvent rien sur ce qui se passe entre eux.
· Rejetés : `ffmpeg -ss` frame unique comme preuve · concat *demuxer* → remplacé par concat *filtre*
  avec réencodage · `format=duration` (masque le bug) au lieu de `stream=nb_frames` · `tail | grep Error`
  qui rate le WARNING décisif
· `memory/feedbacks/feedback_verifier-mouvement-video-pas-juste-frames-isolees.md`

**4. J'ai évité une technique une session entière. Elle a marché du premier coup.**
· *Renoncement (à un renoncement)*
· Accroche : « trop compliqué », « surdimensionné ». Puis j'ai testé : ça a marché immédiatement — et
  5 fichiers du projet l'utilisaient déjà.
· Diagnostic : « mon incertitude était de la paresse non vérifiée ». Un jugement de goût déguisé en
  contrainte technique. Même schéma sur un outil réseau déclaré « bloqué » : vraie cause = IPv6 mort,
  20 min de diagnostic.
· Règle : aucun verdict d'impossibilité n'est valide sans un test minimal — méfiez-vous de votre
  propre vocabulaire d'alarme.
· Rejetés : `@remotion/three` évité toute une session · le CSS-3D perspective+rotateX (~65 % du
  résultat visé) qui servait d'alibi
· `memory/feedbacks/feedback_tester-avant-de-douter-gate.md`

**5. La démo virale annonçait une technologie qu'elle n'utilisait pas.**
· *Refus de catégorie*
· Accroche : une démo spectaculaire annonçait « 30 secondes, pur canvas ». J'ai conclu qu'il nous
  manquait un moteur. Aziz a insisté pour regarder les images intermédiaires : la techno était la nôtre.
· Diagnostic : raisonnement sur l'impression esthétique. Une pointe lumineuse qui court au bout du
  trait est la signature d'une technique de tracé SVG. L'écart réel = **3 finitions**, reproduites le
  jour même, sans aucune API.
· Règle : quand on se croit en retard sur un outil, l'écart est presque toujours une finition, jamais
  un moteur — regarder le mécanisme EN COURS, pas le résultat final.
· Rejetés : conclure « canvas » depuis l'esthétique · juger sur la frame finale · croire la techno
  annoncée par l'auteur · croire au « one-shot »
· `memory/feedbacks/feedback_demo-virale-verifier-substrat-avant-de-conclure.md`

**6. Le personnage glissait sur son fil. La solution était de le tourner de profil.**
· *Découverte*
· Accroche : mon funambule glissait au lieu de marcher. J'ai cherché dans l'articulation des genoux,
  dans la physique. Le problème était l'angle de vue.
· Diagnostic : vu de face, deux jambes ne peuvent que glisser — c'est géométrique, pas un défaut
  d'animation. De profil elles s'écartent en ciseau dans le plan de l'image. Et c'est PLUS SIMPLE.
· Règle : quand un mouvement sonne faux, changez l'angle avant d'ajouter de la complexité.
· Rejetés : le funambule de face · l'articulation genou/cheville (« c'est ce qui fait le pantin ») ·
  le verdict antérieur « personnage animé = pantin », requalifié
· `memory/feedbacks/feedback_stick-figure-profil-marche-capacite-debloquee.md`

**7. Le beat était techniquement irréprochable. Il était à jeter.**
· *Erreur de méthode*
· Accroche : images vérifiées, synchro audio au mot près, aucun gel, mixage par bande. Tout était vert.
  Le beat rejouait la carte du beat précédent, renommée.
· Diagnostic : la vérification technique complète peut être TOTALEMENT aveugle au défaut qui compte.
  3× dans la même session : la redondance invisible · la coupe géologique indéchiffrable · une
  « amélioration » (silhouette pleine) qui à 74 px refermait la posture et se lisait moins bien.
· Règle : partagez le travail selon ce que chacun peut voir — la machine sur la mécanique et la
  mémoire, l'humain sur le sens et la lisibilité. Le doute humain gagne par défaut.
· `memory/feedbacks/feedback_pourquoi-le-beat4-cfa-a-marche-repartition-jugement.md`

**8. Trois façons de poser un drapeau sur un pays. Deux échouent — sous conditions.**
· *Migration*
· Accroche : la 1re marche parfaitement… jusqu'à ce qu'on incline la caméra. La 2e jusqu'à ce qu'on
  dézoome. Aucune des deux ne le montre sur une image fixe.
· Diagnostic : une image plate dans un rectangle DÉRIVE dès que la carte s'incline ; un motif répété
  SE CARRELLE au dézoom. Invisibles sur frame isolée. Bonus : dans les données géo standard, « France »
  inclut Guadeloupe et Réunion → rectangle englobant de 117°, métropole minuscule, drapeau blanc.
· Règle : toute méthode de projection se juge en mouvement et aux extrêmes, jamais sur un cas moyen figé.
· Rejetés : `useClipFlags`/`MapboxFlagFill` (banni sur carte inclinée) · `fill-pattern` (carrelage) ·
  `drawFlagCanvas` (étoile du Maroc déformée, Chine en aplat rouge) · filtrage par nom au lieu du code
  ISO (bug silencieux sur 7 templates)
· `doctrines/CARTO-OVERLAYS-PRINCIPES.md` · `memory/feedbacks/feedback_flagfill-templates-decouverte.md`

**9. On voulait « une carte vivante ». On a fait une carte chargée. Ce sont des opposés.**
· *Renoncement*
· Accroche : drapeau, popup, arc, flux, texture, sprite — 6 couches en même temps. Chacune bonne.
  Ensemble, illisibles.
· Diagnostic : doctrine importée d'un outil externe pensé pour la production de masse (« jamais 1,2 s
  sans mouvement ») ; importée sans test, elle a importé la philosophie de l'outil. Plafond dur : 2
  couches actives max en vertical, 3 en horizontal. **Non vérifiable par script** — discipline humaine.
· Règle : test de retrait — si enlever un élément ne fait rien perdre à la compréhension, il n'aurait
  pas dû être ajouté.
· Rejetés : scène A5 V4 (6 couches) · labels que la voix ne prononce pas · le cargo trop petit pour
  être identifiable (= bruit) · le sprite top-down sur carte inclinée
· `doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md`

**10. Pour ajouter une pause dans une narration, j'ai arrêté de demander la pause.**
· *Migration*
· Accroche : je demandais au générateur de voix de marquer une pause. Il la mettait où il voulait. À
  chaque tentative, une pause apparaissait et une autre disparaissait.
· Diagnostic : le modèle INTERPRÈTE, il n'exécute pas — prouvé 2× sur 2 versions du système de balises.
  Pire : régénérer un audio validé relance un tirage complet et re-rate des mots corrects.
· Règle : quand un outil probabiliste ne garantit pas un détail, ne le lui demandez pas mieux — sortez
  ce détail de son périmètre et traitez-le de façon déterministe.
· Rejetés : balises `[pause]` et ponctuation (2 versions) · régénération de segments · estimer une
  durée au nombre de mots (~20 % d'erreur) · Whisper local, écarté au profit de l'API
· `doctrines/AUDIO-PAUSES-DETERMINISTES.md`

### Second rideau (20 histoires, en une ligne)

11. **Reconstruire au lieu de forker** — carte refaite de zéro au lieu d'être dérivée d'une validée : résultat amateur, 2 h perdues · `memory/feedback_fork-avant-reconstruire.md`
12. **Le catalogue de 71 composants qui paralysait** — partir du catalogue demande de RECONNAÎTRE, partir de l'intention permet de DÉDUIRE. ~10 essais contre 1 · `doctrines/CONTINUITE-SCENE-INTENTION-DABORD.md`
13. **4 moteurs écartés, avec date, motif et condition de réouverture** — un refus non daté sera re-débattu tous les 3 mois · `doctrines/DOCTRINE-SOUVERAIN.md`
14. **Le fond noir parfait, illisible au soleil** — magnifique sur écran de bureau, invisible sur mobile en extérieur ; or l'audience est mobile · `feedback_souverain-backgrounds-valides.md`
15. **L'objet flottait — c'était l'ombre en trop** — un objet en perspective porte DÉJÀ son ombre ; en ajouter une 2e crée la lévitation · `feedback_jeton-iso-pas-d-ombre-externe.md`
16. **Les tailles réglées une par une, toutes fausses ensemble** — marchands du fond 198 px, passants du 1er plan 174 px : perspective inversée, aucun absurde seul · `feedback_perspective-taille-derive-de-la-profondeur.md`
17. **Le teaser qui rendait la vidéo principale incompréhensible** — « déjà au bon format » n'est pas un critère de réutilisation · `feedback_short-teaser-coherence-visuelle-video-longue.md`
18. **Le résultat parfaitement documenté que personne ne pouvait trouver** — enfoui dans un en-tête de script, re-diagnostiqué 3× · `feedback_resultat-enfoui-script-pas-memoire.md`
19. **Trois agents en parallèle ont recopié au lieu d'importer** — conventions d'angle opposées, mains 28 px au-dessus de l'épaule · `feedback_agents-paralleles-contrat-partage.md`
20. **« L'IA a dit que c'était limite » — mon verdict était 2× plus sévère que le sien** · `feedback_autocritique-agent-signal-pas-verdict.md`
21. **L'agent a rapporté « terminé ». 2 fichiers sur 6 n'existaient pas.** — omission de reporting, distincte du mensonge · `feedback_rapport-agent-texte-pas-preuve-verifier-disque.md`
22. **Le problème était dans la présentation, pas le travail** — planche à 540 px → défaut de proportion imaginaire. Mesurer en comparatif, juger en plein format · `feedback_presentation-render-plein-format.md`
23. ⚠️ **On a pris la mécanique d'une chaîne performante, jamais son ton** — *sensible : nomme une chaîne tierce* · `feedback_medieval-mindset-methode.md`
24. **« Expliqué comme un jeu vidéo » : interdit sur les drames humains** — autorisé sur les systèmes, interdit sur les conflits et les morts · `feedback_explain-like-video-game.md`
25. **Le SFX catalogué « 0,6 s » durait 18 s et contenait une voix** — l'index mentait sur le contenu · `sfx-reveal-mp3-banni.md`
26. **3 tentatives, aucun changement observable, et c'est l'humain qui a dû dire d'arrêter** · `feedback_reconnaitre-derive-investigation.md`
27. **Le prix qui a inversé la conclusion** — « ~136 $/3 mois » était en réalité ~157 $/MOIS. Bon calcul, mauvaise unité · `feedback_prix-mensuel-vs-total-abonnement.md`
28. **« C'était mieux qu'avant » — 3× de suite, et toujours loin de la cible** — formuler le test comme « correspond-il à la référence ? » · `feedback_reconfronter-brief-original-pas-diff-relatif.md`
29. **Les 13 garde-fous, chacun né d'un dollar perdu nommément** — référence bébé pour un garçon de 7 ans (2,70 $), storyboard sans référence canonique (2,74 $), baobab qui se relève 3/3 · `memory/pipeline-gates-system.md`
30. ⚠️ **Ce qui protège n'est pas le prompt, c'est de pouvoir corriger gratuitement** — *sensible : nomme un pipeline concurrent*. Preuve de leur non-déterminisme : une faute d'orthographe dans leur propre accroche · `feedback_vox-generation-vs-composition-deterministe-moat.md`

---

## PARTIE C — LES 6 THÈMES RÉCURRENTS (les piliers de la ligne éditoriale)

1. **Vérifier le rendu, jamais l'intention — et en mouvement, jamais figé.** Le thème le plus dense.
   3 échelles de la même erreur : la frame vs la séquence · le code vs l'écran · la mécanique vs le sens.
2. **L'outil puissant qu'on ne contrôle pas — et la préférence pour le déterminisme.** Le fil
   directeur de toute la trajectoire. Critère jamais la qualité brute, toujours la reproductibilité et
   le coût de la correction.
3. **L'avis d'un modèle est un signal, jamais un juge — et la convergence n'est pas une preuve.**
   Raffiné jusqu'au contre-intuitif : plusieurs modèles d'accord partagent surtout leurs angles morts.
4. **L'ordre des questions décide du résultat.** Intention avant catalogue · storyboard avant code ·
   brief avant asset payant · critère avant avis externe. Presque toutes les boucles coûteuses du
   corpus = une inversion d'ordre, pas un manque de compétence.
5. **Documenter ne suffit pas — la connaissance mal rangée n'existe pas.** Auto-accusateur, donc très
   crédible : même défaut reproduit juste après avoir été documenté.
6. ⭐ **Répartir le jugement selon ce que chacun peut percevoir.** Le plus transposable hors technique,
   et **le meilleur angle pour un public LinkedIn non technique** : une machine ne peut littéralement
   pas entendre un son ni ressentir une lecture. La machine tient la mécanique, la mesure et la
   mémoire ; l'humain tient le sens, la lisibilité et le goût.

---

## PROCÉDURE DE MISE À JOUR (le workspace continue d'évoluer)

Cet inventaire **s'accumule**, il ne se refait pas. Deux moments pour l'alimenter :

**En fin de session** (réflexe à ajouter au `/wrap`) : si la session a produit un arbitrage — on a
essayé X, rejeté X pour Y, et voici pourquoi — l'ajouter en une ligne au second rideau avec son
fichier source. 30 secondes. Ne pas rédiger le post, juste capter l'histoire.

**Re-balayage complet** : tous les ~3 mois, ou quand `memory/feedbacks/` a gagné ~20 fichiers.
Relancer un agent archiviste avec le même brief (critères de tri : un CHOIX ou RENONCEMENT concret +
un DIAGNOSTIC + une RÈGLE transposable ; bonus fort = essais ratés nommés ; écarter les notes
purement techniques sans arbitrage). Lui donner ce fichier pour qu'il ne re-liste pas l'existant.

**Signal qu'une histoire est mûre** : elle a un diagnostic écrit ET au moins un essai rejeté nommé.
Sans essai rejeté, c'est une note technique, pas une histoire.
