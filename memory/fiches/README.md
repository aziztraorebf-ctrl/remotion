# memory/fiches/ — les fiches de déclenchement

## À quoi ça sert
Une fiche = **les règles d'UN moment de production**, injectées automatiquement dans le
contexte de l'agent **au moment où il code ce moment-là**.

Pourquoi ça existe : `MEMORY.md` est lu en début de session puis **oublié** au fil des heures.
Les hooks existants savent seulement **bloquer**, jamais **informer**. Les fiches sont la couche
manquante entre les deux — elles arrivent au bon moment, sans bloquer.

Cause d'échec n°1 mesurée par audit (2026-08-17) : **« brique existante non trouvée »**
(6 cas documentés, ~20 itérations perdues). Les règles existaient ; elles n'étaient pas retrouvées.

## Les fiches actuelles
| Fiche | Se déclenche quand | Source du déclenchement |
|---|---|---|
| `FICHE-SVG-DESSINE.md` | on écrit du SVG dessiné dans un `.tsx` | ≥4 primitives OU un `d={`/`d="M`, avec ≥2 primitives (garde-fou anti-icône) |
| `FICHE-CAMERA.md` | on touche du code de caméra (D3, Mapbox ou SVG) | ≥2 motifs parmi `camAt`, `scaleMul`, `getCam`, `lerpCam`, `camFor`, `jumpTo`, `bearing`, `pitch:`, `interpolate(` |
| `FICHE-SHORT-VERTICAL.md` | on travaille sur une composition 9:16 | chemin contenant `short`/`9x16`/`vertical`, ou dimensions verticales |

Le hook : `.claude/hooks/fiche-inject.sh` (branché dans `settings.json`, matcher `Edit|Write`).
Il **n'interdit rien** et sort toujours en 0. Plusieurs fiches peuvent se cumuler (un Short à
globe déclenche les trois).

## ⛔ Anti-répétition : la condition de viabilité
Chaque fiche n'est injectée **qu'une fois par fichier et par session** (sentinelles dans
`$TMPDIR/fiche-inject-<session_id>/`). Sans ce mécanisme, le coût dépasse plusieurs dizaines de
milliers de tokens par jour. Avec : ~18 000 tokens un jour typique (7,5 fichiers SVG/jour mesurés),
~66 000 le pire jour observé (28 fichiers). **Ne jamais retirer ce mécanisme.**

## ⛔ COMMENT ÉVITER QUE CES FICHES PÉRIMENT
Le projet a déjà 4 cas documentés de fiche qui ment : un catalogue déclarant « inexistant » un
composant qui existait, un registre « canonique » vivant sur une branche jamais mergée (4×), un fix
écrit en mémoire mais jamais appliqué au code, deux compositions quasi identiques dont une seule
était la vraie. **Le point commun : la fiche décrivait le code, et le code a changé sans elle.**

Trois couches de défense :

**1. Vérification mécanique** — `python3 scripts/tools/check-fiches.py` vérifie que tous les chemins
cités existent encore. À lancer en fin de session (intégré à `/wrap`).

**2. Vérification à l'usage** — chaque fiche porte en tête : *« si ce que tu lis ne correspond pas au
code sous tes yeux, c'est la FICHE qui a tort, corrige-la immédiatement »*. Chaque utilisation
devient une occasion de détection.

**3. Enrichissement en fin de session** — un agent dédié repère ce qui a été appris aujourd'hui et
qui n'est dans aucune fiche (mouvement de caméra validé/rejeté, technique nouvelle, valeur qui a
marché). C'est le **chroniqueur** : il capture le JUGEMENT, pas seulement l'existence.

⚠️ Ne pas confondre avec l'**Extracteur** (`STUDIO-REUTILISABLE-GATE.md`, Mécanisme 2) : celui-là
parcourt le code pour remplir les catalogues de composants — un inventoriste. Il **n'existe pas
encore** sur disque (vérifié 2026-08-17). Les fiches ne dépendent pas de lui.

## Ajouter une fiche
1. Écrire `FICHE-<MOMENT>.md` ici (≤55 lignes — c'est un budget de contexte, pas une doctrine).
   Structure : briques existantes → interdits déjà payés (avec leur coût) → réflexes → « si ça rate 2× ».
2. Ajouter son déclencheur dans `.claude/hooks/fiche-inject.sh` (fonction `add_fiche`).
3. Tester : vrais positifs ET faux positifs, avant de brancher.

**Règle d'or** : une fiche ne contient que des règles **déjà payées** (une erreur réelle, un coût
documenté). Pas de règle théorique — c'est ce qui a fait gonfler `MEMORY.md` à son plafond.
