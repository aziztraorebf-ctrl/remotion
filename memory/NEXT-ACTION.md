# NEXT-ACTION — Recommandations actives
> Mis a jour : 2026-06-25 (élagage archive → `memory/archive/NEXT-ACTION-historique-2026-06-25.md`). A relire en debut de session, APRES PIPELINE.md.
> Ce fichier repond a : "Que fait-on maintenant ?" et "Quelle voie je recommande ?"

---

## 🆕 FRANC CFA — MID-FORM SVG (pré-prod faite, 2026-06-27)
> ✅ Sujet validé + angle (B) "le courage + le coût réel" + TRIPLE fact-check + script de référence (V6) + jury LLM.
> ⭐ Pivot acté : MID-FORM, pas short (sujet à MÉCANISME → veut de la construction visuelle séquentielle, cf règle
> sujet→format dans [[SUJET-PRIME-SUR-PRODUCTION]]). Tout se transpose. → `episodes/souverain/franc-cfa-short/STATUS.md`.
> **NEXT** : étendre script V6 → mid-form 4-6min + storyboard SVG-d'abord (scènes parité/Dakar/entrée déjà esquissées dans STATUS §7).
> ⚙️ MÉTA prouvé cette session : la CHAÎNE [[RECHERCHE-PRESCRIPT-UNIFIEE]] (valider→écrire→fact-check 3 niveaux→jury) fonctionne A→Z.

## ⭐⭐ PISTE STRATÉGIQUE FRAÎCHE (2026-06-22) — Shorts SVG ↔ Longs Mapbox (Hub & Spoke)
> 🗂️ Analyse Hub & Spoke gravée dans `memory/doctrines/SVG-SCENES-GENERATIVES.md` § Hub & Spoke + `ETAT-GGW-MURAILLE-VERTE.md` (acquis GGW). Aziz veut s'y lancer « pendant que c'est frais ».
> En bref : 2 formats séparés MÊME niche — longs analytiques (Mapbox/3D, autorité) + shorts SVG génératifs
> (paper-cut/blueprint, pédagogiques, multi-plateforme, gardent la chaîne vivante). PAS de la dilution = Hub & Spoke.
> ⚠️ AVANT d'industrialiser : (1) créer une SIGNATURE VISUELLE commune longs↔shorts · (2) tunnel = NOTORIÉTÉ
> cross-plateforme, pas conversion directe · (3) garder le gate [[SUJET-PRIME-SUR-PRODUCTION]] sur les shorts.
> CHANTIER NEUF = **assembler/monter PLUSIEURS scènes SVG en récit court** (storyboard de short + transitions/collage
> entre scènes — jamais testé, on a des scènes ISOLÉES). Prérequis prouvé = [[SVG-SCENES-GENERATIVES]].

## 🔧 BACKLOG TECHNIQUE — Système CARTO V5 (reprendre quand Sénégal V3 fini)

> ✅ Système prouvé. Doctrine gravée dans `memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md`. Point d'entrée : `REPRISE-SYSTEME-CARTO-V5.md`.
> ⛔ Carte canonique = **GéoAfrique V5 (navy/gris/or)**. Les fichiers d3-geo parchemin V2 = PÉRIMÉS.
>
> **▶ RESTE** : (1) coder la vraie scène Mapbox Sénégal branchée audio · (2) peaufinage scène gisements (popup E4, plaque E2, jauge 18%) · (3) merger dans master. Session dédiée, pas urgent avant Sénégal V3 scène 6.

## ✅ Workflow Data-viz — SYSTÈME GRAVÉ (plus une priorité active)

> **MERGÉ DANS MASTER le 2026-06-20.** Pipeline complet dans `memory/doctrines/WORKFLOW-DATAVIZ.md`.
> Ce qui reste = optionnel (gate format phase 0 = doublon inutile). **Prochain vrai pas = l'éprouver sur une scène de prod réelle** (ex : Sénégal V3 scène 6).
> Détails dans `REPRISE-WORKFLOW-DATAVIZ.md` si besoin de relire le système.

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
- ✅ **SCÈNES 0, 1, 2, 3, 4, 5 = FAITES, gravées FINALES.** Audio 0→344.46s ≈ 70% narration.
- ⬜ **SCÈNE 6 = NEXT** (bilan : de zéro à exportateur, Beat14, ~344.46s→). Remotion data-viz.
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
> ✅✅ **ACTE 1 FINAL + P1 + P2 + P3 FINAL.** 🟡 **P4 = en morceaux** (exode + ressources + confed + CFA, à assembler en p4-FINAL).
> ▶ **RESTE** : (1) assembler P4 morceaux → p4-FINAL ; (2) ASSEMBLAGE FINAL (concat Acte1+P1+P2+P3+P4 + musique D + mix/master).
> 🎵 Musique : Aziz a choisi **D-montee-maitrisee** (`public/_shared/audio/sahel-warmap/music/`).
> 📂 DOCS : `memory/episodes/warmap-sahel/STATUS.md` (état détaillé) · ⛔ OBSOLÈTES : `PLAN-REFONTE-P4.md`, `BRIEF-PASSATION-P4*.md`, `PLAN-REFONTE-ACTE1.md` (Acte 1 fini).
>
> ✅✅ **ACTE 1 FINALISÉ + VALIDÉ AZIZ (2026-06-27)** : compo `SahelActe1-Refonte` (f0-2125, 71s),
>   `out/episodes/warmap-sahel/acte1-FINAL.mp4` (catbox `91solc`). Hook = chiffre « 3 » → drapeaux plantés →
>   **sceau AES central + flash or** au climax (3 traits convergents illisibles RETIRÉS) ; corps = grammaire P3/P4
>   + **SFX câblés** (drone/ping carto/ink/impact) + **drapeaux s'effacent après les 1ers jetons** (contours gardés)
>   + mention « Données estimées » retirée. ⚠️ acte1-FINAL.mp4 a la mention (rendu avant retrait) — le code ne l'a plus,
>   l'assemblage la retirera. ⚠️ pic audio ~0 dB à 18s (gong) → mastering assemblage normalisera.
> 📎 **SVG-insert franc CFA** = seul candidat franc (cas test système agentique SVG, isolé) : `episodes/warmap-sahel/SVG-INSERTS-CANDIDATS.md`.

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

## 🧹 CHANTIERS DE NETTOYAGE — FAITS (2026-06-25)

1. ✅ **svg-scenes archivés** : 29 composants R&D écartés → `_archive/`, Root.tsx nettoyé (44 imports + ~35 Composition supprimés), build propre. Commit `0150ddf`.
2. ✅ **atlas-v2-components.tsx** : PAS à extraire — c'est la bibliothèque partagée de toute la V2 Atlas (12+ scènes l'importent). Aucune action.
3. ✅ **Purge `out/`** : ~1 GB libéré (5.8G → 4.8G). Purgés : hooks-lib, chantier3-test, carto-v5, scene-gisements-diagnostic, b2-compare, svg-scenes-refs, warmap-sahel/_r-and-d, gisements-v2, scene-gisements, carto-protos, test-orchestration-cobalt, sa1-frames + warmap-sahel/wip (219M). Conservés : decode-hera + wip Sénégal (scene4 en cours).
4. ✅ **Frontière 2-mémoires clarifiée** : NE PAS fusionner. `.claude/.../memory/` = navigation (MEMORY.md index + feedbacks courts) ; `memory/` workspace = contenu (doctrines, STATUS, outils). Règle gravée dans MEMORY.md header.
5. **Items "À CONFIRMER"** : `PLAN-ASSEMBLAGE-FINAL` War-Map (validations ouvertes) + `PIXELLAB-MASTER-INDEX` (statuts à confirmer quand on attaque ces prods).

## 🧹 NETTOYAGE CODE — FAITS (2026-06-25, session agentique 3 agents parallèles)

1. ✅ **Root.tsx protos A→D** : -34 imports, -57 compositions (Prototype_A→R, ProtoHera, ProtoCarto, HeraFidele, Matter, IntroProto, Lobito, Poc). Commit `d6b9348`. Build propre (6 erreurs pré-existantes inchangées).
2. ✅ **CLAUDE.md vides + dashboards** : 33 CLAUDE.md supprimés, 2 dashboards orphelins retirés. Commit `e27ca73`.
3. ✅ **Audit src/+public/ .md** (77 fichiers) : 3 périmés supprimés (senegal parchemin V2 + niger url). Commit `d0d782b`. Cobaye maroc GARDÉ (base peaufinage).
4. 🟡 **CLAUDE.md principal** : à dégraisser si besoin — surveiller taille en session. PAS urgent.
5. 🟡 **Purge out/ restante** : 4.8 GB. Re-scanner >7j en session dédiée si besoin d'espace.

---

## Regles de mise a jour de ce fichier

Claude met a jour ce fichier en FIN DE SESSION quand :
- Un projet change de statut (termine, bloque, decision prise)
- Une nouvelle decision technique est arretee
- L'ordre des priorites change

Format : 3 lignes max par projet (Etat / Decision en attente / Recommandation).
