# NEXT-ACTION — Recommandations actives
> Mis a jour : 2026-06-16 (nuit, post-grand-ménage). A relire en debut de session, APRES PIPELINE.md.
> Ce fichier repond a : "Que fait-on maintenant ?" et "Quelle voie je recommande ?"

---

## 🧹 (FAIT 2026-06-15→16) — GRAND MÉNAGE WORKSPACE : ce qui a changé (LIRE pour comprendre la nouvelle structure)

> Session dédiée au ménage/réorg complet. **La structure a changé — voici l'essentiel pour ne pas être perdu.** Détail : `memory/key-learnings.md` (section 🔧 MÉTHODE & PROCESS).

- **Démarrage allégé −62%** : `CLAUDE.md` projet (47→~13KB) ne garde que les règles ; le routage complet est extrait dans **`memory/ROUTAGE.md`** (à consulter au début de toute tâche). `MEMORY.md` = index pur 1 ligne/entrée.
- **9 MCP débranchés** (supabase/neon/vercel/netlify/render/sentry/stitch/cavalry/phaser-editor). Rebranchables : `/tmp/menage-backups-2026-06-15/`.
- **3 piliers ont une porte d'entrée symétrique** : `src/projects/souverain/SOUVERAIN-INDEX.md` (NOUVEAU) · `atlas/_shared/ATLAS-INDEX-DES-INDEX.md` · `warmap/WARMAP-INDEX.md`.
- **Doctrines War-Map fusionnées 8→5** : grammaires → **`WARMAP-GRAMMAIRE.md`** · objets+SVG → **`WARMAP-ANIMER-OBJETS.md`**. (Anciens noms WARMAP-GRAMMAIRE-CAUSALE/VIVANTE/CARTE-VS-OVERLAY/OBJETS-GEMINI/SVG-ANIME = supprimés.)
- **Scripts mappés** : `scripts/SCRIPTS-INDEX.md` (par cas d'usage) + `scripts/tools/REVIEW-TOOLS-INDEX.md` (review externe : `da-brief.py` = système principal ; `visual_review.py` remplace `review_with_kimi.py`). 122→91 scripts (tests/POC archivés).
- **Feedbacks rangés** dans `memory/feedbacks/` (plus à la racine). `key-learnings.md` réorganisé par thème + index.
- **Garde-fou liens morts** : `python3 scripts/tools/check-links.py` — À LANCER après tout déplacement de fichier. Navigation principale = 0 lien mort.
- **Disque −4.7 GB** : worktrees morts, `.auto-claude/` supprimé, `out/wip` purgés, logs claude-mem purgés.
- ⚠️ **Reste mineur** (non bloquant) : ~128 liens morts résiduels dans `memory/archive/` + `.claude/agent-memory/` (jamais lus). `atlas-v2-data.json` en 3 copies (dédup risquée, à faire dans une passe dédiée).

---

## ✅ (LIVRÉ 2026-06-15) — BIBLIOTHÈQUE DE HOOKS RÉUTILISABLES

> ✅ **CHANTIER LIVRÉ + commité** (branche `feat/hooks-library`, commits 581542a + 21f7649).
> Code `src/projects/_shared/hooks-lib/`. Catalogue `hooks-lib/HOOKS-LIBRARY-CATALOGUE.md`.
> Source de vérité : `memory/HOOKS-LIBRARY-PLAN.md`. État détaillé : `memory/SESSION-DEDIEE-HOOKS.md` (en-tête).
> 3 hooks distincts (CrosshairLock=traquer / RedlineContagion=propager / MaskReveal=chiffre-masque) +
> insert ArteryDrain, sur fond commun `HookMapBackground` (theme dark/parchemin + camKeys CAMÉRA SERRÉE
> + raccord carte) + `HookEffects` (grain + displacement). Démo réf : catbox `9q75sr`.
> **RESTE (= refonte Acte 1 ci-dessous)** : brancher un hook sur la vraie vidéo AES + narration.
> Différés : version Short verticale · effets AE secondaires (halftone) · morph path (sujet historique).

## ⭐ PRIORITÉ 1 (APRÈS AES) — SOUDAN MID-FORM 7-8min (pré-prod TRÈS AVANCÉE, session 2026-06-16)

> **SUJET VALIDÉ GO** + **grosse session de pré-prod faite le 2026-06-16** (données, scripts Actes 1-2, audio, pipeline render validé, positionnement).
> 🗂️ **POINT D'ENTRÉE = `memory/projects/soudan-midform.md`** → pointe vers tout le dossier (POSITIONNEMENT, DONNÉES, STORYBOARD-ACTE1/2, ACTE3-NOTE, AUDIO-ETAT).
>
> **DÉJÀ FAIT (2026-06-16)** :
> - ✅ Données fact-checkées tracées (Tavily + Deep Research + Sonar Pro) — `soudan-midform-DONNEES.md`.
> - ✅ Scripts Actes 1 + 2 figés fact-checkés + audio GéoAfrique V3 (Acte 1 OK, Acte 2 à régénérer post-correction temporelle).
> - ✅ Storyboards Actes 1-2 (jeton 2-visages = symbole neuf, garde-fous).
> - ✅ Mini-render pipeline validé : `src/projects/warmap/SoudanActe1Ouverture.tsx` (https://files.catbox.moe/dyz9tf.mp4).
> - ✅ Étoile polaire positionnement + cadrage serré tranché.
>
> **NEXT (reprise pré-prod Soudan)** :
> 1. **Acte 3** : combler 2 trous recherche (Russie/Wagner-or-sanctions + Égypte) → `soudan-midform-ACTE3-NOTE-ACTEURS-EXTERNES.md`, PUIS écrire l'acte.
> 2. Actes 4 (coût humain — DOIT inclure nuance génocide ciblé Darfour, voir DONNÉES) + 5 (perspective ouverte).
> 3. Au lock audio : check + régénération sélective acte par acte (`soudan-midform-AUDIO-ETAT.md`).
> 4. Production : vrais jetons Hemeti + Al-Burhan (Gemini) → coder Acte 1 complet cadrage serré.
>
> **Short Soudan en attente** : ACLED toujours inaccessible (compte ordinaire ; Aziz envisage compte business). Finaliser en teaser/parallèle.

---

## 🟡 PRIORITÉ 2 — WAR-MAP SAHEL : PASSE SÉQUENTIELLE scène par scène (révision méthode 2026-06-15)

> ⚠️ **CHANGEMENT DE MÉTHODE (Aziz)** : NE PAS assembler tant que CHAQUE scène n'est pas validée à 100%
> (sinon re-découpage après = complexe pour rien). Ordre : **Acte1 (hook+corps) → P1 → P2 → P3** (P4 ✅ déjà OK).
>
> **✅ P4 VALIDÉE + corrigée** (11 corrections, render `hdxsgi`, `wip/p4-FULL-v3-*.mp4`). Voir `PLAN-REFONTE-P4-POLISH.md`.
> **▶ ACTE 1 = SESSION DÉDIÉE — ⭐ LIRE `memory/episodes/warmap-sahel/PLAN-REFONTE-ACTE1.md` EN PREMIER.**
>   ACQUIS (2026-06-16) : triggers Acte 1 RECALÉS sur V5 + synchro VALIDÉE Aziz (catbox 18wsph, commit a43f2ab) ·
>   prototype hook CrosshairLock+V5 testé (catbox bu8tnl, commit 3e18769). RESTE (4 problèmes, voir PLAN) :
>   (P1) carte hook ≠ carte moteur · (P2) zoom de transition hook→corps à ~10s (idée Aziz) · (P3) retirer
>   légende+timeline + grammaire P3/P4 contours · (P4) recaler timing question. Branche `feat/hooks-library`.
> **PUIS** P1, P2, P3 revues une par une. **PUIS SEULEMENT** assemblage (concat + narration globale
>   `narration-v5-expressive.mp3` + musique **D (Montée maîtrisée)** choisie + mix + vérif anti-figé).
> 🎵 Musique : 6 options générées (`public/_shared/audio/sahel-warmap/music/`), Aziz a choisi **D-montee-maitrisee**.
>
> 📂 DOCS À JOUR : `INVENTAIRE-TEMPLATES-SESSION-06-15.md` (templates utilisés/en réserve) · `STATUS.md` (état) ·
>   `STRATEGIE-DERIVES-SHORT-CARROUSEL.md`. ⛔ OBSOLÈTES (NE PAS suivre) : `PLAN-REFONTE-P4.md`, `BRIEF-PASSATION-P4*.md`
>   (la refonte P4 est TERMINÉE). Templates créés : `WarMapDimmedOverlay` + `WarMapSplitScreen` (2/3 volets).
>
> ✅ **TOUTES SCÈNES FINAL (`out/episodes/warmap-sahel/`)** : acte1 · p1 · p2 · p3 · p4-c1-exode · p4-cfa ·
>    p4-chantier3-confed · p4-ressources · (chantier 4 "fin habitée" dans P4). Historique détaillé ci-dessous :
> - **Chantier 4 FIN HABITÉE** validé + full HD (`wip/p4-c4-FINAL-fullhd-audio.mp4`). NE PAS Y RETOUCHER.
> - **Chantier 1 EXODE** validé Aziz + full HD : `out/episodes/warmap-sahel/p4-c1-exode-FINAL.mp4` (commits 9f69468+fb71473).
>   5 jetons réfugiés (1/sprite, cohortes, profondeur 2.5D top-down PAS de pitch), sillage wet-ink, RefugeeFlow,
>   villes = Lucide MapPin (sprite town-td abandonné). Code : `Partie4Cout.tsx`.
> - **Chantier 2 "COÛT" BOUCLÉ** (fait avec le Chantier 1) : cartouche CENTRAL OPAQUE (pas plein écran), countup
>   3M (3 icônes-personnes) → bascule 15M+ (15 icônes 2 rangées, toutes allumées).
> - **Chantier 3 CONFÉDÉRATION AES VALIDÉ Aziz + full HD (2026-06-14)** : `out/episodes/warmap-sahel/p4-chantier3-confed-FINAL.mp4`
>   (catbox xt8ztb, commits 05c229b+e6a6146). ⭐ Né du **TEMPLATE `WarMapDimmedOverlay`** (carte assombrie +
>   éléments superposés). 3 drapeaux AES → sceau SVG "Sept. 2023", fusion or sur carte.
> - **Chantier "CFA" (Ph8) VALIDÉ Aziz + full HD (2026-06-15)** : `out/episodes/warmap-sahel/p4-cfa-FINAL.mp4`
>   (catbox 5fxlvp, commits 660bf05+06cc12c). ⭐ Né du **TEMPLATE `WarMapSplitScreen`** (2 mondes côte à côte) :
>   GAUCHE carte AES+pièce CFA pulsante / DROITE drapeau FR SVG ondulant + équation "1€=~656 FCFA" → bascule
>   vers le SENS (souveraineté+jeunesse) en typewriter. Faits : `FACTS-CFA-2026.md`.
> - **Chantier 2 "RESSOURCES" (Ph5-6) VALIDÉ Aziz + full HD (2026-06-15)** : `out/episodes/warmap-sahel/p4-ressources-FINAL.mp4`
>   (catbox 88k2gg, commits 20626c2+8ccae8f). ⭐ TRIPLE-SCREEN (`WarMapSplitScreen` 3 volets + accordéon) : Mali|Burkina|Niger,
>   chacun carte zoomée pays + icône ressource + plaque. Niger s'élargit (accordéon) + 2 icônes uranium+pétrole.
>   Faits : `FACTS-RESSOURCES-2026.md`. Review DA : `SYNTHESE-DA-RESSOURCES-TRIPLE.md`.
> ⭐ **2 DOCTRINES + 2 TEMPLATES RÉUTILISABLES** : `WARMAP-GRAMMAIRE.md` (carte = causal/spatial ; conceptuel
>   = overlay/plein écran/split, puis retour carte) + `WarMapDimmedOverlay` + `WarMapSplitScreen` (2 OU 3 volets,
>   accordéon). Test avant toute scène : "ancrage géo réel ?". ⚠️ Plein écran = masquer carte Mapbox
>   (`MAP_HIDE_WINDOWS`) ET contours moteur (`CONTOUR_HIDE_WINDOWS`), sinon "on voit la carte à travers".
>
> ⛔ RÈGLES GRAVÉES : `semitransp` BANNI · synthèse extractive tracée · pas de pitch P4 · arrondir les chiffres
>   sans ambiguïté ("~656" pas "655,957"; "~68t" pas "94,4t") + fact-check web (public fact-checke).
>
> ▶ **RESTE = ASSEMBLAGE FINAL UNIQUEMENT** : les 4 CHANTIERS P4 SONT FAITS (4 Fin habitée ✅ · 1 Exode ✅ ·
>   2 Coût ✅ · 2 Ressources ✅ · 3 Confédération ✅ · CFA ✅). → render full HD P4 complète (f9416→13440) →
>   concat Acte1+P1+P2+P3+P4 + narration globale `narration-v5-expressive.mp3` + mix. C'est la dernière étape de TOUTE la vidéo.
> ✅ DETTE semitransp RÉSOLUE. ℹ️ Render Mapbox local = flag `--gl=angle` obligatoire (sinon WebGL fail).
> ℹ️ Chiffres à l'écran : TOUJOURS arrondir sans ambiguïté (ex "~656" pas "655,957" → lu "655 000"). Public fact-checke.
> ℹ️ Multi-instance : voir `feedback_multi-instance-working-tree.md` (working tree partagé, committer tôt).

## 📦 HISTORIQUE ARCHIVÉ (2026-06-18)

> Sections terminées/acquises (War-Map P3 archive, Peste assemblage, Lancement Kora, War-Map V5 voix,
> 3e pilier War-Map, idée top-down Hannibal, Fait 06-03, Atlas retour aux sources, Système Beat Hero Data)
> déplacées vers **`memory/archive/NEXT-ACTION-historique-2026-06-18.md`** pour alléger ce fichier.
> Les acquis durables vivent dans leurs doctrines/STATUS respectifs (voir MEMORY.md). Consulter l'archive si besoin historique.


## ⏳ ACTION OUVERTE — Activer les routines /schedule (NON FAIT, rappeler à Aziz)

> **Statut : EN ATTENTE.** Aziz a demandé un rappel persistant jusqu'à confirmation.
> Tant qu'Aziz n'a pas dit "c'est activé / fait", **re-signaler en début de session** et proposer de fournir les instructions.

**Quoi** : créer 2 routines cloud `/schedule` pour le monitoring Postiz (Aziz les crée lui-même — clé API en env cloud = sa décision sécurité).
**Comment (instructions que Claude peut redonner sur demande)** :
1. Commandes à taper :
   - `/schedule jeudi 9h exécute scripts/postiz-weekly-check.py et préviens-moi si un post a échoué`
   - `/schedule samedi 10h exécute scripts/postiz-weekly-report.py et donne-moi le bilan`
2. Lors de la création, ajouter Environment variable : `POSTIZ_API_KEY=<la clé du .env>` (les routines tournent en CLOUD, pas d'accès au .env local).
3. Notification : connecteur Slack/email OU consulter https://claude.ai/code/routines
**Doc détaillée** : `src/projects/souverain/carousels/good-news/README.md` section "Monitoring publications (anti-scroll)".
**Prérequis** : ✅ scripts commités (commit abba0ed) — donc le repo cloud cloné y aura accès.
**Quand Aziz confirme l'activation** → supprimer cette section et noter la date d'activation.

---

## ⭐ SYSTEME BEAT REMOTION HERO DATA — EN PLACE (2026-06-03)

Parite avec le systeme Mapbox atteinte. Avant tout beat Souverain Remotion/data-viz :
1. **LIRE** `memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md` (8 principes + section SFX + template storyboard 10 champs).
2. **Pipeline** `/beat` (`scripts/beat-session.py`) : phase 0 SCAN (complet, >=2 combinaisons) → storyboard Gemini multi-panels (`scripts/tools/gemini-storyboard-panels.py`) → breakdown → code → self-review → review Gemini.
3. **Briques** : section HERO DATA de `COMPOSANTS-INDEX.md` (CountUp bounce, HeroMirrorBars, **HeroVerticalBars**, FloatingHeroObject clipCircle/spin, Badge satellite, SubtitleBarSouverain, TextChoc) + helpers `animations.ts`.
4. **Assemblage** : `memory/doctrines/SOUVERAIN-REMOTION-SKELETON.md`.
5. **1er beat produit (preuve)** : A3 Cailloux Maroc — `out/episodes/maroc-batteries/a3-cailloux-FINAL.mp4`.

**Lecon SFX** : toujours vérifier la DURÉE d'un SFX (`ffprobe`) avant usage — `ui/reveal.mp3` était corrompu (voix fantôme 18s), neutralisé. Section ⛔ de `SFX-INDEX.md`.

---

## Projets en cours — decision immediate

### ⭐ SUJET VALIDÉ EN RÉSERVE (gate 2026-06-16) — Mégaprojets / Gazoduc Nigeria-Maroc-Europe
**Etat** : SUJET passé GO par le gate complet [[SUJET-PRIME-SUR-PRODUCTION]] (test 6 étapes rodé, ~22 crédits TubeLab).
Toutes les bases éditoriales sont posées : pourquoi + angle (basculement de dépendance énergétique sur carte) +
pré-titre + format tranché (**mid-form Souverain Mapbox** = 1 Map continue + inserts data-viz Remotion ; PAS War-Map).
**Decision Aziz** : à produire en SESSION DÉDIÉE quand War-Map/Sénégal/Maroc seront finis. Ne rien perdre.
**Reprise** : ouvrir `memory/GAZODUC-MEGAPROJETS-SUJET.md` (checklist de reprise) + `DECODE-modeles-fr-afrique.md` (camp 3).
Reste alors : recherche données NMGP (km/coût/calendrier/13 pays/statut 2026) → script → DA-brief → code Mapbox.

### 0. Carrousel "Good News" — pipeline hebdo PRET (2026-06-02)
**Etat** : Carrousel #1 programmé (3 juin). **Pipeline semi-auto data-driven COMPLET** : carousel-data.ts (source unique) + scripts prepare-goodnews-weekly.py / render-goodnews-carousel.sh / schedule-goodnews-*.py. Tout référencé (README + CLAUDE.md + index).
**Decision en attente** : aucune — pour le carrousel #2, lancer le workflow (voir README good-news section "Pipeline DATA-DRIVEN").
**Ma recommandation** : produire le carrousel #2 la semaine prochaine via le pipeline (1er vrai test du workflow automatisé de bout en bout).
**Demarrer** : `python3 scripts/prepare-goodnews-weekly.py` puis suivre le BRIEF généré.

### 1. Maroc Batteries Short — RESTE A5 GÉOGRAPHIE + ASSEMBLAGE (vérifié 2026-06-03)
**PHILOSOPHIE** : 2 BLOCS séparés. Mapbox d'abord, PUIS Remotion, PUIS assemblage. Voir `feedback_philosophie-mapbox-puis-remotion.md`.

**ÉTAT EXACT (vérifié render par render 2026-06-03) :**
| Beat | État | Render |
|------|------|--------|
| Beat 0 Hook (Mapbox) | ✅ FINAL | `beat0-FINAL.mp4` |
| A2 Phosphate (Mapbox) | ✅ FINAL | `beat1-FINAL.mp4` |
| A3 Cailloux (Remotion) | ✅ FINAL | `a3-cailloux-FINAL.mp4` (HeroVerticalBars + caillou Gemini) |
| A4 Acteurs (Mapbox) | ✅ FINAL | `beat3-FINAL.mp4` |
| **A5 Géographie (Mapbox)** | ❌ **STUB — À PRODUIRE** | `Beat4Geographie.tsx` = placeholder |
| A6 Question (Remotion) | ✅ FINAL | `a6-question-FINAL.mp4` (PHOSPHATE—ET—ASSEMBLAGE → question) |

**NEXT (2 tâches) — STARTER COMPLET : `memory/archive/starters-perimes-2026-06-15/STARTER-PROMPT-maroc-a5-geographie.md`** (scan templates + enchaînement premium + 3 signalements déjà faits) :
1. **A5 Géographie** (~37s, MAPBOX — beat le plus stratégique). Texte : « Pour le Maroc sortir du rôle de fournisseur... Pour l'Europe réduire la dépendance Chine... Le Maroc devient l'endroit où les deux fabriquent ensemble. Ce n'est pas de la diplomatie, c'est de la géographie industrielle. » → 3 sub-moments : Maroc (monter dans la chaîne) / Europe (proximité 2h Espagne, Volkswagen) / **triangle Maroc—Europe—Chine** (flux convergents). Climax visuel = le triangle. Pipeline Mapbox (`mapbox-session.py`).
2. **Assemblage final** : ffmpeg concat des 6 beats dans l'ordre (Beat0→A2→A3→A4→A5→A6) + 1 narration globale + mix. Voir `SOUVERAIN-REMOTION-SKELETON.md` (pattern audio) + `SFX-INDEX.md`.

**Acquis Mapbox réutilisables pour A5** : `useClipFlags` (vrais drapeaux ⭐⭐), `GeoCountryPlaque`, `camCountryApproach`, flux/lignes connexion (cf. A4 Acteurs), SFX `<Sequence>` plancher 0.50.
**Architecture** : beats SÉPARÉS (1 composition Root.tsx chacun).

### 1bis. Arsenal templates Mapbox — TERMINÉ (2026-06-02/03)
**28 templates Mapbox** tous référencés (CATALOGUE-CARTE-VIVANTE + COMPOSANTS-INDEX + MAPBOX-COMPOSANTS) :
- 17 (Chantier C/HOOK/COMBOS) : statiques/séquentiels, dynamiques, hooks, inserts, MapCutaway, combos.
- 11 fill-pattern N1-N4 (FlagFill, ResourceTexture, HeatGradient, Waving, Dissolve, ImageProjection, Pulsing, Contagion) + helpers `flagCanvas`, `resourceTextures`, **`useClipFlags` ⭐⭐ (vrais drapeaux)**, `GeoCountryPlaque`.
- Backlog idées non codées : TensionHeatZone, HexGrid, GeoRipple + hooks TacticalRadar/EpicenterShockwave/SatelliteTargetLock/GlitchMapIntro (`memory/tools/gemini-*-ideas-*.json`).
**Pour produire un beat carto** : Phase 0 SCAN templates (CLAUDE.md) → CATALOGUE-CARTE-VIVANTE.

### 1ter. Short "Petrole de la patience" — PUBLIE (programme 9 juin 2026)
**Etat** : FINAL `out/PRET-PUBLICATION/petrole-patience-short-FINAL.mp4` (91s, 1080x1920). Source `src/projects/souverain/petrole-patience-short/`. Programme Postiz lundi 9 juin 15h UTC (4 plateformes), titre "Decouvrir une fortune et rester pauvre : le pari du Senegal". = TEASER du mid-form. Niger uranium retire du 9 juin (standby, a reprogrammer).
**Fait depuis le showcase** : drapeaux useClipFlags, hook FiberOptic+gold, plaques GeoCountryPlaque (Norvege+Senegal), CTA voix+plaque @koraetcartes, sous-titres, audio (musique 0.10 / SFX 0.35 / boom->ping).

### 2. Senegal Petrole & Gaz — REFONTE V3 SCÈNE PAR SCÈNE (2026-06-18) ⭐⭐
**⭐ DÉMARRER : `memory/episodes/souverain/senegal-petrole-gaz/V3-REFONTE/README.md`** = SOURCE DE VÉRITÉ UNIQUE.
Décision Aziz (2026-06-18) : adopter la narration V3 expressive + refaire les **8 scènes une par une** (méthode
War-Map). **V1 et V3 SÉPARÉS** (V1 = ancienne, publiable, filet/comparatif ; supprimée quand V3 complète). NE PAS MÉLANGER.
- ✅ **SCÈNE 0 (hook) FAITE + validée** : carte se dessine + count-up 8M$ → fracture (sur "limoge") → recomposition
  ("la vérité plus précise"). Composant `src/projects/_proto-16-9/SenegalScene0.tsx`. Rendu : catbox yg9k78. Né de
  la doctrine `CONTINUITE-SCENE-INTENTION-DABORD` (intention→forme→template, prouvée 2× du 1er coup).
- ▶ **NEXT = SCÈNE 1** (3 gisements + paradoxe) → prompt prêt : `V3-REFONTE/STARTER-SCENE-1.md`. 1ère décision = trancher
  le médium (SVG parchemin continuité vs Mapbox carte vivante).
ℹ️ Ancien starter `STARTER-PROMPT-senegal-makeover-premium.md` = PÉRIMÉ (remplacé par V3-REFONTE).
**Etat RÉEL vérifié dans la vidéo (pas les notes)** : la version du 25 mai est **DÉJÀ PUBLIABLE** —
FC-2 (dette 132%) ✅ + FC-4 (Beat0 deux dates) ✅ + assemblage ✅. Le STATUS qui disait "à corriger" était PÉRIMÉ.
**Deadline Postiz 20 juin = DÉCALABLE** (Aziz) — la qualité prime. Pas d'urgence à publier une version non polie.
**Fait cette session (commité, branche feat/hooks-library)** : fix incohérence 80%→132% (Beat14) · lot kraft premium
(ombre+grain, composant `KraftDepth`, Beat11/12/13) · POC ResourceTexture pétrole sur Sénégal (Beat1) ·
upload vidéo Gemini fiable confirmé (`memory/gemini-video-upload-fiable.md`).
**RESTE** (détail dans le starter) : A) chantier carte vivante (4 beats + pitch 32°), B) donut/temps morts navy,
C) outro teaser AES, D) ⭐ audio V3 expressif (narration V1 plate → re-timing 8 beats, session dédiée),
E) assemblage + remplacer média Postiz.

### 3. Carousels Instagram (PRIORITE 3)
**Etat** : Or Africain + Thiaroye PRET-PUBLICATION. Mansa Moussa a refaire.
**Decision en attente** : commencer par Mansa Moussa ou Senegal Petrole ?
**Ma recommandation** : Senegal Petrole d'abord — la video vient d'etre publiee, la matiere est fraiche.
**Demarrer** : lire `memory/archive/starters-perimes-2026-06-15/STARTER-PROMPT-carrousels-hybrides.md`

### 4bis. Peste 1347 — MI-FORME HORIZONTAL (CONCEPT VALIDÉ 2026-06-07 — BACKLOG)
**Statut** : concept validé, backlog — NE PAS commencer avant fin AES + Maroc Batteries.
**Angle** : "pourquoi la Peste noire n'a pas touché l'Afrique sub-saharienne" — zéro concurrent YT toutes langues (TubeLab confirmé). Stop scroller validé Aziz sur 3 frames mockup Gemini.
**Format** : 8-12 min, 16:9, moteur SahelWarMapEngine (~80% réutilisable), narration doctrine Tremblay.
**Fiche complète** : `memory/projects/peste-1347-midform.md`.

### 4. Peste 1347 Atlas — REFONTE AU PLAYBOOK QUASI TERMINÉE (2026-06-05) ⭐
**Etat** : Beats 1-4 **FINAL premium** (refaits cette session). Beat 5 V9 **COMPLET** (1ère fois en 9 tentatives) mais pas encore FINAL.
**Decision en attente** : verdict global Aziz sur Beat5 (bilan demandé avant) + générer anims NORTH premium caravane (pont PixelLab).
**NEXT** : (1) anims north caravane ; (2) retouches Beat5 ; (3) FINAL Beat5 ; (4) assemblage 5 beats + narration + SFX.
**Reprise** : lire `memory/episodes/peste-1347/STATUS.md` (état détaillé par beat + méthode qui a débloqué).
**Méthode validée** : phase par phase + œil Gemini (`gemini-beat5-review.py`) sur beat qui résiste + systematic-debugging + réutiliser templates (CHECK A6 du hook force ça maintenant).

---

## 💡 CHANTIER SCRIPT — Système hook + CTA commentaire (2026-06-13, session dédiée)

**Contexte** : analyse de 3 chaînes "slideshow/animation minimale" (dont Psychology Explained 593k vues avec 10k abonnés) a confirmé que la différence de performance vient quasi exclusivement du hook des 30 premières secondes et du CTA commentaire précoce — pas de la production visuelle.

**Deux livrables à construire en session dédiée :**
1. **Checklist hook universelle** à intégrer dans `SCRIPT-ORAL-DOCTRINE.md` — les 20 premières secondes DOIVENT contenir soit une contradiction choquante, soit une honte réhabilitée, soit un fait qui renverse une croyance commune. Formule : douleur/contradiction identitaire → puis le fait, pas l'inverse.
2. **Template CTA commentaire** à insérer systématiquement à 30-60s dans chaque script (pas seulement en fin). Ex : "Écris en commentaire le pays ou l'empire africain que tu veux qu'on explore — ça m'aide à choisir la prochaine vidéo."

**Cas AES (War-Map Sahel) :** hook potentiellement améliorable mais voix déjà générée. En session dédiée : évaluer si re-générer l'audio du début vaut le coût (coût = 1 partie ElevenLabs + raccord audio) vs laisser tel quel et appliquer sur la vidéo suivante. Décision Aziz.

**Pour toutes les vidéos suivantes :** appliquer le nouveau hook AVANT génération audio (pas après).

---

## 💡 IDÉE BACKLOG — Pipeline Shorts automatisé trending (2026-06-13)

**Concept** : google-news-trends (détection topic) → last30days (validation viralité + angle) → Souverain Short template (Mapbox ou Remotion) → render → TryPost/Postiz. Le stack existe à ~80%, manque uniquement le script d'orchestration topic→script→render.
**Forme réaliste** : semi-automatique — Claude rédige script + recommande template, Aziz valide en 20min, pipeline fait le reste.
**Prérequis avant de développer** : (1) stabiliser la cadence Long Format, (2) créer un "template express" plus épuré (3-4 beats max, zéro délai recherche données).
**Décision** : ne pas commencer maintenant — y revenir quand Long Format bien en place.

---

## Techniques a exploiter (session future)

**⭐ BACKLOG GeoFlowConnection (pipeline Mapbox)** — Le seul type de beat encore cher = connexions pays→pays (gazoduc Algérie→Europe, routes AES/CEDEAO, flux BRICS). Aucune brique. Coder `GeoFlowConnection` headless-safe (lignes/arcs animés entre pays, centroïdes dérivés des bbox projetées, JAMAIS filter:blur CSS) au PREMIER sujet à flux → ces beats passent à 90% assemblage. Détails : `feedback_pipeline-mapbox-maturite-autonomie.md`.

Dossier `_reference-atlas-poc/` cree 2026-06-01 contient des patterns pas encore portes dans le pipeline :
- `AtlasParcheminGlobe.tsx` → mouvements camera spheriques a adapter en Mercator
- `AnimatedCaravan.tsx` → route commerciale animee (applicable Atlas + Souverain)
- `atlas-parchemin-mande.json` → style Mapbox historique (Empire Mali, etc.)
Quand : prochaine session Atlas ou episode historique africain.

---

## Regles de mise a jour de ce fichier

Claude met a jour ce fichier en FIN DE SESSION quand :
- Un projet change de statut (termine, bloque, decision prise)
- Une nouvelle decision technique est arretee
- L'ordre des priorites change

Format : 3 lignes max par projet (Etat / Decision en attente / Recommandation).
