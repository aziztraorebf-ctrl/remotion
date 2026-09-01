# Un champ « décoratif » peut être une CLÉ — et sa duplication fige tout, en silence

> Établi le **2026-08-26** (chaîne SVG→Lottie, portage de `stroke-dasharray`).
> Cause racine prouvée par un agent de diagnostic dédié, puis **reproduite** en session.
> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

## Le fait

Dans le tableau `d` d'un trait Lottie (les pointillés), le champ `nm` **ressemble** à un simple
libellé lisible par un humain. Il n'en est pas un : **lottie-web en fait une clé d'objet**.

```js
// node_modules/lottie-web/build/player/lottie.js  (v5.13, l.15497)
Object.defineProperty(dashOb, shape.d[i].nm, { get: ... });
```

`Object.defineProperty` crée une propriété **non-configurable** : la deuxième définition de la
même clé **jette**. J'écrivais `"nm": "dash"` sur les deux entrées (tiret ET espace) → collision.

## Pourquoi ça a coûté cher : le blocage est TOTALEMENT SILENCIEUX

L'exception est levée dans `initExpressions`, appelée **en asynchrone** depuis la boucle de
construction des calques. Résultat :

- `DOMLoaded` **n'est jamais émis** — le player reste figé ;
- **aucune erreur console**, **aucun `pageerror`**, aucun `window.onerror` ;
- le JSON est parfaitement valide et se relit sans broncher ;
- côté outillage, le seul symptôme est un `TimeoutError` de Playwright.

⚠️ **Un `nm` absent ne sauve pas** : la clé devient `"undefined"`, dupliquée pareil.
Le rendu, lui, ne lit que `n` (`d`/`g`/`o`) et `v`. → `nm` doit être **présent et unique**
(convention Bodymovin : `dash 1` / `gap 1` / `dash 2`…).

## La leçon transposable (bien au-delà de Lottie)

**Dans un format de données, ne jamais présumer qu'un champ est décoratif parce qu'il en a
l'air.** Un libellé, un `id`, un `name` peut être consommé comme identifiant par le lecteur.
La duplication produit alors le pire des échecs : **valide, silencieux, et bloquant**.

⭐ **Le réflexe qui a payé** : bissection sur un JSON minimal + instrumentation de
`Object.defineProperty` — **pas** la lecture du code seule. Lire le player n'aurait pas suffi à
trancher ; c'est l'isolement expérimental qui a désigné le champ.

⭐⭐ **Et le corollaire de méthode** : ce blocage est arrivé APRÈS deux tentatives infructueuses
de ma part. Déléguer à un agent dédié (protocole CLAUDE.md, dès le 2e échec) a donné la cause en
une passe. Je l'ai ensuite **vérifiée sur mon propre cas** avant de l'appliquer — et c'était
nécessaire : j'avais un 2e blocage (regroupement de calques) qui **semblait** contredire le
diagnostic. Il ne le contredisait pas : les groupes fautifs étaient exactement ceux qui
portaient des dashes. Un `nm` dupliqué sur un **groupe** est inoffensif ; seul le tableau `d`
passe par `defineProperty`.

## Ce qui l'a rendu détectable

`stroke-dasharray` était jusque-là **ignoré en silence** par notre convertisseur — découvert
**à l'oeil** sur une frame du Gazoduc Acte 4, jamais par le rapport. Enjeu réel : un tracé
« projet prévu » ressortait **plein**, donc « construit » — le sens de la carte changeait.

→ Voir [[feedback_comparatif-storyboard-mesurer-pas-demander]] et la règle CODE + VISUEL.
Détail technique et table de décision : `memory/client-sim-tests/lottie-ui-lcd/CE-QUI-PASSE-EN-LOTTIE.md`.
Garde-fou en test : `test_texte.py::test_pointilles_nm_uniques`.
