# Thumbnails YouTube — Bibliothèque pérenne par univers

> Références visuelles pour futures productions Souverain / Atlas / Sonjata.
> Validés 2026-05-28.

## 4 standards de référence — 3 univers, 2 pipelines

### Univers Souverain (géopolitique économique contemporaine)

#### `senegal-petrole.png`
- Métaphore : baril métal photoréaliste, jauge 18% drapeau Sénégal en bas
- Pipeline : **A** (edit chirurgical, 2 passes — 1 pour matière, 1 pour repositionner texte)
- Référence éditoriale visée : Bloomberg / FT cover
- Coût : $0.08

#### `niger-uranium.png`
- Métaphore : ampoule Edison classique avec filament tungstène aux couleurs Niger
- Pipeline : **A** (edit chirurgical, 1 passe)
- Référence éditoriale visée : Bloomberg / FT cover
- Coût : $0.04

### Univers Atlas (cartographie historique)

#### `atlas-mansa-moussa.png`
- Métaphore : carte portolan ancienne + Mali en or massif + route caravane vers Caire
- Pipeline : **A** (edit chirurgical, 2 passes — 1 pour carte stylisée, 1 pour retirer le bandeau source)
- Référence éditoriale visée : National Geographic carte historique
- Coût : $0.08

### Univers Sonjata (illustration storybook africain)

#### `sonjata-mande.png`
- Métaphore : scène cartoon (héro Mandé + baobab + village mandingue)
- Pipeline : **B** (création guidée par références — 1 croquis + 3 frames V7 + 1 brief)
- Référence éditoriale visée : "same artist as Sonjata V7 reference frames"
- Coût : $0.04

---

## Quand consulter ces fichiers

- **Avant de coder un nouveau thumbnail** dans un de ces 3 univers → vérifier les standards visuels établis
- **Pour briefer Gemini** → utiliser ces images comme référence "to match this style"
- **Pour décisions design** (palette, layout, drapeau, métaphore, choix Pipeline A vs B)
- **Comme exemples concrets** des résultats finaux acquis avec le pipeline

## Méthodologie complète

- **Pipeline technique détaillé** : `memory/tools/gemini.md` (sections Pipeline A et Pipeline B)
- **Pipeline produit + règles design** : `out/SHOWCASES/templates-souverain/README.md` section "Thumbnails YouTube"
- **Code des wrappers et icons** : `src/projects/_shared/thumbnails/`
- **Scripts Python** : `scripts/tools/gemini-thumbnail-edit.py` (Pipeline A) et `scripts/tools/gemini-thumbnail-create-from-refs.py` (Pipeline B)

## Choix Pipeline A ou B selon le sujet

| Type de sujet | Pipeline recommandé | Pourquoi |
|---------------|---------------------|----------|
| Sujet à ratio mesurable, objet symbolique (baril, ampoule, coffre, balance) | A | Le SVG permet de fixer le ratio précisément, Gemini ajoute la matière |
| Sujet géographique stylisé (carte ancienne, territoire highlight) | A | SVG pose la géométrie reconnaissable, Gemini ajoute texture/détails époque |
| Sujet à esthétique cartoon storybook | **B** | Impossible à coder en SVG primitif, Gemini imite l'esthétique des frames de référence |
| Sujet à esthétique illustration spécifique (papercraft, peinture, encre) | **B** | Idem — utiliser les frames de la vidéo source comme référence |
| Sujet où l'on veut **cohérence parfaite avec la vidéo existante** | **B** | Le viewer reconnaît immédiatement l'univers visuel = signal subliminal de qualité |

## À ajouter ici au fil des productions

Au fur et à mesure des Shorts/Mid-form publiés, ajouter :
- Le PNG final
- Le sujet + univers
- La métaphore utilisée
- Le pipeline utilisé (A ou B) + coût
- Le brief Gemini exact

Ça devient progressivement la galerie de référence multi-univers du studio.
