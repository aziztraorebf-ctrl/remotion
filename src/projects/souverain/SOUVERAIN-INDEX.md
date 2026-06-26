# SOUVERAIN — INDEX DES INDEX (carte maître)

> **Point d'entrée UNIQUE pour toute production Souverain.** Avant de composer/coder un beat Souverain,
> identifier ICI quel catalogue ouvrir selon le besoin. Aucun catalogue ne doit être oublié.
> Créé 2026-06-15 (symétrie avec `ATLAS-INDEX-DES-INDEX.md` et `warmap/WARMAP-INDEX.md`). Référencé depuis CLAUDE.md + ROUTAGE.md.
> Souverain = Shorts 90s + Mid-form éco/géopo Afrique. DEUX moteurs : Mapbox (carte animée) OU Remotion/Tailwind (data-viz/graphisme).

---

## 🧭 Quel catalogue pour quoi ?

| Besoin | Catalogue (source de vérité) | Contenu |
|---|---|---|
| **Décisions durables** (premium d'abord, Mapbox frame-driven, 1 Map continue, fond #16213a) — LIRE D'ABORD | `memory/doctrines/DOCTRINE-SOUVERAIN.md` ⭐ | 9 sections de règles validées Aziz |
| **Doctrine visuelle MAPBOX** (5 principes premium carte) | `memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md` | drift continu, séquentiel syllabe, anti-gris, projection bichromie, habillage narratif |
| **Doctrine visuelle REMOTION/data-viz** (8 principes premium) | `memory/doctrines/SOUVERAIN-REMOTION-PLAYBOOK.md` | chiffre-événement, discipline chromatique, séquençage 8s, contraste d'échelle, secondary motion |
| **Composant / brique réutilisable** — "quand Aziz dit..." | `src/projects/_shared/COMPOSANTS-INDEX.md` | 71 composants par cas d'usage (Chiffre, Comparaison, Timeline, Carte, Révélation, HERO DATA...) |
| **Template carte vivante** (hook/corps/insert Mapbox) | `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` | Source unique des templates carte. FlagFill = règle n°1 |
| **Template data-viz pour Gemini** (BarRace, StackedBars, PulseNumber) | `memory/tools/CATALOGUE-TEMPLATES-REMOTION.md` | 40+ templates animés, format prompt Gemini |
| **Animations presets** (fadeIn, popIn, countUp, drawPath) | `src/projects/_shared/animations.ts` | 10 presets, importer directement |
| **SplitScreen 50/50** (entité vs entité) | `src/projects/_shared/components/layouts/SplitScreenSouverain.tsx` | Composant générique Tailwind |
| **Tailwind** (tokens gold/navy/ivory) | `memory/feedbacks/feedback_tailwind-remotion-setup.md` + `tailwind.config.ts` | Tailwind 3.4. Framer Motion INTERDIT |
| **Asset visuel / ref Gemini** | `public/_shared/ASSETS-INDEX.md` | Inventaire templates + assets + refs + SFX |
| **SFX** | `public/_shared/sfx/SFX-INDEX.md` | Source unique SFX (partagée Atlas/War-Map) |

## 🚀 Procédures de DÉMARRAGE (lire AVANT de coder)

| Type de production | Procédure | Rôle |
|---|---|---|
| **Short Souverain MAPBOX (démarrage)** | `memory/doctrines/SOUVERAIN-SHORT-DEMARRAGE.md` ⭐ | 7 étapes : script→Camera Brief→template par acte→code. **Point d'entrée d'un Short.** Puis `SOUVERAIN-SHORT-SKELETON.md` (structure code). |
| **Beat Souverain MAPBOX** (carte, getCam, overlays) | SYSTÈME `scripts/mapbox-session.py` | Pipeline scoré 6 phases. Self-review `mapbox-selfreview.py`. Voir CLAUDE.md « Pipeline Beat Mapbox ». |
| **Beat Souverain REMOTION/Tailwind** (data-viz, graphisme) | SYSTÈME `/beat` (`scripts/beat-session.py`) | Pipeline scoré 19/23. Skelette `SOUVERAIN-REMOTION-SKELETON.md`. Voir CLAUDE.md « Pipeline Beat Souverain ». |
| **Pré-production complète** (script→jury→audio→planning) | skill `souverain-preproduction` | Tunnel pré-prod Short Souverain |
| **Écrire un script** (Short narratif ou Atlas) | `memory/templates/script-ebauche-v1.md` / `script-atlas-v1.md` | Trame narrative + `DOCTRINE-SCRIPT-UNIFIEE.md` (couche orale) |
| **DA-BRIEF-GATE** (review créative AMONT avant de coder) | `memory/doctrines/DA-BRIEF-GATE.md` + `scripts/tools/da-brief.py` | Gemini+Kimi → synthèse → Aziz tranche → code |

## 🎨 Doctrines éditoriales (le "pourquoi")

| Sujet | Fichier |
|---|---|
| Positionnement analyste + 4 règles fermes | `memory/doctrines/CHARTE-EDITORIALE-SOUVERAIN.md` |
| Angle macro (impact Afrique sur le monde) | `memory/doctrines/ANGLE-MACRO-SOUVERAIN.md` |
| Structure Mid-form (4 actes, respirations) | `memory/doctrines/MIDFORM-FORMAT-RULES.md` |
| Couche orale universelle (16 règles) | `memory/doctrines/DOCTRINE-SCRIPT-UNIFIEE.md` |
| Règles éditoriales (sources, couleurs, script Type B) | `memory/rules-souverain-editorial.md` |
| Distribution Instagram | `memory/doctrines/STRATEGIE-DISTRIBUTION-INSTAGRAM-2026.md` |

## 📦 Épisodes Souverain

`src/projects/souverain/` : `senegal-petrole-gaz/` · `maroc-batteries/` · `petrole-patience-short/` · `carousels/`.
État de chaque épisode : `memory/episodes/souverain/<ep>/STATUS.md`.

---

> Les 2 autres piliers : `src/projects/atlas/_shared/ATLAS-INDEX-DES-INDEX.md` · `src/projects/warmap/WARMAP-INDEX.md`.
> Carte maître de TOUS les catalogues (tous piliers) : `src/projects/_shared/INDEX-DES-INDEX.md`.
