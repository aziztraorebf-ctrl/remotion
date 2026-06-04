# NEXT-ACTION — Recommandations actives
> Mis a jour : 2026-06-03. A relire en debut de session, APRES PIPELINE.md.
> Ce fichier repond a : "Que fait-on maintenant ?" et "Quelle voie je recommande ?"

---

## ✅ FAIT 2026-06-03 — A (double audit) + B (faisabilite Atlas) — voir suite pour NEXT

### A. DOUBLE AUDIT doctrine "inspiration externe" — ✅ TERMINE (commit b110ac9)
Croise Claude principal + agent vierge. 7 trous corriges + testes : E1 SFX (3 faux negatifs),
self-review `--file` requis + gate marqueur, E4 blur->ERROR, E2 non auto-desarme, seuil 10/12
reel, prompt Gemini parametre, plafond simultaneite requalifie (non outille = honnete).
Branche `fix/audit-gates-mapbox-inspiration-externe`. A MERGER dans master quand Aziz valide.

### B. FAISABILITE Atlas — ✅ GO PROUVE (commit 90c0fe0)
Aziz a pris le Route Pack mapanimation (19,99$, 40 generations). Decode 7 refs. **Verdict :
d3-geo headless = bon moteur (clipPath deja eprouve en render, mieux que Mapbox).** Brique
`AtlasAttackArrow.tsx` codee + polishee + validee render (fleche tactique sequentielle, mode
carte light). 3 decouvertes durables dans `feedback_atlas-inspiration-externe-faisabilite.md`
+ `atlas-pixellab-differentiel.md`.

## ⏳ PROCHAINE SESSION — ATLAS : retour aux sources FAIT, place au playbook vivant

> **VIRAGE MAJEUR 2026-06-03 (Aziz)** : le playbook Atlas se derive de Ghana + Mansa Moussa
> (nos 2 Atlas validees), PAS de mapanimation (externe) ni de sujets hypothetiques (Cannes/Hannibal).
> Doctrine : `feedback_atlas-retour-aux-sources-ghana-mansa.md`. Playbooks : `memory/doctrines/ATLAS-*.md`.

**FAIT cette session :**
1. ✅ Fleches tactiques (`AtlasAttackArrow` + `AtlasEncirclement` + projections geoUtils) — GARDE
   comme template "enrichissement" (idee mapanimation, codee par nous). Demos Cannes en R&D.
2. ✅ **DECODAGE Ghana + Mansa Moussa** (code integral + frames) → `memory/atlas-decode/DECODE-*.md`.
3. ✅ **RESTAURE Mansa Moussa** (purge au Menage) : code `_reference/mansa-moussa-v2/` + 79 assets
   PixelLab `public/atlas-mansa-moussa/` (4 sprites : mansa couronne, porteur, soldat, chameau).
4. ✅ **PLAYBOOK ATLAS ecrit** (3 fichiers, `memory/doctrines/ATLAS-*.md`) : doctrine visuelle +
   couche PixelLab + checklist demarrage. Indexes (MEMORY.md + CLAUDE.md routage).
5. ✅ **AUDIT bibliotheque** (3 agents) → `memory/atlas-decode/audit/`. Atlas a la matiere
   (13 blueprints, 568 sprites/19 persos, 8 composants) mais pas l'organisation.
6. ✅ **NETTOYAGE verifie** : clarif AtlasCaravane(chibi)/AtlasPixelChar(acteur) ; les "doublons"
   atlas-components vs atlas-v2-components sont 2 VERSIONS vivantes (Peste vs Mansa) — NE PAS merger.
7. ✅ **BIBLIOTHEQUE ORGANISEE (parite Souverain)** : 3 catalogues dans `src/projects/atlas/_shared/` :
   `ATLAS-INDEX-DES-INDEX.md` (carte maitre) + `COMPOSANTS-INDEX.md` ("quand Aziz dit") +
   `ATLAS-ASSETS-INDEX.md` (568 sprites/11 JSON geo). Branches dans INDEX Souverain + CLAUDE.md.
8. ✅ **MANSA MOUSSA AUTONOME + VALIDE EN RENDER** : orchestrateur+timing dans `_reference/`,
   enregistre Root.tsx (`AtlasMansaMoussaV2`). Render preuve : caravane PixelLab (Mansa couronne +
   suiveurs sur route doree) + overlays + 2 inserts dataviz + FlagFill + medaillon = TOUT REND.
   Restauration code+assets PROUVEE. Frames : `out/_r-and-d/atlas-decode/mansa-rerender/PREUVE/`.

9. ✅ **TEST SYSTEME REUSSI (1er beat via agent vierge)** : un agent SANS contexte a produit le beat
   "porteur depose un sac d'or au Sahara, repart, l'or persiste" (Silent Barter sur carte Mansa) en
   suivant UNIQUEMENT la doc. Le routage l'a guide de bout en bout. Beat valide en render + APPROUVE
   Aziz (zoom, marche point-fixe sans fleche, or+pulse, SFX pas excellents). `AtlasV2SaharanDropScene`
   + `AtlasV2SaharanDropDemo`. catbox znmqfr. PREUVE que le systeme guide un nouveau venu.
10. ✅ **FIX moonwalk** : flip-ouest d'`AtlasPixelChar` corrige (miroir autour de x, pas offset
    decale) → corrige TOUS les futurs beats. Zero regression Mansa (va vers l'est). Insights raccordes :
    COMPOSANTS-INDEX (nouveau template drop-objet), ATLAS-PIXELLAB-PLAYBOOK (lecon flip + friction
    projection geoUtils!=paths json), SFX-INDEX (backlog sfx-gold-coins-drop).

**Branche : `feat/atlas-playbook-retour-aux-sources` (11 commits) — A MERGER quand Aziz valide.**
**Fiche reprise : `memory/episodes/atlas-systeme/STATUS.md`.**

**PROCHAINS CHANTIERS (ordre suggere) :**
1. **CONTINUER A TESTER LE SYSTEME** sur d'autres beats (Aziz veut eprouver) — varier les patterns :
   une confrontation 2 sprites, un empire qui s'etend, un Spotlight Insert chiffre. Chaque beat teste
   une partie differente du systeme et nourrit la biblio. Le 1er (drop-objet) = VALIDE.
2. **OUTILLER le demarrage** : `scripts/atlas-beat-session.py` (miroir beat-session.py) + selfreview,
   depuis `ATLAS-BEAT-DEMARRAGE.md`. Rend la discipline executable (le scan force, comme /beat Souverain).
3. **EXTRAIRE en composants partages** (grep-usage AVANT) : SpotlightInsert (GHANA sel/or), AtlasPixelChar
   (→ _shared), inserts charts Mansa, composants Shaka. Backlog dans COMPOSANTS-INDEX.

**Backlog mineur :** SFX `atlas/sfx-gold-coins-drop.mp3` a generer (drop d'or). Anim crouch pour
porteur-mali NON necessaire (Aziz : le perso qui s'arrete suffit). Ancres `.europe`/`.grece` projections
fleches (si Napoleon). Bug lisibilite Cannes Hannibal (zoom x80 carte figee). Render background peut
se bloquer au bundling grosse compo → stills directs pour valider vite. Workflow tool : un agent peut
oublier StructuredOutput en fin → recuperer le travail des transcripts si ca plante.

---

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
4. **Assemblage** : `memory/SOUVERAIN-REMOTION-SKELETON.md`.
5. **1er beat produit (preuve)** : A3 Cailloux Maroc — `out/episodes/maroc-batteries/a3-cailloux-FINAL.mp4`.

**Lecon SFX** : toujours vérifier la DURÉE d'un SFX (`ffprobe`) avant usage — `ui/reveal.mp3` était corrompu (voix fantôme 18s), neutralisé. Section ⛔ de `SFX-INDEX.md`.

---

## Projets en cours — decision immediate

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

**NEXT (2 tâches) — STARTER COMPLET : `memory/STARTER-PROMPT-maroc-a5-geographie.md`** (scan templates + enchaînement premium + 3 signalements déjà faits) :
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

### 2. Senegal Petrole & Gaz — Assemblage final (PRIORITE 2)
**Etat** : Tous beats valides. Reste : assemblage + SFX + correction dette sonore 70%→132%.
**⚠️ ALERTE PUBLICATION** : le mid-form est programme Postiz le **20 juin 15h UTC** mais pointe vers `senegal-petrole-gaz-FINAL-compressed.mp4` du **25 mai** (PRE-corrections FC-2 dette 132% + FC-4 Beat0). AVANT le 20 juin : assembler la version corrigee + re-uploader/remplacer le media Postiz, sinon une version fausse part en ligne.
**Decision en attente** : aucune — executer directement.
**Demarrer** : lire `memory/STARTER-PROMPT-senegal-assemblage-final.md`

### 3. Carousels Instagram (PRIORITE 3)
**Etat** : Or Africain + Thiaroye PRET-PUBLICATION. Mansa Moussa a refaire.
**Decision en attente** : commencer par Mansa Moussa ou Senegal Petrole ?
**Ma recommandation** : Senegal Petrole d'abord — la video vient d'etre publiee, la matiere est fraiche.
**Demarrer** : lire `memory/STARTER-PROMPT-carrousels-hybrides.md`

### 4. Peste 1347 Atlas — Beat 5 Mali Vivant (EN PAUSE)
**Etat** : Storyboard pret. Beat 5 non commence.
**Decision en attente** : aucune — executer quand Souverain est calme.
**Demarrer** : `python3 scripts/atlas-session.py --episode peste-1347 --beat 5`

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
