# NEXT-ACTION — Recommandations actives
> Mis a jour : 2026-06-02. A relire en debut de session, APRES PIPELINE.md.
> Ce fichier repond a : "Que fait-on maintenant ?" et "Quelle voie je recommande ?"

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

### 1. Maroc Batteries Short — BLOC CARTE TERMINÉ ✅, place au BLOC REMOTION
**PHILOSOPHIE (2026-06-03)** : 2 BLOCS séparés. Mapbox d'abord (FAIT), PUIS Remotion, PUIS assemblage. Voir `feedback_philosophie-mapbox-puis-remotion.md`.

**BLOC 1 — CARTE (Mapbox) : ✅ TERMINÉ (les 3 FINAL, SFX + vrais drapeaux corrigés 2026-06-03)**
- Beat 0 Hook : FINAL ✅ https://files.catbox.moe/otcfyz.mp4 — SweepRevealTerritory
- Beat 1 Phosphate : FINAL ✅ https://files.catbox.moe/r30wee.mp4 — vrais drapeaux clip SVG (Maroc+ESP/FRA/DEU)
- Beat 3 Acteurs : FINAL ✅ https://files.catbox.moe/ivv7d8.mp4 — pull back planétaire + 3 drapeaux + lignes connexion + GeoCountryPlaque

**BLOC 2 — REMOTION : ⬜ NEXT**
- **Beat 2 Cailloux** (~12s) — split phosphate/cathode + balance + 5,6 Md$. ⚠️ Assets Gemini à valider AVANT code.
- Beat 4 Géographie (~37s) · Beat 5 Question finale (~10s)
- PUIS assemblage final ffmpeg + mix.

**Acquis session 2026-06-03 (réutilisables)** : `useClipFlags` (vrais drapeaux ⭐⭐), `GeoCountryPlaque` (plaque+source), `camCountryApproach` (pitch 32), 11 templates fill-pattern N1-N4, SFX `<Sequence>` plancher 0.50. Tout référencé dans catalogues + STATUS épisode.
**Architecture** : beats SÉPARÉS (1 composition Root.tsx chacun).

### 1bis. Arsenal templates Mapbox — TERMINÉ (2026-06-02/03)
**28 templates Mapbox** tous référencés (CATALOGUE-CARTE-VIVANTE + COMPOSANTS-INDEX + MAPBOX-COMPOSANTS) :
- 17 (Chantier C/HOOK/COMBOS) : statiques/séquentiels, dynamiques, hooks, inserts, MapCutaway, combos.
- 11 fill-pattern N1-N4 (FlagFill, ResourceTexture, HeatGradient, Waving, Dissolve, ImageProjection, Pulsing, Contagion) + helpers `flagCanvas`, `resourceTextures`, **`useClipFlags` ⭐⭐ (vrais drapeaux)**, `GeoCountryPlaque`.
- Backlog idées non codées : TensionHeatZone, HexGrid, GeoRipple + hooks TacticalRadar/EpicenterShockwave/SatelliteTargetLock/GlitchMapIntro (`memory/tools/gemini-*-ideas-*.json`).
**Pour produire un beat carto** : Phase 0 SCAN templates (CLAUDE.md) → CATALOGUE-CARTE-VIVANTE.

### 2. Senegal Petrole & Gaz — Assemblage final (PRIORITE 2)
**Etat** : Tous beats valides. Reste : assemblage + SFX + correction dette sonore 70%→132%.
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
