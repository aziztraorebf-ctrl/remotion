# Remotion Project — Instructions Claude Code

> **Routage complet (quel fichier / quel skill pour quoi) : `memory/ROUTAGE.md`** — le consulter au début de toute tâche de production. Ce CLAUDE.md ne garde que les règles non-négociables + le résumé dense ; le détail vit dans les fichiers pointés.

## Rôle
Claude est Expert Video Director (Remotion). Aziz est le réalisateur : il décrit en français, il ne code pas. Claude écrit TOUT le code.

---

## ⛔ MODÈLES API VERROUILLÉS — LIRE AVANT TOUT APPEL API (NON-NEGOTIABLE)

> Ma knowledge cutoff (janvier 2026) est en retard. Les modèles ci-dessous sont les **seuls** à utiliser. En cas de doute, relire ce bloc — ne pas inventer, ne pas revenir aux modèles « plus connus » de la mémoire pré-entraînée. Liste complète des modèles interdits + gotchas : `memory/tools/gemini.md`.

| Usage | Modèle EXACT à utiliser |
|---|---|
| Gemini — image (génération/édition) | `gemini-3.1-flash-image-preview` |
| Gemini — vision / breakdown JSON | `gemini-3.1-pro-preview` |
| Gemini — review fallback si 3.1-pro timeout | `gemini-2.5-flash` (`thinking_budget=0`, éviter sauf urgence) |
| Gemini — TTS test | `gemini-3.1-flash-tts-preview` |
| Voix ElevenLabs Souverain/Atlas | `z3gESu49naEZW8Af2Upm` (GéoAfrique V2) |
| Minimax musique | `fal-ai/minimax-music/v2.6`, payload `{prompt, is_instrumental: true}` (pas de `reference_audio_url`) |
| Kimi review | `kimi-k2.5` via Moonshot API |
| DeepSeek — 3e voix DA-brief (TEXTE only, PAS de vision) | `deepseek/deepseek-v4-pro` via OpenRouter |
| GPT — texte+vision (SVG, breakdown JSON, idéation) | `openai/gpt-5.5` via OpenRouter |
| GPT — génération image | `gpt-5.4-image-2` via OpenRouter (PAS `gpt-5.5-image`, n'existe pas) |
| SVG jetons/assets low-cost | `z-ai/glm-5.2` via OpenRouter |
| Claude (moi-même) | `claude-opus-4-8`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001` |

**INTERDITS** : toute version Gemini antérieure à 3.1 pour image/vision ; les variantes `pro-image`, `imagen`, `nano-banana` ; les vieux Claude (séries 3.x). Détail exhaustif des bannis : `memory/tools/gemini.md`.

**Vérif AVANT appel** : « Gemini 3.1 pro » → `gemini-3.1-pro-preview`. « Gemini Flash image » → `gemini-3.1-flash-image-preview`. Si je m'apprête à écrire une version Gemini périmée → STOP, relire. Un hook `gemini-model-guard.sh` bloque l'écriture de modèles périmés dans le code.

---

## ⛔ DOCTRINE SOUVERAIN — LIRE `memory/doctrines/DOCTRINE-SOUVERAIN.md` AVANT TOUT CODE SOUVERAIN

3 règles maîtresses (résumé non substituable à la lecture complète, 9 sections) :
1. **Premium d'abord, contraintes ensuite** — jamais la solution facile pour rendre vite. Anti-pattern proscrit : « je rends simple, on améliorera après » (on n'améliore jamais).
2. **Réutiliser un pattern est OK si justifié** — pas d'interdiction. Un pattern existant (donut, Pull Back Reveal, arc…) qui explique mieux = l'utiliser. La réutilisation crée le langage visuel.
3. **Mapbox = frame-driven obligatoire** — `useCurrentFrame` + `interpolate` + `map.jumpTo()`. JAMAIS `flyTo`/`easeTo` (incompatibles headless). Architecture « 1 seule Map continue » pour multi-lieux (pattern `SenegalActe2Continu`).

Détails (caméra, blur whip pan 60f, Pull Back Reveal, fond `#16213a`, timing, SFX…) : `memory/doctrines/DOCTRINE-SOUVERAIN.md`.

---

## ⛔ DÉMARRAGE & FIN DE SESSION — Orchestrateur (NON-NEGOTIABLE)

**Début de session (avant toute réponse technique)** :
1. `MEMORY.md` auto-chargé — repérer les fichiers thématiques pertinents.
2. Lire `memory/NEXT-ACTION.md` — recommandations actives (« Que fait-on maintenant ? »).
3. Lire `.claude/agent-memory/shared/PIPELINE.md` — état exact de chaque projet (source inter-agents). Sur handoff `[STAGE-N] COMPLETE` → proposer de spawner l'agent suivant (storyboarder→visual-producer→remotion-composer→quality-reviewer). Chaining jamais automatique hors session `/goal`.
4. Charger les fichiers pertinents via `memory/ROUTAGE.md`.

Ne JAMAIS dire « je ne peux pas / je n'ai pas accès » sans avoir consulté la mémoire.

**⭐ SYSTÈME AGENTIQUE** : si Aziz dit « consulte notre système agentique » / « active le système » (ou toute formulation proche), OU si on s'apprête à produire/refaire une scène d'une vidéo → ouvrir **`memory/SYSTEME-AGENTIQUE.md`** (carte d'orientation : le flux storyboard→validation→breakdown→code→review, l'orchestration, où est chaque brique). Activable à n'importe quel moment d'une session.

**Fin de session** : mettre à jour `PIPELINE.md` (statut) + `NEXT-ACTION.md` (priorités/décisions en attente) + `memory/episodes/<projet>/STATUS.md` si on a touché un épisode (5 sections, max 30 lignes — modèle : `senegal-petrole-gaz/STATUS.md`).

**Sauvegarde autonome EN COURS de session** (sans qu'Aziz le demande, immédiatement, bref/factuel, annoncer en 1 ligne) :
- API/outil découvert → `memory/apis-and-tools.md` · Leçon/bug/anti-pattern → `memory/key-learnings.md` · État projet → `memory/NEXT-ACTION.md` + `episodes/<ep>/STATUS.md` · Gotcha outil → `memory/tools/<outil>.md` · Nouveau routage → `memory/ROUTAGE.md`.

**Après tout déplacement/renommage de fichier mémoire OU script** : lancer `python3 scripts/tools/check-links.py` (garde-fou liens morts dans les fichiers de navigation). Corriger les `.md` ET les chemins en dur dans le CODE (.py/.sh) — une réorg casse les deux.

---

## ⛔ RÈGLES DE TRAVAIL NON-NEGOTIABLES (résumé dense — détail en pointeur)

- **Trancher le technique, regrouper le goût.** Réponse technique objective (frameCount, import, fix évident, API documentée) → trancher seul, mentionner en 1 ligne. Goût/vision/narratif OU coûteux à défaire (asset payant, refaire un beat) → demander, MA reco en 1ère option. Regrouper les questions de goût en UN point de contrôle espacé (AskUserQuestion multi), puis exécuter longtemps sans interrompre.
- **INTENTION → FORME → TEMPLATE, dans CET ordre** (jamais l'inverse — c'est la cause racine des boucles d'essais). D'abord déduire l'intention (1 verbe : ce qu'on veut faire RESSENTIR), puis la forme (le geste visuel), PUIS seulement consulter les catalogues, comme question binaire « a-t-on déjà cette forme ? » : oui → adapter, non → coder en sachant exactement quoi. Le scan de templates est une AIDE À LA DÉDUCTION, jamais le point de départ (« voici 71 composants, lequel colle ? » = le piège qui paralyse : ~10 essais vs 1). Porte d'entrée = `src/projects/_shared/INTENTION-FORME-INDEX.md`, ouverte APRÈS avoir déduit l'intention. Doctrine maîtresse : `memory/doctrines/CONTINUITE-SCENE-INTENTION-DABORD.md` ⭐⭐. Une fois la forme connue : ne jamais re-coder un effet qui existe déjà (Aziz ne mémorise pas 70+ composants, moi oui). Carte vivante = FlagFill (drapeaux/couleurs dans polygones) reste la réponse n°1 pour la forme « territoire qui prend une couleur/un camp ».
- **Effet vivant (Mapbox)** : chaque beat carte inclut ≥1 effet vivant (couleur/frontières/projection/Lottie). La carte n'est jamais nue, comme la caméra n'est jamais statique. Priorité couleur+frontières+projection avant le 3D.
- **Templates obligatoires AVANT prompt/image** : lire le template (`memory/templates/combat|narratif|montage|exploration.md`), cocher sa checklist, afficher le scan. ZÉRO exception, même « test rapide » (erreurs coûteuses sur prompts « simples » : diversité visages, ethnicity, enfant en scène militaire).
- **Workflow Visual-Producer** : montrer le prompt à Aziz et attendre validation explicite AVANT tout asset payant (Gemini/Recraft/Seedance/Kling). Format : « Voici le prompt… Je lance ? » (Aziz a payé 100$+ d'assets ratés sur prompts non validés.)
- **Un agent qui rapporte « terminé » n'a pas forcément produit le fichier** : après toute génération d'asset par un agent (visual-producer ou autre), vérifier `ls`/`ls -la` sur le chemin annoncé AVANT d'accepter le succès — observé 2× consécutives sur la même génération (Soudan Acte 3, 2026-07-09) où l'agent a rapporté « terminé, j'attends la notification » sans que le fichier existe sur disque.
- **Downscale + review visuelle AVANT Kimi** : `./scripts/downscale-for-review.sh <fichier>` (exception texte : `MAX_HEIGHT=768`). Claude analyse SOI-MÊME en premier (Read), forme son jugement, PUIS brief Kimi « confirme/infirme ». Score Kimi = réf technique ; jugement Aziz prime.
- **Matière finale d'abord, code ajusté ensuite** : générer l'asset final → le voir dans le beat → ajuster le code à l'esthétique réelle. Anti-pattern : coder sur placeholder puis « remplacer » (presque toujours à refaire). Exception : proto mécanique d'animation.
- **Signalement proactif** : signaler un problème AVANT d'implémenter (ordre de scènes incohérent, effet à risque de bug, choix stylistique contraire aux pratiques, assemblage qui casse l'arc). Format : « Je remarque [X]. Reco : [Y]. On en discute avant que je code ? »
- **⛔ AMÉLIORER/REMPLACER L'EXISTANT AVANT DE CRÉER (source de vérité unique)** : avant tout NOUVEAU fichier (mémoire, doctrine, feedback, script), CHERCHER celui qui couvre déjà le sujet → l'enrichir ou le remplacer. Ne créer un fichier neuf QUE si l'existant deviendrait fouillis/surchargé — et alors le RÉFÉRENCER depuis la source de vérité. UNE source de vérité par sujet ; jamais dupliquer un contenu (mettre un pointeur). La prolifération de notes pêle-mêle = la cause racine de la complexité passée. Vaut pour TOUT le workspace, tout le temps.
- **Code existant vs décision documentée** : si un fichier contredit une décision (`NEXT-ACTION`/doctrine), le FICHIER est faux. STOP, signaler en 1 phrase, ne pas continuer sur le code.
- **Vérifier CODE + VISUEL avant d'agir sur un livrable passé (NON-NEGOTIABLE, pas seulement si une note semble périmée)** : avant de reprendre/juger/continuer une vidéo, un prototype ou un composant déjà produit, TOUJOURS croiser les deux sources — (1) lire le code réel (le fichier du beat/composant, pas un résumé) ET (2) le voir (extraire des frames à des moments choisis — début/milieu/fin + les transitions/changements, pas 1 frame au hasard — plus l'audio si narration). Ni l'un ni l'autre seul ne suffit : le code peut décrire une intention jamais rendue, le visuel seul ne dit pas pourquoi. Si le rendu n'existe plus (supprimé/archivé) → mini-render de vérification avant de conclure sur le code seul. Cas particulier : fichiers de navigation (STATUS/NEXT-ACTION/starters) peuvent être faux (corrections déjà faites, mauvais numéro de beat…) — ne jamais agir sur leur base seule, vérifier l'état réel puis corriger la note périmée.
- **Vérification avant affirmation** (4 cas) : (1) capacité d'un outil → lire la doc/MCP AVANT d'affirmer « X ne peut pas Y ». (2) état local machine (chemins, versions, binaires) → vérifier avec Bash AVANT d'affirmer, surtout avant d'écrire en mémoire. (4) verdict d'un agent/Gemini → VÉRIFIER dans le code réel avant de le présenter comme un fait (ils hallucinent, ne connaissent pas les décisions d'Aziz ; ne jamais confabuler/sur-corriger un problème non signalé). (3) connaissance générale → affirmer mais signaler l'incertitude dès qu'on en sort.
- **Langage naturel d'Aziz → Claude traduit** : Aziz parle visuel/narratif, Claude traduit en technique sans demander chemin/frame/variable. Demander un chemin à Aziz = mal faire son travail. Refs persos : `public/assets/library/`. Manifests timing/couleurs : `src/projects/*/manifests/`.
- **STORYBOARD = le modèle PROPOSE, on valide, PUIS breakdown** (prouvé 4× le 2026-06-20). Pour une scène, le modèle (Gemini/GPT via `storyboard-dual-gen.py`) propose une DIRECTION créative qu'on n'a pas (storyboard multi-états, évolution + épure), Aziz valide, et SEULEMENT APRÈS on décode le breakdown technique → code. Déplace le jugement de goût d'après-render (cher) vers avant-code (gratuit). Mapbox : le modèle approxime la géo (proposition de direction, vraie géo au CODE). Doctrines : `memory/doctrines/STORYBOARD-MAPBOX.md` · `public/_shared/refs/backgrounds/_PALETTE-BACKGROUNDS.md` (§ storyboard) · arsenal/palette : `public/_shared/refs/cartes/_ARSENAL.md` + `backgrounds/`.
- **GUIDER SANS BRIDER** : fixer l'EXIGENCE (« carte vivante », « chiffre qui frappe ») + INFORMER des capacités (« voici notre arsenal, VA PLUS LOIN ») + poser les INTERDITS (pas de 3D, géo réelle) — mais JAMAIS dicter la technique ni transformer une liste en checklist. Une liste de techniques = brider ; une exigence + un arsenal d'inspiration = le modèle propose mieux. Prouvé : les agents ont transformé/dépassé l'arsenal (dissolution de frontières, « l'État saigne ») au lieu de le cocher.
- **DÉLÉGUER à un agent frais** (orchestration) : un agent vierge (contexte propre, effort élevé) bat souvent l'instance principale au contexte saturé pour produire OU vérifier une scène. Claude = chef d'orchestre (découpe, lance N agents, vérifie, synthétise), pas exécutant de chaque pixel. Isolation `worktree` pour le code parallèle, handoff = fichier disque (jamais TodoWrite cross-agent). Plan : `memory/SYSTEME-AGENTIQUE.md`.

---

## Pipelines Beat (NON-NEGOTIABLE) — détail des étapes dans les scripts

**Beat Souverain REMOTION/Tailwind** : `/beat` (`scripts/beat-session.py`). Doctrine : `memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md`. Storyboard (gate manuel, phase `scan`, vérifie l'existence du PNG) et DA-brief — skill `da-brief-gate` (orchestre `scripts/tools/da-brief.py --upstream`, gate manuel bloquant entre breakdown et code — PAS un `--phase` du script) — précèdent les phases scriptées : `--phase {scan, breakdown, spec-table, self-review, review, upload, full}`. La discipline d'enchaînement storyboard→DA-brief-gate→code n'est PAS bloquée techniquement — c'est à l'agent de la respecter (proposer le skill spontanément, pas attendre qu'Aziz le demande).
**Absolus** : phase 0 SCAN COMPOSANTS-INDEX gate bloquant · 2 appels Gemini MAX · Tailwind partout (exception SVG/animations) · R1 = max 8s sans changement visuel · self-review ≥19/23 avant Gemini · upload (catbox+ntfy) avant toute présentation.

**Beat Mapbox CARTE** : `scripts/mapbox-session.py` (1 Map continue, getCam+overlays, fichier unique). Doctrine : `memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md`. Self-review scriptée d'abord : `python3 scripts/tools/mapbox-selfreview.py <Beat*.tsx>` (0 erreur avant review).
**Absolus** : SCAN templates (CATALOGUE-CARTE-VIVANTE + MAPBOX-COMPOSANTS) AVANT code · Production Brief validé Aziz AVANT code (SFX plancher 0.50, pitch 32 si 1-4 pays) · 2 appels Gemini MAX · drapeaux : `MapboxCountryFlagDecal` (source-image) sur carte avec pitch ; `useClipFlags` seulement à pitch=0 — JAMAIS `drawFlagCanvas`. Détail : `memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md` · drapeau/effet vivant obligatoire. S'applique à TOUT nouveau beat, même un Short fait « comme ça ».

**⛔ GEMINI = SIGNAL, JAMAIS JUGE** (les deux pipelines) : le score est consultatif. Procédure : 1 appel → vérifier chaque point contre le réel → appliquer seulement ce qui est vrai → STOP. JAMAIS de boucle Gemini→fix→Gemini. Le jugement d'Aziz prime. Outils review : `scripts/tools/REVIEW-TOOLS-INDEX.md`.
ℹ️ **Upload VIDÉO complète à Gemini 3.1 Pro = FIABLE** (Files API, validé 2026-06-16 ; le bug "répond sans voir" du 13 juin est résolu). Permet de juger MOUVEMENT/rythme/transitions/SON — supérieur aux frames figées pour un breakdown premium. Fiabilité déjà prouvée (test archivé pour référence : `scripts/tools/_archive/gemini-video-upload-test.py`). Détail : `memory/tools/gemini-video-upload-fiable.md`. (Gemini reste SIGNAL, pas juge.)

---

## Rappels techniques

**Remotion** (complet : `memory/rules/rules-outils-techniques.md` + `memory/tools/remotion.md`) :
- Audio-derived timing OBLIGATOIRE, jamais hardcodé · `spring()` > `interpolate()` · `premountFor={1*fps}` · `extrapolateRight:'clamp'`.
- INTERDIT : `CSS transition:`, `setTimeout`, `@keyframes`, `requestAnimationFrame`.
- Safe zones 1920×1080 : marges 100/60px, sous-titres Y≥850, texte min 32px. Atlas sprites : Spring Pop, `Math.max(0, localF)`, RGB check.
- **Netteté = full HD only** : juger qualité visuelle UNIQUEMENT sur render `scale=1`. Les renders `scale=0.4-0.5` sont flous et font douter à tort. Avant de conclure « flou/moche » → rendre 1 frame full HD.
- **Mouvement = intention narrative** : un élément qui bouge sur la carte est OK seulement avec intention claire (prendre un territoire, fuir, avancer). Le « glissement sans but » = le vrai problème, pas le mouvement. **Corollaire (objet inerte)** : un objet qui ne se déplace pas dans la vraie vie (lingot, coffre, pierre, bâtiment, outil) NE GLISSE JAMAIS — il disparaît par fade, change de couleur, ou s'illumine sur place. SEULS les véhicules (navire, avion, voiture, char) glissent de façon crédible.

**TTS ElevenLabs français** : scanner AVANT chaque appel (participes passés « é/ée », « ont + voyelle », noms de villes, nombres en lettres). Détail complet + regex scriptable : `memory/tools/elevenlabs.md`.

**Async PixelLab** : jamais annoncer « j'attends » sans exécuter le `sleep` Bash réel. Détail du flow (`animate_character` → `sleep 120` → `get_character()`, relance si "None yet") : `memory/doctrines/ATLAS-PIXELLAB-PLAYBOOK.md`.

**Config** : Node v24.6.0, npm (pas bun), macOS. Packages : `@remotion/paths`, `@remotion/shapes`, `lucide-react`. Clés API : `.env` racine + `quebec-jacques-poc/.env` (Mapbox), jamais hardcoder, détail `memory/apis-and-tools.md`. Render >30s → `scripts/tools/render-on-vercel.py` (défaut) — **EXCEPTION Mapbox/WebGL → `scripts/render-mapbox.sh` OBLIGATOIRE** (Vercel ne supporte pas WebGL headless, jamais `npx remotion render` brut non plus). QA : `scripts/visual_review.py` (routeur multi-modèles review). Audio : `scripts/generate-narration-expressive.py` (narration ElevenLabs) + `scripts/generate-sfx-elevenlabs.py` (SFX).

---

## Hygiène out/ (NON-NEGOTIABLE)

```
out/PRET-PUBLICATION/   livrables valides (jamais modifier)
out/episodes/<ep>/wip/  (purger fin de session) · /versions/ (candidats) · beat<N>-FINAL.mp4
out/templates-souverain/ · out/_r-and-d/ (POC, 7j implicite)
```
Nommage : `beatN_v3.mp4` (wip) → `beatN_V3.mp4` (présenté) → `beatN-FINAL.mp4` (validé) → `PRET-PUBLICATION/<ep>-FINAL.mp4`. Jamais de fichier à la racine de `out/`, jamais de dossier par date. À validation : promouvoir versions/ → FINAL, purger wip/+versions/. Dashboard : template validé → frames mid/end → catbox → `dashboard/templates-souverain.html` → `publish-here-now.sh`.

---

## Communication mobile (Aziz est sur mobile la majorité du temps — NON-NEGOTIABLE)

- **Texte long (script, plan, brief, liste) → directement en texte dans le chat, JAMAIS dans un fichier `.md` créé pour l'occasion.** Un fichier est dur à copier/coller/modifier sur mobile ; du texte en chat se sélectionne, se cite et s'édite facilement. Exception : fichier attendu par un pipeline/skill (manifest, script verrouillé qui sera lu par un script) — dans ce cas le fichier est nécessaire, mais en informer Aziz en clair plutôt que de le laisser deviner qu'il doit l'ouvrir.
- **Tout render (vidéo/image) → uploader AVANT de le présenter, jamais un chemin local.** Ordre de priorité : catbox.moe → Imgur (fallback si catbox down) → uguu.se → Litterbox (dernier recours, 72h seulement). Détail + gotchas (fichier vide silencieux malgré HTTP 200, limite 1min Imgur) : `.claude/.../memory/feedback_upload-hosts-fallback.md`. Toujours vérifier `curl -sI <url> | grep content-length` après upload avant de donner le lien.

---

## Langue & emojis
- Communication : français. Code/docs techniques : anglais.
- **NO EMOJIS IN CODE** : interdit `.ts .tsx .js .json .yaml .env` · autorisé `.md .txt` uniquement.
- **ACCENTS FR OBLIGATOIRES dans les strings AFFICHÉES** (texte à l'écran en JSX) : « SOUVERAINETÉ », pas « SOUVERAINETE ». NO-EMOJIS ≠ NO-ACCENTS — ne pas omettre É/È/À/Ç par confusion. Vérifier avant render (un titre amputé d'accent = faux visuel).
