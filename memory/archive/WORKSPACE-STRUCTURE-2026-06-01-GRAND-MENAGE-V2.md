# Structure workspace — Grand Ménage v2 (2026-06-01, ARCHIVE)

> Migré depuis auto-memory 2026-08-31. Snapshot de la structure workspace au 2026-06-01, après un
> grand ménage (-3 GB). ⚠️ La structure décrite ci-dessous a évolué depuis (ex: `out/` a maintenant
> `PORTFOLIO`, `SHOWCASES`, `_client-sim` en plus) — ne pas s'y fier comme état courant. Conservé
> pour les RÈGLES DURABLES (réutilisabilité > originalité, hygiène out/) qui restent d'actualité et
> recoupent `CLAUDE.md` § Hygiène out/.

**Règle centrale** : Le workspace est notre maison. Si c'est confus pour Aziz, c'est confus pour Claude. Réutilisabilité > originalité. Un composant validé = ajouté au catalogue partagé immédiatement.

## Ce qui a changé le 2026-06-01

**Supprimé** :
- `quebec-jacques-poc/` (3.1 GB) — vidé, contenu utile extrait dans `_reference-atlas-poc/` (158 MB, toujours présent au 2026-08-31)
- `memory/templates-research/` (21 MB, scouting 17 chaînes YouTube obsolète)
- 4 MP3 Sénégal dans `memory/` (31 MB, doublons de `public/`)
- Archives redondantes : `atlas-*-OLD/`, `feedbacks-originaux-2026-05/`, `pre-reorg-2026-04-02/`
- `lora-training/` — entièrement vide, supprimé

**Créé / réorganisé** :
- `memory/doctrines/` — fichiers éditoriaux déplacés depuis la racine
- `memory/tools/` enrichi
- `_reference-atlas-poc/` — extraits POC Québec (renders, styles Parchemin Mandé, TSX clés)

**Nouveaux systèmes (toujours actifs au 2026-08-31)** :
- `memory/NEXT-ACTION.md` — recommandations actives par projet
- `memory/episodes/*/STATUS.md` — fiche de reprise par épisode
- `src/projects/_shared/COMPOSANTS-INDEX.md` — composants classés par cas d'usage

## Structure au 2026-06-01 (PÉRIMÉE — donnée historique, ne pas suivre)

```
memory/
  NEXT-ACTION.md
  DOCTRINE-SOUVERAIN.md
  COMPACT_CURRENT.md
  rules-*.md
  feedback_*.md
  doctrines/
  tools/
  episodes/
  archive/
  brainstorms/

src/projects/
  _shared/
    COMPOSANTS-INDEX.md
    components/layouts/
    components/inserts/
    components/ui/
    components/overlays/
  atlas/
  souverain/
  _shared/thumbnails/

_reference-atlas-poc/
```

## Règles nettoyage (toujours d'actualité, cf CLAUDE.md § Hygiène out/)

- `out/` : temporaires purgés après validation. Structure : wip/ → versions/ → FINAL → PRET-PUBLICATION/
- Clips Seedance bruts → `public/seedance/` — JAMAIS supprimer (valeur LoRA)
- Composant validé → ajouté à `COMPOSANTS-INDEX.md` immédiatement

## How to apply en début de session (principe toujours valide)

1. Lire `memory/NEXT-ACTION.md` — "que fait-on ?"
2. Lire `memory/episodes/*/STATUS.md` si on reprend un épisode en pause
3. Avant de coder → lire `src/projects/_shared/COMPOSANTS-INDEX.md` pour trouver le bon composant
4. Composant Atlas → lire le catalogue Atlas dédié AVANT de coder
