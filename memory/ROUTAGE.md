# ROUTAGE — Quel fichier / quel skill pour quoi

> **Consulter ce fichier au DÉBUT de toute tâche de production** (avant d'écrire code ou prompt).
> C'est la table d'aiguillage extraite du CLAUDE.md pour alléger le démarrage. Pointeurs uniquement.
> Deux tables : (1) Routage OUTILS — quel fichier LIRE. (2) Routage PROCÉDÉS — quel skill LANCER.
> **Rôle vs MEMORY.md (clarifié 2026-07-11)** : ce fichier = table COMPLÈTE et exhaustive, fait autorité en cas de doute sur où chercher. `MEMORY.md` (`.claude/.../memory/`) = résumé court auto-chargé à chaque session (projets actifs + feedbacks-clés + doctrines les plus critiques), pas remplacé par ce fichier.

---

## 1. Routage OUTILS — LIRE le fichier AVANT d'agir (NON-NEGOTIABLE)

Quand Aziz parle d'un sujet, **charger le fichier correspondant AVANT d'écrire du code ou un prompt**. Si la ligne mentionne aussi un skill, le consulter en complément (jamais à la place de la mémoire projet).

### ⚡ ARBRE DE DÉCISION — SVG ou Mapbox ? (trancher ici avant tout)

| Question | Réponse → Format |
|---|---|
| Le sujet a une **géographie réelle** (frontières, trajet, territoire) ? | → **Mapbox** frame-driven |
| Le sujet est une **transformation visuelle de formes** (mécanisme, flux, montage financier, récit incarné par des formes qui évoluent) ? | → **SVG génératif** |
| Les deux à la fois (géo + transfo narrative) ? | → **Mapbox** pour la géo + **SVG-insert** pour la couche narrative (ex. War-Map AES = carte Mapbox + insert CFA en SVG). Doctrine : `SVG-MIDFORM-FORMAT.md` § "SVG-insert" |
| Doute sur si le SVG sera LISIBLE (forme nouvelle, angle incertain) ? | → **SVG-FAISABILITE-AMONT** obligatoire AVANT tout code |
| Organique **réaliste** (humain, animal photo-réaliste), émotion de visage, scène filmée ? | → image générée (Gemini/Recraft/Seedance), pas SVG. ⛔ **Nuance du 29/08** : une **mascotte stylisée de face** (symétrique, décomposable en primitives) SE DESSINE très bien en SVG — mesuré. Le critère est la décomposabilité, pas « organique ». → `memory/tools/banques-lottie-et-greffe.md` |

> ⭐⭐ **Vue d'ensemble « quel moteur pour quelle nature de contenu » — LES 5 MOTEURS (Mapbox / D3 / SVG+Fable5 / stick-figure / matière filmée H3) sur 1 socle Remotion, + le RACCORD (montage) comme capacité à part entière** : `memory/doctrines/MOTEURS-VISUELS-ET-SOCLE.md`. Cet arbre en est la version rapide « trancher ici » ; la doctrine donne le raisonnement complet et **l'AMPLITUDE PROUVÉE de chaque moteur** (ce jusqu'où c'est allé, pas ce à quoi c'est limité).
> ⛔ **À ouvrir aussi quand une scène part en redite** (« encore des flèches/lignes ») : un moteur oublié = une scène rabattue sur la carte par défaut. Un moteur est un REGISTRE D'EXPRESSION, jamais un catalogue de templates.

---

### Points d'entrée maîtres (lire EN PREMIER en cas de doute « où chercher ? »)

| Sujet | Fichier |
|---|---|
| **État actuel du projet (session précédente)** | `memory/NEXT-ACTION.md` du **REPO PRINCIPAL** — ⭐ 2 questions distinctes : *quel fichier ouvrir ?* celui-ci, jamais la copie d'un worktree (souvent périmée) · *que vaut son contenu ?* il est en RETARD sur les chantiers vivant ailleurs. Protocole : `memory/doctrines/HYGIENE-GIT-MULTI-SESSION.md` §8 |
| **DÉMARRER / RECHERCHER une nouvelle vidéo OU un script (short, mid-form, macro)** | `memory/doctrines/RECHERCHE-PRESCRIPT-UNIFIEE.md` ⭐⭐ DÉCLENCHEUR : dès qu'Aziz dit « je veux faire une vidéo / une recherche sur X / un script sur Y ». La chaîne complète 9 étapes (valider sujet→écrire→fact-check→jury). Aziz n'a PAS à se rappeler des étapes — suivre ce fichier. |
| **PRODUIRE/REFAIRE une scène — le SYSTÈME complet** | `memory/SYSTEME-AGENTIQUE.md` ⭐⭐ carte du système : le FLUX (storyboard→validation→breakdown→code→review), l'orchestration (chef+agents frais), où est chaque brique. Activable à tout moment (« consulte notre système agentique »). |
| **Construire/prolonger TOUTE scène (AVANT de chercher un composant)** | `memory/doctrines/CONTINUITE-SCENE-INTENTION-DABORD.md` ⭐⭐ NON-NEGOTIABLE — déduis l'INTENTION (1 verbe) d'abord, le template en dernier. PUIS porte d'entrée `src/projects/_shared/INTENTION-FORME-INDEX.md` (table intention→forme→réponse, inclut templates Hera ⭐) |
| **Scène NARRATIVE avec un PERSONNAGE humain** (marcher, porter, échanger, foule, attendre) | `src/projects/_shared/stick-figure-svg/STICK-FIGURE-INDEX.md` ⭐⭐ — repo principal (le worktree `remotion-cfa` n'existe plus, vérifié 2026-09-11). FILTRE DE SCÈNE + socle `StickFigure.tsx` à IMPORTER : dedans. |
| **Doute sur quel catalogue ouvrir (tout domaine)** | `src/projects/_shared/INDEX-DES-INDEX.md` ⭐ carte de TOUS les catalogues (fiches techniques, consultées APRÈS l'intention) |
| **Doute catalogue Atlas** | `src/projects/atlas/_shared/ATLAS-INDEX-DES-INDEX.md` ⭐ |
| **Doute catalogue / démarrer War-Map** | `src/projects/warmap/WARMAP-INDEX.md` ⭐ (LA réf = `SudanWarMapEpic60`) |
| **Assets / templates / refs (source unique)** | `public/_shared/ASSETS-INDEX.md` |
| **Tests client-sim (SaaS, hors-Souverain — Flowdesk, NorthShield...)** | `memory/client-sim-tests/INDEX.md` ⭐ — méthode, tests réalisés, et renvoi vers le registre de composants. Volontairement isolé de `MEMORY.md` (sujet secondaire) |
| **Reproduire une vidéo CLIENTE réelle** (repro Foster, « Foster With Confidence ») | `memory/projects/REPRO-FOSTER.md` ⭐⭐⭐ — le premier test qui peut dire NON : ni le sujet ni le niveau d'ambition ne sont de nous. ⛔ Le compteur d'avancement vit UNIQUEMENT dans son § REPRISE, jamais recopié ailleurs. Le protocole mesuré y est gravé (relevé 3 voix `motion-breakdown.py` → tri en 3 catégories → chercher la brique EXISTANTE → mesurer) ainsi que les pièges déjà payés. Code : `src/projects/_client-sim/foster/scenes/`. |

### 📤 Publier une vidéo (titre · miniature · calendrier)

| Sujet | Fichier / outil |
|---|---|
| **⭐⭐ TROUVER LE TITRE d'une vidéo (longue, Short, caption)** | `scripts/tools/jury-titres-llm.py <script.md> --contexte "..."` — ⛔ **jamais générer ET juger un titre soi-même** (juge et partie). Méthode + ce qu'il faut injecter dans `--contexte` : `memory/doctrines/PACKAGING-YOUTUBE.md` §4 |
| **⭐⭐ CONCEVOIR UNE MINIATURE** | `scripts/tools/jury-thumbnail-llm.py` → concepts classés, PUIS composer le SVG soi-même. ⛔ **jamais générée par IA**. `memory/doctrines/PACKAGING-YOUTUBE.md` §5 |
| ⭐⭐⭐ **PACKAGING (titre · miniature · description · engagement) — SOURCE DE VÉRITÉ UNIQUE** | `memory/doctrines/PACKAGING-YOUTUBE.md` (§1 principe · §3 règles · §4 jury titres · §5 miniature · §6 engagement). ⚠️ Son §2 dit ce qui est ÉPROUVÉ et ce qui reste HYPOTHÈSE — le lire avant de citer une règle comme acquise. |
| Grammaire des miniatures validées (métaphore, palette, pipelines A/B/C) | `public/_shared/thumbnails-library/README.md` |
| **Où publier quoi** | `memory/tools/trypost.md` (Shorts + IG + FB, piloté MCP) · **vidéo LONGUE = upload MANUEL YouTube Studio** (garder Test & Compare) · `memory/tools/postiz.md` (TikTok) |
| **Calendrier éditorial en cours + contraintes d'ordre** | `.claude/…/memory/calendrier-publication-2026-08.md` ⭐ ⛔ un Short dont le CTA renvoie à une vidéo longue ne sort JAMAIS avant elle. |
| Tirer un SHORT d'une vidéo LONGUE | `memory/tools/notebooklm-boucle-short.md` ⭐⭐ (NotebookLM produit un Short → on en extrait le PACING ; gotcha n°1 : il perd le climax) |

### Scripts & validation

| Sujet | Fichier |
|---|---|
| **« Quel SCRIPT lancer pour faire X ? » (render/audio/publish/gen/review/data)** | `scripts/SCRIPTS-INDEX.md` ⭐ index des scripts par cas d'usage. Review : `scripts/tools/REVIEW-TOOLS-INDEX.md`. |
| **EXTRAIRE quoi que ce soit de YouTube** (transcript, frames, audio, métadonnées) | `memory/tools/yt-dlp.md` ⭐⭐ — ⛔ JAMAIS scraper à la main, ⛔ JAMAIS tâtonner : les 403/429 y sont déjà résolus. Re-découvert par tâtonnement le 2026-08-20 alors que le fix datait du 08-18 — le fichier était bon, il n'était routé nulle part. |
| **Chaîne complète idée→script blindé (valider sujet → écrire → fact-check → jury)** | `memory/doctrines/RECHERCHE-PRESCRIPT-UNIFIEE.md` ⭐⭐ 9 étapes. Enchaîne `SUJET-PRIME` (0-6) + script + fact-check 3 niveaux + jury. Inclut le raffinement "3 passes" (script déjà publié/raté à refaire) § étape 8. |
| **Refonte d'un script publié qui a flop + script gold-standard de référence** | `memory/episodes/warmap-sahel/SCRIPT-V6-REFONTE-2026-08-06.txt` (noté 8.8-9/10, jury 2 modèles, 3 passes) — à consulter AVANT d'écrire un script dense. Méthode : `memory/feedbacks/feedback_hook-retention-premiere-minute.md` |
| **Diagnostiquer POURQUOI une vidéo publiée ne décolle pas** | `memory/doctrines/DIAGNOSTIC-FLOP-VIDEO.md` ⭐ triage titre/miniature/script en 3 dimensions INDÉPENDANTES (vidIQ + jury script) — ne jamais s'arrêter au premier problème repéré. |
| ⭐⭐⭐ **CHOISIR LA FORME NARRATIVE (avant d'écrire le script)** | `memory/doctrines/FORMES-NARRATIVES.md` — 7 formes + arbre de décision. Non déclarée = héritée par défaut (documentaire explicatif). Gate `.claude/hooks/forme-narrative-gate.sh` |
| Écrire/valider TOUT script narratif (couche orale universelle) | `memory/doctrines/DOCTRINE-SCRIPT-UNIFIEE.md` ⭐ 16 règles (clarté/incarnation/rétention) |
| **Structurer le CORPS d'un script** (squelette objet→mécanisme, sujet déjà validé) | `memory/doctrines/STRUCTURE-OBJET-MECANISME.md` — distinct de `HOOK-PREMIERE-MINUTE` et `SUJET-PRIME-SUR-PRODUCTION` |
| Script Short narratif (Héros Oubliés, conte, tragédie) | `memory/templates/script-ebauche-v1.md` |
| Script Atlas (géo, taille, richesse-record, comparaison) | `memory/templates/script-atlas-v1.md` |
| Hook 5s / cold open (narration) | `memory/templates/hook-short.md` |
| Sous-titres Shorts (TikTok/Karaoké), camera shake | `memory/templates/subtitles-shorts.md` |
| Formule César, 7 beats Shorts, dynamisation | `memory/tools/seedance-community.md` |
| **Template combat AVANT tout prompt/image (checklist obligatoire, ZÉRO exception)** | `memory/templates/combat.md` |
| **Template narratif AVANT tout prompt/image** | `memory/templates/narratif.md` |
| **Template montage AVANT tout prompt/image** | `memory/templates/montage.md` |
| **Template exploration AVANT tout prompt/image** | `memory/templates/exploration.md` |
| **Vérifier densité de mots d'un script (avant TTS payant)** | `scripts/tools/check-script-density.py <script> --format <format>` — gate NON-NEGOTIABLE, déjà intégré au skill `souverain-preproduction`. |
| **Douter de quelle VERSION de script a servi à un rendu final** | `scripts/tools/trace-livrable.py <rendu.mp4> --episode-dir <dossier>` — croise code + audio transcrit, jamais deviner sur le nom du fichier seul. |
| **Vérifier qu'une décision doctrine tranchée (Mapbox frame-driven, anti-patterns Remotion, overlay banni) est bien respectée dans le CODE DÉJÀ ÉCRIT** | `scripts/tools/check-doctrine-violations.py [dossier]` — à lancer périodiquement (pas juste au moment d'éditer), rattrape la dérive du code jamais re-scanné. |

### Souverain

| Sujet | Fichier |
|---|---|
| **Doute « où chercher ? » Souverain — POINT D'ENTRÉE** | `src/projects/souverain/SOUVERAIN-INDEX.md` ⭐ carte maître du pilier |
| **Tirer un SHORT d'une vidéo LONGUE (condensation, script court)** | `memory/tools/notebooklm-boucle-short.md` ⭐⭐ NotebookLM PRODUIT un Short, on en extrait le PACING (jamais un avis écrit). Gabarit « section intouchable » + 6 gotchas. **En AMONT** de SOUVERAIN-SHORT-DEMARRAGE |
| Démarrer/coder un Short Souverain Mapbox (point d'entrée) | `memory/doctrines/SOUVERAIN-SHORT-DEMARRAGE.md` ⭐ 7 étapes → puis `SOUVERAIN-SHORT-SKELETON.md` |
| Doctrine Souverain (durable) | `memory/doctrines/DOCTRINE-SOUVERAIN.md` (LIRE en entier avant tout code Souverain) |
| Règles éditoriales Souverain (sources, couleurs, script Type B) | `memory/rules/rules-souverain-editorial.md` |
| **Direction artistique du CUT VENTE / showcase / livrable client freelance** | `memory/doctrines/CHARTE-DA-FREELANCE.md` ⭐⭐ — ⛔ périmètre freelance UNIQUEMENT, ne remplace pas `CHARTE-EDITORIALE-SOUVERAIN.md` |
| Tailwind (tokens gold/navy/ivory) — TOUT composant Souverain | `memory/feedbacks/feedback_tailwind-remotion-setup.md` · Framer Motion INTERDIT · lire `tailwind.config.ts` |
| SplitScreen 50/50, entité vs entité | `src/projects/_shared/components/layouts/SplitScreenSouverain.tsx` |
| Data-viz Souverain (StackedBars, ProcessFlow, comparaisons $) | `memory/doctrines/DOCTRINE-SOUVERAIN.md` §9 + `PrototypeD3StackedBars.tsx` (D3 utility-only) |
| Breakdown Gemini 3.1-pro (prompt + schema JSON) | `memory/tools/workflow-gemini-breakdown-schema.md` (coller bloc « stack technique ») |

### Atlas

| Sujet | Fichier |
|---|---|
| Coder une scène/beat Atlas (doctrine visuelle, AVANT code) | `memory/doctrines/ATLAS-PLAYBOOK.md` ⭐ → puis `ATLAS-BEAT-DEMARRAGE.md` (scan phase 0) |
| Produire un épisode Atlas (audio + d3-geo + render) | `memory/doctrines/ATLAS-BEAT-DEMARRAGE.md` ⭐ (atlas-template-v1.md = PÉRIMÉ ancienne archi Mapbox) |
| « Quel composant Atlas pour X ? » | `src/projects/atlas/_shared/COMPOSANTS-INDEX.md` · doc : `ATLAS-COMPOSANTS.md` |
| Asset Atlas (sprite, map-object, geo) AVANT générer | `src/projects/atlas/_shared/ATLAS-ASSETS-INDEX.md` (19 persos / 568 sprites) |
| Personnage/sprite PixelLab dans un beat Atlas | `memory/doctrines/ATLAS-PIXELLAB-PLAYBOOK.md` ⭐ · code `AtlasPixelChar.tsx` |
| Règles production Atlas (non-négociable, checklist) | `memory/rules/rules-atlas-production.md` |
| **Self-review SCRIPTÉE d'un beat Atlas (clipPath dupliqué, composant partagé redéfini, caméra à la main)** | `scripts/tools/atlas-selfreview.py <Beat*.tsx>` — miroir `mapbox-selfreview.py`, Phase 3 AVANT présentation Aziz. |
| Format « concept expliqué comme un jeu vidéo » | `memory/doctrines/ATLAS-FORMAT-VIDEO-GAME.md` (concepts oui, drames non) |

### SVG génératif / Shorts SVG

| Sujet | Fichier |
|---|---|
| **(0) Faisabilité SVG AMONT — LIRE AVANT toute génération** | `memory/doctrines/SVG-FAISABILITE-AMONT.md` ⭐⭐ le LLM dit SA meilleure approche + image-cible AVANT le code. ÉTAPE 0 obligatoire (évite les aller-retours coûteux). |
| **(1) Technique génération+animation SVG (manuel principal)** | `memory/doctrines/SVG-SCENES-GENERATIVES.md` ⭐ LLM dessine groupes nommés → Remotion anime, registres, grammaires, acquis transverses |
| **⭐⭐ SCÈNE AVEC PERSONNAGE(S) — quel régime, quelle recette** | `memory/doctrines/SCENE-DEMONSTRATIVE-PERSONNAGE.md` ⭐⭐ — 3 régimes (CONTEMPLATIF/SCHÉMATIQUE/DÉMONSTRATIF) + recette du funambule CFA |
| **Obtenir la FRAME exacte d'un mot de la VO / caler un geste visuel sur la voix** | `scripts/tools/forced-align.py <audio> <texte.txt> [reperes]` — timestamps + frames. Moteur ElevenLabs (⚠️ quota OpenAI/Whisper epuise au 2026-07-25). Vaut pour TOUT beat (SVG, Mapbox, D3), pas seulement le SVG |
| **Scène SVG NEUVE, direction pas encore arrêtée** | `SVG-SCENES-GENERATIVES.md` § PIPELINE 3 MODÈLES — brainstorm texte 3 voix → gate Aziz → image-cible ×3 → **fusion par Claude** → 1 appel d'enrichissement. 2 appels modèle MAX. Outils : `scripts/tools/svg-image-cible-compare.py` + `forced-align.py`. À PROPOSER, jamais déclencher seul |
| **Orchestration agents SVG (A→Z par beat)** | `memory/doctrines/PRODUCTION-AGENTIQUE-SVG.md` ⭐⭐ flux 2 phases + point de contrôle, checklist de lancement, preuve Beat 3 GGW |
| **Format SVG long (5-7min) ou SVG-insert dans Mapbox/Remotion** | `memory/doctrines/SVG-MIDFORM-FORMAT.md` ⭐⭐ critère = transformation visuelle de formes ; pipeline script-first ; playbook assemblage multi-beats |
| **Épisode pilote Short SVG en cours (GGW Muraille Verte)** | `memory/episodes/shorts-svg/muraille-verte/ETAT-GGW-MURAILLE-VERTE.md` ⭐⭐ STATUT + REGISTRE + OUTILS + ACQUIS. Ce fichier PRIME en cas de conflit. |
| Bibliothèque de prompts-cibles SVG par registre | `memory/doctrines/templates/PROMPTS-CIBLES-SVG-PAR-REGISTRE.md` |
| **⭐ Bibliothèque éléments + techniques réutilisables (arbre, soleil, sol, souche + 6 recettes d'animation)** | `src/projects/_shared/svg-library/SVG-LIBRARY-INDEX.md` — lire AVANT de coder une nouvelle scène SVG |
| Table intention → technique SVG (12 intentions : arbre qui pousse, buvard, sway, glow...) | `src/projects/_shared/svg-library/INTENTION-FORME-SVG.md` |
| Index protos R&D validés (renders catbox, verdicts, fichiers source) | `src/projects/_shared/svg-library/RD-INDEX.md` |

### 📦 Livrer en LOTTIE (`.json` / `.lottie`) — format standard du marché
| Je veux… | Fichier |
|---|---|
| **répondre à un brief Lottie en 30 s** (ce qui passe / ce qui casse) | `memory/client-sim-tests/lottie-ui-lcd/CE-QUI-PASSE-EN-LOTTIE.md` ⭐⭐ |
| convertir un SVG en Lottie + savoir ce qui est refusé | `src/projects/_client-sim/lottie-ui/tools/svg2lottie_scene.py --rapport` |
| **extraire le SVG résolu d'une composition Remotion** (⚠️ transversal, pas que Lottie) | `src/projects/_client-sim/lottie-ui/tools/extract-remotion-svg.mjs` |
| transcrire une animation par recalcul de forme (flamme qui ondule) | `…/transcribe_animation.py` |
| regrouper des calques illisibles par intention | `…/group_layers.py` (Soudan 71 → 8) |
| **vérifier qu'un Lottie BOUGE vraiment** / mesurer l'écart au SVG | `…/check_animation.py` · `…/compare_render.py` |
| piloter LottieFiles Creator en direct (110 outils) | `memory/tools/lottie-creator-mcp.md` ⚠️ port 3847 unique |
| l'inventaire complet des 16 outils | `src/projects/_client-sim/CLIENT-SIM-COMPOSANTS-INDEX.md` § OUTILS |

✅ **Le TEXTE passe depuis le 2026-08-26** (`svgtext.py`, 2 voies : vectorisé 1,95 % partout ·
natif `ty:5` éditable **mais 5,74 % si le lecteur n'a pas la police** → vectoriser par défaut).
Les **POINTILLÉS** aussi. ⛔ Restent refusés : filtres, masques, images, `use`.
⛔⛔ **Une carte géographique complète n'est PAS un livrable Lottie** (Aziz, 26/08) : le registre
qui vaut = dashboards/UI, logos, icônes, schémas, objets qui racontent. Prochaine session : `memory/starters/STARTER-PROMPT-lottie-texte-et-animation.md`

### 🧍 PERSONNAGE ANIMÉ / RIG (dessin → rig → geste)
| Je veux… | Fichier |
|---|---|
| **reprendre le personnage vectoriel maison** (V3 faite, ⏸️ EN PAUSE) | `memory/starters/STARTER-PERSO-VECTORIEL-V4.md` ⭐⭐ — 6 contraintes, 3 régressions V3, ratios à ne pas re-chercher |
| **piloter un rig Lottie TIERS** | `memory/starters/STARTER-RIG-PERSONNAGE-EXISTANT.md` ⭐⭐ — ⛔ **2 pièces PILOTABLES sur 23** : aucun standard entre persos pro, la compétence NE se cumule PAS |
| démonter un `.json`/`.lottie` (géométrie MONDE, parentage résolu) | `src/projects/_client-sim/perso-corps-entier/tools/demonter.py` ⛔ **PAS `planche_calques.py`** (lit les `sh` bruts, ignore les `tr` des `gr` → faux mais plausible) |
| faire tourner une articulation / vérifier une amplitude | `…/perso-corps-entier/tools/piloter.py` ⭐ AVERTIT hors plage — **épaule ~25°, coude ~60°** (l'épaule est 2× MOINS tolérante : elle doit rester couverte par le torse) |
| rejouer un rig en FK et rendre les poses (**GATE avant de valider un perso**) | `…/perso-corps-entier/tools/test-rotation.py` |
| **écrire un geste** (table de nombres, pas du code) | `src/projects/_shared/stick-figure-svg/partitions/` — 5 à 7 clés ; ⛔ ~70 lignes de code raisonné = le signal qu'on re-code un geste |

⛔⛔ **Ne pas INVENTER un mouvement quand un mouvement pro dort sur le disque** (le Hiker : marche
complète, 13 calques animés) → `memory/feedbacks/feedback_ne-pas-inventer-un-mouvement-quand-un-mouvement-pro-est-sur-le-disque.md`
⭐ **Le recouvrement ≥ 15 % de la longueur du membre est INVISIBLE sur une image de référence** —
un modèle qui dessine depuis une frame ne peut pas le deviner. C'est LA chose à graver dans un brief.

### War-Map

| Sujet | Fichier |
|---|---|
| **Avant de coder une scène War-Map — scan doctrine + zoom-check ⭐** | `python3 scripts/warmap-session.py --phase scan` (4 pointeurs essentiels) puis `--phase zoom-check <f.tsx> --zoom N --intent close-up\|territorial\|regional` (anti-bug ×10 zoom Mapbox, cf Soudan Acte 3) |
| Coder scène/beat War-Map (changement territoire) AVANT CODE | `memory/doctrines/WARMAP-GRAMMAIRE.md` ⭐⭐ CAUSE avant EFFET + 5 techniques causales |
| War-Map Long (5-7min, 16:9, analytique géopo) | `memory/doctrines/WARMAP-LONG-DOCTRINE.md` ⭐ |
| Insert plein écran « prise de territoire / assaut / mouvement de forces » en SVG pur (PAS Mapbox, pas de géo réelle requise) | `memory/doctrines/WARMAP-INSERT-SVG-ETATMAJOR.md` ⭐⭐ (registre médaillon état-major, réf compo `KhartoumEtatMajorSVG`) |
| Doctrine design War-Map (Mapbox, géo réelle — voie de production assumée, voir note) | `memory/doctrines/WARMAP-PLAYBOOK.md` |
| Doctrine données War-Map (recherche OSINT) | `memory/doctrines/WARMAP-RESEARCH-PLAYBOOK.md` |
| Overlays géo-ancrés sur carte (jetons, drapeaux, plaques, RÈGLE ZÉRO anti-dérive) | `memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md` ⭐⭐ |
> Storyboard carte → **méthode en vigueur : `memory/fiches/FICHE-STORYBOARD.md`** (refondue 2026-08-18). 3 dessinateurs — Grok `grok-imagine-image-2.0` · GPT-image (fal.ai) · Gemini flash-image. ⛔ **Audit du brief par un modèle tiers OBLIGATOIRE avant envoi** (un vocabulaire glissé dans les exemples suffit à souffler la réponse : 3 modèles sur 4 ont proposé une tranchée en 08/2026). ⚠️ L'ancien verdict « GPT supérieur » (13/08) a été établi SANS Grok dans le comparatif.
| Quel outil pour animer quel objet War-Map (SVG/Gemini/PixelLab) | `memory/doctrines/WARMAP-ANIMER-OBJETS.md` |
| « Quelle brique War-Map pour X ? » | `src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md` (+ LINKING mapanimation) |

### Composants & templates — SCAN OBLIGATOIRE AVANT TOUT CODE

> ⛔ **RÈGLE (NON-NEGOTIABLE, même hors `/beat` ou `mapbox-session.py`)** : avant d'écrire une ligne de code
> pour un beat/scène, SCANNER les catalogues du besoin et présenter à Aziz les templates pertinents + ≥2
> combinaisons. Le gate scriptée n'existe QUE dans les sessions beat — en session libre, c'est ma discipline
> qui l'applique. Aziz ne mémorise pas les composants, moi oui. Jamais coder un effet custom sans vérifier l'existant.
>
> ⭐⭐ **Cette règle est un aveu documenté de son propre trou (diagnostic 2026-08-07)** : aucun artefact
> vérifiable ne prouve qu'elle est appliquée, contrairement au DA-brief-gate. Conception d'un vrai gate
> technique (prouver l'USAGE d'une brique, pas la lecture) + d'un agent d'extraction en fin de session
> (fait vivre les catalogues, aujourd'hui pauvres pour Gazoduc/Soudan/AES) : `memory/doctrines/
> STUDIO-REUTILISABLE-GATE.md`. Conception validée Aziz, code pas encore écrit.

**Les 6 catalogues de templates (par besoin) :**

| Besoin | Catalogue |
|---|---|
| Composant Remotion général (stat, comparaison, timeline, hook, portrait, HERO DATA) | `src/projects/_shared/COMPOSANTS-INDEX.md` (71, par cas d'usage) |
| Template carte Mapbox (hook/corps/insert, drapeau/couleur sur territoire) | `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` (28 + helpers) |
| Template data-viz pour Gemini (BarRace, StackedBars, PulseNumber) | `memory/tools/CATALOGUE-TEMPLATES-REMOTION.md` (40+) |
| Composant Atlas | `src/projects/atlas/_shared/COMPOSANTS-INDEX.md` |
| Brique War-Map | `src/projects/warmap/WARMAP-COMPOSANTS-INDEX.md` |
| Hook d'ouverture animé (carte) « on a besoin d'un hook » | `src/projects/_shared/hooks-lib/HOOKS-LIBRARY-CATALOGUE.md` ⭐ (caméra serrée, pas continent figé) |
| Animations presets (fadeIn, popIn, countUp, drawPath) | `src/projects/_shared/animations.ts` (10 presets) |
| Icônes | `lucide-react` installé — `import { Icon } from "lucide-react"` (~1500 icônes) |

### Mapbox (carte)

| Sujet | Fichier / skill |
|---|---|
| Template carte vivante (hook/corps/insert carto) | `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` ⭐ source unique · render `scripts/render-mapbox.sh` |
| Geocoding, coordonnées, distances, GeoJSON | `memory/tools/mapbox-mcp.md` (MCP d'abord, REST si MCP défaillant 2-3 essais) |
| Style.json, design carte, typo, Parchemin Mande | `memory/tools/mapbox-mcp.md` + skills `mapbox-cartography`, `mapbox-style-quality` |
| Intégration React/Remotion, lifecycle, perf headless | skills `mapbox-web-integration-patterns`, `mapbox-web-performance-patterns` |
| Data-viz carto (choropleth, heat map, overlays) | skills `mapbox-data-visualization-patterns`, `mapbox-style-patterns` |

### Outils visuels / audio (refs API)

| Sujet | Fichier |
|---|---|
| Mouvement caméra Atlas/Remotion (code, zero-cost) | `memory/tools/atlas-camera-movements.md` (16 mvts) |
| Mouvement caméra clip AI (orbit, dolly, crane, OTS) | `memory/tools/camera-movements.md` |
| Seedance, Dreamina, prompt vidéo, clip | `memory/tools/seedance-prompts.md` + `seedance-rules.md` |
| Seedance storyboard multi-cut (<15s) | `memory/tools/seedance-storyboard-technique.md` |
| Grok Imagine 1.5, prompt vidéo API, alternative Seedance | `memory/tools/grok-imagine-rules.md` + `grok-imagine-prompts.md` + `memory/checklists/GROK-IMAGINE.md` |
| Template data-viz pour Gemini (BarRace, StackedBars…) | `memory/tools/CATALOGUE-TEMPLATES-REMOTION.md` (40+ templates) |
| Asset PixelLab AVANT génération | `memory/tools/PIXELLAB-MASTER-INDEX.md` (~50 assets avec IDs) |
| Kling, fal.ai, clip 4K, start/end frame | `memory/tools/kling.md` |
| Gemini, retouche image, character sheet | `memory/tools/gemini.md` ⚠️ **LIRE AVANT tout appel Gemini SCRIPTÉ** : la lib `google-genai` HANG sur image (→ REST direct) et ne PAS plafonner `max_tokens` haut pour du SVG (sur-reasoning 8min). Gotchas gravés en tête du fichier — les relire évite de re-perdre 15min (leçon 2026-07-17). |
| Recraft, SVG, asset, vivid_shapes | `memory/tools/recraft.md` |
| ElevenLabs, voix, TTS, narration | `memory/tools/elevenlabs.md` |
| **Corriger le RYTHME/pauses d'une narration validée SANS régénérer** (voix se précipite, phrase coupée, pause manquante) | `memory/doctrines/AUDIO-PAUSES-DETERMINISTES.md` ⭐⭐ silences ffmpeg exacts sur l'audio original + whisper mot-à-mot + garde-fou. Outil `scripts/tools/soudan-audio/pauses-sur-original.py`. Réutilisable TOUT projet. |
| Minimax, musique de fond, kora, griot | `memory/tools/minimax.md` |
| Twelve Labs, analyse vidéo post-render | `memory/tools/twelve-labs.md` |
| SFX, effet sonore AVANT chercher/créer | `public/_shared/sfx/SFX-INDEX.md` |
| Comparaison surfaces géo (vraie taille) | `memory/tools/d3-geo-taille-comparative.md` · `SurfaceComparison.tsx` |

### Remotion / render / publication

| Sujet | Fichier / skill |
|---|---|
| Remotion, animation, render, headless, composition | `memory/tools/remotion.md` + skills `remotion-best-practices/rules/`, `remotion-video-toolkit/rules/rendering.md` |
| Render long (>30s) D3/SVG pur | `npx remotion render` local (défaut). ⛔ `render-on-vercel.py` = POC abandonné 2026-03-27 (repo séparé jamais synchronisé), NE PAS UTILISER. Mapbox/WebGL → `scripts/render-mapbox.sh` obligatoire. |
| **Montrer un render/image à Aziz (mobile — JAMAIS de chemin local)** | ⭐ **Artifact Claude par défaut** (image · HTML · vidéo < 16 Mo), **1 page par SUJET**, lien gardé dans le STARTER du sujet. Rendu > 16 Mo → Vercel Blob (`scripts/tools/upload-to-blob.py`) ; Blob/Artifact HS → catbox → Litterbox. Détail : `feedback_upload-hosts-fallback.md` |
| Règles outils techniques (Lottie, Mapbox headless, audio, geo) | `memory/rules/rules-outils-techniques.md` |
| Publier YouTube + Instagram + Facebook | `memory/tools/trypost.md` (TryPost, limites 50MB, jamais REST `/api/uploads`) |
| Publier TikTok | `memory/tools/postiz.md` (Postiz REST, coverB obligatoire) |
| Calendrier éditorial Kora & Cartes (chaîne) | `memory/episodes/lancement-kora/CALENDRIER-EDITORIAL-JUIN-2026.md` |
| **Freelance / LinkedIn / offre de services** (≠ chaîne : LinkedIn cible des CLIENTS) | `memory/freelance-linkedin/README.md` — porte d'entrée. Le moat chiffré + les 4 obstacles réels : `STRATEGIE-LINKEDIN-FREELANCE.md` · 30 histoires postables + chemin parcouru mars→juil. 2026 : `INVENTAIRE-HISTOIRES.md` · 12 semaines dont 3 posts rédigés : `CALENDRIER-EDITORIAL.md` |
| Distribution Instagram/réseaux (audience chaîne) | `memory/doctrines/STRATEGIE-DISTRIBUTION-INSTAGRAM-2026.md` |
| Pipeline, ordre des étapes | `memory/tools/pipeline.md` ⚠️ daté 2026-05-02 — pour data-viz voir WORKFLOW-DATAVIZ.md |
| API/outil découvert en session → où sauvegarder | `memory/apis-and-tools.md` |
| Leçon/bug/anti-pattern → où sauvegarder | `memory/key-learnings.md` |

### Rangement mémoire (réorg 2026-07-11 — racine `memory/` mise à plat en sous-dossiers)

| Sujet | Dossier |
|---|---|
| Règles de production transverses (`rules-*.md`, ex-racine) | `memory/rules/` (7 fichiers : atlas/beat/data-driven-motion/outils-techniques/souverain-editorial/souverain-script/souverain-storyboard) |
| Backlogs (éditorial + templates reveal-mécanique, fusionnés) | `memory/backlogs/BACKLOG.md` — source unique, sections par thème |
| Starters de reprise de session actifs | `memory/starters/` (STARTER-PROMPT-*.md non périmés) |
| Starters périmés / snapshots de session dépassés | `memory/archive/` (voir aussi `memory/archive/starters-perimes-*/`) |
| Sujets en réserve / stratégiques sans dossier épisode dédié | `memory/projects/` (ex : GAZODUC-MEGAPROJETS-SUJET, HOOKS-LIBRARY-PLAN, heros-oublies-series-signature, EXPLORATION-DIVERSIFICATION-CHAINES) |

### Workflows agentiques et data-viz (2026-06)

| Sujet | Fichier |
|---|---|
| **Pipeline DATA-VIZ complet A→Z** (storyboard→breakdown→Gemini→Recraft→Remotion) | `memory/doctrines/WORKFLOW-DATAVIZ.md` ⭐⭐ — POINT D'ENTRÉE pour toute scène data-viz |
| **Agent autonome scène REMOTION data-viz** (flux 2 phases, checklist, outils) | `memory/doctrines/PRODUCTION-AGENTIQUE-REMOTION.md` ⭐⭐ |
| **Agent autonome scène SVG** (flux 2 phases, checklist, outils) | `memory/doctrines/PRODUCTION-AGENTIQUE-SVG.md` ⭐⭐ |
| Templates Remotion (CATALOGUE) | `src/projects/_shared/COMPOSANTS-INDEX.md` (71 composants, inclut HERO DATA et templates Mapbox aussi référencés) |
| Règles motion design data-driven | `memory/rules/rules-data-driven-motion-design.md` ⭐ |

---

## 2. Routage PROCÉDÉS → SKILLS — LANCER le skill (NON-NEGOTIABLE)

Nos procédés SONT des skills exécutables. Quand un procédé démarre, **LANCER le skill** (via Skill tool), ne pas juste lire un `.md`. Vaut pour Claude principal ET agents autonomes.

| Quand Aziz / un agent veut... | LANCER ce skill / système |
|---|---|
| Préproduction Short Souverain (90s éco/géopo Afrique) | `souverain-preproduction` |
| Préproduction épisode Atlas (carto, géo, richesse) | `atlas-video-preproduction` |
| Préproduction vidéo narrative (Seedance, personnages) | `video-narrative-preproduction` |
| Écrire/structurer un script YouTube (chaîne complète idée→blindé) | `memory/doctrines/RECHERCHE-PRESCRIPT-UNIFIEE.md` (9 étapes) + `memory/doctrines/DOCTRINE-SCRIPT-UNIFIEE.md` (16 règles écriture orale) — remplace l'ex-skill `youtube-scriptwriting` (supprimé 2026-08-01, mort depuis mars, remplacé par ces doctrines internes plus mûres) |
| Produire/coder une WAR-MAP | POINT D'ENTRÉE `src/projects/warmap/WARMAP-INDEX.md` · doctrine `WARMAP-PLAYBOOK.md` + `WARMAP-RESEARCH-PLAYBOOK.md` |
| **Coder un beat Souverain MAPBOX** (carte, getCam, overlays) | SYSTÈME `scripts/mapbox-session.py` — voir « Pipeline Beat Mapbox » dans CLAUDE.md. Self-review `scripts/tools/mapbox-selfreview.py` (0 erreur avant Gemini). Base : `MarocBatteriesShort.tsx` |
| **Coder un beat Souverain REMOTION/Tailwind** (graphisme, data-viz) | SYSTÈME `/beat` (`scripts/beat-session.py`) — voir « Pipeline Beat Souverain ». Doctrine `memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md` |
| Produire un Short en lot | `batch-short-production` |
| Carrousel / caption / réécriture d'un contenu en vidéo | `verif-factuelle` D'ABORD → puis `src/projects/souverain/carousels/hybrid/README.md` |
| Carrousel « Good News » (macro Afrique, indépendant) | `src/projects/souverain/carousels/good-news/README.md` (DATA-DRIVEN `carousel-data.ts`) |
| Analyser une chaîne YouTube | `analyze-channel` |
| Intégrer feedback / corrections post-review | `integrate-feedback` |
| Bilan/checkpoint de session | `checkpoint` (Souverain) ou `atlas-session` (Atlas) |
| **Review externe (plan OU rendu) — quel outil ?** | `scripts/tools/REVIEW-TOOLS-INDEX.md` ⭐ vue unifiée. Système principal = `da-brief.py` (3 voix, upstream/downstream). Modèles CONSULTATIFS jamais juges. |
| ⭐⭐ **Review d'un rendu — CORRECTIF ou PREMIUM ? (trancher AVANT d'écrire le brief)** | `memory/doctrines/GRILLE-JUGEMENT-MIDFORM.md` § Deux modes — fond NON validé → CORRECTIF (`da-brief.py`) · fond VALIDÉ → PREMIUM. Vidéo complète à brief libre : `gemini-video-review-custom.py` · `kimi-video-review-custom.py` |
| **AVANT de coder un acte/beat (vision validée + assets décidés)** | LANCER le skill `da-brief-gate` (Gemini+Kimi+DeepSeek → synthèse tracée dans le PLAN épisode → GATE BLOQUANT, Aziz tranche AVANT le code). Détail procédé : `memory/doctrines/DA-BRIEF-GATE.md`. NON-NEGOTIABLE tous projets. MAX 1 appel/modèle/acte |
| **Bug Remotion/Mapbox — 2e fix sur MÊME symptôme échoue** | `superpowers:systematic-debugging` OBLIGATOIRE. STOP → instrumenter (prouver la valeur réelle) AVANT de fixer. Jamais « c'est l'environnement » sans preuve |
| Beat vidéo qui échoue 2+ fois (visuel) | AVANT de re-coder : œil externe sur la vidéo ratée via `scripts/tools/da-brief.py` (downstream, frames). Voir REVIEW-TOOLS-INDEX. |
| **Chantier créatif bloqué après 2+ rejets consécutifs du même concept/storyboard** (pas au 1er jet) | LANCER le skill `creative-director-dual` — 2 agents `creative-director` en parallèle, brief strictement identique, zéro suggestion d'angle, indépendance mutuelle, Aziz tranche (garde A / garde B / fusionne). Preuve : Short War-Map Sahel 90s débloqué après 4 rejets (2026-07-07), détail `memory/episodes/warmap-sahel/DETAIL-creative-director-reprise-2026-07-07.md`. |
| **Audit qualité d'un épisode MULTI-SCÈNES déjà produit** (avant promotion finale) | skill `passe-amelioration-scene` · doctrine `memory/doctrines/PASSE-AMELIORATION-SCENE-PAR-SCENE.md` (⛔ son § PÉRIMÈTRE : jamais sur un premier jet ni une scène unique) |
| Gros chantier multi-étapes (épisode, pipeline, refactor) | `superpowers:writing-plans` |
| Avant de dire « c'est fait/terminé » | `superpowers:verification-before-completion` |

**Anti-friction** : NE PAS lancer un skill pour du trivial (1 slide, fix 1 ligne, question simple). Le skill se lance quand la tâche a la FORME du procédé, pas par réflexe.

## Voie B2B / freelance (distincte de la voie YouTube)

- **Un client demande une video : quel pilier ?** -> `memory/doctrines/PILIERS-B2B.md` (carte d'aiguillage : carte Mapbox/D3 · scene SVG · **UI produit** · video generee).
- **Simuler un ECRAN / dashboard / SaaS** -> `memory/fiches/FICHE-UI-PRODUIT.md` (pipeline capture Puppeteer + socle shotcraft, injecte automatiquement par hook).
