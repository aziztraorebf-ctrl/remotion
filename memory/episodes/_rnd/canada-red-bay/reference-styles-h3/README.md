# Styles Higgsfield — références + clips validés MiniMax H3

> Index de référence pour comparer nos tests MiniMax H3 aux vidéos-exemples Higgsfield Explainer (envoyées par Aziz le 2026-08-13). Contexte complet du test : `memory/tools/minimax-h3-styles-tests.md` (sommaire général : `memory/tools/minimax.md`).

## ⚠️ Correction d'étiquetage (2026-08-13, à lire avant d'utiliser ce dossier)

Les 3 vidéos envoyées par Aziz (tmpfiles.org) ont été **mal identifiées au premier passage** de la session — corrigé après vérification frame par frame. Mapping correct :

| Fichier original | Style réel (vérifié à l'image) |
|---|---|
| `ref1-handdraw.mov` | **Whiteboard Doodle** (personnages doodle colorés sur tableau blanc, "why do we yawn") |
| `ref2.mov` | **Poster Vector** (mythe grec Hadès, flat design, split-screen) |
| `ref3.mov` | **Hand Drawn — 2e variante grayscale** (bureau, crayon noir/blanc, jamais testée par nous) |

**Le style "Hand Drawn" qu'on a testé et validé** (dossier `hand-drawn/`) n'est PAS basé sur une de ces 3 vidéos — il vient du style générique "Hand Drawn" vu dans la galerie de presets sur la page web `higgsfield.ai/explainer` (premières captures de la session, avant l'envoi des 3 vidéos). Le dossier `hand-drawn/` peut donc contenir un fichier résiduel mal nommé `00-reference-originale-higgsfield.mov` qui pointe en fait vers Whiteboard Doodle (erreur non nettoyée, `rm` refusé par l'environnement) — **ignorer ce fichier s'il est encore présent, il est périmé**. La vraie référence de style pour Hand Drawn est visuelle/textuelle uniquement (voir description ci-dessous), pas une vidéo Higgsfield captée.

Le vrai 2e style Hand Drawn (`ref3.mov`, grayscale crayon) vit dans `hand-drawn-grayscale-untested/` — **jamais testé par nous**, à traiter comme un style à part entière si repris un jour (différent du Hand Drawn sépia/encre couleur déjà validé).

## État par style

| Style | Référence Higgsfield | Notre test | Verdict |
|---|---|---|---|
| **Hand Drawn** (sépia/encre couleur) | Pas de vidéo captée — style de la galerie de presets | ✅ `hand-drawn/01-notre-clip-final-1080p-VALIDE.mp4` | **VALIDÉ** — marche + réaction, 2 plans, pipeline complet Gemini→H3→ByteDance |
| **Poster Vector** | `poster-vector/00-reference-originale-higgsfield.mov` | ✅ `poster-vector/01-notre-clip-final-1080p-VALIDE.mp4` | **VALIDÉ** — split-screen 3 panneaux, reveal + vie continue |
| **Whiteboard Doodle** | `whiteboard-doodle/00-reference-originale-higgsfield.mov` | ❌ Pas encore testé | À faire en session future |
| **Hand Drawn grayscale (2e variante)** | `hand-drawn-grayscale-untested/00-reference-originale-higgsfield-MAL-ETIQUETE-AVANT.mov` | ❌ Jamais testé, découvert par erreur d'étiquetage | Optionnel, style différent du Hand Drawn déjà validé |

## Contenu de chaque dossier

- `00-reference-originale-higgsfield.mov` — vidéo Higgsfield originale envoyée par Aziz (si applicable)
- `01-notre-clip-final-1080p-VALIDE.mp4` — notre clip final, après workflow complet (480p direction → 720p/upscale 1080p)
- `contact-sheet-*.jpg` — planches-contact (frames extraites à intervalles réguliers) pour consultation rapide sans lire toute la vidéo
- `frames-reference/`, `frames-notre-clip/` — frames individuelles source des planches-contact

## Pour une future session — comment utiliser ce dossier

1. Lire ce README en premier.
2. Regarder les `contact-sheet-*.jpg` pour un aperçu rapide (pas besoin de lire les vidéos entières).
3. Si comparaison fine nécessaire, lire les `.mp4`/`.mov` directement.
4. Le détail méthodologique complet (prompts, leçons, défauts rencontrés) est dans `memory/tools/minimax-h3-styles-tests.md` — ce dossier ne contient QUE les fichiers média, pas la méthode.
