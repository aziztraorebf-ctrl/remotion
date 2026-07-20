# INDEX DES INDEX — La carte de tous nos catalogues

> **Point d'entrée unique.** Avant de composer/coder un beat, identifier ICI quel catalogue ouvrir selon le besoin. Aucun catalogue ne doit être oublié.
> Créé 2026-06-02. Référencé depuis CLAUDE.md (routage). Tenir à jour quand un nouveau catalogue naît.

---

## ⭐ ÉTAPE 0 — PORTE D'ENTRÉE PAR INTENTION (avant tout catalogue)
> Doctrine [[CONTINUITE-SCENE-INTENTION-DABORD]] : déduis l'INTENTION (1 verbe) AVANT d'ouvrir un catalogue.
> **`src/projects/_shared/INTENTION-FORME-INDEX.md`** = table intention→forme→réponse (inclut templates Hera ⭐
> motion-design validé + 4 registres de fond + catégorie TEXTE). Les catalogues ci-dessous = fiches techniques consultées APRÈS.

## 🧭 Quel catalogue pour quoi ? (fiches techniques détaillées)

| Besoin | Catalogue (source de vérité) | Contenu |
|---|---|---|
| **Composant Remotion général** (stat, comparaison, timeline, hook, portrait, preuve, réseau...) | `src/projects/_shared/COMPOSANTS-INDEX.md` | 71 composants par cas d'usage ("quand Aziz dit...") |
| **Template carte Mapbox** (hook carto, insert, couleur/drapeau sur territoire, combo, fill-pattern, plaque+source) | `src/projects/_shared/mapbox/CATALOGUE-CARTE-VIVANTE.md` | 28 templates carte vivante + helpers. Drapeau dans un pays = `useClipFlags` ⭐⭐ (vraies images, jamais drawFlagCanvas). Plaque nom+stat+source = `GeoCountryPlaque`. Galerie : `dashboard/templates-carte-vivante.html` |
| **Template data-viz pour Gemini** (BarRace, StackedBars, PulseNumber, OdometerFlip...) | `memory/tools/CATALOGUE-TEMPLATES-REMOTION.md` | 40+ templates animés, format prompt Gemini |
| **TOUT Souverain** (Shorts 90s + Mid-form éco/géopo, Mapbox OU Remotion/data-viz) — POINT D'ENTRÉE | `src/projects/souverain/SOUVERAIN-INDEX.md` ⭐ | Carte maître Souverain : doctrine (DOCTRINE-SOUVERAIN), playbooks visuels (Mapbox + Remotion), démarrage Short, composants, éditorial |
| **TOUT Atlas** (d3-geo, cartographie, sprites PixelLab, empires, batailles) — POINT D'ENTRÉE | `src/projects/atlas/_shared/ATLAS-INDEX-DES-INDEX.md` ⭐ | Carte maître Atlas : doctrine (ATLAS-PLAYBOOK), composants (COMPOSANTS-INDEX), assets (ATLAS-ASSETS-INDEX 568 sprites), 13 blueprints, démarrage beat |
| **TOUT War-Map** (carte temporelle vivante, front jour-par-jour, contrôle territorial) — POINT D'ENTRÉE | `src/projects/warmap/WARMAP-INDEX.md` ⭐ | Carte maître War-Map : doctrines (GRAMMAIRE, PLAYBOOK, LONG, RESEARCH, ANIMER-OBJETS), moteur, briques, LA réf `SudanWarMapEpic60` |
| **Asset PixelLab** (personnage, objet pixel art) | `memory/tools/PIXELLAB-MASTER-INDEX.md` | ~50 characters + objects avec IDs |
| **Mouvement caméra — clip AI** (Seedance/Kling/Veo, prompt) | `memory/tools/camera-movements.md` | 30 mouvements + filtres validés |
| **Mouvement caméra — Atlas/Remotion** (code, zéro-cost) | `memory/tools/atlas-camera-movements.md` | 16 mouvements validés/à tester |
| **Asset visuel / mockup design Gemini** | `public/_shared/ASSETS-INDEX.md` | Blueprints design + templates compositions + refs |
| **SFX** (effet sonore) | `public/_shared/sfx/SFX-INDEX.md` | ~15 SFX par catégorie + backlog |
| **Élément SVG réutilisable** (arbre, soleil, sol, technique clipPath/buvard/spring/sway...) — POINT D'ENTRÉE | `src/projects/_shared/svg-library/SVG-LIBRARY-INDEX.md` ⭐ | Bibliothèque SVG GGW : 5 éléments (arbre sahel, soleil, sol, souche, graines) + 6 techniques d'animation + table intention→forme |

## 🚀 Procédures de DÉMARRAGE (lire AVANT de coder)

| Type de production | Procédure | Rôle |
|---|---|---|
| **Short Souverain Mapbox** | `memory/doctrines/SOUVERAIN-SHORT-DEMARRAGE.md` | 7 étapes : script→Camera Brief (mvts caméra par acte)→choix template par acte→code→review. **Point d'entrée d'un Short.** |
| Short Souverain — structure code | `memory/doctrines/SOUVERAIN-SHORT-SKELETON.md` | Architecture : 1 fichier TSX, 6 actes, getCam(frame), 1 Map continue |
| Beat Souverain (beat par beat) | `memory/rules/rules-beat-production.md` + `/beat` | 11 règles non-négociables (R0-R11) |
| Beat Atlas | `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md` | Lire AVANT 1ère ligne de code Atlas |
| Pré-production complète | skill `souverain-preproduction` / `atlas-video-preproduction` | Script→jury→audio→planning visuel |

## 🤖 Briefs à coller dans un prompt Gemini

| Usage | Fichier |
|---|---|
| Breakdown beat (découpage script→storyboard) | `memory/tools/workflow-gemini-breakdown-schema.md` (inclut l'arsenal carte + consigne combo) |
| Arsenal templates carte (détaillé) | `memory/tools/BRIEF-GEMINI-TEMPLATES-CARTE.md` |
| Templates data-viz Souverain | `memory/tools/CATALOGUE-TEMPLATES-REMOTION.md` |

## 🎨 Doctrines (le "pourquoi" / les règles esthétiques)

| Sujet | Fichier |
|---|---|
| Doctrine visuelle cartographique premium | `memory/doctrines/SOUVERAIN-VISUAL-PLAYBOOK.md` |
| Décisions durables Souverain | `memory/doctrines/DOCTRINE-SOUVERAIN.md` |
| Charte éditoriale | `memory/doctrines/CHARTE-EDITORIALE-SOUVERAIN.md` |

---

## ⚠️ Règle anti-doublon

Avant de créer un nouveau catalogue/index : **vérifier ICI** s'il existe déjà un fichier qui couvre le domaine. Si oui → enrichir l'existant, ne pas créer un doublon. Si un nouveau catalogue est créé → l'ajouter à CE fichier immédiatement.

## Hiérarchie (qui est source de vérité, qui renvoie)

- **Sources uniques** : les fichiers de la 1ère table (un par domaine).
- **MAPBOX-COMPOSANTS.md** = doc technique Mapbox (render, CAM_PRESETS, styles) → renvoie à CATALOGUE-CARTE-VIVANTE pour la liste des templates.
- **BRIEF-GEMINI-TEMPLATES-CARTE.md** = dérivé prêt-à-coller du CATALOGUE-CARTE-VIVANTE.
- Mouvements caméra : 2 fichiers volontaires (AI video vs Remotion) — contextes distincts, pas un doublon.
