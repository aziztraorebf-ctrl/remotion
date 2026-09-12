# Un gate jamais vu se déclencher est indiscernable d'un gate mort

**Date** : 2026-09-11 · **Coût mesuré** : 7 787 o (31 % de PIPELINE.md) accumulés pendant
4 à 6 semaines sans une seule alerte.

## Ce qui s'est passé

`check-poids-contexte.py` porte une fonction `sections_closes()` censée signaler les projets
terminés qui traînent dans les fichiers d'action. Elle testait :

```python
if line.startswith("## ") and any(m in line for m in MARQUEURS_CLOS):
```

`"### "` **ne commence pas** par `"## "` — le 3e caractère est un `#`, pas une espace. Or dans
`PIPELINE.md` toutes les sections de projet sont en `###`. La fonction renvoyait donc une liste
vide sur un fichier qui contenait **7 sections closes**, dont certaines depuis le 31 juillet.

Pendant ce temps le fichier a grossi (+2 092 o en 4 jours) en accumulant une 8e section close.
La règle d'éviction existait, écrite dans le préambule du fichier lui-même. Le gate existait et
tournait à chaque démarrage. **L'instrument ne regardait simplement pas au bon niveau.**

## Pourquoi personne ne l'a vu

Un gate silencieux et un gate qui fonctionne produisent **exactement la même sortie** : rien.
Rien ne distingue « il n'y a pas de problème » de « je ne sais pas voir le problème ».

C'est le même schéma que [[tester-le-script-nest-pas-tester-le-branchement]], pris par l'autre
bout : là, le script marchait et le branchement manquait. Ici le branchement était bon, et c'est
la **condition** qui ne pouvait jamais être vraie.

## La règle

**Un gate n'est validé que par un cas réel sur lequel on l'a VU se déclencher.**

Concrètement, à chaque gate écrit ou modifié :

1. Le lancer sur un fichier **qui contient le problème** → il doit le trouver.
2. Le lancer sur un fichier **qui ne le contient pas** → il doit rester muet.
3. Garder la sauvegarde du cas positif (`/tmp/<fichier>-avant.md`) pour rejouer le test.

Un gate testé uniquement sur l'état courant — forcément sain, sinon on l'aurait corrigé — ne
prouve rien du tout.

## Corollaire : se méfier d'un gate qui n'a jamais rien dit

Un gate qui n'a jamais produit d'alerte depuis sa création est **suspect**, pas rassurant.
Lui fabriquer un cas positif, ou aller chercher dans git une version du fichier qui portait le
problème, et vérifier qu'il le voit.

Vaut aussi pour les seuils : voir [[mesurer-la-bonne-grandeur-pas-la-plus-facile]] — un plafond
que le code applique plus laxiste que la politique est un plafond qui n'existe pas.

## Le même jour, 2 autres angles morts du même type (2026-09-11)

`sections_closes()` regardait le bon fichier au mauvais NIVEAU de titre. Deux autres gates du
même chantier avaient le même défaut de forme — **une condition juste, appliquée à un périmètre
trop étroit** :

**1. `check-links.py` ne voyait que les chemins écrits EN ENTIER.** Un pointeur écrit
`` `feedback_hook-retention-premiere-minute.md` `` (sans son dossier `memory/feedbacks/`) est
introuvable pour qui le suit à la lettre, et **invisible pour le gate** : pas de `/`, donc pas
reconnu comme un chemin. Un scan manuel en a trouvé 8 ; le gate étendu en trouve **16**, sur
6 fichiers de navigation dont `CLAUDE.md` (2) et `NEXT-ACTION.md` (5).

**2. L'alerte de poids disait `CLAUDE.md` sans dire LEQUEL** — la chaîne en charge DEUX (projet
`remotion/` 33 520 o / seuil 34 000 ; global `~/.claude/` 16 070 o / seuil 18 000). Aziz a cru à
un dépassement du global ; aucun des deux n'était au-dessus de sa limite. Le même message
annonçait 206 lignes pour 205 réelles (`count("\n") + 1` comptant une ligne finale inexistante).

⭐ **La règle généralisée** : l'exactitude de la CONDITION ne suffit pas — vérifier aussi le
**PÉRIMÈTRE** (quels niveaux de titre, quelles formes d'écriture, quels fichiers homonymes) et
la **FORMULATION** du message. Trois questions sur tout gate :
- Sous quelles autres FORMES le problème peut-il s'écrire ? (`##` vs `###`, chemin complet vs nom nu)
- Si plusieurs fichiers portent ce nom, mon message dit-il LEQUEL ?
- Mon compte est-il juste à l'unité près ? (`wc -l` comme référence)

⭐ **Un instrument de mesure se lit à l'unité près ou il ne sert à rien.** Un décalage de 1
suffit à faire douter du chiffre entier, donc de l'instrument.

⭐ **Un rapport doit nommer le BON geste** : les noms nus sont rapportés SÉPARÉMENT des liens
morts, avec le chemin exact à écrire — ces fichiers EXISTENT, les dire « INTROUVABLES »
pousserait à les recréer ou à supprimer la ligne.

## L'outil qui rend ce test praticable

⛔ Ce test était impraticable à la main : la commande de TEST contient le motif surveillé, donc
le gate bloque son propre test (3 tentatives perdues sur `moteur-visuel-gate.sh`).

→ `python3 scripts/tools/test-gate.py <hook.sh> --bloque "<cmd>" --passe "<cmd>"`
Les cas transitent par stdin, jamais par une commande Bash portant le motif. L'outil avertit
quand aucun cas `--bloque` n'est fourni.

⭐ Il a déjà payé : `moteur-visuel-gate.sh`, que je soupçonnais d'un faux positif, est **correct
(6/6)**. Le faux positif venait de ma commande composée. Sans l'outil, je l'aurais « corrigé » à
tort, rouvrant le trou du 21/08.
