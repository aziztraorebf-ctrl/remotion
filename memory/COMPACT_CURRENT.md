# COMPACT_CURRENT — Etat d'avancement
> Mise a jour : 2026-06-15 — **War-Map Sahel : P4 REFAITE+VALIDÉE. Virage méthode = PASSE SÉQUENTIELLE scène par scène avant assemblage. Hook = SESSION DÉDIÉE (prioritaire).**

---

## 🗺️ War-Map Sahel AES — PROJET ACTIF (2026-06-15)

**Statut :** P4 "Coût/Levier/Perspective" REFAITE + VALIDÉE Aziz. Render `hdxsgi` (`wip/p4-FULL-v3-*.mp4`, 136s).
Branche `feat/p3-ambient-vie`. Format War-Map Long 16:9, ~7min26, voix GéoAfrique V2.

**⭐ CHANGEMENT DE MÉTHODE (Aziz) :** PASSE SÉQUENTIELLE — valider CHAQUE scène à 100% AVANT d'assembler
(sinon re-découpage pénible après). Ordre : Acte1 (hook+corps) → P1 → P2 → P3 (P4 ✅). Assemblage EN DERNIER.

**P4 — 11 corrections (commits 6a60ad9 + 922753e) :** intro anneaux/villes (fini les 12s vides) · triple-screen
prolongé + chaque volet animé (halos pulsés/fill respire/atome tourne) + **bug opacité Mapbox corrigé** (masquage
carte recalé 10647→11433, fini "carte à travers") · caméra finale FIGÉE (anti-jitter sub-pixel) + zoom serré (plus
de dézoom continental) · portraits dirigeants réduits 0.105→0.065 · flash retiré · plan final : noir plus tôt +
1 ligne typewriter monospace « Durer — reste à le démontrer. » + 2s. `Partie4Cout.tsx`.

**🔴 PROCHAIN = ACTE 1** (refaire grammaire P3/P4) : gros blocs sahel-fill → contours qui flashent · supprimer
légende factions + timeline · recaler triggers sur narration-v5-alignment.json (calés v1 → visuel désynchro voix v5).
Plan : `memory/episodes/warmap-sahel/PLAN-REFONTE-ACTE1-HOOK.md`.

**🔴 SESSION DÉDIÉE HOOKS (prioritaire) :** `memory/SESSION-DEDIEE-HOOKS.md`. Bibliothèque hooks réutilisables
toutes vidéos. Socle = `KineticMaskSlam` + `ComboMaskSweep`. ⛔ Prototype hook Sahel "gabarit Bellona" SUPPRIMÉ
(commit 17fc2c7) — ne pas transposer une grammaire externe sur notre carte 2D (key-learnings 06-15).

**🎵 Musique :** 6 options Minimax (`public/_shared/audio/sahel-warmap/music/`), Aziz a choisi **D (Montée maîtrisée)**.

**🧹 Infra :** `public/` allégé 2.3→2.0 GB (seedance + geoafrique → `_public-archive/`, 0 compo active impactée).

---

## 🇲🇦 Maroc Batteries Short — En cours (2026-06-02)

**Statut :** Beat 0 Hook FINAL ✅ + Beat 1 Phosphate FINAL ✅
- `out/episodes/maroc-batteries/beat0-FINAL.mp4` (https://files.catbox.moe/jx3e4s.mp4)
- `out/episodes/maroc-batteries/beat1-FINAL.mp4` (https://files.catbox.moe/n9jxx7.mp4)

**Architecture (CHANGEMENT vs 2026-05-31) :** beats SÉPARÉS, 1 composition Root.tsx par beat (`Beat0Hook.tsx`, `Beat1Phosphate.tsx`). L'ancien `MarocBatteriesShort.tsx` = stub. Ancienne version archivée `src/_archive/MarocBatteriesShort_OLD_2026-06-02.tsx`.

**Prochaine session :** ⚠️ **SESSION FILL-PATTERN d'abord** (bibliothèque drapeaux/textures réutilisables) PUIS Beat 2 Cailloux (f932→f1300, pur Remotion, split phosphate brut/cathode + balance + stat "5,6 Md$"). Assets Gemini Beat 2 non générés — valider prompts avec Aziz avant.

**Assets prêts :**
- Audio : `public/souverain/maroc-batteries/audio/narration-maroc-v3.mp3` (109.48s)
- Forced alignment Whisper OpenAI fait → `maroc-words.ts` + `timing.ts` (SEGMENTS beat0-beat5)
- Drapeaux locaux : `public/_shared/flags/` (es.png, fr.png, de.png — générés Python Pillow)

**Techniques validées cette session :**
- `SweepRevealTerritory` (Beat 0) avec prop `showHatching` ajoutée (hachures ivory)
- FlagFill : `pushCanvas` drapeau canvas pur (Maroc) + PNG locaux `staticFile()` (ESP/FRA/DEU)
- Dots CSS React via `map.project()` (les circle Mapbox se cachent sous fill-pattern)
- Layers dots ajoutés EN DERNIER dans style.load (ordre z-index Mapbox)
- Slam SVG mask "70%" : `translate/scale/translate` (pas transformOrigin, headless)
- Karaoké : MAROC_WORDS filtré (tous les mots), JAMAIS WORD_ANCHORS seuls
- SFX volumes : cinématique 0.50-0.55, UI 0.40-0.45, musique 0.12

**Découverte majeure :** voir `memory/feedbacks/feedback_flagfill-templates-decouverte.md` — la carte Mapbox DOIT être colorée dès le départ (fill-pattern/fill-color). Règle N°1.

---

---

## 📐 Stack Carousels Instagram (décision d'architecture — 2026-05-31)

**Carousels Instagram = Gemini Flash Image uniquement. Remotion/Tailwind abandonné pour ce cas.**

- Modèle : `gemini-3.1-flash-image-preview` — ~$0.04/slide, ~$0.32/carousel
- Remotion génère de bons layouts HTML mais Gemini produit des compositions visuelles premium supérieures pour les images statiques Instagram
- Remotion reste supérieur pour la vidéo animée — pas de changement sur ce point
- Règles complètes : `memory/tools/gemini.md` section "Pipeline Carousel Instagram"

---

## 🎨 Carousels Instagram — En cours (2026-05-31)

**Pipeline validé :** Gemini Flash Image, 8 slides par carousel, ~$0.32/carousel. Règles complètes dans `memory/tools/gemini.md`.

**Statut :** Or Africain ✅ | Thiaroye ✅ | Mansa Moussa ✅ | Niger ❌ | Restants : Empire Ghana, Soundjata, Silicon Savannah, Vraie Taille Afrique, Sénégal.

**Prochaine action :** Vraie Taille Afrique EN PREMIER (sort le 4 juin — urgent), puis Empire Ghana, Soundjata, Silicon Savannah, Sénégal.

**Nouveaux fichiers créés cette session :**
- `scripts/schedule-postiz.py` — script scheduling Postiz (9 vidéos planifiées)
- `scripts/generate-carousels.py` — générateur PNG Remotion (abandonné, remplacé par Gemini)
- `src/projects/_shared/components/layouts/CarouselSouverain.tsx` — template Remotion carousel (abandonné)
- `src/projects/souverain/carousels/carousel-data.ts` — données 9 carousels
- `memory/archive/starters-perimes-2026-06-15/STARTER-PROMPT-carousels-suite.md` — starter prompt prochaine session

---

## 🏆 MILESTONE — Lancement Kora & Cartes (2026-05-29)

**Chaîne officiellement lancée.** 9 vidéos planifiées via Postiz API.

### Calendrier de publication (lun/mer/ven, 15h00 UTC)

| Date | Titre | Durée |
|------|-------|-------|
| Lun 2 juin | Le Ghana a signé l'accord que 6 pays refusaient | 1m39s |
| Mer 4 juin | Les USA, la Chine et l'Europe tiennent dans l'Afrique | 1m12s |
| Ven 6 juin | Ils ont libéré la France. Elle les a massacrés. | 1m38s |
| Lun 9 juin | Le Niger recevait 9 centimes sur l'euro depuis 53 ans | 1m41s |
| Mer 11 juin | Il a fait s'effondrer l'or mondial. Par accident. | 2m01s |
| Ven 13 juin | Au Sahara, le sel valait autant que l'or | 1m44s |
| Lun 16 juin | Il était paralysé. Il a fondé le plus grand empire d'Afrique de l'Ouest | 2m46s |
| Mer 18 juin | Le pays qui a inventé le paiement mobile avant Apple | 2m02s |
| Sam 20 juin | Comment le Sénégal évite le piège du Niger | 7m39s |

### Stack de publication
- **Outil** : Postiz (API) — script `scripts/schedule-postiz.py`
- **Plateformes** : YouTube + Instagram + TikTok + Facebook simultanément
- **Titres** : règle hybride 2 couches (Test Tokyo + format empirique 50 car. max)
- **Captions** : adaptées par plateforme (YouTube long-form, TikTok court, IG avec emojis)
- **Handle uniforme** : @koraetcartes sur les 4 plateformes

### Décisions stratégiques validées ce jour
- **Short-first confirmé** : Paperlore (8770 abonnés en 2 mois) valide le modèle
- **Cadence** : 3 vidéos/semaine (lun/mer/ven) pour les 3 premières semaines
- **Stratégie long terme** : mid-form → short autonome condense, pas teaser
- **Facebook** : cross-post automatique via Postiz, canal secondaire
- **Concurrents analysés** : Rook (AI slop, modèle fragile), Paperlore (Seedance 2.0, paper cut)

---

## 📚 Historique des sessions antérieures (mai 2026 et avant)

> Tronqué le 2026-06-15 (ménage mémoire). L'historique détaillé des sessions de mai
> (Sénégal Actes, Silicon Savannah, Zimbabwe, Peste, exploration infrastructure…) vit désormais
> dans les fiches de reprise par épisode : **`memory/episodes/<projet>/STATUS.md`** et les doctrines.
> Récupération de l'ancien contenu complet : `git log --all -- memory/COMPACT_CURRENT.md`
> ou l'archive `memory/_auto-memory-backup-2026-06-15.tar.gz`.
>
> État réel à jour = ce fichier (en-tête) + `memory/NEXT-ACTION.md` + les `STATUS.md`.
