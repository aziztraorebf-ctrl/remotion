# ATLAS — INDEX DES INDEX (carte maître)

> **Point d'entrée UNIQUE pour toute production Atlas.** Avant de composer/coder un beat Atlas,
> identifier ICI quel catalogue ouvrir selon le besoin. Aucun catalogue ne doit être oublié.
> Créé 2026-06-03 (miroir de `src/projects/_shared/INDEX-DES-INDEX.md` Souverain). Référencé depuis CLAUDE.md.
> Atlas = d3-geo PUR (SVG 720×1280 → 1080×1920), JAMAIS Mapbox. Différentiel = sprites PixelLab (acteurs).

---

## 🧭 Quel catalogue pour quoi ?

| Besoin | Catalogue (source de vérité) | Contenu |
|---|---|---|
| **Doctrine visuelle** (7 principes, grammaire mouvement, routage par besoin) — LIRE D'ABORD | `memory/doctrines/ATLAS-PLAYBOOK.md` | Dérivé de Ghana + Mansa Moussa. Drift permanent, tilt fausse-3D, overlays-triade, carte vivante, palette parchemin |
| **Personnage / sprite PixelLab** (l'acteur du récit) | `memory/doctrines/ATLAS-PIXELLAB-PLAYBOOK.md` | Convention dossiers, AtlasPixelChar (8fps découplé, ancrage-pied), recettes cortège/track, échelle N0-N2 |
| **Composant / brique réutilisable** (carte, overlay, label, caméra...) — "quand Aziz dit..." | `src/projects/atlas/_shared/COMPOSANTS-INDEX.md` | Composants par cas d'usage. Format narratif |
| **Doc technique d'un composant** (props exactes, imports, helpers caméra 2-couches) | `src/projects/atlas/_shared/ATLAS-COMPOSANTS.md` | Référence technique : svgToComp, focusOffsetForPOI, geoUtils, API composants |
| **Blueprint / pattern mis en scène** (marche, confrontation, alliance, empire, formation...) | `src/projects/atlas/_blueprints/README.md` | 13 blueprints validés (8 fondamentaux + 5 avancés extraits de prod Ghana) |
| **Asset visuel** (sprites PixelLab, map-objects, données géo, refs, icônes) | `src/projects/atlas/_shared/ATLAS-ASSETS-INDEX.md` | 568 sprites / 19 persos / 5 épisodes + 11 JSON géo + map-objects |
| **Asset PixelLab par ID** (réutiliser un perso existant avant d'en générer un) | `memory/tools/PIXELLAB-MASTER-INDEX.md` | ~50 characters + objects avec IDs PixelLab |
| **Mouvement caméra Atlas** (code, zéro-cost, Remotion) | `memory/tools/atlas-camera-movements.md` | 16 mouvements validés/à tester |
| **Tactique / bataille** (flèche, encerclement, tenaille) | `src/projects/atlas/_shared/AtlasAttackArrow.tsx` + `AtlasEncirclement.tsx` | Flèches géodésiques + pincerArrows. Enrichissement mapanimation, codé par nous |
| **Règles de production non-négociables** | `memory/rules/rules-atlas-production.md` | 13 règles (technique + visuel) |
| **SFX** | `public/_shared/sfx/SFX-INDEX.md` | Source unique SFX (partagée Souverain/Atlas) |

## 🚀 Procédures de DÉMARRAGE (lire AVANT de coder)

| Type de production | Procédure | Rôle |
|---|---|---|
| **Beat / scène Atlas (démarrage)** | `memory/doctrines/ATLAS-BEAT-DEMARRAGE.md` | Checklist scan phase 0 → storyboard → audio/alignement → code → self-review. **Point d'entrée d'un beat.** (À outiller en `atlas-beat-session.py`.) |
| **Pré-production complète** (script→jury→audio→planning) | skill `atlas-video-preproduction` | Tunnel pré-prod épisode Atlas |
| **Écrire un script Atlas** (géo, richesse-record, échelle) | `memory/templates/script-atlas-v1.md` | Trame narrative Atlas |

## 🎨 Doctrines & décodages (le "pourquoi")

| Sujet | Fichier |
|---|---|
| Doctrine visuelle (7 principes) | `memory/doctrines/ATLAS-PLAYBOOK.md` |
| Couche personnages PixelLab | `memory/doctrines/ATLAS-PIXELLAB-PLAYBOOK.md` |
| Retour aux sources (pourquoi Ghana+Mansa = la base) | `memory/feedbacks/feedback_atlas-retour-aux-sources-ghana-mansa.md` |
| Décodage Empire Ghana (source playbook) | `memory/atlas-decode/DECODE-empire-ghana.md` |
| Décodage Mansa Moussa (source playbook) | `memory/atlas-decode/DECODE-mansa-moussa.md` |
| Audit bibliothèque (inventaire complet) | `memory/atlas-decode/audit/AUDIT-atlas-bibliotheque-2026-06-03.md` |
| Faisabilité inspiration externe (mapanimation = banc R&D) | `memory/feedbacks/feedback_atlas-inspiration-externe-faisabilite.md` |

---

## ⚠️ Règle anti-doublon

Avant de créer un nouveau catalogue/index : **vérifier ICI** s'il existe déjà un fichier qui couvre
le domaine. Si oui → enrichir l'existant, ne pas créer un doublon. Si un nouveau catalogue naît →
l'ajouter à CE fichier immédiatement.

Avant de "merger" deux fichiers au nom proche : **md5 + diff + grep-usage D'ABORD**. Leçon 2026-06-03 :
`_shared/atlas-components.tsx` (v1, sert Peste+blueprints) et `_reference/mansa-moussa-v2/atlas-v2-components.tsx`
(v2, sert Mansa) sont 2 VERSIONS VIVANTES distinctes — les merger casserait un épisode.

## Hiérarchie (qui est source de vérité, qui renvoie)

- **Sources uniques** : les fichiers de la 1ère table (un par domaine).
- **ATLAS-PLAYBOOK** (doctrine "pourquoi") ≠ **COMPOSANTS-INDEX** (routage "quand Aziz dit") ≠
  **ATLAS-COMPOSANTS** (technique "props/imports") ≠ **ATLAS-ASSETS-INDEX** (assets "où sont les sprites").
  Les 4 se renvoient l'un à l'autre, ne se dupliquent pas.
- **_blueprints/README** = patterns mis en scène complets (caméra + sprites + transition). COMPOSANTS = briques.
- **2 versions de carte** : `_shared/atlas-components` (v1, épisodes hors Mansa) + `_reference/.../atlas-v2-components`
  (v2 Mansa Moussa) — distinctes par choix, pas un doublon.
