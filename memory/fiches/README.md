# memory/fiches/ — les fiches de déclenchement

## À quoi ça sert
Une fiche = **les règles d'UN moment de production**, injectées automatiquement dans le
contexte de l'agent **au moment où il code ce moment-là**.

Pourquoi ça existe : `MEMORY.md` est lu en début de session puis **oublié** au fil des heures.
Les hooks existants savent seulement **bloquer**, jamais **informer**. Les fiches sont la couche
manquante entre les deux — elles arrivent au bon moment, sans bloquer.

Cause d'échec n°1 mesurée par audit (2026-08-17) : **« brique existante non trouvée »**
(6 cas documentés, ~20 itérations perdues). Les règles existaient ; elles n'étaient pas retrouvées.

## Les fiches actuelles (7)
| Fiche | Se déclenche quand | Source du déclenchement |
|---|---|---|
| `FICHE-SVG-DESSINE.md` | on écrit du SVG dessiné dans un `.tsx` | ≥4 primitives OU un `d={`/`d="M`, avec ≥2 primitives (garde-fou anti-icône) |
| `FICHE-CAMERA.md` | on touche du code de caméra (D3, Mapbox ou SVG) | ≥2 motifs parmi `camAt`, `scaleMul`, `getCam`, `lerpCam`, `camFor`, `jumpTo`, `bearing`, `pitch:`, `interpolate(` |
| `FICHE-SHORT-VERTICAL.md` | on travaille sur une composition 9:16 | chemin contenant `short`/`9x16`/`vertical`, ou dimensions verticales |
| `FICHE-STORYBOARD.md` | on écrit un brief/breakdown, on lance un storyboard, **ou on reprend un STORYBOARD/PLAN hérité** | fichier `PROMPT-*`, `breakdown*` (**casse indifférente**, `-i` ajouté 2026-08-18) ou **`STORYBOARD-*`/`PLAN-*.md\|.txt`**, OU commande `storyboard-dual-gen`/`openrouter-img2img`/`openrouter-vision-breakdown`/`da-brief.py`/`da-compare.py` |
| `FICHE-PACKAGING.md` | on prépare le **titre / la miniature / la description** | commande `jury-titres`/`jury-thumbnail`/`gemini-thumbnail-(create\|edit)`/`gemini-cover-vertical`, OU fichier `thumbnails-library/*.{svg,tsx}` |
| `FICHE-ASSEMBLAGE.md` | on rend ou on concatène | commande `ffmpeg`/`render-mapbox.sh`/`remotion render`/`-FINAL.mp4`/`upload-to-blob`/`concat=` |
| `FICHE-AUDIO.md` | on génère/aligne de l'audio, ou on cale un timing | commande `generate-narration`/`generate-sfx`/`forced-align`/`splice-segment`/`elevenlabs`/`minimax-music`, OU fichier `timing.ts`/`whisper-words*.ts`, OU contenu `<Audio`/`staticFile(*.mp3`/`sfx/`/`startFrom={` |

Le hook : `.claude/hooks/fiche-inject.sh`, branché dans `settings.json` sur **DEUX matchers : `Bash` ET
`Edit|Write`**. La branche Bash est indispensable — le storyboard et l'assemblage ne sont pas des éditions
de `.tsx` (l'un est un appel de script, l'autre un `ffmpeg`), ces 2 fiches ne se déclencheraient jamais sans elle.
Il **n'interdit rien** et sort toujours en 0. Plusieurs fiches peuvent se cumuler (un Short à globe
déclenche les trois premières).

## ⛔ Anti-répétition : la condition de viabilité
Chaque fiche n'est injectée **qu'une fois par fichier et par session** (sentinelles dans
`$TMPDIR/fiche-inject-<session_id>/`). **Ne jamais retirer ce mécanisme.**

**Coût RE-MESURÉ le 2026-08-17** (les 6 fiches pèsent 42 510 octets ≈ 10 600 tokens si toutes
injectées ; en pratique ~2 fiches se déclenchent par fichier, ≈ 3 250 tokens) :
- **jour typique** (7,5 fichiers touchés) : **~24 000 tokens**
- **pire jour observé** (28 fichiers) : **~91 000 tokens**

⚠️ Deux estimations antérieures écrites le même jour étaient FAUSSES et se contredisaient (4 500 dans
le hook, 18 000 ici) : toutes deux comptaient UNE fiche alors qu'elles se cumulent. **Toute
estimation de ce coût doit être re-mesurée par `wc -c`, jamais déduite.** Si une 7e fiche est ajoutée,
re-mesurer — le coût croît avec le nombre de fiches qui matchent le même fichier, pas avec leur nombre total.

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

**⛔ Couche 0 — le garde-fou contre l'OUBLI de capitaliser** (ajouté 2026-08-17, sur constat d'Aziz).
Les couches 3 (chroniqueur) et l'EXTRACTOR ne tournent **qu'en clôture, via `/wrap`**. Leur oubli est
SILENCIEUX — et le projet a deux précédents : le « Mécanisme 1 Gardien » conçu en détail puis oublié
des semaines, le circuit-breaker codé puis **mort le 2026-07-12 sans que personne ne le remarque
pendant un mois**. Un mécanisme de fin de session dont l'oubli ne fait aucun bruit finit par être oublié.
→ `scripts/tools/check-capitalisation.py` compare la date du dernier travail de production à celle de
la dernière capitalisation. Au-delà de **8 fichiers de scène ou 3 jours**, il alerte.
→ `.claude/hooks/session-start-capitalisation.sh` (branché sur `SessionStart`) l'injecte **au DÉBUT
de session** — là où on peut encore agir, pas en clôture quand le contexte est plein. Silencieux
quand tout est à jour, pour ne pas créer de bruit à chaque démarrage. Ne bloque jamais.

⚠️ Ne pas confondre avec l'**Extracteur** (`STUDIO-REUTILISABLE-GATE.md`, Mécanisme 2) : celui-là
parcourt le code pour remplir les catalogues de composants — un inventoriste. Il **n'existe pas
encore** sur disque (vérifié 2026-08-17). Les fiches ne dépendent pas de lui.

## Budget par fiche
**55 lignes par défaut.** Exceptions assumées, **chiffres re-mesurés le 2026-08-18 (fin de session)** (`wc -l`) :
`FICHE-CAMERA` **77** · `FICHE-SVG-DESSINE` **89** · `FICHE-STORYBOARD` **114**.
⚠️ Le budget d'exception affiché ici était de 80 et **deux fiches le dépassaient sans que ce soit
écrit** — un README qui annonce un budget que les fiches contredisent est la même classe d'erreur
que les fiches qui mentent. Plafond d'exception porté à **115**, à re-mesurer à chaque ajout. Raison : la caméra est le pain point n°1 mesuré du
projet (3 des 5 boucles les plus chères) et le storyboard est le levier qui déplace le jugement avant
le code (49 % de re-travail). Tailler la fiche la plus rentable pour respecter un budget rond serait
retirer de la valeur là où elle sert le plus. **Ces 2 exceptions ne se généralisent pas** : toute
autre fiche reste à 55, et une fiche qui déborde sans justification chiffrée se taille.
⚠️ Ce README n'est PAS injecté par le hook — il ne coûte aucun contexte, le budget ne s'y applique pas.

## Ajouter une fiche
1. Écrire `FICHE-<MOMENT>.md` ici (≤55 lignes — c'est un budget de contexte, pas une doctrine).
   Structure : briques existantes → interdits déjà payés (avec leur coût) → réflexes → « si ça rate 2× ».
2. Ajouter son déclencheur dans `.claude/hooks/fiche-inject.sh` (fonction `add_fiche`).
3. Tester : vrais positifs ET faux positifs, avant de brancher.
   **3 bis. Tester sur un fichier RÉEL du repo, pas un fragment** — 2 bugs trouvés ainsi : `grep -c`
   compte les LIGNES (faux sur un `new_string` mono-ligne), et `timing.ts` était rejeté par le filtre
   `.tsx` avant d'atteindre son test.
   **3 ter. Tester les FAUX positifs sur des commandes ordinaires** — `git commit -m "...narration..."`
   matchait le TEXTE du message et injectait une fiche entière à chaque commit.
4. **Re-mesurer le coût** (`wc -c` sur toutes les fiches) : il croît avec le nombre de fiches qui
   matchent LE MÊME fichier, pas avec leur nombre total. Ne jamais le déduire.

**Règle d'or** : une fiche ne contient que des règles **déjà payées** (une erreur réelle, un coût
documenté). Pas de règle théorique — c'est ce qui a fait gonfler `MEMORY.md` à son plafond.
