# memory/fiches/ — les fiches de déclenchement

## À quoi ça sert
Une fiche = **les règles d'UN moment de production**, injectées automatiquement dans le
contexte de l'agent **au moment où il code ce moment-là**.

Pourquoi ça existe : `MEMORY.md` est lu en début de session puis **oublié** au fil des heures.
Les hooks existants savent seulement **bloquer**, jamais **informer**. Les fiches sont la couche
manquante entre les deux — elles arrivent au bon moment, sans bloquer.

Cause d'échec n°1 mesurée par audit (2026-08-17) : **« brique existante non trouvée »**
(6 cas documentés, ~20 itérations perdues). Les règles existaient ; elles n'étaient pas retrouvées.

## Les fiches actuelles (14)
| Fiche | Se déclenche quand | Source du déclenchement |
|---|---|---|
| `FICHE-SVG-DESSINE.md` | on écrit du SVG dessiné dans un `.tsx` | ≥4 primitives OU un `d={`/`d="M`, avec ≥2 primitives (garde-fou anti-icône) |
| `FICHE-CLIP-GENERE.md` | on lance/prépare une génération de clip (MiniMax H3, Comfy Cloud) | commande `mkgraphs`/`mkprevis`/`graph-plan`/`previs*.gif`/`minimax_h3`/`MiniMaxH3`/`submit_workflow`/`comfy` |
| `FICHE-CAMERA.md` | on touche du code de caméra (D3, Mapbox ou SVG) | ≥2 motifs parmi `camAt`, `scaleMul`, `getCam`, `lerpCam`, `camFor`, `jumpTo`, `bearing`, `pitch:`, `interpolate(` |
| `FICHE-SHORT-VERTICAL.md` | on travaille sur une composition 9:16 | chemin contenant `short`/`9x16`/`vertical`, ou dimensions verticales |
| `FICHE-STORYBOARD.md` | on écrit un brief/breakdown, on lance un storyboard, **ou on reprend un STORYBOARD/PLAN hérité** | fichier `PROMPT-*`, `breakdown*` (**casse indifférente**, `-i` ajouté 2026-08-18) ou **`STORYBOARD-*`/`PLAN-*.md\|.txt`**, OU commande `storyboard-dual-gen`/`openrouter-img2img`/`openrouter-vision-breakdown`/`da-brief.py`/`da-compare.py` |
| `FICHE-RIG-ET-LOTTIE.md` | on rigge / exporte vers Lottie (chaîne SVG→Lottie) | commande `animate_scene`/`svg2lottie`/`livrer_piece`/`verifier_fidelite`/`group_layers`/`finir_piece`/`lottie-ui/tools` (hook L122) — extraite de `FICHE-GESTE-ANIME` le 2026-09-11 |
| `FICHE-PACKAGING.md` | on prépare le **titre / la miniature / la description** | commande `jury-titres`/`jury-thumbnail`/`gemini-thumbnail-(create\|edit)`/`gemini-cover-vertical`, OU fichier `thumbnails-library/*.{svg,tsx}` |
| `FICHE-ASSEMBLAGE.md` | on rend ou on concatène | commande `ffmpeg`/`render-mapbox.sh`/`remotion render`/`-FINAL.mp4`/`upload-to-blob`/`concat=` |
| `FICHE-MOCKUP-3D.md` | `_demos/devices/`, `PhoneModel`, `LaptopModel`, `GridBackdrop`, `FlatDevice`… | Mockup d'appareil 3D + UI plaquée dedans. Scindée de FICHE-UI-PRODUIT le 2026-08-26 (problème d'ADRESSAGE : elle ne se déclenchait jamais sur le code qu'elle documente). |
| `FICHE-UI-PRODUIT.md` | on simule un ECRAN / dashboard / app (pilier B2B n3) | chemin `live-page(-light)/`, `shotcraft-lib/`, `_client-sim/*(Promo|Dashboard|Screen|Mockup)`, OU commande `capture-northshield`/`capture-template`/`puppeteer`/`http.server 88`/`live-layout.json` |
| `FICHE-AUDIO.md` | on génère/aligne de l'audio, ou on cale un timing | commande `generate-narration`/`generate-sfx`/`forced-align`/`splice-segment`/`elevenlabs`/`minimax-music`, OU fichier `timing.ts`/`whisper-words*.ts`, OU contenu `<Audio`/`staticFile(*.mp3`/`sfx/`/`startFrom={` |
| `FICHE-BRIEF-CLIENT.md` | on trie/lit/répond à un **brief client freelance** (Upwork & co) **ou on code le livrable d'un contrat signé** | chemin contenant `client-sim`/`upwork`/`freelance-linkedin`/`BRIEF-CLIENT`/**`chill-meter`** — volontairement NARROW, zéro coût sur la production vidéo. ⚠️ Placée AVANT le filtre `.tsx` (cibles = `.md` ET `.tsx`) : 4e occurrence du même piège après `.svg`, `index.html`, `timing.ts`. ⛔⛔ **`chill-meter` ajouté le 2026-09-02 — 2e occurrence du défaut d'ADRESSAGE (après MOCKUP-3D)** : le CODE d'un contrat vit sous `src/projects/_rnd/<projet>/`, sa MÉMOIRE sous `client-sim-tests/` ; la fiche ne se déclenchait donc JAMAIS sur le code du seul contrat signé. Coût payé : sa règle « exiger l'ÉTAT NEUTRE quand la réf client montre l'état FINAL » absente du contexte au moment exact où j'ai fait une comparaison à état inégal (majeure partie d'une session) |
| `FICHE-GESTE-ANIME.md` | on écrit du code de **MOUVEMENT** (`spring`/`interpolate` sur position, échelle, opacité) OU on manipule une partition Lottie | 2 déclencheurs dans `fiche-inject.sh` : branche Bash-Lottie (L114-123) + branche mouvement (L263-265). ⚠️ **Absente de ce tableau pendant tout son cycle de vie** — détecté au wrap du 2026-09-02, alors que c'est la plus grosse des 13 (275 l.) |
| `FICHE-ARSENAL-SCENE.md` | On s'apprête à dessiner une primitive SVG sur une carte ou à poser un marqueur (`fiche-inject.sh:188`) | Dit ce qu'on POSSÈDE (jetons, cartouches, effets vivants, pièges d'import) — les autres fiches disent la méthode |

Le hook : `.claude/hooks/fiche-inject.sh`, branché dans `settings.json` sur **DEUX matchers : `Bash` ET
`Edit|Write`**. La branche Bash est indispensable — le storyboard et l'assemblage ne sont pas des éditions
de `.tsx` (l'un est un appel de script, l'autre un `ffmpeg`), ces 2 fiches ne se déclencheraient jamais sans elle.
Il **n'interdit rien** et sort toujours en 0. Plusieurs fiches peuvent se cumuler (un Short à globe
déclenche les trois premières).

## ⛔ Anti-répétition : la condition de viabilité
Chaque fiche n'est injectée **qu'une fois par fichier et par session** (sentinelles dans
`$TMPDIR/fiche-inject-<session_id>/`). **Ne jamais retirer ce mécanisme.**

**Coût RE-MESURÉ le 2026-09-11** (`ls memory/fiches/FICHE-*.md | wc -l` · `cat memory/fiches/FICHE-*.md | wc -c`) : les **14** fiches pèsent
**200 894 octets ≈ 50 200 tokens** si toutes injectées ; en pratique ~2-3 se déclenchent par fichier.
⛔⛔ Le chiffre précédent (11 fiches / 105 554 o, relevé le 23/08) était **faux de 77 %** : 2 fiches
n'étaient pas comptées, dont la plus grosse (`FICHE-GESTE-ANIME`, 275 l.). C'est exactement ce que
ce paragraphe interdit — « ne JAMAIS déduire ce chiffre, le re-mesurer ». Re-mesurer à CHAQUE wrap :
⭐ `FICHE-BRIEF-CLIENT` (**~3 240 tokens** — re-mesurée le 2026-08-26 après la refonte de la
section de tri, « stack d'abord, prix ensuite » ; était 1 361) n'aggrave PAS le jour typique : son déclencheur est NARROW
(chemins client-sim/upwork uniquement) et elle sort en anticipé sur les `.md`. Sur un `.tsx` de
`_client-sim/` elle se cumule normalement — **vérifié par test**, c'était un bug : une sortie
anticipée inconditionnelle court-circuitait SVG-DESSINE et ARSENAL-SCENE précisément là où leur
absence avait déjà coûté un livrable (Zambie, `GisementMarker` non trouvé).
- **jour typique** (7,5 fichiers touchés) : **~24 000 tokens**
- **pire jour observé** (28 fichiers) : **~91 000 tokens**

⚠️ Deux estimations antérieures écrites le même jour étaient FAUSSES et se contredisaient (4 500 dans
le hook, 18 000 ici) : toutes deux comptaient UNE fiche alors qu'elles se cumulent. **Toute
estimation de ce coût doit être re-mesurée par `wc -c`, jamais déduite.** Si une 7e fiche est ajoutée,
re-mesurer — le coût croît avec le nombre de fiches qui matchent le même fichier, pas avec leur nombre total.

## ⛔ COMMENT ÉVITER QUE CES FICHES PÉRIMENT

### ⛔⛔ Un `[OK]` de `check-fiches.py` ne prouve PAS que tous les chemins existent

Il prouve que ceux **que sa regex voit** existent. `PATH_RE` n'ancre que
`src|public|scripts|memory|out|tests|.claude` : un pointeur écrit `assets/scripts/...` ou `~/...`
sort du filtre et n'est jamais testé. Mesuré le 2026-09-11 : 14 fiches toutes `[OK]`, et pourtant
`assets/scripts/capture-template.mjs` (FICHE-UI-PRODUIT) était mort.

⭐ **Même famille que l'angle mort de `sections_closes()` corrigé le même jour** : la condition
était juste, le PÉRIMÈTRE trop étroit (`startswith("## ")` ne matchait que le niveau 2 — les 7
sections closes étaient en `###`, 7 787 o accumulés 4-6 semaines sans une alerte).

⭐ **La règle : un vérificateur se juge sur ce qu'il RATE, pas sur ce qu'il valide.** Lire sa regex
avant de croire son `[OK]`. Pour l'éprouver dans les deux sens :
`python3 scripts/tools/test-gate.py <hook.sh> --bloque "<cas>" --passe "<cas>"`.

### ⛔ Un CHIFFRE périme en silence — graver la commande à côté

`check-fiches.py` teste l'EXISTENCE d'un chemin, jamais la VALEUR d'un nombre. Mesuré le
2026-09-11 : « 160 SFX déjà produits » pour **49** réels · « 12 fichiers dépendent de `camAt()` »
pour **27** · « les 13 fiches » pour **14**.

Les deux premiers poussaient dans la direction dangereuse : le premier fait **chercher** une
bibliothèque 3× plus fournie qu'elle n'est (au lieu de générer), le second sous-estime de 2× le
seul argument qui protège `camAt()` d'une modification en place.

⭐ **Ne jamais graver un chiffre seul : graver la commande qui le re-mesure à côté.** C'est déjà
la doctrine du § Budget (« on ne corrige plus le chiffre, on MESURE ») — elle vaut pour TOUT
chiffre d'une fiche, pas seulement le comptage de lignes.

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
**55 lignes par défaut.** Exceptions assumées, **chiffres re-mesurés le 2026-08-20 (`wc -l`)** :
⛔⛔ **LA LISTE CHIFFREE A ETE SUPPRIMEE LE 2026-08-23 — elle a menti 4 wraps de suite.**
Un chiffre grave dans un fichier NON injecte redevient faux des que la fiche grossit. Le README
annoncait lui-meme « corriger le chiffre sans graver la commande garantit une 4e fois » : c'est
arrive. On ne corrige donc plus le chiffre, on MESURE :
```
for f in memory/fiches/FICHE-*.md; do printf "%-28s %s\n" "$(basename $f)" "$(wc -l < $f)"; done
```
Fiches **hors budget assumees** (le depassement est arbitre, pas subi) : `FICHE-CLIP-GENERE`
(R&D la plus active) · `FICHE-STORYBOARD` · `FICHE-UI-PRODUIT` · `FICHE-SVG-DESSINE` ·
`FICHE-CAMERA` · `FICHE-ARSENAL-SCENE` (⚠️ ajoutee le 2026-08-23 : elle depassait depuis
longtemps sans jamais avoir ete arbitree) · `FICHE-ASSEMBLAGE`.
⛔⛔ **MESURER AVEC `wc -l < fichier`** (redirection, PAS `wc -l fichier`). L'écart de +1 constaté
3 wraps de suite (2026-08-18, 08-20, 08-21) vient d'un comptage à la main ou d'une déduction —
jamais d'un artefact de `wc`. Corriger le chiffre sans graver la commande garantit une 4e fois.
⭐ CLIP-GENERE est passée de 170 à 212 le 2026-08-20 : +4 sections (style transposable à seed
constant, intention vs immobilité, EMPTY WALL LOCK, nos 3 registres maison) **moins** 15 lignes
taillées sur des problèmes déjà résolus plus bas dans la même fiche. C'est la fiche qui porte la
R&D la plus active du moment ; chacune de ses lignes est un essai payé.
⚠️ **Ces chiffres se re-mesurent à CHAQUE wrap** — un README qui annonce un budget que les fiches
contredisent est la même classe d'erreur que les fiches qui mentent. C'est arrivé 2× (2026-08-18,
puis 2026-08-20 : 4 fiches hors de leur chiffre déclaré). Ne pas re-déclarer un plafond « rond »
qu'on sait déjà faux.
**Pourquoi ces exceptions** : la caméra est le pain point n°1 du projet (3 des 5 boucles les plus
chères), le storyboard déplace le jugement avant le code (49 % de re-travail), CLIP-GENERE porte une
R&D active dont chaque ligne est un essai payé. Tailler la fiche la plus rentable pour un chiffre
rond serait retirer de la valeur là où elle sert le plus.
⛔ **Ce qui SE TAILLE**, en revanche : un bloc décrivant un problème RÉSOLU plus bas dans la même
fiche, une méthode explicitement « REMPLACÉE », une glose qui répète son propre titre. Fait le
2026-08-20 sur STORYBOARD (-4) et CLIP-GENERE (-4).
**Toute AUTRE fiche reste à 55** : une fiche qui déborde sans justification chiffrée se taille.
⚠️ Ce README n'est PAS injecté par le hook — il ne coûte aucun contexte, le budget ne s'y applique pas.

## Ajouter une fiche

⛔⛔ **Inscrire la fiche au tableau « Les fiches actuelles » ET re-mesurer le compte + le poids.**
2 occurrences du même oubli : `FICHE-GESTE-ANIME` absente du tableau « pendant tout son cycle de
vie » (2026-09-02), puis `FICHE-RIG-ET-LOTTIE` créée le 2026-09-11, branchée dans le hook, et
absente du tableau le jour même — le titre annonçait « (13) » pour 14 fiches.
⭐ Une fiche branchée dans le hook mais absente du tableau est **invisible** à qui lit le README
pour savoir ce qui existe.

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
