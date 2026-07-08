# Key Learnings — Remotion / Souverain

Lecons transversales, patterns et anti-patterns valides au fil des sessions.

---

## 📑 INDEX

- **🔧 MÉTHODE & PROCESS** — reorg workspace (liens en dur dans le code), grand ménage mémoire+disque (baseline), bug visuel = extraire frames + instrumenter, validation mini-renders comparatifs (pas des stills)
- **🗺️ WAR-MAP — grammaire & narration** — HOOK partir de NOS templates (pas grammaire externe), GRAMMAIRE CAUSALE + AUDIO-FIRST (standard), scanner catalogue carte-vivante avant code, structure linéaire + fact-check avant audio lock, sprite invisible = CONTRASTE, vrai coupable B1 = CODE LEGACY parallèle
- **🎬 DA-BRIEF & review externe** — DA-brief causalité phrase-par-phrase + chaînes réf + catalogue, DeepSeek V4 3e voix conceptuelle (aveugle visuel), Gemini diff visuel obligatoire après 1er render, **DA-brief VIDÉO (analyse d'écart vers refs, scène finie)**
- **🎨 SVG GÉNÉRATIF ANIMÉ** (2026-06-21, ⭐ NOUVELLE VOIE) — Gemini génère une SCÈNE illustrée complexe en SVG propre (50-100 paths, ~20Ko, groupes #id sémantiques) → animable PAR PARTIES dans Remotion via useCurrentFrame (pas Lottie, pas AE). Net à toute taille, couleurs modifiables à la frame. GOTCHA : ne JAMAIS sortir un élément du cadre clippé (artefact de coupe) → "repart" = avance légère + fade out · **BIBLIOTHÈQUE SVG** (2026-06-25) — capitaliser chaque projet SVG en éléments (.svg) + techniques (.md) + index R&D (RD-INDEX.md avec renders catbox + verdicts). Un agent vierge peut réutiliser sans relire les TSX source. · **TEST NAVIGABILITÉ** : lancer un agent vierge avec 5 questions concrètes → les lacunes qu'il ne trouve pas = trous à corriger immédiatement (lien mort, prompt TODO, décision non tranchée) · **PERSONNAGE VIVANT** (2026-06-30) — perso d'encre animé par CODE (frame-driven, pas sprites) ; FOOT-PLANT / compensation bassin / objet-enfant-de-la-main ; LLM=banc d'idées pas rig-en-bloc → biblio `personnage-vivant-svg/`
- **🎬 SCÈNE & CONTINUITÉ** — doctrine intention→forme→template (anti-cercle-vicieux templates), forced alignment ElevenLabs > Whisper pour le CALAGE d'animation (Whisper dérive ~0.4s)
- **🔊 AUDIO & SOUS-TITRES** — trimAfter ABSOLU (depuis début media), sous-titres ffmpeg sans libass → overlay ProRes alpha, beats GLOBALE vs STANDALONE (noir+queue morte+musique coupée), musique 1 morceau → plusieurs durées
- **🗺️ MAPBOX & RENDU GÉO** — stroke=fill → frontières invisibles, pays outre-mer → clipPath
- **🤖 BRIEF AGENTS** — workflow Beat Mapbox templates catalogue, background/proportions/dimensions explicites, visualWeight + placeholders réalistes
- **✅ FACT-CHECK** — Sonar Deep Research via OpenRouter + piège chiffre daté/trompeur (production vs réserves)

---

## 🔧 MÉTHODE & PROCESS

### 2026-07-07 — Sprite/portrait BITMAP : JAMAIS de scale oscillant continu (= flou/scintillement)
Un `scale` qui « respire » en boucle (breathe, ex. `1 + 0.04*sin(frame)`) sur une IMAGE RASTER force un
ré-échantillonnage sub-pixel à CHAQUE frame → le sprite paraît flou et scintille en permanence (bug vu sur le
jeton-Hemedti Acte 1 Soudan, Aziz : « les jetons sont flous, un petit brouillard »). **Fix** : spring d'APPARITION
(0→1.12→1) PUIS scale FIGÉ à 1 — plus aucune interpolation de scale une fois l'objet posé. Pour donner de la vie
sans flouter : animer l'OPACITÉ, un HALO/glow externe, l'OMBRE portée — jamais le scale de l'image elle-même.
Vaut pour tout portrait/jeton/sprite bitmap animé.

### 2026-07-07 — Extraire une forme-pays en `<path>` SVG depuis un geojson (pour un INSERT figuratif)
Pour poser une silhouette nationale nette dans un cartouche/insert (≠ carte Mapbox zoomable) : charger le geojson
du pays → aplatir les coords de l'anneau ext le plus grand en path → normaliser dans un viewBox → **CORRIGER
l'aspect par `cos(latitude_centrale)`** (sinon le pays est étiré horizontalement : la projection lon/lat n'est pas
iso aux latitudes ≠ 0). Échantillonner 1 point/N pour alléger. Donne une silhouette colorable/animable à la frame,
sans Mapbox. Utilisé pour la vraie silhouette du Soudan de l'insert 50M (Acte 1) — a remplacé une silhouette
Afrique dessinée à la main qui « ne ressemblait à rien » (Aziz). Réf : `sudan-outline.geojson` → `SUDAN_PATH` dans SoudanActe1.

### 2026-07-07 — ⛔ NOM PROPRE AFFICHÉ À L'ÉCRAN = vérifier l'orthographe contre Wikipédia AVANT render (NON-NEGOTIABLE)
Faute grave commise Acte 1 Soudan : label écran « HEMETI » alors que l'orthographe correcte est « HEMEDTI »
(avec le D — nom affiché sur Wikipédia/barre de recherche : « Muhammad Hamdan Dagalo, nom de guerre Hemedti »).
Un nom propre mal orthographié À L'ÉCRIT dès l'ouverture = perte de crédibilité immédiate (Aziz).
**RÈGLE** : tout nom propre (personne, ville, organisation) qui APPARAÎT À L'ÉCRAN (label JSX, plaque, sous-titre,
titre) DOIT être vérifié contre une source de référence (Wikipédia = référence d'orthographe) AVANT le render.
Ne pas se fier à la transcription phonétique de l'audio (le whisper écrit « Emeti/Hemeti » d'oreille) ni à la
graphie qu'on a « en tête ». La graphie ORALE (TTS) et la graphie ÉCRITE (label) sont deux vérifications distinctes :
un nom peut être bien prononcé et mal écrit. Checklist avant tout render d'un beat avec nom à l'écran : lister les
noms propres affichés → vérifier chacun sur Wikipédia → corriger le label. Détail : [[feedback_nom-propre-ecran-verifier-wikipedia]].

### 2026-07-04 — Worktree : rapatrier les assets AUDIO gitignores AVANT de rendre dans le tree principal
Un agent en worktree cree des mp3 dedies (ex `narration-v3-scene6.mp3`, `sc7-audio.mp3`) qui sont GITIGNORES ->
ils restent dans le worktree et sont ABSENTS du working tree principal. Rendre la compo dans le tree principal
echoue alors sur `readFile` (fichier introuvable) — le "DONE" d'un echo suivant peut MASQUER l'echec du render.
REGLE : avant de rendre dans le tree principal une compo produite en worktree, COPIER les assets gitignores (audio
mp3, SFX) du worktree vers le principal. C'est le sens INVERSE du gotcha connu #2 de [[PRODUCTION-AGENTIQUE-REMOTION]]
(principal->worktree part sans assets) : le probleme joue dans les DEUX sens. Cause de render casse = >30min a
diagnostiquer si on ne pense pas a l'asset gitignore.

### 2026-06-26 — Réécriture d'historique git (filter-repo) drope le travail NON-COMMITÉ (piège silencieux)
Le hook AES Acte 1 a été PERDU entre sessions : un `git filter-repo` (réécriture d'historique) suivi d'un commit
d'intégration avait gardé les FICHIERS composants (`WarMapBanner`, `Acte1IntroSlam`) mais PAS leur câblage dans le
moteur (modifs non commitées au moment de la réécriture). **Le piège = les fichiers survivent, seule l'intégration
disparaît → régression SILENCIEUSE découverte tard** (le hook ne s'affichait plus, mais rien ne cassait au build).
Règle : **commiter un JALON (même wip) avant toute opération filter-repo / rebase / reset**. Re-câblé + commité `23a550a`.

### 2026-06-26 — Ondulation de tissu/bannière en headless : bandes DOM, JAMAIS clipPath SVG
Effet ONDULATION (drapeau qui flotte, voile qui vague, déchirure animée) en rendu Mapbox headless : NE PAS utiliser
`clipPath` SVG (fragile, échoue en headless — l'image clippée disparaît). Préférer **N bandes verticales DOM**, chacune
affichant une tranche de l'image via `background-position`, avec `translateY` sinusoïdal déphasé (amplitude croissante
du mât vers le bord libre). 100% DOM/CSS, robuste. Prouvé `WarMapBanner.tsx` (STRIPS=16, drapeaux AES plantés).

### 2026-06-15 — Methode de reorg workspace (gros menage : memoire, scripts, doctrines)

Apprentissages durables de la session de reorg complete (validee par un test agent vierge) :
- **Une reorg `.md` casse AUSSI les chemins en dur dans le CODE** (.py/.sh), pas que la doc. Apres tout deplacement : `python3 scripts/tools/check-links.py` (nav) + grep des chemins dans `scripts/`. Bugs reels trouves : `beat-session.py` (SKELETON deplace), `factcheck.py`, CLAUDE.md (`render-on-vercel.py` ->tools/, `review_with_kimi.py` ->`visual_review.py`).
- **Doublon successeur-non-adopte** : quand un fichier dit "Remplace X", verifier que TOUS les pointeurs (CLAUDE.md inclus) pointent le successeur, pas l'ancien. Cas : `visual_review.py` remplacait `review_with_kimi.py` mais CLAUDE pointait encore l'ancien -> risque d'utiliser le mauvais outil.
- **1 fichier = 1 role TROUVABLE** : tout script/doctrine reutilisable doit etre dans un INDEX par cas d'usage. 48% des scripts etaient orphelins (cites nulle part = invisibles pour moi/un agent). Cree : `scripts/SCRIPTS-INDEX.md`, `scripts/tools/REVIEW-TOOLS-INDEX.md`. Symetrie des 3 piliers : chacun a son INDEX point d'entree (SOUVERAIN/ATLAS/WARMAP-INDEX).
- **Le hook `gemini-model-guard.sh` bloque l'ecriture des noms de modeles perimes MEME dans la doc qui sert a les interdire** -> decrire les bannis ("versions Gemini < 3.1") au lieu de les lister litteralement.
- **Test agent vierge = validation de navigabilite** : lancer un agent SANS contexte pour qu'il navigue le workspace sur des taches reelles revele les liens morts/ambiguites qu'on ne voit plus. MAIS verifier ses verdicts (il a mal attribue une source : "CLAUDE.md a 4 liens morts" etait faux).
- Garde-fou cree : `scripts/tools/check-links.py` (`--all` pour tout le repo). Nav principale = 0 lien mort verifie.

---

### 2026-06-15 — Grand menage memoire + disque (etat de reference post-menage)

Session dediee au menage. Resultats a retenir comme nouvelle baseline :

**Contexte/demarrage (-62%)** : CLAUDE.md projet 47->14KB (routage extrait vers `memory/ROUTAGE.md`,
regles non-negociables resumees+pointees). MEMORY.md 36->17.5KB (index pur 1 ligne/entree).
COMPACT_CURRENT.md 920->134 lignes (historique mort -> STATUS.md par episode).
**9 MCP debranches** (supabase/neon/vercel/netlify/render/sentry/stitch/cavalry/phaser-editor) —
`.mcp.json` NON tracke git, defs sauvees `/tmp/menage-backups-2026-06-15/` pour rebrancher.

**Disque (~4.4 GB recuperes)** : 3 worktrees git abandonnes (`git worktree remove --force`),
`out/*/wip` purges (warmap-sahel garde v3+FINAL car projet actif), `out/_r-and-d` >7j purge,
CSV UCDP 239M (re-telechargeable via ucdp_connector.py). Travail Cannae non commite sauve dans
`memory/_recup-worktree-cannae-2026-06-04/`.

**Gisement restant non traite** : connecteurs `claude_ai_*` (~30, cote app claude.ai, pas pilotables
d'ici) ; `public/` 2GB (assets episodes livres, archivable mais delicat car partiellement versionne) ;
142 vieux feedbacks dans l'auto-memory `~/.claude/.../memory/` (uniques, jamais migres au repo).

**Methode validee** : auditer/mesurer AVANT de supprimer · verifier dérivabilité (FINAL existe ailleurs ?) ·
backups avant config · `git add` chirurgical jamais `-A`.

---

### 2026-06-15 — ⭐ REGLE TRANSVERSALE (tous projets/episodes) : sur un bug VISUEL, EXTRAIRE les frames de la VRAIE video + INSTRUMENTER avant d'affirmer une cause

Symptome (Sahel P4 ressources, mais vaut PARTOUT) : Aziz voyait "la carte a travers le plein ecran". J'ai
affirme 2x "c'est regle / c'est la carte Mapbox masquee" SANS verifier la video reelle -> 4 tours perdus,
frustration. La vraie cause n'etait PAS le canvas Mapbox (bien masque) mais les CONTOURS NATIONAUX du moteur
(une couche React) rendus PAR-DESSUS l'overlay.

**LA REGLE (systematic-debugging applique au visuel) :**
1. **Ne JAMAIS affirmer "c'est regle" sans avoir extrait les frames de la VRAIE video rendue** (`ffmpeg -i
   video.mp4 -vf "select='eq(n\,N)'" frame.png`) et les avoir REGARDEES. Un still re-rendu peut differer ; c'est
   la video que l'utilisateur voit qui compte.
2. **INSTRUMENTER pour prouver la cause** (ex : fond rouge/vert/bleu vif opaque par zone -> revele ce qui est
   clippe vs ce qui deborde ; un div debug ; isoler une couche). Prouver AVANT de fixer.
3. **Test de controle** : reproduire le bug sur une frame AVANT la zone suspecte (ex : une frame deja validee
   casse aussi ? -> c'est l'environnement/une couche commune, pas mon nouveau code).
4. Des le 2e fix qui echoue sur le MEME symptome : STOP, lancer `superpowers:systematic-debugging`, instrumenter.
   Ne JAMAIS dire "c'est le cache/l'environnement/la map" sans preuve.

Corollaire moteur War-Map (mais le principe est general) : une couche rendue APRES un overlay dans l'arbre passe
AU-DESSUS. "On voit X a travers" = X est rendu apres/au-dessus, pas une transparence. Chercher l'ordre de montage.

---

## 2026-06-14 — VALIDATION VISUELLE : mini-renders comparatifs + instrumenter avant deviner (War-Map)

> Session contours nationaux colorés Sahel P3. 2 leçons de PROCESS gravées par Aziz.

**1. Mini-renders VIDÉO comparatifs OBLIGATOIRES (pas des stills) pour juger un effet en mouvement.**
Quand on évalue un effet visuel dynamique (respiration d'opacité, draw-in, pulse, couleur qui apparaît),
Aziz a EXIGÉ 2x dans la session de voir le tout EN MOUVEMENT côte-à-côte (hstack ffmpeg gauche/droite),
jamais des images fixes. Les stills servent à MOI (analyse rapide pré-présentation) ; la décision d'Aziz
se prend sur la vidéo. Pattern : 2 fenêtres courtes (lecture→action + action→lecture) en scale 0.5 pour
itérer vite, montées côte-à-côte, uploadées catbox. La netteté finale se juge séparément en full HD (scale 1).
**Pourquoi** : un effet d'opacité/mouvement est INVISIBLE sur un still — présenter des stills fait tourner
en rond et fait douter du design à tort.

**2. INSTRUMENTER pour PROUVER, ne jamais deviner quand un effet n'apparaît pas.**
Quand Aziz dit "je ne vois absolument pas [l'effet]", le CROIRE et instrumenter AVANT de re-coder à l'aveugle.
Technique validée (déjà notée pour le bug timeline P2) : forcer la couche suspecte à une valeur ULTRA-VISIBLE
(magenta `#FF00FF`, largeur 8, opacité 1) et rendre 1 still. Si le magenta apparaît → la couche est peinte,
le problème est la subtilité (couleur/largeur/grain qui lave). Si rien → bug de données ou de z-order.
Cette session : a révélé DEUX bugs cachés — (a) `(src as any)._data` n'existe plus sur GeoJSONSource récent
→ le contrôle par région n'était JAMAIS mis à jour (restait ctrl=1) ; (b) le grain papier plein écran
(mixBlendMode overlay) LAVE les traits SVG fins → il faut rendre les contours AU-DESSUS du grain.
**Règle** : un effet "invisible" = bug à prouver (couche peinte ? données à jour ? z-order ?), pas un réglage
à tâtonner. Le debug magenta tranche en 1 render.

**Règle de design bonus (cas spécifique mais réutilisable)** : repère permanent (contours pays) + overlay
semi-transparent = JAMAIS cohabiter (bouillie illisible). Les repères s'EFFACENT pendant tout overlay
(fenêtres CONTOUR_HIDE_WINDOWS), reviennent après. Et : couleur via fond mosaïque OU via contours selon
le look de la partie, jamais les deux (sinon surcharge).

---

## 🗺️ WAR-MAP — grammaire & narration

### 2026-06-15 — ⭐ HOOK : partir de NOS templates prouves, NE PAS transposer une grammaire externe sur notre carte 2D

Symptome : j'ai code un hook War-Map (acte 1) en suivant un DA-brief abstrait (gabarit "carte qui se transforme"
type Max Bellona) SANS d'abord verifier nos templates de hook DEJA PROUVES. Resultat rejete par Aziz : tremblement
de bord inexplique, drapeaux=requins, pins parasites, cold-start rate. Le prototype `SahelHookActe1` a ete supprime.

**Cause racine** : transposer une recette pensee pour une AUTRE grammaire (style 3D / autre chaine) sur notre
carte 2D flat top-down, au lieu de partir de CE QUI MARCHE CHEZ NOUS.

**LA REGLE** :
1. La regle "RECHERCHE TEMPLATES obligatoire AVANT de coder" s'applique AUSSI aux hooks (je l'avais sautee).
2. NOS hooks prouves = `KineticMaskSlam` + `ComboMaskSweep` ("carte a travers un chiffre", masque SVG + zoom-reveal).
   `src/projects/_shared/mapbox/`. Penses pour notre carte 2D, drift Mapbox continu, cinetique en overlay SVG.
3. Un DA-brief peut pousser une direction INADAPTEE a notre stack — le verifier contre nos templates AVANT de coder.
4. Chantier ouvert : SESSION DEDIEE HOOKS (`memory/SESSION-DEDIEE-HOOKS.md`) = bibliotheque de hooks reutilisables
   pour TOUTES nos videos (on est "a court de bons hooks", manque structurel — Aziz 2026-06-15).

---

## GRAMMAIRE CAUSALE + AUDIO-FIRST : LE STANDARD WAR-MAP (2026-06-12)

> ⭐ **Doctrine absorbée dans `memory/doctrines/WARMAP-GRAMMAIRE.md`** — lire en priorité.
> Résumé non substituable : CAUSE AVANT EFFET (les jetons AVANCENT → sillage colore → bases tombent). Jamais un ÉTAT qui pop. Audio phrase-par-phrase AVANT de coder. Test de lisibilité : "coupe le son — si tu comprends les actions sans l'audio → gagné".

**Erreurs spécifiques à ne pas refaire (complément local, non couvertes par la doctrine) :**
- Sprite-PORTRAIT nu (buste face) sur une carte top-down = incohérent. Le JETON = cercle parchemin + portrait CLIPPÉ dedans (`chip()`).
- Pont Gemini→PixelLab RATE sur effets DIFFUS (poussière = boule pleine). Marche sur denses (explosion/fumée).
- SFX seulement si SUPPORT VISUEL.
- Un élément JSX gaté peut disparaître même si sa propre condition est vraie → systematic-debugging + rect debug magenta.

---

## SCANNER LE CATALOGUE CARTE-VIVANTE AVANT DE CODER UN BEAT WAR-MAP (2026-06-11)

> Règle gravée dans CLAUDE.md et ROUTAGE.md. Rappel court : AVANT de coder TOUT beat carto, scanner `CATALOGUE-CARTE-VIVANTE.md` + `MAPBOX-COMPOSANTS.md`. Cause de l'erreur P2 : 30+ composants premium non utilisés (LottieGeoAura, ContagionFlagSpread, PulsingRegionFill...) car le scan avait été sauté. "Sobre/analytique" n'est PAS une excuse pour "plat/pauvre". Réf complète : `episodes/warmap-sahel/REFONTE-PREMIUM-P2-techniques.md`.

---

## 2026-06-10 — War-Map Sahel : structure linéaire + fact-check systématique avant audio lock

**1. Chronologie LINÉAIRE > flashback pour la lisibilité (show-don't-tell).**
Un récit qui montre l'aboutissement (Acte 1 : factions installées ~2022) PUIS revient en arrière (Acte 2 :
"tout commence en 2012") désoriente — et fait littéralement RECULER une timeline à l'écran (bug repéré par
Aziz). Parade : poser le contexte AVANT la rupture, chrono qui n'inverse jamais. Le bon découpage narratif a
réglé un bug technique de prod. Vaut pour tout War-Map/doc analytique. Doctrine : WARMAP-LONG + DA-BRIEF-GATE.

**2. Fact-check Sonar Pro SYSTÉMATIQUE avant audio lock — dès qu'on trouve 1 erreur, présumer qu'il y en a d'autres.**
Sur le script Sahel : 1 erreur (attaque "coordonnée sur Bamako 25 avril 2026" non confirmée par RFI/Le Monde/ONU,
alors que Wikipédia FR l'affirmait → conflit de sources, suivre les sources presse/ONU), 5 imprécisions (chiffres
en fourchettes, Kidal/MINUSMA formulation neutre, "1650 hommes" non documenté, CEDEAO effectif 2025), et 1 MANQUE
majeur (confédération AES + force conjointe 2024). Outil : `perplexity/sonar-pro` via OpenRouter (web temps réel
+ citations). Grouper TOUS les faits du script en 1 appel. Persister la sortie hors /tmp.

**3. Réponses de modèles (DA, fact-check) = PERSISTER hors /tmp immédiatement** (purge au reboot). Copier dans
`memory/episodes/<ep>/reviews-*/`. Vu : 6 réponses DA failli rester dans /tmp volatile.

---

## 2026-06-09 — War-Map : sprite invisible = problème de CONTRASTE, pas de rendu (Sahel Acte 2)
**Symptôme** : insigne base militaire (sprite Gemini) invisible sur la carte, alors qu'un `<div>` opaque aux mêmes coords s'affichait. 4 "fixes" de rendu tentés en vain (Img/img/SVG, viewBox, delayRender).
**Vraie cause** : le sprite détouré n'occupait que 3.6% de surface opaque, couleur moyenne sépia clair [139,116,81] sur fond parchemin clair [245,239,214] → quasi invisible. PAS un bug technique.
**Leçon** : appliquer la règle "matière finale d'abord" AUSSI au debug visuel — composer le sprite sur le FOND RÉEL (`PIL alpha_composite` sur la couleur de la carte) AVANT de chercher un bug de rendu. Un insigne fin/clair sur fond clair a besoin d'un support (pastille/cartouche foncée) ou d'un détourage dense (encre noire franche).
**Acquis collatéraux réels (gardés)** : (1) `ConvergingFlows` viewBox était hardcodé 1080×1920 → props width/height ajoutées. (2) Pattern `delayRender` PAR FRAME + `map.once("idle")` requis pour charger sprites en headless (extrait dans `SahelMapBase`). (3) Extraction plomberie Mapbox → `SahelMapBase.tsx` (hook `useSahelMap`) réutilisable Actes 2-5 + Peste.

## 2026-06-09 — Le vrai coupable de B1 raté : du CODE LEGACY qui tournait en parallèle (Sahel)
Pendant la refonte de B1 V2, j'ai d'abord blâmé mon nouveau code (sprites invisibles, carte dense)
et j'ai bricolé 3 fois (board clearing 0.55→0.25→0.12, agrandir sprites) sans résultat. **La cause
racine était ailleurs** : le mode `acte2` ré-utilisait des blocs Acte 2-5 LEGACY (`TerritorialExpansion`
JNIM rouge f2630→4800, `SahelAttackArrow` armes Libye, FAMa/AfricaCorps/contre-offensive) qui tournaient
EN MÊME TEMPS que mon B1 V2 et noyaient tout. Gatés par `showChrome && frame>=...` SANS exclure `acte2`.
**Fix** : gater tout le legacy par `!acte2`. La carte est devenue propre instantanément.
**Leçon (systematic-debugging) :** quand un symptôme visuel résiste à 2 ajustements, ARRÊTER de régler
les valeurs et INSTRUMENTER : `grep` TOUT ce qui peut dessiner le bruit (ici : que dessine du rouge JNIM
à cette frame ?) AVANT de re-toucher mes valeurs. Le bruit ne venait pas de ce que je réglais. Vaut pour
tout moteur RICHE réutilisé sur plusieurs modes : un nouveau mode hérite de TOUT l'ancien rendu sauf si
explicitement gaté. Toujours auditer les `frame>=X` non bornés par le mode courant.
**Aussi appris** : fill-opacity Mapbox via expression `coalesce(get igniteOp)` → un `setPaintProperty`
numérique est IGNORÉ (conflit). Atténuer la PROPRIÉTÉ source (`igniteOp` par feature), pas la couche.
Render B1 V2 (board clearing + avion whip + convoi uranium + emprises dessinées) : litter.catbox.moe/wwf5di.mp4

---

## 🎬 DA-BRIEF & review externe

## DA-BRIEF : la causalité phrase-par-phrase + chaînes de réf + catalogue templates sont OBLIGATOIRES (2026-06-14, Aziz, War-Map P4)

> ⭐ **Doctrine absorbée dans `memory/doctrines/DA-BRIEF-GATE.md`** — lire avant tout DA-brief.
> **Les 3 manques d'un DA-brief faible** (à NE JAMAIS reproduire) :
> 1. Causalité phrase-par-phrase jamais mise à l'épreuve (poser POUR CHAQUE phrase : "risque d'état qui pop ?").
> 2. Chaînes de référence absentes (Operations Room/K&G/BazBattles — les LLM comparent mieux avec un MODÈLE).
> 3. Catalogue de nos templates non envoyé (`da-brief.py --catalog`) → ils travaillent à l'aveugle.
>
> **Modèle de brief** : brief P4 v2 = le MODÈLE. Vaut pour tout pilier.

---

## 2026-06-09 — DeepSeek V4 testé comme 3e voix DA (vs Gemini/Kimi) — bon conceptuel, aveugle visuel
**Contexte** : test curiosité Aziz. DeepSeek V4 Pro (sorti 24 avril 2026, après cutoff). OpenRouter
`deepseek/deepseek-v4-pro` (~$0.44/M in, $0.87/M out = ~10-20x moins cher qu'Opus). 1.6T MoE, contexte 1M.
**Frein confirmé** : PAS de vision/multimodal au lancement (en dev). Nos briefs DA reposent sur des frames.
**Walkaround validé** : remplacer les images par une DESCRIPTION TEXTUELLE fidèle (Claude a vu les frames).
Script : scripts/tools/deepseek-b1-test.py.
**Verdict** (2 briefs B1 War-Map, comparés à gemini+kimi qui avaient les images) :
- CONCEPTUEL (séquencier, logique narrative, structure) = 80-90% de la valeur Gemini/Kimi. A même apporté
  une idée neuve (chaîne uranium Arlit→port Cotonou→cargo, que ni Gemini ni Kimi n'avaient).
- Review downstream : confirme + ajoute des points justes (incohérence temporelle timeline vs années 60,
  confusion d'échelles).
- LIMITE : sans vision, il DÉRIVE parfois du réel (a inventé une narration légèrement différente). Aucun
  jugement visuel pixel-précis (AI-slop, couleurs, compo) possible.
**Usage recommandé** : 3e voix CONCEPTUELLE pas chère (idées séquencier/structure/logique narrative).
PAS en remplacement de Gemini/Kimi pour le JUGEMENT VISUEL (là ils restent indispensables jusqu'au
multimodal DeepSeek). Toujours lui fournir une description fidèle des frames sinon il confabule.
Réponses test : `memory/episodes/warmap-sahel/reviews-acte2/deepseek-b1-{downstream,sprites}.md`.

---

### 2026-05-13 — Règle 6 — GEMINI DIFF VISUEL OBLIGATOIRE APRÈS PREMIER RENDER (NON-NEGOTIABLE)

**Règle :** Après chaque premier render d'un nouveau composant, TOUJOURS envoyer le render + le mockup original à Gemini 3.1 Pro (`gemini-3.1-pro-preview`) pour analyse diff avant toute itération manuelle.

**Pourquoi :** Itérer à l'aveugle sur 3 composants = 9+ passes. Gemini diff en une passe = corrections exactes en une passe. Fidélité mockup passée de ~60% à ~90% en un seul pass.

**Protocole exact :**
1. Render first v1 (50% chance d'écart notable)
2. Envoyer au LLM : render PNG + mockup PNG + prompt `"Liste les 5 différences visuelles majeures entre le mockup et le render. Pour chaque différence, donne la correction CSS/React exacte (valeur en px, couleur hex, propriété Tailwind)."`
3. Appliquer TOUTES les corrections en une passe
4. Render v2 = version finale (ne pas rendre une v3 sauf retour Aziz)
5. NE JAMAIS présenter un v1 à Aziz sans avoir fait le diff LLM d'abord

**Modèle à utiliser :** `gemini-3.1-pro-preview` (analyse vision/diff précis — modèle VERROUILLÉ par CLAUDE.md, voir tableau modèles API). Les anciennes versions Gemini < 3.1 sont INTERDITES. Flash uniquement pour brainstorm, jamais pour diff visuel précis.

**S'applique à :** tout nouveau composant Remotion, tout nouveau template, tout beat avec layout custom.

---

## 🎨 SVG GÉNÉRATIF ANIMÉ

### 2026-06-21 — ⭐⭐ NOUVELLE VOIE : SVG génératif (Gemini) animé PAR PARTIES dans Remotion

Découverte majeure (session Sénégal Scène 1, validée par Aziz). Comble un manque : faire vivre une
illustration RICHE sans Lottie, sans After Effects, sans dépendre d'un bitmap figé.

**Le pipeline (prouvé)** :
1. **Gemini 3.1 Pro génère un SVG de SCÈNE** (pas une icône) — prompt = sujet + STYLE/palette EXACTE +
   exigence de STRUCTURE : `<g id="...">` sémantiques (ex: #ship, #derrick avec #pumphead, #waves, #rim),
   chaque élément animable AUTONOME. Résultat typique : 50-100 paths, ~12-20 Ko. PROPRE et léger.
2. **Convertir en composant React** : inliner le SVG, kebab→camelCase (stroke-width→strokeWidth,
   clip-path→clipPath, transform-origin→transformOrigin), virer les `style="..."` inline.
3. **Animer chaque groupe** par `transform`/`opacity` pilotés par `useCurrentFrame` + `interpolate`.
   Ex : #waves translateY sinusoïdal (océan respire), #pumphead translateY (derrick pompe), #ship translate+opacity.

**Pourquoi ça bat bitmap ET Lottie** :
- vs BITMAP (PNG GPT/Gemini) : le bitmap est NÉ figé → animable seulement de l'extérieur (sweep/parallaxe),
  tout ajout SVG par-dessus fait "sticker". Le SVG est NÉ animable (intérieur vivant : vagues, navire…).
- vs LOTTIE : Lottie est figé une fois exporté ; ici chaque path répond à la frame → synchro voix exacte.
- VECTORIEL : net à TOUTE taille (push-in/zoom sans pixellisation) + couleur de chaque élément modifiable
  à la frame (ex: mer qui vire au rouge sang, oxydation progressive).

**⛔ GOTCHA (Aziz, prouvé) — NE JAMAIS sortir un élément du CADRE clippé.** Un `<g clipPath>` TRANCHE
tout élément qui dépasse le cercle → artefact "navire coupé / qui bave sur le fond". Pour signifier qu'un
élément "part/disparaît" : **avance LÉGÈRE (translate faible) + FADE OUT (opacity→0)**, jamais une sortie
hors champ. Règle valable pour toute scène SVG/clippée.

**Comparatif outils (testé 21/06)** : **Gemini SVG = GAGNANT NET pour le SVG de SCÈNE** (riche, dense,
groupes sémantiques, ~20Ko). GPT-5.5 testé en API DIRECTE OpenAI (`api.openai.com`, modèle `gpt-5.5`,
`max_completion_tokens`) → SVG bien trop SCHÉMATIQUE (12 paths vs 119 chez Gemini sur la même Face B arbre).
⚠️ Note importante : c'est l'INVERSE du breakdown JSON (où GPT-5.5 écrase Gemini). Donc : SVG de scène → Gemini ;
breakdown JSON → GPT-5.5. ⚠️ OpenRouter avait son provider OpenAI DOWN tout le 21/06 ("Provider returned error"
sur tous les gpt-5.x) → passer par la clé OpenAI DIRECTE (`OPENAI_API_KEY` dans .env) quand OpenRouter flanche.
Recraft vectorize/generate = magnifiques MAIS 1-3 Mo, 4700-5700 paths, non-groupés → INANIMABLE par partie, lourds.
Donc : Recraft = bon pour un asset fixe vectorisé, PAS pour de l'animation par parties.

**Piège prompt** : "crée une PIÈCE D'OR" force le fond doré/parchemin dans l'intention même (Gemini dérive
sépia même si on verrouille la palette). L'intention du prompt conditionne le rendu — formuler le sujet
voulu, pas l'objet-support.

**Transposable** (Aziz) : inserts Mapbox (scène gravée qui surgit sur la carte), Hero-d'état (objet central
riche vivant au lieu d'une icône Lucide), Atlas. Méthode = [[CONTINUITE-SCENE-INTENTION-DABORD]] : générer
le SVG AVEC les éléments animables prévus pour le geste (calé sur la voix), pas générer puis chercher quoi animer.

**Preuves** : `out/_r-and-d/svg-anime-coin/` (protos mp4 + SVG). Code : `src/projects/_proto-16-9/SenegalCoinFaceA_SVG.tsx`
(+ probe `SenegalCoinSVGProbe.tsx`). Geste prouvé : navire charge ("pompent") puis fade ("repartent"), océan respire, derrick pompe.

**⛔ 3 ERREURS D'EXÉCUTION récurrentes (repérées par Aziz, scène 1 — à VÉRIFIER à chaque branchement/assemblage) :**
1. **AUDIO mal calé** : `narration-v3-VALIDEE.mp3` est la narration COMPLÈTE (492s). Un segment de scène commence
   à un OFFSET absolu (ex: duel à 20.08s). Mettre `OFFSET=0` → l'audio démarre sur "avril 2026" (début du fichier).
   TOUJOURS `startFrom=<offset_absolu>` ET `endAt=<fin_phrase>` (sinon enchaîne sur la scène suivante). Le segment
   absolu vient de `senegal-scene1-alignment.py` (WINDOW_OFFSET) ; vérifier par transcription whisper des 1res/dernières s.
2. **TAILLE rabaissée au branchement** : un proto validé à DIAM=920 repassait à 620 (valeur par défaut du template)
   en branchant dans le CoinFlip. Re-vérifier la taille validée après tout branchement de composant.
3. **Asset FANTÔME après changement de source** : en passant Face B du bitmap au SVG, le bloc FISSURE référençait
   encore l'ancien `<image href={COIN_B}>` → la pièce "revenait" au bitmap à la cassure. Après tout changement
   d'asset/source : GREP toutes les références à l'ancien asset dans le fichier (pas juste le branchement principal).
Cause commune : on modifie le point d'entrée mais pas TOUS les usages. → auto-vérifier les frames clés (début, milieu,
transition, fin) AVANT de présenter — Aziz a attrapé les 3 sur la vidéo, pas moi.

## 🎬 SCÈNE & CONTINUITÉ

### 2026-06-21 — ⭐⭐ CARTE SOUVERAIN : jetons géo-ancrés + projeter un drapeau SANS dériver (3 méthodes, 2 pièges)

**Leçon MAJEURE transversale prouvée par render** (scène test `TokenShowcaseV5`). Pour POSER quoi que ce soit sur
une carte Mapbox avec PITCH (relief V5), il y a des pièges qui reviennent à chaque fois — d'où ce repère unique.
**Détail complet (NE PAS dupliquer ailleurs, c'est LA source) : `memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md`.**
Résumé non substituable : (1) **jetons** = `TokenFrame` hexagonal, 2 modes (navy pour SVG animé / fill pour
image-drapeau-sceau), taille pilotée par le zoom (anti-agglutination) ; (2) **projeter un drapeau sur un pays** :
SVG clippé DÉRIVE au pitch · fill-pattern CARRELLE au dézoom · ✅ source-image découpée (`MapboxCountryFlagDecal`)
= la seule robuste ; (3) appel SVG dédié des jetons via `scripts/tools/llm-gen-svg.py` (GPT-5.5 préféré, Gemini ok).

### 2026-06-18 — ⭐⭐ DOCTRINE : INTENTION→forme→template (jamais l'inverse) + continuité du monde

**Leçon MAJEURE transversale, prouvée 2× du 1er coup** (hook Sénégal + sa suite fracture). Le problème
récurrent d'Aziz : *"à chaque nouvelle scène ou prolongement, ça redevient problématique, on tâtonne, on
hésite, on refait"*. Cause = **pas "trop de templates", mais l'ORDRE d'invocation.** Le réflexe template-first
(*"lequel de nos 71 composants colle ?"*) PARALYSE (rien ne colle "à 100%", ~10 essais). La méthode qui marche
= **sens→forme→template** : (1) que doit FAIRE ressentir ce moment ? (1 verbe) (2) quelle forme porte ça ?
(3) a-t-on déjà cette forme ? oui→adapter / non→coder (mais on sait QUOI). Mesure objective : intention-first
= 1 essai. Doctrine complète : `memory/doctrines/CONTINUITE-SCENE-INTENTION-DABORD.md`.
**+ Continuité du monde > nouveauté** : une scène = UN monde qui se transforme, pas une succession d'écrans.
Le vrai template réutilisable = le MONDE (carte+fond+chiffre), pas un composant. Prolonger, ne pas remplacer.
**+ Épure (fil rouge Aziz)** : l'écran ne double JAMAIS la voix ni l'animation. Garder l'essentiel, alléger le
reste. Test : si le texte à l'écran peut être lu à voix haute en même temps que la narration → il double → réduire.

### 2026-06-18 — ⭐ Forced alignment ElevenLabs > Whisper pour le CALAGE d'animation

Pour caler une animation sur la voix, utiliser le **forced alignment ElevenLabs** (`/v1/forced-alignment`,
loss < 0.3), PAS Whisper. Whisper **dérive de ~0.4s** : sur le hook Sénégal il situait "saute" à 11.46s, le
forced alignment à 11.84s (le vrai). 0.4s d'écart = un SFX/animation qui tombe à côté. Script de réf :
`scripts/senegal-hook-alignment.py` (texte = TTS exact SANS tags, audio = extrait). Règle : caler l'animation
pour **culminer ~1s AVANT** le mot-clé (l'image précède l'oreille = vivacité ; en retard = sensation de lenteur).

⚠️ **NUANCE (2026-06-21, scène gisements Sénégal) — un fichier d'alignment peut être FAUX SUR LE CONTENU,
pas juste imprécis.** Le `scene1-alignment.json` (ElevenLabs) prétendait « opéré par BP » à 52s alors que la
voix RÉELLE dit « un gisement, il en a trouvé trois » (vérifié par Whisper sur le segment + écoute). J'allais
coder une jauge **60%** alors que la voix dit **18%** (Petrosen détient 18% de Sangomar ; le 60% est une AUTRE
scène, après 104s). **Donc** : avant de caler une scène sur un fichier d'alignment hérité, TRANSCRIRE le segment
réel (Whisper API `scripts/tools/whisper-align.py` suffit pour le TEXTE/structure) et confronter au fichier.
Whisper = bon pour le TEXTE et la structure des actes ; ElevenLabs forced-align = pour le CALAGE fin une fois
le bon texte établi. Les deux ne s'opposent pas : Whisper vérifie QUOI/QUAND grossier, ElevenLabs affine le QUAND.
Cas d'école de la règle « fichiers de navigation périment → vérifier l'état RÉEL du livrable » appliquée à l'audio.

⛔ **ÉPILOGUE (2026-07-04, passe de finition Sénégal V3)** — ce même `scene1-alignment.json` avait en fait
un **loss aberrant sur plusieurs mots** (>2.0, et un mot "on" étalé sur 6.8s→13.6s — signe clair de dérive
causée par un mauvais découpage de la fenêtre audio source `/tmp/senegal-s1-window.mp3`), resté non détecté
car personne n'avait vérifié le LOSS SCORE du fichier avant de coder toute une scène dessus. Résultat concret :
`AUDIO_START` de la scène était décalé de +12.5s par rapport à la réalité, causant un dédoublement audio massif
au montage (texte répété entre deux scènes consécutives). **Règle ajoutée** : avant de figer un `AUDIO_START`
sur un fichier de forced-align hérité, vérifier le `loss` de chaque mot-clé utilisé — un loss > 1.5-2.0 ou une
durée de mot anormale (plusieurs secondes) est un signal de dérive du fichier lui-même, pas juste d'imprécision.
Recroiser avec UNE source indépendante (nouveau forced-align sur le fichier source complet + Whisper) avant de
coder. **Corollaire** : si un forced-align est confirmé corrompu, REFAIRE proprement l'appel API (scripts
`scripts/senegal-scene1-realign.py` / `scene4-5-realign.py`, réutilisables comme template) plutôt que de
reconstruire le timing à la main par déduction — reconstruire à la main risque de recréer le même genre
d'erreur de dérive qu'on cherchait à corriger (constaté : une reconstruction manuelle a eu besoin d'un 2e
passage de correction dans la même session).

### 2026-06-18 — DA-brief VIDÉO : analyse d'écart vers refs, Gemini = signal filtré

Pour faire monter en gamme une scène FINIE (mouvement/rythme/son), `scripts/tools/gemini-video-da-brief.py`
(upload vidéo complète Gemini 3.1 Pro). NE PAS envoyer nos templates (= retomber dans le piège catalogue) :
décrire nos intentions + donner des **refs de niveau** (Bloomberg/FT/Economist, Vox/Kurzgesagt) + demander
l'ÉCART. Cadrer "ne pas ajouter de texte" (protège l'épure). FILTRER après (Gemini = signal) : sur la scène 0,
gardé 4 vrais gains (grain+ombres = anti vectoriel-plat, faille chaude vs néon, easing expo, micro-tremblement),
jeté sa note 5/10 + un faux point (bug déjà corrigé). Tester fiabilité upload d'abord (`gemini-video-upload-test.py`).

---

## 🔊 AUDIO & SOUS-TITRES

### 2026-06-08 — Beats codes pour compo GLOBALE vs rendus STANDALONE : 3 pieges qui donnent ecran noir + queue morte + musique coupee

Symptome (Peste 1347, assemblage) : 8-24s d'ecran noir au debut de Beat2/Beat3, puis queue figee de meme duree en fin, et musique qui "coupe et reprend" entre beats. Cause = les beats ecrits pour vivre dans UNE compo globale (ou `frame` = position dans l'audio complet) mais rendus en compositions STANDALONE (frame part de 0). Trois bugs distincts a corriger ENSEMBLE :

1. **`localF = frame - beatStart`** -> standalone, `localF` negatif pendant `beatStart` frames = tout invisible. **Fix : `localF = frame`** (les pivots sont deja relatifs `PIVOT - beatStart`, ils s'alignent). Audio idem : `startFrom={beatStart} trimAfter={beatStart+beatDur}`, virer les `<Sequence from={beatStart}>` qui retardent la voix.
2. **`durationInFrames` = valeur ABSOLUE de fin** (ex 691 = SETUP_END absolu) au lieu de la DUREE (449 = END-START) -> queue morte = `dureeAbsolue - dureeReelle` frames figees. **Fix : durationInFrames = beatEnd - beatStart.**
3. **Musique par beat** (1 balise `<Audio music>` dans chaque beat, redemarre a 0 + Beat4 utilisait un AUTRE morceau) -> coupure audible a chaque jonction. **Fix : retirer la musique des beats, la poser en 1 SEULE piste continue au concat ffmpeg final** (`amix` voix+SFX avec 1 morceau, fade in 1.5s + fade out 4s, vol ~0.06). Verifier le niveau a chaque jonction (`ffmpeg -ss T -t 0.5 -af volumedetect`) = doit rester constant ~-15dB.

Verif anti-figé apres assemblage : echantillonner 1 frame/2s, comparer le md5 (frame identique a t-2 = figee) + taille <15KB = noir.

⛔ **4e piege trouve en reassemblant apres un fix de code (peste-1347, 2026-07-01)** : meme en respectant les
points 1-3 (musique en 1 piste), si la NARRATION reste concatenee par segments (chaque beat garde son propre
`<Audio startFrom= trimAfter=>` sur le fichier narration source, et on concatene les beats DEJA rendus avec leur
son), on obtient quand meme des coupures nettes audibles a chaque frontiere de beat — meme fichier source, mais
6 flux audio recolles au lieu d'un seul continu. **Fix : au REASSEMBLAGE (pas au premier render), rejouer le
fichier narration SOURCE ORIGINAL en 1 SEUL flux continu par-dessus la video concatenee rendue SILENCIEUSE
(`-an` sur le concat video), plutot que de garder l'audio deja decoupe par beat.** Verifier ensuite l'absence de
derive cumulative : comparer les durees RELATIVES de render par beat (`durationInFrames` Root.tsx) aux durees
ABSOLUES de la narration source (timing.ts) — un ecart CONSTANT et faible (~2 frames, padding initial) est
normal, un ecart qui GRANDIT progressivement d'un beat a l'autre indique une vraie derive a corriger.

### 2026-06-08 — Sous-titres : ffmpeg local SANS libass -> overlay couche Remotion ProRes alpha

Le ffmpeg brew local (8.0.1) est compile SANS libass : les filtres `subtitles` et `ass` n'existent pas
(`ffmpeg -filters | grep -i subtitle` = vide), impossible de burn un SRT directement. **Contournement valide :**
1. Forced-alignment ElevenLabs (`POST /v1/forced-alignment`, file+text, header `xi-api-key`) -> JSON mots.
   ATTENTION : passer le texte DE-ACCENTUE (comme le TTS d'origine) sinon mismatch ; ré-accentuer ensuite pour l'affichage.
2. Generer un SRT (grouper mots par ponctuation forte + max ~42 char = sous-titres lisibles, pas karaoke).
3. Composant Remotion `<Subtitles>` (fond transparent, lit les cues, style maison) -> rendre en ProRes 4444 alpha :
   `--codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png` (PNG OBLIGATOIRE pour alpha).
   `--public-dir=/tmp/empty-public` si la couche n'a pas d'assets (evite la copie 1.3GB qui bloque le render).
4. Overlay sur la video : `ffmpeg -i video.mp4 -i subs.mov -filter_complex "[0:v][1:v]overlay=0:0:shortest=1[v]" -map "[v]" -map 0:a`.
Le filtre `overlay` LUI est dispo sans libass. Bonus : style sous-titres 100% controle Remotion (coherent charte).
⛔ **PIEGE reproduit 2026-07-01 (peste-1347)** : si `--prores-profile=4444` est OMIS (meme avec `--pixel-format=
yuva444p10le` demande), Remotion encode SANS canal alpha (`pix_fmt` reel = `yuv444p10le`, sans le "a") sans
erreur ni warning. L'overlay produit alors un ecran QUASI-NOIR sur toute la video (le calque opaque ecrase tout).
**Symptome diagnostique rapide** : bitrate du fichier assemble final anormalement bas (~70 kb/s au lieu de
plusieurs milliers) + `ffprobe -show_entries stream=pix_fmt` sur le fichier subs.mov ne montre PAS de "a" dans
le pix_fmt. Verifier ce point AVANT de lancer l'overlay final, pas apres.

### 2026-07-04 — ffmpeg local SANS drawtext -> incruster du texte via PNG + overlay (cartouches de source)
Le ffmpeg local n'a PAS non plus le filtre `drawtext` (compile sans libfreetype ; `ffmpeg -filters | grep drawtext`
= vide). Pour incruster un cartouche de source / texte sur une video (ex : sources factuelles bas d'ecran de
l'assemblage Senegal V3) : (1) generer un PNG du texte via PIL (police systeme, ex `DIN Condensed Bold` = condensee
majuscule proche BebasNeue), fond transparent ; (2) overlay ffmpeg AVEC `-loop 1 -framerate 30` sur l'entree PNG
(SINON le `fade` in/out ne s'applique pas a un PNG statique — piege) :
`ffmpeg -i in.mp4 -loop 1 -framerate 30 -t <dur> -i tag.png -filter_complex "[1]format=rgba,fade=in:st=A:d=0.5:alpha=1,fade=out:st=B-0.5:d=0.5:alpha=1[t];[0][t]overlay=64:H-92:enable='between(t,A,B)'"`.
Meme famille que le gotcha libass ci-dessus (ffmpeg amoindri = on overlay une couche image au lieu du filtre natif).

### 2026-07-04 — Compression video web : CRF 27 preset slow + faststart pour livrer < 200MB (catbox)
Livrer une video mobile-friendly sous la limite catbox (200MB) : `ffmpeg -crf 27 -preset slow -movflags +faststart
-c:a aac -b:a 128k`. Prouve Senegal V3 : 203MB -> 60MB en 1080p sans perte visible. Le motion design navy/or
(aplats, peu de grain) compresse TRES bien -> CRF 27 = bon defaut pour nos livrables. (Baisser le CRF si la video
a beaucoup de film grain/bruit.) `+faststart` = lecture qui demarre avant fin du telechargement (mobile).

### 2026-06-08 — Remotion `<Audio>` : `trimAfter` est ABSOLU (depuis le debut du media), pas relatif a `startFrom`

**Bug couteux (Beat5 Peste, v13/14/15)** : la voix etait ABSENTE de 3 renders sans qu'on le remarque (la musique masquait). Cause :
```tsx
<Audio src=... startFrom={2323} trimAfter={651} />  // BUG : joue de 2323 a 651 = intervalle VIDE = silence
```
`startFrom` (alias `trimBefore`) ET `trimAfter` sont TOUS DEUX en frames depuis le DEBUT du fichier (doc Remotion confirmee via Context7). `trimAfter={651}` < `startFrom={2323}` -> rien.
**Fix** : `trimAfter = startFrom + dureeVoulue`, ex `trimAfter={2323 + BEAT_DUR}`.
**Regle de verif audio (NON-NEGOTIABLE avant "audio OK")** : mesurer le niveau REEL dans le render, jamais se fier au code.
`ffmpeg -i render.mp4 -vn out.wav` puis `ffmpeg -ss T -t D -i out.wav -af volumedetect -f null -` -> mean_volume.
Voix presente ~ -15 a -20 dB ; quasi-silence <= -32 dB. Si Aziz dit "je n'entends pas la voix", LE CROIRE et instrumenter.

### 2026-07-04 — Décaler une constante de timing SANS recalculer ses dérivées réintroduit le même bug qu'on vient de corriger

En corrigeant un bug de dédoublement audio (Sénégal V3), `AUDIO_START` d'une scène a été décalé (49.5s →
53.70s) pour répondre à une demande de montage — mais la constante `END` (calculée depuis l'ancien
`AUDIO_START`) n'a pas été recalculée en conséquence, et surtout l'élément `<Audio>` n'avait **aucun
`endAt`** du tout : il jouait donc jusqu'à la fin du RENDER (durée totale de la composition) au lieu de
s'arrêter au bon moment, rejouant un bout de texte déjà présent dans la scène suivante. Le bug n'a été
détecté qu'en réassemblant le montage COMPLET (pas la scène isolée) et en transcrivant TOUTES les jonctions
avec Whisper — un test scène-par-scène ne l'aurait pas révélé puisque chaque scène individuelle semblait
correcte. **Règle** : quand on décale une constante de timing dont d'autres constantes dépendent (`END`,
durées de composition, offsets de SFX), TOUJOURS grep toutes les constantes DÉRIVÉES et vérifier qu'elles
sont recalculées — et vérifier explicitement que CHAQUE élément `<Audio>` a un `endAt`/`trimAfter` défini,
jamais supposer qu'il s'arrêtera correctement tout seul à la fin du render. Après toute correction de bug de
timing, réassembler et re-transcrire le montage COMPLET (pas juste la scène touchée) avant de conclure.

### 2026-07-04 — Whisper "small" peut halluciner des répétitions → utiliser "medium" pour confirmer un diagnostic de bug audio

Un premier test de détection de dédoublement audio (jonction de montage) avec le modèle Whisper **small**
n'a PAS détecté un bug réel (faux négatif) — un second test avec le modèle **medium** l'a confirmé
clairement. Le modèle small a tendance à halluciner des répétitions de segments sur de l'audio ambigu,
ce qui peut aussi bien masquer un vrai bug que faire croire à un faux positif. **Règle** : pour toute
vérification de bug audio (dédoublement, trou, coupure) par transcription automatique, utiliser le modèle
**medium** au minimum pour confirmer avant de conclure "pas de bug" — le modèle small sert seulement de
premier passage rapide, jamais de verdict final.

---

### 2026-06-05 — Musique 1 morceau -> plusieurs durees video (fenetre + fade)

Une video evolue en duree pendant l'iteration. Pour une musique qui colle a chaque duree SANS coupure : generer 1 SEUL morceau Minimax (brut ~146s, le garder), puis decouper une fenetre par duree + fondu de sortie (`ffmpeg -t N -af afade=out`). MEME morceau partout = zero raccord, le fade masque la coupure (l'oreille entend une conclusion). JAMAIS assembler plusieurs morceaux ni regenerer. Recette complete : `memory/tools/minimax.md` section "musique 1 morceau -> plusieurs durees".

---

## 🗺️ MAPBOX & RENDU GÉO

### 2026-06-08 — Stroke = couleur du fill -> frontieres invisibles (zones colorees pleines)

Colorer un pays `fill={MALI_GOLD} stroke={MALI_GOLD}` (meme couleur) = les frontieres disparaissent dans l'aplat. Aziz : "on voit juste de l'or, pas les frontieres". **Fix : stroke contraste** (ocre sombre `#7a4e10` sur or) + baisser le fillOpacity (~0.8) + monter strokeWidth (0.9) et strokeOpacity (0.9). Vaut pour toute zone coloree pleine ou la geo doit rester lisible.

### 2026-06-08 — Pays a territoires d'outre-mer : colorier l'ISO entier rougit des taches "en pleine mer"

Colorier `ISO_PLAGUE` (FRA, NOR, NLD, PRT, SWE...) remplit AUSSI leurs territoires lointains : FRA->Guyane (Amerique du Sud),
NOR->Svalbard (Arctique), NLD->Caraibes, PRT->Acores. Au pull-back / vue large -> taches de couleur isolees en plein ocean.
**Fix** : `<clipPath>` rectangulaire sur la zone continentale visee, applique au `<g>` qui rend les pays.
Pour l'Europe (carte peste mercLarge 720x1280) : `<rect x={118} y={236} width={470} height={328} />`. Le rect est en coords
SVG carte ; sur un `<g transform=camera>`, le clip s'applique dans l'espace local (apres transform) = coords carte = correct,
clip stable a tout zoom. Meme nature que le bug `mainlandBox` des drapeaux (`useClipFlags`).

### 2026-07-04 — Composant Mapbox CANONIQUE promu sans reprendre les patterns déjà éprouvés ailleurs dans le même projet

`CartoSouverainV5.tsx` (composant Mapbox "canonique", utilisé par 3 scènes Sénégal V3 différentes) n'avait
NI `map.resize()` NI `delayRender`/`continueRender` — causant (a) un flash "petit carré non plein écran" aux
premières frames de chaque scène (le canvas Mapbox s'initialise parfois avant que son container ait sa taille
CSS finale, race condition headless connue), et (b) un flash gris avant que le style Mapbox ne soit peint
(`style.load` ne garantit qu'un JSON de style appliqué, pas un vrai paint GPU — il faut `map.once("idle", ...)`
avant `continueRender`). **Le pire** : un AUTRE composant Mapbox du MÊME projet, `MapboxIsolateZone.tsx`, avait
déjà ce pattern `delayRender`/`continueRender` correctement implémenté — le composant "canonique" nouvellement
promu l'avait tout simplement oublié/pas cherché. **Règle** : avant d'écrire ou de valider un composant partagé
qui gère un problème structurel connu (headless WebGL, race conditions, chargement async), grep les composants
existants du même domaine dans le projet pour vérifier s'ils ont déjà résolu ce problème — un composant
"canonique" doit être audité CONTRE l'existant, pas juste écrit à neuf en supposant qu'il n'y a rien à reprendre.
Fix appliqué : `map.resize()` + `map.once("idle", () => continueRender(handle))` dans `style.load`, avec un
`delayRender()` au montage. Bénéficie à toutes les scènes qui utilisent ce composant partagé.

### 2026-07-04 — Render Mapbox local échoue "Failed to initialize WebGL" → chercher le script dédié AVANT de suspecter le GPU

`npx remotion render <CompoMapbox>` échouait systématiquement avec `Failed to initialize WebGL`, y compris
après nettoyage de process zombies `chrome-headless-shell` (donc pas un problème de ressources GPU saturées).
La vraie cause : il fallait utiliser `scripts/render-mapbox.sh <CompoId> <output.mp4>`, qui encapsule les
vrais prérequis (chrome-headless-shell explicite, `--public-dir` symlinké "slim" pour éviter de copier ~2.4GB
de `public/` à chaque render, flag `--gl=angle`). Le script existait déjà dans le projet et n'a été trouvé
qu'après qu'Aziz ait demandé explicitement "as-tu utilisé le script dédié aux renders Mapbox ?" — plusieurs
tentatives de diagnostic GPU (kill de process, `--concurrency=1`, redémarrage) auraient été évitées en
cherchant d'abord `ls scripts/*.sh scripts/render-*` avant de suspecter l'environnement.

---

## 🤖 BRIEF AGENTS

> ⭐ **Doctrines absorbées dans `memory/doctrines/PRODUCTION-AGENTIQUE-REMOTION.md` et `PRODUCTION-AGENTIQUE-SVG.md`.**
> Les règles ci-dessous (visualWeight, background, dimensions) sont des COMPLÉMENTS CONCRETS pas encore dans les doctrines.

### Règles brief agents codage Remotion (NON-NEGOTIABLE)

**Règle 1 — visualWeight :** Tout brief doit inclure `"visualWeight"` pour les éléments dominants.
- Ex: `"le chiffre doit remplir 60-70% du diamètre du cercle"` — les agents respectent les px mais pas l'intention visuelle.

**Règle 2 — Placeholder réaliste :** Quand un composant accepte une image externe, toujours générer un placeholder Gemini Flash AVANT le render de validation — jamais un PNG 1px (= rendu injugeable).

**Règle 3 — BACKGROUND :** Famille reveal-mécanique : fond `#080d14` ou plus sombre (`#060a10`). JAMAIS `bg-navy` sans instruction — les agents defaultent dessus. Astuce : `"background": "#060a10 — PAS bg-navy"` dans le brief JSON.

**Règle 4 — PROPORTIONS LABELS :** Labels textuels dans les composants reveal-mécanique = fontSize MAX 32px, opacity 0.6-0.7. Ils sont DÉCORATIFS. Astuce : `"labels": "DÉCORATIFS — fontSize 28-32px max"`.

**Règle 5 — DIMENSIONS EXPLICITES EN PX :** Tout élément central = dimensions en px dans le brief, NON-RÉDUCTIBLES. Exemples validés : OdometerFlip CASE_WIDTH=240, CASE_HEIGHT=300, fontSize=220.

**Anti-pattern confirmé :** Ne jamais continuer sur du code existant non-template — archiver et repartir à zéro avec la bonne architecture.

---

## ✅ FACT-CHECK

## ⛔⛔ GATE FACT-CHECK D'ATTRIBUTION — AVANT de graver toute scène qui NOMME une personne / attribue une technique / un lieu / une citation (2026-06-25, GGW Beat 4) — NON-NEGOCIABLE, TOUS PROJETS

**L'erreur (a failli graver une fausse attribution dans le pilote GGW)** : on a produit un Beat 4 avec le portrait de
**Yacouba Sawadogo** (zaï, Burkina Faso, qui PLANTE des arbres dans ses trous) sur la phrase-climax « réveille des racines
encore vivantes… **sans planter un seul arbre** ». Or cette phrase = la signature de **Tony Rinaudo / FMNR au Niger**
(« without planting a single tree, simply by recognizing what was there, literally at our feet ») — pas Sawadogo. PIRE :
le script mélangeait DEUX mécanismes distincts dans une scène (demi-lune = CREUSER pour retenir l'eau ; FMNR = TAILLER
les souches déjà vivantes, sans creuser). C'est **Aziz** qui a rattrapé l'erreur en demandant une double-recherche, pas Claude.

**Cause racine** : tous les éléments du script étaient INDIVIDUELLEMENT vrais (demi-lunes réelles, FMNR réelle, Sahel, 200M
arbres Niger), donc le script « sonnait vrai » et a passé la recherche de sujet. Mais l'**ATTRIBUTION précise** (qui a fait
quoi, où, quelle technique pour quelle phrase) n'a JAMAIS été vérifiée comme étape dédiée — elle a été improvisée au moment
de produire la scène (choix du portrait). Un fait vrai + une attribution fausse = mensonge à l'écran, potentiellement
catastrophique (on nomme une vraie personne décédée).

**LA RÈGLE (gate bloquante)** : dès qu'une scène va NOMMER une personne réelle, ATTRIBUER une technique/invention/citation,
ou situer un fait dans un PAYS précis → AVANT de produire/graver, faire une **double-recherche d'attribution** (2+ sources
indépendantes) répondant à : QUI a fait QUOI, OÙ, et la citation/phrase est-elle de CETTE personne ? Vérifier surtout les
cas « ça sonne vrai » (le plus dangereux). Ne JAMAIS coller un visage/nom sur une phrase sans avoir confirmé l'attribution.
Si deux figures/techniques/lieux sont proches (Sawadogo/zaï/Burkina VS Rinaudo/FMNR/Niger), les SÉPARER explicitement —
ne pas les fondre par commodité narrative. Le découpage audio PAR BEAT permet de corriger une seule scène sans toucher le reste.

**⛔ RENFORCEMENT — vérifier l'ORIGINE et l'ANTÉRIORITÉ, pas seulement l'identité (2026-06-25, Aziz)** : quand on attribue
un GESTE, un SAVOIR, une DÉCOUVERTE ou une INVENTION à quelqu'un, ne pas se contenter de vérifier que la personne existe et
est liée au sujet. Vérifier RIGOUREUSEMENT que **c'est vraiment ELLE qui est à l'origine** : a-t-elle posé ce geste / eu cette
idée EN PREMIER, ou d'autres l'avaient-ils fait/su AVANT ? Le savoir était-il déjà répandu (auquel cas « X l'a découvert »
est faux) ou réellement nouveau ? Inversement, un savoir présenté comme « ancestral / les gens connaissaient déjà » l'était-il
vraiment, ou est-ce une redécouverte par UNE personne (cas GGW : on a failli écrire « les paysans du Sahel connaissaient déjà »
alors que c'est Rinaudo qui a VU que les souches arrachées étaient vivantes — les paysans ne le savaient pas). Ne JAMAIS
affirmer l'origine/la paternité/l'antériorité sans l'avoir vérifiée. Dans le doute, formuler en TANDEM/rôles distincts
(« X a découvert, les paysans ont propagé ») plutôt qu'attribuer faussement à un seul. C'est une faute aussi grave qu'un faux
chiffre : elle réécrit l'Histoire à l'écran.

## ⛔⛔ GATE COHÉRENCE INTER-BEATS — auditer la CHAÎNE causale/mécanique sur TOUS les beats ENSEMBLE avant de graver (2026-06-25, GGW) — NON-NEGOCIABLE

**L'erreur (révélée en auditant GGW)** : on a écrit le script SCÈNE PAR SCÈNE et validé chaque scène ISOLÉMENT. Résultat :
le Beat 4 introduisait une « cuvette en demi-lune » et le Beat 5 y référait (« là où ces cuvettes captent la pluie, l'eau
remonte… +17m »). Quand on a dû corriger le B4 (mélange de 2 techniques), on a découvert que le B5 EN DÉPENDAIT — et que le
short fusionnait en réalité DEUX techniques distinctes comme si c'en était une seule : les DEMI-LUNES/zaï (creuser → capter
l'eau → la nappe remonte, le « +17m ») ET la FMNR (protéger/tailler les souches vivantes → les arbres reviennent, « sans
planter », « 200M arbres »). Vrai au Niger toutes les deux, mais EFFETS et GESTES différents — les fondre = raccourci faux.

**LA RÈGLE (gate bloquante)** : avant de graver un script multi-scènes, faire un AUDIT DE LA CHAÎNE sur l'ensemble des beats,
PAS scène par scène : (1) tout terme/mécanisme/objet introduit à un beat et RÉFÉRENCÉ à un autre (« ces cuvettes », « cette
technique ») doit avoir un antécédent cohérent ; (2) une CAUSE → un EFFET : ne pas attribuer à un mécanisme un effet qui
appartient à un autre (la nappe qui remonte = les demi-lunes ; les arbres qui reviennent = la FMNR) ; (3) une seule solution-
héros si possible — si plusieurs coexistent, les DISTINGUER explicitement, jamais les fondre. Relire le script EN ENTIER en
traçant chaque mécanisme d'un bout à l'autre. Corollaire SVG (notre force) : changer un audio/une scène par beat est peu
coûteux (audios découpés par beat, re-timing du code) — donc autant CORRIGER LE SCRIPT À FOND dès qu'une incohérence apparaît,
plutôt que rustiner une scène. Lié à [[la gate fact-check d'attribution ci-dessus]].

## FACT-CHECK chiffres récents : Sonar Deep Research via OpenRouter + le piège "chiffre daté/trompeur" (2026-06-14, War-Map P4)

**Capacité (réutilisable)** : pour vérifier des chiffres À JOUR (2025-2026) avant de les afficher dans une vidéo,
appeler **Perplexity Sonar Deep Research via OpenRouter** : `OPENROUTER_API_KEY` (déjà dans .env) + endpoint
`https://openrouter.ai/api/v1/chat/completions` + modèle `perplexity/sonar-deep-research` (30-120s, ~$0.10-0.20,
sources incluses). Pattern de script : `/tmp/sonar-p4-ressources.py` (réf : anciens scripts archivés
`scripts/_archive/episodes-livres/perplexity-fact-check-*.py`). Workflow : WebSearch d'abord (rapide, gratuit) →
Sonar pour verrouiller/corriger les chiffres incertains. Aziz : "lance une recherche Perplexity Sonar Pro pour les
chiffres dont on est incertain, comme ça on n'a pas à refaire".

**LE PIÈGE (vérifié, important)** : un chiffre que CITE un modèle (Gemini/Kimi dans un DA-brief) peut être DATÉ ou
TROMPEUR. Ex P4 : Kimi proposait des camemberts "Niger ~5% production uranium mondiale" → fact-check : c'était 4,7%
en 2021 mais **1,6% en 2024** (Orano retiré, ~0 export après le coup). Afficher un % de PRODUCTION aurait CONTREDIT
le message "levier qui permet de tenir". → Solution : afficher les **RÉSERVES** (Niger = 6% des réserves mondiales =
le levier DURABLE), pas la production volatile. **RÈGLE : ne JAMAIS afficher un chiffre cité par un modèle sans
fact-check ; distinguer production (conjoncturel, volatil) vs réserves/rang/infrastructure (structurel, solide).**

## Boucle d'autoreview beat (éprouvée 2026-06-20, cobaye DataHero)

- **Le score global Gemini est INSTABLE entre 2 appels** : sur le même beat, après des fixes qui ont objectivement amélioré l'alignement (match_pct par phase 50→65, 55→65), le score global est PASSÉ DE 6.5 À 5.5. Cause : Gemini change de grille de lecture d'un appel à l'autre (appel 2 a halluciné un cadrage "horizontal→vertical 9:16" et pénalisé un badge placeholder volontaire).
- **Conséquence pratique** : se fier aux `match_pct` PAR PHASE (granularité stable) plutôt qu'au `score` global (bruité). Et confirmer : Gemini = signal, jamais juge. La self-review (mon œil sur frames vs storyboard) reste le juge — ici elle convergeait avec l'appel 1 (6.5, même fix n°1 = glow diffus).
- **Tri des fixes Gemini contre le code réel = indispensable** : sur 5 fixes proposés à l'appel 1, 3 étaient hallucinés (fontFamily Bebas DÉJÀ appliquée l.80 CountUp ; monospace annotations DÉJÀ appliqué ; strokeDasharray inventé absent du storyboard). Seuls 2 étaient vrais (glow trop diffus, annotations trop simples/peu contrastées). Appliquer aveuglément aurait dégradé.
- **Outillage de la boucle** : `scripts/visual_review.py --model gemini --storyboard ... --output ...` fonctionne. GAP : le champ `review` du JSON est tantôt une string JSON, tantôt un dict déjà parsé (selon l'appel) — tout parseur doit gérer les deux. Et `score`/`verdict` au niveau racine restent à "?" (non extraits du sous-objet). À durcir si on automatise un gate sur le score.

---

## ⛔ GOTCHA `remotion still` sur compo Mapbox = toujours gris (2026-06-25, scène 5 coulisses)

- **Symptôme** : `npx remotion still src/index.ts <compo> frame.png --frame=300 --gl=angle` → carte grise même avec token correct en `.env`. La carte n'apparaît JAMAIS dans un still, quelle que soit la frame.
- **Cause** : `remotion still` rend exactement 1 frame dans un processus frais. Mapbox (WebGL headless) met ~60-100 frames pour charger les tiles + style. Un still à frame=300 ne donne pas le temps à la map de charger → carte grise systématique.
- **RÈGLE** : pour vérifier des frames d'une scène Mapbox, **toujours rendre la vidéo COMPLÈTE** (ou un segment long ≥300 frames depuis le début), puis extraire avec `ffmpeg -ss <sec> -vframes 1 -update 1 <out>.png`. Ne jamais utiliser `remotion still` pour juger une scène Mapbox — le résultat est toujours trompeur.
- **Validation frame dans le render vidéo** = carte correcte. Prouvé : `scene5-coulisses-v6.mp4` → stills gris, mais `ffmpeg -ss 20` → carte pleine avec drapeau SEN drapé.

## ⛔ GOTCHA hook pre-presentation-review = review.json ET override.md tous les deux requis (2026-06-25)

- **Symptôme** : upload bloqué avec "PreToolUse hook error: No stderr output" même si `review-override.md` existe.
- **Cause** : le hook vérifie D'ABORD l'existence de `<mp4>.review.json`. Si ce fichier est ABSENT → blocage avant même de lire l'override. L'override seul ne suffit pas.
- **RÈGLE** : pour passer le gate avec un faux positif Gemini, il faut les DEUX fichiers plus récents que le mp4 :
  1. `python3 scripts/visual_review.py <mp4> --model gemini --output <mp4-sans-.mp4>.review.json`
  2. Écrire `<mp4-sans-.mp4>.review-override.md` (justification point par point)
  3. Les deux doivent être PLUS RÉCENTS que le mp4 (`ls -lt` pour vérifier)
- **Ordre d'écriture correct** : render mp4 → review.json → review-override.md → upload.

## ⛔ GOTCHA render Mapbox PARTIEL court = fausse carte grise (2026-06-21, scène gisements V5)

- **Symptôme** : un render `./scripts/render-mapbox.sh <compo> out.mp4 --frames=1185-1195` (segment COURT) produit une frame où **la carte a disparu / est grise/vide**. On croit à un bug de la scène (caméra cassée, élément manquant) → on diagnostique dans le vide, on perd du temps.
- **Cause RÉELLE** : la carte Mapbox (WebGL headless) met ~15-20 frames à finir de charger (`style.load` + tiles). Un render qui DÉMARRE à frame 1185 n'a pas le temps de charger avant la frame 1190 extraite → carte grise. Ce n'est PAS un bug de la scène, c'est un artefact du render partiel trop court.
- **RÈGLE** : pour juger une frame TARDIVE d'une scène Mapbox, rendre un **segment LONG** (≥100-150 frames AVANT la frame cible) pour laisser la map charger, PUIS extraire la frame voulue avec ffmpeg. Ne jamais conclure « bug » sur un render `--frames=A-B` court où A est loin du début. Prouvé : la même frame 1190 montrait du gris en render 1185-1195, et la carte complète en render 1040-1210.
- **Corollaire** : ce gotcha a masqué un VRAI problème (flux d'export trop fins, 1.6px → invisibles). Toujours distinguer « artefact de render » de « effet réellement absent » en re-rendant proprement AVANT de modifier le code.

## 🔗 check-links.py — angle mort sur la résolution depuis l'auto-memory (2026-06-25)
**Bug prouvé** : `check-links.py` valide les chemins depuis `ROOT` (racine projet), PAS depuis l'emplacement réel d'un lien relatif écrit dans l'auto-memory (`.claude/projects/.../memory/MEMORY.md`). Conséquence : il peut afficher « 0 lien mort » alors que des liens relatifs DANS MEMORY.md sont cassés (vu : 3 liens `../../../` au lieu de `../../../../` non détectés).
**Profondeur correcte** depuis l'auto-memory vers le workspace = **4 niveaux** : `../../../../Workspace/remotion/memory/...` (l'auto-memory est à `.claude/projects/-Users-clawdbot-Workspace-remotion/memory/`).
**Règle** : après réécriture de MEMORY.md, valider AUSSI par résolution absolue réelle (`os.path.normpath(os.path.join(auto_dir, target))`), pas seulement check-links.py.
**Système 2 mémoires** : memory/ workspace (419 .md) ET auto-memory (257 .md) sont SÉPARÉS. Fichiers racine sans préfixe `feedbacks/` dans MEMORY.md = souvent dans l'auto-memory (chemin court) ; fichiers `feedbacks/feedback_*` = workspace (chemin 4-niveaux). Ne pas uniformiser aveuglément.

## ⚠️ Pattern de dérive #1 : doctrine révisée → feedbacks/index pas rétropropagés (2026-06-25)
**Cause racine de presque toute l'incohérence mémoire** (diagnostiquée sur 3 vagues d'audit). Quand une doctrine est RÉVISÉE, les feedbacks et index plus anciens gardent l'ANCIENNE version et la contredisent activement. Un agent vierge lit le feedback périmé et fait **l'inverse** de la doctrine actuelle.
**Exemples corrigés 2026-06-25** : `feedback_flagfill` disait useClipFlags=NON-NEGOTIABLE (V5 dit BANNI au pitch→MapboxCountryFlagDecal) · 2 feedbacks "scan template d'abord" (doctrine = INTENTION-d'abord) · rules-atlas §7 `flipX:true` (bug moonwalk) · CLAUDE.md lui-même en retard sur les drapeaux V5.
**How to apply** : à CHAQUE révision de doctrine, faire un `grep` du sujet dans `memory/feedbacks/` + CLAUDE.md + les index, et rétropropager (bandeau "⚠️ MAJ <date>" en tête du feedback périmé, pas suppression — le corps reste utile dans son ancien contexte). Le feedback est la couche qui dérive le plus vite car personne ne le re-relit.
**Corollaire** : nos PROPRES ménages créent des régressions (fichier supprimé encore cité, fichier extrait non documenté dans l'index). Après toute purge/refactor, `grep` les noms supprimés/déplacés dans TOUTE la mémoire, pas seulement les 8 fichiers de check-links.py (qui ne couvre pas feedbacks/NEXT-ACTION/tools/ ni la résolution relative depuis l'auto-memory).

## 🎬 SVG narratif : SCÈNE-ÉCOSYSTÈME, jamais OBJET-DANS-CADRE (2026-06-29, cacao B3/B4)
**Cas déclencheur** : briefs SVG cacao (verger/tablette/CI-usine) → cibles correctes en objets MAIS « des arbres à droite à gauche », tablette posée sur 2 traits dans du vide, CI = patate beige au milieu du parchemin. Aziz : « où sont nos scènes narratives comme la Grande Muraille Verte ? »
**Cause racine** : le brief décrivait des OBJETS dans un cadre, pas une SCÈNE. Un objet + 2 lignes de sol = inventaire, pas récit.
**La référence-étalon** (ce qui RACONTE) = la pièce-malédiction Sénégal (`SenegalCoinFaceA_SVG`, render `scene1-intro-coin-FINAL.mp4`) : derrick qui POMPE au-dessus de la mer + navire qui FLOTTE sur la mer + vagues qui REMPLISSENT le bas. Chaque élément AGIT sur les autres dans UN espace unifié. Idem GGW : champ avec échelle premier-plan/fond, sol qui se fend + racines SOUS l'horizon, mosaïque en perspective qu'on traverse.
**RÈGLE (à mettre dans tout brief SVG narratif)** :
1. **Scène-écosystème** : avant-plan FORT (un objet-héros proche, grand), sol ET ciel HABITÉS, éléments EN RELATION/action les uns sur les autres. PAS un objet centré dans du vide.
2. **Matière partout** : le « vide GGW » = respiration CIBLÉE, pas un fond mort. Remplir : sol (feuilles, cabosses, sillons), ciel (soleil correct, oiseaux, collines horizon), accessoires qui racontent le travail.
3. **Perspective qu'on traverse** : 3/4 plongeante, point de fuite, étagement profond — pas frontal-frise.
4. **Joindre la frame pièce-malédiction + frames GGW** comme refs de NIVEAU (strictement : « ne copie pas, vise CETTE richesse »).
**How to apply** : avant de juger une cible SVG « bonne », test = « est-ce que les éléments INTERAGISSENT dans un monde, ou sont-ils juste posés ? ». Si posés → re-brief écosystème. Lié à [[SVG-FAISABILITE-AMONT]] et au pré-plan DA cacao.

## ⚠️ LE SCRIPT TEXTE EST PÉRIMÉ DÈS QUE L'AUDIO FINAL EST VALIDÉ (Cacao B5, 2026-06-29)
**Cas prouvé** : le CTA de B5 dans SCRIPT-V4 ("quel produit veux-tu qu'on suive jusqu'au bout") DIFFÉRAIT de l'audio
réel ("quel produit t'intéresse le plus que tu voudrais voir traité en vidéo" + "la version longue DE CETTE VIDEO").
Aziz l'a signalé d'instinct ; transcription Whisper de l'audio FINAL l'a confirmé.
**RÈGLE** : pour tout beat avec narration FINAL, le fichier de référence du karaoké/des supports calés sur la voix =
l'AUDIO (transcrit Whisper word-level), JAMAIS le script texte. Avant de coder le karaoké d'un beat : (1) transcrire
l'audio réel (`scripts/tools/whisper-align.py <beat>-FINAL.mp3 --out <beat>-words.ts`), (2) confronter au script,
(3) coder sur l'audio. Le script peut avoir été ré-écrit après la génération TTS sans que l'audio soit regénéré.
**How to apply** : flaguer "⛔ TEXTE PÉRIMÉ, vérité = <beat>-words.ts" dans tout script/DA-brief dès qu'une divergence
audio↔script est trouvée, pour qu'un agent futur ne reparte pas sur le mauvais texte.

---

## SFX premium : réutiliser la palette GGW + ALIGNER par force alignment (prouvé cacao 2026-06-29)
**Leçon** : pour poser les SFX d'un short SVG encre/parchemin, 2 règles qui font la différence premium.
**Why** : les SFX décident de la perception "premium" autant que la musique ; mal placés (estimation manuelle), ils sonnent faux.
**How to apply** :
1. **RÉUTILISER avant créer** : la palette `public/audio/ggw-muraille-verte/sfx/` (sillon=trace, pousse=vie,
   fissure, goutte=fuite, soleil-embrase=colorisation, ombre-dissoute, reveal-souterrain=racines, vent=ambiance) est
   le MÊME registre que tout short encre/parchemin. + UI `_shared/sfx/ui/` (stamp-dossier, plate-pop). ⛔ reveal.mp3 BANNI.
   Ne créer (ElevenLabs `sound-generation`, prompts EN sobres) que les 3-5 gestes manquants. Parcimonie : 8-22 events max.
2. **FORCE ALIGNMENT** (sinon décalages perçus) : reconstruire la timeline ABSOLUE des mots depuis les `beatN-words.ts`
   (Whisper word-level déjà dispo) + offsets cumulatifs des beats (frames/30). Caler chaque SFX sur le MOT déclencheur,
   pas sur une estimation. Volumes 0.08-0.38 SOUS la narration ; vérifier mix (mean/max dB, pas de clipping).
3. Spotting délégable à un agent (lui donner timeline + inventaire SFX réel). Mais le TIMING final = force alignment, pas l'agent.

---

## PERSONNAGE VIVANT = animation procédurale frame-driven (PAS sprites, PAS rig-LLM-en-bloc) — 2026-06-30 ⭐⭐
Faire AGIR un personnage dans une scène SVG (marche/penche/ramasse/transporte/dépose/plante/porte) = silhouette
stick figure SIMPLE (segments DROITS, pictogramme digne) animée 100% par CODE via `useCurrentFrame` + une fonction
cinématique source-de-vérité (`computePose`). Validé Aziz sur cacao + GGW, 9:16 ET 16:9, 1 à 3 personnages.

**Le corps n'est jamais le problème — l'ANIMATION l'est.** 5 causes-racines à connaître (détail : la feuille de
route) :
- marche qui "glisse" → **FOOT-PLANT** (le pied d'appui reste fixe au sol pendant son appui ; clamp y≤0).
- penché qui bascule en arrière → **COMPENSATION DU BASSIN** (le bassin RECULE + DESCEND quand le torse se penche).
- objet qui "lévite" → **machine à états + HOLD + objet enfant-de-la-main** : l'objet reste collé à la position
  RÉELLE de la main (`computePose`), JAMAIS de glissade autonome vers sa cible — c'est la main qui l'amène. Le corps
  s'arrête AVANT le contenant (`depotStopX`) pour que la main tendue arrive au-dessus.
- Marche = translation à vitesse CONSTANTE (linéaire, pas d'easing sur les segments de marche).
- **arrêt de marche qui "saute" (2026-07-01)** → couper `moving: true→false` net fige les jambes en pleine foulée
  (parfois écartées). FIX : `moveAmt` continu (0..1) qui décroît sur ~15 frames AVANT l'arrêt, jamais un cut.
  Résiduel mineur même avec le fix — acceptable en proto, à reprendre si visible en vraie production.

**2 personnages qui interagissent (2026-07-01, piste "B" R&D 16:9 narratif)** : prouvé sur `passer-objet-main-a-main`
(planteur→acheteur, `PasserObjetMainAMain.tsx`). Nouveau param `offerReach` (bras tendu HORIZONTAL ~88°, ≠ `armReach`
qui pointe vers le sol pour ramasser) + `handoffState` (`objectHandling.ts`) : objet suit main A → point de contact
FIGÉ au frame du HOLD (pas recalculé en continu, sinon glissade) → suit main B. Calculer la distance entre les 2
persos pour que les mains tendues se REJOIGNENT (vérifié numériquement, pas à l'œil — 1er essai avait 250px d'écart).

**LLM (GLM/GPT/Gemini) = banc d'idées UTILE (capacité, pas plafond), mais NE PAS prendre un rig généré EN BLOC** :
le rig "noodle"/courbes tue le pictogramme. On garde NOS lignes droites et on pilote la cadence nous-mêmes.

**8 DIRECTIONS complétées (2026-07-01/02) — profil/3-4/dos/face × miroir** : 2 familles de projection de jambe,
JAMAIS interchangeables — LATÉRALE (profil/3-4 : le pas se lit en X écran, near/far = longueur+amplitude
différentes) vs PROFONDEUR (dos/face : le pas se lit en Y écran, PAS X — piège du 1er essai dos qui a réutilisé
la mécanique latérale = lisait comme un pas chassé, pas une marche vers le fond ; bug repéré par Aziz, confirmé
fondamental par Gemini+GPT). Dos et face partagent la MÊME formule Y-stride, seul le signe de `advance` s'inverse
(vers la caméra vs vers le fond). Draw-order : FIXE en 3/4 (far toujours derrière), DYNAMIQUE en dos/face (par
profondeur réelle du pied) — ne JAMAIS mélanger les 2 (bug trouvé en consolidant : jambes qui se chevauchent).
Honnêteté technique confirmée par 2 modèles : le DOS PUR est la vue la plus limitée du système (même les jeux
vidéo trichent en 3/4-dos). Méthode qui a payé 3× : proto isolé → render EN MOUVEMENT (jamais un still) → si
doute, GPT-5.5 + Gemini 3.1 Pro EN PARALLÈLE, appliquer ce qui converge. Consolidé en briques partagées
(`rig/multiDirection.ts` + `rig/StickRigMultiDir.tsx`) après les 3 protos isolés, AVANT d'attaquer une scène
narrative qui change de vue en mouvement — éviter la duplication x3 de la même projection.

**Torse = 3e axe de différenciation perso** : au-delà de `tunicColor`, `tunicPattern` (rayures/col) et `neckwear`
(cravate/foulard noué) — combinables avec `ink` (trait) et `hat` (tête), reste pictogramme digne (pas caricatural).

**RÈGLE PRO 2026-07-02** : dos/face illisibles à petite échelle (contrainte géométrique 2D, pas un bug) →
`StickFigureSimplified` (Scale & Bob : rebond du corps + bras + échelle, sans jambes articulées) sous le seuil
d'échelle ~0.85. DÉCISION AZIZ : pas de marche de FACE en production (réservée gros plans/statique) — confirmé
par Gemini+GPT ET observation directe d'Aziz sur The Infographics Show (persos détaillés restent quasi
toujours en profil/3-4 en mouvement). Piste R&D ouverte : analyser The Infographics Show via yt-dlp
(frames+vision) → doctrine mise en scène/caméra. Détail : `PERSONNAGE-VIVANT-INDEX.md` § RÈGLE PRO.

**Biblio réutilisable — PARTIR D'ICI, ne pas recoder un perso de zéro** :
`src/projects/_shared/personnage-vivant-svg/` (`PERSONNAGE-VIVANT-INDEX.md` = doc · `rig/poses.ts` = cinématique
source de vérité · `rig/StickRig.tsx` = rig générique ink+hat(straw/cap/scarf)+carry · `rig/objectHandling.ts` ·
`scenes-proto/RecolteAuSol.tsx`). Feuille de route anim (Gemini+web concordants) :
`memory/episodes/souverain/cacao-chocolat-short/ANIMATION-STICKFIGURE-FEUILLE-ROUTE.md`. Évolution : [[IDEE-PERSO-8-DIRECTIONS]].

**Portrait stylisé d'une personne RÉELLE identifiable = toujours partir d'une VRAIE PHOTO, jamais d'une
illustration déjà stylisée (2026-07-05, War-Map Sahel P4)** : pour régénérer/corriger un portrait de
dirigeant réel (Goïta/Traoré/Tiani), la 1re tentative a utilisé l'ancienne illustration stylisée du
projet comme référence de ressemblance pour Gemini (style cible = `soldier-aes.png`) — REJETÉE par Aziz,
résultat = visages génériques en treillis militaire, plus la même personne. Fix qui a marché : télécharger
la vraie photo officielle (Wikipedia/Commons, licence libre) de la personne, PUIS la restyliser via
Recraft (`image_to_image` + `remove_background`, style extrait via `create_style` depuis un asset déjà
validé du projet) — fidèle ET net au downscale. Le modèle de génération dérive vers un visage générique
dès que la référence de ressemblance n'est plus une vraie photo, même si l'illustration de départ était
censée représenter la même personne.

**Quand une direction visuelle est rejetée 2 fois pour la MÊME raison de fond, changer de PARADIGME à la
3e tentative, pas ajuster les détails (2026-07-05, visuel CEDEAO War-Map Sahel)** : tentative 1
(marqueurs+flèches hors-cadre, 2026-07-01) et tentative 2 (bande+flèches créant des triangles visibles
dans l'océan, 2026-07-04) rejetées pour le même défaut de fond ("pas assez concret / trop symbolique").
La tentative 3, validée, a changé de paradigme entier (vraie géographie des pays menaçants via zoom
élargi + contours réels extraits d'un atlas mondial, plutôt qu'un symbole abstrait affiné) au lieu de
re-doser la tentative 2. Signal à surveiller : 2 rejets consécutifs pour la même raison = le problème
n'est pas dans l'exécution, il est dans l'approche choisie.

**IPv6 mort dans le sandbox réseau bloque silencieusement TOUT client Python HTTPS (2026-07-05)** :
`yt-dlp`, `google-genai` (Gemini), `requests` (OpenRouter) restaient bloqués sans erreur ni respect du
timeout déclaré sur toute requête réseau, alors que `curl` répondait normalement en <2s sur les mêmes hosts.
Root cause : `getaddrinfo()` renvoie les adresses IPv6 avant les IPv4, la route IPv6 sortante est totalement
morte dans ce sandbox (`networksetup -getinfo Wi-Fi` : "IPv6 IP address: none"), et Python n'a pas de
fallback rapide type happy-eyeballs contrairement à `curl` — la connexion reste pendue bien au-delà du
timeout. Diagnostic qui débloque en ~20 min : comparer `curl -6 https://<host>` (timeout) vs `curl -4` (rapide)
sur le host concerné. Fix : `yt-dlp --force-ipv4` (flag natif) ; pour tout autre script Python sans flag
IPv4, wrapper permanent `scripts/tools/run_ipv4.py` (monkeypatch `socket.getaddrinfo` via `runpy`, usage :
`python3 scripts/tools/run_ipv4.py <script.py> [args]`). Si un script Python "traîne" sans output ni erreur
sur un appel réseau externe dans ce projet, suspecter ce gotcha en premier avant de conclure à une limitation
d'environnement ou un problème d'API. Détail complet : `memory/tools/yt-dlp.md`.

## Dépendance manquante `@remotion/motion-blur` casse TOUT le bundle Remotion (2026-07-07)
Le fichier commité `src/projects/_shared/_demos/KineticMaskSlamFX.tsx` importe `@remotion/motion-blur`, MAIS
ce package n'était NI installé (`node_modules/`) NI dans `package.json`. Comme Remotion bundle TOUT `src/` en
un seul build, un import non résolu dans N'IMPORTE quel fichier fait échouer le bundle ENTIER (`Error: Module
not found: Can't resolve '@remotion/motion-blur'`) — donc un render d'une compo qui n'a RIEN à voir échoue.
Symptôme trompeur : un render antérieur pouvait "passer" via le cache de bundle Remotion, puis échouer après
invalidation du cache. Fix : `npm install @remotion/motion-blur@<version-remotion>` (aligner sur la version de
`remotion` dans package.json, ici 4.0.456). Leçon : un `Module not found` au bundle Remotine pointe le FICHIER
fautif dans le message — ce n'est pas forcément la compo qu'on rend. Chercher `grep -rln "<module>" src/`.
