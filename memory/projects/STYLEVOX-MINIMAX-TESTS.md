# StyleVox — reverse-engineering playlist YouTube pour tests MiniMax H3 local

> Playlist source : https://www.youtube.com/playlist?list=PLcCOeqQFwGts ("Ai motion animation", 21 vidéos, perso Aziz).
> But : identifier ce qui, dans les techniques "Vox-style motion graphics" montrées (majoritairement Claude Code + Omni/Higgsfield/Kling), est TRANSPOSABLE en local avec MiniMax H3 (gratuit, pas d'API payante) — clips test 5-10s.
> Contexte doctrine existante : [[vox-generation-vs-composition-deterministe-moat]] (constat : ces pipelines = orchestration de générateurs payants, pas de l'animation ; notre composition déterministe D3/Mapbox/SVG reste le moat) · [[REVERSE-STYLE-VIDEO-VERS-ASSETS]] (méthode reverse-engineering éprouvée : yt-dlp transcript+frames → breakdown image-générée vs overlay-code).
> Statut : analyse en cours (2026-08-13), 6 agents en parallèle sur les 21 vidéos. PAS encore de test H3 lancé — synthèse à valider par Aziz avant tout rendu.

## Méthode

Chaque agent : `yt-dlp --force-ipv4` pour transcript/sous-titres + thumbnails/frames clés (PAS de scraping manuel — règle CLAUDE.md). Objectif par vidéo : structure de scène, technique de prompt/découpage en shots, ce qui est transposable en local H3 (texte/prompt/structure) vs ce qui dépend d'un outil tiers payant (Omni/Higgsfield/Kling — à écarter pour ce test).

## Lots

- Agent 1 : vidéo #08 seule (1h24, hors gabarit)
- Agent 2 : #19, #06, #13, #01
- Agent 3 : #17, #03, #02, #07
- Agent 4 : #10, #12, #18, #21
- Agent 5 : #14, #16, #15, #20
- Agent 6 : #05, #04, #09, #11

## Résultats par vidéo

<!-- chaque agent ajoute ses fiches ici, format : ### N. Titre (id) -->

### 10. Claude just Edited an Entire Vox Documentary From Scratch! (Here's How) (PaXuebdY75U)

**Structure de scène/pipeline** : script unique de 60 secondes, un sujet, décliné sur **6 scènes/settings différents** (un thème par scène : compteur d'années, personnage+texte, horloge, carte du monde, graphique, citation finale). Chaque scène contient elle-même 2 à 3 "shots" internes qui s'enchaînent par transition (ex. scène 1 : pop-up année → reveal personnage+texte → horloge+texte). Pipeline en 3 étapes explicites : (1) script + voix-off, (2) design des scènes (images statiques), (3) animation des designs. Budget annoncé : ~20$ de crédits Higgsfield pour les 6 animations (avec tests inclus).

**Techniques de prompt** — la vidéo décrit une méthode d'entraînement en 3 "skills" Claude, construits à partir d'un corpus de référence, plutôt que des formulations de prompt final citées mot à mot :
- Étape "editor brain" : téléchargement de 10 documentaires Vox aimés → transcription complète avec timestamps via ElevenLabs Speech-to-Text (export JSON) → upload de scripts+vidéos à Claude avec consigne : *"study these documentaries and their scripts, analyze what's being said, look at the video, and analyze what's being shown, and deduce why"*. Résultat : un skill réutilisable ("Vox editor brain") qui, donné un script, planifie automatiquement scènes/moments-clés.
- Étape "design brain" : collecte de ~100 références de design Vox via Pinterest (recherche "Vox documentary animation design"), compilées dans un fichier Figma, exporté en PDF, uploadé à Claude avec consigne d'analyser *"the colors, shapes, text, objects, macro designs, micro details, and textures"* → skill "Vox design brain".
- Étape "animator brain" : décomposition manuelle (par le créateur, pas automatique) de chaque scène Vox en **5 assets systématiques** : (1) texte — animation "pop-up" minimale, (2) objet principal — animation "paper unfolding"/pop-up positionnel, (3) fond — statique, ne s'anime quasiment pas, (4) objets secondaires — animation subtile/statique, ajout de richesse visuelle, (5) mouvement de caméra — zoom in ou pan autour de la scène. Cette grille des 5 assets est explicitement présentée comme LA clé de l'imitation du style.
- Consigne d'exécution finale citée : *"make sure to use the rough, choppy, jittery Vox look on all the animations"* + demande de transitions entre scènes pour fluidifier le montage.

**Ce qui est TRANSPOSABLE en local avec MiniMax H3** :
- **La grille des 5 assets par scène** (texte pop-up / objet principal avec pop-up ou "unfolding" / fond statique / objets secondaires à animation subtile / un seul mouvement de caméra) est un gabarit de prompt directement réutilisable, indépendant de l'outil — à intégrer tel quel dans les prompts H3 texte-only.
- **Découpage narratif en scènes thématiques courtes** (1 idée = 1 scène = 1 shot ou 2-3 sous-shots liés) — structure de script transposable à notre découpage de beats.
- La consigne de style **"rough, choppy, jittery"** (paper-craft, imperfection assumée) comme descripteur de prompt à tester sur H3 pour viser l'esthétique flat/papercraft plutôt qu'un rendu lisse par défaut.
- La méthode de constitution d'un corpus de référence (10 vidéos transcrites + timestampées) pour calibrer un "brief de style" — transposable comme étape de préparation manuelle avant d'écrire nos propres prompts H3, même sans skill Claude automatisé.
- Un seul mouvement de caméra par scène (zoom OU pan, jamais les deux) — contrainte de prompt directement actionnable.

**Ce qui N'EST PAS transposable** :
- Higgsfield (Canvas 2.0) comme moteur de génération d'images ET de vidéo — outil payant tiers, hors périmètre H3.
- Les "3 skills Claude" eux-mêmes (fichiers de skill téléchargeables, entraînement automatisé par upload massif de PDF/JSON à Claude) — mécanique spécifique à l'écosystème Claude Skills + MCP Higgsfield, pas un prompt réutilisable en soi.
- Le pipeline complet script→voix (ElevenLabs)→plan Claude→génération Higgsfield→montage Premiere Pro — l'assemblage final reste un montage manuel classique (pas de code/composition déterministe).
- Le chiffrage ($20 de crédits) — sans objet pour H3 gratuit local.

**Incertitudes** :
- Le prompt EXACT envoyé à Higgsfield pour chaque scène (texte final généré par le "Vox animator brain") n'est jamais montré littéralement — seule la logique de construction (5 assets + style) est explicitée, pas la formulation finale mot à mot.
- Durée précise de chaque shot individuel non donnée (seule la durée totale ~60s pour 6 scènes est connue, soit ~10s/scène en moyenne, mais la répartition interne par sous-shot n'est pas précisée).
- Le degré réel d'automatisation du "skill" Claude vs. réglages manuels du créateur pendant les tests n'est pas clair — la vidéo est un contenu promotionnel (Ultimate Editors 2.0) et peut enjoliver la fluidité du process.

### 12. I Built Vox-Style AI Videos With Gemini Omni (RCjQZC5avmE)

**Structure de scène/pipeline** : pas de découpage précis en nombre de shots donné à l'écran — le créateur (Khalil, "AI for Real Life") décrit un pipeline en 5 étapes nommé explicitement dans une des vidéos-sources qu'il montre : *"sujet, recherche, script, style, clip, voix et assemblage"* (six étapes en réalité, citées en VO : research → script → visual style lock → shot-by-shot generation → voice → assembly). Insiste sur le fait que l'agent (Codex, dans son cas) doit construire un **système/app de storyboard réutilisable** plutôt que générer une image à la fois — citation-clé de la vidéo qu'il montre en extrait : *"Most AI filmmakers are still storyboarding one image at a time... There is a better way. Build a system that storyboards for you."*

**Techniques de prompt** :
- Prompt initial donné à Codex (agent IA, pas Claude ici) : *"based on the tools that we have available, and a Gemini API key... how close can we get to creating videos like the ones discussed in this video?"* — approche "montre une vidéo de référence à l'agent + laisse-le déduire le workflow", pas un prompt de shot individuel.
- Itération en 3 passes : (1) résultat trop générique → feedback *"that was okay... but based on the YouTube video, what are we missing here?"*, (2) nouvelle tentative encore insuffisante → *"how do we get to the next level?"*, (3) **étape clé qui débloque la qualité** : donner à l'agent le lien de la vidéo tuto ET lui dire explicitement d'aller chercher/lire la transcription et les descriptions pour ne pas "improviser à l'aveugle" — citation : *"make sure to reference these videos and other research to see how they're explaining how to do it so that you're not just going in blind."*
- Détail qualité observé et cité comme correction à faire : *"it does really well with big bold typography. But, when you get into the smaller sort of words right here, it doesn't always land... these aren't really words... it's just like gibberish."* — leçon : réserver le texte généré par IA aux gros titres, éviter le texte fin/dense qui devient illisible/faux.

**Ce qui est TRANSPOSABLE en local avec MiniMax H3** :
- **La méthode "montrer une vidéo de référence à l'agent + lui demander d'aller chercher la source (transcript, description) plutôt que de deviner"** — principe général transposable à notre propre travail actuel (c'est littéralement ce qu'on fait dans cette tâche).
- **Le découpage en 6 étapes (recherche → script → lock du style visuel → génération shot par shot → voix → assemblage)** — architecture de pipeline générique, indépendante de l'outil, directement applicable à un pipeline H3 local.
- **La règle "gros titres seulement, éviter le texte petit/dense"** — contrainte de prompt/design directement actionnable pour H3 (le texte généré par un modèle vidéo reste peu fiable sur du texte fin, donc réserver l'incrustation de texte petit au post-traitement/overlay code plutôt qu'au modèle génératif).
- **Le principe "verrouiller un style visuel avant de driver les beats de narration"** (cité dans l'extrait vidéo qu'il montre : *"lock a visual style, turn your narration into clear shot beats"*) — séquencement transposable : définir d'abord le langage visuel/palette avant de découper le script en shots.
- Le principe itératif "un prompt générique donne un résultat générique, il faut du contexte/référence concret pour dépasser le résultat AI slop" — leçon méthodologique transposable telle quelle.

**Ce qui N'EST PAS transposable** :
- Gemini Omni (le modèle vidéo générateur utilisé, payant, API Gemini) — remplacé par H3 dans notre test, donc tout détail spécifique à Omni (contrôle via clé API Gemini, comportement du modèle) est hors périmètre.
- Descript (mentionné comme outil d'assemblage/édition final via MCP) — outil tiers payant, à remplacer par notre propre pipeline de montage.
- Codex comme agent orchestrateur spécifique — le principe (agent qui construit un système réutilisable) est transposable, l'outil ne l'est pas (on utilise Claude Code).
- Le clonage vocal MiniMax mentionné en passant pour un test raté ("I think I used a MiniMax agent to get it done. It didn't really work out so well") — pas assez de détail pour être actionnable, et hors sujet (audio, pas vidéo H3).
- Toute la partie business/pédagogique (vente de mini-cours, communauté "School", Stan Store) — hors sujet technique.

**Incertitudes** :
- Aucun prompt de shot individuel n'est montré littéralement à l'écran ni cité verbalement au-delà des exemples généraux ci-dessus — le detail exact de ce que l'agent envoie au modèle vidéo (Gemini Omni) reste une boîte noire, gérée entièrement par Codex.
- La vidéo ne précise jamais la durée exacte des clips individuels générés (contrairement à d'autres vidéos de la playlist qui citent "8 secondes" etc.) — impossible de déduire un gabarit de durée de cette source.
- Le créateur admet lui-même ne pas savoir avec certitude quel MCP/API il utilisait exactement pour l'étape d'assemblage ("I have the Descript API set up on this or the Descript MCP, I'm not sure exactly which one") — signal que le pipeline montré est expérimental/pas totalement maîtrisé, à prendre avec prudence comme méthode de référence.

### 18. Create VOX-Style Motion Graphics (with Claude and Higgsfield) (SYDY3cbu0dE)

> Note méthode : yt-dlp a renvoyé une erreur HTTP 429 persistante sur les sous-titres auto de cette vidéo précise (4 tentatives, alors que les 3 autres vidéos du lot ont fonctionné sans problème) — sous-titres humains absents également. Transcript récupéré via l'outil TubeLab MCP (API légitime, pas de scraping manuel) en fallback. Vidéo en français, créateur "Marco" (chaîne "le labo") — le titre anglais donné dans la consigne est une traduction/erreur de métadonnée YouTube, le contenu correspond bien au sujet Claude+Higgsfield Vox motion graphics.

**Structure de scène/pipeline** : démonstration d'un **skill Claude téléchargeable** ("Vox Motion Graphics") connecté à Higgsfield (appelé "Xfield" à l'oral, agrégateur de modèles image/vidéo/audio) via MCP. Le skill orchestre une procédure en 6 étapes citée explicitement : *"sujet, recherche, script, style, clip, voix et assemblage"*. Deux tests montrés : (1) un short vertical 30s→1min généré quasi automatiquement à partir d'un sujet proposé par Claude lui-même, (2) un format horizontal avec script fourni par l'utilisateur et plus de contrôle manuel (choix du modèle image par séquence, image de référence personnelle intégrée). Coût mesuré : **~200 crédits Higgsfield pour 1 minute de vidéo**, soit ~6000 crédits/mois pour une cadence d'1 short/jour.

**Techniques de prompt** :
- Prompt initial minimal cité mot à mot : *"Je veux créer un short de 30 secondes avec une animation au motion design style vox. As-tu une idée ?"* — le skill Claude propose ensuite lui-même des sujets (ici lié à l'IA), l'utilisateur choisit et ajuste juste la durée (*"je vais un peu ajuster ma demande en lui demandant de faire une minute"*).
- Le skill précise par défaut le modèle **Google Omni pour des clips de 10 secondes**, mais le créateur signale qu'on peut sortir du preset pour prendre plus de contrôle modèle par modèle.
- Détail technique clé pour les scènes avec un visage humain/personnage identifiable : Google Omni "bloque" sur les visages humains (résultat raté avec une photo de référence), alors que le modèle **"SD 2.0" (Seedance 2.0)** réussit avec la même image de référence — citation : *"avec un visage humain, il semble un peu bloqué... je vais demander d'utiliser le modèle IA SD 2.0 à la place de Google Omni... c'est plutôt réussi."*
- Utilisation d'images de référence personnelles (photo de l'utilisateur préparée sur Canva) données à Claude avec une consigne de placement narratif précis : *"Utilise cette image pour la section du script où on mentionne les petits créateurs."*

**Ce qui est TRANSPOSABLE en local avec MiniMax H3** :
- **Le découpage en 6 étapes du pipeline** (sujet → recherche → script → style → clip → voix → assemblage) — architecture générique transposable telle quelle à un pipeline H3 local (recoupe celle de la vidéo #12).
- **La leçon "modèle bloqué sur les visages humains identifiables → changer de modèle pour cette scène précise"** — principe transposable même si H3 n'est pas Omni : tester d'abord H3 sur les scènes à personnage/visage, et si le rendu échoue, ne pas s'acharner sur le même prompt mais isoler cette scène spécifique.
- **Utiliser une image de référence pour ancrer un personnage/objet clé dans une scène précise du script** — principe de prompt/workflow transposable (H3 accepte potentiellement des images de référence selon le mode utilisé — à vérifier techniquement, mais le PRINCIPE de "une scène = une référence visuelle dédiée" est indépendant de l'outil).
- **Le prompt minimal suffit à amorcer une scène** ("une simple consigne a suffi" est même le teaser d'ouverture de la vidéo) — rejoint l'observation d'autres vidéos du lot : ne pas sur-complexifier le prompt initial, itérer ensuite scène par scène.
- Le défaut identifié sur les sous-titres générés automatiquement trop grands en format vertical — signal utile : préférer générer nos propres sous-titres/overlays en post-traitement (comme on fait déjà) plutôt que de compter sur un rendu automatique de l'outil.

**Ce qui N'EST PAS transposable** :
- Higgsfield/Xfield comme agrégateur multi-modèles (Google Omni, Seedance 2.0, clonage vocal) — outil payant tiers, écarté par construction pour ce test H3.
- Le clonage de voix perso via échantillon audio (fonctionnalité Xfield) — hors sujet H3 (gestion voix = ElevenLabs dans notre pipeline).
- Le problème signalé de perte du son/SFX original des clips dès qu'une voix est appliquée dans l'assembleur Xfield, et le contournement (générer une version sans voix pour garder les SFX, puis assembler soi-même) — bug/contournement spécifique à l'outil Xfield, sans objet pour notre propre pipeline de montage.
- Les chiffres de coût en crédits (200/minute, 6000/mois) — sans objet, H3 est gratuit en local.
- Le MCP Claude↔Xfield et le skill téléchargeable spécifique — mécanique propriétaire à cet écosystème.

**Incertitudes** :
- Le prompt exact envoyé au modèle vidéo (Omni ou Seedance) pour chaque scène individuelle n'est jamais affiché à l'écran ni cité intégralement — seule la logique de haut niveau (skill Claude qui orchestre) est visible, la formulation technique précise reste une boîte noire côté Claude/skill.
- Durée exacte de chaque clip/shot individuel non précisée au-delà du preset générique "10 secondes" mentionné pour Google Omni — pas de tableau de découpage shot par shot.
- Transcript récupéré via API tierce (TubeLab) plutôt que yt-dlp comme demandé en méthode — signalé explicitement ci-dessus pour transparence ; le contenu semble complet et cohérent (autres passages recoupent le teaser/l'intro visibles), mais n'a pas pu être croisé avec le fichier .vtt natif YouTube faute d'accès.

### 21. Mansa Musa, one of the wealthiest people who ever lived - Jessica Smith (O3YJMaL55TM)

> Note : conforme à l'hypothèse de la consigne — cette vidéo n'est PAS un tuto/making-of mais un **exemple de vidéo finie** dans le registre documentaire éducatif (probablement TED-Ed ou format proche, narratrice créditée "Jessica Smith"). Le transcript est un texte narratif pur, sans aucune trace de commentaire de production, prompt, ou outil cité. Fiche adaptée : structure narrative/visuelle déduite du script uniquement (pas d'extraction de frames effectuée — le texte suffisait à couvrir la structure demandée, cf. décision similaire prise sur la fiche vidéo #08 dans ce même document).

**Structure narrative/visuelle observée (déduite du script, ~4 min, pas de commentaire de production disponible)** :
- Ouverture accroche par question rhétorique directe à l'audience : *"if someone asked you who the richest people in history were who would you name"* — puis contraste attendu (Bill Gates, Rockefeller) vs. sujet réel (Mansa Musa) — pattern classique d'ouverture "attente déjouée" repérable dans le montage narratif Vox/documentaire éducatif.
- Structure chronologique classique en actes : (1) contexte d'accession au pouvoir (1312) et contraste géopolitique (Europe en crise vs. royaumes africains/monde islamique florissants), (2) mécanisme d'enrichissement (contrôle des routes commerciales via annexion de Tombouctou/Gao, ressources naturelles or/sel), (3) évènement spectaculaire central — le pèlerinage à la Mecque de 1324, décrit avec un luxe de détails chiffrés (entourage de dizaines de milliers, 500 hérauts, chameaux chargés d'or) — ce type d'évènement-choc unique est typiquement le "moment fort" qui structure ce genre de vidéo (équivalent d'un shot-signature), (4) conséquence/impact mesurable (inflation régionale provoquée par ses dépenses au Caire — un "chiffre qui frappe"), (5) legs culturel/héritage (carte catalane de 1375, université/mosquée de Tombouctou), (6) clôture sur la pérennité du legs (mausolées/bibliothèques encore debout).
- Chaque paragraphe/segment du script correspond clairement à UNE idée/UN fait, ce qui suggère (sans certitude, cf. incertitudes) un découpage en scènes courtes centrées chacune sur un fait ou visuel précis (carte, chiffre, personnage, monument) — cohérent avec le pattern "texte → scène" déjà documenté dans les vidéos #10/#12/#18 de ce lot.

**Techniques de "prompt"** : sans objet — aucune trace de production/prompt dans cette vidéo, cf. note ci-dessus.

**Ce qui est TRANSPOSABLE en local avec MiniMax H3** :
- **Le patron narratif lui-même comme gabarit de script** (accroche par question/attente déjouée → contexte → mécanisme → évènement-signature chiffré/spectaculaire → conséquence mesurable → legs/clôture) — directement réutilisable comme structure de script pour un test H3 Sahel/Souverain, indépendamment du sujet.
- **Un fait/chiffre marquant par segment** (500 hérauts, inflation régionale, université fondée) comme principe d'écriture transposable en consigne de scène-par-scène pour un pipeline H3 (chaque segment = 1 image-cible potentielle).
- Le principe déjà établi dans la doctrine du projet (accent sur le "chiffre qui frappe" et l'intention avant la forme) se retrouve validé empiriquement dans cette vidéo tierce, ce qui renforce (sans le redécouvrir) le principe déjà en mémoire projet plutôt que d'apporter une technique nouvelle.

**Ce qui N'EST PAS transposable** : sans objet — aucun outil de génération n'est identifiable ni mentionné dans cette vidéo, donc rien à écarter côté outil tiers.

**Incertitudes** :
- Impossible de confirmer si cette vidéo a été produite avec un pipeline IA (Vox-style motion graphics géré par un agent) ou s'il s'agit d'un montage traditionnel (After Effects manuel, type TED-Ed classique) — le transcript ne permet AUCUNE inférence sur l'outil de production, seulement sur la structure narrative. Vu le titre/chaîne (format très proche des vidéos TED-Ed existantes bien avant l'essor des agents IA), il est possible que ce soit un exemple historique DU registre visuel Vox, pas un exemple produit avec les techniques IA récentes décrites dans le reste de la playlist — à vérifier visuellement (frames) si Aziz veut trancher, ce qui n'a pas été fait ici faute de nécessité pour couvrir la grille de lecture demandée.
- Aucun découpage en timecodes/shots précis n'est déductible du texte seul — la correspondance "1 segment de script = 1 shot visuel" est une hypothèse plausible (cohérente avec le reste de la playlist) mais non vérifiée sur cette vidéo précise sans extraction de frames.

### 19. I Made a Vox-Style Explainer Video With One Prompt (Claude) (0-kbZa8Dagg)

**Structure de scène/pipeline** : le workflow entier est délégué à Claude Code via un MCP tiers (Higgsfield) qui donne accès à génération image/vidéo/voix/musique. Deux modes montrés : (1) un "Prompt Pack" — un mega-prompt copié-collé qui contient le sujet + instruction de recherche web + génération séquentielle ; (2) un "skill file" (`.skill.md`) attaché à Claude Code qui encapsule toute la logique (recherche, script, voix, images, assemblage) sans avoir à réexpliquer les étapes à chaque fois. Le format annoncé : vidéos découpées en "six blocks" de ~10s chacun pour un total de 60s (6 shots x 10s). Le pipeline exécuté par l'agent : 1) recherche web du sujet (cross-check sources), 2) génération du script/narration, 3) génération voix (AI voice ou clone perso via ElevenLabs-like), 4) génération images/vidéos par shot avec un style visuel verrouillé sur tous les shots ("shot 40 looks as good as shot one" — pas montré ici mais promis dans #06), 5) assemblage automatique en respectant le timing audio.

**Techniques de prompt** : le prompt pack n'est pas cité texte pour texte dans le transcript (il faut télécharger le doc depuis une communauté externe), mais la structure narrative de research est citée : *"Search the web for the real facts on this story. Cross-check every number against at least two independent sources. And list your sources at the end. If the number is disputed, use the conservative figure."* — c'est une consigne de recherche factuelle stricte insérée en tête de pipeline, avant toute génération visuelle. Le placeholder de sujet est en toutes lettres dans le prompt ("YOUR TOPIC" en gras). Modèle utilisé pour l'orchestration : Opus 5 (mais l'auteur précise que "ça marche avec n'importe quel modèle", dont Fable 5).

**Ce qui est transposable en local avec MiniMax H3** :
- La consigne de recherche factuelle en tête de pipeline (cross-check 2 sources, chiffre conservateur si disputé, sources listées) — directement réutilisable comme étape 0 avant tout prompt visuel, indépendamment de l'outil de génération.
- Le découpage en blocs de ~10s pour un total 60s (6 shots) — correspond bien à la limite de durée par clip de MiniMax H3 en local.
- Le principe "verrouiller le sujet dans un placeholder de prompt réutilisable" (template avec `{TOPIC}` à remplir) — transposable tel quel à un prompt H3 texte-only.
- Le principe général "texte d'abord (script+recherche), timing ensuite, image en dernier" — reste valide peu importe le moteur vidéo.

**Ce qui n'est PAS transposable** : tout le pipeline d'orchestration MCP Higgsfield (accès unifié à N modèles image/vidéo/voix/musique payants, incluant Nano Banana Pro pour les images) — dépend d'un abonnement Higgsfield tiers. Le clonage de voix ElevenLabs V3 intégré à Higgsfield (on a déjà notre propre pipeline ElevenLabs, donc redondant mais pas un obstacle). Le "skill file" complet n'est utilisable que si on le récrit nous-mêmes pour piloter H3 au lieu de Higgsfield.

**Incertitudes** : le contenu exact du prompt pack (les "six blocks") n'est jamais lu à l'écran en détail dans le transcript — seul le research prompt est cité. Impossible de confirmer la formulation exacte des prompts image/vidéo par shot (ex. mots-clés "papercraft", durée exacte par shot au-delà de "10 seconds each"). Le mapping precis entre script et prompts visuels par shot n'est pas visible dans les sous-titres (c'est un écran partagé, pas verbalisé).

---

### 06. Create Motion Graphics with Claude (Vox-style & More) (LiQPU7_5v68)

**Structure de scène/pipeline** : même socle que #19 (Claude Code + MCP Higgsfield), mais le workflow ici est en 2 étapes bien distinctes et transposables : (1) un premier appel à un LLM de chat (Claude) pour *écrire le prompt* ("ask it for a vox style prompt on my topic... I'm specific about the style that I want"), (2) copier ce prompt généré et le coller dans Claude Code avec l'instruction "take that prompt and build it" pour déclencher script→shots→voix→sync automatique. Insiste sur le fait que le même système marche pour n'importe quel style visuel, pas seulement Vox (démontré avec whiteboard doodle, paper cutout collage, cartoon coloré "ladybug facts"). Mentionne aussi Higgsfield Explainer en mode web direct (sans Claude), avec une bibliothèque de presets de style (pixel art, claymotion, mixed media, 3D, papercraft, 2D illustrator, whiteboard doodle, low poly, isometric, flat vector, fluffy toy).

**Techniques de prompt** : la formulation initiale donnée au premier LLM est citée quasi mot pour mot : *"why airline seats keep shrinking"* comme sujet, plus les précisions de style : *"I want a paper cutout collage. I want halftone archival photos, maybe some hand-drawn annotation arrows."* — donc un pattern **sujet + style visuel + éléments graphiques spécifiques (texture, photo effect, annotations)** donné en langage naturel à un LLM qui transforme ça en prompt structuré. Deux règles editoriales fortes citées : (1) *"pin your facts down before the plant, not after the render"* — vérifier tous les chiffres AVANT de lancer la génération, car corriger un chiffre faux dans le style Vox = régénérer le shot entier (le texte est "brûlé" dans le graphique, pas une voix-off qu'on peut juste réenregistrer) ; (2) *"don't only rely on presets... you want to customize everything"* — ne pas se contenter des styles préréglés génériques, sinon toutes les vidéos du niche se ressemblent.

**Ce qui est transposable en local avec MiniMax H3** :
- Le pattern en 2 appels séparés : LLM texte pour écrire/raffiner le prompt visuel détaillé, PUIS le moteur vidéo pour générer — correspond exactement à notre doctrine `svg-generatif-2-appels-fusion-par-claude` et à la doctrine Vox (2 appels max, fusion par Claude).
- La formule de prompt "sujet + style + texture/éléments graphiques spécifiques" (papercraft, halftone, hand-drawn arrows) est un excellent gabarit texte-only à réutiliser pour composer des prompts H3.
- La règle "vérifier les chiffres AVANT de générer, jamais après" — directement actionnable pour nos scripts Souverain/Atlas, s'applique à tout pipeline "texte brûlé dans le visuel".
- La règle "ne pas se reposer sur des presets génériques, personnaliser le style" — s'aligne avec notre doctrine maison (chercher la forme avant le template, pas l'inverse).
- Le principe de cohérence de style à travers tous les shots ("shot 40 looks as good as shot one") — objectif transposable, mais la MÉTHODE technique pour l'obtenir (verrouillage de style dans Higgsfield) ne l'est pas forcément 1:1 avec H3 ; à tester si H3 accepte un prompt de "art direction" répété identique par clip pour obtenir la cohérence.

**Ce qui n'est PAS transposable** : Higgsfield Explainer (interface web avec presets tout-en-un, payant), la bibliothèque de presets propriétaire (pixel art/claymotion/etc. — packagés Higgsfield, pas nos styles maison), le MCP Higgsfield lui-même pour la génération image/vidéo/voix, la fonctionnalité "générer une version espagnole" en un prompt (dépend de leur pipeline TTS multilingue intégré).

**Incertitudes** : le prompt exact généré par le premier appel LLM (le texte final "ready-to-paste prompt") n'est jamais lu à l'écran dans les sous-titres — seule la demande initiale en langage naturel est citée. Le mécanisme précis de "verrouillage de style" à travers les shots (paramètre technique côté Higgsfield) n'est pas détaillé — on ne sait pas si c'est un seed, un style-reference-image, ou juste un prompt répété.

---

### 13. How I Make Long Local LTX Videos Without Manually Running ComfyUI (ZYe3LH87VCQ)

**Note de cadrage** : le contenu réel diffère du titre de la playlist — le transcript ne mentionne jamais "LTX" explicitement, mais décrit un pipeline équivalent en logique : Codex (agent de code) pilotant ComfyUI en arrière-plan (l'auteur précise *"ComfyUI was running underneath, but I never opened or operated the Comfy UI interface myself"*), avec un outil nommé "Camera Lab" pour la timeline. C'est un pipeline narratif avec personnage récurrent (Mia), pas du motion-graphics façon Vox — mais la logique "agent de code pilote un moteur vidéo local, en autonomie, avec review humaine ciblée" est exactement le cas d'usage recherché pour MiniMax H3 local, d'où la pertinence.

**Structure de scène/pipeline** : 5 étapes, chacune notée par l'auteur sur une échelle 1-10 de "autonomie possible pour un agent" :
1. **Histoire et storyboard** (2/10 — l'auteur garde la main) : conversation avec un LLM pour construire fiches personnages, fiches de décor, storyboard réalisé avec un outil de génération d'image ("image two"). Point clé : *"every storyboard panel includes dialogue and camera movement"* — chaque case de storyboard porte le dialogue ET le mouvement de caméra prévu, pas juste une image statique.
2. **Keyframes haute résolution** (5/10) : le LLM qui connaît déjà toute l'histoire génère des images cohérentes (mêmes personnages, mêmes décors, même style) à partir du storyboard.
3. **Préparation du contexte pour l'agent** (9/10) : toutes les keyframes sont mises dans UN seul dossier, chaque fichier numéroté et nommé avec une courte description de la scène. Point clé cité : *"The agent does not just read the images. It also reads the file names. Together, they become the context for the entire film."* — le nom de fichier fait partie du contexte, pas seulement l'image.
4. **Génération des prompts + shots par l'agent** (10/10, autonomie totale) : l'agent (Codex + un "skill" custom) génère les prompts et pilote la timeline mieux que l'auteur ne le ferait lui-même. Génération de nuit, sans supervision — *"I let the agent handle it, even while I am sleeping. When I wake up, dozens of shots are already waiting for review."*
5. **Review** (1/10) : l'auteur ne laisse PAS l'agent juger la qualité vidéo — *"agents mainly evaluate extracted frames. They still do not truly understand motion... I decide whether the shot actually works."* Le point fort du système : chaque shot généré est lié à ses keyframes sources, donc un fix ciblé ("use the same key frames, but remove the subtitles") relance juste ce shot, pas tout le pipeline.
6. **Post-production** (1/10) : montage manuel, pas d'outil d'édition IA jugé assez bon — l'auteur sélectionne les meilleures prises et les assemble lui-même.

**Techniques de prompt** : pas de prompt texte cité verbatim, mais le principe de contexte est explicite et actionnable : dossier unique de keyframes numérotées + noms de fichiers descriptifs = tout le contexte nécessaire à l'agent, portable d'un agent à l'autre ("even if I switch to a different coding agent later, this folder already contains everything it needs").

**Ce qui est transposable en local avec MiniMax H3** :
- **Le plus directement réutilisable de toute la playlist** : le principe de dossier de keyframes numérotées + noms de fichiers descriptifs comme contexte agent — applicable tel quel à un pipeline H3 piloté par un agent Claude Code.
- Le principe "chaque shot a une adresse" (traçabilité shot ↔ keyframes sources ↔ prompt) permettant un fix ciblé sans tout regénérer — directement transposable à notre organisation de fichiers de scène.
- Le découpage responsabilité : agent autonome pour génération/nuit, humain pour le jugement qualité final (frames extraites insuffisantes pour juger le mouvement) — recoupe exactement notre propre règle `frame-espacee-sous-estime-mouvement-lecture-continue-prime` et la doctrine `verifier-son-propre-souvenir-comme-un-verdict-llm` : ne jamais laisser un agent juger la qualité du mouvement sur frames isolées.
- Le storyboard qui porte dialogue + mouvement de caméra dans CHAQUE case — bon gabarit pour nos propres storyboards avant génération H3.
- Génération "en masse pendant la nuit, review le matin" — un pattern opérationnel directement applicable puisque H3 tourne en local gratuitement (pas de coût à multiplier les tentatives, contrairement à un outil payant).

**Ce qui n'est PAS transposable** : l'outil "Camera Lab" spécifique (timeline visuelle propriétaire, pas documenté plus loin dans le transcript) et le "skill" Codex exact (mentionné "in the description", contenu non lu dans les sous-titres) — la logique est transposable, l'implémentation non. Codex lui-même (on utilise Claude Code, pas Codex, mais l'équivalence d'agent est directe).

**Incertitudes** : le nom du modèle vidéo local réellement utilisé sous ComfyUI n'est jamais dit dans le transcript (ni "LTX" ni un autre nom) — impossible de confirmer techniquement le moteur, seule la logique d'orchestration (agent pilote ComfyUI sans interface manuelle) est certaine. Le contenu exact du "skill" (prompts générés, structure de timeline) n'est pas visible, seul son EFFET est décrit.

---

### 01. Google Flow: Cart board Infinite Zoom Stop-Motion Tutorial (1foEcwd12qg)

**Structure de scène/pipeline** : la plus courte et la plus mécanique des 4. Un seul prompt long et structuré (pas de recherche web, pas d'agent orchestrateur) envoyé à un modèle vidéo appelé "Omni Flash" pour créer un effet de **zoom infini animé à travers plusieurs scènes** (façon stop-motion papercraft), en 1 seule génération de 10 secondes, format 16:9. Le prompt est découpé en 3 blocs fixes : (1) **core directive** — la consigne centrale ("create an animated infinite zoom through different scenes"), (2) **art direction** — le style visuel (papercraft/collage, textures, éléments physiques), (3) **supers** — instructions sur comment overlay les titres/textes sur chaque scène. Puis un bloc **script et timeline** avec timestamps précis par scène (ex. "from 0 to 2.5 seconds, this happens with this specific text ; then scene 2 from 2.5 to 5 seconds..."). Variante avec plus de contrôle : fournir 3 images de référence déjà préparées (avec le texte super déjà dessus) comme "ingredients" au lieu de tout décrire en texte, puis demander au modèle de créer la transition entre elles.

**Techniques de prompt** : structure de prompt citée en détail (mais pas verbatim intégral, juste la structure de blocs) : `core directive` + `art direction` + `supers` + `script and timeline avec timestamps`. Avertissement direct cité : *"pay close attention to the timeline. If your transitions are way too short, the model will struggle to create a good animation."* Sur le mode "image de référence" : l'auteur déconseille le "lock" sur la scène entière — *"locking it's mostly used to lock subjects. In this case, we want [it] to lock the whole scene. So it will struggle to do that."* — préférence pour référencer + décrire plutôt que locker, car locker toute une scène (pas juste un sujet) bride la créativité du modèle et donne des résultats moins cohérents avec la référence, paradoxalement.

**Ce qui est transposable en local avec MiniMax H3** :
- **La structure de prompt en 3 blocs (directive centrale / art direction / supers) + script à timestamps** est directement copiable comme gabarit texte pour un prompt H3, indépendamment du moteur.
- L'avertissement sur la durée des transitions (ne pas les faire trop courtes, sinon le modèle "lutte") — un principe empirique de dosage temporel réutilisable en test H3.
- Le principe "référencer une image sans la locker complètement quand on veut un CHANGEMENT (transition, zoom) plutôt qu'une réplique exacte" — pertinent si H3 accepte des images de référence en entrée, à vérifier.
- Le pattern "générer le style via un prompt d'art direction réutilisable tel quel entre plusieurs générations images/vidéos" (repris identique pour la partie images "Nano Banana Pro" du même pipeline) — transposable au texte-only H3 en gardant le même bloc art direction constant sur tous les clips d'un même projet.

**Ce qui n'est PAS transposable** : "Omni Flash" est un modèle propriétaire tiers spécifique (Google Flow / Higgsfield selon contexte de la playlist) — non disponible en local. La fonctionnalité "ingredients" (upload d'images de référence multiples avec drag-and-drop, "lock" par tag de scène) est une feature d'interface propre à cet outil, à vérifier si H3 propose un équivalent (image-to-video conditionné). L'édition conversationnelle d'image existante ("click to go inside, edit this image, add a super text...") dépend de l'éditeur intégré Google Flow/Nano Banana.

**Incertitudes** : le prompt complet n'est jamais lu texte pour texte à l'écran dans les sous-titres — seule la STRUCTURE en 4 sections (directive/art direction/supers/script-timeline) est verbalisée, pas le contenu mot à mot (l'auteur renvoie vers un document en commentaire, non accessible ici). Impossible de confirmer si "10 seconds" est une limite dure du modèle Omni Flash ou un choix arbitraire de l'auteur — à ne pas assumer comme contrainte transposable à H3 sans vérification.

### 8. Make Unlimited Explainer Videos with AI (FREE workflow) (hcpAQJz58Ng)

**Verdict global : quasi rien de transposable.** Cette vidéo (1h24) est un tutoriel produit/vente pour **Video Express (Viddyoze)**, un outil tiers payant, orchestré via un GPT custom fourni par le créateur (`viddyoze.com/workflow`) + une automatisation navigateur ChatGPT ("browser control", compte Plus $20/mois). Aucune démonstration de MiniMax, ni de prompt-engineering générique indépendant de l'outil — presque tout le contenu dépend de l'UI et de la logique interne de Video Express.

**Structure de scène/pipeline** (le seul niveau vraiment transposable) :
- Découpage en shots courts type explainer, assemblés séquentiellement (scène 1, scène 2, ... jusqu'à ~7-8 scènes pour une vidéo cible "60 secondes").
- Chaque scène = **1 plan continu, 1 seul mouvement de caméra**, généré indépendamment puis dragué-déposé dans une timeline.
- Durées volontairement **non uniformes** entre scènes ("some scenes are going to be 3 seconds long, some will be 6 seconds long") — le créateur explique explicitement que l'uniformité ennuie le spectateur ; variation de durée = choix délibéré pour maintenir l'intérêt.
- La durée totale dépasse souvent la cible annoncée (ex. vidéo "60s" qui finit à ~1min05) — accepté et découpé/crop après coup plutôt que forcé au montage.
- Format : la même séquence de scènes est régénérée deux fois (16:9 puis 9:16) via le GPT custom, avec des ajustements de copywriting pour le vertical (accroche des 5 premières secondes, transitions "plus dramatiques").

**Techniques de prompt — la seule checklist qualité citée textuellement** (le créateur affirme l'avoir "enseignée" à son GPT pour que chaque scène générée la respecte) :
> "narration is complete and naturally paced, one consistent narrator across all scenes, each prompt is self-contained, one continuous shot per scene, one camera movement per scene, no dependence on previous scenes, meaning that every scene is unique [...] stable geometry and lighting, minimal visual clutter, and clear explanatory story arc"

Autres fragments de prompt vus à l'écran (partiels, pas la structure complète — l'outil masque le prompt final derrière son GPT) :
- "One continuous 8-second shot, vertical 9 by 16."
- "modern editorial collage animation design for shorts video" (mention de style visuel — collage/papercraft-like).
- Précision d'accent/voix directement dans le prompt : "neutral American male voice", ou pour varier : "25-year-old, excited trailer-like" (ajustement du ton de narration en modifiant juste la description de voix dans le prompt).
- La narration texte est embarquée DANS le prompt vidéo lui-même (le modèle génère narration + image en un seul appel "text-to-video with native narration") — pas un pipeline séparé voix/image.

**Ce qui est TRANSPOSABLE en local avec MiniMax H3** :
- **La checklist qualité de prompt ci-dessus** est un bon gabarit générique, indépendant de l'outil : un narrateur cohérent, un prompt auto-suffisant par scène (pas de dépendance à la scène précédente), un seul mouvement de caméra par plan, géométrie/lumière stables, peu d'encombrement visuel, arc explicatif clair. À adapter en prompts H3 texte-only (sans la narration embarquée, puisqu'on gère notre propre voix off ElevenLabs séparément).
- **Durées de shot volontairement variées** (pas de rythme uniforme de scène en scène) — principe de montage transposable tel quel à notre découpage de beats.
- **Un mouvement de caméra unique par shot, plan continu** — contrainte de prompt directement réutilisable pour H3 (éviter de demander plusieurs mouvements dans un même clip).
- Mention de style visuel explicite dans le prompt ("collage animation design", "paper cutout style") pour orienter le rendu vers l'esthétique flat/papercraft plutôt que "réaliste" par défaut — utile car le créateur signale lui-même que sans cette précision, le modèle dérive vers un rendu photoréaliste non désiré.

**Ce qui N'EST PAS transposable** (spécifique à l'outil payant tiers, à écarter) :
- Tout le GPT custom Viddyoze et son prompt caché (propriétaire à l'outil, pas de détail de structure complète divulgué).
- L'automatisation "browser control" ChatGPT Plus pilotant l'UI de Video Express (copier-coller automatique dans les champs de l'appli).
- Le système de génération parallèle limitée par compte (1 à 5 vidéos simultanées selon abonnement) — logique de quota commerciale, sans rapport avec H3 local.
- Le clonage de voix / narration embarquée nativement dans le générateur vidéo (Video Express fait narration + vidéo en un seul appel) — non applicable, on génère la voix séparément (ElevenLabs) dans notre pipeline.
- Toute la partie prix/coût serveurs GPU (Nvidia B200, argumentaire commercial sur pourquoi Viddyoze facture des crédits) — hors sujet.
- Le mode "advanced" avec ajustement dynamique de durée selon la vitesse de narration détectée (fonctionnalité propriétaire Video Express) — H3 n'a pas cette synchronisation automatique, à gérer manuellement côté montage si besoin.

**Incertitudes** :
- Le transcript auto-généré ne montre jamais le prompt COMPLET tel qu'envoyé au moteur vidéo sous-jacent de Video Express (on ne sait pas quel modèle vidéo il utilise en interne) — impossible de dire si la structure de prompt "scène par scène" vient d'un format texte simple ou d'un JSON structuré. Le GPT custom fait cette traduction en coulisses, jamais montrée en détail.
- Impossible de confirmer la durée exacte moyenne par shot au-delà des exemples cités ("3s", "6s", "8s") — pas de tableau récapitulatif fourni dans la vidéo.
- Aucune frame/thumbnail extraite pour cette fiche (le transcript texte suffisait à couvrir la grille de lecture demandée ; le contenu était essentiellement verbal/procédural UI, pas visuel-analytique).

### 17. FREE Claude Prompt That Creates VOX Style Videos AUTOMATICALLY | Here's How (RaxX_Q7Apj0)

**Verdict global : pipeline complet mais fortement dépendant d'outils tiers payants/gratuits externes** (Google Flow/Nano Banana, extension Chrome "ZappyFlow" pour batch, Higgsfield/SeaDance en option payante, 11 Labs, Suno, CapCut). Le cœur transposable est la STRUCTURE de la conversation Claude (chatbot orchestrateur qui produit script → beats → prompts image → prompts vidéo), pas les outils de génération eux-mêmes.

**Structure de scène/pipeline** :
- Chatbot (Claude/DeepSeek/GPT, au choix) reçoit un "master prompt" + un PDF "engine" (8 pages, contenu-moteur du système) en pièce jointe, puis pilote TOUTE la conversation en stages successifs : (1) choix de niche (histoire, argent/pouvoir, catastrophe/survie, documentaire, tech, sport — Vox fait surtout crime/documentaire), (2) génération de 10 idées de vidéo dans la niche choisie, (3) choix de durée du script (30s à 20 min ; "sweet spot" annoncé = 10-20 min pour la pub), (4) génération du script complet avec compte de mots exact, (5) découpage du script en "beats" visuels — **27 beats pour un script d'1 minute** (~2.2s par beat en moyenne), (6) génération d'un fichier TXT détaillé listant un prompt image par beat.
- Chaque beat = 1 image générée (Nano Banana via Google Flow), puis chaque image est transformée en clip vidéo de **5-6 secondes** (recommandation explicite : demander à Claude de réduire la durée par défaut de 10s à 5s "parce qu'on va utiliser du logiciel gratuit" — plus la durée demandée est longue, plus ça coûte cher/lent).
- Montage final : CapCut, transitions "subtiles" type slide entre chaque clip, crop pour synchroniser sur la narration, pas de sous-titres ajoutés (le visuel a déjà beaucoup de texte à l'écran).

**Techniques de prompt** — pas de citation littérale du prompt maître complet (il est hors-vidéo, dans une communauté Skool), mais la mécanique de dialogue est bien détaillée : le chatbot attend des commandes courtes type mot-clé pour avancer les étapes ("next", "proceed" — **Claude spécifiquement exige "voice or proceed"** pour avancer, contrairement à DeepSeek qui accepte "proceed" seul — nuance de comportement modèle à modèle notée par le créateur). Exemple de script généré cité à l'écran (le récit Victor Lustig / tour Eiffel) — style narratif : phrases courtes, factuelles, rythme "beat par beat" façon documentaire ("May, 1925. Paris. A well-dressed man reads a newspaper story...").

**Ce qui est TRANSPOSABLE en local avec MiniMax H3** :
- **Le pipeline de conversation Claude en stages** (niche → idées → script chronométré avec compte de mots → découpage en beats visuels → 1 prompt image par beat) est directement réutilisable comme structure de prompt-orchestration, indépendamment de l'outil de génération vidéo derrière — on a déjà ce type d'orchestration côté storyboard.
- **Ratio beats/durée observé : ~27 beats pour 60s de script**, soit ~2.2s par beat — donne un ordre de grandeur de découpage fin (plus court que les 5-8s habituellement cités ailleurs) à tester en H3 si on veut un montage très dense/rythmé.
- **Recommandation durée de clip courte (5-6s) pour limiter coût/temps de génération** — directement pertinent pour H3 même si H3 est gratuit/local, car ça garde le montage dynamique (plus de coupes = plus proche du rythme Vox).
- Le principe de générer le prompt vidéo à PARTIR de l'image déjà produite (l'image sert de point de départ figé, le prompt vidéo décrit uniquement le mouvement à partir de cette image) — pattern image-to-video cohérent avec ce qu'on ferait avec H3 en local (texte-to-image maison, ou notre propre SVG, PUIS H3 anime).
- Trame narrative façon "beat factuel court" (une phrase, un fait, un rythme sec) — transposable à l'écriture de script quel que soit le pipeline vidéo.

**Ce qui N'EST PAS transposable** :
- Google Flow + Nano Banana (génération d'image propriétaire Google).
- Extension Chrome "ZappyFlow" pour batch-génération automatique d'images depuis un TXT (outil tiers spécifique à l'UI de Google Flow).
- Higgsfield/SeaDance (comparé à "OmniFlash" dans la vidéo — le créateur préfère OmniFlash, mais les deux sont des générateurs vidéo tiers payants hors-scope).
- 11 Labs pour la voix (déjà notre outil de référence côté ElevenLabs, donc pas un ajout, mais mentionné comme "le seul qui tient la route pour la monétisation YouTube" — signal de marché plutôt que découverte).
- Suno pour la musique (hors scope, on utilise Minimax music).
- Le PDF "engine" propriétaire (8 pages, contenu non divulgué dans la vidéo, accessible seulement via la communauté Skool payante/gratuite du créateur).

**Incertitudes** :
- Le contenu exact du "master prompt"/PDF engine n'est jamais montré à l'écran en détail — impossible de citer la structure précise du prompt qui pilote tout le pipeline Claude. On ne voit que le résultat de la conversation, pas l'instruction système complète.
- Pas de précision technique sur le prompt vidéo lui-même (mouvement de caméra, style) au-delà de la mention générale "detailed universal video generation prompt" — le contenu réel du prompt n'est pas lu à l'écran.

---

### 3. I Made Vox-Style Motion Graphics Using Only Claude Code & Omni (dqtfk8iINXI)

**Verdict global : le plus riche en détails de PIPELINE technique reproductible** (Claude Code utilisé comme agent orchestrateur avec accès filesystem/ffmpeg, pas juste chatbot). Outils de génération (GPT Image 2, Google Omni via Kie AI) restent tiers payants, mais la MÉCANIQUE de chaînage image→vidéo→frame-suivante est très détaillée et transposable telle quelle.

**Structure de scène/pipeline** :
- Recherche de style AMONT : le créateur a utilisé un outil de type Notebook LM en amont pour analyser ~10 vidéos YouTube sur le style Vox et en extraire un "comprehensive style prompt" + un "animation prompt" — c'est littéralement la même démarche méthodologique que celle demandée dans cette tâche (reverse-engineering d'un style via transcript de plusieurs vidéos de référence, PUIS synthèse en prompt réutilisable).
- Script généré via Claude, découpé en **3 chunks de 10 secondes ou moins** pour une vidéo cible de 30s (donc 3 clips vidéo distincts, stitchés ensemble en fin de pipeline via ffmpeg).
- Chaîne de production PAR SCÈNE : (1) Claude génère le prompt narratif/script court, (2) Claude génère UNIQUEMENT le prompt image de la première scène (pas de texte/overlay dans l'image — ajouté plus tard), (3) génération de l'image (GPT Image 2 via Kie AI, un agrégateur d'API unique plutôt que gérer plusieurs clés API), (4) Claude propose le prompt vidéo pour animer CETTE image précise (mouvement de caméra + texte qui apparaît en overlay, décrit précisément : "a large stamp appears with '260 years'... rack focus gently on the ship"), validation avant génération, (5) génération vidéo (Google Omni via Kie AI).
- **Mécanisme clé de continuité inter-scènes** : pour la scène suivante, Claude utilise ffmpeg pour extraire la DERNIÈRE frame de la vidéo précédente, l'analyse (vision), et SEULEMENT ALORS planifie le prompt de la scène suivante à partir de cette frame réelle — le créateur explique explicitement avoir testé sans cette étape ("prompts qui n'ont pas de sens" si Claude ne voit pas où s'arrête la scène précédente) et l'avoir corrigée. C'est un vrai enchaînement frame-à-frame, pas des shots indépendants.
- Le tout est packagé comme un "skill"/projet Claude Code réutilisable ("Vox sequential scene workflow") — un fichier d'instructions qu'on peut soit exécuter en one-shot ("create a video about X"), soit piloter étape par étape pour vérifier/corriger à chaque palier.

**Techniques de prompt** — citations directes à l'écran :
- Prompt vidéo scène 1 : *"As the narration says 'at war for 260 years', a large stamp appears with '260 years'... 'Still in commission', rack focus gently on the ship. The ship sharpens and lifts slightly in contrast with the sea."*
- Prompt vidéo scène 2 (texte qui reste + nouveau texte overlay + note de continuité) : *"[keeps existing text the same but renders on some more text as well]... no hard cuts... narration is going to say '104 guns' while rough pencil circles are drawn around two or three gunports on the ship's hull."*
- Consigne explicite pour la 1ère image de la 1ère scène : **ne jamais mettre de texte/overlay dans l'image de base** — le texte est ajouté uniquement via le prompt vidéo (couche d'animation séparée de la couche image statique).

**Ce qui est TRANSPOSABLE en local avec MiniMax H3** :
- **Le principe frame-de-fin → analyse → prompt suivant** est le point le plus fort et directement applicable à H3 en local : générer clip 1, extraire la dernière frame (ffmpeg, gratuit), l'utiliser comme image de départ / référence visuelle du prompt du clip 2 (soit en image-to-video si H3 le supporte, soit en décrivant cette frame dans le prompt texte suivant pour garantir la continuité visuelle). Évite le symptôme documenté ("prompts qui n'ont pas de sens" sans cette étape).
- **Découpage en chunks ≤10s par scène, 3 scènes pour 30s** — gabarit de durée cohérent avec les capacités de clip courtes de H3.
- **Séparer la couche "image de base" (sans texte) de la couche "prompt vidéo" (qui ajoute le texte/mouvement)** — permet de garder l'image propre et de contrôler le texte/overlay indépendamment, transposable si on garde nos overlays de texte en post (Remotion) plutôt que brûlés dans le clip généré.
- **La méthode de recherche de style en amont** (notebook de synthèse à partir de plusieurs vidéos de référence du même style) confirme la validité de la méthode utilisée pour CETTE tâche même — le créateur l'a documentée comme "one of the best ways to do research" avant de coder le prompt.
- Note pratique citée : Claude/Fable est "incroyablement lent" — si la vitesse compte, le créateur recommande Codex/Cursor/Grok pour l'orchestration plutôt que Claude. Signal utile si on observe une lenteur similaire en orchestration H3 (à garder en tête, pas forcément actionnable ici puisque notre stack est déjà Claude Code).

**Ce qui N'EST PAS transposable** :
- GPT Image 2 (image), Google Omni (vidéo) — tous deux via l'agrégateur Kie AI (API payante tierce).
- Le choix spécifique de Kie AI comme agrégateur d'API unique (pertinent seulement si on utilisait des API payantes — H3 tourne en local, donc non applicable).
- Toute la partie promotionnelle "Applied AI Mastermind" (cours payant du créateur, hors sujet).

**Incertitudes** :
- Le prompt COMPLET du "style prompt" et de l'"animation prompt" générés par Notebook LM n'est jamais lu texte par texte à l'écran (seulement montré furtivement dans une capture) — on ne peut pas le citer littéralement, seulement confirmer sa fonction (résumé de style + gabarit d'animation, généré une fois puis réutilisé pour tout le pipeline).
- Pas de détail sur le prompt exact utilisé pour l'analyse de la dernière frame par Claude (juste "use ffmpeg to strip it, analyze it, then plan the next video") — la formulation précise du prompt de vision n'est pas montrée.

---

### 2. I Created Viral Paper Art Videos in 10 Minutes Using Flow AI (VERY EASY) (LLa34Tjyrvw)

**Verdict global : quasi rien de transposable côté technique de prompt/structure fine** — cette vidéo est centrée sur un pipeline ultra-simplifié (ChatGPT → Gemini → Flow AI) pour du contenu "paper craft ASMR" satisfaisant (pas du documentaire narratif façon Vox), et sur l'angle MONÉTISATION (affiliation, sponsoring) plus que sur la technique de production. Le style visé (papercraft artisanal filmé en gros plan, mains qui découpent/assemblent) est différent du style Vox explainer/documentaire demandé dans le brief (papercut flat 2D avec narration factuelle) — à noter comme écart de registre.

**Structure de scène/pipeline** :
- Pipeline en 4 étapes strictes : (1) ChatGPT génère 10 idées de vidéo papercraft à partir d'un "master template prompt" (fourni en description, format Google Docs), (2) ChatGPT génère à partir de l'idée choisie DEUX livrables : un prompt d'image storyboard ET un prompt de génération vidéo, (3) Gemini AI génère l'image storyboard — **explicitement décrite comme "10 panels" en UNE SEULE image** (grille de storyboard façon planche BD, pas 10 images séparées), (4) Flow AI (mode "agent") reçoit cette image de storyboard comme référence visuelle + le prompt vidéo, et génère UN clip vidéo unique de **10 secondes** qui couvre tout le processus.
- Format vertical (9:16) obligatoire — insisté explicitement ("make sure your aspect ratio is set to vertical. This is important") car la distribution cible est Instagram/TikTok, pas YouTube long-form.
- Extension de durée en POST uniquement : pour dépasser les 10s natifs, le créateur importe le clip dans CapCut et **réduit la vitesse de lecture à 65-70%** (ralenti qui "ajoute du drame" aux mouvements de main) pour obtenir un rendu de 15-20s — pas de re-génération, un simple ralenti post-prod.

**Techniques de prompt** : aucune formulation de prompt n'est citée littéralement à l'écran (le "master template prompt" est décrit comme "long" mais jamais lu) — seule la STRUCTURE en 2 livrables (prompt image storyboard + prompt vidéo séparé) est explicite et vérifiable.

**Ce qui est TRANSPOSABLE en local avec MiniMax H3** :
- **Le pattern storyboard-en-une-image-multi-panneaux comme référence visuelle avant génération vidéo** — au lieu de générer image par image, produire UNE planche de storyboard (façon contact sheet) qui sert de garde-fou de cohérence visuelle avant de lancer la génération vidéo. Idée transposable si H3 accepte une image de référence multi-panneaux en entrée, ou au minimum comme étape de validation visuelle avant de lancer les prompts un par un.
- **Ralenti post-prod (65-70% vitesse) pour étirer un clip court sans re-générer** — technique gratuite et directement applicable à n'importe quel clip H3 trop court, à tester si un beat H3 doit durer plus longtemps que le clip natif généré.
- Le principe des 2 livrables séparés (prompt image storyboard vs prompt vidéo) confirme, par recoupement avec la vidéo #3, le pattern récurrent "image de référence d'abord, mouvement décrit ensuite" — un signal de convergence entre 2 sources indépendantes.

**Ce qui N'EST PAS transposable** :
- ChatGPT + Gemini + Flow AI (agent mode) — chaîne d'outils propriétaires tiers, aucun payant en tant que tel dans cette vidéo mais tous externes/non locaux.
- Tout l'angle monétisation (liens affiliés Amazon/Etsy, sponsoring marques de papeterie, vente de templates numériques) — hors scope de la tâche (on cherche la technique de production, pas la stratégie business).
- Le registre visuel "paper craft ASMR" (mains qui manipulent du papier en gros plan, contenu satisfaisant/tactile) est un genre différent du style Vox-documentaire ciblé — les techniques de cadrage/prompt de CE registre spécifique ne s'appliquent probablement pas telles quelles à un style explainer factuel.

**Incertitudes** :
- Le contenu réel du "master template prompt" n'étant jamais montré, impossible de vérifier s'il contient des instructions de style transposables (ex. mention explicite de "papercut" vs "papercraft 3D filmé") — seule la structure en étapes est vérifiable, pas le contenu du prompt lui-même.
- Pas clair si "Flow AI agent mode" fait de la génération multi-shot automatique à partir du storyboard multi-panneaux, ou un seul clip continu qui tente de tout montrer en 10s — le transcript ne permet pas de trancher techniquement comment le modèle interprète la planche à 10 panneaux en une seule vidéo de 10s.

---

### 7. Vox-Style Animated Charts With ONE PROMPT (Remotion + Claude Code) (dv3ADYu74DE)

**Verdict global : la SEULE des 4 vidéos qui utilise déjà notre propre stack (Remotion + Claude Code)** — donc particulièrement pertinente, mais volet DIFFÉRENT de notre besoin H3 (ici : graphiques de données animés type Vox/Guardian — barres, "polyt"/rings/grid, courbes de course — PAS des scènes narratives papercut). Aucun outil de génération vidéo IA tiers ici : tout est du code Remotion pur (spring animation, pas de clip vidéo généré). Zéro élément H3-transposable au sens "prompt vidéo générative" — en revanche, la texture "papery/grain" et le "boil" sont des briques VISUELLES directement codables chez nous, indépendamment de H3.

**Structure de scène/pipeline** :
- Pas de découpage en shots/scènes narratifs — 3 graphiques indépendants (bar chart, "polyt"/pop chart en grid, racing line chart), chacun généré par UN SEUL prompt Claude Code qui configure en une fois : le serveur Remotion, les styles de texture (grain papier), l'animation (spring), et l'injection des données.
- Chaîne : 1 prompt → Claude Code monte le serveur Remotion automatiquement (pas de setup npm manuel) → applique un overlay de grain/texture papier sur toute la composition → anime via spring physics (paramètres cités : damping ~19, stiffness ~280) → résultat directement prévisualisable et ajustable (position XY, taille) en itérant sur le code.

**Techniques de prompt** — pas de prompt littéral cité texte par texte (le créateur montre son écran de code sans lire le prompt à voix haute), mais les EFFETS demandés sont nommés précisément et sont les briques réutilisables :
- **"Grain/paper overlay"** : texture de bruit appliquée sur toute la frame pour simuler un rendu "dessiné à la main"/marqueur plutôt que "trop net/digital" — comparaison avant/après montrée explicitement (sans overlay = fond plat et trop net ; avec = bords "jaggedy" façon marqueur + grain sur toute l'image).
- **"Boil"** (terme d'animation traditionnelle citée et expliquée) : légère instabilité frame-à-frame simulée via un bruit fractal appliqué aux lignes/formes statiques, pour recréer le tremblement involontaire des dessins animés traditionnels image par image ("back in the days when they had these hand-drawn cartoons... one frame wasn't the same as the next frame... that little gentle shiver"). Le créateur prévient explicitement du risque de surdosage : trop de boil devient un "buzz" visuellement distrayant — il faut le doser bas.
- Pattern de reveal pour le graphique en grid/rings : "reveal as a single wave sweeping from left to right", chaque point apparaissant en "small crisp spring" (physique de ressort, pas ease-in-out classique) — confirme l'usage systématique de `spring()` déjà en place dans notre stack (cf. règle CLAUDE.md `spring() > interpolate()`).

**Ce qui est TRANSPOSABLE en local avec MiniMax H3** :
- **Rien directement pour H3** (pas de génération vidéo IA impliquée dans cette vidéo) — MAIS deux briques visuelles fortement transposables à notre pipeline Remotion/SVG existant, indépendamment de H3 :
  - **Overlay de grain/texture papier** sur une composition — technique déjà dans l'esprit "papercut style" recherché, applicable en post-traitement sur n'importe quel rendu (y compris un clip H3 déjà généré, en overlay Remotion par-dessus).
  - **Effet "boil"** (bruit fractal léger sur les formes statiques) — technique CSS/SVG-shader classique en motion design, transposable comme "vivification" d'éléments graphiques fixes (texte, formes) même sans passer par un générateur vidéo IA. Cohérent avec la doctrine maison "carte/scène jamais nue" (effet vivant obligatoire).
- Le principe de dosage du bruit (trop de boil = distrayant) est un rappel utile de dosage général, transposable comme heuristique qualité à toute texture ajoutée.

**Ce qui N'EST PAS transposable** :
- Rien lié à un outil tiers payant ici — c'est la vidéo la plus "propre" des 4 de ce point de vue (100% Remotion/Claude Code, notre propre stack). Mais le contenu (data-visualisation graphique) est un registre différent du style narratif papercut-vidéo qu'on cherche à reproduire avec H3 — donc pas transposable au sens "aide à faire un clip H3", plutôt au sens "brique de post-traitement visuel réutilisable en Remotion".

**Incertitudes** :
- Aucun prompt Claude Code n'est lu ou montré texte par texte à l'écran (le créateur scrolle du code sans zoomer sur le texte du prompt) — impossible de citer la formulation exacte utilisée pour déclencher l'effet grain/boil ; seule la description orale de l'EFFET recherché est fiable, pas la syntaxe du prompt.
- Pas clair si cette vidéo appartient vraiment au même sous-registre que les 3 autres (narration papercut/documentaire) — elle traite du "style Vox" au sens large (identité visuelle/texture) plutôt que du pipeline de génération de scènes narratives. À signaler explicitement plutôt que la faire rentrer de force dans la même catégorie que les 3 autres fiches.

### 14. This AI Agent Builds Viral Documentary Videos For You (aqyZ87euzz0)

**Verdict global : quasi rien de transposable.** Vidéo promotionnelle pour **11 Creative Flows** (ElevenLabs), un canvas d'orchestration propriétaire qui enchaîne Nano Banana 2 Light (image), GPT Image 2 (assets 4K), Gemini Omni Flash (animation image→vidéo) et ElevenLabs v3 (voix). Le workflow entier tourne DANS l'outil ElevenLabs Flows, piloté par un agent qui construit lui-même les nœuds du canvas à partir d'un prompt Claude — rien de transposable au niveau infrastructure (pas de MiniMax, pas de local).

**Structure de scène/pipeline** :
- 1 "style prompt" texte défini une fois, réutilisé tel quel dans TOUTES les générations (image de fond, personnages, scènes) pour garantir la cohérence visuelle inter-shots — c'est le principe le plus solide de la vidéo.
- 1 arrière-plan "persistant" généré une fois, puis référencé comme asset fixe dans chaque scène suivante (au lieu de re-générer un fond à chaque shot).
- Script découpé en scènes courtes correspondant chacune à une ligne de voix-off ; testé ici sur seulement 3 scènes/shots pour une vidéo très courte (~30s).
- Chaque scène : d'abord une image statique (storyboard) générée par GPT Image 2 avec le style prompt + les assets référence (photos réelles de la personne, objets), validée par l'humain, PUIS animée séparément par Gemini Omni Flash.
- Note technique citée : Gemini Omni Flash n'anime pas depuis l'image comme frame de départ figée — il "regarde toute l'image comme contexte, sépare les éléments et anime" en créant des scènes AVANT le point de départ apparent (entrées d'éléments depuis les bords).

**Techniques de prompt** — le "character lock block" est le concept le plus concret cité : bloc de prompt dédié à forcer la persistance de l'apparence des personnages/objets à travers toutes les générations ("every single asset that we upload, specifically people, it will stay consistent to what they look like [...] they can be animated but they can't change in terms of looks"). Le prompt Claude combine : (1) le script complet, (2) une liste lâche des assets de référence ("photo of me as a kid, as an adult, and a camcorder" — pas besoin de description technique précise), (3) le style block, (4) le character lock block.

**Ce qui est TRANSPOSABLE en local avec MiniMax H3** :
- **Le "style prompt" unique répété dans chaque génération** — principe directement applicable : rédiger un bloc de style fixe (palette, texture, registre visuel) et le coller en tête de CHAQUE prompt H3, plutôt que de varier le style scène par scène.
- **Le "character/objet lock" comme bloc de prompt séparé et explicite** — même sans upload de référence image (H3 étant texte-only dans notre usage), formuler une description figée et courte du personnage/objet à réinjecter identique dans chaque prompt de scène pour limiter la dérive visuelle.
- **Séquencement image-cible d'abord, animation ensuite** — valider le style/la composition sur un statique avant de lancer la génération vidéo, cohérent avec notre doctrine "image-cible avant le code/animation".
- **Découpage 1 scène = 1 ligne de voix-off**, scènes courtes (~5-8s) alignées sur le script — transposable tel quel à un run H3.

**Ce qui N'EST PAS transposable** :
- L'intégralité du canvas ElevenLabs Flows (nœuds, agent auto-générateur de workflow, auto-run) — propriétaire, aucune correspondance locale.
- Gemini Omni Flash et sa gestion spécifique du contexte d'image (comportement d'animation propre à ce modèle, non garanti sur H3).
- GPT Image 2 pour les assets 4K, Nano Banana 2 Light pour le test de style rapide — modèles image tiers spécifiques.
- Le système d'upload de vraies photos de référence comme ancres du character lock (H3 tel qu'on l'utilise ici = texte-only, pas de référence image dans ce test).
- Génération de musique/voix via ElevenLabs v3 + Studio (montage intégré) — hors périmètre du test H3 pur.

**Incertitudes** : le transcript ne montre jamais le contenu exact et complet du "style block" ni du "character lock block" tels qu'écrits dans le prompt final envoyé à Flows (la vidéo dit "we'll put this prompt on screen" mais le texte n'apparaît pas dans les sous-titres) — impossible de citer la formulation exacte, seulement le principe rapporté verbalement.

### 16. I Made This Viral Reel Using ONLY Remotion & Claude Code (xOhh274Ayac)

**Verdict global : LA vidéo la plus pertinente des 4** — même stack que nous (Remotion + Claude Code), zéro outil de génération vidéo IA impliqué. Tout le mouvement vient de **code d'animation Remotion écrit par Claude Code**, pas de clips vidéo générés. Cette vidéo n'a donc pas vocation à tester MiniMax H3 en tant que tel, mais sa méthode de direction/langage de prompt vers Claude Code pour l'animation est directement exploitable pour NOTRE pipeline Remotion existant (indépendamment de H3).

**Structure de scène/pipeline** :
- Storyboard = 5-6 lignes de voix-off maximum, chacune ~5s, donnant ~25-30s de métrage par bloc de script — recommandation explicite de ne pas complexifier ("no more than five or six voice lines").
- Pour un reel Netflix-vs-Blockbuster : 6 scènes distinctes, chacune codée et peaufinée INDÉPENDAMMENT avant fusion en "master reel" — raison donnée : éviter qu'un fix sur la scène 1 casse la scène 6 si tout est dans un seul fichier/composition.
- Chaque scène = 1 image de fond + 1 sujet en premier plan + traitement pellicule (grain, vignette, scan lines, corner blur, gate weave) appliqué de façon systématique à toutes les scènes pour l'unité visuelle.
- Assets sourcés librement (Google Images, GPT Image via Replicate API, packs d'autres éditeurs) — la provenance de l'image statique importe peu, seule l'animation/choreo compte pour le rendu "viral".

**Techniques de prompt** (citations directes du transcript, très concrètes et actionnables) :
- Setup projet : *"set up a remotion project for a vertical documentary reel 1080 by 1920 at 30fps"* + vocabulaire de motion helpers donné à Claude Code : **"posturize time"**, **"boil"**, **"ping pong entrance"**.
- Traitement pellicule : *"build a film treatment look"* avec specs précises — *"1.6 pixel black line at 16%"*, un "texture sandwich" (deux textures à contraste/luminosité différents superposées), vignette, color grade, gate weave.
- Référencer les FRAMES Remotion Studio plutôt que des secondes ou des captures d'écran : *"do a motion blur effect from frame 56 to 67"* — le créateur insiste que donner un numéro de frame exact (visible dans Remotion Studio) est bien plus efficace que d'itérer verbalement ("right after this happens").
- Choréo de scène : *"a slow push, zoom through from frame 46"* + effet nommé **"weld and detach"** (un cadre se "soude" visuellement à l'image derrière puis s'en détache au zoom).
- Vivification d'une scène statique : ajout de **"character boil"** (léger drift/tremblement organique sur le personnage), drift de nuages en fond, léger shift sur l'ensemble du décor — présenté comme LA différence entre une animation "correcte" et une animation "vivante".
- Effets composites : superposition de stock footage (fumée, particules d'explosion) en **blend mode "screen"**, puis retouche des gris/contraste pour crush + feather sur les bords pour un fondu crédible.
- Effet parallaxe : arrière-plan zoome à une vitesse, personnage au premier plan zoome plus vite ; ombre portée fabriquée en dupliquant l'image, en la noircissant, puis en lui appliquant un skew.
- Effet lampe qui s'allume + "cache highlight" sur un bureau : décrit comme trivial en code ("basically just two lines of code"), avec un flicker fait via des **hold keyframes** plutôt qu'un fondu simple — un flicker en hold-keyframes rend l'effet "vivant" alors qu'un simple hold statique paraît figé.
- Réutilisation de scène : la scène finale réutilise la choréographie d'une scène précédente en swappant juste le personnage/fond — pattern de réutilisation de composant pour limiter le travail.
- Instruction volontairement peu technique donnée à Claude Code pour un ajustement fin ("finger wag") : *"you literally just tell Claude code like an actual [...] no no no and it'll just do it for you"* — le créateur insiste qu'on n'a pas besoin de mémoriser les formules mathématiques, juste itérer en langage naturel avec des repères frame-précis.

**Ce qui est TRANSPOSABLE en local avec MiniMax H3** :
- Cette vidéo ne concerne pas H3 (pas de génération vidéo IA du tout) — mais TOUT le vocabulaire de motion/traitement pellicule est directement réutilisable pour habiller un clip H3 généré une fois importé dans Remotion (grain, vignette, scan lines, gate weave, blend "screen" sur particules, character boil en post pour renforcer un clip H3 statique/mou).
- Le principe **scène codée indépendamment, fusion en dernier** est un pattern de production transposable à un pipeline mêlant clips H3 + overlays Remotion.
- Référencer les numéros de frame Remotion Studio plutôt que des secondes/descriptions verbales — applicable à toute session de post-traitement d'un clip H3 importé.
- Le gabarit "5-6 lignes de voix-off, ~5s chacune, ~25-30s de bloc" est un gabarit de découpage de script transposable à un test H3 (durée de clip courte, cohérente avec les limites de génération H3).

**Ce qui N'EST PAS transposable** : rien n'est un outil tiers payant ici puisqu'il n'y a AUCUN générateur vidéo IA dans cette vidéo — tout est du code Remotion pur + assets statiques + stock footage libre. Le seul écart avec notre cas : cette vidéo ne montre justement pas comment un clip vidéo GÉNÉRÉ (type H3) s'intégrerait dans ce pipeline, puisqu'elle n'en utilise pas.

**Incertitudes** : aucune précision numérique donnée sur les couleurs/valeurs exactes du color grade, de la vignette ou du gate weave (seule la spec du scan line 1.6px/16% est citée précisément) — le reste des réglages ("un peu de saturation", "sepia", "hue rotate") reste qualitatif dans le transcript, pas de valeurs chiffrées.

### 15. How I Created Voxel Style Animation With 1 Prompt (Claude + Higgsfield) (iFk69ZndN9c)

**Verdict global : peu transposable.** Malgré le titre mentionnant "1 Prompt", le workflow réel est un agent Claude connecté par MCP à **Higgsfield** (outil tiers payant, système de crédits), qui orchestre en coulisses recherche factuelle, génération d'images, animation vidéo (modèle "Gemini Omni Flash" via Higgsfield, "seed audio" pour la voix) et assemblage — tout le pipeline concret tourne dans l'infrastructure Higgsfield, opaque depuis le transcript.

**Structure de scène/pipeline** :
- Format annoncé par l'agent lui-même : vidéo de 2 minutes = **12 blocs/clips**, "custom landscape style key" généré une fois puis réutilisé pour tous les blocs suivants (même principe de style-lock que la vidéo #14).
- 2 clips sur les 12 ont échoué à la génération et ont été automatiquement identifiés + regénérés par l'agent (aucune intervention manuelle nécessaire) — les blocs cités comme problématiques concernaient des scènes sensibles (harcèlement, hôpital), probablement filtrées par la modération Gemini.
- Musique ajoutée dans un second temps via un outil séparé ("Higgsfield Supercomputer") avec instruction explicite d'auto-duck (baisse du volume) pendant les dialogues — traitement de type side-chain compression appliqué automatiquement.
- Personnage réel (Elon Musk) traité de façon "symbolique" plutôt que photoréaliste pour contourner les restrictions de likeness des générateurs : *"I'll depict Elon Musk symbolically, but never actually force photoreal likeness"* — approche de contournement révélatrice mais pas une technique de prompt réutilisable en soi.

**Techniques de prompt** : très peu de formulations exactes citées — le prompt d'entrée donné par le créateur à Claude est court et non technique : *"Make me a 2-minute explainer video of my Nerds to Legends series. This will be episode 2"*, avec des contraintes annexes données oralement (narrateur "upbeat", format 16:9 override car le skill est par défaut vertical, choix explicite du modèle Claude "Opus 4.8" plutôt que "Fable 5" jugé disproportionné pour la tâche). Le vrai travail de structuration (12 blocs, script, choix de voix "Zoe, bright upbeat female") est fait par l'agent en coulisses via un skill Higgsfield préconfiguré ("Vox Motion Graphics skill") — le détail du prompt système de ce skill n'est jamais montré dans le transcript.

**Ce qui est TRANSPOSABLE en local avec MiniMax H3** :
- Le principe de **découpage en ~12 blocs courts pour 2 minutes** (~10s/bloc en moyenne) donne un ordre de grandeur de durée de clip cohérent avec les limites de génération de H3.
- **Style-lock généré une fois, réutilisé pour tous les blocs suivants** — même principe transversal que la vidéo #14, confirme que c'est une pratique répétée dans l'écosystème, donc à adopter par défaut pour un test H3 multi-shots.
- Le traitement d'un personnage réel de façon "symbolique"/stylisée plutôt que photoréaliste est une approche de prompt réutilisable pour H3 si on doit représenter une figure publique (rester dans l'abstraction visuelle plutôt que viser la ressemblance exacte).
- Auto-duck de la musique pendant le dialogue est un principe de mixage transposable à notre propre post-production Remotion, indépendant de l'outil.

**Ce qui N'EST PAS transposable** :
- Tout le pipeline MCP Claude↔Higgsfield, le skill "Vox Motion Graphics" préconfiguré, le système de crédits, la génération de recherche factuelle automatique, la sélection de voix "seed audio" — infrastructure propriétaire Higgsfield sans équivalent local.
- Le modèle vidéo utilisé en interne (Gemini Omni Flash via Higgsfield) — pas H3, comportement non garanti transposable.
- Higgsfield Supercomputer pour la génération/mix musique automatique.

**Incertitudes** : le contenu exact du prompt système du skill "Vox Motion Graphics" (ce qui définit réellement la structure des 12 blocs, le style visuel par défaut, les règles de continuité) n'est JAMAIS visible dans le transcript — la vidéo montre le résultat de l'agent qui l'exécute, pas le skill lui-même. Impossible de dire si la structure en 12 blocs est un nombre fixe imposé par le skill ou calculé dynamiquement selon la durée demandée.

### 20. I Made a Vox-Style Documentary Using Only AI — Full Workflow (SD1LbaLqGQo)

**Verdict global : moyennement transposable** — pas de démo d'un outil unique tout-en-un comme les 3 autres ; c'est un workflow en 3 étapes outillées séparément (Claude pour la direction créative/script/prompts, ChatGPT pour les images, "Gemini Flow" via une plateforme tierce nommée Artlist pour l'animation image→vidéo). La partie la plus solide et transposable est la méthodologie de préparation en amont (références visuelles → design doc → prompts par scène), indépendante de l'outil d'animation final.

**Structure de scène/pipeline** :
- Recherche de références visuelles d'abord (Behance pour projets de motion design pro, Pinterest pour idées visuelles rapides, + portfolio personnel du créateur, motion designer de métier) — étape de curation AVANT tout prompt.
- Screenshots des références uploadés à Claude, qui produit un **"design document"** complet : palette de couleurs, composition, textures, typographie, traitement photographique, éléments graphiques, règles de cohérence à respecter sur toutes les scènes. Exemple concret cité pour ce documentaire Bentley : "vintage editorial collage style [...] black and white photographic cutouts, warm cream paper backgrounds, subtle halftone textures, large burnt orange shapes, carefully controlled compositions."
- Claude écrit ensuite le script du documentaire ET le découpe en scènes individuelles, chaque scène liée à un moment précis de la narration ("every visual should support a specific part of the narration") — pas de génération d'images "belles" au hasard, chaque image a un rôle narratif assigné en amont.
- Claude génère un prompt image séparé PAR scène, envoyé à ChatGPT pour génération dans le même style.
- Ensuite : prompt d'animation UNIVERSEL (un seul gabarit réutilisé pour toutes les scènes) appliqué à chaque image via Gemini Omni Flash (accédé via la plateforme Artlist) — mouvement volontairement subtil : léger push caméra, parallaxe doux entre les couches, petits détails d'ambiance animés.
- Workflow de contrôle qualité : review de chaque clip généré pour repérer scintillement/morphing/distorsion → si mouvement trop fort, simplifier le prompt et regénérer ; plusieurs versions générées par scène, la plus propre est retenue ; upscale en 4K seulement APRÈS validation du mouvement (jamais régénéré pour la résolution).

**Techniques de prompt** (le point le plus actionnable de cette vidéo) :
- Consigne de simplicité visuelle explicite donnée pour les images sources, justifiée techniquement : *"keep your visuals simple. Use clear silhouettes, strong central objects, clean backgrounds, and enough empty space around the composition. When an image contains too many small details or overlapping objects, AI animation models often begin to distort them. Faces may change, cars can bend, hands can morph, and text can become unstable."*
- Prompt d'animation universel décrit par sa fonction plutôt que cité mot pour mot : *"a subtle camera push, gentle parallax between layers, and small environmental details that make the image feel alive"* + négatifs explicites : *"preserve the original composition and avoid flickering, warping, morphing, duplicated objects, changing faces, unstable text"*.

**Ce qui est TRANSPOSABLE en local avec MiniMax H3** :
- **Le design document en amont** (palette, composition, texture, typo, règles de cohérence écrites une fois) — méthode texte-only, totalement indépendante de l'outil, directement applicable comme brief de style avant toute génération H3.
- **Chaque image/scène doit avoir un rôle narratif assigné avant génération** — pas de génération "au hasard" puis sélection : principe transposable à notre découpage de script → prompts H3.
- **La checklist de simplicité visuelle pour limiter les artefacts d'animation** ("silhouettes claires, objet central fort, fond épuré, espace négatif suffisant") est un principe générique de prompt-engineering pour modèles d'animation image→vidéo, donc a priori valable pour H3 aussi — utile en amont de toute génération pour éviter la distorsion de visages/mains/texte typique de ces modèles.
- **Le prompt d'animation universel avec négatifs explicites** ("éviter scintillement, warping, morphing, visages qui changent, texte instable") est directement réutilisable comme gabarit de prompt H3, en l'adaptant au vocabulaire propre à H3.
- **Le principe "mouvement subtil uniquement"** (push caméra léger, parallaxe doux) plutôt que mouvement dramatique — cohérent avec notre propre doctrine "mouvement = intention narrative", donc double confirmation à appliquer aux prompts H3.
- **Regénérer avant d'upscaler, upscaler seulement le clip validé** — ordre d'opérations transposable à un pipeline H3 + post-traitement.

**Ce qui N'EST PAS transposable** :
- La plateforme "Artlist" comme accès à Gemini Omni Flash — abonnement tiers payant spécifique, aucun équivalent local.
- Le modèle Gemini Omni Flash lui-même — pas H3.
- ChatGPT comme générateur d'images spécifique (remplaçable par nos propres outils SVG/image existants — Fable 5, GLM, GPT-5.5 via OpenRouter selon notre stack déjà documentée).

**Incertitudes** : le prompt d'animation "universel" n'est jamais cité texte pour texte dans le transcript (seulement décrit/paraphrasé par le créateur) — on ne connaît pas sa formulation exacte, seulement sa fonction et ses négatifs. Impossible de savoir si Behance/Pinterest sont vraiment nécessaires à la méthode ou juste l'habitude personnelle de ce créateur (motion designer de métier) — le design document produit par Claude pourrait vraisemblablement être généré sans passer par cette étape de curation externe, mais rien dans le transcript ne permet de le confirmer ou de l'infirmer.

### 05. I 100% Automated Vox-Style Motion Graphics (Claude Code + Omni) (TiycelzfzC0)

**Structure de scène/pipeline** : système Claude Code complet packagé en slash-command (`/vox video`), reverse-engineered par l'auteur depuis une autre chaîne ("Framework Explained", crédité explicitement). Pipeline en 5 étapes fixes, décrites verbatim : (1) génération du script/speech, (2) découpage automatique du speech en 4 parties ou plus (chapitres), (3) génération d'une image de référence de style unique en amont, (4) génération d'une image par chapitre — chaque image dérivée à la fois du contenu du chapitre de speech ET de l'image de référence de style (pour cohérence visuelle), (5) transformation de chaque image en clip vidéo via Gemini Omni, avec le texte du chapitre injecté comme contexte du prompt vidéo (ex. si le texte dit "the door opens", ce texte est passé au modèle vidéo pour que l'action corresponde). Assemblage final automatique de tous les clips. Chaque "chapitre" fait 35-40s dans l'exemple montré (donc pas des shots courts type 5-8s, mais des blocs longs contenant probablement plusieurs plans). Régénération ciblée possible : "tell Claude regenerate this one and it will regenerate just that video and still combine all of the other videos into the final video" — traçabilité par chapitre.

**Techniques de prompt** : le prompt complet n'est pas lu à l'écran mot pour mot (renvoyé en description), mais sa structure est décrite : contient une image de référence de style + un "master prompt" texte donnant les règles de génération. Setup projet : un dossier avec 4 fichiers texte fournis par l'auteur (non détaillés au-delà de "how to prompt the videos, how to prompt the images, and an example style reference") + une image de référence de style physique. Configuration Claude Code : session sur un dossier vide dédié, `.env` avec clés API (ElevenLabs pour la voix, une API tierce nommée "Key AI" pour images/vidéos), musique fournie par l'utilisateur en glissant un MP3 dans un sous-dossier `music/`. Le système pose des questions de configuration au premier lancement (aspect ratio, voix ElevenLabs, source de musique) puis les retient pour les sessions suivantes dans le même projet.

**Ce qui est transposable en local avec MiniMax H3** :
- Le pipeline en 5 étapes (script → découpage chapitres → image de référence de style → image par chapitre dérivée de la référence → vidéo par chapitre avec texte du chapitre comme contexte de prompt) est un gabarit d'orchestration générique, indépendant du moteur vidéo — directement portable à un agent Claude Code pilotant H3 en local.
- Le principe **image de référence de style unique générée UNE fois, puis réutilisée comme ancrage pour CHAQUE image de chapitre suivante** — le mécanisme concret pour obtenir la cohérence visuelle "shot 1 == shot 40" mentionnée ailleurs dans la playlist. Directement testable avec H3 si H3 accepte une image de référence en entrée (image-to-video ou image-conditioning).
- Injecter le texte narré du passage correspondant comme contexte du prompt vidéo (pas juste une description visuelle abstraite, mais littéralement le texte dit à ce moment) — un principe de synchronisation texte-visuel réutilisable en prompt H3 texte-only.
- La régénération ciblée par chapitre/shot sans tout refaire — principe d'organisation de fichiers (nommage, dossier par shot) à répliquer dans notre propre pipeline agent+H3.
- Le pattern "poser les questions de config une fois en amont (ratio, voix, musique), puis les retenir pour tout le projet" — bonne pratique d'orchestration agent, indépendante de l'outil.

**Ce qui n'est PAS transposable** : Gemini Omni lui-même (modèle vidéo propriétaire payant, $3.50/chapitre de 35s selon l'auteur) ; l'API "Key AI" comme fournisseur d'accès à Omni ; le MCP/connecteur spécifique reliant Claude Code à ces APIs tierces ; la génération vocale ElevenLabs (déjà notre outil, mais ici intégrée directement au pipeline auto plutôt que pilotée manuellement) ; le coût annoncé (20$/mois Claude + ~3.50$/chapitre + ~6$ ElevenLabs) n'est pas pertinent puisque H3 est gratuit en local.

**Incertitudes** : le contenu exact du "master prompt" et des 4 fichiers texte fournis n'est jamais lu à l'écran — seule leur FONCTION est décrite verbalement, pas leur formulation. Impossible de confirmer si le découpage "4 chapitres minimum" est une contrainte technique du système ou un simple défaut modifiable (l'auteur dit "make it three chapters, make it four chapters, whatever" — semble être un paramètre libre côté prompt initial). Le mécanisme technique précis de "verrouillage de style" entre l'image de référence et les images de chapitres (via quel paramètre API — image-reference input, LoRA, seed) n'est pas expliqué, seul l'effet est montré.

---

### 04. How To Get Realistic Dialogue & Consistent Voices In AI Videos (duItlDZL7_4)

**Note de cadrage** : cette vidéo n'est PAS un tuto motion-graphics façon Vox — c'est un tuto dialogue/voix pour scènes cinématiques avec personnages parlants (Higgsfield pour les visuels, ElevenLabs pour la voix). Peu de recoupement avec le pipeline "explainer papercraft" des 3 autres vidéos du lot, mais plusieurs techniques ElevenLabs sont directement réutilisables pour toute narration voix off (y compris nos vidéos Souverain/Atlas), indépendamment du moteur vidéo.

**Structure de scène/pipeline** : pas de découpage en shots motion-graphics — le pipeline ici est **par ligne de dialogue** : (1) écrire la ligne, (2) l'enrichir de balises de direction d'acteur entre crochets, (3) générer la voix (ElevenLabs V3), (4) synchroniser un visuel parlant sur cette voix (lip sync ou génération vidéo native avec audio de référence). Deux méthodes de synchro comparées frontalement : méthode A (déconseillée) = lip-sync sur image fixe via "Kling Avatars 2.0" — bonne précision labiale mais visuel qui casse dès qu'il y a du mouvement (visage qui fond, corps qui se déforme, dents qui disparaissent) ; méthode B (recommandée) = génération vidéo complète depuis zéro avec l'audio en référence via un outil nommé "C-Dance/Seance" à l'intérieur de Higgsfield, qui prend en entrée deux "reference boards" (un pour le personnage, un pour le décor) + une vidéo-audio (astuce : convertir le clip audio en vidéo à fond noir, car l'outil n'accepte que des fichiers vidéo en référence, pas l'audio seul — et rejette tout clip de moins de ~2s, donc il faut padder les lignes courtes à 3s minimum).

**Techniques de prompt** : balises de direction d'acteur ElevenLabs V3 citées explicitement — `[long pause]`, `[whisper]`, `[exhale]`, `[sighs]`, `[clears throat]`, plus des mots-clés d'émotion en langage naturel insérés dans le texte ("anxious", "sad", "angry") et l'usage de MAJUSCULES sur un mot pour renforcer l'emphase vocale dessus. Ordre recommandé pour la description de voix custom (voice design) : **langue/accent → genre/âge → qualité audio → persona/émotion → timbre/pacing**, cité comme recommandation officielle ElevenLabs. Deux pièges nommés explicitement : ne pas utiliser le mot "accent" quand on veut dire "intonation" ; éviter les mots d'effet type "reverb"/"echo" qui cassent la voix au lieu de la façonner. Réglages numériques donnés : guidance scale autour de 40%, loudness proche de 75% — avec heuristique de dosage ("si la voix sort raide, baisser le guidance ; si l'accent ne prend pas, l'augmenter"). Exemple de description de voix complète citée : *"an ancient ruler in his late 70s, deep and gravelly, slow and commanding, like a man who's worn the crown for 50 years."*

**Ce qui est transposable en local avec MiniMax H3** :
- Rien de directement lié au moteur vidéo H3 lui-même — cette vidéo ne montre aucune technique de prompt vidéo transposable (Higgsfield/Kling/C-Dance sont spécifiques et non détaillés au niveau prompt visuel).
- En revanche, **tout le volet ElevenLabs est transposable tel quel à notre propre pipeline audio** (déjà partiellement documenté dans `memory/tools/elevenlabs.md`/`TTS-V3-TAGS-REGLES.md`, mais à vérifier/enrichir si ces balises précises n'y figurent pas) : les balises `[whisper]`, `[exhale]`, `[sighs]`, `[clears throat]`, les mots-clés d'émotion inline, les MAJUSCULES pour l'emphase, et surtout l'ordre de description recommandé pour un voice design custom (langue/accent → genre/âge → qualité → persona/émotion → timbre/pacing) avec ses 2 pièges nommés.
- Le principe "convertir l'audio en vidéo à fond noir pour satisfaire un outil qui n'accepte que des références vidéo" est une astuce générique de contournement d'input, à retenir si un futur outil impose la même contrainte — mais sans objet direct avec H3 sauf si H3 a la même limitation d'input.

**Ce qui n'est PAS transposable** : Higgsfield Lip Sync Studio, Kling Avatars 2.0, C-Dance/Seance (génération de dialogue à deux personnages en un seul appel, plafonné à 15s) — tous des outils propriétaires payants tiers, aucun équivalent H3 documenté à ce jour. La méthode "reference boards" (personnage + décor) est un mécanisme d'interface Higgsfield spécifique.

**Incertitudes** : le nom exact du second outil de génération ("C-Dance" ou "Seance" — le transcript auto-généré orthographie différemment selon les occurrences, probablement "Seedance" mal transcrit par la reconnaissance vocale automatique — À VÉRIFIER, pas de certitude sur le nom réel du modèle) . Impossible de confirmer si "Seedance" (si c'est bien de ça qu'il s'agit) a un équivalent local ou une API dans notre pipeline actuel — hors scope de cette fiche, à signaler seulement.

---

### 09. I Made a Vox Style Animation With ONE Prompt (Claude Code + Higgsfield) (GFroEz7XW5E)

**Structure de scène/pipeline** : le pipeline le plus haut-niveau des 4 — tout est packagé dans un "Claude Skill" propriétaire vendu/partagé par l'auteur (fichier `.skill.md` chargé dans Claude Code + connecteur MCP Higgsfield). Le brief utilisateur tient en une phrase : "I want a 2-minute explainer video" (topic optionnel). Séquence observée : (1) le skill effectue une recherche web autonome de sujets tendance et propose 3 options (histoire/finance/géopolitique) à l'utilisateur, qui choisit ou délègue le choix ; (2) questions de goût rapides (~30s) : style minimal vs bold typography, besoin de cartes/graphiques/personnages découpés, référence visuelle optionnelle ; (3) rédaction du script (hook, story, payoff — structure explicitement nommée) ; (4) génération voix off automatique (Higgsfield audio) sans intervention ; (5) découpage du script en scènes, chaque scène assignée à un type d'asset (carte, icône, graphique) et générée séparément mais avec un **style visuel appliqué/forcé sur chaque requête** pour garantir la cohérence scène 1 ↔ scène 12 ; (6) une fois tous les assets prêts, question finale "voulez-vous que j'assemble le projet ?" → assemblage automatique. Bonus démontré : relancer avec juste "make this video in Spanish" régénère une version localisée complète (nouvelle voix + mêmes visuels) en quelques minutes, répété pour portugais et hindi.

**Techniques de prompt** : très peu de formulations verbatim de prompts visuels/scène — la vidéo reste au niveau produit/marketing du skill, pas du detail technique de prompt engineering. Le seul principe de prompt structurel cité explicitement est l'anti-pattern à éviter : générer scène par scène avec des prompts indépendants ("one prompt, one image, then repeat") mène à une dérive de style scène après scène — l'auteur insiste que le liant n'est PAS le prompt individuel mais un système qui **applique/force un style constant à travers toutes les requêtes de génération du projet**, peu importe le nombre de scènes.

**Ce qui est transposable en local avec MiniMax H3** :
- Le séquencement complet du pipeline (recherche sujet → script hook/story/payoff → voix → découpage scène-par-type-d'asset → génération avec style forcé → assemblage) est un bon gabarit d'orchestration à reproduire avec un agent Claude Code pilotant H3, même sans "skill" packagé équivalent.
- Le diagnostic du principal piège ("scène par scène, prompt indépendant, dérive de style") est directement actionnable en test H3 : il faut absolument prévoir un mécanisme de cohérence de style (prompt d'art direction répété identique sur chaque clip, ou image de référence si H3 le permet) plutôt que de reformuler un prompt de zéro à chaque shot.
- Le triptyque narratif "hook, story, payoff" est un gabarit de script réutilisable indépendamment du moteur — déjà proche de nos pratiques éditoriales Souverain/Atlas, bon rappel.
- Les questions de goût condensées en 2-3 choix rapides (minimal vs bold typography, cartes/graphiques/personnages, référence visuelle) — un bon modèle de "gate" léger à poser à Aziz avant de lancer une génération H3, cohérent avec notre propre pratique de regrouper les questions de goût.

**Ce qui n'est PAS transposable** : le "Claude Skill" lui-même est un produit fermé vendu/partagé par l'auteur (contenu réel non montré à l'écran, seulement son effet) — impossible de le répliquer sans en connaître le contenu exact. Le connecteur MCP Higgsfield (accès unifié image/vidéo/voix/musique) est propriétaire et payant. La génération multilingue en un prompt ("make this in Spanish") dépend du pipeline TTS+traduction intégré à Higgsfield/le skill — pas un équivalent direct disponible pour notre pipeline ElevenLabs actuel (à faire manuellement).

**Incertitudes** : le prompt/instruction exacte envoyée par le skill à Higgsfield pour chaque scène n'est JAMAIS visible à l'écran ni citée dans le transcript — toute la mécanique interne (comment le style est "forcé", quel paramètre technique) reste une boîte noire. Impossible de confirmer si "style forcé" signifie image de référence, seed fixe, ou prompt système caché répété — à ne pas assumer une méthode précise sans preuve. La durée réelle par scène/shot n'est jamais chiffrée dans le transcript (contrairement à la vidéo #05 qui donne "35-40s par chapitre") — aucune donnée de timing exploitable ici.

---

### 11. My Electricity Bill Tripled Overnight. Here's Why. (KEvyN5OKeuM) — vidéo FINIE, pas un tuto

**Cadrage** : confirmé après lecture du transcript ET extraction de 8 frames à intervalles réguliers (5s à 360s, vidéo de 404s/6m44) — c'est bien une vidéo finale dans le registre "Vox-style explainer" (sujet : hausse des factures d'électricité liée aux data centers IA), zéro commentaire méthodologique dans la narration. Analyse en registre "structure narrative/visuelle observée", pas prompt.

**Structure de scène/pipeline observée** :
- Fond de couleur unie plein cadre, changeant à CHAQUE scène/beat (orange saumon → bleu ciel → vert menthe → rose/magenta → violet, observé sur les 8 frames échantillonnées) — jamais deux scènes consécutives avec le même fond dans l'échantillon.
- Bordure "papier déchiré/vieilli" (irrégulière, texture noire crénelée type post-it arraché) CONSTANTE sur 100% des frames observées, quel que soit le fond — c'est l'élément de continuité visuelle n°1 de toute la vidéo, pas la couleur de fond.
- Sujet central : découpe/collage ("cutout") sur le fond uni — mix de deux registres graphiques observés : (a) photographie réaliste désaturée/vintage (portrait d'homme âgé + facture, ouvriers électriciens en photo noir & blanc, bâtiment du Capitole, foule en photo N&B) et (b) icône/illustration plate simplifiée (laptop en illustration vectorielle simple, silhouette de main tenant un téléphone avec effet chromatic-aberration rouge/cyan). Les deux registres coexistent dans la même vidéo, jamais dans le même plan.
- Éléments graphiques "plaqués" par-dessus le collage : flèche de croissance stylisée, pourcentages en gros texte bold ("7%", "60 W"), formes géométriques simples en aplat (cercle, ovale) servant de fond secondaire derrière le sujet principal pour créer de la profondeur/hiérarchie sans perspective 3D.
- Composition très centrée/symétrique à chaque frame (sujet toujours au centre du cadre, jamais en rule-of-thirds) — cohérent avec un format explainer où chaque plan doit être lisible en un coup d'œil, y compris pour un short/vertical recadré.
- Le premier plan à 5s (facture + visage inquiet) mélange DÉJÀ les deux registres dans un seul cadre (photo réaliste desaturée du visage + isolation nette du document sur fond retouché) — donc la distinction "photo réaliste" vs "icône plate" n'est pas strictement scène-par-scène, elle peut cohabiter en un seul plan quand le sujet le justifie (ex. "preuve documentaire" = photo réaliste ; "concept abstrait" type consommation électrique = icône simple).

**Techniques de prompt** : aucune — vidéo finie sans making-of, aucun prompt visible ni cité.

**Ce qui est transposable en local avec MiniMax H3** :
- Le principe **bordure texturée constante + fond couleur qui change à chaque scène** comme signature de continuité visuelle — un pattern de post-production/overlay (probablement appliqué APRÈS génération, en compositing, pas dans le prompt vidéo lui-même) directement reproductible dans notre propre pipeline de montage, indépendamment du moteur de génération. C'est un excellent candidat "notre valeur ajoutée en compositing" plutôt qu'un prompt à donner à H3.
- Le principe de composition centrée/symétrique par plan — contrainte de cadrage à inclure dans les prompts H3 texte-only ("centered composition, subject centered in frame").
- Le mélange délibéré photo-réaliste-desaturée (pour ancrer factuellement/donner de la crédibilité) vs icône-plate-simple (pour les concepts abstraits) selon la nature du sujet du plan — un principe de direction artistique réutilisable pour décider, scène par scène, quel registre demander à H3.
- Les éléments graphiques post-plaqués (flèches, pourcentages, cercles de fond) sont probablement des overlays de montage plutôt que générés nativement par le moteur vidéo — donc transposables comme étape de COMPOSITING séparée après la génération H3 brute, pas comme instruction de prompt.

**Ce qui n'est PAS transposable** : rien d'identifiable comme spécifique à un outil tiers payant dans cette fiche — puisqu'aucune méthode n'est montrée, il n'y a pas de dépendance à écarter. Seul bémol : impossible de savoir si le collage/cutout est un résultat NATIF du moteur de génération vidéo ou un compositing post-production classique (After Effects-like) — dans le doute, à traiter comme du compositing (plus sûr et plus contrôlable que d'espérer que H3 sorte ce rendu nativement).

**Incertitudes** : aucun moyen de confirmer si le mouvement à l'intérieur de chaque plan (léger flottement du collage, zoom lent) vient du moteur vidéo génératif ou d'une animation Ken Burns appliquée en post sur des images fixes — les 8 frames échantillonnées ne permettent pas de trancher (mouvement non observable sur des frames isolées, cf. notre propre doctrine `frame-espacee-sous-estime-mouvement-lecture-continue-prime` — cette limite s'applique ici aussi : il faudrait lire la vidéo en continu, pas en frames espacées, pour juger du mouvement réel). Pas de certitude sur l'outil de production utilisé pour cette vidéo précise (pas mentionné, pas dans le titre) — pourrait être Higgsfield, Omni, ou un pipeline entièrement différent non couvert par la playlist.

---

## ⭐⭐⭐ TEST RÉEL 1 — H3 multi-référence (3 images) pour composer une scène par staging, verdict : NE PAS généraliser (2026-08-13)

**Contexte** : suite à la synthèse ci-dessous, test du principe StyleVox #1 (style-lock) + #10 (traçabilité)
appliqué en le poussant plus loin — au lieu de coder le staging d'éléments en Remotion (comme le proto
`VoxPapercutAvion16x9.tsx`, cf [[REVERSE-STYLE-VIDEO-VERS-ASSETS]]), déléguer le staging ENTIER à H3 via
son mode Ref2VA multi-référence (jusqu'à 9-12 `<Picture N>`, ici 3 testés : fond crique vide, rocher
isolé, corde tranchée isolée — tous générés séparément en papercraft Gemini 3.1 Flash Image, palette et
grain cohérents). Prompt au format officiel 6 sections (`subject_definitions` → `summary` →
`retention_analysis` → `detailed_description` avec `[Shot N] At 00:0X.000s` par élément → `overall_soundscape`
→ `non_diegetic_music`), séquençage explicite 0-2s fond seul / 2-4s rocher qui se pose / 4-6s corde qui
apparaît / 6-8s hold. Graphe API étendu à 3 `LoadImage` (`ref_images.ref_image_0/1/2` sur
`MiniMaxH3ReferenceToVideo` — c'est un slot `COMFY_AUTOGROW_V3`, pas limité à 2 malgré le template par
défaut n'en câblant que 2 ; confirmé extensible via `get_node`, dry_run 0 warning). Prompt complet :
`tests-visuels/prompt-scene5-vol-ref2va-v1.txt`. Clip : `tests-visuels/scene5-vol-3ref-h3.mp4`
(prompt_id `14d53ffb-db7e-4184-b228-87a53135798a`, 864×480, 8.0s pile).

**Résultat vérifié frame par frame (0.2/1.9/2.5/3.9/4.5/5.9/6.5/7.9s)** :
- ✅ **L'ordre d'apparition a été respecté** — fond seul en premier, rocher ensuite, corde en dernier.
  Le principe "H3 peut faire du staging séquentiel à partir de N références séparées" EST validé en soi.
- ✅ **Le mouvement organique du fond (vagues) était réussi** avant que rocher/corde n'apparaissent —
  seul segment jugé bon par Aziz.
- ❌ **Rocher et corde arrivent en gros plan centré géant, "posés" sans raison au milieu du cadre**,
  écrasant la composition large de la crique vide. Frange de détourage blanche résiduelle visible sous
  le rocher (les petits points blancs qu'Aziz a repérés) — le fond blanc des images isolées n'a pas été
  neutralisé avant composition.
- ❌ **Caméra qui pousse/zoome** malgré "Static Shot, no camera movement" répété 2x (corps + clause
  négative) — non respecté.
- ❌ **Hold strictement figé de 4.5s à 7.9s** (frames identiques pixel pour pixel) — le "continuous
  ambient boil" demandé n'a pas été exécuté sur cette portion.

**⭐⭐⭐ Diagnostic Aziz, confirmé correct après relecture du prompt — cause racine = NOUS, pas le modèle** :
les images `<Picture 2>` (rocher) et `<Picture 3>` (corde) étaient générées **isolées sur fond blanc,
sans AUCUNE ancre de position/échelle relative au fond**. Le prompt disait QUAND chaque élément apparaît
(séquençage temporel) mais jamais OÙ ni À QUELLE TAILLE par rapport au cadre large de `<Picture 1>` —
H3 a comblé ce vide en centrant/zoomant par défaut, un comportement cohérent avec sa propre logique
faute d'instruction géométrique. **Répète exactement le pattern déjà documenté dans ce fichier**
(§ "prompt laxiste = cause racine des échecs H3, pas le modèle", 2026-08-08) — un défaut de composition
absent du prompt = un défaut qui apparaît dans le rendu, même sur un cas nouveau (staging spatial plutôt
que timing/geste).

**Décision Aziz (2026-08-13) : NE PAS généraliser H3-compose-toute-la-scène.** Verdict horizon : hybride.
- **Le staging spatial (position/échelle/ordre/delay) reste piloté en CODE Remotion**, comme le proto
  avion déjà prouvé "quasiment parfait" (`spring()`+`delay` par `<Cutout>`, déterministe, gratuit à
  itérer, zéro aléa de composition).
- **H3 est réservé à UN élément isolé qui a besoin de mouvement organique complexe** (eau qui clapote,
  un personnage, un animal) — généré comme clip vidéo autonome, puis intégré/recadré/positionné dans
  une `<Sequence>` Remotion au même titre qu'un asset statique, PAS comme compositeur de la scène entière.
- Repris du principe déjà entrevu dans la synthèse StyleVox (point 8 : "grain/texture/compositing = notre
  valeur ajoutée, pas un prompt H3") mais désormais confirmé par un test négatif concret plutôt que
  déduit des transcripts seuls.

**Piste NON explorée ici, à tester si le staging H3 est retenté un jour** : décrire explicitement
position/échelle par élément dans le prompt (ex. "the rock occupies roughly the lower-left third of the
frame, small relative to the wide cove shown in Picture 1, NOT filling the frame") avant de conclure que
l'approche est définitivement écartée — non tranché par ce seul test, écarté par décision de priorité
(l'hybride Remotion+H3-ponctuel est jugé plus fiable ET plus rapide à produire qu'une nouvelle itération
de prompt géométrique).

## Synthèse transposable H3 (21/21 vidéos analysées, 2026-08-13)

> Statut : synthèse prête, PAS encore validée par Aziz. Aucun test H3 lancé.

### Constat général
Sur 21 vidéos, AUCUNE ne montre de production locale gratuite comparable à ce qu'on veut faire avec H3 (la #13 "LTX local" s'en approche le plus en LOGIQUE — agent pilotant un moteur local — mais son moteur réel n'est jamais confirmé). Toutes les autres = orchestration Claude/Codex vers un outil tiers payant (Higgsfield très majoritaire, puis Gemini Omni/Omni Flash, Kie AI, ElevenLabs Flows, Video Express/Viddyoze, Artlist). Ça confirme et enrichit [[vox-generation-vs-composition-deterministe-moat]] plutôt que de le contredire. Rien à copier tel quel côté outil — tout à retraduire en prompts H3 texte-only + compositing Remotion maison.

### 1. Structure de pipeline (convergence forte, répétée dans ~15 vidéos)
Le même squelette revient quasi partout, avec des noms d'étapes différents mais la même logique :
**sujet/recherche → script chronométré → style-lock (1 fois) → découpage en scènes/beats → 1 image ou prompt par scène (ancrée au style-lock) → animation/vidéo par scène → assemblage.**
Directement réutilisable pour un pipeline H3 piloté par agent Claude Code — on a déjà l'équivalent côté storyboard/breakdown, à adapter avec H3 comme moteur final.

### 2. Le principe n°1, cité ou observé dans presque TOUTES les vidéos : le style-lock
Un bloc de prompt "art direction"/"style" écrit UNE fois et réinjecté identique dans CHAQUE génération de la vidéo (vidéos #05, #06, #09, #14, #15, #20). L'anti-pattern documenté explicitement (#09) : générer scène par scène avec un prompt reformulé à chaque fois → dérive de style scène 1 vs scène 12. **Pour H3 : écrire un bloc de style fixe (palette, texture, registre visuel, ex. "collage papercut, halftone, warm cream paper, burnt orange shapes") et le coller identique en tête de chaque prompt de test.**

### 3. Continuité inter-clips : le mécanisme le plus concret et actionnable de toute la playlist (vidéo #3)
Extraire la DERNIÈRE frame du clip précédent (ffmpeg, gratuit) → l'analyser → construire le prompt du clip suivant à partir de cette frame réelle plutôt que de deviner. Le créateur documente explicitement le symptôme sans cette étape ("prompts qui n'ont pas de sens"). **100% faisable en local avec H3 + ffmpeg, zéro dépendance tierce.**

### 4. Checklist de prompt qualité (recoupée dans #08, #20, #10 — convergence forte)
- Un seul mouvement de caméra par shot, plan continu (pas de coupe interne)
- Prompt auto-suffisant par scène, pas de dépendance à la scène précédente (sauf le mécanisme frame-de-fin du point 3, qui est une continuité VISUELLE, pas narrative)
- Géométrie/lumière stables, encombrement visuel minimal
- **Composition simple = moins d'artefacts** (#20, très concret) : silhouettes claires, objet central fort, fond épuré, espace négatif suffisant. Trop de détails/objets qui se chevauchent → distorsion (visages qui changent, mains qui morphent, texte instable). Négatifs explicites à tester en prompt H3 : "avoid flickering, warping, morphing, duplicated objects, changing faces, unstable text."
- Mouvement subtil uniquement (léger push caméra, parallaxe doux) plutôt que dramatique — recoupe notre propre doctrine "mouvement = intention narrative".

### 5. Grille des 5 assets par scène (vidéo #10, présentée comme LA clé du style Vox)
Texte (pop-up minimal) / objet principal (pop-up ou "unfolding") / fond (statique, ne s'anime quasiment pas) / objets secondaires (animation subtile) / un seul mouvement de caméra (zoom OU pan, jamais les deux). Gabarit de prompt directement réutilisable.

### 6. Durées de clip
Consensus large autour de **5-10s par clip/shot** (variantes observées : 3-8s non-uniformes délibérément #08, ~2.2s/beat en découpage très dense #17, 35-40s "chapitres" plus longs #05 — cas isolé). Recommandation transversale : **ne pas viser l'uniformité de durée** — la variation de rythme est un choix de montage explicite cité par plusieurs créateurs, pas une contrainte technique. Cohérent avec la demande initiale d'Aziz de tester du 5-10s pour aller vite.

### 7. Texte/typographie : jamais fiable dans le clip généré
Deux vidéos indépendantes (#12, #08) signalent le même défaut : le texte fin/dense généré nativement par le modèle vidéo devient illisible/faux ("gibberish"), seuls les gros titres bold passent bien. **Conclusion pour H3 : ne jamais compter sur H3 pour du texte à l'écran — réserver ça à nos propres overlays Remotion en post, comme on fait déjà.**

### 8. Ce qu'on gère déjà mieux que ces pipelines (à ne PAS chercher à répliquer via H3)
- Grain/texture papier, effet "boil" (bruit fractal léger sur formes statiques), vignette, scan lines, gate weave, blend "screen" sur particules — tout ça est du COMPOSITING Remotion (vidéo #07, #16), pas un prompt vidéo. On sait déjà le faire, indépendamment de H3.
- Bordure texturée constante + fond de couleur qui change par scène (vidéo #11) — signature de continuité visuelle observée sur une vidéo finie, très probablement du compositing post plutôt qu'un rendu natif du générateur. Reproductible directement en Remotion.
- Sous-titres/texte à l'écran — cf point 7, on le fait déjà mieux nous-mêmes.

### 9. Pattern opérationnel transposable : génération de nuit, review le matin (vidéo #13)
H3 étant gratuit et local, aucune raison de limiter les tentatives comme avec un outil payant à crédits. Agent Claude Code peut lancer une batch de clips H3 en autonomie, Aziz review au réveil — cohérent avec notre propre doctrine de délégation à agent frais. Règle de review : **ne jamais juger le mouvement sur des frames isolées** (recoupe notre doctrine `frame-espacee-sous-estime-mouvement-lecture-continue-prime`), lire le clip en continu.

### 10. Traçabilité shot ↔ sources (vidéo #13, la plus solide méthodologiquement)
Dossier unique de keyframes/prompts numérotés avec noms de fichiers descriptifs = tout le contexte nécessaire à l'agent pour un fix ciblé sans tout regénérer. Pattern d'organisation de fichiers à adopter dès le premier test H3, pas à ajouter après coup.

### Ce qui NE marche PAS sans outil payant (à écarter pour de bon dans ce test)
Higgsfield/Xfield (agrégateur multi-modèles), Gemini Omni/Omni Flash, Kie AI, ElevenLabs Flows/Studio (le canvas, pas la TTS elle-même qu'on garde), Video Express/Viddyoze, Artlist, Kling Avatars/Lip Sync, "Seedance"/C-Dance (nom incertain, cf vidéo #04), clonage vocal intégré aux générateurs vidéo (on garde ElevenLabs séparé), génération multilingue en un prompt (dépend du TTS intégré tiers), skills Claude propriétaires vendus/fermés (#09, #15, #05 — contenu jamais montré, principe transposable mais implémentation à refaire nous-mêmes).

### Bonus hors-scope H3 mais à ranger ailleurs
Vidéo #04 (balises ElevenLabs V3 : `[whisper]`, `[exhale]`, `[sighs]`, `[clears throat]`, ordre de description voice design langue→genre/âge→qualité→persona→timbre) — à vérifier si déjà couvert dans `memory/tools/elevenlabs.md`/`TTS-V3-TAGS-REGLES.md`, sinon enrichir séparément (hors scope de ce doc H3).

### Proposition de 1er lot de clips test H3 (5-10s, à valider avec Aziz avant de lancer)
1. Un prompt simple avec style-lock explicite (palette + texture papercut) + composition simple (silhouette claire, fond épuré) + un seul mouvement de caméra — baseline.
2. Même style-lock, 2 clips enchaînés avec le mécanisme frame-de-fin → prompt suivant (point 3) — tester la continuité.
3. Un prompt volontairement chargé (plusieurs objets, visage) pour vérifier si H3 souffre des mêmes artefacts documentés (morphing visage/mains/texte) — calibrer nos propres limites avant de bâtir un pipeline dessus.
