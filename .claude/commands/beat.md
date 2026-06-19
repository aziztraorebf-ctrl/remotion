# /beat — Porte d'entrée UNIQUE de production d'une scène

> Aiguilleur unique « je produis une scène ». Route vers la bonne session, qui enchaîne
> storyboard → code → self-review → review → upload. Le but : qu'une instance vierge (mobile,
> mode médium) produise correctement DU PREMIER COUP sans avoir à retrouver le bon chemin.
>
> ⛔ Ne jamais coder un Beat*.tsx « à la main » hors de ce flux. Les protos de mécanique
> jetables vont dans `src/projects/_rnd/` (pas de session requise) — tout le reste passe ici.

## ÉTAPE 0 — Déduire l'intention, PUIS router (jamais l'inverse)

Avant de router, déduire en 1 verbe ce que la scène doit faire RESSENTIR (doctrine
`CONTINUITE-SCENE-INTENTION-DABORD`). L'intention décide la forme ; la forme décide la session.

Question d'aiguillage unique :

| La scène est… | Session | Commande de départ |
|---|---|---|
| une **carte** (territoire, frontières, déplacement géo) → Mapbox | `mapbox-session.py` | `--phase storyboard` |
| une **data-viz / narratif Remotion** (chiffres, inserts, texte animé) → Remotion | `beat-session.py` | `--phase breakdown` |
| un **proto de mécanique jetable** (tester une animation) | aucune — code direct dans `src/projects/_rnd/<sujet>/` | — |

Si l'intention est claire dans la demande d'Aziz → router directement. Sinon, poser LA question
(carte ou data-viz ?) avant d'exécuter. Ne jamais supposer l'épisode/le beat : demander.

---

## BRANCHE A — Beat Remotion (data-viz / narratif)

```bash
python3 scripts/beat-session.py --episode <slug> --beat <N> --phase breakdown
```
1. Le script affiche les contraintes de sécurité + vérifie les prérequis (manifest, storyboard, audio, bg, Tailwind, no-black).
2. Il appelle Gemini → `/tmp/<episode>-beat<N>-breakdown.json`. **Coder à partir de ce JSON uniquement.**
3. Render → `--phase self-review --video <wip>/beat<N>_v1.mp4` (gate ≥ 19/23).
4. `--phase review --video <même mp4>` → écrit `<mp4>.review.json` À CÔTÉ du mp4 (Appel Gemini 2, seuil 8/10).
5. `--phase upload` → catbox + ntfy.

## BRANCHE B — Beat Mapbox (carte)

```bash
python3 scripts/mapbox-session.py --episode <slug> --acte <AN> --phase storyboard
```
1. Production Brief validé par Aziz AVANT le code (SFX plancher 0.50, pitch 32 si 1-4 pays).
2. Code : 1 seule Map continue, getCam + overlays, fichier unique. Drapeaux = `useClipFlags`.
3. `python3 scripts/tools/mapbox-selfreview.py <Beat*.tsx>` (0 erreur) puis `--phase self-review --checked N` (N ≥ 10/12).
4. `--phase review --file <Beat*.tsx> --video <mp4>` → écrit `<mp4>.review.json` À CÔTÉ du mp4 (Gemini CONSULTATIF).
5. `--phase upload`.

---

## LE GATE DE PRÉSENTATION (automatique — ne pas l'oublier, il est imposé)

Le hook `pre-presentation-review.sh` **BLOQUE tout upload / SendUserFile** d'un `.mp4` de livrable
(`out/...`) tant qu'un `<mp4>.review.json` adjacent, **plus récent que le mp4**, score ≥ 8/10 et
verdict ≠ REBUILD, n'existe pas. Les deux sessions ci-dessus écrivent ce fichier au bon endroit en
phase `review`. Donc : **toujours passer par `--phase review` avant de présenter.** Si le hook bloque,
c'est que la review manque ou est périmée (mp4 re-rendu) → relancer `--phase review`.

## RÈGLES ABSOLUES

- 2 appels Gemini MAX par beat. Gemini = SIGNAL, jamais juge. Jamais de boucle Gemini→fix→Gemini.
- Ne jamais appeler `beat-breakdown.py` / `visual_review.py` / `gemini-mapbox-review.py` à la main : passer par les sessions.
- Le jugement d'Aziz prime toujours sur le score.
