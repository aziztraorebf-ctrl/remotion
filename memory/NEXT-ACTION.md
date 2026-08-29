# NEXT-ACTION — Recommandations actives

## ⭐⭐⭐ DÉCISION DU 2026-08-24 — LA CHAÎNE EST UNE VITRINE, LE FREELANCE PORTE L'EFFORT

Décision d'Aziz. La chaîne continue (Gazoduc), mais elle **prouve les capacités, elle ne les monétise
pas**. ⚠️ Le freelance n'est pas prouvé non plus (1 candidature, 0 revenu) — ce qui est décidé, c'est
**où va l'effort marginal**. Doctrine + fer de lance retenu (pilier 2, objets animés par code) :
`memory/doctrines/PILIERS-B2B.md` (en tête).

**Acquis technique de la session** : pipeline **SVG → Lottie** prouvé, validé dans les 2 outils
officiels de LottieFiles. On sait livrer un composant au format du client, pas seulement une vidéo.
→ `memory/client-sim-tests/lottie-ui-lcd/STATUS.md`

**Prochaine étape (bloquante)** — ⭐ **RÉÉCRITE le 2026-08-29, les 2 items d'origine sont périmés** :
~~courbes de Bézier~~ ✅ **FAITES le 24/08** (`lottie-ui/tools/svgpath.py` : grammaire complète
M/L/H/V/C/S/Q/T/A/Z + quad→cubic + arc→cubics, 36 tests). ~~scène narrative~~ ⛔ **mauvaise cible** :
zéro carte géographique sur 22 pièces d'un studio qui vend — le registre qui se paie est le **FLUX
D'INTERFACE**.
⛔⛔ **LE VRAI BLOQUEUR, MESURÉ** : le **MATTE (`tt`)** — ~90 occurrences sur 22 pièces pro, refusé
par notre chaîne, contre 0 trim path / 0 repeater / 0 expression. C'est LE portage prioritaire.
→ `memory/client-sim-tests/corpus-kamotion/CORPUS-REFERENCE-UI.md` · starter :
`memory/starters/STARTER-repro-ui-animation.md`

⛔ **Ne PAS refondre le gabarit d'ouverture des vidéos** : la mesure des 4 courbes de rétention
INFIRME l'hypothèse d'un défaut systématique (les formes divergent).
→ `memory/doctrines/DIAGNOSTIC-FLOP-VIDEO.md` § LES 5 FORMES DE COURBE

---

## 🌿 ÉTAT GIT — 1 SEULE branche vivante (nettoyé au wrap du 2026-08-28)

**23 branches supprimées** (22 déjà mergées dans master + 1 redondante dont le contenu y était déjà).
Il ne reste que **`master`** et :

- ⚠️ **`feat/zambia-demo-2concepts`** — **NON MERGÉE, 1 commit unique** : `gallery/index.html`,
  `gallery/styles.css`, un poster PageCam (recherche en langage courant, intentions, favoris).
  ⛔ **NE PAS supprimer sans décider** : ces fichiers **n'existent PAS sur master**. La galerie est
  déployée sur GitHub Pages, donc son code de référence vit peut-être ailleurs — **vérifier où avant
  de merger OU de supprimer**. Tant que ce n'est pas tranché, la branche reste.

⭐ **Règle** : ne pas laisser s'accumuler des branches mergées — `git branch --merged master` liste ce
qui se supprime sans aucune perte, `git branch --no-merged master` ce qui porte du travail unique.

## ⭐⭐⭐ CLIENTE UPWORK chill-meter — ELLE A RÉPONDU (4 échanges), PHASE FINALE DE DÉCISION (2026-08-27)

⭐ **La condition d'ouverture EST REMPLIE.** 4 échanges en 4 jours (23→27/08). Dernier message :
*« I'm reviewing everything carefully now and will let you know soon. »*

**Tout ce qu'elle a demandé est validé** : exports ProRes 4444 plein cadre pré-positionnés · 6 fichiers
séparés par état · dossier source + README · disponibilité future à tarif convenu · **2 révisions par
jalon** · délais 3/5/4 j · le look glacé (elle a reconnu que sa référence est le palier 50-75 %, pas le
0 %). **Identité vérifiée le 26/08** (elle l'avait relevé).
⭐ **Rien en suspens de notre côté.** Relance légitime après **3-4 jours ouvrés** sans nouvelle, pas avant.

**SI CONTRAT** — dans cet ordre : (1) **prototyper le SON** (seul point promis jamais démontré ;
~5 essais par son, calage sur des ÉVÉNEMENTS MÉCANIQUES dont la frame est connue) · (2) **écrire le
README** (promis, n'existe pas) · (3) jalon 1 = envoyer l'image du compteur, elle existe déjà.
⛔ **Ne PAS lui dire que les 6 états sont déjà rendus** — atout de négociation.
⛔ 350 $ = le prix DU BRIEF, pas une enchère.
⛔ **Décision d'Aziz maintenue : ne RIEN produire de plus avant d'avoir le contrat.**
⭐ Le **brief client PDF est sur disque** (`BRIEF-CLIENT-ORIGINAL.pdf`, gitignoré) : le RELIRE avant
toute action sur cette annonce — un résumé ne le remplace pas (2 erreurs payées le 23/08).
→ Candidature complète (lettre + 5 réponses + jalons + « pas de boost ») :
`memory/client-sim-tests/upwork-chill-meter/STATUS.md` § CANDIDATURE.

---

## ⭐⭐ POCHOIR (track matte) — PORTÉ, mais la PRÉCOMPOSITION bloque (2026-08-29)

**Acquis, mesuré bout en bout** : `mask`/`clip-path` → paire Lottie `td:1`/`tt:1`.
Écart **0,00 %** sur de la géométrie professionnelle réelle. 2 bugs corrigés dans
`svg2lottie_scene.py` (clip d'un `<g>` perdu en silence + table de refus périmée),
garde-fou posé (compte les clips vus vs traités), 4 tests de non-régression.

⛔ **LE BLOCAGE, mesuré sur une vraie pièce** : sur le chien de Fable, **1 pochoir sur 5**
passe. Les 4 refus disent la même chose — *« clip d'un groupe de N calques, précomposition
non implémentée »*. Un œil n'est pas une forme : c'est 4 calques (globe, iris, pupille,
reflet). Lottie ne découpe qu'un calque par pochoir.

⭐ **Une brique, deux verrous** : la pièce 2 (onboarding) a 45 précomps imbriqués sur
3 niveaux. La précomposition débloque les deux.

▶️ **Priorité fixée par Aziz le 29/08** : animer le chien de Fable + des formes similaires
issues de fichiers pro. → **`memory/starters/STARTER-RIG-PERSONNAGE-EXISTANT.md`**
(banc d'essai : `src/projects/_client-sim/repro-chien/`, lire son README en premier)

⭐ **Effet de bord doctrinal — ⛔ CORRIGÉ PAR AZIZ, ne pas relire la 1re version** : Fable a
réussi une **face de mascotte** (symétrique, faite de primitives). ⛔ Ça ne s'étend PAS à
l'humain : la main-curseur n'était pas « dessinée avec référence » mais une **GREFFE de
structure** depuis un Lottie premium, et son anatomie est fausse (index en tube sans phalange).
⛔ Un dessin statique réussi ne dit RIEN de son animabilité (le visage du pêcheur s'animait
mal). → direction retenue : la **référence FICHIER** (démonter un Lottie pour comprendre pivots
et parentage), pas la référence image. Détail : `memory/starters/STARTER-RIG-PERSONNAGE-EXISTANT.md`.

---

## ⭐ LOTTIE — chaîne PROUVÉE (section ARCHIVÉE le 2026-08-29)

Les acquis techniques (flou `ty:29` porté · `gradientTransform` en similitude · pointillés/`nm`
unique · texte 2 voies · aller-retour Creator fidèle, ⛔ les 293 $/an ne se justifient pas)
vivent désormais dans l'atelier : **`memory/tools/lottie-claude-inventaire.md`**.
Les 4 logos clients chiffrés : `memory/client-sim-tests/repro-vendeur-lottie/LOGOS-CLIENTS-REELS.md`.
Table de décision client : `memory/client-sim-tests/lottie-ui-lcd/CE-QUI-PASSE-EN-LOTTIE.md`.

⛔⛔ **Le recadrage d'Aziz à garder** : prouver une capacité ≠ produire un livrable. Une carte
géographique n'est PAS un livrable Lottie. ⚠️ **Rien n'a encore été montré à un client** —
c'est ce que la session REPRO-UI traite : `memory/starters/STARTER-repro-ui-animation.md`.

⏭️ Reste ouvert : logos L3/L4 Kanvas · L8 Fokus · rig d'un perso déjà découpé
(`memory/starters/STARTER-RIG-PERSONNAGE-EXISTANT.md`).

---

## 🔧 SESSION D'AUDIT DU WORKSPACE — à planifier (constitué le 2026-08-27)

> Session dédiée, pas un fix au fil de l'eau. Les points s'ajoutent ici au fur et à mesure
> qu'on en repère. Rien n'est urgent ; tout est du durcissement de système.

**1. ⭐⭐⭐ Outiller le protocole des 2 échecs (le point le plus rentable)**
La règle existe (`CLAUDE.md` global § « Protocole agent de diagnostic dédié ») : à la **2e**
tentative infructueuse sur le même blocage → déléguer à un agent, NON-NÉGOCIABLE. Elle documente
2 preuves de valeur : 40 min perdues sur des appels API (18/07), et **4 itérations complètes** de
dosage caméra sur le globe D3 avant de déléguer (02/08) — l'agent a trouvé la vraie cause en 1 passe.
⛔ **Mais rien ne compte les tentatives.** C'est une règle écrite sans gate, soit exactement le
pattern `regle-ecrite-insuffisante-sans-gate-outille` — celui qui a fait échouer 3 fois la règle
d'éviction de NEXT-ACTION avant qu'on l'outille le 27/08.
Base de départ : `.claude/hooks/circuit-breaker.sh` compte déjà les éditions répétées d'un même
fichier. Reste à décider ce qui définit une « tentative sur le même problème » (rendu rejeté sur le
même défaut ≠ édition de fichier) et à quel seuil il propose la délégation plutôt qu'il ne bloque.

**2. Audit des ~90 skills** (demandé le 2026-07-11, jamais fait — non urgent : les skills sont
chargées sur description, elles ne coûtent rien tant qu'elles ne servent pas).

**3. Vérifier que les gates ne meurent pas en silence.** Les 14 hooks sont câblés et s'exécutent
(vérifié 27/08), mais le circuit-breaker était mort le 12/07 sans que personne le remarque. Un
test d'exécution périodique de chaque hook éviterait la rechute.

---

## 🔧 BACKLOG TECHNIQUE — dette Gemini/outillage (2026-08-20, NON URGENT)

Migration image faite (preview mort → GA → **défaut LITE**, -50 %). **Les 5 actions qui restent** :
1. ⚠️ **`.claude/agents/visual-producer.md:407`** cite encore l'ancien identifiant image — **c'est
   l'agent qui dépense de l'argent réel, à traiter en premier.** Les ~28 autres mentions sont
   PASSIVES (templates, docstrings), à corriger au fil de l'eau. ⛔ NE PAS toucher aux archives.
2. ⛔⛔ **Réparer la centralisation VISION AVANT toute bascule** : `VISION_MODEL` n'est importé par
   AUCUN script — l'identifiant est en dur dans **42 fichiers actifs** (79 occurrences), parfois dans
   une URL. Changer la constante ne change RIEN aujourd'hui.
3. 💡 **Gisement à tester : `gemini-3.7-flash`** (stable) = −62 % input / −69 % output, 4× plus rapide
   en vidéo. ⛔ Qualité de jugement NON testée sur nos cas exigeants — protocole = test à l'aveugle
   sur un cas réel avant bascule. Détail : `memory/tools/gemini.md`.
4. **Migrer les ~75 fichiers vers `scripts/tools/api_models.py`** (voix 9 · Kimi 34 · GPT 20 · GLM 9),
   volontairement étalée : **tout NOUVEAU script importe du module**, les anciens se migrent quand on
   les touche. ⚠️ `da-brief.py` reste sur k2.5 en contournant un bug de k3 → appliquer le vrai fix
   (`memory/tools/kimi-k3-reasoning-borne.md`). ⏭️ GPT (`gpt-5.5` vs `gpt-5.6-sol`) : non tranché.
5. **`scripts/tools/mkprevis-camera-seule.py`** non commité — à commiter ou écarter.

⏭️ **1 arbitrage ouvert pour Aziz** : `FICHE-MOCKUP-3D` a hérité en silence du statut d'exception lors
de sa scission (08-26) — soit l'inscrire au README des fiches, soit tailler son doublon de fin.
⛔⛔ **NE JAMAIS RE-GRAVER UN CHIFFRE DE LIGNES DE FICHE ICI** (les 3 précédents étaient tous faux) :
mesurer à la demande avec `wc -l memory/fiches/*.md`.


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
>
> ⛔⛔ **UNE AUTRE SESSION PEUT CHANGER LA BRANCHE ET LANCER UN MERGE PENDANT QUE TU TRAVAILLES**
> (vécu 2026-08-20). Symptôme : un `git checkout <fichier>` échoue en `path is unmerged`, ou un typecheck
> révèle des imports dupliqués qui n'existent pas dans `HEAD`. La cause n'est PAS ton edit — c'est
> `.git/MERGE_HEAD` laissé par l'autre session, et le repo qui a basculé de branche sous tes pieds.
> **Vérifier AVANT de conclure quoi que ce soit sur un fichier partagé** (`src/Root.tsx` en tête) :
> ```bash
> git branch --show-current && ls -d .git/MERGE_HEAD 2>/dev/null && echo "MERGE EN COURS"
> ```
> ⛔ **Ne JAMAIS résoudre/abandonner le merge d'une autre session** (`reset`, `stash`, `merge --abort`,
> `checkout` d'un fichier unmerged) : c'est son travail vivant. Signaler à Aziz, continuer sur les
> fichiers non concernés, et re-vérifier la branche avant de commiter.
> ⚠️ Corollaire : cette même session peut aussi **commiter TON travail à ta place** pour réparer la
> cohérence du repo (vécu : `e6657203` a commité un composant que `Root.tsx` référençait). Relire
> `git log` avant de supposer qu'un commit est de toi.

---

## 🔧 BACKLOG — 2e test du workflow démo client (carto) — EN ATTENTE

> Le workflow n'a été validé que sur UN brief (Zambie) : *une abstraction écrite sur un seul cas est
> un pari, pas une brique*. On ne sait pas si `carto-selfreview` tient sur une carte claire, un globe
> D3 ou un format vertical.
> ▶️ **Starter complet (6 rappels payés) : `memory/starters/STARTER-PROMPT-2e-test-demo-carto.md`**
> — extrait d'ici au wrap du 28/08.

**Reste ouvert sur la Zambie (non bloquant)** : concept A sans tilt ni relief (décision de goût,
l'ajouter affaiblirait le contraste du gabarit) · filigrane discret validé mais jamais posé ·
GPT-5.5 en relecteur systématique à tester (il a battu les auteurs des planches — frames only, pas de vidéo).


---

## 🔬 CHANTIER FMI — ouvert, rien n'est commencé (script seulement)

> Extrait de ce fichier le 2026-08-27 vers **`memory/projects/CHANTIER-FMI.md`** (163 lignes).
> Il était enterré sous un titre « ✅ SYSTÈME GRAVÉ » qui le faisait passer pour clos.
> Phase A entière à faire — ne pas croire qu'on a de l'avance.

## 🔬 PISTE OUVERTE (non urgente) — H3 : injecter NOTRE audio via `reference_audio_urls`

✅ Le volet STYLES est **FAIT** (20/08) : Vector Poster et Sunjata prouvés transposables à seed
constant → `memory/doctrines/PILIERS-B2B.md` § GABARIT DE CHOIX.
⛔ **La seule limite qui reste** : l'audio est RÉGÉNÉRÉ par H3 (corrélation 0,46, la voix change).
Piste jamais testée : `reference_audio_urls` sur `minimax/h3/reference-to-video`.
⚠️ **Piège de grep** : `reference_audio_urls` (H3, **pluriel**) ≠ `reference_audio_url` (minimax-music,
singulier, n'existe PAS en v2.6) — un grep fait conclure à tort que le champ est mort.
⭐ **Prérequis non négociable** : archiver `.prompt.txt` + `.meta.json` (avec le **SEED**) à côté de
chaque clip, sinon ce chemin est impossible. Recette d'édition :
`memory/tools/edition-video-ciblee-omni-seedance.md`.
⚠️ Exploratoire — à prendre quand l'Acte 3 est soldé.

## 🎬 Showcase des capacités — reste LE DÉROULÉ (2026-08-15)

⏭️ **PROCHAINE ACTION = le DÉROULÉ** (ordre / durée / musique) → index interne 3-4 min → **cut vente
60-90 s**. ⛔ Zéro composant neuf à coder.
✅ Charte de DA FAITE (`memory/doctrines/CHARTE-DA-FREELANCE.md`) — ⛔ ne plus l'annoncer « à écrire »,
dérive détectée 2 fois (wraps du 20/08 et 27/08).
⛔ **L'arbitrage des 2 planches-contact est ANNULÉ** — ne PAS le redemander. Les 53 templates sont
archivés : la source est désormais la **production vivante publiée** (Sénégal, Soudan, AES, CFA,
Gazoduc Actes 1-2-4-5 ; ⛔ Acte 3 exclu tant que l'acte ENTIER n'est pas validé).
⛔⛔ **Leçon de méthode (payée 2×)** : un texte périmé gardé « pour mémoire » **reste lu comme actif** —
il se SUPPRIME, l'avertissement seul suffit.
→ `memory/projects/SHOWCASE-CAPACITES.md`

## 💼 GIG FIVERR ENTRÉE DE GAMME (2026-08-12/13)

Page validée par Aziz (`freelance-linkedin/GIG-PAGE-VALIDEE.md`), persona solo founder/startup.
Reste ouvert : prix réels, nom commercial, portfolio de démo. Détail :
`freelance-linkedin/BRIEF-GIG-ENTREE-DE-GAMME.md` § "Ce qui reste à trancher".

---

## 🔧 BACKLOG — KORA & CARTES : 2 pistes non tranchées, dormantes depuis 16 j (2026-08-12/13)

**Les 2 décisions qui restent ouvertes** (le reste de cette section est de la preuve déjà gravée) :
- **Quel sujet ?** Piste A « pourquoi l'Afrique évolue / pays qui montent » (relancer SUJET-PRIME
  6 étapes) **vs** mythologie africaine (mythe Anansi testé). Non tranché.
- **Quel format ?** Insert dans une vidéo Mapbox/D3 existante **vs** vidéo complète. Non tranché.
- Piste B (FMI/dette) : angle et squelette posés → `memory/projects/CHANTIER-FMI.md`.

**Acquis déjà gravés ailleurs — ne pas les redire ici** :
2 styles H3 validés sur le mythe Anansi (Poster Vector · Whiteboard Doodle) + prompts reproductibles
et format officiel H3-Base → `memory/tools/minimax-h3-styles-tests.md` ·
SVG codé direct par Fable 5 mode MAX, validé sur 2 cas → `memory/doctrines/SVG-SCENES-GENERATIVES.md`
(⛔ dont la règle : **jamais dessiner un contour de pays à l'œil**, utiliser `d3-geo`/Natural Earth) ·
storyboard multi-modèles refondu le 18/08 → `memory/fiches/FICHE-STORYBOARD.md` (auto-injectée).
Détail des pistes : `memory/projects/EXPLORATION-DIVERSIFICATION-CHAINES.md`.


## ⭐ CHAÎNE CANADA EN — test PIPELINE CONCLUANT (14/08) · 1 décision en attente : Mapbox réel vs 1re scène

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

## ⭐⭐⭐ GAZODUC — ACTE 3 : 1 segment FINAL (C) · A débloqué à VALIDER · B à porter (gel levé le 28/08)

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

## ⛔ NE PAS PROPOSER — AES abandonné volontairement (décision Aziz 2026-08-17). PAS une dette.

⛔ **Ne plus le proposer en début de session, ne plus le compter dans le reste-à-faire.**
La refonte V6 (script découpé/tagué/généré, audio validé, retiming vérifié) ne sera PAS assemblée
ni republiée. **Raison, et c'est elle qui généralise** : l'échec à 5 vues/24h est un problème de
TITRE / MINIATURE / SUJET, pas de production. Republier une version améliorée sur une vidéo morte
ne rachète pas la distribution — l'historique de non-distribution reste attaché à la vidéo.
✅ Ce qui reste utile : le **script V6 comme gold-standard de script dense** (pointeur conservé dans
`ROUTAGE.md`), et les leçons de production, qui partent dans les prochaines vidéos.
Détail historique : `episodes/warmap-sahel/STATUS.md`.

---

## ⏳ ACTIONS OUVERTES

### Recharger le crédit OpenAI

> ⚠️ **MAJ 2026-08-25 — l'impact dépasse Whisper** : OpenRouter renvoie aussi `402 Payment Required`, ce qui a
> **empêché de tester GPT-5.5** dans le comparatif 3D du 25/08 (`llm-gen-3d.py`). Trou de mesure à combler
> après recharge — c'est le seul modèle absent du classement 3D.
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
- **Peste 1347 mid-form horizontal** — concept validé, backlog (AES et Maroc Batteries sont abandonnés).
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

## 🔧 BACKLOG — 3 fiches saturées, à SCINDER (relevé au wrap 2026-08-27)

Le budget d'une fiche est de **55 lignes** (c'est du contexte injecté à chaque édition concernée).
Trois fiches le dépassent au point qu'un simple retrait de ligne ne sert à rien — c'est une
**scission** qu'il faut, et elle doit suivre un vrai changement de DÉCLENCHEUR :

| Fiche | Lignes | Scission proposée |
|---|---|---|
| `FICHE-CLIP-GENERE.md` | 272 (5×) | sortir les § previs/générateurs (`mkprevis-*.py` + mesures d'amplitude) vers une fiche PREVIS. « Je dessine une trajectoire » ≠ « je lance une génération H3 ». |
| `FICHE-UI-PRODUIT.md` | 196 (3,6×) | sortir les § MONTAGE + CURSEUR + SON vers `FICHE-ASSEMBLAGE`. « Je capture un écran » ≠ « je monte un film d'UI ». |
| `FICHE-ASSEMBLAGE.md` | 132 (2,4×) | fusionner les 2 sections qui redisent le plafond Artifact 16 Mo à 25 lignes d'écart. |

⚠️ Non fait en séance : scinder une fiche injectée automatiquement sans l'éprouver ensuite risque
de la rendre muette au mauvais moment. À faire en début de session, pas en clôture.
