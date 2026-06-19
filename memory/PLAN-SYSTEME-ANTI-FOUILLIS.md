# PLAN — Système anti-fouillis (porte unique + auto-vérif + structure dossiers)

> Livrable de la session d'architecture du 2026-06-19 (branche `feat/elagage-systeme`).
> Né du chantier `CHANTIER-AUTOMATISATION-ANTI-FOUILLIS.md`. **Phase 1 (élagage) = FAITE.**
> Ce fichier = la CONCEPTION du nouveau système, à coder dans une 2e passe APRÈS validation Aziz.
>
> Principe directeur : concevoir pour une **instance vierge, sur mobile, en mode médium**. Si elle ne
> peut pas faire bien DU PREMIER COUP sans réfléchir, le système a échoué. Garde-fou STRUCTUREL (hook),
> jamais dépendant de la mémoire de Claude ni du mode de réflexion.

---

## CE QUI A DÉJÀ ÉTÉ FAIT (Phase 1 — élagage, 2026-06-19)

- **Scripts** : 98 actifs → **56 actifs** + 47 archivés (`scripts/_archive/` + `scripts/tools/_archive/`) + 4 tests morts supprimés. `SCRIPTS-INDEX.md` régénéré. `check-links.py` = 0 lien mort.
- **Doctrine** : `REVIEW-PREMIUM-TEMPLATE.md` archivée (info Gemini-vidéo contredite). Fusions des 3 autres doctrines REPORTÉES (référencées par 5-10 fichiers chacune → mauvais ratio risque/gain ; ce ne sont pas des fichiers nuisibles, juste un peu redondants).
- **Contradiction template-first vs intention-first RÉSOLUE** : `CLAUDE.md`, `DOCTRINE-SOUVERAIN.md` §3.10, `ATLAS-BEAT-DEMARRAGE.md` harmonisés sur **INTENTION → FORME → TEMPLATE**, tous pointant vers `CONTINUITE-SCENE-INTENTION-DABORD.md`.
- **Hooks settings.json** : hook fantôme `beat-gemini-review.sh` (câblé sur chaque Bash, fichier archivé) → **RETIRÉ** (2026-06-19, avec le câblage du Chantier B).

---

## DIAGNOSTIC RÉEL (ce que l'audit a prouvé, pas supposé)

Le chantier supposait « 5 portes d'entrée, visual_review jamais lancé ». La réalité mesurée :

1. **Les sessions sont BONNES mais NON OBLIGATOIRES.** `beat-session.py` (gate 19/23) et `mapbox-session.py` (gate 10/12) ont DÉJÀ une phase self-review scorée. Le trou n'est pas l'absence d'auto-vérif — c'est que **rien ne force à passer par la session**. Claude peut coder un `Beat*.tsx` à la main et le présenter sans jamais lancer la phase review. → **Le hook ne doit pas réinventer la review ; il doit rendre la review existante INCONTOURNABLE.**

2. **`visual_review.py` EST la brique du hook.** Il extrait les frames (`downscale-for-review.sh`), route Gemini/Kimi/Qwen, compare au `--storyboard`, renvoie `score /10` + `verdict APPROVE|NEEDS_WORK|REBUILD`. Il manque juste un appelant automatique.

3. **Les hooks QA ont été archivés pour de VRAIES raisons** (à ne pas reproduire) :
   - `beat-gemini-review.sh` : heredoc Python dans bash cassé.
   - `auto-kimi-review.sh` : trop passif (juste un rappel).
   - `screenshot-qa.sh` : cherchait un sous-agent inexistant.
   - `storyboard-gate.sh` : `exit 2` au mauvais moment, bloquait le flow.
   → Leçon : le nouveau hook doit être **robuste (pas de heredoc fragile), tolérant (fixture si pas de clé), et bloquer au BON moment (présentation, pas édition)**.

4. **Le vrai chaos = la TOPOLOGIE des dossiers.** 42 `.tsx` dans `_proto-16-9/`, 12 dans `warmap/_rnd/`, 8 dossiers `_demos/`, 5 `_shared/_demos/`, + beats livrables éparpillés par épisode. Le « bon emplacement » d'une nouvelle scène n'est PAS évident → Claude code « à côté ».

---

## CHANTIER A — Porte d'entrée unique (rendre la session incontournable)

**Cible** : UN point d'entrée « je produis une scène » qui route automatiquement, au lieu de 5 chemins concurrents.

**Ce qui existe** : skills preprod (`souverain-preproduction`, `atlas-video-preproduction`, `video-narrative-preproduction`) + sessions (`beat-session`, `mapbox-session`). Ils marchent mais le routage dépend de la mémoire de Claude.

**Proposition** : un skill `/scene` (ou enrichir `/beat`) = aiguilleur unique. Pseudo-flux :

```
/scene
  → Q1 : carte (Mapbox) ou data-viz/narratif (Remotion) ?   [tranché par l'intention]
      Mapbox  → mapbox-session.py (storyboard → code → self-review → review → upload)
      Remotion→ beat-session.py   (scan → breakdown → code → self-review 19/23 → review → upload)
  → chaque phase écrit un marqueur d'état (/tmp/<scene>-phase.json)
  → la phase "présentation/upload" est GARDÉE par le hook du Chantier B
```

**Point clé** : la porte ne REMPLACE pas les sessions, elle les rend **non-contournables** en posant un marqueur que le hook B vérifie. Pas de nouveau gros script — un aiguilleur mince + un marqueur d'état.

**Décision à valider** : enrichir `/beat` existant (moins de nouveauté) OU créer `/scene` neuf (plus clair) ? Reco = enrichir `/beat` (moins de surface ajoutée, conforme à « élaguer avant d'ajouter »).

---

## CHANTIER B — Hook d'auto-vérification AVANT présentation (le cœur) — ✅ FAIT (2026-06-19)

> **CODÉ ET CÂBLÉ.** `.claude/hooks/pre-presentation-review.sh` (PreToolUse Bash + SendUserFile).
> Bloque tout upload/SendUserFile d'un .mp4 de livrable (`out/...`) tant qu'un `<mp4>.review.json` adjacent,
> plus récent que le mp4, score ≥ 8/10 et verdict ≠ REBUILD, n'existe pas. 16 cas testés en isolation.
> Échappatoires : protos `_rnd`/`_r-and-d`, hors `out/`, URL distantes, pas de clé API (passe + warning).
> Doc utilisateur : `scripts/tools/REVIEW-TOOLS-INDEX.md` (section « GATE AUTOMATIQUE »).
> Hook fantôme `beat-gemini-review.sh` (câblé sur chaque Bash, fichier archivé) retiré au passage.
>
> Conception ci-dessous conservée pour mémoire.

**Cible** : tant que le rendu n'a pas été comparé au breakdown et scoré ≥ seuil, Claude NE PRÉSENTE PAS.

**Quand déclencher** : `PreToolUse` sur les actions de PRÉSENTATION, pas sur l'édition. Détecter :
- `Bash` contenant `upload-catbox.sh`, `upload-to-blob.py`, `ntfy-notify.sh`, ou `SendUserFile` sur un `.mp4`.
- (Présenter une vidéo = surface réduite et claire à intercepter, contrairement à « avant chaque Edit ».)

**Logique du hook** (`pre-presentation-review.sh`) :
```
1. Le fichier présenté est-il un .mp4 de livrable (out/episodes/... ou wip/) ?  Non → exit 0.
2. Existe-t-il un review.json récent pour ce mp4 (même mtime > mp4) ?
   Non → exit 2 : "Lance d'abord : python3 scripts/visual_review.py <mp4> --model gemini --storyboard <png>"
3. Lire review.json : score ≥ 8/10 ET verdict != REBUILD ?
   Non → exit 2 : "Score X/10 < 8 — corrige avant de présenter. Fixes: [...]"
   Oui → exit 0 (présentation autorisée).
```

**Critères OBJECTIFS du score** (pas du goût — réutilise le breakdown JSON) :
- timing LOCAL correct (`Math.max(0, localF)`, pas d'absolu) — déjà checké par `atlas-beat-guard`.
- template/forme décidé bien utilisé (le breakdown nomme le composant attendu).
- dimensions conformes (width/height du breakdown vs render réel via ffprobe).
- R1 respecté (pas > 8s sans changement visuel) — `visual_review.py` le détecte déjà.

**Garde-fous anti-rechute (les 4 leçons des hooks archivés)** :
- ⚠️ PAS de heredoc Python dans bash → le hook appelle `visual_review.py` en sous-processus, ne ré-implémente rien.
- ⚠️ Fixture : si clé API absente → exit 0 + warning (ne pas bloquer la prod faute de clé), MAIS logguer "review skipped".
- ⚠️ Bloquer au bon moment : présentation, jamais édition.
- ⚠️ `maxOutputTokens` non limité (sinon Gemini tronque le JSON — déjà géré dans visual_review.py).

**Sortie** : 1 fichier `.claude/hooks/pre-presentation-review.sh` + 1 entrée `PreToolUse/Bash` dans settings.json.

---

## CHANTIER C — Structure de dossiers où le bon emplacement est ÉVIDENT

**Problème mesuré** : un proto, une démo, un livrable, un blueprint réutilisable = 4 intentions, mais ~6 dossiers concurrents sans règle claire (`_proto-16-9`, `_rnd`, `_demos`, `_shared/_demos`, `_blueprints`, beats par épisode).

**Règle proposée (3 zones, 1 question)** : « ce que je code, c'est… »
| Intention | Emplacement unique | Durée de vie |
|---|---|---|
| …un **livrable** d'un épisode précis | `src/projects/<pilier>/<episode>/` | permanent |
| …un **proto jetable** (tester une mécanique) | `src/projects/_rnd/<sujet>/` | 7j implicite, purge |
| …une **brique réutilisable** validée (sort du proto) | `src/projects/_shared/components/` (ou `/mapbox/`, `/templates/`) | permanent, indexée COMPOSANTS-INDEX |

**Migration** (à faire en 2e passe, prudente car Root.tsx importe tout) :
- Fusionner `_proto-16-9/` + `warmap/_rnd/` + `_rnd/` + les `_demos/` → un seul `_rnd/`. ⚠️ Chaque `.tsx` est importé dans `src/Root.tsx` (3221 lignes) → tout déplacement casse un import. **Ne PAS faire à la main** : script de migration qui déplace + réécrit les imports Root.tsx + `npm run build` de validation.
- Critère de promotion proto → `_shared` : « réutilisé ≥2 fois OU validé par Aziz ». Sinon ça reste dans `_rnd/` et se purge.

**Décision à valider** : la fusion des dossiers est le plus risqué (touche Root.tsx). On la fait maintenant ou on se contente de POSER LA RÈGLE pour les nouveaux fichiers et on migre l'existant plus tard ? Reco = poser la règle + migrer seulement `_proto-16-9` (le plus gros, 42 fichiers) via script, le reste au fil de l'eau.

---

## CHANTIER D — Remettre en question la branche git systématique

**Constat** : le chantier demande de trancher « branche pour gros chantiers, abandonner pour le quotidien ? ».

**Reco** : garder la branche pour (1) tout chantier multi-fichiers/multi-commits, (2) toute modif de doctrine/système. Pour une itération quotidienne sur UN beat en cours sur une branche d'épisode déjà ouverte → rester dessus (pas de sous-branche par micro-fix). C'est déjà l'usage de fait. → **Assouplir le wording de CLAUDE.md** : « branche par chantier, pas par fichier ». Pas de sur-process.

---

## TEST DE VALIDATION FINAL (critère de fin)

L'instance vierge : un Claude neuf + `CLAUDE.md` → tape « je veux produire la scène X » →
1. lit la règle INTENTION→FORME→TEMPLATE (harmonisée ✅),
2. est routé par `/beat` vers la bonne session,
3. code dans le dossier ÉVIDENT (règle 3 zones),
4. ne PEUT PAS présenter sans que le hook B ait vu un review.json ≥ 8/10.

Si ces 4 marches s'enchaînent sans que Claude « réfléchisse » à les retrouver → système réussi.

---

## ORDRE D'EXÉCUTION 2e PASSE (proposé)

1. **Chantier B d'abord** (le hook auto-vérif) — plus haut ROI, surface réduite, ne touche pas Root.tsx.
2. **Chantier A** (aiguilleur `/beat` + marqueur d'état) — branche le hook B.
3. **Chantier D** (assouplir wording branche) — 1 ligne.
4. **Chantier C en dernier** (migration dossiers) — le plus risqué, script + build de validation obligatoires.
