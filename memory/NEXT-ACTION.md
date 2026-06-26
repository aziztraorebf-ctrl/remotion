# NEXT-ACTION — Recommandations actives
> Mis a jour : 2026-06-25 (élagage archive → `memory/archive/NEXT-ACTION-historique-2026-06-25.md`). A relire en debut de session, APRES PIPELINE.md.
> Ce fichier repond a : "Que fait-on maintenant ?" et "Quelle voie je recommande ?"

---

## ⭐⭐ PISTE STRATÉGIQUE FRAÎCHE (2026-06-22) — Shorts SVG ↔ Longs Mapbox (Hub & Spoke)
> 🗂️ Analyse Hub & Spoke gravée dans `memory/doctrines/SVG-SCENES-GENERATIVES.md` § Hub & Spoke + `ETAT-GGW-MURAILLE-VERTE.md` (acquis GGW). Aziz veut s'y lancer « pendant que c'est frais ».
> En bref : 2 formats séparés MÊME niche — longs analytiques (Mapbox/3D, autorité) + shorts SVG génératifs
> (paper-cut/blueprint, pédagogiques, multi-plateforme, gardent la chaîne vivante). PAS de la dilution = Hub & Spoke.
> ⚠️ AVANT d'industrialiser : (1) créer une SIGNATURE VISUELLE commune longs↔shorts · (2) tunnel = NOTORIÉTÉ
> cross-plateforme, pas conversion directe · (3) garder le gate [[SUJET-PRIME-SUR-PRODUCTION]] sur les shorts.
> CHANTIER NEUF = **assembler/monter PLUSIEURS scènes SVG en récit court** (storyboard de short + transitions/collage
> entre scènes — jamais testé, on a des scènes ISOLÉES). Prérequis prouvé = [[SVG-SCENES-GENERATIVES]].

## ⭐⭐ REPRISE (2026-06-21) — SYSTÈME CARTO V5 (dire « continue carto »)

> 🗂️ POINT D'ENTRÉE UNIQUE : `REPRISE-SYSTEME-CARTO-V5.md` (état exact, ce qui marche, ce qui reste).
>
> ⛔ **DÉCISION RENVERSÉE le 2026-06-21** : la note du 20 juin disait « parchemin d3-geo PRÉFÉRÉ ». **FAUX désormais.**
> Aziz a tranché : la carte canonique Souverain = **GéoAfrique V5 (navy/gris/or)**, réf `carte-souverain-geoafrique-v5.jpg`
> + short Sénégal publié. La d3-geo parchemin était le MAUVAIS départ (corrigé). Les fichiers `STARTER-REPRISE-coding-V2.md`,
> `PASSE-DE-VIE-V2-parchemin.md`, `breakdown-V2-plat.json`, `PROMPT-BREAKDOWN-CARTO-PLAT.txt` = PÉRIMÉS pour Souverain (ne pas suivre).
>
> **✅ SYSTÈME COMPLET ET PROUVÉ (session 2026-06-21 soir)** — doctrine source unique `memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md` :
> cible `CartoSouverainV5` (3 modes cam, drift) · **jetons hexagonaux** `GisementTokens.tsx` (5 variantes, 2 modes, taille zoom-driven) ·
> **projection drapeau sans dérive** `MapboxCountryFlagDecal.tsx` · caméra-plonge · couleurs nationales · **appel SVG dédié** `scripts/tools/llm-gen-svg.py` ·
> **gate** `mapbox-selfreview.py` enrichi (E6/W6/W7/W8) · assombrissement V5 tranché.
> **✅ TEST DE VÉRITÉ RÉUSSI** : agent vierge a reproduit le système A→Z (Nigéria) → 6 trous corrigés.
> **▶ RESTE (prochaine session)** : (1) ⭐ **CODER LA VRAIE SCÈNE Mapbox Sénégal branchée AUDIO** ·
> (2) peaufinage scène gisements (popup E4 à déporter, plaque E2, jauge 18%) · (3) merger `feat/systeme-carto-v5` dans master.
> ⏳ **SESSION WAR-MAP DÉDIÉE séparée** : 3 contradictions doctrine WarMap (d3-geo vs Mapbox, R4 vs DimmedOverlay).

## ⭐⭐ REPRISE IMMÉDIATE (2026-06-20) → `memory/REPRISE-WORKFLOW-DATAVIZ.md` — LIRE EN PREMIER

> **Le workflow DATA-VIZ complet est PROUVÉ A→Z et GRAVÉ** (`memory/doctrines/WORKFLOW-DATAVIZ.md`) : storyboard
> = CIBLE → breakdown GPT-5.5 (verdict GÉNÉRÉ/REMOTION/HYBRIDE + prompts d'asset + Tailwind + tailles mesurées)
> → génération Gemini → détourage Recraft → assemblage Remotion → diff cible-vs-render. Cobaye Maroc "70%" rendu
> jusqu'à v5 (~fidèle). **Tous les liens A→Z + les 3 corrections restantes + la commande de l'agent vierge de
> validation sont dans `REPRISE-WORKFLOW-DATAVIZ.md`.** PROCHAINE SESSION : lancer l'agent vierge AU DÉBUT (contexte
> frais) AVANT de toucher au code, puis les 3 corrections pixel (70 plus grand · trou du 0 · picto réserves).
>
> ✅ Les **3 TROUS du chantier peaufinage sont TRAITÉS** : (1) ratio vertical→horizontal CORRIGÉ, (2) breakdown précis sur les assets CORRIGÉ, (3) préambule premium data-viz CRÉÉ. + gate review fiabilisé.

---

## ⏳ ACTION OUVERTE — Activer les routines /schedule (NON FAIT, rappeler à Aziz)

> **Statut : EN ATTENTE.** Aziz a demandé un rappel persistant jusqu'à confirmation.
> Tant qu'Aziz n'a pas dit "c'est activé / fait", **re-signaler en début de session** et proposer de fournir les instructions.

**Quoi** : créer 2 routines cloud `/schedule` pour le monitoring Postiz (Aziz les crée lui-même — clé API en env cloud = sa décision sécurité).
**Comment (instructions que Claude peut redonner sur demande)** :
1. Commandes à taper :
   - `/schedule jeudi 9h exécute scripts/postiz-weekly-check.py et préviens-moi si un post a échoué`
   - `/schedule samedi 10h exécute scripts/postiz-weekly-report.py et donne-moi le bilan`
2. Lors de la création, ajouter Environment variable : `POSTIZ_API_KEY=<la clé du .env>`
3. Notification : connecteur Slack/email OU consulter https://claude.ai/code/routines
**Doc détaillée** : `src/projects/souverain/carousels/good-news/README.md` section "Monitoring publications (anti-scroll)".
**Quand Aziz confirme l'activation** → supprimer cette section et noter la date d'activation.

---

## Projets en cours — décision immédiate

### ⭐ SUJET VALIDÉ EN RÉSERVE (gate 2026-06-16) — Mégaprojets / Gazoduc Nigeria-Maroc-Europe
**Etat** : SUJET passé GO par le gate complet [[SUJET-PRIME-SUR-PRODUCTION]].
**Decision Aziz** : à produire en SESSION DÉDIÉE quand War-Map/Sénégal/Maroc seront finis.
**Reprise** : ouvrir `memory/GAZODUC-MEGAPROJETS-SUJET.md` + `DECODE-modeles-fr-afrique.md` (camp 3).

### 0. Carrousel "Good News" — pipeline hebdo PRET (2026-06-02)
**Etat** : Pipeline semi-auto data-driven COMPLET.
**Decision en attente** : aucune — pour le carrousel #2, lancer le workflow (voir README good-news section "Pipeline DATA-DRIVEN").
**Demarrer** : `python3 scripts/prepare-goodnews-weekly.py` puis suivre le BRIEF généré.

### 1. Maroc Batteries Short — RESTE A5 GÉOGRAPHIE + ASSEMBLAGE (vérifié 2026-06-03)

**ÉTAT EXACT (vérifié render par render 2026-06-03) :**
| Beat | État | Render |
|------|------|--------|
| Beat 0 Hook (Mapbox) | ✅ FINAL | `beat0-FINAL.mp4` |
| A2 Phosphate (Mapbox) | ✅ FINAL | `beat1-FINAL.mp4` |
| A3 Cailloux (Remotion) | ✅ FINAL | `a3-cailloux-FINAL.mp4` |
| A4 Acteurs (Mapbox) | ✅ FINAL | `beat3-FINAL.mp4` |
| **A5 Géographie (Mapbox)** | ❌ **STUB — À PRODUIRE** | `Beat4Geographie.tsx` = placeholder |
| A6 Question (Remotion) | ✅ FINAL | `a6-question-FINAL.mp4` |

**NEXT (2 tâches) — STARTER COMPLET : `memory/archive/starters-perimes-2026-06-15/STARTER-PROMPT-maroc-a5-geographie.md`** (scan templates + enchaînement premium + 3 signalements déjà faits) :
1. **A5 Géographie** (~37s, MAPBOX). 3 sub-moments : Maroc (monter dans la chaîne) / Europe (proximité Espagne, Volkswagen) / **triangle Maroc—Europe—Chine**. Pipeline Mapbox (`mapbox-session.py`).
2. **Assemblage final** : ffmpeg concat des 6 beats + 1 narration globale + mix.

### 2. Senegal Petrole & Gaz — REFONTE V3 SCÈNE PAR SCÈNE (MAJ 2026-06-25) ⭐⭐
**⭐ SOURCE DE VÉRITÉ UNIQUE : `memory/episodes/souverain/senegal-petrole-gaz/V3-REFONTE/README.md`**
**+ `out/episodes/senegal-petrole-gaz/_ASSEMBLAGE-V3.md`** (renders FINAUX).
- ✅ **SCÈNES 0, 1, 2, 3, 4 = FAITES, gravées FINALES.** Audio 0→288.7s ≈ 50% narration.
- ▶▶ **SCÈNE 5 = NEXT** (coulisses/Yakaar, Beat13). Point d'entrée audio **288.7s**. Pipeline agentique Remotion → `BRIEF-AGENT-SCENE-5.md`. Déléguable à des agents en parallèle.
ℹ️ PÉRIMÉS (supprimés 2026-06-25) : `STARTER-PROMPT-senegal-makeover-premium.md`, `STATUS.md` (V1), `REPRISE-SCENE-1.md`, `STARTER-SCENE-1.md`, `REPRISE-SCENE-2-COMPARAISON.md`, `REPRISE-SCENE-4-DETTE.md`.

### 3. Carousels Instagram (PRIORITE 3)
**Etat** : Or Africain + Thiaroye PRET-PUBLICATION. Mansa Moussa a refaire.
**Decision en attente** : commencer par Mansa Moussa ou Senegal Petrole ?
**Ma recommandation** : Senegal Petrole d'abord — la video vient d'etre publiee, la matiere est fraiche.

### 4bis. Peste 1347 — MI-FORME HORIZONTAL (CONCEPT VALIDÉ 2026-06-07 — BACKLOG)
**Statut** : concept validé, backlog — NE PAS commencer avant fin AES + Maroc Batteries.
**Fiche complète** : `memory/projects/peste-1347-midform.md`.

### 4. Peste 1347 Atlas — REFONTE AU PLAYBOOK QUASI TERMINÉE (2026-06-05) ⭐
**Etat** : Beats 1-4 **FINAL premium**. Beat 5 V9 **COMPLET** mais pas encore FINAL.
**Decision en attente** : verdict global Aziz sur Beat5 + générer anims NORTH premium caravane (pont PixelLab).
**Reprise** : lire `memory/episodes/peste-1347/STATUS.md`.

---

## 🟡 PRIORITÉ 2 — WAR-MAP SAHEL : PASSE SÉQUENTIELLE scène par scène

> ⚠️ **CHANGEMENT DE MÉTHODE (Aziz)** : NE PAS assembler tant que CHAQUE scène n'est pas validée à 100%.
>
> ✅ **TOUTES SCÈNES FINAL** : acte1 · p1 · p2 · p3 · p4 (6 scènes).
> ▶ **RESTE = ASSEMBLAGE FINAL UNIQUEMENT** : render P4 complète → concat + narration `narration-v5-expressive.mp3` + mix.
> 🎵 Musique : Aziz a choisi **D-montee-maitrisee** (`public/_shared/audio/sahel-warmap/music/`).
> 📂 DOCS : `memory/episodes/warmap-sahel/STATUS.md` · ⛔ OBSOLÈTES : `PLAN-REFONTE-P4.md`, `BRIEF-PASSATION-P4*.md`.
>
> ▶ **ACTE 1 = SESSION DÉDIÉE — ⭐ LIRE `memory/episodes/warmap-sahel/PLAN-REFONTE-ACTE1.md` EN PREMIER.**
>   ACQUIS : triggers Acte 1 RECALÉS + synchro VALIDÉE Aziz · prototype hook CrosshairLock+V5 testé. RESTE (4 problèmes, voir PLAN) :
>   (P1) carte hook ≠ carte moteur · (P2) zoom de transition hook→corps à ~10s · (P3) retirer légende+timeline + grammaire P3/P4 contours · (P4) recaler timing question.

---

## ⭐ PRIORITÉ 1 (APRÈS AES) — SOUDAN MID-FORM 7-8min (pré-prod TRÈS AVANCÉE, session 2026-06-16)

> **SUJET VALIDÉ GO** + grosse session de pré-prod faite le 2026-06-16.
> 🗂️ **POINT D'ENTRÉE = `memory/projects/soudan-midform.md`**
>
> **DÉJÀ FAIT (2026-06-16)** : données fact-checkées · scripts Actes 1+2 figés · audio GéoAfrique V3 · storyboards Actes 1-2 · mini-render pipeline validé · positionnement tranché.
>
> **NEXT (reprise pré-prod Soudan)** :
> 1. **Acte 3** : combler 2 trous recherche (Russie/Wagner-or-sanctions + Égypte) → `soudan-midform-ACTE3-NOTE-ACTEURS-EXTERNES.md`, PUIS écrire l'acte.
> 2. Actes 4 (coût humain — inclure nuance génocide ciblé Darfour) + 5 (perspective ouverte).
> 3. Au lock audio : check + régénération sélective acte par acte (`soudan-midform-AUDIO-ETAT.md`).
> 4. Production : vrais jetons Hemeti + Al-Burhan (Gemini) → coder Acte 1 complet cadrage serré.
>
> **Short Soudan en attente** : ACLED toujours inaccessible.

---

## 💡 CHANTIER SCRIPT — Système hook + CTA commentaire (2026-06-13, session dédiée)

**Deux livrables à construire en session dédiée :**
1. **Checklist hook universelle** à intégrer dans `SCRIPT-ORAL-DOCTRINE.md` — les 20 premières secondes DOIVENT contenir soit une contradiction choquante, soit une honte réhabilitée, soit un fait qui renverse une croyance commune.
2. **Template CTA commentaire** à insérer à 30-60s dans chaque script.

---

## 💡 IDÉE BACKLOG — Pipeline Shorts automatisé trending (2026-06-13)

**Décision** : ne pas commencer maintenant — y revenir quand Long Format bien en place.

---

## Techniques a exploiter (session future)

**⭐ BACKLOG GeoFlowConnection (pipeline Mapbox)** — Coder `GeoFlowConnection` headless-safe (lignes/arcs animés entre pays, centroïdes dérivés des bbox projetées) au PREMIER sujet à flux. Détails : `feedback_pipeline-mapbox-maturite-autonomie.md`.

Dossier `_reference-atlas-poc/` : patterns pas encore portés dans le pipeline :
- `AtlasParcheminGlobe.tsx` → mouvements camera spheriques a adapter en Mercator
- `AnimatedCaravan.tsx` → route commerciale animee (applicable Atlas + Souverain)
- `atlas-parchemin-mande.json` → style Mapbox historique (Empire Mali, etc.)

---

## 🧹 CHANTIERS DE NETTOYAGE RESTANTS (post-consolidation 2026-06-25)

> Session dédiée requise pour chacun. NE PAS faire en pleine prod.

1. **Rangement `src/projects/_rnd/svg-scenes/`** (17+ variantes écartées) : désimporter de `Root.tsx` D'ABORD (sinon build cassé), PUIS `git mv` vers `_archive/`. Ordre obligatoire : désimport → vérif build → mv. Détail : README du dossier `_rnd/svg-scenes/`.
2. **Extraction `atlas-components.tsx`** (1009L, 23 imports) : reportée, à faire au calme — refactor d'un seul fichier monolithique.
3. **Purge `out/`** (~1.5 GB estimés) : `out/_r-and-d/` >7j (sauf `cobaye-maroc-phosphate/` GARDER) + `out/episodes/warmap-sahel/wip/`. Vérifier `_ASSEMBLAGE-V3.md` avant toute purge Sénégal.
4. **Clarifier frontière mémoire** : `memory/` (workspace, 419 fichiers) vs `.claude/projects/.../memory/` (auto-memory, 257 fichiers) — décider si on rapatrie tout dans `memory/` ou si on maintient les deux.
5. **Items "À CONFIRMER"** : `PLAN-ASSEMBLAGE-FINAL` War-Map (validations ouvertes) + `PIXELLAB-MASTER-INDEX` (statuts à confirmer quand on attaque ces prods).

---

## Regles de mise a jour de ce fichier

Claude met a jour ce fichier en FIN DE SESSION quand :
- Un projet change de statut (termine, bloque, decision prise)
- Une nouvelle decision technique est arretee
- L'ordre des priorites change

Format : 3 lignes max par projet (Etat / Decision en attente / Recommandation).
